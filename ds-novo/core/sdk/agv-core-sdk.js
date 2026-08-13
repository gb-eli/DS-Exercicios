// AGV Education Core SDK — v0.2.0
// Cliente público. Nunca contém service_role/secret.

const CORE_VERSION = '0.2.0';
const ALLOWED_PROGRESS_EVENTS = new Set([
  'session.started','session.ended','activity.started','activity.progress',
  'activity.completed','evidence.submitted','reward.claimed'
]);

export class AGVCoreError extends Error {
  constructor(message, { code='AGV_CORE_ERROR', cause=null, details=null }={}) {
    super(message);
    this.name='AGVCoreError';
    this.code=code;
    this.cause=cause;
    this.details=details;
  }
}

function requireText(value,name){
  const v=String(value??'').trim();
  if(!v)throw new AGVCoreError(`${name} obrigatório`,{code:'INVALID_ARGUMENT'});
  return v;
}
function uuid(){
  if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();
  return `agv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
function now(){return new Date().toISOString()}
function safeStorage(){
  try{return globalThis.localStorage||null}catch{return null}
}

export class AGVCoreSDK {
  constructor({supabase,platformId,platformVersion='unknown',integrationVersion=CORE_VERSION,queueKey=null}={}){
    if(!supabase)throw new AGVCoreError('supabase client obrigatório',{code:'CONFIG_REQUIRED'});
    this.supabase=supabase;
    this.platformId=requireText(platformId,'platformId');
    this.platformVersion=String(platformVersion||'unknown');
    this.integrationVersion=String(integrationVersion||CORE_VERSION);
    this.queueKey=queueKey||`agv-core-progress-queue:${this.platformId}`;
    this.storage=safeStorage();
  }

  get version(){return CORE_VERSION}
  createIdempotencyKey(scope='event'){return `${this.platformId}:${scope}:${uuid()}`}

  async _invoke(name,body){
    const {data,error}=await this.supabase.functions.invoke(name,{body});
    if(error||data?.error){
      throw new AGVCoreError(data?.message||data?.error||error?.message||`Falha em ${name}`,{
        code:data?.code||data?.error||'EDGE_FUNCTION_ERROR',cause:error,details:data||null
      });
    }
    return data||{};
  }
  async _user(){
    const {data,error}=await this.supabase.auth.getUser();
    if(error||!data?.user)throw new AGVCoreError('Usuário não autenticado',{code:'NOT_AUTHENTICATED',cause:error});
    return data.user;
  }

  auth={
    signIn:async(email,password)=>{
      const {data,error}=await this.supabase.auth.signInWithPassword({email:requireText(email,'email'),password:requireText(password,'password')});
      if(error)throw new AGVCoreError(error.message,{code:'AUTH_FAILED',cause:error});
      return data;
    },
    signOut:async()=>{
      const {error}=await this.supabase.auth.signOut();
      if(error)throw new AGVCoreError(error.message,{code:'SIGNOUT_FAILED',cause:error});
      return true;
    },
    me:async()=>this._user(),
    session:async()=>{
      const {data,error}=await this.supabase.auth.getSession();
      if(error)throw new AGVCoreError(error.message,{code:'SESSION_FAILED',cause:error});
      return data.session||null;
    },
    profile:async()=>{
      const user=await this._user();
      const {data,error}=await this.supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
      if(error)throw new AGVCoreError(error.message,{code:'PROFILE_READ_FAILED',cause:error});
      return data;
    }
  };

  _progressEnvelope({activityId=null,eventType,progress=null,score=null,payload={},idempotencyKey=null,eventId=null,occurredAt=null}={}){
    eventType=requireText(eventType,'eventType');
    if(!ALLOWED_PROGRESS_EVENTS.has(eventType))throw new AGVCoreError(`eventType não suportado: ${eventType}`,{code:'INVALID_EVENT_TYPE'});
    if(progress!==null&&(Number(progress)<0||Number(progress)>100))throw new AGVCoreError('progress deve estar entre 0 e 100',{code:'INVALID_PROGRESS'});
    return {
      eventId:eventId||uuid(),
      idempotencyKey:idempotencyKey||this.createIdempotencyKey(eventType),
      platformId:this.platformId,
      activityId:activityId?String(activityId):null,
      eventType,
      occurredAt:occurredAt||now(),
      progress:progress===null?null:Number(progress),
      score:score===null?null:Number(score),
      payload:{...payload,client:{platformVersion:this.platformVersion,integrationVersion:this.integrationVersion}}
    };
  }
  _readQueue(){
    if(!this.storage)return[];
    try{return JSON.parse(this.storage.getItem(this.queueKey)||'[]')}catch{return[]}
  }
  _writeQueue(queue){
    if(!this.storage)return;
    try{this.storage.setItem(this.queueKey,JSON.stringify(queue.slice(-200)))}catch{}
  }

  progress={
    report:async(input)=>{
      const envelope=this._progressEnvelope(input);
      return this._invoke('agv-progress-event',envelope);
    },
    reportOrQueue:async(input)=>{
      const envelope=this._progressEnvelope(input);
      try{return await this._invoke('agv-progress-event',envelope)}
      catch(error){
        if(error.code==='NOT_AUTHENTICATED'||error.code==='INVALID_EVENT_TYPE')throw error;
        const q=this._readQueue();
        if(!q.some(x=>x.idempotencyKey===envelope.idempotencyKey))q.push(envelope);
        this._writeQueue(q);
        return {ok:false,queued:true,idempotencyKey:envelope.idempotencyKey,error:error.message};
      }
    },
    flushQueue:async()=>{
      const queue=this._readQueue(),remaining=[],results=[];
      for(const event of queue){
        try{results.push(await this._invoke('agv-progress-event',event))}
        catch(error){remaining.push(event);results.push({ok:false,error:error.message,idempotencyKey:event.idempotencyKey})}
      }
      this._writeQueue(remaining);
      return {processed:queue.length-remaining.length,remaining:remaining.length,results};
    }
  };

  rewards={
    // Não aceita amount como autoridade. O servidor resolve a regra oficial.
    claim:async({activityId=null,eventType,evidenceId=null,attemptId=null,metadata={},idempotencyKey=null}={})=>{
      eventType=requireText(eventType,'eventType');
      return this._invoke('agv-reward-claim',{
        platformId:this.platformId,
        activityId:activityId?String(activityId):null,
        eventType,
        evidenceId:evidenceId?String(evidenceId):null,
        attemptId:attemptId?String(attemptId):null,
        metadata:{...metadata,client:{platformVersion:this.platformVersion,integrationVersion:this.integrationVersion}},
        idempotencyKey:idempotencyKey||this.createIdempotencyKey(`reward:${eventType}`)
      });
    }
  };

  wallet={
    getSummary:async()=>{
      const user=await this._user();
      const {data,error}=await this.supabase.from('wallets').select('balance,lifetime_earned,lifetime_spent,status,updated_at').eq('user_id',user.id).single();
      if(error)throw new AGVCoreError(error.message,{code:'WALLET_READ_FAILED',cause:error});
      return data;
    },
    getLedger:async({limit=50,before=null}={})=>{
      const user=await this._user();
      let q=this.supabase.from('wallet_ledger').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(Math.min(200,Math.max(1,Number(limit)||50)));
      if(before)q=q.lt('created_at',before);
      const {data,error}=await q;
      if(error)throw new AGVCoreError(error.message,{code:'LEDGER_READ_FAILED',cause:error});
      return data||[];
    },
    createTransferIntent:async({toUserId,amount,idempotencyKey=null})=>{
      const {data,error}=await this.supabase.rpc('request_coin_transfer',{p_to_user_id:requireText(toUserId,'toUserId'),p_amount:Number(amount),p_idempotency_key:idempotencyKey||this.createIdempotencyKey('transfer')});
      if(error)throw new AGVCoreError(error.message,{code:'TRANSFER_INTENT_FAILED',cause:error});
      return data;
    },
    confirmTransfer:async(intentId)=>{
      const {data,error}=await this.supabase.rpc('confirm_coin_transfer',{p_intent_id:requireText(intentId,'intentId')});
      if(error)throw new AGVCoreError(error.message,{code:'TRANSFER_CONFIRM_FAILED',cause:error});
      return data;
    }
  };

  store={
    list:async()=>{
      const {data,error}=await this.supabase.from('store_items').select('*').eq('is_active',true).order('name');
      if(error)throw new AGVCoreError(error.message,{code:'STORE_LIST_FAILED',cause:error});
      return data||[];
    },
    createPurchaseIntent:async({itemId,idempotencyKey=null})=>{
      const {data,error}=await this.supabase.rpc('request_store_purchase',{p_item_id:requireText(itemId,'itemId'),p_idempotency_key:idempotencyKey||this.createIdempotencyKey('store-purchase')});
      if(error)throw new AGVCoreError(error.message,{code:'STORE_INTENT_FAILED',cause:error});
      return data;
    },
    confirmPurchase:async(intentId)=>{
      const {data,error}=await this.supabase.rpc('confirm_store_purchase',{p_intent_id:requireText(intentId,'intentId')});
      if(error)throw new AGVCoreError(error.message,{code:'STORE_CONFIRM_FAILED',cause:error});
      return data;
    }
  };

  inventory={
    mine:async()=>{
      const user=await this._user();
      const {data,error}=await this.supabase.from('inventory_instances').select('*,store_items(*)').eq('owner_user_id',user.id).order('acquired_at',{ascending:false});
      if(error)throw new AGVCoreError(error.message,{code:'INVENTORY_READ_FAILED',cause:error});
      return data||[];
    }
  };

  marketplace={
    list:async()=>{
      const {data,error}=await this.supabase.from('marketplace_listings').select('*').eq('status','active').order('created_at',{ascending:false});
      if(error)throw new AGVCoreError(error.message,{code:'MARKET_LIST_FAILED',cause:error});
      return data||[];
    },
    createListing:async({inventoryInstanceId,askingPrice})=>{
      const {data,error}=await this.supabase.rpc('create_marketplace_listing',{p_inventory_instance_id:requireText(inventoryInstanceId,'inventoryInstanceId'),p_asking_price:Number(askingPrice)});
      if(error)throw new AGVCoreError(error.message,{code:'MARKET_CREATE_FAILED',cause:error});
      return data;
    },
    cancelListing:async(listingId)=>{
      const {data,error}=await this.supabase.rpc('cancel_marketplace_listing',{p_listing_id:requireText(listingId,'listingId')});
      if(error)throw new AGVCoreError(error.message,{code:'MARKET_CANCEL_FAILED',cause:error});
      return data;
    },
    createPurchaseIntent:async({listingId,idempotencyKey=null})=>{
      const {data,error}=await this.supabase.rpc('request_market_purchase',{p_listing_id:requireText(listingId,'listingId'),p_idempotency_key:idempotencyKey||this.createIdempotencyKey('market-purchase')});
      if(error)throw new AGVCoreError(error.message,{code:'MARKET_INTENT_FAILED',cause:error});
      return data;
    },
    confirmPurchase:async(intentId)=>{
      const {data,error}=await this.supabase.rpc('confirm_market_purchase',{p_intent_id:requireText(intentId,'intentId')});
      if(error)throw new AGVCoreError(error.message,{code:'MARKET_CONFIRM_FAILED',cause:error});
      return data;
    }
  };

  health={
    check:async()=>{
      const session=await this.auth.session();
      return {coreVersion:CORE_VERSION,platformId:this.platformId,authenticated:Boolean(session?.user),queueSize:this._readQueue().length};
    }
  };
}

export function createAGVCore(options){return new AGVCoreSDK(options)}
export { CORE_VERSION };

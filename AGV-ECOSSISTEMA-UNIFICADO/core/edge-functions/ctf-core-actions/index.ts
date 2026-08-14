import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PLATFORM_CODE='ctf-ds';
const TZ='America/Sao_Paulo';
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
const TOOL_IDS=new Set(['immersive-server','immersive-soc','immersive-network','immersive-satellite','immersive-app','immersive-forensic','immersive-mobile','immersive-incident','sim-email','sim-browser','sim-mobile','sim-loglab','sim-netscan','sim-soc','base64','caesar','binary','hex','rot13','hash','json','jwt','url','password','logs','headers','risk']);
const STORE=Object.freeze([
{id:'theme-neon',type:'theme',name:'Neon Sentinel',price:0,rarity:'Comum'},
{id:'theme-crimson',type:'theme',name:'Red Protocol',price:260,rarity:'Raro'},
{id:'theme-violet',type:'theme',name:'Quantum Violet',price:300,rarity:'Raro'},
{id:'theme-amber',type:'theme',name:'SOC Amber',price:240,rarity:'Comum'},
{id:'avatar-ghost',type:'avatar',name:'Ghost',price:0,rarity:'Comum'},
{id:'avatar-shield',type:'avatar',name:'Sentinel',price:180,rarity:'Comum'},
{id:'avatar-raven',type:'avatar',name:'Raven',price:220,rarity:'Raro'},
{id:'avatar-cipher',type:'avatar',name:'Cipher',price:260,rarity:'Raro'},
{id:'effect-matrix',type:'effect',name:'Matrix Rain',price:0,rarity:'Comum'},
{id:'effect-lightning',type:'effect',name:'Neon Lightning',price:320,rarity:'Épico'},
{id:'effect-glitch',type:'effect',name:'Glitch Burst',price:280,rarity:'Raro'}
]);
const FREE_IDS=new Set(STORE.filter(x=>x.price===0).map(x=>x.id));
const HINT_COST:Record<string,number>={'Recruta':0,'Básico':0,'Iniciante':5,'Intermediário':15,'Avançado':25,'Especialista':40};
const localDay=(date=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);

async function context(req:Request){
 const auth=req.headers.get('Authorization')||'';
 const url=Deno.env.get('SUPABASE_URL')!;
 const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
 const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
 const{data:{user},error}=await userClient.auth.getUser();
 if(error||!user)throw Object.assign(new Error('unauthorized'),{status:401});
 const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const{data:platform}=await admin.from('platforms').select('id').eq('code',PLATFORM_CODE).eq('active',true).maybeSingle();
 if(!platform)throw new Error('platform_not_registered');
 return{user,admin,platformId:platform.id};
}

async function totals(admin:any,userId:string){
 const[{data:wallet},{data:metrics}]=await Promise.all([
   admin.from('wallets').select('balance,lifetime_earned,lifetime_spent,status').eq('user_id',userId).maybeSingle(),
   admin.from('metric_ledger').select('metric,delta').eq('user_id',userId)
 ]);
 const out={xp:0,points:0};
 for(const row of metrics||[]){if(row.metric==='xp')out.xp+=Number(row.delta||0);if(row.metric==='points')out.points+=Number(row.delta||0)}
 return{wallet:wallet||{balance:0,lifetime_earned:0,lifetime_spent:0,status:'active'},metrics:out};
}

async function storeState(admin:any,userId:string,platformId:string){
 const{data:rows}=await admin.from('wallet_ledger').select('id,entry_type,direction,amount,balance_after,created_at,metadata').eq('user_id',userId).eq('platform_id',platformId).eq('entry_type','store_purchase').order('created_at',{ascending:false}).limit(100);
 const owned=new Set(FREE_IDS);
 for(const row of rows||[]){const id=String(row.metadata?.item_id||'');if(id)owned.add(id)}
 return{catalog:STORE,ownedItemIds:[...owned],transactions:rows||[]};
}

async function dailyState(admin:any,userId:string,platformId:string,claim=true){
 const date=localDay();
 const since=new Date(Date.now()-36*3600000).toISOString();
 const{data:events}=await admin.from('progress_events').select('activity_id,event_type,occurred_at,payload').eq('user_id',userId).eq('platform_id',platformId).gte('occurred_at',since).order('occurred_at',{ascending:false});
 const today=(events||[]).filter((e:any)=>localDay(new Date(e.occurred_at))===date);
 const missions=today.filter((e:any)=>String(e.activity_id||'').startsWith('challenge:')&&e.event_type==='activity.completed').length;
 const lessons=today.filter((e:any)=>String(e.activity_id||'').startsWith('lesson:')&&['activity.completed','lesson.reviewed'].includes(e.event_type)).length;
 const tools=today.filter((e:any)=>e.event_type==='tool.used').length;
 const complete=missions>=1&&lessons>=1&&tools>=1;
 let reward=null;
 if(complete&&claim){
   const base=`ctf:daily:${date}:${userId}`;
   await admin.rpc('record_core_progress_event',{p_user_id:userId,p_platform_code:PLATFORM_CODE,p_activity_id:'daily-objective',p_event_type:'activity.completed',p_progress:100,p_score:null,p_payload:{date,timezone:TZ,missions,lessons,tools},p_idempotency_key:`${base}:progress`,p_occurred_at:new Date().toISOString()});
   const{data,error}=await admin.rpc('claim_core_reward_service',{p_user_id:userId,p_platform_code:PLATFORM_CODE,p_activity_id:'daily-objective',p_event_type:'daily.completed',p_evidence_id:`server-daily:${date}`,p_attempt_id:date,p_metadata:{date,timezone:TZ,missions,lessons,tools},p_idempotency_key:`${base}:reward`});
   if(!error)reward=data;
 }
 return{date,timezone:TZ,missions,lessons,tools,complete,claimed:Boolean(reward),reward};
}

async function fullState(admin:any,userId:string,platformId:string){
 const[{data:catalog},{data:progress},{data:hints},economy,store,daily]=await Promise.all([
  admin.from('activity_catalog').select('activity_id,name,reward_policy,metadata').eq('platform_id',platformId).eq('active',true),
  admin.from('activity_progress').select('activity_id,status,progress,best_score,completed_at,updated_at').eq('platform_id',platformId).eq('user_id',userId),
  admin.from('metric_ledger').select('activity_id,reason').eq('user_id',userId).eq('platform_id',platformId).eq('reason','hint.used'),
  totals(admin,userId),storeState(admin,userId,platformId),dailyState(admin,userId,platformId,false)
 ]);
 return{catalog:catalog||[],progress:progress||[],hintChallengeIds:[...new Set((hints||[]).map((x:any)=>String(x.activity_id||'').replace(/^challenge:/,'')))],...economy,store,daily};
}

Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'method_not_allowed'},405);
 try{
  const{user,admin,platformId}=await context(req);
  const body=await req.json();
  const action=String(body.action||'');
  if(action==='state')return json(await fullState(admin,user.id,platformId));

  if(action==='lesson_start'||action==='lesson_complete'){
   const lessonId=String(body.lessonId||'');const activityId=`lesson:${lessonId}`;
   const{data:lesson}=await admin.from('activity_catalog').select('activity_id,metadata,active').eq('platform_id',platformId).eq('activity_id',activityId).maybeSingle();
   if(!lesson?.active||lesson.metadata?.kind!=='lesson')return json({error:'lesson_not_registered'},404);
   const base=`ctf:lesson:${lessonId}:${user.id}`;
   if(action==='lesson_start'){
    const{data,error}=await admin.rpc('record_core_progress_event',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:'activity.started',p_progress:0,p_score:null,p_payload:{source:'ctf-core-actions'},p_idempotency_key:`${base}:start`,p_occurred_at:new Date().toISOString()});
    if(error)return json({error:'lesson_start_rejected',message:error.message},400);
    return json({ok:true,progress:data});
   }
   const{data:existing}=await admin.from('activity_progress').select('status').eq('user_id',user.id).eq('platform_id',platformId).eq('activity_id',activityId).maybeSingle();
   if(!existing)return json({error:'lesson_not_started'},409);
   let reward=null;
   if(existing.status!=='completed'){
    const{error:pe}=await admin.rpc('record_core_progress_event',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:'activity.completed',p_progress:100,p_score:null,p_payload:{source:'ctf-core-actions'},p_idempotency_key:`${base}:complete`,p_occurred_at:new Date().toISOString()});
    if(pe)return json({error:'lesson_progress_rejected',message:pe.message},400);
    const{data:rw,error:re}=await admin.rpc('claim_core_reward_service',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:'lesson.completed',p_evidence_id:`server-lesson:${lessonId}`,p_attempt_id:'first-completion',p_metadata:{source:'ctf-core-actions'},p_idempotency_key:`${base}:reward`});
    if(re)return json({error:'lesson_reward_rejected',message:re.message},400);
    reward=rw;
   }else{
    await admin.rpc('record_core_progress_event',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:'lesson.reviewed',p_progress:100,p_score:null,p_payload:{source:'ctf-core-actions'},p_idempotency_key:`ctf:lesson-review:${lessonId}:${user.id}:${crypto.randomUUID()}`,p_occurred_at:new Date().toISOString()});
   }
   const daily=await dailyState(admin,user.id,platformId,true);
   return json({ok:true,alreadyCompleted:existing.status==='completed',reward,daily,...await totals(admin,user.id)});
  }

  if(action==='tool_used'){
   const toolId=String(body.toolId||'');if(!TOOL_IDS.has(toolId))return json({error:'tool_not_registered'},400);
   const eventId=String(body.eventId||crypto.randomUUID());
   const{data,error}=await admin.rpc('record_core_progress_event',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:null,p_event_type:'tool.used',p_progress:null,p_score:null,p_payload:{toolId},p_idempotency_key:`ctf:tool:${user.id}:${eventId}`,p_occurred_at:new Date().toISOString()});
   if(error)return json({error:'tool_event_rejected',message:error.message},400);
   return json({ok:true,event:data,daily:await dailyState(admin,user.id,platformId,true),...await totals(admin,user.id)});
  }

  if(action==='daily_sync')return json({ok:true,daily:await dailyState(admin,user.id,platformId,true),...await totals(admin,user.id)});

  if(action==='hint'){
   const challengeId=String(body.challengeId||'');
   const{data:challenge}=await admin.from('activity_catalog').select('metadata,active').eq('platform_id',platformId).eq('activity_id',`challenge:${challengeId}`).maybeSingle();
   if(!challenge?.active)return json({error:'challenge_not_registered'},404);
   const difficulty=String(challenge.metadata?.difficulty||'');const cost=HINT_COST[difficulty];
   if(cost===undefined)return json({error:'hint_cost_not_defined'},400);
   const{data,error}=await admin.rpc('ctf_spend_xp_service',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_challenge_id:challengeId,p_cost:cost,p_idempotency_key:`ctf:hint:${challengeId}:${user.id}`});
   if(error)return json({error:error.message==='insufficient_xp'?'insufficient_xp':'hint_rejected',message:error.message,cost},error.message==='insufficient_xp'?409:400);
   return json({ok:true,cost,...data});
  }

  if(action==='store_state')return json({ok:true,...await storeState(admin,user.id,platformId),...await totals(admin,user.id)});

  if(action==='store_purchase'){
   const itemId=String(body.itemId||'');const item=STORE.find(x=>x.id===itemId);
   if(!item)return json({error:'store_item_not_registered'},404);
   if(item.price===0)return json({ok:true,owned:true,free:true,itemId,...await storeState(admin,user.id,platformId),...await totals(admin,user.id)});
   const{data,error}=await admin.rpc('ctf_store_purchase_service',{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_item_id:item.id,p_price:item.price,p_idempotency_key:`ctf:store:${item.id}:${user.id}`,p_metadata:{item_id:item.id,type:item.type,name:item.name,price:item.price,rarity:item.rarity,catalog_version:'1.1.0'}});
   if(error)return json({error:error.message==='insufficient_balance'?'insufficient_balance':'purchase_rejected',message:error.message},error.message==='insufficient_balance'?409:400);
   return json({ok:true,purchase:data,...await storeState(admin,user.id,platformId),...await totals(admin,user.id)});
  }
  return json({error:'unknown_action'},400);
 }catch(error){const status=Number((error as any)?.status||500);return json({error:status===401?'unauthorized':'internal_error',message:String((error as Error)?.message||error)},status)}
});

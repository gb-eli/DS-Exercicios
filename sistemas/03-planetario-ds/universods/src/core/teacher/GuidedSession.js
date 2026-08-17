const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class GuidedSession {
  constructor(plan, options={}) {
    this.schema='cosmos-ds-guided-session-v1';
    this.plan=plan;
    this.id=options.id || `session-${Date.now()}`;
    this.profileId=options.profileId || 'unknown';
    this.state=options.state || 'READY';
    this.startedAt=options.startedAt || null;
    this.finishedAt=options.finishedAt || null;
    this.lastTick=options.lastTick || null;
    this.lastActivityAt=options.lastActivityAt || null;
    this.activeMs=Number(options.activeMs || 0);
    this.idleMs=Number(options.idleMs || 0);
    this.idleThresholdMs=Number(options.idleThresholdMs || 180000);
    this.idleWarnings=Number(options.idleWarnings || 0);
    this.lastWarningBucket=Number(options.lastWarningBucket || 0);
    this.maxIdleWarnings=Number(options.maxIdleWarnings || 3);
    this.checkpoints=new Map((options.checkpoints||[]).map(item=>[item.id,{...item}]));
    this.events=(options.events||[]).map(item=>({...item}));
    this.earlyRelease=options.earlyRelease ? {...options.earlyRelease} : null;
    this.result=options.result ? {...options.result} : null;
  }
  now(value){return Number(value ?? Date.now());}
  log(type, detail={}, at=Date.now()){
    this.events.push({id:`evt-${this.events.length+1}`,type,detail,at:new Date(at).toISOString()});
    if(this.events.length>500)this.events.splice(0,this.events.length-500);
  }
  start(at=Date.now()){
    if(this.state!=='READY'&&this.state!=='PAUSED')return false;
    const now=this.now(at);
    if(!this.startedAt)this.startedAt=new Date(now).toISOString();
    this.state='ACTIVE';this.lastTick=now;this.lastActivityAt=now;this.log('session-started',{},now);return true;
  }
  pause(at=Date.now()){
    if(this.state!=='ACTIVE')return false;
    this.tick(at);this.state='PAUSED';this.log('session-paused',{},this.now(at));return true;
  }
  resume(at=Date.now()){
    if(this.state!=='PAUSED')return false;
    const now=this.now(at);this.state='ACTIVE';this.lastTick=now;this.lastActivityAt=now;this.log('session-resumed',{},now);return true;
  }
  tick(at=Date.now()){
    const now=this.now(at);
    if(this.state!=='ACTIVE'){this.lastTick=now;return this.snapshot();}
    if(this.lastTick===null){this.lastTick=now;this.lastActivityAt=now;return this.snapshot();}
    const delta=clamp(now-this.lastTick,0,60000);
    const idleFor=Math.max(0,now-(this.lastActivityAt??now));
    if(idleFor>=this.idleThresholdMs){
      this.idleMs+=delta;
      const bucket=Math.floor(idleFor/this.idleThresholdMs);
      if(bucket>this.lastWarningBucket){
        this.lastWarningBucket=bucket;
        this.idleWarnings=Math.min(this.maxIdleWarnings,this.idleWarnings+1);
        this.log('idle-warning',{warning:this.idleWarnings,idleForMs:idleFor},now);
        if(this.idleWarnings>=this.maxIdleWarnings){this.state='TERMINATED';this.finishedAt=new Date(now).toISOString();this.log('session-terminated',{reason:'idle-limit'},now);}
      }
    }else this.activeMs+=delta;
    this.lastTick=now;
    return this.snapshot();
  }
  activity(type='interaction',detail={},at=Date.now()){
    const now=this.now(at);this.tick(now);
    if(this.state!=='ACTIVE')return false;
    this.lastActivityAt=now;this.lastWarningBucket=0;this.log('activity',{type,...detail},now);return true;
  }
  completeCheckpoint(id,evidence='',at=Date.now()){
    if(this.state!=='ACTIVE')return {ok:false,reason:'A sessão não está ativa.'};
    const index=this.plan.checkpoints.findIndex(item=>item.id===id);
    if(index<0)return {ok:false,reason:'Checkpoint inexistente.'};
    const previous=this.plan.checkpoints.slice(0,index);
    if(previous.some(item=>!this.checkpoints.has(item.id)))return {ok:false,reason:'Conclua os checkpoints anteriores.'};
    if(this.checkpoints.has(id))return {ok:false,reason:'Checkpoint já concluído.'};
    const now=this.now(at);this.activity('checkpoint',{id},now);
    const item={id,evidence:String(evidence||this.plan.checkpoints[index].evidence).slice(0,1000),completedAt:new Date(now).toISOString(),order:index+1};
    this.checkpoints.set(id,item);this.log('checkpoint-completed',item,now);return {ok:true,item};
  }
  authorizeEarlyRelease({code,reason,at=Date.now()}){
    const cleanReason=String(reason??'').trim();
    if(String(code??'').trim().toUpperCase()!==this.plan.teacherCode)return {ok:false,reason:'Código de autorização incorreto.'};
    if(cleanReason.length<10)return {ok:false,reason:'Registre um motivo com pelo menos 10 caracteres.'};
    const now=this.now(at);this.earlyRelease={reason:cleanReason.slice(0,500),authorizedAt:new Date(now).toISOString(),codeVerified:true};
    this.log('early-release-authorized',{reason:this.earlyRelease.reason},now);return {ok:true};
  }
  progress(){return {completed:this.checkpoints.size,total:this.plan.checkpoints.length,percent:Math.round(this.checkpoints.size/this.plan.checkpoints.length*100)};}
  canFinish(){
    const reasons=[];
    if(this.checkpoints.size<this.plan.checkpoints.length)reasons.push('Existem checkpoints pendentes.');
    const minimumMs=this.plan.durationMinutes*60000;
    if(this.activeMs<minimumMs&&!this.earlyRelease)reasons.push(`Tempo ativo mínimo: ${this.plan.durationMinutes} minutos.`);
    if(this.state==='TERMINATED')reasons.push('Sessão encerrada por inatividade.');
    return {ok:reasons.length===0,reasons,minimumMs,remainingMs:Math.max(0,minimumMs-this.activeMs)};
  }
  finish(at=Date.now()){
    const check=this.canFinish();if(!check.ok)return {ok:false,reasons:check.reasons};
    const now=this.now(at);this.tick(now);this.state='COMPLETED';this.finishedAt=new Date(now).toISOString();
    this.result={activeMs:this.activeMs,idleMs:this.idleMs,idleWarnings:this.idleWarnings,earlyRelease:Boolean(this.earlyRelease),checkpoints:this.checkpoints.size};
    this.log('session-completed',this.result,now);return {ok:true,result:{...this.result}};
  }
  snapshot(){return {
    schema:this.schema,id:this.id,profileId:this.profileId,state:this.state,startedAt:this.startedAt,finishedAt:this.finishedAt,
    lastTick:this.lastTick,lastActivityAt:this.lastActivityAt,activeMs:this.activeMs,idleMs:this.idleMs,idleThresholdMs:this.idleThresholdMs,
    idleWarnings:this.idleWarnings,lastWarningBucket:this.lastWarningBucket,maxIdleWarnings:this.maxIdleWarnings,
    checkpoints:[...this.checkpoints.values()].map(item=>({...item})),events:this.events.map(item=>({...item})),
    earlyRelease:this.earlyRelease?{...this.earlyRelease}:null,result:this.result?{...this.result}:null,planId:this.plan.id
  };}
  static restore(plan,snapshot){if(snapshot?.schema!=='cosmos-ds-guided-session-v1')throw new Error('Sessão incompatível.');return new GuidedSession(plan,snapshot);}
}

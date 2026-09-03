import { createNetworkEnvelope, isNetworkEnvelope, networkEnvelopeFresh, networkEnvelopeKey, sanitizeInteractionPayload } from './network-protocol.js?v=14.10.8.96-f9414-network-manager';
import { normalizeTransport } from './transport-contract.js?v=14.10.8.96-f9414-network-manager';

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const withTimeout=(promise,ms,code='network_timeout')=>{let timer;return Promise.race([Promise.resolve(promise),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(code)),ms);})]).finally(()=>clearTimeout(timer));};

export function createNetworkManager({transports=[],getContext=()=>({}),getPlayerPacket=null,onTransition=()=>{},onDiagnostic=()=>{},connectTimeoutMs=6000,monitorIntervalMs=5000,failbackIntervalMs=15000,minModeHoldMs=12000,failureThreshold=2,dedupeTtlMs=20000}={}){
  const stack=transports.map((transport,index)=>normalizeTransport(transport,{priority:index*10+10})).sort((a,b)=>a.priority-b.priority);
  const handlers=new Map();const dedupe=new Map();const perTransportFailures=new Map();
  let active=null,started=false,stopped=false,monitorTimer=null,seq=0,transitionRevision=0,lastTransitionAt=0,lastFailbackProbeAt=0,playerTimer=null,lastPlayerSentAt=0,lastPlayerFullAt=0,lastPlayerSig='',sent=0,received=0,droppedDuplicate=0,droppedStale=0,droppedScope=0,failovers=0,failbacks=0;
  const diagnosticsLog=[];
  function context(){const raw=getContext?.()||{};return{userId:String(raw.userId||''),worldId:String(raw.worldId||''),area:String(raw.area||''),sessionId:String(raw.sessionId||'')};}
  function diag(event,data={}){const row={t:Date.now(),event,...data};diagnosticsLog.push(row);if(diagnosticsLog.length>80)diagnosticsLog.shift();try{onDiagnostic(row)}catch(_){}return row;}
  function emit(type,envelope){for(const fn of handlers.get(type)||[])try{fn(envelope)}catch(error){diag('handler_error',{type,message:String(error?.message||error).slice(0,160)});}for(const fn of handlers.get('*')||[])try{fn(envelope)}catch(_){};}
  function cleanupDedupe(now=Date.now()){for(const[key,t]of dedupe)if(now-t>dedupeTtlMs)dedupe.delete(key);}
  function handleIncoming(packet,transport){
    received+=1;const now=Date.now(),ctx=context();cleanupDedupe(now);if(!networkEnvelopeFresh(packet,{now})){droppedStale+=1;return false;}if(packet?.worldId&&ctx.worldId&&String(packet.worldId)!==String(ctx.worldId)){droppedScope+=1;return false;}const key=networkEnvelopeKey(packet);if(dedupe.has(key)){droppedDuplicate+=1;return false;}dedupe.set(key,now);emit(packet.type,{...packet,transport:packet.transport||transport?.name||'external'});return true;
  }
  for(const transport of stack)transport.onMessage(packet=>handleIncoming(packet,transport));
  async function connectTransport(transport,{reason='startup'}={}){
    try{transport.setContext(context());const ok=await withTimeout(transport.connect(context()),connectTimeoutMs,`transport_connect_timeout:${transport.name}`);if(ok){perTransportFailures.set(transport.name,0);diag('transport_connected',{transport:transport.name,mode:transport.mode,reason});return true;}diag('transport_connect_failed',{transport:transport.name,reason,error:transport.diagnostics()?.lastError||null});return false;}catch(error){diag('transport_connect_error',{transport:transport.name,reason,error:String(error?.message||error).slice(0,180)});return false;}
  }
  async function switchActive(next,{reason='switch',isFailback=false}={}){
    if(!next||next===active)return !!active;const previous=active;active=next;lastTransitionAt=Date.now();transitionRevision+=1;if(previous&&previous!==next){try{await previous.disconnect('switch')}catch(_){}}
    if(previous){if(isFailback)failbacks+=1;else failovers+=1;}
    const transition={revision:transitionRevision,from:previous?.mode||null,to:next.mode,fromTransport:previous?.name||null,toTransport:next.name,reason,at:lastTransitionAt};diag('mode_transition',transition);try{onTransition(transition)}catch(_){};return true;
  }
  async function chooseBest({reason='startup',maxPriority=Infinity}={}){
    for(const transport of stack){if(transport.priority>maxPriority)continue;if(await connectTransport(transport,{reason})){await switchActive(transport,{reason});return transport;}}
    return null;
  }
  async function failover(reason='health_failed'){
    if(!active)return chooseBest({reason});const index=stack.indexOf(active);for(const candidate of stack.slice(index+1)){if(await connectTransport(candidate,{reason})){await switchActive(candidate,{reason,isFailback:false});return candidate;}}
    return active;
  }
  async function maybeFailback(){
    if(!active)return;const now=Date.now();if(now-lastTransitionAt<minModeHoldMs||now-lastFailbackProbeAt<failbackIntervalMs)return;lastFailbackProbeAt=now;const currentIndex=stack.indexOf(active);if(currentIndex<=0)return;
    for(const candidate of stack.slice(0,currentIndex)){if(await connectTransport(candidate,{reason:'failback_probe'})){await switchActive(candidate,{reason:'higher_priority_recovered',isFailback:true});return;}}
  }
  async function monitor(){
    if(stopped||!started)return;try{
      if(!active){await chooseBest({reason:'monitor_no_active'});return;}
      const health=await Promise.resolve(active.health());if(health?.ok){perTransportFailures.set(active.name,0);await maybeFailback();}
      else{const failures=(perTransportFailures.get(active.name)||0)+1;perTransportFailures.set(active.name,failures);diag('transport_health_failed',{transport:active.name,failures,error:health?.lastError||null});if(failures>=failureThreshold)await failover('health_threshold');}
    }catch(error){diag('monitor_error',{message:String(error?.message||error).slice(0,180)});}finally{if(!stopped&&started)monitorTimer=setTimeout(monitor,monitorIntervalMs);}
  }
  async function send(type,payload,meta={}){
    if(!active)return false;const ctx=context(),envelope=createNetworkEnvelope({type,payload,senderId:meta.senderId||ctx.userId,worldId:meta.worldId||ctx.worldId,area:meta.area||ctx.area,sessionId:meta.sessionId||ctx.sessionId,seq:++seq,transport:active.name});
    const ok=await Promise.resolve(active.send(envelope));if(ok)sent+=1;else diag('send_failed',{type,transport:active.name});return ok;
  }
  function playerSignature(p={}){return[p.scene,p.area,p.x,p.y,p.elevation,p.heading,p.moving?1:0,p.running?1:0,p.onGround?1:0,p.movementMode,p.localAction||'',p.emote||'',p.airdropTargetWorldId||'',p.airdropX,p.airdropZ].join('|');}
  async function playerTick(force=false){
    if(stopped||!started||!active||typeof getPlayerPacket!=='function')return false;if(typeof document!=='undefined'&&document.hidden&&!force)return false;
    if(active.capabilities?.handlesPlayerStream){if(force)active.burstPlayer?.();return true;}
    const now=Date.now(),full=force||now-lastPlayerFullAt>=900;if(!force&&now-lastPlayerSentAt<92)return false;const packet=getPlayerPacket({full}),sig=playerSignature(packet),changed=sig!==lastPlayerSig;if(!changed&&!full)return false;lastPlayerSentAt=now;if(full)lastPlayerFullAt=now;lastPlayerSig=sig;return send('player_state',packet);
  }
  function ensurePlayerTimer(){if(playerTimer||typeof setInterval!=='function')return;playerTimer=setInterval(()=>{playerTick(false).catch(()=>{});},100);}
  async function start(){if(started)return !!active;started=true;stopped=false;await chooseBest({reason:'startup'});if(!active){await wait(0);return false;}ensurePlayerTimer();monitorTimer=setTimeout(monitor,monitorIntervalMs);await playerTick(true);return true;}
  async function stop(){stopped=true;started=false;if(monitorTimer){clearTimeout(monitorTimer);monitorTimer=null;}if(playerTimer){clearInterval(playerTimer);playerTimer=null;}for(const transport of stack)try{await transport.disconnect('manager_stop')}catch(_){}active=null;dedupe.clear();return true;}
  function updateContext(){const ctx=context();for(const transport of stack)transport.setContext(ctx);return ctx;}
  function on(type,handler){if(!handlers.has(type))handlers.set(type,new Set());handlers.get(type).add(handler);return()=>handlers.get(type)?.delete(handler);}
  function burstPlayer(){if(active?.capabilities?.handlesPlayerStream)return active.burstPlayer?.()??false;playerTick(true).catch(()=>{});return true;}
  function publishVehicle(packet){return send('vehicle_state',packet);}
  function publishInteraction(payload){return send('interaction',sanitizeInteractionPayload(payload));}
  function getDiagnostics(){return{version:2,started,activeMode:active?.mode||null,activeTransport:active?.name||null,transitionRevision,lastTransitionAt,failovers,failbacks,sent,received,droppedDuplicate,droppedStale,droppedScope,context:context(),transports:stack.map(t=>({name:t.name,mode:t.mode,priority:t.priority,...t.diagnostics()})),events:[...diagnosticsLog]};}
  return{start,stop,send,on,burstPlayer,publishVehicle,publishInteraction,updateContext,getActiveMode:()=>active?.mode||null,getActiveTransport:()=>active?.name||null,getDiagnostics,handleIncoming};
}

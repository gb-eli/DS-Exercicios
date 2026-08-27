import { RocketFlightModel } from '../core/launch/RocketFlightModel.js';

let model=null,timer=null,running=false,timeScale=1,quality='balanced';
const intervalForQuality=()=>quality==='performance'?180:quality==='experience'?70:110;
const emit=()=>{
  if(!model)return;
  const telemetry=model.telemetry();
  postMessage({type:'telemetry',payload:telemetry});
  const events=model.drainEvents();if(events.length)postMessage({type:'events',payload:events});
};
const tick=()=>{
  if(!running||!model)return;
  const dt=Math.min(.45,intervalForQuality()/1000*timeScale);
  model.step(dt);emit();
  if(['ORBIT','FAILED','ABORTED'].includes(model.state)){running=false;clearInterval(timer);timer=null;postMessage({type:'complete',payload:model.telemetry()});}
};
const restartTimer=()=>{clearInterval(timer);timer=null;if(running)timer=setInterval(tick,intervalForQuality());};

self.onmessage=event=>{
  const {type,payload={}}=event.data??{};
  if(type==='configure'){model=new RocketFlightModel(payload);emit();}
  if(type==='start'&&model){model.start();running=true;restartTimer();emit();}
  if(type==='pause'){running=false;clearInterval(timer);timer=null;}
  if(type==='resume'&&model&&!['ORBIT','FAILED','ABORTED'].includes(model.state)){running=true;restartTimer();}
  if(type==='step'&&model){model.step(payload.dt??.2);emit();}
  if(type==='reset'&&model){running=false;clearInterval(timer);timer=null;model.reset(payload.config??model.config);emit();}
  if(type==='abort'&&model){model.abort(payload.reason);running=false;clearInterval(timer);timer=null;emit();postMessage({type:'complete',payload:model.telemetry()});}
  if(type==='fault'&&model){model.injectFault(payload.id);emit();}
  if(type==='resolve'&&model){model.resolveFault(payload.id,payload.solution);emit();}
  if(type==='speed'){timeScale=Math.max(.25,Math.min(12,Number(payload.speed)||1));}
  if(type==='quality'){quality=payload.quality||'balanced';restartTimer();}
  if(type==='stop'){running=false;clearInterval(timer);timer=null;}
};

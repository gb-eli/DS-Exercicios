import { MarsMissionModel } from '../core/mars/MarsMissionModel.js';

let model=new MarsMissionModel();
let timer=null;
let speed=1;
let quality='balanced';

const intervalForQuality=()=>quality==='performance'?220:quality==='experience'?85:130;
const sendTelemetry=()=>postMessage({type:'telemetry',payload:model.telemetry()});
const sendEvents=()=>{const events=model.drainEvents();if(events.length)postMessage({type:'events',payload:events});};
function stop(){if(timer){clearInterval(timer);timer=null;}}
function run(){
  stop();
  timer=setInterval(()=>{
    const telemetry=model.step(intervalForQuality()/1000*speed);
    postMessage({type:'telemetry',payload:telemetry});sendEvents();
    if(['SAFE','COMPLETE'].includes(telemetry.state)){stop();postMessage({type:'complete',payload:telemetry});}
  },intervalForQuality());
}

self.onmessage=event=>{
  const {type,payload={}}=event.data??{};
  if(type==='quality'){quality=payload.quality??quality;if(timer)run();}
  if(type==='configure'){stop();model=new MarsMissionModel(payload);sendTelemetry();}
  if(type==='start'){model.start();run();sendEvents();sendTelemetry();}
  if(type==='pause'){model.pause();stop();sendEvents();sendTelemetry();}
  if(type==='resume'){model.start();run();sendEvents();sendTelemetry();}
  if(type==='stop')stop();
  if(type==='speed'){speed=Math.max(.25,Math.min(40,Number(payload.speed)||1));}
  if(type==='enqueue'){const result=model.enqueue(payload.command,payload.priority);postMessage({type:'queue-result',payload:result});sendEvents();sendTelemetry();}
  if(type==='route'){const result=model.enqueue({type:'route',path:payload.path,id:payload.id},payload.priority??'high');postMessage({type:'queue-result',payload:result});sendEvents();sendTelemetry();}
  if(type==='inject'){model.injectFault(payload.id);sendEvents();sendTelemetry();}
  if(type==='resolve'){const ok=model.resolveFault(payload.id,payload.action);postMessage({type:'resolve-result',payload:{ok,id:payload.id,action:payload.action}});sendEvents();sendTelemetry();}
  if(type==='step'){const telemetry=model.step(Number(payload.dt)||.2);postMessage({type:'telemetry',payload:telemetry});sendEvents();}
  if(type==='reset'){stop();model=new MarsMissionModel(payload);sendTelemetry();}
};

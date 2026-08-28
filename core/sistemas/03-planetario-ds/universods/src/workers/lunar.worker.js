import { LunarDescentModel } from '../core/lunar/LunarDescentModel.js';

let model=new LunarDescentModel();
let timer=null;
let speed=1;
let quality='balanced';

const intervalForQuality=()=>quality==='performance'?180:quality==='experience'?80:115;
const postTelemetry=()=>postMessage({type:'telemetry',payload:model.telemetry()});
const postEvents=()=>{const events=model.drainEvents();if(events.length)postMessage({type:'events',payload:events});};

function stop(){if(timer){clearInterval(timer);timer=null;}}
function run(){
  stop();
  timer=setInterval(()=>{
    const dt=intervalForQuality()/1000*speed;
    const payload=model.step(dt);
    postMessage({type:'telemetry',payload});postEvents();
    if(['LANDED','CRASHED','ABORTED'].includes(payload.state)){stop();postMessage({type:'complete',payload});}
  },intervalForQuality());
}

self.onmessage=event=>{
  const {type,payload={}}=event.data??{};
  if(type==='quality'){quality=payload.quality??quality;if(timer)run();}
  if(type==='configure'){stop();model=new LunarDescentModel(payload);postTelemetry();}
  if(type==='start'){if(model.start())run();postEvents();postTelemetry();}
  if(type==='pause')stop();
  if(type==='resume')run();
  if(type==='stop')stop();
  if(type==='speed'){speed=Math.max(.25,Math.min(12,Number(payload.speed)||1));}
  if(type==='controls'){model.setControls(payload);postTelemetry();}
  if(type==='inject'){model.injectFault(payload.id);postEvents();postTelemetry();}
  if(type==='resolve'){model.resolveFault(payload.id,payload.action);postEvents();postTelemetry();}
  if(type==='abort'){model.abort();postEvents();postTelemetry();stop();postMessage({type:'complete',payload:model.telemetry()});}
  if(type==='step'){const telemetry=model.step(Number(payload.dt)||.2);postMessage({type:'telemetry',payload:telemetry});postEvents();}
};

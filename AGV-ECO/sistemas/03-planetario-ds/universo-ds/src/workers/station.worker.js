import { StationMissionModel } from '../core/station/StationMissionModel.js';

let model=new StationMissionModel();let timer=null;let speed=1;let quality='balanced';
const intervals={performance:240,balanced:140,experience:90,automatic:140};
const postState=()=>postMessage({type:'telemetry',payload:model.telemetry()});
const postEvents=()=>{const events=model.drainEvents();if(events.length)postMessage({type:'events',payload:events});};
const step=dt=>{const payload=model.step(dt*speed);postMessage({type:'telemetry',payload});postEvents();};
const start=()=>{clearInterval(timer);model.start();const interval=intervals[quality]??140;timer=setInterval(()=>step(interval/1000),interval);postState();};
const stop=()=>{clearInterval(timer);timer=null;};

self.onmessage=event=>{
  const {type,payload={}}=event.data??{};
  if(type==='configure'){stop();model=new StationMissionModel(payload);postState();}
  if(type==='quality'){quality=payload.quality??'balanced';if(timer)start();}
  if(type==='speed'){speed=Math.max(.25,Math.min(20,Number(payload.speed)||1));model.setSpeed(speed);}
  if(type==='start')start();
  if(type==='pause'){stop();model.pause();postState();}
  if(type==='stop')stop();
  if(type==='step')step(payload.dt??.2);
  if(type==='reset'){stop();model=new StationMissionModel(payload);postState();}
  if(type==='command'){
    const result=model.command(payload.command,payload.payload??{});
    postMessage({type:'command-result',payload:{command:payload.command,result}});postState();postEvents();
  }
};

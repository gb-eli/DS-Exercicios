import { OrbitalFlightModel } from '../core/station-remaster/OrbitalFlightModel.js';
let model=new OrbitalFlightModel();let timer=0;let running=false;let quality='balanced';let input={};
const interval=()=>quality==='performance'?80:quality==='experience'?32:48;
const emit=()=>{postMessage({type:'telemetry',payload:model.telemetry()});const events=model.drainEvents();if(events.length)postMessage({type:'events',payload:events});};
const start=()=>{clearInterval(timer);running=true;let last=performance.now();timer=setInterval(()=>{const now=performance.now(),dt=Math.min(.08,(now-last)/1000);last=now;model.step(dt,input);emit();},interval());};
self.onmessage=event=>{const {type,payload={}}=event.data||{};
 if(type==='quality'){quality=payload.quality||quality;if(running)start();}
 if(type==='configure'){model=new OrbitalFlightModel(payload);emit();}
 if(type==='input')input=payload||{};
 if(type==='start')start();
 if(type==='pause'){running=false;clearInterval(timer);}
 if(type==='step'){model.step(payload.dt||.016,payload.input||input);emit();}
 if(type==='autopilot'){model.setAutopilot(payload.enabled);emit();}
 if(type==='abort'){model.abort();emit();}
 if(type==='reset'){model.reset();emit();}
 if(type==='clear-collision'){model.clearCollision();emit();}
 if(type==='stop'){running=false;clearInterval(timer);close?.();}
};

import {normalizeVehicleDefinition,normalizeVehicleInput,createVehiclePose,vehicleSpeedLimitMps,vehiclePresetFactor,VEHICLE_CORE_VERSION} from './vehicle-contract.js?v=14.10.8.96-f9412-vehicle-core';
import {createKinematicVehiclePhysicsAdapter} from './vehicle-physics-adapter.js?v=14.10.8.96-f9412-vehicle-core';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
const approach=(value,target,rate,dt)=>{const max=Math.max(0,rate)*Math.max(0,dt),d=target-value;return Math.abs(d)<=max?target:value+Math.sign(d)*max;};
const wrap=a=>{let v=Number(a)||0;while(v>Math.PI)v-=Math.PI*2;while(v<-Math.PI)v+=Math.PI*2;return v;};

export function createVehicleController({worldId='unknown',definition=null,physicsAdapter=null,onEvent=null}={}){
  let def=normalizeVehicleDefinition(definition||{}),physics=physicsAdapter||createKinematicVehiclePhysicsAdapter(),state={phase:'parked',role:null,preset:'normal',pose:createVehiclePose(def),speed:0,verticalSpeed:0,occupied:false,seatIndex:0,driverId:null,collision:null,updatedAt:0};
  const emit=(type,extra={})=>{const payload={type,worldId,vehicleId:def.id,at:Date.now(),...extra};try{onEvent?.(payload);}catch{}return payload;};
  function configure(next,adapter=null){def=normalizeVehicleDefinition(next||def);if(adapter)physics=adapter;return api;}
  function setPose(pose={}){state.pose=createVehiclePose({...state.pose,...pose});return snapshot();}
  function enter({role='driver',preset='normal',pose=null,seatIndex=0,driverId=null,phase=null}={}){if(state.occupied&&role!=='remote')return false;state={...state,phase:phase||(role==='driver'?(def.mobilityType==='aerial'?'flying':'driving'):role==='network-passenger'?'remote':'guided'),role,preset:['tour','normal','sport'].includes(preset)?preset:'normal',pose:createVehiclePose(pose||def),speed:0,verticalSpeed:0,occupied:true,seatIndex:Number(seatIndex)||0,driverId:driverId||null,collision:null,updatedAt:performance.now?.()||Date.now()};emit('enter',{role:state.role,preset:state.preset});return snapshot();}
  function exit(reason='user'){if(!state.occupied)return false;const previous=snapshot();state={...state,phase:'parked',role:null,occupied:false,speed:0,verticalSpeed:0,seatIndex:0,driverId:null,collision:null,updatedAt:performance.now?.()||Date.now()};emit('exit',{reason,previous});return true;}
  function step(dt,input={},env={}){
    dt=clamp(dt,0,.08);if(!state.occupied||state.role!=='driver'||dt<=0)return snapshot();const controls=normalizeVehicleInput(input),preset=env.preset||state.preset,externalLimitKmh=Number(env.maxSpeedKmh)>0?Number(env.maxSpeedKmh):null,maxSpeed=vehicleSpeedLimitMps(def,preset,externalLimitKmh),reverseMax=Math.min(def.reverseSpeedKmh/3.6,maxSpeed*.5),forceBrake=!!env.forceBrake||controls.brake;
    let speed=state.speed;
    if(forceBrake)speed=approach(speed,0,def.brake,dt);
    else if(controls.throttle>0){speed=speed<0?approach(speed,0,def.brake,dt):approach(speed,maxSpeed,def.acceleration*controls.throttle,dt);}
    else if(controls.throttle<0){speed=speed>0?approach(speed,0,def.brake*Math.abs(controls.throttle),dt):approach(speed,-reverseMax,def.reverseAcceleration*Math.abs(controls.throttle),dt);}
    else speed=approach(speed,0,def.coast,dt);
    speed=clamp(speed,-reverseMax,maxSpeed);
    const ratio=clamp(Math.abs(speed)/Math.max(.1,maxSpeed),0,1),direction=speed<0?-1:1,steerRate=def.steerRate*(1-.46*ratio)*direction;let heading=wrap(state.pose.heading+(Math.abs(speed)>.04?controls.steer*steerRate*dt:0));
    let verticalSpeed=state.verticalSpeed,y=state.pose.y,phase='driving';
    if(def.mobilityType==='aerial'){const maxAltitude=Math.max(4,Number(env.maxAltitude)||def.maxAltitude),climbRate=Math.max(.5,Number(env.climbRate)||def.climbRate);verticalSpeed=approach(verticalSpeed,controls.climb*climbRate,controls.climb?climbRate*2.6:climbRate*1.4,dt);y=clamp(y+verticalSpeed*dt,Math.max(0,Number(env.minAltitude)||0),maxAltitude);if((y<=0&&verticalSpeed<0)||(y>=maxAltitude&&verticalSpeed>0))verticalSpeed=0;phase='flying';}
    const proposed=createVehiclePose({x:state.pose.x+Math.sin(heading)*speed*dt,y,z:state.pose.z+Math.cos(heading)*speed*dt,heading}),from={...state.pose},mover=def.mobilityType==='aerial'?physics.moveAerial:physics.moveGround,result=mover.call(physics,{from,to:proposed,definition:def,state:{...state,speed,verticalSpeed},environment:env});
    if(result?.ok===false){state={...state,phase,pose:{...state.pose,heading},speed:0,verticalSpeed:def.mobilityType==='aerial'?Math.max(0,verticalSpeed):0,collision:result.collision||{type:'blocked'},updatedAt:performance.now?.()||Date.now()};emit('collision',{collision:state.collision});return snapshot();}
    state={...state,phase,pose:createVehiclePose(result?.pose||proposed),speed,verticalSpeed,collision:null,updatedAt:performance.now?.()||Date.now()};return snapshot();
  }
  function syncExternal({pose=null,speed=null,verticalSpeed=null,phase=null}={}){if(pose)state.pose=createVehiclePose({...state.pose,...pose});if(Number.isFinite(Number(speed)))state.speed=Number(speed);if(Number.isFinite(Number(verticalSpeed)))state.verticalSpeed=Number(verticalSpeed);if(phase)state.phase=phase;state.updatedAt=performance.now?.()||Date.now();return snapshot();}
  function snapshot(){const p={...state.pose},speedKmh=Math.round(Math.abs(state.speed)*36)/10;return Object.freeze({coreVersion:VEHICLE_CORE_VERSION,worldId,id:def.id,name:def.name,kind:def.kind,mobilityType:def.mobilityType,seatCapacity:def.seatCapacity,phase:state.phase,role:state.role,seatMode:state.role,preset:state.preset,occupied:state.occupied,seatIndex:state.seatIndex,driverId:state.driverId,pose:p,x:p.x,y:p.y,z:p.z,heading:p.heading,speed:state.speed,speedKmh,verticalSpeed:state.verticalSpeed,maxSpeedKmh:Math.round(def.maxSpeedKmh*vehiclePresetFactor(state.preset)),maxAltitude:def.maxAltitude,collision:state.collision,physics:physics?.diagnostics?.()||{adapter:'unknown'}});}
  const api=Object.freeze({configure,enter,exit,step,setPose,syncExternal,snapshot,getDefinition:()=>def,getPhysicsAdapter:()=>physics,isActive:()=>state.occupied,isDriver:()=>state.role==='driver'});return api;
}

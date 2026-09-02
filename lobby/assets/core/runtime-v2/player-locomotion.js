export const LOCOMOTION_CONTRACT_VERSION=2;
export const LOCOMOTION_RUNTIME_REVISION='F94.7';
export const LOCOMOTION_STATES=Object.freeze(['IDLE','WALK','RUN','JUMP','FALL','LAND','INTERACT','SEATED','DRIVING','PASSENGER','FLYING']);

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const EARTH=Object.freeze({id:'earth',walk:16,run:28,interiorWalk:8,interiorRun:13,acceleration:48,deceleration:58,airControl:.46,jumpImpulse:7.8,gravity:20,maxFallSpeed:42,turnRate:10,fixedStep:1/60,maxSubSteps:5});
const MOON=Object.freeze({...EARTH,id:'moon',airControl:.58,jumpImpulse:6.2,gravity:5.2,maxFallSpeed:18,turnRate:8});
const STATION=Object.freeze({...EARTH,id:'station',jumpImpulse:0,gravity:0,maxFallSpeed:0});
const AIRDROP=Object.freeze({...EARTH,id:'airdrop',walk:0,run:0,interiorWalk:0,interiorRun:0,jumpImpulse:0,gravity:0,maxFallSpeed:0});

export const LOCOMOTION_PROFILES=Object.freeze({earth:EARTH,moon:MOON,station:STATION,airdrop:AIRDROP});

export function locomotionProfileForWorld(worldId,{interior=false,movementMode=null}={}){
  const id=String(worldId||'').toLowerCase();
  if(String(movementMode||'').startsWith('airdrop')||id==='airdrop-transit')return AIRDROP;
  if(id.includes('moon'))return MOON;
  if(id.includes('space'))return STATION;
  return EARTH;
}

export function locomotionSpeed(profile,{running=false,interior=false,multiplier=1,scale=1}={}){
  const p=profile||EARTH,base=interior?(running?p.interiorRun:p.interiorWalk):(running?p.run:p.walk);
  return base*clamp(Number(multiplier)||1,.55,2.25)*Math.max(.1,Number(scale)||1);
}

export function locomotionJumpImpulse(worldId,options={}){
  return locomotionProfileForWorld(worldId,options).jumpImpulse;
}
export function locomotionGravity(worldId,options={}){
  return locomotionProfileForWorld(worldId,options).gravity;
}

/**
 * Shared locomotion kernel used by every world runtime.
 *
 * F94.7 adds `stepHorizontal()`: runtimes with their own terrain/vehicle/ride
 * vertical solver can adopt the same fixed-timestep acceleration/deceleration
 * immediately, without duplicating horizontal motion math. This lets worlds
 * migrate safely before Rapier owns the full body simulation.
 */
export function createPlayerLocomotion({worldId='campus-ds',interior=false,movementMultiplier=1,profile=null}={}){
  let p=profile||locomotionProfileForWorld(worldId,{interior}),vx=0,vz=0,vertical=0,height=0,onGround=true,state='IDLE',accumulator=0,horizontalAccumulator=0,lastState='IDLE';
  const input={x:0,z:0,running:false};

  function setWorld(next,options={}){
    worldId=String(next||worldId);
    interior=options.interior===undefined?interior:!!options.interior;
    p=options.profile||locomotionProfileForWorld(worldId,{interior,movementMode:options.movementMode});
    return snapshot();
  }
  function setInterior(value){interior=!!value;return snapshot();}
  function setInput(x=0,z=0,{running=false}={}){
    const nx=Number(x)||0,nz=Number(z)||0,len=Math.hypot(nx,nz);
    input.x=len>1?nx/len:nx;input.z=len>1?nz/len:nz;input.running=!!running;
    return snapshot();
  }
  function requestJump(){if(!onGround||p.jumpImpulse<=0)return false;vertical=p.jumpImpulse;onGround=false;state='JUMP';return true;}
  function syncVertical({grounded=onGround,jumpHeight=height,verticalVelocity=vertical}={}){
    onGround=!!grounded;height=Math.max(0,Number(jumpHeight)||0);vertical=Number(verticalVelocity)||0;
    if(!onGround)state=vertical>=0?'JUMP':'FALL';
    return snapshot();
  }
  function horizontalFixedUpdate(dt,{locked=false}={}){
    const targetSpeed=locked?0:locomotionSpeed(p,{running:input.running,interior,multiplier:movementMultiplier});
    const tx=locked?0:input.x*targetSpeed,tz=locked?0:input.z*targetSpeed,hasInput=!locked&&Math.hypot(input.x,input.z)>.001;
    const rate=hasInput?p.acceleration:p.deceleration,dx=tx-vx,dz=tz-vz,diff=Math.hypot(dx,dz),maxDelta=Math.max(0,rate*dt);
    if(diff<=maxDelta||diff<1e-7){vx=tx;vz=tz;}else{const k=maxDelta/diff;vx+=dx*k;vz+=dz*k;}
    if(Math.abs(vx)<.002)vx=0;if(Math.abs(vz)<.002)vz=0;
    const speed=Math.hypot(vx,vz);
    if(onGround)state=speed<.05?'IDLE':(input.running?'RUN':'WALK');
    return{x:vx*dt,z:vz*dt,speed,state};
  }
  function stepHorizontal(dt,{x=input.x,z=input.z,running=input.running,interior:nextInterior=interior,multiplier=movementMultiplier,locked=false}={}){
    interior=!!nextInterior;movementMultiplier=clamp(Number(multiplier)||1,.55,2.25);setInput(x,z,{running});
    const safe=clamp(Number(dt)||0,0,.1);horizontalAccumulator+=safe;let out={x:0,z:0,speed:Math.hypot(vx,vz),state,steps:0,alpha:0};
    let steps=0;while(horizontalAccumulator>=p.fixedStep&&steps<p.maxSubSteps){const frame=horizontalFixedUpdate(p.fixedStep,{locked});out={...frame,x:out.x+frame.x,z:out.z+frame.z};horizontalAccumulator-=p.fixedStep;steps++;}
    if(steps===p.maxSubSteps&&horizontalAccumulator>p.fixedStep*p.maxSubSteps)horizontalAccumulator=p.fixedStep*p.maxSubSteps;
    return{...out,steps,alpha:p.fixedStep?horizontalAccumulator/p.fixedStep:0,inputMagnitude:Math.hypot(input.x,input.z)};
  }
  function fixedUpdate(dt){
    const h=horizontalFixedUpdate(dt);
    if(!onGround&&p.gravity>0){vertical=Math.max(-p.maxFallSpeed,vertical-p.gravity*dt);height+=vertical*dt;if(height<=0){height=0;vertical=0;onGround=true;state='LAND';}}
    if(!onGround)state=vertical>=0?'JUMP':'FALL';else if(state==='LAND'){}else if(Math.hypot(vx,vz)<.05)state='IDLE';else state=input.running?'RUN':'WALK';
    if(state==='LAND'&&lastState==='LAND')state=Math.hypot(vx,vz)<.05?'IDLE':(input.running?'RUN':'WALK');lastState=state;
    return{x:h.x,z:h.z,vertical,height,onGround,state,speed:h.speed};
  }
  function step(dt){const safe=clamp(Number(dt)||0,0,.1);accumulator+=safe;let out={x:0,z:0,vertical,height,onGround,state,speed:Math.hypot(vx,vz)},steps=0;while(accumulator>=p.fixedStep&&steps<p.maxSubSteps){const frame=fixedUpdate(p.fixedStep);out={...frame,x:out.x+frame.x,z:out.z+frame.z};accumulator-=p.fixedStep;steps++;}if(steps===p.maxSubSteps&&accumulator>p.fixedStep*p.maxSubSteps)accumulator=p.fixedStep*p.maxSubSteps;return{...out,steps,alpha:p.fixedStep?accumulator/p.fixedStep:0};}
  function haltHorizontal(){vx=0;vz=0;horizontalAccumulator=0;if(onGround)state='IDLE';return snapshot();}
  function reset({jumpHeight=0}={}){vx=vz=vertical=0;height=Math.max(0,Number(jumpHeight)||0);onGround=height<=0;state=onGround?'IDLE':'FALL';accumulator=0;horizontalAccumulator=0;return snapshot();}
  function snapshot(){return Object.freeze({contractVersion:LOCOMOTION_CONTRACT_VERSION,runtimeRevision:LOCOMOTION_RUNTIME_REVISION,worldId,profileId:p.id,interior,input:{...input},velocity:{x:vx,z:vz,vertical},height,onGround,state});}
  return Object.freeze({setWorld,setInterior,setInput,requestJump,syncVertical,stepHorizontal,step,haltHorizontal,reset,snapshot,getProfile:()=>p,setMovementMultiplier:v=>(movementMultiplier=clamp(Number(v)||1,.55,2.25))});
}

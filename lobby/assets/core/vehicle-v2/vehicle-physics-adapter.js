export const VEHICLE_PHYSICS_ADAPTER_VERSION=1;
const passthrough=pose=>({ok:true,pose:{...pose},collision:null});

export function createKinematicVehiclePhysicsAdapter({canMoveGround=null,canMoveAerial=null,onCollision=null}={}){
  return Object.freeze({
    id:'kinematic',kind:'kinematic',available:true,
    moveGround({from,to,definition,state}={}){let result=typeof canMoveGround==='function'?canMoveGround({from,to,definition,state}):true;if(result===true||result==null)return passthrough(to);if(result===false)result={ok:false,collision:{type:'blocked'}};const out={ok:result.ok!==false,pose:{...(result.pose||to)},collision:result.collision||null};if(!out.ok)onCollision?.(out.collision,{definition,state});return out;},
    moveAerial({from,to,definition,state}={}){let result=typeof canMoveAerial==='function'?canMoveAerial({from,to,definition,state}):true;if(result===true||result==null)return passthrough(to);if(result===false)result={ok:false,collision:{type:'blocked'}};const out={ok:result.ok!==false,pose:{...(result.pose||to)},collision:result.collision||null};if(!out.ok)onCollision?.(out.collision,{definition,state});return out;},
    diagnostics:()=>({adapter:'kinematic',available:true,rapier:false})
  });
}

export function createRapierVehiclePhysicsAdapter({RAPIER=null,world=null,body=null,fallback=null}={}){
  const ready=!!(RAPIER&&world&&typeof world.step==='function');const safeFallback=fallback||createKinematicVehiclePhysicsAdapter();
  return Object.freeze({
    id:'rapier',kind:'rapier',available:ready,
    moveGround(payload){if(!ready||!body)return safeFallback.moveGround(payload);const pose=payload?.to||{};try{body.setNextKinematicTranslation?.({x:Number(pose.x)||0,y:Number(pose.y)||0,z:Number(pose.z)||0});body.setNextKinematicRotation?.({x:0,y:Math.sin((Number(pose.heading)||0)/2),z:0,w:Math.cos((Number(pose.heading)||0)/2)});return{ok:true,pose:{...pose},collision:null};}catch{return safeFallback.moveGround(payload);}},
    moveAerial(payload){if(!ready||!body)return safeFallback.moveAerial(payload);return this.moveGround(payload);},
    diagnostics:()=>({adapter:'rapier',available:ready,rapier:true,body:!!body,fallback:!ready||!body})
  });
}

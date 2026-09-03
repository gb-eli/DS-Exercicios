export const RAPIER_VEHICLE_WORLD_VERSION=1;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
const radiusFor=def=>Math.max(.35,Number(def?.collisionRadius)||({bike:.58,bus:1.55,van:1.3,rover:1.08,car:1.02}[def?.kind]||1.02));

export function createRapierGroundVehicleAdapter({RAPIER,staticColliders=[],bounds={x:60,z:42},fallback=null,dynamicCollisionCheck=null,onCollision=null}={}){
  if(!RAPIER?.World||!RAPIER?.ColliderDesc||!RAPIER?.RigidBodyDesc)throw new Error('rapier_api_missing');
  const world=new RAPIER.World({x:0,y:0,z:0}),controller=world.createCharacterController?.(.035);
  if(!controller)throw new Error('rapier_character_controller_missing');
  controller.setSlideEnabled?.(true);controller.setApplyImpulsesToDynamicBodies?.(false);
  const staticHandles=new Map();
  for(const c of staticColliders){const hx=Math.max(.05,(Number(c.maxX)-Number(c.minX))/2),hz=Math.max(.05,(Number(c.maxZ)-Number(c.minZ))/2),hy=6,cx=(Number(c.minX)+Number(c.maxX))/2,cz=(Number(c.minZ)+Number(c.maxZ))/2;const desc=RAPIER.ColliderDesc.cuboid(hx,hy,hz).setTranslation(cx,hy,cz);const collider=world.createCollider(desc);staticHandles.set(collider.handle,String(c.id||c.label||'obstáculo fixo'));}
  let body=null,vehicleCollider=null,activeKey='',activeRadius=1,steps=0,collisions=0,lastCollision=null;
  function disposeVehicle(){try{if(body)world.removeRigidBody?.(body);}catch{}body=null;vehicleCollider=null;activeKey='';}
  function ensureVehicle(def,from){const r=radiusFor(def),key=`${def?.kind||'vehicle'}:${r.toFixed(3)}`;if(body&&activeKey===key)return;disposeVehicle();activeKey=key;activeRadius=r;const y=r;const bodyDesc=RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(Number(from?.x)||0,y,Number(from?.z)||0);body=world.createRigidBody(bodyDesc);vehicleCollider=world.createCollider(RAPIER.ColliderDesc.ball(r),body);}
  function labelCollision(i){try{const hit=controller.computedCollision(i),handle=hit?.collider?.handle;return{type:'rapier-static',label:staticHandles.get(handle)||'obstáculo físico',handle:Number(handle)};}catch{return{type:'rapier-static',label:'obstáculo físico'};}}
  function moveGround(payload={}){
    const {from={},to={},definition={}}=payload;if(!from||!to)return fallback?.moveGround?.(payload)||{ok:false,pose:{...from},collision:{type:'invalid-pose'}};
    const r=radiusFor(definition),bx=Math.max(r,Number(bounds.x)||60),bz=Math.max(r,Number(bounds.z)||42);if(to.x<-bx+r||to.x>bx-r||to.z<-bz+r||to.z>bz-r)return{ok:false,pose:{...from},collision:{type:'boundary',label:'limite do Campus'}};
    const dynamicHit=dynamicCollisionCheck?.(to.x,to.z,definition.kind,payload);if(dynamicHit)return{ok:false,pose:{...from},collision:dynamicHit};
    try{
      ensureVehicle(definition,from);body.setTranslation?.({x:Number(from.x)||0,y:activeRadius,z:Number(from.z)||0},true);body.setRotation?.({x:0,y:Math.sin((Number(from.heading)||0)/2),z:0,w:Math.cos((Number(from.heading)||0)/2)},true);
      const desired={x:(Number(to.x)||0)-(Number(from.x)||0),y:0,z:(Number(to.z)||0)-(Number(from.z)||0)};controller.computeColliderMovement(vehicleCollider,desired);const corrected=controller.computedMovement?.()||desired,count=Number(controller.numComputedCollisions?.()||0),final={...to,x:(Number(from.x)||0)+(Number(corrected.x)||0),y:Number(to.y)||0,z:(Number(from.z)||0)+(Number(corrected.z)||0)};
      body.setNextKinematicTranslation?.({x:final.x,y:activeRadius,z:final.z});body.setNextKinematicRotation?.({x:0,y:Math.sin((Number(to.heading)||0)/2),z:0,w:Math.cos((Number(to.heading)||0)/2)});world.step();steps++;
      if(count>0){collisions++;lastCollision=labelCollision(0);const desiredLen=Math.hypot(desired.x,desired.z),movedLen=Math.hypot(corrected.x||0,corrected.z||0);if(desiredLen>.025&&movedLen<Math.max(.02,desiredLen*.12)){onCollision?.(lastCollision,payload);return{ok:false,pose:{...from,heading:to.heading},collision:lastCollision};}}
      return{ok:true,pose:final,collision:count?lastCollision:null};
    }catch(error){return fallback?.moveGround?.(payload)||{ok:false,pose:{...from},collision:{type:'rapier-error',label:String(error?.message||error)}};}
  }
  function moveAerial(payload){return fallback?.moveAerial?.(payload)||{ok:true,pose:{...(payload?.to||{})},collision:null};}
  function diagnostics(){return Object.freeze({adapter:'rapier-pilot',available:true,rapier:true,staticColliders:staticHandles.size,vehicleBody:!!body,steps,collisions,lastCollision});}
  function dispose(){disposeVehicle();try{world.removeCharacterController?.(controller);}catch{}try{world.free?.();}catch{}}
  return Object.freeze({id:'rapier-pilot',kind:'rapier',available:true,moveGround,moveAerial,diagnostics,dispose,world});
}

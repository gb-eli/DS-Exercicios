import {loadRapier3D,loadThreeMeshBVH,physicsPilotPolicy,RAPIER3D_COMPAT_VERSION,THREE_MESH_BVH_VERSION} from './physics-module-loader.js?v=14.10.8.96-f9413-rapier-bvh-pilot';
import {createMeshBVHStaticCollider} from './mesh-bvh-collider.js?v=14.10.8.96-f9413-rapier-bvh-pilot';
import {createRapierGroundVehicleAdapter} from './rapier-vehicle-world.js?v=14.10.8.96-f9413-rapier-bvh-pilot';
export const CAMPUS_PHYSICS_PILOT_VERSION=1;

export function createCampusPhysicsPilot({THREE,colliders=[],bounds={x:60,z:42},fallbackPhysics,quality='medium',device={},dynamicCollisionCheck=null,onEvent=null,loadRapier=loadRapier3D,loadBVH=loadThreeMeshBVH,search=null}={}){
  let active=fallbackPhysics,bvh=null,rapierAdapter=null,status='idle',activation=null,lastError=null,startedAt=0,finishedAt=0,bvhQueries=0;
  const policy=physicsPilotPolicy({quality,device,search});
  const emit=(type,extra={})=>{try{onEvent?.({type,at:Date.now(),...extra});}catch{}};
  async function activate({force=false}={}){
    if(activation)return activation;if(!policy.enabled&&!force){status='disabled';return diagnostics();}
    status='loading';startedAt=performance.now?.()||Date.now();emit('physics-pilot-loading',{policy});
    activation=(async()=>{
      const [bvhLoad,rapierLoad]=await Promise.all([loadBVH(),loadRapier()]);
      if(bvhLoad?.available){try{bvh=createMeshBVHStaticCollider({THREE,MeshBVH:bvhLoad.MeshBVH,colliders,height:12});}catch(error){lastError=`bvh:${error?.message||error}`;}}
      if(rapierLoad?.available){try{rapierAdapter=createRapierGroundVehicleAdapter({RAPIER:rapierLoad.module,staticColliders:colliders,bounds,fallback:fallbackPhysics,dynamicCollisionCheck,onCollision:collision=>emit('physics-collision',{collision})});active=rapierAdapter;}catch(error){lastError=`rapier:${error?.message||error}`;}}
      finishedAt=performance.now?.()||Date.now();status=rapierAdapter?'rapier':bvh?'bvh-only':'fallback';if(!rapierAdapter&&!bvh)lastError=lastError||rapierLoad?.error||bvhLoad?.error||'physics_modules_unavailable';emit('physics-pilot-ready',{status,diagnostics:diagnostics()});return diagnostics();
    })().catch(error=>{lastError=String(error?.message||error);status='fallback';finishedAt=performance.now?.()||Date.now();emit('physics-pilot-fallback',{error:lastError});return diagnostics();});
    return activation;
  }
  function intersectsStaticSphere({x=0,y=.75,z=0,radius=.62}={}){if(!bvh)return null;bvhQueries++;try{return bvh.intersectsSphere({x,y,z,radius});}catch{return null;}}
  const adapter=Object.freeze({
    id:'campus-physics-pilot',kind:'hybrid',available:true,
    moveGround(payload){return active?.moveGround?.(payload)||fallbackPhysics?.moveGround?.(payload)||{ok:true,pose:{...(payload?.to||{})},collision:null};},
    moveAerial(payload){return fallbackPhysics?.moveAerial?.(payload)||{ok:true,pose:{...(payload?.to||{})},collision:null};},
    diagnostics:()=>diagnostics()
  });
  function diagnostics(){const b=bvh?.diagnostics?.()||null,r=rapierAdapter?.diagnostics?.()||null;return Object.freeze({pilotVersion:CAMPUS_PHYSICS_PILOT_VERSION,status,policy,activeAdapter:active?.id||active?.kind||'kinematic',rapier:{requested:policy.enabled,version:RAPIER3D_COMPAT_VERSION,ready:!!rapierAdapter,diagnostics:r},bvh:{version:THREE_MESH_BVH_VERSION,ready:!!bvh,queries:bvhQueries,diagnostics:b},timingMs:finishedAt&&startedAt?Math.round(finishedAt-startedAt):null,error:lastError});}
  function dispose(){try{rapierAdapter?.dispose?.();}catch{}try{bvh?.dispose?.();}catch{}rapierAdapter=null;bvh=null;active=fallbackPhysics;status='disposed';}
  return Object.freeze({activate,adapter,intersectsStaticSphere,diagnostics,dispose,policy});
}

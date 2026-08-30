const MODES=Object.freeze({
  explore:Object.freeze({distance:1,height:1.0,shoulder:.52,fov:58,minPitch:-.08,maxPitch:.88}),
  firstperson:Object.freeze({distance:0,height:0,shoulder:0,fov:72,minPitch:-1.18,maxPitch:1.18}),
  wide:Object.freeze({distance:1.38,height:1.12,shoulder:0,fov:64,minPitch:-.02,maxPitch:.94}),
  campus:Object.freeze({distance:1.92,height:3.4,shoulder:0,fov:72,minPitch:.62,maxPitch:1.12})
});
const MODE_ORDER=Object.freeze(['explore','firstperson','wide','campus']);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createCameraController({THREE,camera,canvas,getCollisionRoots=()=>[],initialYaw=Math.PI,initialPitch=.32,initialDistance=6.8,initialFov=null}={}){
  if(!THREE||!camera||!canvas)throw new Error('camera_controller_missing_dependency');
  let yaw=initialYaw,pitch=initialPitch,distance=initialDistance,mode='explore',intro=0,disposed=false,userFov=Number.isFinite(Number(initialFov))?clamp(Number(initialFov),45,95):null,sensitivity=1;
  let pointer=null,lastX=0,lastY=0;
  const target=new THREE.Vector3(),smoothedTarget=new THREE.Vector3(),desired=new THREE.Vector3(),resolved=new THREE.Vector3(),direction=new THREE.Vector3(),lookTarget=new THREE.Vector3();
  const raycaster=new THREE.Raycaster();let initialized=false,lastCollision=false,cachedRootCount=-1,cachedMeshes=[];
  function current(){return MODES[mode]||MODES.explore;}function clampPitch(){const cfg=current();pitch=clamp(pitch,cfg.minPitch,cfg.maxPitch);}
  function setMode(next){if(!MODES[next])return mode;mode=next;clampPitch();return mode;}function toggleMode(){const i=MODE_ORDER.indexOf(mode);return setMode(MODE_ORDER[(i+1)%MODE_ORDER.length]);}
  function setYaw(v){if(Number.isFinite(v))yaw=v;return yaw;}function setPitch(v){if(Number.isFinite(v)){pitch=v;clampPitch();}return pitch;}function getYaw(){return yaw;}function getPitch(){return pitch;}function getMode(){return mode;}function getDistance(){return distance;}
  function setFov(value){const n=Number(value);userFov=Number.isFinite(n)?clamp(n,45,95):null;return getFov();}function getFov(){return userFov||current().fov;}function setSensitivity(value){const n=Number(value);if(Number.isFinite(n))sensitivity=clamp(n,.45,1.8);return sensitivity;}
  function collisionMeshes(){const roots=getCollisionRoots()||[];if(cachedRootCount===roots.length)return cachedMeshes;cachedRootCount=roots.length;cachedMeshes=[];for(const root of roots)root?.traverse?.(o=>{if(o?.isMesh&&!o.userData?.cameraIgnore)cachedMeshes.push(o);});return cachedMeshes;}
  function resolveCollision(from,to){direction.copy(to).sub(from);const requested=direction.length();if(requested<=.001)return{position:to,hit:false};direction.multiplyScalar(1/requested);raycaster.set(from,direction);raycaster.near=.28;raycaster.far=requested;const hit=raycaster.intersectObjects(collisionMeshes(),false).find(item=>item.distance>.3&&item.object?.visible!==false);if(!hit)return{position:to,hit:false};resolved.copy(from).addScaledVector(direction,Math.max(2.25,hit.distance-.42));return{position:resolved,hit:true};}
  function update({playerPosition,moving=0,running=false,time=0,dt=.016}={}){
    if(disposed||!playerPosition)return;intro=Math.min(1,intro+dt/2.15);const cfg=current();clampPitch();const bob=moving>.1?Math.sin(time*(running?11:7))*(running?.032:.016):0;target.set(playerPosition.x,playerPosition.y+1.58+bob,playerPosition.z);
    if(mode==='firstperson'){
      camera.position.lerp(target,1-Math.exp(-24*dt));const cp=Math.cos(pitch);lookTarget.set(target.x-Math.sin(yaw)*cp*12,target.y+Math.sin(pitch)*12,target.z-Math.cos(yaw)*cp*12);camera.lookAt(lookTarget);lastCollision=false;
    }else{
      if(!initialized){smoothedTarget.copy(target);initialized=true;}else smoothedTarget.lerp(target,1-Math.exp(-14*dt));const effectiveDistance=distance*cfg.distance+(1-intro)*7,horizontal=Math.cos(pitch)*effectiveDistance,shoulder=cfg.shoulder*intro;desired.set(smoothedTarget.x+Math.sin(yaw)*horizontal+Math.cos(yaw)*shoulder,smoothedTarget.y+Math.sin(pitch)*effectiveDistance+cfg.height+(1-intro)*2.5,smoothedTarget.z+Math.cos(yaw)*horizontal-Math.sin(yaw)*shoulder);const collision=resolveCollision(smoothedTarget,desired);lastCollision=collision.hit;camera.position.lerp(collision.position,1-Math.exp(-(collision.hit?14:8.5)*dt));camera.lookAt(smoothedTarget);
    }
    const base=userFov||cfg.fov;camera.fov=THREE.MathUtils.damp(camera.fov,base+(running&&moving>.1&&mode!=='firstperson'?4:0),7,dt);camera.updateProjectionMatrix();
  }
  function onPointerDown(e){if(e.target!==canvas)return;pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);}function onPointerMove(e){if(e.pointerId!==pointer)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.0057*sensitivity;pitch-=dy*.004*sensitivity;clampPitch();}function onPointerEnd(e){if(e.pointerId===pointer)pointer=null;}function onWheel(e){if(mode!=='firstperson')distance=clamp(distance+Math.sign(e.deltaY)*.55,4.2,12);e.preventDefault();}function onContext(e){e.preventDefault();}
  canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('pointerup',onPointerEnd);canvas.addEventListener('pointercancel',onPointerEnd);canvas.addEventListener('wheel',onWheel,{passive:false});canvas.addEventListener('contextmenu',onContext);
  return{update,toggleMode,setMode,getMode,getYaw,setYaw,setPitch,getPitch,getDistance,setFov,getFov,setSensitivity,isFirstPerson:()=>mode==='firstperson',isColliding:()=>lastCollision,dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('pointerdown',onPointerDown);canvas.removeEventListener('pointermove',onPointerMove);canvas.removeEventListener('pointerup',onPointerEnd);canvas.removeEventListener('pointercancel',onPointerEnd);canvas.removeEventListener('wheel',onWheel);canvas.removeEventListener('contextmenu',onContext);}};
}

const MODES=Object.freeze({
  explore:Object.freeze({distance:1,height:1.0,shoulder:.52,fov:58,minPitch:-.08,maxPitch:.88}),
  wide:Object.freeze({distance:1.38,height:1.12,shoulder:0,fov:64,minPitch:-.02,maxPitch:.94}),
  campus:Object.freeze({distance:1.82,height:2.9,shoulder:0,fov:70,minPitch:.68,maxPitch:1.06})
});
const MODE_ORDER=Object.freeze(['explore','wide','campus']);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createCameraController({THREE,camera,canvas,getCollisionRoots=()=>[],initialYaw=Math.PI,initialPitch=.32,initialDistance=6.8}={}){
  if(!THREE||!camera||!canvas)throw new Error('camera_controller_missing_dependency');
  let yaw=initialYaw,pitch=initialPitch,distance=initialDistance,mode='explore',intro=0,disposed=false;
  let pointer=null,lastX=0,lastY=0;
  const target=new THREE.Vector3(),smoothedTarget=new THREE.Vector3(),desired=new THREE.Vector3(),resolved=new THREE.Vector3(),direction=new THREE.Vector3();
  const raycaster=new THREE.Raycaster();
  let initialized=false,lastCollision=false,cachedRootCount=-1,cachedMeshes=[];

  function current(){return MODES[mode]||MODES.explore;}
  function clampPitch(){const cfg=current();pitch=clamp(pitch,cfg.minPitch,cfg.maxPitch);}
  function setMode(next){if(!MODES[next])return mode;mode=next;clampPitch();return mode;}
  function toggleMode(){const i=MODE_ORDER.indexOf(mode);return setMode(MODE_ORDER[(i+1)%MODE_ORDER.length]);}
  function setYaw(value){if(Number.isFinite(value))yaw=value;return yaw;}
  function setPitch(value){if(Number.isFinite(value)){pitch=value;clampPitch();}return pitch;}
  function getYaw(){return yaw;}
  function getMode(){return mode;}
  function getDistance(){return distance;}

  function collisionMeshes(){
    const roots=getCollisionRoots()||[];
    if(cachedRootCount===roots.length)return cachedMeshes;
    cachedRootCount=roots.length;cachedMeshes=[];
    for(const root of roots){
      root?.traverse?.(object=>{
        if(!object?.isMesh||object.userData?.cameraIgnore)return;
        cachedMeshes.push(object);
      });
    }
    return cachedMeshes;
  }

  function resolveCollision(from,to){
    direction.copy(to).sub(from);const requested=direction.length();
    if(requested<=.001)return{position:to,hit:false};
    direction.multiplyScalar(1/requested);
    raycaster.set(from,direction);raycaster.near=.28;raycaster.far=requested;
    const hits=raycaster.intersectObjects(collisionMeshes(),false);
    const hit=hits.find(item=>item.distance>.3&&item.object?.visible!==false);
    if(!hit)return{position:to,hit:false};
    const safeDistance=Math.max(2.25,hit.distance-.42);
    resolved.copy(from).addScaledVector(direction,safeDistance);
    return{position:resolved,hit:true};
  }

  function update({playerPosition,moving=0,running=false,time=0,dt=.016}={}){
    if(disposed||!playerPosition)return;
    intro=Math.min(1,intro+dt/2.15);const cfg=current();clampPitch();
    const bob=moving>.1?Math.sin(time*(running?11:7))*(running?.032:.016):0;
    target.set(playerPosition.x,playerPosition.y+1.55+bob,playerPosition.z);
    if(!initialized){smoothedTarget.copy(target);initialized=true;}else smoothedTarget.lerp(target,1-Math.exp(-14*dt));
    const effectiveDistance=distance*cfg.distance+(1-intro)*7;
    const horizontal=Math.cos(pitch)*effectiveDistance;
    const shoulder=cfg.shoulder*intro;
    desired.set(
      smoothedTarget.x+Math.sin(yaw)*horizontal+Math.cos(yaw)*shoulder,
      smoothedTarget.y+Math.sin(pitch)*effectiveDistance+cfg.height+(1-intro)*2.5,
      smoothedTarget.z+Math.cos(yaw)*horizontal-Math.sin(yaw)*shoulder
    );
    const collision=resolveCollision(smoothedTarget,desired);lastCollision=collision.hit;
    const follow=collision.hit?14:8.5;
    camera.position.lerp(collision.position,1-Math.exp(-follow*dt));
    camera.fov=THREE.MathUtils.damp(camera.fov,cfg.fov+(running&&moving>.1?4:0),7,dt);
    camera.updateProjectionMatrix();camera.lookAt(smoothedTarget);
  }

  function onPointerDown(event){if(event.target!==canvas)return;pointer=event.pointerId;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture?.(event.pointerId);}
  function onPointerMove(event){if(event.pointerId!==pointer)return;const dx=event.clientX-lastX,dy=event.clientY-lastY;lastX=event.clientX;lastY=event.clientY;yaw-=dx*.0057;pitch-=dy*.004;clampPitch();}
  function onPointerEnd(event){if(event.pointerId===pointer)pointer=null;}
  function onWheel(event){distance=clamp(distance+Math.sign(event.deltaY)*.55,4.2,10);event.preventDefault();}
  function onContext(event){event.preventDefault();}
  canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('pointerup',onPointerEnd);canvas.addEventListener('pointercancel',onPointerEnd);canvas.addEventListener('wheel',onWheel,{passive:false});canvas.addEventListener('contextmenu',onContext);

  return{
    update,toggleMode,setMode,getMode,getYaw,setYaw,setPitch,getDistance,
    isColliding:()=>lastCollision,
    dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('pointerdown',onPointerDown);canvas.removeEventListener('pointermove',onPointerMove);canvas.removeEventListener('pointerup',onPointerEnd);canvas.removeEventListener('pointercancel',onPointerEnd);canvas.removeEventListener('wheel',onWheel);canvas.removeEventListener('contextmenu',onContext);}
  };
}

// F94.8 — Camera V2
// Câmera unificada para mundos 3D: eixo vertical intuitivo, Invert Y real,
// free-look em terceira pessoa, sensibilidade comum e presets de veículo.
const MODES=Object.freeze({
  explore:Object.freeze({distance:1,height:1.15,shoulder:.52,fov:58,minPitch:-1.12,maxPitch:1.20,lookDistance:16}),
  firstperson:Object.freeze({distance:0,height:0,shoulder:0,fov:72,minPitch:-1.46,maxPitch:1.46,lookDistance:18}),
  wide:Object.freeze({distance:1.38,height:1.72,shoulder:0,fov:64,minPitch:-1.10,maxPitch:1.18,lookDistance:20}),
  campus:Object.freeze({distance:1.92,height:3.65,shoulder:0,fov:72,minPitch:-.98,maxPitch:1.12,lookDistance:24}),
  aerial:Object.freeze({distance:1.58,height:2.45,shoulder:0,fov:68,minPitch:-1.18,maxPitch:1.22,lookDistance:26}),
  vehicle:Object.freeze({distance:1.12,height:1.85,shoulder:0,fov:70,minPitch:-1.08,maxPitch:1.12,lookDistance:24}),
  cockpit:Object.freeze({distance:0,height:.25,shoulder:0,fov:76,minPitch:-1.32,maxPitch:1.32,lookDistance:22})
});
const MODE_ORDER=Object.freeze(['explore','firstperson','wide','campus','aerial']);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const expDamp=(rate,dt)=>1-Math.exp(-Math.max(.001,rate)*Math.max(.001,dt));

export function createCameraController({THREE:THREEInput,camera,canvas,getCollisionRoots=()=>[],initialYaw=Math.PI,initialPitch=.12,initialDistance=6.8,initialFov=null,initialSensitivity=1,initialInvertY=false,initialMode='explore'}={}){
  const THREE=THREEInput||globalThis.THREE;
  if(!THREE||!camera||!canvas)throw new Error('camera_controller_missing_dependency');
  let yaw=Number.isFinite(Number(initialYaw))?Number(initialYaw):Math.PI;
  let pitch=Number.isFinite(Number(initialPitch))?Number(initialPitch):.12;
  let distance=clamp(Number(initialDistance)||6.8,2.4,18);
  let mode=MODES[initialMode]?initialMode:'explore',intro=0,disposed=false;
  let userFov=Number.isFinite(Number(initialFov))?clamp(Number(initialFov),45,100):null;
  let sensitivity=clamp(Number(initialSensitivity)||1,.35,2.5),invertY=!!initialInvertY,inputEnabled=true;
  let pointer=null,lastX=0,lastY=0;
  const target=new THREE.Vector3(),smoothedTarget=new THREE.Vector3(),desired=new THREE.Vector3(),resolved=new THREE.Vector3(),direction=new THREE.Vector3(),lookTarget=new THREE.Vector3(),forward=new THREE.Vector3(),right=new THREE.Vector3();
  const raycaster=new THREE.Raycaster();let initialized=false,lastCollision=false,cachedRoots=[],cachedMeshes=[];

  function current(){return MODES[mode]||MODES.explore;}
  function clampPitch(){const cfg=current();pitch=clamp(pitch,cfg.minPitch,cfg.maxPitch);}
  function setMode(next){if(!MODES[next])return mode;mode=next;clampPitch();return mode;}
  function toggleMode(){const i=MODE_ORDER.indexOf(mode);return setMode(MODE_ORDER[(i+1+MODE_ORDER.length)%MODE_ORDER.length]);}
  function setYaw(v){if(Number.isFinite(Number(v)))yaw=Number(v);return yaw;}
  function setPitch(v){if(Number.isFinite(Number(v))){pitch=Number(v);clampPitch();}return pitch;}
  function getYaw(){return yaw;} function getPitch(){return pitch;} function getMode(){return mode;} function getDistance(){return distance;}
  function setDistance(v){if(Number.isFinite(Number(v)))distance=clamp(Number(v),2.4,18);return distance;}
  function setFov(value){const n=Number(value);userFov=Number.isFinite(n)?clamp(n,45,100):null;return getFov();}
  function getFov(){return userFov||current().fov;}
  function setSensitivity(value){const n=Number(value);if(Number.isFinite(n))sensitivity=clamp(n,.35,2.5);return sensitivity;}
  function setInvertY(value){invertY=!!value;return invertY;}
  function setInputEnabled(value){inputEnabled=value!==false;if(!inputEnabled)pointer=null;return inputEnabled;}
  function resetLook({yaw:nextYaw=Math.PI,pitch:nextPitch=.12,mode:nextMode=null}={}){setYaw(nextYaw);if(nextMode)setMode(nextMode);setPitch(nextPitch);return{yaw,pitch,mode};}

  function collisionMeshes(){
    const roots=getCollisionRoots()||[];
    if(cachedRoots.length===roots.length&&roots.every((root,index)=>root===cachedRoots[index]))return cachedMeshes;
    cachedRoots=[...roots];cachedMeshes=[];
    for(const root of roots)root?.traverse?.(o=>{if(o?.isMesh&&!o.userData?.cameraIgnore)cachedMeshes.push(o);});
    return cachedMeshes;
  }
  function resolveCollision(from,to){
    direction.copy(to).sub(from);const requested=direction.length();if(requested<=.001)return{position:to,hit:false};
    direction.multiplyScalar(1/requested);raycaster.set(from,direction);raycaster.near=.22;raycaster.far=requested;
    const hit=raycaster.intersectObjects(collisionMeshes(),false).find(item=>item.distance>.28&&item.object?.visible!==false);
    if(!hit)return{position:to,hit:false};
    resolved.copy(from).addScaledVector(direction,Math.max(1.2,hit.distance-.38));return{position:resolved,hit:true};
  }
  function computeForward(){
    const cp=Math.cos(pitch);
    // Convenção AGV: yaw 0 olha para -Z; pitch positivo olha para cima.
    forward.set(-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp).normalize();
    right.set(Math.cos(yaw),0,-Math.sin(yaw)).normalize();
    return forward;
  }
  function update({playerPosition,moving=0,running=false,time=0,dt=.016,vehicleHeading=null,vehicleKind=null}={}){
    if(disposed||!playerPosition)return;
    intro=Math.min(1,intro+dt/1.8);const cfg=current();clampPitch();
    const bob=moving>.1&&mode!=='vehicle'&&mode!=='cockpit'?Math.sin(time*(running?11:7))*(running?.028:.014):0;
    const targetHeight=mode==='cockpit'?1.48:1.58;
    target.set(playerPosition.x,playerPosition.y+targetHeight+bob,playerPosition.z);
    if(Number.isFinite(Number(vehicleHeading))&&(mode==='vehicle'||mode==='aerial'||mode==='cockpit')&&pointer===null){
      // A câmera acompanha a orientação do veículo sem impedir free-look do usuário.
      const desiredYaw=Number(vehicleHeading)+Math.PI,delta=(desiredYaw-yaw+Math.PI*3)%(Math.PI*2)-Math.PI;
      yaw+=delta*expDamp(5.5,dt);
    }
    computeForward();
    if(mode==='firstperson'||mode==='cockpit'){
      camera.position.lerp(target,expDamp(24,dt));
      if(mode==='cockpit'&&vehicleKind==='aerial')camera.position.y+=.18;
      lookTarget.copy(target).addScaledVector(forward,cfg.lookDistance||18);
      camera.lookAt(lookTarget);lastCollision=false;
    }else{
      if(!initialized){smoothedTarget.copy(target);initialized=true;}else smoothedTarget.lerp(target,expDamp(14,dt));
      const effectiveDistance=distance*cfg.distance+(1-intro)*5.5;
      // A posição fica atrás do alvo; o pitch controla principalmente a DIREÇÃO DO OLHAR,
      // não a altura orbital. Isso elimina a sensação vertical invertida da câmera antiga.
      const flatForwardX=-Math.sin(yaw),flatForwardZ=-Math.cos(yaw),shoulder=cfg.shoulder*intro;
      const pitchAssist=-Math.sin(pitch)*effectiveDistance*.18;
      desired.set(
        smoothedTarget.x-flatForwardX*effectiveDistance+right.x*shoulder,
        smoothedTarget.y+cfg.height+pitchAssist+(1-intro)*1.9,
        smoothedTarget.z-flatForwardZ*effectiveDistance+right.z*shoulder
      );
      const collision=resolveCollision(smoothedTarget,desired);lastCollision=collision.hit;
      camera.position.lerp(collision.position,expDamp(collision.hit?15:9.5,dt));
      lookTarget.copy(smoothedTarget).addScaledVector(forward,cfg.lookDistance||18);
      camera.lookAt(lookTarget);
    }
    const base=userFov||cfg.fov,runBoost=running&&moving>.1&&!['firstperson','cockpit'].includes(mode)?3.5:0;
    camera.fov=THREE.MathUtils.damp(camera.fov,base+runBoost,7,dt);camera.updateProjectionMatrix();
  }
  function onPointerDown(e){if(!inputEnabled||e.target!==canvas)return;pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);}
  function onPointerMove(e){if(!inputEnabled||e.pointerId!==pointer)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.0057*sensitivity;const verticalDelta=(invertY?dy:-dy)*.0042*sensitivity;pitch+=verticalDelta;clampPitch();}
  function onPointerEnd(e){if(e.pointerId===pointer)pointer=null;}
  function onWheel(e){if(!inputEnabled)return;if(mode!=='firstperson'&&mode!=='cockpit')distance=clamp(distance+Math.sign(e.deltaY)*.55,3.2,14);e.preventDefault();}
  function onContext(e){if(e.target===canvas)e.preventDefault();}
  canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('pointerup',onPointerEnd);canvas.addEventListener('pointercancel',onPointerEnd);canvas.addEventListener('wheel',onWheel,{passive:false});canvas.addEventListener('contextmenu',onContext);
  clampPitch();
  return{
    update,toggleMode,setMode,getMode,getYaw,setYaw,setPitch,getPitch,getDistance,setDistance,setFov,getFov,
    setSensitivity,getSensitivity:()=>sensitivity,setInvertY,getInvertY:()=>invertY,setInputEnabled,isInputEnabled:()=>inputEnabled,resetLook,
    isFirstPerson:()=>mode==='firstperson'||mode==='cockpit',isColliding:()=>lastCollision,
    dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('pointerdown',onPointerDown);canvas.removeEventListener('pointermove',onPointerMove);canvas.removeEventListener('pointerup',onPointerEnd);canvas.removeEventListener('pointercancel',onPointerEnd);canvas.removeEventListener('wheel',onWheel);canvas.removeEventListener('contextmenu',onContext);}
  };
}

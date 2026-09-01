import { MAP_ID, SCENE_ID, MAP_LABEL, MAP_VERSION, MAP_BOUNDS, MAP_SPAWN, MAP_RETURN_PORTAL, CHECKPOINTS, FINISH_ZONE, DESTINATIONS } from './world/labirinto-armadilhas-shared.js';
import { MAZE_WALLS, TRAPS, PRESSURE_PLATES, isTrapActive } from './world/labirinto-armadilhas-data.js';
import { createLabyrinthChallenge } from './world/labirinto-armadilhas-experiences.js';
import { createGlobalPlayerBridge } from './world/labirinto-armadilhas-player-bridge.js';
import { createLabyrinthUI } from './world/labirinto-armadilhas-ui.js';

function forwardRuntimeApi(context, runtime) {
  for (const name of ['getQuality','getFPS','getAvatarMode','toggleCamera','setCameraMode','setFov','getFov','setFPSCap','getFPSCap','setWorldTimeMode','getWorldTimeMode','setRun','jump','teleportTo','enterBuilding','exitBuilding','showChatMessage']) {
    if (!runtime[name] && typeof context[name] === 'function') runtime[name] = (...args)=>context[name](...args);
  }
  return runtime;
}

export function createLabirintoArmadilhas3D(context = {}) {
  const THREE=context.THREE||globalThis.THREE;
  if(!THREE) throw new Error(`[${MAP_ID}] Three.js não disponível`);
  const scene=context.scene;
  const camera=context.camera||context.cameraController?.getCamera?.();
  if(!scene||!camera) throw new Error(`[${MAP_ID}] scene/camera globais obrigatórias no runtime 3D`);

  const challenge=createLabyrinthChallenge(context);
  const playerBridge=createGlobalPlayerBridge(context);
  const objects=[], disposables=[]; let stopped=false,raf=0,last=performance.now(),lastResult='',lastCheckpoint='';
  const requestLobby=(reason)=>context.onChallengeEvent?.({type:'world-return-request',mapId:MAP_ID,reason,targetWorldId:MAP_RETURN_PORTAL.targetWorldId,targetSpawn:MAP_RETURN_PORTAL.targetSpawn,timestamp:Date.now()});
  const ui=createLabyrinthUI(context,{
    onGiveUp(){challenge.giveUp();ui.showReturning();},
    onRetry(){challenge.resetAttempt();playerBridge.teleportTo(MAP_SPAWN,'retry');lastResult='';lastCheckpoint='';},
    onReturnLobby(reason){requestLobby(reason||'button');ui.showReturning();}
  });
  const add=o=>{scene.add(o);objects.push(o);return o;};
  const own=d=>{disposables.push(d);return d;};

  const ambient=add(new THREE.HemisphereLight(0x8eb8df,0x161a20,1.05)); ambient.userData.mapId=MAP_ID;
  const dir=add(new THREE.DirectionalLight(0xffffff,1.15));dir.position.set(-25,48,18);dir.userData.mapId=MAP_ID;
  const floorGeo=own(new THREE.PlaneGeometry(98,98));floorGeo.rotateX(-Math.PI/2);
  const floorMat=own(new THREE.MeshStandardMaterial({color:0x17202a,roughness:.95,metalness:.02}));
  const floor=add(new THREE.Mesh(floorGeo,floorMat));floor.receiveShadow=true;floor.userData.mapId=MAP_ID;

  const wallMat=own(new THREE.MeshStandardMaterial({color:0x4a5664,roughness:.86}));
  for(const wall of MAZE_WALLS){const g=own(new THREE.BoxGeometry(wall.w,4.4,wall.d));const m=add(new THREE.Mesh(g,wallMat));m.position.set(wall.x,2.2,wall.z);m.castShadow=true;m.receiveShadow=true;m.userData={mapId:MAP_ID,wall};}

  const trapMeshes=[];
  for(const trap of TRAPS){
    let g;
    if(trap.kind==='saw') g=own(new THREE.CylinderGeometry(1.7,1.7,.35,20));
    else if(trap.shape==='box') g=own(new THREE.BoxGeometry(trap.w,.22,trap.d));
    else g=own(new THREE.CylinderGeometry(trap.radius*.82,trap.radius*.82,.24,12));
    const color=trap.kind==='laser'?0xff3a44:trap.kind==='saw'?0xc8d0da:trap.kind==='spikes'?0xff8b3d:0xa65cff;
    const mat=own(new THREE.MeshStandardMaterial({color,emissive:trap.kind==='laser'?0x630008:0x160c04,roughness:.45,metalness:trap.kind==='saw'?.8:.25,transparent:true,opacity:1}));
    const m=add(new THREE.Mesh(g,mat));m.position.set(trap.x,.16,trap.z);m.userData={mapId:MAP_ID,trap};trapMeshes.push(m);
  }

  const plateMat=own(new THREE.MeshStandardMaterial({color:0x208fe0,emissive:0x082c55,roughness:.35}));
  for(const plate of PRESSURE_PLATES){const g=own(new THREE.BoxGeometry(2.8,.15,2.8));const m=add(new THREE.Mesh(g,plateMat));m.position.set(plate.x,.08,plate.z);m.userData={mapId:MAP_ID,plate};}

  const cpMeshes=[];
  for(const cp of CHECKPOINTS){const g=own(new THREE.TorusGeometry(1.5,.22,10,24));const mat=own(new THREE.MeshStandardMaterial({color:new THREE.Color(cp.color),emissive:new THREE.Color(cp.color).multiplyScalar(.18)}));const m=add(new THREE.Mesh(g,mat));m.position.set(cp.x,1.8,cp.z);m.rotation.x=Math.PI/2;m.userData={mapId:MAP_ID,checkpoint:cp};cpMeshes.push(m);}
  const fg=own(new THREE.TorusGeometry(2.7,.38,12,28)), fm=own(new THREE.MeshStandardMaterial({color:0xffd54a,emissive:0x6a4b00}));const finish=add(new THREE.Mesh(fg,fm));finish.position.set(FINISH_ZONE.x,2.9,FINISH_ZONE.z);finish.userData.mapId=MAP_ID;

  context.registerWorldColliders?.({mapId:MAP_ID,scene:SCENE_ID,walls:MAZE_WALLS,bounds:MAP_BOUNDS});
  const abortHandler=()=>stop();context.signal?.addEventListener?.('abort',abortHandler,{once:true});

  function loop(t){
    if(stopped)return;const dt=Math.min(.05,(t-last)/1000||0);last=t;
    const pos=playerBridge.getPosition();
    if(pos){const event=challenge.update(pos,t);if(event?.action==='respawn')playerBridge.teleportTo(event.position,'trap-respawn');if(event?.action==='checkpoint'&&event.checkpoint.id!==lastCheckpoint){lastCheckpoint=event.checkpoint.id;ui.showCheckpoint(event.checkpoint);}if(event?.action==='checkpoint-locked')ui.showCheckpointLocked();if(event?.action==='finish-locked')ui.showFinishLocked();if(event?.action==='defeat'&&lastResult!=='defeat'){lastResult='defeat';ui.showDefeat(event.state);}if(event?.action==='finish'&&lastResult!=='finish'){lastResult='finish';ui.showVictory(event.state);}}
    for(const m of trapMeshes){const trap=m.userData.trap,active=isTrapActive(trap,t);m.material.opacity=active?1:.28;if(trap.kind==='saw'){m.rotation.z+=dt*7;m.rotation.x=Math.PI/2;}if(trap.kind==='falling-rock')m.position.y=active?1.7:.25;}
    for(const m of cpMeshes)m.rotation.z+=dt*.7;finish.rotation.y+=dt*.85;ui.update(challenge.snapshot());raf=requestAnimationFrame(loop);
  }

  function stop(){if(stopped)return;stopped=true;cancelAnimationFrame(raf);context.signal?.removeEventListener?.('abort',abortHandler);context.unregisterWorldColliders?.(MAP_ID);for(const o of objects)scene.remove(o);for(const d of new Set(disposables)){try{d.dispose?.();}catch{}}ui.destroy();}
  challenge.resetAttempt();raf=requestAnimationFrame(loop);

  return forwardRuntimeApi(context,{id:MAP_ID,scene:SCENE_ID,label:MAP_LABEL,version:MAP_VERSION,mode:'3d',stop,getDestinations:()=>DESTINATIONS,getChallengeState:challenge.snapshot,giveUp(){challenge.giveUp();ui.showReturning();},getReturnPortal:()=>MAP_RETURN_PORTAL});
}

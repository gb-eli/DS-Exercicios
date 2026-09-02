import { createCameraController } from './render/camera-controller.js?v=14.10.8.85-f83-gameplay-performance';
import { createAvatarSystem } from './characters/avatar-system.js?v=14.10.8.92-f90-graphics';
import { detectPerformanceProfile, chooseInitialQuality } from './render/performance-manager.js?v=14.10.8.92-f90-graphics';
import { captureRenderTelemetry } from './render/observability.js?v=14.10.8.83-o2';
import { specialWorldQualityProfile,applySpecialRendererQuality } from './render/special-world-quality.js?v=14.10.8.95-f93-special-graphics';
import { playerMoveSpeed } from './world/gameplay-settings.js?v=14.10.8.87-f85-gameplay';
import { remoteElevation,remoteHeading,remoteAppearance,applyRemoteAvatarState } from './social/remote-avatar-state.js?v=14.10.8.87-f85-map-realtime';

const THREE_URL='../vendor/three/three.module.min.js?v=14.10.8.66';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function mapWorldToPresence(bounds,x,z){
  const px=(Number(x)-bounds.minX)/Math.max(.0001,bounds.maxX-bounds.minX)*1600;
  const py=(Number(z)-bounds.minZ)/Math.max(.0001,bounds.maxZ-bounds.minZ)*1000;
  return{x:Math.round(clamp(Number.isFinite(px)?px:800,0,1600)),y:Math.round(clamp(Number.isFinite(py)?py:500,0,1000))};
}
export function mapPresenceToWorld(bounds,x,y){
  return{
    x:bounds.minX+(clamp(Number(x)||800,0,1600)/1600)*(bounds.maxX-bounds.minX),
    y:0,
    z:bounds.minZ+(clamp(Number(y)||500,0,1000)/1000)*(bounds.maxZ-bounds.minZ)
  };
}

function clonePosition(p,fallback){
  return{x:Number(p?.x??fallback.x)||0,y:Number(p?.y??fallback.y??0)||0,z:Number(p?.z??fallback.z)||0};
}
function pointNear(a,b,r=4){return Math.hypot((a?.x||0)-(b?.x||0),(a?.z||0)-(b?.z||0))<=r;}
function normalizeAreaEvent(event,fallback){return typeof event==='string'?event:(event?.area||event?.key||fallback);}
function normalizeInteriorEvent(event={}){
  return{inside:Boolean(event.inside??event.active),key:event.key||event.interiorId||null,label:event.label||event.name||event.interiorId||event.key||'',floor:Number.isFinite(event.floor)?event.floor:0};
}
function makeHostState(baseState,player){const host=Object.create(baseState||null);host.player=player;return host;}

function pluginCollectionCount(plugin,...methods){
  for(const method of methods){
    try{const value=plugin?.[method]?.();if(Array.isArray(value))return value.length;if(value&&typeof value==='object'&&Number.isFinite(value.size))return value.size;}catch(_){}
  }
  return null;
}

function inputBindings({onInteract,onMove,onRun,onJump}){
  const keys=new Set(),joy={x:0,y:0};let running=false,stopped=false,activePointer=null;
  const keydown=e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    keys.add(e.code);
    if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat)onInteract?.();
    if(e.code==='Space'&&!e.repeat)onJump?.();
    if(e.code==='ShiftLeft'||e.code==='ShiftRight'){running=true;onRun?.(true);}
  };
  const keyup=e=>{keys.delete(e.code);if(e.code==='ShiftLeft'||e.code==='ShiftRight'){running=false;onRun?.(false);}};
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
  const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');
  const updateJoy=e=>{if(!root)return;const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=Math.max(20,r.width*.32),len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),sx=dx*k,sy=dy*k;joy.x=sx/max;joy.y=sy/max;if(stick)stick.style.transform=`translate(calc(-50% + ${sx}px),calc(-50% + ${sy}px))`;};
  const pd=e=>{activePointer=e.pointerId;root?.setPointerCapture?.(activePointer);updateJoy(e);};
  const pm=e=>{if(e.pointerId===activePointer)updateJoy(e);};
  const pe=e=>{if(e.pointerId!==activePointer)return;activePointer=null;joy.x=joy.y=0;if(stick)stick.style.transform='translate(-50%,-50%)';};
  root?.addEventListener('pointerdown',pd);root?.addEventListener('pointermove',pm);root?.addEventListener('pointerup',pe);root?.addEventListener('pointercancel',pe);
  const runButton=document.getElementById('run-button'),jumpButton=document.getElementById('jump-button');
  const runDown=e=>{e.preventDefault();running=true;onRun?.(true);},runUp=e=>{e.preventDefault();running=false;onRun?.(false);},jumpTap=e=>{e.preventDefault();onJump?.();};
  runButton?.addEventListener('pointerdown',runDown);runButton?.addEventListener('pointerup',runUp);runButton?.addEventListener('pointercancel',runUp);jumpButton?.addEventListener('pointerdown',jumpTap);
  return{
    sample(){let x=((keys.has('KeyD')||keys.has('ArrowRight'))?1:0)-((keys.has('KeyA')||keys.has('ArrowLeft'))?1:0)+joy.x,z=((keys.has('KeyS')||keys.has('ArrowDown'))?1:0)-((keys.has('KeyW')||keys.has('ArrowUp'))?1:0)+joy.y,l=Math.hypot(x,z);if(l>1){x/=l;z/=l;l=1;}return{x,z,l,running};},
    setRun(v){running=!!v;onRun?.(running);},
    stop(){if(stopped)return;stopped=true;window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);root?.removeEventListener('pointerdown',pd);root?.removeEventListener('pointermove',pm);root?.removeEventListener('pointerup',pe);root?.removeEventListener('pointercancel',pe);runButton?.removeEventListener('pointerdown',runDown);runButton?.removeEventListener('pointerup',runUp);runButton?.removeEventListener('pointercancel',runUp);jumpButton?.removeEventListener('pointerdown',jumpTap);}
  };
}

function bridgeContext(context,config,hostState,player,updateHooks){
  const travelToWorld=(targetWorldId,targetSpawn)=>{
    if(String(targetWorldId||'')==='campus-ds'){
      context.onChallengeEvent?.({type:'world-return-request',mapId:config.worldId,reason:'portal',targetWorldId:'campus-ds',targetSpawn:targetSpawn||'default',timestamp:Date.now()});
      return true;
    }
    return false;
  };
  const teleportPlayer=target=>{if(!target)return false;Object.assign(player,clonePosition(target,player));return true;};
  return{
    ...context,
    state:hostState,
    player,
    getPlayerPosition:()=>({...player}),
    teleportPlayer,
    teleportTo:teleportPlayer,
    travelToWorld,
    registerWorldUpdate(fn){if(typeof fn!=='function')return()=>{};updateHooks.add(fn);return()=>updateHooks.delete(fn);},
    onAreaChange:event=>context.onAreaChange?.(normalizeAreaEvent(event,config.area)),
    onInteriorChange:event=>context.onInteriorChange?.(normalizeInteriorEvent(event)),
    onNpcInteraction:event=>{const content=event?.content;if(content)context.onChallengeEvent?.({type:'map-info',message:`${content.title||event?.npc?.name||'Informação'}${content.body?` — ${String(content.body).slice(0,150)}`:''}`});},
    onWorldInteraction:event=>{const item=event?.item;if(item)context.onChallengeEvent?.({type:'map-info',message:item.name||item.label||'Interação do mapa'});return{ok:true,action:item?.interaction||'interaction'};}
  };
}

function startPosition(context,config){
  if(context?.state?.player?.area===config.area)return config.presenceToWorld?.(context.state.player.x,context.state.player.y)||mapPresenceToWorld(config.bounds,context.state.player.x,context.state.player.y);
  return clonePosition(config.spawn,config.spawn);
}
function emitPlayer(context,config,player,plugin,moving=0,running=false,extra={}){
  const pp=config.worldToPresence?.(player.x,player.z)||mapWorldToPresence(config.bounds,player.x,player.z);
  const near=config.nearestObject?.(player,plugin)||plugin?.getFocusedInteraction?.()||null;
  context.onAreaChange?.(config.area);
  context.onPlayerState?.({x:pp.x,y:pp.y,area:config.area,worldId:config.worldId,scene:config.scene,interior:plugin?.getActiveInterior?.()||null,nearPortal:null,nearStudent:null,nearSeat:null,nearWorldObject:near,seated:false,moving,running,...extra});
}

export async function createPluginWorldLiteHost(context={},config={}){
  const player=startPosition(context,config),hostState=makeHostState(context.state,player),updateHooks=new Set();let stopped=false,raf=0,last=performance.now(),fps=60,frames=0,sampleStart=last;
  const bridged=bridgeContext(context,config,hostState,player,updateHooks);
  const plugin=await config.createPlugin(bridged);if(context.signal?.aborted){plugin?.stop?.();throw new DOMException('Aborted','AbortError');}
  const resolve=(from,desired)=>config.resolveMovement?.(plugin,from,desired)||plugin?.resolveMovement?.(from,desired,{activeInteriorId:plugin?.getActiveInterior?.()||null})||desired;
  const input=inputBindings({onInteract:()=>context.onInteract?.(),onRun:v=>plugin?.setRun?.(v),onJump:()=>plugin?.jump?.()});
  function frame(now){
    if(stopped||context.signal?.aborted)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000||.016);last=now;frames++;if(now-sampleStart>=1000){fps=Math.round(frames*1000/(now-sampleStart));frames=0;sampleStart=now;context.onPerf?.({fps,quality:'lite',profile:{scene:config.scene,compatHost:true}});}
    const move=input.sample(),speed=playerMoveSpeed(context.state,{running:move.running}),desired={x:player.x+move.x*speed*dt,y:player.y,z:player.z+move.z*speed*dt},next=resolve({...player},desired)||player;Object.assign(player,clonePosition(next,player));
    for(const fn of updateHooks)try{fn(dt);}catch(error){console.warn(`[${config.worldId}] world update hook`,error);}
    emitPlayer(context,config,player,plugin,move.l,move.running);
  }
  context.onQualityChange?.('lite');raf=requestAnimationFrame(frame);
  const api={
    ...plugin,
    id:config.worldId,scene:config.scene,mode:'lite',
    getFPS:()=>plugin?.getFPS?.()||fps,getQuality:()=>plugin?.getQuality?.()||'lite',getAvatarMode:()=>plugin?.getAvatarMode?.()||'third-person',
    getObservabilitySnapshot:()=>captureRenderTelemetry({fps:plugin?.getFPS?.()||fps,quality:'lite',npcCount:pluginCollectionCount(plugin,'getNpcSnapshots','getNPCs','getNpcs'),vehicleCount:pluginCollectionCount(plugin,'getVehicleSnapshots','getVehicles'),worldId:config.worldId,interior:plugin?.getActiveInterior?.()||null,source:'plugin-lite'}),
    setRun:v=>{input.setRun(v);plugin?.setRun?.(v);return!!v;},
    teleportTo(target){const destination=typeof target==='string'?plugin?.getDestinations?.()?.find?.(d=>d.id===target):target;if(!destination)return false;Object.assign(player,clonePosition(destination,player));plugin?.teleportTo?.(destination);return true;},
    interact(target,payload={}){if(plugin?.interact)return plugin.interact(target,payload);if(plugin?.interactFocused)return plugin.interactFocused(payload);return{ok:false,reason:'unsupported'};},
    stop(){if(stopped)return;stopped=true;cancelAnimationFrame(raf);input.stop();updateHooks.clear();plugin?.stop?.();}
  };
  return api;
}

function spriteLabelFactory(THREE){
  return (label,accent='#72e6ff',scale=7)=>{const c=document.createElement('canvas');c.width=512;c.height=112;const x=c.getContext('2d');x.fillStyle='rgba(3,10,15,.85)';x.beginPath();x.roundRect(4,4,504,104,18);x.fill();x.strokeStyle=accent;x.lineWidth=3;x.stroke();x.fillStyle='#f5fbff';x.font='800 30px Inter,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(label||'').slice(0,28),256,56);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(scale,scale*.22,1);return s;};
}

export async function createPluginWorld3DHost(context={},config={}){
  if(!context.canvas)throw new Error(`${config.worldId||'plugin'}_3d_canvas_missing`);
  const THREE=await import(THREE_URL);if(context.signal?.aborted)throw new DOMException('Aborted','AbortError');
  const profile=detectPerformanceProfile(),qualityStart=chooseInitialQuality(profile,context.initialQuality),renderer=new THREE.WebGLRenderer({canvas:context.canvas,antialias:qualityStart!=='low'&&!profile.mobile,alpha:false,powerPreference:profile.mobile?'low-power':'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;let specialVisual=specialWorldQualityProfile(qualityStart,profile,config.worldId);
  const scene=new THREE.Scene();scene.background=new THREE.Color(config.background||0x071018);scene.fog=new THREE.FogExp2(config.fog||0x071018,config.fogDensity||.0028);
  const camera=new THREE.PerspectiveCamera(Number(context.state?.graphics?.fov)||65,1,.08,620),player=startPosition(context,config),hostState=makeHostState(context.state,player),updateHooks=new Set();
  const bridged=bridgeContext({...context,THREE,scene,camera,threeScene:scene,scene3D:scene,worldScene:scene},config,hostState,player,updateHooks);
  bridged.THREE=THREE;bridged.scene=scene;bridged.camera=camera;
  bridged.getQuality=()=>qualityStart;bridged.getPerformanceProfile=()=>({...profile});
  // Compatibility aliases used by legacy plugin-map contracts (notably Colegio F7).
  bridged.threeScene=scene;bridged.scene3D=scene;bridged.worldScene=scene;
  const plugin=await config.createPlugin(bridged);if(context.signal?.aborted){plugin?.stop?.();renderer.dispose();throw new DOMException('Aborted','AbortError');}
  const labelSprite=spriteLabelFactory(THREE),avatarSystem=createAvatarSystem({THREE,spriteLabel:labelSprite,emojiSprite:e=>labelSprite(e,'#fff',2.4),quality:qualityStart,mobile:profile.mobile,hardware:profile.hardware,style:context.state?.avatarStyle||{},localUserId:context.state?.user?.id});await avatarSystem.init();if(context.signal?.aborted)throw new DOMException('Aborted','AbortError');
  const self=avatarSystem.createAvatar({accent:context.state?.avatarStyle?.accentCss||'#72e6ff',staff:['teacher','admin','super_admin'].includes(context.state?.profile?.role),label:(context.state?.profile?.full_name||'Você').split(' ')[0],seed:context.state?.user?.id||'local',appearanceOverride:context.state?.avatarStyle||null});self.position.set(player.x,0,player.z);scene.add(self);
  const others=new Map(),cameraController=createCameraController({THREE,camera,canvas:context.canvas,getCollisionRoots:()=>config.cameraCollisionRoots?.(plugin)||[],initialYaw:Math.PI,initialPitch:.38,initialDistance:8.2,initialFov:Number(context.state?.graphics?.fov)||65,initialSensitivity:Number(context.state?.graphics?.mouseSensitivity)||1});
  let stopped=false,raf=0,last=performance.now(),fps=60,frames=0,sampleStart=last,fpsCap=Number(context.state?.graphics?.fpsCap)||60,quality=qualityStart,vertical=0,playerY=0,onGround=true,sizeDirty=true,firstFrame=false;
  const resolve=(from,desired)=>config.resolveMovement?.(plugin,from,desired)||plugin?.resolveMovement?.(from,desired,{activeInteriorId:plugin?.getActiveInterior?.()||null})||desired;
  const input=inputBindings({onInteract:()=>context.onInteract?.(),onJump:()=>{if(onGround){vertical=7.4;onGround=false;}},onRun:v=>plugin?.setRun?.(v)});
  function syncOthers(time,dt){const seen=new Set();for(const o of context.state?.others||[]){if(o.area!==config.area)continue;seen.add(o.student_id);let e=others.get(o.student_id);const staff=['teacher','admin','super_admin'].includes(o.participant_role);if(!e){const avatar=avatarSystem.createAvatar({accent:staff?'#ffd166':'#72e6ff',staff,label:o.display_name||'Visitante',seed:o.student_id,appearanceOverride:remoteAppearance(o)});scene.add(avatar);e={avatar,target:new THREE.Vector3()};others.set(o.student_id,e);}const wp=config.presenceToWorld?.(o.x,o.y)||mapPresenceToWorld(config.bounds,o.x,o.y),jump=remoteElevation(o);e.target.set(wp.x,jump,wp.z);const before=e.avatar.position.clone();e.avatar.position.lerp(e.target,1-Math.exp(-10*dt));const dx=e.avatar.position.x-before.x,dz=e.avatar.position.z-before.z,sp=Math.hypot(dx,dz)/Math.max(.001,dt),rh=remoteHeading(o);if(rh!==null){const rd=(rh-e.avatar.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;e.avatar.rotation.y+=rd*Math.min(1,dt*12);}else if(sp>.03)e.avatar.rotation.y=Math.atan2(dx,dz);applyRemoteAvatarState(avatarSystem,e.avatar,o,{speed:sp,time,dt,jump});avatarSystem.applyLOD(e.avatar,self.position.distanceTo(e.avatar.position),{staff});}for(const[id,e]of others)if(!seen.has(id)){scene.remove(e.avatar);avatarSystem.disposeAvatar(e.avatar);others.delete(id);}}
  function resize(){if(!sizeDirty)return;sizeDirty=false;const r=context.canvas.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height));renderer.setPixelRatio(Math.min(devicePixelRatio||1,specialVisual.dpr));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const requestSize=()=>{sizeDirty=true;},ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(requestSize):null;ro?.observe(context.canvas);window.addEventListener('resize',requestSize,{passive:true});window.visualViewport?.addEventListener?.('resize',requestSize,{passive:true});
  const contextLost=e=>{e.preventDefault();context.onError?.(`O modo 3D de ${config.label||config.worldId} foi interrompido. Voltando para o mapa 2D.`);context.onContextLost?.();};context.canvas.addEventListener('webglcontextlost',contextLost,false);
  function frame(now){
    if(stopped||context.signal?.aborted)return;raf=requestAnimationFrame(frame);if(document.hidden){last=now;return;}const min=1000/Math.max(15,fpsCap);if(now-last<min*.35)return;resize();const dt=Math.min(.05,(now-last)/1000||.016);last=now;frames++;if(now-sampleStart>=1000){fps=Math.round(frames*1000/(now-sampleStart));frames=0;sampleStart=now;context.onPerf?.({fps,quality,worldId:config.worldId,profile:{scene:config.scene,compatHost:true}});}
    const move=input.sample(),yaw=cameraController.getYaw(),sy=Math.sin(yaw),cy=Math.cos(yaw),mx=move.x*cy+move.z*sy,mz=-move.x*sy+move.z*cy,speed=playerMoveSpeed(context.state,{running:move.running}),desired={x:player.x+mx*speed*dt,y:player.y,z:player.z+mz*speed*dt},next=resolve({...player},desired)||player;Object.assign(player,clonePosition(next,player));self.position.x=player.x;self.position.z=player.z;
    vertical-=19*dt;playerY+=vertical*dt;if(playerY<=0){playerY=0;vertical=0;onGround=true;}self.position.y=(Number(player.y)||0)+playerY;if(move.l>.03){const desiredRot=Math.atan2(mx,mz),delta=(desiredRot-self.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;self.rotation.y+=delta*Math.min(1,dt*9);}avatarSystem.animate(self,{speed:move.l*speed,jump:playerY,time:now/1000,vertical,dt});syncOthers(now/1000,dt);
    for(const fn of updateHooks)try{fn(dt);}catch(error){console.warn(`[${config.worldId}] world update hook`,error);}
    cameraController.update({playerPosition:self.position,moving:move.l,running:move.running,time:now/1000,dt});self.visible=!cameraController.isFirstPerson?.();emitPlayer(context,config,player,plugin,move.l,move.running,{onGround,elevation:playerY,heading:self.rotation.y,localAction:self.userData.localAction||null});renderer.render(scene,camera);if(!firstFrame){firstFrame=true;context.onFirstFrame?.();}
  }
  function setQuality(next){if(!['low','medium','high','ultra'].includes(next))return quality;quality=next;specialVisual=applySpecialRendererQuality(renderer,quality,profile,devicePixelRatio||1,config.worldId);avatarSystem.setQuality?.(quality);plugin?.setQuality?.(quality);sizeDirty=true;context.onQualityChange?.(quality);return quality;}
  plugin?.setQuality?.(quality);context.onQualityChange?.(quality);raf=requestAnimationFrame(frame);
  return{
    ...plugin,id:config.worldId,scene:config.scene,mode:'3d',setQuality,getQuality:()=>quality,getFPS:()=>fps,getAvatarMode:()=>avatarSystem.getMode?.()||cameraController.getMode?.()||'third-person',getObservabilitySnapshot:()=>captureRenderTelemetry({renderer,scene,fps,quality,npcCount:pluginCollectionCount(plugin,'getNpcSnapshots','getNPCs','getNpcs'),vehicleCount:pluginCollectionCount(plugin,'getVehicleSnapshots','getVehicles'),worldId:config.worldId,interior:plugin?.getActiveInterior?.()||null,source:'plugin3d'}),toggleCamera:()=>cameraController.toggleMode(),setCameraMode:m=>cameraController.setMode(m),getCameraMode:()=>cameraController.getMode(),setFov:v=>cameraController.setFov(v),getFov:()=>cameraController.getFov(),setMouseSensitivity:v=>cameraController.setSensitivity(v),getMouseSensitivity:()=>cameraController.getSensitivity(),setFPSCap:v=>(fpsCap=clamp(Number(v)||60,15,60)),getFPSCap:()=>fpsCap,setRun:v=>{input.setRun(v);plugin?.setRun?.(v);return!!v;},jump:()=>{if(onGround){vertical=7.4;onGround=false;}},
    teleportTo(target){const destination=typeof target==='string'?plugin?.getDestinations?.()?.find?.(d=>d.id===target):target;if(!destination)return false;Object.assign(player,clonePosition(destination,player));self.position.set(player.x,Number(player.y)||0,player.z);vertical=playerY=0;onGround=true;plugin?.teleportTo?.(destination);return true;},
    interact(target,payload={}){if(plugin?.interact)return plugin.interact(target,payload);if(plugin?.interactFocused)return plugin.interactFocused(payload);return{ok:false,reason:'unsupported'};},
    showChatMessage(senderId,message){const target=senderId===context.state?.user?.id?self:others.get(senderId)?.avatar;if(!target)return false;const bubble=labelSprite(String(message||'').slice(0,64),'#72e6ff',7);bubble.position.set(0,3.8,0);target.add(bubble);setTimeout(()=>{target.remove(bubble);bubble.material?.map?.dispose?.();bubble.material?.dispose?.();},5200);return true;},
    stop(){if(stopped)return;stopped=true;cancelAnimationFrame(raf);input.stop();updateHooks.clear();plugin?.stop?.();window.removeEventListener('resize',requestSize);window.visualViewport?.removeEventListener?.('resize',requestSize);ro?.disconnect?.();context.canvas.removeEventListener('webglcontextlost',contextLost,false);for(const[id,e]of others){scene.remove(e.avatar);avatarSystem.disposeAvatar(e.avatar);}others.clear();scene.remove(self);avatarSystem.disposeAvatar?.(self);cameraController.dispose();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose?.();for(const m of(Array.isArray(o.material)?o.material:[o.material])){m?.map?.dispose?.();m?.dispose?.();}});}
  };
}

export function nearestPortal(player,portal){return portal&&pointNear(player,portal,Math.max(4,Number(portal.radius)||4))?{...portal,distance:Math.hypot(player.x-portal.x,player.z-portal.z)}:null;}

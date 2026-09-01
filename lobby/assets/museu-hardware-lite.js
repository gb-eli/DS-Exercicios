import { loadMuseuHardwareRuntime } from './world/museu-hardware-data.js?v=0.8.0';
import {
  MUSEU_HARDWARE_BOUNDS,MUSEU_HARDWARE_SPAWN,MUSEU_HARDWARE_RETURN_PORTAL,MUSEU_HARDWARE_CENTER,MUSEU_HARDWARE_MEETING_POINT,
  MUSEU_HARDWARE_GALLERIES,MUSEU_HARDWARE_NPCS,MUSEU_HARDWARE_DESTINATIONS,
  museuHardwareWorldToPresence,museuHardwarePresenceToWorld,nearestMuseuHardwareObject,clampMuseuHardware,galleryByObjectId
} from './world/museu-hardware-shared.js?v=0.8.0';
import { playerMoveSpeed } from './world/gameplay-settings.js?v=14.10.8.87-f85-gameplay';
import { drawMuseumDemo2D } from './world/museu-hardware-exhibits.js?v=0.8.0';
import { museumCatalogItem,loadMuseumProgress,saveMuseumProgress,resetMuseumProgress,museumQuizAnswer,museumProgressSnapshot,MUSEU_HARDWARE_GUIDED_ORDER,loadMuseumSettings,saveMuseumSettings,museumSettingsSnapshot } from './world/museu-hardware-catalog.js?v=0.8.0';
import { createMuseuHardwareUI } from './museu-hardware-ui.js?v=0.8.0';
import { loadMuseumMediaManifest,createMuseumMediaController } from './world/museu-hardware-media.js?v=0.8.0';
import { loadMuseumCollection,galleryCollection,collectionItem,searchMuseumCollection } from './world/museu-hardware-collection.js?v=0.8.0';
import { captureRenderTelemetry } from './render/observability.js?v=14.10.8.83-o2';

const rgba=(hex,a=.2)=>{const h=String(hex||'#72e6ff').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export async function createMuseuHardwareLite({canvas,state,onInteract,onPlayerState,onAreaChange,onQualityChange,onPerf,onWorldTime,onFirstFrame,signal}={}){
  if(!canvas)throw new Error('museu_hardware_lite_canvas_missing');
  const [runtime,mediaManifest,collection]=await Promise.all([loadMuseuHardwareRuntime({signal}),loadMuseumMediaManifest({signal}),loadMuseumCollection({signal})]);if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('museu_hardware_lite_context_missing');
  const keys=new Set(),joy={x:0,y:0};let stopped=false,raf=0,last=performance.now(),lastGate=0,fps=60,frames=0,sampleStart=last,sizeDirty=true,firstFrame=false,running=false,fpsCap=Number(state?.graphics?.fpsCap)||60,quality='lite',worldTimeMode=state?.graphics?.worldTimeMode||'cycle',lastArea='museu-hardware';
  const start=state?.player?.area==='museu-hardware'?museuHardwarePresenceToWorld(state.player.x,state.player.y):MUSEU_HARDWARE_SPAWN;
  const player={x:start.x,z:start.z,dir:Math.PI};
  const chatBubbles=new Map();
  const walls=[
    {x:0,z:MUSEU_HARDWARE_BOUNDS.minZ-2,w:356,d:4},{x:0,z:MUSEU_HARDWARE_BOUNDS.maxZ+2,w:356,d:4},
    {x:MUSEU_HARDWARE_BOUNDS.minX-2,z:8,w:4,d:300},{x:MUSEU_HARDWARE_BOUNDS.maxX+2,z:8,w:4,d:300}
  ];
  const galleryObjects=MUSEU_HARDWARE_GALLERIES.flatMap(g=>[g.screen,g.exhibit]);
  const worldObjects=[MUSEU_HARDWARE_RETURN_PORTAL,...MUSEU_HARDWARE_NPCS,...galleryObjects];
  const galleryById=new Map(MUSEU_HARDWARE_GALLERIES.map(g=>[g.id,g]));
  let progress=loadMuseumProgress();const visitLog=progress.visited;let museumUI=null;
  let museumSettings=loadMuseumSettings();
  let reducedMotion=!!museumSettings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeCaption='';
  const mediaController=createMuseumMediaController({manifest:mediaManifest});

  function resize(){if(!sizeDirty)return;sizeDirty=false;const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height)),dpr=Math.min(devicePixelRatio||1,1.35);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}return{w,h};}
  const requestSize=()=>{sizeDirty=true;};const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(requestSize):null;ro?.observe(canvas);window.addEventListener('resize',requestSize,{passive:true});window.visualViewport?.addEventListener?.('resize',requestSize,{passive:true});
  const project=(x,z,w,h)=>{const sx=(w*.88)/(MUSEU_HARDWARE_BOUNDS.maxX-MUSEU_HARDWARE_BOUNDS.minX),sy=(h*.84)/(MUSEU_HARDWARE_BOUNDS.maxZ-MUSEU_HARDWARE_BOUNDS.minZ),s=Math.min(sx,sy);return{x:w/2+x*s,y:h/2+20+(z-8)*s,s};};
  const rr=(x,y,w,h,r,fill,stroke,lw=1)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}};
  const text=(value,x,y,{size=12,weight=700,color='#eefaff',align='left',alpha=1,maxWidth}={})=>{ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.font=`${weight} ${size}px Inter,system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(value??''),x,y,maxWidth);ctx.restore();};

  function drawShell(w,h){
    const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#071019');g.addColorStop(.58,'#0b1b25');g.addColorStop(1,'#111821');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const tl=project(MUSEU_HARDWARE_BOUNDS.minX,MUSEU_HARDWARE_BOUNDS.minZ,w,h),br=project(MUSEU_HARDWARE_BOUNDS.maxX,MUSEU_HARDWARE_BOUNDS.maxZ,w,h);rr(tl.x,tl.y,br.x-tl.x,br.y-tl.y,18,'#121c24','rgba(114,230,255,.28)',2);
    ctx.strokeStyle='rgba(255,255,255,.025)';ctx.lineWidth=1;for(let x=tl.x;x<br.x;x+=24){ctx.beginPath();ctx.moveTo(x,tl.y);ctx.lineTo(x,br.y);ctx.stroke();}for(let y=tl.y;y<br.y;y+=24){ctx.beginPath();ctx.moveTo(tl.x,y);ctx.lineTo(br.x,y);ctx.stroke();}
    const c=project(MUSEU_HARDWARE_CENTER.x,MUSEU_HARDWARE_CENTER.z,w,h),r=MUSEU_HARDWARE_CENTER.radius*c.s;ctx.fillStyle='rgba(35,67,83,.72)';ctx.beginPath();ctx.arc(c.x,c.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(114,230,255,.42)';ctx.lineWidth=2;ctx.stroke();
    for(let ring=1;ring<=3;ring++){ctx.strokeStyle=`rgba(114,230,255,${.12/ring})`;ctx.beginPath();ctx.arc(c.x,c.y,r*(.28+.17*ring),0,Math.PI*2);ctx.stroke();}
    text('MUSEU DO HARDWARE',c.x,c.y-7,{size:Math.max(10,13*c.s),weight:950,color:'#e9fbff',align:'center'});text('COMPUTADORES • CONSOLES • CULTURA',c.x,c.y+9,{size:Math.max(6,7*c.s),weight:800,color:'#72e6ff',align:'center'});
  }

  function drawGallery(g,w,h,t){
    const p=project(g.x,g.z,w,h),s=p.s,bw=g.w*s,bh=g.d*s,near=Math.hypot(player.x-g.x,player.z-g.z)<48;
    ctx.save();ctx.shadowColor=rgba(g.accent,.18);ctx.shadowBlur=near?14:5;rr(p.x-bw/2,p.y-bh/2,bw,bh,10,'rgba(8,18,25,.96)',rgba(g.accent,near?.74:.38),near?2:1);ctx.shadowBlur=0;
    ctx.fillStyle=rgba(g.accent,.12);ctx.fillRect(p.x-bw/2,p.y-bh/2,bw,Math.max(4,3*s));
    text(g.order,p.x-bw*.43,p.y-bh*.35,{size:Math.max(8,12*s),weight:950,color:g.accent});
    text(g.name,p.x,p.y-bh*.34,{size:Math.max(7,9*s),weight:900,color:'#f3fbff',align:'center',maxWidth:bw*.7});
    text(g.years,p.x,p.y-bh*.20,{size:Math.max(6,6.5*s),weight:800,color:g.accent,align:'center'});
    const screenW=bw*.62,screenH=bh*.33,screenX=p.x-screenW/2,screenY=p.y-bh*.08;rr(screenX-2,screenY-2,screenW+4,screenH+4,4,'#02070a',rgba(g.accent,.7),1);if(near&&!mediaController.isActive(g.id))mediaController.activate(g.id).catch(()=>{});else if(!near&&mediaController.isActive(g.id))mediaController.deactivate(g.id);const video=mediaController.getVideo(g.id);if(near&&video&&video.readyState>=2){try{ctx.drawImage(video,screenX,screenY,screenW,screenH);}catch{drawMuseumDemo2D(ctx,{demo:g.demo,accent:g.accent,t,x:screenX,y:screenY,w:screenW,h:screenH});}}else drawMuseumDemo2D(ctx,{demo:g.demo,accent:g.accent,t,x:screenX,y:screenY,w:screenW,h:screenH});
    const pedestalY=p.y+bh*.31;ctx.fillStyle='rgba(220,239,247,.18)';ctx.fillRect(p.x-bw*.28,pedestalY,bw*.56,Math.max(3,3*s));drawDeviceIcon(g,p.x,pedestalY-5*s,s);
    const secondary=galleryCollection(collection,g.id).slice(0,6),sw=Math.max(2.2,4.3*s),sy=p.y+bh*.42;secondary.forEach((item,i)=>{const sx=p.x+(i-(secondary.length-1)/2)*Math.max(5,7.1*s);ctx.fillStyle='rgba(220,239,247,.12)';ctx.fillRect(sx-sw/2,sy,sw,Math.max(2,1.8*s));ctx.fillStyle=rgba(g.accent,.55);ctx.fillRect(sx-Math.max(1,1.2*s),sy-Math.max(3,3.5*s),Math.max(2,2.4*s),Math.max(3,3.2*s));if(near&&s>.42)text(String(item.year),sx,sy+5*s,{size:Math.max(5,5.2*s),weight:800,color:g.accent,align:'center'});});
    if(visitLog.has(g.id)){ctx.fillStyle='#51e7a3';ctx.beginPath();ctx.arc(p.x+bw*.39,p.y-bh*.35,Math.max(2,2.4*s),0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function drawDeviceIcon(g,x,y,s){ctx.save();ctx.strokeStyle=g.accent;ctx.fillStyle=rgba(g.accent,.22);ctx.lineWidth=Math.max(1,s*.7);const k=g.device;if(k==='handheld'){rr(x-11*s,y-5*s,22*s,10*s,4*s,rgba(g.accent,.22),g.accent);ctx.fillStyle='#071017';ctx.fillRect(x-5*s,y-3*s,10*s,6*s);ctx.beginPath();ctx.arc(x-8*s,y,1.7*s,0,Math.PI*2);ctx.fillStyle=g.accent;ctx.fill();}else if(k==='arcade-cabinet'){ctx.beginPath();ctx.moveTo(x-7*s,y+7*s);ctx.lineTo(x-8*s,y-8*s);ctx.lineTo(x+7*s,y-8*s);ctx.lineTo(x+8*s,y+7*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#071017';ctx.fillRect(x-5*s,y-5*s,10*s,5*s);}else if(k==='gaming-pc'||k==='current-console'){rr(x-5*s,y-10*s,10*s,17*s,2*s,rgba(g.accent,.22),g.accent);ctx.fillStyle=g.accent;ctx.fillRect(x-3*s,y-8*s,6*s,1.3*s);ctx.fillRect(x-3*s,y-5*s,6*s,1.3*s);}else{rr(x-10*s,y-4*s,20*s,8*s,2*s,rgba(g.accent,.22),g.accent);ctx.fillStyle='#071017';ctx.fillRect(x-4*s,y-2*s,8*s,4*s);}ctx.restore();}
  function drawPortal(w,h,t){const p=project(MUSEU_HARDWARE_RETURN_PORTAL.x,MUSEU_HARDWARE_RETURN_PORTAL.z,w,h),s=p.s,r=Math.max(8,7*s);ctx.save();ctx.strokeStyle='#51e7a3';ctx.lineWidth=Math.max(2,2*s);ctx.shadowColor='#51e7a3';ctx.shadowBlur=12+Math.sin(t*3)*3;ctx.beginPath();ctx.arc(p.x,p.y,r,Math.PI,0);ctx.stroke();ctx.shadowBlur=0;text('VOLTAR AO CAMPUS',p.x,p.y-10*s,{size:Math.max(7,8*s),weight:900,color:'#b7ffd7',align:'center'});ctx.restore();}
  function drawNPCs(w,h,t){for(const n of MUSEU_HARDWARE_NPCS){const p=project(n.x,n.z,w,h),s=p.s,bob=reducedMotion?0:Math.sin(t*2+n.id.length)*1.5*s;ctx.fillStyle=n.accent;ctx.beginPath();ctx.arc(p.x,p.y-5*s+bob,3.2*s,0,Math.PI*2);ctx.fill();ctx.fillStyle=rgba(n.accent,.55);ctx.fillRect(p.x-2.5*s,p.y-2*s+bob,5*s,8*s);if(Math.hypot(player.x-n.x,player.z-n.z)<30)text(n.name,p.x,p.y-13*s,{size:Math.max(6,7*s),weight:850,color:n.accent,align:'center'});}}
  function drawOthers(w,h){for(const o of state?.others||[]){if(o.area!=='museu-hardware')continue;const wp=museuHardwarePresenceToWorld(o.x,o.y),p=project(wp.x,wp.z,w,h),s=p.s;ctx.fillStyle=['teacher','admin','super_admin'].includes(o.participant_role)?'#ffd166':'#72e6ff';ctx.beginPath();ctx.arc(p.x,p.y,3*s,0,Math.PI*2);ctx.fill();if(Math.hypot(player.x-wp.x,player.z-wp.z)<32)text(o.display_name||'Visitante',p.x,p.y-8*s,{size:Math.max(6,6.5*s),weight:800,color:'#eafaff',align:'center'});}}
  function drawPlayer(w,h){const p=project(player.x,player.z,w,h),s=p.s;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-player.dir);ctx.fillStyle=state?.avatarStyle?.accentCss||'#72e6ff';ctx.beginPath();ctx.moveTo(0,-6*s);ctx.lineTo(4*s,5*s);ctx.lineTo(0,3*s);ctx.lineTo(-4*s,5*s);ctx.closePath();ctx.fill();ctx.restore();}
  function drawCaption(w,h){if(!museumSettings.captions||!activeCaption)return;rr(16,h-62,Math.max(180,Math.min(w-32,540)),42,12,'rgba(3,10,16,.82)','rgba(114,230,255,.28)',1);text(activeCaption,28,h-41,{size:13,weight:800,color:'#eafcff',maxWidth:Math.max(150,Math.min(w-58,500))});}
  function drawChat(w,h){for(const[id,b]of chatBubbles){if(performance.now()>b.until){chatBubbles.delete(id);continue;}let wp;if(id===state?.user?.id)wp=player;else{const o=(state?.others||[]).find(x=>x.student_id===id);if(!o||o.area!=='museu-hardware')continue;wp=museuHardwarePresenceToWorld(o.x,o.y);}const p=project(wp.x,wp.z,w,h);text(b.message,p.x,p.y-18*p.s,{size:Math.max(6,6.5*p.s),weight:800,color:'#ffffff',align:'center',maxWidth:160});}}

  function nearestStudent(){let best=null,d=7;for(const o of state?.others||[]){if(o.area!=='museu-hardware')continue;const wp=museuHardwarePresenceToWorld(o.x,o.y),dist=Math.hypot(player.x-wp.x,player.z-wp.z);if(dist<d){d=dist;best=o;}}return best;}
  function activeArea(){let best={id:'museu-hardware',distance:Infinity};for(const g of MUSEU_HARDWARE_GALLERIES){const d=Math.hypot(player.x-g.x,player.z-g.z);if(d<best.distance&&d<Math.max(g.w,g.d)*.65)best={id:g.id,distance:d};}return best.id;}
  function canStand(x,z){return x>MUSEU_HARDWARE_BOUNDS.minX+2&&x<MUSEU_HARDWARE_BOUNDS.maxX-2&&z>MUSEU_HARDWARE_BOUNDS.minZ+2&&z<MUSEU_HARDWARE_BOUNDS.maxZ-2;}
  function move(dx,dz){const dist=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(dist/.75)),sx=dx/steps,sz=dz/steps;for(let i=0;i<steps;i++){const nx=player.x+sx,nz=player.z+sz;if(canStand(nx,player.z))player.x=nx;if(canStand(player.x,nz))player.z=nz;}}
  function localInspect(){const obj=nearestMuseuHardwareObject(player.x,player.z,worldObjects,10);if(!obj)return false;const gallery=galleryByObjectId(obj.id);return gallery&&(obj.type==='museum-exhibit'||obj.type==='museum-screen')?{...obj,gallery}:obj;}
  function exhibitInfo(id){const g=galleryByObjectId(id);if(!g)return null;return{...g,catalog:museumCatalogItem(g.id),visited:visitLog.has(g.id)};}
  function persist(){saveMuseumProgress(progress);return museumProgressSnapshot(progress);}
  function inspectExhibit(id){const info=exhibitInfo(id);if(!info)return null;visitLog.add(info.id);persist();return{...info,visited:true};}
  function submitQuiz(id,choice){const g=galleryByObjectId(id);if(!g)return null;const result=museumQuizAnswer(g.id,choice);if(!result)return null;progress.quiz[g.id]=!!result.correct;persist();return result;}
  function tourState(){const index=clamp(Number(progress.tour?.index)||0,0,MUSEU_HARDWARE_GUIDED_ORDER.length-1),galleryId=MUSEU_HARDWARE_GUIDED_ORDER[index],g=galleryById.get(galleryId);return{active:!!progress.tour?.active,index,galleryId,target:g?{x:g.x,z:g.z+Math.min(12,g.d*.34),name:g.name}:null,total:MUSEU_HARDWARE_GUIDED_ORDER.length};}
  function startGuidedTour(index=0){progress.tour={active:true,index:clamp(Number(index)||0,0,MUSEU_HARDWARE_GUIDED_ORDER.length-1)};persist();return tourState();}
  function stepGuidedTour(delta=1){if(!progress.tour?.active)return startGuidedTour(0);progress.tour.index=clamp((Number(progress.tour.index)||0)+(Number(delta)||1),0,MUSEU_HARDWARE_GUIDED_ORDER.length-1);persist();return tourState();}
  function stopGuidedTour(){progress.tour={active:false,index:Number(progress.tour?.index)||0};persist();return tourState();}
  function getMinimapData(){return{bounds:{...MUSEU_HARDWARE_BOUNDS},player:{x:player.x,z:player.z},galleries:MUSEU_HARDWARE_GALLERIES.map(g=>({id:g.id,order:g.order,name:g.name,accent:g.accent,x:g.x,z:g.z,w:g.w,d:g.d,visited:visitLog.has(g.id)})),portal:{...MUSEU_HARDWARE_RETURN_PORTAL}};}
  function computeActiveCaption(){if(!museumSettings.captions)return '';let best='',dist=24;for(const g of MUSEU_HARDWARE_GALLERIES){const d=Math.hypot(player.x-g.x,player.z-g.z);if(d<dist){dist=d;best=mediaController.caption(g.id)||'';}}return best;}

  const keydown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;keys.add(e.code);if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat){const obj=localInspect();if(obj&&(obj.type==='museum-exhibit'||obj.type==='museum-screen'||obj.type==='museum-guide')){if(!museumUI?.openNearest?.())onInteract?.();}else onInteract?.();}if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=true;};
  const keyup=e=>{keys.delete(e.code);if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=false;};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
  function bindJoystick(){const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');if(!root||!stick)return()=>{};let active=null;const update=e=>{const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=Math.max(18,r.width*.32),len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),x=dx*k,y=dy*k;joy.x=x/max;joy.y=y/max;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;};const down=e=>{active=e.pointerId;root.setPointerCapture?.(active);update(e);},mv=e=>{if(e.pointerId===active)update(e);},end=e=>{if(e.pointerId!==active)return;active=null;joy.x=joy.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',mv);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',mv);root.removeEventListener('pointerup',end);root.removeEventListener('pointercancel',end);};}
  const cleanJoy=bindJoystick();

  function frame(now){
    if(stopped||signal?.aborted)return;raf=requestAnimationFrame(frame);if(document.hidden){last=now;lastGate=0;return;}const minFrame=1000/Math.max(15,fpsCap||60);if(lastGate&&now-lastGate<minFrame-1)return;lastGate=now;const size=resize()||{w:canvas.clientWidth||1,h:canvas.clientHeight||1};const dt=Math.min(.05,(now-last)/1000||.016);last=now;frames++;if(now-sampleStart>=1000){fps=Math.round(frames*1000/(now-sampleStart));frames=0;sampleStart=now;onPerf?.({fps,quality:'lite',profile:{scene:'museu-hardware',reducedMotion}});}
    let ix=((keys.has('KeyD')||keys.has('ArrowRight'))?1:0)-((keys.has('KeyA')||keys.has('ArrowLeft'))?1:0)+joy.x,iz=((keys.has('KeyS')||keys.has('ArrowDown'))?1:0)-((keys.has('KeyW')||keys.has('ArrowUp'))?1:0)+joy.y,l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;}const speed=playerMoveSpeed(state,{running});if(l>.02){move(ix*speed*dt,iz*speed*dt);player.dir=Math.atan2(ix,iz);}
    activeCaption=computeActiveCaption();
    drawShell(size.w,size.h);const t=now/1000;for(const g of MUSEU_HARDWARE_GALLERIES)drawGallery(g,size.w,size.h,t);drawPortal(size.w,size.h,t);drawNPCs(size.w,size.h,t);drawOthers(size.w,size.h);drawPlayer(size.w,size.h);drawChat(size.w,size.h);drawCaption(size.w,size.h);
    const area=activeArea();if(area!==lastArea){lastArea=area;onAreaChange?.(area);}const nearWorldObject=localInspect(),nearStudent=nearestStudent(),pp=museuHardwareWorldToPresence(player.x,player.z);onPlayerState?.({x:pp.x,y:pp.y,area:'museu-hardware',nearPortal:null,nearStudent,nearSeat:null,nearWorldObject,seated:false,moving:l,running,onGround:true});
    if(!firstFrame){firstFrame=true;onFirstFrame?.();}
  }
  raf=requestAnimationFrame(frame);onQualityChange?.('lite');

  const api={
    getQuality:()=>quality,getFPS:()=>fps,getObservabilitySnapshot:()=>captureRenderTelemetry({fps,quality:'lite',npcCount:MUSEU_HARDWARE_NPCS.length,vehicleCount:0,worldId:'museu-hardware',interior:null,source:'museu-lite'}),getAvatarMode:()=>state?.avatarStyle?.preset||'casual',toggleCamera:()=>null,setCameraMode:()=>false,getCameraMode:()=> 'top',setFov:()=>false,getFov:()=>65,
    setFPSCap:v=>{fpsCap=clamp(Number(v)||60,15,60);return fpsCap;},getFPSCap:()=>fpsCap,setWorldTimeMode:m=>{worldTimeMode=['cycle','auto','day','night'].includes(m)?(m==='auto'?'cycle':m):'cycle';onWorldTime?.({mode:worldTimeMode,phase:'indoor',clock:'MUSEU'});return worldTimeMode;},getWorldTimeMode:()=>worldTimeMode,
    setRun:v=>{running=!!v;},jump:()=>false,showChatMessage(senderId,message){chatBubbles.set(senderId,{message:String(message||'').slice(0,84),until:performance.now()+6500});return true;},
    setLocalAction:()=>{},setLocalEmote(kind){chatBubbles.set(state?.user?.id||'local',{message:String(kind||'🎮').slice(0,8),until:performance.now()+3500});return true;},teleportTo(target){if(!target)return false;player.x=clampMuseuHardware(Number(target.x)||0,MUSEU_HARDWARE_BOUNDS.minX+3,MUSEU_HARDWARE_BOUNDS.maxX-3);player.z=clampMuseuHardware(Number(target.z)||0,MUSEU_HARDWARE_BOUNDS.minZ+3,MUSEU_HARDWARE_BOUNDS.maxZ-3);return true;},
    getDestinations:()=>MUSEU_HARDWARE_DESTINATIONS.map(x=>({...x})),getMuseumRuntime:()=>runtime,getMuseumCollection:()=>collection,getGalleryCollection:id=>galleryCollection(collection,id),getMuseumCollectionItem:id=>collectionItem(collection,id),searchMuseumCollection:q=>searchMuseumCollection(collection,q),getVisitedGalleries:()=>[...visitLog],getMuseumProgress:()=>museumProgressSnapshot(progress),getExhibitInfo:exhibitInfo,inspectExhibit,submitQuiz,startGuidedTour,stepGuidedTour,stopGuidedTour,getGuidedTourState:tourState,getMinimapData,getNearMuseumObject:localInspect,
    supportsInspection:()=>false,startInspection:()=>false,stopInspection:()=>false,rotateInspection:()=>false,getInspection:()=>null,getMuseumSettings:()=>museumSettingsSnapshot(museumSettings),updateMuseumSettings(next={}){museumSettings=saveMuseumSettings({...museumSettings,...next});reducedMotion=!!museumSettings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;return museumSettingsSnapshot(museumSettings);},getActiveCaption:()=>activeCaption,getMeetingPoint:()=>({...MUSEU_HARDWARE_MEETING_POINT}),goToMeetingPoint(){return this.teleportTo(MUSEU_HARDWARE_MEETING_POINT);},triggerReaction(kind){return this.setLocalEmote(kind);},
    resetMuseumProgress(){const fresh=resetMuseumProgress();visitLog.clear();for(const id of fresh.visited)visitLog.add(id);progress={...fresh,visited:visitLog};return museumProgressSnapshot(progress);},
    enterBuilding:()=>false,exitBuilding:()=>false,
    stop(){stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('resize',requestSize);window.visualViewport?.removeEventListener?.('resize',requestSize);ro?.disconnect?.();cleanJoy?.();chatBubbles.clear();mediaController.dispose();museumUI?.destroy?.();museumUI=null;}
  };
  museumUI=createMuseuHardwareUI({runtime:api});
  return api;
}

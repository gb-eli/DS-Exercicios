import { MAP_ID, SCENE_ID, MAP_LABEL, MAP_VERSION, MAP_BOUNDS, MAP_SPAWN, MAP_RETURN_PORTAL, CHECKPOINTS, FINISH_ZONE, DESTINATIONS } from './world/labirinto-armadilhas-shared.js';
import { MAZE_WALLS, TRAPS, PRESSURE_PLATES, ROUTE_POINTS, isTrapActive } from './world/labirinto-armadilhas-data.js';
import { createLabyrinthChallenge } from './world/labirinto-armadilhas-experiences.js';
import { createGlobalPlayerBridge } from './world/labirinto-armadilhas-player-bridge.js';
import { createLabyrinthUI } from './world/labirinto-armadilhas-ui.js';

function forwardRuntimeApi(context, runtime) {
  for (const name of ['getQuality','getFPS','getAvatarMode','toggleCamera','setCameraMode','setFov','getFov','setFPSCap','getFPSCap','setWorldTimeMode','getWorldTimeMode','setRun','jump','teleportTo','enterBuilding','exitBuilding','showChatMessage']) {
    if (!runtime[name] && typeof context[name] === 'function') runtime[name] = (...args)=>context[name](...args);
  }
  return runtime;
}

export function createLabirintoArmadilhasLite(context = {}) {
  const canvas=context.canvas;
  if(!canvas) throw new Error(`[${MAP_ID}] canvas obrigatório no runtime Lite`);
  const ctx=canvas.getContext('2d');
  if(!ctx) throw new Error(`[${MAP_ID}] Canvas2D indisponível`);

  const challenge=createLabyrinthChallenge(context);
  const playerBridge=createGlobalPlayerBridge(context);
  let stopped=false, raf=0, lastResult='', lastCheckpoint='';

  const requestLobby=(reason)=>context.onChallengeEvent?.({type:'world-return-request',mapId:MAP_ID,reason,targetWorldId:MAP_RETURN_PORTAL.targetWorldId,targetSpawn:MAP_RETURN_PORTAL.targetSpawn,timestamp:Date.now()});
  const ui=createLabyrinthUI(context,{
    onGiveUp(){challenge.giveUp();ui.showReturning();},
    onRetry(){challenge.resetAttempt();playerBridge.teleportTo(MAP_SPAWN,'retry');lastResult='';lastCheckpoint='';},
    onReturnLobby(reason){requestLobby(reason||'button');ui.showReturning();}
  });

  context.registerWorldColliders?.({mapId:MAP_ID,scene:SCENE_ID,walls:MAZE_WALLS,bounds:MAP_BOUNDS});
  const abortHandler=()=>stop();
  context.signal?.addEventListener?.('abort',abortHandler,{once:true});

  function resize(){const dpr=Math.min(2,window.devicePixelRatio||1),r=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);}
  const onKey=e=>{if(e.code==='Escape')ui.showPaused();};
  window.addEventListener('resize',resize);window.addEventListener('keydown',onKey);resize();

  function worldToScreen(x,z){const w=canvas.clientWidth||1,h=canvas.clientHeight||1,ww=MAP_BOUNDS.maxX-MAP_BOUNDS.minX,wh=MAP_BOUNDS.maxZ-MAP_BOUNDS.minZ,scale=Math.min(w/ww,h/wh)*.92;return{x:w/2+x*scale,y:h/2+z*scale,scale};}
  function drawCircle(x,z,r,color,alpha=1){const p=worldToScreen(x,z);ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,r*p.scale),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  function render(t){
    const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.fillStyle='#0d1319';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#27b7ff77';ctx.lineWidth=2;ctx.setLineDash([7,7]);ctx.beginPath();ROUTE_POINTS.forEach(([x,z],i)=>{const p=worldToScreen(x,z);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();ctx.setLineDash([]);
    for(const wall of MAZE_WALLS){const p=worldToScreen(wall.x,wall.z);ctx.fillStyle='#46505d';ctx.fillRect(p.x-wall.w*p.scale/2,p.y-wall.d*p.scale/2,wall.w*p.scale,wall.d*p.scale);}
    for(const trap of TRAPS){const active=isTrapActive(trap,t);const p=worldToScreen(trap.x,trap.z);ctx.globalAlpha=active?1:.28;ctx.fillStyle=trap.kind==='laser'?'#ff424d':trap.kind==='saw'?'#d8dde5':trap.kind==='spikes'?'#ff974d':'#b66cff';if(trap.shape==='box')ctx.fillRect(p.x-trap.w*p.scale/2,p.y-trap.d*p.scale/2,trap.w*p.scale,trap.d*p.scale);else drawCircle(trap.x,trap.z,trap.radius,ctx.fillStyle,ctx.globalAlpha);ctx.globalAlpha=1;}
    PRESSURE_PLATES.forEach(p=>drawCircle(p.x,p.z,p.radius,'#2fa9ff',.8));
    CHECKPOINTS.forEach(cp=>drawCircle(cp.x,cp.z,cp.radius,cp.color,.9));
    drawCircle(FINISH_ZONE.x,FINISH_ZONE.z,FINISH_ZONE.radius,'#ffd54a',.9);
    const portal=worldToScreen(MAP_RETURN_PORTAL.x,MAP_RETURN_PORTAL.z);ctx.strokeStyle='#35b7ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(portal.x,portal.y,11,0,Math.PI*2);ctx.stroke();
    const pos=playerBridge.getPosition();if(pos)drawCircle(pos.x,pos.z,.85,'#ffffff',1);
  }

  function tick(t){
    if(stopped)return;
    const pos=playerBridge.getPosition();
    if(pos){
      const event=challenge.update(pos,t);
      if(event?.action==='respawn')playerBridge.teleportTo(event.position,'trap-respawn');
      if(event?.action==='checkpoint'&&event.checkpoint.id!==lastCheckpoint){lastCheckpoint=event.checkpoint.id;ui.showCheckpoint(event.checkpoint);}
      if(event?.action==='checkpoint-locked')ui.showCheckpointLocked();
      if(event?.action==='finish-locked')ui.showFinishLocked();
      if(event?.action==='defeat'&&lastResult!=='defeat'){lastResult='defeat';ui.showDefeat(event.state);}
      if(event?.action==='finish'&&lastResult!=='finish'){lastResult='finish';ui.showVictory(event.state);}
    }
    ui.update(challenge.snapshot());render(t);raf=requestAnimationFrame(tick);
  }

  function stop(){if(stopped)return;stopped=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('keydown',onKey);context.signal?.removeEventListener?.('abort',abortHandler);context.unregisterWorldColliders?.(MAP_ID);ui.destroy();}
  challenge.resetAttempt();raf=requestAnimationFrame(tick);

  return forwardRuntimeApi(context,{id:MAP_ID,scene:SCENE_ID,label:MAP_LABEL,version:MAP_VERSION,mode:'lite',stop,getDestinations:()=>DESTINATIONS,getChallengeState:challenge.snapshot,giveUp(){challenge.giveUp();ui.showReturning();},getReturnPortal:()=>MAP_RETURN_PORTAL});
}

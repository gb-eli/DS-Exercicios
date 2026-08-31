import { WORLD_X, WORLD_Z, CAMPUS_ZONE_LAYOUT, CAMPUS_DECOR, presenceToWorld, worldToPresence, areaAtWorld } from './world/campus-manifest.js?v=14.10.8.65';
import { CAMPUS_EXPERIENCES, CAMPUS_TRAIN_STATIONS, CAMPUS_TRAIN_ROUTE, PARKOUR_PLATFORMS, LITE_PARKOUR_CHECKPOINTS, PARKOUR_START, nearestExperience } from './world/campus-experiences.js?v=14.10.8.65-stage28';
import { CAMPUS_DESTINATION_MAP } from './world/campus-destinations.js?v=14.10.8.65';
import { CAMPUS_CONNECTIONS, CAMPUS_DISTRICT_GATES, CAMPUS_SKYBRIDGES, CAMPUS_WAYFINDING } from './world/campus-connections.js?v=14.10.8.65';
import { CAMPUS_ROAD_HIERARCHY, CAMPUS_THEME_PLAZAS, CAMPUS_GARAGES, CAMPUS_CROSSWALKS, CAMPUS_PEDESTRIAN_BRIDGES, CAMPUS_STATION_PROFILES, CAMPUS_VALE_MONUMENTAL_LINK, CAMPUS_CITY_LANDMARKS } from './world/campus-city-network.js?v=14.10.8.65';
import { CAMPUS_INTERIOR_MAP, CAMPUS_INTERIOR_INTERACTIONS, interiorRoomStyle, contextualInteriorAnchor } from './world/campus-interiors.js?v=14.10.8.65-stage34';
import { CAMPUS_GARAGE_FLEET, CAMPUS_STATION_LINKS, CAMPUS_VALE_CEREMONIAL_GATE } from './world/campus-live-systems.js?v=14.10.8.65';
import { CAMPUS_TRAFFIC_ROUTES, CAMPUS_TRAFFIC_FLEET, CAMPUS_MOBILITY_TRACKS, CAMPUS_DRIVABLE_VEHICLES, CAMPUS_NPC_PATROLS, CAMPUS_DYNAMIC_SIGNS, CAMPUS_INTERIOR_SIGNATURES, resolveCampusCityEvent, resolveDynamicSign, sampleCampusRoute } from './world/campus-mobility-systems.js?v=14.10.8.65-stage28';
import { createCheckpointChallenge } from './game/challenge-manager.js?v=14.10.8.65';
import { createRideManager } from './game/ride-manager.js?v=14.10.8.65-stage28';
import { createTrainManager } from './game/train-manager.js?v=14.10.8.65-stage28';
import { resolveWorldTime, skyPalette } from './world/dynamic-world.js?v=14.10.8.65-stage31';
import { resolveWorldWeather, drawWorldWeather2D } from './world/weather-system.js?v=14.10.8.65-stage32';
import { campusSpaceIdentity } from './world/space-identities.js?v=14.10.8.65-stage29';
import { CAMPUS_AMBIENT } from './world/ambient-landscape.js?v=14.10.8.65-stage30';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const hexToRgba=(hex,a=.2)=>{const h=String(hex||'#36d2ff').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;};

export function createLobbyLite({canvas,zones,state,isStaff,onInteract,onPlayerState,onQualityChange,onAreaChange,onChallengeEvent,onWorldTime,onInteriorChange}){
  if(!canvas) throw new Error('Canvas do Lobby não encontrado.');
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx) throw new Error('Canvas 2D indisponível.');
  const keys=new Set(),joy={x:0,y:0};
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,saveData=!!navigator.connection?.saveData;
  let stopped=false,raf=0,last=performance.now(),running=false,jump=0,jumpV=0,lastArea='central',activeToolInterior=null,activeToolFloor=0,activeInteriorGuide=null,lastExteriorPosition=null,activeCampusVehicle=null,vehicleRideStartedAt=0,emote=null,emoteUntil=0,contextualState=null,contextualTransition=null,zoom=1,zoomTarget=1,panX=0,panZ=0,panTargetX=0,panTargetZ=0,sizeDirty=true,viewport={w:1,h:1,dpr:1},portraitMode=null,worldTimeMode=state.graphics?.worldTimeMode||'cycle',fpsCap=Number(state.graphics?.fpsCap)||60,lastRenderGate=0,lastWorldClock='',currentWorld=resolveWorldTime(worldTimeMode,Date.now(),state.worldTimeControl),currentWeather=resolveWorldWeather(state.worldWeatherControl),chatBubbles=new Map();
  const start=presenceToWorld(state.player?.x,state.player?.y);
  const player={x:start.x,z:start.z,dir:0};
  const contextLocked=()=>Boolean(contextualTransition)||['exam-running','exam-paused','lab-active'].includes(String(contextualState?.state||''));
  const portalPos=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.portal2d]));
  const campusBuildings=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.liteBuilding]));
  const treeSpots=CAMPUS_AMBIENT.trees,lampSpots=CAMPUS_DECOR.lamps,benchSpots=CAMPUS_DECOR.benches;
  const areaAt=(x,z)=>{if(activeToolInterior){const e=CAMPUS_INTERIOR_MAP[activeToolInterior]?.entrance;return e?areaAtWorld(e.x,e.z):'central';}return areaAtWorld(x,z);},toPresence=worldToPresence,toWorld=presenceToWorld;
  const teleportDestinations=[
    {id:'central',name:'Praça Central',x:0,z:0,kind:'landmark'},
    {id:'vale-portal',name:'Portal do Vale do Silício AGV',x:0,z:-12.5,kind:'portal'},
    {id:'1ds',name:'1DS — Laboratório',x:-22.5,z:-10.2,kind:'laboratory'},
    {id:'2ds',name:'2DS — Laboratório',x:22.5,z:-10.2,kind:'laboratory'},
    {id:'3ds',name:'3DS — Laboratório',x:-22.5,z:10.2,kind:'laboratory'},
    {id:'sub',name:'SUB — Laboratório',x:22.5,z:10.2,kind:'laboratory'},
    ...CAMPUS_CITY_LANDMARKS,
    ...CAMPUS_EXPERIENCES.filter(item=>item.type!=='vale-portal').map(item=>({id:item.id,name:item.name,x:item.entrance?.x??item.x,z:item.entrance?.z??item.z,kind:item.type}))
  ];

  const requestSize=()=>{sizeDirty=true;};
  const resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(requestSize):null;resizeObserver?.observe(canvas);window.addEventListener('resize',requestSize,{passive:true});window.visualViewport?.addEventListener?.('resize',requestSize,{passive:true});
  const resize=()=>{if(!sizeDirty)return viewport;sizeDirty=false;const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,saveData?1:1.35),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height)),portrait=w<640&&h>w*1.15;viewport={w,h,dpr};if(portrait!==portraitMode){portraitMode=portrait;zoomTarget=portrait?1.32:1;if(reducedMotion)zoom=zoomTarget;}if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}return viewport;};
  const metric=(w,h)=>Math.min(w/92,h/60)*zoom;
  const project=(x,z,w,h)=>({x:w/2+(x-panX)*metric(w,h),y:h/2+(z-panZ)*metric(w,h)});
  const rr=(x,y,w,h,r,fill,stroke,lw=1)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}};
  const text=(value,x,y,{size=12,weight=600,color='#eaf7ff',align='left',alpha=1}={})=>{ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.font=`${weight} ${size}px Inter,system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(value),x,y);ctx.restore();};
  const zoneForOther=o=>zones.find(z=>state.classes?.find(c=>c.id===o.class_id)?.code===z.code);
  const zoneCounts=()=>{const out={central:0,'1ds':0,'2ds':0,'3ds':0,sub:0};for(const o of state.others||[]){if(o.area==='vale-silicio')continue;const z=zoneForOther(o);out[z?.key||'central']=(out[z?.key||'central']||0)+1;}out[areaAt(player.x,player.z)]=(out[areaAt(player.x,player.z)]||0)+1;return out;};

  const attractionRef=experience=>{const point=experience.type==='tool-building'&&experience.entrance?experience.entrance:experience;return {...experience,x:point.x,z:point.z,type:experience.type,name:experience.name,label:experience.label,radius:experience.radius||3};};
  const challenge=createCheckpointChallenge({id:'parkour',title:'Circuito Parkour 2D',checkpoints:LITE_PARKOUR_CHECKPOINTS,start:PARKOUR_START,onEvent:onChallengeEvent});
  const rides=createRideManager({onEvent:onChallengeEvent,reducedMotion});
  const train=createTrainManager({onEvent:onChallengeEvent,reducedMotion});
  function startChallenge(id='parkour'){
    if(id!=='parkour')return false;
    rides.cancel({silent:true});return challenge.start();
  }
  const cancelChallenge=()=>challenge.cancel();
  const restartChallenge=()=>challenge.restart();
  const startExperience=id=>{challenge.cancel();const rideId=id==='tower'&&jump>8?'tower-down':id;return rides.start(rideId);};

  function drawBackground(w,h,time){
    currentWorld=resolveWorldTime(worldTimeMode,Date.now(),state.worldTimeControl);currentWeather=resolveWorldWeather(state.worldWeatherControl);const palette=skyPalette(currentWorld),g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,palette.top);g.addColorStop(.58,currentWorld.phase==='night'?'#071820':'#305f70');g.addColorStop(1,palette.bottom);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.5,h*.42,0,w*.5,h*.42,Math.max(w,h)*.62);glow.addColorStop(0,palette.glow);glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    if(currentWeather.id!=='clear'){ctx.fillStyle=currentWeather.id==='snow'?`rgba(216,229,231,${.08+.1*currentWeather.strength})`:currentWeather.id==='storm'?`rgba(15,25,39,${.17+.2*currentWeather.strength})`:`rgba(37,60,73,${.09+.12*currentWeather.strength})`;ctx.fillRect(0,0,w,h);}
    const celestialX=w*(.18+.64*((currentWorld.hour%24)/24)),celestialY=h*(currentWorld.phase==='night'?.15:.13);ctx.save();ctx.shadowBlur=20;ctx.shadowColor=currentWorld.phase==='night'?'rgba(190,220,255,.38)':'rgba(255,230,145,.45)';ctx.fillStyle=currentWorld.phase==='night'?'rgba(221,239,255,.9)':'rgba(255,238,170,.92)';ctx.beginPath();ctx.arc(celestialX,celestialY,currentWorld.phase==='night'?9:12,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.globalAlpha=currentWorld.phase==='night'?.18:.07;ctx.fillStyle='#d7f4ff';for(let i=0;i<(saveData?12:45);i++){const x=(i*173.31+time*2.2)%w,y=(i*97.17+time*.8)%h;ctx.beginPath();ctx.arc(x,y,(i%3)+.5,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    if(currentWorld.clock!==lastWorldClock){lastWorldClock=currentWorld.clock;onWorldTime?.(currentWorld);}
  }
  function pathLine(points,w,h,width=5,alpha=.95){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(36,62,72,.95)';ctx.lineWidth=width*metric(w,h);ctx.beginPath();points.forEach(([x,z],i)=>{const p=project(x,z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();ctx.strokeStyle='rgba(111,191,216,.13)';ctx.lineWidth=Math.max(1,.3*metric(w,h));ctx.stroke();ctx.globalAlpha=alpha;ctx.restore();}
  function drawLandscape(w,h,time){
    const s=metric(w,h);
    // Etapa 12: sem eixos duplicados; a malha oficial abaixo é a única fonte de ruas e passeios.
    // v14.10.8.65: malha de conexões funcionais entre praça, distritos e portas dos prédios.
    for(const connection of CAMPUS_CONNECTIONS){
      const pts=connection.nodes.map(n=>[n.x,n.z]);pathLine(pts,w,h,Math.max(1.15,connection.width*.92),.92);
      ctx.save();ctx.strokeStyle=hexToRgba(connection.accent,.46);ctx.lineWidth=Math.max(1,.11*metric(w,h));ctx.beginPath();connection.nodes.forEach((n,i)=>{const q=project(n.x,n.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.restore();
    }
    for(const bridge of CAMPUS_SKYBRIDGES){const a=CAMPUS_DESTINATION_MAP[bridge.from],b=CAMPUS_DESTINATION_MAP[bridge.to];if(!a||!b)continue;const pa=project(a.x,a.z,w,h),pb=project(b.x,b.z,w,h);ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=hexToRgba(bridge.accent,.5);ctx.lineWidth=Math.max(1.5,.14*metric(w,h));ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    for(const gate of CAMPUS_DISTRICT_GATES){const q=project(gate.x,gate.z,w,h),ms=metric(w,h);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(gate.rotation||0);rr(-2.35*ms,-.32*ms,4.7*ms,.64*ms,.16*ms,'rgba(5,18,24,.92)',hexToRgba(gate.accent,.58));text(gate.name,0,0,{size:Math.max(6,.36*ms),weight:900,color:gate.accent,align:'center'});ctx.restore();}
    for(const sign of CAMPUS_WAYFINDING){const q=project(sign.x,sign.z,w,h),ms=metric(w,h);rr(q.x-.95*ms,q.y-.48*ms,1.9*ms,.96*ms,.18*ms,'rgba(3,14,20,.86)',hexToRgba(sign.accent,.38));text('◆',q.x,q.y-.12*ms,{size:Math.max(6,.32*ms),weight:900,color:sign.accent,align:'center'});}
    // v14.10.8.65: cidade educacional — vias hierarquizadas, praças, garagens, passarelas e eixo monumental do Vale.
    const drawRectWorld=(x,z,ww,dd,fill,stroke=null)=>{const c=project(x,z,w,h),ms=metric(w,h);rr(c.x-ww*ms/2,c.y-dd*ms/2,ww*ms,dd*ms,Math.max(1,.12*ms),fill,stroke);};
    for(const road of CAMPUS_ROAD_HIERARCHY){const width=Math.max(1.1,road.width*.76);pathLine(road.nodes.map(n=>[n.x,n.z]),w,h,width,.94);ctx.save();ctx.strokeStyle=hexToRgba(road.accent,road.class==='arterial'?.34:.2);ctx.lineWidth=Math.max(1,.08*metric(w,h));ctx.beginPath();road.nodes.forEach((n,i)=>{const q=project(n.x,n.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.restore();}
    for(const plaza of CAMPUS_THEME_PLAZAS){const identity=campusSpaceIdentity(plaza.id),accent=identity?.accent||plaza.accent,q=project(plaza.x,plaza.z,w,h),ms=metric(w,h),distance=Math.hypot(player.x-plaza.x,player.z-plaza.z),near=distance<16;ctx.fillStyle=hexToRgba(accent,.08);ctx.beginPath();ctx.arc(q.x,q.y,plaza.radius*ms,0,Math.PI*2);ctx.fill();ctx.strokeStyle=hexToRgba(accent,.38);ctx.lineWidth=Math.max(1,.09*ms);ctx.stroke();text(identity?.icon||plaza.icon,q.x,q.y,{size:Math.max(8,.52*ms),weight:900,color:accent,align:'center'});if(near&&ms>.55)text(identity?.tagline||plaza.detail,q.x,q.y+Math.max(10,.8*ms),{size:Math.max(5,.27*ms),weight:820,color:'#bad9e2',align:'center',alpha:.86,maxWidth:150});}
    for(const garage of CAMPUS_GARAGES){drawRectWorld(garage.x,garage.z,garage.w,garage.d,'rgba(10,21,27,.9)',hexToRgba(garage.accent,.45));const q=project(garage.x,garage.z,w,h),ms=metric(w,h);text('P',q.x,q.y,{size:Math.max(7,.52*ms),weight:950,color:garage.accent,align:'center'});}
    for(const link of CAMPUS_STATION_LINKS){pathLine([[link.from.x,link.from.z],[link.to.x,link.to.z]],w,h,Math.max(1.4,metric(w,h)*.16),.46);}
    for(const vehicle of CAMPUS_GARAGE_FLEET){const garage=CAMPUS_GARAGES.find(item=>item.id===vehicle.garageId);if(!garage)continue;const q=project(garage.x+vehicle.slot,garage.z,w,h),ms=metric(w,h);rr(q.x-.42*ms,q.y-.25*ms,.84*ms,.5*ms,.12*ms,hexToRgba(vehicle.accent,.78),'rgba(235,250,255,.28)');text(vehicle.kind==='bike'?'◉':vehicle.kind==='drone'?'✣':vehicle.kind==='bus'?'▰':'▰',q.x,q.y,{size:Math.max(5,.28*ms),weight:900,color:'#eafcff',align:'center'});}
    // Fase 2.2: pista técnica usa o corredor viário existente; apenas bordas/identidade são sobrepostas no 2D.
    for(const track of CAMPUS_MOBILITY_TRACKS){const route=CAMPUS_TRAFFIC_ROUTES.find(item=>item.id===track.routeId);if(!route)continue;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=hexToRgba(track.accent,.72);ctx.lineWidth=Math.max(1.5,.16*metric(w,h));ctx.setLineDash([Math.max(3,.45*metric(w,h)),Math.max(4,.6*metric(w,h))]);ctx.beginPath();route.nodes.forEach((n,i)=>{const q=project(n.x,n.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    // v14.10.8.65: tráfego vivo, NPCs em circulação, sinalização dinâmica e evento urbano local.
    for(const vehicle of CAMPUS_TRAFFIC_FLEET){const pos=sampleCampusRoute(vehicle.routeId,vehicle.offset+time*vehicle.speed),q=project(pos.x,pos.z,w,h),ms=metric(w,h);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(-pos.heading);rr(-.55*ms,-.28*ms,1.1*ms,.56*ms,.16*ms,hexToRgba(vehicle.accent,.88),'rgba(238,252,255,.34)');text(vehicle.kind==='bike'?'◉':vehicle.kind==='bus'?'▰':'◆',0,0,{size:Math.max(5,.28*ms),weight:950,color:'#f2fdff',align:'center'});ctx.restore();}
    for(const npc of CAMPUS_NPC_PATROLS){const pos=sampleCampusRoute(npc.routeId,npc.offset+time*npc.speed),q=project(pos.x,pos.z,w,h),ms=metric(w,h);ctx.fillStyle=hexToRgba(npc.accent,.88);ctx.beginPath();ctx.arc(q.x,q.y,Math.max(3,.32*ms),0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(236,252,255,.58)';ctx.lineWidth=1;ctx.stroke();}
    const cityEvent=resolveCampusCityEvent(new Date()),eventPlaza=CAMPUS_THEME_PLAZAS.find(item=>item.id===cityEvent.plazaId);if(eventPlaza){const q=project(eventPlaza.x,eventPlaza.z,w,h),ms=metric(w,h),pulse=.65+.35*Math.sin(time*2.2);ctx.save();ctx.globalAlpha=pulse;ctx.strokeStyle=hexToRgba(cityEvent.accent,.9);ctx.lineWidth=Math.max(1.5,.12*ms);ctx.beginPath();ctx.arc(q.x,q.y,eventPlaza.radius*ms*.58,0,Math.PI*2);ctx.stroke();ctx.restore();text(cityEvent.icon,q.x,q.y-eventPlaza.radius*ms*.72,{size:Math.max(7,.4*ms),weight:950,color:cityEvent.accent,align:'center'});}
    for(const sign of CAMPUS_DYNAMIC_SIGNS){const q=project(sign.x,sign.z,w,h),ms=metric(w,h);rr(q.x-1.15*ms,q.y-.42*ms,2.3*ms,.84*ms,.18*ms,'rgba(3,14,20,.9)',hexToRgba(sign.accent,.56));text(resolveDynamicSign(sign,new Date(),cityEvent),q.x,q.y,{size:Math.max(5,.24*ms),weight:900,color:sign.accent,align:'center'});}
    {const gate=CAMPUS_VALE_CEREMONIAL_GATE,q=project(gate.x,gate.z,w,h),ms=metric(w,h);ctx.strokeStyle=hexToRgba(gate.accent,.86);ctx.lineWidth=Math.max(2,.16*ms);ctx.beginPath();ctx.moveTo(q.x-gate.width*.5*ms,q.y+1.1*ms);ctx.lineTo(q.x-gate.width*.5*ms,q.y-1.05*ms);ctx.lineTo(q.x+gate.width*.5*ms,q.y-1.05*ms);ctx.lineTo(q.x+gate.width*.5*ms,q.y+1.1*ms);ctx.stroke();text('PORTAL METROPOLITANO',q.x,q.y-1.4*ms,{size:Math.max(6,.32*ms),weight:950,color:gate.accent,align:'center'});}
    for(const cross of CAMPUS_CROSSWALKS){const count=6;for(let i=0;i<count;i++){const off=(i-(count-1)/2)*.36;if(cross.axis==='x')drawRectWorld(cross.x+off,cross.z,.18,cross.d*.82,'rgba(232,246,248,.55)');else drawRectWorld(cross.x,cross.z+off,cross.w*.82,.18,'rgba(232,246,248,.55)');}}
    for(const bridge of CAMPUS_PEDESTRIAN_BRIDGES){const q=project(bridge.x,bridge.z,w,h),ms=metric(w,h);ctx.save();ctx.strokeStyle=hexToRgba(bridge.accent,.8);ctx.lineWidth=Math.max(3,bridge.width*.22*ms);ctx.beginPath();if(bridge.axis==='z'){ctx.moveTo(q.x,q.y-bridge.length*ms/2);ctx.lineTo(q.x,q.y+bridge.length*ms/2);}else{ctx.moveTo(q.x-bridge.length*ms/2,q.y);ctx.lineTo(q.x+bridge.length*ms/2,q.y);}ctx.stroke();ctx.restore();}
    const valeNodes=CAMPUS_VALE_MONUMENTAL_LINK.nodes.map(n=>[n.x,n.z]);pathLine(valeNodes,w,h,Math.max(4,CAMPUS_VALE_MONUMENTAL_LINK.width*.82),.98);for(const z of CAMPUS_VALE_MONUMENTAL_LINK.arches){const q=project(0,z,w,h),ms=metric(w,h);rr(q.x-3.0*ms,q.y-.24*ms,6.0*ms,.48*ms,.12*ms,'rgba(8,40,34,.92)',hexToRgba(CAMPUS_VALE_MONUMENTAL_LINK.accent,.72));}
    // Etapa 12: base urbana legada removida para evitar duplicação de ruas e pista sobre a cidade atual.
    // Monotrilho e estações — viga principal + linha-guia visual.
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(30,42,54,.92)';ctx.lineWidth=Math.max(3,.28*metric(w,h));ctx.beginPath();CAMPUS_TRAIN_ROUTE.forEach((node,i)=>{const q=project(node.x,node.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.strokeStyle='rgba(181,140,255,.7)';ctx.lineWidth=Math.max(1,.075*metric(w,h));ctx.stroke();ctx.restore();
    // Montanha-russa panorâmica tem circuito próprio, independente do monotrilho.
    {const route=CAMPUS_RIDES.coaster.nodes;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(181,140,255,.18)';ctx.lineWidth=Math.max(2,.18*metric(w,h));ctx.beginPath();route.forEach((node,i)=>{const q=project(node.x,node.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.strokeStyle='rgba(221,202,255,.5)';ctx.lineWidth=Math.max(1,.055*metric(w,h));ctx.stroke();ctx.restore();}
    for(const st of CAMPUS_TRAIN_STATIONS){const profile=CAMPUS_STATION_PROFILES[st.id]||{name:st.name,code:st.id.toUpperCase(),accent:st.accent};const q=project(st.x,st.z,w,h),ms=metric(w,h);rr(q.x-1.35*ms,q.y-.52*ms,2.7*ms,1.04*ms,.2*ms,'rgba(16,12,28,.9)',hexToRgba(profile.accent,.62));text(`${profile.code} • ${profile.name}`,q.x,q.y,{size:Math.max(5,.28*ms),weight:900,color:profile.accent,align:'center'});}
    const trainPos=train.sampleVisual(time*1000),tq=project(trainPos.x,trainPos.z,w,h),ms=metric(w,h);ctx.save();ctx.translate(tq.x,tq.y);ctx.rotate(-trainPos.heading);rr(-.9*ms,-.38*ms,1.8*ms,.76*ms,.28*ms,'#b58cff','rgba(235,222,255,.72)');rr(-.58*ms,-.22*ms,1.16*ms,.28*ms,.08*ms,'rgba(18,35,50,.92)');ctx.restore();
    const p=project(0,0,w,h);ctx.save();ctx.shadowColor='rgba(54,210,255,.13)';ctx.shadowBlur=18;ctx.fillStyle='#10252d';ctx.beginPath();ctx.arc(p.x,p.y,10.9*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(95,205,236,.42)';ctx.lineWidth=Math.max(1,1.0);ctx.beginPath();ctx.arc(p.x,p.y,10.25*s,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(95,205,236,.1)';ctx.beginPath();ctx.arc(p.x,p.y,7.4*s,0,Math.PI*2);ctx.stroke();ctx.restore();
    // Wayfinding enxuto: quatro eixos, sem repetir placas sobre as atrações.
    for(const [x,z,label,accent] of[[0,-10.8,'VALE / PROVAS ↓','#51e7a3'],[0,10.8,'EIXO ACADÊMICO ↑','#36d2ff'],[-11.0,0,'TECH OESTE ←','#ff7fd5'],[11.0,0,'INOVAÇÃO →','#61e7a6']]){const sp=project(x,z,w,h);rr(sp.x-2.05*s,sp.y-.5*s,4.1*s,1.0*s,.28*s,'rgba(3,14,20,.78)',hexToRgba(accent,.24));text(label,sp.x,sp.y,{size:Math.max(6,.42*s),weight:850,color:accent,align:'center'});}
    for(const tree of treeSpots){const {x,z,shape='broad',tone='#2f7d59'}=tree,p=project(x,z,w,h),r=Math.max(3,.7*s*(tree.scale||1));ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(p.x+2,p.y+3,r*1.3,r*.5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=tone;ctx.beginPath();if(shape==='tall')ctx.ellipse(p.x,p.y,r*.58,r*1.08,0,0,Math.PI*2);else if(shape==='compact')ctx.ellipse(p.x,p.y,r*.9,r*.72,0,0,Math.PI*2);else ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(143,242,189,.22)';ctx.beginPath();ctx.arc(p.x-r*.24,p.y-r*.28,r*.4,0,Math.PI*2);ctx.fill();}
    for(const [x,z] of lampSpots){const p=project(x,z,w,h),pulse=.45+.25*Math.sin(time*2+x);ctx.fillStyle=`rgba(141,227,255,${pulse})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.8,.22*s),0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(150,214,230,.28)';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(4,.7*s),0,Math.PI*2);ctx.stroke();}
    for(const [x,z,rot] of benchSpots){const p=project(x,z,w,h);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(rot);rr(-1.3*s,-.28*s,2.6*s,.56*s,.18*s,'#24343c','rgba(142,194,211,.22)');ctx.restore();}
  }

  function drawExperience(exp,w,h,time){
    const p=project(exp.x,exp.z,w,h),s=metric(w,h),accent=exp.accent,pulse=.5+.5*Math.sin(time*2+exp.x*.13);
    ctx.save();ctx.translate(p.x,p.y);
    if(exp.type==='vale-portal'){
      // v14.10.8.65: entrada monumental e legível já na primeira tela 2D.
      const portalPulse=.55+.45*Math.sin(time*2.4);
      ctx.shadowColor=hexToRgba(accent,.58);ctx.shadowBlur=(12+portalPulse*12)*Math.max(.7,s*.2);
      rr(-3.85*s,-2.45*s,7.7*s,4.85*s,.65*s,'rgba(4,24,24,.88)',hexToRgba(accent,.55),Math.max(1,.12*s));
      ctx.shadowBlur=0;
      // pilares + travessa formam um marco arquitetônico, não apenas um círculo pequeno.
      rr(-3.25*s,-1.95*s,.48*s,3.85*s,.16*s,'rgba(31,63,62,.96)',hexToRgba(accent,.8));
      rr(2.77*s,-1.95*s,.48*s,3.85*s,.16*s,'rgba(31,63,62,.96)',hexToRgba(accent,.8));
      rr(-3.15*s,-2.18*s,6.3*s,.52*s,.18*s,'rgba(20,53,52,.98)',hexToRgba(accent,.9));
      ctx.strokeStyle=hexToRgba(accent,.98);ctx.lineWidth=Math.max(2,.22*s);ctx.beginPath();ctx.arc(0,.18*s,2.45*s,Math.PI*.08,Math.PI*1.92);ctx.stroke();
      ctx.fillStyle=hexToRgba(accent,.11+.06*portalPulse);ctx.beginPath();ctx.arc(0,.18*s,2.0*s,0,Math.PI*2);ctx.fill();
      for(let i=0;i<3;i++){ctx.strokeStyle=hexToRgba(accent,.2+i*.09);ctx.lineWidth=Math.max(1,.055*s);ctx.beginPath();ctx.arc(0,.18*s,(1.15+i*.34)*s+Math.sin(time*2+i)*.09*s,0,Math.PI*2);ctx.stroke();}
      // faixa de destino: visível mesmo quando o aluno ainda está na praça.
      rr(-3.1*s,1.55*s,6.2*s,.62*s,.22*s,'rgba(2,16,19,.94)',hexToRgba(accent,.48));
      text('EMPRESAS DOS ALUNOS',0,1.86*s,{size:Math.max(7,.44*s),weight:900,color:'#caffdf',align:'center'});
      text('27 empresas • 8 distritos',0,2.35*s,{size:Math.max(6,.34*s),weight:780,color:'#8ff2bd',align:'center'});
    }else if(exp.type==='tool-building'){
      const arch=exp.architecture||'campus-hall',fp=exp.footprint||{width:7.2,depth:5.2,height:6.4};
      const bw=Math.max(5.2,Math.min(7.5,fp.width*.82))*s,bh=Math.max(3.5,Math.min(5.0,fp.depth*.8))*s;
      rr(-bw/2,-bh/2,bw,bh,.46*s,'rgba(7,24,32,.96)',hexToRgba(accent,.72),Math.max(1,.11*s));
      if(arch==='observatory'){
        ctx.fillStyle=hexToRgba(accent,.14);ctx.beginPath();ctx.arc(0,-.18*s,2.05*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle=hexToRgba(accent,.75);ctx.lineWidth=Math.max(1.4,.11*s);ctx.stroke();ctx.beginPath();ctx.arc(0,-.18*s,1.35*s,Math.PI,Math.PI*2);ctx.stroke();
      }else if(arch==='cyber-fortress'){
        for(const x of[-2.5,2.5])rr((x-.32)*s,-1.8*s,.64*s,3.6*s,.1*s,'rgba(4,13,18,.98)',hexToRgba(accent,.72));for(let y=-1.25;y<=1.25;y+=.62)rr(-1.7*s,(y-.12)*s,3.4*s,.24*s,.05*s,hexToRgba(accent,.12),hexToRgba(accent,.36));
      }else if(arch==='arcade'){
        rr(-2.85*s,-1.75*s,5.7*s,.7*s,.18*s,'rgba(20,9,28,.96)',hexToRgba(accent,.85));for(const x of[-2.35,2.35])rr((x-.12)*s,-1.55*s,.24*s,3.0*s,.08*s,hexToRgba(accent,.5),null);
      }else if(arch==='bank'){
        for(const x of[-1.8,-.6,.6,1.8])rr((x-.13)*s,-1.15*s,.26*s,2.3*s,.08*s,'rgba(61,82,84,.92)',hexToRgba(accent,.35));rr(-2.4*s,-1.55*s,4.8*s,.36*s,.08*s,hexToRgba(accent,.12),hexToRgba(accent,.45));
      }else if(arch==='store'){
        rr(-2.55*s,-1.45*s,5.1*s,2.9*s,.25*s,hexToRgba(accent,.08),hexToRgba(accent,.52));for(const x of[-1.55,1.55])rr((x-.62)*s,-.75*s,1.24*s,1.5*s,.12*s,hexToRgba(accent,.17),hexToRgba(accent,.44));
      }else if(arch==='research-lab'){
        rr(-2.6*s,-1.65*s,3.6*s,3.3*s,.22*s,'rgba(9,28,36,.96)',hexToRgba(accent,.5));rr(1.15*s,-1.9*s,1.5*s,3.8*s,.25*s,hexToRgba(accent,.1),hexToRgba(accent,.62));ctx.strokeStyle=hexToRgba(accent,.7);ctx.beginPath();ctx.arc(1.9*s,.75*s,.6*s,0,Math.PI*2);ctx.stroke();
      }else if(arch==='innovation-center'){
        rr(-.8*s,-1.9*s,2.0*s,3.8*s,.22*s,hexToRgba(accent,.1),hexToRgba(accent,.56));rr(-2.65*s,-.75*s,1.8*s,2.4*s,.2*s,'rgba(11,31,35,.94)',hexToRgba(accent,.38));
      }else if(arch==='challenge-arena'){
        rr(-2.55*s,-1.2*s,5.1*s,2.4*s,.7*s,'rgba(27,28,22,.94)',hexToRgba(accent,.5));ctx.strokeStyle=hexToRgba(accent,.8);ctx.lineWidth=Math.max(1.5,.12*s);ctx.beginPath();ctx.arc(0,-.3*s,1.35*s,0,Math.PI*2);ctx.stroke();
      }else if(arch==='exam-center'){
        rr(-2.75*s,-1.65*s,5.5*s,3.3*s,.25*s,'rgba(25,29,31,.96)',hexToRgba(accent,.42));for(const x of[-1.75,-.6,.6,1.75])rr((x-.1)*s,-1.15*s,.2*s,2.3*s,.05*s,'rgba(117,128,129,.5)',null);
      }else{
        rr(-2.65*s,-1.5*s,5.3*s,3.0*s,.28*s,'rgba(10,29,37,.95)',hexToRgba(accent,.5));rr(-1.85*s,-1.05*s,3.7*s,.55*s,.1*s,hexToRgba(accent,.12),hexToRgba(accent,.36));
      }
      for(const x of[-1.55,0,1.55])for(const y of[-.55,.45])rr((x-.4)*s,(y-.25)*s,.8*s,.5*s,.07*s,hexToRgba(accent,.09),hexToRgba(accent,.28));
      const ex=(exp.entrance?.x??exp.x)-exp.x,ez=(exp.entrance?.z??exp.z)-exp.z;rr((ex-.72)*s,(ez-.45)*s,1.44*s,.9*s,.16*s,hexToRgba(accent,.18),hexToRgba(accent,.82));text('ENTRADA',ex*s,ez*s,{size:Math.max(5,.29*s),weight:900,color:'#effcff',align:'center'});
      text(exp.icon||'◆',0,-1.38*s,{size:Math.max(10,.76*s),weight:900,color:accent,align:'center'});
      if(exp.district)text(exp.district.toUpperCase(),0,1.58*s,{size:Math.max(5,.3*s),weight:800,color:'#9fc4d1',align:'center'});
    }else if(exp.type==='pool'){
      rr(-3.1*s,-1.9*s,6.2*s,3.8*s,.7*s,'rgba(24,101,137,.58)',hexToRgba(accent,.72),Math.max(1,.12*s));
      for(let i=-2;i<=2;i++){ctx.strokeStyle=`rgba(117,226,255,${.15+.12*pulse})`;ctx.lineWidth=Math.max(1,.08*s);ctx.beginPath();ctx.moveTo(-2.55*s,(i*.55+.12*Math.sin(time*2+i))*s);ctx.quadraticCurveTo(0,(i*.55+.35*Math.sin(time*2.3+i))*s,2.55*s,(i*.55+.12*Math.cos(time*2+i))*s);ctx.stroke();}
      rr(-3.55*s,-2.3*s,7.1*s,.28*s,.12*s,'rgba(74,103,112,.85)',null);
      ctx.strokeStyle='rgba(225,252,255,.6)';ctx.lineWidth=Math.max(1,.08*s);ctx.beginPath();ctx.arc(1.45*s,-.45*s,.55*s,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(255,209,102,.52)';ctx.beginPath();ctx.arc(1.45*s,-.45*s,.25*s,0,Math.PI*2);ctx.fill();
    }else if(exp.type==='parkour'){
      PARKOUR_PLATFORMS.forEach((platform,i)=>{const x=platform.x-exp.x,z=platform.z-exp.z,ww=platform.w*s,dd=platform.d*s;rr((x-platform.w/2)*s,(z-platform.d/2)*s,ww,dd,.16*s,hexToRgba(accent,platform.checkpoint?.22+.05*i:.16),hexToRgba(accent,platform.checkpoint?.68:.38));if(platform.checkpoint){ctx.fillStyle=hexToRgba(accent,.38);ctx.fillRect((x-platform.w*.32)*s,(z-platform.d*.32)*s,platform.w*.64*s,Math.max(.1,platform.h*.07*s));text(i,x*s,z*s,{size:Math.max(7,.42*s),weight:950,color:'#fff',align:'center'});}});
    }else if(exp.type==='playground'){
      ctx.strokeStyle=hexToRgba(accent,.78);ctx.lineWidth=Math.max(1.4,.12*s);
      ctx.beginPath();ctx.moveTo(-2.4*s,1.5*s);ctx.lineTo(-1.4*s,-1.6*s);ctx.lineTo(-.4*s,1.5*s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(.2*s,-1.35*s);ctx.lineTo(1.9*s,-1.35*s);ctx.lineTo(2.5*s,1.35*s);ctx.stroke();
      ctx.fillStyle=hexToRgba(accent,.26);ctx.beginPath();ctx.arc(1.8*s,.65*s,.55*s,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=hexToRgba(accent,.5);ctx.beginPath();ctx.moveTo(-.2*s,1.45*s);ctx.lineTo(2.2*s,.55*s);ctx.stroke();ctx.fillStyle='rgba(255,209,102,.25)';ctx.beginPath();ctx.arc(-1.6*s,.3*s,.48*s,0,Math.PI*2);ctx.fill();
    }else if(exp.type==='slide'){
      ctx.strokeStyle=hexToRgba(accent,.85);ctx.lineWidth=Math.max(2,.18*s);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-2.2*s,-1.45*s);ctx.quadraticCurveTo(.2*s,-.9*s,2.3*s,1.55*s);ctx.stroke();
      for(let i=0;i<4;i++){ctx.strokeStyle='rgba(215,250,228,.25)';ctx.lineWidth=Math.max(1,.06*s);ctx.beginPath();ctx.moveTo((-2+i*.55)*s,-1.55*s);ctx.lineTo((-2+i*.55)*s,.15*s);ctx.stroke();}
      rr(-2.55*s,-1.8*s,1.4*s,.32*s,.1*s,'rgba(124,242,154,.18)',hexToRgba(accent,.45));
    }else if(exp.type==='coaster'){
      rr(-2.9*s,-1.15*s,5.8*s,2.3*s,.38*s,'rgba(16,12,28,.9)',hexToRgba(accent,.62));ctx.strokeStyle=hexToRgba(accent,.85);ctx.lineWidth=Math.max(2,.13*s);ctx.beginPath();ctx.moveTo(-2.45*s,.45*s);ctx.lineTo(2.45*s,.45*s);ctx.stroke();rr(-1.35*s,-.5*s,2.7*s,.72*s,.24*s,accent,'rgba(239,229,255,.75)');text('ESTAÇÃO',0,.95*s,{size:Math.max(6,.36*s),weight:900,color:'#efe5ff',align:'center'});
    }else if(exp.type==='tower'){
      for(let i=0;i<5;i++)rr((-2.2+i*.82)*s,(1.25-i*.52)*s,.75*s,.42*s,.08*s,hexToRgba(accent,.15+.05*i),hexToRgba(accent,.5));
      ctx.strokeStyle=hexToRgba(accent,.68);ctx.lineWidth=Math.max(1.2,.09*s);ctx.strokeRect(-2.55*s,-1.8*s,5.1*s,3.6*s);
      text('15 m',2.05*s,-1.42*s,{size:Math.max(7,.4*s),weight:900,color:accent,align:'center'});for(let i=0;i<7;i++){ctx.strokeStyle=hexToRgba(accent,.28+.05*i);ctx.beginPath();ctx.arc(0,0,(.55+i*.27)*s,-.8,1.1);ctx.stroke();}
    }
    const labelDistance=Math.hypot(player.x-exp.x,player.z-exp.z),labelLimit=exp.type==='tool-building'?18:24,showLabel=exp.type==='vale-portal'||labelDistance<=labelLimit;
    if(showLabel){ctx.globalAlpha=.92;rr(-2.55*s,2.3*s,5.1*s,.72*s,.32*s,'rgba(3,14,20,.72)',hexToRgba(accent,.26));text(exp.label,0,2.66*s,{size:Math.max(7,.54*s),weight:820,color:accent,align:'center'});}
    else{ctx.globalAlpha=.74;ctx.fillStyle=hexToRgba(accent,.72);ctx.beginPath();ctx.arc(0,2.52*s,Math.max(2.5,.16*s),0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function drawChallenge(w,h,time){
    const status=challenge.snapshot();if(!status.active)return;
    const s=metric(w,h);
    LITE_PARKOUR_CHECKPOINTS.forEach(([x,z],i)=>{
      const p=project(x,z,w,h),active=i===status.index,done=i<status.index,pulse=.5+.5*Math.sin(time*4+i);
      ctx.save();ctx.strokeStyle=active?`rgba(255,255,255,${.55+.35*pulse})`:done?'rgba(111,239,182,.75)':'rgba(255,107,122,.32)';ctx.lineWidth=active?3:1.5;ctx.beginPath();ctx.arc(p.x,p.y,(active?1.05:.72)*s,0,Math.PI*2);ctx.stroke();ctx.fillStyle=done?'rgba(81,231,163,.22)':active?'rgba(255,107,122,.22)':'rgba(255,107,122,.06)';ctx.beginPath();ctx.arc(p.x,p.y,(active?.72:.48)*s,0,Math.PI*2);ctx.fill();text(done?'✓':String(i+1),p.x,p.y,{size:Math.max(8,.58*s),weight:900,color:done?'#baffde':'#ffffff',align:'center'});ctx.restore();
    });
  }
  function drawBuilding(zone,w,h,count,time){
    const b=campusBuildings[zone.key],p=project(b.x,b.z,w,h),s=metric(w,h),bw=b.w*s,bh=b.h*s,accent=zone.accent,[gx,gz]=portalPos[zone.key],portalDistance=Math.hypot(player.x-gx,player.z-gz),focused=portalDistance<8;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.36)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;rr(p.x-bw/2,p.y-bh/2,bw,bh,Math.max(10,.8*s),'#0b1b23',null);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const roof=ctx.createLinearGradient(p.x-bw/2,p.y-bh/2,p.x+bw/2,p.y+bh/2);roof.addColorStop(0,hexToRgba(accent,.16));roof.addColorStop(.55,'rgba(10,26,34,.94)');roof.addColorStop(1,'rgba(8,20,28,.98)');rr(p.x-bw/2,p.y-bh/2,bw,bh,Math.max(10,.8*s),roof,hexToRgba(accent,.42),1.2);
    ctx.fillStyle=hexToRgba(accent,.92);rr(p.x-bw*.34,p.y-bh*.21,bw*.11,bh*.42,Math.max(3,.25*s),hexToRgba(accent,.14),hexToRgba(accent,.42));
    for(let i=0;i<4;i++){rr(p.x-bw*.06+i*bw*.14,p.y-bh*.18,bw*.095,bh*.16,Math.max(2,.12*s),'rgba(91,171,194,.11)','rgba(115,199,222,.16)');}
    text(zone.label,p.x-bw*.34,p.y-bh*.06,{size:Math.max(16,1.85*s),weight:850,color:accent});text(zone.name,p.x-bw*.34,p.y+bh*.17,{size:Math.max(10,.82*s),weight:620,color:'#a9bec9'});
    const portalState=state.portalState?.(zone),portalOpen=!!portalState?.open;rr(p.x-bw*.34,p.y+bh*.28,bw*.36,bh*.13,Math.max(4,.22*s),portalOpen?'rgba(18,68,47,.78)':'rgba(37,45,51,.78)',portalOpen?'rgba(81,231,163,.42)':'rgba(148,177,188,.16)');text(portalOpen?'ATIVIDADE LIBERADA':'AGUARDANDO',p.x-bw*.16,p.y+bh*.345,{size:Math.max(7,.46*s),weight:900,color:portalOpen?'#8ff2bd':'#8ea6b2',align:'center'});
    rr(p.x+bw*.15,p.y-bh*.29,bw*.27,bh*.25,Math.max(7,.42*s),'rgba(2,9,13,.64)','rgba(143,207,226,.13)');text(`${count} online`,p.x+bw*.285,p.y-bh*.165,{size:Math.max(9,.75*s),weight:750,color:count?'#dcfff0':'#8ea6b2',align:'center'});
    const gp=project(gx,gz,w,h),pulse=.5+.5*Math.sin(time*2.8+zone.key.length),focus=clamp(1-portalDistance/8,0,1);ctx.shadowColor=hexToRgba(accent,focused?.56:.32);ctx.shadowBlur=(focused?16:7)+pulse*(focused?9:4);ctx.strokeStyle=hexToRgba(accent,focused?.96:.58);ctx.lineWidth=Math.max(1.6,(focused?.26:.16)*s);ctx.beginPath();ctx.arc(gp.x,gp.y,Math.max(8,1.05*s),Math.PI*.12,Math.PI*1.88);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=hexToRgba(accent,(focused?.13:.055)+.04*pulse);ctx.beginPath();ctx.arc(gp.x,gp.y,Math.max(6,.82*s),0,Math.PI*2);ctx.fill();if(focused){ctx.strokeStyle=hexToRgba(accent,.2+.32*focus);ctx.lineWidth=Math.max(1,.1*s);ctx.beginPath();ctx.arc(gp.x,gp.y,Math.max(12,1.55*s)+Math.sin(time*2.2)*1.2,0,Math.PI*2);ctx.stroke();if(portalDistance<5.2)text('Acesso próximo',gp.x,gp.y-Math.max(18,2.15*s),{size:Math.max(9,.68*s),weight:750,color:'#dff8ff',align:'center',alpha:.9});}
    ctx.restore();
  }
  function drawCenter(w,h,time,counts){
    const p=project(0,0,w,h),s=metric(w,h);ctx.save();ctx.fillStyle='rgba(6,18,24,.65)';ctx.beginPath();ctx.arc(p.x,p.y,6.15*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(97,205,235,.2)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,5.25*s,0,Math.PI*2);ctx.stroke();
    const pulse=.5+.5*Math.sin(time*1.4);ctx.fillStyle=`rgba(94,215,247,${.08+.035*pulse})`;ctx.beginPath();ctx.arc(p.x,p.y,4.45*s,0,Math.PI*2);ctx.fill();
    const available=Number(state.available?.length||0),scheduled=state.scheduled?.[0],status=available?`${available} ATIVIDADE${available===1?'':'S'} LIBERADA${available===1?'':'S'}`:scheduled?'ATIVIDADE PROGRAMADA':'AGUARDANDO ATIVIDADE',statusColor=available?'#7cf2af':scheduled?'#ffd166':'#91aeb9';
    text('CAMPUS DS',p.x,p.y-.75*s,{size:Math.max(18,1.9*s),weight:900,color:'#dff8ff',align:'center'});text('Praça Central',p.x,p.y+.82*s,{size:Math.max(10,.8*s),weight:650,color:'#8fb5c4',align:'center'});text(status,p.x,p.y+2.15*s,{size:Math.max(8,.56*s),weight:900,color:statusColor,align:'center'});text(`${counts.central||1} na praça`,p.x,p.y+3.18*s,{size:Math.max(8,.58*s),weight:650,color:'#6fe5bd',align:'center'});ctx.restore();
  }
  function drawAvatar(wx,wz,label,color,self=false,role='student',dir=0,time=0,showLabel=true,w=viewport.w,h=viewport.h,style=null){
    const p=project(wx,wz,w,h),s=metric(w,h),scale=clamp(s/10,.72,1.08),staff=role!=='student',lift=self?jump:0;ctx.save();ctx.translate(p.x,p.y-lift*scale);ctx.shadowColor='rgba(0,0,0,.38)';ctx.shadowBlur=8;ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(0,11*scale,9.5*scale,4*scale,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(self){ctx.strokeStyle=hexToRgba(color,.75);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,16*scale+Math.sin(time*3)*1.5,0,Math.PI*2);ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-25*scale);ctx.lineTo(-5*scale,-17*scale);ctx.lineTo(5*scale,-17*scale);ctx.closePath();ctx.fill();}
    ctx.rotate(dir);ctx.fillStyle=color;rr(-5.5*scale,-2*scale,11*scale,16*scale,4*scale,color);const skin=style?.skin?`#${Number(style.skin).toString(16).padStart(6,'0')}`:(staff?'#f3cb68':'#e7b692'),hair=style?.hair?`#${Number(style.hair).toString(16).padStart(6,'0')}`:'#101820';ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,-7*scale,5.4*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle=hair;ctx.beginPath();ctx.arc(-1.6*scale,-8.3*scale,3.7*scale,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#dbeaf0';ctx.beginPath();ctx.moveTo(0,14*scale);ctx.lineTo(-5*scale,19*scale);ctx.lineTo(-1*scale,13*scale);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,14*scale);ctx.lineTo(5*scale,19*scale);ctx.lineTo(1*scale,13*scale);ctx.closePath();ctx.fill();if(style?.backpack){ctx.fillStyle='rgba(35,55,70,.95)';rr(-6*scale,1*scale,3*scale,9*scale,1.5*scale,'rgba(35,55,70,.95)');}if(style?.glasses){ctx.strokeStyle='#111820';ctx.lineWidth=1.4;ctx.strokeRect(-4.3*scale,-9.5*scale,3.4*scale,2.3*scale);ctx.strokeRect(.9*scale,-9.5*scale,3.4*scale,2.3*scale);}ctx.restore();
    if(showLabel||self||staff){const tagY=p.y-26*scale-lift*scale,tagW=Math.max(62,Math.min(126,(String(label||'Usuário').length*7.2)+26));ctx.save();ctx.globalAlpha=self?1:.92;rr(p.x-tagW/2,tagY-10,tagW,20,10,self?'rgba(4,16,22,.94)':'rgba(4,14,20,.82)',self?hexToRgba(color,.72):'rgba(139,193,210,.18)');text(label||'Usuário',p.x,tagY,{size:10.5,weight:self?800:700,color:staff?'#ffd166':'#eefaff',align:'center'});if(emote&&self&&emoteUntil>Date.now())text(emote==='wave'?'👋':emote==='like'?'👍':'✨',p.x+tagW/2+13,tagY,{size:18,align:'center'});ctx.restore();}
  }
  function drawChatBubble(wx,wz,message,w,h){const p=project(wx,wz,w,h),value=String(message||'').slice(0,70),width=Math.max(72,Math.min(230,value.length*6.2+24));rr(p.x-width/2,p.y-66,width,28,12,'rgba(3,12,18,.94)','rgba(114,230,255,.42)');text(value,p.x,p.y-52,{size:10,weight:700,color:'#edfbff',align:'center'});}
  function drawContextBadge(w,h){const map={'exam-running':['✎','PROVA','#ffd166'],'exam-paused':['Ⅱ','PAUSA','#ffae63'],'lab-active':['⌨','LAB','#51e7a3'],waiting:['◷','AGUARDE','#8fdcff'],'lab-waiting':['⚗','LAB','#8fdcff'],'exam-finished':['✓','FIM','#7cf2af']},item=map[String(contextualState?.state||'')];if(!item)return;const p=project(player.x,player.z,w,h),width=62;rr(p.x-width/2,p.y+28,width,20,8,'rgba(4,16,22,.94)',hexToRgba(item[2],.62));text(`${item[0]} ${item[1]}`,p.x,p.y+38,{size:9,weight:900,color:item[2],align:'center'});}
  function drawToolInterior(w,h,time){
    const profile=CAMPUS_INTERIOR_MAP[activeToolInterior];if(!profile)return;
    const ms=metric(w,h),c=project(profile.origin[0],profile.origin[2],w,h),rw=profile.width*ms,rd=profile.depth*ms,style=profile.style||{},secondary=style.secondary||profile.accent;
    ctx.save();
    rr(c.x-rw/2,c.y-rd/2,rw,rd,Math.max(8,.55*ms),style.floor||'rgba(8,20,27,.98)',hexToRgba(secondary,.72),Math.max(1.3,.08*ms));
    ctx.strokeStyle=hexToRgba(secondary,.13);ctx.lineWidth=Math.max(1,.05*ms);
    if(style.motif==='orbit'){for(const r of[1.7,3.1]){ctx.beginPath();ctx.arc(c.x,c.y,r*ms,0,Math.PI*2);ctx.stroke();}}
    else if(style.motif==='exam'){for(const x of[-4.5,-1.5,1.5,4.5]){ctx.beginPath();ctx.moveTo(c.x+x*ms,c.y-rd*.3);ctx.lineTo(c.x+x*ms,c.y+rd*.3);ctx.stroke();}}
    else if(['circuit','soc','maker'].includes(style.motif)){ctx.beginPath();ctx.moveTo(c.x-rw*.3,c.y);ctx.lineTo(c.x+rw*.3,c.y);ctx.moveTo(c.x,c.y-rd*.28);ctx.lineTo(c.x,c.y+rd*.28);ctx.stroke();}
    else {for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(c.x+i*2.4*ms,c.y-rd*.35);ctx.lineTo(c.x+i*2.4*ms,c.y+rd*.35);ctx.stroke();}}
    const card=(wx,wz,label,accent=profile.accent,ww=3.0,dd=1.35)=>{const p=project(wx,wz,w,h);rr(p.x-ww*ms/2,p.y-dd*ms/2,ww*ms,dd*ms,.35*ms,'rgba(11,31,39,.94)',hexToRgba(accent,.56));text(label,p.x,p.y,{size:Math.max(8,.48*ms),weight:850,color:accent,align:'center'});};
    const floorMap=(profile.floorMaps||[]).find(item=>item.index===activeToolFloor),signature=CAMPUS_INTERIOR_SIGNATURES[profile.id];
    for(const room of floorMap?.rooms||[]){const roomStyle=interiorRoomStyle(room.kind,profile.accent);card(room.x,room.z,`${roomStyle.icon} ${String(room.label||'SALA').toUpperCase()}`,roomStyle.accent||profile.accent,Math.min(4.6,Number(room.w||3.4)),Math.min(2.0,Number(room.d||1.4)));}
    if(activeToolFloor===0){
      if(signature)card(profile.origin[0],profile.origin[2]+1.0,`${signature.icon} ${signature.label.toUpperCase()}`,profile.accent,4.2,1.45);
      card(profile.reception.x,profile.reception.z,'RECEPÇÃO');card(profile.portal.x,profile.portal.z,'PORTAL',profile.accent,3.2,1.5);card(profile.exit.x,profile.exit.z,'SAÍDA','#d9f7ff',2.7,1.15);
      if(profile.garage)card(profile.garage.access.x,profile.garage.access.z,'GARAGEM','#ffae63',3.0,1.2);
      if(profile.receptionist){const rp=project(profile.receptionist.x,profile.receptionist.z,w,h);ctx.fillStyle=profile.accent;ctx.beginPath();ctx.arc(rp.x,rp.y,Math.max(4,.36*ms),0,Math.PI*2);ctx.fill();text('i',rp.x,rp.y+.05*ms,{size:Math.max(7,.42*ms),weight:950,color:'#031117',align:'center'});}
    }
    if(activeInteriorGuide?.interiorId===profile.id&&activeInteriorGuide.floor===activeToolFloor){const route=profile.guidedRoutes.find(item=>item.id===activeInteriorGuide.routeId);if(route?.nodes?.length>1){ctx.save();ctx.strokeStyle=hexToRgba(profile.accent,.92);ctx.lineWidth=Math.max(2,.16*ms);ctx.setLineDash([Math.max(5,.42*ms),Math.max(4,.32*ms)]);ctx.beginPath();route.nodes.forEach((node,index)=>{const q=project(node.x,node.z,w,h);if(index===0)ctx.moveTo(q.x,q.y);else ctx.lineTo(q.x,q.y)});ctx.stroke();ctx.setLineDash([]);ctx.restore();}}
    card(profile.elevator.x,profile.elevator.z,'ELEVADOR',profile.accent,2.8,1.25);card(profile.stairs.x,profile.stairs.z,'ESCADA','#cfeef7',2.6,1.25);
    text(profile.label,c.x,c.y-rd/2-1.45*ms,{size:Math.max(12,.72*ms),weight:950,color:profile.accent,align:'center'});
    text(`${profile.floorLabel(activeToolFloor)} • Piso ${activeToolFloor===0?'Térreo':'1'}`,c.x,c.y-rd/2-.62*ms,{size:Math.max(9,.5*ms),weight:720,color:'#d5eaf2',align:'center'});
    ctx.restore();
  }
  function drawFooter(w,h){if(w<640||h<520)return;const wide=w>760;const label=wide?'Mapa interativo do Campus • mesmo mundo do modo 3D':'Mapa do Campus • modo leve';rr(14,h-50,wide?330:240,34,17,'rgba(4,14,20,.8)','rgba(129,196,216,.16)');text(label,30,h-33,{size:11,weight:680,color:'#bdd5df'});if(wide){text('WASD mover  •  E interagir  •  scroll zoom',w-26,h-30,{size:10.5,weight:620,color:'#809ba8',align:'right'});}}
  const draw=now=>{
    const {w,h}=resize(),time=reducedMotion?0:now/1000;zoom=lerp(zoom,zoomTarget,reducedMotion?1:.12);panX=lerp(panX,panTargetX,reducedMotion?1:.1);panZ=lerp(panZ,panTargetZ,reducedMotion?1:.1);drawBackground(w,h,time);
    if(activeToolInterior){drawToolInterior(w,h,time);}else{
      drawLandscape(w,h,time);for(const exp of CAMPUS_EXPERIENCES)drawExperience(exp,w,h,time);drawChallenge(w,h,time);const counts=zoneCounts();for(const zone of zones)drawBuilding(zone,w,h,counts[zone.key]||0,time);drawCenter(w,h,time,counts);
      for(const o of state.others||[]){if(o.area==='vale-silicio')continue;const wp=toWorld(o.x,o.y),zone=zoneForOther(o),color=['teacher','admin','super_admin'].includes(o.participant_role)?'#ffd166':zone?.accent||'#68b7d0',dist=Math.hypot(player.x-wp.x,player.z-wp.z),staff=['teacher','admin','super_admin'].includes(o.participant_role),showLabel=staff||dist<(viewport.w<640?10:15)||(zoom>1.28&&viewport.w>=640);drawAvatar(wp.x,wp.z,(o.display_name||'Aluno').split(' ')[0],color,false,o.participant_role,Number(o.heading||0),time,showLabel,w,h);const bubble=chatBubbles.get(o.student_id);if(bubble&&bubble.until>Date.now())drawChatBubble(wp.x,wp.z,bubble.message,w,h);}
    }
    const selfColor=state.avatarStyle?.accentCss||(isStaff()?'#ffd166':'#36d2ff');if(activeCampusVehicle){const q=project(player.x,player.z,w,h),ms=metric(w,h);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(-player.dir);rr(-.7*ms,-.36*ms,1.4*ms,.72*ms,.2*ms,hexToRgba(activeCampusVehicle.accent||'#ffae63',.96),'rgba(245,253,255,.7)');text(activeCampusVehicle.kind==='bike'?'◉':activeCampusVehicle.kind==='bus'?'▰':'◆',0,0,{size:Math.max(6,.34*ms),weight:950,color:'#f6feff',align:'center'});ctx.restore();}else drawAvatar(player.x,player.z,(state.profile?.full_name||'Usuário').split(' ')[0],selfColor,true,state.profile?.role||'student',player.dir,time,true,w,h,state.avatarStyle||null);drawContextBadge(w,h);const ownBubble=chatBubbles.get(state.user?.id);if(ownBubble&&ownBubble.until>Date.now())drawChatBubble(player.x,player.z,ownBubble.message,w,h);drawFooter(w,h);if(!activeToolInterior)drawWorldWeather2D(ctx,w,h,currentWeather,time,{quality:'lite',reducedMotion,saveData});
  };

  const keydown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;keys.add(e.code);if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat)onInteract?.();if(e.code==='Space'&&!e.repeat&&!contextLocked()&&jump<=.01)jumpV=5.6;if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=true;if(e.code==='Equal'||e.code==='NumpadAdd')zoomTarget=clamp(zoomTarget+.12,.78,1.55);if(e.code==='Minus'||e.code==='NumpadSubtract')zoomTarget=clamp(zoomTarget-.12,.78,1.55);};
  const keyup=e=>{keys.delete(e.code);if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=false;};
  const wheel=e=>{zoomTarget=clamp(zoomTarget-(Math.sign(e.deltaY)*.09),.78,1.55);e.preventDefault();};
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);canvas.addEventListener('wheel',wheel,{passive:false});
  const bindJoystick=()=>{const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');if(!root||!stick)return()=>{};let active=null;const update=e=>{const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),x=dx*k,y=dy*k;joy.x=x/max;joy.y=y/max;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;};const down=e=>{active=e.pointerId;root.setPointerCapture?.(active);update(e);},move=e=>{if(e.pointerId===active)update(e);},end=e=>{if(e.pointerId!==active)return;active=null;joy.x=joy.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',end);root.removeEventListener('pointercancel',end);};};
  const cleanJoy=bindJoystick(),jumpButton=document.getElementById('jump-button'),runButton=document.getElementById('run-button');const jumpTap=e=>{e.preventDefault();if(!contextLocked()&&jump<=.01)jumpV=5.6;},runDown=e=>{e.preventDefault();running=true;},runUp=e=>{e.preventDefault();running=false;};jumpButton?.addEventListener('pointerdown',jumpTap);runButton?.addEventListener('pointerdown',runDown);runButton?.addEventListener('pointerup',runUp);runButton?.addEventListener('pointercancel',runUp);
  function frame(now){
    if(stopped)return;raf=requestAnimationFrame(frame);if(document.hidden){last=now;lastRenderGate=0;return;}const minFrame=1000/Math.max(15,fpsCap||60);if(lastRenderGate&&now-lastRenderGate<minFrame-1)return;lastRenderGate=now;
    const dt=Math.min(.05,(now-last)/1000||.016);last=now;let ix=((keys.has('KeyD')||keys.has('ArrowRight'))?1:0)-((keys.has('KeyA')||keys.has('ArrowLeft'))?1:0)+joy.x,iz=((keys.has('KeyS')||keys.has('ArrowDown'))?1:0)-((keys.has('KeyW')||keys.has('ArrowUp'))?1:0)+joy.y;const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;}
    if(activeToolInterior){
      const profile=CAMPUS_INTERIOR_MAP[activeToolInterior],speed=running?6.4:4.2;if(contextLocked()){ix=0;iz=0;}player.x=clamp(player.x+ix*speed*dt,profile.bounds.minX,profile.bounds.maxX);player.z=clamp(player.z+iz*speed*dt,profile.bounds.minZ,profile.bounds.maxZ);if(Math.hypot(ix,iz)>.02)player.dir=Math.atan2(ix,-iz);jumpV-=14*dt;jump+=jumpV*dt;if(jump<0){jump=0;jumpV=0;}
    }else{
      let vehicleRide=null;if(activeCampusVehicle){const elapsed=now-vehicleRideStartedAt,k=elapsed/Math.max(1000,activeCampusVehicle.durationMs||18000);if(k>=1){activeCampusVehicle=null;vehicleRideStartedAt=0;}else{vehicleRide=sampleCampusRoute(activeCampusVehicle.routeId,(activeCampusVehicle.startT||0)+k);}}const ride=vehicleRide||train.tickTrip(now)||rides.tick(now);if(ride){player.x=ride.x;player.z=ride.z;player.dir=ride.heading||player.dir;jump=Math.max(0,ride.y||0);jumpV=0;ix=iz=0;}else{const speed=running?8:4.8;player.x=clamp(player.x+ix*speed*dt,-WORLD_X+1,WORLD_X-1);player.z=clamp(player.z+iz*speed*dt,-WORLD_Z+1,WORLD_Z-1);if(Math.hypot(ix,iz)>.02)player.dir=Math.atan2(ix,-iz);jumpV-=14*dt;jump+=jumpV*dt;if(jump<0){jump=0;jumpV=0;}}
    }
    if(contextualTransition){const k=clamp((now-contextualTransition.startedAt)/Math.max(240,contextualTransition.durationMs),0,1),ease=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;player.x=contextualTransition.fromX+(contextualTransition.toX-contextualTransition.fromX)*ease;player.z=contextualTransition.fromZ+(contextualTransition.toZ-contextualTransition.fromZ)*ease;player.dir=contextualTransition.rot;jump=0;jumpV=0;if(k>=1)contextualTransition=null;}
    const area=areaAt(player.x,player.z);if(area!==lastArea){lastArea=area;onAreaChange?.(area);}if(activeToolInterior){const p=CAMPUS_INTERIOR_MAP[activeToolInterior];panTargetX=p.origin[0];panTargetZ=p.origin[2];zoomTarget=Math.max(zoomTarget,1.18);}else if(zoomTarget>1.12){panTargetX=player.x*.5;panTargetZ=player.z*.5}else{panTargetX=0;panTargetZ=0;}
    let nearPortal=null,nearStudent=null,nearWorldObject=null;
    if(activeToolInterior){
      let best=2.6;for(const o of CAMPUS_INTERIOR_INTERACTIONS){if(o.interiorId!==activeToolInterior||Number(o.floor||0)!==activeToolFloor)continue;const d=Math.hypot(player.x-o.x,player.z-o.z);if(d<Math.min(best,o.radius||2.5)){best=d;nearWorldObject=o;}}
    }else{
      let bestP=3.8;for(const z of zones){const p=portalPos[z.key],d=Math.hypot(player.x-p[0],player.z-p[1]);if(d<bestP){bestP=d;nearPortal=z;}}
      let bestS=3.2;for(const o of state.others||[]){const p=toWorld(o.x,o.y),d=Math.hypot(player.x-p.x,player.z-p.z);if(d<bestS){bestS=d;nearStudent=o;}}
      let station=null,stationDist=2.9;for(const st of CAMPUS_TRAIN_STATIONS){const d=Math.hypot(player.x-st.x,player.z-st.z);if(d<stationDist){stationDist=d;station=st;}}
      let vehicleRef=null,vehicleDist=2.8;for(const vehicle of CAMPUS_DRIVABLE_VEHICLES){const d=Math.hypot(player.x-vehicle.x,player.z-vehicle.z);if(d<vehicleDist){vehicleDist=d;vehicleRef={...vehicle,type:'campus-vehicle',radius:2.8};}}
      let cityNpc=null,cityNpcDist=2.6;const cityTime=now/1000;for(const npc of CAMPUS_NPC_PATROLS){const pos=sampleCampusRoute(npc.routeId,npc.offset+cityTime*npc.speed),d=Math.hypot(player.x-pos.x,player.z-pos.z);if(d<cityNpcDist){cityNpcDist=d;cityNpc={...npc,...pos,type:'city-npc',radius:2.6};}}
      const cityEvent=resolveCampusCityEvent(new Date()),eventPlaza=CAMPUS_THEME_PLAZAS.find(item=>item.id===cityEvent.plazaId),eventRef=eventPlaza&&Math.hypot(player.x-eventPlaza.x,player.z-eventPlaza.z)<Math.min(3.2,eventPlaza.radius*.72)?{...cityEvent,x:eventPlaza.x,z:eventPlaza.z,type:'city-event',radius:3.2}:null;let signRef=null,signDist=2.3;for(const sign of CAMPUS_DYNAMIC_SIGNS){const d=Math.hypot(player.x-sign.x,player.z-sign.z);if(d<signDist){signDist=d;signRef={...sign,type:'dynamic-sign',name:'Painel urbano AGV',radius:2.3};}}
      const exp=nearestExperience(player.x,player.z,3.7);if(!rides.isActive()&&!train.isTraveling()&&!activeCampusVehicle){if(vehicleRef)nearWorldObject=vehicleRef;else if(station)nearWorldObject={id:`train-${station.id}`,type:'train-station',name:`Estação ${station.name}`,stationId:station.id,x:station.x,z:station.z,radius:2.9};else if(cityNpc)nearWorldObject=cityNpc;else if(eventRef)nearWorldObject=eventRef;else if(signRef)nearWorldObject=signRef;else if(exp)nearWorldObject=attractionRef(exp);}challenge.tick(player,now);
    }
    const profile=activeToolInterior?CAMPUS_INTERIOR_MAP[activeToolInterior]:null,publicPos=profile?.entrance||player,pp=toPresence(publicPos.x,publicPos.z);onPlayerState?.({x:pp.x,y:pp.y,area,interior:activeToolInterior?`tool:${activeToolInterior}`:null,interiorFloor:activeToolInterior?activeToolFloor:null,nearPortal,nearStudent,nearWorldObject,vehicle:activeCampusVehicle?{id:activeCampusVehicle.id,name:activeCampusVehicle.name}:null,moving:Math.hypot(ix,iz),running,onGround:jump<=.01});draw(now);
  }
  onQualityChange?.('low');raf=requestAnimationFrame(frame);
  const enterToolInterior=id=>{const profile=CAMPUS_INTERIOR_MAP[id];if(!profile)return false;rides.cancel({silent:true});train.cancel();challenge.cancel();lastExteriorPosition={x:player.x,z:player.z};activeToolInterior=id;activeToolFloor=0;activeInteriorGuide=null;player.x=profile.origin[0];player.z=profile.origin[2]-4.2;player.dir=0;jump=0;jumpV=0;zoomTarget=1.22;panX=panTargetX=profile.origin[0];panZ=panTargetZ=profile.origin[2];onInteriorChange?.({inside:true,key:`tool:${id}`,kind:'tool',floor:0,label:`${profile.name} • ${profile.floorLabel(0)}`});return true;};
  const applyContextualAvatarState=context=>{const next=context&&typeof context==='object'?context:{state:'idle'};contextualState=next;if(!next.interiorId||next.state==='idle'){contextualTransition=null;return true;}if(activeToolInterior!==next.interiorId&&!enterToolInterior(next.interiorId))return false;const anchor=contextualInteriorAnchor(next.interiorId,next.state);if(!anchor)return true;activeToolFloor=Number(anchor.floor)||0;const dist=Math.hypot(player.x-anchor.x,player.z-anchor.z);contextualTransition={fromX:player.x,fromZ:player.z,toX:anchor.x,toZ:anchor.z,rot:Number(anchor.rot)||0,startedAt:performance.now(),durationMs:reducedMotion?240:clamp(dist/3.4*1000,480,2200)};onInteriorChange?.({inside:true,key:`tool:${next.interiorId}`,kind:'tool',floor:activeToolFloor,label:`${CAMPUS_INTERIOR_MAP[next.interiorId]?.name||next.interiorId} • ${CAMPUS_INTERIOR_MAP[next.interiorId]?.floorLabel(activeToolFloor)||''}`});return true;};
  const exitToolInterior=({garage=false}={})=>{if(!activeToolInterior)return false;const profile=CAMPUS_INTERIOR_MAP[activeToolInterior],target=garage&&profile?.garage?{x:profile.garage.x,z:profile.garage.z}:{x:lastExteriorPosition?.x??profile?.entrance?.x??0,z:lastExteriorPosition?.z??profile?.entrance?.z??0};activeToolInterior=null;activeToolFloor=0;activeInteriorGuide=null;player.x=target.x;player.z=target.z;player.dir=Math.PI;jump=0;jumpV=0;zoomTarget=1;panX=panTargetX=0;panZ=panTargetZ=0;onInteriorChange?.({inside:false,key:null,kind:'tool',floor:null,label:garage&&profile?.garage?profile.garage.name:'Campus DS'});return true;};
  const changeToolFloor=(ref,via='elevator')=>{if(!activeToolInterior||ref?.interiorId!==activeToolInterior)return false;const profile=CAMPUS_INTERIOR_MAP[activeToolInterior];activeInteriorGuide=null;activeToolFloor=profile.floors.length>1?(activeToolFloor===0?1:0):0;const anchor=via==='stairs'?profile.stairs:profile.elevator;player.x=anchor.x;player.z=anchor.z+(activeToolFloor===0?.65:-.65);onInteriorChange?.({inside:true,key:`tool:${activeToolInterior}`,kind:'tool',floor:activeToolFloor,label:`${profile.name} • ${profile.floorLabel(activeToolFloor)}`});return true;};
  return{
    ready:Promise.resolve(),setQuality:()=>onQualityChange?.('low'),getQuality:()=> 'low',
    teleportTo(target){if(!target)return false;if(activeToolInterior)exitToolInterior();activeCampusVehicle=null;vehicleRideStartedAt=0;rides.cancel({silent:true});train.cancel();challenge.cancel();player.x=clamp(Number(target.x)||0,-WORLD_X+1,WORLD_X-1);player.z=clamp(Number(target.z)||0,-WORLD_Z+1,WORLD_Z-1);jump=0;jumpV=0;return true;},
    getDestinations:()=>teleportDestinations.map(item=>({...item})),getTrainStations:()=>train.stations(),startTrainTo:id=>{if(activeToolInterior)return false;activeCampusVehicle=null;vehicleRideStartedAt=0;rides.cancel({silent:true});challenge.cancel();return train.startTrip(id,{x:player.x,z:player.z});},
    enterToolInterior,exitToolInterior,applyContextualAvatarState,getContextualAvatarState:()=>contextualState,useToolElevator:ref=>changeToolFloor(ref,'elevator'),useToolStairs:ref=>changeToolFloor(ref,'stairs'),exitToolInteriorToGarage:()=>exitToolInterior({garage:true}),getToolInterior:()=>activeToolInterior?{id:activeToolInterior,floor:activeToolFloor}:null,
    getInteriorMap:()=>activeToolInterior?{profile:CAMPUS_INTERIOR_MAP[activeToolInterior],floor:activeToolFloor,map:CAMPUS_INTERIOR_MAP[activeToolInterior]?.floorMaps?.find(item=>item.index===activeToolFloor)||null}:null,
    startInteriorGuide(ref){if(!activeToolInterior||ref?.interiorId!==activeToolInterior)return false;const route=CAMPUS_INTERIOR_MAP[activeToolInterior]?.guidedRoutes?.find(item=>item.id===ref.routeId);if(!route||Number(route.floor||0)!==activeToolFloor)return false;activeInteriorGuide={interiorId:activeToolInterior,floor:activeToolFloor,routeId:route.id};return true;},
    useCampusVehicle(ref){if(activeToolInterior||!ref?.routeId)return false;rides.cancel({silent:true});train.cancel();challenge.cancel();activeCampusVehicle={...ref};vehicleRideStartedAt=performance.now();return true;},cancelCampusVehicle(){const had=!!activeCampusVehicle;activeCampusVehicle=null;vehicleRideStartedAt=0;return had;},getCampusVehicle:()=>activeCampusVehicle?{id:activeCampusVehicle.id,name:activeCampusVehicle.name}:null,
    setWorldTimeMode:m=>{worldTimeMode=['cycle','auto','day','night'].includes(m)?(m==='auto'?'cycle':m):'cycle';lastWorldClock='';return worldTimeMode;},getWorldTimeMode:()=>worldTimeMode,setFPSCap:v=>{fpsCap=clamp(Number(v)||60,15,60);return fpsCap;},getFPSCap:()=>fpsCap,setFov:()=>null,getFov:()=>null,setCameraMode:()=> 'lite',
    showChatMessage(senderId,message){chatBubbles.set(senderId,{message:String(message||'').slice(0,90),until:Date.now()+6500});return true;},startChallenge:(...args)=>activeToolInterior?false:startChallenge(...args),restartChallenge:()=>activeToolInterior?false:restartChallenge(),cancelChallenge,startExperience:(...args)=>activeToolInterior?false:startExperience(...args),cancelExperience:()=>rides.cancel(),jump:()=>{if(jump<=.01&&!rides.isActive()&&!train.isTraveling()&&!contextLocked())jumpV=5.6;},setRun:v=>{running=!!v;},setLocalEmote(kind){emote=kind;emoteUntil=Date.now()+4500;},
    stop(){stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('resize',requestSize);window.visualViewport?.removeEventListener?.('resize',requestSize);resizeObserver?.disconnect();canvas.removeEventListener('wheel',wheel);jumpButton?.removeEventListener('pointerdown',jumpTap);runButton?.removeEventListener('pointerdown',runDown);runButton?.removeEventListener('pointerup',runUp);runButton?.removeEventListener('pointercancel',runUp);cleanJoy?.();}
  };
}

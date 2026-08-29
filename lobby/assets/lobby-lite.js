import { WORLD_X, WORLD_Z, CAMPUS_ZONE_LAYOUT, CAMPUS_DECOR, presenceToWorld, worldToPresence, areaAtWorld } from './world/campus-manifest.js?v=14.10.8.58';
import { CAMPUS_EXPERIENCES, CAMPUS_TRAIN_STATIONS, CAMPUS_TRAIN_ROUTE, PARKOUR_PLATFORMS, LITE_PARKOUR_CHECKPOINTS, PARKOUR_START, nearestExperience } from './world/campus-experiences.js?v=14.10.8.58';
import { createCheckpointChallenge } from './game/challenge-manager.js?v=14.10.8.58';
import { createRideManager } from './game/ride-manager.js?v=14.10.8.58';
import { createTrainManager } from './game/train-manager.js?v=14.10.8.58';
import { resolveWorldTime, skyPalette } from './world/dynamic-world.js?v=14.10.8.58';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const hexToRgba=(hex,a=.2)=>{const h=String(hex||'#36d2ff').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;};

export function createLobbyLite({canvas,zones,state,isStaff,onInteract,onPlayerState,onQualityChange,onAreaChange,onChallengeEvent,onWorldTime}){
  if(!canvas) throw new Error('Canvas do Lobby não encontrado.');
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx) throw new Error('Canvas 2D indisponível.');
  const keys=new Set(),joy={x:0,y:0};
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,saveData=!!navigator.connection?.saveData;
  let stopped=false,raf=0,last=performance.now(),running=false,jump=0,jumpV=0,lastArea='central',emote=null,emoteUntil=0,zoom=1,zoomTarget=1,panX=0,panZ=0,panTargetX=0,panTargetZ=0,sizeDirty=true,viewport={w:1,h:1,dpr:1},portraitMode=null,worldTimeMode=state.graphics?.worldTimeMode||'auto',fpsCap=Number(state.graphics?.fpsCap)||60,lastRenderGate=0,lastWorldClock='',currentWorld=resolveWorldTime(worldTimeMode),chatBubbles=new Map();
  const start=presenceToWorld(state.player?.x,state.player?.y);
  const player={x:start.x,z:start.z,dir:0};
  const portalPos=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.portal2d]));
  const campusBuildings=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.liteBuilding]));
  const treeSpots=CAMPUS_DECOR.trees,lampSpots=CAMPUS_DECOR.lamps,benchSpots=CAMPUS_DECOR.benches;
  const areaAt=areaAtWorld,toPresence=worldToPresence,toWorld=presenceToWorld;
  const teleportDestinations=[
    {id:'central',name:'Praça Central',x:0,z:0,kind:'landmark'},
    {id:'vale-portal',name:'Portal do Vale do Silício AGV',x:0,z:-10.5,kind:'portal'},
    {id:'1ds',name:'1DS — Laboratório',x:-22.5,z:-10.2,kind:'laboratory'},
    {id:'2ds',name:'2DS — Laboratório',x:22.5,z:-10.2,kind:'laboratory'},
    {id:'3ds',name:'3DS — Laboratório',x:-22.5,z:10.2,kind:'laboratory'},
    {id:'sub',name:'SUB — Laboratório',x:22.5,z:10.2,kind:'laboratory'},
    ...CAMPUS_EXPERIENCES.filter(item=>item.type!=='vale-portal').map(item=>({id:item.id,name:item.name,x:item.x,z:item.z,kind:item.type}))
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

  const attractionRef=experience=>({...experience,type:experience.type,name:experience.name,label:experience.label,radius:experience.radius||3});
  const challenge=createCheckpointChallenge({id:'parkour',title:'Circuito Parkour 2D',checkpoints:LITE_PARKOUR_CHECKPOINTS,start:PARKOUR_START,onEvent:onChallengeEvent});
  const rides=createRideManager({onEvent:onChallengeEvent,reducedMotion});
  const train=createTrainManager({onEvent:onChallengeEvent,reducedMotion});
  function startChallenge(id='parkour'){
    if(id!=='parkour')return false;
    rides.cancel({silent:true});return challenge.start();
  }
  const cancelChallenge=()=>challenge.cancel();
  const restartChallenge=()=>challenge.restart();
  const startExperience=id=>{challenge.cancel();return rides.start(id);};

  function drawBackground(w,h,time){
    currentWorld=resolveWorldTime(worldTimeMode);const palette=skyPalette(currentWorld),g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,palette.top);g.addColorStop(.58,currentWorld.phase==='night'?'#071820':'#305f70');g.addColorStop(1,palette.bottom);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.5,h*.42,0,w*.5,h*.42,Math.max(w,h)*.62);glow.addColorStop(0,palette.glow);glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const celestialX=w*(.18+.64*((currentWorld.hour%24)/24)),celestialY=h*(currentWorld.phase==='night'?.15:.13);ctx.save();ctx.shadowBlur=20;ctx.shadowColor=currentWorld.phase==='night'?'rgba(190,220,255,.38)':'rgba(255,230,145,.45)';ctx.fillStyle=currentWorld.phase==='night'?'rgba(221,239,255,.9)':'rgba(255,238,170,.92)';ctx.beginPath();ctx.arc(celestialX,celestialY,currentWorld.phase==='night'?9:12,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.globalAlpha=currentWorld.phase==='night'?.18:.07;ctx.fillStyle='#d7f4ff';for(let i=0;i<(saveData?12:45);i++){const x=(i*173.31+time*2.2)%w,y=(i*97.17+time*.8)%h;ctx.beginPath();ctx.arc(x,y,(i%3)+.5,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    if(currentWorld.clock!==lastWorldClock){lastWorldClock=currentWorld.clock;onWorldTime?.(currentWorld);}
  }
  function pathLine(points,w,h,width=5,alpha=.95){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(36,62,72,.95)';ctx.lineWidth=width*metric(w,h);ctx.beginPath();points.forEach(([x,z],i)=>{const p=project(x,z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();ctx.strokeStyle='rgba(111,191,216,.13)';ctx.lineWidth=Math.max(1,.3*metric(w,h));ctx.stroke();ctx.globalAlpha=alpha;ctx.restore();}
  function drawLandscape(w,h,time){
    const s=metric(w,h);
    pathLine([[-38,0],[-14,0],[-9,0],[9,0],[14,0],[38,0]],w,h,4.4);
    pathLine([[0,-24],[0,-14],[0,-9],[0,9],[0,14],[0,24]],w,h,4.4);
    for(const [x,z] of[[-13,-12],[13,-12],[-13,12],[13,12]]) pathLine([[Math.sign(x)*6,Math.sign(z)*6],[x,z]],w,h,3.3,.85);
    // Ruas, calçadas, muros e pista de pouso — equivalentes 2D do Campus 3D.
    const drawRectWorld=(x,z,ww,dd,fill,stroke=null)=>{const c=project(x,z,w,h),ms=metric(w,h);rr(c.x-ww*ms/2,c.y-dd*ms/2,ww*ms,dd*ms,Math.max(1,.12*ms),fill,stroke);};
    for(const [x,z,ww,dd] of[[0,-22,72,5.2],[0,22,72,5.2],[-37,0,5.2,42],[37,0,5.2,42]])drawRectWorld(x,z,ww,dd,'rgba(14,23,29,.92)','rgba(119,159,174,.12)');
    drawRectWorld(0,22,54,4.3,'rgba(6,11,15,.96)','rgba(222,242,247,.22)');for(let x=-23;x<=23;x+=5.75)drawRectWorld(x,22,2.6,.15,'rgba(229,241,244,.7)');
    // Monotrilho e estações.
    ctx.save();ctx.strokeStyle='rgba(181,140,255,.48)';ctx.lineWidth=Math.max(2,.17*metric(w,h));ctx.beginPath();CAMPUS_TRAIN_ROUTE.forEach((node,i)=>{const q=project(node.x,node.z,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.restore();
    for(const st of CAMPUS_TRAIN_STATIONS){const q=project(st.x,st.z,w,h),ms=metric(w,h);rr(q.x-1.1*ms,q.y-.45*ms,2.2*ms,.9*ms,.2*ms,'rgba(16,12,28,.88)',hexToRgba(st.accent,.55));text(st.name,q.x,q.y,{size:Math.max(6,.34*ms),weight:850,color:st.accent,align:'center'});}
    const trainPos=train.sampleVisual(time*1000),tq=project(trainPos.x,trainPos.z,w,h),ms=metric(w,h);ctx.save();ctx.translate(tq.x,tq.y);ctx.rotate(-trainPos.heading);rr(-.9*ms,-.38*ms,1.8*ms,.76*ms,.28*ms,'#b58cff','rgba(235,222,255,.72)');rr(-.58*ms,-.22*ms,1.16*ms,.28*ms,.08*ms,'rgba(18,35,50,.92)');ctx.restore();
    const p=project(0,0,w,h);ctx.save();ctx.shadowColor='rgba(54,210,255,.16)';ctx.shadowBlur=24;ctx.fillStyle='#10252d';ctx.beginPath();ctx.arc(p.x,p.y,10.2*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(95,205,236,.48)';ctx.lineWidth=Math.max(1,1.1);ctx.beginPath();ctx.arc(p.x,p.y,9.6*s,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(95,205,236,.12)';ctx.beginPath();ctx.arc(p.x,p.y,7.7*s,0,Math.PI*2);ctx.stroke();ctx.restore();
    for(const [x,z,wg,hg] of[[-27,0,8,4],[27,0,8,4],[0,-17,5,5],[0,17,5,5]]){const gp=project(x,z,w,h);rr(gp.x-wg*s/2,gp.y-hg*s/2,wg*s,hg*s,.7*s,'rgba(12,39,31,.72)','rgba(81,231,163,.13)');for(let i=0;i<4;i++){ctx.fillStyle=i%2?'rgba(66,164,112,.28)':'rgba(40,117,83,.34)';ctx.beginPath();ctx.arc(gp.x+(i-1.5)*wg*s*.19,gp.y+Math.sin(i*2.1)*hg*s*.18,Math.max(2,.28*s),0,Math.PI*2);ctx.fill();}}
    for(const [x,z,label,accent] of[[0,-10.3,'🏙 VALE ↑   •   1DS ↖   2DS ↗','#51e7a3'],[0,11,'3DS  ↙   ↘  SUB','#b58cff'],[-15,0,'← TORRE','#ffae63'],[15,0,'TRILHO →','#b58cff']]){const sp=project(x,z,w,h);rr(sp.x-2.3*s,sp.y-.58*s,4.6*s,1.16*s,.32*s,'rgba(3,14,20,.82)',hexToRgba(accent,.28));text(label,sp.x,sp.y,{size:Math.max(7,.48*s),weight:850,color:accent,align:'center'});}
    for(const [x,z] of treeSpots){const p=project(x,z,w,h),r=Math.max(3,.7*s);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(p.x+2,p.y+3,r*1.3,r*.55,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#173b31';ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(81,231,163,.3)';ctx.beginPath();ctx.arc(p.x-r*.25,p.y-r*.3,r*.48,0,Math.PI*2);ctx.fill();}
    for(const [x,z] of lampSpots){const p=project(x,z,w,h),pulse=.45+.25*Math.sin(time*2+x);ctx.fillStyle=`rgba(141,227,255,${pulse})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.8,.22*s),0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(150,214,230,.28)';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(4,.7*s),0,Math.PI*2);ctx.stroke();}
    for(const [x,z,rot] of benchSpots){const p=project(x,z,w,h);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(rot);rr(-1.3*s,-.28*s,2.6*s,.56*s,.18*s,'#24343c','rgba(142,194,211,.22)');ctx.restore();}
  }

  function drawExperience(exp,w,h,time){
    const p=project(exp.x,exp.z,w,h),s=metric(w,h),accent=exp.accent,pulse=.5+.5*Math.sin(time*2+exp.x*.13);
    ctx.save();ctx.translate(p.x,p.y);
    if(exp.type==='vale-portal'){
      // v14.10.8.58: entrada monumental e legível já na primeira tela 2D.
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
    ctx.globalAlpha=.95;rr(-2.8*s,2.3*s,5.6*s,.82*s,.35*s,'rgba(3,14,20,.8)',hexToRgba(accent,.32));text(exp.label,0,2.7*s,{size:Math.max(8,.62*s),weight:850,color:accent,align:'center'});
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
  function drawFooter(w,h){if(w<640||h<520)return;const wide=w>760;const label=wide?'Mapa interativo do Campus • mesmo mundo do modo 3D':'Mapa do Campus • modo leve';rr(14,h-50,wide?330:240,34,17,'rgba(4,14,20,.8)','rgba(129,196,216,.16)');text(label,30,h-33,{size:11,weight:680,color:'#bdd5df'});if(wide){text('WASD mover  •  E interagir  •  scroll zoom',w-26,h-30,{size:10.5,weight:620,color:'#809ba8',align:'right'});}}
  const draw=now=>{const {w,h}=resize(),time=reducedMotion?0:now/1000;zoom=lerp(zoom,zoomTarget,reducedMotion?1:.12);panX=lerp(panX,panTargetX,reducedMotion?1:.1);panZ=lerp(panZ,panTargetZ,reducedMotion?1:.1);drawBackground(w,h,time);drawLandscape(w,h,time);for(const exp of CAMPUS_EXPERIENCES)drawExperience(exp,w,h,time);drawChallenge(w,h,time);const counts=zoneCounts();for(const zone of zones)drawBuilding(zone,w,h,counts[zone.key]||0,time);drawCenter(w,h,time,counts);for(const o of state.others||[]){if(o.area==='vale-silicio')continue;const wp=toWorld(o.x,o.y),zone=zoneForOther(o),color=['teacher','admin','super_admin'].includes(o.participant_role)?'#ffd166':zone?.accent||'#68b7d0',dist=Math.hypot(player.x-wp.x,player.z-wp.z),staff=['teacher','admin','super_admin'].includes(o.participant_role),showLabel=staff||dist<(viewport.w<640?10:15)||(zoom>1.28&&viewport.w>=640);drawAvatar(wp.x,wp.z,(o.display_name||'Aluno').split(' ')[0],color,false,o.participant_role,Number(o.heading||0),time,showLabel,w,h);const bubble=chatBubbles.get(o.student_id);if(bubble&&bubble.until>Date.now())drawChatBubble(wp.x,wp.z,bubble.message,w,h);}const selfColor=state.avatarStyle?.accentCss||(isStaff()?'#ffd166':'#36d2ff');drawAvatar(player.x,player.z,(state.profile?.full_name||'Usuário').split(' ')[0],selfColor,true,state.profile?.role||'student',player.dir,time,true,w,h,state.avatarStyle||null);const ownBubble=chatBubbles.get(state.user?.id);if(ownBubble&&ownBubble.until>Date.now())drawChatBubble(player.x,player.z,ownBubble.message,w,h);drawFooter(w,h);};

  const keydown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;keys.add(e.code);if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat)onInteract?.();if(e.code==='Space'&&!e.repeat&&jump<=.01)jumpV=5.6;if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=true;if(e.code==='Equal'||e.code==='NumpadAdd')zoomTarget=clamp(zoomTarget+.12,.78,1.55);if(e.code==='Minus'||e.code==='NumpadSubtract')zoomTarget=clamp(zoomTarget-.12,.78,1.55);};
  const keyup=e=>{keys.delete(e.code);if(e.code==='ShiftLeft'||e.code==='ShiftRight')running=false;};
  const wheel=e=>{zoomTarget=clamp(zoomTarget-(Math.sign(e.deltaY)*.09),.78,1.55);e.preventDefault();};
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);canvas.addEventListener('wheel',wheel,{passive:false});
  const bindJoystick=()=>{const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');if(!root||!stick)return()=>{};let active=null;const update=e=>{const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),x=dx*k,y=dy*k;joy.x=x/max;joy.y=y/max;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;};const down=e=>{active=e.pointerId;root.setPointerCapture?.(active);update(e);},move=e=>{if(e.pointerId===active)update(e);},end=e=>{if(e.pointerId!==active)return;active=null;joy.x=joy.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',end);root.removeEventListener('pointercancel',end);};};
  const cleanJoy=bindJoystick(),jumpButton=document.getElementById('jump-button'),runButton=document.getElementById('run-button');const jumpTap=e=>{e.preventDefault();if(jump<=.01)jumpV=5.6;},runDown=e=>{e.preventDefault();running=true;},runUp=e=>{e.preventDefault();running=false;};jumpButton?.addEventListener('pointerdown',jumpTap);runButton?.addEventListener('pointerdown',runDown);runButton?.addEventListener('pointerup',runUp);runButton?.addEventListener('pointercancel',runUp);
  function frame(now){if(stopped)return;raf=requestAnimationFrame(frame);if(document.hidden){last=now;lastRenderGate=0;return;}const minFrame=1000/Math.max(15,fpsCap||60);if(lastRenderGate&&now-lastRenderGate<minFrame-1)return;lastRenderGate=now;const dt=Math.min(.05,(now-last)/1000||.016);last=now;let ix=((keys.has('KeyD')||keys.has('ArrowRight'))?1:0)-((keys.has('KeyA')||keys.has('ArrowLeft'))?1:0)+joy.x,iz=((keys.has('KeyS')||keys.has('ArrowDown'))?1:0)-((keys.has('KeyW')||keys.has('ArrowUp'))?1:0)+joy.y;const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;}const ride=train.tickTrip(now)||rides.tick(now);if(ride){player.x=ride.x;player.z=ride.z;player.dir=ride.heading||player.dir;jump=Math.max(0,ride.y||0);jumpV=0;ix=iz=0;}else{const speed=running?8:4.8;player.x=clamp(player.x+ix*speed*dt,-WORLD_X+1,WORLD_X-1);player.z=clamp(player.z+iz*speed*dt,-WORLD_Z+1,WORLD_Z-1);if(Math.hypot(ix,iz)>.02)player.dir=Math.atan2(ix,-iz);jumpV-=14*dt;jump+=jumpV*dt;if(jump<0){jump=0;jumpV=0;}}const area=areaAt(player.x,player.z);if(area!==lastArea){lastArea=area;onAreaChange?.(area);}if(zoomTarget>1.12){panTargetX=player.x*.5;panTargetZ=player.z*.5}else{panTargetX=0;panTargetZ=0;}let nearPortal=null,bestP=3.8;for(const z of zones){const p=portalPos[z.key],d=Math.hypot(player.x-p[0],player.z-p[1]);if(d<bestP){bestP=d;nearPortal=z;}}let nearStudent=null,bestS=3.2;for(const o of state.others||[]){const p=toWorld(o.x,o.y),d=Math.hypot(player.x-p.x,player.z-p.z);if(d<bestS){bestS=d;nearStudent=o;}}let station=null,stationDist=2.9;for(const st of CAMPUS_TRAIN_STATIONS){const d=Math.hypot(player.x-st.x,player.z-st.z);if(d<stationDist){stationDist=d;station=st;}}const exp=nearestExperience(player.x,player.z,3.7),nearWorldObject=!rides.isActive()&&!train.isTraveling()?(station?{id:`train-${station.id}`,type:'train-station',name:`Estação ${station.name}`,stationId:station.id,x:station.x,z:station.z,radius:2.9}:exp?attractionRef(exp):null):null;challenge.tick(player,now);const pp=toPresence(player.x,player.z);onPlayerState?.({x:pp.x,y:pp.y,area,nearPortal,nearStudent,nearWorldObject,moving:Math.hypot(ix,iz),running,onGround:jump<=.01});draw(now);}
  onQualityChange?.('low');raf=requestAnimationFrame(frame);
  return{ready:Promise.resolve(),setQuality:()=>onQualityChange?.('low'),getQuality:()=> 'low',teleportTo(target){if(!target)return false;rides.cancel({silent:true});train.cancel();challenge.cancel();player.x=clamp(Number(target.x)||0,-WORLD_X+1,WORLD_X-1);player.z=clamp(Number(target.z)||0,-WORLD_Z+1,WORLD_Z-1);jump=0;jumpV=0;return true;},getDestinations:()=>teleportDestinations.map(item=>({...item})),getTrainStations:()=>train.stations(),startTrainTo:id=>{rides.cancel({silent:true});challenge.cancel();return train.startTrip(id,{x:player.x,z:player.z});},setWorldTimeMode:m=>{worldTimeMode=['auto','day','night'].includes(m)?m:'auto';lastWorldClock='';return worldTimeMode;},getWorldTimeMode:()=>worldTimeMode,setFPSCap:v=>{fpsCap=clamp(Number(v)||60,15,60);return fpsCap;},getFPSCap:()=>fpsCap,setFov:()=>null,getFov:()=>null,setCameraMode:()=> 'lite',showChatMessage(senderId,message){chatBubbles.set(senderId,{message:String(message||'').slice(0,90),until:Date.now()+6500});return true;},startChallenge,restartChallenge,cancelChallenge,startExperience,cancelExperience:()=>rides.cancel(),jump:()=>{if(jump<=.01&&!rides.isActive()&&!train.isTraveling())jumpV=5.6;},setRun:v=>{running=!!v;},setLocalEmote(kind){emote=kind;emoteUntil=Date.now()+4500;},stop(){stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('resize',requestSize);window.visualViewport?.removeEventListener?.('resize',requestSize);resizeObserver?.disconnect();canvas.removeEventListener('wheel',wheel);jumpButton?.removeEventListener('pointerdown',jumpTap);runButton?.removeEventListener('pointerdown',runDown);runButton?.removeEventListener('pointerup',runUp);runButton?.removeEventListener('pointercancel',runUp);cleanJoy?.();}};
}

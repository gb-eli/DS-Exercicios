export const PARQUE_VERSION='14.10.8.80-f7';
export const PARQUE_WORLD_ID='parque-diversoes-agv';
export const PARQUE_SCENE='parque';
export const PARQUE_BOUNDS=Object.freeze({minX:-180,maxX:180,minZ:-180,maxZ:180});
export const PARQUE_SPAWN=Object.freeze({x:0,y:.2,z:145});
export const PARQUE_RETURN_PORTAL=Object.freeze({
  id:'parque-retorno-campus',type:'return-portal',name:'Portal de Retorno ao Campus DS',label:'VOLTAR AO CAMPUS DS',
  x:0,y:0,z:164,radius:7,interaction:'Voltar ao Campus',targetWorldId:'campus-ds',targetSpawn:'main'
});

export const PARQUE_THEME=Object.freeze({
  name:'Parque de Diversões AGV',tagline:'Diversão, desafios e exploração',
  accent:'#ff7b35',secondary:'#38bdf8',ground:'#153b35',path:'#e7d7ba'
});

export const PARQUE_ZONES=Object.freeze([
  Object.freeze({id:'entrada',name:'Portal de Entrada',x:0,z:145,radius:24,accent:'#ffd166'}),
  Object.freeze({id:'praca-central',name:'Praça Central',x:0,z:18,radius:38,accent:'#38bdf8'}),
  Object.freeze({id:'montanha-russa',name:'Montanha-Russa Vulcão',x:-92,z:-72,radius:60,accent:'#ff7b35'}),
  Object.freeze({id:'corrida',name:'Circuito AGV Racing',x:-98,z:82,radius:58,accent:'#51e7a3'}),
  Object.freeze({id:'parkour',name:'Sky Obby AGV',x:72,z:-72,radius:58,accent:'#a78bfa'}),
  Object.freeze({id:'mega-slide',name:'Mega Escorregador',x:126,z:28,radius:42,accent:'#fb7185'}),
  Object.freeze({id:'tiro-alvo',name:'Arena Tiro ao Alvo',x:82,z:98,radius:34,accent:'#facc15'})
]);

const freezePoint=p=>Object.freeze({...p});
const route=(id,name,difficulty,accent,rewardXp,points)=>Object.freeze({
  id,name,difficulty,accent,rewardXp,checkpoints:Object.freeze(points.map(freezePoint))
});

export const PARKOUR_ROUTES=Object.freeze({
  easy:route('easy','Rota Fácil','Fácil','#51e7a3',50,[
    {id:'e0',x:45,y:.2,z:-38,w:7,d:7,kind:'start'},
    {id:'e1',x:50,y:1.4,z:-45,w:7,d:6,kind:'static'},
    {id:'e2',x:55,y:2.6,z:-52,w:6.5,d:6.5,kind:'static'},
    {id:'e3',x:61,y:3.8,z:-58,w:6.5,d:6,kind:'tube'},
    {id:'e4',x:67,y:5.0,z:-63,w:6,d:6,kind:'static'},
    {id:'e5',x:73,y:6.2,z:-68,w:6,d:5.5,kind:'moving',axis:'x',range:2.4,speed:.9,phase:.2},
    {id:'e6',x:77,y:7.3,z:-74,w:6,d:6,kind:'static'},
    {id:'e7',x:72,y:8.5,z:-80,w:6.5,d:6.5,kind:'falling',fallDelayMs:900,resetMs:2400},
    {id:'e8',x:65,y:9.8,z:-78,w:7,d:7,kind:'finish'}
  ]),
  medium:route('medium','Rota Média','Médio','#a78bfa',100,[
    {id:'m0',x:52,y:.2,z:-42,w:6,d:6,kind:'start'},
    {id:'m1',x:58,y:1.5,z:-48,w:5.2,d:5.2,kind:'static'},
    {id:'m2',x:64,y:3.0,z:-56,w:5,d:4.8,kind:'moving',axis:'z',range:2.5,speed:1.0,phase:.7},
    {id:'m3',x:71,y:4.6,z:-62,w:4.8,d:4.8,kind:'tube'},
    {id:'m4',x:79,y:6.1,z:-68,w:4.6,d:4.6,kind:'falling',fallDelayMs:780,resetMs:2600},
    {id:'m5',x:87,y:8.0,z:-75,w:4.6,d:4.6,kind:'static'},
    {id:'m6',x:82,y:10.5,z:-84,w:4.4,d:4.4,kind:'spinner',spinSpeed:1.7,barLength:8},
    {id:'m7',x:72,y:12.5,z:-89,w:4.2,d:7.5,kind:'narrow'},
    {id:'m8',x:61,y:14.5,z:-84,w:4.2,d:4.2,kind:'moving',axis:'x',range:3.4,speed:1.2,phase:1.6},
    {id:'m9',x:55,y:16.5,z:-74,w:4,d:4,kind:'falling',fallDelayMs:700,resetMs:2800},
    {id:'m10',x:64,y:18.5,z:-66,w:7,d:7,kind:'finish'}
  ]),
  hard:route('hard','Rota Difícil','Difícil','#fb7185',175,[
    {id:'h0',x:91,y:.2,z:-45,w:5.2,d:5.2,kind:'start'},
    {id:'h1',x:96,y:2.2,z:-51,w:3.8,d:3.8,kind:'moving',axis:'x',range:3.2,speed:1.35,phase:.3},
    {id:'h2',x:99,y:4.2,z:-59,w:3.4,d:6.8,kind:'narrow'},
    {id:'h3',x:94,y:6.4,z:-67,w:3.6,d:3.6,kind:'falling',fallDelayMs:620,resetMs:3000},
    {id:'h4',x:88,y:8.7,z:-74,w:3.5,d:3.5,kind:'spinner',spinSpeed:2.2,barLength:9},
    {id:'h5',x:94,y:11.0,z:-82,w:3.6,d:3.6,kind:'moving',axis:'z',range:4.0,speed:1.45,phase:1.1},
    {id:'h6',x:103,y:13.0,z:-86,w:3.2,d:6.4,kind:'narrow'},
    {id:'h7',x:109,y:15.3,z:-79,w:3.4,d:3.4,kind:'tube'},
    {id:'h8',x:107,y:17.8,z:-69,w:3.3,d:3.3,kind:'falling',fallDelayMs:560,resetMs:3200},
    {id:'h9',x:101,y:20.2,z:-61,w:3.2,d:3.2,kind:'moving',axis:'x',range:4.2,speed:1.65,phase:2.4},
    {id:'h10',x:93,y:22.4,z:-57,w:3.1,d:6.2,kind:'narrow'},
    {id:'h11',x:84,y:24.6,z:-61,w:3.2,d:3.2,kind:'spinner',spinSpeed:2.5,barLength:8},
    {id:'h12',x:78,y:27.0,z:-68,w:6,d:6,kind:'finish'}
  ])
});
export const PARKOUR_DEFAULT_ROUTE='medium';
export const PARKOUR_START=Object.freeze({...PARKOUR_ROUTES.medium.checkpoints[0]});
export const PARKOUR_CHECKPOINTS=PARKOUR_ROUTES.medium.checkpoints;
export const PARKOUR_START_PADS=Object.freeze([
  Object.freeze({id:'parkour-easy-start',type:'challenge',name:'Sky Obby — Rota Fácil',label:'PARKOUR FÁCIL',routeId:'easy',x:45,y:0,z:-38,radius:5.5,interaction:'Iniciar rota Fácil'}),
  Object.freeze({id:'parkour-medium-start',type:'challenge',name:'Sky Obby — Rota Média',label:'PARKOUR MÉDIO',routeId:'medium',x:52,y:0,z:-42,radius:5.5,interaction:'Iniciar rota Média'}),
  Object.freeze({id:'parkour-hard-start',type:'challenge',name:'Sky Obby — Rota Difícil',label:'PARKOUR DIFÍCIL',routeId:'hard',x:91,y:0,z:-45,radius:5.5,interaction:'Iniciar rota Difícil'})
]);

export const SLIDE_TOWER=Object.freeze({
  id:'mega-slide-tower',x:126,z:28,height:50,topY:48,
  elevator:Object.freeze({bottom:Object.freeze({x:132.2,y:2,z:34.2}),top:Object.freeze({x:132.2,y:48.4,z:34.2}),rideSeconds:6.2}),
  deck:Object.freeze({x:126,y:48.5,z:28,w:14,d:14}),
  launch:Object.freeze({x:126,y:48.7,z:23}),
  viewpoint:Object.freeze({x:121,y:49,z:31}),
  pool:Object.freeze({x:112,y:.25,z:57,radius:12}),
  top:Object.freeze({x:126,y:48.5,z:23})
});
export const SLIDE_PATH=Object.freeze([
  freezePoint({x:126,y:48.7,z:23}),freezePoint({x:122,y:44,z:25}),freezePoint({x:117,y:37,z:31}),
  freezePoint({x:112,y:30,z:37}),freezePoint({x:116,y:23,z:43}),freezePoint({x:109,y:15,z:48}),
  freezePoint({x:106,y:8,z:54}),freezePoint({x:112,y:1.2,z:57})
]);
export const SLIDE_INTERACTIONS=Object.freeze([
  Object.freeze({id:'slide-elevator',type:'ride',name:'Elevador do Mega Escorregador',label:'ELEVADOR',x:132.2,y:0,z:34.2,radius:5.2,interaction:'Subir de elevador'}),
  Object.freeze({id:'slide-elevator-top',type:'ride',name:'Elevador — Plataforma Superior',label:'ELEVADOR DESCER',x:132.2,y:48.4,z:34.2,radius:4.5,interaction:'Descer de elevador'}),
  Object.freeze({id:'slide-launch',type:'ride',name:'Entrada do Mega Escorregador',label:'DESCER!',x:126,y:48.7,z:23,radius:4.2,interaction:'Descer no escorregador'}),
  Object.freeze({id:'slide-viewpoint',type:'viewpoint',name:'Mirante Mega Altura',label:'MIRANTE',x:121,y:49,z:31,radius:4,interaction:'Usar mirante'})
]);

export const PARQUE_LANDMARKS=Object.freeze([
  Object.freeze({id:'entrada-principal',type:'landmark',name:'Entrada Principal',label:'PARQUE AGV',x:0,y:0,z:142,radius:6,interaction:'Conhecer entrada'}),
  Object.freeze({id:'fonte-central',type:'landmark',name:'Fonte Central',label:'PRAÇA CENTRAL',x:0,y:0,z:18,radius:5,interaction:'Observar fonte'}),
  Object.freeze({id:'coaster-station',type:'ride',name:'Estação da Montanha-Russa',label:'MONTANHA-RUSSA',x:-77,y:0,z:-43,radius:7,interaction:'Embarcar'}),
  Object.freeze({id:'race-pits',type:'race',name:'Box do Circuito AGV Racing',label:'CORRIDA',x:-92,y:0,z:48,radius:8,interaction:'Entrar na corrida'}),
  ...PARKOUR_START_PADS,
  ...SLIDE_INTERACTIONS,
  Object.freeze({id:'shooting-booth',type:'challenge',name:'Arena Tiro ao Alvo',label:'TIRO AO ALVO',x:82,y:0,z:100,radius:7,interaction:'Iniciar rodada'})
]);


export const PARQUE_SPECTATOR_SPOTS=Object.freeze([
  Object.freeze({id:'spectator-coaster',type:'spectator',experienceId:'coaster',name:'Arquibancada da Montanha-Russa',label:'ASSISTIR COASTER',x:-48,y:0,z:-98,radius:6,interaction:'Assistir Montanha-Russa'}),
  Object.freeze({id:'spectator-race',type:'spectator',experienceId:'race',name:'Arquibancada AGV Racing',label:'ASSISTIR CORRIDA',x:-98,y:0,z:126,radius:7,interaction:'Assistir corrida'}),
  Object.freeze({id:'spectator-parkour',type:'spectator',experienceId:'parkour',name:'Mirante Sky Obby',label:'ASSISTIR PARKOUR',x:42,y:0,z:-73,radius:6,interaction:'Assistir Parkour'}),
  Object.freeze({id:'spectator-shooting',type:'spectator',experienceId:'shooting',name:'Área de Espectadores do Tiro',label:'ASSISTIR TIRO',x:106,y:0,z:101,radius:6,interaction:'Assistir Tiro ao Alvo'})
]);

export const PARQUE_SERVICES=Object.freeze([
  Object.freeze({id:'lanchonete-central',type:'service',name:'Lanchonete Central',x:-26,y:0,z:30,radius:5,interaction:'Visitar'}),
  Object.freeze({id:'banheiros-central',type:'service',name:'Banheiros',x:27,y:0,z:31,radius:5,interaction:'Localizar'}),
  Object.freeze({id:'primeiros-socorros',type:'service',name:'Primeiros Socorros',x:24,y:0,z:118,radius:5,interaction:'Localizar'}),
  Object.freeze({id:'mirante-coaster',type:'viewpoint',name:'Mirante da Montanha-Russa',x:-42,y:0,z:-105,radius:5,interaction:'Usar mirante'})
]);

export const COASTER=Object.freeze({
  id:'vulcao-coaster',name:'Montanha-Russa Vulcão',center:Object.freeze({x:-92,z:-72}),
  durationSeconds:22,seatCount:12,rewardXp:75,
  station:Object.freeze({x:-77,y:1.1,z:-43,exitX:-70,exitY:.2,exitZ:-39}),
  localPath:Object.freeze([
    [15,2,29],[-10,8,25],[-30,16,18],[-45,2,0],[-35,8,-18],[-20,22,-30],
    [0,36,-34],[18,14,-26],[36,6,-8],[45,12,12],[30,27,24],[15,2,29]
  ].map(([x,y,z])=>freezePoint({x,y,z})))
});

const RACE_CHECKPOINT_COUNT=12;
const RACE_CENTER=Object.freeze({x:-98,z:82});
const RACE_RX=54,RACE_RZ=36;
export const RACE_CHECKPOINTS=Object.freeze(Array.from({length:RACE_CHECKPOINT_COUNT},(_,i)=>{
  const angle=-Math.PI/2+i*Math.PI*2/RACE_CHECKPOINT_COUNT;
  return freezePoint({id:`race-cp-${i}`,index:i,angle,x:RACE_CENTER.x+Math.cos(angle)*RACE_RX,z:RACE_CENTER.z+Math.sin(angle)*RACE_RZ,radius:i===0?9:8});
}));
export const RACE_TRACK=Object.freeze({
  id:'agv-racing',center:RACE_CENTER,rx:RACE_RX,rz:RACE_RZ,width:9,laps:3,maxKarts:8,
  start:Object.freeze({x:RACE_CENTER.x,z:RACE_CENTER.z-RACE_RZ,heading:Math.PI/2}),
  pits:Object.freeze({x:-92,z:48}),checkpoints:RACE_CHECKPOINTS,
  countdownMs:3000,maxSpeed:21,reverseMaxSpeed:7,acceleration:14,brakePower:24,drag:4.2,steerRate:2.25,rewardXp:200
});

export const SHOOTING_GALLERY=Object.freeze({
  id:'tiro-alvo',x:82,z:98,roundSeconds:45,targetCount:8,respawnMs:1350,rewardXpMax:150,
  player:Object.freeze({x:82,y:.2,z:106,heading:Math.PI}),
  targets:Object.freeze([
    {id:'t1',x:73,y:2.8,z:84,points:10,motion:'none',phase:.2},
    {id:'t2',x:78,y:3.6,z:82,points:20,motion:'vertical',range:1.2,speed:1.25,phase:1.1},
    {id:'t3',x:83,y:2.6,z:84,points:10,motion:'horizontal',range:1.8,speed:1.1,phase:2.2},
    {id:'t4',x:88,y:4.2,z:82,points:30,motion:'horizontal',range:2.4,speed:1.45,phase:.7},
    {id:'t5',x:93,y:3.4,z:84,points:20,motion:'vertical',range:1.4,speed:1.3,phase:2.8},
    {id:'t6',x:76,y:2.2,z:88,points:15,motion:'horizontal',range:1.4,speed:1.5,phase:1.8},
    {id:'t7',x:84,y:3.1,z:88,points:25,motion:'vertical',range:1.0,speed:1.65,phase:.4},
    {id:'t8',x:91,y:2.4,z:88,points:15,motion:'none',phase:2.4}
  ].map(freezePoint))
});

export const PARQUE_FAST_TRAVEL=Object.freeze([
  {id:'entrada',name:'Entrada Principal',x:0,z:145,kind:'landmark'},
  {id:'praca',name:'Praça Central',x:0,z:18,kind:'landmark'},
  {id:'coaster',name:'Montanha-Russa',x:-77,z:-43,kind:'ride'},
  {id:'race',name:'Circuito AGV Racing',x:-92,z:48,kind:'race'},
  {id:'parkour',name:'Sky Obby AGV',x:52,z:-42,kind:'challenge'},
  {id:'slide',name:'Mega Escorregador',x:132,z:39,kind:'ride'},
  {id:'shooting',name:'Tiro ao Alvo',x:82,z:100,kind:'challenge'},
  {id:'return',name:'Voltar ao Campus',x:0,z:164,kind:'portal'}
].map(Object.freeze));

export function clampParque(value,min,max){return Math.max(min,Math.min(max,value));}
export function parqueWorldToPresence(x,z){
  const px=((Number(x)||0)-PARQUE_BOUNDS.minX)/(PARQUE_BOUNDS.maxX-PARQUE_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-PARQUE_BOUNDS.minZ)/(PARQUE_BOUNDS.maxZ-PARQUE_BOUNDS.minZ)*1000;
  return{x:Math.round(clampParque(px,0,1600)),y:Math.round(clampParque(py,0,1000))};
}
export function parquePresenceToWorld(x,y){
  return{
    x:PARQUE_BOUNDS.minX+(clampParque(Number(x)||800,0,1600)/1600)*(PARQUE_BOUNDS.maxX-PARQUE_BOUNDS.minX),
    z:PARQUE_BOUNDS.minZ+(clampParque(Number(y)||500,0,1000)/1000)*(PARQUE_BOUNDS.maxZ-PARQUE_BOUNDS.minZ)
  };
}
export function areaAtParque(x,z){
  let best=PARQUE_ZONES[1],distance=Infinity;
  for(const zone of PARQUE_ZONES){const d=Math.hypot(x-zone.x,z-zone.z);if(d<distance){best=zone;distance=d;}}
  return best?.id||'praca-central';
}
export function parkourRoute(id=PARKOUR_DEFAULT_ROUTE){return PARKOUR_ROUTES[id]||PARKOUR_ROUTES[PARKOUR_DEFAULT_ROUTE];}
export function parkourPlatformPosition(platform,time=0){
  let x=platform.x,z=platform.z;if(platform.kind==='moving'){
    const offset=Math.sin(time*Number(platform.speed||1)+Number(platform.phase||0))*Number(platform.range||2);
    if(platform.axis==='z')z+=offset;else x+=offset;
  }
  return{x,y:platform.y,z};
}
export function sampleSlidePath(t){
  const u=clampParque(Number(t)||0,0,1),scaled=u*(SLIDE_PATH.length-1),i=Math.min(SLIDE_PATH.length-2,Math.floor(scaled)),f=scaled-i,a=SLIDE_PATH[i],b=SLIDE_PATH[i+1];
  const smooth=f*f*(3-2*f);return{x:a.x+(b.x-a.x)*smooth,y:a.y+(b.y-a.y)*smooth,z:a.z+(b.z-a.z)*smooth};
}
function catmullScalar(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;
  return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);
}
export function sampleCoasterPath(t){
  const pts=COASTER.localPath,n=pts.length-1,u=((Number(t)||0)%1+1)%1,scaled=u*n,i=Math.floor(scaled),f=scaled-i;
  const at=k=>pts[(k+n)%n],p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2);
  return{
    x:COASTER.center.x+catmullScalar(p0.x,p1.x,p2.x,p3.x,f),
    y:catmullScalar(p0.y,p1.y,p2.y,p3.y,f),
    z:COASTER.center.z+catmullScalar(p0.z,p1.z,p2.z,p3.z,f)
  };
}
export function raceTrackMetric(x,z){
  const dx=(Number(x)||0)-RACE_TRACK.center.x,dz=(Number(z)||0)-RACE_TRACK.center.z;
  return Math.sqrt((dx*dx)/(RACE_TRACK.rx*RACE_TRACK.rx)+(dz*dz)/(RACE_TRACK.rz*RACE_TRACK.rz));
}
export function clampRaceToTrack(x,z){
  const dx=(Number(x)||0)-RACE_TRACK.center.x,dz=(Number(z)||0)-RACE_TRACK.center.z,metric=Math.max(.001,raceTrackMetric(x,z));
  const min=.78,max=1.22;if(metric>=min&&metric<=max)return{x:Number(x),z:Number(z),offTrack:false,metric};
  const target=metric<min?min:max,scale=target/metric;
  return{x:RACE_TRACK.center.x+dx*scale,z:RACE_TRACK.center.z+dz*scale,offTrack:true,metric};
}
export function shootingTargetPosition(target,time=0){
  let x=target.x,y=Number(target.y||2.5),z=target.z;
  const wave=Math.sin(Number(time||0)*Number(target.speed||1)+Number(target.phase||0))*Number(target.range||0);
  if(target.motion==='horizontal')x+=wave;else if(target.motion==='vertical')y+=wave;
  return{x,y,z};
}

export function nearestParqueObject(x,z,objects,maxDistance=8){
  let best=null,bestDistance=maxDistance;
  for(const object of objects||[]){const d=Math.hypot(x-Number(object.x||0),z-Number(object.z||0)),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}
export function nearestParqueObject3D(x,y,z,objects,maxDistance=8){
  let best=null,bestDistance=maxDistance;
  for(const object of objects||[]){const oy=Number(object.y||0),vertical=Math.abs((Number(y)||0)-oy);if(vertical>Math.max(4,Number(object.verticalRadius||4.5)))continue;const d=Math.hypot(x-Number(object.x||0),z-Number(object.z||0),vertical*.55),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

import { CAMPUS_TOOL_EXPERIENCES } from './campus-destinations.js?v=14.10.8.65';
import { CAMPUS_PEDESTRIAN_SURFACES } from './campus-city-network.js?v=14.10.8.65';
export const CAMPUS_EXPERIENCES=Object.freeze([
  ...CAMPUS_TOOL_EXPERIENCES,
  Object.freeze({id:'vale-portal',type:'vale-portal',name:'Portal Vale do Silício AGV',label:'VALE DO SILÍCIO AGV',subtitle:'27 EMPRESAS • 8 DISTRITOS',x:0,z:-15.4,radius:5.8,accent:'#51e7a3',interaction:'Viajar para o Vale',description:'Empresas e projetos criados pelos alunos. Entrada principal para a cidade tecnológica estudantil.'}),
  Object.freeze({id:'parkour',type:'parkour',name:'Circuito Parkour',label:'PARKOUR 01—05',x:-10.5,z:18.4,radius:4.4,accent:'#ff6b7a',interaction:'Iniciar circuito',description:'Circuito de plataformas e checkpoints para usar enquanto a atividade não começa.'}),
  Object.freeze({id:'pool',type:'pool',name:'Piscina Neon',label:'PISCINA NEON',x:10.4,z:18.2,radius:3.7,accent:'#43d9ff',interaction:'Relaxar no deck',description:'Área de convivência com água animada e deck iluminado.'}),
  Object.freeze({id:'playground',type:'playground',name:'Parquinho DS',label:'PARQUINHO DS',x:-10.6,z:-18.1,radius:3.6,accent:'#ffd166',interaction:'Usar o balanço',description:'Área recreativa com balanços, gangorra, barras e piso emborrachado.'}),
  Object.freeze({id:'slide',type:'slide',name:'Escorregador Turbo',label:'ESCORREGADOR',x:10.5,z:-18.2,radius:3.5,accent:'#7cf29a',interaction:'Descer',description:'Suba os degraus e faça uma descida curta com retorno seguro.'}),
  Object.freeze({id:'coaster',type:'coaster',name:'Monotrilho AGV',label:'MONOTRILHO AGV',x:20.0,z:0,radius:4.2,accent:'#b58cff',interaction:'Escolher estação',description:'Transporte rápido do Campus com estações para os principais destinos.'}),
  Object.freeze({id:'tower',type:'tower',name:'Torre de Controle AGV',label:'TORRE DE CONTROLE',x:-20.0,z:0,radius:4.2,accent:'#ffae63',interaction:'Subir à torre',description:'Torre panorâmica alta com escadas, plataformas e visão ampla do Campus.'})
]);

// Plataformas compartilhadas entre render e colisão do parkour 3D.
// Coordenadas em metros no mundo do Campus; h é a altura da superfície superior.
export const PARKOUR_PLATFORMS=Object.freeze([
  Object.freeze({id:'start',x:-13.15,z:16.80,w:1.55,d:1.00,h:.18,checkpoint:false}),
  Object.freeze({id:'p1',x:-12.85,z:18.90,w:.95,d:.95,h:.55,checkpoint:true}),
  Object.freeze({id:'p2',x:-11.65,z:17.68,w:.95,d:.95,h:.82,checkpoint:true}),
  Object.freeze({id:'p3',x:-10.45,z:19.08,w:.95,d:.95,h:1.05,checkpoint:true}),
  Object.freeze({id:'p4',x:-9.18,z:17.80,w:.95,d:.95,h:.72,checkpoint:true}),
  Object.freeze({id:'p5',x:-8.15,z:18.88,w:.95,d:.95,h:1.18,checkpoint:true})
]);

export const LITE_PARKOUR_CHECKPOINTS=Object.freeze(
  PARKOUR_PLATFORMS.filter(item=>item.checkpoint).map(item=>Object.freeze([item.x,item.z]))
);

export const PARKOUR_START=Object.freeze({x:PARKOUR_PLATFORMS[0].x,z:PARKOUR_PLATFORMS[0].z,y:PARKOUR_PLATFORMS[0].h});

const freezeNodes=nodes=>Object.freeze(nodes.map(([x,y,z])=>Object.freeze({x,y,z})));

// Trajetos locais e puramente recreativos. Não são persistidos nem enviados ao backend.
export const CAMPUS_RIDES=Object.freeze({
  slide:Object.freeze({id:'slide',duration:5.2,camera:'wide',loop:false,nodes:freezeNodes([
    [8.35,.05,-18.85],[8.55,.45,-18.80],[8.75,.95,-18.72],[8.95,1.55,-18.62],[9.15,2.25,-18.52],[9.35,3.05,-18.42],
    [9.60,3.65,-18.30],[9.95,3.95,-18.18],[10.35,3.92,-18.02],[10.75,3.65,-17.82],[11.10,3.15,-17.62],
    [11.42,2.55,-17.46],[11.72,1.86,-17.34],[12.02,1.18,-17.26],[12.28,.62,-17.20],[12.52,.18,-17.18],[12.75,.05,-17.18]
  ])}),
  tower:Object.freeze({id:'tower',duration:10.8,camera:'campus',loop:false,nodes:freezeNodes([
    [-23.3,.05,.6],[-22.9,.6,.55],[-22.45,1.25,.5],[-22.0,2.0,.45],[-21.55,2.9,.38],[-21.1,3.9,.3],[-20.7,5.0,.22],[-20.35,6.2,.12],[-20.05,7.5,.05],[-19.8,9.0,0],[-19.6,10.7,0],[-19.5,12.4,0],[-19.5,14.0,0]
  ])}),
  playground:Object.freeze({id:'playground',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[-10.6,.05,-18.1],[-10.6,.35,-18.0],[-10.6,.05,-18.1]])}),
  pool:Object.freeze({id:'pool',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[10.4,.05,20.35],[10.4,.05,20.35]])})
});

export const CAMPUS_TRAIN_STATIONS=Object.freeze([
  Object.freeze({id:'central',name:'Praça Central',x:0,z:-7.2,accent:'#36d2ff'}),
  Object.freeze({id:'1ds',name:'1DS',x:-18.6,z:-10.0,accent:'#36d2ff'}),
  Object.freeze({id:'parkour',name:'Parkour',x:-12.0,z:15.6,accent:'#ff6b7a'}),
  Object.freeze({id:'3ds',name:'3DS',x:-18.6,z:10.0,accent:'#b58cff'}),
  Object.freeze({id:'pool',name:'Piscina',x:11.8,z:15.8,accent:'#43d9ff'}),
  Object.freeze({id:'sub',name:'SUB',x:18.6,z:10.0,accent:'#ffae63'}),
  Object.freeze({id:'vale',name:'Vale do Silício AGV',x:0,z:-13.0,accent:'#51e7a3'}),
  Object.freeze({id:'2ds',name:'2DS',x:18.6,z:-10.0,accent:'#51e7a3'})
]);

// Rota fechada do monotrilho. As estações coincidem com pontos da rota para permitir frenagem e parada.
export const CAMPUS_TRAIN_ROUTE=Object.freeze([
  Object.freeze({x:0,z:-7.2}),Object.freeze({x:-8,z:-9}),Object.freeze({x:-18.6,z:-10}),Object.freeze({x:-24,z:-5}),
  Object.freeze({x:-24,z:5}),Object.freeze({x:-18.6,z:10}),Object.freeze({x:-12,z:15.6}),Object.freeze({x:0,z:18.4}),
  Object.freeze({x:11.8,z:15.8}),Object.freeze({x:18.6,z:10}),Object.freeze({x:24,z:5}),Object.freeze({x:24,z:-5}),
  Object.freeze({x:18.6,z:-10}),Object.freeze({x:8,z:-12}),Object.freeze({x:0,z:-13}),Object.freeze({x:0,z:-7.2})
]);

export const CAMPUS_BUILDING_ROOF_HEIGHT=11.0;
const generatedVertical=[];
for(const [key,layout] of Object.entries({
  '1ds':{x:-27,z:-17,side:-1},'2ds':{x:27,z:-17,side:1},'3ds':{x:-27,z:17,side:-1},sub:{x:27,z:17,side:1}
})){
  // telhado acessível
  generatedVertical.push(Object.freeze({id:`roof-${key}`,type:'roof',x:layout.x,z:layout.z,w:15.2,d:7.1,h:CAMPUS_BUILDING_ROOF_HEIGHT}));
  // escada externa em 18 degraus no lado externo do prédio
  const steps=18,outerX=layout.x+layout.side*9.2,startZ=layout.z-3.7;
  for(let i=0;i<steps;i++){
    const t=(i+1)/steps,h=CAMPUS_BUILDING_ROOF_HEIGHT*t,z=startZ+t*7.4;
    generatedVertical.push(Object.freeze({id:`stairs-${key}-${i+1}`,type:'step',x:outerX-layout.side*.55,z,w:1.35,d:.44,h}));
  }
  generatedVertical.push(Object.freeze({id:`bridge-${key}`,type:'bridge',x:layout.x+layout.side*8.2,z:layout.z+3.7,w:2.6,d:1.2,h:CAMPUS_BUILDING_ROOF_HEIGHT}));
}
// rampa panorâmica independente próxima à pista de pouso.
for(let i=0;i<12;i++){const t=(i+1)/12;generatedVertical.push(Object.freeze({id:`ramp-${i+1}`,type:'ramp',x:27.5+t*7.2,z:21.5,w:.72,d:3.0,h:t*4.2}));}
generatedVertical.push(...CAMPUS_PEDESTRIAN_SURFACES);
export const CAMPUS_VERTICAL_SURFACES=Object.freeze(generatedVertical);
export function campusSurfaceAt(x,z,padding=0){
  let best=null;for(const s of CAMPUS_VERTICAL_SURFACES){if(Math.abs(x-s.x)<=s.w/2+padding&&Math.abs(z-s.z)<=s.d/2+padding){if(!best||s.h>best.h)best=s;}}
  const park=parkourPlatformAt(x,z,padding);if(park&&(!best||park.h>best.h))best=park;return best;
}


export function parkourPlatformAt(x,z,padding=0){
  let best=null;
  for(const platform of PARKOUR_PLATFORMS){
    if(Math.abs(x-platform.x)<=platform.w/2+padding&&Math.abs(z-platform.z)<=platform.d/2+padding){
      if(!best||platform.h>best.h)best=platform;
    }
  }
  return best;
}

export function nearestExperience(x,z,maxDistance=3.0){
  let best=null,bestDistance=Infinity;
  for(const experience of CAMPUS_EXPERIENCES){
    const target=experience.type==='tool-building'&&experience.entrance?experience.entrance:experience;
    const distance=Math.hypot(x-target.x,z-target.z);
    const allowed=Math.max(Number(maxDistance||0),Number(experience.radius||0));
    if(distance<allowed&&distance<bestDistance){best=experience;bestDistance=distance;}
  }
  return best?{...best,distance:bestDistance}:null;
}

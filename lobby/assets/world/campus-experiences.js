import { CAMPUS_ZONE_LAYOUT } from './campus-manifest.js?v=14.10.8.66';
import { CAMPUS_TOOL_EXPERIENCES } from './campus-destinations.js?v=14.10.8.66';
import { CAMPUS_PEDESTRIAN_SURFACES } from './campus-city-network.js?v=14.10.8.66';

export const CAMPUS_EXPERIENCES=Object.freeze([
  ...CAMPUS_TOOL_EXPERIENCES,
  Object.freeze({id:'vale-portal',type:'vale-portal',name:'Portal Vale do Silício AGV',label:'VALE DO SILÍCIO AGV',subtitle:'27 EMPRESAS • 8 DISTRITOS',x:0,z:-29.5,radius:5.8,accent:'#51e7a3',interaction:'Viajar para o Vale',description:'Empresas e projetos criados pelos alunos. Entrada principal para a cidade tecnológica estudantil.'}),
  Object.freeze({id:'parkour',type:'parkour',name:'Circuito Parkour',label:'PARKOUR 01—05',x:-14,z:15,radius:4.4,accent:'#ff6b7a',district:'Parque Norte',interaction:'Iniciar circuito',description:'Circuito de plataformas e checkpoints para usar enquanto a atividade não começa.'}),
  Object.freeze({id:'pool',type:'pool',name:'Piscina Neon',label:'PISCINA NEON',x:14,z:15,radius:3.7,accent:'#43d9ff',district:'Parque Norte',interaction:'Relaxar no deck',description:'Área de convivência com água animada e deck iluminado.'}),
  Object.freeze({id:'playground',type:'playground',name:'Parquinho DS',label:'PARQUINHO DS',x:-14,z:-15,radius:3.6,accent:'#ffd166',district:'Parque Sul',interaction:'Usar o balanço',description:'Área recreativa com balanços, gangorra, barras e piso emborrachado.'}),
  Object.freeze({id:'slide',type:'slide',name:'Escorregador Turbo',label:'ESCORREGADOR',x:14,z:-15,radius:3.5,accent:'#7cf29a',district:'Parque Sul',interaction:'Descer',description:'Suba os degraus e faça uma descida curta com retorno seguro.'}),
  Object.freeze({id:'coaster',type:'coaster',name:'Estação Intermodal AGV',label:'ESTAÇÃO INTERMODAL',x:34,z:-6,radius:4.2,accent:'#b58cff',district:'Mobilidade Leste',interaction:'Escolher estação',description:'Ponto intermodal conectado ao monotrilho e aos principais destinos do Campus.'}),
  Object.freeze({id:'tower',type:'tower',name:'Mirante AGV',label:'MIRANTE AGV',x:-34,z:6,radius:4.2,accent:'#ffae63',district:'Tech Oeste',interaction:'Subir ao mirante',description:'Torre panorâmica com escadas, plataformas e visão ampla do Campus.'})
]);

// Plataformas compartilhadas entre render e colisão do parkour 3D.
export const PARKOUR_PLATFORMS=Object.freeze([
  Object.freeze({id:'start',x:-16.65,z:13.40,w:1.55,d:1.00,h:.18,checkpoint:false}),
  Object.freeze({id:'p1',x:-16.35,z:15.50,w:.95,d:.95,h:.55,checkpoint:true}),
  Object.freeze({id:'p2',x:-15.15,z:14.28,w:.95,d:.95,h:.82,checkpoint:true}),
  Object.freeze({id:'p3',x:-13.95,z:15.68,w:.95,d:.95,h:1.05,checkpoint:true}),
  Object.freeze({id:'p4',x:-12.68,z:14.40,w:.95,d:.95,h:.72,checkpoint:true}),
  Object.freeze({id:'p5',x:-11.65,z:15.48,w:.95,d:.95,h:1.18,checkpoint:true})
]);

export const LITE_PARKOUR_CHECKPOINTS=Object.freeze(
  PARKOUR_PLATFORMS.filter(item=>item.checkpoint).map(item=>Object.freeze([item.x,item.z]))
);

export const PARKOUR_START=Object.freeze({x:PARKOUR_PLATFORMS[0].x,z:PARKOUR_PLATFORMS[0].z,y:PARKOUR_PLATFORMS[0].h});

const freezeNodes=nodes=>Object.freeze(nodes.map(([x,y,z])=>Object.freeze({x,y,z})));

export const CAMPUS_RIDES=Object.freeze({
  slide:Object.freeze({id:'slide',duration:5.2,camera:'wide',loop:false,nodes:freezeNodes([
    [13.85,.05,-15.65],[12.05,.45,-15.60],[12.25,.95,-15.52],[13.45,1.55,-15.42],[12.65,2.25,-15.32],[13.85,3.05,-15.22],
    [13.10,3.65,-15.10],[13.45,3.95,-14.98],[13.85,3.92,-14.82],[14.25,3.65,-14.62],[14.60,3.15,-14.42],
    [14.92,2.55,-14.26],[15.22,1.86,-14.14],[15.52,1.18,-14.06],[15.78,.62,-14.00],[16.02,.18,-13.98],[16.25,.05,-13.98]
  ])}),
  // Passeio panorâmico completo usa o mesmo corredor do monotrilho, mas percorre o circuito inteiro sem troca de estação.
  coaster:Object.freeze({id:'coaster',duration:22.5,camera:'campus',loop:false,railGauge:1.05,supportEvery:2,nodes:freezeNodes([
    [34,1.15,-6],[30,1.45,-7],[23,2.25,-12.5],[12,3.45,-11],[0,5.25,-25.5],[-12,4.2,-11],[-23,2.85,-12.5],[-30,1.65,-7],
    [-30,2.15,7],[-23,3.15,12.5],[-14,4.45,11.5],[0,6.25,15.5],[14,4.6,11.5],[23,3.1,12.5],[30,1.9,7],[34,1.15,-6]
  ])}),
  tower:Object.freeze({id:'tower',duration:10.8,camera:'campus',loop:false,nodes:freezeNodes([
    [-37.3,.05,6.6],[-36.9,.6,6.55],[-36.45,1.25,6.5],[-36.0,2.0,6.45],[-35.55,2.9,6.38],[-35.1,3.9,6.3],[-34.7,5.0,6.22],[-34.35,6.2,6.12],[-34.05,7.5,6.05],[-33.8,9.0,6],[-33.6,10.7,6],[-33.5,12.4,6],[-33.5,13.32,6]
  ])}),
  'tower-down':Object.freeze({id:'tower-down',duration:8.6,camera:'campus',loop:false,nodes:freezeNodes([
    [-33.5,13.32,6],[-33.5,12.4,6],[-33.6,10.7,6],[-33.8,9.0,6],[-34.05,7.5,6.05],[-34.35,6.2,6.12],[-34.7,5.0,6.22],[-35.1,3.9,6.3],[-35.55,2.9,6.38],[-36.0,2.0,6.45],[-36.45,1.25,6.5],[-36.9,.6,6.55],[-37.3,.05,6.6]
  ])}),
  playground:Object.freeze({id:'playground',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[-14,.05,-15],[-14,.35,-14.9],[-14,.05,-15]])}),
  pool:Object.freeze({id:'pool',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[14,.05,17.15],[14,.05,17.15]])})
});

export const CAMPUS_TRAIN_STATIONS=Object.freeze([
  Object.freeze({id:'central',name:'Praça Central',x:0,z:-8.5,accent:'#36d2ff'}),
  Object.freeze({id:'1ds',name:'1DS',x:-23,z:-12.5,accent:'#36d2ff'}),
  Object.freeze({id:'parkour',name:'Parkour',x:-14,z:11.5,accent:'#ff6b7a'}),
  Object.freeze({id:'3ds',name:'3DS',x:-23,z:12.5,accent:'#b58cff'}),
  Object.freeze({id:'pool',name:'Piscina',x:14,z:11.5,accent:'#43d9ff'}),
  Object.freeze({id:'sub',name:'SUB',x:23,z:12.5,accent:'#ffae63'}),
  Object.freeze({id:'vale',name:'Vale do Silício AGV',x:0,z:-25.5,accent:'#51e7a3'}),
  Object.freeze({id:'2ds',name:'2DS',x:23,z:-12.5,accent:'#51e7a3'})
]);

// Rota fechada do monotrilho: contorna o núcleo e desce ao terminal do Vale.
export const CAMPUS_TRAIN_ROUTE=Object.freeze([
  Object.freeze({x:0,z:-8.5}),Object.freeze({x:-12,z:-11}),Object.freeze({x:-23,z:-12.5}),Object.freeze({x:-30,z:-7}),
  Object.freeze({x:-30,z:7}),Object.freeze({x:-23,z:12.5}),Object.freeze({x:-14,z:11.5}),Object.freeze({x:0,z:15.5}),
  Object.freeze({x:14,z:11.5}),Object.freeze({x:23,z:12.5}),Object.freeze({x:30,z:7}),Object.freeze({x:30,z:-7}),
  Object.freeze({x:23,z:-12.5}),Object.freeze({x:12,z:-11}),Object.freeze({x:0,z:-25.5}),Object.freeze({x:0,z:-8.5})
]);

export const CAMPUS_BUILDING_ROOF_HEIGHT=11.0;
const generatedVertical=[];
for(const [key,layout] of Object.entries(CAMPUS_ZONE_LAYOUT)){
  const [x,,z]=layout.building,side=x<0?-1:1;
  generatedVertical.push(Object.freeze({id:`roof-${key}`,type:'roof',x,z,w:15.2,d:7.1,h:CAMPUS_BUILDING_ROOF_HEIGHT}));
  const steps=18,outerX=x+side*9.2,startZ=z-3.7;
  for(let i=0;i<steps;i++){
    const t=(i+1)/steps,h=CAMPUS_BUILDING_ROOF_HEIGHT*t,stepZ=startZ+t*7.4;
    generatedVertical.push(Object.freeze({id:`stairs-${key}-${i+1}`,type:'step',x:outerX-side*.55,z:stepZ,w:1.35,d:.44,h}));
  }
  generatedVertical.push(Object.freeze({id:`bridge-${key}`,type:'bridge',x:x+side*8.2,z:z+3.7,w:2.6,d:1.2,h:CAMPUS_BUILDING_ROOF_HEIGHT}));
}
// Rampa panorâmica movida para a borda nordeste, fora do fluxo principal.
for(let i=0;i<12;i++){
  const t=(i+1)/12;
  generatedVertical.push(Object.freeze({id:`ramp-${i+1}`,type:'ramp',x:40+t*7.2,z:30,w:.72,d:3.0,h:t*4.2}));
}
// Escorregador: os degraus visuais também são superfícies físicas caminháveis.
for(let i=0;i<8;i++)generatedVertical.push(Object.freeze({id:`slide-step-${i+1}`,type:'step',x:11.85+i*.28,z:-15.95,w:.95,d:.52,h:.40+i*.48}));
generatedVertical.push(Object.freeze({id:'slide-landing',type:'platform',x:13.05,z:-15.75,w:2.0,d:1.75,h:4.15}));
// Mirante: decks físicos mantêm o jogador no alto após a subida guiada.
for(const [id,h] of [['lower',4.91],['mid',9.11],['lookout',13.32]])generatedVertical.push(Object.freeze({id:`tower-deck-${id}`,type:'platform',x:-32.9,z:6,w:5.6,d:5.0,h}));
generatedVertical.push(...CAMPUS_PEDESTRIAN_SURFACES);
export const CAMPUS_VERTICAL_SURFACES=Object.freeze(generatedVertical);

export function campusSurfaceAt(x,z,padding=0){
  let best=null;
  for(const s of CAMPUS_VERTICAL_SURFACES){
    if(Math.abs(x-s.x)<=s.w/2+padding&&Math.abs(z-s.z)<=s.d/2+padding){if(!best||s.h>best.h)best=s;}
  }
  const park=parkourPlatformAt(x,z,padding);if(park&&(!best||park.h>best.h))best=park;return best;
}

export function parkourPlatformAt(x,z,padding=0){
  let best=null;
  for(const platform of PARKOUR_PLATFORMS){
    if(Math.abs(x-platform.x)<=platform.w/2+padding&&Math.abs(z-platform.z)<=platform.d/2+padding){if(!best||platform.h>best.h)best=platform;}
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

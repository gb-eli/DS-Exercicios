import { CAMPUS_ZONE_LAYOUT } from './campus-manifest.js?v=14.10.8.66';
import { CAMPUS_TOOL_EXPERIENCES } from './campus-destinations.js?v=14.10.8.92-f90-graphics';
import { CAMPUS_PEDESTRIAN_SURFACES } from './campus-city-network.js?v=14.10.8.66';

export const CAMPUS_EXPERIENCES=Object.freeze([
  ...CAMPUS_TOOL_EXPERIENCES,
  Object.freeze({id:'vale-portal',type:'vale-portal',name:'Portal Vale do Silício AGV',label:'VALE DO SILÍCIO AGV',subtitle:'27 EMPRESAS • 8 DISTRITOS',x:0,z:-29.5,radius:5.8,accent:'#51e7a3',interaction:'Viajar para o Vale',description:'Empresas e projetos criados pelos alunos. Entrada principal para a cidade tecnológica estudantil.'}),
  Object.freeze({id:'rural-portal',type:'rural-portal',name:'Estrada para o Mundo Rural AGV',label:'MUNDO RURAL AGV',subtitle:'FAZENDA • RIO • PONTE • ANIMAIS',x:0,z:34.5,radius:5.8,accent:'#8ddf7a',interaction:'Viajar para o Mundo Rural',description:'Portal rodoviário para o mapa rural carregado sob demanda.'}),
  Object.freeze({id:'military-portal',type:'military-portal',name:'Portal Base de Operações AGV',label:'BASE DE OPERAÇÕES AGV',subtitle:'LOGÍSTICA • ENGENHARIA • RESGATE',x:50,z:34.2,radius:5.2,accent:'#9bbd75',interaction:'Viajar para a Base de Operações',description:'Acesso ao mapa operacional carregado sob demanda, sem armamentos ou combate.'}),
  Object.freeze({id:'space-portal',type:'space-portal',name:'Centro Espacial AGV',label:'ESTAÇÃO ORBITAL AGV',subtitle:'LANÇAMENTO • TERRA • CIÊNCIA',x:-50,z:34.2,radius:5.2,accent:'#8fdcff',interaction:'Embarcar para a Estação Orbital',description:'Centro espacial no solo com transporte para a Estação Orbital AGV carregada sob demanda.'}),
  Object.freeze({id:'parque-portal',type:'parque-portal',name:'Portal Parque de Diversões AGV',label:'PARQUE DE DIVERSÕES AGV',subtitle:'COASTER • CORRIDA • PARKOUR • SLIDE',x:50,z:-34.2,radius:5.2,accent:'#ff7b35',interaction:'Viajar para o Parque',description:'Acesso ao Parque de Diversões AGV carregado sob demanda, com atrações, corrida e desafios recreativos.'}),
  Object.freeze({id:'campus-library-gateway',type:'module-gateway',name:'Biblioteca Central AGV',label:'BIBLIOTECA CENTRAL',subtitle:'LEITURA • ESTUDO • MÍDIA',x:-34,z:-6,radius:4.8,accent:'#7ddcff',targetWorldId:'campus-library',interaction:'Entrar na Biblioteca',description:'Gateway leve para o submapa modular da Biblioteca Central.'}),
  Object.freeze({id:'campus-labs-gateway',type:'module-gateway',name:'Distrito de Laboratórios AGV',label:'LABORATÓRIOS',subtitle:'SIMULAÇÃO • ROBÓTICA • MAKER',x:-44,z:-26,radius:4.8,accent:'#55d9ff',targetWorldId:'campus-labs',interaction:'Entrar nos Laboratórios',description:'Gateway leve para o distrito modular de laboratórios.'}),
  Object.freeze({id:'campus-neon-gateway',type:'module-gateway',name:'Parque Neon & Lazer AGV',label:'NEON & LAZER',subtitle:'PISCINA • PARKOUR • CONVIVÊNCIA',x:0,z:15,radius:5.2,accent:'#43d9ff',targetWorldId:'campus-neon',interaction:'Entrar no Parque Neon',description:'Gateway leve para as atrações de lazer carregadas sob demanda.'}),
  Object.freeze({id:'coaster',type:'coaster',name:'Estação Intermodal AGV',label:'ESTAÇÃO INTERMODAL',x:34,z:-6,radius:4.2,accent:'#b58cff',district:'Mobilidade Leste',interaction:'Escolher estação',description:'Ponto intermodal conectado ao monotrilho e aos principais destinos do Campus.'}),
  Object.freeze({id:'tower',type:'tower',name:'Mirante AGV',label:'MIRANTE AGV',x:-34,z:6,radius:4.2,accent:'#ffae63',district:'Tech Oeste',interaction:'Subir ao mirante',description:'Torre panorâmica com escadas, plataformas e visão ampla do Campus.'})
]);

// F89: parkour/piscina/playground/slide vivem exclusivamente no submapa campus-neon.
const freezeNodes=nodes=>Object.freeze(nodes.map(([x,y,z])=>Object.freeze({x,y,z})));

export const CAMPUS_RIDES=Object.freeze({
  tower:Object.freeze({id:'tower',duration:10.8,camera:'campus',loop:false,nodes:freezeNodes([
    [-37.3,.05,6.6],[-36.9,.6,6.55],[-36.45,1.25,6.5],[-36.0,2.0,6.45],[-35.55,2.9,6.38],[-35.1,3.9,6.3],[-34.7,5.0,6.22],[-34.35,6.2,6.12],[-34.05,7.5,6.05],[-33.8,9.0,6],[-33.6,10.7,6],[-33.5,12.4,6],[-33.5,13.32,6]
  ])}),
  'tower-down':Object.freeze({id:'tower-down',duration:8.6,camera:'campus',loop:false,nodes:freezeNodes([
    [-33.5,13.32,6],[-33.5,12.4,6],[-33.6,10.7,6],[-33.8,9.0,6],[-34.05,7.5,6.05],[-34.35,6.2,6.12],[-34.7,5.0,6.22],[-35.1,3.9,6.3],[-35.55,2.9,6.38],[-36.0,2.0,6.45],[-36.45,1.25,6.5],[-36.9,.6,6.55],[-37.3,.05,6.6]
  ])})
});

export const CAMPUS_TRAIN_STATIONS=Object.freeze([
  Object.freeze({id:'central',name:'Praça Central',x:0,z:-8.5,accent:'#36d2ff'}),
  Object.freeze({id:'1ds',name:'1DS',x:-23,z:-12.5,accent:'#36d2ff'}),
  Object.freeze({id:'3ds',name:'3DS',x:-23,z:12.5,accent:'#b58cff'}),
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
// F88: Escorregador e parkour foram extraídos para campus-neon; o hub não mantém suas superfícies físicas.
// Mirante: decks físicos mantêm o jogador no alto após a subida guiada.
for(const [id,h] of [['lower',4.91],['mid',9.11],['lookout',13.32]])generatedVertical.push(Object.freeze({id:`tower-deck-${id}`,type:'platform',x:-32.9,z:6,w:5.6,d:5.0,h}));
generatedVertical.push(...CAMPUS_PEDESTRIAN_SURFACES);
export const CAMPUS_VERTICAL_SURFACES=Object.freeze(generatedVertical);

export function campusSurfaceAt(x,z,padding=0){
  let best=null;
  for(const s of CAMPUS_VERTICAL_SURFACES){
    if(Math.abs(x-s.x)<=s.w/2+padding&&Math.abs(z-s.z)<=s.d/2+padding){if(!best||s.h>best.h)best=s;}
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

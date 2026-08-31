import { INTERPLANETARY_CONSOLE } from './solar-system.js?v=14.10.8.79-stage48-solar-system';
export const SPACE_BOUNDS=Object.freeze({minX:-150,maxX:150,minZ:-110,maxZ:110});
export const SPACE_SPAWN=Object.freeze({x:0,z:84});
export const SPACE_RETURN_PORTAL=Object.freeze({id:'space-return',type:'space-return-portal',name:'Transporte de Retorno ao Campus',x:0,z:99,radius:7,accent:'#8fdcff',description:'Módulo de transporte para retornar com segurança ao Centro Espacial AGV no Campus.'});
export const SPACE_MOON_PORTAL=Object.freeze({id:'space-moon-transfer',type:'moon-portal',name:'Transporte Lunar AGV',x:28,z:83,radius:7,accent:'#d7e4ef',description:'Módulo de transferência entre a Estação Orbital AGV e a superfície da Lua.'});
export const SPACE_MARS_PORTAL=Object.freeze({id:'space-mars-transfer',type:'mars-portal',name:'Transporte Marciano AGV',x:-28,z:83,radius:7,accent:'#ff9d63',description:'Módulo de transferência entre a Estação Orbital AGV e a superfície de Marte.'});

export const SPACE_FAST_TRAVEL=Object.freeze([
  Object.freeze({id:'arrival',name:'Doca de Chegada',x:0,z:84,kind:'dock'}),
  Object.freeze({id:'mission-control',name:'Controle de Missão Orbital',x:-38,z:42,kind:'operations'}),
  Object.freeze({id:'science-lab',name:'Laboratório de Ciências',x:38,z:35,kind:'science'}),
  Object.freeze({id:'habitat',name:'Módulo de Habitação',x:-38,z:-12,kind:'habitat'}),
  Object.freeze({id:'robotics',name:'Robótica e Satélites',x:38,z:-18,kind:'robotics'}),
  Object.freeze({id:'cupola',name:'Cúpula de Observação da Terra',x:0,z:-66,kind:'viewpoint'}),
  Object.freeze({id:'solar',name:'Painéis Solares',x:82,z:2,kind:'energy'}),
  Object.freeze({id:'interplanetary',name:'Central Interplanetária AGV',x:INTERPLANETARY_CONSOLE.x,z:INTERPLANETARY_CONSOLE.z,kind:'navigation'}),
  Object.freeze({id:'moon-transfer',name:'Transporte para a Lua',x:28,z:83,kind:'moon'}),
  Object.freeze({id:'mars-transfer',name:'Transporte para Marte',x:-28,z:83,kind:'mars'}),
  Object.freeze({id:'return',name:'Retorno ao Campus',x:0,z:99,kind:'portal'})
]);

export const SPACE_MODULES=Object.freeze([
  Object.freeze({id:'arrival-dock',type:'space-module',name:'Doca de Chegada',x:0,z:76,w:24,d:18,h:8,accent:'#8fdcff',description:'Recepção orbital, acoplagem e transição entre o transporte e a estação.'}),
  Object.freeze({id:'mission-control',type:'space-module',name:'Controle de Missão Orbital',x:-38,z:42,w:28,d:20,h:9,accent:'#80b7ff',description:'Telemetria, navegação orbital e coordenação da Estação AGV.'}),
  Object.freeze({id:'science-lab',type:'space-module',name:'Laboratório de Ciências',x:38,z:35,w:30,d:20,h:9,accent:'#9cf5d0',description:'Experimentos demonstrativos de astronomia, física e observação da Terra.'}),
  Object.freeze({id:'habitat',type:'space-module',name:'Módulo de Habitação',x:-38,z:-12,w:28,d:20,h:9,accent:'#ffd89a',description:'Área de convivência e simulação de permanência em ambiente orbital.'}),
  Object.freeze({id:'robotics',type:'space-module',name:'Robótica e Satélites',x:38,z:-18,w:30,d:20,h:9,accent:'#d8a8ff',description:'Braços robóticos, pequenos satélites e manutenção de sistemas.'}),
  Object.freeze({id:'cupola',type:'space-viewpoint',name:'Cúpula de Observação da Terra',x:0,z:-66,w:22,d:18,h:8,accent:'#67dfff',description:'Janela panorâmica voltada para a Terra, o Sol e o campo de estrelas.'})
]);

export const SPACE_CORRIDORS=Object.freeze([
  Object.freeze({id:'spine',width:9,nodes:Object.freeze([{x:0,z:92},{x:0,z:72},{x:0,z:48},{x:0,z:20},{x:0,z:-10},{x:0,z:-38},{x:0,z:-68}])}),
  Object.freeze({id:'north-branch',width:7,nodes:Object.freeze([{x:0,z:48},{x:-38,z:42}])}),
  Object.freeze({id:'science-branch',width:7,nodes:Object.freeze([{x:0,z:36},{x:38,z:35}])}),
  Object.freeze({id:'habitat-branch',width:7,nodes:Object.freeze([{x:0,z:-10},{x:-38,z:-12}])}),
  Object.freeze({id:'robotics-branch',width:7,nodes:Object.freeze([{x:0,z:-18},{x:38,z:-18}])})
]);

export const SPACE_SOLAR_ARRAYS=Object.freeze([
  Object.freeze({id:'solar-east',type:'space-solar-array',name:'Painéis Solares Leste',x:82,z:2,w:74,d:14,accent:'#5ea5ff',description:'Conjunto fotovoltaico demonstrativo que alimenta os sistemas da estação.'}),
  Object.freeze({id:'solar-west',type:'space-solar-array',name:'Painéis Solares Oeste',x:-82,z:2,w:74,d:14,accent:'#5ea5ff',description:'Conjunto fotovoltaico demonstrativo que alimenta os sistemas da estação.'})
]);

export const SPACE_OBJECTS=Object.freeze([
  SPACE_RETURN_PORTAL,SPACE_MOON_PORTAL,SPACE_MARS_PORTAL,INTERPLANETARY_CONSOLE,
  ...SPACE_MODULES.map(item=>Object.freeze({...item,radius:Math.max(item.w,item.d)*.58})),
  ...SPACE_SOLAR_ARRAYS.map(item=>Object.freeze({...item,radius:9})),
  Object.freeze({id:'earth-observation',type:'space-earth-view',name:'Terra',x:0,z:-82,radius:8,description:'Ponto de observação do planeta Terra a partir da Estação Orbital AGV.'}),
  Object.freeze({id:'orbital-map',type:'space-map',name:'Mapa Orbital AGV',x:0,z:10,radius:5,description:'Painel de orientação com os módulos e rotas da estação.'})
]);

export const clampSpace=(v,min,max)=>Math.max(min,Math.min(max,v));
export function spaceWorldToPresence(x,z){
  const px=((Number(x)||0)-SPACE_BOUNDS.minX)/(SPACE_BOUNDS.maxX-SPACE_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-SPACE_BOUNDS.minZ)/(SPACE_BOUNDS.maxZ-SPACE_BOUNDS.minZ)*1000;
  return{x:Math.round(clampSpace(px,0,1600)),y:Math.round(clampSpace(py,0,1000))};
}
export function spacePresenceToWorld(x,y){
  return{x:SPACE_BOUNDS.minX+(clampSpace(Number(x)||800,0,1600)/1600)*(SPACE_BOUNDS.maxX-SPACE_BOUNDS.minX),z:SPACE_BOUNDS.minZ+(clampSpace(Number(y)||500,0,1000)/1000)*(SPACE_BOUNDS.maxZ-SPACE_BOUNDS.minZ)};
}
export function nearestSpaceObject(x,z,maxDistance=10){
  let best=null,bestDistance=maxDistance;
  for(const object of SPACE_OBJECTS){const d=Math.hypot(x-object.x,z-object.z),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

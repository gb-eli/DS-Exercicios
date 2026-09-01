import { CAMPUS_DESTINATION_MAP } from './campus-destinations.js?v=14.10.8.92-f90-graphics';

const P=(x,z)=>Object.freeze({x,z});
const route=(id,name,accent,width,nodes,kind='walkway')=>Object.freeze({id,name,accent,width,kind,nodes:Object.freeze(nodes.map(([x,z])=>P(x,z)))});

// Etapa 12 — eixos pedonais simples e legíveis. As vias motorizadas ficam em campus-city-network.
export const CAMPUS_CONNECTIONS=Object.freeze([
  route('north-promenade','Promenade Acadêmica','#36d2ff',2.55,[[0,7],[0,12],[0,18],[0,24],[0,29]]),
  route('south-promenade','Eixo de Avaliação e Vale','#ffae63',2.55,[[0,-7],[0,-12],[0,-18],[0,-24],[0,-29]]),
  route('west-promenade','Boulevard Tech Oeste','#ff7fd5',2.35,[[-7,0],[-14,0],[-22,0],[-32,0],[-42,0],[-47,0]]),
  route('east-promenade','Boulevard Tech Leste','#61e7a6',2.35,[[7,0],[14,0],[22,0],[32,0],[42,0],[47,0]]),
  route('bank-link','Conexão Banco AGV','#61e7a6',1.9,[[0,24],[-7.5,26.3],[-11.5,28],[CAMPUS_DESTINATION_MAP.bank.entrance.x,CAMPUS_DESTINATION_MAP.bank.entrance.z]]),
  route('store-link','Conexão Loja AGV','#f4b8ff',1.9,[[0,24],[7.5,26.3],[11.5,28],[CAMPUS_DESTINATION_MAP.store.entrance.x,CAMPUS_DESTINATION_MAP.store.entrance.z]]),
  route('labs-gateway-link','Conexão Distrito de Laboratórios','#55d9ff',1.8,[[-14,-12],[-24,-17],[-34,-22],[-44,-26]]),
  route('cosmos-link','Conexão COSMOS','#8f8cff',1.8,[[14,-12],[24,-17],[34,-22],[CAMPUS_DESTINATION_MAP.cosmos.entrance.x,CAMPUS_DESTINATION_MAP.cosmos.entrance.z]]),
  route('ctf-link','Conexão CTF DS','#ff6b7a',1.8,[[-14,12],[-24,17],[-34,22],[CAMPUS_DESTINATION_MAP['ctf-ds'].entrance.x,CAMPUS_DESTINATION_MAP['ctf-ds'].entrance.z]]),
  route('desafio-link','Conexão Desafio DS','#ffd166',1.8,[[14,12],[24,17],[34,22],[CAMPUS_DESTINATION_MAP['desafio-ds'].entrance.x,CAMPUS_DESTINATION_MAP['desafio-ds'].entrance.z]]),
  route('neon-gateway-link','Acesso Parque Neon & Lazer','#43d9ff',1.75,[[0,7],[0,11],[0,15]]),
  route('mirante-link','Acesso ao Mirante','#ffae63',1.55,[[-20,0],[-27,3],[-34,6]]),
  route('intermodal-link','Acesso Intermodal','#b58cff',1.55,[[20,0],[27,-3],[34,-6]])
]);

export const CAMPUS_DISTRICT_GATES=Object.freeze([
  Object.freeze({id:'gate-north',name:'EIXO ACADÊMICO',x:0,z:17.0,rotation:0,accent:'#36d2ff'}),
  Object.freeze({id:'gate-south',name:'AVALIAÇÃO • VALE',x:0,z:-17.0,rotation:0,accent:'#ffae63'}),
  Object.freeze({id:'gate-west',name:'TECH OESTE',x:-20.5,z:0,rotation:Math.PI/2,accent:'#ff7fd5'}),
  Object.freeze({id:'gate-east',name:'INOVAÇÃO LESTE',x:20.5,z:0,rotation:Math.PI/2,accent:'#61e7a6'})
]);

export const CAMPUS_SKYBRIDGES=Object.freeze([
  Object.freeze({id:'sky-bank-core',from:'bank',to:'unified-platform',height:3.55,accent:'#72f5c0'}),
  Object.freeze({id:'sky-core-store',from:'unified-platform',to:'store',height:3.55,accent:'#e2b3ff'})
]);

export const CAMPUS_WAYFINDING=Object.freeze([
  Object.freeze({id:'sign-central-north',x:0,z:12.2,title:'EIXO ACADÊMICO',detail:'Plataforma • Banco • Loja',accent:'#36d2ff'}),
  Object.freeze({id:'sign-central-south',x:0,z:-12.2,title:'AVALIAÇÃO / VALE',detail:'Centro de Provas • Vale AGV',accent:'#ffae63'}),
  Object.freeze({id:'sign-central-west',x:-12.2,z:0,title:'TECH OESTE',detail:'Fliperama • CTF • Laboratórios',accent:'#ff7fd5'}),
  Object.freeze({id:'sign-central-east',x:12.2,z:0,title:'INOVAÇÃO LESTE',detail:'Desafio • COSMOS • Informática',accent:'#61e7a6'})
]);

export function destinationInteractionPoint(item){return item?.entrance||{x:Number(item?.x||0),z:Number(item?.z||0)};}

import { CAMPUS_DESTINATION_MAP } from './campus-destinations.js?v=14.10.8.65';

const P=(x,z)=>Object.freeze({x,z});
const route=(id,name,accent,width,nodes,kind='walkway')=>Object.freeze({id,name,accent,width,kind,nodes:Object.freeze(nodes.map(([x,z])=>P(x,z)))});

export const CAMPUS_CONNECTIONS=Object.freeze([
  route('north-promenade','Promenade Acadêmica','#36d2ff',2.35,[[0,6],[0,10],[0,15],[0,19.2],[0,23.1]]),
  route('south-promenade','Eixo de Provas e Vale','#ffae63',2.35,[[0,-6],[0,-10],[0,-15.4],[0,-19.2],[0,-23.1]]),
  route('west-promenade','Boulevard Tech Oeste','#ff7fd5',2.15,[[-6,0],[-12,0],[-18,0],[-25,0],[-31,0],[-36.0,0]]),
  route('east-promenade','Boulevard Tech Leste','#61e7a6',2.15,[[6,0],[12,0],[18,0],[25,0],[31,0],[36.0,0]]),
  route('bank-link','Conexão Banco AGV','#61e7a6',1.8,[[0,19.2],[-6,20.8],[-10.5,22.2],[CAMPUS_DESTINATION_MAP.bank.entrance.x,CAMPUS_DESTINATION_MAP.bank.entrance.z]]),
  route('store-link','Conexão Loja AGV','#f4b8ff',1.8,[[0,19.2],[6,20.8],[10.5,22.2],[CAMPUS_DESTINATION_MAP.store.entrance.x,CAMPUS_DESTINATION_MAP.store.entrance.z]]),
  route('lab-link','Conexão Laboratório Virtual','#55d9ff',1.7,[[-12,-12],[-20,-15],[-28,-18.4],[CAMPUS_DESTINATION_MAP['lab-virtual'].entrance.x,CAMPUS_DESTINATION_MAP['lab-virtual'].entrance.z]]),
  route('cosmos-link','Conexão COSMOS','#8f8cff',1.7,[[12,-12],[20,-15],[28,-18.4],[CAMPUS_DESTINATION_MAP.cosmos.entrance.x,CAMPUS_DESTINATION_MAP.cosmos.entrance.z]]),
  route('ctf-link','Conexão CTF DS','#ff6b7a',1.7,[[-12,12],[-20,15],[-28,18.4],[CAMPUS_DESTINATION_MAP['ctf-ds'].entrance.x,CAMPUS_DESTINATION_MAP['ctf-ds'].entrance.z]]),
  route('desafio-link','Conexão Desafio DS','#ffd166',1.7,[[12,12],[20,15],[28,18.4],[CAMPUS_DESTINATION_MAP['desafio-ds'].entrance.x,CAMPUS_DESTINATION_MAP['desafio-ds'].entrance.z]])
]);

export const CAMPUS_DISTRICT_GATES=Object.freeze([
  Object.freeze({id:'gate-north',name:'EIXO ACADÊMICO',x:0,z:16.8,rotation:0,accent:'#36d2ff'}),
  Object.freeze({id:'gate-south',name:'PROVAS • VALE',x:0,z:-16.9,rotation:0,accent:'#ffae63'}),
  Object.freeze({id:'gate-west',name:'TECH OESTE',x:-17.2,z:0,rotation:Math.PI/2,accent:'#ff7fd5'}),
  Object.freeze({id:'gate-east',name:'INOVAÇÃO LESTE',x:17.2,z:0,rotation:Math.PI/2,accent:'#61e7a6'})
]);

export const CAMPUS_SKYBRIDGES=Object.freeze([
  Object.freeze({id:'sky-bank-core',from:'bank',to:'unified-platform',height:3.55,accent:'#72f5c0'}),
  Object.freeze({id:'sky-core-store',from:'unified-platform',to:'store',height:3.55,accent:'#e2b3ff'})
]);

export const CAMPUS_WAYFINDING=Object.freeze([
  Object.freeze({id:'sign-central-north',x:0,z:8.2,title:'EIXO ACADÊMICO',detail:'Plataforma • Banco • Loja',accent:'#36d2ff'}),
  Object.freeze({id:'sign-central-south',x:0,z:-8.2,title:'PROVAS / VALE',detail:'Centro de Provas • Vale AGV',accent:'#ffae63'}),
  Object.freeze({id:'sign-central-west',x:-8.3,z:0,title:'TECH OESTE',detail:'Fliperama • CTF • Lab Virtual',accent:'#ff7fd5'}),
  Object.freeze({id:'sign-central-east',x:8.3,z:0,title:'INOVAÇÃO LESTE',detail:'Desafio • COSMOS • Informática',accent:'#61e7a6'})
]);

export function destinationInteractionPoint(item){return item?.entrance||{x:Number(item?.x||0),z:Number(item?.z||0)};}

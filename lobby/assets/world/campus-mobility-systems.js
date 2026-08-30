// v14.10.8.65 — Cidade Viva Avançada
// Mobilidade local, tráfego, NPCs, sinalização e eventos urbanos.
// Não altera estado acadêmico, econômico ou schema Supabase.

const freezePoint=([x,z])=>Object.freeze({x:Number(x),z:Number(z)});
const freezeRoute=route=>Object.freeze({...route,nodes:Object.freeze(route.nodes.map(freezePoint))});
const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));

export const CAMPUS_TRAFFIC_ROUTES=Object.freeze([
  freezeRoute({id:'central-loop',name:'Circuito Central',loop:true,accent:'#36d2ff',nodes:[[-18,-8],[-10,-18],[0,-22],[10,-18],[18,-8],[18,8],[10,18],[0,22],[-10,18],[-18,8],[-18,-8]]}),
  freezeRoute({id:'west-loop',name:'Circuito Tech Oeste',loop:true,accent:'#ff7fd5',nodes:[[-12,-2],[-22,-2],[-34,-2],[-37,-10],[-37,10],[-34,2],[-22,2],[-12,2],[-12,-2]]}),
  freezeRoute({id:'east-loop',name:'Circuito Inovação',loop:true,accent:'#61e7a6',nodes:[[12,-2],[22,-2],[34,-2],[37,-10],[37,10],[34,2],[22,2],[12,2],[12,-2]]}),
  freezeRoute({id:'mobility-south',name:'Linha Mobilidade',loop:true,accent:'#ffae63',nodes:[[-29,-22],[-14,-22],[0,-22],[14,-22],[29,-22],[20,-16],[0,-15],[-20,-16],[-29,-22]]}),
  freezeRoute({id:'vale-corridor',name:'Corredor Campus Vale',loop:true,accent:'#51e7a3',nodes:[[0,-10],[0,-14],[0,-18],[0,-23.5],[3,-23.5],[3,-18],[3,-14],[3,-10],[0,-10]]})
]);

export const CAMPUS_TRAFFIC_FLEET=Object.freeze([
  Object.freeze({id:'traffic-01',routeId:'central-loop',kind:'car',label:'E-Car Campus',accent:'#55d9ff',speed:.026,offset:.02}),
  Object.freeze({id:'traffic-02',routeId:'central-loop',kind:'van',label:'Van Acadêmica',accent:'#8f8cff',speed:.021,offset:.42}),
  Object.freeze({id:'traffic-03',routeId:'west-loop',kind:'bike',label:'E-Bike Oeste',accent:'#ff7fd5',speed:.035,offset:.15}),
  Object.freeze({id:'traffic-04',routeId:'east-loop',kind:'car',label:'E-Car Inovação',accent:'#61e7a6',speed:.028,offset:.58}),
  Object.freeze({id:'traffic-05',routeId:'mobility-south',kind:'bus',label:'Shuttle Acadêmico',accent:'#ffae63',speed:.017,offset:.08}),
  Object.freeze({id:'traffic-06',routeId:'vale-corridor',kind:'car',label:'Vale Link',accent:'#51e7a3',speed:.024,offset:.35})
]);

export const CAMPUS_DRIVABLE_VEHICLES=Object.freeze([
  Object.freeze({id:'drive-west-car',name:'AGV E-Car',garageId:'garage-west',x:-34.6,z:-8.0,kind:'car',accent:'#55d9ff',routeId:'west-loop',startT:.38,durationMs:18000}),
  Object.freeze({id:'drive-west-bike',name:'AGV E-Bike',garageId:'garage-west',x:-30.6,z:-8.0,kind:'bike',accent:'#ff7fd5',routeId:'west-loop',startT:.38,durationMs:14000}),
  Object.freeze({id:'drive-east-van',name:'Maker Van',garageId:'garage-east',x:30.4,z:8.0,kind:'van',accent:'#61e7a6',routeId:'east-loop',startT:.38,durationMs:19000}),
  Object.freeze({id:'drive-south-shuttle',name:'Shuttle Acadêmico',garageId:'garage-south',x:26.3,z:-23.2,kind:'bus',accent:'#ffae63',routeId:'mobility-south',startT:.47,durationMs:21000})
]);

export const CAMPUS_NPC_PATROLS=Object.freeze([
  Object.freeze({id:'npc-guide-central',name:'Guia do Campus',role:'Orientação urbana',accent:'#36d2ff',speed:.018,routeId:'central-loop',offset:.08,message:'Posso indicar prédios, estações e serviços do Campus.'}),
  Object.freeze({id:'npc-monitor-west',name:'Monitor Tech Oeste',role:'Apoio de laboratório',accent:'#ff7fd5',speed:.024,routeId:'west-loop',offset:.36,message:'O distrito oeste conecta laboratório, CTF e Fliperama.'}),
  Object.freeze({id:'npc-monitor-east',name:'Monitor Inovação',role:'Apoio maker',accent:'#61e7a6',speed:.022,routeId:'east-loop',offset:.62,message:'O distrito leste conecta COSMOS, desafios e projetos.'}),
  Object.freeze({id:'npc-mobility',name:'Agente de Mobilidade',role:'Estações e garagens',accent:'#ffae63',speed:.016,routeId:'mobility-south',offset:.2,message:'Use estações, passarelas e garagens para circular pelo Campus.'}),
  Object.freeze({id:'npc-vale-link',name:'Embaixador do Vale',role:'Conexão Campus ↔ Vale',accent:'#51e7a3',speed:.018,routeId:'vale-corridor',offset:.72,message:'O eixo monumental leva ao Vale do Silício AGV.'})
]);

export const CAMPUS_DYNAMIC_SIGNS=Object.freeze([
  Object.freeze({id:'sign-central',x:0,z:-7.7,accent:'#36d2ff',messages:Object.freeze(['PRAÇA CENTRAL','ATIVIDADES • CAMPUS','ESTAÇÕES • DISTRITOS'])}),
  Object.freeze({id:'sign-west',x:-20,z:-4.5,accent:'#ff7fd5',messages:Object.freeze(['TECH OESTE','CTF • FLIPERAMA','LAB VIRTUAL'])}),
  Object.freeze({id:'sign-east',x:20,z:4.5,accent:'#61e7a6',messages:Object.freeze(['INOVAÇÃO LESTE','COSMOS • DESAFIOS','PROJETOS MAKER'])}),
  Object.freeze({id:'sign-south',x:0,z:-17.2,accent:'#ffae63',messages:Object.freeze(['MOBILIDADE','PROVAS • ESTAÇÕES','VALE DO SILÍCIO ↓'])}),
  Object.freeze({id:'sign-vale',x:0,z:-23.0,accent:'#51e7a3',messages:Object.freeze(['PORTAL METROPOLITANO','CAMPUS ↔ VALE','CORREDOR TECNOLÓGICO'])})
]);

export const CAMPUS_CITY_EVENTS=Object.freeze([
  Object.freeze({id:'event-innovation',name:'Mostra de Inovação',plazaId:'plaza-innovation',icon:'⬡',accent:'#61e7a6',detail:'Projetos, protótipos e demonstrações no distrito leste.'}),
  Object.freeze({id:'event-gamer',name:'Encontro Gamer',plazaId:'plaza-gamer',icon:'✦',accent:'#ff7fd5',detail:'Circuito recreativo próximo ao Fliperama e à Arena.'}),
  Object.freeze({id:'event-academic',name:'Conexão Acadêmica',plazaId:'plaza-academic',icon:'⌘',accent:'#36d2ff',detail:'Orientação de atividades, projetos e serviços acadêmicos.'}),
  Object.freeze({id:'event-mobility',name:'Circuito de Mobilidade',plazaId:'plaza-mobility',icon:'⇄',accent:'#ffae63',detail:'Demonstração das estações, passarelas e veículos do Campus.'}),
  Object.freeze({id:'event-civic',name:'Serviços do Campus',plazaId:'plaza-civic',icon:'◇',accent:'#8ff2bd',detail:'Banco, loja e serviços integrados no núcleo cívico.'})
]);


export const CAMPUS_INTERIOR_SIGNATURES=Object.freeze({
  'unified-platform':Object.freeze({kind:'forum',icon:'◎',label:'Fórum Central'}),
  bank:Object.freeze({kind:'vault',icon:'◈',label:'Cofre Digital'}),
  store:Object.freeze({kind:'showcase',icon:'◇',label:'Showroom'}),
  'lab-virtual':Object.freeze({kind:'lab',icon:'⚙',label:'Bancada Técnica'}),
  'ctf-ds':Object.freeze({kind:'servers',icon:'▦',label:'SOC / Servidores'}),
  cosmos:Object.freeze({kind:'orrery',icon:'◉',label:'Modelo Orbital'}),
  'desafio-ds':Object.freeze({kind:'briefing',icon:'⌁',label:'Mesa de Briefing'}),
  fliperama:Object.freeze({kind:'arcade',icon:'✦',label:'Ilha Arcade'}),
  'game-info':Object.freeze({kind:'maker',icon:'⬡',label:'Bancada Maker'}),
  'practical-exam':Object.freeze({kind:'exam',icon:'▤',label:'Triagem de Provas'})
});

export const CAMPUS_ELEVATOR_SYSTEM=Object.freeze({
  doorOpenMs:650,
  travelMs:900,
  settleMs:300,
  floorHeight:3.9,
  cabin:Object.freeze({width:1.72,depth:1.38,height:2.55})
});

const routeMap=new Map(CAMPUS_TRAFFIC_ROUTES.map(route=>[route.id,route]));

export function sampleCampusRoute(routeOrId,t=0){
  const route=typeof routeOrId==='string'?routeMap.get(routeOrId):routeOrId;
  if(!route||route.nodes.length<2)return{x:0,y:0,z:0,heading:0};
  const nodes=route.nodes,segments=[];let total=0;
  for(let i=0;i<nodes.length-1;i++){const a=nodes[i],b=nodes[i+1],len=Math.hypot(b.x-a.x,b.z-a.z);segments.push({a,b,len});total+=len;}
  if(total<=0)return{x:nodes[0].x,y:0,z:nodes[0].z,heading:0};
  let d=((Number(t)||0)%1+1)%1*total;
  for(const seg of segments){if(d<=seg.len||seg===segments[segments.length-1]){const k=seg.len?clamp01(d/seg.len):0;return{x:seg.a.x+(seg.b.x-seg.a.x)*k,y:0,z:seg.a.z+(seg.b.z-seg.a.z)*k,heading:Math.atan2(seg.b.x-seg.a.x,seg.b.z-seg.a.z)};}d-=seg.len;}
  return{x:nodes[0].x,y:0,z:nodes[0].z,heading:0};
}

export function resolveCampusCityEvent(date=new Date()){
  const slot=Math.floor((date.getHours()*60+date.getMinutes())/15);
  const day=date.getFullYear()*372+(date.getMonth()+1)*31+date.getDate();
  return CAMPUS_CITY_EVENTS[(day+slot)%CAMPUS_CITY_EVENTS.length];
}

export function resolveDynamicSign(sign,date=new Date(),event=resolveCampusCityEvent(date)){
  const minute=date.getMinutes();
  if(sign.id==='sign-central'&&event)return`${event.icon} ${event.name.toUpperCase()}`;
  const messages=sign.messages||[];
  return messages.length?messages[Math.floor(minute/5)%messages.length]:sign.id;
}

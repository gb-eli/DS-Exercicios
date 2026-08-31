// v14.10.8.70 — Cidade Viva + Trânsito Inteligente
// Mobilidade local, tráfego, NPCs, sinalização e eventos urbanos.
// Não altera estado acadêmico, econômico ou schema Supabase.

const freezePoint=([x,z])=>Object.freeze({x:Number(x),z:Number(z)});
const freezeRoute=route=>Object.freeze({...route,nodes:Object.freeze(route.nodes.map(freezePoint))});
const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));

export const CAMPUS_TRAFFIC_ROUTES=Object.freeze([
  freezeRoute({id:'central-loop',name:'Circuito Central',loop:true,accent:'#36d2ff',nodes:[[-22,-10],[-12,-20],[0,-24],[12,-20],[22,-10],[22,10],[12,20],[0,24],[-12,20],[-22,10],[-22,-10]]}),
  freezeRoute({id:'west-loop',name:'Circuito Tech Oeste',loop:true,accent:'#ff7fd5',nodes:[[-16,-3],[-30,-3],[-43,-3],[-44,-16],[-44,16],[-43,3],[-30,3],[-16,3],[-16,-3]]}),
  freezeRoute({id:'east-loop',name:'Circuito Inovação',loop:true,accent:'#61e7a6',nodes:[[16,-3],[30,-3],[43,-3],[44,-16],[44,16],[43,3],[30,3],[16,3],[16,-3]]}),
  freezeRoute({id:'mobility-south',name:'Linha Mobilidade',loop:true,accent:'#ffae63',nodes:[[-38,-24],[-20,-24],[0,-24],[20,-24],[38,-24],[31,-30],[10,-30],[-15.5,-30],[-30,-27],[-38,-24]]}),
  freezeRoute({id:'vale-corridor',name:'Corredor Campus Vale',loop:true,accent:'#51e7a3',nodes:[[0,-11],[0,-17],[0,-23],[0,-30],[3.4,-30],[3.4,-23],[3.4,-17],[3.4,-11],[0,-11]]})
]);


// Fase 2.2 — corredores de pista reutilizam a malha viária existente; não criam uma segunda rua sobre o Campus.
export const CAMPUS_MOBILITY_TRACKS=Object.freeze([
  Object.freeze({
    id:'track-mobility-south',name:'Pista Técnica AGV',routeId:'mobility-south',kind:'mixed',
    accent:'#ffae63',edgeAccent:'#ffe2b8',width:4.6,curbWidth:.18,startT:.48,
    description:'Corredor de testes para carro e moto, compartilhando a Via de Avaliação e o Anel Sul.'
  })
]);

export const CAMPUS_TRAFFIC_FLEET=Object.freeze([
  Object.freeze({id:'traffic-01',routeId:'central-loop',kind:'car',label:'E-Car Campus',accent:'#55d9ff',speed:.022,offset:.02}),
  Object.freeze({id:'traffic-02',routeId:'central-loop',kind:'van',label:'Van Acadêmica',accent:'#8f8cff',speed:.018,offset:.42}),
  Object.freeze({id:'traffic-03',routeId:'west-loop',kind:'bike',label:'E-Bike Oeste',accent:'#ff7fd5',speed:.03,offset:.15}),
  Object.freeze({id:'traffic-04',routeId:'east-loop',kind:'car',label:'E-Car Inovação',accent:'#61e7a6',speed:.024,offset:.58}),
  Object.freeze({id:'traffic-05',routeId:'mobility-south',kind:'bus',label:'Shuttle Acadêmico',accent:'#ffae63',speed:.015,offset:.08}),
  Object.freeze({id:'traffic-06',routeId:'vale-corridor',kind:'car',label:'Vale Link',accent:'#51e7a3',speed:.021,offset:.35})
]);

export const CAMPUS_TRAFFIC_SIGNALS=Object.freeze([
  Object.freeze({id:'signal-central-north',name:'Semáforo Central Norte',x:0,z:11.5,axis:'z',phaseGroup:'ns',stopRadius:4.4}),
  Object.freeze({id:'signal-central-south',name:'Semáforo Central Sul',x:0,z:-11.5,axis:'z',phaseGroup:'ns',stopRadius:4.4}),
  Object.freeze({id:'signal-central-west',name:'Semáforo Central Oeste',x:-11.5,z:0,axis:'x',phaseGroup:'ew',stopRadius:4.4}),
  Object.freeze({id:'signal-central-east',name:'Semáforo Central Leste',x:11.5,z:0,axis:'x',phaseGroup:'ew',stopRadius:4.4}),
  Object.freeze({id:'signal-ring-north',name:'Semáforo Anel Norte',x:0,z:24,axis:'z',phaseGroup:'ns',stopRadius:4.8}),
  Object.freeze({id:'signal-ring-south',name:'Semáforo Anel Sul',x:0,z:-24,axis:'z',phaseGroup:'ns',stopRadius:4.8}),
  Object.freeze({id:'signal-ring-west',name:'Semáforo Anel Oeste',x:-44,z:0,axis:'x',phaseGroup:'ew',stopRadius:4.8}),
  Object.freeze({id:'signal-ring-east',name:'Semáforo Anel Leste',x:44,z:0,axis:'x',phaseGroup:'ew',stopRadius:4.8})
]);

export const CAMPUS_SPEED_ZONES=Object.freeze([
  Object.freeze({id:'speed-central',name:'Núcleo Central',x:0,z:0,radius:14,limitKmh:20}),
  Object.freeze({id:'speed-academic',name:'Praça Acadêmica',x:0,z:19.5,radius:8.5,limitKmh:25}),
  Object.freeze({id:'speed-mobility',name:'Praça da Mobilidade',x:0,z:-19.5,radius:9.0,limitKmh:25}),
  Object.freeze({id:'speed-gamer',name:'Praça Gamer',x:-18,z:0,radius:8.2,limitKmh:25}),
  Object.freeze({id:'speed-innovation',name:'Praça da Inovação',x:18,z:0,radius:8.2,limitKmh:25}),
  Object.freeze({id:'speed-service-south',name:'Via de Avaliação',x:0,z:-30,radius:23,limitKmh:30})
]);

export function resolveCampusSpeedLimit(x=0,z=0){
  let limit=40,zone=null;
  for(const item of CAMPUS_SPEED_ZONES){if(Math.hypot(Number(x)-item.x,Number(z)-item.z)<=item.radius&&item.limitKmh<limit){limit=item.limitKmh;zone=item;}}
  return{limitKmh:limit,zone};
}

export function resolveTrafficSignalState(signal,nowMs=Date.now()){
  const cycle=((Number(nowMs)||0)%20000+20000)%20000;
  const ns=cycle<8000?'green':cycle<10000?'amber':'red';
  const ew=cycle>=10000&&cycle<18000?'green':cycle>=18000?'amber':'red';
  const state=signal?.phaseGroup==='ew'?ew:ns;
  return{state,label:state==='green'?'Livre':state==='amber'?'Atenção':'Pare',cycleMs:cycle};
}

export const CAMPUS_DRIVABLE_VEHICLES=Object.freeze([
  Object.freeze({id:'drive-west-car',name:'AGV E-Car',garageId:'garage-west',x:-41.2,z:-9.5,kind:'car',accent:'#55d9ff',routeId:'west-loop',startT:.38,durationMs:20000,seatCapacity:2,description:'Carro leve para passeio guiado pelo distrito Tech Oeste.'}),
  Object.freeze({id:'drive-west-bike',name:'AGV E-Bike',garageId:'garage-west',x:-37.0,z:-9.5,kind:'bike',accent:'#ff7fd5',routeId:'west-loop',startT:.38,durationMs:15500,seatCapacity:1,description:'Bike elétrica compacta para um trajeto mais ágil pelo circuito oeste.'}),
  Object.freeze({id:'drive-east-van',name:'Maker Van',garageId:'garage-east',x:37.0,z:9.5,kind:'van',accent:'#61e7a6',routeId:'east-loop',startT:.38,durationMs:21000,seatCapacity:4,description:'Van de apoio para visitar o distrito de inovação e projetos maker.'}),
  Object.freeze({id:'drive-south-shuttle',name:'Shuttle Acadêmico',garageId:'garage-south',x:28.7,z:-30,kind:'bus',accent:'#ffae63',routeId:'mobility-south',startT:.47,durationMs:23000,seatCapacity:8,description:'Ônibus interno para circular pelo eixo de mobilidade, provas e estações.'})
]);

export const CAMPUS_NPC_PATROLS=Object.freeze([
  Object.freeze({id:'npc-guide-central',name:'Guia do Campus',role:'Orientação urbana',accent:'#36d2ff',speed:.016,routeId:'central-loop',offset:.08,message:'Posso indicar prédios, estações e serviços do Campus.'}),
  Object.freeze({id:'npc-monitor-west',name:'Monitor Tech Oeste',role:'Apoio de laboratório',accent:'#ff7fd5',speed:.021,routeId:'west-loop',offset:.36,message:'O distrito oeste conecta laboratório, CTF e Fliperama.'}),
  Object.freeze({id:'npc-monitor-east',name:'Monitor Inovação',role:'Apoio maker',accent:'#61e7a6',speed:.02,routeId:'east-loop',offset:.62,message:'O distrito leste conecta COSMOS, desafios e projetos.'}),
  Object.freeze({id:'npc-mobility',name:'Agente de Mobilidade',role:'Estações e garagens',accent:'#ffae63',speed:.014,routeId:'mobility-south',offset:.2,message:'Use estações, passarelas e garagens para circular pelo Campus.'}),
  Object.freeze({id:'npc-vale-link',name:'Embaixador do Vale',role:'Conexão Campus ↔ Vale',accent:'#51e7a3',speed:.016,routeId:'vale-corridor',offset:.72,message:'O eixo monumental leva ao Vale do Silício AGV.'})
]);

export const CAMPUS_DYNAMIC_SIGNS=Object.freeze([
  Object.freeze({id:'sign-central',x:0,z:-8.8,accent:'#36d2ff',messages:Object.freeze(['PRAÇA CENTRAL','ATIVIDADES • CAMPUS','ESTAÇÕES • DISTRITOS'])}),
  Object.freeze({id:'sign-west',x:-24,z:-5.5,accent:'#ff7fd5',messages:Object.freeze(['TECH OESTE','CTF • FLIPERAMA','LAB VIRTUAL'])}),
  Object.freeze({id:'sign-east',x:24,z:5.5,accent:'#61e7a6',messages:Object.freeze(['INOVAÇÃO LESTE','COSMOS • DESAFIOS','PROJETOS MAKER'])}),
  Object.freeze({id:'sign-south',x:0,z:-20.5,accent:'#ffae63',messages:Object.freeze(['MOBILIDADE','PROVAS • ESTAÇÕES','VALE DO SILÍCIO ↓'])}),
  Object.freeze({id:'sign-vale',x:0,z:-29.0,accent:'#51e7a3',messages:Object.freeze(['PORTAL METROPOLITANO','CAMPUS ↔ VALE','CORREDOR TECNOLÓGICO'])})
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
  'practical-exam':Object.freeze({kind:'exam',icon:'▤',label:'Triagem de Provas'}),
  cinema:Object.freeze({kind:'cinema',icon:'▶',label:'Sala de Exibição'})
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

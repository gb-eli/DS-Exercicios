export const MILITARY_BOUNDS=Object.freeze({minX:-210,maxX:210,minZ:-175,maxZ:175});
export const MILITARY_SPAWN=Object.freeze({x:0,z:-148});
export const MILITARY_RETURN_PORTAL=Object.freeze({id:'military-return',type:'military-return-portal',name:'Portal de Retorno ao Campus',x:0,z:-162,radius:7,accent:'#9bbd75',description:'Corredor seguro de retorno ao Campus DS.'});

export const MILITARY_FAST_TRAVEL=Object.freeze([
  Object.freeze({id:'entrada',name:'Portaria da Base',x:0,z:-145,kind:'checkpoint'}),
  Object.freeze({id:'comando',name:'Centro de Operações',x:-42,z:-58,kind:'operations'}),
  Object.freeze({id:'hangar-logistica',name:'Hangar de Logística',x:58,z:-52,kind:'hangar'}),
  Object.freeze({id:'hangar-engenharia',name:'Hangar de Engenharia',x:96,z:18,kind:'hangar'}),
  Object.freeze({id:'pista',name:'Pista de Aviação',x:10,z:62,kind:'runway'}),
  Object.freeze({id:'resgate',name:'Centro de Resgate',x:-82,z:28,kind:'rescue'}),
  Object.freeze({id:'treinamento',name:'Circuito de Treinamento',x:-94,z:92,kind:'training'}),
  Object.freeze({id:'torre',name:'Torre de Observação',x:138,z:104,kind:'viewpoint'}),
  Object.freeze({id:'retorno',name:'Retorno ao Campus',x:0,z:-162,kind:'portal'})
]);

export const MILITARY_ROADS=Object.freeze([
  Object.freeze({id:'main',width:9,nodes:Object.freeze([{x:0,z:-166},{x:0,z:-122},{x:-12,z:-90},{x:-42,z:-58},{x:-8,z:-18},{x:10,z:22},{x:10,z:62},{x:42,z:84},{x:96,z:92},{x:138,z:104}])}),
  Object.freeze({id:'east-logistics',width:7,nodes:Object.freeze([{x:-8,z:-18},{x:30,z:-34},{x:58,z:-52},{x:82,z:-24},{x:96,z:18}])}),
  Object.freeze({id:'west-rescue',width:7,nodes:Object.freeze([{x:-42,z:-58},{x:-66,z:-18},{x:-82,z:28},{x:-94,z:92}])})
]);

export const MILITARY_BUILDINGS=Object.freeze([
  Object.freeze({id:'operations',type:'military-building',name:'Centro de Operações AGV',x:-42,z:-58,w:30,d:20,h:10,accent:'#7f9468',description:'Coordenação de logística, segurança operacional e planejamento de rotas.'}),
  Object.freeze({id:'logistics-hangar',type:'military-building',name:'Hangar de Logística',x:58,z:-52,w:38,d:26,h:14,accent:'#6f7f70',interiorId:'logistics',description:'Manutenção de veículos de apoio, carga, despacho e suprimentos.'}),
  Object.freeze({id:'engineering-hangar',type:'military-building',name:'Hangar de Engenharia',x:96,z:18,w:36,d:26,h:14,accent:'#727f86',interiorId:'engineering',description:'Oficina de engenharia, drones de inspeção e equipamentos de infraestrutura.'}),
  Object.freeze({id:'rescue-center',type:'military-building',name:'Centro de Resgate e Primeiros Socorros',x:-82,z:28,w:26,d:18,h:9,accent:'#7e9b84',description:'Treinamento de resposta a emergências e apoio humanitário.'}),
  Object.freeze({id:'barracks',type:'military-building',name:'Alojamento de Treinamento',x:-18,z:18,w:26,d:18,h:8,accent:'#8c896f',description:'Área de apoio e descanso para atividades de simulação logística.'})
]);

export const MILITARY_INTERIORS=Object.freeze({
  logistics:Object.freeze({id:'logistics',name:'Hangar de Logística',accent:'#9bbd75',spawn:Object.freeze({x:0,z:10}),zones:Object.freeze([
    Object.freeze({id:'dispatch',name:'Despacho',x:-8,z:4,w:8,d:6,description:'Painel de rotas, checklist e distribuição de cargas.'}),
    Object.freeze({id:'maintenance',name:'Baia de Manutenção',x:3,z:0,w:12,d:9,description:'Elevador, ferramentas e inspeção preventiva de veículos de apoio.'}),
    Object.freeze({id:'supply',name:'Suprimentos',x:10,z:-6,w:8,d:6,description:'Estoque demonstrativo de materiais e logística.'})
  ])}),
  engineering:Object.freeze({id:'engineering',name:'Hangar de Engenharia',accent:'#80d4e8',spawn:Object.freeze({x:0,z:10}),zones:Object.freeze([
    Object.freeze({id:'prototype',name:'Bancada de Protótipos',x:-8,z:1,w:9,d:7,description:'Protótipos de mobilidade, sensores e inspeção.'}),
    Object.freeze({id:'drone',name:'Baia de Drones',x:5,z:-1,w:10,d:8,description:'Drones não bélicos para mapeamento, busca e vistoria.'}),
    Object.freeze({id:'infrastructure',name:'Engenharia de Campo',x:8,z:-8,w:10,d:5,description:'Pontes modulares, energia e infraestrutura temporária.'})
  ])})
});

export const MILITARY_RUNWAY=Object.freeze({id:'runway',type:'military-runway',name:'Pista de Aviação AGV',x:12,z:78,w:118,d:22,radius:14,description:'Pista de treinamento para aeronaves de observação, transporte e resgate.'});

export const MILITARY_TRAINING=Object.freeze([
  Object.freeze({id:'training-start',type:'military-training',name:'Início do Circuito',x:-100,z:70,radius:5,description:'Circuito recreativo de condicionamento, coordenação e mobilidade.'}),
  Object.freeze({id:'training-wall',type:'military-training',name:'Muro de Escalada',x:-108,z:86,radius:5,description:'Obstáculo de escalada sem pontuação acadêmica.'}),
  Object.freeze({id:'training-tires',type:'military-training',name:'Sequência de Pneus',x:-94,z:98,radius:5,description:'Treino de coordenação motora e percurso.'}),
  Object.freeze({id:'training-beams',type:'military-training',name:'Barras de Equilíbrio',x:-78,z:106,radius:5,description:'Percurso de equilíbrio e deslocamento.'})
]);

export const MILITARY_SUPPORT_VEHICLES=Object.freeze([
  Object.freeze({id:'support-truck',type:'military-support-vehicle',kind:'truck',name:'Caminhão Logístico AGV',x:47,z:-36,accent:'#7d8f6e',description:'Veículo de transporte de suprimentos e manutenção.'}),
  Object.freeze({id:'rescue-van',type:'military-support-vehicle',kind:'rescue',name:'Van de Resgate AGV',x:-67,z:35,accent:'#d8e7d9',description:'Veículo de apoio a simulações de resgate e primeiros socorros.'}),
  Object.freeze({id:'engineering-rover',type:'military-support-vehicle',kind:'rover',name:'Rover de Engenharia',x:83,z:31,accent:'#7c98a4',description:'Plataforma terrestre para inspeção de infraestrutura.'}),
  Object.freeze({id:'observation-heli',type:'military-support-vehicle',kind:'helicopter',name:'Helicóptero de Observação',x:48,z:77,accent:'#788777',description:'Aeronave cenográfica de observação e apoio logístico, sem armamento.'})
]);

export const MILITARY_OBJECTS=Object.freeze([
  MILITARY_RETURN_PORTAL,
  ...MILITARY_BUILDINGS.map(item=>Object.freeze({...item,radius:Math.max(item.w,item.d)*.58})),
  MILITARY_RUNWAY,
  ...MILITARY_TRAINING,
  ...MILITARY_SUPPORT_VEHICLES.map(item=>Object.freeze({...item,radius:5})),
  Object.freeze({id:'observation-tower',type:'military-viewpoint',name:'Torre de Observação',x:138,z:104,radius:7,description:'Torre panorâmica para observar pista, hangares e circuito de treinamento.'}),
  Object.freeze({id:'checkpoint',type:'military-checkpoint',name:'Portaria da Base',x:0,z:-145,radius:8,description:'Portaria institucional da Base de Operações AGV.'})
]);

export const clampMilitary=(v,min,max)=>Math.max(min,Math.min(max,v));
export function militaryWorldToPresence(x,z){
  const px=((Number(x)||0)-MILITARY_BOUNDS.minX)/(MILITARY_BOUNDS.maxX-MILITARY_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-MILITARY_BOUNDS.minZ)/(MILITARY_BOUNDS.maxZ-MILITARY_BOUNDS.minZ)*1000;
  return{x:Math.round(clampMilitary(px,0,1600)),y:Math.round(clampMilitary(py,0,1000))};
}
export function militaryPresenceToWorld(x,y){
  return{x:MILITARY_BOUNDS.minX+(clampMilitary(Number(x)||800,0,1600)/1600)*(MILITARY_BOUNDS.maxX-MILITARY_BOUNDS.minX),z:MILITARY_BOUNDS.minZ+(clampMilitary(Number(y)||500,0,1000)/1000)*(MILITARY_BOUNDS.maxZ-MILITARY_BOUNDS.minZ)};
}
export function nearestMilitaryObject(x,z,maxDistance=9){
  let best=null,bestDistance=maxDistance;
  for(const object of MILITARY_OBJECTS){const d=Math.hypot(x-object.x,z-object.z),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

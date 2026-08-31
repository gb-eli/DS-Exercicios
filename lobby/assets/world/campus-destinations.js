const towardCampusRotation=(x,z)=>Math.atan2(-x,-z);
const makeDestination=item=>{
  const footprint=Object.freeze({width:Number(item.footprint?.width||7.2),depth:Number(item.footprint?.depth||5.2),height:Number(item.footprint?.height||6.4)});
  const rotation=Number.isFinite(item.rotation)?item.rotation:towardCampusRotation(item.x,item.z);
  const distance=Math.max(1,Math.hypot(item.x,item.z));
  const frontOffset=Number(item.frontOffset||footprint.depth/2+1.25);
  const entrance=Object.freeze({
    x:Number((item.x+(-item.x/distance)*frontOffset).toFixed(3)),
    z:Number((item.z+(-item.z/distance)*frontOffset).toFixed(3))
  });
  return Object.freeze({...item,rotation,footprint,entrance});
};

// Etapa 12 — destinos agrupados por distrito e afastados do núcleo central.
export const CAMPUS_DESTINATIONS=Object.freeze([
  makeDestination({id:'unified-platform',name:'Plataforma Unificada',label:'PLATAFORMA UNIFICADA',subtitle:'ATIVIDADES • PRÁTICA • DESAFIOS',icon:'🧪',route:'atividades/',x:0,z:31,accent:'#36d2ff',category:'academic',district:'Eixo Acadêmico',architecture:'campus-hall',footprint:{width:8.8,depth:5.6,height:8.6}}),
  makeDestination({id:'lab-virtual',name:'Laboratório Virtual DS',label:'LABORATÓRIO VIRTUAL',subtitle:'SIMULAÇÕES • LABS',icon:'🧪',route:'sistemas/01-lab-virtual/LABDS/index.html',x:-44,z:-26,accent:'#55d9ff',category:'academic',district:'Distrito Pesquisa',architecture:'research-lab',footprint:{width:8.4,depth:5.6,height:8.0}}),
  makeDestination({id:'ctf-ds',name:'CTF DS',label:'CTF DS',subtitle:'CYBER LAB',icon:'🛡️',route:'sistemas/02-ctf-ds/ctf/index.html',x:-44,z:26,accent:'#ff6b7a',category:'gamer',district:'Distrito Cyber',architecture:'cyber-fortress',footprint:{width:8.2,depth:5.8,height:7.7}}),
  makeDestination({id:'cosmos',name:'COSMOS / Planetário DS',label:'COSMOS DS',subtitle:'PLANETÁRIO • EXPLORAÇÃO',icon:'🪐',route:'sistemas/03-planetario-ds/universods/index.html',x:44,z:-26,accent:'#8f8cff',category:'gamer',district:'Distrito Ciência',architecture:'observatory',footprint:{width:8.4,depth:6.1,height:8.2}}),
  makeDestination({id:'desafio-ds',name:'Desafio DS',label:'DESAFIO DS',subtitle:'MISSÕES • DESAFIOS',icon:'⚡',route:'sistemas/04-desafio-ds/desafio 33/index.html',x:44,z:26,accent:'#ffd166',category:'gamer',district:'Distrito Desafios',architecture:'challenge-arena',footprint:{width:8.6,depth:5.8,height:7.2}}),
  makeDestination({id:'fliperama',name:'Fliperama DS',label:'FLIPERAMA DS',subtitle:'ARCADE • JOGOS',icon:'🕹️',route:'sistemas/05-fliperama-ds/flipds/index.html',x:-49,z:0,accent:'#ff7fd5',category:'gamer',district:'Distrito Arcade',architecture:'arcade',footprint:{width:7.6,depth:5.6,height:6.8}}),
  makeDestination({id:'game-info',name:'Desafio Informática',label:'DESAFIO INFORMÁTICA',subtitle:'TECNOLOGIA • PRÁTICA',icon:'💻',route:'sistemas/06-game-informatica/desafio-informatica-v2.2.0/index.html',x:49,z:0,accent:'#61e7a6',category:'academic',district:'Distrito Inovação',architecture:'innovation-center',footprint:{width:7.8,depth:5.8,height:7.8}}),
  makeDestination({id:'practical-exam',name:'Centro de Provas Práticas',label:'CENTRO DE PROVAS',subtitle:'PROVA PRÁTICA • AULAS',icon:'🏁',route:'prova/',staffRoute:'prova/admin.html',x:-15.5,z:-31,accent:'#ffae63',category:'academic',district:'Eixo de Avaliação',architecture:'exam-center',footprint:{width:8.8,depth:5.7,height:7.2}}),
  makeDestination({id:'cinema',name:'Cinema AGV',label:'CINEMA AGV',subtitle:'FILMES • AULAS • EXIBIÇÕES',icon:'🎬',route:null,x:29,z:31,accent:'#ff5f8f',category:'culture',district:'Distrito Cultural',architecture:'cinema',footprint:{width:9.6,depth:6.4,height:7.4}}),
  makeDestination({id:'security-center',name:'Central de Segurança AGV',label:'CENTRAL DE SEGURANÇA',subtitle:'CÂMERAS • ENERGIA • CONTROLE',icon:'📹',route:null,x:-29,z:31,accent:'#5ce1ff',category:'operations',district:'Centro Operacional',architecture:'security-center',footprint:{width:9.8,depth:6.4,height:8.2}}),
  makeDestination({id:'bank',name:'Banco AGV',label:'BANCO AGV',subtitle:'SALDO • MOEDAS • EXTRATO',icon:'🏦',route:'economia/?tab=bank',x:-15.5,z:31,accent:'#61e7a6',category:'economy',district:'Centro Cívico',architecture:'bank',footprint:{width:7.1,depth:5.2,height:6.7}}),
  makeDestination({id:'store',name:'Loja AGV',label:'LOJA AGV',subtitle:'SKINS • ACESSÓRIOS',icon:'🛍️',route:'economia/?tab=store',x:15.5,z:31,accent:'#f4b8ff',category:'economy',district:'Centro Cívico',architecture:'store',footprint:{width:7.2,depth:5.2,height:6.5}})
]);

export const CAMPUS_DESTINATION_MAP=Object.freeze(Object.fromEntries(CAMPUS_DESTINATIONS.map(item=>[item.id,item])));
export const CAMPUS_TOOL_EXPERIENCES=Object.freeze(CAMPUS_DESTINATIONS.map(item=>Object.freeze({
  ...item,
  type:'tool-building',
  radius:2.65,
  interaction:`Entrar em ${item.name}`,
  description:`Prédio conectado à ferramenta ${item.name}. A sessão AGV é reutilizada automaticamente.`
})));

export const CAMPUS_TOOL_BUILDING_COLLIDERS=Object.freeze(CAMPUS_DESTINATIONS.map(item=>{
  const w=item.footprint.width/2,d=item.footprint.depth/2,c=Math.abs(Math.cos(item.rotation)),s=Math.abs(Math.sin(item.rotation));
  const hx=c*w+s*d,hz=s*w+c*d;
  return Object.freeze({id:item.id,minX:item.x-hx,maxX:item.x+hx,minZ:item.z-hz,maxZ:item.z+hz});
}));

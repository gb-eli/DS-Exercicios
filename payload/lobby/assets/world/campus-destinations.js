export const CAMPUS_DESTINATIONS=Object.freeze([
  Object.freeze({id:'unified-platform',name:'Plataforma Unificada',label:'PLATAFORMA UNIFICADA',subtitle:'ATIVIDADES • PRÁTICA • DESAFIOS',icon:'🧪',route:'atividades/',x:0,z:26.0,accent:'#36d2ff',category:'academic'}),
  Object.freeze({id:'lab-virtual',name:'Laboratório Virtual DS',label:'LABORATÓRIO VIRTUAL',subtitle:'SIMULAÇÕES • LABS',icon:'🧪',route:'sistemas/01-lab-virtual/LABDS/index.html',x:-36,z:-23.5,accent:'#55d9ff',category:'academic'}),
  Object.freeze({id:'ctf-ds',name:'CTF DS',label:'CTF DS',subtitle:'CYBER LAB',icon:'🛡️',route:'sistemas/02-ctf-ds/ctf/index.html',x:-36,z:23.5,accent:'#ff6b7a',category:'gamer'}),
  Object.freeze({id:'cosmos',name:'COSMOS / Planetário DS',label:'COSMOS DS',subtitle:'PLANETÁRIO • EXPLORAÇÃO',icon:'🪐',route:'sistemas/03-planetario-ds/universods/index.html',x:36,z:-23.5,accent:'#8f8cff',category:'gamer'}),
  Object.freeze({id:'desafio-ds',name:'Desafio DS',label:'DESAFIO DS',subtitle:'MISSÕES • DESAFIOS',icon:'⚡',route:'sistemas/04-desafio-ds/desafio 33/index.html',x:36,z:23.5,accent:'#ffd166',category:'gamer'}),
  Object.freeze({id:'fliperama',name:'Fliperama DS',label:'FLIPERAMA DS',subtitle:'ARCADE • JOGOS',icon:'🕹️',route:'sistemas/05-fliperama-ds/flipds/index.html',x:-39.5,z:0,accent:'#ff7fd5',category:'gamer'}),
  Object.freeze({id:'game-info',name:'Desafio Informática',label:'DESAFIO INFORMÁTICA',subtitle:'TECNOLOGIA • PRÁTICA',icon:'💻',route:'sistemas/06-game-informatica/desafio-informatica-v2.2.0/index.html',x:39.5,z:0,accent:'#61e7a6',category:'academic'}),
  Object.freeze({id:'practical-exam',name:'Centro de Provas Práticas',label:'CENTRO DE PROVAS',subtitle:'PROVA PRÁTICA • AULAS',icon:'🏁',route:'prova/',staffRoute:'prova/admin.html',x:0,z:-26.0,accent:'#ffae63',category:'academic'}),
  Object.freeze({id:'bank',name:'Banco AGV',label:'BANCO AGV',subtitle:'SALDO • MOEDAS • EXTRATO',icon:'🏦',route:'economia/?tab=bank',x:-13.5,z:27.2,accent:'#61e7a6',category:'economy'}),
  Object.freeze({id:'store',name:'Loja AGV',label:'LOJA AGV',subtitle:'SKINS • ACESSÓRIOS',icon:'🛍️',route:'economia/?tab=store',x:13.5,z:27.2,accent:'#f4b8ff',category:'economy'})
]);
export const CAMPUS_DESTINATION_MAP=Object.freeze(Object.fromEntries(CAMPUS_DESTINATIONS.map(item=>[item.id,item])));
export const CAMPUS_TOOL_EXPERIENCES=Object.freeze(CAMPUS_DESTINATIONS.map(item=>Object.freeze({...item,type:'tool-building',radius:4.3,interaction:`Entrar em ${item.name}`,description:`Prédio conectado à ferramenta ${item.name}. A sessão AGV é reutilizada automaticamente.`})));

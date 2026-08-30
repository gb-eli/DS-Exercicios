// v14.10.8.65 — Fase 62C: Cidade Viva e Integração Sistêmica
// Dados de ambientação funcional. Nenhum estado acadêmico ou econômico é mutado aqui.

const freezeRoom=room=>Object.freeze({...room});
const freezeFloor=floor=>Object.freeze({...floor,rooms:Object.freeze((floor.rooms||[]).map(freezeRoom))});
const freezeGuide=guide=>Object.freeze({...guide,nodes:Object.freeze((guide.nodes||[]).map(([x,z])=>Object.freeze({x:Number(x),z:Number(z)})))});
const freezeBlueprint=blueprint=>Object.freeze({
  ...blueprint,
  receptionist:Object.freeze({...blueprint.receptionist}),
  floors:Object.freeze((blueprint.floors||[]).map(freezeFloor)),
  guides:Object.freeze((blueprint.guides||[]).map(freezeGuide))
});

export const CAMPUS_INTERIOR_LIVE_BLUEPRINTS=Object.freeze({
  'unified-platform':freezeBlueprint({
    theme:'central-campus',receptionist:{name:'Assistente do Campus',role:'Orientação AGV',message:'Posso orientar você entre atividades, projetos e serviços do Campus.'},
    floors:[
      {index:0,rooms:[{id:'hub',label:'Hub de Atividades',kind:'hub',x:0,z:1.1,w:5.0,d:2.0,description:'Acesso central às atividades liberadas.'},{id:'welcome',label:'Acolhimento',kind:'service',x:-5.3,z:-1.1,w:3.4,d:1.7,description:'Orientação de entrada e circulação.'}]},
      {index:1,rooms:[{id:'projects',label:'Sala de Projetos',kind:'project',x:-4.8,z:-1.8,w:4.0,d:2.1,description:'Planejamento e projetos integradores.'},{id:'coord',label:'Coordenação',kind:'staff',x:4.8,z:-1.8,w:4.0,d:2.1,description:'Área institucional e pedagógica.'},{id:'mini-aud',label:'Auditório Compacto',kind:'auditorium',x:0,z:2.2,w:5.5,d:2.2,description:'Apresentações e briefings rápidos.'}]}
    ],
    guides:[{id:'portal',label:'Portal de atividades',floor:0,nodes:[[0,-4.2],[0,-1.0],[3.2,1.3],[5.5,3.75]]},{id:'elevator',label:'Elevador',floor:0,nodes:[[0,-4.2],[3.2,-3.0],[6.3,-3.55]]},{id:'exit',label:'Saída',floor:0,nodes:[[0,0],[0,-5.45]]}]
  }),
  bank:freezeBlueprint({
    theme:'financial-civic',receptionist:{name:'Atendimento Banco AGV',role:'Orientação financeira',message:'Aqui você consulta saldo, extrato e entende como funcionam as moedas do ecossistema.'},
    floors:[{index:0,rooms:[{id:'atm',label:'Autoatendimento',kind:'finance',x:0,z:.8,w:4.7,d:2.2,description:'Consulta de saldo e extrato.'},{id:'desk',label:'Atendimento',kind:'service',x:-5.3,z:-1.2,w:3.2,d:1.8,description:'Orientação sobre economia gamificada.'}]},{index:1,rooms:[{id:'ledger',label:'Gestão Financeira',kind:'finance',x:-4.6,z:-1.8,w:4,d:2.2,description:'Visão administrativa da economia.'},{id:'audit',label:'Auditoria',kind:'staff',x:4.6,z:-1.8,w:4,d:2.2,description:'Conferência e integridade de lançamentos.'}]}],
    guides:[{id:'portal',label:'Abrir Banco',floor:0,nodes:[[0,-4.2],[0,-.5],[4.0,2.0],[5.5,3.75]]},{id:'atm',label:'Autoatendimento',floor:0,nodes:[[0,-4.2],[0,.8]]}]
  }),
  store:freezeBlueprint({
    theme:'retail-showroom',receptionist:{name:'Curadoria Loja AGV',role:'Atendimento da loja',message:'Posso mostrar coleções, personalização e itens disponíveis para o seu perfil.'},
    floors:[{index:0,rooms:[{id:'showroom',label:'Showroom',kind:'retail',x:0,z:.7,w:5.4,d:2.5,description:'Exposição de skins e acessórios.'},{id:'fitting',label:'Provadores',kind:'retail',x:-5.2,z:2.5,w:3.1,d:1.9,description:'Prévia visual de personalização.'}]},{index:1,rooms:[{id:'custom',label:'Personalização',kind:'creator',x:-4.7,z:-1.8,w:4,d:2.2,description:'Combinações de aparência e acessórios.'},{id:'collections',label:'Coleções',kind:'retail',x:4.7,z:-1.8,w:4,d:2.2,description:'Catálogo organizado por coleção.'}]}],
    guides:[{id:'portal',label:'Abrir Loja',floor:0,nodes:[[0,-4.2],[0,-.6],[4.2,2.1],[5.5,3.75]]},{id:'showroom',label:'Showroom',floor:0,nodes:[[0,-4.2],[0,.7]]}]
  }),
  'lab-virtual':freezeBlueprint({
    theme:'research-lab',receptionist:{name:'Monitor do Lab Virtual',role:'Apoio técnico',message:'Os laboratórios e simulações usam a mesma sessão do Campus. Posso indicar a bancada certa.'},
    floors:[{index:0,rooms:[{id:'sim',label:'Sala de Simulação',kind:'lab',x:0,z:.8,w:5.2,d:2.4,description:'Ambientes virtuais e simulações técnicas.'},{id:'bench',label:'Bancada Técnica',kind:'lab',x:-5.2,z:2.4,w:3.3,d:1.9,description:'Experimentação e montagem digital.'}]},{index:1,rooms:[{id:'research',label:'Pesquisa',kind:'lab',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Pesquisa aplicada e prototipação.'},{id:'infra',label:'Infraestrutura',kind:'tech',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Redes, sistemas e infraestrutura virtual.'}]}],
    guides:[{id:'portal',label:'Abrir Lab Virtual',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.1],[5.5,3.75]]},{id:'garage',label:'Garagem Tech Oeste',floor:0,nodes:[[0,-4.2],[0,2.0],[0,4.9]]}]
  }),
  'ctf-ds':freezeBlueprint({
    theme:'cyber-ops',receptionist:{name:'Analista Cyber',role:'SOC Educacional',message:'O ambiente CTF é educacional. Posso orientar você ao SOC, investigação ou sala de desafios.'},
    floors:[{index:0,rooms:[{id:'soc',label:'SOC Educacional',kind:'cyber',x:0,z:.8,w:5.0,d:2.5,description:'Painel de operações e monitoramento educacional.'},{id:'triage',label:'Triagem',kind:'cyber',x:-5.2,z:2.3,w:3.3,d:1.9,description:'Leitura inicial de cenários e evidências.'}]},{index:1,rooms:[{id:'investigation',label:'Investigação',kind:'cyber',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Análise orientada de evidências.'},{id:'ctf',label:'Sala CTF',kind:'cyber',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Desafios de segurança controlados.'}]}],
    guides:[{id:'portal',label:'Abrir CTF DS',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'soc',label:'SOC Educacional',floor:0,nodes:[[0,-4.2],[0,.8]]}]
  }),
  cosmos:freezeBlueprint({
    theme:'observatory',receptionist:{name:'Guia COSMOS',role:'Orientação científica',message:'Bem-vindo ao COSMOS. Posso indicar o planetário, observatório e a sala de missões.'},
    floors:[{index:0,rooms:[{id:'planetarium',label:'Planetário',kind:'science',x:0,z:.8,w:5.4,d:2.6,description:'Visualização e exploração astronômica.'},{id:'brief',label:'Briefing Científico',kind:'science',x:-5.2,z:2.4,w:3.2,d:1.9,description:'Introdução às missões e experimentos.'}]},{index:1,rooms:[{id:'observatory',label:'Observatório',kind:'science',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Observação e análise espacial.'},{id:'mission',label:'Sala de Missões',kind:'science',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Controle de missões educacionais.'}]}],
    guides:[{id:'portal',label:'Abrir COSMOS',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'planetarium',label:'Planetário',floor:0,nodes:[[0,-4.2],[0,.8]]}]
  }),
  'desafio-ds':freezeBlueprint({
    theme:'challenge-center',receptionist:{name:'Orientador de Missões',role:'Briefing de desafios',message:'Antes de iniciar uma missão, consulte o briefing. Depois você pode seguir ao debriefing no piso superior.'},
    floors:[{index:0,rooms:[{id:'briefing',label:'Briefing',kind:'mission',x:0,z:.8,w:5.2,d:2.4,description:'Objetivos, regras e preparação.'},{id:'prep',label:'Preparação',kind:'mission',x:-5.2,z:2.4,w:3.2,d:1.9,description:'Área de preparação para desafios.'}]},{index:1,rooms:[{id:'missions',label:'Sala de Missões',kind:'mission',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Execução de desafios e atividades.'},{id:'debrief',label:'Debriefing',kind:'mission',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Revisão da experiência e aprendizagem.'}]}],
    guides:[{id:'portal',label:'Abrir Desafio DS',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'briefing',label:'Briefing',floor:0,nodes:[[0,-4.2],[0,.8]]}]
  }),
  fliperama:freezeBlueprint({
    theme:'arcade',receptionist:{name:'Anfitrião do Arcade',role:'Recepção Gamer',message:'O Fliperama é uma área recreativa do Campus. Posso indicar arcade, arena multiplayer e ranking.'},
    floors:[{index:0,rooms:[{id:'arcade',label:'Arcade',kind:'gamer',x:0,z:.8,w:5.4,d:2.6,description:'Jogos e experiências do Fliperama DS.'},{id:'ranking',label:'Ranking',kind:'gamer',x:-5.2,z:2.4,w:3.2,d:1.9,description:'Painel local de destaque.'}]},{index:1,rooms:[{id:'arena',label:'Arena Multiplayer',kind:'gamer',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Área preparada para experiências multiplayer.'},{id:'lounge',label:'Lounge',kind:'social',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Convivência e encontro de jogadores.'}]}],
    guides:[{id:'portal',label:'Abrir Fliperama',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'garage',label:'Garagem Tech Oeste',floor:0,nodes:[[0,-4.2],[0,2.0],[0,4.9]]}]
  }),
  'game-info':freezeBlueprint({
    theme:'innovation-center',receptionist:{name:'Mentor de Inovação',role:'Maker & tecnologia',message:'Este centro conecta prática, maker e demonstrações. Posso orientar você para o espaço certo.'},
    floors:[{index:0,rooms:[{id:'maker',label:'Maker Space',kind:'creator',x:0,z:.8,w:5.3,d:2.5,description:'Prototipação e experimentação tecnológica.'},{id:'demo',label:'Demonstrações',kind:'creator',x:-5.2,z:2.4,w:3.3,d:1.9,description:'Exposição de projetos e tecnologias.'}]},{index:1,rooms:[{id:'projects',label:'Projetos',kind:'project',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Projetos de informática aplicada.'},{id:'studio',label:'Estúdio Tech',kind:'creator',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Criação e demonstração técnica.'}]}],
    guides:[{id:'portal',label:'Abrir Desafio Informática',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'garage',label:'Garagem Inovação',floor:0,nodes:[[0,-4.2],[0,2.0],[0,4.9]]}]
  }),
  'practical-exam':freezeBlueprint({
    theme:'exam-center',receptionist:{name:'Recepção de Provas',role:'Triagem e orientação',message:'Acesso às provas continua controlado pelo sistema. Aqui você encontra triagem, salas e orientação de circulação.'},
    floors:[{index:0,rooms:[{id:'triage',label:'Triagem',kind:'exam',x:0,z:.8,w:5.3,d:2.5,description:'Conferência inicial e orientação.'},{id:'waiting',label:'Espera',kind:'service',x:-5.2,z:2.4,w:3.3,d:1.9,description:'Área de espera antes da prova.'}]},{index:1,rooms:[{id:'rooms',label:'Salas de Prova',kind:'exam',x:-4.8,z:-1.8,w:4.1,d:2.2,description:'Ambientes de prova prática.'},{id:'staff',label:'Sala da Equipe',kind:'staff',x:4.8,z:-1.8,w:4.1,d:2.2,description:'Apoio da equipe responsável.'}]}],
    guides:[{id:'portal',label:'Abrir Centro de Provas',floor:0,nodes:[[0,-4.2],[0,-.7],[4.0,2.0],[5.5,3.75]]},{id:'triage',label:'Triagem',floor:0,nodes:[[0,-4.2],[0,.8]]},{id:'garage',label:'Garagem Mobilidade',floor:0,nodes:[[0,-4.2],[0,2.0],[0,4.9]]}]
  })
});

export const CAMPUS_GARAGE_FLEET=Object.freeze([
  Object.freeze({id:'fleet-west-1',garageId:'garage-west',kind:'car',label:'AGV E-Car',slot:-2.2,accent:'#55d9ff'}),
  Object.freeze({id:'fleet-west-2',garageId:'garage-west',kind:'bike',label:'AGV E-Bike',slot:1.8,accent:'#ff7fd5'}),
  Object.freeze({id:'fleet-east-1',garageId:'garage-east',kind:'van',label:'Maker Van',slot:-2.0,accent:'#61e7a6'}),
  Object.freeze({id:'fleet-east-2',garageId:'garage-east',kind:'drone',label:'Drone de Apoio',slot:2.0,accent:'#8f8cff'}),
  Object.freeze({id:'fleet-south-1',garageId:'garage-south',kind:'bus',label:'Shuttle Acadêmico',slot:-2.3,accent:'#ffae63'}),
  Object.freeze({id:'fleet-south-2',garageId:'garage-south',kind:'car',label:'Veículo de Serviço',slot:2.3,accent:'#ffd166'})
]);

export const CAMPUS_STATION_LINKS=Object.freeze([
  Object.freeze({id:'station-link-central',stationId:'central',label:'Conexão Praça Central',from:Object.freeze({x:0,z:-7.2}),to:Object.freeze({x:0,z:-4.8}),accent:'#36d2ff'}),
  Object.freeze({id:'station-link-vale',stationId:'vale',label:'Terminal Vale → Eixo Monumental',from:Object.freeze({x:0,z:-13}),to:Object.freeze({x:0,z:-17.2}),accent:'#51e7a3'}),
  Object.freeze({id:'station-link-research',stationId:'1ds',label:'Estação Pesquisa → Distrito Oeste',from:Object.freeze({x:-18.6,z:-10}),to:Object.freeze({x:-27,z:-16.2}),accent:'#55d9ff'}),
  Object.freeze({id:'station-link-science',stationId:'2ds',label:'Estação Ciência → Distrito Leste',from:Object.freeze({x:18.6,z:-10}),to:Object.freeze({x:27,z:-16.2}),accent:'#61e7a6'}),
  Object.freeze({id:'station-link-cyber',stationId:'3ds',label:'Estação Cyber → Distrito Norte Oeste',from:Object.freeze({x:-18.6,z:10}),to:Object.freeze({x:-27,z:16.2}),accent:'#ff6b7a'}),
  Object.freeze({id:'station-link-innovation',stationId:'sub',label:'Estação Inovação → Distrito Norte Leste',from:Object.freeze({x:18.6,z:10}),to:Object.freeze({x:27,z:16.2}),accent:'#ffd166'})
]);

export const CAMPUS_VALE_CEREMONIAL_GATE=Object.freeze({
  id:'vale-ceremonial-gate',name:'Portal Metropolitano AGV',x:0,z:-24.1,width:7.4,height:7.2,accent:'#51e7a3',
  message:'Você está deixando o núcleo acadêmico e entrando no corredor tecnológico do Vale do Silício AGV.'
});

const component=(id,name,icon,slot,position,role,description,ds,sensors,software,ports,order)=>({id,name,icon,slot,position,role,description,ds,sensors,software,ports,order});
const link=(id,type,from,to,label,required=true)=>({id,type,from,to,label,required});
const fault=(id,label,target,type,symptom,diagnostic,solution)=>({id,label,target,type,symptom,diagnostic,solution});

export const WORKSHOP_DIFFICULTIES=[
  {id:'guided',label:'Guiado',short:'GUIA',description:'Destaca encaixes, bloqueia ordem incorreta e explica cada ação.'},
  {id:'intermediate',label:'Intermediário',short:'MÉDIO',description:'Permite escolhas livres, mas mantém checklist e diagnóstico detalhado.'},
  {id:'advanced',label:'Avançado',short:'AVANÇADO',description:'Oculta encaixes corretos, permite erros e inicia com falha de manutenção.'}
];

export const WORKSHOP_FLOW_TYPES=[
  {id:'energy',label:'Energia',short:'⚡',description:'Fluxo de geração, armazenamento e distribuição.'},
  {id:'data',label:'Dados',short:'DATA',description:'Leituras, mensagens, memória e telemetria.'},
  {id:'command',label:'Comando',short:'CMD',description:'Ordens do software até atuadores e mecanismos.'}
];

export const SPACE_WORKSHOP_SYSTEMS=[
  {
    id:'satellite',name:'Oficina do Satélite',symbol:'⌁',color:'#69ddff',shape:'satellite',technicalSystem:'satellite',relatedModule:'earth',museumExhibit:'comms-satellite',
    story:'Um satélite de comunicações chegou desmontado à sala limpa. Sua equipe deve montar energia, computação, atitude e enlace antes do teste orbital.',
    outcome:'Satélite energizado, orientado e capaz de transmitir telemetria.',
    slots:[['power-bus','Barramento de energia',[-1.15,.2,0]],['battery','Bateria',[0,-.5,0]],['computer','Computador',[0,.1,0]],['attitude','Controle de atitude',[0,.72,0]],['antenna','Antena',[1.05,.18,0]],['payload','Carga útil',[0,-.05,.5]]].map(([id,label,position])=>({id,label,position})),
    components:[
      component('solar-array','Painéis solares','☀','power-bus',[-1.15,.2,0],'Geração','Convertem luz em eletricidade e alimentam o barramento.','Controle de carga e estimativa de potência.',['corrente','tensão'],['C','C++'],['power-out'],1),
      component('battery-pack','Bateria orbital','▥','battery',[0,-.5,0],'Armazenamento','Mantém sistemas essenciais durante eclipse e picos de consumo.','BMS, limites térmicos e modo seguro.',['temperatura','corrente'],['C'],['power-in','power-out'],2),
      component('flight-computer','Computador de bordo','▣','computer',[0,.1,0],'Processamento','Executa estados, valida sensores, registra logs e envia comandos.','Máquina de estados, watchdog e redundância.',['temperatura','corrente'],['C','Assembly'],['power-in','data-in','data-out','command-out'],3),
      component('attitude-unit','Unidade de atitude','◎','attitude',[0,.72,0],'Orientação','Funde giroscópio, magnetômetro e rastreador de estrelas.','Fusão de sensores e controle em malha fechada.',['giroscópio','magnetômetro','star tracker'],['C','C++','Python'],['power-in','data-out','command-in'],4),
      component('high-gain-antenna','Antena de alto ganho','⌁','antenna',[1.05,.18,0],'Comunicação','Recebe comandos e transmite telemetria e carga útil.','Enquadramento, filas, correção de erros e downlink.',['RSSI','temperatura RF'],['C','SQL'],['power-in','data-in','data-out','command-in'],5),
      component('mission-payload','Carga útil','◉','payload',[0,-.05,.5],'Missão','Executa a finalidade científica ou de comunicação do satélite.','Aquisição, compressão e prioridade de dados.',['câmera','espectrômetro'],['C++','Python'],['power-in','data-out','command-in'],6)
    ],
    links:[
      link('sat-e1','energy','solar-array','battery-pack','Painéis → bateria'),link('sat-e2','energy','battery-pack','flight-computer','Bateria → computador'),link('sat-e3','energy','battery-pack','attitude-unit','Bateria → atitude'),link('sat-e4','energy','battery-pack','high-gain-antenna','Bateria → antena'),link('sat-e5','energy','battery-pack','mission-payload','Bateria → carga útil'),
      link('sat-d1','data','attitude-unit','flight-computer','Atitude → computador'),link('sat-d2','data','mission-payload','flight-computer','Carga útil → computador'),link('sat-d3','data','flight-computer','high-gain-antenna','Computador → antena'),
      link('sat-c1','command','flight-computer','attitude-unit','Comando de orientação'),link('sat-c2','command','flight-computer','mission-payload','Comando da carga útil')
    ],
    faults:[
      fault('sat-open-power','Cabo de energia interrompido','sat-e2','connection','O computador não inicia e não há telemetria.','Teste continuidade entre bateria e computador.','Reconecte o enlace de energia sat-e2.'),
      fault('sat-battery-hot','Bateria superaquecida','battery-pack','component','A bateria limita corrente e entra em alerta térmico.','Inspecione temperatura e posição do conjunto.','Substitua a bateria e repita o teste.'),
      fault('sat-data-loop','Dados de atitude ausentes','sat-d1','connection','A antena não mantém apontamento estável.','Verifique se a unidade de atitude envia dados ao computador.','Reconecte sat-d1 e execute diagnóstico.')
    ]
  },
  {
    id:'rover',name:'Oficina do Rover',symbol:'▦',color:'#e49b63',shape:'rover',technicalSystem:'rover',relatedModule:'planetary-remaster',museumExhibit:'mars-rover',
    story:'O rover precisa ser preparado para atravessar terreno irregular, mapear obstáculos, coletar amostras e enviar resultados com atraso de comunicação.',
    outcome:'Rover móvel, autônomo e com braço científico validado.',
    slots:[['mobility','Mobilidade',[-1,-.42,0]],['battery','Energia',[-.25,.05,0]],['computer','Computador',[.25,.05,0]],['mast','Mastro',[0,.75,0]],['arm','Braço',[.95,.18,0]],['radio','Comunicação',[-.75,.65,0]]].map(([id,label,position])=>({id,label,position})),
    components:[
      component('wheel-system','Rodas e suspensão','◉','mobility',[-1,-.42,0],'Mobilidade','Seis rodas e suspensão articulada mantêm contato com o solo.','Controle de torque, odometria e detecção de escorregamento.',['encoders','IMU','corrente'],['C++','Python'],['power-in','data-out','command-in'],1),
      component('rover-battery','Bateria e aquecimento','⚡','battery',[-.25,.05,0],'Energia','Alimenta mobilidade, ciência e aquecimento.','Orçamento de energia e modo de sobrevivência.',['tensão','corrente','temperatura'],['C','Python'],['power-out'],2),
      component('rover-computer','Computador autônomo','▣','computer',[.25,.05,0],'Processamento','Planeja rotas e executa comandos sem controle contínuo da Terra.','A*, filas, mapas e máquina de estados.',['temperatura','watchdog'],['C++','Python'],['power-in','data-in','data-out','command-out'],3),
      component('vision-mast','Mastro de visão','⌖','mast',[0,.75,0],'Percepção','Câmeras e sensores criam mapa do ambiente.','Visão computacional e fusão sensorial.',['câmeras','laser','IMU'],['C++','Python'],['power-in','data-out','command-in'],4),
      component('science-arm','Braço científico','⌇','arm',[.95,.18,0],'Ciência','Posiciona instrumentos e coleta amostras.','Cinemática, força e sequências seguras.',['encoders','força','câmera'],['C++','Python'],['power-in','data-out','command-in'],5),
      component('relay-radio','Rádio de relé','⌁','radio',[-.75,.65,0],'Comunicação','Envia ciência e recebe planos de missão.','Janelas, compressão, confirmação e retry.',['RSSI','temperatura RF'],['C','SQL'],['power-in','data-in','data-out','command-in'],6)
    ],
    links:[
      link('rov-e1','energy','rover-battery','rover-computer','Bateria → computador'),link('rov-e2','energy','rover-battery','wheel-system','Bateria → mobilidade'),link('rov-e3','energy','rover-battery','vision-mast','Bateria → mastro'),link('rov-e4','energy','rover-battery','science-arm','Bateria → braço'),link('rov-e5','energy','rover-battery','relay-radio','Bateria → rádio'),
      link('rov-d1','data','vision-mast','rover-computer','Visão → computador'),link('rov-d2','data','wheel-system','rover-computer','Odometria → computador'),link('rov-d3','data','science-arm','rover-computer','Braço → computador'),link('rov-d4','data','rover-computer','relay-radio','Ciência → rádio'),
      link('rov-c1','command','rover-computer','wheel-system','Comando de tração'),link('rov-c2','command','rover-computer','science-arm','Comando do braço')
    ],
    faults:[
      fault('rov-wheel-open','Roda sem comando','rov-c1','connection','O rover não executa a rota planejada.','Verifique o caminho de comando até a mobilidade.','Reconecte rov-c1.'),
      fault('rov-camera-fail','Mastro de visão indisponível','vision-mast','component','O mapa de obstáculos fica incompleto.','Compare os dados de câmera e IMU.','Substitua o mastro e repita o teste.'),
      fault('rov-radio-data','Fila científica bloqueada','rov-d4','connection','A memória cresce e nenhum pacote é transmitido.','Inspecione o enlace de dados entre computador e rádio.','Reconecte rov-d4.')
    ]
  },
  {
    id:'capsule',name:'Oficina da Cápsula',symbol:'⬟',color:'#ffd99b',shape:'capsule',technicalSystem:'capsule',relatedModule:'station-remaster',museumExhibit:'command-capsule',
    story:'Uma cápsula tripulada precisa passar por montagem e teste de cabine antes do acoplamento e da reentrada.',
    outcome:'Cabine pressurizada, orientada, comunicando e com energia essencial.',
    slots:[['life-support','Suporte à vida',[-.55,.22,0]],['battery','Energia',[-.55,-.42,0]],['computer','Computador',[0,.2,0]],['guidance','Guiagem',[.42,.48,0]],['radio','Comunicação',[.62,.05,0]],['heatshield','Escudo térmico',[0,-.7,0]]].map(([id,label,position])=>({id,label,position})),
    components:[
      component('cabin-life-support','Suporte à vida','◌','life-support',[-.55,.22,0],'Atmosfera','Mantém oxigênio, pressão e remoção de CO₂.','Alarmes, controle e isolamento de válvulas.',['O₂','CO₂','pressão'],['C','C++'],['power-in','data-out','command-in'],1),
      component('capsule-battery','Baterias essenciais','⚡','battery',[-.55,-.42,0],'Energia','Alimentam cabine, guiagem e comunicação.','Prioridade de cargas e autonomia restante.',['tensão','corrente','temperatura'],['C'],['power-out'],2),
      component('capsule-computer','Computador da cápsula','▣','computer',[0,.2,0],'Processamento','Coordena navegação, cabine, alarmes e telemetria.','Estados, prioridades, watchdog e logs.',['temperatura','corrente'],['C','Assembly'],['power-in','data-in','data-out','command-out'],3),
      component('guidance-unit','Unidade de guiagem','◎','guidance',[.42,.48,0],'Navegação','Estima atitude, posição e velocidade.','Fusão inercial e correção de trajetória.',['IMU','star tracker'],['C','Assembly'],['power-in','data-out','command-in'],4),
      component('capsule-radio','Rádio e antena','⌁','radio',[.62,.05,0],'Comunicação','Transporta voz, comandos e telemetria.','Protocolos, filas e correção de erro.',['RSSI','temperatura RF'],['C','C++'],['power-in','data-in','data-out','command-in'],5),
      component('thermal-shield','Escudo térmico','▧','heatshield',[0,-.7,0],'Proteção','Dissipa energia térmica da reentrada.','Mapa térmico, limites e critérios de abortagem.',['temperatura','fluxo térmico'],['C','Python'],['data-out'],6)
    ],
    links:[
      link('cap-e1','energy','capsule-battery','capsule-computer','Bateria → computador'),link('cap-e2','energy','capsule-battery','cabin-life-support','Bateria → suporte à vida'),link('cap-e3','energy','capsule-battery','guidance-unit','Bateria → guiagem'),link('cap-e4','energy','capsule-battery','capsule-radio','Bateria → rádio'),
      link('cap-d1','data','cabin-life-support','capsule-computer','Atmosfera → computador'),link('cap-d2','data','guidance-unit','capsule-computer','Guiagem → computador'),link('cap-d3','data','thermal-shield','capsule-computer','Temperatura → computador'),link('cap-d4','data','capsule-computer','capsule-radio','Telemetria → rádio'),
      link('cap-c1','command','capsule-computer','cabin-life-support','Comando de válvulas'),link('cap-c2','command','capsule-computer','guidance-unit','Comando de atitude')
    ],
    faults:[
      fault('cap-life-power','Suporte à vida sem energia','cap-e2','connection','Oxigênio e pressão deixam de ser regulados.','Teste o caminho de energia até o suporte à vida.','Reconecte cap-e2.'),
      fault('cap-guidance-fail','Unidade de guiagem divergente','guidance-unit','component','A cápsula sai do corredor de atitude.','Compare dados inerciais e estado do computador.','Substitua a unidade de guiagem.'),
      fault('cap-thermal-data','Mapa térmico incompleto','cap-d3','connection','O computador não consegue avaliar a reentrada.','Verifique o enlace de sensores térmicos.','Reconecte cap-d3.')
    ]
  },
  {
    id:'station',name:'Oficina da Estação',symbol:'✥',color:'#72efc3',shape:'station',technicalSystem:'station',relatedModule:'station-remaster',museumExhibit:'modular-station',
    story:'Um novo módulo orbital será integrado. A equipe deve conectar energia, atmosfera, controle térmico, acoplamento e robótica.',
    outcome:'Módulo orbital integrado com suporte à vida e barramentos redundantes.',
    slots:[['solar','Geração solar',[-1.25,.55,0]],['power','Distribuição',[-.35,.05,0]],['computer','Computador',[.2,.1,0]],['life','Suporte à vida',[-.55,-.45,0]],['thermal','Controle térmico',[.55,-.48,0]],['robotics','Robótica',[1.18,.45,0]]].map(([id,label,position])=>({id,label,position})),
    components:[
      component('station-solar','Asas solares','☀','solar',[-1.25,.55,0],'Geração','Produzem energia para módulos e baterias.','Rastreamento solar e previsão de geração.',['corrente','tensão','ângulo solar'],['C','Python'],['power-out'],1),
      component('station-power-bus','Barramento de potência','⚡','power',[-.35,.05,0],'Distribuição','Prioriza cargas e isola falhas elétricas.','Redundância, proteção e shedding.',['corrente','tensão','temperatura'],['C','C++'],['power-in','power-out','data-out','command-in'],2),
      component('station-computer','Computador de estação','▣','computer',[.2,.1,0],'Processamento','Supervisiona módulos, alarmes e comandos.','Controle distribuído, logs e rede interna.',['temperatura','watchdog'],['C','C++','TypeScript'],['power-in','data-in','data-out','command-out'],3),
      component('station-life','Suporte à vida','◌','life',[-.55,-.45,0],'Atmosfera','Controla O₂, CO₂, pressão, água e umidade.','Controle em malha fechada e alarmes.',['O₂','CO₂','pressão','umidade'],['C','C++'],['power-in','data-out','command-in'],4),
      component('station-thermal','Circuito térmico','≈','thermal',[.55,-.48,0],'Temperatura','Transporta calor até radiadores externos.','PID, tendências e detecção de vazamento.',['temperatura','fluxo'],['C','Python'],['power-in','data-out','command-in'],5),
      component('station-arm','Braço robótico','⌇','robotics',[1.18,.45,0],'Robótica','Captura cargas e posiciona equipamentos.','Cinemática, visão e limites de segurança.',['encoders','força','câmera'],['C++','Python'],['power-in','data-out','command-in'],6)
    ],
    links:[
      link('sta-e1','energy','station-solar','station-power-bus','Solar → barramento'),link('sta-e2','energy','station-power-bus','station-computer','Barramento → computador'),link('sta-e3','energy','station-power-bus','station-life','Barramento → suporte à vida'),link('sta-e4','energy','station-power-bus','station-thermal','Barramento → térmico'),link('sta-e5','energy','station-power-bus','station-arm','Barramento → braço'),
      link('sta-d1','data','station-life','station-computer','Atmosfera → computador'),link('sta-d2','data','station-thermal','station-computer','Térmico → computador'),link('sta-d3','data','station-arm','station-computer','Robótica → computador'),
      link('sta-c1','command','station-computer','station-life','Comando de atmosfera'),link('sta-c2','command','station-computer','station-thermal','Comando térmico'),link('sta-c3','command','station-computer','station-arm','Comando robótico')
    ],
    faults:[
      fault('sta-bus-open','Barramento interrompido','sta-e3','connection','O suporte à vida muda para reserva.','Localize a conexão entre distribuição e suporte à vida.','Reconecte sta-e3.'),
      fault('sta-thermal-pump','Bomba térmica indisponível','station-thermal','component','A temperatura dos módulos começa a subir.','Verifique fluxo, energia e comandos da bomba.','Substitua o circuito térmico.'),
      fault('sta-arm-command','Braço sem comando','sta-c3','connection','O braço recebe energia, mas não se movimenta.','Compare energia, dados e comando.','Reconecte sta-c3.')
    ]
  },
  {
    id:'shuttle',name:'Oficina do Ônibus Espacial',symbol:'▷',color:'#dfefff',shape:'shuttle',technicalSystem:'shuttle',relatedModule:'launch-remaster',museumExhibit:'space-shuttle',
    story:'O orbitador está em manutenção. A equipe deve integrar aviônica, hidráulica, proteção térmica, porão de carga e pouso.',
    outcome:'Orbitador com aviônica redundante, mecanismos e proteção térmica aprovados.',
    slots:[['power','Energia',[-.8,.05,0]],['avionics','Aviônica',[.2,.2,0]],['hydraulics','Hidráulica',[-.25,-.42,0]],['bay','Porão',[.1,.65,0]],['thermal','Térmico',[.45,-.45,0]],['landing','Pouso',[1.05,-.2,0]]].map(([id,label,position])=>({id,label,position})),
    components:[
      component('shuttle-power','Unidade de energia','⚡','power',[-.8,.05,0],'Energia','Distribui energia para aviônica e mecanismos.','Prioridade, proteção e modo de emergência.',['tensão','corrente'],['C'],['power-out'],1),
      component('shuttle-avionics','Aviônica redundante','▣','avionics',[.2,.2,0],'Processamento','Computadores executam navegação, voo e gerenciamento.','Votação, redundância e isolamento de canal.',['IMU','temperatura','watchdog'],['Assembly','C'],['power-in','data-in','data-out','command-out'],2),
      component('hydraulic-unit','Unidade hidráulica','≈','hydraulics',[-.25,-.42,0],'Atuação','Aciona superfícies, portas e trem de pouso.','Pressão, válvulas e intertravamentos.',['pressão','posição'],['C'],['power-in','data-out','command-in'],3),
      component('payload-bay-system','Porão de carga','▤','bay',[.1,.65,0],'Carga','Transporta e libera cargas em órbita.','Sequência, posição e intertravamentos.',['posição','temperatura'],['C','C++'],['power-in','data-out','command-in'],4),
      component('thermal-protection','Proteção térmica','▧','thermal',[.45,-.45,0],'Proteção','Protege a estrutura durante a reentrada.','Mapas térmicos, limites e inspeção.',['termopares','fluxo térmico'],['C','Python'],['data-out'],5),
      component('landing-system','Sistema de pouso','▼','landing',[1.05,-.2,0],'Pouso','Trem, freios e confirmação de travamento.','Sequência irreversível e validação redundante.',['posição','velocidade de roda'],['C'],['power-in','data-out','command-in'],6)
    ],
    links:[
      link('shu-e1','energy','shuttle-power','shuttle-avionics','Energia → aviônica'),link('shu-e2','energy','shuttle-power','hydraulic-unit','Energia → hidráulica'),link('shu-e3','energy','shuttle-power','payload-bay-system','Energia → porão'),link('shu-e4','energy','shuttle-power','landing-system','Energia → pouso'),
      link('shu-d1','data','hydraulic-unit','shuttle-avionics','Hidráulica → aviônica'),link('shu-d2','data','payload-bay-system','shuttle-avionics','Porão → aviônica'),link('shu-d3','data','thermal-protection','shuttle-avionics','Térmico → aviônica'),link('shu-d4','data','landing-system','shuttle-avionics','Pouso → aviônica'),
      link('shu-c1','command','shuttle-avionics','hydraulic-unit','Comando hidráulico'),link('shu-c2','command','shuttle-avionics','payload-bay-system','Comando do porão'),link('shu-c3','command','shuttle-avionics','landing-system','Comando do trem')
    ],
    faults:[
      fault('shu-hyd-command','Hidráulica sem comando','shu-c1','connection','Portas e superfícies não respondem.','Compare energia, pressão e comando.','Reconecte shu-c1.'),
      fault('shu-avionics-channel','Canal de aviônica falho','shuttle-avionics','component','A votação entre computadores fica degradada.','Inspecione logs e watchdog.','Substitua a aviônica.'),
      fault('shu-thermal-sensor','Sensor térmico desconectado','shu-d3','connection','O mapa térmico apresenta região sem dados.','Teste a comunicação dos termopares.','Reconecte shu-d3.')
    ]
  }
];

export const SPACE_WORKSHOP_BY_ID=Object.fromEntries(SPACE_WORKSHOP_SYSTEMS.map(item=>[item.id,item]));
export const WORKSHOP_GOALS=[
  {id:'assemble-one',label:'Montar um sistema completo',target:1,xp:320},
  {id:'connect-flows',label:'Conectar energia, dados e comando',target:3,xp:220},
  {id:'diagnose-fault',label:'Diagnosticar e reparar uma falha',target:1,xp:260},
  {id:'complete-three',label:'Concluir três oficinas',target:3,xp:450},
  {id:'export-workshop',label:'Exportar evidência de manutenção',target:1,xp:150}
];

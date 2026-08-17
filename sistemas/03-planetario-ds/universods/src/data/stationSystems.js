export const STATION_TIMELINE = [
  { id:'salyut', year:'1971', label:'Salyut 1', type:'Primeira estação espacial', summary:'Inaugurou a permanência humana em um laboratório orbital e mostrou a importância de operação, logística e suporte à vida.', dsLink:'Sistemas críticos precisam continuar operando por longos períodos, registrar falhas e permitir manutenção.', source:'https://www.nasa.gov/history/space-stations/' },
  { id:'skylab', year:'1973', label:'Skylab', type:'Laboratório orbital', summary:'Ampliou experiências científicas e observação solar com uma estação maior e missões tripuladas prolongadas.', dsLink:'Integração entre instrumentos, agenda científica, armazenamento de dados e controle de recursos.', source:'https://www.nasa.gov/history/skylab/' },
  { id:'mir', year:'1986', label:'Mir', type:'Estação modular', summary:'Consolidou a montagem progressiva de módulos e operações humanas de longa duração.', dsLink:'Arquitetura modular, interfaces estáveis, compatibilidade entre versões e manutenção evolutiva.', source:'https://www.nasa.gov/history/shuttle-mir/' },
  { id:'iss-first', year:'1998', label:'Primeiros módulos da ISS', type:'Construção internacional', summary:'A estação começou a ser montada em órbita por módulos lançados e integrados em diferentes missões.', dsLink:'Contratos entre subsistemas, integração contínua, testes de interface e colaboração internacional.', source:'https://www.nasa.gov/international-space-station/' },
  { id:'continuous', year:'2000', label:'Presença humana contínua', type:'Operação permanente', summary:'A estação passou a manter tripulações continuamente, exigindo logística, segurança e manutenção ininterruptas.', dsLink:'Alta disponibilidade, observabilidade, inventário, tolerância a falhas e procedimentos de contingência.', source:'https://www.nasa.gov/international-space-station/' },
  { id:'robotics', year:'2001', label:'Robótica orbital', type:'Braço robótico e montagem', summary:'Braços robóticos passaram a apoiar montagem, captura de cargas e manutenção externa.', dsLink:'Controle de juntas, limites, prevenção de colisões, feedback e automação supervisionada.', source:'https://www.nasa.gov/international-space-station/canadarm2/' },
  { id:'commercial', year:'2020+', label:'Novos veículos e operações', type:'Ecossistema orbital', summary:'Veículos tripulados e cargueiros de diferentes organizações ampliaram a rotina de acoplamentos e reabastecimento.', dsLink:'Protocolos, estados seguros, autenticação de comandos, filas e integração entre sistemas independentes.', source:'https://www.nasa.gov/commercial-crew/' }
];

export const STATION_ARCHITECTURE = [
  { id:'power', label:'Energia', detail:'Painéis solares, baterias, distribuição e cargas prioritárias.' },
  { id:'life', label:'Suporte à vida', detail:'Oxigênio, CO₂, pressão, umidade, água e temperatura.' },
  { id:'thermal', label:'Controle térmico', detail:'Loops de refrigeração, radiadores e proteção de equipamentos.' },
  { id:'guidance', label:'Orientação', detail:'Sensores, giroscópios, controle de atitude e propulsores.' },
  { id:'comms', label:'Comunicação', detail:'Telemetria, vídeo, comandos, voz e sincronização.' },
  { id:'robotics', label:'Robótica', detail:'Braço articulado, captura, berço e atividade extraveicular.' },
  { id:'logistics', label:'Logística', detail:'Inventário, consumíveis, peças, validade e rastreabilidade.' }
];

export const STATION_FAULTS = [
  { id:'co2-scrubber', label:'Depurador de CO₂ degradado', symptom:'CO₂ sobe e a margem de conforto diminui.', answer:'isolate-scrubber', concept:'redundância e isolamento', xp:210, options:[['ignore','Aguardar a próxima órbita'],['isolate-scrubber','Isolar unidade e ativar linha redundante'],['increase-load','Aumentar cargas não críticas']] },
  { id:'coolant-leak', label:'Vazamento no loop térmico', symptom:'Temperatura de equipamentos e pressão do circuito se desviam.', answer:'close-loop', concept:'contenção e operação degradada', xp:220, options:[['close-loop','Fechar segmento, reduzir carga e usar loop reserva'],['open-valves','Abrir todas as válvulas'],['disable-telemetry','Desligar telemetria']] },
  { id:'solar-shadow', label:'Sombreamento do painel', symptom:'Geração elétrica cai abaixo da demanda.', answer:'shed-load', concept:'priorização de energia', xp:200, options:[['shed-load','Desligar cargas secundárias e ajustar orientação'],['heat-cabin','Aumentar aquecimento'],['drain-battery','Forçar descarga máxima']] },
  { id:'micro-leak', label:'Microvazamento de cabine', symptom:'Pressão cai lentamente e o sistema registra perda de ar.', answer:'section-isolation', concept:'localização por setores', xp:240, options:[['section-isolation','Fechar escotilhas e comparar sensores por módulo'],['open-hatches','Abrir todas as escotilhas'],['disable-alarm','Silenciar o alarme']] }
];

export const DOCKING_PROFILES = [
  { id:'training', label:'Treinamento assistido', startDistanceM:240, maxClosingMps:.18, holdPoints:[200,30,10], alignmentLimitDeg:3.5 },
  { id:'standard', label:'Operação nominal', startDistanceM:500, maxClosingMps:.12, holdPoints:[250,30,10], alignmentLimitDeg:2.2 },
  { id:'precision', label:'Precisão avançada', startDistanceM:800, maxClosingMps:.08, holdPoints:[400,100,30,10], alignmentLimitDeg:1.2 }
];

export const ARM_TASKS = [
  { id:'power', label:'Energizar e autodiagnosticar', command:'power', xp:90 },
  { id:'align', label:'Alinhar efetuador com a carga', command:'align', xp:100 },
  { id:'grapple', label:'Capturar o ponto de pega', command:'grapple', xp:120 },
  { id:'translate', label:'Transportar até o berço', command:'translate', xp:130 },
  { id:'berth', label:'Fixar e confirmar conectores', command:'berth', xp:150 },
  { id:'stow', label:'Recolher o braço com segurança', command:'stow', xp:110 }
];

export const MAINTENANCE_TASKS = [
  { id:'filter', label:'Trocar filtro de ar', item:'filter-cartridge', quantity:1, durationMin:18, system:'Suporte à vida', xp:120 },
  { id:'coolant', label:'Substituir válvula térmica', item:'thermal-valve', quantity:1, durationMin:32, system:'Controle térmico', xp:150 },
  { id:'camera', label:'Recalibrar câmera externa', item:'calibration-target', quantity:1, durationMin:14, system:'Robótica', xp:110 },
  { id:'battery', label:'Inspecionar módulo de bateria', item:'power-toolkit', quantity:1, durationMin:24, system:'Energia', xp:140 }
];

export const INITIAL_INVENTORY = [
  { id:'filter-cartridge', label:'Cartucho de filtro', quantity:3, minimum:2, category:'Consumível' },
  { id:'thermal-valve', label:'Válvula térmica', quantity:2, minimum:1, category:'Peça' },
  { id:'calibration-target', label:'Alvo de calibração', quantity:2, minimum:1, category:'Ferramenta' },
  { id:'power-toolkit', label:'Kit elétrico', quantity:1, minimum:1, category:'Ferramenta' },
  { id:'water-pack', label:'Pacote de água', quantity:14, minimum:8, category:'Consumível' },
  { id:'food-pack', label:'Pacote de alimentação', quantity:21, minimum:12, category:'Consumível' }
];

export const EVA_CHECKLIST = [
  'Traje e pressão verificados',
  'Oxigênio e bateria acima da margem',
  'Ferramentas presas ao traje',
  'Trava e cabo de segurança confirmados',
  'Comunicação e câmera testadas',
  'Procedimento de retorno revisado'
];

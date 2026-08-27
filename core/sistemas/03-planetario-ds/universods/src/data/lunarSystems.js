export const APOLLO_TIMELINE = [
  {
    id:'apollo-1', year:1967, label:'Apollo 1', type:'Segurança e engenharia',
    summary:'O incêndio em teste de solo levou a uma revisão profunda de materiais, procedimentos e projeto da cabine.',
    dsLink:'gestão de riscos, requisitos de segurança e análise de causa raiz',
    source:'https://www.nasa.gov/mission/apollo-1/'
  },
  {
    id:'apollo-7', year:1968, label:'Apollo 7', type:'Validação em órbita terrestre',
    summary:'Primeiro voo tripulado do programa Apollo, validando o módulo de comando e serviço em órbita terrestre.',
    dsLink:'testes de integração, telemetria e validação incremental',
    source:'https://www.nasa.gov/mission/apollo-7/'
  },
  {
    id:'apollo-8', year:1968, label:'Apollo 8', type:'Órbita lunar',
    summary:'Primeira missão tripulada a viajar até a Lua e entrar em órbita lunar.',
    dsLink:'navegação, estados críticos e comunicação de longa distância',
    source:'https://www.nasa.gov/mission/apollo-8/'
  },
  {
    id:'apollo-9', year:1969, label:'Apollo 9', type:'Módulo lunar em órbita terrestre',
    summary:'Testou o módulo lunar, acoplamento, separação e encontro em órbita terrestre.',
    dsLink:'interfaces, contratos entre componentes e sistemas distribuídos',
    source:'https://www.nasa.gov/mission/apollo-9/'
  },
  {
    id:'apollo-10', year:1969, label:'Apollo 10', type:'Ensaio geral lunar',
    summary:'Executou o perfil completo de missão lunar, exceto o pouso, aproximando o módulo lunar da superfície.',
    dsLink:'ambiente de homologação, ensaio de processo e redução de risco',
    source:'https://www.nasa.gov/mission/apollo-10/'
  },
  {
    id:'apollo-11', year:1969, label:'Apollo 11', type:'Primeiro pouso humano',
    summary:'Realizou o primeiro pouso humano na Lua e retornou a tripulação com segurança.',
    dsLink:'software de tempo real, prioridades, alarmes e decisão humana',
    source:'https://www.nasa.gov/history/apollo-11-mission-overview/'
  },
  {
    id:'apollo-13', year:1970, label:'Apollo 13', type:'Recuperação de contingência',
    summary:'Após uma falha grave, a missão foi reorganizada para preservar energia, suporte à vida e retorno seguro.',
    dsLink:'operação degradada, replanejamento e tolerância a falhas',
    source:'https://www.nasa.gov/mission/apollo-13/'
  },
  {
    id:'apollo-15', year:1971, label:'Apollo 15', type:'Exploração ampliada',
    summary:'Primeira missão Apollo a utilizar o Lunar Roving Vehicle na superfície.',
    dsLink:'robótica, mobilidade, coleta de dados e inventário científico',
    source:'https://www.nasa.gov/mission/apollo-15/'
  },
  {
    id:'apollo-17', year:1972, label:'Apollo 17', type:'Última missão lunar Apollo',
    summary:'Último pouso lunar do programa e primeira missão a levar um cientista-geólogo à superfície.',
    dsLink:'especialização de usuários, ciência de campo e dados multimodais',
    source:'https://www.nasa.gov/mission/apollo-17/'
  }
];

export const AGC_SPEC = {
  label:'Apollo Guidance Computer — modelo didático',
  erasableWords:2048,
  fixedWords:36864,
  wordBits:16,
  cycleBudget:100,
  note:'A plataforma simplifica instruções, escalonamento e memória para fins educacionais; não emula o AGC real.'
};

export const APOLLO_TASKS = [
  { id:'guidance', label:'Orientação e navegação', priority:1, cycles:34, erasableWords:310, critical:true, description:'Atualiza posição, velocidade e comandos de orientação.' },
  { id:'engine', label:'Controle do motor de descida', priority:1, cycles:25, erasableWords:220, critical:true, description:'Mantém empuxo e perfil de descida dentro dos limites.' },
  { id:'display', label:'DSKY e alertas', priority:2, cycles:12, erasableWords:96, critical:true, description:'Apresenta dados à tripulação e recebe comandos.' },
  { id:'radar-altitude', label:'Radar de altitude', priority:2, cycles:15, erasableWords:140, critical:true, description:'Processa altitude, velocidade vertical e qualidade do eco.' },
  { id:'telemetry', label:'Telemetria', priority:3, cycles:10, erasableWords:120, critical:false, description:'Empacota dados para o centro de controle.' },
  { id:'rendezvous-radar', label:'Radar de encontro', priority:4, cycles:32, erasableWords:260, critical:false, description:'Processamento secundário que pode causar sobrecarga no cenário didático.' },
  { id:'science', label:'Registro científico', priority:5, cycles:18, erasableWords:180, critical:false, description:'Armazena observações não essenciais durante a descida.' }
];

export const ASSEMBLY_INSTRUCTIONS = [
  { mnemonic:'LOAD', args:'REG VALUE', cost:2, description:'Carrega um valor em um registrador.' },
  { mnemonic:'READ', args:'REG SENSOR', cost:4, description:'Lê ALT, VSPD, HSPD, FUEL ou HAZARD.' },
  { mnemonic:'CMP', args:'REG VALUE', cost:2, description:'Compara um registrador com um valor.' },
  { mnemonic:'JGT', args:'LABEL', cost:2, description:'Salta se o resultado for maior.' },
  { mnemonic:'JLT', args:'LABEL', cost:2, description:'Salta se o resultado for menor.' },
  { mnemonic:'SET', args:'ACTUATOR VALUE', cost:4, description:'Ajusta THROTTLE, PITCH ou MODE.' },
  { mnemonic:'STORE', args:'ADDRESS REG', cost:3, description:'Grava na memória apagável.' },
  { mnemonic:'ALARM', args:'CODE', cost:3, description:'Emite um alarme didático.' },
  { mnemonic:'END', args:'', cost:1, description:'Finaliza o ciclo.' }
];

export const ASSEMBLY_CHALLENGES = [
  {
    id:'descent-brake', label:'Frenagem por altitude', xp:170,
    prompt:'Quando a altitude estiver abaixo de 1.500 m, reduza a velocidade vertical com 58% de throttle.',
    required:['READ ALT ALT','CMP ALT 1500','JLT BRAKE','SET THROTTLE 58','END']
  },
  {
    id:'fuel-guard', label:'Proteção de combustível', xp:170,
    prompt:'Quando o combustível ficar abaixo de 12%, emita o alarme 0901 e selecione o modo ABORT.',
    required:['READ FUEL FUEL','CMP FUEL 12','JLT LOWFUEL','ALARM 0901','SET MODE ABORT','END']
  },
  {
    id:'hazard-avoid', label:'Desvio de obstáculo', xp:170,
    prompt:'Quando o risco do terreno ultrapassar 60, ajuste o pitch lateral para 18.',
    required:['READ HAZARD HAZARD','CMP HAZARD 60','JGT AVOID','SET PITCH 18','END']
  }
];

export const LANDING_SITES = [
  { id:'tranquility', label:'Mar da Tranquilidade', slope:3, hazard:22, illumination:82, distanceKm:0, description:'Área ampla, relativamente plana e adequada ao primeiro treinamento.' },
  { id:'fra-mauro', label:'Fra Mauro', slope:8, hazard:48, illumination:68, distanceKm:5.8, description:'Terreno ondulado que exige correções durante a aproximação.' },
  { id:'taurus-littrow', label:'Taurus–Littrow', slope:11, hazard:61, illumination:74, distanceKm:9.4, description:'Vale científico com maior complexidade de relevo e planejamento.' }
];

export const LUNAR_CHECKLIST = [
  { id:'separation', label:'Separação do módulo lunar', subsystem:'Acoplamento', detail:'Travas, umbilicais e orientação relativa validadas.' },
  { id:'computer', label:'Computador de orientação', subsystem:'Software', detail:'Programas, memória apagável e fila de tarefas verificados.' },
  { id:'radar', label:'Radar de pouso', subsystem:'Sensores', detail:'Altitude e velocidade vertical com canais concordantes.' },
  { id:'engine', label:'Motor de descida', subsystem:'Propulsão', detail:'Throttle, válvulas e reserva de propelente disponíveis.' },
  { id:'site', label:'Local de pouso', subsystem:'Navegação', detail:'Iluminação, relevo, risco e rota de desvio avaliados.' },
  { id:'abort', label:'Sistema de abortagem', subsystem:'Segurança', detail:'Estágio de subida e trajetória de retorno disponíveis.' }
];

export const APOLLO_ALARMS = [
  {
    id:'1201', label:'Alarme 1201', cause:'Fila executiva sem espaço suficiente para iniciar uma nova tarefa.',
    correct:'prioritize', xp:220,
    options:[
      { id:'shutdown', label:'Desligar imediatamente o computador' },
      { id:'prioritize', label:'Preservar tarefas críticas e reiniciar tarefas secundárias' },
      { id:'ignore', label:'Ignorar todos os alarmes e aumentar a carga' }
    ]
  },
  {
    id:'1202', label:'Alarme 1202', cause:'Sobrecarga de processamento causada por tarefas adicionais no cenário didático.',
    correct:'prioritize', xp:220,
    options:[
      { id:'prioritize', label:'Executar orientação, motor e display por prioridade' },
      { id:'all-equal', label:'Dividir o processador igualmente entre todas as tarefas' },
      { id:'erase', label:'Apagar toda a memória fixa durante o voo' }
    ]
  }
];

export const SURFACE_OBJECTIVES = [
  { id:'egress', label:'Saída e inspeção do módulo', xp:90, energy:5, minutes:18, description:'Validar escada, traje, comunicações e integridade externa.' },
  { id:'sample-basalt', label:'Coletar amostra basáltica', xp:120, energy:9, minutes:25, sample:'Basalto lunar', description:'Registrar fotografia, posição, massa e recipiente.' },
  { id:'deploy-seismometer', label:'Instalar sismômetro', xp:130, energy:12, minutes:30, instrument:'Sismômetro', description:'Nivelar o instrumento e confirmar telemetria.' },
  { id:'rover-traverse', label:'Percurso com rover', xp:150, energy:18, minutes:40, roverKm:4.6, description:'Planejar rota, consumo, inclinação e retorno seguro.' },
  { id:'sample-regolith', label:'Coletar regolito', xp:120, energy:8, minutes:22, sample:'Regolito lunar', description:'Coletar material superficial e registrar contexto.' },
  { id:'return-lm', label:'Retornar ao módulo lunar', xp:90, energy:6, minutes:15, description:'Fechar inventário, guardar amostras e preparar ascensão.' }
];

export const LUNAR_STATE_LABELS = {
  ORBIT:'Órbita lunar', SEPARATION:'Separação', PDI:'Início da descida', BRAKING:'Frenagem', APPROACH:'Aproximação',
  FINAL:'Descida final', LANDED:'Pouso confirmado', ASCENT:'Ascensão', ABORTED:'Abortagem', CRASHED:'Impacto', PAUSED:'Pausada'
};

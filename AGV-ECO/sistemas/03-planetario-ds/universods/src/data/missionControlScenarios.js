export const MISSION_CONTROL_SCENARIOS = [
  {
    id: 'thermal-drift',
    level: 1,
    title: 'Deriva térmica',
    subtitle: 'Redundância de sensores',
    icon: '◒',
    color: '#ff9f6e',
    brief: 'O sensor térmico B começa a divergir gradualmente do sensor A e do modelo estimado.',
    objective: 'Comparar fontes, isolar o canal inconsistente e manter a operação em redundância degradada.',
    symptoms: ['temperatura B crescente', 'sensor A estável', 'telemetria ainda disponível'],
    correctResolution: 'isolate-sensor-b',
    resolutionLabel: 'Isolar sensor B',
    xp: 120,
    dsConcepts: ['validação', 'redundância', 'tratamento de falhas']
  },
  {
    id: 'queue-overflow',
    level: 2,
    title: 'Fila saturada',
    subtitle: 'Backpressure e prioridade',
    icon: '▤',
    color: '#ffd66e',
    brief: 'Pacotes científicos de baixa prioridade chegam mais rápido do que o processador consegue consumir.',
    objective: 'Ativar backpressure, preservar mensagens críticas e recuperar a latência operacional.',
    symptoms: ['fila acima de 80%', 'latência crescente', 'telemetria crítica competindo por processamento'],
    correctResolution: 'activate-backpressure',
    resolutionLabel: 'Ativar backpressure',
    xp: 140,
    dsConcepts: ['filas', 'prioridade', 'controle de fluxo']
  },
  {
    id: 'packet-loss',
    level: 3,
    title: 'Perda de pacotes',
    subtitle: 'Confiabilidade de comunicação',
    icon: '⌁',
    color: '#7ec8ff',
    brief: 'O link de dados apresenta rajadas de perda e confirmações chegam fora da ordem.',
    objective: 'Habilitar retransmissão seletiva sem duplicar comandos já confirmados.',
    symptoms: ['link abaixo de 72%', 'sequências ausentes', 'latência variável'],
    correctResolution: 'selective-retry',
    resolutionLabel: 'Retransmissão seletiva',
    xp: 160,
    dsConcepts: ['protocolos', 'idempotência', 'retransmissão']
  },
  {
    id: 'power-sag',
    level: 4,
    title: 'Queda de energia',
    subtitle: 'Degradação controlada',
    icon: 'ϟ',
    color: '#d29cff',
    brief: 'A tensão do barramento cai e subsistemas não essenciais ameaçam a reserva crítica.',
    objective: 'Aplicar shedding de carga, preservar navegação e manter o computador de voo estável.',
    symptoms: ['tensão abaixo de 25 V', 'consumo elevado', 'reserva crítica em queda'],
    correctResolution: 'shed-noncritical',
    resolutionLabel: 'Desligar cargas não críticas',
    xp: 180,
    dsConcepts: ['priorização', 'fail-safe', 'degradação graciosa']
  }
];

export const FLIGHT_STATES = [
  { id: 'STANDBY', label: 'Espera', icon: '○' },
  { id: 'CHECKLIST', label: 'Checklist', icon: '✓' },
  { id: 'COUNTDOWN', label: 'Contagem', icon: '10' },
  { id: 'IGNITION', label: 'Ignição', icon: 'ϟ' },
  { id: 'ASCENT', label: 'Subida', icon: '▲' },
  { id: 'ORBIT', label: 'Órbita', icon: '◎' },
  { id: 'DEPLOYMENT', label: 'Liberação', icon: '◇' }
];

export const FLIGHT_TRANSITIONS = [
  { from: 'STANDBY', action: 'BEGIN_CHECKLIST', to: 'CHECKLIST', label: 'Iniciar checklist' },
  { from: 'CHECKLIST', action: 'ARM_COUNTDOWN', to: 'COUNTDOWN', label: 'Armar contagem' },
  { from: 'COUNTDOWN', action: 'START_IGNITION', to: 'IGNITION', label: 'Iniciar ignição' },
  { from: 'IGNITION', action: 'CONFIRM_LIFTOFF', to: 'ASCENT', label: 'Confirmar decolagem' },
  { from: 'ASCENT', action: 'INSERT_ORBIT', to: 'ORBIT', label: 'Inserir em órbita' },
  { from: 'ORBIT', action: 'DEPLOY_PAYLOAD', to: 'DEPLOYMENT', label: 'Liberar carga' }
];

export const RESOLUTION_OPTIONS = [
  { id: 'restart-all', label: 'Reiniciar todos os computadores', risk: 'alto' },
  { id: 'isolate-sensor-b', label: 'Isolar sensor B', risk: 'baixo' },
  { id: 'activate-backpressure', label: 'Ativar backpressure', risk: 'baixo' },
  { id: 'drop-critical', label: 'Descartar mensagens críticas', risk: 'crítico' },
  { id: 'selective-retry', label: 'Retransmissão seletiva', risk: 'baixo' },
  { id: 'retry-everything', label: 'Retransmitir tudo continuamente', risk: 'alto' },
  { id: 'shed-noncritical', label: 'Desligar cargas não críticas', risk: 'baixo' },
  { id: 'disable-navigation', label: 'Desligar navegação', risk: 'crítico' }
];

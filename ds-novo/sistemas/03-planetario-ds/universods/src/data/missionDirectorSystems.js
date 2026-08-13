export const MISSION_MODULES = [
  { id:'academy', label:'Academia Espacial DS', icon:'◈', color:'#55dcff' },
  { id:'mission-control-advanced', label:'Centro de Controle Avançado', icon:'◉', color:'#7f9cff' },
  { id:'earth', label:'Terra, Satélites e Órbitas', icon:'◎', color:'#63e6a8' },
  { id:'launch', label:'Foguetes e Lançamentos', icon:'▲', color:'#ff9d5c' },
  { id:'moon', label:'Lua e Apollo', icon:'◐', color:'#d8e2f0' },
  { id:'mars', label:'Marte e Robótica', icon:'●', color:'#ff755f' },
  { id:'station', label:'Estação Espacial', icon:'✣', color:'#9ee8ff' },
  { id:'observatory', label:'Observatório e Universo Profundo', icon:'✧', color:'#ba8cff' }
];

export const MISSION_TEMPLATES = [
  {
    id:'orbital-systems', title:'Operação Orbital Segura', moduleId:'earth', durationMinutes:30, difficulty:'intermediate',
    objective:'Projetar um satélite, selecionar a órbita, validar energia e concluir uma janela de comunicação.',
    checkpoints:[
      { id:'orbit-choice', title:'Justificar a órbita escolhida', evidence:'Decisão registrada com período e cobertura.' },
      { id:'satellite-validation', title:'Validar o satélite', evidence:'Massa, energia e downlink aprovados.' },
      { id:'ground-contact', title:'Concluir contato de solo', evidence:'Estação, link e dados transmitidos.' },
      { id:'orbital-reflection', title:'Registrar reflexão técnica', evidence:'Trade-offs de software e comunicação.' }
    ]
  },
  {
    id:'launch-critical', title:'Lançamento e Sistemas Críticos', moduleId:'launch', durationMinutes:35, difficulty:'advanced',
    objective:'Configurar um veículo, executar intertravamentos e alcançar inserção orbital sem ignorar falhas.',
    checkpoints:[
      { id:'vehicle-design', title:'Validar arquitetura do veículo', evidence:'T/W, Δv, massa e redundância.' },
      { id:'launch-checklist', title:'Concluir checklist', evidence:'Oito intertravamentos aprovados.' },
      { id:'max-q', title:'Atravessar Max Q', evidence:'Telemetria e procedimento registrados.' },
      { id:'orbit-insertion', title:'Alcançar órbita', evidence:'Estado final e combustível residual.' }
    ]
  },
  {
    id:'apollo-computing', title:'Apollo: Prioridades e Pouso', moduleId:'moon', durationMinutes:40, difficulty:'advanced',
    objective:'Relacionar memória, prioridades e alarmes do computador didático com uma descida lunar segura.',
    checkpoints:[
      { id:'agc-priority', title:'Resolver sobrecarga de tarefas', evidence:'Alarme e reinício prioritário.' },
      { id:'assembly-task', title:'Executar programa Assembly', evidence:'Atuador acionado pelo algoritmo.' },
      { id:'lunar-checklist', title:'Validar descida', evidence:'Intertravamentos da missão.' },
      { id:'lunar-landing', title:'Pousar com segurança', evidence:'Velocidade e combustível final.' },
      { id:'surface-science', title:'Concluir ciência de superfície', evidence:'Amostras e instrumento registrados.' }
    ]
  },
  {
    id:'mars-autonomy', title:'Marte: Autonomia e Ciência', moduleId:'mars', durationMinutes:45, difficulty:'advanced',
    objective:'Planejar uma rota, operar com atraso, classificar amostras e preservar energia do rover.',
    checkpoints:[
      { id:'mars-route', title:'Planejar rota A*', evidence:'Custo, risco e nós visitados.' },
      { id:'command-delay', title:'Operar fila com atraso', evidence:'ACK, prioridade e idempotência.' },
      { id:'sample-classification', title:'Classificar amostra', evidence:'Classe, confiança e atributos.' },
      { id:'science-database', title:'Registrar no banco científico', evidence:'Proveniência e coordenadas.' },
      { id:'rover-recovery', title:'Recuperar uma falha', evidence:'Procedimento e telemetria final.' }
    ]
  },
  {
    id:'station-operations', title:'Estação: Operação Integrada', moduleId:'station', durationMinutes:35, difficulty:'intermediate',
    objective:'Coordenar acoplamento, suporte à vida, braço robótico e manutenção orbital.',
    checkpoints:[
      { id:'docking', title:'Concluir acoplamento', evidence:'Alinhamento e captura rígida.' },
      { id:'life-support', title:'Estabilizar suporte à vida', evidence:'O₂, CO₂, pressão e temperatura.' },
      { id:'robotic-arm', title:'Operar braço robótico', evidence:'Carga capturada e fixada.' },
      { id:'maintenance', title:'Registrar manutenção', evidence:'Peça consumida e histórico.' }
    ]
  },
  {
    id:'deep-space-data', title:'Universo Profundo: Luz em Dados', moduleId:'observatory', durationMinutes:30, difficulty:'intermediate',
    objective:'Selecionar instrumento, processar imagem, identificar espectro e preservar a observação.',
    checkpoints:[
      { id:'instrument-choice', title:'Escolher instrumento', evidence:'Faixa compatível com o alvo.' },
      { id:'image-pipeline', title:'Processar imagem', evidence:'Exposição, calibração e SNR.' },
      { id:'spectrum', title:'Identificar espectro', evidence:'Linhas e confiança.' },
      { id:'observation-record', title:'Registrar observação', evidence:'Metadados e proveniência.' }
    ]
  },
  {
    id:'capstone-cosmos', title:'Missão Integrada COSMOS DS', moduleId:'mission-control-advanced', durationMinutes:50, difficulty:'capstone',
    objective:'Integrar requisitos, estados, telemetria, tolerância a falhas e evidências em uma operação multidisciplinar.',
    checkpoints:[
      { id:'requirements', title:'Definir requisitos e riscos', evidence:'Escopo, restrições e critérios.' },
      { id:'architecture', title:'Mapear arquitetura', evidence:'Entradas, processamento, saídas e persistência.' },
      { id:'operations', title:'Executar operação', evidence:'Estados e telemetria.' },
      { id:'failure', title:'Diagnosticar falha', evidence:'Causa raiz e recuperação.' },
      { id:'evidence', title:'Consolidar evidências', evidence:'Relatório final rastreável.' }
    ]
  }
];

export const DIFFICULTIES = [
  { id:'guided', label:'Guiada', description:'Mais dicas, confirmação de ações e recuperação assistida.' },
  { id:'intermediate', label:'Intermediária', description:'Ajuda contextual e decisões técnicas obrigatórias.' },
  { id:'advanced', label:'Avançada', description:'Pouca assistência, falhas e telemetria completa.' },
  { id:'capstone', label:'Projeto final', description:'Integração de módulos, relatório e justificativas.' }
];

export const CONTROL_ACTIONS = [
  ['Mover / navegar','WASD ou joystick esquerdo'],
  ['Olhar em 360°','Mouse, toque ou joystick direito'],
  ['Interagir','E, Enter ou botão contextual'],
  ['Pausar','Esc ou botão Pausa'],
  ['Abrir objetivo','O'],
  ['Alternar alto contraste','Alt + C'],
  ['Alternar texto ampliado','Alt + T'],
  ['Tela cheia','F'],
  ['Recentrar câmera','R']
];

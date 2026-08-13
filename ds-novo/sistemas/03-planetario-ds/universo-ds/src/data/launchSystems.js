export const LAUNCH_MISSIONS = [
  { id:'leo-lab', label:'Laboratório em órbita baixa', orbit:'LEO 400 km', requiredDeltaV:9300, maxPayloadKg:14500, inclination:28.5, description:'Levar um laboratório modular a uma órbita circular baixa.' },
  { id:'polar-observer', label:'Observador polar', orbit:'Polar 650 km', requiredDeltaV:9650, maxPayloadKg:9800, inclination:97.8, description:'Inserir um satélite de observação em órbita quase polar.' },
  { id:'transfer-relay', label:'Relé em transferência alta', orbit:'Transferência elíptica', requiredDeltaV:10450, maxPayloadKg:6200, inclination:18, description:'Enviar um relé de comunicações para uma órbita de transferência.' },
  { id:'lunar-demo', label:'Demonstração translunar', orbit:'Trajetória lunar didática', requiredDeltaV:11600, maxPayloadKg:2800, inclination:28.5, description:'Validar navegação e estágio superior em uma trajetória de alta energia.' }
];

export const FIRST_STAGES = [
  { id:'core-l1', label:'Núcleo L1', dryMassKg:21000, propellantKg:205000, thrustN:3_650_000, ispS:304, burnSeconds:171, maxPayloadKg:11000, engines:7, diameterM:3.2, description:'Primeiro estágio compacto para missões leves e médias.' },
  { id:'core-h2', label:'Núcleo H2', dryMassKg:30500, propellantKg:335000, thrustN:6_100_000, ispS:318, burnSeconds:182, maxPayloadKg:18500, engines:9, diameterM:4.1, description:'Núcleo de maior empuxo, margem estrutural e capacidade de propelente.' },
  { id:'core-r3', label:'Núcleo R3 reutilizável', dryMassKg:36000, propellantKg:315000, thrustN:5_850_000, ispS:321, burnSeconds:176, maxPayloadKg:15500, engines:9, diameterM:4.1, recoveryReserveKg:42000, description:'Reserva propelente para manobra de retorno e pouso simulado.' }
];

export const UPPER_STAGES = [
  { id:'upper-c', label:'Estágio superior C', dryMassKg:4700, propellantKg:42000, thrustN:610000, ispS:358, burnSeconds:345, maxPayloadKg:9500, description:'Estágio criogênico leve para órbitas baixas e polares.' },
  { id:'upper-v', label:'Estágio superior V', dryMassKg:6200, propellantKg:71000, thrustN:890000, ispS:372, burnSeconds:410, maxPayloadKg:16000, description:'Maior autonomia e impulso específico para transferências energéticas.' },
  { id:'upper-deep', label:'Estágio Deep', dryMassKg:5400, propellantKg:59000, thrustN:720000, ispS:389, burnSeconds:470, maxPayloadKg:6500, description:'Otimizado para longa queima no vácuo e missões de alta energia.' }
];

export const PAYLOADS = [
  { id:'edu-cube', label:'Constelação educacional', massKg:1200, powerW:900, dataMbps:45, type:'satellite', description:'Conjunto de pequenos satélites e dispensador modular.' },
  { id:'orbital-lab', label:'Laboratório orbital', massKg:7800, powerW:4200, dataMbps:180, type:'station', description:'Módulo científico pressurizado com experimentos automatizados.' },
  { id:'polar-eye', label:'Observador multiespectral', massKg:4200, powerW:2800, dataMbps:620, type:'observation', description:'Carga de observação com grande volume de imagens.' },
  { id:'relay-x', label:'Relé de comunicações', massKg:5100, powerW:5100, dataMbps:1100, type:'communications', description:'Antenas de alto ganho e processamento de sinais.' },
  { id:'lunar-probe', label:'Sonda lunar demonstradora', massKg:2400, powerW:1900, dataMbps:90, type:'deep-space', description:'Sonda leve para testar navegação e comunicação de longa distância.' }
];

export const GUIDANCE_SYSTEMS = [
  { id:'basic', label:'GNC básico', massKg:240, reliability:0.91, guidanceGain:.9, redundancy:1, description:'Computador único com sensores essenciais.' },
  { id:'dual', label:'GNC redundante duplo', massKg:420, reliability:0.975, guidanceGain:1.0, redundancy:2, description:'Dois computadores de voo e votação entre sensores.' },
  { id:'triple', label:'GNC tolerante a falhas', massKg:680, reliability:0.996, guidanceGain:1.04, redundancy:3, description:'Três canais, votação majoritária e modo autônomo.' }
];

export const FAIRINGS = [
  { id:'compact', label:'Coifa compacta', massKg:1250, maxPayloadKg:5200, dragAreaM2:8.4, description:'Menor massa e arrasto para cargas compactas.' },
  { id:'standard', label:'Coifa padrão', massKg:2050, maxPayloadKg:10500, dragAreaM2:12.5, description:'Equilíbrio entre volume, massa e proteção.' },
  { id:'extended', label:'Coifa estendida', massKg:3250, maxPayloadKg:19000, dragAreaM2:17.8, description:'Maior volume interno e área aerodinâmica.' }
];

export const LAUNCH_SITES = [
  { id:'alcantara', label:'Centro Equatorial Atlântico', latitude:-2.37, rotationBonusMs:460, weatherRisk:.12, description:'Local didático inspirado em lançamentos próximos ao Equador.' },
  { id:'coastal', label:'Base Costeira Norte', latitude:28.5, rotationBonusMs:405, weatherRisk:.18, description:'Corredor oriental para missões de baixa inclinação.' },
  { id:'polar', label:'Base Polar Sul', latitude:-34.7, rotationBonusMs:300, weatherRisk:.22, description:'Corredor dedicado a órbitas polares e heliossíncronas.' }
];

export const LAUNCH_CHECKLIST = [
  { id:'mission', label:'Perfil da missão', subsystem:'Planejamento', detail:'Carga, órbita e margem de desempenho validadas.' },
  { id:'structure', label:'Estrutura e coifa', subsystem:'Veículo', detail:'Massa e dimensões dentro dos limites.' },
  { id:'propulsion', label:'Propulsão', subsystem:'Motores', detail:'Empuxo, propelente e reserva disponíveis.' },
  { id:'guidance', label:'Software de voo', subsystem:'GNC', detail:'Máquina de estados, navegação e redundância prontas.' },
  { id:'telemetry', label:'Telemetria', subsystem:'Comunicação', detail:'Pacotes, relógio e estações de solo sincronizados.' },
  { id:'range', label:'Segurança de área', subsystem:'Operação', detail:'Corredor e sistema de abortagem liberados.' },
  { id:'weather', label:'Condições atmosféricas', subsystem:'Ambiente', detail:'Vento, chuva e eletricidade atmosférica aceitáveis.' },
  { id:'power', label:'Energia interna', subsystem:'Aviônica', detail:'Baterias, barramentos e cargas críticas estáveis.' }
];

export const LAUNCH_FAULTS = [
  {
    id:'engine-loss', label:'Perda parcial de empuxo', trigger:'Um motor reduz desempenho durante a subida.',
    options:[
      { id:'continue-blind', label:'Manter plano sem recalcular' },
      { id:'recalculate-burn', label:'Recalcular queima e trajetória' },
      { id:'shutdown-all', label:'Desligar todos os motores imediatamente' }
    ], answer:'recalculate-burn', xp:180, concept:'controle adaptativo e replanejamento'
  },
  {
    id:'sensor-drift', label:'Deriva no sensor de altitude', trigger:'Um canal passa a divergir dos demais.',
    options:[
      { id:'trust-single', label:'Confiar apenas no canal divergente' },
      { id:'cross-validate', label:'Votar sensores e isolar o canal' },
      { id:'disable-guidance', label:'Desativar toda a navegação' }
    ], answer:'cross-validate', xp:180, concept:'redundância e votação majoritária'
  },
  {
    id:'max-q', label:'Pressão dinâmica elevada', trigger:'O veículo se aproxima do limite estrutural no Max Q.',
    options:[
      { id:'throttle-up', label:'Aumentar o acelerador' },
      { id:'throttle-down', label:'Reduzir empuxo temporariamente' },
      { id:'deploy-fairing', label:'Liberar a coifa na atmosfera densa' }
    ], answer:'throttle-down', xp:180, concept:'controle de envelope estrutural'
  },
  {
    id:'link-loss', label:'Perda de comunicação', trigger:'O enlace com a estação de solo é interrompido.',
    options:[
      { id:'autonomous-guidance', label:'Manter orientação autônoma e armazenar dados' },
      { id:'random-command', label:'Enviar comandos repetidos sem confirmação' },
      { id:'power-off', label:'Desligar o computador de voo' }
    ], answer:'autonomous-guidance', xp:180, concept:'autonomia e operação degradada'
  }
];

export const LAUNCH_STATE_LABELS = {
  PRELAUNCH:'Pré-lançamento', COUNTDOWN:'Contagem regressiva', IGNITION:'Ignição', ASCENT_STAGE_1:'Subida · estágio 1',
  MAX_Q:'Max Q', STAGE_SEPARATION:'Separação', ASCENT_STAGE_2:'Subida · estágio 2', ORBIT_INSERTION:'Inserção orbital',
  ORBIT:'Órbita', ABORTED:'Abortada', FAILED:'Falha'
};

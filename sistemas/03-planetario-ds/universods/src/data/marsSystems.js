export const MARS_TIMELINE = [
  { id:'viking', year:1976, label:'Viking 1 e 2', type:'Pouso e laboratório', summary:'Plataformas estacionárias combinaram imagens, meteorologia e experimentos de superfície.', dsLink:'aquisição de dados, redundância e software embarcado', source:'https://science.nasa.gov/mission/viking/' },
  { id:'sojourner', year:1997, label:'Sojourner', type:'Primeiro rover marciano', summary:'Um pequeno rover demonstrou mobilidade e operação robótica na superfície de Marte.', dsLink:'teleoperação, comandos discretos e validação incremental', source:'https://science.nasa.gov/mission/mars-pathfinder/' },
  { id:'mer', year:2004, label:'Spirit e Opportunity', type:'Exploração de longa duração', summary:'Rovers gêmeos ampliaram a autonomia, a navegação e a ciência geológica móvel.', dsLink:'componentes reutilizáveis, tolerância a falhas e planejamento de rota', source:'https://science.nasa.gov/mission/mer-spirit/' },
  { id:'curiosity', year:2012, label:'Curiosity', type:'Laboratório móvel', summary:'Um rover de grande porte integrou câmeras, braço robótico, perfuração e laboratório científico.', dsLink:'arquitetura distribuída, filas de tarefas e banco científico', source:'https://science.nasa.gov/mission/msl-curiosity/' },
  { id:'insight', year:2018, label:'InSight', type:'Geofísica estacionária', summary:'Uma plataforma especializada estudou o interior do planeta com instrumentos dedicados.', dsLink:'sensores, séries temporais e monitoramento de integridade', source:'https://science.nasa.gov/mission/insight/' },
  { id:'perseverance', year:2021, label:'Perseverance', type:'Amostras e autonomia', summary:'O rover executa ciência, navegação autônoma e preparação de amostras para estudos futuros.', dsLink:'visão computacional, autonomia, cache e rastreabilidade', source:'https://science.nasa.gov/mission/mars-2020-perseverance/' },
  { id:'ingenuity', year:2021, label:'Ingenuity', type:'Voo em outro planeta', summary:'O helicóptero demonstrou voo controlado e reconhecimento aéreo em atmosfera rarefeita.', dsLink:'controle em tempo real, sensores inerciais e missão experimental', source:'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/' }
];

export const MARS_MISSIONS = [
  { id:'geology', label:'Cartografia geológica', target:'delta', energyBudget:74, dataBudgetMb:680, sampleGoal:2, description:'Mapear camadas, selecionar rochas e registrar contexto visual.' },
  { id:'habitability', label:'Habitabilidade antiga', target:'clay-ridge', energyBudget:82, dataBudgetMb:920, sampleGoal:3, description:'Priorizar argilas, sulfatos e estruturas sedimentares.' },
  { id:'engineering', label:'Teste de autonomia', target:'autonomy-field', energyBudget:65, dataBudgetMb:420, sampleGoal:1, description:'Validar A*, detecção de risco, fila de comandos e retorno seguro.' }
];

export const MARS_FAULTS = [
  { id:'wheel-slip', label:'Patinagem elevada', symptom:'odometria diverge da posição visual', answer:'traction-control', concept:'controle de tração e replanejamento', xp:190, options:[
    { id:'speed-up', label:'Aumentar velocidade para atravessar rapidamente' },
    { id:'traction-control', label:'Reduzir torque, estimar escorregamento e replanejar' },
    { id:'ignore-odometry', label:'Ignorar odometria e manter comandos' }
  ]},
  { id:'dust-storm', label:'Tempestade de poeira', symptom:'energia solar e contraste visual reduzidos', answer:'safe-power', concept:'modo seguro e orçamento energético', xp:190, options:[
    { id:'safe-power', label:'Suspender cargas, preservar aquecimento e aguardar' },
    { id:'full-science', label:'Ativar todos os instrumentos simultaneamente' },
    { id:'disable-heaters', label:'Desligar aquecedores para economizar energia' }
  ]},
  { id:'packet-loss', label:'Perda de pacotes', symptom:'comandos sem confirmação e risco de duplicação', answer:'idempotent-retry', concept:'idempotência e confirmação', xp:190, options:[
    { id:'flood', label:'Reenviar continuamente sem identificador' },
    { id:'idempotent-retry', label:'Usar ID, ACK, timeout e repetição idempotente' },
    { id:'skip-acks', label:'Desativar confirmações para reduzir latência' }
  ]},
  { id:'thermal', label:'Temperatura crítica', symptom:'atuadores e computador próximos do limite', answer:'thermal-safe', concept:'proteção térmica e operação degradada', xp:190, options:[
    { id:'thermal-safe', label:'Interromper movimento, aquecer seletivamente e reavaliar' },
    { id:'max-drive', label:'Dirigir em potência máxima para gerar calor' },
    { id:'reboot-all', label:'Reiniciar todos os subsistemas sem salvar estado' }
  ]}
];

export const TERRAIN_TYPES = {
  plain:{ id:'plain', label:'Planície compacta', cost:1, risk:8, color:'#a95e3f' },
  sand:{ id:'sand', label:'Areia solta', cost:3.2, risk:38, color:'#d58a55' },
  rock:{ id:'rock', label:'Campo rochoso', cost:4.4, risk:52, color:'#70473c' },
  slope:{ id:'slope', label:'Inclinação', cost:2.6, risk:31, color:'#bb7150' },
  science:{ id:'science', label:'Alvo científico', cost:1.5, risk:12, color:'#55dcff' },
  blocked:{ id:'blocked', label:'Obstáculo', cost:Infinity, risk:100, color:'#171a24' }
};

export const DEFAULT_MARS_GRID = [
  ['plain','plain','plain','slope','sand','sand','plain','plain','plain','rock','plain','plain'],
  ['plain','rock','plain','slope','sand','rock','plain','slope','plain','rock','plain','plain'],
  ['plain','rock','plain','plain','plain','rock','plain','slope','plain','plain','plain','science'],
  ['plain','plain','sand','sand','plain','plain','plain','slope','rock','rock','plain','plain'],
  ['rock','plain','sand','rock','rock','blocked','blocked','plain','plain','sand','sand','plain'],
  ['plain','plain','plain','plain','slope','blocked','plain','plain','rock','sand','plain','plain'],
  ['plain','rock','rock','plain','slope','plain','plain','sand','sand','plain','plain','rock'],
  ['plain','plain','rock','plain','plain','plain','rock','rock','plain','plain','science','plain'],
  ['sand','plain','plain','plain','rock','plain','plain','plain','plain','slope','slope','plain'],
  ['sand','sand','rock','plain','rock','rock','plain','sand','plain','plain','plain','plain'],
  ['plain','plain','plain','plain','plain','rock','plain','sand','sand','rock','plain','science'],
  ['plain','rock','plain','plain','plain','plain','plain','plain','sand','plain','plain','plain']
];

export const VISION_SAMPLES = [
  { id:'sample-basalt', label:'Rocha escura vesicular', expected:'basalt', features:{ red:42, green:35, blue:31, texture:78, layers:12, reflective:18 }, context:'Fragmento escuro próximo a fluxo antigo.', xp:120 },
  { id:'sample-clay', label:'Camada clara fina', expected:'clay', features:{ red:67, green:55, blue:46, texture:28, layers:88, reflective:22 }, context:'Afloramento estratificado em região de interesse.', xp:120 },
  { id:'sample-sulfate', label:'Veio brilhante', expected:'sulfate', features:{ red:74, green:69, blue:61, texture:41, layers:57, reflective:82 }, context:'Material claro preenchendo uma fratura.', xp:120 },
  { id:'sample-meteorite', label:'Objeto metálico isolado', expected:'meteorite', features:{ red:36, green:37, blue:39, texture:63, layers:8, reflective:91 }, context:'Objeto compacto sobre terreno plano.', xp:120 }
];

export const SAMPLE_LABELS = {
  basalt:'Basalto', clay:'Argila', sulfate:'Sulfato', meteorite:'Meteorito', unknown:'Inconclusivo'
};

export const ROVER_COMMANDS = [
  { id:'drive', label:'Dirigir', args:'x, y', description:'Segue uma rota validada até uma célula de destino.' },
  { id:'turn', label:'Girar', args:'graus', description:'Altera a orientação sem deslocamento.' },
  { id:'capture', label:'Capturar panorama', args:'qualidade', description:'Gera imagem e dados de contexto.' },
  { id:'sample', label:'Coletar amostra', args:'sampleId', description:'Aciona braço, documentação e armazenamento.' },
  { id:'wait', label:'Aguardar', args:'segundos', description:'Mantém o rover em estado estável.' },
  { id:'drone', label:'Lançar drone', args:'setor', description:'Executa reconhecimento aéreo do setor.' }
];

export const GROUND_DELAY_PROFILES = [
  { id:'training', label:'Treinamento acelerado', oneWaySeconds:4, description:'Latência reduzida para aula e depuração.' },
  { id:'realistic', label:'Atraso didático realista', oneWaySeconds:38, description:'Representa a necessidade de comandos em lote sem tornar a aula impraticável.' },
  { id:'challenge', label:'Janela degradada', oneWaySeconds:75, description:'Inclui atraso elevado e maior chance de perda.' }
];

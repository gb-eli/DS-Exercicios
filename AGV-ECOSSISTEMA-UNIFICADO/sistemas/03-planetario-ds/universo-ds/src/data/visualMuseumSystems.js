export const MUSEUM_ZONES = [
  { id:'launch', name:'Galeria de Lançamento', color:'#ff9b5e', description:'Foguetes, motores e veículos de subida.' },
  { id:'crew', name:'Galeria Tripulada', color:'#7adfff', description:'Cápsulas, módulo lunar, ônibus espacial e trajes.' },
  { id:'robotics', name:'Galeria Robótica', color:'#83f0b5', description:'Rovers, sondas, telescópios e satélites.' },
  { id:'orbital', name:'Galeria Orbital', color:'#b992ff', description:'Estações, módulos e infraestrutura em órbita.' }
];

export const MUSEUM_EXHIBITS = [
  { id:'saturn-class', zone:'launch', name:'Foguete lunar de três estágios', symbol:'▲', type:'rocket', color:'#ffb36b', scale:'110 m', interior:false, animation:'stage', description:'Veículo didático inspirado na arquitetura de grandes lançadores lunares.' },
  { id:'reusable-booster', zone:'launch', name:'Propulsor reutilizável', symbol:'⬆', type:'booster', color:'#71e5ff', scale:'70 m', interior:false, animation:'landing', description:'Primeiro estágio com pernas, aletas e sequência visual de pouso.' },
  { id:'command-capsule', zone:'crew', name:'Cápsula de comando', symbol:'⬟', type:'capsule', color:'#f2d5a2', scale:'4 m', interior:true, animation:'hatch', description:'Cabine compacta com assentos, painel e escudo térmico.' },
  { id:'lunar-module', zone:'crew', name:'Módulo lunar', symbol:'◇', type:'lander', color:'#d9c47f', scale:'7 m', interior:true, animation:'legs', description:'Estágios de descida e subida, pernas e cabine pressurizada.' },
  { id:'space-shuttle', zone:'crew', name:'Ônibus espacial didático', symbol:'▷', type:'shuttle', color:'#eaf4ff', scale:'37 m', interior:true, animation:'bay', description:'Orbiter alado com cabine e porão de carga visualizáveis.' },
  { id:'spacesuit', zone:'crew', name:'Traje de atividade extraveicular', symbol:'♙', type:'suit', color:'#f7fbff', scale:'2 m', interior:false, animation:'visor', description:'Traje pressurizado com mochila, viseira e articulações.' },
  { id:'mars-rover', zone:'robotics', name:'Rover científico marciano', symbol:'▦', type:'rover', color:'#d89056', scale:'3 m', interior:false, animation:'arm', description:'Seis rodas, suspensão, mastro, câmeras e braço robótico.' },
  { id:'space-telescope', zone:'robotics', name:'Telescópio espacial', symbol:'✧', type:'telescope', color:'#75c7ff', scale:'13 m', interior:false, animation:'mirror', description:'Espelho segmentado, protetor solar e instrumentos científicos.' },
  { id:'comms-satellite', zone:'robotics', name:'Satélite de comunicações', symbol:'⌁', type:'satellite', color:'#8ee9ff', scale:'8 m', interior:false, animation:'panels', description:'Barramento, antenas e painéis solares articulados.' },
  { id:'deep-space-probe', zone:'robotics', name:'Sonda de espaço profundo', symbol:'✦', type:'probe', color:'#ffd273', scale:'5 m', interior:false, animation:'dish', description:'Antena de alto ganho, instrumentos e gerador de energia.' },
  { id:'modular-station', zone:'orbital', name:'Estação modular', symbol:'✥', type:'station', color:'#74f1ca', scale:'109 m', interior:true, animation:'solar', description:'Módulos pressurizados, treliça, painéis e pontos de acoplamento.' },
  { id:'lunar-gateway', zone:'orbital', name:'Posto orbital lunar didático', symbol:'◈', type:'gateway', color:'#ae8dff', scale:'35 m', interior:true, animation:'orbit', description:'Configuração compacta para órbita cislunar e operações logísticas.' }
];

export const MUSEUM_CAMERAS = [
  { id:'walk', label:'Primeira pessoa', short:'1P' },
  { id:'orbit', label:'Inspeção 360°', short:'360' },
  { id:'interior', label:'Interior', short:'INT' },
  { id:'cinematic', label:'Tour cinematográfico', short:'CIN' }
];

export const MUSEUM_MISSIONS = [
  { id:'visit-zones', label:'Visitar as quatro galerias', target:4, xp:260 },
  { id:'inspect-six', label:'Inspecionar seis peças em 360°', target:6, xp:360 },
  { id:'open-interiors', label:'Abrir três interiores disponíveis', target:3, xp:300 },
  { id:'animate-five', label:'Ativar cinco mecanismos', target:5, xp:300 },
  { id:'complete-catalog', label:'Catalogar as doze peças', target:12, xp:500 }
];

export const EXHIBIT_BY_ID = Object.fromEntries(MUSEUM_EXHIBITS.map(item => [item.id, item]));
export const ZONE_BY_ID = Object.fromEntries(MUSEUM_ZONES.map(item => [item.id, item]));

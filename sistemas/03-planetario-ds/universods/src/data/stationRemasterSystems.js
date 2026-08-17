export const STATION_VARIANTS = [
  {
    id:'horizon-modular', name:'Horizon Modular', className:'Estação modular terrestre', symbol:'✣', variant:0,
    color:'#77dcff', description:'Laboratório orbital extenso com treliça, múltiplos módulos, cúpula e grandes painéis solares.',
    modules:['Laboratório','Cúpula','Habitação','Nó de acoplamento','Braço robótico'], scale:1,
    interior:'modular', orbitKm:408
  },
  {
    id:'skylab-heritage', name:'Skylab Heritage', className:'Laboratório orbital histórico', symbol:'▣', variant:1,
    color:'#f4c875', description:'Configuração compacta inspirada em laboratórios monolíticos, com oficina interna ampla e painel solar lateral.',
    modules:['Oficina orbital','Airlock','Observatório solar','Armazenamento'], scale:.82,
    interior:'workshop', orbitKm:435
  },
  {
    id:'gateway-lunar', name:'Gateway Lunar', className:'Posto orbital cislunar', symbol:'◇', variant:2,
    color:'#a7a2ff', description:'Posto avançado compacto com propulsão elétrica, habitat, logística e visão da Lua.',
    modules:['Habitat','Logística','Propulsão elétrica','Airlock científico'], scale:.68,
    interior:'gateway', orbitKm:70000
  },
  {
    id:'ring-alpha', name:'Research Ring Alpha', className:'Conceito didático de gravidade parcial', symbol:'◉', variant:3,
    color:'#74ffc3', description:'Estação conceitual com anel rotativo, núcleo central e docas radiais para estudar arquitetura futura.',
    modules:['Anel rotativo','Núcleo central','Docas radiais','Laboratórios'], scale:1.18,
    interior:'ring', orbitKm:520,
    fictional:true
  }
];

export const ORBITAL_VEHICLES = [
  {
    id:'crew-capsule', name:'Aurora Crew', className:'Cápsula tripulada', symbol:'●', variant:0, color:'#f1f6fa',
    description:'Cápsula compacta com escudo térmico, módulo de serviço e oito propulsores de controle.', massKg:12600, fuelKg:520,
    dimensions:'5,1 × 3,8 m', seats:4
  },
  {
    id:'cargo-capsule', name:'Vector Cargo', className:'Cápsula logística', symbol:'▰', variant:1, color:'#d5dce1',
    description:'Veículo de carga com baú pressurizado e compartimento externo para experimentos.', massKg:14800, fuelKg:670,
    dimensions:'7,2 × 4,1 m', seats:0
  },
  {
    id:'orbital-shuttle', name:'Horizon Orbiter', className:'Ônibus espacial didático', symbol:'▲', variant:2, color:'#e6ebf1',
    description:'Orbiter alado com cabine, porão de carga, motores orbitais e capacidade de aproximação em seis graus de liberdade.', massKg:78200, fuelKg:4800,
    dimensions:'37 × 24 m', seats:7
  },
  {
    id:'orbital-tug', name:'Orion Tug', className:'Rebocador orbital', symbol:'◆', variant:3, color:'#f2c66d',
    description:'Veículo não tripulado para reposicionar módulos, satélites e cargas usando propulsão elétrica e química.', massKg:8900, fuelKg:1300,
    dimensions:'8,4 × 5,2 m', seats:0
  }
];

export const ORBITAL_SATELLITES = [
  {id:'earth-observer',name:'GaiaView EO',className:'Observação terrestre',symbol:'▥',variant:0,color:'#5edcff',description:'Câmera multiespectral, antena direcionável e dois painéis solares.',altitudeKm:610},
  {id:'communications',name:'Relay GEO',className:'Comunicações',symbol:'⌁',variant:1,color:'#ffcf75',description:'Plataforma de retransmissão com grandes refletores e corpo estabilizado.',altitudeKm:35786},
  {id:'space-telescope',name:'DeepScope',className:'Telescópio espacial',symbol:'✧',variant:2,color:'#c8b6ff',description:'Observatório com espelho segmentado, para-sol e instrumentos criogênicos.',altitudeKm:1500000},
  {id:'cubesat-swarm',name:'CubeSwarm',className:'Enxame de CubeSats',symbol:'▦',variant:3,color:'#79ffc5',description:'Conjunto de pequenos satélites demonstrando formação, rede e redundância.',altitudeKm:520}
];

export const STATION_CAMERA_PRESETS = [
  {id:'station-orbit',label:'Estação 360°',short:'360',mode:'orbit',description:'Inspeção orbital completa da estação.'},
  {id:'free-flight',label:'Voo livre 6DOF',short:'6D',mode:'free',description:'Translação e rotação independentes no espaço.'},
  {id:'cockpit',label:'Cabine',short:'CAB',mode:'cockpit',description:'Visão interna do veículo selecionado.'},
  {id:'cupola',label:'Cúpula',short:'CUP',mode:'cupola',description:'Observação da Terra a partir da estação.'},
  {id:'interior',label:'Interior',short:'INT',mode:'interior',description:'Corredores e módulos internos em microgravidade.'},
  {id:'eva',label:'EVA',short:'EVA',mode:'eva',description:'Visão externa próxima com astronauta e cabo.'},
  {id:'docking-port',label:'Porta de acoplamento',short:'DOC',mode:'docking',description:'Alinhamento frontal para aproximação.'},
  {id:'robotic-arm',label:'Braço robótico',short:'ARM',mode:'arm',description:'Visão do braço e da carga orbital.'},
  {id:'satellite-chase',label:'Perseguir satélite',short:'SAT',mode:'satellite',description:'Câmera acompanha o satélite selecionado.'},
  {id:'payload-bay',label:'Porão do ônibus espacial',short:'BAY',mode:'payload',description:'Visão do compartimento de carga do orbiter.'},
  {id:'cinematic',label:'Cinematográfica',short:'CINE',mode:'cinematic',description:'Tour automático por pontos de interesse.'}
];

export const STATION_INSPECTIONS = [
  {id:'structure',label:'Estrutura e treliça',camera:'station-orbit',detail:'Verifique módulos, treliça, radiadores e painéis solares.'},
  {id:'docking',label:'Portas de acoplamento',camera:'docking-port',detail:'Confirme corredor livre, marcas de alinhamento e iluminação.'},
  {id:'interior',label:'Interior pressurizado',camera:'interior',detail:'Inspecione passagem, painéis, cabos e objetos flutuantes.'},
  {id:'eva',label:'Área externa de trabalho',camera:'eva',detail:'Confirme corrimãos, cabo, ferramentas e rota de retorno.'},
  {id:'satellite',label:'Carga orbital',camera:'satellite-chase',detail:'Inspecione painéis, antenas e orientação do satélite.'}
];

export const SIX_DOF_AXES = [
  {id:'surge',label:'Frente / trás',keys:'W / S'},
  {id:'sway',label:'Direita / esquerda',keys:'D / A'},
  {id:'heave',label:'Subir / descer',keys:'E / Q'},
  {id:'yaw',label:'Guinada',keys:'Mouse / analógico'},
  {id:'pitch',label:'Arfagem',keys:'Mouse / analógico'},
  {id:'roll',label:'Rolagem',keys:'Z / X'}
];

export const STATION_BY_ID=Object.fromEntries(STATION_VARIANTS.map(item=>[item.id,item]));
export const ORBITAL_VEHICLE_BY_ID=Object.fromEntries(ORBITAL_VEHICLES.map(item=>[item.id,item]));
export const SATELLITE_BY_ID=Object.fromEntries(ORBITAL_SATELLITES.map(item=>[item.id,item]));
export const STATION_CAMERA_BY_ID=Object.fromEntries(STATION_CAMERA_PRESETS.map(item=>[item.id,item]));

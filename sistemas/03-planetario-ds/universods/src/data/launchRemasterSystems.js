export const IMMERSIVE_VEHICLES = [
  {
    id:'aurora-l', name:'Aurora L', symbol:'△', className:'Lançador leve', color:'#61ddff', accent:'#d6f7ff', variant:0,
    config:{ missionId:'leo-lab', firstStageId:'core-l1', upperStageId:'upper-c', payloadId:'edu-cube', guidanceId:'dual', fairingId:'compact', siteId:'alcantara', recovery:false, reservePercent:5 },
    summary:'Veículo compacto para constelações educacionais e missões em órbita baixa.',
    features:['7 motores','2 estágios','coifa compacta','telemetria redundante']
  },
  {
    id:'atlas-h', name:'Atlas H', symbol:'▲', className:'Lançador pesado', color:'#ffbd55', accent:'#fff0ca', variant:1,
    config:{ missionId:'leo-lab', firstStageId:'core-h2', upperStageId:'upper-v', payloadId:'orbital-lab', guidanceId:'triple', fairingId:'standard', siteId:'coastal', recovery:false, reservePercent:4 },
    summary:'Núcleo de alto empuxo para módulos orbitais e cargas volumosas.',
    features:['9 motores','GNC triplo','laboratório orbital','margem estrutural elevada']
  },
  {
    id:'phoenix-r', name:'Phoenix R', symbol:'⇧', className:'Reutilizável', color:'#8cffad', accent:'#e5ffec', variant:2,
    config:{ missionId:'polar-observer', firstStageId:'core-r3', upperStageId:'upper-v', payloadId:'polar-eye', guidanceId:'triple', fairingId:'standard', siteId:'alcantara', recovery:true, reservePercent:7 },
    summary:'Primeiro estágio recuperável com reserva para retorno e pouso didático.',
    features:['9 motores','aletas móveis','reserva de retorno','pouso autônomo']
  },
  {
    id:'horizon-sts', name:'Horizon STS', symbol:'✈', className:'Ônibus espacial didático', color:'#e7ecff', accent:'#8db9ff', variant:3,
    config:{ missionId:'leo-lab', firstStageId:'core-h2', upperStageId:'upper-v', payloadId:'orbital-lab', guidanceId:'triple', fairingId:'extended', siteId:'coastal', recovery:false, reservePercent:4 },
    summary:'Orbiter alado com tanque externo e propulsores laterais para inspeção interna e externa.',
    features:['cabine pressurizada','porão de carga','asas orbitais','retorno planado']
  }
];

export const LAUNCH_CAMERA_PRESETS = [
  { id:'orbit', label:'Inspeção 360°', short:'360', mode:'hangar', description:'Gire ao redor do veículo e ajuste o zoom.' },
  { id:'pad', label:'Plataforma', short:'PAD', mode:'pad', description:'Veja torre, braços, vapor e preparação.' },
  { id:'engine', label:'Motores', short:'ENG', mode:'engine', description:'Inspecione bocais, turbobombas didáticas e ignição.' },
  { id:'interior', label:'Interior', short:'INT', mode:'interior', description:'Entre na cabine e examine painéis e HUD.' },
  { id:'chase', label:'Perseguição', short:'CHASE', mode:'flight', description:'Acompanhe o veículo durante a subida.' },
  { id:'onboard', label:'A bordo', short:'ONBOARD', mode:'onboard', description:'Observe a trajetória pela câmera embarcada.' },
  { id:'booster', label:'Estágio', short:'BOOST', mode:'booster', description:'Acompanhe a separação do primeiro estágio.' },
  { id:'cinematic', label:'Cinematográfica', short:'CINE', mode:'cinematic', description:'Cortes automáticos com replay visual.' }
];

export const IMMERSIVE_INSPECTIONS = [
  { id:'hull', label:'Casco e proteção térmica', camera:'orbit', xp:120, detail:'Verifique superfície, juntas, coifa, asas e escudo térmico.' },
  { id:'engines', label:'Motores e alimentação', camera:'engine', xp:120, detail:'Inspecione bocais, linhas, ignitores e simetria do conjunto propulsor.' },
  { id:'avionics', label:'Cabine e aviônica', camera:'interior', xp:120, detail:'Confirme computadores, redundância, energia e interface da tripulação.' },
  { id:'pad', label:'Plataforma e corredor', camera:'pad', xp:120, detail:'Valide torre, braços, área segura, clima e sistema de supressão acústica.' }
];

export const LAUNCH_VISUAL_MISSIONS = [
  { id:'visual-orbit', label:'Inserção orbital cinematográfica', vehicleId:'atlas-h', objective:'Realizar inspeção completa, lançar e alcançar órbita.', xp:520 },
  { id:'visual-recovery', label:'Ascensão reutilizável', vehicleId:'phoenix-r', objective:'Acompanhar separação e preservar reserva de recuperação.', xp:520 },
  { id:'visual-shuttle', label:'Ônibus espacial em missão', vehicleId:'horizon-sts', objective:'Inspecionar cabine, porão e acompanhar subida alada.', xp:520 }
];

export const VEHICLE_BY_ID = Object.fromEntries(IMMERSIVE_VEHICLES.map(item=>[item.id,item]));
export const CAMERA_BY_ID = Object.fromEntries(LAUNCH_CAMERA_PRESETS.map(item=>[item.id,item]));

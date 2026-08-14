export const ORBIT_TYPES = [
  { id:'leo', name:'LEO', label:'Órbita baixa', altitudeKm:550, inclinationDeg:51.6, color:'#55dcff', use:'Observação da Terra, estações e constelações de baixa latência.', tradeoff:'Cobertura menor por satélite e passagens rápidas.' },
  { id:'polar', name:'Polar', label:'Órbita polar', altitudeKm:720, inclinationDeg:90, color:'#9e7cff', use:'Cobertura global por faixas, mapeamento e monitoramento.', tradeoff:'Geometria de contato varia a cada passagem.' },
  { id:'sso', name:'SSO', label:'Heliossíncrona', altitudeKm:600, inclinationDeg:97.8, color:'#63e6a8', use:'Imagens com iluminação semelhante em cada passagem.', tradeoff:'Exige inclinação retrógrada e altitude específica.' },
  { id:'meo', name:'MEO', label:'Órbita média', altitudeKm:20200, inclinationDeg:55, color:'#ffcf5a', use:'Navegação global e cobertura regional ampla.', tradeoff:'Maior latência e maior exposição à radiação.' },
  { id:'geo', name:'GEO', label:'Geoestacionária', altitudeKm:35786, inclinationDeg:0, color:'#ff7eaa', use:'Comunicação e meteorologia com visão quase fixa de uma região.', tradeoff:'Latência alta e lançamento energeticamente exigente.' }
];

export const SATELLITE_MISSIONS = [
  { id:'observation', name:'Observação da Terra', icon:'◫', requirements:{ payload:['camera-multispectral'], minPowerMargin:35, minDataMargin:18, orbit:['sso','polar','leo'] }, description:'Produzir imagens, armazenar dados e descarregar em estações de solo.' },
  { id:'communications', name:'Comunicações', icon:'⌁', requirements:{ antenna:['high-gain'], minPowerMargin:70, minDataMargin:60, orbit:['leo','meo','geo'] }, description:'Manter enlaces estáveis, capacidade de retransmissão e energia contínua.' },
  { id:'weather', name:'Meteorologia', icon:'☁', requirements:{ payload:['radiometer'], minPowerMargin:45, minDataMargin:28, orbit:['sso','polar','geo'] }, description:'Medir atmosfera, nuvens e temperatura em ciclos previsíveis.' },
  { id:'science', name:'Ciência orbital', icon:'✦', requirements:{ payload:['particle-detector'], minPowerMargin:30, minDataMargin:12, orbit:['leo','polar','meo'] }, description:'Coletar séries temporais de partículas, campo e ambiente espacial.' }
];

export const SATELLITE_BUSES = [
  { id:'cube-6u', name:'CubeSat 6U', massKg:12, maxMassKg:18, basePowerW:38, baseLoadW:20, batteryWh:160, color:'#55dcff' },
  { id:'cube-12u', name:'CubeSat 12U', massKg:24, maxMassKg:38, basePowerW:72, baseLoadW:33, batteryWh:330, color:'#63e6a8' },
  { id:'small-200', name:'SmallSat 200', massKg:95, maxMassKg:210, basePowerW:420, baseLoadW:145, batteryWh:1800, color:'#ffcf5a' },
  { id:'platform-800', name:'Plataforma 800', massKg:360, maxMassKg:850, basePowerW:1650, baseLoadW:520, batteryWh:7900, color:'#ff7eaa' }
];

export const SATELLITE_PAYLOADS = [
  { id:'camera-multispectral', name:'Câmera multiespectral', massKg:8, loadW:36, dataMbps:42, icon:'◉' },
  { id:'radiometer', name:'Radiômetro', massKg:14, loadW:54, dataMbps:18, icon:'⌁' },
  { id:'particle-detector', name:'Detector de partículas', massKg:6, loadW:22, dataMbps:8, icon:'✦' },
  { id:'relay-payload', name:'Carga de retransmissão', massKg:48, loadW:230, dataMbps:160, icon:'⇄' }
];

export const POWER_SYSTEMS = [
  { id:'compact', name:'Painéis compactos', generationW:95, massKg:5, icon:'▥' },
  { id:'deployable', name:'Painéis articulados', generationW:520, massKg:27, icon:'▦' },
  { id:'high-output', name:'Asas solares ampliadas', generationW:2200, massKg:104, icon:'▤' }
];

export const ANTENNAS = [
  { id:'patch', name:'Patch de baixa taxa', capacityMbps:12, loadW:8, massKg:1.5, range:'LEO', icon:'⌁' },
  { id:'medium-gain', name:'Médio ganho orientável', capacityMbps:55, loadW:32, massKg:7, range:'LEO/MEO', icon:'◒' },
  { id:'high-gain', name:'Alto ganho', capacityMbps:260, loadW:125, massKg:32, range:'LEO/GEO', icon:'◉' }
];

export const GROUND_STATIONS = [
  { id:'alcantara', name:'Alcântara', country:'Brasil', lat:-2.37, lon:-44.40, color:'#63e6a8' },
  { id:'goldstone', name:'Goldstone', country:'Estados Unidos', lat:35.43, lon:-116.89, color:'#55dcff' },
  { id:'madrid', name:'Madrid', country:'Espanha', lat:40.43, lon:-4.25, color:'#ffcf5a' },
  { id:'canberra', name:'Canberra', country:'Austrália', lat:-35.40, lon:148.98, color:'#ff7eaa' }
];

export const ORBIT_CHALLENGES = [
  { id:'choose-sso', title:'Mapeamento comparável', prompt:'A missão precisa fotografar a mesma região com iluminação semelhante em passagens sucessivas.', answer:'sso', explanation:'A órbita heliossíncrona mantém condições locais de iluminação aproximadamente consistentes.', xp:180 },
  { id:'choose-geo', title:'Canal regional contínuo', prompt:'A antena em solo deve apontar quase sempre para a mesma posição aparente no céu.', answer:'geo', explanation:'Uma órbita geoestacionária acompanha a rotação terrestre sobre o equador.', xp:180 },
  { id:'choose-leo', title:'Baixa latência', prompt:'Uma constelação deve reduzir atraso de comunicação e aceitar várias passagens rápidas.', answer:'leo', explanation:'A menor distância da LEO reduz latência, mas exige constelação e handover.', xp:180 }
];

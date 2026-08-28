export const SOLAR_BODIES = [
  {
    id:'sun', name:'Sol', symbol:'☉', category:'Estrela', style:0,
    orbitRadius:0, orbitSpeed:0, radius:3.35, rotationSpeed:.035, axialTilt:7.25,
    colors:['#ffcc52','#ff7a19','#fff3b0'], atmosphere:'#ff9d2e', atmosphereStrength:.1,
    gravity:'274 m/s²', temperature:'≈ 5.500 °C na fotosfera', day:'≈ 27 dias', year:'—',
    short:'Fonte de energia do Sistema Solar e referência para iluminação, órbitas e painéis solares.',
    ds:'Shaders emissivos, partículas, simulação temporal e gerenciamento de energia.'
  },
  {
    id:'mercury', name:'Mercúrio', symbol:'☿', category:'Planeta rochoso', style:1,
    orbitRadius:7.1, orbitSpeed:.76, radius:.43, rotationSpeed:.01, axialTilt:.03,
    colors:['#a9a093','#615c56','#d8c9b5'], atmosphere:'#b4b0aa', atmosphereStrength:0,
    gravity:'3,7 m/s²', temperature:'−180 a 430 °C', day:'58,6 dias', year:'88 dias',
    short:'Mundo pequeno, craterado e muito próximo do Sol.', ds:'Escalas, desempenho, iluminação extrema e precisão numérica.'
  },
  {
    id:'venus', name:'Vênus', symbol:'♀', category:'Planeta rochoso', style:2,
    orbitRadius:9.5, orbitSpeed:.61, radius:.72, rotationSpeed:-.005, axialTilt:177.4,
    colors:['#f0d083','#a45c32','#fff0b0'], atmosphere:'#ffd27a', atmosphereStrength:.72,
    gravity:'8,87 m/s²', temperature:'≈ 465 °C', day:'243 dias', year:'224,7 dias',
    short:'Atmosfera espessa, nuvens permanentes e rotação retrógrada.', ds:'Camadas atmosféricas, transparência, animação procedural e sensores.'
  },
  {
    id:'earth', name:'Terra', symbol:'⊕', category:'Planeta oceânico', style:3,
    orbitRadius:12.4, orbitSpeed:.5, radius:.78, rotationSpeed:.16, axialTilt:23.44,
    colors:['#071b52','#1177b8','#2f8f4e'], atmosphere:'#56bfff', atmosphereStrength:1,
    gravity:'9,81 m/s²', temperature:'média ≈ 15 °C', day:'23 h 56 min', year:'365,25 dias',
    short:'Oceanos, atmosfera, nuvens, cidades e uma rede orbital de satélites.', ds:'Geodados, APIs, mapas, clima, telemetria e sistemas distribuídos.'
  },
  {
    id:'moon', name:'Lua', symbol:'☾', category:'Satélite natural', style:4,
    orbitRadius:13.65, parent:'earth', localOrbitRadius:1.6, orbitSpeed:2.4, radius:.22, rotationSpeed:.03, axialTilt:6.68,
    colors:['#b8b9b5','#666a6d','#e4e0d3'], atmosphere:'#b9c3d3', atmosphereStrength:0,
    gravity:'1,62 m/s²', temperature:'−173 a 127 °C', day:'27,3 dias', year:'27,3 dias',
    short:'Terreno craterado, baixa gravidade e referência histórica das missões Apollo.', ds:'Sistemas embarcados, prioridades, Assembly, sensores e pouso.'
  },
  {
    id:'mars', name:'Marte', symbol:'♂', category:'Planeta rochoso', style:5,
    orbitRadius:16.2, orbitSpeed:.4, radius:.58, rotationSpeed:.155, axialTilt:25.19,
    colors:['#a84120','#5e1e15','#e27b42'], atmosphere:'#df7653', atmosphereStrength:.22,
    gravity:'3,71 m/s²', temperature:'média ≈ −63 °C', day:'24 h 37 min', year:'687 dias',
    short:'Desertos, cânions, poeira e robôs que trabalham com grande atraso de comunicação.', ds:'Robótica, A*, visão computacional, filas de comandos e autonomia.'
  },
  {
    id:'jupiter', name:'Júpiter', symbol:'♃', category:'Gigante gasoso', style:6,
    orbitRadius:22.2, orbitSpeed:.22, radius:2.05, rotationSpeed:.35, axialTilt:3.13,
    colors:['#c89b72','#7b4b36','#f0d3ad'], atmosphere:'#e5b47f', atmosphereStrength:.3,
    gravity:'24,79 m/s²', temperature:'≈ −110 °C nas nuvens', day:'9 h 56 min', year:'11,86 anos',
    short:'Maior planeta, faixas turbulentas e a Grande Mancha Vermelha.', ds:'Ruído procedural, fluidos visuais, escalabilidade e simulações massivas.'
  },
  {
    id:'saturn', name:'Saturno', symbol:'♄', category:'Gigante gasoso', style:7,
    orbitRadius:29.1, orbitSpeed:.16, radius:1.72, rotationSpeed:.31, axialTilt:26.73,
    colors:['#e4c98d','#a98b5c','#fff0c2'], atmosphere:'#e9cf9b', atmosphereStrength:.24,
    rings:true, ringInner:2.05, ringOuter:3.35,
    gravity:'10,44 m/s²', temperature:'≈ −140 °C', day:'10 h 42 min', year:'29,45 anos',
    short:'Gigante gasoso cercado por um sistema de anéis complexo e brilhante.', ds:'Geometria, transparência, ordenação de render e partículas orbitais.'
  },
  {
    id:'uranus', name:'Urano', symbol:'♅', category:'Gigante de gelo', style:8,
    orbitRadius:35.2, orbitSpeed:.115, radius:1.28, rotationSpeed:-.22, axialTilt:97.77,
    colors:['#9bdce4','#4caab9','#d9fbff'], atmosphere:'#8ee7f3', atmosphereStrength:.42,
    rings:true, ringInner:1.48, ringOuter:2.0,
    gravity:'8,69 m/s²', temperature:'≈ −195 °C', day:'17 h 14 min', year:'84 anos',
    short:'Planeta inclinado quase de lado, com atmosfera azul-esverdeada.', ds:'Transformações 3D, eixos, orientação espacial e câmeras.'
  },
  {
    id:'neptune', name:'Netuno', symbol:'♆', category:'Gigante de gelo', style:9,
    orbitRadius:41.3, orbitSpeed:.09, radius:1.22, rotationSpeed:.24, axialTilt:28.32,
    colors:['#164fbd','#0b266e','#5e9cff'], atmosphere:'#397dff', atmosphereStrength:.5,
    gravity:'11,15 m/s²', temperature:'≈ −200 °C', day:'16 h 6 min', year:'164,8 anos',
    short:'Mundo azul, distante e com ventos extremamente rápidos.', ds:'LOD, precisão em grandes distâncias, streaming e visualização de dados.'
  }
];

export const ORBITAL_FLEET = [
  { id:'iss', name:'Estação Orbital', symbol:'ISS', parent:'earth', altitude:1.45, inclination:51.6, speed:1.35, scale:.16, color:'#f3f8ff', type:'Laboratório tripulado', purpose:'Pesquisa em microgravidade, observação e operações humanas.', ds:'Suporte à vida, inventário, energia e sistemas críticos.' },
  { id:'hubble', name:'Telescópio Espacial', symbol:'HST', parent:'earth', altitude:1.1, inclination:28.5, speed:1.7, scale:.12, color:'#b8d9ff', type:'Observatório', purpose:'Imagem e espectroscopia do universo.', ds:'Processamento de imagem, filtros, metadados e filas de observação.' },
  { id:'weather', name:'Satélite Meteorológico', symbol:'WX', parent:'earth', altitude:2.0, inclination:0, speed:.42, scale:.14, color:'#75e6ff', type:'Geoestacionário didático', purpose:'Monitoramento de nuvens, tempestades e clima.', ds:'Geodados, séries temporais, dashboards e alertas.' },
  { id:'navigation', name:'Satélite de Navegação', symbol:'NAV', parent:'earth', altitude:1.75, inclination:55, speed:.72, scale:.11, color:'#76ffb9', type:'Posicionamento', purpose:'Referência de tempo e localização.', ds:'Sincronização, relógios, trilateração e tolerância a erros.' },
  { id:'comms', name:'Satélite de Comunicação', symbol:'COM', parent:'earth', altitude:2.15, inclination:0, speed:.35, scale:.14, color:'#ffd36a', type:'Comunicações', purpose:'Retransmissão de voz, vídeo e dados.', ds:'Redes, protocolos, buffers, latência e disponibilidade.' },
  { id:'observation', name:'Satélite de Observação', symbol:'OBS', parent:'earth', altitude:1.28, inclination:97.8, speed:1.48, scale:.12, color:'#ff8fb8', type:'Sensoriamento remoto', purpose:'Imagens multiespectrais da superfície.', ds:'APIs, visão computacional, classificação e armazenamento.' }
];

export const SOLAR_TOUR = ['earth','moon','mars','jupiter','saturn','neptune','sun'];

export const BODY_BY_ID = Object.fromEntries(SOLAR_BODIES.map(body => [body.id, body]));
export const SATELLITE_BY_ID = Object.fromEntries(ORBITAL_FLEET.map(item => [item.id, item]));

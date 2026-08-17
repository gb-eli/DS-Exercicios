export const COSMIC_DESTINATIONS = [
  { id:'solar-neighborhood', name:'Vizinhança Solar', symbol:'☉', color:'#7de7ff', scale:'20 anos-luz', type:'stars', description:'Estrelas próximas, paralaxe e sensação inicial de escala interestelar.', shaderMode:0, preferredDistance:5.2 },
  { id:'stellar-nursery', name:'Berçário Estelar', symbol:'✦', color:'#ff78c8', scale:'1.400 anos-luz', type:'nebula', description:'Nuvens moleculares, pilares de gás e formação de novas estrelas.', shaderMode:1, preferredDistance:4.3 },
  { id:'planetary-nebula', name:'Nebulosa Planetária', symbol:'◉', color:'#63f6d4', scale:'2 anos-luz', type:'nebula', description:'Camadas de gás ionizado lançadas por uma estrela semelhante ao Sol.', shaderMode:2, preferredDistance:4.6 },
  { id:'supernova-remnant', name:'Remanescente de Supernova', symbol:'✹', color:'#ff8b55', scale:'12 anos-luz', type:'supernova', description:'Frente de choque, filamentos e matéria enriquecida após uma explosão estelar.', shaderMode:3, preferredDistance:5.1 },
  { id:'pulsar', name:'Pulsar', symbol:'⌁', color:'#a0bcff', scale:'20 km', type:'pulsar', description:'Estrela de nêutrons giratória com feixes eletromagnéticos direcionais.', shaderMode:4, preferredDistance:3.7 },
  { id:'black-hole', name:'Buraco Negro Didático', symbol:'●', color:'#ffb45a', scale:'Horizonte variável', type:'blackhole', description:'Disco de acreção, lente gravitacional e horizonte representados didaticamente.', shaderMode:5, preferredDistance:4.4 },
  { id:'milky-way', name:'Via Láctea', symbol:'◌', color:'#8ba7ff', scale:'100 mil anos-luz', type:'galaxy', description:'Braços espirais, bojo central e posição aproximada do Sistema Solar.', shaderMode:6, preferredDistance:6.3 },
  { id:'galaxy-cluster', name:'Aglomerado de Galáxias', symbol:'✣', color:'#cb8cff', scale:'10 milhões de anos-luz', type:'cluster', description:'Centenas de galáxias, gás quente e estrutura cósmica em grande escala.', shaderMode:7, preferredDistance:7.2 }
];

export const DEEP_SPACE_CAMERAS = [
  { id:'orbit', label:'Inspeção 360°', short:'360' },
  { id:'free', label:'Voo interestelar', short:'VOO' },
  { id:'cinematic', label:'Viagem cinematográfica', short:'CIN' },
  { id:'telescope', label:'Telescópio', short:'TEL' }
];

export const COSMIC_TOUR = [
  { id:'tour-neighborhood', destination:'solar-neighborhood', label:'Reconhecer a vizinhança estelar', xp:120 },
  { id:'tour-nursery', destination:'stellar-nursery', label:'Atravessar um berçário de estrelas', xp:160 },
  { id:'tour-supernova', destination:'supernova-remnant', label:'Inspecionar uma frente de choque', xp:180 },
  { id:'tour-pulsar', destination:'pulsar', label:'Alinhar a câmera com o feixe do pulsar', xp:180 },
  { id:'tour-black-hole', destination:'black-hole', label:'Observar lente e disco de acreção', xp:220 },
  { id:'tour-galaxy', destination:'milky-way', label:'Comparar escalas da Via Láctea', xp:220 },
  { id:'tour-cluster', destination:'galaxy-cluster', label:'Chegar à escala de aglomerados', xp:240 }
];

export const DESTINATION_BY_ID = Object.fromEntries(COSMIC_DESTINATIONS.map(item => [item.id, item]));

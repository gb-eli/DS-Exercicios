export const INTERPLANETARY_CONSOLE=Object.freeze({
  id:'space-interplanetary-console',
  type:'space-interplanetary-console',
  name:'Central Interplanetária AGV',
  x:0,z:58,radius:6,accent:'#c9b6ff',
  description:'Mapa holográfico do Sistema Solar com seleção visual de destinos e planejamento das viagens para Lua e Marte.'
});

export const SOLAR_SYSTEM_BODIES=Object.freeze([
  Object.freeze({id:'sun',name:'Sol',kind:'star',icon:'☀️',accent:'#ffd86b',orbit:0,radius:18,displayRadius:16,periodDays:0,reachable:false}),
  Object.freeze({id:'mercury',name:'Mercúrio',kind:'planet',icon:'●',accent:'#b8ada2',orbit:.15,radius:.38,displayRadius:2.5,periodDays:88,reachable:false}),
  Object.freeze({id:'venus',name:'Vênus',kind:'planet',icon:'●',accent:'#e6b66d',orbit:.24,radius:.95,displayRadius:3.7,periodDays:224.7,reachable:false}),
  Object.freeze({id:'earth',name:'Terra',kind:'planet',icon:'🌍',accent:'#58b8ff',orbit:.34,radius:1,displayRadius:4,periodDays:365.25,reachable:false}),
  Object.freeze({id:'moon',name:'Lua',kind:'moon',icon:'🌕',accent:'#e3e8ed',orbit:.39,radius:.27,displayRadius:2.1,periodDays:27.3,reachable:true,destination:'moon'}),
  Object.freeze({id:'mars',name:'Marte',kind:'planet',icon:'🔴',accent:'#ff8756',orbit:.47,radius:.53,displayRadius:3,periodDays:687,reachable:true,destination:'mars'}),
  Object.freeze({id:'jupiter',name:'Júpiter',kind:'planet',icon:'●',accent:'#d7b18d',orbit:.66,radius:11.2,displayRadius:7,periodDays:4332.6,reachable:false}),
  Object.freeze({id:'saturn',name:'Saturno',kind:'planet',icon:'🪐',accent:'#e9cf91',orbit:.77,radius:9.45,displayRadius:6.2,periodDays:10759,reachable:false}),
  Object.freeze({id:'uranus',name:'Urano',kind:'planet',icon:'●',accent:'#91e8e8',orbit:.87,radius:4.01,displayRadius:4.7,periodDays:30687,reachable:false}),
  Object.freeze({id:'neptune',name:'Netuno',kind:'planet',icon:'●',accent:'#648dff',orbit:.97,radius:3.88,displayRadius:4.5,periodDays:60190,reachable:false})
]);

export const SOLAR_DESTINATIONS=Object.freeze([
  Object.freeze({
    id:'moon',scene:'moon',area:'moon-agv',name:'Lua AGV',icon:'🌕',accent:'#dfe8ef',
    distanceLabel:'≈ 384.400 km da Terra',missionLabel:'Transferência lunar',travelMs:3800,
    summary:'Descida para a Base Lunar AGV, com gravidade reduzida, crateras, experimentos e Rover Lunar.',
    facts:Object.freeze(['Gravidade de referência: 1,62 m/s²','Retorno: Lua → Estação Orbital','Tempo visual comprimido para o Lobby'])
  }),
  Object.freeze({
    id:'mars',scene:'mars',area:'mars-agv',name:'Marte AGV',icon:'🔴',accent:'#ff8756',
    distanceLabel:'≈ 54,6 a 401 milhões km da Terra',missionLabel:'Transferência marciana',travelMs:5200,
    summary:'Viagem para a Base Marciana AGV, com geologia, cânions, poeira dinâmica e Rover Marciano.',
    facts:Object.freeze(['Gravidade de referência: 3,71 m/s²','Distância real varia com as órbitas','Retorno: Marte → Estação Orbital'])
  })
]);

export const ASTEROID_BELT=Object.freeze({id:'main-belt',name:'Cinturão principal',innerOrbit:.53,outerOrbit:.61,count:42,accent:'#968d86'});

export const SOLAR_TRAVEL_PHASES=Object.freeze([
  Object.freeze({at:0,label:'Desacoplando da Estação Orbital'}),
  Object.freeze({at:.2,label:'Trajetória interplanetária confirmada'}),
  Object.freeze({at:.48,label:'Cruzeiro espacial • navegação automática'}),
  Object.freeze({at:.76,label:'Iniciando aproximação do destino'}),
  Object.freeze({at:.94,label:'Preparando sequência de chegada'})
]);

export function getSolarDestination(id){return SOLAR_DESTINATIONS.find(item=>item.id===String(id||''))||null;}
export function getSolarBody(id){return SOLAR_SYSTEM_BODIES.find(item=>item.id===String(id||''))||null;}
export function travelPhase(progress=0){const p=Math.max(0,Math.min(1,Number(progress)||0));let phase=SOLAR_TRAVEL_PHASES[0];for(const item of SOLAR_TRAVEL_PHASES){if(p>=item.at)phase=item;else break;}return phase;}

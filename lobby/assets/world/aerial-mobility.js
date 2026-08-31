// v14.10.8.72 — F70 Mobilidade Aérea
// Definições puramente locais do Campus. Não lê nem grava estado acadêmico.

const freezeSpeed=value=>Object.freeze({
  tour:Number(value?.tour)||32,
  normal:Number(value?.normal)||52,
  sport:Number(value?.sport)||72
});

export const CAMPUS_HELIPADS=Object.freeze([
  Object.freeze({id:'helipad-mobility',name:'Heliponto Mobilidade',code:'H-MOB',x:14.5,z:-34,radius:2.8,accent:'#ffae63',district:'Eixo de Mobilidade'}),
  Object.freeze({id:'helipad-operations',name:'Heliponto Operacional Oeste',code:'H-OPS',x:-50,z:-33.5,radius:2.8,accent:'#5ce1ff',district:'Centro Operacional'}),
  Object.freeze({id:'helipad-science',name:'Heliponto Ciência Leste',code:'H-CIE',x:50,z:-33.5,radius:2.8,accent:'#8f8cff',district:'Distrito Ciência'})
]);

export const CAMPUS_HELIPAD_MAP=Object.freeze(Object.fromEntries(CAMPUS_HELIPADS.map(item=>[item.id,item])));

export const CAMPUS_AERIAL_VEHICLES=Object.freeze([
  Object.freeze({
    id:'aerial-mobility-drone',name:'Drone AGV Explorer',kind:'drone',mobilityType:'aerial',helipadId:'helipad-mobility',
    x:14.5,z:-34,y:.55,heading:0,accent:'#72e6ff',seatCapacity:1,maxAltitude:28,climbRate:6.5,
    speedKmh:freezeSpeed({tour:28,normal:42,sport:58}),
    description:'Drone leve para reconhecimento aéreo do Campus, com voo manual, altitude controlada e câmera panorâmica.'
  }),
  Object.freeze({
    id:'aerial-operations-heli',name:'Helicóptero AGV',kind:'helicopter',mobilityType:'aerial',helipadId:'helipad-operations',
    x:-50,z:-33.5,y:.7,heading:.3,accent:'#67e8f9',seatCapacity:4,maxAltitude:42,climbRate:7.8,
    speedKmh:freezeSpeed({tour:45,normal:70,sport:95}),
    description:'Helicóptero do Campus para deslocamento panorâmico, decolagem e pouso manual nos helipontos.'
  })
]);

export const CAMPUS_AERIAL_VEHICLE_MAP=Object.freeze(Object.fromEntries(CAMPUS_AERIAL_VEHICLES.map(item=>[item.id,item])));

export function aerialSpeedKmh(vehicle,preset='normal'){
  const key=['tour','normal','sport'].includes(preset)?preset:'normal';
  const speed=vehicle?.speedKmh?.[key];
  if(Number.isFinite(Number(speed)))return Number(speed);
  return key==='tour'?32:key==='sport'?78:55;
}

export function nearestCampusHelipad(x=0,z=0){
  let best=null;
  for(const pad of CAMPUS_HELIPADS){
    const distance=Math.hypot(Number(x)-pad.x,Number(z)-pad.z);
    if(!best||distance<best.distance)best={...pad,distance};
  }
  return best;
}

export function isCampusHelipadLanding(x=0,z=0,margin=1.15){
  const pad=nearestCampusHelipad(x,z);
  return !!pad&&pad.distance<=pad.radius+Math.max(0,Number(margin)||0);
}

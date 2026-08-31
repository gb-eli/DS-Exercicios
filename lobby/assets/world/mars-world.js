export const MARS_BOUNDS=Object.freeze({minX:-220,maxX:220,minZ:-175,maxZ:175});
export const MARS_SPAWN=Object.freeze({x:0,z:142});
export const MARS_GRAVITY=3.71;
export const MARS_RETURN_PORTAL=Object.freeze({id:'mars-return-space',type:'mars-return-space-portal',name:'Módulo de Ascensão Marciano',x:0,z:160,radius:8,accent:'#ffb07a',description:'Transporte pressurizado para retornar de Marte à Estação Orbital AGV.'});

export const MARS_BASE_MODULES=Object.freeze([
  Object.freeze({id:'mars-command',type:'mars-module',name:'Base Marciana AGV — Comando',x:0,z:92,w:32,d:23,h:8,accent:'#ff9d63',description:'Centro de controle, navegação, comunicações e coordenação das missões científicas em Marte.'}),
  Object.freeze({id:'mars-geology',type:'mars-module',name:'Laboratório de Geologia Marciana',x:48,z:72,w:30,d:21,h:7.5,accent:'#ffc08a',description:'Estudos demonstrativos de rochas, minerais, crateras e formação da superfície marciana.'}),
  Object.freeze({id:'mars-habitat',type:'mars-module',name:'Habitat Marciano',x:-48,z:72,w:30,d:21,h:7.5,accent:'#ffd7a6',description:'Módulo de permanência, suporte de vida e simulação de rotina humana em Marte.'}),
  Object.freeze({id:'mars-energy',type:'mars-module',name:'Energia e Comunicações',x:62,z:18,w:28,d:19,h:6.5,accent:'#a9e2c5',description:'Painéis solares, baterias e antenas para energia e comunicação da Base Marciana AGV.'}),
  Object.freeze({id:'mars-rover-bay',type:'mars-module',name:'Garagem do Rover Marciano',x:-62,z:18,w:30,d:21,h:6.5,accent:'#ffb36b',description:'Abrigo, recarga e manutenção do Rover Marciano AGV.'}),
  Object.freeze({id:'mars-greenhouse',type:'mars-module',name:'Estufa Experimental',x:0,z:48,w:28,d:18,h:6.5,accent:'#98e0a9',description:'Ambiente experimental para cultivo protegido, água e suporte de vida.'})
]);

export const MARS_CRATERS=Object.freeze([
  Object.freeze({id:'crater-veiga-mars',type:'mars-crater',name:'Cratera Veiga Mars',x:92,z:-56,radius:29,depth:4.8,description:'Grande cratera de observação geológica no setor leste.'}),
  Object.freeze({id:'crater-ds-mars',type:'mars-crater',name:'Cratera DS Mars',x:-106,z:-64,radius:36,depth:6.2,description:'Formação circular ampla no setor sudoeste da base.'}),
  Object.freeze({id:'crater-ciencia-mars',type:'mars-crater',name:'Cratera Ciência',x:34,z:-114,radius:22,depth:4.1,description:'Cratera próxima ao observatório e ao vale marciano.'}),
  Object.freeze({id:'crater-norte-mars',type:'mars-crater',name:'Cratera Aurora',x:118,z:58,radius:18,depth:3.2,description:'Cratera secundária próxima ao corredor de energia.'})
]);

export const MARS_CANYONS=Object.freeze([
  Object.freeze({id:'canyon-veiga',type:'mars-canyon',name:'Cânion Veiga',x:0,z:-78,length:112,width:18,radius:26,description:'Vale erosivo estilizado inspirado nos grandes cânions marcianos, usado para observação geológica.'}),
  Object.freeze({id:'canyon-oeste',type:'mars-canyon',name:'Cânion Oeste',x:-122,z:6,length:62,width:14,radius:20,description:'Corredor rochoso estreito que marca o limite oeste da área explorável.'})
]);

export const MARS_ROVER=Object.freeze({id:'mars-rover-01',type:'mars-rover',name:'Rover Marciano AGV',x:-62,z:35,radius:7,accent:'#ffae63',description:'Veículo elétrico local para exploração científica da superfície marciana.',maxSpeedKmh:34});
export const MARS_VIEWPOINT=Object.freeze({id:'mars-earth-view',type:'mars-viewpoint',name:'Mirante Horizonte Vermelho',x:0,z:-145,radius:8,accent:'#ffb07a',description:'Ponto panorâmico para observar o horizonte marciano, o Sol e a Terra como um pequeno ponto no céu.'});
export const MARS_EXPERIMENTS=Object.freeze([
  Object.freeze({id:'mars-weather-station',type:'mars-experiment',name:'Estação Meteorológica Marciana',x:38,z:-18,radius:5,description:'Instrumento demonstrativo para vento, pressão, temperatura e tempestades de poeira.'}),
  Object.freeze({id:'mars-solar-observer',type:'mars-experiment',name:'Observatório Solar Marciano',x:-34,z:-24,radius:5,description:'Estação de observação do Sol e das sombras na superfície de Marte.'}),
  Object.freeze({id:'mars-soil-lab',type:'mars-experiment',name:'Coletor de Solo Marciano',x:82,z:-8,radius:5,description:'Ponto de estudo demonstrativo de regolito e amostras do solo marciano.'})
]);

export const MARS_FAST_TRAVEL=Object.freeze([
  Object.freeze({id:'landing',name:'Área de Pouso Marciana',x:0,z:142,kind:'landing'}),
  Object.freeze({id:'command',name:'Base Marciana — Comando',x:0,z:92,kind:'base'}),
  Object.freeze({id:'geology',name:'Laboratório de Geologia',x:48,z:72,kind:'science'}),
  Object.freeze({id:'habitat',name:'Habitat Marciano',x:-48,z:72,kind:'habitat'}),
  Object.freeze({id:'greenhouse',name:'Estufa Experimental',x:0,z:48,kind:'science'}),
  Object.freeze({id:'rover',name:'Rover Marciano AGV',x:-62,z:35,kind:'rover'}),
  Object.freeze({id:'canyon',name:'Cânion Veiga',x:0,z:-78,kind:'canyon'}),
  Object.freeze({id:'crater-veiga',name:'Cratera Veiga Mars',x:92,z:-56,kind:'crater'}),
  Object.freeze({id:'crater-ds',name:'Cratera DS Mars',x:-106,z:-64,kind:'crater'}),
  Object.freeze({id:'horizon',name:'Mirante Horizonte Vermelho',x:0,z:-145,kind:'viewpoint'}),
  Object.freeze({id:'weather',name:'Estação Meteorológica',x:38,z:-18,kind:'science'}),
  Object.freeze({id:'return',name:'Retorno à Estação Orbital',x:0,z:160,kind:'portal'})
]);

export const MARS_OBJECTS=Object.freeze([
  MARS_RETURN_PORTAL,MARS_ROVER,MARS_VIEWPOINT,
  ...MARS_BASE_MODULES.map(item=>Object.freeze({...item,radius:Math.max(item.w,item.d)*.56})),
  ...MARS_CRATERS.map(item=>Object.freeze({...item,radius:Math.max(7,item.radius*.6)})),
  ...MARS_CANYONS,
  ...MARS_EXPERIMENTS
]);

export const clampMars=(v,min,max)=>Math.max(min,Math.min(max,v));
export function marsWorldToPresence(x,z){
  const px=((Number(x)||0)-MARS_BOUNDS.minX)/(MARS_BOUNDS.maxX-MARS_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-MARS_BOUNDS.minZ)/(MARS_BOUNDS.maxZ-MARS_BOUNDS.minZ)*1000;
  return{x:Math.round(clampMars(px,0,1600)),y:Math.round(clampMars(py,0,1000))};
}
export function marsPresenceToWorld(x,y){
  return{x:MARS_BOUNDS.minX+(clampMars(Number(x)||800,0,1600)/1600)*(MARS_BOUNDS.maxX-MARS_BOUNDS.minX),z:MARS_BOUNDS.minZ+(clampMars(Number(y)||500,0,1000)/1000)*(MARS_BOUNDS.maxZ-MARS_BOUNDS.minZ)};
}
export function nearestMarsObject(x,z,maxDistance=12){
  let best=null,bestDistance=maxDistance;
  for(const object of MARS_OBJECTS){const d=Math.hypot(x-object.x,z-object.z),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

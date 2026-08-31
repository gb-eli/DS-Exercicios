export const MOON_BOUNDS=Object.freeze({minX:-180,maxX:180,minZ:-145,maxZ:145});
export const MOON_SPAWN=Object.freeze({x:0,z:112});
export const MOON_GRAVITY=1.62;
export const MOON_RETURN_PORTAL=Object.freeze({id:'moon-return-space',type:'moon-return-space-portal',name:'Módulo de Ascensão Lunar',x:0,z:130,radius:8,accent:'#9fd8ff',description:'Transporte pressurizado para retornar da Lua à Estação Orbital AGV.'});

export const MOON_BASE_MODULES=Object.freeze([
  Object.freeze({id:'lunar-command',type:'moon-module',name:'Base Lunar AGV — Comando',x:0,z:68,w:30,d:22,h:8,accent:'#c9d4df',description:'Centro de controle, comunicações e orientação das missões científicas lunares.'}),
  Object.freeze({id:'lunar-science',type:'moon-module',name:'Laboratório de Geociências',x:42,z:52,w:28,d:20,h:7,accent:'#a9d6ff',description:'Estudos demonstrativos de regolito, crateras e formação da superfície lunar.'}),
  Object.freeze({id:'lunar-habitat',type:'moon-module',name:'Habitat Lunar',x:-42,z:50,w:28,d:20,h:7,accent:'#e8d6a7',description:'Módulo de permanência, suporte de vida e simulação de rotina em baixa gravidade.'}),
  Object.freeze({id:'lunar-energy',type:'moon-module',name:'Energia e Comunicações',x:52,z:5,w:26,d:18,h:6.5,accent:'#9be8ca',description:'Painéis solares, baterias e antenas de comunicação da Base Lunar AGV.'}),
  Object.freeze({id:'lunar-rover-bay',type:'moon-module',name:'Garagem do Rover',x:-48,z:4,w:28,d:20,h:6.5,accent:'#ffc67d',description:'Abrigo e manutenção do Rover Lunar AGV.'})
]);

export const MOON_CRATERS=Object.freeze([
  Object.freeze({id:'crater-veiga',type:'moon-crater',name:'Cratera Veiga',x:72,z:-48,radius:24,depth:4.2,description:'Grande cratera de observação geológica a leste da base.'}),
  Object.freeze({id:'crater-ds',type:'moon-crater',name:'Cratera DS',x:-82,z:-54,radius:31,depth:5.4,description:'Formação circular de grande diâmetro no setor sudoeste.'}),
  Object.freeze({id:'crater-ciencia',type:'moon-crater',name:'Cratera Ciência',x:22,z:-92,radius:18,depth:3.5,description:'Cratera menor próxima ao mirante do horizonte lunar.'}),
  Object.freeze({id:'crater-norte',type:'moon-crater',name:'Cratera Norte',x:98,z:54,radius:15,depth:2.8,description:'Cratera secundária próxima ao corredor de energia.'})
]);

export const MOON_ROVER=Object.freeze({id:'moon-rover-01',type:'moon-rover',name:'Rover Lunar AGV',x:-48,z:20,radius:7,accent:'#ffca7a',description:'Veículo elétrico local para exploração científica da superfície lunar.',maxSpeedKmh:28});
export const MOON_VIEWPOINT=Object.freeze({id:'moon-earth-view',type:'moon-viewpoint',name:'Mirante Terra Azul',x:0,z:-112,radius:8,accent:'#8fcfff',description:'Ponto panorâmico com a Terra visível acima do horizonte lunar.'});
export const MOON_EXPERIMENTS=Object.freeze([
  Object.freeze({id:'seismometer',type:'moon-experiment',name:'Sismômetro Didático',x:34,z:-22,radius:5,description:'Instrumento demonstrativo para estudar vibrações e atividade sísmica lunar.'}),
  Object.freeze({id:'solar-observer',type:'moon-experiment',name:'Observatório Solar',x:-30,z:-26,radius:5,description:'Estação de observação da iluminação solar e sombras na superfície lunar.'})
]);

export const MOON_FAST_TRAVEL=Object.freeze([
  Object.freeze({id:'landing',name:'Área de Pouso Lunar',x:0,z:112,kind:'landing'}),
  Object.freeze({id:'command',name:'Base Lunar — Comando',x:0,z:68,kind:'base'}),
  Object.freeze({id:'science',name:'Laboratório de Geociências',x:42,z:52,kind:'science'}),
  Object.freeze({id:'habitat',name:'Habitat Lunar',x:-42,z:50,kind:'habitat'}),
  Object.freeze({id:'rover',name:'Rover Lunar AGV',x:-48,z:20,kind:'rover'}),
  Object.freeze({id:'crater-veiga',name:'Cratera Veiga',x:72,z:-48,kind:'crater'}),
  Object.freeze({id:'crater-ds',name:'Cratera DS',x:-82,z:-54,kind:'crater'}),
  Object.freeze({id:'earth-view',name:'Mirante Terra Azul',x:0,z:-112,kind:'viewpoint'}),
  Object.freeze({id:'return',name:'Retorno à Estação Orbital',x:0,z:130,kind:'portal'})
]);

export const MOON_OBJECTS=Object.freeze([
  MOON_RETURN_PORTAL,MOON_ROVER,MOON_VIEWPOINT,
  ...MOON_BASE_MODULES.map(item=>Object.freeze({...item,radius:Math.max(item.w,item.d)*.56})),
  ...MOON_CRATERS.map(item=>Object.freeze({...item,radius:Math.max(7,item.radius*.6)})),
  ...MOON_EXPERIMENTS
]);

export const clampMoon=(v,min,max)=>Math.max(min,Math.min(max,v));
export function moonWorldToPresence(x,z){
  const px=((Number(x)||0)-MOON_BOUNDS.minX)/(MOON_BOUNDS.maxX-MOON_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-MOON_BOUNDS.minZ)/(MOON_BOUNDS.maxZ-MOON_BOUNDS.minZ)*1000;
  return{x:Math.round(clampMoon(px,0,1600)),y:Math.round(clampMoon(py,0,1000))};
}
export function moonPresenceToWorld(x,y){
  return{x:MOON_BOUNDS.minX+(clampMoon(Number(x)||800,0,1600)/1600)*(MOON_BOUNDS.maxX-MOON_BOUNDS.minX),z:MOON_BOUNDS.minZ+(clampMoon(Number(y)||500,0,1000)/1000)*(MOON_BOUNDS.maxZ-MOON_BOUNDS.minZ)};
}
export function nearestMoonObject(x,z,maxDistance=11){
  let best=null,bestDistance=maxDistance;
  for(const object of MOON_OBJECTS){const d=Math.hypot(x-object.x,z-object.z),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

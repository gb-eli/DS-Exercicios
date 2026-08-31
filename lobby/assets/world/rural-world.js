export const RURAL_BOUNDS=Object.freeze({minX:-180,maxX:180,minZ:-160,maxZ:160});
export const RURAL_SPAWN=Object.freeze({x:0,z:-128});
export const RURAL_RETURN_PORTAL=Object.freeze({id:'rural-return',type:'rural-return-portal',name:'Portal de Retorno ao Campus',x:0,z:-145,radius:7,accent:'#8ddf7a',description:'Estrada de retorno ao Campus DS.'});
export const RURAL_FAST_TRAVEL=Object.freeze([
  Object.freeze({id:'entrada',name:'Estrada de Entrada',x:0,z:-128,kind:'road'}),
  Object.freeze({id:'fazenda',name:'Fazenda Pedagógica AGV',x:-52,z:-18,kind:'farm'}),
  Object.freeze({id:'celeiro',name:'Celeiro e Silo',x:-78,z:-4,kind:'farm'}),
  Object.freeze({id:'ponte',name:'Ponte do Rio Veiga',x:24,z:22,kind:'bridge'}),
  Object.freeze({id:'rio',name:'Rio Veiga',x:70,z:24,kind:'river'}),
  Object.freeze({id:'pasto',name:'Pasto dos Animais',x:-18,z:72,kind:'animals'}),
  Object.freeze({id:'pomar',name:'Pomar Experimental',x:82,z:-44,kind:'orchard'}),
  Object.freeze({id:'mirante-rural',name:'Mirante Rural',x:118,z:92,kind:'viewpoint'}),
  Object.freeze({id:'retorno',name:'Portal de Retorno',x:0,z:-145,kind:'portal'})
]);
export const RURAL_ROADS=Object.freeze([
  Object.freeze({id:'main',width:8,nodes:Object.freeze([{x:0,z:-150},{x:0,z:-82},{x:-18,z:-45},{x:-52,z:-18},{x:-12,z:12},{x:24,z:22},{x:70,z:24},{x:110,z:52}])}),
  Object.freeze({id:'north',width:6,nodes:Object.freeze([{x:-52,z:-18},{x:-36,z:28},{x:-18,z:72},{x:22,z:88},{x:65,z:82}])}),
  Object.freeze({id:'orchard',width:5,nodes:Object.freeze([{x:24,z:22},{x:54,z:-8},{x:82,z:-44},{x:118,z:-56}])})
]);
export const RURAL_FIELDS=Object.freeze([
  Object.freeze({id:'milho',name:'Milharal',x:-104,z:36,w:56,d:48,crop:'corn',accent:'#e7c85a'}),
  Object.freeze({id:'trigo',name:'Campo de Trigo',x:82,z:68,w:62,d:44,crop:'wheat',accent:'#d9b15f'}),
  Object.freeze({id:'horta',name:'Horta Pedagógica',x:-52,z:-54,w:42,d:28,crop:'garden',accent:'#72c96b'})
]);
export const RURAL_BUILDINGS=Object.freeze([
  Object.freeze({id:'farmhouse',type:'rural-building',name:'Casa da Fazenda',x:-48,z:-18,w:18,d:13,h:8,accent:'#f2d7ad'}),
  Object.freeze({id:'barn',type:'rural-building',name:'Celeiro AGV',x:-78,z:-2,w:24,d:16,h:12,accent:'#b44d3d'}),
  Object.freeze({id:'silo',type:'rural-building',name:'Silo de Grãos',x:-94,z:-10,w:8,d:8,h:18,accent:'#aebbc1'}),
  Object.freeze({id:'stable',type:'rural-building',name:'Estábulo',x:-28,z:58,w:20,d:12,h:7,accent:'#855c3c'})
]);
export const RURAL_ANIMALS=Object.freeze([
  Object.freeze({id:'cow-1',type:'rural-animal',species:'Vaca',name:'Vaca Mimosa',x:-30,z:78,accent:'#ece8df'}),
  Object.freeze({id:'cow-2',type:'rural-animal',species:'Vaca',name:'Vaca Estrela',x:-14,z:68,accent:'#d7d1c7'}),
  Object.freeze({id:'horse-1',type:'rural-animal',species:'Cavalo',name:'Cavalo Tropeiro',x:-8,z:88,accent:'#99643f'}),
  Object.freeze({id:'sheep-1',type:'rural-animal',species:'Ovelha',name:'Ovelha Nuvem',x:8,z:68,accent:'#f4f0e8'}),
  Object.freeze({id:'sheep-2',type:'rural-animal',species:'Ovelha',name:'Ovelha Algodão',x:14,z:78,accent:'#eee9df'}),
  Object.freeze({id:'chicken-1',type:'rural-animal',species:'Galinha',name:'Galinha Pintada',x:-57,z:-34,accent:'#e6b75c'})
]);
export const RURAL_OBJECTS=Object.freeze([
  RURAL_RETURN_PORTAL,
  ...RURAL_BUILDINGS.map(item=>Object.freeze({...item,radius:Math.max(item.w,item.d)*.55,description:`${item.name} • estrutura da Fazenda Pedagógica AGV.`})),
  ...RURAL_ANIMALS.map(item=>Object.freeze({...item,radius:4.5,description:`${item.species} da Fazenda Pedagógica AGV.`})),
  Object.freeze({id:'rural-bridge',type:'rural-bridge',name:'Ponte do Rio Veiga',x:24,z:22,radius:8,description:'Ponte principal que conecta os dois lados do ambiente rural.'}),
  Object.freeze({id:'rural-river',type:'rural-river',name:'Rio Veiga',x:72,z:24,radius:9,description:'Curso d’água que atravessa a área rural.'}),
  Object.freeze({id:'rural-viewpoint',type:'rural-viewpoint',name:'Mirante Rural',x:118,z:92,radius:7,description:'Ponto elevado para observar fazendas, campos e o rio.'})
]);

export const clampRural=(v,min,max)=>Math.max(min,Math.min(max,v));
export function ruralWorldToPresence(x,z){
  const px=((Number(x)||0)-RURAL_BOUNDS.minX)/(RURAL_BOUNDS.maxX-RURAL_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-RURAL_BOUNDS.minZ)/(RURAL_BOUNDS.maxZ-RURAL_BOUNDS.minZ)*1000;
  return{x:Math.round(clampRural(px,0,1600)),y:Math.round(clampRural(py,0,1000))};
}
export function ruralPresenceToWorld(x,y){
  return{x:RURAL_BOUNDS.minX+(clampRural(Number(x)||800,0,1600)/1600)*(RURAL_BOUNDS.maxX-RURAL_BOUNDS.minX),z:RURAL_BOUNDS.minZ+(clampRural(Number(y)||500,0,1000)/1000)*(RURAL_BOUNDS.maxZ-RURAL_BOUNDS.minZ)};
}
export function nearestRuralObject(x,z,maxDistance=8){
  let best=null,bestDistance=maxDistance;
  for(const object of RURAL_OBJECTS){const d=Math.hypot(x-object.x,z-object.z),r=Math.max(2,Number(object.radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}

export const VILLAGE_VERSION='14.10.8.88';
export const VILLAGE_BOUNDS=Object.freeze({minX:-42,maxX:42,minZ:-32,maxZ:32});
export const VILLAGE_SPAWN=Object.freeze({x:0,y:0,z:-24});

const base=(key,label,name,accent,secondary,code,motif)=>Object.freeze({
  key,id:`village-${key}`,scene:`village-${key}`,presenceArea:`village-${key}`,
  label,name,code,accent,secondary,motif,
  spawn:VILLAGE_SPAWN,bounds:VILLAGE_BOUNDS,
  returnPortal:Object.freeze({id:`${key}-return-campus`,type:'village-return-portal',name:'Estação • Campus DS',label:'VOLTAR AO CAMPUS DS',x:0,z:-28,radius:5.5,targetWorldId:'campus-ds'}),
  destinations:Object.freeze([
    Object.freeze({id:'station',name:'Estação da Vila',kind:'station',x:0,z:-24}),
    Object.freeze({id:'plaza',name:`Praça ${label}`,kind:'plaza',x:0,z:0}),
    Object.freeze({id:'class-house',name:`Casa ${label}`,kind:'class-house',x:0,z:11}),
    Object.freeze({id:'lab',name:'Laboratório de Projetos',kind:'lab',x:-22,z:5}),
    Object.freeze({id:'library',name:'Biblioteca & Estudo',kind:'library',x:22,z:5}),
    Object.freeze({id:'garden',name:'Jardim de Convivência',kind:'garden',x:-20,z:-12}),
    Object.freeze({id:'maker',name:'Pavilhão Maker',kind:'maker',x:20,z:-12})
  ])
});

export const VILLAGE_CONFIGS=Object.freeze({
  '1ds':base('1ds','1DS','Vila da 1ª Série DS','#36d2ff','#8de9ff','1DS-A-MANHA','logic'),
  '2ds':base('2ds','2DS','Vila da 2ª Série DS','#51e7a3','#b6ffd4','2DS-A-MANHA','interface'),
  '3ds':base('3ds','3DS','Vila da 3ª Série DS','#b58cff','#dcc5ff','3DS-C-MANHA','systems'),
  'sub':base('sub','SUB','Vila DS Subsequente','#ffae63','#ffe0a9','DS-SUB-NOITE','professional')
});

export function villageConfig(ref){
  const key=String(ref||'').replace(/^village-/,'');return VILLAGE_CONFIGS[key]||null;
}
export function villageWorldToPresence(x,z){
  const b=VILLAGE_BOUNDS;return{x:Math.round(((Math.max(b.minX,Math.min(b.maxX,Number(x)||0))-b.minX)/(b.maxX-b.minX))*1600),y:Math.round(((Math.max(b.minZ,Math.min(b.maxZ,Number(z)||0))-b.minZ)/(b.maxZ-b.minZ))*1000)};
}
export function villagePresenceToWorld(x,y){
  const b=VILLAGE_BOUNDS;return{x:b.minX+(Math.max(0,Math.min(1600,Number(x)||800))/1600)*(b.maxX-b.minX),z:b.minZ+(Math.max(0,Math.min(1000,Number(y)||500))/1000)*(b.maxZ-b.minZ)};
}
export function nearestVillageObject(config,x,z,maxDistance=5){
  if(!config)return null;const objects=[config.returnPortal,...config.destinations];let best=null,dBest=Infinity;
  for(const o of objects){const d=Math.hypot((Number(o.x)||0)-x,(Number(o.z)||0)-z),r=Math.max(Number(maxDistance)||0,Number(o.radius)||0);if(d<=r&&d<dBest){best=o;dBest=d;}}
  if(!best)return null;const type=best.type||`village-${best.kind||'poi'}`;return {...best,type,distance:dBest,villageKey:config.key,zoneKey:config.key};
}
export function villageSceneKey(scene){const s=String(scene||'');return s.startsWith('village-')?s.slice(8):null;}

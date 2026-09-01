export const CAMPUS_MODULE_VERSION='14.10.8.92';
export const CAMPUS_MODULE_BOUNDS=Object.freeze({minX:-46,maxX:46,minZ:-36,maxZ:36});
export const CAMPUS_MODULE_SPAWN=Object.freeze({x:0,y:0,z:-28});
const O=o=>Object.freeze(o);
const base=(key,name,shortName,icon,accent,secondary,theme,destinations)=>O({
  key,id:`campus-${key}`,scene:`campus-${key}`,presenceArea:`campus-${key}`,name,shortName,icon,accent,secondary,theme,
  spawn:CAMPUS_MODULE_SPAWN,bounds:CAMPUS_MODULE_BOUNDS,
  returnPortal:O({id:`${key}-return-campus`,type:'campus-module-return-portal',name:'Estação Central • Campus DS',label:'VOLTAR AO CAMPUS DS',x:0,z:-32,radius:5.6,targetWorldId:'campus-ds'}),
  destinations:Object.freeze(destinations.map(O))
});
export const CAMPUS_MODULE_CONFIGS=Object.freeze({
  library:base('library','Biblioteca Central AGV','Biblioteca','📚','#7ddcff','#d6f4ff','library',[
    {id:'station',name:'Estação da Biblioteca',kind:'station',x:0,z:-27},
    {id:'atrium',name:'Átrio do Conhecimento',kind:'atrium',x:0,z:-8},
    {id:'main-library',name:'Biblioteca Central',kind:'library-zone',x:0,z:10},
    {id:'reading',name:'Salão de Leitura',kind:'library-zone',x:-22,z:8},
    {id:'media',name:'Midiateca Digital',kind:'library-zone',x:22,z:8},
    {id:'study',name:'Salas de Estudo',kind:'library-zone',x:-22,z:-9},
    {id:'archive',name:'Acervo & Arquivo',kind:'library-zone',x:22,z:-9},
    {id:'garden',name:'Jardim de Leitura',kind:'garden',x:0,z:27}
  ]),
  labs:base('labs','Distrito de Laboratórios AGV','Laboratórios','🧪','#55d9ff','#8ff5de','labs',[
    {id:'station',name:'Estação dos Laboratórios',kind:'station',x:0,z:-28},
    {id:'plaza',name:'Praça de Pesquisa',kind:'plaza',x:0,z:-8},
    {id:'lab-virtual',name:'Laboratório Virtual DS',kind:'module-tool-link',x:-22,z:8,route:'sistemas/01-lab-virtual/LABDS/index.html'},
    {id:'simulation',name:'Laboratório de Simulação',kind:'lab-zone',x:0,z:12},
    {id:'robotics',name:'Robótica & Automação',kind:'lab-zone',x:22,z:8},
    {id:'network',name:'Redes & Infraestrutura',kind:'lab-zone',x:-22,z:-9},
    {id:'maker',name:'Prototipagem Maker',kind:'lab-zone',x:22,z:-9},
    {id:'research',name:'Centro de Pesquisa',kind:'lab-zone',x:0,z:27}
  ]),
  neon:base('neon','Parque Neon & Lazer AGV','Neon & Lazer','✨','#43d9ff','#ff7fd5','neon',[
    {id:'station',name:'Estação Neon',kind:'station',x:0,z:-29},
    {id:'lounge',name:'Praça Neon',kind:'plaza',x:0,z:-10},
    {id:'pool',name:'Piscina Neon',kind:'pool',x:21,z:8},
    {id:'parkour',name:'Circuito Parkour',kind:'parkour',x:-21,z:8},
    {id:'playground',name:'Parquinho DS',kind:'playground',x:-21,z:-10},
    {id:'slide',name:'Escorregador Turbo',kind:'slide',x:21,z:-10},
    {id:'stage',name:'Palco & Convivência',kind:'lounge',x:0,z:20},
    {id:'garden',name:'Jardim Luminoso',kind:'garden',x:0,z:30}
  ])
});
export function campusModuleConfig(ref){const key=String(ref||'').replace(/^campus-/,'');return CAMPUS_MODULE_CONFIGS[key]||null;}
export function campusModuleSceneKey(scene){const s=String(scene||'');return s.startsWith('campus-')?s.slice(7):null;}
export function campusModuleWorldToPresence(x,z){const b=CAMPUS_MODULE_BOUNDS;return{x:Math.round(((Math.max(b.minX,Math.min(b.maxX,Number(x)||0))-b.minX)/(b.maxX-b.minX))*1600),y:Math.round(((Math.max(b.minZ,Math.min(b.maxZ,Number(z)||0))-b.minZ)/(b.maxZ-b.minZ))*1000)};}
export function campusModulePresenceToWorld(x,y){const b=CAMPUS_MODULE_BOUNDS;return{x:b.minX+(Math.max(0,Math.min(1600,Number(x)||800))/1600)*(b.maxX-b.minX),z:b.minZ+(Math.max(0,Math.min(1000,Number(y)||500))/1000)*(b.maxZ-b.minZ)};}
export function nearestCampusModuleObject(config,x,z,maxDistance=5){if(!config)return null;let best=null,dBest=Infinity;for(const o of [config.returnPortal,...config.destinations]){const d=Math.hypot((Number(o.x)||0)-x,(Number(o.z)||0)-z),r=Math.max(Number(maxDistance)||0,Number(o.radius)||0);if(d<=r&&d<dBest){best=o;dBest=d;}}if(!best)return null;let type=best.type;if(!type){if(['pool','parkour','playground','slide'].includes(best.kind))type=best.kind;else if(best.kind==='module-tool-link')type='module-tool-link';else if(best.kind==='station')type='campus-module-station';else type='campus-module-poi';}return{...best,type,distance:dBest,moduleKey:config.key};}

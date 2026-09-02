import { createLobbyLite } from '../lobby-lite.js?v=14.10.8.92-f90-graphics';
import { createValeLite } from '../vale-lite.js?v=14.10.8.87-f85-map-realtime';

const MODES=Object.freeze(['lite','3d']);

export function createWorldAdapter({id,scene,label,createLite,create3D}){
  if(!id||!scene||typeof createLite!=='function'||typeof create3D!=='function')throw new TypeError('world_adapter_invalid');
  const factories=Object.freeze({lite:createLite,'3d':create3D});
  return Object.freeze({
    id:String(id),scene:String(scene),label:String(label||id),modes:MODES,
    supports(mode){return MODES.includes(mode);},
    createRuntime(mode,context={}){
      const factory=factories[mode];
      if(!factory)throw new RangeError(`world_mode_unsupported:${id}:${mode}`);
      return factory(context);
    }
  });
}

const createCampus3DLazy=async context=>(await import('../lobby3d.js?v=14.10.8.96-f94-auto-calibration')).createLobby3D(context);
export const CAMPUS_WORLD_ADAPTER=createWorldAdapter({
  id:'campus-ds',scene:'campus',label:'Campus DS',createLite:createLobbyLite,create3D:createCampus3DLazy
});

const createVale3DLazy=async context=>(await import('../vale3d.js?v=14.10.8.93-f91-external-graphics')).createVale3D(context);

function createVillageAdapter(key,label){
  const createLite=async context=>(await import('../village-lite.js?v=14.10.8.88-f86-villages')).createVillageLite({...context,villageKey:key});
  const create3D=async context=>(await import('../village3d.js?v=14.10.8.92-f90-graphics')).createVillage3D({...context,villageKey:key});
  return createWorldAdapter({id:`village-${key}`,scene:`village-${key}`,label,createLite,create3D});
}
export const VILLAGE_1DS_WORLD_ADAPTER=createVillageAdapter('1ds','Vila 1DS');
export const VILLAGE_2DS_WORLD_ADAPTER=createVillageAdapter('2ds','Vila 2DS');
export const VILLAGE_3DS_WORLD_ADAPTER=createVillageAdapter('3ds','Vila 3DS');
export const VILLAGE_SUB_WORLD_ADAPTER=createVillageAdapter('sub','Vila SUB');

function createCampusModuleAdapter(key,label){
  const createLite=async context=>(await import('../campus-module-lite.js?v=14.10.8.92-f90-graphics')).createCampusModuleLite({...context,moduleKey:key});
  const create3D=async context=>(await import('../campus-module3d.js?v=14.10.8.92-f90-graphics')).createCampusModule3D({...context,moduleKey:key});
  return createWorldAdapter({id:`campus-${key}`,scene:`campus-${key}`,label,createLite,create3D});
}
export const CAMPUS_LIBRARY_WORLD_ADAPTER=createCampusModuleAdapter('library','Biblioteca Central AGV');
export const CAMPUS_LABS_WORLD_ADAPTER=createCampusModuleAdapter('labs','Distrito de Laboratórios AGV');
export const CAMPUS_NEON_WORLD_ADAPTER=createCampusModuleAdapter('neon','Parque Neon & Lazer AGV');

export const VALE_WORLD_ADAPTER=createWorldAdapter({
  id:'vale-silicio',scene:'vale',label:'Vale do Silício AGV',createLite:createValeLite,create3D:createVale3DLazy
});

const createRuralLiteLazy=async context=>(await import('../rural-lite.js?v=14.10.8.87-f85-map-realtime')).createRuralLite(context);
const createRural3DLazy=async context=>(await import('../rural3d.js?v=14.10.8.93-f91-external-graphics')).createRural3D(context);
export const RURAL_WORLD_ADAPTER=createWorldAdapter({
  id:'rural-agv',scene:'rural',label:'Mundo Rural AGV',createLite:createRuralLiteLazy,create3D:createRural3DLazy
});

const createMilitaryLiteLazy=async context=>(await import('../military-lite.js?v=14.10.8.87-f85-map-realtime')).createMilitaryLite(context);
const createMilitary3DLazy=async context=>(await import('../military3d.js?v=14.10.8.94-f92-mission-graphics')).createMilitary3D(context);
export const MILITARY_WORLD_ADAPTER=createWorldAdapter({
  id:'military-agv',scene:'military',label:'Base de Operações AGV',createLite:createMilitaryLiteLazy,create3D:createMilitary3DLazy
});

const createSpaceLiteLazy=async context=>(await import('../space-lite.js?v=14.10.8.87-f85-map-realtime')).createSpaceLite(context);
const createSpace3DLazy=async context=>(await import('../space3d.js?v=14.10.8.94-f92-mission-graphics')).createSpace3D(context);
export const SPACE_WORLD_ADAPTER=createWorldAdapter({
  id:'space-agv',scene:'space',label:'Estação Orbital AGV',createLite:createSpaceLiteLazy,create3D:createSpace3DLazy
});


const createMoonLiteLazy=async context=>(await import('../moon-lite.js?v=14.10.8.87-f85-map-realtime')).createMoonLite(context);
const createMoon3DLazy=async context=>(await import('../moon3d.js?v=14.10.8.94-f92-mission-graphics')).createMoon3D(context);
export const MOON_WORLD_ADAPTER=createWorldAdapter({
  id:'moon-agv',scene:'moon',label:'Lua AGV',createLite:createMoonLiteLazy,create3D:createMoon3DLazy
});


const createMarsLiteLazy=async context=>(await import('../mars-lite.js?v=14.10.8.87-f85-map-realtime')).createMarsLite(context);
const createMars3DLazy=async context=>(await import('../mars3d.js?v=14.10.8.94-f92-mission-graphics')).createMars3D(context);
export const MARS_WORLD_ADAPTER=createWorldAdapter({
  id:'mars-agv',scene:'mars',label:'Marte AGV',createLite:createMarsLiteLazy,create3D:createMars3DLazy
});


const createParqueLiteLazy=async context=>(await import('../parque-diversoes-agv-lite.js?v=14.10.8.87-f85-map-realtime')).createParqueDiversoesLite(context);
const createParque3DLazy=async context=>(await import('../parque-diversoes-agv3d.js?v=14.10.8.96-f94-auto-calibration')).createParqueDiversoes3D(context);
export const PARQUE_WORLD_ADAPTER=createWorldAdapter({
  id:'parque-diversoes-agv',scene:'parque',label:'Parque de Diversões AGV',createLite:createParqueLiteLazy,create3D:createParque3DLazy
});


const createColegioLiteLazy=async context=>(await import('../colegio-agv-host.js?v=14.10.8.96-f94-auto-calibration')).createColegioAgvHostedLite(context);
const createColegio3DLazy=async context=>(await import('../colegio-agv-host.js?v=14.10.8.96-f94-auto-calibration')).createColegioAgvHosted3D(context);
export const COLEGIO_WORLD_ADAPTER=createWorldAdapter({
  id:'colegio-agv',scene:'colegio',label:'Colégio AGV — Alberto Gomes Veiga',createLite:createColegioLiteLazy,create3D:createColegio3DLazy
});

const createLabirintoLiteLazy=async context=>(await import('../labirinto-armadilhas-host.js?v=14.10.8.96-f94-auto-calibration')).createLabirintoArmadilhasHostedLite(context);
const createLabirinto3DLazy=async context=>(await import('../labirinto-armadilhas-host.js?v=14.10.8.96-f94-auto-calibration')).createLabirintoArmadilhasHosted3D(context);
export const LABIRINTO_WORLD_ADAPTER=createWorldAdapter({
  id:'labirinto-armadilhas',scene:'labirinto',label:'Labirinto com Armadilhas',createLite:createLabirintoLiteLazy,create3D:createLabirinto3DLazy
});

const createMuseuLiteLazy=async context=>(await import('../museu-hardware-lite.js?v=0.8.0')).createMuseuHardwareLite(context);
const createMuseu3DLazy=async context=>(await import('../museu-hardware3d.js?v=14.10.8.95-f93-special-graphics')).createMuseuHardware3D(context);
export const MUSEU_WORLD_ADAPTER=createWorldAdapter({
  id:'museu-hardware-agv',scene:'museu',label:'Museu do Hardware AGV',createLite:createMuseuLiteLazy,create3D:createMuseu3DLazy
});


const createAirdropTransit3DLazy=async context=>(await import('../airdrop-transit3d.js?v=14.10.8.96-f94-auto-calibration')).createAirdropTransit3D(context);
// Runtime transitório: mantém a identidade/presença do Campus durante a queda, mas descarrega o Campus 3D pesado.
export const AIRDROP_TRANSIT_ADAPTER=createWorldAdapter({
  id:'campus-ds',scene:'campus',label:'Airdrop setorial',createLite:async()=>{throw new Error('airdrop_transit_3d_only')},create3D:createAirdropTransit3DLazy
});

export const WORLD_ADAPTERS=Object.freeze([
  CAMPUS_WORLD_ADAPTER,VILLAGE_1DS_WORLD_ADAPTER,VILLAGE_2DS_WORLD_ADAPTER,VILLAGE_3DS_WORLD_ADAPTER,VILLAGE_SUB_WORLD_ADAPTER,CAMPUS_LIBRARY_WORLD_ADAPTER,CAMPUS_LABS_WORLD_ADAPTER,CAMPUS_NEON_WORLD_ADAPTER,VALE_WORLD_ADAPTER,RURAL_WORLD_ADAPTER,MILITARY_WORLD_ADAPTER,SPACE_WORLD_ADAPTER,MOON_WORLD_ADAPTER,MARS_WORLD_ADAPTER,PARQUE_WORLD_ADAPTER,COLEGIO_WORLD_ADAPTER,LABIRINTO_WORLD_ADAPTER,MUSEU_WORLD_ADAPTER
]);
const WORLD_ADAPTER_INDEX=new Map(WORLD_ADAPTERS.flatMap(adapter=>[[adapter.id,adapter],[adapter.scene,adapter]]));
export function getWorldAdapter(ref){return WORLD_ADAPTER_INDEX.get(String(ref||''))||null;}

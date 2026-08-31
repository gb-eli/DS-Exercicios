import { createLobby3D } from '../lobby3d.js?v=14.10.8.79-stage48-solar-system';
import { createLobbyLite } from '../lobby-lite.js?v=14.10.8.79-stage48-solar-system';
import { createValeLite } from '../vale-lite.js?v=14.10.8.66-stage32';
import { createVale3D } from '../vale3d.js?v=14.10.8.66-stage32';

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

export const CAMPUS_WORLD_ADAPTER=createWorldAdapter({
  id:'campus-ds',scene:'campus',label:'Campus DS',createLite:createLobbyLite,create3D:createLobby3D
});

export const VALE_WORLD_ADAPTER=createWorldAdapter({
  id:'vale-silicio',scene:'vale',label:'Vale do Silício AGV',createLite:createValeLite,create3D:createVale3D
});

const createRuralLiteLazy=async context=>(await import('../rural-lite.js?v=14.10.8.79-stage48-solar-system')).createRuralLite(context);
const createRural3DLazy=async context=>(await import('../rural3d.js?v=14.10.8.79-stage48-solar-system')).createRural3D(context);
export const RURAL_WORLD_ADAPTER=createWorldAdapter({
  id:'rural-agv',scene:'rural',label:'Mundo Rural AGV',createLite:createRuralLiteLazy,create3D:createRural3DLazy
});

const createMilitaryLiteLazy=async context=>(await import('../military-lite.js?v=14.10.8.79-stage48-solar-system')).createMilitaryLite(context);
const createMilitary3DLazy=async context=>(await import('../military3d.js?v=14.10.8.79-stage48-solar-system')).createMilitary3D(context);
export const MILITARY_WORLD_ADAPTER=createWorldAdapter({
  id:'military-agv',scene:'military',label:'Base de Operações AGV',createLite:createMilitaryLiteLazy,create3D:createMilitary3DLazy
});

const createSpaceLiteLazy=async context=>(await import('../space-lite.js?v=14.10.8.79-stage48-solar-system')).createSpaceLite(context);
const createSpace3DLazy=async context=>(await import('../space3d.js?v=14.10.8.79-stage48-solar-system')).createSpace3D(context);
export const SPACE_WORLD_ADAPTER=createWorldAdapter({
  id:'space-agv',scene:'space',label:'Estação Orbital AGV',createLite:createSpaceLiteLazy,create3D:createSpace3DLazy
});


const createMoonLiteLazy=async context=>(await import('../moon-lite.js?v=14.10.8.79-stage48-solar-system')).createMoonLite(context);
const createMoon3DLazy=async context=>(await import('../moon3d.js?v=14.10.8.79-stage48-solar-system')).createMoon3D(context);
export const MOON_WORLD_ADAPTER=createWorldAdapter({
  id:'moon-agv',scene:'moon',label:'Lua AGV',createLite:createMoonLiteLazy,create3D:createMoon3DLazy
});


const createMarsLiteLazy=async context=>(await import('../mars-lite.js?v=14.10.8.79-stage48-solar-system')).createMarsLite(context);
const createMars3DLazy=async context=>(await import('../mars3d.js?v=14.10.8.79-stage48-solar-system')).createMars3D(context);
export const MARS_WORLD_ADAPTER=createWorldAdapter({
  id:'mars-agv',scene:'mars',label:'Marte AGV',createLite:createMarsLiteLazy,create3D:createMars3DLazy
});

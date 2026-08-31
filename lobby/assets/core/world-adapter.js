import { createLobby3D } from '../lobby3d.js?v=14.10.8.70-stage39-traffic';
import { createLobbyLite } from '../lobby-lite.js?v=14.10.8.66-stage34-f63a';
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

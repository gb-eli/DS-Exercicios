export const WORLD_CONTEXT_VERSION=2;
export function createWorldContext({worldId,scene,mode,state=null,signal=null,quality=null,source='world-manager',extra={}}={}){
  if(!worldId||!scene||!mode)throw new TypeError('world_context_identity_required');
  return Object.freeze({version:WORLD_CONTEXT_VERSION,worldId:String(worldId),scene:String(scene),mode:String(mode),state,signal,quality,source,...extra});
}

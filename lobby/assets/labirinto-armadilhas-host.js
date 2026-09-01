import { createLabirintoArmadilhasLite } from './labirinto-armadilhas-lite.js?v=1.1.0';
import { createLabirintoArmadilhas3D } from './labirinto-armadilhas3d.js?v=1.1.0';
import { MAP_ID, MAP_LABEL, MAP_BOUNDS, MAP_SPAWN, MAP_RETURN_PORTAL } from './world/labirinto-armadilhas-shared.js?v=1.1.0';
import { MAZE_WALLS } from './world/labirinto-armadilhas-data.js?v=1.1.0';
import { createPluginWorldLiteHost, createPluginWorld3DHost, mapWorldToPresence, mapPresenceToWorld, nearestPortal } from './plugin-world-host.js?v=14.10.8.92-f90-graphics';

function blocked(x,z,r=.62){
  if(x<MAP_BOUNDS.minX+r||x>MAP_BOUNDS.maxX-r||z<MAP_BOUNDS.minZ+r||z>MAP_BOUNDS.maxZ-r)return true;
  return MAZE_WALLS.some(w=>Math.abs(x-w.x)<w.w/2+r&&Math.abs(z-w.z)<w.d/2+r);
}
function resolveMaze(_plugin,from,desired){
  const out={...from};
  if(!blocked(desired.x,from.z))out.x=desired.x;
  if(!blocked(out.x,desired.z))out.z=desired.z;
  out.y=0;
  return out;
}
const CONFIG={
  worldId:MAP_ID,scene:'labirinto',area:'labirinto-armadilhas',label:MAP_LABEL,bounds:MAP_BOUNDS,spawn:MAP_SPAWN,walkSpeed:10.5,runSpeed:17.5,
  worldToPresence:(x,z)=>mapWorldToPresence(MAP_BOUNDS,x,z),presenceToWorld:(x,y)=>mapPresenceToWorld(MAP_BOUNDS,x,y),
  nearestObject:player=>nearestPortal(player,MAP_RETURN_PORTAL),resolveMovement:resolveMaze
};
export function createLabirintoArmadilhasHostedLite(context={}){return createPluginWorldLiteHost(context,{...CONFIG,createPlugin:createLabirintoArmadilhasLite});}
export function createLabirintoArmadilhasHosted3D(context={}){return createPluginWorld3DHost(context,{...CONFIG,createPlugin:createLabirintoArmadilhas3D,background:0x071018,fog:0x071018,fogDensity:.006});}
export { MAP_RETURN_PORTAL };

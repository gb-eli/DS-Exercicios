import { createColegioAgvLite } from './colegio-agv-lite.js?v=1.6.0-f7';
import { createColegioAgv3D } from './colegio-agv3d.js?v=1.6.0-f7';
import { MAP_ID, MAP_LABEL, MAP_BOUNDS, MAP_SPAWN, MAP_RETURN_PORTAL } from './world/colegio-agv-shared.js?v=1.6.0-f7';
import { createPluginWorldLiteHost, createPluginWorld3DHost, mapWorldToPresence, mapPresenceToWorld } from './plugin-world-host.js?v=14.10.8.83-stage52-new-worlds';

const CONFIG={
  worldId:MAP_ID,scene:'colegio',area:'colegio-agv',label:MAP_LABEL,bounds:MAP_BOUNDS,spawn:MAP_SPAWN,walkSpeed:11.5,runSpeed:19.5,
  worldToPresence:(x,z)=>mapWorldToPresence(MAP_BOUNDS,x,z),presenceToWorld:(x,y)=>mapPresenceToWorld(MAP_BOUNDS,x,y),
  nearestObject:(_player,plugin)=>plugin?.getFocusedInteraction?.()||null,
  resolveMovement:(plugin,from,desired)=>plugin?.resolveMovement?.(from,desired,{activeInteriorId:plugin?.getActiveInterior?.()||null})||desired
};

export function createColegioAgvHostedLite(context={}){return createPluginWorldLiteHost(context,{...CONFIG,createPlugin:createColegioAgvLite});}
export function createColegioAgvHosted3D(context={}){return createPluginWorld3DHost(context,{...CONFIG,createPlugin:createColegioAgv3D,background:0xaac6d4,fog:0xb8ced8,fogDensity:.0019});}
export { MAP_RETURN_PORTAL };

import { WORLD_MANIFESTS } from './world-manifests.js?v=14.10.8.83-o3';
import { WORLD_CONNECTIONS, connectionsFrom, connectionBetween, areWorldsConnected } from './world-connections.js?v=14.10.8.83-o3';

function uniqueIndex(label,pairs){
  const map=new Map();
  for(const [key,world] of pairs){
    const normalized=String(key||'').trim();if(!normalized)continue;
    const existing=map.get(normalized);
    if(existing&&existing.id!==world.id)throw new Error(`world_registry_duplicate_${label}:${normalized}`);
    map.set(normalized,world);
  }
  return map;
}

const byId=uniqueIndex('id',WORLD_MANIFESTS.map(world=>[world.id,world]));
const byScene=uniqueIndex('scene',WORLD_MANIFESTS.flatMap(world=>[[world.scene,world],...world.sceneAliases.map(alias=>[alias,world])]));
const byAlias=uniqueIndex('alias',WORLD_MANIFESTS.flatMap(world=>world.aliases.map(alias=>[alias,world])));
const byPresence=uniqueIndex('presence',WORLD_MANIFESTS.flatMap(world=>world.presenceAreas.map(area=>[area,world])));

export function getWorldManifest(id){return byId.get(String(id||''))||null;}
export function getWorldByScene(scene){return byScene.get(String(scene||''))||null;}
export function getWorldByPresenceArea(area){return byPresence.get(String(area||''))||null;}
export function resolveWorldManifest(ref){
  const key=String(ref||'').trim();
  return byId.get(key)||byScene.get(key)||byAlias.get(key)||byPresence.get(key)||null;
}
export function listWorldManifests({enabledOnly=true,category=null}={}){
  return WORLD_MANIFESTS.filter(world=>(!enabledOnly||world.enabled)&&(!category||world.category===category));
}
export function worldConnections(id){return connectionsFrom(String(id||''));}

export const WORLD_REGISTRY=Object.freeze({
  schemaVersion:1,
  manifests:WORLD_MANIFESTS,
  connections:WORLD_CONNECTIONS,
  get:getWorldManifest,
  byScene:getWorldByScene,
  byPresenceArea:getWorldByPresenceArea,
  resolve:resolveWorldManifest,
  list:listWorldManifests,
  connectionsFrom:worldConnections,
  connectionBetween,
  areConnected:areWorldsConnected,
  has:id=>byId.has(String(id||'')),
  size:WORLD_MANIFESTS.length
});

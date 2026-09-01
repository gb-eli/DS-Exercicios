import { WORLD_MANIFESTS } from './world-manifests.js?v=14.10.8.83-o3';

const ids=new Set(WORLD_MANIFESTS.map(world=>world.id));
const edgeKey=(a,b)=>[a,b].sort().join('::');
const edges=new Map();
for(const world of WORLD_MANIFESTS){
  for(const target of world.connections){
    if(!ids.has(target))throw new Error(`world_connection_target_unknown:${world.id}:${target}`);
    if(target===world.id)throw new Error(`world_connection_self_reference:${world.id}`);
    const key=edgeKey(world.id,target),existing=edges.get(key);
    if(existing){existing.bidirectional=true;continue;}
    edges.set(key,{id:key,from:world.id,to:target,bidirectional:false,enabled:true});
  }
}

export const WORLD_CONNECTIONS=Object.freeze([...edges.values()].map(edge=>Object.freeze({...edge})));

export function connectionsFrom(worldId,{enabledOnly=true}={}){
  const id=String(worldId||'');
  return WORLD_CONNECTIONS.filter(edge=>(!enabledOnly||edge.enabled)&&(edge.from===id||edge.bidirectional&&edge.to===id)).map(edge=>edge.from===id?edge.to:edge.from);
}
export function connectionBetween(a,b){
  const key=edgeKey(String(a||''),String(b||''));
  return WORLD_CONNECTIONS.find(edge=>edge.id===key)||null;
}
export function areWorldsConnected(a,b){return !!connectionBetween(a,b);}
export function validateWorldConnections(){
  for(const edge of WORLD_CONNECTIONS){if(!ids.has(edge.from)||!ids.has(edge.to)||edge.from===edge.to)return false;}
  return true;
}

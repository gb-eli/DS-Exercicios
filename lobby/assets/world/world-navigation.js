import { WORLD_REGISTRY } from './world-registry.js?v=14.10.8.92-f90-graphics';

const numberOrNull=value=>Number.isFinite(Number(value))?Number(value):null;
const freeze=value=>Object.freeze(value);

function resolveWorld(ref,field='world'){
  const world=WORLD_REGISTRY.resolve(ref);
  if(!world)throw new RangeError(`world_navigation_${field}_unknown:${String(ref||'')}`);
  if(!world.enabled)throw new RangeError(`world_navigation_${field}_disabled:${world.id}`);
  return world;
}

function normalizePortal(sourceWorld,portal){
  const target=resolveWorld(portal.targetWorldId,'portal_target');
  if(!WORLD_REGISTRY.areConnected(sourceWorld.id,target.id))throw new Error(`world_navigation_portal_not_connected:${sourceWorld.id}:${target.id}:${portal.id}`);
  return freeze({
    key:`${sourceWorld.id}:${portal.id}`,
    id:String(portal.id),
    sourceWorldId:sourceWorld.id,
    sourceScene:sourceWorld.scene,
    targetWorldId:target.id,
    targetScene:target.scene,
    targetSpawn:portal.targetSpawn?String(portal.targetSpawn):null,
    type:String(portal.type||'world-portal'),
    name:String(portal.name||portal.label||portal.id),
    label:String(portal.label||portal.name||portal.id),
    x:numberOrNull(portal.x),
    y:numberOrNull(portal.y)??0,
    z:numberOrNull(portal.z),
    radius:numberOrNull(portal.radius),
    enabled:portal.enabled!==false,
    sourcePortal:portal
  });
}

const portals=[];
for(const sourceWorld of WORLD_REGISTRY.manifests){
  for(const portal of sourceWorld.portals){
    if(!portal.targetWorldId)continue;
    portals.push(normalizePortal(sourceWorld,portal));
  }
}
export const WORLD_PORTALS=freeze(portals);
const byKey=new Map(WORLD_PORTALS.map(portal=>[portal.key,portal]));
const bySourceAndId=new Map(WORLD_PORTALS.map(portal=>[`${portal.sourceWorldId}:${portal.id}`,portal]));
const bySourceAndType=new Map();
for(const portal of WORLD_PORTALS){
  const key=`${portal.sourceWorldId}:${portal.type}`;
  if(!bySourceAndType.has(key))bySourceAndType.set(key,portal);
}

export function listWorldPortals(sourceRef=null){
  if(sourceRef==null)return WORLD_PORTALS;
  const source=resolveWorld(sourceRef,'source');
  return WORLD_PORTALS.filter(portal=>portal.sourceWorldId===source.id&&portal.enabled);
}

export function getWorldPortal(sourceRef,portalRef){
  const source=resolveWorld(sourceRef,'source');
  const key=String(portalRef?.id||portalRef||'').trim();
  if(!key)return null;
  return bySourceAndId.get(`${source.id}:${key}`)||bySourceAndType.get(`${source.id}:${key}`)||null;
}

export function findPortalForTransition(sourceRef,targetRef){
  const source=resolveWorld(sourceRef,'source'),target=resolveWorld(targetRef,'target');
  return WORLD_PORTALS.find(portal=>portal.enabled&&portal.sourceWorldId===source.id&&portal.targetWorldId===target.id)||null;
}

export function resolveWorldTransition({from,to=null,portal=null,position=null,requireConnection=false,reason='world_transition'}={}){
  const source=resolveWorld(from,'source');
  let portalRecord=null,target=null;
  if(portal){
    portalRecord=getWorldPortal(source.id,portal);
    if(!portalRecord)throw new RangeError(`world_navigation_portal_unknown:${source.id}:${String(portal?.id||portal||'')}`);
    target=resolveWorld(portalRecord.targetWorldId,'target');
  }else target=resolveWorld(to,'target');
  const same=source.id===target.id;
  const connected=same||WORLD_REGISTRY.areConnected(source.id,target.id);
  if(requireConnection&&!connected)throw new RangeError(`world_navigation_not_connected:${source.id}:${target.id}`);
  const x=numberOrNull(position?.x)??target.spawn.x,z=numberOrNull(position?.z)??target.spawn.z,y=numberOrNull(position?.y)??target.spawn.y??0;
  return freeze({
    id:`${source.id}->${target.id}`,
    reason:String(reason||'world_transition'),
    source,
    target,
    portal:portalRecord,
    connected,
    sameWorld:same,
    position:freeze({x,y,z}),
    presenceArea:target.presenceArea,
    targetSpawn:portalRecord?.targetSpawn||target.spawn.id||null
  });
}

export function validateWorldNavigation(){
  for(const portal of WORLD_PORTALS){
    if(!WORLD_REGISTRY.has(portal.sourceWorldId)||!WORLD_REGISTRY.has(portal.targetWorldId))return false;
    if(!WORLD_REGISTRY.areConnected(portal.sourceWorldId,portal.targetWorldId))return false;
    if(portal.x==null||portal.z==null)return false;
  }
  return true;
}

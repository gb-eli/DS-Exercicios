import { WORLD_REGISTRY } from './world-registry.js?v=14.10.8.92-f90-graphics';

export const AIRDROP_SECTOR_SCHEMA=1;

const STRATEGIC_LAYOUT=Object.freeze({
  'campus-ds':{x:50,y:52},'village-1ds':{x:27,y:40},'village-2ds':{x:42,y:30},'village-3ds':{x:58,y:30},'village-sub':{x:73,y:40},'campus-library':{x:34,y:55},'campus-labs':{x:50,y:70},'campus-neon':{x:66,y:55},
  'vale-silicio':{x:12,y:18},'rural-agv':{x:10,y:61},'military-agv':{x:27,y:82},'museu-hardware-agv':{x:50,y:89},
  'parque-diversoes-agv':{x:73,y:82},'colegio-agv':{x:90,y:61},'labirinto-armadilhas':{x:88,y:18}
});

export const AIRDROP_GROUND_WORLD_IDS=Object.freeze([
  'campus-ds','village-1ds','village-2ds','village-3ds','village-sub','campus-library','campus-labs','campus-neon',
  'vale-silicio','rural-agv','military-agv','parque-diversoes-agv',
  'colegio-agv','labirinto-armadilhas','museu-hardware-agv'
]);
export const AIRDROP_EXCLUDED_WORLD_IDS=Object.freeze(['space-agv','moon-agv','mars-agv']);

const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const safeBounds=world=>world?.bounds||{minX:-50,maxX:50,minZ:-50,maxZ:50};
function defaultLanding(world){
  const b=safeBounds(world),spawn=world?.spawn||{x:0,z:0},margin=Math.max(2,Math.min(10,(b.maxX-b.minX)*.08,(b.maxZ-b.minZ)*.08));
  return Object.freeze({
    x:clamp(spawn.x,b.minX+margin,b.maxX-margin),
    z:clamp(spawn.z,b.minZ+margin,b.maxZ-margin)
  });
}
function sectorFor(id){
  const world=WORLD_REGISTRY.get(id);if(!world)return null;
  const position=STRATEGIC_LAYOUT[id]||{x:50,y:50},landing=defaultLanding(world),bounds=safeBounds(world);
  return Object.freeze({
    id:`drop-${id}`,worldId:id,scene:world.scene,name:world.name,shortName:world.identity?.shortName||world.name,
    icon:world.identity?.icon||'◈',category:world.category,strategicX:Number(position.x),strategicY:Number(position.y),
    landing,bounds:Object.freeze({...bounds}),accent:world.identity?.accent||null,
    destinations:Object.freeze((world.destinations||[]).slice(0,8).map(item=>Object.freeze({id:item.id,name:item.name||item.label||item.id,x:Number(item.x)||0,z:Number(item.z)||0,kind:item.kind||item.type||'poi'})))
  });
}
export const AIRDROP_SECTORS=Object.freeze(AIRDROP_GROUND_WORLD_IDS.map(sectorFor).filter(Boolean));
const byWorld=new Map(AIRDROP_SECTORS.map(s=>[s.worldId,s]));
export function getAirdropSector(ref){const key=String(ref||'').replace(/^drop-/,'');return byWorld.get(key)||AIRDROP_SECTORS[0]||null;}
export function isAirdropWorld(ref){return byWorld.has(String(ref||'').replace(/^drop-/,''));}
export function airdropLandingPoint(ref,{x=null,z=null}={}){
  const sector=getAirdropSector(ref);if(!sector)return null;const b=sector.bounds,margin=Math.max(1.5,Math.min(8,(b.maxX-b.minX)*.06,(b.maxZ-b.minZ)*.06));
  return Object.freeze({x:clamp(x??sector.landing.x,b.minX+margin,b.maxX-margin),z:clamp(z??sector.landing.z,b.minZ+margin,b.maxZ-margin)});
}
export function airdropStrategicSnapshot(selectedWorldId='campus-ds'){
  const selected=getAirdropSector(selectedWorldId)||AIRDROP_SECTORS[0]||null;
  return Object.freeze({schemaVersion:AIRDROP_SECTOR_SCHEMA,selectedWorldId:selected?.worldId||null,sectors:AIRDROP_SECTORS,excludedWorldIds:AIRDROP_EXCLUDED_WORLD_IDS});
}

import { WORLD_REGISTRY } from './world-registry.js?v=14.10.8.83-o3';

export const GLOBAL_MAP_SCHEMA=1;

const CATEGORY_LABELS=Object.freeze({
  campus:'Campus',technology:'Tecnologia',rural:'Rural',operations:'Operações',space:'Espaço',
  entertainment:'Entretenimento',education:'Educação',challenge:'Desafio',museum:'Museu'
});

const EVENT_KIND_RE=/(event|ride|race|challenge|sport|game|cinema|mission|training)/i;
const clean=value=>String(value??'').trim();

export function globalMapCategoryLabel(category){
  const key=clean(category);return CATEGORY_LABELS[key]||key||'Outro';
}

export function globalMapAvailability(world){
  if(!world)return Object.freeze({key:'unknown',label:'Indisponível',maintenance:true});
  if(world.enabled===false)return Object.freeze({key:'maintenance',label:'Em manutenção',maintenance:true});
  return Object.freeze({key:'available',label:'Disponível',maintenance:false});
}

export function globalMapEvents(world){
  if(!world)return Object.freeze([]);
  const declared=Array.isArray(world.events)?world.events:[];
  if(declared.length)return Object.freeze(declared.map(event=>Object.freeze({...event})));
  const inferred=(world.destinations||[]).filter(item=>EVENT_KIND_RE.test(`${item.type||''} ${item.kind||''} ${item.id||''}`));
  return Object.freeze(inferred.map(item=>Object.freeze({id:item.id,name:item.name||item.label||item.id,kind:item.type||item.kind||'experience'})));
}

export function buildWorldPopulation(presenceRows=[],current={}){
  const counts=new Map(WORLD_REGISTRY.manifests.map(world=>[world.id,0]));
  for(const row of Array.isArray(presenceRows)?presenceRows:[]){
    const world=WORLD_REGISTRY.byPresenceArea(row?.area)||WORLD_REGISTRY.resolve(row?.worldId||row?.scene);
    if(world)counts.set(world.id,(counts.get(world.id)||0)+1);
  }
  const local=WORLD_REGISTRY.resolve(current.worldId||current.scene||current.area);
  if(local)counts.set(local.id,(counts.get(local.id)||0)+1);
  return counts;
}

function mapLayout(){
  const positions=new Map();
  positions.set('campus-ds',Object.freeze({x:50,y:53}));
  positions.set('space-agv',Object.freeze({x:50,y:20}));
  positions.set('moon-agv',Object.freeze({x:27,y:6}));
  positions.set('mars-agv',Object.freeze({x:73,y:6}));
  const orbit=['vale-silicio','rural-agv','military-agv','parque-diversoes-agv','colegio-agv','labirinto-armadilhas','museu-hardware-agv'];
  const points=[{x:18,y:32},{x:13,y:63},{x:28,y:86},{x:72,y:86},{x:87,y:63},{x:82,y:32},{x:50,y:93}];
  orbit.forEach((id,index)=>positions.set(id,Object.freeze(points[index])));
  for(const world of WORLD_REGISTRY.manifests){
    if(!positions.has(world.id))positions.set(world.id,Object.freeze({x:50,y:50}));
  }
  return positions;
}
export const GLOBAL_MAP_LAYOUT=mapLayout();

export function createGlobalMapSnapshot({presenceRows=[],currentScene='campus',currentArea='central',selectedWorldId=null}={}){
  const population=buildWorldPopulation(presenceRows,{scene:currentScene,area:currentArea});
  const currentWorld=WORLD_REGISTRY.resolve(currentScene)||WORLD_REGISTRY.byPresenceArea(currentArea)||WORLD_REGISTRY.get('campus-ds');
  const selected=WORLD_REGISTRY.get(selectedWorldId)||currentWorld||WORLD_REGISTRY.manifests[0]||null;
  const worlds=WORLD_REGISTRY.manifests.map(world=>{
    const status=globalMapAvailability(world),events=globalMapEvents(world);
    return Object.freeze({
      id:world.id,scene:world.scene,name:world.name,version:world.version,category:world.category,
      categoryLabel:globalMapCategoryLabel(world.category),enabled:world.enabled,status,
      icon:world.identity?.icon||'◈',shortName:world.identity?.shortName||world.name,
      population:population.get(world.id)||0,isCurrent:world.id===currentWorld?.id,
      connectionIds:WORLD_REGISTRY.connectionsFrom(world.id),connections:WORLD_REGISTRY.connectionsFrom(world.id).map(id=>WORLD_REGISTRY.get(id)).filter(Boolean),
      portals:world.portals||[],pois:world.destinations||[],events,interiors:world.interiors||[],
      capabilities:world.capabilities||{},environment:world.environment||{},position:GLOBAL_MAP_LAYOUT.get(world.id)||{x:50,y:50}
    });
  });
  return Object.freeze({schemaVersion:GLOBAL_MAP_SCHEMA,currentWorldId:currentWorld?.id||null,selectedWorldId:selected?.id||null,worlds:Object.freeze(worlds),connections:WORLD_REGISTRY.connections});
}

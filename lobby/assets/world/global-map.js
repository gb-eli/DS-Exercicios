import { WORLD_REGISTRY } from './world-registry.js?v=14.10.8.92-f90-graphics';

export const GLOBAL_MAP_SCHEMA=1;

const CATEGORY_LABELS=Object.freeze({
  campus:'Campus',technology:'Tecnologia',rural:'Rural',operations:'Operações',space:'Espaço',
  entertainment:'Entretenimento',education:'Educação',challenge:'Desafio',museum:'Museu','campus-module':'Módulo do Campus'
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
  // F86: o Campus é hub; as quatro Vilas são distritos próprios com espaço visual real,
  // sem competir em escala com atrações internas do Campus.
  positions.set('campus-ds',Object.freeze({x:50,y:52}));
  positions.set('village-1ds',Object.freeze({x:33,y:42}));
  positions.set('village-2ds',Object.freeze({x:67,y:42}));
  positions.set('village-3ds',Object.freeze({x:33,y:63}));
  positions.set('village-sub',Object.freeze({x:67,y:63}));
  positions.set('campus-library',Object.freeze({x:38,y:55}));
  positions.set('campus-labs',Object.freeze({x:50,y:70}));
  positions.set('campus-neon',Object.freeze({x:62,y:55}));
  positions.set('space-agv',Object.freeze({x:50,y:16}));
  positions.set('moon-agv',Object.freeze({x:34,y:5}));
  positions.set('mars-agv',Object.freeze({x:66,y:5}));
  const outer={
    'vale-silicio':{x:14,y:24},'rural-agv':{x:9,y:53},'military-agv':{x:20,y:84},
    'museu-hardware-agv':{x:50,y:91},'parque-diversoes-agv':{x:80,y:84},
    'colegio-agv':{x:91,y:53},'labirinto-armadilhas':{x:86,y:24}
  };
  for(const [id,pos] of Object.entries(outer))positions.set(id,Object.freeze(pos));
  for(const world of WORLD_REGISTRY.manifests)if(!positions.has(world.id))positions.set(world.id,Object.freeze({x:50,y:50}));
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

const cache=new Map();
const LOADERS=Object.freeze({
  'campus-ds':()=>import('../lobby3d.js?v=14.10.8.96-f9411-graphics-streaming'),
  'village-1ds':()=>import('../village3d.js?v=14.10.8.96-f948-camera-v2'),
  'village-2ds':()=>import('../village3d.js?v=14.10.8.96-f948-camera-v2'),
  'village-3ds':()=>import('../village3d.js?v=14.10.8.96-f948-camera-v2'),
  'village-sub':()=>import('../village3d.js?v=14.10.8.96-f948-camera-v2'),
  'campus-library':()=>import('../campus-module3d.js?v=14.10.8.96-f948-camera-v2'),
  'campus-labs':()=>import('../campus-module3d.js?v=14.10.8.96-f948-camera-v2'),
  'campus-neon':()=>import('../campus-module3d.js?v=14.10.8.96-f948-camera-v2'),
  'vale-silicio':()=>import('../vale3d.js?v=14.10.8.96-f9411-graphics-streaming'),
  'rural-agv':()=>import('../rural3d.js?v=14.10.8.96-f9411-graphics-streaming'),
  'military-agv':()=>import('../military3d.js?v=14.10.8.96-f948-camera-v2'),
  'space-agv':()=>import('../space3d.js?v=14.10.8.96-f948-camera-v2'),
  'moon-agv':()=>import('../moon3d.js?v=14.10.8.96-f948-camera-v2'),
  'mars-agv':()=>import('../mars3d.js?v=14.10.8.96-f948-camera-v2'),
  'parque-diversoes-agv':()=>import('../parque-diversoes-agv3d.js?v=14.10.8.96-f948-camera-v2'),
  'colegio-agv':()=>import('../colegio-agv-host.js?v=14.10.8.96-f948-camera-v2'),
  'labirinto-armadilhas':()=>import('../labirinto-armadilhas-host.js?v=14.10.8.96-f948-camera-v2'),
  'museu-hardware-agv':()=>import('../museu-hardware3d.js?v=14.10.8.96-f948-camera-v2')
});
export function canPrefetchWorld3D(worldId){return typeof LOADERS[String(worldId||'')]==='function';}
export function prefetchWorld3D(worldId){
  const id=String(worldId||'');if(!canPrefetchWorld3D(id))return Promise.resolve(null);if(cache.has(id))return cache.get(id);
  const task=Promise.resolve().then(()=>LOADERS[id]()).catch(error=>{cache.delete(id);throw error;});cache.set(id,task);return task;
}
export function prefetchedWorld3D(worldId){return cache.has(String(worldId||''));}
export function clearWorldPrefetch(worldId){cache.delete(String(worldId||''));}

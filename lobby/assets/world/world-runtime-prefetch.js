const cache=new Map();
const LOADERS=Object.freeze({
  'campus-ds':()=>import('../lobby3d.js?v=14.10.8.96-f94-auto-calibration'),
  'village-1ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-2ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-3ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-sub':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'campus-library':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'campus-labs':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'campus-neon':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'vale-silicio':()=>import('../vale3d.js?v=14.10.8.93-f91-external-graphics'),
  'rural-agv':()=>import('../rural3d.js?v=14.10.8.93-f91-external-graphics'),
  'military-agv':()=>import('../military3d.js?v=14.10.8.94-f92-mission-graphics'),
  'space-agv':()=>import('../space3d.js?v=14.10.8.94-f92-mission-graphics'),
  'moon-agv':()=>import('../moon3d.js?v=14.10.8.94-f92-mission-graphics'),
  'mars-agv':()=>import('../mars3d.js?v=14.10.8.94-f92-mission-graphics'),
  'parque-diversoes-agv':()=>import('../parque-diversoes-agv3d.js?v=14.10.8.96-f94-auto-calibration'),
  'colegio-agv':()=>import('../colegio-agv-host.js?v=14.10.8.96-f94-auto-calibration'),
  'labirinto-armadilhas':()=>import('../labirinto-armadilhas-host.js?v=14.10.8.96-f94-auto-calibration'),
  'museu-hardware-agv':()=>import('../museu-hardware3d.js?v=14.10.8.95-f93-special-graphics')
});
export function canPrefetchWorld3D(worldId){return typeof LOADERS[String(worldId||'')]==='function';}
export function prefetchWorld3D(worldId){
  const id=String(worldId||'');if(!canPrefetchWorld3D(id))return Promise.resolve(null);if(cache.has(id))return cache.get(id);
  const task=Promise.resolve().then(()=>LOADERS[id]()).catch(error=>{cache.delete(id);throw error;});cache.set(id,task);return task;
}
export function prefetchedWorld3D(worldId){return cache.has(String(worldId||''));}
export function clearWorldPrefetch(worldId){cache.delete(String(worldId||''));}

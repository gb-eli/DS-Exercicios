const cache=new Map();
const LOADERS=Object.freeze({
  'campus-ds':()=>import('../lobby3d.js?v=14.10.8.92-f90-graphics'),
  'village-1ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-2ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-3ds':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'village-sub':()=>import('../village3d.js?v=14.10.8.92-f90-graphics'),
  'campus-library':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'campus-labs':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'campus-neon':()=>import('../campus-module3d.js?v=14.10.8.92-f90-graphics'),
  'vale-silicio':()=>import('../vale3d.js?v=14.10.8.92-f90-graphics'),
  'rural-agv':()=>import('../rural3d.js?v=14.10.8.92-f90-graphics'),
  'military-agv':()=>import('../military3d.js?v=14.10.8.92-f90-graphics'),
  'parque-diversoes-agv':()=>import('../parque-diversoes-agv3d.js?v=14.10.8.92-f90-graphics'),
  'colegio-agv':()=>import('../colegio-agv-host.js?v=14.10.8.92-f90-graphics'),
  'labirinto-armadilhas':()=>import('../labirinto-armadilhas-host.js?v=14.10.8.92-f90-graphics'),
  'museu-hardware-agv':()=>import('../museu-hardware3d.js?v=0.8.0-f90-graphics')
});
export function canPrefetchWorld3D(worldId){return typeof LOADERS[String(worldId||'')]==='function';}
export function prefetchWorld3D(worldId){
  const id=String(worldId||'');if(!canPrefetchWorld3D(id))return Promise.resolve(null);if(cache.has(id))return cache.get(id);
  const task=Promise.resolve().then(()=>LOADERS[id]()).catch(error=>{cache.delete(id);throw error;});cache.set(id,task);return task;
}
export function prefetchedWorld3D(worldId){return cache.has(String(worldId||''));}
export function clearWorldPrefetch(worldId){cache.delete(String(worldId||''));}

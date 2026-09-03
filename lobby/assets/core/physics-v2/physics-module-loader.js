export const PHYSICS_MODULE_LOADER_VERSION=1;
export const RAPIER3D_COMPAT_VERSION='0.20.0';
export const THREE_MESH_BVH_VERSION='0.9.14';
export const RAPIER3D_COMPAT_URL=`https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@${RAPIER3D_COMPAT_VERSION}/+esm`;
export const THREE_MESH_BVH_URL=`https://cdn.jsdelivr.net/npm/three-mesh-bvh@${THREE_MESH_BVH_VERSION}/+esm`;

const timeout=(ms,label)=>new Promise((_,reject)=>setTimeout(()=>reject(new Error(`${label}_timeout`)),Math.max(250,Number(ms)||5000)));
const defaultImporter=url=>import(url);
let rapierPromise=null,bvhPromise=null;

function normalizeRapierModule(mod){
  if(!mod)return null;
  if(mod.World&&mod.ColliderDesc)return mod;
  if(mod.default?.World&&mod.default?.ColliderDesc)return mod.default;
  return mod.default||mod;
}

export async function loadRapier3D({timeoutMs=6500,importer=defaultImporter,forceReload=false}={}){
  if(!forceReload&&rapierPromise)return rapierPromise;
  const task=(async()=>{
    const imported=await Promise.race([importer(RAPIER3D_COMPAT_URL),timeout(timeoutMs,'rapier_import')]);
    const RAPIER=normalizeRapierModule(imported);
    const init=typeof RAPIER?.init==='function'?RAPIER.init.bind(RAPIER):typeof imported?.init==='function'?imported.init.bind(imported):null;
    if(init)await Promise.race([Promise.resolve(init()),timeout(timeoutMs,'rapier_init')]);
    if(!RAPIER?.World||!RAPIER?.ColliderDesc||!RAPIER?.RigidBodyDesc)throw new Error('rapier_api_incomplete');
    return Object.freeze({available:true,kind:'rapier',version:RAPIER3D_COMPAT_VERSION,url:RAPIER3D_COMPAT_URL,module:RAPIER});
  })().catch(error=>Object.freeze({available:false,kind:'rapier',version:RAPIER3D_COMPAT_VERSION,url:RAPIER3D_COMPAT_URL,error:String(error?.message||error)}));
  rapierPromise=task;
  return task;
}

export async function loadThreeMeshBVH({timeoutMs=5500,importer=defaultImporter,forceReload=false}={}){
  if(!forceReload&&bvhPromise)return bvhPromise;
  const task=(async()=>{
    const imported=await Promise.race([importer(THREE_MESH_BVH_URL),timeout(timeoutMs,'bvh_import')]);
    const MeshBVH=imported?.MeshBVH||imported?.default?.MeshBVH;
    if(typeof MeshBVH!=='function')throw new Error('mesh_bvh_api_incomplete');
    return Object.freeze({available:true,kind:'three-mesh-bvh',version:THREE_MESH_BVH_VERSION,url:THREE_MESH_BVH_URL,module:imported,MeshBVH});
  })().catch(error=>Object.freeze({available:false,kind:'three-mesh-bvh',version:THREE_MESH_BVH_VERSION,url:THREE_MESH_BVH_URL,error:String(error?.message||error)}));
  bvhPromise=task;
  return task;
}

export function physicsPilotPolicy({quality='medium',device={},search=null}={}){
  let mode='auto';
  try{mode=new URLSearchParams(search??globalThis.location?.search??'').get('physics')||'auto';}catch{}
  mode=String(mode).toLowerCase();
  if(['off','none','kinematic','legacy'].includes(mode))return Object.freeze({enabled:false,forced:false,mode:'kinematic',reason:'user_disabled'});
  if(['on','rapier','pilot','force'].includes(mode))return Object.freeze({enabled:true,forced:true,mode:'rapier',reason:'user_forced'});
  const q=String(quality||'medium').toLowerCase(),mobile=!!device.mobile,saveData=!!device.saveData,hardware=Number(device.hardware||device.deviceMemory||4),cores=Number(device.cores||device.hardwareConcurrency||4);
  if(saveData)return Object.freeze({enabled:false,forced:false,mode:'kinematic',reason:'save_data'});
  if(mobile&&hardware<=4)return Object.freeze({enabled:false,forced:false,mode:'kinematic',reason:'mobile_constrained'});
  const enabled=!mobile&&hardware>=8&&cores>=6&&['high','ultra'].includes(q);
  return Object.freeze({enabled,forced:false,mode:enabled?'rapier':'kinematic',reason:enabled?'desktop_capable':'device_constrained'});
}

export function resetPhysicsModuleLoaderForTests(){rapierPromise=null;bvhPromise=null;}

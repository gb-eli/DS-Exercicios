export const WORLD_RUNTIME_CONTRACT_VERSION=2;
export const WORLD_RUNTIME_LIFECYCLE=Object.freeze(['init','load','start','pause','resume','update','interact','enterInterior','exitInterior','setQuality','stop','dispose']);

const noopTrue=()=>true,noopFalse=()=>false;
function call(target,name,...args){const fn=target?.[name];return typeof fn==='function'?fn.apply(target,args):undefined;}

export function runtimeCapabilities(runtime={}){
  return Object.freeze({
    quality:typeof runtime.setQuality==='function',camera:typeof runtime.setCameraMode==='function'||typeof runtime.toggleCamera==='function',
    interaction:typeof runtime.interact==='function'||typeof runtime.useInteraction==='function',interior:typeof runtime.enterBuilding==='function'||typeof runtime.enterInterior==='function',
    vehicle:typeof runtime.enterVehicle==='function'||typeof runtime.startDriving==='function'||typeof runtime.getVehicleState==='function',
    teleport:typeof runtime.teleportTo==='function',observability:typeof runtime.getObservabilitySnapshot==='function'
  });
}

export function normalizeWorldRuntime(runtime,{worldId='unknown',scene='unknown',mode='unknown',label=null}={}){
  if(!runtime||typeof runtime!=='object'||typeof runtime.stop!=='function')throw new TypeError('world_runtime_contract_invalid');
  if(runtime.__agvRuntimeContractVersion===WORLD_RUNTIME_CONTRACT_VERSION)return runtime;
  let phase='running',stopped=false,disposed=false;
  const caps=runtimeCapabilities(runtime);
  const facade={
    __agvRuntimeContractVersion:WORLD_RUNTIME_CONTRACT_VERSION,
    get runtimeContract(){return Object.freeze({version:WORLD_RUNTIME_CONTRACT_VERSION,worldId,scene,mode,label:label||worldId,phase,capabilities:caps});},
    init:async(...args)=>{phase='initialized';return call(runtime,'init',...args)??true;},
    load:async(...args)=>{phase='loaded';return call(runtime,'load',...args)??true;},
    start:async(...args)=>{phase='running';return call(runtime,'start',...args)??true;},
    pause:(...args)=>{phase='paused';return call(runtime,'pause',...args)??true;},
    resume:(...args)=>{phase='running';return call(runtime,'resume',...args)??true;},
    update:(...args)=>call(runtime,'update',...args)??false,
    interact:(...args)=>call(runtime,'interact',...args)??call(runtime,'useInteraction',...args)??false,
    enterInterior:(...args)=>call(runtime,'enterInterior',...args)??call(runtime,'enterBuilding',...args)??false,
    exitInterior:(...args)=>call(runtime,'exitInterior',...args)??call(runtime,'exitBuilding',...args)??false,
    setQuality:(...args)=>typeof runtime.setQuality==='function'?runtime.setQuality(...args):false,
    stop:(...args)=>{if(stopped)return false;stopped=true;phase='stopped';const result=call(runtime,'stop',...args);return result??true;},
    dispose:(...args)=>{if(disposed)return false;disposed=true;if(!stopped){stopped=true;call(runtime,'stop','dispose');}phase='disposed';const result=call(runtime,'dispose',...args);return result??true;},
    getRuntimePhase:()=>phase,
    getRuntimeCapabilities:()=>caps,
    getRawRuntime:()=>runtime
  };
  return new Proxy(facade,{get(target,prop,receiver){if(Reflect.has(target,prop))return Reflect.get(target,prop,receiver);const value=runtime[prop];return typeof value==='function'?value.bind(runtime):value;},set(target,prop,value,receiver){if(Reflect.has(target,prop))return Reflect.set(target,prop,value,receiver);runtime[prop]=value;return true;},has(target,prop){return Reflect.has(target,prop)||prop in runtime;},ownKeys(target){return [...new Set([...Reflect.ownKeys(runtime),...Reflect.ownKeys(target)])];},getOwnPropertyDescriptor(target,prop){return Reflect.getOwnPropertyDescriptor(target,prop)||Object.getOwnPropertyDescriptor(runtime,prop)||{configurable:true,enumerable:true,writable:true,value:runtime[prop]};}});
}

export function assertWorldRuntimeV2(runtime){
  if(!runtime||runtime.__agvRuntimeContractVersion!==WORLD_RUNTIME_CONTRACT_VERSION)throw new TypeError('world_runtime_v2_required');
  for(const name of WORLD_RUNTIME_LIFECYCLE)if(typeof runtime[name]!=='function')throw new TypeError(`world_runtime_v2_method_missing:${name}`);
  return runtime;
}

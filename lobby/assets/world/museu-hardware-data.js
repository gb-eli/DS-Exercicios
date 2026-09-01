const RUNTIME_URL=new URL('../../data/museu-hardware/runtime.json?v=0.8.0',import.meta.url).href;
let cache=null;
export async function loadMuseuHardwareRuntime({signal}={}){
  if(cache)return cache;
  const response=await fetch(RUNTIME_URL,{cache:'force-cache',signal});
  if(!response.ok)throw new Error(`museu_hardware_runtime_http_${response.status}`);
  const data=await response.json();
  if(!data||data.map_id!=='museu-hardware-agv'||!Array.isArray(data.galleries))throw new Error('museu_hardware_runtime_invalid');
  cache=Object.freeze(data);
  return cache;
}
export function clearMuseuHardwareRuntimeCache(){cache=null;}

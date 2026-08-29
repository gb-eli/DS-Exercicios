import { VALE_VERSION } from './vale-silicio-shared.js?v=14.10.8.53';

const RUNTIME_URL=new URL(`../../data/vale-silicio/runtime-v2.json?v=${VALE_VERSION}`,import.meta.url).href;
let cached=null;
function assertRuntime(data){
  if(!data||typeof data!=='object')throw new Error('vale_runtime_invalid');
  if(!Array.isArray(data.companies)||!data.companies.length)throw new Error('vale_runtime_companies_missing');
  if(!Array.isArray(data.world?.districts)||!data.world.districts.length)throw new Error('vale_runtime_districts_missing');
  const ids=new Set();
  for(const company of data.companies){if(!company?.id||ids.has(company.id))throw new Error('vale_runtime_company_id_invalid');ids.add(company.id);}
  return data;
}
export async function loadValeRuntime({signal}={}){
  if(cached)return cached;
  const response=await fetch(RUNTIME_URL,{cache:'no-store',signal,headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`vale_runtime_http_${response.status}`);
  cached=assertRuntime(await response.json());
  return cached;
}
export function validateValeRuntime(data){return assertRuntime(data);}
export function resetValeRuntimeCache(){cached=null;}

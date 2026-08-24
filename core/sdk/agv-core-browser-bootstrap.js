// AGV Core browser bootstrap — v14.10.0 audit.
// Usa o build UMD pinado do Supabase JS com contingência; nunca contém service_role/secret.
import { AGVCoreSDK } from './agv-core-sdk.js';

const SUPABASE_SOURCES=[
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',
  'https://unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js'
];

function loadScript(src,index){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;script.async=true;script.crossOrigin='anonymous';script.referrerPolicy='no-referrer';
    script.dataset.agvSupabaseUmd=String(index);
    let done=false;
    const finish=(ok)=>{if(done)return;done=true;clearTimeout(timer);script.onload=null;script.onerror=null;if(ok)resolve();else{script.remove();reject(new Error(`supabase_sdk_source_${index+1}_failed`));}};
    const timer=setTimeout(()=>finish(false),6500);
    script.onload=()=>finish(true);script.onerror=()=>finish(false);
    document.head.appendChild(script);
  });
}
async function resolveCreateClient(){
  if(globalThis.supabase?.createClient)return globalThis.supabase.createClient;
  let lastError=null;
  for(let index=0;index<SUPABASE_SOURCES.length;index+=1){
    try{await loadScript(SUPABASE_SOURCES[index],index);if(globalThis.supabase?.createClient)return globalThis.supabase.createClient;}catch(error){lastError=error;}
  }
  throw lastError||new Error('supabase_sdk_unavailable');
}

export async function bootAGVCore(config=globalThis.AGV_CORE_CONFIG){
  if(!config?.enabled)return null;
  if(!config.supabaseUrl||!config.publishableKey||!config.platformId)throw new Error('AGV_CORE_CONFIG incompleto');
  const createClient=await resolveCreateClient();
  const supabase=createClient(config.supabaseUrl,config.publishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  const core=new AGVCoreSDK({
    supabase,
    platformId:config.platformId,
    platformVersion:config.platformVersion||'unknown',
    integrationVersion:config.integrationVersion||'0.2.0'
  });
  globalThis.AGVCore=core;
  globalThis.AGVSupabase=supabase;
  try{const {data:{session}}=await supabase.auth.getSession();if(session)core.security.sessionCheck({surface:'browser-bootstrap'}).catch(()=>{})}catch{}
  document?.dispatchEvent?.(new CustomEvent('agv-core-ready',{detail:{platformId:config.platformId,version:core.version}}));
  return core;
}

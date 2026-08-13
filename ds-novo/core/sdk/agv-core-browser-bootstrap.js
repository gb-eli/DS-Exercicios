// Bootstrap opcional para páginas estáticas/GitHub Pages.
// A publishable key é pública; nunca coloque service_role/secret neste arquivo.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { AGVCoreSDK } from './agv-core-sdk.js';

export async function bootAGVCore(config=globalThis.AGV_CORE_CONFIG){
  if(!config?.enabled)return null;
  if(!config.supabaseUrl||!config.publishableKey||!config.platformId)throw new Error('AGV_CORE_CONFIG incompleto');
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
  document?.dispatchEvent?.(new CustomEvent('agv-core-ready',{detail:{platformId:config.platformId,version:core.version}}));
  return core;
}

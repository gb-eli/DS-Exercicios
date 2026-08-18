import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0';

async function loadCreateClient(){
  if(globalThis.supabase?.createClient) return globalThis.supabase.createClient;
  await new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-agv-supabase-umd]');
    if(existing){
      if(globalThis.supabase?.createClient) return resolve();
      existing.addEventListener('load',resolve,{once:true});
      existing.addEventListener('error',()=>reject(new Error('Falha ao carregar Supabase JS.')), {once:true});
      return;
    }
    const script=document.createElement('script');
    script.src=CDN;
    script.async=true;
    script.crossOrigin='anonymous';
    script.dataset.agvSupabaseUmd='1';
    script.onload=resolve;
    script.onerror=()=>reject(new Error('Falha ao carregar Supabase JS.'));
    document.head.appendChild(script);
  });
  if(!globalThis.supabase?.createClient) throw new Error('Supabase JS carregou sem createClient.');
  return globalThis.supabase.createClient;
}

const createClient=await loadCreateClient();
const AUTH_STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token';
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{storageKey:AUTH_STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

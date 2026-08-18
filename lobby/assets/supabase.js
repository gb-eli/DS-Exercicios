import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const createClient=globalThis.supabase?.createClient;
if(typeof createClient!=='function'){
  throw new Error('supabase_sdk_unavailable');
}

const AUTH_STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token';
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  auth:{
    storageKey:AUTH_STORAGE_KEY,
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true
  }
});

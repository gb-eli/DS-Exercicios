import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js?v=14.10.8.56';

const createClient=globalThis.supabase?.createClient;
if(typeof createClient!=='function'){
  throw new Error('supabase_sdk_unavailable');
}

const AUTH_STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token';
const NETWORK_TIMEOUT_MS=9000;
const nativeFetch=globalThis.fetch.bind(globalThis);

async function timedFetch(input,init={}){
  const controller=new AbortController();
  const upstream=init?.signal;
  const forwardAbort=()=>controller.abort(upstream?.reason);
  if(upstream?.aborted)forwardAbort();
  else upstream?.addEventListener?.('abort',forwardAbort,{once:true});
  const timer=setTimeout(()=>controller.abort(new DOMException('AGV network timeout','AbortError')),NETWORK_TIMEOUT_MS);
  try{return await nativeFetch(input,{...init,signal:controller.signal});}
  finally{clearTimeout(timer);upstream?.removeEventListener?.('abort',forwardAbort);}
}

export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  global:{fetch:timedFetch},
  auth:{
    storageKey:AUTH_STORAGE_KEY,
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true
  }
});
export { NETWORK_TIMEOUT_MS };

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js?v=14.10.8.18';

const SOURCES = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',
  'https://unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js'
];

function loadScript(src, index){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.async=true;
    script.crossOrigin='anonymous';
    script.referrerPolicy='no-referrer';
    script.dataset.agvSupabaseUmd=String(index);
    let done=false;
    const finish=(ok)=>{
      if(done)return;
      done=true;
      clearTimeout(timer);
      script.onload=null;
      script.onerror=null;
      if(ok)resolve();
      else{script.remove();reject(new Error(`Falha ao carregar Supabase JS da fonte ${index+1}.`));}
    };
    const timer=setTimeout(()=>finish(false),6500);
    script.onload=()=>finish(true);
    script.onerror=()=>finish(false);
    document.head.appendChild(script);
  });
}

async function loadCreateClient(){
  if(globalThis.supabase?.createClient) return globalThis.supabase.createClient;
  let lastError=null;
  for(let index=0;index<SOURCES.length;index+=1){
    try{
      await loadScript(SOURCES[index],index);
      if(globalThis.supabase?.createClient) return globalThis.supabase.createClient;
    }catch(error){lastError=error;}
  }
  throw lastError||new Error('Supabase JS indisponível nas fontes de contingência.');
}

function unavailableBuilder(error){
  let proxy=null;
  const base={
    then(resolve,reject){return Promise.resolve({data:null,error}).then(resolve,reject);},
    catch(reject){return Promise.resolve({data:null,error}).catch(reject);},
    finally(handler){return Promise.resolve({data:null,error}).finally(handler);}
  };
  proxy=new Proxy(base,{get(target,prop){
    if(prop in target)return target[prop];
    return ()=>proxy;
  }});
  return proxy;
}
function unavailableChannel(){
  const channel={
    on(){return channel;},
    subscribe(callback){queueMicrotask(()=>callback?.('CHANNEL_ERROR'));return channel;},
    async send(){return {status:'error'};},
    async unsubscribe(){return {status:'ok'};}
  };
  return channel;
}
function unavailableClient(error){
  const authResult=async()=>({data:{user:null,session:null},error});
  return {
    auth:{
      getUser:authResult,
      getSession:async()=>({data:{session:null},error}),
      signInWithPassword:async()=>({data:null,error}),
      signUp:async()=>({data:null,error}),
      signOut:async()=>({error:null}),
      updateUser:async()=>({data:null,error}),
      resetPasswordForEmail:async()=>({data:null,error}),
      onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}};}
    },
    functions:{invoke:async()=>({data:null,error})},
    from(){return unavailableBuilder(error);},
    rpc:async()=>({data:null,error}),
    channel(){return unavailableChannel();},
    removeChannel:async()=>({status:'ok'})
  };
}

let createClient=null;
let sdkError=null;
try{createClient=await loadCreateClient();}
catch(error){sdkError=error instanceof Error?error:new Error(String(error||'Supabase JS indisponível.'));console.error('[AGV] Supabase JS indisponível.',sdkError);}

export const SUPABASE_SDK_AVAILABLE=typeof createClient==='function';
export const SUPABASE_SDK_ERROR=sdkError;
const AUTH_STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token';
export const supabase=SUPABASE_SDK_AVAILABLE
  ? createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{storageKey:AUTH_STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})
  : unavailableClient(sdkError||new Error('Não foi possível carregar o serviço de autenticação.'));


const SESSION_INVALID_CODES=new Set(['session_revoked','session_claim_missing']);
let sessionInvalidating=null;
function sessionErrorCode(value){
  return String(value?.error||value?.code||value?.data?.error||value?.details?.error||'').trim();
}
export async function handleSessionInvalid(value){
  const code=sessionErrorCode(value);
  if(!SESSION_INVALID_CODES.has(code))return false;
  if(sessionInvalidating)return sessionInvalidating;
  sessionInvalidating=(async()=>{
    try{window.dispatchEvent(new CustomEvent('agv:session-invalid',{detail:{code}}));}catch(_){}
    try{await supabase.auth.signOut({scope:'local'});}catch(_){}
    try{localStorage.removeItem(AUTH_STORAGE_KEY);}catch(_){}
    return true;
  })().finally(()=>{setTimeout(()=>{sessionInvalidating=null;},500);});
  return sessionInvalidating;
}

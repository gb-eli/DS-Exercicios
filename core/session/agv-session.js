(function(global){
  'use strict';
  const MIN_TTL_MS = 60_000;
  const REFRESH_WAIT_MS = 6_000;
  const LOCK_TTL_MS = 8_000;
  function refFromUrl(url){ try{return new URL(url).hostname.split('.')[0];}catch{return '';} }
  function randomId(){
    try{const a=new Uint32Array(4);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16)).join('');}
    catch{return `${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  }
  function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
  function create(config={}){
    const supabaseUrl=String(config.supabaseUrl||'').replace(/\/$/,'');
    const publishableKey=String(config.publishableKey||'');
    const ref=refFromUrl(supabaseUrl);
    const storageKey=`sb-${ref}-auth-token`;
    const refreshLockKey=`${storageKey}:refresh-lock`;
    const lockName=`agv-session:${ref}:refresh`;
    const owner=randomId();
    let session=null, refreshing=null, destroyed=false, lifecycleTimer=null;
    function normalize(x){
      const s=x?.access_token?x:(x?.currentSession||x?.session||null);
      if(!s?.access_token)return null;
      if(!s.expires_at&&Number(s.expires_in)>0)s.expires_at=Math.floor(Date.now()/1000)+Number(s.expires_in);
      return s;
    }
    function readStored(){
      try{return normalize(JSON.parse(localStorage.getItem(storageKey)||'null'));}
      catch{return null;}
    }
    function read(){session=readStored();return session;}
    function save(s){session=normalize(s);if(session)localStorage.setItem(storageKey,JSON.stringify(session));else localStorage.removeItem(storageKey);return session;}
    function clear(){session=null;localStorage.removeItem(storageKey);}
    function valid(s=session,ttl=MIN_TTL_MS){if(!s?.access_token)return false;return !s.expires_at||Number(s.expires_at)*1000>Date.now()+ttl;}
    async function request(path,{method='GET',body,token,headers={}}={}){
      const h={apikey:publishableKey,...headers};
      const bearer=token===undefined?(session?.access_token||null):token;
      if(bearer)h.Authorization=`Bearer ${bearer}`;
      if(body!==undefined&&!h['Content-Type'])h['Content-Type']='application/json';
      const r=await fetch(`${supabaseUrl}${path}`,{method,headers:h,body:body===undefined?undefined:(typeof body==='string'?body:JSON.stringify(body))});
      const j=await r.json().catch(()=>({}));
      if(!r.ok){const e=new Error(j.error_description||j.reason||j.msg||j.message||j.error||`HTTP ${r.status}`);e.status=r.status;e.data=j;throw e;}
      return j;
    }
    function lockRecord(){try{return JSON.parse(localStorage.getItem(refreshLockKey)||'null');}catch{return null;}}
    async function withFallbackLock(fn){
      const deadline=Date.now()+REFRESH_WAIT_MS;
      while(Date.now()<deadline){
        const current=lockRecord();
        if(!current||Number(current.expiresAt||0)<Date.now()||current.owner===owner){
          const record={owner,expiresAt:Date.now()+LOCK_TTL_MS};
          try{localStorage.setItem(refreshLockKey,JSON.stringify(record));}catch{}
          const check=lockRecord();
          if(check?.owner===owner){
            try{return await fn();}
            finally{try{if(lockRecord()?.owner===owner)localStorage.removeItem(refreshLockKey);}catch{}}
          }
        }
        await sleep(80+Math.floor(Math.random()*120));
        const newer=readStored();
        if(newer&&valid(newer,30_000)){session=newer;return newer;}
      }
      return fn();
    }
    async function withRefreshLock(fn){
      if(global.navigator?.locks?.request){
        return global.navigator.locks.request(lockName,{mode:'exclusive'},fn);
      }
      return withFallbackLock(fn);
    }
    async function refresh(){
      if(refreshing)return refreshing;
      refreshing=withRefreshLock(async()=>{
        const initial=session||readStored();
        const latest=readStored();
        if(latest?.access_token&&initial?.access_token&&latest.access_token!==initial.access_token&&valid(latest,30_000)){session=latest;return latest;}
        const current=latest||initial;
        if(!current?.refresh_token){clear();return null;}
        try{
          const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:current.refresh_token},token:null});
          return save(next);
        }catch(e){
          const recovered=readStored();
          if(recovered?.access_token&&recovered.access_token!==current.access_token&&valid(recovered,0)){session=recovered;return recovered;}
          // Falha de rede/timeout não apaga o refresh token. Só uma rejeição Auth
          // definitiva invalida a sessão local. Isso evita logout acidental no Wi-Fi móvel.
          if(e?.status===400||e?.status===401)clear();
          throw e;
        }
      }).finally(()=>{refreshing=null;});
      return refreshing;
    }
    async function getSession({refreshIfNeeded=true,ttl=MIN_TTL_MS}={}){
      const stored=readStored();
      if(stored)session=stored;
      const s=session;
      if(!s)return null;
      if(valid(s,ttl))return s;
      if(!refreshIfNeeded)return valid(s,0)?s:null;
      try{return await refresh();}catch{return null;}
    }
    async function requireSession(){const s=await getSession();if(!s)throw new Error('Sessão expirada. Entre novamente.');return s;}
    async function getUser(){await requireSession();try{return await request('/auth/v1/user');}catch(e){if(e.status===401){const s=await refresh();if(s)return request('/auth/v1/user');}throw e;}}
    async function signIn(email,password){const s=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},token:null});return save(s);}
    async function signUpStudent(email,cgm,redirectTo){
      const path=redirectTo?`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`:'/auth/v1/signup';
      const data=await request(path,{method:'POST',body:{email,password:cgm,data:{cgm}},token:null});
      if(data?.access_token)save(data);return data;
    }
    async function resetPasswordForEmail(email,redirectTo){
      const path=redirectTo?`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`:'/auth/v1/recover';
      return request(path,{method:'POST',body:{email},token:null});
    }
    async function signOut({reload=false,scope='global'}={}){
      const allowed=new Set(['global','local','others']),chosen=allowed.has(scope)?scope:'global';
      try{if(session||read())await request(`/auth/v1/logout?scope=${encodeURIComponent(chosen)}`,{method:'POST'});}catch{}
      clear();
      if(reload)location.reload();
    }
    async function authorizedFetch(path,opts={}){await requireSession();try{return await request(path,opts);}catch(e){const code=String(e?.data?.error||'');if(e.status===401&&(code==='session_revoked'||code==='session_claim_missing')){clear();throw e;}if(e.status===401&&await refresh())return request(path,opts);throw e;}}
    function onStorage(fn){const handler=e=>{if(e.key===storageKey){read();fn?.(session);}};addEventListener('storage',handler);return()=>removeEventListener('storage',handler);}
    function lifecycleCheck(){
      if(destroyed||global.document?.hidden||global.navigator?.onLine===false)return;
      clearTimeout(lifecycleTimer);
      lifecycleTimer=setTimeout(()=>{getSession({refreshIfNeeded:true,ttl:120_000}).catch(()=>{});},120);
    }
    const lifecycleEvents=['focus','online'];
    lifecycleEvents.forEach(type=>global.addEventListener?.(type,lifecycleCheck));
    global.document?.addEventListener?.('visibilitychange',lifecycleCheck);
    function destroy(){destroyed=true;clearTimeout(lifecycleTimer);lifecycleEvents.forEach(type=>global.removeEventListener?.(type,lifecycleCheck));global.document?.removeEventListener?.('visibilitychange',lifecycleCheck);}
    read();
    return {storageKey,read,save,clear,valid,getSession,requireSession,refresh,getUser,signIn,signUpStudent,resetPasswordForEmail,signOut,request:authorizedFetch,rawRequest:request,onStorage,destroy,get session(){return session;}};
  }
  global.AGVSession={create};
})(window);

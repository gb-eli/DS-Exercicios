(()=>{
  'use strict';

  const VERSION='14.10.8.70';
  const SDK_VERSION='2.112.3';
  const SOURCES=[
    {src:'vendor/supabase/supabase.js',timeout:1600,kind:'local'},
    {src:'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',timeout:6000,kind:'cdn-jsdelivr'},
    {src:'https://unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',timeout:6000,kind:'cdn-unpkg'}
  ];
  const BOOT_TIMEOUT_MS=9000;
  const SW_WAIT_MS=1900;

  let bootStarted=false;
  let swPrepared=false;

  function setError(code){
    console.error('[AGV Lobby]',code);
    globalThis.__agvLobbyDiag?.exposeError?.(code,'Falha na cadeia de carregamento do Lobby');
    const login=document.getElementById('login');
    const game=document.getElementById('game-shell');
    const kicked=document.getElementById('kicked');
    const message=document.getElementById('login-message');
    login?.classList.remove('hidden');
    game?.classList.add('hidden');
    kicked?.classList.add('hidden');
    if(message){
      message.classList.add('error');
      message.textContent=`Não foi possível carregar o Lobby. Código: ${code}. As Atividades continuam disponíveis pelo Hub.`;
    }
  }

  function startBoot(){
    if(bootStarted)return;
    globalThis.__agvLobbyDiag?.record?.('stage',{stage:'boot_module_requested'});
    if(typeof globalThis.supabase?.createClient!=='function'){
      setError('supabase_sdk_missing_after_load');
      return;
    }
    bootStarted=true;
    const script=document.createElement('script');
    script.type='module';
    script.src=`assets/boot.js?v=${VERSION}-stage39-traffic`; 
    const timer=setTimeout(()=>setError('boot_module_timeout'),BOOT_TIMEOUT_MS);
    script.onload=()=>clearTimeout(timer);
    script.onerror=()=>{clearTimeout(timer);setError('boot_module_load_failed');};
    document.body.appendChild(script);
  }

  async function prepareServiceWorker(){
    if(swPrepared)return;
    swPrepared=true;
    try{
      globalThis.__agvLobbyDiag?.record?.('stage',{stage:'service_worker_wait'});
      const ready=globalThis.__agvLobbySwReady;
      if(ready && typeof ready.then==='function'){
        await Promise.race([ready,new Promise(resolve=>setTimeout(resolve,SW_WAIT_MS))]);
      }
    }catch(error){
      console.warn('[AGV Lobby] Cache persistente indisponível:',error);
    }
  }

  async function loadSource(index){
    if(typeof globalThis.supabase?.createClient==='function'){
      startBoot();
      return;
    }
    if(index>=SOURCES.length){
      setError(globalThis.navigator?.onLine===false?'supabase_sdk_offline_cache_miss':'supabase_sdk_load_failed');
      return;
    }

    if(index===1) await prepareServiceWorker();

    const source=SOURCES[index];
    globalThis.__agvLobbyDiag?.state?.sdk?.attempts?.push?.({t:Date.now(),kind:source.kind,status:'loading'});
    globalThis.__agvLobbyDiag?.record?.('sdk_attempt',{kind:source.kind,index});
    const script=document.createElement('script');
    script.src=source.src;
    script.async=true;
    script.crossOrigin='anonymous';
    script.referrerPolicy='no-referrer';
    script.dataset.agvSupabaseSource=String(index);
    script.dataset.agvSupabaseKind=source.kind;
    script.dataset.agvSupabaseVersion=SDK_VERSION;

    let done=false;
    const finish=(ok)=>{
      if(done)return;
      done=true;
      clearTimeout(timer);
      script.onload=null;
      script.onerror=null;
      if(ok && typeof globalThis.supabase?.createClient==='function'){
        if(document.documentElement?.dataset)document.documentElement.dataset.supabaseSource=source.kind;
        globalThis.__agvLobbyDiag?.update?.({sdk:{source:source.kind,version:SDK_VERSION}});
        globalThis.__agvLobbyDiag?.record?.('sdk_loaded',{kind:source.kind,index});
        startBoot();
      }else{
        globalThis.__agvLobbyDiag?.record?.('sdk_failed',{kind:source.kind,index});
        script.remove();
        loadSource(index+1);
      }
    };

    const timer=setTimeout(()=>finish(false),source.timeout);
    script.onload=()=>finish(true);
    script.onerror=()=>finish(false);
    document.head.appendChild(script);
  }

  const run=()=>loadSource(0);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();

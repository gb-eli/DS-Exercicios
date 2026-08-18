(()=>{
  'use strict';

  const VERSION='14.8.4';
  const SOURCES=[
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0/dist/umd/supabase.js',
    'https://unpkg.com/@supabase/supabase-js@2.111.0/dist/umd/supabase.js'
  ];

  let bootStarted=false;

  function setError(code){
    console.error('[AGV Lobby]',code);
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
    if(typeof globalThis.supabase?.createClient!=='function'){
      setError('supabase_sdk_missing_after_load');
      return;
    }
    bootStarted=true;
    const script=document.createElement('script');
    script.type='module';
    script.src=`assets/boot.js?v=${VERSION}`;
    script.onerror=()=>setError('boot_module_load_failed');
    document.body.appendChild(script);
  }

  function loadSource(index){
    if(typeof globalThis.supabase?.createClient==='function'){
      startBoot();
      return;
    }
    if(index>=SOURCES.length){
      setError('supabase_sdk_load_failed');
      return;
    }

    const script=document.createElement('script');
    script.src=SOURCES[index];
    script.async=true;
    script.crossOrigin='anonymous';
    script.referrerPolicy='no-referrer';
    script.dataset.agvSupabaseSource=String(index);

    let done=false;
    const finish=(ok)=>{
      if(done)return;
      done=true;
      clearTimeout(timer);
      script.onload=null;
      script.onerror=null;
      if(ok && typeof globalThis.supabase?.createClient==='function'){
        startBoot();
      }else{
        script.remove();
        loadSource(index+1);
      }
    };

    const timer=setTimeout(()=>finish(false),6500);
    script.onload=()=>finish(true);
    script.onerror=()=>finish(false);
    document.head.appendChild(script);
  }

  const run=()=>loadSource(0);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',run,{once:true});
  }else{
    run();
  }
})();

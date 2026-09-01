(()=>{
  'use strict';
  const VERSION='14.10.8.92-stage61-f90-graphics';
  const result={supported:false,registered:false,controlled:false,error:null};

  globalThis.__agvLobbySwReady=(async()=>{
    if(!('serviceWorker' in navigator)){globalThis.__agvLobbyDiag?.update?.({serviceWorker:{supported:false}});return result;}
    result.supported=true;
    try{
      const registration=await navigator.serviceWorker.register(`sw.js?v=${VERSION}`,{
        scope:'./',
        updateViaCache:'none'
      });
      result.registered=true;
      globalThis.__agvLobbyDiag?.update?.({serviceWorker:{supported:true,registered:true}});
      globalThis.__agvLobbyDiag?.record?.('sw_registered',{scope:registration.scope});
      await navigator.serviceWorker.ready;
      if(!navigator.serviceWorker.controller){
        await Promise.race([
          new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),
          new Promise(resolve=>setTimeout(resolve,1500))
        ]);
      }
      result.controlled=Boolean(navigator.serviceWorker.controller);
      globalThis.__agvLobbyDiag?.update?.({serviceWorker:{controlled:result.controlled}});
      globalThis.__agvLobbyDiag?.record?.('sw_ready',{controlled:result.controlled});
      return result;
    }catch(error){
      result.error=String(error?.message||error||'service_worker_registration_failed');
      console.warn('[AGV Lobby] Service Worker indisponível:',result.error);
      globalThis.__agvLobbyDiag?.update?.({serviceWorker:{error:result.error}});
      globalThis.__agvLobbyDiag?.record?.('sw_error',{message:result.error});
      return result;
    }
  })();
  navigator.serviceWorker?.addEventListener?.('message',event=>{
    if(event.data?.type!=='agv-lobby-diagnostic')return;
    globalThis.__agvLobbyDiag?.record?.('sw_fetch',event.data.detail||{});
    if(event.data?.detail?.sdkCache)globalThis.__agvLobbyDiag?.update?.({sdk:{serviceWorkerCache:event.data.detail.sdkCache}});
  });
})();

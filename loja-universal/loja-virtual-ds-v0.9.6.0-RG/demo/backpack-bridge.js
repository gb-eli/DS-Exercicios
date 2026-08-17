(() => {
  'use strict';
  const REQUEST='DS_BACKPACK_REQUEST_V1',RESPONSE='DS_BACKPACK_RESPONSE_V1';
  function execute(method,payload={}){
    const api=window.DSBackpack;if(!api)return {ok:false,code:'BACKPACK_UNAVAILABLE'};
    if(method==='getState')return {ok:true,state:api.getState(),diagnostics:api.getDiagnostics()};
    if(method==='useItem')return api.useItem(payload.id);
    if(method==='playAnimation')return api.playAnimation(payload.clip);
    if(method==='sayMessage')return api.sayMessage(payload.message);
    if(method==='addItem')return api.addItem(payload.id,{source:payload.platformId||'platform'});
    return {ok:false,code:'UNKNOWN_METHOD'};
  }
  addEventListener('message',event=>{const data=event.data;if(!data||data.protocol!==REQUEST||!data.requestId)return;const result=execute(data.method,data.payload);event.source?.postMessage({protocol:RESPONSE,requestId:data.requestId,result},event.origin==='null'?'*':event.origin)});
  function createAdapter(platformId='platform'){
    return {platformId,getState:()=>execute('getState'),useItem:id=>execute('useItem',{id,platformId}),playAnimation:clip=>execute('playAnimation',{clip,platformId}),sayMessage:message=>execute('sayMessage',{message,platformId}),addItem:id=>execute('addItem',{id,platformId})};
  }
  window.DSBackpackSDK={version:'0.9.6.0-RG',REQUEST,RESPONSE,createAdapter,execute};
})();

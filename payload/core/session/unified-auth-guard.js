(function(global){
  'use strict';
  const script=document.currentScript;
  const rootUrl=script?new URL('../../',script.src):new URL('./',location.href);
  const PROJECT_PATH=rootUrl.pathname.endsWith('/')?rootUrl.pathname:`${rootUrl.pathname}/`;
  const STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token';
  function readSession(){try{const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return raw?.access_token?raw:(raw?.currentSession?.access_token?raw.currentSession:(raw?.session?.access_token?raw.session:null));}catch{return null}}
  function safeReturnTo(value){
    const fallback='';
    try{
      const raw=String(value||'').trim();
      if(!raw||raw.startsWith('//')||/^[a-z][a-z0-9+.-]*:/i.test(raw))return fallback;
      const abs=new URL(raw,rootUrl);
      if(abs.origin!==rootUrl.origin||!abs.pathname.startsWith(PROJECT_PATH))return fallback;
      return `${abs.pathname.slice(PROJECT_PATH.length)}${abs.search}${abs.hash}`;
    }catch{return fallback;}
  }
  function currentReturnTo(){try{const u=new URL(location.href);if(u.origin!==rootUrl.origin||!u.pathname.startsWith(PROJECT_PATH))return '';return `${u.pathname.slice(PROJECT_PATH.length)}${u.search}${u.hash}`;}catch{return '';}}
  function loginUrl(returnTo=currentReturnTo()){
    const u=new URL('auth/',rootUrl),safe=safeReturnTo(returnTo);
    if(safe)u.searchParams.set('returnTo',safe);
    return u.href;
  }
  function redirect(returnTo=currentReturnTo()){location.replace(loginUrl(returnTo));}
  const rel=currentReturnTo();
  const isAuthSurface=/^(auth\/|reset-password\/)/.test(rel);
  const session=readSession();
  const expiredWithoutRefresh=!!(session?.expires_at&&Number(session.expires_at)*1000<=Date.now()&&!session.refresh_token);
  global.AGVUnifiedAuth={rootUrl:rootUrl.href,projectPath:PROJECT_PATH,storageKey:STORAGE_KEY,readSession,safeReturnTo,currentReturnTo,loginUrl,redirect};
  if(!isAuthSurface&&(!session?.access_token||expiredWithoutRefresh))redirect(rel);
})(window);
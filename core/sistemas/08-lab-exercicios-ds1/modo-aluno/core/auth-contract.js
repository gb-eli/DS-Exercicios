
window.DSCore = window.DSCore || {};
window.DSCore.auth = (() => {
  const config=()=>window.APP_CONFIG||{};
  let coreUser=null;
  function disciplineId(){return config().disciplineId||document.body.dataset.discipline||'central-1ds';}
  function role(){return document.body.dataset.role||'visitante';}
  function currentUser(){return window.AppAuth?.currentUser?.()||coreUser||null;}
  async function acceptCoreUser(info={}){if(window.AppAuth?.acceptCoreUser)return window.AppAuth.acceptCoreUser(info);const email=String(info.email||'').toLowerCase();coreUser={id:String(info.id||email),username:email,displayName:String(info.full_name||email||'Estudante'),group:String(info.class_name||''),role:'aluno',central:true};document.dispatchEvent(new CustomEvent('appauth:ready',{detail:{user:coreUser}}));return coreUser;}
  function onReady(handler){document.addEventListener('appauth:ready',event=>handler?.(event.detail||{}));}
  return {disciplineId,role,currentUser,onReady,acceptCoreUser};
})();

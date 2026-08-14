
window.DSCore = window.DSCore || {};
window.DSCore.auth = (() => {
  const config=()=>window.APP_CONFIG||{};
  function disciplineId(){return config().disciplineId||document.body.dataset.discipline||'central-1ds';}
  function role(){return document.body.dataset.role||'visitante';}
  function currentUser(){return window.AppAuth?.currentUser?.()||null;}
  function onReady(handler){document.addEventListener('appauth:ready',event=>handler?.(event.detail||{}));}
  return {disciplineId,role,currentUser,onReady};
})();

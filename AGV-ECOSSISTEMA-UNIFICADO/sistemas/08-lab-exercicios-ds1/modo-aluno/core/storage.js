
window.DSCore = window.DSCore || {};
window.DSCore.storage = (() => {
  function fail(onError){ try{ onError?.(); }catch{} }
  function get(key,onError){ try{return localStorage.getItem(key);}catch{fail(onError);return null;} }
  function set(key,value,onError){ try{localStorage.setItem(key,value);return true;}catch{fail(onError);return false;} }
  function remove(key,onError){ try{localStorage.removeItem(key);return true;}catch{fail(onError);return false;} }
  function getJSON(key,fallback=null,onError){ const raw=get(key,onError); if(raw==null)return fallback; try{return JSON.parse(raw);}catch{return fallback;} }
  function setJSON(key,value,onError){ return set(key,JSON.stringify(value),onError); }
  function disciplineNamespace(disciplineId,role,userId,name,version='v1'){
    return `ds1_disc_${disciplineId}_${role}_${userId}_${name}_${version}`;
  }
  return {get,set,remove,getJSON,setJSON,disciplineNamespace};
})();

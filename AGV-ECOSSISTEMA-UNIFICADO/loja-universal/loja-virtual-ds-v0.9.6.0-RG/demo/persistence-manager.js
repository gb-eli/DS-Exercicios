(() => {
  'use strict';
  const cfg=window.DS_BACKPACK_CONFIG;
  const memory=new Map();let saveTimer=null;let status={state:'ready',lastSavedAt:null,lastError:null,source:'boot'};
  const profileId=()=>window.DSAvatarProfile?.getState?.().profileId||'perfil-demo';
  const baseKey=()=>`${cfg.storage.snapshotKeyPrefix}:${profileId()}`;
  const getRaw=k=>{try{return localStorage.getItem(k)}catch(_){return memory.get(k)||null}};
  const setRaw=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){memory.set(k,v)}};
  const removeRaw=k=>{try{localStorage.removeItem(k)}catch(_){memory.delete(k)}};
  const clone=value=>JSON.parse(JSON.stringify(value));
  const now=()=>new Date().toISOString();
  const checksum=value=>{const s=JSON.stringify(value);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')};
  function payload(){
    const store=window.DSStore?.getState?.()||{};
    const body={format:'DS_PROFILE_BACKUP_V1',version:'0.9.6.0-RG',createdAt:now(),profileId:profileId(),avatar:window.DSAvatarProfile?.getState?.()||null,backpack:window.DSBackpack?.getState?.()||null,preferences:{requestedGraphics:window.DSPerformance?.requestedMode||'auto',actualGraphics:window.DSPerformance?.actualMode||'intermediate',graphicsPriority:window.DSPerformance?.priority||'balanced',reduceMotion:document.body.classList.contains('reduce-motion')},protectedSummary:{inventoryCount:store.inventory?.length||0,ledgerCount:store.ledger?.length||0,integrityScore:store.integrity?.score??null,financialDataIncluded:false}};
    return {...body,checksum:checksum(body)};
  }
  function validate(value){
    if(!value||value.format!=='DS_PROFILE_BACKUP_V1')return {ok:false,message:'Formato de backup incompatível.'};
    const {checksum:expected,...body}=value;if(expected!==checksum(body))return {ok:false,message:'O backup não passou na verificação de integridade.'};
    if(!value.avatar||!value.backpack)return {ok:false,message:'O backup não possui personagem e mochila.'};
    return {ok:true};
  }
  async function openDB(){return new Promise((resolve,reject)=>{try{const req=indexedDB.open(cfg.storage.indexedDB,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(cfg.storage.store))db.createObjectStore(cfg.storage.store,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)}catch(e){reject(e)}})}
  async function mirror(snapshot){try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(cfg.storage.store,'readwrite');tx.objectStore(cfg.storage.store).put({id:baseKey(),snapshot,updatedAt:now()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close();return true}catch(_){return false}}
  function rotate(snapshot){for(let i=cfg.storage.checkpointCount-1;i>=1;i--){const prev=getRaw(`${baseKey()}:checkpoint:${i-1}`);if(prev)setRaw(`${baseKey()}:checkpoint:${i}`,prev)}setRaw(`${baseKey()}:checkpoint:0`,JSON.stringify(snapshot))}
  async function save(source='manual'){
    status={...status,state:'saving',source,lastError:null};emit();
    try{const snapshot=payload();rotate(snapshot);setRaw(baseKey(),JSON.stringify(snapshot));await mirror(snapshot);status={state:'saved',lastSavedAt:now(),lastError:null,source};emit();return snapshot}catch(error){status={...status,state:'error',lastError:error.message||String(error),source};emit();throw error}
  }
  function schedule(source='auto'){clearTimeout(saveTimer);status={...status,state:'pending',source};emit();saveTimer=setTimeout(()=>save(source).catch(()=>{}),cfg.storage.autoSaveDelayMs)}
  function latest(){try{return JSON.parse(getRaw(baseKey())||'null')}catch(_){return null}}
  function checkpoints(){const rows=[];for(let i=0;i<cfg.storage.checkpointCount;i++){try{const value=JSON.parse(getRaw(`${baseKey()}:checkpoint:${i}`)||'null');if(value)rows.push(value)}catch(_){}}return rows}
  async function restore(value,{source='restore'}={}){const check=validate(value);if(!check.ok)throw new Error(check.message);window.DSAvatarProfile?.setEquipped?.(value.avatar.equippedItems||[],{source});if(value.avatar.currentAnimation)window.DSAvatarProfile?.setAnimation?.(value.avatar.currentAnimation);if(value.avatar.currentMessage)window.DSAvatarProfile?.setMessage?.(value.avatar.currentMessage);window.DSBackpack?.importState?.(value.backpack,{source});if(value.preferences?.requestedGraphics)window.DSPerformance?.setMode?.(value.preferences.requestedGraphics);document.body.classList.toggle('reduce-motion',!!value.preferences?.reduceMotion);await save(source);document.dispatchEvent(new CustomEvent('ds-profile-restored',{detail:{source,snapshot:value}}));return payload()}
  async function restoreLastCheckpoint(){const value=checkpoints()[0]||latest();if(!value)throw new Error('Nenhum ponto de recuperação disponível.');return restore(value,{source:'checkpoint'})}
  function download(){const data=payload();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`perfil-ds-${profileId()}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return data}
  async function importFile(file){if(!file)throw new Error('Selecione um arquivo JSON.');const value=JSON.parse(await file.text());return restore(value,{source:'file-import'})}
  function getStatus(){return clone({...status,checkpointCount:checkpoints().length,storageKey:baseKey()})}
  function emit(){document.dispatchEvent(new CustomEvent('ds-persistence-status',{detail:getStatus()}))}
  ['ds-avatar-profile-change','ds-backpack-change','ds-quality-change'].forEach(name=>document.addEventListener(name,()=>schedule(name)));
  window.addEventListener('pagehide',()=>{try{const snapshot=payload();setRaw(baseKey(),JSON.stringify(snapshot))}catch(_){}});
  window.DSPersistence={version:'0.9.6.0-RG',save,schedule,latest,checkpoints,restore,restoreLastCheckpoint,download,importFile,validate,getStatus,payload,protectedDomains:[...cfg.protectedDomains]};
  setTimeout(()=>save('boot').catch(()=>{}),650);
})();

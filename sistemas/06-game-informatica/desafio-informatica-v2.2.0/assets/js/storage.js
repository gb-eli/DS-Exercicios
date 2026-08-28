import { APP_VERSION, DATA_SCHEMA_VERSION } from './data.js?v=20260811r38';
import { RECOVERY_PUBLIC_KEY } from './eduauth/config.js?v=20260811r38';
import { assertSafeStructure,cleanText,safeIdentifier } from './security.js?v=20260811r38';

const DB_NAME='agv-edu-profiles';
const DB_VERSION=1;
const PROFILE_STORE='profiles';
const UI_SETTINGS_KEY='agv.ui.settings.v7';
export const PROFILE_RETENTION_DAYS=10;
const REDUNDANT_PREFIX='agv.profile.redundant.v1.';
const DELETED_PREFIX='agv.profile.deleted.v1.';
const STORAGE_STATUS_EVENT='agv-storage-status';
const PROFILE_SYNC_EVENT='agv-profile-sync';
const PROFILE_CHANNEL_NAME='agv-profile-sync-v1';
const LEGACY_KEYS={
  profile:'agv.profile.v4',progress:'agv.guided.progress.v4',results:'agv.results.v4',settings:'agv.settings.v4'
};
const DEFAULT_SETTINGS={
  fontScale:1,theme:'dark',highContrast:false,reducedMotion:false,readingMode:false,
  explanationMode:'objective',showScheduleNotifications:true,showRemainingClassTime:true,
  recommendationsEnabled:true,reducedRecommendationFrequency:false,recommendationHistory:{items:{},snoozedUntil:'',sessionCount:0}
};
const enc=new TextEncoder();
const dec=new TextDecoder();
const runtime={
  db:null,ready:false,profiles:[],activeId:null,key:null,data:null,temporary:false,legacy:false,
  saveQueue:Promise.resolve(),persistentStorage:null,passwordEnvelope:null,recoveryEnvelope:null,
  saveStatus:{state:'idle',lastSavedAt:'',lastAttemptAt:'',lastError:'',lastEvent:'',redundant:false},
  indexedDbFailures:0,recoveredFromRedundant:false,redundantAvailable:true,
  tabId:uid(),loadedRevision:0,externalRevision:0,channel:null,lastConflictAt:''
};

function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
function now(){return new Date().toISOString()}
function plusDays(date,days){const d=new Date(date);d.setDate(d.getDate()+days);return d.toISOString()}
function uid(){const bytes=crypto.getRandomValues(new Uint8Array(16));return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('')}
function displayName(name='Estudante'){
  const parts=String(name).trim().split(/\s+/).filter(Boolean);if(!parts.length)return'Estudante';
  return parts.length===1?parts[0]:`${parts[0]} ${parts.at(-1)[0].toUpperCase()}.`;
}
function toBase64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
function fromBase64(value){const s=atob(value);const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
function bytesToHex(bytes){return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('')}
function loadLocalJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function saveLocalJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function emitStorageStatus(extra={}){runtime.saveStatus={...runtime.saveStatus,...extra};try{window.dispatchEvent(new CustomEvent(STORAGE_STATUS_EVENT,{detail:clone(runtime.saveStatus)}))}catch{}}
function emitProfileSync(detail={}){try{window.dispatchEvent(new CustomEvent(PROFILE_SYNC_EVENT,{detail:clone(detail)}))}catch{}}
function recordRevision(record){return Math.max(0,Number(record?.meta?.revision)||0)}
function recordTime(record){const value=record?.meta?.updatedAt||record?.meta?.createdAt||'';const time=new Date(value).getTime();return Number.isFinite(time)?time:0}
function freshestRecord(a,b){if(!a)return b||null;if(!b)return a;const ar=recordRevision(a),br=recordRevision(b);if(ar!==br)return ar>br?a:b;return recordTime(a)>=recordTime(b)?a:b}
function sameRecordVersion(a,b){return Boolean(a&&b&&recordRevision(a)===recordRevision(b)&&recordTime(a)===recordTime(b))}
function announceRecord(record){if(!record)return;const message={type:'profile-saved',profileId:record.id,revision:recordRevision(record),updatedAt:record.meta?.updatedAt||'',writerTabId:record.meta?.writerTabId||runtime.tabId};try{runtime.channel?.postMessage(message)}catch{}try{localStorage.setItem('agv.profile.sync.pulse',JSON.stringify({...message,nonce:uid()}))}catch{}}
function redundantKey(id){return `${REDUNDANT_PREFIX}${id}`}
function readRedundantRecord(id){try{const value=JSON.parse(localStorage.getItem(redundantKey(id))||'null');return value?.id===id?value:null}catch{return null}}
function listRedundantRecords(){const out=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(REDUNDANT_PREFIX))continue;const value=JSON.parse(localStorage.getItem(key)||'null');if(value?.id)out.push(value)}}catch{runtime.redundantAvailable=false}return out}
function saveRedundantRecord(record){try{localStorage.setItem(redundantKey(record.id),JSON.stringify(record));runtime.redundantAvailable=true;return true}catch(error){runtime.redundantAvailable=false;runtime.saveStatus.lastError=`Checkpoint redundante indisponível: ${error?.message||'limite local'}`;return false}}
function deleteRedundantRecord(id){try{localStorage.removeItem(redundantKey(id))}catch{}}
function deletedKey(id){return `${DELETED_PREFIX}${id}`}
function markDeletedProfile(id){try{localStorage.setItem(deletedKey(id),now())}catch{}}
function isDeletedProfile(id){try{return Boolean(localStorage.getItem(deletedKey(id)))}catch{return false}}
function clearDeletedProfile(id){try{localStorage.removeItem(deletedKey(id))}catch{}}

function openDatabase(){return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(new Error('IndexedDB não está disponível.'));return}
  const request=indexedDB.open(DB_NAME,DB_VERSION);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(PROFILE_STORE))db.createObjectStore(PROFILE_STORE,{keyPath:'id'})};
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();if(runtime.db===db)runtime.db=null};resolve(db)};
  request.onblocked=()=>reject(new Error('O armazenamento está bloqueado por outra aba.'));request.onerror=()=>reject(request.error||new Error('Falha ao abrir o armazenamento local.'));
})}
function dbRequest(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||new Error('Falha no armazenamento local.'))})}
function transactionDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error||new Error('A transação de armazenamento foi cancelada.'));tx.onerror=()=>reject(tx.error||new Error('A transação de armazenamento falhou.'))})}
async function ensureDatabase(){if(runtime.db)return runtime.db;runtime.db=await openDatabase();return runtime.db}
async function withDatabase(mode,operation,{retry=true}={}){
  try{const db=await ensureDatabase(),tx=db.transaction(PROFILE_STORE,mode),store=tx.objectStore(PROFILE_STORE);const result=await operation(store,tx);await transactionDone(tx);return result}
  catch(error){runtime.indexedDbFailures++;try{runtime.db?.close()}catch{}runtime.db=null;if(retry){await new Promise(resolve=>setTimeout(resolve,80));return withDatabase(mode,operation,{retry:false})}throw error}
}
async function dbGetAll(){return withDatabase('readonly',store=>dbRequest(store.getAll()))}
async function dbGet(id){return withDatabase('readonly',store=>dbRequest(store.get(id)))}
async function dbPut(record){return withDatabase('readwrite',async store=>{await dbRequest(store.put(record));return record})}
async function dbDelete(id){try{return await withDatabase('readwrite',async store=>{await dbRequest(store.delete(id));return true})}catch{return undefined}}
async function syncRecordCopies(record,{dbRecord=null,redundantRecord=null}={}){if(!record)return null;if(!sameRecordVersion(record,redundantRecord))saveRedundantRecord(record);if(runtime.db&&!sameRecordVersion(record,dbRecord)){try{await dbPut(record)}catch{}}return record}
async function getRecord(id){if(isDeletedProfile(id))return null;let dbRecord=null;try{dbRecord=await dbGet(id)}catch{}const redundantRecord=readRedundantRecord(id),record=freshestRecord(dbRecord,redundantRecord);await syncRecordCopies(record,{dbRecord,redundantRecord});return record}

export async function deriveKey(password,salt,iterations=210000){
  if(String(password).length<6)throw new Error('A senha local deve ter pelo menos 6 caracteres.');
  const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function importDataKey(raw){return crypto.subtle.importKey('raw',raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
export async function encryptBytes(bytes,key){const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes));return {iv:toBase64(iv),ciphertext:toBase64(cipher)}}
export async function decryptBytes(envelope,key){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromBase64(envelope.iv)},key,fromBase64(envelope.ciphertext)))}
export async function encryptPayload(payload,key){return encryptBytes(enc.encode(JSON.stringify(payload)),key)}
export async function decryptPayload(record,key){const envelope=record.formatVersion>=2?record.crypto.data:record.crypto;const plain=await decryptBytes(envelope,key);const parsed=JSON.parse(dec.decode(plain));assertSafeStructure(parsed,{maxDepth:24,maxArray:2000,maxKeys:500});return parsed}
export async function createPasswordEnvelope(rawDataKey,password,salt=crypto.getRandomValues(new Uint8Array(16)),iterations=210000){const key=await deriveKey(password,salt,iterations),wrapped=await encryptBytes(rawDataKey,key);return {algorithm:'AES-GCM',keyDerivation:'PBKDF2-HMAC-SHA-256',iterations,salt:toBase64(salt),...wrapped}}
export async function unwrapPasswordEnvelope(envelope,password){const key=await deriveKey(password,fromBase64(envelope.salt),envelope.iterations);return decryptBytes(envelope,key)}
export async function createRecoveryEnvelope(rawDataKey){
  try{const publicKey=await crypto.subtle.importKey('jwk',RECOVERY_PUBLIC_KEY.jwk,{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);const wrapped=new Uint8Array(await crypto.subtle.encrypt({name:'RSA-OAEP'},publicKey,rawDataKey));return {algorithm:'RSA-OAEP-256',keyId:RECOVERY_PUBLIC_KEY.keyId,environment:RECOVERY_PUBLIC_KEY.environment,wrappedDataKey:toBase64(wrapped)}}
  catch(error){console.warn('Envelope de recuperação não pôde ser criado.',error);return null}
}
async function digestText(text){return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(text))))}
function publicMetaFromData(id,data,createdAt=now(),revision=0){
  const updatedAt=now(),progress=Object.values(data.progress||{}),completedLessons=progress.filter(item=>item?.completed).length,inProgressLessons=progress.filter(item=>item&&!item.completed).length;
  const latestProgress=progress.sort((a,b)=>new Date(b?.updatedAt||0)-new Date(a?.updatedAt||0))[0]||null;
  return {
    id,displayName:displayName(data.profile?.name),classId:data.profile?.classId||'',createdAt,
    updatedAt,expiresAt:plusDays(updatedAt,PROFILE_RETENTION_DAYS),retentionDays:PROFILE_RETENTION_DAYS,version:APP_VERSION,schemaVersion:DATA_SCHEMA_VERSION,revision:Math.max(1,Number(revision)||1),writerTabId:runtime.tabId,
    learningSummary:{completedLessons,inProgressLessons,resultsCount:Array.isArray(data.results)?data.results.length:0,lastLessonId:latestProgress?.lessonId||latestProgress?.id||'',lastProgressAt:latestProgress?.updatedAt||''}
  }
}
function initialData(profile={}){return {
  kind:'agv-protected-profile-data',schemaVersion:DATA_SCHEMA_VERSION,version:APP_VERSION,
  profile:{id:profile.id||uid(),name:profile.name||'',classId:profile.classId||'',createdAt:now(),updatedAt:now()},
  progress:{},diagnostics:{},settings:{...DEFAULT_SETTINGS,...getGlobalSettings()},results:[],exports:[],imports:[],migrations:[],audit:[],
  acceptances:{general:[],activities:[],permissions:[]},
  recommendationHistory:{items:{},snoozedUntil:'',disabled:false,reducedFrequency:false}
}}
function ensureDataShape(data){
  const shaped=data&&typeof data==='object'?data:initialData();shaped.schemaVersion=DATA_SCHEMA_VERSION;shaped.version=APP_VERSION;
  shaped.profile=shaped.profile||{};shaped.progress=shaped.progress||{};shaped.diagnostics=shaped.diagnostics&&typeof shaped.diagnostics==='object'?shaped.diagnostics:{};shaped.settings={...DEFAULT_SETTINGS,...(shaped.settings||{})};
  shaped.results=Array.isArray(shaped.results)?shaped.results:[];shaped.exports=Array.isArray(shaped.exports)?shaped.exports:[];shaped.imports=Array.isArray(shaped.imports)?shaped.imports:[];shaped.migrations=Array.isArray(shaped.migrations)?shaped.migrations:[];shaped.audit=Array.isArray(shaped.audit)?shaped.audit:[];
  shaped.acceptances=shaped.acceptances&&typeof shaped.acceptances==='object'?shaped.acceptances:{};shaped.acceptances.general=Array.isArray(shaped.acceptances.general)?shaped.acceptances.general:[];shaped.acceptances.activities=Array.isArray(shaped.acceptances.activities)?shaped.acceptances.activities:[];shaped.acceptances.permissions=Array.isArray(shaped.acceptances.permissions)?shaped.acceptances.permissions:[];
  shaped.recommendationHistory=shaped.recommendationHistory||{items:{},snoozedUntil:'',disabled:false,reducedFrequency:false};return shaped;
}
async function appendAudit(type,details={}){
  if(!runtime.data)return;const audit=runtime.data.audit||(runtime.data.audit=[]);const previousHash=audit.at(-1)?.hash||'GENESIS';
  const event={id:uid(),type,at:now(),platform:'desafio-informatica',version:APP_VERSION,details:clone(details),previousHash};
  event.hash=await digestText(`${previousHash}|${JSON.stringify(event)}`);audit.push(event);if(audit.length>500)audit.splice(0,audit.length-500);
}
function uniqueById(items=[]){const map=new Map();for(const item of items){const key=item?.id||`${item?.type||'item'}:${item?.at||item?.acceptedAt||JSON.stringify(item)}`;const previous=map.get(key);if(!previous||new Date(item?.updatedAt||item?.at||item?.acceptedAt||0)>=new Date(previous?.updatedAt||previous?.at||previous?.acceptedAt||0))map.set(key,item)}return [...map.values()]}
function newerValue(a,b){if(a==null)return clone(b);if(b==null)return clone(a);return new Date(a?.updatedAt||a?.endedAt||a?.at||0)>=new Date(b?.updatedAt||b?.endedAt||b?.at||0)?clone(a):clone(b)}
function mergeLessonProgress(persisted,incoming){
  if(persisted==null)return clone(incoming);if(incoming==null)return clone(persisted);
  if(Boolean(persisted?.completed)!==Boolean(incoming?.completed))return clone(persisted?.completed?persisted:incoming);
  return clone(persisted);
}
function mergeDiagnosticProgress(persisted,incoming){
  if(persisted==null)return clone(incoming);if(incoming==null)return clone(persisted);
  const answers=uniqueById([...(persisted.answers||[]),...(incoming.answers||[])]);
  const finished=Boolean(persisted.finished||incoming.finished);const index=Math.max(Number(persisted.index)||0,Number(incoming.index)||0,answers.length);
  return {...clone(persisted),answers,index,finished,updatedAt:newerValue(persisted,incoming)?.updatedAt||persisted.updatedAt||incoming.updatedAt||now()};
}
function mergeProtectedData(latest,local){
  const merged=ensureDataShape(clone(latest||local||initialData()));const incoming=ensureDataShape(clone(local||{}));
  merged.profile={...incoming.profile,...merged.profile,createdAt:merged.profile?.createdAt||incoming.profile?.createdAt,updatedAt:newerValue(merged.profile,incoming.profile)?.updatedAt||now()};
  const progress={...merged.progress};for(const [key,value] of Object.entries(incoming.progress||{}))progress[key]=mergeLessonProgress(progress[key],value);merged.progress=progress;
  const diagnostics={...merged.diagnostics};for(const [key,value] of Object.entries(incoming.diagnostics||{}))diagnostics[key]=mergeDiagnosticProgress(diagnostics[key],value);merged.diagnostics=diagnostics;
  const results=new Map();for(const item of [...(merged.results||[]),...(incoming.results||[])]){const key=item?.id||uid();results.set(key,newerValue(results.get(key),item))}merged.results=[...results.values()].sort((a,b)=>new Date(b?.endedAt||b?.updatedAt||0)-new Date(a?.endedAt||a?.updatedAt||0)).slice(0,60);
  merged.settings={...merged.settings,...incoming.settings};merged.exports=uniqueById([...(merged.exports||[]),...(incoming.exports||[])]);merged.imports=uniqueById([...(merged.imports||[]),...(incoming.imports||[])]);merged.migrations=uniqueById([...(merged.migrations||[]),...(incoming.migrations||[])]);merged.audit=uniqueById([...(merged.audit||[]),...(incoming.audit||[])]).sort((a,b)=>new Date(a?.at||0)-new Date(b?.at||0)).slice(-500);
  merged.acceptances={general:uniqueById([...(merged.acceptances?.general||[]),...(incoming.acceptances?.general||[])]),activities:uniqueById([...(merged.acceptances?.activities||[]),...(incoming.acceptances?.activities||[])]),permissions:uniqueById([...(merged.acceptances?.permissions||[]),...(incoming.acceptances?.permissions||[])])};
  merged.recommendationHistory={...(merged.recommendationHistory||{}),...(incoming.recommendationHistory||{})};return ensureDataShape(merged)
}
async function persistActive(eventType='save',details={}){
  if(!runtime.data||runtime.temporary||!runtime.activeId||!runtime.key)return;
  const attemptedAt=now();emitStorageStatus({state:'saving',lastAttemptAt:attemptedAt,lastEvent:eventType,lastError:''});
  let previous=await getRecord(runtime.activeId),previousRevision=recordRevision(previous);
  if(previous&&previousRevision>runtime.loadedRevision){
    try{const latestData=ensureDataShape(await decryptPayload(previous,runtime.key));runtime.data=mergeProtectedData(latestData,runtime.data);runtime.lastConflictAt=attemptedAt;emitProfileSync({type:'conflict-merged',profileId:runtime.activeId,previousRevision,localRevision:runtime.loadedRevision,at:attemptedAt});await appendAudit('profile_conflict_merged',{previousRevision,localRevision:runtime.loadedRevision,writerTabId:previous.meta?.writerTabId||''})}
    catch(error){emitStorageStatus({state:'conflict',lastError:'Outra aba possui uma versão mais recente. Reabra o perfil para continuar com segurança.'});throw new Error('Conflito entre abas: não foi possível combinar o progresso mais recente.')}
  }
  await appendAudit(eventType,details);runtime.data.profile.updatedAt=attemptedAt;previous=await getRecord(runtime.activeId);previousRevision=Math.max(previousRevision,recordRevision(previous));const nextRevision=previousRevision+1;
  const meta=publicMetaFromData(runtime.activeId,runtime.data,previous?.meta?.createdAt||runtime.data.profile.createdAt||attemptedAt,nextRevision);
  let encrypted=await encryptPayload(runtime.data,runtime.key);let record={id:runtime.activeId,kind:'agv-protected-profile-record',formatVersion:2,meta,crypto:{algorithm:'AES-GCM-256',data:encrypted,passwordEnvelope:clone(runtime.passwordEnvelope||previous?.crypto?.passwordEnvelope),recoveryEnvelope:clone(runtime.recoveryEnvelope||previous?.crypto?.recoveryEnvelope),envelopeArchitecture:'EDUAUTH-PROFILE-ENVELOPE-v1'}};
  let redundantSaved=saveRedundantRecord(record);
  try{await dbPut(record);runtime.loadedRevision=nextRevision;runtime.externalRevision=nextRevision;announceRecord(record);runtime.profiles=await listValidProfiles();emitStorageStatus({state:redundantSaved?'saved':'warning',lastSavedAt:meta.updatedAt,lastError:redundantSaved?'':'O perfil foi salvo no IndexedDB, mas o checkpoint redundante não pôde ser atualizado.',redundant:redundantSaved,revision:nextRevision});return record}
  catch(error){
    await appendAudit('storage_save_failed',{eventType,message:String(error?.message||error),redundantSaved});runtime.data.profile.updatedAt=now();encrypted=await encryptPayload(runtime.data,runtime.key);record={...record,meta:publicMetaFromData(runtime.activeId,runtime.data,record.meta.createdAt,nextRevision),crypto:{...record.crypto,data:encrypted}};redundantSaved=saveRedundantRecord(record)||redundantSaved;
    if(redundantSaved){runtime.loadedRevision=nextRevision;runtime.externalRevision=nextRevision;announceRecord(record)}emitStorageStatus({state:redundantSaved?'warning':'error',lastSavedAt:redundantSaved?record.meta.updatedAt:runtime.saveStatus.lastSavedAt,lastError:redundantSaved?'IndexedDB falhou temporariamente; o checkpoint criptografado redundante foi mantido.':`Falha ao salvar: ${error?.message||'armazenamento indisponível'}`,redundant:redundantSaved,revision:nextRevision});if(!redundantSaved)throw error;return record
  }
}
function queuePersist(type,details={}){runtime.saveQueue=runtime.saveQueue.catch(()=>null).then(()=>persistActive(type,details)).catch(async err=>{console.error('Falha ao salvar perfil protegido:',err);emitStorageStatus({state:'error',lastError:String(err?.message||err)});try{await appendAudit('storage_queue_failed',{type,message:String(err?.message||err)})}catch{};return null});return runtime.saveQueue}
async function listValidProfiles(){
  let dbRecords=[];try{dbRecords=await dbGetAll()}catch{}const redundantRecords=listRedundantRecords(),byId=new Map();
  for(const record of [...dbRecords,...redundantRecords])byId.set(record.id,freshestRecord(byId.get(record.id),record));
  const current=Date.now(),valid=[];
  for(const record of byId.values()){
    if(isDeletedProfile(record.id)){await dbDelete(record.id);deleteRedundantRecord(record.id);continue}
    const updatedAt=record.meta?.updatedAt||record.meta?.createdAt||0,expiresAt=plusDays(updatedAt,PROFILE_RETENTION_DAYS);
    if(new Date(expiresAt).getTime()<=current){await dbDelete(record.id);deleteRedundantRecord(record.id);continue}
    record.meta={...(record.meta||{}),expiresAt,retentionDays:PROFILE_RETENTION_DAYS,version:APP_VERSION,schemaVersion:DATA_SCHEMA_VERSION,revision:Math.max(1,recordRevision(record)||1)};valid.push(record.meta);await syncRecordCopies(record,{dbRecord:dbRecords.find(item=>item.id===record.id),redundantRecord:redundantRecords.find(item=>item.id===record.id)})
  }
  return valid.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
}
function readLegacy(){
  const profile=loadLocalJSON(LEGACY_KEYS.profile,null);if(!profile)return null;
  return {kind:'agv-progress',version:profile.version||'legacy-v4',exportedAt:now(),profile,progress:loadLocalJSON(LEGACY_KEYS.progress,{}),settings:loadLocalJSON(LEGACY_KEYS.settings,{}),results:loadLocalJSON(LEGACY_KEYS.results,[])};
}
function clearLegacy(){for(const key of Object.values(LEGACY_KEYS)){try{localStorage.removeItem(key)}catch{}}}

function handleExternalProfileMessage(message){if(!message||message.type!=='profile-saved'||message.writerTabId===runtime.tabId)return;if(message.profileId!==runtime.activeId)return;const revision=Math.max(0,Number(message.revision)||0);if(revision<=runtime.loadedRevision)return;runtime.externalRevision=Math.max(runtime.externalRevision,revision);emitStorageStatus({state:'external-update',lastError:'Outra aba salvou uma versão mais recente. O próximo salvamento combinará os progressos com segurança.',externalRevision:revision});emitProfileSync({...message,type:'external-update'})}

export async function initializeStorage(){
  if(runtime.ready)return;
  try{runtime.channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(PROFILE_CHANNEL_NAME):null;runtime.channel?.addEventListener('message',event=>handleExternalProfileMessage(event.data))}catch{}
  try{window.addEventListener('storage',event=>{if(event.key==='agv.profile.sync.pulse'&&event.newValue){try{handleExternalProfileMessage(JSON.parse(event.newValue))}catch{}}})}catch{}
  try{runtime.db=await openDatabase();runtime.profiles=await listValidProfiles()}catch(error){console.warn('IndexedDB indisponível; tentando checkpoint criptografado redundante.',error);runtime.db=null;runtime.profiles=(await listValidProfiles());runtime.persistentStorage=false;runtime.indexedDbFailures++;emitStorageStatus({state:runtime.profiles.length?'warning':'error',lastError:runtime.profiles.length?'IndexedDB indisponível; perfis recuperáveis pelo checkpoint redundante.':'Armazenamento protegido indisponível neste navegador.',redundant:runtime.profiles.length>0})}
  runtime.ready=true;
  if(runtime.db&&navigator.storage?.persist){try{runtime.persistentStorage=await navigator.storage.persist()}catch{runtime.persistentStorage=false}}
  const legacy=readLegacy();if(legacy&&!runtime.profiles.length){runtime.data=ensureDataShape({...initialData(legacy.profile),profile:{...legacy.profile,id:legacy.profile.id||uid()},progress:legacy.progress||{},settings:{...DEFAULT_SETTINGS,...legacy.settings},results:Array.isArray(legacy.results)?legacy.results:[],migrations:[{type:'legacy-v4-detected',at:now()}],audit:[]});runtime.temporary=true;runtime.legacy=true}
}

export function isStorageReady(){return runtime.ready}
export function getProfileList(){return clone(runtime.profiles)}
export function hasActiveSession(){return Boolean(runtime.data)}
export function isTemporarySession(){return Boolean(runtime.data&&runtime.temporary)}
export function isLegacySession(){return Boolean(runtime.legacy)}
export function isProtectedSession(){return Boolean(runtime.data&&!runtime.temporary&&runtime.activeId)}
export function getPersistentStorageStatus(){return runtime.persistentStorage}
export function getActiveProfileId(){return runtime.activeId}
export function getSaveStatus(){return clone({...runtime.saveStatus,temporary:Boolean(runtime.data&&runtime.temporary),protected:Boolean(runtime.data&&!runtime.temporary&&runtime.activeId),retentionDays:PROFILE_RETENTION_DAYS})}
export async function getStorageDiagnostics(){
  let estimate={usage:0,quota:0};try{estimate=await navigator.storage?.estimate?.()||estimate}catch{}
  let persisted=runtime.persistentStorage;try{if(navigator.storage?.persisted)persisted=await navigator.storage.persisted()}catch{}
  const fallbackRecords=listRedundantRecords(),activeFallback=runtime.activeId?Boolean(readRedundantRecord(runtime.activeId)):false;
  const quota=Number(estimate.quota)||0,usage=Number(estimate.usage)||0;const privateModeSuspected=Boolean(!runtime.db||(persisted===false&&quota>0&&quota<150*1024*1024));
  return {indexedDBAvailable:Boolean(runtime.db),persistentStorage:persisted===true,redundantCheckpointAvailable:activeFallback||fallbackRecords.length>0,redundantProfileCount:fallbackRecords.length,retentionDays:PROFILE_RETENTION_DAYS,usage,quota,usagePercent:quota?Math.round(usage/quota*100):0,privateModeSuspected,indexedDbFailures:runtime.indexedDbFailures,recoveredFromRedundant:runtime.recoveredFromRedundant,lastSavedAt:runtime.saveStatus.lastSavedAt,lastError:runtime.saveStatus.lastError,state:runtime.saveStatus.state};
}
export async function retryStorageConnection(){
  try{runtime.db=await openDatabase();runtime.profiles=await listValidProfiles();runtime.persistentStorage=navigator.storage?.persist?await navigator.storage.persist().catch(()=>false):runtime.persistentStorage;emitStorageStatus({state:runtime.saveStatus.lastSavedAt?'saved':'idle',lastError:''});return getStorageDiagnostics()}
  catch(error){runtime.indexedDbFailures++;emitStorageStatus({state:'warning',lastError:`IndexedDB ainda indisponível: ${error?.message||error}`});return getStorageDiagnostics()}
}
export async function verifyActiveProgress(){
  if(!runtime.data)throw new Error('Nenhum perfil está aberto.');if(runtime.temporary)return {ok:false,temporary:true,message:'Esta sessão é temporária e precisa ser protegida ou exportada antes de fechar.'};
  await flushStorage();const record=await getRecord(runtime.activeId);if(!record)throw new Error('O registro protegido não foi localizado. Gere um backup antes de continuar.');
  const stored=ensureDataShape(await decryptPayload(record,runtime.key)),memory=ensureDataShape(clone(runtime.data));const storedDigest=await digestText(JSON.stringify(stored)),memoryDigest=await digestText(JSON.stringify(memory));const progress=Object.values(stored.progress||{}),latest=progress.sort((a,b)=>new Date(b?.updatedAt||0)-new Date(a?.updatedAt||0))[0]||null;
  const completedIds=Object.entries(stored.progress||{}).filter(([,item])=>item?.completed).map(([id])=>id).sort(),memoryCompletedIds=Object.entries(memory.progress||{}).filter(([,item])=>item?.completed).map(([id])=>id).sort();
  const consistent=stored.profile?.id===memory.profile?.id&&storedDigest===memoryDigest&&JSON.stringify(completedIds)===JSON.stringify(memoryCompletedIds)&&recordRevision(record)>=runtime.loadedRevision;
  await queuePersist('progress_verified',{consistent,storedAt:record.meta?.updatedAt||'',progressCount:progress.length,revision:recordRevision(record),storedDigest:storedDigest.slice(0,16),memoryDigest:memoryDigest.slice(0,16)});const verifiedRecord=await getRecord(runtime.activeId)||record;
  return {ok:consistent,temporary:false,profileName:stored.profile?.name||'',classId:stored.profile?.classId||'',lastSavedAt:verifiedRecord.meta?.updatedAt||record.meta?.updatedAt||'',expiresAt:verifiedRecord.meta?.expiresAt||record.meta?.expiresAt||'',revision:recordRevision(verifiedRecord),completedLessons:completedIds.length,inProgressLessons:progress.filter(item=>item&&!item?.completed).length,resultsCount:Array.isArray(stored.results)?stored.results.length:0,lastLessonId:latest?.lessonId||latest?.id||'',lastProgressAt:latest?.updatedAt||'',source:'IndexedDB + checkpoint redundante sincronizados',redundant:Boolean(readRedundantRecord(runtime.activeId)),consistent,storedDigest:storedDigest.slice(0,16),memoryDigest:memoryDigest.slice(0,16)};
}

export async function createProtectedProfile({name,classId,password},seed=null){
  if(!runtime.db&&!runtime.redundantAvailable)throw new Error('O armazenamento protegido não está disponível neste navegador. Continue sem salvar e exporte o resultado antes de sair.');
  const id=uid(),rawDataKey=crypto.getRandomValues(new Uint8Array(32)),dataKey=await importDataKey(rawDataKey);
  const passwordEnvelope=await createPasswordEnvelope(rawDataKey,password),recoveryEnvelope=await createRecoveryEnvelope(rawDataKey);
  const data=ensureDataShape(seed?clone(seed):initialData({id,name,classId}));data.profile={...(data.profile||{}),id,name,classId,updatedAt:now(),createdAt:data.profile?.createdAt||now()};
  runtime.activeId=id;runtime.key=dataKey;runtime.passwordEnvelope=passwordEnvelope;runtime.recoveryEnvelope=recoveryEnvelope;runtime.data=data;runtime.temporary=false;runtime.legacy=false;await appendAudit('profile_created',{classId,recoveryEnvelope:Boolean(recoveryEnvelope)});
  const meta=publicMetaFromData(id,data,data.profile.createdAt,1),encrypted=await encryptPayload(data,dataKey);
  const record={id,kind:'agv-protected-profile-record',formatVersion:2,meta,crypto:{algorithm:'AES-GCM-256',data:encrypted,passwordEnvelope,recoveryEnvelope,envelopeArchitecture:'EDUAUTH-PROFILE-ENVELOPE-v1'}};
  const redundantSaved=saveRedundantRecord(record);try{await dbPut(record)}catch(error){if(!redundantSaved)throw error;await appendAudit('storage_save_failed',{eventType:'profile_created',message:String(error?.message||error),redundantSaved:true})}
  runtime.loadedRevision=1;runtime.externalRevision=1;announceRecord(record);emitProfileSync({type:'session-opened',profileId:id,revision:1});emitStorageStatus({state:runtime.db?'saved':'warning',lastSavedAt:meta.updatedAt,lastError:runtime.db?'':'Perfil protegido no checkpoint redundante; o IndexedDB será tentado novamente.',redundant:redundantSaved});runtime.profiles=await listValidProfiles();return getProfile();
}
export async function unlockProtectedProfile(id,password){
  const record=await getRecord(id);if(!record)throw new Error('Perfil não encontrado ou fora do período de retenção de 10 dias.');
  try{
    let dataKey,data,passwordEnvelope,recoveryEnvelope;
    if(record.formatVersion>=2&&record.crypto?.passwordEnvelope){const raw=await unwrapPasswordEnvelope(record.crypto.passwordEnvelope,password);dataKey=await importDataKey(raw);data=await decryptPayload(record,dataKey);passwordEnvelope=record.crypto.passwordEnvelope;recoveryEnvelope=record.crypto.recoveryEnvelope||await createRecoveryEnvelope(raw)}
    else{const legacyKey=await deriveKey(password,fromBase64(record.crypto.salt),record.crypto.iterations);data=await decryptPayload(record,legacyKey);const raw=crypto.getRandomValues(new Uint8Array(32));dataKey=await importDataKey(raw);passwordEnvelope=await createPasswordEnvelope(raw,password);recoveryEnvelope=await createRecoveryEnvelope(raw);const encrypted=await encryptPayload(data,dataKey);{const migrated={id,kind:'agv-protected-profile-record',formatVersion:2,meta:{...record.meta,version:APP_VERSION,schemaVersion:DATA_SCHEMA_VERSION,expiresAt:plusDays(now(),PROFILE_RETENTION_DAYS),retentionDays:PROFILE_RETENTION_DAYS},crypto:{algorithm:'AES-GCM-256',data:encrypted,passwordEnvelope,recoveryEnvelope,envelopeArchitecture:'EDUAUTH-PROFILE-ENVELOPE-v1'}};saveRedundantRecord(migrated);try{await dbPut(migrated)}catch{}};data.migrations||(data.migrations=[]);data.migrations.push({type:'profile-envelope-v1',at:now()})}
    runtime.activeId=id;runtime.key=dataKey;runtime.passwordEnvelope=passwordEnvelope;runtime.recoveryEnvelope=recoveryEnvelope;runtime.data=ensureDataShape(data);runtime.temporary=false;runtime.legacy=false;runtime.loadedRevision=Math.max(1,recordRevision(record)||1);runtime.externalRevision=runtime.loadedRevision;runtime.recoveredFromRedundant=Boolean(!runtime.db&&readRedundantRecord(id));emitProfileSync({type:'session-opened',profileId:id,revision:runtime.loadedRevision});await queuePersist(runtime.recoveredFromRedundant?'profile_recovered_from_redundant':'profile_unlocked');return getProfile()
  }catch{throw new Error('Senha incorreta ou perfil corrompido.')}
}
export function startTemporaryProfile({name,classId}){runtime.activeId=null;runtime.key=null;runtime.loadedRevision=0;runtime.externalRevision=0;runtime.data=ensureDataShape(initialData({name,classId}));runtime.temporary=true;runtime.legacy=false;emitProfileSync({type:'session-opened',profileId:'temporary',revision:0});return getProfile()}
export async function protectCurrentTemporaryProfile(password){
  if(!runtime.data||!runtime.temporary)throw new Error('Não há sessão temporária para proteger.');const seed=clone(runtime.data);const p=seed.profile;const result=await createProtectedProfile({name:p.name,classId:p.classId,password},seed);if(runtime.legacy)clearLegacy();return result;
}
export async function migrateLegacyToProtected(password){
  if(!runtime.data||!runtime.legacy)throw new Error('Nenhum progresso antigo foi encontrado.');const seed=clone(runtime.data);const p=seed.profile;const result=await createProtectedProfile({name:p.name,classId:p.classId,password},seed);clearLegacy();return result;
}
export async function lockActiveProfile(reason='manual'){if(runtime.data&&!runtime.temporary&&runtime.activeId){await persistActive('profile_locked',{reason})}else await runtime.saveQueue;runtime.activeId=null;runtime.key=null;runtime.passwordEnvelope=null;runtime.recoveryEnvelope=null;runtime.data=null;runtime.temporary=false;runtime.legacy=false;runtime.loadedRevision=0;runtime.externalRevision=0}
export async function deleteProtectedProfile(id,password){await unlockProtectedProfile(id,password);await runtime.saveQueue;markDeletedProfile(id);await dbDelete(id);runtime.activeId=null;runtime.key=null;runtime.passwordEnvelope=null;runtime.recoveryEnvelope=null;runtime.data=null;runtime.temporary=false;runtime.legacy=false;deleteRedundantRecord(id);runtime.profiles=await listValidProfiles()}

export function getProfile(){return clone(runtime.data?.profile||null)}
export function setProfile(profile){if(!runtime.data){startTemporaryProfile(profile);return}runtime.data.profile={...runtime.data.profile,...profile,updatedAt:now(),version:APP_VERSION};queuePersist('profile_updated',{classId:profile.classId})}
export function clearProfile(){runtime.data=null;runtime.activeId=null;runtime.key=null;runtime.passwordEnvelope=null;runtime.recoveryEnvelope=null;runtime.temporary=false;runtime.legacy=false}
export function getAllProgress(){return clone(runtime.data?.progress||{})}
export function getLessonProgress(id){return clone(runtime.data?.progress?.[id]||null)}
export function saveLessonProgress(id,progress){if(!runtime.data)return Promise.resolve();runtime.data.progress||(runtime.data.progress={});runtime.data.progress[id]={...clone(progress),updatedAt:now(),version:APP_VERSION};return queuePersist('lesson_progress_saved',{lessonId:id,stageIndex:progress.stageIndex,completed:Boolean(progress.completed)})}
export function resetLessonProgress(id){if(!runtime.data?.progress)return Promise.resolve();delete runtime.data.progress[id];return queuePersist('lesson_progress_reset',{lessonId:id})}
export function getDiagnosticProgress(mode){return clone(runtime.data?.diagnostics?.[mode]||null)}
export function saveDiagnosticProgress(mode,progress){if(!runtime.data)return Promise.resolve();runtime.data.diagnostics||(runtime.data.diagnostics={});runtime.data.diagnostics[mode]={...clone(progress),updatedAt:now(),version:APP_VERSION};return queuePersist('diagnostic_progress_saved',{mode,index:progress.index,finished:Boolean(progress.finished),awaitingMinimum:Boolean(progress.awaitingMinimum)})}
export function clearDiagnosticProgress(mode){if(!runtime.data?.diagnostics)return Promise.resolve();delete runtime.data.diagnostics[mode];return queuePersist('diagnostic_progress_cleared',{mode})}
export function saveResult(result){if(!runtime.data)return Promise.resolve();runtime.data.results||(runtime.data.results=[]);const existing=runtime.data.results.findIndex(item=>item.id===result.id);if(existing>=0)runtime.data.results[existing]=clone(result);else runtime.data.results.unshift(clone(result));runtime.data.results=runtime.data.results.slice(0,60);return queuePersist('result_saved',{resultId:result.id,kind:result.kind})}
export function updateResult(result){if(!runtime.data)return Promise.resolve();runtime.data.results||(runtime.data.results=[]);const index=runtime.data.results.findIndex(item=>item.id===result.id);if(index>=0)runtime.data.results[index]=clone(result);else runtime.data.results.unshift(clone(result));runtime.data.results=runtime.data.results.slice(0,60);return queuePersist('result_updated',{resultId:result.id,kind:result.kind})}
export function getResults(){return clone(runtime.data?.results||[])}
export function clearResults(){if(!runtime.data)return Promise.resolve();runtime.data.results=[];return queuePersist('results_cleared')}
export function getGlobalSettings(){return {...DEFAULT_SETTINGS,...loadLocalJSON(UI_SETTINGS_KEY,{})}}
export function saveGlobalSettings(settings){saveLocalJSON(UI_SETTINGS_KEY,{...getGlobalSettings(),...settings})}
export function getSettings(){return {...DEFAULT_SETTINGS,...getGlobalSettings(),...(runtime.data?.settings||{})}}
export function saveSettings(settings){saveGlobalSettings(settings);if(runtime.data){runtime.data.settings={...getSettings(),...clone(settings)};return queuePersist('settings_updated')}return Promise.resolve()}
export function getRecommendationHistory(){return clone(runtime.data?.recommendationHistory||{items:{},snoozedUntil:'',disabled:false,reducedFrequency:false})}
export function saveRecommendationHistory(history){if(!runtime.data)return;runtime.data.recommendationHistory=clone(history);queuePersist('recommendation_preferences_updated')}
export function getGeneralAcceptances(){return clone(runtime.data?.acceptances?.general||[])}
export function getActivityAcceptances(){return clone(runtime.data?.acceptances?.activities||[])}
export function getPermissionAcceptances(){return clone(runtime.data?.acceptances?.permissions||[])}
export function saveGeneralAcceptance(record){if(!runtime.data)throw new Error('Abra ou crie um perfil antes de aceitar os termos.');runtime.data.acceptances||(runtime.data.acceptances={general:[],activities:[],permissions:[]});runtime.data.acceptances.general||(runtime.data.acceptances.general=[]);runtime.data.acceptances.general.push(clone(record));runtime.data.acceptances.general=runtime.data.acceptances.general.slice(-30);return queuePersist('terms_accepted',{acceptanceId:record.acceptanceId,termsVersion:record.termsVersion,termsHash:record.termsHash?.slice(0,16)})}
export function saveActivityAcceptance(record){if(!runtime.data)throw new Error('Abra ou crie um perfil antes de aceitar as regras da atividade.');runtime.data.acceptances||(runtime.data.acceptances={general:[],activities:[],permissions:[]});runtime.data.acceptances.activities||(runtime.data.acceptances.activities=[]);runtime.data.acceptances.activities.push(clone(record));runtime.data.acceptances.activities=runtime.data.acceptances.activities.slice(-100);return queuePersist('activity_terms_accepted',{activityAcceptanceId:record.activityAcceptanceId,activityId:record.activityId,activityTermsVersion:record.activityTermsVersion})}
export function savePermissionAcceptance(record){if(!runtime.data)return;runtime.data.acceptances||(runtime.data.acceptances={general:[],activities:[],permissions:[]});runtime.data.acceptances.permissions||(runtime.data.acceptances.permissions=[]);runtime.data.acceptances.permissions.push(clone(record));runtime.data.acceptances.permissions=runtime.data.acceptances.permissions.slice(-100);return queuePersist('permission_preference_recorded',{permissionId:record.permissionId,status:record.status})}
export function getAuditLog(){return clone(runtime.data?.audit||[])}

export function exportSnapshot(){return {kind:'agv-progress-legacy-export',version:APP_VERSION,exportedAt:now(),profile:getProfile(),progress:getAllProgress(),settings:getSettings(),results:getResults()}}
export function importSnapshot(data){
  if(!data||!['agv-progress','agv-progress-legacy-export'].includes(data.kind))throw new Error('Arquivo de progresso inválido.');
  const profile=data.profile||{};runtime.activeId=null;runtime.key=null;runtime.data=ensureDataShape({...initialData(profile),profile:{...profile,id:profile.id||uid()},progress:clone(data.progress||{}),settings:{...DEFAULT_SETTINGS,...clone(data.settings||{})},results:Array.isArray(data.results)?clone(data.results):[],migrations:[{type:'legacy-json-import',at:now()}],audit:[]});runtime.temporary=true;runtime.legacy=false;
}
export async function exportActiveProfilePackage(){
  await runtime.saveQueue;if(!runtime.activeId)throw new Error('Proteja o perfil antes de exportar o backup criptografado.');const record=await getRecord(runtime.activeId);if(!record)throw new Error('Perfil protegido não encontrado.');
  const hash=await digestText(JSON.stringify(record));if(runtime.data){runtime.data.exports||(runtime.data.exports=[]);runtime.data.exports.push({id:uid(),at:now(),platform:'desafio-informatica',hash});queuePersist('profile_exported',{hash})}
  return {kind:'agv-edu-profile',formatVersion:1,exportedAt:now(),record,hash};
}
export async function importProfilePackage(pkg,{overwrite=false}={}){
  if(!runtime.db&&!runtime.redundantAvailable)throw new Error('O armazenamento protegido não está disponível neste navegador.');
  assertSafeStructure(pkg,{maxDepth:24,maxArray:2000,maxKeys:500});
  if(!pkg||pkg.kind!=='agv-edu-profile'||!pkg.record?.id||!(pkg.record?.crypto?.ciphertext||pkg.record?.crypto?.data?.ciphertext))throw new Error('Backup de perfil inválido.');
  pkg.record.id=safeIdentifier(pkg.record.id,100);pkg.record.meta=pkg.record.meta||{};pkg.record.meta.displayName=cleanText(pkg.record.meta.displayName,90);pkg.record.meta.classId=safeIdentifier(pkg.record.meta.classId,30);
  const current=await getRecord(pkg.record.id);if(current&&!overwrite)throw new Error('Já existe um perfil com o mesmo identificador neste dispositivo.');
  const expected=await digestText(JSON.stringify(pkg.record));if(pkg.hash&&pkg.hash!==expected)throw new Error('A integridade do backup não pôde ser confirmada.');
  clearDeletedProfile(pkg.record.id);const imported=clone(pkg.record);imported.meta={...(imported.meta||{}),expiresAt:plusDays(now(),PROFILE_RETENTION_DAYS),retentionDays:PROFILE_RETENTION_DAYS,revision:Math.max(1,recordRevision(imported)||1),writerTabId:runtime.tabId};saveRedundantRecord(imported);try{await dbPut(imported)}catch{}runtime.profiles=await listValidProfiles();return clone(imported.meta);
}
export async function flushStorage(){await runtime.saveQueue;return true}
export const STORAGE_EVENTS={status:STORAGE_STATUS_EVENT,profileSync:PROFILE_SYNC_EVENT}


export async function exportProfileRecoveryEnvelope(profileId){
  const record=await getRecord(profileId);if(!record)throw new Error('Perfil não encontrado.');
  if(record.formatVersion<2||!record.crypto?.recoveryEnvelope)throw new Error('Este perfil ainda não possui envelope de recuperação EduAuth. Desbloqueie-o uma vez para migrar.');
  return {kind:'eduauth-profile-recovery-envelope',formatVersion:1,createdAt:now(),platformId:'desafio-informatica-agv',profile:{id:record.id,displayName:record.meta?.displayName||'',classId:record.meta?.classId||'',createdAt:record.meta?.createdAt||'',updatedAt:record.meta?.updatedAt||''},recoveryEnvelope:clone(record.crypto.recoveryEnvelope),passwordEnvelopeMetadata:{algorithm:record.crypto.passwordEnvelope?.algorithm,keyDerivation:record.crypto.passwordEnvelope?.keyDerivation,iterations:record.crypto.passwordEnvelope?.iterations,salt:record.crypto.passwordEnvelope?.salt},notice:'A senha antiga não está contida neste pacote. A chave privada de recuperação permanece somente no EduAuth Professor.'};
}

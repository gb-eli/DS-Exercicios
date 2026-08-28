import { POLICIES } from './config.js';

const SESSION_KEY='eduauth.session.v1';
const REQUEST_PREFIX='eduauth.request.v1.';
const AUTH_PREFIX='eduauth.authorization.v1.';
const DB_NAME='eduauth-offline-audit';
const DB_VERSION=1;
const STORE='events';
let dbPromise=null;

function now(){return new Date().toISOString()}
function safeParse(value,fallback=null){try{return JSON.parse(value)??fallback}catch{return fallback}}
function uid(){return crypto.randomUUID?.()||[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join('')}
function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
function requestKey(actionId,resourceId){return `${REQUEST_PREFIX}${actionId}.${resourceId||'default'}`}
function authKey(actionId,resourceId){return `${AUTH_PREFIX}${actionId}.${resourceId||'default'}`}

export function getBrowserSessionId(){
  let value=sessionStorage.getItem(SESSION_KEY);if(!value){value=uid();sessionStorage.setItem(SESSION_KEY,value)}return value;
}
export function savePendingRequest(request){
  const key=requestKey(request.context.actionId,request.context.resourceId);const previous=safeParse(sessionStorage.getItem(key));
  if(previous)previous.invalidatedAt=now();sessionStorage.setItem(key,JSON.stringify({...request,attempts:request.attempts||0,consumed:false,updatedAt:now()}));return request;
}
export function getPendingRequest(actionId,resourceId){return safeParse(sessionStorage.getItem(requestKey(actionId,resourceId)))}
export function removePendingRequest(actionId,resourceId){sessionStorage.removeItem(requestKey(actionId,resourceId))}
export function incrementAttempt(actionId,resourceId){const current=getPendingRequest(actionId,resourceId);if(!current)return null;current.attempts=(current.attempts||0)+1;current.updatedAt=now();sessionStorage.setItem(requestKey(actionId,resourceId),JSON.stringify(current));return current}
export function invalidatePendingRequest(actionId,resourceId,reason='invalidated'){
  const current=getPendingRequest(actionId,resourceId);if(!current)return;current.invalidatedAt=now();current.invalidationReason=reason;sessionStorage.setItem(requestKey(actionId,resourceId),JSON.stringify(current));
}
export function consumeRequest(request){
  const current=getPendingRequest(request.context.actionId,request.context.resourceId)||request;current.consumed=true;current.consumedAt=now();sessionStorage.setItem(requestKey(request.context.actionId,request.context.resourceId),JSON.stringify(current));
  const authorization={authorizationId:uid(),requestId:request.context.requestId||'',platformId:request.context.platformId,actionId:request.context.actionId,resourceId:request.context.resourceId,sessionId:request.context.sessionId||getBrowserSessionId(),grantedAt:Date.now(),expiresAt:Math.min((request.context.expiresAt||Math.floor(Date.now()/1000)+60)*1000,Date.now()+5*60*1000),consumed:false};
  sessionStorage.setItem(authKey(authorization.actionId,authorization.resourceId),JSON.stringify(authorization));return authorization;
}
export function getAuthorization(actionId,resourceId){const auth=safeParse(sessionStorage.getItem(authKey(actionId,resourceId)));if(!auth)return null;if(auth.expiresAt<Date.now()){sessionStorage.removeItem(authKey(actionId,resourceId));return null}return auth}
export function consumeAuthorization(actionId,resourceId){const auth=getAuthorization(actionId,resourceId);if(!auth||auth.consumed)return false;auth.consumed=true;auth.consumedAt=Date.now();sessionStorage.setItem(authKey(actionId,resourceId),JSON.stringify(auth));return true}
export function remainingAttempts(request){return Math.max(0,POLICIES.maximumAttempts-(request?.attempts||0))}
export function progressiveDelayMs(attempts){if(!POLICIES.progressiveDelay||attempts<=1)return 0;return Math.min(12000,750*(2**Math.min(4,attempts-1)))}

function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('at','at')}};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Falha ao abrir o log EduAuth.'))})}
async function db(){dbPromise||(dbPromise=openDb());return dbPromise}
export async function appendAudit(event){
  const record={id:uid(),at:now(),protocol:'EDUAUTH',version:1,...clone(event)};
  try{const database=await db();await new Promise((resolve,reject)=>{const tx=database.transaction(STORE,'readwrite');tx.objectStore(STORE).put(record);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}catch(error){console.warn('Log EduAuth local indisponível:',error)}
  return record;
}
export async function getAuditEvents(limit=200){
  try{const database=await db();const all=await new Promise((resolve,reject)=>{const tx=database.transaction(STORE,'readonly'),req=tx.objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)});return all.sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,limit)}catch{return[]}
}

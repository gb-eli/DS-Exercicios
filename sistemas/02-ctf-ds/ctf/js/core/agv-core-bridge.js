const SUPABASE_URL='https://iresvqwyaqotghjssncg.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO';
const SESSION_KEY='sb-iresvqwyaqotghjssncg-auth-token';
const LEGACY_SESSION_KEY='ctfds:agv-core-session:v1';
let cachedSession=null;
let identity=null;
let provisionedChallenges=new Set();

export const AGV_CORE_INFO=Object.freeze({platformId:'ctf-ds',authority:'agv-core',sessionStorage:'localStorage',sessionKey:SESSION_KEY});
const enc=v=>encodeURIComponent(String(v??''));
function migrateLegacy(){try{if(!localStorage.getItem(SESSION_KEY)){const old=sessionStorage.getItem(LEGACY_SESSION_KEY);if(old)localStorage.setItem(SESSION_KEY,old)}sessionStorage.removeItem(LEGACY_SESSION_KEY)}catch{}}
function saveSession(value){cachedSession=value?.access_token?value:null;try{cachedSession?localStorage.setItem(SESSION_KEY,JSON.stringify(cachedSession)):localStorage.removeItem(SESSION_KEY)}catch{}return cachedSession;}
function loadSession(){if(cachedSession?.access_token)return cachedSession;migrateLegacy();try{cachedSession=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{cachedSession=null}return cachedSession;}
export const hasCentralSession=()=>Boolean(loadSession()?.access_token);
async function raw(path,{method='POST',body,token=true,retry=true}={}){let s=loadSession();const headers={apikey:PUBLISHABLE_KEY,'content-type':'application/json'};if(token&&s?.access_token)headers.Authorization=`Bearer ${s.access_token}`;let response=await fetch(`${SUPABASE_URL}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});if(response.status===401&&token&&retry&&s?.refresh_token){const rr=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'content-type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});if(rr.ok){s=saveSession(await rr.json());return raw(path,{method,body,token,retry:false})}}const data=await response.json().catch(()=>({}));if(!response.ok){const e=new Error(data?.message||data?.error_description||data?.error||`Falha no Core (${response.status}).`);e.code=data?.error||'core_error';e.status=response.status;e.data=data;throw e}return data;}
async function loadIdentity(user){const profiles=await raw(`/rest/v1/profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${enc(user.id)}&limit=1`,{method:'GET'});const profile=profiles?.[0];if(!profile?.active)throw new Error('Conta inativa ou perfil central não localizado.');const memberships=await raw(`/rest/v1/class_memberships?select=class_id,is_primary&user_id=eq.${enc(user.id)}&active=eq.true&order=is_primary.desc&limit=1`,{method:'GET'});let classInfo=null;if(memberships?.[0]?.class_id){const classes=await raw(`/rest/v1/classes?select=id,code,name,shift&id=eq.${enc(memberships[0].class_id)}&limit=1`,{method:'GET'});classInfo=classes?.[0]||null;}identity={user,profile,classInfo};return identity;}
async function identityFromSession(){if(!hasCentralSession())return null;try{const user=await raw('/auth/v1/user',{method:'GET'});const s=loadSession();if(s){s.user=user;saveSession(s)}return loadIdentity(user)}catch(error){if(error.status===401)saveSession(null);throw error}}
export async function centralSignOut(){try{if(hasCentralSession())await raw('/auth/v1/logout',{body:{}})}catch{}identity=null;provisionedChallenges.clear();saveSession(null);}
async function coreAction(action,payload={}){return raw('/functions/v1/ctf-core-actions',{body:{action,...payload}})}
export async function loadCoreCTFState(){if(!identity)identity=await identityFromSession();if(!identity)throw new Error('Sessão institucional necessária.');const state=await coreAction('state');const catalog=state.catalog||[];provisionedChallenges=new Set(catalog.filter(x=>String(x.activity_id||'').startsWith('challenge:')).map(x=>String(x.activity_id).replace(/^challenge:/,'')));return {...state,identity,provisionedChallengeIds:[...provisionedChallenges],catalogComplete:catalog.length>=86};}
export const isCoreChallengeProvisioned=id=>provisionedChallenges.has(String(id||''));
export async function completeCoreChallenge(challengeId,answer,attemptId){if(!isCoreChallengeProvisioned(challengeId))throw Object.assign(new Error('Esta missão ainda não está provisionada no Core.'),{code:'activity_not_provisioned'});return raw('/functions/v1/ctf-complete-challenge',{body:{challengeId,answer,attemptId}});}
export const startCoreLesson=lessonId=>coreAction('lesson_start',{lessonId});
export const completeCoreLesson=lessonId=>coreAction('lesson_complete',{lessonId});
export const recordCoreToolUse=(toolId,eventId)=>coreAction('tool_used',{toolId,eventId});
export const syncCoreDaily=()=>coreAction('daily_sync');
export const purchaseCoreHint=challengeId=>coreAction('hint',{challengeId});
export const purchaseCoreStoreItem=itemId=>coreAction('store_purchase',{itemId});
window.addEventListener('storage',event=>{if(event.key===SESSION_KEY){cachedSession=null;identity=null;provisionedChallenges.clear();}});

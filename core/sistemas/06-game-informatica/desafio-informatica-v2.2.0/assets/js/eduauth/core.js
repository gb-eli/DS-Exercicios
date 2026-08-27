import { ACTIONS, MODES, PLATFORM, POLICIES, REGISTRY, TEST_KEYS, codeFor, idFor, classIdForRegistry, lessonIdForRegistry } from './config.js';

const enc=new TextEncoder();
const dec=new TextDecoder();
const CROCKFORD='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CHECKSUM_LENGTH=4;
const ISSUED_AT_QUANTUM_SECONDS=5;
const DECODE_MAP=(()=>{const map={};[...CROCKFORD].forEach((c,i)=>map[c]=i);map.O=map.o=0;map.I=map.i=1;map.L=map.l=1;return map})();

export function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.keys(value).sort().reduce((out,key)=>{if(value[key]!==undefined)out[key]=stable(value[key]);return out},{});
  return value;
}
export function canonicalString(value){return JSON.stringify(stable(value))}
export function canonicalBytes(value){return enc.encode(canonicalString(value))}
export function normalizeHumanCode(value){return String(value||'').toUpperCase().replace(/[\s-]+/g,'').replace(/O/g,'0').replace(/[IL]/g,'1')}
export function formatPin(value){const digits=String(value||'').replace(/\D/g,'');return digits.replace(/(.{4})/g,'$1 ').trim()}
export function normalizePin(value){return String(value||'').replace(/\D/g,'')}
export function toBase64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
export function fromBase64(value){const s=atob(value);const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
export function base64UrlEncode(bytes){return toBase64(bytes).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export function base64UrlDecode(value){const v=String(value).replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(value.length/4)*4,'=');return fromBase64(v)}
export function bytesToHex(bytes){return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('')}
export function randomBytes(length){const out=new Uint8Array(length);crypto.getRandomValues(out);return out}
export function randomToken(byteLength=6){return base32Encode(randomBytes(byteLength))}
export function hashBytesSyncFallback(bytes){let h=2166136261>>>0;for(const b of bytes){h^=b;h=Math.imul(h,16777619)>>>0}return new Uint8Array([(h>>>16)&255,(h>>>8)&255,h&255])}
export async function sha256(bytes){return new Uint8Array(await crypto.subtle.digest('SHA-256',bytes instanceof Uint8Array?bytes:enc.encode(String(bytes))))}
export async function shortHash(value,bytes=4){return (await sha256(typeof value==='string'?enc.encode(value):value)).slice(0,bytes)}

export function base32Encode(bytes){
  let bits=0,value=0,out='';
  for(const byte of bytes){value=(value<<8)|byte;bits+=8;while(bits>=5){out+=CROCKFORD[(value>>>(bits-5))&31];bits-=5}}
  if(bits>0)out+=CROCKFORD[(value<<(5-bits))&31];
  return out;
}
export function base32Decode(text){
  const cleaned=normalizeHumanCode(text);let bits=0,value=0;const out=[];
  for(const char of cleaned){const v=DECODE_MAP[char];if(v===undefined)throw new Error('Código-base contém caractere inválido.');value=(value<<5)|v;bits+=5;if(bits>=8){out.push((value>>>(bits-8))&255);bits-=8}}
  return new Uint8Array(out);
}
export function groupCode(text,size=4){return String(text).match(new RegExp(`.{1,${size}}`,'g'))?.join('-')||''}

// CRC32C (Castagnoli), usado somente para detectar erro de digitação.
const CRC32C_TABLE=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0x82F63B78^(c>>>1)):(c>>>1);table[n]=c>>>0}return table})();
export function crc32c(bytes){let crc=0xffffffff;for(const b of bytes)crc=CRC32C_TABLE[(crc^b)&0xff]^(crc>>>8);return (crc^0xffffffff)>>>0}
export function checksumFor(prefix,payloadBase32){const value=crc32c(enc.encode(`${prefix}|${payloadBase32}`));const bytes=new Uint8Array([(value>>>24)&255,(value>>>16)&255,(value>>>8)&255,value&255]);return base32Encode(bytes).slice(0,CHECKSUM_LENGTH)}

function modeByName(name){const mode=MODES[name];if(!mode)throw new Error(`Modalidade EduAuth desconhecida: ${name}`);return mode}
function modeByCode(code){const mode=Object.values(MODES).find(item=>item.numericCode===code);if(!mode)throw new Error('Modalidade EduAuth não reconhecida.');return mode}
function actionByCode(code){const action=Object.values(ACTIONS).find(item=>item.numericCode===code);if(!action)throw new Error('Ação EduAuth não reconhecida.');return action}
function writeU32(view,offset,value){view.setUint32(offset,Number(value)>>>0,false)}
function readU32(view,offset){return view.getUint32(offset,false)}
function timeWindowFor(action){if(action.fixedPerLesson)return 1;if(action.hourlyClassRelease)return POLICIES.classReleaseWindowSeconds||3600;return action.preferredMode==='CLASS_SHARED_PIN'?POLICIES.classWindowSeconds:(action.risk==='HIGH'||action.risk==='CRITICAL'?POLICIES.highRiskWindowSeconds:POLICIES.sessionWindowSeconds)}
export function currentUnixSeconds(nowMs=Date.now()){return Math.floor(nowMs/1000)}
export function getTimeSlot(windowSeconds,nowMs=Date.now()){return Math.floor(currentUnixSeconds(nowMs)/windowSeconds)}

export async function createContext({modeName,actionId,classId,lessonId,activityId,profileId='',resourceId='',nowMs=Date.now(),sessionData=null}){
  const action=ACTIONS[actionId];if(!action)throw new Error(`Ação não registrada: ${actionId}`);
  const mode=modeByName(modeName||action.preferredMode);const windowSeconds=timeWindowFor(action);const timeSlot=action.fixedPerLesson?0:getTimeSlot(windowSeconds,nowMs);
  const classNormalized=classIdForRegistry(classId);const lessonNormalized=lessonIdForRegistry(lessonId);
  const base={
    protocol:'EDUAUTH',version:1,mode:mode.id,keyId:mode.id==='CLASS_SHARED_PIN'?TEST_KEYS.class.keyId:TEST_KEYS.session.keyId,
    keyVersion:1,platformId:PLATFORM.id,classId:classNormalized,subjectId:PLATFORM.subjectId,lessonId:lessonNormalized,
    activityId,actionId,timeSlot,policyVersion:PLATFORM.policyVersion,resourceId:resourceId||lessonNormalized
  };
  base.resourceIdHash=base32Encode(await shortHash(base.resourceId,3));
  if(mode.id!=='CLASS_SHARED_PIN'){
    const session=sessionData||{};
    base.sessionId=session.sessionId||randomToken(3);
    base.requestId=session.requestId||randomToken(3);
    base.sessionNonce=session.sessionNonce||randomToken(3);
    const profileHash=profileId?await shortHash(profileId,3):new Uint8Array(3);
    base.profileIdHash=session.profileIdHash||base32Encode(profileHash);
    const slotStart=timeSlot*windowSeconds;
    const issuedAt=slotStart+(Math.floor((currentUnixSeconds(nowMs)-slotStart)/ISSUED_AT_QUANTUM_SECONDS)*ISSUED_AT_QUANTUM_SECONDS);
    base.issuedAt=issuedAt;
    base.issuedOffset5=Math.floor((issuedAt-slotStart)/ISSUED_AT_QUANTUM_SECONDS);
    base.expiresAt=issuedAt+action.ttlSeconds;
  }
  return base;
}

export function encodeRequestPayload(context){
  const mode=modeByName(context.mode),isSession=mode.id!=='CLASS_SHARED_PIN';const bytes=new Uint8Array(isSession?27:11),view=new DataView(bytes.buffer);
  bytes[0]=PLATFORM.code;bytes[1]=codeFor('classes',context.classId);bytes[2]=codeFor('subjects',context.subjectId);bytes[3]=codeFor('lessons',context.lessonId);
  bytes[4]=codeFor('activities',context.activityId);bytes[5]=codeFor('actions',context.actionId);bytes[6]=Number(context.policyVersion||1);writeU32(view,7,context.timeSlot);
  if(isSession){
    const session=base32Decode(context.sessionId).slice(0,3),request=base32Decode(context.requestId).slice(0,3),nonce=base32Decode(context.sessionNonce).slice(0,3),profile=base32Decode(context.profileIdHash).slice(0,3),resource=base32Decode(context.resourceIdHash).slice(0,3);
    bytes.set(session,11);bytes.set(request,14);bytes.set(nonce,17);bytes.set(profile,20);bytes.set(resource,23);bytes[26]=Number(context.issuedOffset5||0)&255;
  }
  return bytes;
}
export function decodeRequestPayload(bytes,{modePrefix,keyVersion}={}){
  if(!(bytes instanceof Uint8Array)||![11,27].includes(bytes.length))throw new Error('Tamanho do código-base inválido.');
  const mode=Object.values(MODES).find(item=>item.prefix===modePrefix);if(!mode)throw new Error('Modalidade EduAuth não reconhecida.');
  const isSession=mode.id!=='CLASS_SHARED_PIN';if((isSession&&bytes.length!==27)||(!isSession&&bytes.length!==11))throw new Error('Modalidade e tamanho do código-base são incompatíveis.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),action=actionByCode(bytes[5]),windowSeconds=timeWindowFor(action);const context={
    protocol:'EDUAUTH',version:1,mode:mode.id,keyId:mode.id==='CLASS_SHARED_PIN'?TEST_KEYS.class.keyId:TEST_KEYS.session.keyId,keyVersion:Number(keyVersion||1),
    platformId:idFor('platforms',bytes[0]),classId:idFor('classes',bytes[1]),subjectId:idFor('subjects',bytes[2]),lessonId:idFor('lessons',bytes[3]),
    activityId:idFor('activities',bytes[4]),actionId:idFor('actions',bytes[5]),policyVersion:bytes[6],timeSlot:readU32(view,7),resourceId:idFor('lessons',bytes[3])
  };
  if(isSession){
    context.sessionId=base32Encode(bytes.slice(11,14));context.requestId=base32Encode(bytes.slice(14,17));context.sessionNonce=base32Encode(bytes.slice(17,20));context.profileIdHash=base32Encode(bytes.slice(20,23));context.resourceIdHash=base32Encode(bytes.slice(23,26));context.resourceId=`resource-${context.resourceIdHash}`;context.issuedOffset5=bytes[26];context.issuedAt=(context.timeSlot*windowSeconds)+(context.issuedOffset5*ISSUED_AT_QUANTUM_SECONDS);context.expiresAt=context.issuedAt+action.ttlSeconds;
  }
  return context;
}

export function encodeRequestCode(context){
  const mode=modeByName(context.mode);const payloadBase32=base32Encode(encodeRequestPayload(context));const prefix=`EA1-${mode.prefix}-K${String(context.keyVersion||1).padStart(2,'0')}`;const checksum=checksumFor(prefix,payloadBase32);
  return `${prefix}-${groupCode(payloadBase32,4)}-${checksum}`;
}
export function parseRequestCode(code){
  const raw=String(code||'').toUpperCase().trim();const match=raw.match(/^EA1[\s-]*(C1|S1|R1)[\s-]*K(\d{2})[\s-]*(.+)$/i);if(!match)throw new Error('Formato de código-base não reconhecido.');
  const modePrefix=match[1].toUpperCase(),keyVersion=Number(match[2]);const compact=normalizeHumanCode(match[3]);if(compact.length<9)throw new Error('Código-base incompleto.');
  const payloadBase32=compact.slice(0,-CHECKSUM_LENGTH),checksum=compact.slice(-CHECKSUM_LENGTH);const prefix=`EA1-${modePrefix}-K${String(keyVersion).padStart(2,'0')}`;const expected=checksumFor(prefix,payloadBase32);if(checksum!==expected)throw new Error('Checksum inválido. Confira a digitação.');
  const context=decodeRequestPayload(base32Decode(payloadBase32),{modePrefix,keyVersion});const expectedMode=Object.values(MODES).find(m=>m.prefix===modePrefix);if(context.mode!==expectedMode?.id)throw new Error('Modalidade incompatível.');if(context.keyVersion!==keyVersion)throw new Error('Versão da chave incompatível.');
  return {context,payloadBase32,checksum,prefix,formatted:encodeRequestCode(context)};
}

async function importHmacKey(mode){const raw=fromBase64(mode==='CLASS_SHARED_PIN'?TEST_KEYS.class.rawBase64:TEST_KEYS.session.rawBase64);return crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['sign'])}
export function pinCanonicalContext(context){
  const allowed=['protocol','version','mode','keyId','keyVersion','platformId','classId','subjectId','lessonId','activityId','actionId','timeSlot','policyVersion','sessionId','requestId','sessionNonce','profileIdHash','issuedAt','expiresAt'];
  const out=allowed.reduce((result,key)=>{if(context[key]!==undefined)result[key]=context[key];return result},{});
  if(context.mode!=='CLASS_SHARED_PIN'&&context.resourceIdHash!==undefined)out.resourceIdHash=context.resourceIdHash;
  return out;
}
export async function hmacForContext(context){const key=await importHmacKey(context.mode);return new Uint8Array(await crypto.subtle.sign('HMAC',key,canonicalBytes(pinCanonicalContext(context))))}
export function dynamicTruncate(hmac){const offset=hmac[hmac.length-1]&0x0f;return (((hmac[offset]&0x7f)<<24)|((hmac[offset+1]&0xff)<<16)|((hmac[offset+2]&0xff)<<8)|(hmac[offset+3]&0xff))>>>0}
export async function generatePin(context){const action=ACTIONS[context.actionId];const hmac=await hmacForContext(context);const value=dynamicTruncate(hmac)%10**action.pinLength;return String(value).padStart(action.pinLength,'0')}
export async function createRequest(options){const action=ACTIONS[options.actionId];if(!action)throw new Error('Ação EduAuth não registrada.');const context=await createContext({...options,modeName:options.modeName||action.preferredMode});const code=encodeRequestCode(context);const pin=await generatePin(context);return {context,code,pin,action,createdAt:new Date().toISOString()}}

export function validateRequestFreshness(context,{nowMs=Date.now(),allowedDriftSlots=POLICIES.allowedClockDriftSlots}={}){
  const action=ACTIONS[context.actionId],windowSeconds=timeWindowFor(action),now=currentUnixSeconds(nowMs),currentSlot=Math.floor(now/windowSeconds);
  if(action?.fixedPerLesson)return true;
  if(action?.hourlyClassRelease)return currentSlot===context.timeSlot;
  if(context.mode==='CLASS_SHARED_PIN')return Math.abs(currentSlot-context.timeSlot)<=allowedDriftSlots;
  const issuedAt=Number(context.issuedAt||context.timeSlot*windowSeconds),expiresAt=Number(context.expiresAt||issuedAt+action.ttlSeconds);
  return now<=expiresAt&&now>=issuedAt-(allowedDriftSlots*windowSeconds)&&context.timeSlot<=currentSlot+allowedDriftSlots;
}
export async function validatePinForRequest(request,inputPin,{nowMs=Date.now()}={}){
  if(!request?.context)throw new Error('Solicitação EduAuth inválida.');if(!validateRequestFreshness(request.context,{nowMs}))return {valid:false,reason:'expired'};
  const expected=await generatePin(request.context),received=normalizePin(inputPin);let diff=expected.length^received.length;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^(received.charCodeAt(i)||0);return {valid:diff===0,reason:diff===0?'ok':'invalid'};
}

export async function verifySignedGrant(token,expected={}){
  const parts=String(token||'').trim().split('.');if(parts.length!==3||parts[0]!=='EA1-G1')return {valid:false,reason:'format'};
  const payloadBytes=base64UrlDecode(parts[1]),signature=base64UrlDecode(parts[2]);let payload;try{payload=JSON.parse(dec.decode(payloadBytes))}catch{return {valid:false,reason:'payload'}};
  const { SIGNING_PUBLIC_KEY }=await import('./config.js');const key=await crypto.subtle.importKey('jwk',SIGNING_PUBLIC_KEY.jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  const cryptographicallyValid=await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,signature,payloadBytes);if(!cryptographicallyValid)return {valid:false,reason:'signature'};
  const now=currentUnixSeconds();if(payload.expiresAt&&payload.expiresAt<now)return {valid:false,reason:'expired',payload};
  for(const [keyName,value] of Object.entries(expected)){if(value!==undefined&&payload[keyName]!==value)return {valid:false,reason:`scope:${keyName}`,payload}}
  return {valid:true,payload};
}

export function publicRequestSummary(context){const action=ACTIONS[context.actionId];return {platform:PLATFORM.name,classId:context.classId,subjectId:context.subjectId,lessonId:context.lessonId,activityId:context.activityId,action:action.label,risk:action.risk,mode:context.mode,timeSlot:context.timeSlot,issuedAt:context.issuedAt||null,expiresAt:context.expiresAt||null,session:context.sessionId||null}}
export { ACTIONS, MODES, PLATFORM, POLICIES, REGISTRY, codeFor, idFor };

const DB_NAME='agv-teacher-vault-v3';
const DB_VERSION=1;
const STORE='vault';
const RECORD_ID='results';
const enc=new TextEncoder();
const dec=new TextDecoder();
let db=null,key=null,records=[];
function b64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
function unb64(value){const s=atob(value),out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
function request(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Falha no cofre do professor.'))})}
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function getRecord(){const tx=db.transaction(STORE,'readonly');return request(tx.objectStore(STORE).get(RECORD_ID))}
async function putRecord(value){const tx=db.transaction(STORE,'readwrite');return request(tx.objectStore(STORE).put(value))}
async function derive(password,salt,iterations=180000){const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function persist(){if(!key)return;const current=await getRecord(),salt=current?.salt?unb64(current.salt):crypto.getRandomValues(new Uint8Array(16)),iterations=current?.iterations||180000;const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(records))));await putRecord({id:RECORD_ID,salt:b64(salt),iterations,iv:b64(iv),ciphertext:b64(cipher),updatedAt:new Date().toISOString()})}
export async function unlockTeacherVault(password){db=db||await open();let record=await getRecord();if(!record){const salt=crypto.getRandomValues(new Uint8Array(16));key=await derive(password,salt);records=[];const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode('[]')));await putRecord({id:RECORD_ID,salt:b64(salt),iterations:180000,iv:b64(iv),ciphertext:b64(cipher),updatedAt:new Date().toISOString()});return []}
  try{key=await derive(password,unb64(record.salt),record.iterations);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(record.iv)},key,unb64(record.ciphertext));records=JSON.parse(dec.decode(plain))||[];let legacy=null;try{legacy=localStorage.getItem('agv.teacher.imported.v4')}catch{}if(legacy){try{records=[...records,...JSON.parse(legacy)].filter(Boolean);try{localStorage.removeItem('agv.teacher.imported.v4')}catch{}await persist()}catch{}}return getTeacherRecords()}catch{key=null;throw new Error('Não foi possível abrir o cofre local do professor.')}
}
export function getTeacherRecords(){return JSON.parse(JSON.stringify(records))}
export async function saveTeacherRecords(value){records=JSON.parse(JSON.stringify(value||[]));await persist()}
export async function clearTeacherRecords(){records=[];await persist()}
export function lockTeacherVault(){key=null;records=[]}

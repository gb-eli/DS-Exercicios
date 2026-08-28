const enc=new TextEncoder();
const MASTER_POLICY={
  kind:'deployment-password',
  formatVersion:3,
  algorithm:'PBKDF2-HMAC-SHA-256',
  iterations:360000,
  salt:'Cue3sujs4t5t5dyfnHB3Mg==',
  verifier:'ge9Vvk7+aXYvFov3tkal7orZ5eng4iC22Y55lYz+Sus=',
  configuredAt:'2026-08-03T12:59:00-03:00',
  hint:'senha admin SEED TI nova.'
};
function unb64(value){const text=atob(value),out=new Uint8Array(text.length);for(let i=0;i<text.length;i++)out[i]=text.charCodeAt(i);return out}
async function deriveVerifier(password,salt,iterations){const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations},base,256))}
function sameBytes(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0}
export async function getTeacherCredentialStatus(){return {available:Boolean(globalThis.crypto?.subtle),configured:true,mode:'deployment-password',createdAt:MASTER_POLICY.configuredAt,minimumLength:9,hint:MASTER_POLICY.hint,algorithm:MASTER_POLICY.algorithm,iterations:MASTER_POLICY.iterations}}
export async function verifyTeacherCredential(password){
  try{const verifier=await deriveVerifier(String(password||''),unb64(MASTER_POLICY.salt),MASTER_POLICY.iterations);return sameBytes(verifier,unb64(MASTER_POLICY.verifier))}catch{return false}
}
export async function setupTeacherCredential(){throw new Error('A criação livre de credencial foi desativada. O painel usa a senha mestre definida na publicação.')}

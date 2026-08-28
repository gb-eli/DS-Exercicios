import { verifyTeacherCredential } from './teacher-auth.js?v=20260811r38';

const enc=new TextEncoder();
const dec=new TextDecoder();

function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.keys(value).sort().reduce((out,key)=>{out[key]=stable(value[key]);return out},{});
  return value;
}
async function sha256Hex(text){
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(text)));
  return [...digest].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function verifyTeacherVaultCredential(value){return verifyTeacherCredential(value)}
export async function createValidationToken(result){
  const payload={
    id:result?.id||'',student:result?.student?.name||'',selectedClass:result?.selectedClass||result?.classId||'',
    diagnosticMode:result?.diagnosticMode||result?.kind||'',proficiency:result?.proficiency??'',correct:result?.correct??'',
    answered:result?.answered??'',durationSeconds:result?.durationSeconds??'',endedAt:result?.endedAt||'',termsStatus:result?.termsAcceptance?.status||'',generalAcceptanceId:result?.termsAcceptance?.generalAcceptanceId||'',activityAcceptanceId:result?.termsAcceptance?.activityAcceptanceId||''
  };
  const hex=(await sha256Hex(JSON.stringify(stable(payload)))).slice(0,24).toUpperCase();
  return `AGV-CHECK-${hex.match(/.{1,6}/g).join('-')}`;
}
export async function createResultPackage(obj){
  const payload=stable(obj),hash=await sha256Hex(JSON.stringify(payload));
  return {kind:'agv-result-package',formatVersion:2,createdAt:new Date().toISOString(),integrity:{algorithm:'SHA-256',hash,notice:'Verificação de integridade local; não equivale a assinatura digital de servidor.'},payload:obj};
}
export async function verifyResultPackage(pkg){
  if(!pkg||pkg.kind!=='agv-result-package'||!pkg.payload||!pkg.integrity?.hash)return {valid:false,payload:null};
  const hash=await sha256Hex(JSON.stringify(stable(pkg.payload)));return {valid:hash===pkg.integrity.hash,payload:pkg.payload};
}
// Compatibilidade de nome com versões anteriores. O novo formato é um pacote
// JSON autenticado por hash, não uma criptografia com segredo embutido.
export async function encryptObject(obj){return enc.encode(JSON.stringify(await createResultPackage(obj),null,2))}
export async function decryptObject(buffer){
  const pkg=JSON.parse(dec.decode(buffer instanceof ArrayBuffer?new Uint8Array(buffer):buffer));
  if(pkg?.kind==='agv-result-package'){const checked=await verifyResultPackage(pkg);if(!checked.valid)throw new Error('Integridade inválida.');return checked.payload}
  if(pkg?.kind==='agv-diagnostic-result')return pkg;
  throw new Error('Formato de resultado não compatível com esta versão.');
}
export function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
export async function downloadEncrypted(obj,name){const pkg=await createResultPackage(obj);downloadBlob(new Blob([JSON.stringify(pkg,null,2)],{type:'application/json'}),name)}
export function downloadJSON(obj,name){downloadBlob(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),name)}

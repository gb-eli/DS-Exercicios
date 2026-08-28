import { supabase, handleSessionInvalid } from './supabase.js?v=14.10.8.35';

export function normalizeWeekendVoucherCode(value){
  const raw=String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!raw.startsWith('FDS')||raw.length!==11)return '';
  return `FDS-${raw.slice(3,7)}-${raw.slice(7,11)}`;
}
export function formatWeekendVoucherDate(value){
  if(!value)return '—';
  try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'medium'}).format(new Date(value));}
  catch(_){return String(value);}
}
export async function callWeekendVoucher(action,payload={}){
  const {data,error}=await supabase.functions.invoke('weekend-bonus-voucher',{body:{action,...payload}});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  await handleSessionInvalid(details);
  const e=new Error(details?.detail||details?.message||details?.error||error?.message||'Falha ao consultar o voucher de fim de semana.');
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}
export async function copyWeekendVoucherCode(code){
  const text=normalizeWeekendVoucherCode(code)||String(code||'').trim();
  if(!text)return false;
  try{await navigator.clipboard.writeText(text);return true;}catch(_){}
  try{
    const input=document.createElement('textarea');input.value=text;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();const ok=document.execCommand('copy');input.remove();return Boolean(ok);
  }catch(_){return false;}
}

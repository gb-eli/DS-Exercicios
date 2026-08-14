import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { CHALLENGE_SPEC } from "./challenge-spec.ts";
import { CHALLENGE_SEALS, PEPPER_PART_A } from "./challenge-seals.ts";

const PEPPER_PART_B = "YpE2W3X9LaJGcVeROkcPuHNF";
const PEPPER = `${PEPPER_PART_A}::${PEPPER_PART_B}`;
const PLATFORM_CODE = "ctf-ds";
const enc = new TextEncoder();
const dec = new TextDecoder();
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
const b64=(value:string)=>Uint8Array.from(atob(value),(c)=>c.charCodeAt(0));
const hex=(bytes:Uint8Array)=>[...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");
const sha256=async(value:string)=>hex(new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode(value))));
const normalize=(value:unknown)=>String(value??"").trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();

function canonicalize(type:string,value:unknown){
  const raw=String(value??"").trim();
  if(type==="choice")return raw;
  if(type==="multi-select"||type==="code-select")return raw.split(",").filter(Boolean).map(Number).sort((a,b)=>a-b).join(",");
  if(type==="sequence")return raw.split(",").filter(Boolean).join(",");
  if(type==="matching")return raw.split(",").filter(Boolean).map(part=>{const [key,opt]=part.split(":");return [String(key||"").trim(),Number(opt)] as [string,number]}).sort(([a],[b])=>a.localeCompare(b)).map(([k,o])=>`${k}:${o}`).join(",");
  return normalize(raw);
}

function passwordScore(password:string){
  const checks=[password.length>=12,password.length>=16,/[A-Z]/.test(password),/[a-z]/.test(password),/\d/.test(password),/[^A-Za-z0-9]/.test(password),!/(123456|password|senha|qwerty|admin|gabriel)/i.test(password)];
  return checks.filter(Boolean).length;
}
const EXPECTED_KEY_HASH="d4f6cfee296afbd1cb7eb8a80f8a1d640a49e281be8b158d49d2b43488d49906";
const attr=(src:string,name:string)=>src.match(new RegExp(`${name}\\s*=\\s*[\"']([^\"']+)[\"']`,`i`))?.[1]||"";
async function validateRule(ruleId:string,value:unknown){
  const source=String(value||"");
  switch(ruleId){
    case "html_unlock_key": return !/\sdisabled(?:\s|=|>)/i.test(source) && await sha256(normalize(attr(source,"data-key")))===EXPECTED_KEY_HASH;
    case "css_reveal_panel": return /display\s*:\s*block/i.test(source)&&/opacity\s*:\s*1(?:\D|$)/i.test(source);
    case "dom_xss_safe_sink": return /preview\.textContent\s*=\s*userInput/i.test(source)&&!/preview\.innerHTML\s*=/i.test(source);
    case "strong_password": return passwordScore(source)>=6;
    case "server_recalculates_total": return /calculateTotal\s*\(\s*req\.body\.items\s*\)/i.test(source)&&!/const\s+total\s*=\s*req\.body\.total/i.test(source);
    case "jinja_autoescape": return /\{\{\s*user_message\s*\}\}/i.test(source)&&!/\|\s*safe/i.test(source);
    default:return false;
  }
}
async function openSeal(challengeId:string,canonical:string,seal:{iv:string,ciphertext:string}){
  try{
    const material=enc.encode(`CTFDS-SEALED-v1|${challengeId}|${canonical}|${PEPPER}`);
    const digest=await crypto.subtle.digest("SHA-256",material);
    const key=await crypto.subtle.importKey("raw",digest,{name:"AES-GCM"},false,["decrypt"]);
    const clear=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(seal.iv),additionalData:enc.encode(`ctfds:${challengeId}:v1`)},key,b64(seal.ciphertext));
    const payload=JSON.parse(dec.decode(clear));
    return payload?.marker==="CTFDS_VALID"&&payload?.challengeId===challengeId?payload:null;
  }catch{return null}
}
async function verify(challengeId:string,value:unknown,userId:string){
  const spec=(CHALLENGE_SPEC as Record<string,{type:string,ruleId:string|null,requires:string[]}>)[challengeId];
  if(!spec)return {valid:false,reason:"challenge_missing"};
  if(spec.ruleId){const valid=await validateRule(spec.ruleId,value);return {valid,mode:"structural-rule",proof:valid?(await sha256(`${userId}|${challengeId}|${Date.now()}|rule`)).slice(0,24):""}}
  const canonical=canonicalize(spec.type,value);if(!canonical)return {valid:false,reason:"empty"};
  for(const seal of ((CHALLENGE_SEALS as Record<string,readonly {iv:string,ciphertext:string}[]>)[challengeId]||[])){
    const payload=await openSeal(challengeId,canonical,seal as {iv:string,ciphertext:string});
    if(payload)return {valid:true,mode:"sealed-aes-gcm",proof:(await sha256(`${userId}|${challengeId}|${payload.nonce}|${canonical}`)).slice(0,24)};
  }
  return {valid:false,reason:"seal_rejected"};
}

async function rewardTotals(admin:any,userId:string){
  const {data:wallet}=await admin.from("wallets").select("balance,lifetime_earned,lifetime_spent,status").eq("user_id",userId).maybeSingle();
  const {data:metrics}=await admin.from("metric_ledger").select("metric,delta").eq("user_id",userId);
  const totals={xp:0,points:0};for(const row of metrics||[]){if(row.metric==="xp")totals.xp+=Number(row.delta||0);if(row.metric==="points")totals.points+=Number(row.delta||0)}
  return {wallet:wallet||{balance:0,lifetime_earned:0,lifetime_spent:0,status:"active"},metrics:totals};
}

async function claimCompletedBlocks(admin:any,userId:string,platformId:string,attemptId:string){
  const {data:progress}=await admin.from("activity_progress").select("activity_id,status").eq("user_id",userId).eq("platform_id",platformId);
  const completed=new Set((progress||[]).filter((r:any)=>r.status==="completed").map((r:any)=>r.activity_id));
  const {data:blocks}=await admin.from("activity_catalog").select("activity_id,metadata").eq("platform_id",platformId).like("activity_id","block:%").eq("active",true);
  const rewards=[];
  for(const block of blocks||[]){
    if(completed.has(block.activity_id))continue;
    const ids=Array.isArray(block.metadata?.mission_ids)?block.metadata.mission_ids:[];
    if(!ids.length||!ids.every((id:string)=>completed.has(`challenge:${id}`)))continue;
    const idem=`ctf:block:${block.activity_id}:${userId}`;
    const {error:pe}=await admin.rpc("record_core_progress_event",{p_user_id:userId,p_platform_code:PLATFORM_CODE,p_activity_id:block.activity_id,p_event_type:"activity.completed",p_progress:100,p_score:null,p_payload:{source:"ctf-complete-challenge",attemptId},p_idempotency_key:`${idem}:progress`,p_occurred_at:new Date().toISOString()});
    if(pe)continue;
    const {data:rw,error:re}=await admin.rpc("claim_core_reward_service",{p_user_id:userId,p_platform_code:PLATFORM_CODE,p_activity_id:block.activity_id,p_event_type:"block.completed",p_evidence_id:`server-block:${block.activity_id}`,p_attempt_id:attemptId,p_metadata:{source:"ctf-complete-challenge"},p_idempotency_key:`${idem}:reward`});
    if(!re&&rw)rewards.push({blockId:block.activity_id,reward:rw});
  }
  return rewards;
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  try{
    const auth=req.headers.get("Authorization")||"";
    const url=Deno.env.get("SUPABASE_URL")!;const anon=Deno.env.get("SUPABASE_ANON_KEY")!;const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:ue}=await client.auth.getUser();if(ue||!user)return json({error:"unauthorized"},401);
    const body=await req.json();const challengeId=String(body.challengeId||"");const attemptId=String(body.attemptId||"");
    if(!challengeId||attemptId.length<8)return json({error:"invalid_request"},400);
    const spec=(CHALLENGE_SPEC as Record<string,{type:string,ruleId:string|null,requires:string[]}>)[challengeId];if(!spec)return json({error:"challenge_not_registered"},404);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:platform}=await admin.from("platforms").select("id").eq("code",PLATFORM_CODE).eq("active",true).maybeSingle();if(!platform)return json({error:"platform_not_registered"},500);
    const activityId=`challenge:${challengeId}`;
    const {data:catalog}=await admin.from("activity_catalog").select("activity_id,active,reward_policy").eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();
    if(!catalog?.active)return json({error:"activity_not_registered"},409);
    if(spec.requires.length){
      const reqIds=spec.requires.map(id=>`challenge:${id}`);
      const {data:reqRows}=await admin.from("activity_progress").select("activity_id,status").eq("user_id",user.id).eq("platform_id",platform.id).in("activity_id",reqIds);
      const ok=new Set((reqRows||[]).filter((r:any)=>r.status==="completed").map((r:any)=>r.activity_id));
      const missing=reqIds.filter(id=>!ok.has(id));if(missing.length)return json({error:"prerequisites_missing",missing},409);
    }
    const verification=await verify(challengeId,body.answer,user.id);
    const base=`ctf:${challengeId}:${user.id}:${attemptId}`;
    if(!verification.valid){
      await admin.rpc("record_core_progress_event",{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:"challenge.failed",p_progress:0,p_score:null,p_payload:{attemptId,verification:verification.reason||"invalid"},p_idempotency_key:`${base}:failed`,p_occurred_at:new Date().toISOString()});
      return json({ok:false,valid:false,error:"answer_invalid"},400);
    }
    const {data:existing}=await admin.from("activity_progress").select("status").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();
    if(existing?.status==="completed")return json({ok:true,valid:true,already_completed:true,verification:{mode:verification.mode},...(await rewardTotals(admin,user.id))});
    const {data:progress,error:pe}=await admin.rpc("record_core_progress_event",{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:"activity.completed",p_progress:100,p_score:null,p_payload:{attemptId,verificationMode:verification.mode},p_idempotency_key:`${base}:progress`,p_occurred_at:new Date().toISOString()});
    if(pe)return json({error:"progress_rejected",message:pe.message},400);
    const {data:reward,error:re}=await admin.rpc("claim_core_reward_service",{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:"challenge.completed",p_evidence_id:`server:${verification.proof}`,p_attempt_id:attemptId,p_metadata:{verificationMode:verification.mode},p_idempotency_key:`ctf:reward:${challengeId}:${user.id}`});
    if(re)return json({error:"reward_rejected",message:re.message,progress},400);
    const blocks=await claimCompletedBlocks(admin,user.id,platform.id,attemptId);
    return json({ok:true,valid:true,verification:{mode:verification.mode,proof:verification.proof},progress,reward,blocks,...(await rewardTotals(admin,user.id))});
  }catch(error){return json({error:"internal_error",message:String((error as Error)?.message||error)},500)}
});

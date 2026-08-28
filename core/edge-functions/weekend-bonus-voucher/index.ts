import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
import { requireLiveAuthSession } from "./session-guard.ts";

const TZ = "America/Sao_Paulo";
const REWARD_POINTS = 1;
const REASON = "Estudo no final de semana — acesso ao Portal de Atividades durante a janela especial";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const J = (body: unknown, status = 200, extra: Record<string,string> = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { ...H, ...extra, "content-type": "application/json", "cache-control": "no-store" },
});
const S = (v: unknown, n = 500) => String(v ?? "").trim().slice(0, n);
const DAY: Record<string,number> = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };

function zonedParts(epochMs:number){
  const dtf = new Intl.DateTimeFormat("en-US", {timeZone:TZ,weekday:"long",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
  const raw = Object.fromEntries(dtf.formatToParts(new Date(epochMs)).filter(p=>p.type!=="literal").map(p=>[p.type,p.value]));
  return {weekday:raw.weekday,year:Number(raw.year),month:Number(raw.month),day:Number(raw.day),hour:Number(raw.hour),minute:Number(raw.minute),second:Number(raw.second)};
}
function offsetMs(epochMs:number){const p=zonedParts(epochMs);return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-Math.floor(epochMs/1000)*1000;}
function localToEpoch(year:number,month:number,day:number,hour=0,minute=0,second=0){const wall=Date.UTC(year,month-1,day,hour,minute,second);let c=wall-offsetMs(wall);c=wall-offsetMs(c);return c;}
function addDays(year:number,month:number,day:number,days:number){const d=new Date(Date.UTC(year,month-1,day+days));return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()};}
function pad(n:number){return String(n).padStart(2,"0");}
function weekendWindow(now=Date.now()){
  const p=zonedParts(now), idx=DAY[p.weekday], isWeekend=idx===6||idx===0;
  let sunday={year:p.year,month:p.month,day:p.day}; if(idx===6)sunday=addDays(p.year,p.month,p.day,1);
  const cutoff=isWeekend?localToEpoch(sunday.year,sunday.month,sunday.day,18,0,0):0;
  const eligible=isWeekend&&now<cutoff;
  return {eligible,weekendId:isWeekend?`${sunday.year}-${pad(sunday.month)}-${pad(sunday.day)}`:null,cutoffMs:cutoff,local:p};
}
function normalizeCode(value:unknown){const raw=S(value,64).toUpperCase().replace(/[^A-Z0-9]/g,"");if(!raw.startsWith("FDS")||raw.length!==11)return "";return `FDS-${raw.slice(3,7)}-${raw.slice(7,11)}`;}
function randomCode(){const bytes=new Uint8Array(8);crypto.getRandomValues(bytes);let x="";for(const b of bytes)x+=ALPHABET[b%ALPHABET.length];return `FDS-${x.slice(0,4)}-${x.slice(4,8)}`;}
function ipOf(req:Request){const cf=S(req.headers.get("cf-connecting-ip"),128);if(cf)return cf;const real=S(req.headers.get("x-real-ip"),128);if(real)return real;return S(req.headers.get("x-forwarded-for"),512).split(",").map(x=>x.trim()).filter(Boolean).at(-1)||null;}
async function rate(db:any,key:string,limit:number,window:number,block:number){const {data,error}=await db.rpc("security_consume_rate_limit",{p_key:key,p_limit:limit,p_window_seconds:window,p_block_seconds:block});return error?{allowed:true,retry_after:0}:(data||{allowed:true,retry_after:0});}
async function staffAccess(db:any,user:any){
  const [{data:profile},{data:allow}] = await Promise.all([
    db.from("profiles").select("role,active,must_change_password").eq("id",user.id).maybeSingle(),
    db.from("staff_allowlist").select("role,active").eq("email",String(user.email||"").toLowerCase()).eq("active",true).maybeSingle(),
  ]);
  const role=String(allow?.role||profile?.role||"");
  if(!profile?.active||profile?.must_change_password||!["teacher","admin","super_admin"].includes(role))return {ok:false,role:"",global:false,classes:new Set<string>()};
  const global=["admin","super_admin"].includes(role);
  if(global)return {ok:true,role,global,classes:new Set<string>()};
  const {data:rows}=await db.from("teacher_classes").select("class_id").eq("teacher_email",String(user.email||"").toLowerCase()).eq("active",true);
  return {ok:true,role,global:false,classes:new Set((rows||[]).map((x:any)=>String(x.class_id)))};
}
async function voucherPayload(db:any,row:any){
  const [{data:student},{data:klass}] = await Promise.all([
    db.from("profiles").select("full_name").eq("id",row.student_id).maybeSingle(),
    db.from("classes").select("code,name,shift").eq("id",row.class_id).maybeSingle(),
  ]);
  return {
    code:row.code,
    reward_points:Number(row.reward_points||REWARD_POINTS),
    student_name:student?.full_name||"Aluno",
    class_id:row.class_id,
    class_code:klass?.code||null,
    class_name:klass?.name||klass?.code||"Turma",
    class_shift:klass?.shift||null,
    weekend_id:row.weekend_id,
    issued_at:row.issued_at,
    eligible_until:row.eligible_until,
    timezone:row.timezone||TZ,
    reason:row.reason||REASON,
    redeemed_at:row.redeemed_at||null,
    redemption_note:row.redemption_note||null,
    revoked_at:row.revoked_at||null,
    status:row.revoked_at?"revoked":row.redeemed_at?"redeemed":"issued",
  };
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:H});
  if(req.method!=="POST")return J({error:"method_not_allowed"},405);
  try{
    const auth=req.headers.get("Authorization")||"", url=Deno.env.get("SUPABASE_URL")!, anon=Deno.env.get("SUPABASE_ANON_KEY")!, service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:userError}=await userClient.auth.getUser(); if(userError||!user)return J({error:"unauthorized"},401);
    const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const live=await requireLiveAuthSession(db,auth,user.id); if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);
    const body=await req.json().catch(()=>({})), action=S(body.action||"issue",32), ip=ipOf(req);
    const lim=await rate(db,`weekend-voucher:${action}:${user.id}:${ip||"noip"}`,action==="issue"?8:30,60,300); if(lim.allowed===false)return J({error:"rate_limited",retry_after:lim.retry_after||300},429,{"Retry-After":String(lim.retry_after||300)});

    if(action==="issue"){
      const {data:profile}=await db.from("profiles").select("role,active,must_change_password,full_name").eq("id",user.id).maybeSingle();
      if(profile?.role!=="student"||!profile?.active||profile?.must_change_password)return J({error:"student_not_eligible"},403);
      const window=weekendWindow(Date.now()); if(!window.eligible||!window.weekendId)return J({error:"weekend_window_closed",timezone:TZ},409);
      if(body.weekend_id&&S(body.weekend_id,16)!==window.weekendId)return J({error:"stale_weekend_window"},409);
      let classId=S(body.class_id,64);
      let membership:any=null;
      if(classId){const {data}=await db.from("class_memberships").select("class_id").eq("user_id",user.id).eq("class_id",classId).eq("active",true).maybeSingle();membership=data;}
      else {const {data}=await db.from("class_memberships").select("class_id").eq("user_id",user.id).eq("active",true).order("is_primary",{ascending:false}).limit(1).maybeSingle();membership=data;classId=S(data?.class_id,64);}
      if(!membership?.class_id||!classId)return J({error:"active_class_not_found"},409);
      const {data:existing}=await db.from("weekend_bonus_vouchers").select("*").eq("student_id",user.id).eq("weekend_id",window.weekendId).maybeSingle();
      if(existing)return J({ok:true,already_issued:true,voucher:await voucherPayload(db,existing)});
      let created:any=null,lastError:any=null;
      for(let attempt=0;attempt<5&&!created;attempt++){
        const code=randomCode();
        const {data,error}=await db.from("weekend_bonus_vouchers").insert({student_id:user.id,class_id:classId,weekend_id:window.weekendId,code,reward_points:REWARD_POINTS,reason:REASON,issued_at:new Date().toISOString(),eligible_until:new Date(window.cutoffMs).toISOString(),timezone:TZ,metadata:{source:"weekend-study-bonus-v1"}}).select("*").single();
        if(!error)created=data; else lastError=error;
      }
      if(!created){
        const {data:race}=await db.from("weekend_bonus_vouchers").select("*").eq("student_id",user.id).eq("weekend_id",window.weekendId).maybeSingle();
        if(race)created=race; else return J({error:"voucher_issue_failed",detail:S(lastError?.message,180)},500);
      }
      return J({ok:true,already_issued:false,voucher:await voucherPayload(db,created)});
    }

    if(action==="verify"||action==="redeem"){
      const staff=await staffAccess(db,user); if(!staff.ok)return J({error:"staff_only"},403);
      const code=normalizeCode(body.code); if(!code)return J({error:"invalid_code_format"},400);
      const {data:row}=await db.from("weekend_bonus_vouchers").select("*").eq("code",code).maybeSingle(); if(!row)return J({error:"voucher_not_found"},404);
      if(!staff.global&&!staff.classes.has(String(row.class_id)))return J({error:"voucher_out_of_scope"},403);
      if(action==="redeem"){
        if(row.revoked_at)return J({error:"voucher_revoked",voucher:await voucherPayload(db,row)},409);
        if(row.redeemed_at)return J({ok:true,already_redeemed:true,voucher:await voucherPayload(db,row)});
        const now=new Date().toISOString(),note=S(body.note,500)||null;
        const {data:updated,error}=await db.from("weekend_bonus_vouchers").update({redeemed_at:now,redeemed_by:user.id,redemption_note:note,updated_at:now}).eq("id",row.id).is("redeemed_at",null).is("revoked_at",null).select("*").maybeSingle();
        if(error)return J({error:"redeem_failed",detail:S(error.message,180)},500);
        if(!updated){const {data:latest}=await db.from("weekend_bonus_vouchers").select("*").eq("id",row.id).maybeSingle();return J({ok:true,already_redeemed:true,voucher:await voucherPayload(db,latest||row)});}
        return J({ok:true,already_redeemed:false,voucher:await voucherPayload(db,updated)});
      }
      return J({ok:true,voucher:await voucherPayload(db,row)});
    }
    return J({error:"unknown_action"},400);
  }catch(error){return J({error:"internal_error",detail:S((error as Error)?.message||error,240)},500);}
});

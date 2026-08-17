import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";

const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"content-type":"application/json","cache-control":"no-store"}});
const S=(v:unknown,n=500)=>String(v??"").trim().slice(0,n);
const now=()=>new Date().toISOString();
const allowedClientEvents=new Set([
  'session.check','auth.login_success','auth.session_restored','client.suspicious_ui','client.devtools_heuristic',
  'client.rapid_requests','client.forbidden_navigation','client.integrity_warning'
]);

function clientIp(req:Request){
  const cf=S(req.headers.get('cf-connecting-ip'),128);
  if(cf)return cf;
  const real=S(req.headers.get('x-real-ip'),128);
  if(real)return real;
  const xff=S(req.headers.get('x-forwarded-for'),512);
  if(!xff)return null;
  const parts=xff.split(',').map(x=>x.trim()).filter(Boolean);
  return parts.length?S(parts[parts.length-1],128):null;
}
function requestId(req:Request){return S(req.headers.get('cf-ray')||req.headers.get('x-request-id')||crypto.randomUUID(),160)}
function severityRank(v:string){return ({info:0,warning:1,high:2,critical:3} as Record<string,number>)[v]??0}
function maxSeverity(a:string,b:string){return severityRank(a)>=severityRank(b)?a:b}
function safePayload(v:unknown){
  if(!v||typeof v!=='object'||Array.isArray(v))return {};
  const raw=JSON.stringify(v); if(raw.length>8000)return {truncated:true};
  const out:any={}; for(const [k,val] of Object.entries(v as Record<string,unknown>).slice(0,30)){
    const key=S(k,80); if(!key)continue;
    if(typeof val==='string')out[key]=S(val,1000);
    else if(typeof val==='number'||typeof val==='boolean'||val===null)out[key]=val;
    else if(Array.isArray(val))out[key]=val.slice(0,20).map(x=>typeof x==='string'?S(x,300):x);
    else out[key]=JSON.parse(JSON.stringify(val));
  } return out;
}
async function geoFor(db:any,ip:string|null){
  if(!ip)return {lookup_ok:false,country_code:null,region:null,region_code:null,city:null,asn:null,organization:null};
  const {data:cached}=await db.from('security_ip_cache').select('*').eq('ip_address',ip).gt('expires_at',now()).maybeSingle();
  if(cached)return cached;
  let g:any={lookup_ok:false,country_code:null,region:null,region_code:null,city:null,asn:null,organization:null,raw:{}};
  try{
    const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),2200);
    const r=await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`,{signal:ctl.signal,headers:{'user-agent':'AGV-Security-Telemetry/1.0'}}); clearTimeout(timer);
    const x=await r.json().catch(()=>({}));
    if(r.ok&&!x?.error){
      g={lookup_ok:true,country_code:S(x.country_code||x.country,8)||null,region:S(x.region,120)||null,region_code:S(x.region_code,16)||null,city:S(x.city,120)||null,asn:S(x.asn,80)||null,organization:S(x.org,240)||null,raw:{}};
    }
  }catch(_){ }
  const ttl=g.lookup_ok?7*24*3600*1000:30*60*1000;
  const row={ip_address:ip,...g,looked_up_at:now(),expires_at:new Date(Date.now()+ttl).toISOString()};
  try{await db.from('security_ip_cache').upsert(row,{onConflict:'ip_address'});}catch(_){ }
  return row;
}
function geoRisk(g:any){
  if(!g?.lookup_ok)return {severity:'info',risk_code:null,outside_parana:false,geo_status:'unknown'};
  const cc=String(g.country_code||'').toUpperCase(),rc=String(g.region_code||'').toUpperCase();
  if(cc==='BR'&&rc==='PR')return {severity:'info',risk_code:null,outside_parana:false,geo_status:'parana'};
  if(cc&&((cc!=='BR')||(rc&&rc!=='PR')))return {severity:'critical',risk_code:'outside_parana',outside_parana:true,geo_status:'outside_parana'};
  return {severity:'warning',risk_code:'geo_inconclusive',outside_parana:false,geo_status:'inconclusive'};
}
async function rate(db:any,key:string,limit=30,window=60,block=60){
  const {data,error}=await db.rpc('security_consume_rate_limit',{p_key:key,p_limit:limit,p_window_seconds:window,p_block_seconds:block});
  if(error)return {allowed:true,count:0,retry_after:0}; return data||{allowed:true,count:0,retry_after:0};
}
async function adminStatus(db:any,user:any){
  const [{data:p},{data:w}]=await Promise.all([
    db.from('profiles').select('role,active,must_change_password').eq('id',user.id).maybeSingle(),
    db.from('staff_allowlist').select('role,active').eq('email',String(user.email||'').toLowerCase()).eq('active',true).maybeSingle()
  ]);
  const role=String(w?.role||p?.role||''); return {ok:!!p?.active&&!p?.must_change_password&&['admin','super_admin'].includes(role),role,password_change_required:!!p?.must_change_password};
}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:H});
  if(req.method!=='POST')return J({error:'method_not_allowed'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!,auth=req.headers.get('Authorization')||'';
    const userClient=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:ue}=await userClient.auth.getUser(); if(ue||!user)return J({error:'unauthorized'},401);
    const db=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    const live=await requireLiveAuthSession(db,auth,user.id);if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);
    try{await db.rpc('security_prune_telemetry_service')}catch(_){ }
    const body=await req.json().catch(()=>({})),action=S(body?.action,80)||'session.check',ip=clientIp(req),rid=requestId(req),ua=S(req.headers.get('user-agent'),500);
    const limiter=await rate(db,`telemetry:${user.id}:${ip||'noip'}`,40,60,120);
    if(limiter?.allowed===false)return J({error:'rate_limited',retry_after:limiter.retry_after||60},429);

    if(action==='admin_feed'||action==='admin_stats'||action==='admin_ack'){
      const staff=await adminStatus(db,user); if(staff.password_change_required)return J({error:'password_change_required'},403);if(!staff.ok)return J({error:'admin_only'},403);
      if(action==='admin_ack'){const id=S(body?.event_id,80);if(!id)return J({error:'event_required'},400);const {error}=await db.from('agv_core_security_events').update({acknowledged_by:user.id,acknowledged_at:now()}).eq('id',id);if(error)throw error;return J({ok:true});}
      const hours=Math.min(720,Math.max(1,Number(body?.hours)||72)); const since=new Date(Date.now()-hours*3600_000).toISOString();
      if(action==='admin_feed'){
        const {data,error}=await db.from('agv_core_security_events').select('id,user_id,category,severity,payload,created_at,ip_address,country_code,region,region_code,city,asn,organization,request_id,user_agent,risk_code,acknowledged_by,acknowledged_at').gte('created_at',since).order('created_at',{ascending:false}).limit(500); if(error)throw error;
        const ids=[...new Set((data||[]).map((x:any)=>x.user_id).filter(Boolean))];let actors:any[]=[];if(ids.length){const {data:p}=await db.from('profiles').select('id,full_name,email,role').in('id',ids);actors=p||[];}const map=new Map(actors.map((x:any)=>[String(x.id),x]));
        return J({ok:true,events:(data||[]).map((x:any)=>({...x,actor:map.get(String(x.user_id))||null})),hours});
      }
      const {data}=await db.from('agv_core_security_events').select('severity,risk_code,created_at,acknowledged_at').gte('created_at',since);
      const rows=data||[]; return J({ok:true,hours,total:rows.length,open:rows.filter((x:any)=>!x.acknowledged_at).length,critical:rows.filter((x:any)=>x.severity==='critical').length,outside_parana:rows.filter((x:any)=>x.risk_code==='outside_parana').length,high:rows.filter((x:any)=>x.severity==='high').length});
    }

    if(!allowedClientEvents.has(action))return J({error:'event_not_allowed'},400);
    const {data:p}=await db.from('profiles').select('role,active,must_change_password').eq('id',user.id).maybeSingle();
    if(!p?.active)return J({error:'profile_inactive'},403);
    const g=await geoFor(db,ip),risk=geoRisk(g),requested=['info','warning','high','critical'].includes(String(body?.severity))?String(body.severity):'info',severity=maxSeverity(requested,risk.severity);
    const payload={event_code:action,client:safePayload(body?.payload),geo_status:risk.geo_status,outside_parana:risk.outside_parana,profile_role:p.role};
    const {error}=await db.from('agv_core_security_events').insert({user_id:user.id,category:'access_security',severity,payload,ip_address:ip,country_code:g.country_code||null,region:g.region||null,region_code:g.region_code||null,city:g.city||null,asn:g.asn||null,organization:g.organization||null,request_id:rid,user_agent:ua||null,risk_code:risk.risk_code}); if(error)throw error;
    return J({ok:true,severity,risk_code:risk.risk_code,outside_parana:risk.outside_parana,geo_status:risk.geo_status});
  }catch(e){console.error(e);return J({error:'internal_error'},500)}
});

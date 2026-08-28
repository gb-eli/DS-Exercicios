import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200,extra:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{...cors,...extra,"content-type":"application/json","cache-control":"no-store"}});
const S=(v:unknown,n=500)=>String(v??'').trim().slice(0,n);
function ipOf(req:Request){const cf=S(req.headers.get('cf-connecting-ip'),128);if(cf)return cf;const real=S(req.headers.get('x-real-ip'),128);if(real)return real;const xs=S(req.headers.get('x-forwarded-for'),512).split(',').map(x=>x.trim()).filter(Boolean);return xs.length?S(xs[xs.length-1],128):null}
async function rate(db:any,key:string,limit:number,window:number,block:number){const{data,error}=await db.rpc('security_consume_rate_limit',{p_key:key,p_limit:limit,p_window_seconds:window,p_block_seconds:block});return error?{allowed:true,count:0,retry_after:0}:(data||{allowed:true,count:0,retry_after:0})}
async function signal(url:string,anon:string,auth:string,action:string,severity:string,payload:any){try{await fetch(`${url}/functions/v1/security-telemetry`,{method:'POST',headers:{'content-type':'application/json','apikey':anon,'Authorization':auth},body:JSON.stringify({action,severity,payload})});}catch(_){}}
async function accessTelemetry(db:any,url:string,anon:string,auth:string,userId:string,ip:string|null){if(!ip)return;const since=new Date(Date.now()-3600_000).toISOString();const{data}=await db.from('agv_core_security_events').select('id').eq('user_id',userId).eq('ip_address',ip).eq('category','access_security').gte('created_at',since).limit(1);if(!(data||[]).length)await signal(url,anon,auth,'session.check','info',{source:'agv-reward-claim'});}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'method_not_allowed'},405);
 try{
  const auth=req.headers.get('Authorization')||'',url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,ip=ipOf(req);
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});const{data:{user},error:userError}=await userClient.auth.getUser();if(userError||!user)return json({error:'unauthorized'},401);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});const live=await requireLiveAuthSession(admin,auth,user.id);if(!live.ok)return json({error:live.error,detail:live.detail||null},live.status);
  const lim=await rate(admin,`reward:${user.id}:${ip||'noip'}`,15,60,300);if(lim.allowed===false){await signal(url,anon,auth,'client.rapid_requests','high',{source:'agv-reward-claim',count:lim.count});return json({error:'rate_limited',retry_after:lim.retry_after||300},429,{'Retry-After':String(lim.retry_after||300)});}
  await accessTelemetry(admin,url,anon,auth,user.id,ip);
  const body=await req.json();if(Object.prototype.hasOwnProperty.call(body,'amount')){await signal(url,anon,auth,'client.integrity_warning','high',{source:'agv-reward-claim',reason:'client_amount_forbidden'});return json({error:'client_amount_forbidden',message:'O valor oficial da recompensa é calculado pelo Core.'},400);}
  const platformCode=String(body.platformId||'').trim(),activityId=body.activityId?String(body.activityId).trim():null,eventType=String(body.eventType||'').trim();if(!platformCode||!eventType)return json({error:'invalid_request'},400);
  const{data:platform}=await admin.from('platforms').select('id').eq('code',platformCode).eq('active',true).maybeSingle();if(!platform)return json({error:'platform_not_registered'},404);
  const q=admin.from('reward_rules').select('id,activity_id,trust_level,metadata,active').eq('platform_id',platform.id).eq('event_type',eventType).eq('active',true);const{data:rules,error:ruleError}=activityId?await q.or(`activity_id.eq.${activityId},activity_id.is.null`):await q.is('activity_id',null);if(ruleError)return json({error:'reward_rule_lookup_failed'},500);
  const rule=activityId?(rules||[]).find((r:any)=>r.activity_id===activityId)||(rules||[]).find((r:any)=>r.activity_id===null):((rules||[])[0]||null);if(!rule)return json({error:'reward_rule_not_found'},404);
  if(rule.metadata?.client_claimable!==true||['server_verified','teacher_approval','no_economic_reward'].includes(String(rule.trust_level))){await signal(url,anon,auth,'client.integrity_warning','high',{source:'agv-reward-claim',reason:'reward_not_client_claimable',platformCode,activityId,eventType});return json({error:'server_validation_required',message:'Esta recompensa só pode ser emitida por um verificador autorizado da plataforma.'},403);}
  const{data,error}=await admin.rpc('claim_core_reward_service',{p_user_id:user.id,p_platform_code:platformCode,p_activity_id:activityId,p_event_type:eventType,p_evidence_id:body.evidenceId?String(body.evidenceId):null,p_attempt_id:body.attemptId?String(body.attemptId):null,p_metadata:body.metadata&&typeof body.metadata==='object'?body.metadata:{},p_idempotency_key:String(body.idempotencyKey||'')});if(error)return json({error:'reward_rejected',message:error.message},400);return json(data||{ok:true});
 }catch(error){return json({error:'invalid_request',message:String((error as Error)?.message||error)},400)}
});

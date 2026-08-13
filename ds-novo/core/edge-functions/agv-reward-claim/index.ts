import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'method_not_allowed'},405);
 try{
  const auth=req.headers.get('Authorization')||'';const url=Deno.env.get('SUPABASE_URL')!;const anon=Deno.env.get('SUPABASE_ANON_KEY')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});const{data:{user},error:userError}=await userClient.auth.getUser();if(userError||!user)return json({error:'unauthorized'},401);
  const body=await req.json();if(Object.prototype.hasOwnProperty.call(body,'amount'))return json({error:'client_amount_forbidden',message:'O valor oficial da recompensa é calculado pelo Core.'},400);
  const platformCode=String(body.platformId||'').trim();const activityId=body.activityId?String(body.activityId).trim():null;const eventType=String(body.eventType||'').trim();if(!platformCode||!eventType)return json({error:'invalid_request'},400);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});const{data:platform}=await admin.from('platforms').select('id').eq('code',platformCode).eq('active',true).maybeSingle();if(!platform)return json({error:'platform_not_registered'},404);
  const q=admin.from('reward_rules').select('id,activity_id,trust_level,metadata,active').eq('platform_id',platform.id).eq('event_type',eventType).eq('active',true);const{data:rules,error:ruleError}=activityId?await q.or(`activity_id.eq.${activityId},activity_id.is.null`):await q.is('activity_id',null);if(ruleError)return json({error:'reward_rule_lookup_failed'},500);
  const rule=activityId?(rules||[]).find((r:any)=>r.activity_id===activityId)||(rules||[]).find((r:any)=>r.activity_id===null):((rules||[])[0]||null);if(!rule)return json({error:'reward_rule_not_found'},404);
  if(rule.metadata?.client_claimable!==true)return json({error:'server_validation_required',message:'Esta recompensa só pode ser emitida por um verificador autorizado da plataforma.'},403);
  if(['server_verified','teacher_approval','no_economic_reward'].includes(String(rule.trust_level)))return json({error:'reward_not_client_claimable'},403);
  const{data,error}=await admin.rpc('claim_core_reward_service',{p_user_id:user.id,p_platform_code:platformCode,p_activity_id:activityId,p_event_type:eventType,p_evidence_id:body.evidenceId?String(body.evidenceId):null,p_attempt_id:body.attemptId?String(body.attemptId):null,p_metadata:body.metadata&&typeof body.metadata==='object'?body.metadata:{},p_idempotency_key:String(body.idempotencyKey||'')});if(error)return json({error:'reward_rejected',message:error.message},400);return json(data||{ok:true});
 }catch(error){return json({error:'invalid_request',message:String((error as Error)?.message||error)},400)}
});

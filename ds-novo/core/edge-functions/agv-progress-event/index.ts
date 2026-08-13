import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
const COMPLETION_EVENTS=new Set(['activity.completed','challenge.completed','lesson.completed','block.completed','daily.completed']);

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'method_not_allowed'},405);
  try{
    const auth=req.headers.get('Authorization')||'';
    const url=Deno.env.get('SUPABASE_URL')!;
    const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
    const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:userError}=await userClient.auth.getUser();
    if(userError||!user)return json({error:'unauthorized'},401);
    const body=await req.json();
    const platformCode=String(body.platformId||'').trim();
    const activityId=body.activityId?String(body.activityId).trim():null;
    const eventType=String(body.eventType||'').trim();
    const progress=body.progress===null||body.progress===undefined?null:Number(body.progress);
    if(!platformCode||!eventType)return json({error:'invalid_request'},400);
    if(progress!==null&&(!Number.isFinite(progress)||progress<0||progress>100))return json({error:'invalid_progress'},400);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:platform}=await admin.from('platforms').select('id,code').eq('code',platformCode).eq('active',true).maybeSingle();
    if(!platform)return json({error:'platform_not_registered'},404);
    if(activityId){
      const {data:activity}=await admin.from('activity_catalog').select('activity_id,reward_policy,metadata,active').eq('platform_id',platform.id).eq('activity_id',activityId).maybeSingle();
      if(!activity?.active)return json({error:'activity_not_registered'},404);
      const isCompletion=COMPLETION_EVENTS.has(eventType)||(progress!==null&&progress>=100);
      if(isCompletion&&activity.metadata?.client_progress_allowed!==true)return json({error:'server_validation_required',message:'A conclusão desta atividade precisa ser validada pelo endpoint específico da plataforma.'},403);
    }
    const {data,error}=await admin.rpc('record_core_progress_event',{p_user_id:user.id,p_platform_code:platformCode,p_activity_id:activityId,p_event_type:eventType,p_progress:progress,p_score:body.score??null,p_payload:body.payload&&typeof body.payload==='object'?body.payload:{},p_idempotency_key:String(body.idempotencyKey||''),p_occurred_at:new Date().toISOString()});
    if(error)return json({error:'progress_rejected',message:error.message},400);
    return json(data||{ok:true});
  }catch(error){return json({error:'invalid_request',message:String((error as Error)?.message||error)},400)}
});

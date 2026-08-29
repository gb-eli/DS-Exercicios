import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
import {consumeRate,ensureAccess,logRisk,requestIp} from "./security.ts";

const PLATFORM_CODE="lab-virtual";
const COVERAGE_MILESTONES=[30,50,70,80,90,100] as const;
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
const safeId=(value:unknown)=>String(value||"").trim().slice(0,180);

async function claimGenericReward(admin:any,userId:string,eventType:string,idempotencyKey:string,metadata:Record<string,unknown>={}){
  const {data,error}=await admin.rpc("claim_core_reward_service",{
    p_user_id:userId,p_platform_code:PLATFORM_CODE,p_activity_id:null,p_event_type:eventType,
    p_evidence_id:`lab-core:${eventType}`,p_attempt_id:idempotencyKey,
    p_metadata:{source:"lab-virtual-core",...metadata},p_idempotency_key:idempotencyKey
  });
  return {data:data||null,error:error?.message||null};
}

async function catalogItem(admin:any,platformId:string,activityId:string){
  const {data,error}=await admin.from("activity_catalog").select("activity_id,reward_policy,max_xp,max_coins,metadata").eq("platform_id",platformId).eq("activity_id",activityId).eq("active",true).maybeSingle();
  return {data:data||null,error:error?.message||null};
}

async function centralState(admin:any,userId:string,platformId:string){
  const [{data:wallet},{data:metrics},{data:progress},{data:rules},{data:catalog}] = await Promise.all([
    admin.from("wallets").select("balance,lifetime_earned,lifetime_spent,status,updated_at").eq("user_id",userId).maybeSingle(),
    admin.from("metric_ledger").select("metric,delta,activity_id,reason,created_at").eq("user_id",userId),
    admin.from("activity_progress").select("activity_id,status,progress,completed_at,updated_at,metadata").eq("user_id",userId).eq("platform_id",platformId),
    admin.from("reward_rules").select("activity_id,event_type,active").eq("platform_id",platformId).eq("active",true),
    admin.from("activity_catalog").select("activity_id").eq("platform_id",platformId).eq("active",true)
  ]);
  let xp=0,points=0;
  for(const row of metrics||[]){if(row.metric==="xp")xp+=Number(row.delta||0);if(row.metric==="points")points+=Number(row.delta||0)}
  const allRules=rules||[],allCatalog=catalog||[],allProgress=progress||[];
  const completionRules=allRules.filter((r:any)=>r.event_type==="activity.completed"&&String(r.activity_id||"").startsWith("completion:"));
  const firstToolRules=allRules.filter((r:any)=>String(r.event_type||"").startsWith("tool.first_validated."));
  const coverageRules=allRules.filter((r:any)=>String(r.event_type||"").startsWith("coverage.milestone."));
  const tools=allCatalog.filter((r:any)=>String(r.activity_id||"").startsWith("tool:")).length;
  const completions=allCatalog.filter((r:any)=>String(r.activity_id||"").startsWith("completion:")).length;
  const explored=allProgress.filter((r:any)=>String(r.activity_id||"").startsWith("tool:")).length;
  return {
    wallet:wallet||{balance:0,lifetime_earned:0,lifetime_spent:0,status:"active"},metrics:{xp,points},progress:allProgress,
    coverage:{explored,total:tools,percent:Math.floor(explored/Math.max(1,tools)*100)},
    readiness:{tools,completions,rewardProvisionedCount:completionRules.length,firstToolBonusRules:firstToolRules.length,coverageRules:coverageRules.length}
  };
}

async function awardCoverage(admin:any,userId:string,platformId:string){
  const [{count:explored},{count:total}] = await Promise.all([
    admin.from("activity_progress").select("activity_id",{count:"exact",head:true}).eq("user_id",userId).eq("platform_id",platformId).like("activity_id","tool:%"),
    admin.from("activity_catalog").select("activity_id",{count:"exact",head:true}).eq("platform_id",platformId).eq("active",true).like("activity_id","tool:%")
  ]);
  const exploredCount=Number(explored||0),totalTools=Math.max(1,Number(total||0));
  const percent=Math.floor(exploredCount/totalTools*100),bonuses:any[]=[],errors:string[]=[];
  for(const mark of COVERAGE_MILESTONES){
    if(percent<mark)continue;
    const eventType=`coverage.milestone.${mark}`,idem=`lab:coverage:${userId}:${mark}`;
    const claimed=await claimGenericReward(admin,userId,eventType,idem,{kind:"coverage_milestone",percent:mark,exploredCount,totalTools});
    if(claimed.error)errors.push(`${mark}:${claimed.error}`);
    else if(claimed.data&&!claimed.data.duplicate)bonuses.push({kind:"coverage_milestone",percent:mark,reward:claimed.data});
  }
  return {exploredCount,totalTools,percent,bonuses,errors};
}

async function awardFirstTool(admin:any,userId:string,platformId:string,toolId:string){
  const item=await catalogItem(admin,platformId,`tool:${toolId}`);
  const level=String(item.data?.metadata?.level||"");
  if(!["basic","intermediate","advanced"].includes(level))return {bonus:null,error:"tool_level_not_registered"};
  const eventType=`tool.first_validated.${level}`,idem=`lab:first-tool:${userId}:${toolId}`;
  const claimed=await claimGenericReward(admin,userId,eventType,idem,{kind:"first_tool_bonus",toolId,level});
  if(claimed.error)return {bonus:null,error:claimed.error};
  return {bonus:claimed.data&&!claimed.data.duplicate?{kind:"first_tool_bonus",toolId,level,reward:claimed.data}:null,error:null};
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  if(Number(req.headers.get("content-length")||0)>131072)return json({error:"payload_too_large"},413);
  try{
    const auth=req.headers.get("Authorization")||"",url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:userError}=await userClient.auth.getUser();
    if(userError||!user)return json({error:"unauthorized"},401);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});const live=await requireLiveAuthSession(admin,auth,user.id);if(!live.ok)return json({error:live.error,detail:live.detail||null},live.status);await ensureAccess(admin,user,req,"lab-virtual-core");
    const {data:platform}=await admin.from("platforms").select("id").eq("code",PLATFORM_CODE).eq("active",true).maybeSingle();
    if(!platform)return json({error:"platform_not_registered"},500);
    const body=await req.json(),action=String(body.action||"");const limits:Record<string,[number,number,number]>={state:[60,60,60],tool_open:[60,60,120],complete:[15,60,300]},[lim,win,blk]=limits[action]||[60,60,120],rl=await consumeRate(admin,`lab-virtual:${action||"unknown"}:${user.id}:${requestIp(req)||"noip"}`,lim,win,blk);if(rl.allowed===false){await logRisk(admin,user,req,"rate_limit","high",{source:"lab-virtual-core",action,count:rl.count});return new Response(JSON.stringify({error:"rate_limited",retry_after:rl.retry_after||blk}),{status:429,headers:{...cors,"content-type":"application/json","Retry-After":String(rl.retry_after||blk)}})};
    if(action==="state")return json({ok:true,...await centralState(admin,user.id,platform.id)});

    if(action==="tool_open"){
      const toolId=safeId(body.toolId),activityId=`tool:${toolId}`,catalog=await catalogItem(admin,platform.id,activityId);
      if(!catalog.data)return json({error:"tool_not_registered"},404);
      const now=new Date().toISOString(),day=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
      const idem=`lab:tool:${user.id}:${toolId}:${day}`;
      const {data:old}=await admin.from("activity_progress").select("attempts,metadata,updated_at").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();
      const openedAt=old?.metadata?.openedAt||old?.updated_at||now;
      await admin.from("progress_events").upsert({user_id:user.id,platform_id:platform.id,activity_id:activityId,event_type:"tool.opened",progress:0,payload:{toolId,source:"lab-virtual-core"},idempotency_key:idem,occurred_at:now},{onConflict:"user_id,platform_id,idempotency_key",ignoreDuplicates:true});
      await admin.from("activity_progress").upsert({user_id:user.id,platform_id:platform.id,activity_id:activityId,status:"started",progress:0,attempts:Number(old?.attempts||0)+1,updated_at:now,metadata:{...(old?.metadata||{}),toolId,openedAt,lastOpenedAt:now,source:"lab-virtual-core"}},{onConflict:"user_id,platform_id,activity_id"});
      const coverage=await awardCoverage(admin,user.id,platform.id);
      return json({ok:true,toolId,activityId,coverage,...await centralState(admin,user.id,platform.id)});
    }

    if(action==="complete"){
      if(["xp","coins","credits"].some(k=>Object.prototype.hasOwnProperty.call(body,k))){await logRisk(admin,user,req,"client_reward_override","high",{source:"lab-virtual-core",fields:["xp","coins","credits"].filter(k=>Object.prototype.hasOwnProperty.call(body,k))});return json({error:"client_reward_forbidden"},400);} 
      const completionId=safeId(body.completionId),activityId=`completion:${completionId}`,entry=await catalogItem(admin,platform.id,activityId);
      if(!entry.data)return json({error:"completion_not_registered"},404);
      const toolId=String(entry.data.metadata?.toolId||""),category=String(entry.data.metadata?.category||""),minSeconds=Number(entry.data.metadata?.minSeconds||0);
      if(!toolId)return json({error:"completion_catalog_invalid"},500);
      const {data:existing}=await admin.from("activity_progress").select("status").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();
      if(existing?.status==="completed"){
        const first=await awardFirstTool(admin,user.id,platform.id,toolId);
        return json({ok:true,duplicate:true,completionId,bonuses:first.bonus?[first.bonus]:[],bonus_errors:first.error?[first.error]:[],...await centralState(admin,user.id,platform.id)});
      }
      const {data:tool}=await admin.from("activity_progress").select("metadata,updated_at").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",`tool:${toolId}`).maybeSingle();
      if(!tool)return json({error:"tool_not_opened",toolId},409);
      const openedAt=Date.parse(tool.metadata?.lastOpenedAt||tool.updated_at||""),elapsed=Number.isFinite(openedAt)?Math.floor((Date.now()-openedAt)/1000):-1,effectiveMin=Math.max(5,minSeconds);
      if(elapsed<effectiveMin||elapsed>1800){await logRisk(admin,user,req,"lab_completion_timing","warning",{source:"lab-virtual-core",completionId,toolId,elapsed,effectiveMin});return json({error:elapsed>1800?"tool_session_expired":"minimum_activity_time",required_seconds:effectiveMin,elapsed_seconds:Math.max(0,elapsed)},409);}const tenMin=new Date(Date.now()-600000).toISOString(),day=new Date(Date.now()-86400000).toISOString();const[{count:recent},{count:dailyCount}]=await Promise.all([admin.from("progress_events").select("id",{count:"exact",head:true}).eq("user_id",user.id).eq("platform_id",platform.id).eq("event_type","activity.completed").gte("occurred_at",tenMin),admin.from("progress_events").select("id",{count:"exact",head:true}).eq("user_id",user.id).eq("platform_id",platform.id).eq("event_type","activity.completed").gte("occurred_at",day)]);if(Number(recent||0)>=12||Number(dailyCount||0)>=40){await logRisk(admin,user,req,"bulk_reward_attempt","critical",{source:"lab-virtual-core",completionId,recent:Number(recent||0),daily:Number(dailyCount||0)});return json({error:"reward_activity_rate_limited",review_required:true},429);} 
      const idem=`lab:completion:${user.id}:${completionId}`,now=new Date().toISOString(),metadata={toolId,category,source:"lab-virtual-core",clientContext:body.context&&typeof body.context==="object"?body.context:{}};
      await admin.from("progress_events").upsert({user_id:user.id,platform_id:platform.id,activity_id:activityId,event_type:"activity.completed",progress:100,payload:metadata,idempotency_key:`${idem}:progress`,occurred_at:now},{onConflict:"user_id,platform_id,idempotency_key",ignoreDuplicates:true});
      await admin.from("activity_progress").upsert({user_id:user.id,platform_id:platform.id,activity_id:activityId,status:"completed",progress:100,attempts:1,completed_at:now,updated_at:now,metadata},{onConflict:"user_id,platform_id,activity_id"});
      const {data,error}=await admin.rpc("claim_core_reward_service",{p_user_id:user.id,p_platform_code:PLATFORM_CODE,p_activity_id:activityId,p_event_type:"activity.completed",p_evidence_id:`lab-rule:${completionId}`,p_attempt_id:safeId(body.attemptId)||idem,p_metadata:{source:"lab-virtual-core",validation:"catalog+tool-open+minimum-time"},p_idempotency_key:`${idem}:reward`});
      const bonuses:any[]=[],bonusErrors:string[]=[];
      const first=await awardFirstTool(admin,user.id,platform.id,toolId);
      if(first.bonus)bonuses.push(first.bonus);if(first.error)bonusErrors.push(first.error);
      return json({ok:true,duplicate:false,completionId,reward_provisioned:true,reward:data||null,reward_error:error?.message||null,bonuses,bonus_errors:bonusErrors,...await centralState(admin,user.id,platform.id)});
    }
    return json({error:"unknown_action"},400);
  }catch(error){return json({error:"internal_error",message:String((error as Error)?.message||error)},500)}
});

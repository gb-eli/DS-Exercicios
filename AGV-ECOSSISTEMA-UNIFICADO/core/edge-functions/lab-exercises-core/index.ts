import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"content-type":"application/json"}});
const PLATFORM_CLASS:Record<string,string>={"lab-ds1":"1DS-A-MANHA","lab-ds2":"2DS-A-MANHA","lab-ds3":"3DS-C-MANHA","lab-sub":"DS-SUB-NOITE"};
const safe=(x:unknown,n=220)=>String(x||"").trim().slice(0,n);

Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:H});
  try{
    const auth=req.headers.get("Authorization")||"";
    const url=Deno.env.get("SUPABASE_URL")!;
    const userClient=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:auth}}});
    const db=createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
    const {data:{user}}=await userClient.auth.getUser();
    if(!user)return J({error:"unauthorized"},401);
    const body=await req.json();
    const platformCode=safe(body.platform_code,60),requiredClass=PLATFORM_CLASS[platformCode];
    if(!requiredClass)return J({error:"platform_not_allowed"},404);
    const [{data:profile},{data:memberships}]=await Promise.all([
      db.from("profiles").select("role,active,must_change_password,full_name,email").eq("id",user.id).maybeSingle(),
      db.from("class_memberships").select("class_id").eq("user_id",user.id).eq("active",true)
    ]);
    if(!profile?.active||profile.role!=="student")return J({error:"student_only"},403);
    if(profile.must_change_password)return J({error:"password_change_required"},403);
    const classIds=(memberships||[]).map((x:any)=>x.class_id).filter(Boolean);
    const {data:classes}=classIds.length?await db.from("classes").select("id,code,name").in("id",classIds).eq("active",true):{data:[]};
    const cls=(classes||[]).find((x:any)=>x.code===requiredClass);
    if(!cls)return J({error:"platform_out_of_class_scope"},403);
    const {data:platform}=await db.from("platforms").select("id,code,name").eq("code",platformCode).eq("active",true).maybeSingle();
    if(!platform)return J({error:"platform_not_registered"},404);

    if(body.action==="state"){
      const [{data:catalog},{data:progress}]=await Promise.all([
        db.from("activity_catalog").select("activity_id,name,metadata").eq("platform_id",platform.id).eq("active",true).like("activity_id","exercise:%"),
        db.from("activity_progress").select("activity_id,status,progress,attempts,completed_at,updated_at,metadata").eq("user_id",user.id).eq("platform_id",platform.id).order("updated_at",{ascending:false})
      ]);
      return J({ok:true,profile,class:cls,platform,catalog:catalog||[],progress:progress||[]});
    }

    const activityId=safe(body.activity_id);
    if(!activityId)return J({error:"activity_required"},400);
    const {data:activity}=await db.from("activity_catalog").select("activity_id,metadata").eq("platform_id",platform.id).eq("activity_id",activityId).eq("active",true).maybeSingle();
    if(!activity)return J({error:"activity_not_registered"},404);
    const {data:old}=await db.from("activity_progress").select("status,progress,attempts,completed_at,metadata").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();
    const now=new Date().toISOString(),event=safe(body.event,20);
    let status=old?.status||"not_started",progress=Number(old?.progress||0),completedAt=old?.completed_at||null;
    const metadata={...(old?.metadata||{}),source:"lab-exercises-core",subject:activity.metadata?.subject||null,number:activity.metadata?.number||null};
    if(event==="start"){
      if(!["completed","reviewed"].includes(status))status="started";
      metadata.started_at=metadata.started_at||now; metadata.review_status=metadata.review_status||"not_submitted";
    }else if(event==="touch"){
      if(!["completed","reviewed"].includes(status))status="in_progress";
      progress=["completed","reviewed"].includes(status)?100:Math.max(0,Math.min(99,Number(body.progress||progress)));
      metadata.last_local_status=safe(body.local_status,80);
    }else if(event==="complete"){
      status=status==="reviewed"?"reviewed":"completed"; progress=100; completedAt=completedAt||now;
      metadata.review_status=status==="reviewed"?"approved":"pending"; metadata.submitted_at=metadata.submitted_at||now;
      metadata.local_validation={validated:!!body.validated,active_seconds:Math.max(0,Number(body.active_seconds||0)),evidence:safe(body.evidence,500)};
    }else return J({error:"event_not_allowed"},400);
    const row={user_id:user.id,platform_id:platform.id,activity_id:activityId,status,progress,attempts:Math.max(1,Number(old?.attempts||0)||1),completed_at:completedAt,updated_at:now,metadata};
    const {error}=await db.from("activity_progress").upsert(row,{onConflict:"user_id,platform_id,activity_id"});
    if(error)throw error;
    return J({ok:true,status,progress,review_status:metadata.review_status||null,economic_reward:false});
  }catch(error){return J({error:"internal_error",message:String((error as Error)?.message||error)},500)}
});

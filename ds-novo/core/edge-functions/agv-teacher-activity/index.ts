import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json"}});
const safe=(v:unknown,n=220)=>String(v||"").trim().slice(0,n);

async function requesterContext(admin:any,user:any){
  const {data:profile}=await admin.from("profiles").select("id,email,full_name,role,active").eq("id",user.id).maybeSingle();
  if(!profile?.active)return null;
  const role=String(profile.role||"");
  if(!["teacher","admin","super_admin"].includes(role))return null;
  return {id:user.id,email:String(profile.email||user.email||"").toLowerCase(),full_name:profile.full_name||"Professor",role};
}

async function teacherCanSeeStudent(admin:any,reqr:any,studentId:string){
  if(["admin","super_admin"].includes(reqr.role))return true;
  const {data:memberships}=await admin.from("class_memberships").select("class_id").eq("user_id",studentId).eq("active",true);
  const classIds=(memberships||[]).map((r:any)=>r.class_id).filter(Boolean);
  if(!classIds.length)return false;
  const {data}=await admin.from("teacher_classes").select("class_id").eq("active",true).in("class_id",classIds).or(`teacher_id.eq.${reqr.id},teacher_email.eq.${reqr.email}`);
  return Boolean(data?.length);
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  try{
    const auth=req.headers.get("Authorization")||"";
    const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:userError}=await userClient.auth.getUser();
    if(userError||!user)return json({error:"unauthorized"},401);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const reqr=await requesterContext(admin,user);
    if(!reqr)return json({error:"staff_only"},403);
    const body=await req.json();
    const action=safe(body.action,40);

    if(action==="recent"){
      const studentId=safe(body.student_id,80);
      if(!studentId)return json({error:"student_required"},400);
      if(!(await teacherCanSeeStudent(admin,reqr,studentId)))return json({error:"student_out_of_scope"},403);
      const {data:student}=await admin.from("profiles").select("id,full_name,email").eq("id",studentId).maybeSingle();
      const {data:progress}=await admin.from("activity_progress").select("platform_id,activity_id,status,progress,attempts,completed_at,updated_at,metadata").eq("user_id",studentId).order("updated_at",{ascending:false}).limit(100);
      const ids=[...new Set((progress||[]).map((r:any)=>r.platform_id).filter(Boolean))];
      const {data:platforms}=ids.length?await admin.from("platforms").select("id,code,name").in("id",ids):{data:[]};
      const pmap=new Map((platforms||[]).map((p:any)=>[p.id,p]));
      return json({ok:true,student,activities:(progress||[]).map((r:any)=>({...r,platform:pmap.get(r.platform_id)||null}))});
    }

    if(action==="get"){
      const studentId=safe(body.student_id,80),platformCode=safe(body.platform_code,80),activityId=safe(body.activity_id);
      if(!studentId||!platformCode||!activityId)return json({error:"missing_fields"},400);
      if(!(await teacherCanSeeStudent(admin,reqr,studentId)))return json({error:"student_out_of_scope"},403);
      const {data:platform}=await admin.from("platforms").select("id,code,name").eq("code",platformCode).eq("active",true).maybeSingle();
      if(!platform)return json({error:"platform_not_found"},404);
      const [{data:student},{data:progress},{data:reference}]=await Promise.all([
        admin.from("profiles").select("id,full_name,email").eq("id",studentId).maybeSingle(),
        admin.from("activity_progress").select("activity_id,status,progress,attempts,completed_at,updated_at,metadata").eq("user_id",studentId).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle(),
        admin.from("activity_teacher_content").select("activity_id,title,answer_text,explanation,solution_payload,rubric,intervention_tips,source_kind,source_ref,updated_at").eq("platform_id",platform.id).eq("activity_id",activityId).eq("active",true).maybeSingle()
      ]);
      return json({ok:true,student,platform,progress:progress||null,teacher_reference:reference||null,teacher:{id:reqr.id,name:reqr.full_name,role:reqr.role}});
    }

    return json({error:"unknown_action"},400);
  }catch(error){return json({error:"internal_error",message:String((error as Error)?.message||error)},500)}
});

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"content-type":"application/json"}});
const safe=(v:unknown,n=240)=>String(v||"").trim().slice(0,n);
async function requester(db:any,user:any){const{data:p}=await db.from("profiles").select("id,email,full_name,role,active,must_change_password").eq("id",user.id).maybeSingle();if(!p?.active||!["teacher","admin","super_admin"].includes(String(p.role)))return null;return{id:user.id,email:String(p.email||user.email||"").toLowerCase(),name:p.full_name||"Professor",role:String(p.role),must_change_password:!!p.must_change_password}}
async function canSee(db:any,r:any,studentId:string){if(["admin","super_admin"].includes(r.role))return true;const{data:m}=await db.from("class_memberships").select("class_id").eq("user_id",studentId).eq("active",true),ids=(m||[]).map((x:any)=>x.class_id).filter(Boolean);if(!ids.length)return false;const{data:t}=await db.from("teacher_classes").select("class_id").eq("active",true).in("class_id",ids).or(`teacher_id.eq.${r.id},teacher_email.eq.${r.email}`);return Boolean(t?.length)}
Deno.serve(async req=>{if(req.method==="OPTIONS")return new Response("ok",{headers:H});try{
  const auth=req.headers.get("Authorization")||"",url=Deno.env.get("SUPABASE_URL")!;
  const uc=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:auth}}});
  const db=createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const {data:{user}}=await uc.auth.getUser();if(!user)return J({error:"unauthorized"},401);const live=await requireLiveAuthSession(db,auth,user.id);if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);
  const r=await requester(db,user);if(!r)return J({error:"staff_only"},403);if(r.must_change_password)return J({error:"password_change_required"},403);
  const body=await req.json(),action=safe(body.action,40);
  if(action==="import_references"){
    if(!["admin","super_admin"].includes(r.role))return J({error:"admin_only"},403);
    const refs=Array.isArray(body.references)?body.references.slice(0,6):[];if(!refs.length)return J({error:"references_required"},400);
    const codes=[...new Set(refs.map((x:any)=>safe(x.platform_code,80)).filter(Boolean))];
    const {data:platforms}=await db.from("platforms").select("id,code").in("code",codes).eq("active",true),map=new Map((platforms||[]).map((x:any)=>[x.code,x.id]));
    const rows=[] as any[];
    for(const x of refs){const platformId=map.get(safe(x.platform_code,80)),activityId=safe(x.activity_id,220);if(!platformId||!activityId.startsWith("exercise:"))continue;rows.push({platform_id:platformId,activity_id:activityId,title:safe(x.title,500)||activityId,answer_text:safe(x.answer_text,12000)||null,explanation:safe(x.explanation,30000)||null,solution_payload:x.solution_payload&&typeof x.solution_payload==="object"?x.solution_payload:{},rubric:Array.isArray(x.rubric)?x.rubric:[],intervention_tips:Array.isArray(x.intervention_tips)?x.intervention_tips:[],source_kind:["manual","professor_bundle","guided_data","generated_reference"].includes(safe(x.source_kind,40))?safe(x.source_kind,40):"professor_bundle",source_ref:safe(x.source_ref,500)||null,active:true,updated_at:new Date().toISOString()})}
    if(!rows.length)return J({error:"no_valid_references"},400);const{error}=await db.from("activity_teacher_content").upsert(rows,{onConflict:"platform_id,activity_id"});if(error)throw error;
    await db.from("admin_audit_log").insert({actor_user_id:r.id,action:"teacher_reference_import",payload:{count:rows.length,platforms:codes}});return J({ok:true,imported:rows.length});
  }
  const studentId=safe(body.student_id,80);if(!studentId)return J({error:"student_required"},400);if(!(await canSee(db,r,studentId)))return J({error:"student_out_of_scope"},403);
  if(action==="recent"){
    const {data:student}=await db.from("profiles").select("id,full_name,email").eq("id",studentId).maybeSingle();
    const {data:progress}=await db.from("activity_progress").select("platform_id,activity_id,status,progress,attempts,completed_at,updated_at,metadata").eq("user_id",studentId).order("updated_at",{ascending:false}).limit(80);
    const ids=[...new Set((progress||[]).map((x:any)=>x.platform_id).filter(Boolean))],{data:platforms}=ids.length?await db.from("platforms").select("id,code,name").in("id",ids):{data:[]},pm=new Map((platforms||[]).map((x:any)=>[x.id,x]));
    return J({ok:true,student,activities:(progress||[]).map((x:any)=>({...x,platform:pm.get(x.platform_id)||null}))});
  }
  const platformCode=safe(body.platform_code,80),activityId=safe(body.activity_id,220);if(!platformCode||!activityId)return J({error:"missing_fields"},400);
  const {data:platform}=await db.from("platforms").select("id,code,name").eq("code",platformCode).eq("active",true).maybeSingle();if(!platform)return J({error:"platform_not_found"},404);
  if(action==="get"){
    const [{data:student},{data:progress},{data:reference}]=await Promise.all([db.from("profiles").select("id,full_name,email").eq("id",studentId).maybeSingle(),db.from("activity_progress").select("activity_id,status,progress,attempts,completed_at,updated_at,metadata").eq("user_id",studentId).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle(),db.from("activity_teacher_content").select("activity_id,title,answer_text,explanation,solution_payload,rubric,intervention_tips,source_kind,source_ref,updated_at").eq("platform_id",platform.id).eq("activity_id",activityId).eq("active",true).maybeSingle()]);
    return J({ok:true,student,platform,progress:progress||null,teacher_reference:reference||null,teacher:{id:r.id,name:r.name,role:r.role}});
  }
  if(action==="review"){
    const decision=safe(body.decision,30),feedback=safe(body.feedback,2000);if(!["approved","changes_requested"].includes(decision))return J({error:"invalid_decision"},400);
    const {data:p}=await db.from("activity_progress").select("status,progress,completed_at,metadata").eq("user_id",studentId).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle();if(!p)return J({error:"progress_not_found"},404);
    const now=new Date().toISOString(),meta={...(p.metadata||{}),review_status:decision,reviewed_by:r.id,reviewed_by_name:r.name,reviewed_at:now,teacher_feedback:feedback||null};
    const patch=decision==="approved"?{status:"reviewed",progress:100,completed_at:p.completed_at||now,updated_at:now,metadata:meta}:{status:"in_progress",progress:Math.min(95,Number(p.progress||95)),completed_at:null,updated_at:now,metadata:{...meta,analysis_validated:platformCode==="lab-ds1"&&activityId.startsWith("exercise:analise-metodo-sistemas:")?false:p.metadata?.analysis_validated}};
    const {data:out,error}=await db.from("activity_progress").update(patch).eq("user_id",studentId).eq("platform_id",platform.id).eq("activity_id",activityId).select("activity_id,status,progress,completed_at,updated_at,metadata").single();if(error)throw error;
    await db.from("admin_audit_log").insert({actor_user_id:r.id,action:`activity_review_${decision}`,target_user_id:studentId,platform_id:platform.id,payload:{activity_id:activityId,feedback:feedback||null}});return J({ok:true,progress:out});
  }
  return J({error:"unknown_action"},400);
}catch(error){return J({error:"internal_error",message:String((error as Error)?.message||error)},500)}});

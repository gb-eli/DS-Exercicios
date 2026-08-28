import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";

const H={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods":"POST,OPTIONS",
  "Cache-Control":"no-store"
};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"Content-Type":"application/json; charset=utf-8"}});
const now=()=>new Date().toISOString();
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uuid=(v:unknown)=>UUID.test(String(v||""))?String(v):"";
const clean=(v:unknown,n=160)=>String(v??"").trim().slice(0,n);

function jwtPayload(authHeader:string){
  try{
    const token=authHeader.replace(/^Bearer\s+/i,"").trim();
    const p=token.split("."); if(p.length<2)return {} as Record<string,unknown>;
    let raw=p[1].replace(/-/g,"+").replace(/_/g,"/"); while(raw.length%4)raw+="=";
    return JSON.parse(atob(raw));
  }catch{return {} as Record<string,unknown>}
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:H});
  if(req.method!=="POST")return J({error:"method_not_allowed"},405);
  try{
    const url=Deno.env.get("SUPABASE_URL")!;
    const anon=Deno.env.get("SUPABASE_ANON_KEY")!;
    const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ah=req.headers.get("Authorization")||"";
    const uc=createClient(url,anon,{global:{headers:{Authorization:ah}},auth:{persistSession:false}});
    const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:ue}=await uc.auth.getUser();
    if(ue||!user?.id||!user.email)return J({error:"unauthorized"},401);

    const payload=jwtPayload(ah);
    const sessionId=uuid(payload?.session_id);
    if(!sessionId)return J({error:"session_claim_missing"},401);
    const {data:live,error:le}=await db.rpc("security_is_auth_session_active_service",{p_user_id:user.id,p_session_id:sessionId});
    if(le)return J({error:"session_guard_unavailable"},503);
    if(live!==true)return J({error:"session_revoked"},401);

    const email=String(user.email).toLowerCase();
    const {data:profile}=await db.from("profiles").select("id,role,active,must_change_password").eq("id",user.id).maybeSingle();
    const {data:allow}=await db.from("staff_allowlist").select("role,active").eq("email",email).eq("active",true).maybeSingle();
    const role=String(allow?.role||profile?.role||"");
    if(!profile?.active||profile.must_change_password||!["admin","super_admin"].includes(role))return J({error:"admin_only"},403);

    const body=await req.json().catch(()=>({}));
    const action=clean(body.action||"overview",60);
    const aal=String(payload?.aal||"");
    const requireAal2=()=>aal==="aal2";

    const loadRoster=async()=>{
      const [pq,mq,cq,prq]=await Promise.all([
        db.from("profiles").select("id,full_name,email,active,must_change_password,last_login_at,cgm").eq("role","student").order("full_name"),
        db.from("class_memberships").select("user_id,class_id,is_primary,active").eq("active",true),
        db.from("classes").select("id,code,name,shift,active").eq("active",true).order("name"),
        db.from("student_preregistrations").select("claimed_user_id,cgm").not("claimed_user_id","is",null)
      ]);
      const classes=cq.data||[],cm=new Map(classes.map((c:any)=>[String(c.id),c]));
      const cgmByUser=new Map((prq.data||[]).filter((x:any)=>x.claimed_user_id&&x.cgm).map((x:any)=>[String(x.claimed_user_id),String(x.cgm)]));
      const memberships=mq.data||[],primary=new Map<string,any>();
      for(const m of memberships){const k=String(m.user_id);if(!primary.has(k)||m.is_primary)primary.set(k,m)}
      const users=(pq.data||[]).map((p:any)=>{const m=primary.get(String(p.id)),c=m?cm.get(String(m.class_id)):null;return {
        id:p.id,full_name:p.full_name||"Aluno",email:p.email||null,active:p.active!==false,must_change_password:!!p.must_change_password,last_login_at:p.last_login_at||null,
        class_id:c?.id||null,class_name:c?.name||null,shift:c?.shift||null,has_initial_credential:!!(p.cgm||cgmByUser.get(String(p.id)))
      }});
      return {classes,users};
    };

    if(action==="overview"||action==="list"){
      const roster=await loadRoster();
      return J({ok:true,aal,can_reset:aal==="aal2",...roster});
    }

    if(!requireAal2())return J({error:"aal2_required",detail:"Confirme o MFA do administrador antes de redefinir senhas."},403);

    const resolveTargets=async()=>{
      const mode=clean(body.mode||"student",20);
      let q=db.from("profiles").select("id,full_name,email,cgm,active").eq("role","student");
      if(mode==="student"){
        const studentId=uuid(body.student_id);if(!studentId)throw new Error("invalid_student");q=q.eq("id",studentId);
      }else if(mode==="class"){
        const classId=uuid(body.class_id);if(!classId)throw new Error("invalid_class");
        const {data:mem,error}=await db.from("class_memberships").select("user_id").eq("class_id",classId).eq("active",true);if(error)throw error;
        const ids=(mem||[]).map((x:any)=>String(x.user_id));if(!ids.length)return [] as any[];q=q.in("id",ids);
      }else if(mode==="shift"){
        const shift=clean(body.shift,20);if(!shift)throw new Error("invalid_shift");
        const {data:classes,error:ce}=await db.from("classes").select("id").eq("active",true).eq("shift",shift);if(ce)throw ce;
        const cids=(classes||[]).map((x:any)=>String(x.id));if(!cids.length)return [] as any[];
        const {data:mem,error:me}=await db.from("class_memberships").select("user_id").in("class_id",cids).eq("active",true);if(me)throw me;
        const ids=[...new Set((mem||[]).map((x:any)=>String(x.user_id)))];if(!ids.length)return [] as any[];q=q.in("id",ids);
      }else throw new Error("invalid_mode");
      const {data,error}=await q;if(error)throw error;return data||[];
    };

    const revoke=async(targetId:string)=>{
      await db.from("activity_sessions").update({ended_at:now(),updated_at:now()}).eq("student_id",targetId).is("ended_at",null);
      await db.rpc("admin_revoke_auth_sessions_service",{p_user_id:targetId}).catch(()=>null);
    };
    const audit=async(targetId:string|null,actionName:string,extra:Record<string,unknown>)=>{
      await db.from("admin_audit_log").insert({actor_user_id:user.id,action:actionName,target_user_id:targetId,payload:{...extra,source:"admin-access-management",aal:"aal2"}});
    };

    if(action==="reset_initial"){
      const targets=await resolveTargets();
      const {data:pre}=await db.from("student_preregistrations").select("claimed_user_id,cgm").not("claimed_user_id","is",null);
      const fallback=new Map((pre||[]).filter((x:any)=>x.claimed_user_id&&x.cgm).map((x:any)=>[String(x.claimed_user_id),String(x.cgm)]));
      let reset=0,skipped=0;const failures:any[]=[];
      for(const t of targets){
        const password=String(t.cgm||fallback.get(String(t.id))||"").trim();
        if(!/^\d{6,12}$/.test(password)){skipped++;failures.push({student_id:t.id,name:t.full_name||"Aluno",reason:"initial_credential_missing"});continue;}
        const {error}=await db.auth.admin.updateUserById(String(t.id),{password});
        if(error){failures.push({student_id:t.id,name:t.full_name||"Aluno",reason:"auth_update_failed"});continue;}
        await db.from("profiles").update({must_change_password:true,password_changed_at:null,updated_at:now()}).eq("id",t.id);
        await revoke(String(t.id));
        await audit(String(t.id),"password_reset_initial",{mode:clean(body.mode||"student",20),reason:clean(body.reason,500)||null});
        reset++;
      }
      await audit(null,"password_reset_initial_batch",{mode:clean(body.mode||"student",20),target_count:targets.length,reset,skipped,failed:failures.length,reason:clean(body.reason,500)||null});
      return J({ok:true,target_count:targets.length,reset,skipped,failed:failures.length,failures});
    }

    if(action==="reset_temporary"){
      if(clean(body.mode||"student",20)!=="student")return J({error:"temporary_password_single_user_only"},400);
      const studentId=uuid(body.student_id),password=String(body.temporary_password||"");
      if(!studentId)return J({error:"invalid_student"},400);
      if(password.length<10||password.length>72)return J({error:"temporary_password_length",detail:"Use entre 10 e 72 caracteres."},400);
      const {data:t}=await db.from("profiles").select("id,full_name,role").eq("id",studentId).eq("role","student").maybeSingle();if(!t)return J({error:"student_not_found"},404);
      const {error}=await db.auth.admin.updateUserById(studentId,{password});if(error)return J({error:"auth_update_failed"},500);
      await db.from("profiles").update({must_change_password:true,password_changed_at:null,updated_at:now()}).eq("id",studentId);
      await revoke(studentId);
      await audit(studentId,"password_reset_temporary",{reason:clean(body.reason,500)||null});
      return J({ok:true,student_id:studentId,must_change_password:true,sessions_revoked:true});
    }

    return J({error:"unknown_action"},400);
  }catch(e){
    console.error("admin-access-management",e);
    return J({error:"internal_error",detail:String((e as Error)?.message||e)},500);
  }
});

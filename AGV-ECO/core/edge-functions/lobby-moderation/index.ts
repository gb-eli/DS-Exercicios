import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"Content-Type":"application/json"}});
const S=(v:unknown,n=300)=>String(v??'').trim().slice(0,n);
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:H});
  try{
    const url=Deno.env.get('SUPABASE_URL')!, anon=Deno.env.get('SUPABASE_ANON_KEY')!, service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const auth=req.headers.get('Authorization')||'';
    const uc=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user},error:ue}=await uc.auth.getUser();
    if(ue||!user)return J({error:'unauthorized'},401);
    const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:p}=await db.from('profiles').select('id,email,role,active,must_change_password').eq('id',user.id).maybeSingle();
    if(!p?.active||p.must_change_password||!['teacher','admin','super_admin'].includes(String(p.role)))return J({error:'staff_only'},403);
    const body=await req.json().catch(()=>({})), action=S(body?.action,30);
    const isAdmin=['admin','super_admin'].includes(String(p.role));
    let assigned:string[]=[];
    if(!isAdmin){
      const {data:tc,error}=await db.from('teacher_classes').select('class_id').eq('teacher_id',user.id).eq('active',true);
      if(error)throw error;
      assigned=(tc||[]).map((x:any)=>String(x.class_id));
    }
    const membership=async(studentId:string)=>{
      const {data:m}=await db.from('class_memberships').select('class_id,is_primary').eq('user_id',studentId).eq('active',true).order('is_primary',{ascending:false}).limit(1).maybeSingle();
      return m?.class_id?String(m.class_id):null;
    };
    const ensureScope=async(studentId:string)=>{
      const {data:student}=await db.from('profiles').select('id,full_name,role,active').eq('id',studentId).eq('role','student').maybeSingle();
      if(!student?.active)throw Object.assign(new Error('student_not_found'),{status:404});
      const classId=await membership(studentId);
      if(!classId)throw Object.assign(new Error('student_without_class'),{status:409});
      if(!isAdmin&&!assigned.includes(classId))throw Object.assign(new Error('student_out_of_scope'),{status:403});
      return {student,classId};
    };
    if(action==='list_blocks'){
      const now=new Date().toISOString();
      const {data:blocks,error}=await db.from('lobby_blocks').select('student_id,blocked_until,reason,actor_id,updated_at').gt('blocked_until',now).order('blocked_until',{ascending:true});
      if(error)throw error;
      const rows=[] as any[];
      for(const b of blocks||[]){
        try{
          const {student,classId}=await ensureScope(String(b.student_id));
          const {data:cls}=await db.from('classes').select('name,code').eq('id',classId).maybeSingle();
          rows.push({...b,student_name:student.full_name,class_id:classId,class_name:cls?.name||cls?.code||'Turma'});
        }catch(e){if(String((e as Error)?.message)!=='student_out_of_scope')console.warn(e)}
      }
      return J({ok:true,scope:isAdmin?'global':'assigned',blocks:rows});
    }
    const studentId=S(body?.student_id,80);
    if(!studentId)return J({error:'student_required'},400);
    let scoped;
    try{scoped=await ensureScope(studentId)}catch(e){return J({error:String((e as Error).message)},Number((e as any)?.status)||403)}
    const {classId}=scoped;
    const audit=async(name:string,payload:Record<string,unknown>)=>{try{await db.from('admin_audit_log').insert({actor_user_id:user.id,action:name,target_user_id:studentId,payload});}catch(_){} };
    if(action==='kick'){
      const mins=Math.max(1,Math.min(120,Math.round(Number(body?.duration_minutes)||15)));
      const reason=S(body?.reason,300)||'Removido temporariamente do Lobby pela equipe.';
      const blockedUntil=new Date(Date.now()+mins*60000).toISOString();
      const {error}=await db.from('lobby_blocks').upsert({student_id:studentId,blocked_until:blockedUntil,reason,actor_id:user.id,updated_at:new Date().toISOString()},{onConflict:'student_id'});
      if(error)throw error;
      await db.from('lobby_presence').delete().eq('student_id',studentId);
      await audit('lobby_student_kicked',{duration_minutes:mins,blocked_until:blockedUntil,reason,class_id:classId});
      return J({ok:true,student_id:studentId,blocked_until:blockedUntil,duration_minutes:mins});
    }
    if(action==='unblock'){
      await db.from('lobby_blocks').delete().eq('student_id',studentId);
      await audit('lobby_student_unblocked',{class_id:classId});
      return J({ok:true,student_id:studentId});
    }
    return J({error:'unknown_action'},400);
  }catch(e){console.error(e);return J({error:'internal_error',detail:String((e as Error)?.message||e)},500)}
});

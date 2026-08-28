import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const schoolDomain='@escola.pr.gov.br';

Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 try{
  const authHeader=req.headers.get('Authorization')||'';
  const url=Deno.env.get('SUPABASE_URL')!;
  const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
  const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const userClient=createClient(url,anon,{global:{headers:{Authorization:authHeader}}});
  const {data:{user},error:userError}=await userClient.auth.getUser();
  if(userError||!user?.email) return json({error:'unauthorized'},401);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const live=await requireLiveAuthSession(admin,authHeader,user.id);if(!live.ok)return json({error:live.error,detail:live.detail||null},live.status);
  const [{data:profile},{data:allow}]=await Promise.all([
    admin.from('profiles').select('id,role,active,must_change_password').eq('id',user.id).maybeSingle(),
    admin.from('staff_allowlist').select('role,active').eq('email',user.email.toLowerCase()).eq('active',true).maybeSingle()
  ]);
  const effectiveRole=allow?.role||profile?.role;
  const isAdmin=(profile?.active!==false)&&['admin','super_admin'].includes(String(effectiveRole||''));
  if(profile?.must_change_password) return json({error:'password_change_required'},403);
  if(!isAdmin) return json({error:'forbidden'},403);

  const body=await req.json().catch(()=>({}));
  const action=String(body?.action||'');
  if(action==='update_preregistration'){
    const id=String(body?.id||'');
    if(!id) return json({error:'missing_id'},400);
    const {data:row,error:readError}=await admin.from('student_preregistrations').select('id,full_name,institutional_email,cgm,class_id,enrollment_status,active,claimed_user_id').eq('id',id).maybeSingle();
    if(readError) throw readError;
    if(!row) return json({error:'not_found'},404);

    const patch:Record<string,unknown>={updated_at:new Date().toISOString()};
    if(Object.prototype.hasOwnProperty.call(body,'institutional_email')){
      if(row.claimed_user_id) return json({error:'email_locked_after_claim'},409);
      const email=String(body.institutional_email||'').trim().toLowerCase();
      if(email && !email.endsWith(schoolDomain)) return json({error:'invalid_school_email'},400);
      patch.institutional_email=email||null;
    }
    if(Object.prototype.hasOwnProperty.call(body,'cgm')){
      if(row.claimed_user_id) return json({error:'cgm_locked_after_claim'},409);
      const cgm=String(body.cgm||'').trim();
      if(cgm && !/^\d{6,12}$/.test(cgm)) return json({error:'invalid_cgm'},400);
      patch.cgm=cgm||null;
    }
    if(Object.prototype.hasOwnProperty.call(body,'enrollment_status')){
      const status=String(body.enrollment_status||'').trim();
      if(!['Matriculado','Transferido'].includes(status)) return json({error:'invalid_status'},400);
      patch.enrollment_status=status;
      patch.active=status==='Matriculado';
    }
    if(Object.prototype.hasOwnProperty.call(body,'active')) patch.active=!!body.active;

    const {data:updated,error:updateError}=await admin.from('student_preregistrations').update(patch).eq('id',id).select('id,full_name,institutional_email,class_id,enrollment_status,active,claimed_user_id,cgm').single();
    if(updateError) throw updateError;

    if(updated.claimed_user_id && (Object.prototype.hasOwnProperty.call(body,'active')||Object.prototype.hasOwnProperty.call(body,'enrollment_status'))){
      const active=!!updated.active;
      await Promise.all([
        admin.from('profiles').update({active,updated_at:new Date().toISOString()}).eq('id',updated.claimed_user_id),
        admin.from('class_memberships').update({active}).eq('user_id',updated.claimed_user_id).eq('class_id',updated.class_id)
      ]);
    }
    return json({ok:true,record:{id:updated.id,full_name:updated.full_name,institutional_email:updated.institutional_email,class_id:updated.class_id,enrollment_status:updated.enrollment_status,active:updated.active,claimed_user_id:updated.claimed_user_id,has_cgm:!!updated.cgm}});
  }
  return json({error:'unknown_action'},400);
 }catch(error){return json({error:'internal_error',detail:String((error as Error)?.message||error)},500)}
});

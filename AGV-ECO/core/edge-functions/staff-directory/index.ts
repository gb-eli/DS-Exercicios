import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"Content-Type":"application/json"}});
const temporaryPassword=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',r=crypto.getRandomValues(new Uint8Array(18));let s='';for(const b of r)s+=a[b%a.length];return `${s.slice(0,6)}-${s.slice(6,12)}-${s.slice(12)}9a`;};
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:H});
 try{
  const auth=req.headers.get('Authorization')||'',url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const uc=createClient(url,anon,{global:{headers:{Authorization:auth}}}),db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:ue}=await uc.auth.getUser();if(ue||!user?.email)return J({error:'unauthorized'},401);
  const [{data:p},{data:a}]=await Promise.all([db.from('profiles').select('role,active').eq('id',user.id).maybeSingle(),db.from('staff_allowlist').select('role,active').eq('email',user.email.toLowerCase()).eq('active',true).maybeSingle()]);
  const role=String(a?.role||p?.role||'');if(!p?.active||!['admin','super_admin'].includes(role))return J({error:'forbidden'},403);
  const b=await req.json().catch(()=>({})),act=String(b?.action||'list');
  if(act==='list'){
   const [{data:staff,error:se},{data:classes,error:ce},{data:assignments,error:ae}]=await Promise.all([db.from('staff_allowlist').select('email,full_name,role,active,created_at,updated_at').order('full_name'),db.from('classes').select('id,code,name,shift,active').eq('active',true).order('name'),db.from('teacher_classes').select('id,teacher_id,teacher_email,class_id,active').eq('active',true)]);if(se)throw se;if(ce)throw ce;if(ae)throw ae;return J({staff:staff||[],classes:classes||[],assignments:assignments||[]});
  }
  if(act==='upsert'){
   const email=String(b?.email||'').trim().toLowerCase(),fullName=String(b?.full_name||'').trim().slice(0,180),targetRole=String(b?.role||'teacher');
   if(!email.endsWith('@escola.pr.gov.br'))return J({error:'invalid_school_email'},400);if(fullName.length<3)return J({error:'missing_name'},400);if(!['teacher','admin'].includes(targetRole))return J({error:'invalid_role'},400);
   const {data:staff,error}=await db.from('staff_allowlist').upsert({email,full_name:fullName,role:targetRole,active:true,updated_at:new Date().toISOString()},{onConflict:'email'}).select('email,full_name,role,active').single();if(error)throw error;
   let temp:null|string=null,created=false;const {data:existing}=await db.from('profiles').select('id').eq('email',email).maybeSingle();
   if(existing?.id){await db.from('profiles').update({full_name:fullName,role:targetRole,active:true,updated_at:new Date().toISOString()}).eq('id',existing.id);}
   else{temp=temporaryPassword();const {data:createdUser,error:createError}=await db.auth.admin.createUser({email,password:temp,email_confirm:true,app_metadata:{provisioned_by_admin:true}});if(createError){if(!String(createError.message||'').toLowerCase().includes('already'))throw createError;temp=null;}else created=!!createdUser.user;}
   return J({ok:true,staff,account_created:created,temporary_password:temp});
  }
  if(act==='set_active'){
   const email=String(b?.email||'').trim().toLowerCase(),active=!!b?.active;if(!email.endsWith('@escola.pr.gov.br'))return J({error:'invalid_school_email'},400);const {data:staff,error}=await db.from('staff_allowlist').update({active,updated_at:new Date().toISOString()}).eq('email',email).select('email,full_name,role,active').single();if(error)throw error;const {data:pr}=await db.from('profiles').select('id').eq('email',email).maybeSingle();if(pr?.id)await db.from('profiles').update({active,updated_at:new Date().toISOString()}).eq('id',pr.id);return J({ok:true,staff});
  }
  if(act==='set_classes'){
   const email=String(b?.email||'').trim().toLowerCase(),ids=Array.isArray(b?.class_ids)?[...new Set(b.class_ids.map((x:unknown)=>String(x)))]:[];if(!email.endsWith('@escola.pr.gov.br'))return J({error:'invalid_school_email'},400);const {data:s}=await db.from('staff_allowlist').select('role,active').eq('email',email).maybeSingle();if(!s?.active)return J({error:'staff_not_found'},404);if(s.role!=='teacher')return J({error:'assignments_only_for_teacher'},400);if(ids.length){const {data:v}=await db.from('classes').select('id').in('id',ids).eq('active',true);if((v||[]).length!==ids.length)return J({error:'invalid_class'},400);}const {data:pr}=await db.from('profiles').select('id').eq('email',email).maybeSingle();await db.from('teacher_classes').delete().eq('teacher_email',email);if(ids.length){const {error}=await db.from('teacher_classes').insert(ids.map((classId:string)=>({teacher_id:pr?.id||null,teacher_email:email,class_id:classId,active:true,created_by:user.id})));if(error)throw error;}return J({ok:true,email,class_ids:ids});
  }
  return J({error:'unknown_action'},400);
 }catch(e){console.error(e);return J({error:'internal_error',detail:String((e as Error)?.message||e)},500)}
});

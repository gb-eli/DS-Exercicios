import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"content-type":"application/json"}});
const sameSet=(a:any,b:any)=>{const A=[...(Array.isArray(a)?a:[])].map(String).sort(),B=[...(Array.isArray(b)?b:[])].map(String).sort();return A.length===B.length&&A.every((x,i)=>x===B[i])};
Deno.serve(async req=>{if(req.method==="OPTIONS")return new Response("ok",{headers:H});try{
  const auth=req.headers.get("Authorization")||"",url=Deno.env.get("SUPABASE_URL")!;
  const uc=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:auth}}});
  const db=createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const {data:{user}}=await uc.auth.getUser(); if(!user)return J({error:"unauthorized"},401);
  const [{data:p},{data:m}]=await Promise.all([db.from("profiles").select("role,active,must_change_password").eq("id",user.id).maybeSingle(),db.from("class_memberships").select("class_id").eq("user_id",user.id).eq("active",true)]);
  if(!p?.active||p.role!=="student"||p.must_change_password)return J({error:"forbidden"},403);
  const ids=(m||[]).map((x:any)=>x.class_id),{data:classes}=ids.length?await db.from("classes").select("code").in("id",ids).eq("active",true):{data:[]};
  if(!(classes||[]).some((x:any)=>x.code==="1DS-A-MANHA"))return J({error:"class_scope"},403);
  const body=await req.json(),activityId=String(body.activity_id||"").slice(0,180);
  if(!/^exercise:analise-metodo-sistemas:0[1-3]$/.test(activityId))return J({error:"activity_not_allowed"},404);
  const {data:platform}=await db.from("platforms").select("id").eq("code","lab-ds1").eq("active",true).maybeSingle(); if(!platform)return J({error:"platform_missing"},500);
  const [{data:t},{data:progress}]=await Promise.all([db.from("activity_teacher_content").select("solution_payload").eq("platform_id",platform.id).eq("activity_id",activityId).eq("active",true).maybeSingle(),db.from("activity_progress").select("metadata,attempts").eq("user_id",user.id).eq("platform_id",platform.id).eq("activity_id",activityId).maybeSingle()]);
  if(!t?.solution_payload)return J({error:"validation_key_missing"},503);
  const last=Date.parse(progress?.metadata?.last_validation_at||"");if(Number.isFinite(last)&&Date.now()-last<1800)return J({error:"rate_limited"},429);
  const answer=body.answer&&typeof body.answer==="object"?body.answer:{},solution:any=t.solution_payload,issues:any[]=[];
  if(activityId.endsWith(":01")){if(!sameSet(answer.selectedActors,solution.actors))issues.push({text:"Revise a seleção de atores externos ao sistema."});let bad=0;for(const actor of solution.actors||[])if((answer.selectedActors||[]).includes(actor)&&!sameSet(answer.relations?.[actor],solution.relations?.[actor]))bad++;if(bad)issues.push({text:`Revise os objetivos relacionados aos atores selecionados (${bad} grupo(s)).`});}
  else if(activityId.endsWith(":02")){const entries=Object.entries(solution.classifications||{}),missing=entries.filter(([k])=>!answer.classifications?.[k]).length,wrong=entries.filter(([k,v])=>answer.classifications?.[k]&&answer.classifications[k]!==v).length;if(missing)issues.push({text:`Ainda faltam ${missing} classificação(ões).`});if(wrong)issues.push({text:`Há ${wrong} classificação(ões) para revisar.`});if(!sameSet(answer.selectedQuestions,solution.questions))issues.push({text:"Revise a seleção das perguntas essenciais."});}
  else {const c=Object.entries(solution.classifications||{}),r=Object.entries(solution.reasons||{}),mc=c.filter(([k])=>!answer.classifications?.[k]).length,wc=c.filter(([k,v])=>answer.classifications?.[k]&&answer.classifications[k]!==v).length,mr=r.filter(([k])=>!answer.reasons?.[k]).length,wr=r.filter(([k,v])=>answer.reasons?.[k]&&answer.reasons[k]!==v).length;if(mc)issues.push({text:`Ainda faltam ${mc} classificação(ões).`});if(wc)issues.push({text:`Há ${wc} tipo(s) para revisar.`});if(mr)issues.push({text:`Ainda faltam ${mr} justificativa(s).`});if(wr)issues.push({text:`Há ${wr} justificativa(s) para revisar.`});}
  const valid=!issues.length,now=new Date().toISOString(),metadata={...(progress?.metadata||{}),analysis_validated:valid,last_validation_at:now,review_status:progress?.metadata?.review_status||"not_submitted"};
  const {error}=await db.from("activity_progress").upsert({user_id:user.id,platform_id:platform.id,activity_id:activityId,status:"in_progress",progress:valid?95:25,attempts:Math.max(1,Number(progress?.attempts||0)+1),updated_at:now,metadata},{onConflict:"user_id,platform_id,activity_id"});if(error)throw error;
  return J({ok:true,valid,issues,attempts:Math.max(1,Number(progress?.attempts||0)+1)});
}catch(error){return J({error:"internal_error",message:String((error as Error)?.message||error)},500)}});

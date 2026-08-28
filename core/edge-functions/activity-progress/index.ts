import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
import { consumeRate, ensureAccess, logRisk, requestIp } from "./security.ts";

const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...H,"Content-Type":"application/json"}});
const now=()=>new Date().toISOString();
const SERVER_VALIDATED_KEYS=new Set(["programacao-desenvolvimento-sistemas:4"]);

type PrivateCriterion={id?:string;label:string;weight:number;file:string;all?:string[];any?:string[];none?:string[];min_matches?:Array<{pattern:string;min:number}>};
type PrivateSpec={minimum_score?:number;required_files?:string[];minimum_chars?:Record<string,number>;criteria:PrivateCriterion[]};
type RuleMap=Record<string,PrivateSpec>;

function parsePrivateRules():RuleMap|null{
  const raw=Deno.env.get("AGV_PRIVATE_EXERCISE_RULES_V1");
  if(!raw)return null;
  try{const parsed=JSON.parse(raw);return parsed&&typeof parsed==='object'?parsed as RuleMap:null}catch{return null}
}
function safeRx(pattern:string,global=false){try{return new RegExp(pattern,global?'gims':'ims')}catch{return null}}
function stripComments(filename:string,source:string){
  let value=String(source||'');
  if(/\.html?$/i.test(filename))value=value.replace(/<!--[\s\S]*?-->/g,' ');
  if(/\.(?:css|js|mjs)$/i.test(filename))value=value.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/^\s*\/\/.*$/gm,' ');
  return value;
}
function matches(content:string,pattern:string){const r=safeRx(pattern);return Boolean(r&&r.test(content))}
function countMatches(content:string,pattern:string){const r=safeRx(pattern,true);if(!r)return 0;return [...content.matchAll(r)].length}
function meaningful(filename:string,content:string,min=1){
  const value=stripComments(filename,content).trim();
  if(!value)return false;
  return value.length>=Math.max(1,min);
}
function evaluateSpec(spec:PrivateSpec,files:Array<{filename:string;content:string;revision?:number;saved_at?:string}>){
  const map=Object.fromEntries(files.map(f=>[String(f.filename),stripComments(String(f.filename),String(f.content||''))]));
  const required=(spec.required_files||[]).map(String);
  const missing=required.filter(name=>!meaningful(name,map[name]||'',Number(spec.minimum_chars?.[name]||1)));
  const criteria=(spec.criteria||[]).map((criterion,index)=>{
    const content=criterion.file==='*'?Object.values(map).join('\n'):String(map[criterion.file]||'');
    let ok=true;
    if(Array.isArray(criterion.all)&&criterion.all.length)ok=ok&&criterion.all.every(p=>matches(content,p));
    if(Array.isArray(criterion.any)&&criterion.any.length)ok=ok&&criterion.any.some(p=>matches(content,p));
    if(Array.isArray(criterion.none)&&criterion.none.length)ok=ok&&criterion.none.every(p=>!matches(content,p));
    if(Array.isArray(criterion.min_matches)&&criterion.min_matches.length)ok=ok&&criterion.min_matches.every(r=>countMatches(content,r.pattern)>=Number(r.min||1));
    const weight=Math.max(0,Number(criterion.weight||0));
    return {id:String(criterion.id||`criterion-${index+1}`),label:String(criterion.label||'Critério'),ok,points:ok?weight:0,max_points:weight};
  });
  const total=criteria.reduce((n,x)=>n+x.max_points,0)||1,earned=criteria.reduce((n,x)=>n+x.points,0);
  const score=missing.length?Math.min(79,Math.round(earned/total*100)):Math.max(0,Math.min(100,Math.round(earned/total*100)));
  return {score,criteria,missing_files:missing,minimum_score:Math.max(0,Math.min(100,Number(spec.minimum_score||80)))};
}
function normalizeGithubRepository(input:unknown){
  try{
    const u=new URL(String(input||'').trim());
    if(u.protocol!=='https:'||u.hostname.toLowerCase()!=='github.com')return null;
    const parts=u.pathname.split('/').filter(Boolean);if(parts.length<2)return null;
    const owner=parts[0],repo=parts[1].replace(/\.git$/i,'');
    if(!/^[A-Za-z0-9_.-]+$/.test(owner)||!/^[A-Za-z0-9_.-]+$/.test(repo))return null;
    return `https://github.com/${owner}/${repo}`;
  }catch{return null}
}
async function sha256(value:string){const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:H});
  if(Number(req.headers.get('content-length')||0)>65536)return J({error:'payload_too_large'},413);
  try{
    const url=Deno.env.get('SUPABASE_URL')!,auth=req.headers.get('Authorization')||'';
    const c=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:auth}}});
    const db=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user}}=await c.auth.getUser();if(!user)return J({error:'unauthorized'},401);
    const live=await requireLiveAuthSession(db,auth,user.id);if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);
    const {data:p}=await db.from('profiles').select('active,must_change_password,role').eq('id',user.id).maybeSingle();
    if(!p?.active||p.must_change_password||p.role!=='student')return J({error:'student_not_ready'},403);
    await ensureAccess(db,user,req,'activity-progress');
    const b=await req.json().catch(()=>({})),action=String(b?.action||''),eid=String(b?.exercise_id||'');
    const rl=await consumeRate(db,`activity-progress:${user.id}:${requestIp(req)||'noip'}`,90,60,120);
    if(rl.allowed===false){await logRisk(db,user,req,'rate_limit','high',{source:'activity-progress',action,count:rl.count});return new Response(JSON.stringify({error:'rate_limited',retry_after:rl.retry_after||120}),{status:429,headers:{...H,'Content-Type':'application/json','Retry-After':String(rl.retry_after||120)}})}
    if(!eid)return J({error:'missing_exercise'},400);

    const {data:m}=await db.from('class_memberships').select('class_id').eq('user_id',user.id).eq('active',true).order('is_primary',{ascending:false}).limit(1).maybeSingle();if(!m)return J({error:'no_class'},403);
    const {data:e}=await db.from('exercises').select('id,class_id,subject_id,exercise_number,default_locked,active,visible').eq('id',eid).eq('active',true).eq('visible',true).maybeSingle();if(!e)return J({error:'exercise_forbidden'},403);
    let belongs=false;if(e.class_id)belongs=e.class_id===m.class_id;else{const {data:cs}=await db.from('class_subjects').select('class_id').eq('class_id',m.class_id).eq('subject_id',e.subject_id).eq('active',true).maybeSingle();belongs=!!cs}if(!belongs)return J({error:'exercise_forbidden'},403);
    const {data:subject}=await db.from('subjects').select('slug').eq('id',e.subject_id).maybeSingle();
    const exerciseKey=`${String(subject?.slug||'')}:${Number(e.exercise_number||0)}`;
    const serverValidated=SERVER_VALIDATED_KEYS.has(exerciseKey);
    const {data:progress}=await db.from('student_exercises').select('status,security_locked,security_lock_reason,progress_percent,attempts,completed_at,completion_source,metadata').eq('student_id',user.id).eq('exercise_id',eid).maybeSingle();
    if(progress?.security_locked||progress?.status==='blocked')return J({error:'activity_locked',reason:progress?.security_lock_reason||'Atividade bloqueada.'},423);

    let released=!e.default_locked;
    const {data:sr}=await db.from('exercise_releases').select('enabled,release_at,lock_at').eq('student_id',user.id).eq('exercise_id',eid).order('updated_at',{ascending:false}).limit(1).maybeSingle();
    if(sr)released=sr.enabled&&(!sr.release_at||Date.parse(sr.release_at)<=Date.now())&&(!sr.lock_at||Date.parse(sr.lock_at)>Date.now());
    else{const {data:cr}=await db.from('exercise_releases').select('enabled,release_at,lock_at').is('student_id',null).eq('class_id',m.class_id).eq('exercise_id',eid).order('updated_at',{ascending:false}).limit(1).maybeSingle();if(cr)released=cr.enabled&&(!cr.release_at||Date.parse(cr.release_at)<=Date.now())&&(!cr.lock_at||Date.parse(cr.lock_at)>Date.now())}
    if(!released)return J({error:'exercise_locked_by_teacher'},423);

    const activeSession=async(requireAge=false)=>{
      const sid=String(b?.session_id||'');
      const {data:s}=await db.from('activity_sessions').select('id,started_at,locked,ended_at').eq('id',sid).eq('student_id',user.id).eq('exercise_id',eid).maybeSingle();
      if(!s||s.locked||s.ended_at){await logRisk(db,user,req,'completion_without_valid_session','warning',{source:'activity-progress',exercise_id:eid,action});return {ok:false,response:J({error:'active_supervised_session_required'},423)}}
      if(requireAge&&Date.now()-Date.parse(s.started_at)<5000){await logRisk(db,user,req,'activity_too_fast','high',{source:'activity-progress',exercise_id:eid});return {ok:false,response:J({error:'activity_too_fast'},400)}}
      return {ok:true,session:s};
    };
    const privateEvaluation=async()=>{
      if(!serverValidated)return {error:'server_validation_not_enabled' as const};
      const rules=parsePrivateRules();if(!rules)return {error:'private_validation_unavailable' as const};
      const spec=rules[exerciseKey];if(!spec)return {error:'private_validation_not_configured' as const};
      const {data:files,error}=await db.from('student_files').select('filename,content,revision,saved_at').eq('student_id',user.id).eq('exercise_id',eid).order('filename');if(error)throw error;
      return {spec,files:files||[],evaluation:evaluateSpec(spec,files||[])};
    };

    if(action==='start'){
      if(!progress){const {error}=await db.from('student_exercises').insert({student_id:user.id,exercise_id:eid,status:'in_progress',progress_percent:0,attempts:0,started_at:now(),last_activity_at:now()});if(error)throw error}
      else if(progress.status==='not_started')await db.from('student_exercises').update({status:'in_progress',started_at:now(),last_activity_at:now()}).eq('student_id',user.id).eq('exercise_id',eid);
      return J({ok:true,server_validation:serverValidated});
    }
    if(action==='touch'){await db.from('student_exercises').update({last_activity_at:now()}).eq('student_id',user.id).eq('exercise_id',eid);return J({ok:true})}

    if(action==='evaluate'){
      const sess=await activeSession(false);if(!sess.ok)return sess.response;
      const result=await privateEvaluation();
      if('error' in result){const status=result.error==='private_validation_unavailable'?503:result.error==='private_validation_not_configured'?503:400;return J({error:result.error},status)}
      const ev=result.evaluation,oldMeta=(progress?.metadata&&typeof progress.metadata==='object')?progress.metadata:{};
      const best=Math.max(Number(progress?.progress_percent||0),Number(ev.score||0));
      await db.from('student_exercises').update({progress_percent:best,last_activity_at:now(),metadata:{...oldMeta,last_private_validation:{score:ev.score,at:now(),authority:'server-private-v1'}}}).eq('student_id',user.id).eq('exercise_id',eid);
      return J({ok:true,score:ev.score,minimum_score:ev.minimum_score,criteria:ev.criteria,missing_files:ev.missing_files,can_submit:ev.score>=ev.minimum_score&&ev.missing_files.length===0,authority:'server-private-v1'});
    }

    if(action==='submit'){
      const sess=await activeSession(true);if(!sess.ok)return sess.response;
      const repo=normalizeGithubRepository(b?.repository_url);if(!repo)return J({error:'invalid_repository_url'},400);
      const result=await privateEvaluation();
      if('error' in result){const status=result.error==='private_validation_unavailable'||result.error==='private_validation_not_configured'?503:400;return J({error:result.error},status)}
      const ev=result.evaluation;
      if(ev.missing_files.length)return J({error:'incomplete_files',missing_files:ev.missing_files,score:ev.score,minimum_score:ev.minimum_score,criteria:ev.criteria},422);
      if(ev.score<ev.minimum_score)return J({error:'score_below_minimum',score:ev.score,minimum_score:ev.minimum_score,criteria:ev.criteria},422);
      const fileHashes:Record<string,string>={},revisions:Record<string,number>={};
      for(const f of result.files){fileHashes[String(f.filename)]=await sha256(String(f.content||''));revisions[String(f.filename)]=Number(f.revision||0)}
      const bundleHash=await sha256(result.files.map(f=>`${f.filename}\u0000${f.content||''}`).join('\u0001'));
      const oldMeta=(progress?.metadata&&typeof progress.metadata==='object')?progress.metadata:{};
      const best=Math.max(Number(progress?.progress_percent||0),Number(ev.score||0));
      const submittedAt=now();
      const previouslyCompleted=progress?.status==='completed'&&Number(progress?.progress_percent||0)>=100;
      const fullyCompleted=previouslyCompleted||Number(ev.score||0)>=100;
      const deliveryState=fullyCompleted?'completed':'submitted_with_pending';
      const patch={
        status:fullyCompleted?'completed':'in_progress',
        progress_percent:best,
        attempts:Number(progress?.attempts||0)+1,
        completed_at:fullyCompleted?(progress?.completed_at||submittedAt):null,
        last_activity_at:submittedAt,
        approval_status:'not_required',
        completion_source:fullyCompleted?'server_private_validation':'server_private_validation_partial',
        metadata:{...oldMeta,repository_url:repo,best_private_validation_score:best,last_submission:{score:ev.score,best_score:best,state:deliveryState,submitted_at:submittedAt,repository_url:repo,authority:'server-private-v1'},submission_evidence:{bundle_sha256:bundleHash,file_sha256:fileHashes,revisions}}
      };
      const {error}=await db.from('student_exercises').update(patch).eq('student_id',user.id).eq('exercise_id',eid);if(error)throw error;
      return J({ok:true,submitted:true,completed:fullyCompleted,delivery_state:deliveryState,score:ev.score,best_score:best,minimum_score:ev.minimum_score,criteria:ev.criteria,repository_url:repo,submitted_at:submittedAt,authority:'server-private-v1'});
    }

    if(action==='complete'){
      if(serverValidated)return J({error:'server_validation_required'},409);
      const sess=await activeSession(true);if(!sess.ok)return sess.response;
      const {data:f}=await db.from('student_files').select('content').eq('student_id',user.id).eq('exercise_id',eid);if(!(f||[]).some(x=>String(x.content||'').trim()))return J({error:'empty_activity'},400);
      await db.from('student_exercises').update({status:'completed',progress_percent:100,completed_at:now(),last_activity_at:now()}).eq('student_id',user.id).eq('exercise_id',eid);return J({ok:true});
    }
    return J({error:'unknown_action'},400);
  }catch(e){console.error(e);return J({error:'internal_error',detail:String((e as Error)?.message||e)},500)}
});

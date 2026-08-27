const $=id=>document.getElementById(id);
const safe=(value,fallback={})=>value&&typeof value==='object'?value:fallback;
const firstName=profile=>String(profile?.full_name||'').trim().split(/\s+/)[0]||'Você';
const pct=value=>Math.max(0,Math.min(100,Math.round(Number(value||0))));

function tableMissing(error){return ['42P01','PGRST205','PGRST204'].includes(String(error?.code||''));}
function plainText(value,max=4000){return String(value??'').trim().slice(0,max);}
function formatDeadline(value){if(!value)return'';const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});}

const LOCAL_PROGRESS_PREFIX='agv:personalized-progress:v1';
const LOCAL_LAST_PREFIX='agv:personalized-last:v1';
function localProgressKey(studentId,assignmentId){return `${LOCAL_PROGRESS_PREFIX}:${studentId}:${assignmentId}`;}
function readLocalProgress(studentId,assignmentId){try{const raw=localStorage.getItem(localProgressKey(studentId,assignmentId));if(!raw)return null;const value=JSON.parse(raw);return value&&typeof value==='object'?value:null;}catch{return null;}}
function writeLocalProgress(studentId,assignmentId,value){try{localStorage.setItem(localProgressKey(studentId,assignmentId),JSON.stringify(value));localStorage.setItem(`${LOCAL_LAST_PREFIX}:${studentId}`,JSON.stringify({assignment_id:assignmentId,updated_at:new Date().toISOString()}));}catch(_){}}
function progressTime(row){const t=Date.parse(String(row?.updated_at||row?.last_activity_at||''));return Number.isFinite(t)?t:0;}
function readLastAssignment(studentId){try{const raw=localStorage.getItem(`${LOCAL_LAST_PREFIX}:${studentId}`);return raw?JSON.parse(raw):null;}catch{return null;}}
function bestProgress(remote,local){if(!remote)return local;if(!local)return remote;return progressTime(local)>progressTime(remote)?{...remote,...local}:{...local,...remote};}

export async function logExperienceEvent(supabase,profile,event={}){
  if(!supabase||!profile?.id)return;
  const row={
    student_id:profile.id,
    assignment_id:event.assignment_id||null,
    adaptation_key:event.adaptation_key||null,
    subject_slug:event.subject_slug||null,
    event_type:event.event_type,
    mode:event.mode||null,
    metadata:safe(event.metadata,{}),
    occurred_at:new Date().toISOString(),
  };
  if(!row.event_type)return;
  try{const {error}=await supabase.from('pedagogical_experience_events').insert(row);if(error&&!tableMissing(error))throw error;}catch(error){console.warn('[experience] evento não sincronizado',error);}
}

async function loadGlobalAdaptation(supabase,profile){
  try{
    const {data,error}=await supabase.from('student_accommodations')
      .select('id,config,updated_at')
      .eq('student_id',profile.id).is('exercise_id',null)
      .eq('accommodation_type','learning_mode').eq('active',true)
      .order('updated_at',{ascending:false}).limit(1).maybeSingle();
    if(error)throw error;
    return data||null;
  }catch(error){console.warn('[experience] perfil pedagógico indisponível',error);return null;}
}

async function loadPreference(supabase,profile){
  try{
    const {data,error}=await supabase.from('pedagogical_learning_preferences').select('*').eq('student_id',profile.id).maybeSingle();
    if(error){if(tableMissing(error))return null;throw error;}
    return data||null;
  }catch(error){console.warn('[experience] preferências indisponíveis',error);return null;}
}

async function loadModePreference(supabase,profile,adaptationKey){
  if(!adaptationKey)return null;
  try{
    const {data,error}=await supabase.from('pedagogical_adaptation_preferences').select('mode,updated_at').eq('student_id',profile.id).eq('adaptation_key',adaptationKey).maybeSingle();
    if(error){if(tableMissing(error))return null;throw error;}
    return data||null;
  }catch(error){console.warn('[experience] preferência de modo indisponível',error);return null;}
}

async function loadAssignments(supabase,profile){
  try{
    const {data,error}=await supabase.from('pedagogical_experience_assignments')
      .select('id,adaptation_key,subject_slug,subject_name,experience_key,title,purpose,deadline,extra_time_minutes,display_order,config,created_at,updated_at')
      .eq('student_id',profile.id).eq('active',true).order('display_order').order('created_at');
    if(error){if(tableMissing(error))return[];throw error;}
    return data||[];
  }catch(error){console.warn('[experience] experiências indisponíveis',error);return[];}
}

async function loadProgress(supabase,profile,assignments){
  if(!assignments.length)return[];
  let remote=[];
  try{
    const ids=assignments.map(x=>x.id);
    const {data,error}=await supabase.from('pedagogical_experience_progress').select('*').eq('student_id',profile.id).in('assignment_id',ids);
    if(error){if(!tableMissing(error))throw error;}else remote=data||[];
  }catch(error){console.warn('[experience] progresso remoto indisponível; usando cópia local',error);}
  return assignments.map(assignment=>{
    const server=remote.find(row=>String(row.assignment_id)===String(assignment.id))||null;
    const local=readLocalProgress(profile.id,assignment.id);
    return bestProgress(server,local);
  }).filter(Boolean);
}

export async function loadPersonalizedExperienceContext(supabase,profile){
  if(!supabase||!profile?.id)return null;
  const adaptation=await loadGlobalAdaptation(supabase,profile);
  if(!adaptation)return null;
  const config=safe(adaptation.config,{}),adaptationKey=String(config.profile_key||config.adaptation_profile||'support');
  const [preference,modePreference,assignments]=await Promise.all([
    loadPreference(supabase,profile),
    loadModePreference(supabase,profile,adaptationKey),
    loadAssignments(supabase,profile),
  ]);
  const progress=await loadProgress(supabase,profile,assignments);
  const progressByAssignment=new Map(progress.map(row=>[String(row.assignment_id),row]));
  const lastAssignment=readLastAssignment(profile.id);return {adaptation,config,adaptationKey,preference,modePreference,assignments,progress,progressByAssignment,lastAssignmentId:lastAssignment?.assignment_id||null};
}

export function applyPersonalizedTheme(context){
  const root=document.documentElement;
  root.classList.remove('experience-theme-active','experience-theme-home','experience-theme-hero','experience-theme-visual','experience-theme-football','experience-theme-geek','experience-theme-clean');
  root.style.removeProperty('--experience-accent');
  root.style.removeProperty('--experience-accent-soft');
  if(!context?.config)return;
  const personalization=safe(context.config.personalization,{}),theme=plainText(personalization.theme_key||'',40);
  root.classList.add('experience-theme-active');
  if(theme)root.classList.add(`experience-theme-${theme.replace(/[^a-z0-9_-]/gi,'').toLowerCase()}`);
  const accent=plainText(personalization.accent||'',32);
  const soft=plainText(personalization.accent_soft||'',40);
  if(/^#[0-9a-f]{3,8}$/i.test(accent))root.style.setProperty('--experience-accent',accent);
  if(/^#[0-9a-f]{3,8}$/i.test(soft))root.style.setProperty('--experience-accent-soft',soft);
}

export function clearPersonalizedTheme(){
  const root=document.documentElement;
  [...root.classList].filter(x=>x.startsWith('experience-theme-')).forEach(x=>root.classList.remove(x));
  root.style.removeProperty('--experience-accent');root.style.removeProperty('--experience-accent-soft');
}

async function savePreference(supabase,profile,context,patch={}){
  const current=context.preference||{};
  const row={
    student_id:profile.id,
    adaptation_key:context.adaptationKey,
    programming_level:patch.programming_level||current.programming_level||'guided',
    support_focus:Array.isArray(patch.support_focus)?patch.support_focus:(current.support_focus||[]),
    explanation_style:patch.explanation_style||current.explanation_style||'mixed',
    extra_challenges:patch.extra_challenges||current.extra_challenges||'sometimes',
    preferred_mode:patch.preferred_mode||current.preferred_mode||'last',
    onboarding_completed:patch.onboarding_completed??current.onboarding_completed??false,
    updated_at:new Date().toISOString(),
  };
  const {error}=await supabase.from('pedagogical_learning_preferences').upsert(row,{onConflict:'student_id'});
  if(error&&!tableMissing(error))throw error;
  context.preference=row;
  await logExperienceEvent(supabase,profile,{adaptation_key:context.adaptationKey,event_type:'preference_updated',metadata:{programming_level:row.programming_level,explanation_style:row.explanation_style,extra_challenges:row.extra_challenges,support_focus:row.support_focus}});
  return row;
}

async function setPreferredMode(supabase,profile,context,mode){
  if(!context?.adaptationKey)return;
  const next=mode==='adapted'?'adapted':'conventional';
  try{
    await supabase.from('pedagogical_adaptation_preferences').upsert({student_id:profile.id,adaptation_key:context.adaptationKey,mode:next,updated_at:new Date().toISOString()},{onConflict:'student_id,adaptation_key'});
  }catch(error){console.warn('[experience] modo não sincronizado',error);}
  context.modePreference={mode:next,updated_at:new Date().toISOString()};
  await savePreference(supabase,profile,context,{preferred_mode:next});
  await logExperienceEvent(supabase,profile,{adaptation_key:context.adaptationKey,event_type:'mode_selected',mode:next,metadata:{source:'dashboard'}});
}

function assignmentPurposeLabel(purpose){return ({evaluation:'Avaliação',recovery:'Recuperação',complementary:'Complementar',extra:'Desafio extra',practice:'Prática'})[purpose]||'Experiência';}

function renderAssignmentCard(assignment,progress,onOpen,isLast=false){
  const article=document.createElement('article');article.className=`experience-assignment-card${isLast?' is-last-assignment':''}`;
  const done=pct(progress?.progress_percent),deadline=formatDeadline(assignment.deadline),purpose=assignmentPurposeLabel(assignment.purpose);
  article.innerHTML=`<div class="experience-assignment-head"><div><span>${purpose}</span><strong></strong></div><b>${done}%</b></div><p></p><div class="experience-progress-track"><i style="width:${done}%"></i></div><div class="experience-assignment-meta"></div><button class="button button-primary experience-open-btn" type="button">${done?done>=100?'Revisar':'Continuar':'Começar'}</button>`;
  article.querySelector('strong').textContent=assignment.title;
  article.querySelector('p').textContent=plainText(assignment.config?.summary||assignment.config?.intro||'Atividade organizada em etapas curtas.',300);
  const extra=Number(assignment.extra_time_minutes||0);article.querySelector('.experience-assignment-meta').textContent=`${assignment.subject_name}${deadline?` • Prazo ${deadline}`:''}${extra?` • +${extra} min`:''}`;
  const openButton=article.querySelector('button');if(isLast&&done<100)openButton.textContent='Continuar de onde parei';openButton.onclick=()=>onOpen?.(assignment,progress||null);
  return article;
}

function groupAssignments(assignments){
  const groups=new Map();for(const a of assignments){const key=a.subject_slug||a.subject_name||'disciplina';if(!groups.has(key))groups.set(key,{name:a.subject_name||key,items:[]});groups.get(key).items.push(a);}return [...groups.values()];
}

export async function renderPersonalizedExperienceDashboard({supabase,profile,context,onOpenAssignment}){
  const section=$('personalized-experience-section'),list=$('personalized-experience-list'),summary=$('personalized-experience-summary');
  if(!section||!list||!summary)return;
  if(!context){section.classList.add('hidden');return;}
  applyPersonalizedTheme(context);section.classList.remove('hidden');
  const p=safe(context.config.personalization,{}),name=firstName(profile),mode=context.modePreference?.mode||context.preference?.preferred_mode||'last';
  $('personalized-experience-title').textContent=plainText(p.dashboard_title||`Sua experiência, ${name}`,100);
  $('personalized-experience-copy').textContent=plainText(p.dashboard_message||'Você pode alternar entre a experiência personalizada e o modo convencional sem perder o que já fez.',500);
  const modeBadge=$('personalized-experience-mode');if(modeBadge)modeBadge.textContent=mode==='adapted'?'Experiência personalizada':mode==='conventional'?'Modo convencional':'Você escolhe';
  const adaptedBtn=$('personalized-mode-adapted'),conventionalBtn=$('personalized-mode-conventional');
  if(adaptedBtn)adaptedBtn.onclick=async()=>{await setPreferredMode(supabase,profile,context,'adapted');modeBadge.textContent='Experiência personalizada';adaptedBtn.classList.add('is-selected');conventionalBtn?.classList.remove('is-selected');};
  if(conventionalBtn)conventionalBtn.onclick=async()=>{await setPreferredMode(supabase,profile,context,'conventional');modeBadge.textContent='Modo convencional';conventionalBtn.classList.add('is-selected');adaptedBtn?.classList.remove('is-selected');};
  adaptedBtn?.classList.toggle('is-selected',mode==='adapted');conventionalBtn?.classList.toggle('is-selected',mode==='conventional');

  list.replaceChildren();
  const groups=groupAssignments(context.assignments||[]);
  if(!groups.length){
    const empty=document.createElement('p');empty.className='experience-empty';empty.textContent='Sua personalização já está ativa nas atividades convencionais. Quando houver atividades exclusivas, elas aparecerão aqui.';list.append(empty);
  }else{
    for(const group of groups){
      const block=document.createElement('section');block.className='experience-subject-group';
      const heading=document.createElement('div');heading.className='experience-subject-heading';heading.innerHTML='<div><span>Disciplina</span><strong></strong></div><small></small>';heading.querySelector('strong').textContent=group.name;
      const completed=group.items.filter(a=>pct(context.progressByAssignment.get(String(a.id))?.progress_percent)>=100).length;heading.querySelector('small').textContent=`${completed} de ${group.items.length} concluídas`;
      const cards=document.createElement('div');cards.className='experience-assignment-grid';
      group.items.forEach(a=>cards.append(renderAssignmentCard(a,context.progressByAssignment.get(String(a.id)),onOpenAssignment,String(context.lastAssignmentId||'')===String(a.id))));
      block.append(heading,cards);list.append(block);
    }
  }
  const all=context.assignments||[],completed=all.filter(a=>pct(context.progressByAssignment.get(String(a.id))?.progress_percent)>=100).length;
  summary.textContent=all.length?`${completed} de ${all.length} experiências concluídas. Seu histórico convencional permanece separado e preservado.`:'Seu histórico convencional permanece preservado. A personalização pode ser ligada ou desligada a qualquer momento.';

  if(!context.preference?.onboarding_completed)showExperienceOnboarding({supabase,profile,context});
}

export async function showExperienceOnboarding({supabase,profile,context}){
  const dialog=$('personalized-onboarding-dialog');if(!dialog||dialog.open)return;
  const p=safe(context.config.personalization,{}),name=firstName(profile);
  $('personalized-onboarding-title').textContent=plainText(p.welcome_title||`Preparamos uma experiência para você, ${name}`,120);
  $('personalized-onboarding-copy').textContent=plainText(p.welcome_message||'Fizemos alguns ajustes pensando na forma como você aprende. Tudo o que você já realizou continua salvo e você pode voltar ao modo convencional quando quiser.',700);
  const interests=$('personalized-onboarding-interests');
  const interestList=Array.isArray(p.interests)?p.interests.map(String).filter(Boolean).slice(0,5):[];
  const favoriteColor=plainText(p.favorite_color||'',40);interests.textContent=interestList.length||favoriteColor?`${favoriteColor?`Usamos ${favoriteColor} como referência visual. `:''}${interestList.length?`Também podemos usar referências a ${interestList.join(', ')} quando isso ajudar a explicar o conteúdo.`:''}`:'Você pode ajustar abaixo como prefere aprender.';
  const form=$('personalized-onboarding-form');
  const recommended=plainText(p.recommended_level||context.preference?.programming_level||'guided',40);
  if($('personalized-level')&&['essential','guided','autonomous','challenge'].includes(recommended))$('personalized-level').value=recommended;
  const preferredStyle=plainText(context.preference?.explanation_style||p.explanation_style||'mixed',40);
  if($('personalized-style')&&['short_steps','examples','visual','mixed'].includes(preferredStyle))$('personalized-style').value=preferredStyle;
  const extraDefault=context.preference?.extra_challenges||(p.extra_challenges===true?'yes':p.extra_challenges===false?'no':'sometimes');
  if($('personalized-extra')&&['yes','sometimes','no'].includes(extraDefault))$('personalized-extra').value=extraDefault;
  form.onsubmit=async(event)=>{
    event.preventDefault();
    const support=[...form.querySelectorAll('input[name="support-focus"]:checked')].map(x=>x.value);
    await savePreference(supabase,profile,context,{programming_level:$('personalized-level').value,support_focus:support,explanation_style:$('personalized-style').value,extra_challenges:$('personalized-extra').value,onboarding_completed:true,preferred_mode:'adapted'});
    await setPreferredMode(supabase,profile,context,'adapted');
    dialog.close();
  };
  $('personalized-onboarding-conventional').onclick=async()=>{await savePreference(supabase,profile,context,{onboarding_completed:true,preferred_mode:'conventional'});await setPreferredMode(supabase,profile,context,'conventional');dialog.close();};
  await logExperienceEvent(supabase,profile,{adaptation_key:context.adaptationKey,event_type:'offer_shown',metadata:{source:'dashboard'}});
  try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
}

async function ensureAssignmentProgress(supabase,profile,assignment,existing=null){
  const local=readLocalProgress(profile.id,assignment.id),base=bestProgress(existing,local);
  if(base){
    const state={...base,assignment_id:assignment.id,student_id:profile.id,completed_steps:safe(base.completed_steps,{}),responses:safe(base.responses,{}),drafts:safe(base.drafts,{}),_sync_state:existing&&progressTime(existing)>=progressTime(local)?'synced':'local'};
    writeLocalProgress(profile.id,assignment.id,state);
    if(state._sync_state==='local'){
      try{const copy={...state};delete copy._sync_state;const {data,error}=await supabase.from('pedagogical_experience_progress').upsert(copy,{onConflict:'assignment_id,student_id'}).select().single();if(!error&&data){Object.assign(state,data,{_sync_state:'synced'});writeLocalProgress(profile.id,assignment.id,state);}}catch(error){console.warn('[experience] retomada seguirá local até a conexão voltar',error);}
    }
    return state;
  }
  const now=new Date().toISOString(),row={assignment_id:assignment.id,student_id:profile.id,status:'in_progress',progress_percent:0,completed_steps:{},responses:{},drafts:{},started_at:now,last_activity_at:now,updated_at:now,_sync_state:'local'};
  writeLocalProgress(profile.id,assignment.id,row);
  try{const copy={...row};delete copy._sync_state;const {data,error}=await supabase.from('pedagogical_experience_progress').upsert(copy,{onConflict:'assignment_id,student_id'}).select().single();if(error)throw error;if(data)Object.assign(row,data,{_sync_state:'synced'});}catch(error){console.warn('[experience] atividade iniciada localmente; sincronização pendente',error);}
  writeLocalProgress(profile.id,assignment.id,row);return row;
}

function assignmentSteps(config){return Array.isArray(config?.steps)?config.steps.filter(Boolean):[];}
function stepLabel(step,index){return plainText(step?.title||step?.label||`Etapa ${index+1}`,120);}
function stepText(step){return plainText(step?.text||step?.instruction||step?.explanation||'',2500);}
function actionableSteps(steps){return steps;}

async function persistAssignmentProgress(supabase,profile,assignment,progress){
  const steps=actionableSteps(assignmentSteps(assignment.config)),done=steps.filter((step,index)=>progress.completed_steps?.[String(step.id||index)]===true).length;
  const percent=steps.length?Math.round(done/steps.length*100):100,completed=percent>=100,now=new Date().toISOString();
  const patch={status:completed?'completed':'in_progress',progress_percent:percent,completed_steps:progress.completed_steps||{},responses:progress.responses||{},drafts:progress.drafts||{},started_at:progress.started_at||now,last_activity_at:now,updated_at:now,completed_at:completed?(progress.completed_at||now):null};
  Object.assign(progress,patch,{assignment_id:assignment.id,student_id:profile.id,_sync_state:'local'});writeLocalProgress(profile.id,assignment.id,progress);
  try{
    const {data,error}=await supabase.from('pedagogical_experience_progress').upsert({...patch,assignment_id:assignment.id,student_id:profile.id},{onConflict:'assignment_id,student_id'}).select().single();
    if(error)throw error;Object.assign(progress,data||patch,{_sync_state:'synced'});writeLocalProgress(profile.id,assignment.id,progress);
  }catch(error){console.warn('[experience] progresso salvo neste dispositivo; sincronização pendente',error);}
  return progress;
}

function codePreview(step,draft){
  if(String(step?.language||'').toLowerCase()!=='html'&&step?.preview!=='html')return null;
  const frame=document.createElement('iframe');frame.className='experience-code-preview';frame.setAttribute('sandbox','allow-scripts');frame.title='Prévia do código';
  frame.srcdoc=String(draft||step?.starter||'');return frame;
}

export async function renderPersonalizedAssignment({supabase,profile,assignment,progress,onBack,onUpdated}){
  const host=$('personalized-experience-body');if(!host)return;
  const cfg=safe(assignment.config,{}),steps=assignmentSteps(cfg),name=firstName(profile);
  let state=await ensureAssignmentProgress(supabase,profile,assignment,progress);
  await logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:'assignment_started',mode:'adapted',metadata:{experience_key:assignment.experience_key}});
  $('personalized-experience-view-subject').textContent=assignment.subject_name;
  $('personalized-experience-view-title').textContent=assignment.title;
  $('personalized-experience-view-purpose').textContent=assignmentPurposeLabel(assignment.purpose);
  $('personalized-experience-back').onclick=async()=>{await logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:'experience_closed',mode:'adapted'});onBack?.();};
  host.replaceChildren();

  const intro=document.createElement('section');intro.className='experience-lesson-intro';
  intro.innerHTML='<div><span class="experience-kicker"></span><h3></h3><p></p><small class="experience-sync-state" role="status"></small></div><div class="experience-lesson-progress"><strong></strong><div><i></i></div></div>';
  intro.querySelector('.experience-kicker').textContent=plainText(cfg.kicker||'Experiência personalizada',80);
  intro.querySelector('h3').textContent=plainText(cfg.heading||`Vamos por etapas, ${name}`,140);
  intro.querySelector('p').textContent=plainText(cfg.intro||'Faça uma etapa de cada vez. Seu progresso fica salvo para continuar depois.',700);
  host.append(intro);

  const list=document.createElement('div');list.className=`experience-step-list ${cfg.presentation==='single_step'?'single-step':''}`;host.append(list);
  const render=()=>{
    list.replaceChildren();
    steps.forEach((step,index)=>{
      const key=String(step.id||index),done=state.completed_steps?.[key]===true;
      const card=document.createElement('article');card.className=`experience-step-card ${done?'is-done':''}`;card.dataset.step=key;
      const head=document.createElement('div');head.className='experience-step-head';
      head.innerHTML='<span></span><strong></strong><b></b>';head.querySelector('span').textContent=`${index+1}`;head.querySelector('strong').textContent=stepLabel(step,index);head.querySelector('b').textContent=done?'Concluída':'Em andamento';card.append(head);
      const copy=document.createElement('p');copy.textContent=stepText(step);if(copy.textContent)card.append(copy);
      if(Array.isArray(step?.tips)&&step.tips.length){const details=document.createElement('details');details.className='experience-help';details.innerHTML='<summary>Preciso de ajuda</summary><div></div>';const body=details.querySelector('div');step.tips.slice(0,4).forEach((tip,i)=>{const p=document.createElement('p');p.textContent=`Pista ${i+1}: ${plainText(tip,600)}`;body.append(p);});details.ontoggle=()=>{if(details.open)void logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:'help_requested',mode:'adapted',metadata:{step:key}})};card.append(details);}
      if(step?.type==='quiz'){
        const options=document.createElement('div');options.className='experience-quiz-options';
        (step.options||[]).forEach(option=>{const label=document.createElement('label');const radio=document.createElement('input');radio.type='radio';radio.name=`quiz-${assignment.id}-${key}`;radio.value=String(option);radio.checked=state.responses?.[key]===String(option);radio.onchange=async()=>{state.responses={...state.responses,[key]:radio.value};await persistAssignmentProgress(supabase,profile,assignment,state);onUpdated?.(state);};const span=document.createElement('span');span.textContent=String(option);label.append(radio,span);options.append(label);});card.append(options);
      }
      if(step?.type==='code'){
        const code=document.createElement('div');code.className='experience-code-block';
        const label=document.createElement('label');label.textContent=plainText(step.filename||'Código',100);const textarea=document.createElement('textarea');textarea.spellcheck=false;textarea.value=String(state.drafts?.[key]??step.starter??'');textarea.placeholder=plainText(step.placeholder||'Digite somente o código necessário para esta etapa.',200);let timer=null;textarea.oninput=()=>{state.drafts={...state.drafts,[key]:textarea.value};clearTimeout(timer);timer=setTimeout(async()=>{await persistAssignmentProgress(supabase,profile,assignment,state);onUpdated?.(state);const frame=code.querySelector('iframe');if(frame)frame.srcdoc=textarea.value;},450);};code.append(label,textarea);const frame=codePreview(step,textarea.value);if(frame)code.append(frame);card.append(code);
      }
      if(step?.type==='choice'){
        const select=document.createElement('select');select.className='experience-select';const first=document.createElement('option');first.value='';first.textContent='Selecione uma opção';select.append(first);(step.options||[]).forEach(option=>{const o=document.createElement('option');o.value=String(option);o.textContent=String(option);select.append(o);});select.value=String(state.responses?.[key]||'');select.onchange=async()=>{state.responses={...state.responses,[key]:select.value};await persistAssignmentProgress(supabase,profile,assignment,state);onUpdated?.(state);};card.append(select);
      }
      {
        const button=document.createElement('button');button.type='button';button.className=done?'button button-ghost':'button button-primary';
        button.textContent=done?'Marcar como não concluída':step?.type==='message'?'Continuar':'Concluir esta etapa';
        button.onclick=async()=>{
          if(!done&&step?.type==='quiz'&&!state.responses?.[key]){button.textContent='Escolha uma resposta antes de continuar';return;}
          if(!done&&step?.type==='choice'&&!state.responses?.[key]){button.textContent='Selecione uma opção antes de continuar';return;}
          if(!done&&step?.type==='code'&&!String(state.drafts?.[key]??step.starter??'').trim()){button.textContent='Faça a pequena alteração antes de continuar';return;}
          state.completed_steps={...state.completed_steps,[key]:!done};state=await persistAssignmentProgress(supabase,profile,assignment,state);
          await logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:done?'checkpoint_reopened':'checkpoint_completed',mode:'adapted',metadata:{step:key,step_type:step?.type||'message',progress_percent:state.progress_percent}});
          if(state.progress_percent>=100)await logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:'assignment_completed',mode:'adapted',metadata:{experience_key:assignment.experience_key}});
          onUpdated?.(state);render();
        };card.append(button);
      }
      list.append(card);
    });
    const value=pct(state.progress_percent);intro.querySelector('.experience-lesson-progress strong').textContent=`${value}% concluído`;intro.querySelector('.experience-lesson-progress i').style.width=`${value}%`;
    const sync=intro.querySelector('.experience-sync-state');if(sync){sync.textContent=state._sync_state==='synced'?'☁ Sincronizado':'✓ Salvo neste dispositivo • sincronização pendente';sync.dataset.state=state._sync_state||'local';}
    if(cfg.presentation==='single_step'){
      const cards=[...list.children],firstOpen=cards.findIndex((_,i)=>!state.completed_steps?.[String(steps[i]?.id||i)]);cards.forEach((card,i)=>card.classList.toggle('is-hidden-step',firstOpen>=0&&i!==firstOpen));
      if(firstOpen<0)cards.forEach(card=>card.classList.remove('is-hidden-step'));
    }
  };
  render();
  await logExperienceEvent(supabase,profile,{assignment_id:assignment.id,adaptation_key:assignment.adaptation_key,subject_slug:assignment.subject_slug,event_type:'experience_opened',mode:'adapted',metadata:{progress_percent:state.progress_percent}});
}

import { supabase } from './supabase.js';
import { SCHOOL_EMAIL_DOMAIN, ACTIVITY_URL, LOBBY_VERSION } from './config.js';
import { createLobby3D } from './lobby3d.js';

const $=id=>document.getElementById(id);
const state={
  user:null,profile:null,currentClass:null,classes:[],exercises:[],studentReleases:[],classReleases:[],progress:[],others:[],available:[],scheduled:[],
  player:{x:800,y:500,area:'central'},nearPortal:null,nearStudent:null,lastPresence:0,toastTimer:null,zoneTimer:null,stopped:false,lastTargetSignal:'',runtime:null,
  portalState:null,emoteRequested:null
};
const zones=[
  {key:'1ds',code:'1DS-A-MANHA',label:'1DS',name:'1ª Série DS',accent:'#36d2ff',portal:{label:'Porta Neon'}},
  {key:'2ds',code:'2DS-A-MANHA',label:'2DS',name:'2ª Série DS',accent:'#51e7a3',portal:{label:'Cano Tech'}},
  {key:'3ds',code:'3DS-C-MANHA',label:'3DS',name:'3ª Série DS',accent:'#b58cff',portal:{label:'Portal Quantum'}},
  {key:'sub',code:'DS-SUB-NOITE',label:'SUB',name:'DS Subsequente',accent:'#ffae63',portal:{label:'Arcade Gate'}}
];
const isStaff=()=>['teacher','admin','super_admin'].includes(state.profile?.role);
const roleLabel=r=>r==='teacher'?'Professor':r==='super_admin'?'Super Admin':r==='admin'?'Administrador':'Aluno';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const email=v=>String(v||'').trim().toLowerCase();
const className=id=>state.classes.find(c=>c.id===id)?.name||'Outra turma';

function showLogin(on){$('login').classList.toggle('hidden',!on);$('game-shell').classList.toggle('hidden',on)}
function msg(t='',e=false){$('login-message').textContent=t;$('login-message').classList.toggle('error',e)}
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>e.classList.add('hidden'),3000)}

async function securityTelemetry(action='session.check',severity='info',payload={}){
  try{return await supabase.functions.invoke('security-telemetry',{body:{action,severity,payload:{source:'lobby-3d',version:LOBBY_VERSION,...payload}}})}
  catch(_){return null}
}
function reportDevtoolsShortcut(e){
  if(state.profile?.role!=='student')return;
  const suspicious=e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(String(e.key).toUpperCase()))||(e.ctrlKey&&String(e.key).toUpperCase()==='U');
  if(!suspicious)return;
  try{const k='agv:lobby:devtools-warning',last=Number(sessionStorage.getItem(k)||0);if(Date.now()-last<600000)return;sessionStorage.setItem(k,String(Date.now()))}catch(_){}
  securityTelemetry('client.devtools_heuristic','warning',{shortcut:String(e.key||e.code||'unknown')}).catch(()=>{});
}
window.addEventListener('keydown',reportDevtoolsShortcut);

async function signIn(mail,password){
  const {error}=await supabase.auth.signInWithPassword({email:mail,password});if(!error)return;
  const cgm=/^\d{6,12}$/.test(password);if(!cgm)throw error;
  const {data,error:up}=await supabase.auth.signUp({email:mail,password,options:{data:{cgm:password},emailRedirectTo:location.href}});if(up)throw up;if(data?.session)return;
  const {error:again}=await supabase.auth.signInWithPassword({email:mail,password});if(again)throw again;
}
async function activeBlock(){
  if(state.profile?.role!=='student'||!state.user)return null;
  const {data}=await supabase.from('lobby_blocks').select('blocked_until,reason').eq('student_id',state.user.id).gt('blocked_until',new Date().toISOString()).maybeSingle();return data||null;
}
function showKicked(block){
  state.stopped=true;state.runtime?.stop?.();state.runtime=null;
  $('game-shell').classList.add('hidden');$('login').classList.add('hidden');$('kicked').classList.remove('hidden');
  $('kicked-reason').textContent=block?.reason||'Você foi removido temporariamente do Lobby pela equipe.';
  $('kicked-until').textContent=block?.blocked_until?`Retorno permitido após ${new Date(block.blocked_until).toLocaleString('pt-BR')}.`:'Aguarde a liberação da equipe.';
}
async function loadIdentity(){
  const {data:{user}}=await supabase.auth.getUser();if(!user)return false;
  const {data:p,error}=await supabase.from('profiles').select('id,full_name,email,role,active,must_change_password').eq('id',user.id).single();if(error)throw error;
  if(!p.active)throw new Error('Seu acesso está inativo.');
  if(p.must_change_password){location.href='../atividades/';return false}
  if(!['student','teacher','admin','super_admin'].includes(p.role))throw new Error('Perfil sem acesso ao Lobby.');
  state.user=user;state.profile=p;
  const {data:all}=await supabase.from('classes').select('id,code,name,shift,school_year').in('code',zones.map(z=>z.code)).eq('active',true);state.classes=all||[];
  if(p.role==='student'){
    const {data:m,error:me}=await supabase.from('class_memberships').select('class_id').eq('user_id',user.id).eq('active',true).order('is_primary',{ascending:false}).limit(1);if(me)throw me;if(!m?.length)throw new Error('Sua turma ainda não foi vinculada.');
    const {data:cls,error:ce}=await supabase.from('classes').select('id,code,name,shift,school_year').eq('id',m[0].class_id).single();if(ce)throw ce;state.currentClass=cls;
    const block=await activeBlock();if(block){showKicked(block);return false}
  }
  $('player-name').textContent=p.full_name||roleLabel(p.role);
  $('player-class').textContent=p.role==='student'?(state.currentClass?.name||'Aluno'):`${roleLabel(p.role)} • Lobby`;
  $('staff-mode').classList.toggle('hidden',!isStaff());$('staff-moderation').classList.toggle('hidden',!isStaff());
  return true;
}
function releaseState(ex){
  const now=Date.now(),pr=state.progress.find(x=>x.exercise_id===ex.id);if(pr?.security_locked||pr?.status==='blocked')return{available:false,reason:'Bloqueada por segurança'};
  const r=state.studentReleases.find(x=>x.exercise_id===ex.id)||state.classReleases.find(x=>x.exercise_id===ex.id);
  if(!r)return{available:!ex.default_locked,reason:ex.default_locked?'Aguardando liberação do professor':'Disponível'};
  if(!r.enabled)return{available:false,reason:'Bloqueada pelo professor'};
  if(r.release_at&&Date.parse(r.release_at)>now)return{available:false,reason:'Programada',releaseAt:r.release_at};
  if(r.lock_at&&Date.parse(r.lock_at)<=now)return{available:false,reason:'Encerrada'};
  return{available:true,reason:'Liberada'};
}
async function loadActivities(){
  if(state.profile?.role!=='student'||!state.currentClass)return;
  const cid=state.currentClass.id,{data:cs}=await supabase.from('class_subjects').select('subject_id').eq('class_id',cid).eq('active',true),ids=(cs||[]).map(x=>x.subject_id);
  if(!ids.length){state.exercises=[];state.available=[];return}
  const [{data:ex},{data:sr},{data:cr},{data:pr}]=await Promise.all([
    supabase.from('exercises').select('id,class_id,subject_id,exercise_number,title,description,version,default_locked').in('subject_id',ids).eq('active',true).eq('visible',true).order('exercise_number'),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').eq('student_id',state.user.id).order('updated_at',{ascending:false}),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').is('student_id',null).eq('class_id',cid).order('updated_at',{ascending:false}),
    supabase.from('student_exercises').select('exercise_id,status,progress_percent,security_locked,security_lock_reason,completed_at').eq('student_id',state.user.id)
  ]);
  const uniq=rows=>{const s=new Set();return(rows||[]).filter(r=>!s.has(r.exercise_id)&&s.add(r.exercise_id))};
  state.exercises=(ex||[]).filter(e=>!e.class_id||e.class_id===cid);state.studentReleases=uniq(sr);state.classReleases=uniq(cr);state.progress=pr||[];
  state.available=state.exercises.filter(e=>releaseState(e).available);state.scheduled=state.exercises.map(ex=>({ex,s:releaseState(ex)})).filter(x=>!x.s.available&&x.s.releaseAt).sort((a,b)=>Date.parse(a.s.releaseAt)-Date.parse(b.s.releaseAt));
}
function portalState(z){
  if(isStaff())return{open:false,text:`${z.label}: circulação e observação liberadas. Liberações pedagógicas continuam no painel.`};
  if(z.code!==state.currentClass?.code)return{open:false,text:`Você pode visitar ${z.label}; as atividades são exclusivas da turma.`};
  if(state.available.length)return{open:true,text:`${state.available.length} atividade${state.available.length===1?'':'s'} liberada${state.available.length===1?'':'s'}.`};
  const n=state.scheduled[0];if(n)return{open:false,text:`Próxima abertura: ${new Date(n.s.releaseAt).toLocaleString('pt-BR')}.`};
  return{open:false,text:'Portal fechado. Aguardando o professor liberar uma atividade.'};
}
async function presence(force=false,target=null,emote=null){
  if(!state.user||state.stopped)return;
  const n=performance.now();if(!force&&n-state.lastPresence<5000)return;state.lastPresence=n;
  const payload={action:'heartbeat',x:Math.round(state.player.x),y:Math.round(state.player.y),area:state.player.area,emote:emote||null,interaction_target_id:target||null};
  try{
    const {data,error}=await supabase.functions.invoke('lobby-presence',{body:payload});
    if(data?.error==='rate_limited')return;
    if((error||data?.error)&&state.profile?.role==='student'){const b=await activeBlock();if(b)showKicked(b)}
  }catch(_){}
}
async function emote(kind,target=null){state.runtime?.setLocalEmote?.(kind);await presence(true,target,kind)}
async function poll(){
  if(!state.user||state.stopped)return;
  try{
    const cutoff=new Date(Date.now()-20000).toISOString(),{data}=await supabase.from('lobby_presence').select('student_id,class_id,display_name,participant_role,x,y,area,emote,emote_until,interaction_target_id,updated_at').gt('updated_at',cutoff);
    state.others=(data||[]).filter(x=>x.student_id!==state.user.id);$('online-count').textContent=`${state.others.length+1} online`;
    const sig=state.others.find(x=>x.interaction_target_id===state.user.id&&x.emote&&Date.parse(x.emote_until||0)>Date.now());
    if(sig){const key=`${sig.student_id}:${sig.emote_until}`;if(key!==state.lastTargetSignal){state.lastTargetSignal=key;toast(`${sig.display_name} enviou ${sig.emote==='wave'?'👋':sig.emote==='like'?'👍':'✨'} para você.`)}}
    if(state.profile?.role==='student'){const b=await activeBlock();if(b){showKicked(b);return}}
  }catch(_){}finally{if(!state.stopped)setTimeout(poll,4000)}
}
function showActivities(){
  if(!state.available.length){toast('O portal ainda está fechado pelo professor.');return}
  $('activity-title').textContent=`Atividades liberadas — ${state.currentClass.name}`;$('activity-subtitle').textContent='Escolha uma atividade para atravessar o portal.';
  $('activity-list').innerHTML=state.available.map(ex=>{const p=state.progress.find(x=>x.exercise_id===ex.id),st=p?.status==='completed'?'Concluída':p?.status==='in_progress'?`${Math.round(Number(p.progress_percent||0))}% em andamento`:'Disponível';return `<article class="activity"><span class="num">${String(ex.exercise_number).padStart(2,'0')}</span><div><strong>${esc(ex.title)}</strong><small>${esc(st)}</small></div><button class="primary" data-exercise="${esc(ex.id)}" type="button">Entrar</button></article>`}).join('');
  $('activity-list').querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>{const ex=state.exercises.find(x=>x.id===b.dataset.exercise);if(!ex||!releaseState(ex).available)return toast('A atividade não está liberada.');location.href=`${ACTIVITY_URL}?exercise=${encodeURIComponent(ex.id)}&from=lobby`});
  $('activity-modal').classList.remove('hidden');
}
function openStaffTarget(o){if(!isStaff()||o?.participant_role!=='student')return;$('student-name').textContent=o.display_name||'Aluno';$('student-context').textContent=`Aluno online • ${className(o.class_id)}`;$('staff-student-modal').dataset.student=o.student_id;$('kick-reason').value='';$('kick-duration').value='15';$('staff-student-modal').classList.remove('hidden')}
async function kickStudent(){
  const id=$('staff-student-modal').dataset.student,btn=$('kick-student');if(!id)return;const name=$('student-name').textContent||'este aluno',mins=Number($('kick-duration').value)||15,reason=$('kick-reason').value.trim();
  if(!confirm(`Expulsar ${name} do Lobby por ${mins} minuto${mins===1?'':'s'}?\n\nA conta, a matrícula e as atividades não serão afetadas.`))return;btn.disabled=true;
  try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'kick',student_id:id,duration_minutes:mins,reason}});if(error||data?.error)throw new Error(data?.error||error?.message);$('staff-student-modal').classList.add('hidden');toast(`Aluno removido até ${new Date(data.blocked_until).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}.`)}catch(e){toast(e.message==='student_out_of_scope'?'Você só pode expulsar alunos das suas turmas.':'Não foi possível remover o aluno.')}finally{btn.disabled=false}
}
async function loadModeration(){
  if(!isStaff())return;const list=$('moderation-list');list.replaceChildren(Object.assign(document.createElement('p'),{className:'muted',textContent:'Carregando…'}));$('staff-moderation-modal').classList.remove('hidden');
  try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'list_blocks'}});if(error||data?.error)throw new Error(data?.error||error?.message);const rows=data?.blocks||[];list.replaceChildren();if(!rows.length){const empty=document.createElement('div');empty.className='moderation-empty';empty.textContent='Nenhuma expulsão ativa no seu escopo.';list.appendChild(empty);return}for(const row of rows){const card=document.createElement('div');card.className='moderation-row';const info=document.createElement('div'),name=document.createElement('strong'),meta=document.createElement('small'),reason=document.createElement('small'),btn=document.createElement('button');name.textContent=row.student_name||'Aluno';meta.textContent=`${row.class_name||'Turma'} • retorno após ${new Date(row.blocked_until).toLocaleString('pt-BR')}`;reason.textContent=`Motivo: ${row.reason||'Não informado'}`;btn.type='button';btn.textContent='Readmitir agora';btn.onclick=()=>unblockStudent(row.student_id,row.student_name||'o aluno');info.append(name,meta,reason);card.append(info,btn);list.appendChild(card)}}catch(e){list.replaceChildren(Object.assign(document.createElement('div'),{className:'moderation-empty',textContent:'Não foi possível carregar as expulsões ativas.'}))}
}
async function unblockStudent(id,name){if(!confirm(`Readmitir ${name} no Lobby agora?`))return;try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'unblock',student_id:id}});if(error||data?.error)throw new Error(data?.error||error?.message);toast('Aluno readmitido no Lobby.');await loadModeration()}catch(e){toast(e.message==='student_out_of_scope'?'Aluno fora do seu escopo.':'Não foi possível readmitir o aluno.')}}
function interact(){
  if(state.nearStudent){
    if(isStaff()&&state.nearStudent.participant_role==='student')return openStaffTarget(state.nearStudent);
    emote('wave',isStaff()?state.nearStudent.student_id:null).then(()=>toast(`Você cumprimentou ${state.nearStudent?.display_name||'o participante'} 👋`));return;
  }
  if(!state.nearPortal)return;const z=state.nearPortal,ps=portalState(z);
  if(isStaff())return toast(ps.text);if(z.code!==state.currentClass?.code)return toast(`Você pode visitar ${z.label}, mas as atividades pertencem àquela turma.`);ps.open?showActivities():toast(ps.text);
}
function renderInteraction(){
  const b=$('interaction');if(state.nearStudent){b.classList.remove('hidden');$('interaction-title').textContent=`${isStaff()&&state.nearStudent.participant_role==='student'?'Interagir':'Cumprimentar'} — ${state.nearStudent.display_name}`;$('interaction-text').textContent=isStaff()&&state.nearStudent.participant_role==='student'?`${className(state.nearStudent.class_id)} • reações e moderação`:'Aproxime-se e pressione E para acenar.';$('interaction-button').textContent=isStaff()&&state.nearStudent.participant_role==='student'?'Opções':'Acenar 👋';return}
  if(!state.nearPortal){b.classList.add('hidden');return}const z=state.nearPortal,ps=portalState(z);b.classList.remove('hidden');$('interaction-title').textContent=`${z.portal.label} — ${z.label}`;$('interaction-text').textContent=ps.text;$('interaction-button').textContent=ps.open?'Abrir portal':'Ver estado';
}
function areaText(key){const z=zones.find(x=>x.key===key);return z?`Área ${z.label} — ${z.name}`:'Praça Central'}
function showZoneBanner(key){const title=areaText(key),wrap=$('zone-banner');$('zone-banner-title').textContent=title;wrap.classList.remove('hidden');clearTimeout(state.zoneTimer);state.zoneTimer=setTimeout(()=>wrap.classList.add('hidden'),2100)}
function cycleQuality(){const current=state.runtime?.getQuality?.()||'medium',next=current==='low'?'medium':current==='medium'?'high':'low';state.runtime?.setQuality?.(next)}

async function boot(){
  state.stopped=false;if(!await loadIdentity())return;
  await securityTelemetry('session.check','info',{role:state.profile?.role||'unknown',surface:'lobby-3d'});
  await loadActivities();showLogin(false);$('loading3d')?.classList.remove('ready');
  state.portalState=portalState;state.emoteRequested=kind=>emote(kind,state.nearStudent?.student_id||null);
  try{
    state.runtime=await createLobby3D({canvas:$('game3d'),zones,state,isStaff,className,onInteract:interact,onQualityChange:q=>{$('quality-button').textContent=q==='high'?'Alto':q==='low'?'Eco':'Médio'},onError:m=>toast(m),onAreaChange:showZoneBanner,onPlayerState:p=>{
      state.player.x=p.x;state.player.y=p.y;state.player.area=p.area;state.nearPortal=p.nearPortal;state.nearStudent=p.nearStudent;$('area-label').textContent=areaText(p.area);renderInteraction();presence();
    }});
    requestAnimationFrame(()=>setTimeout(()=>$('loading3d')?.classList.add('ready'),650));showZoneBanner(state.player.area);
  }catch(error){console.error(error);await securityTelemetry('client.webgl_init_failed','warning',{message:String(error?.message||error)});throw new Error('Não foi possível iniciar o Lobby 3D neste navegador.')}
  await presence(true);poll();
}

$('interaction-button').onclick=interact;$('touch-action').onclick=interact;$('activity-close').onclick=()=>$('activity-modal').classList.add('hidden');$('staff-student-close').onclick=()=>$('staff-student-modal').classList.add('hidden');$('staff-moderation-close').onclick=()=>$('staff-moderation-modal').classList.add('hidden');$('staff-moderation').onclick=loadModeration;$('kick-student').onclick=kickStudent;$('quality-button').onclick=cycleQuality;
document.querySelectorAll('[data-target-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.targetEmote,$('staff-student-modal').dataset.student).then(()=>toast('Interação enviada.')));document.querySelectorAll('[data-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.emote));
$('logout').onclick=async()=>{state.runtime?.stop?.();state.runtime=null;try{await supabase.functions.invoke('lobby-presence',{body:{action:'leave'}})}catch(_){}await supabase.auth.signOut();location.reload()};$('kicked-check').onclick=()=>location.reload();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadActivities().catch(()=>{})});setInterval(()=>loadActivities().catch(()=>{}),15000);
$('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter,mail=email($('email').value),password=$('password').value;if(!mail.endsWith(SCHOOL_EMAIL_DOMAIN))return msg(`Use o e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`,true);btn.disabled=true;msg('Entrando no campus 3D…');try{await signIn(mail,password);await securityTelemetry('auth.login_success','info',{surface:'lobby-3d'});await boot();msg()}catch(err){console.error(err);msg('E-mail ou senha inválidos. Aluno no primeiro acesso: use o CGM. Equipe: use a senha individual fornecida pelo administrador.',true);try{await supabase.auth.signOut()}catch(_){}}finally{btn.disabled=false}});
(async()=>{try{const {data:{session}}=await supabase.auth.getSession();if(session){await boot();return}}catch(e){console.warn(e)}showLogin(true)})();
console.info(`AGV Lobby DS ${LOBBY_VERSION} • P5.1.1 Hotfix de inicialização • presença protegida por Edge Function`);

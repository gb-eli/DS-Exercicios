import { supabase, NETWORK_TIMEOUT_MS } from './supabase.js?v=14.10.8.65';
import { SCHOOL_EMAIL_DOMAIN, ACTIVITY_URL, LOBBY_VERSION } from './config.js?v=14.10.8.65';
import { createLobby3D } from './lobby3d.js?v=14.10.8.65';
import { createLobbyLite } from './lobby-lite.js?v=14.10.8.65';
import { createValeLite } from './vale-lite.js?v=14.10.8.65';
import { createVale3D } from './vale3d.js?v=14.10.8.65';
import { VALE_BOUNDS, VALE_SPAWN, VALE_FAST_TRAVEL_STATIC, valePresenceToWorld, valeWorldToPresence } from './world/vale-silicio-shared.js?v=14.10.8.65';
import { loadValeRuntime } from './world/vale-silicio-data.js?v=14.10.8.65';
import { worldToPresence, presenceToWorld } from './world/campus-manifest.js?v=14.10.8.65';
import { CAMPUS_EXPERIENCES } from './world/campus-experiences.js?v=14.10.8.65';
import { createProximityChat } from './social/proximity-chat.js?v=14.10.8.65';
import { AVATAR_STYLE_PRESETS } from './characters/avatar-system.js?v=14.10.8.65';
import { CAMPUS_DESTINATION_MAP } from './world/campus-destinations.js?v=14.10.8.65';
import { CAMPUS_INTERIOR_MAP } from './world/campus-interiors.js?v=14.10.8.65';

const $=id=>document.getElementById(id);
const withTimeout=(promise,ms,code)=>{
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(code)),ms);})
  ]).finally(()=>clearTimeout(timer));
};
const AUTH_TIMEOUT_MS=11000;
const SESSION_TIMEOUT_MS=10000;
const COARSE_POINTER=matchMedia('(pointer:coarse)').matches;
const PRESENCE_INTERVAL_MS=COARSE_POINTER?8000:6000;
const POLL_INTERVAL_MS=COARSE_POINTER?9000:7000;
const state={
  user:null,profile:null,currentClass:null,classes:[],exercises:[],studentReleases:[],classReleases:[],progress:[],others:[],available:[],scheduled:[],
  player:{x:800,y:500,area:'central'},nearPortal:null,nearStudent:null,nearSeat:null,nearWorldObject:null,seated:false,interior:null,interiorFloor:null,lastPresence:0,toastTimer:null,zoneTimer:null,stopped:false,lastTargetSignal:'',runtime:null,
  portalState:null,emoteRequested:null,campusVisited:new Set(['central']),campusFlags:{greet:false,sit:false,action:false,monitor:false},localAction:null,runtimeMode:null,bootingRuntime:false,
  scene:'campus',savedCampusPlayer:null,valeVisited:new Set(),valeRuntime:null,selectedValeCompany:null,lastGatherToken:null,teleportDestinations:[],chatTarget:null,
  graphics:{fov:65,fpsCap:60,worldTimeMode:'auto',showPerf:false},avatarStyle:{...AVATAR_STYLE_PRESETS.casual}
};
const MODE_STORAGE_KEY='agv:lobby:mode-choice';
let challengeStatusTimer=null;
const saveModeChoice=mode=>{try{localStorage.setItem(MODE_STORAGE_KEY,mode)}catch(_){}};
const lastModeChoice=()=>{try{return localStorage.getItem(MODE_STORAGE_KEY)||'lite'}catch(_){return'lite'}};
const GRAPHICS_STORAGE_KEY='agv:lobby:graphics-v56',AVATAR_STORAGE_KEY='agv:lobby:avatar-v56';
const hexColor=(value,fallback='#36d2ff')=>/^#[0-9a-f]{6}$/i.test(String(value||''))?String(value):fallback;
function loadPersonalization(){try{const g=JSON.parse(localStorage.getItem(GRAPHICS_STORAGE_KEY)||'{}');state.graphics={...state.graphics,...g,fov:Math.max(45,Math.min(95,Number(g.fov)||65)),fpsCap:[30,45,60].includes(Number(g.fpsCap))?Number(g.fpsCap):60,worldTimeMode:['auto','day','night'].includes(g.worldTimeMode)?g.worldTimeMode:'auto',showPerf:!!g.showPerf};}catch(_){}try{const a=JSON.parse(localStorage.getItem(AVATAR_STORAGE_KEY)||'{}');state.avatarStyle={...state.avatarStyle,...a,accentCss:hexColor(a.accentCss,state.avatarStyle.accentCss)};}catch(_){}}
function savePersonalization(){try{localStorage.setItem(GRAPHICS_STORAGE_KEY,JSON.stringify(state.graphics));localStorage.setItem(AVATAR_STORAGE_KEY,JSON.stringify(state.avatarStyle));}catch(_){}}
loadPersonalization();
const VALE_VISITED_KEY='agv:lobby:vale-visited';
const valeLoad=()=>{try{const raw=JSON.parse(localStorage.getItem(VALE_VISITED_KEY)||'[]');state.valeVisited=new Set(Array.isArray(raw)?raw:[])}catch(_){state.valeVisited=new Set()}};
const valeSave=()=>{try{localStorage.setItem(VALE_VISITED_KEY,JSON.stringify([...state.valeVisited]))}catch(_){}};

const zones=[
  {key:'1ds',code:'1DS-A-MANHA',label:'1DS',name:'1ª Série DS',accent:'#36d2ff',portal:{label:'Laboratório 1DS'}},
  {key:'2ds',code:'2DS-A-MANHA',label:'2DS',name:'2ª Série DS',accent:'#51e7a3',portal:{label:'Laboratório 2DS'}},
  {key:'3ds',code:'3DS-C-MANHA',label:'3DS',name:'3ª Série DS',accent:'#b58cff',portal:{label:'Laboratório 3DS'}},
  {key:'sub',code:'DS-SUB-NOITE',label:'SUB',name:'DS Subsequente',accent:'#ffae63',portal:{label:'Laboratório SUB'}}
];
const isStaff=()=>['teacher','admin','super_admin'].includes(state.profile?.role);
const roleLabel=r=>r==='teacher'?'Professor':r==='super_admin'?'Super Admin':r==='admin'?'Administrador':'Aluno';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const email=v=>String(v||'').trim().toLowerCase();
const className=id=>state.classes.find(c=>c.id===id)?.name||'Outra turma';

function showLogin(on){$('login').classList.toggle('hidden',!on);$('game-shell').classList.toggle('hidden',on)}
function msg(t='',e=false){$('login-message').textContent=t;$('login-message').classList.toggle('error',e)}
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>e.classList.add('hidden'),3000)}

function dataOrThrow(result,code){
  if(result?.error){const error=new Error(code);error.cause=result.error;throw error;}
  return result?.data;
}
function lobbyErrorMessage(error){
  globalThis.__agvLobbyDiag?.record?.('lobby_error_message',{code:String(error?.message||'unknown').slice(0,100)});
  const text=String(error?.message||error?.cause?.message||'');
  if(/^Seu acesso|^Sua turma|^Perfil sem acesso/.test(text))return text;
  if(/timeout|abort|fetch|network|Failed to fetch|Load failed|profile_load_failed|classes_load_failed|membership_load_failed|class_load_failed|block_check_failed|activities_/i.test(text)){
    return 'Sua conta foi reconhecida, mas o Lobby não conseguiu concluir a conexão. Verifique a internet e tente novamente. As Atividades continuam disponíveis pelo Hub.';
  }
  if(/Invalid login credentials|invalid.*credentials|Email not confirmed|auth_/i.test(text))return 'E-mail ou senha inválidos. Aluno no primeiro acesso: use o CGM. Equipe: use a senha individual fornecida pelo administrador.';
  return 'Não foi possível iniciar o Lobby agora. Tente novamente ou acesse as Atividades pelo Hub.';
}
const modalReturnFocus=new WeakMap();
function focusableIn(root){return [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.offsetParent!==null);}
function openModal(id){const modal=$(id);if(!modal)return;if(modal.classList.contains('hidden'))modalReturnFocus.set(modal,document.activeElement);modal.classList.remove('hidden');queueMicrotask(()=>focusableIn(modal)[0]?.focus());}
function closeModal(id){const modal=$(id);if(!modal)return;modal.classList.add('hidden');const back=modalReturnFocus.get(modal);if(back?.isConnected)queueMicrotask(()=>back.focus());}
function currentModal(){return [...document.querySelectorAll('.modal:not(.hidden)')].at(-1)||null;}
document.addEventListener('keydown',event=>{
  const modal=currentModal();
  if(event.key==='Escape'){
    if(modal){event.preventDefault();closeModal(modal.id);return;}
    $('action-menu')?.classList.add('hidden');campusToggle?.(false);valeToggle?.(false);
    return;
  }
  if(event.key!=='Tab'||!modal)return;
  const items=focusableIn(modal);if(!items.length){event.preventDefault();return;}
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});

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
window.addEventListener('keydown',reportDevtoolsShortcut);window.addEventListener('keydown',e=>{if(e.code==='KeyR'&&!e.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){$('action-menu')?.classList.toggle('hidden');}});

function isCredentialError(error){return /Invalid login credentials|invalid.*credentials|User not found/i.test(String(error?.message||''));}
async function signIn(mail,password){
  const {error}=await withTimeout(supabase.auth.signInWithPassword({email:mail,password}),AUTH_TIMEOUT_MS,'auth_signin_timeout');if(!error)return;
  const cgm=/^\d{6,12}$/.test(password);if(!cgm||!isCredentialError(error))throw error;
  const {data,error:up}=await withTimeout(supabase.auth.signUp({email:mail,password,options:{data:{cgm:password},emailRedirectTo:location.href}}),AUTH_TIMEOUT_MS,'auth_signup_timeout');if(up)throw up;if(data?.session)return;
  const {error:again}=await withTimeout(supabase.auth.signInWithPassword({email:mail,password}),AUTH_TIMEOUT_MS,'auth_signin_timeout');if(again)throw again;
}
async function activeBlock(){
  if(state.profile?.role!=='student'||!state.user)return null;
  const result=await supabase.from('lobby_blocks').select('blocked_until,reason').eq('student_id',state.user.id).gt('blocked_until',new Date().toISOString()).maybeSingle();const data=dataOrThrow(result,'block_check_failed');return data||null;
}
function showKicked(block){
  state.stopped=true;state.runtime?.stop?.();state.runtime=null;
  $('game-shell').classList.add('hidden');$('login').classList.add('hidden');$('kicked').classList.remove('hidden');
  $('kicked-reason').textContent=block?.reason||'Você foi removido temporariamente do Lobby pela equipe.';
  $('kicked-until').textContent=block?.blocked_until?`Retorno permitido após ${new Date(block.blocked_until).toLocaleString('pt-BR')}.`:'Aguarde a liberação da equipe.';
}
async function loadIdentity(){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'identity_loading'});
  const {data:{user}}=await withTimeout(supabase.auth.getUser(),SESSION_TIMEOUT_MS,'auth_user_timeout');if(!user)return false;
  const p=dataOrThrow(await supabase.from('profiles').select('id,full_name,email,role,active,must_change_password').eq('id',user.id).single(),'profile_load_failed');
  if(!p.active)throw new Error('Seu acesso está inativo.');
  if(p.must_change_password){location.href='../atividades/';return false}
  if(!['student','teacher','admin','super_admin'].includes(p.role))throw new Error('Perfil sem acesso ao Lobby.');
  state.user=user;state.profile=p;window.AGVFullscreen?.require(p.role==='student');
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'profile_loaded'});
  const all=dataOrThrow(await supabase.from('classes').select('id,code,name,shift,school_year').in('code',zones.map(z=>z.code)).eq('active',true),'classes_load_failed');state.classes=all||[];
  if(p.role==='student'){
    const m=dataOrThrow(await supabase.from('class_memberships').select('class_id').eq('user_id',user.id).eq('active',true).order('is_primary',{ascending:false}).limit(1),'membership_load_failed');if(!m?.length)throw new Error('Sua turma ainda não foi vinculada.');
    const cls=dataOrThrow(await supabase.from('classes').select('id,code,name,shift,school_year').eq('id',m[0].class_id).single(),'class_load_failed');state.currentClass=cls;
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
  const cid=state.currentClass.id,cs=dataOrThrow(await supabase.from('class_subjects').select('subject_id').eq('class_id',cid).eq('active',true),'activities_subjects_failed'),ids=(cs||[]).map(x=>x.subject_id);
  if(!ids.length){state.exercises=[];state.available=[];state.scheduled=[];updateActivityHUD();return}
  const [exResult,srResult,crResult,prResult]=await Promise.all([
    supabase.from('exercises').select('id,class_id,subject_id,exercise_number,title,description,version,default_locked').in('subject_id',ids).eq('active',true).eq('visible',true).order('exercise_number'),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').eq('student_id',state.user.id).order('updated_at',{ascending:false}),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').is('student_id',null).eq('class_id',cid).order('updated_at',{ascending:false}),
    supabase.from('student_exercises').select('exercise_id,status,progress_percent,security_locked,security_lock_reason,completed_at').eq('student_id',state.user.id)
  ]);
  const ex=dataOrThrow(exResult,'activities_exercises_failed'),sr=dataOrThrow(srResult,'activities_student_release_failed'),cr=dataOrThrow(crResult,'activities_class_release_failed'),pr=dataOrThrow(prResult,'activities_progress_failed');
  const uniq=rows=>{const s=new Set();return(rows||[]).filter(r=>!s.has(r.exercise_id)&&s.add(r.exercise_id))};
  state.exercises=(ex||[]).filter(e=>!e.class_id||e.class_id===cid);state.studentReleases=uniq(sr);state.classReleases=uniq(cr);state.progress=pr||[];
  state.available=state.exercises.filter(e=>releaseState(e).available);state.scheduled=state.exercises.map(ex=>({ex,s:releaseState(ex)})).filter(x=>!x.s.available&&x.s.releaseAt).sort((a,b)=>Date.parse(a.s.releaseAt)-Date.parse(b.s.releaseAt));updateActivityHUD();
}
function portalState(z){
  if(isStaff())return{open:false,text:`${z.label}: circulação e observação liberadas. Liberações pedagógicas continuam no painel.`};
  if(z.code!==state.currentClass?.code)return{open:false,text:`Você pode visitar ${z.label}; as atividades são exclusivas da turma.`};
  if(state.available.length)return{open:true,text:`${state.available.length} atividade${state.available.length===1?'':'s'} liberada${state.available.length===1?'':'s'}.`};
  const n=state.scheduled[0];if(n)return{open:false,text:`Próxima abertura: ${new Date(n.s.releaseAt).toLocaleString('pt-BR')}.`};
  return{open:false,text:'Portal fechado. Aguardando o professor liberar uma atividade.'};
}
function activitySummary(){const count=state.available.length,next=state.scheduled[0];if(count)return{kind:'available',title:`${count} atividade${count===1?'':'s'} liberada${count===1?'':'s'}`,text:'A atividade está disponível. O portal da sua turma foi destacado.'};if(next)return{kind:'scheduled',title:'Atividade programada',text:`Abertura real: ${new Date(next.s.releaseAt).toLocaleString('pt-BR')}.`};return{kind:'waiting',title:'Lobby de espera',text:'Explore o Campus enquanto aguarda a liberação do professor.'};}
function updateActivityHUD(){const info=activitySummary(),button=$('activity-button'),strip=$('waiting-strip'),title=strip?.querySelector('strong'),text=$('waiting-strip-text');if(title)title.textContent=info.title;if(text)text.textContent=info.text;if(button){button.classList.toggle('hidden',info.kind!=='available');button.textContent=state.available.length>1?`Atividades (${state.available.length})`:'Abrir atividade';}strip?.setAttribute('data-activity-state',info.kind);document.querySelector('.game-stage')?.setAttribute('data-activity-state',info.kind);}
async function presence(force=false,target=null,emote=null){
  if(!state.user||state.stopped)return;
  const n=performance.now();if(!force&&n-state.lastPresence<PRESENCE_INTERVAL_MS)return;state.lastPresence=n;
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
  if(document.hidden){setTimeout(poll,POLL_INTERVAL_MS);return;}
  try{
    const cutoff=new Date(Date.now()-20000).toISOString(),{data}=await supabase.from('lobby_presence').select('student_id,class_id,display_name,participant_role,x,y,area,emote,emote_until,interaction_target_id,updated_at').gt('updated_at',cutoff);
    state.others=(data||[]).filter(x=>x.student_id!==state.user.id);$('online-count').textContent=`${state.others.length+1} online`;
    const sig=state.others.find(x=>x.interaction_target_id===state.user.id&&x.emote&&Date.parse(x.emote_until||0)>Date.now());
    if(sig){const key=`${sig.student_id}:${sig.emote_until}`;if(key!==state.lastTargetSignal){state.lastTargetSignal=key;toast(`${sig.display_name} enviou ${sig.emote==='wave'?'👋':sig.emote==='like'?'👍':'✨'} para você.`)}}
    if(state.profile?.role==='student'){const b=await activeBlock();if(b){showKicked(b);return}}
  }catch(_){}finally{if(!state.stopped)setTimeout(poll,POLL_INTERVAL_MS)}
}
function showActivities(){
  if(!state.available.length){toast('O portal ainda está fechado pelo professor.');return}
  const stage=document.querySelector('.game-stage');stage?.classList.add('portal-travel');setTimeout(()=>stage?.classList.remove('portal-travel'),620);
  $('activity-title').textContent=`Atividades liberadas — ${state.currentClass.name}`;$('activity-subtitle').textContent='Escolha uma atividade para atravessar o portal.';
  $('activity-list').innerHTML=state.available.map(ex=>{const p=state.progress.find(x=>x.exercise_id===ex.id),st=p?.status==='completed'?'Concluída':p?.status==='in_progress'?`${Math.round(Number(p.progress_percent||0))}% em andamento`:'Disponível';return `<article class="activity"><span class="num">${String(ex.exercise_number).padStart(2,'0')}</span><div><strong>${esc(ex.title)}</strong><small>${esc(st)}</small></div><button class="primary" data-exercise="${esc(ex.id)}" type="button">Entrar</button></article>`}).join('');
  $('activity-list').querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>{const ex=state.exercises.find(x=>x.id===b.dataset.exercise);if(!ex||!releaseState(ex).available)return toast('A atividade não está liberada.');location.href=`${ACTIVITY_URL}?exercise=${encodeURIComponent(ex.id)}&from=lobby`});
  openModal('activity-modal');
}
function openStaffTarget(o){if(!isStaff()||o?.participant_role!=='student')return;$('student-name').textContent=o.display_name||'Aluno';$('student-context').textContent=`Aluno online • ${className(o.class_id)}`;$('staff-student-modal').dataset.student=o.student_id;$('kick-reason').value='';$('kick-duration').value='15';openModal('staff-student-modal')}
async function kickStudent(){
  const id=$('staff-student-modal').dataset.student,btn=$('kick-student');if(!id)return;const name=$('student-name').textContent||'este aluno',mins=Number($('kick-duration').value)||15,reason=$('kick-reason').value.trim();
  if(!confirm(`Expulsar ${name} do Lobby por ${mins} minuto${mins===1?'':'s'}?\n\nA conta, a matrícula e as atividades não serão afetadas.`))return;btn.disabled=true;
  try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'kick',student_id:id,duration_minutes:mins,reason}});if(error||data?.error)throw new Error(data?.error||error?.message);closeModal('staff-student-modal');toast(`Aluno removido até ${new Date(data.blocked_until).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}.`)}catch(e){toast(e.message==='student_out_of_scope'?'Você só pode expulsar alunos das suas turmas.':'Não foi possível remover o aluno.')}finally{btn.disabled=false}
}
async function loadModeration(){
  if(!isStaff())return;const list=$('moderation-list');list.replaceChildren(Object.assign(document.createElement('p'),{className:'muted',textContent:'Carregando…'}));openModal('staff-moderation-modal');
  try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'list_blocks'}});if(error||data?.error)throw new Error(data?.error||error?.message);const rows=data?.blocks||[];list.replaceChildren();if(!rows.length){const empty=document.createElement('div');empty.className='moderation-empty';empty.textContent='Nenhuma expulsão ativa no seu escopo.';list.appendChild(empty);return}for(const row of rows){const card=document.createElement('div');card.className='moderation-row';const info=document.createElement('div'),name=document.createElement('strong'),meta=document.createElement('small'),reason=document.createElement('small'),btn=document.createElement('button');name.textContent=row.student_name||'Aluno';meta.textContent=`${row.class_name||'Turma'} • retorno após ${new Date(row.blocked_until).toLocaleString('pt-BR')}`;reason.textContent=`Motivo: ${row.reason||'Não informado'}`;btn.type='button';btn.textContent='Readmitir agora';btn.onclick=()=>unblockStudent(row.student_id,row.student_name||'o aluno');info.append(name,meta,reason);card.append(info,btn);list.appendChild(card)}}catch(e){list.replaceChildren(Object.assign(document.createElement('div'),{className:'moderation-empty',textContent:'Não foi possível carregar as expulsões ativas.'}))}
}
async function unblockStudent(id,name){if(!confirm(`Readmitir ${name} no Lobby agora?`))return;try{const {data,error}=await supabase.functions.invoke('lobby-moderation',{body:{action:'unblock',student_id:id}});if(error||data?.error)throw new Error(data?.error||error?.message);toast('Aluno readmitido no Lobby.');await loadModeration()}catch(e){toast(e.message==='student_out_of_scope'?'Aluno fora do seu escopo.':'Não foi possível readmitir o aluno.')}}



let proximityChat=null;
function appendChatLine(kind,name,message){const log=$('chat-log');if(!log)return;const row=document.createElement('div');row.className=`chat-line ${kind}`;const who=document.createElement('strong'),text=document.createElement('span');who.textContent=name;text.textContent=message;row.append(who,text);log.append(row);while(log.children.length>12)log.firstElementChild?.remove();log.scrollTop=log.scrollHeight;}
function ensureProximityChat(){if(proximityChat)return proximityChat;proximityChat=createProximityChat({supabase,state,onMessage:chat=>{state.runtime?.showChatMessage?.(chat.sender_id,chat.message);const name=chat.sender?.display_name||'Participante';if(state.chatTarget?.student_id===chat.sender_id)appendChatLine('remote',name,chat.message);else toast(`💬 ${name}: ${chat.message}`);},onError:error=>console.warn('Chat por proximidade:',error)});proximityChat.ensure().catch(()=>{});return proximityChat;}
function openChatWith(person){if(!person?.student_id)return;state.chatTarget=person;$('chat-target-label').textContent=`Conversando com ${person.display_name||'participante'} • permaneçam próximos`;$('chat-log').replaceChildren();appendChatLine('system','Campus DS','Chat local aberto. Mensagens são curtas e temporárias.');openModal('chat-modal');ensureProximityChat();queueMicrotask(()=>$('chat-input')?.focus());}
async function sendProximityChat(){const input=$('chat-input'),target=state.chatTarget,text=String(input?.value||'').trim();if(!target?.student_id||!text)return;const button=$('chat-form')?.querySelector('button[type="submit"]');if(button)button.disabled=true;try{await presence(true);const result=await ensureProximityChat().send(text,target.student_id);state.runtime?.showChatMessage?.(state.user.id,result.text);appendChatLine('local','Você',result.text);input.value='';campusMark('greet');}catch(error){console.error(error);toast(String(error?.message||'').includes('participant_not_nearby')?'Chegue mais perto para conversar.':'Não foi possível enviar a mensagem agora.');}finally{if(button)button.disabled=false;}}

const CAMPUS_TELEPORTS=Object.freeze([
  {id:'campus:central',scene:'campus',name:'Praça Central',x:0,z:0,kind:'landmark',district:'Campus DS'},
  {id:'campus:vale',scene:'campus',name:'Portal do Vale do Silício AGV',x:0,z:-12.5,kind:'portal',district:'Campus DS'},
  {id:'campus:1ds',scene:'campus',name:'1DS — Laboratório',x:-22.5,z:-10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:2ds',scene:'campus',name:'2DS — Laboratório',x:22.5,z:-10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:3ds',scene:'campus',name:'3DS — Laboratório',x:-22.5,z:10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:sub',scene:'campus',name:'SUB — Laboratório',x:22.5,z:10.2,kind:'laboratory',district:'Campus DS'},
  ...CAMPUS_EXPERIENCES.filter(item=>item.type!=='vale-portal').map(item=>({id:`campus:${item.id}`,scene:'campus',name:item.name,x:item.entrance?.x??item.x,z:item.entrance?.z??item.z,kind:item.type,district:item.district||'Campus DS'}))
]);
function companyTeleportPoint(c){const pos=c?.lot?.world_position||{x:0,z:0},fp=c?.building?.footprint||{},width=Number(fp.width||24),depth=Number(fp.depth||20),rot=Number(c?.lot?.rotation_y_deg||0)*Math.PI/180,dist=(Math.abs(Math.sin(rot))*width+Math.abs(Math.cos(rot))*depth)/2+6;return{x:Number(pos.x||0)+Math.sin(rot)*dist,z:Number(pos.z||0)+Math.cos(rot)*dist};}
async function getTeleportDestinations(){
  const list=[...CAMPUS_TELEPORTS];
  try{
    const runtime=await loadValeRuntime();
    list.push(...VALE_FAST_TRAVEL_STATIC.map(d=>({...d,id:`vale:${d.id}`,scene:'vale',district:'Vale do Silício AGV'})));
    for(const d of runtime.world?.districts||[])list.push({id:`vale:district:${d.id}`,scene:'vale',name:d.name,x:Number(d.center?.x||0),z:Number(d.center?.z||0),kind:'district',district:'Vale do Silício AGV'});
    for(const c of runtime.companies||[]){const e=companyTeleportPoint(c);list.push({id:`vale:company:${c.id}`,scene:'vale',name:c.display_name||c.company_name||c.project_name,x:e.x,z:e.z,kind:'company',district:c.zone||'Empresa estudantil',companyId:c.id});}
  }catch(error){console.warn('Destinos completos do Vale indisponíveis:',error);list.push({id:'vale:praca-fallback',scene:'vale',name:'Vale do Silício AGV — Praça Central',x:VALE_SPAWN.x,z:VALE_SPAWN.z,kind:'landmark',district:'Vale do Silício AGV'});}
  state.teleportDestinations=list;return list;
}
function teleportSceneLabel(scene){return scene==='vale'?'Vale do Silício AGV':'Campus DS';}
async function teleportToDestination(destination,{fromGather=false}={}){
  if(!destination||state.bootingRuntime)return false;
  const scene=destination.scene==='vale'?'vale':'campus',world={x:Number(destination.x)||0,z:Number(destination.z)||0};
  const mode=state.runtimeMode||'lite';
  const stage=document.querySelector('.game-stage');stage?.classList.add('teleport-travel');setTimeout(()=>stage?.classList.remove('teleport-travel'),620);
  if(scene!==state.scene){
    if(scene==='vale'&&state.scene==='campus')state.savedCampusPlayer={...state.player};
    if(scene==='campus')state.savedCampusPlayer=null;
    state.scene=scene;state.interior=null;state.interiorFloor=null;state.nearPortal=null;state.nearStudent=null;state.nearWorldObject=null;
    const pp=scene==='vale'?valeWorldToPresence(world.x,world.z):worldToPresence(world.x,world.z);
    state.player={...state.player,x:pp.x,y:pp.y,area:scene==='vale'?'vale-silicio':'central'};document.body.dataset.scene=scene;
    if(mode==='3d')await start3D({allowFallback:true});else await startLite(fromGather?'staff_gather_scene_switch':'teleport_scene_switch');
  }else{
    const pp=scene==='vale'?valeWorldToPresence(world.x,world.z):worldToPresence(world.x,world.z);state.player.x=pp.x;state.player.y=pp.y;state.player.area=scene==='vale'?'vale-silicio':(destination.area||state.player.area||'central');
    if(!state.runtime?.teleportTo?.({...destination,...world})){
      if(mode==='3d')await start3D({allowFallback:true});else await startLite('teleport_runtime_refresh');
    }
  }
  await new Promise(resolve=>requestAnimationFrame(()=>resolve()));await presence(true);showZoneBanner(scene==='vale'?'vale-silicio':(destination.area||state.player.area||'central'));
  if(!fromGather)toast(`⚡ Teletransporte: ${destination.name}`);
  return true;
}
function userScatterOffset(scene){const id=String(state.user?.id||'0');let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;const angle=(h%360)*Math.PI/180,dist=scene==='vale'?4.2:1.35;return{x:Math.cos(angle)*dist,z:Math.sin(angle)*dist};}
async function teleportToGatherTarget(target){
  if(!target)return false;const scene=target.scene==='vale'?'vale':'campus',base=scene==='vale'?valePresenceToWorld(target.x,target.y):presenceToWorld(target.x,target.y),offset=userScatterOffset(scene),destination={id:'staff-gather',scene,name:'Ponto do professor',x:base.x+offset.x,z:base.z+offset.z,kind:'staff'};
  await teleportToDestination(destination,{fromGather:true});
  if(target.interior){let entered=false;if(scene==='vale')entered=state.runtime?.enterBuilding?.(target.interior);else if(String(target.interior).startsWith('tool:'))entered=state.runtime?.enterToolInterior?.(String(target.interior).slice(5));else entered=state.runtime?.enterInterior?.(target.interior);if(entered)state.interior=target.interior;}
  await presence(true);toast('📍 A equipe reuniu a turma neste ponto.');return true;
}
let gatherChannel=null,gatherReadyPromise=null;
function ensureGatherChannel(){
  if(gatherReadyPromise)return gatherReadyPromise;
  gatherReadyPromise=new Promise(resolve=>{
    try{
      gatherChannel=supabase.channel('agv-lobby-staff-gather-v1').on('broadcast',{event:'staff-gather'},async message=>{
        if(state.profile?.role!=='student'||state.stopped)return;const token=String(message?.payload?.token||'');if(!token||token===state.lastGatherToken)return;
        try{const {data,error}=await supabase.functions.invoke('lobby-presence',{body:{action:'verify_gather',token}});if(error||!data?.ok||!data?.target)return;state.lastGatherToken=token;await teleportToGatherTarget(data.target);}catch(error){console.warn('Comando de reunião inválido/expirado:',error);}
      }).subscribe(status=>{globalThis.__agvLobbyDiag?.record?.('staff_gather_channel',{status});if(status==='SUBSCRIBED')resolve(true);else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))resolve(false);});
      setTimeout(()=>resolve(false),4500);
    }catch(error){console.warn('Canal de reunião indisponível:',error);resolve(false);}
  });return gatherReadyPromise;
}
async function bringAllStudentsToMe(){
  if(!isStaff())return;const button=$('staff-bring-all');if(button)button.disabled=true;
  try{
    const ready=await ensureGatherChannel();if(!ready||!gatherChannel)throw new Error('gather_channel_unavailable');await presence(true);
    const {data,error}=await supabase.functions.invoke('lobby-presence',{body:{action:'issue_gather',scene:state.scene,x:Math.round(state.player.x),y:Math.round(state.player.y),area:state.player.area,interior:state.interior||null}});if(error||!data?.token)throw new Error(data?.error||error?.message||'gather_token_failed');
    const sent=await gatherChannel.send({type:'broadcast',event:'staff-gather',payload:{token:data.token}});if(sent!=='ok'&&sent!==undefined)throw new Error(`gather_broadcast_${sent}`);
    const count=state.others.filter(o=>o.participant_role==='student').length;toast(`📍 Chamado enviado para ${count} aluno${count===1?'':'s'} online. Eles serão trazidos até você.`);closeModal('teleport-modal');
  }catch(error){console.error(error);toast('Não foi possível reunir a turma agora. Verifique a conexão e tente novamente.');}finally{if(button)button.disabled=false;}
}
function teleportFilterLabel(kind){return({landmark:'Ponto importante',portal:'Portal',laboratory:'Laboratório',parkour:'Parkour',pool:'Piscina',playground:'Parquinho',slide:'Escorregador',coaster:'Trilho',tower:'Mirante',environment:'Ambiente',sport:'Esporte',mobility:'Mobilidade',district:'Distrito',company:'Empresa'}[kind]||kind||'Destino');}
async function renderTeleportModal(){
  const list=$('teleport-list'),search=$('teleport-search'),sceneFilter=$('teleport-scene-filter');if(!list)return;list.innerHTML='<p class="muted">Carregando destinos…</p>';
  const destinations=state.teleportDestinations.length?state.teleportDestinations:await getTeleportDestinations(),query=String(search?.value||'').trim().toLowerCase(),filter=sceneFilter?.value||'all';
  const rows=destinations.filter(d=>(filter==='all'||d.scene===filter)&&(!query||`${d.name} ${d.district||''} ${teleportFilterLabel(d.kind)}`.toLowerCase().includes(query)));list.replaceChildren();
  if(!rows.length){list.innerHTML='<p class="muted">Nenhum destino encontrado.</p>';return;}
  for(const d of rows){const row=document.createElement('button');row.type='button';row.className='teleport-destination';const icon=document.createElement('span');icon.className='teleport-icon';icon.textContent=d.scene==='vale'?'🏙':'⚡';const copy=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small'),go=document.createElement('b');title.textContent=d.name;meta.textContent=`${teleportSceneLabel(d.scene)} • ${teleportFilterLabel(d.kind)}${d.district?` • ${d.district}`:''}`;go.textContent='IR';copy.append(title,meta);row.append(icon,copy,go);row.onclick=async()=>{row.disabled=true;try{closeModal('teleport-modal');await teleportToDestination(d);}finally{row.disabled=false;}};list.append(row);}
}
function openTeleportModal(){const panel=$('staff-teleport-panel');panel?.classList.toggle('hidden',!isStaff());openModal('teleport-modal');renderTeleportModal().catch(error=>{console.error(error);$('teleport-list').innerHTML='<p class="muted">Não foi possível carregar os destinos agora.</p>';});}


function renderTrainStations(){const list=$('train-station-list');if(!list)return;const stations=state.runtime?.getTrainStations?.()||[];list.replaceChildren();if(!stations.length){list.innerHTML='<p class="muted">O monotrilho está disponível no Campus DS.</p>';return;}for(const station of stations){const row=document.createElement('button');row.type='button';row.className='train-station';row.innerHTML=`<span>🚉</span><div><strong>${esc(station.name)}</strong><small>${station.id==='vale'?'Conexão direta com o Portal do Vale':'Estação do Campus DS'}</small></div><b>EMBARCAR</b>`;row.onclick=()=>{const ok=state.runtime?.startTrainTo?.(station.id);if(ok){closeModal('train-modal');toast(`🚆 Monotrilho para ${station.name}.`);}else toast('Não foi possível iniciar esta viagem.');};list.append(row);}}
function openTrainModal(showPanoramic=false){if(state.scene!=='campus')return toast('O Monotrilho AGV opera no Campus DS. Use o teletransporte para voltar ao Campus.');$('train-panoramic')?.classList.toggle('hidden',!showPanoramic);openModal('train-modal');renderTrainStations();}
function syncWorldSettingsForm(){const g=state.graphics,a=state.avatarStyle;$('world-time-mode').value=g.worldTimeMode;$('fps-cap').value=String(g.fpsCap);$('show-perf').checked=!!g.showPerf;$('fov-range').value=String(g.fov);$('fov-value').textContent=`${g.fov}°`;$('avatar-accent').value=hexColor(a.accentCss,'#36d2ff');for(const [id,key,fallback] of[['avatar-skin','skin','#d99b72'],['avatar-hair','hair','#171719'],['avatar-pants','pants','#202731'],['avatar-shoes','shoes','#e8ecef']]){const value=a[key];$(id).value=typeof value==='number'?`#${value.toString(16).padStart(6,'0').slice(-6)}`:hexColor(value,fallback);}for(const key of['backpack','glasses','headset','wrist'])$(`avatar-${key}`).checked=!!a[key];$('avatar-hair-style').value=a.hairStyle||'soft';}
function openWorldSettings(){syncWorldSettingsForm();openModal('world-settings-modal');}
function colorNumber(value,fallback){const text=String(value||'').replace('#','');return /^[0-9a-f]{6}$/i.test(text)?parseInt(text,16):fallback;}
async function applyWorldSettings(){const oldAvatar=JSON.stringify(state.avatarStyle);state.graphics={fov:Number($('fov-range').value)||65,fpsCap:Number($('fps-cap').value)||60,worldTimeMode:$('world-time-mode').value,showPerf:$('show-perf').checked};state.avatarStyle={...state.avatarStyle,accentCss:hexColor($('avatar-accent').value),skin:colorNumber($('avatar-skin').value,0xd99b72),hair:colorNumber($('avatar-hair').value,0x171719),pants:colorNumber($('avatar-pants').value,0x202731),shoes:colorNumber($('avatar-shoes').value,0xe8ecef),backpack:$('avatar-backpack').checked,glasses:$('avatar-glasses').checked,headset:$('avatar-headset').checked,wrist:$('avatar-wrist').checked,hairStyle:$('avatar-hair-style').value};savePersonalization();state.runtime?.setWorldTimeMode?.(state.graphics.worldTimeMode);state.runtime?.setFPSCap?.(state.graphics.fpsCap);state.runtime?.setFov?.(state.graphics.fov);$('perf-badge')?.classList.toggle('hidden',!state.graphics.showPerf);closeModal('world-settings-modal');if(state.runtimeMode==='3d'&&oldAvatar!==JSON.stringify(state.avatarStyle)){toast('Aplicando visual do personagem…');await start3D({allowFallback:true});}else toast('Configurações aplicadas.');}
function applyAvatarPreset(name){const preset=AVATAR_STYLE_PRESETS[name];if(!preset)return;state.avatarStyle={...state.avatarStyle,...preset};syncWorldSettingsForm();}
function updateWorldClock(info={}){const el=$('world-clock');if(!el)return;const icon=info.phase==='night'?'🌙':info.phase==='dusk'?'🌇':'☀️';el.textContent=`${icon} ${info.clock||'--:--'}`;el.title=`Campus • ${info.label||'Atmosfera'} • ${state.graphics.worldTimeMode==='auto'?'automático':state.graphics.worldTimeMode}`;}

const CAMPUS_TASKS=[
  {id:'area1',title:'Visitar 1DS',desc:'Passe pela área da 1ª Série DS.',done:()=>state.campusVisited.has('1ds')},
  {id:'area2',title:'Visitar 2DS',desc:'Passe pela área da 2ª Série DS.',done:()=>state.campusVisited.has('2ds')},
  {id:'area3',title:'Visitar 3DS',desc:'Passe pela área da 3ª Série DS.',done:()=>state.campusVisited.has('3ds')},
  {id:'areasub',title:'Visitar SUB',desc:'Passe pela área do DS Subsequente.',done:()=>state.campusVisited.has('sub')},
  {id:'greet',title:'Cumprimentar alguém',desc:'Aproxime-se de outro participante e use a interação.',done:()=>state.campusFlags.greet},
  {id:'sit',title:'Descansar na praça',desc:'Sente em um dos bancos da Praça Central.',done:()=>state.campusFlags.sit},
  {id:'monitor',title:'Falar com um monitor',desc:'Encontre um monitor virtual e pressione E.',done:()=>state.campusFlags.monitor}
];
function campusSave(){try{localStorage.setItem('agv:p55:campus',JSON.stringify({visited:[...state.campusVisited],flags:state.campusFlags}))}catch(_){}}
function campusLoad(){try{const x=JSON.parse(localStorage.getItem('agv:p55:campus')||'{}');for(const a of x.visited||[])state.campusVisited.add(a);Object.assign(state.campusFlags,x.flags||{})}catch(_){}}
function renderCampus(){
  const list=$('campus-checklist');if(!list)return;list.replaceChildren();let done=0;
  for(const t of CAMPUS_TASKS){
    const ok=!!t.done();if(ok)done++;const row=document.createElement('div');row.className='campus-task'+(ok?' done':'');const badge=document.createElement('b');badge.textContent=ok?'✓':'•';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=t.title;const desc=document.createElement('small');desc.textContent=t.desc;info.append(title,desc);row.append(badge,info);list.append(row);
  }
  const pct=Math.round(done/CAMPUS_TASKS.length*100);$('campus-progress-text').textContent=`${done}/${CAMPUS_TASKS.length}`;$('campus-progress-bar').style.width=`${pct}%`;if(done===CAMPUS_TASKS.length)$('campus-message').textContent='Campus explorado! Esta conquista é apenas local e não concede benefícios automáticos.';
  const destinationList=$('campus-destination-list');if(!destinationList)return;destinationList.replaceChildren();
  const categoryOrder={academic:0,economy:1,gamer:2};const destinations=Object.values(CAMPUS_DESTINATION_MAP).sort((a,b)=>(categoryOrder[a.category]??9)-(categoryOrder[b.category]??9)||String(a.name).localeCompare(String(b.name),'pt-BR'));
  for(const destination of destinations){
    const row=document.createElement('button');row.type='button';row.className='campus-destination';row.dataset.category=destination.category||'academic';row.style.setProperty('--destination-accent',destination.accent||'#36d2ff');
    const icon=document.createElement('span');icon.className='icon';icon.textContent=destination.icon||'◆';const info=document.createElement('span');const title=document.createElement('strong');title.textContent=destination.name;const meta=document.createElement('small');meta.textContent=`${destination.district||'Campus DS'} • ${destination.subtitle||'Acesso conectado'}`;const travel=document.createElement('span');travel.className='travel';travel.textContent='IR';info.append(title,meta);row.append(icon,info,travel);
    row.onclick=()=>{const point=destination.entrance||destination;campusToggle(false);Promise.resolve(teleportToDestination({id:`campus:${destination.id}`,scene:'campus',name:destination.name,x:point.x,z:point.z,kind:'tool-building',district:destination.district||'Campus DS'})).catch(error=>{console.error(error);toast('Não foi possível chegar ao prédio agora.');});};destinationList.append(row);
  }
}
function campusMark(type,value=true){if(type==='area'){state.campusVisited.add(value)}else if(type in state.campusFlags){state.campusFlags[type]=value}campusSave();renderCampus()}
function campusToggle(force){const d=$('campus-drawer');if(!d)return;const open=force??d.classList.contains('hidden');d.classList.toggle('hidden',!open);if(open){$('action-menu')?.classList.add('hidden');renderCampus()}}
function valeToggle(force){const d=$('vale-drawer');if(!d)return;const open=force??d.classList.contains('hidden');d.classList.toggle('hidden',!open);if(open){$('action-menu')?.classList.add('hidden');renderValeDrawer();}}
let valeMiniLast=0;
function renderValeMinimap(force=false){
  const canvas=$('vale-minimap');if(!canvas)return;const visible=state.scene==='vale'&&state.runtimeMode==='3d'&&!state.interior;canvas.classList.toggle('hidden',!visible);if(!visible)return;const now=performance.now();if(!force&&now-valeMiniLast<120)return;valeMiniLast=now;const rect=canvas.getBoundingClientRect(),w=Math.max(120,Math.floor(rect.width||160)),h=Math.max(120,Math.floor(rect.height||160)),dpr=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const c=canvas.getContext('2d');if(!c)return;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.fillStyle='rgba(3,12,18,.88)';c.fillRect(0,0,w,h);const pad=10,map=(x,z)=>({x:pad+(Number(x)-VALE_BOUNDS.minX)/(VALE_BOUNDS.maxX-VALE_BOUNDS.minX)*(w-pad*2),y:pad+(Number(z)-VALE_BOUNDS.minZ)/(VALE_BOUNDS.maxZ-VALE_BOUNDS.minZ)*(h-pad*2)});c.strokeStyle='rgba(114,230,255,.18)';c.lineWidth=1;c.beginPath();c.moveTo(w/2,pad);c.lineTo(w/2,h-pad);c.moveTo(pad,h/2);c.lineTo(w-pad,h/2);c.stroke();for(const d of valeDestinations()){if(d.kind==='company'&&!state.valeVisited.has(d.companyId))continue;const q=map(d.x,d.z);c.fillStyle=d.kind==='company'?'rgba(81,231,163,.75)':d.kind==='district'?'rgba(114,230,255,.52)':d.kind==='sport'?'rgba(52,211,153,.7)':'rgba(251,191,36,.7)';c.fillRect(q.x-1.5,q.y-1.5,3,3);}for(const o of state.others||[]){if(o.area!=='vale-silicio')continue;const wp=valePresenceToWorld(o.x,o.y),q=map(wp.x,wp.z);c.fillStyle='#ffd166';c.beginPath();c.arc(q.x,q.y,2.1,0,Math.PI*2);c.fill();}const wp=valePresenceToWorld(state.player.x,state.player.y),q=map(wp.x,wp.z);c.fillStyle='#36d2ff';c.beginPath();c.arc(q.x,q.y,4,0,Math.PI*2);c.fill();c.strokeStyle='rgba(54,210,255,.55)';c.beginPath();c.arc(q.x,q.y,7,0,Math.PI*2);c.stroke();c.fillStyle='rgba(231,250,255,.88)';c.font='800 9px Inter,system-ui,sans-serif';c.textAlign='left';c.fillText('VALE',8,11);}
function valeDestinations(){return state.runtime?.getDestinations?.()||[];}
function renderValeDrawer(){
  const list=$('vale-destination-list'),filters=$('vale-filter-row'),search=$('vale-search');if(!list||!filters)return;
  const destinations=valeDestinations(),query=String(search?.value||'').trim().toLowerCase(),kinds=[...new Set(destinations.map(x=>x.kind||'outro'))];
  const active=filters.dataset.active||'all';filters.replaceChildren();
  const mk=(id,label)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.classList.toggle('active',active===id);b.onclick=()=>{filters.dataset.active=id;renderValeDrawer()};filters.append(b);};
  mk('all','Todos');for(const kind of kinds)mk(kind,kind==='company'?'Empresas':kind==='environment'?'Ambientes':kind==='sport'?'Esportes':kind==='mobility'?'Mobilidade':kind==='portal'?'Portais':kind);
  const filtered=destinations.filter(d=>(active==='all'||d.kind===active)&&(!query||`${d.name||''} ${d.district||''}`.toLowerCase().includes(query)));list.replaceChildren();
  if(!filtered.length){const empty=document.createElement('p');empty.className='muted';empty.textContent='Nenhum destino encontrado.';list.append(empty);return;}
  for(const d of filtered){const visited=d.kind!=='company'||state.valeVisited.has(d.companyId);const row=document.createElement('button');row.type='button';row.className='vale-destination';const info=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small'),travel=document.createElement('span');title.textContent=d.name;meta.textContent=d.district||({landmark:'Ponto importante',environment:'Ambiente',sport:'Complexo esportivo',mobility:'Mobilidade',portal:'Portal'}[d.kind]||d.kind||'Destino');travel.className='travel';travel.textContent=visited?'IR':'VISITAR';info.append(title,meta);row.append(info,travel);row.onclick=()=>{if(!visited){toast('Visite esta empresa caminhando pelo Vale para liberar o fast travel.');return;}state.runtime?.teleportTo?.(d);valeToggle(false);toast(`Destino: ${d.name}`);};list.append(row);}
}
function showValeCompany(company){
  if(!company)return;state.selectedValeCompany=company;state.valeVisited.add(company.id);valeSave();
  const data=company.data_bindings||{},teams=data.teams||[],leaders=data.leaders||[],roles=teams.flatMap(t=>(t.members||[]).map(m=>`${m.name} — ${m.role||'Função ainda não cadastrada'}`));
  $('vale-company-title').textContent=company.display_name||company.company_name||company.project_name;$('vale-company-subtitle').textContent=`${company.project_name||'Projeto estudantil'} • ${(data.turmas||[]).join(', ')||'Turma a validar'} • ${Number(data.member_count||0)} integrante(s)`;
  const content=$('vale-company-content');content.replaceChildren();
  const section=(title,lines)=>{const card=document.createElement('section');card.className='vale-company-section';const h=document.createElement('h3');h.textContent=title;card.append(h);const ul=document.createElement('ul');for(const line of lines.filter(Boolean)){const li=document.createElement('li');li.textContent=line;ul.append(li);}if(!ul.children.length){const p=document.createElement('p');p.textContent='A validar';card.append(p);}else card.append(ul);content.append(card);};
  section('Projeto',[data.description||company.building?.theme_description||company.project_name,...(company.interior?.focus_areas||[])]);section('Equipe',[`Liderança: ${leaders.join(', ')||'A validar'}`,...roles.slice(0,18)]);section('Prédio',[`Distrito: ${company.zone||'A validar'}`,`Arquétipo: ${company.building?.archetype||'generic_tech'}`,`Interior: ${company.building?.interior_template||'interior_generic'}`]);
  $('vale-company-enter').dataset.companyId=company.id;openModal('vale-company-modal');renderValeDrawer();
}
function openCampusTool(destination){
  if(!destination)return false;const role=String(state.profile?.role||'student'),staff=['teacher','admin','super_admin'].includes(role),route=destination.id==='practical-exam'&&staff?(destination.staffRoute||destination.route):destination.route;
  if(!route){toast('Destino ainda não possui rota publicada.');return true;}const projectRoot=new URL('../',window.location.href),target=new URL(route,projectRoot);document.querySelector('.game-stage')?.classList.add('portal-travel');toast(`Abrindo ${destination.name}…`);setTimeout(()=>location.assign(target.href),320);return true;
}
function renderInteriorMapModal(){
  const info=state.runtime?.getInteriorMap?.(),profile=info?.profile;if(!profile)return false;const floor=Number(info.floor||0),map=info.map||profile.floorMaps?.find(item=>item.index===floor);
  $('interior-map-title').textContent=`🗺 ${profile.name}`;$('interior-map-subtitle').textContent=`${profile.floorLabel(floor)} • ${floor===0?'Térreo':'1º pavimento'}`;
  const rooms=map?.rooms||[];$('interior-map-rooms').innerHTML=rooms.length?rooms.map(room=>`<article class="interior-room-card"><strong>${esc(room.label)}</strong><small>${esc(room.description||'Ambiente interno do prédio.')}</small></article>`).join(''):'<p class="muted">Nenhum ambiente adicional neste pavimento.</p>';
  const guides=(profile.guidedRoutes||[]).filter(route=>Number(route.floor||0)===floor);$('interior-guide-list').innerHTML=guides.length?guides.map(route=>`<button class="interior-guide-button" type="button" data-guide-id="${esc(route.id)}"><span><strong>${esc(route.label)}</strong><small>Traçar rota dentro deste pavimento</small></span><b>Guiar →</b></button>`).join(''):'<p class="muted">Sem rotas guiadas para este pavimento.</p>';
  $('interior-guide-list').querySelectorAll('[data-guide-id]').forEach(button=>button.onclick=()=>{const routeId=button.dataset.guideId,ok=state.runtime?.startInteriorGuide?.({interiorId:profile.id,routeId});if(ok){document.querySelector('.game-stage')?.classList.add('interior-guiding');closeModal('interior-map-modal');toast(`Rota interna ativa • ${guides.find(route=>route.id===routeId)?.label||'destino'}.`);}else toast('Não foi possível iniciar esta rota no pavimento atual.');});return true;
}
function openInteriorMapModal(){if(!String(state.interior||'').startsWith('tool:'))return toast('Entre em um prédio conectado para abrir o mapa interno.');if(renderInteriorMapModal())openModal('interior-map-modal');}
function handleWorldObject(obj){
  if(!obj)return false;
  if(obj.type==='tool-building'){
    const destination=CAMPUS_DESTINATION_MAP[obj.id]||obj,ok=state.runtime?.enterToolInterior?.(destination.id);if(ok){toast(`Entrando em ${destination.name} • recepção térrea…`);return true;}return openCampusTool(destination);
  }
  if(obj.type==='tool-interior-exit'){const ok=state.runtime?.exitToolInterior?.();if(ok)toast('Voltando para as ruas do Campus…');return !!ok}
  if(obj.type==='tool-interior-portal'){return openCampusTool(CAMPUS_DESTINATION_MAP[obj.interiorId]||CAMPUS_INTERIOR_MAP[obj.interiorId]||obj)}
  if(obj.type==='tool-reception'){const profile=CAMPUS_INTERIOR_MAP[obj.interiorId],services=(profile?.services||obj.services||[]).join(' • ');state.runtime?.setLocalAction?.('wave');toast(`${profile?.name||obj.name} • Recepção: ${services||'orientação e acesso aos serviços do prédio'}.`);return true}
  if(obj.type==='tool-receptionist'){state.runtime?.setLocalAction?.('wave');toast(`${obj.name} • ${obj.role||'Recepção'}: ${obj.message||'Posso orientar sua circulação neste prédio.'}`);return true}
  if(obj.type==='tool-interior-map'){openInteriorMapModal();return true}
  if(obj.type==='tool-guided-route'){const ok=state.runtime?.startInteriorGuide?.(obj);if(ok){document.querySelector('.game-stage')?.classList.add('interior-guiding');toast(`Rota interna ativa • ${obj.label||obj.name}.`);}return !!ok}
  if(obj.type==='tool-service-zone'){toast(`${obj.name}: ${obj.description||'Ambiente especializado deste prédio.'}`);return true}
  if(obj.type==='tool-elevator'){const ok=state.runtime?.useToolElevator?.(obj);if(ok)toast('Elevador em movimento • aguarde a chegada ao outro pavimento.');return !!ok}
  if(obj.type==='tool-stairs'){const ok=state.runtime?.useToolStairs?.(obj),status=state.runtime?.getToolInterior?.();if(ok)toast(`Escada • ${status?.floor===0?'Térreo':'1º pavimento'}.`);return !!ok}
  if(obj.type==='tool-garage'){const ok=state.runtime?.exitToolInteriorToGarage?.();if(ok)toast('Saída pela garagem • você voltou ao sistema viário do Campus.');return !!ok}
  if(obj.type==='campus-vehicle'){const ok=state.runtime?.useCampusVehicle?.(obj);if(ok)toast(`${obj.name} • passeio urbano iniciado. Pressione E para encerrar antes do fim.`);else toast('Este veículo não está disponível agora.');return true}
  if(obj.type==='city-npc'){state.runtime?.setLocalAction?.('wave');toast(`${obj.name} • ${obj.role||'Campus'}: ${obj.message||'Posso orientar sua circulação pela cidade educacional.'}`);return true}
  if(obj.type==='city-event'){toast(`${obj.icon||'◆'} ${obj.name}: ${obj.detail||'Evento urbano ativo neste setor do Campus.'}`);return true}
  if(obj.type==='dynamic-sign'){toast(`${obj.name||'Painel urbano'} • ${(obj.messages||[]).join(' • ')||'Sinalização dinâmica do Campus.'}`);return true}
  if(obj.type==='vale-portal'){enterVale().catch(error=>{console.error(error);toast('Não foi possível abrir o Vale agora.');});return true}
  if(obj.type==='return-portal'){returnToCampus().catch(error=>{console.error(error);toast('Não foi possível voltar ao Campus agora.');});return true}
  if(obj.type==='vale-company'){showValeCompany(obj.company);return true}
  if(obj.type==='vale-company-exit'){const ok=state.runtime?.exitBuilding?.();if(ok)toast('Voltando para as ruas do Vale…');return true}
  if(obj.type==='vale-npc'){state.runtime?.setLocalAction?.('wave');toast(`${obj.name} • ${obj.role}: ${obj.message}`);return true}
  if(obj.type==='vale-environment'){toast(`${obj.name}: ${obj.description||'Ambiente do Campus AGV.'}`);return true}
  if(obj.type==='vale-sport'){toast(`${obj.name}: área preparada para futuros minijogos e desafios.`);return true}
  if(obj.type==='vale-hangar'||obj.type==='vale-racetrack'){toast(`${obj.name}: ${obj.description||'Área de exploração do Vale.'}`);return true}
  if(obj.type==='vale-vehicle'){toast(`${obj.name}: ${obj.state==='INTERACTIVE_READY'?'preparado para futura interação':'veículo de ambientação do Vale'}.`);return true}
  if(obj.type==='building-entrance'){const ok=state.runtime?.enterInterior?.(obj.zoneKey);if(ok)toast(`Entrando no laboratório ${obj.zoneKey.toUpperCase()}…`);return !!ok}
  if(obj.type==='interior-exit'){const ok=state.runtime?.exitInterior?.();if(ok)toast('Voltando para a Praça Central…');return !!ok}
  if(obj.type==='lab-terminal'){const sat=state.runtime?.toggleStation?.(obj);if(sat){state.localAction='sit';toast(`${obj.name}: monitor ligado. Você está sentado na estação. Pressione E para levantar.`)}else toast(`${obj.name}: estação liberada.`);return true}
  if(obj.type==='smartboard'){state.runtime?.showBoard?.(obj.zoneKey);toast(`${obj.name}: conteúdo contextual exibido no quadro inteligente.`);return true}
  if(obj.type==='presentation-spot'){if(!isStaff()){toast('Área de apresentação reservada à equipe pedagógica.');return true}const on=state.runtime?.togglePresentation?.(obj);toast(on?'Modo apresentação ativado. Pressione E novamente para sair.':'Modo apresentação encerrado.');return true}
  if(obj.type==='lab-portal'){const z=zones.find(x=>x.key===obj.zoneKey);if(!z)return true;const ps=portalState(z);if(isStaff())toast(ps.text);else if(z.code!==state.currentClass?.code)toast(`Você está no laboratório ${z.label}, mas as atividades pertencem àquela turma.`);else ps.open?showActivities():toast(ps.text);return true}
  if(obj.type==='npc'){state.campusFlags.monitor=true;campusSave();renderCampus();state.runtime?.setLocalAction?.('wave');toast(`${obj.name}: ${obj.message}`);return true}
  if(obj.type==='meet'){state.runtime?.setLocalAction?.('cheer');toast(`${obj.label} • ponto de encontro da turma.`);return true}
  if(obj.type==='kiosk'){campusToggle(true);$('campus-message').textContent='Totem do Campus: acompanhe sua exploração local. Nenhum benefício é concedido por esta tela.';return true}
  if(obj.type==='parkour'){const started=state.runtime?.startChallenge?.('parkour');if(started)toast('Circuito Parkour iniciado. Passe pelos checkpoints na ordem.');return true}
  if(obj.type==='train-station'){openTrainModal(false);return true;}
  if(obj.type==='coaster'){openTrainModal(true);return true;}
  if(['pool','playground','slide','tower'].includes(obj.type)){
    const started=state.runtime?.startExperience?.(obj.type),messages={pool:'Pausa no deck da Piscina Neon.',playground:'Balanço do Parquinho DS ativado.',slide:'Descida física do Escorregador Turbo iniciada.',tower:'Subida guiada para a Torre de Controle AGV iniciada.'};toast(started?(messages[obj.type]||obj.description||obj.name):'Esta atração está indisponível neste modo agora.');return true;
  }
  return false;
}
function interact(){
  const activeVehicle=state.runtime?.getCampusVehicle?.();if(activeVehicle){state.runtime?.cancelCampusVehicle?.();toast(`${activeVehicle.name||'Veículo'} • passeio encerrado.`);return;}
  if(state.nearStudent){
    if(isStaff()&&state.nearStudent.participant_role==='student')return openStaffTarget(state.nearStudent);
    openChatWith(state.nearStudent);return;
  }
  if(state.seated){const left=state.runtime?.toggleSeat?.(state.nearSeat);toast('Você se levantou do banco.');return;}
  if(state.nearSeat){const sat=state.runtime?.toggleSeat?.(state.nearSeat);if(sat){state.localAction='sit';campusMark('sit');toast('Sentado. Pressione E para levantar.');}return;}
  if(state.nearWorldObject&&handleWorldObject(state.nearWorldObject))return;
  if(!state.nearPortal)return;const z=state.nearPortal,ps=portalState(z);
  if(isStaff())return toast(ps.text);if(z.code!==state.currentClass?.code)return toast(`Você pode visitar ${z.label}, mas as atividades pertencem àquela turma.`);if(ps.open){document.querySelector('.game-stage')?.classList.add('portal-travel');setTimeout(()=>{document.querySelector('.game-stage')?.classList.remove('portal-travel');showActivities()},430)}else toast(ps.text);
}
function renderInteraction(){
  const b=$('interaction');if(state.nearStudent){b.classList.remove('hidden');$('interaction-title').textContent=`${isStaff()&&state.nearStudent.participant_role==='student'?'Interagir':'Conversar'} — ${state.nearStudent.display_name}`;$('interaction-text').textContent=isStaff()&&state.nearStudent.participant_role==='student'?`${className(state.nearStudent.class_id)} • conversar, reações e moderação`:'Aproxime-se e pressione E para abrir o chat local.';$('interaction-button').textContent=isStaff()&&state.nearStudent.participant_role==='student'?'Opções':'Conversar 💬';return}
  if(state.seated){b.classList.remove('hidden');$('interaction-title').textContent='Banco da Praça';$('interaction-text').textContent='Você está sentado. Pressione E para levantar.';$('interaction-button').textContent='Levantar';return}
  if(state.nearSeat){b.classList.remove('hidden');$('interaction-title').textContent='Banco da Praça';$('interaction-text').textContent='Faça uma pausa no campus.';$('interaction-button').textContent='Sentar';return}
  if(state.nearWorldObject){const o=state.nearWorldObject;b.classList.remove('hidden');$('interaction-title').textContent=o.name||o.label||'Campus';const copy={npc:'Monitor virtual • orientação do campus',meet:'Ponto de encontro da turma',kiosk:'Totem interativo do campus','building-entrance':'Porta automática com sensor • entrar no laboratório','interior-exit':'Porta automática com sensor • voltar à praça','lab-terminal':'Estação interativa • sentar e ligar o monitor',smartboard:'Quadro inteligente • conteúdo contextual','presentation-spot':isStaff()?'Posição de apresentação da equipe':'Área reservada à equipe pedagógica','lab-portal':'Portal pedagógico interno',parkour:'Circuito de saltos e checkpoints • treino local sem nota',pool:'Piscina Neon • área de convivência',playground:'Parquinho DS • balanço e gangorra',slide:'Escorregador Turbo • acesso e descida',coaster:'Monotrilho AGV • escolher estação e viajar',tower:'Torre de Controle AGV • mirante panorâmico','train-station':'Estação do Monotrilho AGV • escolher destino','vale-portal':'Portal para a cidade tecnológica dos projetos dos alunos','return-portal':'Retornar ao Campus DS','vale-company':'Empresa/projeto estudantil • conhecer equipe e entrar no prédio','vale-company-exit':'Sair do prédio e voltar às ruas do Vale','vale-npc':'NPC institucional • orientação e acolhimento','vale-environment':'Ambiente institucional do Campus AGV','vale-sport':'Complexo esportivo • preparado para futuros minijogos','vale-hangar':'Hangar e mobilidade do Campus','vale-racetrack':'Pista de corrida e exploração','vale-vehicle':'Veículo de ambientação e mobilidade','tool-building':'Prédio conectado ao ecossistema AGV • entrar pelo hall e recepção','tool-interior-exit':'Saída do prédio • voltar ao Campus','tool-interior-portal':'Portal interno • abrir a ferramenta real com a mesma sessão','tool-reception':'Recepção institucional • orientação e serviços','tool-elevator':'Elevador • alternar entre térreo e 1º pavimento','tool-stairs':'Escada interna • alternar entre pavimentos','tool-garage':'Acesso interno à garagem • saída para o sistema viário','tool-receptionist':'Recepcionista virtual • orientação contextual do prédio','tool-interior-map':'Mapa interno • ambientes e rotas por pavimento','tool-guided-route':'Rota guiada • traçar caminho até um destino interno','tool-service-zone':'Ambiente especializado • conhecer função e serviços','campus-vehicle':'Veículo utilizável • passeio guiado pelas vias do Campus','city-npc':'NPC em circulação • orientação urbana contextual','city-event':'Evento urbano ativo • conhecer programação local','dynamic-sign':'Sinalização inteligente • orientação dinâmica da cidade'};$('interaction-text').textContent=o.type==='tool-building'?`${o.district||'Campus DS'} • ${o.subtitle||o.description||'Prédio conectado'} • sessão AGV compartilhada`:copy[o.type]||o.description||'Objeto interativo';$('interaction-button').textContent=o.type==='npc'?'Conversar':o.type==='building-entrance'||o.type==='tool-building'?'Entrar':o.type==='interior-exit'||o.type==='tool-interior-exit'?'Sair':o.type==='tool-interior-portal'?'Abrir ferramenta':o.type==='tool-reception'?'Atendimento':o.type==='tool-elevator'?'Usar elevador':o.type==='tool-stairs'?'Usar escada':o.type==='tool-garage'?'Ir à garagem':o.type==='tool-receptionist'?'Conversar':o.type==='tool-interior-map'?'Abrir mapa':o.type==='tool-guided-route'?'Iniciar rota':o.type==='tool-service-zone'?'Conhecer':o.type==='campus-vehicle'?'Dirigir':o.type==='city-npc'?'Conversar':o.type==='city-event'?'Ver evento':o.type==='dynamic-sign'?'Consultar':o.type==='lab-terminal'?'Usar estação':o.type==='smartboard'?'Exibir':o.type==='presentation-spot'?(isStaff()?'Apresentar':'Reservado'):o.type==='lab-portal'?'Abrir portal':o.interaction||(o.type==='parkour'?'Iniciar circuito':'Explorar');return}
  if(!state.nearPortal){b.classList.add('hidden');return}const z=state.nearPortal,ps=portalState(z);b.classList.remove('hidden');$('interaction-title').textContent=`${z.portal.label} — ${z.label}`;$('interaction-text').textContent=ps.text;$('interaction-button').textContent=ps.open?'Abrir portal':'Ver estado';
}
function areaText(key){if(key==='vale-silicio')return'Vale do Silício AGV';if(String(key||'').startsWith('tool:')){const id=String(key).slice(5),p=CAMPUS_INTERIOR_MAP[id];return p?`Interior • ${p.name}`:'Interior do Campus';}const z=zones.find(x=>x.key===key);return z?`Área ${z.label} — ${z.name}`:'Praça Central'}
function showZoneBanner(key){campusMark('area',key);const title=areaText(key),wrap=$('zone-banner');$('zone-banner-title').textContent=title;wrap.classList.remove('hidden');clearTimeout(state.zoneTimer);state.zoneTimer=setTimeout(()=>wrap.classList.add('hidden'),2100)}
function localAction(kind){if(!state.runtime)return;if(kind!=='clear')campusMark('action');state.localAction=kind==='clear'?null:kind;state.runtime.setLocalAction?.(state.localAction);$('action-menu')?.classList.add('hidden');if(kind!=='clear')toast(kind==='dance'?'Dança iniciada 🕺':kind==='cheer'?'Comemoração 🎉':'Agachado. Movimente-se para cancelar.')}
function cycleQuality(){if(state.runtimeMode==='lite'){toast('O mapa 2D usa qualidade automática e leve. Use “Entrar no 3D” para a experiência imersiva.');return}const current=state.runtime?.getQuality?.()||'medium',order=['low','medium','high','ultra'],next=order[(order.indexOf(current)+1)%order.length];try{localStorage.setItem('agv:lobby:quality',next)}catch(_){}state.runtime?.setQuality?.(next)}
function toggleCamera(){if(state.runtimeMode!=='3d')return toast('No mapa 2D, use o scroll para aproximar ou afastar.');const mode=state.runtime?.toggleCamera?.()||'explore';const labels={explore:'3ª pessoa',firstperson:'1ª pessoa',wide:'Ampla',campus:'Campus'};$('camera-button').textContent=labels[mode]||'Câmera';toast(mode==='firstperson'?'Visão em primeira pessoa ativada. Use o mouse para olhar ao redor.':mode==='campus'?'Visão elevada do campus. Arraste para girar 360° e use o scroll para zoom.':mode==='wide'?'Câmera ampla ativada. Arraste para olhar ao redor.':'Câmera em terceira pessoa ativada.')}
function perfUpdate(info={}){globalThis.__agvLobbyDiag?.update?.({runtime:{fps:Number(info.fps||0)||null,quality:String(info.quality||'')||null,avatar:state.runtime?.getAvatarMode?.()||null,profile:info.profile||null}});const el=$('perf-badge');if(!el)return;const fps=Number(info.fps||0),show=!!fps&&(state.graphics.showPerf||fps<42);const avatar=state.runtime?.getAvatarMode?.()==='rigged-glb'?'GLB':'PROC';el.textContent=`${fps||'—'} FPS • ${String(info.quality||'').toUpperCase()} • ${avatar}`;el.classList.toggle('hidden',!show);el.classList.remove('warn','bad');if(fps&&fps<28)el.classList.add('bad');else if(fps&&fps<42)el.classList.add('warn');}

function setLoading(text,title='Entrando no Campus DS',failed=false){
  const overlay=$('loading3d'),status=$('loading3d-status'),heading=$('loading3d-title'),recovery=$('loading3d-recovery');
  overlay?.classList.remove('ready');overlay?.classList.toggle('failed',failed);recovery?.classList.toggle('hidden',!failed);
  if(status)status.textContent=text;if(heading)heading.textContent=title;
}
function finishLoading(){const overlay=$('loading3d');overlay?.classList.remove('failed');overlay?.classList.add('ready');$('loading3d-recovery')?.classList.add('hidden')}
function showLiteBadge(on=true){let badge=$('lite-mode-badge');if(on&&!badge){badge=document.createElement('div');badge.id='lite-mode-badge';badge.className='lite-mode-badge';badge.textContent='Modo 2D • leve, compatível e oficial';$('game-shell')?.appendChild(badge)}else if(!on&&badge)badge.remove()}
function updateModeUI(mode=state.runtimeMode){
  const stage=document.querySelector('.game-stage'),button=$('mode-button'),advice=$('mode-advice'),waiting=$('waiting-strip-text');
  if(stage)stage.dataset.runtimeMode=mode||'lite';
  if(button)button.textContent=mode==='3d'?'Voltar ao 2D':'Entrar no 3D';
  document.body.dataset.scene=state.scene||'campus';if($('campus-button')){$('campus-button').title=state.scene==='vale'?'Mapa e empresas do Vale':'Campus vivo';$('campus-button').setAttribute('aria-label',state.scene==='vale'?'Abrir mapa do Vale':'Abrir painel do campus');}
  const valeDirect=$('vale-direct-button');if(valeDirect){const inVale=state.scene==='vale';valeDirect.textContent=inVale?'↩ Campus DS':'🏙 Vale do Silício';valeDirect.title=inVale?'Voltar ao Campus DS':'Viajar para o Vale do Silício AGV • 27 empresas e 8 distritos';valeDirect.setAttribute('aria-label',valeDirect.title);}
  if(advice)advice.textContent=state.scene==='vale'?(mode==='3d'?'Vale • 3D':'Vale • 2D'):(mode==='3d'?'3D imersivo':'2D recomendado');
  updateActivityHUD();if(waiting&&activitySummary().kind==='waiting')waiting.textContent=state.scene==='vale'?(mode==='3d'?'Vale 3D ativo. Explore empresas, ambientes, esportes e mobilidade.':'Explore o Vale em 2D. O modo 3D continua opcional.'):(mode==='3d'?'Modo 3D ativo. Explore o Campus ou volte ao 2D a qualquer momento.':'Explore o mapa 2D enquanto aguarda a atividade. O modo 3D é opcional.');
  document.body.dataset.lobbyMode=mode||'lite';renderValeMinimap(true);
}
function setModeTransition(active,label=''){const stage=document.querySelector('.game-stage');if(!stage)return;stage.classList.toggle('mode-switching',!!active);if(active)stage.dataset.modeLabel=label||'Atualizando ambiente';else delete stage.dataset.modeLabel;}
function freshCanvas(){const old=$('game3d');if(!old)return null;const next=old.cloneNode(false);old.replaceWith(next);return next}
function formatChallengeTime(seconds=0){const value=Math.max(0,Number(seconds)||0),minutes=Math.floor(value/60),rest=value-minutes*60;return`${String(minutes).padStart(2,'0')}:${rest.toFixed(1).padStart(4,'0')}`;}
function challengeEvent(event={}){const hud=$('challenge-hud'),stage=document.querySelector('.game-stage'),restart=$('challenge-restart'),kicker=$('challenge-kicker'),title=$('challenge-title'),detail=$('challenge-detail'),time=$('challenge-time'),bar=$('challenge-progress-bar');if(!hud)return;clearTimeout(challengeStatusTimer);const ride=String(event.type||'').startsWith('experience-');if(event.message&&event.type!=='tick'&&event.type!=='experience-tick')toast(event.message);if(event.type==='start'||event.type==='restart'||event.type==='checkpoint'||event.type==='tick'||event.type==='respawn'){hud.classList.remove('hidden');stage?.classList.add('challenge-active');restart?.classList.remove('hidden');if(kicker)kicker.textContent='Desafio local • sem nota';if(title)title.textContent=event.title||'Circuito Parkour';if(detail)detail.textContent=event.type==='respawn'?'Recuperação segura':`Checkpoint ${Math.min(event.index||0,event.total||5)}/${event.total||5}`;if(time)time.textContent=formatChallengeTime(event.elapsed);if(bar)bar.style.width=`${Math.round(Math.min(1,(event.index||0)/Math.max(1,event.total||5))*100)}%`;}
  if(ride){const activeRide=event.type==='experience-start'||event.type==='experience-tick';hud.classList.toggle('hidden',!activeRide);stage?.classList.toggle('challenge-active',activeRide);restart?.classList.add('hidden');if(kicker)kicker.textContent='Atração local';if(title&&event.title)title.textContent=event.title;if(detail)detail.textContent=event.type==='experience-tick'?`${Math.round((event.progress||0)*100)}% do passeio`:'Experiência recreativa';if(time&&event.type==='experience-tick')time.textContent=formatChallengeTime((event.progress||0)*(event.duration||0));if(bar&&event.type==='experience-tick')bar.style.width=`${Math.round((event.progress||0)*100)}%`;}
  if(String(event.type||'').startsWith('train-')&&event.type==='train-complete'&&event.destination?.id==='vale')setTimeout(()=>enterVale().catch(error=>console.error(error)),350);
  const finished=['complete','cancel','experience-complete','experience-cancel'].includes(event.type);if(finished){challengeStatusTimer=setTimeout(()=>{hud.classList.add('hidden');stage?.classList.remove('challenge-active');updateModeUI(state.runtimeMode)},3200);}}
function runtimeHooks(){return{canvas:$('game3d'),zones,state,isStaff,className,onInteract:interact,onQualityChange:q=>{globalThis.__agvLobbyDiag?.update?.({runtime:{quality:q}});$('quality-button').textContent=state.runtimeMode==='lite'?'Leve':q==='ultra'?'Ultra':q==='high'?'Alto':q==='low'?'Eco':'Médio'},onPerf:perfUpdate,onError:m=>toast(m),onContextLost:()=>{if(state.runtimeMode==='3d'&&!state.bootingRuntime)startLite('webgl_context_lost').catch(()=>{})},onChallengeEvent:challengeEvent,onWorldTime:updateWorldClock,onAreaChange:showZoneBanner,onInteriorChange:e=>{state.interior=e.inside?e.key:null;state.interiorFloor=e.inside&&Number.isFinite(e.floor)?e.floor:null;const toolInside=e.inside&&String(e.key||'').startsWith('tool:');$('interior-map-button')?.classList.toggle('hidden',!toolInside);if(!toolInside){closeModal('interior-map-modal');document.querySelector('.game-stage')?.classList.remove('interior-guiding');}else if(!$('interior-map-modal')?.classList.contains('hidden'))renderInteriorMapModal();showZoneBanner(e.inside?e.key:(state.scene==='vale'?'vale-silicio':'central'));toast(e.inside?`${String(e.label||e.key).toUpperCase()} • ambiente interno`:(state.scene==='vale'?'Vale do Silício AGV • ambiente externo':'Praça Central • ambiente externo'));},onPlayerState:p=>{state.player.x=p.x;state.player.y=p.y;state.player.area=p.area;state.interior=p.interior||null;state.interiorFloor=Number.isFinite(p.interiorFloor)?p.interiorFloor:null;state.nearPortal=p.nearPortal;state.nearStudent=p.nearStudent;state.nearSeat=p.nearSeat||null;state.nearWorldObject=p.nearWorldObject||null;state.seated=!!p.seated;const vehicleChip=$('vehicle-status');if(vehicleChip){vehicleChip.classList.toggle('hidden',!p.vehicle);if(p.vehicle)vehicleChip.textContent=`🚗 ${p.vehicle.name||'Veículo'} • E sair`;} $('area-label').textContent=p.interior?(state.scene==='vale'?`Prédio • ${state.selectedValeCompany?.display_name||String(p.interior)}`:`${areaText(p.interior)}${String(p.interior).startsWith('tool:')?` • ${Number(p.interiorFloor)===1?'1º pavimento':'Térreo'}`:''}`):areaText(p.area);renderInteraction();renderValeMinimap();presence();}}}
function restoreToolInterior(interior,floor=0){if(state.scene!=='campus'||!String(interior||'').startsWith('tool:'))return false;const id=String(interior).slice(5),ok=state.runtime?.enterToolInterior?.(id);if(ok&&Number(floor)===1)state.runtime?.useToolElevator?.({interiorId:id});return !!ok;}
async function startLite(reason='fallback'){
  globalThis.__agvLobbyDiag?.record?.('runtime_lite',{reason});globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'lite',quality:'lite',firstFrame:true}});
  const restoreInterior=state.scene==='campus'?state.interior:null,restoreFloor=state.runtime?.getToolInterior?.()?.floor||0;setModeTransition(true,'Abrindo mapa 2D');state.runtime?.stop?.();state.runtime=null;freshCanvas();state.runtimeMode='lite';showLiteBadge(true);setLoading(state.scene==='vale'?'Gerando distritos, empresas, ruas e atrações do Vale…':'Preparando o mapa interativo com presença em tempo real…',state.scene==='vale'?'Mapa 2D do Vale do Silício AGV':'Mapa 2D do Campus');
  state.runtime=state.scene==='vale'?await createValeLite({...runtimeHooks(),signal:null}):createLobbyLite(runtimeHooks());restoreToolInterior(restoreInterior,restoreFloor);state.runtime?.setWorldTimeMode?.(state.graphics.worldTimeMode);state.runtime?.setFPSCap?.(state.graphics.fpsCap);$('quality-button').textContent='Leve';$('camera-button').textContent='Mapa';$('perf-badge')?.classList.add('hidden');updateModeUI('lite');
  await securityTelemetry('client.lobby_lite_mode','info',{reason,surface:state.scene==='vale'?'vale-silicio':'lobby-3d'});requestAnimationFrame(()=>setTimeout(()=>{finishLoading();setModeTransition(false)},180));showZoneBanner(state.scene==='vale'?'vale-silicio':state.player.area);if(state.scene==='vale')renderValeDrawer();return state.runtime;
}
async function start3D({allowFallback=true}={}){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'runtime_3d_loading'});globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'3d',firstFrame:false}});
  if(state.bootingRuntime)return state.runtime;const restoreInterior=state.scene==='campus'?state.interior:null,restoreFloor=state.runtime?.getToolInterior?.()?.floor||0;state.bootingRuntime=true;setModeTransition(true,'Entrando no ambiente 3D');state.runtime?.stop?.();state.runtime=null;freshCanvas();state.runtimeMode='3d';showLiteBadge(false);setLoading(state.scene==='vale'?'Gerando cidade tecnológica, prédios, NPCs e mobilidade…':'Montando praça, edifícios, personagens e presença online…',state.scene==='vale'?'Entrando no Vale do Silício AGV 3D':'Entrando no Campus DS 3D');
  const controller=new AbortController();let timer=null,firstFrameResolve;const firstFrame=new Promise(resolve=>{firstFrameResolve=resolve});
  try{
    const savedQuality=(()=>{try{const q=localStorage.getItem('agv:lobby:quality');return ['low','medium','high','ultra'].includes(q)?q:null}catch(_){return null}})();
    const factory=state.scene==='vale'?createVale3D:createLobby3D;const create=factory({...runtimeHooks(),signal:controller.signal,initialQuality:savedQuality,onFirstFrame:()=>firstFrameResolve?.()});
    const timeoutMs=COARSE_POINTER?11500:13500;const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('lobby_3d_boot_timeout'))},timeoutMs)});
    state.runtime=await Promise.race([create,timeout]);clearTimeout(timer);restoreToolInterior(restoreInterior,restoreFloor);setLoading('Sincronizando câmera 360° e personagens…',state.scene==='vale'?'Vale quase pronto':'Campus quase pronto');
    await Promise.race([firstFrame,new Promise((_,reject)=>setTimeout(()=>reject(new Error('lobby_3d_first_frame_timeout')),5500))]);
    state.runtime?.setWorldTimeMode?.(state.graphics.worldTimeMode);state.runtime?.setFPSCap?.(state.graphics.fpsCap);state.runtime?.setFov?.(state.graphics.fov);
    state.runtimeMode='3d';updateModeUI('3d');globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'3d',quality:state.runtime?.getQuality?.()||null,firstFrame:true}});globalThis.__agvLobbyDiag?.record?.('stage',{stage:'runtime_3d_ready'});{const q=state.runtime?.getQuality?.();$('quality-button').textContent=q==='ultra'?'Ultra':q==='high'?'Alto':q==='low'?'Eco':'Médio';}finishLoading();setModeTransition(false);showZoneBanner(state.player.area);return state.runtime;
  }catch(error){
    clearTimeout(timer);controller.abort();state.runtime?.stop?.();state.runtime=null;globalThis.__agvLobbyDiag?.record?.('runtime_3d_failed',{message:String(error?.message||error).slice(0,160)});console.error('Falha no boot 3D:',error);await securityTelemetry('client.webgl_init_failed','warning',{message:String(error?.message||error),mobile:matchMedia('(pointer:coarse)').matches});
    setLoading('O ambiente 3D não ficou pronto a tempo. Seus dados estão seguros; você pode continuar no mapa 2D e tentar o 3D novamente quando quiser.','Continuar no Campus',true);
    if(allowFallback){await new Promise(r=>setTimeout(r,650));return startLite(String(error?.message||'3d_failed'))}setModeTransition(false);throw error;
  }finally{state.bootingRuntime=false}
}
async function enterVale(){
  if(state.scene==='vale'||state.bootingRuntime)return;state.savedCampusPlayer={...state.player};state.scene='vale';state.interior=null;state.interiorFloor=null;state.nearPortal=null;state.nearStudent=null;state.nearWorldObject=null;const presenceSpawn=valeWorldToPresence(VALE_SPAWN.x,VALE_SPAWN.z),spawn={x:presenceSpawn.x,y:presenceSpawn.y,area:'vale-silicio'};state.player={...state.player,...spawn};document.body.dataset.scene='vale';campusToggle(false);toast('Entrando no Vale do Silício AGV…');if(state.runtimeMode==='3d')await start3D({allowFallback:true});else await startLite('enter_vale');renderValeDrawer();showZoneBanner('vale-silicio');}
async function returnToCampus(){
  if(state.scene!=='vale'||state.bootingRuntime)return;state.scene='campus';state.interior=null;state.interiorFloor=null;state.nearWorldObject=null;state.player=state.savedCampusPlayer?{...state.savedCampusPlayer}:{...state.player,x:800,y:500,area:'central'};state.savedCampusPlayer=null;document.body.dataset.scene='campus';valeToggle(false);toast('Voltando ao Campus DS…');if(state.runtimeMode==='3d')await start3D({allowFallback:true});else await startLite('return_from_vale');showZoneBanner(state.player.area||'central');}
async function retry3D(){if(state.bootingRuntime)return;toast('Tentando iniciar o modo 3D…');try{saveModeChoice('3d');await start3D({allowFallback:true})}catch(_){}}
async function toggleRuntimeMode(){
  if(state.bootingRuntime)return;
  if(state.runtimeMode==='3d'){saveModeChoice('lite');toast('Voltando para o mapa 2D…');await startLite('manual_mode_switch');return;}
  saveModeChoice('3d');toast('Carregando ambiente 3D…');await start3D({allowFallback:true});
}
async function boot(){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_boot'});
  state.stopped=false;if(!await loadIdentity())return;
  await securityTelemetry('session.check','info',{role:state.profile?.role||'unknown',surface:state.scene==='vale'?'vale-silicio':'lobby-3d'});
  await loadActivities();globalThis.__agvLobbyDiag?.record?.('stage',{stage:'activities_loaded'});showLogin(false);state.portalState=portalState;state.emoteRequested=kind=>emote(kind,state.nearStudent?.student_id||null);ensureGatherChannel();ensureProximityChat();
  // Regra v14.10.8.65: todo acesso começa no 2D; 3D, primeira pessoa e qualidade continuam opcionais.
  await startLite(lastModeChoice()==='3d'?'default_2d_first_previous_3d':'default_2d_first');
  await presence(true);poll();globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_ready'});
}

$('retry-3d').onclick=()=>retry3D();$('enter-lite').onclick=()=>{saveModeChoice('lite');startLite('manual_recovery').catch(()=>{})};$('mode-button').onclick=()=>toggleRuntimeMode().catch(error=>{console.error(error);toast('Não foi possível alternar o modo agora.');});
campusLoad();valeLoad();renderCampus();

$('train-close').onclick=()=>closeModal('train-modal');$('train-panoramic').onclick=()=>{const ok=state.runtime?.startExperience?.('coaster');if(ok){closeModal('train-modal');toast('🎢 Montanha-russa panorâmica iniciada • volta completa pelo Campus.');}else toast('O passeio panorâmico não está disponível agora.');};$('chat-close').onclick=()=>closeModal('chat-modal');$('chat-form').onsubmit=e=>{e.preventDefault();sendProximityChat();};$('world-settings-button').onclick=openWorldSettings;$('world-settings-close').onclick=()=>closeModal('world-settings-modal');$('world-settings-apply').onclick=()=>applyWorldSettings().catch(error=>{console.error(error);toast('Não foi possível aplicar as configurações.');});$('world-settings-reset').onclick=()=>{state.graphics={fov:65,fpsCap:60,worldTimeMode:'auto',showPerf:false};state.avatarStyle={...AVATAR_STYLE_PRESETS.casual};syncWorldSettingsForm();};$('fov-range').oninput=()=>{$('fov-value').textContent=`${$('fov-range').value}°`;};document.querySelectorAll('[data-camera-mode]').forEach(button=>button.onclick=()=>{if(state.runtimeMode!=='3d')return toast('Entre no modo 3D para trocar a câmera.');const mode=state.runtime?.setCameraMode?.(button.dataset.cameraMode);if(mode){$('camera-button').textContent={explore:'3ª pessoa',firstperson:'1ª pessoa',wide:'Ampla',campus:'Campus'}[mode]||'Câmera';toast(`Câmera: ${button.textContent}`);}});document.querySelectorAll('[data-avatar-preset]').forEach(button=>button.onclick=()=>applyAvatarPreset(button.dataset.avatarPreset));$('staff-chat-target')?.addEventListener('click',()=>{const id=$('staff-student-modal').dataset.student,person=state.others.find(o=>o.student_id===id);if(person){closeModal('staff-student-modal');openChatWith(person);}});

$('interaction-button').onclick=interact;$('touch-action').onclick=interact;$('interior-map-button').onclick=openInteriorMapModal;$('interior-map-close').onclick=()=>closeModal('interior-map-modal');$('teleport-button').onclick=openTeleportModal;$('teleport-close').onclick=()=>closeModal('teleport-modal');$('teleport-search').oninput=()=>renderTeleportModal();$('teleport-scene-filter').onchange=()=>renderTeleportModal();$('teleport-vale-now').onclick=()=>{closeModal('teleport-modal');teleportToDestination({id:'vale:featured',scene:'vale',name:'Vale do Silício AGV — Praça Central',x:VALE_SPAWN.x,z:VALE_SPAWN.z,kind:'landmark'}).catch(error=>{console.error(error);toast('Não foi possível abrir o Vale agora.');});};$('staff-bring-all').onclick=bringAllStudentsToMe;$('vale-direct-button').onclick=()=>{const action=state.scene==='vale'?returnToCampus():enterVale();Promise.resolve(action).catch(error=>{console.error(error);toast('Não foi possível viajar agora.');});};$('campus-button').onclick=()=>state.scene==='vale'?valeToggle():campusToggle();$('campus-close').onclick=()=>campusToggle(false);$('vale-close').onclick=()=>valeToggle(false);$('vale-search').oninput=()=>renderValeDrawer();$('vale-company-close').onclick=()=>closeModal('vale-company-modal');$('vale-company-enter').onclick=()=>{const id=$('vale-company-enter').dataset.companyId;if(!id)return;closeModal('vale-company-modal');const ok=state.runtime?.enterBuilding?.(id);if(ok){state.valeVisited.add(id);valeSave();renderValeDrawer();toast('Interior carregado sob demanda. Pressione E para sair.');}};$('vale-company-map').onclick=()=>{closeModal('vale-company-modal');valeToggle(true)};$('activity-button').onclick=showActivities;$('activity-close').onclick=()=>closeModal('activity-modal');$('staff-student-close').onclick=()=>closeModal('staff-student-modal');$('staff-moderation-close').onclick=()=>closeModal('staff-moderation-modal');$('staff-moderation').onclick=loadModeration;$('kick-student').onclick=kickStudent;$('quality-button').onclick=cycleQuality;$('action-menu-button').onclick=()=>$('action-menu').classList.toggle('hidden');$('challenge-restart').onclick=()=>state.runtime?.restartChallenge?.();$('challenge-leave').onclick=()=>{const ended=state.runtime?.cancelChallenge?.()||state.runtime?.cancelExperience?.();if(ended){$('challenge-hud')?.classList.add('hidden');document.querySelector('.game-stage')?.classList.remove('challenge-active');}};document.querySelectorAll('[data-local-action]').forEach(b=>b.onclick=()=>localAction(b.dataset.localAction));$('camera-button').onclick=toggleCamera;
document.querySelectorAll('[data-target-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.targetEmote,$('staff-student-modal').dataset.student).then(()=>toast('Interação enviada.')));document.querySelectorAll('[data-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.emote));
$('logout').onclick=async()=>{state.runtime?.stop?.();state.runtime=null;if(gatherChannel){try{await supabase.removeChannel(gatherChannel)}catch(_){}gatherChannel=null;gatherReadyPromise=null;}await proximityChat?.stop?.();proximityChat=null;try{await supabase.functions.invoke('lobby-presence',{body:{action:'leave'}})}catch(_){}await supabase.auth.signOut();await window.AGVFullscreen?.release?.();location.replace('../auth/?returnTo=lobby/')};$('kicked-check').onclick=()=>location.reload();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadActivities().catch(()=>{})});setInterval(()=>{if(!document.hidden)loadActivities().catch(()=>{})},30000);
const recoveryDialog=$('recovery-dialog');
function redirectToUnifiedLogin(message=''){try{if(message)sessionStorage.setItem('agv-auth-message',message)}catch{}location.replace('../auth/?returnTo=lobby/');}
(async()=>{try{const {data:{session}}=await withTimeout(supabase.auth.getSession(),SESSION_TIMEOUT_MS,'auth_session_timeout');if(session){await boot();return}}catch(e){console.warn(e);globalThis.__agvLobbyDiag?.exposeError?.('session_restore_failed',String(e?.message||e||'unknown'));}redirectToUnifiedLogin();})();;
console.info(`AGV Lobby DS ${LOBBY_VERSION} • OAuth Front v58 • Vertical & Dynamic World • Fase H 2D-first • rede ${NETWORK_TIMEOUT_MS}ms • presença protegida por Edge Function`);

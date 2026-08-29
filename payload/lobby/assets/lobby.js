import { supabase, NETWORK_TIMEOUT_MS } from './supabase.js?v=14.10.8.55';
import { SCHOOL_EMAIL_DOMAIN, ACTIVITY_URL, LOBBY_VERSION } from './config.js?v=14.10.8.55';
import { createLobby3D } from './lobby3d.js?v=14.10.8.55';
import { createLobbyLite } from './lobby-lite.js?v=14.10.8.55';
import { createValeLite } from './vale-lite.js?v=14.10.8.55';
import { createVale3D } from './vale3d.js?v=14.10.8.55';
import { VALE_BOUNDS, VALE_FAST_TRAVEL_STATIC, valePresenceToWorld, valeWorldToPresence } from './world/vale-silicio-shared.js?v=14.10.8.55';
import { loadValeRuntime } from './world/vale-silicio-data.js?v=14.10.8.55';
import { worldToPresence, presenceToWorld } from './world/campus-manifest.js?v=14.10.8.55';
import { CAMPUS_EXPERIENCES } from './world/campus-experiences.js?v=14.10.8.55';

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
  player:{x:800,y:500,area:'central'},nearPortal:null,nearStudent:null,nearSeat:null,nearWorldObject:null,seated:false,interior:null,lastPresence:0,toastTimer:null,zoneTimer:null,stopped:false,lastTargetSignal:'',runtime:null,
  portalState:null,emoteRequested:null,campusVisited:new Set(['central']),campusFlags:{greet:false,sit:false,action:false,monitor:false},localAction:null,runtimeMode:null,bootingRuntime:false,
  scene:'campus',savedCampusPlayer:null,valeVisited:new Set(),valeRuntime:null,selectedValeCompany:null,lastGatherToken:null,teleportDestinations:[]
};
const MODE_STORAGE_KEY='agv:lobby:mode-choice';
let challengeStatusTimer=null;
const saveModeChoice=mode=>{try{localStorage.setItem(MODE_STORAGE_KEY,mode)}catch(_){}};
const lastModeChoice=()=>{try{return localStorage.getItem(MODE_STORAGE_KEY)||'lite'}catch(_){return'lite'}};
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


const CAMPUS_TELEPORTS=Object.freeze([
  {id:'campus:central',scene:'campus',name:'Praça Central',x:0,z:0,kind:'landmark',district:'Campus DS'},
  {id:'campus:vale',scene:'campus',name:'Portal do Vale do Silício AGV',x:0,z:-10.5,kind:'portal',district:'Campus DS'},
  {id:'campus:1ds',scene:'campus',name:'1DS — Laboratório',x:-22.5,z:-10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:2ds',scene:'campus',name:'2DS — Laboratório',x:22.5,z:-10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:3ds',scene:'campus',name:'3DS — Laboratório',x:-22.5,z:10.2,kind:'laboratory',district:'Campus DS'},
  {id:'campus:sub',scene:'campus',name:'SUB — Laboratório',x:22.5,z:10.2,kind:'laboratory',district:'Campus DS'},
  ...CAMPUS_EXPERIENCES.filter(item=>item.type!=='vale-portal').map(item=>({id:`campus:${item.id}`,scene:'campus',name:item.name,x:item.x,z:item.z,kind:item.type,district:'Campus DS'}))
]);
function companyTeleportPoint(c){const pos=c?.lot?.world_position||{x:0,z:0},fp=c?.building?.footprint||{},width=Number(fp.width||24),depth=Number(fp.depth||20),rot=Number(c?.lot?.rotation_y_deg||0)*Math.PI/180,dist=(Math.abs(Math.sin(rot))*width+Math.abs(Math.cos(rot))*depth)/2+6;return{x:Number(pos.x||0)+Math.sin(rot)*dist,z:Number(pos.z||0)+Math.cos(rot)*dist};}
async function getTeleportDestinations(){
  const list=[...CAMPUS_TELEPORTS];
  try{
    const runtime=await loadValeRuntime();
    list.push(...VALE_FAST_TRAVEL_STATIC.map(d=>({...d,id:`vale:${d.id}`,scene:'vale',district:'Vale do Silício AGV'})));
    for(const d of runtime.world?.districts||[])list.push({id:`vale:district:${d.id}`,scene:'vale',name:d.name,x:Number(d.center?.x||0),z:Number(d.center?.z||0),kind:'district',district:'Vale do Silício AGV'});
    for(const c of runtime.companies||[]){const e=companyTeleportPoint(c);list.push({id:`vale:company:${c.id}`,scene:'vale',name:c.display_name||c.company_name||c.project_name,x:e.x,z:e.z,kind:'company',district:c.zone||'Empresa estudantil',companyId:c.id});}
  }catch(error){console.warn('Destinos completos do Vale indisponíveis:',error);list.push({id:'vale:praca-fallback',scene:'vale',name:'Vale do Silício AGV — Praça Central',x:0,z:-30,kind:'landmark',district:'Vale do Silício AGV'});}
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
    state.scene=scene;state.interior=null;state.nearPortal=null;state.nearStudent=null;state.nearWorldObject=null;
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
  if(target.interior){const entered=scene==='vale'?state.runtime?.enterBuilding?.(target.interior):state.runtime?.enterInterior?.(target.interior);if(entered)state.interior=target.interior;}
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
function renderCampus(){const list=$('campus-checklist');if(!list)return;list.replaceChildren();let done=0;for(const t of CAMPUS_TASKS){const ok=!!t.done();if(ok)done++;const row=document.createElement('div');row.className='campus-task'+(ok?' done':'');const badge=document.createElement('b');badge.textContent=ok?'✓':'•';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=t.title;const desc=document.createElement('small');desc.textContent=t.desc;info.append(title,desc);row.append(badge,info);list.append(row);}const pct=Math.round(done/CAMPUS_TASKS.length*100);$('campus-progress-text').textContent=`${done}/${CAMPUS_TASKS.length}`;$('campus-progress-bar').style.width=`${pct}%`;if(done===CAMPUS_TASKS.length)$('campus-message').textContent='Campus explorado! Esta conquista é apenas local e não concede benefícios automáticos.';}
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
function handleWorldObject(obj){
  if(!obj)return false;
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
  if(['pool','playground','slide','coaster','tower'].includes(obj.type)){
    const started=state.runtime?.startExperience?.(obj.type),messages={pool:'Pausa no deck da Piscina Neon.',playground:'Balanço do Parquinho DS ativado.',slide:'Subindo para uma descida curta no Escorregador Turbo.',coaster:'Embarque confirmado no Trilho Panorâmico.',tower:'Subida guiada para o mirante iniciada.'};toast(started?(messages[obj.type]||obj.description||obj.name):'Esta atração está indisponível neste modo agora.');return true;
  }
  return false;
}
function interact(){
  if(state.nearStudent){
    if(isStaff()&&state.nearStudent.participant_role==='student')return openStaffTarget(state.nearStudent);
    campusMark('greet');emote('wave',isStaff()?state.nearStudent.student_id:null).then(()=>toast(`Você cumprimentou ${state.nearStudent?.display_name||'o participante'} 👋`));return;
  }
  if(state.seated){const left=state.runtime?.toggleSeat?.(state.nearSeat);toast('Você se levantou do banco.');return;}
  if(state.nearSeat){const sat=state.runtime?.toggleSeat?.(state.nearSeat);if(sat){state.localAction='sit';campusMark('sit');toast('Sentado. Pressione E para levantar.');}return;}
  if(state.nearWorldObject&&handleWorldObject(state.nearWorldObject))return;
  if(!state.nearPortal)return;const z=state.nearPortal,ps=portalState(z);
  if(isStaff())return toast(ps.text);if(z.code!==state.currentClass?.code)return toast(`Você pode visitar ${z.label}, mas as atividades pertencem àquela turma.`);if(ps.open){$('game-stage')?.classList.add('portal-travel');setTimeout(()=>{$('game-stage')?.classList.remove('portal-travel');showActivities()},430)}else toast(ps.text);
}
function renderInteraction(){
  const b=$('interaction');if(state.nearStudent){b.classList.remove('hidden');$('interaction-title').textContent=`${isStaff()&&state.nearStudent.participant_role==='student'?'Interagir':'Cumprimentar'} — ${state.nearStudent.display_name}`;$('interaction-text').textContent=isStaff()&&state.nearStudent.participant_role==='student'?`${className(state.nearStudent.class_id)} • reações e moderação`:'Aproxime-se e pressione E para acenar.';$('interaction-button').textContent=isStaff()&&state.nearStudent.participant_role==='student'?'Opções':'Acenar 👋';return}
  if(state.seated){b.classList.remove('hidden');$('interaction-title').textContent='Banco da Praça';$('interaction-text').textContent='Você está sentado. Pressione E para levantar.';$('interaction-button').textContent='Levantar';return}
  if(state.nearSeat){b.classList.remove('hidden');$('interaction-title').textContent='Banco da Praça';$('interaction-text').textContent='Faça uma pausa no campus.';$('interaction-button').textContent='Sentar';return}
  if(state.nearWorldObject){const o=state.nearWorldObject;b.classList.remove('hidden');$('interaction-title').textContent=o.name||o.label||'Campus';const copy={npc:'Monitor virtual • orientação do campus',meet:'Ponto de encontro da turma',kiosk:'Totem interativo do campus','building-entrance':'Porta automática com sensor • entrar no laboratório','interior-exit':'Porta automática com sensor • voltar à praça','lab-terminal':'Estação interativa • sentar e ligar o monitor',smartboard:'Quadro inteligente • conteúdo contextual','presentation-spot':isStaff()?'Posição de apresentação da equipe':'Área reservada à equipe pedagógica','lab-portal':'Portal pedagógico interno',parkour:'Circuito de saltos e checkpoints • treino local sem nota',pool:'Piscina Neon • área de convivência',playground:'Parquinho DS • balanço e gangorra',slide:'Escorregador Turbo • acesso e descida',coaster:'Trilho Panorâmico • passeio automático curto',tower:'Torre de Escadas • subida ao mirante','vale-portal':'Portal para a cidade tecnológica dos projetos dos alunos','return-portal':'Retornar ao Campus DS','vale-company':'Empresa/projeto estudantil • conhecer equipe e entrar no prédio','vale-company-exit':'Sair do prédio e voltar às ruas do Vale','vale-npc':'NPC institucional • orientação e acolhimento','vale-environment':'Ambiente institucional do Campus AGV','vale-sport':'Complexo esportivo • preparado para futuros minijogos','vale-hangar':'Hangar e mobilidade do Campus','vale-racetrack':'Pista de corrida e exploração','vale-vehicle':'Veículo de ambientação e mobilidade'};$('interaction-text').textContent=copy[o.type]||o.description||'Objeto interativo';$('interaction-button').textContent=o.type==='npc'?'Conversar':o.type==='building-entrance'?'Entrar':o.type==='interior-exit'?'Sair':o.type==='lab-terminal'?'Usar estação':o.type==='smartboard'?'Exibir':o.type==='presentation-spot'?(isStaff()?'Apresentar':'Reservado'):o.type==='lab-portal'?'Abrir portal':o.interaction||(o.type==='parkour'?'Iniciar circuito':'Explorar');return}
  if(!state.nearPortal){b.classList.add('hidden');return}const z=state.nearPortal,ps=portalState(z);b.classList.remove('hidden');$('interaction-title').textContent=`${z.portal.label} — ${z.label}`;$('interaction-text').textContent=ps.text;$('interaction-button').textContent=ps.open?'Abrir portal':'Ver estado';
}
function areaText(key){if(key==='vale-silicio')return'Vale do Silício AGV';const z=zones.find(x=>x.key===key);return z?`Área ${z.label} — ${z.name}`:'Praça Central'}
function showZoneBanner(key){campusMark('area',key);const title=areaText(key),wrap=$('zone-banner');$('zone-banner-title').textContent=title;wrap.classList.remove('hidden');clearTimeout(state.zoneTimer);state.zoneTimer=setTimeout(()=>wrap.classList.add('hidden'),2100)}
function localAction(kind){if(!state.runtime)return;if(kind!=='clear')campusMark('action');state.localAction=kind==='clear'?null:kind;state.runtime.setLocalAction?.(state.localAction);$('action-menu')?.classList.add('hidden');if(kind!=='clear')toast(kind==='dance'?'Dança iniciada 🕺':kind==='cheer'?'Comemoração 🎉':'Agachado. Movimente-se para cancelar.')}
function cycleQuality(){if(state.runtimeMode==='lite'){toast('O mapa 2D usa qualidade automática e leve. Use “Entrar no 3D” para a experiência imersiva.');return}const current=state.runtime?.getQuality?.()||'medium',order=['low','medium','high','ultra'],next=order[(order.indexOf(current)+1)%order.length];try{localStorage.setItem('agv:lobby:quality',next)}catch(_){}state.runtime?.setQuality?.(next)}
function toggleCamera(){if(state.runtimeMode!=='3d')return toast('No mapa 2D, use o scroll para aproximar ou afastar.');const mode=state.runtime?.toggleCamera?.()||'explore';const labels={explore:'Exploração',wide:'Câmera ampla',campus:'Visão campus'};$('camera-button').textContent=labels[mode]||'Câmera';toast(mode==='campus'?'Visão elevada do campus. Arraste para girar 360° e use o scroll para zoom.':mode==='wide'?'Câmera ampla ativada. Arraste para olhar ao redor.':'Câmera de exploração ativada. Ela aproxima automaticamente ao encontrar paredes e obstáculos.')}
function perfUpdate(info={}){globalThis.__agvLobbyDiag?.update?.({runtime:{fps:Number(info.fps||0)||null,quality:String(info.quality||'')||null,avatar:state.runtime?.getAvatarMode?.()||null,profile:info.profile||null}});const el=$('perf-badge');if(!el)return;const fps=Number(info.fps||0),show=!!fps&&fps<42;const avatar=state.runtime?.getAvatarMode?.()==='rigged-glb'?'GLB':'PROC';el.textContent=`${fps||'—'} FPS • ${String(info.quality||'').toUpperCase()} • ${avatar}`;el.classList.toggle('hidden',!show);el.classList.remove('warn','bad');if(fps&&fps<28)el.classList.add('bad');else if(fps&&fps<42)el.classList.add('warn');}

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
  const finished=['complete','cancel','experience-complete','experience-cancel'].includes(event.type);if(finished){challengeStatusTimer=setTimeout(()=>{hud.classList.add('hidden');stage?.classList.remove('challenge-active');updateModeUI(state.runtimeMode)},3200);}}
function runtimeHooks(){return{canvas:$('game3d'),zones,state,isStaff,className,onInteract:interact,onQualityChange:q=>{globalThis.__agvLobbyDiag?.update?.({runtime:{quality:q}});$('quality-button').textContent=state.runtimeMode==='lite'?'Leve':q==='ultra'?'Ultra':q==='high'?'Alto':q==='low'?'Eco':'Médio'},onPerf:perfUpdate,onError:m=>toast(m),onContextLost:()=>{if(state.runtimeMode==='3d'&&!state.bootingRuntime)startLite('webgl_context_lost').catch(()=>{})},onChallengeEvent:challengeEvent,onAreaChange:showZoneBanner,onInteriorChange:e=>{state.interior=e.inside?e.key:null;showZoneBanner(e.inside?e.key:(state.scene==='vale'?'vale-silicio':'central'));toast(e.inside?`${String(e.label||e.key).toUpperCase()} • ambiente interno`:(state.scene==='vale'?'Vale do Silício AGV • ambiente externo':'Praça Central • ambiente externo'));},onPlayerState:p=>{state.player.x=p.x;state.player.y=p.y;state.player.area=p.area;state.interior=p.interior||null;state.nearPortal=p.nearPortal;state.nearStudent=p.nearStudent;state.nearSeat=p.nearSeat||null;state.nearWorldObject=p.nearWorldObject||null;state.seated=!!p.seated;$('area-label').textContent=p.interior?(state.scene==='vale'?`Prédio • ${state.selectedValeCompany?.display_name||String(p.interior)}`:`Laboratório ${String(p.interior).toUpperCase()}`):areaText(p.area);renderInteraction();renderValeMinimap();presence();}}}
async function startLite(reason='fallback'){
  globalThis.__agvLobbyDiag?.record?.('runtime_lite',{reason});globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'lite',quality:'lite',firstFrame:true}});
  setModeTransition(true,'Abrindo mapa 2D');state.runtime?.stop?.();state.runtime=null;freshCanvas();state.runtimeMode='lite';showLiteBadge(true);setLoading(state.scene==='vale'?'Gerando distritos, empresas, ruas e atrações do Vale…':'Preparando o mapa interativo com presença em tempo real…',state.scene==='vale'?'Mapa 2D do Vale do Silício AGV':'Mapa 2D do Campus');
  state.runtime=state.scene==='vale'?await createValeLite({...runtimeHooks(),signal:null}):createLobbyLite(runtimeHooks());$('quality-button').textContent='Leve';$('camera-button').textContent='Mapa';$('perf-badge')?.classList.add('hidden');updateModeUI('lite');
  await securityTelemetry('client.lobby_lite_mode','info',{reason,surface:state.scene==='vale'?'vale-silicio':'lobby-3d'});requestAnimationFrame(()=>setTimeout(()=>{finishLoading();setModeTransition(false)},180));showZoneBanner(state.scene==='vale'?'vale-silicio':state.player.area);if(state.scene==='vale')renderValeDrawer();return state.runtime;
}
async function start3D({allowFallback=true}={}){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'runtime_3d_loading'});globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'3d',firstFrame:false}});
  if(state.bootingRuntime)return state.runtime;state.bootingRuntime=true;setModeTransition(true,'Entrando no ambiente 3D');state.runtime?.stop?.();state.runtime=null;freshCanvas();state.runtimeMode='3d';showLiteBadge(false);setLoading(state.scene==='vale'?'Gerando cidade tecnológica, prédios, NPCs e mobilidade…':'Montando praça, edifícios, personagens e presença online…',state.scene==='vale'?'Entrando no Vale do Silício AGV 3D':'Entrando no Campus DS 3D');
  const controller=new AbortController();let timer=null,firstFrameResolve;const firstFrame=new Promise(resolve=>{firstFrameResolve=resolve});
  try{
    const savedQuality=(()=>{try{const q=localStorage.getItem('agv:lobby:quality');return ['low','medium','high','ultra'].includes(q)?q:null}catch(_){return null}})();
    const factory=state.scene==='vale'?createVale3D:createLobby3D;const create=factory({...runtimeHooks(),signal:controller.signal,initialQuality:savedQuality,onFirstFrame:()=>firstFrameResolve?.()});
    const timeoutMs=COARSE_POINTER?11500:13500;const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('lobby_3d_boot_timeout'))},timeoutMs)});
    state.runtime=await Promise.race([create,timeout]);clearTimeout(timer);setLoading('Sincronizando câmera 360° e personagens…',state.scene==='vale'?'Vale quase pronto':'Campus quase pronto');
    await Promise.race([firstFrame,new Promise((_,reject)=>setTimeout(()=>reject(new Error('lobby_3d_first_frame_timeout')),5500))]);
    state.runtimeMode='3d';updateModeUI('3d');globalThis.__agvLobbyDiag?.update?.({runtime:{mode:'3d',quality:state.runtime?.getQuality?.()||null,firstFrame:true}});globalThis.__agvLobbyDiag?.record?.('stage',{stage:'runtime_3d_ready'});{const q=state.runtime?.getQuality?.();$('quality-button').textContent=q==='ultra'?'Ultra':q==='high'?'Alto':q==='low'?'Eco':'Médio';}finishLoading();setModeTransition(false);showZoneBanner(state.player.area);return state.runtime;
  }catch(error){
    clearTimeout(timer);controller.abort();state.runtime?.stop?.();state.runtime=null;globalThis.__agvLobbyDiag?.record?.('runtime_3d_failed',{message:String(error?.message||error).slice(0,160)});console.error('Falha no boot 3D:',error);await securityTelemetry('client.webgl_init_failed','warning',{message:String(error?.message||error),mobile:matchMedia('(pointer:coarse)').matches});
    setLoading('O ambiente 3D não ficou pronto a tempo. Seus dados estão seguros; você pode continuar no mapa 2D e tentar o 3D novamente quando quiser.','Continuar no Campus',true);
    if(allowFallback){await new Promise(r=>setTimeout(r,650));return startLite(String(error?.message||'3d_failed'))}setModeTransition(false);throw error;
  }finally{state.bootingRuntime=false}
}
async function enterVale(){
  if(state.scene==='vale'||state.bootingRuntime)return;state.savedCampusPlayer={...state.player};state.scene='vale';state.interior=null;state.nearPortal=null;state.nearStudent=null;state.nearWorldObject=null;const spawn={x:800,y:453,area:'vale-silicio'};state.player={...state.player,...spawn};document.body.dataset.scene='vale';campusToggle(false);toast('Entrando no Vale do Silício AGV…');if(state.runtimeMode==='3d')await start3D({allowFallback:true});else await startLite('enter_vale');renderValeDrawer();showZoneBanner('vale-silicio');}
async function returnToCampus(){
  if(state.scene!=='vale'||state.bootingRuntime)return;state.scene='campus';state.interior=null;state.nearWorldObject=null;state.player=state.savedCampusPlayer?{...state.savedCampusPlayer}:{...state.player,x:800,y:500,area:'central'};state.savedCampusPlayer=null;document.body.dataset.scene='campus';valeToggle(false);toast('Voltando ao Campus DS…');if(state.runtimeMode==='3d')await start3D({allowFallback:true});else await startLite('return_from_vale');showZoneBanner(state.player.area||'central');}
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
  await loadActivities();globalThis.__agvLobbyDiag?.record?.('stage',{stage:'activities_loaded'});showLogin(false);state.portalState=portalState;state.emoteRequested=kind=>emote(kind,state.nearStudent?.student_id||null);ensureGatherChannel();
  // Regra v14.10.8.55: todo acesso começa no 2D. O aluno decide quando carregar o 3D.
  await startLite(lastModeChoice()==='3d'?'default_2d_first_previous_3d':'default_2d_first');
  await presence(true);poll();globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_ready'});
}

$('retry-3d').onclick=()=>retry3D();$('enter-lite').onclick=()=>{saveModeChoice('lite');startLite('manual_recovery').catch(()=>{})};$('mode-button').onclick=()=>toggleRuntimeMode().catch(error=>{console.error(error);toast('Não foi possível alternar o modo agora.');});
campusLoad();valeLoad();renderCampus();
$('interaction-button').onclick=interact;$('touch-action').onclick=interact;$('teleport-button').onclick=openTeleportModal;$('teleport-close').onclick=()=>closeModal('teleport-modal');$('teleport-search').oninput=()=>renderTeleportModal();$('teleport-scene-filter').onchange=()=>renderTeleportModal();$('teleport-vale-now').onclick=()=>{closeModal('teleport-modal');teleportToDestination({id:'vale:featured',scene:'vale',name:'Vale do Silício AGV — Praça Central',x:0,z:-30,kind:'landmark'}).catch(error=>{console.error(error);toast('Não foi possível abrir o Vale agora.');});};$('staff-bring-all').onclick=bringAllStudentsToMe;$('vale-direct-button').onclick=()=>{const action=state.scene==='vale'?returnToCampus():enterVale();Promise.resolve(action).catch(error=>{console.error(error);toast('Não foi possível viajar agora.');});};$('campus-button').onclick=()=>state.scene==='vale'?valeToggle():campusToggle();$('campus-close').onclick=()=>campusToggle(false);$('vale-close').onclick=()=>valeToggle(false);$('vale-search').oninput=()=>renderValeDrawer();$('vale-company-close').onclick=()=>closeModal('vale-company-modal');$('vale-company-enter').onclick=()=>{const id=$('vale-company-enter').dataset.companyId;if(!id)return;closeModal('vale-company-modal');const ok=state.runtime?.enterBuilding?.(id);if(ok){state.valeVisited.add(id);valeSave();renderValeDrawer();toast('Interior carregado sob demanda. Pressione E para sair.');}};$('vale-company-map').onclick=()=>{closeModal('vale-company-modal');valeToggle(true)};$('activity-button').onclick=showActivities;$('activity-close').onclick=()=>closeModal('activity-modal');$('staff-student-close').onclick=()=>closeModal('staff-student-modal');$('staff-moderation-close').onclick=()=>closeModal('staff-moderation-modal');$('staff-moderation').onclick=loadModeration;$('kick-student').onclick=kickStudent;$('quality-button').onclick=cycleQuality;$('action-menu-button').onclick=()=>$('action-menu').classList.toggle('hidden');$('challenge-restart').onclick=()=>state.runtime?.restartChallenge?.();$('challenge-leave').onclick=()=>{const ended=state.runtime?.cancelChallenge?.()||state.runtime?.cancelExperience?.();if(ended){$('challenge-hud')?.classList.add('hidden');document.querySelector('.game-stage')?.classList.remove('challenge-active');}};document.querySelectorAll('[data-local-action]').forEach(b=>b.onclick=()=>localAction(b.dataset.localAction));$('camera-button').onclick=toggleCamera;
document.querySelectorAll('[data-target-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.targetEmote,$('staff-student-modal').dataset.student).then(()=>toast('Interação enviada.')));document.querySelectorAll('[data-emote]').forEach(b=>b.onclick=()=>emote(b.dataset.emote));
$('logout').onclick=async()=>{state.runtime?.stop?.();state.runtime=null;if(gatherChannel){try{await supabase.removeChannel(gatherChannel)}catch(_){}gatherChannel=null;gatherReadyPromise=null;}try{await supabase.functions.invoke('lobby-presence',{body:{action:'leave'}})}catch(_){}await supabase.auth.signOut();await window.AGVFullscreen?.release?.();location.reload()};$('kicked-check').onclick=()=>location.reload();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadActivities().catch(()=>{})});setInterval(()=>{if(!document.hidden)loadActivities().catch(()=>{})},30000);
const recoveryDialog=$('recovery-dialog');
$('forgot-password-btn')?.addEventListener('click',()=>{const email=String($('email')?.value||'').trim().toLowerCase();$('recovery-email').value=email;$('recovery-cgm').value='';$('recovery-message').textContent='';$('recovery-message').classList.remove('error');recoveryDialog?.showModal();});
$('recovery-close-btn')?.addEventListener('click',()=>recoveryDialog?.close());
$('recovery-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const email=String($('recovery-email').value||'').trim().toLowerCase(),cgm=String($('recovery-cgm').value||'').replace(/\D/g,''),msg=$('recovery-message'),submit=event.submitter;
  msg.textContent='';msg.classList.remove('error');
  if(!email.endsWith('@escola.pr.gov.br')){msg.textContent='Use seu e-mail institucional @escola.pr.gov.br.';msg.classList.add('error');return;}
  if(!/^\d{6,12}$/.test(cgm)){msg.textContent='Informe um CGM válido, usando somente números.';msg.classList.add('error');return;}
  submit.disabled=true;submit.textContent='Redefinindo…';
  try{
    const {data,error}=await withTimeout(supabase.functions.invoke('temporary-cgm-password-reset',{body:{email,cgm}}),AUTH_TIMEOUT_MS,'auth_cgm_recovery_timeout');
    if(error)throw error;
    msg.textContent=data?.message||'Se os dados informados estiverem corretos, a senha foi redefinida para o CGM. No próximo acesso, crie uma nova senha pessoal.';
  }catch(error){console.error(error);msg.textContent='Não foi possível concluir a redefinição agora. Se houve muitas tentativas, aguarde alguns minutos e tente novamente.';msg.classList.add('error');}
  finally{submit.disabled=false;submit.textContent='Redefinir senha para CGM';}
});

let controlsHintTimer=null;function wakeControlsHint(){if(COARSE_POINTER)return;const hint=document.querySelector('.desktop-controls');if(!hint)return;hint.classList.remove('controls-idle');clearTimeout(controlsHintTimer);controlsHintTimer=setTimeout(()=>hint.classList.add('controls-idle'),7500)}window.addEventListener('keydown',wakeControlsHint);window.addEventListener('pointerdown',wakeControlsHint,{passive:true});wakeControlsHint();

$('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter,mail=email($('email').value),password=$('password').value;if(!mail.endsWith(SCHOOL_EMAIL_DOMAIN))return msg(`Use o e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`,true);await window.AGVFullscreen?.request({silent:true});btn.disabled=true;msg('Entrando no Campus DS…');try{await signIn(mail,password);await securityTelemetry('auth.login_success','info',{surface:state.scene==='vale'?'vale-silicio':'lobby-3d'});await boot();msg()}catch(err){console.error(err);globalThis.__agvLobbyDiag?.exposeError?.('login_or_boot_failed',String(err?.message||err||'unknown'));msg(lobbyErrorMessage(err),true);try{await supabase.auth.signOut()}catch(_){}}finally{btn.disabled=false}});
(async()=>{try{const {data:{session}}=await withTimeout(supabase.auth.getSession(),SESSION_TIMEOUT_MS,'auth_session_timeout');if(session){await boot();return}}catch(e){console.warn(e);globalThis.__agvLobbyDiag?.exposeError?.('session_restore_failed',String(e?.message||e||'unknown'));msg(lobbyErrorMessage(e),true)}showLogin(true)})();
console.info(`AGV Lobby DS ${LOBBY_VERSION} • Teletransporte v55 • Fase H 2D-first • rede ${NETWORK_TIMEOUT_MS}ms • presença protegida por Edge Function`);

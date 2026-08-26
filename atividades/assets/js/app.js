import { openStaffPanel, isStaff } from './admin.js?v=14.10.8.20';
import { mountWorkspace, unmountWorkspace } from './workspace.js?v=14.10.8.20';
import { callActivityProgress } from './supervision.js?v=14.10.8.20';
import { requestPortalFullscreen, setPortalFullscreenRequired } from './fullscreen.js?v=14.10.8.18';
import { supabase, SUPABASE_SDK_AVAILABLE, SUPABASE_SDK_ERROR } from './supabase.js?v=14.10.8.18';
import { SCHOOL_EMAIL_DOMAIN } from './config.js?v=14.10.8.18';
import { EXERCISE_MANIFEST } from '../data/exercise-manifest.js?v=14.10.8.18';
import { EXERCISE_MANIFEST_CURRENT } from '../data/exercise-manifest-current.js?v=14.10.8.18';
import { loadPersonalizedExperienceContext, renderPersonalizedExperienceDashboard, renderPersonalizedAssignment, clearPersonalizedTheme } from './personalized-experience.js?v=14.10.8.20';

const $ = (id) => document.getElementById(id);
const views = ['loading-view', 'login-view', 'password-view', 'dashboard-view', 'personalized-experience-view', 'exercise-view', 'staff-view'];
let currentProfile = null;
let currentClass = null;
let currentSubjects = [];
let currentExercises = [];
let currentProgress = [];
let currentStudentReleases = [];
let currentClassReleases = [];
let currentLegacyClaims = [];
let currentStaffAccess = false;
let passwordRecoveryMode = false;
let lobbyDeepLinkHandled = false;
let lastDashboardSnapshot = null;
let exerciseOpening = false;
let personalizedExperienceContext = null;

const CRITICAL_REQUEST_TIMEOUT_MS = 10000;
const OPTIONAL_REQUEST_TIMEOUT_MS = 4500;
const DASHBOARD_BOOT_TIMEOUT_MS = 22000;
const GLOBAL_BOOT_WATCHDOG_MS = 60000;
let portalBootRun = 0;
let portalBootWatchdog = null;

function timeoutError(label) {
  const error = new Error(`Tempo limite excedido em ${label}.`);
  error.code = 'AGV_BOOT_TIMEOUT';
  error.stage = label;
  return error;
}

function withTimeout(task, ms = CRITICAL_REQUEST_TIMEOUT_MS, label = 'operação') {
  let timer;
  return Promise.race([
    Promise.resolve(task),
    new Promise((_, reject) => { timer = setTimeout(() => reject(timeoutError(label)), ms); }),
  ]).finally(() => clearTimeout(timer));
}

function setLoadingState(title = 'Carregando sua área...', detail = '') {
  $('loading-spinner')?.classList.remove('hidden');
  if ($('loading-title')) $('loading-title').textContent = title;
  if ($('loading-detail')) $('loading-detail').textContent = detail;
  $('loading-recovery-actions')?.classList.add('hidden');
}

function showLoadingRecovery(message, detail = '') {
  $('loading-spinner')?.classList.add('hidden');
  if ($('loading-title')) $('loading-title').textContent = message || 'Não foi possível concluir o carregamento.';
  if ($('loading-detail')) $('loading-detail').textContent = detail || 'Sua sessão e seus arquivos foram preservados. Você pode tentar novamente.';
  $('loading-recovery-actions')?.classList.remove('hidden');
  showView('loading-view');
}

function armBootWatchdog(runId) {
  clearTimeout(portalBootWatchdog);
  portalBootWatchdog = setTimeout(() => {
    if (runId !== portalBootRun) return;
    showLoadingRecovery('O carregamento está demorando mais que o esperado.', 'Verifique sua conexão e tente novamente. Se continuar, renove a sessão.');
    securityTelemetry('client.portal_boot_timeout', { source: 'atividades', stage: 'global_watchdog' });
  }, GLOBAL_BOOT_WATCHDOG_MS);
}

function clearBootWatchdog(runId) {
  if (runId !== portalBootRun) return;
  clearTimeout(portalBootWatchdog);
  portalBootWatchdog = null;
}

function showView(id) {
  views.forEach((viewId) => $(viewId)?.classList.toggle('hidden', viewId !== id));
}

function setSessionHeader(show) {
  $('session-actions').classList.toggle('hidden', !show);
  if (show && currentProfile) $('session-name').textContent = currentProfile.full_name || 'Aluno';
  if (show && currentClass) $('session-class').textContent = currentClass.name || '';
}

function humanStatus(status) {
  return ({ not_started: 'Disponível', in_progress: 'Em andamento', completed: 'Concluído', blocked: 'Bloqueado' })[status] || 'Disponível';
}
function progressLabel(progress){
  if(progress?.submitted_score!==null&&progress?.submitted_score!==undefined){
    const score=Math.round(Number(progress.submitted_score||0));
    return progress?.status==='completed'?`Concluído • ${score}%`:`Entrega parcial • ${score}%`;
  }
  if(progress?.auto_score_at)return `Autocorreção • ${Math.round(Number(progress.auto_score||0))}%`;
  return humanStatus(progress?.status||'not_started');
}

const CONFIRMED_ACADEMIC_POINTS={
  'introducao-programacao':{from:1,to:6,value:0.75},
  'programacao-front-end':{from:1,to:20,value:0.20},
  'programacao-desenvolvimento-sistemas':{from:1,to:8,value:0.50}
};
function academicMaxPoints(exercise){
  const configured=Number(exercise?.config?.academic_max_points);
  if(Number.isFinite(configured)&&configured>0)return configured;
  const subject=currentSubjects.find((item)=>String(item.id)===String(exercise?.subject_id));
  const rule=CONFIRMED_ACADEMIC_POINTS[String(subject?.slug||'')];
  const number=Number(exercise?.exercise_number);
  return rule&&number>=rule.from&&number<=rule.to?rule.value:null;
}
function formatAcademicPoints(value){
  const number=Number(value);
  return Number.isFinite(number)?number.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
}
function academicEarnedPoints(exercise,progress){
  const max=academicMaxPoints(exercise);
  if(max===null||progress?.submitted_score===null||progress?.submitted_score===undefined)return null;
  return Math.max(0,Math.min(max,max*(Number(progress.submitted_score)||0)/100));
}
function academicValueText(exercise){const max=academicMaxPoints(exercise);return max===null?'':`Vale ${formatAcademicPoints(max)}`;}

function exerciseManifest(exercise) {
  const subject=currentSubjects.find((s)=>s.id===exercise?.subject_id);
  return subject?.slug ? (EXERCISE_MANIFEST_CURRENT[`${subject.slug}:${exercise.exercise_number}`]||EXERCISE_MANIFEST[`${subject.slug}:${exercise.exercise_number}`]||null) : null;
}
function exerciseDisplayTitle(exercise) {
  const title=String(exerciseManifest(exercise)?.titulo||exercise?.title||'Exercício');
  return title.replace(/^Exercício\s+\d+\s*[—-]\s*/i,'').trim();
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function securityTelemetry(action='session.check', payload={}) {
  try {
    const { data, error } = await supabase.functions.invoke('security-telemetry', { body: { action, payload } });
    if (error) return null;
    return data || null;
  } catch (_) { return null; }
}

function securitySessionOnce(source='atividades') {
  try {
    const key = `agv:security:session:${currentProfile?.id || 'unknown'}:${source}`;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < 30 * 60 * 1000) return;
    sessionStorage.setItem(key, String(Date.now()));
  } catch (_) {}
  securityTelemetry('session.check', { source });
}

async function loadIdentity() {
  setLoadingState('Carregando sua área...', 'Validando sua sessão.');
  const { data: { user }, error: userError } = await withTimeout(supabase.auth.getUser(), CRITICAL_REQUEST_TIMEOUT_MS, 'auth.getUser');
  if (userError || !user) return null;

  setLoadingState('Carregando sua área...', 'Carregando seu cadastro.');
  const { data: profile, error: profileError } = await withTimeout(
    supabase.from('profiles').select('id, full_name, email, role, active, must_change_password, first_login_at, last_login_at, password_changed_at').eq('id', user.id).single(),
    CRITICAL_REQUEST_TIMEOUT_MS,
    'profiles'
  );
  if (profileError) throw profileError;

  currentProfile = profile;
  currentStaffAccess = false;
  try {
    setLoadingState('Carregando sua área...', 'Confirmando permissões.');
    const { data: staffStatus, error: staffError } = await withTimeout(
      supabase.functions.invoke('staff-dashboard', { body: { action: 'staff_status' } }),
      OPTIONAL_REQUEST_TIMEOUT_MS,
      'staff_status'
    );
    if (!staffError && staffStatus?.staff === true) currentStaffAccess = true;
  } catch (error) {
    console.warn('[AGV] Verificação complementar de staff indisponível; seguindo com o perfil principal.', error);
  }
  document.getElementById('staff-btn')?.classList.toggle('hidden', !(isStaff(profile) || currentStaffAccess));

  setLoadingState('Carregando sua área...', 'Identificando sua turma.');
  const { data: memberships, error: membershipError } = await withTimeout(
    supabase.from('class_memberships').select('class_id,is_primary,joined_at').eq('user_id', user.id).eq('active', true).order('is_primary', { ascending: false }).order('joined_at', { ascending: false }).limit(1),
    CRITICAL_REQUEST_TIMEOUT_MS,
    'class_memberships'
  );
  if (membershipError) throw membershipError;

  if (memberships?.length) {
    const { data: cls, error: classError } = await withTimeout(
      supabase.from('classes').select('id, code, name, shift, school_year').eq('id', memberships[0].class_id).single(),
      CRITICAL_REQUEST_TIMEOUT_MS,
      'classes'
    );
    if (classError) throw classError;
    currentClass = cls;
  } else {
    currentClass = null;
  }

  return { user, profile, class: currentClass };
}

async function routeAuthenticatedUser() {
  const runId = ++portalBootRun;
  showView('loading-view');
  setLoadingState('Carregando sua área...', 'Validando sua sessão.');
  armBootWatchdog(runId);
  try {
    const identity = await loadIdentity();
    if (runId !== portalBootRun) return;
    if (!identity) {
      currentProfile = null;
      currentClass = null;
      setSessionHeader(false);
      showView('login-view');
      return;
    }

    setSessionHeader(true);
    let homeStudyAuthorized=false;
    if(identity.profile.role==='student'&&!currentStaffAccess){
      try{
        setLoadingState('Carregando sua área...', 'Aplicando seus recursos de aprendizagem.');
        const {data:adaptationRows}=await withTimeout(
          supabase.from('student_accommodations').select('config').eq('student_id',identity.profile.id).is('exercise_id',null).eq('accommodation_type','learning_mode').eq('active',true).order('updated_at',{ascending:false}).limit(3),
          OPTIONAL_REQUEST_TIMEOUT_MS,
          'student_accommodations'
        );
        homeStudyAuthorized=(adaptationRows||[]).some(row=>{const sup=row?.config?.supervision||{};const mode=String(sup.mode||'');return mode==='home_study'||mode==='relaxed'||sup.require_fullscreen===false;});
      }catch(error){console.warn('[AGV] Não foi possível confirmar modo domiciliar; acesso seguirá com a política padrão.',error);}
    }
    const requireStudentFullscreen=identity.profile.role==='student'&&!currentStaffAccess&&!homeStudyAuthorized;
    setPortalFullscreenRequired(requireStudentFullscreen);
    if(!requireStudentFullscreen&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});

    if (passwordRecoveryMode) {
      $('password-description').textContent = 'Crie uma nova senha para recuperar seu acesso. Use pelo menos 8 caracteres, com letra e número.';
      showView('password-view');
      return;
    }

    if (!identity.profile.active) {
      await withTimeout(supabase.auth.signOut(), OPTIONAL_REQUEST_TIMEOUT_MS, 'auth.signOut').catch(()=>{});
      setLoginError('Seu acesso está inativo. Procure o professor responsável.');
      showView('login-view');
      return;
    }

    securitySessionOnce(currentStaffAccess || isStaff(identity.profile) ? 'atividades-staff' : 'atividades-student');

    if (identity.profile.must_change_password) {
      $('password-description').textContent = currentStaffAccess
        ? 'Seu acesso de professor/admin foi validado. Crie sua senha pessoal para concluir o primeiro acesso.'
        : 'Por segurança, o CGM é apenas uma senha temporária. Defina uma nova senha para liberar os exercícios.';
      showView('password-view');
      return;
    }

    if (currentStaffAccess || isStaff(identity.profile)) {
      setLoadingState('Carregando sua área...', 'Abrindo o painel da equipe.');
      await withTimeout(openStaffPanel(), DASHBOARD_BOOT_TIMEOUT_MS, 'staff_panel');
      return;
    }

    setLoadingState('Carregando sua área...', 'Preparando suas atividades.');
    await withTimeout(renderDashboard(), DASHBOARD_BOOT_TIMEOUT_MS, 'dashboard');
  } catch (error) {
    if (runId !== portalBootRun) return;
    console.error(error);
    const stage = String(error?.stage || 'inicialização');
    if (error?.code === 'AGV_BOOT_TIMEOUT') {
      securityTelemetry('client.portal_boot_timeout', { source: 'atividades', stage });
      showLoadingRecovery('Não foi possível concluir o carregamento a tempo.', `A etapa “${stage}” demorou demais. Sua sessão foi preservada; tente novamente.`);
    } else {
      securityTelemetry('client.portal_boot_error', { source: 'atividades', stage, message: String(error?.message || '').slice(0, 180) });
      showLoadingRecovery('Não foi possível carregar sua área.', 'O serviço respondeu com erro. Tente novamente; se continuar, renove a sessão.');
    }
  } finally {
    clearBootWatchdog(runId);
  }
}


let forcedSessionExitRunning=false;
async function forceSessionExit(message='Sua sessão foi encerrada. Entre novamente para continuar.'){
  if(forcedSessionExitRunning)return;
  forcedSessionExitRunning=true;
  try{await unmountWorkspace().catch(()=>{});}catch(_){}
  currentProfile=null;currentClass=null;currentSubjects=[];currentExercises=[];currentProgress=[];currentStudentReleases=[];currentClassReleases=[];currentLegacyClaims=[];currentStaffAccess=false;lastDashboardSnapshot=null;passwordRecoveryMode=false;
  setPortalFullscreenRequired(false);
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  setSessionHeader(false);setLoginError(message||'');showView('login-view');
  setTimeout(()=>{forcedSessionExitRunning=false;},600);
}
window.addEventListener('agv:session-invalid',event=>{const code=String(event?.detail?.code||'');forceSessionExit(code==='session_claim_missing'?'Sua sessão precisa ser renovada. Entre novamente para continuar.':'Sua sessão foi encerrada pelo sistema. Entre novamente para continuar.');});

function setLoginError(message = '') {
  $('login-error').textContent = message;
  $('login-error').classList.toggle('hidden', !message);
}

function setPasswordError(message = '') {
  $('password-error').textContent = message;
  $('password-error').classList.toggle('hidden', !message);
}

$('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoginError();
  const email = normalizeEmail($('email').value);
  const password = $('password').value;

  if (!email.endsWith(SCHOOL_EMAIL_DOMAIN)) {
    setLoginError(`Use seu e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`);
    return;
  }
  if (!password) {
    setLoginError('Informe sua senha. No primeiro acesso do aluno, use o CGM.');
    return;
  }

  await requestPortalFullscreen({silent:true});

  const submit = event.submitter;
  submit.disabled = true;
  submit.textContent = 'Entrando...';
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (!signInError) {
      securityTelemetry('auth.login_success', { source: 'atividades' });
      await routeAuthenticatedUser();
      return;
    }

    // Primeiro acesso do aluno: senha numérica = CGM; o banco valida
    // e-mail + CGM + matrícula. Professor/Admin é provisionado pelo administrador
    // com credencial temporária individual e NÃO pode se autocadastrar.
    const looksLikeCgm = /^\d{6,12}$/.test(password);
    if (!looksLikeCgm) throw signInError;

    submit.textContent = 'Validando primeiro acesso...';
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cgm: password },
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });

    if (signUpError) throw signUpError;

    if (signUpData?.session) {
      securityTelemetry('auth.login_success', { source: 'atividades-first-access' });
      await routeAuthenticatedUser();
      return;
    }

    // O trigger confirma automaticamente cadastros validados. Caso o SDK não
    // devolva sessão na mesma resposta, tentamos autenticar novamente.
    const { error: firstSignInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!firstSignInError) {
      securityTelemetry('auth.login_success', { source: 'atividades-first-access' });
      await routeAuthenticatedUser();
      return;
    }
    throw firstSignInError;
  } catch (error) {
    console.error(error);
    setLoginError('E-mail ou senha inválidos. Aluno no primeiro acesso: use o CGM. Professor/Admin: use a credencial temporária individual fornecida pelo administrador.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Entrar';
  }
});

function passwordValid(value) {
  return value.length >= 8 && /[A-Za-zÀ-ÿ]/.test(value) && /\d/.test(value);
}

$('new-password').addEventListener('input', () => {
  const value = $('new-password').value;
  document.querySelector('[data-rule="length"]').classList.toggle('ok', value.length >= 8);
  document.querySelector('[data-rule="letter"]').classList.toggle('ok', /[A-Za-zÀ-ÿ]/.test(value));
  document.querySelector('[data-rule="number"]').classList.toggle('ok', /\d/.test(value));
});

$('password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  setPasswordError();
  const password = $('new-password').value;
  const confirm = $('confirm-password').value;

  if (!passwordValid(password)) {
    setPasswordError('A senha precisa ter pelo menos 8 caracteres, uma letra e um número.');
    return;
  }
  if (password !== confirm) {
    setPasswordError('As senhas não coincidem.');
    return;
  }
  const submit = event.submitter;
  submit.disabled = true;
  submit.textContent = 'Salvando...';
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    passwordRecoveryMode = false;
    // O trigger no banco atualiza must_change_password=false e remove o CGM do perfil.
    await new Promise((resolve) => setTimeout(resolve, 300));
    await routeAuthenticatedUser();
  } catch (error) {
    console.error(error);
    setPasswordError(error?.message || 'Não foi possível atualizar a senha.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Salvar nova senha';
  }
});



$('hub-btn')?.addEventListener('click', () => { window.location.href = '../'; });
$('lobby-btn')?.addEventListener('click', () => { window.location.href = '../lobby/?v=14.10.8.18'; });

$('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  currentProfile = null;
  currentClass = null;
  currentSubjects = [];
  currentExercises = [];
  currentProgress = [];
  currentStudentReleases = [];
  currentClassReleases = [];
  currentLegacyClaims = [];
  currentStaffAccess = false;
  lastDashboardSnapshot = null;
  personalizedExperienceContext = null;
  clearPersonalizedTheme();
  passwordRecoveryMode = false;
  setSessionHeader(false);
  $('password').value = '';
  showView('login-view');
});

async function loadDashboardData() {
  const empty={subjects:[],exercises:[],progress:[],studentReleases:[],classReleases:[],legacyClaims:[]};
  if(!currentClass)return empty;
  const snapshotKey=`${currentProfile?.id||''}:${currentClass.id}`;
  const fallback=()=>{
    if(lastDashboardSnapshot?.key===snapshotKey)return {...lastDashboardSnapshot.data,stale:true};
    if(currentExercises.length||currentSubjects.length)return {subjects:currentSubjects,exercises:currentExercises,progress:currentProgress,studentReleases:currentStudentReleases,classReleases:currentClassReleases,legacyClaims:currentLegacyClaims,stale:true};
    return null;
  };
  try{
    const {data:links,error:linksError}=await withTimeout(supabase.from('class_subjects').select('subject_id').eq('class_id',currentClass.id).eq('active',true),CRITICAL_REQUEST_TIMEOUT_MS,'class_subjects');
    if(linksError)throw linksError;
    const subjectIds=[...new Set((links||[]).map(row=>row.subject_id).filter(Boolean))];
    if(!subjectIds.length){const old=fallback();if(old){console.warn('[AGV] Vínculo de disciplinas veio vazio; mantendo última lista válida.');return old;}return empty;}

    const [subjectsResult,exercisesResult]=await Promise.allSettled([
      withTimeout(supabase.from('subjects').select('id,name,slug').in('id',subjectIds).eq('active',true).order('name'),CRITICAL_REQUEST_TIMEOUT_MS,'subjects'),
      withTimeout(supabase.from('exercises').select('id,subject_id,class_id,exercise_number,slug,title,description,version,default_locked,config').in('subject_id',subjectIds).eq('active',true).eq('visible',true).order('exercise_number'),CRITICAL_REQUEST_TIMEOUT_MS,'exercises')
    ]);
    const subjectsResponse=subjectsResult.status==='fulfilled'?subjectsResult.value:null;
    const exercisesResponse=exercisesResult.status==='fulfilled'?exercisesResult.value:null;
    if(subjectsResponse?.error)throw subjectsResponse.error;
    if(exercisesResponse?.error)throw exercisesResponse.error;
    let subjects=subjectsResponse?.data||[],exercises=exercisesResponse?.data||[];
    // Se existirem exercícios com class_id explícito, só entram os da turma atual. Exercícios globais (class_id nulo) continuam válidos.
    exercises=exercises.filter(ex=>!ex.class_id||String(ex.class_id)===String(currentClass.id));
    if(!subjects.length||!exercises.length){const old=fallback();if(old){console.warn('[AGV] Catálogo retornou vazio; mantendo última lista válida para evitar atividades sumirem.');return old;}}
    const ids=exercises.map(e=>e.id);

    const queries=[
      withTimeout(supabase.from('student_exercises').select('exercise_id,status,progress_percent,attempts,started_at,completed_at,last_activity_at,approval_status,teacher_feedback,security_locked,security_lock_reason,completion_source,auto_score,auto_score_at,submitted_score,submitted_at').eq('student_id',currentProfile.id),CRITICAL_REQUEST_TIMEOUT_MS,'student_exercises'),
      ids.length?withTimeout(supabase.from('exercise_releases').select('id,exercise_id,enabled,release_at,lock_at,updated_at').eq('student_id',currentProfile.id).in('exercise_id',ids),CRITICAL_REQUEST_TIMEOUT_MS,'student_releases'):Promise.resolve({data:[],error:null}),
      ids.length?withTimeout(supabase.from('exercise_releases').select('id,exercise_id,enabled,release_at,lock_at,updated_at').eq('class_id',currentClass.id).is('student_id',null).in('exercise_id',ids),CRITICAL_REQUEST_TIMEOUT_MS,'class_releases'):Promise.resolve({data:[],error:null}),
      ids.length?withTimeout(supabase.from('legacy_exercise_claims').select('id,exercise_id,repository_url,status,next_exercise_id,submitted_at,teacher_feedback').eq('student_id',currentProfile.id).in('exercise_id',ids),CRITICAL_REQUEST_TIMEOUT_MS,'legacy_claims'):Promise.resolve({data:[],error:null})
    ];
    const results=await Promise.allSettled(queries);
    const previous=fallback()||empty;
    const pick=(index,key)=>{
      const result=results[index];
      if(result.status==='rejected'){console.warn(`[AGV] Consulta ${key} falhou; preservando dados anteriores.`,result.reason);return previous[key]||[];}
      if(result.value?.error){console.warn(`[AGV] Consulta ${key} falhou; preservando dados anteriores.`,result.value.error);return previous[key]||[];}
      return result.value?.data||[];
    };
    const data={subjects,exercises,progress:pick(0,'progress'),studentReleases:pick(1,'studentReleases'),classReleases:pick(2,'classReleases'),legacyClaims:pick(3,'legacyClaims')};
    lastDashboardSnapshot={key:snapshotKey,data};
    return data;
  }catch(error){
    const old=fallback();if(old){console.warn('[AGV] Falha temporária no dashboard; mantendo última lista válida.',error);return old;}
    throw error;
  }
}

function latestRelease(rows,exerciseId){
  return (rows||[]).filter(r=>r.exercise_id===exerciseId).sort((a,b)=>new Date(b.updated_at||0)-new Date(a.updated_at||0))[0]||null;
}
function releaseActive(row){
  if(!row||row.enabled===false)return false;
  const now=Date.now();
  if(row.release_at&&new Date(row.release_at).getTime()>now)return false;
  if(row.lock_at&&new Date(row.lock_at).getTime()<=now)return false;
  return true;
}
function exerciseAvailability(exercise,progress=null){
  if(progress?.security_locked||progress?.status==='blocked') return {available:false,reason:progress?.security_lock_reason||'Bloqueado pelo professor',security:true};
  const sr=latestRelease(currentStudentReleases,exercise.id);
  if(sr)return {available:releaseActive(sr),reason:releaseActive(sr)?'Liberado individualmente':'Bloqueado individualmente'};
  const cr=latestRelease(currentClassReleases,exercise.id);
  if(cr)return {available:releaseActive(cr),reason:releaseActive(cr)?'Liberado pelo professor':'Bloqueado pelo professor'};
  return {available:!exercise.default_locked,reason:exercise.default_locked?'Aguardando liberação do professor':'Disponível'};
}
function dashboardNotice(message,level='warning'){
  const box=$('dashboard-alert'); if(!box)return;
  box.textContent=message;box.className=`dashboard-alert ${level}`;box.classList.remove('hidden');
  clearTimeout(dashboardNotice.timer);dashboardNotice.timer=setTimeout(()=>box.classList.add('hidden'),6500);
}

function subjectForExercise(exercise){
  return currentSubjects.find((subject)=>subject.id===exercise?.subject_id)||null;
}
function activityListRow(exercise,{progress=null,locked=false,reason='',completed=false}={}){
  const row=document.createElement(locked?'div':'button');
  if(!locked){row.type='button';row.addEventListener('click',()=>openExercise(exercise));}
  row.className=`student-activity-row ${locked?'is-locked':''} ${completed?'is-completed':''}`;
  const number=document.createElement('span');number.className='student-activity-number';number.textContent=String(exercise.exercise_number).padStart(2,'0');
  const copy=document.createElement('span');copy.className='student-activity-copy';
  const title=document.createElement('strong');title.textContent=exerciseDisplayTitle(exercise);
  const meta=document.createElement('small');
  const subject=subjectForExercise(exercise)?.name||'Disciplina';
  const value=academicValueText(exercise),prefix=value?`${subject} • ${value}`:subject;
  const score=Math.round(Number(progress?.auto_score||0));
  const submitted=progress?.submitted_score==null?null:Math.round(Number(progress.submitted_score||0));
  if(locked)meta.textContent=`${prefix} • ${reason||'Aguardando liberação'}`;
  else if(completed)meta.textContent=`${prefix} • concluída com ${submitted??score}%`;
  else if(submitted!==null)meta.textContent=`${prefix} • entrega parcial ${submitted}% • continue ajustando`;
  else if(progress?.auto_score_at)meta.textContent=`${prefix} • autocorreção ${score}%`;
  else meta.textContent=`${prefix} • disponível`;

  copy.append(title,meta);row.append(number,copy);
  if(!locked){const action=document.createElement('span');action.className='student-activity-action';action.textContent=completed?'Revisar':submitted!==null?'Continuar':'Abrir';row.appendChild(action);}
  return row;
}
function fillActivityBucket(id,rows,emptyText){
  const host=$(id);if(!host)return;host.replaceChildren();
  if(!rows.length){const empty=document.createElement('p');empty.className='student-activity-empty';empty.textContent=emptyText;host.appendChild(empty);return;}
  rows.forEach((row)=>host.appendChild(row));
}


const PLATFORM_CATALOG_URL='../core/catalog/platform-integration-v14.0.json';
const PLATFORM_FAVORITES_KEY='agv:hub:platform-favorites:v1';
const PLATFORM_RECENTS_KEY='agv:hub:platform-recents:v1';
let platformCatalog=[];

let platformTelemetry={loaded:false,byCode:new Map(),lastLoadedAt:0};
function isoDay(value){const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)}
async function loadOwnPlatformTelemetry(force=false){
  if(platformTelemetry.loaded&&!force&&Date.now()-platformTelemetry.lastLoadedAt<60000)return platformTelemetry.byCode;
  try{
    const [{data:platforms,error:pe},{data:progress,error:ae},{data:events,error:ee}]=await Promise.all([
      withTimeout(supabase.from('platforms').select('id,code,name'),OPTIONAL_REQUEST_TIMEOUT_MS,'platforms'),
      withTimeout(supabase.from('activity_progress').select('platform_id,activity_id,status,progress,completed_at,updated_at').order('updated_at',{ascending:false}).limit(400),OPTIONAL_REQUEST_TIMEOUT_MS,'activity_progress'),
      withTimeout(supabase.from('progress_events').select('platform_id,activity_id,event_type,progress,occurred_at').order('occurred_at',{ascending:false}).limit(500),OPTIONAL_REQUEST_TIMEOUT_MS,'progress_events')
    ]);
    if(pe||ae||ee)throw pe||ae||ee;
    const codeById=new Map((platforms||[]).map(p=>[String(p.id),String(p.code||'')]));
    const byCode=new Map();
    const ensure=(code)=>{if(!byCode.has(code))byCode.set(code,{activities:0,completed:0,lastActivity:null,recentEvents:0,activeDays:new Set(),maxProgress:0});return byCode.get(code)};
    for(const row of progress||[]){const code=codeById.get(String(row.platform_id));if(!code)continue;const x=ensure(code);x.activities+=1;if(['completed','reviewed'].includes(String(row.status)))x.completed+=1;x.maxProgress=Math.max(x.maxProgress,Number(row.progress||0));const at=row.updated_at||row.completed_at;if(at&&(!x.lastActivity||Date.parse(at)>Date.parse(x.lastActivity)))x.lastActivity=at;}
    const since=Date.now()-7*86400000;
    for(const row of events||[]){const code=codeById.get(String(row.platform_id));if(!code)continue;const x=ensure(code),at=row.occurred_at;if(at){x.activeDays.add(isoDay(at));if(!x.lastActivity||Date.parse(at)>Date.parse(x.lastActivity))x.lastActivity=at;if(Date.parse(at)>=since)x.recentEvents+=1;}}
    for(const x of byCode.values())x.activeDays=x.activeDays.size;
    platformTelemetry={loaded:true,byCode,lastLoadedAt:Date.now()};return byCode;
  }catch(error){console.warn('Telemetria própria indisponível',error);platformTelemetry={loaded:true,byCode:new Map(),lastLoadedAt:Date.now()};return platformTelemetry.byCode;}
}
function telemetryForPlatform(item,map){return map.get(item.id)||map.get(item.platformCode||'')||null}
function platformMetricLine(t){if(!t)return 'Sem atividade oficial registrada';const parts=[];if(t.completed)parts.push(`${t.completed} concluída${t.completed===1?'':'s'}`);if(t.recentEvents)parts.push(`${t.recentEvents} evento${t.recentEvents===1?'':'s'} em 7 dias`);if(t.activeDays)parts.push(`${t.activeDays} dia${t.activeDays===1?'':'s'} ativo${t.activeDays===1?'':'s'}`);return parts.join(' • ')||'Progresso oficial sincronizado'}

function readLocalList(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch(_){return[]}}
function writeLocalList(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}}
function platformRecommended(item){const code=currentClass?.code||'';const audiences=item.audiences||[];return audiences.includes('ALL')||audiences.includes('DS_ALL')||audiences.includes(code)}
function platformIsClassSpecific(item){return (item.audiences||[]).includes(currentClass?.code||'')}
function platformProgress(item,progressMap,accessMap){
  const map={'1DS-A-MANHA':'lab-ds1','2DS-A-MANHA':'lab-ds2','3DS-C-MANHA':'lab-ds3','DS-SUB-NOITE':'lab-sub'};
  if(map[currentClass?.code]!==item.id)return null;
  const relevant=currentExercises.filter(ex=>accessMap.get(ex.id)?.available||progressMap.get(ex.id)?.status==='completed');
  if(!relevant.length)return 0;
  const done=relevant.filter(ex=>progressMap.get(ex.id)?.status==='completed').length;return Math.round(done/relevant.length*100);
}
async function loadPlatformCatalog(){
  if(platformCatalog.length)return platformCatalog;
  try{const response=await withTimeout(fetch(PLATFORM_CATALOG_URL,{cache:'no-store'}),OPTIONAL_REQUEST_TIMEOUT_MS,'platform_catalog');if(!response.ok)throw new Error('catalog');const data=await response.json();platformCatalog=(data.platforms||[]).filter(x=>x.readyForUnifiedHub).sort((a,b)=>(a.hubOrder||99)-(b.hubOrder||99));}
  catch(error){console.warn('Catálogo de plataformas indisponível',error);platformCatalog=[];}return platformCatalog;
}
function markPlatformRecent(id){const now=Date.now(),rows=readLocalList(PLATFORM_RECENTS_KEY).filter(x=>x&&x.id!==id);rows.unshift({id,at:now});writeLocalList(PLATFORM_RECENTS_KEY,rows.slice(0,12));}
function togglePlatformFavorite(id){const fav=new Set(readLocalList(PLATFORM_FAVORITES_KEY));fav.has(id)?fav.delete(id):fav.add(id);writeLocalList(PLATFORM_FAVORITES_KEY,[...fav]);renderPlatformHub();}
async function renderPlatformHub(){
  const host=$('platform-grid');if(!host)return;const [catalog,telemetryMap]=await Promise.all([loadPlatformCatalog(),loadOwnPlatformTelemetry()]);const favorites=new Set(readLocalList(PLATFORM_FAVORITES_KEY));const recents=readLocalList(PLATFORM_RECENTS_KEY);const recentMap=new Map(recents.map(x=>[x.id,Number(x.at||0)]));const filter=$('platform-filter')?.value||'recommended';const query=String($('platform-search')?.value||'').trim().toLowerCase();
  const progressMap=new Map(currentProgress.map(p=>[p.exercise_id,p]));const accessMap=new Map(currentExercises.map(ex=>[ex.id,exerciseAvailability(ex,progressMap.get(ex.id))]));
  let rows=catalog.filter(item=>{if(filter==='favorites'&&!favorites.has(item.id))return false;if(filter==='recent'&&!recentMap.has(item.id))return false;if(filter==='recommended'&&!platformRecommended(item))return false;return !query||`${item.name} ${item.category||''} ${item.description||''}`.toLowerCase().includes(query)});
  if(filter==='recent')rows=rows.slice().sort((a,b)=>(recentMap.get(b.id)||0)-(recentMap.get(a.id)||0));
  host.replaceChildren();
  const summary=$('platform-hub-summary');if(summary){const recommended=catalog.filter(platformRecommended).length;summary.innerHTML=`<span class="platform-summary-chip">${recommended} recomendadas</span><span class="platform-summary-chip">${favorites.size} favoritas</span><span class="platform-summary-chip">${recents.length} recentes</span>`;}
  if(!rows.length){const empty=document.createElement('div');empty.className='platform-empty';empty.textContent=filter==='favorites'?'Você ainda não marcou plataformas como favoritas.':'Nenhuma plataforma encontrada para este filtro.';host.appendChild(empty);return;}
  rows.forEach(item=>{const card=document.createElement('a');card.className=`platform-card ${platformIsClassSpecific(item)?'is-class-platform':''}`;card.href=`../${item.route}`;card.addEventListener('click',()=>markPlatformRecent(item.id));
    const pct=platformProgress(item,progressMap,accessMap);const telemetry=telemetryForPlatform(item,telemetryMap);const localLast=recentMap.get(item.id),officialLast=telemetry?.lastActivity?Date.parse(telemetry.lastActivity):0,last=Math.max(localLast||0,officialLast||0);const lastText=last?`Última atividade ${new Date(last).toLocaleDateString('pt-BR')}`:'Ainda sem atividade oficial';
    card.innerHTML=`<div class="platform-card-top"><span class="platform-card-icon">${escapeHtml(item.icon||'🧩')}</span><div class="platform-card-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category||'Plataforma')} • ${platformIsClassSpecific(item)?'sua turma':'AGV Core'}</small></div></div><p class="platform-card-description">${escapeHtml(item.description||'Plataforma integrada ao ecossistema AGV.')}</p><div class="platform-card-footer"><span class="platform-card-status"><strong>${pct===null?'Progresso sincronizado':`${pct}% concluído`}</strong><small>${escapeHtml(lastText)}</small><small class="platform-telemetry-line">${escapeHtml(platformMetricLine(telemetry))}</small>${pct===null?'':`<progress class="platform-progress-native" max="100" value="${pct}" aria-label="${pct}% concluído"></progress>`}</span><span class="platform-open">Abrir →</span></div>`;
    const star=document.createElement('button');star.type='button';star.className=`platform-favorite ${favorites.has(item.id)?'is-favorite':''}`;star.setAttribute('aria-label',favorites.has(item.id)?'Remover dos favoritos':'Adicionar aos favoritos');star.textContent=favorites.has(item.id)?'★':'☆';star.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();togglePlatformFavorite(item.id)});card.appendChild(star);host.appendChild(card);
  });
}

async function renderDashboard() {
  showView('loading-view');
  const { subjects, exercises, progress, studentReleases, classReleases, legacyClaims } = await loadDashboardData();
  currentSubjects = subjects;
  currentExercises = exercises;
  currentProgress = progress;
  currentStudentReleases = studentReleases;
  currentClassReleases = classReleases;
  currentLegacyClaims = legacyClaims;
  try {
    personalizedExperienceContext = await withTimeout(loadPersonalizedExperienceContext(supabase,currentProfile), OPTIONAL_REQUEST_TIMEOUT_MS + 1200, 'personalized_experience');
  } catch (error) {
    console.warn('[AGV] Experiência personalizada indisponível nesta inicialização.', error);
    personalizedExperienceContext = null;
  }

  $('student-first-name').textContent = (currentProfile.full_name || 'Aluno').split(' ')[0];
  $('student-context').textContent = currentClass
    ? `${currentClass.name} • ${currentClass.shift || ''} • ${currentClass.school_year || ''}`
    : 'Turma ainda não vinculada. Procure o professor.';
  $('subject-count').textContent = `${subjects.length} disciplina${subjects.length === 1 ? '' : 's'}`;

  const progressMap = new Map(progress.map((p) => [p.exercise_id, p]));
  const accessMap = new Map(exercises.map((ex)=>[ex.id,exerciseAvailability(ex,progressMap.get(ex.id))]));
  const completedExercises = exercises.filter((ex) => progressMap.get(ex.id)?.status === 'completed');
  const inProgressExercises = exercises.filter((ex) => progressMap.get(ex.id)?.status === 'in_progress' && accessMap.get(ex.id)?.available);
  const availableExercises = exercises.filter((ex)=>accessMap.get(ex.id)?.available && progressMap.get(ex.id)?.status!=='completed');
  const lockedExercises = exercises.filter((ex)=>!accessMap.get(ex.id)?.available && progressMap.get(ex.id)?.status!=='completed');
  const releasedTotal = exercises.filter((ex)=>accessMap.get(ex.id)?.available || progressMap.get(ex.id)?.status==='completed').length;
  const completed = completedExercises.length;
  const inProgress = inProgressExercises.length;
  const available = availableExercises.length;
  const locked = lockedExercises.length;
  const overall = releasedTotal ? Math.min(100,Math.round((completed / releasedTotal) * 100)) : 0;

  $('completed-count').textContent = completed;
  $('in-progress-count').textContent = inProgress;
  $('available-count').textContent = available;
  $('locked-count').textContent = locked;
  $('overall-progress').textContent = `${overall}%`;
  $('overall-progress-bar').value = overall;
  $('bucket-available-count').textContent=available;
  $('bucket-completed-count').textContent=completed;
  $('bucket-locked-count').textContent=locked;

  const latest = progress
    .filter((p) => p.status === 'in_progress')
    .sort((a, b) => new Date(b.last_activity_at || 0) - new Date(a.last_activity_at || 0))[0];
  const latestExercise = latest && exercises.find((ex) => ex.id === latest.exercise_id && accessMap.get(ex.id)?.available);
  const firstAvailable = availableExercises
    .slice()
    .sort((a,b)=>Number(a.exercise_number||0)-Number(b.exercise_number||0))[0]||null;
  const nextExercise=latestExercise||firstAvailable;
  const nextProgress=nextExercise?progressMap.get(nextExercise.id):null;
  if (nextExercise) {
    const continuing=nextProgress?.status==='in_progress';
    const subject=subjects.find((item)=>item.id===nextExercise.subject_id);
    const pct=Math.round(Number(nextProgress?.progress_percent||0));
    $('next-action-label').textContent=continuing?'Continue de onde parou':'Sua próxima atividade';
    $('next-action-subject').textContent=subject?.name||'Atividade liberada';
    $('resume-title').textContent = `Exercício ${String(nextExercise.exercise_number).padStart(2, '0')} — ${exerciseDisplayTitle(nextExercise)}`;
    const partialDelivery=continuing&&['server_private_validation_partial','autograde_submission_partial'].includes(String(nextProgress?.completion_source||''));
    $('resume-description').textContent = partialDelivery
      ? `Sua entrega de ${pct}% foi registrada. Continue ajustando para melhorar o resultado; 100% conclui a atividade.`
      : continuing?`Você já fez ${pct}%. Continue sem perder seu trabalho.`:'Esta atividade está liberada e pronta para começar.';
    $('next-action-progress-wrap').classList.toggle('hidden',!continuing);
    $('next-action-progress').textContent=`${pct}%`;
    $('next-action-progress-bar').value=pct;
    $('resume-btn').textContent=continuing?'Continuar atividade':'Começar atividade';
    $('resume-btn').disabled = false;
    $('resume-btn').onclick = () => openExercise(nextExercise);
  } else {
    const allDone=exercises.length>0 && completed===exercises.length;
    $('next-action-label').textContent=allDone?'Tudo certo por enquanto':'Aguardando liberação';
    $('next-action-subject').textContent=allDone?'Parabéns':'Sua próxima atividade';
    $('resume-title').textContent = allDone?'Você concluiu todas as atividades disponíveis':'Nenhuma atividade nova liberada';
    $('resume-description').textContent = allDone?'Seu histórico fica disponível abaixo para revisão.':'Quando o professor liberar a próxima atividade, ela aparecerá aqui automaticamente.';
    $('next-action-progress-wrap').classList.add('hidden');
    $('resume-btn').textContent='Continuar atividade';
    $('resume-btn').disabled = true;
  }

  fillActivityBucket('available-activity-list',availableExercises.map((ex)=>activityListRow(ex,{progress:progressMap.get(ex.id)})),'Nenhuma atividade pendente agora.');
  fillActivityBucket('completed-activity-list',completedExercises.slice().sort((a,b)=>new Date(progressMap.get(b.id)?.completed_at||0)-new Date(progressMap.get(a.id)?.completed_at||0)).map((ex)=>activityListRow(ex,{progress:progressMap.get(ex.id),completed:true})),'Você ainda não concluiu atividades.');
  fillActivityBucket('locked-activity-list',lockedExercises.map((ex)=>activityListRow(ex,{progress:progressMap.get(ex.id),locked:true,reason:accessMap.get(ex.id)?.reason})),'Nenhuma atividade bloqueada.');

  void withTimeout(renderPlatformHub(), OPTIONAL_REQUEST_TIMEOUT_MS + 1500, 'platform_hub').catch((error)=>console.warn('[AGV] Hub de plataformas carregará depois; dashboard principal foi preservado.',error));

  const grid = $('subjects-grid');
  grid.innerHTML = '';
  subjects.forEach((subject) => {
    const subjectExercises = exercises.filter((ex) => ex.subject_id === subject.id);
    const done = subjectExercises.filter((ex) => progressMap.get(ex.id)?.status === 'completed').length;
    const pct = subjectExercises.length ? Math.round((done / subjectExercises.length) * 100) : 0;
    const card = document.createElement('article');
    card.className = 'panel subject-card';
    card.innerHTML = `
      <div class="subject-card-head">
        <div>
          <p class="eyebrow">Disciplina</p>
          <h4>${escapeHtml(subject.name)}</h4>
        </div>
        <strong>${pct}%</strong>
      </div>
      <div class="progress-track small"><progress class="progress-native" max="100" value="${pct}" aria-label="${pct}% concluído"></progress></div>
      <p class="muted">${done} de ${subjectExercises.length} concluídos</p>
      <div class="exercise-list"></div>
    `;
    const list = card.querySelector('.exercise-list');
    subjectExercises.forEach((exercise) => {
      const p = progressMap.get(exercise.id);
      const status = p?.status || 'not_started';
      const access=exerciseAvailability(exercise,p);
      const claim=currentLegacyClaims.find(c=>c.exercise_id===exercise.id);
      let label=progressLabel(p);
      if(claim?.status==='pending') label='Aguardando validação';
      if(claim?.status==='rejected') label='Ajustes solicitados';
      if(!access.available) label=access.reason||'Bloqueado';
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled=!access.available;
      button.className = `exercise-row status-${status} ${!access.available?'is-locked':''} ${claim?.status==='pending'?'pending-review':''}`;
      const value=academicValueText(exercise);
      button.innerHTML = `<span>${String(exercise.exercise_number).padStart(2, '0')}</span><div class="exercise-row-copy"><strong>${escapeHtml(exerciseDisplayTitle(exercise))}</strong>${value?`<small>${escapeHtml(value)}</small>`:''}</div><em>${escapeHtml(label)}</em>`;
      if(access.available)button.addEventListener('click', () => openExercise(exercise));
      list.appendChild(button);
    });
    grid.appendChild(card);
  });

  await renderPersonalizedExperienceDashboard({
    supabase,
    profile:currentProfile,
    context:personalizedExperienceContext,
    onOpenAssignment:openPersonalizedAssignment,
  });

  showView('dashboard-view');

  if (!lobbyDeepLinkHandled) {
    const requested = new URLSearchParams(window.location.search).get('exercise');
    lobbyDeepLinkHandled = true;
    if (requested) {
      const target = exercises.find((ex) => String(ex.id) === String(requested));
      if (target) {
        const targetProgress = progressMap.get(target.id);
        const targetAccess = exerciseAvailability(target, targetProgress);
        if (targetAccess.available) {
          history.replaceState({}, '', window.location.pathname);
          setTimeout(() => openExercise(target), 120);
        } else {
          dashboardNotice(targetAccess.reason || 'O professor ainda não liberou esta atividade.', 'danger');
        }
      }
    }
  }
}

async function openPersonalizedAssignment(assignment,progress=null){
  if(!assignment||!personalizedExperienceContext)return;
  showView('personalized-experience-view');
  await renderPersonalizedAssignment({
    supabase,
    profile:currentProfile,
    assignment,
    progress,
    onBack:()=>renderDashboard(),
    onUpdated:(next)=>{
      personalizedExperienceContext.progressByAssignment.set(String(assignment.id),next);
      const idx=personalizedExperienceContext.progress.findIndex(row=>String(row.assignment_id)===String(assignment.id));
      if(idx>=0)personalizedExperienceContext.progress[idx]=next;else personalizedExperienceContext.progress.push(next);
    },
  });
}

async function openExercise(exercise) {
  if(exerciseOpening)return;
  exerciseOpening=true;
  try{
  $('exercise-subject').textContent = currentSubjects.find((s) => s.id === exercise.subject_id)?.name || 'Disciplina';
  $('exercise-title').textContent = `Exercício ${String(exercise.exercise_number).padStart(2, '0')} — ${exerciseDisplayTitle(exercise)}`;
  const p = currentProgress.find((item) => item.exercise_id === exercise.id);
  const maxPoints=academicMaxPoints(exercise),earnedPoints=academicEarnedPoints(exercise,p),valueChip=$('exercise-value');
  if(valueChip){valueChip.textContent=maxPoints===null?'':`Vale ${formatAcademicPoints(maxPoints)}`;valueChip.classList.toggle('hidden',maxPoints===null);}
  $('exercise-state').textContent = progressLabel(p);
  $('exercise-meta').innerHTML = `
    <div><span>Versão</span><strong>${escapeHtml(exercise.version || '—')}</strong></div>
    ${maxPoints===null?'':`<div><span>Valor máximo</span><strong>${formatAcademicPoints(maxPoints)}</strong></div>`}
    <div><span>Autocorreção</span><strong id="exercise-auto-score">${Math.round(Number(p?.auto_score || 0))}%</strong></div>
    <div><span>Melhor nota entregue</span><strong id="exercise-submitted-score">${p?.submitted_score==null?'—':`${Math.round(Number(p.submitted_score))}%${earnedPoints===null?'':` • ${formatAcademicPoints(earnedPoints)}/${formatAcademicPoints(maxPoints)}`}`}</strong></div>
    <div><span>Tentativas</span><strong id="exercise-attempts">${Number(p?.attempts || 0)}</strong></div>
  `;

  const access=exerciseAvailability(exercise,p);
  if(!access.available){dashboardNotice(access.reason||'Este exercício está bloqueado.','danger');return;}
  try{
    await callActivityProgress({action:'start',exercise_id:exercise.id});
    if(!p)currentProgress.push({exercise_id:exercise.id,status:'in_progress',progress_percent:0,attempts:0,last_activity_at:new Date().toISOString()});
  }catch(error){
    dashboardNotice(error.message||'O professor ainda não liberou esta atividade.','danger');
    return;
  }

  showView('exercise-view');
  const subject = currentSubjects.find((s) => s.id === exercise.subject_id);
  try {
    await mountWorkspace({ profile: currentProfile, exercise, subject });
  } catch (error) {
    console.error(error);
    await unmountWorkspace().catch(()=>{});
    document.getElementById('save-state').textContent = 'Não foi possível carregar seus arquivos.';
    document.getElementById('save-state').className = 'save-state error';
  }
  }finally{
    exerciseOpening=false;
  }
}

$('back-dashboard').addEventListener('click', async()=>{await unmountWorkspace();await renderDashboard();});
$('view-all-activities-btn')?.addEventListener('click',()=>document.getElementById('activity-overview')?.scrollIntoView({behavior:'smooth',block:'start'}));
document.addEventListener('epds:security-back',async()=>{await unmountWorkspace();await renderDashboard();});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}


$('legacy-import-btn')?.addEventListener('click',()=>{
  window.location.href='../validacao-antiga/';
});

if (SUPABASE_SDK_AVAILABLE) supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    setTimeout(()=>forceSessionExit(''),0);
    return;
  }

  if (event === 'PASSWORD_RECOVERY') {
    passwordRecoveryMode = true;
    // Evita chamadas Supabase reentrantes dentro do callback de Auth.
    setTimeout(async () => {
      try {
        await loadIdentity();
        setSessionHeader(true);
        $('password-description').textContent = 'Crie uma nova senha para recuperar seu acesso. Use pelo menos 8 caracteres, com letra e número.';
        $('new-password').value = '';
        $('confirm-password').value = '';
        setPasswordError();
        showView('password-view');
      } catch (error) {
        console.error(error);
        setLoginError('O link de recuperação não pôde ser validado. Solicite um novo link.');
        showView('login-view');
      }
    }, 0);
  }
});

let lastDevtoolsSignal = 0;
window.addEventListener('keydown', (event) => {
  if (!currentProfile || currentProfile.role !== 'student') return;
  const suspicious = event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['I','J','C'].includes(String(event.key).toUpperCase())) || (event.ctrlKey && String(event.key).toUpperCase() === 'U');
  if (!suspicious || Date.now() - lastDevtoolsSignal < 10 * 60 * 1000) return;
  lastDevtoolsSignal = Date.now();
  securityTelemetry('client.devtools_heuristic', { source: 'atividades', shortcut: event.code || event.key });
});

$('retry-loading-btn')?.addEventListener('click', () => {
  routeAuthenticatedUser();
});

$('renew-session-btn')?.addEventListener('click', async () => {
  const button = $('renew-session-btn');
  if (button) { button.disabled = true; button.textContent = 'Renovando...'; }
  ++portalBootRun;
  clearTimeout(portalBootWatchdog);
  try { await withTimeout(supabase.auth.signOut(), OPTIONAL_REQUEST_TIMEOUT_MS, 'auth.signOut'); } catch (_) {}
  currentProfile = null;
  currentClass = null;
  currentSubjects = [];
  currentExercises = [];
  currentProgress = [];
  currentStudentReleases = [];
  currentClassReleases = [];
  currentLegacyClaims = [];
  currentStaffAccess = false;
  lastDashboardSnapshot = null;
  setPortalFullscreenRequired(false);
  setSessionHeader(false);
  setLoginError('Sessão renovada. Entre novamente para continuar.');
  showView('login-view');
  if (button) { button.disabled = false; button.textContent = 'Renovar sessão'; }
});

if (SUPABASE_SDK_AVAILABLE) {
  routeAuthenticatedUser();
} else {
  setSessionHeader(false);
  setLoginError(SUPABASE_SDK_ERROR?.message || 'Não foi possível carregar o serviço de autenticação. Verifique a conexão e tente novamente.');
  showView('login-view');
}

document.getElementById('staff-btn')?.addEventListener('click', openStaffPanel);


const recoveryDialog = $('recovery-dialog');
$('forgot-password-btn')?.addEventListener('click', () => {
  const email = normalizeEmail($('email')?.value || '');
  $('recovery-email').value = email;
  $('recovery-cgm').value = '';
  $('recovery-message').classList.add('hidden');
  $('recovery-message').classList.remove('ok');
  recoveryDialog?.showModal();
});
$('recovery-close-btn')?.addEventListener('click', () => recoveryDialog?.close());
$('recovery-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = normalizeEmail($('recovery-email').value);
  const cgm = String($('recovery-cgm').value || '').replace(/\D/g, '');
  const msg = $('recovery-message');
  msg.classList.add('hidden');
  msg.classList.remove('ok');
  if (!email.endsWith(SCHOOL_EMAIL_DOMAIN)) {
    msg.textContent = `Use o e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`;
    msg.classList.remove('hidden');
    return;
  }
  if (!/^\d{6,12}$/.test(cgm)) {
    msg.textContent = 'Informe um CGM válido, usando somente números.';
    msg.classList.remove('hidden');
    return;
  }
  const submit = event.submitter;
  submit.disabled = true;
  submit.textContent = 'Redefinindo...';
  try {
    const { data, error } = await supabase.functions.invoke('temporary-cgm-password-reset', { body: { email, cgm } });
    if (error) throw error;
    msg.textContent = data?.message || 'Se os dados informados estiverem corretos, a senha foi redefinida para o CGM. No próximo acesso, crie uma nova senha pessoal.';
    msg.classList.remove('hidden');
    msg.classList.add('ok');
  } catch (error) {
    console.error(error);
    msg.textContent = 'Não foi possível concluir a redefinição agora. Se houve muitas tentativas, aguarde alguns minutos e tente novamente.';
    msg.classList.remove('hidden');
    msg.classList.remove('ok');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Redefinir senha para CGM';
  }
});

import { openStaffPanel, isStaff } from './admin.js';
import { mountWorkspace, unmountWorkspace } from './workspace.js';
import { callActivityProgress, submitLegacyExercise } from './supervision.js';
import { supabase } from './supabase.js';
import { SCHOOL_EMAIL_DOMAIN } from './config.js';

const $ = (id) => document.getElementById(id);
const views = ['loading-view', 'login-view', 'password-view', 'dashboard-view', 'exercise-view', 'staff-view'];
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

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function loadIdentity() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, active, must_change_password, first_login_at, last_login_at, password_changed_at')
    .eq('id', user.id)
    .single();
  if (profileError) throw profileError;

  currentProfile = profile;
  currentStaffAccess = false;
  try {
    const { data: staffStatus, error: staffError } = await supabase.functions.invoke('staff-dashboard', { body: { action: 'staff_status' } });
    if (!staffError && staffStatus?.staff === true) currentStaffAccess = true;
  } catch (_) {}
  document.getElementById('staff-btn')?.classList.toggle('hidden', !(isStaff(profile) || currentStaffAccess));

  const { data: memberships, error: membershipError } = await supabase
    .from('class_memberships')
    .select('class_id')
    .eq('user_id', user.id)
    .eq('active', true)
    .limit(1);
  if (membershipError) throw membershipError;

  if (memberships?.length) {
    const { data: cls, error: classError } = await supabase
      .from('classes')
      .select('id, code, name, shift, school_year')
      .eq('id', memberships[0].class_id)
      .single();
    if (classError) throw classError;
    currentClass = cls;
  } else {
    currentClass = null;
  }

  return { user, profile, class: currentClass };
}

async function routeAuthenticatedUser() {
  showView('loading-view');
  try {
    const identity = await loadIdentity();
    if (!identity) {
      currentProfile = null;
      currentClass = null;
      setSessionHeader(false);
      showView('login-view');
      return;
    }

    setSessionHeader(true);

    if (passwordRecoveryMode) {
      $('password-description').textContent = 'Crie uma nova senha para recuperar seu acesso. Use pelo menos 8 caracteres, com letra e número.';
      showView('password-view');
      return;
    }

    if (!identity.profile.active) {
      await supabase.auth.signOut();
      setLoginError('Seu acesso está inativo. Procure o professor responsável.');
      showView('login-view');
      return;
    }

    if (identity.profile.must_change_password) {
      $('password-description').textContent = currentStaffAccess
        ? 'Seu acesso de professor/admin foi validado. Crie sua senha pessoal para concluir o primeiro acesso.'
        : 'Por segurança, o CGM é apenas uma senha temporária. Defina uma nova senha para liberar os exercícios.';
      showView('password-view');
      return;
    }

    if (currentStaffAccess || isStaff(identity.profile)) {
      await openStaffPanel();
      return;
    }
    await renderDashboard();
  } catch (error) {
    console.error(error);
    setLoginError('Não foi possível carregar seu cadastro. Procure o professor se o problema continuar.');
    showView('login-view');
  }
}

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

  const submit = event.submitter;
  submit.disabled = true;
  submit.textContent = 'Entrando...';
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (!signInError) {
      await routeAuthenticatedUser();
      return;
    }

    // Primeiro acesso unificado:
    // - aluno: senha numérica = CGM; o banco valida e-mail + CGM + matrícula;
    // - professor/admin: senha temporária institucional; o banco valida a allowlist.
    const looksLikeCgm = /^\d{6,12}$/.test(password);
    const looksLikeStaffFirstAccess = password === 'agv@2026';
    if (!looksLikeCgm && !looksLikeStaffFirstAccess) throw signInError;

    submit.textContent = 'Validando primeiro acesso...';
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: looksLikeCgm ? { cgm: password } : {},
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });

    if (signUpError) throw signUpError;

    if (signUpData?.session) {
      await routeAuthenticatedUser();
      return;
    }

    // O trigger confirma automaticamente cadastros validados. Caso o SDK não
    // devolva sessão na mesma resposta, tentamos autenticar novamente.
    const { error: firstSignInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!firstSignInError) {
      await routeAuthenticatedUser();
      return;
    }
    throw firstSignInError;
  } catch (error) {
    console.error(error);
    setLoginError('E-mail, senha ou credencial inicial inválidos. Aluno: confira e-mail + CGM. Professor/Admin: confira se o e-mail foi autorizado.');
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



$('lobby-btn')?.addEventListener('click', () => { window.location.href = '../lobby/'; });

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
  passwordRecoveryMode = false;
  setSessionHeader(false);
  $('password').value = '';
  showView('login-view');
});

async function loadDashboardData() {
  if (!currentClass) return { subjects: [], exercises: [], progress: [], studentReleases:[], classReleases:[], legacyClaims:[] };

  const { data: links, error: linksError } = await supabase
    .from('class_subjects').select('subject_id').eq('class_id', currentClass.id).eq('active', true);
  if (linksError) throw linksError;
  const subjectIds = (links || []).map((row) => row.subject_id);
  if (!subjectIds.length) return { subjects: [], exercises: [], progress: [], studentReleases:[], classReleases:[], legacyClaims:[] };

  const [{data:subjects,error:subjectsError},{data:exercises,error:exercisesError}] = await Promise.all([
    supabase.from('subjects').select('id,name,slug').in('id',subjectIds).eq('active',true).order('name'),
    supabase.from('exercises').select('id,subject_id,exercise_number,slug,title,description,version,default_locked,config').in('subject_id',subjectIds).eq('active',true).eq('visible',true).order('exercise_number')
  ]);
  if(subjectsError)throw subjectsError;
  if(exercisesError)throw exercisesError;
  const ids=(exercises||[]).map(e=>e.id);

  const progressQuery=supabase.from('student_exercises')
    .select('exercise_id,status,progress_percent,attempts,started_at,completed_at,last_activity_at,approval_status,teacher_feedback,security_locked,security_lock_reason,completion_source')
    .eq('student_id',currentProfile.id);
  const studentReleaseQuery=ids.length
    ? supabase.from('exercise_releases').select('id,exercise_id,enabled,release_at,lock_at,updated_at').eq('student_id',currentProfile.id).in('exercise_id',ids)
    : Promise.resolve({data:[],error:null});
  const classReleaseQuery=ids.length
    ? supabase.from('exercise_releases').select('id,exercise_id,enabled,release_at,lock_at,updated_at').eq('class_id',currentClass.id).is('student_id',null).in('exercise_id',ids)
    : Promise.resolve({data:[],error:null});
  const claimsQuery=ids.length
    ? supabase.from('legacy_exercise_claims').select('id,exercise_id,repository_url,status,next_exercise_id,submitted_at,teacher_feedback').eq('student_id',currentProfile.id).in('exercise_id',ids)
    : Promise.resolve({data:[],error:null});

  const [pr,sr,cr,lc]=await Promise.all([progressQuery,studentReleaseQuery,classReleaseQuery,claimsQuery]);
  if(pr.error)throw pr.error;
  return {subjects:subjects||[],exercises:exercises||[],progress:pr.data||[],studentReleases:sr.data||[],classReleases:cr.data||[],legacyClaims:lc.data||[]};
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

async function renderDashboard() {
  showView('loading-view');
  const { subjects, exercises, progress, studentReleases, classReleases, legacyClaims } = await loadDashboardData();
  currentSubjects = subjects;
  currentExercises = exercises;
  currentProgress = progress;
  currentStudentReleases = studentReleases;
  currentClassReleases = classReleases;
  currentLegacyClaims = legacyClaims;

  $('student-first-name').textContent = (currentProfile.full_name || 'Aluno').split(' ')[0];
  $('student-context').textContent = currentClass
    ? `${currentClass.name} • ${currentClass.shift || ''} • ${currentClass.school_year || ''}`
    : 'Turma ainda não vinculada. Procure o professor.';
  $('subject-count').textContent = `${subjects.length} disciplina${subjects.length === 1 ? '' : 's'}`;

  const progressMap = new Map(progress.map((p) => [p.exercise_id, p]));
  const completed = exercises.filter((ex) => progressMap.get(ex.id)?.status === 'completed').length;
  const inProgress = exercises.filter((ex) => progressMap.get(ex.id)?.status === 'in_progress').length;
  const available = exercises.filter(ex=>exerciseAvailability(ex,progressMap.get(ex.id)).available).length;
  const overall = available ? Math.round((completed / available) * 100) : 0;

  $('completed-count').textContent = completed;
  $('in-progress-count').textContent = inProgress;
  $('available-count').textContent = available;
  $('overall-progress').textContent = `${overall}%`;
  $('overall-progress-bar').style.width = `${overall}%`;

  const latest = progress
    .filter((p) => p.status === 'in_progress')
    .sort((a, b) => new Date(b.last_activity_at || 0) - new Date(a.last_activity_at || 0))[0];
  const latestExercise = latest && exercises.find((ex) => ex.id === latest.exercise_id && exerciseAvailability(ex,latest).available);
  if (latestExercise) {
    $('resume-title').textContent = `Exercício ${String(latestExercise.exercise_number).padStart(2, '0')} — ${latestExercise.title}`;
    $('resume-description').textContent = `${Math.round(Number(latest.progress_percent || 0))}% concluído`;
    $('resume-btn').disabled = false;
    $('resume-btn').onclick = () => openExercise(latestExercise);
  } else {
    $('resume-title').textContent = completed === available && available ? 'Tudo concluído por enquanto' : 'Nenhum exercício iniciado';
    $('resume-description').textContent = 'Escolha uma disciplina abaixo para começar.';
    $('resume-btn').disabled = true;
  }

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
      <div class="progress-track small"><div class="progress-fill" style="width:${pct}%"></div></div>
      <p class="muted">${done} de ${subjectExercises.length} concluídos</p>
      <div class="exercise-list"></div>
    `;
    const list = card.querySelector('.exercise-list');
    subjectExercises.forEach((exercise) => {
      const p = progressMap.get(exercise.id);
      const status = p?.status || 'not_started';
      const access=exerciseAvailability(exercise,p);
      const claim=currentLegacyClaims.find(c=>c.exercise_id===exercise.id);
      let label=humanStatus(status);
      if(claim?.status==='pending') label='Aguardando validação';
      if(claim?.status==='rejected') label='Ajustes solicitados';
      if(!access.available) label=access.reason||'Bloqueado';
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled=!access.available;
      button.className = `exercise-row status-${status} ${!access.available?'is-locked':''} ${claim?.status==='pending'?'pending-review':''}`;
      button.innerHTML = `<span>${String(exercise.exercise_number).padStart(2, '0')}</span><strong>${escapeHtml(exercise.title)}</strong><em>${escapeHtml(label)}</em>`;
      if(access.available)button.addEventListener('click', () => openExercise(exercise));
      list.appendChild(button);
    });
    grid.appendChild(card);
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

async function openExercise(exercise) {
  $('exercise-subject').textContent = currentSubjects.find((s) => s.id === exercise.subject_id)?.name || 'Disciplina';
  $('exercise-title').textContent = `Exercício ${String(exercise.exercise_number).padStart(2, '0')} — ${exercise.title}`;
  const p = currentProgress.find((item) => item.exercise_id === exercise.id);
  $('exercise-state').textContent = humanStatus(p?.status || 'not_started');
  $('exercise-meta').innerHTML = `
    <div><span>Versão</span><strong>${escapeHtml(exercise.version || '—')}</strong></div>
    <div><span>Progresso</span><strong>${Math.round(Number(p?.progress_percent || 0))}%</strong></div>
    <div><span>Tentativas</span><strong>${Number(p?.attempts || 0)}</strong></div>
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
    document.getElementById('save-state').textContent = 'Não foi possível carregar seus arquivos.';
    document.getElementById('save-state').className = 'save-state error';
  }
}

$('back-dashboard').addEventListener('click', async()=>{await unmountWorkspace();await renderDashboard();});
document.addEventListener('epds:security-back',async()=>{await unmountWorkspace();await renderDashboard();});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}


$('legacy-import-btn')?.addEventListener('click',()=>{
  const select=$('legacy-exercise-select');
  select.innerHTML=currentExercises.map(ex=>`<option value="${ex.id}">Ex. ${String(ex.exercise_number).padStart(2,'0')} — ${escapeHtml(ex.title)}</option>`).join('');
  $('legacy-repository-url').value='';
  $('legacy-import-message').classList.add('hidden');
  $('legacy-import-dialog').showModal();
});
$('legacy-import-close')?.addEventListener('click',()=>$('legacy-import-dialog').close());
$('legacy-import-form')?.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const btn=event.submitter,msg=$('legacy-import-message');
  btn.disabled=true;btn.textContent='Enviando...';msg.classList.add('hidden');
  try{
    const data=await submitLegacyExercise({
      exercise_id:$('legacy-exercise-select').value,
      repository_url:$('legacy-repository-url').value.trim()
    });
    msg.textContent=data.next_exercise?'Link enviado. O próximo exercício foi liberado enquanto o professor valida este.':'Link enviado para validação do professor.';
    msg.className='form-message ok';
    await renderDashboard();
  }catch(error){
    msg.textContent='Use um link válido do GitHub/GitHub Pages referente ao exercício.';
    msg.className='form-message';
  }finally{btn.disabled=false;btn.textContent='Enviar para validação';}
});

supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    currentProfile = null;
    currentClass = null;
    passwordRecoveryMode = false;
    setSessionHeader(false);
    showView('login-view');
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

routeAuthenticatedUser();

document.getElementById('staff-btn')?.addEventListener('click', openStaffPanel);


const recoveryDialog = $('recovery-dialog');
$('forgot-password-btn')?.addEventListener('click', () => {
  const email = normalizeEmail($('email')?.value || '');
  $('recovery-email').value = email;
  $('recovery-message').classList.add('hidden');
  recoveryDialog?.showModal();
});
$('recovery-close-btn')?.addEventListener('click', () => recoveryDialog?.close());
$('recovery-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = normalizeEmail($('recovery-email').value);
  const msg = $('recovery-message');
  msg.classList.add('hidden');
  if (!email.endsWith(SCHOOL_EMAIL_DOMAIN)) {
    msg.textContent = `Use o e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`;
    msg.classList.remove('hidden');
    return;
  }
  const submit = event.submitter;
  submit.disabled = true;
  submit.textContent = 'Enviando...';
  try {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    msg.textContent = 'Link enviado. Confira seu e-mail institucional.';
    msg.classList.remove('hidden');
    msg.classList.add('ok');
  } catch (error) {
    console.error(error);
    msg.textContent = 'Não foi possível enviar o link agora.';
    msg.classList.remove('hidden');
    msg.classList.remove('ok');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Enviar link';
  }
});

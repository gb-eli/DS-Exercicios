
import { supabase } from './supabase.js';

let payload=null, currentClass='all', pollTimer=null, liveCtx=null, detailCtx=null, rosterCtx=null, teamData=[];
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

let shellBound=false;
function ensureAdminShell(){
  if(!$('staff-view')){
    document.querySelector('.main-content')?.insertAdjacentHTML('beforeend', `
      <section id="staff-view" class="staff-dashboard hidden" aria-labelledby="staff-title">
        <header class="staff-page-header">
          <div class="staff-page-heading">
            <p class="eyebrow">Professor / Administração</p>
            <h2 id="staff-title">Painel de acompanhamento</h2>
            <p class="muted">Acompanhe acessos, progresso, revisões e apoios individuais.</p>
          </div>
          <div class="staff-page-status">
            <span class="status-chip"><span class="status-dot"></span> sincronizado</span>
          </div>
        </header>

        <section id="staff-summary" class="staff-summary"></section>

        <section class="panel staff-controls">
          <div class="staff-filters">
            <label class="staff-field">
              <span>Turma</span>
              <select id="staff-class-filter"><option value="all">Todas as turmas</option></select>
            </label>
            <label class="staff-field staff-search-field">
              <span>Buscar aluno</span>
              <input id="staff-search" type="search" placeholder="Nome ou e-mail">
            </label>
            <label class="staff-field">
              <span>Acesso</span>
              <select id="staff-access-filter">
                <option value="all">Todos</option>
                <option value="never">Nunca acessou</option>
                <option value="linked">Conta vinculada</option>
                <option value="missing_cgm">CGM pendente</option>
              </select>
            </label>
            <label class="staff-review-filter">
              <input id="staff-review-only" type="checkbox">
              <span>Somente pendências</span>
            </label>
          </div>

          <div class="staff-commandbar">
            <button id="staff-team-btn" class="button button-ghost" type="button">Equipe</button>
            <button id="staff-refresh-btn" class="button button-primary" type="button">Atualizar</button>
            <button id="staff-back-btn" class="button button-ghost" type="button">Sair</button>
          </div>
        </section>

        <section class="panel staff-list-panel">
          <div class="staff-list-heading">
            <div>
              <p class="eyebrow">Alunos</p>
              <h3>Acompanhamento da turma</h3>
            </div>
            <span id="staff-visible-count" class="staff-visible-count"></span>
          </div>
          <div id="staff-students" class="staff-students"></div>
        </section>
      </section>`);
    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="student-detail-dialog" class="history-dialog">
        <div class="history-card panel detail-card">
          <div class="history-head"><div><p class="eyebrow">Aluno</p><h3 id="student-detail-title">Detalhes</h3></div><button id="student-detail-close-btn" class="button button-ghost button-small" type="button">Fechar</button></div>
          <div id="student-detail-body"></div>
        </div>
      </dialog>

      <dialog id="roster-dialog" class="history-dialog">
        <form id="roster-form" class="history-card panel roster-card">
          <div class="history-head">
            <div><p class="eyebrow">Matrícula</p><h3 id="roster-title">Editar cadastro</h3></div>
            <button id="roster-close-btn" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div class="roster-form-grid">
            <label><span>E-mail institucional</span><input id="roster-email" type="email" placeholder="nome@escola.pr.gov.br"></label>
            <label><span>CGM</span><input id="roster-cgm" type="text" inputmode="numeric" placeholder="Informe apenas se precisar cadastrar/corrigir"></label>
            <label><span>Situação</span>
              <select id="roster-status">
                <option value="Matriculado">Matriculado</option>
                <option value="Transferido">Transferido</option>
              </select>
            </label>
          </div>
          <p id="roster-hint" class="muted"></p>
          <p id="roster-message" class="form-message hidden"></p>
          <div class="dialog-actions">
            <button class="button button-primary" type="submit">Salvar cadastro</button>
          </div>
        </form>
      </dialog>


      <dialog id="team-dialog" class="history-dialog">
        <div class="history-card panel team-card">
          <div class="history-head">
            <div><p class="eyebrow">Administração</p><h3>Equipe do sistema</h3><p class="muted">Cadastre professores e administradores autorizados. No primeiro acesso, eles usam a senha temporária institucional e depois criam a própria senha.</p></div>
            <button id="team-close-btn" class="button button-ghost button-small" type="button">Fechar</button>
          </div>
          <div class="team-temp-password"><span>Senha temporária da equipe</span><strong>agv@2026</strong><small>Válida somente no primeiro acesso; o sistema exige troca imediata.</small></div>
          <form id="team-form" class="team-form">
            <label><span>Nome completo</span><input id="team-name" required placeholder="Nome do professor"></label>
            <label><span>E-mail institucional</span><input id="team-email" type="email" required placeholder="nome@escola.pr.gov.br"></label>
            <label><span>Perfil</span><select id="team-role"><option value="teacher">Professor</option><option value="admin">Administrador</option></select></label>
            <button class="button button-primary" type="submit">Autorizar acesso</button>
          </form>
          <p id="team-message" class="form-message hidden"></p>
          <div id="team-list" class="team-list"></div>
        </div>
      </dialog>

      <dialog id="live-dialog" class="history-dialog">
        <div class="history-card panel live-card">
          <div class="history-head"><div><p class="eyebrow">Acompanhamento</p><h3 id="live-title">Exercício do aluno</h3></div><button id="live-close-btn" class="button button-ghost button-small" type="button">Fechar</button></div>
          <div id="live-file-tabs" class="file-tabs horizontal"></div>
          <div class="live-meta"><span id="live-status" class="muted">Aguardando...</span></div>
          <pre id="live-code" class="live-code">Nenhum conteúdo salvo ainda.</pre>
        </div>
      </dialog>`);
  }
  if(!shellBound){
    $('staff-refresh-btn')?.addEventListener('click',refreshStaff);
    $('staff-class-filter')?.addEventListener('change',e=>{currentClass=e.target.value;renderSummary();renderStudents()});
    $('staff-search')?.addEventListener('input',()=>{renderSummary();renderStudents()});
    $('staff-review-only')?.addEventListener('change',()=>{renderSummary();renderStudents()});
    $('staff-access-filter')?.addEventListener('change',()=>{renderSummary();renderStudents()});
    $('live-close-btn')?.addEventListener('click',closeLive);
    $('student-detail-close-btn')?.addEventListener('click',()=>$('student-detail-dialog')?.close());
    $('roster-close-btn')?.addEventListener('click',()=>$('roster-dialog')?.close());
    $('roster-form')?.addEventListener('submit',saveRosterRecord);
    $('staff-team-btn')?.addEventListener('click',openTeamManager);
    $('team-close-btn')?.addEventListener('click',()=>$('team-dialog')?.close());
    $('team-form')?.addEventListener('submit',saveTeamMember);
    $('staff-back-btn')?.addEventListener('click',async()=>{await supabase.auth.signOut();location.reload()});
    shellBound=true;
  }
}

async function callStaff(body){
  const {data,error}=await supabase.functions.invoke('staff-dashboard',{body});
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  return data;
}

async function callAdminRoster(body){
  const {data,error}=await supabase.functions.invoke('admin-roster',{body});
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  return data;
}
async function callStaffDirectory(body){
  const {data,error}=await supabase.functions.invoke('staff-directory',{body});
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  return data;
}
export function isStaff(profile){return ['teacher','admin','super_admin'].includes(profile?.role)}
export async function openStaffPanel(){
  ensureAdminShell();
  ['loading-view','login-view','password-view','dashboard-view','exercise-view'].forEach(id=>$(id)?.classList.add('hidden'));
  $('staff-view').classList.remove('hidden');
  await refreshStaff();
}
async function refreshStaff(){
  $('staff-students').innerHTML='<div class="loading-card">Carregando painel...</div>';
  payload=await callStaff({action:'overview'});
  renderFilters(); renderSummary(); renderStudents();
}
function renderFilters(){
  const sel=$('staff-class-filter'), prev=sel.value||currentClass;
  sel.innerHTML='<option value="all">Todas as turmas</option>'+payload.classes.map(c=>`<option value="${c.id}">${esc(c.name)} — ${esc(c.shift||'')}</option>`).join('');
  if([...sel.options].some(o=>o.value===prev)) sel.value=prev;
  currentClass=sel.value;
}
function studentRecords(){
  const profilesById=new Map((payload.profiles||[]).map(p=>[p.id,p]));
  const prereg=(payload.preregistrations||[]).filter(r=>r.active!==false);
  const claimed=new Set();
  const rows=prereg.map(r=>{
    const p=r.claimed_user_id?profilesById.get(r.claimed_user_id):null;
    if(p) claimed.add(p.id);
    return {
      id:p?.id||null, roster_id:r.id, class_id:r.class_id,
      full_name:p?.full_name||r.full_name,
      email:p?.email||r.institutional_email||'',
      last_login_at:p?.last_login_at||null,
      claimed_at:r.claimed_at||null,
      enrollment_status:r.enrollment_status,
      has_cgm:r.has_cgm!==false,
      claimed:!!p
    };
  });
  for(const p of (payload.profiles||[])){
    if(claimed.has(p.id)) continue;
    const m=(payload.memberships||[]).find(x=>x.user_id===p.id);
    rows.push({...p,class_id:m?.class_id||null,claimed:true,has_cgm:true,enrollment_status:'Matriculado'});
  }
  return rows.sort((a,b)=>String(a.full_name||'').localeCompare(String(b.full_name||''),'pt-BR'));
}
function classForStudent(student){
  const id=typeof student==='string'?student:student?.id;
  const direct=typeof student==='object'?student?.class_id:null;
  if(direct) return payload.classes.find(c=>c.id===direct)||null;
  const m=payload.memberships.find(x=>x.user_id===id);
  return payload.classes.find(c=>c.id===m?.class_id)||null;
}
function progressForStudent(id){
  if(!id) return {rows:[],completed:0,avg:0,last:null,pending:0,changes:0};
  const rows=payload.progress.filter(p=>p.student_id===id);
  const completed=rows.filter(r=>r.status==='completed').length;
  const avg=rows.length?Math.round(rows.reduce((a,r)=>a+Number(r.progress_percent||0),0)/rows.length):0;
  const last=rows.map(r=>r.last_activity_at).filter(Boolean).sort().pop()||null;
  const pending=rows.filter(r=>r.approval_status==='pending').length;
  const changes=rows.filter(r=>r.approval_status==='changes_requested').length;
  return {rows,completed,avg,last,pending,changes};
}
function filteredStudents(){
  const q=$('staff-search').value.trim().toLowerCase();
  return studentRecords().filter(p=>{
    const c=classForStudent(p);
    const reviewOnly=$('staff-review-only')?.checked;
    const accessFilter=$('staff-access-filter')?.value||'all';
    const pr=progressForStudent(p.id);
    const reviewOk=!reviewOnly || pr.pending>0 || pr.changes>0;
    const accessOk =
      accessFilter==='all' ||
      (accessFilter==='never' && !p.id) ||
      (accessFilter==='linked' && !!p.id) ||
      (accessFilter==='missing_cgm' && !p.has_cgm);
    return (currentClass==='all'||c?.id===currentClass) &&
      (!q||`${p.full_name} ${p.email||''}`.toLowerCase().includes(q)) &&
      reviewOk && accessOk;
  });
}
function renderSummary(){
  const students=filteredStudents();
  const avg=students.length?Math.round(students.reduce((a,s)=>a+progressForStudent(s.id).avg,0)/students.length):0;
  const logged=students.filter(s=>!!s.id).length;
  const never=students.filter(s=>!s.id).length;
  const pendingCgm=students.filter(s=>!s.has_cgm).length;
  const reviews=students.reduce((a,s)=>a+progressForStudent(s.id).pending,0);
  $('staff-summary').innerHTML=`
    <article class="staff-metric"><span>Total de alunos</span><strong>${students.length}</strong><small>no filtro atual</small></article>
    <article class="staff-metric"><span>Progresso médio</span><strong>${avg}%</strong><small>atividades iniciadas</small></article>
    <article class="staff-metric"><span>Já acessaram</span><strong>${logged}</strong><small>contas vinculadas</small></article>
    <article class="staff-metric"><span>Nunca acessaram</span><strong>${never}</strong><small>aguardando login</small></article>
    <article class="staff-metric ${pendingCgm ? 'attention' : ''}"><span>CGM pendente</span><strong>${pendingCgm}</strong><small>cadastros incompletos</small></article>
    <article class="staff-metric ${reviews ? 'attention' : ''}"><span>Revisões</span><strong>${reviews}</strong><small>aguardando professor</small></article>`;
  const visibleCount=$('staff-visible-count');
  if(visibleCount) visibleCount.textContent=`${students.length} aluno${students.length===1?'':'s'}`;
}
function exerciseLabel(id){
  const ex=payload.exercises?.find(e=>e.id===id);
  return ex?`Ex. ${String(ex.exercise_number).padStart(2,'0')} — ${ex.title}`:'Exercício';
}
function renderStudents(){
  const box=$('staff-students'), students=filteredStudents();
  if(!students.length){box.innerHTML='<p class="muted">Nenhum aluno encontrado.</p>';return}
  box.innerHTML=students.map(s=>{
    const c=classForStudent(s), pr=progressForStudent(s.id);
    const recent=pr.rows.slice().sort((a,b)=>new Date(b.last_activity_at||0)-new Date(a.last_activity_at||0))[0];
    const badges=[
      !s.has_cgm?'<span class="badge danger">CGM pendente</span>':'',
      !s.id?'<span class="badge info">Nunca acessou</span>':'<span class="badge success">Conta vinculada</span>',
      pr.pending?`<span class="badge warning">${pr.pending} revisão</span>`:'',
      pr.changes?`<span class="badge danger">${pr.changes} ajustes</span>`:''
    ].join('');
    return `<article class="student-row ${!s.id?'not-claimed':''}">
      <div class="student-main">
        <div class="student-name-line">
          <strong>${esc(s.full_name)}</strong>
          <div class="badges">${badges}</div>
        </div>
        <span class="student-meta">${esc(c?.name||'Sem turma')}</span>
        <span class="student-email">${esc(s.email||'E-mail não localizado')}</span>
      </div>

      <div class="student-progress-block">
        <div class="student-progress-head">
          <strong>${pr.avg}%</strong>
          <span>${pr.completed} concluído${pr.completed===1?'':'s'}</span>
        </div>
        <div class="progress-bar mini"><span style="width:${pr.avg}%"></span></div>
      </div>

      <div class="student-actions">
        ${!s.id?'<span class="access-state">Aguardando primeiro acesso</span>':''}
        ${s.id&&recent?`<button class="button button-ghost button-small live-btn" data-student="${s.id}" data-exercise="${recent.exercise_id}" data-name="${esc(s.full_name)}">Ver código</button>`:''}
        ${s.roster_id?`<button class="button button-ghost button-small roster-btn" data-roster="${s.roster_id}">Matrícula</button>`:''}
        ${s.id?`<button class="button button-primary button-small detail-btn" data-student="${s.id}" data-name="${esc(s.full_name)}">Gerenciar</button>`:''}
      </div>
    </article>`;
  }).join('');
  box.querySelectorAll('.live-btn').forEach(b=>b.addEventListener('click',()=>openLive(b.dataset.student,b.dataset.exercise,b.dataset.name)));
  box.querySelectorAll('.roster-btn').forEach(b=>b.addEventListener('click',()=>openRosterEditor(b.dataset.roster)));
  box.querySelectorAll('.detail-btn').forEach(b=>b.addEventListener('click',()=>openStudentDetail(b.dataset.student,b.dataset.name)));
}


function setTeamMessage(text='',ok=false){
  const el=$('team-message'); if(!el)return;
  el.textContent=text; el.classList.toggle('hidden',!text); el.classList.toggle('ok',!!ok);
}
async function openTeamManager(){
  $('team-dialog').showModal();
  setTeamMessage();
  $('team-list').innerHTML='<div class="loading-card">Carregando equipe...</div>';
  await refreshTeamList();
}
async function refreshTeamList(){
  try{
    const data=await callStaffDirectory({action:'list'});
    teamData=data.staff||[];
    $('team-list').innerHTML=teamData.map(m=>`<article class="team-row ${m.active?'':'inactive'}">
      <div><strong>${esc(m.full_name)}</strong><span>${esc(m.email)}</span></div>
      <span class="badge ${m.role==='admin'?'warning':'info'}">${m.role==='admin'?'Administrador':'Professor'}</span>
      <button class="button button-ghost button-small team-toggle" data-email="${esc(m.email)}" data-active="${m.active?'1':'0'}">${m.active?'Desativar':'Ativar'}</button>
    </article>`).join('') || '<p class="muted">Nenhum membro cadastrado.</p>';
    $('team-list').querySelectorAll('.team-toggle').forEach(b=>b.onclick=()=>toggleTeamMember(b.dataset.email,b.dataset.active!=='1'));
  }catch(error){console.error(error);$('team-list').innerHTML='<p class="form-error">Não foi possível carregar a equipe.</p>';}
}
async function saveTeamMember(event){
  event.preventDefault(); setTeamMessage();
  const submit=event.submitter; submit.disabled=true; submit.textContent='Salvando...';
  try{
    await callStaffDirectory({action:'upsert',full_name:$('team-name').value.trim(),email:$('team-email').value.trim().toLowerCase(),role:$('team-role').value});
    setTeamMessage('Acesso autorizado. Use o mesmo formulário de login com a senha temporária institucional.',true);
    $('team-name').value=''; $('team-email').value=''; $('team-role').value='teacher';
    await refreshTeamList();
  }catch(error){
    console.error(error);
    const msg=String(error?.message||'');
    setTeamMessage(msg==='invalid_school_email'?'Use um e-mail @escola.pr.gov.br.':'Não foi possível autorizar este acesso.');
  }finally{submit.disabled=false;submit.textContent='Autorizar acesso';}
}
async function toggleTeamMember(email,active){
  try{await callStaffDirectory({action:'set_active',email,active});await refreshTeamList();}
  catch(error){console.error(error);setTeamMessage('Não foi possível alterar o acesso.');}
}

function rosterRecordById(id){
  return (payload?.preregistrations||[]).find(r=>r.id===id)||null;
}
function setRosterMessage(text='',ok=false){
  const el=$('roster-message'); if(!el)return;
  el.textContent=text;
  el.classList.toggle('hidden',!text);
  el.classList.toggle('ok',!!ok);
}
function openRosterEditor(id){
  const r=rosterRecordById(id); if(!r)return;
  rosterCtx=r;
  $('roster-title').textContent=r.full_name||'Editar matrícula';
  $('roster-email').value=r.institutional_email||'';
  $('roster-status').value=r.enrollment_status==='Transferido'?'Transferido':'Matriculado';
  $('roster-cgm').value='';
  $('roster-email').disabled=!!r.claimed_user_id;
  $('roster-cgm').disabled=!!r.claimed_user_id;
  $('roster-hint').textContent=r.claimed_user_id
    ? 'A conta já foi vinculada. E-mail e CGM ficam bloqueados aqui; você ainda pode alterar a situação da matrícula.'
    : (r.has_cgm ? 'CGM já cadastrado. Deixe o campo vazio para mantê-lo.' : 'CGM pendente: informe o número correto para liberar o primeiro acesso.');
  setRosterMessage();
  $('roster-dialog').showModal();
}
async function saveRosterRecord(event){
  event.preventDefault();
  if(!rosterCtx)return;
  const submit=event.submitter;
  submit.disabled=true; submit.textContent='Salvando...';
  setRosterMessage();
  try{
    const body={
      action:'update_preregistration',
      id:rosterCtx.id,
      enrollment_status:$('roster-status').value
    };
    if(!rosterCtx.claimed_user_id){
      body.institutional_email=$('roster-email').value.trim().toLowerCase();
      const cgm=$('roster-cgm').value.trim();
      if(cgm) body.cgm=cgm;
    }
    await callAdminRoster(body);
    setRosterMessage('Cadastro atualizado com segurança.',true);
    await refreshStaff();
    const updated=rosterRecordById(rosterCtx.id);
    if(updated){rosterCtx=updated;openRosterEditor(updated.id);}
  }catch(error){
    console.error(error);
    const msg=String(error?.message||'');
    const map={
      invalid_cgm:'CGM inválido. Use apenas números.',
      invalid_school_email:'Use um e-mail institucional @escola.pr.gov.br.',
      email_locked_after_claim:'A conta já foi vinculada; o e-mail não pode ser alterado aqui.',
      cgm_locked_after_claim:'A conta já foi vinculada; o CGM não pode ser alterado aqui.'
    };
    setRosterMessage(map[msg]||'Não foi possível atualizar a matrícula.');
  }finally{
    submit.disabled=false; submit.textContent='Salvar cadastro';
  }
}

async function openStudentDetail(studentId,name){
  detailCtx={studentId,name,data:null,exerciseId:null};
  $('student-detail-title').textContent=name;
  $('student-detail-body').innerHTML='<div class="loading-card">Carregando dados...</div>';
  $('student-detail-dialog').showModal();
  const data=await callStaff({action:'student_detail',student_id:studentId});
  detailCtx.data=data;
  const rows=(data.progress||[]).slice().sort((a,b)=>{
    const ea=payload.exercises.find(e=>e.id===a.exercise_id)?.exercise_number||999;
    const eb=payload.exercises.find(e=>e.id===b.exercise_id)?.exercise_number||999;
    return ea-eb;
  });
  $('student-detail-body').innerHTML=`
    <div class="student-exercise-grid">
      ${rows.map(r=>`
        <button class="exercise-manage-card" data-exercise="${r.exercise_id}">
          <span>${esc(exerciseLabel(r.exercise_id))}</span>
          <strong>${Math.round(Number(r.progress_percent||0))}%</strong>
          <small>${esc(r.status)} • ${esc(r.approval_status||'not_required')}</small>
        </button>`).join('') || '<p class="muted">O aluno ainda não iniciou exercícios.</p>'}
    </div>
    <div id="exercise-management" class="exercise-management hidden"></div>`;
  $('student-detail-body').querySelectorAll('.exercise-manage-card').forEach(b=>b.onclick=()=>renderExerciseManagement(b.dataset.exercise));
}
function renderExerciseManagement(exerciseId){
  detailCtx.exerciseId=exerciseId;
  const r=detailCtx.data.progress.find(x=>x.exercise_id===exerciseId)||{};
  const rel=detailCtx.data.releases.find(x=>x.exercise_id===exerciseId)||{};
  const acc=detailCtx.data.accommodations.filter(x=>x.exercise_id===exerciseId&&x.active);
  const box=$('exercise-management'); box.classList.remove('hidden');
  box.innerHTML=`
    <div class="management-head">
      <div><p class="eyebrow">Configuração individual</p><h3>${esc(exerciseLabel(exerciseId))}</h3></div>
      <button id="manage-live-btn" class="button button-ghost button-small">Abrir código</button>
    </div>
    <div class="management-grid">
      <section class="management-section">
        <h4>Acomodações e apoio</h4>
        <label class="switch-row"><span>HTML-base</span><input id="acc-html" type="checkbox" ${rel.allow_html_base?'checked':''}></label>
        <label class="switch-row"><span>CSS-base</span><input id="acc-css" type="checkbox" ${rel.allow_css_base?'checked':''}></label>
        <label class="switch-row"><span>JavaScript-base</span><input id="acc-js" type="checkbox" ${rel.allow_js_base?'checked':''}></label>
        <label class="switch-row"><span>Dicas extras</span><input id="acc-hints" type="checkbox" ${rel.allow_extra_hints?'checked':''}></label>
        <label class="switch-row"><span>Apoio guiado</span><input id="acc-guided" type="checkbox" ${rel.allow_guided_support?'checked':''}></label>
        <textarea id="acc-reason" placeholder="Motivo/observação pedagógica"></textarea>
        <button id="save-release-btn" class="button button-primary">Salvar apoios</button>
      </section>
      <section class="management-section">
        <h4>Feedback e aprovação</h4>
        <textarea id="teacher-feedback" placeholder="Orientação, dica extra ou ajuste solicitado">${esc(r.teacher_feedback||'')}</textarea>
        <div class="review-actions">
          <button id="request-review-btn" class="button button-ghost">Marcar para revisão</button>
          <button id="request-changes-btn" class="button button-ghost">Solicitar ajustes</button>
          <button id="approve-btn" class="button button-primary">Aprovar manualmente</button>
        </div>
      </section>
      <section class="management-section full">
        <h4>Acomodações ativas</h4>
        <div class="accommodation-list">
          ${acc.map(a=>`<div class="accommodation-item"><div><strong>${esc(a.accommodation_type)}</strong><small>${esc(a.reason||'Sem observação')}</small></div><button class="button button-ghost button-small disable-acc" data-id="${a.id}">Desativar</button></div>`).join('')||'<p class="muted">Nenhuma acomodação individual registrada.</p>'}
        </div>
        <div class="custom-accommodation">
          <input id="custom-acc-title" placeholder="Ex.: tempo adicional, validação simplificada">
          <textarea id="custom-acc-text" placeholder="Descreva o apoio que deve aparecer para o aluno"></textarea>
          <button id="add-custom-acc" class="button button-ghost">Adicionar acomodação personalizada</button>
        </div>
      </section>
    </div>`;
  $('manage-live-btn').onclick=()=>openLive(detailCtx.studentId,exerciseId,detailCtx.name);
  $('save-release-btn').onclick=saveRelease;
  $('request-review-btn').onclick=()=>manualReview('pending');
  $('request-changes-btn').onclick=()=>manualReview('changes_requested');
  $('approve-btn').onclick=()=>manualReview('approved');
  $('add-custom-acc').onclick=addCustomAccommodation;
  box.querySelectorAll('.disable-acc').forEach(b=>b.onclick=()=>disableAccommodation(b.dataset.id));
}
async function saveRelease(){
  await callStaff({action:'set_release',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,
    allow_html_base:$('acc-html').checked,allow_css_base:$('acc-css').checked,allow_js_base:$('acc-js').checked,
    allow_extra_hints:$('acc-hints').checked,allow_guided_support:$('acc-guided').checked});
  const reason=$('acc-reason').value.trim();
  if(reason) await callStaff({action:'set_accommodation',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,accommodation_type:'teacher_support',reason,config:{message:reason}});
  await reopenDetail();
}
async function manualReview(status){
  await callStaff({action:'manual_review',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,approval_status:status,teacher_feedback:$('teacher-feedback').value.trim()});
  await reopenDetail();
}
async function addCustomAccommodation(){
  const title=$('custom-acc-title').value.trim()||'apoio_personalizado';
  const text=$('custom-acc-text').value.trim();
  if(!text)return;
  await callStaff({action:'set_accommodation',student_id:detailCtx.studentId,exercise_id:detailCtx.exerciseId,accommodation_type:title,reason:text,config:{message:text}});
  await reopenDetail();
}
async function disableAccommodation(id){
  await callStaff({action:'disable_accommodation',id});
  await reopenDetail();
}
async function reopenDetail(){
  const ex=detailCtx.exerciseId;
  const data=await callStaff({action:'student_detail',student_id:detailCtx.studentId});
  detailCtx.data=data; renderExerciseManagement(ex);
  await refreshStaff();
}
async function openLive(studentId,exerciseId,name){
  liveCtx={studentId,exerciseId,name,active:null};
  $('live-title').textContent=`${name} • ${exerciseLabel(exerciseId)}`;
  $('live-dialog').showModal();
  await updateLive();
  pollTimer=setInterval(updateLive,1000);
}
async function updateLive(){
  if(!liveCtx)return;
  try{
    const data=await callStaff({action:'student_files',student_id:liveCtx.studentId,exercise_id:liveCtx.exerciseId});
    const files=data.files||[];
    if(!liveCtx.active||!files.some(f=>f.id===liveCtx.active)) liveCtx.active=files[0]?.id||null;
    $('live-file-tabs').innerHTML=files.map(f=>`<button type="button" class="file-tab ${f.id===liveCtx.active?'active':''}" data-id="${f.id}">${esc(f.filename)}</button>`).join('');
    $('live-file-tabs').querySelectorAll('.file-tab').forEach(b=>b.onclick=()=>{liveCtx.active=b.dataset.id;updateLive()});
    const file=files.find(f=>f.id===liveCtx.active);
    $('live-code').textContent=file?.content||'Nenhum conteúdo salvo ainda.';
    $('live-status').textContent=file?`Ao vivo • revisão ${file.revision} • ${new Date(file.saved_at).toLocaleTimeString('pt-BR')}`:'Aguardando primeiro salvamento';
  }catch(e){$('live-status').textContent='Falha ao atualizar acompanhamento.'}
}
function closeLive(){clearInterval(pollTimer);pollTimer=null;liveCtx=null;$('live-dialog').close()}


import { supabase } from './supabase.js';

let payload=null, currentClass='all', pollTimer=null, liveCtx=null, detailCtx=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

async function callStaff(body){
  const {data,error}=await supabase.functions.invoke('staff-dashboard',{body});
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  return data;
}
export function isStaff(profile){return ['teacher','admin','super_admin'].includes(profile?.role)}
export async function openStaffPanel(){
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
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
function classForStudent(id){
  const m=payload.memberships.find(x=>x.user_id===id);
  return payload.classes.find(c=>c.id===m?.class_id)||null;
}
function progressForStudent(id){
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
  return payload.profiles.filter(p=>{
    const c=classForStudent(p.id);
    return (currentClass==='all'||c?.id===currentClass) && (!q||`${p.full_name} ${p.email||''}`.toLowerCase().includes(q));
  });
}
function renderSummary(){
  const students=filteredStudents();
  const active=students.filter(s=>{const x=progressForStudent(s.id).last;return x&&(Date.now()-new Date(x).getTime()<15*60*1000)}).length;
  const avg=students.length?Math.round(students.reduce((a,s)=>a+progressForStudent(s.id).avg,0)/students.length):0;
  const reviews=students.reduce((a,s)=>a+progressForStudent(s.id).pending,0);
  $('staff-summary').innerHTML=`
    <div class="stat-card"><span>Alunos</span><strong>${students.length}</strong></div>
    <div class="stat-card"><span>Progresso médio</span><strong>${avg}%</strong></div>
    <div class="stat-card"><span>Ativos 15 min</span><strong>${active}</strong></div>
    <div class="stat-card"><span>Revisões pendentes</span><strong>${reviews}</strong></div>`;
}
function exerciseLabel(id){
  const ex=payload.exercises?.find(e=>e.id===id);
  return ex?`Ex. ${String(ex.exercise_number).padStart(2,'0')} — ${ex.title}`:'Exercício';
}
function renderStudents(){
  const box=$('staff-students'), students=filteredStudents();
  if(!students.length){box.innerHTML='<p class="muted">Nenhum aluno encontrado.</p>';return}
  box.innerHTML=students.map(s=>{
    const c=classForStudent(s.id), pr=progressForStudent(s.id);
    const recent=pr.rows.slice().sort((a,b)=>new Date(b.last_activity_at||0)-new Date(a.last_activity_at||0))[0];
    const badges=[pr.pending?`<span class="badge warning">${pr.pending} revisão</span>`:'',pr.changes?`<span class="badge danger">${pr.changes} ajustes</span>`:''].join('');
    return `<article class="student-row">
      <div class="student-main"><strong>${esc(s.full_name)}</strong><span>${esc(c?.name||'Sem turma')} • ${esc(s.email||'')}</span><div class="badges">${badges}</div></div>
      <div class="student-progress"><strong>${pr.avg}%</strong><span>${pr.completed} concluídos</span></div>
      <div class="progress-bar mini"><span style="width:${pr.avg}%"></span></div>
      <div class="student-actions">
        ${recent?`<button class="button button-ghost button-small live-btn" data-student="${s.id}" data-exercise="${recent.exercise_id}" data-name="${esc(s.full_name)}">Ver exercício</button>`:''}
        <button class="button button-primary button-small detail-btn" data-student="${s.id}" data-name="${esc(s.full_name)}">Gerenciar</button>
      </div>
    </article>`;
  }).join('');
  box.querySelectorAll('.live-btn').forEach(b=>b.addEventListener('click',()=>openLive(b.dataset.student,b.dataset.exercise,b.dataset.name)));
  box.querySelectorAll('.detail-btn').forEach(b=>b.addEventListener('click',()=>openStudentDetail(b.dataset.student,b.dataset.name)));
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
$('staff-refresh-btn')?.addEventListener('click',refreshStaff);
$('staff-class-filter')?.addEventListener('change',e=>{currentClass=e.target.value;renderSummary();renderStudents()});
$('staff-search')?.addEventListener('input',()=>{renderSummary();renderStudents()});
$('live-close-btn')?.addEventListener('click',closeLive);
$('staff-back-btn')?.addEventListener('click',()=>location.reload());
$('student-detail-close-btn')?.addEventListener('click',()=>$('student-detail-dialog').close());

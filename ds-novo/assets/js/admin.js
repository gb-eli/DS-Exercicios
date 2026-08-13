
import { supabase } from './supabase.js';

let payload=null, currentClass='all', pollTimer=null, liveCtx=null;

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
  $('staff-students').innerHTML='<p class="muted">Carregando dados...</p>';
  payload=await callStaff({action:'overview'});
  renderFilters(); renderSummary(); renderStudents();
}
function renderFilters(){
  const sel=$('staff-class-filter');
  const prev=sel.value||currentClass;
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
  return {rows,completed,avg,last};
}
function filteredStudents(){
  const q=$('staff-search').value.trim().toLowerCase();
  return payload.profiles.filter(p=>{
    const c=classForStudent(p.id);
    const classOk=currentClass==='all'||c?.id===currentClass;
    const qOk=!q||`${p.full_name} ${p.email||''}`.toLowerCase().includes(q);
    return classOk&&qOk;
  });
}
function renderSummary(){
  const students=filteredStudents();
  const onlineish=students.filter(s=>{
    const x=progressForStudent(s.id).last; return x&&(Date.now()-new Date(x).getTime()<15*60*1000);
  }).length;
  const avg=students.length?Math.round(students.reduce((a,s)=>a+progressForStudent(s.id).avg,0)/students.length):0;
  $('staff-summary').innerHTML=`
    <div class="stat-card"><span>Alunos</span><strong>${students.length}</strong></div>
    <div class="stat-card"><span>Progresso médio</span><strong>${avg}%</strong></div>
    <div class="stat-card"><span>Ativos nos últimos 15 min</span><strong>${onlineish}</strong></div>`;
}
function renderStudents(){
  const box=$('staff-students'), students=filteredStudents();
  if(!students.length){box.innerHTML='<p class="muted">Nenhum aluno encontrado.</p>';return}
  box.innerHTML=students.map(s=>{
    const c=classForStudent(s.id), pr=progressForStudent(s.id);
    const recent=pr.rows.slice().sort((a,b)=>new Date(b.last_activity_at||0)-new Date(a.last_activity_at||0))[0];
    return `<article class="student-row">
      <div class="student-main"><strong>${esc(s.full_name)}</strong><span>${esc(c?.name||'Sem turma')} • ${esc(s.email||'')}</span></div>
      <div class="student-progress"><strong>${pr.avg}%</strong><span>${pr.completed} concluídos</span></div>
      <div class="progress-bar mini"><span style="width:${pr.avg}%"></span></div>
      <div class="student-actions">
        ${recent?`<button class="button button-ghost button-small live-btn" data-student="${s.id}" data-exercise="${recent.exercise_id}" data-name="${esc(s.full_name)}">Acompanhar código</button>`:'<span class="muted">Sem atividade</span>'}
      </div>
    </article>`;
  }).join('');
  box.querySelectorAll('.live-btn').forEach(b=>b.addEventListener('click',()=>openLive(b.dataset.student,b.dataset.exercise,b.dataset.name)));
}
async function openLive(studentId,exerciseId,name){
  liveCtx={studentId,exerciseId,name,active:null};
  $('live-title').textContent=name;
  $('live-dialog').showModal();
  await updateLive();
  pollTimer=setInterval(updateLive,2000);
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
    $('live-status').textContent=file?`Revisão ${file.revision} • salvo ${new Date(file.saved_at).toLocaleTimeString('pt-BR')}`:'Aguardando primeiro salvamento';
  }catch(e){$('live-status').textContent='Falha ao atualizar acompanhamento.'}
}
function closeLive(){
  clearInterval(pollTimer); pollTimer=null; liveCtx=null;
  $('live-dialog').close();
}
$('staff-refresh-btn')?.addEventListener('click',refreshStaff);
$('staff-class-filter')?.addEventListener('change',e=>{currentClass=e.target.value;renderSummary();renderStudents()});
$('staff-search')?.addEventListener('input',()=>{renderSummary();renderStudents()});
$('live-close-btn')?.addEventListener('click',closeLive);
$('staff-back-btn')?.addEventListener('click',()=>location.reload());

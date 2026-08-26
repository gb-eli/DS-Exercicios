const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=v=>Math.max(0,Math.min(100,Math.round(Number(v||0))));
const dt=v=>{if(!v)return'—';const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});};
const modeLabel=v=>v==='adapted'?'Experiência personalizada':v==='conventional'?'Convencional':'Sem preferência';
const purposeLabel=v=>({evaluation:'Avaliação',recovery:'Recuperação',complementary:'Complementar',extra:'Desafio extra',practice:'Prática'})[v]||'Atividade';
const eventLabel=v=>({offer_shown:'Experiência apresentada',mode_selected:'Modo escolhido',experience_opened:'Entrada na experiência',experience_closed:'Saída da experiência',checkpoint_completed:'Checkpoint concluído',checkpoint_reopened:'Checkpoint reaberto',help_requested:'Ajuda solicitada',preference_updated:'Preferências atualizadas',assignment_started:'Atividade iniciada',assignment_completed:'Atividade concluída',teacher_preview_opened:'Prévia aberta pelo professor'})[v]||String(v||'Registro');

async function staffCall(supabase,body){
  const {data,error}=await supabase.functions.invoke('staff-dashboard',{body});
  if(error)throw error;if(data?.error)throw new Error(data.error);return data||{};
}

function ensureDialogs(){
  if(document.getElementById('experience-center-dialog'))return;
  document.body.insertAdjacentHTML('beforeend',`
    <dialog id="experience-center-dialog" class="history-dialog">
      <div class="history-card panel experience-admin-card">
        <div class="history-head"><div><p class="eyebrow">Acompanhamento</p><h3>Experiências personalizadas</h3><p class="muted">Compare os dois modos sem alterar código, progresso, nota ou histórico convencional.</p></div><button id="experience-center-close" class="button button-ghost button-small" type="button">Fechar</button></div>
        <div class="experience-admin-filters"><input id="experience-admin-search" type="search" placeholder="Buscar aluno"><select id="experience-admin-class"><option value="all">Todas as turmas</option></select><select id="experience-admin-subject"><option value="all">Todas as disciplinas</option></select></div>
        <div id="experience-admin-summary" class="experience-admin-summary"></div>
        <div id="experience-admin-list" class="experience-admin-list"></div>
        <div id="experience-admin-detail" class="experience-admin-detail hidden"></div>
      </div>
    </dialog>
    <dialog id="experience-preview-dialog" class="history-dialog">
      <div class="history-card panel experience-preview-card">
        <div class="history-head"><div><p class="eyebrow">Prévia segura</p><h3 id="experience-preview-title">Visualizar como aluno</h3><p class="muted">Modo sandbox: nenhum clique desta prévia grava progresso, respostas, código ou escolha do aluno.</p></div><button id="experience-preview-close" class="button button-ghost button-small" type="button">Fechar</button></div>
        <div class="experience-preview-toolbar"><button class="button button-ghost button-small" data-size="mobile">Celular</button><button class="button button-ghost button-small" data-size="tablet">Tablet</button><button class="button button-ghost button-small is-selected" data-size="desktop">Computador</button></div>
        <div class="experience-preview-sandbox">PRÉVIA DO PROFESSOR • NENHUMA AÇÃO SERÁ SALVA PARA O ALUNO</div>
        <div id="experience-preview-frame" class="experience-preview-frame size-desktop"></div>
      </div>
    </dialog>
    <dialog id="experience-create-dialog" class="history-dialog">
      <form id="experience-create-form" class="history-card panel experience-create-card">
        <div class="history-head"><div><p class="eyebrow">Nova atribuição</p><h3 id="experience-create-title">Atividade personalizada</h3><p class="muted">A atividade será criada em paralelo. Ela não substitui nenhuma atividade convencional.</p></div><button id="experience-create-close" class="button button-ghost button-small" type="button">Fechar</button></div>
        <div class="experience-create-grid">
          <label>Disciplina<select id="experience-create-subject" required></select></label>
          <label>Finalidade<select id="experience-create-purpose"><option value="complementary">Complementar</option><option value="practice">Prática</option><option value="recovery">Recuperação</option><option value="evaluation">Avaliação</option><option value="extra">Desafio extra</option></select></label>
          <label class="wide">Título<input id="experience-create-name" maxlength="180" required placeholder="Ex.: Revisão guiada — HTML"></label>
          <label class="wide">Orientação<textarea id="experience-create-instruction" maxlength="2500" required placeholder="Escreva uma orientação objetiva para o aluno."></textarea></label>
          <label>Prazo<input id="experience-create-deadline" type="date"></label>
          <label>Tempo extra (min)<input id="experience-create-extra-time" type="number" min="0" max="1440" value="0"></label>
        </div>
        <div class="dialog-actions"><button class="button button-primary" type="submit">Atribuir atividade</button><span id="experience-create-status" class="muted"></span></div>
      </form>
    </dialog>`);
}

function conventionalSummary(student,subjectSlug=null){
  const rows=(student.conventional_progress||[]).filter(x=>!subjectSlug||x.subject_slug===subjectSlug),done=rows.filter(x=>x.status==='completed').length,inProgress=rows.filter(x=>x.status==='in_progress').length;
  return {total:rows.length,done,inProgress,pct:rows.length?Math.round(done/rows.length*100):0};
}
function experienceSummary(student,subjectSlug=null){
  const rows=student.experience_progress||[],assignments=(student.assignments||[]).filter(x=>x.active!==false&&(!subjectSlug||x.subject_slug===subjectSlug)),done=assignments.filter(a=>pct(rows.find(r=>String(r.assignment_id)===String(a.id))?.progress_percent)>=100).length;
  return {total:assignments.length,done,pct:assignments.length?Math.round(done/assignments.length*100):0};
}
function latestEvent(student){return (student.events||[])[0]||null;}
function uniqueClasses(students){const m=new Map();for(const s of students){if(s.class?.id)m.set(String(s.class.id),s.class);}return [...m.values()].sort((a,b)=>String(a.name||a.code).localeCompare(String(b.name||b.code),'pt-BR'));}
function uniqueSubjects(students){const m=new Map();for(const student of students){for(const row of student.conventional_progress||[]){if(row.subject_slug)m.set(String(row.subject_slug),String(row.subject_name||row.subject_slug));}for(const row of student.assignments||[]){if(row.subject_slug)m.set(String(row.subject_slug),String(row.subject_name||row.subject_slug));}}return [...m.entries()].map(([slug,name])=>({slug,name})).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));}
function assignmentEvidence(student,assignment){const progress=(student.experience_progress||[]).find(r=>String(r.assignment_id)===String(assignment.id))||{},steps=Array.isArray(assignment.config?.steps)?assignment.config.steps:[],completed=Object.values(progress.completed_steps||{}).filter(Boolean).length,responses=Object.entries(progress.responses||{}),drafts=Object.entries(progress.drafts||{}),helps=(student.events||[]).filter(e=>String(e.assignment_id||'')===String(assignment.id)&&e.event_type==='help_requested').length;return {progress,steps,completed,responses,drafts,helps};}
function subjectRows(student){
  const map=new Map();
  for(const row of student.conventional_progress||[]){const key=row.subject_slug||row.subject_name||'disciplina';if(!map.has(key))map.set(key,{slug:key,name:row.subject_name||key});}
  for(const row of student.assignments||[]){const key=row.subject_slug||row.subject_name||'disciplina';if(!map.has(key))map.set(key,{slug:key,name:row.subject_name||key});}
  return [...map.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR')).map(s=>({...s,conventional:conventionalSummary(student,s.slug),exclusive:experienceSummary(student,s.slug)}));
}
function recordedMinutes(student,mode){
  const events=(student.events||[]).filter(e=>e.mode===mode&&['experience_opened','experience_closed'].includes(e.event_type)).slice().sort((a,b)=>Date.parse(a.occurred_at)-Date.parse(b.occurred_at));
  const opened=[];let ms=0;
  for(const e of events){const t=Date.parse(e.occurred_at);if(!Number.isFinite(t))continue;if(e.event_type==='experience_opened')opened.push(t);else if(opened.length)ms+=Math.max(0,t-opened.shift());}
  return Math.round(ms/60000);
}
function subjectOptions(student){
  const rows=subjectRows(student);return rows.length?rows:[{slug:'geral',name:'Geral'}];
}

async function renderPreview(supabase,student,assignment=null){
  try{await staffCall(supabase,{action:'log_teacher_preview',student_id:student.student_id,assignment_id:assignment?.id||null});}catch(error){console.warn('[experiences] prévia não registrada',error);}
  const dialog=document.getElementById('experience-preview-dialog'),frame=document.getElementById('experience-preview-frame'),title=document.getElementById('experience-preview-title');
  const cfg=student.adaptation?.config||{},p=cfg.personalization||{},name=String(student.full_name||'Aluno').split(/\s+/)[0],accent=/^#[0-9a-f]{3,8}$/i.test(String(p.accent||''))?p.accent:'#4f8cff';
  title.textContent=`Prévia • ${student.full_name}`;frame.style.setProperty('--preview-accent',accent);
  const interests=Array.isArray(p.interests)?p.interests.slice(0,5):[],steps=Array.isArray(assignment?.config?.steps)?assignment.config.steps:[];
  const stepHtml=steps.map((step,i)=>`<article class="preview-step" data-preview-step="${i}"><b>${i+1}</b><div><strong>${esc(step.title||`Etapa ${i+1}`)}</strong><p>${esc(step.text||step.instruction||step.explanation||'')}</p>${Array.isArray(step.tips)&&step.tips.length?`<details><summary>Preciso de ajuda</summary>${step.tips.map((tip,j)=>`<p>Pista ${j+1}: ${esc(tip)}</p>`).join('')}</details>`:''}${step.type==='code'?`<label class="preview-code-label">${esc(step.filename||'Código')}<textarea class="preview-code" data-language="${esc(step.language||'')}" data-preview="${esc(step.preview||'')}">${esc(step.starter||'')}</textarea></label>${String(step.language||'').toLowerCase()==='html'||step.preview==='html'?'<iframe class="preview-code-frame" title="Prévia do código" sandbox="allow-scripts"></iframe>':''}`:''}${step.type==='quiz'||step.type==='choice'?`<div class="preview-options">${(step.options||[]).map(o=>`<button type="button">${esc(o)}</button>`).join('')}</div>`:''}</div></article>`).join('');
  frame.innerHTML=`<div class="experience-preview-student"><header><span>Experiência de aprendizagem</span><strong>${esc(p.dashboard_title||`Sua experiência, ${name}`)}</strong><p>${esc(p.dashboard_message||'Você pode escolher como prefere realizar suas atividades.')}</p><small>${interests.length?`Interesses usados quando ajudam no conteúdo: ${esc(interests.join(', '))}`:'Personalização pedagógica ativa'}</small></header>${assignment?`<section><div class="preview-assignment-head"><span>${esc(assignment.subject_name)} • ${esc(purposeLabel(assignment.purpose))}</span><h4>${esc(assignment.title)}</h4><p>${esc(assignment.config?.intro||assignment.config?.summary||'Atividade organizada em etapas.')}</p></div>${assignment.config?.presentation==='single_step'&&steps.length?'<div class="preview-step-navigation"><button type="button" data-preview-nav="prev">Anterior</button><span data-preview-counter></span><button type="button" data-preview-nav="next">Próxima</button></div>':''}<div class="preview-steps">${stepHtml||'<p class="muted">Nenhuma etapa configurada nesta experiência.</p>'}</div></section>`:`<section><strong>Preferência atual: ${modeLabel(student.mode_preference?.mode)}</strong><p>A identidade visual, a organização e os apoios são os mesmos que o aluno receberá. Selecione uma atividade para pré-visualizar também as etapas.</p></section>`}</div>`;
  frame.querySelectorAll('.preview-code').forEach(area=>{const iframe=area.closest('.preview-step')?.querySelector('.preview-code-frame');const refresh=()=>{if(iframe)iframe.srcdoc=area.value;};area.addEventListener('input',refresh);refresh();});
  frame.querySelectorAll('.preview-options button').forEach(button=>button.addEventListener('click',()=>{button.parentElement?.querySelectorAll('button').forEach(x=>x.classList.remove('is-selected'));button.classList.add('is-selected');}));
  if(assignment?.config?.presentation==='single_step'&&steps.length){let current=0;const cards=[...frame.querySelectorAll('.preview-step')],counter=frame.querySelector('[data-preview-counter]'),show=()=>{cards.forEach((card,i)=>card.classList.toggle('hidden',i!==current));if(counter)counter.textContent=`Etapa ${current+1} de ${cards.length}`;const prev=frame.querySelector('[data-preview-nav="prev"]'),next=frame.querySelector('[data-preview-nav="next"]');if(prev)prev.disabled=current===0;if(next)next.disabled=current===cards.length-1;};frame.querySelector('[data-preview-nav="prev"]')?.addEventListener('click',()=>{current=Math.max(0,current-1);show();});frame.querySelector('[data-preview-nav="next"]')?.addEventListener('click',()=>{current=Math.min(cards.length-1,current+1);show();});show();}
  try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
}

function openCreateAssignment({supabase,student,onCreated}){
  const dialog=document.getElementById('experience-create-dialog'),form=document.getElementById('experience-create-form'),subject=document.getElementById('experience-create-subject'),status=document.getElementById('experience-create-status');
  document.getElementById('experience-create-title').textContent=`Nova atividade • ${student.full_name}`;
  subject.innerHTML=subjectOptions(student).map(x=>`<option value="${esc(x.slug)}" data-name="${esc(x.name)}">${esc(x.name)}</option>`).join('');
  form.reset();status.textContent='';
  form.onsubmit=async event=>{event.preventDefault();const option=subject.selectedOptions[0],deadline=document.getElementById('experience-create-deadline').value;status.textContent='Salvando…';try{await staffCall(supabase,{action:'create_experience_assignment',student_id:student.student_id,subject_slug:subject.value,subject_name:option?.dataset.name||option?.textContent||subject.value,title:document.getElementById('experience-create-name').value,purpose:document.getElementById('experience-create-purpose').value,instruction:document.getElementById('experience-create-instruction').value,deadline:deadline?`${deadline}T23:59:59-03:00`:null,extra_time_minutes:Number(document.getElementById('experience-create-extra-time').value||0)});status.textContent='Atividade atribuída.';setTimeout(()=>dialog.close(),450);await onCreated?.();}catch(error){status.textContent=`Não foi possível salvar: ${error?.message||error}`;}};
  try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
}

function renderStudentDetail({supabase,student,onBack,onReload}){
  const host=document.getElementById('experience-admin-detail'),list=document.getElementById('experience-admin-list');list.classList.add('hidden');host.classList.remove('hidden');
  const conv=conventionalSummary(student),xp=experienceSummary(student),events=student.events||[],assignments=(student.assignments||[]).slice().sort((a,b)=>Number(a.display_order||0)-Number(b.display_order||0)),preference=student.preference||{},bySubject=subjectRows(student),convMinutes=recordedMinutes(student,'conventional'),xpMinutes=recordedMinutes(student,'adapted');
  host.innerHTML=`<div class="experience-detail-head"><button id="experience-detail-back" class="button button-ghost button-small">← Lista</button><div><p class="eyebrow">${esc(student.class?.name||student.class?.code||'Turma')}</p><h4>${esc(student.full_name)}</h4><p class="muted">${esc(student.email||'')}</p></div><div class="experience-detail-actions"><button id="experience-create-assignment" class="button button-ghost button-small">Nova atribuição</button><button id="experience-preview-profile" class="button button-primary button-small">Visualizar como aluno</button></div></div>
  <div class="experience-detail-grid"><article><span>Preferência atual</span><strong>${modeLabel(student.mode_preference?.mode)}</strong></article><article><span>Convencional</span><strong>${conv.done}/${conv.total} • ${conv.pct}%</strong><small>${convMinutes} min registrados</small></article><article><span>Experiência exclusiva</span><strong>${xp.done}/${xp.total} • ${xp.pct}%</strong><small>${xpMinutes} min registrados</small></article><article><span>Último acesso</span><strong>${dt(student.last_login_at)}</strong></article></div>
  <section class="experience-admin-section"><h5>Preferências declaradas pelo aluno</h5><div class="experience-pref-grid"><span>Nível: <b>${esc(preference.programming_level||'não informado')}</b></span><span>Explicações: <b>${esc(preference.explanation_style||'não informado')}</b></span><span>Desafios extras: <b>${esc(preference.extra_challenges||'não informado')}</b></span><span>Ajuda: <b>${esc((preference.support_focus||[]).join(', ')||'não informado')}</b></span></div></section>
  <section class="experience-admin-section"><h5>Progresso por disciplina</h5><div class="experience-subject-report">${bySubject.map(s=>`<article><strong>${esc(s.name)}</strong><span>Convencional <b>${s.conventional.done}/${s.conventional.total} • ${s.conventional.pct}%</b></span><span>Personalizada <b>${s.exclusive.done}/${s.exclusive.total} • ${s.exclusive.pct}%</b></span></article>`).join('')||'<p class="muted">Ainda não há progresso por disciplina.</p>'}</div></section>
  <section class="experience-admin-section"><h5>Experiências exclusivas</h5><div class="experience-admin-assignments">${assignments.map(a=>{const ev=assignmentEvidence(student,a),pr=ev.progress,deadline=a.deadline?new Date(a.deadline).toISOString().slice(0,10):'',evidence=[...ev.responses.map(([k,v])=>`<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`),...ev.drafts.map(([k,v])=>`<div class="experience-evidence-code"><b>Código • ${esc(k)}</b><pre>${esc(String(v).slice(0,4000))}</pre></div>`)].join('');return `<article data-id="${a.id}"><div><span>${esc(a.subject_name)} • ${esc(purposeLabel(a.purpose))}</span><strong>${esc(a.title)}</strong><small>${pct(pr?.progress_percent)}% • ${ev.completed}/${ev.steps.length} checkpoints • ${ev.responses.length} respostas • ${ev.helps} ajudas</small><details class="experience-assignment-evidence"><summary>Evidências da atividade</summary>${evidence||'<p class="muted">Ainda não há respostas ou código nesta atividade.</p>'}</details></div><label>Prazo <input type="date" class="experience-deadline" value="${deadline}"></label><label>Tempo extra <input type="number" class="experience-extra-time" min="0" max="1440" value="${Number(a.extra_time_minutes||0)}"> min</label><label class="experience-active-label"><input type="checkbox" class="experience-active" ${a.active!==false?'checked':''}> Ativa</label><button class="button button-ghost button-small experience-save-settings">Salvar ajustes</button><button class="button button-ghost button-small experience-preview-assignment">Prévia</button></article>`}).join('')||'<p class="muted">Nenhuma atividade exclusiva atribuída.</p>'}</div></section>
  <section class="experience-admin-section"><h5>Histórico de uso</h5><p class="muted">Registra escolhas e interações pedagógicas; não é usado como punição disciplinar.</p><div class="experience-event-list">${events.slice(0,80).map(e=>`<div><time>${dt(e.occurred_at)}</time><strong>${esc(eventLabel(e.event_type))}</strong><span>${esc(e.mode?modeLabel(e.mode):e.subject_slug||'')}</span></div>`).join('')||'<p class="muted">Ainda não há eventos registrados.</p>'}</div></section>`;
  host.querySelector('#experience-detail-back').onclick=()=>{host.classList.add('hidden');list.classList.remove('hidden');onBack?.();};
  host.querySelector('#experience-preview-profile').onclick=()=>void renderPreview(supabase,student,null);
  host.querySelector('#experience-create-assignment').onclick=()=>openCreateAssignment({supabase,student,onCreated:onReload});
  host.querySelectorAll('.experience-admin-assignments article').forEach(article=>{
    const id=article.dataset.id,assignment=assignments.find(a=>String(a.id)===String(id));
    article.querySelector('.experience-preview-assignment').onclick=()=>void renderPreview(supabase,student,assignment);
    article.querySelector('.experience-save-settings').onclick=async()=>{const button=article.querySelector('.experience-save-settings'),deadline=article.querySelector('.experience-deadline').value;button.disabled=true;button.textContent='Salvando…';try{await staffCall(supabase,{action:'update_experience_assignment',id,deadline:deadline?`${deadline}T23:59:59-03:00`:null,extra_time_minutes:Number(article.querySelector('.experience-extra-time').value||0),active:article.querySelector('.experience-active').checked});button.textContent='Salvo';await onReload?.();}finally{button.disabled=false;setTimeout(()=>{if(button.isConnected)button.textContent='Salvar ajustes';},900);}};
  });
}

export async function openExperienceCenter({supabase}){
  ensureDialogs();
  const dialog=document.getElementById('experience-center-dialog'),list=document.getElementById('experience-admin-list'),detail=document.getElementById('experience-admin-detail'),summary=document.getElementById('experience-admin-summary'),search=document.getElementById('experience-admin-search'),classFilter=document.getElementById('experience-admin-class'),subjectFilter=document.getElementById('experience-admin-subject');
  document.getElementById('experience-center-close').onclick=()=>dialog.close();document.getElementById('experience-preview-close').onclick=()=>document.getElementById('experience-preview-dialog').close();document.getElementById('experience-create-close').onclick=()=>document.getElementById('experience-create-dialog').close();
  document.querySelectorAll('.experience-preview-toolbar [data-size]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.experience-preview-toolbar [data-size]').forEach(x=>x.classList.remove('is-selected'));btn.classList.add('is-selected');document.getElementById('experience-preview-frame').className=`experience-preview-frame size-${btn.dataset.size}`;});
  list.innerHTML='<p class="muted">Carregando acompanhamento…</p>';detail.classList.add('hidden');list.classList.remove('hidden');try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
  let data=await staffCall(supabase,{action:'experience_overview'}),students=(data.students||[]).filter(s=>s.adaptation);
  const classes=uniqueClasses(students),subjects=uniqueSubjects(students);classFilter.innerHTML='<option value="all">Todas as turmas</option>'+classes.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.code)}</option>`).join('');subjectFilter.innerHTML='<option value="all">Todas as disciplinas</option>'+subjects.map(x=>`<option value="${esc(x.slug)}">${esc(x.name)}</option>`).join('');
  let currentStudentId=null;
  const reload=async()=>{data=await staffCall(supabase,{action:'experience_overview'});students=(data.students||[]).filter(s=>s.adaptation);if(currentStudentId){const fresh=students.find(x=>String(x.student_id)===String(currentStudentId));if(fresh)renderStudentDetail({supabase,student:fresh,onReload:reload,onBack:()=>{currentStudentId=null;draw();}});}else draw();};
  const draw=()=>{const q=search.value.trim().toLowerCase(),cid=classFilter.value,sub=subjectFilter.value,filtered=students.filter(s=>(cid==='all'||String(s.class?.id)===cid)&&(sub==='all'||(s.conventional_progress||[]).some(x=>x.subject_slug===sub)||(s.assignments||[]).some(x=>x.subject_slug===sub))&&(!q||String(s.full_name||'').toLowerCase().includes(q)||String(s.email||'').toLowerCase().includes(q)));const exclusive=filtered.reduce((n,s)=>n+(s.assignments||[]).filter(a=>a.active!==false).length,0),adaptedNow=filtered.filter(s=>s.mode_preference?.mode==='adapted').length;summary.innerHTML=`<span><b>${filtered.length}</b> alunos com experiência</span><span><b>${adaptedNow}</b> preferindo personalizada</span><span><b>${exclusive}</b> atividades exclusivas ativas</span>`;list.replaceChildren();if(!filtered.length){list.innerHTML='<p class="muted">Nenhum aluno encontrado.</p>';return;}filtered.forEach(student=>{const conv=conventionalSummary(student),xp=experienceSummary(student),last=latestEvent(student),card=document.createElement('button');card.type='button';card.className='experience-admin-student';card.innerHTML=`<div><span>${esc(student.class?.name||student.class?.code||'Turma')}</span><strong>${esc(student.full_name)}</strong><small>${esc(student.email||'')}</small></div><div class="experience-admin-metrics"><span>Preferência <b>${modeLabel(student.mode_preference?.mode)}</b></span><span>Convencional <b>${conv.pct}%</b></span><span>Exclusiva <b>${xp.pct}%</b></span><span>Último registro <b>${dt(last?.occurred_at)}</b></span></div>`;card.onclick=()=>{currentStudentId=student.student_id;renderStudentDetail({supabase,student,onReload:reload,onBack:()=>{currentStudentId=null;draw();}});};list.append(card);});};
  search.oninput=draw;classFilter.onchange=draw;subjectFilter.onchange=draw;draw();
}

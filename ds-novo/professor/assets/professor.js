(()=>{
  'use strict';
  const cfg=window.AGV_TEACHER_CONFIG;
  const $=id=>document.getElementById(id);
  const state={session:null,overview:null,students:[],classes:[],selectedStudent:null,activities:[],reference:null};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tokenKey='agv:teacher-console:session';

  async function api(path,{method='GET',body,token=state.session?.access_token}={}){
    const headers={'apikey':cfg.publishableKey,'content-type':'application/json'};
    if(token)headers.Authorization=`Bearer ${token}`;
    const res=await fetch(`${cfg.supabaseUrl}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
    let data=null;try{data=await res.json()}catch(_){data={}}
    if(!res.ok){const e=new Error(data?.reason||data?.error_description||data?.message||data?.error||`HTTP ${res.status}`);e.status=res.status;e.data=data;throw e}
    return data;
  }
  async function invoke(name,body){return api(`/functions/v1/${encodeURIComponent(name)}`,{method:'POST',body})}
  function saveSession(session){state.session=session;sessionStorage.setItem(tokenKey,JSON.stringify(session))}
  function clearSession(){state.session=null;sessionStorage.removeItem(tokenKey)}
  function loadSession(){try{const x=JSON.parse(sessionStorage.getItem(tokenKey)||'null');if(x?.access_token)state.session=x}catch(_){}}
  async function signIn(email,password){const data=await api('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},token:null});saveSession(data);return data}
  async function getUser(){return api('/auth/v1/user')}

  function showApp(on){$('login-view').classList.toggle('hidden',on);$('app-view').classList.toggle('hidden',!on)}
  function setLoginMessage(text='',error=false){$('login-message').textContent=text;$('login-message').classList.toggle('error',error)}
  function roleLabel(role){return role==='super_admin'?'Super Admin':role==='admin'?'Administrador':'Professor'}
  function array(v){return Array.isArray(v)?v:[]}
  function normalizedOverview(data){
    return {
      classes:array(data.classes||data.class_list),
      memberships:array(data.memberships||data.class_memberships),
      students:array(data.students||data.profiles||data.student_profiles).filter(x=>!x.role||x.role==='student'),
      progress:array(data.progress||data.student_progress),
      exercises:array(data.exercises)
    };
  }
  function membershipsFor(id){return state.overview.memberships.filter(m=>m.user_id===id||m.student_id===id)}
  function className(id){return state.classes.find(c=>c.id===id)?.name||state.classes.find(c=>c.id===id)?.code||'Turma'}
  function studentClassIds(s){return membershipsFor(s.id).map(m=>m.class_id).filter(Boolean)}
  function renderStudents(){
    const q=$('student-search').value.trim().toLowerCase(),classId=$('class-filter').value;
    const rows=state.students.filter(s=>{
      const matches=!q||`${s.full_name||''} ${s.email||''}`.toLowerCase().includes(q);
      const inClass=classId==='all'||studentClassIds(s).includes(classId);
      return matches&&inClass;
    });
    $('student-list').innerHTML=rows.length?rows.map(s=>{
      const classes=studentClassIds(s).map(className).join(' • ');
      return `<button class="student-row ${state.selectedStudent?.id===s.id?'active':''}" data-id="${esc(s.id)}"><strong>${esc(s.full_name||s.email)}</strong><span>${esc(classes||'Sem turma')}</span></button>`
    }).join(''):'<div class="mini-empty">Nenhum aluno encontrado.</div>';
    $('student-list').querySelectorAll('.student-row').forEach(b=>b.onclick=()=>selectStudent(b.dataset.id));
  }
  function renderClasses(){
    $('class-filter').innerHTML='<option value="all">Todas as turmas</option>'+state.classes.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.code)}</option>`).join('');
  }
  function activityLabel(a){
    const platform=a.platform?.name||a.platform?.code||'Plataforma';
    return {platform,title:String(a.activity_id||'Atividade').replace(/^completion:/,'').replace(/^tool:/,'Ferramenta: ')};
  }
  function renderActivities(){
    const box=$('activity-list');$('activity-count').textContent=`${state.activities.length} atividade${state.activities.length===1?'':'s'}`;
    if(!state.activities.length){box.className='activity-list empty';box.innerHTML='<p>Nenhuma atividade central registrada para este aluno ainda.</p>';return}
    box.className='activity-list';
    box.innerHTML=state.activities.map((a,i)=>{const l=activityLabel(a);const when=a.updated_at?new Date(a.updated_at).toLocaleString('pt-BR'):'';return `<button class="activity-row" data-index="${i}"><span class="platform-name">${esc(l.platform)}</span><strong>${esc(l.title)}</strong><small>${esc(a.status||'—')} • ${Math.round(Number(a.progress||0))}%${when?` • ${esc(when)}`:''}</small></button>`}).join('');
    box.querySelectorAll('.activity-row').forEach(b=>b.onclick=()=>openReference(Number(b.dataset.index)));
  }
  async function selectStudent(id){
    const s=state.students.find(x=>x.id===id);if(!s)return;state.selectedStudent=s;state.activities=[];renderStudents();
    $('student-title').textContent=s.full_name||s.email;$('student-meta').textContent=studentClassIds(s).map(className).join(' • ');
    $('activity-list').className='activity-list empty';$('activity-list').innerHTML='<p>Carregando atividades...</p>';resetReference();
    try{const data=await invoke(cfg.teacherActivityFunction,{action:'recent',student_id:id});state.activities=array(data.activities);renderActivities()}catch(e){$('activity-list').innerHTML=`<p class="error-text">${esc(e.message)}</p>`}
  }
  function resetReference(){state.reference=null;$('reference-empty').classList.remove('hidden');$('reference-content').classList.add('hidden');$('reference-title').textContent='Gabarito explicado';$('reference-source').textContent='Protegido'}
  function renderList(el,items,empty){const vals=array(items);el.innerHTML=vals.length?vals.map(x=>`<div class="list-item">${typeof x==='string'?esc(x):`<strong>${esc(x.label||x.title||x.name||'Critério')}</strong><span>${esc(x.description||x.text||x.message||JSON.stringify(x))}</span>`}</div>`).join(''):`<span class="muted">${esc(empty)}</span>`}
  function renderSolutionFiles(files){const names=Object.keys(files||{}),section=$('files-section');if(!names.length){section.classList.add('hidden');return}section.classList.remove('hidden');const tabs=$('file-tabs'),code=$('solution-code');tabs.innerHTML=names.map((n,i)=>`<button class="file-tab ${i===0?'active':''}" data-name="${esc(n)}">${esc(n)}</button>`).join('');const activate=n=>{code.textContent=String(files[n]??'');tabs.querySelectorAll('.file-tab').forEach(b=>b.classList.toggle('active',b.dataset.name===n))};tabs.querySelectorAll('.file-tab').forEach(b=>b.onclick=()=>activate(b.dataset.name));activate(names[0])}
  async function openReference(index){
    const a=state.activities[index];if(!a||!state.selectedStudent)return;const platformCode=a.platform?.code;if(!platformCode){return}
    $('reference-empty').classList.remove('hidden');$('reference-empty').innerHTML='<strong>Carregando gabarito protegido...</strong><span>Validando seu escopo no servidor.</span>';
    try{
      const data=await invoke(cfg.teacherActivityFunction,{action:'get',student_id:state.selectedStudent.id,platform_code:platformCode,activity_id:a.activity_id});state.reference=data;
      const ref=data.teacher_reference;
      $('reference-title').textContent=ref?.title||activityLabel(a).title;
      $('reference-source').textContent=ref?({professor_bundle:'Pacote Professor',guided_data:'Professor Guiado',manual:'Professor',generated_reference:'Referência'}[ref.source_kind]||'Protegido'):'Sem gabarito importado';
      $('progress-status').textContent=`${data.progress?.status||'não iniciado'} • ${Math.round(Number(data.progress?.progress||0))}%`;
      $('progress-meta').textContent=data.progress?.updated_at?`Última atualização: ${new Date(data.progress.updated_at).toLocaleString('pt-BR')}`:'';
      $('answer-text').textContent=ref?.answer_text||'O gabarito desta atividade ainda não foi importado para o Core.';
      $('explanation').textContent=ref?.explanation||'A atividade pode ser acompanhada, mas a referência privada ainda está pendente de ingestão.';
      renderSolutionFiles(ref?.solution_payload?.files||{});renderList($('rubric'),ref?.rubric,'Rubrica ainda não cadastrada.');renderList($('tips'),ref?.intervention_tips,'Dicas de intervenção ainda não cadastradas.');
      $('reference-empty').classList.add('hidden');$('reference-content').classList.remove('hidden');
    }catch(e){$('reference-empty').innerHTML=`<strong>Não foi possível abrir</strong><span>${esc(e.message)}</span>`}
  }
  async function loadStaff(){
    const status=await invoke(cfg.staffFunction,{action:'staff_status'});$('staff-name').textContent=status.full_name||status.name||'Professor';$('staff-role').textContent=roleLabel(status.role||'teacher');
    const raw=await invoke(cfg.staffFunction,{action:'overview'});state.overview=normalizedOverview(raw);state.classes=state.overview.classes;state.students=state.overview.students;renderClasses();renderStudents();
  }
  async function boot(){
    loadSession();if(!state.session){showApp(false);return}
    try{await getUser();showApp(true);await loadStaff()}catch(_){clearSession();showApp(false)}
  }
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;setLoginMessage('Validando acesso...');try{await signIn($('email').value.trim().toLowerCase(),$('password').value);await getUser();showApp(true);await loadStaff();setLoginMessage()}catch(err){clearSession();setLoginMessage('E-mail, senha ou permissão de professor inválidos.',true)}finally{btn.disabled=false}});
  $('logout').addEventListener('click',()=>{clearSession();state.overview=null;state.students=[];state.activities=[];showApp(false)});
  $('student-search').addEventListener('input',renderStudents);$('class-filter').addEventListener('change',renderStudents);
  boot();
})();

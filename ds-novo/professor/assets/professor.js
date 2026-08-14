(()=>{
  'use strict';
  const cfg=window.AGV_TEACHER_CONFIG;
  const $=id=>document.getElementById(id);
  const state={session:null,overview:null,students:[],classes:[],selectedStudent:null,activities:[],reference:null,currentActivity:null,staffRole:'teacher'};
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
    const classes=array(data.classes||data.class_list);
    const memberships=array(data.memberships||data.class_memberships);
    const profiles=array(data.students||data.profiles||data.student_profiles).filter(x=>!x.role||x.role==='student');
    const prereg=array(data.preregistrations||data.student_preregistrations).filter(x=>x.active!==false);
    const byProfile=new Map(profiles.map(x=>[String(x.id),x]));
    const claimed=new Set();
    const students=prereg.map(q=>{
      const authId=q.claimed_user_id?String(q.claimed_user_id):null;
      const p=authId?byProfile.get(authId):null;
      if(authId)claimed.add(authId);
      return {
        ...(p||{}),
        id:authId||`prereg:${q.id}`,
        auth_user_id:authId,
        prereg_id:q.id,
        full_name:p?.full_name||q.full_name,
        email:p?.email||q.institutional_email,
        active:p?.active!==undefined?p.active:q.active,
        claimed:!!authId,
        class_id:q.class_id||null,
        enrollment_status:q.enrollment_status||null,
        last_login_at:p?.last_login_at||null,
        role:'student'
      };
    });
    for(const p of profiles){
      if(claimed.has(String(p.id)))continue;
      students.push({...p,auth_user_id:String(p.id),claimed:true});
    }
    return {classes,memberships,students,profiles,preregistrations:prereg,progress:array(data.progress||data.student_progress),exercises:array(data.exercises)};
  }
  function membershipsFor(id){return state.overview.memberships.filter(m=>String(m.user_id||m.student_id)===String(id))}
  function className(id){return state.classes.find(c=>String(c.id)===String(id))?.name||state.classes.find(c=>String(c.id)===String(id))?.code||'Turma'}
  function studentClassIds(s){const ids=[s.class_id,...membershipsFor(s.auth_user_id||s.id).map(m=>m.class_id)].filter(Boolean).map(String);return [...new Set(ids)]}
  function renderStudents(){
    const q=$('student-search').value.trim().toLowerCase(),classId=$('class-filter').value;
    const rows=state.students.filter(s=>{
      const matches=!q||`${s.full_name||''} ${s.email||''}`.toLowerCase().includes(q);
      const inClass=classId==='all'||studentClassIds(s).includes(classId);
      return matches&&inClass;
    });
    $('student-list').innerHTML=rows.length?rows.map(s=>{
      const classes=studentClassIds(s).map(className).join(' • ');
      const account=s.claimed?'Conta ativada':'Conta não ativada';
      return `<button class="student-row ${state.selectedStudent?.id===s.id?'active':''}" data-id="${esc(s.id)}"><strong>${esc(s.full_name||s.email)}</strong><span>${esc(classes||'Sem turma')} • ${esc(account)}</span></button>`
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
    const classText=studentClassIds(s).map(className).join(' • ');
    $('student-title').textContent=s.full_name||s.email;
    $('student-meta').textContent=`${classText||'Sem turma'} • ${s.claimed?'Conta ativada':'Conta ainda não ativada'}`;
    $('activity-count').textContent='0 atividades';
    resetReference();
    if(!s.auth_user_id){
      $('activity-list').className='activity-list empty';
      $('activity-list').innerHTML='<p><strong>Conta ainda não ativada.</strong><br>O aluno já aparece no roster, mas ainda não possui sessão/progresso central. Assim que fizer o primeiro acesso, as atividades aparecerão automaticamente aqui.</p>';
      return;
    }
    $('activity-list').className='activity-list empty';$('activity-list').innerHTML='<p>Carregando atividades...</p>';
    try{const data=await invoke(cfg.teacherActivityFunction,{action:'recent',student_id:s.auth_user_id});state.activities=array(data.activities);renderActivities()}catch(e){$('activity-list').innerHTML=`<p class="error-text">${esc(e.message)}</p>`}
  }
  function resetReference(){state.reference=null;state.currentActivity=null;$('reference-empty').classList.remove('hidden');$('reference-content').classList.add('hidden');$('reference-title').textContent='Gabarito explicado';$('reference-source').textContent='Protegido'}
  function renderList(el,items,empty){const vals=array(items);el.innerHTML=vals.length?vals.map(x=>`<div class="list-item">${typeof x==='string'?esc(x):`<strong>${esc(x.label||x.title||x.name||'Critério')}</strong><span>${esc(x.description||x.text||x.message||JSON.stringify(x))}</span>`}</div>`).join(''):`<span class="muted">${esc(empty)}</span>`}
  function renderSolutionFiles(files){const names=Object.keys(files||{}),section=$('files-section');if(!names.length){section.classList.add('hidden');return}section.classList.remove('hidden');const tabs=$('file-tabs'),code=$('solution-code');tabs.innerHTML=names.map((n,i)=>`<button class="file-tab ${i===0?'active':''}" data-name="${esc(n)}">${esc(n)}</button>`).join('');const activate=n=>{code.textContent=String(files[n]??'');tabs.querySelectorAll('.file-tab').forEach(b=>b.classList.toggle('active',b.dataset.name===n))};tabs.querySelectorAll('.file-tab').forEach(b=>b.onclick=()=>activate(b.dataset.name));activate(names[0])}
  async function openReference(index){
    const a=state.activities[index];if(!a||!state.selectedStudent)return;state.currentActivity=a;const platformCode=a.platform?.code;if(!platformCode){return}
    $('reference-empty').classList.remove('hidden');$('reference-empty').innerHTML='<strong>Carregando gabarito protegido...</strong><span>Validando seu escopo no servidor.</span>';
    try{
      const data=await invoke(cfg.teacherActivityFunction,{action:'get',student_id:state.selectedStudent.auth_user_id||state.selectedStudent.id,platform_code:platformCode,activity_id:a.activity_id});state.reference=data;
      const ref=data.teacher_reference;
      $('reference-title').textContent=ref?.title||activityLabel(a).title;
      $('reference-source').textContent=ref?({professor_bundle:'Pacote Professor',guided_data:'Professor Guiado',manual:'Professor',generated_reference:'Referência'}[ref.source_kind]||'Protegido'):'Sem gabarito importado';
      $('progress-status').textContent=`${data.progress?.status||'não iniciado'} • ${Math.round(Number(data.progress?.progress||0))}%`;
      $('progress-meta').textContent=data.progress?.updated_at?`Última atualização: ${new Date(data.progress.updated_at).toLocaleString('pt-BR')}`:'';
      const review=data.progress?.metadata?.review_status||'not_submitted';
      $('review-status').textContent={pending:'Aguardando validação',approved:'Aprovada',changes_requested:'Ajustes solicitados',not_submitted:'Ainda não enviada'}[review]||review;
      $('review-feedback').value=data.progress?.metadata?.teacher_feedback||'';$('review-message').textContent='';
      $('answer-text').textContent=ref?.answer_text||'O gabarito desta atividade ainda não foi importado para o Core.';
      $('explanation').textContent=ref?.explanation||'A atividade pode ser acompanhada, mas a referência privada ainda está pendente de ingestão.';
      renderSolutionFiles(ref?.solution_payload?.files||{});renderList($('rubric'),ref?.rubric,'Rubrica ainda não cadastrada.');renderList($('tips'),ref?.intervention_tips,'Dicas de intervenção ainda não cadastradas.');
      $('reference-empty').classList.add('hidden');$('reference-content').classList.remove('hidden');
    }catch(e){$('reference-empty').innerHTML=`<strong>Não foi possível abrir</strong><span>${esc(e.message)}</span>`}
  }
  async function reviewCurrent(decision){
    const a=state.currentActivity;if(!a||!state.selectedStudent)return;const pc=a.platform?.code;if(!pc)return;
    const msg=$('review-message'),buttons=[$('approve-activity'),$('request-changes')];buttons.forEach(b=>b.disabled=true);msg.textContent='Salvando validação...';msg.classList.remove('error');
    try{const out=await invoke(cfg.teacherActivityFunction,{action:'review',student_id:state.selectedStudent.auth_user_id||state.selectedStudent.id,platform_code:pc,activity_id:a.activity_id,decision,feedback:$('review-feedback').value.trim()});const r=out.progress?.metadata?.review_status||decision;$('review-status').textContent=r==='approved'?'Aprovada':'Ajustes solicitados';$('progress-status').textContent=`${out.progress?.status||'—'} • ${Math.round(Number(out.progress?.progress||0))}%`;msg.textContent=decision==='approved'?'Atividade aprovada e registrada.':'A atividade voltou para o aluno com solicitação de ajustes.';await selectStudent(state.selectedStudent.id)}catch(e){msg.textContent=e.message;msg.classList.add('error')}finally{buttons.forEach(b=>b.disabled=false)}
  }
  async function loadStaff(){
    const status=await invoke(cfg.staffFunction,{action:'staff_status'});state.staffRole=status.role||'teacher';$('staff-name').textContent=status.full_name||status.name||'Professor';$('staff-role').textContent=roleLabel(state.staffRole);
    const canImport=['admin','super_admin'].includes(state.staffRole);$('teacher-import-toggle')?.classList.toggle('hidden',!canImport);if(!canImport)$('teacher-import-panel')?.classList.add('hidden');
    const raw=await invoke(cfg.staffFunction,{action:'overview'});state.overview=normalizedOverview(raw);state.classes=state.overview.classes;state.students=state.overview.students;renderClasses();renderStudents();
    const requestedStudent=new URLSearchParams(location.search).get('student');
    if(requestedStudent){const target=state.students.find(s=>String(s.id)===requestedStudent||String(s.auth_user_id||'')===requestedStudent);if(target)await selectStudent(target.id)}
  }
  async function importTeacherReferences(){
    if(!['admin','super_admin'].includes(state.staffRole))return;const file=$('teacher-import-file')?.files?.[0],msg=$('teacher-import-message');if(!file){msg.textContent='Selecione o arquivo JSON privado.';msg.classList.add('error');return}
    let refs;try{refs=JSON.parse(await file.text())}catch(_){msg.textContent='JSON inválido.';msg.classList.add('error');return}if(!Array.isArray(refs)||!refs.length){msg.textContent='O arquivo não contém referências válidas.';msg.classList.add('error');return}
    const btn=$('teacher-import-run');btn.disabled=true;msg.classList.remove('error');let imported=0;try{for(let i=0;i<refs.length;i+=4){msg.textContent=`Importando ${Math.min(i+4,refs.length)} de ${refs.length}...`;const out=await invoke(cfg.teacherActivityFunction,{action:'import_references',references:refs.slice(i,i+4)});imported+=Number(out.imported||0)}msg.textContent=`Importação concluída: ${imported} referência(s) protegida(s).`;if(state.currentActivity)await openReference(state.activities.indexOf(state.currentActivity))}catch(e){msg.textContent=`Importação interrompida após ${imported}: ${e.message}`;msg.classList.add('error')}finally{btn.disabled=false}
  }
  async function boot(){
    loadSession();if(!state.session){showApp(false);return}
    try{await getUser();showApp(true);await loadStaff()}catch(_){clearSession();showApp(false)}
  }
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;setLoginMessage('Validando acesso...');try{await signIn($('email').value.trim().toLowerCase(),$('password').value);await getUser();showApp(true);await loadStaff();setLoginMessage()}catch(err){clearSession();setLoginMessage('E-mail, senha ou permissão de professor inválidos.',true)}finally{btn.disabled=false}});
  $('logout').addEventListener('click',()=>{clearSession();state.overview=null;state.students=[];state.activities=[];showApp(false)});
  $('student-search').addEventListener('input',renderStudents);$('class-filter').addEventListener('change',renderStudents);$('approve-activity').addEventListener('click',()=>reviewCurrent('approved'));$('request-changes').addEventListener('click',()=>reviewCurrent('changes_requested'));$('teacher-import-toggle')?.addEventListener('click',()=>$('teacher-import-panel')?.classList.toggle('hidden'));$('teacher-import-run')?.addEventListener('click',importTeacherReferences);
  boot();
})();

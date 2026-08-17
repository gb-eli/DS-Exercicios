(()=>{
  'use strict';
  const cfg=window.AGV_TEACHER_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const state={session:null,overview:null,students:[],classes:[],classSubjects:[],releases:[],lobbyPresence:[],selectedStudent:null,activities:[],reference:null,currentActivity:null,staffRole:'teacher',liveTimer:null,staffLoading:false,guided:{file:null,step:0,steps:[],playTimer:null,typeTimer:null,playing:false}};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function api(path,{method='GET',body,token}={}){
    const data=token===null?await auth.rawRequest(path,{method,body,token:null}):await auth.request(path,{method,body});
    state.session=auth.session;return data;
  }
  async function invoke(name,body){try{return await api(`/functions/v1/${encodeURIComponent(name)}`,{method:'POST',body})}catch(e){if(e?.status===403&&/password_change_required/i.test(String(e?.message||e?.payload?.error||''))){location.href='../atividades/';}throw e;}}
  async function security(action='session.check',payload={}){try{return await invoke('security-telemetry',{action,payload})}catch(_){return null}}
  function saveSession(session){state.session=auth.save(session)}
  function clearSession(){state.session=null;auth.clear()}
  function loadSession(){state.session=auth.read()}
  async function signIn(email,password){const data=await auth.signIn(email,password);saveSession(data);return data}
  async function getUser(){const user=await auth.getUser();state.session=auth.session;return user}
  const toLocalInput=v=>{if(!v)return'';const d=new Date(v),z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,16)};
  const fromLocalInput=v=>v?new Date(v).toISOString():null;
  function releaseFor(exerciseId,classId,studentId=null){
    return state.releases.find(x=>String(x.exercise_id)===String(exerciseId)&&String(x.class_id||'')===String(classId||'')&&(studentId?String(x.student_id||'')===String(studentId):!x.student_id))||null
  }
  function releaseScope(){return $('scope-student')?.classList.contains('active')?'student':$('scope-group')?.classList.contains('active')?'group':'class'}
  function selectedReleaseStudent(){return releaseScope()==='student'?($('release-student')?.value||null):null}
  function selectedReleaseGroup(){return releaseScope()==='group'?[...document.querySelectorAll('#release-group-list input:checked')].map(x=>x.value):[]}
  function exercisesForReleaseClass(classId){const subs=new Set(state.classSubjects.filter(x=>String(x.class_id)===String(classId)&&x.active!==false).map(x=>String(x.subject_id)));return array(state.overview?.exercises).filter(e=>String(e.class_id||'')===String(classId)||(!e.class_id&&subs.has(String(e.subject_id)))).sort((a,b)=>(a.exercise_number||0)-(b.exercise_number||0))}
  async function loadReleaseData(){try{const [cs,rl]=await Promise.all([api('/rest/v1/class_subjects?select=class_id,subject_id,active&active=eq.true'),api('/rest/v1/exercise_releases?select=*&order=updated_at.desc')]);state.classSubjects=array(cs);state.releases=array(rl)}catch(_){state.classSubjects=[];state.releases=[]}}
  function studentsForReleaseClass(classId){return state.students.filter(s=>s.claimed&&studentClassIds(s).includes(String(classId))).sort((a,b)=>String(a.full_name||'').localeCompare(String(b.full_name||''),'pt-BR'))}
  function renderReleaseStudents(){const sel=$('release-student');if(!sel)return;const cid=$('release-class').value,current=sel.value,rows=studentsForReleaseClass(cid);sel.innerHTML=rows.length?rows.map(s=>`<option value="${esc(studentAuthId(s))}">${esc(s.full_name||s.email||'Aluno')}</option>`).join(''):'<option value="">Nenhum aluno vinculado</option>';if(rows.some(s=>studentAuthId(s)===current))sel.value=current}
  function renderReleaseGroup(){const box=$('release-group-list');if(!box)return;const rows=studentsForReleaseClass($('release-class').value);box.innerHTML=rows.length?rows.map(s=>`<label><input type="checkbox" value="${esc(studentAuthId(s))}"><span>${esc(s.full_name||s.email||'Aluno')}</span></label>`).join(''):'<div class="mini-empty">Nenhum aluno vinculado.</div>'}
  function setReleaseScope(scope){const student=scope==='student',group=scope==='group';$('scope-class')?.classList.toggle('active',scope==='class');$('scope-group')?.classList.toggle('active',group);$('scope-student')?.classList.toggle('active',student);$('release-student-wrap')?.classList.toggle('hidden',!student);$('release-group-wrap')?.classList.toggle('hidden',!group);renderReleaseStudents();renderReleaseGroup();fillReleaseForm()}
  function renderReleaseClasses(){const sel=$('release-class');sel.innerHTML=state.classes.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.code)}</option>`).join('');renderReleaseStudents();renderReleaseGroup();renderReleaseExercises()}
  function renderReleaseExercises(){const cid=$('release-class').value,items=exercisesForReleaseClass(cid),sel=$('release-exercise'),current=sel.value;sel.innerHTML=items.map(e=>`<option value="${esc(e.id)}">${String(e.exercise_number||'').padStart(2,'0')} — ${esc(e.title)}</option>`).join('');if(items.some(e=>String(e.id)===current))sel.value=current;fillReleaseForm()}
  function effectiveReleaseForStudent(exerciseId,classId,studentId){return releaseFor(exerciseId,classId,studentId)||releaseFor(exerciseId,classId,null)}
  function releaseStatus(r,exercise){const now=Date.now();if(!r)return exercise?.default_locked?{key:'blocked',label:'Bloqueada'}:{key:'open',label:'Liberada por padrão'};if(r.enabled===false)return{key:'blocked',label:'Bloqueada'};if(r.release_at&&Date.parse(r.release_at)>now)return{key:'scheduled',label:'Programada'};if(r.lock_at&&Date.parse(r.lock_at)<=now)return{key:'blocked',label:'Encerrada'};return{key:'open',label:'Liberada'}}
  function progressForStudentExercise(studentId,exerciseId){return array(state.overview?.progress).filter(p=>String(p.student_id||p.user_id||'')===String(studentId)&&String(p.exercise_id||'')===String(exerciseId)).sort((a,b)=>timeValue(b.updated_at)-timeValue(a.updated_at))[0]||null}
  function renderReleaseRoster(){const list=$('release-roster-list');if(!list)return;const cid=$('release-class')?.value,eid=$('release-exercise')?.value,exercise=array(state.overview?.exercises).find(e=>String(e.id)===String(eid)),rows=cid&&eid?studentsForReleaseClass(cid):[];const counts={open:0,scheduled:0,blocked:0,completed:0};if(!rows.length){list.innerHTML='<div class="mini-empty">Nenhum aluno vinculado à turma selecionada.</div>';['open','scheduled','blocked','completed'].forEach(k=>{const e=$(`release-roster-${k}`);if(e)e.textContent='0'});return}list.innerHTML=rows.map(s=>{const sid=studentAuthId(s),pr=progressForStudentExercise(sid,eid),done=String(pr?.status||'').toLowerCase()==='completed'||Number(pr?.progress_percent||pr?.progress||0)>=100,individual=releaseFor(eid,cid,sid),r=individual||releaseFor(eid,cid,null),st=done?{key:'completed',label:'Concluída'}:releaseStatus(r,exercise);counts[st.key]=(counts[st.key]||0)+1;const pct=Math.max(0,Math.min(100,Math.round(Number(pr?.progress_percent??pr?.progress??0)||0))),origin=individual?'Exceção individual':r?'Regra da turma':exercise?.default_locked?'Padrão bloqueado':'Padrão aberto';return `<button class="release-roster-row ${esc(st.key)}" type="button" data-release-student="${esc(sid)}"><span class="release-dot"></span><span class="release-person"><strong>${esc(s.full_name||s.email||'Aluno')}</strong><small>${esc(origin)}</small></span><span class="release-progress">${pct}%</span><span class="release-badge">${esc(st.label)}</span></button>`}).join('');for(const [k,v] of Object.entries(counts)){const e=$(`release-roster-${k}`);if(e)e.textContent=String(v)}list.querySelectorAll('[data-release-student]').forEach(btn=>btn.addEventListener('click',()=>{setReleaseScope('student');$('release-student').value=btn.dataset.releaseStudent;fillReleaseForm();$('release-student')?.focus()}))}
  function fillReleaseForm(){const cid=$('release-class').value,eid=$('release-exercise').value,sid=selectedReleaseStudent(),r=releaseFor(eid,cid,sid);$('release-enabled').checked=r?r.enabled!==false:true;$('release-at').value=toLocalInput(r?.release_at);$('lock-at').value=toLocalInput(r?.lock_at);$('release-html').checked=!!r?.allow_html_base;$('release-css').checked=!!r?.allow_css_base;$('release-js').checked=!!r?.allow_js_base;$('release-hints').checked=!!r?.allow_extra_hints;$('release-guided').checked=!!r?.allow_guided_support;const st=releaseStatus(r,array(state.overview?.exercises).find(e=>String(e.id)===String(eid)));$('release-state').textContent=`${sid?'Aluno':'Turma'} • ${st.label}`;renderReleaseRoster()}
  async function persistTeacherReleaseOne({enabled,releaseAt,lockAt,studentId=null}={}){const msg=$('release-message'),cid=$('release-class').value,eid=$('release-exercise').value,sid=studentId??selectedReleaseStudent();if(!cid||!eid||(releaseScope()==='student'&&!sid)){msg.textContent='Selecione turma, atividade e aluno quando necessário.';msg.classList.add('error');return false}const ra=releaseAt!==undefined?releaseAt:$('release-at').value,la=lockAt!==undefined?lockAt:$('lock-at').value;if(ra&&la&&new Date(la)<=new Date(ra)){msg.textContent='O encerramento precisa ser posterior à abertura.';msg.classList.add('error');return false}const body={exercise_id:eid,class_id:cid,student_id:sid,enabled:enabled!==undefined?enabled:$('release-enabled').checked,release_at:fromLocalInput(ra),lock_at:fromLocalInput(la),allow_html_base:$('release-html').checked,allow_css_base:$('release-css').checked,allow_js_base:$('release-js').checked,allow_extra_hints:$('release-hints').checked,allow_guided_support:$('release-guided').checked,created_by:state.session?.user?.id||null,updated_at:new Date().toISOString()},old=releaseFor(eid,cid,sid);try{msg.classList.remove('error');msg.textContent='Salvando…';if(old?.id)await api(`/rest/v1/exercise_releases?id=eq.${encodeURIComponent(old.id)}`,{method:'PATCH',body});else await api('/rest/v1/exercise_releases',{method:'POST',body});await loadReleaseData();fillReleaseForm();msg.textContent=sid?'Exceção individual salva.':'Liberação da turma salva.';return true}catch(e){msg.textContent=e.message;msg.classList.add('error');return false}}
  async function persistTeacherRelease(opts={}){if(releaseScope()!=='group')return persistTeacherReleaseOne(opts);const ids=selectedReleaseGroup(),msg=$('release-message');if(!ids.length){msg.textContent='Selecione pelo menos um aluno.';msg.classList.add('error');return false}let done=0;for(const sid of ids){await persistTeacherReleaseOne({...opts,studentId:sid});done++;msg.textContent=`Aplicando ao grupo… ${done}/${ids.length}`;}await loadReleaseData();renderReleaseRoster();msg.textContent=`Configuração aplicada a ${done} aluno(s).`;return true}
  async function saveTeacherRelease(){await persistTeacherRelease()}
  async function releaseNow(){const now=new Date(),local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);$('release-enabled').checked=true;$('release-at').value=local;$('lock-at').value='';await persistTeacherRelease({enabled:true,releaseAt:local,lockAt:''})}
  async function blockNow(){$('release-enabled').checked=false;$('release-at').value='';$('lock-at').value='';await persistTeacherRelease({enabled:false,releaseAt:'',lockAt:''})}
  function clearReleaseSchedule(){$('release-at').value='';$('lock-at').value='';$('release-message').classList.remove('error');$('release-message').textContent='Horários removidos do formulário. Clique em Salvar configuração para confirmar.'}


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
    return {classes,memberships,students,profiles,preregistrations:prereg,progress:array(data.progress||data.student_progress),exercises:array(data.exercises),sessions:array(data.sessions||data.activity_sessions),security:array(data.security_events||data.events)};
  }
  function membershipsFor(id){return state.overview.memberships.filter(m=>String(m.user_id||m.student_id)===String(id))}
  function className(id){return state.classes.find(c=>String(c.id)===String(id))?.name||state.classes.find(c=>String(c.id)===String(id))?.code||'Turma'}
  function studentClassIds(s){const ids=[s.class_id,...membershipsFor(s.auth_user_id||s.id).map(m=>m.class_id)].filter(Boolean).map(String);return [...new Set(ids)]}
  function studentAuthId(s){return String(s?.auth_user_id||s?.id||'')}
  function timeValue(v){const n=Date.parse(v||'');return Number.isFinite(n)?n:0}
  function latestByStudent(rows,s){const id=studentAuthId(s);return array(rows).filter(r=>String(r.student_id||r.user_id||r.auth_user_id||'')===id).sort((a,b)=>timeValue(b.updated_at||b.last_seen_at||b.heartbeat_at||b.created_at)-timeValue(a.updated_at||a.last_seen_at||a.heartbeat_at||a.created_at))[0]||null}
  function latestProgress(s){return latestByStudent(state.overview?.progress,s)}
  function latestSession(s){return latestByStudent(state.overview?.sessions,s)}
  function exerciseTitle(id){const e=array(state.overview?.exercises).find(x=>String(x.id)===String(id));return e?`${String(e.exercise_number||'').padStart(2,'0')} — ${e.title||'Atividade'}`:'Atividade recente'}
  async function loadLobbyPresence(){try{const cutoff=new Date(Date.now()-25000).toISOString();const rows=await api(`/rest/v1/lobby_presence?select=student_id,display_name,participant_role,area,updated_at&updated_at=gt.${encodeURIComponent(cutoff)}`);state.lobbyPresence=array(rows)}catch(_){state.lobbyPresence=[]}}
  function lobbyInfo(s){const id=studentAuthId(s),row=state.lobbyPresence.find(x=>String(x.student_id)===String(id));if(!row)return null;const labels={central:'Praça Central','1ds':'Lobby 1DS','2ds':'Lobby 2DS','3ds':'Lobby 3DS',sub:'Lobby SUB'};return{area:row.area,label:labels[row.area]||'Lobby',updated_at:row.updated_at}}
  function liveInfo(s){
    const progress=latestProgress(s),session=latestSession(s),lobby=lobbyInfo(s),stamp=Math.max(timeValue(session?.heartbeat_at||session?.last_seen_at||session?.updated_at),timeValue(lobby?.updated_at)),online=stamp>0&&Date.now()-stamp<90000;
    const status=String(progress?.status||session?.status||'').toLowerCase(),working=online||['in_progress','active','started'].includes(status);
    const percent=Math.max(0,Math.min(100,Math.round(Number(progress?.progress_percent??progress?.progress??0)||0))),exerciseId=progress?.exercise_id||session?.exercise_id||null;
    const review=progress?.metadata?.review_status||progress?.review_status||'',attention=!s.claimed||s.active===false||progress?.security_locked===true||status==='blocked'||review==='changes_requested';
    const last=timeValue(progress?.updated_at||session?.heartbeat_at||session?.updated_at||s.last_login_at);
    return {progress,session,lobby,online,working,percent,exerciseId,attention,last,status};
  }
  function renderLiveClasses(){const sel=$('live-class');if(!sel)return;const current=sel.value||'all';sel.innerHTML='<option value="all">Todas</option>'+state.classes.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.code)}</option>`).join('');if([...sel.options].some(o=>o.value===current))sel.value=current}
  function renderLive(){
    const box=$('live-list');if(!box)return;const classId=$('live-class')?.value||'all';const rows=state.students.filter(s=>classId==='all'||studentClassIds(s).includes(classId)).map(s=>({s,info:liveInfo(s)}));
    rows.sort((a,b)=>Number(b.info.online)-Number(a.info.online)||Number(b.info.working)-Number(a.info.working)||Number(b.info.attention)-Number(a.info.attention)||(a.s.full_name||'').localeCompare(b.s.full_name||''));
    $('live-total').textContent=String(rows.length);$('live-online').textContent=String(rows.filter(x=>x.info.online).length);$('live-working').textContent=String(rows.filter(x=>x.info.working).length);$('live-attention').textContent=String(rows.filter(x=>x.info.attention).length);
    box.innerHTML=rows.length?rows.map(({s,info})=>{const where=info.lobby?info.lobby.label:(info.exerciseId?'Atividade':'Offline'),status=info.lobby?'No Lobby':info.online?'Ativo agora':info.working?'Em atividade':'Sem atividade recente',statusClass=info.online?'online':info.attention?'attention':'idle',classes=studentClassIds(s).map(className).join(' • '),when=info.last?new Date(info.last).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—';return `<button class="live-row ${statusClass}" data-live-student="${esc(s.id)}"><span class="presence-dot" aria-hidden="true"></span><span class="live-person"><strong>${esc(s.full_name||s.email)}</strong><small>${esc(classes||'Sem turma')} • ${esc(status)} • ${esc(where)}</small></span><span class="live-activity"><strong>${esc(info.exerciseId?exerciseTitle(info.exerciseId):(info.lobby?info.lobby.label:(s.claimed?'Sem exercício recente':'Conta não ativada')))}</strong><small>${info.percent}% • última atividade ${esc(when)}</small></span><span class="live-progress"><i style="--p:${info.percent}%"></i><b>${info.percent}%</b></span>${info.attention?'<span class="live-alert">Atenção</span>':''}</button>`}).join(''):'<div class="mini-empty">Nenhum aluno nesta turma.</div>';
    box.querySelectorAll('[data-live-student]').forEach(b=>b.onclick=()=>{const id=b.dataset.liveStudent;const target=state.students.find(s=>String(s.id)===String(id));if(!target)return;const classes=studentClassIds(target);if(classes[0])$('class-filter').value=classes[0];selectStudent(target.id);document.querySelector('.workspace')?.scrollIntoView({behavior:'smooth',block:'start'});});
  }
  async function refreshTeacherOverview({silent=false}={}){
    if(state.staffLoading)return;state.staffLoading=true;const btn=$('live-refresh');if(btn&&!silent){btn.disabled=true;btn.textContent='Atualizando…'}
    try{const [raw]=await Promise.all([invoke(cfg.staffFunction,{action:'overview'}),loadLobbyPresence()]);const previous=state.selectedStudent?.id;state.overview=normalizedOverview(raw);state.classes=state.overview.classes;state.students=state.overview.students;renderClasses();renderLiveClasses();renderStudents();renderLive();renderReleaseStudents();renderReleaseRoster();if(previous){state.selectedStudent=state.students.find(s=>String(s.id)===String(previous))||state.selectedStudent}}
    catch(e){if(!silent&&boxSafe('live-list'))$('live-list').innerHTML=`<div class="mini-empty error-text">${esc(e.message)}</div>`}
    finally{state.staffLoading=false;if(btn&&!silent){btn.disabled=false;btn.textContent='Atualizar'}}
  }
  function boxSafe(id){return !!$(id)}
  function startLiveRefresh(){clearInterval(state.liveTimer);state.liveTimer=setInterval(()=>{if(!document.hidden&&$('app-view')&&!$('app-view').classList.contains('hidden'))refreshTeacherOverview({silent:true}).catch(()=>{})},15000)}
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
    const current=$('class-filter').value||'all';$('class-filter').innerHTML='<option value="all">Todas as turmas</option>'+state.classes.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.code)}</option>`).join('');if([...$('class-filter').options].some(o=>o.value===current))$('class-filter').value=current;renderLiveClasses();
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
  function resetReference(){state.reference=null;state.currentActivity=null;$('reference-empty').classList.remove('hidden');$('reference-content').classList.add('hidden');$('reference-title').textContent='Gabarito explicado';$('reference-source').textContent='Protegido';$('guided-open')?.classList.add('hidden');closeGuided()}
  function renderList(el,items,empty){const vals=array(items);el.innerHTML=vals.length?vals.map(x=>`<div class="list-item">${typeof x==='string'?esc(x):`<strong>${esc(x.label||x.title||x.name||'Critério')}</strong><span>${esc(x.description||x.text||x.message||JSON.stringify(x))}</span>`}</div>`).join(''):`<span class="muted">${esc(empty)}</span>`}
  function renderSolutionFiles(files){const names=Object.keys(files||{}),section=$('files-section');if(!names.length){section.classList.add('hidden');return}section.classList.remove('hidden');const tabs=$('file-tabs'),code=$('solution-code');tabs.innerHTML=names.map((n,i)=>`<button class="file-tab ${i===0?'active':''}" data-name="${esc(n)}">${esc(n)}</button>`).join('');const activate=n=>{code.textContent=String(files[n]??'');tabs.querySelectorAll('.file-tab').forEach(b=>b.classList.toggle('active',b.dataset.name===n))};tabs.querySelectorAll('.file-tab').forEach(b=>b.onclick=()=>activate(b.dataset.name));activate(names[0])}
  function solutionFiles(){return state.reference?.teacher_reference?.solution_payload?.files||{}}
  function chunkCode(text){const lines=String(text||'').replace(/\r/g,'').split('\n'),steps=[];let chunk=[];const flush=()=>{if(chunk.some(x=>x.trim()))steps.push(chunk.join('\n'));chunk=[]};for(const line of lines){chunk.push(line);if(!line.trim()||chunk.length>=9)flush()}flush();return steps.length?steps:['// Sem código preenchido nesta referência.']}
  function stepHints(code,file){
    const lower=code.toLowerCase(),hints=[];const ext=(String(file).split('.').pop()||'').toLowerCase();
    if(ext==='html'||lower.includes('<')){if(/<form|<input|<label/.test(lower))hints.push('Estrutura de formulário: relacione label, name, tipos de input e validação.');if(/<section|<article|<main|<header|<nav/.test(lower))hints.push('Semântica HTML: explique por que o elemento representa essa região do documento.');if(/class=|id=/.test(lower))hints.push('Seletores e identificação: mostre como class/id conectam HTML, CSS e JavaScript.');}
    if(ext==='css'||/[.#][\w-]+\s*\{/.test(code)){if(/display\s*:\s*(grid|flex)/.test(lower))hints.push('Layout: destaque eixo, alinhamento, gap e comportamento responsivo.');if(/@media/.test(lower))hints.push('Responsividade: explique qual condição muda o layout e por quê.');if(/var\(--/.test(lower))hints.push('Variáveis CSS: mostre como centralizam valores reutilizáveis.');}
    if(['js','mjs'].includes(ext)||/\b(const|let|function|=>)\b/.test(code)){if(/addEventListener/.test(code))hints.push('Evento: identifique quem escuta, qual evento dispara e qual função responde.');if(/\b(if|else|switch)\b/.test(code))hints.push('Decisão: mostre a condição e os caminhos possíveis.');if(/\b(function|=>)\b/.test(code))hints.push('Função: destaque entrada, processamento, retorno e onde ela é chamada.');}
    if(ext==='py'||/\b(def|print|input|elif)\b/.test(code)){if(/\bdef\s+/.test(code))hints.push('Função Python: destaque parâmetros, bloco indentado e valor retornado.');if(/\b(if|elif|else)\b/.test(code))hints.push('Condição: percorra cada ramo e dê um exemplo concreto de entrada.');if(/\b(for|while)\b/.test(code))hints.push('Repetição: explique condição/iterável e quando o laço termina.');}
    if(!hints.length)hints.push('Leia este bloco da esquerda para a direita e relacione cada linha ao efeito produzido no exercício.');return hints;
  }
  function guidedExplanation(step){const ref=state.reference?.teacher_reference||{},base=String(ref.explanation||'').trim(),code=state.guided.steps[step]||'',hints=stepHints(code,state.guided.file);const summary=base?base.split(/(?<=[.!?])\s+/).slice(0,3).join(' '):'Use esta etapa para relacionar a sintaxe ao resultado visível ou ao comportamento esperado.';$('guided-explanation').textContent=`Etapa ${step+1} de ${state.guided.steps.length}. ${summary}`;$('guided-keypoints').innerHTML=hints.map(h=>`<div class="guided-point">${esc(h)}</div>`).join('')}
  function stopGuidedTimers(){clearTimeout(state.guided.playTimer);clearInterval(state.guided.typeTimer);state.guided.playTimer=null;state.guided.typeTimer=null}
  function typeGuided(text){stopGuidedTimers();const out=$('guided-code'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){out.textContent=text;return Promise.resolve()}out.textContent='';let i=0;return new Promise(resolve=>{state.guided.typeTimer=setInterval(()=>{i=Math.min(text.length,i+Math.max(2,Math.ceil(text.length/180)));out.textContent=text.slice(0,i);out.scrollTop=out.scrollHeight;if(i>=text.length){clearInterval(state.guided.typeTimer);state.guided.typeTimer=null;resolve()}},16)})}
  async function renderGuidedStep({instant=false}={}){const total=state.guided.steps.length;if(!total)return;state.guided.step=Math.max(0,Math.min(total-1,state.guided.step));const cumulative=state.guided.steps.slice(0,state.guided.step+1).join('\n\n');$('guided-step').textContent=`Etapa ${state.guided.step+1}/${total}`;$('guided-prev').disabled=state.guided.step===0;$('guided-next').disabled=state.guided.step===total-1;guidedExplanation(state.guided.step);if(instant||matchMedia('(prefers-reduced-motion: reduce)').matches)$('guided-code').textContent=cumulative;else await typeGuided(cumulative)}
  function loadGuidedFile(name,open=false){const files=solutionFiles();if(!files[name])return;state.guided.file=name;state.guided.steps=chunkCode(files[name]);state.guided.step=0;$('guided-file').value=name;if(open)$('guided-modal').classList.remove('hidden');$('guided-title').textContent=state.reference?.teacher_reference?.title||'Aula guiada';$('guided-subtitle').textContent=`${name} • código privado do professor`;renderGuidedStep().catch(()=>{})}
  function openGuided(){const files=solutionFiles(),names=Object.keys(files);if(!names.length)return;$('guided-file').innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');loadGuidedFile(names[0],true)}
  function closeGuided(){stopGuidedTimers();state.guided.playing=false;$('guided-play').textContent='▶ Reproduzir';$('guided-modal').classList.add('hidden')}
  async function guidedNext(){if(state.guided.step<state.guided.steps.length-1){state.guided.step++;await renderGuidedStep()}}
  async function guidedPrev(){if(state.guided.step>0){state.guided.step--;await renderGuidedStep({instant:true})}}
  async function toggleGuidedPlay(){state.guided.playing=!state.guided.playing;$('guided-play').textContent=state.guided.playing?'⏸ Pausar':'▶ Reproduzir';stopGuidedTimers();if(!state.guided.playing)return;const run=async()=>{if(!state.guided.playing)return;if(state.guided.step>=state.guided.steps.length-1){state.guided.playing=false;$('guided-play').textContent='▶ Reproduzir';return}state.guided.step++;await renderGuidedStep();if(state.guided.playing)state.guided.playTimer=setTimeout(run,1800)};state.guided.playTimer=setTimeout(run,900)}
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
      renderSolutionFiles(ref?.solution_payload?.files||{});$('guided-open')?.classList.toggle('hidden',!Object.keys(ref?.solution_payload?.files||{}).length);renderList($('rubric'),ref?.rubric,'Rubrica ainda não cadastrada.');renderList($('tips'),ref?.intervention_tips,'Dicas de intervenção ainda não cadastradas.');
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
    const raw=await invoke(cfg.staffFunction,{action:'overview'});state.overview=normalizedOverview(raw);state.classes=state.overview.classes;state.students=state.overview.students;await loadReleaseData();renderClasses();renderStudents();renderLive();renderReleaseClasses();startLiveRefresh();
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
    try{await getUser();security('auth.session_restored',{source:'professor'});showApp(true);await loadStaff()}catch(err){if(err?.status===401)clearSession();showApp(false);setLoginMessage(err?.status===401?'Sua sessão expirou. Entre novamente.':'Sua sessão está ativa, mas este perfil não possui acesso ao Console Professor.',true)}
  }
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;setLoginMessage('Validando acesso...');try{await signIn($('email').value.trim().toLowerCase(),$('password').value);await getUser();security('auth.login_success',{source:'professor'});showApp(true);await loadStaff();setLoginMessage()}catch(err){if(err?.status===401)clearSession();showApp(false);setLoginMessage(err?.status===401?'E-mail ou senha inválidos.':'Sessão válida, mas sem permissão de professor.',true)}finally{btn.disabled=false}});
  $('logout').addEventListener('click',async()=>{clearInterval(state.liveTimer);closeGuided();await auth.signOut();state.session=null;state.overview=null;state.students=[];state.activities=[];showApp(false)});
  $('open-hub')?.addEventListener('click',()=>{location.href='../';});$('open-lobby')?.addEventListener('click',()=>{location.href='../lobby/';});
  $('live-class')?.addEventListener('change',renderLive);$('live-refresh')?.addEventListener('click',()=>refreshTeacherOverview());$('guided-open')?.addEventListener('click',openGuided);$('guided-close')?.addEventListener('click',closeGuided);$('guided-file')?.addEventListener('change',e=>loadGuidedFile(e.target.value));$('guided-prev')?.addEventListener('click',guidedPrev);$('guided-next')?.addEventListener('click',guidedNext);$('guided-play')?.addEventListener('click',toggleGuidedPlay);
  $('student-search').addEventListener('input',renderStudents);$('class-filter').addEventListener('change',renderStudents);$('approve-activity').addEventListener('click',()=>reviewCurrent('approved'));$('request-changes').addEventListener('click',()=>reviewCurrent('changes_requested'));$('teacher-release-toggle')?.addEventListener('click',()=>$('teacher-release-panel')?.classList.toggle('hidden'));$('scope-class')?.addEventListener('click',()=>setReleaseScope('class'));$('scope-group')?.addEventListener('click',()=>setReleaseScope('group'));$('scope-student')?.addEventListener('click',()=>setReleaseScope('student'));$('release-group-all')?.addEventListener('click',()=>document.querySelectorAll('#release-group-list input').forEach(x=>x.checked=true));$('release-group-none')?.addEventListener('click',()=>document.querySelectorAll('#release-group-list input').forEach(x=>x.checked=false));$('release-class')?.addEventListener('change',()=>{renderReleaseStudents();renderReleaseExercises()});$('release-student')?.addEventListener('change',fillReleaseForm);$('release-exercise')?.addEventListener('change',fillReleaseForm);$('release-save')?.addEventListener('click',saveTeacherRelease);$('release-now')?.addEventListener('click',releaseNow);$('release-block-now')?.addEventListener('click',blockNow);$('release-clear-schedule')?.addEventListener('click',clearReleaseSchedule);$('teacher-import-toggle')?.addEventListener('click',()=>$('teacher-import-panel')?.classList.toggle('hidden'));$('teacher-import-run')?.addEventListener('click',importTeacherReferences);
  boot();
})();

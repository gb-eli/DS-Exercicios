(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const st={profile:null,data:null,sessionId:null,poll:null,busy:false,createClass:null};
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const fmtDate=v=>v?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'—';
  const fmtLocal=v=>{if(!v)return'';const d=new Date(v),z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`};
  const fmtScore=v=>Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:2});
  const fmtTime=sec=>{sec=Math.max(0,Math.floor(Number(sec)||0));const m=Math.floor(sec/60),s=sec%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
  const statusInfo=s=>({draft:['Rascunho',''],waiting_room:['Pré-lobby','live'],locked:['Equipes bloqueadas','warn'],running:['Em andamento','live'],paused:['Pausada','warn'],finished:['Finalizada',''],grading:['Em correção',''],score_scheduled:['Nota programada','warn'],published:['Nota publicada','good'],cancelled:['Cancelada','danger']}[s]||[s||'—','']);
  const setConnection=(t,k='')=>{const e=$('connection-pill');if(e){e.textContent=t;e.className=`pill ${k}`.trim();}};
  const msg=(t='',err=false)=>{const e=$('login-message');if(e){e.textContent=t;e.classList.toggle('error',err)}};

  async function loadProfile(){
    const u=await auth.getUser();
    const rows=await auth.request(`/rest/v1/profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${encodeURIComponent(u.id)}&limit=1`);
    const p=Array.isArray(rows)?rows[0]:null;
    if(!p?.active||!['teacher','admin','super_admin'].includes(p.role))throw new Error('Acesso restrito à equipe.');
    if(p.must_change_password){location.replace('../atividades/');return null;}
    st.profile=p;return p;
  }
  function className(id){return st.data?.classes?.find(c=>String(c.id)===String(id))?.name||'Turma';}
  function roleName(id){return st.data?.detail?.roles?.find(r=>String(r.id)===String(id))?.name||'Sem área';}
  function clanName(id){return st.data?.detail?.clans?.find(c=>String(c.id)===String(id))?.name||'Sem empresa';}
  function studentName(id){return st.data?.detail?.roster?.find(p=>String(p.id)===String(id))?.full_name||st.data?.detail?.members?.find(m=>String(m.student_id)===String(id))?.student?.full_name||'Aluno';}
  function answerText(sub){
    const c=st.data?.detail?.challenges?.find(x=>String(x.id)===String(sub.challenge_id));
    if(!c)return JSON.stringify(sub.answer||{});
    const pc=c.public_config||{},a=sub.answer||{};
    if(c.challenge_type==='quiz_single'){const choice=String(a.choice||'');return pc.options?.find(o=>String(o.id)===choice)?.label||choice||'—';}
    if(c.challenge_type==='quiz_multi')return (a.choices||[]).map(x=>pc.options?.find(o=>String(o.id)===String(x))?.label||x).join('\n• ')||'—';
    if(['drag_match','drag_classify'].includes(c.challenge_type)){const im=new Map((pc.items||[]).map(x=>[String(x.id),x.label])),tm=new Map((pc.targets||[]).map(x=>[String(x.id),x.label]));return Object.entries(a.matches||{}).map(([i,t])=>`${im.get(String(i))||i} → ${tm.get(String(t))||t}`).join('\n')||'—';}
    if(c.challenge_type==='drag_order'){const im=new Map((pc.items||[]).map(x=>[String(x.id),x.label]));return (a.order||[]).map((x,i)=>`${i+1}. ${im.get(String(x))||x}`).join('\n')||'—';}
    return String(a.text||'—');
  }
  function phasePills(metric={}){
    const phases=metric.phase_progress||{};
    const entries=Object.entries(phases);
    if(!entries.length)return '<span class="muted">Sem fase iniciada</span>';
    return `<div class="phase-progress">${entries.map(([phase,p])=>`<span class="phase-chip ${Number(p.percent)>=100?'done':''}">F${esc(phase)} ${Number(p.completed||0)}/${Number(p.total||0)}</span>`).join('')}</div>`;
  }

  function renderSessions(){
    const d=st.data,host=$('admin-content'),classes=d.classes||[],templates=d.templates||[];
    if(!st.createClass)st.createClass=String(classes[0]?.id||'');
    const rows=(d.sessions||[]).map(s=>{
      const [label,kind]=statusInfo(s.status);
      return `<tr><td><strong>${esc(s.title)}</strong><br><small class="muted">${esc(s.subject_name)}</small></td><td>${esc(className(s.class_id))}</td><td><span class="status-pill ${kind}">${esc(label)}</span></td><td>${Number(s.lobby_duration_minutes||15)} + ${Number(s.duration_minutes||50)} min</td><td>${Number(s.max_clan_size||6)}</td><td>${fmtScore(s.max_score)}</td><td>${fmtDate(s.created_at)}</td><td><button class="button ghost small" data-open="${s.id}" type="button">Gerenciar</button></td></tr>`;
    }).join('');
    host.innerHTML=`
      <section class="panel section-panel">
        <div class="section-head"><div><p class="eyebrow">Nova avaliação</p><h2>Criar modo prova prática</h2><p>Modelo recomendado: 15 minutos de pré-lobby + 50 minutos de desafios, podendo pausar e continuar na próxima aula. XP e notas são calculados no backend.</p></div></div>
        <form id="create-session-form" class="create-grid">
          <label class="form-field">Turma<select id="create-class" required>${classes.map(c=>`<option value="${c.id}" ${String(c.id)===String(st.createClass)?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
          <label class="form-field">Modelo<select id="create-template" required>${templates.map(t=>`<option value="${esc(t.key)}">${esc(t.subject_name)}</option>`).join('')}</select></label>
          <label class="form-field">Título<input id="create-title" required maxlength="180" value="Prova prática em equipe"></label>
          <label class="form-field">Pré-lobby (min)<input id="create-lobby-duration" type="number" min="5" max="60" value="15"></label>
          <label class="form-field">Prova (min)<input id="create-duration" type="number" min="10" max="180" value="50"></label>
          <label class="form-field">Valor máximo<input id="create-score" type="number" min="0.5" max="100" step="0.1" value="5"></label>
          <label class="form-field">Quantidade de empresas<input id="create-clans" type="number" min="2" max="12" value="6"></label>
          <label class="form-field">Máximo por empresa<input id="create-clan-size" type="number" min="2" max="6" value="6"></label>
          <label class="form-field">Peso do grupo (%)<input id="create-group-weight" type="number" min="0" max="100" value="50"></label>
          <label class="form-field span3">Descrição<input id="create-description" maxlength="1200" placeholder="Opcional: contexto da avaliação"></label>
          <div class="span3 control-bar"><button class="button primary" type="submit">Criar avaliação em rascunho</button><span id="create-message" class="message"></span></div>
        </form>
      </section>
      <section class="panel section-panel">
        <div class="section-head"><div><p class="eyebrow">Histórico</p><h2>Sessões de prova prática</h2></div><span class="status-pill">${(d.sessions||[]).length} sessão(ões)</span></div>
        <div class="table-wrap"><table class="session-table"><thead><tr><th>Avaliação</th><th>Turma</th><th>Status</th><th>Tempo</th><th>Grupo</th><th>Valor</th><th>Criada</th><th>Ação</th></tr></thead><tbody>${rows||'<tr><td colspan="8">Nenhuma sessão criada.</td></tr>'}</tbody></table></div>
      </section>`;
  }

  function controls(s){
    const b=[];const add=(cmd,label,cls='ghost')=>b.push(`<button class="button ${cls} small" data-command="${cmd}" type="button">${label}</button>`);
    if(s.status==='draft')add('open_waiting','Abrir pré-lobby','primary');
    if(s.status==='waiting_room'){add('lock','Bloquear equipes');add('start','Iniciar 50 min','primary');}
    if(s.status==='locked'){add('open_waiting','Reabrir pré-lobby');add('start','Iniciar 50 min','primary');}
    if(s.status==='running'){add('pause','Pausar','warn');add('add_time','+ 5 min');add('finish','Encerrar','danger');}
    if(s.status==='paused'){add('resume','Retomar','primary');add('add_time','+ 5 min');add('finish','Encerrar','danger');}
    if(s.status==='finished')add('grading','Iniciar correção','primary');
    if(['finished','grading','score_scheduled'].includes(s.status))add('publish_scores','Publicar notas agora','primary');
    if(!['published','cancelled'].includes(s.status))add('cancel','Cancelar sessão','danger');
    return b.join('');
  }

  function memberEditor(student,member){
    const d=st.data.detail,clan=String(member?.clan_id||''),role=String(member?.role_id||''),mm=d.metrics?.members?.[String(student.id)]||{};
    return `<div class="roster-row" data-roster-student="${student.id}">
      <div><strong><span class="online-dot ${mm.online?'on':''}"></span>${esc(student.full_name)}</strong><small>${esc(student.email||'')} ${member?`• ${Number(mm.progress_percent||0)}% • ${Number(mm.xp_earned||0)} XP`:''}</small></div>
      <select class="compact-select" data-member-clan><option value="">Sem empresa</option>${d.clans.map(c=>`<option value="${c.id}" ${String(c.id)===clan?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
      <select class="compact-select" data-member-role><option value="">Sem área</option>${d.roles.map(r=>`<option value="${r.id}" ${String(r.id)===role?'selected':''}>${esc(r.name)}</option>`).join('')}</select>
      <button class="button ghost small" data-save-member="${student.id}" type="button">Aplicar</button>
    </div>`;
  }

  function renderClans(d){
    return `<div class="clan-admin-grid">${d.clans.map(c=>{
      const members=d.members.filter(m=>String(m.clan_id)===String(c.id)),metric=d.metrics?.clans?.[String(c.id)]||{};
      return `<article class="clan-admin-card">
        <div class="clan-admin-head"><div><h3>${esc(c.name)}</h3><small class="muted">${members.length}/${d.session.max_clan_size} • ${Number(metric.online_count||0)} online • ${Number(metric.progress_percent||0)}% concluído</small></div><div class="rank-xp"><strong>${Number(metric.ranking_xp||0)}</strong><small>XP equipe / 1000</small></div></div>
        <progress class="progress" max="100" value="${Number(metric.progress_percent||0)}"></progress>
        ${phasePills(metric)}
        ${members.length?members.map(m=>{const mm=d.metrics?.members?.[String(m.student_id)]||{};return `<div class="admin-member"><div><strong><span class="online-dot ${mm.online?'on':''}"></span>${esc(m.student?.full_name||'Aluno')}${m.is_leader?' • Líder':''}</strong><small>${esc(roleName(m.role_id))}</small></div><div class="member-progress"><span>${Number(mm.progress_percent||0)}%</span><small>${Number(mm.completed_count||0)}/${Number(mm.total_count||0)} missões • ${Number(mm.xp_earned||0)}/${Number(mm.xp_max||0)} XP</small></div><span class="status-pill">nota ${fmtScore(mm.final_score||0)}</span><button class="button ghost small" data-remove-member="${m.student_id}" type="button">Remover</button></div>`}).join(''):'<div class="notice">Nenhum aluno nesta empresa.</div>'}
      </article>`;
    }).join('')}</div>`;
  }

  function renderRankings(d){
    const teams=d.metrics?.rankings?.teams||[],students=d.metrics?.rankings?.students||[];
    const teamRows=teams.map((r,i)=>`<tr><td><strong>${i+1}º</strong></td><td>${esc(clanName(r.clan_id))}</td><td><strong>${Number(r.ranking_xp||0)}</strong> / 1000</td><td>${Number(r.progress_percent||0)}%</td><td>${Number(r.online_count||0)}</td></tr>`).join('');
    const studentRows=students.map((r,i)=>`<tr><td><strong>${i+1}º</strong></td><td>${esc(r.name||studentName(r.student_id))}<br><small class="muted">${esc(clanName(r.clan_id))} • ${esc(roleName(r.role_id))}</small></td><td><strong>${Number(r.xp_earned||0)}</strong> / ${Number(r.xp_max||0)}</td><td>${Number(r.progress_percent||0)}%</td><td>${r.online?'<span class="status-pill good">online</span>':'<span class="status-pill">offline</span>'}</td></tr>`).join('');
    const topTeam=teams[0],topStudent=students[0];
    return `<section class="panel section-panel">
      <div class="section-head"><div><p class="eyebrow">Ranking ao vivo</p><h2>Melhor equipe e melhor aluno</h2><p>Ranking calculado no servidor. Equipe usa XP normalizado para não favorecer grupos maiores.</p></div></div>
      <div class="ranking-winners">
        <div class="winner-card"><span>🏆 Melhor equipe</span><strong>${topTeam?esc(clanName(topTeam.clan_id)):'—'}</strong><small>${topTeam?`${Number(topTeam.ranking_xp||0)} XP / 1000 • ${Number(topTeam.progress_percent||0)}%`:'Aguardando progresso'}</small></div>
        <div class="winner-card"><span>⭐ Melhor aluno</span><strong>${topStudent?esc(topStudent.name):'—'}</strong><small>${topStudent?`${Number(topStudent.xp_earned||0)} / ${Number(topStudent.xp_max||0)} XP • ${Number(topStudent.progress_percent||0)}%`:'Aguardando progresso'}</small></div>
      </div>
      <div class="layout2 ranking-layout"><div><h3>Equipes</h3><div class="table-wrap"><table class="session-table compact-table"><thead><tr><th>#</th><th>Equipe</th><th>XP</th><th>Progresso</th><th>Online</th></tr></thead><tbody>${teamRows||'<tr><td colspan="5">Sem equipes pontuadas.</td></tr>'}</tbody></table></div></div><div><h3>Alunos</h3><div class="table-wrap"><table class="session-table compact-table"><thead><tr><th>#</th><th>Aluno</th><th>XP</th><th>Progresso</th><th>Status</th></tr></thead><tbody>${studentRows||'<tr><td colspan="5">Sem alunos pontuados.</td></tr>'}</tbody></table></div></div></div>
    </section>`;
  }

  function renderChallenges(d){
    return `<div>${d.challenges.map(c=>`<div class="challenge-admin-row xp-row" data-challenge-row="${c.id}">
      <input class="compact-select" data-challenge-phase type="number" min="1" max="50" value="${Number(c.phase_no||1)}">
      <div><strong>${esc(c.title)}</strong><br><small class="muted">${esc(c.scope==='clan'?'Equipe':d.roles.find(r=>r.role_key===c.role_key)?.name||c.role_key||'—')} • ${esc(c.challenge_type)} • ${esc(c.public_config?.time_hint||'sem tempo sugerido')}</small><br><small class="muted">${esc(c.public_config?.instructions||'')}</small></div>
      <label class="mini-field"><span>Nota</span><input class="compact-select" data-challenge-points type="number" min="0" max="100" step="0.05" value="${Number(c.points||0)}"></label>
      <label class="mini-field"><span>XP máx.</span><input class="compact-select" data-challenge-xp type="number" min="0" max="500" step="1" value="${Number(c.xp_max||0)}"></label>
      <span class="status-pill ${c.active?'good':''}">${c.active?'Ativo':'Inativo'}</span>
      <button class="button ghost small" data-save-challenge="${c.id}" type="button">Salvar</button>
    </div>`).join('')}</div>`;
  }

  function renderSubmissions(d){
    if(!d.submissions.length)return '<div class="notice">Nenhuma missão enviada ainda.</div>';
    return `<div class="submission-list">${d.submissions.slice().sort((a,b)=>Date.parse(b.updated_at||0)-Date.parse(a.updated_at||0)).map(s=>{
      const c=d.challenges.find(x=>String(x.id)===String(s.challenge_id)),owner=s.student_id?studentName(s.student_id):`${clanName(s.clan_id)} • coletiva`,effective=s.manual_score??s.auto_score??0;
      const draft=s.status==='draft';return `<article class="submission-card ${draft?'draft-submission':''}" data-submission="${s.id}"><div class="section-head"><div><h4>${esc(c?.title||'Missão')}</h4><p>${esc(owner)} • ${draft?'rascunho salvo':'enviada por '+esc(studentName(s.submitted_by))} • ${fmtDate(s.updated_at||s.submitted_at)}</p></div><div class="session-meta"><span class="status-pill">${Number(c?.xp_max||0)} XP máx.</span><span class="status-pill ${s.status==='reviewed'?'good':draft?'warn':''}">${draft?'Rascunho — sem XP':s.status==='reviewed'?'Corrigida':s.auto_score!=null?'Autoavaliada':'Aguardando correção'}</span></div></div><div class="submission-answer">${esc(answerText(s))}</div>${draft?'<div class="notice">Ainda não é uma entrega definitiva. O aluno poderá continuar na próxima aula.</div>':`<div class="grade-grid"><label class="form-field">Nota / ${Number(c?.points||0)}<input data-grade-score type="number" min="0" max="${Number(c?.points||0)}" step="0.05" value="${Number(effective)}"></label><label class="form-field">Feedback<input data-grade-feedback maxlength="2000" value="${esc(s.feedback||'')}"></label><button class="button primary small" data-save-grade="${s.id}" type="button">Salvar correção</button><button class="button ghost small" data-reset-submission="${s.id}" type="button">Reabrir</button></div>`}</article>`;
    }).join('')}</div>`;
  }
  function renderEvents(d){return `<div class="event-list">${(d.events||[]).slice(0,100).map(e=>`<div class="event-row"><span>${fmtDate(e.occurred_at)}</span><strong>${esc(e.event_type.replaceAll('_',' '))}</strong><span>${esc(e.student_id?studentName(e.student_id):'Equipe docente')}</span></div>`).join('')||'<div class="notice">Sem eventos ainda.</div>'}</div>`;}

  function renderSettings(s){
    if(s.started_at||!['draft','waiting_room','locked'].includes(s.status))return '';
    return `<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Configuração da sessão</p><h2>Tempo, tamanho dos grupos e peso</h2><p>O limite pode variar de 2 a 6. Se reduzir o limite, nenhuma empresa pode estar acima do novo valor.</p></div></div><div class="create-grid settings-grid">
      <label class="form-field">Pré-lobby (min)<input id="settings-lobby" type="number" min="5" max="60" value="${Number(s.lobby_duration_minutes||15)}"></label>
      <label class="form-field">Prova (min)<input id="settings-duration" type="number" min="10" max="180" value="${Number(s.duration_minutes||50)}"></label>
      <label class="form-field">Máximo por equipe<input id="settings-clan-size" type="number" min="2" max="6" value="${Number(s.max_clan_size||6)}"></label>
      <label class="form-field">Peso grupo (%)<input id="settings-group-weight" type="number" min="0" max="100" value="${Math.round(Number(s.group_weight||.5)*100)}"></label>
      <div class="control-bar span2"><button id="save-session-settings" class="button primary" type="button">Salvar configuração</button><span class="muted">Planejado: ${Number(s.lobby_duration_minutes||15)+Number(s.duration_minutes||50)} min no total.</span></div>
    </div></section>`;
  }

  function renderDetail(){
    const d=st.data.detail,s=d.session,[label,kind]=statusInfo(s.status),members=d.members||[],online=members.filter(m=>d.metrics?.members?.[String(m.student_id)]?.online).length,avg=Object.values(d.metrics?.clans||{}).reduce((a,x)=>a+Number(x.progress_percent||0),0)/Math.max(1,Object.keys(d.metrics?.clans||{}).length),topTeam=d.metrics?.rankings?.teams?.[0],topStudent=d.metrics?.rankings?.students?.[0];
    $('admin-title').textContent=s.title;$('admin-subtitle').textContent=`${className(s.class_id)} • ${s.subject_name}`;$('back-sessions').classList.remove('hidden');
    const rosterMap=new Map(members.map(m=>[String(m.student_id),m]));
    const timer=s.status==='waiting_room'?`<div class="timer"><span>Pré-lobby restante</span><strong>${fmtTime(s.lobby_remaining_seconds)}</strong><small>${s.lobby_remaining_seconds<=0?'Tempo planejado esgotado':'Organização de equipes/áreas'}</small></div>`:['running','paused'].includes(s.status)?`<div class="timer ${Number(s.remaining_seconds)<=300?'danger':''}"><span>Prova restante</span><strong>${fmtTime(s.remaining_seconds)}</strong><small>Execução dos desafios</small></div>`:'';
    $('admin-content').innerHTML=`
      <section class="panel exam-hero"><div><p class="eyebrow">${esc(className(s.class_id))} • ${esc(s.subject_name)}</p><h1>${esc(s.title)}</h1><p>${esc(s.description||'')}</p><div class="session-meta"><span class="status-pill ${kind}">${esc(label)}</span><span class="status-pill">${Number(s.lobby_duration_minutes||15)} min lobby + ${Number(s.duration_minutes||50)} min prova</span><span class="status-pill">até ${Number(s.max_clan_size||6)} por equipe</span><span class="status-pill">${fmtScore(s.max_score)} pontos</span><span class="status-pill">Grupo ${Math.round(Number(s.group_weight||.5)*100)}% / Individual ${Math.round(Number(s.individual_weight||.5)*100)}%</span></div></div><div>${timer}<div class="control-bar hero-controls">${controls(s)}</div></div></section>
      ${renderSettings(s)}
      ${['finished','grading','score_scheduled'].includes(s.status)?`<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Publicação</p><h2>Nota programada</h2><p>XP/ranking e nota acadêmica são separados. A nota só chega ao aluno após publicação.</p></div></div><div class="create-grid"><label class="form-field">Data e hora<input id="publish-at" type="datetime-local" value="${fmtLocal(s.score_publish_at)}"></label><div class="control-bar"><button class="button warn" id="schedule-scores" type="button">Programar publicação</button></div></div></section>`:''}
      <section class="kpis"><div class="kpi"><span>Participantes</span><strong>${members.length}</strong></div><div class="kpi"><span>Online agora</span><strong>${online}</strong></div><div class="kpi"><span>Progresso médio</span><strong>${Math.round(avg)}%</strong></div><div class="kpi"><span>Missões enviadas</span><strong>${d.submissions.filter(x=>x.status!=='draft').length}</strong><small>${d.submissions.filter(x=>x.status==='draft').length} rascunhos</small></div><div class="kpi"><span>Melhor equipe</span><strong class="kpi-text">${topTeam?esc(clanName(topTeam.clan_id)):'—'}</strong><small>${topTeam?`${Number(topTeam.ranking_xp||0)} XP`:''}</small></div><div class="kpi"><span>Melhor aluno</span><strong class="kpi-text">${topStudent?esc(topStudent.name):'—'}</strong><small>${topStudent?`${Number(topStudent.xp_earned||0)} XP`:''}</small></div></section>
      ${renderRankings(d)}
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Empresas</p><h2>Progresso detalhado por equipe</h2><p>Mostra fases, XP, status online e progresso de cada integrante.</p></div></div>${renderClans(d)}</section>
      <div class="layout2"><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Gestão manual</p><h2>Alunos, equipes e áreas</h2><p>Professor pode adicionar, remover ou mover alunos manualmente.</p></div></div><div class="roster-list">${d.roster.map(p=>memberEditor(p,rosterMap.get(String(p.id)))).join('')}</div></section><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Fases</p><h2>Missões, nota e XP</h2><p>XP máximo e peso acadêmico só podem ser alterados antes do início da prova.</p></div></div>${renderChallenges(d)}</section></div>
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Correção</p><h2>Respostas das missões</h2><p>40% do XP do desafio é concedido por entrega válida e até 60% pela qualidade. Quizzes recebem qualidade automática; respostas abertas são recalculadas após correção.</p></div></div>${renderSubmissions(d)}</section>
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Auditoria</p><h2>Histórico da sessão</h2></div></div>${renderEvents(d)}</section>`;
  }

  function render(){
    if(st.sessionId&&st.data?.detail)renderDetail();
    else{$('admin-title').textContent='Sessões de avaliação';$('admin-subtitle').textContent=`${st.data?.staff?.full_name||st.profile?.full_name||'Equipe'} • ${st.data?.staff?.role||st.profile?.role||''}`;$('back-sessions').classList.add('hidden');renderSessions();}
  }
  async function load(){setConnection('Sincronizando');st.data=await api('staff_overview',st.sessionId?{session_id:st.sessionId}:{});setConnection('Online','good');render();}
  async function run(fn){if(st.busy)return;st.busy=true;setConnection('Salvando','warn');try{await fn();await load();}catch(e){console.error(e);setConnection('Erro','danger');alert(String(e?.data?.error||e?.message||'Falha').replaceAll('_',' '));}finally{st.busy=false;}}

  $('admin-content').addEventListener('submit',e=>{
    if(e.target.id!=='create-session-form')return;e.preventDefault();
    const b=e.submitter,m=$('create-message');b.disabled=true;m.textContent='Criando…';m.classList.remove('error');
    const payload={class_id:$('create-class').value,template_key:$('create-template').value,title:$('create-title').value.trim(),lobby_duration_minutes:Number($('create-lobby-duration').value),duration_minutes:Number($('create-duration').value),max_score:Number($('create-score').value),clan_count:Number($('create-clans').value),max_clan_size:Number($('create-clan-size').value),group_weight:Number($('create-group-weight').value)/100,description:$('create-description').value.trim()};
    api('create_session',payload).then(out=>{st.sessionId=String(out.session.id);return load();}).catch(err=>{console.error(err);m.textContent=String(err?.data?.error||err?.message||'Erro ao criar').replaceAll('_',' ');m.classList.add('error');}).finally(()=>b.disabled=false);
  });
  $('admin-content').addEventListener('change',e=>{if(e.target.id==='create-class')st.createClass=e.target.value;});
  $('admin-content').addEventListener('click',e=>{
    const t=e.target.closest('[data-open],[data-command],[data-save-member],[data-remove-member],[data-save-challenge],[data-save-grade],[data-reset-submission],#schedule-scores,#save-session-settings');if(!t)return;
    if(t.dataset.open){st.sessionId=String(t.dataset.open);return load();}
    if(t.dataset.command){const command=t.dataset.command;const extra=command==='add_time'?{minutes:5}:{};if(['finish','cancel','publish_scores'].includes(command)&&!confirm(command==='publish_scores'?'Publicar as notas agora para todos os alunos?':'Confirmar esta ação?'))return;return run(()=>api('session_control',{session_id:st.sessionId,command,...extra}));}
    if(t.id==='save-session-settings'){return run(()=>api('update_session_settings',{session_id:st.sessionId,lobby_duration_minutes:Number($('settings-lobby').value),duration_minutes:Number($('settings-duration').value),max_clan_size:Number($('settings-clan-size').value),group_weight:Number($('settings-group-weight').value)/100}));}
    if(t.id==='schedule-scores'){const publish_at=$('publish-at')?.value;if(!publish_at)return alert('Informe data e hora.');return run(()=>api('session_control',{session_id:st.sessionId,command:'schedule_scores',publish_at:new Date(publish_at).toISOString()}));}
    if(t.dataset.saveMember){const row=t.closest('[data-roster-student]'),student_id=t.dataset.saveMember,clan_id=row.querySelector('[data-member-clan]').value||null,role_id=row.querySelector('[data-member-role]').value||null;return run(()=>api('move_member',{session_id:st.sessionId,student_id,clan_id,role_id}));}
    if(t.dataset.removeMember){if(!confirm('Remover este aluno da empresa e liberar o área?'))return;return run(()=>api('move_member',{session_id:st.sessionId,student_id:t.dataset.removeMember,clan_id:null,role_id:null}));}
    if(t.dataset.saveChallenge){const row=t.closest('[data-challenge-row]');return run(()=>api('update_challenge',{challenge_id:t.dataset.saveChallenge,phase_no:Number(row.querySelector('[data-challenge-phase]').value),points:Number(row.querySelector('[data-challenge-points]').value),xp_max:Number(row.querySelector('[data-challenge-xp]').value)}));}
    if(t.dataset.saveGrade){const card=t.closest('[data-submission]'),score=Number(card.querySelector('[data-grade-score]').value),feedback=card.querySelector('[data-grade-feedback]').value;return run(()=>api('grade_submission',{submission_id:t.dataset.saveGrade,score,feedback}));}
    if(t.dataset.resetSubmission){if(!confirm('Reabrir esta missão? A entrega e o XP correspondente serão recalculados quando houver nova resposta.'))return;return run(()=>api('reset_submission',{submission_id:t.dataset.resetSubmission}));}
  });
  $('back-sessions').addEventListener('click',()=>{st.sessionId=null;load();});
  $('refresh').addEventListener('click',load);
  async function signedIn(){const p=await loadProfile();if(!p)return;$('login-view').classList.add('hidden');$('app-view').classList.remove('hidden');$('logout').classList.remove('hidden');await load();clearInterval(st.poll);st.poll=setInterval(()=>{if(!document.hidden)load().catch(()=>{});},5000);}
  async function restore(){const s=await auth.getSession();if(!s){setConnection('Sem sessão');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();setConnection('Acesso negado','danger');}}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;msg('Entrando…');try{await auth.signIn($('email').value.trim().toLowerCase(),$('password').value);await signedIn();msg();}catch(err){console.error(err);msg('Não foi possível entrar ou sua conta não possui permissão.',true);}finally{b.disabled=false;}});
  $('logout').addEventListener('click',async()=>{clearInterval(st.poll);await auth.signOut();location.reload();});
  auth.onStorage(()=>restore());restore();
})();

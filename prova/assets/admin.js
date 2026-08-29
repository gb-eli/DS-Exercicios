(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const st={profile:null,data:null,sessionId:null,poll:null,busy:false,createClass:null};
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const guildMark=room=>/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(String(room?.emblem_data_url||''))?`<img class="guild-emblem" src="${esc(room.emblem_data_url)}" alt="Identidade visual de ${esc(room.name)}">`:`<span class="team-monogram">${esc((String(room?.name||'E').match(/\d+/)?.[0]||String(room?.name||'E').trim().slice(0,2)).toUpperCase())}</span>`;
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
      return `<tr><td><strong>${esc(s.title)}</strong><br><small class="muted">${esc(s.subject_name)}</small></td><td>${esc(className(s.class_id))}</td><td><span class="status-pill ${kind}">${esc(label)}</span></td><td>${Number(s.lobby_duration_minutes||15)} min lobby<br><small class="muted">operação manual</small></td><td>${Number(s.max_clan_size||6)}</td><td>${fmtScore(s.max_score)}</td><td>${fmtDate(s.created_at)}</td><td><button class="button ghost small" data-open="${s.id}" type="button">Gerenciar</button></td></tr>`;
    }).join('');
    host.innerHTML=`
      <section class="panel section-panel">
        <div class="section-head"><div><p class="eyebrow">Nova avaliação</p><h2>Criar modo prova prática</h2><p>Modelo recomendado: pré-lobby + operação aberta. A prova pode continuar em casa e entre aulas; somente o professor encerra definitivamente. XP e notas são calculados no backend.</p></div></div>
        <form id="create-session-form" class="create-grid">
          <label class="form-field">Turma<select id="create-class" required>${classes.map(c=>`<option value="${c.id}" ${String(c.id)===String(st.createClass)?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
          <label class="form-field">Modelo<select id="create-template" required>${templates.map(t=>`<option value="${esc(t.key)}">${esc(t.subject_name)}</option>`).join('')}</select></label>
          <label class="form-field">Título<input id="create-title" required maxlength="180" value="Prova prática em equipe"></label>
          <label class="form-field">Pré-lobby (min)<input id="create-lobby-duration" type="number" min="5" max="60" value="15"></label>
          <label class="form-field">Referência de tempo (min)<input id="create-duration" type="number" min="10" max="180" value="50"><small>Informativo. Não encerra a prova.</small></label>
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
    if(s.status==='waiting_room'){add('lock','Bloquear equipes');add('start','Iniciar operação','primary');}
    if(s.status==='locked'){add('open_waiting','Reabrir pré-lobby');add('start','Iniciar operação','primary');}
    if(s.status==='running'){if(s.home_continuation_enabled)add('resume_class','Retomar encontro presencial','primary');else add('home_continuation','Encerrar encontro • continuar em casa','warn');add('finish','Encerrar avaliação definitivamente','danger');}
    if(s.status==='paused'){add('resume','Desbloquear envios','primary');add('finish','Encerrar avaliação definitivamente','danger');}
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
      const readyCount=members.filter(m=>m.role_id&&m.role_selected_at).length;
      return `<article class="clan-admin-card" style="--guild-accent:${esc(c.accent_color||'#22d3ee')}">
        <div class="clan-admin-head"><div class="admin-guild-identity">${guildMark(c)}<div><h3>${esc(c.company_name||c.name)}</h3><small>${esc(c.company_name?c.name:'Nome da empresa ainda não definido')} · ${members.length}/${d.session.max_clan_size} integrantes · ${readyCount} prontos · ${Number(metric.online_count||0)} online</small></div></div><div class="team-score"><strong>${Number(metric.progress_percent||0)}%</strong><small>progresso</small></div></div>
        <progress class="progress" max="100" value="${Number(metric.progress_percent||0)}"></progress>
        ${phasePills(metric)}
        <div class="team-member-list">${members.length?members.map(m=>{const mm=d.metrics?.members?.[String(m.student_id)]||{},ready=!!m.role_id&&!!m.role_selected_at;return `<div class="admin-member"><div class="member-identity"><strong><span class="online-dot ${mm.online?'on':''}"></span>${esc(m.student?.full_name||'Aluno')}</strong><small>${esc(roleName(m.role_id))}</small></div><div class="member-progress"><span>${Number(mm.progress_percent||0)}%</span><small>${Number(mm.completed_count||0)}/${Number(mm.total_count||0)} atividades · ${Number(mm.xp_earned||0)} XP</small></div><span class="status-pill ${ready?'good':'warn'}">${ready?'Pronto':'Pendente'}</span>${m.is_leader?'<span class="leader-badge">Líder</span>':`<button class="member-action" data-set-leader="${m.student_id}" data-clan-id="${c.id}" type="button">Tornar líder</button>`}</div>`}).join(''):'<div class="empty-team">Nenhum integrante nesta equipe.</div>'}</div>
      </article>`;
    }).join('')}</div>`;
  }

  function renderRankings(d){
    const teams=(d.metrics?.rankings?.teams||[]).filter(r=>Number(r.ranking_xp||0)>0||Number(r.progress_percent||0)>0),students=(d.metrics?.rankings?.students||[]).filter(r=>Number(r.xp_earned||0)>0||Number(r.progress_percent||0)>0);
    if(!teams.length&&!students.length)return `<section class="panel section-panel compact-section"><div class="section-head"><div><p class="eyebrow">Desempenho</p><h2>Ranking ainda não iniciado</h2><p>O ranking será exibido quando houver uma entrega ou pontuação real. Empates em zero não geram “melhor equipe” nem “melhor aluno”.</p></div></div></section>`;
    const teamRows=teams.map((r,i)=>`<tr><td><strong>${i+1}º</strong></td><td>${esc(clanName(r.clan_id))}</td><td><strong>${Number(r.ranking_xp||0)}</strong> / 1000</td><td>${Number(r.progress_percent||0)}%</td><td>${Number(r.online_count||0)}</td></tr>`).join('');
    const studentRows=students.map((r,i)=>`<tr><td><strong>${i+1}º</strong></td><td>${esc(r.name||studentName(r.student_id))}<br><small class="muted">${esc(clanName(r.clan_id))} · ${esc(roleName(r.role_id))}</small></td><td><strong>${Number(r.xp_earned||0)}</strong> / ${Number(r.xp_max||0)}</td><td>${Number(r.progress_percent||0)}%</td><td>${r.online?'<span class="status-pill good">Online</span>':'<span class="status-pill">Offline</span>'}</td></tr>`).join('');
    const topTeam=teams[0],topStudent=students[0];
    return `<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Desempenho</p><h2>Ranking da avaliação</h2><p>Exibido somente a partir de progresso real. A pontuação de equipe é normalizada para não favorecer grupos maiores.</p></div></div><div class="ranking-summary">${topTeam?`<div><span>Equipe em destaque</span><strong>${esc(clanName(topTeam.clan_id))}</strong><small>${Number(topTeam.ranking_xp||0)} XP · ${Number(topTeam.progress_percent||0)}%</small></div>`:''}${topStudent?`<div><span>Aluno em destaque</span><strong>${esc(topStudent.name)}</strong><small>${Number(topStudent.xp_earned||0)} XP · ${Number(topStudent.progress_percent||0)}%</small></div>`:''}</div><div class="layout2 ranking-layout"><div><h3>Equipes</h3><div class="table-wrap"><table class="session-table compact-table"><thead><tr><th>#</th><th>Equipe</th><th>XP</th><th>Progresso</th><th>Online</th></tr></thead><tbody>${teamRows}</tbody></table></div></div><details><summary><strong>Ranking individual</strong></summary><div class="table-wrap"><table class="session-table compact-table"><thead><tr><th>#</th><th>Aluno</th><th>XP</th><th>Progresso</th><th>Status</th></tr></thead><tbody>${studentRows||'<tr><td colspan="5">Sem pontuação individual.</td></tr>'}</tbody></table></div></details></div></section>`;
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
    if(!d.submissions.length)return '<div class="notice">Nenhuma atividade enviada ainda.</div>';
    return `<div class="submission-list">${d.submissions.slice().sort((a,b)=>Date.parse(b.updated_at||0)-Date.parse(a.updated_at||0)).map(s=>{
      const c=d.challenges.find(x=>String(x.id)===String(s.challenge_id)),owner=s.student_id?studentName(s.student_id):`${clanName(s.clan_id)} • coletiva`,effective=s.manual_score??s.auto_score??0;
      const draft=s.status==='draft';return `<article class="submission-card ${draft?'draft-submission':''}" data-submission="${s.id}"><div class="section-head"><div><h4>${esc(c?.title||'Atividade')}</h4><p>${esc(owner)} • ${draft?'rascunho salvo':'enviada por '+esc(studentName(s.submitted_by))} • ${fmtDate(s.updated_at||s.submitted_at)}</p></div><div class="session-meta"><span class="status-pill">${Number(c?.xp_max||0)} XP máx.</span><span class="status-pill ${s.status==='reviewed'?'good':draft?'warn':''}">${draft?'Rascunho — sem XP':s.status==='reviewed'?'Corrigida':s.auto_score!=null?'Autoavaliada':'Aguardando correção'}</span></div></div><div class="submission-answer">${esc(answerText(s))}</div>${draft?'<div class="notice">Ainda não é uma entrega definitiva. O aluno poderá continuar na próxima aula.</div>':`<div class="grade-grid"><label class="form-field">Nota / ${Number(c?.points||0)}<input data-grade-score type="number" min="0" max="${Number(c?.points||0)}" step="0.05" value="${Number(effective)}"></label><label class="form-field">Feedback<input data-grade-feedback maxlength="2000" value="${esc(s.feedback||'')}"></label><button class="button primary small" data-save-grade="${s.id}" type="button">Salvar correção</button><button class="button ghost small" data-reset-submission="${s.id}" type="button">Reabrir</button></div>`}</article>`;
    }).join('')}</div>`;
  }
  function renderEvents(d){return `<div class="event-list">${(d.events||[]).slice(0,100).map(e=>`<div class="event-row"><span>${fmtDate(e.occurred_at)}</span><strong>${esc(e.event_type.replaceAll('_',' '))}</strong><span>${esc(e.student_id?studentName(e.student_id):'Equipe docente')}</span></div>`).join('')||'<div class="notice">Sem eventos ainda.</div>'}</div>`;}

  function renderRemovalRequests(d){
    const events=d.events||[],resolved=new Set(events.filter(e=>['staff_member_removal_approved','staff_member_removal_denied'].includes(e.event_type)).map(e=>String(e.metadata?.request_event_id||'')));
    const requests=events.filter(e=>e.event_type==='leader_member_removal_requested'&&!resolved.has(String(e.id)));
    if(!requests.length)return '';
    return `<section class="panel section-panel moderation-panel"><div class="section-head"><div><p class="eyebrow">Moderação docente</p><h2>Solicitações de troca de integrante</h2><p>O líder não remove ninguém sozinho. Toda alteração exige sua decisão.</p></div><span class="status-pill warn">${requests.length} pendente(s)</span></div><div class="request-list">${requests.map(r=>`<article class="notice warn"><strong>${esc(clanName(r.clan_id))}</strong> solicitou troca de <strong>${esc(studentName(r.student_id))}</strong><br><small>${esc(r.metadata?.reason||'Sem motivo informado')} • ${fmtDate(r.occurred_at)}</small><div class="control-bar"><button class="button danger small" data-removal-request="${r.id}" data-removal-decision="approve" type="button">Aprovar troca</button><button class="button ghost small" data-removal-request="${r.id}" data-removal-decision="deny" type="button">Negar</button></div></article>`).join('')}</div></section>`;
  }

  function renderTeamChat(d){
    const rows=(d.team_chat||[]).slice(0,120);if(!rows.length)return `<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Supervisão</p><h2>Chat das equipes</h2><p>Somente leitura para a equipe docente.</p></div></div><div class="notice">Ainda não há mensagens.</div></section>`;
    return `<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Supervisão</p><h2>Chat das equipes</h2><p>Histórico somente leitura para acompanhamento do trabalho colaborativo.</p></div><span class="status-pill">${rows.length} recentes</span></div><div class="staff-chat-list">${rows.map(x=>`<div class="staff-chat-row"><span>${fmtDate(x.created_at)}</span><strong>${esc(clanName(x.clan_id))} • ${esc(x.sender_name||studentName(x.sender_id))}</strong><p>${esc(x.message)}</p></div>`).join('')}</div></section>`;
  }

  function renderSettings(s){
    if(s.started_at||!['draft','waiting_room','locked'].includes(s.status))return '';
    return `<details class="panel section-panel settings-disclosure"><summary><span><strong>Configuração da sessão</strong><small>Pré-lobby, tamanho das equipes e peso da avaliação</small></span><span>Editar</span></summary><div class="create-grid settings-grid settings-body"><label class="form-field">Pré-lobby (min)<input id="settings-lobby" type="number" min="5" max="60" value="${Number(s.lobby_duration_minutes||15)}"></label><label class="form-field">Tempo de referência (min)<input id="settings-duration" type="number" min="10" max="180" value="${Number(s.duration_minutes||50)}"><small>Informativo; não encerra a prova.</small></label><label class="form-field">Máximo por equipe<input id="settings-clan-size" type="number" min="2" max="6" value="${Number(s.max_clan_size||6)}"></label><label class="form-field">Peso da equipe (%)<input id="settings-group-weight" type="number" min="0" max="100" value="${Math.round(Number(s.group_weight||.5)*100)}"></label><div class="control-bar span2"><button id="save-session-settings" class="button primary" type="button">Salvar alterações</button><span class="muted">O professor controla o encerramento.</span></div></div></details>`;
  }

  function renderDetail(){
    const d=st.data.detail,s=d.session,[label,kind]=statusInfo(s.status),members=d.members||[],online=members.filter(m=>d.metrics?.members?.[String(m.student_id)]?.online).length,avg=Object.values(d.metrics?.clans||{}).reduce((a,x)=>a+Number(x.progress_percent||0),0)/Math.max(1,Object.keys(d.metrics?.clans||{}).length),ready=members.filter(m=>m.role_id&&m.role_selected_at).length;
    $('admin-title').textContent=s.title;$('admin-subtitle').textContent=`${className(s.class_id)} • ${s.subject_name}`;$('back-sessions').classList.remove('hidden');
    const rosterMap=new Map(members.map(m=>[String(m.student_id),m]));
    const timer=s.status==='waiting_room'?(Number(s.lobby_remaining_seconds||0)>0?`<div class="timer"><span>Organização das equipes</span><strong>${fmtTime(s.lobby_remaining_seconds)}</strong><small>tempo de referência</small></div>`:`<div class="timer waiting-teacher"><span>Organização das equipes</span><strong>Aguardando professor</strong><small>o início é manual</small></div>`):['running','paused'].includes(s.status)?`<div class="timer operation-clock"><span>Tempo de atividade</span><strong>${fmtTime(s.elapsed_seconds||0)}</strong><small>${s.home_continuation_enabled?'continuação em casa ativa':'encerramento manual'}</small></div>`:'';
    $('admin-content').innerHTML=`
      <section class="panel exam-hero"><div><p class="eyebrow">${esc(className(s.class_id))} • ${esc(s.subject_name)}</p><h1>${esc(s.title)}</h1><p>${esc(s.description||'')}</p><div class="session-facts"><span class="status-pill ${kind}">${esc(label)}</span><span><b>${Number(s.max_clan_size||6)}</b> máx. por equipe</span><span><b>${fmtScore(s.max_score)}</b> pontos</span><span><b>${Math.round(Number(s.group_weight||.5)*100)}%</b> equipe / <b>${Math.round(Number(s.individual_weight||.5)*100)}%</b> individual</span>${s.home_continuation_enabled?'<span class="continuation-flag">Continuação em casa ativa</span>':''}</div></div><div>${timer}<div class="control-bar hero-controls">${controls(s)}</div></div></section>
      ${renderSettings(s)}
      ${renderRemovalRequests(d)}
      ${['finished','grading','score_scheduled'].includes(s.status)?`<section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Publicação</p><h2>Nota programada</h2><p>Pontuação de acompanhamento e nota acadêmica são separadas. A nota só chega ao aluno após publicação.</p></div></div><div class="create-grid"><label class="form-field">Data e hora<input id="publish-at" type="datetime-local" value="${fmtLocal(s.score_publish_at)}"></label><div class="control-bar"><button class="button warn" id="schedule-scores" type="button">Programar publicação</button></div></div></section>`:''}
      <section class="kpis operational-kpis"><div class="kpi"><span>Participantes</span><strong>${members.length}</strong></div><div class="kpi"><span>Online agora</span><strong>${online}</strong></div><div class="kpi"><span>Funções confirmadas</span><strong>${ready}/${members.length}</strong></div><div class="kpi"><span>Entregas</span><strong>${d.submissions.filter(x=>x.status!=='draft').length}</strong><small>${d.submissions.filter(x=>x.status==='draft').length} rascunhos</small></div><div class="kpi"><span>Progresso médio</span><strong>${Math.round(avg)}%</strong></div></section>
      ${renderRankings(d)}
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Empresas</p><h2>Progresso detalhado por equipe</h2><p>Mostra fases, XP, status online e progresso de cada integrante.</p></div></div>${renderClans(d)}</section>
      <div class="layout2"><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Gestão manual</p><h2>Alunos, equipes e áreas</h2><p>Antes do início, o professor pode organizar equipes e áreas. Durante a avaliação, pode redefinir liderança em caso de ausência ou falha de acesso.</p></div></div><div class="roster-list">${d.roster.map(p=>memberEditor(p,rosterMap.get(String(p.id)))).join('')}</div></section><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Fases</p><h2>Atividades, nota e XP</h2><p>XP máximo e peso acadêmico só podem ser alterados antes do início da prova.</p></div></div>${renderChallenges(d)}</section></div>
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Correção</p><h2>Respostas das atividades</h2><p>40% do XP do desafio é concedido por entrega válida e até 60% pela qualidade. Quizzes recebem qualidade automática; respostas abertas são recalculadas após correção.</p></div></div>${renderSubmissions(d)}</section>
      ${renderTeamChat(d)}
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
    const t=e.target.closest('[data-open],[data-command],[data-save-member],[data-remove-member],[data-set-leader],[data-removal-request],[data-save-challenge],[data-save-grade],[data-reset-submission],#schedule-scores,#save-session-settings');if(!t)return;
    if(t.dataset.open){st.sessionId=String(t.dataset.open);return load();}
    if(t.dataset.command){const command=t.dataset.command,extra={};if(command==='finish'&&!confirm('ENCERRAR DEFINITIVAMENTE a avaliação? Depois disso os alunos não poderão continuar enviando missões.'))return;if(command==='home_continuation'&&!confirm('Encerrar o encontro de hoje e manter a operação ABERTA para os alunos continuarem em casa?'))return;if(command==='cancel'&&!confirm('Cancelar esta sessão?'))return;if(command==='publish_scores'&&!confirm('Publicar as notas agora para todos os alunos?'))return;return run(()=>api('session_control',{session_id:st.sessionId,command,...extra}));}
    if(t.id==='save-session-settings'){return run(()=>api('update_session_settings',{session_id:st.sessionId,lobby_duration_minutes:Number($('settings-lobby').value),duration_minutes:Number($('settings-duration').value),max_clan_size:Number($('settings-clan-size').value),group_weight:Number($('settings-group-weight').value)/100}));}
    if(t.id==='schedule-scores'){const publish_at=$('publish-at')?.value;if(!publish_at)return alert('Informe data e hora.');return run(()=>api('session_control',{session_id:st.sessionId,command:'schedule_scores',publish_at:new Date(publish_at).toISOString()}));}
    if(t.dataset.setLeader){if(!confirm(`Definir ${studentName(t.dataset.setLeader)} como líder${st.data?.detail?.session?.status==='running'?' interino':''} desta equipe?`))return;return run(()=>api('staff_set_leader',{session_id:st.sessionId,clan_id:t.dataset.clanId,student_id:t.dataset.setLeader}));}
    if(t.dataset.removalRequest){const decision=t.dataset.removalDecision;if(!confirm(decision==='approve'?'Aprovar a troca? O aluno sairá da equipe e voltará ao lobby.':'Negar esta solicitação?'))return;return run(()=>api('resolve_member_removal',{session_id:st.sessionId,request_id:t.dataset.removalRequest,decision}));}
    if(t.dataset.saveMember){const row=t.closest('[data-roster-student]'),student_id=t.dataset.saveMember,clan_id=row.querySelector('[data-member-clan]').value||null,role_id=row.querySelector('[data-member-role]').value||null;return run(()=>api('move_member',{session_id:st.sessionId,student_id,clan_id,role_id}));}
    if(t.dataset.removeMember){if(!confirm('Remover este aluno da empresa e liberar o área?'))return;return run(()=>api('move_member',{session_id:st.sessionId,student_id:t.dataset.removeMember,clan_id:null,role_id:null}));}
    if(t.dataset.saveChallenge){const row=t.closest('[data-challenge-row]');return run(()=>api('update_challenge',{challenge_id:t.dataset.saveChallenge,phase_no:Number(row.querySelector('[data-challenge-phase]').value),points:Number(row.querySelector('[data-challenge-points]').value),xp_max:Number(row.querySelector('[data-challenge-xp]').value)}));}
    if(t.dataset.saveGrade){const card=t.closest('[data-submission]'),score=Number(card.querySelector('[data-grade-score]').value),feedback=card.querySelector('[data-grade-feedback]').value;return run(()=>api('grade_submission',{submission_id:t.dataset.saveGrade,score,feedback}));}
    if(t.dataset.resetSubmission){if(!confirm('Reabrir esta atividade? A entrega e o XP correspondente serão recalculados quando houver nova resposta.'))return;return run(()=>api('reset_submission',{submission_id:t.dataset.resetSubmission}));}
  });
  $('back-sessions').addEventListener('click',()=>{st.sessionId=null;load();});
  $('refresh').addEventListener('click',load);
  async function signedIn(){const p=await loadProfile();if(!p)return;$('login-view').classList.add('hidden');$('app-view').classList.remove('hidden');$('logout').classList.remove('hidden');await load();clearInterval(st.poll);st.poll=setInterval(()=>{if(!document.hidden)load().catch(()=>{});},5000);}
  async function restore(){const s=await auth.getSession();if(!s){setConnection('Sem sessão');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();setConnection('Acesso negado','danger');}}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;msg('Entrando…');try{await auth.signIn($('email').value.trim().toLowerCase(),$('password').value);await signedIn();msg();}catch(err){console.error(err);msg('Não foi possível entrar ou sua conta não possui permissão.',true);}finally{b.disabled=false;}});
  $('logout').addEventListener('click',async()=>{clearInterval(st.poll);await auth.signOut();location.reload();});
  auth.onStorage(()=>restore());restore();
})();

(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const st={profile:null,sessions:[],accommodation:null,detail:null,sessionId:null,poll:null,heartbeat:null,timer:null,lobbyTimer:null,busy:false,emblemDraft:null,draftTimers:new Map(),draftStatus:new Map(),lastStatus:null,introSession:null,challengeFilter:(window.innerWidth<760?'mine':'all'),chat:{open:false,poll:null,lastHtml:''}};
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const statusInfo=s=>({draft:['Rascunho',''],waiting_room:['Pré-lobby','live'],locked:['Equipes bloqueadas','warn'],running:['Em andamento','live'],paused:['Pausada','warn'],finished:['Finalizada',''],grading:['Em correção',''],score_scheduled:['Nota programada','warn'],published:['Nota publicada','good'],cancelled:['Cancelada','danger']}[s]||[s||'—','']);
  const fmtTime=sec=>{sec=Math.max(0,Math.floor(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
  const fmtDate=v=>v?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'—';
  const safeEmblem=value=>/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(String(value||''))?String(value):'';
  const guildMark=(room,size='')=>{const image=safeEmblem(room?.emblem_data_url);if(image)return `<img class="guild-emblem ${size}" src="${esc(image)}" alt="Identidade visual de ${esc(room?.company_name||room?.name||'equipe')}">`;const mark=(String(room?.company_name||room?.name||'EQ').match(/\d+/)?.[0]||String(room?.company_name||room?.name||'EQ').trim().slice(0,2)).toUpperCase();return `<span class="team-monogram ${size}">${esc(mark)}</span>`;};
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const msg=(t='',err=false)=>{const e=$('login-message');if(e){e.textContent=t;e.classList.toggle('error',err)}};
  function setConnection(text,kind=''){const e=$('connection-pill');if(!e)return;e.textContent=text;e.className=`pill ${kind}`.trim();}
  function syncAvatarExamContext(detail=st.detail){
    const api=window.AGVAvatarContext;if(!api||!detail?.session)return;const status=String(detail.session.status||''),sessionId=String(detail.session.id||st.sessionId||'');
    if(['waiting_room','locked'].includes(status))api.set({state:'waiting',interiorId:'practical-exam',platform:'prova',sessionId,activity:detail.session.title||'Prova prática',detail:'Aguardando início'});
    else if(status==='running')api.set({state:'exam-running',interiorId:'practical-exam',platform:'prova',sessionId,activity:detail.session.title||'Prova prática',detail:'Fazendo prova'});
    else if(status==='paused')api.set({state:'exam-paused',interiorId:'practical-exam',platform:'prova',sessionId,activity:detail.session.title||'Prova prática',detail:'Prova pausada'});
    else if(['finished','grading','score_scheduled','published','cancelled'].includes(status))api.set({state:'exam-finished',interiorId:'practical-exam',platform:'prova',sessionId,activity:detail.session.title||'Prova prática',detail:'Prova finalizada'});
  }
  function applyAccommodation(a=st.accommodation||st.detail?.accommodation||{}){
    const scale=Math.min(1.2,Math.max(1,Number(a.font_scale)||1));
    document.documentElement.style.fontSize=`${Math.round(16*scale)}px`;
    document.body.classList.toggle('exam-reduce-motion',!!a.reduce_motion);
    document.body.classList.toggle('exam-focus-mode',!!a.focus_mode);
    document.body.classList.toggle('exam-home-study',!!a.home_study);
    document.body.classList.toggle('exam-fullscreen-optional',!!a.fullscreen_optional);
  }
  async function loadProfile(){const u=await auth.getUser();const rows=await auth.request(`/rest/v1/profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${encodeURIComponent(u.id)}&limit=1`);const p=Array.isArray(rows)?rows[0]:null;if(!p?.active)throw new Error('Acesso inativo.');if(p.must_change_password){location.replace('../atividades/');return null;}st.profile=p;return p;}
  function draftKey(c){return `agv-practical-draft:${st.profile?.id||'x'}:${st.sessionId}:${c.id}`;}
  function readDraft(c){try{return JSON.parse(localStorage.getItem(draftKey(c))||'null');}catch{return null;}}
  function saveDraft(c,answer){try{localStorage.setItem(draftKey(c),JSON.stringify(answer));}catch{}}
  function clearDraft(c){try{localStorage.removeItem(draftKey(c));}catch{}}
  function draftMessage(c,text,kind=''){const el=document.querySelector(`[data-draft-state="${CSS.escape(String(c.id))}"]`);if(!el)return;el.textContent=text;el.className=`draft-state ${kind}`.trim();}
  function queueServerDraft(c,answer){
    if(!c?.can_edit_draft||c.team_submitted)return;
    saveDraft(c,answer);draftMessage(c,'Alterações locais…');
    const key=String(c.id);clearTimeout(st.draftTimers.get(key));
    st.draftTimers.set(key,setTimeout(async()=>{try{draftMessage(c,'Salvando no servidor…','warn');await api('save_draft',{session_id:st.sessionId,challenge_id:c.id,answer});st.draftStatus.set(key,Date.now());draftMessage(c,'Rascunho salvo no servidor','good');}catch(e){console.error(e);draftMessage(c,'Não foi possível sincronizar agora','danger');}},750));
  }
  function renderHeader(){const h=$('student-header');if(!st.profile)return;h.innerHTML=`<div><strong>${esc(st.profile.full_name||st.profile.email)}</strong><small>${esc(st.profile.email||'')}</small></div><span class="status-pill good">Aluno autenticado</span>`;}

  function renderSessions(){
    document.documentElement.dataset.examTheme='';
    const host=$('exam-content');
    if(!st.sessions.length){host.innerHTML='<div class="panel empty-card"><strong>Nenhuma Prova Coletiva disponível agora.</strong><p>Quando o professor abrir o lobby ou publicar uma avaliação, ela aparecerá aqui.</p><a class="button ghost" href="../atividades/">Ir para atividades convencionais</a></div>';return;}
    host.innerHTML=`<section><div class="section-head"><div><p class="eyebrow">AVALIAÇÃO PRÁTICA EM EQUIPE</p><h2>Modo Prova</h2><p>Entre no lobby, escolha sua equipe, participe da liderança, assuma uma função e cumpra as atividades previstas.</p></div></div><div class="session-grid">${st.sessions.map(s=>{
      const [label,kind]=statusInfo(s.status);
      const context=s.status==='score_scheduled'?`Publicação: ${fmtDate(s.score_publish_at)}`:s.status==='running'?(s.home_continuation_enabled?'Continuação em casa liberada • professor encerra a avaliação':`Avaliação em andamento • ${fmtTime(s.elapsed_seconds||0)} de atividade • encerramento docente`):s.status==='waiting_room'?`Pré-lobby: ${fmtTime(s.lobby_remaining_seconds)} • encerramento manual pelo professor`:esc(s.description||'Avaliação prática em grupo.');
      return `<article class="panel session-card match-session-card"><div class="session-meta"><span class="status-pill ${kind}">${esc(label)}</span><span class="status-pill">${Number(s.max_score||0).toLocaleString('pt-BR')} pts</span></div><h3>${esc(s.title)}</h3><p>${esc(s.subject_name)}</p><p>${context}</p><button class="button ${['waiting_room','locked','running','paused'].includes(s.status)?'primary':'ghost'}" data-open-session="${s.id}" type="button">${s.status==='published'?'Ver resultado':s.status==='waiting_room'?'Entrar no lobby':s.status==='running'?'Entrar na avaliação':'Abrir avaliação'}</button></article>`;
    }).join('')}</div></section>`;
  }

  function waitingRoom(d){
    const me=d.me,selected=String(me?.clan_id||''),blocked=new Set((d.blocked_clan_ids||[]).map(String));
    const roleById=new Map((d.roles||[]).map(r=>[String(r.id),r]));
    const roomById=new Map((d.clans||[]).map(c=>[String(c.id),c]));
    const roomCards=(d.clans||[]).map(c=>{
      const mine=selected===String(c.id),isBlocked=blocked.has(String(c.id)),joinLocked=c.join_locked===true,full=Number(c.count||0)>=Number(d.session.max_clan_size||7);
      const leader=(c.members||[]).find(m=>String(m.student_id)===String(c.leader_id||''));
      const members=(c.members||[]).map(m=>`<div class="lobby-room-member ${m.is_leader?'leader':''}"><span>${esc(m.name)}${m.is_leader?' · Líder':''}</span><small>${esc(m.role_name||'Área ainda não definida')}</small></div>`).join('');
      let action='';
      if(d.session.status==='waiting_room'){
        if(mine) action='<button class="button ghost small" data-leave-clan type="button">Sair da sala</button>';
        else action=`<button class="button ${!full&&!isBlocked&&!joinLocked?'primary':'ghost'} small" data-join-clan="${c.id}" type="button" ${full||isBlocked||joinLocked?'disabled':''}>${isBlocked?'Removido desta sala':joinLocked?'Entradas fechadas':full?'Sala lotada':'Entrar na sala'}</button>`;
      }
      const assigned=(c.members||[]).filter(m=>m.role_id).length,readyCount=(c.members||[]).filter(m=>m.ready).length,accent=/^#[0-9A-Fa-f]{6}$/.test(String(c.accent_color||''))?c.accent_color:'#22d3ee';
      return `<article class="panel lobby-room-card ${mine?'selected':''}" data-room-theme="corporate" style="--guild-accent:${esc(accent)}"><div class="guild-card-identity">${guildMark(c)}<div><span class="room-number">${esc(c.name)}</span><strong>${esc(c.company_name||'Nome da empresa ainda não definido')}</strong><small>${assigned}/${Number(c.count||0)} cargos escolhidos</small></div>${mine?'<span class="status-pill good">Sua equipe</span>':''}</div><div class="guild-readiness"><span><b>${Number(c.count||0)}/${Number(d.session.max_clan_size||7)}</b> integrantes</span><span><b>${readyCount}/${Number(c.count||0)}</b> CONFIRMADO</span><span class="${leader?'ready':''}"><b>${leader?'✓':'○'}</b> líder</span></div><div class="room-leader-line">${leader?`Líder: <strong>${esc(leader.name)}</strong>`:'Líder: <strong>em votação</strong>'}</div><div class="lobby-room-members">${members||'<small class="muted">Sala vazia.</small>'}</div>${action}</article>`;
    }).join('');

    const roster=(d.lobby_roster||[]).map(p=>{
      const room=p.clan_id?roomById.get(String(p.clan_id)):null;
      return `<div class="lobby-student ${String(p.student_id)===String(me?.student_id)?'me':''}"><span class="presence-dot ${p.clan_id?'in-room':''}"></span><div><strong>${esc(p.name)} ${p.is_leader?'<span class="leader-badge">Líder</span>':''}</strong><small>${room?`${esc(room.name)}${p.role_name?` • ${esc(p.role_name)}`:''}`:'Aguardando sala'}</small></div></div>`;
    }).join('');
    const inRooms=(d.lobby_roster||[]).filter(x=>x.clan_id).length,total=(d.lobby_roster||[]).length,leaders=(d.clans||[]).filter(x=>x.leader_id).length;
    let ownRoom='';
    if(selected){
      const room=roomById.get(selected)||{},team=d.team||[],e=d.election||{},leaderId=String(room.leader_id||'');
      const candidates=team.map(m=>{
        const votes=Number(e.counts?.[String(m.student_id)]||0),chosen=String(e.my_vote||'')===String(m.student_id),isLeader=leaderId===String(m.student_id);
        return `<button class="leader-vote-card ${chosen?'selected':''} ${isLeader?'elected':''}" data-leader-vote="${m.student_id}" type="button" ${d.session.status!=='waiting_room'?'disabled':''}><span>${isLeader?'L':'V'}</span><div><strong>${esc(m.student?.full_name||'Aluno')}</strong><small>${votes} voto${votes===1?'':'s'}${chosen?' • seu voto':''}</small></div></button>`;
      }).join('');
      const electionStatus=leaderId?`<div class="notice good"><strong>${esc(d.leader?.name||'Líder')} é o líder da sala.</strong> Quórum atingido (${Number(e.total_votes||0)}/${Number(e.quorum||1)} votos mínimos). O líder organiza a equipe antes do início.</div>`:e.tied?`<div class="notice warn"><strong>Empate na votação.</strong> Quórum: ${Number(e.total_votes||0)}/${Number(e.quorum||1)}. Alterem os votos até existir uma pessoa mais votada.</div>`:`<div class="notice warn"><strong>Liderança ainda não confirmada.</strong> Quórum necessário: ${Number(e.total_votes||0)}/${Number(e.quorum||1)} votos. Cada integrante deve participar.</div>`;
      const taken=new Map(team.filter(m=>m.role_id).map(m=>[String(m.role_id),String(m.student_id)]));
      const assignments=team.map(m=>{
        const isSelf=String(m.student_id)===String(me?.student_id),isLeader=String(m.student_id)===leaderId,ready=!!m.role_id&&!!m.role_selected_at;
        return `<div class="leader-member-row"><div><strong>${esc(m.student?.full_name||'Aluno')}${isLeader?' · Líder':''} ${ready?'<span class="status-pill good">Cargo confirmado</span>':'<span class="status-pill warn">Escolha pendente</span>'}</strong><small>${isSelf?'Você • ':''}${esc(roleById.get(String(m.role_id||''))?.name||'Sem cargo escolhido')}</small></div>${me?.is_leader&&!isSelf&&d.session.status==='waiting_room'?`<button class="button ghost small" data-leader-kick="${m.student_id}" type="button">Solicitar troca</button>`:'<span></span>'}</div>`;
      }).join('');
      const rolePicker=`<section class="panel section-panel role-wait-card ${me?.role_selected_at?'role-ready':''}" style="--guild-accent:${esc(room.accent_color||'#22d3ee')}"><div class="section-head"><div><p class="eyebrow">Seu cargo</p><h3>${me?.role_id?esc(roleById.get(String(me.role_id))?.name||'Cargo escolhido'):'Escolha sua função na equipe'}</h3><p>Os cargos são exclusivos dentro da equipe. Escolha o que você quer assumir; a reserva é confirmada pelo servidor.</p></div>${me?.role_selected_at?'<span class="status-pill good">Pronto</span>':'<span class="status-pill warn">Pendente</span>'}</div><div class="role-grid">${(d.roles||[]).map(r=>{const holder=taken.get(String(r.id)),isMine=String(me?.role_id||'')===String(r.id),disabled=!!holder&&holder!==String(me?.student_id)||!['waiting_room','locked'].includes(d.session.status);return `<button class="role-card ${disabled?'taken':''} ${isMine?'selected':''}" data-select-role="${r.id}" type="button" ${disabled?'disabled':''}><span class="icon">${esc(r.icon)}</span><span><strong>${esc(r.name)}</strong><small>${holder&&!isMine?'Ocupado por outro integrante':isMine?'Seu cargo atual — toque em outro disponível para trocar':esc(r.description||'')}</small></span></button>`}).join('')}</div></section>`;
      const leaderPanel=me?.is_leader?`<section class="panel section-panel leader-console" style="--guild-accent:${esc(room.accent_color||'#22d3ee')}"><div class="section-head"><div><p class="eyebrow">Gestão da equipe</p><h2>Empresa e organização</h2><p>O líder organiza a identidade da empresa e acompanha os cargos escolhidos pelos próprios integrantes.</p></div><span class="status-pill good">Líder</span></div>${room.identity_locked?'<div class="notice warn"><strong>Identidade bloqueada pelo professor.</strong> Os dados permanecem somente para consulta.</div>':''}<form id="room-settings-form" class="room-settings-grid professional-company-form"><input type="hidden" name="name" value="${esc(room.name||'')}"><input type="hidden" name="theme_key" value="${esc(room.theme_key||'corporate')}"><input type="hidden" name="accent_color" value="${esc(room.accent_color||'#22d3ee')}"><input type="hidden" name="mascot_key" value="${esc(room.mascot_key||'robot')}"><label>Nome da empresa<input name="company_name" maxlength="80" value="${esc(room.company_name||'')}" placeholder="Nome definido pela equipe" ${room.identity_locked?'disabled':''}></label><label>CNPJ fictício<input name="company_cnpj" maxlength="24" value="${esc(room.company_cnpj||'')}" placeholder="00.000.000/0001-00" ${room.identity_locked?'disabled':''}></label><label>Cidade<input name="company_city" maxlength="80" value="${esc(room.company_city||'')}" placeholder="Paranaguá - PR" ${room.identity_locked?'disabled':''}></label><label>Telefone fictício<input name="company_phone" maxlength="30" value="${esc(room.company_phone||'')}" placeholder="(41) 99999-9999" ${room.identity_locked?'disabled':''}></label><div class="guild-emblem-editor"><div id="guild-emblem-preview">${guildMark(room,'large')}</div><label>Marca / emblema<input id="guild-emblem-input" type="file" accept="image/png,image/jpeg,image/webp" ${room.identity_locked?'disabled':''}><small>Opcional · PNG, JPEG ou WEBP · máximo 320 KB</small></label>${room.emblem_data_url&&!room.identity_locked?'<button class="button ghost small" data-remove-emblem type="button">Remover imagem</button>':''}</div><button class="button primary room-save" type="submit" ${d.session.status!=='waiting_room'||room.identity_locked?'disabled':''}>Salvar dados da empresa</button></form><div class="section-head compact-head"><div><p class="eyebrow">Cargos exclusivos</p><h3>Escolhas da equipe</h3><p>Cada integrante escolhe um cargo livre. O professor pode fazer ajustes manuais quando necessário.</p></div></div><div class="leader-member-list">${assignments}</div></section>`:'';
      const assignedCount=team.filter(member=>member.role_id).length,accent=/^#[0-9A-Fa-f]{6}$/.test(String(room.accent_color||''))?room.accent_color:'#22d3ee';
      ownRoom=`<section class="panel section-panel team-room-panel" data-room-theme="corporate" style="--guild-accent:${esc(accent)}"><div class="guild-room-hero">${guildMark(room,'hero')}<div><p class="eyebrow">Sua equipe</p><h2>${esc(room.name||'Sala')}</h2><p>${esc(room.company_name||'A equipe ainda pode criar o nome fictício da empresa.')}${room.company_city?` • ${esc(room.company_city)}`:''}</p><div class="guild-tags"><span>${team.length}/${Number(d.session.max_clan_size||7)} integrantes</span><span>${assignedCount}/${team.length} cargos escolhidos</span><span>${team.filter(x=>x.ready).length}/${team.length} prontos</span></div></div></div><div class="company-strip"><span><b>Empresa</b>${esc(room.company_name||'—')}</span><span><b>CNPJ fictício</b>${esc(room.company_cnpj||'—')}</span><span><b>Cidade</b>${esc(room.company_city||'—')}</span><span><b>Telefone</b>${esc(room.company_phone||'—')}</span></div><div class="section-head compact-head"><div><p class="eyebrow">Votação</p><h3>Escolha do líder da equipe</h3><p>Uma pessoa por integrante. O candidato com maior número de votos assume a liderança. Em empate, não há líder até o desempate.</p></div></div><div class="leader-vote-grid">${candidates}</div>${electionStatus}</section>${rolePicker}${leaderPanel}`;
    }
    const teamRanks=(d.rankings?.teams||[]).map(x=>`<div class="rank-row ${String(x.clan_id)===selected?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${Number(x.progress_percent||0)}% concluído</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const studentRanks=(d.rankings?.students||[]).slice(0,12).map(x=>`<div class="rank-row ${String(x.student_id)===String(me?.student_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.clan_name)} • ${esc(d.roles.find(r=>r.role_key===x.role_key)?.name||x.role_key||'')}</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const myRoom=selected?roomById.get(selected):null,myTeam=d.team||[],rolesReady=!!selected&&myTeam.length>0&&myTeam.every(member=>member.role_id&&member.role_selected_at),identityReady=!!myRoom?.company_name&&!!myRoom?.name;
    const steps=[['1','Entrar no lobby',true],['2','Escolher equipe',!!selected],['3','Definir liderança',!!myRoom?.leader_id],['4','Escolher cargos',rolesReady&&identityReady],['5','Aguardar professor',d.session.status==='locked'||d.session.status==='running']];
    return `<section class="evaluation-status-strip"><div><i></i><span>LOBBY DA AVALIAÇÃO</span><strong>${inRooms}/${total||0} alunos em equipes</strong></div><div><span>SESSÃO</span><strong>SINCRONIZADA</strong></div><div><span>DISCIPLINA</span><strong>${esc(d.session.subject_name||'Prova coletiva')}</strong></div><div><span>STATUS DA EQUIPE</span><strong>${selected?'EQUIPE DEFINIDA':'AGUARDANDO EQUIPE'}</strong></div></section><section class="lobby-journey" aria-label="Etapas do pré-lobby">${steps.map(([number,label,done],index)=>`<div class="${done?'done':''} ${!done&&steps.slice(0,index).every(step=>step[2])?'current':''}"><span>${done?'✓':number}</span><small>${label}</small></div>`).join('')}</section><section class="panel lobby-master"><div class="section-head"><div><p class="eyebrow">Organização • ${Number(d.session.lobby_duration_minutes||15)} min</p><h2>Formação das equipes</h2><p>Veja a turma, escolha uma equipe e organize liderança e empresa; cada integrante escolhe o próprio cargo. Depois do início, a composição fica bloqueada.</p></div><div id="lobby-timer" class="timer"><span>Organização</span><strong>${Number(d.session.lobby_remaining_seconds||0)>0?fmtTime(d.session.lobby_remaining_seconds):'Aguardando professor'}</strong></div></div><div class="lobby-kpis"><div><strong>${total}</strong><small>alunos da turma</small></div><div><strong>${inRooms}</strong><small>em equipes</small></div><div><strong>${Math.max(0,total-inRooms)}</strong><small>aguardando equipe</small></div><div><strong>${leaders}</strong><small>lideranças definidas</small></div></div><div class="lobby-main-grid"><div><div class="lobby-section-title"><div><h3>Equipes disponíveis</h3><small>De ${Number(d.session.min_clan_size||3)} a ${Number(d.session.max_clan_size||7)} integrantes por equipe</small></div></div><div class="lobby-room-grid">${roomCards}</div></div><aside><h3>Alunos da turma</h3><div class="lobby-roster">${roster}</div></aside></div></section>${ownRoom}<details class="panel section-panel ranking-panel"><summary><strong>🏆 Ranking geral</strong><span>equipes + alunos</span></summary><div class="ranking-tabs"><h4>Ranking das equipes</h4><div class="rank-list">${teamRanks||'<small class="muted">O ranking começa quando houver XP.</small>'}</div><h4>Ranking individual geral</h4><div class="rank-list">${studentRanks||'<small class="muted">O ranking começa quando houver XP.</small>'}</div></div></details>${d.session.status==='locked'?'<div class="notice warn"><strong>Composição das equipes bloqueada pelo professor.</strong> Os cargos ainda podem ser escolhidos/trocados até o início.</div>':''}`;
  }

  function itemHtml(c,item){return `<button class="drag-item" draggable="true" type="button" data-drag-item data-challenge-id="${c.id}" data-item-id="${esc(item.id)}"><span class="drag-grip">⋮⋮</span><span>${esc(item.label)}</span></button>`;}
  function answerField(c){
    const saved=c.submission?.answer||readDraft(c)||{};
    if(c.challenge_type==='quiz_single')return `<div class="challenge-form">${(c.public_config?.options||[]).map(o=>`<label class="option"><input type="radio" name="choice-${c.id}" value="${esc(o.id)}" data-answer-choice="${c.id}" ${String(saved.choice||'')===String(o.id)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(c.challenge_type==='quiz_multi')return `<div class="challenge-form"><small class="muted">Pode haver mais de uma alternativa correta.</small>${(c.public_config?.options||[]).map(o=>`<label class="option"><input type="checkbox" value="${esc(o.id)}" data-answer-multi="${c.id}" ${(saved.choices||[]).map(String).includes(String(o.id))?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(['drag_match','drag_classify'].includes(c.challenge_type)){
      const items=c.public_config?.items||[],targets=c.public_config?.targets||[],matches=saved.matches&&typeof saved.matches==='object'?saved.matches:{};
      const unused=items.filter(i=>!matches[String(i.id)]);
      return `<div class="drag-board" data-drag-board="${c.id}"><div class="drop-zone source-zone" data-drop-zone data-challenge-id="${c.id}" data-target-id=""><strong>Itens disponíveis</strong><small>Arraste ou toque em um cartão e depois no destino.</small><div class="drop-zone-items">${unused.map(i=>itemHtml(c,i)).join('')}</div></div><div class="target-grid">${targets.map(t=>`<div class="drop-zone" data-drop-zone data-challenge-id="${c.id}" data-target-id="${esc(t.id)}"><strong>${esc(t.label)}</strong><div class="drop-zone-items">${items.filter(i=>String(matches[String(i.id)]||'')===String(t.id)).map(i=>itemHtml(c,i)).join('')}</div></div>`).join('')}</div></div>`;
    }
    if(c.challenge_type==='drag_order'){
      const items=c.public_config?.items||[],savedOrder=Array.isArray(saved.order)?saved.order.map(String):[],map=new Map(items.map(i=>[String(i.id),i])),ordered=[...savedOrder.filter(x=>map.has(x)).map(x=>map.get(x)),...items.filter(i=>!savedOrder.includes(String(i.id)))];
      return `<div class="order-list" data-order-list="${c.id}">${ordered.map((i,idx)=>`<div class="order-item" draggable="true" data-order-item data-challenge-id="${c.id}" data-item-id="${esc(i.id)}"><span class="order-number">${idx+1}</span><span class="order-label">${esc(i.label)}</span><div class="order-actions"><button type="button" class="mini-move" data-order-up aria-label="Mover para cima">↑</button><button type="button" class="mini-move" data-order-down aria-label="Mover para baixo">↓</button></div></div>`).join('')}</div>`;
    }
    const val=String(saved.text||'');return `<textarea class="${c.challenge_type==='code_text'?'code-input':''}" data-answer-text="${c.id}" placeholder="${esc(c.public_config?.placeholder||'Digite sua resposta...')}">${esc(val)}</textarea>`;
  }
  function challengeGuide(c){
    const pc=c.public_config||{};
    return `<div class="scenario-box"><span>Situação-problema</span><p>${esc(c.prompt)}</p></div><div class="challenge-guide"><div><span>O que você deve fazer</span><p>${esc(pc.instructions||'Resolva a atividade conforme o enunciado e envie a resposta da sua função.')}</p></div><div><span>Como a equipe participa</span><p>${esc(pc.team_help||'A equipe pode discutir e ajudar, mas somente a função responsável envia a atividade individual.')}</p></div>${pc.time_hint?`<div class="time-hint"><span>Tempo sugerido</span><strong>${esc(pc.time_hint)}</strong></div>`:''}</div>`;
  }
  function answerPreview(c,a={}){
    const pc=c.public_config||{};
    if(c.challenge_type==='quiz_single')return pc.options?.find(o=>String(o.id)===String(a.choice))?.label||'Resposta enviada';
    if(c.challenge_type==='quiz_multi')return (a.choices||[]).map(x=>pc.options?.find(o=>String(o.id)===String(x))?.label||x).join('\n• ');
    if(['drag_match','drag_classify'].includes(c.challenge_type)){
      const im=new Map((pc.items||[]).map(x=>[String(x.id),x.label])),tm=new Map((pc.targets||[]).map(x=>[String(x.id),x.label]));
      return Object.entries(a.matches||{}).map(([i,t])=>`${im.get(String(i))||i} → ${tm.get(String(t))||t}`).join('\n');
    }
    if(c.challenge_type==='drag_order'){
      const im=new Map((pc.items||[]).map(x=>[String(x.id),x.label]));return (a.order||[]).map((x,i)=>`${i+1}. ${im.get(String(x))||x}`).join('\n');
    }
    return String(a.text||'Resposta enviada');
  }
  function collectAnswer(c){
    const id=String(c.id);
    if(c.challenge_type==='quiz_single'){const checked=document.querySelector(`input[name="choice-${CSS.escape(id)}"]:checked`);return {choice:checked?.value||''};}
    if(c.challenge_type==='quiz_multi')return {choices:[...document.querySelectorAll(`[data-answer-multi="${CSS.escape(id)}"]:checked`)].map(x=>x.value)};
    if(['drag_match','drag_classify'].includes(c.challenge_type)){
      const matches={};document.querySelectorAll(`[data-drop-zone][data-challenge-id="${CSS.escape(id)}"]`).forEach(z=>{const target=z.dataset.targetId||'';if(!target)return;z.querySelectorAll('[data-drag-item]').forEach(it=>matches[String(it.dataset.itemId)]=target);});return {matches};
    }
    if(c.challenge_type==='drag_order')return {order:[...document.querySelectorAll(`[data-order-list="${CSS.escape(id)}"] [data-order-item]`)].map(x=>String(x.dataset.itemId))};
    const el=document.querySelector(`[data-answer-text="${CSS.escape(id)}"]`);return {text:String(el?.value||'')};
  }
  function saveInteractive(c){if(c&&!c.team_submitted)queueServerDraft(c,collectAnswer(c));}

  function challengesView(d){
    const phases=[...new Set(d.challenges.map(c=>Number(c.phase_no||1)))].sort((a,b)=>a-b);
    const roleName=d.roles.find(r=>String(r.id)===String(d.me?.role_id||''))?.name||'Área não definida';
    const list=phases.map(p=>`<div class="phase-title"><span>${p}</span><strong>Fase ${p}</strong></div>${d.challenges.filter(c=>Number(c.phase_no||1)===p).map(c=>{
      const mine=c.can_submit||c.can_edit_draft,done=c.team_submitted,locked=c.locked,myRoleKey=d.roles.find(r=>String(r.id)===String(d.me?.role_id||''))?.role_key,isMyRole=c.scope==='individual'&&c.role_key===myRoleKey,isTeam=c.scope==='clan',category=isMyRole?'mine':isTeam?'team':'equipe',role=c.scope==='clan'?'Equipe — líder envia':d.roles.find(r=>r.role_key===c.role_key)?.name||c.role_key||'—';
      const draft=!!c.submission?.draft;
      const submitted=!!c.submission&&!draft;
      const validation=c.public_config?.teacher_validation&&submitted?'<div class="notice warn"><strong>Aguardando validação do professor.</strong><br>O link foi registrado; a pontuação de qualidade será definida após a avaliação do protótipo.</div>':'';
      const body=submitted
        ? `<div class="answer-preview">${esc(answerPreview(c,c.submission.answer||{}))}</div>${validation}${c.submission.feedback?`<div class="notice">Feedback: ${esc(c.submission.feedback)}</div>`:''}<div class="notice good">Entrega registrada no servidor. Somente o professor pode reabrir esta atividade.</div>`
        : mine&&!locked
          ? `${answerField(c)}<div class="challenge-form"><div class="draft-row"><span class="draft-state ${draft?'good':''}" data-draft-state="${c.id}">${draft?'Rascunho recuperado do servidor':'Rascunho com salvamento automático'}</span></div>${c.can_submit?`<button class="button primary" data-submit-challenge="${c.id}" type="button">Enviar atividade</button>`:'<div class="notice warn">A prova está pausada. Você pode revisar o rascunho, mas o envio definitivo fica bloqueado até a retomada.</div>'}<p class="message" data-submit-message="${c.id}"></p><small class="muted">O rascunho é salvo no servidor. O envio definitivo é único; XP e correção são calculados no backend.</small></div>`
          : locked?(c.equipe_gate?`<div class="notice warn equipe-gate"><strong>🔒 ATIVIDADE FINAL BLOQUEADA</strong><br>A equipe precisa concluir as atividades das funções ocupadas. Progresso: ${Number(c.equipe_gate.completed||0)}/${Number(c.equipe_gate.required||0)} • pendentes ${Number(c.equipe_gate.pending||0)}.</div>`:'<div class="notice warn">Conclua a etapa anterior para liberar esta atividade.</div>'):'<div class="notice">Você pode ajudar a equipe a pensar, mas somente a função responsável — ou o líder nas atividades coletivas — pode enviar.</div>';
      return `<article class="challenge-card ${locked?'locked':''} ${done?'done':''}" data-category="${category}" data-challenge-card="${c.id}"><div class="challenge-head"><div><h3>${esc(c.title)}</h3><div class="challenge-meta"><span class="status-pill">${esc(role)}</span><span class="status-pill">${Number(c.points||0).toLocaleString('pt-BR')} pts</span><span class="status-pill live">até ${Number(c.xp_max||0)} XP</span>${done?'<span class="status-pill good">Entregue</span>':draft?'<span class="status-pill warn">Rascunho</span>':locked?'<span class="status-pill warn">Aguardando</span>':mine?'<span class="status-pill live">Sua atividade</span>':'<span class="status-pill">Área de colega</span>'}</div></div></div>${challengeGuide(c)}${body}</article>`;
    }).join('')}`).join('');
    const myXp=d.xp?.individual||{},teamXp=d.xp?.team||{};
    const leaderId=String(d.leader?.student_id||'');
    const teamMembers=[...(d.team||[])].sort((a,b)=>Number(b.progress?.xp_earned||0)-Number(a.progress?.xp_earned||0)||Number(b.progress?.progress_percent||0)-Number(a.progress?.progress_percent||0)).map((m,i)=>{const r=d.roles.find(x=>String(x.id)===String(m.role_id));const pr=m.progress||{};return `<div class="team-progress-card"><div class="team-progress-head"><div><strong><span class="room-rank-pos">${i+1}º</span> ${esc(m.student?.full_name||'Aluno')} ${String(m.student_id)===leaderId?'<span class="leader-badge">Líder</span>':''}</strong><small>${esc(r?.name||'Área não escolhida')}</small></div><strong>${Number(pr.xp_earned||0)} XP</strong></div><progress class="progress" max="100" value="${Number(pr.progress_percent||0)}"></progress><small class="muted">${Number(pr.progress_percent||0)}% • ${Number(pr.completed_count||0)}/${Number(pr.total_count||0)} desafios • ${Number(pr.xp_earned||0)}/${Number(pr.xp_max||0)} XP ${pr.online?'• online':''}</small></div>`}).join('');
    const teams=(d.rankings?.teams||[]).map(x=>`<div class="rank-row ${String(x.clan_id)===String(d.me?.clan_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${Number(x.progress_percent||0)}% concluído</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const students=(d.rankings?.students||[]).map(x=>`<div class="rank-row ${String(x.student_id)===String(d.me?.student_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.clan_name)} • ${esc(d.roles.find(r=>r.role_key===x.role_key)?.name||x.role_key||'')}</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const myTeamRank=(d.rankings?.teams||[]).find(x=>String(x.clan_id)===String(d.me?.clan_id));
    const myStudentRank=(d.rankings?.students||[]).find(x=>String(x.student_id)===String(d.me?.student_id));
    const mobileDock=`<section class="mobile-performance-dock" aria-label="Resumo do desempenho"><div><span>Seu XP</span><strong>${Number(myXp.earned||0)}/${Number(myXp.max||0)}</strong></div><div><span>Equipe</span><strong>${Number(d.team_progress?.progress_percent||0)}%</strong></div><div><span>Rank aluno</span><strong>${myStudentRank?.position?`${myStudentRank.position}º`:'—'}</strong></div><div><span>Rank equipe</span><strong>${myTeamRank?.position?`${myTeamRank.position}º`:'—'}</strong></div></section>`;
    const filter=st.challengeFilter||'all';return `${mobileDock}<div class="layout2"><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Atividades por etapa</p><h2>Atividades por etapas</h2><p>Cada integrante responde por sua função; a atividade final é liberada quando as funções ocupadas concluírem as entregas necessárias.</p></div></div><div class="mission-filter-bar"><button class="button small ${filter==='mine'?'primary':'ghost'}" data-challenge-filter="mine" type="button">Minha função + equipe</button><button class="button small ${filter==='all'?'primary':'ghost'}" data-challenge-filter="all" type="button">Visão completa</button></div><div class="notice handoff-notice"><strong>INTEGRAÇÃO ENTRE FUNÇÕES</strong> • Análise orienta requisitos; Design entrega referência ao Front-end; Banco apoia Back-end; QA testa as decisões; Cyber revisa riscos; Negócios conecta tudo ao objetivo do produto.</div><div class="challenge-list" data-filter="${filter}">${list}</div></section><aside class="content-grid sticky-side">
      <section class="panel section-panel"><p class="eyebrow">Sua área</p><h3>${esc(roleName)}</h3><p class="muted">${esc(d.roles.find(r=>String(r.id)===String(d.me?.role_id||''))?.description||'')}</p><div class="xp-summary"><div><span>Seu XP</span><strong>${Number(myXp.earned||0)} <small>/ ${Number(myXp.max||0)}</small></strong></div><div><span>Progresso XP</span><strong>${Number(myXp.percent||0)}%</strong></div></div></section>
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Sua equipe</p><h3>${esc(d.clans.find(c=>String(c.id)===String(d.me?.clan_id||''))?.name||'Sem equipe')}</h3><p>${esc(d.clans.find(c=>String(c.id)===String(d.me?.clan_id||''))?.company_name||'Equipe da equipe')} • Líder: <strong>${esc(d.leader?.name||'—')}</strong></p></div><span class="status-pill ${Number(d.team_progress?.progress_percent||0)>=100?'good':'live'}">${Number(d.team_progress?.progress_percent||0)}%</span></div><div class="progress-wrap"><progress class="progress" max="100" value="${Number(d.team_progress?.progress_percent||0)}"></progress><small class="muted">Progresso coletivo das áreas escolhidas.</small></div><div class="xp-team"><span>XP normalizado da equipe</span><strong>${Number(teamXp.ranking_xp||0)} <small>/ 1000</small></strong></div><h4 class="room-ranking-title">Ranking da sua sala</h4><div class="team-progress-list">${teamMembers}</div></section>
      <details class="panel section-panel ranking-panel"><summary><strong>Ver ranking geral da turma</strong><span>Equipes + alunos</span></summary><div class="ranking-tabs"><h4>Equipes</h4><div class="rank-list">${teams||'<small class="muted">Ranking ainda sem dados.</small>'}</div><h4>Alunos</h4><div class="rank-list">${students||'<small class="muted">Ranking ainda sem dados.</small>'}</div></div></details>
      <section class="notice">Nota final = <strong>50% desempenho da equipe + 50% desempenho individual</strong>. XP é usado para progresso/ranking e é calculado exclusivamente pelo servidor.</section>
    </aside></div>`;
  }

  function gameHud(d){
    const room=(d.clans||[]).find(c=>String(c.id)===String(d.me?.clan_id||'')),role=(d.roles||[]).find(r=>String(r.id)===String(d.me?.role_id||''));
    if(!room)return '';
    const phase=d.session.status==='waiting_room'?'LOBBY':d.session.status==='locked'?'EQUIPES TRAVADAS':d.session.status==='paused'?'PAUSA TÁTICA':d.session.status==='running'?'MISSÃO ATIVA':'PARTIDA';
    return `<section class="game-hud" style="--guild-accent:${esc(room.accent_color||'#22d3ee')}"><div class="hud-guild">${guildMark(room)}<span><small>${esc(phase)}</small><strong>${esc(room.company_name||room.name||'Equipe')}</strong></span></div><div class="hud-stat"><small>Função</small><strong>${esc(role?.icon||'🎮')} ${esc(role?.name||'Aguardando líder')}</strong></div><div class="hud-stat"><small>Liderança</small><strong>${esc(d.leader?.name||'Em votação')}</strong></div><div class="hud-stat"><small>XP</small><strong>${Number(d.xp?.individual?.earned||0)}</strong></div><button class="button hud-chat" data-open-team-chat type="button">💬 Chat da equipe</button></section>`;
  }
  function ensureTeamChatRoot(){let root=document.getElementById('team-chat-root');if(!root){root=document.createElement('div');root.id='team-chat-root';document.body.appendChild(root)}return root}
  function roleForStudent(studentId){const member=(st.detail?.team||[]).find(x=>String(x.student_id)===String(studentId));return (st.detail?.roles||[]).find(r=>String(r.id)===String(member?.role_id||''))}
  async function loadTeamChat(force=false){
    if(!st.chat.open||!st.sessionId)return;
    const out=await api('team_chat_list',{session_id:st.sessionId});
    const host=document.getElementById('team-chat-messages');if(!host)return;
    const html=(out.messages||[]).map(m=>{const mine=String(m.sender_id)===String(st.profile?.id),role=roleForStudent(m.sender_id);return `<article class="team-chat-msg ${mine?'mine':''}"><header><strong>${mine?'Você':esc(m.sender_name||'Integrante')}</strong><span>${esc(role?.icon||'🎮')} ${esc(role?.name||'Equipe')} • ${new Date(m.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span></header><p>${esc(m.message)}</p></article>`}).join('')||'<p class="muted">O canal ainda está silencioso. Use-o para coordenar tarefas, não para compartilhar dados pessoais.</p>';
    if(force||html!==st.chat.lastHtml){host.innerHTML=html;host.scrollTop=host.scrollHeight;st.chat.lastHtml=html;}
  }
  async function openTeamChat(){
    if(!st.detail?.me?.clan_id)return;
    st.chat.open=true;const room=(st.detail.clans||[]).find(c=>String(c.id)===String(st.detail.me.clan_id)),root=ensureTeamChatRoot();
    root.innerHTML=`<div class="team-chat-backdrop"><aside class="team-chat-panel panel" style="--guild-accent:${esc(room?.accent_color||'#22d3ee')}"><header class="team-chat-head">${guildMark(room)}<div><p class="eyebrow">Canal da equipe</p><h2>${esc(room?.company_name||room?.name||'Equipe')}</h2><small>Chat visível somente para integrantes da equipe e auditável pela equipe docente.</small></div><button class="button ghost small" data-close-team-chat type="button">Fechar</button></header><div id="team-chat-messages" class="team-chat-messages" aria-live="polite"></div><form id="team-chat-form" class="team-chat-compose"><textarea id="team-chat-text" maxlength="500" rows="2" placeholder="Coordene a atividade com sua equipe…"></textarea><button class="button primary" type="submit">Enviar</button></form><p class="team-chat-rule">Canal da equipe: foco em estratégia, divisão de tarefas, dúvidas e andamento das atividades.</p></aside></div>`;
    root.querySelector('[data-close-team-chat]').onclick=closeTeamChat;
    root.querySelector('#team-chat-form').onsubmit=sendTeamChat;
    await loadTeamChat(true);clearInterval(st.chat.poll);st.chat.poll=setInterval(()=>loadTeamChat(false).catch(()=>{}),2500);
  }
  function closeTeamChat(){st.chat.open=false;clearInterval(st.chat.poll);st.chat.poll=null;st.chat.lastHtml='';const root=document.getElementById('team-chat-root');if(root)root.innerHTML=''}
  async function sendTeamChat(e){e.preventDefault();const ta=document.getElementById('team-chat-text'),text=String(ta?.value||'').trim();if(!text)return;const btn=e.submitter||e.target.querySelector('button');btn.disabled=true;try{await api('team_chat_send',{session_id:st.sessionId,message:text});ta.value='';await loadTeamChat(true)}catch(err){alert(String(err?.data?.error||err?.message||'Não foi possível enviar a mensagem.').replaceAll('_',' '))}finally{btn.disabled=false}}
  function reducedMotion(){return !!(st.accommodation?.reduce_motion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);}
  function startMatchmakingSequence(session={}){
    if(!['waiting_room','locked','running','paused'].includes(String(session.status||'')))return null;
    document.querySelector('.session-transition')?.remove();const host=document.createElement('div'),fast=reducedMotion();host.className='session-transition';host.setAttribute('role','status');host.setAttribute('aria-live','polite');host.innerHTML=`<article><span>PROVA PRÁTICA</span><h1>Carregando sua sessão</h1><p>Sincronizando equipe, função e atividades...</p><progress max="100" value="35"></progress></article>`;document.body.appendChild(host);requestAnimationFrame(()=>host.classList.add('show'));
    return {async complete(detail){if(!host.isConnected)return;const room=(detail?.clans||[]).find(c=>String(c.id)===String(detail?.me?.clan_id||''));host.querySelector('h1').textContent=detail?.session?.status==='running'?'Avaliação em andamento':'Lobby pronto';host.querySelector('p').textContent=room?`${room.company_name||room.name||'Sua equipe'} sincronizada.`:'Sessão sincronizada. Escolha sua equipe.';host.querySelector('progress').value=100;await new Promise(r=>setTimeout(r,fast?120:520));host.classList.add('leave');setTimeout(()=>host.remove(),220);},fail(){if(!host.isConnected)return;host.querySelector('h1').textContent='Não foi possível sincronizar';host.querySelector('p').textContent='Tente novamente em alguns instantes.';host.classList.add('failed');setTimeout(()=>host.remove(),fast?350:1200);}};
  }
  function showMatchIntro(d){
    if(!d||d.session.status!=='running'||st.introSession===String(d.session.id))return;st.introSession=String(d.session.id);const room=(d.clans||[]).find(c=>String(c.id)===String(d.me?.clan_id||'')),host=document.createElement('div');host.className='session-start-notice';host.innerHTML=`<div>${guildMark(room)}<span><small>AVALIAÇÃO INICIADA</small><strong>${esc(room?.company_name||room?.name||'Sua equipe')}</strong></span></div>`;document.body.appendChild(host);requestAnimationFrame(()=>host.classList.add('show'));setTimeout(()=>host.classList.add('leave'),1200);setTimeout(()=>host.remove(),1500);
  }

  function resultView(d){
    if(d.session.status==='published'&&d.score){return `<section class="panel score-card"><p class="eyebrow">Resultado publicado</p><h2>${esc(d.session.title)}</h2><div class="big-score">${Number(d.score.final_score||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:2})}<small> / ${Number(d.session.max_score||0).toLocaleString('pt-BR')}</small></div><div class="score-breakdown"><div><span>Desempenho da equipe</span><strong>${Number(d.score.group_raw_score||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}</strong></div><div><span>Sua área</span><strong>${Number(d.score.individual_raw_score||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}</strong></div><div><span>XP individual</span><strong>${Number(d.score.xp_earned||0)} / ${Number(d.score.xp_max||0)}</strong></div></div><p class="muted">A nota foi publicada pelo professor. XP e ranking permanecem separados da nota acadêmica.</p></section>`;}
    const text=d.session.status==='score_scheduled'?`Sua nota já foi preparada e está programada para publicação em ${fmtDate(d.session.score_publish_at)}.`:d.session.status==='grading'?'A equipe docente está corrigindo as respostas.':'A prova foi encerrada. Aguarde a correção e a publicação do resultado.';return `<section class="panel empty-card"><p class="eyebrow">Avaliação concluída</p><h2>Respostas registradas</h2><p>${esc(text)}</p><button class="button ghost" data-back-sessions type="button">Voltar às avaliações</button></section>`;
  }

  function renderDetail(){
    const d=st.detail,host=$('exam-content');if(!d)return renderSessions();syncAvatarExamContext(d);const [label,kind]=statusInfo(d.session.status);
    const myRoom=(d.clans||[]).find(c=>String(c.id)===String(d.me?.clan_id||''));document.documentElement.dataset.examTheme='corporate';
    host.innerHTML=`<section class="panel exam-hero multiplayer-hero"><div><p class="eyebrow">PROVA PRÁTICA EM EQUIPE • ${esc(d.session.subject_name)}</p><h1>${esc(d.session.title)}</h1><p>${esc(d.session.description||'')}</p><div class="session-meta"><span class="status-pill ${kind}">${esc(label)}</span><span class="status-pill">${Number(d.session.max_score||0).toLocaleString('pt-BR')} pontos</span><span class="status-pill">equipe de ${Number(d.session.min_clan_size||3)}–${Number(d.session.max_clan_size||7)}</span><span class="status-pill good">ENCERRAMENTO PELO PROFESSOR</span></div></div>${['running','paused'].includes(d.session.status)?`<div id="exam-timer" class="timer operation-clock"><span>Tempo de atividade</span><strong>${fmtTime(d.session.elapsed_seconds||0)}</strong><small>sem encerramento automático</small></div>`:''}</section>${d.session.home_continuation_enabled?'<div class="notice good home-operation-banner"><strong>🏠 CONTINUAÇÃO EM CASA LIBERADA</strong><br>Seu progresso está salvo no servidor. Continue com sua equipe; a avaliação só termina quando o professor encerrar.</div>':''}${gameHud(d)}<div class="control-bar"><button class="button ghost small" data-back-sessions type="button">← Sair da sala</button></div>${['waiting_room','locked'].includes(d.session.status)?waitingRoom(d):d.session.status==='running'?challengesView(d):d.session.status==='paused'?`<div class="notice warn"><strong>⏸ Bloqueio temporário ativado pelo professor.</strong><br>Os envios definitivos ficam bloqueados até a retomada.</div>${challengesView(d)}`:resultView(d)}`;
    st.accommodation=d.accommodation||st.accommodation||{};applyAccommodation(st.accommodation);const supervised=['waiting_room','locked','running','paused'].includes(d.session.status)&&!st.accommodation?.fullscreen_optional;document.body.classList.toggle('collective-match-active',['waiting_room','locked','running','paused'].includes(d.session.status));window.AGVFullscreen?.require(supervised);if(supervised)window.AGVFullscreen?.request?.({silent:true}).catch?.(()=>{});startTimers();
  }

  function startTimers(){
    clearInterval(st.timer);clearInterval(st.lobbyTimer);
    if(!st.detail)return;
    if(st.detail.session.status==='waiting_room'){
      let remaining=Number(st.detail.session.lobby_remaining_seconds||0);
      st.lobbyTimer=setInterval(()=>{remaining=Math.max(0,remaining-1);const el=$('lobby-timer');if(el){el.classList.toggle('danger',remaining<=60);const strong=el.querySelector('strong');if(strong)strong.textContent=fmtTime(remaining);}if(remaining<=0){clearInterval(st.lobbyTimer);setTimeout(refreshDetail,1200);}},1000);
    }
    if(!['running','paused'].includes(st.detail.session.status))return;
    let elapsedSeconds=Number(st.detail.session.elapsed_seconds||0);const paused=st.detail.session.status==='paused';
    st.timer=setInterval(()=>{if(!paused)elapsedSeconds+=1;const el=$('exam-timer');if(el){const strong=el.querySelector('strong');if(strong)strong.textContent=fmtTime(elapsedSeconds);}},1000);
  }

  async function loadSessions(){setConnection('Sincronizando');const out=await api('student_state');st.sessions=out.sessions||[];st.accommodation=out.accommodation||{};applyAccommodation(st.accommodation);setConnection('Online','good');renderSessions();}
  async function refreshDetail(){
    if(!st.sessionId||st.busy)return;
    const active=document.activeElement;
    const editing=!!(active&&$('exam-content')?.contains(active)&&['INPUT','TEXTAREA','SELECT'].includes(active.tagName));
    const pendingDraft=[...st.draftTimers.values()].some(Boolean);
    if(editing||pendingDraft||st.emblemDraft!==null)return;
    try{const out=await api('student_state',{session_id:st.sessionId});const prev=st.lastStatus||st.detail?.session?.status;st.detail=out;st.accommodation=out.accommodation||st.accommodation||{};st.lastStatus=out.session?.status;setConnection('Online','good');renderDetail();if(prev!==out.session?.status&&out.session?.status==='running')showMatchIntro(out);}catch(e){console.error(e);setConnection('Falha de sincronização','danger');}
  }
  async function openSession(id){st.sessionId=String(id);const listed=st.sessions.find(s=>String(s.id)===String(id)),transition=startMatchmakingSequence(listed||{});if(['waiting_room','locked','running','paused'].includes(listed?.status)&&!st.accommodation?.fullscreen_optional){window.AGVFullscreen?.require(true);try{await window.AGVFullscreen?.request?.({silent:false});}catch{}}try{const out=await api('student_state',{session_id:st.sessionId});st.detail=out;st.accommodation=out.accommodation||st.accommodation||{};applyAccommodation(st.accommodation);await transition?.complete(out);st.lastStatus=out.session?.status;renderDetail();if(out.session?.status==='running')showMatchIntro(out);restartLiveLoops();}catch(err){transition?.fail();throw err;}}
  function restartLiveLoops(){clearInterval(st.poll);clearInterval(st.heartbeat);st.poll=setInterval(()=>{if(!document.hidden)refreshDetail();},7000);st.heartbeat=setInterval(()=>{if(st.sessionId)api('heartbeat',{session_id:st.sessionId}).catch(()=>{});},20000);if(st.sessionId)api('heartbeat',{session_id:st.sessionId}).catch(()=>{});}
  function stopLive(){clearInterval(st.poll);clearInterval(st.heartbeat);clearInterval(st.timer);clearInterval(st.lobbyTimer);for(const x of st.draftTimers.values())clearTimeout(x);st.draftTimers.clear();st.poll=st.heartbeat=st.timer=st.lobbyTimer=null;st.lastStatus=null;st.introSession=null;closeTeamChat();document.body.classList.remove('collective-match-active');window.AGVFullscreen?.require(false);}
  function friendlyActionError(e){
    const code=String(e?.data?.error||e?.message||'').trim();
    const map={
      role_taken:'Esse cargo acabou de ser escolhido por outro integrante. Escolha outro cargo disponível.',
      role_selection_closed:'A escolha de cargos foi encerrada porque a prova já começou.',
      join_room_first:'Entre em uma equipe antes de escolher seu cargo.',
      clan_join_locked:'O professor fechou novas entradas nesta equipe.',
      clan_full:'Esta equipe já atingiu o número máximo de integrantes.',
      blocked_from_clan:'Sua entrada nesta equipe está bloqueada. Fale com o professor para fazer um ajuste.',
      waiting_room_closed:'A formação das equipes já foi encerrada pelo professor.',
      clan_switch_disabled:'A troca de equipe está bloqueada nesta sessão.',
      team_identity_locked_by_teacher:'O professor bloqueou temporariamente alterações no nome e nos dados da empresa.',
      role_self_selection_required:'Cada integrante deve escolher o próprio cargo.',
    };
    return map[code]||code.replaceAll('_',' ')||'Não foi possível concluir a ação.';
  }
  async function doAction(fn){if(st.busy)return;st.busy=true;try{await fn();await refreshDetail();}catch(e){console.error(e);alert(friendlyActionError(e));}finally{st.busy=false;}}
  function challengeById(id){return st.detail?.challenges?.find(c=>String(c.id)===String(id));}
  async function submitChallenge(id){
    const c=challengeById(id);if(!c||(c.submission&&!c.submission.draft))return;
    const answer=collectAnswer(c);
    if(!confirm('Confirmar envio? Esta missão possui tentativa única e só poderá ser reaberta pelo professor.'))return;
    const m=document.querySelector(`[data-submit-message="${CSS.escape(String(id))}"]`);if(m)m.textContent='Enviando…';st.busy=true;
    try{await api('submit',{session_id:st.sessionId,challenge_id:id,answer});clearDraft(c);await refreshDetail();}
    catch(e){console.error(e);if(m){m.textContent=String(e?.data?.error||e?.message||'Erro ao enviar').replaceAll('_',' ');m.classList.add('error');}}
    finally{st.busy=false;}
  }

  $('exam-content').addEventListener('click',e=>{
    const t=e.target.closest('[data-open-session],[data-back-sessions],[data-join-clan],[data-leave-clan],[data-leader-vote],[data-leader-kick],[data-select-role],[data-challenge-filter],[data-remove-emblem],[data-submit-challenge],[data-open-team-chat]');if(!t)return;
    if(t.dataset.openSession)return openSession(t.dataset.openSession).catch(console.error);if(t.hasAttribute('data-open-team-chat'))return openTeamChat().catch(console.error);
    if(t.hasAttribute('data-back-sessions')){stopLive();st.detail=null;st.sessionId=null;st.emblemDraft=null;return loadSessions().catch(console.error);}
    if(t.dataset.joinClan)return doAction(()=>api('join_clan',{session_id:st.sessionId,clan_id:t.dataset.joinClan}));
    if(t.hasAttribute('data-leave-clan'))return doAction(()=>api('leave_clan',{session_id:st.sessionId}));
    if(t.dataset.leaderVote)return doAction(()=>api('vote_leader',{session_id:st.sessionId,candidate_id:t.dataset.leaderVote}));
    if(t.dataset.leaderKick){const name=t.closest('.leader-member-row')?.querySelector('strong')?.textContent?.trim()||'este integrante';const reason=prompt(`Solicitar ao professor a troca de ${name}? Informe brevemente o motivo (opcional).`)||'';if(confirm('Enviar esta solicitação para aprovação do professor? O aluno NÃO será removido automaticamente.'))return doAction(()=>api('leader_request_member_removal',{session_id:st.sessionId,student_id:t.dataset.leaderKick,reason}));return;}
    if(t.dataset.selectRole)return doAction(()=>api('select_role',{session_id:st.sessionId,role_id:t.dataset.selectRole}));
    if(t.dataset.challengeFilter){st.challengeFilter=t.dataset.challengeFilter;const list=document.querySelector('.challenge-list');if(list)list.dataset.filter=st.challengeFilter;document.querySelectorAll('[data-challenge-filter]').forEach(b=>{b.classList.toggle('primary',b.dataset.challengeFilter===st.challengeFilter);b.classList.toggle('ghost',b.dataset.challengeFilter!==st.challengeFilter);});return;}
    if(t.hasAttribute('data-remove-emblem')){st.emblemDraft='';const preview=$('guild-emblem-preview');if(preview){const room=(st.detail?.clans||[]).find(c=>String(c.id)===String(st.detail?.me?.clan_id));preview.innerHTML=guildMark({...room,emblem_data_url:''},'large');}t.remove();return;}
    if(t.dataset.submitChallenge)return submitChallenge(t.dataset.submitChallenge);
  });
  $('exam-content').addEventListener('change',e=>{
    const file=e.target.closest('#guild-emblem-input');if(file?.files?.[0]){const selected=file.files[0],message=file.closest('label')?.querySelector('small');if(!['image/png','image/jpeg','image/webp'].includes(selected.type)||selected.size>320*1024){file.value='';if(message)message.textContent='Use PNG, JPEG ou WEBP com no máximo 320 KB.';return;}const reader=new FileReader();reader.onload=()=>{st.emblemDraft=String(reader.result||'');const preview=$('guild-emblem-preview');if(preview)preview.innerHTML=`<img class="guild-emblem large" src="${esc(st.emblemDraft)}" alt="Novo emblema da equipe">`;if(message)message.textContent='Emblema pronto. Clique em salvar para registrar.';};reader.readAsDataURL(selected);}
  });
  $('exam-content').addEventListener('submit',e=>{
    const f=e.target.closest('#room-settings-form');if(!f)return;e.preventDefault();const fd=new FormData(f),room=(st.detail?.clans||[]).find(c=>String(c.id)===String(st.detail?.me?.clan_id));return doAction(()=>api('leader_update_room',{session_id:st.sessionId,name:fd.get('name'),theme_key:fd.get('theme_key'),accent_color:fd.get('accent_color'),mascot_key:fd.get('mascot_key'),emblem_data_url:st.emblemDraft===null?(room?.emblem_data_url||''):st.emblemDraft,company_name:fd.get('company_name'),company_cnpj:fd.get('company_cnpj'),company_city:fd.get('company_city'),company_phone:fd.get('company_phone')})).finally(()=>{st.emblemDraft=null;});
  });
  $('exam-content').addEventListener('input',e=>{
    const text=e.target.closest('[data-answer-text]');if(text){const c=challengeById(text.dataset.answerText);if(c&&!c.team_submitted)queueServerDraft(c,{text:text.value});}
    const radio=e.target.closest('[data-answer-choice]');if(radio){const c=challengeById(radio.dataset.answerChoice);if(c&&!c.team_submitted)queueServerDraft(c,{choice:radio.value});}
    const multi=e.target.closest('[data-answer-multi]');if(multi){const c=challengeById(multi.dataset.answerMulti);saveInteractive(c);}
  });
  let selectedDrag=null;
  $('exam-content').addEventListener('dragstart',e=>{
    const item=e.target.closest('[data-drag-item],[data-order-item]');if(!item)return;selectedDrag=item;item.classList.add('dragging');try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',`${item.dataset.challengeId}|${item.dataset.itemId}`);}catch{}
  });
  $('exam-content').addEventListener('dragend',e=>{const item=e.target.closest('[data-drag-item],[data-order-item]');item?.classList.remove('dragging');selectedDrag=null;});
  $('exam-content').addEventListener('dragover',e=>{if(e.target.closest('[data-drop-zone],[data-order-list],[data-order-item]'))e.preventDefault();});
  $('exam-content').addEventListener('drop',e=>{
    e.preventDefault();const item=selectedDrag;if(!item)return;const cid=String(item.dataset.challengeId||''),c=challengeById(cid);if(!c)return;
    const zone=e.target.closest('[data-drop-zone]');if(zone&&String(zone.dataset.challengeId)===cid&&item.matches('[data-drag-item]')){zone.querySelector('.drop-zone-items')?.appendChild(item);saveInteractive(c);return;}
    const list=e.target.closest('[data-order-list]');if(list&&String(list.dataset.orderList)===cid&&item.matches('[data-order-item]')){const target=e.target.closest('[data-order-item]');if(target&&target!==item){const r=target.getBoundingClientRect();list.insertBefore(item,e.clientY<r.top+r.height/2?target:target.nextSibling);}else list.appendChild(item);renumberOrder(list);saveInteractive(c);}
  });
  function renumberOrder(list){[...list.querySelectorAll('[data-order-item]')].forEach((x,i)=>{const n=x.querySelector('.order-number');if(n)n.textContent=String(i+1);});}
  $('exam-content').addEventListener('click',e=>{
    const move=e.target.closest('[data-order-up],[data-order-down]');if(move){e.preventDefault();e.stopPropagation();const row=move.closest('[data-order-item]'),list=row?.closest('[data-order-list]');if(!row||!list)return;const sibling=move.hasAttribute('data-order-up')?row.previousElementSibling:row.nextElementSibling;if(sibling){if(move.hasAttribute('data-order-up'))list.insertBefore(row,sibling);else list.insertBefore(sibling,row);}renumberOrder(list);saveInteractive(challengeById(list.dataset.orderList));return;}
    const item=e.target.closest('[data-drag-item]');if(item){e.preventDefault();document.querySelectorAll('.drag-item.selected-drag').forEach(x=>x.classList.remove('selected-drag'));selectedDrag=item;item.classList.add('selected-drag');return;}
    const zone=e.target.closest('[data-drop-zone]');if(zone&&selectedDrag?.matches('[data-drag-item]')&&String(zone.dataset.challengeId)===String(selectedDrag.dataset.challengeId)){zone.querySelector('.drop-zone-items')?.appendChild(selectedDrag);selectedDrag.classList.remove('selected-drag');saveInteractive(challengeById(zone.dataset.challengeId));selectedDrag=null;}
  });

  async function signedIn(){const p=await loadProfile();if(!p)return;if(p.role!=='student'){location.replace('admin.html');return;}$('login-view').classList.add('hidden');$('app-view').classList.remove('hidden');$('logout').classList.remove('hidden');renderHeader();await loadSessions();}
  async function restore(){const s=await auth.getSession();if(!s){location.replace('../auth/?returnTo=prova/');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();location.replace('../auth/?returnTo=prova/');}}
  $('login-form')?.addEventListener('submit',e=>{e.preventDefault();location.replace('../auth/?returnTo=prova/')});
  $('logout').addEventListener('click',async()=>{stopLive();await auth.signOut();location.replace('../auth/?returnTo=prova/');});
  auth.onStorage(()=>restore());restore();
})();

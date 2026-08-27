(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const st={profile:null,sessions:[],detail:null,sessionId:null,poll:null,heartbeat:null,timer:null,lobbyTimer:null,busy:false,draftTimers:new Map(),draftStatus:new Map()};
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const statusInfo=s=>({draft:['Rascunho',''],waiting_room:['Pré-lobby','live'],locked:['Equipes bloqueadas','warn'],running:['Em andamento','live'],paused:['Pausada','warn'],finished:['Finalizada',''],grading:['Em correção',''],score_scheduled:['Nota programada','warn'],published:['Nota publicada','good'],cancelled:['Cancelada','danger']}[s]||[s||'—','']);
  const fmtTime=sec=>{sec=Math.max(0,Math.floor(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
  const fmtDate=v=>v?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'—';
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const msg=(t='',err=false)=>{const e=$('login-message');if(e){e.textContent=t;e.classList.toggle('error',err)}};
  function setConnection(text,kind=''){const e=$('connection-pill');if(!e)return;e.textContent=text;e.className=`pill ${kind}`.trim();}
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
    if(!st.sessions.length){host.innerHTML='<div class="panel empty-card"><strong>Nenhuma prova prática disponível agora.</strong><p>Quando o professor abrir o pré-lobby ou publicar uma avaliação, ela aparecerá aqui.</p><a class="button ghost" href="../atividades/">Ir para atividades convencionais</a></div>';return;}
    host.innerHTML=`<section><div class="section-head"><div><p class="eyebrow">Avaliações</p><h2>Modo Prova Prática</h2><p>Pré-lobby para formar a equipe e depois uma prova colaborativa cronometrada.</p></div></div><div class="session-grid">${st.sessions.map(s=>{
      const [label,kind]=statusInfo(s.status);
      const context=s.status==='score_scheduled'?`Publicação: ${fmtDate(s.score_publish_at)}`:s.status==='running'?`Tempo restante: ${fmtTime(s.remaining_seconds)}`:s.status==='waiting_room'?`Pré-lobby: ${fmtTime(s.lobby_remaining_seconds)} • prova ${Number(s.duration_minutes||50)} min`:esc(s.description||'Avaliação prática em grupo.');
      return `<article class="panel session-card"><div class="session-meta"><span class="status-pill ${kind}">${esc(label)}</span><span class="status-pill">${Number(s.max_score||0).toLocaleString('pt-BR')} pts</span></div><h3>${esc(s.title)}</h3><p>${esc(s.subject_name)}</p><p>${context}</p><button class="button ${['waiting_room','locked','running','paused'].includes(s.status)?'primary':'ghost'}" data-open-session="${s.id}" type="button">${s.status==='published'?'Ver resultado':'Abrir avaliação'}</button></article>`;
    }).join('')}</div></section>`;
  }

  function waitingRoom(d){
    const me=d.me,selected=String(me?.clan_id||''),blocked=new Set((d.blocked_clan_ids||[]).map(String));
    const roleById=new Map((d.roles||[]).map(r=>[String(r.id),r]));
    const roomById=new Map((d.clans||[]).map(c=>[String(c.id),c]));
    const roomCards=(d.clans||[]).map(c=>{
      const mine=selected===String(c.id),isBlocked=blocked.has(String(c.id)),full=Number(c.count||0)>=Number(d.session.max_clan_size||6);
      const leader=(c.members||[]).find(m=>String(m.student_id)===String(c.leader_id||''));
      const members=(c.members||[]).map(m=>`<div class="lobby-room-member ${m.is_leader?'leader':''}"><span>${m.is_leader?'👑 ':''}${esc(m.name)}</span><small>${esc(m.role_name||'Área ainda não definida')}</small></div>`).join('');
      let action='';
      if(d.session.status==='waiting_room'){
        if(mine) action='<button class="button ghost small" data-leave-clan type="button">Sair da sala</button>';
        else action=`<button class="button ${!full&&!isBlocked?'primary':'ghost'} small" data-join-clan="${c.id}" type="button" ${full||isBlocked?'disabled':''}>${isBlocked?'Removido desta sala':full?'Sala lotada':'Entrar na sala'}</button>`;
      }
      return `<article class="panel lobby-room-card ${mine?'selected':''}" data-room-theme="${esc(c.theme_key||'cyber')}"><div class="lobby-room-top"><div><span class="room-number">${esc(c.name)}</span><strong>${esc(c.company_name||'Empresa ainda sem nome')}</strong><small>${Number(c.count||0)}/${Number(d.session.max_clan_size||6)} integrantes</small></div>${mine?'<span class="status-pill good">Sua sala</span>':''}</div><div class="room-leader-line">${leader?`👑 Líder: <strong>${esc(leader.name)}</strong>`:'🗳️ Líder: <strong>em votação</strong>'}</div><div class="lobby-room-members">${members||'<small class="muted">Sala vazia.</small>'}</div>${action}</article>`;
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
        return `<button class="leader-vote-card ${chosen?'selected':''} ${isLeader?'elected':''}" data-leader-vote="${m.student_id}" type="button" ${d.session.status!=='waiting_room'?'disabled':''}><span>${isLeader?'👑':'🗳️'}</span><div><strong>${esc(m.student?.full_name||'Aluno')}</strong><small>${votes} voto${votes===1?'':'s'}${chosen?' • seu voto':''}</small></div></button>`;
      }).join('');
      const electionStatus=leaderId?`<div class="notice good"><strong>${esc(d.leader?.name||'Líder')} é o líder da sala.</strong> O líder organiza funções e configurações da empresa antes do início.</div>`:e.tied?'<div class="notice warn"><strong>Empate na votação.</strong> Alterem os votos até existir uma pessoa mais votada.</div>':'<div class="notice warn"><strong>A sala ainda não possui líder.</strong> Cada integrante deve votar em alguém da própria equipe.</div>';
      const taken=new Map(team.filter(m=>m.role_id).map(m=>[String(m.role_id),String(m.student_id)]));
      const assignments=team.map(m=>{
        const isSelf=String(m.student_id)===String(me?.student_id),isLeader=String(m.student_id)===leaderId;
        const opts=(d.roles||[]).map(r=>{const holder=taken.get(String(r.id)),disabled=holder&&holder!==String(m.student_id);return `<option value="${r.id}" ${String(m.role_id||'')===String(r.id)?'selected':''} ${disabled?'disabled':''}>${esc(r.icon)} ${esc(r.name)}${disabled?' — ocupada':''}</option>`}).join('');
        return `<div class="leader-member-row"><div><strong>${isLeader?'👑 ':''}${esc(m.student?.full_name||'Aluno')}</strong><small>${isSelf?'Você • ':''}${esc(roleById.get(String(m.role_id||''))?.name||'Sem área definida')}</small></div><select data-leader-role="${m.student_id}" ${!me?.is_leader||d.session.status!=='waiting_room'?'disabled':''}><option value="">Definir área…</option>${opts}</select>${me?.is_leader&&!isSelf&&d.session.status==='waiting_room'?`<button class="button danger small" data-leader-kick="${m.student_id}" type="button">Expulsar</button>`:'<span></span>'}</div>`;
      }).join('');
      const leaderPanel=me?.is_leader?`<section class="panel section-panel leader-console"><div class="section-head"><div><p class="eyebrow">Console do líder</p><h2>Configurar equipe</h2><p>As alterações abaixo ficam disponíveis somente antes do início da prova.</p></div><span class="status-pill good">👑 Líder</span></div><form id="room-settings-form" class="room-settings-grid"><label>Nome da sala<input name="name" maxlength="42" value="${esc(room.name||'')}"></label><label>Tema<select name="theme_key">${['cyber','neon','ocean','violet','sunset','matrix','corporate','mono'].map(x=>`<option value="${x}" ${String(room.theme_key||'cyber')===x?'selected':''}>${esc(x[0].toUpperCase()+x.slice(1))}</option>`).join('')}</select></label><label>Nome da empresa<input name="company_name" maxlength="80" value="${esc(room.company_name||'')}" placeholder="Ex.: NovaByte Sistemas"></label><label>CNPJ fictício<input name="company_cnpj" maxlength="24" value="${esc(room.company_cnpj||'')}" placeholder="00.000.000/0001-00"></label><label>Cidade<input name="company_city" maxlength="80" value="${esc(room.company_city||'')}" placeholder="Paranaguá - PR"></label><label>Telefone fictício<input name="company_phone" maxlength="30" value="${esc(room.company_phone||'')}" placeholder="(41) 99999-9999"></label><button class="button primary" type="submit" ${d.session.status!=='waiting_room'?'disabled':''}>Salvar empresa</button></form><div class="section-head compact-head"><div><p class="eyebrow">Funções exclusivas</p><h3>Definir área de cada integrante</h3></div></div><div class="leader-member-list">${assignments}</div></section>`:'';
      ownRoom=`<section class="panel section-panel team-room-panel" data-room-theme="${esc(room.theme_key||'cyber')}"><div class="section-head"><div><p class="eyebrow">Sua sala</p><h2>${esc(room.name||'Sala')}</h2><p>${esc(room.company_name||'A equipe ainda pode criar o nome fictício da empresa.')}${room.company_city?` • ${esc(room.company_city)}`:''}</p></div><span class="status-pill live">${team.length}/${Number(d.session.max_clan_size||6)}</span></div><div class="company-strip"><span><b>Empresa</b>${esc(room.company_name||'—')}</span><span><b>CNPJ fictício</b>${esc(room.company_cnpj||'—')}</span><span><b>Cidade</b>${esc(room.company_city||'—')}</span><span><b>Telefone</b>${esc(room.company_phone||'—')}</span></div><div class="section-head compact-head"><div><p class="eyebrow">Votação</p><h3>Escolha do líder</h3><p>Uma pessoa por integrante. O candidato com maior número de votos assume a liderança. Em empate, não há líder até o desempate.</p></div></div><div class="leader-vote-grid">${candidates}</div>${electionStatus}</section>${leaderPanel}${!me?.is_leader?`<section class="panel section-panel"><p class="eyebrow">Sua função</p><h3>${esc(roleById.get(String(me?.role_id||''))?.name||'Aguardando definição do líder')}</h3><p class="muted">O líder da sua sala é responsável por distribuir áreas diferentes entre os integrantes. Você pode conversar com ele antes do início.</p></section>`:''}`;
    }
    const teamRanks=(d.rankings?.teams||[]).map(x=>`<div class="rank-row ${String(x.clan_id)===selected?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${Number(x.progress_percent||0)}% concluído</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const studentRanks=(d.rankings?.students||[]).slice(0,12).map(x=>`<div class="rank-row ${String(x.student_id)===String(me?.student_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.clan_name)} • ${esc(d.roles.find(r=>r.role_key===x.role_key)?.name||x.role_key||'')}</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    return `<section class="panel lobby-master"><div class="section-head"><div><p class="eyebrow">Lobby geral • ${Number(d.session.lobby_duration_minutes||15)} min</p><h2>Turma conectada ao Modo Prova</h2><p>Escolha uma sala. Antes do início você pode entrar e sair; após o professor iniciar, equipe e funções ficam fixas.</p></div><div id="lobby-timer" class="timer"><span>Pré-lobby</span><strong>${fmtTime(d.session.lobby_remaining_seconds)}</strong></div></div><div class="lobby-kpis"><div><strong>${total}</strong><small>alunos da turma</small></div><div><strong>${inRooms}</strong><small>em salas</small></div><div><strong>${Math.max(0,total-inRooms)}</strong><small>aguardando sala</small></div><div><strong>${leaders}</strong><small>líderes definidos</small></div></div><div class="lobby-main-grid"><div><h3>Salas das equipes</h3><div class="lobby-room-grid">${roomCards}</div></div><aside><h3>Todos os alunos</h3><div class="lobby-roster">${roster}</div></aside></div></section>${ownRoom}<details class="panel section-panel ranking-panel"><summary><strong>🏆 Ranking geral</strong><span>equipes + alunos</span></summary><div class="ranking-tabs"><h4>Ranking das equipes</h4><div class="rank-list">${teamRanks||'<small class="muted">O ranking começa quando houver XP.</small>'}</div><h4>Ranking individual geral</h4><div class="rank-list">${studentRanks||'<small class="muted">O ranking começa quando houver XP.</small>'}</div></div></details>${d.session.status==='locked'?'<div class="notice warn"><strong>Equipes bloqueadas pelo professor.</strong> Aguarde o início da prova.</div>':''}`;
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
    return `<div class="scenario-box"><span>Situação-problema</span><p>${esc(c.prompt)}</p></div><div class="challenge-guide"><div><span>O que você deve fazer</span><p>${esc(pc.instructions||'Resolva o desafio conforme o enunciado e envie a resposta do seu cargo.')}</p></div><div><span>Como a equipe participa</span><p>${esc(pc.team_help||'A equipe pode discutir e ajudar, mas somente o cargo responsável envia a missão individual.')}</p></div>${pc.time_hint?`<div class="time-hint"><span>Tempo sugerido</span><strong>${esc(pc.time_hint)}</strong></div>`:''}</div>`;
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
      const mine=c.can_submit||c.can_edit_draft,done=c.team_submitted,locked=c.locked,role=c.scope==='clan'?'Equipe — líder envia':d.roles.find(r=>r.role_key===c.role_key)?.name||c.role_key||'—';
      const draft=!!c.submission?.draft;
      const submitted=!!c.submission&&!draft;
      const validation=c.public_config?.teacher_validation&&submitted?'<div class="notice warn"><strong>Aguardando validação do professor.</strong><br>O link foi registrado; a pontuação de qualidade será definida após a avaliação do protótipo.</div>':'';
      const body=submitted
        ? `<div class="answer-preview">${esc(answerPreview(c,c.submission.answer||{}))}</div>${validation}${c.submission.feedback?`<div class="notice">Feedback: ${esc(c.submission.feedback)}</div>`:''}<div class="notice good">Entrega registrada no servidor. Somente o professor pode reabrir esta missão.</div>`
        : mine&&!locked
          ? `${answerField(c)}<div class="challenge-form"><div class="draft-row"><span class="draft-state ${draft?'good':''}" data-draft-state="${c.id}">${draft?'Rascunho recuperado do servidor':'Rascunho com salvamento automático'}</span></div>${c.can_submit?`<button class="button primary" data-submit-challenge="${c.id}" type="button">Enviar missão definitivamente</button>`:'<div class="notice warn">A prova está pausada. Você pode revisar o rascunho, mas o envio definitivo fica bloqueado até a retomada.</div>'}<p class="message" data-submit-message="${c.id}"></p><small class="muted">O rascunho é salvo no servidor. O envio definitivo é único; XP e correção são calculados no backend.</small></div>`
          : locked?'<div class="notice warn">Conclua a etapa anterior para liberar esta missão.</div>':'<div class="notice">Você pode ajudar a equipe a pensar, mas somente a área responsável — ou o líder nas missões coletivas — pode enviar.</div>';
      return `<article class="challenge-card ${locked?'locked':''} ${done?'done':''}" data-challenge-card="${c.id}"><div class="challenge-head"><div><h3>${esc(c.title)}</h3><div class="challenge-meta"><span class="status-pill">${esc(role)}</span><span class="status-pill">${Number(c.points||0).toLocaleString('pt-BR')} pts</span><span class="status-pill live">até ${Number(c.xp_max||0)} XP</span>${done?'<span class="status-pill good">Entregue</span>':draft?'<span class="status-pill warn">Rascunho</span>':locked?'<span class="status-pill warn">Aguardando</span>':mine?'<span class="status-pill live">Sua missão</span>':'<span class="status-pill">Área de colega</span>'}</div></div></div>${challengeGuide(c)}${body}</article>`;
    }).join('')}`).join('');
    const myXp=d.xp?.individual||{},teamXp=d.xp?.team||{};
    const leaderId=String(d.leader?.student_id||'');
    const teamMembers=[...(d.team||[])].sort((a,b)=>Number(b.progress?.xp_earned||0)-Number(a.progress?.xp_earned||0)||Number(b.progress?.progress_percent||0)-Number(a.progress?.progress_percent||0)).map((m,i)=>{const r=d.roles.find(x=>String(x.id)===String(m.role_id));const pr=m.progress||{};return `<div class="team-progress-card"><div class="team-progress-head"><div><strong><span class="room-rank-pos">${i+1}º</span> ${esc(m.student?.full_name||'Aluno')} ${String(m.student_id)===leaderId?'<span class="leader-badge">Líder</span>':''}</strong><small>${esc(r?.name||'Área não escolhida')}</small></div><strong>${Number(pr.xp_earned||0)} XP</strong></div><progress class="progress" max="100" value="${Number(pr.progress_percent||0)}"></progress><small class="muted">${Number(pr.progress_percent||0)}% • ${Number(pr.completed_count||0)}/${Number(pr.total_count||0)} desafios • ${Number(pr.xp_earned||0)}/${Number(pr.xp_max||0)} XP ${pr.online?'• online':''}</small></div>`}).join('');
    const teams=(d.rankings?.teams||[]).map(x=>`<div class="rank-row ${String(x.clan_id)===String(d.me?.clan_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${Number(x.progress_percent||0)}% concluído</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    const students=(d.rankings?.students||[]).map(x=>`<div class="rank-row ${String(x.student_id)===String(d.me?.student_id)?'mine':''}"><span class="rank-pos">${x.position}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.clan_name)} • ${esc(d.roles.find(r=>r.role_key===x.role_key)?.name||x.role_key||'')}</small></div><b>${Number(x.xp||0)} XP</b></div>`).join('');
    return `<div class="layout2"><section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Missões da empresa</p><h2>Desafios por fases</h2><p>São 8 áreas disponíveis; cada integrante escolhe uma área exclusiva e realiza os dois desafios daquela área.</p></div></div><div class="challenge-list">${list}</div></section><aside class="content-grid sticky-side">
      <section class="panel section-panel"><p class="eyebrow">Sua área</p><h3>${esc(roleName)}</h3><p class="muted">${esc(d.roles.find(r=>String(r.id)===String(d.me?.role_id||''))?.description||'')}</p><div class="xp-summary"><div><span>Seu XP</span><strong>${Number(myXp.earned||0)} <small>/ ${Number(myXp.max||0)}</small></strong></div><div><span>Progresso XP</span><strong>${Number(myXp.percent||0)}%</strong></div></div></section>
      <section class="panel section-panel"><div class="section-head"><div><p class="eyebrow">Sua equipe</p><h3>${esc(d.clans.find(c=>String(c.id)===String(d.me?.clan_id||''))?.name||'Sem equipe')}</h3><p>${esc(d.clans.find(c=>String(c.id)===String(d.me?.clan_id||''))?.company_name||'Empresa da equipe')} • Líder: <strong>${esc(d.leader?.name||'—')}</strong></p></div><span class="status-pill ${Number(d.team_progress?.progress_percent||0)>=100?'good':'live'}">${Number(d.team_progress?.progress_percent||0)}%</span></div><div class="progress-wrap"><progress class="progress" max="100" value="${Number(d.team_progress?.progress_percent||0)}"></progress><small class="muted">Progresso coletivo das áreas escolhidas.</small></div><div class="xp-team"><span>XP normalizado da equipe</span><strong>${Number(teamXp.ranking_xp||0)} <small>/ 1000</small></strong></div><h4 class="room-ranking-title">Ranking da sua sala</h4><div class="team-progress-list">${teamMembers}</div></section>
      <details class="panel section-panel ranking-panel"><summary><strong>Ver ranking geral da turma</strong><span>Equipes + alunos</span></summary><div class="ranking-tabs"><h4>Equipes</h4><div class="rank-list">${teams||'<small class="muted">Ranking ainda sem dados.</small>'}</div><h4>Alunos</h4><div class="rank-list">${students||'<small class="muted">Ranking ainda sem dados.</small>'}</div></div></details>
      <section class="notice">Nota final = <strong>50% desempenho da equipe + 50% desempenho individual</strong>. XP é usado para progresso/ranking e é calculado exclusivamente pelo servidor.</section>
    </aside></div>`;
  }

  function resultView(d){
    if(d.session.status==='published'&&d.score){return `<section class="panel score-card"><p class="eyebrow">Resultado publicado</p><h2>${esc(d.session.title)}</h2><div class="big-score">${Number(d.score.final_score||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:2})}<small> / ${Number(d.session.max_score||0).toLocaleString('pt-BR')}</small></div><div class="score-breakdown"><div><span>Desempenho da equipe</span><strong>${Number(d.score.group_raw_score||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}</strong></div><div><span>Sua área</span><strong>${Number(d.score.individual_raw_score||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}</strong></div><div><span>XP individual</span><strong>${Number(d.score.xp_earned||0)} / ${Number(d.score.xp_max||0)}</strong></div></div><p class="muted">A nota foi publicada pelo professor. XP e ranking permanecem separados da nota acadêmica.</p></section>`;}
    const text=d.session.status==='score_scheduled'?`Sua nota já foi preparada e está programada para publicação em ${fmtDate(d.session.score_publish_at)}.`:d.session.status==='grading'?'A equipe docente está corrigindo as respostas.':'A prova foi encerrada. Aguarde a correção e a publicação do resultado.';return `<section class="panel empty-card"><p class="eyebrow">Avaliação concluída</p><h2>Respostas registradas</h2><p>${esc(text)}</p><button class="button ghost" data-back-sessions type="button">Voltar às avaliações</button></section>`;
  }

  function renderDetail(){
    const d=st.detail,host=$('exam-content');if(!d)return renderSessions();const [label,kind]=statusInfo(d.session.status);
    const myRoom=(d.clans||[]).find(c=>String(c.id)===String(d.me?.clan_id||''));document.documentElement.dataset.examTheme=myRoom?.theme_key||'cyber';
    host.innerHTML=`<section class="panel exam-hero"><div><p class="eyebrow">${esc(d.session.subject_name)}</p><h1>${esc(d.session.title)}</h1><p>${esc(d.session.description||'')}</p><div class="session-meta"><span class="status-pill ${kind}">${esc(label)}</span><span class="status-pill">${Number(d.session.max_score||0).toLocaleString('pt-BR')} pontos</span><span class="status-pill">até ${Number(d.session.max_clan_size||6)} por equipe</span></div></div>${['running','paused'].includes(d.session.status)?`<div id="exam-timer" class="timer"><span>Tempo restante</span><strong>${fmtTime(d.session.remaining_seconds)}</strong><small>${Number(d.session.duration_minutes||50)} min de prova</small></div>`:''}</section><div class="control-bar"><button class="button ghost small" data-back-sessions type="button">← Avaliações</button></div>${['waiting_room','locked'].includes(d.session.status)?waitingRoom(d):d.session.status==='running'?challengesView(d):d.session.status==='paused'?`<div class="notice warn"><strong>⏸ Avaliação pausada pelo professor.</strong><br>O backend bloqueia novos envios até a retomada.</div>${challengesView(d)}`:resultView(d)}`;
    const supervised=['locked','running','paused'].includes(d.session.status);window.AGVFullscreen?.require(supervised);if(supervised)window.AGVFullscreen?.request?.({silent:true}).catch?.(()=>{});startTimers();
  }

  function startTimers(){
    clearInterval(st.timer);clearInterval(st.lobbyTimer);
    if(!st.detail)return;
    if(st.detail.session.status==='waiting_room'){
      let remaining=Number(st.detail.session.lobby_remaining_seconds||0);
      st.lobbyTimer=setInterval(()=>{remaining=Math.max(0,remaining-1);const el=$('lobby-timer');if(el){el.classList.toggle('danger',remaining<=60);const strong=el.querySelector('strong');if(strong)strong.textContent=fmtTime(remaining);}if(remaining<=0){clearInterval(st.lobbyTimer);setTimeout(refreshDetail,1200);}},1000);
    }
    if(!['running','paused'].includes(st.detail.session.status))return;
    let remaining=Number(st.detail.session.remaining_seconds||0);const paused=st.detail.session.status==='paused';
    st.timer=setInterval(()=>{if(!paused)remaining=Math.max(0,remaining-1);const el=$('exam-timer');if(el){el.classList.toggle('danger',remaining<=300);const strong=el.querySelector('strong');if(strong)strong.textContent=fmtTime(remaining);}if(remaining<=0&&!paused){clearInterval(st.timer);setTimeout(refreshDetail,1200);}},1000);
  }

  async function loadSessions(){setConnection('Sincronizando');const out=await api('student_state');st.sessions=out.sessions||[];setConnection('Online','good');renderSessions();}
  async function refreshDetail(){if(!st.sessionId||st.busy)return;try{const out=await api('student_state',{session_id:st.sessionId});st.detail=out;setConnection('Online','good');renderDetail();}catch(e){console.error(e);setConnection('Falha de sincronização','danger');}}
  async function openSession(id){st.sessionId=String(id);const out=await api('student_state',{session_id:st.sessionId});st.detail=out;renderDetail();restartLiveLoops();}
  function restartLiveLoops(){clearInterval(st.poll);clearInterval(st.heartbeat);st.poll=setInterval(()=>{if(!document.hidden)refreshDetail();},7000);st.heartbeat=setInterval(()=>{if(st.sessionId)api('heartbeat',{session_id:st.sessionId}).catch(()=>{});},20000);if(st.sessionId)api('heartbeat',{session_id:st.sessionId}).catch(()=>{});}
  function stopLive(){clearInterval(st.poll);clearInterval(st.heartbeat);clearInterval(st.timer);clearInterval(st.lobbyTimer);for(const x of st.draftTimers.values())clearTimeout(x);st.draftTimers.clear();st.poll=st.heartbeat=st.timer=st.lobbyTimer=null;window.AGVFullscreen?.require(false);}
  async function doAction(fn){if(st.busy)return;st.busy=true;try{await fn();await refreshDetail();}catch(e){console.error(e);alert(String(e?.data?.error||e?.message||'Não foi possível concluir a ação.').replaceAll('_',' '));}finally{st.busy=false;}}
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
    const t=e.target.closest('[data-open-session],[data-back-sessions],[data-join-clan],[data-leave-clan],[data-leader-vote],[data-leader-kick],[data-submit-challenge]');if(!t)return;
    if(t.dataset.openSession)return openSession(t.dataset.openSession).catch(console.error);
    if(t.hasAttribute('data-back-sessions')){stopLive();st.detail=null;st.sessionId=null;return loadSessions().catch(console.error);}
    if(t.dataset.joinClan)return doAction(()=>api('join_clan',{session_id:st.sessionId,clan_id:t.dataset.joinClan}));
    if(t.hasAttribute('data-leave-clan'))return doAction(()=>api('leave_clan',{session_id:st.sessionId}));
    if(t.dataset.leaderVote)return doAction(()=>api('vote_leader',{session_id:st.sessionId,candidate_id:t.dataset.leaderVote}));
    if(t.dataset.leaderKick){const name=t.closest('.leader-member-row')?.querySelector('strong')?.textContent?.trim()||'este integrante';if(confirm(`Expulsar ${name} desta sala? Ele não poderá retornar para esta mesma sala, mas poderá entrar em outra antes do início.`))return doAction(()=>api('leader_kick_member',{session_id:st.sessionId,student_id:t.dataset.leaderKick}));return;}
    if(t.dataset.submitChallenge)return submitChallenge(t.dataset.submitChallenge);
  });
  $('exam-content').addEventListener('change',e=>{
    const sel=e.target.closest('[data-leader-role]');if(sel&&sel.value)return doAction(()=>api('leader_assign_role',{session_id:st.sessionId,student_id:sel.dataset.leaderRole,role_id:sel.value}));
  });
  $('exam-content').addEventListener('submit',e=>{
    const f=e.target.closest('#room-settings-form');if(!f)return;e.preventDefault();const fd=new FormData(f);return doAction(()=>api('leader_update_room',{session_id:st.sessionId,name:fd.get('name'),theme_key:fd.get('theme_key'),company_name:fd.get('company_name'),company_cnpj:fd.get('company_cnpj'),company_city:fd.get('company_city'),company_phone:fd.get('company_phone')}));
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
  async function restore(){const s=await auth.getSession();if(!s){setConnection('Sem sessão');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();setConnection('Sessão encerrada','danger');}}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter,email=$('email').value.trim().toLowerCase(),password=$('password').value;b.disabled=true;msg('Entrando…');try{await auth.signIn(email,password);await signedIn();msg();}catch(err){console.error(err);msg('Não foi possível entrar. Confira e-mail e senha.',true);}finally{b.disabled=false;}});
  $('logout').addEventListener('click',async()=>{stopLive();await auth.signOut();location.reload();});
  auth.onStorage(()=>restore());restore();
})();

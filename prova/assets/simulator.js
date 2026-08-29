(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const state={catalog:null,roster:[],catalogMode:'server',overview:null,sessionDetail:null,classId:'',templateKey:'',roleKey:'analysis',view:'lobby',profile:'member',device:'desktop',theme:'corporate',challengeIndex:0,answers:{},xp:{},teamXp:0,joinedRoom:1,leaderId:null,roomName:'Equipe 1',company:{name:'',cnpj:'',city:'',phone:''}};
  const teamPalette=['#63c7d6','#74b7d5','#7fc9b0','#b3b8c3','#c5aa7a','#9fa6d8','#7db6a4','#b6a0bd'];
  const sessionTeams=()=>state.sessionDetail?.clans||[];
  const guildInfo=n=>{const team=sessionTeams()[Math.max(0,Number(n||1)-1)],index=Math.max(1,Number(n||1));return {name:team?.company_name||team?.name||`Equipe ${index}`,tag:`E${String(index).padStart(2,'0')}`,icon:String(index).padStart(2,'0'),accent:team?.accent_color||teamPalette[(index-1)%teamPalette.length],motto:team?.company_name&&team?.name?team.name:'Equipe da avaliação'};};
  const setConnection=(t,k='')=>{const e=$('connection-pill');if(e){e.textContent=t;e.className=`pill ${k}`.trim();}};
  const msg=(t='',err=false)=>{const e=$('login-message');if(e){e.textContent=t;e.classList.toggle('error',err)}};
  const roleByKey=k=>state.catalog?.roles?.find(r=>r.role_key===k)||null;
  const tpl=()=>state.catalog?.templates?.find(t=>t.key===state.templateKey)||state.catalog?.templates?.[0];
  const roleChallenges=()=>{const t=tpl();if(!t)return[];return t.challenges.filter(c=>c.scope==='clan'||c.role_key===state.roleKey);};
  const currentChallenge=()=>roleChallenges()[Math.min(state.challengeIndex,Math.max(0,roleChallenges().length-1))];
  const initials=name=>String(name||'Aluno').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const names=()=>state.sessionDetail?.roster?.length?state.sessionDetail.roster:state.roster.length?state.roster:[];
  const teamMembers=()=>{
    const detail=state.sessionDetail,team=detail?.clans?.[Math.max(0,state.joinedRoom-1)];
    if(detail&&team){const ms=(detail.members||[]).filter(m=>String(m.clan_id)===String(team.id));return ms.map(m=>({id:m.student_id,full_name:m.student?.full_name||names().find(p=>String(p.id)===String(m.student_id))?.full_name||'Aluno',role_key:detail.roles?.find(r=>String(r.id)===String(m.role_id))?.role_key||'',isLeader:!!m.is_leader,ready:!!m.role_id&&!!m.role_selected_at}));}
    const roles=state.catalog?.roles||[];return names().slice(0,6).map((p,i)=>({...p,role_key:roles[i%Math.max(1,roles.length)]?.role_key||'analysis',isLeader:String(p.id)===String(state.leaderId),ready:false}));
  };
  const pct=(n,d)=>d?Math.round((n/d)*100):0;
  function scoreFor(ch){return Number(state.xp[ch?.challenge_key]||0);}
  function totalRoleXp(){return roleChallenges().reduce((a,c)=>a+scoreFor(c),0);}
  function maxRoleXp(){return roleChallenges().reduce((a,c)=>a+Number(c.xp_max||0),0);}
  function roleProgress(){const cs=roleChallenges();return pct(cs.filter(c=>state.answers[c.challenge_key]?.submitted).length,cs.length);}
  function rankData(){
    const detail=state.sessionDetail;if(detail?.metrics?.rankings)return {students:(detail.metrics.rankings.students||[]).map(x=>({name:x.name||'Aluno',team:detail.clans?.find(c=>String(c.id)===String(x.clan_id))?.company_name||detail.clans?.find(c=>String(c.id)===String(x.clan_id))?.name||'Equipe',role:detail.roles?.find(r=>String(r.id)===String(x.role_id))?.name||'',xp:Number(x.xp_earned||0),progress:Number(x.progress_percent||0)})).filter(x=>x.xp>0||x.progress>0),teams:(detail.metrics.rankings.teams||[]).map(x=>({name:detail.clans?.find(c=>String(c.id)===String(x.clan_id))?.company_name||detail.clans?.find(c=>String(c.id)===String(x.clan_id))?.name||'Equipe',xp:Number(x.ranking_xp||0),progress:Number(x.progress_percent||0)})).filter(x=>x.xp>0||x.progress>0)};
    return {students:[],teams:[]};
  }
  function updateControls(){
    $('sim-view').value=state.view;$('sim-role').value=state.roleKey;$('sim-profile').value=state.profile;$('sim-device').value=state.device;$('sim-theme').value=state.theme;
    $('sim-device-frame').className=`sim-device-frame ${state.device}`;
    $('sim-device-frame').dataset.roomTheme=state.theme;
    $('sim-device-title').textContent=`${state.device==='mobile'?'Celular':state.device==='tablet'?'Tablet':'Desktop'} • ${state.profile==='leader'?'líder':'integrante'}`;
    $('sim-next').classList.toggle('hidden',state.view!=='challenge');
  }
  function renderInspector(){
    const c=currentChallenge(),r=roleByKey(state.roleKey),team=teamMembers();
    $('sim-inspector').innerHTML=`
      <div class="sim-inspector-grid">
        <div><span>Turma</span><strong>${esc(state.catalog?.classes?.find(x=>String(x.id)===String(state.classId))?.name||'—')}</strong></div>
        <div><span>Prova</span><strong>${esc(tpl()?.subject_name||'—')}</strong></div>
        <div><span>Área</span><strong>${esc(r?.name||'—')}</strong></div>
        <div><span>Perfil</span><strong>${state.profile==='leader'?'Líder':'Integrante'}</strong></div>
        <div><span>Seu progresso</span><strong>${roleProgress()}%</strong></div>
        <div><span>Seu XP na prévia</span><strong>${totalRoleXp()} / ${maxRoleXp()}</strong></div>
        <div><span>Equipe</span><strong>${esc(state.roomName)}</strong></div>
        <div><span>Pontuação da equipe</span><strong>${state.teamXp} XP</strong></div>
        <div><span>Fonte do catálogo</span><strong>${state.catalogMode==='server'?'Servidor protegido':'Catálogo local de demonstração'}</strong></div>
      </div>
      <h3>Integrantes da equipe</h3>
      <div class="sim-mini-team">${team.map(m=>`<div><span>${m.isLeader?'👑':'•'}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem área')}</small></div>`).join('')}</div>
      ${c?`<h3>Atividade atual</h3><p class="sim-current">Fase ${c.phase_no} • ${esc(c.title)}<br><small>${esc(c.challenge_type)} • ${Number(c.xp_max||0)} XP máx.</small></p>`:''}`;
    renderAnswerKey();
  }
  function answerText(ch){
    if(!ch?.answer_key)return '<p>Gabarito protegido. Publique o backend v14.10.8.27 para visualizar a resposta administrativa.</p>';
    const corr=ch?.answer_key?.correct;
    if(corr==null)return '<p>Resposta aberta / validação manual do professor.</p>';
    const pc=ch.public_config||{};
    if(Array.isArray(corr))return `<ul>${corr.map(id=>`<li>${esc(pc.options?.find(o=>String(o.id)===String(id))?.label||id)}</li>`).join('')}</ul>`;
    if(typeof corr==='object')return `<pre>${esc(JSON.stringify(corr,null,2))}</pre>`;
    return `<p>${esc(pc.options?.find(o=>String(o.id)===String(corr))?.label||corr)}</p>`;
  }
  function renderAnswerKey(){$('sim-answer').innerHTML=answerText(currentChallenge());}
  function hero(title,sub){
    const r=roleByKey(state.roleKey);
    return `<div class="sim-context-bar"><div><small>PROVA PRÁTICA EM EQUIPE</small><strong>${esc(tpl()?.subject_name||'')}</strong></div><dl><div><dt>Equipe</dt><dd>${esc(state.roomName)}</dd></div><div><dt>Função</dt><dd>${esc(r?.name||'Aguardando definição')}</dd></div><div><dt>Estado</dt><dd>Prévia somente leitura</dd></div></dl></div><div class="sim-page-title"><p class="eyebrow">${esc(sub)}</p><h2>${esc(title)}</h2></div>`;
  }
  function renderLobby(){
    const roster=names(),teams=sessionTeams(),team=teamMembers(),session=state.sessionDetail?.session;
    if(!state.sessionDetail)return `${hero('Organização das equipes','PRÉVIA DA AVALIAÇÃO')}<section class="panel sim-room-section sim-no-session"><p class="eyebrow">Sem sessão selecionada</p><h3>Nenhuma sessão ativa foi encontrada para esta turma.</h3><p class="muted">A prévia não inventa alunos, equipes ou liderança. Abra uma sessão real para visualizar o lobby com os dados atuais.</p></section>`;
    const maxSize=Number(session?.max_clan_size||6),readyTotal=(state.sessionDetail?.members||[]).filter(m=>m.role_id&&m.role_selected_at).length,memberTotal=(state.sessionDetail?.members||[]).length;
    const rooms=(teams.length?teams:Array.from({length:Math.max(1,state.overview?.sessions?.find(x=>String(x.class_id)===String(state.classId))?.clan_count||6)},(_,i)=>({id:`preview-${i+1}`,name:`Equipe ${i+1}`}))).map((raw,i)=>{const n=i+1,info=guildInfo(n),members=state.sessionDetail?(state.sessionDetail.members||[]).filter(m=>String(m.clan_id)===String(raw.id)).map(m=>({id:m.student_id,full_name:m.student?.full_name||'Aluno',isLeader:!!m.is_leader,ready:!!m.role_id&&!!m.role_selected_at})):[];return{n,raw,info,members};});
    const assigned=new Set((state.sessionDetail?.members||[]).filter(m=>m.clan_id).map(m=>String(m.student_id))),unassigned=roster.filter(p=>!assigned.has(String(p.id)));
    return `${hero('Organização das equipes','LOBBY DA AVALIAÇÃO')}<section class="sim-match-banner professional-banner"><div><span class="sim-match-status"><i></i> ${session?.status==='waiting_room'?'LOBBY ABERTO':'PRÉVIA DA SESSÃO'}</span><h1>Formação das equipes</h1><p>Escolha da equipe, liderança, função e confirmação antes do início definido pelo professor.</p></div><div class="sim-countdown-orb professional-state"><small>INÍCIO</small><strong>${session?.status==='waiting_room'?'Aguardando professor':'Somente leitura'}</strong><span>${memberTotal?`${readyTotal}/${memberTotal} prontos`:'sem alterações reais'}</span></div></section><section class="sim-lobby-journey professional-journey"><div class="done"><b>1</b><span>Acessar lobby</span></div><div class="current"><b>2</b><span>Escolher equipe</span></div><div><b>3</b><span>Definir liderança</span></div><div><b>4</b><span>Escolher função</span></div><div><b>5</b><span>Confirmar</span></div></section><div class="sim-kpis game-kpis"><div><small>ALUNOS</small><strong>${roster.length}</strong></div><div><small>EQUIPES</small><strong>${rooms.length}</strong></div><div><small>NA EQUIPE</small><strong>${team.length}<i>/${maxSize}</i></strong></div><div><small>CONFIRMAÇÃO</small><strong class="ready-text">${readyTotal}/${memberTotal||roster.length}</strong></div></div><div class="sim-lobby-layout game-lobby-layout"><div><div class="sim-section-title"><div><span>EQUIPES DA SESSÃO</span><h3>Escolha sua equipe</h3></div><small>máximo ${maxSize} integrantes</small></div><div class="lobby-room-grid game-room-grid">${rooms.map(room=>{const selected=room.n===state.joinedRoom;return `<article class="lobby-room-card game-guild-card ${selected?'selected':''}" style="--sim-accent:${room.info.accent};--room-accent:${room.info.accent}"><div class="game-guild-head"><span class="game-guild-emblem professional-emblem">${room.info.icon}</span><div><small>${room.info.tag}</small><strong>${esc(room.info.name)}</strong><p>${esc(room.info.motto)}</p></div><span class="guild-capacity">${room.members.length}/${maxSize}</span></div><div class="guild-slot-grid">${Array.from({length:maxSize},(_,idx)=>{const m=room.members[idx];return m?`<div class="guild-slot filled ${m.isLeader?'leader':''}"><span>${initials(m.full_name)}</span><div><strong>${esc(m.full_name)}</strong><small>${m.isLeader?'Líder':m.ready?'Pronto':'Pendente'}</small></div></div>`:`<div class="guild-slot empty"><span>+</span><small>Vaga</small></div>`}).join('')}</div><div class="guild-card-footer"><span class="guild-ready-state ${room.members.length?'ok':''}">${room.members.filter(m=>m.ready).length}/${room.members.length||0} prontos</span><button class="button ${selected?'ghost':'primary'} small" data-sim-room="${room.n}" type="button">${selected?'Equipe selecionada':'Visualizar equipe'}</button></div></article>`}).join('')}</div></div><aside class="sim-lobby-side"><section class="sim-side-card"><div class="sim-section-title"><div><span>SEM EQUIPE</span><h3>Alunos ainda não vinculados</h3></div><small>${unassigned.length}</small></div><div class="sim-looking-list">${unassigned.slice(0,10).map(p=>`<div><span class="player-avatar">${initials(p.full_name)}</span><div><strong>${esc(p.full_name)}</strong><small>Aguardando escolha de equipe</small></div></div>`).join('')||'<p class="muted">Todos os alunos já estão em uma equipe.</p>'}</div></section><section class="sim-side-card sim-safe-note"><strong>Prévia somente leitura</strong><span>Esta tela reproduz os dados da sessão quando disponíveis. Nenhuma ação aqui altera equipe, liderança, nota ou progresso.</span></section></aside></div>`;
  }
  function renderRoom(){
    const team=teamMembers(),r=roleByKey(state.roleKey),g=guildInfo(state.joinedRoom);
    return `${hero(state.roomName,'EQUIPE • PREPARAÇÃO')}
      <section class="sim-squad-hero" style="--sim-accent:${g.accent}"><div class="sim-squad-emblem">${g.icon}</div><div class="sim-squad-copy"><span class="sim-match-status"><i></i> EQUIPE CONECTADA</span><h1>${esc(state.roomName)}</h1><p>${esc(state.sessionDetail?.clans?.[Math.max(0,state.joinedRoom-1)]?.company_name||state.company.name||'Empresa ainda não definida')}</p><div class="sim-squad-tags"><span>${team.length}/${Number(state.sessionDetail?.session?.max_clan_size||6)} integrantes</span><span>Líder: ${esc(team.find(x=>x.isLeader)?.full_name||'em definição')}</span><span>Prévia docente</span><span>${state.teamXp} XP</span></div></div><button id="sim-room-ready" class="sim-ready-button" type="button"><b>CONFIRMAR</b><small>função e equipe</small></button></section>
      <div class="sim-room-game-grid"><div><section class="panel sim-room-section game-panel"><div class="sim-section-title"><div><span>FUNÇÕES DA EQUIPE</span><h3>Funções dos integrantes</h3></div><small>1 função por integrante</small></div><div class="sim-team-cards game-team-cards">${team.map((m,i)=>`<div class="${m.isLeader?'leader':''} ${m.role_key===state.roleKey?'mine':''}"><span class="player-avatar large">${initials(m.full_name)}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem cargo')}</small><em>${m.role_key===state.roleKey?'VOCÊ':m.isLeader?'LÍDER':'ONLINE'}</em></div>`).join('')}</div></section>
      <section class="panel sim-room-section game-panel"><div class="sim-section-title"><div><span>LIDERANÇA</span><h3>Eleição de liderança</h3></div><small>voto individual</small></div><div class="leader-vote-grid game-vote-grid">${team.map((m,i)=>`<button class="leader-vote-card ${m.isLeader?'elected':''}" data-sim-leader="${esc(m.id)}" type="button"><span>${initials(m.full_name)}</span><div><strong>${esc(m.full_name)}</strong><small>${m.isLeader?'Líder atual':'Candidato'}</small></div></button>`).join('')}</div></section>
      ${state.profile==='leader'?`<section class="panel sim-room-section leader-console game-panel"><div class="sim-section-title"><div><span>GESTÃO DA EQUIPE</span><h3>Dados da empresa</h3></div><small>acesso do líder</small></div><div class="room-settings-grid"><label>Nome da empresa<input data-company="name" value="${esc(state.company.name)}"></label><label>CNPJ fictício<input data-company="cnpj" value="${esc(state.company.cnpj)}"></label><label>Cidade<input data-company="city" value="${esc(state.company.city)}"></label><label>Telefone<input data-company="phone" value="${esc(state.company.phone)}"></label><button class="button primary" data-save-company type="button">SALVAR DADOS</button></div></section>`:''}</div>
      <aside class="sim-squad-sidebar"><section class="panel sim-side-card mission-board"><div class="sim-section-title"><div><span>CHECKLIST</span><h3>Preparação antes do início</h3></div><small>4/5</small></div><div class="mission-check done"><b>✓</b><span>Entrar na equipe</span></div><div class="mission-check done"><b>✓</b><span>Eleger liderança</span></div><div class="mission-check done"><b>✓</b><span>Escolher cargo</span></div><div class="mission-check done"><b>✓</b><span>Definir identidade</span></div><div class="mission-check current"><b>5</b><span>Aguardar professor</span></div></section><section class="sim-side-card sim-safe-note"><strong>Chat da equipe</strong><span>Na prévia docente, o conteúdo real do chat não é simulado nem inventado.</span></section></aside></div>`;
  }
  function optionMarkup(ch,pc,ans){
    if(ch.challenge_type==='quiz_single')return `<div class="sim-options">${(pc.options||[]).map(o=>`<label class="option"><input type="radio" name="sim-choice" value="${esc(o.id)}" ${String(ans.choice||'')===String(o.id)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(ch.challenge_type==='quiz_multi')return `<div class="sim-options">${(pc.options||[]).map(o=>`<label class="option"><input type="checkbox" name="sim-multi" value="${esc(o.id)}" ${(ans.choices||[]).map(String).includes(String(o.id))?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(['drag_match','drag_classify'].includes(ch.challenge_type))return `<div class="sim-match-grid">${(pc.items||[]).map(it=>`<label><span>${esc(it.label)}</span><select data-match="${esc(it.id)}"><option value="">Selecione…</option>${(pc.targets||[]).map(t=>`<option value="${esc(t.id)}" ${String(ans.matches?.[it.id]||'')===String(t.id)?'selected':''}>${esc(t.label)}</option>`).join('')}</select></label>`).join('')}</div>`;
    if(ch.challenge_type==='drag_order')return `<div class="sim-order-editor">${(ans.order?.length?ans.order:(pc.items||[]).map(x=>x.id)).map((id,i)=>{const it=(pc.items||[]).find(x=>String(x.id)===String(id));return `<div><span>${i+1}</span><strong>${esc(it?.label||id)}</strong><button data-order-up="${i}" type="button">↑</button><button data-order-down="${i}" type="button">↓</button></div>`}).join('')}</div>`;
    const val=ans.text||'';return `<textarea id="sim-text" class="${ch.challenge_type==='code_text'?'code-input':''}" placeholder="${esc(pc.placeholder||'Digite sua resposta…')}">${esc(val)}</textarea>`;
  }
  function renderChallenge(){
    const cs=roleChallenges(),ch=currentChallenge();if(!ch)return `${hero('Sem atividade','Escolha outra função')}<div class="empty-card">Não há atividades vinculadas a esta função.</div>`;
    const pc=ch.public_config||{},ans=state.answers[ch.challenge_key]||{},r=roleByKey(state.roleKey);
    const submitted=!!ans.submitted;
    return `${hero(ch.title,`Fase ${ch.phase_no} • ${r?.name||'Equipe'}`)}
      <div class="sim-progress-top"><div><span>Seu progresso</span><strong>${roleProgress()}%</strong><div class="sim-progress"><i style="width:${roleProgress()}%"></i></div></div><div><span>XP individual</span><strong>${totalRoleXp()} XP</strong></div><div><span>Equipe</span><strong>${state.teamXp} XP</strong></div></div>
      <article class="panel sim-challenge-card"><div class="challenge-guide"><div><b>O que você deve fazer</b><span>${esc(pc.instructions||'Leia e resolva a atividade.')}</span></div><div><b>Como a equipe participa</b><span>${esc(pc.team_help||'Discuta com sua equipe quando necessário.')}</span></div><div class="time-hint"><b>Tempo sugerido</b><span>${esc(pc.time_hint||'—')}</span></div></div><p class="sim-prompt">${esc(ch.prompt).replaceAll('\n','<br>')}</p>${optionMarkup(ch,pc,ans)}<div class="sim-challenge-actions"><button class="button ghost" data-sim-save type="button">Salvar rascunho</button><button class="button primary" data-sim-submit type="button">${submitted?'Recalcular prévia':'Enviar resposta'}</button><span class="status-pill ${submitted?'good':''}">${submitted?`Enviado • ${scoreFor(ch)} XP`:'Não enviado'}</span></div></article>
      <div class="sim-challenge-nav">${cs.map((x,i)=>`<button class="${i===state.challengeIndex?'active':''} ${state.answers[x.challenge_key]?.submitted?'done':''}" data-challenge-index="${i}" type="button"><span>F${x.phase_no}</span>${esc(x.title)}</button>`).join('')}</div>`;
  }
  function renderRanking(){const r=rankData();if(!r.teams.length&&!r.students.length)return `${hero('Desempenho','Resultados da sessão')}<section class="panel sim-room-section"><p class="eyebrow">Sem pontuação</p><h3>O desempenho ainda não foi calculado.</h3><p class="muted">A classificação só aparece depois de uma entrega ou progresso real. Empates em zero não criam primeiro colocado.</p></section>`;return `${hero('Desempenho','Resultados da sessão')}<div class="layout2"><section class="panel sim-room-section"><p class="eyebrow">Equipes</p><h3>Desempenho das equipes</h3><div class="rank-list">${r.teams.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${x.mine?'Sua equipe':'Equipe'}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section><section class="panel sim-room-section"><p class="eyebrow">Individual</p><h3>Desempenho individual</h3><div class="rank-list">${r.students.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.team)} • ${esc(x.role)}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section></div>`;}
  function render(){updateControls();document.querySelectorAll('[data-sim-view-tab]').forEach(b=>b.classList.toggle('active',b.dataset.simViewTab===state.view));const view=state.view;$('sim-stage').innerHTML=view==='lobby'?renderLobby():view==='room'?renderRoom():view==='ranking'?renderRanking():renderChallenge();renderInspector();}
  function collectAnswer(ch){const old=state.answers[ch.challenge_key]||{},pc=ch.public_config||{};
    if(ch.challenge_type==='quiz_single')return {...old,choice:document.querySelector('input[name="sim-choice"]:checked')?.value||''};
    if(ch.challenge_type==='quiz_multi')return {...old,choices:[...document.querySelectorAll('input[name="sim-multi"]:checked')].map(x=>x.value)};
    if(['drag_match','drag_classify'].includes(ch.challenge_type)){const matches={};document.querySelectorAll('[data-match]').forEach(x=>matches[x.dataset.match]=x.value);return {...old,matches};}
    if(ch.challenge_type==='drag_order')return {...old,order:old.order?.length?old.order:[...(pc.items||[])].map(x=>x.id)};
    return {...old,text:$('sim-text')?.value||''};
  }
  function grade(ch,ans){const corr=ch.answer_key?.correct;if(corr==null)return Math.round(Number(ch.xp_max||0)*.4);
    let ok=false;
    if(ch.challenge_type==='quiz_multi'){const a=(ans.choices||[]).map(String).sort(),b=(Array.isArray(corr)?corr:[]).map(String).sort();ok=JSON.stringify(a)===JSON.stringify(b);}
    else if(ch.challenge_type==='drag_order'){const a=(ans.order||[]).map(String),b=(Array.isArray(corr)?corr:[]).map(String);ok=JSON.stringify(a)===JSON.stringify(b);}
    else if(['drag_match','drag_classify'].includes(ch.challenge_type))ok=JSON.stringify(ans.matches||{})===JSON.stringify(corr||{});
    else ok=String(ans.choice||'')===String(corr);
    return ok?Number(ch.xp_max||0):Math.round(Number(ch.xp_max||0)*.15);
  }
  async function loadCatalog(classId=''){
    setConnection('Carregando','warn');
    const data=await api('staff_simulator_catalog',classId?{class_id:classId}:{});state.catalog=data;
    if(!state.classId)state.classId=String(data.classes?.[0]?.id||'');
    if(classId)state.roster=data.roster||[];
    if(!state.templateKey)state.templateKey=data.templates?.[0]?.key||'';
    if(!state.leaderId)state.leaderId=(state.roster[0]?.id||'mock0');
    setConnection('Somente leitura','good');
  }
  function fillControls(){
    $('sim-class').innerHTML=(state.catalog?.classes||[]).map(c=>`<option value="${c.id}" ${String(c.id)===String(state.classId)?'selected':''}>${esc(c.name)}</option>`).join('');
    $('sim-template').innerHTML=(state.catalog?.templates||[]).map(t=>`<option value="${esc(t.key)}" ${t.key===state.templateKey?'selected':''}>${esc(t.subject_name)}</option>`).join('');
    $('sim-role').innerHTML=(state.catalog?.roles||[]).map(r=>`<option value="${r.role_key}" ${r.role_key===state.roleKey?'selected':''}>${r.icon} ${esc(r.name)}</option>`).join('');
  }
  function resetSim(){state.challengeIndex=0;state.answers={};state.xp={};state.teamXp=0;state.joinedRoom=1;const g=guildInfo(1);state.roomName=g.name;state.company={name:'',cnpj:'',city:'',phone:''};render();}
  function showSimulatorIntro(){
    document.querySelector('.preview-transition')?.remove();const host=document.createElement('div');host.className='preview-transition';host.innerHTML=`<div><span>PRÉVIA DO ALUNO</span><strong>${esc(state.sessionDetail?.session?.title||tpl()?.subject_name||'Prova prática')}</strong><small>Carregando a interface da avaliação · nenhuma alteração será gravada</small></div>`;document.body.appendChild(host);requestAnimationFrame(()=>host.classList.add('show'));setTimeout(()=>host.classList.add('leave'),900);setTimeout(()=>host.remove(),1350);
  }
  async function toggleImmersive(){
    const frame=$('sim-device-frame');if(!frame)return;
    if(document.fullscreenElement){await document.exitFullscreen?.();return;}
    try{await frame.requestFullscreen?.();frame.classList.add('sim-immersive-frame');showSimulatorIntro();}catch(e){console.warn('Fullscreen indisponível no navegador.',e);showSimulatorIntro();}
  }

  async function syncSessionPreview(){
    try{state.overview=await api('staff_overview',{});const candidates=(state.overview?.sessions||[]).filter(x=>String(x.class_id)===String(state.classId)&&!['cancelled','published'].includes(x.status)).sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0));const session=candidates[0]||(state.overview?.sessions||[]).find(x=>String(x.class_id)===String(state.classId));if(!session){state.sessionDetail=null;return;}const full=await api('staff_overview',{session_id:session.id});state.sessionDetail=full.detail||null;if(state.sessionDetail){state.roster=state.sessionDetail.roster||state.roster;const g=guildInfo(Math.min(state.joinedRoom,state.sessionDetail.clans?.length||1));state.roomName=g.name;state.leaderId=teamMembers().find(x=>x.isLeader)?.id||teamMembers()[0]?.id||null;}}catch(error){console.warn('Prévia da sessão real indisponível; mantendo catálogo somente leitura.',error);state.sessionDetail=null;}
  }
  async function signedIn(){
    let data=null;
    try{data=await api('staff_simulator_catalog',{});state.catalogMode='server';}
    catch(err){
      console.warn('Simulador usando catálogo local de demonstração porque o endpoint protegido do simulador ainda não está disponível no backend publicado.',err);
      const ov=await api('staff_overview',{});
      const base=window.AGV_PRACTICAL_EXAM_SIM_CATALOG||{};
      data={staff:ov.staff,classes:ov.classes||[],roster:[],roles:base.roles||[],room_themes:base.room_themes||[],templates:base.templates||[]};
      state.catalogMode='fallback';
    }
    state.catalog=data;state.classId=String(data.classes?.[0]?.id||'');state.templateKey=data.templates?.[0]?.key||'';$('staff-label').textContent=`${data.staff?.full_name||'Equipe'} • ${data.staff?.role||''}`;
    if(state.classId&&state.catalogMode==='server'){const d=await api('staff_simulator_catalog',{class_id:state.classId});state.catalog=d;state.roster=d.roster||[];}
    await syncSessionPreview();state.leaderId=teamMembers().find(x=>x.isLeader)?.id||state.roster[0]?.id||null;state.roomName=guildInfo(1).name;fillControls();$('login-view').classList.add('hidden');$('app-view').classList.remove('hidden');$('logout').classList.remove('hidden');render();
  }
  async function restore(){const s=await auth.getSession();if(!s){setConnection('Sem sessão');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();setConnection('Acesso negado','danger');}}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;msg('Entrando…');try{await auth.signIn($('email').value.trim().toLowerCase(),$('password').value);await signedIn();msg();}catch(err){console.error(err);msg('Conta sem permissão para o simulador.',true);}finally{b.disabled=false;}});
  $('logout').addEventListener('click',async()=>{await auth.signOut();location.reload();});
  $('sim-class').addEventListener('change',async e=>{state.classId=e.target.value;if(state.catalogMode!=='server'){state.roster=[];state.leaderId='mock0';render();return;}try{const d=await api('staff_simulator_catalog',{class_id:state.classId});state.catalog=d;state.roster=d.roster||[];state.joinedRoom=1;await syncSessionPreview();state.leaderId=teamMembers().find(x=>x.isLeader)?.id||state.roster[0]?.id||null;state.roomName=guildInfo(1).name;fillControls();render();}catch(err){console.error(err);state.roster=[];render();}});
  $('sim-template').addEventListener('change',e=>{state.templateKey=e.target.value;state.challengeIndex=0;state.answers={};state.xp={};render();});
  $('sim-view').addEventListener('change',e=>{state.view=e.target.value;render();});
  $('sim-role').addEventListener('change',e=>{state.roleKey=e.target.value;state.challengeIndex=0;render();});
  $('sim-profile').addEventListener('change',e=>{state.profile=e.target.value;render();});
  $('sim-device').addEventListener('change',e=>{state.device=e.target.value;render();});
  $('sim-theme').addEventListener('change',e=>{state.theme=e.target.value;render();});
  document.querySelectorAll('[data-sim-view-tab]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.simViewTab;render();}));
  $('sim-intro')?.addEventListener('click',showSimulatorIntro);
  $('sim-immersive')?.addEventListener('click',()=>toggleImmersive());
  document.addEventListener('fullscreenchange',()=>{const active=document.fullscreenElement===$('sim-device-frame');$('sim-device-frame')?.classList.toggle('sim-immersive-frame',active);const b=$('sim-immersive');if(b)b.textContent=active?'↙ Sair da tela cheia':'⛶ Tela cheia';});
  $('sim-reset').addEventListener('click',resetSim);
  $('sim-next').addEventListener('click',()=>{const n=roleChallenges().length;if(n){state.challengeIndex=(state.challengeIndex+1)%n;render();}});
  $('sim-stage').addEventListener('input',e=>{const ch=currentChallenge();if(ch&&state.view==='challenge')state.answers[ch.challenge_key]=collectAnswer(ch);});
  $('sim-stage').addEventListener('change',e=>{const ch=currentChallenge();if(ch&&state.view==='challenge')state.answers[ch.challenge_key]=collectAnswer(ch);});
  $('sim-stage').addEventListener('click',e=>{
    const t=e.target.closest('[data-sim-room],[data-sim-leader],[data-save-company],[data-sim-save],[data-sim-submit],[data-challenge-index],[data-order-up],[data-order-down]');if(!t)return;
    if(t.dataset.simRoom){state.joinedRoom=Number(t.dataset.simRoom);state.roomName=guildInfo(state.joinedRoom).name;state.leaderId=teamMembers().find(x=>x.isLeader)?.id||teamMembers()[0]?.id||null;render();return;}
    if(t.dataset.simLeader){state.leaderId=t.dataset.simLeader;render();return;}
    if(t.dataset.challengeIndex!=null){state.challengeIndex=Number(t.dataset.challengeIndex);render();return;}
    if(t.dataset.orderUp!=null||t.dataset.orderDown!=null){const ch=currentChallenge(),pc=ch.public_config||{},a=state.answers[ch.challenge_key]||{};let order=a.order?.length?[...a.order]:(pc.items||[]).map(x=>x.id);const i=Number(t.dataset.orderUp??t.dataset.orderDown),j=t.dataset.orderUp!=null?Math.max(0,i-1):Math.min(order.length-1,i+1);[order[i],order[j]]=[order[j],order[i]];state.answers[ch.challenge_key]={...a,order};render();return;}
    if(t.dataset.saveCompany!=null){document.querySelectorAll('[data-company]').forEach(x=>{if(x.dataset.company==='theme')state.theme=x.value;else state.company[x.dataset.company]=x.value;});render();return;}
    const ch=currentChallenge();if(!ch)return;const ans=collectAnswer(ch);state.answers[ch.challenge_key]=ans;
    if(t.dataset.simSave!=null){state.answers[ch.challenge_key]={...ans,draft:true};render();return;}
    if(t.dataset.simSubmit!=null){const xp=grade(ch,ans);state.answers[ch.challenge_key]={...ans,submitted:true,draft:false};state.xp[ch.challenge_key]=xp;state.teamXp=Math.min(1000,state.teamXp+Math.round(xp*.35));render();}
  });
  auth.onStorage(()=>restore());restore();
})();

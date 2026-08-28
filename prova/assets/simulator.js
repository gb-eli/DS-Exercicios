(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const state={catalog:null,roster:[],catalogMode:'server',classId:'',templateKey:'',roleKey:'analysis',view:'lobby',profile:'member',device:'desktop',theme:'cyber',challengeIndex:0,answers:{},xp:{},teamXp:360,joinedRoom:1,leaderId:null,roomName:'NEON WOLVES',company:{name:'NovaTech Sistemas',cnpj:'12.345.678/0001-90',city:'Paranaguá/PR',phone:'(41) 99999-0000'}};
  const guildCatalog=[
    {name:'NEON WOLVES',tag:'NW',icon:'🐺',accent:'#55d9ff',motto:'Caçamos bugs. Entregamos sistemas.'},
    {name:'BYTEFORGE',tag:'BF',icon:'⚒️',accent:'#61e9a7',motto:'Código forte. Squad mais forte.'},
    {name:'CODE TITANS',tag:'CT',icon:'⚡',accent:'#b69cff',motto:'Estratégia, lógica e execução.'},
    {name:'NULL RAIDERS',tag:'NR',icon:'☠️',accent:'#ff8a6b',motto:'Nenhum erro passa pelo radar.'},
    {name:'PIXEL PHANTOMS',tag:'PP',icon:'👾',accent:'#ff6fd8',motto:'Interface rápida. Missão limpa.'},
    {name:'STACK GUARD',tag:'SG',icon:'🛡️',accent:'#f4cf73',motto:'Protegemos cada camada.'}
  ];
  const guildInfo=n=>guildCatalog[Math.max(0,Math.min(guildCatalog.length-1,Number(n||1)-1))];
  const setConnection=(t,k='')=>{const e=$('connection-pill');if(e){e.textContent=t;e.className=`pill ${k}`.trim();}};
  const msg=(t='',err=false)=>{const e=$('login-message');if(e){e.textContent=t;e.classList.toggle('error',err)}};
  const roleByKey=k=>state.catalog?.roles?.find(r=>r.role_key===k)||null;
  const tpl=()=>state.catalog?.templates?.find(t=>t.key===state.templateKey)||state.catalog?.templates?.[0];
  const roleChallenges=()=>{const t=tpl();if(!t)return[];return t.challenges.filter(c=>c.scope==='clan'||c.role_key===state.roleKey);};
  const currentChallenge=()=>roleChallenges()[Math.min(state.challengeIndex,Math.max(0,roleChallenges().length-1))];
  const initials=name=>String(name||'Aluno').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const names=()=>state.roster.length?state.roster:Array.from({length:30},(_,i)=>({id:`mock${i}`,full_name:`Aluno ${String(i+1).padStart(2,'0')}`}));
  const teamMembers=()=>{
    const list=names().slice(0,6);
    const roles=state.catalog?.roles||[];
    return list.map((p,i)=>({...p,role_key:roles[i%roles.length]?.role_key||'analysis',isLeader:String(p.id)===String(state.leaderId)}));
  };
  const pct=(n,d)=>d?Math.round((n/d)*100):0;
  function scoreFor(ch){return Number(state.xp[ch?.challenge_key]||0);}
  function totalRoleXp(){return roleChallenges().reduce((a,c)=>a+scoreFor(c),0);}
  function maxRoleXp(){return roleChallenges().reduce((a,c)=>a+Number(c.xp_max||0),0);}
  function roleProgress(){const cs=roleChallenges();return pct(cs.filter(c=>state.answers[c.challenge_key]?.submitted).length,cs.length);}
  function rankData(){
    const students=names().slice(0,20).map((p,i)=>({name:p.full_name,team:guildInfo(1+(i%6)).name,role:(state.catalog?.roles||[])[i%8]?.name||'Área',xp:Math.max(40,720-i*23+(i%3)*19)}));
    if(students[0])students[0]={name:names()[0]?.full_name||'Você',team:state.roomName,role:roleByKey(state.roleKey)?.name||'',xp:totalRoleXp()+420,mine:true};
    students.sort((a,b)=>b.xp-a.xp);
    const teams=Array.from({length:6},(_,i)=>({name:i===0?state.roomName:guildInfo(i+1).name,xp:Math.max(300,860-i*67),mine:i===0}));
    return {students,teams};
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
        <div><span>Seu XP simulado</span><strong>${totalRoleXp()} / ${maxRoleXp()}</strong></div>
        <div><span>Guilda</span><strong>${esc(state.roomName)}</strong></div>
        <div><span>Equipe simulada</span><strong>${state.teamXp} XP</strong></div>
        <div><span>Fonte do catálogo</span><strong>${state.catalogMode==='server'?'Servidor protegido':'Catálogo local de demonstração'}</strong></div>
      </div>
      <h3>Integrantes simulados</h3>
      <div class="sim-mini-team">${team.map(m=>`<div><span>${m.isLeader?'👑':'•'}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem área')}</small></div>`).join('')}</div>
      ${c?`<h3>Missão atual</h3><p class="sim-current">Fase ${c.phase_no} • ${esc(c.title)}<br><small>${esc(c.challenge_type)} • ${Number(c.xp_max||0)} XP máx.</small></p>`:''}`;
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
    const g=guildInfo(state.joinedRoom),r=roleByKey(state.roleKey);
    return `<div class="sim-game-hud" style="--sim-accent:${g.accent}"><div class="sim-hud-brand"><span class="sim-hud-emblem">${g.icon}</span><div><small>MODO PROVA COLETIVA</small><strong>${esc(tpl()?.subject_name||'')}</strong></div></div><div class="sim-hud-stat"><small>GUILDA</small><strong>${esc(state.roomName)}</strong></div><div class="sim-hud-stat"><small>CARGO</small><strong>${esc(r?.name||'Aguardando')}</strong></div><div class="sim-hud-stat"><small>XP</small><strong>${state.teamXp}</strong></div><span class="sim-live-badge"><i></i> ONLINE</span></div><div class="sim-page-title game-title"><p class="eyebrow">${esc(sub)}</p><h2>${esc(title)}</h2></div>`;
  }
  function renderLobby(){
    const roster=names(),team=teamMembers();
    const rooms=Array.from({length:6},(_,i)=>({n:i+1,info:guildInfo(i+1),members:i===0?team.slice(0,4):roster.slice(4+i*3,Math.min(4+i*3+Math.max(0,3-(i%2)),roster.length))}));
    const looking=roster.slice(6,14);
    return `${hero('FORMAÇÃO DE ESQUADRÃO','MATCHMAKING • LOBBY PRÉ-PARTIDA')}
      <section class="sim-match-banner"><div><span class="sim-match-status"><i></i> LOBBY ONLINE</span><h1>MONTE SUA GUILDA</h1><p>Escolha o seu clã, eleja a liderança, distribua cargos e prepare o squad antes da missão começar.</p></div><div class="sim-countdown-orb"><small>INÍCIO EM</small><strong>15:00</strong><span>aguardando professor</span></div></section>
      <section class="sim-lobby-journey"><div class="done"><b>✓</b><span>Entrar no lobby</span></div><div class="current"><b>2</b><span>Escolher guilda</span></div><div><b>3</b><span>Eleger líder</span></div><div><b>4</b><span>Definir cargos</span></div><div><b>5</b><span>Ready!</span></div></section>
      <div class="sim-kpis game-kpis"><div><small>JOGADORES</small><strong>${roster.length}<i>/30</i></strong></div><div><small>GUILDAS</small><strong>6<i> squads</i></strong></div><div><small>NA SUA GUILDA</small><strong>${team.length}<i>/6</i></strong></div><div><small>STATUS</small><strong class="ready-text">READY CHECK</strong></div></div>
      <div class="sim-lobby-layout game-lobby-layout"><div><div class="sim-section-title"><div><span>GUILD SELECT</span><h3>Escolha seu esquadrão</h3></div><small>máximo 6 jogadores</small></div><div class="lobby-room-grid game-room-grid">${rooms.map(room=>{const selected=room.n===state.joinedRoom,leader=room.members[0];return `<article class="panel lobby-room-card game-guild-card ${selected?'selected':''}" style="--sim-accent:${room.info.accent};--room-accent:${room.info.accent}"><div class="game-guild-head"><span class="game-guild-emblem">${room.info.icon}</span><div><small>[${room.info.tag}] GUILDA ${String(room.n).padStart(2,'0')}</small><strong>${selected?esc(state.roomName):room.info.name}</strong><p>${room.info.motto}</p></div><span class="guild-capacity">${room.members.length}/6</span></div><div class="guild-slot-grid">${Array.from({length:6},(_,idx)=>{const m=room.members[idx];return m?`<div class="guild-slot filled ${idx===0?'leader':''}"><span>${idx===0?'👑':initials(m.full_name)}</span><div><strong>${esc(m.full_name)}</strong><small>${idx===0?'Líder provisório':'Jogador conectado'}</small></div></div>`:`<div class="guild-slot empty"><span>+</span><small>VAGA</small></div>`}).join('')}</div><div class="guild-card-footer"><span class="guild-ready-state ${leader?'ok':''}">${leader?'● liderança online':'○ sem líder'}</span><button class="button ${selected?'ghost':'primary'} small" data-sim-room="${room.n}" type="button">${selected?'✓ GUILDA ATUAL':'ENTRAR NA GUILDA'}</button></div></article>`}).join('')}</div></div>
      <aside class="sim-lobby-side"><section class="panel sim-side-card"><div class="sim-section-title"><div><span>FIND TEAM</span><h3>Jogadores livres</h3></div><small>${Math.max(0,roster.length-team.length)} buscando squad</small></div><div class="sim-looking-list">${looking.map((p,i)=>`<div><span class="player-avatar">${initials(p.full_name)}</span><div><strong>${esc(p.full_name)}</strong><small>${(state.catalog?.roles||[])[(i+2)%Math.max(1,(state.catalog?.roles||[]).length)]?.name||'Cargo livre'}</small></div><i class="presence-dot in-room"></i></div>`).join('')}</div><button class="button ghost small sim-side-action" type="button">Ver todos os jogadores</button></section><section class="panel sim-side-card sim-chat-preview"><div class="sim-section-title"><div><span>GLOBAL COMMS</span><h3>Canal do lobby</h3></div><small>moderado</small></div><div class="sim-chat-line"><b>ByteForge</b><p>Falta 1 pessoa para fechar o squad 👀</p></div><div class="sim-chat-line mine"><b>${esc(state.roomName)}</b><p>Precisamos de QA ou Front-end.</p></div><div class="sim-chat-compose-fake"><span>Mensagem bloqueada na simulação</span><button type="button">➤</button></div></section></aside></div>`;
  }
  function renderRoom(){
    const team=teamMembers(),r=roleByKey(state.roleKey),g=guildInfo(state.joinedRoom);
    return `${hero(state.roomName,'SQUAD ROOM • PREPARAÇÃO DA GUILDA')}
      <section class="sim-squad-hero" style="--sim-accent:${g.accent}"><div class="sim-squad-emblem">${g.icon}</div><div class="sim-squad-copy"><span class="sim-match-status"><i></i> GUILDA CONECTADA</span><h1>${esc(state.roomName)}</h1><p>${esc(state.company.name)} • ${esc(state.company.city)}</p><div class="sim-squad-tags"><span>👥 ${team.length}/6</span><span>👑 ${esc(team.find(x=>x.isLeader)?.full_name||'eleição')}</span><span>🎨 ${esc(state.theme)}</span><span>⚡ ${state.teamXp} XP</span></div></div><button id="sim-room-ready" class="sim-ready-button" type="button"><b>READY</b><small>confirmar preparação</small></button></section>
      <div class="sim-room-game-grid"><div><section class="panel sim-room-section game-panel"><div class="sim-section-title"><div><span>SQUAD LOADOUT</span><h3>Cargos do esquadrão</h3></div><small>1 função por jogador</small></div><div class="sim-team-cards game-team-cards">${team.map((m,i)=>`<div class="${m.isLeader?'leader':''} ${m.role_key===state.roleKey?'mine':''}"><span class="player-avatar large">${m.isLeader?'👑':initials(m.full_name)}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem cargo')}</small><em>${m.role_key===state.roleKey?'VOCÊ':m.isLeader?'LÍDER':'ONLINE'}</em></div>`).join('')}</div></section>
      <section class="panel sim-room-section game-panel"><div class="sim-section-title"><div><span>LEADER ELECTION</span><h3>Eleição de liderança</h3></div><small>voto individual</small></div><div class="leader-vote-grid game-vote-grid">${team.map((m,i)=>`<button class="leader-vote-card ${m.isLeader?'elected':''}" data-sim-leader="${esc(m.id)}" type="button"><span>${m.isLeader?'👑':initials(m.full_name)}</span><div><strong>${esc(m.full_name)}</strong><small>${m.isLeader?'Líder atual':`${1+(i%3)} voto(s)`}</small></div></button>`).join('')}</div></section>
      ${state.profile==='leader'?`<section class="panel sim-room-section leader-console game-panel"><div class="sim-section-title"><div><span>COMMANDER CONSOLE</span><h3>Configuração da guilda</h3></div><small>acesso do líder</small></div><div class="room-settings-grid"><label>Empresa fictícia<input data-company="name" value="${esc(state.company.name)}"></label><label>CNPJ fictício<input data-company="cnpj" value="${esc(state.company.cnpj)}"></label><label>Cidade<input data-company="city" value="${esc(state.company.city)}"></label><label>Telefone<input data-company="phone" value="${esc(state.company.phone)}"></label><label>Tema<select data-company="theme">${(state.catalog?.room_themes||[]).map(x=>`<option ${x===state.theme?'selected':''}>${esc(x)}</option>`).join('')}</select></label><button class="button primary" data-save-company type="button">SALVAR LOADOUT</button></div></section>`:''}</div>
      <aside class="sim-squad-sidebar"><section class="panel sim-side-card mission-board"><div class="sim-section-title"><div><span>MISSION BOARD</span><h3>Objetivos pré-partida</h3></div><small>4/5</small></div><div class="mission-check done"><b>✓</b><span>Entrar na guilda</span></div><div class="mission-check done"><b>✓</b><span>Eleger liderança</span></div><div class="mission-check done"><b>✓</b><span>Escolher cargo</span></div><div class="mission-check done"><b>✓</b><span>Definir identidade</span></div><div class="mission-check current"><b>5</b><span>Aguardar professor</span></div></section><section class="panel sim-side-card sim-chat-preview squad-chat"><div class="sim-section-title"><div><span>GUILD CHAT</span><h3>Chat do esquadrão</h3></div><small>privado</small></div><div class="sim-chat-line"><b>👑 Líder</b><p>QA confere os critérios; Front cuida da interface.</p></div><div class="sim-chat-line"><b>🧪 QA</b><p>Fechado. Vou testar antes do envio.</p></div><div class="sim-chat-line mine"><b>Você</b><p>Pronto para iniciar a missão.</p></div><div class="sim-chat-compose-fake"><span>Mensagem da guilda...</span><button type="button">➤</button></div></section></aside></div>`;
  }
  function optionMarkup(ch,pc,ans){
    if(ch.challenge_type==='quiz_single')return `<div class="sim-options">${(pc.options||[]).map(o=>`<label class="option"><input type="radio" name="sim-choice" value="${esc(o.id)}" ${String(ans.choice||'')===String(o.id)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(ch.challenge_type==='quiz_multi')return `<div class="sim-options">${(pc.options||[]).map(o=>`<label class="option"><input type="checkbox" name="sim-multi" value="${esc(o.id)}" ${(ans.choices||[]).map(String).includes(String(o.id))?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>`;
    if(['drag_match','drag_classify'].includes(ch.challenge_type))return `<div class="sim-match-grid">${(pc.items||[]).map(it=>`<label><span>${esc(it.label)}</span><select data-match="${esc(it.id)}"><option value="">Selecione…</option>${(pc.targets||[]).map(t=>`<option value="${esc(t.id)}" ${String(ans.matches?.[it.id]||'')===String(t.id)?'selected':''}>${esc(t.label)}</option>`).join('')}</select></label>`).join('')}</div>`;
    if(ch.challenge_type==='drag_order')return `<div class="sim-order-editor">${(ans.order?.length?ans.order:(pc.items||[]).map(x=>x.id)).map((id,i)=>{const it=(pc.items||[]).find(x=>String(x.id)===String(id));return `<div><span>${i+1}</span><strong>${esc(it?.label||id)}</strong><button data-order-up="${i}" type="button">↑</button><button data-order-down="${i}" type="button">↓</button></div>`}).join('')}</div>`;
    const val=ans.text||'';return `<textarea id="sim-text" class="${ch.challenge_type==='code_text'?'code-input':''}" placeholder="${esc(pc.placeholder||'Digite sua resposta…')}">${esc(val)}</textarea>`;
  }
  function renderChallenge(){
    const cs=roleChallenges(),ch=currentChallenge();if(!ch)return `${hero('Sem desafio','Escolha outra área')}<div class="empty-card">Não há desafios nesta área.</div>`;
    const pc=ch.public_config||{},ans=state.answers[ch.challenge_key]||{},r=roleByKey(state.roleKey);
    const submitted=!!ans.submitted;
    return `${hero(ch.title,`Fase ${ch.phase_no} • ${r?.name||'Equipe'}`)}
      <div class="sim-progress-top"><div><span>Seu progresso</span><strong>${roleProgress()}%</strong><div class="sim-progress"><i style="width:${roleProgress()}%"></i></div></div><div><span>XP individual</span><strong>${totalRoleXp()} XP</strong></div><div><span>Equipe</span><strong>${state.teamXp} XP</strong></div></div>
      <article class="panel sim-challenge-card"><div class="challenge-guide"><div><b>O que você deve fazer</b><span>${esc(pc.instructions||'Leia e resolva o desafio.')}</span></div><div><b>Como a equipe participa</b><span>${esc(pc.team_help||'Discuta com sua equipe quando necessário.')}</span></div><div class="time-hint"><b>Tempo sugerido</b><span>${esc(pc.time_hint||'—')}</span></div></div><p class="sim-prompt">${esc(ch.prompt).replaceAll('\n','<br>')}</p>${optionMarkup(ch,pc,ans)}<div class="sim-challenge-actions"><button class="button ghost" data-sim-save type="button">Salvar rascunho</button><button class="button primary" data-sim-submit type="button">${submitted?'Recalcular simulação':'Enviar resposta'}</button><span class="status-pill ${submitted?'good':''}">${submitted?`Enviado • ${scoreFor(ch)} XP`:'Não enviado'}</span></div></article>
      <div class="sim-challenge-nav">${cs.map((x,i)=>`<button class="${i===state.challengeIndex?'active':''} ${state.answers[x.challenge_key]?.submitted?'done':''}" data-challenge-index="${i}" type="button"><span>F${x.phase_no}</span>${esc(x.title)}</button>`).join('')}</div>`;
  }
  function renderRanking(){const r=rankData();return `${hero('Ranking geral','Desempenho simulado da turma')}<div class="layout2"><section class="panel sim-room-section"><p class="eyebrow">Equipes</p><h3>Ranking das guildas</h3><div class="rank-list">${r.teams.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${x.mine?'Sua equipe':'Guilda adversária'}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section><section class="panel sim-room-section"><p class="eyebrow">Individual</p><h3>Ranking geral dos alunos</h3><div class="rank-list">${r.students.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.team)} • ${esc(x.role)}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section></div>`;}
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
  function resetSim(){state.challengeIndex=0;state.answers={};state.xp={};state.teamXp=360;state.joinedRoom=1;state.roomName='NEON WOLVES';state.company={name:'NovaTech Sistemas',cnpj:'12.345.678/0001-90',city:'Paranaguá/PR',phone:'(41) 99999-0000'};render();}
  function showSimulatorIntro(){
    document.querySelector('.match-intro.simulator-intro')?.remove();
    const g=guildInfo(state.joinedRoom),host=document.createElement('div');
    host.className='match-intro simulator-intro';
    host.innerHTML=`<div class="match-intro-grid"></div><article><span class="match-kicker">MATCH FOUND</span><div class="sim-intro-emblem">${g.icon}</div><h1>${esc(state.roomName)}</h1><p>ESQUADRÃO CONFIRMADO • PREPARANDO MISSÃO</p><div class="match-countdown"><b>3</b><b>2</b><b>1</b></div><strong class="match-go">MISSÃO INICIADA</strong></article>`;
    document.body.appendChild(host);requestAnimationFrame(()=>host.classList.add('go'));setTimeout(()=>host.classList.add('launch'),2200);setTimeout(()=>host.remove(),3300);
  }
  async function toggleImmersive(){
    const frame=$('sim-device-frame');if(!frame)return;
    if(document.fullscreenElement){await document.exitFullscreen?.();return;}
    try{await frame.requestFullscreen?.();frame.classList.add('sim-immersive-frame');showSimulatorIntro();}catch(e){console.warn('Fullscreen indisponível no navegador.',e);showSimulatorIntro();}
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
    state.leaderId=state.roster[0]?.id||'mock0';fillControls();$('login-view').classList.add('hidden');$('app-view').classList.remove('hidden');$('logout').classList.remove('hidden');render();
  }
  async function restore(){const s=await auth.getSession();if(!s){setConnection('Sem sessão');return;}try{await signedIn();}catch(e){console.error(e);await auth.signOut();setConnection('Acesso negado','danger');}}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;msg('Entrando…');try{await auth.signIn($('email').value.trim().toLowerCase(),$('password').value);await signedIn();msg();}catch(err){console.error(err);msg('Conta sem permissão para o simulador.',true);}finally{b.disabled=false;}});
  $('logout').addEventListener('click',async()=>{await auth.signOut();location.reload();});
  $('sim-class').addEventListener('change',async e=>{state.classId=e.target.value;if(state.catalogMode!=='server'){state.roster=[];state.leaderId='mock0';render();return;}try{const d=await api('staff_simulator_catalog',{class_id:state.classId});state.catalog=d;state.roster=d.roster||[];state.leaderId=state.roster[0]?.id||'mock0';fillControls();render();}catch(err){console.error(err);state.roster=[];render();}});
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
    if(t.dataset.simRoom){state.joinedRoom=Number(t.dataset.simRoom);state.roomName=guildInfo(state.joinedRoom).name;render();return;}
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

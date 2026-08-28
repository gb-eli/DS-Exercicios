(()=>{
  'use strict';
  const cfg=window.AGV_PRACTICAL_EXAM_CONFIG;
  const auth=window.AGVSession.create({supabaseUrl:cfg.supabaseUrl,publishableKey:cfg.publishableKey});
  const $=id=>document.getElementById(id);
  const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const api=(action,body={})=>auth.request(`/functions/v1/${cfg.functionName}`,{method:'POST',body:{action,...body}});
  const state={catalog:null,roster:[],catalogMode:'server',classId:'',templateKey:'',roleKey:'analysis',view:'lobby',profile:'member',device:'desktop',theme:'cyber',challengeIndex:0,answers:{},xp:{},teamXp:360,joinedRoom:1,leaderId:null,roomName:'SALA 1',company:{name:'NovaTech Sistemas',cnpj:'12.345.678/0001-90',city:'Paranaguá/PR',phone:'(41) 99999-0000'}};
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
    const students=names().slice(0,20).map((p,i)=>({name:p.full_name,team:`SALA ${1+(i%6)}`,role:(state.catalog?.roles||[])[i%8]?.name||'Área',xp:Math.max(40,720-i*23+(i%3)*19)}));
    if(students[0])students[0]={name:names()[0]?.full_name||'Você',team:state.roomName,role:roleByKey(state.roleKey)?.name||'',xp:totalRoleXp()+420,mine:true};
    students.sort((a,b)=>b.xp-a.xp);
    const teams=Array.from({length:6},(_,i)=>({name:i===0?state.roomName:`SALA ${i+1}`,xp:Math.max(300,860-i*67),mine:i===0}));
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
        <div><span>Equipe</span><strong>${esc(state.roomName)}</strong></div>
        <div><span>Equipe simulada</span><strong>${state.teamXp} XP</strong></div><div><span>Catálogo</span><strong>${state.catalogMode==='server'?'Servidor protegido':'Fallback público'}</strong></div>
      </div>
      <h3>Integrantes simulados</h3>
      <div class="sim-mini-team">${team.map((m,i)=>`<div><span>${m.isLeader?'👑':'•'}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem área')}</small></div>`).join('')}</div>
      ${c?`<h3>Desafio atual</h3><p class="sim-current">Fase ${c.phase_no} • ${esc(c.title)}<br><small>${esc(c.challenge_type)} • ${Number(c.xp_max||0)} XP máx.</small></p>`:''}`;
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
  function hero(title,sub){return `<div class="sim-student-top"><div><span class="brand-mark small">DS</span><div><strong>Modo Prova Coletiva</strong><small>${esc(tpl()?.subject_name||'')}</small></div></div><span class="status-pill warn">SIMULAÇÃO</span></div><div class="sim-page-title"><p class="eyebrow">${esc(sub)}</p><h2>${esc(title)}</h2></div>`;}
  function renderLobby(){
    const roster=names(),rooms=Array.from({length:6},(_,i)=>({n:i+1,members:i===0?teamMembers().slice(0,4):roster.slice(4+i*3,Math.min(4+i*3+Math.max(0,3-(i%2)),roster.length))}));
    return `${hero('Lobby geral','Organize sua equipe antes do início')}
      <div class="sim-kpis"><div><strong>${roster.length}</strong><span>alunos</span></div><div><strong>6</strong><span>salas</span></div><div><strong>até 6</strong><span>por equipe</span></div><div><strong>15:00</strong><span>pré-lobby</span></div></div>
      <div class="sim-lobby-layout"><div><h3>Salas disponíveis</h3><div class="lobby-room-grid">${rooms.map(room=>`<article class="panel lobby-room-card ${room.n===state.joinedRoom?'selected':''}" style="--room-accent:${room.n===1?'#55d9ff':'#61e9a7'}"><div class="lobby-room-top"><div><span class="room-number">SALA ${room.n}</span><strong>${room.n===1?esc(state.roomName):`SALA ${room.n}`}</strong><small>${room.members.length}/6 integrantes</small></div><span class="status-pill ${room.members.length>=6?'danger':'good'}">${room.members.length>=6?'Lotada':'Aberta'}</span></div><div class="lobby-room-members">${room.members.length?room.members.map(m=>`<div class="lobby-room-member"><span>${esc(m.full_name)}</span><small>${m.isLeader?'👑 líder':'aguardando'}</small></div>`).join(''):'<small class="muted">Sala vazia</small>'}</div><button class="button ${room.n===state.joinedRoom?'ghost':'primary'} small" data-sim-room="${room.n}" type="button">${room.n===state.joinedRoom?'Sair / trocar':'Entrar nesta sala'}</button></article>`).join('')}</div></div>
      <aside><h3>Alunos da turma</h3><div class="lobby-roster">${roster.map((p,i)=>`<div class="lobby-student ${i===0?'me':''}"><span class="presence-dot ${i<teamMembers().length?'in-room':''}"></span><div><strong>${esc(p.full_name)}</strong><small>${i<6?`${state.roomName} • online`:'No lobby • online'}</small></div></div>`).join('')}</div></aside></div>`;
  }
  function renderRoom(){
    const team=teamMembers(),r=roleByKey(state.roleKey);
    return `${hero(state.roomName,'Sala da equipe')}
      <div class="sim-company-banner"><div><p class="eyebrow">Empresa fictícia</p><h2>${esc(state.company.name)}</h2><p>${esc(state.company.city)} • ${esc(state.company.cnpj)} • ${esc(state.company.phone)}</p></div><span class="status-pill live">Lobby aberto</span></div>
      <div class="company-strip"><span><b>Líder</b>${esc(team.find(x=>x.isLeader)?.full_name||'Eleição em andamento')}</span><span><b>Sua área</b>${esc(r?.name||'')}</span><span><b>Tema</b>${esc(state.theme)}</span><span><b>Vagas</b>${team.length}/6</span></div>
      <section class="panel sim-room-section"><div class="section-head"><div><p class="eyebrow">Eleição</p><h3>Escolha do líder</h3><p>O mais votado assume as configurações da equipe antes da prova.</p></div></div><div class="leader-vote-grid">${team.map((m,i)=>`<button class="leader-vote-card ${m.isLeader?'elected':''}" data-sim-leader="${esc(m.id)}" type="button"><span>${m.isLeader?'👑':'🗳️'}</span><div><strong>${esc(m.full_name)}</strong><small>${m.isLeader?'Líder atual':`${1+(i%3)} voto(s)`}</small></div></button>`).join('')}</div></section>
      ${state.profile==='leader'?`<section class="panel sim-room-section leader-console"><p class="eyebrow">Console do líder</p><h3>Configuração da empresa</h3><div class="room-settings-grid"><label>Nome da equipe<input data-company="name" value="${esc(state.company.name)}"></label><label>CNPJ fictício<input data-company="cnpj" value="${esc(state.company.cnpj)}"></label><label>Cidade<input data-company="city" value="${esc(state.company.city)}"></label><label>Telefone<input data-company="phone" value="${esc(state.company.phone)}"></label><label>Tema<select data-company="theme">${(state.catalog?.room_themes||[]).map(x=>`<option ${x===state.theme?'selected':''}>${esc(x)}</option>`).join('')}</select></label><button class="button primary" data-save-company type="button">Aplicar na simulação</button></div><h3>Funções da equipe</h3><div class="leader-member-list">${team.map((m,i)=>`<div class="leader-member-row"><div><strong>${esc(m.full_name)}</strong><small>${m.isLeader?'Líder eleito':'Integrante'}</small></div><select data-sim-member-role="${i}">${(state.catalog?.roles||[]).map(x=>`<option value="${x.role_key}" ${x.role_key===m.role_key?'selected':''}>${esc(x.name)}</option>`).join('')}</select><button class="button danger small" type="button" ${m.isLeader?'disabled':''}>Expulsar</button></div>`).join('')}</div></section>`:`<section class="panel sim-room-section"><p class="eyebrow">Sua equipe</p><h3>Funções definidas pelo líder</h3><div class="sim-team-cards">${team.map(m=>`<div><span>${m.isLeader?'👑':roleByKey(m.role_key)?.icon||'•'}</span><strong>${esc(m.full_name)}</strong><small>${esc(roleByKey(m.role_key)?.name||'Sem área')}</small><em>${m.role_key===state.roleKey?'VOCÊ':''}</em></div>`).join('')}</div></section>`}`;
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
  function renderRanking(){const r=rankData();return `${hero('Ranking geral','Desempenho simulado da turma')}<div class="layout2"><section class="panel sim-room-section"><p class="eyebrow">Equipes</p><h3>Ranking geral das salas</h3><div class="rank-list">${r.teams.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${x.mine?'Sua equipe':'Equipe da turma'}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section><section class="panel sim-room-section"><p class="eyebrow">Individual</p><h3>Ranking geral dos alunos</h3><div class="rank-list">${r.students.map((x,i)=>`<div class="rank-row ${x.mine?'mine':''}"><span class="rank-pos">${i+1}º</span><div><strong>${esc(x.name)}</strong><small>${esc(x.team)} • ${esc(x.role)}</small></div><b>${x.xp} XP</b></div>`).join('')}</div></section></div>`;}
  function render(){updateControls();const view=state.view;$('sim-stage').innerHTML=view==='lobby'?renderLobby():view==='room'?renderRoom():view==='ranking'?renderRanking():renderChallenge();renderInspector();}
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
  function resetSim(){state.challengeIndex=0;state.answers={};state.xp={};state.teamXp=360;state.joinedRoom=1;state.roomName='SALA 1';state.company={name:'NovaTech Sistemas',cnpj:'12.345.678/0001-90',city:'Paranaguá/PR',phone:'(41) 99999-0000'};render();}
  async function signedIn(){
    let data=null;
    try{data=await api('staff_simulator_catalog',{});state.catalogMode='server';}
    catch(err){
      console.warn('Simulador usando catálogo público de fallback até o backend v27 ser publicado.',err);
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
  $('sim-reset').addEventListener('click',resetSim);
  $('sim-next').addEventListener('click',()=>{const n=roleChallenges().length;if(n){state.challengeIndex=(state.challengeIndex+1)%n;render();}});
  $('sim-stage').addEventListener('input',e=>{const ch=currentChallenge();if(ch&&state.view==='challenge')state.answers[ch.challenge_key]=collectAnswer(ch);});
  $('sim-stage').addEventListener('change',e=>{const ch=currentChallenge();if(ch&&state.view==='challenge')state.answers[ch.challenge_key]=collectAnswer(ch);});
  $('sim-stage').addEventListener('click',e=>{
    const t=e.target.closest('[data-sim-room],[data-sim-leader],[data-save-company],[data-sim-save],[data-sim-submit],[data-challenge-index],[data-order-up],[data-order-down]');if(!t)return;
    if(t.dataset.simRoom){state.joinedRoom=Number(t.dataset.simRoom);state.roomName=`SALA ${state.joinedRoom}`;render();return;}
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

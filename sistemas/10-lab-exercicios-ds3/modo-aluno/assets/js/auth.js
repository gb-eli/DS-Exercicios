window.AppAuth = (() => {
  const SESSION_DAYS = 5;
  const MAX_LOGS = 1200;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const config = () => window.APP_CONFIG || {};
  const scope = () => 'aluno';

  function safeToken(value = '') {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'plataforma';
  }

  const projectToken = () => `ds3_${safeToken(config().repositorio || '3ds-programacao')}`;
  const key = name => `${projectToken()}_${scope()}_${name}_v2`;
  const legacyKey = name => `ds2_${scope()}_${name}_v1`;

  function storageGet(name) {
    const currentKey = key(name);
    const current = localStorage.getItem(currentKey);
    if (current !== null) return current;
    const legacy = localStorage.getItem(legacyKey(name));
    if (legacy !== null) {
      localStorage.setItem(currentKey, legacy);
      return legacy;
    }
    return null;
  }

  function storageSet(name, value) {
    localStorage.setItem(key(name), value);
  }

  function storageRemove(name) {
    localStorage.removeItem(key(name));
  }

  function exerciseStateKey(username, number) {
    return `${projectToken()}_aluno_${safeToken(username || 'sem-usuario')}_ex${number}_state_v6`;
  }

  function readExerciseState(username, number) {
    const currentKey = exerciseStateKey(username, number);
    let raw = localStorage.getItem(currentKey);
    if (raw === null) {
      const legacyKeys = [
        `${projectToken()}_aluno_${safeToken(username || 'sem-usuario')}_ex${number}_state_v5`,
        `ds3_${safeToken(username || 'sem-usuario')}_ex${number}_state_v4`
      ];
      for (const legacyKey of legacyKeys) {
        const legacy = localStorage.getItem(legacyKey);
        if (legacy !== null) {
          localStorage.setItem(currentKey, legacy);
          raw = legacy;
          break;
        }
      }
    }
    return raw;
  }
  let currentUser = null;
  let initialized = false;
  let lastActivity = Date.now();

  function bytesToBase64(bytes) {
    let value = '';
    bytes.forEach(byte => { value += String.fromCharCode(byte); });
    return btoa(value);
  }

  function base64ToBytes(value) {
    const raw = atob(value);
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  }

  function randomBytes(length = 16) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  async function digestPassword(password, salt) {
    if (!crypto?.subtle) throw new Error('Web Crypto indisponível. Abra a plataforma por HTTPS ou servidor local.');
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: base64ToBytes(salt),
      iterations: 140000,
      hash: 'SHA-256'
    }, material, 256);
    return bytesToBase64(new Uint8Array(bits));
  }

  function safeEqual(left = '', right = '') {
    if (left.length !== right.length) return false;
    let result = 0;
    for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
    return result === 0;
  }

  async function deviceCryptoKey() {
    if (!crypto?.subtle) return null;
    let raw = storageGet('device_key');
    if (!raw) {
      raw = bytesToBase64(randomBytes(32));
      storageSet('device_key', raw);
    }
    return crypto.subtle.importKey('raw', base64ToBytes(raw), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }

  async function encryptSession(payload) {
    const deviceKey = await deviceCryptoKey();
    if (!deviceKey) throw new Error('Criptografia local indisponível.');
    const iv = randomBytes(12);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, deviceKey, encoder.encode(JSON.stringify(payload)));
    return JSON.stringify({ iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)), algorithm: 'AES-GCM' });
  }

  async function decryptSession(raw) {
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const deviceKey = await deviceCryptoKey();
    if (!deviceKey) return null;
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(parsed.iv) }, deviceKey, base64ToBytes(parsed.data));
    return JSON.parse(decoder.decode(decrypted));
  }

  function users() {
    try { return JSON.parse(storageGet('users')) || []; }
    catch (error) { return []; }
  }

  function saveUsers(list) {
    storageSet('users', JSON.stringify(list));
  }

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '.');
  }

  function logs() {
    try { return JSON.parse(storageGet('logs')) || []; }
    catch (error) { return []; }
  }

  function log(action, details = {}) {
    const list = logs();
    const exerciseSelector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    const index = Number(exerciseSelector?.value);
    const exercise = Number.isInteger(index) ? window.EXERCICIOS?.[index] : null;
    list.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toISOString(),
      user: currentUser?.username || 'sem-sessao',
      displayName: currentUser?.displayName || '',
      role: scope(),
      action,
      exercise: exercise?.numero || null,
      version: config().version || '',
      details
    });
    storageSet('logs', JSON.stringify(list.slice(-MAX_LOGS)));
  }

  async function saveSession(extra = {}) {
    if (!currentUser) return;
    const previous = await readSession().catch(() => null);
    const now = Date.now();
    const payload = {
      username: currentUser.username,
      role: scope(),
      issuedAt: previous?.issuedAt || now,
      expiresAt: previous?.expiresAt || now + SESSION_DAYS * 24 * 60 * 60 * 1000,
      locked: Boolean(extra.locked ?? previous?.locked),
      lastExercise: extra.lastExercise ?? previous?.lastExercise ?? null,
      lastView: extra.lastView ?? previous?.lastView ?? 'home',
      lastSeenAt: now
    };
    storageSet('session', await encryptSession(payload));
  }

  async function readSession() {
    const raw = storageGet('session');
    if (!raw) return null;
    try {
      const session = await decryptSession(raw);
      if (!session || session.role !== scope() || Date.now() > session.expiresAt) {
        storageRemove('session');
        return null;
      }
      return session;
    } catch (error) {
      storageRemove('session');
      return null;
    }
  }

  function userByUsername(username) {
    return users().find(item => item.username === normalizeUsername(username));
  }

  function authMarkup() {
    return `
      <div id="authGate" class="auth-gate" role="dialog" aria-modal="true" aria-labelledby="authPlatformTitle" aria-describedby="authPlatformDescription">
        <div class="auth-background-grid"></div>
        <article class="auth-panel card">
          <div class="auth-brand"><span class="auth-logo">&lt;/&gt;</span><div><small>3º DS · Aluno</small><h1 id="authPlatformTitle">Programação no Desenvolvimento de Sistemas</h1><p id="authPlatformDescription">Sessão local criptografada neste navegador por até ${SESSION_DAYS} dias.</p></div></div>
          <div id="authTabs" class="auth-tabs"><button type="button" data-auth-tab="login" class="active">Entrar</button><button type="button" data-auth-tab="register">Criar usuário local</button></div>
          <form id="loginForm" class="auth-form">
            <label>Usuário<input id="loginUsername" required autocomplete="username" placeholder="Seu usuário"></label>
            <label>Senha<input id="loginPassword" type="password" required autocomplete="current-password" placeholder="Sua senha"></label>
            <button type="submit">Entrar</button>
            <div id="recentUsers" class="recent-users"></div>
          </form>
          <form id="registerForm" class="auth-form" hidden>
            <label>Nome para exibição<input id="registerName" required maxlength="60" placeholder="Nome e sobrenome"></label>
            <label>Usuário<input id="registerUsername" required maxlength="30" autocomplete="username" placeholder="Ex.: gabriel ou aluno.2a"></label>
            <label>Turma<input id="registerGroup" maxlength="30" placeholder="Ex.: 3º DS C"></label>
            <label>Senha<input id="registerPassword" type="password" minlength="6" required autocomplete="new-password" placeholder="Mínimo de 6 caracteres"></label>
            <label>Confirmar senha<input id="registerConfirm" type="password" minlength="6" required autocomplete="new-password"></label>
            <button type="submit">Criar usuário e entrar</button>
          </form>
          <form id="unlockForm" class="auth-form" hidden>
            <div class="lock-symbol">🔒</div><h2 id="lockedUserName">Sessão bloqueada</h2><p>Digite a senha para continuar sem perder o progresso.</p>
            <label>Senha<input id="unlockPassword" type="password" required autocomplete="current-password"></label>
            <button type="submit">Desbloquear</button><button type="button" class="secondary" data-auth-switch>Trocar de usuário</button>
          </form>
          <p id="authMessage" class="auth-message" role="status" aria-live="polite"></p>
          <details class="auth-security"><summary>Como os dados são guardados?</summary><p>A senha não é salva em texto. É armazenado um hash derivado por PBKDF2. A sessão de 5 dias é criptografada com AES-GCM no armazenamento local. Por ser uma plataforma estática, isso protege o uso comum no dispositivo, mas não substitui autenticação em servidor.</p></details>
        </article>
      </div>`;
  }

  function injectUserControls() {
    const container = $('#studentHeaderActions');
    if (!container || $('#authUserMenu')) return;
    const menu = document.createElement('div');
    menu.id = 'authUserMenu';
    menu.className = 'auth-user-menu';
    menu.innerHTML = `
      <button id="authUserButton" class="ghost auth-user-button" aria-expanded="false" aria-controls="authUserPopover"><span class="auth-avatar">U</span><span class="auth-user-label">Usuário</span></button>
      <div id="authUserPopover" class="auth-user-popover card" role="menu" hidden>
        <div class="auth-user-summary"><strong id="authDisplayName"></strong><span id="authUsername"></span><small>Sessão local por 5 dias</small></div>
        <button type="button" data-auth-home>Início e exercícios</button>
        <button type="button" class="secondary" data-auth-lock>Bloquear</button>
        <button type="button" class="secondary" data-auth-switch>Trocar usuário</button>
        <button type="button" class="secondary" data-auth-export="json">Exportar logs JSON</button>
        <button type="button" class="secondary" data-auth-export="csv">Exportar logs CSV</button>
        <button type="button" class="danger" data-auth-logout>Sair</button>
      </div>`;
    const versionButton = container.querySelector('.version-mini');
    container.insertBefore(menu, versionButton || null);
  }

  function dashboardMarkup() {
    const dashboard = document.createElement('section');
    dashboard.id = 'appDashboard';
    dashboard.className = 'app-dashboard';
    dashboard.hidden = true;
    dashboard.innerHTML = `
      <section id="platformHome" class="platform-home">
        <div class="platform-home-hero card">
          <div class="platform-home-copy">
            <span class="eyebrow">3º DS · Manhã · Modo Aluno</span>
            <h2>Programação no Desenvolvimento de Sistemas</h2>
            <p id="dashboardGreeting" class="home-greeting">Olá!</p>
            <p class="platform-lead">Aprofunde seus conhecimentos em desenvolvimento de sistemas por meio de projetos progressivos, organização de arquivos, boas práticas, acessibilidade, programação e construção de soluções completas.</p>
            <p class="platform-objective"><strong>Objetivo geral:</strong> construir, testar, corrigir e organizar soluções progressivas com autonomia, usando uma experiência próxima do Visual Studio Code.</p>
            <div class="platform-content-line"><strong>Conteúdos atuais:</strong> HTML semântico · formulários · tabelas · múltiplas páginas · Box Model · Flexbox · CSS Grid</div>
            <div class="platform-primary-actions">
              <button id="viewActivities" class="home-primary-action">Ver atividades</button>
              <button id="resumeExercise" class="secondary" hidden>Continuar último exercício</button>
            </div>
            <div class="platform-secondary-actions">
              <button class="secondary" data-open-help="vscode">Tutorial da plataforma</button>
              <button class="success" data-open-classroom>Abrir Google Classroom</button>
              <button class="ghost" data-open-github>Abrir GitHub</button>
            </div>
          </div>
          <aside class="platform-home-summary" aria-label="Resumo do progresso">
            <div class="home-stat"><strong id="homeTotalActivities">0</strong><span>atividades disponíveis</span></div>
            <div class="home-stat"><strong id="homeCompletedActivities">0</strong><span>concluídas</span></div>
            <div class="home-stat"><strong id="homeInProgressActivities">0</strong><span>em andamento</span></div>
            <div class="home-progress"><div><span>Progresso geral</span><strong id="homeGeneralProgress">0%</strong></div><div class="mini-progress home-progress-track"><i id="homeGeneralProgressBar"></i></div></div>
          </aside>
        </div>
        <div class="platform-home-grid">
          <article class="card platform-info-card"><span class="info-step">01</span><h3>Escolha uma atividade</h3><p>A lista fica em uma página própria, com pesquisa, filtros, status e progresso.</p></article>
          <article class="card platform-info-card"><span class="info-step">02</span><h3>Entenda e pratique</h3><p>Leia a explicação e use o código completo de referência ao lado do seu editor, sem botão que copie a solução inteira.</p></article>
          <article class="card platform-info-card"><span class="info-step">03</span><h3>Execute e corrija</h3><p>Use Preview, Console, Terminal e Problemas para testar exatamente o projeto atual.</p></article>
          <article class="card platform-info-card"><span class="info-step">04</span><h3>Valide e entregue</h3><p>Conclua os checkpoints, gere a evidência verificável e baixe o ZIP com a estrutura criada no Explorador.</p></article>
        </div>
        <article class="card delivery-home-card"><div><span class="chip info">Entrega</span><h3>Um único repositório para as atividades</h3><p>Organize cada exercício em sua própria pasta dentro de <code>${escapeHtml(config().repositorio || 'atividades-praticas')}</code>. A estrutura criada no Explorador é preservada no ZIP.</p></div><div class="delivery-home-actions"><button class="secondary" data-open-github>GitHub</button><button class="success" data-open-classroom>Classroom</button></div></article>
      </section>
      <section id="activitiesPage" class="activities-page" hidden>
        <div class="activities-header card"><div><button id="backPlatformHome" class="ghost compact">← Voltar ao início</button><span class="eyebrow">Trilha prática 3DS</span><h2>Atividades</h2><p>Pesquise por número, título ou conteúdo e continue do ponto em que parou.</p></div><div class="activities-summary"><div><strong id="activitiesTotalCount">0</strong><span>total</span></div><div><strong id="activitiesCompletedCount">0</strong><span>concluídas</span></div><div><strong id="activitiesProgressCount">0</strong><span>em andamento</span></div></div></div>
        <div class="activities-toolbar card">
          <label class="activity-search-label">Pesquisar<input id="exerciseSearch" type="search" placeholder="Número, título ou assunto"></label>
          <label id="statusFilterLabel">Status<select id="activityStatusFilter"><option value="">Todos os status</option><option>Não iniciado</option><option>Em andamento</option><option>Aguardando validação</option><option>Concluído</option><option>Revisão necessária</option></select></label>
          <label>Conteúdo<select id="activityContentFilter"><option value="">Todos os conteúdos</option><option value="html">HTML</option><option value="css">CSS</option><option value="javascript">JavaScript</option></select></label>
          <button id="clearActivityFilters" class="secondary">Limpar filtros</button>
          <div class="activities-toolbar-meta"><span id="availableCount" class="chip"></span><button class="ghost" data-auth-export="json">Exportar histórico</button></div>
        </div>
        <div id="activitiesEmptyState" class="activities-empty card" hidden role="status" aria-live="polite"><strong>Nenhuma atividade encontrada.</strong><p>Altere a pesquisa ou limpe os filtros.</p><button id="emptyClearFilters" class="secondary">Limpar filtros</button></div>
        <div id="exerciseCards" class="exercise-card-grid"></div>
      </section>`;
    const main = document.querySelector('main');
    main.parentNode.insertBefore(dashboard, main);
    return dashboard;
  }

  function progressFor(exercise) {
    try {
      const username=currentUser?.username||'sem-usuario';
      const saved=JSON.parse(readExerciseState(username, exercise.numero))||{};
      const keys=exercise.ordemArquivosAluno||exercise.ordemArquivos||Object.keys(exercise.arquivos||{});
      const done=keys.filter(k=>saved.done?.[k]).length;
      const hasAnswers=Object.values(saved.answers||{}).some(v=>String(v||'').trim());
      const hasAttempts=Object.values(saved.attempts||{}).some(v=>Number(v||0)>0);
      const hasLearning=Object.values(saved.explained||{}).some(v=>Number(v||0)>0);
      const hasProgress=Boolean(saved.completed||saved.completion?.confirmedAt||saved.savedAt||hasAnswers||hasAttempts||hasLearning||done);
      if(!hasProgress) return { percentage:0,label:'Não iniciado',status:'Não iniciado',tone:'info',hasProgress:false };
      if(saved.completed||saved.completion?.confirmedAt) return { percentage:100,label:'Concluído',status:'Concluído',tone:'success',hasProgress:true };
      if(done===keys.length) return { percentage:92,label:'Aguardando validação',status:'Aguardando validação',tone:'warning',hasProgress:true };
      let percentage=Math.max(12,Math.round(done/Math.max(1,keys.length)*78));
      if(hasAnswers&&done===0) percentage=Math.max(percentage,18);
      if(hasAttempts) percentage=Math.max(percentage,24);
      return { percentage,label:'Em andamento',status:'Em andamento',tone:'warning',hasProgress:true };
    } catch(error){ return { percentage:0,label:'Não iniciado',status:'Não iniciado',tone:'info',hasProgress:false }; }
  }

  function activityMeta(item){ const n=Number(item.numero||0); return { time:item.tempoEstimado||(n<=3?'25–30 min':n<=5?'30–35 min':'35–40 min'), level:item.nivel||(n<=3?'Iniciante':n<=5?'Fundamentos':'CSS aplicado') }; }
  function contentGroup(item){ const text=`${item.titulo||''} ${item.tema||''} ${(item.novos||[]).join(' ')}`.toLowerCase(); if(/css|flex|grid|box model|responsiv/.test(text))return 'css'; if(/javascript|js|dom|evento/.test(text))return 'javascript'; return 'html'; }
  function allProgress(){ return (window.EXERCICIOS||[]).map(item=>({item,progress:progressFor(item)})); }
  function renderHomeSummary(){ const list=allProgress(), completed=list.filter(e=>e.progress.status==='Concluído').length, inProgress=list.filter(e=>['Em andamento','Aguardando validação','Revisão necessária'].includes(e.progress.status)).length; const avg=Math.round(list.reduce((s,e)=>s+e.progress.percentage,0)/Math.max(1,list.length)); $('#dashboardGreeting').textContent=`Olá, ${String(currentUser?.displayName||'aluno').split(/\s+/)[0]}!`; $('#homeTotalActivities').textContent=String(list.length); $('#homeCompletedActivities').textContent=String(completed); $('#homeInProgressActivities').textContent=String(inProgress); $('#homeGeneralProgress').textContent=`${avg}%`; $('#homeGeneralProgressBar').style.width=`${avg}%`; const resume=$('#resumeExercise'); const preferred=Number(currentUser?.lastExerciseIndex); const pp=Number.isInteger(preferred)&&window.EXERCICIOS?.[preferred]?progressFor(window.EXERCICIOS[preferred]):null; let idx=pp?.hasProgress?preferred:-1; if(idx<0){const c=list.map((e,index)=>({...e,index})).filter(e=>e.progress.hasProgress&&e.progress.status!=='Concluído');if(c.length)idx=c.at(-1).index;} resume.hidden=idx<0; if(!resume.hidden)resume.onclick=()=>openExercise(idx); }
  function renderActivitySummary(){ const list=allProgress(); $('#activitiesTotalCount').textContent=String(list.length); $('#activitiesCompletedCount').textContent=String(list.filter(e=>e.progress.status==='Concluído').length); $('#activitiesProgressCount').textContent=String(list.filter(e=>['Em andamento','Aguardando validação','Revisão necessária'].includes(e.progress.status)).length); }
  function activityButtonText(p){ if(p.status==='Concluído')return'Revisar atividade'; if(p.status==='Aguardando validação')return'Validar'; if(p.status==='Revisão necessária')return'Corrigir atividade'; if(p.status==='Em andamento')return'Continuar'; return'Começar'; }
  function renderActivities(){ const query=String($('#exerciseSearch')?.value||'').trim().toLowerCase(),sf=String($('#activityStatusFilter')?.value||''),cf=String($('#activityContentFilter')?.value||''); const list=(window.EXERCICIOS||[]).map((item,index)=>({item,index,progress:progressFor(item),meta:activityMeta(item),group:contentGroup(item)})).filter(e=>{const h=`${e.item.numero} ${e.item.titulo} ${e.item.nomeCurto||''} ${e.item.tema||''} ${(e.item.novos||[]).join(' ')}`.toLowerCase();return(!query||h.includes(query))&&(!sf||e.progress.status===sf)&&(!cf||e.group===cf)}); const count=list.length; $('#availableCount').textContent=`${count} ${count===1?'exercício disponível':'exercícios disponíveis'}`; $('#exerciseCards').innerHTML=list.map(({item,index,progress,meta})=>`<article class="exercise-choice card"><div class="exercise-choice-number">${String(item.numero).padStart(2,'0')}</div><div class="exercise-choice-body"><div class="exercise-card-topline"><span class="chip ${progress.tone}">${escapeHtml(progress.label)}</span><span class="exercise-level">${escapeHtml(meta.level)}</span></div>${Number(item.numero)===1?'':`<div class="exercise-learning-mode">${escapeHtml(item.modeloPedagogico?.rotulo||'Prática guiada')}</div>`}<h3>${escapeHtml(item.nomeCurto||item.titulo)}</h3><p>${escapeHtml(item.objetivo||item.tema||'')}</p><div class="exercise-content-line"><strong>Conteúdos:</strong> ${escapeHtml((item.novos||[]).slice(0,5).join(' · '))}</div><div class="exercise-meta-line"><span>⏱ ${escapeHtml(meta.time)}</span><span>${escapeHtml(meta.level)}</span></div><div class="mini-progress"><i style="width:${progress.percentage}%"></i></div></div><button data-open-exercise="${index}">${activityButtonText(progress)}</button></article>`).join(''); $$('[data-open-exercise]').forEach(b=>b.addEventListener('click',()=>openExercise(Number(b.dataset.openExercise)))); $('#activitiesEmptyState').hidden=count>0; $('#exerciseCards').hidden=count===0; renderActivitySummary(); }
  function renderDashboard(){ renderHomeSummary(); renderActivities(); }
  function escapeHtml(value=''){ return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  function setRoute(route,replace=false){ const hash=`#${route}`; if(location.hash===hash)return; const url=`${location.pathname}${location.search}${hash}`; history[replace?'replaceState':'pushState']({route},'',url); }
  function routeFromLocation(options={}){ if(!currentUser)return; const hash=String(location.hash||'#home').replace(/^#/,''); const m=hash.match(/^exercise-(\d{1,2})$/); if(m){const n=Number(m[1]);const i=window.EXERCICIOS?.findIndex(item=>Number(item.numero)===n);if(i>=0)return openExercise(i,{persist:false,history:false});} if(hash==='activities')return showActivities({persist:false,history:false}); return showHome({persist:false,history:false}); }
  async function openExercise(index,options={}){ const selector=scope()==='aluno'?$('#studentExercise'):$('#seletorExercicio'); if(!selector||!window.EXERCICIOS?.[index])return; selector.value=String(index); selector.dispatchEvent(new Event('change',{bubbles:true})); currentUser.lastExerciseIndex=index; if(options.persist!==false)await saveSession({lastExercise:window.EXERCICIOS[index].numero,lastView:'exercise'}); $('#appDashboard').hidden=true; document.querySelector('main').hidden=false; if(options.history!==false)setRoute(`exercise-${String(window.EXERCICIOS[index].numero).padStart(2,'0')}`); log('exercicio_aberto',{index,numero:window.EXERCICIOS[index].numero,titulo:window.EXERCICIOS[index].titulo}); window.scrollTo({top:0,behavior:'smooth'}); }
  function showHome(options={}){ if(currentUser&&options.persist!==false)saveSession({lastView:'home'}).catch(()=>{}); document.querySelector('main').hidden=true; const d=$('#appDashboard')||dashboardMarkup(); d.hidden=false; $('#platformHome').hidden=false; $('#activitiesPage').hidden=true; renderHomeSummary(); closeUserMenu(); if(options.history!==false)setRoute('home',Boolean(options.replace)); window.scrollTo({top:0,behavior:'smooth'}); }
  function showActivities(options={}){ if(currentUser&&options.persist!==false)saveSession({lastView:'activities'}).catch(()=>{}); document.querySelector('main').hidden=true; const d=$('#appDashboard')||dashboardMarkup(); d.hidden=false; $('#platformHome').hidden=true; $('#activitiesPage').hidden=false; renderActivities(); closeUserMenu(); if(options.history!==false)setRoute('activities',Boolean(options.replace)); window.scrollTo({top:0,behavior:'smooth'}); }
  function clearActivityFilters(){ if($('#exerciseSearch'))$('#exerciseSearch').value=''; if($('#activityStatusFilter'))$('#activityStatusFilter').value=''; if($('#activityContentFilter'))$('#activityContentFilter').value=''; renderActivities(); $('#exerciseSearch')?.focus(); }

  function showTab(tab) {
    $('#loginForm').hidden = tab !== 'login';
    $('#registerForm').hidden = tab !== 'register';
    $('#unlockForm').hidden = true;
    $$('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.dataset.authTab === tab));
    $('#authTabs').hidden = false;
    setMessage('');
  }

  function setApplicationInert(value) {
    ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => value ? element.setAttribute('inert', '') : element.removeAttribute('inert')));
  }

  function clearSensitiveFields() {
    ['#loginPassword', '#registerPassword', '#registerConfirm', '#unlockPassword'].forEach(selector => {
      const input = $(selector);
      if (input) input.value = '';
    });
  }

  function showAuth() {
    clearSensitiveFields();
    $('#authGate').hidden = false;
    document.body.classList.add('auth-open');
    setApplicationInert(true);
    const list = users();
    showTab(list.length ? 'login' : 'register');
    renderRecentUsers();
    setTimeout(() => ($('#registerForm').hidden ? $('#loginUsername') : $('#registerName'))?.focus(), 0);
  }

  function hideAuth() {
    clearSensitiveFields();
    $('#authGate').hidden = true;
    document.body.classList.remove('auth-open');
    setApplicationInert(false);
  }

  function showLocked() {
    $('#authGate').hidden = false;
    document.body.classList.add('auth-open');
    setApplicationInert(true);
    $('#authTabs').hidden = true;
    $('#loginForm').hidden = true;
    $('#registerForm').hidden = true;
    $('#unlockForm').hidden = false;
    setTimeout(() => $('#unlockPassword')?.focus(), 0);
    $('#lockedUserName').textContent = `${currentUser?.displayName || currentUser?.username}, sessão bloqueada`;
    $('#unlockPassword').value = '';
    setMessage('Digite sua senha local para desbloquear.');
    setTimeout(() => $('#unlockPassword')?.focus(), 80);
  }

  function setMessage(message, tone = '') {
    const element = $('#authMessage');
    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone;
  }

  function renderRecentUsers() {
    const container = $('#recentUsers');
    if (!container) return;
    const list = users();
    container.innerHTML = list.length ? `<span>Usuários neste navegador:</span>${list.map(user => `<button type="button" class="recent-user" data-recent-user="${escapeHtml(user.username)}">${escapeHtml(user.displayName)} <small>@${escapeHtml(user.username)}</small></button>`).join('')}` : '';
    $$('[data-recent-user]').forEach(button => button.addEventListener('click', () => {
      $('#loginUsername').value = button.dataset.recentUser;
      $('#loginPassword').focus();
    }));
  }

  function updateUserUi() {
    if (!currentUser) return;
    $('#authDisplayName').textContent = currentUser.displayName;
    $('#authUsername').textContent = `@${currentUser.username}${currentUser.group ? ` · ${currentUser.group}` : ''}`;
    $('.auth-user-label').textContent = currentUser.displayName.split(' ')[0];
    $('.auth-avatar').textContent = currentUser.displayName.trim().charAt(0).toUpperCase() || 'U';
  }

  async function register(event) {
    event.preventDefault();
    const displayName = $('#registerName').value.trim();
    const username = normalizeUsername($('#registerUsername').value);
    const group = $('#registerGroup').value.trim();
    const password = $('#registerPassword').value;
    const confirm = $('#registerConfirm').value;
    if (displayName.length < 2) return setMessage('Informe um nome para exibição.', 'danger');
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) return setMessage('Use de 3 a 30 caracteres no usuário: letras, números, ponto, hífen ou sublinhado.', 'danger');
    if (password.length < 6) return setMessage('A senha precisa ter pelo menos 6 caracteres.', 'danger');
    if (password !== confirm) return setMessage('As senhas não correspondem.', 'danger');
    if (userByUsername(username)) return setMessage('Esse usuário já existe neste navegador.', 'danger');
    try {
      setMessage('Criando usuário local…');
      const salt = bytesToBase64(randomBytes(16));
      const passwordHash = await digestPassword(password, salt);
      const user = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, username, displayName, group, role: scope(), salt, passwordHash, createdAt: new Date().toISOString() };
      saveUsers([...users(), user]);
      currentUser = { ...user };
      await saveSession({ locked: false });
      log('usuario_criado', { username, group });
      await finishLogin();
    } catch (error) { setMessage(error.message || 'Não foi possível criar o usuário.', 'danger'); }
  }

  async function login(event) {
    event.preventDefault();
    const username = normalizeUsername($('#loginUsername').value);
    const password = $('#loginPassword').value;
    const user = userByUsername(username);
    if (!user) { log('login_falhou', { username, reason: 'usuario_nao_encontrado' }); return setMessage('Usuário local não encontrado.', 'danger'); }
    try {
      setMessage('Verificando…');
      const hash = await digestPassword(password, user.salt);
      if (!safeEqual(hash, user.passwordHash)) { log('login_falhou', { username, reason: 'senha_incorreta' }); return setMessage('Senha incorreta.', 'danger'); }
      currentUser = { ...user };
      await saveSession({ locked: false });
      log('login_realizado');
      await finishLogin();
    } catch (error) { setMessage(error.message || 'Não foi possível entrar.', 'danger'); }
  }

  async function unlock(event) {
    event.preventDefault();
    const user = currentUser;
    if (!user) return switchUser();
    const hash = await digestPassword($('#unlockPassword').value, user.salt);
    if (!safeEqual(hash, user.passwordHash)) { log('desbloqueio_falhou'); return setMessage('Senha incorreta.', 'danger'); }
    await saveSession({ locked: false });
    log('sessao_desbloqueada');
    hideAuth();
  }

  async function lock() {
    closeUserMenu();
    await saveSession({ locked: true });
    log('sessao_bloqueada');
    showLocked();
  }

  async function logout() {
    document.dispatchEvent(new CustomEvent('appauth:before-user-change', { detail: { user: currentUser } }));
    log('logout');
    storageRemove('session');
    currentUser = null;
    document.querySelector('main').hidden = true;
    $('#appDashboard').hidden = true;
    closeUserMenu();
    showAuth();
  }

  async function switchUser() {
    document.dispatchEvent(new CustomEvent('appauth:before-user-change', { detail: { user: currentUser } }));
    log('troca_de_usuario');
    storageRemove('session');
    currentUser = null;
    $('#unlockForm').hidden = true;
    showAuth();
  }

  async function finishLogin() {
    updateUserUi();
    hideAuth();
    const session = await readSession();
    const number = session?.lastExercise;
    if (number) currentUser.lastExerciseIndex = window.EXERCICIOS?.findIndex(item => item.numero === number);
    if (!location.hash && session?.lastView) setRoute(session.lastView === 'activities' ? 'activities' : session.lastView === 'exercise' && number ? `exercise-${String(number).padStart(2,'0')}` : 'home', true);
    routeFromLocation({ replace: true });
    document.dispatchEvent(new CustomEvent('appauth:ready', { detail: { user: currentUser } }));
  }

  function exportLogs(format = 'json') {
    const list = logs().filter(item => !currentUser || item.user === currentUser.username);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (format === 'csv') {
      const headers = ['at', 'user', 'displayName', 'role', 'action', 'exercise', 'version', 'details'];
      const csv = [headers.join(';'), ...list.map(item => headers.map(header => {
        const value = header === 'details' ? JSON.stringify(item.details || {}) : item[header] ?? '';
        return `"${String(value).replaceAll('"', '""')}"`;
      }).join(';'))].join('\n');
      if (window.Utils?.download) Utils.download(`historico-${scope()}-${stamp}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
    } else {
      const payload = { platform: config().name, version: config().version, exportedAt: new Date().toISOString(), user: currentUser ? { username: currentUser.username, displayName: currentUser.displayName, group: currentUser.group } : null, logs: list };
      if (window.Utils?.download) Utils.download(`historico-${scope()}-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json');
    }
    log('logs_exportados', { format, count: list.length });
    closeUserMenu();
  }

  function toggleUserMenu() {
    const popover = $('#authUserPopover');
    popover.hidden = !popover.hidden;
    $('#authUserButton').setAttribute('aria-expanded', String(!popover.hidden));
  }

  function closeUserMenu() {
    const popover = $('#authUserPopover');
    if (popover) popover.hidden = true;
    $('#authUserButton')?.setAttribute('aria-expanded', 'false');
  }

  function bind() {
    $$('[data-auth-tab]').forEach(button => button.addEventListener('click', () => showTab(button.dataset.authTab)));
    $('#loginForm').addEventListener('submit', login);
    $('#registerForm').addEventListener('submit', register);
    $('#unlockForm').addEventListener('submit', unlock);
    $('#authUserButton').addEventListener('click', toggleUserMenu);
    $$('[data-auth-home]').forEach(button => button.addEventListener('click', showHome));
    $$('[data-auth-lock]').forEach(button => button.addEventListener('click', lock));
    $$('[data-auth-switch]').forEach(button => button.addEventListener('click', switchUser));
    $$('[data-auth-logout]').forEach(button => button.addEventListener('click', logout));
    $$('[data-auth-export]').forEach(button => button.addEventListener('click', () => exportLogs(button.dataset.authExport)));
    $('#exerciseSearch')?.addEventListener('input', renderActivities);
    $('#activityStatusFilter')?.addEventListener('change', renderActivities);
    $('#activityContentFilter')?.addEventListener('change', renderActivities);
    $('#clearActivityFilters')?.addEventListener('click', clearActivityFilters);
    $('#emptyClearFilters')?.addEventListener('click', clearActivityFilters);
    $('#viewActivities')?.addEventListener('click', showActivities);
    $('#backPlatformHome')?.addEventListener('click', showHome);
    window.addEventListener('popstate', () => routeFromLocation({ history:false, persist:false }));
    const exerciseSelector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    if (exerciseSelector) {
      exerciseSelector.addEventListener('change', () => {
        if (!currentUser) return;
        const selectedIndex = Number(exerciseSelector.value);
        if ($('#appDashboard')) $('#appDashboard').hidden = true;
        document.querySelector('main').hidden = false;
        if (Number.isInteger(selectedIndex) && window.EXERCICIOS?.[selectedIndex]) {
          currentUser.lastExerciseIndex = selectedIndex;
          saveSession({ lastExercise: window.EXERCICIOS[selectedIndex].numero, lastView: 'exercise' }).catch(() => {});
          setRoute(`exercise-${String(window.EXERCICIOS[selectedIndex].numero).padStart(2,'0')}`, true);
          log('exercicio_aberto_pelo_seletor', { numero: window.EXERCICIOS[selectedIndex].numero });
        }
      });
    }
    const homeLink = document.querySelector('.header-actions a[href="index.html"]');
    if (homeLink) {
      homeLink.textContent = 'Início';
      homeLink.addEventListener('click', event => { event.preventDefault(); showHome(); });
    }
    document.addEventListener('click', event => {
      if (!event.target.closest('#authUserMenu')) closeUserMenu();
      const external = event.target.closest('[data-open-github],[data-open-classroom]');
      if (external) log(external.hasAttribute('data-open-github') ? 'github_aberto' : 'classroom_aberto');
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !$('#authUserPopover')?.hidden) {
        closeUserMenu();
        $('#authUserButton')?.focus();
      }
    });
    ['pointerdown', 'keydown', 'touchstart'].forEach(type => document.addEventListener(type, () => { lastActivity = Date.now(); }, { passive: true }));
  }

  async function restore() {
    const session = await readSession();
    if (!session) return showAuth();
    const user = userByUsername(session.username);
    if (!user) return showAuth();
    currentUser = { ...user, lastExerciseIndex: window.EXERCICIOS?.findIndex(item => item.numero === session.lastExercise) };
    updateUserUi();
    log('sessao_restaurada');
    if (session.locked) showLocked();
    else await finishLogin();
  }


  async function acceptCoreUser(info={}) {
    const email=String(info.email||'').trim().toLowerCase();
    const displayName=String(info.full_name||email||'Estudante').trim();
    currentUser={id:String(info.id||email),username:email||String(info.id||'agv-core'),displayName,group:String(info.class_name||''),role:scope(),central:true,createdAt:new Date().toISOString(),lastExerciseIndex:currentUser?.lastExerciseIndex??-1};
    updateUserUi();
    await finishLogin();
    log('agv_core_sessao_aceita',{email,group:currentUser.group});
    return currentUser;
  }

  async function init() {
    if (initialized) return;
    initialized = true;
    document.body.insertAdjacentHTML('afterbegin', authMarkup());
    injectUserControls();
    dashboardMarkup();
    document.querySelector('main').hidden = true;
    bind();
    await restore();
  }

  return { init, log, showHome, openExercise, lock, logout, switchUser, exportLogs, acceptCoreUser, currentUser: () => currentUser };
})();

document.addEventListener('DOMContentLoaded', () => AppAuth.init());

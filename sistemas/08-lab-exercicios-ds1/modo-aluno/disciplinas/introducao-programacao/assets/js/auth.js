window.AppAuth = (() => {
  const SESSION_DAYS = 5;
  const MAX_LOGS = 1200;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');
  const config = () => window.APP_CONFIG || {};
  const scope = () => /professor/i.test(config().name || '') ? 'professor' : 'aluno';
  // Usuários, chave do dispositivo e sessão continuam compartilhados entre disciplinas.
  // Progresso pedagógico, histórico e atividade atual são isolados por disciplina.
  const key = name => `ds1_80_${scope()}_${name}_v1`;
  const disciplineId = () => config().disciplineId || 'introducao-programacao';
  const disciplineKey = (name, userId = currentUser?.id || 'guest') => `ds1_disc_${disciplineId()}_${scope()}_${userId}_${name}_v1`;
  const legacyLogsKey = () => key('logs');
  const activityKey = () => disciplineKey('activity');
  const logsKey = () => disciplineKey('logs');
  const migrationKey = () => disciplineKey('migration');
  function storageGet(name) { if(window.DSCore?.storage)return window.DSCore.storage.get(name,showStorageFailure); try { return localStorage.getItem(name); } catch { showStorageFailure(); return null; } }
  function storageSet(name, value) { if(window.DSCore?.storage)return window.DSCore.storage.set(name,value,showStorageFailure); try { localStorage.setItem(name, value); return true; } catch { showStorageFailure(); return false; } }
  function storageRemove(name) { if(window.DSCore?.storage)return window.DSCore.storage.remove(name,showStorageFailure); try { localStorage.removeItem(name); return true; } catch { showStorageFailure(); return false; } }
  function showStorageFailure() { if (storageWarningShown) return; storageWarningShown = true; window.AppShell?.showStorageWarning(); }
  let currentUser = null;
  let initialized = false;
  let lastActivity = Date.now();
  let restoredWhileLocked = false;
  let storageWarningShown = false;

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
    let raw = storageGet(key('device_key'));
    if (!raw) {
      raw = bytesToBase64(randomBytes(32));
      storageSet(key('device_key'), raw);
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
    try { return JSON.parse(storageGet(key('users'))) || []; }
    catch (error) { return []; }
  }

  function saveUsers(list) {
    if (!storageSet(key('users'), JSON.stringify(list))) throw new Error('Não foi possível salvar o usuário neste navegador.');
  }

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '.');
  }

  function logs() {
    try { return JSON.parse(storageGet(logsKey())) || []; }
    catch (error) { return []; }
  }

  function readActivity() {
    try { return JSON.parse(storageGet(activityKey())) || {}; }
    catch { return {}; }
  }

  function saveActivity(extra = {}) {
    if (!currentUser) return;
    const current = readActivity();
    storageSet(activityKey(), JSON.stringify({ ...current, ...extra, disciplineId: disciplineId(), updatedAt: new Date().toISOString() }));
  }

  function migrateDisciplineData(session = null) {
    if (!currentUser || storageGet(migrationKey())) return;
    // Antes da Central Multidisciplinar, todos os logs pertenciam a Introdução à Programação.
    // Copiamos apenas os registros deste usuário e não apagamos as chaves antigas.
    try {
      const legacyLogs = JSON.parse(storageGet(legacyLogsKey())) || [];
      const ownLogs = legacyLogs.filter(item => item.user === currentUser.username);
      if (ownLogs.length && !storageGet(logsKey())) storageSet(logsKey(), JSON.stringify(ownLogs.slice(-MAX_LOGS)));
    } catch {}
    if (!storageGet(activityKey()) && session?.lastExercise) saveActivity({ lastExercise: session.lastExercise, migratedFromLegacySession: true });
    storageSet(migrationKey(), JSON.stringify({ migratedAt: new Date().toISOString(), disciplineId: disciplineId(), version: config().version || '' }));
  }

  function log(action, details = {}) {
    const list = logs();
    const exerciseSelector = scope() === 'aluno' ? $('#exerciseSelect') : $('#exerciseSelect');
    const index = Number(exerciseSelector?.value);
    const exercise = Number.isInteger(index) ? window.EXERCICIOS?.[index] : null;
    list.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toISOString(),
      user: currentUser?.username || 'sem-sessao',
      displayName: currentUser?.displayName || '',
      role: scope(),
      discipline: disciplineId(),
      action,
      exercise: exercise?.numero || null,
      version: config().version || '',
      details
    });
    storageSet(logsKey(), JSON.stringify(list.slice(-MAX_LOGS)));
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
      lastSeenAt: now
    };
    if (!storageSet(key('session'), await encryptSession(payload))) throw new Error('Não foi possível salvar a sessão local.');
  }

  async function readSession() {
    const raw = storageGet(key('session'));
    if (!raw) return null;
    try {
      const session = await decryptSession(raw);
      if (!session || session.role !== scope() || Date.now() > session.expiresAt) {
        storageRemove(key('session'));
        return null;
      }
      return session;
    } catch (error) {
      storageRemove(key('session'));
      return null;
    }
  }

  function userByUsername(username) {
    return users().find(item => item.username === normalizeUsername(username));
  }

  function authMarkup() {
    return `
      <div id="authGate" class="auth-gate" role="dialog" aria-modal="true" aria-labelledby="authDialogTitle" aria-describedby="authDialogDescription">
        <div class="auth-background-grid"></div>
        <article class="auth-panel card">
          <div class="auth-brand"><span class="auth-logo">&lt;/&gt;</span><div><small>1º DS · ${scope() === 'professor' ? 'Professor' : 'Aluno'}</small><h1 id="authDialogTitle">${escapeHtml(config().disciplineName || 'Introdução à Programação')}</h1><p id="authDialogDescription">Sessão local criptografada neste navegador por até ${SESSION_DAYS} dias.</p></div></div>
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
            <label>${scope() === 'professor' ? 'Identificação' : 'Turma'}<input id="registerGroup" maxlength="30" placeholder="${scope() === 'professor' ? 'Professor de Introdução à Programação' : 'Ex.: 1º DS A'}"></label>
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
    const container = scope() === 'aluno' ? $('#studentHeaderActions') : $('#profHeaderActions');
    if (!container || $('#authUserMenu')) return;
    const menu = document.createElement('div');
    menu.id = 'authUserMenu';
    menu.className = 'auth-user-menu';
    menu.innerHTML = `
      <button id="authUserButton" class="ghost auth-user-button" aria-expanded="false" aria-controls="authUserPopover"><span class="auth-avatar">U</span><span class="auth-user-label">Usuário</span></button>
      <div id="authUserPopover" class="auth-user-popover card" hidden>
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
            <span class="eyebrow">1º DS · Introdução à Programação · ${scope() === 'professor' ? 'Modo Professor' : 'Modo Aluno'}</span>
            <h2>Introdução à Programação</h2>
            <p id="dashboardGreeting" class="home-greeting">Olá!</p>
            <p class="platform-lead">${scope() === 'professor'
              ? 'Prepare e apresente a trilha de Python com roteiro, código de referência, testes, erros comuns e ambiente de execução.'
              : 'Aprenda programação construindo, executando, testando e corrigindo programas Python em um ambiente inspirado no VS Code.'}</p>
            <p class="platform-objective"><strong>Objetivo geral:</strong> desenvolver raciocínio lógico, leitura de erros, autonomia de testes e organização de projetos.</p>
            <div class="platform-content-line"><strong>Conteúdos atuais:</strong> variáveis · operadores · condições · operadores lógicos · for · contadores · while</div>
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
          <article class="card platform-info-card"><span class="info-step">01</span><h3>Escolha uma atividade</h3><p>Use a página Atividades para pesquisar por número, assunto, status ou conteúdo.</p></article>
          <article class="card platform-info-card"><span class="info-step">02</span><h3>Entenda e digite</h3><p>Leia a explicação, acompanhe a referência e digite o código no editor como em uma IDE.</p></article>
          <article class="card platform-info-card"><span class="info-step">03</span><h3>Execute e teste</h3><p>Use o terminal Python, os checkpoints e os cenários de teste antes de validar.</p></article>
          <article class="card platform-info-card"><span class="info-step">04</span><h3>Valide e entregue</h3><p>Baixe seu projeto, mantenha a pasta no GitHub e entregue o link no Classroom.</p></article>
        </div>
        <article class="card delivery-home-card"><div><span class="chip info">Entrega</span><h3>Um repositório, uma pasta por exercício</h3><p>Use <code>${escapeHtml(config().repositorio || 'atividades-praticas-1ds')}</code>. A estrutura personalizada no Explorador é preservada no ZIP.</p></div><div class="delivery-home-actions"><button class="secondary" data-open-github>GitHub</button><button class="success" data-open-classroom>Classroom</button></div></article>
      </section>
      <section id="activitiesPage" class="activities-page" hidden>
        <div class="activities-header card"><div><button id="backPlatformHome" class="ghost compact">← Voltar ao início</button><span class="eyebrow">Trilha prática</span><h2>Atividades</h2><p>Pesquise e continue exatamente do ponto em que parou.</p></div><div class="activities-summary"><div><strong id="activitiesTotalCount">0</strong><span>total</span></div><div><strong id="activitiesCompletedCount">0</strong><span>concluídas</span></div><div><strong id="activitiesProgressCount">0</strong><span>em andamento</span></div></div></div>
        <div class="activities-toolbar card">
          <label class="activity-search-label">Pesquisar<input id="exerciseSearch" type="search" placeholder="Número, título ou assunto"></label>
          <label id="statusFilterLabel">Status<select id="activityStatusFilter"><option value="">Todos os status</option><option value="Não iniciado">Não iniciado</option><option value="Em andamento">Em andamento</option><option value="Pronto para concluir">Pronto para concluir</option><option value="Concluído">Concluído</option><option value="Revisão necessária">Revisão necessária</option></select></label>
          <label>Conteúdo<select id="activityContentFilter"><option value="">Todos os conteúdos</option><option value="fundamentos">Fundamentos</option><option value="condicionais">Condições e validações</option><option value="repeticao">Repetição e contadores</option></select></label>
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
    if (scope() === 'professor') return { percentage: 100, label: 'Material disponível', status: 'Disponível', tone: 'info', hasProgress: false };
    try {
      const userId = currentUser?.id || 'guest';
      const candidates = [
        `ds1_80_${scope()}_${userId}_ex_${exercise.numero}_state_v3`,
        `ds1_80_${scope()}_${userId}_ex_${exercise.numero}_state_v2`
      ];
      let saved = null;
      for (const storageKey of candidates) {
        const raw = storageGet(storageKey);
        if (!raw) continue;
        saved = JSON.parse(raw); if (saved) break;
      }
      if (!saved) return { percentage: 0, label: 'Não iniciado', status: 'Não iniciado', tone: 'info', hasProgress: false };
      const percentage = Math.max(0, Math.min(100, Number(saved.percentage || (saved.validated ? 95 : 0))));
      const hasProgress = Boolean(percentage || saved.hasRun || saved.completed || Object.values(saved.files || {}).some(value => String(value || '').trim()) || Number(saved.validationAttempts || 0));
      if (!hasProgress) return { percentage: 0, label: 'Não iniciado', status: 'Não iniciado', tone: 'info', hasProgress: false };
      if (saved.completed) return { percentage: 100, label: 'Concluído', status: 'Concluído', tone: 'success', hasProgress: true };
      if (saved.validated) return { percentage: 100, label: 'Validada - concluir', status: 'Pronto para concluir', tone: 'warning', hasProgress: true };
      if (saved.needsReview) return { percentage, label: 'Revisão necessária', status: 'Revisão necessária', tone: 'danger', hasProgress: true };
      return { percentage, label: 'Em andamento', status: 'Em andamento', tone: 'warning', hasProgress: true };
    } catch (error) { return { percentage: 0, label: 'Não iniciado', status: 'Não iniciado', tone: 'info', hasProgress: false }; }
  }

  function contentGroup(item) {
    const n = Number(item?.numero || 0);
    if (n <= 2) return 'fundamentos';
    if (n <= 5) return 'condicionais';
    return 'repeticao';
  }
  function activityMeta(item) {
    const n = Number(item?.numero || 0);
    const level = n <= 2 ? 'Fundamentos' : n <= 5 ? 'Decisões' : 'Repetição';
    const time = n <= 2 ? '25-35 min' : '30-45 min';
    return { level, time, group: contentGroup(item) };
  }
  function allActivityProgress() { return (window.EXERCICIOS || []).map(item => ({ item, progress: progressFor(item) })); }
  function renderHomeStats() {
    const list = allActivityProgress();
    const completed = list.filter(entry => entry.progress.status === 'Concluído').length;
    const inProgress = list.filter(entry => ['Em andamento','Pronto para concluir','Revisão necessária'].includes(entry.progress.status)).length;
    const average = scope() === 'professor' ? 100 : Math.round(list.reduce((total, entry) => total + entry.progress.percentage, 0) / Math.max(1, list.length));
    $('#dashboardGreeting').textContent = `Olá, ${currentUser?.displayName || 'usuário'}!`;
    $('#homeTotalActivities').textContent = String(list.length); $('#homeCompletedActivities').textContent = String(completed); $('#homeInProgressActivities').textContent = String(inProgress);
    $('#homeGeneralProgress').textContent = `${average}%`; $('#homeGeneralProgressBar').style.width = `${average}%`;
    const resume = $('#resumeExercise');
    const preferred = Number(currentUser?.lastExerciseIndex);
    const preferredProgress = Number.isInteger(preferred) && window.EXERCICIOS?.[preferred] ? progressFor(window.EXERCICIOS[preferred]) : null;
    let resumeIndex = preferredProgress?.hasProgress && preferredProgress.status !== 'Concluído' ? preferred : -1;
    if (resumeIndex < 0) {
      const candidate = list.map((entry,index)=>({...entry,index})).find(entry => entry.progress.hasProgress && entry.progress.status !== 'Concluído');
      resumeIndex = candidate?.index ?? -1;
    }
    resume.hidden = resumeIndex < 0; if (resumeIndex >= 0) resume.onclick = () => openExercise(resumeIndex);
  }
  function activityButtonText(progress) {
    if (scope() === 'professor') return 'Abrir aula';
    if (progress.status === 'Concluído') return 'Revisar atividade';
    if (progress.status === 'Pronto para concluir') return 'Concluir';
    if (progress.status === 'Revisão necessária') return 'Corrigir atividade';
    if (progress.status === 'Em andamento') return 'Continuar';
    return 'Começar';
  }
  function renderActivities() {
    const query = String($('#exerciseSearch')?.value || '').trim().toLowerCase();
    const statusFilter = String($('#activityStatusFilter')?.value || '');
    const contentFilter = String($('#activityContentFilter')?.value || '');
    const list = (window.EXERCICIOS || []).map((item,index)=>({item,index,progress:progressFor(item),meta:activityMeta(item)})).filter(entry=>{
      const haystack = `${entry.item.numero} ${entry.item.titulo} ${entry.item.objetivo || ''} ${(entry.item.conceitos || []).join(' ')}`.toLowerCase();
      return (!query || haystack.includes(query)) && (scope()==='professor' || !statusFilter || entry.progress.status===statusFilter) && (!contentFilter || entry.meta.group===contentFilter);
    });
    const all = allActivityProgress();
    $('#activitiesTotalCount').textContent = String(all.length); $('#activitiesCompletedCount').textContent = String(all.filter(x=>x.progress.status==='Concluído').length); $('#activitiesProgressCount').textContent = String(all.filter(x=>['Em andamento','Pronto para concluir','Revisão necessária'].includes(x.progress.status)).length);
    $('#availableCount').textContent = `${list.length} de ${all.length}`;
    $('#exerciseCards').innerHTML = list.map(({item,index,progress,meta})=>`<article class="exercise-choice exercise-card-modern card"><div class="exercise-choice-number">${String(item.numero).padStart(2,'0')}</div><div class="exercise-choice-body"><div class="exercise-card-topline"><span class="chip ${progress.tone}">${escapeHtml(progress.label)}</span><span class="exercise-level">${escapeHtml(meta.level)} · ${escapeHtml(meta.time)}</span></div><h3>${escapeHtml(item.nomeCurto || item.titulo)}</h3><p>${escapeHtml(item.objetivo || '')}</p>${scope()==='professor'?'':`<div class="mini-progress" aria-label="${progress.percentage}% de progresso"><i style="width:${progress.percentage}%"></i></div>`}<div class="chips">${(item.conceitos||[]).slice(0,5).map(value=>`<span class="chip">${escapeHtml(value)}</span>`).join('')}</div></div><button data-open-exercise="${index}">${activityButtonText(progress)}</button></article>`).join('');
    $('#activitiesEmptyState').hidden = list.length > 0;
    $$('[data-open-exercise]').forEach(button=>button.addEventListener('click',()=>openExercise(Number(button.dataset.openExercise))));
  }
  function clearActivityFilters() { if ($('#exerciseSearch')) $('#exerciseSearch').value=''; if ($('#activityStatusFilter')) $('#activityStatusFilter').value=''; if ($('#activityContentFilter')) $('#activityContentFilter').value=''; renderActivities(); }
  function setRoute(route, replace=false) { const hash=`#${route}`; if (location.hash===hash) return; try { history[replace?'replaceState':'pushState'](null,'',`${location.pathname}${location.search}${hash}`); } catch { location.hash=hash; } }
  function routeFromHash() { const hash=String(location.hash||'#home').replace(/^#/,''); const match=hash.match(/^exercise-(\d{1,2})$/); if(match){const index=window.EXERCICIOS?.findIndex(item=>Number(item.numero)===Number(match[1]));if(index>=0)return openExercise(index,{history:false});} if(hash==='activities')return showActivities({history:false}); return showHome({history:false}); }

  async function openExercise(index, options={}) {
    const selector = $('#exerciseSelect');
    if (!selector || !window.EXERCICIOS?.[index]) return;
    selector.value = String(index); selector.dispatchEvent(new Event('change',{bubbles:true})); currentUser.lastExerciseIndex=index;
    saveActivity({ lastExercise: window.EXERCICIOS[index].numero, route: `exercise-${window.EXERCICIOS[index].numero}` }); await saveSession(); document.body.classList.remove('dashboard-mode'); $('#appDashboard').hidden=true; document.querySelector('main').hidden=false;
    log('exercicio_aberto',{index,numero:window.EXERCICIOS[index].numero,titulo:window.EXERCICIOS[index].titulo}); if(options.history!==false)setRoute(`exercise-${window.EXERCICIOS[index].numero}`); window.scrollTo({top:0,behavior:'smooth'});
  }
  function showHome(options={}) {
    document.dispatchEvent(new Event('appauth:before-home')); saveActivity({ route: 'home' }); document.body.classList.add('dashboard-mode'); document.querySelector('main').hidden=true; const dashboard=$('#appDashboard')||dashboardMarkup(); dashboard.hidden=false; $('#platformHome').hidden=false; $('#activitiesPage').hidden=true; if($('#exerciseTitle'))$('#exerciseTitle').textContent='Plataforma 1DS'; renderHomeStats(); closeUserMenu(); log('pagina_inicial_aberta'); if(options.history!==false)setRoute('home',Boolean(options.replace)); window.scrollTo({top:0,behavior:'smooth'});
  }
  function showActivities(options={}) {
    document.dispatchEvent(new Event('appauth:before-home')); saveActivity({ route: 'activities' }); document.body.classList.add('dashboard-mode'); document.querySelector('main').hidden=true; const dashboard=$('#appDashboard')||dashboardMarkup(); dashboard.hidden=false; $('#platformHome').hidden=true; $('#activitiesPage').hidden=false; if($('#exerciseTitle'))$('#exerciseTitle').textContent='Atividades'; if(scope()==='professor')$('#statusFilterLabel').hidden=true; renderActivities(); closeUserMenu(); log('pagina_atividades_aberta'); if(options.history!==false)setRoute('activities'); window.scrollTo({top:0,behavior:'smooth'});
  }

  function showTab(tab) {
    $('#loginForm').hidden = tab !== 'login';
    $('#registerForm').hidden = tab !== 'register';
    $('#unlockForm').hidden = true;
    $$('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.dataset.authTab === tab));
    $('#authTabs').hidden = false;
    setMessage('');
    const target = tab === 'login' ? $('#loginUsername') : $('#registerName');
    setTimeout(() => target?.focus(), 50);
  }

  function setBackgroundInert(value) {
    const main = document.querySelector('main'), dashboard = $('#appDashboard');
    [main, dashboard].forEach(element => { if (!element) return; element.inert = value; element.setAttribute('aria-hidden', String(value)); });
  }

  function showAuth() {
    $('#authGate').hidden = false;
    document.body.classList.add('auth-open');
    setBackgroundInert(true);
    const list = users();
    showTab(list.length ? 'login' : 'register');
    renderRecentUsers();
  }

  function hideAuth() {
    $('#authGate').hidden = true;
    document.body.classList.remove('auth-open');
    setBackgroundInert(false);
  }

  function showLocked() {
    $('#authGate').hidden = false;
    document.body.classList.add('auth-open');
    setBackgroundInert(true);
    $('#authTabs').hidden = true;
    $('#loginForm').hidden = true;
    $('#registerForm').hidden = true;
    $('#unlockForm').hidden = false;
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
      $('#registerPassword').value = ''; $('#registerConfirm').value = '';
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
      $('#loginPassword').value = '';
      await finishLogin();
    } catch (error) { setMessage(error.message || 'Não foi possível entrar.', 'danger'); }
  }

  async function unlock(event) {
    event.preventDefault();
    const user = currentUser;
    if (!user) return switchUser();
    try {
      const hash = await digestPassword($('#unlockPassword').value, user.salt);
      if (!safeEqual(hash, user.passwordHash)) { log('desbloqueio_falhou'); $('#unlockPassword').value=''; return setMessage('Senha incorreta.', 'danger'); }
      await saveSession({ locked: false });
      log('sessao_desbloqueada');
      $('#unlockPassword').value = '';
      if (restoredWhileLocked || (document.querySelector('main').hidden && $('#appDashboard').hidden)) {
        restoredWhileLocked = false;
        await finishLogin();
      } else hideAuth();
    } catch (error) { setMessage(error.message || 'Não foi possível desbloquear a sessão.', 'danger'); }
  }

  async function lock() {
    document.dispatchEvent(new Event('appauth:before-lock'));
    closeUserMenu();
    await saveSession({ locked: true });
    log('sessao_bloqueada');
    showLocked();
  }

  async function logout() {
    document.dispatchEvent(new Event('appauth:before-logout'));
    log('logout');
    storageRemove(key('session'));
    currentUser = null;
    document.querySelector('main').hidden = true;
    $('#appDashboard').hidden = true;
    closeUserMenu();
    showAuth();
  }

  async function switchUser() {
    document.dispatchEvent(new Event('appauth:before-switch'));
    log('troca_de_usuario');
    storageRemove(key('session'));
    currentUser = null;
    $('#unlockForm').hidden = true;
    showAuth();
  }

  async function finishLogin() {
    updateUserUi();
    hideAuth();
    const session = await readSession();
    migrateDisciplineData(session);
    const activity = readActivity();
    const number = activity?.lastExercise;
    if (number) currentUser.lastExerciseIndex = window.EXERCICIOS?.findIndex(item => item.numero === number);
    if (activity?.route === 'activities') showActivities({ replace: true });
    else if (/^exercise-\d+$/.test(activity?.route || '') && number) {
      const index = window.EXERCICIOS?.findIndex(item => item.numero === number);
      if (index >= 0) await openExercise(index, { history: false }); else showHome({ replace: true });
    } else showHome({ replace: true });
    document.dispatchEvent(new CustomEvent('appauth:ready', { detail: { user: currentUser, disciplineId: disciplineId() } }));
  }

  function exportLogs(format = 'json') {
    const list = logs().filter(item => !currentUser || item.user === currentUser.username);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (format === 'csv') {
      const headers = ['at', 'user', 'displayName', 'role', 'discipline', 'action', 'exercise', 'version', 'details'];
      const csv = [headers.join(';'), ...list.map(item => headers.map(header => {
        const value = header === 'details' ? JSON.stringify(item.details || {}) : item[header] ?? '';
        return `"${String(value).replaceAll('"', '""')}"`;
      }).join(';'))].join('\n');
      if (window.Utils?.download) Utils.download(`historico-${disciplineId()}-${scope()}-${stamp}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
    } else {
      const payload = { platform: config().name, disciplineId: disciplineId(), version: config().version, exportedAt: new Date().toISOString(), user: currentUser ? { username: currentUser.username, displayName: currentUser.displayName, group: currentUser.group } : null, logs: list };
      if (window.Utils?.download) Utils.download(`historico-${disciplineId()}-${scope()}-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json');
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
    $('#viewActivities')?.addEventListener('click', () => showActivities());
    $('#backPlatformHome')?.addEventListener('click', () => showHome());
    $('#exerciseSearch')?.addEventListener('input', renderActivities);
    $('#activityStatusFilter')?.addEventListener('change', renderActivities);
    $('#activityContentFilter')?.addEventListener('change', renderActivities);
    $('#clearActivityFilters')?.addEventListener('click', clearActivityFilters);
    $('#emptyClearFilters')?.addEventListener('click', clearActivityFilters);
    $$('[data-open-help="vscode"]').forEach(button => button.addEventListener('click', () => window.AppShell?.openInfo('Como usar a plataforma', `<h2>Fluxo de trabalho</h2><ol><li>Escolha a atividade.</li><li>Leia a explicação e use a referência como quadro.</li><li>Digite o código no editor.</li><li>Execute no terminal e teste cenários diferentes.</li><li>Valide, baixe o projeto e conclua.</li></ol><p>O Explorador aceita arquivos e pastas personalizados. O ZIP preserva a estrutura que você montou.</p>`)));
    window.addEventListener('hashchange', routeFromHash);
    const exerciseSelector = scope() === 'aluno' ? $('#exerciseSelect') : $('#exerciseSelect');
    if (exerciseSelector) {
      exerciseSelector.addEventListener('change', () => {
        if (!currentUser) return;
        const selectedIndex = Number(exerciseSelector.value);
        if ($('#appDashboard')) $('#appDashboard').hidden = true;
        document.querySelector('main').hidden = false;
        if (Number.isInteger(selectedIndex) && window.EXERCICIOS?.[selectedIndex]) {
          currentUser.lastExerciseIndex = selectedIndex;
          saveActivity({ lastExercise: window.EXERCICIOS[selectedIndex].numero, route: `exercise-${window.EXERCICIOS[selectedIndex].numero}` });
          saveSession().catch(() => {});
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
    ['pointerdown', 'keydown', 'touchstart'].forEach(type => document.addEventListener(type, () => { lastActivity = Date.now(); }, { passive: true }));
    document.addEventListener('keydown', event => {
      const gate = $('#authGate');
      if (event.key === 'Escape' && !$('#authUserPopover')?.hidden) { closeUserMenu(); $('#authUserButton')?.focus(); return; }
      if (event.key !== 'Tab' || !gate || gate.hidden) return;
      const focusable = [...gate.querySelectorAll('button:not([disabled]):not([hidden]),input:not([disabled]):not([hidden]),summary,[href]')].filter(element => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

  }

  async function restore() {
    const session = await readSession();
    if (!session) return showAuth();
    const user = userByUsername(session.username);
    if (!user) return showAuth();
    currentUser = { ...user };
    migrateDisciplineData(session);
    const activity = readActivity();
    currentUser.lastExerciseIndex = window.EXERCICIOS?.findIndex(item => item.numero === activity?.lastExercise);
    updateUserUi();
    log('sessao_restaurada');
    if (session.locked) { restoredWhileLocked = true; showLocked(); }
    else await finishLogin();
  }


  async function acceptCoreUser(info={}) {
    const email=String(info.email||'').trim().toLowerCase(),displayName=String(info.full_name||email||'Estudante').trim();
    currentUser={id:String(info.id||email),username:email||String(info.id||'agv-core'),displayName,group:String(info.class_name||''),role:scope(),central:true,createdAt:new Date().toISOString(),lastExerciseIndex:currentUser?.lastExerciseIndex??-1};
    updateUserUi();await finishLogin();log('agv_core_sessao_aceita',{email,group:currentUser.group});return currentUser;
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

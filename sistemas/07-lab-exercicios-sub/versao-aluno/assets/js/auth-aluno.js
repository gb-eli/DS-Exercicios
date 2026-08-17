window.AppAuth = (() => {
  const SESSION_DAYS = 5;
  const MAX_LOGS = 1200;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const config = () => window.APP_CONFIG || {};
  const scope = () => 'aluno';
  const key = name => `${config().storagePrefix || 'ds2sub'}_${scope()}_${name}_v1`;
  let currentUser = null;
  let initialized = false;
  let lastActivity = Date.now();
  let lockedReturnTarget = 'dashboard';

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
    let raw = localStorage.getItem(key('device_key'));
    if (!raw) {
      raw = bytesToBase64(randomBytes(32));
      localStorage.setItem(key('device_key'), raw);
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
    try { return JSON.parse(localStorage.getItem(key('users'))) || []; }
    catch (error) { return []; }
  }

  function saveUsers(list) {
    localStorage.setItem(key('users'), JSON.stringify(list));
  }

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '.');
  }

  function logs() {
    try { return JSON.parse(localStorage.getItem(key('logs'))) || []; }
    catch (error) { return []; }
  }

  function log(action, details = {}) {
    try {
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
      localStorage.setItem(key('logs'), JSON.stringify(list.slice(-MAX_LOGS)));
      return true;
    } catch (error) {
      // O histórico é complementar e nunca pode interromper o editor,
      // a validação, o salvamento ou a navegação do estudante.
      return false;
    }
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
    localStorage.setItem(key('session'), await encryptSession(payload));
  }

  async function readSession() {
    const raw = localStorage.getItem(key('session'));
    if (!raw) return null;
    try {
      const session = await decryptSession(raw);
      if (!session || session.role !== scope() || Date.now() > session.expiresAt) {
        localStorage.removeItem(key('session'));
        return null;
      }
      return session;
    } catch (error) {
      localStorage.removeItem(key('session'));
      return null;
    }
  }

  function userByUsername(username) {
    return users().find(item => item.username === normalizeUsername(username));
  }

  function authMarkup() {
    return `
      <div id="authGate" class="auth-gate" role="dialog" aria-modal="true" aria-labelledby="authTitle" aria-describedby="authDescription" aria-hidden="false">
        <div class="auth-background-grid"></div>
        <article class="auth-panel card">
          <div class="auth-brand"><span class="auth-logo">&lt;/&gt;</span><div><small>2 DS Sub - Aluno</small><h1 id="authTitle">${escapeHtml(config().shortName || 'Plataforma')}</h1><p id="authDescription">Sessão local criptografada neste navegador por até ${SESSION_DAYS} dias.</p></div></div>
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
            <label>Turma<input id="registerGroup" maxlength="30" placeholder="Ex.: 2 DS Sub - Noite"></label>
            <label>Senha<input id="registerPassword" type="password" minlength="6" required autocomplete="new-password" placeholder="Mínimo de 6 caracteres"></label>
            <label>Confirmar senha<input id="registerConfirm" type="password" minlength="6" required autocomplete="new-password"></label>
            <button type="submit">Criar usuário e entrar</button>
          </form>
          <form id="unlockForm" class="auth-form" hidden>
            <div class="lock-symbol">🔒</div><h2 id="lockedUserName">Sessão bloqueada</h2><p>Digite a senha para continuar sem perder o progresso.</p>
            <label>Senha<input id="unlockPassword" type="password" required autocomplete="current-password"></label>
            <button type="submit">Desbloquear</button><button type="button" class="secondary" data-auth-switch>Trocar de usuário</button>
          </form>
          <p id="authMessage" class="auth-message"></p>
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
      <button id="authUserButton" class="ghost auth-user-button" aria-expanded="false"><span class="auth-avatar">U</span><span class="auth-user-label">Usuário</span></button>
      <div id="authUserPopover" class="auth-user-popover card" hidden>
        <div class="auth-user-summary"><strong id="authDisplayName"></strong><span id="authUsername"></span><small>Sessão local por 5 dias</small></div>
        <button type="button" data-auth-home>Página inicial</button>
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
    const student = true;
    dashboard.innerHTML = `
      <section id="platformWelcome" class="platform-welcome" aria-labelledby="platformWelcomeTitle">
        <div class="dashboard-hero card">
          <div class="dashboard-hero-copy">
            <span class="chip info">Modo Aluno</span>
            <p class="dashboard-kicker">2 DS Subsequente - Programação Front-End</p>
            <h2 id="platformWelcomeTitle">Aprenda com prática progressiva</h2>
            <p>Desenvolva as atividades com explicações, prática no editor, preview, validação flexível e preparação para entrega.</p>
            <div class="dashboard-actions dashboard-primary-actions">
              <button id="viewActivities" type="button">Ver atividades</button>
              <button id="resumeExercise" class="secondary" type="button" hidden>Continuar último exercício</button>
              <button class="ghost" type="button" data-open-help="vscode">Tutorial da plataforma</button>
            </div>
          </div>
          <aside class="dashboard-summary" aria-label="Resumo da plataforma">
            <div><strong id="dashboardExerciseTotal">0</strong><span>atividades disponíveis</span></div>
            <div><strong id="dashboardCompletedTotal">0</strong><span>concluídas</span></div>
            <div><strong id="dashboardGeneralProgress">0%</strong><span>progresso geral</span></div>
          </aside>
        </div>
        <div class="dashboard-information-grid">
          <article class="card"><span class="dashboard-icon" aria-hidden="true">1</span><h3>Entenda</h3><p>Leia o contexto, observe o código em partes e consulte termos e símbolos.</p></article>
          <article class="card"><span class="dashboard-icon" aria-hidden="true">2</span><h3>Pratique</h3><p>Digite o código no editor, atualize o preview e teste a interação solicitada.</p></article>
          <article class="card"><span class="dashboard-icon" aria-hidden="true">3</span><h3>Corrija</h3><p>Use o diagnóstico para localizar diferenças e aprender com cada tentativa.</p></article>
          <article class="card"><span class="dashboard-icon" aria-hidden="true">4</span><h3>Entregue</h3><p>Baixe os arquivos, envie a pasta ao GitHub e entregue o link no Classroom.</p></article>
        </div>
        <div class="dashboard-secondary-actions card">
          <div><strong>Ambientes de continuidade</strong><span>O código pode ser baixado mesmo incompleto para continuar em outro dia.</span></div>
          <div><button class="secondary" type="button" data-open-github>Abrir GitHub</button><button class="success" type="button" data-open-classroom>Abrir Classroom</button></div>
        </div>
      </section>
      <section id="activitiesDirectory" class="activities-directory" hidden aria-labelledby="activitiesDirectoryTitle">
        <div class="dashboard-directory-header card">
          <button id="backToWelcome" class="ghost" type="button">Voltar à apresentação</button>
          <div><span class="chip info">Atividades</span><h2 id="activitiesDirectoryTitle">Escolha uma atividade</h2><p>Pesquise, filtre e continue do ponto em que parou.</p></div>
          <div class="directory-progress"><strong id="directoryCompletedTotal">0</strong><span>concluídas de <span id="directoryExerciseTotal">0</span></span></div>
        </div>
        <div class="dashboard-toolbar card">
          <label>Procurar exercício<input id="exerciseSearch" type="search" placeholder="Número, título ou conteúdo"></label>
          <label>Status<select id="exerciseStatusFilter"><option value="all">Todos</option><option value="not-started">Não iniciado</option><option value="in-progress">Em andamento</option><option value="awaiting">Aguardando validação</option><option value="completed">Concluído</option></select></label>
          <div><span id="availableCount" class="chip"></span><button class="secondary" data-auth-export="json">Exportar histórico</button></div>
        </div>
        <div id="exerciseCards" class="exercise-card-grid" aria-live="polite"></div>
        <div id="exerciseEmptyState" class="empty-state card" hidden><h3>Nenhuma atividade encontrada</h3><p>Altere a pesquisa ou o filtro de status.</p><button id="clearExerciseFilters" class="secondary" type="button">Limpar filtros</button></div>
      </section>`;
    const main = document.querySelector('main');
    main.parentNode.insertBefore(dashboard, main);
    return dashboard;
  }

  function progressOwner() {
    return String(currentUser?.username || 'sem-usuario').replace(/[^a-z0-9._-]/gi, '_');
  }

  function exerciseProgressKey(exercise) {
    const prefix = config().storagePrefix || 'ds2sub';
    const code = exercise.codigo || exercise.numero;
    return `${prefix}_${progressOwner()}_${code}_state_v2`;
  }

  function notifyBeforeNavigation(reason) {
    const main = document.querySelector('main');
    if (main && !main.hidden) document.dispatchEvent(new CustomEvent('appauth:before-navigation', { detail: { reason } }));
  }

  function progressFor(exercise) {
    try {
      const saved = JSON.parse(localStorage.getItem(exerciseProgressKey(exercise))) || {};
      const files = exercise.ordemArquivos || Object.keys(exercise.arquivos || {});
      const done = files.filter(keyName => saved.done?.[keyName]).length;
      const hasCode = Object.values(saved.answers || {}).some(value => String(value || '').trim());
      let percentage = files.length ? Math.round(done / files.length * 100) : 0;
      if (!percentage && hasCode) percentage = 8;
      const timeReady = Number(saved.activeSeconds || 0) >= Number(exercise.tempoMinimoSegundos || config().minimumActiveSeconds || 300);
      const completed = Boolean(saved.completedAt) && done === files.length;
      if (completed) return { percentage: 100, label: 'Concluído', tone: 'success', key: 'completed', action: 'Revisar atividade' };
      if (done === files.length) return { percentage: Math.max(95, percentage), label: 'Aguardando validação', tone: 'warning', key: 'awaiting', action: 'Validar' };
      if (percentage || hasCode || Number(saved.activeSeconds || 0) > 0) return { percentage: Math.max(8, percentage), label: 'Em andamento', tone: 'warning', key: 'in-progress', action: 'Continuar' };
      return { percentage: 0, label: 'Não iniciado', tone: 'info', key: 'not-started', action: 'Começar' };
    } catch (error) {
      return { percentage: 0, label: 'Não iniciado', tone: 'info', key: 'not-started', action: 'Começar' };
    }
  }

  function dashboardStats() {
    const items = window.EXERCICIOS || [];
    const progress = items.map(progressFor);
    const completed = progress.filter(item => item.key === 'completed').length;
    const average = items.length ? Math.round(progress.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / items.length) : 0;
    return { total: items.length, completed, average };
  }

  function renderDashboard(filter = '') {
    const dashboard = $('#appDashboard') || dashboardMarkup();
    const query = String(filter || '').trim().toLowerCase();
    const status = $('#exerciseStatusFilter')?.value || 'all';
    const stats = dashboardStats();
    const greeting = currentUser?.displayName?.split(/\s+/)[0] || 'usuário';
    const welcomeTitle = $('#platformWelcomeTitle');
    if (welcomeTitle) welcomeTitle.textContent = `Olá, ${greeting}. Continue aprendendo.`;
    ['dashboardExerciseTotal', 'directoryExerciseTotal'].forEach(id => { if ($(`#${id}`)) $(`#${id}`).textContent = String(stats.total); });
    ['dashboardCompletedTotal', 'directoryCompletedTotal'].forEach(id => { if ($(`#${id}`)) $(`#${id}`).textContent = String(stats.completed); });
    if ($('#dashboardGeneralProgress')) $('#dashboardGeneralProgress').textContent = `${stats.average}%`;

    const list = (window.EXERCICIOS || []).map((item, index) => ({ item, index, progress: progressFor(item) })).filter(({ item, progress }) => {
      const haystack = `${item.numero} ${item.codigo || ''} ${item.titulo} ${item.tema} ${(item.novos || []).join(' ')}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesStatus = status === 'all' || progress.key === status;
      return matchesQuery && matchesStatus;
    });
    if ($('#availableCount')) $('#availableCount').textContent = `${list.length} exercício${list.length === 1 ? '' : 's'} disponível${list.length === 1 ? '' : 'is'}`;
    $('#exerciseCards').innerHTML = list.map(({ item, index, progress }) => {
      const contents = (item.novos || []).slice(0, 5).join(' · ') || item.tema || 'Fundamentos de Front-End';
      const minutes = Math.max(1, Math.round(Number(item.tempoMinimoSegundos || config().minimumActiveSeconds || 300) / 60));
      const level = Number(item.numero || index + 1) <= 3 ? 'iniciante' : Number(item.numero || index + 1) <= 6 ? 'progressivo' : 'integração';
      return `<article class="exercise-choice card" data-exercise-index="${index}">
        <div class="exercise-choice-number">${String(item.numero).padStart(2, '0')}</div>
        <div class="exercise-choice-body"><span class="chip ${progress.tone}">${progress.label}</span><h3>${escapeHtml(item.nomeCurto || item.titulo)}</h3><p>${escapeHtml(item.objetivo || item.tema || '')}</p><div class="mini-progress" aria-label="${progress.percentage}% concluído"><i style="width:${progress.percentage}%"></i></div><p class="exercise-content-line"><strong>Conteúdos:</strong> ${escapeHtml(contents)}</p><div class="exercise-meta"><span>Tempo estimado: ${minutes} minutos</span><span>Nível: ${level}</span></div></div>
        <button data-open-exercise="${index}">${progress.action}</button>
      </article>`;
    }).join('');
    const empty = $('#exerciseEmptyState');
    if (empty) empty.hidden = list.length > 0;
    $$('[data-open-exercise]').forEach(button => button.addEventListener('click', () => openExercise(Number(button.dataset.openExercise))));
    const resume = $('#resumeExercise');
    const last = Number(currentUser?.lastExerciseIndex);
    resume.hidden = !Number.isInteger(last) || !window.EXERCICIOS?.[last];
    if (!resume.hidden) resume.onclick = () => openExercise(last);
    return dashboard;
  }

  function escapeHtml(value = '') {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }

  async function openExercise(index) {
    const selector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    if (!selector || !window.EXERCICIOS?.[index]) return;
    selector.value = String(index);
    setHeaderContext('exercise', index);
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    currentUser.lastExerciseIndex = index;
    await saveSession({ lastExercise: window.EXERCICIOS[index].numero });
    $('#appDashboard').hidden = true;
    document.querySelector('main').hidden = false;
    history.replaceState({ view: 'exercise', index }, '', `#exercicio-${window.EXERCICIOS[index].codigo || index + 1}`);
    log('exercicio_aberto', { index, numero: window.EXERCICIOS[index].numero, titulo: window.EXERCICIOS[index].titulo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setHeaderContext(context, index = null) {
    const title = scope() === 'aluno' ? $('#studentTitle') : $('#tituloPagina');
    if (!title) return;
    if (context === 'home') title.textContent = 'Programação Front-End - 2 DS Subsequente';
    else if (context === 'activities') title.textContent = 'Atividades de Programação Front-End';
    else if (context === 'exercise' && Number.isInteger(index) && window.EXERCICIOS?.[index]) title.textContent = window.EXERCICIOS[index].titulo;
  }

  function showHome() {
    notifyBeforeNavigation('inicio');
    setHeaderContext('home');
    document.querySelector('main').hidden = true;
    const dashboard = $('#appDashboard') || dashboardMarkup();
    dashboard.hidden = false;
    $('#platformWelcome').hidden = false;
    $('#activitiesDirectory').hidden = true;
    renderDashboard($('#exerciseSearch')?.value || '');
    closeUserMenu();
    log('pagina_apresentacao_aberta');
    history.replaceState({ view: 'home' }, '', '#inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showActivities() {
    notifyBeforeNavigation('atividades');
    setHeaderContext('activities');
    document.querySelector('main').hidden = true;
    const dashboard = $('#appDashboard') || dashboardMarkup();
    dashboard.hidden = false;
    $('#platformWelcome').hidden = true;
    $('#activitiesDirectory').hidden = false;
    renderDashboard($('#exerciseSearch')?.value || '');
    closeUserMenu();
    log('lista_atividades_aberta');
    history.replaceState({ view: 'activities' }, '', '#atividades');
    setTimeout(() => $('#exerciseSearch')?.focus({ preventScroll: true }), 30);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applicationElements() {
    return [
      document.querySelector('.app-header'),
      document.querySelector('main'),
      document.querySelector('#appDashboard'),
      document.querySelector('.version-footer')
    ].filter(Boolean);
  }

  function setApplicationInert(active) {
    applicationElements().forEach(element => {
      element.inert = Boolean(active);
      if (active) element.setAttribute('aria-hidden', 'true');
      else element.removeAttribute('aria-hidden');
    });
  }

  function visibleAuthFocusable() {
    const gate = $('#authGate');
    if (!gate || gate.hidden) return [];
    return [...gate.querySelectorAll('button, input, select, textarea, summary, [href], [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.disabled && !element.hidden && element.getClientRects().length > 0);
  }

  function focusFirstAuthControl() {
    const preferred = !$('#unlockForm')?.hidden
      ? $('#unlockPassword')
      : !$('#registerForm')?.hidden
        ? $('#registerName')
        : $('#loginUsername');
    (preferred || visibleAuthFocusable()[0])?.focus({ preventScroll: true });
  }

  function trapAuthFocus(event) {
    if (event.key !== 'Tab' || $('#authGate')?.hidden) return;
    const focusable = visibleAuthFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !focusable.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !focusable.includes(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  function showTab(tab) {
    $('#loginForm').hidden = tab !== 'login';
    $('#registerForm').hidden = tab !== 'register';
    $('#unlockForm').hidden = true;
    $$('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.dataset.authTab === tab));
    $('#authTabs').hidden = false;
    setMessage('');
    setTimeout(focusFirstAuthControl, 30);
  }

  function clearSensitiveInputs() {
    ['#loginPassword', '#registerPassword', '#registerConfirm', '#unlockPassword'].forEach(selector => {
      const input = $(selector);
      if (input) input.value = '';
    });
  }

  function hideApplicationForAuthentication() {
    const main = document.querySelector('main');
    if (main) main.hidden = true;
    const dashboard = $('#appDashboard');
    if (dashboard) dashboard.hidden = true;
  }

  function showAuth() {
    clearSensitiveInputs();
    setApplicationInert(true);
    $('#authGate').hidden = false;
    $('#authGate').setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-open');
    const list = users();
    showTab(list.length ? 'login' : 'register');
    renderRecentUsers();
    setTimeout(focusFirstAuthControl, 40);
  }

  function hideAuth() {
    $('#authGate').hidden = true;
    $('#authGate').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('auth-open');
    setApplicationInert(false);
  }

  function showLocked() {
    const main = document.querySelector('main');
    const dashboard = $('#appDashboard');
    lockedReturnTarget = main && !main.hidden ? 'main' : dashboard && !dashboard.hidden ? 'dashboard' : 'dashboard';
    setApplicationInert(true);
    $('#authGate').hidden = false;
    $('#authGate').setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-open');
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
    $('#authUsername').textContent = `@${currentUser.username}${currentUser.group ? ` - ${currentUser.group}` : ''}`;
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
      setMessage('Criando usuário local...');
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
      setMessage('Verificando...');
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
    try {
      const hash = await digestPassword($('#unlockPassword').value, user.salt);
      if (!safeEqual(hash, user.passwordHash)) { log('desbloqueio_falhou'); return setMessage('Senha incorreta.', 'danger'); }
      await saveSession({ locked: false });
      log('sessao_desbloqueada');
      hideAuth();
      if (lockedReturnTarget === 'main') {
        const main = document.querySelector('main');
        if (main) main.hidden = false;
        const dashboard = $('#appDashboard');
        if (dashboard) dashboard.hidden = true;
      } else {
        showHome();
      }
      document.dispatchEvent(new CustomEvent('appauth:ready', { detail: { user: currentUser, restoredFromLock: true } }));
    } catch (error) {
      setMessage(error.message || 'Não foi possível desbloquear a sessão.', 'danger');
    }
  }

  async function lock() {
    notifyBeforeNavigation('bloquear');
    closeUserMenu();
    await saveSession({ locked: true });
    log('sessao_bloqueada');
    showLocked();
  }

  async function logout() {
    notifyBeforeNavigation('sair');
    log('logout');
    localStorage.removeItem(key('session'));
    currentUser = null;
    hideApplicationForAuthentication();
    closeUserMenu();
    showAuth();
  }

  async function switchUser() {
    notifyBeforeNavigation('trocar_usuario');
    log('troca_de_usuario');
    localStorage.removeItem(key('session'));
    currentUser = null;
    hideApplicationForAuthentication();
    $('#unlockForm').hidden = true;
    closeUserMenu();
    showAuth();
  }

  async function finishLogin() {
    updateUserUi();
    hideAuth();
    const session = await readSession();
    const number = session?.lastExercise;
    if (number) currentUser.lastExerciseIndex = window.EXERCICIOS?.findIndex(item => item.numero === number);
    document.dispatchEvent(new CustomEvent('appauth:ready', { detail: { user: currentUser } }));
    showHome();
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
    $('#viewActivities')?.addEventListener('click', showActivities);
    $('#backToWelcome')?.addEventListener('click', showHome);
    $('#exerciseSearch')?.addEventListener('input', event => renderDashboard(event.target.value));
    $('#exerciseStatusFilter')?.addEventListener('change', () => renderDashboard($('#exerciseSearch')?.value || ''));
    $('#clearExerciseFilters')?.addEventListener('click', () => {
      if ($('#exerciseSearch')) $('#exerciseSearch').value = '';
      if ($('#exerciseStatusFilter')) $('#exerciseStatusFilter').value = 'all';
      renderDashboard('');
    });
    const exerciseSelector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    if (exerciseSelector) {
      exerciseSelector.addEventListener('change', () => {
        if (!currentUser) return;
        const selectedIndex = Number(exerciseSelector.value);
        if ($('#appDashboard')) $('#appDashboard').hidden = true;
        document.querySelector('main').hidden = false;
        if (Number.isInteger(selectedIndex) && window.EXERCICIOS?.[selectedIndex]) {
          currentUser.lastExerciseIndex = selectedIndex;
          saveSession({ lastExercise: window.EXERCICIOS[selectedIndex].numero }).catch(() => {});
          log('exercicio_aberto_pelo_seletor', { numero: window.EXERCICIOS[selectedIndex].numero });
        }
      });
    }
    const homeLink = document.querySelector('.header-actions a[href="index.html"]');
    if (homeLink) {
      homeLink.textContent = 'Início';
      homeLink.addEventListener('click', event => { event.preventDefault(); showHome(); });
    }
    document.addEventListener('keydown', event => {
      if (!$('#authGate')?.hidden) trapAuthFocus(event);
      if (event.key === 'Escape' && !$('#authUserPopover')?.hidden) {
        closeUserMenu();
        $('#authUserButton')?.focus({ preventScroll: true });
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('#authUserMenu')) closeUserMenu();
      const external = event.target.closest('[data-open-github],[data-open-classroom]');
      if (external) log(external.hasAttribute('data-open-github') ? 'github_aberto' : 'classroom_aberto');
    }, true);
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

  return { init, log, showHome, showActivities, openExercise, lock, logout, switchUser, exportLogs, acceptCoreUser, currentUser: () => currentUser };
})();

document.addEventListener('DOMContentLoaded', () => AppAuth.init());

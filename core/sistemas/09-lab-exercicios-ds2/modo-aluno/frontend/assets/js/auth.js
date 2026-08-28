window.AppAuth = (() => {
  const SESSION_DAYS = 5;
  const MAX_LOGS = 1200;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const config = () => window.APP_CONFIG || {};
  const scope = () => /professor/i.test(config().name || '') ? 'professor' : 'aluno';

const projectNamespace = () => String(config().storageNamespace || '2ds-frontend-manha').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
const key = name => `ds2_${projectNamespace()}_${scope()}_${name}_v2`;
const legacyKey = name => `ds2_${scope()}_${name}_v1`;
function scopedGet(name) {
  const current = Utils.storageGet(key(name));
  if (current !== null) return current;
  const legacy = Utils.storageGet(legacyKey(name));
  if (legacy !== null) { Utils.storageSet(key(name), legacy); return legacy; }
  return null;
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
    let raw = scopedGet('device_key');
    if (!raw) {
      raw = bytesToBase64(randomBytes(32));
      Utils.storageSet(key('device_key'), raw);
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
    try { return JSON.parse(scopedGet('users')) || []; }
    catch (error) { return []; }
  }

  function saveUsers(list) {
    Utils.storageSet(key('users'), JSON.stringify(list));
  }

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '.');
  }

  function logs() {
    try { return JSON.parse(scopedGet('logs')) || []; }
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
    Utils.storageSet(key('logs'), JSON.stringify(list.slice(-MAX_LOGS)));
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
    Utils.storageSet(key('session'), await encryptSession(payload));
  }

  async function readSession() {
    const raw = scopedGet('session');
    if (!raw) return null;
    try {
      const session = await decryptSession(raw);
      if (!session || session.role !== scope() || Date.now() > session.expiresAt) {
        Utils.storageRemove(key('session'));
        return null;
      }
      return session;
    } catch (error) {
      Utils.storageRemove(key('session'));
      return null;
    }
  }

  function userByUsername(username) {
    return users().find(item => item.username === normalizeUsername(username));
  }

  function authMarkup() {
    return `
      <div id="authGate" class="auth-gate" aria-live="polite" aria-hidden="false">
        <div class="auth-background-grid"></div>
        <article class="auth-panel card" role="dialog" aria-modal="true" aria-labelledby="authDialogTitle" aria-describedby="authDialogDescription">
          <div class="auth-brand"><span class="auth-logo">&lt;/&gt;</span><div><small>2º DS · ${scope() === 'professor' ? 'Professor' : 'Aluno'}</small><h1 id="authDialogTitle">Plataforma Front-End</h1><p id="authDialogDescription">Sessão local criptografada neste navegador por até ${SESSION_DAYS} dias.</p></div></div>
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
            <label>${scope() === 'professor' ? 'Identificação' : 'Turma'}<input id="registerGroup" maxlength="30" placeholder="${scope() === 'professor' ? 'Professor de Front-End' : 'Ex.: 2º DS A'}"></label>
            <label>Senha<input id="registerPassword" type="password" minlength="6" required autocomplete="new-password" placeholder="Mínimo de 6 caracteres"></label>
            <label>Confirmar senha<input id="registerConfirm" type="password" minlength="6" required autocomplete="new-password"></label>
            <button type="submit">Criar usuário e entrar</button>
          </form>
          <form id="unlockForm" class="auth-form" hidden>
            <div class="lock-symbol">🔒</div><h2 id="lockedUserName">Sessão bloqueada</h2><p>Digite a senha para continuar sem perder o progresso.</p>
            <label>Senha<input id="unlockPassword" type="password" required autocomplete="current-password"></label>
            <button type="submit">Desbloquear</button><button type="button" role="menuitem" class="secondary" data-auth-switch>Trocar de usuário</button>
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
      <div id="authUserPopover" class="auth-user-popover card" role="menu" hidden>
        <div class="auth-user-summary"><strong id="authDisplayName"></strong><span id="authUsername"></span><small>Sessão local por 5 dias</small></div>
        <button type="button" role="menuitem" data-auth-home>Página inicial</button>
        <button type="button" role="menuitem" class="secondary" data-auth-lock>Bloquear</button>
        <button type="button" role="menuitem" class="secondary" data-auth-switch>Trocar usuário</button>
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
            <span class="eyebrow">2º DS A · Manhã · ${scope() === 'professor' ? 'Modo Professor' : 'Modo Aluno'}</span>
            <h2>Programação Front-End</h2>
            <p id="dashboardGreeting" class="home-greeting">Olá!</p>
            <p class="platform-lead">${scope() === 'professor'
              ? 'Prepare, apresente e acompanhe atividades progressivas de HTML, CSS e JavaScript com materiais pedagógicos, códigos de referência, Classroom e ambiente de demonstração.'
              : 'Desenvolva páginas Web utilizando HTML, CSS e JavaScript. As atividades trabalham estrutura, aparência, interatividade, responsividade, acessibilidade e organização de projetos no Visual Studio Code.'}</p>
            <p class="platform-objective"><strong>Objetivo geral:</strong> aprender a construir, testar, corrigir e organizar projetos Web progressivos com autonomia.</p>
            <div class="platform-content-line"><strong>Principais conteúdos:</strong> HTML · CSS · JavaScript · DOM · eventos · responsividade · acessibilidade · GitHub</div>
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
            <div class="home-progress">
              <div><span>Progresso geral</span><strong id="homeGeneralProgress">0%</strong></div>
              <div class="mini-progress home-progress-track"><i id="homeGeneralProgressBar"></i></div>
            </div>
          </aside>
        </div>

        <div class="platform-home-grid">
          <article class="card platform-info-card">
            <span class="info-step">01</span>
            <h3>Escolha uma atividade</h3>
            <p>A lista fica em uma página própria, com pesquisa, filtros, status e progresso.</p>
          </article>
          <article class="card platform-info-card">
            <span class="info-step">02</span>
            <h3>Entenda e pratique</h3>
            <p>Revise contexto, explicações e exemplos antes de construir o projeto no ambiente inspirado no VS Code.</p>
          </article>
          <article class="card platform-info-card">
            <span class="info-step">03</span>
            <h3>Execute e corrija</h3>
            <p>Use Preview, Console, Terminal, Problemas e Modo Ajuda para testar o comportamento real do código.</p>
          </article>
          <article class="card platform-info-card">
            <span class="info-step">04</span>
            <h3>Valide e entregue</h3>
            <p>Baixe o ZIP ou arquivos individuais, envie a pasta ao GitHub e entregue o link no Classroom.</p>
          </article>
        </div>

        <article class="card delivery-home-card">
          <div>
            <span class="chip info">Entrega</span>
            <h3>Um único repositório para as atividades</h3>
            <p>Organize cada exercício em sua própria pasta dentro do repositório <code>${escapeHtml(config().repositorio || 'atividades-praticas')}</code>. A estrutura criada no Explorador é preservada no ZIP.</p>
          </div>
          <div class="delivery-home-actions">
            <button class="secondary" data-open-github>GitHub</button>
            <button class="success" data-open-classroom>Classroom</button>
          </div>
        </article>
      </section>

      <section id="activitiesPage" class="activities-page" hidden>
        <div class="activities-header card">
          <div>
            <button id="backPlatformHome" class="ghost compact">← Voltar ao início</button>
            <span class="eyebrow">Trilha prática</span>
            <h2>Atividades</h2>
            <p>Pesquise por número, título ou conteúdo e continue do ponto em que parou.</p>
          </div>
          <div class="activities-summary">
            <div><strong id="activitiesTotalCount">0</strong><span>total</span></div>
            <div><strong id="activitiesCompletedCount">0</strong><span>concluídas</span></div>
            <div><strong id="activitiesProgressCount">0</strong><span>em andamento</span></div>
          </div>
        </div>

        <div class="activities-toolbar card">
          <label class="activity-search-label">Pesquisar
            <input id="exerciseSearch" type="search" placeholder="Número, título ou assunto">
          </label>
          <label id="statusFilterLabel">Status
            <select id="activityStatusFilter">
              <option value="">Todos os status</option>
              <option value="Não iniciado">Não iniciado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Aguardando validação">Aguardando validação</option>
              <option value="Concluído">Concluído</option>
              <option value="Revisão necessária">Revisão necessária</option>
            </select>
          </label>
          <label>Conteúdo
            <select id="activityContentFilter">
              <option value="">Todos os conteúdos</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="dom">DOM e eventos</option>
              <option value="arrays">Arrays e objetos</option>
              <option value="dados">API, JSON e dados</option>
              <option value="armazenamento">Armazenamento local</option>
            </select>
          </label>
          <button id="clearActivityFilters" class="secondary">Limpar filtros</button>
          <div class="activities-toolbar-meta">
            <span id="availableCount" class="chip"></span>
            <button class="ghost" data-auth-export="json">Exportar histórico</button>
          </div>
        </div>

        <div id="activitiesEmptyState" class="activities-empty card" hidden role="status" aria-live="polite">
          <strong>Nenhuma atividade encontrada.</strong>
          <p>Altere a pesquisa ou limpe os filtros para visualizar novamente as atividades.</p>
          <button id="emptyClearFilters" class="secondary">Limpar filtros</button>
        </div>

        <div id="exerciseCards" class="exercise-card-grid"></div>
      </section>`;
    const main = document.querySelector('main');
    main.parentNode.insertBefore(dashboard, main);
    return dashboard;
  }

  function savedStateFor(exercise) {
    if (scope() === 'professor') return null;
    try {
      const username = currentUser?.username || 'sem-usuario';
      const namespace = projectNamespace();
      const candidates = [
        `ds2_${namespace}_${username}_ex${exercise.numero}_state_v7`,
        `ds2_${namespace}_${username}_ex${exercise.numero}_state_v6`,
        `ds2_${namespace}_${username}_ex${exercise.numero}_state_v5`
      ];
      for (const storageKey of candidates) {
        const raw = Utils.storageGet(storageKey);
        if (!raw) continue;
        const saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') return saved;
      }
    } catch (error) {}
    return null;
  }

  function progressFor(exercise) {
    if (scope() === 'professor') {
      return { percentage: 100, label: 'Material disponível', status: 'Disponível', tone: 'info', hasProgress: false };
    }
    const saved = savedStateFor(exercise);
    if (!saved) return { percentage: 0, label: 'Não iniciado', status: 'Não iniciado', tone: 'info', hasProgress: false };

    const done = ['html', 'css', 'js'].filter(keyName => saved.done?.[keyName]).length;
    const hasAnswers = Object.values(saved.answers || {}).some(value => String(value || '').trim());
    const hasAttempts = Object.values(saved.attempts || {}).some(value => Number(value || 0) > 0);
    const hasLearning = Object.values(saved.explained || {}).some(value => Number(value || 0) > 0);
    const hasProgress = Boolean(saved.completed || saved.savedAt || hasAnswers || hasAttempts || hasLearning || done);
    const completed = Boolean(saved.completed && done === 3);

    if (!hasProgress) return { percentage: 0, label: 'Não iniciado', status: 'Não iniciado', tone: 'info', hasProgress: false };
    if (completed) return { percentage: 100, label: 'Concluído', status: 'Concluído', tone: 'success', hasProgress: true };
    if (done === 3) return { percentage: 95, label: 'Aguardando validação', status: 'Aguardando validação', tone: 'warning', hasProgress: true };

    let percentage = Math.max(12, Math.round(done / 3 * 84));
    if (hasAnswers && done === 0) percentage = 18;
    if (hasAttempts && percentage < 24) percentage = 24;
    return { percentage, label: 'Em andamento', status: 'Em andamento', tone: 'warning', hasProgress: true };
  }

  function activityMeta(item) {
    const number = Number(item.numero || 0);
    const time = item.tempoEstimado || (number <= 10 ? '20–25 min' : number <= 20 ? '25–30 min' : '30–35 min');
    const level = item.nivel || (number <= 10 ? 'Iniciante' : number <= 20 ? 'Fundamentos' : 'Intermediário');
    return { time, level };
  }

  function contentGroup(item) {
    const text = `${item.titulo || ''} ${item.tema || ''} ${(item.novos || []).join(' ')}`.toLowerCase();
    if (/viacep|api|json|fetch|promise|dados/.test(text)) return 'dados';
    if (/localstorage|armazen/.test(text)) return 'armazenamento';
    if (/array|objeto|foreach|map|filter|find|some|every|reduce/.test(text)) return 'arrays';
    if (/dom|evento|addeventlistener|classlist|getelementbyid|queryselector/.test(text)) return 'dom';
    if (/css|estilo|flex|grid|responsiv/.test(text) && !/javascript/.test(text)) return 'css';
    if (/html|tag|semânt|semant/.test(text) && !/javascript/.test(text)) return 'html';
    return 'javascript';
  }

  function allProgress() {
    return (window.EXERCICIOS || []).map(item => ({ item, progress: progressFor(item) }));
  }

  function renderHomeSummary() {
    const list = allProgress();
    const completed = list.filter(entry => entry.progress.status === 'Concluído').length;
    const inProgress = list.filter(entry => ['Em andamento', 'Aguardando validação', 'Revisão necessária'].includes(entry.progress.status)).length;
    const average = scope() === 'professor'
      ? 100
      : Math.round(list.reduce((total, entry) => total + entry.progress.percentage, 0) / Math.max(1, list.length));

    $('#dashboardGreeting').textContent = scope() === 'professor'
      ? `Olá, ${currentUser?.displayName || 'professor'}!`
      : `Olá, ${String(currentUser?.displayName || 'aluno').split(/\s+/)[0]}!`;

    $('#homeTotalActivities').textContent = String(list.length);
    $('#homeCompletedActivities').textContent = String(completed);
    $('#homeInProgressActivities').textContent = String(inProgress);
    $('#homeGeneralProgress').textContent = `${average}%`;
    $('#homeGeneralProgressBar').style.width = `${average}%`;

    const resume = $('#resumeExercise');
    const preferred = Number(currentUser?.lastExerciseIndex);
    const preferredProgress = Number.isInteger(preferred) && window.EXERCICIOS?.[preferred] ? progressFor(window.EXERCICIOS[preferred]) : null;
    let resumeIndex = preferredProgress?.hasProgress ? preferred : -1;
    if (resumeIndex < 0) {
      const candidates = list.map((entry, index) => ({ ...entry, index })).filter(entry => entry.progress.hasProgress && entry.progress.status !== 'Concluído');
      if (candidates.length) resumeIndex = candidates.at(-1).index;
    }
    resume.hidden = scope() === 'professor' || resumeIndex < 0;
    if (!resume.hidden) resume.onclick = () => openExercise(resumeIndex);
  }

  function renderActivitySummary() {
    const list = allProgress();
    $('#activitiesTotalCount').textContent = String(list.length);
    $('#activitiesCompletedCount').textContent = String(list.filter(entry => entry.progress.status === 'Concluído').length);
    $('#activitiesProgressCount').textContent = String(list.filter(entry => ['Em andamento', 'Aguardando validação', 'Revisão necessária'].includes(entry.progress.status)).length);
  }

  function activityButtonText(progress) {
    if (scope() === 'professor') return 'Abrir aula';
    if (progress.status === 'Concluído') return 'Revisar atividade';
    if (progress.status === 'Aguardando validação') return 'Validar';
    if (progress.status === 'Revisão necessária') return 'Corrigir atividade';
    if (progress.status === 'Em andamento') return 'Continuar';
    return 'Começar';
  }

  function renderActivities() {
    const query = String($('#exerciseSearch')?.value || '').trim().toLowerCase();
    const statusFilter = String($('#activityStatusFilter')?.value || '');
    const contentFilter = String($('#activityContentFilter')?.value || '');

    const list = (window.EXERCICIOS || []).map((item, index) => {
      const progress = progressFor(item);
      const meta = activityMeta(item);
      const group = contentGroup(item);
      return { item, index, progress, meta, group };
    }).filter(entry => {
      const { item, progress, group } = entry;
      const haystack = `${item.numero} ${item.titulo} ${item.nomeCurto || ''} ${item.tema || ''} ${(item.novos || []).join(' ')}`.toLowerCase();
      const queryOk = !query || haystack.includes(query);
      const statusOk = scope() === 'professor' || !statusFilter || progress.status === statusFilter;
      const contentOk = !contentFilter || group === contentFilter;
      return queryOk && statusOk && contentOk;
    });

    const count = list.length;
    $('#availableCount').textContent = `${count} ${count === 1 ? 'exercício disponível' : 'exercícios disponíveis'}`;
    $('#exerciseCards').innerHTML = list.map(({ item, index, progress, meta }) => {
      const contents = (item.novos || []).slice(0, 5).join(' · ') || item.tema || 'HTML · CSS · JavaScript';
      return `<article class="exercise-choice card" data-exercise-index="${index}">
        <div class="exercise-choice-number">${String(item.numero).padStart(2, '0')}</div>
        <div class="exercise-choice-body">
          <div class="exercise-card-topline"><span class="chip ${progress.tone}">${escapeHtml(progress.label)}</span><span class="exercise-level">${escapeHtml(meta.level)}</span></div>
          <h3>${escapeHtml(item.nomeCurto || item.titulo)}</h3>
          <p>${escapeHtml(item.objetivo || item.tema || '')}</p>
          <div class="exercise-content-line"><strong>Conteúdos:</strong> ${escapeHtml(contents)}</div>
          <div class="exercise-meta-line"><span>⏱ ${escapeHtml(meta.time)}</span><span>${escapeHtml(meta.level)}</span></div>
          ${scope() === 'professor' ? '' : `<div class="mini-progress" aria-label="${progress.percentage}% de progresso"><i style="width:${progress.percentage}%"></i></div>`}
        </div>
        <button data-open-exercise="${index}">${activityButtonText(progress)}</button>
      </article>`;
    }).join('');

    $$('[data-open-exercise]').forEach(button => button.addEventListener('click', () => openExercise(Number(button.dataset.openExercise))));
    $('#activitiesEmptyState').hidden = count > 0;
    $('#exerciseCards').hidden = count === 0;
    renderActivitySummary();
  }

  function renderDashboard() {
    renderHomeSummary();
    renderActivities();
  }

  function escapeHtml(value = '') {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }


  function setDashboardHeader(active) {
    document.body.classList.toggle('dashboard-mode', Boolean(active));
    const title = scope() === 'aluno' ? $('#studentTitle') : $('#tituloPagina');
    if (active && title) title.textContent = 'Programação Front-End';
  }

  function setRoute(route, replace = false) {
    const hash = `#${route}`;
    if (location.hash === hash) return;
    const url = `${location.pathname}${location.search}${hash}`;
    history[replace ? 'replaceState' : 'pushState']({ route }, '', url);
  }

  function routeFromLocation(options = {}) {
    if (!currentUser) return;
    const hash = String(location.hash || '#home').replace(/^#/, '');
    const match = hash.match(/^exercise-(\d{1,2})$/);
    if (match) {
      const number = Number(match[1]);
      const index = window.EXERCICIOS?.findIndex(item => Number(item.numero) === number);
      if (index >= 0) return openExercise(index, { persist: false, history: false });
    }
    if (hash === 'activities') return showActivities({ persist: false, history: false });
    return showHome({ persist: false, history: false });
  }

  async function openExercise(index, options = {}) {
    flushAppProgress();
    const selector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    if (!selector || !window.EXERCICIOS?.[index]) return;
    selector.value = String(index);
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    currentUser.lastExerciseIndex = index;
    if (options.persist !== false) await saveSession({ lastExercise: window.EXERCICIOS[index].numero, lastView: 'exercise' });
    $('#appDashboard').hidden = true;
    document.querySelector('main').hidden = false;
    setDashboardHeader(false);
    if (options.history !== false) setRoute(`exercise-${String(window.EXERCICIOS[index].numero).padStart(2, '0')}`);
    log('exercicio_aberto', { index, numero: window.EXERCICIOS[index].numero, titulo: window.EXERCICIOS[index].titulo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHome(options = {}) {
    flushAppProgress();
    if (currentUser && options.persist !== false) saveSession({ lastView: 'home' }).catch(() => {});
    document.querySelector('main').hidden = true;
    const dashboard = $('#appDashboard') || dashboardMarkup();
    dashboard.hidden = false;
    $('#platformHome').hidden = false;
    $('#activitiesPage').hidden = true;
    setDashboardHeader(true);
    renderHomeSummary();
    closeUserMenu();
    if (options.history !== false) setRoute('home', Boolean(options.replace));
    log('pagina_inicial_aberta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showActivities(options = {}) {
    flushAppProgress();
    if (currentUser && options.persist !== false) saveSession({ lastView: 'activities' }).catch(() => {});
    document.querySelector('main').hidden = true;
    const dashboard = $('#appDashboard') || dashboardMarkup();
    dashboard.hidden = false;
    $('#platformHome').hidden = true;
    $('#activitiesPage').hidden = false;
    setDashboardHeader(true);
    if (scope() === 'professor') $('#statusFilterLabel').hidden = true;
    renderActivities();
    closeUserMenu();
    if (options.history !== false) setRoute('activities', Boolean(options.replace));
    log('pagina_atividades_aberta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearActivityFilters() {
    if ($('#exerciseSearch')) $('#exerciseSearch').value = '';
    if ($('#activityStatusFilter')) $('#activityStatusFilter').value = '';
    if ($('#activityContentFilter')) $('#activityContentFilter').value = '';
    renderActivities();
    $('#exerciseSearch')?.focus();
  }


function flushAppProgress() {
  window.dispatchEvent(new Event('ds2:flush-progress'));
}

function setBackgroundInert(enabled) {
  [...document.body.children].forEach(element => {
    if (element.id === 'authGate' || element.tagName === 'SCRIPT') return;
    if (enabled) { element.inert = true; element.setAttribute('aria-hidden', 'true'); element.dataset.authInert = 'true'; }
    else if (element.dataset.authInert === 'true') { element.inert = false; element.removeAttribute('aria-hidden'); delete element.dataset.authInert; }
  });
}

function focusables(container) {
  return [...container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(element => !element.hidden && element.offsetParent !== null);
}

function trapAuthFocus(event) {
  if (event.key !== 'Tab' || $('#authGate')?.hidden) return;
  const panel = $('#authGate .auth-panel');
  const items = focusables(panel);
  if (!items.length) return;
  const first = items[0], last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

  function showTab(tab) {
    $('#loginForm').hidden = tab !== 'login';
    $('#registerForm').hidden = tab !== 'register';
    $('#unlockForm').hidden = true;
    $$('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.dataset.authTab === tab));
    $('#authTabs').hidden = false;
    setMessage('');
    setTimeout(() => (tab === 'login' ? $('#loginUsername') : $('#registerName'))?.focus(), 60);
  }

  function showAuth() {
    $('#authGate').hidden = false;
    $('#authGate').setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-open');
    setBackgroundInert(true);
    const list = users();
    showTab(list.length ? 'login' : 'register');
    renderRecentUsers();
  }

  function hideAuth() {
    $('#authGate').hidden = true;
    $('#authGate').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('auth-open');
    setBackgroundInert(false);
  }

  function showLocked() {
    $('#authGate').hidden = false;
    $('#authGate').setAttribute('aria-hidden', 'false');
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
      if (!safeEqual(hash, user.passwordHash)) { $('#loginPassword').value = ''; log('login_falhou', { username, reason: 'senha_incorreta' }); return setMessage('Senha incorreta.', 'danger'); }
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
    if (!safeEqual(hash, user.passwordHash)) {
      $('#unlockPassword').value = '';
      log('desbloqueio_falhou');
      return setMessage('Senha incorreta.', 'danger');
    }
    await saveSession({ locked: false });
    $('#unlockPassword').value = '';
    log('sessao_desbloqueada');
    await finishLogin();
  } catch (error) {
    $('#unlockPassword').value = '';
    setMessage(error.message || 'Não foi possível desbloquear a sessão.', 'danger');
  }
}

  async function lock() {
    flushAppProgress();
    closeUserMenu();
    await saveSession({ locked: true });
    log('sessao_bloqueada');
    showLocked();
  }

  async function logout() {
    flushAppProgress();
    log('logout');
    Utils.storageRemove(key('session'));
    currentUser = null;
    document.querySelector('main').hidden = true;
    $('#appDashboard').hidden = true;
    closeUserMenu();
    showAuth();
  }

  async function switchUser() {
    flushAppProgress();
    log('troca_de_usuario');
    Utils.storageRemove(key('session'));
    currentUser = null;
    $('#unlockForm').hidden = true;
    showAuth();
  }

  async function finishLogin() {
    updateUserUi();
    const session = await readSession();
    const number = session?.lastExercise;
    currentUser.lastExerciseIndex = number
      ? window.EXERCICIOS?.findIndex(item => item.numero === number)
      : -1;
    if (!Number.isInteger(currentUser.lastExerciseIndex) || currentUser.lastExerciseIndex < 0) currentUser.lastExerciseIndex = -1;
    hideAuth();
    document.dispatchEvent(new CustomEvent('appauth:ready', { detail: { user: currentUser } }));
    routeFromLocation({ replace: true });
    $('#loginPassword').value = '';
    $('#registerPassword').value = '';
    $('#registerConfirm').value = '';
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
  const opening = popover.hidden;
  popover.hidden = !opening;
  $('#authUserButton').setAttribute('aria-expanded', String(opening));
  if (opening) setTimeout(() => popover.querySelector('[role="menuitem"]')?.focus(), 20);
}

  function closeUserMenu() {
    const popover = $('#authUserPopover');
    if (popover) popover.hidden = true;
    $('#authUserButton')?.setAttribute('aria-expanded', 'false');
  }


function handleUserMenuKeyboard(event) {
  const popover = $('#authUserPopover');
  if (event.key !== 'Escape' || !popover || popover.hidden) return;
  event.preventDefault();
  closeUserMenu();
  $('#authUserButton')?.focus();
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
    window.addEventListener('popstate', () => routeFromLocation({ persist: false }));
    const exerciseSelector = scope() === 'aluno' ? $('#studentExercise') : $('#seletorExercicio');
    if (exerciseSelector) {
      exerciseSelector.addEventListener('change', () => {
        if (!currentUser) return;
        const selectedIndex = Number(exerciseSelector.value);
        if ($('#appDashboard')) $('#appDashboard').hidden = true;
        document.querySelector('main').hidden = false;
        setDashboardHeader(false);
        if (Number.isInteger(selectedIndex) && window.EXERCICIOS?.[selectedIndex]) {
          currentUser.lastExerciseIndex = selectedIndex;
          flushAppProgress();
          saveSession({ lastExercise: window.EXERCICIOS[selectedIndex].numero, lastView: 'exercise' }).catch(() => {});
          setRoute(`exercise-${String(window.EXERCICIOS[selectedIndex].numero).padStart(2, '0')}`);
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
    document.addEventListener('keydown', trapAuthFocus);
    document.addEventListener('keydown', handleUserMenuKeyboard);
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
    if (!Utils.storageAvailable()) setMessage('O navegador bloqueou o armazenamento permanente. A sessão funcionará somente enquanto esta página permanecer aberta; baixe o progresso antes de sair.', 'warning');
  }

  return { init, log, showHome, openExercise, lock, logout, switchUser, exportLogs, acceptCoreUser, currentUser: () => currentUser };
})();

document.addEventListener('DOMContentLoaded', () => AppAuth.init());

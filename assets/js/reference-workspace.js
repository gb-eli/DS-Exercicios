/* AGV • Hub Educacional — Front-End Sub
 * Patch v0.1.41 — referência à esquerda + editor à direita + downloads + GitHub/Classroom
 * Requer a sessão Supabase já autenticada pela aplicação. NÃO contém chaves privilegiadas.
 */
(function (global) {
  'use strict';

  const VERSION = '0.1.41';
  const DEFAULT_REPO_NAME = 'atividades-frontend-sub';
  const state = {
    client: null,
    user: null,
    exerciseId: null,
    exercise: null,
    classId: null,
    subjectId: null,
    references: [],
    referenceEditors: new Map(),
    currentReference: null,
    classroomUrl: null,
    repositoryUrl: null,
    options: {},
    mounted: false
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function isSupabaseClient(value) {
    return Boolean(value && typeof value.from === 'function' && value.auth && typeof value.auth.getUser === 'function');
  }

  function detectClient(explicitClient) {
    if (isSupabaseClient(explicitClient)) return explicitClient;
    const candidates = [
      global.supabaseClient,
      global.SupabaseClient,
      global.sb,
      global.client,
      global.AGV?.supabase,
      global.AGVCloud?.client,
      global.Auth?.client,
      global.supabase?.client
    ];
    return candidates.find(isSupabaseClient) || null;
  }

  function uuidLike(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
  }

  function resolveExerciseId(options = {}) {
    const direct = options.exerciseId || global.currentExerciseId || global.AGV?.currentExerciseId;
    if (uuidLike(direct)) return String(direct);
    const params = new URLSearchParams(global.location?.search || '');
    const queryValue = params.get('exercise') || params.get('exercise_id') || params.get('id');
    if (uuidLike(queryValue)) return queryValue;
    const holder = $('[data-exercise-id]');
    if (uuidLike(holder?.dataset.exerciseId)) return holder.dataset.exerciseId;
    return null;
  }

  function findWorkspace(options = {}) {
    if (options.workspaceElement instanceof Element) return options.workspaceElement;
    const selectors = [
      options.workspaceSelector,
      '[data-agv-practice-workspace]',
      '[data-practice-workspace]',
      '.vscode-workspace',
      '.practice-workspace',
      '.practice-main',
      '.workspace-main'
    ].filter(Boolean);
    for (const selector of selectors) {
      const el = $(selector);
      if (el) return el;
    }
    return null;
  }

  function findStudentPane(workspace, options = {}) {
    if (options.studentPaneElement instanceof Element) return options.studentPaneElement;
    const selectors = [
      options.studentPaneSelector,
      '[data-student-editor-pane]',
      '[data-code-editor-pane]',
      '.vscode-editor-pane',
      '.practice-editor-pane',
      '.editor-pane',
      '.code-editor'
    ].filter(Boolean);
    for (const selector of selectors) {
      const el = $(selector, workspace) || $(selector);
      if (el) return el;
    }
    return null;
  }

  function setStatus(message, kind = 'info') {
    const el = $('#agvReferenceWorkspaceStatus');
    if (!el) return;
    el.textContent = message || '';
    el.dataset.kind = kind;
  }

  function normalizeLanguage(language, filename) {
    const raw = String(language || '').toLowerCase();
    const ext = String(filename || '').split('.').pop()?.toLowerCase();
    if (raw.includes('html') || ext === 'html' || ext === 'htm') return 'htmlmixed';
    if (raw.includes('css') || ext === 'css') return 'css';
    if (raw.includes('javascript') || raw === 'js' || ['js','mjs','cjs'].includes(ext)) return 'javascript';
    if (raw.includes('python') || raw === 'py' || ext === 'py') return 'python';
    if (raw.includes('json') || ext === 'json') return { name: 'javascript', json: true };
    if (raw.includes('markdown') || raw === 'md' || ext === 'md') return 'markdown';
    return 'text/plain';
  }

  function safeText(value) {
    return String(value ?? '');
  }

  function escapeHtml(value) {
    return safeText(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function basicHighlight(line, language) {
    let text = escapeHtml(line);
    const lang = String(language || '');
    if (lang === 'htmlmixed') {
      text = text
        .replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="agv-token-tag">$2</span>')
        .replace(/\s([a-zA-Z_:][-\w:.]*)(=)/g, ' <span class="agv-token-attr">$1</span>$2')
        .replace(/(&quot;[^&]*?&quot;|&#39;.*?&#39;)/g, '<span class="agv-token-string">$1</span>')
        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="agv-token-comment">$1</span>');
    } else if (lang === 'css') {
      text = text
        .replace(/(\/\*.*?\*\/)/g, '<span class="agv-token-comment">$1</span>')
        .replace(/([.#]?[a-zA-Z_-][\w-]*)(?=\s*\{)/g, '<span class="agv-token-tag">$1</span>')
        .replace(/([a-z-]+)(\s*:)/gi, '<span class="agv-token-attr">$1</span>$2')
        .replace(/(#[0-9a-fA-F]{3,8}|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b)/g, '<span class="agv-token-number">$1</span>');
    } else if (lang === 'javascript' || (typeof lang === 'object' && lang.name === 'javascript')) {
      text = text
        .replace(/(\/\/.*$)/g, '<span class="agv-token-comment">$1</span>')
        .replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`)/g, '<span class="agv-token-string">$1</span>')
        .replace(/\b(const|let|var|function|return|if|else|for|while|true|false|null|new|class|async|await|try|catch)\b/g, '<span class="agv-token-keyword">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="agv-token-number">$1</span>');
    } else if (lang === 'python') {
      text = text
        .replace(/(#.*$)/g, '<span class="agv-token-comment">$1</span>')
        .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="agv-token-string">$1</span>')
        .replace(/\b(def|return|if|elif|else|for|while|in|import|from|as|True|False|None|class|try|except|with|lambda|and|or|not)\b/g, '<span class="agv-token-keyword">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="agv-token-number">$1</span>');
    }
    return text || '&nbsp;';
  }

  function renderFallbackCode(host, file) {
    const mode = normalizeLanguage(file.language, file.filename);
    const lines = safeText(file.content).replace(/\r\n/g, '\n').split('\n');
    const table = document.createElement('div');
    table.className = 'agv-reference-code-fallback';
    table.setAttribute('role', 'region');
    table.setAttribute('aria-label', `Código de referência ${file.filename}`);
    lines.forEach((line, index) => {
      const row = document.createElement('div');
      row.className = 'agv-reference-line';
      const number = document.createElement('span');
      number.className = 'agv-reference-line-number';
      number.textContent = String(index + 1);
      number.setAttribute('aria-hidden', 'true');
      const code = document.createElement('code');
      code.className = 'agv-reference-line-code';
      code.innerHTML = basicHighlight(line, mode);
      row.append(number, code);
      table.appendChild(row);
    });
    host.replaceChildren(table);
  }

  function renderCode(file) {
    const host = $('#agvReferenceCodeHost');
    if (!host) return;
    state.currentReference = file?.filename || null;
    if (!file) {
      host.innerHTML = '<div class="agv-reference-empty">Nenhum código de referência disponível.</div>';
      return;
    }

    $$('.agv-reference-tab').forEach((tab) => {
      const active = tab.dataset.filename === file.filename;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (typeof global.CodeMirror === 'function') {
      host.replaceChildren();
      const textarea = document.createElement('textarea');
      textarea.value = safeText(file.content);
      host.appendChild(textarea);
      const editor = global.CodeMirror.fromTextArea(textarea, {
        value: safeText(file.content),
        mode: normalizeLanguage(file.language, file.filename),
        lineNumbers: true,
        readOnly: 'nocursor',
        lineWrapping: false,
        indentUnit: 2,
        tabSize: 2,
        viewportMargin: Infinity
      });
      editor.setValue(safeText(file.content));
      editor.getWrapperElement().classList.add('agv-reference-codemirror');
      state.referenceEditors.set(file.filename, editor);
      requestAnimationFrame(() => editor.refresh());
    } else {
      renderFallbackCode(host, file);
    }
  }

  function buildReferencePane() {
    const pane = document.createElement('section');
    pane.id = 'agvReferencePane';
    pane.className = 'agv-reference-pane';
    pane.setAttribute('aria-label', 'Código de referência');
    pane.innerHTML = `
      <header class="agv-reference-header">
        <div>
          <strong>Código de referência</strong>
          <span>Leia à esquerda e digite no editor à direita</span>
        </div>
        <span class="agv-reference-lock" title="Somente leitura">Somente leitura</span>
      </header>
      <nav id="agvReferenceTabs" class="agv-reference-tabs" aria-label="Arquivos de referência"></nav>
      <div id="agvReferenceCodeHost" class="agv-reference-code-host"></div>
    `;
    pane.addEventListener('copy', (event) => {
      event.preventDefault();
      setStatus('A referência é para transcrição. Copiar está bloqueado.', 'warn');
    });
    pane.addEventListener('cut', (event) => event.preventDefault());
    pane.addEventListener('dragstart', (event) => event.preventDefault());
    pane.addEventListener('contextmenu', (event) => {
      if (state.options.blockReferenceContextMenu !== false) event.preventDefault();
    });
    return pane;
  }

  function renderReferenceTabs() {
    const tabs = $('#agvReferenceTabs');
    if (!tabs) return;
    tabs.replaceChildren();
    for (const file of state.references) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'agv-reference-tab';
      button.dataset.filename = file.filename;
      button.setAttribute('role', 'tab');
      button.textContent = file.filename;
      button.addEventListener('click', () => renderCode(file));
      tabs.appendChild(button);
    }
    renderCode(state.references[0] || null);
  }

  function buildActions() {
    const toolbar = document.createElement('div');
    toolbar.id = 'agvWorkspaceActions';
    toolbar.className = 'agv-workspace-actions';
    toolbar.innerHTML = `
      <button type="button" data-agv-action="save">Salvar</button>
      <button type="button" data-agv-action="download-file">Baixar arquivo</button>
      <button type="button" data-agv-action="download-zip">Baixar ZIP</button>
      <button type="button" data-agv-action="github">GitHub</button>
      <button type="button" data-agv-action="classroom">Google Classroom</button>
      <span id="agvReferenceWorkspaceStatus" class="agv-workspace-status" role="status" aria-live="polite"></span>
    `;
    $('[data-agv-action="save"]', toolbar).addEventListener('click', async () => {
      try {
        await saveBeforeDownload(true);
        setStatus('Código salvo.', 'ok');
      } catch (error) {
        console.warn('[AGV reference patch] save', error);
        setStatus('Não foi possível confirmar o salvamento.', 'error');
      }
    });
    $('[data-agv-action="download-file"]', toolbar).addEventListener('click', downloadCurrentFile);
    $('[data-agv-action="download-zip"]', toolbar).addEventListener('click', downloadProjectZip);
    $('[data-agv-action="github"]', toolbar).addEventListener('click', openGitHub);
    $('[data-agv-action="classroom"]', toolbar).addEventListener('click', openClassroom);
    return toolbar;
  }

  async function loadContext() {
    const client = state.client;
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError) throw authError;
    state.user = authData?.user || null;
    if (!state.user) throw new Error('Sessão do aluno não encontrada.');

    const { data: exercise, error: exerciseError } = await client
      .from('exercises')
      .select('id,class_id,subject_id,config')
      .eq('id', state.exerciseId)
      .maybeSingle();
    if (exerciseError) throw exerciseError;
    if (!exercise) throw new Error('Exercício não encontrado.');
    state.exercise = exercise;
    state.subjectId = exercise.subject_id || null;
    state.classId = exercise.class_id || null;

    if (!state.classId) {
      const { data: memberships, error: membershipError } = await client
        .from('class_memberships')
        .select('class_id')
        .eq('user_id', state.user.id)
        .eq('active', true)
        .order('is_primary', { ascending: false })
        .limit(1);
      if (membershipError) throw membershipError;
      state.classId = memberships?.[0]?.class_id || null;
    }

    const { data: refs, error: refsError } = await client
      .from('exercise_reference_files')
      .select('filename,language,content,updated_at')
      .eq('exercise_id', state.exerciseId)
      .order('filename', { ascending: true });
    if (refsError) throw refsError;
    state.references = Array.isArray(refs) ? refs : [];

    if (state.classId && state.subjectId) {
      const { data: classroomRows, error: classroomError } = await client
        .from('classroom_links')
        .select('url')
        .eq('class_id', state.classId)
        .eq('subject_id', state.subjectId)
        .eq('active', true)
        .limit(1);
      if (classroomError) console.warn('[AGV reference patch] classroom', classroomError);
      state.classroomUrl = classroomRows?.[0]?.url || null;
    }

    const { data: delivery, error: deliveryError } = await client
      .from('student_delivery_settings')
      .select('repository_url')
      .eq('user_id', state.user.id)
      .maybeSingle();
    if (deliveryError && deliveryError.code !== 'PGRST116') {
      console.warn('[AGV reference patch] repository', deliveryError);
    }
    state.repositoryUrl = delivery?.repository_url || null;
  }

  function resolveKnownFunction(names) {
    for (const name of names) {
      const fn = global[name];
      if (typeof fn === 'function') return fn;
    }
    return null;
  }

  async function saveBeforeDownload(fromManualSave = false) {
    if (typeof state.options.saveHook === 'function') {
      await state.options.saveHook();
      return true;
    }
    const saveFn = resolveKnownFunction([
      'saveAllStudentFiles',
      'saveAllFiles',
      'saveCurrentFile',
      'saveStudentWork',
      'saveWork'
    ]);
    if (saveFn) {
      await Promise.resolve(saveFn());
      return true;
    }
    const buttonSelectors = [
      state.options.saveButtonSelector,
      '[data-action="save-all"]',
      '[data-action="save"]',
      '#saveButton',
      '#saveAllButton',
      '#saveWorkButton',
      '.save-button'
    ].filter(Boolean);
    for (const selector of buttonSelectors) {
      const button = $(selector);
      if (button && !button.disabled) {
        button.click();
        await new Promise((resolve) => setTimeout(resolve, fromManualSave ? 900 : 650));
        return true;
      }
    }
    // A plataforma já possui autosave; na ausência de hook explícito apenas aguarda o ciclo atual.
    await new Promise((resolve) => setTimeout(resolve, 250));
    return false;
  }

  async function fetchStudentFiles() {
    const { data, error } = await state.client
      .from('student_files')
      .select('filename,language,content,revision,saved_at')
      .eq('student_id', state.user.id)
      .eq('exercise_id', state.exerciseId)
      .order('filename', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  function filenameFromUi() {
    if (typeof state.options.getActiveFilename === 'function') {
      const value = state.options.getActiveFilename();
      if (value) return String(value);
    }
    const selectors = [
      '[data-filename][aria-selected="true"]',
      '[data-filename].active',
      '[data-filename].is-active',
      '.file-tab.active[data-file]',
      '.vscode-tab.active[data-file]',
      '[data-file].active'
    ];
    for (const selector of selectors) {
      const el = $(selector);
      const value = el?.dataset?.filename || el?.dataset?.file;
      if (value) return value;
    }
    return null;
  }

  async function resolveActiveFilename(files) {
    const uiFile = filenameFromUi();
    if (uiFile && files.some((file) => file.filename === uiFile)) return uiFile;
    try {
      const { data, error } = await state.client
        .from('activity_sessions')
        .select('current_file,last_seen_at')
        .eq('student_id', state.user.id)
        .eq('exercise_id', state.exerciseId)
        .is('ended_at', null)
        .order('last_seen_at', { ascending: false })
        .limit(1);
      if (!error) {
        const current = data?.[0]?.current_file;
        if (current && files.some((file) => file.filename === current)) return current;
      }
    } catch (error) {
      console.warn('[AGV reference patch] active file', error);
    }
    return files[0]?.filename || null;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function downloadCurrentFile() {
    const button = $('[data-agv-action="download-file"]');
    if (button) button.disabled = true;
    try {
      setStatus('Salvando antes de baixar…');
      await saveBeforeDownload();
      const files = await fetchStudentFiles();
      if (!files.length) throw new Error('Nenhum arquivo do aluno foi encontrado.');
      const activeName = await resolveActiveFilename(files);
      const file = files.find((item) => item.filename === activeName) || files[0];
      downloadBlob(new Blob([safeText(file.content)], { type: 'text/plain;charset=utf-8' }), file.filename);
      setStatus(`${file.filename} baixado.`, 'ok');
    } catch (error) {
      console.error('[AGV reference patch] download file', error);
      setStatus(error.message || 'Falha ao baixar o arquivo.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  }

  function crc32(bytes) {
    let crc = -1;
    for (let i = 0; i < bytes.length; i += 1) {
      crc ^= bytes[i];
      for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function u16(value) {
    return [value & 255, (value >>> 8) & 255];
  }

  function u32(value) {
    return [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];
  }

  function dosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const day = (date.getDate() & 31) | (((date.getMonth() + 1) & 15) << 5) | (((year - 1980) & 127) << 9);
    return { time, date: day };
  }

  function createStoreZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const dt = dosDateTime();

    for (const file of files) {
      const nameBytes = encoder.encode(file.filename);
      const contentBytes = encoder.encode(safeText(file.content));
      const crc = crc32(contentBytes);
      const localHeader = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(dt.time), ...u16(dt.date),
        ...u32(crc), ...u32(contentBytes.length), ...u32(contentBytes.length), ...u16(nameBytes.length), ...u16(0)
      ]);
      const localRecord = new Uint8Array(localHeader.length + nameBytes.length + contentBytes.length);
      localRecord.set(localHeader, 0);
      localRecord.set(nameBytes, localHeader.length);
      localRecord.set(contentBytes, localHeader.length + nameBytes.length);
      localParts.push(localRecord);

      const centralHeader = new Uint8Array([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(dt.time), ...u16(dt.date),
        ...u32(crc), ...u32(contentBytes.length), ...u32(contentBytes.length), ...u16(nameBytes.length), ...u16(0),
        ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset)
      ]);
      const centralRecord = new Uint8Array(centralHeader.length + nameBytes.length);
      centralRecord.set(centralHeader, 0);
      centralRecord.set(nameBytes, centralHeader.length);
      centralParts.push(centralRecord);
      offset += localRecord.length;
    }

    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
      ...u32(centralSize), ...u32(offset), ...u16(0)
    ]);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  }

  async function downloadProjectZip() {
    const button = $('[data-agv-action="download-zip"]');
    if (button) button.disabled = true;
    try {
      setStatus('Salvando e preparando o ZIP…');
      await saveBeforeDownload();
      const files = await fetchStudentFiles();
      if (!files.length) throw new Error('Nenhum arquivo do aluno foi encontrado.');
      const zip = createStoreZip(files.map((file) => ({ filename: file.filename, content: file.content })));
      const exerciseSuffix = String(state.exercise?.id || state.exerciseId).slice(0, 8);
      downloadBlob(zip, `atividade-${exerciseSuffix}-meus-codigos.zip`);
      setStatus(`ZIP criado com ${files.length} arquivo(s) do aluno.`, 'ok');
    } catch (error) {
      console.error('[AGV reference patch] download zip', error);
      setStatus(error.message || 'Falha ao gerar o ZIP.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  }

  function validGitHubRepo(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname.toLowerCase() === 'github.com' && parsed.pathname.split('/').filter(Boolean).length >= 2;
    } catch (_) {
      return false;
    }
  }

  async function openGitHub() {
    try {
      await saveBeforeDownload();
      if (!state.repositoryUrl) {
        const entered = global.prompt(`Cole o endereço do repositório ${DEFAULT_REPO_NAME} no GitHub:`, 'https://github.com/');
        if (!entered) return;
        const url = entered.trim().replace(/\/$/, '');
        if (!validGitHubRepo(url)) {
          setStatus('Informe uma URL válida de repositório do GitHub.', 'error');
          return;
        }
        const { data, error } = await state.client
          .from('student_delivery_settings')
          .upsert({ user_id: state.user.id, repository_url: url, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
          .select('repository_url')
          .single();
        if (error) throw error;
        state.repositoryUrl = data?.repository_url || url;
      }
      global.open(state.repositoryUrl, '_blank', 'noopener,noreferrer');
      setStatus('GitHub aberto em nova aba.', 'ok');
    } catch (error) {
      console.error('[AGV reference patch] github', error);
      setStatus('Não foi possível abrir/configurar o GitHub.', 'error');
    }
  }

  async function openClassroom() {
    try {
      await saveBeforeDownload();
      if (!state.classroomUrl) {
        setStatus('Classroom não configurado para esta disciplina.', 'error');
        return;
      }
      global.open(state.classroomUrl, '_blank', 'noopener,noreferrer');
      setStatus('Google Classroom aberto em nova aba.', 'ok');
    } catch (error) {
      console.error('[AGV reference patch] classroom', error);
      setStatus('Não foi possível abrir o Google Classroom.', 'error');
    }
  }

  function mountLayout(options = {}) {
    const workspace = findWorkspace(options);
    if (!workspace) throw new Error('Workspace de prática não encontrado. Informe workspaceSelector.');
    if ($('#agvReferencePane', workspace)) return workspace;
    const studentPane = findStudentPane(workspace, options);

    workspace.classList.add('agv-dual-workspace');
    const referencePane = buildReferencePane();
    if (studentPane && studentPane.parentElement === workspace) {
      workspace.insertBefore(referencePane, studentPane);
      studentPane.classList.add('agv-student-editor-pane');
    } else {
      workspace.prepend(referencePane);
      if (studentPane) studentPane.classList.add('agv-student-editor-pane');
    }

    const actions = buildActions();
    const actionTarget = options.actionsTargetSelector ? $(options.actionsTargetSelector) : null;
    if (actionTarget) actionTarget.appendChild(actions);
    else workspace.parentElement?.insertBefore(actions, workspace);
    return workspace;
  }

  async function init(options = {}) {
    if (state.mounted) return { ...state };
    state.options = { ...options };
    state.client = detectClient(options.client);
    if (!state.client) throw new Error('Cliente Supabase autenticado não encontrado. Passe { client }.');
    state.exerciseId = resolveExerciseId(options);
    if (!state.exerciseId) throw new Error('UUID do exercício não encontrado na URL/DOM.');

    mountLayout(options);
    setStatus('Carregando referência…');
    await loadContext();
    renderReferenceTabs();
    state.mounted = true;
    setStatus(state.references.length ? `${state.references.length} arquivo(s) de referência carregado(s).` : 'Sem referência disponível.', state.references.length ? 'ok' : 'warn');
    document.documentElement.dataset.agvReferenceWorkspace = VERSION;
    return { ...state };
  }

  function autoInit(options = {}) {
    const run = () => init(options).catch((error) => {
      console.error('[AGV reference patch]', error);
      setStatus(error.message || 'Falha ao iniciar o workspace.', 'error');
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
    else run();
  }

  global.AGVReferenceWorkspacePatch = Object.freeze({
    version: VERSION,
    init,
    autoInit,
    downloadCurrentFile,
    downloadProjectZip,
    openGitHub,
    openClassroom,
    createStoreZip,
    _state: state
  });
})(window);

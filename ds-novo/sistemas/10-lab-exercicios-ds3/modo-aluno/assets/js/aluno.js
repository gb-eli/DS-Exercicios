let current = 0;
let file = 'html';
let explainStep = 0;
let view = 'explain';
let tutorialFunctions = [];
let state = {};
let saveTimer = null;
let pendingDownloadAction = null;
let pendingDownloadTrigger = null;
let pendingSaveKey = null;
let pendingSaveSnapshot = null;
let autocompleteSelection = null;
let activityTimer = null;
let runtimeConsoleLines = [];
let runtimePanelTab = 'preview';
let previewMinimized = false;
let previewOpen = true;
let activitySaveTicks = 0;
let editorHistoryFile = null;
let referenceMode = 'auto';
let practiceReferenceStep = null;
let supportFileOpen = null;

let order = [];

function syncFileOrder() {
  order = exercise().ordemArquivosAluno || exercise().ordemArquivos || Object.keys(exercise().arquivos || {});
  if (!order.length) order = ['html'];
  if (!order.includes(file)) file = order[0];
}

function mapFiles(factory) {
  return Object.fromEntries(order.map((key, index) => [key, factory(key, index)]));
}
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const exercise = () => EXERCICIOS[current];
const isFrozenExercise01 = () => Number(exercise()?.numero) === 1;

function userToken() {
  const username = window.AppAuth?.currentUser?.()?.username || 'sem-usuario';
  return String(username).toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
}

function projectToken() {
  const raw = window.APP_CONFIG?.repositorio || '3ds-programacao';
  return String(raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || '3ds-programacao';
}

function storageKey() {
  return `ds3_${projectToken()}_aluno_${userToken()}_ex${exercise().numero}_state_v7`;
}

function legacyStorageKeys() {
  return [
    `ds3_${projectToken()}_aluno_${userToken()}_ex${exercise().numero}_state_v6`,
    `ds3_${projectToken()}_aluno_${userToken()}_ex${exercise().numero}_state_v5`,
    `ds3_${userToken()}_ex${exercise().numero}_state_v4`
  ];
}

function storedStateRaw() {
  let raw = localStorage.getItem(storageKey());
  if (raw === null) {
    for (const legacyKey of legacyStorageKeys()) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy !== null) {
        localStorage.setItem(storageKey(), legacy);
        raw = legacy;
        break;
      }
    }
  }
  return raw;
}

function defaultSupportState() {
  return {
    everUsed: false,
    activeBlocks: [],
    history: [],
    reviewConfirmed: false,
    markerMissing: false
  };
}

function defaultActivityState() {
  return {
    activeSeconds: 0,
    keystrokes: 0,
    executions: 0,
    hintsUsed: 0,
    tutorialReturns: 0,
    lastInteractionAt: Date.now()
  };
}

function sanitizeWorkspaceName(value, fallback = 'arquivo.txt') {
  let name = String(value || '').trim().replace(/\\/g, '/').replace(/^\/+/, '');
  name = name.split('/').filter(part => part && part !== '.' && part !== '..').join('/');
  name = name.replace(/[<>:"|?*\x00-\x1F]/g, '-').replace(/\/{2,}/g, '/');
  return name || fallback;
}

function defaultWorkspace() {
  const downloadOrder = exercise().ordemDownloads || Object.keys(exercise().arquivos || {});
  return {
    rootName: sanitizeWorkspaceName(exercise().pasta, `exercicio-${String(exercise().numero).padStart(2, '0')}`).replaceAll('/', '-'),
    files: Object.fromEntries(downloadOrder.map(key => [key, sanitizeWorkspaceName(exercise().nomesArquivos[key] || key, key)])),
    folders: [],
    cwd: '',
    overrides: {}
  };
}

function physicalPath(key) {
  return sanitizeWorkspaceName(state.workspace?.files?.[key] || exercise().nomesArquivos[key] || key, exercise().nomesArquivos[key] || key);
}

function physicalBaseName(key) {
  return physicalPath(key).split('/').pop();
}

function workspaceRootName() {
  return sanitizeWorkspaceName(state.workspace?.rootName || exercise().pasta, exercise().pasta).replaceAll('/', '-');
}

function workspaceKeys() {
  return exercise().ordemDownloads || Object.keys(exercise().arquivos || {});
}

function visibleFileKeys() {
  const keys = workspaceKeys();
  return keys.length ? keys : order;
}

function fileRole(key) {
  if (order.includes(key)) return state.unlocked?.[key] === false ? 'bloqueado' : 'você edita';
  if ((exercise().arquivosPresentes || []).includes(key)) return 'presente';
  return 'apoio';
}

function workspaceKeyByPath(path) {
  const wanted = sanitizeWorkspaceName(path, '').toLowerCase();
  return workspaceKeys().find(key => physicalPath(key).toLowerCase() === wanted || physicalBaseName(key).toLowerCase() === wanted) || null;
}


function cleanLocalReference(value) {
  return String(value || '').trim().split('#')[0].split('?')[0].replace(/\\/g, '/');
}

function isDangerousReference(value) { return /^(?:javascript:|vbscript:)/i.test(String(value || '').trim()); }

function isExternalReference(value) {
  const raw = String(value || '').trim();
  return !raw || raw.startsWith('#') || /^(?:https?:|data:|mailto:|tel:|\/\/)/i.test(raw);
}

function normalizeWorkspacePath(path) {
  const output = [];
  String(path || '').replace(/\\/g, '/').split('/').forEach(part => {
    if (!part || part === '.') return;
    if (part === '..') output.pop();
    else output.push(part);
  });
  return output.join('/');
}

function workspaceDir(path) {
  const parts = normalizeWorkspacePath(path).split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
}

function resolveWorkspacePath(fromKey, reference) {
  if (isExternalReference(reference)) return null;
  const raw = cleanLocalReference(reference);
  if (!raw || raw.startsWith('/')) return raw || null;
  return normalizeWorkspacePath(`${workspaceDir(physicalPath(fromKey))}/${raw}`);
}

function relativeWorkspacePath(fromKey, targetKey) {
  const from = workspaceDir(physicalPath(fromKey)).split('/').filter(Boolean);
  const to = normalizeWorkspacePath(physicalPath(targetKey)).split('/').filter(Boolean);
  let common = 0;
  while (common < from.length && common < to.length && from[common] === to[common]) common += 1;
  const parts = [...Array(from.length - common).fill('..'), ...to.slice(common)];
  return parts.join('/') || physicalBaseName(targetKey);
}

function workspaceKeyFromReference(fromKey, reference) {
  const resolved = resolveWorkspacePath(fromKey, reference);
  if (!resolved) return null;
  return workspaceKeys().find(key => normalizeWorkspacePath(physicalPath(key)) === resolved) || null;
}

function htmlReferences(content) {
  const refs = [];
  const html = String(content || '');
  const pattern = /<(a|link|script)\b[^>]*?\b(href|src)\s*=\s*(["'])(.*?)\3[^>]*>/gi;
  let match;
  while ((match = pattern.exec(html))) refs.push({ tag: match[1].toLowerCase(), attr: match[2].toLowerCase(), raw: match[4], full: match[0] });
  return refs;
}

function expectedResourceConnection(htmlKey, targetKey) {
  const reference = String(exercise().arquivos?.[htmlKey] || '');
  return htmlReferences(reference).some(item => workspaceKeyFromReferenceUsingDefaults(htmlKey, item.raw) === targetKey);
}

function defaultPhysicalPath(key) {
  return sanitizeWorkspaceName(exercise().nomesArquivos?.[key] || key, key);
}

function workspaceKeyFromReferenceUsingDefaults(fromKey, reference) {
  if (isExternalReference(reference)) return null;
  const raw = cleanLocalReference(reference);
  const base = workspaceDir(defaultPhysicalPath(fromKey));
  const resolved = normalizeWorkspacePath(`${base}/${raw}`);
  return workspaceKeys().find(key => normalizeWorkspacePath(defaultPhysicalPath(key)) === resolved) || null;
}

function projectIntegrityIssues(onlyFile = null) {
  const issues = [];
  const htmlKeys = workspaceKeys().filter(key => String(key).toLowerCase().startsWith('html'));
  htmlKeys.forEach(htmlKey => {
    if (onlyFile && htmlKey !== onlyFile) return;
    const content = projectContent(htmlKey);
    if (!String(content || '').trim()) return;
    const refs = htmlReferences(content);
    refs.forEach(item => {
      if (isDangerousReference(item.raw)) {
        issues.push({ fileKey: htmlKey, title: 'Protocolo inseguro', detail: `${physicalPath(htmlKey)} contém o endereço inseguro “${item.raw}”. Use um caminho relativo ou uma URL HTTPS.` });
        return;
      }
      if (isExternalReference(item.raw)) return;
      const clean = cleanLocalReference(item.raw);
      if (!clean || (!/\.[a-z0-9]+$/i.test(clean) && !clean.includes('/'))) return;
      if (!workspaceKeyFromReference(htmlKey, item.raw)) {
        issues.push({ fileKey: htmlKey, title: 'Caminho quebrado', detail: `${physicalPath(htmlKey)} referencia “${item.raw}”, mas esse arquivo não existe nesse caminho no projeto.` });
      }
    });
    ['css','js'].forEach(targetKey => {
      if (!workspaceKeys().includes(targetKey) || !expectedResourceConnection(htmlKey, targetKey)) return;
      const connected = refs.some(item => workspaceKeyFromReference(htmlKey, item.raw) === targetKey && ((targetKey === 'css' && item.tag === 'link') || (targetKey === 'js' && item.tag === 'script')));
      if (!connected) issues.push({ fileKey: htmlKey, targetKey, title: targetKey === 'css' ? 'CSS não conectado' : 'JavaScript não conectado', detail: `Conecte ${physicalPath(targetKey)} a partir de ${physicalPath(htmlKey)} usando o caminho relativo correto.` });
    });
  });
  return issues;
}

function dynamicExerciseForValidation(targetFile = file) {
  let copy;
  try { copy = structuredClone(exercise()); } catch (error) { copy = JSON.parse(JSON.stringify(exercise())); }
  const perFileValidation = copy?.validacaoPorArquivo?.[targetFile];
  if (perFileValidation) copy.validacao = { ...(copy.validacao || {}), ...perFileValidation };
  const config = copy?.validacao?.htmlSemanticoPorArquivo?.[targetFile];
  const nav = config?.navegacaoMultipagina;
  if (nav) {
    const htmlTargets = workspaceKeys().filter(key => String(key).toLowerCase().startsWith('html'));
    nav.linksObrigatorios = htmlTargets.map(key => [relativeWorkspacePath(targetFile, key)]);
    if (workspaceKeys().includes('css')) nav.stylesheetObrigatorio = [relativeWorkspacePath(targetFile, 'css')];
    if (workspaceKeys().includes('js')) nav.scriptObrigatorio = [relativeWorkspacePath(targetFile, 'js')];
  }
  return copy;
}

function captureWorkspaceReferences() {
  const captured = {};
  workspaceKeys().filter(key => String(key).toLowerCase().startsWith('html')).forEach(htmlKey => {
    const content = projectContent(htmlKey);
    captured[htmlKey] = htmlReferences(content).map(item => ({ ...item, targetKey: workspaceKeyFromReference(htmlKey, item.raw) })).filter(item => item.targetKey);
  });
  return captured;
}

function rewriteCapturedReferences(captured) {
  let changed = 0;
  Object.entries(captured || {}).forEach(([htmlKey, refs]) => {
    let content = projectContent(htmlKey);
    let next = content;
    refs.forEach(ref => {
      const newRef = relativeWorkspacePath(htmlKey, ref.targetKey);
      if (!newRef || newRef === ref.raw) return;
      const escaped = ref.raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(${ref.attr}\\s*=\\s*["'])${escaped}(["'])`, 'g');
      next = next.replace(pattern, `$1${newRef}$2`);
    });
    if (next !== content) { setProjectContent(htmlKey, next); changed += 1; }
  });
  return changed;
}


function defaultState() {
  syncFileOrder();
  return {
    answers: mapFiles(() => ''),
    done: mapFiles(() => false),
    origin: mapFiles(() => 'digitado'),
    unlocked: mapFiles((key, index) => index === 0),
    explained: mapFiles(() => 0),
    understood: mapFiles(() => 0),
    attempts: mapFiles(() => 0),
    lastDiagnosticLine: mapFiles(() => null),
    support: mapFiles(() => defaultSupportState()),
    activity: mapFiles(() => defaultActivityState()),
    execution: mapFiles(() => ExecutionFlow.defaultFileState()),
    completion: ExecutionFlow.defaultCompletionState(),
    completed: false,
    directPractice: false,
    practiceBriefCollapsed: false,
    workspace: defaultWorkspace()
  };
}

function load() {
  const defaults = defaultState();
  try {
    const saved = JSON.parse(storedStateRaw()) || {};
    state = {
      ...defaults,
      ...saved,
      answers: { ...defaults.answers, ...(saved.answers || {}) },
      done: { ...defaults.done, ...(saved.done || {}) },
      origin: { ...defaults.origin, ...(saved.origin || {}) },
      unlocked: { ...defaults.unlocked, ...(saved.unlocked || {}) },
      explained: { ...defaults.explained, ...(saved.explained || {}) },
      understood: { ...defaults.understood, ...(saved.understood || {}) },
      attempts: { ...defaults.attempts, ...(saved.attempts || {}) },
      lastDiagnosticLine: { ...defaults.lastDiagnosticLine, ...(saved.lastDiagnosticLine || {}) },
      support: mapFiles(key => ({ ...defaultSupportState(), ...(saved.support?.[key] || {}) })),
      activity: mapFiles(key => ({ ...defaultActivityState(), ...(saved.activity?.[key] || {}) })),
      execution: mapFiles(key => ({ ...ExecutionFlow.defaultFileState(), ...(saved.execution?.[key] || {}) })),
      completion: { ...ExecutionFlow.defaultCompletionState(), ...(saved.completion || {}) },
      completed: Boolean(saved.completed),
      workspace: { ...defaults.workspace, ...(saved.workspace || {}), files: { ...defaults.workspace.files, ...(saved.workspace?.files || {}) }, folders: [...new Set([...(defaults.workspace.folders || []), ...(saved.workspace?.folders || [])])], overrides: { ...(defaults.workspace.overrides || {}), ...(saved.workspace?.overrides || {}) } }
    };
    order.forEach(key => {
      const legacyBlocks = state.support[key]?.activeBlocks || [];
      if (legacyBlocks.length) {
        const preAutomaticCode = legacyBlocks[0]?.previousCode ?? '';
        state.answers[key] = preAutomaticCode;
        state.done[key] = false;
        state.origin[key] = 'digitado';
        state.execution[key] = ExecutionFlow.defaultFileState();
        state.support[key].history = [...(state.support[key].history || []), { action: 'manual-policy-reset', at: new Date().toISOString(), platformVersion: window.APP_CONFIG?.version || '' }];
        state.support[key].activeBlocks = [];
        state.support[key].reviewConfirmed = false;
        state.support[key].markerMissing = false;
      } else {
        state.origin[key] = 'digitado';
        state.support[key].markerMissing = false;
      }
    });
    if (state.completion?.confirmedAt) view = 'completion';
  } catch (error) {
    state = defaults;
  }
}

function persistState(keyName, snapshot) {
  try {
    localStorage.setItem(keyName, JSON.stringify(snapshot));
    $('#editorStatus') && ($('#editorStatus').textContent = 'salvo localmente');
    return true;
  } catch (error) {
    $('#editorStatus') && ($('#editorStatus').textContent = 'não foi possível salvar');
    Utils.toast('Não foi possível salvar localmente. Baixe uma cópia do seu código agora para não perder o trabalho.');
    return false;
  }
}

function clearPendingSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
  pendingSaveKey = null;
  pendingSaveSnapshot = null;
}

function save() {
  clearPendingSave();
  return persistState(storageKey(), structuredClone(state));
}

function scheduleSave() {
  clearTimeout(saveTimer);
  pendingSaveKey = storageKey();
  pendingSaveSnapshot = structuredClone(state);
  $('#editorStatus') && ($('#editorStatus').textContent = 'salvando...');
  saveTimer = setTimeout(() => {
    const keyName = pendingSaveKey;
    const snapshot = pendingSaveSnapshot;
    clearPendingSave();
    if (keyName && snapshot) persistState(keyName, snapshot);
  }, 350);
}

function flushSave() {
  if (!saveTimer) return;
  const keyName = pendingSaveKey;
  const snapshot = pendingSaveSnapshot;
  clearPendingSave();
  if (keyName && snapshot) persistState(keyName, snapshot);
}

function init() {
  syncFileOrder();
  file = order[0];
  const selector = $('#studentExercise');
  EXERCICIOS.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${String(item.numero).padStart(2, '0')} — ${item.nomeCurto}`;
    selector.append(option);
  });
  selector.value = current;
  selector.addEventListener('change', () => {
    flushSave();
    current = Number(selector.value);
    referenceMode = 'auto';
    practiceReferenceStep = null;
    syncFileOrder();
    file = order[0];
    explainStep = 0;
    view = 'explain';
    load();
    renderAll();
  });

  $('#explainPrev').addEventListener('click', previousExplain);
  $('#explainNext').addEventListener('click', nextExplain);
  $('#backExplain').addEventListener('click', () => returnToTutorial('referencia_protegida'));
  $('#reviewSteps').addEventListener('click', () => returnToTutorial('pratica'));
  $('#goTutorial').addEventListener('click', () => returnToTutorial('atalho'));
  $('#goDirectPractice')?.addEventListener('click', goDirectPractice);
  $('#toggleActivityBrief')?.addEventListener('click', toggleActivityBrief);
  $('#openGiftFile')?.addEventListener('click', openGiftFile);
  $('#downloadGiftFile')?.addEventListener('click', downloadGiftFile);
  $('#understoodPart').addEventListener('click', markPartUnderstood);
  $('#practiceCurrentPart')?.addEventListener('click', practiceCurrentPart);
  $('#startPractice').addEventListener('click', () => setView('practice'));
  $('#validateFile').addEventListener('click', validate);
  $('#finishActivity').addEventListener('click', finishActivity);
  $('#openAutocomplete').addEventListener('click', openAutocompleteModal);
  $('#undoAutocomplete').addEventListener('click', undoAutocomplete);
  $('#reviewAutocomplete').addEventListener('click', openAutocompleteReview);
  $('#restoreSupportMarker').addEventListener('click', restoreSupportMarker);
  $('#closeAutocomplete').addEventListener('click', closeAutocompleteModal);
  $('#cancelAutocomplete').addEventListener('click', closeAutocompleteModal);
  $('#confirmAutocomplete').addEventListener('click', confirmAutocomplete);
  $('#autocompleteBlock').addEventListener('change', renderAutocompleteModal);
  $('#autocompleteModal').addEventListener('click', event => { if (event.target.id === 'autocompleteModal') closeAutocompleteModal(); });
  $('#closeAutocompleteReview').addEventListener('click', closeAutocompleteReview);
  $('#cancelAutocompleteReview').addEventListener('click', closeAutocompleteReview);
  $('#confirmAutocompleteReview').addEventListener('click', confirmAutocompleteReview);
  $('#autocompleteReviewModal').addEventListener('click', event => { if (event.target.id === 'autocompleteReviewModal') closeAutocompleteReview(); });
  $('#refreshPreview').addEventListener('click', startPracticeExecution);
  $('#runProject')?.addEventListener('click', startPracticeExecution);
  $$('.runtime-tab').forEach(button => button.addEventListener('click', () => setRuntimeTab(button.dataset.runtimeTab)));
  $('#clearConsole')?.addEventListener('click', () => { runtimeConsoleLines = []; renderRuntimeConsole(); });
  $('#minimizePreview')?.addEventListener('click', toggleRuntimePreviewMinimized);
  $('#closePreview')?.addEventListener('click', closeRuntimePreview);
  $('#reopenPreview')?.addEventListener('click', reopenRuntimePreview);
  $('#focusPreview').addEventListener('click', () => { previewOpen = true; previewMinimized = false; setRuntimeTab('preview'); renderRuntimePanel(); $('#studentPracticeFrame')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#focusTerminal').addEventListener('click', () => { setRuntimeTab('terminal'); VSTerminal?.open?.(); VSTerminal?.focus?.(); });
  $('#toggleExplorer').addEventListener('click', toggleExplorer);
  $('#closeExplorer').addEventListener('click', toggleExplorer);
  $('#renameRoot').addEventListener('click', renameWorkspaceRoot);
  $('#createFolder').addEventListener('click', createWorkspaceFolder);
  $('#toggleReference').addEventListener('click', toggleReferencePanel);
  $('#toggleReferenceMode').addEventListener('click', () => {
    const fullNow = referenceMode === 'full' || referenceMode === 'auto';
    referenceMode = fullNow ? 'excerpt' : 'full';
    renderPractice();
  });
  $('#togglePreview').addEventListener('click', togglePreviewPanel);
  $('#toggleTerminal').addEventListener('click', () => { setRuntimeTab('terminal'); VSTerminal?.open?.(); VSTerminal?.focus?.(); });
  $('#cancelCompletion').addEventListener('click', closeCompletionConfirm);
  $('#confirmCompletion').addEventListener('click', confirmCompletion);
  $('#completionConfirmModal').addEventListener('click', event => { if (event.target.id === 'completionConfirmModal') closeCompletionConfirm(); });
  $('#generateEvidence').addEventListener('click', generateEvidence);
  $('#downloadEvidenceJson').addEventListener('click', downloadEvidenceJson);
  $('#downloadEvidenceHtml').addEventListener('click', downloadEvidenceHtml);
  $('#copyFolder').addEventListener('click', () => Utils.copy(workspaceRootName(), 'Nome da pasta copiado.'));
  $('#studentRunStep').addEventListener('click', runTutorialAction);
  $('#closeValidationDetails').addEventListener('click', () => hideValidationDetails());
  $('#diagnosticReviewTutorial').addEventListener('click', () => setView('explain'));
  $('#diagnosticFocusLine').addEventListener('click', focusDiagnosticLine);
  $('#selectAllCode').addEventListener('click', selectAllCode);
  $('#copyStudentCode').addEventListener('click', copyStudentCode);
  $('#downloadCurrentCode').addEventListener('click', () => requestDownload(() => downloadFile(file)));
  $('#downloadProject').addEventListener('click', () => requestDownload(downloadProject));
  $('#cancelIncompleteDownload').addEventListener('click', closeDownloadWarning);
  $('#confirmIncompleteDownload').addEventListener('click', confirmIncompleteDownload);
  $('#downloadWarning').addEventListener('click', event => { if (event.target.id === 'downloadWarning') closeDownloadWarning(); });

  document.addEventListener('copy', event => {
    const selection = window.getSelection?.();
    const anchor = selection?.anchorNode?.nodeType === 1 ? selection.anchorNode : selection?.anchorNode?.parentElement;
    if (anchor?.closest?.('.protected-reference-copy')) {
      event.preventDefault();
      Utils.toast('A referência é somente para leitura. Digite o código manualmente.');
    }
  }, true);
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
  window.addEventListener('message', handlePreviewMessage);
  document.addEventListener('pointerdown', registerInteraction, { passive: true });
  document.addEventListener('keydown', registerInteraction);
  activityTimer = setInterval(trackActiveTime, 1000);
  document.addEventListener('appauth:before-user-change', flushSave);
  document.addEventListener('appauth:ready', () => {
    syncFileOrder();
    load();
    renderAll();
  });

  $('#studentEditor').addEventListener('input', () => {
    state.answers[file] = $('#studentEditor').value;
    state.activity[file].keystrokes = (state.activity[file].keystrokes || 0) + 1;
    state.activity[file].lastInteractionAt = Date.now();
    state.activity[file].executions = 0;
    state.execution[file] = ExecutionFlow.invalidate(state.execution[file]);
    resetCompletionAfterEdit();
    state.origin[file] = state.support[file]?.activeBlocks?.length ? 'misto' : 'digitado';
    state.support[file].markerMissing = Boolean(state.support[file]?.activeBlocks?.length && !AutoCompleteSupport.hasMarker(state.answers[file], file));
    if (state.done[file]) {
      state.done[file] = false;
      showValidation('O código foi alterado após a última execução. Execute novamente para atualizar o resultado.', 'warning');
    }
    state.lastDiagnosticLine[file] = null;
    scheduleSave();
    syncEditor();
    renderPreviewStale();
    VSTerminal?.markStale?.();
    renderExecutionPanel();
    renderBehaviorScenarios();
    renderExecutionCheckpoints();
    renderRuntimePanel();
    renderOrigin();
    renderProgress();
    renderCodeHealth();
    renderSupportPanel();
    hideValidationDetails();
  });


  $$('[data-download]').forEach(button => {
    button.addEventListener('click', () => downloadFile(button.dataset.download));
  });
  $$('[data-info]').forEach(button => {
    button.addEventListener('click', () => openInfo(button.dataset.info));
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!$('#autocompleteModal').hidden) closeAutocompleteModal();
    else if (!$('#autocompleteReviewModal').hidden) closeAutocompleteReview();
    else if (!$('#completionConfirmModal').hidden) closeCompletionConfirm();
  });

  VSCodeEditor?.init?.({
    hostId: 'studentCodeEditor', modelId: 'studentEditor', lineNumbersId: 'lineNumbers',
    onRun: startPracticeExecution,
    onSave: () => { flushSave(); save(); Utils.toast('Arquivo salvo localmente.'); },
    onToggleExplorer: toggleExplorer
  });
  VSTerminal?.init?.({
    getWorkspace: () => state.workspace || defaultWorkspace(),
    listWorkspace, treeWorkspace, readFile: readWorkspaceFile, rename: terminalRenameFile, mkdir: terminalMkdir, cd: terminalCd, run: startPracticeExecution
  });
  load();
  renderAll();
}

function fileIndex() {
  return order.indexOf(file);
}

function setView(nextView) {
  view = nextView;
  window.AppAuth?.log('modo_exercicio_alterado', { modo: nextView, arquivo: file });
  renderViews();
  updatePhase();
  renderProgress();
  if (view === 'practice') {
    renderPractice();
    setTimeout(() => VSCodeEditor?.focus?.(), 50);
  }
  if (view === 'full') renderFull();
  if (view === 'explain') renderExplain();
}

function renderAll() {
  $('#studentTitle').textContent = exercise().titulo;
  renderTabs();
  renderExplain();
  renderFull();
  renderPractice();
  renderCompletion();
  renderProgress();
  renderCodeHealth();
  renderSupportPanel();
  renderActivityBrief();
  renderExecutionPanel();
  renderBehaviorScenarios();
  renderExecutionCheckpoints();
  renderRuntimePanel();
  renderFinishButton();
  renderDeliveryGuide();
  if (!$('#workspacePanel')?.hidden) renderWorkspace();
}


function renderTabs() {
  const keys = visibleFileKeys();
  $('#studentFileTabs').innerHTML = keys.map(key => {
    const editable = order.includes(key);
    const locked = editable && state.unlocked?.[key] === false;
    const active = editable ? (supportFileOpen === null && file === key) : supportFileOpen === key;
    const role = fileRole(key);
    const done = editable && state.done[key];
    return `
      <button data-file="${Utils.escapeHtml(key)}" data-file-role="${Utils.escapeHtml(role)}" class="${active ? 'active' : ''} ${done ? 'done' : ''} ${editable ? 'editable-file' : 'readonly-file'}" ${locked ? 'disabled' : ''}>
        <span class="file-tab-name">${Utils.escapeHtml(physicalPath(key))}</span>
        <small>${Utils.escapeHtml(role)}</small>
      </button>`;
  }).join('');
  $$('#studentFileTabs button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      const key = button.dataset.file;
      if (!order.includes(key)) {
        supportFileOpen = key;
        view = 'practice';
        renderViews();
        showWorkspaceSupportFile(key);
        renderTabs();
        return;
      }
      supportFileOpen = null;
      file = key;
      referenceMode = 'auto';
      practiceReferenceStep = null;
      explainStep = Math.min(state.explained[file] || 0, exercise().passos[file].length - 1);
      view = state.done[file] || state.directPractice ? 'practice' : 'explain';
      renderAll();
    });
  });
}

function renderViews() {
  $('#explainView').hidden = view !== 'explain';
  $('#fullView').hidden = view !== 'full';
  $('#practiceView').hidden = view !== 'practice';
  $('#completion').hidden = view !== 'completion';
}

function renderExplain() {
  const steps = exercise().passos[file];
  if (explainStep >= steps.length) explainStep = steps.length - 1;
  const selected = steps[explainStep];
  $('#explainCounter').textContent = `Parte ${explainStep + 1} de ${steps.length}`;
  $('#explainTitle').textContent = selected.titulo;
  $('#explainText').textContent = selected.explicacao;
  $('#studentStepResult').textContent = resultDescription(file);
  if ($('#stepPracticePrompt')) {
    $('#stepPracticePrompt').hidden = isFrozenExercise01();
    $('#stepPracticePrompt').textContent = selected.tarefa || `Depois de compreender esta parte, pratique digitando manualmente o trecho no arquivo ${physicalPath(file)}.`;
  }
  if ($('#stepCheckpoint')) {
    const hasCheckpoint = !isFrozenExercise01() && Boolean(selected.entregavel || selected.teste);
    $('#stepCheckpoint').hidden = !hasCheckpoint;
    if ($('#stepDeliverable')) $('#stepDeliverable').textContent = selected.entregavel || 'Implemente o bloco explicado desta etapa.';
    if ($('#stepQuickTest')) $('#stepQuickTest').textContent = selected.teste || 'Execute e confira o resultado antes de continuar.';
  }
  if ($('#practiceCurrentPart')) {
    $('#practiceCurrentPart').hidden = isFrozenExercise01();
    $('#practiceCurrentPart').textContent = selected.linhas?.length === 2 ? `Praticar linhas ${selected.linhas[0]}–${selected.linhas[1]}` : 'Praticar este trecho';
  }
  $('#explainFileName').textContent = physicalPath(file);
  Utils.renderCode($('#explainCode'), exercise().arquivos[file], file, selected.linhas, true);
  $('#explainPrev').disabled = explainStep === 0 && fileIndex() === 0;
  $('#explainNext').textContent = explainStep === steps.length - 1 ? 'Ir para a prática' : 'Próxima parte';
  renderTutorialPreview(selected.linhas);
  renderViews();
  updatePhase();
  renderProgress();
}

function resultDescription(currentFile) {
  if (String(currentFile || '').toLowerCase().startsWith('html')) return 'O destaque no preview mostra onde a estrutura desse trecho aparece na página.';
  if (currentFile === 'css') return 'O destaque mostra os elementos que recebem as regras visuais desse trecho.';
  return 'O destaque mostra os elementos envolvidos na ação. Quando disponível, use “Executar ação” para testar a função.';
}

function renderTutorialPreview(range) {
  const result = Utils.buildPreviewDocument(exercise(), { file, range, tutorial: true });
  tutorialFunctions = result.functions;
  $('#studentTutorialPreview').srcdoc = result.srcdoc;
  $('#studentTutorialLabel').textContent = `${physicalPath(file)} · parte ${explainStep + 1}`;
  $('#studentTutorialMessage').textContent = 'Observe o elemento contornado e relacione o resultado com as linhas destacadas.';
  const button = $('#studentRunStep');
  button.hidden = file !== 'js' || !tutorialFunctions.length;
  button.textContent = tutorialFunctions.length ? `Executar ${tutorialFunctions[0]}()` : 'Executar ação';
}

function runTutorialAction() {
  const frame = $('#studentTutorialPreview');
  const functionName = tutorialFunctions[0];
  if (!functionName || !frame?.contentWindow) return;
  frame.contentWindow.postMessage({ channel: 'ds3-preview', type: 'run-function', name: functionName }, '*');
}

function previousExplain() {
  if (explainStep > 0) {
    explainStep -= 1;
    renderExplain();
    return;
  }
  if (fileIndex() > 0) {
    file = order[fileIndex() - 1];
    explainStep = Math.max(0, exercise().passos[file].length - 1);
    renderAll();
  }
}

function nextExplain() {
  const steps = exercise().passos[file];
  state.explained[file] = Math.max(state.explained[file] || 0, explainStep + 1);
  save();
  if (explainStep < steps.length - 1) {
    explainStep += 1;
    renderExplain();
  } else {
    view = 'practice';
    renderAll();
    setTimeout(() => VSCodeEditor?.focus?.(), 50);
  }
}

function renderFull() {
  $('#fullFileName').textContent = physicalPath(file);
  if ($('#fullCode')) $('#fullCode').textContent = '';
  if ($('#studentFullPreview')) $('#studentFullPreview').srcdoc = '';
}

function renderPractice() {
  renderGiftBanner();
  $('#referenceFileName').textContent = physicalPath(file);
  $('#editorFileName').textContent = physicalPath(file);
  const steps = exercise().passos[file] || [];
  const progressStepIndex = Math.max(0, Math.min(steps.length - 1, (state.explained[file] || 1) - 1));
  const studiedIndex = practiceReferenceStep === null ? progressStepIndex : Math.max(0, Math.min(steps.length - 1, practiceReferenceStep));
  const studiedRange = steps[studiedIndex]?.linhas || [1, Math.min(8, String(exercise().arquivos[file] || '').split('\n').length)];
  const referenceLines = String(exercise().arquivos[file] || '').split('\n');
  const earlyPhase = Number(exercise().fasePedagogica || exercise().numero || 99) <= 3;
  const fullByDefault = exercise().referenciaCompletaPadrao !== false;
  const showFullReference = referenceMode === 'full' || (referenceMode === 'auto' && (fullByDefault || earlyPhase));
  const excerpt = showFullReference
    ? String(exercise().arquivos[file] || '')
    : referenceLines.slice(Math.max(0, studiedRange[0] - 1), studiedRange[1]).join('\n');
  Utils.renderCode($('#referenceFull'), excerpt, file, null, false);
  const pedagogicalType = exercise().modeloPedagogico?.tipo || 'reproducao-guiada';
  const fullReferenceLabel = isFrozenExercise01()
    ? 'arquivo completo para digitar/adaptar'
    : pedagogicalType === 'pratica-conceitual'
      ? 'uma solução possível para comparar'
      : pedagogicalType === 'construcao-guiada'
        ? 'referência completa de estrutura'
        : 'arquivo completo para digitar manualmente';
  $('#referenceFileName').textContent = showFullReference
    ? `${physicalPath(file)} · ${fullReferenceLabel}`
    : `${physicalPath(file)} · linhas ${studiedRange[0]}–${studiedRange[1]}`;
  if ($('#referenceModeLabel')) $('#referenceModeLabel').textContent = showFullReference ? 'referência completa · somente leitura' : 'trecho estudado';
  if ($('#toggleReferenceMode')) {
    $('#toggleReferenceMode').hidden = false;
    $('#toggleReferenceMode').textContent = showFullReference ? 'Ver somente trecho' : 'Ver arquivo completo';
  }
  if ($('#referenceHelp')) {
    const conceptual = pedagogicalType === 'pratica-conceitual';
    if (isFrozenExercise01()) {
      $('#referenceHelp').textContent = showFullReference
        ? 'Este é o arquivo completo de referência para leitura. Observe-o e digite manualmente no editor; copiar e colar estão desativados.'
        : 'Este painel mostra somente o trecho estudado. Use “Ver arquivo completo” para consultar a estrutura inteira e digite manualmente no editor.';
    } else {
      $('#referenceHelp').textContent = showFullReference
        ? conceptual
          ? 'Esta é uma solução de referência, não um gabarito textual. Implemente os conceitos obrigatórios e personalize valores ou estratégia quando o comportamento continuar correto.'
          : 'Este é o arquivo completo de referência para leitura. Observe-o e digite manualmente no editor; copiar e colar estão desativados.'
        : conceptual
          ? 'Este trecho demonstra o conceito atual. Reproduza o raciocínio no seu código; não é necessário copiar valores visuais exatamente.'
          : 'Este painel mostra somente o trecho estudado. Use “Ver arquivo completo” para consultar a estrutura inteira e digite manualmente no editor.';
    }
  }
  $('#studentEditor').value = state.answers[file] || '';
  VSCodeEditor?.setLanguage?.(physicalPath(file));
  const editorIdentity = `${exercise().numero}:${file}`;
  const switchingEditorFile = editorHistoryFile !== editorIdentity;
  VSCodeEditor?.setValue?.(state.answers[file] || '', { record: false, resetHistory: switchingEditorFile });
  editorHistoryFile = editorIdentity;
  renderCodeHealth();
  syncEditor();
  renderOrigin();
  renderPreviewStale();
  renderExecutionPanel();
  renderSupportPanel();
  renderFinishButton();
  if (supportFileOpen && !order.includes(supportFileOpen)) renderSupportFileReference(supportFileOpen);
}

function goDirectPractice() {
  state.directPractice = true;
  state.practiceBriefCollapsed = true;
  practiceReferenceStep = null;
  view = 'practice';
  save();
  renderAll();
  window.AppAuth?.log('pratica_direta_escolhida', { numero: exercise().numero, arquivo: file });
  Utils.toast('Prática direta ativada. Você pode mostrar as instruções novamente quando quiser.');
  setTimeout(() => document.querySelector('.student-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  setTimeout(() => VSCodeEditor?.focus?.(), 120);
}

function toggleActivityBrief() {
  state.practiceBriefCollapsed = !Boolean(state.practiceBriefCollapsed);
  save();
  renderActivityBrief();
  if (!state.practiceBriefCollapsed) $('#activityBrief')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderGiftBanner() {
  const banner = $('#giftBanner');
  if (!banner) return;
  const gift = exercise().presente;
  banner.hidden = !gift;
  if (!gift) return;
  $('#giftTitle').textContent = gift.titulo || 'Arquivo de presente';
  $('#giftMessage').textContent = gift.mensagem || 'Este arquivo já está pronto dentro do projeto.';
  const key = gift.arquivo;
  if ($('#openGiftFile')) $('#openGiftFile').textContent = `Ver ${physicalPath(key)}`;
  if ($('#downloadGiftFile')) $('#downloadGiftFile').textContent = `Baixar ${physicalPath(key)}`;
}

function openGiftFile() {
  const gift = exercise().presente;
  if (!gift?.arquivo) return;
  const key = gift.arquivo;
  supportFileOpen = key;
  view = 'practice';
  renderViews();
  showWorkspaceSupportFile(key);
  document.querySelector('.reference-practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function downloadGiftFile() {
  const gift = exercise().presente;
  if (!gift?.arquivo) return;
  downloadFile(gift.arquivo);
}

function renderActivityBrief() {
  const panel = $('#activityBrief');
  if (panel) panel.hidden = isFrozenExercise01() || Boolean(state.practiceBriefCollapsed);
  if ($('#toggleActivityBrief')) $('#toggleActivityBrief').textContent = state.practiceBriefCollapsed ? 'Mostrar instruções' : 'Ocultar instruções';
  if (isFrozenExercise01()) return;
  const model = exercise().modeloPedagogico || {};
  if ($('#activityModelBadge')) $('#activityModelBadge').textContent = model.rotulo || 'Prática guiada';
  if ($('#activityModelDescription')) $('#activityModelDescription').textContent = model.como || 'Observe, digite, execute, teste e valide o código atual.';
  if ($('#activitySituation')) $('#activitySituation').textContent = exercise().situacaoProblema || 'Resolva o problema proposto usando os requisitos da atividade e teste o comportamento antes de validar.';
  if ($('#activityRequired')) $('#activityRequired').innerHTML = (model.obrigatorio || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('') || '<li>Atenda aos requisitos apresentados no tutorial.</li>';
  if ($('#activityFlexible')) $('#activityFlexible').innerHTML = (model.variar || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('') || '<li>Espaços, indentação e detalhes permitidos pelo enunciado.</li>';
  if ($('#activityResolutionSteps')) $('#activityResolutionSteps').innerHTML = (exercise().passosDesafio || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('') || '<li>Estude o tutorial, implemente por partes, execute e valide.</li>';
  if ($('#activityTestBeforeValidate')) $('#activityTestBeforeValidate').innerHTML = (exercise().testeAntesValidar || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('') || '<li>Execute o código atual e confira o comportamento esperado.</li>';
  const project = exercise().projetoGuiado;
  if ($('#activityProjectMap')) {
    $('#activityProjectMap').hidden = !project;
    if (project) {
      if ($('#activityProduct')) $('#activityProduct').textContent = project.produto || '';
      if ($('#activityStudentFiles')) $('#activityStudentFiles').innerHTML = (project.arquivosAluno || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('');
      if ($('#activitySupportFiles')) $('#activitySupportFiles').innerHTML = (project.arquivosApoio || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('');
      if ($('#activityMilestones')) $('#activityMilestones').innerHTML = (project.marcos || []).map(item => `<li>${Utils.escapeHtml(item)}</li>`).join('');
    }
  }
}

function renderOrigin() {
  const support = state.support[file] || defaultSupportState();
  const origin = support.activeBlocks?.length ? 'misto' : state.origin[file];
  const labels = {
    misto: 'código misto: aluno + apoio automático',
    sistema: 'apoio automático utilizado',
    digitado: support.everUsed ? 'apoio desfeito; histórico preservado' : 'digitado pelo aluno'
  };
  $('#originStatus').textContent = labels[origin] || labels.digitado;
  $('#originStatus').style.background = origin === 'misto' ? '#654b12' : support.everUsed ? '#34304f' : '#1d2a46';
}

function validate() {
  const value = $('#studentEditor').value;
  const support = state.support[file] || defaultSupportState();
  if (support.activeBlocks?.length && !AutoCompleteSupport.hasMarker(value, file)) {
    support.markerMissing = true;
    save();
    renderSupportPanel();
    showValidation('A identificação do apoio automático foi removida. Restaure a marcação antes de validar.', 'danger');
    return;
  }
  if (support.activeBlocks?.length && !support.reviewConfirmed) {
    showValidation('Revise o trecho inserido pelo apoio automático antes de validar.', 'warning');
    openAutocompleteReview();
    return;
  }
  const executionReadiness = ExecutionFlow.readiness(state.execution[file], exercise(), file, projectSnapshot());
  if (!executionReadiness.ok) {
    const message = executionReadiness.error
      ? `A execução apresentou erro: ${executionReadiness.error}`
      : executionReadiness.status === 'stale' || !executionReadiness.hashMatches
        ? 'O código foi alterado após a última execução. Execute novamente para atualizar o resultado.'
        : executionReadiness.missing.length
          ? `Ainda falta testar: ${executionReadiness.missing.map(item => item.label).join('; ')}.`
          : 'Execute o código atual e aguarde o preview carregar sem erros antes de validar.';
    showValidation(message, executionReadiness.error ? 'danger' : 'warning');
    renderExecutionPanel();
    $('#refreshPreview')?.focus();
    return;
  }
  const integrity = projectIntegrityIssues(file);
  if (integrity.length) {
    showValidation(`${integrity[0].title}: ${integrity[0].detail}`, 'danger');
    renderValidationDetails({ ok:false, summary:integrity[0].detail, issues:integrity.map(item => item.detail), suggestions:['Confira os nomes e caminhos relativos no Explorador. O preview não deve esconder arquivos desconectados.'], firstLine:null }, state.attempts[file] || 1);
    return;
  }
  const validationExercise = dynamicExerciseForValidation(file);
  const result = Utils.validateCode(file, value, exercise().arquivos[file], validationExercise);

  if (!result.ok) {
    state.attempts[file] = (state.attempts[file] || 0) + 1;
    state.lastDiagnosticLine[file] = result.firstLine || null;
    save();

    const attempt = state.attempts[file];
    const message = `Tentativa ${attempt}: ${result.summary} Consulte o diagnóstico abaixo e compare o trecho indicado.`;

    showValidation(message, 'danger');
    window.AppAuth?.log('validacao_falhou', { arquivo: file, tentativa: attempt, resumo: result.summary });
    renderValidationDetails(result, attempt);
    return;
  }

  state.answers[file] = value;
  state.done[file] = true;
  state.execution[file].validatedAt = new Date().toISOString();
  state.execution[file].validatedHash = ExecutionFlow.fastHash(projectSnapshot());
  state.execution[file].validatedExecutionId = state.execution[file].executionId;
  state.attempts[file] = 0;
  state.lastDiagnosticLine[file] = null;
  hideValidationDetails();
  const index = fileIndex();
  if (index < order.length - 1) {
    state.unlocked[order[index + 1]] = true;
    save();
    showValidation('Arquivo concluído! A validação aceitou a estrutura do código e o próximo arquivo foi liberado.', 'success');
    window.AppAuth?.log('arquivo_validado', { arquivo: file });
    setTimeout(() => {
      file = order[index + 1];
      explainStep = 0;
      view = state.directPractice ? 'practice' : 'explain';
      renderAll();
    }, 650);
  } else {
    save();
    window.AppAuth?.log('todos_arquivos_validados', { numero: exercise().numero });
    showValidation('Todos os arquivos foram validados. Revise o resultado e clique em “Concluir atividade” quando estiver pronto.', 'success');
    renderAll();
    renderFinishButton();
    renderDeliveryGuide();
  }
}

function renderCodeHealth() {
  const element = $('#codeHealth');
  if (!element) return;
  const value = view === 'practice' ? ($('#studentEditor')?.value || state.answers[file] || '') : (state.answers[file] || '');
  const analysis = state.done[file]
    ? { percentage: 100, remaining: 0, status: 'Validado', state: 'correct', message: 'Este arquivo foi validado. A atividade só será concluída após a confirmação final.' }
    : Utils.analyzeCompleteness(file, value, exercise().arquivos[file], dynamicExerciseForValidation(file));
  element.dataset.state = analysis.state;
  $('#codeHealthBar').style.width = `${analysis.percentage}%`;
  $('#codeHealthPercent').textContent = `${analysis.percentage}%`;
  $('#codeHealthStatus').textContent = analysis.status;
  $('#codeHealthStatus').className = `chip ${analysis.state === 'correct' ? 'success' : analysis.state === 'error' ? 'warning' : 'info'}`;
  $('#codeHealthMessage').textContent = analysis.message;
  $('#codeHealthRemaining').textContent = analysis.percentage === 0 ? 'Comece pelo primeiro trecho' : analysis.remaining ? `Restam cerca de ${analysis.remaining}%` : 'Pronto para validar';
}

function renderValidationDetails(result, attempt) {
  const panel = $('#validationDetails');
  panel.hidden = false;
  $('#validationAttemptBadge').textContent = `${attempt} tentativas`;
  $('#validationSummary').textContent = result.summary || 'Revise os pontos identificados.';

  const issues = result.issues?.length ? result.issues : [{ title: 'Diferença encontrada', detail: 'Revise o arquivo com o tutorial.' }];
  $('#validationIssues').innerHTML = '';
  issues.slice(0, 8).forEach(issue => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = issue.title;
    item.append(title);
    item.append(document.createTextNode(` — ${issue.detail}`));
    if (issue.line) {
      const line = document.createElement('span');
      line.className = 'validation-line';
      line.textContent = `linha ${issue.line}`;
      item.append(line);
    }
    $('#validationIssues').append(item);
  });

  $('#validationSuggestions').innerHTML = '';
  (result.suggestions || []).slice(0, 6).forEach(suggestion => {
    const item = document.createElement('li');
    item.textContent = suggestion;
    $('#validationSuggestions').append(item);
  });

  const targetLine = result.firstLine || 1;
  const actualLines = ($('#studentEditor').value || '').split('\n');
  const referenceLines = String(exercise().arquivos[file] || '').split('\n');
  const referenceLineCount = referenceLines.length;
  const from = Math.max(0, targetLine - 2);
  const to = Math.min(referenceLineCount, targetLine + 1);
  $('#validationStudentSnippet').textContent = actualLines.slice(from, to).map((line, index) => `${from + index + 1}: ${line}`).join('\n') || '(arquivo vazio)';
  const referenceTitle = $('#validationReferenceSnippet')?.previousElementSibling;
  if (isFrozenExercise01()) {
    if (referenceTitle) referenceTitle.textContent = 'Trecho de referência';
    $('#validationReferenceSnippet').className = 'no-select protected-reference-copy';
    $('#validationReferenceSnippet').textContent = referenceLines.slice(from, to).map((line, index) => `${from + index + 1}: ${line}`).join('\n') || '(sem trecho de referência)';
  } else {
    if (referenceTitle) referenceTitle.textContent = 'Onde conferir';
    $('#validationReferenceSnippet').className = 'validation-reference-guide';
    $('#validationReferenceSnippet').textContent = `Consulte aproximadamente as linhas ${from + 1}–${Math.max(from + 1, to)} da referência à esquerda. Compare a estrutura, os nomes necessários, os símbolos e o fechamento do bloco. O sistema não exibe aqui o código correto.`;
  }
  $('#diagnosticFocusLine').hidden = !result.firstLine;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideValidationDetails() {
  const panel = $('#validationDetails');
  if (panel) panel.hidden = true;
}

function focusDiagnosticLine() {
  const targetLine = state.lastDiagnosticLine[file];
  const value = $('#studentEditor')?.value || '';
  if (!targetLine) return;
  const lines = value.split('\n');
  const start = lines.slice(0, Math.max(0, targetLine - 1)).reduce((total, line) => total + line.length + 1, 0);
  const end = start + (lines[targetLine - 1]?.length || 0);
  VSCodeEditor?.selectRange?.(start, end);
}

function showValidation(text, type) {
  const element = $('#validationMessage');
  element.textContent = text;
  element.style.color = type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)';
}

function syncEditor() {
  const textarea = $('#studentEditor');
  if (window.VSCodeEditor) {
    VSCodeEditor.setLanguage(physicalPath(file));
    if (VSCodeEditor.getValue() !== textarea.value) VSCodeEditor.setValue(textarea.value, { record: false });
    return;
  }
  const content = textarea.value || '';
  const count = Math.max(1, content.split('\n').length);
  $('#lineNumbers').innerHTML = Array.from({ length: count }, (_, index) => `<div>${index + 1}</div>`).join('');
}

function syncScroll() {}
function activeLine() { return VSCodeEditor?.getLineColumn?.().line || 1; }
function updateActiveLine() {}
function tabKey() {}

function composeStudentPreview() {
  const answers = { ...(exercise().arquivos || {}) };
  order.forEach(key => { answers[key] = state.answers[key] ?? ''; });
  if (view === 'practice') answers[file] = $('#studentEditor').value;

  const htmlKey = String(file || '').toLowerCase().startsWith('html') ? file : 'html';
  let html = answers[htmlKey] || '<!DOCTYPE html><html><head></head><body><p style="font-family:Arial;padding:20px">O preview aparecerá conforme você construir o exercício.</p></body></html>';
  html = html
    .replace(/<link\b[^>]*href=["'][^"']+["'][^>]*>/gi, '')
    .replace(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, '');
  const refs = htmlReferences(answers[htmlKey] || '');
  const cssConnected = refs.some(item => item.tag === 'link' && workspaceKeyFromReference(htmlKey, item.raw) === 'css');
  const jsConnected = refs.some(item => item.tag === 'script' && workspaceKeyFromReference(htmlKey, item.raw) === 'js');
  const css = cssConnected ? (answers.css || '') : '';
  const js = jsConnected ? (answers.js || '').replaceAll('</script>', '<\/script>') : '';
  const bridge = ExecutionFlow.bridgeScript(state.execution[file]?.executionId);
  if (cssConnected) {
    if (html.includes('</head>')) html = html.replace('</head>', `<style>${css}</style></head>`);
    else html = `<style>${css}</style>${html}`;
  }
  const runtime = `${bridge}${jsConnected ? `<script>${js}<\/script>` : ''}`;
  if (html.includes('</body>')) html = html.replace('</body>', `${runtime}</body>`);
  else html += runtime;
  return { html, hasHtml: Boolean((answers[htmlKey] || '').trim()), integrityIssues: projectIntegrityIssues(htmlKey), cssConnected, jsConnected };
}

function projectSnapshot(targetFile = file) {
  return String(view === 'practice' && targetFile === file ? ($('#studentEditor')?.value ?? state.answers[targetFile] ?? '') : (state.answers[targetFile] ?? ''));
}

function startPracticeExecution() {
  runtimePanelTab='preview'; previewOpen=true; previewMinimized=false; runtimeConsoleLines=[];
  registerActivity('execution');
  state.answers[file] = $('#studentEditor').value;
  state.execution[file] = ExecutionFlow.start(exercise(), file, projectSnapshot());
  state.done[file] = false;
  resetCompletionAfterEdit();
  save();
  renderExecutionPanel();
  VSTerminal?.startExecution?.({ command: `start ${physicalBaseName(workspaceKeys().find(key => String(key).toLowerCase().startsWith('html')) || file)}`, fileName: physicalPath(file), executionId: state.execution[file].executionId });
  renderPracticePreview();
  window.AppAuth?.log('execucao_iniciada', { arquivo: file, execucao: state.execution[file].executionId });
}

function renderPracticePreview() {
  const preview = composeStudentPreview();
  $('#studentPreview').srcdoc = preview.html;
  $('#previewMessage').dataset.state = 'loading';
  $('#previewMessage').textContent = preview.integrityIssues?.length
    ? `Projeto com caminho pendente: ${preview.integrityIssues[0].detail}`
    : preview.hasHtml
      ? 'Executando o código atual no preview isolado...'
      : 'O HTML está vazio. O preview foi executado sem uma página construída.';
  if (preview.integrityIssues?.length) VSTerminal?.warn?.(`Projeto com caminho pendente: ${preview.integrityIssues[0].detail}`);
}

function renderPreviewStale() {
  const frame = $('#studentPreview');
  if (frame) frame.srcdoc = '<!DOCTYPE html><html lang="pt-BR"><meta charset="UTF-8"><body style="font-family:Arial;padding:24px;background:#0b1220;color:#dce8ff"><h2>Resultado desatualizado</h2><p>O código foi alterado. Clique em <strong>Executar / atualizar</strong> para gerar um novo resultado.</p></body></html>';
  const message = $('#previewMessage');
  if (message) {
    const status = state.execution[file]?.status || 'never';
    message.dataset.state = status === 'error' ? 'error' : status === 'never' ? 'ready' : 'warning';
    message.textContent = status === 'error'
      ? `Último erro: ${state.execution[file].error}`
      : status === 'never'
        ? 'Clique em “Executar / atualizar” para gerar o primeiro resultado.'
        : 'O código foi alterado após a última execução. Execute novamente para atualizar o resultado.';
  }
}

function handlePreviewMessage(event) {
  const frames = ['studentTutorialPreview', 'studentFullPreview', 'studentPreview'];
  const frameId = frames.find(id => document.querySelector(`#${id}`)?.contentWindow === event.source);
  if (!frameId) return;
  const data = event.data || {};
  if (data.channel !== 'ds3-preview') return;
  const target = frameId === 'studentPreview' ? $('#previewMessage') : $('#studentTutorialMessage');
  if (!target) return;
  if (frameId === 'studentPreview') {
    state.execution[file] = ExecutionFlow.markMessage(state.execution[file], data, exercise(), file);
    scheduleSave();
    renderExecutionPanel();
    renderBehaviorScenarios();
    renderExecutionCheckpoints();
    renderRuntimePanel();
  }
  if (data.type === 'console') {
    VSTerminal?.consoleMessage?.(data.level, data.args || []);
    runtimeConsoleLines.push({ level: data.level || 'log', text: (data.args || []).join(' '), at: new Date().toISOString() });
    runtimeConsoleLines = runtimeConsoleLines.slice(-200);
    renderRuntimeConsole();
    return;
  }
  if (data.type === 'error') {
    if (frameId === 'studentPreview') VSTerminal?.error?.(`Erro JavaScript${data.line ? ` em linha ${data.line}${data.column ? `, coluna ${data.column}` : ''}` : ''}: ${data.detail}`);
    target.dataset.state = 'error';
    target.textContent = `Erro JavaScript no preview: ${data.detail}`;
  } else if (data.type === 'navigation' || data.type === 'navigation-blocked') {
    target.dataset.state = 'warning';
    target.textContent = 'A navegação foi testada e bloqueada dentro do preview por segurança.';
  } else if (data.type === 'interaction') {
    target.dataset.state = 'success';
    target.textContent = 'Interação registrada. Continue testando os critérios indicados.';
  } else if (data.type === 'action') {
    target.dataset.state = 'success';
    target.textContent = data.detail;
  } else if (data.type === 'ready' && target.dataset.state !== 'error') {
    if (frameId === 'studentPreview' && state.execution[file]?.status !== 'error') VSTerminal?.ready?.('Projeto carregado no navegador sem erros de execução.');
    target.dataset.state = 'ready';
    target.textContent = frameId === 'studentPreview' ? 'Preview executado sem erros. Realize as interações indicadas.' : 'Preview carregado com isolamento seguro.';
  }
}

function renderExecutionPanel() {
  const record = state.execution[file] || ExecutionFlow.defaultFileState();
  const readiness = ExecutionFlow.readiness(record, exercise(), file, projectSnapshot());
  const states = {
    never: ['Não executado', 'Clique em “Executar / atualizar” para processar exatamente o código atual.'],
    running: ['Executando', 'Aguarde o carregamento do preview e observe possíveis erros.'],
    success: [readiness.ok ? 'Testes concluídos' : 'Execução concluída', readiness.missing.length ? 'A execução terminou, mas ainda existem interações obrigatórias pendentes.' : 'O preview foi executado sem erros e os testes obrigatórios foram realizados.'],
    error: ['Erro de execução', record.error || 'Corrija o código e execute novamente.'],
    stale: ['Resultado desatualizado', 'O código foi alterado depois da última execução. Execute novamente.']
  };
  const [label, summary] = states[record.status] || states.never;
  ['executionState', 'executionStatusBadge'].forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = label;
    element.dataset.state = record.status;
  });
  $('#executionSummary').textContent = summary;
  $('#executionIdentifier').textContent = record.executionId ? `ID: ${record.executionId}` : 'Sem identificação de execução';
  const met = new Set((record.interactions || []).map(item => item.requirementId));
  $('#interactionChecklist').innerHTML = readiness.requirements.map(req => `<li class="${met.has(req.id) ? 'done' : ''}">${Utils.escapeHtml(req.label)}</li>`).join('');
}

function selectAllCode() { VSCodeEditor?.selectAll?.(); }

function copyStudentCode() {
  Utils.copy($('#studentEditor').value, 'Código do aluno copiado exatamente como foi digitado.');
}


function renderBehaviorScenarios() {
  const panel = $('#behaviorScenarioPanel');
  if (!panel) return;
  const record = state.execution[file] || ExecutionFlow.defaultFileState();
  const readiness = ExecutionFlow.readiness(record, exercise(), file, projectSnapshot());
  const scenarios = readiness.requirements.filter(req => req.id !== 'preview-ready');
  panel.hidden = scenarios.length === 0;
  if (!scenarios.length) { panel.innerHTML = ''; return; }
  const met = new Set((record.interactions || []).map(item => item.requirementId));
  panel.innerHTML = `<div class="behavior-head"><div><span class="chip warning">Cenários obrigatórios</span><strong>Teste o comportamento, não apenas o código</strong></div><span class="chip ${scenarios.every(s=>met.has(s.id))?'success':'warning'}">${scenarios.filter(s=>met.has(s.id)).length}/${scenarios.length}</span></div><p class="behavior-note">Cada cenário é registrado somente depois de uma interação real no Preview atual.</p><div class="behavior-list">${scenarios.map(s=>`<div class="behavior-item ${met.has(s.id)?'done':''}"><span>${met.has(s.id)?'✓':'○'}</span><div>${Utils.escapeHtml(s.label)}</div></div>`).join('')}</div>`;
}

function renderExecutionCheckpoints() {
  const box=$('#checkpointList'); if(!box)return;
  const codeStarted=Boolean(String(state.answers[file]||'').trim());
  const record=state.execution[file]||ExecutionFlow.defaultFileState();
  const ready=ExecutionFlow.readiness(record,exercise(),file,projectSnapshot());
  const interactionReqs=ready.requirements.filter(r=>r.id!=='preview-ready');
  const met=new Set((record.interactions||[]).map(i=>i.requirementId));
  const interactionDone=interactionReqs.length===0 || interactionReqs.every(r=>met.has(r.id));
  const items=[
    {label:'Código construído',detail:'Existe código atual no arquivo.',done:codeStarted},
    {label:'Execução atualizada',detail:'O Preview confirmou a última versão sem erro.',done:record.status==='success'&&record.ready&&!record.stale&&ready.hashMatches},
    {label:'Interação testada',detail:interactionReqs.length?`${interactionReqs.length} cenário(s) obrigatório(s).`:'Este arquivo não exige interação adicional.',done:interactionDone,neutral:interactionReqs.length===0},
    {label:'Arquivo validado',detail:'Os critérios pedagógicos foram aprovados.',done:Boolean(state.done[file])}
  ];
  const done=items.filter(i=>i.done).length;
  $('#checkpointSummary').textContent=`${done}/${items.length}`;
  $('#checkpointSummary').className=`chip ${done===items.length?'success':'warning'}`;
  box.innerHTML=items.map(i=>`<div class="checkpoint-item ${i.done?'done':i.neutral?'neutral':'pending'}"><span class="checkpoint-icon">${i.done?'✓':i.neutral?'•':'○'}</span><div><strong>${i.label}</strong><p>${i.detail}</p></div></div>`).join('');
}

function setRuntimeTab(name) {
  runtimePanelTab=['preview','console','terminal','problems'].includes(name)?name:'preview';
  $$('.runtime-tab').forEach(button=>{const active=button.dataset.runtimeTab===runtimePanelTab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
  ['preview','console','terminal','problems'].forEach(key=>{const pane=$(`#runtime${key[0].toUpperCase()}${key.slice(1)}Pane`);if(pane)pane.hidden=key!==runtimePanelTab;});
  if(runtimePanelTab==='terminal') VSTerminal?.open?.();
  if(runtimePanelTab==='console') renderRuntimeConsole();
  if(runtimePanelTab==='problems') renderRuntimeProblems();
}
function renderRuntimeConsole(){ const out=$('#runtimeConsoleOutput'); if(!out)return; if(!runtimeConsoleLines.length){out.innerHTML='<div class="console-row muted">O console exibirá console.log(), avisos e erros do JavaScript executado no Preview.</div>';return;} out.innerHTML=runtimeConsoleLines.map(i=>`<div class="console-row terminal-${i.level==='error'?'error':i.level==='warn'?'warning':'console'}">${Utils.escapeHtml(i.text)}</div>`).join(''); }
function renderRuntimeProblems(){ const out=$('#runtimeProblemsOutput');if(!out)return; const problems=[]; const record=state.execution[file]||ExecutionFlow.defaultFileState(); const ready=ExecutionFlow.readiness(record,exercise(),file,projectSnapshot()); if(record.status==='error')problems.push(['Erro na execução',record.error||'Erro no Preview.']); else if(record.status==='stale'||record.status==='never')problems.push(['Execução desatualizada','Execute o projeto depois da última alteração.']); ready.missing.forEach(req=>problems.push(['Teste pendente',req.label])); projectIntegrityIssues(file).forEach(issue=>problems.push(['Estrutura do projeto',issue.detail||issue.message||'Referência quebrada.'])); if(!problems.length)problems.push(['Nenhum problema ativo','Execute, interaja com o Preview e valide o arquivo atual.']); out.innerHTML=problems.map(p=>`<div class="problem-item"><strong>${Utils.escapeHtml(p[0])}</strong><span>${Utils.escapeHtml(p[1])}</span></div>`).join(''); }
function renderRuntimePanel(){ const p=$('#runtimePanel');if(!p)return; p.classList.toggle('preview-minimized',previewMinimized);p.classList.toggle('preview-closed',!previewOpen);$('#minimizePreview').textContent=previewMinimized?'Restaurar':'Minimizar';$('#closePreview').hidden=!previewOpen;$('#reopenPreview').hidden=previewOpen; const record=state.execution[file]||ExecutionFlow.defaultFileState(); const current=record.status==='success'&&!record.stale&&record.codeHash===ExecutionFlow.fastHash(projectSnapshot()); $('#runtimeStatus').textContent=current?'execução atual':'execução desatualizada';$('#runtimeStatus').className=`chip ${current?'success':'warning'}`;setRuntimeTab(runtimePanelTab);renderRuntimeProblems();renderExecutionCheckpoints();renderBehaviorScenarios(); }
function toggleRuntimePreviewMinimized(){ previewOpen=true;previewMinimized=!previewMinimized;renderRuntimePanel(); }
function closeRuntimePreview(){ previewOpen=false;previewMinimized=false;if(runtimePanelTab==='preview')runtimePanelTab='console';renderRuntimePanel(); }
function reopenRuntimePreview(){ previewOpen=true;previewMinimized=false;runtimePanelTab='preview';renderRuntimePanel(); }

function projectContent(key) {
  if (order.includes(key)) return state.answers[key] ?? '';
  return state.workspace?.overrides?.[key] ?? exercise().arquivos[key] ?? '';
}

function setProjectContent(key, content, { invalidate = true } = {}) {
  if (order.includes(key)) {
    state.answers[key] = String(content ?? '');
    if (invalidate) {
      state.done[key] = false;
      state.execution[key] = ExecutionFlow.invalidate(state.execution[key]);
    }
  } else {
    state.workspace = state.workspace || defaultWorkspace();
    state.workspace.overrides = state.workspace.overrides || {};
    state.workspace.overrides[key] = String(content ?? '');
  }
}


function projectIsIncomplete() {
  return order.some(key => !String(state.answers[key] ?? '').trim() || !state.done[key]) || projectIntegrityIssues().length > 0;
}


function openDownloadWarning(action, trigger = document.activeElement) {
  pendingDownloadAction = action;
  pendingDownloadTrigger = trigger;
  const modal = $('#downloadWarning');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => element.setAttribute('inert', '')));
  setTimeout(() => $('#cancelIncompleteDownload')?.focus(), 0);
}

function closeDownloadWarning() {
  const wasOpen = !$('#downloadWarning').hidden;
  pendingDownloadAction = null;
  const trigger = pendingDownloadTrigger;
  pendingDownloadTrigger = null;
  const modal = $('#downloadWarning');
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => element.removeAttribute('inert')));
  if (wasOpen) trigger?.focus?.();
}
window.closeDownloadWarning = closeDownloadWarning;

function confirmIncompleteDownload() {
  const action = pendingDownloadAction;
  const trigger = pendingDownloadTrigger;
  pendingDownloadAction = null;
  pendingDownloadTrigger = null;
  const modal = $('#downloadWarning');
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => element.removeAttribute('inert')));
  action?.(true);
  setTimeout(() => trigger?.focus?.(), 0);
}

function requestDownload(action, trigger = document.activeElement) {
  flushSave();
  const missingMarkerFile = order.find(key => state.support[key]?.activeBlocks?.length && !AutoCompleteSupport.hasMarker(state.answers[key], key));
  if (missingMarkerFile) {
    file = missingMarkerFile;
    view = 'practice';
    renderAll();
    Utils.toast('Restaure a identificação do apoio automático antes de baixar o projeto.');
    setTimeout(() => $('#restoreSupportMarker')?.focus(), 0);
    return;
  }
  if (projectIsIncomplete()) openDownloadWarning(action, trigger);
  else action(false);
}

function progressReadme(downloadOrder) {
  const lines = [
    `${exercise().titulo} - PROJETO EM ANDAMENTO`,
    '',
    'Este ZIP foi baixado antes da validação completa da atividade.',
    'Ele preserva exatamente o código digitado pelo aluno, inclusive arquivos vazios, incompletos e letras maiúsculas/minúsculas.',
    '',
    'Situação dos arquivos:'
  ];
  downloadOrder.forEach(key => {
    const content = projectContent(key);
    const editable = order.includes(key);
    const status = !String(content || '').trim() ? 'vazio' : (editable && !state.done[key] ? 'ainda não validado' : 'presente');
    lines.push(`- ${physicalPath(key)}: ${status}`);
  });
  lines.push('', 'Próximos passos:', '- Continue editando os arquivos no VS Code ou nesta plataforma.', '- Teste o projeto no navegador.', '- Valide novamente antes de concluir e entregar.', '', `Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  return lines.join('\n');
}

function downloadProject(forceIncomplete = false) {
  const files = {};
  const downloadOrder = exercise().ordemDownloads || Object.keys(exercise().arquivos || {});
  downloadOrder.forEach(key => { files[physicalPath(key)] = projectContent(key); });
  const incomplete = forceIncomplete || projectIsIncomplete();
  if (incomplete) files['LEIA-ME-PROGRESSO.txt'] = progressReadme(downloadOrder);
  const autocomplete = autocompleteMetadata();
  if (autocomplete.utilizado) files['autocompletar.json'] = JSON.stringify(autocomplete, null, 2);
  if (state.completion?.evidence) {
    const evidence = { ...state.completion.evidence };
    delete evidence.html;
    files['evidencia.json'] = JSON.stringify(evidence, null, 2);
    files['evidencia.html'] = state.completion.evidence.html;
  }
  const suffix = incomplete ? '-EM-ANDAMENTO' : '';
  const name = `${workspaceRootName()}${suffix}.zip`;
  Utils.downloadBlob(name, Utils.zipStore(files));
  window.AppAuth?.log('projeto_zip_baixado', { nome: name, incompleto: Boolean(suffix) });
}


function markPartUnderstood() {
  state.understood[file] = Math.max(state.understood[file] || 0, explainStep + 1);
  window.AppAuth?.log('parte_compreendida', { arquivo: file, parte: explainStep + 1 });
  save();
  if (isFrozenExercise01()) {
    Utils.toast('Compreensão registrada. Nenhum código foi inserido no editor.');
    nextExplain();
    return;
  }
  Utils.toast('Compreensão registrada. Agora pratique este trecho digitando manualmente.');
  $('#practiceCurrentPart')?.focus();
}

function practiceCurrentPart() {
  const steps = exercise().passos[file] || [];
  const selected = steps[explainStep];
  state.explained[file] = Math.max(state.explained[file] || 0, explainStep + 1);
  state.activity[file].lastInteractionAt = Date.now();
  referenceMode = 'excerpt';
  practiceReferenceStep = explainStep;
  window.AppAuth?.log('pratica_trecho_iniciada', { arquivo: file, parte: explainStep + 1, linhas: selected?.linhas || null });
  save();
  setView('practice');
}

function returnToTutorial(origin) {
  state.activity[file].tutorialReturns = (state.activity[file].tutorialReturns || 0) + 1;
  state.activity[file].lastInteractionAt = Date.now();
  window.AppAuth?.log('tutorial_reaberto', { arquivo: file, origem: origin });
  save();
  setView('explain');
}

function registerInteraction() {
  if (!state.activity?.[file]) return;
  state.activity[file].lastInteractionAt = Date.now();
}

function registerActivity(type) {
  const activity = state.activity[file] || (state.activity[file] = defaultActivityState());
  activity.lastInteractionAt = Date.now();
  if (type === 'execution') activity.executions = (activity.executions || 0) + 1;
  if (type === 'hint') activity.hintsUsed = (activity.hintsUsed || 0) + 1;
  scheduleSave();
}

function trackActiveTime() {
  if (!state.activity?.[file] || document.visibilityState !== 'visible' || view !== 'practice') return;
  const activity = state.activity[file];
  if (Date.now() - (activity.lastInteractionAt || 0) > 60000) return;
  activity.activeSeconds = (activity.activeSeconds || 0) + 1;
  activitySaveTicks += 1;
  if (activitySaveTicks % 15 === 0) scheduleSave();
  if (activitySaveTicks % 5 === 0) renderSupportPanel();
}

function currentSupportBlocks() {
  // Exercício 01 mantém a experiência pedagógica já aplicada; somente correções técnicas são permitidas. Demais exercícios seguem a progressão atual.
  return [];
}

function supportEligibility(block) {
  return AutoCompleteSupport.eligibility({
    exercise: exercise(),
    file,
    block,
    activity: state.activity[file],
    attempts: state.attempts[file],
    code: $('#studentEditor')?.value ?? state.answers[file],
    username: window.AppAuth?.currentUser?.()?.username || ''
  });
}

function renderSupportPanel() {
  const panel = $('#supportPanel');
  if (!panel) return;
  const blocks = currentSupportBlocks();
  const support = state.support[file] || defaultSupportState();
  const phase = Number(exercise().fasePedagogica || exercise().numero || 0);
  $('#supportPhase').textContent = `Fase pedagógica ${phase}`;
  const button = $('#openAutocomplete');
  button.hidden = blocks.length === 0;
  $('#undoAutocomplete').hidden = !support.activeBlocks?.length;
  $('#reviewAutocomplete').hidden = !support.activeBlocks?.length || support.reviewConfirmed;
  $('#restoreSupportMarker').hidden = !support.markerMissing;

  if (!blocks.length) {
    $('#supportBadge').textContent = String(file).toLowerCase() === 'js' ? 'digitação obrigatória' : 'sem bloco automático';
    $('#supportBadge').className = 'chip info';
    $('#supportStatusText').textContent = String(file).toLowerCase() === 'js'
      ? 'A lógica JavaScript deve ser digitada integralmente. Use o tutorial, as dicas e os comentários orientadores.'
      : 'Nenhum bloco de apoio automático foi configurado para este arquivo porque ele representa o objetivo principal da atividade.';
    $('#supportSignals').innerHTML = '';
    return;
  }

  const candidate = blocks.find(block => !support.activeBlocks?.some(active => active.id === block.id)) || blocks[0];
  const eligibility = supportEligibility(candidate);
  button.disabled = !eligibility.unlocked || support.activeBlocks?.some(active => active.id === candidate.id);
  button.title = eligibility.reason;
  $('#supportBadge').textContent = support.activeBlocks?.length ? 'apoio utilizado' : eligibility.unlocked ? 'disponível' : 'bloqueado';
  $('#supportBadge').className = `chip ${support.activeBlocks?.length ? 'warning' : eligibility.unlocked ? 'success' : 'info'}`;
  $('#supportStatusText').textContent = support.markerMissing
    ? 'A marcação do apoio foi removida do arquivo. A validação ficará bloqueada até a identificação ser restaurada.'
    : support.activeBlocks?.length
      ? `Trecho inserido: ${support.activeBlocks.map(item => item.title).join(', ')}. ${support.reviewConfirmed ? 'Revisão de compreensão concluída.' : 'Revise o trecho antes de validar.'}`
      : eligibility.reason;
  $('#supportSignals').innerHTML = (eligibility.signals || []).map(item => `<li class="${item.met ? 'met' : 'pending'}">${item.met ? '✓' : '○'} ${Utils.escapeHtml(item.label)}</li>`).join('');
}

function openAutocompleteModal() {
  Utils.toast('Autocompletar desativado. Observe a referência e digite o código manualmente.');
}

function selectedAutocompleteBlock() {
  const id = $('#autocompleteBlock')?.value || autocompleteSelection;
  return currentSupportBlocks().find(block => block.id === id) || currentSupportBlocks()[0];
}

function renderAutocompleteModal() {
  const block = selectedAutocompleteBlock();
  if (!block) return;
  autocompleteSelection = block.id;
  const eligibility = supportEligibility(block);
  $('#autocompletePhaseBadge').textContent = `Fase pedagógica ${exercise().fasePedagogica || exercise().numero}`;
  $('#autocompleteBlockDetails').innerHTML = `<strong>${Utils.escapeHtml(block.title)}</strong><p>${Utils.escapeHtml(block.description)}</p><p><strong>Arquivo:</strong> <code>${Utils.escapeHtml(physicalPath(file))}</code></p><p><strong>Linhas aproximadas:</strong> ${String(block.content || '').split('\n').length}</p><code>${Utils.escapeHtml(String(block.content || '').split('\n').slice(0, 12).join('\n'))}${String(block.content || '').split('\n').length > 12 ? '\n...' : ''}</code>`;
  $('#autocompleteEligibility').innerHTML = `<strong>${eligibility.unlocked ? 'Ajuda liberada' : 'Ajuda ainda bloqueada'}</strong><p>${Utils.escapeHtml(eligibility.reason)}</p>${(eligibility.signals || []).length ? `<ul>${eligibility.signals.map(item => `<li>${item.met ? '✓' : '○'} ${Utils.escapeHtml(item.label)}</li>`).join('')}</ul>` : ''}`;
  $('#confirmAutocomplete').disabled = !eligibility.unlocked;
}

function closeAutocompleteModal() {
  const modal = $('#autocompleteModal');
  if (modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  setModalBackgroundInert(false);
  $('#openAutocomplete')?.focus();
}

function setModalBackgroundInert(value) {
  ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => value ? element.setAttribute('inert', '') : element.removeAttribute('inert')));
}

function confirmAutocomplete() {
  Utils.toast('Autocompletar desativado nesta versão.');
}

function undoAutocomplete() {
  const support = state.support[file] || defaultSupportState();
  const event = support.activeBlocks?.pop();
  if (!event) return;
  state.answers[file] = event.previousCode;
  state.activity[file].executions = 0;
  state.execution[file] = ExecutionFlow.invalidate(state.execution[file]);
  resetCompletionAfterEdit();
  $('#studentEditor').value = event.previousCode;
  support.history.push({ action: 'undo', blockId: event.blockId, title: event.title, at: new Date().toISOString(), platformVersion: window.APP_CONFIG?.version || '' });
  support.reviewConfirmed = false;
  support.markerMissing = false;
  state.origin[file] = support.activeBlocks.length ? 'misto' : 'digitado';
  state.done[file] = false;
  state.completed = false;
  window.AppAuth?.log('autocompletar_desfeito', { arquivo: file, bloco: event.blockId });
  save();
  syncEditor();
  renderPreviewStale();
  renderExecutionPanel();
  renderOrigin();
  renderCodeHealth();
  renderSupportPanel();
  Utils.toast('Preenchimento automático desfeito. O histórico de uso foi preservado.');
}

function restoreSupportMarker() {
  const support = state.support[file] || defaultSupportState();
  if (!support.activeBlocks?.length) return;
  const restored = AutoCompleteSupport.addMarker($('#studentEditor').value, file);
  $('#studentEditor').value = restored;
  state.answers[file] = restored;
  state.activity[file].executions = 0;
  state.execution[file] = ExecutionFlow.invalidate(state.execution[file]);
  resetCompletionAfterEdit();
  support.markerMissing = false;
  support.history.push({ action: 'marker-restored', at: new Date().toISOString(), file });
  save();
  syncEditor();
  renderSupportPanel();
  Utils.toast('Identificação do apoio automático restaurada.');
}

function openAutocompleteReview() {
  const support = state.support[file] || defaultSupportState();
  if (!support.activeBlocks?.length) return;
  const last = support.activeBlocks[support.activeBlocks.length - 1];
  $('#autocompleteReviewDetails').innerHTML = `<strong>${Utils.escapeHtml(last.title)}</strong><p>${Utils.escapeHtml(currentSupportBlocks().find(block => block.id === last.blockId)?.description || 'Revise o trecho inserido e relacione-o ao objetivo da atividade.')}</p><p><strong>O que ainda falta:</strong> compreender o trecho, completar a parte principal, atualizar o preview e validar.</p>`;
  document.querySelectorAll('input[name="supportReviewAnswer"]').forEach(input => { input.checked = false; });
  $('#autocompleteReviewFeedback').textContent = '';
  $('#autocompleteReviewFeedback').removeAttribute('data-state');
  const modal = $('#autocompleteReviewModal');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  setModalBackgroundInert(true);
  setTimeout(() => document.querySelector('input[name="supportReviewAnswer"]')?.focus(), 0);
}

function closeAutocompleteReview() {
  const modal = $('#autocompleteReviewModal');
  if (modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  setModalBackgroundInert(false);
  $('#reviewAutocomplete')?.focus();
}

function confirmAutocompleteReview() {
  const answer = document.querySelector('input[name="supportReviewAnswer"]:checked')?.value;
  if (answer !== 'no') {
    $('#autocompleteReviewFeedback').textContent = 'O apoio automático não conclui a atividade. Você ainda precisa compreender, executar e validar.';
    $('#autocompleteReviewFeedback').dataset.state = 'error';
    return;
  }
  state.support[file].reviewConfirmed = true;
  state.support[file].history.push({ action: 'review-confirmed', at: new Date().toISOString(), file });
  window.AppAuth?.log('autocompletar_revisado', { arquivo: file });
  save();
  renderSupportPanel();
  $('#autocompleteReviewFeedback').textContent = 'Revisão registrada. Continue a atividade e teste o resultado.';
  $('#autocompleteReviewFeedback').dataset.state = 'success';
  setTimeout(closeAutocompleteReview, 450);
}

function resetCompletionAfterEdit() {
  state.completion = ExecutionFlow.defaultCompletionState();
  state.completed = false;
}

function allFilesExecutionReady() {
  return order.every(key => ExecutionFlow.readiness(state.execution[key], exercise(), key, JSON.stringify(Object.fromEntries(order.map(item => [item, state.answers[item] ?? ''])))).ok);
}

function renderDeliveryGuide() {
  const list = $('#deliveryGuideSteps');
  if (!list) return;
  const currentCode = String($('#studentEditor')?.value ?? state.answers[file] ?? '');
  const readiness = ExecutionFlow.readiness(state.execution[file], exercise(), file, projectSnapshot());
  const allValidated = order.every(key => state.done[key]);
  const completed = Boolean(state.completion?.confirmedAt);
  const evidence = Boolean(state.completion?.evidence);
  const steps = [
    { label: `Digitar ${physicalPath(file)}`, done: Boolean(currentCode.trim()) },
    { label: 'Executar o código atual', done: ['success'].includes(state.execution[file]?.status) && state.execution[file]?.hashMatches !== false },
    { label: 'Testar o comportamento no preview', done: readiness.ok },
    { label: `Validar ${physicalPath(file)}`, done: Boolean(state.done[file]) },
    { label: 'Validar todos os arquivos do exercício', done: allValidated },
    { label: 'Concluir a atividade', done: completed },
    { label: 'Gerar evidência e preparar a entrega', done: evidence }
  ];
  list.innerHTML = steps.map((item, index) => `<li class="${item.done ? 'done' : ''}"><span>${item.done ? '✓' : index + 1}</span><strong>${Utils.escapeHtml(item.label)}</strong></li>`).join('');
  let next = steps.find(item => !item.done)?.label || 'Atividade pronta para baixar e entregar.';
  const supportFiles = (exercise().arquivosApoio || []).map(key => physicalPath(key));
  const giftFiles = (exercise().arquivosPresentes || []).map(key => physicalPath(key));
  const prefix = order.length > 1 ? `Arquivo ${fileIndex() + 1} de ${order.length}. ` : '';
  const supportNote = supportFiles.length ? ` Arquivos de apoio no ZIP: ${supportFiles.join(', ')}.` : '';
  const giftNote = giftFiles.length ? ` Presente já incluído no projeto: ${giftFiles.join(', ')}.` : '';
  $('#deliveryNextStep').textContent = steps.every(item => item.done) ? `${prefix}Pronto para baixar o ZIP e abrir o Classroom.${giftNote}${supportNote}` : `${prefix}Próximo passo: ${next}.${giftNote}${supportNote}`;
}

function renderFinishButton() {
  const ready = order.every(key => state.done[key]) && order.every(key => {
    return ExecutionFlow.readiness(state.execution[key], exercise(), key, projectSnapshot(key)).ok;
  });
  $('#finishActivity').hidden = !ready || Boolean(state.completion?.confirmedAt);
}

function finishActivity() {
  const integrity = projectIntegrityIssues();
  if (integrity.length) {
    Utils.toast(`Corrija o projeto antes de concluir: ${integrity[0].detail}`);
    const affected = integrity[0].fileKey;
    if (affected && order.includes(affected)) { file = affected; view = 'practice'; renderAll(); }
    return;
  }
  if (!order.every(key => state.done[key])) {
    Utils.toast('Valide todos os arquivos antes de concluir a atividade.');
    return;
  }
  const pendingExecution = order.find(key => {
    return !ExecutionFlow.readiness(state.execution[key], exercise(), key, projectSnapshot(key)).ok;
  });
  if (pendingExecution) {
    file = pendingExecution;
    view = 'practice';
    renderAll();
    Utils.toast('Execute novamente e conclua as interações obrigatórias antes de finalizar.');
    return;
  }
  const pendingReview = order.find(key => state.support[key]?.activeBlocks?.length && (!state.support[key].reviewConfirmed || state.support[key].markerMissing));
  if (pendingReview) {
    file = pendingReview;
    renderAll();
    Utils.toast('Revise e identifique corretamente o apoio automático antes de concluir.');
    return;
  }
  openCompletionConfirm();
}

function openCompletionConfirm() {
  const modal = $('#completionConfirmModal');
  $('#completionConfirmCheck').checked = false;
  $('#completionConfirmFiles').innerHTML = order.map(key => {
    const execution = state.execution[key];
    return `<li class="done">${Utils.escapeHtml(physicalPath(key))}: execução ${Utils.escapeHtml(execution.validatedExecutionId || execution.executionId || '')}</li>`;
  }).join('');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  setModalBackgroundInert(true);
  setTimeout(() => $('#completionConfirmCheck')?.focus(), 0);
}

function closeCompletionConfirm() {
  const modal = $('#completionConfirmModal');
  if (modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  setModalBackgroundInert(false);
  $('#finishActivity')?.focus();
}

function confirmCompletion() {
  if (!$('#completionConfirmCheck').checked) {
    Utils.toast('Marque a confirmação depois de testar o resultado atual.');
    $('#completionConfirmCheck').focus();
    return;
  }
  state.completion = {
    ...ExecutionFlow.defaultCompletionState(),
    confirmationId: `CONF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    confirmedAt: new Date().toISOString(),
    evidence: null
  };
  state.completed = false;
  save();
  window.AppAuth?.log('conclusao_confirmada', { numero: exercise().numero, confirmacao: state.completion.confirmationId });
  closeCompletionConfirm();
  view = 'completion';
  renderAll();
  $('#completion').scrollIntoView({ behavior: 'smooth' });
}

async function generateEvidence() {
  if (!state.completion?.confirmedAt) {
    Utils.toast('Confirme a conclusão antes de gerar a evidência.');
    return;
  }
  const button = $('#generateEvidence');
  button.disabled = true;
  button.textContent = 'Gerando evidência...';
  try {
    const contents = Object.fromEntries(order.map(key => [key, state.answers[key] ?? '']));
    const evidence = await ExecutionFlow.buildEvidence({
      exercise: exercise(),
      order,
      fileNames: Object.fromEntries(workspaceKeys().map(key => [key, physicalPath(key)])),
      contents,
      executions: state.execution,
      completion: state.completion,
      autocomplete: autocompleteMetadata(),
      user: window.AppAuth?.currentUser?.() || {},
      version: window.APP_CONFIG?.version || ''
    });
    state.completion.evidence = evidence;
    state.completed = true;
    save();
    window.AppAuth?.log('evidencia_gerada', { numero: exercise().numero, evidencia: evidence.id, hash: evidence.projectSha256 });
    renderCompletion();
    renderProgress();
    Utils.toast('Evidência gerada e vinculada ao código validado.');
  } catch (error) {
    Utils.toast('Não foi possível gerar a evidência. O código continua salvo.');
  } finally {
    button.disabled = false;
    button.textContent = state.completion?.evidence ? 'Gerar novamente' : 'Gerar evidência';
  }
}

function evidenceFileBase() {
  return `evidencia-ex${String(exercise().numero).padStart(2, '0')}-${state.completion?.evidence?.id || 'pendente'}`;
}

function downloadEvidenceJson() {
  const evidence = state.completion?.evidence;
  if (!evidence) return;
  const copy = { ...evidence };
  delete copy.html;
  Utils.download(`${evidenceFileBase()}.json`, JSON.stringify(copy, null, 2), 'application/json;charset=utf-8');
  window.AppAuth?.log('evidencia_baixada', { formato: 'json', evidencia: evidence.id });
}

function downloadEvidenceHtml() {
  const evidence = state.completion?.evidence;
  if (!evidence) return;
  Utils.download(`${evidenceFileBase()}.html`, evidence.html, 'text/html;charset=utf-8');
  window.AppAuth?.log('evidencia_baixada', { formato: 'html', evidencia: evidence.id });
}

function autocompleteMetadata() {
  const files = {};
  let utilizado = false;
  order.forEach(key => {
    const support = state.support[key] || defaultSupportState();
    if (!support.everUsed && !support.history?.length) return;
    utilizado = true;
    files[physicalPath(key)] = {
      utilizado: support.everUsed,
      blocosAtivos: (support.activeBlocks || []).map(item => ({
        id: item.blockId,
        titulo: item.title,
        linhasInseridas: item.linesInserted,
        percentualAproximado: item.approximatePercentage,
        origem: item.origin,
        motivo: item.reason,
        dataHora: item.insertedAt
      })),
      revisaoConfirmada: Boolean(support.reviewConfirmed),
      identificacaoPresente: !support.activeBlocks?.length || AutoCompleteSupport.hasMarker(state.answers[key], key),
      historico: (support.history || []).map(item => {
        const copy = { ...item };
        delete copy.previousCode;
        return copy;
      })
    };
  });
  return {
    schemaVersion: 1,
    utilizado,
    aluno: window.AppAuth?.currentUser?.()?.username || '',
    turma: '3º DS manhã',
    disciplina: 'Programação no Desenvolvimento de Sistemas',
    exercicio: exercise().numero,
    fasePedagogica: exercise().fasePedagogica || exercise().numero,
    versaoPlataforma: window.APP_CONFIG?.version || '',
    geradoEm: new Date().toISOString(),
    arquivos: files
  };
}

function updatePhase() {
  if (view === 'explain') {
    $('#phaseBadge').textContent = `${physicalPath(file)} · tutorial`;
    $('#phaseTitle').textContent = 'Entenda antes de digitar';
    $('#phaseText').textContent = 'Veja o código em partes, observe as linhas e o resultado destacados e avance no seu ritmo.';
  } else if (view === 'full') {
    $('#phaseBadge').textContent = `${physicalPath(file)} · referência protegida`;
    $('#phaseTitle').textContent = 'Construa com autonomia';
    $('#phaseText').textContent = 'A referência completa fica disponível somente para leitura na prática. Digite o código manualmente e teste o resultado.';
  } else if (view === 'practice') {
    $('#phaseBadge').textContent = `${physicalPath(file)} · prática`;
    $('#phaseTitle').textContent = 'Digite, teste e valide';
    $('#phaseText').textContent = 'Use o editor com linhas, acompanhe o preview e valide o arquivo para liberar a próxima etapa.';
  } else {
    $('#phaseBadge').textContent = 'conclusão';
    $('#phaseTitle').textContent = 'Envie a atividade';
    $('#phaseText').textContent = state.completion?.evidence ? 'Baixe os arquivos e a evidência antes de abrir o Classroom.' : 'Gere a evidência verificável antes de abrir o Classroom.';
  }
}

function renderProgress() {
  const completedFiles = order.filter(key => state.done[key]).length;
  const fileWeight = 100 / Math.max(1, order.length);
  let percentage = completedFiles * fileWeight;
  if (!state.done[file]) {
    const steps = exercise().passos[file].length;
    const explained = Math.min(state.explained[file] || 0, steps);
    const phasePart = view === 'full' ? 0.6 : view === 'practice' ? 0.85 : steps ? (explained / steps) * 0.5 : 0;
    percentage = Math.max(percentage, fileIndex() * fileWeight + phasePart * fileWeight);
  }
  // 100% representa aprendizagem/conclusão da atividade. A evidência é um artefato de entrega e não deve prender a barra em 98%.
  if (state.completed || state.completion?.confirmedAt) percentage = 100;
  else if (view === 'completion') percentage = 98;
  else if (order.every(key => state.done[key])) percentage = Math.min(95, percentage);
  percentage = Math.min(100, Math.round(percentage));
  $('#progressBar').style.width = `${percentage}%`;
  $('#progressText').textContent = `${percentage}%`;
  updatePhase();
}

function renderCompletion() {
  $('#completionFolder').textContent = workspaceRootName();
  const evidence = state.completion?.evidence;
  $('#completionStatus').textContent = evidence ? 'Atividade concluída · evidência gerada' : 'Atividade 100% concluída · evidência pendente para entrega';
  $('#completionStatus').className = `chip ${evidence ? 'success' : 'warning'}`;
  $('#evidenceChecklistItem').textContent = evidence ? '✓ Evidência verificável gerada' : '○ Gerar a evidência verificável';
  $('#evidenceSummary').textContent = evidence
    ? 'A evidência corresponde ao código validado, às execuções e às interações registradas.'
    : 'Gere a evidência para relacionar código, execução, validação, versão e aluno.';
  $('#downloadEvidenceJson').disabled = !evidence;
  $('#downloadEvidenceHtml').disabled = !evidence;
  $('#completionClassroom').disabled = !evidence;
  $('#generateEvidence').textContent = evidence ? 'Gerar novamente' : 'Gerar evidência';
  $('#evidenceDetails').innerHTML = evidence
    ? `<dt>ID</dt><dd>${Utils.escapeHtml(evidence.id)}</dd><dt>Hash do projeto</dt><dd>${Utils.escapeHtml(evidence.projectSha256)}</dd><dt>Gerada em</dt><dd>${Utils.escapeHtml(evidence.geradaEm)}</dd>`
    : '<dt>Status</dt><dd>Evidência ainda não gerada.</dd>';
  const actions = $('#downloadActions');
  if (actions) {
    const downloadOrder = exercise().ordemDownloads || Object.keys(exercise().arquivos || {});
    actions.innerHTML = `${downloadOrder.map(key => `<button data-download="${key}">Baixar ${Utils.escapeHtml(physicalPath(key))}</button>`).join('')}<button class="success" data-download-project>Baixar projeto ZIP</button>`;
    actions.querySelectorAll('[data-download]').forEach(button => button.addEventListener('click', () => requestDownload(() => downloadFile(button.dataset.download))));
    actions.querySelector('[data-download-project]')?.addEventListener('click', () => requestDownload(downloadProject));
  }
  renderViews();
}

function downloadFile(key) {
  const content = projectContent(key);
  const types = { html: 'text/html;charset=utf-8', css: 'text/css;charset=utf-8', js: 'text/javascript;charset=utf-8', py: 'text/x-python;charset=utf-8', json: 'application/json;charset=utf-8', md: 'text/markdown;charset=utf-8' };
  const inferredType = String(key).toLowerCase().startsWith('html') ? types.html : (types[key] || 'text/plain;charset=utf-8');
  Utils.download(physicalBaseName(key), content, inferredType);
  window.AppAuth?.log('arquivo_baixado', { arquivo: key, nome: physicalPath(key), vazio: !content.length });
}


function renderWorkspace() {
  const panel = $('#workspacePanel');
  if (!panel) return;
  $('#workspaceRoot').value = workspaceRootName();
  const tree = $('#workspaceTree');
  const folders = [...new Set([...(state.workspace?.folders || []), ...workspaceKeys().map(key => physicalPath(key).includes('/') ? physicalPath(key).split('/').slice(0,-1).join('/') : '').filter(Boolean)])].sort();
  const folderHtml = folders.map(folder => `<div class="workspace-folder">▾ ${Utils.escapeHtml(folder)}/</div>`).join('');
  const fileHtml = workspaceKeys().map(key => `<div class="workspace-file-row ${key === file ? 'active' : ''}" data-workspace-key="${Utils.escapeHtml(key)}"><span class="workspace-file-name">${Utils.escapeHtml(physicalPath(key))}</span><button class="secondary compact" data-workspace-open="${Utils.escapeHtml(key)}">Abrir</button><button class="ghost compact" data-workspace-rename="${Utils.escapeHtml(key)}">Renomear</button></div>`).join('');
  tree.innerHTML = folderHtml + fileHtml;
  tree.querySelectorAll('[data-workspace-open]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.workspaceOpen;
    if (!order.includes(key)) { showWorkspaceSupportFile(key); return; }
    supportFileOpen = null; file = key; view = 'practice'; renderAll(); VSCodeEditor?.focus?.();
  }));
  tree.querySelectorAll('[data-workspace-rename]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.workspaceRename;
    const next = prompt('Novo nome ou caminho relativo do arquivo:', physicalPath(key));
    if (next == null) return;
    const result = renameWorkspaceFile(key, next);
    Utils.toast(result.message);
  }));
  VSTerminal?.prompt?.();
}

function renderSupportFileReference(key) {
  const panel = document.querySelector('.reference-practice');
  if (!panel || !workspaceKeys().includes(key)) return;
  panel.classList.remove('panel-collapsed');
  document.querySelector('.lab-grid')?.classList.remove('reference-hidden');
  Utils.renderCode($('#referenceFull'), projectContent(key), key, null, false);
  const isGift = (exercise().arquivosPresentes || []).includes(key);
  $('#referenceFileName').textContent = `${physicalPath(key)} · ${isGift ? 'arquivo presente' : 'arquivo de apoio'} · somente leitura`;
  if ($('#referenceModeLabel')) $('#referenceModeLabel').textContent = 'arquivo completo · somente leitura';
  if ($('#referenceHelp')) $('#referenceHelp').textContent = isGift
    ? '🎁 Este arquivo foi entregue completo e continua visível para você estudar. Ele já faz parte do preview e do ZIP; não precisa ser digitado nem validado.'
    : 'Este arquivo foi fornecido pelo sistema e continua visível para consulta. Ele faz parte do projeto/ZIP, mas não entra na validação principal quando não for sua produção.';
  if ($('#toggleReferenceMode')) { $('#toggleReferenceMode').hidden = true; }
  $('#toggleReference').textContent = 'Ocultar referência';
}

function showWorkspaceSupportFile(key) {
  supportFileOpen = key;
  renderSupportFileReference(key);
  renderTabs();
  Utils.toast(`${physicalPath(key)} aberto em somente leitura.`);
}

function toggleExplorer() {
  const panel = $('#workspacePanel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  $('#toggleExplorer').textContent = panel.hidden ? 'Explorador' : 'Ocultar explorador';
  if (!panel.hidden) renderWorkspace();
}

function toggleReferencePanel() {
  const panel = document.querySelector('.reference-practice');
  panel?.classList.toggle('panel-collapsed');
  document.querySelector('.lab-grid')?.classList.toggle('reference-hidden', panel?.classList.contains('panel-collapsed'));
  $('#toggleReference').textContent = panel?.classList.contains('panel-collapsed') ? 'Abrir referência' : 'Ocultar referência';
}

function togglePreviewPanel() {
  const panel = document.querySelector('.practice-preview');
  panel?.classList.toggle('panel-collapsed');
  $('#togglePreview').textContent = panel?.classList.contains('panel-collapsed') ? 'Abrir preview' : 'Ocultar preview';
}

function renameWorkspaceRoot() {
  const next = sanitizeWorkspaceName($('#workspaceRoot').value, workspaceRootName()).replaceAll('/', '-');
  state.workspace.rootName = next;
  scheduleSave(); renderWorkspace(); renderCompletion();
  window.AppAuth?.log('workspace_pasta_renomeada', { nome: next });
  Utils.toast(`Pasta principal renomeada para ${next}.`);
}

function createWorkspaceFolder() {
  const name = prompt('Nome da nova pasta:');
  if (name == null) return;
  const result = terminalMkdir(name);
  Utils.toast(result.message); renderWorkspace();
}

function renameWorkspaceFile(key, newPath) {
  if (!workspaceKeys().includes(key)) return { ok:false, message:'Arquivo não reconhecido.' };
  const clean = sanitizeWorkspaceName(newPath, physicalPath(key));
  const duplicate = workspaceKeys().find(other => other !== key && physicalPath(other).toLowerCase() === clean.toLowerCase());
  if (duplicate) return { ok:false, message:'Já existe um arquivo com esse caminho.' };
  const captured = captureWorkspaceReferences();
  const old = physicalPath(key);
  state.workspace.files[key] = clean;
  if (clean.includes('/')) {
    const folder = clean.split('/').slice(0,-1).join('/');
    if (folder && !state.workspace.folders.includes(folder)) state.workspace.folders.push(folder);
  }
  const updatedReferences = rewriteCapturedReferences(captured);
  order.forEach(editableKey => {
    state.done[editableKey] = false;
    state.execution[editableKey] = ExecutionFlow.invalidate(state.execution[editableKey]);
  });
  resetCompletionAfterEdit();
  scheduleSave(); renderTabs(); renderPractice(); renderWorkspace(); renderCompletion(); renderDeliveryGuide();
  window.AppAuth?.log('workspace_arquivo_renomeado', { arquivo:key, anterior:old, atual:clean, referenciasAtualizadas:updatedReferences });
  return { ok:true, message:`Arquivo atualizado: ${old} -> ${clean}.${updatedReferences ? ` ${updatedReferences} arquivo(s) tiveram referências relativas atualizadas.` : ' Confira as referências relativas antes de exportar.'}` };
}

function listWorkspace() {
  const folders = (state.workspace?.folders || []).map(folder => `[DIR]  ${folder}`);
  const files = workspaceKeys().map(key => `[ARQ]  ${physicalPath(key)}`);
  return [...folders, ...files];
}

function treeWorkspace() {
  const lines = [`${workspaceRootName()}/`];
  workspaceKeys().forEach((key, index) => lines.push(`${index === workspaceKeys().length - 1 ? '└──' : '├──'} ${physicalPath(key)}`));
  (state.workspace?.folders || []).filter(folder => !workspaceKeys().some(key => physicalPath(key).startsWith(`${folder}/`))).forEach(folder => lines.push(`└── ${folder}/`));
  return lines;
}

function readWorkspaceFile(path) {
  const key = workspaceKeyByPath(path);
  return key ? projectContent(key) : null;
}

function terminalRenameFile(path, newPath) {
  const key = workspaceKeyByPath(path);
  if (!key) return { ok:false, message:'Arquivo não encontrado.' };
  const result = renameWorkspaceFile(key, newPath);
  renderWorkspace();
  return result;
}

function terminalMkdir(folder) {
  const clean = sanitizeWorkspaceName(folder, '').replace(/\/$/, '');
  if (!clean) return { ok:false, message:'Informe um nome de pasta válido.' };
  if (!state.workspace.folders.includes(clean)) state.workspace.folders.push(clean);
  scheduleSave(); renderWorkspace();
  window.AppAuth?.log('workspace_pasta_criada', { pasta:clean });
  return { ok:true, message:`Pasta criada no projeto virtual: ${clean}/` };
}

function terminalCd(folder) {
  const clean = String(folder || '').trim();
  if (!clean || clean === '.') return { ok:true, message:'' };
  if (clean === '..') { state.workspace.cwd = ''; scheduleSave(); return { ok:true, message:'' }; }
  const target = sanitizeWorkspaceName(clean, '');
  const exists = (state.workspace.folders || []).includes(target) || workspaceKeys().some(key => physicalPath(key).startsWith(`${target}/`));
  if (!exists) return { ok:false, message:'A pasta não existe no projeto virtual.' };
  state.workspace.cwd = target; scheduleSave();
  return { ok:true, message:`Pasta atual: ${target}` };
}

function openInfo(type) {
  if (type === 'contexto') AppShell.openInfo('Contexto do exercício', Utils.contextHtml(exercise()));
  if (type === 'dicas') { registerActivity('hint'); AppShell.openInfo('Dicas para realizar a atividade', Utils.tipsHtml(exercise())); renderSupportPanel(); }
  if (type === 'explicacao') {
    const currentStep = exercise().passos[file][explainStep] || exercise().passos[file][0];
    AppShell.openInfo('Explicação da parte atual', `<div class="drawer-section"><span class="chip">${Utils.escapeHtml(physicalPath(file))} · linhas ${currentStep.linhas[0]}–${currentStep.linhas[1]}</span><h3>${Utils.escapeHtml(currentStep.titulo)}</h3><p>${Utils.escapeHtml(currentStep.explicacao)}</p><p class="muted">Feche a gaveta para continuar o tutorial. Seu progresso não será perdido.</p></div>`);
  }
  if (type === 'termos') AppShell.openInfo('Termos e palavras do código', Utils.glossaryHtml(exercise()));
}

init();

let current = 0;
let file = '';
let explainStep = 0;
let view = 'explain';
let tutorialFunctions = [];
let state = {};
let lastActivityAt = Date.now();
let timerHandle = null;
let editorUiFrame = 0;
let previewUpdateTimer = 0;
let editorComposing = false;
let lastEditorLineCount = 0;
let previewRuntimeMessage = '';
let previewSourceMessage = '';
let previewRunId = 0;
let saveStateTimer = 0;
let lastValidationResult = null;
let diagnosticErrorLine = null;
let pendingWorkDownload = null;
let lastSaveError = null;
let lastDownloadTrigger = null;
let completionReadyAnnounced = false;
let pendingAutocomplete = null;
let autocompleteReturnFocus = null;
let manualPreviewRequestedRunId = null;
let lastSnapshotAt = 0;
let pythonSession = null;
let pythonRunToken = 0;
let previewExecutionBusy = false;
let previewExecutionTimer = 0;
let recoveredStateNotice = null;
let codeEditor = null;
let codeEditorSilent = false;
let codeEditorDiagnosticLine = null;
let referenceCodeEditor = null;
let vscodeGaugeTimer = 0;
let vscodeGaugeLast = null;
const EDITOR_FONT_DEFAULT = 15;
const EDITOR_FONT_MIN = 12;
const EDITOR_FONT_MAX = 22;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const exercise = () => EXERCICIOS[current];
const order = () => exercise()?.ordemArquivos || Object.keys(exercise()?.arquivos || {});
const language = key => exercise()?.linguagens?.[key] || key;
const STORAGE_SCHEMA_VERSION = 4;
const storagePrefix = () => window.APP_CONFIG?.storagePrefix || 'ds2sub';
const storageOwner = () => String(window.AppAuth?.currentUser?.()?.username || 'sem-usuario').replace(/[^a-z0-9._-]/gi, '_');
const storageContextId = () => `${activeDisciplineSlug()}::${exercise()?.codigo || exercise()?.numero || 'sem-exercicio'}`;
const storageKey = () => `${storagePrefix()}_${storageOwner()}_${exercise().codigo || exercise().numero}_state_v4`;
const legacyV3StorageKey = () => `${storagePrefix()}_${storageOwner()}_${exercise().codigo || exercise().numero}_state_v3`;
const legacyV2StorageKey = () => `${storagePrefix()}_${storageOwner()}_${exercise().codigo || exercise().numero}_state_v2`;
const legacyV3StorageBackupKey = () => `${legacyV3StorageKey()}_backup`;
const legacyV2StorageBackupKey = () => `${legacyV2StorageKey()}_backup`;
const storageBackupKey = () => `${storageKey()}_backup`;
const minimumSeconds = () => Number(exercise()?.tempoMinimoSegundos || window.APP_CONFIG?.minimumActiveSeconds || 300);

function blankPreviewDocument(message = 'Preview limpo. Digite o HTML para iniciar.') {
  const safeMessage = window.Utils?.escapeHtml ? Utils.escapeHtml(message) : String(message);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{color-scheme:light}body{margin:0;padding:28px;font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;color:#334155}main{max-width:640px;margin:auto;padding:24px;border:1px solid #d7e0ec;border-radius:14px;background:#fff}h1{margin:0 0 8px;font-size:22px}p{margin:0;line-height:1.6}</style></head><body><main><h1>Preview aguardando código</h1><p>${safeMessage}</p></main></body></html>`;
}

function resetTransientRuntime(message = 'Nenhum código anterior foi mantido no preview.') {
  clearTimeout(previewUpdateTimer);
  clearTimeout(previewExecutionTimer);
  previewUpdateTimer = 0;
  previewExecutionTimer = 0;
  previewRunId += 1;
  manualPreviewRequestedRunId = null;
  previewRuntimeMessage = '';
  previewSourceMessage = '';
  previewExecutionBusy = false;
  const frame = $('#studentPreview');
  if (frame) {
    frame.removeAttribute('data-project-hash');
    frame.srcdoc = blankPreviewDocument(message);
  }
  const messageNode = $('#previewMessage');
  if (messageNode) {
    messageNode.textContent = message;
    messageNode.dataset.state = 'pending';
  }
}

function activeDisciplineSlug() { return window.ACTIVE_DISCIPLINE || window.APP_CONFIG?.slug || 'frontend'; }
function disciplineEntry(slug) { return window.DISCIPLINES?.[slug] || window.DISCIPLINES?.frontend || null; }
function applyDiscipline(slug, persist = true) {
  const entry = disciplineEntry(slug);
  if (!entry || !Array.isArray(entry.exercises) || !entry.exercises.length) return false;
  window.ACTIVE_DISCIPLINE = slug in window.DISCIPLINES ? slug : 'frontend';
  window.EXERCICIOS = entry.exercises;
  window.APP_CONFIG = entry.config;
  if (persist) {
    try { localStorage.setItem('ds2sub_active_discipline', window.ACTIVE_DISCIPLINE); } catch (error) {}
  }
  const label = $('#studentCourseLabel');
  if (label) label.textContent = `2 DS Sub - ${entry.label} - Modo Aluno`;
  document.title = `Modo Aluno - 2DS Sub - ${entry.label}`;
  return true;
}
function populateExerciseSelector() {
  const selector = $('#studentExercise');
  if (!selector) return;
  selector.innerHTML = '';
  EXERCICIOS.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${item.codigo || String(item.numero).padStart(2, '0')} - ${item.nomeCurto}`;
    selector.append(option);
  });
  selector.value = String(Math.min(current, Math.max(0, EXERCICIOS.length - 1)));
}
function resetForDiscipline() {
  resetTransientRuntime('Disciplina alterada. O preview anterior foi descartado.');
  current = 0;
  file = order()[0] || '';
  explainStep = 0;
  view = 'explain';
  lastValidationResult = null;
  diagnosticErrorLine = null;
  loadEditorPreferences();
  load();
  populateExerciseSelector();
  renderAll();
  applyVsCodeMode();
  applyFocusMode();
  applyDrawerStates();
}


function editorPreferenceKey() { return `${storagePrefix()}_${storageOwner()}_editor_preferences_v1`; }
function editorModeFor(key = file) {
  const lang = language(key);
  return { html: 'htmlmixed', css: 'css', js: 'javascript', python: 'python', markdown: 'markdown', xml: 'xml', json: { name: 'javascript', json: true } }[lang] || null;
}
function editorValue() {
  if (codeEditor) return codeEditor.getValue();
  return $('#studentEditor')?.value || '';
}
function setEditorValue(value, { preserveCursor = false } = {}) {
  const text = String(value ?? '');
  const textarea = $('#studentEditor');
  if (textarea) textarea.value = text;
  if (!codeEditor) return;
  const cursor = preserveCursor ? codeEditor.getCursor() : null;
  codeEditorSilent = true;
  if (codeEditor.getValue() !== text) codeEditor.setValue(text);
  codeEditor.setOption('mode', editorModeFor(file));
  if (cursor) codeEditor.setCursor(cursor);
  codeEditorSilent = false;
  codeEditor.refresh();
}
function editorFocus(options = {}) {
  if (codeEditor) { codeEditor.focus(); return; }
  $('#studentEditor')?.focus(options);
}
function editorSelectionRange() {
  if (codeEditor) {
    const from = codeEditor.indexFromPos(codeEditor.getCursor('from'));
    const to = codeEditor.indexFromPos(codeEditor.getCursor('to'));
    return { start: from, end: to };
  }
  const textarea = $('#studentEditor');
  return { start: textarea?.selectionStart || 0, end: textarea?.selectionEnd || 0 };
}
function normalizeCommonTypingSymbols(value) {
  return String(value ?? '')
    .replace(/[“”„‟]/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/ /g, ' ')
    .replace(/［/g, '[').replace(/］/g, ']')
    .replace(/（/g, '(').replace(/）/g, ')')
    .replace(/｛/g, '{').replace(/｝/g, '}')
    .replace(/＜/g, '<').replace(/＞/g, '>')
    .replace(/＝/g, '=').replace(/；/g, ';').replace(/：/g, ':').replace(/，/g, ',');
}

function insertEditorSymbol(symbol) {
  const value = editorValue();
  const { start, end } = editorSelectionRange();
  const next = value.slice(0, start) + symbol + value.slice(end);
  setEditorValue(next);
  setEditorSelectionRange(start + symbol.length);
  handleEditorInput();
}

function renderEditorMetrics() {
  const metrics = $('#editorMetrics');
  if (!metrics) return;
  const value = editorValue();
  const characters = value.length;
  const lines = Math.max(1, value.split('\n').length);
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const minimum = language(file) === 'markdown' ? Number(exercise()?.validacao?.markdownEstrutura?.minimoCaracteres || 0) : 0;
  metrics.innerHTML = `<strong>${characters}</strong> caracteres <span>•</span> ${lines} linha${lines === 1 ? '' : 's'}${language(file) === 'markdown' ? ` <span>•</span> ${words} palavras` : ''}${minimum ? ` <span class="editor-character-goal ${characters >= minimum ? 'ok' : ''}">meta ${Math.min(characters, minimum)}/${minimum}</span>` : ''}`;
}

function setEditorSelectionRange(start, end = start) {
  const safeStart = Math.max(0, Number(start) || 0);
  const safeEnd = Math.max(safeStart, Number(end) || safeStart);
  if (codeEditor) {
    const from = codeEditor.posFromIndex(safeStart);
    const to = codeEditor.posFromIndex(safeEnd);
    codeEditor.setSelection(from, to);
    codeEditor.scrollIntoView({ from, to }, 80);
    codeEditor.focus();
    return;
  }
  const textarea = $('#studentEditor');
  if (!textarea) return;
  textarea.focus({ preventScroll: true });
  textarea.setSelectionRange(safeStart, safeEnd);
}
function loadEditorPreferences() {
  let fontSize = EDITOR_FONT_DEFAULT;
  try {
    const saved = JSON.parse(localStorage.getItem(editorPreferenceKey()) || '{}');
    const value = Number(saved.fontSize);
    if (Number.isFinite(value)) fontSize = Math.max(EDITOR_FONT_MIN, Math.min(EDITOR_FONT_MAX, value));
  } catch (_) {}
  document.documentElement.style.setProperty('--student-code-font-size', `${fontSize}px`);
  const label = $('#editorFontSize');
  if (label) label.textContent = `${fontSize} px`;
  return fontSize;
}
function saveEditorFontSize(fontSize) {
  const size = Math.max(EDITOR_FONT_MIN, Math.min(EDITOR_FONT_MAX, Number(fontSize) || EDITOR_FONT_DEFAULT));
  document.documentElement.style.setProperty('--student-code-font-size', `${size}px`);
  const label = $('#editorFontSize');
  if (label) label.textContent = `${size} px`;
  try {
    const raw = localStorage.getItem(editorPreferenceKey());
    const current = raw ? JSON.parse(raw) : {};
    localStorage.setItem(editorPreferenceKey(), JSON.stringify({ ...current, fontSize: size }));
  } catch (_) {}
  codeEditor?.refresh();
  return size;
}
function adjustEditorFont(delta) {
  const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--student-code-font-size')) || EDITOR_FONT_DEFAULT;
  const next = saveEditorFontSize(current + delta);
  Utils.toast(`Fonte do código: ${next} px.`);
}
function resetEditorFont() {
  saveEditorFontSize(EDITOR_FONT_DEFAULT);
  Utils.toast(`Fonte do código restaurada para ${EDITOR_FONT_DEFAULT} px.`);
}
function initStudentCodeEditor() {
  const textarea = $('#studentEditor');
  if (!textarea || codeEditor || !window.CodeMirror) return Boolean(codeEditor);
  loadEditorPreferences();
  codeEditor = window.CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: editorModeFor(file),
    theme: 'ds-vscode',
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: false,
    inputStyle: 'textarea',
    viewportMargin: 20,
    screenReaderLabel: 'Editor de código do aluno',
    extraKeys: {
      Tab(cm) { if (cm.somethingSelected()) cm.indentSelection('add'); else cm.replaceSelection('    ', 'end'); },
      'Shift-Tab'(cm) { cm.indentSelection('subtract'); }
    }
  });
  codeEditor.setSize('100%', '100%');
  $('.editor-body')?.classList.add('cm-enabled');
  const editorStage = textarea.closest('.editor-stage');
  if (editorStage) delete editorStage.dataset.highlightReady;
  const input = codeEditor.getInputField?.();
  if (input) {
    input.setAttribute('aria-label', 'Editor de código do aluno');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'none');
    input.style.textTransform = 'none';
  }
  codeEditor.on('change', () => {
    if (codeEditorSilent) return;
    textarea.value = codeEditor.getValue();
    handleEditorInput();
  });
  codeEditor.on('cursorActivity', updateActiveLine);
  codeEditor.on('scroll', syncScroll);
  return true;
}


function initReferenceCodeEditor() {
  const textarea = $('#referenceVsEditor');
  if (!textarea || referenceCodeEditor || !window.CodeMirror) return Boolean(referenceCodeEditor);
  referenceCodeEditor = window.CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: editorModeFor(file),
    theme: 'ds-vscode',
    readOnly: 'nocursor',
    cursorBlinkRate: -1,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: false,
    viewportMargin: 30,
    screenReaderLabel: 'Código de referência protegido'
  });
  referenceCodeEditor.setSize('100%', '100%');
  referenceCodeEditor.getWrapperElement()?.classList.add('reference-codemirror');
  syncReferenceVsEditor();
  return true;
}

function syncReferenceVsEditor() {
  const source = String(exercise()?.arquivos?.[file] ?? '');
  if (!referenceCodeEditor) {
    const textarea = $('#referenceVsEditor');
    if (textarea) textarea.value = source;
    return;
  }
  referenceCodeEditor.setOption('mode', editorModeFor(file));
  if (referenceCodeEditor.getValue() !== source) referenceCodeEditor.setValue(source);
  referenceCodeEditor.refresh();
}

function vscodeFileIcon(key) {
  const name = String(exercise()?.nomesArquivos?.[key] || key).toLowerCase();
  if (name.endsWith('.html')) return { icon: '<>', cls: 'html' };
  if (name.endsWith('.css')) return { icon: '#', cls: 'css' };
  if (name.endsWith('.js')) return { icon: 'JS', cls: 'js' };
  if (name.endsWith('.py')) return { icon: 'Py', cls: 'python' };
  if (name.endsWith('.md')) return { icon: 'MD', cls: 'markdown' };
  if (name.endsWith('.json')) return { icon: 'JSON', cls: 'json' };
  return { icon: '•', cls: 'file' };
}

function openFileFromVsCodeExplorer(key) {
  const tab = [...document.querySelectorAll('#studentFileTabs button[data-file]')].find(item => item.dataset.file === key);
  if (tab && !tab.disabled) {
    tab.click();
    if (state.ui?.vsCodeMode) {
      view = 'practice';
      renderAll();
      setTimeout(() => editorFocus(), 40);
    }
    return;
  }
  Utils.toast('Este arquivo ainda está bloqueado. Conclua o anterior para liberar.');
}

function renderVsCodeExplorer() {
  const tree = $('#vscodeFileTree');
  if (!tree || !exercise()) return;
  const folder = $('#vscodeProjectFolder');
  if (folder) folder.textContent = String(exercise().pasta || exercise().codigo || 'ATIVIDADE').toUpperCase();
  const workspace = $('#vscodeWorkspaceTitle');
  if (workspace) workspace.textContent = `${exercise().codigo || ''} — ${exercise().nomeCurto || exercise().titulo || ''}`;
  const currentTitle = $('#vscodeCurrentFileTitle');
  if (currentTitle) currentTitle.textContent = exercise().nomesArquivos[file] || file;
  tree.innerHTML = order().map(key => {
    const meta = vscodeFileIcon(key);
    const locked = !state.unlocked[key];
    return `<button type="button" class="vscode-file-row ${file === key ? 'active' : ''} ${state.done[key] ? 'done' : ''}" data-vscode-file="${Utils.escapeHtml(key)}" ${locked ? 'disabled' : ''}><span class="vscode-file-icon ${meta.cls}">${Utils.escapeHtml(meta.icon)}</span><span>${Utils.escapeHtml(exercise().nomesArquivos[key])}</span><i>${state.done[key] ? '✓' : locked ? '🔒' : ''}</i></button>`;
  }).join('');
  tree.querySelectorAll('[data-vscode-file]').forEach(button => button.addEventListener('click', () => openFileFromVsCodeExplorer(button.dataset.vscodeFile)));
  const openEditors = $('#vscodeOpenEditors');
  if (openEditors) {
    const meta = vscodeFileIcon(file);
    openEditors.innerHTML = `<button type="button" class="vscode-open-editor active"><span class="vscode-file-icon ${meta.cls}">${Utils.escapeHtml(meta.icon)}</span><span>${Utils.escapeHtml(exercise().nomesArquivos[file])}</span><i>×</i></button>`;
  }
  const outline = $('#vscodeOutlineText');
  if (outline) outline.textContent = language(file) === 'html' ? 'Estrutura HTML e elementos' : language(file) === 'css' ? 'Seletores e propriedades CSS' : language(file) === 'js' ? 'Variáveis, funções e eventos' : language(file) === 'python' ? 'Variáveis, cálculos e saídas' : 'Conteúdo do arquivo atual';
  updateVsCodeStatus();
}

function updateVsCodeStatus() {
  const langNames = { html: 'HTML', css: 'CSS', js: 'JavaScript', python: 'Python', markdown: 'Markdown', json: 'JSON', xml: 'XML' };
  const lang = langNames[language(file)] || String(language(file) || '').toUpperCase();
  const languageLabel = $('#vscodeStatusLanguage');
  if (languageLabel) languageLabel.textContent = lang;
  const problems = $('#vscodeStatusProblems');
  if (problems) {
    const issueCount = lastValidationResult && !lastValidationResult.ok ? Math.max(1, (lastValidationResult.issues || []).length) : 0;
    problems.textContent = `${issueCount} problema${issueCount === 1 ? '' : 's'}`;
    problems.classList.toggle('has-problems', issueCount > 0);
  }
  let line = 1, ch = 1;
  if (codeEditor) {
    const cursor = codeEditor.getCursor();
    line = cursor.line + 1;
    ch = cursor.ch + 1;
  } else {
    const textarea = $('#studentEditor');
    if (textarea) {
      const before = textarea.value.slice(0, textarea.selectionStart || 0).split('\n');
      line = before.length;
      ch = before[before.length - 1].length + 1;
    }
  }
  const pos = $('#vscodeStatusPosition');
  if (pos) pos.textContent = `Ln ${line}, Col ${ch}`;
}

function updateVsCodeGauge(percentage, { immediate = false, force = false } = {}) {
  const pct = Math.max(0, Math.min(100, Number(percentage) || 0));
  const rounded = Math.round(pct);
  const changed = force || vscodeGaugeLast === null || rounded !== vscodeGaugeLast;
  vscodeGaugeLast = rounded;
  const arc = $('#vscodeGaugeArc');
  const needle = $('#vscodeGaugeNeedle');
  const readout = $('#vscodeGaugePercent');
  const status = $('#vscodeGaugeStatus');
  const statusProgress = $('#vscodeStatusProgress');
  const gauge = $('#vscodeSpeedometer');
  if (readout) readout.textContent = `${Math.round(pct)}%`;
  if (statusProgress) statusProgress.textContent = `${Math.round(pct)}%`;
  if (!arc || !needle) return;
  if (immediate) {
    arc.style.transition = 'none';
    needle.style.transition = 'none';
  }
  arc.style.strokeDashoffset = String(100 - pct);
  needle.style.transform = `rotate(${-90 + (pct * 1.8)}deg)`;
  if (immediate) requestAnimationFrame(() => { arc.style.transition = ''; needle.style.transition = ''; });
  clearTimeout(vscodeGaugeTimer);
  if (changed && gauge && status && document.body.classList.contains('vscode-mode')) {
    gauge.classList.add('accelerating');
    status.textContent = 'ACELERANDO';
    vscodeGaugeTimer = setTimeout(() => {
      gauge.classList.remove('accelerating');
      status.textContent = pct >= 100 ? 'CONCLUÍDO' : 'PROGRESSO ATUAL';
    }, 980);
  } else if (status) status.textContent = pct >= 100 ? 'CONCLUÍDO' : 'PROGRESSO';
}

function maps(defaultValue) {
  return Object.fromEntries(order().map((key, index) => [key, typeof defaultValue === 'function' ? defaultValue(key, index) : defaultValue]));
}

function currentStateContext() {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    discipline: activeDisciplineSlug(),
    exerciseCode: String(exercise()?.codigo || exercise()?.numero || ''),
    storagePrefix: storagePrefix(),
    fileOrder: [...order()]
  };
}

function answerMetadata(key, previous = {}) {
  return {
    ...previous,
    discipline: activeDisciplineSlug(),
    exerciseCode: String(exercise()?.codigo || exercise()?.numero || ''),
    file: key,
    language: language(key),
    updatedAt: previous.updatedAt || new Date().toISOString()
  };
}

function defaultState() {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    context: currentStateContext(),
    answers: maps(''),
    answerMeta: maps(key => answerMetadata(key)),
    done: maps(false),
    origin: maps('digitado'),
    unlocked: maps((_key, index) => index === 0),
    explained: maps(0),
    understood: maps(0),
    attempts: maps(0),
    helpUsage: maps(0),
    lastDiagnosticLine: maps(null),
    autocomplete: maps(() => ({ used: false, active: false, events: [], lastSnapshot: null, markerRemoved: false })),
    snapshots: maps(() => []),
    execution: { hash: '', ok: false, executedAt: null, interactions: 0, interactionHash: '', stale: true, lastError: '', behavior: { hash: '', passed: false, criteria: {}, lastCheckedAt: null, trigger: '' } },
    pythonExecution: { hash: '', ok: false, stale: true, status: 'idle', output: [], inputs: [], executedAt: null, lastError: '', line: null },
    ui: { vsCodeMode: false, vscodePanel: 'editor', focusMode: false, drawers: { reference: false, preview: false, behavior: true, terminal: true } },
    activeSeconds: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
    actionCount: 0,
    lastSavedAt: new Date().toISOString()
  };
}

function pickCurrentFiles(source = {}, fallback = {}) {
  return Object.fromEntries(order().map(key => [key, key in source ? source[key] : fallback[key]]));
}

function contentCompatibleWithFile(key, value) {
  const text = String(value ?? '').trim();
  if (!text) return true;
  const lang = language(key);
  const htmlSignal = /<!doctype\b|<\/?(?:html|head|body|main|header|footer|section|article|div|p|h[1-6]|form|label|input|button|select|option|meta|link|script|nav|ul|ol|li|a)\b/i.test(text);
  const jsSignal = /(?:^|[;\n])\s*(?:const|let|var|function)\s+[A-Za-z_$]|\b(?:addEventListener|querySelector|getElementById)\s*\(|\bdocument\.|=>/m.test(text);
  const cssSignal = /(?:^|\n)\s*(?:\*|html|body|main|header|footer|section|article|nav|form|button|input|select|textarea|\.[\w-]+|#[\w-]+|@media\b)[^\n{]*\{/m.test(text)
    && /[\w-]+\s*:\s*[^;{}]+[;}]/m.test(text);
  const pythonSignal = /(?:^|\n)\s*(?:def\s+\w+\s*\(|from\s+\w+\s+import\s+|import\s+\w+|print\s*\(|\w+\s*=\s*(?:input|float|int)\s*\()/m.test(text);

  if (lang === 'html') return !((jsSignal || cssSignal || pythonSignal) && !htmlSignal);
  if (lang === 'css') return !(htmlSignal || jsSignal || pythonSignal);
  if (lang === 'js') return !(htmlSignal || (cssSignal && !jsSignal) || pythonSignal);
  if (lang === 'python') return !(htmlSignal || jsSignal || cssSignal);
  return true;
}

function compatibleSnapshot(saved, key) {
  const list = Array.isArray(saved?.snapshots?.[key]) ? saved.snapshots[key] : [];
  return list.find(snapshot => snapshot && typeof snapshot.content === 'string' && contentCompatibleWithFile(key, snapshot.content)) || null;
}

function sanitizeStoredState(saved, { legacy = false, recovery = null } = {}) {
  if (!saved || typeof saved !== 'object') return { saved: null, issues: [] };
  const expected = currentStateContext();
  const sourceContext = saved.context || {};
  const contextMismatch = (!legacy && sourceContext.exerciseCode && String(sourceContext.exerciseCode) !== expected.exerciseCode)
    || (!legacy && sourceContext.discipline && sourceContext.discipline !== expected.discipline);
  if (contextMismatch) {
    return { saved: null, issues: ['estado salvo pertencia a outro exercício ou disciplina'] };
  }

  const cleaned = { ...saved };
  const issues = [];
  cleaned.schemaVersion = STORAGE_SCHEMA_VERSION;
  cleaned.context = expected;
  cleaned.answers = {};
  cleaned.answerMeta = {};

  order().forEach(key => {
    let content = typeof saved.answers?.[key] === 'string' ? saved.answers[key] : '';
    const meta = saved.answerMeta?.[key];
    const metaMismatch = Boolean(meta) && (
      (meta.exerciseCode && String(meta.exerciseCode) !== expected.exerciseCode)
      || (meta.discipline && meta.discipline !== expected.discipline)
      || (meta.file && meta.file !== key)
      || (meta.language && meta.language !== language(key))
    );
    if (metaMismatch || !contentCompatibleWithFile(key, content)) {
      const snapshot = compatibleSnapshot(saved, key);
      const recoveryAnswer = typeof recovery?.answers?.[key] === 'string' && contentCompatibleWithFile(key, recovery.answers[key]) ? recovery.answers[key] : '';
      const recoverySnapshot = compatibleSnapshot(recovery, key);
      const displayName = exercise()?.nomesArquivos?.[key] || key;
      if (snapshot) {
        content = snapshot.content;
        issues.push(`${displayName}: conteúdo incompatível foi substituído por um snapshot local compatível`);
      } else if (recoveryAnswer) {
        content = recoveryAnswer;
        issues.push(`${displayName}: conteúdo incompatível foi recuperado da cópia de segurança anterior`);
      } else if (recoverySnapshot) {
        content = recoverySnapshot.content;
        issues.push(`${displayName}: conteúdo incompatível foi recuperado de um snapshot da cópia de segurança`);
      } else {
        content = '';
        issues.push(`${displayName}: conteúdo incompatível foi isolado para evitar mistura entre arquivos`);
      }
    }
    cleaned.answers[key] = content;
    cleaned.answerMeta[key] = answerMetadata(key, meta || {});
  });

  const defaults = defaultState();
  ['done','origin','unlocked','explained','understood','attempts','helpUsage','lastDiagnosticLine','snapshots'].forEach(name => {
    cleaned[name] = pickCurrentFiles(saved[name] || {}, defaults[name]);
  });
  cleaned.autocomplete = Object.fromEntries(order().map(key => [key, { ...defaults.autocomplete[key], ...(saved.autocomplete?.[key] || {}) }]));
  return { saved: cleaned, issues };
}

function hydrateState(defaults, saved = {}) {
  return {
    ...defaults,
    ...saved,
    schemaVersion: STORAGE_SCHEMA_VERSION,
    context: currentStateContext(),
    answers: pickCurrentFiles(saved.answers || {}, defaults.answers),
    answerMeta: Object.fromEntries(order().map(key => [key, answerMetadata(key, saved.answerMeta?.[key] || defaults.answerMeta[key])])),
    done: pickCurrentFiles(saved.done || {}, defaults.done),
    origin: pickCurrentFiles(saved.origin || {}, defaults.origin),
    unlocked: pickCurrentFiles(saved.unlocked || {}, defaults.unlocked),
    explained: pickCurrentFiles(saved.explained || {}, defaults.explained),
    understood: pickCurrentFiles(saved.understood || {}, defaults.understood),
    attempts: pickCurrentFiles(saved.attempts || {}, defaults.attempts),
    helpUsage: pickCurrentFiles(saved.helpUsage || {}, defaults.helpUsage),
    lastDiagnosticLine: pickCurrentFiles(saved.lastDiagnosticLine || {}, defaults.lastDiagnosticLine),
    autocomplete: Object.fromEntries(order().map(keyName => [keyName, { ...defaults.autocomplete[keyName], ...(saved.autocomplete?.[keyName] || {}) }])),
    snapshots: pickCurrentFiles(saved.snapshots || {}, defaults.snapshots),
    execution: { ...defaults.execution, ...(saved.execution || {}), behavior: { ...defaults.execution.behavior, ...(saved.execution?.behavior || {}), criteria: { ...(saved.execution?.behavior?.criteria || {}) } } },
    pythonExecution: { ...defaults.pythonExecution, ...(saved.pythonExecution || {}) },
    ui: { ...defaults.ui, ...(saved.ui || {}), drawers: { ...defaults.ui.drawers, ...(saved.ui?.drawers || {}) } }
  };
}

function parseStoredState(raw) {
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Estado local inválido.');
  return parsed;
}

function load() {
  const defaults = defaultState();
  recoveredStateNotice = null;
  let saved = null;
  let sourceWasBackup = false;
  const key = storageKey();

  try {
    saved = parseStoredState(localStorage.getItem(key));
    if (!saved) {
      try {
        saved = parseStoredState(localStorage.getItem(storageBackupKey()));
        sourceWasBackup = Boolean(saved);
      } catch (_) {}
    }
  } catch (error) {
    try {
      saved = parseStoredState(localStorage.getItem(storageBackupKey()));
      sourceWasBackup = Boolean(saved);
    } catch (backupError) {
      recoveredStateNotice = 'O progresso salvo neste exercício não pôde ser lido. A plataforma iniciou um estado limpo e seguro.';
    }
  }

  let legacyDetected = false;
  if (!saved) {
    try {
      legacyDetected = Boolean(
        localStorage.getItem(legacyV3StorageKey())
        || localStorage.getItem(legacyV3StorageBackupKey())
        || localStorage.getItem(legacyV2StorageKey())
        || localStorage.getItem(legacyV2StorageBackupKey())
      );
    } catch (_) {}
  }

  const sanitized = sanitizeStoredState(saved, { legacy: false, recovery: null });
  state = hydrateState(defaults, sanitized.saved || {});
  if (!file || !order().includes(file)) file = order()[0];

  if (sanitized.issues.length) {
    recoveredStateNotice = `Proteção de arquivos ativada: ${sanitized.issues.join(' • ')}. O conteúdo incompatível não foi carregado.`;
  } else if (sourceWasBackup) {
    recoveredStateNotice = 'O último salvamento v4 estava corrompido. A plataforma restaurou a cópia local v4 anterior.';
  } else if (legacyDetected) {
    recoveredStateNotice = 'Foi criado um espaço de trabalho limpo v4. Salvamentos v2/v3 foram preservados como backup, mas nenhum código antigo foi reimportado para evitar código fantasma.';
  }

  if (!saved || sanitized.issues.length || sourceWasBackup) save();
}
function markAnswerContext(key) {
  if (!state.answerMeta) state.answerMeta = {};
  state.answerMeta[key] = answerMetadata(key, { ...(state.answerMeta[key] || {}), updatedAt: new Date().toISOString() });
}

function save() {
  state.schemaVersion = STORAGE_SCHEMA_VERSION;
  state.context = currentStateContext();
  state.lastSavedAt = new Date().toISOString();
  order().forEach(key => {
    if (!state.answerMeta) state.answerMeta = {};
    state.answerMeta[key] = answerMetadata(key, state.answerMeta[key] || {});
  });
  const key = storageKey();
  try {
    const serialized = JSON.stringify(state);
    const previous = localStorage.getItem(key);
    if (previous) {
      try {
        parseStoredState(previous);
        try { localStorage.setItem(storageBackupKey(), previous); } catch (backupError) { console.warn('Não foi possível atualizar a cópia de segurança local.', backupError); }
      } catch (invalidPrevious) {
        console.warn('O salvamento anterior estava corrompido e não foi usado como backup.', invalidPrevious);
      }
    }
    localStorage.setItem(key, serialized);
    parseStoredState(localStorage.getItem(key));
    lastSaveError = null;
    updateEditorSaveStatus();
    return true;
  } catch (error) {
    lastSaveError = error;
    updateEditorSaveStatus();
    return false;
  }
}

function updateEditorSaveStatus() {
  const status = $('#editorStatus');
  if (!status) return;
  if (lastSaveError) {
    status.textContent = 'falha ao salvar localmente - baixe uma cópia agora';
    status.dataset.state = 'error';
  } else {
    status.textContent = recoveredStateNotice ? 'cópia local anterior restaurada com segurança' : 'salvo localmente - texto selecionável';
    status.dataset.state = recoveredStateNotice ? 'warning' : 'saved';
    if (recoveredStateNotice) {
      const notice = recoveredStateNotice;
      recoveredStateNotice = null;
      setTimeout(() => Utils.toast(notice), 60);
    }
  }
}

function scheduleSave() {
  clearTimeout(saveStateTimer);
  saveStateTimer = setTimeout(save, 180);
}

function flushCurrentWork() {
  clearTimeout(saveStateTimer);
  clearTimeout(previewUpdateTimer);
  syncCurrentEditorAnswer();
  if (state && Object.keys(state).length) save();
}

function registerActivity() {
  lastActivityAt = Date.now();
  if (state) state.actionCount = Number(state.actionCount || 0) + 1;
}

function startActiveTimer() {
  ['pointerdown', 'keydown', 'input', 'scroll', 'touchstart'].forEach(eventName => {
    document.addEventListener(eventName, registerActivity, { passive: true });
  });
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    const authOpen = document.body.classList.contains('auth-open') || $('#authGate')?.hidden === false;
    const active = !document.hidden
      && !authOpen
      && !state.completedAt
      && view !== 'completion'
      && Date.now() - lastActivityAt < 180000
      && document.querySelector('main.student-main')?.hidden !== true;
    if (active) {
      state.activeSeconds = Number(state.activeSeconds || 0) + 1;
      if (state.activeSeconds % 10 === 0) save();
      renderActiveTime();
    }
  }, 1000);
}

function formatTime(totalSeconds) {
  const total = Math.max(0, Number(totalSeconds || 0));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


function stableHash(value = '') {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function currentProjectHash() {
  syncCurrentEditorAnswer();
  return stableHash(order().map(key => `${key}\n${state.answers[key] || ''}`).join('\n---arquivo---\n'));
}

function pythonFileKey() {
  return order().find(key => language(key) === 'python') || null;
}

function currentPythonCode() {
  const key = pythonFileKey();
  if (!key) return '';
  if (view === 'practice' && file === key && $('#studentEditor')) return editorValue();
  return state.answers[key] || '';
}

function currentPythonHash() { return stableHash(currentPythonCode()); }

function pythonExecutionReady() {
  const key = pythonFileKey();
  if (!key) return true;
  return Boolean(state.pythonExecution?.ok)
    && !state.pythonExecution?.stale
    && state.pythonExecution?.hash === currentPythonHash();
}

function invalidatePythonExecution(message = 'O arquivo Python foi alterado. Execute main.py novamente.') {
  if (!pythonFileKey()) return;
  state.pythonExecution = { ...(state.pythonExecution || {}), ok: false, stale: true, status: state.pythonExecution?.executedAt ? 'stale' : 'idle', lastError: '' };
  pythonSession = null;
  renderPythonTerminal(message);
}

function captureSnapshot(reason = 'manual') {
  const editor = $('#studentEditor');
  if (!file || !editor) return;
  const content = editorValue();
  const list = Array.isArray(state.snapshots[file]) ? state.snapshots[file] : [];
  const hash = stableHash(content);
  if (list[0]?.hash === hash) return;
  list.unshift({ content, hash, reason, at: new Date().toISOString() });
  state.snapshots[file] = list.slice(0, 5);
  lastSnapshotAt = Date.now();
}

function restoreLastSnapshot() {
  const list = Array.isArray(state.snapshots[file]) ? state.snapshots[file] : [];
  const snapshot = list[0];
  if (!snapshot) {
    Utils.toast('Ainda não existe uma versão anterior deste arquivo para restaurar.');
    return;
  }
  const editor = $('#studentEditor');
  const currentValue = editorValue();
  if (stableHash(currentValue) === snapshot.hash) {
    Utils.toast('O editor já contém a última versão salva.');
    return;
  }
  const currentList = Array.isArray(state.snapshots[file]) ? state.snapshots[file] : [];
  currentList.unshift({ content: currentValue, hash: stableHash(currentValue), reason: 'antes_da_restauracao', at: new Date().toISOString() });
  state.snapshots[file] = currentList.slice(0, 5);
  setEditorValue(snapshot.content);
  state.answers[file] = snapshot.content;
  markAnswerContext(file);
  state.done[file] = false;
  state.completedAt = null;
  invalidateExecution('Código restaurado. Execute novamente para atualizar o resultado.');
  save();
  syncEditor();
  renderPracticePreview(false);
  renderOrigin();
  renderCodeHealth();
  renderTabs();
  Utils.toast(`Versão salva em ${new Date(snapshot.at).toLocaleString('pt-BR')} restaurada.`);
  window.AppAuth?.log('snapshot_restaurado', { arquivo: file, codigo: exercise().codigo, reason: snapshot.reason, hash: snapshot.hash });
}

function invalidateExecution(message = 'O código foi alterado após a última execução. Execute novamente para atualizar o resultado.') {
  state.execution = { ...(state.execution || {}), stale: true, ok: false, lastError: '', interactions: 0, interactionHash: '', behavior: { hash: '', passed: false, criteria: {}, lastCheckedAt: null, trigger: '' } };
  renderExecutionFreshness(message);
}


function behaviorDefinition() {
  const definition = exercise()?.comportamento;
  return definition && Array.isArray(definition.criterios) && definition.criterios.length ? definition : null;
}

function behaviorReady() {
  const definition = behaviorDefinition();
  if (!definition) {
    const hash = currentProjectHash();
    return Number(state.execution?.interactions || 0) > 0 && state.execution?.interactionHash === hash;
  }
  const hash = currentProjectHash();
  return Boolean(state.execution?.behavior?.passed) && state.execution?.behavior?.hash === hash;
}

function behaviorProgress() {
  const definition = behaviorDefinition();
  if (!definition) return { passed: 0, total: 1 };
  const results = state.execution?.behavior?.criteria || {};
  return {
    passed: definition.criterios.filter(item => results[item.id] === true).length,
    total: definition.criterios.length
  };
}

function renderBehaviorChecklist(message = '') {
  const panel = $('#behaviorCheckPanel');
  if (!panel) return;
  const definition = behaviorDefinition();
  panel.hidden = !definition;
  if (!definition) return;
  $('#behaviorCheckTitle').textContent = definition.titulo || 'Teste comportamental';
  $('#behaviorCheckInstruction').textContent = definition.instrucao || 'Execute e interaja com o preview atual.';
  const hash = currentProjectHash();
  const freshExecution = Boolean(state.execution?.ok) && !state.execution?.stale && state.execution?.hash === hash;
  const behavior = state.execution?.behavior || {};
  const results = behavior.hash === hash ? (behavior.criteria || {}) : {};
  $('#behaviorCheckList').innerHTML = definition.criterios.map(item => {
    const passed = results[item.id] === true;
    const stateName = passed ? 'passed' : freshExecution ? 'failed' : 'pending';
    return `<li data-state="${stateName}"><span>${Utils.escapeHtml(item.rotulo)}</span></li>`;
  }).join('');
  const progress = behaviorProgress();
  const status = $('#behaviorCheckStatus');
  const feedback = $('#behaviorCheckFeedback');
  if (freshExecution && behavior.passed && behavior.hash === hash) {
    status.textContent = `${progress.total}/${progress.total} critérios atendidos`;
    status.className = 'chip success';
    feedback.textContent = message || 'Comportamento confirmado. O resultado atual corresponde às ações exigidas pela atividade.';
    feedback.dataset.state = 'success';
  } else if (freshExecution) {
    status.textContent = `${progress.passed}/${progress.total} critérios atendidos`;
    status.className = 'chip warning';
    feedback.textContent = message || 'A execução está sem erro, mas ainda faltam ações ou resultados. Use o preview e acompanhe os itens acima.';
    feedback.dataset.state = 'warning';
  } else {
    status.textContent = 'Aguardando execução atual';
    status.className = 'chip warning';
    feedback.textContent = message || 'Use Executar / atualizar preview. Depois realize a ação principal dentro do preview.';
    feedback.dataset.state = 'warning';
  }
}

function setPreviewBusy(busy, label = '') {
  previewExecutionBusy = Boolean(busy);
  const button = $('#refreshPreview');
  if (!button) return;
  button.disabled = previewExecutionBusy;
  button.dataset.busy = String(previewExecutionBusy);
  button.textContent = previewExecutionBusy ? (label || 'Executando...') : 'Executar / atualizar preview';
}

function finishPreviewBusy() {
  clearTimeout(previewExecutionTimer);
  previewExecutionTimer = 0;
  setPreviewBusy(false);
}

function executionReady() {
  let webReady = true;
  if (exercise().arquivos.html) {
    const hash = currentProjectHash();
    webReady = Boolean(state.execution?.ok)
      && !state.execution?.stale
      && state.execution?.hash === hash
      && behaviorReady();
  }
  return webReady && pythonExecutionReady();
}

function renderExecutionFreshness(customMessage = '') {
  const badge = $('#executionFreshness');
  if (!badge) return;
  const hasHtml = Boolean(exercise().arquivos.html);
  if (!hasHtml) {
    badge.textContent = 'execução externa orientada';
    badge.className = 'chip info';
    badge.title = 'Este arquivo deve ser testado no ambiente indicado pela atividade.';
    return;
  }
  const hash = currentProjectHash();
  const fresh = Boolean(state.execution?.ok) && !state.execution?.stale && state.execution?.hash === hash;
  const behaviorPassed = fresh && behaviorReady();
  const progress = behaviorProgress();
  const pythonNeeded = Boolean(pythonFileKey());
  const pythonReady = pythonExecutionReady();
  if (behaviorPassed && pythonReady) {
    badge.textContent = pythonNeeded ? 'preview, comportamento e terminal testados' : 'comportamento do preview confirmado';
    badge.className = 'chip success';
    badge.title = customMessage || (pythonNeeded ? 'O preview, os critérios comportamentais e o arquivo Python atuais foram executados.' : 'O código atual foi executado e produziu o comportamento solicitado.');
  } else if (behaviorPassed && pythonNeeded && !pythonReady) {
    badge.textContent = state.pythonExecution?.executedAt ? 'terminal Python desatualizado' : 'falta executar main.py';
    badge.className = 'chip warning';
    badge.title = customMessage || 'Execute o arquivo main.py no terminal pedagógico com as entradas solicitadas.';
  } else if (fresh) {
    badge.textContent = behaviorDefinition() ? `execução atual - ${progress.passed}/${progress.total} comportamentos` : 'preview executado - falta interagir';
    badge.className = 'chip warning';
    badge.title = customMessage || (behaviorDefinition() ? 'Realize a ação principal e confira os critérios do teste comportamental.' : 'Clique, preencha ou envie o elemento principal do preview.');
  } else {
    badge.textContent = state.execution?.executedAt ? 'resultado desatualizado' : 'preview ainda não testado';
    badge.className = 'chip warning';
    badge.title = customMessage || 'Use Executar / atualizar preview e teste a interação solicitada.';
  }
  renderBehaviorChecklist(customMessage);
}

function ensureDynamicUi() {
  const progressCard = $('.progress-card');
  if (progressCard && !$('#activeTimePanel')) {
    const panel = document.createElement('div');
    panel.id = 'activeTimePanel';
    panel.className = 'active-time-panel';
    panel.innerHTML = '<span class="chip info">Tempo ativo</span><strong id="activeTime">00:00</strong><small id="activeTimeRequirement"></small>';
    progressCard.append(panel);
  }
  const downloads = $('.download-actions');
  if (downloads) downloads.id = 'dynamicDownloads';
  const delivery = $('.delivery-actions');
  if (delivery && !$('#exportEvidence')) {
    const evidence = document.createElement('button');
    evidence.id = 'exportEvidence';
    evidence.className = 'secondary';
    evidence.textContent = 'Gerar evidência / PDF';
    evidence.addEventListener('click', exportEvidence);
    delivery.prepend(evidence);
  }
  const completionCard = $('.completion-card');
  if (completionCard && !$('#timeCompletionStatus')) {
    const status = document.createElement('p');
    status.id = 'timeCompletionStatus';
    status.className = 'delivery-note';
    completionCard.insertBefore(status, completionCard.querySelector('.download-actions'));
  }
  if (progressCard && !$('#finishExerciseButton')) {
    const finish = document.createElement('button');
    finish.id = 'finishExerciseButton';
    finish.className = 'success';
    finish.type = 'button';
    finish.textContent = 'Concluir atividade';
    finish.hidden = true;
    progressCard.append(finish);
  }
  const labGrid = $('.lab-grid');
  if (labGrid && !$('#vscodeMobileTabs')) {
    const tabs = document.createElement('nav');
    tabs.id = 'vscodeMobileTabs';
    tabs.className = 'vscode-mobile-tabs';
    tabs.hidden = true;
    tabs.setAttribute('aria-label', 'Painéis do Modo VS Code');
    tabs.innerHTML = '<button type="button" data-vscode-panel="explorer">Arquivos</button><button type="button" data-vscode-panel="reference">Referência</button><button type="button" data-vscode-panel="editor" class="active">Meu código</button><button type="button" data-vscode-panel="preview">Preview</button><button type="button" data-vscode-panel="terminal" hidden>Terminal</button>';
    labGrid.parentNode.insertBefore(tabs, labGrid);
  }
}

function init() {
  ensureDynamicUi();
  ensurePracticeActionLayout();
  ensureDrawerControls();
  try {
    const persistedDiscipline = localStorage.getItem('ds2sub_active_discipline');
    if (persistedDiscipline && window.DISCIPLINES?.[persistedDiscipline]) window.ACTIVE_DISCIPLINE = persistedDiscipline;
  } catch (_) {}
  applyDiscipline(activeDisciplineSlug(), false);
  const disciplineSelector = $('#studentDiscipline');
  if (disciplineSelector) {
    disciplineSelector.value = activeDisciplineSlug();
    disciplineSelector.addEventListener('change', () => {
      clearTimeout(saveStateTimer);
      syncCurrentEditorAnswer();
      if (file && exercise()) save();
      applyDiscipline(disciplineSelector.value, true);
      resetForDiscipline();
      Utils.toast(`Disciplina alterada para ${window.APP_CONFIG.shortName}.`);
    });
  }
  const selector = $('#studentExercise');
  populateExerciseSelector();
  selector.addEventListener('change', () => {
    clearTimeout(saveStateTimer);
    syncCurrentEditorAnswer();
    save();
    resetTransientRuntime('Exercício alterado. O preview anterior foi descartado.');
    current = Number(selector.value);
    file = order()[0];
    explainStep = 0;
    view = 'explain';
    load();
    renderAll();
  });

  $('#explainPrev').addEventListener('click', previousExplain);
  $('#explainNext').addEventListener('click', nextExplain);
  $('#markUnderstood').addEventListener('click', markCurrentStepUnderstood);
  $('#backExplain').addEventListener('click', () => setView('explain'));
  $('#reviewSteps').addEventListener('click', () => setView('explain'));
  $('#goTutorial').addEventListener('click', () => setView('explain'));
  $('#startPractice').addEventListener('click', () => setView('practice'));
  $('#validateFile').addEventListener('click', validate);
  $('#completeStage').addEventListener('click', openAutocompleteModal);
  $('#undoAutocomplete').addEventListener('click', undoAutocomplete);
  $('#restoreSnapshot').addEventListener('click', restoreLastSnapshot);
  $('#toggleVsCodeMode').addEventListener('click', toggleVsCodeMode);
  $('#exitVsCodeMode')?.addEventListener('click', () => { if (state.ui?.vsCodeMode) toggleVsCodeMode(); });
  $('#vscodeRefreshExplorer')?.addEventListener('click', () => { renderVsCodeExplorer(); Utils.toast('Explorer atualizado.'); });
  $('#closeAutocomplete').addEventListener('click', closeAutocompleteModal);
  $('#cancelAutocomplete').addEventListener('click', closeAutocompleteModal);
  $('#confirmAutocomplete').addEventListener('click', applyAutocomplete);
  $('#autocompleteConfirmRead').addEventListener('change', event => { $('#confirmAutocomplete').disabled = !event.target.checked; });
  $('#autocompleteModal').addEventListener('click', event => { if (event.target.id === 'autocompleteModal') closeAutocompleteModal(); });
  $$('#vscodeMobileTabs [data-vscode-panel]').forEach(button => button.addEventListener('click', () => setVsCodePanel(button.dataset.vscodePanel)));
  $('#refreshPreview').addEventListener('click', () => { openPracticeDrawer('preview'); if (behaviorDefinition()) openPracticeDrawer('behavior'); clearTimeout(previewUpdateTimer); renderPracticePreview(true); });
  $('#runPythonTerminal').addEventListener('click', () => { openPracticeDrawer('terminal'); runPythonTerminal(); });
  $('#stopPythonTerminal').addEventListener('click', stopPythonTerminal);
  $('#clearPythonTerminal').addEventListener('click', clearPythonTerminal);
  $('#pythonTerminalInputForm').addEventListener('submit', submitPythonTerminalInput);
  $('#copyFolder').addEventListener('click', () => Utils.copy(exercise().pasta, 'Nome da pasta copiado.'));
  $('#selectAllCode').addEventListener('click', selectAllStudentCode);
  $('#copyStudentCode').addEventListener('click', copyStudentCode);
  $('#downloadCurrentWork').addEventListener('click', () => requestWorkDownload('file', file));
  $('#downloadProjectWork').addEventListener('click', () => requestWorkDownload('project'));
  $('#vscodeDownloadFile')?.addEventListener('click', () => requestWorkDownload('file', file));
  $('#vscodeDownloadZip')?.addEventListener('click', () => requestWorkDownload('project'));
  $('#closeWorkDownload').addEventListener('click', closeWorkDownloadModal);
  $('#cancelWorkDownload').addEventListener('click', closeWorkDownloadModal);
  $('#confirmWorkDownload').addEventListener('click', confirmWorkDownload);
  $('#finishExerciseButton')?.addEventListener('click', finishExercise);
  $('#workDownloadModal').addEventListener('click', event => { if (event.target.id === 'workDownloadModal') closeWorkDownloadModal(); });
  document.addEventListener('keydown', event => {
    const downloadModal = $('#workDownloadModal');
    const autocompleteModal = $('#autocompleteModal');
    if (autocompleteModal && !autocompleteModal.hidden) {
      if (event.key === 'Escape') { event.preventDefault(); closeAutocompleteModal(); return; }
      if (event.key === 'Tab') trapModalFocus(autocompleteModal, event);
      return;
    }
    if (downloadModal && !downloadModal.hidden) {
      if (event.key === 'Escape') { event.preventDefault(); closeWorkDownloadModal(); return; }
      if (event.key === 'Tab') trapWorkDownloadFocus(event);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      flushCurrentWork();
      captureSnapshot('atalho_salvar');
      save();
      Utils.toast('Código salvo localmente.');
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && view === 'practice') {
      event.preventDefault();
      runCurrentCode();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b' && view === 'practice') {
      event.preventDefault();
      toggleVsCodeMode();
    }
  });
  $('#studentRunStep').addEventListener('click', runTutorialAction);
  $('#closeValidationDetails').addEventListener('click', hideValidationDetails);
  $('#diagnosticReviewTutorial').addEventListener('click', () => setView('explain'));
  $('#diagnosticFocusLine').addEventListener('click', focusDiagnosticLine);
  $('#openDiagnosticHelp').addEventListener('click', () => { if (lastValidationResult) renderValidationDetails(lastValidationResult, state.attempts[file] || 1); });

  $('#decreaseEditorFont')?.addEventListener('click', () => adjustEditorFont(-1));
  $('#increaseEditorFont')?.addEventListener('click', () => adjustEditorFont(1));
  $('#resetEditorFont')?.addEventListener('click', resetEditorFont);
  $$('[data-insert-symbol]').forEach(button => button.addEventListener('click', () => insertEditorSymbol(button.dataset.insertSymbol || '')));
  const codeMirrorReady = initStudentCodeEditor();
  initReferenceCodeEditor();
  if (!codeMirrorReady) {
    $('#studentEditor').addEventListener('input', handleEditorInput);
    $('#studentEditor').addEventListener('compositionstart', () => { editorComposing = true; });
    $('#studentEditor').addEventListener('compositionend', () => { editorComposing = false; schedulePracticePreview(); });
    $('#studentEditor').addEventListener('scroll', syncScroll);
    $('#studentEditor').addEventListener('click', updateActiveLine);
    $('#studentEditor').addEventListener('keyup', updateActiveLine);
    $('#studentEditor').addEventListener('select', updateActiveLine);
    $('#studentEditor').addEventListener('keydown', tabKey);
  }
  window.addEventListener('beforeunload', flushCurrentWork);
  window.addEventListener('pagehide', flushCurrentWork);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushCurrentWork(); });
  window.addEventListener('message', handlePreviewRuntimeMessage);
  document.addEventListener('appauth:before-navigation', flushCurrentWork);
  document.addEventListener('appauth:ready', () => { loadEditorPreferences(); load(); applyVsCodeMode(); applyFocusMode(); renderAll(); applyDrawerStates(); });

  $$('[data-info]').forEach(button => button.addEventListener('click', () => { if (button.dataset.info === 'dicas') { state.helpUsage[file] = Number(state.helpUsage[file] || 0) + 1; save(); renderAutocompleteAvailability(); } openInfo(button.dataset.info); }));
  load();
  startActiveTimer();
  renderAll();
}

function fileIndex() { return order().indexOf(file); }

function setView(nextView) {
  view = nextView;
  registerActivity();
  window.AppAuth?.log('modo_exercicio_alterado', { modo: nextView, arquivo: file, codigo: exercise().codigo });
  renderViews();
  updatePhase();
  renderProgress();
  if (view === 'practice') {
    renderPractice();
    applyVsCodeMode();
    applyFocusMode();
    applyDrawerStates();
    setTimeout(() => editorFocus(), 50);
  }
  if (view === 'full') renderFull();
  if (view === 'explain') renderExplain();
}

function renderAll() {
  window.dispatchEvent(new CustomEvent('agv:activity-open',{detail:{numero:exercise().numero}}));
  if (!file || !order().includes(file)) file = order()[0];
  const course = disciplineEntry(activeDisciplineSlug());
  if (course && $('#studentCourseLabel')) $('#studentCourseLabel').textContent = `2 DS Sub - ${course.label} - Modo Aluno`;
  $('#studentTitle').textContent = exercise().titulo;
  renderTabs();
  renderExplain();
  renderFull();
  renderPractice();
  renderCompletion();
  renderProgress();
  renderCodeHealth();
  renderBehaviorChecklist();
  applyFocusMode();
  applyDrawerStates();
  renderActiveTime();
  renderVsCodeExplorer();
  updateVsCodeStatus();
}

function renderTabs() {
  $('#studentFileTabs').innerHTML = order().map(key => `
    <button data-file="${key}" class="${file === key ? 'active' : ''} ${state.done[key] ? 'done' : ''}" ${state.unlocked[key] ? '' : 'disabled'}>${Utils.escapeHtml(exercise().nomesArquivos[key])}</button>
  `).join('');
  $$('#studentFileTabs button').forEach(button => button.addEventListener('click', () => {
    if (button.disabled) return;
    clearTimeout(saveStateTimer);
    syncCurrentEditorAnswer();
    save();
    resetTransientRuntime('Arquivo alterado. O preview anterior foi descartado.');
    file = button.dataset.file;
    explainStep = Math.min(state.explained[file] || 0, Math.max(0, exercise().passos[file].length - 1));
    view = state.done[file] ? 'practice' : 'explain';
    renderAll();
  }));
  renderVsCodeExplorer();
}

function renderViews() {
  $('#explainView').hidden = view !== 'explain';
  $('#fullView').hidden = view !== 'full';
  $('#practiceView').hidden = view !== 'practice';
  $('#completion').hidden = view !== 'completion';
}

function renderExplain() {
  const steps = exercise().passos[file] || [{ titulo: 'Arquivo completo', linhas: [1, 9999], explicacao: 'Estude o arquivo completo.' }];
  explainStep = Math.max(0, Math.min(explainStep, steps.length - 1));
  const selected = steps[explainStep];
  $('#explainCounter').textContent = `Parte ${explainStep + 1} de ${steps.length}`;
  $('#explainTitle').textContent = selected.titulo;
  $('#explainText').textContent = selected.explicacao;
  renderPedagogicalDetails(selected);
  renderVisualLesson(selected);
  $('#studentStepResult').textContent = resultDescription(file);
  $('#explainFileName').textContent = exercise().nomesArquivos[file];
  Utils.renderCode($('#explainCode'), exercise().arquivos[file], language(file), selected.linhas, true);
  $('#explainPrev').disabled = explainStep === 0 && fileIndex() === 0;
  $('#explainNext').textContent = explainStep === steps.length - 1 ? 'Ver código completo' : 'Próxima parte';
  const understood = Number(state.understood[file] || 0) >= explainStep + 1;
  const understoodButton = $('#markUnderstood');
  if (understoodButton) {
    understoodButton.textContent = understood ? 'Parte compreendida' : 'Já entendi esta parte';
    understoodButton.classList.toggle('success', understood);
  }
  renderTutorialPreview(selected.linhas);
  renderViews();
  updatePhase();
  renderProgress();
}

function renderVisualLesson(selected) {
  const lesson = exercise().aulaVisual;
  const panel = $('#visualLesson');
  if (!panel) return;
  if (!lesson) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  $('#visualLessonTitle').textContent = lesson.titulo || 'Mapa visual do conceito';
  $('#visualLessonQuestion').textContent = lesson.pergunta || '';
  $('#visualLessonCentral').textContent = lesson.ideiaCentral || '';
  $('#visualLessonObserve').textContent = lesson.observe || '';
  $('#visualLessonChallenge').textContent = lesson.miniDesafio || '';

  const focus = selected?.focoVisual || '';
  const flow = Array.isArray(lesson.fluxo) ? lesson.fluxo : [];
  const active = flow.find(item => item.id === focus);
  $('#visualLessonFocus').textContent = active ? `Foco agora: ${active.rotulo}` : 'Visão geral';
  $('#visualLessonFlow').innerHTML = flow.map((item, index) => `
    <article class="visual-flow-item ${item.id === focus ? 'active' : ''}">
      <span class="visual-flow-number">${index + 1}</span>
      <div><strong>${Utils.escapeHtml(item.rotulo || '')}</strong><p>${Utils.escapeHtml(item.detalhe || '')}</p></div>
    </article>`).join('');

  const comparison = Array.isArray(lesson.comparacao) ? lesson.comparacao : [];
  $('#visualLessonCompare').innerHTML = comparison.map(item => `
    <article><strong>${Utils.escapeHtml(item.titulo || '')}</strong><p>${Utils.escapeHtml(item.texto || '')}</p></article>`).join('');
}

function renderPedagogicalDetails(selected) {
  const details = selected.detalhes || {};
  $('#detailSimple').textContent = details.explicacaoSimples || selected.explicacao || 'Leia o trecho como uma pequena etapa do programa.';
  $('#detailExample').textContent = details.exemploPratico || 'Relacione este trecho ao resultado mostrado no preview ou ao comportamento esperado do exercício.';
  $('#detailObjective').textContent = details.objetivo || selected.explicacao || 'Observe a função deste bloco.';
  $('#detailWhy').textContent = details.porque || 'Este bloco contribui para o funcionamento completo do exercício.';
  $('#detailOrder').textContent = details.ordem || 'Leia e execute as instruções na ordem em que aparecem.';
  $('#detailError').textContent = details.erroComum || 'Compare nomes, pontuação e posição das instruções.';
  $('#detailCheck').textContent = details.conferir || 'Observe o trecho, o preview e valide com suas palavras.';

  const glossary = exercise().glossario || [];
  const ids = selected.termos || [];
  const terms = ids.map(id => glossary.find(item => item.id === id) || Utils.glossaryTerm?.(id)).filter(Boolean);
  const buttons = $('#contextTermButtons');
  const panel = $('#contextTermPanel');
  buttons.innerHTML = terms.length
    ? terms.map(item => `<button class="secondary compact" type="button" data-context-term="${Utils.escapeHtml(item.id)}">${Utils.escapeHtml(item.termo)}</button>`).join('')
    : '<span class="muted">Este trecho ainda não possui termos contextuais cadastrados.</span>';
  panel.hidden = true;
  panel.innerHTML = '';
  $$('[data-context-term]', buttons).forEach(button => button.addEventListener('click', () => {
    const item = glossary.find(entry => entry.id === button.dataset.contextTerm) || Utils.glossaryTerm?.(button.dataset.contextTerm);
    if (!item) return;
    panel.innerHTML = `<span class="chip info">${Utils.escapeHtml(item.categoria)}</span><h4>${Utils.escapeHtml(item.termo)}</h4><p><strong>Significado:</strong> ${Utils.escapeHtml(item.traducao || '')}</p><p>${Utils.escapeHtml(item.explicacao || '')}</p>${item.ondeAparece ? `<p><strong>Onde aparece aqui:</strong> ${Utils.escapeHtml(item.ondeAparece)}</p>` : ''}${item.exemploPratico ? `<p><strong>Exemplo prático:</strong> ${Utils.escapeHtml(item.exemploPratico)}</p>` : ''}${item.analogia ? `<p><strong>Analogia para lembrar:</strong> ${Utils.escapeHtml(item.analogia)}</p>` : ''}<p><strong>Erro comum:</strong> ${Utils.escapeHtml(item.erroComum || '')}</p><p class="muted">Linguagem: ${Utils.escapeHtml(item.linguagem || '')} • origem: ${Utils.escapeHtml(item.exercicio || exercise().codigo)}</p>`;
    panel.hidden = false;
    panel.focus();
  }));

  const hints = exercise().dicasProgressivas?.[file] || [];
  $('#progressiveHints').innerHTML = hints.map((hint, index) => `<li><strong>Dica ${index + 1}:</strong> ${Utils.escapeHtml(hint)}</li>`).join('') || '<li>Use o Modo Ajuda depois da primeira tentativa de validação.</li>';
}

function resultDescription(key) {
  const lang = language(key);
  if (lang === 'html') return 'O preview destaca a estrutura relacionada ao trecho.';
  if (lang === 'css') return 'O preview destaca os elementos afetados pelas regras visuais.';
  if (lang === 'js') return 'Quando possível, teste a função ou interação diretamente no preview.';
  if (lang === 'python') return 'Compare a entrada, o processamento e a saída com a versão JavaScript e execute no terminal Python.';
  if (lang === 'kotlin' || lang === 'xml') return 'Relacione o arquivo ao projeto Android e confira nomes, IDs e tipos.';
  if (lang === 'json') return 'Confira a estrutura de objetos, listas, chaves, valores e vírgulas.';
  return 'Observe a função deste arquivo dentro do projeto e como ele se relaciona aos demais.';
}

function renderTutorialPreview(range) {
  const result = Utils.buildPreviewDocument(exercise(), { file, range, tutorial: true });
  tutorialFunctions = result.functions || [];
  $('#studentTutorialPreview').srcdoc = result.srcdoc;
  $('#studentTutorialLabel').textContent = `${exercise().nomesArquivos[file]} - parte ${explainStep + 1}`;
  $('#studentTutorialMessage').textContent = result.message || 'Relacione o trecho destacado ao resultado ou à função do arquivo.';
  const button = $('#studentRunStep');
  button.hidden = language(file) !== 'js' || !tutorialFunctions.length;
  button.textContent = tutorialFunctions.length ? `Executar ${tutorialFunctions[0]}()` : 'Executar ação';
}

function runTutorialAction() {
  const frame = $('#studentTutorialPreview');
  const functionName = tutorialFunctions[0];
  if (!functionName || !frame?.contentWindow) return;
  const requestId = `aluno-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let completed = false;
  const handleResult = event => {
    const data = event.data || {};
    if (event.source !== frame.contentWindow || data.source !== 'ds2sub-tutorial-result' || data.requestId !== requestId) return;
    completed = true;
    window.removeEventListener('message', handleResult);
    Utils.toast(data.ok ? `A função ${functionName}() foi executada.` : 'Teste a ação diretamente no preview.');
  };
  window.addEventListener('message', handleResult);
  frame.contentWindow.postMessage({ source: 'ds2sub-tutorial-action', requestId, functionName }, '*');
  window.setTimeout(() => {
    if (completed) return;
    window.removeEventListener('message', handleResult);
    Utils.toast('Use o preview para testar a ação manualmente.');
  }, 1200);
}

function markCurrentStepUnderstood() {
  state.understood[file] = Math.max(Number(state.understood[file] || 0), explainStep + 1);
  state.explained[file] = Math.max(Number(state.explained[file] || 0), explainStep + 1);
  save();
  const button = $('#markUnderstood');
  if (button) {
    button.textContent = 'Parte compreendida';
    button.classList.add('success');
  }
  Utils.toast('Compreensão registrada. Nenhum código foi inserido no editor.');
  window.AppAuth?.log('parte_compreendida', { arquivo: file, passo: explainStep + 1, codigo: exercise().codigo });
  renderProgress();
}

function previousExplain() {
  if (explainStep > 0) { explainStep -= 1; renderExplain(); return; }
  if (fileIndex() > 0) {
    file = order()[fileIndex() - 1];
    explainStep = Math.max(0, (exercise().passos[file]?.length || 1) - 1);
    renderAll();
  }
}

function nextExplain() {
  const steps = exercise().passos[file] || [];
  state.explained[file] = Math.max(state.explained[file] || 0, explainStep + 1);
  save();
  if (explainStep < steps.length - 1) { explainStep += 1; renderExplain(); }
  else { view = 'full'; renderAll(); }
}

function renderFull() {
  $('#fullFileName').textContent = exercise().nomesArquivos[file];
  Utils.renderCode($('#fullCode'), exercise().arquivos[file], language(file), null, false);
  const result = Utils.buildPreviewDocument(exercise(), { file, range: null, tutorial: false });
  $('#studentFullPreview').srcdoc = result.srcdoc;
}

function renderPractice() {
  lastValidationResult = null;
  diagnosticErrorLine = null;
  hideValidationDetails();
  setDiagnosticLineMarker(null);
  const helpButton = $('#openDiagnosticHelp');
  if (helpButton) helpButton.hidden = true;
  $('#referenceFileName').textContent = exercise().nomesArquivos[file];
  $('#editorFileName').textContent = exercise().nomesArquivos[file];
  Utils.renderCode($('#referenceFull'), exercise().arquivos[file], language(file), null, false);
  syncReferenceVsEditor();
  renderVsCodeExplorer();
  setEditorValue(state.answers[file] || '');
  syncEditor();
  renderOrigin();
  renderAutocompleteAvailability();
  renderExecutionFreshness();
  renderPracticePreview(false);
  renderPythonTerminal();
  applyVsCodeMode();
}

function renderOrigin() {
  const origin = state.origin[file];
  const labels = {
    sistema: 'base fornecida pela plataforma',
    misto: 'digitado com apoio automático registrado',
    digitado: 'digitado pelo aluno'
  };
  $('#originStatus').textContent = labels[origin] || labels.digitado;
  $('#originStatus').style.background = origin === 'sistema' ? '#654b12' : origin === 'misto' ? '#4b2d73' : '#1d2a46';
  const metadata = state.autocomplete?.[file] || {};
  $('#undoAutocomplete').hidden = !metadata.active || typeof metadata.lastSnapshot !== 'string';
}

function pedagogicalPhase() {
  return Number(exercise().fasePedagogica || exercise().numero || 1);
}

function autocompleteEligibility() {
  const lang = language(file);
  const allowedLanguage = ['html', 'css', 'markdown'].includes(lang);
  if (!allowedLanguage) {
    return { allowed: false, reason: `${exercise().nomesArquivos[file]} contém lógica ou conteúdo que deve ser digitado pelo aluno. Use dicas, lacunas e exemplos diferentes.` };
  }
  const phase = pedagogicalPhase();
  if (phase <= 3) return { allowed: true, reason: `Fase pedagógica ${phase}: apoio controlado disponível para um bloco de ${lang.toUpperCase()}, sem preencher a lógica principal.` };
  const activeReady = Number(state.activeSeconds || 0) >= 600;
  const attemptsReady = Number(state.attempts[file] || 0) >= 2;
  const helpReady = Number(state.helpUsage[file] || 0) >= 1;
  const codeReady = String(state.answers[file] || editorValue() || '').trim().length >= 20;
  const missing = [];
  if (!activeReady) missing.push(`tempo ativo: ${formatTime(state.activeSeconds || 0)} de 10:00`);
  if (!attemptsReady) missing.push(`tentativas de validação: ${state.attempts[file] || 0} de 2`);
  if (!helpReady) missing.push('consultar pelo menos uma dica');
  if (!codeReady) missing.push('iniciar o código no editor');
  return {
    allowed: activeReady && attemptsReady && helpReady && codeReady,
    reason: missing.length ? `A ajuda permanece bloqueada. Falta: ${missing.join('; ')}.` : 'Tentativa real confirmada: apoio parcial liberado para este arquivo.'
  };
}

function autocompleteMarker(lang) {
  if (lang === 'html' || lang === 'markdown') return '<!-- Código parcialmente completado pelo sistema por meio da opção "Completar esta etapa". -->';
  if (lang === 'css') return '/* Código parcialmente completado pelo sistema por meio da opção "Completar esta etapa". */';
  return '// Código parcialmente completado pelo sistema mediante autorização registrada.';
}

function supportBlockForCurrentFile() {
  const lang = language(file);
  const content = String(editorValue() || state.answers[file] || '');
  const cssName = exercise().nomesArquivos.css || 'estilo.css';
  const jsName = exercise().nomesArquivos.js || 'script.js';
  if (lang === 'html') {
    if (!content.trim()) {
      return {
        id: 'estrutura-html-inicial',
        title: 'Estrutura inicial do HTML',
        block: `<!DOCTYPE html>\n${autocompleteMarker('html')}\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Complete o título da página</title>\n    ${exercise().arquivos.css ? `<link rel="stylesheet" href="${cssName}">` : ''}\n    ${exercise().arquivos.js ? `<script src="${jsName}" defer><\/script>` : ''}\n</head>\n<body>\n    <!-- Continue a estrutura solicitada no exercício. -->\n</body>\n</html>`.replace(/^\s+$/gm, '').replace(/\n{3,}/g, '\n\n')
      };
    }
    if (!/<meta\s+name=["']viewport["']/i.test(content)) return { id: 'meta-viewport', title: 'Configuração responsiva do documento', block: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' };
    if (exercise().arquivos.css && !/<link\b[^>]*rel=["']stylesheet["']/i.test(content)) return { id: 'ligacao-css', title: 'Ligação com o arquivo CSS', block: `<link rel="stylesheet" href="${cssName}">` };
    if (exercise().arquivos.js && !/<script\b[^>]*src=/i.test(content)) return { id: 'ligacao-js', title: 'Ligação com o JavaScript', block: `<script src="${jsName}" defer><\/script>` };
    return { id: 'bloco-semantico', title: 'Bloco semântico de apoio', block: '<section aria-labelledby="titulo-secao">\n    <h2 id="titulo-secao">Complete o título</h2>\n    <p>Complete o conteúdo solicitado.</p>\n</section>' };
  }
  if (lang === 'css') {
    if (!content.trim()) return { id: 'base-css', title: 'Base visual sem resolver o layout', block: `${autocompleteMarker('css')}\n* {\n    box-sizing: border-box;\n}\n\nbody {\n    margin: 0;\n    font-family: Arial, sans-serif;\n    line-height: 1.5;\n}\n\n/* Continue com as regras específicas do exercício. */` };
    if (!/box-sizing\s*:\s*border-box/i.test(content)) return { id: 'box-sizing', title: 'Configuração do Box Model', block: '* {\n    box-sizing: border-box;\n}' };
    return { id: 'media-query-base', title: 'Estrutura de media query sem a solução', block: '@media (max-width: 700px) {\n    /* Complete aqui as adaptações para telas menores. */\n}' };
  }
  if (lang === 'markdown') {
    return { id: 'estrutura-readme', title: 'Estrutura de documentação', block: `${autocompleteMarker('markdown')}\n# ${exercise().codigo} - ${exercise().nomeCurto}\n\n## Objetivo\n\nEscreva com suas palavras.\n\n## Arquivos\n\nListe os arquivos utilizados.\n\n## Como executar\n\nExplique os passos para testar o projeto.` };
  }
  return null;
}

function renderAutocompleteAvailability() {
  const button = $('#completeStage');
  if (!button) return;
  const eligibility = autocompleteEligibility();
  const support = supportBlockForCurrentFile();
  button.hidden = !support;
  button.disabled = !eligibility.allowed || !support;
  button.textContent = eligibility.allowed ? 'Completar esta etapa' : 'Completar esta etapa - bloqueado';
  button.title = eligibility.reason;
  const metadata = state.autocomplete?.[file] || {};
  $('#undoAutocomplete').hidden = !metadata.active || typeof metadata.lastSnapshot !== 'string';
}

function openAutocompleteModal() {
  const eligibility = autocompleteEligibility();
  const support = supportBlockForCurrentFile();
  if (!eligibility.allowed || !support) {
    Utils.toast(eligibility.reason || 'Não há bloco automático permitido para este arquivo.');
    return;
  }
  const editor = $('#studentEditor');
  const selection = editorSelectionRange();
  pendingAutocomplete = { ...support, eligibility, file, before: editorValue(), cursorStart: selection.start, cursorEnd: selection.end };
  autocompleteReturnFocus = document.activeElement;
  $('#autocompleteBadge').textContent = pedagogicalPhase() <= 3 ? `Fase pedagógica ${pedagogicalPhase()}` : 'Liberado após tentativa real';
  $('#autocompleteFile').textContent = exercise().nomesArquivos[file];
  $('#autocompleteCode').textContent = support.block;
  $('#autocompleteReason').textContent = `${eligibility.reason} O trecho inserido será marcado e registrado no histórico.`;
  $('#autocompleteConfirmRead').checked = false;
  $('#confirmAutocomplete').disabled = true;
  const modal = $('#autocompleteModal');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#autocompleteConfirmRead').focus({ preventScroll: true }), 30);
}

function closeAutocompleteModal() {
  const modal = $('#autocompleteModal');
  if (!modal) return;
  const wasOpen = !modal.hidden;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  pendingAutocomplete = null;
  if (wasOpen && autocompleteReturnFocus?.focus && document.contains(autocompleteReturnFocus)) autocompleteReturnFocus.focus({ preventScroll: true });
  autocompleteReturnFocus = null;
}

function trapModalFocus(modal, event) {
  const controls = [...modal.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled && !element.hidden && element.getClientRects().length > 0);
  if (!controls.length) return;
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) { event.preventDefault(); first.focus(); }
}

function ensureAutocompleteMarker(content, lang) {
  const marker = autocompleteMarker(lang);
  if (content.includes(marker)) return content;
  if (lang === 'html' && /^\s*<!DOCTYPE[^>]*>/i.test(content)) return content.replace(/^(\s*<!DOCTYPE[^>]*>\s*)/i, `$1\n${marker}\n`);
  return `${marker}\n${content}`;
}

function applyAutocomplete() {
  if (!pendingAutocomplete || !$('#autocompleteConfirmRead').checked) return;
  const editor = $('#studentEditor');
  const data = pendingAutocomplete;
  const meta = state.autocomplete[file] || { used: false, active: false, events: [] };
  captureSnapshot('antes_do_autocompletar');
  const before = data.before;
  let after;
  if (!before.trim()) {
    after = data.block;
  } else {
    const prefix = before.slice(0, data.cursorStart);
    const suffix = before.slice(data.cursorEnd);
    const separatorBefore = prefix && !prefix.endsWith('\n') ? '\n' : '';
    const separatorAfter = suffix && !suffix.startsWith('\n') ? '\n' : '';
    after = `${prefix}${separatorBefore}${data.block}${separatorAfter}${suffix}`;
    after = ensureAutocompleteMarker(after, language(file));
  }
  const eventData = {
    id: `${exercise().codigo}-${file}-${Date.now()}`,
    blockId: data.id,
    blockTitle: data.title,
    file,
    fileName: exercise().nomesArquivos[file],
    language: language(file),
    phase: pedagogicalPhase(),
    origin: pedagogicalPhase() <= 3 ? 'fase_inicial' : 'tentativa_prolongada',
    linesInserted: data.block.split('\n').length,
    charactersInserted: data.block.length,
    approximatePercentage: Math.min(100, Math.round(data.block.length / Math.max(1, exercise().arquivos[file].length) * 100)),
    activeSeconds: Number(state.activeSeconds || 0),
    attempts: Number(state.attempts[file] || 0),
    tipsUsed: Number(state.helpUsage[file] || 0),
    at: new Date().toISOString(),
    beforeHash: stableHash(before),
    afterHash: stableHash(after),
    undone: false
  };
  meta.used = true;
  meta.active = true;
  meta.lastSnapshot = before;
  meta.markerRemoved = false;
  meta.events = [...(meta.events || []), eventData];
  state.autocomplete[file] = meta;
  state.answers[file] = after;
  markAnswerContext(file);
  state.origin[file] = 'misto';
  state.done[file] = false;
  state.completedAt = null;
  setEditorValue(after);
  invalidateExecution('A etapa recebeu apoio automático. Revise o trecho e execute novamente.');
  closeAutocompleteModal();
  save();
  syncEditor();
  renderPracticePreview(false);
  renderOrigin();
  renderAutocompleteAvailability();
  renderCodeHealth();
  renderTabs();
  setEditorSelectionRange(0, Math.min(after.length, data.block.length));
  Utils.toast('Etapa completada parcialmente. Leia o trecho inserido, execute, interaja e valide.');
  window.AppAuth?.log('autocompletar_utilizado', eventData);
}

function undoAutocomplete() {
  const meta = state.autocomplete?.[file];
  if (!meta?.active || typeof meta.lastSnapshot !== 'string') {
    Utils.toast('Não existe preenchimento automático ativo para desfazer.');
    return;
  }
  const editor = $('#studentEditor');
  captureSnapshot('antes_de_desfazer_autocompletar');
  const previous = meta.lastSnapshot;
  const events = [...(meta.events || [])];
  const last = [...events].reverse().find(item => !item.undone);
  if (last) { last.undone = true; last.undoneAt = new Date().toISOString(); }
  meta.events = events;
  meta.active = false;
  meta.lastSnapshot = null;
  state.autocomplete[file] = meta;
  state.answers[file] = previous;
  markAnswerContext(file);
  state.origin[file] = 'digitado';
  state.done[file] = false;
  state.completedAt = null;
  setEditorValue(previous);
  invalidateExecution('O preenchimento automático foi desfeito. Execute novamente.');
  save();
  syncEditor();
  renderPracticePreview(false);
  renderOrigin();
  renderAutocompleteAvailability();
  renderCodeHealth();
  renderTabs();
  Utils.toast('Preenchimento automático desfeito. O histórico de uso foi preservado.');
  window.AppAuth?.log('autocompletar_desfeito', { arquivo: file, codigo: exercise().codigo, eventId: last?.id || null });
}

function toggleVsCodeMode() {
  state.ui = state.ui || {};
  state.ui.vsCodeMode = !state.ui.vsCodeMode;
  if (state.ui.vsCodeMode) state.ui.focusMode = false;
  save();
  applyVsCodeMode();
  applyFocusMode();
  window.AppAuth?.log('modo_vscode_alterado', { ativo: state.ui.vsCodeMode, codigo: exercise().codigo });
}

function applyVsCodeMode() {
  const active = Boolean(state.ui?.vsCodeMode);
  document.body.classList.toggle('vscode-mode', active);
  const button = $('#toggleVsCodeMode');
  if (button) { button.setAttribute('aria-pressed', String(active)); button.textContent = active ? 'Sair do Modo VS Code' : 'Abrir Modo VS Code'; }
  const shellbar = $('#vscodeShellbar');
  const explorer = $('#vscodeExplorer');
  const statusbar = $('#vscodeStatusbar');
  const referenceWrap = $('#referenceVsEditorWrap');
  const referenceStatic = $('#referenceFull');
  if (shellbar) shellbar.hidden = !active;
  if (explorer) explorer.hidden = !active;
  if (statusbar) statusbar.hidden = !active;
  if (referenceWrap) referenceWrap.hidden = !active;
  if (referenceStatic) referenceStatic.hidden = active;
  if ($('#vscodeMobileTabs')) $('#vscodeMobileTabs').hidden = !active;
  if (active) {
    ensureDrawerState();
    state.ui.drawers.reference = false;
    initReferenceCodeEditor();
    syncReferenceVsEditor();
    renderVsCodeExplorer();
    setVsCodePanel(state.ui?.vscodePanel || 'editor');
    const currentPct = Math.max(0, Math.min(100, parseInt($('#progressText')?.textContent || '0', 10) || 0));
    vscodeGaugeLast = null;
    updateVsCodeGauge(0, { immediate: true, force: true });
    requestAnimationFrame(() => {
      codeEditor?.refresh();
      referenceCodeEditor?.refresh();
      setTimeout(() => updateVsCodeGauge(currentPct, { force: true }), 60);
    });
  }
  applyDrawerStates();
  updateVsCodeStatus();
}


const PRACTICE_DRAWERS = {
  reference: { panel: '.reference-practice', header: '.code-titlebar', label: 'Código de referência' },
  preview: { panel: '.practice-preview', header: '.preview-toolbar', label: 'Preview' },
  behavior: { panel: '#behaviorCheckPanel', header: '.behavior-check-head', label: 'Checklist' },
  terminal: { panel: '#pythonTerminalPanel', header: '.python-terminal-header', label: 'Terminal' }
};

function ensureDrawerState() {
  state.ui = state.ui || {};
  state.ui.drawers = { reference: false, preview: false, behavior: true, terminal: true, ...(state.ui.drawers || {}) };
}

function drawerToggleButton(key) {
  return document.querySelector(`[data-panel-toggle="${key}"]`);
}

function setDrawerCollapsed(key, collapsed, { persist = true, focusToggle = false } = {}) {
  const config = PRACTICE_DRAWERS[key];
  if (!config) return;
  ensureDrawerState();
  const panel = document.querySelector(config.panel);
  if (!panel) return;
  state.ui.drawers[key] = Boolean(collapsed);
  panel.classList.toggle('panel-collapsed', Boolean(collapsed));
  panel.dataset.collapsed = String(Boolean(collapsed));
  const button = drawerToggleButton(key);
  if (button) {
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-label', `${collapsed ? 'Abrir' : 'Recolher'} ${config.label}`);
    button.textContent = collapsed ? 'Abrir' : 'Recolher';
    if (focusToggle) button.focus({ preventScroll: true });
  }
  if (persist) save();
}

function applyDrawerStates() {
  ensureDrawerState();
  Object.keys(PRACTICE_DRAWERS).forEach(key => setDrawerCollapsed(key, Boolean(state.ui.drawers[key]), { persist: false }));
}

function ensureDrawerControls() {
  Object.entries(PRACTICE_DRAWERS).forEach(([key, config]) => {
    const panel = document.querySelector(config.panel);
    const header = panel?.querySelector(config.header);
    if (!panel || !header || drawerToggleButton(key)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ghost compact panel-toggle';
    button.dataset.panelToggle = key;
    button.addEventListener('click', () => setDrawerCollapsed(key, !panel.classList.contains('panel-collapsed'), { focusToggle: true }));
    const preferredTarget = header.querySelector('.preview-toolbar-group:last-child, .python-terminal-actions') || header;
    preferredTarget.append(button);
  });
  applyDrawerStates();
}

function openPracticeDrawer(key) {
  setDrawerCollapsed(key, false, { persist: true });
}

function applyFocusMode() {
  const active = Boolean(state.ui?.focusMode);
  document.body.classList.toggle('focus-mode', active);
  const button = $('#toggleFocusMode');
  if (button) {
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Sair do Modo Foco' : 'Modo Foco';
  }
  setTimeout(() => codeEditor?.refresh(), 0);
}

function toggleFocusMode() {
  state.ui = state.ui || {};
  state.ui.focusMode = !state.ui.focusMode;
  if (state.ui.focusMode && state.ui.vsCodeMode) state.ui.vsCodeMode = false;
  save();
  applyVsCodeMode();
  applyFocusMode();
  Utils.toast(state.ui.focusMode ? 'Modo Foco ativado.' : 'Modo Foco desativado.');
  window.AppAuth?.log('modo_foco_alterado', { ativo: state.ui.focusMode, codigo: exercise().codigo });
}

function runCurrentCode() {
  if (language(file) === 'python') {
    openPracticeDrawer('terminal');
    runPythonTerminal();
    return;
  }
  openPracticeDrawer('preview');
  if (behaviorDefinition()) openPracticeDrawer('behavior');
  clearTimeout(previewUpdateTimer);
  renderPracticePreview(true);
}

function openPracticeHelp() {
  state.helpUsage[file] = Number(state.helpUsage[file] || 0) + 1;
  save();
  if (lastValidationResult) {
    renderValidationDetails(lastValidationResult, state.attempts[file] || 1);
    Utils.toast('Ajuda do erro aberta abaixo do editor.');
  } else {
    openInfo('dicas');
  }
  renderAutocompleteAvailability();
}

function ensurePracticeActionLayout() {
  const toolbar = $('.practice-toolbar');
  const actions = toolbar?.querySelector(':scope > div:last-child');
  if (!actions || $('#runCurrentCode')) return;
  actions.classList.add('practice-primary-actions');

  const movableIds = ['reviewSteps','completeStage','undoAutocomplete','restoreSnapshot','openDiagnosticHelp'];
  const movable = movableIds.map(id => document.getElementById(id)).filter(Boolean);
  const validate = $('#validateFile');
  const vscodeButton = $('#toggleVsCodeMode');
  const downloadFileButton = $('#downloadCurrentWork');
  const downloadZipButton = $('#downloadProjectWork');
  movable.forEach(element => element.remove());
  [validate, vscodeButton, downloadFileButton, downloadZipButton].filter(Boolean).forEach(element => element.remove());

  const run = document.createElement('button');
  run.id = 'runCurrentCode';
  run.type = 'button';
  run.className = 'success';
  run.textContent = 'Executar código';
  run.addEventListener('click', runCurrentCode);

  const help = document.createElement('button');
  help.id = 'practiceHelp';
  help.type = 'button';
  help.className = 'secondary';
  help.textContent = 'Ajuda';
  help.addEventListener('click', openPracticeHelp);

  const tools = document.createElement('details');
  tools.id = 'practiceToolsMenu';
  tools.className = 'practice-tools';
  const summary = document.createElement('summary');
  summary.className = 'ghost practice-tools-summary';
  summary.textContent = 'Ferramentas';
  const menu = document.createElement('div');
  menu.className = 'practice-tools-menu';
  menu.setAttribute('role', 'group');
  menu.setAttribute('aria-label', 'Ferramentas da prática');
  movable.forEach(element => menu.append(element));

  const focus = document.createElement('button');
  focus.id = 'toggleFocusMode';
  focus.type = 'button';
  focus.className = 'ghost';
  focus.setAttribute('aria-pressed', 'false');
  focus.textContent = 'Modo Foco';
  focus.addEventListener('click', toggleFocusMode);
  menu.append(focus);
  tools.append(summary, menu);

  actions.append(run);
  if (validate) actions.append(validate);
  if (vscodeButton) actions.append(vscodeButton);
  if (downloadFileButton) actions.append(downloadFileButton);
  if (downloadZipButton) actions.append(downloadZipButton);
  actions.append(help, tools);

  menu.addEventListener('click', event => {
    if (event.target.closest('button')) tools.open = false;
  });
  document.addEventListener('pointerdown', event => {
    if (tools.open && !tools.contains(event.target)) tools.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && tools.open) {
      tools.open = false;
      summary.focus({ preventScroll: true });
    }
  });
}

function setVsCodePanel(panel) {
  if (panel === 'terminal' && !pythonFileKey()) panel = 'editor';
  if (!['explorer','reference','editor','preview','terminal'].includes(panel)) panel = 'editor';
  state.ui = state.ui || {};
  state.ui.vscodePanel = panel;
  const grid = $('.lab-grid');
  if (grid) grid.dataset.vscodePanel = panel;
  $$('#vscodeMobileTabs [data-vscode-panel]').forEach(button => button.classList.toggle('active', button.dataset.vscodePanel === panel));
  save();
}

function validate() {
  registerActivity();
  const value = editorValue();
  let result = Utils.validateCode(file, value, exercise().arquivos[file], exercise());
  const currentHash = currentProjectHash();
  const executionIsFresh = Boolean(state.execution?.ok) && !state.execution?.stale && state.execution?.hash === currentHash;
  const hasSyntaxBlocker = (result.issues || []).some(item => /sintaxe|não fechado|incomplet|delimitador|chave/i.test(`${item.title || ''} ${item.detail || ''}`));
  if (!result.ok && language(file) === 'js' && executionIsFresh && behaviorReady() && !hasSyntaxBlocker) {
    result = {
      ok: true,
      summary: 'JavaScript aprovado pelo funcionamento real no preview.',
      issues: [],
      suggestions: ['A estrutura interna ficou diferente do exemplo, mas a execução atual confirmou o comportamento esperado.'],
      firstLine: null,
      runtimeOverride: true
    };
  }
  if (!result.ok) {
    state.attempts[file] = (state.attempts[file] || 0) + 1;
    const context = Utils.diagnosticContext(value, exercise().arquivos[file], result);
    result.context = context;
    result.firstLine = context.actualLine || result.firstLine || null;
    lastValidationResult = result;
    diagnosticErrorLine = result.firstLine;
    state.lastDiagnosticLine[file] = result.firstLine || null;
    save();
    renderAutocompleteAvailability();
    const attempt = state.attempts[file];
    showValidation(`Tentativa ${attempt}: encontramos um ponto para revisar. Seu esforço está valendo - compare a pista destacada e ajuste uma coisa por vez.`, 'danger');
    window.AppAuth?.log('validacao_falhou', { arquivo: file, tentativa: attempt, resumo: result.summary, linha: result.firstLine || null });
    const helpButton = $('#openDiagnosticHelp');
    if (helpButton) helpButton.hidden = false;
    renderValidationDetails(result, attempt);
    setDiagnosticLineMarker(result.firstLine);
    updateVsCodeStatus();
    return;
  }

  captureSnapshot('arquivo_validado');
  state.answers[file] = value;
  markAnswerContext(file);
  state.done[file] = true;
  state.attempts[file] = 0;
  state.lastDiagnosticLine[file] = null;
  lastValidationResult = null;
  diagnosticErrorLine = null;
  setDiagnosticLineMarker(null);
  const helpButton = $('#openDiagnosticHelp');
  if (helpButton) helpButton.hidden = true;
  hideValidationDetails();
  const index = fileIndex();
  if (index < order().length - 1) {
    state.unlocked[order()[index + 1]] = true;
    save();
    showValidation(result.runtimeOverride ? 'Arquivo aprovado pelo funcionamento real no preview. O próximo arquivo foi liberado.' : 'Arquivo validado pelos conceitos essenciais. O próximo arquivo foi liberado.', 'success');
    window.AppAuth?.log('arquivo_validado', { arquivo: file, codigo: exercise().codigo });
    setTimeout(() => { file = order()[index + 1]; explainStep = 0; view = 'explain'; renderAll(); }, 500);
    return;
  }

  save();
  if (Number(state.activeSeconds || 0) < minimumSeconds()) {
    const missing = minimumSeconds() - Number(state.activeSeconds || 0);
    showValidation(`Todos os arquivos foram validados. Continue revisando e testando por mais ${formatTime(missing)}. Quando o tempo mínimo for atingido, o botão Concluir atividade será liberado.`, 'warning');
    renderActiveTime();
    return;
  }
  finishExercise();
}

function allFilesValidated() {
  return order().length > 0 && order().every(key => Boolean(state.done[key]));
}

function finishExercise() {
  if (!allFilesValidated()) {
    showValidation('Valide todos os arquivos antes de concluir.', 'warning');
    return false;
  }
  if (!executionReady()) {
    showValidation(pythonFileKey() ? 'Os arquivos foram validados, mas ainda é necessário testar o preview atual e executar main.py no terminal pedagógico.' : 'Os arquivos foram validados, mas o código atual ainda precisa ser executado e aprovado no teste comportamental. Use Executar / atualizar preview e complete os critérios exibidos.', 'warning');
    renderExecutionFreshness();
    return false;
  }
  if (Number(state.activeSeconds || 0) < minimumSeconds()) {
    const missing = minimumSeconds() - Number(state.activeSeconds || 0);
    showValidation(`O código está validado, mas ainda faltam ${formatTime(missing)} de atividade. Continue revisando e testando.`, 'warning');
    renderActiveTime();
    return false;
  }
  state.completedAt = state.completedAt || new Date().toISOString();
  save();
  window.AppAuth?.log('exercicio_concluido', { numero: exercise().numero, codigo: exercise().codigo, activeSeconds: state.activeSeconds });
  view = 'completion';
  renderAll();
  $('#completion').scrollIntoView({ behavior: 'smooth' });
  return true;
}

function renderCodeHealth() {
  const element = $('#codeHealth');
  if (!element) return;
  const value = view === 'practice' ? (editorValue() || state.answers[file] || '') : (state.answers[file] || '');
  const analysis = state.done[file] ? { percentage: 100, remaining: 0, status: 'Validado', state: 'correct', message: 'Este arquivo já foi validado.' } : Utils.analyzeCompleteness(file, value, exercise().arquivos[file], exercise());
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
  panel.dataset.stale = 'false';
  $('#diagnosticRevalidateNote').hidden = true;
  $('#validationAttemptBadge').textContent = `${attempt} tentativa${attempt === 1 ? '' : 's'}`;
  $('#validationSummary').textContent = result.summary || 'Revise os pontos identificados.';

  const manual = state.origin[file] !== 'sistema';
  $('#effortCoachTitle').textContent = manual ? 'Parabéns por insistir e revisar seu próprio código' : 'Use a base como apoio, mas faça a revisão com atenção';
  $('#effortCoachMessage').textContent = manual
    ? 'Digitar, testar e corrigir sem apenas aceitar uma resposta pronta é exatamente o processo que desenvolve autonomia. Um erro de tag, aspa, espaço, nome ou fechamento não apaga seu esforço: ele mostra o próximo detalhe que seu olhar de programador está aprendendo a reconhecer.'
    : 'Mesmo com um código-base, a aprendizagem acontece quando você compara, entende e corrige cada parte. Faça uma alteração por vez, teste no preview e observe o que mudou.';

  const context = result.context || Utils.diagnosticContext(editorValue(), exercise().arquivos[file], result);
  result.context = context;
  const spotlight = $('#errorSpotlight');
  if (context.actualLine || context.expectedLine) {
    spotlight.hidden = false;
    $('#errorSpotlightLine').textContent = context.actualLine ? `linha provável ${context.actualLine}` : 'trecho provável';
    $('#errorSpotlightTitle').textContent = context.actualLine ? `Observe primeiro a linha ${context.actualLine}` : 'Compare os trechos abaixo';
    $('#errorSpotlightGuidance').textContent = context.guidance;
    $('#studentErrorSnippet').textContent = context.actualSnippet;
    $('#referenceErrorSnippet').textContent = context.expectedSnippet;
  } else {
    spotlight.hidden = true;
  }

  const issues = result.issues?.length ? result.issues : [{ title: 'Diferença encontrada', detail: 'Revise o arquivo com o tutorial.' }];
  $('#validationIssues').innerHTML = '';
  issues.slice(0, 8).forEach(issue => {
    const item = document.createElement('li');
    const title = document.createElement('strong'); title.textContent = issue.title; item.append(title);
    item.append(document.createTextNode(` - ${issue.detail}`));
    if (issue.line) { const line = document.createElement('span'); line.className = 'validation-line'; line.textContent = `linha ${issue.line}`; item.append(line); }
    $('#validationIssues').append(item);
  });
  $('#validationSuggestions').innerHTML = '';
  const suggestions = [...(result.suggestions || []), 'Corrija uma diferença por vez e valide novamente. Esse ciclo de tentativa, leitura do erro e correção é parte normal do trabalho de programação.'];
  suggestions.slice(0, 7).forEach(text => { const item = document.createElement('li'); item.textContent = text; $('#validationSuggestions').append(item); });
  $('#diagnosticFocusLine').hidden = !context.actualLine;
  setDiagnosticLineMarker(context.actualLine);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideValidationDetails() { const panel = $('#validationDetails'); if (panel) panel.hidden = true; }

function setDiagnosticLineMarker(lineNumber) {
  diagnosticErrorLine = Number(lineNumber) || null;
  $$('#lineNumbers div').forEach((line, index) => line.classList.toggle('diagnostic', Boolean(diagnosticErrorLine) && index + 1 === diagnosticErrorLine));
  if (codeEditor) {
    if (codeEditorDiagnosticLine !== null) codeEditor.removeLineClass(codeEditorDiagnosticLine, 'background', 'cm-diagnostic-line');
    codeEditorDiagnosticLine = diagnosticErrorLine ? diagnosticErrorLine - 1 : null;
    if (codeEditorDiagnosticLine !== null && codeEditorDiagnosticLine >= 0) codeEditor.addLineClass(codeEditorDiagnosticLine, 'background', 'cm-diagnostic-line');
  }
  const editor = $('.student-editor');
  if (editor) editor.dataset.helpActive = diagnosticErrorLine ? 'true' : 'false';
}

function focusDiagnosticLine() {
  const targetLine = state.lastDiagnosticLine[file];
  if (!targetLine) return;
  const lines = editorValue().split('\n');
  const start = lines.slice(0, Math.max(0, targetLine - 1)).reduce((total, line) => total + line.length + 1, 0);
  const end = start + (lines[targetLine - 1]?.length || 0);
  setEditorSelectionRange(start, end);
  updateActiveLine();
  setDiagnosticLineMarker(targetLine);
}



function showValidation(text, type) {
  const element = $('#validationMessage');
  element.textContent = text;
  element.style.color = type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)';
}

function handleEditorInput() {
  const textarea = $('#studentEditor');
  let currentValue = editorValue();
  const normalizedValue = normalizeCommonTypingSymbols(currentValue);
  if (normalizedValue !== currentValue) {
    const selection = editorSelectionRange();
    setEditorValue(normalizedValue);
    setEditorSelectionRange(selection.start, selection.end);
    currentValue = normalizedValue;
    Utils.toast('Aspas e símbolos tipográficos foram convertidos para caracteres válidos de código.');
  }
  if (textarea) textarea.value = currentValue;
  const wasValidated = Boolean(state.done[file]);
  state.answers[file] = currentValue;
  markAnswerContext(file);
  const autocompleteMeta = state.autocomplete?.[file];
  if (autocompleteMeta?.used) {
    const marker = autocompleteMarker(language(file));
    autocompleteMeta.markerRemoved = !currentValue.includes(marker);
    state.origin[file] = autocompleteMeta.active ? 'misto' : 'digitado';
  } else state.origin[file] = 'digitado';
  invalidateExecution();
  if (language(file) === 'python') invalidatePythonExecution();
  if (Date.now() - lastSnapshotAt > 30000 && currentValue.trim().length) captureSnapshot('salvamento_periodico');
  if (wasValidated) {
    state.done[file] = false;
    state.completedAt = null;
    showValidation('O arquivo foi alterado depois da validação. Teste e valide novamente.', 'warning');
  }
  scheduleSave();
  cancelAnimationFrame(editorUiFrame);
  editorUiFrame = requestAnimationFrame(() => {
    syncEditor();
    renderOrigin();
    renderAutocompleteAvailability();
    renderProgress();
    renderCodeHealth();
    if (lastValidationResult && !$('#validationDetails').hidden) {
      $('#validationDetails').dataset.stale = 'true';
      $('#diagnosticRevalidateNote').hidden = false;
      const context = Utils.diagnosticContext(currentValue, exercise().arquivos[file], lastValidationResult);
      $('#studentErrorSnippet').textContent = context.actualSnippet;
      setDiagnosticLineMarker(lastValidationResult.firstLine || context.actualLine);
    }
    renderTabs();
    updateVsCodeStatus();
  });
  if (!editorComposing) schedulePracticePreview();
}

function schedulePracticePreview() {
  clearTimeout(previewUpdateTimer);
  previewUpdateTimer = setTimeout(() => {
    if (view === 'practice') renderPracticePreview();
  }, 260);
}

function selectAllStudentCode() {
  const value = editorValue();
  if (codeEditor) {
    codeEditor.execCommand('selectAll');
    codeEditor.focus();
  } else {
    const textarea = $('#studentEditor');
    if (!textarea) return;
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(0, textarea.value.length);
  }
  updateActiveLine();
  Utils.toast(`${value.length} caracteres selecionados.`);
}

async function copyStudentCode() {
  const value = editorValue();
  const selection = editorSelectionRange();
  const filename = exercise().nomesArquivos[file] || file;
  const copied = await Utils.copy(value, `${filename} copiado sem formatação.`);
  setEditorSelectionRange(selection.start, selection.end);
  if (!copied) showValidation('Não foi possível acessar a área de transferência. Use Ctrl+A e Ctrl+C no editor.', 'warning');
}

function syncEditor() {
  const content = editorValue();
  const textarea = $('#studentEditor');
  if (textarea) textarea.value = content;
  if (codeEditor) {
    codeEditor.setOption('mode', editorModeFor(file));
    codeEditor.refresh();
  } else {
    const layer = $('#highlightLayer');
    const stage = textarea?.closest('.editor-stage');
    if (layer && stage) {
      try {
        layer.innerHTML = Utils.highlight(content, language(file)) + (content.endsWith('\n') ? '\n ' : '');
        stage.dataset.highlightReady = 'true';
      } catch (error) {
        layer.textContent = content;
        delete stage.dataset.highlightReady;
        console.warn('Realce de sintaxe alternativo indisponível.', error);
      }
    }
    const count = Math.max(1, content.split('\n').length);
    if (count !== lastEditorLineCount) {
      $('#lineNumbers').innerHTML = Array.from({ length: count }, (_, index) => `<div>${index + 1}</div>`).join('');
      lastEditorLineCount = count;
    }
  }
  syncScroll();
  updateActiveLine();
  setDiagnosticLineMarker(diagnosticErrorLine);
  updateEditorSaveStatus();
  renderEditorMetrics();
}
function syncScroll() {
  if (codeEditor) return;
  const textarea = $('#studentEditor');
  if (textarea && $('#lineNumbers')) $('#lineNumbers').scrollTop = textarea.scrollTop;
  const layer = $('#highlightLayer');
  if (textarea && layer) layer.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
}
function activeLine() {
  if (codeEditor) return codeEditor.getCursor().line + 1;
  const textarea = $('#studentEditor');
  if (!textarea) return 1;
  return textarea.value.slice(0, textarea.selectionStart).split('\n').length;
}
function updateActiveLine() {
  updateVsCodeStatus();
  if (codeEditor) return;
  $$('#lineNumbers div').forEach((line, index) => line.classList.toggle('active', index + 1 === activeLine()));
}

function tabKey(event) {
  if (event.key !== 'Tab') return;
  event.preventDefault();
  const textarea = event.target;
  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
  const selectedBlock = value.slice(lineStart, end);
  const multipleLines = selectedBlock.includes('\n');

  if (!multipleLines && start === end) {
    if (event.shiftKey) {
      const before = value.slice(lineStart, start);
      const removable = before.match(/(?: {1,4}|\t)$/)?.[0] || '';
      if (!removable) return;
      textarea.setRangeText('', start - removable.length, start, 'end');
    } else {
      textarea.setRangeText('    ', start, end, 'end');
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  const lines = selectedBlock.split('\n');
  const transformed = event.shiftKey
    ? lines.map(line => line.replace(/^(?: {1,4}|\t)/, '')).join('\n')
    : lines.map(line => `    ${line}`).join('\n');
  textarea.setRangeText(transformed, lineStart, end, 'select');
  textarea.selectionStart = lineStart;
  textarea.selectionEnd = lineStart + transformed.length;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function handlePreviewRuntimeMessage(event) {
  const frame = $('#studentPreview');
  const data = event.data || {};
  if (!frame || event.source !== frame.contentWindow) return;
  if (Number(data.runId) !== previewRunId) return;
  const renderedHash = frame.dataset.projectHash || '';
  if (renderedHash && renderedHash !== currentProjectHash()) return;
  if (data.source === 'ds2sub-preview-behavior') {
    const hash = currentProjectHash();
    if (state.execution?.hash === hash && state.execution?.ok && !state.execution?.stale) {
      const previousPassed = Boolean(state.execution?.behavior?.passed);
      state.execution.behavior = {
        hash,
        passed: Boolean(data.passed),
        criteria: { ...(data.results || {}) },
        lastCheckedAt: new Date().toISOString(),
        trigger: data.trigger || ''
      };
      save();
      const progress = behaviorProgress();
      const feedback = data.passed
        ? 'Todos os critérios comportamentais foram confirmados.'
        : `${progress.passed} de ${progress.total} critérios atendidos. Continue testando no preview.`;
      renderBehaviorChecklist(feedback);
      renderExecutionFreshness(feedback);
      renderActiveTime();
      if (data.passed && !previousPassed) window.AppAuth?.log('comportamento_preview_aprovado', { codigo: exercise().codigo, hash, criterios: progress.total });
    }
    return;
  }
  if (data.source === 'ds2sub-preview-interaction') {
    const hash = currentProjectHash();
    if (state.execution?.hash === hash && state.execution?.ok && !state.execution?.stale) {
      state.execution.interactions = Number(state.execution.interactions || 0) + 1;
      state.execution.interactionHash = hash;
      state.execution.lastInteraction = { event: data.eventType, target: data.target, at: new Date().toISOString() };
      save();
      renderExecutionFreshness(`Interação registrada: ${data.eventType} em ${data.target || 'elemento do preview'}.`);
      renderActiveTime();
      window.AppAuth?.log('preview_interacao', { codigo: exercise().codigo, eventType: data.eventType, target: data.target, hash });
    }
    return;
  }
  if (data.source !== 'ds2sub-preview') return;
  finishPreviewBusy();
  previewRuntimeMessage = data.ok ? 'Preview executado sem erros de JavaScript.' : `Erro no preview${data.line ? ` na linha ${data.line}` : ''}: ${data.message || 'erro desconhecido'}`;
  if (manualPreviewRequestedRunId === previewRunId) {
    const hash = currentProjectHash();
    state.execution = {
      ...(state.execution || {}),
      hash,
      ok: Boolean(data.ok),
      executedAt: new Date().toISOString(),
      interactions: 0,
      interactionHash: '',
      behavior: { hash, passed: false, criteria: {}, lastCheckedAt: null, trigger: 'execucao' },
      stale: !data.ok,
      lastError: data.ok ? '' : (data.message || 'Erro desconhecido')
    };
    manualPreviewRequestedRunId = null;
    captureSnapshot(data.ok ? 'execucao_sem_erro' : 'execucao_com_erro');
    save();
    window.AppAuth?.log('preview_executado', { codigo: exercise().codigo, ok: Boolean(data.ok), line: data.line || null, hash });
  }
  const message = $('#previewMessage');
  if (message && view === 'practice') {
    message.textContent = [previewSourceMessage, previewRuntimeMessage, data.ok ? 'Agora teste a interação principal no próprio preview.' : 'Corrija o código e execute novamente.'].filter(Boolean).join(' - ');
    message.dataset.state = data.ok ? 'success' : 'error';
  }
  renderExecutionFreshness();
  renderActiveTime();
}
function normalizeVirtualPath(value) {
  return String(value || '').trim().replace(/\\/g, '/').replace(/^\.\//, '').split(/[?#]/)[0];
}

function composeStudentPreview(runId = previewRunId) {
  const answers = { html: state.answers.html || '', css: state.answers.css || '', js: state.answers.js || '' };
  if (view === 'practice' && ['html', 'css', 'js'].includes(file)) answers[file] = editorValue();
  if (!exercise().arquivos.html) {
    return { html: Utils.nonWebPreview(exercise(), file), hasHtml: false, message: 'Este exercício utiliza arquivos não Web. Use o código, o terminal, o Android Studio ou o simulador indicado.' };
  }

  const sources = [
    `HTML ${answers.html.trim() ? 'digitado' : 'pendente'}`,
    `CSS ${answers.css.trim() ? 'digitado' : 'pendente'}`,
    `JavaScript ${answers.js.trim() ? 'digitado' : 'pendente'}`
  ];
  if (!answers.html.trim()) {
    return {
      html: '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><style>body{font-family:Arial;padding:24px;color:#334155}p{max-width:560px;line-height:1.6}</style></head><body><h1>Preview aguardando o HTML</h1><p>Digite o arquivo index.html. Nenhum código do gabarito é executado nesta área.</p></body></html>',
      hasHtml: true,
      message: sources.join(' - ')
    };
  }

  let html = answers.html;
  const cssName = normalizeVirtualPath(exercise().nomesArquivos?.css || 'estilo.css');
  const jsName = normalizeVirtualPath(exercise().nomesArquivos?.js || 'script.js');
  const missing = [];
  let cssLinked = false;
  let jsLinked = false;
  let deferredStudentJs = '';
  const safeCss = answers.css.replace(/<\/style/gi, '<\\/style');
  const safeJs = answers.js.replace(/<\/script/gi, '<\\/script');

  html = html.replace(/<link\b([^>]*\brel=["']stylesheet["'][^>]*)>/gi, (tag, attrs) => {
    const hrefMatch = attrs.match(/\bhref=["']([^"']+)["']/i);
    if (!hrefMatch) return tag;
    const href = normalizeVirtualPath(hrefMatch[1]);
    if (href === cssName) {
      cssLinked = true;
      return `<style data-virtual-file="${cssName}">${safeCss}</style>`;
    }
    if (!/^(https?:|data:|blob:)/i.test(hrefMatch[1])) missing.push(`CSS ${hrefMatch[1]}`);
    return `<!-- Arquivo CSS não encontrado no projeto virtual: ${hrefMatch[1]} -->`;
  });

  html = html.replace(/<script\b([^>]*\bsrc=["']([^"']+)["'][^>]*)>\s*<\/script>/gi, (tag, attrs, srcValue) => {
    const src = normalizeVirtualPath(srcValue);
    if (src === jsName) {
      jsLinked = true;
      if (/\bdefer\b/i.test(attrs)) {
        deferredStudentJs += `<script data-virtual-file="${jsName}">${safeJs}<\/script>`;
        return `<!-- ${jsName} será executado após a leitura do HTML, respeitando defer -->`;
      }
      return `<script data-virtual-file="${jsName}">${safeJs}<\/script>`;
    }
    if (!/^(https?:|data:|blob:)/i.test(srcValue)) missing.push(`JavaScript ${srcValue}`);
    return `<!-- Arquivo JavaScript não encontrado no projeto virtual: ${srcValue} -->`;
  });

  const behaviorConfig = behaviorDefinition();
  const behaviorPayload = JSON.stringify(behaviorConfig || { criterios: [] }).replace(/</g, '\\u003c');
  const runtimeReporter = `<script>(function(){const runId=${runId};const behavior=${behaviorPayload};let failed=false;const observedEvents={};const baselines={};function send(ok,message,line){parent.postMessage({source:'ds2sub-preview',runId:runId,ok:ok,message:String(message||''),line:Number(line||0)},'*')}function normalized(value){return String(value||'').replace(/\\s+/g,' ').trim()}function visible(element){if(!element||element.hidden)return false;const style=getComputedStyle(element);return style.display!=='none'&&style.visibility!=='hidden'&&style.opacity!=='0'}function eventMatches(event,criterion){if(event.type!==criterion.evento)return false;const target=event.target;if(!target||!criterion.seletor)return false;try{return Boolean(target.matches(criterion.seletor)||(target.closest&&target.closest(criterion.seletor)))}catch(error){return false}}function visualSignature(element,criterion){if(!element)return'';const style=getComputedStyle(element);const props=Array.isArray(criterion.propriedades)&&criterion.propriedades.length?criterion.propriedades:['color','backgroundColor','borderColor','fontWeight','display','flexDirection','flexWrap','gap','justifyContent','alignItems','gridTemplateColumns','gridTemplateAreas','padding','margin'];return props.map(function(prop){return prop+':'+String(style[prop]||'')}).join('|')}function baselineKey(criterion){return String(criterion.id||criterion.seletor||'')}function captureBaselines(){if(!behavior||!Array.isArray(behavior.criterios))return;behavior.criterios.filter(function(item){return item.tipo==='visualChanged'}).forEach(function(item){let element=null;try{element=document.querySelector(item.seletor)}catch(error){}baselines[baselineKey(item)]=visualSignature(element,item)})}function check(criterion){if(criterion.tipo==='event')return Boolean(observedEvents[criterion.id]);let element=null;try{element=document.querySelector(criterion.seletor)}catch(error){return false}if(!element)return false;const text=normalized(element.textContent);if(criterion.tipo==='textNonEmpty')return text.length>0;if(criterion.tipo==='textNotEquals'||criterion.tipo==='textChangedFrom')return text!==normalized(criterion.valor);if(criterion.tipo==='textIncludes')return text.toLowerCase().includes(normalized(criterion.valor).toLowerCase());if(criterion.tipo==='textIncludesAny'){const values=Array.isArray(criterion.valores)?criterion.valores:[];const count=values.filter(value=>text.toLowerCase().includes(normalized(value).toLowerCase())).length;return count>=Number(criterion.minimo||1)}if(criterion.tipo==='attributeEquals')return String(element.getAttribute(criterion.atributo))===String(criterion.valor);if(criterion.tipo==='classPresent')return element.classList.contains(criterion.valor);if(criterion.tipo==='notHidden')return visible(element);if(criterion.tipo==='visualChanged')return visualSignature(element,criterion)!==String(baselines[baselineKey(criterion)]||'');return false}function reportBehavior(trigger){if(!behavior||!Array.isArray(behavior.criterios)||!behavior.criterios.length)return;setTimeout(function(){const results={};behavior.criterios.forEach(function(item){results[item.id]=check(item)});parent.postMessage({source:'ds2sub-preview-behavior',runId:runId,trigger:String(trigger||''),results:results,passed:behavior.criterios.every(function(item){return results[item.id]===true})},'*')},80)}function dispatchSafeSubmit(form,submitter){if(!form||!form.checkValidity())return;let submitEvent;try{submitEvent=new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:submitter})}catch(error){submitEvent=new Event('submit',{bubbles:true,cancelable:true})}form.dispatchEvent(submitEvent)}function interaction(event){const target=event.target;const relevant=target&&target.closest&&target.closest('button,input,select,textarea,form,a[href],[role=button]');if(!relevant)return;const form=relevant.form||(relevant.tagName==='FORM'?relevant:null);const submitByClick=event.type==='click'&&relevant.matches&&relevant.matches('button[type=submit],input[type=submit]');const submitByEnter=event.type==='keydown'&&event.key==='Enter'&&form&&relevant.tagName!=='TEXTAREA';if((submitByClick||submitByEnter)&&form){event.preventDefault();setTimeout(function(){dispatchSafeSubmit(form,relevant)},0)}if(behavior&&Array.isArray(behavior.criterios)){behavior.criterios.filter(function(item){return item.tipo==='event'&&eventMatches(event,item)}).forEach(function(item){observedEvents[item.id]=true})}parent.postMessage({source:'ds2sub-preview-interaction',runId:runId,eventType:event.type,target:relevant.id||relevant.name||relevant.tagName.toLowerCase()},'*');reportBehavior(event.type)}window.addEventListener('error',function(event){failed=true;send(false,event.message||'Erro de JavaScript',event.lineno)});window.addEventListener('unhandledrejection',function(event){failed=true;send(false,event.reason&&event.reason.message||event.reason||'Promise rejeitada',0)});['click','input','change','submit','keydown'].forEach(function(type){document.addEventListener(type,interaction,true)});window.addEventListener('DOMContentLoaded',function(){captureBaselines();setTimeout(function(){if(!failed)send(true,'',0)},40);reportBehavior('carregamento')})})();<\/script>`;
  if (/<head(?:\s[^>]*)?>/i.test(html)) html = html.replace(/<head(\s[^>]*)?>/i, match => `${match}${runtimeReporter}`); else html = `${runtimeReporter}${html}`;
  if (deferredStudentJs) {
    if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${deferredStudentJs}</body>`);
    else html += deferredStudentJs;
  }

  if (answers.css.trim() && !cssLinked) missing.push(`CSS ${cssName} não está conectado no HTML`);
  if (answers.js.trim() && !jsLinked) missing.push(`JavaScript ${jsName} não está conectado no HTML`);
  const uniqueMissing = [...new Set(missing)];
  const fidelity = uniqueMissing.length ? `Referências pendentes: ${uniqueMissing.join('; ')}` : 'As referências do HTML correspondem aos arquivos do projeto.';
  return { html, hasHtml: true, message: `${sources.join(' - ')}. ${fidelity} O preview respeita as ligações escritas no HTML.` };
}

function renderPracticePreview(manual = false) {
  if (manual && previewExecutionBusy) return;
  previewRuntimeMessage = '';
  previewRunId += 1;
  manualPreviewRequestedRunId = manual ? previewRunId : null;
  if (manual) {
    setPreviewBusy(true);
    state.execution = { ...(state.execution || {}), behavior: { hash: currentProjectHash(), passed: false, criteria: {}, lastCheckedAt: null, trigger: 'execucao' } };
    renderBehaviorChecklist('Execução iniciada. Aguarde o carregamento do preview.');
    clearTimeout(previewExecutionTimer);
    previewExecutionTimer = setTimeout(() => {
      if (!previewExecutionBusy) return;
      finishPreviewBusy();
      const message = $('#previewMessage');
      if (message) {
        message.textContent = 'O preview demorou mais que o esperado. Confira o código e tente executar novamente.';
        message.dataset.state = 'error';
      }
    }, 4000);
  }
  const preview = composeStudentPreview(previewRunId);
  previewSourceMessage = preview.message;
  const message = $('#previewMessage');
  message.textContent = manual ? `${previewSourceMessage} - Executando o código atual...` : `${previewSourceMessage} - Visualização automática; use o botão para registrar o teste.`;
  message.dataset.state = 'pending';
  const frame = $('#studentPreview');
  frame.dataset.projectHash = currentProjectHash();
  frame.srcdoc = '';
  frame.srcdoc = preview.html;
}

function terminalAppend(text = '', tone = '') {
  const output = Array.isArray(state.pythonExecution?.output) ? state.pythonExecution.output : [];
  output.push({ text: String(text), tone });
  state.pythonExecution.output = output.slice(-180);
}

function pythonTerminalSetStatus(status, label) {
  const badge = $('#pythonTerminalStatus');
  if (!badge) return;
  badge.dataset.state = status;
  badge.textContent = label;
}

function renderPythonTerminal(message = '') {
  const panel = $('#pythonTerminalPanel');
  if (!panel) return;
  const key = pythonFileKey();
  const hasPython = Boolean(key);
  panel.hidden = !hasPython;
  const tab = $('#vscodeMobileTabs [data-vscode-panel="terminal"]');
  if (tab) tab.hidden = !hasPython;
  if (!hasPython) return;
  const output = $('#pythonTerminalOutput');
  const entries = Array.isArray(state.pythonExecution?.output) ? state.pythonExecution.output : [];
  if (!entries.length) {
    output.innerHTML = '<span class="python-terminal-line muted">Terminal pronto. Abra main.py, digite o código e selecione Executar main.py.</span>';
  } else {
    output.innerHTML = entries.map(item => `<span class="python-terminal-line ${Utils.escapeHtml(item.tone || '')}">${Utils.escapeHtml(item.text || '')}</span>`).join('');
  }
  if (message) output.insertAdjacentHTML('beforeend', `<span class="python-terminal-line muted">${Utils.escapeHtml(message)}</span>`);
  output.scrollTop = output.scrollHeight;
  const status = state.pythonExecution?.status || 'idle';
  const labels = { idle: 'Pronto para executar', running: 'Executando', waiting: 'Aguardando entrada', success: 'Execução concluída', error: 'Erro de execução', interrupted: 'Execução interrompida', stale: 'Resultado desatualizado' };
  pythonTerminalSetStatus(status, labels[status] || labels.idle);
  $('#runPythonTerminal').disabled = ['running','waiting'].includes(status);
  $('#stopPythonTerminal').disabled = !['running','waiting'].includes(status);
  const form = $('#pythonTerminalInputForm');
  const waiting = status === 'waiting' && pythonSession?.waiting;
  form.hidden = !waiting;
  if (waiting) {
    $('#pythonTerminalPrompt').textContent = pythonSession.waiting.prompt || 'Digite a entrada solicitada';
    $('#pythonTerminalInput').inputMode = pythonSession.waiting.converter === 'float' || pythonSession.waiting.converter === 'int' ? 'decimal' : 'text';
    setTimeout(() => $('#pythonTerminalInput').focus({ preventScroll: true }), 20);
  }
}

function clearPythonTerminal() {
  if (!pythonFileKey()) return;
  state.pythonExecution.output = [];
  if (!['running','waiting'].includes(state.pythonExecution.status)) state.pythonExecution.status = state.pythonExecution?.executedAt && state.pythonExecution?.stale ? 'stale' : 'idle';
  save();
  renderPythonTerminal();
}

function pythonString(value, lineNumber) {
  const match = String(value).trim().match(/^(["'])([\s\S]*)\1$/);
  if (!match) throw pythonError('SyntaxError', 'texto sem aspas válidas ou sem fechamento', lineNumber);
  return match[2].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\([\\"'])/g, '$1');
}

function pythonError(type, message, line, source = '') {
  const error = new Error(message);
  error.pythonType = type;
  error.pythonLine = line;
  error.pythonSource = source;
  return error;
}

function tokenizePythonExpression(expression, lineNumber) {
  const tokens = [];
  let index = 0;
  while (index < expression.length) {
    if (/\s/.test(expression[index])) { index += 1; continue; }
    const slice = expression.slice(index);
    const match = slice.match(/^(\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/])/);
    if (!match) throw pythonError('SyntaxError', `símbolo não suportado perto de "${slice.slice(0, 10)}"`, lineNumber, expression);
    tokens.push(match[1]);
    index += match[1].length;
  }
  return tokens;
}

function evaluatePythonExpression(expression, variables, lineNumber) {
  const tokens = tokenizePythonExpression(expression, lineNumber);
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];
  function factor() {
    const token = take();
    if (token === '-') return -factor();
    if (token === '+') return factor();
    if (token === '(') {
      const value = expressionRule();
      if (take() !== ')') throw pythonError('SyntaxError', 'parêntese de fechamento ausente', lineNumber, expression);
      return value;
    }
    if (/^\d/.test(token || '')) return Number(token);
    if (/^[A-Za-z_]/.test(token || '')) {
      if (!(token in variables)) throw pythonError('NameError', `name '${token}' is not defined`, lineNumber, expression);
      const value = variables[token];
      if (typeof value !== 'number') throw pythonError('TypeError', `não é possível calcular usando texto em '${token}'`, lineNumber, expression);
      return value;
    }
    throw pythonError('SyntaxError', 'expressão incompleta', lineNumber, expression);
  }
  function term() {
    let value = factor();
    while (peek() === '*' || peek() === '/') {
      const operator = take();
      const right = factor();
      if (operator === '/' && right === 0) throw pythonError('ZeroDivisionError', 'division by zero', lineNumber, expression);
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  }
  function expressionRule() {
    let value = term();
    while (peek() === '+' || peek() === '-') {
      const operator = take();
      const right = term();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }
  const value = expressionRule();
  if (position !== tokens.length) throw pythonError('SyntaxError', 'expressão possui conteúdo não reconhecido', lineNumber, expression);
  return value;
}

function renderPythonFString(body, variables, lineNumber) {
  return body.replace(/\{\s*([A-Za-z_]\w*)(?::\.([0-9]+)f)?\s*\}/g, (_match, name, decimals) => {
    if (!(name in variables)) throw pythonError('NameError', `name '${name}' is not defined`, lineNumber, body);
    const value = variables[name];
    if (decimals !== undefined) {
      if (typeof value !== 'number') throw pythonError('ValueError', `formato decimal aplicado a valor não numérico: ${name}`, lineNumber, body);
      return value.toFixed(Number(decimals));
    }
    return String(value);
  });
}

function executePythonPrint(inner, variables, lineNumber) {
  const value = inner.trim();
  const fMatch = value.match(/^f(["'])([\s\S]*)\1$/);
  if (fMatch) return renderPythonFString(fMatch[2].replace(/\\n/g, '\n'), variables, lineNumber);
  if (/^["']/.test(value)) return pythonString(value, lineNumber);
  if (/^[A-Za-z_]\w*$/.test(value)) {
    if (!(value in variables)) throw pythonError('NameError', `name '${value}' is not defined`, lineNumber, value);
    return String(variables[value]);
  }
  return String(evaluatePythonExpression(value, variables, lineNumber));
}

function pythonInputStatement(right, lineNumber) {
  const patterns = [
    { regex: /^input\(((["'])[\s\S]*\2)\)\.strip\(\)$/, converter: 'str', strip: true },
    { regex: /^input\(((["'])[\s\S]*\2)\)$/, converter: 'str', strip: false },
    { regex: /^float\(input\(((["'])[\s\S]*\2)\)\)$/, converter: 'float', strip: true },
    { regex: /^int\(input\(((["'])[\s\S]*\2)\)\)$/, converter: 'int', strip: true }
  ];
  for (const pattern of patterns) {
    const match = right.match(pattern.regex);
    if (match) return { prompt: pythonString(match[1], lineNumber), converter: pattern.converter, strip: pattern.strip };
  }
  return null;
}

function processPythonSession(token) {
  if (!pythonSession || token !== pythonRunToken) return;
  const started = performance.now();
  try {
    while (pythonSession.index < pythonSession.lines.length) {
      if (token !== pythonRunToken) return;
      if (performance.now() - started > 1500 || pythonSession.operations > 500) throw pythonError('TimeoutError', 'a execução excedeu o limite seguro', pythonSession.index + 1);
      const lineNumber = pythonSession.index + 1;
      const source = pythonSession.lines[pythonSession.index];
      const trimmed = source.trim();
      pythonSession.index += 1;
      pythonSession.operations += 1;
      if (!trimmed || trimmed.startsWith('#')) continue;
      const printMatch = trimmed.match(/^print\((.*)\)$/);
      if (printMatch) { terminalAppend(executePythonPrint(printMatch[1], pythonSession.variables, lineNumber)); continue; }
      const assignment = trimmed.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (assignment) {
        const [, name, right] = assignment;
        const input = pythonInputStatement(right.trim(), lineNumber);
        if (input) {
          pythonSession.waiting = { ...input, name, lineNumber, source };
          state.pythonExecution.status = 'waiting';
          terminalAppend(input.prompt, 'muted');
          save();
          renderPythonTerminal();
          return;
        }
        pythonSession.variables[name] = evaluatePythonExpression(right, pythonSession.variables, lineNumber);
        continue;
      }
      throw pythonError('SyntaxError', 'instrução não suportada ou incompleta', lineNumber, source);
    }
    state.pythonExecution = {
      ...(state.pythonExecution || {}), status: 'success', ok: true, stale: false,
      hash: currentPythonHash(), executedAt: new Date().toISOString(), lastError: '', line: null,
      variables: { ...pythonSession.variables }
    };
    terminalAppend('Processo finalizado com código 0.', 'success');
    pythonSession = null;
    save();
    renderPythonTerminal();
    renderExecutionFreshness();
    renderActiveTime();
    window.AppAuth?.log('python_terminal_concluido', { codigo: exercise().codigo, hash: state.pythonExecution.hash, entradas: state.pythonExecution.inputs?.length || 0 });
  } catch (error) { failPythonTerminal(error, pythonSession?.lines || []); }
}

function failPythonTerminal(error, lines = []) {
  const line = Number(error.pythonLine || 0);
  terminalAppend('Traceback (most recent call last):', 'error');
  if (line) {
    terminalAppend(`  File "${exercise().nomesArquivos[pythonFileKey()] || 'main.py'}", line ${line}`, 'error');
    terminalAppend(`    ${error.pythonSource || lines[line - 1] || ''}`, 'error');
  }
  terminalAppend(`${error.pythonType || 'RuntimeError'}: ${error.message || 'erro desconhecido'}`, 'error');
  terminalAppend('Processo finalizado com código 1.', 'error');
  state.pythonExecution = { ...(state.pythonExecution || {}), status: 'error', ok: false, stale: false, hash: currentPythonHash(), executedAt: new Date().toISOString(), lastError: `${error.pythonType || 'RuntimeError'}: ${error.message}`, line };
  pythonSession = null;
  save();
  renderPythonTerminal();
  renderExecutionFreshness();
  window.AppAuth?.log('python_terminal_erro', { codigo: exercise().codigo, tipo: error.pythonType || 'RuntimeError', linha: line, mensagem: error.message });
}

function runPythonTerminal() {
  const key = pythonFileKey();
  if (!key) { Utils.toast('Este exercício não possui arquivo Python.'); return; }
  syncCurrentEditorAnswer();
  const code = currentPythonCode();
  if (!code.trim()) {
    state.pythonExecution = { ...(state.pythonExecution || {}), output: [], status: 'error', ok: false, stale: false, hash: currentPythonHash(), executedAt: new Date().toISOString(), lastError: 'O arquivo main.py está vazio.' };
    terminalAppend('PS C:\\Projetos\\exercicio-07> python main.py', 'command');
    terminalAppend('O arquivo main.py está vazio.', 'error');
    terminalAppend('Processo finalizado com código 1.', 'error');
    save(); renderPythonTerminal(); return;
  }
  pythonRunToken += 1;
  const token = pythonRunToken;
  pythonSession = { token, lines: code.replace(/\r\n?/g, '\n').split('\n'), index: 0, variables: {}, waiting: null, operations: 0 };
  state.pythonExecution = { ...(state.pythonExecution || {}), output: [], inputs: [], status: 'running', ok: false, stale: false, hash: currentPythonHash(), executedAt: null, lastError: '', line: null };
  terminalAppend(`PS C:\\Projetos\\${exercise().pasta}> python ${exercise().nomesArquivos[key]}`, 'command');
  save();
  renderPythonTerminal();
  setTimeout(() => processPythonSession(token), 20);
  window.AppAuth?.log('python_terminal_iniciado', { codigo: exercise().codigo, arquivo: exercise().nomesArquivos[key], hash: currentPythonHash() });
}

function submitPythonTerminalInput(event) {
  event.preventDefault();
  if (!pythonSession?.waiting || state.pythonExecution?.status !== 'waiting') return;
  const input = $('#pythonTerminalInput');
  const raw = input.value;
  const waiting = pythonSession.waiting;
  let value = waiting.strip ? raw.trim() : raw;
  try {
    if (waiting.converter === 'float') {
      const normalized = String(value).trim();
      if (!normalized || normalized.includes(',') || !Number.isFinite(Number(normalized))) throw pythonError('ValueError', `could not convert string to float: '${raw}'`, waiting.lineNumber, waiting.source);
      value = Number(normalized);
    }
    if (waiting.converter === 'int') {
      if (!/^[+-]?\d+$/.test(String(value).trim())) throw pythonError('ValueError', `invalid literal for int(): '${raw}'`, waiting.lineNumber, waiting.source);
      value = Number.parseInt(value, 10);
    }
    pythonSession.variables[waiting.name] = value;
    state.pythonExecution.inputs = [...(state.pythonExecution.inputs || []), { prompt: waiting.prompt, value: raw, variable: waiting.name }];
    terminalAppend(`> ${raw}`, 'input');
    pythonSession.waiting = null;
    state.pythonExecution.status = 'running';
    input.value = '';
    save();
    renderPythonTerminal();
    setTimeout(() => processPythonSession(pythonSession.token), 20);
  } catch (error) { failPythonTerminal(error, pythonSession.lines); }
}

function stopPythonTerminal() {
  if (!['running','waiting'].includes(state.pythonExecution?.status)) return;
  pythonRunToken += 1;
  pythonSession = null;
  state.pythonExecution = { ...(state.pythonExecution || {}), status: 'interrupted', ok: false, stale: false, hash: currentPythonHash(), executedAt: new Date().toISOString(), lastError: 'Execução interrompida pelo usuário.' };
  terminalAppend('Processo interrompido pelo usuário.', 'error');
  save();
  renderPythonTerminal();
  renderExecutionFreshness();
  window.AppAuth?.log('python_terminal_interrompido', { codigo: exercise().codigo, hash: currentPythonHash() });
}

function updatePhase() {
  if (view === 'explain') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} - tutorial`;
    $('#phaseTitle').textContent = 'Entenda antes de digitar';
    $('#phaseText').textContent = 'Veja o arquivo em partes e relacione cada trecho ao produto final.';
  } else if (view === 'full') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} - código completo`;
    $('#phaseTitle').textContent = 'Revise o arquivo completo';
    $('#phaseText').textContent = 'Compare código, função do arquivo e resultado esperado.';
  } else if (view === 'practice') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} - prática`;
    $('#phaseTitle').textContent = 'Digite, teste e valide';
    $('#phaseText').textContent = `Realize também a alteração obrigatória: ${exercise().alteracaoObrigatoria}`;
  } else {
    $('#phaseBadge').textContent = 'conclusão';
    $('#phaseTitle').textContent = 'Prepare a evidência e a entrega';
    $('#phaseText').textContent = 'Baixe os arquivos, gere a evidência e abra o Classroom.';
  }
}

function renderProgress() {
  const count = order().length || 1;
  const completed = order().filter(key => state.done[key]).length;
  const fileBudget = 75;
  const unit = fileBudget / count;
  let fileScore = completed * unit;
  if (!state.done[file]) {
    const steps = exercise().passos[file]?.length || 1;
    const explained = Math.min(state.explained[file] || 0, steps);
    const phasePart = view === 'full' ? 0.6 : view === 'practice' ? 0.85 : (explained / steps) * 0.5;
    fileScore = Math.max(fileScore, fileIndex() * unit + phasePart * unit);
  }
  const executionScore = executionReady() ? 15 : 0;
  const requirement = Math.max(1, minimumSeconds());
  const timeScore = Math.min(10, (Number(state.activeSeconds || 0) / requirement) * 10);
  const ready = allFilesValidated() && executionReady() && Number(state.activeSeconds || 0) >= requirement;
  let percentage = ready || view === 'completion' ? 100 : Math.min(99, Math.round(fileScore + executionScore + timeScore));
  $('#progressBar').style.width = `${percentage}%`;
  $('#progressText').textContent = `${percentage}%`;
  updateVsCodeGauge(percentage);
  updatePhase();
  renderCompletionChecklist();
}

function renderCompletionChecklist() {
  const panel = $('#completionChecklist');
  if (!panel) return;
  const validated = order().filter(key => Boolean(state.done[key])).length;
  const total = order().length;
  const hash = currentProjectHash();
  const previewFresh = !exercise().arquivos.html || (Boolean(state.execution?.ok) && !state.execution?.stale && state.execution?.hash === hash);
  const behaviorOk = !exercise().arquivos.html || behaviorReady();
  const pythonOk = pythonExecutionReady();
  const seconds = Number(state.activeSeconds || 0);
  const minimum = minimumSeconds();
  const items = [
    { ok: validated === total, label: `Arquivos ${validated}/${total}` },
    ...(exercise().arquivos.html ? [{ ok: previewFresh, label: previewFresh ? 'Preview executado' : 'Executar preview' }] : []),
    ...(behaviorDefinition() ? [{ ok: behaviorOk, label: behaviorOk ? 'Interação aprovada' : `Interação ${behaviorProgress().passed}/${behaviorProgress().total}` }] : []),
    ...(pythonFileKey() ? [{ ok: pythonOk, label: pythonOk ? 'Python executado' : 'Executar Python' }] : []),
    { ok: seconds >= minimum, label: `Tempo ${formatTime(seconds)}/${formatTime(minimum)}` }
  ];
  panel.innerHTML = `<div class="completion-checklist-head"><strong>Para chegar a 100%</strong><span>O 100% só aparece quando estes itens estiverem concluídos.</span></div><div class="completion-checklist-items">${items.map(item => `<span class="completion-requirement ${item.ok ? 'ok' : ''}"><i>${item.ok ? '✓' : '•'}</i>${Utils.escapeHtml(item.label)}</span>`).join('')}</div>`;
}

function renderActiveTime() {
  const currentSeconds = Number(state.activeSeconds || 0);
  const requirement = minimumSeconds();
  if ($('#activeTime')) $('#activeTime').textContent = formatTime(currentSeconds);
  if ($('#activeTimeRequirement')) $('#activeTimeRequirement').textContent = currentSeconds >= requirement ? 'mínimo atingido' : `mínimo ${formatTime(requirement)}`;
  if ($('#activeTimePanel')) $('#activeTimePanel').dataset.complete = String(currentSeconds >= requirement);
  const filesReady = allFilesValidated();
  const previewReady = executionReady();
  const ready = filesReady && previewReady && currentSeconds >= requirement;
  const finish = $('#finishExerciseButton');
  if (finish) {
    finish.hidden = !ready || Boolean(state.completedAt);
    finish.disabled = !ready;
  }
  if ($('#timeCompletionStatus')) {
    let guidance = 'Continue estudando, executando e validando os arquivos.';
    if (ready) guidance = 'Arquivos, execuções, interações e tempo mínimo estão prontos. Use Concluir atividade.';
    else if (filesReady && !previewReady) guidance = pythonFileKey() ? 'Arquivos validados. Execute e interaja no preview e também execute main.py no terminal pedagógico.' : 'Arquivos validados. Execute o código atual e complete o checklist comportamental do preview.';
    else if (filesReady && currentSeconds < requirement) guidance = 'Arquivos e comportamento do preview prontos. Continue estudando até atingir o tempo mínimo.';
    else if (currentSeconds >= requirement) guidance = 'Tempo mínimo atingido. Continue até validar todos os arquivos e testar o preview.';
    $('#timeCompletionStatus').innerHTML = `<strong>Tempo ativo:</strong> ${formatTime(currentSeconds)} de ${formatTime(requirement)}. ${guidance}`;
  }
  if (ready && !completionReadyAnnounced && !state.completedAt) {
    completionReadyAnnounced = true;
    Utils.toast('Tudo pronto. O botão Concluir atividade foi liberado.');
  }
  if (!ready) completionReadyAnnounced = false;
  renderExecutionFreshness();
  renderAutocompleteAvailability();
  renderCompletionChecklist();
}
function renderCompletion() {
  $('#completionFolder').textContent = exercise().pasta;
  const downloads = $('#dynamicDownloads');
  if (downloads) {
    downloads.innerHTML = order().map(key => `<button data-dynamic-download="${key}">Baixar ${Utils.escapeHtml(exercise().nomesArquivos[key])}</button>`).join('');
    $$('[data-dynamic-download]').forEach(button => button.addEventListener('click', () => downloadFile(button.dataset.dynamicDownload)));
  }
  const note = $('.delivery-note:not(#timeCompletionStatus)');
  if (note) note.innerHTML = `<strong>Entrega:</strong> envie no Google Classroom o link do repositório <code>${Utils.escapeHtml(exercise().repositorio)}</code>, confira a pasta <code>${Utils.escapeHtml(exercise().pasta)}</code> e anexe a evidência gerada.`;
  renderActiveTime();
  renderViews();
}


function syncCurrentEditorAnswer() {
  if (view !== 'practice' || !file) return;
  const editor = $('#studentEditor');
  if (editor) { state.answers[file] = editorValue(); markAnswerContext(file); }
}

function workDownloadEntries() {
  syncCurrentEditorAnswer();
  return order().map(key => {
    const content = exactStudentCode(key);
    const validated = Boolean(state.done[key]);
    const empty = !String(content).trim();
    const analysis = validated ? { percentage: 100 } : Utils.analyzeCompleteness(key, content, exercise().arquivos[key], exercise());
    return {
      key,
      name: exercise().nomesArquivos[key],
      content,
      validated,
      empty,
      percentage: empty ? 0 : Math.max(1, Number(analysis.percentage || 0))
    };
  });
}

function requestWorkDownload(kind, key = file) {
  lastDownloadTrigger = document.activeElement;
  clearTimeout(saveStateTimer);
  syncCurrentEditorAnswer();
  save();
  const entries = workDownloadEntries();
  const targets = kind === 'file' ? entries.filter(item => item.key === key) : entries;
  const incomplete = targets.some(item => !item.validated);
  if (!incomplete) {
    performWorkDownload(kind, key, entries);
    return;
  }
  pendingWorkDownload = { kind, key, entries };
  const modal = $('#workDownloadModal');
  const badge = $('#workDownloadBadge');
  const title = $('#workDownloadTitle');
  const message = $('#workDownloadMessage');
  badge.textContent = targets.some(item => item.empty) ? 'Há arquivo vazio ou incompleto' : 'Código ainda não validado';
  badge.className = 'chip warning';
  title.textContent = kind === 'project' ? 'Baixar projeto em andamento?' : 'Baixar arquivo em andamento?';
  message.textContent = kind === 'project'
    ? 'Alguns arquivos ainda estão vazios, incompletos ou não validados. Você pode baixar o ZIP agora para guardar no computador, enviar ao GitHub e continuar outro dia.'
    : 'Este arquivo ainda não foi validado ou pode estar incompleto. Você pode baixá-lo agora para guardar e continuar depois.';
  $('#workDownloadStatus').innerHTML = targets.map(item => {
    const status = item.validated ? 'Validado' : item.empty ? 'Vazio' : `Em andamento - cerca de ${item.percentage}%`;
    const tone = item.validated ? 'success' : 'warning';
    return `<div class="work-download-file"><div><strong>${Utils.escapeHtml(item.name)}</strong><small>${item.content.length} caracteres digitados</small></div><span class="chip ${tone}">${Utils.escapeHtml(status)}</span></div>`;
  }).join('');
  $('#confirmWorkDownload').textContent = kind === 'project' ? 'Baixar ZIP mesmo assim' : 'Baixar arquivo mesmo assim';
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#confirmWorkDownload').focus(), 30);
}


function workDownloadFocusable() {
  const modal = $('#workDownloadModal');
  if (!modal || modal.hidden) return [];
  return [...modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.disabled && !element.hidden && element.getClientRects().length > 0);
}

function trapWorkDownloadFocus(event) {
  const focusable = workDownloadFocusable();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !focusable.includes(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function closeWorkDownloadModal() {
  const modal = $('#workDownloadModal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  pendingWorkDownload = null;
  const target = lastDownloadTrigger;
  lastDownloadTrigger = null;
  if (target && typeof target.focus === 'function' && document.contains(target)) target.focus({ preventScroll: true });
}

function confirmWorkDownload() {
  if (!pendingWorkDownload) return;
  const { kind, key, entries } = pendingWorkDownload;
  closeWorkDownloadModal();
  performWorkDownload(kind, key, entries);
}


function buildProgressReadme(entries) {
  const user = window.AppAuth?.currentUser?.() || {};
  const lines = [
    'PROJETO EM ANDAMENTO',
    '',
    `Exercicio: ${exercise().codigo} - ${exercise().nomeCurto}`,
    `Aluno: ${user.displayName || user.username || 'nao informado'}`,
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '',
    'Este ZIP foi baixado antes da conclusao ou validacao completa.',
    'Os arquivos contem exatamente o texto digitado no editor.',
    Object.values(state.autocomplete || {}).some(meta => meta?.used) ? 'Apoio automatico foi utilizado e esta registrado em autocompletar.json.' : 'Nenhum codigo foi acrescentado automaticamente.',
    '',
    'STATUS DOS ARQUIVOS'
  ];
  entries.forEach(item => {
    const status = item.validated ? 'validado' : item.empty ? 'vazio' : `em andamento - cerca de ${item.percentage}%`;
    lines.push(`- ${item.name}: ${status}; ${item.content.length} caracteres`);
  });
  lines.push('', 'COMO CONTINUAR', `1. Abra a pasta ${exercise().pasta} no VS Code.`, '2. Continue editando os arquivos normalmente.', '3. Abra index.html no navegador para testar os arquivos Web.', '4. Quando terminar, volte a plataforma e valide novamente.', '5. Voce pode enviar esta pasta ao GitHub para continuar em outro computador.', '', 'ATENCAO', 'Baixar o ZIP nao conclui a atividade e nao substitui a validacao final.');
  return lines.join('\n');
}

function performWorkDownload(kind, key, entries = workDownloadEntries()) {
  if (kind === 'file') {
    const item = entries.find(entry => entry.key === key);
    if (!item) return;
    Utils.download(item.name, item.content, mimeFor(item.key));
    Utils.toast(`${item.name} baixado. O conteúdo está ${item.validated ? 'validado' : 'em andamento'}.`);
    window.AppAuth?.log('arquivo_baixado', { arquivo: item.key, nome: item.name, codigo: exercise().codigo, caracteres: item.content.length, validado: item.validated, emAndamento: !item.validated });
    return;
  }
  const incomplete = entries.some(item => !item.validated);
  const files = entries.map(item => ({ name: `${exercise().pasta}/${item.name}`, content: item.content }));
  const autocompleteUsed = Object.entries(state.autocomplete || {}).filter(([, meta]) => meta?.used);
  if (autocompleteUsed.length) {
    const metadata = {
      utilizado: true,
      plataforma: window.APP_CONFIG?.name,
      versao: window.APP_CONFIG?.version,
      exercicio: exercise().codigo,
      geradoEm: new Date().toISOString(),
      arquivos: autocompleteUsed.map(([key, meta]) => ({ arquivo: exercise().nomesArquivos[key], ativo: Boolean(meta.active), marcadorRemovido: Boolean(meta.markerRemoved), eventos: meta.events || [] }))
    };
    files.push({ name: `${exercise().pasta}/autocompletar.json`, content: JSON.stringify(metadata, null, 2) });
  }
  if (incomplete) files.push({ name: `${exercise().pasta}/LEIA-ME-PROGRESSO.txt`, content: buildProgressReadme(entries) });
  const blob = Utils.createZip(files);
  const suffix = incomplete ? '-EM-ANDAMENTO' : '';
  Utils.download(`${exercise().pasta}${suffix}.zip`, blob, 'application/zip');
  Utils.toast(incomplete ? 'ZIP em andamento baixado. Continue depois sem perder o código.' : 'Projeto completo baixado em ZIP.');
  window.AppAuth?.log('projeto_zip_baixado', { codigo: exercise().codigo, arquivos: entries.length, incompleto: incomplete, vazios: entries.filter(item => item.empty).map(item => item.key) });
}

function mimeFor(key) {
  const lang = language(key);
  return { html: 'text/html', css: 'text/css', js: 'text/javascript', python: 'text/x-python', json: 'application/json', kotlin: 'text/plain', xml: 'application/xml', markdown: 'text/markdown', shell: 'text/plain', text: 'text/plain' }[lang] || 'text/plain';
}

function exactStudentCode(key) {
  if (view === 'practice' && key === file) return editorValue() ?? state.answers[key] ?? '';
  return state.answers[key] ?? '';
}

function downloadFile(key) {
  const content = exactStudentCode(key);
  Utils.download(exercise().nomesArquivos[key], content, mimeFor(key));
  window.AppAuth?.log('arquivo_baixado', { arquivo: key, nome: exercise().nomesArquivos[key], codigo: exercise().codigo, caracteres: content.length });
}

function exportEvidence() {
  const user = window.AppAuth?.currentUser?.() || {};
  syncCurrentEditorAnswer();
  const projectHash = currentProjectHash();
  const evidenceId = `${exercise().codigo}-${new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)}-${projectHash.slice(0, 4).toUpperCase()}`;
  const rows = order().map(key => `<tr><td>${Utils.escapeHtml(exercise().nomesArquivos[key])}</td><td>${state.done[key] ? 'Validado' : 'Pendente'}</td><td>${state.attempts[key] || 0}</td><td>${state.autocomplete?.[key]?.used ? 'Sim' : 'Não'}</td></tr>`).join('');
  const supportRows = Object.entries(state.autocomplete || {}).filter(([, meta]) => meta?.used).map(([key, meta]) => `<li><strong>${Utils.escapeHtml(exercise().nomesArquivos[key])}:</strong> ${meta.events?.length || 0} uso(s); apoio ativo: ${meta.active ? 'sim' : 'não'}; marcação removida manualmente: ${meta.markerRemoved ? 'sim' : 'não'}.</li>`).join('');
  const completed = allFilesValidated() && executionReady() && Number(state.activeSeconds || 0) >= minimumSeconds() && Boolean(state.completedAt);
  const report = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Evidência ${exercise().codigo}</title><style>body{font-family:Arial;max-width:900px;margin:40px auto;color:#172033}h1{margin-bottom:4px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0}.box{border:1px solid #bcc7d6;border-radius:10px;padding:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bcc7d6;padding:9px;text-align:left}.ok{color:#08783f;font-weight:bold}.warn{color:#a35b00;font-weight:bold}code{overflow-wrap:anywhere}@media print{button{display:none}}</style></head><body><h1>Evidência de atividade - ${Utils.escapeHtml(exercise().titulo)}</h1><p>${Utils.escapeHtml(window.APP_CONFIG?.name || '')}</p><div class="meta"><div class="box"><strong>Aluno:</strong> ${Utils.escapeHtml(user.displayName || 'Não informado')}<br><strong>Turma:</strong> ${Utils.escapeHtml(user.group || 'Não informada')}</div><div class="box"><strong>Início:</strong> ${new Date(state.startedAt).toLocaleString('pt-BR')}<br><strong>Conclusão:</strong> ${state.completedAt ? new Date(state.completedAt).toLocaleString('pt-BR') : 'Não concluída'}</div><div class="box"><strong>Tempo ativo:</strong> ${formatTime(state.activeSeconds)}<br><strong>Mínimo:</strong> ${formatTime(minimumSeconds())}</div><div class="box"><strong>Status:</strong> <span class="${completed ? 'ok' : 'warn'}">${completed ? 'Concluída' : 'Em andamento'}</span><br><strong>Execuções atuais:</strong> ${executionReady() ? 'preview e terminal exigidos aprovados' : 'pendentes ou desatualizadas'}</div><div class="box"><strong>ID da evidência:</strong><br><code>${evidenceId}</code></div><div class="box"><strong>Hash do código:</strong><br><code>${projectHash}</code><br><strong>Versão:</strong> ${Utils.escapeHtml(window.APP_CONFIG?.version || '')}</div></div><h2>Produto</h2><p>${Utils.escapeHtml(exercise().produto || exercise().objetivo)}</p><h2>Alteração obrigatória</h2><p>${Utils.escapeHtml(exercise().alteracaoObrigatoria || '')}</p><h2>Arquivos</h2><table><thead><tr><th>Arquivo</th><th>Status</th><th>Tentativas</th><th>Apoio automático</th></tr></thead><tbody>${rows}</tbody></table><h2>Apoio automático</h2>${supportRows ? `<ul>${supportRows}</ul>` : '<p>Não utilizado.</p>'}<h2>Teste comportamental</h2><p>Status: ${behaviorReady() ? 'critérios atuais atendidos' : 'pendente ou desatualizado'}.</p>${pythonFileKey() ? `<h2>Terminal Python</h2><p>Status: ${pythonExecutionReady() ? 'execução atual concluída' : 'pendente ou desatualizada'}.</p><p>Hash de main.py: <code>${currentPythonHash()}</code></p>` : ''}<h2>Entrega</h2><p>Repositório: ${Utils.escapeHtml(exercise().repositorio)} / pasta ${Utils.escapeHtml(exercise().pasta)}.</p><button onclick="window.print()">Imprimir ou salvar em PDF</button><script>setTimeout(()=>window.print(),500)<\/script></body></html>`;
  const popup = window.open('', '_blank');
  if (popup) popup.opener = null;
  if (popup) { popup.document.open(); popup.document.write(report); popup.document.close(); }
  else Utils.download(`EVIDENCIA_${exercise().codigo}_${evidenceId}.html`, report, 'text/html');
  window.AppAuth?.log('evidencia_gerada', { codigo: exercise().codigo, activeSeconds: state.activeSeconds, completed, evidenceId, projectHash, autocompleteUsed: Boolean(supportRows) });
}
function openInfo(type) {
  if (type === 'contexto') AppShell.openInfo('Contexto do exercício', `${Utils.contextHtml(exercise())}<div class="drawer-section"><h3>Produto profissional</h3><p>${Utils.escapeHtml(exercise().produto || '')}</p><h3>Alteração obrigatória</h3><p>${Utils.escapeHtml(exercise().alteracaoObrigatoria || '')}</p></div>`);
  if (type === 'dicas') AppShell.openInfo('Dicas para realizar a atividade', Utils.tipsHtml(exercise(), false));
  if (type === 'explicacao') {
    const currentStep = exercise().passos[file][explainStep] || exercise().passos[file][0];
    AppShell.openInfo('Explicação da parte atual', `<div class="drawer-section"><span class="chip">${Utils.escapeHtml(exercise().nomesArquivos[file])} - linhas ${currentStep.linhas[0]}-${currentStep.linhas[1]}</span><h3>${Utils.escapeHtml(currentStep.titulo)}</h3><p>${Utils.escapeHtml(currentStep.explicacao)}</p></div>`);
  }
  if (type === 'termos') AppShell.openInfo('Termos e palavras do código', Utils.glossaryHtml(exercise()));
}

init();

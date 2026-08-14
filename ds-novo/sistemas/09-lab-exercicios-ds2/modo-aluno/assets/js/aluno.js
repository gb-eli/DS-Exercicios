let current = EXERCICIOS.length ? EXERCICIOS.length - 1 : 0;
let file = 'html';
let explainStep = 0;
let view = 'explain';
let tutorialFunctions = [];
let state = {};
let saveTimer = null;
let dirty = false;
let practiceRunId = '';
let tutorialRunId = '';
let previewTimer = null;
let lastValidationResult = null;
let validationPanelManuallyClosed = false;
let pendingDownloadAction = null;
let lastLineCount = 0;
let workspaceAction = null;
let workspaceExtraPath = null;
let terminalWelcomeShown = false;

const order = ['html', 'css', 'js'];
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const exercise = () => EXERCICIOS[current];

function projectFolderName() {
  return Workspace.rootName(state, exercise());
}

function displayFileName(key) {
  return Workspace.mainPath(state, key, exercise());
}

function validationExercise() {
  const source = exercise();
  const clone = { ...source, arquivos: { ...source.arquivos }, nomesArquivos: { ...source.nomesArquivos } };
  const originalCss = source.nomesArquivos.css;
  const originalJs = source.nomesArquivos.js;
  const currentCss = displayFileName('css');
  const currentJs = displayFileName('js');
  clone.nomesArquivos = { html: displayFileName('html'), css: currentCss, js: currentJs };
  const cssPattern = new RegExp(`(["'])${originalCss.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g');
  const jsPattern = new RegExp(`(["'])${originalJs.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g');
  clone.arquivos.html = String(source.arquivos.html || '').replace(cssPattern, `$1${currentCss}$1`).replace(jsPattern, `$1${currentJs}$1`);
  return clone;
}



function currentUsername() {
  return window.AppAuth?.currentUser?.()?.username || 'sem-usuario';
}

function storageNamespace() {
  return window.APP_CONFIG?.storageNamespace || '2ds-frontend-manha';
}

function storageKey() {
  return `ds2_${storageNamespace()}_${currentUsername()}_ex${exercise().numero}_state_v7`;
}

function previousUserStorageKey() {
  return `ds2_${storageNamespace()}_${currentUsername()}_ex${exercise().numero}_state_v6`;
}

function legacyStorageKey() {
  return `dsEx${exercise().numero}StateV3`;
}

function defaultState() {
  return {
    answers: { html: '', css: '', js: '' },
    done: { html: false, css: false, js: false },
    origin: { html: 'digitado', css: 'digitado', js: 'digitado' },
    unlocked: { html: true, css: false, js: false },
    explained: { html: 0, css: 0, js: 0 },
    attempts: { html: 0, css: 0, js: 0 },
    lastDiagnosticLine: { html: null, css: null, js: null },
    completed: false,
    completedAt: null,
    savedAt: null,
    learning: null,
    workspace: null,
    runtime: null
  };
}


function load() {
  const defaults = defaultState();
  try {
    const currentRaw = Utils.storageGet(storageKey());
    const previousRaw = currentUsername() !== 'sem-usuario' ? Utils.storageGet(previousUserStorageKey()) : null;
    const olderRaw = currentUsername() !== 'sem-usuario' ? Utils.storageGet(`ds2_${currentUsername()}_ex${exercise().numero}_state_v4`) : null;
    const sharedRaw = Utils.storageGet(legacyStorageKey());
    const saved = JSON.parse(currentRaw || previousRaw || olderRaw || 'null') || {};
    state = {
      ...defaults,
      ...saved,
      answers: { ...defaults.answers, ...(saved.answers || {}) },
      done: { ...defaults.done, ...(saved.done || {}) },
      origin: { ...defaults.origin, ...(saved.origin || {}) },
      unlocked: { ...defaults.unlocked, ...(saved.unlocked || {}) },
      explained: { ...defaults.explained, ...(saved.explained || {}) },
      attempts: { ...defaults.attempts, ...(saved.attempts || {}) },
      lastDiagnosticLine: { ...defaults.lastDiagnosticLine, ...(saved.lastDiagnosticLine || {}) }
    };
    Workspace.ensureState(state, exercise());
    RuntimeEnvironment.ensureState(state);
    LearningSupport.ensureState(state, exercise());
    if (!currentRaw && (previousRaw || olderRaw)) {
      Utils.storageSet(storageKey(), JSON.stringify(state));
      Utils.storageRemove(previousUserStorageKey());
      Utils.storageRemove(`ds2_${currentUsername()}_ex${exercise().numero}_state_v4`);
    }
    if (state.completed && !order.every(key => state.done[key])) { state.completed = false; state.completedAt = null; }
    if (sharedRaw) {
      Utils.storageSet(`ds2_${storageNamespace()}_legacy_unassigned_ex${exercise().numero}`, sharedRaw);
      Utils.storageRemove(legacyStorageKey());
    }
    dirty = false;
  } catch (error) {
    state = defaults;
    Workspace.ensureState(state, exercise());
    RuntimeEnvironment.ensureState(state);
    LearningSupport.ensureState(state, exercise());
    dirty = false;
  }
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = null;
  dirty = false;
  state.savedAt = new Date().toISOString();
  const permanent = Utils.storageSet(storageKey(), JSON.stringify(state));
  renderSaveStatus(permanent);
  if (!permanent) {
    showValidation('Não foi possível salvar localmente. Baixe uma cópia do seu código agora para não perder o trabalho.', 'warning');
  }
  return permanent;
}

function scheduleSave() {
  dirty = true;
  renderSaveStatus(Utils.storageAvailable());
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 450);
}

function flushSave() {
  const editor = document.querySelector('#studentEditor');
  if (editor && view === 'practice') state.answers[file] = editor.value;
  if (dirty || saveTimer) return save();
  return true;
}


function restoreLearningPosition() {
  if (state.completed || order.every(key => state.done[key])) {
    file = 'js';
    explainStep = Math.max(0, exercise().passos.js.length - 1);
    view = 'completion';
    return;
  }
  const next = order.find(key => state.unlocked[key] && !state.done[key]) || 'html';
  file = next;
  explainStep = Math.min(state.explained[file] || 0, Math.max(0, exercise().passos[file].length - 1));
  view = String(state.answers[file] || '').trim() ? 'practice' : 'explain';
}

function init() {
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
    file = 'html';
    explainStep = 0;
    view = 'explain';
    load();
    restoreLearningPosition();
    renderAll();
  });

  $('#explainPrev').addEventListener('click', previousExplain);
  $('#alreadyUnderstood').addEventListener('click', markCurrentPartUnderstood);
  $('#explainNext').addEventListener('click', nextExplain);
  $('#backExplain').addEventListener('click', () => setView('explain'));
  $('#reviewSteps').addEventListener('click', () => setView('explain'));
  $('#goTutorial').addEventListener('click', () => setView('explain'));
  $('#startPractice').addEventListener('click', () => setView('practice'));
  $('#validateFile').addEventListener('click', validate);
  $('#runProject').addEventListener('click', handleManualPreview);
  $('#useBase').addEventListener('click', useBase);
  $('#undoSupport').addEventListener('click', undoSupport);
  $('#enterTeacherAuthorization').addEventListener('click', openTeacherAuthorization);
  $('#cancelSupportInsert').addEventListener('click', closeSupportConfirm);
  $('#confirmSupportInsert').addEventListener('click', applySupportBlock);
  $('#cancelTeacherAuthorization').addEventListener('click', closeTeacherAuthorization);
  $('#confirmTeacherAuthorization').addEventListener('click', importTeacherAuthorization);
  $('#refreshPreview').addEventListener('click', handleManualPreview);
  $('#downloadProgress').addEventListener('click', downloadProgressZip);
  $('#downloadCompleteZip').addEventListener('click', downloadProgressZip);
  $('#copyFolder').addEventListener('click', () => Utils.copy(projectFolderName(), 'Nome da pasta copiado.'));
  $('#studentRunStep').addEventListener('click', runTutorialAction);
  $('#closeValidationDetails').addEventListener('click', () => hideValidationDetails(true));
  $('#diagnosticReviewTutorial').addEventListener('click', () => setView('explain'));
  $('#diagnosticFocusLine').addEventListener('click', focusDiagnosticLine);
  $('#confirmCompletion').addEventListener('click', confirmCompletion);
  $('#cancelIncompleteDownload').addEventListener('click', closeDownloadConfirm);
  $('#confirmIncompleteDownload').addEventListener('click', confirmIncompleteDownload);
  $('#selectStudentCode').addEventListener('click', selectStudentCode);
  $('#copyStudentCode').addEventListener('click', copyStudentCode);
  $('#workspaceNewFolder').addEventListener('click', () => openWorkspaceAction('new-folder'));
  $('#workspaceNewFile').addEventListener('click', () => openWorkspaceAction('new-file'));
  $('#workspaceRenameRoot').addEventListener('click', () => openWorkspaceAction('rename-root'));
  $('#workspaceRenameSelected').addEventListener('click', () => openWorkspaceAction('rename-selected'));
  $('#workspaceDownloadSelected').addEventListener('click', downloadSelectedWorkspaceFile);
  $('#workspaceActionCancel').addEventListener('click', closeWorkspaceAction);
  $('#workspaceActionConfirm').addEventListener('click', confirmWorkspaceAction);
  $('#workspaceExtraCancel').addEventListener('click', closeWorkspaceExtraEditor);
  $('#workspaceExtraSave').addEventListener('click', saveWorkspaceExtraEditor);
  $('#openIndividualDownloads').addEventListener('click', openIndividualDownloads);
  $('#closeIndividualDownloads').addEventListener('click', () => AppShell.closeOverlay($('#individualDownloadsModal')));
  $$('.runtime-tab').forEach(button => button.addEventListener('click', () => setRuntimeTab(button.dataset.runtimeTab)));
  $('#minimizePreview').addEventListener('click', togglePreviewMinimized);
  $('#closePreview').addEventListener('click', closePreviewPane);
  $('#reopenPreview').addEventListener('click', reopenPreviewPane);
  $('#clearConsole').addEventListener('click', () => { RuntimeEnvironment.clearConsole(state); renderRuntimeConsole(); scheduleSave(); });
  $('#runtimeTerminalRun').addEventListener('click', runTerminalCommand);
  $('#runtimeTerminalInput').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); runTerminalCommand(); } });

  const studentEditor = $('#studentEditor');
  studentEditor.dataset.caseSensitive = 'true';
  studentEditor.style.textTransform = 'none';

  studentEditor.addEventListener('input', () => {
    const wasValidated = Boolean(state.done[file]);
    const wasCompleted = Boolean(state.completed);
    const previousLength = String(state.answers[file] || '').length;
    state.answers[file] = studentEditor.value;
    LearningSupport.noteInteraction(state, file, 'typing', Math.abs(studentEditor.value.length - previousLength) || 1);
    state.origin[file] = LearningSupport.activeEntries(state, file).length ? 'misto' : 'digitado';
    state.done[file] = false;
    state.completed = false;
    state.completedAt = null;
    state.lastDiagnosticLine[file] = null;
    RuntimeEnvironment.markEdited(state);
    window.BehaviorScenarios?.resetAfterEdit(state);
    if (wasValidated || wasCompleted) showValidation('O arquivo foi alterado. A validação e a conclusão anteriores foram removidas.', 'warning');
    scheduleSave();
    syncEditor();
    schedulePracticePreview();
    renderOrigin();
    renderProgress();
    renderCodeHealth();
    renderDownloadHint();
    renderRuntimeStatus();
    renderRuntimeProblems();
    renderExecutionCheckpoints();
    renderBehaviorScenarios();
    updateDiagnosticComparison();
  });
  $('#studentEditor').addEventListener('scroll', syncScroll);
  $('#studentEditor').addEventListener('click', updateActiveLine);
  $('#studentEditor').addEventListener('keyup', updateActiveLine);
  $('#studentEditor').addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleManualPreview();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      captureCurrentEditor();
      save();
      return;
    }
    tabKey(event);
  });

  $$('[data-download]').forEach(button => {
    button.addEventListener('click', () => downloadFile(button.dataset.download));
  });
  $$('[data-info]').forEach(button => {
    button.addEventListener('click', () => {
      if (['dicas', 'explicacao', 'termos'].includes(button.dataset.info)) LearningSupport.noteInteraction(state, file, 'hint');
      openInfo(button.dataset.info);
      scheduleSave();
      renderSupportStatus();
    });
  });


document.addEventListener('pointerdown', () => LearningSupport.noteInteraction(state, file, 'active'), { passive: true });
document.addEventListener('keydown', () => LearningSupport.noteInteraction(state, file, 'active'));
setInterval(() => { if (LearningSupport.tickActive(state, file, 5)) { scheduleSave(); renderSupportStatus(); } }, 5000);

window.addEventListener('message', handlePreviewMessage);
window.addEventListener('pagehide', flushSave);
window.addEventListener('ds2:flush-progress', flushSave);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });


  document.addEventListener('appauth:ready', event => {
    const preferred = Number(event.detail?.user?.lastExerciseIndex);
    if (Number.isInteger(preferred) && preferred >= 0 && preferred < EXERCICIOS.length) current = preferred;
    const selector = $('#studentExercise');
    if (selector) selector.value = current;
    file = 'html'; explainStep = 0; view = 'explain';
    load(); restoreLearningPosition(); renderAll();
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
    setTimeout(() => $('#studentEditor').focus(), 50);
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
  renderSupportStatus();
  renderWorkspaceExplorer();
  renderRuntimePanel();
}


function renderTabs() {
  $('#studentFileTabs').innerHTML = order.map(key => `
    <button data-file="${key}" class="${file === key ? 'active' : ''} ${state.done[key] ? 'done' : ''}" ${state.unlocked[key] ? '' : 'disabled'}>${Utils.escapeHtml(displayFileName(key))}</button>
  `).join('');
  $$('#studentFileTabs button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      flushSave();
      file = button.dataset.file;
      explainStep = Math.min(state.explained[file] || 0, exercise().passos[file].length - 1);
      view = state.done[file] ? 'practice' : 'explain';
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
  $('#studentStepResult').textContent = selected.resultadoEsperado || resultDescription(file);
  $('#explainFileName').textContent = displayFileName(file);
  Utils.renderCode($('#explainCode'), exercise().arquivos[file], file, selected.linhas, true);
  $('#explainPrev').disabled = explainStep === 0 && fileIndex() === 0;
  const understood = LearningSupport.isUnderstood(state, file, explainStep);
  $('#alreadyUnderstood').textContent = understood ? 'Parte compreendida ✓' : 'Já entendi esta parte';
  $('#alreadyUnderstood').classList.toggle('success', understood);
  $('#explainNext').disabled = !understood;
  $('#explainNext').title = understood ? '' : 'Marque que entendeu esta parte antes de avançar.';
  $('#explainNext').textContent = explainStep === steps.length - 1 ? 'Revisar mapa do arquivo' : 'Próxima parte';
  renderTutorialPreview(selected.linhas);
  renderViews();
  updatePhase();
  renderProgress();
}

function resultDescription(currentFile) {
  if (currentFile === 'html') return 'O destaque no preview mostra onde a estrutura desse trecho aparece na página.';
  if (currentFile === 'css') return 'O destaque mostra os elementos que recebem as regras visuais desse trecho.';
  return 'O destaque mostra os elementos envolvidos na ação. Quando disponível, use “Executar ação” para testar a função.';
}

function renderTutorialPreview(range) {
  const result = Utils.buildPreviewDocument(exercise(), { file, range, tutorial: true });
  tutorialFunctions = result.functions;
  tutorialRunId = result.runId;
  $('#studentTutorialPreview').srcdoc = result.srcdoc;
  $('#studentTutorialLabel').textContent = `${exercise().nomesArquivos[file]} · parte ${explainStep + 1}`;
  $('#studentTutorialMessage').textContent = 'Observe o elemento contornado e relacione o resultado com as linhas destacadas.';
  const button = $('#studentRunStep');
  button.hidden = file !== 'js' || !tutorialFunctions.length;
  button.textContent = tutorialFunctions.length ? `Executar ${tutorialFunctions[0]}()` : 'Executar ação';
}


function runTutorialAction() {
  LearningSupport.noteInteraction(state, file, 'execution');
  scheduleSave();
  renderSupportStatus();
  const frame = $('#studentTutorialPreview');
  const functionName = tutorialFunctions[0];
  if (!functionName || !tutorialRunId) return;
  frame.contentWindow?.postMessage({ source: 'ds2-platform', type: 'run-function', runId: tutorialRunId, name: functionName }, '*');
}

function handlePreviewMessage(event) {
  const data = event.data || {};
  if (data.source !== 'ds2-preview') return;
  const practiceFrame = $('#studentPreview');
  const tutorialFrame = $('#studentTutorialPreview');
  if (event.source === practiceFrame?.contentWindow && data.runId === practiceRunId) {
    const message = $('#previewMessage');
    if (data.type === 'error') {
      message.dataset.state = 'error';
      message.textContent = `Erro no preview${data.line ? ` (linha ${data.line})` : ''}: ${data.message}`;
      const explicitError = RuntimeEnvironment.markRuntimeError(state, data.runId, data);
      RuntimeEnvironment.appendConsole(state, 'error', [data.message || 'Erro JavaScript']);
      if (explicitError) {
        const hadValidation = Boolean(state.done[file] || state.completed);
        state.done[file] = false;
        state.completed = false;
        state.completedAt = null;
        if (hadValidation) showValidation('A execução atual apresentou erro. A validação anterior deste arquivo foi removida.', 'danger');
        scheduleSave();
      }
      renderRuntimeConsole();
      renderRuntimeStatus();
      renderRuntimeProblems();
      renderExecutionCheckpoints();
    } else if (data.type === 'ready' && message.dataset.state !== 'error') {
      const explicitReady = RuntimeEnvironment.markReady(state, data.runId);
      message.dataset.state = 'ready';
      message.textContent = explicitReady
        ? 'Execução concluída sem erro inicial. Agora teste as interações exigidas.'
        : 'Preview de edição atualizado. Use “Executar projeto” para registrar uma execução válida.';
      if (explicitReady) scheduleSave();
      renderRuntimeStatus();
      renderRuntimeProblems();
      renderExecutionCheckpoints();
    } else if (data.type === 'console') {
      RuntimeEnvironment.appendConsole(state, data.level, data.args || []);
      renderRuntimeConsole();
    } else if (data.type === 'interaction') {
      const counted = RuntimeEnvironment.markInteraction(state, data, data.runId);
      const completedScenarios = window.BehaviorScenarios?.observe(state, exercise(), data) || [];
      if (counted || completedScenarios.length) {
        if (counted) LearningSupport.noteInteraction(state, file, 'preview');
        scheduleSave();
      }
      if (completedScenarios.length) {
        const behavior = BehaviorScenarios.status(state, exercise());
        showToast(`Cenário testado: ${behavior.scenarios.find(item => item.id === completedScenarios[0])?.label || completedScenarios[0]}`);
      }
      renderBehaviorScenarios();
      renderRuntimeStatus();
      renderRuntimeProblems();
      renderExecutionCheckpoints();
    }
  }
  if (event.source === tutorialFrame?.contentWindow && data.runId === tutorialRunId && data.type === 'run-result') {
    Utils.toast(data.ok ? `A função ${data.name}() foi executada no preview.` : `Não foi possível executar: ${data.message}`);
  }
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

function markCurrentPartUnderstood() {
  LearningSupport.markUnderstood(state, file, explainStep);
  state.explained[file] = Math.max(state.explained[file] || 0, explainStep + 1);
  save();
  renderExplain();
  renderSupportStatus();
  Utils.toast('Compreensão registrada. Nenhum código foi inserido no editor.');
}

function nextExplain() {
  const steps = exercise().passos[file];
  if (!LearningSupport.isUnderstood(state, file, explainStep)) {
    Utils.toast('Use “Já entendi esta parte” antes de avançar.');
    return;
  }
  state.explained[file] = Math.max(state.explained[file] || 0, explainStep + 1);
  save();
  if (explainStep < steps.length - 1) {
    explainStep += 1;
    renderExplain();
  } else {
    view = 'full';
    renderAll();
  }
}

function renderFull() {
  $('#fullFileName').textContent = displayFileName(file);
  Utils.renderCode($('#fullCode'), LearningSupport.safeReference(file, exercise()), file, null, false);
  const result = Utils.buildPreviewDocument(exercise(), { file, range: null, tutorial: false });
  $('#studentFullPreview').srcdoc = result.srcdoc;
}

function renderPractice() {
  $('#referenceFileName').textContent = displayFileName(file);
  $('#editorFileName').textContent = displayFileName(file);
  Utils.renderCode($('#referenceFull'), LearningSupport.safeReference(file, exercise()), file, null, false);
  $('#studentEditor').value = state.answers[file] || '';
  renderCodeHealth();
  renderSaveStatus(Utils.storageAvailable());
  renderDownloadHint();
  renderSupportStatus();
  renderExecutionCheckpoints();
  renderBehaviorScenarios();
  syncEditor();
  renderOrigin();
  renderPracticePreview();
  renderWorkspaceExplorer();
  renderRuntimePanel();
}

function renderOrigin() {
  const active = LearningSupport.activeEntries(state, file).length;
  const origin = active ? 'misto' : state.origin[file];
  $('#originStatus').textContent = origin === 'misto' ? `código misto · ${active} bloco(s) com apoio` : origin === 'sistema' ? 'código-base fornecido' : 'digitado pelo aluno';
  $('#originStatus').style.background = origin === 'misto' ? '#654b12' : origin === 'sistema' ? '#654b12' : '#1d2a46';
}

let pendingSupportStatus = null;

function currentSupportStatus() {
  return LearningSupport.supportStatus({
    state, exercise: exercise(), file, stepIndex: explainStep, username: currentUsername(), content: $('#studentEditor')?.value || state.answers[file] || ''
  });
}

function renderSupportStatus() {
  const panel = $('#supportStatusPanel');
  if (!panel || !state.learning) return;
  const status = currentSupportStatus();
  const active = LearningSupport.activeEntries(state, file);
  panel.innerHTML = `
    <div class="support-status-head"><div><span class="chip info">Fase pedagógica ${status.phase}</span><strong>Apoio automático progressivo</strong></div><span class="chip ${status.available ? 'success' : 'warning'}">${status.available ? 'Disponível' : 'Bloqueado'}</span></div>
    <p>${Utils.escapeHtml(status.reason)}</p>
    <ul class="support-criteria">${LearningSupport.criteriaHtml(status)}</ul>
    ${active.length ? `<p class="support-active-note">Há ${active.length} bloco(s) automático(s) ativo(s) neste arquivo. A atividade continua exigindo execução e validação.</p>` : ''}
  `;
  $('#useBase').hidden = false;
  $('#useBase').disabled = !status.available;
  $('#useBase').textContent = status.authorization ? 'Completar com autorização' : 'Completar esta etapa';
  $('#undoSupport').hidden = active.length === 0;
}

function useBase() {
  const status = currentSupportStatus();
  if (!status.available) {
    Utils.toast(status.reason);
    renderSupportStatus();
    return;
  }
  const block = LearningSupport.stepBlock(exercise(), file, explainStep);
  pendingSupportStatus = status;
  $('#supportConfirmPhase').textContent = `Fase ${status.phase} · ${exercise().nomesArquivos[file]}`;
  $('#supportConfirmText').textContent = `${status.reason} O bloco será inserido na posição atual do cursor, sem substituir o restante do arquivo.`;
  $('#supportBlockTitle').textContent = `${block.title} · linhas de referência ${block.start} a ${block.end}`;
  $('#supportBlockPreview').textContent = block.text;
  AppShell.openOverlay($('#supportConfirmModal'));
}

function closeSupportConfirm() {
  pendingSupportStatus = null;
  AppShell.closeOverlay($('#supportConfirmModal'));
}

function applySupportBlock() {
  const status = pendingSupportStatus || currentSupportStatus();
  if (!status.available) { closeSupportConfirm(); Utils.toast('A liberação não está mais disponível.'); return; }
  const editor = $('#studentEditor');
  const result = LearningSupport.prepareInsertion({
    state, exercise: exercise(), file, stepIndex: explainStep, username: currentUsername(), content: editor.value,
    selectionStart: editor.selectionStart, selectionEnd: editor.selectionEnd, source: status.code
  });
  editor.value = result.content;
  editor.setSelectionRange(result.cursor, result.cursor);
  state.answers[file] = result.content;
  state.origin[file] = 'misto';
  state.done[file] = false; state.completed = false; state.completedAt = null;
  state.lastDiagnosticLine[file] = null;
  save();
  closeSupportConfirm();
  syncEditor(); renderPracticePreview(); renderOrigin(); renderCodeHealth(); renderDownloadHint(); renderSupportStatus();
  window.AppAuth?.log('apoio_automatico_usado', { arquivo: file, bloco: result.entry.blockTitle, linhas: result.entry.linesInserted, origem: result.entry.source });
  showValidation('Etapa completada parcialmente. Leia o trecho inserido, execute o preview e continue a atividade.', 'warning');
  Utils.toast('Bloco inserido com marcação e histórico.');
}

function undoSupport() {
  const editor = $('#studentEditor');
  const result = LearningSupport.undoLatest(state, file, editor.value);
  if (!result.ok) { Utils.toast(result.message); renderSupportStatus(); return; }
  editor.value = result.content; state.answers[file] = result.content;
  state.origin[file] = LearningSupport.activeEntries(state, file).length ? 'misto' : 'digitado';
  state.done[file] = false; state.completed = false; state.completedAt = null;
  save(); syncEditor(); renderPracticePreview(); renderOrigin(); renderCodeHealth(); renderSupportStatus();
  showValidation('Preenchimento automático desfeito. O histórico de uso foi preservado.', 'warning');
}

function openTeacherAuthorization() {
  $('#teacherAuthorizationCode').value = '';
  $('#teacherAuthorizationMessage').textContent = `Usuário: ${currentUsername()} · exercício ${exercise().numero} · arquivo ${exercise().nomesArquivos[file]}`;
  AppShell.openOverlay($('#teacherAuthorizationModal'));
  setTimeout(() => $('#teacherAuthorizationCode').focus(), 30);
}

function closeTeacherAuthorization() { AppShell.closeOverlay($('#teacherAuthorizationModal')); }

function importTeacherAuthorization() {
  const result = LearningSupport.verifyAuthorization($('#teacherAuthorizationCode').value, { username: currentUsername(), exercise: exercise().numero, file });
  if (!result.ok) { $('#teacherAuthorizationMessage').textContent = result.message; return; }
  const duplicate = state.learning.authorizations.some(item => item.nonce === result.payload.nonce);
  if (!duplicate) state.learning.authorizations.push(result.payload);
  LearningSupport.record(state, 'autorizacao_professor_importada', { file, nonce: result.payload.nonce, reason: result.payload.reason });
  save(); closeTeacherAuthorization(); renderSupportStatus();
  Utils.toast('Autorização registrada para este arquivo.');
}

function validate() {
  const value = $('#studentEditor').value;
  const markerAudit = LearningSupport.auditMarkers(state, file, value);
  if (!markerAudit.ok) {
    state.done[file] = false; state.completed = false; state.completedAt = null; save();
    showValidation('A marcação de um bloco automático foi removida ou alterada. Use “Desfazer preenchimento automático” ou restaure a marcação antes de validar.', 'danger');
    renderSupportStatus();
    return;
  }
  const gate = RuntimeEnvironment.validationGate(state, file, exercise());
  if (!gate.ok) {
    state.done[file] = false;
    state.completed = false;
    state.completedAt = null;
    save();
    showValidation(gate.message, 'warning');
    lastValidationResult = { summary: gate.message, issues: [{ title: 'Execução necessária', detail: gate.message }], suggestions: ['Execute o projeto e teste o resultado antes de validar.'], firstLine: null };
    renderValidationDetails(lastValidationResult, Math.max(1, state.attempts[file] || 0));
    renderRuntimeProblems();
    renderExecutionCheckpoints();
    return;
  }
  const expectedExercise = validationExercise();
  const result = Utils.validateCode(file, value, expectedExercise.arquivos[file], expectedExercise);

  if (!result.ok) {
    state.attempts[file] = (state.attempts[file] || 0) + 1;
    state.lastDiagnosticLine[file] = result.firstLine || null;
    state.completed = false;
    state.completedAt = null;
    lastValidationResult = result;
    validationPanelManuallyClosed = false;
    save();

    const attempt = state.attempts[file];
    showValidation(`Tentativa ${attempt}: ${result.summary} O Modo Ajuda está disponível abaixo desde esta tentativa.`, 'danger');
    markDiagnosticLine();
    renderValidationDetails(result, attempt);
    window.AppAuth?.log('validacao_falhou', { arquivo: file, tentativa: attempt, resumo: result.summary });
    renderExecutionCheckpoints();
    renderRuntimeProblems();
    return;
  }

  state.answers[file] = value;
  state.done[file] = true;
  renderExecutionCheckpoints();
  state.attempts[file] = 0;
  state.lastDiagnosticLine[file] = null;
  lastValidationResult = null;
  validationPanelManuallyClosed = false;
  hideValidationDetails(false);
  const index = fileIndex();
  if (index < order.length - 1) {
    state.unlocked[order[index + 1]] = true;
    save();
    showValidation('Arquivo concluído! A validação aceitou a estrutura do código e o próximo arquivo foi liberado.', 'success');
    window.AppAuth?.log('arquivo_validado', { arquivo: file });
    setTimeout(() => {
      file = order[index + 1];
      explainStep = 0;
      view = 'explain';
      renderAll();
    }, 650);
  } else {
    state.completed = false;
    state.completedAt = null;
    save();
    window.AppAuth?.log('exercicio_pronto_para_concluir', { numero: exercise().numero });
    view = 'completion';
    renderAll();
    $('#completion').scrollIntoView({ behavior: 'smooth' });
  }
}

function renderCodeHealth() {
  const element = $('#codeHealth');
  if (!element) return;
  const value = view === 'practice' ? ($('#studentEditor')?.value || state.answers[file] || '') : (state.answers[file] || '');
  const analysis = state.done[file]
    ? { percentage: 100, remaining: 0, status: 'Validado', state: 'correct', message: 'Este arquivo já foi validado e está concluído.' }
    : Utils.analyzeCompleteness(file, value, exercise().arquivos[file], exercise());
  element.dataset.state = analysis.state;
  $('#codeHealthBar').style.width = `${analysis.percentage}%`;
  $('#codeHealthPercent').textContent = `${analysis.percentage}%`;
  $('#codeHealthStatus').textContent = analysis.status;
  $('#codeHealthStatus').className = `chip ${analysis.state === 'correct' ? 'success' : analysis.state === 'error' ? 'warning' : 'info'}`;
  $('#codeHealthMessage').textContent = analysis.message;
  $('#codeHealthRemaining').textContent = analysis.percentage === 0 ? 'Comece pelo primeiro trecho' : analysis.remaining ? `Restam cerca de ${analysis.remaining}%` : 'Pronto para validar';
}

function diagnosticSnippet(code, line, radius = 1) {
  const lines = String(code || '').split('\n');
  const target = Math.min(Math.max(Number(line) || 1, 1), Math.max(lines.length, 1));
  const start = Math.max(1, target - radius);
  const end = Math.min(lines.length, target + radius);
  return lines.slice(start - 1, end).map((text, index) => `${String(start + index).padStart(3, ' ')} | ${text}`).join('\n') || '  1 | ';
}

function updateDiagnosticComparison() {
  const comparison = $('#validationComparison');
  if (!comparison || !lastValidationResult || validationPanelManuallyClosed) return;
  const line = lastValidationResult.firstLine || state.lastDiagnosticLine[file] || 1;
  $('#diagnosticStudentCode').textContent = diagnosticSnippet($('#studentEditor')?.value || state.answers[file], line);
  $('#diagnosticReferenceCode').textContent = diagnosticSnippet(validationExercise().arquivos[file], line);
  comparison.hidden = false;
  $('#diagnosticLiveNote').hidden = false;
}

function renderValidationDetails(result, attempt) {
  const panel = $('#validationDetails');
  lastValidationResult = result;
  validationPanelManuallyClosed = false;
  panel.hidden = false;
  $('#validationAttemptBadge').textContent = `${attempt} tentativa${attempt === 1 ? '' : 's'}`;
  $('#validationSummary').textContent = result.summary || 'Revise os pontos identificados.';
  $('#validationEncouragement').textContent = 'Parabéns por insistir e revisar seu próprio código. Digitar, testar e corrigir faz parte da aprendizagem. Cada erro encontrado aumenta sua autonomia.';

  const issues = result.issues?.length ? result.issues : [{ title: 'Diferença encontrada', detail: 'Revise o arquivo com o tutorial.' }];
  $('#validationIssues').innerHTML = '';
  issues.slice(0, 8).forEach(issue => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = issue.title;
    item.append(title);
    item.append(document.createTextNode(` - ${issue.detail}`));
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

  $('#diagnosticFocusLine').hidden = !result.firstLine;
  updateDiagnosticComparison();
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideValidationDetails(manual = false) {
  const panel = $('#validationDetails');
  if (panel) panel.hidden = true;
  if (manual) validationPanelManuallyClosed = true;
  const encouragement = $('#validationEncouragement');
  if (encouragement) encouragement.textContent = '';
  const comparison = $('#validationComparison');
  if (comparison) comparison.hidden = true;
  const note = $('#diagnosticLiveNote');
  if (note) note.hidden = true;
}

function focusDiagnosticLine() {
  const targetLine = state.lastDiagnosticLine[file];
  const textarea = $('#studentEditor');
  if (!targetLine || !textarea) return;
  const lines = textarea.value.split('\n');
  const start = lines.slice(0, Math.max(0, targetLine - 1)).reduce((total, line) => total + line.length + 1, 0);
  const end = start + (lines[targetLine - 1]?.length || 0);
  textarea.focus();
  textarea.setSelectionRange(start, end);
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 23;
  textarea.scrollTop = Math.max(0, (targetLine - 3) * lineHeight);
  syncScroll();
  updateActiveLine();
}

function showValidation(text, type) {
  const element = $('#validationMessage');
  element.textContent = text;
  element.style.color = type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)';
}

function syncEditor() {
  const textarea = $('#studentEditor');
  const content = textarea.value || '';
  const highlight = $('#highlightLayer');
  if (highlight) {
    const rendered = Utils.highlight(content, file) || '&nbsp;';
    highlight.innerHTML = rendered + (content.endsWith('\n') ? '\n&nbsp;' : '');
  }
  const count = Math.max(1, content.split('\n').length);
  if (count !== lastLineCount) {
    const lineNumbers = $('#lineNumbers');
    lineNumbers.textContent = '';
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const line = document.createElement('div');
      line.textContent = String(index + 1);
      fragment.append(line);
    }
    lineNumbers.append(fragment);
    lastLineCount = count;
  }
  syncScroll();
  updateActiveLine();
  markDiagnosticLine();
  renderSaveStatus(Utils.storageAvailable());
}

function syncScroll() {
  const textarea = $('#studentEditor');
  const highlight = $('#highlightLayer');
  if (highlight && !highlight.hidden) {
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
  }
  $('#lineNumbers').scrollTop = textarea.scrollTop;
}

function activeLine() {
  const textarea = $('#studentEditor');
  return textarea.value.slice(0, textarea.selectionStart).split('\n').length;
}

function updateActiveLine() {
  $$('#lineNumbers div').forEach((line, index) => line.classList.toggle('active', index + 1 === activeLine()));
}


function selectStudentCode() {
  const textarea = $('#studentEditor');
  textarea.focus();
  textarea.select();
  Utils.toast('Todo o código digitado foi selecionado.');
}

function copyStudentCode() {
  Utils.copy($('#studentEditor').value, 'Código digitado copiado exatamente como está no editor.');
}

function tabKey(event) {
  if (event.key !== 'Tab') return;
  event.preventDefault();
  const textarea = event.target;
  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
  const selectedEnd = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const lineEndIndex = value.indexOf('\n', selectedEnd);
  const blockEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const block = value.slice(lineStart, blockEnd);
  const lines = block.split('\n');

  if (event.shiftKey) {
    let removedBeforeStart = 0;
    let totalRemoved = 0;
    const adjusted = lines.map((line, index) => {
      const match = line.match(/^(?: {1,4}|\t)/);
      const removed = match ? match[0].length : 0;
      if (index === 0) removedBeforeStart = Math.min(removed, start - lineStart);
      totalRemoved += removed;
      return removed ? line.slice(removed) : line;
    });
    textarea.value = value.slice(0, lineStart) + adjusted.join('\n') + value.slice(blockEnd);
    textarea.selectionStart = Math.max(lineStart, start - removedBeforeStart);
    textarea.selectionEnd = Math.max(textarea.selectionStart, end - totalRemoved);
  } else if (start !== end) {
    const adjusted = lines.map(line => `    ${line}`).join('\n');
    textarea.value = value.slice(0, lineStart) + adjusted + value.slice(blockEnd);
    textarea.selectionStart = start + 4;
    textarea.selectionEnd = end + (4 * lines.length);
  } else {
    textarea.value = value.slice(0, start) + '    ' + value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + 4;
  }
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}


function composeStudentPreview() {
  const answers = {
    html: state.answers.html || '',
    css: state.answers.css || '',
    js: state.answers.js || ''
  };
  if (view === 'practice') answers[file] = $('#studentEditor').value;
  practiceRunId = `practice-${exercise().numero}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const result = Utils.buildCodePreviewDocument(answers, { runId: practiceRunId });
  return { html: result.srcdoc, hasHtml: Boolean(answers.html.trim()), runId: result.runId };
}


function schedulePracticePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    previewTimer = null;
    renderPracticePreview();
  }, 280);
}

function handleManualPreview() {
  captureCurrentEditor();
  LearningSupport.noteInteraction(state, file, 'execution');
  RuntimeEnvironment.ensureState(state);
  state.runtime.previewOpen = true;
  state.runtime.previewMinimized = false;
  renderPracticePreview({ explicit: true });
  scheduleSave();
  renderSupportStatus();
  setRuntimeTab('preview');
  renderRuntimePanel();
  renderExecutionCheckpoints();
}

function renderPracticePreview(options = {}) {
  const preview = composeStudentPreview();
  const message = $('#previewMessage');
  if (options.explicit) RuntimeEnvironment.beginRun(state, exercise(), preview.runId);
  message.dataset.state = 'loading';
  message.textContent = preview.hasHtml
    ? (options.explicit ? 'Executando o projeto atual...' : 'Preview de edição atualizado. Clique em “Executar projeto” para registrar um teste válido.')
    : 'Conclua o HTML para visualizar a página.';
  $('#studentPreview').srcdoc = preview.html;
  renderRuntimeStatus();
  renderExecutionCheckpoints();
}

function updatePhase() {
  if (view === 'explain') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} · tutorial`;
    $('#phaseTitle').textContent = 'Entenda antes de digitar';
    $('#phaseText').textContent = 'Veja o código em partes, observe as linhas e o resultado destacados e avance no seu ritmo.';
  } else if (view === 'full') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} · código completo`;
    $('#phaseTitle').textContent = 'Revise o arquivo completo';
    $('#phaseText').textContent = 'Compare o código com o preview. Você pode retornar ao tutorial quando precisar.';
  } else if (view === 'practice') {
    $('#phaseBadge').textContent = `${exercise().nomesArquivos[file]} · prática`;
    $('#phaseTitle').textContent = 'Digite, teste e valide';
    $('#phaseText').textContent = 'Organize o projeto no Explorador, digite no editor, execute no preview real e use Console ou Terminal antes de validar.';
  } else {
    $('#phaseBadge').textContent = 'conclusão';
    $('#phaseTitle').textContent = 'Envie a atividade';
    $('#phaseText').textContent = 'Baixe os arquivos, suba a pasta no GitHub e entregue o link no Classroom.';
  }
}

function renderProgress() {
  const completedFiles = order.filter(key => state.done[key]).length;
  let percentage = completedFiles * 30;
  if (!state.done[file]) {
    const steps = exercise().passos[file].length;
    const explained = Math.min(state.explained[file] || 0, steps);
    const phasePart = view === 'full' ? 0.6 : view === 'practice' ? 0.85 : steps ? (explained / steps) * 0.5 : 0;
    percentage = Math.max(percentage, fileIndex() * 30 + Math.round(phasePart * 30));
  }
  if (view === 'completion') percentage = state.completed ? 100 : 95;
  percentage = Math.min(100, percentage);
  $('#progressBar').style.width = `${percentage}%`;
  $('#progressText').textContent = `${percentage}%`;
  updatePhase();
}


function renderSaveStatus(permanent = Utils.storageAvailable()) {
  const scope = $('#saveScopeStatus');
  const user = currentUsername();
  if (scope) {
    scope.textContent = user === 'sem-usuario'
      ? 'aguardando usuário'
      : permanent ? `progresso de @${user}` : `sessão de @${user}`;
  }
}

function markDiagnosticLine() {
  const target = state.lastDiagnosticLine[file];
  $$('#lineNumbers div').forEach((line, index) => line.classList.toggle('diagnostic', Boolean(target) && index + 1 === Number(target)));
}

function renderDownloadHint() {
  const hint = $('#downloadProgressHint');
  if (!hint) return;
  const pending = order.filter(key => !state.done[key]).map(key => exercise().nomesArquivos[key]);
  hint.textContent = pending.length
    ? `Backup disponível: ${pending.length} arquivo(s) ainda não validado(s). O ZIP será marcado como incompleto e poderá ser enviado ao GitHub para continuar depois.`
    : 'Todos os arquivos foram validados. O ZIP está pronto para envio ao GitHub.';
}



function renderRuntimeStatus() {
  const element = $('#runtimeStatus');
  if (!element) return;
  const status = RuntimeEnvironment.status(state, exercise());
  element.textContent = status.text + (status.current && status.interactions ? ` · ${status.interactions} interação(ões)` : '');
  element.dataset.state = status.runStatus;
  element.className = `chip ${status.current ? 'success' : status.runStatus === 'error' ? 'danger' : 'warning'}`;
  renderExecutionCheckpoints();
}

function renderBehaviorScenarios() {
  const panel = $('#behaviorScenarioPanel');
  if (!panel || !window.BehaviorScenarios) return;
  const behavior = BehaviorScenarios.status(state, exercise());
  panel.hidden = !behavior.configured;
  if (!behavior.configured) { panel.innerHTML = ''; return; }
  panel.innerHTML = `
    <div class="behavior-head">
      <div><span class="chip ${behavior.blocking ? 'warning' : 'info'}">${behavior.blocking ? 'Cenários obrigatórios' : 'Cenários recomendados'}</span>
      <strong>Teste mais de um comportamento</strong></div>
      <span class="chip ${behavior.completed === behavior.total ? 'success' : 'warning'}">${behavior.completed}/${behavior.total}</span>
    </div>
    ${behavior.note ? `<p class="behavior-note">${Utils.escapeHtml(behavior.note)}</p>` : ''}
    <div class="behavior-list">${behavior.scenarios.map(item => `
      <div class="behavior-item ${item.done ? 'done' : ''}">
        <span>${item.done ? '✓' : '○'}</span><strong>${Utils.escapeHtml(item.label)}</strong>
      </div>`).join('')}</div>`;
}

function renderExecutionCheckpoints() {
  const list = $('#checkpointList');
  const summary = $('#checkpointSummary');
  if (!list || !summary) return;
  const items = RuntimeEnvironment.checkpointState(state, file, exercise());
  const completed = items.filter(item => item.done || item.neutral).length;
  summary.textContent = `${completed}/${items.length}`;
  summary.className = `chip ${completed === items.length ? 'success' : 'warning'}`;
  list.innerHTML = items.map(item => `
    <article class="checkpoint-item ${item.done ? 'done' : item.neutral ? 'neutral' : 'pending'}">
      <span class="checkpoint-icon">${item.done ? '✓' : item.neutral ? '—' : '○'}</span>
      <div><strong>${Utils.escapeHtml(item.label)}</strong><p>${Utils.escapeHtml(item.detail)}</p></div>
    </article>
  `).join('');
}

function setRuntimeTab(name) {
  RuntimeEnvironment.ensureState(state);
  const tab = ['preview', 'console', 'terminal', 'problems'].includes(name) ? name : 'preview';
  state.runtime.panel = tab;
  $$('.runtime-tab').forEach(button => {
    const active = button.dataset.runtimeTab === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  ['preview', 'console', 'terminal', 'problems'].forEach(key => {
    const pane = document.querySelector(`#runtime${key[0].toUpperCase()}${key.slice(1)}Pane`);
    if (pane) pane.hidden = key !== tab;
  });
  if (tab === 'terminal') {
    renderTerminal();
    setTimeout(() => $('#runtimeTerminalInput')?.focus(), 20);
  }
  if (tab === 'console') renderRuntimeConsole();
  if (tab === 'problems') renderRuntimeProblems();
}

function renderRuntimePanel() {
  RuntimeEnvironment.ensureState(state);
  const panel = $('#runtimePanel');
  if (!panel) return;
  panel.classList.toggle('preview-minimized', Boolean(state.runtime.previewMinimized));
  panel.classList.toggle('preview-closed', !state.runtime.previewOpen);
  $('#minimizePreview').textContent = state.runtime.previewMinimized ? 'Restaurar' : 'Minimizar';
  $('#closePreview').hidden = !state.runtime.previewOpen;
  $('#reopenPreview').hidden = state.runtime.previewOpen;
  renderRuntimeStatus();
  setRuntimeTab(state.runtime.panel || 'preview');
}

function togglePreviewMinimized() {
  RuntimeEnvironment.ensureState(state);
  state.runtime.previewOpen = true;
  state.runtime.previewMinimized = !state.runtime.previewMinimized;
  renderRuntimePanel();
  scheduleSave();
}

function closePreviewPane() {
  RuntimeEnvironment.ensureState(state);
  state.runtime.previewOpen = false;
  state.runtime.previewMinimized = false;
  state.runtime.panel = 'console';
  renderRuntimePanel();
  scheduleSave();
}

function reopenPreviewPane() {
  RuntimeEnvironment.ensureState(state);
  state.runtime.previewOpen = true;
  state.runtime.previewMinimized = false;
  state.runtime.panel = 'preview';
  renderRuntimePanel();
  renderPracticePreview();
  scheduleSave();
}

function renderRuntimeConsole() {
  const output = $('#runtimeConsoleOutput');
  if (!output) return;
  RuntimeEnvironment.ensureState(state);
  output.textContent = '';
  if (!state.runtime.console.length) {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.dataset.level = 'info';
    line.textContent = 'O console exibirá console.log(), avisos e erros do JavaScript executado no preview.';
    output.append(line);
    return;
  }
  state.runtime.console.forEach(item => {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.dataset.level = item.level;
    const time = item.at ? new Date(item.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
    line.textContent = `${time ? `[${time}] ` : ''}${item.text}`;
    output.append(line);
  });
  output.scrollTop = output.scrollHeight;
}

function renderRuntimeProblems() {
  const output = $('#runtimeProblemsOutput');
  if (!output) return;
  output.textContent = '';
  const problems = [];
  const runtimeStatus = RuntimeEnvironment.status(state, exercise());
  if (runtimeStatus.runStatus === 'error' && runtimeStatus.lastRuntimeError) {
    problems.push({ title: 'Erro na execução', detail: `${runtimeStatus.lastRuntimeError.message}${runtimeStatus.lastRuntimeError.line ? ` · linha ${runtimeStatus.lastRuntimeError.line}` : ''}` });
  } else if (!runtimeStatus.current) {
    problems.push({ title: runtimeStatus.runStatus === 'running' ? 'Execução em andamento' : 'Execução desatualizada', detail: runtimeStatus.runStatus === 'running' ? 'Aguarde o Preview confirmar o carregamento.' : 'Execute o projeto depois da última alteração.' });
  }
  if (file === 'js' && runtimeStatus.current && runtimeStatus.missingInteractions.length) {
    problems.push({ title: 'Interação ainda não testada', detail: `Falta testar: ${runtimeStatus.missingInteractions.join(', ')}.` });
  }
  if (file === 'js' && window.BehaviorScenarios) {
    const behavior = BehaviorScenarios.status(state, exercise());
    if (behavior.configured && behavior.blocking && behavior.missing.length) {
      problems.push({title:'Cenários ainda não testados', detail:`Restam ${behavior.missing.length} cenário(s) obrigatório(s).`});
    }
  }
  if (lastValidationResult?.issues?.length) {
    lastValidationResult.issues.slice(0, 10).forEach(issue => problems.push({ title: issue.title || 'Validação', detail: issue.detail || '' }));
  }
  if (!problems.length) problems.push({ title: 'Nenhum problema ativo', detail: 'Execute, interaja com o preview e valide o arquivo atual.' });
  problems.forEach(problem => {
    const card = document.createElement('div');
    card.className = 'problem-card';
    const title = document.createElement('strong');
    title.textContent = problem.title;
    const detail = document.createElement('span');
    detail.textContent = problem.detail;
    card.append(title, detail);
    output.append(card);
  });
}

function fileKindLabel(path) {
  const lang = Workspace.languageFor(path);
  const labels = { html: 'HTML', css: 'CSS', js: 'JS', json: 'JSON', markdown: 'MD', text: 'TXT', python: 'PY', java: 'JAVA', c: 'C', cpp: 'C++', csharp: 'C#', kotlin: 'KT', php: 'PHP', sql: 'SQL', xml: 'XML' };
  return labels[lang] || 'ARQ';
}

function renderWorkspaceExplorer() {
  if (!$('#workspaceTree')) return;
  Workspace.ensureState(state, exercise());
  $('#workspaceRootName').textContent = projectFolderName();
  const rootSummary = $('#workspaceRootNameSummary');
  if (rootSummary) rootSummary.textContent = projectFolderName();
  const tree = $('#workspaceTree');
  tree.textContent = '';

  const folders = Workspace.allFolders(state, exercise());
  const files = Workspace.allFiles(state, exercise());
  const items = [
    ...folders.map(path => ({ path, folder: true })),
    ...files.map(entry => ({ path: entry.path, folder: false, entry }))
  ].sort((left, right) => {
    const lparts = left.path.split('/');
    const rparts = right.path.split('/');
    if (lparts.length !== rparts.length) return lparts.length - rparts.length;
    return left.path.localeCompare(right.path, 'pt-BR');
  });

  items.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'workspace-tree-row';
    button.dataset.path = item.path;
    button.dataset.depth = Math.min(4, Math.max(0, item.path.split('/').length - 1));
    button.classList.toggle('active', state.workspace.selectedPath === item.path);
    button.setAttribute('role', 'treeitem');
    const kind = document.createElement('span');
    kind.className = 'tree-kind';
    kind.textContent = item.folder ? 'PASTA' : fileKindLabel(item.path);
    const name = document.createElement('span');
    name.className = 'tree-name';
    name.textContent = item.path;
    button.append(kind, name);
    button.addEventListener('click', () => {
      state.workspace.selectedPath = item.path;
      if (!item.folder) openWorkspaceFile(item.path);
      else renderWorkspaceExplorer();
    });
    tree.append(button);
  });
}

function openWorkspaceFile(path) {
  const entry = Workspace.getFile(state, path, exercise());
  if (!entry) return;
  state.workspace.selectedPath = path;
  if (entry.main) {
    if (!state.unlocked[entry.key]) {
      Utils.toast('Esse arquivo obrigatório ainda está bloqueado pela sequência da atividade.');
      renderWorkspaceExplorer();
      return;
    }
    flushSave();
    file = entry.key;
    explainStep = Math.min(state.explained[file] || 0, exercise().passos[file].length - 1);
    view = 'practice';
    renderAll();
    setTimeout(() => $('#studentEditor')?.focus(), 30);
    return;
  }
  workspaceExtraPath = path;
  $('#workspaceExtraEditorTitle').textContent = path;
  $('#workspaceExtraLanguage').textContent = Workspace.languageFor(path);
  $('#workspaceExtraEditor').value = entry.content;
  AppShell.openOverlay($('#workspaceExtraEditorModal'));
  setTimeout(() => $('#workspaceExtraEditor')?.focus(), 30);
  renderWorkspaceExplorer();
}

function closeWorkspaceExtraEditor() {
  workspaceExtraPath = null;
  AppShell.closeOverlay($('#workspaceExtraEditorModal'));
}

function saveWorkspaceExtraEditor() {
  if (!workspaceExtraPath) return closeWorkspaceExtraEditor();
  const result = Workspace.setFileContent(state, workspaceExtraPath, $('#workspaceExtraEditor').value, exercise());
  if (!result.ok) {
    Utils.toast(result.message || 'Não foi possível salvar o arquivo.');
    return;
  }
  RuntimeEnvironment.markEdited(state);
    window.BehaviorScenarios?.resetAfterEdit(state);
  save();
  closeWorkspaceExtraEditor();
  renderWorkspaceExplorer();
  renderRuntimeStatus();
  Utils.toast('Arquivo extra salvo no projeto virtual.');
}

function openWorkspaceAction(action) {
  Workspace.ensureState(state, exercise());
  workspaceAction = action;
  let title = 'Organizar projeto';
  let text = '';
  let value = '';
  if (action === 'new-folder') {
    title = 'Criar pasta';
    text = 'Informe o caminho relativo. Exemplo: assets ou dados/imagens.';
  } else if (action === 'new-file') {
    title = 'Criar arquivo';
    text = 'Informe o caminho relativo e a extensão. Exemplo: assets/dados.json.';
  } else if (action === 'rename-root') {
    title = 'Renomear pasta do projeto';
    text = 'Esse nome será usado como pasta raiz e também no ZIP exportado.';
    value = projectFolderName();
  } else if (action === 'rename-selected') {
    const selected = state.workspace.selectedPath;
    if (!selected) return Utils.toast('Selecione um arquivo ou pasta no Explorador.');
    title = 'Renomear selecionado';
    text = `Item atual: ${selected}`;
    value = selected;
  }
  $('#workspaceActionTitle').textContent = title;
  $('#workspaceActionText').textContent = text;
  $('#workspaceActionValue').value = value;
  $('#workspaceActionMessage').textContent = '';
  AppShell.openOverlay($('#workspaceActionModal'));
  setTimeout(() => { $('#workspaceActionValue').focus(); $('#workspaceActionValue').select(); }, 30);
}

function closeWorkspaceAction() {
  workspaceAction = null;
  AppShell.closeOverlay($('#workspaceActionModal'));
}

function confirmWorkspaceAction() {
  const value = $('#workspaceActionValue').value.trim();
  let result = { ok: false, message: 'Ação inválida.' };
  if (workspaceAction === 'new-folder') result = Workspace.createFolder(state, value, exercise());
  else if (workspaceAction === 'new-file') result = Workspace.createFile(state, value, exercise());
  else if (workspaceAction === 'rename-root') result = Workspace.renameRoot(state, value, exercise());
  else if (workspaceAction === 'rename-selected') {
    const selected = state.workspace.selectedPath;
    const target = !value.includes('/') && Workspace.dirname(selected) ? `${Workspace.dirname(selected)}/${value}` : value;
    result = Workspace.renamePath(state, selected, target, exercise());
  }

  if (!result.ok) {
    $('#workspaceActionMessage').textContent = result.message || 'Não foi possível realizar a alteração.';
    return;
  }
  if (result.referenceChanged) {
    state.done.html = false;
    state.completed = false;
    state.completedAt = null;
    RuntimeEnvironment.markEdited(state);
    window.BehaviorScenarios?.resetAfterEdit(state);
    showValidation('O nome de um arquivo principal mudou e a referência correspondente no HTML foi atualizada automaticamente. Execute e valide novamente.', 'warning');
  }
  save();
  closeWorkspaceAction();
  renderAll();
  Utils.toast(result.referenceChanged ? 'Renomeado. O HTML também foi atualizado para preservar a ligação entre os arquivos.' : 'Estrutura do projeto atualizada.');
}

function workspaceMime(entry) {
  const language = entry.language || Workspace.languageFor(entry.path);
  const map = {
    html: 'text/html;charset=utf-8',
    css: 'text/css;charset=utf-8',
    js: 'text/javascript;charset=utf-8',
    json: 'application/json;charset=utf-8',
    markdown: 'text/markdown;charset=utf-8',
    python: 'text/x-python;charset=utf-8',
    xml: 'application/xml;charset=utf-8',
    sql: 'text/plain;charset=utf-8'
  };
  return map[language] || 'text/plain;charset=utf-8';
}

function downloadWorkspacePath(path) {
  captureCurrentEditor();
  const entry = Workspace.getFile(state, path, exercise());
  if (!entry) return Utils.toast('Arquivo não encontrado no projeto.');
  Utils.download(Workspace.basename(path), entry.content, workspaceMime(entry));
  window.AppAuth?.log('workspace_arquivo_baixado', { path });
}

function downloadSelectedWorkspaceFile() {
  const path = state.workspace?.selectedPath;
  if (!path) return Utils.toast('Selecione um arquivo no Explorador.');
  const entry = Workspace.getFile(state, path, exercise());
  if (!entry) return Utils.toast('Selecione um arquivo, não uma pasta.');
  downloadWorkspacePath(path);
}

function openIndividualDownloads() {
  captureCurrentEditor();
  Workspace.ensureState(state, exercise());
  const list = $('#individualDownloadsList');
  list.textContent = '';
  Workspace.allFiles(state, exercise()).forEach(entry => {
    const row = document.createElement('div');
    row.className = 'individual-download-row';
    const label = document.createElement('code');
    label.textContent = entry.path;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary compact';
    button.textContent = 'Baixar';
    button.addEventListener('click', () => downloadWorkspacePath(entry.path));
    row.append(label, button);
    list.append(row);
  });
  AppShell.openOverlay($('#individualDownloadsModal'));
}

function terminalAppend(text, type = 'normal') {
  const output = $('#runtimeTerminalOutput');
  if (!output) return;
  const line = document.createElement('div');
  line.dataset.type = type;
  line.textContent = String(text || '');
  output.append(line);
  output.scrollTop = output.scrollHeight;
}

function renderTerminal() {
  Workspace.ensureState(state, exercise());
  $('#runtimeTerminalPrompt').textContent = Workspace.promptPath(state, exercise());
  if (!terminalWelcomeShown) {
    terminalAppend(`Terminal virtual do projeto ${projectFolderName()}.`);
    terminalAppend('Digite help para listar os comandos. O terminal não executa comandos no computador real.');
    terminalWelcomeShown = true;
  }
}

function runTerminalCommand() {
  const input = $('#runtimeTerminalInput');
  const command = input.value.trim();
  if (!command) return;
  renderTerminal();
  terminalAppend(`${Workspace.promptPath(state, exercise())} ${command}`, 'command');
  const beforeMain = JSON.stringify({ answers: state.answers, names: state.workspace?.mainNames });
  const result = Workspace.shell(state, exercise(), command);
  const afterMain = JSON.stringify({ answers: state.answers, names: state.workspace?.mainNames });
  input.value = '';
  if (result.action?.type === 'clear') {
    $('#runtimeTerminalOutput').textContent = '';
    terminalWelcomeShown = false;
    renderTerminal();
    return;
  }
  (result.lines || []).forEach(line => terminalAppend(line, result.ok ? 'normal' : 'error'));
  if (result.mutated) {
    if (beforeMain !== afterMain) {
      state.done.html = false;
      state.done.css = false;
      state.done.js = false;
      state.completed = false;
      state.completedAt = null;
      RuntimeEnvironment.markEdited(state);
    window.BehaviorScenarios?.resetAfterEdit(state);
    }
    save();
    renderWorkspaceExplorer();
    renderRuntimeStatus();
  }
  if (result.action?.type === 'preview') {
    handleManualPreview();
  } else if (result.action?.type === 'edit') {
    openWorkspaceFile(result.action.path);
  } else if (result.action?.type === 'download') {
    downloadWorkspacePath(result.action.path);
  } else if (result.action?.type === 'cwd') {
    save();
  }
  renderTerminal();
}


function captureCurrentEditor() {
  const editor = $('#studentEditor');
  if (editor && view === 'practice') {
    state.answers[file] = editor.value;
    Workspace.ensureState(state, exercise());
  }
}

function preparedContent(key) {
  captureCurrentEditor();
  return String(state.answers[key] ?? '');
}

function addRecord(key, code) {
  return String(code ?? '');
}


function openDownloadConfirm(title, message, pendingNames, action) {
  pendingDownloadAction = action;
  $('#downloadConfirmTitle').textContent = title;
  $('#downloadConfirmText').textContent = message;
  const container = $('#downloadPendingFiles');
  container.textContent = '';
  if (pendingNames.length) {
    const intro = document.createElement('strong');
    intro.textContent = 'Arquivos pendentes:';
    const list = document.createElement('ul');
    pendingNames.forEach(name => { const item = document.createElement('li'); item.textContent = name; list.append(item); });
    container.append(intro, list);
  } else {
    container.textContent = 'O conteúdo será baixado exatamente como está no editor.';
  }
  AppShell.openOverlay($('#downloadConfirmModal'));
}

function closeDownloadConfirm() {
  pendingDownloadAction = null;
  AppShell.closeOverlay($('#downloadConfirmModal'));
}

function confirmIncompleteDownload() {
  const action = pendingDownloadAction;
  pendingDownloadAction = null;
  AppShell.closeOverlay($('#downloadConfirmModal'));
  if (typeof action === 'function') action();
}

function performDownloadProgressZip() {
  captureCurrentEditor();
  const pending = order.filter(key => !state.done[key]);
  const root = projectFolderName();
  const files = Workspace.exportEntries(state, exercise()).map(entry => ({
    name: `${root}/${entry.path}`,
    content: entry.content
  }));
  const readme = [
    `Exercício ${String(exercise().numero).padStart(2, '0')} - projeto exportado`, '',
    pending.length ? 'STATUS: EM ANDAMENTO' : 'STATUS: VALIDADO',
    pending.length ? `Arquivos obrigatórios pendentes: ${pending.map(key => displayFileName(key)).join(', ')}` : 'Todos os arquivos obrigatórios foram validados na plataforma.', '',
    'A estrutura do ZIP corresponde ao Explorador do projeto na plataforma.',
    'Os arquivos contêm exatamente o texto salvo pelo aluno. Arquivos extras e subpastas também são preservados.',
    'O terminal desta atividade é virtual e atua somente nesta estrutura de projeto.',
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`
  ].join('\n');
  files.push({ name: `${root}/LEIA-ME-PROGRESSO.txt`, content: readme });
  const supportMetadata = LearningSupport.metadata(state, exercise(), currentUsername());
  if (supportMetadata.used) files.push({ name: `${root}/autocompletar.json`, content: JSON.stringify(supportMetadata, null, 2) });
  const zipName = pending.length ? `${root}-EM-ANDAMENTO.zip` : `${root}.zip`;
  Utils.downloadZip(zipName, files);
  window.AppAuth?.log('progresso_zip_baixado', { pasta: root, pendentes: pending.map(key => displayFileName(key)), arquivos: files.length });
  Utils.toast(pending.length ? 'Projeto em andamento baixado com a estrutura atual.' : 'Projeto validado baixado com a estrutura atual.');
}

function downloadProgressZip() {
  captureCurrentEditor();
  flushSave();
  const pending = order.filter(key => !state.done[key]);
  if (pending.length) {
    openDownloadConfirm(
      'Seu projeto ainda está em andamento',
      'Existem arquivos vazios, incompletos ou que ainda não foram validados. Você pode baixar mesmo assim para salvar no GitHub, continuar em outro computador ou retomar a atividade depois.',
      pending.map(key => displayFileName(key)),
      performDownloadProgressZip
    );
    return;
  }
  performDownloadProgressZip();
}

function allFilesValidated() { return order.every(key => state.done[key]); }

function confirmCompletion() {
  if (!allFilesValidated()) {
    Utils.toast('Valide os três arquivos antes de concluir.');
    return;
  }
  state.completed = true;
  state.completedAt = new Date().toISOString();
  save();
  window.AppAuth?.log('exercicio_concluido', { numero: exercise().numero, confirmado: true });
  renderCompletion();
  renderProgress();
  Utils.toast('Conclusão registrada neste navegador. Agora prepare a entrega.');
}

function renderCompletion() {
  const folderLabel = $('#completionFolder');
  if (folderLabel) folderLabel.textContent = projectFolderName();
  const validated = allFilesValidated();
  const completed = Boolean(state.completed && validated);
  const badge = $('#completionStatusBadge');
  badge.textContent = completed ? 'Atividade concluída' : validated ? 'Pronto para concluir' : 'Atividade em andamento';
  badge.className = `chip ${completed ? 'success' : 'warning'}`;
  $('#completionTitle').textContent = completed ? 'Prepare a entrega' : 'Confirme a conclusão';
  $('#completionText').textContent = completed
    ? `Conclusão confirmada${state.completedAt ? ` em ${new Date(state.completedAt).toLocaleString('pt-BR')}` : ''}. Baixe os arquivos e envie a pasta no GitHub.`
    : 'Os três arquivos foram validados. Confirme a conclusão antes de preparar a entrega.';
  $('#confirmCompletion').hidden = completed || !validated;
  $('#completionChecklist').innerHTML = [
    `<p>${validated ? '✓' : '○'} Código concluído</p>`,
    `<p>${validated ? '✓' : '○'} Arquivos validados</p>`,
    `<p>${completed ? '✓' : '○'} Conclusão confirmada</p>`,
    `<p>○ Subir a pasta <code id="completionFolderMirror">${Utils.escapeHtml(projectFolderName())}</code> no GitHub</p>`,
    '<p>○ Copiar o link do repositório</p>',
    '<p>○ Entregar o link no Classroom</p>'
  ].join('');
  order.forEach(key => {
    const button = document.querySelector(`[data-download="${key}"]`);
    if (button) button.textContent = `Baixar ${displayFileName(key)}`;
  });
  renderDownloadHint();
  renderViews();
  renderWorkspaceExplorer();
}

function performDownloadFile(key) {
  const content = preparedContent(key);
  const incomplete = !state.done[key];
  const type = key === 'html' ? 'text/html;charset=utf-8' : key === 'css' ? 'text/css;charset=utf-8' : 'text/javascript;charset=utf-8';
  Utils.download(displayFileName(key), content, type);
  window.AppAuth?.log('arquivo_baixado', { arquivo: key, nome: displayFileName(key), incompleto: incomplete });
  Utils.toast(incomplete ? 'Arquivo em andamento baixado sem alterações automáticas.' : 'Arquivo validado baixado.');
}

function downloadFile(key) {
  captureCurrentEditor();
  flushSave();
  if (!state.done[key]) {
    openDownloadConfirm(
      `${displayFileName(key)} ainda não foi validado`,
      'Você pode baixar exatamente o conteúdo digitado, inclusive se estiver vazio.',
      [displayFileName(key)],
      () => performDownloadFile(key)
    );
    return;
  }
  performDownloadFile(key);
}

function openInfo(type) {
  if (type === 'contexto') AppShell.openInfo('Contexto do exercício', Utils.contextHtml(exercise()));
  if (type === 'dicas') AppShell.openInfo('Dicas para realizar a atividade', Utils.tipsHtml(exercise(), false));
  if (type === 'explicacao') {
    const currentStep = exercise().passos[file][explainStep] || exercise().passos[file][0];
    AppShell.openInfo('Explicação da parte atual', `<div class="drawer-section"><span class="chip">${Utils.escapeHtml(displayFileName(file))} · linhas ${currentStep.linhas[0]}–${currentStep.linhas[1]}</span></div>${Utils.stepDetailsHtml(currentStep)}<p class="muted">Feche a gaveta para continuar o tutorial. Seu progresso não será perdido.</p>`);
  }
  if (type === 'termos') AppShell.openInfo('Termos e palavras do código', Utils.glossaryHtml(exercise()));
}

init();

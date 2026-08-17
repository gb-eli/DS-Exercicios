window.RuntimeEnvironment = (() => {
  function simpleHash(value = '') {
    let hash = 2166136261;
    const text = String(value || '');
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function ensureState(state) {
    if (!state.runtime || typeof state.runtime !== 'object') state.runtime = {};
    const runtime = state.runtime;
    runtime.version = 3;
    runtime.explicitRunHash = runtime.explicitRunHash || null;
    runtime.explicitRunAt = runtime.explicitRunAt || null;
    runtime.activeRunId = runtime.activeRunId || null;
    runtime.runStatus = ['idle', 'running', 'ready', 'error'].includes(runtime.runStatus) ? runtime.runStatus : 'idle';
    runtime.readyAt = runtime.readyAt || null;
    runtime.lastRuntimeError = runtime.lastRuntimeError || null;
    runtime.runtimeErrorCount = Number(runtime.runtimeErrorCount || 0);
    runtime.interactionsAfterRun = Number(runtime.interactionsAfterRun || 0);
    runtime.interactionEvents = runtime.interactionEvents && typeof runtime.interactionEvents === 'object' ? runtime.interactionEvents : {};
    runtime.lastInteractionAt = runtime.lastInteractionAt || null;
    runtime.stale = typeof runtime.stale === 'boolean' ? runtime.stale : true;
    runtime.console = Array.isArray(runtime.console) ? runtime.console.slice(-250) : [];
    runtime.panel = ['preview', 'console', 'terminal', 'problems'].includes(runtime.panel) ? runtime.panel : 'preview';
    runtime.previewOpen = typeof runtime.previewOpen === 'boolean' ? runtime.previewOpen : true;
    runtime.previewMinimized = typeof runtime.previewMinimized === 'boolean' ? runtime.previewMinimized : false;
    if (runtime.focusLayoutVersion !== 1) {
      runtime.previewOpen = false;
      runtime.previewMinimized = false;
      runtime.panel = 'preview';
      runtime.focusLayoutVersion = 1;
    }
    return runtime;
  }

  function projectHash(state, exercise) {
    ensureState(state);
    if (window.Workspace) Workspace.ensureState(state, exercise);
    const names = window.Workspace
      ? Workspace.MAIN_KEYS.map(key => Workspace.mainPath(state, key, exercise))
      : ['index.html', 'estilo.css', 'script.js'];
    return simpleHash(JSON.stringify({
      names,
      html: String(state.answers?.html || ''),
      css: String(state.answers?.css || ''),
      js: String(state.answers?.js || '')
    }));
  }

  function markEdited(state) {
    const runtime = ensureState(state);
    runtime.stale = true;
    runtime.runStatus = 'idle';
    runtime.activeRunId = null;
    runtime.readyAt = null;
    runtime.lastRuntimeError = null;
    runtime.runtimeErrorCount = 0;
    runtime.interactionsAfterRun = 0;
    runtime.interactionEvents = {};
  }

  function beginRun(state, exercise, runId) {
    const runtime = ensureState(state);
    runtime.explicitRunHash = projectHash(state, exercise);
    runtime.explicitRunAt = new Date().toISOString();
    runtime.activeRunId = String(runId || '');
    runtime.runStatus = 'running';
    runtime.readyAt = null;
    runtime.lastRuntimeError = null;
    runtime.runtimeErrorCount = 0;
    runtime.interactionsAfterRun = 0;
    runtime.interactionEvents = {};
    runtime.lastInteractionAt = null;
    runtime.stale = false;
    return runtime.explicitRunHash;
  }

  function markExplicitRun(state, exercise, runId) {
    return beginRun(state, exercise, runId);
  }

  function markReady(state, runId) {
    const runtime = ensureState(state);
    if (!runtime.activeRunId || String(runId || '') !== runtime.activeRunId) return false;
    if (runtime.runStatus === 'error') return false;
    runtime.runStatus = 'ready';
    runtime.readyAt = new Date().toISOString();
    return true;
  }

  function markRuntimeError(state, runId, error = {}) {
    const runtime = ensureState(state);
    if (!runtime.activeRunId || String(runId || '') !== runtime.activeRunId) return false;
    runtime.runStatus = 'error';
    runtime.runtimeErrorCount += 1;
    runtime.lastRuntimeError = {
      message: String(error.message || 'Erro JavaScript'),
      line: error.line || null,
      column: error.column || null,
      at: new Date().toISOString()
    };
    return true;
  }

  function actionableInteraction(detail = {}) {
    const event = String(detail.event || '');
    const tag = String(detail.tag || '').toLowerCase();
    if (event === 'click') return ['button', 'input', 'select', 'textarea', 'a', 'label'].includes(tag);
    return ['input', 'change', 'submit', 'keydown'].includes(event);
  }

  function markInteraction(state, detail = {}, runId = null) {
    const runtime = ensureState(state);
    if (runId && runtime.activeRunId && String(runId) !== runtime.activeRunId) return false;
    if (runtime.runStatus !== 'ready') return false;
    if (!actionableInteraction(detail)) return false;
    const event = String(detail.event || 'interaction');
    runtime.interactionsAfterRun += 1;
    runtime.interactionEvents[event] = Number(runtime.interactionEvents[event] || 0) + 1;
    if (event === 'keydown' && detail.key) {
      const keyName = `keydown:${String(detail.key)}`;
      runtime.interactionEvents[keyName] = Number(runtime.interactionEvents[keyName] || 0) + 1;
    }
    runtime.lastInteractionAt = new Date().toISOString();
    return true;
  }

  function interactionRequirements(exercise) {
    const html = String(exercise?.arquivos?.html || '');
    const js = String(exercise?.arquivos?.js || '');
    const requirements = new Set();

    if (/\bonclick\s*=/i.test(html) || /addEventListener\s*\(\s*["']click["']/i.test(js)) requirements.add('click');
    if (/addEventListener\s*\(\s*["']input["']/i.test(js)) requirements.add('input');
    if (/addEventListener\s*\(\s*["']change["']/i.test(js)) requirements.add('change');
    if (/\bonsubmit\s*=/i.test(html) || /addEventListener\s*\(\s*["']submit["']/i.test(js)) requirements.add('submit');
    if (/addEventListener\s*\(\s*["']keydown["']/i.test(js)) {
      if (/(?:event|evento)\.key\s*={2,3}\s*["']Enter["']/i.test(js)) requirements.add('keydown:Enter');
      else requirements.add('keydown');
    }
    return [...requirements];
  }

  function isInteractiveExercise(exercise) {
    return interactionRequirements(exercise).length > 0 ||
      /<(button|input|select|textarea|form)\b/i.test(String(exercise?.arquivos?.html || ''));
  }

  function missingInteractions(state, exercise) {
    const runtime = ensureState(state);
    const requirements = interactionRequirements(exercise);
    if (!requirements.length && isInteractiveExercise(exercise)) {
      return runtime.interactionsAfterRun > 0 ? [] : ['interação'];
    }
    return requirements.filter(name => Number(runtime.interactionEvents[name] || 0) < 1);
  }

  function validationGate(state, file, exercise) {
    const runtime = ensureState(state);
    const currentHash = projectHash(state, exercise);

    if (!runtime.explicitRunHash || runtime.explicitRunHash !== currentHash || runtime.stale) {
      return {
        ok: false,
        code: 'execution_required',
        message: 'Execute o projeto depois da última alteração antes de validar.'
      };
    }
    if (runtime.runStatus === 'running') {
      return {
        ok: false,
        code: 'execution_running',
        message: 'Aguarde o Preview terminar de carregar antes de validar.'
      };
    }
    if (runtime.runStatus === 'error' || runtime.runtimeErrorCount > 0) {
      const detail = runtime.lastRuntimeError?.message ? ` ${runtime.lastRuntimeError.message}` : '';
      return {
        ok: false,
        code: 'runtime_error',
        message: `A última execução terminou com erro.${detail} Corrija o código e execute novamente.`
      };
    }
    if (runtime.runStatus !== 'ready') {
      return {
        ok: false,
        code: 'execution_not_ready',
        message: 'O Preview ainda não confirmou uma execução válida. Execute novamente.'
      };
    }

    if (file === 'js') {
      const missing = missingInteractions(state, exercise);
      if (missing.length) {
        return {
          ok: false,
          code: 'interaction_required',
          missingInteractions: missing,
          message: `Teste no Preview antes de validar o JavaScript. Ainda falta: ${missing.join(', ')}.`
        };
      }
      if (window.BehaviorScenarios) {
        const behavior = BehaviorScenarios.status(state, exercise);
        if (behavior.configured && behavior.blocking && behavior.missing.length) {
          return {
            ok:false,
            code:'behavior_scenarios_required',
            missingScenarios:behavior.missing,
            message:`Teste todos os cenários obrigatórios antes de validar. Restam ${behavior.missing.length} cenário(s).`
          };
        }
      }
    }
    return { ok: true };
  }

  function appendConsole(state, level, args) {
    const runtime = ensureState(state);
    const item = {
      level: ['log', 'info', 'warn', 'error'].includes(level) ? level : 'log',
      text: Array.isArray(args) ? args.map(value => String(value)).join(' ') : String(args || ''),
      at: new Date().toISOString()
    };
    runtime.console.push(item);
    if (runtime.console.length > 250) runtime.console.splice(0, runtime.console.length - 250);
    return item;
  }

  function clearConsole(state) {
    ensureState(state).console = [];
  }

  function status(state, exercise) {
    const runtime = ensureState(state);
    const hash = projectHash(state, exercise);
    const hashCurrent = Boolean(runtime.explicitRunHash && runtime.explicitRunHash === hash && !runtime.stale);
    const ready = hashCurrent && runtime.runStatus === 'ready' && runtime.runtimeErrorCount === 0;
    let text = 'execução desatualizada';
    if (hashCurrent && runtime.runStatus === 'running') text = 'executando...';
    if (hashCurrent && runtime.runStatus === 'error') text = 'execução com erro';
    if (ready) text = 'execução atualizada';
    return {
      current: ready,
      hashCurrent,
      ready,
      runStatus: runtime.runStatus,
      text,
      interactions: runtime.interactionsAfterRun || 0,
      interactionEvents: { ...runtime.interactionEvents },
      requiredInteractions: interactionRequirements(exercise),
      missingInteractions: missingInteractions(state, exercise),
      ranAt: runtime.explicitRunAt,
      readyAt: runtime.readyAt,
      lastRuntimeError: runtime.lastRuntimeError
    };
  }

  function checkpointState(state, file, exercise) {
    const runtime = ensureState(state);
    const statusData = status(state, exercise);
    const hasCode = Boolean(String(state.answers?.[file] || '').trim());
    const interactionRequired = file === 'js' && isInteractiveExercise(exercise);
    const interactionsOk = !interactionRequired || statusData.missingInteractions.length === 0;
    return [
      { key: 'code', label: 'Código escrito', done: hasCode, detail: hasCode ? 'O arquivo atual possui código.' : 'Digite o código do arquivo atual.' },
      { key: 'run', label: 'Executar projeto', done: statusData.ready, detail: statusData.ready ? 'O Preview confirmou a execução atual.' : statusData.text },
      { key: 'interaction', label: 'Testar interação', done: interactionsOk, neutral: !interactionRequired, detail: interactionRequired ? (interactionsOk ? 'As interações exigidas foram testadas.' : `Falta testar: ${statusData.missingInteractions.join(', ')}.`) : 'Não é obrigatória para este arquivo.' },
      { key: 'validate', label: 'Validar arquivo', done: Boolean(state.done?.[file]), detail: state.done?.[file] ? 'Arquivo validado.' : 'Valide depois de executar e testar.' }
    ];
  }

  return {
    ensureState,
    projectHash,
    markEdited,
    beginRun,
    markExplicitRun,
    markReady,
    markRuntimeError,
    markInteraction,
    interactionRequirements,
    missingInteractions,
    validationGate,
    appendConsole,
    clearConsole,
    status,
    checkpointState,
    isInteractiveExercise
  };
})();
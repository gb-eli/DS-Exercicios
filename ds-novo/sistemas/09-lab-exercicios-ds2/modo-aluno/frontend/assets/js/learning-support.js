(function (global) {
  'use strict';

  const PROJECT = '2ds-frontend-manha';
  const PEPPER = 'apoio-pedagogico-local-v1';
  const FILES = ['html', 'css', 'js'];
  const CRITERIA = Object.freeze({ activeSeconds: 120, attempts: 2, keystrokes: 30, executions: 2, hints: 2 });

  function phaseFor(exercise) {
    const explicit = Number(exercise?.fasePedagogica || exercise?.apoioAutomatico?.fase);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const number = Number(exercise?.numero || 1);
    if (number <= 3) return 1;
    if (number <= 6) return 2;
    if (number <= 9) return 3;
    if (number <= 18) return 4;
    if (number <= 24) return 5;
    return 6;
  }

  function fileMap(factory) {
    return Object.fromEntries(FILES.map(key => [key, factory(key)]));
  }

  function defaultActivity() {
    return { activeSeconds: 0, keystrokes: 0, executions: 0, hints: 0, tutorialReturns: 0, lastInteractionAt: null };
  }

  function defaultLearning(exercise) {
    return {
      schema: 1,
      phase: phaseFor(exercise),
      understood: fileMap(() => []),
      activity: fileMap(() => defaultActivity()),
      autoComplete: fileMap(() => ({ entries: [] })),
      authorizations: [],
      events: []
    };
  }

  function ensureState(state, exercise) {
    const defaults = defaultLearning(exercise);
    const current = state.learning && typeof state.learning === 'object' ? state.learning : {};
    state.learning = {
      ...defaults,
      ...current,
      phase: phaseFor(exercise),
      understood: fileMap(key => Array.isArray(current.understood?.[key]) ? [...new Set(current.understood[key].map(Number).filter(Number.isInteger))] : []),
      activity: fileMap(key => ({ ...defaultActivity(), ...(current.activity?.[key] || {}) })),
      autoComplete: fileMap(key => ({ entries: Array.isArray(current.autoComplete?.[key]?.entries) ? current.autoComplete[key].entries : [] })),
      authorizations: Array.isArray(current.authorizations) ? current.authorizations : [],
      events: Array.isArray(current.events) ? current.events.slice(-250) : []
    };

    // Migration: tutorial parts already visited in older versions count as understood.
    FILES.forEach(key => {
      const count = Math.max(0, Number(state.explained?.[key] || 0));
      for (let index = 0; index < count; index += 1) {
        if (!state.learning.understood[key].includes(index)) state.learning.understood[key].push(index);
      }
    });
    return state.learning;
  }

  function record(state, type, detail = {}) {
    if (!state.learning) return;
    state.learning.events.push({ type, at: new Date().toISOString(), ...detail });
    if (state.learning.events.length > 250) state.learning.events = state.learning.events.slice(-250);
  }

  function activity(state, file) {
    return state.learning.activity[file];
  }

  function noteInteraction(state, file, kind, amount = 1) {
    const item = activity(state, file);
    item.lastInteractionAt = Date.now();
    if (kind === 'typing') item.keystrokes += Math.max(1, Number(amount) || 1);
    if (kind === 'execution') item.executions += 1;
    if (kind === 'hint') item.hints += 1;
    if (kind === 'tutorial') item.tutorialReturns += 1;
    record(state, kind, { file, amount });
  }

  function tickActive(state, file, seconds = 5) {
    const item = activity(state, file);
    const recent = Date.now() - Number(item.lastInteractionAt || 0) <= 30000;
    if (document.visibilityState === 'visible' && recent) item.activeSeconds += seconds;
    return recent;
  }

  function markUnderstood(state, file, stepIndex) {
    const list = state.learning.understood[file];
    if (!list.includes(stepIndex)) list.push(stepIndex);
    record(state, 'parte_compreendida', { file, step: stepIndex });
  }

  function isUnderstood(state, file, stepIndex) {
    return state.learning.understood[file].includes(stepIndex);
  }

  function activeEntries(state, file) {
    return state.learning.autoComplete[file].entries.filter(entry => entry.status === 'active');
  }

  function currentAuthorization(state, username, exerciseNumber, file) {
    const now = Date.now();
    return state.learning.authorizations.find(item =>
      item.status === 'valid' && !item.used && item.username === username && Number(item.exercise) === Number(exerciseNumber) && item.file === file && Number(item.expiresAt) > now
    ) || null;
  }

  function criterionRows(state, file, content) {
    const item = activity(state, file);
    return [
      { key: 'activeSeconds', label: 'Participação ativa', value: item.activeSeconds, target: CRITERIA.activeSeconds, display: `${Math.floor(item.activeSeconds / 60)} min ${item.activeSeconds % 60}s / 2 min` },
      { key: 'attempts', label: 'Tentativas de validação', value: Number(state.attempts?.[file] || 0), target: CRITERIA.attempts, display: `${Number(state.attempts?.[file] || 0)} / ${CRITERIA.attempts}` },
      { key: 'keystrokes', label: 'Digitação no editor', value: item.keystrokes, target: CRITERIA.keystrokes, display: `${item.keystrokes} / ${CRITERIA.keystrokes}` },
      { key: 'executions', label: 'Atualizações manuais do preview', value: item.executions, target: CRITERIA.executions, display: `${item.executions} / ${CRITERIA.executions}` },
      { key: 'hints', label: 'Dicas ou explicações consultadas', value: item.hints, target: CRITERIA.hints, display: `${item.hints} / ${CRITERIA.hints}` },
      { key: 'content', label: 'Código iniciado', value: String(content || '').trim().length ? 1 : 0, target: 1, display: String(content || '').trim().length ? 'sim' : 'ainda não' }
    ];
  }

  function supportStatus({ state, exercise, file, stepIndex, username, content }) {
    ensureState(state, exercise);
    const phase = phaseFor(exercise);
    const understood = isUnderstood(state, file, stepIndex);
    const authorization = currentAuthorization(state, username, exercise.numero, file);
    const rows = criterionRows(state, file, content);
    const criteriaMet = rows.every(row => row.value >= row.target);
    const existing = activeEntries(state, file).some(entry => Number(entry.step) === Number(stepIndex));

    if (existing) return { available: false, phase, understood, authorization, rows, criteriaMet, reason: 'Esta etapa já possui um bloco automático ativo.', code: 'already-used' };
    if (authorization) return { available: true, phase, understood, authorization, rows, criteriaMet, reason: 'Liberação excepcional do professor disponível.', code: 'teacher' };
    if (file === 'js') return { available: false, phase, understood, authorization: null, rows, criteriaMet, reason: 'O JavaScript deve ser digitado pelo aluno olhando a referência completa à esquerda. O preenchimento automático continua bloqueado para preservar a prática de digitação.', code: 'javascript-blocked' };
    if (!understood) return { available: false, phase, understood, authorization: null, rows, criteriaMet, reason: 'Marque “Já entendi esta parte” antes de solicitar preenchimento.', code: 'understanding-required' };
    if (phase <= 3) return { available: true, phase, understood, authorization: null, rows, criteriaMet, reason: 'Apoio controlado disponível nas fases iniciais.', code: 'initial-phase' };
    if (criteriaMet) return { available: true, phase, understood, authorization: null, rows, criteriaMet, reason: 'Apoio liberado após tentativa real registrada.', code: 'attempts' };
    return { available: false, phase, understood, authorization: null, rows, criteriaMet, reason: 'Continue tentando. A liberação considera participação ativa, digitação, execuções e dicas.', code: 'criteria-pending' };
  }

  function stepBlock(exercise, file, stepIndex) {
    const source = String(exercise?.arquivos?.[file] || '').replace(/\r\n?/g, '\n');
    const lines = source.split('\n');
    const step = exercise?.passos?.[file]?.[stepIndex];
    if (!step) return { title: 'Bloco de apoio', text: '', start: 1, end: 1 };
    const start = Math.max(1, Number(step.linhas?.[0] || 1));
    const end = Math.min(lines.length, Math.max(start, Number(step.linhas?.[1] || start)));
    const selected = lines.slice(start - 1, end).join('\n').trimEnd();
    if (file === 'js') {
      const conventional = selected.match(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/);
      if (conventional) {
        return { title: step.titulo || 'Estrutura da função', text: `function ${conventional[1]}(${conventional[2]}) {\n    // Complete a lógica desta etapa.\n}`, start, end };
      }
      const arrow = selected.match(/(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*\{/);
      if (arrow) {
        return { title: step.titulo || 'Estrutura da função', text: `const ${arrow[1]} = ${arrow[2]} => {\n    // Complete a lógica desta etapa.\n};`, start, end };
      }
      return { title: step.titulo || 'Estrutura JavaScript', text: `// Etapa: ${step.titulo || 'JavaScript'}\n// Digite a lógica solicitada pelo tutorial nesta área.`, start, end };
    }
    return { title: step.titulo || 'Bloco de apoio', text: selected, start, end };
  }

  function makeId() {
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `AP-${Date.now().toString(36).toUpperCase()}-${random}`;
  }

  function markers(file, id, title) {
    const safeTitle = String(title || 'etapa').replace(/[\r\n]+/g, ' ').slice(0, 70);
    if (file === 'html') return {
      start: `<!-- Código parcialmente completado pelo sistema: ${id} - ${safeTitle}. -->`,
      end: `<!-- Fim do apoio automático: ${id}. -->`
    };
    if (file === 'css') return {
      start: `/* Código parcialmente completado pelo sistema: ${id} - ${safeTitle}. */`,
      end: `/* Fim do apoio automático: ${id}. */`
    };
    return {
      start: `// Código parcialmente completado pelo sistema mediante autorização registrada: ${id}.`,
      end: `// Fim do apoio automático: ${id}.`
    };
  }

  function wrappedBlock(file, id, title, blockText) {
    const mark = markers(file, id, title);
    const clean = String(blockText || '').trimEnd();
    if (file === 'html' && /^<!doctype\s+html>/i.test(clean)) {
      const lines = clean.split('\n');
      const first = lines.shift();
      return `${first}\n${mark.start}\n${lines.join('\n')}\n${mark.end}`;
    }
    return `${mark.start}\n${clean}\n${mark.end}`;
  }

  function prepareInsertion({ state, exercise, file, stepIndex, username, content, selectionStart, selectionEnd, source }) {
    const block = stepBlock(exercise, file, stepIndex);
    const id = makeId();
    const wrapped = wrappedBlock(file, id, block.title, block.text);
    const current = String(content || '');
    const start = Math.max(0, Number(selectionStart) || 0);
    const end = Math.max(start, Number(selectionEnd) || start);
    const before = current.slice(0, start);
    const after = current.slice(end);
    const prefix = before && !before.endsWith('\n') ? '\n' : '';
    const suffix = after && !after.startsWith('\n') ? '\n' : '';
    const insertedText = `${prefix}${wrapped}${suffix}`;
    const nextContent = before + insertedText + after;
    const authorization = currentAuthorization(state, username, exercise.numero, file);
    const linesInserted = wrapped.split('\n').length;
    const totalLines = Math.max(1, String(exercise.arquivos[file] || '').split('\n').length);
    const entry = {
      id,
      status: 'active',
      exercise: exercise.numero,
      phase: phaseFor(exercise),
      file,
      filename: exercise.nomesArquivos[file],
      step: stepIndex,
      blockTitle: block.title,
      referenceLines: [block.start, block.end],
      linesInserted,
      approximatePercent: Math.min(100, Math.round(linesInserted / totalLines * 100)),
      source: authorization ? 'professor' : source,
      reason: authorization?.reason || (source === 'initial-phase' ? 'fase_inicial' : 'tentativa_prolongada'),
      authorizationId: authorization?.nonce || null,
      activeSecondsBefore: activity(state, file).activeSeconds,
      attemptsBefore: Number(state.attempts?.[file] || 0),
      hintsBefore: activity(state, file).hints,
      executionsBefore: activity(state, file).executions,
      insertedAt: new Date().toISOString(),
      markerStart: markers(file, id, block.title).start,
      markerEnd: markers(file, id, block.title).end,
      blockText: block.text
    };
    state.learning.autoComplete[file].entries.push(entry);
    if (authorization) authorization.used = true;
    record(state, 'autocompletar_aplicado', { file, id, step: stepIndex, source: entry.source, lines: linesInserted });
    return { content: nextContent, entry, cursor: before.length + insertedText.length };
  }

  function undoLatest(state, file, content) {
    const entries = state.learning.autoComplete[file].entries;
    const entry = [...entries].reverse().find(item => item.status === 'active' || item.status === 'marker-missing');
    if (!entry) return { ok: false, message: 'Não existe bloco automático ativo neste arquivo.' };
    const current = String(content || '');
    let start = current.indexOf(entry.markerStart);
    let endMarker = current.indexOf(entry.markerEnd, Math.max(0, start) + entry.markerStart.length);
    let finish;
    if (start >= 0 && endMarker >= 0) {
      finish = endMarker + entry.markerEnd.length;
    } else {
      const blockStart = current.indexOf(String(entry.blockText || ''));
      if (blockStart < 0) {
        entry.status = 'marker-missing';
        entry.inconsistencyAt = new Date().toISOString();
        record(state, 'autocompletar_inconsistente', { file, id: entry.id });
        return { ok: false, message: 'O bloco foi alterado e não pôde ser localizado com segurança. Restaure a marcação ou o trecho antes de desfazer.' };
      }
      start = blockStart;
      finish = blockStart + String(entry.blockText || '').length;
      const remainingStart = current.lastIndexOf(entry.markerStart, blockStart);
      if (remainingStart >= 0 && blockStart - remainingStart < 300) start = remainingStart;
      const remainingEnd = current.indexOf(entry.markerEnd, finish);
      if (remainingEnd >= 0 && remainingEnd - finish < 300) finish = remainingEnd + entry.markerEnd.length;
    }
    if (current[finish] === '\n') finish += 1;
    let next = current.slice(0, start) + current.slice(finish);
    next = next.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n');
    entry.status = 'undone';
    entry.undoneAt = new Date().toISOString();
    record(state, 'autocompletar_desfeito', { file, id: entry.id });
    return { ok: true, content: next, entry };
  }

  function auditMarkers(state, file, content) {
    const current = String(content || '');
    const missing = activeEntries(state, file).filter(entry => !current.includes(entry.markerStart) || !current.includes(entry.markerEnd));
    if (missing.length) {
      missing.forEach(entry => { entry.markerMissingAt = entry.markerMissingAt || new Date().toISOString(); });
      record(state, 'marcacao_apoio_removida', { file, ids: missing.map(item => item.id) });
      return { ok: false, missing };
    }
    return { ok: true, missing: [] };
  }

  function referenceMode(exercise) {
    const explicit = String(exercise?.referenceMode || exercise?.modoReferencia || '').trim().toLowerCase();
    if (['full', 'guided', 'challenge'].includes(explicit)) return explicit;
    const configured = String(global.APP_CONFIG?.studentReferenceMode || 'full').trim().toLowerCase();
    return ['full', 'guided', 'challenge'].includes(configured) ? configured : 'full';
  }

  function safeReference(file, exercise) {
    const mode = referenceMode(exercise);

    // Regra atual: quadro + caderno. O aluno vê o código integral
    // e pratica digitando o mesmo código no editor.
    if (mode === 'full') return String(exercise?.arquivos?.[file] || '');

    const starter = global.Utils?.buildStarterCode?.(file, exercise) || '';
    if (mode === 'challenge') {
      return [
        '// Desafio sem código integral.',
        '// Use o enunciado, os checkpoints, o preview e o Modo Ajuda.'
      ].join('\n');
    }

    if (file === 'js') {
      return [
        '// Referência guiada - sem a lógica final.',
        '// 1. Identifique os elementos necessários.',
        '// 2. Crie a função ou evento solicitado.',
        '// 3. Leia ou transforme os dados.',
        '// 4. Atualize o resultado e teste no preview.'
      ].join('\n');
    }
    return starter;
  }

  function metadata(state, exercise, username) {
    return {
      schema: 1,
      platform: PROJECT,
      version: global.APP_CONFIG?.version || '',
      generatedAt: new Date().toISOString(),
      student: username,
      exercise: exercise.numero,
      phase: phaseFor(exercise),
      used: FILES.some(key => state.learning.autoComplete[key].entries.length > 0),
      files: Object.fromEntries(FILES.map(key => [exercise.nomesArquivos[key], state.learning.autoComplete[key].entries.map(entry => ({
        id: entry.id,
        status: entry.status,
        blockTitle: entry.blockTitle,
        linesInserted: entry.linesInserted,
        approximatePercent: entry.approximatePercent,
        source: entry.source,
        reason: entry.reason,
        insertedAt: entry.insertedAt,
        undoneAt: entry.undoneAt || null,
        inconsistencyAt: entry.inconsistencyAt || null
      }))])),
      activity: state.learning.activity,
      note: 'Metadados locais de apoio pedagógico. Não representam nota nem comprovam autoria integral.'
    };
  }

  function checksum(text) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function b64encode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function b64decode(text) {
    const normalized = text.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
    return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
  }

  function createAuthorization({ username, exercise, file, reason, hours = 24 }) {
    const payload = {
      v: 1,
      project: PROJECT,
      username: String(username || '').trim().toLowerCase(),
      exercise: Number(exercise),
      file,
      reason: String(reason || 'apoio pedagógico').trim().slice(0, 160),
      issuedAt: Date.now(),
      expiresAt: Date.now() + Math.max(1, Number(hours) || 24) * 3600000,
      nonce: makeId()
    };
    const raw = JSON.stringify(payload);
    return `${b64encode(raw)}.${checksum(raw + PEPPER)}`;
  }

  function verifyAuthorization(code, { username, exercise, file }) {
    try {
      const [encoded, signature] = String(code || '').trim().split('.');
      const raw = b64decode(encoded);
      if (checksum(raw + PEPPER) !== signature) return { ok: false, message: 'Código de autorização inválido.' };
      const payload = JSON.parse(raw);
      if (payload.project !== PROJECT) return { ok: false, message: 'A autorização pertence a outra plataforma.' };
      if (payload.username !== String(username || '').trim().toLowerCase()) return { ok: false, message: 'A autorização foi emitida para outro usuário.' };
      if (Number(payload.exercise) !== Number(exercise)) return { ok: false, message: 'A autorização pertence a outro exercício.' };
      if (payload.file !== file) return { ok: false, message: 'A autorização pertence a outro arquivo.' };
      if (Number(payload.expiresAt) <= Date.now()) return { ok: false, message: 'A autorização expirou.' };
      return { ok: true, payload: { ...payload, status: 'valid', used: false } };
    } catch (error) {
      return { ok: false, message: 'Não foi possível interpretar o código de autorização.' };
    }
  }

  function criteriaHtml(status) {
    return status.rows.map(row => `<li class="${row.value >= row.target ? 'met' : ''}"><span>${global.Utils.escapeHtml(row.label)}</span><strong>${global.Utils.escapeHtml(row.display)}</strong></li>`).join('');
  }

  global.LearningSupport = {
    CRITERIA,
    phaseFor,
    ensureState,
    noteInteraction,
    tickActive,
    markUnderstood,
    isUnderstood,
    activeEntries,
    supportStatus,
    stepBlock,
    prepareInsertion,
    undoLatest,
    auditMarkers,
    safeReference,
    metadata,
    createAuthorization,
    verifyAuthorization,
    criteriaHtml,
    record
  };
})(window);

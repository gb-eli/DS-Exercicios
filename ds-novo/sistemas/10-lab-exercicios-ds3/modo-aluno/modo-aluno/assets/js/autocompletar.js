window.AutoCompleteSupport = (() => {
  const VERSION = 1;
  const MARKER_TEXT = 'Código parcialmente completado pelo sistema por meio da opção "Completar esta etapa".';

  function normalizeToken(value, fallback = 'valor') {
    return String(value || fallback)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '') || fallback;
  }

  function projectToken() {
    return normalizeToken(window.APP_CONFIG?.repositorio, '3ds-programacao');
  }

  function authorizationKey() {
    return `ds3_${projectToken()}_autocompletar_autorizacoes_v${VERSION}`;
  }

  function readAuthorizations() {
    try {
      const parsed = JSON.parse(localStorage.getItem(authorizationKey()) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeAuthorizations(items) {
    localStorage.setItem(authorizationKey(), JSON.stringify(items.slice(-300)));
  }

  function listAuthorizations(filters = {}) {
    return readAuthorizations().filter(item => {
      if (filters.exercise != null && Number(item.exercise) !== Number(filters.exercise)) return false;
      if (filters.username && normalizeToken(item.username, '') !== normalizeToken(filters.username, '')) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }

  function createAuthorization({ username, exercise, file, blockId, reason, teacher }) {
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      project: projectToken(),
      username: normalizeToken(username, ''),
      exercise: Number(exercise),
      file: String(file),
      blockId: String(blockId),
      reason: String(reason || 'autorização do professor').trim(),
      teacher: String(teacher || 'Professor').trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      usedAt: null,
      usedBy: null,
      revokedAt: null
    };
    if (!entry.username) throw new Error('Informe o usuário do aluno.');
    const items = readAuthorizations();
    items.push(entry);
    writeAuthorizations(items);
    return entry;
  }

  function revokeAuthorization(id) {
    const items = readAuthorizations();
    const target = items.find(item => item.id === id);
    if (!target) return false;
    target.status = 'revoked';
    target.revokedAt = new Date().toISOString();
    writeAuthorizations(items);
    return true;
  }

  function matchingAuthorization(username, exercise, file, blockId) {
    const normalized = normalizeToken(username, '');
    return readAuthorizations().find(item =>
      item.status === 'active' &&
      item.project === projectToken() &&
      item.username === normalized &&
      Number(item.exercise) === Number(exercise) &&
      item.file === String(file) &&
      item.blockId === String(blockId)
    ) || null;
  }

  function consumeAuthorization(id, username) {
    const items = readAuthorizations();
    const target = items.find(item => item.id === id);
    if (!target || target.status !== 'active') return null;
    target.status = 'used';
    target.usedAt = new Date().toISOString();
    target.usedBy = normalizeToken(username, '');
    writeAuthorizations(items);
    return target;
  }

  function config(exercise) {
    return exercise?.apoioAutomatico || { enabled: false, blocks: {} };
  }

  function blocks(exercise, file) {
    const list = config(exercise).blocks?.[file];
    return Array.isArray(list) ? list : [];
  }

  function markerFor(file) {
    const key = String(file || '').toLowerCase();
    if (key.startsWith('html')) return `<!-- ${MARKER_TEXT} -->`;
    if (key === 'css') return `/* ${MARKER_TEXT} */`;
    if (key === 'py' || key === 'python') return `# ${MARKER_TEXT}`;
    return `// ${MARKER_TEXT}`;
  }

  function hasMarker(code, file) {
    return String(code || '').includes(markerFor(file));
  }

  function addMarker(code, file) {
    const text = String(code || '');
    const marker = markerFor(file);
    if (!text.trim() || text.includes(marker)) return text;
    if (String(file || '').toLowerCase().startsWith('html')) {
      const lines = text.split('\n');
      const doctypeIndex = lines.findIndex(line => /^\s*<!doctype\s+html/i.test(line));
      if (doctypeIndex >= 0) lines.splice(doctypeIndex + 1, 0, marker);
      else lines.unshift(marker);
      return lines.join('\n');
    }
    return `${marker}\n${text}`;
  }

  function insertBlock(code, file, block) {
    const current = String(code || '');
    if (block.mode === 'replace-empty' && current.trim()) {
      return { ok: false, message: 'Este bloco inicial só pode ser usado enquanto o arquivo estiver vazio. Preserve o código que você já escreveu e utilize as dicas progressivas.' };
    }
    let next = block.mode === 'replace-empty'
      ? String(block.content || '')
      : [current.trimEnd(), String(block.content || '').trim()].filter(Boolean).join('\n\n');
    next = addMarker(next, file);
    return { ok: true, code: next, linesInserted: String(block.content || '').split('\n').length };
  }

  function signalDetails(exercise, activity = {}, attempts = 0, code = '') {
    const cfg = config(exercise);
    return [
      { id: 'tempo', label: `Tempo ativo: ${Math.floor((activity.activeSeconds || 0) / 60)} min de ${Math.ceil((cfg.minActiveSeconds || 0) / 60)} min`, met: (activity.activeSeconds || 0) >= (cfg.minActiveSeconds || 0) },
      { id: 'tentativas', label: `Tentativas de validação: ${attempts || 0} de ${cfg.minAttempts || 0}`, met: (attempts || 0) >= (cfg.minAttempts || 0) },
      { id: 'digitacao', label: `Edições no código: ${activity.keystrokes || 0} de ${cfg.minKeystrokes || 0}`, met: (activity.keystrokes || 0) >= (cfg.minKeystrokes || 0) && String(code || '').trim().length >= 20 },
      { id: 'execucoes', label: `Previews atualizados: ${activity.executions || 0} de ${cfg.minExecutions || 0}`, met: (activity.executions || 0) >= (cfg.minExecutions || 0) },
      { id: 'dicas', label: `Dicas consultadas: ${activity.hintsUsed || 0} de ${cfg.minHints || 0}`, met: (activity.hintsUsed || 0) >= (cfg.minHints || 0) }
    ];
  }

  function eligibility({ exercise, file, block, activity, attempts, code, username }) {
    const cfg = config(exercise);
    if (!block) return { available: false, unlocked: false, reason: 'Nenhum bloco de apoio foi configurado para este arquivo.', signals: [] };
    if (String(file).toLowerCase() === 'js') return { available: false, unlocked: false, reason: 'A lógica JavaScript deve ser digitada pelo aluno. Utilize as dicas e exemplos incompletos.', signals: [] };
    const authorization = matchingAuthorization(username, exercise.numero, file, block.id);
    if (authorization) {
      return { available: true, unlocked: true, origin: 'professor', reason: `Autorizado pelo professor: ${authorization.reason}`, authorization, signals: [] };
    }
    if (cfg.initialAccess || Number(exercise.fasePedagogica || 99) <= 3) {
      return { available: true, unlocked: true, origin: 'fase_inicial', reason: 'Disponível nas três primeiras fases para adaptação ao editor e à organização dos arquivos.', signals: [] };
    }
    const signals = signalDetails(exercise, activity, attempts, code);
    const metCount = signals.filter(item => item.met).length;
    const required = cfg.requiredSignals || 3;
    const unlocked = String(code || '').trim().length >= 20 && metCount >= required;
    return {
      available: true,
      unlocked,
      origin: unlocked ? 'tentativa_prolongada' : 'bloqueado',
      reason: unlocked
        ? `Liberado após tentativa real: ${metCount} de ${signals.length} sinais foram atendidos.`
        : `Ainda bloqueado. Continue tentando: ${metCount} de ${required} sinais necessários foram atendidos.`,
      signals
    };
  }

  function approximatePercentage(block, referenceCode) {
    const inserted = String(block?.content || '').split('\n').filter(line => line.trim()).length;
    const total = Math.max(1, String(referenceCode || '').split('\n').filter(line => line.trim()).length);
    return Math.min(100, Math.round(inserted / total * 100));
  }

  return {
    VERSION,
    MARKER_TEXT,
    normalizeToken,
    projectToken,
    authorizationKey,
    listAuthorizations,
    createAuthorization,
    revokeAuthorization,
    matchingAuthorization,
    consumeAuthorization,
    config,
    blocks,
    markerFor,
    hasMarker,
    addMarker,
    insertBlock,
    signalDetails,
    eligibility,
    approximatePercentage
  };
})();

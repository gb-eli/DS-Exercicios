window.Workspace = (() => {
  const MAIN_KEYS = ['html', 'css', 'js'];
  const RESERVED = new Set(['.', '..']);

  function normalizeSlashes(value = '') {
    return String(value || '').replace(/\\+/g, '/').replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  }

  function safeSegment(value, fallback = '') {
    const text = String(value || '').trim();
    if (!text || RESERVED.has(text)) return fallback;
    if (/[\x00-\x1f<>:"|?*\/\\]/.test(text)) return fallback;
    return text;
  }

  function safeRootName(value, fallback = 'projeto') {
    const text = String(value || '').trim().replace(/\s+/g, '-');
    if (!text || RESERVED.has(text)) return fallback;
    const cleaned = text.replace(/[^A-Za-z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    return cleaned || fallback;
  }

  function normalizePath(value = '') {
    const raw = normalizeSlashes(value);
    if (!raw) return '';
    const parts = [];
    for (const part of raw.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') {
        if (parts.length) parts.pop();
        continue;
      }
      const safe = safeSegment(part);
      if (!safe) return null;
      parts.push(safe);
    }
    return parts.join('/');
  }

  function dirname(path = '') {
    const normalized = normalizePath(path) || '';
    const parts = normalized.split('/').filter(Boolean);
    parts.pop();
    return parts.join('/');
  }

  function basename(path = '') {
    const normalized = normalizePath(path) || '';
    return normalized.split('/').filter(Boolean).pop() || '';
  }

  function join(...parts) {
    return normalizePath(parts.filter(Boolean).join('/')) || '';
  }

  function extension(path = '') {
    const name = basename(path);
    const index = name.lastIndexOf('.');
    return index > 0 ? name.slice(index + 1).toLowerCase() : '';
  }

  function languageFor(path = '') {
    const ext = extension(path);
    const map = {
      html: 'html', htm: 'html', css: 'css', js: 'js', mjs: 'js',
      json: 'json', md: 'markdown', txt: 'text', csv: 'text',
      py: 'python', java: 'java', c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp',
      cs: 'csharp', kt: 'kotlin', php: 'php', sql: 'sql', xml: 'xml'
    };
    return map[ext] || 'text';
  }

  function addParentFolders(state, path) {
    let parent = dirname(path);
    const additions = [];
    while (parent) {
      additions.push(parent);
      parent = dirname(parent);
    }
    state.workspace.folders = [...new Set([...(state.workspace.folders || []), ...additions])].sort();
  }

  function ensureState(state, exercise) {
    const defaults = {
      version: 2,
      rootName: safeRootName(exercise?.pasta, `exercicio-${String(exercise?.numero || 1).padStart(2, '0')}`),
      mainNames: {
        html: exercise?.nomesArquivos?.html || 'index.html',
        css: exercise?.nomesArquivos?.css || 'estilo.css',
        js: exercise?.nomesArquivos?.js || 'script.js'
      },
      folders: [],
      extras: {},
      selectedPath: exercise?.nomesArquivos?.html || 'index.html',
      cwd: '',
      history: []
    };
    if (!state.workspace || typeof state.workspace !== 'object') state.workspace = structuredClone(defaults);
    state.workspace.version = 2;
    state.workspace.rootName = safeRootName(state.workspace.rootName, defaults.rootName);
    state.workspace.mainNames = { ...defaults.mainNames, ...(state.workspace.mainNames || {}) };
    MAIN_KEYS.forEach(key => {
      const fallback = normalizePath(defaults.mainNames[key]) || defaults.mainNames[key];
      const candidate = normalizePath(state.workspace.mainNames[key]);
      // O HTML principal permanece na raiz para conservar uma entrada previsível no GitHub Pages.
      state.workspace.mainNames[key] = key === 'html'
        ? safeSegment(basename(candidate || fallback), basename(fallback))
        : (candidate || fallback);
    });
    state.workspace.folders = [...new Set((state.workspace.folders || []).map(normalizePath).filter(Boolean))].sort();
    state.workspace.extras = state.workspace.extras && typeof state.workspace.extras === 'object' ? state.workspace.extras : {};
    Object.entries(state.workspace.extras).forEach(([path, data]) => {
      const normalized = normalizePath(path);
      if (!normalized || MAIN_KEYS.some(key => state.workspace.mainNames[key] === normalized)) {
        delete state.workspace.extras[path];
        return;
      }
      if (normalized !== path) {
        state.workspace.extras[normalized] = data;
        delete state.workspace.extras[path];
      }
      const entry = state.workspace.extras[normalized];
      if (typeof entry === 'string') state.workspace.extras[normalized] = { content: entry, language: languageFor(normalized) };
      else {
        entry.content = String(entry.content || '');
        entry.language = entry.language || languageFor(normalized);
      }
      addParentFolders(state, normalized);
    });
    state.workspace.cwd = normalizePath(state.workspace.cwd) || '';
    state.workspace.selectedPath = normalizePath(state.workspace.selectedPath) || state.workspace.mainNames.html;
    state.workspace.history = Array.isArray(state.workspace.history) ? state.workspace.history.slice(-120) : [];
    return state.workspace;
  }

  function log(state, action, detail = {}) {
    state.workspace.history.push({ action, detail, at: new Date().toISOString() });
    if (state.workspace.history.length > 120) state.workspace.history.splice(0, state.workspace.history.length - 120);
  }

  function rootName(state, exercise) {
    ensureState(state, exercise);
    return state.workspace.rootName;
  }

  function mainPath(state, key, exercise) {
    ensureState(state, exercise);
    return state.workspace.mainNames[key] || exercise?.nomesArquivos?.[key] || `${key}.txt`;
  }

  function keyForPath(state, path, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    return MAIN_KEYS.find(key => state.workspace.mainNames[key] === normalized) || null;
  }

  function exists(state, path, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    if (normalized === '') return true;
    if (state.workspace.folders.includes(normalized)) return true;
    if (keyForPath(state, normalized, exercise)) return true;
    return Object.prototype.hasOwnProperty.call(state.workspace.extras, normalized);
  }

  function isFolder(state, path, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    return normalized === '' || state.workspace.folders.includes(normalized);
  }

  function allFiles(state, exercise) {
    ensureState(state, exercise);
    const main = MAIN_KEYS.map(key => ({
      path: state.workspace.mainNames[key],
      key,
      main: true,
      language: key,
      content: String(state.answers?.[key] || '')
    }));
    const extras = Object.entries(state.workspace.extras).map(([path, data]) => ({
      path,
      key: null,
      main: false,
      language: data.language || languageFor(path),
      content: String(data.content || '')
    }));
    return [...main, ...extras].sort((a, b) => a.path.localeCompare(b.path, 'pt-BR'));
  }

  function allFolders(state, exercise) {
    ensureState(state, exercise);
    const folders = new Set(state.workspace.folders || []);
    allFiles(state, exercise).forEach(entry => {
      let parent = dirname(entry.path);
      while (parent) {
        folders.add(parent);
        parent = dirname(parent);
      }
    });
    return [...folders].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  function getFile(state, path, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    const key = keyForPath(state, normalized, exercise);
    if (key) return { path: normalized, key, main: true, language: key, content: String(state.answers?.[key] || '') };
    const extra = state.workspace.extras[normalized];
    if (!extra) return null;
    return { path: normalized, key: null, main: false, language: extra.language || languageFor(normalized), content: String(extra.content || '') };
  }

  function setFileContent(state, path, content, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    const key = keyForPath(state, normalized, exercise);
    if (key) {
      state.answers[key] = String(content || '');
      return { ok: true, key, main: true };
    }
    if (!state.workspace.extras[normalized]) return { ok: false, message: 'Arquivo não encontrado.' };
    state.workspace.extras[normalized].content = String(content || '');
    state.workspace.extras[normalized].language = state.workspace.extras[normalized].language || languageFor(normalized);
    log(state, 'editar_arquivo_extra', { path: normalized });
    return { ok: true, main: false };
  }

  function usedPath(state, path, exercise, ignorePath = null) {
    const normalized = normalizePath(path);
    if (!normalized) return true;
    if (ignorePath && normalized === normalizePath(ignorePath)) return false;
    return allFiles(state, exercise).some(entry => entry.path === normalized) || allFolders(state, exercise).includes(normalized);
  }

  function renameRoot(state, newName, exercise) {
    ensureState(state, exercise);
    const safe = safeRootName(newName, '');
    if (!safe) return { ok: false, message: 'Use letras, números, hífen, ponto ou sublinhado no nome da pasta.' };
    const old = state.workspace.rootName;
    state.workspace.rootName = safe;
    log(state, 'renomear_pasta_raiz', { old, new: safe });
    return { ok: true, old, new: safe };
  }

  function replaceReference(html, oldName, newName) {
    if (!html || !oldName || oldName === newName) return { content: String(html || ''), changed: false };
    const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let changed = false;
    const pattern = new RegExp(`(["'])${escaped}\\1`, 'g');
    const content = String(html).replace(pattern, (match, quote) => {
      changed = true;
      return `${quote}${newName}${quote}`;
    });
    return { content, changed };
  }

  function renameMain(state, key, newName, exercise) {
    ensureState(state, exercise);
    if (!MAIN_KEYS.includes(key)) return { ok: false, message: 'Arquivo principal inválido.' };
    const normalized = normalizePath(newName);
    if (!normalized) return { ok: false, message: 'Informe um caminho de arquivo válido.' };
    if (key === 'html' && dirname(normalized)) {
      return { ok: false, message: 'O HTML principal permanece na raiz para que o projeto continue abrindo diretamente no GitHub Pages. Crie outros HTMLs em subpastas como arquivos extras.' };
    }
    const target = key === 'html' ? safeSegment(basename(normalized), '') : normalized;
    if (!target) return { ok: false, message: 'Nome de arquivo inválido.' };
    const old = state.workspace.mainNames[key];
    if (old === target) return { ok: true, old, new: target, referenceChanged: false };
    if (usedPath(state, target, exercise, old)) return { ok: false, message: 'Já existe um arquivo ou pasta com esse nome.' };
    state.workspace.mainNames[key] = target;
    addParentFolders(state, target);
    if (state.workspace.selectedPath === old) state.workspace.selectedPath = target;
    let referenceChanged = false;
    if (key === 'css' || key === 'js') {
      const updated = replaceReference(state.answers?.html || '', old, target);
      if (updated.changed) {
        state.answers.html = updated.content;
        referenceChanged = true;
      }
    }
    log(state, 'renomear_arquivo_principal', { key, old, new: target, referenceChanged });
    return { ok: true, old, new: target, referenceChanged };
  }

  function createFolder(state, path, exercise) {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    if (!normalized) return { ok: false, message: 'Informe o nome da pasta.' };
    if (usedPath(state, normalized, exercise)) return { ok: false, message: 'Esse caminho já existe.' };
    state.workspace.folders.push(normalized);
    addParentFolders(state, normalized);
    state.workspace.folders = [...new Set(state.workspace.folders)].sort();
    log(state, 'criar_pasta', { path: normalized });
    return { ok: true, path: normalized };
  }

  function createFile(state, path, exercise, content = '') {
    ensureState(state, exercise);
    const normalized = normalizePath(path);
    if (!normalized || !basename(normalized)) return { ok: false, message: 'Informe um nome de arquivo válido.' };
    if (usedPath(state, normalized, exercise)) return { ok: false, message: 'Esse caminho já existe.' };
    addParentFolders(state, normalized);
    state.workspace.extras[normalized] = { content: String(content || ''), language: languageFor(normalized) };
    state.workspace.selectedPath = normalized;
    log(state, 'criar_arquivo', { path: normalized });
    return { ok: true, path: normalized };
  }

  function renamePath(state, oldPath, newPath, exercise) {
    ensureState(state, exercise);
    const oldNormalized = normalizePath(oldPath);
    const newNormalized = normalizePath(newPath);
    if (!oldNormalized || !newNormalized) return { ok: false, message: 'Caminho inválido.' };
    const mainKey = keyForPath(state, oldNormalized, exercise);
    if (mainKey) return renameMain(state, mainKey, newNormalized, exercise);
    if (usedPath(state, newNormalized, exercise, oldNormalized)) return { ok: false, message: 'O destino já existe.' };

    if (state.workspace.extras[oldNormalized]) {
      state.workspace.extras[newNormalized] = state.workspace.extras[oldNormalized];
      delete state.workspace.extras[oldNormalized];
      addParentFolders(state, newNormalized);
      if (state.workspace.selectedPath === oldNormalized) state.workspace.selectedPath = newNormalized;
      log(state, 'renomear_arquivo_extra', { old: oldNormalized, new: newNormalized });
      return { ok: true, old: oldNormalized, new: newNormalized };
    }

    if (state.workspace.folders.includes(oldNormalized)) {
      const affectedFiles = Object.keys(state.workspace.extras).filter(path => path.startsWith(`${oldNormalized}/`));
      const affectedFolders = state.workspace.folders.filter(path => path === oldNormalized || path.startsWith(`${oldNormalized}/`));
      const affectedMain = MAIN_KEYS.filter(key => key !== 'html' && state.workspace.mainNames[key].startsWith(`${oldNormalized}/`));
      affectedFiles.forEach(path => {
        const suffix = path.slice(oldNormalized.length).replace(/^\//, '');
        const target = join(newNormalized, suffix);
        state.workspace.extras[target] = state.workspace.extras[path];
        delete state.workspace.extras[path];
      });
      affectedMain.forEach(key => {
        const oldMain = state.workspace.mainNames[key];
        const suffix = oldMain.slice(oldNormalized.length).replace(/^\//, '');
        const target = join(newNormalized, suffix);
        state.workspace.mainNames[key] = target;
        const updated = replaceReference(state.answers?.html || '', oldMain, target);
        if (updated.changed) state.answers.html = updated.content;
        if (state.workspace.selectedPath === oldMain) state.workspace.selectedPath = target;
      });
      state.workspace.folders = state.workspace.folders
        .filter(path => !affectedFolders.includes(path))
        .concat(affectedFolders.map(path => {
          const suffix = path.slice(oldNormalized.length).replace(/^\//, '');
          return join(newNormalized, suffix);
        }));
      state.workspace.folders = [...new Set(state.workspace.folders)].sort();
      if (state.workspace.cwd === oldNormalized || state.workspace.cwd.startsWith(`${oldNormalized}/`)) {
        const suffix = state.workspace.cwd.slice(oldNormalized.length).replace(/^\//, '');
        state.workspace.cwd = join(newNormalized, suffix);
      }
      log(state, 'renomear_pasta', { old: oldNormalized, new: newNormalized, mainFilesMoved: affectedMain });
      return { ok: true, old: oldNormalized, new: newNormalized };
    }
    return { ok: false, message: 'Arquivo ou pasta não encontrado.' };
  }

  function treeLines(state, exercise) {
    ensureState(state, exercise);
    const files = allFiles(state, exercise);
    const folders = allFolders(state, exercise);
    const root = state.workspace.rootName;
    const lines = [root + '/'];
    const items = [
      ...folders.map(path => ({ path, type: 'folder' })),
      ...files.map(entry => ({ path: entry.path, type: 'file' }))
    ].sort((a, b) => a.path.localeCompare(b.path, 'pt-BR'));
    items.forEach(item => {
      const depth = item.path.split('/').length;
      const indent = '  '.repeat(depth);
      lines.push(`${indent}- ${basename(item.path)}${item.type === 'folder' ? '/' : ''}`);
    });
    return lines;
  }

  function resolveFromCwd(state, arg, exercise) {
    ensureState(state, exercise);
    const raw = String(arg || '').trim().replace(/^["']|["']$/g, '');
    if (!raw || raw === '.' || raw === '\\') return state.workspace.cwd;
    if (raw === '..') return dirname(state.workspace.cwd);
    if (/^[\\/]/.test(raw)) return normalizePath(raw);
    return join(state.workspace.cwd, raw);
  }

  function promptPath(state, exercise) {
    ensureState(state, exercise);
    const suffix = state.workspace.cwd ? `\\${state.workspace.cwd.replace(/\//g, '\\')}` : '';
    return `PS C:\\Projetos\\${state.workspace.rootName}${suffix}>`;
  }

  function shell(state, exercise, commandLine) {
    ensureState(state, exercise);
    const input = String(commandLine || '').trim();
    if (!input) return { ok: true, lines: [], mutated: false };
    const parts = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const command = String(parts.shift() || '').toLowerCase();
    const args = parts.map(value => value.replace(/^["']|["']$/g, ''));
    const out = [];
    let mutated = false;
    let action = null;
    const notFound = path => ({ ok: false, lines: [`Caminho não encontrado: ${path}`], mutated: false });

    if (['help', '?'].includes(command)) {
      out.push(
        'Comandos do projeto virtual:',
        'pwd | ls | dir | tree',
        'cd <pasta> | mkdir <pasta> | touch <arquivo>',
        'ren <origem> <destino> | rename <origem> <destino>',
        'cat <arquivo> | type <arquivo>',
        'code <arquivo> | open <arquivo>',
        'download <arquivo>',
        'preview | start | run | serve',
        'clear | cls',
        '',
        'Os comandos alteram somente o projeto virtual desta atividade. Nenhum comando é executado no computador real.'
      );
    } else if (command === 'pwd') {
      out.push(`C:\\Projetos\\${state.workspace.rootName}${state.workspace.cwd ? '\\' + state.workspace.cwd.replace(/\//g, '\\') : ''}`);
    } else if (['ls', 'dir'].includes(command)) {
      const cwd = state.workspace.cwd;
      const prefix = cwd ? `${cwd}/` : '';
      const children = new Map();
      allFolders(state, exercise).forEach(path => {
        if (!path.startsWith(prefix)) return;
        const rest = path.slice(prefix.length);
        if (!rest || rest.includes('/')) return;
        children.set(rest, 'pasta');
      });
      allFiles(state, exercise).forEach(entry => {
        if (!entry.path.startsWith(prefix)) return;
        const rest = entry.path.slice(prefix.length);
        if (!rest || rest.includes('/')) return;
        children.set(rest, 'arquivo');
      });
      if (!children.size) out.push('(pasta vazia)');
      else [...children.entries()].sort().forEach(([name, type]) => out.push(`${type === 'pasta' ? '<DIR>' : '     '}  ${name}`));
    } else if (command === 'tree') {
      out.push(...treeLines(state, exercise));
    } else if (command === 'cd') {
      const target = resolveFromCwd(state, args[0] || '', exercise);
      if (!isFolder(state, target, exercise)) return notFound(args[0] || '');
      state.workspace.cwd = target || '';
      action = { type: 'cwd' };
    } else if (['mkdir', 'md'].includes(command)) {
      const target = resolveFromCwd(state, args.join(' '), exercise);
      const result = createFolder(state, target, exercise);
      if (!result.ok) return { ok: false, lines: [result.message], mutated: false };
      out.push(`Pasta criada: ${result.path}`);
      mutated = true;
    } else if (['touch', 'new-item', 'ni'].includes(command)) {
      const target = resolveFromCwd(state, args.join(' '), exercise);
      const result = createFile(state, target, exercise);
      if (!result.ok) return { ok: false, lines: [result.message], mutated: false };
      out.push(`Arquivo criado: ${result.path}`);
      mutated = true;
    } else if (['ren', 'rename', 'mv', 'move'].includes(command)) {
      if (args.length < 2) return { ok: false, lines: ['Uso: ren <origem> <destino>'], mutated: false };
      const oldPath = resolveFromCwd(state, args[0], exercise);
      let newPath;
      if (oldPath && keyForPath(state, oldPath, exercise)) {
        newPath = args[1].includes('/') || args[1].includes('\\')
          ? resolveFromCwd(state, args[1], exercise)
          : join(dirname(oldPath), args[1]);
      } else {
        newPath = args[1].includes('/') || args[1].includes('\\')
          ? resolveFromCwd(state, args[1], exercise)
          : join(dirname(oldPath), args[1]);
      }
      const result = renamePath(state, oldPath, newPath, exercise);
      if (!result.ok) return { ok: false, lines: [result.message], mutated: false };
      out.push(`Renomeado: ${result.old || oldPath} -> ${result.new || newPath}`);
      if (result.referenceChanged) out.push('A referência correspondente no HTML também foi atualizada para manter o projeto funcionando.');
      mutated = true;
    } else if (['cat', 'type'].includes(command)) {
      const target = resolveFromCwd(state, args.join(' '), exercise);
      const entry = getFile(state, target, exercise);
      if (!entry) return notFound(args.join(' '));
      out.push(...String(entry.content || '').split('\n'));
    } else if (['code', 'open'].includes(command)) {
      const target = resolveFromCwd(state, args.join(' '), exercise);
      const entry = getFile(state, target, exercise);
      if (!entry) return notFound(args.join(' '));
      action = { type: 'edit', path: target };
      out.push(`Abrindo ${target} no editor.`);
    } else if (command === 'download') {
      const target = resolveFromCwd(state, args.join(' '), exercise);
      const entry = getFile(state, target, exercise);
      if (!entry) return notFound(args.join(' '));
      action = { type: 'download', path: target };
      out.push(`Preparando ${target} para download.`);
    } else if (['preview', 'start', 'run', 'serve'].includes(command)) {
      action = { type: 'preview' };
      out.push('Executando o projeto Front-End no navegador e abrindo o preview atual.');
    } else if (['python', 'python3', 'py', 'java', 'javac', 'gcc', 'g++', 'dotnet', 'php', 'kotlinc', 'node', 'npm'].includes(command)) {
      out.push(
        `O runtime “${command}” não faz parte desta plataforma de Programação Front-End.`,
        'Este terminal gerencia o projeto virtual; ele não simula compiladores ou interpretadores ausentes.',
        'HTML, CSS e JavaScript desta disciplina são executados de verdade pelo navegador com run ou preview.'
      );
      return { ok: false, lines: out, mutated: false, unsupportedRuntime: command };
    } else if (['clear', 'cls'].includes(command)) {
      action = { type: 'clear' };
    } else {
      out.push(`Comando não reconhecido no ambiente virtual: ${command}`, 'Digite help para ver os comandos disponíveis.');
      return { ok: false, lines: out, mutated: false };
    }

    if (mutated) log(state, 'terminal_workspace', { command: input });
    return { ok: true, lines: out, mutated, action };
  }

  function exportEntries(state, exercise) {
    ensureState(state, exercise);
    return allFiles(state, exercise).map(entry => ({ ...entry }));
  }

  return {
    MAIN_KEYS,
    ensureState,
    rootName,
    mainPath,
    keyForPath,
    allFiles,
    allFolders,
    getFile,
    setFileContent,
    createFolder,
    createFile,
    renameRoot,
    renameMain,
    renamePath,
    treeLines,
    shell,
    promptPath,
    exportEntries,
    normalizePath,
    dirname,
    basename,
    languageFor
  };
})();
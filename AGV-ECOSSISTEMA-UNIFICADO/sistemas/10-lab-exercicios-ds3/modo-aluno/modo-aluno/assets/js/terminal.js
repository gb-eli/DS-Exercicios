window.VSTerminal = (() => {
  let panel, output, input, promptLabel, stateLabel;
  let api = {};
  let collapsed = false;
  let staleNotified = false;
  const history = [];
  let historyIndex = 0;

  const esc = value => String(value ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  function line(text = '', kind = 'out') {
    if (!output) return;
    const row = document.createElement('div');
    row.className = `terminal-line terminal-${kind}`;
    row.textContent = String(text);
    output.append(row);
    output.scrollTop = output.scrollHeight;
  }

  function rich(parts = []) {
    if (!output) return;
    const row = document.createElement('div'); row.className = 'terminal-line';
    parts.forEach(part => { const span = document.createElement('span'); span.className = `terminal-${part.kind || 'out'}`; span.textContent = part.text; row.append(span); });
    output.append(row); output.scrollTop = output.scrollHeight;
  }

  function setState(label, kind = 'ready') {
    if (!stateLabel) return;
    stateLabel.textContent = label; stateLabel.dataset.state = kind;
  }

  function prompt() {
    const workspace = api.getWorkspace?.() || { rootName: 'projeto', cwd: '' };
    const cwd = [workspace.rootName, workspace.cwd].filter(Boolean).join('\\');
    if (promptLabel) promptLabel.textContent = `PS C:\\Projetos\\${cwd}>`;
  }

  function syncToggleLabels() { document.querySelectorAll('#toggleTerminal,#terminalCollapse').forEach(button => button.textContent = collapsed ? 'Abrir terminal' : 'Recolher terminal'); }
  function open() { if (!panel) return; collapsed = false; panel.classList.remove('collapsed'); panel.hidden = false; syncToggleLabels(); prompt(); input?.focus(); }
  function close() { if (!panel) return; collapsed = true; panel.classList.add('collapsed'); syncToggleLabels(); }
  function toggle() { collapsed ? open() : close(); }
  function clear() { if (output) output.innerHTML = ''; }

  function tokenize(command) {
    const out = []; const re = /"([^"]*)"|'([^']*)'|(\S+)/g; let m;
    while ((m = re.exec(command))) out.push(m[1] ?? m[2] ?? m[3]);
    return out;
  }

  function executeCommand(raw) {
    const command = String(raw || '').trim();
    if (!command) return;
    history.push(command); historyIndex = history.length;
    rich([{kind:'prompt',text:`${promptLabel?.textContent || '>'} `},{kind:'command',text:command}]);
    const [cmdRaw, ...args] = tokenize(command);
    const cmd = String(cmdRaw || '').toLowerCase();
    const ws = api.getWorkspace?.() || {};
    if (['clear','cls'].includes(cmd)) { clear(); return; }
    if (['help','ajuda'].includes(cmd)) {
      line('Comandos: run, dir/ls, tree, pwd, type/cat <arquivo>, mkdir <pasta>, ren/rename <arquivo> <novo>, move <arquivo> <caminho>, cd <pasta>, clear/cls, help.', 'info');
      return;
    }
    if (cmd === 'pwd') { line(`C:\\Projetos\\${[ws.rootName, ws.cwd].filter(Boolean).join('\\')}`); return; }
    if (['dir','ls'].includes(cmd)) { (api.listWorkspace?.() || []).forEach(item => line(item)); return; }
    if (cmd === 'tree') { (api.treeWorkspace?.() || []).forEach(item => line(item)); return; }
    if (['type','cat'].includes(cmd)) {
      const content = api.readFile?.(args.join(' '));
      if (content == null) line('Arquivo não encontrado.', 'error'); else String(content).split('\n').forEach(row => line(row, 'code'));
      return;
    }
    if (cmd === 'mkdir') { const result = api.mkdir?.(args.join(' ')); line(result?.message || 'Informe o nome da pasta.', result?.ok ? 'success' : 'error'); prompt(); return; }
    if (['ren','rename'].includes(cmd)) { const result = api.rename?.(args[0], args.slice(1).join(' ')); line(result?.message || 'Uso: ren arquivo novo-nome', result?.ok ? 'success' : 'error'); prompt(); return; }
    if (['move','mv'].includes(cmd)) { const result = api.rename?.(args[0], args.slice(1).join(' ')); line(result?.message || 'Uso: move arquivo pasta/arquivo', result?.ok ? 'success' : 'error'); prompt(); return; }
    if (cmd === 'cd') { const result = api.cd?.(args.join(' ')); line(result?.message || '', result?.ok ? 'success' : 'error'); prompt(); return; }
    if (['run','executar','start'].includes(cmd)) { api.run?.(); return; }
    line(`'${cmdRaw}' não é reconhecido pelo terminal virtual desta atividade. Digite help.`, 'error');
  }

  function onInputKeydown(event) {
    if (event.key === 'Enter') { event.preventDefault(); const value = input.value; input.value = ''; executeCommand(value); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); if (history.length) { historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ''; input.setSelectionRange(input.value.length,input.value.length); } }
    else if (event.key === 'ArrowDown') { event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ''; }
  }

  function init(options = {}) {
    api = options;
    panel = document.getElementById('terminalPanel'); output = document.getElementById('terminalOutput'); input = document.getElementById('terminalInput'); promptLabel = document.getElementById('terminalPrompt'); stateLabel = document.getElementById('terminalState');
    collapsed = panel?.classList.contains('collapsed') ?? false;
    document.getElementById('terminalClear')?.addEventListener('click', clear);
    document.getElementById('terminalRun')?.addEventListener('click', () => api.run?.());
    input?.addEventListener('keydown', onInputKeydown);
    clear(); line('Terminal integrado pronto. Digite help para ver os comandos.', 'info'); prompt(); setState('Pronto para executar'); syncToggleLabels();
    return Boolean(panel);
  }

  function startExecution({ command, fileName, executionId } = {}) {
    staleNotified = false;
    open();
    setState('Executando...', 'running');
    const cmd = command || `start ${fileName || 'index.html'}`;
    rich([{kind:'prompt',text:`${promptLabel?.textContent || '>'} `},{kind:'command',text:cmd}]);
    if (executionId) line(`Execução: ${executionId}`, 'muted');
  }
  function ready(message = 'Código executado sem erros.') { staleNotified = false; line(message, 'success'); line('Processo finalizado com código 0.', 'success'); setState('Execução concluída', 'success'); }
  function error(message) { staleNotified = false; line(message || 'Erro de execução.', 'error'); line('Processo finalizado com código 1.', 'error'); setState('Erro de execução', 'error'); }
  function consoleMessage(level, args) { line((args || []).map(value => typeof value === 'string' ? value : JSON.stringify(value)).join(' '), level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'console'); }
  function markStale() { setState('Saída desatualizada', 'warning'); if (!staleNotified) { line('O código foi alterado após a última execução. Execute novamente para atualizar o resultado.', 'warning'); staleNotified = true; } }
  function focus() { open(); input?.focus(); }

  return { init, line, clear, open, close, toggle, startExecution, ready, error, consoleMessage, markStale, setState, prompt, focus, executeCommand };
})();

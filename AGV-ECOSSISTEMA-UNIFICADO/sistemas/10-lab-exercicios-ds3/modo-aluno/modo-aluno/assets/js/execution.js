(function (global) {
  'use strict';

  const SCHEMA_VERSION = 1;

  function defaultFileState() {
    return {
      status: 'never',
      executionId: null,
      codeHash: null,
      startedAt: null,
      finishedAt: null,
      error: null,
      interactions: [],
      ready: false,
      stale: true,
      validatedAt: null,
      validatedHash: null,
      validatedExecutionId: null
    };
  }

  function defaultCompletionState() {
    return {
      confirmationId: null,
      confirmedAt: null,
      evidence: null
    };
  }

  function fastHash(text) {
    let hash = 2166136261;
    const value = String(text ?? '');
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function sha256Fallback(input) {
    const ascii = unescape(encodeURIComponent(String(input ?? '')));
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const maxWord = Math.pow(2, 32);
    const words = [];
    const hash = [];
    const k = [];
    const isComposite = {};
    let primeCounter = 0;
    for (let candidate = 2; primeCounter < 64; candidate += 1) {
      if (isComposite[candidate]) continue;
      for (let multiple = candidate * candidate; multiple < 313; multiple += candidate) isComposite[multiple] = true;
      hash[primeCounter] = (Math.pow(candidate, .5) * maxWord) | 0;
      k[primeCounter] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter += 1;
    }
    let message = ascii + '\x80';
    while (message.length % 64 !== 56) message += '\x00';
    for (let index = 0; index < message.length; index += 1) {
      const code = message.charCodeAt(index);
      words[index >> 2] |= code << ((3 - index) % 4) * 8;
    }
    const bitLength = ascii.length * 8;
    words.push((bitLength / maxWord) | 0);
    words.push(bitLength | 0);
    for (let block = 0; block < words.length; block += 16) {
      const w = words.slice(block, block + 16);
      const oldHash = hash.slice(0);
      for (let round = 0; round < 64; round += 1) {
        const w15 = w[round - 15];
        const w2 = w[round - 2];
        const a = hash[0];
        const e = hash[4];
        const temp1 = (hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[round]
          + (w[round] = round < 16 ? w[round] : ((w[round - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[round - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0))) | 0;
        const temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))) | 0;
        hash.unshift((temp1 + temp2) | 0);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }
      for (let index = 0; index < 8; index += 1) hash[index] = (hash[index] + oldHash[index]) | 0;
    }
    let result = '';
    for (let index = 0; index < 8; index += 1) {
      for (let byte = 3; byte >= 0; byte -= 1) result += ((hash[index] >> (byte * 8)) & 255).toString(16).padStart(2, '0');
    }
    return result;
  }

  async function sha256(text) {
    const value = String(text ?? '');
    try {
      if (global.crypto?.subtle && global.TextEncoder) {
        const bytes = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
      }
    } catch (error) {
      // A implementação local abaixo mantém SHA-256 também fora de HTTPS.
    }
    return sha256Fallback(value);
  }

  function executionId(exerciseNumber) {
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `3DS-EX${String(exerciseNumber).padStart(2, '0')}-${stamp}-${suffix}`;
  }

  function evidenceId(exerciseNumber) {
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `3DS-EX${String(exerciseNumber).padStart(2, '0')}-${stamp}-${suffix}`;
  }

  function requirements(exercise, file) {
    const number = Number(exercise?.numero || 0);
    const req = [{ id: 'preview-ready', label: 'Preview carregado sem erro', event: 'ready' }];
    const primary = (exercise?.ordemArquivosAluno || exercise?.ordemArquivos || Object.keys(exercise?.arquivos || {}))[0];
    if (file !== primary && !String(file).toLowerCase().startsWith('html')) return req;

    if (number === 2) {
      req.push(
        { id: 'form-input', label: 'Preencher pelo menos um campo do formulário', event: 'input', selector: 'input, select, textarea' },
        { id: 'form-submit', label: 'Testar o envio do formulário com os campos válidos', event: 'submit', selector: 'form' }
      );
    } else if (number === 3) {
      req.push({ id: 'table-interaction', label: 'Interagir com uma linha ou região da tabela', event: 'click', selector: 'tbody tr, table, [role="region"]' });
    } else if (number === 4) {
      req.push({ id: 'navigation-test', label: 'Testar um link entre as páginas do projeto', event: 'navigation', selector: 'a[href]' });
    } else if (number === 5) {
      req.push(
        { id: 'form-input', label: 'Preencher um campo da solicitação', event: 'input', selector: 'input, select, textarea' },
        { id: 'form-submit', label: 'Testar o envio do formulário com os campos válidos', event: 'submit', selector: 'form' }
      );
    } else if (number === 6) {
      req.push({ id: 'compact-mode', label: 'Ativar ou desativar o modo compacto', event: 'click', selector: '#alternar-densidade' });
    } else if (number === 7) {
      req.push(
        { id: 'search-input', label: 'Pesquisar um módulo', event: 'input', selector: '#busca' },
        { id: 'filter-click', label: 'Testar um filtro da barra', event: 'click', selector: '[data-filtro]' }
      );
    } else if (number === 8) {
      req.push({ id: 'dashboard-control', label: 'Testar um controle do dashboard', event: 'click', selector: '.periodo, #alternar-densidade, #adicionar-tarefa' });
    }
    return req;
  }

  function describeTarget(element) {
    if (!element || element.nodeType !== 1) return {};
    return {
      tag: element.tagName?.toLowerCase() || '',
      id: element.id || '',
      className: typeof element.className === 'string' ? element.className : '',
      type: element.getAttribute?.('type') || '',
      name: element.getAttribute?.('name') || '',
      href: element.getAttribute?.('href') || ''
    };
  }

  function selectorMatches(target, selector) {
    if (!selector) return true;
    if (!target) return false;
    const selectors = selector.split(',').map(item => item.trim()).filter(Boolean);
    return selectors.some(item => {
      if (item.startsWith('#')) return target.id === item.slice(1);
      if (item.startsWith('.')) return String(target.className || '').split(/\s+/).includes(item.slice(1));
      if (item === '[data-filtro]') return Boolean(target.dataFiltro);
      if (item === 'a[href]') return target.tag === 'a' && Boolean(target.href);
      if (item === 'form') return target.tag === 'form';
      if (item === 'button[type="submit"]') return target.tag === 'button' && target.type === 'submit' && target.formValid === true;
      if (item === 'input' || item === 'select' || item === 'textarea' || item === 'table') return target.tag === item;
      if (item === 'tbody tr') return target.tag === 'tr' || target.closestTag === 'tr';
      if (item === '[role="region"]') return target.role === 'region';
      if (item === 'input, select, textarea') return ['input', 'select', 'textarea'].includes(target.tag);
      return false;
    });
  }

  function start(exercise, file, codeSnapshot) {
    return {
      ...defaultFileState(),
      status: 'running',
      executionId: executionId(exercise?.numero),
      codeHash: fastHash(codeSnapshot),
      startedAt: new Date().toISOString(),
      stale: false,
      interactions: []
    };
  }

  function invalidate(record) {
    const next = { ...defaultFileState(), ...(record || {}) };
    next.status = next.executionId ? 'stale' : 'never';
    next.stale = true;
    next.ready = false;
    next.error = null;
    next.validatedAt = null;
    next.validatedHash = null;
    next.validatedExecutionId = null;
    return next;
  }

  function markMessage(record, data, exercise, file) {
    const next = { ...defaultFileState(), ...(record || {}) };
    if (!data || data.executionId !== next.executionId) return next;
    if (data.type === 'error') {
      next.status = 'error';
      next.error = String(data.detail || 'Erro no preview.');
      next.finishedAt = new Date().toISOString();
      next.ready = false;
      return next;
    }
    if (data.type === 'ready' && next.status !== 'error') {
      next.status = 'success';
      next.ready = true;
      next.finishedAt = new Date().toISOString();
      if (!next.interactions.some(item => item.requirementId === 'preview-ready')) {
        next.interactions.push({ requirementId: 'preview-ready', event: 'ready', at: new Date().toISOString(), target: {} });
      }
      return next;
    }
    if (data.type === 'interaction' || data.type === 'navigation') {
      const event = data.type === 'navigation' ? 'navigation' : data.event;
      const target = data.target || {};
      const reqs = requirements(exercise, file);
      reqs.forEach(req => {
        if (req.event !== event || !selectorMatches(target, req.selector)) return;
        if (next.interactions.some(item => item.requirementId === req.id)) return;
        next.interactions.push({ requirementId: req.id, event, at: new Date().toISOString(), target });
      });
      return next;
    }
    return next;
  }

  function readiness(record, exercise, file, codeSnapshot) {
    const current = { ...defaultFileState(), ...(record || {}) };
    const reqs = requirements(exercise, file);
    const metIds = new Set((current.interactions || []).map(item => item.requirementId));
    const missing = reqs.filter(req => !metIds.has(req.id));
    const hashMatches = current.codeHash === fastHash(codeSnapshot);
    const ok = current.status === 'success' && current.ready && !current.stale && hashMatches && !current.error && missing.length === 0;
    return { ok, missing, hashMatches, status: current.status, error: current.error, requirements: reqs };
  }

  function bridgeScript(id) {
    const safeId = JSON.stringify(String(id || ''));
    return `<script>(function(){
      var executionId=${safeId};
      function targetInfo(element){
        if(!element||element.nodeType!==1)return {};
        var closestTr=element.closest&&element.closest('tr');
        var form=element.form||null;return {tag:(element.tagName||'').toLowerCase(),id:element.id||'',className:typeof element.className==='string'?element.className:'',type:element.getAttribute&&element.getAttribute('type')||'',name:element.getAttribute&&element.getAttribute('name')||'',href:element.getAttribute&&element.getAttribute('href')||'',role:element.getAttribute&&element.getAttribute('role')||'',dataFiltro:element.getAttribute&&element.getAttribute('data-filtro')||'',closestTag:closestTr?'tr':'',formValid:form&&typeof form.checkValidity==='function'?form.checkValidity():null};
      }
      function report(type,detail,extra){parent.postMessage(Object.assign({channel:'ds3-preview',type:type,detail:String(detail||''),executionId:executionId},extra||{}),'*');}
      ['log','warn','error'].forEach(function(level){var original=console[level];console[level]=function(){var args=Array.prototype.slice.call(arguments).map(function(value){try{return typeof value==='string'?value:JSON.stringify(value);}catch(e){return String(value);}});report('console','',{level:level,args:args});return original&&original.apply(console,arguments);};});
      window.addEventListener('error',function(e){report('error',e.message||'Erro JavaScript no preview.',{line:e.lineno||null,column:e.colno||null,stack:e.error&&e.error.stack?String(e.error.stack):''});});
      window.addEventListener('unhandledrejection',function(e){report('error',e.reason||'Promise rejeitada no preview.',{stack:e.reason&&e.reason.stack?String(e.reason.stack):''});});
      document.addEventListener('click',function(event){
        var link=event.target.closest&&event.target.closest('a[href]');
        var target=event.target.closest&&event.target.closest('button,a,input,select,textarea,tr,[role="region"]')||event.target;
        report('interaction','clique',{event:'click',target:targetInfo(target)});
        if(link&&!String(link.getAttribute('href')||'').startsWith('#')){event.preventDefault();report('navigation',link.getAttribute('href'),{target:targetInfo(link)});}
      },true);
      document.addEventListener('input',function(event){report('interaction','entrada',{event:'input',target:targetInfo(event.target)});},true);
      document.addEventListener('change',function(event){report('interaction','alteração',{event:'change',target:targetInfo(event.target)});},true);
      document.addEventListener('submit',function(event){event.preventDefault();report('interaction','envio',{event:'submit',target:targetInfo(event.target)});},true);
      document.addEventListener('focusin',function(event){report('interaction','foco',{event:'focusin',target:targetInfo(event.target)});},true);
      function ready(){report('ready','Preview carregado.');}
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else setTimeout(ready,0);
    })();<\/script>`;
  }

  function evidenceHtml(evidence) {
    const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
    const fileRows = Object.values(evidence.files || {}).map(item => `<tr><td>${escape(item.fileName)}</td><td>${escape(item.sha256)}</td><td>${escape(item.executionId)}</td><td>${escape(item.validatedAt)}</td></tr>`).join('');
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evidência ${escape(evidence.id)}</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:32px auto;padding:0 20px;color:#102033}h1{font-size:28px}.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.box{border:1px solid #cbd5e1;border-radius:10px;padding:12px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;word-break:break-all}code{font-family:monospace}@media(max-width:640px){.meta{grid-template-columns:1fr}}</style></head><body><h1>Evidência da atividade</h1><p><strong>ID:</strong> <code>${escape(evidence.id)}</code></p><div class="meta"><div class="box"><strong>Aluno</strong><br>${escape(evidence.aluno)}</div><div class="box"><strong>Turma</strong><br>${escape(evidence.turma)}</div><div class="box"><strong>Disciplina</strong><br>${escape(evidence.disciplina)}</div><div class="box"><strong>Exercício</strong><br>${escape(evidence.exercicio)} - ${escape(evidence.titulo)}</div><div class="box"><strong>Versão</strong><br>${escape(evidence.versao)}</div><div class="box"><strong>Gerada em</strong><br>${escape(evidence.geradaEm)}</div></div><h2>Integridade</h2><p><strong>Hash do projeto:</strong> <code>${escape(evidence.projectSha256)}</code></p><table><thead><tr><th>Arquivo</th><th>SHA-256</th><th>Execução</th><th>Validação</th></tr></thead><tbody>${fileRows}</tbody></table><h2>Processo</h2><p>Interações registradas: ${escape(evidence.totalInteractions)}</p><p>Apoio automático utilizado: ${evidence.autocomplete?.utilizado ? 'sim' : 'não'}</p><p>Confirmação de conclusão: ${escape(evidence.confirmedAt)}</p></body></html>`;
  }

  async function buildEvidence({ exercise, order, fileNames, contents, executions, completion, autocomplete, user, version }) {
    const files = {};
    for (const key of order) {
      const content = String(contents[key] ?? '');
      const execution = executions[key] || defaultFileState();
      files[key] = {
        fileName: fileNames[key] || key,
        sha256: await sha256(content),
        bytes: new TextEncoder().encode(content).length,
        executionId: execution.validatedExecutionId || execution.executionId,
        executedAt: execution.startedAt,
        validatedAt: execution.validatedAt,
        interactions: execution.interactions || []
      };
    }
    const canonical = order.map(key => `${fileNames[key] || key}\n${contents[key] ?? ''}`).join('\n---ARQUIVO---\n');
    const evidence = {
      schemaVersion: SCHEMA_VERSION,
      id: evidenceId(exercise?.numero),
      aluno: user?.displayName || user?.name || user?.username || '',
      usuario: user?.username || '',
      turma: user?.group || '3º DS manhã',
      disciplina: 'Programação no Desenvolvimento de Sistemas',
      exercicio: exercise?.numero,
      titulo: exercise?.titulo,
      versao: version || '',
      geradaEm: new Date().toISOString(),
      confirmedAt: completion?.confirmedAt || null,
      confirmationId: completion?.confirmationId || null,
      projectSha256: await sha256(canonical),
      totalInteractions: Object.values(files).reduce((sum, item) => sum + item.interactions.length, 0),
      autocomplete: autocomplete || { utilizado: false },
      files
    };
    evidence.html = evidenceHtml(evidence);
    return evidence;
  }

  global.ExecutionFlow = {
    defaultFileState,
    defaultCompletionState,
    fastHash,
    sha256,
    requirements,
    start,
    invalidate,
    markMessage,
    readiness,
    bridgeScript,
    buildEvidence,
    evidenceHtml
  };
})(window);

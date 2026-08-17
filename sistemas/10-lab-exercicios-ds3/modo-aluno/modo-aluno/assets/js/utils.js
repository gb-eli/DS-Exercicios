window.Utils = (() => {
  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  const GLOSSARY = {
    function: { tipo: 'Palavra reservada', definicao: 'Cria uma função: um bloco reutilizável de instruções.' },
    let: { tipo: 'Palavra reservada', definicao: 'Declara uma variável que poderá receber outro valor.' },
    const: { tipo: 'Palavra reservada', definicao: 'Declara uma referência que não deverá ser reatribuída.' },
    var: { tipo: 'Palavra reservada', definicao: 'Forma antiga de declarar variável, com regras de escopo diferentes de let.' },
    for: { tipo: 'Palavra reservada', definicao: 'Repete um bloco usando valor inicial, condição e atualização.' },
    while: { tipo: 'Palavra reservada', definicao: 'Repete um bloco enquanto uma condição for verdadeira.' },
    if: { tipo: 'Palavra reservada', definicao: 'Executa um bloco somente quando uma condição é verdadeira.' },
    else: { tipo: 'Palavra reservada', definicao: 'Executa uma alternativa quando a condição anterior é falsa.' },
    return: { tipo: 'Palavra reservada', definicao: 'Encerra uma função e pode devolver um valor.' },
    true: { tipo: 'Valor booleano', definicao: 'Representa verdadeiro.' },
    false: { tipo: 'Valor booleano', definicao: 'Representa falso.' },
    document: { tipo: 'Objeto do navegador', definicao: 'Representa a página HTML carregada no navegador.' },
    getElementById: { tipo: 'Método', definicao: 'Localiza um elemento HTML pelo atributo id.' },
    querySelector: { tipo: 'Método', definicao: 'Localiza o primeiro elemento que corresponde a um seletor CSS.' },
    innerText: { tipo: 'Propriedade', definicao: 'Lê ou altera o texto visível de um elemento.' },
    textContent: { tipo: 'Propriedade', definicao: 'Lê ou altera o conteúdo textual de um elemento.' },
    value: { tipo: 'Propriedade', definicao: 'Obtém ou altera o valor digitado em um campo.' },
    style: { tipo: 'Propriedade', definicao: 'Permite alterar estilos diretamente pelo JavaScript.' },
    onclick: { tipo: 'Evento no HTML', definicao: 'Executa uma função quando o elemento recebe um clique.' },
    addEventListener: { tipo: 'Método de evento', definicao: 'Registra uma função para responder a um evento.' },
    backgroundColor: { tipo: 'Propriedade CSS no JS', definicao: 'Altera a cor de fundo usando a escrita camelCase.' },
    color: { tipo: 'Propriedade CSS', definicao: 'Altera a cor do texto.' },
    fontSize: { tipo: 'Propriedade CSS no JS', definicao: 'Altera o tamanho da fonte.' },
    fontFamily: { tipo: 'Propriedade CSS no JS', definicao: 'Altera a família da fonte.' },
    fontWeight: { tipo: 'Propriedade CSS no JS', definicao: 'Altera a espessura da fonte.' },
    checked: { tipo: 'Propriedade', definicao: 'Informa true ou false conforme uma opção esteja marcada.' },
    typeof: { tipo: 'Operador', definicao: 'Informa o tipo de um valor no JavaScript.' },
    Number: { tipo: 'Função nativa', definicao: 'Converte um valor para número quando possível.' },
    trim: { tipo: 'Método de string', definicao: 'Remove espaços do início e do final de um texto.' },
    length: { tipo: 'Propriedade', definicao: 'Informa a quantidade de caracteres ou itens.' },
    focus: { tipo: 'Método', definicao: 'Move o foco do teclado para um elemento.' },
    push: { tipo: 'Método de array', definicao: 'Adiciona um item ao final de um array.' },
    pop: { tipo: 'Método de array', definicao: 'Remove o último item de um array.' },
    forEach: { tipo: 'Método de array', definicao: 'Executa uma função para cada item do array.' },
    map: { tipo: 'Método de array', definicao: 'Cria um novo array transformando cada item.' },
    filter: { tipo: 'Método de array', definicao: 'Cria um novo array apenas com itens aprovados por uma condição.' },
    find: { tipo: 'Método de array', definicao: 'Retorna o primeiro item que atende a uma condição.' },
    reduce: { tipo: 'Método de array', definicao: 'Combina vários valores em um resultado acumulado.' },
    localStorage: { tipo: 'API do navegador', definicao: 'Armazena pequenos dados no navegador do usuário.' },
    JSON: { tipo: 'Objeto nativo', definicao: 'Converte dados entre objetos JavaScript e texto JSON.' },
    fetch: { tipo: 'API do navegador', definicao: 'Solicita dados de um endereço ou serviço externo.' },
    async: { tipo: 'Palavra reservada', definicao: 'Marca uma função que trabalha com operações assíncronas.' },
    await: { tipo: 'Palavra reservada', definicao: 'Espera o resultado de uma operação assíncrona dentro de uma função async.' },
    '===': { tipo: 'Operador', definicao: 'Compara valor e tipo sem realizar conversão automática.' },
    '&&': { tipo: 'Operador lógico', definicao: 'Exige que as duas condições sejam verdadeiras.' },
    '||': { tipo: 'Operador lógico', definicao: 'Aceita que pelo menos uma das condições seja verdadeira.' },
    '+=': { tipo: 'Operador de atribuição', definicao: 'Acrescenta um valor ao conteúdo que já existe.' },
    '<=': { tipo: 'Operador de comparação', definicao: 'Verifica se um valor é menor ou igual a outro.' },
    '++': { tipo: 'Operador', definicao: 'Soma uma unidade ao valor atual.' },
    '--': { tipo: 'Operador', definicao: 'Subtrai uma unidade do valor atual.' }
  };

  function highlight(raw, lang) {
    if (String(lang || '').toLowerCase().startsWith('html')) lang = 'html';
    let code = escapeHtml(raw);
    if (lang === 'html') {
      code = code.replace(/(&lt;!--.*?--&gt;)/g, '<span class="tok-comment">$1</span>');
      code = code.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-tag">$2</span>');
      code = code.replace(/([\w-]+)(=)(&quot;.*?&quot;)/g, '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>');
    } else if (lang === 'css') {
      code = code.replace(/(\/\*.*?\*\/)/g, '<span class="tok-comment">$1</span>');
      code = code.replace(/(^|\n)([^\n{}]+)(?=\s*\{)/g, '$1<span class="tok-selector">$2</span>');
      code = code.replace(/([\w-]+)(\s*:)/g, '<span class="tok-property">$1</span>$2');
      code = code.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-string">$1</span>');
      code = code.replace(/\b(\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw)?)\b/g, '<span class="tok-number">$1</span>');
    } else {
      code = code.replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');
      code = code.replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span class="tok-string">$1</span>');
      code = code.replace(/\b(function|let|const|var|if|else|return|true|false|null|new|for|while|async|await|try|catch)\b/g, '<span class="tok-keyword">$1</span>');
      code = code.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>');
      code = code.replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');
    }
    return code;
  }

  function renderCode(container, code, lang, range = null, only = false) {
    if (!container) return;
    const lines = String(code || '').replace(/\n$/, '').split('\n');
    container.innerHTML = '';
    lines.forEach((line, index) => {
      const number = index + 1;
      const inRange = !range || (number >= range[0] && number <= range[1]);
      if (only && !inRange) return;
      const row = document.createElement('div');
      row.className = 'code-line';
      row.dataset.line = number;
      if (range && inRange) row.classList.add('highlight');
      if (range && !inRange) row.classList.add('dim');
      const codeElement = document.createElement('code');
      codeElement.innerHTML = highlight(line, lang) || '&nbsp;';
      row.append(codeElement);
      container.append(row);
    });
    const firstHighlight = container.querySelector('.code-line.highlight');
    if (firstHighlight) {
      container.scrollTop = Math.max(0, firstHighlight.offsetTop - (container.clientHeight / 2));
    }
  }

  function toast(message) {
    const element = document.querySelector('#toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove('show'), 1900);
  }

  async function copy(text, message = 'Copiado!') {
    try {
      await navigator.clipboard.writeText(text);
      toast(message);
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      toast(message);
    }
  }

  function downloadBlob(name, blob) {
    const anchor = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    anchor.href = objectUrl;
    anchor.download = name;
    anchor.hidden = true;
    anchor.rel = 'noopener noreferrer';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  function download(name, content, type = 'text/plain;charset=utf-8') {
    downloadBlob(name, new Blob([content], { type }));
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function zipStore(files) {
    const encoder = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    const write16 = (view, at, value) => view.setUint16(at, value, true);
    const write32 = (view, at, value) => view.setUint32(at, value >>> 0, true);

    Object.entries(files).forEach(([rawName, rawContent]) => {
      const name = String(rawName).replace(/^\/+/, '').replace(/\\/g, '/');
      const nameBytes = encoder.encode(name);
      const data = encoder.encode(String(rawContent ?? ''));
      const checksum = crc32(data);
      const local = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(local.buffer);
      write32(localView, 0, 0x04034b50);
      write16(localView, 4, 20);
      write16(localView, 6, 0x0800);
      write16(localView, 8, 0);
      write16(localView, 10, 0);
      write16(localView, 12, 0);
      write32(localView, 14, checksum);
      write32(localView, 18, data.length);
      write32(localView, 22, data.length);
      write16(localView, 26, nameBytes.length);
      write16(localView, 28, 0);
      local.set(nameBytes, 30);
      chunks.push(local, data);

      const entry = new Uint8Array(46 + nameBytes.length);
      const entryView = new DataView(entry.buffer);
      write32(entryView, 0, 0x02014b50);
      write16(entryView, 4, 20);
      write16(entryView, 6, 20);
      write16(entryView, 8, 0x0800);
      write16(entryView, 10, 0);
      write16(entryView, 12, 0);
      write16(entryView, 14, 0);
      write32(entryView, 16, checksum);
      write32(entryView, 20, data.length);
      write32(entryView, 24, data.length);
      write16(entryView, 28, nameBytes.length);
      write16(entryView, 30, 0);
      write16(entryView, 32, 0);
      write16(entryView, 34, 0);
      write16(entryView, 36, 0);
      write32(entryView, 38, 0);
      write32(entryView, 42, offset);
      entry.set(nameBytes, 46);
      central.push(entry);
      offset += local.length + data.length;
    });

    const centralSize = central.reduce((sum, chunk) => sum + chunk.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    write32(endView, 0, 0x06054b50);
    write16(endView, 4, 0);
    write16(endView, 6, 0);
    write16(endView, 8, central.length);
    write16(endView, 10, central.length);
    write32(endView, 12, centralSize);
    write32(endView, 16, offset);
    write16(endView, 20, 0);
    return new Blob([...chunks, ...central, end], { type: 'application/zip' });
  }

  function safeProjectToken(value = '') {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'usuario';
  }

  function githubStorageKey() {
    const user = window.AppAuth?.currentUser?.()?.username || 'sem-usuario';
    const project = window.APP_CONFIG?.repositorio || '3ds-programacao';
    return `ds3_${safeProjectToken(project)}_${safeProjectToken(user)}_github_v2`;
  }

  function normalizeGithubUrl(value) {
    let raw = String(value || '').trim();
    if (!raw) return null;
    if (/^github\.com\//i.test(raw)) raw = `https://${raw}`;
    if (!/^https:\/\//i.test(raw)) return null;
    try {
      const url = new URL(raw);
      if (url.hostname.toLowerCase() !== 'github.com') return null;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      url.protocol = 'https:';
      url.username = '';
      url.password = '';
      url.hash = '';
      return `${url.origin}/${parts[0]}/${parts[1].replace(/\.git$/i, '')}`;
    } catch (error) {
      return null;
    }
  }

  function getGithub() {
    return localStorage.getItem(githubStorageKey()) || window.APP_CONFIG?.githubDefault || 'https://github.com/';
  }

  function setGithub(url) {
    const normalized = normalizeGithubUrl(url);
    if (!normalized) return false;
    localStorage.setItem(githubStorageKey(), normalized);
    return true;
  }

  function openGithub() {
    const url = normalizeGithubUrl(getGithub());
    if (!url) {
      toast('Configure um endereço válido do GitHub antes de abrir.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function openClassroom() {
    const raw = window.APP_CONFIG?.classroomUrl || 'https://classroom.google.com/';
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:') throw new Error('protocolo inválido');
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast('O endereço do Classroom não está configurado corretamente.');
    }
  }

  function configureGithub() {
    const current = getGithub();
    const url = prompt(
      'Cole o endereço do repositório atividades-praticas no GitHub:',
      current === 'https://github.com/' ? '' : current
    );
    if (url === null) return;
    if (setGithub(url)) toast('Repositório configurado para este usuário.');
    else toast('Use um endereço como https://github.com/usuario/repositorio.');
  }

  function normalizar(code) {
    return String(code || '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, '')
      .trim();
  }


  function removeBom(value) {
    return String(value || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  }

  function hasPastedLineNumbers(code) {
    const lines = removeBom(code).split('\n').filter(line => line.trim());
    if (lines.length < 3) return false;
    const numbered = lines.filter(line => /^\s*\d+\s+(?:<|[.#@A-Za-z_$/*])/u.test(line)).length;
    return numbered >= Math.ceil(lines.length * 0.6);
  }

  function hasSmartQuotes(code) {
    return /[“”‘’]/u.test(String(code || ''));
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function lineFromOffset(code, offset) {
    return removeBom(code).slice(0, Math.max(0, offset)).split('\n').length;
  }

  function firstDifferentLine(actual, expected) {
    const a = removeBom(actual).split('\n');
    const e = removeBom(expected).split('\n');
    const total = Math.max(a.length, e.length);
    for (let index = 0; index < total; index += 1) {
      const av = normalizeText(a[index] || '');
      const ev = normalizeText(e[index] || '');
      if (av !== ev) return index + 1;
    }
    return null;
  }

  function canonicalHtmlNode(node) {
    if (!node) return '';
    if (node.nodeType === Node.COMMENT_NODE) return '';
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(node.nodeValue);
      return text ? `#text(${JSON.stringify(text)})` : '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    const attributes = [...node.attributes].map(attribute => {
      let value = attribute.value.trim();
      if (attribute.name.toLowerCase() === 'class') {
        value = value.split(/\s+/).filter(Boolean).sort().join(' ');
      }
      if (attribute.name.toLowerCase() === 'style') {
        value = value.split(';').map(item => item.trim()).filter(Boolean).sort().join(';');
      }
      return [attribute.name.toLowerCase(), value];
    }).sort((a, b) => a[0].localeCompare(b[0]));

    const attrs = attributes.map(([name, value]) => `${name}=${JSON.stringify(value)}`).join('|');
    const children = [...node.childNodes].map(canonicalHtmlNode).filter(Boolean).join('');
    return `<${tag}${attrs ? ` ${attrs}` : ''}>${children}</${tag}>`;
  }

  function parseHtml(code) {
    const clean = removeBom(code);
    const documentParsed = new DOMParser().parseFromString(clean, 'text/html');
    const canonical = `${/^\s*<!doctype\s+html/i.test(clean) ? '<!doctype html>' : ''}${canonicalHtmlNode(documentParsed.documentElement)}`;
    return { document: documentParsed, canonical };
  }

  function htmlDiagnostics(actual, expected) {
    const issues = [];
    const suggestions = [];
    const actualParsed = parseHtml(actual);
    const expectedParsed = parseHtml(expected);
    const actualDoc = actualParsed.document;
    const expectedDoc = expectedParsed.document;

    if (/^\s*<!doctype\s+html/i.test(expected) && !/^\s*<!doctype\s+html/i.test(actual)) {
      issues.push({ title: 'DOCTYPE ausente', detail: 'Inclua <!DOCTYPE html> no início do arquivo.', line: 1 });
    }

    expectedDoc.querySelectorAll('[id]').forEach(element => {
      const id = element.id;
      const found = actualDoc.getElementById(id);
      if (!found) {
        issues.push({ title: `Elemento #${id} não encontrado`, detail: `O HTML precisa de um elemento com id="${id}".` });
      } else if (found.tagName !== element.tagName) {
        issues.push({ title: `Tag diferente em #${id}`, detail: `O id="${id}" está em <${found.tagName.toLowerCase()}>; revise a tag usada.` });
      }
    });

    expectedDoc.querySelectorAll('link[href], script[src]').forEach(element => {
      const attribute = element.tagName === 'LINK' ? 'href' : 'src';
      const value = element.getAttribute(attribute);
      const selector = `${element.tagName.toLowerCase()}[${attribute}="${CSS.escape(value)}"]`;
      if (!actualDoc.querySelector(selector)) {
        issues.push({ title: 'Arquivo não conectado', detail: `Confira a referência ${attribute}="${value}" no HTML.` });
      }
    });

    const importantAttributes = ['onclick', 'type', 'for', 'placeholder', 'lang', 'charset', 'name'];
    expectedDoc.querySelectorAll('[id]').forEach(expectedElement => {
      const actualElement = actualDoc.getElementById(expectedElement.id);
      if (!actualElement) return;
      importantAttributes.forEach(attribute => {
        if (!expectedElement.hasAttribute(attribute)) return;
        const expectedValue = normalizeText(expectedElement.getAttribute(attribute));
        const actualValue = normalizeText(actualElement.getAttribute(attribute));
        if (expectedValue !== actualValue) {
          issues.push({ title: `Atributo divergente em #${expectedElement.id}`, detail: `Revise o atributo ${attribute} desse elemento.` });
        }
      });
    });

    if (hasSmartQuotes(actual)) {
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque “ ” ou ‘ ’ por aspas normais do teclado: " " ou \' \'.' });
    }
    if (hasPastedLineNumbers(actual)) {
      issues.unshift({ title: 'Números de linha no código', detail: 'Parece que os números exibidos ao lado do código foram colados no editor. Remova-os.' });
    }

    if (!issues.length && actualParsed.canonical !== expectedParsed.canonical) {
      const line = firstDifferentLine(actual, expected);
      issues.push({ title: 'Estrutura HTML diferente', detail: 'As tags principais existem, mas alguma ordem, texto, atributo ou fechamento ainda está diferente.', line });
    }

    suggestions.push('Confira a abertura e o fechamento das tags.');
    suggestions.push('Revise ids, nomes dos arquivos e atributos usados nos botões e campos.');
    suggestions.push('Espaços, indentação, quebras de linha e ordem dos atributos não impedem a validação.');

    return {
      ok: actualParsed.canonical === expectedParsed.canonical,
      summary: issues[0]?.detail || 'Estrutura HTML reconhecida.',
      issues,
      suggestions,
      firstLine: issues.find(item => item.line)?.line || firstDifferentLine(actual, expected)
    };
  }

  function removeCssComments(code) {
    return removeBom(code).replace(/\/\*[\s\S]*?\*\//g, '');
  }

  function splitCssTopLevel(value, separator) {
    const parts = [];
    let current = '';
    let quote = '';
    let depth = 0;
    for (let index = 0; index < value.length; index += 1) {
      const char = value[index];
      const previous = value[index - 1];
      if (quote) {
        current += char;
        if (char === quote && previous !== '\\') quote = '';
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        current += char;
        continue;
      }
      if (char === '(' || char === '[') depth += 1;
      if (char === ')' || char === ']') depth = Math.max(0, depth - 1);
      if (char === separator && depth === 0) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current);
    return parts;
  }

  function normalizeCssSelector(selector) {
    return normalizeText(selector)
      .replace(/\s*([>+~,:])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeCssValue(value) {
    // O CSSOM já normaliza palavras-chave insensíveis à caixa, como FLEX e RED.
    // Não converta o valor inteiro para minúsculas: strings, URLs, nomes de animação,
    // fontes e outros identificadores personalizados podem ser sensíveis à caixa.
    return String(value || '')
      .trim()
      .replace(/(["'])(.*?)\1/g, (_, quote, text) => JSON.stringify(text))
      .replace(/\s*([,:/()])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .replace(/(^|\s)0(?:px|rem|em|%|vh|vw)(?=\s|$)/gi, '$10');
  }

  function cssBraceIssue(code) {
    const clean = removeCssComments(code);
    let quote = '';
    let depth = 0;
    let line = 1;
    const openedAt = [];
    for (let index = 0; index < clean.length; index += 1) {
      const char = clean[index];
      const previous = clean[index - 1];
      if (char === '\n') line += 1;
      if (quote) {
        if (char === quote && previous !== '\\') quote = '';
        continue;
      }
      if (char === '"' || char === "'") { quote = char; continue; }
      if (char === '{') { depth += 1; openedAt.push(line); }
      if (char === '}') {
        depth -= 1;
        if (depth < 0) return { title: 'Chave de fechamento sem abertura', detail: 'Existe uma chave } sem o bloco correspondente.', line };
        openedAt.pop();
      }
    }
    if (depth > 0) return { title: 'Chave de fechamento ausente', detail: 'Um bloco CSS foi aberto com { e não foi fechado com }.', line: openedAt.at(-1) || 1 };
    if (quote) return { title: 'Texto CSS não fechado', detail: 'Uma sequência entre aspas não foi fechada.', line };
    return null;
  }

  function parseCss(code) {
    const rules = new Map();
    const errors = [];
    const braceIssue = cssBraceIssue(code);
    if (braceIssue) errors.push(braceIssue);

    const cssDocument = document.implementation.createHTMLDocument('css-validation');
    const style = cssDocument.createElement('style');
    style.textContent = removeCssComments(code);
    cssDocument.head.append(style);

    function addStyleRule(rule, context = '') {
      const declarations = new Map();
      for (let index = 0; index < rule.style.length; index += 1) {
        const property = rule.style[index].toLowerCase();
        declarations.set(property, normalizeCssValue(rule.style.getPropertyValue(property)));
      }
      splitCssTopLevel(rule.selectorText || '', ',')
        .map(normalizeCssSelector)
        .filter(Boolean)
        .forEach(selector => {
          const key = `${context}${selector}`;
          const existing = rules.get(key) || new Map();
          declarations.forEach((value, property) => existing.set(property, value));
          rules.set(key, existing);
        });
    }

    function walk(ruleList, context = '') {
      [...ruleList].forEach(rule => {
        if (rule.type === CSSRule.STYLE_RULE) {
          addStyleRule(rule, context);
          return;
        }
        if (rule.type === CSSRule.MEDIA_RULE) {
          const media = normalizeCssSelector(`@media ${rule.conditionText}`);
          walk(rule.cssRules, `${context}${media}|`);
          return;
        }
        if ('cssRules' in rule && rule.cssRules) {
          const label = normalizeText(rule.cssText.split('{')[0]);
          walk(rule.cssRules, `${context}${label}|`);
        }
      });
    }

    try {
      walk(style.sheet?.cssRules || []);
    } catch (error) {
      errors.push({ title: 'CSS não interpretado', detail: 'O navegador encontrou uma regra CSS inválida. Revise seletores, chaves e valores.' });
    }

    return { rules, errors };
  }

  function cssDiagnostics(actual, expected) {
    const actualParsed = parseCss(actual);
    const expectedParsed = parseCss(expected);
    const issues = [...actualParsed.errors];
    const suggestions = [];

    expectedParsed.rules.forEach((declarations, selector) => {
      const actualDeclarations = actualParsed.rules.get(selector);
      if (!actualDeclarations) {
        issues.push({ title: `Seletor ausente: ${selector.replaceAll("|", " → ")}`, detail: `Crie ou revise o bloco CSS do seletor ${selector.replaceAll("|", " → ")}.` });
        return;
      }
      declarations.forEach((expectedValue, property) => {
        if (!actualDeclarations.has(property)) {
          issues.push({ title: `Propriedade ausente em ${selector.replaceAll("|", " → ")}`, detail: `A propriedade ${property} não foi encontrada nesse seletor.` });
          return;
        }
        const actualValue = actualDeclarations.get(property);
        if (actualValue !== expectedValue) {
          issues.push({ title: `Valor divergente em ${selector.replaceAll("|", " → ")}`, detail: `Revise o valor da propriedade ${property}.` });
        }
      });
    });

    if (hasSmartQuotes(actual)) {
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais do teclado nas fontes e conteúdos CSS.' });
    }
    if (hasPastedLineNumbers(actual)) {
      issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha que foram colados antes das regras CSS.' });
    }

    suggestions.push('A ordem dos seletores e das propriedades pode ser diferente.');
    suggestions.push('Espaços, indentação, quebras de linha e o último ponto e vírgula são aceitos.');
    suggestions.push('Confira chaves, dois-pontos, nomes das propriedades e unidades dos valores.');

    return {
      ok: issues.length === 0,
      summary: issues[0]?.detail || 'Regras CSS reconhecidas.',
      issues,
      suggestions,
      firstLine: issues.find(item => item.line)?.line || firstDifferentLine(actual, expected)
    };
  }


  function semanticCssMetrics(actual, exercise) {
    const config = exercise?.validacao?.cssSemantico || {};
    const parsed = parseCss(actual);
    const entries = [...parsed.rules.entries()].map(([selector, declarations]) => ({ selector, declarations }));
    const checks = [];
    const add = (key, ok, title, detail) => checks.push({ key, ok: Boolean(ok), title, detail });
    const selectorText = entry => entry.selector.split('|').at(-1) || entry.selector;
    const matching = patterns => entries.filter(entry => (patterns || []).some(pattern => selectorText(entry).includes(pattern)));
    const propertyPresent = (entry, property) => {
      if (entry.declarations.has(property)) return true;
      const names = [...entry.declarations.keys()];
      if (['padding', 'padding-block', 'padding-inline'].includes(property)) return names.some(name => /^padding-(?:top|right|bottom|left|block|inline)/.test(name));
      if (property === 'border') return names.some(name => /^border-(?:top|right|bottom|left)-(?:width|style|color)$/.test(name));
      if (property === 'border-width') return names.some(name => /^border-(?:top|right|bottom|left)-width$/.test(name));
      if (property === 'border-style') return names.some(name => /^border-(?:top|right|bottom|left)-style$/.test(name));
      if (property === 'border-radius') return names.some(name => /^border-(?:top|bottom)-(?:left|right)-radius$/.test(name));
      if (['background', 'background-color'].includes(property)) return names.some(name => /^background-/.test(name));
      if (['margin', 'margin-block', 'margin-inline'].includes(property)) return names.some(name => /^margin-(?:top|right|bottom|left|block|inline)/.test(name));
      if (property === 'gap') return names.includes('row-gap') || names.includes('column-gap');
      return false;
    };
    const hasAnyProperty = (entry, properties) => (properties || []).some(property => propertyPresent(entry, property));
    const valueOfAny = (entry, properties) => (properties || []).map(property => entry.declarations.get(property)).find(Boolean) || '';

    if (config.boxSizingBorderBox) {
      const ok = entries.some(entry => /(^|,)\s*\*($|,|::)/.test(selectorText(entry)) && entry.declarations.get('box-sizing') === 'border-box');
      add('boxSizing', ok, 'Box sizing global ausente', 'Configure box-sizing: border-box para o seletor universal e seus pseudoelementos.');
    }

    if (config.layout) {
      const candidates = matching(config.layout.seletores || []);
      const layout = candidates.find(entry => (config.layout.displays || ['grid', 'flex']).includes(entry.declarations.get('display')));
      add('layoutDisplay', Boolean(layout), 'Layout dos cards não identificado', 'Use display: grid ou display: flex no contêiner dos cards.');
      if (config.layout.exigirGap) {
        const ok = candidates.some(entry => hasAnyProperty(entry, ['gap', 'row-gap', 'column-gap']));
        add('layoutGap', ok, 'Gap não identificado', 'Use gap, row-gap ou column-gap para separar os cards.');
      }
      if (config.layout.exigirColunasFlexiveis) {
        const ok = candidates.some(entry => {
          const value = entry.declarations.get('grid-template-columns') || entry.declarations.get('flex-wrap') || '';
          return /repeat|minmax|auto-fit|auto-fill|wrap/.test(value);
        });
        add('layoutFlexible', ok, 'Layout flexível não identificado', 'Use colunas flexíveis com repeat/minmax/auto-fit ou flex-wrap.');
      }
    }

    if (config.card) {
      const cards = matching(config.card.seletores || []);
      add('cardSelector', cards.length > 0, 'Seletor dos cards ausente', 'Crie uma regra para os cards de indicadores.');
      (config.card.gruposPropriedades || []).forEach((properties, index) => {
        const ok = cards.some(entry => hasAnyProperty(entry, properties));
        add(`cardProperty${index}`, ok, `Propriedade do card ausente`, `Inclua no card uma destas propriedades: ${properties.join(', ')}.`);
      });
      if (config.card.exigirProtecaoConteudo) {
        const ok = cards.some(entry => {
          const minWidth = entry.declarations.get('min-width');
          const overflowWrap = entry.declarations.get('overflow-wrap') || entry.declarations.get('word-break');
          return /^0(?:px|rem|em|%)?$/.test(minWidth || '') || /anywhere|break-word|break-all/.test(overflowWrap || '');
        });
        add('cardOverflow', ok, 'Proteção contra transbordamento ausente', 'Use min-width: 0 e/ou overflow-wrap para impedir que o conteúdo expanda o card.');
      }
    }

    if (config.espacamentosMinimos) {
      const properties = new Set();
      entries.forEach(entry => ['margin', 'margin-block', 'margin-inline', 'padding', 'padding-block', 'padding-inline', 'gap', 'row-gap', 'column-gap'].forEach(prop => {
        if (propertyPresent(entry, prop)) properties.add(prop);
      }));
      add('spacing', properties.size >= config.espacamentosMinimos, 'Poucos recursos de espaçamento', 'Aplique margin, padding e gap de forma consistente na interface.');
    }

    if (config.larguraResponsiva) {
      const ok = entries.some(entry => {
        const width = entry.declarations.get('width') || '';
        const maxWidth = entry.declarations.get('max-width') || '';
        const columns = entry.declarations.get('grid-template-columns') || '';
        return /min\(|max\(|%/.test(width) || maxWidth || /minmax|auto-fit|auto-fill/.test(columns);
      });
      add('responsiveWidth', ok, 'Largura responsiva não identificada', 'Use largura relativa, max-width ou colunas flexíveis para adaptar o painel.');
    }

    if (config.mediaQueriesMinimas) {
      const contexts = new Set(entries.map(entry => entry.selector.split('|').slice(0, -1).join('|')).filter(value => value.includes('@media')));
      add('media', contexts.size >= config.mediaQueriesMinimas, 'Media query ausente', 'Inclua uma media query para reorganizar a interface em telas menores.');
    }

    if (config.estadosInteracao) {
      const ok = entries.some(entry => /:hover|:focus-visible|\.selecionado|\.ativo/.test(selectorText(entry)));
      add('interaction', ok, 'Estado de interação ausente', 'Estilize ao menos um estado hover, focus-visible, selecionado ou ativo.');
    }

    return { parsed, checks };
  }

  function semanticCssDiagnostics(actual, exercise) {
    const metrics = semanticCssMetrics(actual, exercise);
    const issues = [...metrics.parsed.errors];
    metrics.checks.filter(check => !check.ok).forEach(check => issues.push({ title: check.title, detail: check.detail }));
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais do teclado nas regras CSS.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados antes dos seletores.' });
    return {
      ok: issues.length === 0,
      summary: issues[0]?.detail || 'Os conceitos de Box Model e organização dos cards foram reconhecidos.',
      issues,
      suggestions: [
        'Os valores, cores, unidades e a ordem das regras podem ser diferentes.',
        'Seletores equivalentes são aceitos quando atingem os elementos do exercício.',
        'Teste também em largura de celular para confirmar que o conteúdo não transborda.'
      ],
      firstLine: issues.find(item => item.line)?.line || null
    };
  }

  function semanticCssCompleteness(actual, exercise) {
    const metrics = semanticCssMetrics(actual, exercise);
    const total = Math.max(1, metrics.checks.length);
    const matched = metrics.checks.filter(check => check.ok).length;
    const syntaxOk = metrics.parsed.errors.length === 0;
    const percentage = Math.round((matched / total) * 100);
    const validation = semanticCssDiagnostics(actual, exercise);
    return validation.ok
      ? { percentage: 100, remaining: 0, status: 'Arquivo validado', state: 'correct', syntaxOk, message: 'O CSS atende aos conceitos exigidos no exercício.' }
      : { percentage, remaining: 100 - percentage, status: percentage < 35 ? 'Primeiros passos' : percentage < 75 ? 'Em desenvolvimento' : 'Quase pronto', state: percentage < 35 ? 'starting' : percentage < 75 ? 'building' : 'almost', syntaxOk, message: 'Acompanhamento baseado em Box Model, layout, espaçamento e responsividade.' };
  }


  function semanticFlexboxMetrics(actual, exercise) {
    const config = exercise?.validacao?.flexboxSemantico || {};
    const parsed = parseCss(actual);
    const entries = [...parsed.rules.entries()].map(([selector, declarations]) => ({ selector, declarations }));
    const checks = [];
    const add = (key, ok, title, detail) => checks.push({ key, ok: Boolean(ok), title, detail });
    const selectorText = entry => entry.selector.split('|').at(-1) || entry.selector;
    const matching = patterns => entries.filter(entry => (patterns || []).some(pattern => selectorText(entry).includes(pattern)));
    const hasAny = (entry, props) => props.some(prop => entry.declarations.has(prop));

    const barraConfig = config.barra || {};
    const barras = matching(barraConfig.seletores || ['.barra-ferramentas', '.toolbar']);
    const barraFlex = barras.filter(entry => entry.declarations.get('display') === 'flex');
    add('barraFlex', barraFlex.length > 0, 'Flexbox não identificado na barra', 'Use display: flex no contêiner principal da barra de ferramentas.');
    if (barraConfig.exigirJustifyContent) {
      add('justify', barraFlex.some(entry => entry.declarations.has('justify-content')), 'Distribuição horizontal ausente', 'Use justify-content para distribuir os grupos da barra.');
    }
    if (barraConfig.exigirAlignItems) {
      add('align', barraFlex.some(entry => entry.declarations.has('align-items')), 'Alinhamento vertical ausente', 'Use align-items para alinhar pesquisa e ações.');
    }
    if (barraConfig.exigirFlexWrap) {
      add('wrap', barraFlex.some(entry => /wrap/.test(entry.declarations.get('flex-wrap') || '')), 'Quebra controlada ausente', 'Use flex-wrap: wrap para permitir reorganização em telas menores.');
    }
    if (barraConfig.exigirGap) {
      add('barraGap', barraFlex.some(entry => hasAny(entry, ['gap', 'row-gap', 'column-gap'])), 'Espaçamento da barra ausente', 'Use gap, row-gap ou column-gap na barra de ferramentas.');
    }
    if (barraConfig.proibirPosicionamentoAbsoluto) {
      add('noAbsolute', !barras.some(entry => entry.declarations.get('position') === 'absolute'), 'Posicionamento absoluto indevido', 'Organize a barra com Flexbox, sem position: absolute no contêiner principal.');
    }

    const groupConfig = config.grupos || {};
    const groups = matching(groupConfig.seletores || ['.grupo-acoes', '.grupo-busca']);
    const flexGroups = groups.filter(entry => entry.declarations.get('display') === 'flex');
    add('groupsFlex', flexGroups.length >= (groupConfig.quantidadeMinima || 1), 'Grupos internos sem Flexbox', 'Use display: flex nos grupos de pesquisa e ações.');
    if (groupConfig.exigirGap) {
      add('groupsGap', flexGroups.some(entry => hasAny(entry, ['gap', 'row-gap', 'column-gap'])), 'Espaçamento interno ausente', 'Use gap também nos grupos internos da barra.');
    }

    if (config.crescimentoFlexivel) {
      const ok = entries.some(entry => {
        const flex = entry.declarations.get('flex') || '';
        return /\d|auto|basis/.test(flex) || entry.declarations.has('flex-grow') || entry.declarations.has('flex-basis') || entry.declarations.get('min-width') === '0';
      });
      add('flexGrowth', ok, 'Crescimento flexível não identificado', 'Use flex, flex-grow, flex-basis ou min-width: 0 para adaptar os grupos à largura disponível.');
    }

    if (config.controlesAcessiveis) {
      const controls = entries.filter(entry => /button|input|\.botao/.test(selectorText(entry)));
      const ok = controls.some(entry => hasAny(entry, ['min-height', 'height', 'padding', 'padding-block']));
      add('touchArea', ok, 'Área de interação não identificada', 'Defina min-height, height ou padding suficiente para botões e campos.');
    }

    if (config.mediaQueriesMinimas) {
      const contexts = new Set(entries.map(entry => entry.selector.split('|').slice(0, -1).join('|')).filter(value => value.includes('@media')));
      add('media', contexts.size >= config.mediaQueriesMinimas, 'Media query ausente', 'Inclua uma media query para reorganizar a barra em telas menores.');
    }

    if (config.estadosInteracao) {
      const ok = entries.some(entry => /:hover|:focus-visible|\.ativo/.test(selectorText(entry)));
      add('interaction', ok, 'Estado de interação ausente', 'Estilize hover, focus-visible ou o estado ativo dos controles.');
    }

    return { parsed, checks };
  }

  function semanticFlexboxDiagnostics(actual, exercise) {
    const metrics = semanticFlexboxMetrics(actual, exercise);
    const issues = [...metrics.parsed.errors];
    metrics.checks.filter(check => !check.ok).forEach(check => issues.push({ title: check.title, detail: check.detail }));
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais do teclado nas regras CSS.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados antes dos seletores.' });
    return {
      ok: issues.length === 0,
      summary: issues[0]?.detail || 'Flexbox, distribuição, quebra e responsividade foram reconhecidos.',
      issues,
      suggestions: [
        'Cores, unidades, valores e ordem das regras podem ser diferentes.',
        'A barra principal e os grupos de pesquisa e ações devem usar Flexbox.',
        'Reduza a largura do preview para verificar quebra controlada e ausência de transbordamento.'
      ],
      firstLine: issues.find(item => item.line)?.line || null
    };
  }

  function semanticFlexboxCompleteness(actual, exercise) {
    const metrics = semanticFlexboxMetrics(actual, exercise);
    const total = Math.max(1, metrics.checks.length);
    const matched = metrics.checks.filter(check => check.ok).length;
    const syntaxOk = metrics.parsed.errors.length === 0;
    const percentage = Math.round((matched / total) * 100);
    const validation = semanticFlexboxDiagnostics(actual, exercise);
    return validation.ok
      ? { percentage: 100, remaining: 0, status: 'Arquivo validado', state: 'correct', syntaxOk, message: 'O CSS atende aos conceitos de Flexbox exigidos.' }
      : { percentage, remaining: 100 - percentage, status: percentage < 35 ? 'Primeiros passos' : percentage < 75 ? 'Em desenvolvimento' : 'Quase pronto', state: percentage < 35 ? 'starting' : percentage < 75 ? 'building' : 'almost', syntaxOk, message: 'Acompanhamento baseado em Flexbox, distribuição, quebra, grupos e responsividade.' };
  }


  function semanticGridMetrics(actual, exercise) {
    const config = exercise?.validacao?.gridSemantico || {};
    const parsed = parseCss(actual);
    const entries = [...parsed.rules.entries()].map(([selector, declarations]) => ({ selector, declarations }));
    const checks = [];
    const add = (key, ok, title, detail) => checks.push({ key, ok: Boolean(ok), title, detail });
    const selectorText = entry => entry.selector.split('|').at(-1) || entry.selector;
    const matching = patterns => entries.filter(entry => (patterns || []).some(pattern => selectorText(entry).includes(pattern)));
    const hasAny = (entry, props) => props.some(prop => entry.declarations.has(prop));

    const mainConfig = config.principal || {};
    const mains = matching(mainConfig.seletores || ['.dashboard-grid', '.grade-dashboard']);
    const mainGrids = mains.filter(entry => entry.declarations.get('display') === 'grid' || entry.declarations.get('display') === 'inline-grid');
    add('mainGrid', mainGrids.length > 0, 'Grid principal não identificado', 'Use display: grid no contêiner principal do dashboard.');
    if (mainConfig.exigirColunas) {
      add('columns', mainGrids.some(entry => entry.declarations.has('grid-template-columns')), 'Colunas da grade ausentes', 'Defina grid-template-columns para organizar as regiões do painel.');
    }
    if (mainConfig.exigirGap) {
      add('gap', mainGrids.some(entry => hasAny(entry, ['gap', 'row-gap', 'column-gap'])), 'Espaçamento da grade ausente', 'Use gap, row-gap ou column-gap no dashboard.');
    }
    if (mainConfig.proibirPosicionamentoAbsoluto) {
      add('noAbsolute', !mains.some(entry => entry.declarations.get('position') === 'absolute'), 'Posicionamento absoluto indevido', 'Monte o dashboard com Grid, sem position: absolute no contêiner principal.');
    }

    if (config.dimensionamentoAvancado) {
      const values = mainGrids.map(entry => entry.declarations.get('grid-template-columns') || '').join(' ');
      add('advancedSizing', /minmax\(|repeat\(|auto-fit|auto-fill|\bfr\b/.test(values), 'Dimensionamento responsivo não identificado', 'Use minmax(), repeat(), auto-fit, auto-fill ou unidades fr nas colunas.');
    }

    const placementEntries = entries.filter(entry => hasAny(entry, ['grid-area', 'grid-column', 'grid-row', 'grid-column-start', 'grid-row-start']));
    const areaTemplate = mainGrids.some(entry => entry.declarations.has('grid-template-areas'));
    const requiredPlacements = config.posicionamentosMinimos || 1;
    add('placements', placementEntries.length >= requiredPlacements || (areaTemplate && placementEntries.length >= 3), 'Regiões sem posicionamento suficiente', 'Associe as regiões usando grid-area ou grid-column/grid-row.');

    const subgrids = entries.filter(entry => entry.declarations.get('display') === 'grid' && !mains.includes(entry));
    add('subgrids', subgrids.length >= (config.subgradesMinimas || 0), 'Subgrade não identificada', 'Use outra grade para os indicadores, gráfico ou lista quando necessário.');

    if (config.protecoesOverflow) {
      const ok = entries.some(entry => entry.declarations.get('min-width') === '0') && entries.some(entry => /auto|hidden/.test(entry.declarations.get('overflow-x') || ''));
      add('overflow', ok, 'Proteção contra transbordamento incompleta', 'Use min-width: 0 nas regiões e overflow-x: auto em conteúdo largo, como tabelas.');
    }

    if (config.mediaQueriesMinimas) {
      const contexts = new Set(entries.map(entry => entry.selector.split('|').slice(0, -1).join('|')).filter(value => value.includes('@media')));
      add('media', contexts.size >= config.mediaQueriesMinimas, 'Adaptação responsiva insuficiente', `Inclua pelo menos ${config.mediaQueriesMinimas} media queries para reorganizar o dashboard.`);
    }

    if (config.estadosInteracao) {
      const ok = entries.some(entry => /:hover|:focus-visible|\.ativo|\.compacto/.test(selectorText(entry)));
      add('interaction', ok, 'Estados de interação ausentes', 'Estilize foco, hover, período ativo ou modo compacto.');
    }

    return { parsed, checks };
  }

  function semanticGridDiagnostics(actual, exercise) {
    const metrics = semanticGridMetrics(actual, exercise);
    const issues = [...metrics.parsed.errors];
    metrics.checks.filter(check => !check.ok).forEach(check => issues.push({ title: check.title, detail: check.detail }));
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais do teclado nas regras CSS.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados antes dos seletores.' });
    return {
      ok: issues.length === 0,
      summary: issues[0]?.detail || 'Grid, áreas, dimensionamento e responsividade foram reconhecidos.',
      issues,
      suggestions: [
        'Cores, unidades, valores e ordem das regras podem ser diferentes.',
        'O dashboard principal deve usar Grid; Flexbox continua adequado dentro dos componentes.',
        'Teste tablet e celular para confirmar que as regiões não se sobrepõem.'
      ],
      firstLine: issues.find(item => item.line)?.line || null
    };
  }

  function semanticGridCompleteness(actual, exercise) {
    const metrics = semanticGridMetrics(actual, exercise);
    const total = Math.max(1, metrics.checks.length);
    const matched = metrics.checks.filter(check => check.ok).length;
    const percentage = Math.max(1, Math.min(99, Math.round((matched / total) * 100)));
    const validation = semanticGridDiagnostics(actual, exercise);
    return validation.ok
      ? { percentage: 100, remaining: 0, status: 'Arquivo validado', state: 'correct', syntaxOk: true, message: 'A grade atende aos requisitos conceituais do exercício.' }
      : { percentage, remaining: 100 - percentage, status: percentage < 35 ? 'Primeiros passos' : percentage < 75 ? 'Em desenvolvimento' : 'Quase pronto', state: percentage < 35 ? 'starting' : percentage < 75 ? 'building' : 'almost', syntaxOk: metrics.parsed.errors.length === 0, message: 'Acompanhamento baseado nos conceitos de CSS Grid e responsividade.' };
  }


  function tokenizeJavaScript(code, options = {}) {
    const input = removeBom(code);
    const tokens = [];
    const errors = [];
    const operators = ['===', '!==', '>>>', '**=', '=>', '==', '!=', '>=', '<=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '**', '?.', '??'];
    let index = 0;
    let line = 1;
    let column = 1;

    const advance = () => {
      const char = input[index];
      index += 1;
      if (char === '\n') { line += 1; column = 1; } else column += 1;
      return char;
    };

    while (index < input.length) {
      const char = input[index];
      if (/\s/.test(char)) { advance(); continue; }

      if (char === '/' && input[index + 1] === '/') {
        while (index < input.length && input[index] !== '\n') advance();
        continue;
      }
      if (char === '/' && input[index + 1] === '*') {
        const startLine = line;
        advance(); advance();
        let closed = false;
        while (index < input.length) {
          if (input[index] === '*' && input[index + 1] === '/') { advance(); advance(); closed = true; break; }
          advance();
        }
        if (!closed) errors.push({ title: 'Comentário não fechado', detail: 'Feche o comentário com */.', line: startLine });
        continue;
      }

      const start = index;
      const startLine = line;
      const startColumn = column;

      if (char === '"' || char === "'" || char === '`') {
        const quote = advance();
        let value = '';
        let closed = false;
        while (index < input.length) {
          const current = advance();
          if (current === '\\') {
            if (index < input.length) value += current + advance();
            continue;
          }
          if (current === quote) { closed = true; break; }
          value += current;
        }
        if (!closed) errors.push({ title: 'Texto não fechado', detail: `Feche a string iniciada com ${quote}.`, line: startLine });
        tokens.push({ type: 'string', value, raw: input.slice(start, index), line: startLine, column: startColumn });
        continue;
      }

      if (/[A-Za-z_$]/.test(char)) {
        let value = '';
        while (index < input.length && /[A-Za-z0-9_$]/.test(input[index])) value += advance();
        const normalized = (!options.strictDeclarations && /^(?:var|let|const)$/.test(value)) ? 'declaration' : value;
        tokens.push({ type: 'identifier', value: normalized, raw: value, line: startLine, column: startColumn });
        continue;
      }

      if (/\d/.test(char) || (char === '.' && /\d/.test(input[index + 1] || ''))) {
        let value = '';
        while (index < input.length && /[0-9A-Fa-fxXobOB._]/.test(input[index])) value += advance();
        tokens.push({ type: 'number', value: value.replaceAll('_', '').toLowerCase(), raw: value, line: startLine, column: startColumn });
        continue;
      }

      const operator = operators.find(item => input.startsWith(item, index));
      if (operator) {
        operator.split('').forEach(() => advance());
        tokens.push({ type: 'operator', value: operator, raw: operator, line: startLine, column: startColumn });
        continue;
      }

      const punctuation = advance();
      if (punctuation === ';') continue;
      tokens.push({ type: 'punctuation', value: punctuation, raw: punctuation, line: startLine, column: startColumn });
    }

    return { tokens, errors };
  }

  function findFunctions(code) {
    const names = new Set();
    const patterns = [
      /function\s+([A-Za-z_$][\w$]*)\s*\(/g,
      /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g
    ];
    patterns.forEach(pattern => [...String(code || '').matchAll(pattern)].forEach(match => names.add(match[1])));
    return [...names];
  }

  function findDomIds(code) {
    const ids = new Set();
    [...String(code || '').matchAll(/getElementById\s*\(\s*["']([^"']+)["']\s*\)/g)].forEach(match => ids.add(match[1]));
    [...String(code || '').matchAll(/querySelector\s*\(\s*["']#([^"']+)["']\s*\)/g)].forEach(match => ids.add(match[1]));
    return [...ids];
  }

  function checkJavaScriptSyntax(code) {
    try {
      // Apenas compila. O código não é executado nesta etapa.
      new Function(removeBom(code));
      return null;
    } catch (error) {
      const lineMatch = String(error.stack || error.message || '').match(/<anonymous>:(\d+):\d+/);
      const candidate = lineMatch ? Math.max(1, Number(lineMatch[1]) - 2) : null;
      const totalLines = removeBom(code).split('\n').length;
      const adjustedLine = candidate && candidate <= totalLines ? candidate : null;
      return { title: 'Erro de sintaxe', detail: error.message || 'O navegador não conseguiu interpretar o JavaScript.', line: adjustedLine };
    }
  }

  function jsDiagnostics(actual, expected, exercise) {
    const strictDeclarations = Boolean(exercise?.validacao?.strictDeclarations);
    const actualParsed = tokenizeJavaScript(actual, { strictDeclarations });
    const expectedParsed = tokenizeJavaScript(expected, { strictDeclarations });
    const issues = [...actualParsed.errors];
    const suggestions = [];
    const syntaxIssue = checkJavaScriptSyntax(actual);
    if (syntaxIssue) issues.unshift(syntaxIssue);

    if (hasSmartQuotes(actual)) {
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque “ ” ou ‘ ’ por aspas simples ou duplas normais do teclado.' });
    }
    if (hasPastedLineNumbers(actual)) {
      issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha que foram colados junto com o JavaScript.' });
    }

    const actualFunctions = new Set(findFunctions(actual));
    findFunctions(expected).forEach(name => {
      if (!actualFunctions.has(name)) issues.push({ title: `Função ${name}() não encontrada`, detail: `Confira o nome e a declaração da função ${name}().` });
    });

    const actualIds = new Set(findDomIds(actual));
    findDomIds(expected).forEach(id => {
      if (!actualIds.has(id)) issues.push({ title: `Elemento #${id} não acessado`, detail: `Revise o id usado em getElementById() ou querySelector().` });
    });

    const actualTokens = actualParsed.tokens;
    const expectedTokens = expectedParsed.tokens;
    let divergence = null;
    const total = Math.max(actualTokens.length, expectedTokens.length);
    for (let index = 0; index < total; index += 1) {
      const a = actualTokens[index];
      const e = expectedTokens[index];
      if (!a || !e || a.type !== e.type || a.value !== e.value) {
        divergence = { index, actual: a || null, expected: e || null };
        break;
      }
    }

    if (divergence && !syntaxIssue) {
      const actualToken = divergence.actual;
      const expectedToken = divergence.expected;
      let detail = 'A sequência de instruções ficou diferente do código necessário para esta etapa.';
      if (!actualToken && expectedToken) detail = `Falta uma parte próxima de ${JSON.stringify(expectedToken.raw)}.`;
      else if (actualToken && !expectedToken) detail = `Há código adicional começando em ${JSON.stringify(actualToken.raw)}.`;
      else if (actualToken && expectedToken) detail = `Foi encontrado ${JSON.stringify(actualToken.raw)}, mas a estrutura esperada nessa posição utiliza ${JSON.stringify(expectedToken.raw)}.`;
      issues.push({ title: 'Primeira divergência encontrada', detail, line: actualToken?.line || null });
    }

    suggestions.push('Espaços, indentação, quebras de linha, comentários, aspas simples ou duplas e ponto e vírgula opcional são aceitos.');
    suggestions.push('Confira nomes de funções, ids, operadores, parênteses, chaves e a ordem das instruções.');
    suggestions.push('Use o preview e o tutorial para testar cada parte antes de validar novamente.');

    return {
      ok: !syntaxIssue && actualParsed.errors.length === 0 && !divergence,
      summary: issues[0]?.detail || 'Estrutura JavaScript reconhecida.',
      issues,
      suggestions,
      firstLine: issues.find(item => item.line)?.line || divergence?.actual?.line || firstDifferentLine(actual, expected),
      divergence
    };
  }



  function semanticHtmlDiagnostics(actual, exercise, file = 'html') {
    const config = exercise?.validacao?.htmlSemanticoPorArquivo?.[file] || exercise?.validacao?.htmlSemantico || {};
    const issues = [];
    const suggestions = [];
    const parsed = parseHtml(actual);
    const doc = parsed.document;

    if (config.doctype && !/^\s*<!doctype\s+html/i.test(actual)) {
      issues.push({ title: 'DOCTYPE ausente', detail: 'Inclua <!DOCTYPE html> no início do documento.', line: 1 });
    }
    if (config.idioma && !/^pt(?:-br)?$/i.test(doc.documentElement.getAttribute('lang') || '')) {
      issues.push({ title: 'Idioma não identificado', detail: 'Defina lang="pt-BR" na tag html.' });
    }
    if (config.charset && !doc.querySelector('meta[charset]')) {
      issues.push({ title: 'Codificação ausente', detail: 'Inclua uma meta tag com charset="UTF-8".' });
    }
    if (config.viewport && !doc.querySelector('meta[name="viewport"]')) {
      issues.push({ title: 'Viewport ausente', detail: 'Inclua a meta viewport para adaptação em telas menores.' });
    }

    Object.entries(config.tagsMinimas || {}).forEach(([tag, minimum]) => {
      const count = doc.querySelectorAll(tag).length;
      if (count < minimum) issues.push({ title: `Faltam elementos <${tag}>`, detail: `Use pelo menos ${minimum} elemento(s) <${tag}>. Foram encontrados ${count}.` });
    });
    Object.entries(config.tagsExatas || {}).forEach(([tag, expected]) => {
      const count = doc.querySelectorAll(tag).length;
      if (count !== expected) issues.push({ title: `Quantidade de <${tag}>`, detail: `Use exatamente ${expected} elemento(s) <${tag}>. Foram encontrados ${count}.` });
    });

    (config.relacoes || []).forEach(rule => {
      const count = doc.querySelectorAll(`${rule.pai} ${rule.filho}`).length;
      if (count < rule.minimo) issues.push({ title: `Organização de <${rule.filho}>`, detail: `${rule.descricao}.` });
    });

    if (config.linksInternos) {
      const validLinks = [...doc.querySelectorAll('nav a[href^="#"]')].filter(link => {
        const href = link.getAttribute('href');
        return href && href.length > 1 && doc.getElementById(href.slice(1));
      });
      if (validLinks.length < config.linksInternos) {
        issues.push({ title: 'Navegação interna incompleta', detail: `Crie pelo menos ${config.linksInternos} links no nav apontando para IDs existentes na página.` });
      }
    }

    if (config.artigoComTitulo) {
      [...doc.querySelectorAll('article')].forEach((article, index) => {
        if (!article.querySelector('h2,h3,h4,h5,h6')) issues.push({ title: `Chamado ${index + 1} sem título`, detail: 'Cada article precisa de um título próprio.' });
        if (!article.querySelector('p')) issues.push({ title: `Chamado ${index + 1} sem descrição`, detail: 'Cada article precisa de pelo menos um parágrafo.' });
      });
    }

    const navConfig = config.navegacaoMultipagina;
    if (navConfig) {
      const normalizePath = value => String(value || '').trim().replace(/\\/g, '/').replace(/^\.\//, '').split('#')[0].split('?')[0];
      const links = [...doc.querySelectorAll('a[href]')];
      const hrefs = links.map(link => normalizePath(link.getAttribute('href')));
      const navigationLinks = [...doc.querySelectorAll('nav a[href]')];
      if (navigationLinks.length < (navConfig.linksMinimos || 0)) {
        issues.push({ title: 'Menu incompleto', detail: `Inclua pelo menos ${navConfig.linksMinimos} links dentro do nav. Foram encontrados ${navigationLinks.length}.` });
      }
      (navConfig.linksObrigatorios || []).forEach(group => {
        const alternatives = Array.isArray(group) ? group : [group];
        const found = alternatives.some(option => hrefs.includes(normalizePath(option)));
        if (!found) issues.push({ title: 'Destino relativo ausente', detail: `Inclua um link para ${alternatives.join(' ou ')}.` });
      });
      if (navConfig.proibirCaminhosAbsolutos) {
        links.forEach(link => {
          const raw = String(link.getAttribute('href') || '').trim();
          if (/^(?:file:|[A-Za-z]:[\\/]|\\\\|\/)/i.test(raw)) {
            issues.push({ title: 'Caminho absoluto local', detail: `Troque ${raw} por um caminho relativo que funcione em qualquer computador.` });
          }
        });
        [...doc.querySelectorAll('link[href],script[src]')].forEach(element => {
          const raw = String(element.getAttribute(element.tagName === 'LINK' ? 'href' : 'src') || '').trim();
          if (/^(?:file:|[A-Za-z]:[\\/]|\\\\|\/)/i.test(raw)) issues.push({ title: 'Recurso com caminho absoluto', detail: `Troque ${raw} por um caminho relativo.` });
        });
      }
      if (navConfig.ariaCurrent) {
        const current = doc.querySelectorAll('nav a[aria-current="page"]');
        if (current.length !== 1) issues.push({ title: 'Página atual não identificada', detail: 'Use aria-current="page" em exatamente um link do menu.' });
      }
      const pageTitle = (doc.querySelector('title')?.textContent || '').trim().toLowerCase();
      const titleTerms = navConfig.termosTitulo || [];
      if (!pageTitle || (titleTerms.length && !titleTerms.some(term => pageTitle.includes(String(term).toLowerCase())))) {
        issues.push({ title: 'Título da página inadequado', detail: `Use um title próprio que identifique esta página${titleTerms.length ? `, contendo ${titleTerms.join(' ou ')}` : ''}.` });
      }
      if (navConfig.stylesheetObrigatorio?.length) {
        const values=[...doc.querySelectorAll('link[rel~="stylesheet"][href]')].map(item=>normalizePath(item.getAttribute('href')));
        if (!navConfig.stylesheetObrigatorio.some(value=>values.includes(normalizePath(value)))) issues.push({ title:'Caminho do CSS incorreto', detail:`Ligue o stylesheet usando ${navConfig.stylesheetObrigatorio.join(' ou ')}.` });
      }
      if (navConfig.scriptObrigatorio?.length) {
        const values=[...doc.querySelectorAll('script[src]')].map(item=>normalizePath(item.getAttribute('src')));
        if (!navConfig.scriptObrigatorio.some(value=>values.includes(normalizePath(value)))) issues.push({ title:'Caminho do JavaScript incorreto', detail:`Ligue o script usando ${navConfig.scriptObrigatorio.join(' ou ')}.` });
      }
    }

    if (config.hierarquiaTitulos) {
      const headings = [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      let previous = 0;
      headings.forEach(heading => {
        const level = Number(heading.tagName.slice(1));
        if (previous && level > previous + 1) {
          issues.push({ title: 'Nível de título pulado', detail: `A hierarquia passou de h${previous} para h${level}. Organize os títulos sem saltar níveis.` });
        }
        previous = level;
      });
    }

    if (config.idsUnicos) {
      const seen = new Set();
      [...doc.querySelectorAll('[id]')].forEach(element => {
        if (seen.has(element.id)) issues.push({ title: `ID repetido: ${element.id}`, detail: 'Cada id deve identificar apenas um elemento.' });
        seen.add(element.id);
      });
    }



    const formConfig = config.formularioAcessivel;
    if (formConfig) {
      const controls = [...doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]), select, textarea')];
      const labels = [...doc.querySelectorAll('label')];
      const labelFor = new Set(labels.map(label => label.getAttribute('for')).filter(Boolean));
      const hasAccessibleName = control => {
        const explicit = control.id && labelFor.has(control.id);
        const wrapped = Boolean(control.closest('label'));
        const aria = Boolean(control.getAttribute('aria-label') || control.getAttribute('aria-labelledby'));
        return explicit || wrapped || aria;
      };

      if (controls.length < (formConfig.controlesMinimos || 0)) {
        issues.push({ title: 'Poucos campos no formulário', detail: `Crie pelo menos ${formConfig.controlesMinimos} controles de entrada. Foram encontrados ${controls.length}.` });
      }

      labels.forEach(label => {
        const target = label.getAttribute('for');
        if (target && !doc.getElementById(target)) {
          issues.push({ title: `Rótulo sem campo: ${target}`, detail: `O atributo for="${target}" precisa apontar para o id de um campo existente.` });
        }
      });

      if (formConfig.labelsAssociados) {
        controls.forEach((control, index) => {
          if (!hasAccessibleName(control)) {
            const identifier = control.id ? `#${control.id}` : control.name ? `[name="${control.name}"]` : `${control.tagName.toLowerCase()} ${index + 1}`;
            issues.push({ title: `Campo ${identifier} sem rótulo associado`, detail: 'Associe um label com for e id, envolva o campo com label ou forneça um nome acessível por aria-label/aria-labelledby.' });
          }
        });
      }

      Object.entries(formConfig.tiposInputMinimos || {}).forEach(([type, minimum]) => {
        const count = doc.querySelectorAll(`input[type="${type}"]`).length;
        if (count < minimum) issues.push({ title: `Tipo de campo ${type} ausente`, detail: `Use pelo menos ${minimum} input com type="${type}". Foram encontrados ${count}.` });
      });

      const selectCount = doc.querySelectorAll('select').length;
      if (selectCount < (formConfig.selectsMinimos || 0)) {
        issues.push({ title: 'Listas de seleção incompletas', detail: `Use pelo menos ${formConfig.selectsMinimos} elementos select. Foram encontrados ${selectCount}.` });
      }

      const requiredCount = controls.filter(control => control.hasAttribute('required')).length;
      if (requiredCount < (formConfig.camposObrigatoriosMinimos || 0)) {
        issues.push({ title: 'Campos obrigatórios incompletos', detail: `Marque pelo menos ${formConfig.camposObrigatoriosMinimos} controles com required. Foram encontrados ${requiredCount}.` });
      }

      const autocompleteCount = controls.filter(control => {
        const value = (control.getAttribute('autocomplete') || '').trim().toLowerCase();
        return value && value !== 'off';
      }).length;
      if (autocompleteCount < (formConfig.autocompletesMinimos || 0)) {
        issues.push({ title: 'Autocomplete insuficiente', detail: `Use autocomplete em pelo menos ${formConfig.autocompletesMinimos} campos adequados. Foram encontrados ${autocompleteCount}.` });
      }

      const fieldsetsWithLegend = [...doc.querySelectorAll('fieldset')].filter(fieldset => fieldset.querySelector(':scope > legend')).length;
      if (fieldsetsWithLegend < (formConfig.fieldsetsComLegend || 0)) {
        issues.push({ title: 'Grupos sem legenda', detail: `Use pelo menos ${formConfig.fieldsetsComLegend} fieldsets com legend como primeiro título do grupo. Foram encontrados ${fieldsetsWithLegend}.` });
      }

      if (formConfig.botaoSubmit && !doc.querySelector('button[type="submit"], input[type="submit"]')) {
        issues.push({ title: 'Botão de envio ausente', detail: 'Inclua um button ou input com type="submit".' });
      }

      if (formConfig.nomesObrigatorios) {
        controls.forEach((control, index) => {
          if (!control.getAttribute('name')) {
            const identifier = control.id ? `#${control.id}` : `${control.tagName.toLowerCase()} ${index + 1}`;
            issues.push({ title: `Campo ${identifier} sem name`, detail: 'Cada controle que será enviado pelo formulário precisa de um atributo name.' });
          }
        });
      }

      if (formConfig.tabindexPositivoProibido) {
        const positive = [...doc.querySelectorAll('[tabindex]')].filter(element => Number(element.getAttribute('tabindex')) > 0);
        if (positive.length) issues.push({ title: 'Ordem de teclado forçada', detail: 'Remova valores positivos de tabindex e preserve a ordem natural dos elementos no documento.' });
      }
    }



    const tableConfig = config.tabelaAcessivel;
    if (tableConfig) {
      const tables = [...doc.querySelectorAll('table')];
      if (tables.length < (tableConfig.tabelasMinimas || 0)) {
        issues.push({ title: 'Tabela ausente', detail: `Crie pelo menos ${tableConfig.tabelasMinimas} tabela(s). Foram encontradas ${tables.length}.` });
      }
      const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
      tables.forEach((table, tableIndex) => {
        const prefix = tables.length > 1 ? `Tabela ${tableIndex + 1}: ` : '';
        const caption = table.querySelector(':scope > caption');
        if (tableConfig.captionObrigatorio && (!caption || !caption.textContent.trim())) {
          issues.push({ title: `${prefix}caption ausente`, detail: 'Inclua um caption com uma descrição clara do conjunto de dados.' });
        }
        const headers = [...table.querySelectorAll('thead th')];
        if (headers.length < (tableConfig.cabecalhosMinimos || 0)) {
          issues.push({ title: `${prefix}cabeçalhos incompletos`, detail: `Use pelo menos ${tableConfig.cabecalhosMinimos} células th dentro do thead. Foram encontradas ${headers.length}.` });
        }
        const scoped = headers.filter(header => normalize(header.getAttribute('scope')) === 'col');
        if (scoped.length < (tableConfig.scopeColMinimo || 0)) {
          issues.push({ title: `${prefix}scope das colunas incompleto`, detail: `Use scope="col" em pelo menos ${tableConfig.scopeColMinimo} cabeçalhos. Foram encontrados ${scoped.length}.` });
        }
        const rows = [...table.querySelectorAll('tbody tr')];
        if (rows.length < (tableConfig.linhasCorpoMinimas || 0)) {
          issues.push({ title: `${prefix}poucos registros`, detail: `Inclua pelo menos ${tableConfig.linhasCorpoMinimas} linhas dentro do tbody. Foram encontradas ${rows.length}.` });
        }
        rows.forEach((row, rowIndex) => {
          const cellCount = row.querySelectorAll('td').length;
          if (cellCount < (tableConfig.celulasPorLinhaMinimas || 0)) {
            issues.push({ title: `${prefix}registro ${rowIndex + 1} incompleto`, detail: `Cada linha precisa de pelo menos ${tableConfig.celulasPorLinhaMinimas} células td. Foram encontradas ${cellCount}.` });
          }
        });
        if (tableConfig.colunaStatus) {
          const patterns = (tableConfig.padroesCabecalhoStatus || ['status','situacao','estado']).map(normalize);
          const statusIndex = headers.findIndex(header => patterns.some(pattern => normalize(header.textContent).includes(pattern)));
          if (statusIndex < 0) {
            issues.push({ title: `${prefix}coluna de situação não identificada`, detail: 'Crie um cabeçalho de coluna com texto como Status, Situação ou Estado.' });
          } else if (tableConfig.statusTextual) {
            rows.forEach((row, rowIndex) => {
              const cell = row.querySelectorAll('td')[statusIndex];
              const value = cell?.textContent.trim() || '';
              if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value)) {
                issues.push({ title: `${prefix}status do registro ${rowIndex + 1} sem texto`, detail: 'Escreva a situação dentro da célula; não use somente cor, classe ou ícone.' });
              }
            });
          }
        }
      });
    }
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados junto com o código.' });

    if (config.tabelaAcessivel) {
      suggestions.push('Os registros, nomes, datas, prioridades e textos podem ser diferentes quando a estrutura tabular continua correta.');
      suggestions.push('Confira caption, thead, tbody, th com scope="col" e a mesma quantidade mínima de células nas linhas.');
      suggestions.push('Escreva a situação em texto visível; cor, classe e ícone podem complementar, mas não substituir a informação.');
    } else if (config.formularioAcessivel) {
      suggestions.push('Os textos, opções, ids, espaços, indentação e ordem dos atributos podem ser diferentes quando as associações continuam corretas.');
      suggestions.push('Confira se todo campo possui um label associado e se for e id usam exatamente o mesmo valor.');
      suggestions.push('Use fieldset e legend para os grupos, tipos de input coerentes, required, name e autocomplete nos campos adequados.');
    } else {
      suggestions.push('Os textos, exemplos de chamados, espaços, indentação e ordem dos atributos podem ser diferentes.');
      suggestions.push('Concentre-se na função de cada região: cabeçalho, navegação, conteúdo principal, seções, artigos e rodapé.');
      suggestions.push('Mantenha um único h1 e use h2 e h3 conforme a organização do conteúdo.');
    }
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Estrutura semântica reconhecida.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }

  function semanticHtmlCompleteness(actual, exercise, file = 'html') {
    const config = exercise?.validacao?.htmlSemanticoPorArquivo?.[file] || exercise?.validacao?.htmlSemantico || {};
    const doc = parseHtml(actual).document;
    let total = 0;
    let matched = 0;
    const metric = condition => { total += 1; if (condition) matched += 1; };
    if (config.doctype) metric(/^\s*<!doctype\s+html/i.test(actual));
    if (config.idioma) metric(/^pt(?:-br)?$/i.test(doc.documentElement.getAttribute('lang') || ''));
    if (config.charset) metric(Boolean(doc.querySelector('meta[charset]')));
    if (config.viewport) metric(Boolean(doc.querySelector('meta[name="viewport"]')));
    Object.entries(config.tagsMinimas || {}).forEach(([tag, minimum]) => metric(doc.querySelectorAll(tag).length >= minimum));
    Object.entries(config.tagsExatas || {}).forEach(([tag, expected]) => metric(doc.querySelectorAll(tag).length === expected));
    (config.relacoes || []).forEach(rule => metric(doc.querySelectorAll(`${rule.pai} ${rule.filho}`).length >= rule.minimo));
    if (config.linksInternos) metric([...doc.querySelectorAll('nav a[href^="#"]')].filter(link => doc.getElementById((link.getAttribute('href') || '').slice(1))).length >= config.linksInternos);

    const formConfig = config.formularioAcessivel;
    if (formConfig) {
      const controls = [...doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]), select, textarea')];
      const labelFor = new Set([...doc.querySelectorAll('label[for]')].map(label => label.getAttribute('for')).filter(Boolean));
      const hasAccessibleName = control => Boolean((control.id && labelFor.has(control.id)) || control.closest('label') || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby'));
      metric(controls.length >= (formConfig.controlesMinimos || 0));
      if (formConfig.labelsAssociados) metric(controls.length > 0 && controls.every(hasAccessibleName));
      Object.entries(formConfig.tiposInputMinimos || {}).forEach(([type, minimum]) => metric(doc.querySelectorAll(`input[type="${type}"]`).length >= minimum));
      metric(doc.querySelectorAll('select').length >= (formConfig.selectsMinimos || 0));
      metric(controls.filter(control => control.hasAttribute('required')).length >= (formConfig.camposObrigatoriosMinimos || 0));
      metric(controls.filter(control => { const value=(control.getAttribute('autocomplete') || '').trim().toLowerCase(); return value && value !== 'off'; }).length >= (formConfig.autocompletesMinimos || 0));
      metric([...doc.querySelectorAll('fieldset')].filter(fieldset => fieldset.querySelector(':scope > legend')).length >= (formConfig.fieldsetsComLegend || 0));
      if (formConfig.botaoSubmit) metric(Boolean(doc.querySelector('button[type="submit"], input[type="submit"]')));
      if (formConfig.nomesObrigatorios) metric(controls.length > 0 && controls.every(control => Boolean(control.getAttribute('name'))));
      if (formConfig.tabindexPositivoProibido) metric(![...doc.querySelectorAll('[tabindex]')].some(element => Number(element.getAttribute('tabindex')) > 0));
    }



    const navConfig = config.navegacaoMultipagina;
    if (navConfig) {
      const normalizePath = value => String(value || '').trim().replace(/\\/g, '/').replace(/^\.\//, '').split('#')[0].split('?')[0];
      const hrefs=[...doc.querySelectorAll('a[href]')].map(item=>normalizePath(item.getAttribute('href')));
      metric(doc.querySelectorAll('nav a[href]').length >= (navConfig.linksMinimos || 0));
      (navConfig.linksObrigatorios || []).forEach(group => {
        const alternatives=Array.isArray(group)?group:[group];
        metric(alternatives.some(option=>hrefs.includes(normalizePath(option))));
      });
      if (navConfig.ariaCurrent) metric(doc.querySelectorAll('nav a[aria-current="page"]').length === 1);
      const pageTitle=(doc.querySelector('title')?.textContent || '').trim().toLowerCase();
      metric(Boolean(pageTitle) && (!(navConfig.termosTitulo || []).length || navConfig.termosTitulo.some(term=>pageTitle.includes(String(term).toLowerCase()))));
      if (navConfig.stylesheetObrigatorio?.length) {
        const values=[...doc.querySelectorAll('link[rel~="stylesheet"][href]')].map(item=>normalizePath(item.getAttribute('href')));
        metric(navConfig.stylesheetObrigatorio.some(value=>values.includes(normalizePath(value))));
      }
      if (navConfig.scriptObrigatorio?.length) {
        const values=[...doc.querySelectorAll('script[src]')].map(item=>normalizePath(item.getAttribute('src')));
        metric(navConfig.scriptObrigatorio.some(value=>values.includes(normalizePath(value))));
      }
    }

    const tableConfig = config.tabelaAcessivel;
    if (tableConfig) {
      const tables = [...doc.querySelectorAll('table')];
      const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
      metric(tables.length >= (tableConfig.tabelasMinimas || 0));
      tables.forEach(table => {
        const caption = table.querySelector(':scope > caption');
        if (tableConfig.captionObrigatorio) metric(Boolean(caption && caption.textContent.trim()));
        const headers = [...table.querySelectorAll('thead th')];
        metric(headers.length >= (tableConfig.cabecalhosMinimos || 0));
        metric(headers.filter(header => normalize(header.getAttribute('scope')) === 'col').length >= (tableConfig.scopeColMinimo || 0));
        const rows = [...table.querySelectorAll('tbody tr')];
        metric(rows.length >= (tableConfig.linhasCorpoMinimas || 0));
        metric(rows.length > 0 && rows.every(row => row.querySelectorAll('td').length >= (tableConfig.celulasPorLinhaMinimas || 0)));
        if (tableConfig.colunaStatus) {
          const patterns = (tableConfig.padroesCabecalhoStatus || ['status','situacao','estado']).map(normalize);
          const statusIndex = headers.findIndex(header => patterns.some(pattern => normalize(header.textContent).includes(pattern)));
          metric(statusIndex >= 0);
          if (statusIndex >= 0 && tableConfig.statusTextual) metric(rows.length > 0 && rows.every(row => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(row.querySelectorAll('td')[statusIndex]?.textContent.trim() || '')));
        }
      });
    }
    const percentage = Math.max(1, Math.min(99, Math.round((matched / Math.max(1, total)) * 100)));
    const validation = semanticHtmlDiagnostics(actual, exercise, file);
    return validation.ok
      ? { percentage: 100, remaining: 0, status: 'Arquivo validado', state: 'correct', syntaxOk: true, message: 'A estrutura semântica atende aos requisitos do exercício.' }
      : { percentage, remaining: 100 - percentage, status: percentage < 35 ? 'Primeiros passos' : percentage < 75 ? 'Em desenvolvimento' : 'Quase pronto', state: percentage < 35 ? 'starting' : percentage < 75 ? 'building' : 'almost', syntaxOk: true, message: 'Acompanhamento baseado nos elementos semânticos e nas relações exigidas.' };
  }

  function validateCode(file, actual, expected, exercise) {
    const cleanActual = removeBom(actual);
    const cleanExpected = removeBom(expected);
    if (!cleanActual.trim()) {
      return {
        ok: false,
        summary: 'Digite o código antes de validar.',
        issues: [{ title: 'Arquivo vazio', detail: 'O editor ainda não possui código.' }],
        suggestions: ['Volte ao tutorial, veja o código completo e comece a digitar.'],
        firstLine: 1
      };
    }
    if (String(file || '').toLowerCase().startsWith('html') && exercise?.validacao?.tipo === 'html-semantico') return semanticHtmlDiagnostics(cleanActual, exercise, file);
    if (String(file || '').toLowerCase().startsWith('html')) return htmlDiagnostics(cleanActual, cleanExpected);
    if (file === 'css' && exercise?.validacao?.tipo === 'css-semantico') return semanticCssDiagnostics(cleanActual, exercise);
    if (file === 'css' && exercise?.validacao?.tipo === 'css-flexbox') return semanticFlexboxDiagnostics(cleanActual, exercise);
    if (file === 'css' && exercise?.validacao?.tipo === 'css-grid') return semanticGridDiagnostics(cleanActual, exercise);
    if (file === 'css') return cssDiagnostics(cleanActual, cleanExpected);
    return jsDiagnostics(cleanActual, cleanExpected, exercise);
  }


  function analyzeCompleteness(file, actual, expected, exercise) {
    const cleanActual = removeBom(actual);
    const cleanExpected = removeBom(expected);
    if (!cleanActual.trim()) return { percentage: 0, remaining: 100, status: 'Ainda não começou', state: 'empty', message: 'Comece a digitar para acompanhar o avanço do arquivo.', syntaxOk: true };
    if (String(file || '').toLowerCase().startsWith('html') && exercise?.validacao?.tipo === 'html-semantico') return semanticHtmlCompleteness(cleanActual, exercise, file);

    let matched = 0;
    let total = 1;
    let syntaxOk = true;
    let detail = '';

    if (String(file || '').toLowerCase().startsWith('html')) {
      const a = parseHtml(cleanActual).document;
      const e = parseHtml(cleanExpected).document;
      const expectedIds = [...e.querySelectorAll('[id]')];
      const expectedRefs = [...e.querySelectorAll('link[href],script[src]')];
      const expectedTags = [...e.querySelectorAll('body *')].map(node => node.tagName.toLowerCase());
      total = 1 + expectedIds.length * 3 + expectedRefs.length * 2 + expectedTags.length;
      if (/^\s*<!doctype\s+html/i.test(cleanActual)) matched += 1;
      expectedIds.forEach(node => {
        const found = a.getElementById(node.id);
        if (found) matched += 2;
        if (found?.tagName === node.tagName) matched += 1;
      });
      expectedRefs.forEach(node => {
        const attr = node.tagName === 'LINK' ? 'href' : 'src';
        const value = node.getAttribute(attr);
        if ([...a.querySelectorAll(`${node.tagName.toLowerCase()}[${attr}]`)].some(item => item.getAttribute(attr) === value)) matched += 2;
      });
      const actualTags = [...a.querySelectorAll('body *')].map(node => node.tagName.toLowerCase());
      const remainingTags = [...actualTags];
      expectedTags.forEach(tag => { const index = remainingTags.indexOf(tag); if (index >= 0) { matched += 1; remainingTags.splice(index, 1); } });
      detail = 'Elementos da página, identificadores e ligação dos arquivos.';
    } else if (file === 'css' && exercise?.validacao?.tipo === 'css-semantico') {
      return semanticCssCompleteness(cleanActual, exercise);
    } else if (file === 'css' && exercise?.validacao?.tipo === 'css-flexbox') {
      return semanticFlexboxCompleteness(cleanActual, exercise);
    } else if (file === 'css' && exercise?.validacao?.tipo === 'css-grid') {
      return semanticGridCompleteness(cleanActual, exercise);
    } else if (file === 'css') {
      const a = parseCss(cleanActual);
      const e = parseCss(cleanExpected);
      syntaxOk = a.errors.length === 0;
      total = 0;
      e.rules.forEach((declarations, selector) => {
        total += 1 + declarations.size;
        const actualDeclarations = a.rules.get(selector);
        if (actualDeclarations) {
          matched += 1;
          declarations.forEach((value, property) => {
            if (actualDeclarations.get(property) === value) matched += 1;
            else if (actualDeclarations.has(property)) matched += .45;
          });
        }
      });
      total = Math.max(1, total);
      detail = 'Seletores, estilos e valores do CSS.';
    } else {
      const strictDeclarations = Boolean(exercise?.validacao?.strictDeclarations);
      const a = tokenizeJavaScript(cleanActual, { strictDeclarations });
      const e = tokenizeJavaScript(cleanExpected, { strictDeclarations });
      syntaxOk = !checkJavaScriptSyntax(cleanActual) && a.errors.length === 0;
      const expectedTokens = e.tokens.filter(token => ![';', ','].includes(token.value));
      const actualTokens = a.tokens.filter(token => ![';', ','].includes(token.value));
      total = Math.max(1, expectedTokens.length);
      let cursor = 0;
      expectedTokens.forEach(expectedToken => {
        const index = actualTokens.findIndex((actualToken, actualIndex) => actualIndex >= cursor && actualToken.type === expectedToken.type && actualToken.value === expectedToken.value);
        if (index >= 0) { matched += 1; cursor = index + 1; }
      });
      const expectedFunctions = findFunctions(cleanExpected);
      const actualFunctions = new Set(findFunctions(cleanActual));
      expectedFunctions.forEach(name => { total += 3; if (actualFunctions.has(name)) matched += 3; });
      const expectedIds = findDomIds(cleanExpected);
      const actualIds = new Set(findDomIds(cleanActual));
      expectedIds.forEach(id => { total += 2; if (actualIds.has(id)) matched += 2; });
      detail = 'Comandos, funções, elementos da página e sequência lógica.';
    }

    let percentage = Math.max(1, Math.min(99, Math.round(matched / Math.max(1, total) * 100)));
    if (!syntaxOk) percentage = Math.min(percentage, 88);
    const validation = validateCode(file, cleanActual, cleanExpected, exercise);
    if (validation.ok) percentage = 100;
    let status = 'Em desenvolvimento';
    let state = 'building';
    if (!syntaxOk) { status = 'Revise a sintaxe'; state = 'error'; }
    else if (percentage < 35) { status = 'Primeiros passos'; state = 'starting'; }
    else if (percentage < 75) { status = 'Em desenvolvimento'; state = 'building'; }
    else if (percentage < 95) { status = 'Quase pronto'; state = 'almost'; }
    else if (percentage < 100) { status = 'Pronto para conferir'; state = 'review'; }
    else { status = 'Arquivo validado'; state = 'correct'; }
    return { percentage, remaining: 100 - percentage, status, state, syntaxOk, message: `${detail} ${percentage === 100 ? 'O arquivo parece completo. Faça a validação final.' : `Ainda há partes do exercício para concluir.`}` };
  }

  function selectedLines(code, range) {
    if (!range) return String(code || '');
    return String(code || '').split('\n').slice(range[0] - 1, range[1]).join('\n');
  }

  function validSelector(selector) {
    try {
      document.createDocumentFragment().querySelector(selector);
      return true;
    } catch (error) {
      return false;
    }
  }

  function inferPreviewTargets(exercise, file, range) {
    const code = selectedLines(exercise.arquivos[file], range);
    const selectors = new Set();
    const functions = [];

    if (String(file || '').toLowerCase().startsWith('html')) {
      [...code.matchAll(/id=["']([^"']+)["']/g)].forEach(match => selectors.add(`#${match[1]}`));
      [...code.matchAll(/class=["']([^"']+)["']/g)].forEach(match => {
        match[1].split(/\s+/).filter(Boolean).forEach(className => selectors.add(`.${className}`));
      });
      [...code.matchAll(/<\s*(h1|h2|h3|p|button|input|label|main|section|article|form|ul|ol|li)\b/gi)]
        .forEach(match => selectors.add(match[1].toLowerCase()));
    }

    if (file === 'css') {
      [...code.matchAll(/([^{}]+)\{/g)].forEach(match => {
        match[1].split(',').map(item => item.trim()).filter(Boolean).forEach(selector => {
          if (validSelector(selector)) selectors.add(selector);
        });
      });
    }

    if (file === 'js') {
      [...code.matchAll(/getElementById\(["']([^"']+)["']\)/g)].forEach(match => selectors.add(`#${match[1]}`));
      [...code.matchAll(/querySelector\(["']([^"']+)["']\)/g)].forEach(match => selectors.add(match[1]));
      [...code.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)].forEach(match => functions.push(match[1]));
      functions.forEach(name => selectors.add(`[onclick*="${name}"]`));
    }

    if (!selectors.size) selectors.add('body');
    return { selectors: [...selectors].filter(validSelector).slice(0, 8), functions: [...new Set(functions)] };
  }

  function cleanHtmlForPreview(html) {
    return String(html || '')
      .replace(/<link\b[^>]*href=["'][^"']+["'][^>]*>/gi, '')
      .replace(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, '');
  }

  function buildPreviewDocument(exercise, options = {}) {
    const file = options.file || 'html';
    const range = options.range || null;
    const tutorial = options.tutorial !== false;
    const targets = inferPreviewTargets(exercise, file, range);
    const css = exercise.arquivos.css || '';
    const js = exercise.arquivos.js || '';
    const htmlKey = String(file || '').toLowerCase().startsWith('html') ? file : 'html';
    let html = cleanHtmlForPreview(exercise.arquivos[htmlKey] || exercise.arquivos.html || '<!DOCTYPE html><html><head></head><body></body></html>');

    const markerStyle = tutorial ? `
      <style id="__tutorial_style">
        .__tutorial_target {
          outline: 4px solid #7c5cff !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 0 9px rgba(124,92,255,.22), 0 0 30px rgba(124,92,255,.5) !important;
          animation: __tutorialPulse 1.25s ease-in-out infinite alternate !important;
          position: relative;
          z-index: 2147483000 !important;
        }
        @keyframes __tutorialPulse { from { filter: brightness(1); } to { filter: brightness(1.18); } }
        #__tutorial_badge {
          position: fixed; top: 10px; right: 10px; z-index: 2147483647;
          padding: 8px 12px; border-radius: 999px; background: #151025; color: white;
          border: 2px solid #8d73ff; font: 700 12px/1.2 Arial, sans-serif;
          box-shadow: 0 8px 24px rgba(0,0,0,.3);
        }
      </style>` : '';

    const markerScript = tutorial ? `
      <script>
        window.addEventListener('DOMContentLoaded', function () {
          var selectors = ${JSON.stringify(targets.selectors)};
          selectors.forEach(function (selector) {
            try {
              document.querySelectorAll(selector).forEach(function (element) {
                if (element !== document.body) element.classList.add('__tutorial_target');
              });
            } catch (error) {}
          });
          var badge = document.createElement('div');
          badge.id = '__tutorial_badge';
          badge.textContent = 'Resultado relacionado ao trecho';
          document.body.appendChild(badge);
        });
      <\/script>` : '';

    if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>${css}</style>${markerStyle}</head>`);
    } else {
      html = `<style>${css}</style>${markerStyle}${html}`;
    }

    if (html.includes('</body>')) {
      html = html.replace('</body>', `<script>${js.replaceAll('</script>', '<\\/script>')}<\/script>${markerScript}</body>`);
    } else {
      html += `<script>${js.replaceAll('</script>', '<\\/script>')}<\/script>${markerScript}`;
    }

    const navigationGuard = `<script>
      (function () {
        function report(type, detail) {
          parent.postMessage({ channel: 'ds3-preview', type: type, detail: String(detail || '') }, '*');
        }
        window.addEventListener('error', function (event) { report('error', event.message || 'Erro JavaScript no preview.'); });
        window.addEventListener('unhandledrejection', function (event) { report('error', event.reason || 'Promise rejeitada no preview.'); });
        window.addEventListener('message', function (event) {
          var data = event.data || {};
          if (data.channel !== 'ds3-preview' || data.type !== 'run-function') return;
          var fn = window[data.name];
          if (typeof fn === 'function') {
            try { fn(); report('action', 'Função ' + data.name + '() executada.'); }
            catch (error) { report('error', error && error.message ? error.message : error); }
          } else report('error', 'A função solicitada não está disponível.');
        });
        document.addEventListener('DOMContentLoaded', function () { report('ready', 'Preview carregado.'); });
        document.addEventListener('click', function (event) {
          var link = event.target.closest && event.target.closest('a[href]');
          if (!link) return;
          var href = link.getAttribute('href') || '';
          if (href && !href.startsWith('#')) {
            event.preventDefault();
            link.setAttribute('data-preview-visited', 'true');
            link.style.outline = '3px solid #67d4ff';
            report('navigation-blocked', href);
          }
        });
      })();
    <\/script>`;
    if (html.includes('</body>')) html = html.replace('</body>', navigationGuard + '</body>');
    else html += navigationGuard;

    return { srcdoc: html, functions: targets.functions, selectors: targets.selectors };
  }

  function extractTerms(exercise) {
    const allCode = Object.values(exercise.arquivos || {}).join('\n');
    const found = [];
    Object.entries(GLOSSARY).forEach(([term, data]) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = /^[A-Za-z_$]/.test(term)
        ? new RegExp(`\\b${escaped}\\b`)
        : new RegExp(escaped);
      if (regex.test(allCode)) found.push({ termo: term, ...data });
    });
    return found;
  }

  function glossaryHtml(exercise) {
    const terms = extractTerms(exercise);
    if (!terms.length) return '<p>Nenhum termo especial foi identificado neste exercício.</p>';
    return `<div class="glossary-grid">${terms.map(item => `
      <article class="glossary-item">
        <div><code>${escapeHtml(item.termo)}</code><span>${escapeHtml(item.tipo)}</span></div>
        <p>${escapeHtml(item.definicao)}</p>
      </article>`).join('')}</div>`;
  }

  function contextHtml(exercise) {
    return `
      <div class="drawer-section"><span class="chip">${escapeHtml(exercise.tema)}</span><h3>${escapeHtml(exercise.titulo)}</h3><p>${escapeHtml(exercise.objetivo)}</p></div>
      <div class="drawer-section"><h3>Conhecimentos retomados</h3><div class="chips">${exercise.retomadas.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div></div>
      <div class="drawer-section"><h3>Conteúdos novos</h3><div class="chips">${exercise.novos.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div></div>`;
  }

  function tipsHtml(exercise, teacher = false) {
    const general = [
      'Confira se os nomes dos arquivos correspondem aos nomes usados no HTML.',
      'Mantenha a indentação para enxergar melhor quais linhas pertencem ao mesmo bloco.',
      'Teste uma alteração por vez e observe o preview antes de continuar.',
      'Verifique se IDs, nomes de funções, aspas, chaves e parênteses estão iguais ao exemplo.'
    ];
    const extra = teacher ? [...(exercise.professor?.notas || []), ...(exercise.professor?.erros || []).map(item => `Erro frequente: ${item}`)] : [];
    return `<ul class="drawer-list">${[...general, ...extra].map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function markdownInline(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  }

  function markdownToPreview(markdown) {
    const lines = removeBom(markdown).split('\n');
    const output = [];
    let paragraph = [];
    let listType = '';

    const flushParagraph = () => {
      if (!paragraph.length) return;
      output.push(`<p>${paragraph.map(markdownInline).join('<br>')}</p>`);
      paragraph = [];
    };
    const closeList = () => {
      if (!listType) return;
      output.push(`</${listType}>`);
      listType = '';
    };
    const openList = type => {
      if (listType === type) return;
      closeList();
      flushParagraph();
      listType = type;
      output.push(`<${type}>`);
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) { flushParagraph(); closeList(); return; }
      const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph(); closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${markdownInline(heading[2])}</h${level}>`);
        return;
      }
      const unordered = trimmed.match(/^[-*]\s+(.+)$/);
      if (unordered) { openList('ul'); output.push(`<li>${markdownInline(unordered[1])}</li>`); return; }
      const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
      if (ordered) { openList('ol'); output.push(`<li>${markdownInline(ordered[1])}</li>`); return; }
      if (listType) closeList();
      paragraph.push(trimmed);
    });
    flushParagraph();
    closeList();
    return output.join('');
  }

  return {
    escapeHtml,
    highlight,
    renderCode,
    toast,
    copy,
    download,
    downloadBlob,
    zipStore,
    normalizeGithubUrl,
    getGithub,
    setGithub,
    openGithub,
    openClassroom,
    configureGithub,
    normalizar,
    validateCode,
    analyzeCompleteness,
    buildPreviewDocument,
    inferPreviewTargets,
    extractTerms,
    glossaryHtml,
    contextHtml,
    tipsHtml,
    markdownToPreview
  };
})();

window.Utils = (() => {
  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  const GLOSSARY = {
    '=>': { tipo: 'Sintaxe de função', definicao: 'Identifica uma arrow function e separa parâmetros do corpo.' },
    throw: { tipo: 'Palavra reservada', definicao: 'Lança um erro e interrompe o fluxo normal.' },
    catch: { tipo: 'Tratamento de erro', definicao: 'Recebe erros lançados ou rejeições de uma Promise.' },
    finally: { tipo: 'Finalização', definicao: 'Executa ao final de uma Promise em sucesso ou falha.' },
    Promise: { tipo: 'Objeto assíncrono', definicao: 'Representa um resultado que será concluído no futuro.' },
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
    // As aspas duplas são convertidas apenas para a camada visual.
    // Isso permite colorir strings/atributos sem alterar o conteúdo real do textarea.
    let code = escapeHtml(raw).replaceAll('\"', '&quot;');
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
    } else if (lang === 'python') {
      code = code.replace(/(#.*$)/gm, '<span class="tok-comment">$1</span>');
      code = code.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-string">$1</span>');
      code = code.replace(/\b(def|return|if|else|elif|for|while|in|True|False|None|import|from|as|class|try|except|finally|raise|lambda)\b/g, '<span class="tok-keyword">$1</span>');
      code = code.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>');
      code = code.replace(/\b([A-Za-z_][\w]*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');
    } else {
      code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
      code = code.replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');
      code = code.replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span class="tok-string">$1</span>');
      code = code.replace(/\b(function|let|const|var|if|else|return|true|false|null|new|for|while|async|await|try|catch|finally|throw)\b/g, '<span class="tok-keyword">$1</span>');
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

  function download(name, content, type = 'text/plain') {
    downloadBlob(name, new Blob([content], { type }));
  }



const memoryStorage = new Map();

function storageGet(key) {
  try { return window.localStorage.getItem(key); }
  catch (error) { return memoryStorage.has(key) ? memoryStorage.get(key) : null; }
}

function storageSet(key, value) {
  try { window.localStorage.setItem(key, String(value)); return true; }
  catch (error) { memoryStorage.set(key, String(value)); return false; }
}

function storageRemove(key) {
  try { window.localStorage.removeItem(key); }
  catch (error) { memoryStorage.delete(key); }
}

function storageAvailable() {
  const testKey = '__ds2_storage_test__';
  try {
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) { return false; }
}

function downloadBlob(name, blob) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = name;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  setTimeout(() => { URL.revokeObjectURL(anchor.href); anchor.remove(); }, 1000);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function concatBytes(parts) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  parts.forEach(part => { output.set(part, offset); offset += part.length; });
  return output;
}

function zipHeader(size) { return new Uint8Array(size); }
function put16(view, offset, value) { view.setUint16(offset, value, true); }
function put32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }

function createZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const stamp = dosDateTime();

  files.forEach(file => {
    const name = encoder.encode(String(file.name).replace(/^\/+/, ''));
    const data = encoder.encode(String(file.content ?? ''));
    const crc = crc32(data);

    const local = zipHeader(30);
    const lv = new DataView(local.buffer);
    put32(lv, 0, 0x04034b50); put16(lv, 4, 20); put16(lv, 6, 0x0800); put16(lv, 8, 0);
    put16(lv, 10, stamp.time); put16(lv, 12, stamp.date); put32(lv, 14, crc);
    put32(lv, 18, data.length); put32(lv, 22, data.length); put16(lv, 26, name.length); put16(lv, 28, 0);
    localParts.push(local, name, data);

    const central = zipHeader(46);
    const cv = new DataView(central.buffer);
    put32(cv, 0, 0x02014b50); put16(cv, 4, 20); put16(cv, 6, 20); put16(cv, 8, 0x0800); put16(cv, 10, 0);
    put16(cv, 12, stamp.time); put16(cv, 14, stamp.date); put32(cv, 16, crc);
    put32(cv, 20, data.length); put32(cv, 24, data.length); put16(cv, 28, name.length);
    put16(cv, 30, 0); put16(cv, 32, 0); put16(cv, 34, 0); put16(cv, 36, 0); put32(cv, 38, 0); put32(cv, 42, offset);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  });

  const centralBytes = concatBytes(centralParts);
  const end = zipHeader(22);
  const ev = new DataView(end.buffer);
  put32(ev, 0, 0x06054b50); put16(ev, 4, 0); put16(ev, 6, 0);
  put16(ev, 8, files.length); put16(ev, 10, files.length);
  put32(ev, 12, centralBytes.length); put32(ev, 16, offset); put16(ev, 20, 0);
  return new Blob([...localParts, centralBytes, end], { type: 'application/zip' });
}

function downloadZip(name, files) { downloadBlob(name, createZip(files)); }

function buildStarterCode(file, exercise) {
  if (exercise?.codigoBase?.[file]) return exercise.codigoBase[file];
  const expected = String(exercise?.arquivos?.[file] || '');
  if (file === 'html') {
    const title = expected.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || exercise?.titulo || 'Exercício';
    const cssName = exercise?.nomesArquivos?.css || 'estilo.css';
    const jsName = exercise?.nomesArquivos?.js || 'script.js';
    return `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${title}</title>\n    <link rel="stylesheet" href="${cssName}">\n</head>\n<body>\n    <!-- Construa aqui os elementos explicados no tutorial. -->\n\n    <script src="${jsName}"><\/script>\n</body>\n</html>\n`;
  }
  if (file === 'css') {
    const selectors = [];
    const regex = /(?:^|\n)\s*([^@\n{}][^{}]*?)\s*\{/g;
    let match;
    while ((match = regex.exec(expected))) {
      const selector = match[1].trim();
      if (selector && selector.length < 120 && !selectors.includes(selector)) selectors.push(selector);
    }
    const chosen = selectors.slice(0, 14);
    if (!chosen.length) return '/* Digite aqui os estilos explicados no tutorial. */\n';
    return chosen.map(selector => `${selector} {\n    /* Digite as propriedades desta parte. */\n}`).join('\n\n') + '\n';
  }
  return '// Digite aqui o JavaScript explicado no tutorial.\n';
}


function projectNamespace() {
  return String(window.APP_CONFIG?.storageNamespace || window.APP_CONFIG?.name || '2ds-frontend')
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '2ds-frontend';
}

function currentUserName() {
  return window.AppAuth?.currentUser?.()?.username || 'sem-usuario';
}

function githubStorageKey() {
  return `ds2_${projectNamespace()}_${currentUserName()}_github_url_v2`;
}

function normalizeGithubUrl(value, requireRepository = true) {
  let input = String(value || '').trim();
  if (!input) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(input)) input = `https://${input}`;
  let parsed;
  try { parsed = new URL(input); } catch (error) { return null; }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (parsed.protocol !== 'https:' || host !== 'github.com' || parsed.username || parsed.password) return null;
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (requireRepository && parts.length < 2) return null;
  parsed.protocol = 'https:';
  parsed.hostname = 'github.com';
  parsed.port = '';
  parsed.search = '';
  parsed.hash = '';
  parsed.pathname = '/' + parts.slice(0, requireRepository ? 2 : parts.length).join('/');
  return parsed.toString().replace(/\/$/, '');
}

function getGithub() {
  const scoped = storageGet(githubStorageKey());
  if (scoped && normalizeGithubUrl(scoped)) return normalizeGithubUrl(scoped);
  const legacy = storageGet('dsGithubUrl');
  const migrated = normalizeGithubUrl(legacy);
  if (migrated) {
    storageSet(`ds2_${projectNamespace()}_legacy_unassigned_github_url`, migrated);
    storageRemove('dsGithubUrl');
  }
  return null;
}

function setGithub(url) {
  const normalized = normalizeGithubUrl(url);
  if (!normalized) return false;
  storageSet(githubStorageKey(), normalized);
  return true;
}

function openExternal(url) {
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (popup) popup.opener = null;
}

function openGithub() {
  const configured = getGithub();
  if (!configured) {
    toast('Configure primeiro o endereço completo do seu repositório no GitHub.');
    configureGithub();
    return;
  }
  openExternal(configured);
}

function openClassroom() {
  const url = String(window.APP_CONFIG?.classroomUrl || 'https://classroom.google.com/');
  let parsed;
  try { parsed = new URL(url); } catch (error) { toast('O link do Classroom está inválido.'); return; }
  if (parsed.protocol !== 'https:' || !/(^|\.)classroom\.google\.com$/i.test(parsed.hostname)) {
    toast('O link do Classroom foi bloqueado por segurança.');
    return;
  }
  openExternal(parsed.toString());
}

function configureGithub() {
  const current = getGithub() || '';
  const url = prompt('Cole o endereço completo do repositório atividades-praticas no GitHub:', current);
  if (url === null) return;
  if (!setGithub(url)) {
    toast('Endereço inválido. Use https://github.com/usuario/repositorio.');
    return;
  }
  toast('Repositório configurado para este usuário e esta disciplina.');
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

    const actualIds = [...actualDoc.querySelectorAll('[id]')].map(element => element.id).filter(Boolean);
    const duplicateIds = [...new Set(actualIds.filter((id, index) => actualIds.indexOf(id) !== index))];
    duplicateIds.forEach(id => issues.push({ title: `ID duplicado: #${id}`, detail: `O id="${id}" aparece mais de uma vez. IDs devem ser únicos na página.` }));

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

    const importantAttributes = ['onclick', 'type', 'for', 'lang', 'charset', 'name'];
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


const essentialTags = ['main','form','input','button','select','textarea'];
essentialTags.forEach(tag => {
  const expectedCount = expectedDoc.querySelectorAll(tag).length;
  const actualCount = actualDoc.querySelectorAll(tag).length;
  if (expectedCount && actualCount < expectedCount) {
    issues.push({ title: `Elemento funcional <${tag}> ausente`, detail: `A atividade precisa de ${expectedCount} elemento(s) <${tag}>; foram encontrados ${actualCount}.` });
  }
});

    if (hasSmartQuotes(actual) && !hasSmartQuotes(expected)) {
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque “ ” ou ‘ ’ por aspas normais do teclado: " " ou \' \'.' });
    }
    if (hasPastedLineNumbers(actual)) {
      issues.unshift({ title: 'Números de linha no código', detail: 'Parece que os números exibidos ao lado do código foram colados no editor. Remova-os.' });
    }

    suggestions.push('Confira a abertura e o fechamento das tags.');
    suggestions.push('Revise ids, nomes dos arquivos e atributos usados nos botões e campos.');
    suggestions.push('Espaços, indentação, quebras de linha e ordem dos atributos não impedem a validação.');

    return {
      ok: issues.length === 0,
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
    return String(value || '')
      .trim()
      .replace(/(["'])(.*?)\1/g, (_, quote, text) => JSON.stringify(text))
      .replace(/\s*([,:/()])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .replace(/(^|\s)0(?:px|rem|em|%|vh|vw)(?=\s|$)/gi, '$10')
      .toLowerCase();
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
        const structuralProperties = new Set([
          'display','position','flex-direction','flex-wrap','justify-content','align-items','align-content',
          'grid-template-columns','grid-template-rows','grid-template-areas','grid-area','overflow','overflow-x','overflow-y','object-fit'
        ]);
        const strictValues = Boolean(window.__currentValidationExercise?.validacao?.strictCssValues);
        if ((strictValues || structuralProperties.has(property)) && actualValue !== expectedValue) {
          issues.push({ title: `Valor divergente em ${selector.replaceAll("|", " -> ")}`, detail: `Revise o valor estrutural da propriedade ${property}.` });
        }
      });
    });

    if (hasSmartQuotes(actual) && !hasSmartQuotes(expected)) {
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


function jsSemanticProfile(code) {
  const parsed = tokenizeJavaScript(code, { strictDeclarations: false });
  const fixed = new Set([
    'function','if','else','for','while','return','true','false','null','new','async','await','try','catch','finally','throw',
    'document','window','console','localStorage','JSON','fetch','Number','String','Math','Date','Array','Object','Promise','confirm','prompt','alert',
    'getElementById','querySelector','querySelectorAll','addEventListener','createElement','appendChild','append','classList','innerText','textContent','innerHTML','value','checked','style','length','push','splice','forEach','map','filter','find','reduce','trim','toFixed','focus','setItem','getItem','removeItem','stringify','parse'
  ]);
  const normalized = parsed.tokens.map((token, index, tokens) => {
    if (token.type === 'string') return 'STRING';
    if (token.type === 'number') return 'NUMBER';
    if (token.type !== 'identifier') {
      if (token.value === '=>') return 'FUNCTION_FORM';
      return `${token.type}:${token.value}`;
    }
    const raw = token.raw || token.value;
    if (raw === 'function') return 'FUNCTION_FORM';
    const previous = tokens[index - 1];
    const property = previous?.value === '.' || previous?.value === '?.';
    if (fixed.has(raw) || property) return `fixed:${raw}`;
    return 'IDENTIFIER';
  });
  const methods = new Set();
  [...String(code || '').matchAll(/\.\s*([A-Za-z_$][\w$]*)/g)].forEach(match => methods.add(match[1]));
  const objectKeys = new Set();
  [...String(code || '').matchAll(/(?:\{|,)\s*([A-Za-z_$][\w$]*)\s*:/g)].forEach(match => objectKeys.add(match[1]));
  const eventTypes = new Set();
  [...String(code || '').matchAll(/addEventListener\s*\(\s*["']([^"']+)["']/g)].forEach(match => eventTypes.add(match[1]));
  const operators = new Set(parsed.tokens.filter(token => token.type === 'operator').map(token => token.value));
  const functionCount = (String(code || '').match(/\bfunction\b|=>/g) || []).length;
  return { parsed, normalized, methods, objectKeys, eventTypes, operators, functionCount };
}

function multisetCoverage(actual, expected) {
  const counts = new Map();
  actual.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));
  let matched = 0;
  expected.forEach(item => {
    const available = counts.get(item) || 0;
    if (available > 0) { matched += 1; counts.set(item, available - 1); }
  });
  return expected.length ? matched / expected.length : 1;
}

function jsDiagnostics(actual, expected, exercise) {
  const issues = [];
  const suggestions = [];
  const syntaxIssue = checkJavaScriptSyntax(actual);
  const actualProfile = jsSemanticProfile(actual);
  const expectedProfile = jsSemanticProfile(expected);
  if (syntaxIssue) issues.push(syntaxIssue);
  issues.push(...actualProfile.parsed.errors);

  if (hasSmartQuotes(actual) && !hasSmartQuotes(expected)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas simples, duplas ou crases normais do teclado.' });
  if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados junto com o JavaScript.' });

  const actualIds = new Set(findDomIds(actual));
  findDomIds(expected).forEach(id => {
    if (!actualIds.has(id)) issues.push({ title: `Elemento #${id} não acessado`, detail: `Revise o id usado em getElementById() ou querySelector().` });
  });

  const htmlHandlers = new Set();
  [...String(exercise?.arquivos?.html || '').matchAll(/(?:^|\s)on[a-z]+\s*=\s*["']\s*([A-Za-z_$][\w$]*)/gi)].forEach(match => htmlHandlers.add(match[1]));
  const requiredFunctions = new Set([...(exercise?.validacao?.requiredFunctions || []), ...htmlHandlers]);
  const actualFunctions = new Set(findFunctions(actual));
  requiredFunctions.forEach(name => {
    if (!actualFunctions.has(name)) issues.push({ title: `Função ${name}() não encontrada`, detail: `Essa função é chamada pelo HTML ou foi marcada como obrigatória.` });
  });

  const methodEquivalents = {
    innerText: ['innerText', 'textContent'],
    textContent: ['textContent', 'innerText'],
    appendChild: ['appendChild', 'append'],
    append: ['append', 'appendChild']
  };
  expectedProfile.methods.forEach(name => {
    const alternatives = Object.prototype.hasOwnProperty.call(methodEquivalents, name) ? methodEquivalents[name] : [name];
    if (!alternatives.some(candidate => actualProfile.methods.has(candidate))) {
      issues.push({ title: `Método ou propriedade .${name} ausente`, detail: `O comportamento do exercício utiliza .${name} ou uma forma equivalente.` });
    }
  });
  expectedProfile.objectKeys.forEach(name => {
    if (!actualProfile.objectKeys.has(name)) issues.push({ title: `Propriedade ${name} ausente`, detail: `Inclua a propriedade ${name} no objeto correspondente.` });
  });
  expectedProfile.eventTypes.forEach(name => {
    if (!actualProfile.eventTypes.has(name)) issues.push({ title: `Evento ${name} ausente`, detail: `Registre o evento ${name} conforme a atividade.` });
  });
  expectedProfile.operators.forEach(operator => {
    if (!actualProfile.operators.has(operator)) issues.push({ title: `Operador ${operator} ausente`, detail: `A lógica de referência utiliza o operador ${operator}.` });
  });
  if (actualProfile.functionCount < expectedProfile.functionCount) {
    issues.push({ title: 'Quantidade de funções insuficiente', detail: `A atividade utiliza pelo menos ${expectedProfile.functionCount} função(ões) ou callback(s).` });
  }

  const coverage = multisetCoverage(actualProfile.normalized, expectedProfile.normalized);
  const minimumCoverage = Number(exercise?.validacao?.minimumSemanticCoverage ?? 0.72);
  if (coverage < minimumCoverage && !syntaxIssue) {
    issues.push({ title: 'Implementação ainda incompleta', detail: `Foram reconhecidos ${Math.round(coverage * 100)}% dos elementos semânticos necessários. Continue implementando a lógica.`, line: firstDifferentLine(actual, expected) });
  }

  suggestions.push('Nomes de variáveis, espaços, indentação, comentários, aspas válidas e ponto e vírgula opcional podem ser diferentes.');
  suggestions.push('Funções tradicionais e arrow functions equivalentes são aceitas, exceto quando a forma da função é o próprio conteúdo avaliado.');
  suggestions.push('IDs, eventos, métodos, propriedades e operações essenciais precisam existir e funcionar.');

  return {
    ok: issues.length === 0,
    summary: issues[0]?.detail || 'Estrutura e recursos JavaScript reconhecidos.',
    issues,
    suggestions,
    firstLine: issues.find(item => item.line)?.line || firstDifferentLine(actual, expected),
    coverage
  };
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
    if (file === 'html') return htmlDiagnostics(cleanActual, cleanExpected);
    if (file === 'css') { window.__currentValidationExercise = exercise; const result = cssDiagnostics(cleanActual, cleanExpected); window.__currentValidationExercise = null; return result; }
    return jsDiagnostics(cleanActual, cleanExpected, exercise);
  }


  function analyzeCompleteness(file, actual, expected, exercise) {
    const cleanActual = removeBom(actual);
    const cleanExpected = removeBom(expected);
    if (!cleanActual.trim()) return { percentage: 0, remaining: 100, status: 'Ainda não começou', state: 'empty', message: 'Comece a digitar para acompanhar o avanço do arquivo.', syntaxOk: true };

    let matched = 0;
    let total = 1;
    let syntaxOk = true;
    let detail = '';

    if (file === 'html') {
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

    if (file === 'html') {
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
  const source = String(html || '<!DOCTYPE html><html><head></head><body></body></html>');
  const documentParsed = new DOMParser().parseFromString(source, 'text/html');
  documentParsed.querySelectorAll('script[src],link[rel~="stylesheet"],base,meta[http-equiv="refresh" i]').forEach(element => element.remove());
  return `<!DOCTYPE html>
${documentParsed.documentElement.outerHTML}`;
}

function escapeInlineScript(value) { return String(value || '').replace(/<\/script/gi, '<\\/script'); }
function escapeInlineStyle(value) { return String(value || '').replace(/<\/style/gi, '<\\/style'); }
function previewSecurityMeta() {
  return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; connect-src https://viacep.com.br; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">`;
}


function previewBridgeScript(runId) {
  const safeId = JSON.stringify(String(runId || 'preview'));
  return `<script>(function(){
    var RUN_ID=${safeId};
    (function(){var memory={};try{localStorage.getItem('__ds2_test__');}catch(error){try{Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:function(key){return Object.prototype.hasOwnProperty.call(memory,key)?memory[key]:null;},setItem:function(key,value){memory[key]=String(value);},removeItem:function(key){delete memory[key];},clear:function(){memory={};}}});}catch(polyfillError){}}})();
    function send(type,payload){try{parent.postMessage(Object.assign({source:'ds2-preview',runId:RUN_ID,type:type},payload||{}),'*');}catch(error){}}
    function printable(value){try{if(typeof value==='string')return value;if(value instanceof Error)return value.name+': '+value.message;return JSON.stringify(value);}catch(error){return String(value);}}
    ['log','info','warn','error'].forEach(function(level){var original=console[level];console[level]=function(){var args=[].slice.call(arguments);send('console',{level:level,args:args.map(printable)});try{return original.apply(console,args);}catch(error){}};});
    function snapshot(){var text={},value={};document.querySelectorAll('[id]').forEach(function(el){var id=String(el.id||'');if(!id)return;text[id]=String(el.textContent||'').trim().slice(0,500);if(/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)&&String(el.type||'').toLowerCase()!=='password')value[id]=String(el.value||'').slice(0,300);});return {text:text,value:value};}
['click','input','change','submit','keydown','mouseenter','mouseleave'].forEach(function(name){document.addEventListener(name,function(event){var target=event.target||{};setTimeout(function(){send('interaction',{event:name,tag:String(target.tagName||'').toLowerCase(),id:String(target.id||''),name:String(target.name||''),key:name==='keydown'?String(event.key||''):'',targetText:String(target.textContent||'').trim().slice(0,120),snapshot:snapshot()});},0);},true);});
    window.addEventListener('error',function(event){send('error',{message:event.message||'Erro JavaScript',line:event.lineno||null,column:event.colno||null});});
    window.addEventListener('unhandledrejection',function(event){var reason=event.reason;send('error',{message:reason&&reason.message?reason.message:String(reason||'Promise rejeitada')});});
    window.addEventListener('message',function(event){var data=event.data||{};if(event.source!==parent||data.source!=='ds2-platform'||data.runId!==RUN_ID)return;if(data.type==='run-function'){try{var fn=window[data.name];if(typeof fn!=='function')throw new Error('Função não encontrada no preview.');var result=fn();send('run-result',{ok:true,name:data.name,result:String(result??'')});}catch(error){send('run-result',{ok:false,name:data.name,message:error.message||String(error)});}}});
    window.addEventListener('DOMContentLoaded',function(){send('ready');});
  })();<\/script>`;
}

function buildCodePreviewDocument(files, options = {}) {
  const runId = String(options.runId || `preview-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  let html = cleanHtmlForPreview(files?.html || '<!DOCTYPE html><html><head></head><body><p style="font-family:Arial;padding:20px">O preview aparecerá conforme o HTML for construído.</p></body></html>');
  const css = escapeInlineStyle(files?.css || '');
  const js = escapeInlineScript(files?.js || '');
  const bridge = previewBridgeScript(runId);
  const security = previewSecurityMeta();
  const headClose = /<\/head\s*>/i;
  const bodyClose = /<\/body\s*>/i;
  if (headClose.test(html)) html = html.replace(headClose, `${security}<style>${css}</style>${bridge}</head>`);
  else html = `${security}${bridge}<style>${css}</style>${html}`;
  if (bodyClose.test(html)) html = html.replace(bodyClose, `<script>${js}<\/script></body>`);
  else html += `<script>${js}<\/script>`;
  return { srcdoc: html, runId };
}

function buildPreviewDocument(exercise, options = {}) {
  const file = options.file || 'html';
  const range = options.range || null;
  const tutorial = options.tutorial !== false;
  const targets = inferPreviewTargets(exercise, file, range);
  const runId = String(options.runId || `tutorial-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const css = escapeInlineStyle(exercise.arquivos.css || '');
  const js = escapeInlineScript(exercise.arquivos.js || '');
  let html = cleanHtmlForPreview(exercise.arquivos.html || '<!DOCTYPE html><html><head></head><body></body></html>');

  const markerStyle = tutorial ? `
    <style id="__tutorial_style">
      .__tutorial_target { outline:4px solid #7c5cff !important; outline-offset:4px !important; box-shadow:0 0 0 9px rgba(124,92,255,.22),0 0 30px rgba(124,92,255,.5) !important; animation:__tutorialPulse 1.25s ease-in-out infinite alternate !important; position:relative; z-index:2147483000 !important; }
      @keyframes __tutorialPulse { from { filter:brightness(1); } to { filter:brightness(1.18); } }
      #__tutorial_badge { position:fixed; top:10px; right:10px; z-index:2147483647; padding:8px 12px; border-radius:999px; background:#151025; color:white; border:2px solid #8d73ff; font:700 12px/1.2 Arial,sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.3); }
    </style>` : '';
  const markerScript = tutorial ? `<script>window.addEventListener('DOMContentLoaded',function(){var selectors=${JSON.stringify(targets.selectors)};selectors.forEach(function(selector){try{document.querySelectorAll(selector).forEach(function(element){if(element!==document.body)element.classList.add('__tutorial_target');});}catch(error){}});var badge=document.createElement('div');badge.id='__tutorial_badge';badge.textContent='Resultado relacionado ao trecho';document.body.appendChild(badge);});<\/script>` : '';
  const bridge = previewBridgeScript(runId);
  const security = previewSecurityMeta();
  const headClose = /<\/head\s*>/i;
  const bodyClose = /<\/body\s*>/i;
  if (headClose.test(html)) html = html.replace(headClose, `${security}<style>${css}</style>${markerStyle}${bridge}</head>`);
  else html = `${security}${bridge}<style>${css}</style>${markerStyle}${html}`;
  if (bodyClose.test(html)) html = html.replace(bodyClose, `<script>${js}<\/script>${markerScript}</body>`);
  else html += `<script>${js}<\/script>${markerScript}`;
  return { srcdoc: html, functions: targets.functions, selectors: targets.selectors, runId };
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
    const automatic = extractTerms(exercise);
    const custom = exercise.glossarioExtra || [];
    const map = new Map();
    [...automatic, ...custom].forEach(item => map.set(String(item.termo).toLowerCase(), item));
    const terms = [...map.values()];
    if (!terms.length) return '<p>Nenhum termo especial foi identificado neste exercício.</p>';
    return `<div class="drawer-section drawer-callout"><h3>Como usar o glossário</h3><p>Consulte os termos enquanto lê o código. Compare o nome, o tipo do recurso e a função que ele cumpre neste exercício.</p></div><div class="glossary-grid">${terms.map(item => `
      <article class="glossary-item">
        <div><code>${escapeHtml(item.termo)}</code><span>${escapeHtml(item.tipo)}</span></div>
        <p>${escapeHtml(item.definicao)}</p>
      </article>`).join('')}</div>`;
  }

  function listSection(title, items) {
    if (!items || !items.length) return '';
    return `<div class="drawer-section"><h3>${escapeHtml(title)}</h3><ul class="drawer-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`;
  }

  function comparisonHtml(items) {
    if (!items || !items.length) return '';
    return `<div class="drawer-section"><h3>Comparações de código</h3><div class="comparison-grid">${items.map(item => `<article><h4>${escapeHtml(item.titulo)}</h4><pre><code>${escapeHtml(item.codigo)}</code></pre><p>${escapeHtml(item.explicacao)}</p></article>`).join('')}</div></div>`;
  }

  function contextHtml(exercise) {
    return `
      <div class="drawer-section drawer-callout"><h3>Como usar esta gaveta</h3><p>Revise o objetivo, entenda a aplicação prática e acompanhe o fluxo antes de começar ou sempre que precisar retomar a atividade.</p></div>
      <div class="drawer-section"><span class="chip">${escapeHtml(exercise.tema)}</span><h3>${escapeHtml(exercise.titulo)}</h3><p>${escapeHtml(exercise.objetivo)}</p></div>
      ${listSection('Contexto detalhado', exercise.contextoDetalhado)}
      ${listSection('Fluxo de aprendizagem', exercise.fluxoAprendizagem)}
      <div class="drawer-section"><h3>Conhecimentos retomados</h3><div class="chips">${exercise.retomadas.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div></div>
      <div class="drawer-section"><h3>Conteúdos novos</h3><div class="chips">${exercise.novos.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div></div>
      ${comparisonHtml(exercise.comparacoes)}`;
  }

  function tipsHtml(exercise, teacher = false) {
    const general = [
      'Confira se os nomes dos arquivos correspondem aos nomes usados no HTML.',
      'Mantenha a indentação para enxergar melhor quais linhas pertencem ao mesmo bloco.',
      'Teste uma alteração por vez e observe o preview antes de continuar.',
      'Verifique IDs, nomes de funções, aspas, chaves e parênteses.'
    ];
    const specific = exercise.dicasExtras || [];
    const questions = exercise.perguntasGuia || [];
    const examples = exercise.exemplosExtras || [];
    const teacherItems = teacher ? [...(exercise.professor?.notas || []), ...(exercise.professor?.erros || []).map(item => `Erro frequente: ${item}`)] : [];
    return `
      <div class="drawer-section drawer-callout"><h3>Como estudar com estas dicas</h3><p>Use as dicas antes de testar, responda às perguntas sem consultar o código e aplique os exemplos com valores diferentes.</p></div>
      ${listSection('Dicas gerais', general)}
      ${listSection('Dicas específicas deste exercício', specific)}
      ${listSection('Perguntas para pensar', questions)}
      ${listSection('Exemplos extras', examples)}
      ${teacher ? listSection('Orientações do professor', teacherItems) : ''}`;
  }

  function stepDetailsHtml(step) {
    if (!step) return '';
    const parts = step.partes?.length ? `<div class="code-anatomy">${step.partes.map(item => `<article><strong>${escapeHtml(item.nome)}</strong><p>${escapeHtml(item.descricao)}</p></article>`).join('')}</div>` : '';
    return `
      <div class="drawer-section drawer-callout"><h3>Trecho atual do tutorial</h3><p>As informações abaixo explicam exatamente as linhas destacadas no editor e o resultado relacionado no preview.</p></div>
      <div class="drawer-section"><h3>${escapeHtml(step.titulo)}</h3><p>${escapeHtml(step.explicacao)}</p></div>
      ${listSection('Detalhamento', step.detalhes)}
      ${parts ? `<div class="drawer-section"><h3>Partes destacadas</h3>${parts}</div>` : ''}
      ${step.comparacao ? `<div class="drawer-section drawer-callout"><h3>Comparação</h3><p>${escapeHtml(step.comparacao)}</p></div>` : ''}
      ${step.exemplo ? `<div class="drawer-section"><h3>Exemplo</h3><pre><code>${escapeHtml(step.exemplo)}</code></pre></div>` : ''}
      ${step.porQue ? `<div class="drawer-section"><h3>Por que isso importa?</h3><p>${escapeHtml(step.porQue)}</p></div>` : ''}
      ${step.resultadoEsperado ? `<div class="drawer-section"><h3>Resultado esperado</h3><p>${escapeHtml(step.resultadoEsperado)}</p></div>` : ''}
      ${step.alerta ? `<div class="drawer-section drawer-warning"><h3>Atenção</h3><p>${escapeHtml(step.alerta)}</p></div>` : ''}`;
  }



function markdownInline(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return text;
}

function markdownToPreview(markdown) {
  const blocks = String(markdown || '').replace(/\r/g, '').split(/\n\s*\n/).map(item => item.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length && lines.every(line => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map(line => `<li>${markdownInline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    }
    if (/^\*\*[^*].*\*\*$/.test(block) && !block.includes('\n')) {
      return `<h3>${markdownInline(block.replace(/^\*\*/, '').replace(/\*\*$/, ''))}</h3>`;
    }
    if (/^#{1,3}\s+/.test(block)) {
      const level = Math.min(3, (block.match(/^#+/) || ['#'])[0].length);
      return `<h${level}>${markdownInline(block.replace(/^#{1,3}\s+/, ''))}</h${level}>`;
    }
    return `<p>${lines.map(markdownInline).join('<br>')}</p>`;
  }).join('');
}

return {
    escapeHtml,
    highlight,
    renderCode,
    toast,
    copy,
    download,
    downloadBlob,
    downloadZip,
    createZip,
    buildStarterCode,
    storageGet,
    storageSet,
    storageRemove,
    storageAvailable,
    getGithub,
    setGithub,
    normalizeGithubUrl,
    openGithub,
    openClassroom,
    configureGithub,
    normalizar,
    validateCode,
    analyzeCompleteness,
    buildPreviewDocument,
    buildCodePreviewDocument,
    inferPreviewTargets,
    extractTerms,
    glossaryHtml,
    contextHtml,
    tipsHtml,
    stepDetailsHtml,
    markdownToPreview
  };
})();


/* Recursos pedagógicos detalhados v0.5.17 são incorporados nas funções abaixo. */

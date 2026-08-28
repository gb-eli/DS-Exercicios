window.Utils = (() => {
  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const GLOSSARY = {
    input: { tipo: 'Função do Python', definicao: 'Lê um texto digitado pelo usuário no terminal.' },
    print: { tipo: 'Função do Python', definicao: 'Apresenta uma informação no terminal.' },
    float: { tipo: 'Função do Python', definicao: 'Converte um valor para número decimal.' },
    preventDefault: { tipo: 'Método de evento', definicao: 'Impede o comportamento padrão de um evento, como o recarregamento de um formulário.' },
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
    '--': { tipo: 'Operador', definicao: 'Subtrai uma unidade do valor atual.' },
    viewport: { tipo: 'HTML / tela', definicao: 'Configura a área visual usada pelo navegador para dimensionar uma página em dispositivos móveis.' },
    ariaLive: { tipo: 'Acessibilidade', definicao: 'Representa o uso de aria-live para anunciar mudanças de conteúdo sem mover o foco.' },
    root: { tipo: 'CSS', definicao: 'O seletor :root representa a raiz do documento e é muito usado para declarar variáveis CSS globais.' },
    boxSizing: { tipo: 'CSS', definicao: 'box-sizing define como largura e altura consideram padding e borda; border-box facilita cálculos de layout.' },
    grid: { tipo: 'CSS Layout', definicao: 'CSS Grid organiza conteúdo em linhas e colunas, permitindo grades responsivas.' },
    gap: { tipo: 'CSS Layout', definicao: 'Define o espaço entre itens de Grid ou Flexbox sem precisar criar margem em cada elemento.' },
    media: { tipo: 'CSS Responsivo', definicao: '@media aplica regras CSS quando uma condição de tela ou dispositivo é atendida.' },
    classList: { tipo: 'JavaScript / DOM', definicao: 'Permite adicionar, remover, alternar e consultar classes CSS de um elemento.' },
    heading: { tipo: 'Markdown', definicao: 'Títulos em Markdown usam # para organizar a documentação em níveis.' },
    code: { tipo: 'Markdown', definicao: 'Crases delimitam nomes de arquivos, comandos ou trechos de código em Markdown.' },
    select: { tipo: 'HTML / formulário', definicao: 'Cria um controle de seleção com uma lista de opções.' },
    option: { tipo: 'HTML / formulário', definicao: 'Define uma escolha disponível dentro de um elemento select.' },
    hidden: { tipo: 'HTML / estado', definicao: 'Oculta um elemento até que a aplicação decida apresentá-lo novamente.' }
  };

  function highlightPlainSegment(raw, lang) {
    const code = escapeHtml(raw);
    if (!code) return '';

    if (lang === 'css') {
      const tokenPattern = /(^|\n)([^\n{}]+)(?=\s*\{)|([\w-]+)(\s*:)|\b(\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw|s)?)\b/g;
      return code.replace(tokenPattern, (match, lineStart, selector, property, colon, number) => {
        if (selector !== undefined) return `${lineStart}<span class="tok-selector">${selector}</span>`;
        if (property !== undefined) return `<span class="tok-property">${property}</span>${colon}`;
        return `<span class="tok-number">${number}</span>`;
      });
    }

    if (lang === 'json') {
      return code.replace(/\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g, (match, keyword, number) =>
        keyword ? `<span class="tok-keyword">${keyword}</span>` : `<span class="tok-number">${number}</span>`
      );
    }

    if (lang === 'python') {
      const tokenPattern = /\b(def|if|elif|else|return|for|while|in|import|from|as|True|False|None|and|or|not|class|try|except|with)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_][\w]*)(?=\s*\()/g;
      return code.replace(tokenPattern, (match, keyword, number, fn) => {
        if (keyword) return `<span class="tok-keyword">${keyword}</span>`;
        if (number) return `<span class="tok-number">${number}</span>`;
        return `<span class="tok-fn">${fn}</span>`;
      });
    }

    if (lang === 'kotlin') {
      const tokenPattern = /\b(fun|val|var|if|else|return|for|while|in|class|override|import|package|true|false|null|when|try|catch)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_][\w]*)(?=\s*\()/g;
      return code.replace(tokenPattern, (match, keyword, number, fn) => {
        if (keyword) return `<span class="tok-keyword">${keyword}</span>`;
        if (number) return `<span class="tok-number">${number}</span>`;
        return `<span class="tok-fn">${fn}</span>`;
      });
    }

    const tokenPattern = /\b(function|let|const|var|if|else|return|true|false|null|new|for|while|async|await|try|catch|class|import|export)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\s*\()/g;
    return code.replace(tokenPattern, (match, keyword, number, fn) => {
      if (keyword) return `<span class="tok-keyword">${keyword}</span>`;
      if (number) return `<span class="tok-number">${number}</span>`;
      return `<span class="tok-fn">${fn}</span>`;
    });
  }

  function highlightScriptLike(raw, lang) {
    const source = String(raw || '');
    const lineComment = lang === 'python' ? '#' : (['css', 'json'].includes(lang) ? null : '//');
    const allowBlockComment = ['css', 'js', 'javascript', 'kotlin'].includes(lang);
    const quoteChars = lang === 'json' ? ['"'] : (lang === 'js' || lang === 'javascript' ? ['"', "'", '`'] : ['"', "'"]);
    let result = '';
    let plain = '';
    let index = 0;

    const flushPlain = () => {
      if (!plain) return;
      result += highlightPlainSegment(plain, lang);
      plain = '';
    };

    while (index < source.length) {
      if (allowBlockComment && source.startsWith('/*', index)) {
        flushPlain();
        const end = source.indexOf('*/', index + 2);
        const stop = end === -1 ? source.length : end + 2;
        result += `<span class="tok-comment">${escapeHtml(source.slice(index, stop))}</span>`;
        index = stop;
        continue;
      }

      if (lineComment && source.startsWith(lineComment, index)) {
        flushPlain();
        const end = source.indexOf('\n', index);
        const stop = end === -1 ? source.length : end;
        result += `<span class="tok-comment">${escapeHtml(source.slice(index, stop))}</span>`;
        index = stop;
        continue;
      }

      const quote = source[index];
      if (quoteChars.includes(quote)) {
        flushPlain();
        let stop = index + 1;
        let escaped = false;
        while (stop < source.length) {
          const current = source[stop];
          if (escaped) {
            escaped = false;
          } else if (current === '\\') {
            escaped = true;
          } else if (current === quote) {
            stop += 1;
            break;
          }
          stop += 1;
        }
        const token = source.slice(index, stop);
        let tokenClass = 'tok-string';
        if (lang === 'json') {
          let lookahead = stop;
          while (/\s/.test(source[lookahead] || '')) lookahead += 1;
          if (source[lookahead] === ':') tokenClass = 'tok-property';
        }
        result += `<span class="${tokenClass}">${escapeHtml(token)}</span>`;
        index = stop;
        continue;
      }

      plain += source[index];
      index += 1;
    }

    flushPlain();
    return result;
  }

  function highlightHtml(raw) {
    const source = String(raw || '');
    const tokenPattern = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
    let result = '';
    let lastIndex = 0;

    for (const match of source.matchAll(tokenPattern)) {
      result += escapeHtml(source.slice(lastIndex, match.index));
      const token = match[0];
      if (token.startsWith('<!--')) {
        result += `<span class="tok-comment">${escapeHtml(token)}</span>`;
      } else {
        const parsed = token.match(/^<(\/?)\s*([A-Za-z][\w:-]*)([\s\S]*?)(\/?)>$/);
        if (!parsed) {
          result += escapeHtml(token);
        } else {
          const [, closing, tagName, rawAttributes, selfClosing] = parsed;
          const attributes = escapeHtml(rawAttributes).replace(
            /([A-Za-z_:][\w:.-]*)(\s*=\s*)(&quot;.*?&quot;|&#39;.*?&#39;|[^\s]+)/g,
            (attributeMatch, name, equals, value) => `<span class="tok-attr">${name}</span>${equals}<span class="tok-string">${value}</span>`
          );
          result += `&lt;${closing}<span class="tok-tag">${escapeHtml(tagName)}</span>${attributes}${selfClosing}&gt;`;
        }
      }
      lastIndex = match.index + token.length;
    }

    result += escapeHtml(source.slice(lastIndex));
    return result;
  }

  function highlightMarkdown(raw) {
    const lines = String(raw || '').split('\n');
    return lines.map(line => {
      if (/^#{1,6}\s/.test(line)) return `<span class="tok-keyword">${escapeHtml(line)}</span>`;
      let result = '';
      let cursor = 0;
      for (const match of line.matchAll(/`[^`]*`/g)) {
        result += escapeHtml(line.slice(cursor, match.index));
        result += `<span class="tok-string">${escapeHtml(match[0])}</span>`;
        cursor = match.index + match[0].length;
      }
      return result + escapeHtml(line.slice(cursor));
    }).join('\n');
  }

  function highlight(raw, lang) {
    const normalized = lang === 'javascript' ? 'js' : lang;
    if (normalized === 'html' || normalized === 'xml') return highlightHtml(raw);
    if (normalized === 'markdown') return highlightMarkdown(raw);
    if (normalized === 'text') return escapeHtml(raw);
    return highlightScriptLike(raw, normalized);
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
    const value = String(text ?? '');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API indisponível');
      await navigator.clipboard.writeText(value);
      toast(message);
      return true;
    } catch (error) {
      const active = document.activeElement;
      const selection = active && typeof active.selectionStart === 'number'
        ? { start: active.selectionStart, end: active.selectionEnd }
        : null;
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.readOnly = true;
      textarea.setAttribute('aria-hidden', 'true');
      Object.assign(textarea.style, {
        position: 'fixed', top: '-1000px', left: '-1000px', width: '1px', height: '1px',
        opacity: '0', pointerEvents: 'none'
      });
      document.body.append(textarea);
      textarea.focus({ preventScroll: true });
      textarea.select();
      let copied = false;
      try { copied = Boolean(document.execCommand('copy')); } catch (copyError) { copied = false; }
      textarea.remove();
      if (active?.focus) {
        active.focus({ preventScroll: true });
        if (selection && typeof active.setSelectionRange === 'function') active.setSelectionRange(selection.start, selection.end);
      }
      toast(copied ? message : 'Não foi possível copiar. Use Ctrl+A e Ctrl+C.');
      return copied;
    }
  }

  function download(name, content, type = 'text/plain') {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const anchor = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    anchor.href = objectUrl;
    anchor.download = name;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  }


  function crc32(bytes) {
    let crc = 0 ^ -1;
    for (let index = 0; index < bytes.length; index += 1) {
      crc ^= bytes[index];
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
    return (crc ^ -1) >>> 0;
  }

  function zipDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
      date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
    };
  }

  function createZip(files = []) {
    const encoder = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    const push16 = (view, position, value) => view.setUint16(position, value, true);
    const push32 = (view, position, value) => view.setUint32(position, value >>> 0, true);
    const stamp = zipDateTime();

    files.forEach(item => {
      const nameBytes = encoder.encode(String(item.name || 'arquivo.txt').replace(/^\/+/, ''));
      const dataBytes = encoder.encode(String(item.content ?? ''));
      const checksum = crc32(dataBytes);
      const local = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(local.buffer);
      push32(localView, 0, 0x04034b50);
      push16(localView, 4, 20);
      push16(localView, 6, 0x0800);
      push16(localView, 8, 0);
      push16(localView, 10, stamp.time);
      push16(localView, 12, stamp.date);
      push32(localView, 14, checksum);
      push32(localView, 18, dataBytes.length);
      push32(localView, 22, dataBytes.length);
      push16(localView, 26, nameBytes.length);
      push16(localView, 28, 0);
      local.set(nameBytes, 30);
      chunks.push(local, dataBytes);

      const header = new Uint8Array(46 + nameBytes.length);
      const headerView = new DataView(header.buffer);
      push32(headerView, 0, 0x02014b50);
      push16(headerView, 4, 20);
      push16(headerView, 6, 20);
      push16(headerView, 8, 0x0800);
      push16(headerView, 10, 0);
      push16(headerView, 12, stamp.time);
      push16(headerView, 14, stamp.date);
      push32(headerView, 16, checksum);
      push32(headerView, 20, dataBytes.length);
      push32(headerView, 24, dataBytes.length);
      push16(headerView, 28, nameBytes.length);
      push16(headerView, 30, 0);
      push16(headerView, 32, 0);
      push16(headerView, 34, 0);
      push16(headerView, 36, 0);
      push32(headerView, 38, 0);
      push32(headerView, 42, offset);
      header.set(nameBytes, 46);
      central.push(header);
      offset += local.length + dataBytes.length;
    });

    const centralSize = central.reduce((total, chunk) => total + chunk.length, 0);
    chunks.push(...central);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    push32(endView, 0, 0x06054b50);
    push16(endView, 4, 0);
    push16(endView, 6, 0);
    push16(endView, 8, files.length);
    push16(endView, 10, files.length);
    push32(endView, 12, centralSize);
    push32(endView, 16, offset);
    push16(endView, 20, 0);
    chunks.push(end);
    return new Blob(chunks, { type: 'application/zip' });
  }

  function githubStorageKey() {
    const prefix = window.APP_CONFIG?.storagePrefix || 'ds2sub';
    const username = String(window.AppAuth?.currentUser?.()?.username || 'sem-usuario').replace(/[^a-z0-9._-]/gi, '_');
    return `${prefix}_${username}_github_url_v1`;
  }

  function getGithub() {
    try {
      return localStorage.getItem(githubStorageKey()) || window.APP_CONFIG?.githubDefault || 'https://github.com/';
    } catch (error) {
      return window.APP_CONFIG?.githubDefault || 'https://github.com/';
    }
  }

  function normalizeGithubUrl(value) {
    let raw = String(value || '').trim();
    if (!raw) return null;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;
    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      if (parsed.protocol !== 'https:' || host !== 'github.com') return null;
      parsed.hash = '';
      return parsed.toString();
    } catch (error) {
      return null;
    }
  }

  function setGithub(url) {
    const normalized = normalizeGithubUrl(url);
    if (!normalized) {
      toast('Use um endereço HTTPS válido do GitHub, como https://github.com/usuario/repositorio.');
      return false;
    }
    try {
      localStorage.setItem(githubStorageKey(), normalized);
      return true;
    } catch (error) {
      toast('Não foi possível guardar o endereço do GitHub neste navegador.');
      return false;
    }
  }

  function openSafeExternal(url) {
    try {
      const parsed = new URL(String(url || ''), location.href);
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        toast('O endereço externo não é seguro ou está incompleto.');
        return false;
      }
      const popup = window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
      if (popup) popup.opener = null;
      return Boolean(popup);
    } catch (error) {
      toast('Não foi possível abrir o endereço externo.');
      return false;
    }
  }

  function openGithub() {
    const normalized = normalizeGithubUrl(getGithub()) || 'https://github.com/';
    openSafeExternal(normalized);
  }

  function openClassroom() {
    const url = window.APP_CONFIG?.classroomUrl || 'https://classroom.google.com/';
    openSafeExternal(url);
  }

  function configureGithub() {
    const current = getGithub();
    const repository = window.APP_CONFIG?.repositorio || 'seu repositório';
    const url = prompt(
      `Cole o endereço do repositório ${repository} no GitHub:`,
      current === 'https://github.com/' ? '' : current
    );
    if (url) {
      if (setGithub(url.trim())) toast('Repositório configurado.');
    }
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

  function normalizeCodeInput(value) {
    return removeBom(value)
      .replace(/[“”„‟]/g, '"')
      .replace(/[‘’‚‛]/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/\u00a0/g, ' ')
      .replace(/［/g, '[').replace(/］/g, ']')
      .replace(/（/g, '(').replace(/）/g, ')')
      .replace(/｛/g, '{').replace(/｝/g, '}')
      .replace(/＜/g, '<').replace(/＞/g, '>')
      .replace(/＝/g, '=').replace(/；/g, ';').replace(/：/g, ':').replace(/，/g, ',');
  }

  function hasPastedLineNumbers(code) {
    const lines = removeBom(code).split('\n').filter(line => line.trim());
    if (lines.length < 3) return false;
    const numbered = lines.filter(line => /^\s*\d+\s+(?:<|[.#@A-Za-z_$/*])/u.test(line)).length;
    return numbered >= Math.ceil(lines.length * 0.6);
  }

  function hasSmartQuotes(code) {
    return /[\u2018\u2019\u201C\u201D]/u.test(String(code || ''));
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


  function htmlLineFromOffset(source, offset) {
    return String(source || '').slice(0, Math.max(0, Number(offset || 0))).split('\n').length;
  }

  function htmlSourceSyntaxIssues(code) {
    const source = removeBom(code);
    const issues = [];
    const stack = [];
    const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
    const optionalClose = new Set(['li','dt','dd','p','rt','rp','optgroup','option','colgroup','thead','tbody','tfoot','tr','td','th']);
    let index = 0;

    const pushIssue = (title, detail, offset) => {
      if (issues.length >= 8) return;
      issues.push({ title, detail, line: htmlLineFromOffset(source, offset) });
    };

    while (index < source.length) {
      const start = source.indexOf('<', index);
      if (start < 0) break;
      if (source.startsWith('<!--', start)) {
        const endComment = source.indexOf('-->', start + 4);
        if (endComment < 0) { pushIssue('Comentário HTML não fechado', 'Feche o comentário com -->.', start); break; }
        index = endComment + 3;
        continue;
      }
      let cursor = start + 1;
      let quote = '';
      while (cursor < source.length) {
        const char = source[cursor];
        if (quote) {
          if (char === quote && source[cursor - 1] !== '\\') quote = '';
        } else if (char === '"' || char === "'") quote = char;
        else if (char === '>') break;
        cursor += 1;
      }
      if (cursor >= source.length) {
        pushIssue(quote ? 'Aspas de atributo não fechadas' : 'Tag HTML não fechada', quote ? 'Feche as aspas do atributo e depois a tag com >.' : 'Feche a tag com >.', start);
        break;
      }
      const raw = source.slice(start + 1, cursor).trim();
      index = cursor + 1;
      if (!raw || raw.startsWith('!') || raw.startsWith('?')) continue;
      const closing = raw.startsWith('/');
      const selfClosing = /\/\s*$/.test(raw);
      const nameMatch = raw.match(/^\/?\s*([A-Za-z][\w:-]*)/);
      if (!nameMatch) continue;
      const tag = nameMatch[1].toLowerCase();

      if (closing) {
        if (!stack.length) {
          pushIssue(`Fechamento sem abertura: </${tag}>`, `Remova </${tag}> ou inclua a abertura correspondente.`, start);
          continue;
        }
        if (stack[stack.length - 1].tag === tag) {
          stack.pop();
          continue;
        }
        const position = stack.map(item => item.tag).lastIndexOf(tag);
        if (position < 0) {
          pushIssue(`Fechamento sem abertura: </${tag}>`, `Não foi encontrada uma tag <${tag}> aberta.`, start);
        } else {
          const top = stack[stack.length - 1];
          pushIssue(`Ordem de fechamento incorreta`, `Feche <${top.tag}> antes de fechar <${tag}>.`, start);
          stack.splice(position, 1);
        }
        continue;
      }

      if (voidTags.has(tag) || selfClosing) continue;
      if (optionalClose.has(tag) && stack[stack.length - 1]?.tag === tag) stack.pop();
      stack.push({ tag, offset: start });

      if (tag === 'script' || tag === 'style') {
        const closeRegex = new RegExp(`<\\/\\s*${tag}\\s*>`, 'ig');
        closeRegex.lastIndex = index;
        const found = closeRegex.exec(source);
        if (!found) {
          pushIssue(`Tag <${tag}> não fechada`, `Feche o bloco com </${tag}>.`, start);
          stack.pop();
          break;
        }
        index = closeRegex.lastIndex;
        stack.pop();
      }
    }

    stack.slice(-8).reverse().forEach(item => {
      pushIssue(`Tag <${item.tag}> não fechada`, `Inclua </${item.tag}> antes do fim do arquivo.`, item.offset);
    });
    return issues;
  }

  function htmlDiagnostics(actual, expected) {
    const issues = [...htmlSourceSyntaxIssues(actual)];
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
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: "Troque aspas curvas por aspas simples ou duplas normais do teclado." });
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
      ok: issues.length === 0 && actualParsed.canonical === expectedParsed.canonical,
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

  function cssStructureDiagnostics(actual, structure) {
    const parsed = parseCss(actual);
    const issues = [...parsed.errors];
    const suggestions = [];
    const source = removeCssComments(actual);
    const selectorEntries = [...parsed.rules.entries()];
    const selectors = selectorEntries.map(([selector]) => selector.split('|').at(-1));
    const customProperties = new Set();
    let varUses = 0;
    let hasBoxSizing = false;
    let hasCompleteBoxModel = false;

    selectorEntries.forEach(([, declarations]) => {
      const properties = new Set(declarations.keys());
      declarations.forEach((value, property) => {
        if (property.startsWith('--')) customProperties.add(property);
        varUses += (String(value).match(/var\s*\(/g) || []).length;
        if (property === 'box-sizing' && /border-box/i.test(value)) hasBoxSizing = true;
      });
      const propertyList = [...properties];
      const hasMargin = propertyList.some(property => property === 'margin' || property.startsWith('margin-'));
      const hasPadding = propertyList.some(property => property === 'padding' || property.startsWith('padding-'));
      const hasBorder = propertyList.some(property => property === 'border' || property.startsWith('border-'));
      if (hasMargin && hasPadding && hasBorder) hasCompleteBoxModel = true;
    });

    const typeChecks = {
      elemento: selectors.some(selector => /(^|\s|>|\+|~)(body|header|main|section|article|aside|footer|button|h1|h2|h3|p)(?=$|[\s.:#\[])/i.test(selector)),
      classe: selectors.some(selector => /\.[a-z_-][\w-]*/i.test(selector)),
      id: selectors.some(selector => /#[a-z_-][\w-]*/i.test(selector)),
      atributo: selectors.some(selector => /\[[^\]]+\]/.test(selector)),
      pseudoclasse: selectors.some(selector => /:(hover|focus-visible|focus|active|checked|first-child|last-child|nth-child|root)\b/i.test(selector))
    };

    const minimumVariables = Number(structure.minimoVariaveis || 0);
    if (customProperties.size < minimumVariables) issues.push({ title: 'Variáveis CSS insuficientes', detail: `Foram reconhecidas ${customProperties.size}; crie pelo menos ${minimumVariables} propriedades personalizadas iniciadas por --.` });
    const minimumUses = Number(structure.minimoUsosVar || 0);
    if (varUses < minimumUses) issues.push({ title: 'Poucos usos de var()', detail: `Foram reconhecidos ${varUses}; reutilize as variáveis com var() em pelo menos ${minimumUses} declarações.` });
    const requestedSelectorTypes = structure.tiposSeletores || [];
    const recognizedSelectorTypes = requestedSelectorTypes.filter(type => typeChecks[type]);
    const minimumSelectorTypes = Math.max(0, Number(structure.minimoTiposSeletores ?? requestedSelectorTypes.length));
    if (recognizedSelectorTypes.length < minimumSelectorTypes) {
      issues.push({
        title: 'Pouca variedade de seletores',
        detail: `Foram reconhecidos ${recognizedSelectorTypes.length} tipos entre ${requestedSelectorTypes.join(', ')}. Use pelo menos ${minimumSelectorTypes}; você não precisa reproduzir todos os seletores do exemplo.`
      });
    }
    if (structure.exigirBoxSizing && !hasBoxSizing) issues.push({ title: 'box-sizing ausente', detail: 'Aplique box-sizing: border-box para facilitar o controle do tamanho final.' });
    const allCssProperties = new Set(selectorEntries.flatMap(([, declarations]) => [...declarations.keys()]));
    const hasAnyMargin = [...allCssProperties].some(property => property === 'margin' || property.startsWith('margin-'));
    const hasAnyPadding = [...allCssProperties].some(property => property === 'padding' || property.startsWith('padding-'));
    const hasAnyBorder = [...allCssProperties].some(property => property === 'border' || property.startsWith('border-'));
    if (structure.exigirBoxModelCompleto && !(hasAnyMargin && hasAnyPadding && hasAnyBorder)) issues.push({ title: 'Box Model incompleto', detail: 'Use margin, padding e border no projeto. Eles podem estar em componentes diferentes; não é necessário copiar o mesmo bloco do exemplo.' });
    const compactSource = normalizeText(source).replace(/\s+/g, '');
    (structure.proibir || []).forEach(term => {
      if (compactSource.includes(normalizeText(term).replace(/\s+/g, ''))) issues.push({ title: `Recurso fora do escopo: ${term}`, detail: `Remova ${term}; este exercício deve permanecer focado em seletores, cascata, variáveis e Box Model.` });
    });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova números de linha colados antes das regras.' });
    suggestions.push('Cores, medidas, ordem das regras e nomes das variáveis podem ser personalizados.');
    suggestions.push('O diagnóstico verifica os conceitos e não exige copiar valores visuais exatamente.');
    suggestions.push('Use o DevTools para observar cascata, especificidade e o diagrama do Box Model.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Seletores, variáveis, cascata e Box Model reconhecidos.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }


  function flexboxStructureDiagnostics(actual, structure) {
    const parsed = parseCss(actual);
    const issues = [...parsed.errors];
    const suggestions = [];
    const source = removeCssComments(actual);
    const entries = [...parsed.rules.entries()];
    let displayFlexCount = 0;
    let hasWrap = false;
    let hasDirection = false;
    let hasJustify = false;
    let hasAlign = false;
    let hasGap = false;
    let hasFlexItemSizing = false;
    let hasMediaQuery = false;

    entries.forEach(([selector, declarations]) => {
      if (selector.includes('@media')) hasMediaQuery = true;
      declarations.forEach((value, property) => {
        const normalizedValue = normalizeText(String(value));
        if (property === 'display' && /^(inline-)?flex$/.test(normalizedValue)) displayFlexCount += 1;
        if (property === 'flex-wrap' && !/^nowrap$/.test(normalizedValue)) hasWrap = true;
        if (property === 'flex-flow' && /wrap/.test(normalizedValue)) hasWrap = true;
        if (property === 'flex-direction') hasDirection = true;
        if (property === 'flex-flow') hasDirection = true;
        if (property === 'justify-content') hasJustify = true;
        if (property === 'align-items' || property === 'align-content') hasAlign = true;
        if (property === 'gap' || property === 'row-gap' || property === 'column-gap') hasGap = true;
        if (property === 'flex' || property === 'flex-basis' || property === 'flex-grow' || property === 'flex-shrink') hasFlexItemSizing = true;
      });
    });

    const minimumFlex = Number(structure.minimoDisplaysFlex ?? 1);
    if (displayFlexCount < minimumFlex) issues.push({ title: 'Poucos contêineres Flexbox', detail: `Foram reconhecidos ${displayFlexCount}; use display: flex em pelo menos ${minimumFlex} contêineres com funções diferentes.` });
    if (structure.exigirFlexWrap && !hasWrap) issues.push({ title: 'flex-wrap ausente', detail: 'Permita que um grupo de itens quebre para novas linhas com flex-wrap ou flex-flow.' });
    if (structure.exigirFlexDirection && !hasDirection) issues.push({ title: 'flex-direction ausente', detail: 'Use flex-direction ou flex-flow para controlar o eixo principal em pelo menos um contêiner.' });
    if (structure.exigirJustifyContent && !hasJustify) issues.push({ title: 'justify-content ausente', detail: 'Use justify-content para distribuir itens no eixo principal.' });
    if (structure.exigirAlignItems && !hasAlign) issues.push({ title: 'align-items ausente', detail: 'Use align-items ou align-content para controlar o eixo transversal.' });
    if (structure.exigirGap && !hasGap) issues.push({ title: 'gap ausente', detail: 'Use gap, row-gap ou column-gap para criar espaçamento entre itens flexíveis.' });
    if (structure.exigirFlexItemSizing && !hasFlexItemSizing) issues.push({ title: 'Dimensionamento flexível ausente', detail: 'Use flex, flex-basis, flex-grow ou flex-shrink em pelo menos um item.' });
    if (structure.exigirMediaQuery && !hasMediaQuery) issues.push({ title: 'Adaptação responsiva ausente', detail: 'Inclua pelo menos uma media query que reorganize o layout em tela estreita.' });

    const compactSource = normalizeText(source).replace(/\s+/g, '');
    (structure.proibir || []).forEach(term => {
      if (compactSource.includes(normalizeText(term).replace(/\s+/g, ''))) issues.push({ title: `Recurso fora do escopo: ${term}`, detail: `Remova ${term}; resolva esta atividade com Flexbox.` });
    });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova números de linha colados antes das regras.' });
    suggestions.push('Seletores, cores, medidas e quantidade de cartões podem ser personalizados.');
    suggestions.push('O diagnóstico verifica os conceitos do Flexbox e não exige copiar o gabarito visual.');
    suggestions.push('Use o destaque de Flexbox no DevTools para observar eixos, linhas e espaçamentos.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Estrutura Flexbox, distribuição e responsividade reconhecidas.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }


  function gridResponsiveDiagnostics(actual, structure) {
    const parsed = parseCss(actual);
    const issues = [...parsed.errors];
    const suggestions = [];
    const source = removeCssComments(actual);
    const entries = [...parsed.rules.entries()];
    let displayGridCount = 0;
    let hasTemplateColumns = false;
    let hasTemplateAreas = false;
    let gridAreaCount = 0;
    let hasGap = false;
    let hasMinmax = false;
    let hasRepeat = false;
    let hasAutoFitFill = false;
    const mediaContexts = new Set();

    entries.forEach(([selector, declarations]) => {
      const media = selector.match(/@media[^|]*/g) || [];
      media.forEach(item => mediaContexts.add(item));
      declarations.forEach((value, property) => {
        const normalizedValue = normalizeText(String(value));
        if (property === 'display' && /^(inline-)?grid$/.test(normalizedValue)) displayGridCount += 1;
        if (property === 'grid-template-columns') hasTemplateColumns = true;
        if (property === 'grid-template-areas') hasTemplateAreas = true;
        if (property === 'grid-area' || property === 'grid-row-start' || property === 'grid-column-start') gridAreaCount += 1;
        if (property === 'gap' || property === 'row-gap' || property === 'column-gap') hasGap = true;
        if (/minmax\s*\(/.test(normalizedValue)) hasMinmax = true;
        if (/repeat\s*\(/.test(normalizedValue)) hasRepeat = true;
        if (/auto-(fit|fill)/.test(normalizedValue)) hasAutoFitFill = true;
      });
    });

    gridAreaCount = Math.max(gridAreaCount, (source.match(/\bgrid-area\s*:/gi) || []).length);

    const minimumGrid = Number(structure.minimoDisplaysGrid ?? 1);
    const minimumAreas = Number(structure.minimoGridAreas ?? 1);
    const minimumMedia = Number(structure.minimoMediaQueries ?? 1);
    if (displayGridCount < minimumGrid) issues.push({ title: 'Poucos contêineres Grid', detail: `Foram reconhecidos ${displayGridCount}; use display: grid em pelo menos ${minimumGrid} contêineres com funções diferentes.` });
    if (structure.exigirTemplateColumns && !hasTemplateColumns) issues.push({ title: 'grid-template-columns ausente', detail: 'Defina colunas explícitas ou responsivas em pelo menos uma grade.' });
    if (structure.exigirTemplateAreas && !hasTemplateAreas) issues.push({ title: 'grid-template-areas ausente', detail: 'Crie um mapa de áreas para o dashboard.' });
    if (gridAreaCount < minimumAreas) issues.push({ title: 'Poucas regiões nomeadas', detail: `Foram reconhecidas ${gridAreaCount}; associe pelo menos ${minimumAreas} elementos com grid-area.` });
    if (structure.exigirGap && !hasGap) issues.push({ title: 'gap ausente', detail: 'Use gap, row-gap ou column-gap para espaçar itens da grade.' });
    if (structure.exigirMinmax && !hasMinmax) issues.push({ title: 'minmax() ausente', detail: 'Use minmax() para controlar limites mínimos e máximos das colunas.' });
    if (structure.exigirRepeat && !hasRepeat) issues.push({ title: 'repeat() ausente', detail: 'Use repeat() para declarar colunas repetidas de forma concisa.' });
    if (structure.exigirAutoFitOuFill && !hasAutoFitFill) issues.push({ title: 'auto-fit ou auto-fill ausente', detail: 'Use auto-fit ou auto-fill em uma grade interna responsiva.' });
    if (mediaContexts.size < minimumMedia) issues.push({ title: 'Media queries insuficientes', detail: `Foram reconhecidos ${mediaContexts.size} breakpoints; crie pelo menos ${minimumMedia}.` });

    const compactSource = normalizeText(source).replace(/\s+/g, '');
    (structure.proibir || []).forEach(term => {
      if (compactSource.includes(normalizeText(term).replace(/\s+/g, ''))) issues.push({ title: `Recurso não permitido: ${term}`, detail: `Remova ${term} e resolva a adaptação com a estrutura do Grid e a cascata.` });
    });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova números de linha colados antes das regras.' });
    suggestions.push('Nomes de áreas, cores, medidas e breakpoints podem ser personalizados.');
    suggestions.push('O diagnóstico verifica os conceitos do Grid e não exige copiar o mesmo desenho visual.');
    suggestions.push('Use o destaque de Grid no DevTools para visualizar linhas, colunas, áreas e gaps.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Estrutura Grid, regiões e responsividade reconhecidas.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }

  function cssLenientDiagnostics(actual) {
    const parsed = parseCss(actual);
    const issues = [...parsed.errors];
    const suggestions = [];
    const rules = [...parsed.rules.entries()];
    if (!rules.length && !issues.length) issues.push({ title: 'Nenhuma regra CSS identificada', detail: 'Inclua pelo menos um seletor com propriedades CSS antes de validar.' });
    const declarationCount = rules.reduce((total, [, declarations]) => total + declarations.size, 0);
    if (rules.length && declarationCount === 0 && !issues.length) issues.push({ title: 'Regras CSS sem propriedades', detail: 'Adicione pelo menos uma propriedade CSS em seus seletores.' });
    suggestions.push('Neste exercício o CSS é arquivo de apoio: cores, medidas, seletores, ordem e organização podem ser diferentes do exemplo.');
    suggestions.push('A validação verifica se o CSS está estruturalmente utilizável; o resultado visual deve ser conferido no Preview.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'CSS válido e utilizável reconhecido.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }

  function cssDiagnostics(actual, expected) {
    const actualParsed = parseCss(actual);
    const expectedParsed = parseCss(expected);
    const issues = [...actualParsed.errors];
    const suggestions = [];

    expectedParsed.rules.forEach((declarations, selector) => {
      const actualDeclarations = actualParsed.rules.get(selector);
      if (!actualDeclarations) {
        issues.push({ title: `Seletor ausente: ${selector.replaceAll("|", " -> ")}`, detail: `Crie ou revise o bloco CSS do seletor ${selector.replaceAll("|", " -> ")}.` });
        return;
      }
      declarations.forEach((expectedValue, property) => {
        if (!actualDeclarations.has(property)) {
          issues.push({ title: `Propriedade ausente em ${selector.replaceAll("|", " -> ")}`, detail: `A propriedade ${property} não foi encontrada nesse seletor.` });
          return;
        }
        const actualValue = actualDeclarations.get(property);
        if (actualValue !== expectedValue) {
          issues.push({ title: `Valor divergente em ${selector.replaceAll("|", " -> ")}`, detail: `Revise o valor da propriedade ${property}.` });
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
      issues.unshift({ title: 'Aspas tipográficas encontradas', detail: "Troque aspas curvas por aspas simples ou duplas normais do teclado." });
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


  function maskJavaScriptLiterals(code) {
    const source = String(code || '');
    const chars = [...source];
    let state = 'normal';
    for (let index = 0; index < chars.length; index += 1) {
      const char = chars[index];
      const next = chars[index + 1];
      if (state === 'line') {
        if (char === '\n') state = 'normal'; else chars[index] = ' ';
        continue;
      }
      if (state === 'block') {
        if (char === '*' && next === '/') { chars[index] = chars[index + 1] = ' '; index += 1; state = 'normal'; }
        else if (char !== '\n') chars[index] = ' ';
        continue;
      }
      if (state === 'single' || state === 'double' || state === 'template') {
        const delimiter = state === 'single' ? "'" : state === 'double' ? '"' : '`';
        if (char === '\\') { chars[index] = ' '; if (index + 1 < chars.length && chars[index + 1] !== '\n') chars[index + 1] = ' '; index += 1; continue; }
        if (char === delimiter) { chars[index] = ' '; state = 'normal'; }
        else if (char !== '\n') chars[index] = ' ';
        continue;
      }
      if (char === '/' && next === '/') { chars[index] = chars[index + 1] = ' '; index += 1; state = 'line'; continue; }
      if (char === '/' && next === '*') { chars[index] = chars[index + 1] = ' '; index += 1; state = 'block'; continue; }
      if (char === "'") { chars[index] = ' '; state = 'single'; continue; }
      if (char === '"') { chars[index] = ' '; state = 'double'; continue; }
      if (char === '`') { chars[index] = ' '; state = 'template'; continue; }
    }
    return chars.join('');
  }

  function matchingBrace(masked, openIndex) {
    let depth = 0;
    for (let index = openIndex; index < masked.length; index += 1) {
      if (masked[index] === '{') depth += 1;
      if (masked[index] === '}') { depth -= 1; if (depth === 0) return index; }
    }
    return -1;
  }

  function findNamedJavaScriptBodies(code) {
    const source = String(code || '');
    const masked = maskJavaScriptLiterals(source);
    const bodies = new Map();
    const patterns = [
      /function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g,
      /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*\{/g
    ];
    patterns.forEach(pattern => {
      for (const match of masked.matchAll(pattern)) {
        const open = match.index + match[0].lastIndexOf('{');
        const close = matchingBrace(masked, open);
        if (close > open) bodies.set(match[1], source.slice(open + 1, close));
      }
    });
    return bodies;
  }

  function findDomBindings(code) {
    const bindings = new Map();
    const source = String(code || '');
    const pattern = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*document\.(?:querySelector\s*\(\s*['"]#([^'"]+)['"]\s*\)|getElementById\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
    for (const match of source.matchAll(pattern)) bindings.set(match[1], match[2] || match[3]);
    return bindings;
  }

  function extractEventHandlers(code) {
    const source = String(code || '');
    const masked = maskJavaScriptLiterals(source);
    const namedBodies = findNamedJavaScriptBodies(source);
    const handlers = [];
    const pattern = /([A-Za-z_$][\w$]*)\s*\.\s*addEventListener\s*\(\s*(['"])([^'"]+)\2\s*,/g;
    for (const match of source.matchAll(pattern)) {
      let cursor = match.index + match[0].length;
      while (/\s/.test(source[cursor] || '')) cursor += 1;
      let body = '';
      const named = source.slice(cursor).match(/^([A-Za-z_$][\w$]*)\s*\)/);
      if (named && namedBodies.has(named[1])) body = namedBodies.get(named[1]);
      else {
        const arrow = masked.indexOf('=>', cursor);
        const functionKeyword = masked.slice(cursor, cursor + 16).match(/^\s*(?:async\s+)?function\b/);
        let open = -1;
        if (functionKeyword) open = masked.indexOf('{', cursor);
        else if (arrow >= cursor && arrow < cursor + 240) open = masked.indexOf('{', arrow + 2);
        if (open >= 0 && open < cursor + 320) {
          const close = matchingBrace(masked, open);
          if (close > open) body = source.slice(open + 1, close);
        } else if (arrow >= cursor && arrow < cursor + 240) {
          const closeCall = masked.indexOf(')', arrow + 2);
          body = source.slice(arrow + 2, closeCall > arrow ? closeCall : source.length);
        }
      }
      handlers.push({ triggerVariable: match[1], event: match[3], body });
    }
    return handlers;
  }

  function jsActionPresent(body, action, targetVariables = []) {
    const escaped = targetVariables.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const target = escaped.length ? `(?:${escaped.join('|')})` : '[A-Za-z_$][\\w$]*';
    const tests = {
      text: new RegExp(`\\b${target}\\s*\\.\\s*(?:textContent|innerText)\\s*=`),
      classAdd: new RegExp(`\\b${target}\\s*\\.\\s*classList\\s*\\.\\s*add\\s*\\(`),
      classToggle: new RegExp(`\\b${target}\\s*\\.\\s*classList\\s*\\.\\s*toggle\\s*\\(`),
      hidden: new RegExp(`\\b${target}\\s*\\.\\s*hidden\\s*=`),
      focus: new RegExp(`\\b${target}\\s*\\.\\s*focus\\s*\\(`),
      value: new RegExp(`\\b${target}\\s*\\.\\s*value\\b`),
      preventDefault: /\.\s*preventDefault\s*\(/,
      formData: /new\s+FormData\s*\(/,
      dataGet: /\.\s*get\s*\(/,
      bodyClassToggle: /document\s*\.\s*body\s*\.\s*classList\s*\.\s*toggle\s*\(/
    };
    if (action.type === 'setAttribute' || action.type === 'getAttribute') {
      const method = action.type === 'setAttribute' ? 'setAttribute' : 'getAttribute';
      const attribute = String(action.attribute || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${target}\\s*\\.\\s*${method}\\s*\\(\\s*['"]${attribute}['"]`).test(body);
    }
    return Boolean(tests[action.type]?.test(body));
  }

  function jsBehaviorDiagnostics(actual, rules = []) {
    const issues = [];
    const bindings = findDomBindings(actual);
    const handlers = extractEventHandlers(actual);
    const variablesForId = id => [...bindings.entries()].filter(([, value]) => value === id).map(([name]) => name);
    rules.forEach(rule => {
      const triggerVars = variablesForId(rule.triggerId);
      const handler = handlers.find(item => item.event === rule.event && triggerVars.includes(item.triggerVariable));
      if (!handler) {
        issues.push({ title: `Evento ${rule.event} não ligado a #${rule.triggerId}`, detail: `Registre ${rule.event} no elemento #${rule.triggerId} e coloque as ações dentro do callback.` });
        return;
      }
      (rule.acoes || []).forEach(action => {
        const variables = action.targetId ? variablesForId(action.targetId) : [];
        if (action.targetId && !variables.length) {
          issues.push({ title: `Elemento #${action.targetId} não associado`, detail: `Localize #${action.targetId} antes de usá-lo no evento ${rule.event}.` });
          return;
        }
        if (!jsActionPresent(handler.body, action, variables)) {
          const labels = { text: 'atualização de texto', classAdd: 'adição de classe', classToggle: 'alternância de classe', hidden: 'controle de hidden', focus: 'movimentação de foco', value: 'leitura de value', preventDefault: 'preventDefault()', formData: 'criação de FormData', dataGet: 'leitura de dados', bodyClassToggle: 'alternância de classe no body', setAttribute: `setAttribute(${action.attribute})`, getAttribute: `getAttribute(${action.attribute})` };
          issues.push({ title: `Ação fora ou ausente no evento ${rule.event}`, detail: `Inclua ${labels[action.type] || action.type}${action.targetId ? ` em #${action.targetId}` : ''} dentro do callback de ${rule.event}.` });
        }
      });
    });
    return issues;
  }

  function jsSemanticDiagnostics(actual, expected, exercise = {}) {
    const issues = [];
    const suggestions = [];
    const syntaxIssue = checkJavaScriptSyntax(actual);
    if (syntaxIssue) issues.push(syntaxIssue);
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas simples ou duplas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados junto com o JavaScript.' });
    const clean = value => removeBom(value).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const actualClean = clean(actual);
    const expectedClean = clean(expected);
    const actualIds = new Set(findDomIds(actualClean));
    const missingReferenceIds = findDomIds(expectedClean).filter(id => !actualIds.has(id));
    if (missingReferenceIds.length) suggestions.push(`Sua solução não acessa diretamente ${missingReferenceIds.map(id => `#${id}`).join(', ')} como o exemplo. Isso não bloqueia a validação; o preview confirma se a alternativa funciona.`);
    const behaviorRules = exercise?.validacao?.jsComportamento || [];
    const escapeRegex = value => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const bindings = findDomBindings(actualClean);
    const handlers = extractEventHandlers(actualClean);
    const hasListener = rule => {
      const id = escapeRegex(rule.triggerId);
      const eventName = escapeRegex(rule.event);
      const directGet = new RegExp(`document\\s*\\.\\s*getElementById\\s*\\(\\s*['"]${id}['"]\\s*\\)\\s*\\.\\s*addEventListener\\s*\\(\\s*['"]${eventName}['"]`).test(actualClean);
      const directQuery = new RegExp(`document\\s*\\.\\s*querySelector\\s*\\(\\s*['"]#${id}['"]\\s*\\)\\s*\\.\\s*addEventListener\\s*\\(\\s*['"]${eventName}['"]`).test(actualClean);
      const directGetProperty = new RegExp(`document\s*\.\s*getElementById\s*\(\s*['"]${id}['"]\s*\)\s*\.\s*on${eventName}\s*=`).test(actualClean);
      const directQueryProperty = new RegExp(`document\s*\.\s*querySelector\s*\(\s*['"]#${id}['"]\s*\)\s*\.\s*on${eventName}\s*=`).test(actualClean);
      if (directGet || directQuery || directGetProperty || directQueryProperty) return true;
      const vars = [...bindings.entries()].filter(([, targetId]) => targetId === rule.triggerId).map(([name]) => name);
      if (handlers.some(handler => handler.event === rule.event && vars.includes(handler.triggerVariable))) return true;
      return vars.some(name => new RegExp(`\b${escapeRegex(name)}\s*\.\s*on${eventName}\s*=`).test(actualClean));
    };
    if (behaviorRules.length) {
      behaviorRules.forEach(rule => {
        if (!hasListener(rule)) issues.push({ title: `Evento ${rule.event} não ligado a #${rule.triggerId}`, detail: `Registre ${rule.event} no elemento #${rule.triggerId}. A forma do callback e os nomes das variáveis podem ser diferentes do exemplo.` });
      });
      const advisory = jsBehaviorDiagnostics(actualClean, behaviorRules).filter(item => !/^Evento /.test(item.title || ''));
      if (advisory.length) suggestions.push('Há diferenças internas em relação ao exemplo, mas elas não bloqueiam o arquivo. O teste do preview confirmará se o comportamento final funciona.');
    } else {
      const expectedEvents = [...expectedClean.matchAll(/addEventListener\s*\(\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
      const actualEvents = new Set([...actualClean.matchAll(/addEventListener\s*\(\s*['"]([^'"]+)['"]/g)].map(match => match[1]));
      expectedEvents.forEach(eventName => {
        if (!actualEvents.has(eventName)) issues.push({ title: `Evento ${eventName} não identificado`, detail: `Registre o evento ${eventName} com addEventListener().` });
      });
      const features = [
        [/\.(?:textContent|innerText)\s*=/g, 'atualização de texto'],
        [/\.classList\.add\s*\(/g, 'classList.add()'],
        [/\.classList\.toggle\s*\(/g, 'classList.toggle()'],
        [/\.setAttribute\s*\(/g, 'setAttribute()'],
        [/\.hidden\s*=/g, 'controle de hidden'],
        [/\.preventDefault\s*\(/g, 'preventDefault()'],
        [/\.focus\s*\(/g, 'focus()'],
        [/\.value\b/g, 'leitura de value']
      ];
      const countMatches = (source, pattern) => (source.match(new RegExp(pattern.source, pattern.flags)) || []).length;
      const missingFeatures = features.filter(([pattern]) => countMatches(expectedClean, pattern) > 0 && countMatches(actualClean, pattern) === 0).map(([, label]) => label);
      if (missingFeatures.length) suggestions.push(`O exemplo também usa ${missingFeatures.join(', ')}, mas isso não bloqueia a validação se sua solução equivalente funcionar no preview.`);
    }
    suggestions.push('Espaços, linhas em branco, indentação, comentários, aspas simples ou duplas e ponto e vírgula opcional são aceitos.');
    suggestions.push('Nomes de variáveis, innerText/textContent e função tradicional/arrow são aceitos quando mantêm o comportamento.');
    suggestions.push('IDs, evento principal e sintaxe continuam obrigatórios. Ações internas equivalentes são confirmadas pelo comportamento real no preview, não pela cópia do gabarito.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Interação JavaScript semanticamente reconhecida.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }

  function canonicalJson(value) {
    if (Array.isArray(value)) return value.map(canonicalJson);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalJson(value[key])]));
    return value;
  }

  function jsonDiagnostics(actual, expected) {
    const issues = [];
    try {
      const parsedActual = canonicalJson(JSON.parse(actual));
      const parsedExpected = canonicalJson(JSON.parse(expected));
      const same = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      if (!same) issues.push({ title: 'Estrutura JSON diferente', detail: 'Confira chaves, valores, listas e tipos de dados.' });
      return { ok: same, summary: same ? 'JSON válido e estrutura reconhecida.' : 'O JSON é válido, mas a estrutura ainda está diferente.', issues, suggestions: ['JSON aceita espaços e quebras de linha, mas exige aspas duplas nas chaves e textos.', 'Não use vírgula depois do último item.'], firstLine: same ? null : firstDifferentLine(actual, expected) };
    } catch (error) {
      const match = String(error.message || '').match(/position\s+(\d+)/i);
      const line = match ? lineFromOffset(actual, Number(match[1])) : null;
      return { ok: false, summary: error.message || 'JSON inválido.', issues: [{ title: 'Erro de sintaxe JSON', detail: error.message || 'Confira aspas, vírgulas, chaves e colchetes.', line }], suggestions: ['Use aspas duplas.', 'Confira se chaves e colchetes foram fechados.'], firstLine: line || 1 };
    }
  }


  function normalizedMarkdownHeading(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim();
  }

  function markdownDiagnostics(actual, expected, structure = {}) {
    const issues = [];
    const suggestions = [];
    const source = removeBom(actual);
    const headings = [...source.matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)].map(match => normalizedMarkdownHeading(match[1]));
    const normalizedSource = normalizedMarkdownHeading(source);

    if (hasSmartQuotes(source)) issues.push({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais do teclado nos exemplos de código.' });
    if ((structure.minimoCaracteres || 0) > source.trim().length) issues.push({ title: 'Documentação muito curta', detail: `Escreva pelo menos ${structure.minimoCaracteres} caracteres para documentar o projeto.` });
    (structure.titulosObrigatorios || []).forEach(required => {
      const wanted = normalizedMarkdownHeading(required);
      if (!headings.some(heading => heading.includes(wanted))) issues.push({ title: `Seção ausente: ${required}`, detail: `Inclua um título Markdown para a seção ${required}.` });
    });
    (structure.arquivosObrigatorios || []).forEach(filename => {
      if (!source.includes(filename)) issues.push({ title: `Arquivo não documentado: ${filename}`, detail: `Mencione ${filename} na documentação da estrutura ou execução.` });
    });
    (structure.conteudosObrigatorios || []).forEach(text => {
      if (!normalizedSource.includes(normalizedMarkdownHeading(text))) {
        const message = `A documentação ainda não menciona explicitamente: ${text}.`;
        if (structure.conteudoEstrito === true) issues.push({ title: 'Informação obrigatória ausente', detail: message });
        else suggestions.push(`${message} Isso não bloqueia a conclusão se a explicação equivalente estiver escrita com outras palavras.`);
      }
    });
    (structure.proibirPlaceholders || []).forEach(text => {
      if (normalizedSource.includes(normalizedMarkdownHeading(text))) issues.push({ title: 'Campo ainda não preenchido', detail: `Substitua o texto provisório "${text}" por uma informação real do estudante.` });
    });
    if (structure.codigoExercicio && !new RegExp(`\\b${String(structure.codigoExercicio).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i').test(source)) {
      issues.push({ title: 'Identificação do exercício ausente', detail: `Mantenha a identificação ${structure.codigoExercicio} no README.` });
    }
    suggestions.push('Espaços, linhas em branco, listas e textos personalizados são aceitos.');
    suggestions.push('Mantenha as seções, os nomes reais dos arquivos e as orientações de execução e entrega.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Documentação Markdown reconhecida.', issues, suggestions, firstLine: issues.length ? firstDifferentLine(actual, expected) : null };
  }

  function normalizeGeneric(code, lang) {
    let value = removeBom(code).replace(/\r\n?/g, '\n');
    if (lang === 'python') value = value.replace(/#.*$/gm, '');
    if (['kotlin', 'js', 'shell'].includes(lang)) value = value.replace(/\/\/.*$/gm, '');
    if (lang === 'markdown' || lang === 'text') return value.replace(/\s+/g, ' ').trim();
    const tokens = [];
    const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_$][\w$]*|-?\d+(?:\.\d+)?|===|!==|==|!=|>=|<=|&&|\|\||->|=>|\+\+|--|\+=|-=|\*\*|[{}()[\].,:;+\-*\/%<>!=@])/g;
    for (const match of value.matchAll(regex)) {
      let token = match[0];
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) token = `STRING:${token.slice(1, -1)}`;
      if (token === ';' && ['js', 'kotlin'].includes(lang)) continue;
      tokens.push(token);
    }
    return tokens;
  }

  function genericDiagnostics(actual, expected, lang) {
    if (lang === 'xml') {
      const parser = new DOMParser();
      const documentActual = parser.parseFromString(actual, 'application/xml');
      if (documentActual.querySelector('parsererror')) return { ok: false, summary: 'XML inválido.', issues: [{ title: 'Erro de sintaxe XML', detail: documentActual.querySelector('parsererror').textContent.slice(0, 180), line: 1 }], suggestions: ['Feche todas as tags.', 'Use aspas nos atributos.'], firstLine: 1 };
    }
    const a = normalizeGeneric(actual, lang);
    const e = normalizeGeneric(expected, lang);
    const asArray = Array.isArray(a) ? a : [a];
    const esArray = Array.isArray(e) ? e : [e];
    let divergence = null;
    const total = Math.max(asArray.length, esArray.length);
    for (let index = 0; index < total; index += 1) {
      if (asArray[index] !== esArray[index]) { divergence = index; break; }
    }
    const ok = divergence === null;
    return {
      ok,
      summary: ok ? 'Estrutura reconhecida.' : 'A estrutura do arquivo ainda está diferente do material de referência.',
      issues: ok ? [] : [{ title: 'Primeira divergência estrutural', detail: `Revise a parte próxima ao item ${divergence + 1} da sequência de código.`, line: firstDifferentLine(actual, expected) }],
      suggestions: ['Espaços, indentação, linhas em branco e comentários são aceitos.', 'Confira nomes, valores, operadores, tags e a ordem das instruções.'],
      firstLine: ok ? null : firstDifferentLine(actual, expected)
    };
  }


  function htmlStructureDiagnostics(actual, structure) {
    const parsed = parseHtml(actual);
    const documentActual = parsed.document;
    const issues = [...htmlSourceSyntaxIssues(actual)];
    const suggestions = [];

    (structure.idsObrigatorios || []).forEach(id => {
      if (!documentActual.getElementById(id)) issues.push({ title: `Identificador ausente: #${id}`, detail: `Inclua um elemento com id="${id}".` });
    });
    Object.entries(structure.tagsMinimas || {}).forEach(([tag, minimum]) => {
      const total = documentActual.querySelectorAll(tag).length;
      if (total < Number(minimum)) issues.push({ title: `Elemento semântico insuficiente: <${tag}>`, detail: `Foram encontrados ${total}; são necessários pelo menos ${minimum}.` });
    });
    const refs = structure.referenciasArquivos || {};
    const normalizeProjectRef = value => String(value || '').trim().replace(/\\/g, '/').replace(/^\.\//, '').split(/[?#]/)[0];
    if (refs.css && ![...documentActual.querySelectorAll('link[rel="stylesheet"][href]')].some(node => normalizeProjectRef(node.getAttribute('href')) === normalizeProjectRef(refs.css))) {
      issues.push({ title: 'Folha de estilos não conectada', detail: `Conecte o arquivo ${refs.css} com link rel="stylesheet".` });
    }
    if (refs.js && ![...documentActual.querySelectorAll('script[src]')].some(node => normalizeProjectRef(node.getAttribute('src')) === normalizeProjectRef(refs.js))) {
      issues.push({ title: 'JavaScript não conectado', detail: `Conecte o arquivo ${refs.js} com script src.` });
    }
    (structure.ancorasObrigatorias || []).forEach(href => {
      if (!documentActual.querySelector(`a[href="${href}"]`)) issues.push({ title: `Navegação interna ausente: ${href}`, detail: `Inclua um link que aponte para ${href}.` });
    });
    (structure.seletoresObrigatorios || []).forEach(rule => {
      if (!documentActual.querySelector(rule.selector)) issues.push({ title: `Elemento obrigatório ausente`, detail: rule.message || `Inclua um elemento compatível com ${rule.selector}.` });
    });
    (structure.rotulosAssociados || []).forEach(id => {
      const control = documentActual.getElementById(id);
      if (!control) return;
      if (!documentActual.querySelector(`label[for="${id}"]`)) issues.push({ title: `Rótulo ausente para #${id}`, detail: `Inclua label for="${id}" associado ao controle.` });
    });
    (structure.atributosObrigatorios || []).forEach(rule => {
      const node = documentActual.querySelector(rule.selector);
      if (!node) {
        issues.push({ title: `Elemento obrigatório ausente: ${rule.selector}`, detail: `Inclua o elemento ${rule.selector} antes de validar seus atributos.` });
        return;
      }
      if (!node.hasAttribute(rule.attribute)) issues.push({ title: `Atributo ausente em ${rule.selector}`, detail: `Inclua ${rule.attribute} nesse elemento.` });
      else if ('value' in rule && node.getAttribute(rule.attribute) !== rule.value) issues.push({ title: `Valor divergente em ${rule.selector}`, detail: `O atributo ${rule.attribute} deve possuir o valor ${rule.value}.` });
    });
    if (structure.campoOpcionalExtra) {
      const rule = structure.campoOpcionalExtra;
      const form = documentActual.querySelector(rule.formSelector || 'form');
      const ignored = new Set((rule.ignorarIds || []).map(String));
      const controls = form ? [...form.querySelectorAll('input[id][name], select[id][name], textarea[id][name]')] : [];
      const extras = controls.filter(control => {
        const type = String(control.getAttribute('type') || '').toLowerCase();
        return !ignored.has(control.id) && !['submit','reset','button','hidden','radio','checkbox'].includes(type);
      });
      const validExtra = extras.find(control => {
        const label = documentActual.querySelector(`label[for="${CSS.escape(control.id)}"]`);
        return label && !control.hasAttribute('required') && String(control.getAttribute('name') || '').trim();
      });
      if (!validExtra) issues.push({
        title: 'Campo opcional adicional não identificado',
        detail: `Inclua um ${rule.rotulo || 'campo opcional'} com id, name e label associado. O nome e o assunto do campo podem ser personalizados.`
      });
    }
    if (structure.proibirTabindexPositivo) {
      [...documentActual.querySelectorAll('[tabindex]')].forEach(node => {
        const value = Number(node.getAttribute('tabindex'));
        if (Number.isFinite(value) && value > 0) issues.push({ title: 'tabindex positivo encontrado', detail: 'Remova tabindex maior que zero e preserve a ordem natural do documento.' });
      });
    }
    const h1Count = documentActual.querySelectorAll('h1').length;
    if (h1Count < 1) issues.push({ title: 'Título principal ausente', detail: 'Inclua pelo menos um h1 para identificar o título principal da página.' });
    else if (h1Count > 1) suggestions.push(`Foram encontrados ${h1Count} elementos h1. Isso não bloqueia a atividade, mas prefira uma hierarquia de títulos clara.`);
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais do teclado.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha no código', detail: 'Remova os números de linha colados no editor.' });
    suggestions.push('Você pode alterar textos, opções, conteúdo e detalhes visuais sem remover os requisitos estruturais e acessíveis.');
    suggestions.push('Soluções semanticamente equivalentes são aceitas quando mantêm rótulos, grupos, tipos, nomes e relações acessíveis solicitadas.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Estrutura semântica e acessível reconhecida.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }


  function normalizedAlgorithmText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function pseudocodeSequentialDiagnostics(actual, structure) {
    const issues = [];
    const suggestions = [];
    const source = normalizedAlgorithmText(actual);
    const lines = source.split(/\n+/).map(item => item.trim()).filter(Boolean);
    const inputCount = lines.filter(item => /\b(ler|receber|entrada)\b/.test(item)).length;
    const outputCount = lines.filter(item => /\b(exibir|mostrar|escrever|saida)\b/.test(item)).length;
    const assignmentCount = lines.filter(item => /(<-|:=|=|\brecebe\b|\batribuir\b|\bdefinir\b)/.test(item)).length;
    if (structure.exigirInicioFim && !/\binicio\b/.test(source)) issues.push({ title: 'Início não identificado', detail: 'Marque claramente o início do algoritmo.' });
    if (structure.exigirInicioFim && !/\bfim\b/.test(source)) issues.push({ title: 'Fim não identificado', detail: 'Marque claramente o fim do algoritmo.' });
    if (inputCount < Number(structure.minimoEntradas || 1)) issues.push({ title: 'Entradas insuficientes', detail: `Foram reconhecidas ${inputCount}; represente pelo menos ${structure.minimoEntradas} instruções de entrada.` });
    const minimumAssignments = Number(structure.minimoAtribuicoes || 2);
    if (assignmentCount < minimumAssignments) issues.push({ title: 'Processamento insuficiente', detail: `Foram reconhecidas ${assignmentCount} atribuições; represente pelo menos ${minimumAssignments} etapas de processamento. Os nomes podem ser diferentes do exemplo.` });
    if (!(/[\w)]\s*\*\s*[\w(]/.test(source) || /\b(vezes|multiplicar|multiplicacao|produto)\b/.test(source))) issues.push({ title: 'Multiplicação não identificada', detail: 'Represente a multiplicação com * ou com uma descrição equivalente, como VEZES ou MULTIPLICAR.' });
    if (!(/[\w)]\s*\+\s*[\w(]/.test(source) || /\b(mais|somar|soma|adicionar)\b/.test(source))) issues.push({ title: 'Soma não identificada', detail: 'Represente a soma com + ou com uma descrição equivalente, como MAIS ou SOMAR.' });
    if (structure.exigirTaxa && !/(0[.,]1\d*|10\s*%|12\s*%|10\s*por\s*cento|12\s*por\s*cento|\/\s*10|\/\s*100)/.test(source)) issues.push({ title: 'Taxa percentual não identificada', detail: 'Represente a taxa operacional como percentual, decimal, divisão ou texto equivalente.' });
    if (outputCount < Number(structure.minimoSaidas || 1)) issues.push({ title: 'Saídas insuficientes', detail: `Foram reconhecidas ${outputCount}; apresente pelo menos ${structure.minimoSaidas} informações de saída.` });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Use aspas normais quando o pseudocódigo tiver textos.' });
    suggestions.push('Palavras como LER, RECEBER, EXIBIR, MOSTRAR ou ESCREVER são aceitas quando representam a mesma etapa.');
    suggestions.push('Os nomes das variáveis podem mudar, mas a relação entrada -> processamento -> saída deve permanecer.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Algoritmo sequencial reconhecido.', issues, suggestions, firstLine: null };
  }

  function javascriptSequentialDiagnostics(actual, structure) {
    const issues = [];
    const suggestions = [];
    const syntax = checkJavaScriptSyntax(actual);
    if (syntax) issues.push({ title: 'Erro de sintaxe JavaScript', detail: syntax.detail || String(syntax), line: syntax.line || 1 });
    const source = removeBom(actual);
    const compact = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const valueReads = (compact.match(/\.value\b/g) || []).length;
    const numericConversions = (compact.match(/\b(Number|parseFloat|parseInt)\s*\(/g) || []).length + (compact.match(/\+\s*[A-Za-z_$][\w$]*\.value\b/g) || []).length;
    if (structure.exigirSubmit && !(/addEventListener\s*\(\s*['"]submit['"]/.test(compact) || /\.onsubmit\s*=/.test(compact))) issues.push({ title: 'Evento submit não identificado', detail: 'Use o envio do formulário com addEventListener("submit", ...) ou onsubmit.' });
    if (structure.exigirPreventDefault && !/\.preventDefault\s*\(/.test(compact)) issues.push({ title: 'preventDefault ausente', detail: 'Impeça o recarregamento padrão do formulário.' });
    if (valueReads < Number(structure.minimoLeiturasValue || 1)) issues.push({ title: 'Poucas entradas lidas', detail: `Foram reconhecidas ${valueReads}; leia pelo menos ${structure.minimoLeiturasValue} valores da interface.` });
    if (numericConversions < Number(structure.minimoConversoesNumericas || 1)) issues.push({ title: 'Conversões numéricas insuficientes', detail: `Foram reconhecidas ${numericConversions}; converta os campos numéricos antes do cálculo.` });
    if (!/[\w)]\s*\*\s*[\w(]/.test(compact)) issues.push({ title: 'Multiplicação não identificada', detail: 'Calcule o subtotal por multiplicação.' });
    if (!/[\w)]\s*\+\s*[\w(]/.test(compact)) issues.push({ title: 'Soma não identificada', detail: 'Calcule o total somando valores.' });
    if (structure.exigirTaxa && !/(0\.1\d*|\/\s*10|\/\s*100|\*\s*12\s*\/\s*100)/.test(compact)) issues.push({ title: 'Taxa não identificada', detail: 'Calcule a taxa como decimal, divisão ou expressão percentual equivalente.' });
    if (structure.exigirSaidaSegura && !/\.(?:textContent|innerText)\s*=/.test(compact)) issues.push({ title: 'Saída segura não identificada', detail: 'Apresente o resultado com textContent ou innerText.' });
    if (/\.innerHTML\b/.test(compact)) issues.push({ title: 'Recurso fora do escopo: innerHTML', detail: 'Use textContent para apresentar a saída com segurança.' });
    if (/\beval\s*\(/.test(compact)) issues.push({ title: 'Recurso fora do escopo: eval()', detail: 'Não execute texto como código.' });
    if (/\b(if|for|while|switch)\s*\(/.test(compact)) issues.push({ title: 'Estrutura fora do escopo', detail: 'Mantenha o FE07 como algoritmo sequencial; condições e laços serão estudados depois.' });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha encontrados', detail: 'Remova números de linha colados no código.' });
    suggestions.push('Nomes de variáveis e forma de formatar moeda podem mudar.');
    suggestions.push('O diagnóstico verifica entrada, processamento e saída, sem exigir cópia textual do gabarito.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Algoritmo JavaScript sequencial reconhecido.', issues, suggestions, firstLine: issues.find(item => item.line)?.line || null };
  }


  function pythonBasicSyntaxIssues(code) {
    const source = removeBom(code);
    const issues = [];
    const stack = [];
    let quote = '';
    let triple = false;
    let line = 1;
    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      if (char === '\n') line += 1;
      if (quote) {
        if (char === '\\') { index += 1; continue; }
        if (triple && source.slice(index, index + 3) === quote.repeat(3)) { index += 2; quote = ''; triple = false; continue; }
        if (!triple && char === quote) { quote = ''; continue; }
        continue;
      }
      if (char === '#') { while (index < source.length && source[index] !== '\n') index += 1; line += source[index] === '\n' ? 1 : 0; continue; }
      if ((char === '"' || char === "'") && source.slice(index, index + 3) === char.repeat(3)) { quote = char; triple = true; index += 2; continue; }
      if (char === '"' || char === "'") { quote = char; triple = false; continue; }
      if ('([{'.includes(char)) stack.push({ char, line });
      if (')]}'.includes(char)) {
        const expected = { ')': '(', ']': '[', '}': '{' }[char];
        const opened = stack.pop();
        if (!opened || opened.char !== expected) issues.push({ title: 'Delimitador incorreto', detail: `Revise o caractere ${char}.`, line });
      }
    }
    if (quote) issues.push({ title: 'Texto Python não fechado', detail: 'Feche as aspas da string.', line });
    stack.slice(-4).forEach(item => issues.push({ title: 'Delimitador Python não fechado', detail: `Feche ${item.char}.`, line: item.line }));

    source.split('\n').forEach((raw, index) => {
      const noStrings = raw.replace(/(['"])(?:\\.|(?!\1).)*\1/g, '').replace(/#.*$/, '').trim();
      if (!noStrings) return;
      if (/:\s*$/.test(noStrings) && !/^(?:async\s+)?(?:if|elif|else|for|while|def|class|try|except|finally|with|match|case)\b/.test(noStrings)) {
        issues.push({ title: 'Dois-pontos em posição inválida', detail: 'Remova o dois-pontos ou use-o apenas na abertura de uma estrutura Python válida.', line: index + 1 });
      }
      if (/^(?:async\s+)?(?:if|elif|else|for|while|def|class|try|except|finally|with|match|case)\b/.test(noStrings) && !/:\s*$/.test(noStrings)) {
        issues.push({ title: 'Dois-pontos ausente', detail: 'Estruturas Python precisam terminar a linha de abertura com dois-pontos.', line: index + 1 });
      }
      if (/(?:=|\+|-|\*|\/|%)\s*$/.test(noStrings)) issues.push({ title: 'Instrução Python incompleta', detail: 'A linha termina com um operador e precisa ser completada.', line: index + 1 });
    });
    return issues.slice(0, 8);
  }

  function pythonSequentialDiagnostics(actual, structure) {
    const issues = [...pythonBasicSyntaxIssues(actual)];
    const suggestions = [];
    const source = removeBom(actual);
    const compact = source.replace(/#.*$/gm, '');
    const inputCount = (compact.match(/\binput\s*\(/g) || []).length;
    const numericConversions = (compact.match(/\b(float|int)\s*\(/g) || []).length;
    const printCount = (compact.match(/\bprint\s*\(/g) || []).length;
    if (inputCount < Number(structure.minimoInputs || 1)) issues.push({ title: 'Entradas Python insuficientes', detail: `Foram reconhecidas ${inputCount}; utilize input() pelo menos ${structure.minimoInputs} vezes.` });
    if (numericConversions < Number(structure.minimoConversoesNumericas || 1)) issues.push({ title: 'Conversões Python insuficientes', detail: `Foram reconhecidas ${numericConversions}; converta os dados numéricos com float() ou int().` });
    if (printCount < Number(structure.minimoPrints || 1)) issues.push({ title: 'Saídas Python insuficientes', detail: `Foram reconhecidos ${printCount} usos de print(); são esperados pelo menos ${structure.minimoPrints}.` });
    if (!/[\w)]\s*\*\s*[\w(]/.test(compact)) issues.push({ title: 'Multiplicação não identificada', detail: 'Calcule o subtotal por multiplicação.' });
    if (!/[\w)]\s*\+\s*[\w(]/.test(compact)) issues.push({ title: 'Soma não identificada', detail: 'Calcule o total pela soma de subtotal e taxa.' });
    if (structure.exigirTaxa && !/(0\.1\d*|\/\s*10|\/\s*100|\*\s*12\s*\/\s*100)/.test(compact)) issues.push({ title: 'Taxa não identificada', detail: 'Calcule a taxa como decimal ou percentual equivalente.' });
    if (/\b(eval|exec)\s*\(/.test(compact)) issues.push({ title: 'Execução dinâmica fora do escopo', detail: 'Não use eval() ou exec().' });
    if (/^\s*(if|for|while|def|class)\b/m.test(compact)) issues.push({ title: 'Estrutura fora do escopo', detail: 'Mantenha o FE07 como uma sequência simples; condições, laços, funções e classes serão estudados depois.' });
    const opened = (compact.match(/[([{]/g) || []).length;
    const closed = (compact.match(/[)\]}]/g) || []).length;
    if (opened !== closed) issues.push({ title: 'Delimitadores desequilibrados', detail: 'Revise parênteses, colchetes e chaves.' });
    if (hasSmartQuotes(actual)) issues.unshift({ title: 'Aspas tipográficas encontradas', detail: 'Troque aspas curvas por aspas normais.' });
    if (hasPastedLineNumbers(actual)) issues.unshift({ title: 'Números de linha encontrados', detail: 'Remova números de linha colados no código.' });
    suggestions.push('snake_case é recomendado em Python, mas nomes equivalentes são aceitos.');
    suggestions.push('A sintaxe final também deve ser conferida executando python main.py no terminal.');
    return { ok: issues.length === 0, summary: issues[0]?.detail || 'Algoritmo Python sequencial reconhecido.', issues, suggestions, firstLine: null };
  }


  function referenceFreeDiagnostics(file, actual, exercise) {
    const text=String(actual||''),issues=[],suggestions=['A solução completa fica somente no Modo Professor. A validação local verifica estrutura e sintaxe; a aprovação oficial é docente.'];
    const lang=exercise?.linguagens?.[file]||file,min=Math.max(20,Number(exercise?.validacao?.minChars||40));
    if(text.trim().length<min)issues.push({title:'Implementação muito curta',detail:`Desenvolva mais a solução antes de validar (mínimo local: ${min} caracteres).`});
    if(lang==='html'||String(file).toLowerCase().startsWith('html')){if(!/<(?:html|main|body|section|div|form|article)\b/i.test(text))issues.push({title:'Estrutura HTML incompleta',detail:'Inclua a estrutura solicitada da página.'});}
    else if(lang==='css'||file==='css'){try{const x=parseCss(text);if(x?.errors?.length)issues.push({title:'CSS com erro',detail:'Revise chaves, seletores e declarações.'});if(!x?.rules?.size)issues.push({title:'CSS sem regras',detail:'Crie ao menos uma regra de estilo.'});}catch{if(!/[{}]/.test(text))issues.push({title:'CSS incompleto',detail:'Revise a estrutura das regras CSS.'});}}
    else if(lang==='js'||file==='js'){try{const x=typeof checkJavaScriptSyntax==='function'?checkJavaScriptSyntax(text):null;if(x)issues.push({title:'JavaScript com erro',detail:String(x.message||x)});}catch{}if(!/\b(?:const|let|var|function|if|for|while|addEventListener|querySelector|getElementById)\b/.test(text))issues.push({title:'Lógica JavaScript incompleta',detail:'Implemente a lógica ou interação solicitada.'});}
    else if(lang==='python'){if(!/\b(?:print|input|if|for|while|def|int|float|str)\b/.test(text))issues.push({title:'Python incompleto',detail:'Implemente as entradas, processamento ou saídas solicitadas.'});}
    else if(lang==='json'){try{JSON.parse(text)}catch{issues.push({title:'JSON inválido',detail:'Revise aspas, vírgulas e chaves.'})}}
    return{ok:issues.length===0,summary:issues[0]?.detail||'Estrutura local reconhecida. A atividade seguirá para validação do professor.',issues,suggestions,firstLine:null,referenceFree:true};
  }
  function referenceFreeCompleteness(file,actual,exercise){const r=referenceFreeDiagnostics(file,actual,exercise),length=String(actual||'').trim().length,percentage=r.ok?95:Math.max(5,Math.min(85,Math.round(length/4)));return{percentage,remaining:100-percentage,status:r.ok?'Pronto para validação':'Em desenvolvimento',state:r.ok?'almost':'building',syntaxOk:!r.issues.some(x=>/erro|inválid/i.test(x.title||'')),message:r.summary,referenceFree:true};}

  function validateCode(file, actual, expected, exercise) {
    const cleanActual = normalizeCodeInput(actual);
    const cleanExpected = normalizeCodeInput(expected);
    if ((exercise?.studentReferenceStripped || !cleanExpected.trim()) && cleanActual.trim()) return referenceFreeDiagnostics(file, cleanActual, exercise);
    const lang = exercise?.linguagens?.[file] || file;
    if (!cleanActual.trim()) {
      return { ok: false, summary: 'Digite o código antes de validar.', issues: [{ title: 'Arquivo vazio', detail: 'O editor ainda não possui código.' }], suggestions: ['Volte ao tutorial e comece a digitar.'], firstLine: 1 };
    }
    if (lang === 'text' && exercise?.validacao?.algoritmoSequencialPseudocodigo) return pseudocodeSequentialDiagnostics(cleanActual, exercise.validacao.algoritmoSequencialPseudocodigo);
    if (lang === 'python' && exercise?.validacao?.algoritmoSequencialPython) return pythonSequentialDiagnostics(cleanActual, exercise.validacao.algoritmoSequencialPython);
    if (lang === 'js' && exercise?.validacao?.algoritmoSequencialJS) return javascriptSequentialDiagnostics(cleanActual, exercise.validacao.algoritmoSequencialJS);
    if (lang === 'js' && exercise?.validacao?.aceitarEquivalencias) return jsSemanticDiagnostics(cleanActual, cleanExpected, exercise);
    if (lang === 'html' && exercise?.validacao?.htmlEstrutura) return htmlStructureDiagnostics(cleanActual, exercise.validacao.htmlEstrutura);
    if (lang === 'html') return htmlDiagnostics(cleanActual, cleanExpected);
    if (lang === 'css' && exercise?.validacao?.cssGridResponsivo) return gridResponsiveDiagnostics(cleanActual, exercise.validacao.cssGridResponsivo);
    if (lang === 'css' && exercise?.validacao?.cssFlexbox) return flexboxStructureDiagnostics(cleanActual, exercise.validacao.cssFlexbox);
    if (lang === 'css' && exercise?.validacao?.cssEstrutura) return cssStructureDiagnostics(cleanActual, exercise.validacao.cssEstrutura);
    if (lang === 'css' && exercise?.validacao?.aceitarEquivalencias) return cssLenientDiagnostics(cleanActual);
    if (lang === 'css') return cssDiagnostics(cleanActual, cleanExpected);
    if (lang === 'js') return jsDiagnostics(cleanActual, cleanExpected, exercise);
    if (lang === 'json') return jsonDiagnostics(cleanActual, cleanExpected);
    if (lang === 'markdown') return markdownDiagnostics(cleanActual, cleanExpected, exercise?.validacao?.markdownEstrutura || {});
    return genericDiagnostics(cleanActual, cleanExpected, lang);
  }


  function analyzeCompleteness(file, actual, expected, exercise) {
    const cleanActual = removeBom(actual);
    const cleanExpected = removeBom(expected);
    if ((exercise?.studentReferenceStripped || !cleanExpected.trim()) && cleanActual.trim()) return referenceFreeCompleteness(file, cleanActual, exercise);
    const lang = exercise?.linguagens?.[file] || file;
    if (!cleanActual.trim()) return { percentage: 0, remaining: 100, status: 'Ainda não começou', state: 'empty', message: 'Comece a digitar para acompanhar o avanço do arquivo.', syntaxOk: true };

    let matched = 0;
    let total = 1;
    let syntaxOk = true;
    let detail = 'Estrutura e conteúdo do arquivo.';

    if (lang === 'html') {
      const a = parseHtml(cleanActual).document;
      const e = parseHtml(cleanExpected).document;
      const expectedIds = [...e.querySelectorAll('[id]')];
      const expectedRefs = [...e.querySelectorAll('link[href],script[src]')];
      const expectedTags = [...e.querySelectorAll('body *')].map(node => node.tagName.toLowerCase());
      total = 1 + expectedIds.length * 3 + expectedRefs.length * 2 + expectedTags.length;
      if (/^\s*<!doctype\s+html/i.test(cleanActual)) matched += 1;
      expectedIds.forEach(node => { const found = a.getElementById(node.id); if (found) matched += 2; if (found?.tagName === node.tagName) matched += 1; });
      expectedRefs.forEach(node => { const attr = node.tagName === 'LINK' ? 'href' : 'src'; const value = node.getAttribute(attr); if ([...a.querySelectorAll(`${node.tagName.toLowerCase()}[${attr}]`)].some(item => item.getAttribute(attr) === value)) matched += 2; });
      const remainingTags = [...a.querySelectorAll('body *')].map(node => node.tagName.toLowerCase());
      expectedTags.forEach(tag => { const index = remainingTags.indexOf(tag); if (index >= 0) { matched += 1; remainingTags.splice(index, 1); } });
      detail = 'Elementos, identificadores e ligação dos arquivos.';
    } else if (lang === 'css') {
      const a = parseCss(cleanActual);
      const e = parseCss(cleanExpected);
      syntaxOk = a.errors.length === 0;
      total = 0;
      e.rules.forEach((declarations, selector) => {
        total += 1 + declarations.size;
        const actualDeclarations = a.rules.get(selector);
        if (actualDeclarations) {
          matched += 1;
          declarations.forEach((value, property) => { if (actualDeclarations.get(property) === value) matched += 1; else if (actualDeclarations.has(property)) matched += .45; });
        }
      });
      total = Math.max(1, total);
      detail = 'Seletores, propriedades e valores CSS.';
    } else if (lang === 'js') {
      const strictDeclarations = Boolean(exercise?.validacao?.strictDeclarations);
      const a = tokenizeJavaScript(cleanActual, { strictDeclarations });
      const e = tokenizeJavaScript(cleanExpected, { strictDeclarations });
      syntaxOk = !checkJavaScriptSyntax(cleanActual) && a.errors.length === 0;
      const expectedTokens = e.tokens.filter(token => ![';', ','].includes(token.value));
      const actualTokens = a.tokens.filter(token => ![';', ','].includes(token.value));
      total = Math.max(1, expectedTokens.length);
      let cursor = 0;
      expectedTokens.forEach(expectedToken => { const index = actualTokens.findIndex((actualToken, actualIndex) => actualIndex >= cursor && actualToken.type === expectedToken.type && actualToken.value === expectedToken.value); if (index >= 0) { matched += 1; cursor = index + 1; } });
      detail = 'Comandos, funções e sequência lógica.';
    } else {
      const a = normalizeGeneric(cleanActual, lang);
      const e = normalizeGeneric(cleanExpected, lang);
      const actualTokens = Array.isArray(a) ? a : a.split(/\s+/);
      const expectedTokens = Array.isArray(e) ? e : e.split(/\s+/);
      total = Math.max(1, expectedTokens.length);
      let cursor = 0;
      expectedTokens.forEach(token => { const index = actualTokens.findIndex((candidate, candidateIndex) => candidateIndex >= cursor && candidate === token); if (index >= 0) { matched += 1; cursor = index + 1; } });
      if (lang === 'json') { try { JSON.parse(cleanActual); } catch (error) { syntaxOk = false; } }
      if (lang === 'xml') { const doc = new DOMParser().parseFromString(cleanActual, 'application/xml'); syntaxOk = !doc.querySelector('parsererror'); }
      detail = `Estrutura do arquivo ${exercise?.nomesArquivos?.[file] || file}.`;
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
    return { percentage, remaining: 100 - percentage, status, state, syntaxOk, message: `${detail} ${percentage === 100 ? 'O arquivo parece completo. Faça a validação final.' : 'Ainda há partes para concluir.'}` };
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
    const lang = exercise.linguagens?.[file] || file;
    const selectors = new Set();
    const functions = [];

    if (lang === 'html') {
      [...code.matchAll(/id=["']([^"']+)["']/g)].forEach(match => selectors.add(`#${match[1]}`));
      [...code.matchAll(/class=["']([^"']+)["']/g)].forEach(match => {
        match[1].split(/\s+/).filter(Boolean).forEach(className => selectors.add(`.${className}`));
      });
      [...code.matchAll(/<\s*(h1|h2|h3|p|button|input|label|main|section|article|form|ul|ol|li)\b/gi)]
        .forEach(match => selectors.add(match[1].toLowerCase()));
    }

    if (lang === 'css') {
      [...code.matchAll(/([^{}]+)\{/g)].forEach(match => {
        match[1].split(',').map(item => item.trim()).filter(Boolean).forEach(selector => {
          if (validSelector(selector)) selectors.add(selector);
        });
      });
    }

    if (lang === 'js') {
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

  function nonWebPreview(exercise, file) {
    const filename = exercise?.nomesArquivos?.[file] || 'arquivo';
    const lang = exercise?.linguagens?.[file] || file;
    const product = exercise?.produto || exercise?.objetivo || '';
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><style>body{margin:0;padding:30px;font-family:Arial;background:#07111f;color:#eef2ff}.card{max-width:720px;margin:auto;padding:24px;border:1px solid #324866;border-radius:18px;background:#10243a}code{color:#6ee7b7}p{line-height:1.6;color:#b9c7db}</style></head><body><section class="card"><h1>${escapeHtml(filename)}</h1><p><strong>Tipo:</strong> ${escapeHtml(lang)}</p><p>${escapeHtml(product)}</p><p>Este arquivo não é executado diretamente no preview Web. Use o ambiente indicado no exercício, como terminal Python, Android Studio, validador JSON/XML ou comandos Git.</p></section></body></html>`;
  }

  function buildPreviewDocument(exercise, options = {}) {
    const file = options.file || (exercise.ordemArquivos || [])[0] || 'html';
    const range = options.range || null;
    const tutorial = options.tutorial !== false;
    if (!exercise.arquivos?.html) return { srcdoc: nonWebPreview(exercise, file), functions: [], selectors: [], message: 'Arquivo não Web: use o ambiente indicado no roteiro.' };
    const targets = inferPreviewTargets(exercise, file, range);
    const css = exercise.arquivos.css || '';
    const js = exercise.arquivos.js || '';
    let html = cleanHtmlForPreview(exercise.arquivos.html || '<!DOCTYPE html><html><head></head><body></body></html>');
    const markerStyle = tutorial ? `<style id="__tutorial_style">.__tutorial_target{outline:4px solid #7c5cff!important;outline-offset:4px!important;box-shadow:0 0 0 9px rgba(124,92,255,.22)!important;position:relative;z-index:2147483000!important}#__tutorial_badge{position:fixed;top:10px;right:10px;z-index:2147483647;padding:8px 12px;border-radius:999px;background:#151025;color:white;border:2px solid #8d73ff;font:700 12px Arial}</style>` : '';
    const markerScript = tutorial ? `<script>window.addEventListener('DOMContentLoaded',function(){var selectors=${JSON.stringify(targets.selectors)};selectors.forEach(function(selector){try{document.querySelectorAll(selector).forEach(function(element){if(element!==document.body)element.classList.add('__tutorial_target')})}catch(error){}});var badge=document.createElement('div');badge.id='__tutorial_badge';badge.textContent='Resultado relacionado ao trecho';document.body.appendChild(badge)});<\/script>` : '';
    const actionBridge = `<script>window.addEventListener('message',function(event){var data=event.data||{};if(data.source!=='ds2sub-tutorial-action')return;var name=String(data.functionName||'');try{var fn=window[name];if(typeof fn!=='function')throw new Error('Função não encontrada');fn();parent.postMessage({source:'ds2sub-tutorial-result',requestId:data.requestId,ok:true,functionName:name},'*')}catch(error){parent.postMessage({source:'ds2sub-tutorial-result',requestId:data.requestId,ok:false,functionName:name,message:error&&error.message||String(error)},'*')}});<\/script>`;
    if (html.includes('</head>')) html = html.replace('</head>', `<style>${css}</style>${markerStyle}</head>`); else html = `<style>${css}</style>${markerStyle}${html}`;
    if (html.includes('</body>')) html = html.replace('</body>', `<script>${js.replaceAll('</script>', '<\\/script>')}<\/script>${markerScript}${actionBridge}</body>`); else html += `<script>${js.replaceAll('</script>', '<\\/script>')}<\/script>${markerScript}${actionBridge}`;
    const lang = exercise.linguagens?.[file] || file;
    return { srcdoc: html, functions: targets.functions, selectors: targets.selectors, message: ['html','css','js'].includes(lang) ? 'Visualização dos arquivos Web do exercício.' : 'O preview mostra o produto Web relacionado; o arquivo atual deve ser usado no ambiente indicado.' };
  }


  function diagnosticLineEntries(code) {
    return removeBom(code).split('\n').map((text, index) => ({
      text,
      line: index + 1,
      normalized: normalizeText(text)
    })).filter(item => item.normalized);
  }

  function firstAlignedDifference(actual, expected) {
    const a = diagnosticLineEntries(actual);
    const e = diagnosticLineEntries(expected);
    if (!a.length || !e.length) return { actualLine: a[0]?.line || 1, expectedLine: e[0]?.line || 1 };
    const rows = a.length + 1;
    const cols = e.length + 1;
    const table = Array.from({ length: rows }, () => new Uint16Array(cols));
    for (let i = a.length - 1; i >= 0; i -= 1) {
      for (let j = e.length - 1; j >= 0; j -= 1) {
        table[i][j] = a[i].normalized === e[j].normalized
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < a.length && j < e.length) {
      if (a[i].normalized === e[j].normalized) { i += 1; j += 1; continue; }
      return { actualLine: a[i]?.line || a[a.length - 1].line, expectedLine: e[j]?.line || e[e.length - 1].line };
    }
    if (i < a.length) return { actualLine: a[i].line, expectedLine: e[e.length - 1].line };
    if (j < e.length) return { actualLine: Math.min(removeBom(actual).split('\n').length, (a[a.length - 1]?.line || 1) + 1), expectedLine: e[j].line };
    return { actualLine: null, expectedLine: null };
  }

  function snippetAroundLine(code, line, radius = 1) {
    const lines = removeBom(code).split('\n');
    const target = Math.max(1, Math.min(Number(line || 1), Math.max(1, lines.length)));
    const start = Math.max(1, target - radius);
    const end = Math.min(lines.length, target + radius);
    return Array.from({ length: end - start + 1 }, (_, offset) => {
      const number = start + offset;
      const marker = number === target ? '>>' : '  ';
      return `${marker} ${String(number).padStart(3, ' ')} | ${lines[number - 1] ?? ''}`;
    }).join('\n');
  }

  function diagnosticContext(actual, expected, result = {}) {
    const aligned = firstAlignedDifference(actual, expected);
    const hinted = Number(result.firstLine);
    const actualTotal = Math.max(1, removeBom(actual).split('\n').length);
    const expectedTotal = Math.max(1, removeBom(expected).split('\n').length);
    const actualLine = Number.isFinite(hinted) && hinted >= 1 && hinted <= actualTotal ? hinted : aligned.actualLine;
    const expectedLine = aligned.expectedLine || (actualLine ? Math.min(actualLine, expectedTotal) : null);
    const issue = result.issues?.[0];
    let guidance = issue?.detail || result.summary || 'Compare os dois trechos e ajuste uma diferença por vez.';
    if (!actualLine) guidance += ' O diagnóstico não conseguiu apontar uma única linha; revise primeiro o item descrito em O que verificar.';
    return {
      actualLine: actualLine || null,
      expectedLine: expectedLine || null,
      actualSnippet: actualLine ? snippetAroundLine(actual, actualLine, 1) : 'Nenhuma linha específica foi identificada.',
      expectedSnippet: expectedLine ? snippetAroundLine(expected, expectedLine, 1) : 'Use o tutorial e a lista de requisitos para comparar.',
      guidance
    };
  }

  function glossaryTerm(term) {
    const data = GLOSSARY[term];
    if (!data) return null;
    return { id: term, termo: term, categoria: data.tipo, traducao: '', explicacao: data.definicao, erroComum: '', linguagem: 'conceito' };
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
    const contextual = Array.isArray(exercise?.glossario) ? exercise.glossario : [];
    const generic = extractTerms(exercise).filter(item => !contextual.some(entry => String(entry.termo || '').toLowerCase() === String(item.termo || '').toLowerCase()));
    const terms = [
      ...contextual.map(item => ({
        termo: item.termo, tipo: item.categoria || item.linguagem || 'Conceito', definicao: item.explicacao || '',
        significado: item.traducao || '', onde: item.ondeAparece || '', exemplo: item.exemploPratico || '', analogia: item.analogia || '', erro: item.erroComum || ''
      })),
      ...generic.map(item => ({ termo: item.termo, tipo: item.tipo, definicao: item.definicao }))
    ];
    if (!terms.length) return '<p>Nenhum termo especial foi identificado neste exercício.</p>';
    return `<div class="glossary-grid">${terms.map(item => `
      <article class="glossary-item glossary-item-rich">
        <div><code>${escapeHtml(item.termo)}</code><span>${escapeHtml(item.tipo || 'Conceito')}</span></div>
        ${item.significado ? `<p><strong>Significado:</strong> ${escapeHtml(item.significado)}</p>` : ''}
        <p>${escapeHtml(item.definicao || '')}</p>
        ${item.onde ? `<p><strong>Onde aparece:</strong> ${escapeHtml(item.onde)}</p>` : ''}
        ${item.exemplo ? `<p><strong>Exemplo:</strong> ${escapeHtml(item.exemplo)}</p>` : ''}
        ${item.analogia ? `<p><strong>Analogia:</strong> ${escapeHtml(item.analogia)}</p>` : ''}
        ${item.erro ? `<p class="glossary-error"><strong>Erro comum:</strong> ${escapeHtml(item.erro)}</p>` : ''}
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
      'Confira se IDs, seletores e nomes usados nos arquivos combinam entre si. Aspas, organização e nomes podem variar quando a solução continua correta e funcional.'
    ];
    const extra = teacher ? [...(exercise.professor?.notas || []), ...(exercise.professor?.erros || []).map(item => `Erro frequente: ${item}`)] : [];
    return `<ul class="drawer-list">${[...general, ...extra].map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function markdownToPreview(markdown) {
    return String(markdown || '').split(/\n\n/).map(paragraph => `<p>${paragraph
      .replace(/^\*\*(.*?)\*\*$/s, '<strong>$1</strong>')
      .replace(/^\*\*\*(.*?)\*\*\*$/s, '<strong><em>$1</em></strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/  \n/g, '<br>')
      .replace(/\n/g, '<br>')}</p>`).join('');
  }

  return {
    escapeHtml,
    highlight,
    renderCode,
    toast,
    copy,
    download,
    createZip,
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
    glossaryTerm,
    glossaryHtml,
    contextHtml,
    tipsHtml,
    markdownToPreview,
    nonWebPreview,
    diagnosticContext
  };
})();

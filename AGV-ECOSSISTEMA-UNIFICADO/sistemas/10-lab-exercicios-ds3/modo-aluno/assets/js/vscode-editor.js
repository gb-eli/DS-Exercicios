window.VSCodeEditor = (() => {
  let host = null;
  let model = null;
  let lineNumbers = null;
  let language = 'text';
  let history = [];
  let historyIndex = -1;
  let applying = false;
  let onRun = null;
  let onSave = null;
  let onToggleExplorer = null;
  let composing = false;

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  const jsKeywords = new Set('break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return static super switch this throw try typeof var void while with yield async await of true false null undefined'.split(' '));
  const pyKeywords = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
  const builtins = new Set('document window console Math JSON Array Object String Number Boolean Date Promise Set Map fetch localStorage sessionStorage querySelector getElementById addEventListener print input int float str len range list dict set tuple'.split(' '));

  function tokenSpan(cls, text) { return `<span class="${cls}">${escapeHtml(text)}</span>`; }

  function highlightCode(code, lang = language) {
    const source = String(code ?? '');
    const key = normalizeLanguage(lang);
    if (key === 'html') return highlightHtml(source);
    if (key === 'css') return highlightCss(source);
    if (key === 'js' || key === 'javascript') return highlightScript(source, false);
    if (key === 'py' || key === 'python') return highlightScript(source, true);
    if (key === 'json') return highlightJson(source);
    return escapeHtml(source);
  }

  function normalizeLanguage(value) {
    const raw = String(value || '').toLowerCase();
    if (raw.startsWith('html') || raw.endsWith('.html')) return 'html';
    if (raw.includes('css') || raw.endsWith('.css')) return 'css';
    if (raw === 'js' || raw.includes('javascript') || raw.endsWith('.js')) return 'js';
    if (raw === 'py' || raw.includes('python') || raw.endsWith('.py')) return 'py';
    if (raw.includes('json') || raw.endsWith('.json')) return 'json';
    return raw || 'text';
  }

  function highlightHtml(source) {
    let out = '';
    let i = 0;
    while (i < source.length) {
      if (source.startsWith('<!--', i)) {
        const end = source.indexOf('-->', i + 4);
        const j = end >= 0 ? end + 3 : source.length;
        out += tokenSpan('tok-comment', source.slice(i, j));
        i = j; continue;
      }
      if (source[i] === '<') {
        const end = source.indexOf('>', i + 1);
        if (end < 0) { out += escapeHtml(source.slice(i)); break; }
        const tag = source.slice(i, end + 1);
        out += highlightHtmlTag(tag);
        i = end + 1; continue;
      }
      const next = source.indexOf('<', i);
      const j = next < 0 ? source.length : next;
      out += escapeHtml(source.slice(i, j));
      i = j;
    }
    return out;
  }

  function highlightHtmlTag(tag) {
    const m = tag.match(/^(<\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?>)$/);
    if (!m) return tokenSpan('tok-tag', tag);
    let attrs = m[3] || '';
    let attrOut = '';
    const re = /(\s+)([\w:-]+)(\s*=\s*)?("[^"]*"|'[^']*'|[^\s>]+)?/g;
    let last = 0;
    let match;
    while ((match = re.exec(attrs))) {
      attrOut += escapeHtml(attrs.slice(last, match.index));
      attrOut += escapeHtml(match[1]);
      attrOut += tokenSpan('tok-attr', match[2]);
      if (match[3]) attrOut += escapeHtml(match[3]);
      if (match[4]) attrOut += tokenSpan('tok-string', match[4]);
      last = re.lastIndex;
    }
    attrOut += escapeHtml(attrs.slice(last));
    return `${tokenSpan('tok-punctuation', m[1])}${tokenSpan('tok-tag', m[2])}${attrOut}${tokenSpan('tok-punctuation', m[4])}`;
  }

  function highlightCss(source) {
    const re = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w-]+)|(#(?:[0-9a-fA-F]{3,8})\b)|(-?\d*\.?\d+(?:px|rem|em|vh|vw|%|s|ms|deg)?\b)|([A-Za-z_-][\w-]*)(\s*:)|([{}();,:])/g;
    let out = '', last = 0, m;
    while ((m = re.exec(source))) {
      out += escapeHtml(source.slice(last, m.index));
      if (m[1]) out += tokenSpan('tok-comment', m[1]);
      else if (m[2]) out += tokenSpan('tok-string', m[2]);
      else if (m[3]) out += tokenSpan('tok-keyword', m[3]);
      else if (m[4] || m[5]) out += tokenSpan('tok-number', m[4] || m[5]);
      else if (m[6]) out += `${tokenSpan('tok-property', m[6])}${escapeHtml(m[7])}`;
      else if (m[8]) out += tokenSpan('tok-punctuation', m[8]);
      last = re.lastIndex;
    }
    out += escapeHtml(source.slice(last));
    return out;
  }

  function highlightScript(source, python) {
    const keywordSet = python ? pyKeywords : jsKeywords;
    const comment = python ? /#[^\n]*/y : /\/\/[^\n]*|\/\*[\s\S]*?\*\//y;
    let out = '', i = 0;
    while (i < source.length) {
      comment.lastIndex = i;
      const cm = comment.exec(source);
      if (cm && cm.index === i) { out += tokenSpan('tok-comment', cm[0]); i = comment.lastIndex; continue; }
      const ch = source[i];
      if (ch === '"' || ch === "'" || (!python && ch === '`')) {
        const quote = ch; let j = i + 1; let escaped = false;
        while (j < source.length) {
          const c = source[j];
          if (!escaped && c === quote) { j += 1; break; }
          escaped = !escaped && c === '\\';
          if (c !== '\\') escaped = false;
          j += 1;
        }
        out += tokenSpan('tok-string', source.slice(i, j)); i = j; continue;
      }
      if (/\d/.test(ch) || (ch === '.' && /\d/.test(source[i + 1] || ''))) {
        const m = source.slice(i).match(/^\d*\.?\d+(?:e[+-]?\d+)?/i);
        out += tokenSpan('tok-number', m[0]); i += m[0].length; continue;
      }
      if (/[A-Za-z_$À-ÿ]/.test(ch)) {
        const m = source.slice(i).match(/^[A-Za-z_$À-ÿ][\w$À-ÿ]*/);
        const word = m[0];
        const rest = source.slice(i + word.length);
        const prev = source.slice(0, i).match(/\S(?=\s*$)/)?.[0] || '';
        let cls = 'tok-variable';
        if (keywordSet.has(word)) cls = 'tok-keyword';
        else if (builtins.has(word)) cls = 'tok-builtin';
        else if (/^\s*\(/.test(rest)) cls = 'tok-fn';
        else if (prev === '.') cls = 'tok-property';
        out += tokenSpan(cls, word); i += word.length; continue;
      }
      if (/^[{}()[\].,;:+\-*\/%=<>!&|?]$/.test(ch)) out += tokenSpan('tok-punctuation', ch);
      else out += escapeHtml(ch);
      i += 1;
    }
    return out;
  }

  function highlightJson(source) {
    const re = /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;
    let out = '', last = 0, m;
    while ((m = re.exec(source))) {
      out += escapeHtml(source.slice(last, m.index));
      if (m[1]) out += tokenSpan('tok-property', m[1]);
      else if (m[2]) out += tokenSpan('tok-string', m[2]);
      else if (m[3]) out += tokenSpan('tok-keyword', m[0]);
      else out += tokenSpan('tok-number', m[0]);
      last = re.lastIndex;
    }
    return out + escapeHtml(source.slice(last));
  }

  function readDomText() {
    if (!host) return '';
    return host.innerText.replace(/\r\n?/g, '\n').replace(/\n\n(?=\n)/g, '\n');
  }

  function selectionOffsets() {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !host?.contains(selection.anchorNode)) return { start: model?.value.length || 0, end: model?.value.length || 0 };
    const range = selection.getRangeAt(0);
    const preStart = range.cloneRange();
    preStart.selectNodeContents(host);
    preStart.setEnd(range.startContainer, range.startOffset);
    const preEnd = range.cloneRange();
    preEnd.selectNodeContents(host);
    preEnd.setEnd(range.endContainer, range.endOffset);
    return { start: preStart.toString().length, end: preEnd.toString().length };
  }

  function textNodeAtOffset(root, offset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node; let remaining = Math.max(0, offset);
    while ((node = walker.nextNode())) {
      if (remaining <= node.nodeValue.length) return { node, offset: remaining };
      remaining -= node.nodeValue.length;
    }
    return { node: root, offset: root.childNodes.length };
  }

  function setSelection(start, end = start) {
    if (!host) return;
    const a = textNodeAtOffset(host, start);
    const b = textNodeAtOffset(host, end);
    const range = document.createRange();
    try { range.setStart(a.node, a.offset); range.setEnd(b.node, b.offset); } catch { range.selectNodeContents(host); range.collapse(false); }
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
  }

  function render({ preserveSelection = true } = {}) {
    if (!host || !model) return;
    const offsets = preserveSelection ? selectionOffsets() : null;
    const scrollTop = host.scrollTop;
    const scrollLeft = host.scrollLeft;
    applying = true;
    host.innerHTML = highlightCode(model.value, language) || '<br>';
    host.scrollTop = scrollTop; host.scrollLeft = scrollLeft;
    applying = false;
    updateLines();
    if (offsets && document.activeElement === host) setSelection(offsets.start, offsets.end);
    updateStatus();
  }

  function syncFromHost() {
    if (applying || composing || !model) return;
    const offsets = selectionOffsets();
    let value = readDomText();
    if (host.innerText.endsWith('\n') && !value.endsWith('\n')) value += '\n';
    model.value = value;
    pushHistory(value);
    model.dispatchEvent(new Event('input', { bubbles: true }));
    render({ preserveSelection: false });
    setSelection(Math.min(offsets.start, value.length), Math.min(offsets.end, value.length));
  }

  function updateLines() {
    if (!lineNumbers || !model) return;
    const count = Math.max(1, model.value.split('\n').length);
    const active = lineColumn().line;
    lineNumbers.innerHTML = Array.from({ length: count }, (_, i) => `<div class="${i + 1 === active ? 'active' : ''}">${i + 1}</div>`).join('');
    lineNumbers.scrollTop = host?.scrollTop || 0;
  }

  function lineColumn() {
    const off = selectionOffsets().end;
    const before = (model?.value || '').slice(0, off).split('\n');
    return { line: before.length, column: (before[before.length - 1] || '').length + 1 };
  }

  function updateStatus() {
    const pos = lineColumn();
    document.querySelector('[data-vs-linecol]')?.replaceChildren(document.createTextNode(`Ln ${pos.line}, Col ${pos.column}`));
    document.querySelector('[data-vs-language]')?.replaceChildren(document.createTextNode(languageLabel(language)));
  }

  function languageLabel(lang) {
    const key = normalizeLanguage(lang);
    return ({ html: 'HTML', css: 'CSS', js: 'JavaScript', py: 'Python', json: 'JSON' })[key] || 'Texto';
  }

  function pushHistory(value) {
    if (history[historyIndex] === value) return;
    history = history.slice(0, historyIndex + 1);
    history.push(value);
    if (history.length > 120) history.shift();
    historyIndex = history.length - 1;
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex -= 1; setValue(history[historyIndex], { record: false }); dispatchModelInput();
  }
  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1; setValue(history[historyIndex], { record: false }); dispatchModelInput();
  }
  function dispatchModelInput() { model?.dispatchEvent(new Event('input', { bubbles: true })); }

  function replaceSelection(text, selectInserted = false) {
    const { start, end } = selectionOffsets();
    const value = model.value;
    const next = value.slice(0, start) + text + value.slice(end);
    setValue(next);
    const nextEnd = start + text.length;
    setSelection(selectInserted ? start : nextEnd, nextEnd);
    dispatchModelInput();
  }

  function handleTab(event) {
    event.preventDefault();
    const { start, end } = selectionOffsets();
    const value = model.value;
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const selected = value.slice(lineStart, end);
    if (start !== end || selected.includes('\n')) {
      const lines = selected.split('\n');
      const changed = event.shiftKey
        ? lines.map(line => line.startsWith('    ') ? line.slice(4) : line.startsWith('\t') ? line.slice(1) : line.replace(/^ {1,3}/, '')).join('\n')
        : lines.map(line => `    ${line}`).join('\n');
      const next = value.slice(0, lineStart) + changed + value.slice(end);
      setValue(next);
      setSelection(lineStart, lineStart + changed.length);
      dispatchModelInput();
    } else if (event.shiftKey) {
      const before = value.slice(lineStart, start);
      const removable = before.match(/(?: {1,4}|\t)$/)?.[0] || '';
      if (!removable) return;
      const next = value.slice(0, start - removable.length) + value.slice(start);
      setValue(next); setSelection(start - removable.length); dispatchModelInput();
    } else replaceSelection('    ');
  }

  function notifyManualTyping() {
    if (window.Utils?.toast) window.Utils.toast('Digitação manual: copiar, recortar e colar estão desativados no editor desta atividade.');
  }

  function blockClipboardEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    notifyManualTyping();
  }

  function handleKeydown(event) {
    const mod = event.ctrlKey || event.metaKey;
    if (mod && ['c','v','x'].includes(event.key.toLowerCase())) { blockClipboardEvent(event); return; }
    if (event.key === 'Tab') return handleTab(event);
    if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); onSave?.(); return; }
    if (mod && event.key === 'Enter') { event.preventDefault(); onRun?.(); return; }
    if (mod && event.key.toLowerCase() === 'b') { event.preventDefault(); onToggleExplorer?.(); return; }
    if (mod && event.key.toLowerCase() === 'z' && !event.shiftKey) { event.preventDefault(); undo(); return; }
    if ((mod && event.key.toLowerCase() === 'y') || (mod && event.shiftKey && event.key.toLowerCase() === 'z')) { event.preventDefault(); redo(); }
  }

  function init(options = {}) {
    host = document.getElementById(options.hostId || 'studentCodeEditor');
    model = document.getElementById(options.modelId || 'studentEditor');
    lineNumbers = document.getElementById(options.lineNumbersId || 'lineNumbers');
    onRun = options.onRun || null; onSave = options.onSave || null; onToggleExplorer = options.onToggleExplorer || null;
    if (!host || !model) return false;
    host.addEventListener('compositionstart', () => { composing = true; });
    host.addEventListener('compositionend', () => { composing = false; syncFromHost(); });
    host.addEventListener('input', syncFromHost);
    host.addEventListener('keydown', handleKeydown);
    host.addEventListener('copy', blockClipboardEvent);
    host.addEventListener('cut', blockClipboardEvent);
    host.addEventListener('paste', blockClipboardEvent);
    host.addEventListener('drop', blockClipboardEvent);
    host.addEventListener('beforeinput', event => {
      if (['insertFromPaste','insertFromDrop'].includes(event.inputType)) blockClipboardEvent(event);
    });
    host.addEventListener('scroll', () => { if (lineNumbers) lineNumbers.scrollTop = host.scrollTop; });
    host.addEventListener('click', updateStatus);
    host.addEventListener('keyup', updateStatus);
    host.addEventListener('focus', updateStatus);
    history = [model.value || '']; historyIndex = 0;
    setLanguage(options.language || 'html');
    setValue(model.value || '', { record: false });
    return true;
  }

  function setValue(value, { record = true, resetHistory = false } = {}) {
    if (!model) return;
    model.value = String(value ?? '');
    if (resetHistory) { history = [model.value]; historyIndex = 0; }
    else if (record) pushHistory(model.value);
    render({ preserveSelection: false });
  }
  function getValue() { return model?.value || ''; }
  function setLanguage(value) { const next = normalizeLanguage(value); if (next === language) return; language = next; host?.setAttribute('data-language', language); render(); }
  function focus() { host?.focus(); updateStatus(); }
  function selectAll() { if (!host) return; host.focus(); setSelection(0, getValue().length); }
  function getSelection() { return selectionOffsets(); }
  function selectRange(start, end) { host?.focus(); setSelection(start, end); updateStatus(); }
  function getLineColumn() { return lineColumn(); }

  return { init, setValue, getValue, setLanguage, focus, selectAll, selectRange, getSelection, getLineColumn, highlightCode, languageLabel, undo, redo };
})();

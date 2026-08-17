window.AppShell = (() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const HELP_CONTENT = {
    vscode: `
      <h2>Como preparar o exercício no VS Code</h2>
      <ol class="guide-steps">
        <li>Crie no computador uma pasta chamada <code>atividades-praticas</code>.</li>
        <li>Dentro dela, crie a pasta do exercício, por exemplo <code>exercicio-10</code>.</li>
        <li>Na plataforma, use o <strong>Explorador</strong> para organizar a pasta do exercício e os arquivos. No computador, a mesma estrutura pode ser aberta no VS Code.</li>
        <li>No Explorador do VS Code, crie os arquivos <code>index.html</code>, <code>estilo.css</code> e <code>script.js</code> dentro da pasta do exercício.</li>
        <li>Use <strong>Ctrl + S</strong> para salvar localmente e <strong>Ctrl + Enter</strong> para executar/atualizar o projeto Web.</li><li>Use Preview para HTML/CSS/JS, Console para mensagens JavaScript e Terminal para organizar o sistema de arquivos virtual.</li>
      </ol>
      <div class="guide-warning">Não misture os arquivos de exercícios diferentes na mesma pasta.</div>`,
    testar: `
      <h2>Como testar o código</h2>
      <div class="guide-columns">
        <div><h3>Na plataforma</h3><ol class="guide-steps"><li>Digite o código no editor.</li><li>Use <strong>Executar projeto</strong>.</li><li>Teste campos, botões e mensagens.</li><li>Valide o arquivo para liberar a próxima etapa.</li></ol></div>
        <div><h3>No computador</h3><ol class="guide-steps"><li>Salve os três arquivos.</li><li>Abra <code>index.html</code> no navegador.</li><li>Depois de alterar o código, salve e atualize a página.</li><li>Abra o console do navegador se algo não funcionar.</li></ol></div>
      </div>
      <p class="muted">Exercícios futuros que usam arquivos JSON ou APIs poderão precisar de um servidor local. A própria atividade indicará quando isso for necessário.</p>`,
    github: `
      <h2>Como criar o repositório e enviar os exercícios</h2>
      <ol class="guide-steps">
        <li>Entre no GitHub e crie um repositório chamado <code>atividades-praticas</code>.</li>
        <li>Abra o repositório e escolha <strong>Add file > Upload files</strong>.</li>
        <li>Envie a pasta <code>exercicio-XX</code>. Se a pasta não for preservada pelo navegador, crie a pasta primeiro e envie os arquivos dentro dela.</li>
        <li>Confirme a alteração para registrar o envio.</li>
        <li>Verifique se a pasta contém os arquivos corretos.</li>
        <li>Copie o endereço do repositório para entregar no Classroom.</li>
      </ol>
      <pre class="folder-tree">atividades-praticas/
- exercicio-01/
- exercicio-02/
- exercicio-XX/
  - index.html
  - estilo.css
  - script.js</pre>
      <div class="guide-warning"><strong>Atenção:</strong> não envie os arquivos soltos na raiz do repositório.</div>`,
    classroom: `
      <h2>Como entregar no Google Classroom</h2>
      <ol class="guide-steps">
        <li>Confirme no GitHub se a pasta do exercício está completa.</li>
        <li>Copie o link do repositório <code>atividades-praticas</code>.</li>
        <li>Use o botão <strong>Abrir Classroom</strong> da plataforma.</li>
        <li>Abra a atividade correspondente ao exercício.</li>
        <li>Anexe ou informe o link do repositório.</li>
        <li>Revise o link e clique em entregar.</li>
      </ol>
      <div class="guide-success">A entrega é o link do repositório, não somente uma captura de tela.</div>`,
    atalhos: `
      <h2>Atalhos e organização</h2>
      <dl class="shortcut-list">
        <div><dt>Ctrl + S</dt><dd>Salvar o arquivo no VS Code.</dd></div>
        <div><dt>Tab</dt><dd>Indentar o código no editor da plataforma.</dd></div>
        <div><dt>Ctrl + Z</dt><dd>Desfazer a última alteração.</dd></div>
        <div><dt>F12</dt><dd>Abrir as ferramentas do navegador para consultar erros.</dd></div>
      </dl>
      <p>Mantenha uma linha em branco entre blocos importantes e confira se todas as tags, chaves e parênteses foram fechados.</p>`
  };

  function selectHelp(tab) {
    const body = $('#helpBody');
    if (body) body.innerHTML = HELP_CONTENT[tab] || HELP_CONTENT.vscode;
    $$('[data-help-tab]').forEach(button => {
      button.classList.toggle('active', button.dataset.helpTab === tab);
    });
  }

  function initHelp() {
    $$('[data-open-help]').forEach(button => {
      button.addEventListener('click', () => openHelp(button.dataset.openHelp || 'vscode'));
    });
    $$('[data-close-help]').forEach(button => button.addEventListener('click', closeHelp));
    $$('[data-help-tab]').forEach(button => {
      button.addEventListener('click', () => selectHelp(button.dataset.helpTab));
    });
    const modal = $('#helpModal');
    if (modal) modal.addEventListener('click', event => { if (event.target === modal) closeHelp(); });
  }

  function initExternalLinks() {
    $$('[data-open-github]').forEach(button => button.addEventListener('click', Utils.openGithub));
    $$('[data-config-github]').forEach(button => button.addEventListener('click', Utils.configureGithub));
    $$('[data-open-classroom]').forEach(button => button.addEventListener('click', Utils.openClassroom));
  }

  function initInfoDrawer() {
    $$('[data-close-info]').forEach(button => button.addEventListener('click', closeInfo));
    const drawer = $('#infoDrawer');
    if (drawer) drawer.addEventListener('click', event => { if (event.target === drawer) closeInfo(); });
  }



  const CODE_FONT_STORAGE = 'ds2_code_font_size_v1';
  const PREVIEW_ZOOM_STORAGE = 'ds2_preview_zoom_v1';
  const CODE_FONT_MIN = 12;
  const CODE_FONT_MAX = 22;
  const CODE_FONT_STEP = 1;
  const PREVIEW_ZOOM_MIN = 0.75;
  const PREVIEW_ZOOM_MAX = 1.35;
  const PREVIEW_ZOOM_STEP = 0.1;
  let codeFontCustom = Utils.storageGet(CODE_FONT_STORAGE) !== null;
  let currentCodeFont = Number(Utils.storageGet(CODE_FONT_STORAGE)) || defaultCodeFont();
  let currentPreviewZoom = Number(Utils.storageGet(PREVIEW_ZOOM_STORAGE)) || 1;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function defaultCodeFont() {
    return window.matchMedia('(max-width: 760px)').matches ? 13 : 15;
  }

  function applyCodeFont(size, persist = true) {
    currentCodeFont = clamp(Number(size) || defaultCodeFont(), CODE_FONT_MIN, CODE_FONT_MAX);
    document.documentElement.style.setProperty('--code-font-size', `${currentCodeFont}px`);
    $$('[data-code-font-value]').forEach(label => { label.textContent = `${currentCodeFont} px`; });
    if (persist) {
      codeFontCustom = true;
      Utils.storageSet(CODE_FONT_STORAGE, String(currentCodeFont));
    }
  }

  function resetCodeFont() {
    codeFontCustom = false;
    Utils.storageRemove(CODE_FONT_STORAGE);
    applyCodeFont(defaultCodeFont(), false);
  }

  function codeControlsMarkup() {
    return `<div class="code-view-controls" aria-label="Ajustar tamanho da fonte do código">
      <span class="code-control-label">Fonte</span>
      <button type="button" class="ghost compact code-control-button" data-code-font="decrease" title="Diminuir fonte" aria-label="Diminuir fonte do código">A−</button>
      <button type="button" class="ghost compact code-control-value" data-code-font="reset" title="Voltar ao tamanho padrão" aria-label="Voltar ao tamanho padrão"><span data-code-font-value>${currentCodeFont} px</span></button>
      <button type="button" class="ghost compact code-control-button" data-code-font="increase" title="Aumentar fonte" aria-label="Aumentar fonte do código">A+</button>
    </div>`;
  }

  function initCodeDisplayControls() {
    $$('.code-window .code-titlebar').forEach(titlebar => {
      if (titlebar.querySelector('.code-view-controls')) return;
      titlebar.insertAdjacentHTML('beforeend', codeControlsMarkup());
    });
    applyCodeFont(currentCodeFont, false);
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-code-font]');
      if (!button) return;
      const action = button.dataset.codeFont;
      if (action === 'decrease') applyCodeFont(currentCodeFont - CODE_FONT_STEP);
      if (action === 'increase') applyCodeFont(currentCodeFont + CODE_FONT_STEP);
      if (action === 'reset') resetCodeFont();
    });
    window.addEventListener('resize', () => {
      if (!codeFontCustom) applyCodeFont(defaultCodeFont(), false);
    });
  }

  function previewControlsMarkup(targetSelector) {
    return `<div class="preview-zoom-controls" aria-label="Ajustar zoom do preview">
      <span class="preview-control-label">Zoom</span>
      <button type="button" class="ghost compact" data-preview-zoom="decrease" data-preview-target="${targetSelector}" title="Diminuir zoom" aria-label="Diminuir zoom do preview">−</button>
      <button type="button" class="ghost compact preview-zoom-value" data-preview-zoom="reset" data-preview-target="${targetSelector}" title="Voltar ao zoom padrão" aria-label="Voltar ao zoom padrão"><span data-preview-zoom-value>${Math.round(currentPreviewZoom * 100)}%</span></button>
      <button type="button" class="ghost compact" data-preview-zoom="increase" data-preview-target="${targetSelector}" title="Aumentar zoom" aria-label="Aumentar zoom do preview">+</button>
    </div>`;
  }

  function applyPreviewZoom(frame, zoom, persist = true) {
    if (!frame) return;
    currentPreviewZoom = clamp(Math.round((Number(zoom) || 1) * 100) / 100, PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX);
    const iframe = frame.querySelector('iframe');
    if (iframe) {
      iframe.style.zoom = String(currentPreviewZoom);
      iframe.dataset.previewZoom = String(currentPreviewZoom);
    }
    const shell = frame.closest('.preview-shell');
    shell?.querySelectorAll('[data-preview-zoom-value]').forEach(label => {
      label.textContent = `${Math.round(currentPreviewZoom * 100)}%`;
    });
    if (persist) Utils.storageSet(PREVIEW_ZOOM_STORAGE, String(currentPreviewZoom));
  }

  function ensureNotebookButton(toolbar, targetSelector) {
    const group = toolbar.querySelector('[data-preview-device]')?.closest('.preview-toolbar-group');
    if (!group || group.querySelector('[data-preview-device="notebook"]')) return;
    const tablet = group.querySelector('[data-preview-device="tablet"]');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary compact';
    button.dataset.previewDevice = 'notebook';
    button.dataset.previewTarget = targetSelector;
    button.textContent = 'Notebook';
    button.title = 'Simular tela de notebook';
    if (tablet) group.insertBefore(button, tablet);
    else group.appendChild(button);
  }

  function defaultPreviewDevice() {
    if (window.matchMedia('(max-width: 520px)').matches) return 'mobile';
    if (window.matchMedia('(max-width: 900px)').matches) return 'tablet';
    if (window.matchMedia('(max-width: 1450px)').matches) return 'notebook';
    return 'desktop';
  }

  function initPreviewDisplayControls() {
    $$('.preview-shell .preview-toolbar').forEach(toolbar => {
      const deviceButton = toolbar.querySelector('[data-preview-device]');
      const targetSelector = deviceButton?.dataset.previewTarget;
      if (!targetSelector) return;
      ensureNotebookButton(toolbar, targetSelector);
      setDevice(document.querySelector(targetSelector), defaultPreviewDevice());
      if (!toolbar.querySelector('.preview-zoom-controls')) {
        toolbar.insertAdjacentHTML('beforeend', previewControlsMarkup(targetSelector));
      }
      applyPreviewZoom(document.querySelector(targetSelector), currentPreviewZoom, false);
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-preview-zoom]');
      if (!button) return;
      const frame = document.querySelector(button.dataset.previewTarget);
      const action = button.dataset.previewZoom;
      if (action === 'decrease') applyPreviewZoom(frame, currentPreviewZoom - PREVIEW_ZOOM_STEP);
      if (action === 'increase') applyPreviewZoom(frame, currentPreviewZoom + PREVIEW_ZOOM_STEP);
      if (action === 'reset') applyPreviewZoom(frame, 1);
    });
  }



const overlayFocus = new WeakMap();

function pageElements() {
  return [...document.body.children].filter(element => element.tagName !== 'SCRIPT');
}

function setPageInert(enabled, except) {
  pageElements().forEach(element => {
    if (element === except || element.id === 'authGate') return;
    if (enabled) { element.inert = true; element.setAttribute('aria-hidden', 'true'); element.dataset.shellInert = 'true'; }
    else if (element.dataset.shellInert === 'true') { element.inert = false; element.removeAttribute('aria-hidden'); delete element.dataset.shellInert; }
  });
}

function visibleFocusable(container) {
  return [...container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.hidden && element.offsetParent !== null);
}

function openOverlay(element) {
  if (!element) return;
  overlayFocus.set(element, document.activeElement);
  document.querySelectorAll('.modal-backdrop:not([hidden]),.drawer-backdrop:not([hidden])').forEach(open => { if (open !== element) closeOverlay(open, false); });
  element.hidden = false;
  element.setAttribute('aria-hidden', 'false');
  setPageInert(true, element);
  const first = visibleFocusable(element)[0] || element;
  setTimeout(() => first.focus(), 20);
}

function closeOverlay(element, restore = true) {
  if (!element || element.hidden) return;
  element.hidden = true;
  element.setAttribute('aria-hidden', 'true');
  setPageInert(false, element);
  const previous = overlayFocus.get(element);
  if (restore && previous?.focus) setTimeout(() => previous.focus(), 20);
}

function openHelp(tab = 'vscode') {
  const modal = $('#helpModal');
  if (!modal) return;
  selectHelp(tab);
  openOverlay(modal);
}

function closeHelp() { closeOverlay($('#helpModal')); }

function openInfo(title, html) {
  const drawer = $('#infoDrawer');
  if (!drawer) return;
  const titleElement = $('#infoDrawerTitle');
  const body = $('#infoDrawerBody');
  if (titleElement) titleElement.textContent = title;
  if (body) body.innerHTML = html;
  openOverlay(drawer);
}

function closeInfo() { closeOverlay($('#infoDrawer')); }

function setDevice(frame, device) {
  if (!frame) return;
  frame.dataset.device = device;
  const group = frame.closest('.preview-shell') || frame.parentElement;
  group?.querySelectorAll('[data-preview-device]').forEach(button => {
    const active = button.dataset.previewDevice === device;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function initMobileMenu() {
  $$('[data-menu-toggle]').forEach(button => {
    const target = document.querySelector(button.dataset.menuTarget || '.header-actions');
    button.addEventListener('click', event => {
      event.stopPropagation();
      if (!target) return;
      const opened = target.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', String(opened));
    });
  });
  document.addEventListener('click', event => {
    if (event.target.closest('.header-actions,[data-menu-toggle]')) return;
    document.querySelectorAll('.header-actions.menu-open').forEach(menu => menu.classList.remove('menu-open'));
    document.querySelectorAll('[data-menu-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  });
}


function setFullscreenSiblingsInert(shell, enabled) {
  let node = shell;
  while (node && node !== document.body) {
    const parent = node.parentElement;
    if (!parent) break;
    [...parent.children].forEach(sibling => {
      if (sibling === node || sibling.tagName === 'SCRIPT') return;
      if (enabled) {
        sibling.inert = true;
        sibling.setAttribute('aria-hidden', 'true');
        sibling.dataset.previewInert = 'true';
      } else if (sibling.dataset.previewInert === 'true') {
        sibling.inert = false;
        sibling.removeAttribute('aria-hidden');
        delete sibling.dataset.previewInert;
      }
    });
    node = parent;
  }
}

function closeFullscreenShell(shell, restore = true) {
  if (!shell) return;
  shell.classList.remove('preview-fullscreen');
  shell.removeAttribute('role');
  shell.removeAttribute('aria-modal');
  shell.removeAttribute('tabindex');
  setFullscreenSiblingsInert(shell, false);
  document.body.classList.remove('preview-open');
  shell.querySelectorAll('[data-preview-fullscreen]').forEach(item => item.setAttribute('aria-pressed', 'false'));
  const previous = overlayFocus.get(shell);
  if (restore && previous?.focus) previous.focus();
}

function initDeviceControls() {
  $$('[data-preview-device]').forEach(button => button.addEventListener('click', () => setDevice(document.querySelector(button.dataset.previewTarget), button.dataset.previewDevice)));
  $$('[data-preview-fullscreen]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.previewTarget);
      const shell = target?.closest('.preview-shell');
      if (!shell) return;
      const opening = !shell.classList.contains('preview-fullscreen');
      document.querySelectorAll('.preview-shell.preview-fullscreen').forEach(open => { if (open !== shell) closeFullscreenShell(open, false); });
      if (!opening) { closeFullscreenShell(shell); return; }
      overlayFocus.set(shell, button);
      shell.classList.add('preview-fullscreen');
      shell.setAttribute('role', 'dialog');
      shell.setAttribute('aria-modal', 'true');
      shell.setAttribute('tabindex', '-1');
      setFullscreenSiblingsInert(shell, true);
      document.body.classList.add('preview-open');
      button.setAttribute('aria-pressed', 'true');
      setTimeout(() => shell.focus(), 20);
    });
  });
}

function closeFullscreen() {
  closeFullscreenShell(document.querySelector('.preview-shell.preview-fullscreen'));
}

function initEscapeKey() {
  document.addEventListener('keydown', event => {
    const fullscreen = document.querySelector('.preview-shell.preview-fullscreen');
    const overlay = document.querySelector('.modal-backdrop:not([hidden]),.drawer-backdrop:not([hidden])');
    const openDialog = fullscreen || overlay;
    if (event.key === 'Tab' && openDialog) {
      const items = visibleFocusable(openDialog);
      if (items.length) {
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    if (event.key !== 'Escape') return;
    if (fullscreen) { event.preventDefault(); closeFullscreenShell(fullscreen); return; }
    if (overlay) { event.preventDefault(); closeOverlay(overlay); return; }
    document.querySelectorAll('.header-actions.menu-open').forEach(menu => menu.classList.remove('menu-open'));
    document.querySelectorAll('[data-menu-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  });
}


  function init() {
    initMobileMenu();
    initHelp();
    initExternalLinks();
    initPreviewDisplayControls();
    initDeviceControls();
    initCodeDisplayControls();
    initInfoDrawer();
    initEscapeKey();
  }

  return { init, openHelp, closeHelp, openInfo, closeInfo, setDevice, openOverlay, closeOverlay };
})();

document.addEventListener('DOMContentLoaded', () => AppShell.init());

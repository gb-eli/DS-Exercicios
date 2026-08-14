const $ = (selector, root = document) => root.querySelector(selector);

const TOOL_DEMOS = {
  base64: {
    title: 'Base64', input: 'Q1RGe1RPT0xfUkVBRFl9', fields: { action: 'decode' },
    concept: 'Base64 muda a representação dos dados. Não é criptografia e não protege segredos.',
    outcome: 'A saída revela CTF{TOOL_READY}.',
  },
  caesar: {
    title: 'Cifra de César', input: 'VHFXULWB', fields: { shift: '-3' },
    concept: 'Cada letra é deslocada no alfabeto. É útil para aprender cifras clássicas, mas é insegura para dados reais.',
    outcome: 'O deslocamento -3 recupera SECURITY.',
  },
  binary: {
    title: 'Binário', input: '01000011 01010100 01000110', fields: { action: 'decode' },
    concept: 'Cada grupo de oito bits representa um byte. A ferramenta reconstrói os caracteres correspondentes.',
    outcome: 'Os três bytes formam CTF.',
  },
  hex: {
    title: 'Hexadecimal', input: '43 54 46', fields: { action: 'decode' },
    concept: 'Hexadecimal representa bytes de forma compacta e aparece em análise forense, arquivos e memória.',
    outcome: 'Os bytes 43 54 46 formam CTF.',
  },
  rot13: {
    title: 'ROT13', input: 'PLORE', fields: {},
    concept: 'ROT13 troca cada letra pela que está treze posições adiante. Aplicar novamente desfaz a transformação.',
    outcome: 'PLORE se transforma em CYBER.',
  },
  hash: {
    title: 'SHA-256', input: 'CTFDS', fields: {},
    concept: 'Hash gera um resumo de tamanho fixo. Ele ajuda a verificar integridade, mas não é reversível como uma cifra.',
    outcome: 'A saída será um resumo hexadecimal com 64 caracteres.',
  },
  json: {
    title: 'JSON', input: '{"event":"login","risk":75,"blocked":false}', fields: {},
    concept: 'JSON é comum em APIs, logs e configurações. Validar sua estrutura evita interpretar dados malformados.',
    outcome: 'O objeto será validado e formatado com indentação.',
  },
  jwt: {
    title: 'JWT Viewer', input: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhbHVubyIsInJvbGUiOiJhbmFseXN0In0.', fields: {},
    concept: 'Um JWT pode ser decodificado sem conhecer a chave. Isso não significa que sua assinatura seja válida.',
    outcome: 'A ferramenta mostra o header e o payload fictícios.',
  },
  url: {
    title: 'Inspetor de URL', input: 'https://portal.exemplo.local/login?next=%2Fadmin', fields: {},
    concept: 'Uma URL separa protocolo, host, porta, caminho, parâmetros e fragmento. A ferramenta apenas analisa o texto.',
    outcome: 'O relatório identifica portal.exemplo.local como host.',
  },
  password: {
    title: 'Analisador de Senha', input: 'Uma-Frase#Longa2026', fields: {},
    concept: 'Comprimento, variedade e imprevisibilidade aumentam a resistência. Nunca use sua senha real no laboratório.',
    outcome: 'A frase temporária recebe uma avaliação didática de força.',
  },
  logs: {
    title: 'Analisador de Logs', input: '2026-07-29T08:00:00Z auth FAIL user=admin ip=10.0.0.23\n2026-07-29T08:00:03Z auth OK user=aluno ip=10.0.0.8\n2026-07-29T08:00:05Z auth FAIL user=admin ip=10.0.0.23', fields: {},
    concept: 'Logs permitem reconstruir eventos, localizar padrões e priorizar alertas sem tocar no sistema original.',
    outcome: 'O relatório destaca 10.0.0.23 como origem mais frequente.',
  },
  headers: {
    title: 'Headers HTTP', input: "content-security-policy: default-src 'self'\nx-content-type-options: nosniff\nstrict-transport-security: max-age=31536000", fields: {},
    concept: 'Headers defensivos reduzem riscos no navegador, mas precisam ser combinados com código e configuração seguros.',
    outcome: 'O checklist identifica os controles presentes e ausentes.',
  },
  risk: {
    title: 'Risco Transacional', input: 'device_new\npassword_reset\nunusual_value\nrapid_transfers', fields: {},
    concept: 'Motores antifraude combinam sinais. Um único evento raramente é suficiente para concluir que existe fraude.',
    outcome: 'A combinação produz um escore didático alto.',
  },
};

let tour = null;
let resizeHandler = null;
let actionToken = 0;

const ui = () => ({
  root: $('#guided-tour'), spotlight: $('#tour-spotlight'), cursor: $('#tour-cursor'), card: $('#tour-card'),
  kicker: $('#tour-kicker'), title: $('#tour-title'), text: $('#tour-text'), progress: $('#tour-progress'),
  bar: $('#tour-progress-bar'), previous: $('#tour-previous'), pause: $('#tour-pause'), next: $('#tour-next'), skip: $('#tour-skip'),
});

const visibleElement = (selector) => {
  if (!selector) return null;
  const candidates = typeof selector === 'function' ? [selector()] : [...document.querySelectorAll(selector)];
  return candidates.find((element) => element && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden') || candidates[0] || null;
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const typeInto = async (element, value, speed = 24) => {
  if (!element) return;
  element.focus({ preventScroll: true });
  element.value = '';
  element.dispatchEvent(new Event('input', { bubbles: true }));
  for (const char of String(value)) {
    if (!tour?.active) return;
    element.value += char;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(speed);
  }
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const setFieldValue = (form, name, value) => {
  const field = form?.elements?.namedItem(name);
  if (!field) return;
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
};

const rectFor = (element) => {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    left: Math.max(8, rect.left - 7), top: Math.max(8, rect.top - 7),
    width: Math.max(28, Math.min(innerWidth - 16, rect.width + 14)),
    height: Math.max(28, Math.min(innerHeight - 16, rect.height + 14)),
  };
};

const placeCard = (targetRect, placement = 'auto') => {
  const { card } = ui();
  if (!card) return;
  if (innerWidth < 720) {
    card.style.left = '12px';
    card.style.right = '12px';
    card.style.top = 'auto';
    card.style.bottom = `calc(12px + env(safe-area-inset-bottom))`;
    card.style.width = 'auto';
    return;
  }
  if (!targetRect) {
    const width = Math.min(520, innerWidth - 32);
    card.style.width = `${width}px`;
    card.style.left = `${Math.round((innerWidth - width) / 2)}px`;
    card.style.right = 'auto';
    card.style.top = `${Math.max(24, Math.round((innerHeight - Math.min(card.offsetHeight || 300, 360)) / 2))}px`;
    card.style.bottom = 'auto';
    return;
  }
  card.style.right = 'auto';
  card.style.bottom = 'auto';
  card.style.width = 'min(390px, calc(100vw - 24px))';
  const cardWidth = Math.min(390, innerWidth - 24);
  const cardHeight = Math.min(card.offsetHeight || 290, innerHeight - 24);
  const gap = 18;
  const canRight = targetRect.left + targetRect.width + gap + cardWidth < innerWidth;
  const canLeft = targetRect.left - gap - cardWidth > 0;
  let left = 12;
  let top = Math.max(12, Math.min(innerHeight - cardHeight - 12, targetRect.top));
  if (placement === 'left' || (!canRight && canLeft)) left = targetRect.left - gap - cardWidth;
  else if (placement === 'bottom') {
    left = Math.max(12, Math.min(innerWidth - cardWidth - 12, targetRect.left));
    top = Math.min(innerHeight - cardHeight - 12, targetRect.top + targetRect.height + gap);
  } else if (canRight) left = targetRect.left + targetRect.width + gap;
  else left = Math.max(12, Math.min(innerWidth - cardWidth - 12, targetRect.left));
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
};

const moveCursor = (targetRect, click = true) => {
  const { cursor } = ui();
  if (!cursor) return;
  if (!targetRect) {
    cursor.classList.add('hidden');
    return;
  }
  cursor.classList.remove('hidden', 'clicking');
  cursor.style.left = `${targetRect.left + Math.min(targetRect.width * 0.58, targetRect.width - 10)}px`;
  cursor.style.top = `${targetRect.top + Math.min(targetRect.height * 0.55, targetRect.height - 8)}px`;
  if (click) setTimeout(() => cursor.classList.add('clicking'), 620);
};

const positionTour = () => {
  if (!tour?.active) return;
  const step = tour.steps[tour.index];
  const target = visibleElement(step.target);
  const rect = rectFor(target);
  const { spotlight } = ui();
  if (rect) {
    Object.assign(spotlight.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, opacity: '1' });
  } else {
    Object.assign(spotlight.style, { left: '50%', top: '42%', width: '1px', height: '1px', opacity: '0' });
  }
  placeCard(rect, step.placement);
  moveCursor(rect, step.cursor !== false);
};

const scheduleAdvance = (delay) => {
  clearTimeout(tour?.timer);
  if (!tour?.active || tour.paused || !tour.autoplay) return;
  tour.timer = setTimeout(() => nextStep(), delay || 4700);
};

const runCurrentStep = async () => {
  if (!tour?.active) return;
  const token = ++actionToken;
  const step = tour.steps[tour.index];
  const controls = ui();
  clearTimeout(tour.timer);
  controls.kicker.textContent = `${tour.label || 'TUTORIAL ANIMADO'} // ETAPA ${tour.index + 1} DE ${tour.steps.length}`;
  controls.title.textContent = step.title;
  controls.text.textContent = step.text;
  controls.progress.textContent = `${tour.index + 1}/${tour.steps.length}`;
  controls.bar.style.width = `${((tour.index + 1) / tour.steps.length) * 100}%`;
  controls.previous.disabled = tour.index === 0;
  controls.next.textContent = tour.index === tour.steps.length - 1 ? 'CONCLUIR' : 'PULAR ETAPA';
  controls.pause.textContent = tour.paused ? 'CONTINUAR' : 'PAUSAR';
  if (step.before) await step.before();
  if (!tour?.active || token !== actionToken) return;
  const target = visibleElement(step.target);
  target?.scrollIntoView({ behavior: document.documentElement.dataset.reducedMotion === 'true' ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });
  await wait(260);
  if (!tour?.active || token !== actionToken) return;
  positionTour();
  if (step.action) {
    await wait(step.actionDelay ?? 760);
    if (!tour?.active || token !== actionToken) return;
    await step.action(target);
    await wait(180);
    positionTour();
  }
  scheduleAdvance(step.duration || 5200);
};

export const stopGuidedTour = (status = 'skipped') => {
  if (!tour) return;
  const finished = tour;
  clearTimeout(finished.timer);
  actionToken += 1;
  tour = null;
  const controls = ui();
  controls.root?.classList.add('hidden');
  document.body.classList.remove('guided-tour-open');
  window.removeEventListener('resize', resizeHandler);
  resizeHandler = null;
  finished.onFinish?.(status);
};

export const nextStep = () => {
  if (!tour?.active) return;
  if (tour.index >= tour.steps.length - 1) {
    stopGuidedTour('completed');
    return;
  }
  tour.index += 1;
  runCurrentStep();
};

export const previousStep = () => {
  if (!tour?.active || tour.index === 0) return;
  tour.index -= 1;
  runCurrentStep();
};

export const togglePause = () => {
  if (!tour?.active) return;
  tour.paused = !tour.paused;
  ui().pause.textContent = tour.paused ? 'CONTINUAR' : 'PAUSAR';
  if (tour.paused) clearTimeout(tour.timer);
  else scheduleAdvance(1200);
};

export const startGuidedTour = ({ id = 'tour', label = 'TUTORIAL ANIMADO', steps = [], autoplay = true, onFinish } = {}) => {
  if (!steps.length) return;
  stopGuidedTour('replaced');
  tour = { id, label, steps, index: 0, autoplay, paused: false, active: true, onFinish, timer: null };
  const controls = ui();
  controls.root?.classList.remove('hidden');
  document.body.classList.add('guided-tour-open');
  resizeHandler = () => positionTour();
  window.addEventListener('resize', resizeHandler, { passive: true });
  runCurrentStep();
};

export const bindGuidedTourControls = () => {
  const controls = ui();
  controls.previous?.addEventListener('click', previousStep);
  controls.pause?.addEventListener('click', togglePause);
  controls.next?.addEventListener('click', nextStep);
  controls.skip?.addEventListener('click', () => stopGuidedTour('skipped'));
};

export const getToolDemo = (toolId) => TOOL_DEMOS[toolId] || TOOL_DEMOS.base64;

export const buildToolTourSteps = ({ toolId, selectTool, runDemo }) => {
  const demo = getToolDemo(toolId);
  return [
    {
      title: `Selecione ${demo.title}`,
      text: 'A gaveta mantém o desafio aberto. A ferramenta ativa fica iluminada na faixa superior.',
      target: `[data-drawer-tool="${toolId}"]`,
      action: async () => selectTool(toolId),
    },
    {
      title: 'Leia o objetivo da ferramenta',
      text: demo.concept,
      target: '#tools-drawer-workspace > p, #tools-drawer-workspace h2', cursor: false,
    },
    {
      title: 'Insira um exemplo seguro',
      text: 'O cursor virtual preencherá dados fictícios. Nenhuma informação é enviada para fora do navegador.',
      target: `#tools-drawer-workspace [data-tool-form="${toolId}"] [name="input"]`,
      action: async (element) => typeInto(element, demo.input, toolId === 'logs' ? 7 : 20),
      duration: Math.max(5200, demo.input.length * (toolId === 'logs' ? 7 : 20) + 1800),
    },
    ...Object.entries(demo.fields).map(([name, value]) => ({
      title: `Configure ${name === 'action' ? 'a ação' : 'o parâmetro'}`,
      text: 'Algumas ferramentas precisam saber se você quer codificar, decodificar ou aplicar um deslocamento.',
      target: `#tools-drawer-workspace [data-tool-form="${toolId}"] [name="${name}"]`,
      action: async (element) => {
        const form = element?.closest('form');
        setFieldValue(form, name, value);
        element?.classList.add('tutorial-field-flash');
        setTimeout(() => element?.classList.remove('tutorial-field-flash'), 900);
      },
      duration: 4000,
    })),
    {
      title: 'Execute localmente',
      text: 'O botão aceso processa apenas os dados presentes no formulário do laboratório.',
      target: `#tools-drawer-workspace [data-tool-form="${toolId}"] button[type="submit"]`,
      action: async (button) => {
        button?.classList.add('tutorial-button-press');
        await runDemo(toolId, button?.closest('form'));
        setTimeout(() => button?.classList.remove('tutorial-button-press'), 900);
      },
      duration: 4600,
    },
    {
      title: 'Interprete a saída',
      text: demo.outcome,
      target: '#tools-drawer-workspace [data-tool-output]', cursor: false, duration: 5600,
    },
  ];
};

export const toolTutorialCards = () => Object.entries(TOOL_DEMOS).map(([id, demo]) => ({ id, ...demo }));

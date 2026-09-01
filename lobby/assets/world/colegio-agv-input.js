import { MAP_ID } from './colegio-agv-shared.js';

const ACTION_LABELS = Object.freeze({
  'enter-building': 'Entrar', 'exit-building': 'Sair', travel: 'Viajar', sit: 'Sentar', stand: 'Levantar',
  'use-computer': 'Usar computador', 'inspect-station': 'Examinar', 'use-water-fountain': 'Usar bebedouro',
  'open-live-notices': 'Abrir mural', 'open-live-schedule': 'Ver horários', 'open-sports-menu': 'Usar quadra',
  'open-sports-score': 'Ver placar', 'start-learning': 'Iniciar atividade'
});

function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

export function buildColegioAgvInteractionHint(item, source = 'none') {
  if (!item) return null;
  const occupied = item.type === 'seat' && Boolean(item.occupied);
  return {
    worldId: MAP_ID,
    id: item.id,
    title: item.name || ACTION_LABELS[item.interaction] || 'Interagir',
    action: occupied ? 'Ocupado' : (ACTION_LABELS[item.interaction] || 'Interagir'),
    interaction: item.interaction,
    source,
    enabled: !occupied,
    visual: { state: occupied ? 'busy' : 'available', emphasis: source === 'core-raycast' ? 'primary' : 'nearby', icon: item.type || 'interaction' },
    bindings: { keyboard: 'E', touch: 'Interagir', gamepad: 'A / Cross' }
  };
}

function isTrigger(input) {
  if (typeof input === 'string') input = { key: input };
  const key = String(input?.key || input?.code || input?.action || '').toLowerCase();
  return input?.pressed !== false && ['e', 'keye', 'enter', 'interact', 'touch-interact', 'gamepad-a', 'gamepad-cross', 'a', 'cross'].includes(key);
}

export function createColegioAgvInputBridge({ context = {}, getFocused, getFocusSource, interactFocused } = {}) {
  let lastHint = null;
  let cleanup = null;

  function publishHint() {
    const hint = buildColegioAgvInteractionHint(getFocused?.(), getFocusSource?.());
    const changed = JSON.stringify(hint) !== JSON.stringify(lastHint);
    lastHint = hint;
    if (changed) {
      context.setWorldInteractionHint?.(clone(hint));
      context.onInteractionHint?.(clone(hint));
    }
    return clone(hint);
  }

  function handleInput(input, payload = {}) {
    if (!isTrigger(input)) return { ok: false, reason: 'ignored-input' };
    const result = interactFocused?.({ ...payload, input });
    context.onWorldAction?.({ worldId: MAP_ID, action: 'interact', input: clone(input), result: clone(result) });
    return result ?? { ok: false, reason: 'no-focused-interaction' };
  }

  if (typeof context.registerWorldAction === 'function') {
    try {
      const unregister = context.registerWorldAction({
        worldId: MAP_ID,
        actionId: 'interact',
        bindings: { keyboard: ['KeyE', 'Enter'], touch: ['interact'], gamepad: ['A', 'Cross'] },
        onTrigger: (input) => handleInput(input)
      });
      if (typeof unregister === 'function') cleanup = unregister;
    } catch { /* Core pode expor outra assinatura; API pública handleInput permanece disponível. */ }
  }

  return {
    update: publishHint,
    handleInput,
    getHint: () => clone(lastHint),
    stop() {
      try { cleanup?.(); } catch { /* noop */ }
      cleanup = null;
      lastHint = null;
      context.setWorldInteractionHint?.(null);
      context.onInteractionHint?.(null);
    }
  };
}

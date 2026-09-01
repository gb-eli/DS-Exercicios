import { MAP_ID } from './colegio-agv-shared.js';
import { createColegioAgvTransitionController } from './colegio-agv-transitions.js';
import { createColegioAgvLodController } from './colegio-agv-lod.js';

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

function normalizeWeather(value) {
  const raw = typeof value === 'string' ? value : value?.type || value?.id || value?.weather || 'clear';
  const id = String(raw || 'clear').toLowerCase();
  if (/rain|chuva/.test(id)) return 'rain';
  if (/storm|tempest|thunder/.test(id)) return 'storm';
  if (/snow|neve/.test(id)) return 'snow';
  if (/fog|nebl|mist/.test(id)) return 'fog';
  return 'clear';
}

export function createColegioAgvF7Controller({ context = {}, mode = '3d', root = null, exterior = null, performanceController = null, getFocused = null } = {}) {
  const transitions = createColegioAgvTransitionController(context);
  const lod = mode === '3d' ? createColegioAgvLodController({ context, root, performanceController }) : null;
  let weather = 'clear';
  let lodAccumulator = 0;
  let environmentAccumulator = 0;
  let visualClock = 0;
  let bellCleanup = null;

  function readWeather() {
    try { return normalizeWeather(context.getWorldWeather?.() ?? context.getWeatherState?.() ?? context?.state?.weather); }
    catch { return weather; }
  }

  function applyEnvironment(force = false) {
    const next = readWeather();
    if (force || next !== weather) {
      weather = next;
      exterior?.setWeatherState?.(weather);
      context.onMapWeatherAdaptation?.({ worldId: MAP_ID, weather, rendersPrecipitation: false, source: 'global-core' });
    }
    const timeMode = context.getWorldTimeMode?.() ?? context?.state?.worldTimeMode;
    if (timeMode) exterior?.setWorldTimeMode?.(timeMode);
    return { weather, timeMode: timeMode || null };
  }

  function triggerSchoolBell(payload = {}) {
    const event = { worldId: MAP_ID, cue: 'school-bell', source: payload.source || 'core', label: payload.label || 'Sinal escolar', ...clone(payload) };
    try { context.playWorldCue?.(event); } catch { /* Core opcional */ }
    context.onSchoolBell?.(clone(event));
    return event;
  }

  if (typeof context.subscribeSchoolBell === 'function') {
    try {
      const unsub = context.subscribeSchoolBell((payload) => triggerSchoolBell(payload || {}));
      if (typeof unsub === 'function') bellCleanup = unsub;
    } catch { /* hook opcional */ }
  }

  function update(delta = 0) {
    const dt = Math.max(0, Math.min(1, Number(delta) || 0));
    visualClock += dt;
    lodAccumulator += dt;
    environmentAccumulator += dt;
    if (lod && lodAccumulator >= 0.75) { lod.update(); lodAccumulator %= 0.75; }
    if (environmentAccumulator >= 1.25) { applyEnvironment(); environmentAccumulator %= 1.25; }
    const focused = getFocused?.() || null;
    context.onMapVisualState?.({ worldId: MAP_ID, mode, pulse: 0.5 + Math.sin(visualClock * 3.2) * 0.5, focusedId: focused?.id || null, weather });
  }

  applyEnvironment(true);

  return {
    update,
    beginTransition: transitions.begin,
    transitionMidpoint: transitions.midpoint,
    finishTransition: transitions.finish,
    cancelTransition: transitions.cancel,
    getTransitionState: transitions.getState,
    getLodState: () => lod?.getState?.() || { visible: 0, hidden: 0 },
    getWeatherState: () => weather,
    refreshEnvironment: () => applyEnvironment(true),
    triggerSchoolBell,
    stop() {
      transitions.stop();
      lod?.stop?.();
      try { bellCleanup?.(); } catch { /* noop */ }
      bellCleanup = null;
      context.setWorldTransitionState?.(null);
    }
  };
}

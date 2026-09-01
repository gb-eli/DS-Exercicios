import { MAP_ID } from './colegio-agv-shared.js';

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

export function createColegioAgvTransitionController(context = {}) {
  let state = { active: false, kind: null, targetId: null, phase: 'idle', progress: 0 };

  function publish() {
    const snapshot = clone(state);
    context.onInteriorTransition?.({ worldId: MAP_ID, ...snapshot });
    context.setWorldTransitionState?.({ worldId: MAP_ID, ...snapshot });
    return snapshot;
  }

  function begin(kind, targetId, meta = {}) {
    state = { active: true, kind, targetId: targetId || null, phase: 'begin', progress: 0, ...clone(meta) };
    try { context.beginWorldTransition?.({ worldId: MAP_ID, ...clone(state) }); } catch { /* Core opcional */ }
    return publish();
  }

  function midpoint(meta = {}) {
    if (!state.active) return clone(state);
    state = { ...state, phase: 'midpoint', progress: 0.55, ...clone(meta) };
    return publish();
  }

  function finish(meta = {}) {
    if (!state.active) return clone(state);
    state = { ...state, phase: 'complete', progress: 1, ...clone(meta) };
    const snapshot = publish();
    try { context.endWorldTransition?.({ worldId: MAP_ID, ...clone(snapshot) }); } catch { /* Core opcional */ }
    state = { active: false, kind: null, targetId: null, phase: 'idle', progress: 0 };
    return snapshot;
  }

  function cancel(reason = 'cancelled') {
    if (!state.active) return false;
    const old = { ...state, active: false, phase: 'cancelled', reason };
    context.onInteriorTransition?.({ worldId: MAP_ID, ...clone(old) });
    context.setWorldTransitionState?.(null);
    try { context.endWorldTransition?.({ worldId: MAP_ID, ...clone(old) }); } catch { /* noop */ }
    state = { active: false, kind: null, targetId: null, phase: 'idle', progress: 0 };
    return true;
  }

  return { begin, midpoint, finish, cancel, getState: () => clone(state), stop: () => cancel('runtime-stop') };
}

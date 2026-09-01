import { MAP_ID } from './colegio-agv-shared.js';

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function distance2D(a, b) {
  return Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.z ?? 0) - (b?.z ?? 0));
}

function isItemAvailableInSpace(item, activeInteriorId) {
  if (activeInteriorId) return item.interiorId === activeInteriorId;
  return !item.interiorId;
}

function normalizePick(result, candidates) {
  if (!result) return null;
  const id = typeof result === 'string'
    ? result
    : result.interactableId || result.id || result.object?.userData?.interactableId || result.object?.name;
  if (!id) return null;
  return candidates.find((item) => item.id === id || item.targetId === id) || null;
}

/**
 * Ponte de interação do mapa. Não cria câmera/raycaster global.
 * Usa o hook de picking do Core quando existir e recua para proximidade 2D.
 */
export function createColegioAgvInteractionResolver({
  context = {},
  getInteractables,
  getPlayer,
  getActiveInterior,
  interact,
  defaultMaxDistance = 2.8
} = {}) {
  let focused = null;
  let nearby = [];
  let focusSource = 'none';

  function listCandidates(maxDistance = defaultMaxDistance) {
    const player = getPlayer?.() || context?.state?.player || context?.player || { x: 0, z: 0 };
    const activeInteriorId = getActiveInterior?.() || null;
    return (getInteractables?.() || [])
      .filter((item) => isItemAvailableInSpace(item, activeInteriorId))
      .map((item) => ({ ...item, distance: distance2D(player, item) }))
      .filter((item) => item.distance <= Math.max(maxDistance, Number(item.radius) || 0))
      .sort((a, b) => a.distance - b.distance);
  }

  function scan(options = {}) {
    const maxDistance = Number.isFinite(options.maxDistance) ? options.maxDistance : defaultMaxDistance;
    nearby = listCandidates(maxDistance);
    let picked = null;
    const picker = context.raycastWorldInteractables || context.pickWorldInteractable;
    if (typeof picker === 'function' && nearby.length) {
      try {
        const result = picker({
          worldId: MAP_ID,
          candidates: nearby.map((item) => ({ ...item })),
          maxDistance,
          activeInteriorId: getActiveInterior?.() || null
        });
        picked = normalizePick(result, nearby);
      } catch { /* fallback por proximidade */ }
    }
    if (picked) {
      focused = picked;
      focusSource = 'core-raycast';
    } else {
      focused = nearby[0] || null;
      focusSource = focused ? 'proximity' : 'none';
    }
    context.onInteractionFocus?.({ worldId: MAP_ID, item: clone(focused), source: focusSource });
    return clone(focused);
  }

  function interactFocused(payload = {}) {
    if (!focused) scan();
    if (!focused || typeof interact !== 'function') return { ok: false, reason: 'no-focused-interaction' };
    return interact(focused, payload);
  }

  return {
    scan,
    interactFocused,
    getFocused: () => clone(focused),
    getFocusSource: () => focusSource,
    getNearby: () => nearby.map(clone),
    clear() { focused = null; nearby = []; focusSource = 'none'; }
  };
}

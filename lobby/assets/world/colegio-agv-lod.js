import { MAP_ID } from './colegio-agv-shared.js';

const DISTANCE_BY_PROFILE = Object.freeze({ lite: 22, low: 30, medium: 46, high: 68 });
const NEVER_CULL = /ground|road|sidewalk|bloco|roof|wall|facade|portal|door|gate|fence|quadra|court/i;
const DETAIL_ONLY = /tree|shrub|bench|sign|wayfinding|utility|extint|safety|trash|lixeira|future/i;

function playerPosition(context) {
  const p = context?.state?.player || context?.player || context.getPlayerPosition?.();
  return p && Number.isFinite(p.x) && Number.isFinite(p.z) ? p : null;
}

export function createColegioAgvLodController({ context = {}, root, performanceController } = {}) {
  let lastVisible = 0;
  let lastHidden = 0;

  function update() {
    if (!root?.traverse) return { visible: 0, hidden: 0, distance: Infinity };
    const player = playerPosition(context);
    if (!player) return { visible: lastVisible, hidden: lastHidden, distance: Infinity };
    const profile = performanceController?.getProfileId?.() || 'high';
    const maxDistance = DISTANCE_BY_PROFILE[profile] || DISTANCE_BY_PROFILE.high;
    let visible = 0, hidden = 0;
    root.traverse((obj) => {
      if (!obj?.isMesh) return;
      const name = String(obj.name || '');
      if (!DETAIL_ONLY.test(name) || NEVER_CULL.test(name) || obj.userData?.neverCull === true) return;
      let x = 0, z = 0, cursor = obj;
      while (cursor) { x += Number(cursor.position?.x) || 0; z += Number(cursor.position?.z) || 0; cursor = cursor.parent; }
      const distance = Math.hypot(player.x - x, player.z - z);
      const show = distance <= maxDistance;
      obj.visible = show;
      if (show) visible += 1; else hidden += 1;
    });
    lastVisible = visible; lastHidden = hidden;
    context.onMapLodState?.({ worldId: MAP_ID, profile, maxDistance, visible, hidden });
    return { profile, maxDistance, visible, hidden };
  }

  return { update, getState: () => ({ visible: lastVisible, hidden: lastHidden }), stop() {} };
}

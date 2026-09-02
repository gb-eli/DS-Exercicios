import { MAP_ID } from './colegio-agv-shared.js';

const PROFILES = Object.freeze({
  lite: Object.freeze({ id: 'lite', npcHz: 6, interactionHz: 6, maxNpcFallback: 4, shadows: false, decorationDensity: 0.55 }),
  low: Object.freeze({ id: 'low', npcHz: 8, interactionHz: 8, maxNpcFallback: 5, shadows: false, decorationDensity: 0.7 }),
  medium: Object.freeze({ id: 'medium', npcHz: 12, interactionHz: 10, maxNpcFallback: 7, shadows: false, decorationDensity: 0.9 }),
  high: Object.freeze({ id: 'high', npcHz: 20, interactionHz: 15, maxNpcFallback: 7, shadows: true, decorationDensity: 1 }),
  ultra: Object.freeze({ id: 'ultra', npcHz: 24, interactionHz: 18, maxNpcFallback: 8, shadows: true, decorationDensity: 1 })
});

function normalizeQuality(value, mode) {
  if (mode === 'lite') return 'lite';
  const q = String(value || 'high').toLowerCase();
  if (q.includes('low') || q.includes('mobile') || q.includes('econom')) return 'low';
  if (q.includes('medium') || q.includes('balanced')) return 'medium';
  if (q.includes('ultra')) return 'ultra';
  return 'high';
}

export function createColegioAgvPerformanceController(context = {}, mode = '3d') {
  let globalQuality = normalizeQuality(context.getQuality?.() ?? context?.state?.quality, mode);
  let profileId = globalQuality;
  let lowFpsWindows = 0;
  let healthyFpsWindows = 0;
  let npcAccumulator = 0;
  let interactionAccumulator = 0;

  function getProfile() { return PROFILES[profileId] || PROFILES.high; }

  function recordFPS(fps) {
    if (!Number.isFinite(fps) || fps <= 0 || mode === 'lite') return profileId;
    if (fps < 24) { lowFpsWindows += 1; healthyFpsWindows = 0; }
    else if (fps > 42) { healthyFpsWindows += 1; lowFpsWindows = 0; }
    else { lowFpsWindows = Math.max(0, lowFpsWindows - 1); healthyFpsWindows = Math.max(0, healthyFpsWindows - 1); }

    const order = ['low', 'medium', 'high', 'ultra'];
    const ceiling = order.indexOf(globalQuality);
    let index = Math.min(order.indexOf(profileId), ceiling);
    if (lowFpsWindows >= 3 && index > 0) { index -= 1; lowFpsWindows = 0; }
    if (healthyFpsWindows >= 6 && index < ceiling) { index += 1; healthyFpsWindows = 0; }
    const next = order[Math.max(0, index)];
    if (next !== profileId) {
      profileId = next;
      context.onMapPerformanceProfile?.({ worldId: MAP_ID, profile: profileId, fps });
    }
    return profileId;
  }

  function setQuality(value){globalQuality=normalizeQuality(value,mode);profileId=globalQuality;lowFpsWindows=0;healthyFpsWindows=0;return profileId;}

  function shouldUpdateNpc(delta = 0) {
    npcAccumulator += Math.max(0, Number(delta) || 0);
    const step = 1 / getProfile().npcHz;
    if (npcAccumulator < step) return false;
    npcAccumulator %= step;
    return true;
  }

  function shouldScanInteractions(delta = 0) {
    interactionAccumulator += Math.max(0, Number(delta) || 0);
    const step = 1 / getProfile().interactionHz;
    if (interactionAccumulator < step) return false;
    interactionAccumulator %= step;
    return true;
  }

  function apply3D(root) {
    if (!root?.traverse) return;
    const profile = getProfile();
    root.traverse((obj) => {
      if ('frustumCulled' in obj) obj.frustumCulled = true;
      obj.userData ||= {};
      if ('castShadow' in obj && obj.userData.__agvOriginalCastShadow === undefined) obj.userData.__agvOriginalCastShadow = Boolean(obj.castShadow);
      if ('receiveShadow' in obj && obj.userData.__agvOriginalReceiveShadow === undefined) obj.userData.__agvOriginalReceiveShadow = Boolean(obj.receiveShadow);
      if (!profile.shadows) {
        if ('castShadow' in obj) obj.castShadow = false;
        if ('receiveShadow' in obj && obj.userData?.keepReceiveShadow !== true) obj.receiveShadow = false;
      } else {
        if ('castShadow' in obj && obj.userData.__agvOriginalCastShadow !== undefined) obj.castShadow = obj.userData.__agvOriginalCastShadow;
        if ('receiveShadow' in obj && obj.userData.__agvOriginalReceiveShadow !== undefined) obj.receiveShadow = obj.userData.__agvOriginalReceiveShadow;
      }
    });
  }

  return {
    getProfile: () => ({ ...getProfile() }),
    getProfileId: () => profileId,
    recordFPS,
    setQuality,
    shouldUpdateNpc,
    shouldScanInteractions,
    apply3D,
    getState: () => ({ profile: profileId, globalQuality, lowFpsWindows, healthyFpsWindows })
  };
}

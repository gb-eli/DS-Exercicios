import { MAP_ID } from './colegio-agv-shared.js';

const REWARD_TABLE = Object.freeze({
  'learning-complete': { xp: 20, badge: null },
  'learning-perfect': { xp: 10, badge: 'agv-estudioso' },
  'sport-complete': { xp: 15, badge: null },
  'sport-challenge': { xp: 10, badge: 'agv-em-movimento' },
  'exploration': { xp: 5, badge: null }
});

function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

export function createColegioAgvRewardBridge(context = {}) {
  const granted = new Set();

  function award(type, sourceId, meta = {}) {
    const def = REWARD_TABLE[type];
    if (!def || !sourceId) return { ok: false, reason: 'unknown-reward' };
    const key = `${type}:${sourceId}`;
    if (granted.has(key)) return { ok: false, reason: 'already-granted', key };
    granted.add(key);
    const reward = { worldId: MAP_ID, type, sourceId, xp: def.xp, badge: def.badge, meta: clone(meta) };
    if (typeof context.awardWorldXP === 'function') context.awardWorldXP(reward);
    else context.onWorldReward?.(reward);
    return { ok: true, reward };
  }

  return { award, getGrantedKeys: () => [...granted], resetLocalSession: () => granted.clear() };
}

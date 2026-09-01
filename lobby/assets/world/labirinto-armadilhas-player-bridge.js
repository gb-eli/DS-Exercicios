import { MAP_ID, clampToBounds } from './labirinto-armadilhas-shared.js';

function normalizePosition(p) {
  if (!p) return null;
  const x = Number(p.x ?? p.position?.x);
  const y = Number(p.y ?? p.position?.y ?? 0);
  const z = Number(p.z ?? p.position?.z);
  if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
  return { x, y:Number.isFinite(y) ? y : 0, z };
}

export function createGlobalPlayerBridge(context = {}) {
  function getPosition() {
    return normalizePosition(
      context.getPlayerPosition?.() ||
      context.avatarSystem?.getPosition?.() ||
      context.avatar?.getPosition?.() ||
      context.state?.playerPosition ||
      context.state?.player?.position
    );
  }

  function teleportTo(position, reason = 'map-teleport') {
    if (!position) return false;
    const safe = clampToBounds(position);
    if (context.teleportPlayer) { context.teleportPlayer(safe, { mapId:MAP_ID, reason }); return true; }
    if (context.avatarSystem?.teleportTo) { context.avatarSystem.teleportTo(safe); return true; }
    if (context.avatar?.teleportTo) { context.avatar.teleportTo(safe); return true; }
    if (context.teleportTo) { context.teleportTo(safe); return true; }
    context.onChallengeEvent?.({ type:'player-teleport-request', mapId:MAP_ID, position:safe, reason, timestamp:Date.now() });
    return false;
  }

  return { getPosition, teleportTo };
}

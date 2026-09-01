import { MAP_ID, SCENE_ID } from './colegio-agv-shared.js';

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

export function isColegioAgvPresence(presence) {
  return Boolean(presence) && presence.worldId === MAP_ID && (!presence.scene || presence.scene === SCENE_ID);
}

/**
 * Ponte opcional de sincronização. Não abre sockets nem cria presença própria.
 * Apenas usa publishWorldState/subscribeWorldState fornecidos pelo Core.
 */
export function createColegioAgvSyncBridge(context = {}) {
  const remotePlayers = new Map();
  let cleanup = null;
  let apply = {};
  let connected = false;

  function publish(kind, payload) {
    if (typeof context.publishWorldState !== 'function') return false;
    try {
      context.publishWorldState({ worldId: MAP_ID, scene: SCENE_ID, kind, payload: clone(payload) });
      return true;
    } catch { return false; }
  }

  function receive(message) {
    if (!message || message.worldId !== MAP_ID || (message.scene && message.scene !== SCENE_ID)) return false;
    const payload = message.payload || {};
    switch (message.kind) {
      case 'door': apply.door?.(payload); break;
      case 'seat': apply.seat?.(payload); break;
      case 'sports': apply.sports?.(payload); break;
      case 'presence':
        if (!isColegioAgvPresence(payload)) return false;
        if (payload.left || payload.active === false) remotePlayers.delete(payload.clientId || payload.userId || payload.id);
        else remotePlayers.set(payload.clientId || payload.userId || payload.id || `remote_${remotePlayers.size}`, clone(payload));
        break;
      default: return false;
    }
    return true;
  }

  function start() {
    if (connected || typeof context.subscribeWorldState !== 'function') return false;
    try {
      const result = context.subscribeWorldState({ worldId: MAP_ID, scene: SCENE_ID, onState: receive, onMessage: receive });
      cleanup = typeof result === 'function' ? result : result?.unsubscribe?.bind(result) || null;
      connected = true;
      return true;
    } catch { return false; }
  }

  function refreshPresences() {
    if (typeof context.getWorldPresences !== 'function') return getRemotePlayers();
    try {
      const presences = context.getWorldPresences({ worldId: MAP_ID, scene: SCENE_ID }) || [];
      remotePlayers.clear();
      for (const presence of presences) {
        if (!isColegioAgvPresence(presence)) continue;
        const key = presence.clientId || presence.userId || presence.id || `remote_${remotePlayers.size}`;
        remotePlayers.set(key, clone(presence));
      }
    } catch { /* mantém snapshot anterior */ }
    return getRemotePlayers();
  }

  function getRemotePlayers() { return [...remotePlayers.values()].map(clone); }

  function stop() {
    try { cleanup?.(); } catch { /* noop */ }
    cleanup = null;
    connected = false;
    remotePlayers.clear();
  }

  return {
    start, stop, receive, refreshPresences,
    bindApplyHandlers(handlers = {}) { apply = { ...handlers }; },
    publishDoor: (payload) => publish('door', payload),
    publishSeat: (payload) => publish('seat', payload),
    publishSports: (payload) => publish('sports', payload),
    publishPresence: (payload) => publish('presence', { worldId: MAP_ID, scene: SCENE_ID, ...payload }),
    getRemotePlayers,
    isConnected: () => connected,
    hasCoreSync: () => typeof context.publishWorldState === 'function' || typeof context.subscribeWorldState === 'function'
  };
}

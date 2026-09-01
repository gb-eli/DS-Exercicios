import { MAP_ID, NPCS } from './colegio-agv-shared.js';
import { ROOM_ZONES } from './colegio-agv-data.js';
import { getInteriorDefinition, listInteriors } from './colegio-agv-interiors.js';

const SEAT_TYPES = new Set(['student-desk', 'auditorium-seat', 'study-table', 'cafeteria-table', 'meeting-table', 'teacher-desk']);
const COMPUTER_TYPES = new Set(['computer-desk']);
const INSPECT_TYPES = new Set(['board', 'screen', 'tv', 'bulletin-board', 'bookshelf', 'science-bench', 'network-rack']);

export const NPC_ROUTES = Object.freeze({
  colegio_agv_route_student_entrance: Object.freeze([
    { x: 0, z: 52 }, { x: 0, z: 43 }, { x: 0, z: 28 }, { x: -8, z: 18 }, { x: -18, z: 7 }, { x: -20, z: -6 }
  ]),
  colegio_agv_route_student_patio: Object.freeze([
    { x: -12, z: 13 }, { x: 8, z: 13 }, { x: 11, z: 2 }, { x: -8, z: -2 }, { x: -15, z: 7 }
  ]),
  colegio_agv_route_teacher: Object.freeze([
    { x: -4, z: 38 }, { x: -14, z: 29 }, { x: -20, z: 23 }, { x: -20, z: 7 }, { x: -20, z: -9 }
  ]),
  colegio_agv_route_support: Object.freeze([
    { x: 10, z: 18 }, { x: 2, z: 12 }, { x: -10, z: 10 }, { x: -17, z: 4 }, { x: -7, z: -17 }, { x: 9, z: -17 }
  ])
});

export const AMBIENT_PROFILES = Object.freeze({
  colegio_agv_area_entrada: { id: 'school-entrance', gain: 0.35, tags: ['street-soft', 'voices-distant'] },
  colegio_agv_area_patio: { id: 'school-courtyard', gain: 0.45, tags: ['students-distant', 'courtyard'] },
  colegio_agv_area_esportes: { id: 'school-court', gain: 0.42, tags: ['court-distant', 'voices-distant'] },
  colegio_agv_area_pedagogica: { id: 'school-corridor', gain: 0.24, tags: ['corridor-soft'] },
  colegio_agv_area_servicos: { id: 'school-service', gain: 0.24, tags: ['room-tone'] },
  interior: { id: 'school-interior', gain: 0.18, tags: ['room-tone'] }
});

export const SPORTS_ACTIVITIES = Object.freeze([
  { id: 'colegio_agv_sport_free_play', label: 'Quadra livre', kind: 'free-play', maxPlayers: 12 },
  { id: 'colegio_agv_sport_team_score', label: 'Placar amistoso', kind: 'score-session', maxPlayers: 12 },
  { id: 'colegio_agv_sport_time_trial', label: 'Desafio de movimentação', kind: 'time-trial', maxPlayers: 1 }
]);

export const F5_OUTDOOR_INTERACTABLES = Object.freeze([
  { id: 'colegio_agv_interact_notice_board', type: 'notice-board', name: 'Mural AGV+', x: -15, z: 14, radius: 2.2, interaction: 'open-live-notices' },
  { id: 'colegio_agv_interact_schedule_panel', type: 'schedule-panel', name: 'Horários da escola', x: 4.8, z: 39.8, radius: 2.2, interaction: 'open-live-schedule' },
  { id: 'colegio_agv_interact_court_session', type: 'sports', name: 'Usar quadra', x: 29, z: -10, radius: 2.6, interaction: 'open-sports-menu' },
  { id: 'colegio_agv_interact_court_score', type: 'sports-score', name: 'Placar da quadra', x: 44.5, z: -1.8, radius: 2.2, interaction: 'open-sports-score' }
]);

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function normalizeNpcDefinition(npc, index) {
  const fallbackRoute = index % 2 ? 'colegio_agv_route_student_patio' : 'colegio_agv_route_student_entrance';
  const routeId = npc.routeId || (npc.role?.includes('teacher') ? 'colegio_agv_route_teacher' : fallbackRoute);
  return {
    ...npc,
    routeId,
    speed: Number.isFinite(npc.speed) ? npc.speed : (npc.role?.includes('student') ? 1.15 : 0.78),
    pauseSeconds: Number.isFinite(npc.pauseSeconds) ? npc.pauseSeconds : 1.5,
    phaseOffset: Number.isFinite(npc.phaseOffset) ? npc.phaseOffset : index * 2.7
  };
}

export function listInteriorInteractables(interiorId) {
  const def = getInteriorDefinition(interiorId);
  if (!def) return [];
  const items = def.stations.flatMap((station) => {
    const base = { id: `${station.id}_interaction`, targetId: station.id, interiorId, name: station.id, x: station.x, z: station.z, radius: 1.5 };
    if (SEAT_TYPES.has(station.type)) return [{ ...base, type: 'seat', interaction: 'sit', stationType: station.type }];
    if (COMPUTER_TYPES.has(station.type)) return [{ ...base, type: 'computer', interaction: 'use-computer', stationType: station.type }];
    if (station.type === 'water-fountain') return [{ ...base, type: 'utility', interaction: 'use-water-fountain', stationType: station.type }];
    if (INSPECT_TYPES.has(station.type)) return [{ ...base, type: 'inspect', interaction: 'inspect-station', stationType: station.type }];
    return [];
  });
  items.push({
    id: `${interiorId}_exit_interaction`, targetId: interiorId, interiorId, type: 'interior-exit', name: 'Sair do ambiente',
    x: 0, z: def.size.depth / 2 - 0.45, radius: 1.8, interaction: 'exit-building'
  });
  return items;
}

export function listAllInteriorInteractables() {
  return listInteriors().flatMap((interior) => listInteriorInteractables(interior.id));
}

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function positionOnRouteNatural(route, timeSeconds, speed = 1, pauseSeconds = 1.2) {
  if (!route?.length) return { x: 0, z: 0, heading: 0, moving: false };
  if (route.length === 1) return { ...route[0], heading: 0, moving: false };
  const path = [...route, ...route.slice(0, -1).reverse()];
  const segments = [];
  let cycleSeconds = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = path[i], b = path[i + 1];
    const d = Math.hypot(b.x - a.x, b.z - a.z);
    const travelSeconds = d / Math.max(0.08, speed);
    const pause = Math.max(0, pauseSeconds) * (i === path.length - 2 || i === route.length - 2 ? 1.2 : 0.55);
    segments.push({ a, b, travelSeconds, pause, heading: Math.atan2(b.x - a.x, b.z - a.z) });
    cycleSeconds += travelSeconds + pause;
  }
  let t = ((timeSeconds % cycleSeconds) + cycleSeconds) % cycleSeconds;
  for (const segment of segments) {
    if (t <= segment.travelSeconds) {
      const k = smoothstep(segment.travelSeconds ? t / segment.travelSeconds : 1);
      return {
        x: segment.a.x + (segment.b.x - segment.a.x) * k,
        z: segment.a.z + (segment.b.z - segment.a.z) * k,
        heading: segment.heading,
        moving: k > 0.03 && k < 0.97
      };
    }
    t -= segment.travelSeconds;
    if (t <= segment.pause) return { x: segment.b.x, z: segment.b.z, heading: segment.heading, moving: false };
    t -= segment.pause;
  }
  const last = path.at(-1);
  return { ...last, heading: 0, moving: false };
}

export function createColegioAgvActivityController(context = {}) {
  const npcDefinitions = NPCS.map(normalizeNpcDefinition);
  let elapsed = 0;
  let activeAreaId = 'colegio_agv_area_entrada';
  let ambientEnabled = true;
  let ambientHandle = null;
  let currentSeat = null;
  let currentComputer = null;
  let sportsSession = null;
  let liveNotices = null;
  let liveSchedule = null;
  const doorOpen = new Map(ROOM_ZONES.map((room) => [room.interiorId, false]));
  const occupiedSeats = new Map();

  const coreNpcHandles = new Map();
  if (typeof context.spawnWorldNpc === 'function') {
    for (const npc of npcDefinitions) {
      try {
        const handle = context.spawnWorldNpc({ worldId: MAP_ID, ...clone(npc) });
        if (handle) coreNpcHandles.set(npc.id, handle);
      } catch { /* fallback visual do mapa assume quando disponível */ }
    }
  }

  function stopAmbient() {
    if (!ambientHandle) return;
    try {
      if (typeof ambientHandle === 'function') ambientHandle();
      else ambientHandle.stop?.();
    } catch { /* noop */ }
    ambientHandle = null;
  }

  function refreshAmbient() {
    stopAmbient();
    if (!ambientEnabled || typeof context.playWorldAmbient !== 'function') return;
    const profile = AMBIENT_PROFILES[activeAreaId] || AMBIENT_PROFILES.interior;
    try { ambientHandle = context.playWorldAmbient({ worldId: MAP_ID, areaId: activeAreaId, ...clone(profile) }) || null; }
    catch { ambientHandle = null; }
  }

  function setActiveArea(areaId) {
    if (!areaId || activeAreaId === areaId) return;
    activeAreaId = areaId;
    refreshAmbient();
  }

  function getNpcSnapshots() {
    return npcDefinitions.map((npc) => {
      const route = NPC_ROUTES[npc.routeId];
      const pos = route ? positionOnRouteNatural(route, Math.max(0, elapsed + npc.phaseOffset), npc.speed, npc.pauseSeconds) : { x: npc.x, z: npc.z, heading: 0, moving: false };
      return { ...clone(npc), x: pos.x, y: npc.y ?? 0, z: pos.z, heading: pos.heading, moving: pos.moving };
    });
  }

  function update(deltaSeconds = 0) {
    if (Number.isFinite(deltaSeconds) && deltaSeconds > 0 && deltaSeconds < 5) elapsed += deltaSeconds;
    const snapshots = getNpcSnapshots();
    if (typeof context.updateWorldNpc === 'function') {
      for (const npc of snapshots) {
        try { context.updateWorldNpc(coreNpcHandles.get(npc.id) || npc.id, { x: npc.x, y: npc.y, z: npc.z, heading: npc.heading }); } catch { /* noop */ }
      }
    }
    return snapshots;
  }

  async function refreshLiveData() {
    const noticeProvider = context.getSchoolNotices || context.getAgvNotices;
    const scheduleProvider = context.getSchoolSchedule || context.getAgvSchedule;
    try { liveNotices = typeof noticeProvider === 'function' ? await noticeProvider({ worldId: MAP_ID }) : null; } catch { liveNotices = null; }
    try { liveSchedule = typeof scheduleProvider === 'function' ? await scheduleProvider({ worldId: MAP_ID }) : null; } catch { liveSchedule = null; }
    return { notices: clone(liveNotices), schedule: clone(liveSchedule) };
  }

  function getLivePanel(kind) {
    if (kind === 'notices') return liveNotices ?? { title: 'Mural AGV+', status: 'provider-not-connected', items: [] };
    return liveSchedule ?? { title: 'Horários da escola', status: 'provider-not-connected', items: [] };
  }

  function setDoorOpen(interiorId, value, options = {}) {
    if (!doorOpen.has(interiorId)) return false;
    doorOpen.set(interiorId, Boolean(value));
    if (options.notify !== false) context.onDoorChange?.({ worldId: MAP_ID, interiorId, open: Boolean(value) });
    return true;
  }

  function applyRemoteDoorState(payload = {}) {
    return setDoorOpen(payload.interiorId, payload.open, { notify: false });
  }

  function sit(targetId, interiorId) {
    if (currentSeat === targetId) return true;
    const owner = occupiedSeats.get(targetId);
    if (owner && owner !== 'local') return false;
    if (currentSeat) occupiedSeats.delete(currentSeat);
    currentSeat = targetId;
    occupiedSeats.set(targetId, 'local');
    context.onSeatChange?.({ worldId: MAP_ID, interiorId, targetId, seated: true });
    return true;
  }

  function stand() {
    if (!currentSeat) return false;
    const old = currentSeat;
    if (occupiedSeats.get(old) === 'local') occupiedSeats.delete(old);
    currentSeat = null;
    context.onSeatChange?.({ worldId: MAP_ID, targetId: old, seated: false });
    return true;
  }

  function applyRemoteSeatState(payload = {}) {
    const targetId = payload.targetId;
    if (!targetId) return false;
    const owner = payload.clientId || payload.userId || payload.ownerId || 'remote';
    if (payload.seated === false) {
      if (occupiedSeats.get(targetId) !== 'local') occupiedSeats.delete(targetId);
      return true;
    }
    if (occupiedSeats.get(targetId) === 'local') return false;
    occupiedSeats.set(targetId, owner);
    return true;
  }

  function useComputer(targetId, interiorId) {
    currentComputer = { targetId, interiorId };
    if (typeof context.openSchoolComputer === 'function') {
      context.openSchoolComputer({ worldId: MAP_ID, targetId, interiorId, safeMode: true });
      return { handledByCore: true, targetId, interiorId };
    }
    return {
      handledByCore: false,
      title: 'Computador escolar',
      body: 'Estação interativa pronta para receber o portal ou aplicativo permitido pelo Core do AGV World.',
      targetId, interiorId
    };
  }

  function closeComputer() { const old = currentComputer; currentComputer = null; return Boolean(old); }

  function startSportsActivity(activityId = SPORTS_ACTIVITIES[0].id) {
    const activity = SPORTS_ACTIVITIES.find((item) => item.id === activityId);
    if (!activity) return null;
    sportsSession = { activityId, startedAt: Date.now(), score: { a: 0, b: 0 }, elapsedSeconds: 0 };
    context.onSportsActivity?.({ worldId: MAP_ID, active: true, activity: clone(activity), session: clone(sportsSession) });
    return clone(sportsSession);
  }

  function addSportsScore(team, points = 1) {
    if (!sportsSession || !['a', 'b'].includes(team)) return false;
    const n = Math.max(0, Math.min(3, Number(points) || 0));
    sportsSession.score[team] += n;
    context.onSportsScore?.({ worldId: MAP_ID, session: clone(sportsSession) });
    return true;
  }

  function endSportsActivity() {
    if (!sportsSession) return null;
    const result = clone(sportsSession); sportsSession = null;
    context.onSportsActivity?.({ worldId: MAP_ID, active: false, session: result });
    return result;
  }

  function applyRemoteSportsSession(payload = {}) {
    const next = payload.session ?? payload;
    sportsSession = next ? clone(next) : null;
    return clone(sportsSession);
  }

  function inspectStation(targetId, interiorId) {
    const def = getInteriorDefinition(interiorId);
    const station = def?.stations?.find((item) => item.id === targetId);
    if (!station) return null;
    return { title: def.name, targetId, stationType: station.type, body: `Ponto interativo: ${station.type}.` };
  }

  function interact(interactable, payload = {}) {
    const item = typeof interactable === 'string'
      ? [...F5_OUTDOOR_INTERACTABLES, ...listAllInteriorInteractables()].find((x) => x.id === interactable || x.targetId === interactable)
      : interactable;
    if (!item) return { ok: false, reason: 'not-found' };
    switch (item.interaction) {
      case 'sit': return { ok: sit(item.targetId, item.interiorId), action: 'sit', targetId: item.targetId };
      case 'stand': return { ok: stand(), action: 'stand' };
      case 'use-computer': return { ok: true, action: 'use-computer', result: useComputer(item.targetId, item.interiorId) };
      case 'use-water-fountain': context.onUtilityUse?.({ worldId: MAP_ID, type: 'water-fountain', targetId: item.targetId }); return { ok: true, action: 'use-water-fountain' };
      case 'inspect-station': return { ok: true, action: 'inspect-station', result: inspectStation(item.targetId, item.interiorId) };
      case 'open-live-notices': return { ok: true, action: 'open-live-notices', result: clone(getLivePanel('notices')) };
      case 'open-live-schedule': return { ok: true, action: 'open-live-schedule', result: clone(getLivePanel('schedule')) };
      case 'open-sports-menu': return { ok: true, action: 'open-sports-menu', result: SPORTS_ACTIVITIES.map(clone) };
      case 'open-sports-score': return { ok: true, action: 'open-sports-score', result: clone(sportsSession) };
      default: return { ok: false, reason: 'unsupported', interaction: item.interaction, payload };
    }
  }

  function stop() {
    stopAmbient();
    if (currentSeat) stand();
    endSportsActivity();
    for (const handle of coreNpcHandles.values()) {
      try { context.removeWorldNpc?.(handle); } catch { /* noop */ }
    }
    coreNpcHandles.clear();
  }

  refreshAmbient();

  return {
    update, stop, refreshLiveData, interact,
    getNpcDefinitions: () => npcDefinitions.map(clone),
    getNpcSnapshots,
    hasCoreNpcSystem: () => typeof context.spawnWorldNpc === 'function',
    getOutdoorInteractables: () => F5_OUTDOOR_INTERACTABLES.map(clone),
    getInteriorInteractables: (id) => listInteriorInteractables(id).map(clone),
    getAllInteriorInteractables: () => listAllInteriorInteractables().map(clone),
    setDoorOpen, applyRemoteDoorState,
    isDoorOpen: (id) => Boolean(doorOpen.get(id)),
    getDoorStates: () => Object.fromEntries(doorOpen),
    sit, stand, applyRemoteSeatState,
    getCurrentSeat: () => currentSeat,
    isSeatOccupied: (id) => occupiedSeats.has(id),
    getOccupiedSeats: () => Object.fromEntries(occupiedSeats),
    useComputer, closeComputer,
    getCurrentComputer: () => clone(currentComputer),
    getSportsActivities: () => SPORTS_ACTIVITIES.map(clone),
    startSportsActivity, addSportsScore, endSportsActivity, applyRemoteSportsSession,
    getSportsSession: () => clone(sportsSession),
    getLiveNotices: () => clone(getLivePanel('notices')),
    getLiveSchedule: () => clone(getLivePanel('schedule')),
    setAmbientEnabled(value) { ambientEnabled = Boolean(value); refreshAmbient(); },
    getAmbientEnabled: () => ambientEnabled,
    setActiveArea,
    getActiveArea: () => activeAreaId,
    getAmbientProfile: () => clone(AMBIENT_PROFILES[activeAreaId] || AMBIENT_PROFILES.interior)
  };
}

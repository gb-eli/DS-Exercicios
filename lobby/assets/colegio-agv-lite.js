import {
  MAP_BOUNDS, MAP_ID, MAP_LABEL, MAP_RETURN_PORTAL, MAP_SPAWN,
  DESTINATIONS, INTERACTABLES, AREAS, isInsideBounds
} from './world/colegio-agv-shared.js';
import {
  CAMPUS_BLOCKS, ROOM_ZONES, OUTDOOR_FEATURES, EXPANSION_2026_FEATURES,
  EXTERIOR_FURNITURE, VEGETATION, FENCES, GATES, COURT_MARKINGS, ACCESSIBLE_ROUTES,
  WAYFINDING_SIGNS, UTILITY_POINTS, SAFETY_POINTS
} from './world/colegio-agv-data.js';
import { getInteriorDefinition, listInteriors } from './world/colegio-agv-interiors.js';
import { SCHOOL_DIRECTORY, resolveInteractionContent } from './world/colegio-agv-experiences.js';
import { getColegioAgvMinimapData } from './world/colegio-agv-minimap.js';
import { createColegioAgvActivityController, F5_OUTDOOR_INTERACTABLES } from './world/colegio-agv-activity.js';
import { createColegioAgvInteractionResolver } from './world/colegio-agv-interactions.js';
import { createColegioAgvPerformanceController } from './world/colegio-agv-performance.js';
import { createColegioAgvSyncBridge } from './world/colegio-agv-sync.js';
import { createColegioAgvLearningController } from './world/colegio-agv-learning.js';
import { createColegioAgvF6Controller } from './world/colegio-agv-f6.js';
import { createColegioAgvF7Controller } from './world/colegio-agv-f7.js';

function delegate(context, name, fallback) {
  return (...args) => typeof context?.[name] === 'function' ? context[name](...args) : fallback;
}

export function createColegioAgvLite(context = {}) {
  const canvas = context.canvas;
  const ctx = canvas?.getContext?.('2d');
  const signal = context.signal;
  if (!canvas || !ctx) throw new Error('[colegio-agv/lite] context.canvas 2D é obrigatório.');

  let running = true, raf = 0, fps = 0, frameCount = 0, fpsWindowStart = performance.now();
  let showExpansion = Boolean(context?.state?.admin?.showFutureAgvSchool);
  let worldTimeMode = 'cycle';
  let currentInterior = null;
  let lastFrameTime = performance.now();
  let npcSnapshots = [];
  let lastAreaId = 'colegio_agv_area_entrada';
  let npcDeltaAccumulator = 0;
  let f6 = null;
  let f7 = null;
  const performanceController = createColegioAgvPerformanceController(context, 'lite');
  const sync = createColegioAgvSyncBridge(context);
  const activity = createColegioAgvActivityController({
    ...context,
    onDoorChange(event) { context.onDoorChange?.(event); sync.publishDoor(event); },
    onSeatChange(event) { context.onSeatChange?.(event); sync.publishSeat(event); },
    onSportsActivity(event) { context.onSportsActivity?.(event); sync.publishSports({ active: event.active, activity: event.activity, session: event.session || null }); },
    onSportsScore(event) { context.onSportsScore?.(event); sync.publishSports({ active: true, session: event.session }); }
  });
  const learning = createColegioAgvLearningController(context);
  sync.bindApplyHandlers({
    door: (payload) => activity.applyRemoteDoorState(payload),
    seat: (payload) => activity.applyRemoteSeatState(payload),
    sports: (payload) => activity.applyRemoteSportsSession(payload?.active === false ? null : (payload?.session ?? payload))
  });
  sync.start();
  activity.refreshLiveData().catch?.(() => {});

  function toCanvas(x, z) {
    const w = MAP_BOUNDS.maxX - MAP_BOUNDS.minX, d = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ;
    return { x: ((x - MAP_BOUNDS.minX) / w) * canvas.width, y: canvas.height - ((z - MAP_BOUNDS.minZ) / d) * canvas.height };
  }
  function rectWorld(x, z, width, depth) {
    const a = toCanvas(x - width / 2, z - depth / 2), b = toCanvas(x + width / 2, z + depth / 2);
    return { x: a.x, y: b.y, width: b.x - a.x, height: a.y - b.y };
  }
  function getPlayer() { return context?.state?.player || context?.player || MAP_SPAWN; }

  function drawInterior() {
    const def = getInteriorDefinition(currentInterior?.id);
    if (!def) return;
    ctx.fillStyle = '#d8d8d8'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const margin = Math.min(canvas.width, canvas.height) * 0.08;
    const rw = canvas.width - margin * 2, rh = canvas.height - margin * 2;
    ctx.fillStyle = '#f3f6f8'; ctx.fillRect(margin, margin, rw, rh);
    ctx.strokeStyle = '#0d5ea6'; ctx.lineWidth = 5; ctx.strokeRect(margin, margin, rw, rh);
    for (const station of def.stations) {
      const sx = margin + ((station.x + def.size.width / 2) / def.size.width) * rw;
      const sy = margin + ((station.z + def.size.depth / 2) / def.size.depth) * rh;
      ctx.fillStyle = station.type === 'board' || station.type === 'screen' ? '#0d5ea6' : '#5b6267';
      ctx.fillRect(sx - 6, sy - 5, 12, 10);
    }
    ctx.fillStyle = '#18252e'; ctx.font = `${Math.max(14, Math.round(canvas.width / 60))}px sans-serif`;
    ctx.fillText(`${def.name} · interior carregado sob demanda`, 14, 26);
  }

  function drawExterior() {
    ctx.fillStyle = worldTimeMode === 'night' ? '#18242c' : '#dfe7e4'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const street = rectWorld(0, 59.2, 156, 4.8); ctx.fillStyle = '#666b70'; ctx.fillRect(street.x, street.y, street.width, street.height);

    for (const feature of OUTDOOR_FEATURES) {
      const r = rectWorld(feature.x, feature.z, feature.width, feature.depth);
      ctx.fillStyle = feature.kind === 'green-area' ? '#7ea968' : feature.kind === 'sports-court' ? '#3a7eb5' : feature.kind === 'patterned-walkway' ? '#dedbd0' : '#c7c8c4';
      ctx.fillRect(r.x, r.y, r.width, r.height);
      if (feature.kind === 'patterned-walkway') {
        ctx.strokeStyle = '#60666a'; ctx.setLineDash([4, 4]); ctx.strokeRect(r.x, r.y, r.width, r.height); ctx.setLineDash([]);
      }
    }

    for (const block of CAMPUS_BLOCKS) {
      if (block.facade === 'open-corridor') continue;
      const r = rectWorld(block.x, block.z, block.width, block.depth);
      ctx.fillStyle = '#eef4f7'; ctx.fillRect(r.x, r.y, r.width, r.height);
      ctx.strokeStyle = '#0d5ea6'; ctx.lineWidth = Math.max(1, canvas.width / 900 * 2); ctx.strokeRect(r.x, r.y, r.width, r.height);
    }

    for (const room of ROOM_ZONES) {
      const r = rectWorld(room.x, room.z, room.width, room.depth);
      ctx.strokeStyle = '#6c7980'; ctx.setLineDash([3, 3]); ctx.strokeRect(r.x, r.y, r.width, r.height); ctx.setLineDash([]);
      const door = toCanvas(room.door.x, room.door.z); ctx.fillStyle = activity.isDoorOpen(room.interiorId) ? '#77aeda' : '#0d5ea6'; ctx.fillRect(door.x - 3, door.y - 3, 6, 6);
    }

    for (const line of COURT_MARKINGS) {
      const r = rectWorld(line.x, line.z, line.width, line.depth); ctx.fillStyle = '#f0f0e8'; ctx.fillRect(r.x, r.y, r.width, r.height);
    }
    for (const fence of FENCES) {
      const r = rectWorld(fence.x, fence.z, fence.width, fence.depth); ctx.fillStyle = '#343a3e'; ctx.fillRect(r.x, r.y, Math.max(r.width, 1), Math.max(r.height, 1));
    }
    for (const gate of GATES) {
      const p = toCanvas(gate.x, gate.z); ctx.strokeStyle = '#0c1114'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p.x - 12, p.y); ctx.lineTo(p.x + 12, p.y); ctx.stroke();
    }
    for (const item of EXTERIOR_FURNITURE) {
      const p = toCanvas(item.x, item.z); ctx.fillStyle = item.kind === 'bench' ? '#0d5ea6' : '#eceff1'; ctx.fillRect(p.x - 4, p.y - 2, 8, 4);
    }
    for (const item of WAYFINDING_SIGNS) { const p = toCanvas(item.x, item.z); ctx.fillStyle = '#0d5ea6'; ctx.fillRect(p.x - 7, p.y - 3, 14, 6); }
    for (const item of UTILITY_POINTS) { const p = toCanvas(item.x, item.z); ctx.fillStyle = '#8a969d'; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); }
    for (const item of SAFETY_POINTS) { const p = toCanvas(item.x, item.z); ctx.fillStyle = item.kind === 'fire-extinguisher' ? '#b32626' : '#1d8a52'; ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5); }

    for (const item of VEGETATION) {
      const p = toCanvas(item.x, item.z); ctx.fillStyle = '#4f7f45'; ctx.beginPath(); ctx.arc(p.x, p.y, item.kind === 'tree' ? 5 : 3, 0, Math.PI * 2); ctx.fill();
    }

    if (showExpansion) {
      ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = '#b8751a'; ctx.fillStyle = 'rgba(184,117,26,0.12)';
      for (const item of EXPANSION_2026_FEATURES) { const p = toCanvas(item.x, item.z); ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.restore();
    }

    for (const destination of DESTINATIONS) { const p = toCanvas(destination.x, destination.z); ctx.fillStyle = '#22313d'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.3, 0, Math.PI * 2); ctx.fill(); }
    for (const npc of npcSnapshots) { const p = toCanvas(npc.x, npc.z); ctx.fillStyle = npc.role === 'student' ? '#285d91' : '#50585e'; ctx.beginPath(); ctx.arc(p.x, p.y, 4.4, 0, Math.PI * 2); ctx.fill(); }
    const portal = toCanvas(MAP_RETURN_PORTAL.x, MAP_RETURN_PORTAL.z); ctx.strokeStyle = '#7f4bcc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(portal.x, portal.y, 9, 0, Math.PI * 2); ctx.stroke();
    const player = getPlayer(), pp = toCanvas(player.x ?? MAP_SPAWN.x, player.z ?? MAP_SPAWN.z); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(pp.x, pp.y, 5.5, 0, Math.PI * 2); ctx.fill();
    const weather = f7?.getWeatherState?.() || 'clear';
    if (weather === 'rain' || weather === 'storm') { ctx.fillStyle = weather === 'storm' ? 'rgba(30,42,55,0.20)' : 'rgba(70,100,125,0.10)'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    else if (weather === 'snow') { ctx.fillStyle = 'rgba(245,248,250,0.12)'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    else if (weather === 'fog') { ctx.fillStyle = 'rgba(220,226,229,0.16)'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.fillStyle = worldTimeMode === 'night' ? '#f0f4f6' : '#18252e'; ctx.font = `${Math.max(12, Math.round(canvas.width / 70))}px sans-serif`; ctx.fillText(`${MAP_LABEL} · Fase 7 · ${weather}`, 14, 24);
  }

  function updateActiveArea() {
    if (currentInterior) { activity.setActiveArea('interior'); return; }
    const player = getPlayer();
    let next = null;
    let best = Infinity;
    for (const area of AREAS) {
      const d = Math.hypot((player.x ?? MAP_SPAWN.x) - area.x, (player.z ?? MAP_SPAWN.z) - area.z);
      if (d <= area.radius && d < best) { next = area.id; best = d; }
    }
    if (next && next !== lastAreaId) {
      lastAreaId = next;
      activity.setActiveArea(next);
      context.onAreaChange?.({ worldId: MAP_ID, area: next });
    }
  }

  function draw() {
    if (!running) return;
    const nowFrame = performance.now();
    const deltaSeconds = Math.max(0, Math.min(0.2, (nowFrame - lastFrameTime) / 1000));
    lastFrameTime = nowFrame;
    npcDeltaAccumulator += deltaSeconds;
    if (performanceController.shouldUpdateNpc(deltaSeconds)) {
      npcSnapshots = activity.update(npcDeltaAccumulator);
      npcDeltaAccumulator = 0;
    }
    updateActiveArea();
    if (performanceController.shouldScanInteractions(deltaSeconds)) interactionResolver?.scan();
    f6?.update(deltaSeconds, fps);
    f7?.update(deltaSeconds);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentInterior) drawInterior(); else drawExterior();
    frameCount += 1;
    const now = performance.now();
    if (now - fpsWindowStart >= 1000) { fps = Math.round((frameCount * 1000) / (now - fpsWindowStart)); frameCount = 0; fpsWindowStart = now; context.onPerf?.({ worldId: MAP_ID, mode: 'lite', fps }); }
    raf = requestAnimationFrame(draw);
  }

  function resolveRoom(id) { return ROOM_ZONES.find((item) => item.id === id || item.interiorId === id) || null; }
  function enterBuilding(id) {
    const room = resolveRoom(id), interiorId = room?.interiorId || id, def = getInteriorDefinition(interiorId);
    if (!def) return context.enterBuilding?.(id) ?? false;
    if (currentInterior && currentInterior.id !== interiorId) exitBuilding();
    f7?.beginTransition('enter-interior', interiorId, { label: def.name });
    f7?.transitionMidpoint({ mode: 'lite' });
    currentInterior = { id: interiorId, returnPoint: room?.door || null };
    activity.setDoorOpen(interiorId, true);
    activity.setActiveArea('interior');
    context.teleportTo?.(def.spawn || { x: 0, y: 0.08, z: 3 });
    context.onInteriorChange?.({ worldId: MAP_ID, interiorId, active: true, label: def.name });
    f7?.finishTransition({ activeInteriorId: interiorId });
    return true;
  }
  function exitBuilding() {
    if (!currentInterior) return context.exitBuilding?.() ?? false;
    const old = currentInterior;
    f7?.beginTransition('exit-interior', old.id);
    activity.stand();
    activity.closeComputer();
    currentInterior = null;
    f7?.transitionMidpoint({ activeInteriorId: null });
    activity.setDoorOpen(old.id, false);
    activity.setActiveArea('colegio_agv_area_convivencia');
    if (old.returnPoint) context.teleportTo?.({ ...old.returnPoint, y: 0.08 });
    context.onInteriorChange?.({ worldId: MAP_ID, interiorId: old.id, active: false });
    f7?.finishTransition({ mode: 'lite' });
    return true;
  }
  function stop() {
    if (!running) return;
    running = false;
    interactionResolver?.clear();
    f7?.stop();
    f6?.stop();
    learning.end();
    sync.stop();
    activity.stop();
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const entranceInteractables = ROOM_ZONES.map((room) => ({ id: `${room.id}_entry`, type: 'building-entry', name: room.name, x: room.door.x, z: room.door.z, radius: 2, interaction: 'enter-building', targetId: room.interiorId }));

  function listRuntimeInteractables() {
    return [
      ...INTERACTABLES, ...entranceInteractables, ...F5_OUTDOOR_INTERACTABLES,
      ...(currentInterior ? activity.getInteriorInteractables(currentInterior.id).map((item) => item.type === 'seat' ? { ...item, occupied: activity.isSeatOccupied(item.targetId) } : item) : []),
      ...(currentInterior ? learning.getInteractables(currentInterior.id) : []),
      ...activity.getNpcSnapshots().map((npc) => ({ ...npc, type: 'npc', radius: 2.0 }))
    ];
  }

  function findInteractable(target) {
    if (target && typeof target === 'object') return target;
    return listRuntimeInteractables().find((item) => item.id === target || item.targetId === target) || null;
  }

  function interact(target, payload = {}) {
    const item = findInteractable(target);
    if (!item) return { ok: false, reason: 'not-found' };
    if (item.interaction === 'enter-building') { return { ok: enterBuilding(item.targetId), action: 'enter-building', targetId: item.targetId }; }
    if (item.interaction === 'exit-building') return { ok: exitBuilding(), action: 'exit-building' };
    if (item.interaction === 'travel') { const handled = context.travelToWorld?.(item.targetWorldId, item.targetSpawn) ?? false; return { ok: Boolean(handled), action: 'travel', targetWorldId: item.targetWorldId }; }
    if (item.type === 'npc') {
      const content = resolveInteractionContent(item.interaction) || { title: item.name, body: 'NPC de circulação do Colégio AGV.' };
      context.onNpcInteraction?.({ worldId: MAP_ID, npc: item, content });
      return { ok: true, action: 'npc', result: content };
    }
    if (item.interaction === 'start-learning') {
      const result = learning.start(item.targetId);
      return result ? { ok: true, action: 'start-learning', result } : { ok: false, reason: 'learning-not-found' };
    }
    const local = activity.interact(item, payload);
    if (local?.ok || !local?.reason || local.reason !== 'unsupported') return local;
    const content = resolveInteractionContent(item.interaction);
    if (content) return { ok: true, action: item.interaction, result: content };
    return context.onWorldInteraction?.({ worldId: MAP_ID, item, payload }) ?? { ok: false, reason: 'unsupported' };
  }

  const interactionResolver = createColegioAgvInteractionResolver({
    context,
    getInteractables: listRuntimeInteractables,
    getPlayer,
    getActiveInterior: () => currentInterior?.id || null,
    interact
  });
  f6 = createColegioAgvF6Controller({
    context, mode: 'lite', interactionResolver, learning,
    getActiveInterior: () => currentInterior?.id || null
  });
  f7 = createColegioAgvF7Controller({
    context, mode: 'lite', performanceController,
    getFocused: () => interactionResolver.getFocused()
  });
  if (signal) signal.addEventListener('abort', stop, { once: true });
  draw();

  return {
    id: MAP_ID, mode: 'lite', stop,
    getQuality: () => context.getQuality?.() ?? 'lite', getFPS: () => fps,
    getAvatarMode: () => context.getAvatarMode?.() ?? context?.state?.avatarMode ?? 'third-person',
    toggleCamera: delegate(context, 'toggleCamera'), setCameraMode: delegate(context, 'setCameraMode'), setFov: delegate(context, 'setFov'), getFov: () => context.getFov?.() ?? 60,
    setFPSCap: delegate(context, 'setFPSCap'), getFPSCap: () => context.getFPSCap?.() ?? 60,
    setWorldTimeMode(mode) { worldTimeMode = mode; context.setWorldTimeMode?.(mode); }, getWorldTimeMode: () => context.getWorldTimeMode?.() ?? worldTimeMode,
    setRun: delegate(context, 'setRun'), jump: delegate(context, 'jump'),
    teleportTo(destination) { const target = typeof destination === 'string' ? DESTINATIONS.find((item) => item.id === destination) : destination; if (!target || !isInsideBounds(target.x, target.z, 1)) return false; context.teleportTo?.(target); return true; },
    getDestinations: () => DESTINATIONS.map((item) => ({ ...item })), enterBuilding, exitBuilding, getActiveInterior: () => currentInterior?.id || null,
    showChatMessage: delegate(context, 'showChatMessage'), interact,
    update: (deltaSeconds = 0) => { npcSnapshots = activity.update(deltaSeconds); interactionResolver.scan(); f6?.update(deltaSeconds, fps); return npcSnapshots; },
    getInteractables: () => listRuntimeInteractables().map((item) => ({ ...item })), getAreas: () => AREAS.map((item) => ({ ...item })),
    scanInteractions: (options) => interactionResolver.scan(options), getFocusedInteraction: () => interactionResolver.getFocused(), getNearbyInteractables: () => interactionResolver.getNearby(), interactFocused: (payload) => interactionResolver.interactFocused(payload),
    getSchoolDirectory: () => SCHOOL_DIRECTORY.map((section) => ({ ...section, items: [...section.items] })),
    getMinimapData: () => getColegioAgvMinimapData({ includeExpansion: showExpansion }),
    getInteractionContent: (interaction) => resolveInteractionContent(interaction),
    getInteriorDefinitions: () => listInteriors().map((item) => ({ ...item, size: { ...item.size }, spawn: { ...item.spawn }, stations: item.stations.map((station) => ({ ...station })) })),
    getAccessibleRoutes: () => ACCESSIBLE_ROUTES.map((route) => ({ ...route, points: route.points.map((p) => ({ ...p })) })),
    refreshSchoolData: () => activity.refreshLiveData(), getLiveNotices: () => activity.getLiveNotices(), getLiveSchedule: () => activity.getLiveSchedule(),
    getNpcSnapshots: () => activity.getNpcSnapshots(), getDoorStates: () => activity.getDoorStates(),
    getOccupiedSeats: () => activity.getOccupiedSeats(),
    sit: (targetId, interiorId = currentInterior?.id) => activity.sit(targetId, interiorId), stand: () => activity.stand(), getCurrentSeat: () => activity.getCurrentSeat(),
    useComputer: (targetId, interiorId = currentInterior?.id) => activity.useComputer(targetId, interiorId), closeComputer: () => activity.closeComputer(), getCurrentComputer: () => activity.getCurrentComputer(),
    getSportsActivities: () => activity.getSportsActivities(), startSportsActivity: (id) => activity.startSportsActivity(id), addSportsScore: (team, points) => activity.addSportsScore(team, points), endSportsActivity: () => activity.endSportsActivity(), getSportsSession: () => activity.getSportsSession(),
    getLearningActivities: () => learning.getActivities(), startLearningActivity: (id) => learning.start(id), answerLearningActivity: (optionIndex) => f6.answerLearning(optionIndex), endLearningActivity: () => learning.end(), getLearningSession: () => learning.getCurrent(),
    getRemotePlayers: () => sync.getRemotePlayers(), refreshRemotePlayers: () => sync.refreshPresences(), getSyncStatus: () => ({ connected: sync.isConnected(), coreAvailable: sync.hasCoreSync() }),
    getPerformanceState: () => performanceController.getState(), getPerformanceProfile: () => performanceController.getProfile(),
    handleInput: (input, payload) => f6.handleInput(input, payload), getInteractionHint: () => f6.getInteractionHint(),
    getModeAssessment: () => f6.getModeAssessment(), applyModeRecommendation: () => f6.applyModeRecommendation(),
    getCollisionGeometry: () => f6.getCollisionGeometry(), resolveMovement: (from, desired, options) => f6.resolveMovement(from, desired, options),
    getRewardState: () => f6.getRewardState(), awardReward: (type, sourceId, meta) => f6.awardReward(type, sourceId, meta),
    getSportChallenges: () => f6.getSportChallenges(), startSportChallenge: (id) => f6.startSportChallenge(id), recordSportEvent: (type, payload) => f6.recordSportEvent(type, payload), getSportChallengeSession: () => f6.getSportChallengeSession(), usesCoreSportsPhysics: () => f6.usesCoreSportsPhysics(),
    setAmbientEnabled: (value) => activity.setAmbientEnabled(value), getAmbientEnabled: () => activity.getAmbientEnabled(), setActiveArea: (areaId) => activity.setActiveArea(areaId), getAmbientProfile: () => activity.getAmbientProfile(),
    getTransitionState: () => f7.getTransitionState(), getLodState: () => f7.getLodState(), getWeatherState: () => f7.getWeatherState(), refreshEnvironment: () => f7.refreshEnvironment(), triggerSchoolBell: (payload) => f7.triggerSchoolBell(payload),
    setExpansionPreview(value) { showExpansion = Boolean(value); }, getExpansionPreview: () => showExpansion
  };
}

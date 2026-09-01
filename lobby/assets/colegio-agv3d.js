import {
  MAP_BOUNDS,
  MAP_ID,
  MAP_LABEL,
  MAP_RETURN_PORTAL,
  DESTINATIONS,
  INTERACTABLES,
  AREAS,
  isInsideBounds
} from './world/colegio-agv-shared.js';
import { ROOM_ZONES, EXPANSION_2026_FEATURES, ACCESSIBLE_ROUTES } from './world/colegio-agv-data.js';
import { mountColegioAgvEnvironment3D } from './world/colegio-agv-environment.js';
import { mountColegioAgvInterior3D, disposeInterior3D, getInteriorDefinition, listInteriors } from './world/colegio-agv-interiors.js';
import { SCHOOL_DIRECTORY, resolveInteractionContent } from './world/colegio-agv-experiences.js';
import { getColegioAgvMinimapData } from './world/colegio-agv-minimap.js';
import { createColegioAgvActivityController, F5_OUTDOOR_INTERACTABLES } from './world/colegio-agv-activity.js';
import { mountColegioAgvPopulation3D } from './world/colegio-agv-population.js';
import { mountColegioAgvDoors3D } from './world/colegio-agv-doors.js';
import { createColegioAgvInteractionResolver } from './world/colegio-agv-interactions.js';
import { createColegioAgvPerformanceController } from './world/colegio-agv-performance.js';
import { createColegioAgvSyncBridge } from './world/colegio-agv-sync.js';
import { createColegioAgvLearningController } from './world/colegio-agv-learning.js';
import { createColegioAgvF6Controller } from './world/colegio-agv-f6.js';
import { createColegioAgvF7Controller } from './world/colegio-agv-f7.js';

function disposeObject3D(root) {
  if (!root) return;
  const disposedGeometries = new Set();
  const disposedMaterials = new Set();
  root.traverse((object) => {
    if (object.geometry && !disposedGeometries.has(object.geometry)) {
      disposedGeometries.add(object.geometry);
      object.geometry.dispose?.();
    }
    const mats = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of mats) {
      if (!material || disposedMaterials.has(material)) continue;
      disposedMaterials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose?.();
      material.dispose?.();
    }
  });
  root.removeFromParent?.();
}

function delegate(context, name, fallback) {
  return (...args) => typeof context?.[name] === 'function' ? context[name](...args) : fallback;
}

export function createColegioAgv3D(context = {}) {
  const THREE = context.THREE || globalThis.THREE;
  const scene = context.threeScene || context.scene3D || context.worldScene;
  const signal = context.signal;
  if (!THREE || !scene?.add) throw new Error('[colegio-agv/3d] THREE e scene 3D do Core são obrigatórios.');

  let stopped = false;
  let worldTimeMode = 'cycle';
  let currentInterior = null;
  let expansionPreview = Boolean(context?.state?.admin?.showFutureAgvSchool);
  let cleanupWorldUpdate = null;
  let lastAreaId = 'colegio_agv_area_entrada';
  let npcDeltaAccumulator = 0;
  let fpsSampleAccumulator = 0;
  let presenceAccumulator = 0;
  let lastNpcSnapshots = [];
  let f6 = null;
  let f7 = null;

  const root = new THREE.Group();
  root.name = 'colegio_agv_root';
  root.userData.worldId = MAP_ID;
  scene.add(root);

  const exterior = mountColegioAgvEnvironment3D({ THREE, parent: root, bounds: MAP_BOUNDS });
  exterior?.setWorldTimeMode?.(worldTimeMode);
  const exteriorGroup = exterior?.group;

  const performanceController = createColegioAgvPerformanceController(context, '3d');
  const sync = createColegioAgvSyncBridge(context);
  let doors = null;
  const activity = createColegioAgvActivityController({
    ...context,
    onDoorChange(event) { context.onDoorChange?.(event); sync.publishDoor(event); },
    onSeatChange(event) { context.onSeatChange?.(event); sync.publishSeat(event); },
    onSportsActivity(event) { context.onSportsActivity?.(event); sync.publishSports({ active: event.active, activity: event.activity, session: event.session || null }); },
    onSportsScore(event) { context.onSportsScore?.(event); sync.publishSports({ active: true, session: event.session }); }
  });
  const learning = createColegioAgvLearningController(context);
  sync.bindApplyHandlers({
    door: (payload) => { activity.applyRemoteDoorState(payload); doors?.update?.(); },
    seat: (payload) => activity.applyRemoteSeatState(payload),
    sports: (payload) => activity.applyRemoteSportsSession(payload?.active === false ? null : (payload?.session ?? payload))
  });
  sync.start();
  const population = mountColegioAgvPopulation3D({ THREE, parent: exteriorGroup || root, controller: activity });
  doors = mountColegioAgvDoors3D({ THREE, parent: exteriorGroup || root, controller: activity });
  activity.refreshLiveData().catch?.(() => {});

  const portalRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.16, 10, 36),
    new THREE.MeshStandardMaterial({ color: 0x7b4bc2, emissive: 0x2b0d51, emissiveIntensity: 0.7 })
  );
  portalRing.position.set(MAP_RETURN_PORTAL.x, 1.8, MAP_RETURN_PORTAL.z);
  portalRing.name = MAP_RETURN_PORTAL.id;
  exteriorGroup?.add(portalRing);

  const futureMaterial = new THREE.MeshStandardMaterial({ color: 0xc18b31, transparent: true, opacity: 0.28, roughness: 0.8 });
  const futureGroup = new THREE.Group();
  futureGroup.name = 'colegio_agv_future_2026_preview';
  exteriorGroup?.add(futureGroup);

  function refreshFuturePreview() {
    while (futureGroup.children.length) {
      const child = futureGroup.children.pop();
      child.geometry?.dispose?.();
    }
    futureGroup.visible = expansionPreview;
    if (!expansionPreview) return;
    for (const feature of EXPANSION_2026_FEATURES) {
      const marker = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.18, 20), futureMaterial);
      marker.position.set(feature.x, 0.12, feature.z);
      marker.name = feature.id;
      marker.userData.label = feature.name;
      futureGroup.add(marker);
    }
  }
  refreshFuturePreview();

  const entranceInteractables = ROOM_ZONES.map((room) => ({
    id: `${room.id}_entry`,
    type: 'building-entry',
    name: room.name,
    x: room.door.x,
    z: room.door.z,
    radius: 2.0,
    interaction: 'enter-building',
    targetId: room.interiorId
  }));

  function resolveRoom(id) {
    return ROOM_ZONES.find((item) => item.id === id || item.interiorId === id) || null;
  }

  function enterBuilding(id) {
    if (stopped) return false;
    const room = resolveRoom(id);
    const interiorId = room?.interiorId || id;
    const def = getInteriorDefinition(interiorId);
    if (!def) return context.enterBuilding?.(id) ?? false;

    if (currentInterior) exitBuilding();
    f7?.beginTransition('enter-interior', interiorId, { label: def.name });
    exteriorGroup.visible = false;
    f7?.transitionMidpoint({ exteriorVisible: false });
    const group = mountColegioAgvInterior3D({ THREE, parent: root, interiorId });
    if (!group) {
      exteriorGroup.visible = true;
      f7?.cancelTransition('interior-mount-failed');
      return false;
    }
    group.position.set(0, 0.05, 0);
    performanceController.apply3D(group);
    currentInterior = { id: interiorId, group, returnPoint: room?.door || null };
    activity.setDoorOpen(interiorId, true);
    activity.setActiveArea('interior');
    doors?.update?.();
    context.teleportTo?.(def.spawn || { x: 0, y: 0.08, z: 3 });
    context.onInteriorChange?.({ worldId: MAP_ID, interiorId, active: true, label: def.name });
    f7?.finishTransition({ activeInteriorId: interiorId });
    return true;
  }

  function exitBuilding() {
    if (!currentInterior) return context.exitBuilding?.() ?? false;
    const { id, group, returnPoint } = currentInterior;
    f7?.beginTransition('exit-interior', id);
    activity.stand();
    activity.closeComputer();
    learning.end();
    disposeInterior3D(group);
    currentInterior = null;
    f7?.transitionMidpoint({ activeInteriorId: null });
    exteriorGroup.visible = true;
    activity.setDoorOpen(id, false);
    activity.setActiveArea('colegio_agv_area_convivencia');
    doors?.update?.();
    if (returnPoint) context.teleportTo?.({ ...returnPoint, y: 0.08 });
    context.onInteriorChange?.({ worldId: MAP_ID, interiorId: id, active: false });
    f7?.finishTransition({ exteriorVisible: true });
    return true;
  }

  function update(deltaSeconds = 0) {
    if (stopped) return [];
    const delta = Math.max(0, Math.min(1, Number(deltaSeconds) || 0));
    npcDeltaAccumulator += delta;
    if (performanceController.shouldUpdateNpc(delta)) {
      const npcStep = npcDeltaAccumulator;
      lastNpcSnapshots = activity.update(npcStep);
      npcDeltaAccumulator = 0;
      const player = context?.state?.player || context?.player || null;
      const profile = performanceController.getProfileId?.() || 'high';
      const maxNpcDistance = ({ lite: 22, low: 30, medium: 48, high: 72 })[profile] || 72;
      population?.update?.(lastNpcSnapshots, npcStep, { player, maxDistance: maxNpcDistance });
    }
    if (performanceController.shouldScanInteractions(delta)) interactionResolver?.scan();
    f6?.update(delta, context.getFPS?.() ?? 0);
    f7?.update(delta);
    portalRing.rotation.y += delta * 0.55;
    const clockMs = globalThis.performance?.now?.() ?? Date.now();
    const pulse = 1 + Math.sin(clockMs * 0.0025) * 0.035;
    portalRing.scale?.setScalar?.(pulse);
    if (expansionPreview) for (const marker of futureGroup.children) marker.scale?.setScalar?.(0.96 + Math.sin((clockMs * 0.002) + String(marker.name || marker.id).length) * 0.05);
    fpsSampleAccumulator += delta;
    if (fpsSampleAccumulator >= 1) {
      const sampledFps = context.getFPS?.();
      if (Number.isFinite(sampledFps) && sampledFps > 0) performanceController.recordFPS(sampledFps);
      performanceController.apply3D(root);
      fpsSampleAccumulator %= 1;
    }
    presenceAccumulator += delta;
    if (presenceAccumulator >= 2) { sync.refreshPresences(); presenceAccumulator %= 2; }
    const snapshots = lastNpcSnapshots;
    if (!currentInterior) {
      const player = context?.state?.player || context?.player;
      if (player) {
        let next = null, best = Infinity;
        for (const area of AREAS) {
          const d = Math.hypot((player.x ?? 0) - area.x, (player.z ?? 0) - area.z);
          if (d <= area.radius && d < best) { next = area.id; best = d; }
        }
        if (next && next !== lastAreaId) {
          lastAreaId = next;
          activity.setActiveArea(next);
          context.onAreaChange?.({ worldId: MAP_ID, area: next });
        }
      }
    }
    doors?.update?.(delta);
    return snapshots;
  }

  function listRuntimeInteractables() {
    return [
      ...INTERACTABLES,
      ...entranceInteractables,
      ...F5_OUTDOOR_INTERACTABLES,
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
    if (item.interaction === 'enter-building') {
      return { ok: enterBuilding(item.targetId), action: 'enter-building', targetId: item.targetId };
    }
    if (item.interaction === 'exit-building') return { ok: exitBuilding(), action: 'exit-building' };
    if (item.interaction === 'travel') {
      const handled = context.travelToWorld?.(item.targetWorldId, item.targetSpawn) ?? false;
      return { ok: Boolean(handled), action: 'travel', targetWorldId: item.targetWorldId };
    }
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

  function stop() {
    if (stopped) return;
    stopped = true;
    try { cleanupWorldUpdate?.(); } catch { /* noop */ }
    cleanupWorldUpdate = null;
    interactionResolver?.clear();
    f7?.stop();
    f6?.stop();
    learning.end();
    sync.stop();
    activity.stop();
    population?.dispose?.();
    if (currentInterior) disposeInterior3D(currentInterior.group);
    currentInterior = null;
    disposeObject3D(root);
  }

  const interactionResolver = createColegioAgvInteractionResolver({
    context,
    getInteractables: listRuntimeInteractables,
    getPlayer: () => context?.state?.player || context?.player || { x: 0, z: 0 },
    getActiveInterior: () => currentInterior?.id || null,
    interact
  });
  f6 = createColegioAgvF6Controller({
    context, mode: '3d', interactionResolver, learning,
    getActiveInterior: () => currentInterior?.id || null
  });
  f7 = createColegioAgvF7Controller({
    context, mode: '3d', root, exterior, performanceController,
    getFocused: () => interactionResolver.getFocused()
  });
  performanceController.apply3D(root);

  if (typeof context.registerWorldUpdate === 'function') {
    try {
      const cleanup = context.registerWorldUpdate(update);
      if (typeof cleanup === 'function') cleanupWorldUpdate = cleanup;
    } catch { /* Core sem registrador compatível: update() continua público. */ }
  }
  update(0);
  if (signal) signal.addEventListener('abort', stop, { once: true });
  context.onAreaChange?.({ worldId: MAP_ID, area: 'colegio_agv_area_entrada' });
  context.onWorldReady?.({ worldId: MAP_ID, scene: 'colegio-agv', label: MAP_LABEL });

  return {
    id: MAP_ID,
    mode: '3d',
    root,
    stop,
    getQuality: () => context.getQuality?.() ?? 'high',
    getFPS: () => context.getFPS?.() ?? 0,
    getAvatarMode: () => context.getAvatarMode?.() ?? context?.state?.avatarMode ?? 'third-person',
    toggleCamera: delegate(context, 'toggleCamera'),
    setCameraMode: delegate(context, 'setCameraMode'),
    setFov: delegate(context, 'setFov'),
    getFov: () => context.getFov?.() ?? 60,
    setFPSCap: delegate(context, 'setFPSCap'),
    getFPSCap: () => context.getFPSCap?.() ?? 60,
    setWorldTimeMode(mode) { worldTimeMode = mode; exterior?.setWorldTimeMode?.(mode); context.setWorldTimeMode?.(mode); },
    getWorldTimeMode: () => context.getWorldTimeMode?.() ?? worldTimeMode,
    setRun: delegate(context, 'setRun'),
    jump: delegate(context, 'jump'),
    teleportTo(destination) {
      const target = typeof destination === 'string' ? DESTINATIONS.find((item) => item.id === destination) : destination;
      if (!target || !isInsideBounds(target.x, target.z, 1)) return false;
      context.teleportTo?.(target);
      return true;
    },
    getDestinations: () => DESTINATIONS.map((item) => ({ ...item })),
    enterBuilding,
    exitBuilding,
    getActiveInterior: () => currentInterior?.id || null,
    showChatMessage: delegate(context, 'showChatMessage'),
    update, interact,
    getInteractables: () => listRuntimeInteractables().map((item) => ({ ...item })),
    scanInteractions: (options) => interactionResolver.scan(options),
    getFocusedInteraction: () => interactionResolver.getFocused(),
    getNearbyInteractables: () => interactionResolver.getNearby(),
    interactFocused: (payload) => interactionResolver.interactFocused(payload),
    getAreas: () => AREAS.map((item) => ({ ...item })),
    getSchoolDirectory: () => SCHOOL_DIRECTORY.map((section) => ({ ...section, items: [...section.items] })),
    getMinimapData: () => getColegioAgvMinimapData({ includeExpansion: expansionPreview }),
    getInteractionContent: (interaction) => resolveInteractionContent(interaction),
    getInteriorDefinitions: () => listInteriors().map((item) => ({ ...item, size: { ...item.size }, spawn: { ...item.spawn }, stations: item.stations.map((station) => ({ ...station })) })),
    getAccessibleRoutes: () => ACCESSIBLE_ROUTES.map((route) => ({ ...route, points: route.points.map((p) => ({ ...p })) })),
    refreshSchoolData: () => activity.refreshLiveData(),
    getLiveNotices: () => activity.getLiveNotices(),
    getLiveSchedule: () => activity.getLiveSchedule(),
    getNpcSnapshots: () => activity.getNpcSnapshots(),
    getDoorStates: () => activity.getDoorStates(),
    getOccupiedSeats: () => activity.getOccupiedSeats(),
    sit: (targetId, interiorId = currentInterior?.id) => activity.sit(targetId, interiorId),
    stand: () => activity.stand(),
    getCurrentSeat: () => activity.getCurrentSeat(),
    useComputer: (targetId, interiorId = currentInterior?.id) => activity.useComputer(targetId, interiorId),
    closeComputer: () => activity.closeComputer(),
    getCurrentComputer: () => activity.getCurrentComputer(),
    getSportsActivities: () => activity.getSportsActivities(),
    startSportsActivity: (id) => activity.startSportsActivity(id),
    addSportsScore: (team, points) => activity.addSportsScore(team, points),
    endSportsActivity: () => activity.endSportsActivity(),
    getSportsSession: () => activity.getSportsSession(),
    getLearningActivities: () => learning.getActivities(),
    startLearningActivity: (id) => learning.start(id),
    answerLearningActivity: (optionIndex) => f6.answerLearning(optionIndex),
    endLearningActivity: () => learning.end(),
    getLearningSession: () => learning.getCurrent(),
    getRemotePlayers: () => sync.getRemotePlayers(),
    refreshRemotePlayers: () => sync.refreshPresences(),
    getSyncStatus: () => ({ connected: sync.isConnected(), coreAvailable: sync.hasCoreSync() }),
    getPerformanceState: () => performanceController.getState(),
    getPerformanceProfile: () => performanceController.getProfile(),
    handleInput: (input, payload) => f6.handleInput(input, payload),
    getInteractionHint: () => f6.getInteractionHint(),
    getModeAssessment: () => f6.getModeAssessment(),
    applyModeRecommendation: () => f6.applyModeRecommendation(),
    getCollisionGeometry: () => f6.getCollisionGeometry(),
    resolveMovement: (from, desired, options) => f6.resolveMovement(from, desired, options),
    getRewardState: () => f6.getRewardState(),
    awardReward: (type, sourceId, meta) => f6.awardReward(type, sourceId, meta),
    getSportChallenges: () => f6.getSportChallenges(),
    startSportChallenge: (id) => f6.startSportChallenge(id),
    recordSportEvent: (type, payload) => f6.recordSportEvent(type, payload),
    getSportChallengeSession: () => f6.getSportChallengeSession(),
    usesCoreSportsPhysics: () => f6.usesCoreSportsPhysics(),
    setAmbientEnabled: (value) => activity.setAmbientEnabled(value),
    getAmbientEnabled: () => activity.getAmbientEnabled(),
    setActiveArea: (areaId) => activity.setActiveArea(areaId),
    getAmbientProfile: () => activity.getAmbientProfile(),
    getDoorAnimationState: () => doors?.getDoorAnimationState?.() || {},
    getTransitionState: () => f7.getTransitionState(),
    getLodState: () => f7.getLodState(),
    getWeatherState: () => f7.getWeatherState(),
    refreshEnvironment: () => f7.refreshEnvironment(),
    triggerSchoolBell: (payload) => f7.triggerSchoolBell(payload),
    setExpansionPreview(value) { expansionPreview = Boolean(value); refreshFuturePreview(); },
    getExpansionPreview: () => expansionPreview
  };
}

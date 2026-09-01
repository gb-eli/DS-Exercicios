import {
  MAP_ID, MAP_SPAWN_ID, MAP_SPAWN, CHECKPOINTS, FINISH_ZONE, LABYRINTH_RULES,
  distance2D, getSectorForPosition
} from './labirinto-armadilhas-shared.js';
import { TRAPS, isTrapActive, pointHitsTrap } from './labirinto-armadilhas-data.js';

function makeAttemptId() {
  try { return crypto.randomUUID(); } catch { return `${MAP_ID}-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

export function createLabyrinthChallenge(context = {}) {
  const now = () => typeof context.now === 'function' ? context.now() : (globalThis.performance?.now?.() ?? Date.now());
  let attemptId = makeAttemptId();
  let startedAt = now();
  let lives = LABYRINTH_RULES.startingLives;
  let score = 0;
  let xp = 0;
  let deaths = 0;
  let finished = false;
  let defeated = false;
  let gaveUp = false;
  let lastDamageAt = -Infinity;
  let checkpoint = { id:MAP_SPAWN_ID, order:0, ...MAP_SPAWN };
  let currentSector = 1;
  const reached = new Set();
  const triggeredTraps = new Map();
  const manualTrapOverrides = new Map();

  const emit = (type, payload = {}) => context.onChallengeEvent?.({
    type, mapId:MAP_ID, attemptId, timestamp:Date.now(), ...payload
  });

  function snapshot() {
    const elapsedSeconds = Math.max(0, Math.floor((now() - startedAt) / 1000));
    return {
      attemptId, lives, maxLives:LABYRINTH_RULES.maxLives, score, xp, deaths,
      finished, defeated, gaveUp, elapsedSeconds,
      checkpointId:checkpoint.id, checkpointOrder:checkpoint.order || 0,
      checkpointsReached:reached.size, totalCheckpoints:CHECKPOINTS.length,
      currentSector, progress:Math.min(1, reached.size / CHECKPOINTS.length),
      trapHits:[...triggeredTraps.entries()].map(([trapId,count]) => ({ trapId,count }))
    };
  }

  function resetAttempt() {
    attemptId = makeAttemptId();
    startedAt = now(); lives = LABYRINTH_RULES.startingLives; score = 0; xp = 0; deaths = 0;
    finished = false; defeated = false; gaveUp = false; lastDamageAt = -Infinity;
    checkpoint = { id:MAP_SPAWN_ID, order:0, ...MAP_SPAWN };
    currentSector = 1; reached.clear(); triggeredTraps.clear(); manualTrapOverrides.clear();
    emit('labyrinth-attempt-started', snapshot());
    return snapshot();
  }

  function setTrapOverride(trapId, active) {
    if (active == null) manualTrapOverrides.delete(trapId);
    else manualTrapOverrides.set(trapId, Boolean(active));
  }

  function damageFromTrap(trap, playerPosition) {
    if (finished || defeated || gaveUp) return null;
    const t = now();
    if ((t - lastDamageAt) < LABYRINTH_RULES.invulnerabilityMs) return null;
    lastDamageAt = t;
    lives = Math.max(0, lives - LABYRINTH_RULES.trapDamage);
    deaths += 1;
    triggeredTraps.set(trap.id, (triggeredTraps.get(trap.id) || 0) + 1);

    const respawn = { x:checkpoint.x, y:MAP_SPAWN.y, z:checkpoint.z };
    emit('labyrinth-trap-hit', { trapId:trap.id, trapKind:trap.kind, playerPosition, lives, respawn });

    if (lives <= 0) {
      defeated = true;
      xp = LABYRINTH_RULES.xpDefeat;
      emit('labyrinth-defeated', snapshot());
      return { action:'defeat', state:snapshot() };
    }
    return { action:'respawn', position:respawn, state:snapshot() };
  }

  function tryCheckpoint(playerPosition) {
    for (const cp of CHECKPOINTS) {
      if (reached.has(cp.id) || distance2D(playerPosition, cp) > cp.radius) continue;
      if (LABYRINTH_RULES.requireSequentialCheckpoints && cp.order !== reached.size + 1) {
        emit('labyrinth-checkpoint-out-of-order', { checkpointId:cp.id, expectedOrder:reached.size + 1 });
        return { action:'checkpoint-locked', checkpoint:cp, state:snapshot() };
      }
      reached.add(cp.id); checkpoint = cp; currentSector = Math.min(4, cp.sector + (cp.order === 4 ? 0 : 1));
      score += LABYRINTH_RULES.checkpointScore; xp += LABYRINTH_RULES.xpCheckpoint;
      emit('labyrinth-checkpoint', { checkpointId:cp.id, checkpointOrder:cp.order, score, xp, lives });
      return { action:'checkpoint', checkpoint:cp, state:snapshot() };
    }
    return null;
  }

  function finish() {
    if (finished || defeated || gaveUp) return null;
    if (LABYRINTH_RULES.requireSequentialCheckpoints && reached.size < CHECKPOINTS.length) {
      emit('labyrinth-finish-locked', { checkpointsReached:reached.size, required:CHECKPOINTS.length });
      return { action:'finish-locked', state:snapshot() };
    }
    finished = true;
    const elapsedSeconds = Math.max(1, Math.floor((now() - startedAt) / 1000));
    const timeBonusSeconds = Math.max(0, LABYRINTH_RULES.parTimeSeconds - elapsedSeconds);
    const timeBonus = timeBonusSeconds * LABYRINTH_RULES.scorePerSecondUnderPar;
    const lifeBonus = lives * LABYRINTH_RULES.lifeBonusScore;
    const noDeathScoreBonus = deaths === 0 ? 2000 : 0;
    score += LABYRINTH_RULES.finishScore + timeBonus + lifeBonus + noDeathScoreBonus;
    xp += LABYRINTH_RULES.xpBaseFinish + lives * LABYRINTH_RULES.xpPerRemainingLife;
    if (deaths === 0) xp += LABYRINTH_RULES.xpNoDeathBonus;
    const result = { ...snapshot(), timeBonus, lifeBonus, noDeathScoreBonus, uniqueTrapHits:triggeredTraps.size };
    emit('labyrinth-finished', result);
    return { action:'finish', state:result };
  }

  function update(playerPosition, nowMs = now()) {
    if (finished || defeated || gaveUp || !playerPosition) return null;
    const sector = getSectorForPosition(playerPosition);
    if (sector && sector.order !== currentSector) {
      currentSector = sector.order;
      emit('labyrinth-sector-change', { sectorId:sector.id, sectorOrder:sector.order, sectorLabel:sector.label });
    }

    for (const trap of TRAPS) {
      const override = manualTrapOverrides.get(trap.id);
      const active = override == null ? isTrapActive(trap, nowMs) : override;
      if (active && pointHitsTrap(playerPosition, trap)) {
        const result = damageFromTrap(trap, playerPosition);
        if (result) return result;
      }
    }

    const cpResult = tryCheckpoint(playerPosition);
    if (cpResult) return cpResult;
    if (distance2D(playerPosition, FINISH_ZONE) <= FINISH_ZONE.radius) return finish();
    return null;
  }

  function giveUp() {
    if (finished || defeated || gaveUp) return snapshot();
    gaveUp = true; xp = LABYRINTH_RULES.xpGiveUp;
    emit('labyrinth-give-up', snapshot());
    emit('world-return-request', { reason:'give-up', targetWorldId:'campus-ds', targetSpawn:'default' });
    return snapshot();
  }

  return { snapshot, resetAttempt, update, finish, giveUp, setTrapOverride };
}

import { MAP_ID } from './colegio-agv-shared.js';

function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

export const F6_SPORT_CHALLENGES = Object.freeze([
  Object.freeze({ id: 'colegio_agv_sport_circuit', label: 'Circuito da quadra', kind: 'checkpoint-time-trial', maxPlayers: 1, targetSeconds: 45, virtualOverlay: true }),
  Object.freeze({ id: 'colegio_agv_sport_team_challenge', label: 'Desafio por equipes', kind: 'team-score', maxPlayers: 12, targetScore: 10, virtualOverlay: true }),
  Object.freeze({ id: 'colegio_agv_sport_precision', label: 'Desafio de precisão', kind: 'target-score', maxPlayers: 4, targetScore: 8, virtualOverlay: true })
]);

export function createColegioAgvSportsF6Controller({ context = {}, rewardBridge } = {}) {
  let session = null;
  let physicsHandle = null;

  function start(id) {
    const challenge = F6_SPORT_CHALLENGES.find((x) => x.id === id);
    if (!challenge) return null;
    session = { id, startedAt: Date.now(), elapsedSeconds: 0, score: { a: 0, b: 0 }, checkpoints: 0, completed: false };
    if (typeof context.startWorldSportPhysics === 'function') {
      try { physicsHandle = context.startWorldSportPhysics({ worldId: MAP_ID, challenge: clone(challenge), session: clone(session), authoritative: true }) || null; } catch { physicsHandle = null; }
    }
    context.onSportsChallenge?.({ worldId: MAP_ID, active: true, challenge: clone(challenge), session: clone(session) });
    return getSession();
  }

  function event(type, payload = {}) {
    if (!session || session.completed) return { ok: false, reason: 'no-active-challenge' };
    const challenge = F6_SPORT_CHALLENGES.find((x) => x.id === session.id);
    if (type === 'checkpoint') session.checkpoints += 1;
    if (type === 'score') {
      const team = payload.team === 'b' ? 'b' : 'a';
      session.score[team] += Math.max(0, Math.min(3, Number(payload.points) || 1));
    }
    if (type === 'finish') session.completed = true;
    if (challenge?.targetScore && Math.max(session.score.a, session.score.b) >= challenge.targetScore) session.completed = true;
    context.onSportsChallengeProgress?.({ worldId: MAP_ID, type, payload: clone(payload), session: clone(session) });
    if (session.completed) rewardBridge?.award('sport-complete', session.id, { score: session.score, checkpoints: session.checkpoints });
    return { ok: true, completed: session.completed, session: getSession() };
  }

  function update(delta = 0) {
    if (!session || session.completed) return getSession();
    session.elapsedSeconds += Math.max(0, Number(delta) || 0);
    return getSession();
  }

  function stop() {
    if (physicsHandle) {
      try { context.stopWorldSportPhysics?.(physicsHandle); } catch { /* noop */ }
    }
    if (session) context.onSportsChallenge?.({ worldId: MAP_ID, active: false, session: clone(session) });
    physicsHandle = null;
    session = null;
  }

  function getSession() { return clone(session); }
  return { start, event, update, stop, getSession, getChallenges: () => F6_SPORT_CHALLENGES.map(clone), usesCorePhysics: () => typeof context.startWorldSportPhysics === 'function' };
}

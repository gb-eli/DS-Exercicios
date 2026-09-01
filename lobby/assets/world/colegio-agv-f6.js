import { MAP_ID } from './colegio-agv-shared.js';
import { createColegioAgvInputBridge } from './colegio-agv-input.js';
import { createColegioAgvModeAdvisor } from './colegio-agv-benchmark.js';
import { createColegioAgvRewardBridge } from './colegio-agv-rewards.js';
import { createColegioAgvSportsF6Controller } from './colegio-agv-sports-f6.js';
import { getColegioAgvCollisionGeometry, resolveColegioAgvMovement } from './colegio-agv-collisions.js';

export function createColegioAgvF6Controller({ context = {}, mode, interactionResolver, learning, getActiveInterior } = {}) {
  const rewards = createColegioAgvRewardBridge(context);
  const advisor = createColegioAgvModeAdvisor(context, mode);
  const input = createColegioAgvInputBridge({
    context,
    getFocused: () => interactionResolver?.getFocused?.(),
    getFocusSource: () => interactionResolver?.getFocusSource?.(),
    interactFocused: (payload) => interactionResolver?.interactFocused?.(payload)
  });
  const sports = createColegioAgvSportsF6Controller({ context, rewardBridge: rewards });
  let elapsed = 0;

  function update(delta = 0, fps = 0) {
    elapsed += Math.max(0, Number(delta) || 0);
    input.update();
    sports.update(delta);
    if (elapsed >= 3) {
      advisor.evaluate({ fps });
      advisor.applyRecommendation();
      elapsed = 0;
    }
  }

  function answerLearning(optionIndex) {
    const before = learning?.getCurrent?.();
    const result = learning?.answer?.(optionIndex) || { ok: false, reason: 'learning-unavailable' };
    if (result?.completed && before?.activity?.id) {
      rewards.award('learning-complete', before.activity.id, { score: result.score, total: result.total });
      if (result.score === result.total) rewards.award('learning-perfect', before.activity.id, { score: result.score, total: result.total });
    }
    return result;
  }

  function resolveMovement(from, desired, options = {}) {
    const result = resolveColegioAgvMovement(from, desired, { ...options, activeInteriorId: options.activeInteriorId ?? getActiveInterior?.() ?? null });
    context.onMapCollision?.({ worldId: MAP_ID, from: { ...from }, desired: { ...desired }, resolved: { ...result } });
    return result;
  }

  return {
    update,
    stop() { input.stop(); sports.stop(); },
    handleInput: input.handleInput,
    getInteractionHint: input.getHint,
    getModeAssessment: advisor.getAssessment,
    applyModeRecommendation: advisor.applyRecommendation,
    getCollisionGeometry: () => getColegioAgvCollisionGeometry(getActiveInterior?.() ?? null),
    resolveMovement,
    answerLearning,
    getRewardState: () => ({ granted: rewards.getGrantedKeys() }),
    awardReward: rewards.award,
    getSportChallenges: sports.getChallenges,
    startSportChallenge: sports.start,
    recordSportEvent: sports.event,
    getSportChallengeSession: sports.getSession,
    usesCoreSportsPhysics: sports.usesCorePhysics
  };
}

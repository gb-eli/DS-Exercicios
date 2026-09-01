import { MAP_ID } from './colegio-agv-shared.js';

function finite(v, fallback = 0) { return Number.isFinite(Number(v)) ? Number(v) : fallback; }

export function evaluateColegioAgvDevice(context = {}, currentMode = 'lite') {
  const profile = context.getDeviceProfile?.() || context.deviceProfile || context.state?.device || {};
  const memory = finite(profile.deviceMemory ?? context.deviceMemory, 4);
  const cores = finite(profile.hardwareConcurrency ?? context.hardwareConcurrency, 4);
  const maxTextureSize = finite(profile.maxTextureSize, 4096);
  const mobile = Boolean(profile.mobile ?? profile.isMobile ?? context.isMobile);
  const reducedMotion = Boolean(profile.prefersReducedMotion ?? context.prefersReducedMotion);
  let score = 0;
  score += memory >= 8 ? 3 : memory >= 4 ? 2 : 1;
  score += cores >= 8 ? 3 : cores >= 4 ? 2 : 1;
  score += maxTextureSize >= 8192 ? 2 : maxTextureSize >= 4096 ? 1 : 0;
  if (mobile) score -= 1;
  if (reducedMotion) score -= 1;
  const recommendedMode = score <= 3 ? 'lite' : '3d';
  const recommendedProfile = score <= 2 ? 'low' : score <= 5 ? 'medium' : 'high';
  return { worldId: MAP_ID, currentMode, recommendedMode, recommendedProfile, score, signals: { memory, cores, maxTextureSize, mobile, reducedMotion } };
}

export function createColegioAgvModeAdvisor(context = {}, currentMode = 'lite') {
  let assessment = evaluateColegioAgvDevice(context, currentMode);
  let requested = false;

  function evaluate({ fps } = {}) {
    assessment = evaluateColegioAgvDevice(context, currentMode);
    if (Number.isFinite(fps) && fps > 0) {
      if (currentMode === '3d' && fps < 22) assessment = { ...assessment, recommendedMode: 'lite', reason: 'sustained-low-fps' };
      if (currentMode === 'lite' && fps > 55 && assessment.score >= 6) assessment = { ...assessment, recommendedMode: '3d', reason: 'device-headroom' };
    }
    context.onMapModeRecommendation?.({ ...assessment });
    return { ...assessment };
  }

  function applyRecommendation() {
    if (requested || assessment.recommendedMode === currentMode) return false;
    if (context.state?.settings?.autoMapMode === false || context.autoMapMode === false) return false;
    if (typeof context.requestWorldMode !== 'function') return false;
    requested = true;
    context.requestWorldMode({ worldId: MAP_ID, mode: assessment.recommendedMode, reason: assessment.reason || 'device-capability' });
    return true;
  }

  evaluate();
  return { evaluate, applyRecommendation, getAssessment: () => ({ ...assessment }), hasRequestedSwitch: () => requested };
}

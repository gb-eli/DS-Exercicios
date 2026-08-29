import { secureId, canonicalStringify, sha256Sync } from '../core/integrity.js';

const recentRapidCompletions = (profile, now = Date.now()) => Object.values(profile.completed || {})
  .filter((entry) => entry?.completedAt && now - Number(entry.completedAt) < 60_000).length;

export const recordChallengeSecurityEvent = (profile, type, details = {}) => {
  profile.securityIncidents ||= [];
  const previousHash = profile.securityIncidents.at(-1)?.hash || 'GENESIS';
  const event = {
    id: secureId('sec'),
    type,
    at: new Date().toISOString(),
    severity: details.severity || 'INFO',
    challengeId: details.challengeId || '',
    summary: String(details.summary || '').slice(0, 220),
    reviewRequired: Boolean(details.reviewRequired),
    previousHash,
  };
  event.hash = sha256Sync(canonicalStringify(event));
  profile.securityIncidents.push(event);
  profile.securityIncidents = profile.securityIncidents.slice(-120);
  return event;
};

export const assessCompletionPattern = (profile, challengeId, session = {}) => {
  const elapsedMs = Math.max(0, Date.now() - Number(session.openedAt || Date.now()));
  const interactionCount = Number(session.toolRuns || 0) + Number(session.localTests || 0) + Number(session.evidenceClicks || 0);
  const rapidCount = recentRapidCompletions(profile);
  const suspicious = elapsedMs < 2500 && interactionCount === 0 && rapidCount >= 2;
  if (suspicious) {
    return recordChallengeSecurityEvent(profile, 'RAPID_COMPLETION_PATTERN', {
      severity: 'ATTENTION', challengeId, reviewRequired: true,
      summary: 'Várias missões foram concluídas muito rapidamente e sem interação registrada. O evento deve ser conferido pelo professor; não representa banimento automático.',
    });
  }
  return null;
};

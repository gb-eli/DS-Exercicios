import { randomBytes, randomUuid, bytesToHex } from '../core/random.js';
import { shortHashHex } from '../core/identifiers.js';
import { hmacSha256, pinFromHmac, formatPin } from '../core/hmac-provider.js';
import { timeSlotFor, unixSeconds, isExpired } from '../core/time-slot.js';
import { EDUAUTH_POLICIES } from '../config/policies.js';
import { EDUAUTH_KEY_CONFIG } from '../config/key-config.js';
import { encodeRequestCode, decodeRequestCode } from '../core/protocol.js';
import { getOrCreateEduAuthSession } from '../storage/session-store.js';
import { getAttemptState, registerFailedAttempt, resetAttempts } from '../storage/attempt-limiter.js';
import { storeAuthorization } from '../storage/authorization-store.js';
import { recordEduAuthEvent } from '../storage/audit-log.js';

export const createSessionRequest = async ({ platformCode = 1, classCode = 0, subjectCode = 1, lessonCode = 0, activityCode = 1, actionCode = 3, profileId = '', ttlSeconds = 300, mode = 'SESSION_SCOPED_PIN', resourceId = '' } = {}) => {
  const session = getOrCreateEduAuthSession(); const requestId = randomUuid(); const sessionNonce = bytesToHex(randomBytes(6));
  const now = new Date(); const context = {
    protocol: 'EDUAUTH', version: 1, mode, keyVersion: EDUAUTH_KEY_CONFIG.sessionKey.keyVersion,
    platformCode, classCode, subjectCode, lessonCode, activityCode, actionCode,
    timeSlot: timeSlotFor(now, mode === 'PROFILE_RECOVERY_ENVELOPE' ? EDUAUTH_POLICIES.highRiskWindowSeconds : EDUAUTH_POLICIES.sessionWindowSeconds),
    sessionIdTag: await shortHashHex(session.sessionId, 4), requestIdTag: await shortHashHex(requestId, 4), sessionNonce,
    profileIdHash: await shortHashHex(profileId || 'anonymous', 4), expiresAt: unixSeconds(now) + ttlSeconds,
  };
  const request = { context, code: encodeRequestCode(context), sessionId: session.sessionId, requestId, resourceId, createdAt: Date.now(), expiresAt: context.expiresAt * 1000, consumed: false };
  sessionStorage.setItem(`ctfds:eduauth:request:${context.requestIdTag}`, JSON.stringify(request));
  await recordEduAuthEvent({ platform: 'ctfds', mode, risk: ttlSeconds <= 180 ? 'HIGH' : 'MEDIUM', requestId: context.requestIdTag, sessionId: context.sessionIdTag, result: 'created', actionCode, expiresAt: context.expiresAt });
  return request;
};

export const generateSessionPin = async (context, pinLength = 8) => formatPin(pinFromHmac(await hmacSha256(EDUAUTH_KEY_CONFIG.sessionKey.materialBase64, context), pinLength));

export const validateSessionPin = async (requestOrCode, enteredPin, { pinLength = 8, actionId = '', resourceId = '' } = {}) => {
  const context = typeof requestOrCode === 'string' ? decodeRequestCode(requestOrCode) : requestOrCode.context || requestOrCode;
  if (!['SESSION_SCOPED_PIN', 'PROFILE_RECOVERY_ENVELOPE'].includes(context.mode) || isExpired(context.expiresAt)) return { valid: false, reason: 'expired' };
  const stored = JSON.parse(sessionStorage.getItem(`ctfds:eduauth:request:${context.requestIdTag}`) || 'null');
  if (!stored || stored.consumed || stored.context.sessionIdTag !== context.sessionIdTag || stored.context.sessionNonce !== context.sessionNonce) return { valid: false, reason: 'session' };
  const attempts = getAttemptState(context.requestIdTag);
  if (attempts.locked) return { valid: false, reason: 'locked', attempts };
  if (attempts.nextAllowedAt > Date.now()) return { valid: false, reason: 'delay', attempts };
  const expected = (await generateSessionPin(context, pinLength)).replace(/\s/g, '');
  const valid = expected === String(enteredPin || '').replace(/\D/g, '');
  if (!valid) {
    const next = registerFailedAttempt(context.requestIdTag);
    await recordEduAuthEvent({ platform: 'ctfds', mode: context.mode, requestId: context.requestIdTag, sessionId: context.sessionIdTag, result: 'denied', attempts: next.attempts, actionId });
    return { valid: false, reason: next.locked ? 'locked' : 'invalid', attempts: next };
  }
  resetAttempts(context.requestIdTag); stored.consumed = true; stored.consumedAt = Date.now(); sessionStorage.setItem(`ctfds:eduauth:request:${context.requestIdTag}`, JSON.stringify(stored));
  const grant = storeAuthorization({ authorizationId: randomUuid(), requestId: context.requestIdTag, sessionIdTag: context.sessionIdTag, platformId: 'ctfds', actionId, resourceId, grantedAt: unixSeconds(), expiresAt: context.expiresAt, consumed: false, mode: context.mode });
  await recordEduAuthEvent({ platform: 'ctfds', mode: context.mode, requestId: context.requestIdTag, sessionId: context.sessionIdTag, result: 'granted', attempts: attempts.attempts, actionId, consumed: true });
  return { valid: true, grant };
};

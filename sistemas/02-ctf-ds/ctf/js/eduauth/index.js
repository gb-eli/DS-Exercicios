import { EDUAUTH_PLATFORM } from './config/platform.js';
import { EDUAUTH_POLICIES } from './config/policies.js';
import { EDUAUTH_KEY_CONFIG } from './config/key-config.js';
import { EDUAUTH_ACTIONS, findEduAuthAction } from './config/actions.js';
import { registryCodeFor, registryLabelFor } from './config/registries.js';
import { createClassRequest, validateClassPin, generateClassPin } from './modes/class-shared-pin.js';
import { createSessionRequest, validateSessionPin, generateSessionPin } from './modes/session-scoped-pin.js';
import { verifySignedGrant } from './modes/signed-grant.js';
import { decodeRequestCode } from './core/protocol.js';
import { renderAuthorizationModal } from './ui/authorization-modal.js';
import { renderQrToCanvas } from './ui/qr-lite.js';
import { copyRequestCode, speakRequestCode } from './ui/public-request-code.js';
import { recordEduAuthEvent, listEduAuthEvents } from './storage/audit-log.js';
import { clearEduAuthSession, getOrCreateEduAuthSession } from './storage/session-store.js';

const classCodeFromName = (className) => {
  const normalized = String(className || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (/^1-?ds-a$/.test(normalized)) return 1; if (/^2-?ds-a$/.test(normalized)) return 2; if (/^3-?ds-a$/.test(normalized)) return 3; if (normalized.includes('subsequente')) return 4; return 0;
};
export const buildEduAuthRequest = async ({ actionId, profile = null, resourceId = '', lessonCode = 0, modeOverride = '' }) => {
  const action = findEduAuthAction(actionId); if (!action) throw new Error('Ação EduAuth não registrada.');
  const mode = modeOverride || action.preferredMode;
  const base = { platformCode: 1, classCode: classCodeFromName(profile?.className), subjectCode: 1, lessonCode, activityCode: 1, actionCode: action.numericCode };
  if (mode === 'CLASS_SHARED_PIN') return { action, request: createClassRequest(base) };
  if (mode === 'SIGNED_GRANT') return { action, request: await createSessionRequest({ ...base, profileId: profile?.accountId || '', ttlSeconds: action.ttlSeconds, mode: 'SESSION_SCOPED_PIN', resourceId }) };
  return { action, request: await createSessionRequest({ ...base, profileId: profile?.accountId || '', ttlSeconds: action.ttlSeconds, mode: mode === 'PROFILE_RECOVERY_ENVELOPE' ? mode : 'SESSION_SCOPED_PIN', resourceId }) };
};
export const validateEduAuthPin = async ({ actionId, request, pin, resourceId = '' }) => {
  const action = findEduAuthAction(actionId); if (!action) return { valid: false, reason: 'action' };
  if (action.preferredMode === 'CLASS_SHARED_PIN') return { valid: await validateClassPin(request, pin, { pinLength: action.pinLength }), reason: 'invalid' };
  return validateSessionPin(request, pin, { pinLength: action.pinLength, actionId, resourceId });
};
export const eduauthIsProductionProvisioned = () => EDUAUTH_PLATFORM.productionProvisioned && EDUAUTH_KEY_CONFIG.productionProvisioned;
export {
  EDUAUTH_PLATFORM, EDUAUTH_POLICIES, EDUAUTH_KEY_CONFIG, EDUAUTH_ACTIONS, findEduAuthAction, registryCodeFor, registryLabelFor,
  generateClassPin, generateSessionPin, validateClassPin, validateSessionPin, verifySignedGrant, decodeRequestCode,
  renderAuthorizationModal, renderQrToCanvas, copyRequestCode, speakRequestCode, recordEduAuthEvent, listEduAuthEvents, clearEduAuthSession, getOrCreateEduAuthSession,
};

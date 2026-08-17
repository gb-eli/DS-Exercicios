import { hmacSha256, pinFromHmac, formatPin } from '../core/hmac-provider.js';
import { timeSlotFor } from '../core/time-slot.js';
import { EDUAUTH_POLICIES } from '../config/policies.js';
import { EDUAUTH_KEY_CONFIG } from '../config/key-config.js';
import { encodeRequestCode, decodeRequestCode } from '../core/protocol.js';

export const createClassRequest = ({ platformCode = 1, classCode = 0, subjectCode = 1, lessonCode = 0, activityCode = 1, actionCode = 1, date = new Date() } = {}) => {
  const context = { protocol: 'EDUAUTH', version: 1, mode: 'CLASS_SHARED_PIN', keyVersion: EDUAUTH_KEY_CONFIG.classKey.keyVersion, platformCode, classCode, subjectCode, lessonCode, activityCode, actionCode, timeSlot: timeSlotFor(date, EDUAUTH_POLICIES.classWindowSeconds) };
  return { context, code: encodeRequestCode(context), createdAt: Date.now(), expiresAt: (context.timeSlot + 1) * EDUAUTH_POLICIES.classWindowSeconds * 1000 };
};

export const generateClassPin = async (context, pinLength = 8) => formatPin(pinFromHmac(await hmacSha256(EDUAUTH_KEY_CONFIG.classKey.materialBase64, context), pinLength));

export const validateClassPin = async (requestOrCode, enteredPin, { date = new Date(), pinLength = 8, allowedDrift = EDUAUTH_POLICIES.allowedClockDriftSlots } = {}) => {
  const context = typeof requestOrCode === 'string' ? decodeRequestCode(requestOrCode) : requestOrCode.context || requestOrCode;
  if (context.mode !== 'CLASS_SHARED_PIN') return false;
  const currentSlot = timeSlotFor(date, EDUAUTH_POLICIES.classWindowSeconds);
  if (Math.abs(currentSlot - context.timeSlot) > allowedDrift) return false;
  const expected = (await generateClassPin(context, pinLength)).replace(/\s/g, '');
  return expected === String(enteredPin || '').replace(/\D/g, '');
};

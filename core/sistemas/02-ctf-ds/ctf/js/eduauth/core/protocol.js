import { base32Encode, base32Decode, groupCode, normalizeBase32 } from './base32.js';
import { crc32c, uint32ToBytes, bytesToUint32 } from './checksum.js';
import { validateContext } from './schema-validator.js';

const MODE_PREFIX = { CLASS_SHARED_PIN: 'C1', SESSION_SCOPED_PIN: 'S1', SIGNED_GRANT: 'G1', PROFILE_RECOVERY_ENVELOPE: 'R1' };
const PREFIX_MODE = Object.fromEntries(Object.entries(MODE_PREFIX).map(([mode, prefix]) => [prefix, mode]));
const concat = (...parts) => Uint8Array.from(parts.flatMap((part) => [...part]));
const hexToBytes = (value, length) => {
  const clean = String(value || '').replace(/[^a-f0-9]/gi, '').padEnd(length * 2, '0').slice(0, length * 2);
  return Uint8Array.from(clean.match(/../g)?.map((item) => Number.parseInt(item, 16)) || []);
};
const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

export const encodeRequestCode = (context) => {
  validateContext(context);
  const header = Uint8Array.of(context.version, context.keyVersion || 1, context.platformCode, context.classCode, context.subjectCode, context.lessonCode, context.activityCode, context.actionCode);
  const slot = uint32ToBytes(context.timeSlot);
  let payload = concat(header, slot);
  if (context.mode === 'SESSION_SCOPED_PIN' || context.mode === 'PROFILE_RECOVERY_ENVELOPE') {
    payload = concat(payload, hexToBytes(context.sessionIdTag, 4), hexToBytes(context.requestIdTag, 4), hexToBytes(context.sessionNonce, 6), hexToBytes(context.profileIdHash, 4), uint32ToBytes(context.expiresAt));
  }
  const checksum = uint32ToBytes(crc32c(payload));
  const raw = `EA1${MODE_PREFIX[context.mode]}K${String(context.keyVersion || 1).padStart(2, '0')}${base32Encode(payload)}${base32Encode(checksum)}`;
  return groupCode(raw, 4);
};

export const decodeRequestCode = (code) => {
  const clean = normalizeBase32(code);
  if (!clean.startsWith('EA1') || clean.length < 18) throw new Error('Código-base incompleto ou incompatível.');
  const modePrefix = clean.slice(3, 5);
  const mode = PREFIX_MODE[modePrefix];
  if (!mode || clean[5] !== 'K') throw new Error('Prefixo EduAuth inválido.');
  const keyVersion = Number.parseInt(clean.slice(6, 8), 10);
  const encoded = clean.slice(8);
  const minimumPayloadBytes = mode === 'CLASS_SHARED_PIN' ? 12 : 34;
  const payloadChars = Math.ceil((minimumPayloadBytes * 8) / 5);
  const payload = base32Decode(encoded.slice(0, payloadChars)).slice(0, minimumPayloadBytes);
  const checksumBytes = base32Decode(encoded.slice(payloadChars)).slice(0, 4);
  if (payload.length !== minimumPayloadBytes || checksumBytes.length !== 4) throw new Error('Código-base incompleto.');
  if (crc32c(payload) !== bytesToUint32(checksumBytes)) throw new Error('Checksum inválido. Confira se o código foi digitado corretamente.');
  const context = {
    protocol: 'EDUAUTH', version: payload[0], mode, keyVersion,
    platformCode: payload[2], classCode: payload[3], subjectCode: payload[4], lessonCode: payload[5], activityCode: payload[6], actionCode: payload[7],
    timeSlot: bytesToUint32(payload, 8),
  };
  if (mode !== 'CLASS_SHARED_PIN') Object.assign(context, {
    sessionIdTag: bytesToHex(payload.slice(12, 16)), requestIdTag: bytesToHex(payload.slice(16, 20)), sessionNonce: bytesToHex(payload.slice(20, 26)),
    profileIdHash: bytesToHex(payload.slice(26, 30)), expiresAt: bytesToUint32(payload, 30),
  });
  validateContext(context);
  return context;
};

export const requestCodePrefixFor = (mode) => `EA1-${MODE_PREFIX[mode] || '??'}`;

import { base64ToBytes } from './random.js';
import { canonicalEncode } from './canonical-encoder.js';

export const hmacSha256 = async (materialBase64, context) => {
  const key = await crypto.subtle.importKey('raw', base64ToBytes(materialBase64), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, context instanceof Uint8Array ? context : canonicalEncode(context)));
};

export const dynamicTruncate = (bytes) => {
  const offset = bytes[bytes.length - 1] & 0x0f;
  return (((bytes[offset] & 0x7f) << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
};

export const pinFromHmac = (bytes, length = 8) => String(dynamicTruncate(bytes) % (10 ** length)).padStart(length, '0');
export const formatPin = (pin) => String(pin).replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1 ').trim();

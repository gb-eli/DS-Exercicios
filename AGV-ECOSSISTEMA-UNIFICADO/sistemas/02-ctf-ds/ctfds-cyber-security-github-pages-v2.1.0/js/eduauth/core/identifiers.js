import { bytesToHex } from './random.js';
const encoder = new TextEncoder();
export const shortHashBytes = async (value, length = 4) => {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value || ''))));
  return digest.slice(0, length);
};
export const shortHashHex = async (value, length = 4) => bytesToHex(await shortHashBytes(value, length));

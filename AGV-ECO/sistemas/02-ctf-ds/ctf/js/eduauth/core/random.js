export const randomBytes = (length) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

export const randomUuid = () => crypto.randomUUID?.() || [...randomBytes(16)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
export const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
export const bytesToBase64 = (bytes) => {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary);
};
export const base64ToBytes = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
export const base64UrlEncode = (bytes) => bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
export const base64UrlDecode = (value) => base64ToBytes(String(value).replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));

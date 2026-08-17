const encoder = new TextEncoder();
const canonicalize = (value) => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
};
export const canonicalStringify = (value) => JSON.stringify(canonicalize(value));
export const canonicalEncode = (value) => encoder.encode(canonicalStringify(value));
export const decodeUtf8 = (bytes) => new TextDecoder().decode(bytes);

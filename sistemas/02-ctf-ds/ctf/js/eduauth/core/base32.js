const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const LOOKUP = Object.fromEntries([...ALPHABET].map((character, index) => [character, index]));
export const normalizeBase32 = (value) => String(value || '').toUpperCase().replace(/[\s-]/g, '').replace(/[O]/g, '0').replace(/[IL]/g, '1');
export const base32Encode = (bytes) => {
  let bits = 0; let value = 0; let output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { output += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
};
export const base32Decode = (input) => {
  const clean = normalizeBase32(input);
  let bits = 0; let value = 0; const output = [];
  for (const character of clean) {
    const digit = LOOKUP[character];
    if (digit === undefined) throw new Error('Código-base contém caractere inválido.');
    value = (value << 5) | digit; bits += 5;
    if (bits >= 8) { output.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Uint8Array.from(output);
};
export const groupCode = (value, size = 4) => String(value).replace(/[\s-]/g, '').match(new RegExp(`.{1,${size}}`, 'g'))?.join('-') || '';

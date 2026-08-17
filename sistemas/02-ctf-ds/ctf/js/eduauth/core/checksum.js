const TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0x82f63b78 ^ (value >>> 1)) : (value >>> 1);
    table[index] = value >>> 0;
  }
  return table;
})();
export const crc32c = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};
export const uint32ToBytes = (value) => Uint8Array.of((value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255);
export const bytesToUint32 = (bytes, offset = 0) => (((bytes[offset] << 24) >>> 0) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;

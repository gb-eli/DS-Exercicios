// Minimal offline QR encoder for EduAuth request codes. Byte mode, QR Version 5-L.
const VERSION = 5;
const SIZE = 17 + VERSION * 4;
const DATA_CODEWORDS = 108;
const ECC_CODEWORDS = 26;
const encoder = new TextEncoder();

const gfTables = (() => {
  const exp = new Uint8Array(512); const log = new Uint8Array(256); let value = 1;
  for (let index = 0; index < 255; index += 1) {
    exp[index] = value; log[value] = index; value <<= 1; if (value & 0x100) value ^= 0x11d;
  }
  for (let index = 255; index < 512; index += 1) exp[index] = exp[index - 255];
  return { exp, log };
})();
const gfMultiply = (a, b) => (a === 0 || b === 0) ? 0 : gfTables.exp[gfTables.log[a] + gfTables.log[b]];
const generatorPolynomial = (degree) => {
  let result = Uint8Array.of(1);
  for (let index = 0; index < degree; index += 1) {
    const next = new Uint8Array(result.length + 1);
    for (let position = 0; position < result.length; position += 1) {
      next[position] ^= result[position];
      next[position + 1] ^= gfMultiply(result[position], gfTables.exp[index]);
    }
    result = next;
  }
  return result;
};
const reedSolomon = (data, degree) => {
  const generator = generatorPolynomial(degree); const remainder = new Uint8Array(degree);
  for (const byte of data) {
    const factor = byte ^ remainder[0]; remainder.copyWithin(0, 1); remainder[degree - 1] = 0;
    for (let index = 0; index < degree; index += 1) remainder[index] ^= gfMultiply(generator[index + 1], factor);
  }
  return remainder;
};
const appendBits = (bits, value, length) => { for (let index = length - 1; index >= 0; index -= 1) bits.push((value >>> index) & 1); };
const makeCodewords = (text) => {
  const bytes = encoder.encode(text);
  if (bytes.length > 106) throw new Error('O código é grande demais para o QR offline desta versão. Use copiar e colar.');
  const bits = []; appendBits(bits, 0b0100, 4); appendBits(bits, bytes.length, 8); for (const byte of bytes) appendBits(bits, byte, 8);
  const capacity = DATA_CODEWORDS * 8; appendBits(bits, 0, Math.min(4, capacity - bits.length)); while (bits.length % 8) bits.push(0);
  const data = [];
  for (let index = 0; index < bits.length; index += 8) data.push(bits.slice(index, index + 8).reduce((value, bit) => (value << 1) | bit, 0));
  for (let pad = 0; data.length < DATA_CODEWORDS; pad += 1) data.push(pad % 2 === 0 ? 0xec : 0x11);
  return Uint8Array.from([...data, ...reedSolomon(Uint8Array.from(data), ECC_CODEWORDS)]);
};
const maskBit = (mask, row, col) => [
  (row + col) % 2 === 0, row % 2 === 0, col % 3 === 0, (row + col) % 3 === 0,
  (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0,
  ((row * col) % 2 + (row * col) % 3) === 0,
  (((row * col) % 2 + (row * col) % 3) % 2) === 0,
  (((row + col) % 2 + (row * col) % 3) % 2) === 0,
][mask];
const formatBits = (mask) => {
  const data = (1 << 3) | mask; let remainder = data << 10;
  for (let bit = 14; bit >= 10; bit -= 1) if ((remainder >>> bit) & 1) remainder ^= 0x537 << (bit - 10);
  return ((data << 10) | remainder) ^ 0x5412;
};
const buildMatrix = (codewords, mask) => {
  const modules = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const functional = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const setFunction = (row, col, dark) => { if (row >= 0 && col >= 0 && row < SIZE && col < SIZE) { modules[row][col] = Boolean(dark); functional[row][col] = true; } };
  const drawFinder = (centerRow, centerCol) => {
    for (let row = -4; row <= 4; row += 1) for (let col = -4; col <= 4; col += 1) {
      const distance = Math.max(Math.abs(row), Math.abs(col)); setFunction(centerRow + row, centerCol + col, distance !== 2 && distance !== 4);
    }
  };
  const drawAlignment = (centerRow, centerCol) => {
    for (let row = -2; row <= 2; row += 1) for (let col = -2; col <= 2; col += 1) setFunction(centerRow + row, centerCol + col, Math.max(Math.abs(row), Math.abs(col)) !== 1);
  };
  drawFinder(3, 3); drawFinder(3, SIZE - 4); drawFinder(SIZE - 4, 3); drawAlignment(30, 30);
  for (let index = 8; index < SIZE - 8; index += 1) { setFunction(6, index, index % 2 === 0); setFunction(index, 6, index % 2 === 0); }
  const format = formatBits(mask);
  for (let index = 0; index <= 5; index += 1) setFunction(index, 8, ((format >>> index) & 1) !== 0);
  setFunction(7, 8, ((format >>> 6) & 1) !== 0); setFunction(8, 8, ((format >>> 7) & 1) !== 0); setFunction(8, 7, ((format >>> 8) & 1) !== 0);
  for (let index = 9; index < 15; index += 1) setFunction(8, 14 - index, ((format >>> index) & 1) !== 0);
  for (let index = 0; index < 8; index += 1) setFunction(8, SIZE - 1 - index, ((format >>> index) & 1) !== 0);
  for (let index = 8; index < 15; index += 1) setFunction(SIZE - 15 + index, 8, ((format >>> index) & 1) !== 0);
  setFunction(SIZE - 8, 8, true);
  let bitIndex = 0; let upward = true;
  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vertical = 0; vertical < SIZE; vertical += 1) {
      const row = upward ? SIZE - 1 - vertical : vertical;
      for (let offset = 0; offset < 2; offset += 1) {
        const col = right - offset; if (functional[row][col]) continue;
        const bit = bitIndex < codewords.length * 8 ? ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) : 0;
        modules[row][col] = Boolean(bit ^ maskBit(mask, row, col)); bitIndex += 1;
      }
    }
    upward = !upward;
  }
  return modules;
};
const penalty = (matrix) => {
  let score = 0;
  for (const line of [...matrix, ...Array.from({ length: SIZE }, (_, col) => matrix.map((row) => row[col]))]) {
    let runColor = line[0]; let runLength = 1;
    for (let index = 1; index < SIZE; index += 1) {
      if (line[index] === runColor) runLength += 1; else { if (runLength >= 5) score += 3 + runLength - 5; runColor = line[index]; runLength = 1; }
    }
    if (runLength >= 5) score += 3 + runLength - 5;
    const text = line.map((value) => value ? '1' : '0').join('');
    for (const pattern of ['00001011101', '10111010000']) { let offset = text.indexOf(pattern); while (offset >= 0) { score += 40; offset = text.indexOf(pattern, offset + 1); } }
  }
  for (let row = 0; row < SIZE - 1; row += 1) for (let col = 0; col < SIZE - 1; col += 1) {
    const value = matrix[row][col]; if (matrix[row][col + 1] === value && matrix[row + 1][col] === value && matrix[row + 1][col + 1] === value) score += 3;
  }
  const dark = matrix.flat().filter(Boolean).length; score += Math.floor(Math.abs(dark * 20 - SIZE * SIZE * 10) / (SIZE * SIZE)) * 10;
  return score;
};
export const qrMatrix = (text) => {
  const codewords = makeCodewords(text); let best = null; let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask += 1) { const matrix = buildMatrix(codewords, mask); const value = penalty(matrix); if (value < bestScore) { best = matrix; bestScore = value; } }
  return best;
};
export const renderQrToCanvas = (canvas, text, { scale = 6, border = 4 } = {}) => {
  const matrix = qrMatrix(text); const size = (SIZE + border * 2) * scale; canvas.width = size; canvas.height = size;
  const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, size, size); context.fillStyle = '#000000';
  matrix.forEach((row, y) => row.forEach((dark, x) => { if (dark) context.fillRect((x + border) * scale, (y + border) * scale, scale, scale); }));
  return canvas;
};

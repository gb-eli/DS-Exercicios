export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const normalizeAnswer = (value = '') => String(value)
  .trim()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase();

export const formatNumber = (value = 0) => new Intl.NumberFormat('pt-BR').format(value);

export const uid = () => `${Date.now().toString(36)}-${crypto.randomUUID?.() || (() => { const bytes = new Uint8Array(8); crypto.getRandomValues(bytes); return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join(''); })()}`;

export const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');


export const safeExternalUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw, typeof location !== 'undefined' ? location.href : 'https://example.invalid/');
    if (!['https:', 'http:'].includes(url.protocol)) throw new TypeError('Protocolo de URL não permitido.');
    return url.href;
  } catch {
    throw new TypeError('URL externa inválida ou insegura.');
  }
};

export const sanitizePlainText = (value = '', maxLength = 4000) => String(value)
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  .slice(0, maxLength);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const levelFromXp = (xp = 0) => Math.max(1, Math.floor(Math.sqrt(xp / 120)) + 1);

export const xpForNextLevel = (level = 1) => Math.pow(level, 2) * 120;

export const downloadBlob = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

export const downloadText = (filename, content, type = 'text/plain;charset=utf-8') => downloadBlob(filename, new Blob([content], { type }));

export const downloadJson = (filename, data) => downloadText(filename, JSON.stringify(data, null, 2), 'application/json');

export const unicodeToBase64 = (text) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
export const base64ToUnicode = (value) => new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));

export const caesar = (text, shift) => String(text).replace(/[a-z]/gi, (char) => {
  const base = char <= 'Z' ? 65 : 97;
  return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26 * 10) % 26) + base);
});

export const textToBinary = (text) => [...new TextEncoder().encode(text)]
  .map((byte) => byte.toString(2).padStart(8, '0'))
  .join(' ');

export const binaryToText = (binary) => {
  const bytes = binary.trim().split(/\s+/).filter(Boolean).map((part) => {
    if (!/^[01]{8}$/.test(part)) throw new Error('Use grupos de 8 bits separados por espaço.');
    return Number.parseInt(part, 2);
  });
  return new TextDecoder().decode(new Uint8Array(bytes));
};

export const passwordScore = (password = '') => {
  const checks = {
    length: password.length >= 12,
    long: password.length >= 16,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    noCommon: !/(123456|password|senha|qwerty|admin|gabriel)/i.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, max: Object.keys(checks).length, checks };
};

export const sanitizeFilename = (name = 'progresso') => name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();

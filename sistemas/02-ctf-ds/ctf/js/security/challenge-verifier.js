import { normalizeAnswer } from '../core/utils.js';
import { sha256Sync } from '../core/integrity.js';
import { CHALLENGE_SEALS, CHALLENGE_ARTIFACTS, PEPPER_PART_A } from './challenge-seals.js';
import { PEPPER_PART_B } from './challenge-pepper.js';
import { validateChallengeRule } from './challenge-rules.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const PEPPER = `${PEPPER_PART_A}::${PEPPER_PART_B}`;

const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

export const canonicalizeChallengeAnswer = (challenge, value) => {
  const raw = String(value ?? '').trim();
  if (challenge.type === 'choice') return raw;
  if (challenge.type === 'multi-select' || challenge.type === 'code-select') {
    return raw.split(',').filter(Boolean).map(Number).sort((a, b) => a - b).join(',');
  }
  if (challenge.type === 'sequence') return raw.split(',').filter(Boolean).join(',');
  if (challenge.type === 'matching') {
    return raw.split(',').filter(Boolean).map((part) => {
      const [key, option] = part.split(':');
      return [String(key || '').trim(), Number(option)];
    }).sort(([left], [right]) => left.localeCompare(right)).map(([key, option]) => `${key}:${option}`).join(',');
  }
  return normalizeAnswer(raw);
};

const deriveSealKey = async (challengeId, canonical) => {
  const material = encoder.encode(`CTFDS-SEALED-v1|${challengeId}|${canonical}|${PEPPER}`);
  const digest = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['decrypt']);
};

const openSeal = async (challengeId, canonical, seal) => {
  try {
    const key = await deriveSealKey(challengeId, canonical);
    const clear = await crypto.subtle.decrypt({
      name: 'AES-GCM',
      iv: base64ToBytes(seal.iv),
      additionalData: encoder.encode(`ctfds:${challengeId}:v1`),
    }, key, base64ToBytes(seal.ciphertext));
    const payload = JSON.parse(decoder.decode(clear));
    return payload?.marker === 'CTFDS_VALID' && payload?.challengeId === challengeId ? payload : null;
  } catch {
    return null;
  }
};

export const verifyChallengeAnswer = async (challenge, value, profile = {}) => {
  if (!challenge) return { valid: false, reason: 'challenge_missing' };
  if (challenge.ruleId) {
    const valid = validateChallengeRule(challenge.ruleId, value);
    return {
      valid,
      mode: 'structural-rule',
      proof: valid ? sha256Sync(`${profile.accountId || 'ephemeral'}|${challenge.id}|${Date.now()}|rule`).slice(0, 24) : '',
    };
  }
  const canonical = canonicalizeChallengeAnswer(challenge, value);
  if (!canonical) return { valid: false, reason: 'empty' };
  const seals = CHALLENGE_SEALS[challenge.id] || [];
  for (const seal of seals) {
    const payload = await openSeal(challenge.id, canonical, seal);
    if (payload) {
      const proof = sha256Sync(`${profile.accountId || 'ephemeral'}|${challenge.id}|${payload.nonce}|${canonical}`).slice(0, 24);
      return { valid: true, mode: 'sealed-aes-gcm', proof };
    }
  }
  return { valid: false, reason: 'seal_rejected' };
};

export const getChallengeArtifact = (challengeId, key) => {
  const encoded = CHALLENGE_ARTIFACTS[challengeId]?.[key];
  if (!encoded) return '';
  try { return decoder.decode(base64ToBytes(encoded)); } catch { return ''; }
};

export const resolveChallengePrompt = (challenge) => String(challenge?.prompt || '')
  .replaceAll('{{PROMPT_FLAG}}', getChallengeArtifact(challenge.id, 'promptFlag'));

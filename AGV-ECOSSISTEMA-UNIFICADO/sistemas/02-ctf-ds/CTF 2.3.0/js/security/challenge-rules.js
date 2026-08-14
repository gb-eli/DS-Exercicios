import { passwordScore, normalizeAnswer } from '../core/utils.js';
import { sha256Sync } from '../core/integrity.js';

const EXPECTED_KEY_HASH = 'd4f6cfee296afbd1cb7eb8a80f8a1d640a49e281be8b158d49d2b43488d49906';

const extractAttribute = (source, name) => {
  const match = String(source).match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match?.[1] || '';
};

const rules = Object.freeze({
  html_unlock_key(value) {
    const source = String(value || '');
    const hasDisabled = /\sdisabled(?:\s|=|>)/i.test(source);
    const key = extractAttribute(source, 'data-key');
    return !hasDisabled && sha256Sync(normalizeAnswer(key)) === EXPECTED_KEY_HASH;
  },
  css_reveal_panel(value) {
    const source = String(value || '');
    return /display\s*:\s*block/i.test(source) && /opacity\s*:\s*1(?:\D|$)/i.test(source);
  },
  dom_xss_safe_sink(value) {
    const source = String(value || '');
    return /preview\.textContent\s*=\s*userInput/i.test(source) && !/preview\.innerHTML\s*=/i.test(source);
  },
  strong_password(value) {
    return passwordScore(String(value || '')).score >= 6;
  },
  server_recalculates_total(value) {
    const source = String(value || '');
    return /calculateTotal\s*\(\s*req\.body\.items\s*\)/i.test(source) && !/const\s+total\s*=\s*req\.body\.total/i.test(source);
  },
  jinja_autoescape(value) {
    const source = String(value || '');
    return /\{\{\s*user_message\s*\}\}/i.test(source) && !/\|\s*safe/i.test(source);
  },
});

export const validateChallengeRule = (ruleId, value) => {
  const rule = rules[ruleId];
  return rule ? Boolean(rule(value)) : false;
};

export const challengeRuleIds = Object.freeze(Object.keys(rules));

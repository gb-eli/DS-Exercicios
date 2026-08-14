import { EDUAUTH_POLICIES } from '../config/policies.js';
const KEY = 'ctfds:eduauth:attempts:v1';
const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const write = (value) => sessionStorage.setItem(KEY, JSON.stringify(value));
export const getAttemptState = (requestIdTag) => read()[requestIdTag] || { attempts: 0, locked: false, nextAllowedAt: 0 };
export const registerFailedAttempt = (requestIdTag) => {
  const all = read(); const state = all[requestIdTag] || { attempts: 0, locked: false, nextAllowedAt: 0 };
  state.attempts += 1; state.locked = state.attempts >= EDUAUTH_POLICIES.maximumAttempts;
  state.nextAllowedAt = Date.now() + (EDUAUTH_POLICIES.progressiveDelayMs[Math.min(state.attempts - 1, EDUAUTH_POLICIES.progressiveDelayMs.length - 1)] || 0);
  all[requestIdTag] = state; write(all); return state;
};
export const resetAttempts = (requestIdTag) => { const all = read(); delete all[requestIdTag]; write(all); };

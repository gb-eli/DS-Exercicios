import { randomUuid } from '../core/random.js';
const SESSION_KEY = 'ctfds:eduauth:session:v1';
const store = () => typeof sessionStorage !== 'undefined' ? sessionStorage : null;
export const getOrCreateEduAuthSession = () => {
  try {
    const existing = JSON.parse(store()?.getItem(SESSION_KEY) || 'null');
    if (existing?.sessionId) return existing;
  } catch {}
  const session = { sessionId: randomUuid(), createdAt: Date.now() };
  store()?.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};
export const clearEduAuthSession = () => store()?.removeItem(SESSION_KEY);

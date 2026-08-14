import { randomUuid } from '../core/random.js';
const DB_NAME = 'ctfds-eduauth-audit'; const DB_VERSION = 1; const STORE = 'events';
const memory = [];
const openDb = () => new Promise((resolve) => {
  if (typeof indexedDB === 'undefined') return resolve(null);
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' }); };
  request.onsuccess = () => resolve(request.result); request.onerror = () => resolve(null);
});
export const recordEduAuthEvent = async (event) => {
  const item = { id: randomUuid(), at: new Date().toISOString(), ...event };
  const db = await openDb();
  if (!db) { memory.push(item); return item; }
  await new Promise((resolve) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(item); tx.oncomplete = resolve; tx.onerror = resolve; });
  return item;
};
export const listEduAuthEvents = async () => {
  const db = await openDb(); if (!db) return [...memory];
  return new Promise((resolve) => { const tx = db.transaction(STORE, 'readonly'); const request = tx.objectStore(STORE).getAll(); request.onsuccess = () => resolve(request.result || []); request.onerror = () => resolve([]); });
};

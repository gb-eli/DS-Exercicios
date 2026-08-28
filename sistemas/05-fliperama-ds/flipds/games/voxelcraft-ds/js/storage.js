const DB = 'fliperama-ds.voxelcraft';
const LEGACY_DB = 'voxelcraft-ds';
const STORE = 'worlds';
const KEY = 'slot-1';
const LOCAL_WORLD_KEY = 'fliperama-ds.voxelcraft.world.v12';
const LEGACY_WORLD_KEYS = ['fliperama-ds.voxelcraft.world.v11'];
const SETTINGS_KEY = 'fliperama-ds.voxelcraft.settings.v11';
const LEGACY_SETTINGS_KEYS = ['fliperama-ds.voxelcraft.settings.v10', 'voxelcraft-ds.settings.v9'];
const MAX_EDITS = 15000;
const DB_TIMEOUT_MS = 2500;
const ITEM_NAMES = new Set(['HTML','CSS','JavaScript','Madeira','Pedra','Maçã']);
const QUALITY = new Set(['auto','economy','low','medium','high','ultra']);
const MODES = new Set(['learning','free','challenge']);
const CAMERAS = new Set(['first','third']);
let memoryWorld = null;
let lastBackend = 'memory';

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 12).flatMap(item => {
    if (!item || !ITEM_NAMES.has(String(item.name))) return [];
    return [{ name: String(item.name), count: Math.round(clampNumber(item.count, 0, 999, 0)) }];
  });
}

function sanitizeEdits(edits) {
  if (!Array.isArray(edits)) return [];
  const result = [];
  const keyPattern = /^-?\d{1,5},-?\d{1,4},-?\d{1,5}$/;
  for (const entry of edits.slice(0, MAX_EDITS)) {
    if (!Array.isArray(entry) || entry.length !== 2) continue;
    const key = String(entry[0] || '');
    const value = entry[1];
    if (!keyPattern.test(key)) continue;
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 8)) continue;
    result.push([key, value]);
  }
  return result;
}

export function sanitizeWorld(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const player = input.player && typeof input.player === 'object' ? input.player : {};
  const stats = input.stats && typeof input.stats === 'object' ? input.stats : {};
  return {
    version: 12,
    quality: QUALITY.has(input.quality) ? input.quality : 'auto',
    mode: MODES.has(input.mode) ? input.mode : 'learning',
    player: {
      x: clampNumber(player.x, -100000, 100000, 0),
      y: clampNumber(player.y, -1000, 2000, 11),
      z: clampNumber(player.z, -100000, 100000, 5),
      yaw: clampNumber(player.yaw, -Math.PI * 1000, Math.PI * 1000, 0),
      pitch: clampNumber(player.pitch, -1.4, 1.4, -0.12),
      camera: CAMERAS.has(player.camera) ? player.camera : 'first',
      health: clampNumber(player.health, 0, 100, 100),
      hunger: clampNumber(player.hunger, 0, 100, 100)
    },
    stats: {
      xp: Math.round(clampNumber(stats.xp, 0, 999999, 0)),
      broken: Math.round(clampNumber(stats.broken, 0, 999999, 0)),
      placed: Math.round(clampNumber(stats.placed, 0, 999999, 0)),
      distance: clampNumber(stats.distance, 0, 9999999, 0),
      collected: Math.round(clampNumber(stats.collected, 0, 999999, 0)),
      completed: Boolean(stats.completed),
      chapter: Math.round(clampNumber(stats.chapter, 1, 3, stats.completed ? 3 : 1)),
      chaptersCompleted: Math.round(clampNumber(stats.chaptersCompleted, 0, 3, stats.completed ? 3 : 0))
    },
    edits: sanitizeEdits(input.edits),
    items: sanitizeItems(input.items),
    savedAt: clampNumber(input.savedAt, 0, Date.now() + 86400000, Date.now())
  };
}

export function sanitizeSettings(input) {
  const settings = input && typeof input === 'object' ? input : {};
  return {
    quality: QUALITY.has(settings.quality) ? settings.quality : 'auto',
    mode: MODES.has(settings.mode) ? settings.mode : 'learning',
    fov: Math.round(clampNumber(settings.fov, 60, 105, 78)),
    sensitivity: Math.round(clampNumber(settings.sensitivity, 35, 160, 100)),
    learning: settings.learning !== false
  };
}

function withTimeout(promise, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), DB_TIMEOUT_MS))
  ]);
}

function openDb(name = DB, version) {
  if (!globalThis.indexedDB) return Promise.reject(new Error('IndexedDB indisponível.'));
  return withTimeout(new Promise((resolve, reject) => {
    const request = version ? indexedDB.open(name, version) : indexedDB.open(name);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Falha ao abrir o armazenamento local.'));
    request.onblocked = () => reject(new Error('O armazenamento está bloqueado por outra aba.'));
  }), 'O armazenamento demorou demais para responder.');
}

async function readIndexedDb(databaseName) {
  try {
    const db = await openDb(databaseName, databaseName === DB ? 1 : undefined);
    if (!db.objectStoreNames.contains(STORE)) { db.close(); return null; }
    const result = await withTimeout(new Promise((resolve, reject) => {
      const request = db.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(sanitizeWorld(request.result));
      request.onerror = () => reject(request.error || new Error('Falha ao ler o mundo salvo.'));
    }), 'A leitura do mundo demorou demais.');
    db.close();
    if (result) lastBackend = 'indexeddb';
    return result;
  } catch { return null; }
}

function readLocalWorld() {
  try {
    const keys = [LOCAL_WORLD_KEY, ...LEGACY_WORLD_KEYS];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      const safe = sanitizeWorld(JSON.parse(raw || 'null'));
      if (!safe) continue;
      lastBackend = 'localstorage';
      if (key !== LOCAL_WORLD_KEY) { try { localStorage.setItem(LOCAL_WORLD_KEY, JSON.stringify(safe)); } catch {} }
      return safe;
    }
    return null;
  } catch { return null; }
}

function writeLocalWorld(world) {
  try {
    localStorage.setItem(LOCAL_WORLD_KEY, JSON.stringify(world));
    lastBackend = 'localstorage';
    return true;
  } catch { return false; }
}

async function writeIndexedDb(world) {
  const db = await openDb(DB, 1);
  await withTimeout(new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(world, KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error('Falha ao salvar o mundo.'));
    tx.onabort = () => reject(tx.error || new Error('A gravação foi cancelada.'));
  }), 'A gravação do mundo demorou demais.');
  db.close();
  lastBackend = 'indexeddb';
}

export async function saveWorld(data) {
  const safe = sanitizeWorld({ ...data, savedAt: Date.now() });
  if (!safe) throw new Error('O estado do mundo não é válido.');
  memoryWorld = safe;
  try {
    await writeIndexedDb(safe);
    writeLocalWorld(safe); // cópia de recuperação
    lastBackend = 'indexeddb';
    return { ...safe, storageBackend: lastBackend };
  } catch {
    if (writeLocalWorld(safe)) return { ...safe, storageBackend: lastBackend };
    lastBackend = 'memory';
    return { ...safe, storageBackend: lastBackend };
  }
}

export async function loadWorld() {
  const current = await readIndexedDb(DB);
  if (current) { memoryWorld = current; return { ...current, storageBackend: lastBackend }; }
  const local = readLocalWorld();
  if (local) { memoryWorld = local; return { ...local, storageBackend: lastBackend }; }
  const legacy = await readIndexedDb(LEGACY_DB);
  if (legacy) {
    const imported = await saveWorld(legacy);
    try { localStorage.setItem('fliperama-ds.voxelcraft.legacy-imported', String(Date.now())); } catch {}
    return imported;
  }
  if (memoryWorld) { lastBackend = 'memory'; return { ...memoryWorld, storageBackend: lastBackend }; }
  return null;
}

export async function clearWorld() {
  memoryWorld = null;
  try { localStorage.removeItem(LOCAL_WORLD_KEY); LEGACY_WORLD_KEYS.forEach(key => localStorage.removeItem(key)); } catch {}
  try {
    const db = await openDb(DB, 1);
    await withTimeout(new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('Falha ao apagar o mundo.'));
    }), 'A exclusão do mundo demorou demais.');
    db.close();
    lastBackend = 'indexeddb';
  } catch { lastBackend = 'localstorage'; }
}

export async function hasSave() {
  try { return Boolean(await loadWorld()); } catch { return Boolean(memoryWorld); }
}

export function saveSettings(settings) {
  const safe = sanitizeSettings(settings);
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(safe)); } catch {}
  return safe;
}

export function loadSettings() {
  try {
    const own = localStorage.getItem(SETTINGS_KEY);
    if (own) return sanitizeSettings(JSON.parse(own));
    for (const key of LEGACY_SETTINGS_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const safe = sanitizeSettings(JSON.parse(legacy));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(safe));
      return safe;
    }
  } catch {}
  return sanitizeSettings({});
}

export function getStorageStatus() {
  return { backend: lastBackend, durable: lastBackend !== 'memory' };
}

const LOCK_PREFIX = 'ctfds:profile-tab-lock:';
const HEARTBEAT_MS = 4000;
const STALE_MS = 14000;
const tabId = globalThis.crypto?.randomUUID?.() || `tab_${Date.now()}_${Math.random().toString(16).slice(2)}`;

let accountId = '';
let timer = null;
let channel = null;
let onDisplaced = null;
let displaced = false;

const keyFor = (id) => `${LOCK_PREFIX}${id}`;
const readLock = (id) => {
  try {
    const raw = localStorage.getItem(keyFor(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const writeLock = (id) => {
  const lock = { accountId: id, tabId, updatedAt: Date.now() };
  try { localStorage.setItem(keyFor(id), JSON.stringify(lock)); } catch {}
  return lock;
};

const ownsLock = (id = accountId) => readLock(id)?.tabId === tabId;

const announce = (type, details = {}) => {
  try { channel?.postMessage({ type, accountId, tabId, at: Date.now(), ...details }); } catch {}
};

const handleDisplacement = (reason = 'another-tab') => {
  if (displaced) return;
  displaced = true;
  clearInterval(timer);
  timer = null;
  try { channel?.close(); } catch {}
  channel = null;
  const callback = onDisplaced;
  accountId = '';
  onDisplaced = null;
  callback?.(reason);
};

const heartbeat = () => {
  if (!accountId) return;
  const current = readLock(accountId);
  if (current && current.tabId !== tabId && Date.now() - Number(current.updatedAt || 0) < STALE_MS) {
    handleDisplacement('lock-replaced');
    return;
  }
  writeLock(accountId);
  announce('heartbeat');
};

const onStorage = (event) => {
  if (!accountId || event.key !== keyFor(accountId) || !event.newValue) return;
  try {
    const next = JSON.parse(event.newValue);
    if (next.tabId !== tabId && Date.now() - Number(next.updatedAt || 0) < STALE_MS) handleDisplacement('storage-update');
  } catch {}
};

if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);

export const inspectProfileTabLock = (id) => {
  const lock = readLock(id);
  if (!lock) return { active: false, stale: false, lock: null };
  const stale = Date.now() - Number(lock.updatedAt || 0) >= STALE_MS;
  return { active: !stale && lock.tabId !== tabId, stale, lock };
};

export const claimProfileTabLock = (id, { force = false, displacedHandler = null } = {}) => {
  if (!id) return { ok: true, conflict: false };
  const status = inspectProfileTabLock(id);
  if (status.active && !force) return { ok: false, conflict: true, lock: status.lock };

  releaseProfileTabLock();
  accountId = id;
  displaced = false;
  onDisplaced = displacedHandler;
  writeLock(id);

  if ('BroadcastChannel' in globalThis) {
    channel = new BroadcastChannel(`ctfds-profile:${id}`);
    channel.onmessage = (event) => {
      const message = event.data || {};
      if (message.tabId === tabId) return;
      if (message.type === 'takeover') handleDisplacement('broadcast-takeover');
      if (message.type === 'probe' && ownsLock()) announce('active');
    };
    announce(force ? 'takeover' : 'active');
  }

  timer = setInterval(heartbeat, HEARTBEAT_MS);
  return { ok: true, conflict: status.active, forced: force };
};

export const releaseProfileTabLock = () => {
  const currentId = accountId;
  clearInterval(timer);
  timer = null;
  if (currentId && ownsLock(currentId)) {
    try { localStorage.removeItem(keyFor(currentId)); } catch {}
  }
  try { channel?.close(); } catch {}
  channel = null;
  accountId = '';
  onDisplaced = null;
  displaced = false;
};

export const getProfileTabLockState = () => ({ accountId, tabId, ownsLock: Boolean(accountId && ownsLock()) });

if (typeof window !== 'undefined') window.addEventListener('pagehide', releaseProfileTabLock);

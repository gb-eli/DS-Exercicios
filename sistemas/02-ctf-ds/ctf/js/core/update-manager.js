export const compareVersions = (a = '0', b = '0') => {
  const left = String(a).split(/[.-]/).map((part) => Number(part) || 0);
  const right = String(b).split(/[.-]/).map((part) => Number(part) || 0);
  const size = Math.max(left.length, right.length);
  for (let index = 0; index < size; index += 1) {
    const delta = (left[index] || 0) - (right[index] || 0);
    if (delta) return delta > 0 ? 1 : -1;
  }
  return 0;
};

export const isNewerVersion = (candidate, current) => compareVersions(candidate, current) > 0;

export const createUpdateManager = ({
  currentVersion = '0.0.0',
  swUrl = './sw.js',
  manifestUrl = './version-manifest.json',
  onUpdateAvailable = () => {},
  onStatus = () => {},
} = {}) => {
  let registration = null;
  let refreshing = false;
  let deferredVersion = '';

  const notifyWaiting = (version = deferredVersion || currentVersion) => {
    deferredVersion = version;
    onUpdateAvailable({ version, registration, apply: applyUpdate });
  };

  const inspectManifest = async () => {
    if (typeof fetch !== 'function') return null;
    try {
      const response = await fetch(`${manifestUrl}?check=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      if (!response.ok) return null;
      const manifest = await response.json();
      const version = String(manifest.portalVersion || manifest.version || '');
      if (version && isNewerVersion(version, currentVersion)) {
        deferredVersion = version;
        await registration?.update?.();
        if (registration?.waiting) notifyWaiting(version);
        else onStatus(`Nova versão ${version} detectada. Finalizando download seguro.`);
      }
      return manifest;
    } catch { return null; }
  };

  const watchInstalling = (worker) => {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) notifyWaiting(deferredVersion || currentVersion);
    });
  };

  const register = async () => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return null;
    registration = await navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' });
    if (registration.waiting) notifyWaiting();
    registration.addEventListener('updatefound', () => watchInstalling(registration.installing));
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });
    await inspectManifest();
    return registration;
  };

  const applyUpdate = async () => {
    if (!registration) return false;
    if (!registration.waiting) await registration.update();
    const worker = registration.waiting;
    if (!worker) return false;
    worker.postMessage({ type: 'SKIP_WAITING' });
    return true;
  };

  const clearInterfaceCaches = async () => {
    if (typeof caches === 'undefined') return 0;
    const keys = await caches.keys();
    const targets = keys.filter((key) => key.startsWith('ctfds-'));
    await Promise.all(targets.map((key) => caches.delete(key)));
    return targets.length;
  };

  const scheduleChecks = () => {
    if (typeof window === 'undefined') return;
    window.setInterval(() => { if (document.visibilityState === 'visible') void inspectManifest(); }, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void inspectManifest(); });
    window.addEventListener('online', () => void inspectManifest());
  };

  return { register, applyUpdate, inspectManifest, clearInterfaceCaches, scheduleChecks, getRegistration: () => registration };
};

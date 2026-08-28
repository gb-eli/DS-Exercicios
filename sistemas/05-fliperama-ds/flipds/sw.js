const VERSION = '0.39.0-hotfix1';
const CACHE_PREFIX = 'fliperama-ds-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-v${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-v${VERSION}`;

const SHELL = [
  './',
  './index.html',
  './app.js',
  './app.css',
  './phaser.js',
  './manifest.webmanifest',
  './version.json',
  './icons/fliperama-ds.svg',
  './icons/arcade-ds.svg',
  './diagnostico.html',
  './diagnostico-jogos.html',
  './validation/game-audit-results.json',
  './validation/three-d-test-results.json',
  './validation/progression-expansion-results-v0.36.0.json',
  './validation/progression-expansion-results-v0.36.1.json',
  './validation/three-d-campaign-results-v0.36.2.json',
  './validation/voxelcraft-campaign-results-v0.36.2.json',
  './validation/progression-expansion-results-v0.36.2.json',
  './validation/duo-elementos-test-results-v0.37.0.json',
  './validation/plataforma-classica-results-v0.37.1.json',
  './validation/plataforma-poligonal-results-v0.38.0.json',
  './validation/release-regression-results-v0.38.0.json',
  './validation/crystal-cascade-results-v0.37.2.json',
  './validation/release-regression-results-v0.37.2.json',
  './validation/release-regression-results-v0.37.1.json',
  './games/shared/multiplayer-local-core.js',
  './games/duo-elementos-ds/index.html',
  './games/duo-elementos-ds/style.css',
  './games/duo-elementos-ds/game.js',
  './games/duo-elementos-ds/levels.json',
  './games/plataforma-classica-ds/index.html',
  './games/plataforma-classica-ds/style.css',
  './games/plataforma-classica-ds/game.js',
  './games/plataforma-classica-ds/levels.json',
  './validation/mundo-plataforma-360-results-v0.38.1.json',
  './validation/mundo-plataforma-360-results-v0.38.3.json',
  './validation/mundo-plataforma-360-results-v0.38.5.json',
  './validation/release-regression-results-v0.38.1.json',
  './validation/release-regression-results-v0.38.3.json',
  './validation/release-regression-results-v0.38.5.json',
  './games/mundo-plataforma-ds-360/index.html',
  './games/mundo-plataforma-ds-360/style.css',
  './games/mundo-plataforma-ds-360/game.js',
  './games/mundo-plataforma-ds-360/simulation.mjs',
  './games/mundo-plataforma-ds-360/render.mjs',
  './games/mundo-plataforma-ds-360/region.json',
  './games/mundo-plataforma-ds-360/village.json',
  './games/mundo-plataforma-ds-360/forest.json',
  './games/mundo-plataforma-ds-360/industrial.json',
  './games/mundo-plataforma-ds-360/tower.json',
  './media/games/mundo-plataforma-ds-360/logo.svg',
  './media/games/mundo-plataforma-ds-360/preview-01.svg',
  './media/games/mundo-plataforma-ds-360/preview-02.svg',
  './games/plataforma-poligonal-ds-3d/index.html',
  './games/plataforma-poligonal-ds-3d/style.css',
  './games/plataforma-poligonal-ds-3d/game.js',
  './games/plataforma-poligonal-ds-3d/world.json',
  './media/games/plataforma-poligonal-ds-3d/logo.svg',
  './media/games/plataforma-poligonal-ds-3d/preview-01.svg',
  './media/games/plataforma-poligonal-ds-3d/preview-02.svg',
  './games/crystal-cascade-3d/index.html',
  './games/crystal-cascade-3d/style.css',
  './games/crystal-cascade-3d/engine.js',
  './games/crystal-cascade-3d/game.js',
  './games/crystal-cascade-3d/levels.json',
  './validation/release-regression-results-v0.39.0.json',
  './validation/chess-arena-360-results-v0.39.0.json',
  './games/chess-arena-360/index.html',
  './games/chess-arena-360/style.css',
  './games/chess-arena-360/engine.js',
  './games/chess-arena-360/ai.js',
  './games/chess-arena-360/game.js',
  './media/games/chess-arena-360/logo.svg',
  './media/games/chess-arena-360/preview-01.svg',
  './media/games/chess-arena-360/preview-02.svg',
  './validation/hexa-reactor-results-v0.38.6.json',
  './games/hexa-reactor/index.html',
  './games/hexa-reactor/style.css',
  './games/hexa-reactor/engine.js',
  './games/hexa-reactor/game.js',
  './games/hexa-reactor/levels.json',
  './media/games/hexa-reactor/logo.svg',
  './media/games/hexa-reactor/preview-01.svg',
  './media/games/hexa-reactor/preview-02.svg',
  './media/games/duo-elementos-ds/logo.svg',
  './media/games/duo-elementos-ds/preview-01.svg',
  './media/games/duo-elementos-ds/preview-02.svg',
  './media/games/plataforma-classica-ds/logo.svg',
  './media/games/plataforma-classica-ds/preview-01.svg',
  './media/games/plataforma-classica-ds/preview-02.svg',
  './media/games/crystal-cascade-3d/logo.svg',
  './media/games/crystal-cascade-3d/preview-01.svg',
  './media/games/crystal-cascade-3d/preview-02.svg',
  './games/voxelcraft-ds/index.html',
  './games/voxelcraft-ds/css/style.css',
  './games/voxelcraft-ds/js/app.js',
  './games/voxelcraft-ds/js/game.js',
  './games/voxelcraft-ds/js/storage.js',
  './games/voxelcraft-ds/vendor/three/three.module.min.js',
  './museum/data/catalog.json',
  './museum/viewer/museum-viewer.js',
  './education/game-learning.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.allSettled(SHELL.map(async (path) => {
      const request = new Request(path, { cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Falha ao pré-carregar ${path}: HTTP ${response.status}`);
      await cache.put(request, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackPath) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallbackPath) {
      const fallback = await caches.match(fallbackPath, { ignoreSearch: true });
      if (fallback) return fallback;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request).then((response) => {
    if (response.ok && new URL(request.url).origin === self.location.origin) {
      void cache.put(request, response.clone());
    }
    return response;
  }).catch(() => undefined);
  return cached || await network || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/app.js') || url.pathname.endsWith('/app.css') || url.pathname.endsWith('/phaser.js')) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

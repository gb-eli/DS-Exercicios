const CACHE = 'fliperama-ds-shell-v0.20.0';
const SHELL = ['./', './index.html', './app.js', './app.css', './manifest.webmanifest', './version.json', './icons/fliperama-ds.svg', './games/voxelcraft-ds/index.html', './games/voxelcraft-ds/css/style.css', './games/voxelcraft-ds/js/app.js', './games/voxelcraft-ds/js/game.js', './games/voxelcraft-ds/js/storage.js', './games/voxelcraft-ds/vendor/three/three.module.min.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && new URL(event.request.url).origin === location.origin) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  })));
});

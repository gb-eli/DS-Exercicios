const CACHE = 'ctfds-v2.1.0';
const ASSETS = [
  './', './index.html', './css/app.css', './js/app.js',
  './js/config/platform-config.js',
  './js/core/utils.js', './js/core/storage.js', './js/core/state.js',
  './js/data/challenges.js', './js/data/tool-catalog.js', './js/data/lessons.js', './js/data/store-items.js', './js/data/careers.js', './js/data/intel.js', './js/data/changelog.js',
  './js/modules/dashboard.js', './js/modules/ctf.js', './js/modules/academy.js',
  './js/modules/tools.js', './js/modules/store.js', './js/modules/careers.js', './js/modules/intel.js', './js/modules/profile.js',
  './js/modules/terminal.js', './js/modules/effects.js', './js/modules/mission-scenarios.js', './js/modules/guided-tutorial.js',
  './js/modules/delivery.js', './js/modules/about.js', './js/modules/schedule.js', './js/modules/teacher-recovery.js',
  './js/eduauth/index.js',
  './js/eduauth/config/platform.js', './js/eduauth/config/policies.js', './js/eduauth/config/actions.js', './js/eduauth/config/registries.js', './js/eduauth/config/key-config.js',
  './js/eduauth/core/random.js', './js/eduauth/core/canonical-encoder.js', './js/eduauth/core/hmac-provider.js', './js/eduauth/core/time-slot.js', './js/eduauth/core/base32.js', './js/eduauth/core/checksum.js', './js/eduauth/core/schema-validator.js', './js/eduauth/core/identifiers.js', './js/eduauth/core/protocol.js',
  './js/eduauth/modes/class-shared-pin.js', './js/eduauth/modes/session-scoped-pin.js', './js/eduauth/modes/signed-grant.js', './js/eduauth/modes/profile-recovery-envelope.js',
  './js/eduauth/storage/session-store.js', './js/eduauth/storage/authorization-store.js', './js/eduauth/storage/attempt-limiter.js', './js/eduauth/storage/audit-log.js',
  './js/eduauth/ui/authorization-modal.js', './js/eduauth/ui/public-request-code.js', './js/eduauth/ui/qr-lite.js', './js/eduauth/ui/teacher-center.js',
  './eduauth-platform-manifest.json', './eduauth-action-registry.json', './eduauth-test-vectors.json', './eduauth-provisioning-template.json', './eduauth-integration-report.md',
  './manifest.webmanifest', './assets/icons/icon.svg'
];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (!response || response.status !== 200 || response.type === 'opaque') return response;
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});

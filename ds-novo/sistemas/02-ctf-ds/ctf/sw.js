const SW_VERSION = '3.2.0';
const CACHE_PREFIX = 'ctfds-';
const STATIC_CACHE = `${CACHE_PREFIX}static-v${SW_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-v${SW_VERSION}`;
const ASSETS = [
  './', './index.html', './css/app.css', './js/app.js',
  './js/config/platform-config.js',
  './js/core/utils.js', './js/core/integrity.js', './js/core/wallet.js', './js/core/storage.js', './js/core/state.js', './js/core/mission-progress.js', './js/core/investigation-engine.js', './js/core/narrative-engine.js', './js/core/profile-tab-lock.js', './js/core/mission-blocks.js', './js/core/device-diagnostics.js', './js/core/update-manager.js',
  './js/security/challenge-seals.js', './js/security/challenge-pepper.js', './js/security/challenge-rules.js', './js/security/challenge-verifier.js', './js/security/security-monitor.js',
  './js/data/challenges.js', './js/data/immersive-scenarios.js', './js/data/simulator-scenarios.js', './js/data/mission-cases.js', './js/data/mission-case-packets.js', './js/data/narrative-catalog.js', './js/data/tool-catalog.js', './js/data/lessons.js', './js/data/store-items.js', './js/data/careers.js', './js/data/intel.js', './js/data/changelog.js', './js/data/terms.js', './js/data/rubrics.js',
  './js/modules/dashboard.js', './js/modules/ctf.js', './js/modules/academy.js',
  './js/modules/tools.js', './js/modules/immersive-suite.js', './js/immersive/engine.js', './js/modules/simulation-suite.js', './js/modules/store.js', './js/modules/careers.js', './js/modules/intel.js', './js/modules/profile.js',
  './js/modules/terminal.js', './js/modules/effects.js', './js/modules/mission-scenarios.js', './js/modules/investigative-workspace.js', './js/modules/guided-tutorial.js',
  './js/modules/delivery.js', './js/modules/about.js', './js/modules/terms.js', './js/modules/schedule.js', './js/modules/teacher-recovery.js',
  './js/eduauth/index.js',
  './js/eduauth/config/platform.js', './js/eduauth/config/policies.js', './js/eduauth/config/actions.js', './js/eduauth/config/registries.js', './js/eduauth/config/key-config.js',
  './js/eduauth/core/random.js', './js/eduauth/core/canonical-encoder.js', './js/eduauth/core/hmac-provider.js', './js/eduauth/core/time-slot.js', './js/eduauth/core/base32.js', './js/eduauth/core/checksum.js', './js/eduauth/core/schema-validator.js', './js/eduauth/core/identifiers.js', './js/eduauth/core/protocol.js',
  './js/eduauth/modes/class-shared-pin.js', './js/eduauth/modes/session-scoped-pin.js', './js/eduauth/modes/signed-grant.js', './js/eduauth/modes/profile-recovery-envelope.js',
  './js/eduauth/storage/session-store.js', './js/eduauth/storage/authorization-store.js', './js/eduauth/storage/attempt-limiter.js', './js/eduauth/storage/audit-log.js',
  './js/eduauth/ui/authorization-modal.js', './js/eduauth/ui/public-request-code.js', './js/eduauth/ui/qr-lite.js', './js/eduauth/ui/teacher-center.js',
  './eduauth-platform-manifest.json', './eduauth-action-registry.json', './eduauth-test-vectors.json', './eduauth-provisioning-template.json', './eduauth-integration-report.md',
  './README.md', './STABLE_RUNTIME_V3_2.md', './VISUAL_QA_MATRIX.md', './FULL_CAMPAIGN_V3_1.md', './EVOLUTION_PHASES.md',
  './IMMERSIVE_3D_360.md', './SIMULATION_SUITE.md', './NARRATIVE_ENGINE.md', './ADVANCED_INVESTIGATION.md', './INVESTIGATIVE_WORKSPACE.md', './MISSION_STRUCTURE.md', './MISSION_BLOCKS.md', './ANTI_LEAK_SECURITY.md', './challenge-security-manifest.json', './TERMS.md', './PRIVACY.md', './SIMULATION_NOTICE.md', './PERMISSIONS.md', './EDUCATIONAL_USE.md', './ASSESSMENT.md', './SECURITY.md', './SECURITY_AND_PRIVACY.md', './CREDITS.md', './CHANGELOG.md', './KNOWN_ISSUES.md', './RECOVERY_GUIDE.md', './PUBLISH_CHECKLIST.md', './TEST_REPORT.md', './contributors-config.json', './version-manifest.json', './terms-manifest.json', './permissions-manifest.json', './rubric-manifest.json', './wallet-schema.json', './manifest.webmanifest', './assets/icons/icon.svg'
];
const sameOrigin = (request) => {
  try { return new URL(request.url).origin === self.location.origin; } catch { return false; }
};

const networkFirst = async (request, fallbackUrl = '') => {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response?.ok && sameOrigin(request)) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) || (fallbackUrl ? await caches.match(fallbackUrl) : undefined);
  }
};

const versionPinnedNavigation = async (request) => {
  const cachedShell = await caches.match('./index.html');
  if (cachedShell) return cachedShell;
  return networkFirst(request, './index.html');
};

const cachedStatic = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response?.ok && sameOrigin(request)) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  const type = event.data?.type;
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'GET_VERSION') event.source?.postMessage?.({ type: 'CTFDS_SW_VERSION', version: SW_VERSION });
  if (type === 'CLEAR_RUNTIME') event.waitUntil(caches.delete(RUNTIME_CACHE));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(versionPinnedNavigation(request));
    return;
  }
  if (!sameOrigin(request)) {
    event.respondWith(fetch(request));
    return;
  }
  if (url.pathname.endsWith('/version-manifest.json') || url.pathname.endsWith('/sw.js')) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cachedStatic(request));
});

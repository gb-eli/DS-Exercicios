const CACHE_NAME = 'cosmos-ds-c1-1-v1';
const CORE = [
  './', './index.html', './src/styles.css', './src/main.js', './src/app/CosmosApp.js',
  './src/rendering/WebGLCosmosRenderer.js',
  './src/core/events/EventBus.js', './src/core/persistence/JsonStorage.js',
  './src/core/settings/SettingsStore.js', './src/core/profiles/ProfileStore.js',
  './src/core/performance/BenchmarkService.js', './src/core/performance/AdaptiveQualityController.js',
  './src/core/accessibility/AccessibilityController.js', './src/core/modules/ModuleRegistry.js',
  './src/modules/curiosity-center/CuriosityCenterModule.js', './src/core/knowledge/KnowledgeEngine.js', './src/core/knowledge/KnowledgeProfileStore.js', './src/data/knowledge/spaceKnowledge.js', './src/rendering/KnowledgeOrbRenderer.js', './public/data/knowledge/catalog.json',
  './src/core/rendering/CinematicPostProcessController.js', './src/core/physics/UnifiedPhysicsController.js', './src/core/campaign/CampaignDirector.js', './src/core/performance/PerformanceBudgetManager.js', './src/core/performance/AssetStreamingManager.js',
  './src/data/cinematicSystems.js', './src/data/physicsControlSystems.js', './src/data/campaignSystems.js', './src/data/performanceSystems.js',
  './src/core/assets/PremiumIntegrationOrchestrator.js', './src/core/assets/PremiumAssetManager.js', './src/core/assets/ResourceLoader.js', './src/core/assets/InteriorInteractionSystem.js', './src/core/assets/SpatialAudioEngine.js', './src/core/assets/TelemetryAnimationBridge.js', './src/core/assets/GlbSceneParser.js', './src/core/assets/GltfAnimationPlayer.js', './src/core/assets/PremiumColliderSystem.js', './src/data/premiumIntegrationSystems.js', './src/rendering/PremiumAssetOverlayRenderer.js',
  './public/manifest.webmanifest', './public/icons/icon.svg'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (!response || response.status !== 200 || response.type === 'opaque') return response;
    const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});

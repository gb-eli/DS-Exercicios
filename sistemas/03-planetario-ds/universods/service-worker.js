const CACHE_NAME='cosmos-ds-c5-2-v1';
const SHELL=[
  './','./index.html','./src/styles-core.css','./src/main.js','./src/app/CosmosApp.js',
  './src/core/events/EventBus.js','./src/core/persistence/JsonStorage.js','./src/core/settings/SettingsStore.js','./src/core/profiles/ProfileStore.js',
  './src/core/performance/BenchmarkService.js','./src/core/performance/AdaptiveQualityController.js','./src/core/accessibility/AccessibilityController.js','./src/core/modules/ModuleRegistry.js',
  './src/core/guided/GuidedTrailStore.js','./src/core/guided/GuidedTrailEngine.js','./src/core/guided/CustomTrailRepository.js','./src/core/guided/CustomTrailPlan.js','./src/core/guided/PlatformToolTour.js','./src/core/loading/ModuleLoadCoordinator.js',
  './src/data/guidedTrailDefinitions.js','./src/data/guidedJourneySystems.js','./src/data/teacherTrailSystems.js','./public/manifest.webmanifest','./public/icons/icon.svg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{if(response?.status===200){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;});
  }));
});

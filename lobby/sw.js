'use strict';

const VERSION='14.10.8.96';
const CACHE_NAME=`agv-lobby-runtime-${VERSION}-stage65-f94-auto-calibration`; 
const CACHE_PREFIX='agv-lobby-runtime-';
const SDK_URLS=new Set([
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',
  'https://unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js'
]);
const CRITICAL_SHELL=[
  './',
  './index.html',
  './assets/diagnostics.js?v=14.10.8.66',
  './assets/sw-register.js?v=14.10.8.96-stage65-f94-auto-calibration',
  './assets/vendor-loader.js?v=14.10.8.96-stage65-f94-auto-calibration',
  './assets/boot.js?v=14.10.8.96-stage65-f94-auto-calibration',
  './assets/supabase.js?v=14.10.8.66',
  './assets/lobby.js?v=14.10.8.96-stage65-f94-auto-calibration',
  './assets/config.js?v=14.10.8.96',
  './assets/core/lobby-state.js?v=14.10.8.92-f90-graphics',
  './assets/core/world-manager.js?v=14.10.8.92-f90-graphics',
  './assets/core/world-adapter.js?v=14.10.8.96-f94-auto-calibration',
  './assets/plugin-world-host.js?v=14.10.8.96-f94-auto-calibration',
  './assets/colegio-agv-host.js?v=14.10.8.96-f94-auto-calibration',
  './assets/labirinto-armadilhas-host.js?v=14.10.8.96-f94-auto-calibration',
  './assets/render/graphics-calibrator.js?v=14.10.8.96-f94-auto-calibration',
  './assets/museu-hardware-lite.js?v=0.8.0',
  './assets/world/colegio-agv-shared.js?v=1.6.0-f7',
  './assets/world/labirinto-armadilhas-shared.js?v=1.1.0',
  './assets/world/museu-hardware-shared.js?v=0.8.0',
  './assets/lobby-lite.js?v=14.10.8.92-f90-graphics',
  './assets/village-lite.js?v=14.10.8.88-f86-villages',
  './assets/world/village-world.js?v=14.10.8.88-f86-villages',
  './assets/campus-module-lite.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-module-world.js?v=14.10.8.92-f90-graphics',
  './assets/world/world-manifests.js?v=14.10.8.92-f90-graphics',
  './assets/world/world-connections.js?v=14.10.8.92-f90-graphics',
  './assets/world/world-registry.js?v=14.10.8.92-f90-graphics',
  './assets/world/world-navigation.js?v=14.10.8.92-f90-graphics',
  './assets/world/global-map.js?v=14.10.8.92-f90-graphics',
  './assets/vale-lite.js?v=14.10.8.87-f85-map-realtime',
  './assets/world/vale-silicio-data.js?v=14.10.8.66',
  './assets/world/vale-silicio-shared.js?v=14.10.8.66',
  './data/vale-silicio/runtime-v2.json?v=14.10.8.66',
  './assets/world/campus-manifest.js?v=14.10.8.66',
  './assets/world/gameplay-settings.js?v=14.10.8.87-f85-gameplay',
  './assets/world/campus-modular-layout.js?v=14.10.8.92-f90-graphics',
  './assets/social/realtime-avatar-sync.js?v=14.10.8.92-f90-graphics',
  './assets/social/remote-avatar-state.js?v=14.10.8.87-f85-map-realtime',
  './assets/world/airdrop-system.js?v=14.10.8.92-f90-graphics',
  './assets/world/airdrop-sectors.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-experiences.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-destinations.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-connections.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-city-network.js?v=14.10.8.85-mobility',
  './assets/world/campus-interiors.js?v=14.10.8.92-f90-graphics',
  './assets/world/campus-live-systems.js?v=14.10.8.71-stage40-security',
  './assets/world/campus-mobility-systems.js?v=14.10.8.85-mobility',
  './assets/world/cinema-media.js?v=14.10.8.66-cinema',
  './assets/world/security-cameras.js?v=14.10.8.71-stage40-security',
  './assets/world/aerial-mobility.js?v=14.10.8.72-stage41-aerial',
  './assets/world/campus-viewpoints.js?v=14.10.8.73-stage42-viewpoints',
  './assets/render/camera-controller.js?v=14.10.8.85-f83-gameplay-performance',
  './assets/render/performance-manager.js?v=14.10.8.92-f90-graphics',
  './assets/characters/avatar-system.js?v=14.10.8.92-f90-graphics',
  './assets/game/portal-manager.js?v=14.10.8.66',
  './assets/game/challenge-manager.js?v=14.10.8.66',
  './assets/game/ride-manager.js?v=14.10.8.66-stage28',
  './assets/game/train-manager.js?v=14.10.8.85-mobility',
  './assets/world/dynamic-world.js?v=14.10.8.66-stage31',
  './assets/world/weather-system.js?v=14.10.8.66-stage32',
  './assets/world/space-identities.js?v=14.10.8.66-stage29',
  './assets/world/ambient-landscape.js?v=14.10.8.66-stage30',
  './assets/social/proximity-chat.js?v=14.10.8.66',
  './assets/rigged-avatar.js?v=14.10.8.66-stage34',
  './assets/models/agv-avatar-rig-v1.glb',
  './assets/lobby.css?v=14.10.8.96-stage65-f94-auto-calibration',
  './vendor/supabase/supabase.js'
];
const OPTIONAL_SHELL=[
  './vendor/three/three.module.min.js?v=14.10.8.66',
  './vendor/three/three.core.min.js?v=14.10.8.66',
  './assets/render/visual-quality-profile.js?v=14.10.8.92-f90-graphics',
  '../core/session/avatar-context.js?v=14.10.8.66-stage34',
  '../core/session/fullscreen-portal.js?v=14.10.8.66',
  '../core/session/fullscreen-portal.css?v=14.10.8.66',
  './data/vale-silicio/runtime-v2.schema.json?v=14.10.8.66',
  './data/vale-silicio/context.json?v=14.10.8.66'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    // Release gate: the new worker only installs if every critical Lobby asset
    // is available. This prevents a partially cached release from taking over.
    await cache.addAll(CRITICAL_SHELL);
    await Promise.allSettled(OPTIONAL_SHELL.map(url=>cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function notifyClient(clientId,detail){
  if(!clientId)return;
  try{const client=await self.clients.get(clientId);client?.postMessage?.({type:'agv-lobby-diagnostic',detail});}catch{}
}

async function cacheFirstSdk(request,clientId){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request,{ignoreVary:true});
  if(cached){await notifyClient(clientId,{sdkCache:'hit',source:new URL(request.url).host});return cached;}
  const response=await fetch(request);
  if(response && (response.ok || response.type==='opaque')){
    try{await cache.put(request,response.clone());await notifyClient(clientId,{sdkCache:'stored',source:new URL(request.url).host});}catch{}
  }
  return response;
}

async function networkFirstLocal(request,clientId){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response?.ok){try{await cache.put(request,response.clone());}catch{}}
    await notifyClient(clientId,{localAsset:'network',path:new URL(request.url).pathname,version:VERSION});
    return response;
  }catch(error){
    const cached=await cache.match(request,{ignoreSearch:false});
    if(cached){await notifyClient(clientId,{localAsset:'cache_fallback',path:new URL(request.url).pathname,version:VERSION});return cached;}
    throw error;
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(SDK_URLS.has(url.href)){
    event.respondWith(cacheFirstSdk(event.request,event.clientId));
    return;
  }
  if(url.origin===self.location.origin && url.pathname.includes('/lobby/')){
    event.respondWith(networkFirstLocal(event.request,event.clientId));
  }
});

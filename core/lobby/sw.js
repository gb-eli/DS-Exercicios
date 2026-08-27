'use strict';

const VERSION='14.10.8.18';
const CACHE_NAME=`agv-lobby-runtime-${VERSION}`;
const CACHE_PREFIX='agv-lobby-runtime-';
const SDK_URLS=new Set([
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js',
  'https://unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js'
]);
const LOCAL_SHELL=[
  './',
  './index.html',
  './assets/vendor-loader.js?v=14.10.8.18',
  './assets/boot.js?v=14.10.8.18',
  './assets/supabase.js?v=14.10.8.18',
  './assets/lobby.js?v=14.10.8.18',
  './assets/lobby.css?v=14.10.8.18'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.allSettled(LOCAL_SHELL.map(url=>cache.add(url)));
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

async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request);
  const network=fetch(request).then(async response=>{
    if(response?.ok){try{await cache.put(request,response.clone());}catch{}}
    return response;
  }).catch(()=>null);
  return cached || network || Response.error();
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(SDK_URLS.has(url.href)){
    event.respondWith(cacheFirstSdk(event.request,event.clientId));
    return;
  }
  if(url.origin===self.location.origin && url.pathname.includes('/lobby/')){
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

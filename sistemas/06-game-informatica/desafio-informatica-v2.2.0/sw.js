const CACHE_NAME='desafio-informatica-agv-2.5.7-r38';
const CORE_ASSETS=[
  './','./index.html','./professor.html','./manifest.webmanifest','./curriculum-plan.json',
  './assets/css/app.css',
  './assets/js/app.js','./assets/js/text-validation.js','./assets/js/modal-manager.js','./assets/js/enterprise-workflow.js','./assets/js/enterprise-files.js','./assets/js/enterprise-operations.js','./assets/js/spreadsheet-engine.js','./assets/js/email-engine.js','./assets/js/document-engine.js','./assets/js/completion-pdf.js','./assets/js/crypto.js','./assets/js/data.js',
  './assets/js/guided-v4.js','./assets/js/question-quality.js','./assets/js/questions-v4.js','./assets/js/result-pdf.js',
  './assets/js/school-schedule.js','./assets/js/storage.js','./assets/js/teacher-auth.js','./assets/js/teacher-store.js',
  './assets/js/teacher.js','./assets/js/teacher-codes.js','./assets/js/tool-discovery.js','./assets/js/terms.js','./assets/js/security.js',
  './assets/js/eduauth/config.js','./assets/js/eduauth/core.js','./assets/js/eduauth/index.js',
  './assets/js/eduauth/qr-code.js','./assets/js/eduauth/storage.js','./assets/js/eduauth/ui.js',
  './assets/js/eduauth/vendor/qr/index.js','./assets/js/eduauth/vendor/qr/QR8bitByte.js',
  './assets/js/eduauth/vendor/qr/QRBitBuffer.js','./assets/js/eduauth/vendor/qr/QRErrorCorrectLevel.js',
  './assets/js/eduauth/vendor/qr/QRMaskPattern.js','./assets/js/eduauth/vendor/qr/QRMath.js',
  './assets/js/eduauth/vendor/qr/QRMode.js','./assets/js/eduauth/vendor/qr/QRPolynomial.js',
  './assets/js/eduauth/vendor/qr/QRRSBlock.js','./assets/js/eduauth/vendor/qr/QRUtil.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{const results=await Promise.allSettled(CORE_ASSETS.map(asset=>cache.add(asset)));const failed=results.filter(item=>item.status==='rejected');if(failed.length)console.warn('Alguns recursos não entraram no cache inicial.',failed.length)}));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));return response;
    }).catch(()=>caches.match(request,{ignoreSearch:true}).then(cached=>cached||caches.match('./index.html'))));
    return;
  }
  const freshAsset=['script','style','worker'].includes(request.destination)||/\.(?:js|css|json|webmanifest)$/i.test(url.pathname);
  if(freshAsset){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}
      return response;
    }).catch(()=>caches.match(request,{ignoreSearch:true})));
    return;
  }
  event.respondWith(caches.match(request,{ignoreSearch:true}).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}
    return response;
  })));
});

self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});

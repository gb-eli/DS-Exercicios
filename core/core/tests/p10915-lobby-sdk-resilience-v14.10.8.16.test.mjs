import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const index=read('lobby/index.html');
const loader=read('lobby/assets/vendor-loader.js');
const swRegister=read('lobby/assets/sw-register.js');
const sw=read('lobby/sw.js');
const placeholder=read('lobby/vendor/supabase/supabase.js');
const vendorReadme=read('lobby/vendor/supabase/README.md');

test('P10.9.15 registra Service Worker antes do vendor-loader',()=>{
  const a=index.indexOf('assets/sw-register.js?v=14.10.8.18');
  const b=index.indexOf('assets/vendor-loader.js?v=14.10.8.18');
  assert.ok(a>=0 && b>a);
  assert.match(swRegister,/serviceWorker\.register\(`sw\.js\?v=\$\{VERSION\}`/);
  assert.match(swRegister,/updateViaCache:'none'/);
});

test('P10.9.15 usa Supabase JS 2.112.3 pinado e mantém local primeiro',()=>{
  assert.match(loader,/SDK_VERSION='2\.112\.3'/);
  const local=loader.indexOf('vendor/supabase/supabase.js');
  const primary=loader.indexOf('cdn.jsdelivr.net');
  const backup=loader.indexOf('unpkg.com');
  assert.ok(local>=0 && primary>local && backup>primary);
  assert.doesNotMatch(loader,/supabase-js@2(?!\.112\.3)/);
});

test('P10.9.15 Service Worker persiste SDK remoto e limpa caches antigos do Lobby',()=>{
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}/);
  assert.match(sw,/cacheFirstSdk/);
  assert.match(sw,/cache\.match\(request/);
  assert.match(sw,/cache\.put\(request,response\.clone\(\)\)/);
  assert.match(sw,/self\.skipWaiting\(\)/);
  assert.match(sw,/self\.clients\.claim\(\)/);
  assert.match(sw,/keys\.filter\(k=>k\.startsWith\(CACHE_PREFIX\)/);
  assert.match(sw,/@supabase\/supabase-js@2\.112\.3\/dist\/umd\/supabase\.js/g);
});

test('P10.9.15 modo offline ainda tenta URL remota para permitir resposta do cache do SW',()=>{
  assert.doesNotMatch(loader,/if\([^\n]*onLine===false[^\n]*\)\{\s*setError/);
  assert.match(loader,/supabase_sdk_offline_cache_miss/);
  assert.match(loader,/prepareServiceWorker/);
});

test('P10.9.15 não finge bundle local completo',()=>{
  assert.ok(Buffer.byteLength(placeholder,'utf8')<10_000);
  assert.match(vendorReadme,/placeholder/i);
  assert.match(vendorReadme,/não é.*bundle UMD oficial completo/i);
});

test('P10.9.15 metadados preservam gate de produção',()=>{
  const rel=JSON.parse(read('release-current.json'));
  assert.equal(rel.version,'14.10.8.18');
  assert.equal(rel.phase,'P10.9.17-academic-exercise-points');
  assert.equal(rel.baseVersion,'14.10.8.17');
  assert.equal(rel.runtimeCacheVersion,'14.10.8.18');
  assert.equal(rel.lobbyCacheVersion,'14.10.8.18');
  assert.equal(rel.requiresDatabaseChange,true);
  assert.equal(rel.requiresEdgeFunctionDeploy,true);
  assert.equal(rel.liveDeployApplied,false);
});

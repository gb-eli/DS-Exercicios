import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('P10.9.13 sincroniza todo o cache-bust crítico do Lobby em v14.10.8.65',()=>{
  const index=read('lobby/index.html'),vendor=read('lobby/assets/vendor-loader.js'),boot=read('lobby/assets/boot.js'),lobby=read('lobby/assets/lobby.js'),supa=read('lobby/assets/supabase.js'),three=read('lobby/assets/lobby3d.js');
  assert.match(index,/vendor-loader\.js\?v=14\.10\.8\.65/);
  assert.match(vendor,/VERSION='14\.10\.8\.65'/);
  assert.match(boot,/`\.\/lobby\.js\?v=\$\{VERSION\}`/);
  for(const dep of ['supabase.js','config.js','lobby3d.js','lobby-lite.js'])assert.match(lobby,new RegExp(dep.replace('.','\\.')+'\\?v=14\\.10\\.8\\.65'));
  assert.match(supa,/config\.js\?v=14\.10\.8\.65/);
  assert.doesNotMatch(three,/rigged-avatar\.js\?v=/);
  assert.match(three,/three\.module\.min\.js\?v=14\.10\.8\.65/);
});

test('P10.9.13 tenta Supabase local primeiro e mantém duas contingências CDN pinadas',()=>{
  const vendor=read('lobby/assets/vendor-loader.js');
  const local=vendor.indexOf("vendor/supabase/supabase.js");
  const jsdelivr=vendor.indexOf('cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js');
  const unpkg=vendor.indexOf('unpkg.com/@supabase/supabase-js@2.112.3/dist/umd/supabase.js');
  assert.ok(local>=0 && jsdelivr>local && unpkg>jsdelivr);
  assert.match(vendor,/boot_module_timeout/);
  assert.match(vendor,/supabase_sdk_load_failed/);
});

test('P10.9.13 autenticação não pode ficar presa indefinidamente',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/AUTH_TIMEOUT_MS=11000/);
  assert.match(lobby,/SESSION_TIMEOUT_MS=10000/);
  assert.match(lobby,/auth_signin_timeout/);
  assert.match(lobby,/auth_session_timeout/);
  assert.match(lobby,/Sua conta foi reconhecida, mas o Lobby não conseguiu concluir a conexão/);
});

test('P10.9.13 preserva regras de aluno enquanto a release atual inclui backend candidato',()=>{
  const rel=JSON.parse(read('release-current.json'));
  assert.equal(rel.version,'14.10.8.65');
  assert.equal(rel.phase,'maintenance-etapa-6-release-metadata');
  assert.equal(rel.runtimeCacheVersion,'14.10.8.65');
  assert.equal(rel.lobbyCacheVersion,'14.10.8.65');
  assert.equal(rel.requiresDatabaseChange,true);
  assert.equal(typeof rel.requiresEdgeFunctionDeploy,'boolean');
  assert.equal(rel.liveDeployApplied,false);
});


test('P10.9.13 vendor-loader encerra falha de rede sem loading infinito',async()=>{
  const source=read('lobby/assets/vendor-loader.js');
  const el=()=>({classList:{add(){},remove(){}},textContent:''});
  const nodes={login:el(),'game-shell':el(),kicked:el(),'login-message':el()};
  const context={
    console:{error(){}},setTimeout,clearTimeout,queueMicrotask,
    document:{readyState:'complete',getElementById:id=>nodes[id]||null,createElement(){return {dataset:{},remove(){},onload:null,onerror:null};},head:{appendChild(script){queueMicrotask(()=>script.onerror?.());}},body:{appendChild(){throw new Error('boot nao deveria iniciar sem SDK');}},addEventListener(){}},
  };
  context.globalThis=context;
  vm.runInNewContext(source,context);
  await new Promise(r=>setTimeout(r,10));
  assert.match(nodes['login-message'].textContent,/supabase_sdk_load_failed/);
});

test('P10.9.13 SDK local válido inicia boot atual sem consultar CDN',async()=>{
  const source=read('lobby/assets/vendor-loader.js');
  const el=()=>({classList:{add(){},remove(){}},textContent:''});
  const nodes={login:el(),'game-shell':el(),kicked:el(),'login-message':el()};
  const requested=[];let bootSrc='';
  const context={
    console:{error(){}},setTimeout,clearTimeout,queueMicrotask,
    document:{readyState:'complete',getElementById:id=>nodes[id]||null,createElement(){return {dataset:{},remove(){},onload:null,onerror:null};},head:{appendChild(script){requested.push(script.src);if(String(script.src).includes('vendor/supabase/supabase.js')){context.supabase={createClient(){}};queueMicrotask(()=>script.onload?.());}else queueMicrotask(()=>script.onerror?.());}},body:{appendChild(script){bootSrc=script.src;queueMicrotask(()=>script.onload?.());}},addEventListener(){}},
  };
  context.globalThis=context;
  vm.runInNewContext(source,context);
  await new Promise(r=>setTimeout(r,10));
  assert.equal(requested.length,1);
  assert.match(requested[0],/vendor\/supabase\/supabase\.js/);
  assert.match(bootSrc,/assets\/boot\.js\?v=14\.10\.8\.65/);
});

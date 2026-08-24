import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const index=read('lobby/index.html');
const diag=read('lobby/assets/diagnostics.js');
const loader=read('lobby/assets/vendor-loader.js');
const swRegister=read('lobby/assets/sw-register.js');
const sw=read('lobby/sw.js');
const lobby=read('lobby/assets/lobby.js');

test('P10.9.16 diagnóstico carrega antes do Service Worker e vendor-loader',()=>{
  const d=index.indexOf('assets/diagnostics.js?v=14.10.8.18');
  const s=index.indexOf('assets/sw-register.js?v=14.10.8.18');
  const v=index.indexOf('assets/vendor-loader.js?v=14.10.8.18');
  assert.ok(d>=0 && s>d && v>s);
});

test('P10.9.16 diagnóstico é sob demanda e também pode aparecer em erro',()=>{
  assert.match(diag,/params\.get\('diag'\)==='1'/);
  assert.match(diag,/event\.altKey&&event\.shiftKey/);
  assert.match(diag,/function exposeError/);
  assert.match(loader,/__agvLobbyDiag\?\.exposeError/);
  assert.match(lobby,/__agvLobbyDiag\?\.exposeError/);
});

test('P10.9.16 snapshot não consulta identidade nem storage de autenticação',()=>{
  assert.doesNotMatch(diag,/getElementById\(['"](?:email|password|player-name|player-class)/);
  assert.doesNotMatch(diag,/localStorage|sessionStorage|auth-token|access_token|refresh_token/);
  assert.doesNotMatch(diag,/supabase\.auth|profiles|class_memberships/);
  assert.match(diag,/Não inclui nome, e-mail, CGM, token ou código do aluno/);
});

test('P10.9.16 registra fonte do SDK, Service Worker e cache persistente',()=>{
  assert.match(loader,/sdk_attempt/);
  assert.match(loader,/sdk_loaded/);
  assert.match(swRegister,/sw_registered/);
  assert.match(swRegister,/sw_fetch/);
  assert.match(sw,/sdkCache:'hit'/);
  assert.match(sw,/sdkCache:'stored'/);
});

test('P10.9.16 registra runtime 3D, fallback leve, qualidade e FPS',()=>{
  assert.match(lobby,/runtime_3d_loading/);
  assert.match(lobby,/runtime_3d_ready/);
  assert.match(lobby,/runtime_3d_failed/);
  assert.match(lobby,/runtime_lite/);
  assert.match(lobby,/runtime:\{fps:/);
  assert.match(lobby,/runtime:\{quality:q/);
});

test('P10.9.16 mantém diagnóstico legível e responsivo no mobile',()=>{
  const css=read('lobby/assets/lobby.css');
  assert.match(css,/\.diag-card\{[^}]*max-height:min\(88dvh,760px\)/s);
  assert.match(css,/@media\(max-width:620px\).*\.diag-summary\{grid-template-columns:1fr\}/s);
  assert.match(css,/\.diag-trigger\{[^}]*min-height:44px/s);
});

test('P10.9.16 sincroniza cache-bust executável e metadados',()=>{
  const rel=JSON.parse(read('release-current.json'));
  assert.equal(rel.version,'14.10.8.18');
  assert.equal(rel.phase,'P10.9.17-academic-exercise-points');
  assert.equal(rel.baseVersion,'14.10.8.17');
  assert.equal(rel.runtimeCacheVersion,'14.10.8.18');
  assert.equal(rel.lobbyCacheVersion,'14.10.8.18');
  assert.equal(rel.requiresDatabaseChange,true);
  assert.equal(rel.requiresEdgeFunctionDeploy,true);
  assert.equal(rel.liveDeployApplied,false);
  assert.match(read('lobby/assets/vendor-loader.js'),/VERSION='14\.10\.8\.18'/);
  assert.match(read('lobby/sw.js'),/VERSION='14\.10\.8\.18'/);
});

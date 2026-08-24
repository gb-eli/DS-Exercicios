import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('P10.9.14 todas as entradas principais abrem Lobby com cache-bust atual',()=>{
  const hub=read('index.html'),app=read('atividades/assets/js/app.js'),prof=read('professor/assets/professor.js');
  assert.match(hub,/lobby\/\?v=14\.10\.8\.18/g);
  assert.match(app,/\.\.\/lobby\/\?v=14\.10\.8\.18/);
  assert.match(prof,/\.\.\/lobby\/\?v=14\.10\.8\.18/);
  assert.match(read('atividades/index.html'),/app\.js\?v=14\.10\.8\.18/);
  assert.match(read('professor/index.html'),/professor\.js\?v=14\.10\.8\.18/);
});

test('P10.9.14 cadeia executável do Lobby está sincronizada na release atual',()=>{
  const index=read('lobby/index.html'),vendor=read('lobby/assets/vendor-loader.js'),boot=read('lobby/assets/boot.js'),lobby=read('lobby/assets/lobby.js');
  assert.match(index,/vendor-loader\.js\?v=14\.10\.8\.18/);
  assert.match(vendor,/VERSION='14\.10\.8\.18'/);
  assert.match(boot,/lobby\.js\?v=14\.10\.8\.18/);
  for(const dep of ['supabase.js','config.js','lobby3d.js','lobby-lite.js'])assert.match(lobby,new RegExp(dep.replace('.','\\.')+'\\?v=14\\.10\\.8\\.18'));
});

test('P10.9.14 mobile permite zoom e login acompanha teclado virtual',()=>{
  const html=read('lobby/index.html'),css=read('lobby/assets/lobby.css');
  assert.doesNotMatch(html,/user-scalable\s*=\s*no/i);
  assert.match(css,/height:100dvh/);
  assert.match(css,/overflow-y:auto/);
  assert.match(css,/@media\(pointer:coarse\).*font-size:16px/s);
  assert.match(css,/min-width:44px;min-height:44px/);
});

test('P10.9.14 Supabase usa timeout real de transporte com AbortController',()=>{
  const supa=read('lobby/assets/supabase.js');
  assert.match(supa,/NETWORK_TIMEOUT_MS=9000/);
  assert.match(supa,/new AbortController\(\)/);
  assert.match(supa,/global:\{fetch:timedFetch\}/);
  assert.match(supa,/controller\.abort/);
});

test('P10.9.14 erro de rede não dispara cadastro CGM e pós-login distingue falha de dados',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/isCredentialError/);
  assert.match(lobby,/!cgm\|\|!isCredentialError\(error\)/);
  assert.match(lobby,/profile_load_failed/);
  assert.match(lobby,/membership_load_failed/);
  assert.match(lobby,/activities_exercises_failed/);
  assert.match(lobby,/Sua conta foi reconhecida, mas o Lobby não conseguiu concluir a conexão/);
});

test('P10.9.14 presença reduz polling em touch e não consulta com página oculta',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/PRESENCE_INTERVAL_MS=COARSE_POINTER\?8000:6000/);
  assert.match(lobby,/POLL_INTERVAL_MS=COARSE_POINTER\?9000:7000/);
  assert.match(lobby,/if\(document\.hidden\)\{setTimeout\(poll,POLL_INTERVAL_MS\);return;\}/);
});

test('P10.9.14 modais possuem foco inicial, trap, Escape e retorno de foco',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/modalReturnFocus/);
  assert.match(lobby,/function openModal/);
  assert.match(lobby,/function closeModal/);
  assert.match(lobby,/event\.key==='Escape'/);
  assert.match(lobby,/event\.key!=='Tab'/);
});

test('P10.9.14 reduced-motion elimina animações críticas e login reduz ornamentos',()=>{
  const css=read('lobby/assets/lobby.css'),html=read('lobby/index.html');
  assert.match(css,/@media\(prefers-reduced-motion:reduce\).*loading-orbit span\{animation:none\}/s);
  assert.match(css,/game-stage\.portal-travel::after\{display:none\}/);
  assert.doesNotMatch(html,/login-features/);
  assert.match(css,/\.login-shell\{[^}]*background:#071018/);
});

test('P10.9.14 preserva hardening do Lobby com backend candidato da release atual',()=>{
  const rel=JSON.parse(read('release-current.json'));
  assert.equal(rel.version,'14.10.8.18');
  assert.equal(rel.phase,'P10.9.17-academic-exercise-points');
  assert.equal(rel.requiresDatabaseChange,true);
  assert.equal(rel.requiresEdgeFunctionDeploy,true);
  assert.equal(rel.liveDeployApplied,false);
  assert.equal(rel.lobbyCacheVersion,'14.10.8.18');
  assert.ok(rel.knownPending.some(x=>/supabase/i.test(x)));
});

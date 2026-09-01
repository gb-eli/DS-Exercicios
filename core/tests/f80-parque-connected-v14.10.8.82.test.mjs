import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F80 registra Parque como mundo lazy independente',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js');
  assert.match(adapter,/export const PARQUE_WORLD_ADAPTER/);
  assert.match(adapter,/id:'parque-diversoes-agv',scene:'parque'/);
  assert.match(adapter,/import\('\.\.\/parque-diversoes-agv-lite\.js\?v=14\.10\.8\.82-stage51-parque-connected'\)/);
  assert.match(adapter,/import\('\.\.\/parque-diversoes-agv3d\.js\?v=14\.10\.8\.82-stage51-parque-connected'\)/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/parque-diversoes-agv-(?:lite|3d)\.js|parque-diversoes-agv3d\.js/);
  assert.doesNotMatch(boot,/probeAsset\('parque-diversoes-agv(?:-lite|3d)\.js/);
});

test('F80 Campus oferece portal físico para o Parque e retorno do Parque aponta ao Campus',()=>{
  const exp=read('lobby/assets/world/campus-experiences.js'),env=read('lobby/assets/world/campus-environment.js'),shared=read('lobby/assets/world/parque-diversoes-agv-shared.js');
  assert.match(exp,/id:'parque-portal'/);
  assert.match(exp,/type:'parque-portal'/);
  assert.match(env,/experience\.type==='parque-portal'/);
  assert.match(env,/PARQUE DE DIVERSÕES AGV/);
  assert.match(shared,/PARQUE_RETURN_PORTAL/);
  assert.match(shared,/type:'return-portal'/);
  assert.match(shared,/targetWorldId:'campus-ds'/);
});

test('F80 lobby conecta Parque ao seletor de mundos, teleporte global e atalho destacado',()=>{
  const lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(lobby,/PARQUE_WORLD_ADAPTER/);
  assert.match(lobby,/state\.scene==='parque'/);
  assert.match(lobby,/async function enterParque\(\)/);
  assert.match(lobby,/PARQUE_FAST_TRAVEL/);
  assert.match(lobby,/function sceneArea\(/);
  assert.match(lobby,/scene==='parque'\?'parque-diversoes-agv'/);
  assert.match(lobby,/parqueWorldToPresence/);
  assert.match(lobby,/parquePresenceToWorld/);
  assert.ok(html.includes('id="teleport-parque-now"'));
  assert.match(html,/value="parque">Parque de Diversões AGV/);
  assert.match(lobby,/\$\('teleport-parque-now'\)\.onclick/);
});

test('F80 runtime do Parque publica presença isolada e descarrega multiplayer/recursos ao sair',()=>{
  const lite=read('lobby/assets/parque-diversoes-agv-lite.js'),three=read('lobby/assets/parque-diversoes-agv3d.js');
  for(const src of [lite,three]){
    assert.match(src,/area:'parque-diversoes-agv'/);
    assert.match(src,/scene:'parque'/);
    assert.match(src,/worldId:'parque-diversoes-agv'/);
    assert.match(src,/competition\.stop\(\)/);
  }
  assert.match(lite,/cancelAnimationFrame\(raf\)/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeObject\(root\)/);
});

test('F80 multiplayer recreativo usa Broadcast e não cria ranking persistente obrigatório',()=>{
  const realtime=read('lobby/assets/world/parque-diversoes-agv-realtime.js'),multi=read('lobby/assets/world/parque-diversoes-agv-multiplayer.js');
  assert.match(realtime,/broadcast/i);
  assert.match(multi,/scoreboard/i);
  assert.doesNotMatch(realtime,/\.from\(['"][^'"]+['"]\)\.insert|\.upsert\(/i);
});

test('F80 backend isola presença/chat/reunir do Parque e mantém veículos terrestres fora dele',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/072_lobby_amusement_park_world.sql');
  assert.match(edge,/['"]parque-diversoes-agv['"]/);
  assert.match(edge,/['"]parque['"]/);
  assert.match(edge,/scene==='parque'\?'parque-diversoes-agv'/);
  assert.match(edge,/parque-diversoes-agv.*includes\(presence\.area\)/s);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/parque-diversoes-agv/);
});

test('F80 atrações principais do Parque permanecem disponíveis após integração',()=>{
  const shared=read('lobby/assets/world/parque-diversoes-agv-shared.js'),experiences=read('lobby/assets/world/parque-diversoes-agv-experiences.js');
  for(const token of ['coaster','race','parkour','slide','shooting'])assert.ok((shared+experiences).toLowerCase().includes(token),token);
});

test('F80 Parque participa do chat/reunir e do bridge multiplayer do lobby',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/function parqueMultiplayerBridge\(\)/);
  assert.match(lobby,/createParqueSupabaseCompetitionTransport/);
  assert.match(lobby,/areaText\([^)]*\)/);
  assert.match(lobby,/parque-diversoes-agv/);
  assert.match(lobby,/scene:'parque'/);
});

test('F80 versão/cache avançam para 14.10.8.82 stage51 sem precache do runtime pesado do Parque',()=>{
  const files=['lobby/assets/config.js','lobby/assets/boot.js','lobby/assets/vendor-loader.js','lobby/assets/sw-register.js','lobby/sw.js','lobby/index.html','lobby/assets/core/world-adapter.js'];
  for(const f of files)assert.ok(patch(read(f))>=82,`${f} precisa patch >=82`);
  assert.match(read('lobby/sw.js'),/stage51-parque-connected/);
  assert.match(read('lobby/index.html'),/stage51-parque-connected/);
  const critical=read('lobby/sw.js').slice(read('lobby/sw.js').indexOf('const CRITICAL_SHELL'),read('lobby/sw.js').indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/parque-diversoes-agv/);
});

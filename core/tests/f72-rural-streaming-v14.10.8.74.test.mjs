import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F72 define Mundo Rural com limites, destinos, fazenda, campos, rio, ponte e fauna',async()=>{
  const mod=await import('../../lobby/assets/world/rural-world.js');
  assert.ok(mod.RURAL_BOUNDS.minX<mod.RURAL_BOUNDS.maxX&&mod.RURAL_BOUNDS.minZ<mod.RURAL_BOUNDS.maxZ);
  assert.ok(mod.RURAL_FAST_TRAVEL.length>=8);
  assert.ok(mod.RURAL_FIELDS.length>=3);
  assert.ok(mod.RURAL_BUILDINGS.length>=4);
  assert.ok(mod.RURAL_ANIMALS.length>=6);
  assert.ok(mod.RURAL_OBJECTS.some(o=>o.type==='rural-bridge'));
  assert.ok(mod.RURAL_OBJECTS.some(o=>o.type==='rural-river'));
  assert.equal(mod.RURAL_RETURN_PORTAL.type,'rural-return-portal');
  const p=mod.ruralWorldToPresence(mod.RURAL_SPAWN.x,mod.RURAL_SPAWN.z),w=mod.ruralPresenceToWorld(p.x,p.y);
  assert.ok(Math.abs(w.x-mod.RURAL_SPAWN.x)<1&&Math.abs(w.z-mod.RURAL_SPAWN.z)<1);
});

test('F72 carrega runtimes rurais por import dinâmico e não pelo boot crítico',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(adapter,/export const RURAL_WORLD_ADAPTER/);
  assert.match(adapter,/import\('\.\.\/rural-lite\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(adapter,/import\('\.\.\/rural3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.doesNotMatch(adapter,/^import .*rural-(?:lite|3d)\.js/m);
  assert.doesNotMatch(boot,/probeAsset\('rural-(?:lite|3d)\.js/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/rural-lite\.js|rural3d\.js|rural-world\.js/);
});

test('F72 runtime 2D e 3D descarregam recursos ao sair do mapa',()=>{
  const lite=read('lobby/assets/rural-lite.js'),three=read('lobby/assets/rural3d.js');
  assert.match(lite,/stop\(\)\{stopped=true;cancelAnimationFrame\(raf\)/);
  assert.match(lite,/removeEventListener\('keydown'/);
  assert.match(three,/function disposeRoot/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeRoot\(scene\)/);
  assert.match(three,/weatherEffects\?\.dispose\?\.\(\)/);
  assert.match(three,/cameraController\.dispose\(\)/);
});

test('F72 Campus oferece portal rural e lobby alterna scene/área corretamente',()=>{
  const exp=read('lobby/assets/world/campus-experiences.js'),lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(exp,/id:'rural-portal'/);
  assert.match(exp,/type:'rural-portal'/);
  assert.match(lobby,/async function enterRural\(\)/);
  assert.match(lobby,/state\.scene='rural'/);
  assert.match(lobby,/area:'rural-agv'/);
  assert.match(lobby,/async function returnToCampus\(\)/);
  assert.match(lobby,/rural-return-portal/);
  assert.ok(html.includes('id="teleport-rural-now"'));
  assert.match(html,/value="rural"/);
});

test('F72 minimapa, teleporte e presença usam coordenadas próprias do Rural',()=>{
  const lobby=read('lobby/assets/lobby.js'),lite=read('lobby/assets/rural-lite.js'),three=read('lobby/assets/rural3d.js');
  assert.match(lobby,/RURAL_BOUNDS/);
  assert.match(lobby,/RURAL_FAST_TRAVEL/);
  assert.match(lobby,/scene==='rural'/);
  assert.match(lobby,/fillText\('RURAL'/);
  assert.match(lite,/ruralWorldToPresence/);
  assert.match(lite,/o\.area!=='rural-agv'/);
  assert.match(three,/ruralWorldToPresence/);
  assert.match(three,/o\.area!=='rural-agv'/);
  const campus3d=read('lobby/assets/lobby3d.js'),campus2d=read('lobby/assets/lobby-lite.js');
  assert.match(campus3d,/o\.area==='vale-silicio'\|\|o\.area==='rural-agv'/);
  assert.match(campus2d,/o\.area==='vale-silicio'\|\|o\.area==='rural-agv'/);
});

test('F72 backend aceita presença/chat/reunir rural e mantém veículos terrestres fora do mapa externo',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/067_lobby_rural_world.sql');
  assert.match(edge,/['"]rural-agv['"]/);
  assert.match(edge,/scene==='rural'/);
  assert.match(edge,/const gatherArea=scene==='vale'\?'vale-silicio':scene==='rural'\?'rural-agv'/);
  assert.match(edge,/\['vale-silicio','rural-agv'(?:,'military-agv')?(?:,'space-agv')?(?:,'moon-agv')?(?:,'mars-agv')?\]\.includes\(presence\.area\)/);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/vale-silicio/);
  assert.match(migration,/rural-agv/);
});

test('F72 rural 3D possui estrada, fazenda, campos, rio, ponte, pomar e animais',()=>{
  const three=read('lobby/assets/rural3d.js');
  for(const token of ['RURAL_ROADS','RURAL_FIELDS','RURAL_BUILDINGS','RURAL_ANIMALS','river','bridge','orchard','rural-world-streamed-f72'])assert.ok(three.toLowerCase().includes(token.toLowerCase()),token);
  assert.match(three,/worldRoot/);
  assert.match(three,/nearestRuralObject/);
});

test('F72 release/cache estão em 14.10.8.74 e assets rurais continuam lazy',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  assert.ok(patch(config)>=74);assert.ok(patch(boot)>=74);assert.ok(patch(sw)>=74);assert.ok(patch(adapter)>=74);
  assert.ok(patch(index)>=74);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/RURAL_WORLD_ADAPTER/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/rural-(?:lite|3d)\.js/);
});

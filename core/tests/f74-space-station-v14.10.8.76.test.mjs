import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F74 define Estação Orbital com limites, módulos, cúpula, painéis e coordenadas próprias',async()=>{
  const mod=await import('../../lobby/assets/world/space-world.js');
  assert.ok(mod.SPACE_BOUNDS.minX<mod.SPACE_BOUNDS.maxX&&mod.SPACE_BOUNDS.minZ<mod.SPACE_BOUNDS.maxZ);
  assert.ok(mod.SPACE_FAST_TRAVEL.length>=8);
  assert.ok(mod.SPACE_MODULES.length>=6);
  assert.ok(mod.SPACE_MODULES.some(m=>m.type==='space-viewpoint'));
  assert.ok(mod.SPACE_SOLAR_ARRAYS.length>=2);
  assert.equal(mod.SPACE_RETURN_PORTAL.type,'space-return-portal');
  const p=mod.spaceWorldToPresence(mod.SPACE_SPAWN.x,mod.SPACE_SPAWN.z),w=mod.spacePresenceToWorld(p.x,p.y);
  assert.ok(Math.abs(w.x-mod.SPACE_SPAWN.x)<1&&Math.abs(w.z-mod.SPACE_SPAWN.z)<1);
});

test('F74 Campus oferece Centro Espacial e embarque para mundo orbital',()=>{
  const exp=read('lobby/assets/world/campus-experiences.js'),lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(exp,/id:'space-portal'/);
  assert.match(exp,/type:'space-portal'/);
  assert.match(exp,/Centro Espacial AGV/);
  assert.match(lobby,/async function enterSpace\(\)/);
  assert.match(lobby,/state\.scene='space'/);
  assert.match(lobby,/area:'space-agv'/);
  assert.match(lobby,/space-return-portal/);
  assert.ok(html.includes('id="teleport-space-now"'));
  assert.match(html,/value="space"/);
});

test('F74 space-lite e space3d são imports dinâmicos e ficam fora do cache crítico',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(adapter,/export const SPACE_WORLD_ADAPTER/);
  assert.match(adapter,/import\('\.\.\/space-lite\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(adapter,/import\('\.\.\/space3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.doesNotMatch(adapter,/^import .*space(?:-lite|3d)\.js/m);
  assert.doesNotMatch(boot,/probeAsset\('space(?:-lite|3d)\.js/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/space-lite\.js|space3d\.js|space-world\.js/);
});

test('F74 runtime orbital 2D/3D isola presença em space-agv e libera recursos ao sair',()=>{
  const lite=read('lobby/assets/space-lite.js'),three=read('lobby/assets/space3d.js');
  assert.match(lite,/o\.area!=='space-agv'/);
  assert.match(three,/o\.area!=='space-agv'/);
  assert.match(lite,/stop\(\)\{stopped=true;cancelAnimationFrame\(raf\)/);
  assert.match(three,/worldRoot\.name='space-world-streamed-f\d+'/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeRoot\(scene\)/);
  assert.match(three,/cameraController\.dispose\?\.\(\)/);
});

test('F74 3D possui Terra, Sol, estrelas, cúpula e energia solar no mesmo mundo espacial',()=>{
  const three=read('lobby/assets/space3d.js'),world=read('lobby/assets/world/space-world.js');
  assert.match(three,/Earth and Sun/);
  assert.match(three,/new THREE\.Points\(/);
  assert.match(three,/earthGroup/);
  assert.match(three,/sun/);
  assert.match(three,/SPACE_SOLAR_ARRAYS/);
  assert.match(world,/Cúpula de Observação da Terra/);
  assert.match(world,/Painéis Solares/);
});

test('F74 minimapa, teleporte e interface reconhecem a Órbita como cena independente',()=>{
  const lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(lobby,/SPACE_BOUNDS/);
  assert.match(lobby,/SPACE_FAST_TRAVEL/);
  assert.match(lobby,/scene==='space'/);
  assert.match(lobby,/fillText\('ÓRBITA'/);
  assert.match(lobby,/Estação Orbital AGV/);
  assert.match(html,/Estação Orbital AGV/);
});

test('F74 backend aceita presença/chat/reunir orbital e mantém veículos terrestres Campus-only',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/069_lobby_space_world.sql');
  assert.match(edge,/['"]space-agv['"]/);
  assert.match(edge,/\['campus','vale','rural','military','space'(?:,'moon')?(?:,'mars')?(?:,'parque')?\]/);
  assert.match(edge,/scene==='space'\?'space-agv'/);
  assert.match(edge,/\['vale-silicio','rural-agv','military-agv','space-agv'(?:,'moon-agv')?(?:,'mars-agv')?(?:,'parque-diversoes-agv')?\]\.includes\(presence\.area\)/);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/space-agv/);
});

test('F74 mantém usuários orbitais fora dos runtimes do Campus',()=>{
  const campus3d=read('lobby/assets/lobby3d.js'),campus2d=read('lobby/assets/lobby-lite.js');
  assert.match(campus3d,/o\.area==='space-agv'/);
  assert.match(campus2d,/o\.area==='space-agv'/);
});

test('F74 release/cache avançam para 14.10.8.76 stage45 e preservam runtimes espaciais lazy',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=76);
  assert.match(index,/14\.10\.8\.\d+-stage\d+-[a-z0-9-]+/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/SPACE_WORLD_ADAPTER/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/space(?:-lite|3d)\.js/);
});

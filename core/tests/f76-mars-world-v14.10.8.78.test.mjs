import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F76 define Marte com limites, gravidade, base, crateras, cânions e rover',async()=>{
  const mod=await import('../../lobby/assets/world/mars-world.js');
  assert.ok(mod.MARS_BOUNDS.minX<mod.MARS_BOUNDS.maxX&&mod.MARS_BOUNDS.minZ<mod.MARS_BOUNDS.maxZ);
  assert.equal(mod.MARS_GRAVITY,3.71);
  assert.ok(mod.MARS_BASE_MODULES.length>=6);
  assert.ok(mod.MARS_CRATERS.length>=4);
  assert.ok(mod.MARS_CANYONS.length>=2);
  assert.equal(mod.MARS_ROVER.type,'mars-rover');
  assert.equal(mod.MARS_VIEWPOINT.type,'mars-viewpoint');
  assert.equal(mod.MARS_RETURN_PORTAL.type,'mars-return-space-portal');
  assert.ok(mod.MARS_FAST_TRAVEL.length>=11);
  const p=mod.marsWorldToPresence(mod.MARS_SPAWN.x,mod.MARS_SPAWN.z),w=mod.marsPresenceToWorld(p.x,p.y);
  assert.ok(Math.abs(w.x-mod.MARS_SPAWN.x)<1&&Math.abs(w.z-mod.MARS_SPAWN.z)<1);
});

test('F76 Estação Orbital oferece transporte independente para Marte',()=>{
  const world=read('lobby/assets/world/space-world.js'),three=read('lobby/assets/space3d.js'),lite=read('lobby/assets/space-lite.js'),lobby=read('lobby/assets/lobby.js');
  assert.match(world,/SPACE_MARS_PORTAL/);
  assert.match(world,/type:'mars-portal'/);
  assert.match(three,/TRANSPORTE • MARTE/);
  assert.match(lite,/MARTE/);
  assert.match(lobby,/async function enterMars\(\)/);
  assert.match(lobby,/\['moon','mars'\]\.includes\(state\.scene\)/);
});

test('F76 mars-lite e mars3d são imports dinâmicos e ficam fora do cache crítico',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(adapter,/export const MARS_WORLD_ADAPTER/);
  assert.match(adapter,/import\('\.\.\/mars-lite\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(adapter,/import\('\.\.\/mars3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.doesNotMatch(adapter,/^import .*mars(?:-lite|3d)\.js/m);
  assert.doesNotMatch(boot,/probeAsset\('mars(?:-lite|3d)\.js/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/mars-lite\.js|mars3d\.js/);
});

test('F76 runtime marciano 3D possui gravidade própria, poeira, Terra/Sol e rover utilizável',()=>{
  const three=read('lobby/assets/mars3d.js');
  assert.match(three,/MARS_GRAVITY\*1\.85/);
  assert.match(three,/earthGroup/);
  assert.match(three,/const sun=/);
  assert.match(three,/dustCount/);
  assert.match(three,/marsDustStorm/);
  assert.match(three,/ROVER MARCIANO AGV/);
  assert.match(three,/function toggleRover\(\)/);
  assert.match(three,/worldRoot\.name='mars-world-streamed-f76'/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeRoot\(scene\)/);
});

test('F76 presença, chat e reunir isolam mars-agv e veículos terrestres seguem Campus-only',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/071_lobby_mars_world.sql');
  assert.match(edge,/['"]mars-agv['"]/);
  assert.match(edge,/\['campus','vale','rural','military','space','moon','mars'\]/);
  assert.match(edge,/scene==='mars'\?'mars-agv'/);
  assert.match(edge,/\['vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv'\]\.includes\(presence\.area\)/);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/mars-agv/);
});

test('F76 Campus não renderiza usuários marcianos e minimapa/teleporte reconhecem Marte',()=>{
  const campus3d=read('lobby/assets/lobby3d.js'),campus2d=read('lobby/assets/lobby-lite.js'),lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(campus3d,/o\.area==='mars-agv'/);
  assert.match(campus2d,/o\.area==='mars-agv'/);
  assert.match(lobby,/fillText\('MARTE'/);
  assert.match(lobby,/MARS_FAST_TRAVEL/);
  assert.ok(html.includes('id="teleport-mars-now"'));
  assert.match(html,/value="mars"/);
});

test('F76 retorno marciano preserva posição orbital e reunir reconhece moon/mars no cliente',()=>{
  const lobby=read('lobby/assets/lobby.js'),state=read('lobby/assets/core/lobby-state.js');
  assert.match(state,/savedSpacePlayer/);
  assert.match(lobby,/if\(state\.scene==='space'\)state\.savedSpacePlayer=\{\.\.\.state\.player\}/);
  assert.match(lobby,/from==='mars'/);
  assert.match(lobby,/target\.scene==='moon'\?'moon':target\.scene==='mars'\?'mars'/);
});

test('F76 Marte 2D possui cânions, tempestade visual e presença isolada',()=>{
  const lite=read('lobby/assets/mars-lite.js');
  assert.match(lite,/MARS_CANYONS/);
  assert.match(lite,/const storm=/);
  assert.match(lite,/o\.area!=='mars-agv'/);
  assert.match(lite,/toggleRover/);
  assert.match(lite,/getDestinations:\(\)=>MARS_FAST_TRAVEL/);
});

test('F76 release/cache avançam para 14.10.8.78 stage47 mantendo runtimes marcianos lazy',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=78);
  assert.match(index,/14\.10\.8\.\d+-stage\d+-[a-z0-9-]+/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/MARS_WORLD_ADAPTER/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/mars(?:-lite|3d)\.js/);
});

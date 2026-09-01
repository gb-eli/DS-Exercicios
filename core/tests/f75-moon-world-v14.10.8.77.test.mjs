import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F75 define Lua com limites, base, crateras, rover, mirante e gravidade lunar',async()=>{
  const mod=await import('../../lobby/assets/world/moon-world.js');
  assert.ok(mod.MOON_BOUNDS.minX<mod.MOON_BOUNDS.maxX&&mod.MOON_BOUNDS.minZ<mod.MOON_BOUNDS.maxZ);
  assert.equal(mod.MOON_GRAVITY,1.62);
  assert.ok(mod.MOON_BASE_MODULES.length>=5);
  assert.ok(mod.MOON_CRATERS.length>=4);
  assert.equal(mod.MOON_ROVER.type,'moon-rover');
  assert.equal(mod.MOON_VIEWPOINT.type,'moon-viewpoint');
  assert.equal(mod.MOON_RETURN_PORTAL.type,'moon-return-space-portal');
  assert.ok(mod.MOON_FAST_TRAVEL.length>=9);
  const p=mod.moonWorldToPresence(mod.MOON_SPAWN.x,mod.MOON_SPAWN.z),w=mod.moonPresenceToWorld(p.x,p.y);
  assert.ok(Math.abs(w.x-mod.MOON_SPAWN.x)<1&&Math.abs(w.z-mod.MOON_SPAWN.z)<1);
});

test('F75 Estação Orbital oferece transporte específico para a Lua',()=>{
  const world=read('lobby/assets/world/space-world.js'),three=read('lobby/assets/space3d.js'),lite=read('lobby/assets/space-lite.js'),lobby=read('lobby/assets/lobby.js');
  assert.match(world,/SPACE_MOON_PORTAL/);
  assert.match(world,/type:'moon-portal'/);
  assert.match(three,/TRANSPORTE • LUA/);
  assert.match(lite,/☾ LUA/);
  assert.match(lobby,/async function enterMoon\(\)/);
  assert.match(lobby,/async function returnToSpace\(\)/);
  assert.match(lobby,/savedSpacePlayer/);
});

test('F75 moon-lite e moon3d são imports dinâmicos e ficam fora do cache crítico',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(adapter,/export const MOON_WORLD_ADAPTER/);
  assert.match(adapter,/import\('\.\.\/moon-lite\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(adapter,/import\('\.\.\/moon3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.doesNotMatch(adapter,/^import .*moon(?:-lite|3d)\.js/m);
  assert.doesNotMatch(boot,/probeAsset\('moon(?:-lite|3d)\.js/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/moon-lite\.js|moon3d\.js/);
});

test('F75 runtime lunar 3D possui baixa gravidade, Terra no horizonte e rover utilizável',()=>{
  const three=read('lobby/assets/moon3d.js');
  assert.match(three,/MOON_GRAVITY\*2\.84/);
  assert.match(three,/earthGroup/);
  assert.match(three,/Rover Lunar AGV|ROVER LUNAR AGV/);
  assert.match(three,/function toggleRover\(\)/);
  assert.match(three,/roverSpeed/);
  assert.match(three,/worldRoot\.name='moon-world-streamed-f75'/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeRoot\(scene\)/);
});

test('F75 presença, chat e reunir isolam moon-agv e veículos terrestres seguem Campus-only',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/070_lobby_moon_world.sql');
  assert.match(edge,/['"]moon-agv['"]/);
  assert.match(edge,/\['campus','vale','rural','military','space','moon'(?:,'mars')?(?:,'parque')?\]/);
  assert.match(edge,/scene==='moon'\?'moon-agv'/);
  assert.match(edge,/\['vale-silicio','rural-agv','military-agv','space-agv','moon-agv'(?:,'mars-agv')?(?:,'parque-diversoes-agv')?\]\.includes\(presence\.area\)/);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/moon-agv/);
});

test('F75 Campus não renderiza usuários lunares e minimapa/teleporte reconhecem a Lua',()=>{
  const campus3d=read('lobby/assets/lobby3d.js'),campus2d=read('lobby/assets/lobby-lite.js'),lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(campus3d,/o\.area==='moon-agv'/);
  assert.match(campus2d,/o\.area==='moon-agv'/);
  assert.match(lobby,/fillText\('LUA'/);
  assert.match(lobby,/MOON_FAST_TRAVEL/);
  assert.ok(html.includes('id="teleport-moon-now"'));
  assert.match(html,/value="moon"/);
});

test('F75 retorno lunar preserva a posição orbital anterior',()=>{
  const lobby=read('lobby/assets/lobby.js'),state=read('lobby/assets/core/lobby-state.js');
  assert.match(state,/savedSpacePlayer/);
  assert.match(lobby,/if\(state\.scene==='space'\)state\.savedSpacePlayer=\{\.\.\.state\.player\}/);
  assert.match(lobby,/state\.player=state\.savedSpacePlayer\?\{\.\.\.state\.savedSpacePlayer\}/);
  assert.match(lobby,/state\.savedSpacePlayer=null/);
});

test('F75 release/cache avançam para 14.10.8.77 stage46 mantendo runtimes lunares lazy',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=77);
  assert.match(index,/14\.10\.8\.\d+-stage\d+-[a-z0-9-]+/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/MOON_WORLD_ADAPTER/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/moon(?:-lite|3d)\.js/);
});

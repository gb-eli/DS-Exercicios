import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F73 define Base de Operações com logística, engenharia, resgate, pista e treinamento',async()=>{
  const mod=await import('../../lobby/assets/world/military-world.js');
  assert.ok(mod.MILITARY_BOUNDS.minX<mod.MILITARY_BOUNDS.maxX&&mod.MILITARY_BOUNDS.minZ<mod.MILITARY_BOUNDS.maxZ);
  assert.ok(mod.MILITARY_FAST_TRAVEL.length>=8);
  assert.ok(mod.MILITARY_BUILDINGS.length>=5);
  assert.ok(mod.MILITARY_BUILDINGS.filter(b=>b.interiorId).length>=2);
  assert.ok(mod.MILITARY_TRAINING.length>=4);
  assert.ok(mod.MILITARY_SUPPORT_VEHICLES.length>=4);
  assert.equal(mod.MILITARY_RETURN_PORTAL.type,'military-return-portal');
  assert.equal(mod.MILITARY_RUNWAY.type,'military-runway');
  const p=mod.militaryWorldToPresence(mod.MILITARY_SPAWN.x,mod.MILITARY_SPAWN.z),w=mod.militaryPresenceToWorld(p.x,p.y);
  assert.ok(Math.abs(w.x-mod.MILITARY_SPAWN.x)<1&&Math.abs(w.z-mod.MILITARY_SPAWN.z)<1);
});

test('F73 carrega military-lite e military3d dinamicamente e fora do cache crítico',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(adapter,/export const MILITARY_WORLD_ADAPTER/);
  assert.match(adapter,/import\('\.\.\/military-lite\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(adapter,/import\('\.\.\/military3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.doesNotMatch(adapter,/^import .*military-(?:lite|3d)\.js/m);
  assert.doesNotMatch(boot,/probeAsset\('military-(?:lite|3d)\.js/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/military-lite\.js|military3d\.js|military-world\.js/);
});

test('F73 interiores dos hangares são criados sob demanda e descartados ao sair',()=>{
  const three=read('lobby/assets/military3d.js'),lite=read('lobby/assets/military-lite.js');
  assert.match(three,/function buildInterior\(id\)/);
  assert.match(three,/military-interior-streamed-f73:/);
  assert.match(three,/function enterMilitaryInterior\(id\)/);
  assert.match(three,/function exitMilitaryInterior\(\)/);
  assert.match(three,/disposeRoot\(interiorRoot\)/);
  assert.match(three,/worldRoot\.visible=false/);
  assert.match(three,/worldRoot\.visible=true/);
  assert.match(lite,/enterMilitaryInterior/);
  assert.match(lite,/exitMilitaryInterior/);
});

test('F73 runtime 3D/2D liberam recursos do mapa quando World Manager encerra a cena',()=>{
  const lite=read('lobby/assets/military-lite.js'),three=read('lobby/assets/military3d.js');
  assert.match(lite,/stop\(\)\{stopped=true;cancelAnimationFrame\(raf\)/);
  assert.match(three,/function disposeRoot/);
  assert.match(three,/renderer\.dispose\(\)/);
  assert.match(three,/disposeRoot\(scene\)/);
  assert.match(three,/weatherEffects\?\.dispose\?\.\(\)/);
  assert.match(three,/cameraController\.dispose\?\.\(\)/);
});

test('F73 Campus oferece portal e Lobby alterna scene/area, minimapa e teleporte militar',()=>{
  const exp=read('lobby/assets/world/campus-experiences.js'),lobby=read('lobby/assets/lobby.js'),html=read('lobby/index.html');
  assert.match(exp,/id:'military-portal'/);
  assert.match(exp,/type:'military-portal'/);
  assert.match(lobby,/async function enterMilitary\(\)/);
  assert.match(lobby,/state\.scene='military'/);
  assert.match(lobby,/area:'military-agv'/);
  assert.match(lobby,/MILITARY_FAST_TRAVEL/);
  assert.match(lobby,/fillText\('BASE AGV'/);
  assert.match(lobby,/military-return-portal/);
  assert.ok(html.includes('id="teleport-military-now"'));
  assert.match(html,/value="military"/);
});

test('F73 presença/chat/reunir aceitam military-agv e veículos multiplayer seguem Campus-only',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/068_lobby_military_world.sql');
  assert.match(edge,/['"]military-agv['"]/);
  assert.match(edge,/\['campus','vale','rural','military'(?:,'space')?(?:,'moon')?(?:,'mars')?(?:,'parque')?\]/);
  assert.match(edge,/scene==='military'\?'military-agv'/);
  assert.match(edge,/\['vale-silicio','rural-agv','military-agv'(?:,'space-agv')?(?:,'moon-agv')?(?:,'mars-agv')?(?:,'parque-diversoes-agv')?\]\.includes\(presence\.area\)/);
  assert.match(migration,/lobby_presence_area_chk/);
  assert.match(migration,/military-agv/);
});

test('F73 preserva hangar na troca 2D/3D e reunir equipe consegue restaurar interior militar',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/restoreMilitaryInterior=state\.scene==='military'/);
  assert.match(lobby,/enterMilitaryInterior\?\.\(restoreMilitaryInterior\)/);
  assert.match(lobby,/scene==='military'&&String\(target\.interior\)\.startsWith\('military:'\)/);
  assert.match(lobby,/enterMilitaryInterior\?\.\(String\(target\.interior\)\.slice\(9\)\)/);
});

test('F73 conteúdo operacional não implementa mecânicas de combate ou armamento',()=>{
  const world=read('lobby/assets/world/military-world.js'),three=read('lobby/assets/military3d.js'),lite=read('lobby/assets/military-lite.js');
  const source=`${world}\n${three}\n${lite}`;
  for(const forbidden of [/function\s+shoot/i,/weaponSystem/i,/projectileSystem/i,/fireWeapon/i,/ammoCount/i])assert.doesNotMatch(source,forbidden);
  for(const required of ['Logística','Engenharia','Resgate','Pista','Treinamento','Observação'])assert.ok(source.includes(required),required);
});

test('F73 release/cache avançam para 14.10.8.75 stage44 mantendo runtimes militares lazy',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=75);
  assert.match(index,/14\.10\.8\.\d+-stage\d+-[a-z0-9-]+/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/MILITARY_WORLD_ADAPTER/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/military-(?:lite|3d)\.js/);
});

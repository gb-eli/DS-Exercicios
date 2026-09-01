import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f90=${Date.now()}-${Math.random()}`);
const visual=await imp('lobby/assets/render/visual-quality-profile.js');
const perf=await imp('lobby/assets/render/performance-manager.js');
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const sectors=await imp('lobby/assets/world/airdrop-sectors.js');
const sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js'),lobby=read('lobby/assets/lobby.js'),lobby3d=read('lobby/assets/lobby3d.js'),env=read('lobby/assets/world/campus-environment.js'),avatar=read('lobby/assets/characters/avatar-system.js'),village=read('lobby/assets/village3d.js'),modules=read('lobby/assets/campus-module3d.js'),adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js');

test('F90 advances release/cache coherently to 14.10.8.92',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.92'/);
  assert.match(boot,/const VERSION='14\.10\.8\.92'/);assert.match(sw,/const VERSION='14\.10\.8\.92'/);
  assert.match(read('lobby/index.html'),/14\.10\.8\.92-stage61-f90-graphics/);
  assert.match(read('PUBLIC-DEPLOY.json'),/14\.10\.8\.92-stage61-f90-graphics/);
});

test('F90 visual quality profiles scale detail progressively and constrain expensive effects on modest mobile hardware',()=>{
  const low=visual.visualQualityProfile('low',{}),medium=visual.visualQualityProfile('medium',{}),high=visual.visualQualityProfile('high',{}),ultra=visual.visualQualityProfile('ultra',{});
  assert.ok(low.dpr<medium.dpr&&medium.dpr<high.dpr&&high.dpr<ultra.dpr);
  assert.ok(low.vegetation<medium.vegetation&&medium.vegetation<high.vegetation&&high.vegetation<ultra.vegetation);
  assert.equal(low.shadows,false);assert.equal(high.shadows,true);assert.ok(ultra.shadowSize>high.shadowSize);
  const phone=visual.visualQualityProfile('ultra',{mobile:true,hardware:4,cores:4,saveData:false});
  assert.ok(phone.dpr<=1.05);assert.ok(phone.anisotropy<=4);assert.ok(phone.vegetation<ultra.vegetation);
});

test('F90 respects an explicit manual quality request while automatic selection can remain conservative',()=>{
  const constrained={mobile:true,hardware:4,cores:4,saveData:false,constrained:true,lowEnd:true,highEnd:false};
  assert.equal(perf.chooseInitialQuality(constrained,'ultra'),'ultra');
  assert.equal(perf.chooseInitialQuality(constrained,null),'low');
  assert.match(lobby,/data-quality-choice/);assert.match(lobby,/applyQualityChoice/);
});

test('F90 Avatar V2 exposes layered visual detail and quality-aware shadow/LOD updates for all worlds',()=>{
  assert.match(avatar,/avatar-detail-medium/);assert.match(avatar,/avatar-detail-premium/);
  assert.match(avatar,/applyVisualQualityToAvatar/);assert.match(avatar,/currentQuality==='high'\|\|currentQuality==='ultra'/);
  assert.match(avatar,/avatars\.add\(root\)/);assert.match(avatar,/avatars\.delete\(replacement\)/);
  for(const file of ['vale3d.js','rural3d.js','military3d.js','space3d.js','moon3d.js','mars3d.js','parque-diversoes-agv3d.js','museu-hardware3d.js','plugin-world-host.js','airdrop-transit3d.js'])assert.match(read(`lobby/assets/${file}`),/avatar-system\.js\?v=14\.10\.8\.92-f90-graphics/,file);
});

test('F90 Campus facade/roads gain quality layers while repeated lane/street assets use instancing',()=>{
  for(const tier of ['medium','high','ultra'])assert.match(env,new RegExp(`minVisualQuality='${tier}'`));
  assert.match(env,/campus-lane-markings-instanced/);assert.match(env,/new THREE\.InstancedMesh/);assert.match(env,/campus-road-premium-detail/);
  assert.match(env,/solar/);assert.match(env,/facade-detail-high/);assert.match(env,/facade-detail-ultra/);
  assert.match(env,/const setQuality=next=>/);
});

test('F90 Campus applies visual quality immediately without rebuilding the world',()=>{
  assert.match(lobby3d,/visualQualityProfile/);assert.match(lobby3d,/rendererPixelRatio/);
  assert.match(lobby3d,/environment\?\.setQuality\?\.\(quality\)/);
  assert.match(lobby3d,/renderer\.toneMappingExposure=cfg\.visual/);
  assert.match(lobby3d,/renderer\.shadowMap\.enabled=cfg\.shadows/);
});

test('F90 modular Campus and Villages now have real live quality switching',()=>{
  for(const src of [modules,village]){
    assert.match(src,/let quality=chooseInitialQuality/);assert.match(src,/visualQualityProfile/);assert.match(src,/rendererPixelRatio/);
    assert.match(src,/applyVisualQuality\(world,quality\)/);assert.match(src,/avatarSystem\.setQuality\(quality\)/);
    assert.match(src,/renderer\.shadowMap\.enabled=visual\.shadows/);
  }
});

test('F90 cache-busts all modified 3D avatar hosts and runtime-prefetch targets',()=>{
  for(const name of ['lobby3d.js','village3d.js','campus-module3d.js','vale3d.js','rural3d.js','military3d.js','parque-diversoes-agv3d.js'])assert.match(adapter,new RegExp(name.replace('.','\\.')+'\\?v=14\\.10\\.8\\.92-f90-graphics'),name);
  for(const name of ['lobby3d.js','village3d.js','campus-module3d.js','vale3d.js','rural3d.js'])assert.match(prefetch,new RegExp(name.replace('.','\\.')+'\\?v=14\\.10\\.8\\.92-f90-graphics'),name);
  assert.match(read('lobby/assets/colegio-agv-host.js'),/plugin-world-host\.js\?v=14\.10\.8\.92-f90-graphics/);
});

test('F90 keeps 3D runtimes out of the critical shell and pre-caches only the tiny visual profile optionally',()=>{
  const critical=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'',optional=sw.match(/const OPTIONAL_SHELL=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(critical,/\b(?:lobby3d|village3d|campus-module3d|vale3d|rural3d)\.js/);
  assert.match(optional,/visual-quality-profile\.js\?v=14\.10\.8\.92-f90-graphics/);
  assert.match(critical,/avatar-system\.js\?v=14\.10\.8\.92-f90-graphics/);
});

test('F90 preserves current modular topology, airdrop and gameplay/realtime foundations',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);assert.equal(sectors.AIRDROP_SECTORS.length,15);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
  assert.match(lobby,/createRealtimeAvatarSync/);assert.match(adapter,/AIRDROP_TRANSIT_ADAPTER/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const lobby=read('lobby/assets/lobby.js'),sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js'),html=read('lobby/index.html');
const manifests=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/world-manifests.js')).href+`?t=${Date.now()}`);
const registry=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/world-registry.js')).href+`?t=${Date.now()}`);
const connections=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/world-connections.js')).href+`?t=${Date.now()}`);
const adapters=await import(pathToFileURL(path.join(ROOT,'lobby/assets/core/world-adapter.js')).href+`?t=${Date.now()}`);
const globalMap=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/global-map.js')).href+`?t=${Date.now()}`);
const village=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/village-world.js')).href+`?t=${Date.now()}`);

const villageIds=['village-1ds','village-2ds','village-3ds','village-sub'];

test('F86 advances release/cache coherently to 14.10.8.88',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.88'/);
  assert.match(boot,/const VERSION='14\.10\.8\.88'/);assert.match(sw,/const VERSION='14\.10\.8\.88'/);
  assert.match(html,/lobby\.css\?v=14\.10\.8\.88-stage57-f86-villages/);
  assert.match(read('lobby/assets/sw-register.js'),/14\.10\.8\.88-stage57-f86-villages/);
  assert.match(read('lobby/assets/vendor-loader.js'),/stage57-f86-villages/);
});

test('F86 registers four class villages as real worlds and adapters',()=>{
  assert.equal(manifests.WORLD_MANIFESTS.length,15);assert.equal(registry.WORLD_REGISTRY.size,15);assert.equal(adapters.WORLD_ADAPTERS.length,15);
  for(const id of villageIds){const w=registry.WORLD_REGISTRY.get(id),a=adapters.getWorldAdapter(id);assert.ok(w,id);assert.ok(a,id);assert.equal(w.presenceArea,id);assert.equal(w.capabilities.lite,true);assert.equal(w.capabilities.threeD,true);assert.ok(connections.areWorldsConnected('campus-ds',id));}
  assert.equal(connections.WORLD_CONNECTIONS.length,14);
});

test('F86 village bounds and POIs are proportional and independent from Campus attractions',()=>{
  assert.deepEqual(village.VILLAGE_BOUNDS,{minX:-42,maxX:42,minZ:-32,maxZ:32});
  for(const cfg of Object.values(village.VILLAGE_CONFIGS)){assert.equal(cfg.destinations.length,7);assert.equal(cfg.returnPortal.targetWorldId,'campus-ds');assert.ok(cfg.destinations.some(x=>x.kind==='class-house'));assert.ok(cfg.destinations.some(x=>x.kind==='library'));assert.ok(cfg.destinations.some(x=>x.kind==='maker'));}
});

test('F86 routes Campus class gateways and station destinations to modular villages',()=>{
  assert.match(lobby,/class_village_gateway/);assert.match(lobby,/class_village_portal/);assert.match(lobby,/station_village_transfer/);
  assert.match(lobby,/WORLD_REGISTRY\.get\(`village-\$\{z\.key\}`\)/);assert.match(lobby,/WORLD_REGISTRY\.get\(`village-\$\{station\.id\}`\)/);
  assert.match(lobby,/village-return-portal/);assert.match(lobby,/restoreSaved:true/);
});

test('F86 keeps village 3D lazy and Lite/shared metadata in release shell',()=>{
  assert.match(adapters.getWorldAdapter('village-1ds').scene,/village-1ds/);
  const adapterSrc=read('lobby/assets/core/world-adapter.js');assert.match(adapterSrc,/import\('\.\.\/village3d\.js\?v=14\.10\.8\.88-f86-villages'\)/);
  assert.match(sw,/village-lite\.js\?v=14\.10\.8\.88-f86-villages/);assert.match(sw,/world\/village-world\.js\?v=14\.10\.8\.88-f86-villages/);assert.doesNotMatch(sw,/\.\/assets\/village3d\.js/);
  assert.match(boot,/world\/village-world\.js/);assert.match(boot,/village-lite\.js/);
});

test('F86 global 2D map gives each village its own non-overlapping district position',()=>{
  const points=villageIds.map(id=>globalMap.GLOBAL_MAP_LAYOUT.get(id));assert.equal(points.length,4);assert.equal(new Set(points.map(p=>`${p.x}:${p.y}`)).size,4);
  const campus=globalMap.GLOBAL_MAP_LAYOUT.get('campus-ds');for(const p of points)assert.ok(Math.hypot(p.x-campus.x,p.y-campus.y)>=10);
  const snap=globalMap.createGlobalMapSnapshot({});assert.equal(snap.worlds.length,15);for(const id of villageIds)assert.equal(snap.worlds.find(w=>w.id===id)?.category,'education');
});

test('F86 backend migration and lobby-presence accept modular village areas/scenes',()=>{
  const migration=read('core/database/078_lobby_modular_villages.sql'),edge=read('core/edge-functions/lobby-presence/index.ts');
  for(const id of villageIds){assert.match(migration,new RegExp(`'${id}'`));assert.match(edge,new RegExp(`'${id}'`));}
  assert.match(edge,/scene\.startsWith\('village-'\)\?scene/);assert.match(edge,/verifyChat/);assert.match(edge,/verifyGather/);
});

test('F86 village runtime modules are importable as ESM without creating WebGL eagerly',async()=>{
  const lite=await import(pathToFileURL(path.join(ROOT,'lobby/assets/village-lite.js')).href+`?t=${Date.now()}`);
  const three=await import(pathToFileURL(path.join(ROOT,'lobby/assets/village3d.js')).href+`?t=${Date.now()}`);
  assert.equal(typeof lite.createVillageLite,'function');assert.equal(typeof three.createVillage3D,'function');
});

test('F86 preserves F85 performance controls and realtime avatar contract',()=>{
  assert.match(lobby,/createRealtimeAvatarSync/);assert.match(lobby,/openQualityModal/);assert.match(lobby,/qualityPreference/);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);assert.match(read('lobby/assets/game/train-manager.js'),/visualDwell=5,tripDwell=5/);
});

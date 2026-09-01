import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f88=${Date.now()}-${Math.random()}`);
const registry=await imp('lobby/assets/world/world-registry.js');
const navigation=await imp('lobby/assets/world/world-navigation.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const modules=await imp('lobby/assets/world/campus-module-world.js');
const experiences=await imp('lobby/assets/world/campus-experiences.js');
const destinations=await imp('lobby/assets/world/campus-destinations.js');
const sectors=await imp('lobby/assets/world/airdrop-sectors.js');
const prefetch=await imp('lobby/assets/world/world-runtime-prefetch.js');
const globalMap=await imp('lobby/assets/world/global-map.js');
const modularLayout=await imp('lobby/assets/world/campus-modular-layout.js');
const sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js'),lobby=read('lobby/assets/lobby.js'),edge=read('core/edge-functions/lobby-presence/index.ts');
const moduleIds=['campus-library','campus-labs','campus-neon'];

test('F88 advances frontend and cache coherently to 14.10.8.90',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.90'/);
  assert.match(boot,/const VERSION='14\.10\.8\.90'/);assert.match(sw,/const VERSION='14\.10\.8\.90'/);
  assert.match(read('lobby/index.html'),/14\.10\.8\.90-stage59-f88-campus-modules/);
  assert.match(read('lobby/assets/sw-register.js'),/stage59-f88-campus-modules/);
});

test('F88 registry has 18 persistent worlds, 18 adapters and 17 structural connections',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);
  for(const id of moduleIds){assert.ok(registry.WORLD_REGISTRY.get(id),id);assert.ok(registry.WORLD_REGISTRY.areConnected('campus-ds',id),id);assert.ok(navigation.findPortalForTransition('campus-ds',id),id);}
});

test('F88 extracts Library, Labs and Neon as actual standalone Lite/3D modules',async()=>{
  assert.equal(Object.keys(modules.CAMPUS_MODULE_CONFIGS).length,3);
  for(const key of ['library','labs','neon']){const c=modules.campusModuleConfig(key);assert.ok(c);assert.equal(c.id,`campus-${key}`);assert.ok(c.destinations.length>=8);}
  const lite=await imp('lobby/assets/campus-module-lite.js'),three=await imp('lobby/assets/campus-module3d.js');
  assert.equal(typeof lite.createCampusModuleLite,'function');assert.equal(typeof three.createCampusModule3D,'function');
});

test('F88 removes heavy leisure zones and Lab Virtual building from the Campus runtime',()=>{
  const ids=new Set(experiences.CAMPUS_EXPERIENCES.map(x=>x.id));
  for(const removed of ['parkour','pool','playground','slide','lab-virtual'])assert.equal(ids.has(removed),false,removed);
  for(const gateway of ['campus-library-gateway','campus-labs-gateway','campus-neon-gateway'])assert.equal(ids.has(gateway),true,gateway);
  assert.equal(destinations.CAMPUS_DESTINATION_MAP['lab-virtual'],undefined);
  const src=read('lobby/assets/world/campus-experiences.js');assert.doesNotMatch(src,/slide-step-\$\{i\+1\}/);assert.match(src,/Escorregador e parkour foram extraídos/);
});

test('F88 keeps module 3D out of initial cache and enables one-world prefetch for all three modules',()=>{
  assert.doesNotMatch(sw,/campus-module3d\.js/);assert.match(sw,/campus-module-lite\.js\?v=14\.10\.8\.90-f88-campus-modules/);
  assert.match(sw,/campus-module-world\.js\?v=14\.10\.8\.90-f88-campus-modules/);
  for(const id of moduleIds)assert.equal(prefetch.canPrefetchWorld3D(id),true,id);
});

test('F88 airdrop grows to 15 terrestrial sectors and preserves strategic spacing',()=>{
  assert.equal(sectors.AIRDROP_SECTORS.length,15);for(const id of moduleIds)assert.ok(sectors.getAirdropSector(id),id);
  let min=Infinity;for(let i=0;i<sectors.AIRDROP_SECTORS.length;i++)for(let j=i+1;j<sectors.AIRDROP_SECTORS.length;j++){const a=sectors.AIRDROP_SECTORS[i],b=sectors.AIRDROP_SECTORS[j];min=Math.min(min,Math.hypot(a.strategicX-b.strategicX,a.strategicY-b.strategicY));}
  assert.ok(min>=12,`minimum spacing ${min}`);
});

test('F88 global 2D map gives all three Campus modules independent positions',()=>{
  for(const id of moduleIds){const p=globalMap.GLOBAL_MAP_LAYOUT.get(id);assert.ok(p,id);assert.notDeepEqual(p,{x:50,y:50});}
  const snap=globalMap.createGlobalMapSnapshot();assert.equal(snap.worlds.length,18);
});

test('F88 Lobby coordinates, teleport, minimap and interactions understand Campus modules',()=>{
  assert.match(lobby,/CAMPUS_MODULE_CONFIGS/);assert.match(lobby,/campusModuleSceneKey/);assert.match(lobby,/campusModuleWorldToPresence/);assert.match(lobby,/campusModulePresenceToWorld/);
  assert.match(lobby,/module-tool-link/);assert.match(lobby,/campus-module-station/);assert.match(lobby,/campus-module-poi/);assert.match(lobby,/module-gateway/);
  assert.match(lobby,/for\(const module of Object\.values\(CAMPUS_MODULE_CONFIGS\)\)/);
});

test('F88 backend adds migration 079 and accepts module presence/chat/gather scenes',()=>{
  const migration=read('core/database/079_lobby_campus_modules.sql');
  for(const id of moduleIds){assert.match(migration,new RegExp(id));assert.match(edge,new RegExp(id));}
  assert.match(edge,/scene\.startsWith\('campus-'\)\?scene/);
});

test('F88 preserves the F87 lightweight aircraft and F85 realtime/quality foundations',()=>{
  assert.match(read('lobby/assets/core/world-adapter.js'),/AIRDROP_TRANSIT_ADAPTER/);assert.doesNotMatch(sw,/airdrop-transit3d\.js/);
  assert.match(lobby,/openQualityModal/);assert.match(lobby,/createRealtimeAvatarSync/);assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
});


test('F88 2D Campus gives Library, Labs and Neon proportional modular districts and explicit gateways',()=>{
  const ids=new Set(modularLayout.CAMPUS_MODULAR_DISTRICTS.map(item=>item.id));
  for(const id of ['mod-library','mod-labs','mod-neon'])assert.ok(ids.has(id),id);
  const library=modularLayout.CAMPUS_MODULAR_DISTRICTS.find(item=>item.id==='mod-library');
  const labs=modularLayout.CAMPUS_MODULAR_DISTRICTS.find(item=>item.id==='mod-labs');
  const neon=modularLayout.CAMPUS_MODULAR_DISTRICTS.find(item=>item.id==='mod-neon');
  assert.ok(library.w*library.d>=180);assert.ok(labs.w*labs.d>=180);assert.ok(neon.w*neon.d>=300);
  const lite=read('lobby/assets/lobby-lite.js');assert.match(lite,/exp\.type==='module-gateway'/);assert.match(lite,/ENTRAR NO SETOR/);
});

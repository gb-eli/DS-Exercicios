import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f89=${Date.now()}-${Math.random()}`);
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const experiences=await imp('lobby/assets/world/campus-experiences.js');
const budget=await imp('lobby/assets/render/campus-render-budget.js');
const sectors=await imp('lobby/assets/world/airdrop-sectors.js');
const sw=read('lobby/sw.js');
const boot=read('lobby/assets/boot.js');
const lobby=read('lobby/assets/lobby.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const lite=read('lobby/assets/lobby-lite.js');
const env=read('lobby/assets/world/campus-environment.js');
const expSrc=read('lobby/assets/world/campus-experiences.js');

const legacyCampusIds=['parkour','pool','playground','slide','lab-virtual'];

test('F89 advances frontend/cache coherently to 14.10.8.91',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.91'/);
  assert.match(boot,/const VERSION='14\.10\.8\.91'/);
  assert.match(sw,/const VERSION='14\.10\.8\.91'/);
  assert.match(read('lobby/index.html'),/14\.10\.8\.91-stage60-f89-campus-performance/);
  assert.match(read('lobby/assets/sw-register.js'),/stage60-f89-campus-performance/);
});

test('F89 preserves F88 topology: 18 worlds/adapters, 17 connections and 15 terrestrial airdrop sectors',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);
  assert.equal(adapters.WORLD_ADAPTERS.length,18);
  assert.equal(registry.WORLD_REGISTRY.connections.length,17);
  assert.equal(sectors.AIRDROP_SECTORS.length,15);
});

test('F89 physically removes legacy Campus leisure/challenge payload from the hub contract',()=>{
  const ids=new Set(experiences.CAMPUS_EXPERIENCES.map(x=>x.id));
  for(const id of legacyCampusIds)assert.equal(ids.has(id),false,id);
  assert.deepEqual(Object.keys(experiences.CAMPUS_RIDES).sort(),['tower','tower-down']);
  assert.doesNotMatch(expSrc,/LITE_PARKOUR_CHECKPOINTS|PARKOUR_START|PARKOUR_PLATFORMS|parkourPlatformAt/);
  assert.doesNotMatch(lobby3d,/createCheckpointChallenge|LITE_PARKOUR_CHECKPOINTS|PARKOUR_PLATFORMS|coasterTrain/);
  assert.doesNotMatch(lite,/createCheckpointChallenge|LITE_PARKOUR_CHECKPOINTS|PARKOUR_PLATFORMS|CAMPUS_RIDES/);
});

test('F89 transit geometry is lazy, disposable and instanced instead of permanently rendered',()=>{
  assert.match(env,/function ensureActive\(\)/);
  assert.match(env,/function releaseActive\(\)/);
  assert.match(env,/new THREE\.InstancedMesh/);
  assert.match(env,/activeSteel=steel\.clone\(\)/);
  assert.match(env,/activeGlow=glow\.clone\(\)/);
  assert.match(lobby3d,/transit\?\.ensureActive\?\.\(\)/);
  assert.match(lobby3d,/transit\?\.releaseActive\?\.\(\)/);
  assert.match(lite,/train\.isTraveling\(\)/);
});

test('F89 render budget culls distant Campus roots and scales with quality/device constraints',()=>{
  const low=budget.campusRenderBudget('low',{}),medium=budget.campusRenderBudget('medium',{}),ultra=budget.campusRenderBudget('ultra',{});
  assert.ok(low.experienceRadius<medium.experienceRadius);
  assert.ok(medium.buildingRadius<ultra.buildingRadius);
  const constrained=budget.campusRenderBudget('medium',{mobile:true,memory:4,saveData:true});
  assert.ok(constrained.experienceRadius<medium.experienceRadius);
  const roots=[{position:{x:0,z:0},visible:true},{position:{x:200,z:200},visible:true}];
  const result=budget.applyCampusRenderBudget({quality:'low',player:{x:0,z:0},buildingRoots:roots,experienceRoots:[]});
  assert.equal(roots[0].visible,true);assert.equal(roots[1].visible,false);assert.equal(result.visibleBuildings,1);
  assert.match(lobby3d,/applyCampusRenderBudget/);assert.match(lobby3d,/forceFull:securityViewState\.active\|\|viewpointState\.active/);
});

test('F89 removes Campus 3D environment from boot preflight and critical service-worker shell',()=>{
  const required=boot.match(/const requiredAssets=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(required,/campus-environment\.js/);
  const shell=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(shell,/campus-environment\.js/);
  assert.doesNotMatch(shell,/3d\.js/i);
});

test('F89 station modal directly exposes modular Campus sectors without keeping Campus 3D alive',()=>{
  assert.match(lobby,/moduleIds=\['campus-library','campus-labs','campus-neon'\]/);
  assert.match(lobby,/reason:'station_campus_module_transfer'/);
  assert.match(lobby,/Setor modular • abre sem manter o Campus 3D carregado/);
});

test('F89 keeps train boarding dwell at five seconds',()=>{
  const train=read('lobby/assets/game/train-manager.js');
  assert.match(train,/visualDwell=5,tripDwell=5/);
  assert.match(train,/trip\.duration-dwell\*2/);
});

test('F89 keeps F85 realtime/avatar quality and standard movement foundations',()=>{
  assert.match(lobby,/openQualityModal/);
  assert.match(lobby,/createRealtimeAvatarSync/);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
});

test('F89 keeps F87 lightweight airdrop architecture and F88 modular worlds intact',()=>{
  assert.match(read('lobby/assets/core/world-adapter.js'),/AIRDROP_TRANSIT_ADAPTER/);
  assert.doesNotMatch(sw,/airdrop-transit3d\.js/);
  for(const id of ['village-1ds','village-2ds','village-3ds','village-sub','campus-library','campus-labs','campus-neon'])assert.ok(registry.WORLD_REGISTRY.get(id),id);
});

test('F89 Campus experiences now expose gateways/intermodal hub instead of old heavy attractions',()=>{
  const ids=new Set(experiences.CAMPUS_EXPERIENCES.map(x=>x.id));
  for(const id of ['campus-library-gateway','campus-labs-gateway','campus-neon-gateway','coaster','tower'])assert.ok(ids.has(id),id);
  const intermodal=experiences.CAMPUS_EXPERIENCES.find(x=>x.id==='coaster');
  assert.equal(intermodal.name,'Estação Intermodal AGV');
  assert.match(env,/Estação Intermodal|campus-transit-stations|campus-transit-active-trip/);
});

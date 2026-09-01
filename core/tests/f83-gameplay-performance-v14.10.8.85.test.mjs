import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

const gameplay=read('lobby/assets/world/gameplay-settings.js');
const lobby=read('lobby/assets/lobby.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const camera=read('lobby/assets/render/camera-controller.js');
const edge=read('core/edge-functions/lobby-presence/index.ts');
const migration75=read('core/database/075_lobby_runtime_gameplay_settings.sql');
const migration76=read('core/database/076_lobby_spawned_vehicles.sql');
const html=read('lobby/index.html');
const sw=read('lobby/sw.js');
const adapter=read('lobby/assets/core/world-adapter.js');

const movementRuntimes=[
  'lobby/assets/lobby3d.js','lobby/assets/lobby-lite.js','lobby/assets/vale3d.js','lobby/assets/vale-lite.js',
  'lobby/assets/rural3d.js','lobby/assets/rural-lite.js','lobby/assets/military3d.js','lobby/assets/military-lite.js',
  'lobby/assets/space3d.js','lobby/assets/space-lite.js','lobby/assets/moon3d.js','lobby/assets/moon-lite.js',
  'lobby/assets/mars3d.js','lobby/assets/mars-lite.js','lobby/assets/parque-diversoes-agv3d.js','lobby/assets/parque-diversoes-agv-lite.js',
  'lobby/assets/museu-hardware3d.js','lobby/assets/museu-hardware-lite.js','lobby/assets/plugin-world-host.js'
];

test('F83 advances the release/cache coherently to 14.10.8.85',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.85'/);
  assert.match(read('lobby/assets/boot.js'),/VERSION='14\.10\.8\.85'/);
  assert.match(sw,/const VERSION='14\.10\.8\.85'/);
  assert.match(html,/lobby\.css\?v=14\.10\.8\.85-stage53-f83-gameplay-performance/);
  assert.match(sw,/gameplay-settings\.js\?v=14\.10\.8\.85-f83-gameplay/);
});

test('F83 standardizes exterior movement on the Vale reference with bounded staff multiplier',()=>{
  assert.match(gameplay,/walk:16,run:28/);
  assert.match(gameplay,/minMultiplier:\.55,maxMultiplier:2\.25/);
  assert.match(gameplay,/function playerMoveSpeed/);
  for(const file of movementRuntimes){
    const src=read(file);
    assert.match(src,/gameplay-settings\.js\?v=14\.10\.8\.85-f83-gameplay/,`${file} imports shared gameplay settings`);
    assert.match(src,/playerMoveSpeed\(/,`${file} consumes shared player speed`);
  }
  assert.match(edge,/action==='issue_world_movement'/);
  assert.match(edge,/action==='get_world_movement'/);
  assert.match(edge,/multiplier<\.55\|\|multiplier>2\.25/);
  assert.match(migration75,/movement_multiplier numeric\(4,2\) not null default 1\.00/);
  assert.match(migration75,/between 0\.55 and 2\.25/);
});

test('F83 exposes personal FOV, mouse sensitivity, quality preference and remappable controls',()=>{
  assert.match(html,/id="fov-range"/);assert.match(html,/id="mouse-sensitivity-range"/);assert.match(html,/id="quality-preference"/);
  for(const id of ['control-forward','control-back','control-left','control-right','control-run','control-jump','control-interact','control-camera'])assert.match(html,new RegExp(`id="${id}"`));
  assert.match(gameplay,/DEFAULT_CONTROLS/);assert.match(gameplay,/normalizeControlBindings/);assert.match(gameplay,/qualityRequestFromPreference/);
  assert.match(camera,/initialFov=null,initialSensitivity=1/);assert.match(camera,/setFov\(value\)/);assert.match(camera,/setSensitivity\(value\)/);
  assert.match(lobby,/installControlRemapBridge\(\)/);assert.match(lobby,/mouseSensitivity/);assert.match(lobby,/qualityPreference/);
});

test('F83 makes balanced Campus quality materially lighter than high quality',()=>{
  assert.match(lobby3d,/medium:\{pixel:Math\.min\(devicePixelRatio,\.9\),shadows:false,particles:54,shadowSize:768\}/);
  assert.match(lobby3d,/high:\{pixel:Math\.min\(devicePixelRatio,1\.2\),shadows:true,particles:120,shadowSize:1024\}/);
});

test('F83 supports persistent staff-spawned Campus vehicles and their multiplayer sessions',()=>{
  assert.match(html,/id="staff-vehicle-spawn-control"/);assert.match(html,/id="staff-vehicle-spawn-kind"/);
  assert.match(lobby,/async function spawnVehicleHere\(/);assert.match(lobby,/spawnCampusVehicle/);
  assert.match(lobby3d,/function spawnCampusVehicle\(/);
  assert.match(edge,/action==='vehicle_spawn'/);assert.match(edge,/action==='vehicle_spawn_list'/);assert.match(edge,/lobby_spawned_vehicles/);
  assert.match(migration76,/create table if not exists public\.lobby_spawned_vehicles/);
  assert.match(migration76,/seat_capacity/);
  assert.match(edge,/if\(!vehicle&&uuidRx\.test\(vehicleId\)\)/);
});

test('F83 preserves local driving when multiplayer backend is unavailable but blocks real conflicts',()=>{
  assert.match(lobby,/lastVehicleNetworkError\.includes\('vehicle_busy'\)\|\|lastVehicleNetworkError\.includes\('vehicle_not_nearby'\)/);
  assert.match(lobby,/direção local ativada/);
  assert.match(lobby,/servidor multiplayer indisponível/);
});

test('F83 keeps heavy world runtimes lazy in the world adapter',()=>{
  for(const file of ['rural','military','space','moon','mars']){
    assert.match(adapter,new RegExp(`import\\('../${file}(?:-lite|3d)?`),`lazy import remains for ${file}`);
  }
  assert.doesNotMatch(sw,/\.\/assets\/rural3d\.js/);
  assert.doesNotMatch(sw,/\.\/assets\/military3d\.js/);
  assert.doesNotMatch(sw,/\.\/assets\/space3d\.js/);
  assert.doesNotMatch(sw,/\.\/assets\/moon3d\.js/);
  assert.doesNotMatch(sw,/\.\/assets\/mars3d\.js/);
});

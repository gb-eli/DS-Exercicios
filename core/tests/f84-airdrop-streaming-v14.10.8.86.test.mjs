import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const airdropPath=path.join(ROOT,'lobby/assets/world/airdrop-system.js');
const airdrop=await import(pathToFileURL(airdropPath).href+`?test=${Date.now()}`);
const lobby=read('lobby/assets/lobby.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const html=read('lobby/index.html');
const css=read('lobby/assets/lobby.css');
const edge=read('core/edge-functions/lobby-presence/index.ts');
const migration=read('core/database/077_lobby_airdrop_sessions.sql');

const uuid='11111111-1111-4111-8111-111111111111';


test('F84 advances the release/cache chain coherently to 14.10.8.86',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.86'/);
  assert.match(read('lobby/assets/boot.js'),/VERSION='14\.10\.8\.86'/);
  assert.match(read('lobby/sw.js'),/const VERSION='14\.10\.8\.86'/);
  assert.match(html,/lobby\.css\?v=14\.10\.8\.86-stage54-airdrop-streaming/);
  assert.match(read('lobby/assets/core/world-adapter.js'),/lobby3d\.js\?v=14\.10\.8\.86-f84-airdrop-streaming/);
  assert.match(read('lobby/sw.js'),/airdrop-system\.js\?v=14\.10\.8\.86-f84-airdrop/);
});

test('F84 airdrop math has a deterministic 3s lead, flight path and progressive detail levels',()=>{
  const session=airdrop.normalizeAirdropSession({id:uuid,startedAt:10000,altitude:96,flightMs:28000,from_x:-72,from_z:-28,to_x:72,to_z:28});
  const pending=airdrop.sampleAirdropPlane(session,9000),mid=airdrop.sampleAirdropPlane(session,24000),done=airdrop.sampleAirdropPlane(session,39001);
  assert.equal(pending.pending,true);assert.equal(pending.x,-72);assert.equal(mid.progress,.5);assert.equal(done.departed,true);
  assert.equal(airdrop.airdropDetailLevel(96),'overview');assert.equal(airdrop.airdropDetailLevel(50),'district');assert.equal(airdrop.airdropDetailLevel(20),'full');
  assert.equal(airdrop.airdropDescentRate('freefall'),24);assert.equal(airdrop.airdropDescentRate('parachute'),6.8);assert.equal(airdrop.shouldAutoDeploy(24),true);
  assert.deepEqual(airdrop.clampAirdropPosition(80,-80,{worldX:56,worldZ:38,margin:1.2}),{x:54.8,z:-36.8});
});

test('F84 stores synchronized airdrop sessions and vertical presence through migration 077',()=>{
  assert.match(migration,/add column if not exists altitude double precision not null default 0/);
  assert.match(migration,/add column if not exists movement_mode text not null default 'ground'/);
  assert.match(migration,/create table if not exists public\.lobby_airdrop_sessions/);
  assert.match(migration,/movement_mode in \('ground','plane','freefall','parachute'\)/);
  assert.match(edge,/action==='airdrop_start'/);assert.match(edge,/action==='airdrop_active'/);assert.match(edge,/action==='verify_airdrop'/);assert.match(edge,/action==='airdrop_cancel'/);
  assert.match(edge,/movement_mode:movementMode/);assert.match(edge,/altitude:Math\.round\(altitude\*10\)\/10/);
});

test('F84 exposes staff flight controls and player parachute HUD',()=>{
  assert.match(html,/id="staff-airdrop-control"/);assert.match(html,/id="staff-airdrop-start"/);assert.match(html,/id="staff-airdrop-cancel"/);
  assert.match(html,/id="airdrop-hud"/);assert.match(html,/id="airdrop-action"/);assert.match(css,/\.airdrop-hud/);
  assert.match(lobby,/async function startAirdropForAll\(/);assert.match(lobby,/function airdropAction\(/);assert.match(lobby,/verify_airdrop/);
  assert.match(lobby,/movement_mode:state\.airdropState\?\.mode\|\|'ground'/);
});

test('F84 forces synchronized flight into Campus 3D without racing the 2D-first boot',()=>{
  assert.match(lobby,/loadActiveAirdrop\(\{activateRuntime:false\}\)/);
  assert.match(lobby,/if\(state\.airdropSession\)await activateAirdropRuntime\(state\.airdropSession\)/);
  assert.match(lobby,/if\(state\.runtimeMode!=='3d'\)await start3D\(\{allowFallback:false\}\)/);
  assert.match(lobby,/if\(state\.scene!=='campus'\)await returnToCampus\(\)/);
});

test('F84 Campus 3D implements plane, freefall, parachute and automatic deployment',()=>{
  for(const signature of ['airdropTransportPlane','airdropParachuteRig','startAirdropSession','jumpFromAirdrop','deployAirdropParachute','cancelAirdropSession','getAirdropState'])assert.match(lobby3d,new RegExp(signature));
  assert.match(lobby3d,/if\(airdropMode==='freefall'&&shouldAutoDeploy\(airdropAltitude\)\)deployAirdropParachute\(\)/);
  assert.match(lobby3d,/airdropDescentRate\(airdropMode\)/);
  assert.match(lobby3d,/airdrop:getAirdropState\(\)/);
});

test('F84 keeps all participants colocated in the aircraft and tracks remote vertical movement',()=>{
  assert.match(lobby3d,/remoteMode==='plane'&&airdropSession/);
  assert.match(lobby3d,/sampleAirdropPlane\(airdropSession,Date\.now\(\)\)/);
  assert.match(lobby3d,/remoteAltitude=Math\.max\(0,Number\(o\.altitude\)\|\|0\)/);
  assert.match(lobby,/select\('student_id,class_id,display_name,participant_role,x,y,area,altitude,movement_mode/);
});

test('F84 progressively reduces Campus detail while airborne and culls distant experiences on ground',()=>{
  assert.match(lobby3d,/function applyAirdropDetail/);assert.match(lobby3d,/airdropDetailLevel\(airdropAltitude\)/);
  assert.match(lobby3d,/function updateCampusStreaming/);assert.match(lobby3d,/qualityRadius=quality==='low'\?34:quality==='medium'\?42:quality==='high'\?50:58/);
  assert.match(lobby3d,/root\.visible=near/);
});

test('F84 keeps the F83 gameplay/performance foundation active',()=>{
  const gameplay=read('lobby/assets/world/gameplay-settings.js');
  assert.match(gameplay,/walk:16,run:28/);assert.match(gameplay,/minMultiplier:\.55,maxMultiplier:2\.25/);
  assert.match(lobby,/installControlRemapBridge\(\)/);assert.match(lobby,/async function spawnVehicleHere\(/);
  assert.match(lobby3d,/medium:\{pixel:Math\.min\(devicePixelRatio,\.9\),shadows:false,particles:54,shadowSize:768\}/);
  assert.match(edge,/action==='vehicle_spawn'/);assert.match(edge,/action==='issue_world_movement'/);
});

test('F84 releases gameplay realtime channels on logout to avoid accumulating subscriptions',()=>{
  assert.match(lobby,/removeChannel\(worldMovementChannel\)/);
  assert.match(lobby,/removeChannel\(vehicleSpawnChannel\)/);
  assert.match(lobby,/removeChannel\(airdropChannel\)/);
  assert.match(lobby,/airdropReadyPromise=null/);
});

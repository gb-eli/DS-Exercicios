import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLobbyState,snapshotWorldState,LOBBY_STATE_CONTRACT} from '../../lobby/assets/core/lobby-state.js';
import {createWorldManager} from '../../lobby/assets/core/world-manager.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');

test('F63A separa sessão global e estado serializável do mundo sem quebrar aliases legados',()=>{
  const state=createLobbyState({session:{profile:{role:'student'}},world:{scene:'vale',worldId:'vale-silicio'}});
  assert.equal(state.session.profile.role,'student');
  assert.equal(state.profile.role,'student');
  assert.equal(state.world.scene,'vale');
  state.scene='campus';
  assert.equal(state.world.scene,'campus');
  state.graphics={fov:72};
  assert.deepEqual(state.session.graphics,{fov:72});
  assert.ok(LOBBY_STATE_CONTRACT.sessionFields.includes('user'));
  assert.ok(LOBBY_STATE_CONTRACT.worldFields.includes('player'));
  assert.ok(!LOBBY_STATE_CONTRACT.worldFields.includes('user'));
  const snapshot=snapshotWorldState(state.world);
  assert.equal(snapshot.worldId,'vale-silicio');
  assert.equal(snapshot.scene,'campus');
  assert.ok(!('runtime' in snapshot));
});

test('F63A World Manager assume ownership de um runtime e o encerra exatamente uma vez',async()=>{
  const world=createLobbyState().world,events=[];
  let stops=0;
  const runtime={stop(){stops++;},getQuality(){return'medium';}};
  const adapter={id:'campus-ds',scene:'campus',supports:mode=>mode==='lite',createRuntime:async()=>runtime};
  const manager=createWorldManager({worldState:world,onLifecycleEvent:event=>events.push(event.type)});
  const active=await manager.start({adapter,mode:'lite'});
  assert.equal(active,runtime);
  assert.equal(manager.getRuntime(),runtime);
  assert.equal(world.runtimeStatus,'ready');
  assert.equal(world.runtimeMode,'lite');
  assert.equal(manager.diagnostics().adapterId,'campus-ds');
  assert.equal(manager.stop('test'),true);
  assert.equal(stops,1);
  assert.equal(manager.getRuntime(),null);
  assert.equal(world.runtimeStatus,'idle');
  assert.deepEqual(events,['starting','ready','stopping','idle']);
  assert.equal(manager.stop('already-idle'),false);
  assert.equal(stops,1);
});

test('F63A descarta um runtime que terminou de carregar depois de ser cancelado',async()=>{
  const world=createLobbyState().world;
  let resolveRuntime,stops=0;
  const adapter={id:'vale-silicio',scene:'vale',supports:mode=>mode==='3d',createRuntime:()=>new Promise(resolve=>{resolveRuntime=resolve;})};
  const manager=createWorldManager({worldState:world});
  const pending=manager.start({adapter,mode:'3d'});
  manager.stop('superseded');
  resolveRuntime({stop(){stops++;}});
  await assert.rejects(pending,error=>error?.name==='AbortError');
  assert.equal(stops,1);
  assert.equal(manager.getRuntime(),null);
  assert.equal(world.runtimeStatus,'idle');
});

test('F63A estabiliza os bloqueios executáveis encontrados na Fase 0',()=>{
  const lite=read('lobby/assets/lobby-lite.js');
  const three=read('lobby/assets/lobby3d.js');
  assert.match(lite,/import \{[^\n]*CAMPUS_RIDES[^\n]*\} from '\.\/world\/campus-experiences\.js/);
  assert.match(three,/activeToolInterior&&!profile\.reducedMotion/);
  assert.doesNotMatch(three,/activeToolInterior&&!reducedMotion/);
});

test('F63A integra adapters finos sem antecipar Registry, Spawn Manager ou Transition Manager',()=>{
  const lobby=read('lobby/assets/lobby.js');
  const adapter=read('lobby/assets/core/world-adapter.js');
  assert.match(lobby,/createLobbyState/);
  assert.match(lobby,/createWorldManager/);
  assert.match(lobby,/CAMPUS_WORLD_ADAPTER/);
  assert.match(lobby,/VALE_WORLD_ADAPTER/);
  assert.doesNotMatch(lobby,/import \{ createLobby3D \}/);
  assert.match(adapter,/id:'campus-ds'/);
  assert.match(adapter,/id:'vale-silicio'/);
  assert.doesNotMatch(adapter,/WorldRegistry|SpawnManager|TransitionManager/);
});

test('F63A inclui a nova fundação no preflight e no shell do Service Worker',()=>{
  const boot=read('lobby/assets/boot.js');
  const sw=read('lobby/sw.js');
  for(const asset of ['core/lobby-state.js','core/world-manager.js','core/world-adapter.js']){
    assert.ok(boot.includes(asset),`boot sem ${asset}`);
    assert.ok(sw.includes(asset),`service worker sem ${asset}`);
  }
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage[\w-]+/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeWorldRuntime,assertWorldRuntimeV2,WORLD_RUNTIME_CONTRACT_VERSION,WORLD_RUNTIME_LIFECYCLE} from '../../lobby/assets/core/runtime-v2/world-runtime-contract.js';
import {createPlayerLocomotion,locomotionProfileForWorld,LOCOMOTION_CONTRACT_VERSION} from '../../lobby/assets/core/runtime-v2/player-locomotion.js';
import {PLAYER_MOVEMENT,playerMoveSpeed,playerJumpImpulse,playerGravity} from '../../lobby/assets/world/gameplay-settings.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

test('F94.6 exposes Runtime Contract V2 while preserving legacy runtime methods',async()=>{
  const calls=[];
  const raw={value:7,custom(){return this.value;},setQuality(q){this.q=q;return q;},stop(reason){calls.push(['stop',reason]);return true;}};
  const runtime=assertWorldRuntimeV2(normalizeWorldRuntime(raw,{worldId:'campus-ds',scene:'campus',mode:'3d'}));
  assert.equal(runtime.__agvRuntimeContractVersion,WORLD_RUNTIME_CONTRACT_VERSION);
  for(const method of WORLD_RUNTIME_LIFECYCLE)assert.equal(typeof runtime[method],'function',method);
  assert.equal(runtime.custom(),7);
  assert.equal(runtime.setQuality('high'),'high');
  assert.equal(raw.q,'high');
  assert.equal(runtime.runtimeContract.worldId,'campus-ds');
  assert.equal(runtime.runtimeContract.mode,'3d');
  assert.equal(runtime.stop('switch'),true);
  assert.equal(runtime.stop('again'),false);
  assert.deepEqual(calls,[['stop','switch']]);
});

test('F94.6 centralizes horizontal movement for normal, lunar and orbital worlds',()=>{
  assert.equal(LOCOMOTION_CONTRACT_VERSION,2);
  for(const id of ['campus-ds','vale-silicio','rural-agv','moon-agv','space-agv']){
    const p=locomotionProfileForWorld(id);
    assert.equal(p.walk,16,id);
    assert.equal(p.run,28,id);
  }
  assert.equal(PLAYER_MOVEMENT.walk,16);
  assert.equal(PLAYER_MOVEMENT.run,28);
  assert.equal(playerMoveSpeed({worldId:'campus-ds'},{running:false}),16);
  assert.equal(playerMoveSpeed({worldId:'moon-agv'},{running:true}),28);
});

test('F94.6 centralizes jump and gravity with explicit environment profiles',()=>{
  assert.equal(playerJumpImpulse({worldId:'campus-ds'},{worldId:'campus-ds'}),7.8);
  assert.equal(playerGravity({worldId:'campus-ds'},{worldId:'campus-ds'}),20);
  assert.equal(playerGravity({worldId:'moon-agv'},{worldId:'moon-agv'}),5.2);
  assert.equal(playerJumpImpulse({worldId:'space-agv'},{worldId:'space-agv'}),0);
});

test('F94.6 locomotion simulation is fixed-step and frame-rate independent enough for equal elapsed time',()=>{
  const a=createPlayerLocomotion({worldId:'campus-ds'}),b=createPlayerLocomotion({worldId:'campus-ds'});
  a.setInput(0,-1,{running:true});b.setInput(0,-1,{running:true});
  let az=0,bz=0;
  for(let i=0;i<60;i++)az+=a.step(1/60).z;
  for(let i=0;i<30;i++)bz+=b.step(1/30).z;
  assert.ok(Math.abs(az-bz)<0.8,`${az} vs ${bz}`);
  assert.ok(Math.abs(az)>10);
});

test('F94.6 world manager normalizes every runtime through Contract V2',()=>{
  const manager=read('lobby/assets/core/world-manager.js');
  assert.match(manager,/normalizeWorldRuntime/);
  assert.match(manager,/assertWorldRuntimeV2/);
  assert.match(manager,/createWorldContext/);
  assert.match(manager,/runtime-v2\/world-runtime-contract\.js\?v=14\.10\.8\.96-f946-runtime-v2/);
});

test('F94.6 migrates priority 3D worlds away from duplicated earth jump/gravity constants',()=>{
  const files=['lobby3d.js','village3d.js','campus-module3d.js','vale3d.js','rural3d.js','military3d.js','parque-diversoes-agv3d.js','museu-hardware3d.js','plugin-world-host.js'];
  for(const name of files){
    const src=read(`lobby/assets/${name}`);
    assert.match(src,/playerJumpImpulse/,_=>name);
    assert.match(src,/playerGravity/,_=>name);
    assert.match(src,/gameplay-settings\.js\?v=14\.10\.8\.96-f946-runtime-v2/,_=>name);
  }
});

test('F94.6 keeps parkour enhanced jump as an explicit game mechanic, not a world movement constant',()=>{
  const src=read('lobby/assets/parque-diversoes-agv3d.js');
  assert.match(src,/parkour\.snapshot\(\)\.active\?10\.8:playerJumpImpulse/);
});

test('F94.6 advances the shell cache chain and precaches required Runtime V2 modules',()=>{
  const sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js'),index=read('lobby/index.html');
  assert.match(sw,/stage68-f946-runtime-v2/);
  assert.match(index,/stage68-f946-runtime-v2/);
  for(const mod of ['world-runtime-contract.js','world-context.js','player-locomotion.js','runtime-lifecycle.js'])assert.match(sw,new RegExp(mod.replace('.','\\.')));
  assert.match(boot,/core\/runtime-v2\/world-runtime-contract\.js/);
  assert.match(boot,/world\/gameplay-settings\.js/);
});

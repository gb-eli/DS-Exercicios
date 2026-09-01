import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { WORLD_REGISTRY } from '../../lobby/assets/world/world-registry.js';
import { WORLD_PORTALS, getWorldPortal, findPortalForTransition, resolveWorldTransition, validateWorldNavigation } from '../../lobby/assets/world/world-navigation.js';
import { WORLD_ADAPTERS, getWorldAdapter } from '../../lobby/assets/core/world-adapter.js';
import { createWorldManager } from '../../lobby/assets/core/world-manager.js';

const root=path.resolve(import.meta.dirname,'../..');

test('O5 exposes one runtime adapter for every registered world',()=>{
  assert.equal(WORLD_ADAPTERS.length,WORLD_REGISTRY.size);
  for(const world of WORLD_REGISTRY.manifests){
    const adapter=getWorldAdapter(world.id);
    assert.ok(adapter,world.id);assert.equal(adapter.id,world.id);assert.equal(adapter.scene,world.scene);
    assert.equal(getWorldAdapter(world.scene),adapter);
  }
});

test('O5 normalizes every inter-world portal and validates its graph edge',()=>{
  assert.equal(WORLD_PORTALS.length,17);
  assert.equal(validateWorldNavigation(),true);
  for(const portal of WORLD_PORTALS){
    assert.ok(WORLD_REGISTRY.areConnected(portal.sourceWorldId,portal.targetWorldId),portal.key);
    assert.ok(Number.isFinite(portal.x)&&Number.isFinite(portal.z),portal.key);
  }
});

test('O5 resolves physical Campus and orbital routes by canonical portal',()=>{
  const vale=getWorldPortal('campus','vale-portal');
  assert.equal(vale?.targetWorldId,'vale-silicio');
  assert.equal(findPortalForTransition('campus-ds','space-agv')?.id,'space-portal');
  const moon=resolveWorldTransition({from:'space',portal:'space-moon-transfer',requireConnection:true});
  assert.equal(moon.source.id,'space-agv');assert.equal(moon.target.id,'moon-agv');assert.equal(moon.portal.id,'space-moon-transfer');
});

test('O5 keeps administrative teleport direct while physical routes respect graph connectivity',()=>{
  const direct=resolveWorldTransition({from:'moon',to:'museu',requireConnection:false,reason:'teleport_scene_switch'});
  assert.equal(direct.target.id,'museu-hardware-agv');assert.equal(direct.connected,false);
  assert.throws(()=>resolveWorldTransition({from:'moon',to:'museu',requireConnection:true}),/world_navigation_not_connected/);
});

test('O5 WorldManager owns transition planning without starting a runtime',()=>{
  const worldState={worldId:'campus-ds',scene:'campus',runtimeMode:'lite',runtimeStatus:'idle',runtimeRevision:0,player:{x:800,y:500,area:'central'}};
  const events=[];const manager=createWorldManager({worldState,onLifecycleEvent:event=>events.push(event)});
  const plan=manager.planTransition({from:'campus',portal:'rural-portal',requireConnection:true,reason:'portal_interaction'});
  assert.equal(plan.target.id,'rural-agv');assert.equal(manager.isActive(),false);
  assert.equal(manager.diagnostics().lastTransition?.to,'rural-agv');
  assert.ok(events.some(event=>event.type==='transition-planned'));
});

test('O5 Lobby consumes generic navigation instead of a scene-to-adapter conditional',()=>{
  const lobby=fs.readFileSync(path.join(root,'lobby/assets/lobby.js'),'utf8');
  assert.match(lobby,/getWorldAdapter\(state\.scene\)/);
  assert.match(lobby,/worldManager\.planTransition/);
  assert.match(lobby,/activateWorldPortal\(obj\)/);
  assert.match(lobby,/requireConnection:false,reason:fromGather\?'staff_gather_scene_switch':'teleport_scene_switch'/);
  assert.doesNotMatch(lobby,/const currentWorldAdapter=\(\)=>state\.scene==='vale'/);
});

test('O5 does not touch protected Chat/Presence migration surfaces',()=>{
  const lobby=fs.readFileSync(path.join(root,'lobby/assets/lobby.js'),'utf8');
  assert.match(lobby,/createProximityChat/);assert.match(lobby,/lobby-presence/);
  assert.ok(fs.existsSync(path.join(root,'core/database/073_lobby_new_worlds.sql')));
  assert.ok(fs.existsSync(path.join(root,'core/edge-functions/lobby-presence/index.ts')));
});

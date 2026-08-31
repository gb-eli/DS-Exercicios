import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('F68 define semáforos, fases e zonas de velocidade sem banco novo',async()=>{
  const mod=await import('../../lobby/assets/world/campus-mobility-systems.js');
  assert.ok(mod.CAMPUS_TRAFFIC_SIGNALS.length>=8);
  assert.equal(mod.resolveCampusSpeedLimit(0,0).limitKmh,20);
  assert.equal(mod.resolveCampusSpeedLimit(0,-30).limitKmh,30);
  assert.equal(mod.resolveCampusSpeedLimit(50,30).limitKmh,40);
  const ns=mod.CAMPUS_TRAFFIC_SIGNALS.find(s=>s.phaseGroup==='ns');
  const ew=mod.CAMPUS_TRAFFIC_SIGNALS.find(s=>s.phaseGroup==='ew');
  assert.equal(mod.resolveTrafficSignalState(ns,1000).state,'green');
  assert.equal(mod.resolveTrafficSignalState(ew,1000).state,'red');
  assert.equal(mod.resolveTrafficSignalState(ns,11000).state,'red');
  assert.equal(mod.resolveTrafficSignalState(ew,11000).state,'green');
});

test('F68 tráfego automático passa a ter progresso próprio e respeitar bloqueios',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/progress:def\.offset/);
  assert.match(runtime,/resolveTrafficSignalState\(entry\.def,signalNow\)/);
  assert.match(runtime,/entry\.blocked=!!\(red\|\|hit\)/);
  assert.match(runtime,/dynamicVehicleHit\(next\.x,next\.z,entry\.def\.kind/);
});

test('F68 direção manual aplica limite local, semáforo e colisão dinâmica',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/road=resolveCampusSpeedLimit\(self\.position\.x,self\.position\.z\)/);
  assert.match(runtime,/trafficBrake=!!\(signal&&signal\.state!=='green'/);
  assert.match(runtime,/maxKmh=Math\.min\(profileMaxKmh,road\.limitKmh\)/);
  assert.match(runtime,/dynamicVehicleHit\(nx,nz,activeCampusVehicle\.kind/);
});

test('F68 recupera o veículo para último ponto seguro após colisão',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/function rememberSafeVehiclePose/);
  assert.match(runtime,/function recoverVehicleFromCollision/);
  assert.match(runtime,/lastSafeVehiclePose/);
  assert.match(runtime,/veículo reposicionado em segurança/);
});

test('F68 semáforos possuem representação visual no Campus 3D',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/function campusTrafficSignal/);
  assert.match(runtime,/const trafficSignals=CAMPUS_TRAFFIC_SIGNALS\.map/);
  assert.match(runtime,/lamp\.material\.emissiveIntensity=active\?3\.8/);
});

test('F68 HUD mostra limite e estado do semáforo sem handler inline',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),css=read('lobby/assets/lobby.css');
  for(const id of ['vehicle-limit','vehicle-signal'])assert.ok(html.includes(`id="${id}"`));
  assert.match(lobby,/signal\.dataset\.signal=state/);
  assert.match(css,/vehicle-road-status/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F68 permanece incluída em releases 14.10.8.70 ou posteriores',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);
  assert.ok(patch(config)>=70);
  assert.ok(patch(boot)>=70);
  assert.ok(patch(sw)>=70);
});

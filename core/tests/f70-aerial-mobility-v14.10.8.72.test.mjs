import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F70 define helipontos, drone e helicóptero com perfis de voo',async()=>{
  const mod=await import('../../lobby/assets/world/aerial-mobility.js');
  assert.ok(mod.CAMPUS_HELIPADS.length>=3);
  assert.ok(mod.CAMPUS_AERIAL_VEHICLES.some(v=>v.kind==='drone'));
  assert.ok(mod.CAMPUS_AERIAL_VEHICLES.some(v=>v.kind==='helicopter'));
  assert.ok(mod.CAMPUS_AERIAL_VEHICLES.every(v=>v.mobilityType==='aerial'&&v.maxAltitude>0&&v.climbRate>0));
  const heli=mod.CAMPUS_AERIAL_VEHICLES.find(v=>v.kind==='helicopter');
  assert.ok(mod.aerialSpeedKmh(heli,'sport')>mod.aerialSpeedKmh(heli,'tour'));
});

test('F70 reconhece zonas seguras de pouso',async()=>{
  const mod=await import('../../lobby/assets/world/aerial-mobility.js');
  const pad=mod.CAMPUS_HELIPADS[0];
  assert.equal(mod.isCampusHelipadLanding(pad.x,pad.z),true);
  assert.equal(mod.isCampusHelipadLanding(0,0),false);
  assert.equal(mod.nearestCampusHelipad(pad.x+.2,pad.z+.2)?.id,pad.id);
});

test('F70 runtime cria helipontos, aeronaves, rotores e colisão por altitude',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  for(const token of ['function campusHelipad','function animateAerialRotors','function aerialClearanceAt','function canAerialOccupy',"mobilityType==='aerial'",'CAMPUS_AERIAL_VEHICLES'])assert.ok(runtime.includes(token),token);
  assert.match(runtime,/vehicleAltitude/);
  assert.match(runtime,/vehicleVerticalSpeed/);
  assert.match(runtime,/maxAltitude/);
});

test('F70 controles usam espaço para subir, shift para descer e suporte mobile',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/keys\.has\('Space'\)\|\|vehicleClimbHeld/);
  assert.match(runtime,/keys\.has\('ShiftLeft'\).*vehicleDescendHeld/);
  assert.match(runtime,/vehicleClimbHeld=true/);
  assert.match(runtime,/vehicleDescendHeld=true/);
});

test('F70 HUD e configurações exibem altitude e câmera aérea sem inline handlers',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),css=read('lobby/assets/lobby.css');
  for(const id of ['vehicle-altitude','vehicle-max-altitude','vehicle-flight-state','vehicle-help-copy'])assert.ok(html.includes(`id="${id}"`));
  assert.match(html,/data-camera-mode="aerial"/);
  assert.match(lobby,/Piloto • voo manual/);
  assert.match(lobby,/SUBIR/);
  assert.match(lobby,/DESCER/);
  assert.match(css,/vehicle-air-status/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F70 mantém voo fora do multiplayer terrestre e exige pouso para sair',()=>{
  const lobby=read('lobby/assets/lobby.js');
  const aerialBranch=lobby.indexOf("if(meta.aerial)");
  const networkStart=lobby.indexOf('startNetworkDriver(ref)',aerialBranch);
  assert.ok(aerialBranch>=0&&networkStart>aerialBranch);
  assert.match(lobby,/button\.disabled=meta\.aerial&&passenger/);
  assert.match(lobby,/activeVehicle\.mobilityType==='aerial'&&activeVehicle\.canExit===false/);
  assert.match(lobby,/CAMPUS_HELIPADS/);
  assert.match(lobby,/CAMPUS_AERIAL_VEHICLES/);
});

test('F70 release e cache incluem mobilidade aérea em 14.10.8.72+',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js');
  assert.ok(patch(config)>=72);assert.ok(patch(boot)>=72);assert.ok(patch(sw)>=72);assert.ok(patch(adapter)>=72);
  assert.match(boot,/world\/aerial-mobility\.js/);
  assert.match(sw,/world\/aerial-mobility\.js\?v=14\.10\.8\.72-stage41-aerial/);
  assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.\d+-stage\d+-/);
});

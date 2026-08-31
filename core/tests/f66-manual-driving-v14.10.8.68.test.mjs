import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('F66 oferece motorista manual e carona automática sem misturar os dois fluxos',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/manualDriving=activeCampusVehicle\?\.seatMode==='driver'/);
  assert.match(runtime,/const throttle=clamp/);
  assert.match(runtime,/const nx=self\.position\.x\+Math\.sin\(vehicleHeading\)\*vehicleSpeed\*dt/);
  assert.match(runtime,/canVehicleStand\(nx,nz,activeCampusVehicle\.kind\)/);
  assert.match(runtime,/activeCampusVehicle&&!manualDriving/);
  assert.match(runtime,/driver=activeCampusVehicle\.seatMode==='driver'/);
  assert.match(runtime,/let gear=.*driver\?/);
});

test('F66 publica velocímetro e comandos de condução na UI',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),css=read('lobby/assets/lobby.css');
  for(const id of ['vehicle-dashboard','vehicle-speed','vehicle-gear','vehicle-drive-mode','vehicle-controls-hint'])assert.ok(html.includes(`id="${id}"`));
  assert.match(lobby,/W\/S acelerar\/frear/);
  assert.match(lobby,/A\/D virar/);
  assert.match(lobby,/vehicle-speed/);
  assert.match(lobby,/vehicle-gear/);
  assert.match(css,/\.vehicle-dashboard/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F66 mantém seleção de modo e velocidade nos veículos utilizáveis',()=>{
  const html=read('lobby/index.html'),mobility=read('lobby/assets/world/campus-mobility-systems.js');
  assert.match(html,/data-vehicle-seat="driver"/);
  assert.match(html,/data-vehicle-seat="passenger"/);
  assert.match(html,/data-vehicle-speed="tour"/);
  assert.match(html,/data-vehicle-speed="normal"/);
  assert.match(html,/data-vehicle-speed="sport"/);
  assert.match(mobility,/seatCapacity:8/);
});

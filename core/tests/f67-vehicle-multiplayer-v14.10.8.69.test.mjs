import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('F67 cria estado de veículo multiplayer com escrita somente pelo backend',()=>{
  const sql=read('core/database/066_lobby_vehicle_multiplayer.sql');
  assert.match(sql,/create table if not exists public\.lobby_vehicle_sessions/);
  assert.match(sql,/create table if not exists public\.lobby_vehicle_passengers/);
  assert.match(sql,/revoke all on public\.lobby_vehicle_sessions from anon, authenticated/);
  assert.match(sql,/grant select on public\.lobby_vehicle_sessions to authenticated/);
  assert.match(sql,/alter publication supabase_realtime add table public\.lobby_vehicle_sessions/);
  assert.match(sql,/unique\(driver_id, seat_index\)/);
});

test('F67 Edge Function valida motorista, assentos e atualizações de posição',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts');
  for(const action of ['vehicle_start','vehicle_update','vehicle_join','vehicle_leave'])assert.ok(edge.includes(`action==='${action}'`));
  assert.match(edge,/vehicle_not_nearby/);
  assert.match(edge,/vehicle_busy/);
  assert.match(edge,/vehicle_full/);
  assert.match(edge,/lobby_vehicle_state_jump/);
  assert.match(edge,/realtimeVehicleAction\?240:40/);
});

test('F67 cliente usa Realtime incremental e reconciliação periódica',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/agv-lobby-vehicles-v69/);
  assert.match(lobby,/handleVehicleSessionRealtime/);
  assert.match(lobby,/handleVehiclePassengerRealtime/);
  assert.match(lobby,/loadVehicleNetwork\(\{silent:true\}\)/);
  assert.match(lobby,/action:'vehicle_update'/);
  assert.match(lobby,/action:'vehicle_join'/);
  assert.match(lobby,/onVehicleTelemetry:pushVehicleTelemetry/);
});

test('F67 renderiza veículos remotos, ocupantes sentados e embarque por proximidade',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/const remoteVehicles=new Map/);
  assert.match(runtime,/function occupantPlacement/);
  assert.match(runtime,/function occupantForUser/);
  assert.match(runtime,/localAction='sit'/);
  assert.match(runtime,/type:'campus-network-vehicle'/);
  assert.match(runtime,/attachNetworkPassenger/);
  assert.match(runtime,/detachNetworkPassenger/);
  assert.match(runtime,/onVehicleTelemetry\?\./);
});

test('F67 UI oferece modal de carona multiplayer sem handler inline',()=>{
  const html=read('lobby/index.html');
  for(const id of ['vehicle-join-modal','vehicle-join-title','vehicle-join-driver','vehicle-join-occupancy','vehicle-join-start'])assert.ok(html.includes(`id="${id}"`));
  assert.match(html,/Carona multiplayer/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F67 permanece incluída em releases 14.10.8.69 ou posteriores',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);
  assert.ok(patch(config)>=69);
  assert.ok(patch(boot)>=69);
  assert.ok(patch(sw)>=69);
});

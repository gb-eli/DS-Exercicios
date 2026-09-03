import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const imp=rel=>import(pathToFileURL(path.join(root,rel)).href+`?f9412=${Math.random()}`);
const contract=await imp('lobby/assets/core/vehicle-v2/vehicle-contract.js');
const {createVehicleController}=await imp('lobby/assets/core/vehicle-v2/vehicle-controller.js');
const {createKinematicVehiclePhysicsAdapter,createRapierVehiclePhysicsAdapter}=await imp('lobby/assets/core/vehicle-v2/vehicle-physics-adapter.js');
const {createVehicleRegistry}=await imp('lobby/assets/core/vehicle-v2/vehicle-registry.js');
const {vehicleNetworkPacket,interpolateVehiclePacket,VEHICLE_NETWORK_PROTOCOL_VERSION}=await imp('lobby/assets/core/vehicle-v2/vehicle-network-protocol.js');
const {normalizeWorldRuntime,runtimeCapabilities}=await imp('lobby/assets/core/runtime-v2/world-runtime-contract.js');

const simulate=(hz,seconds=3)=>{
  const c=createVehicleController({worldId:'test',definition:{id:'car',kind:'car',maxSpeedKmh:36}});
  c.enter({role:'driver',pose:{x:0,y:0,z:0,heading:0}});
  const dt=1/hz;for(let t=0;t<seconds-1e-9;t+=dt)c.step(dt,{throttle:1,steer:0});
  return c.snapshot();
};

test('Vehicle Contract V2 normaliza classes terrestres, rover e aéreas',()=>{
  const car=contract.normalizeVehicleDefinition({id:'c',kind:'car'}),bus=contract.normalizeVehicleDefinition({id:'b',kind:'bus'}),bike=contract.normalizeVehicleDefinition({id:'v',kind:'bike'}),rover=contract.normalizeVehicleDefinition({id:'r',kind:'rover'}),heli=contract.normalizeVehicleDefinition({id:'h',kind:'helicopter'}),drone=contract.normalizeVehicleDefinition({id:'d',kind:'drone'});
  assert.equal(contract.VEHICLE_CORE_VERSION,2);assert.equal(car.mobilityType,'ground');assert.equal(rover.mobilityType,'ground');assert.equal(heli.mobilityType,'aerial');assert.equal(drone.mobilityType,'aerial');assert.ok(bus.seatCapacity>car.seatCapacity);assert.ok(bike.collisionRadius<bus.collisionRadius);assert.ok(heli.maxAltitude>0&&drone.climbRate>0);
});

test('Vehicle Controller mantém aceleração e distância consistentes em 30/60/120 Hz',()=>{
  const a=simulate(30),b=simulate(60),c=simulate(120);for(const v of [a,b,c])assert.ok(v.speedKmh>25&&v.speedKmh<=36.1);
  assert.ok(Math.abs(a.z-b.z)<.25,`${a.z} ${b.z}`);assert.ok(Math.abs(b.z-c.z)<.25,`${b.z} ${c.z}`);assert.ok(Math.abs(a.speed-b.speed)<.08);
});

test('Vehicle Controller aplica freio, ré e esterço pelo mesmo núcleo',()=>{
  const c=createVehicleController({worldId:'x',definition:{id:'car',kind:'car',maxSpeedKmh:40}});c.enter({role:'driver',pose:{heading:0}});for(let i=0;i<90;i++)c.step(1/60,{throttle:1,steer:.7});const moving=c.snapshot();assert.ok(moving.speed>0);assert.notEqual(moving.heading,0);for(let i=0;i<60;i++)c.step(1/60,{brake:true});assert.ok(Math.abs(c.snapshot().speed)<.05);for(let i=0;i<80;i++)c.step(1/60,{throttle:-1});assert.ok(c.snapshot().speed<0);
});

test('Vehicle Controller aéreo controla subida e respeita altitude máxima',()=>{
  const c=createVehicleController({worldId:'air',definition:{id:'drone',kind:'drone',maxAltitude:12,climbRate:6}});c.enter({role:'driver',pose:{x:0,y:0,z:0,heading:0}});for(let i=0;i<240;i++)c.step(1/60,{throttle:.5,climb:1});const s=c.snapshot();assert.equal(s.phase,'flying');assert.ok(s.y<=12&&s.y>10);assert.equal(s.mobilityType,'aerial');assert.equal(c.exit('land'),true);assert.equal(c.snapshot().occupied,false);
});

test('Kinematic Physics Adapter bloqueia colisão sem mover pose',()=>{
  const physics=createKinematicVehiclePhysicsAdapter({canMoveGround:({to})=>to.z<1});const c=createVehicleController({worldId:'col',definition:{id:'x',kind:'car',acceleration:20,maxSpeedKmh:40},physicsAdapter:physics});c.enter({role:'driver',pose:{z:.9}});for(let i=0;i<30;i++)c.step(1/60,{throttle:1});const s=c.snapshot();assert.ok(s.z<1);assert.equal(s.speed,0);assert.equal(s.collision?.type,'blocked');
});

test('Rapier Adapter é opcional e faz fallback kinematic sem dependência instalada',()=>{
  const fallback=createKinematicVehiclePhysicsAdapter(),rapier=createRapierVehiclePhysicsAdapter({RAPIER:null,world:null,body:null,fallback});const d=rapier.diagnostics();assert.equal(d.adapter,'rapier');assert.equal(d.available,false);assert.equal(d.fallback,true);const moved=rapier.moveGround({to:{x:1,y:0,z:2,heading:0}});assert.equal(moved.ok,true);assert.equal(moved.pose.z,2);
});

test('Vehicle Registry indexa terrestre/aéreo e gera diagnóstico',()=>{
  const r=createVehicleRegistry([{id:'a',kind:'car'},{id:'b',kind:'bus'},{id:'c',kind:'helicopter'}]);assert.equal(r.get('a').kind,'car');const d=r.diagnostics();assert.equal(d.count,3);assert.equal(d.ground,2);assert.equal(d.aerial,1);assert.ok(d.kinds.includes('helicopter'));
});

test('Vehicle Network Protocol V2 gera pacote comum e interpola heading curto',()=>{
  const a=vehicleNetworkPacket({id:'v',worldId:'campus-ds',kind:'car',x:0,z:0,heading:3.1,speedKmh:10},{driverId:'u',seq:1,t:100}),b=vehicleNetworkPacket({id:'v',worldId:'campus-ds',kind:'car',x:10,z:4,heading:-3.1,speedKmh:20},{driverId:'u',seq:2,t:200}),m=interpolateVehiclePacket(a,b,.5);assert.equal(a.v,VEHICLE_NETWORK_PROTOCOL_VERSION);assert.equal(a.driverId,'u');assert.equal(m.x,5);assert.equal(m.z,2);assert.ok(Math.abs(Math.abs(m.heading)-Math.PI)<.08);
});

test('Campus 3D usa Vehicle Core mantendo regras de trânsito, aéreo e multiplayer',()=>{
  const s=read('lobby/assets/lobby3d.js');for(const token of ['createVehicleController','createVehicleRegistry','vehicleNetworkPacket','vehicleCore.step','resolveCampusSpeedLimit','resolveTrafficSignalState','CAMPUS_AERIAL_VEHICLES','attachNetworkPassenger','getVehiclePhysicsDiagnostics'])assert.match(s,new RegExp(token.replaceAll('.','\\.')));assert.match(s,/enterVehicle:useCampusVehicle/);assert.match(s,/exitVehicle:cancelCampusVehicle/);
});

test('Campus 2D oferece veículos terrestres e aéreos pelo mesmo Vehicle Core',()=>{
  const s=read('lobby/assets/lobby-lite.js');assert.match(s,/CAMPUS_AERIAL_VEHICLES/);assert.match(s,/createVehicleController/);assert.match(s,/vehicleCore\.step/);assert.match(s,/mobilityType==='aerial'/);assert.match(s,/enterVehicle:useCampusVehicle/);assert.match(s,/getVehiclePhysicsDiagnostics/);
});

test('Rovers Lua e Marte 2D/3D usam Vehicle Core e abandonam deslocamento direto antigo',()=>{
  for(const rel of ['lobby/assets/moon-lite.js','lobby/assets/moon3d.js','lobby/assets/mars-lite.js','lobby/assets/mars3d.js']){const s=read(rel);assert.match(s,/createVehicleController/);assert.match(s,/roverCore\.step/);assert.match(s,/getVehicleState/);}
  assert.doesNotMatch(read('lobby/assets/moon-lite.js'),/dx=ix\*31\*dt/);assert.doesNotMatch(read('lobby/assets/mars-lite.js'),/dx=ix\*34\*dt/);
});

test('Runtime Contract V2 expõe enter/exit/getVehicleState sem quebrar runtime legado',()=>{
  const raw={stop(){return true;},enterVehicle(ref){return {entered:ref};},exitVehicle(){return 'out';},getVehicleState(){return {id:'v'};}};const rt=normalizeWorldRuntime(raw,{worldId:'x',scene:'x',mode:'3d'});assert.equal(runtimeCapabilities(raw).vehicle,true);assert.deepEqual(rt.enterVehicle('v'),{entered:'v'});assert.equal(rt.exitVehicle(),'out');assert.equal(rt.getVehicleState().id,'v');assert.equal(rt.stop(),true);
});

test('cache F94.12 e adapters apontam para Vehicle Core novo',()=>{
  const sw=read('lobby/sw.js'),html=read('lobby/index.html'),boot=read('lobby/assets/boot.js'),adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js'),lobby=read('lobby/assets/lobby.js');assert.match(sw,/stage75-f9412-vehicle-core/);assert.match(html,/stage75-f9412-vehicle-core/);for(const f of ['vehicle-contract.js','vehicle-controller.js','vehicle-physics-adapter.js','vehicle-registry.js','vehicle-network-protocol.js']){assert.match(sw,new RegExp(f.replaceAll('.','\\.')));assert.match(boot,new RegExp(f.replaceAll('.','\\.')));}assert.match(adapter,/lobby-lite\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);assert.match(adapter,/moon-lite\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);assert.match(adapter,/mars3d\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);assert.match(prefetch,/moon3d\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);assert.match(lobby,/world-adapter\.js\?v=14\.10\.8\.96-f9412-vehicle-core/);
});

test('Vehicle Core V2 é frontend puro e não adiciona Supabase/Edge Functions',()=>{
  for(const rel of ['lobby/assets/core/vehicle-v2/vehicle-contract.js','lobby/assets/core/vehicle-v2/vehicle-controller.js','lobby/assets/core/vehicle-v2/vehicle-physics-adapter.js','lobby/assets/core/vehicle-v2/vehicle-registry.js','lobby/assets/core/vehicle-v2/vehicle-network-protocol.js'])assert.doesNotMatch(read(rel),/supabase|service_role|edge-functions|iresvqw/i,rel);
});

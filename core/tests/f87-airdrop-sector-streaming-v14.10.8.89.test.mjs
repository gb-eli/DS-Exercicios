import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const html=read('lobby/index.html'),css=read('lobby/assets/lobby.css'),lobby=read('lobby/assets/lobby.js'),sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js');
const sectors=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/airdrop-sectors.js')).href+`?t=${Date.now()}`);
const registry=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/world-registry.js')).href+`?t=${Date.now()}`);
const adapters=await import(pathToFileURL(path.join(ROOT,'lobby/assets/core/world-adapter.js')).href+`?t=${Date.now()}`);
const prefetch=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/world-runtime-prefetch.js')).href+`?t=${Date.now()}`);
const airdrop=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/airdrop-system.js')).href+`?t=${Date.now()}`);

const ground=['campus-ds','village-1ds','village-2ds','village-3ds','village-sub','vale-silicio','rural-agv','military-agv','parque-diversoes-agv','colegio-agv','labirinto-armadilhas','museu-hardware-agv'];

test('F87 advances release/cache coherently to 14.10.8.89',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.89'/);
  assert.match(boot,/const VERSION='14\.10\.8\.89'/);assert.match(sw,/const VERSION='14\.10\.8\.89'/);
  assert.match(html,/lobby\.css\?v=14\.10\.8\.89-stage58-f87-airdrop-sectors/);
  assert.match(read('lobby/assets/sw-register.js'),/14\.10\.8\.89-stage58-f87-airdrop-sectors/);
  assert.match(read('lobby/assets/vendor-loader.js'),/stage58-f87-airdrop-sectors/);
});

test('F87 exposes 12 terrestrial drop sectors while keeping orbital worlds out of atmospheric airdrop',()=>{
  assert.equal(sectors.AIRDROP_SECTORS.length,12);assert.deepEqual(sectors.AIRDROP_GROUND_WORLD_IDS,[...ground]);
  assert.deepEqual(sectors.AIRDROP_EXCLUDED_WORLD_IDS,['space-agv','moon-agv','mars-agv']);
  for(const id of ground){const s=sectors.getAirdropSector(id);assert.ok(s,id);assert.ok(registry.WORLD_REGISTRY.get(id),id);assert.ok(s.bounds.maxX>s.bounds.minX);assert.ok(s.bounds.maxZ>s.bounds.minZ);}
});

test('F87 strategic 2D drop layout is spatially separated and proportionally readable',()=>{
  const pts=sectors.AIRDROP_SECTORS.map(s=>({id:s.worldId,x:s.strategicX,y:s.strategicY}));
  assert.equal(new Set(pts.map(p=>`${p.x}:${p.y}`)).size,pts.length);
  let min=Infinity;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)min=Math.min(min,Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y));
  assert.ok(min>=12,`minimum strategic spacing ${min}`);
  assert.match(html,/id="airdrop-map-modal"/);assert.match(html,/id="airdrop-map-nodes"/);assert.match(css,/\.airdrop-sector-node/);
});

test('F87 uses a transient 3D adapter without registering another persistent world',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,15);assert.equal(adapters.WORLD_ADAPTERS.length,15);
  assert.ok(adapters.AIRDROP_TRANSIT_ADAPTER.supports('3d'));assert.equal(adapters.AIRDROP_TRANSIT_ADAPTER.id,'campus-ds');assert.equal(adapters.AIRDROP_TRANSIT_ADAPTER.scene,'campus');
  const source=read('lobby/assets/core/world-adapter.js');assert.match(source,/airdrop-transit3d\.js\?v=14\.10\.8\.89-f87-airdrop-sectors/);
});

test('F87 aircraft itself runs on the lightweight transient runtime before any destination 3D is loaded',()=>{
  const transit=read('lobby/assets/airdrop-transit3d.js');
  assert.match(lobby,/worldManager\.stop\('airdrop_plane_start'\)/);assert.match(lobby,/initialMode:'plane'/);assert.match(lobby,/Carregando somente o avião e o mapa estratégico 2D/);
  assert.match(transit,/sampleAirdropPlane/);assert.match(transit,/mode==='plane'/);assert.match(transit,/planeRoot\.visible=true/);
  assert.doesNotMatch(sw,/airdrop-transit3d\.js/);assert.doesNotMatch(sw,/lobby3d\.js/);
});

test('F87 unloads Campus at jump and loads only the selected destination at landing',()=>{
  assert.match(lobby,/worldManager\.stop\('airdrop_sector_jump'\)/);assert.match(lobby,/AIRDROP_TRANSIT_ADAPTER/);assert.match(lobby,/airdrop_sector_landing/);
  assert.match(lobby,/somente \$\{sector\.shortName\} será preparado/);assert.match(lobby,/startAirdropTransit/);assert.match(lobby,/finishSectorAirdropLanding/);
  const transit=read('lobby/assets/airdrop-transit3d.js');assert.match(transit,/prefetchWorld3D\(sector\.worldId\)/);assert.match(transit,/altitude>AIRDROP_CONFIG\.prefetchAltitude/);assert.match(transit,/onLanded/);
});

test('F87 prefetch registry covers every atmospheric drop world but is not part of critical initial shell',()=>{
  for(const id of ground)assert.equal(prefetch.canPrefetchWorld3D(id),true,id);
  assert.doesNotMatch(sw,/airdrop-transit3d\.js/);assert.doesNotMatch(sw,/world-runtime-prefetch\.js/);assert.doesNotMatch(sw,/museu-hardware3d\.js/);
  assert.match(sw,/airdrop-sectors\.js\?v=14\.10\.8\.89-f87-airdrop-sectors/);
});

test('F87 progressive detail thresholds are explicit and preserve automatic parachute deployment',()=>{
  assert.equal(airdrop.airdropDetailLevel(90),'overview');assert.equal(airdrop.airdropDetailLevel(50),'district');assert.equal(airdrop.airdropDetailLevel(20),'full');
  assert.equal(airdrop.AIRDROP_CONFIG.prefetchAltitude,56);assert.equal(airdrop.shouldAutoDeploy(23),true);assert.equal(airdrop.shouldAutoDeploy(30),false);
});

test('F87 shares selected airdrop target and local descent coordinates through fast avatar realtime',()=>{
  const rt=read('lobby/assets/social/realtime-avatar-sync.js');assert.match(rt,/airdropTargetWorldId/);assert.match(rt,/airdropX/);assert.match(rt,/airdropZ/);assert.match(rt,/airdrop_target_world_id/);
  assert.match(lobby,/airdropTargetWorldId:airborne/);assert.match(read('lobby/assets/airdrop-transit3d.js'),/peer\.airdrop_target_world_id/);
});

test('F87 keeps F86 modular villages and F85 performance/quality foundations',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,15);for(const id of ['village-1ds','village-2ds','village-3ds','village-sub'])assert.ok(registry.WORLD_REGISTRY.get(id));
  assert.match(lobby,/openQualityModal/);assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);assert.match(read('lobby/assets/game/train-manager.js'),/visualDwell=5,tripDwell=5/);
});

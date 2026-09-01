import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F78 catálogo de exploração profunda define quatro missões científicas',async()=>{
  const mod=await import('../../lobby/assets/world/deep-space-exploration.js');
  assert.deepEqual(mod.DEEP_SPACE_MISSIONS.map(m=>m.id),['jupiter','saturn','asteroids','telescope']);
  assert.equal(mod.getDeepSpaceMission('jupiter')?.kind,'flyby');
  assert.equal(mod.getDeepSpaceMission('asteroids')?.kind,'navigation');
  assert.equal(mod.getDeepSpaceMission('telescope')?.kind,'telescope');
  assert.ok(mod.SPACE_TELESCOPE.x!==mod.DEEP_SPACE_CONSOLE.x);
  assert.equal(mod.DEEP_SPACE_SCAN_GOAL,3);
});

test('F78 Sistema Solar marca Júpiter e Saturno como observáveis sem transformá-los em destinos de pouso',()=>{
  const solar=read('lobby/assets/world/solar-system.js');
  assert.match(solar,/id:'jupiter'[\s\S]*observable:true[\s\S]*observationMission:'jupiter'/);
  assert.match(solar,/id:'saturn'[\s\S]*observable:true[\s\S]*observationMission:'saturn'/);
  assert.doesNotMatch(solar,/id:'jupiter'[\s\S]{0,220}destination:'jupiter'/);
  assert.doesNotMatch(solar,/id:'saturn'[\s\S]{0,220}destination:'saturn'/);
});

test('F78 Estação Orbital adiciona Central de Exploração e Telescópio ao fast travel e às interações',()=>{
  const world=read('lobby/assets/world/space-world.js');
  assert.match(world,/DEEP_SPACE_CONSOLE,SPACE_TELESCOPE/);
  assert.match(world,/id:'deep-space'/);
  assert.match(world,/id:'space-telescope'/);
  assert.match(world,/SPACE_RETURN_PORTAL,SPACE_MOON_PORTAL,SPACE_MARS_PORTAL,INTERPLANETARY_CONSOLE,DEEP_SPACE_CONSOLE,SPACE_TELESCOPE/);
});

test('F78 runtime orbital 3D materializa console e telescópio mantendo um único renderer da Estação',()=>{
  const three=read('lobby/assets/space3d.js');
  assert.match(three,/deep-space-hologram-f78/);
  assert.match(three,/EXPLORAÇÃO PROFUNDA/);
  assert.match(three,/TELESCÓPIO ESPACIAL/);
  assert.match(three,/DEEP_SPACE_CONSOLE/);
  assert.match(three,/SPACE_TELESCOPE/);
  assert.equal((three.match(/new THREE\.WebGLRenderer/g)||[]).length,1);
});

test('F78 mapa orbital 2D representa Exploração Profunda e Telescópio',()=>{
  const lite=read('lobby/assets/space-lite.js');
  assert.match(lite,/DEEP_SPACE_CONSOLE/);
  assert.match(lite,/SPACE_TELESCOPE/);
  assert.match(lite,/EXPLORAÇÃO/);
  assert.match(lite,/TELESCÓPIO/);
});

test('F78 interface contém seletor de missões e simulador acessível com telemetria',()=>{
  const html=read('lobby/index.html'),css=read('lobby/assets/lobby.css');
  for(const id of ['deep-space-modal','deep-space-mission-list','deep-space-start','deep-space-exploration','deep-space-canvas','deep-space-telemetry-target','deep-space-telemetry-speed','deep-space-telemetry-zoom','deep-space-telemetry-scan','deep-space-scan','deep-space-exit'])assert.ok(html.includes(`id="${id}"`));
  assert.match(css,/\.deep-space-exploration/);
  assert.match(css,/\.deep-space-telemetry/);
  assert.match(css,/\.solar-body\[data-observable="true"\]/);
  assert.match(html,/data-deep-space-key="forward"/);
  assert.match(css,/\.deep-space-flight-pad/);
});

test('F78 lobby abre missões por console, telescópio e planetas observáveis e carrega runtime de forma dinâmica',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/obj\.type==='space-deep-exploration-console'/);
  assert.match(lobby,/obj\.type==='space-telescope'/);
  assert.match(lobby,/body\.observationMission/);
  assert.match(lobby,/async function startDeepSpaceMission\(\)/);
  assert.match(lobby,/import\('\.\/deep-space-runtime\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+'\)/);
  assert.match(lobby,/state\.runtime\?\.setInputLocked\?\.\(true\)/);
  assert.match(lobby,/closeDeepSpaceMission/);
});

test('F78 simulador implementa sondas, navegação em asteroides, scans e telescópio sem backend',()=>{
  const runtime=read('lobby/assets/deep-space-runtime.js');
  assert.match(runtime,/createDeepSpaceRuntime/);
  assert.match(runtime,/addJupiter/);
  assert.match(runtime,/addSaturn/);
  assert.match(runtime,/addAsteroids/);
  assert.match(runtime,/TELESCOPE_TARGETS/);
  assert.match(runtime,/KeyW/);
  assert.match(runtime,/KeyA/);
  assert.match(runtime,/Space/);
  assert.match(runtime,/scanCount/);
  assert.match(runtime,/collision/);
  assert.match(runtime,/setVirtualControl/);
  assert.match(runtime,/virtual\.forward/);
  assert.equal((runtime.match(/new THREE\.WebGLRenderer/g)||[]).length,1);
  assert.doesNotMatch(runtime,/supabase|fetch\(|functions\.invoke|from\('/i);
});

test('F78 continua sem migration/área nova e mantém runtime de exploração fora do shell crítico',()=>{
  assert.equal(fs.existsSync(path.join(root,'core/database/072_lobby_deep_space.sql')),false);
  const edge=read('core/edge-functions/lobby-presence/index.ts'),sw=read('lobby/sw.js');
  assert.doesNotMatch(edge,/deep-space-agv|jupiter-agv|saturn-agv|asteroid-agv/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/deep-space-runtime\.js|moon-lite\.js|moon3d\.js|mars-lite\.js|mars3d\.js/);
});

test('F78 permanece incluída em releases 14.10.8.80 ou posteriores',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=80);
  assert.ok(patch(index)>=80);
  assert.match(sw,/stage\d+-[a-z0-9-]+/);
  assert.match(adapter,/space3d\.js\?v=14\.10\.8\.\d+-stage\d+-[a-z0-9-]+/);
});

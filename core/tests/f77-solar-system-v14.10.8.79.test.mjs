import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F77 catálogo solar define corpos, Lua/Marte, cinturão e fases de viagem',async()=>{
  const mod=await import('../../lobby/assets/world/solar-system.js');
  assert.ok(mod.SOLAR_SYSTEM_BODIES.length>=10);
  assert.ok(mod.SOLAR_SYSTEM_BODIES.some(body=>body.id==='sun'));
  assert.ok(mod.SOLAR_SYSTEM_BODIES.some(body=>body.id==='earth'));
  assert.deepEqual(mod.SOLAR_DESTINATIONS.map(item=>item.id),['moon','mars']);
  assert.equal(mod.INTERPLANETARY_CONSOLE.type,'space-interplanetary-console');
  assert.ok(mod.ASTEROID_BELT.count>=30);
  assert.ok(mod.SOLAR_TRAVEL_PHASES.length>=5);
  assert.equal(mod.getSolarDestination('moon')?.scene,'moon');
  assert.equal(mod.getSolarDestination('mars')?.scene,'mars');
});

test('F77 Estação Orbital incorpora Central Interplanetária no mapa e fast travel',()=>{
  const world=read('lobby/assets/world/space-world.js');
  assert.match(world,/INTERPLANETARY_CONSOLE/);
  assert.match(world,/Central Interplanetária AGV/);
  assert.match(world,/id:'interplanetary'/);
  assert.match(world,/SPACE_RETURN_PORTAL,SPACE_MOON_PORTAL,SPACE_MARS_PORTAL,INTERPLANETARY_CONSOLE/);
});

test('F77 runtime orbital 3D renderiza holograma solar e cinturão sem criar outro renderer',()=>{
  const three=read('lobby/assets/space3d.js');
  assert.match(three,/solar-system-hologram-f77/);
  assert.match(three,/SOLAR_SYSTEM_BODIES/);
  assert.match(three,/asteroid-belt-f77/);
  assert.match(three,/CENTRAL INTERPLANETÁRIA/);
  assert.match(three,/setInputLocked/);
  assert.equal((three.match(/new THREE\.WebGLRenderer/g)||[]).length,1);
});

test('F77 mapa orbital 2D mostra Sistema Solar e suporta bloqueio de input durante viagem',()=>{
  const lite=read('lobby/assets/space-lite.js');
  assert.match(lite,/SOLAR_SYSTEM_BODIES/);
  assert.match(lite,/SISTEMA SOLAR/);
  assert.match(lite,/ASTEROID_BELT/);
  assert.match(lite,/setInputLocked/);
});

test('F77 interface possui Central Interplanetária, seleção visual e overlay de viagem acessível',()=>{
  const html=read('lobby/index.html'),css=read('lobby/assets/lobby.css');
  for(const id of ['solar-system-modal','solar-system-orbits','solar-destination-list','solar-travel-start','interplanetary-travel','interplanetary-progress-bar','interplanetary-travel-skip'])assert.ok(html.includes(`id="${id}"`));
  assert.match(html,/Órbitas ilustrativas/);
  assert.match(html,/escala visual comprimida/i);
  assert.match(css,/\.solar-system-layout/);
  assert.match(css,/\.solar-system-orbits/);
  assert.match(css,/\.interplanetary-travel/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('F77 Lua e Marte passam pela mesma Central e animação chama mundos existentes',()=>{
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/obj\.type==='space-interplanetary-console'/);
  assert.match(lobby,/obj\.type==='moon-portal'\)\{openSolarSystemModal\('moon'\)/);
  assert.match(lobby,/obj\.type==='mars-portal'\)\{openSolarSystemModal\('mars'\)/);
  assert.match(lobby,/async function startInterplanetaryTravel\(\)/);
  assert.match(lobby,/playInterplanetaryTravel\(destination\)/);
  assert.match(lobby,/destination\.scene==='moon'\)await enterMoon\(\)/);
  assert.match(lobby,/destination\.scene==='mars'\)await enterMars\(\)/);
  assert.match(lobby,/skipInterplanetaryTravel/);
});

test('F77 informa distâncias reais de referência e deixa explícita a compressão didática',()=>{
  const solar=read('lobby/assets/world/solar-system.js'),html=read('lobby/index.html');
  assert.match(solar,/384\.400 km/);
  assert.match(solar,/54,6 a 401 milhões km/);
  assert.match(solar,/Tempo visual comprimido/);
  assert.match(html,/não simula tempos astronômicos reais/i);
});

test('F77 não cria nova área de presença nem migration; reutiliza space moon mars',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts');
  assert.match(edge,/space-agv/);
  assert.match(edge,/moon-agv/);
  assert.match(edge,/mars-agv/);
  assert.doesNotMatch(edge,/solar-agv|interplanetary-agv/);
  assert.equal(fs.existsSync(path.join(root,'core/database/072_lobby_solar_system.sql')),false);
});

test('F77 release/cache avançam para 14.10.8.79 stage48 sem colocar mundos pesados no shell crítico',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  for(const text of [config,boot,sw,adapter,index])assert.ok(patch(text)>=79);
  assert.match(index,/14\.10\.8\.79-stage48-solar-system/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage48-solar-system/);
  assert.match(adapter,/mars3d\.js\?v=14\.10\.8\.79-stage48-solar-system/);
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));
  assert.doesNotMatch(critical,/space-lite\.js|space3d\.js|moon-lite\.js|moon3d\.js|mars-lite\.js|mars3d\.js/);
});

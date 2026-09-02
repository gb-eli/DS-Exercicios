import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f92=${Date.now()}-${Math.random()}`);
const mission=await imp('lobby/assets/render/mission-world-quality.js');
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const military=read('lobby/assets/military3d.js'),space=read('lobby/assets/space3d.js'),moon=read('lobby/assets/moon3d.js'),mars=read('lobby/assets/mars3d.js');
const adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js'),sw=read('lobby/sw.js');

test('F92 advances release and cache coherently to 14.10.8.94',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.94'/);
  assert.match(read('lobby/assets/boot.js'),/const VERSION='14\.10\.8\.94'/);
  assert.match(sw,/const VERSION='14\.10\.8\.94'/);
  assert.match(sw,/stage63-f92-mission-graphics/);
  assert.match(read('PUBLIC-DEPLOY.json'),/14\.10\.8\.94-stage63-f92-mission-graphics/);
});

test('F92 mission profile scales distance, surface, particles, materials and hardware limits',()=>{
  const low=mission.missionWorldQualityProfile('low',{},'mars-agv'),med=mission.missionWorldQualityProfile('medium',{},'mars-agv'),high=mission.missionWorldQualityProfile('high',{},'mars-agv'),ultra=mission.missionWorldQualityProfile('ultra',{},'mars-agv');
  assert.ok(low.objectDistance<med.objectDistance&&med.objectDistance<high.objectDistance&&high.objectDistance<ultra.objectDistance);
  assert.ok(low.surfaceDetail<med.surfaceDetail&&med.surfaceDetail<high.surfaceDetail&&high.surfaceDetail<=ultra.surfaceDetail);
  assert.ok(low.particleBudget<med.particleBudget&&med.particleBudget<high.particleBudget&&high.particleBudget<=ultra.particleBudget);
  assert.equal(low.premiumDistance,0);assert.equal(med.premiumDistance,0);assert.ok(high.premiumDistance>0&&ultra.premiumDistance>high.premiumDistance);
  assert.equal(mission.missionWorldQualityProfile('ultra',{},'space-agv').shadows,false);
  const phone=mission.missionWorldQualityProfile('ultra',{mobile:true,hardware:4,cores:4},'moon-agv');assert.ok(phone.dpr<=1.05);assert.equal(phone.shadows,false);
});

test('F92 Base de Operacoes instantiates perimeter and runway repetition with live military LOD',()=>{
  assert.match(military,/military-perimeter-fence-instanced-f92/);assert.match(military,/military-runway-markings-instanced-f92/);assert.match(military,/military-runway-lights-instanced-f92/);
  assert.match(military,/militaryBuildingEntries/);assert.match(military,/military-building-medium-/);assert.match(military,/military-building-premium-/);
  assert.match(military,/applyMilitaryQuality/);assert.match(military,/updateMilitaryLOD/);assert.match(military,/applyMissionRendererQuality/);
  assert.match(military,/weatherEffects\?\.setQuality\?\.\(quality\)/);assert.match(military,/avatarSystem\.setQuality\(quality\)/);
});

test('F92 orbital runtime applies material, star, asteroid, light and module budgets live',()=>{
  assert.match(space,/applySpaceQuality/);assert.match(space,/spaceModuleEntries/);assert.match(space,/space-module-medium-/);assert.match(space,/space-module-premium-/);
  assert.match(space,/starGeo\.setDrawRange/);assert.match(space,/asteroidGeo\.setDrawRange/);assert.match(space,/cupolaDome\.material\.transmission/);
  assert.match(space,/space-solar-array-grid-instanced-f92/);assert.match(space,/solarArrayDetails/);assert.match(space,/solarOrbits/);assert.match(space,/solarGlow\.intensity/);assert.match(space,/avatarSystem\.setQuality\(quality\)/);
});

test('F92 Moon replaces repeated craters and rocks with instancing and progressive base detail',()=>{
  assert.match(moon,/moon-crater-bowls-instanced-f92/);assert.match(moon,/moon-crater-rims-instanced-f92/);assert.match(moon,/moon-rocks-instanced-f92/);
  assert.match(moon,/moonModuleEntries/);assert.match(moon,/moon-module-medium-/);assert.match(moon,/moon-module-premium-/);
  assert.match(moon,/applyMoonQuality/);assert.match(moon,/moonRocks\.count=missionCount/);assert.match(moon,/starGeo\.setDrawRange/);assert.match(moon,/avatarSystem\.setQuality\(quality\)/);
});

test('F92 Mars instances terrain repetition and binds dust storm cost to the quality budget',()=>{
  assert.match(mars,/mars-crater-bowls-instanced-f92/);assert.match(mars,/mars-crater-rims-instanced-f92/);assert.match(mars,/mars-rocks-instanced-f92/);
  assert.match(mars,/marsModuleEntries/);assert.match(mars,/mars-module-medium-/);assert.match(mars,/mars-module-premium-/);
  assert.match(mars,/dustGeo\.setDrawRange/);assert.match(mars,/missionVisual\.particleBudget/);assert.match(mars,/missionVisual\.weatherBudget/);assert.match(mars,/applyMarsQuality/);
});

test('F92 preserves dynamic atmosphere ownership while applying visual offsets and world-specific lighting',()=>{
  assert.match(military,/visualExposureOffset/);assert.match(military,/day\*\.34\+visualExposureOffset/);
  assert.match(space,/visualExposureOffset/);assert.match(space,/\*0\.12\+visualExposureOffset/);
  assert.match(moon,/mission-world-quality\.js/);assert.match(mars,/mission-world-quality\.js/);
  for(const source of [military,space,moon,mars])assert.match(source,/emissiveBoost/);
});

test('F92 cache-busts all mission runtimes and makes them prefetchable without eager loading',()=>{
  for(const [world,file] of [['military-agv','military3d.js'],['space-agv','space3d.js'],['moon-agv','moon3d.js'],['mars-agv','mars3d.js']]){
    const rx=new RegExp(file.replace('.','\\.')+'\\?v=14\\.10\\.8\\.94-f92-mission-graphics');assert.match(adapter,rx,file);assert.match(prefetch,new RegExp(`'${world}':\\(\\)=>import\\('\\.\\./${rx.source}`),world);
  }
});

test('F92 keeps mission runtimes and helper outside the critical Service Worker shell',()=>{
  const critical=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(critical,/\b(?:military3d|space3d|moon3d|mars3d)\.js/);
  assert.doesNotMatch(critical,/mission-world-quality\.js/);
});

test('F92 preserves world topology, gameplay speed and importability of all mission runtimes',async()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
  const modules=await Promise.all(['military3d.js','space3d.js','moon3d.js','mars3d.js'].map(file=>imp(`lobby/assets/${file}`)));
  for(const [index,name] of ['createMilitary3D','createSpace3D','createMoon3D','createMars3D'].entries())assert.equal(typeof modules[index][name],'function',name);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f93=${Date.now()}-${Math.random()}`);
const special=await imp('lobby/assets/render/special-world-quality.js');
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const park=read('lobby/assets/parque-diversoes-agv3d.js'),museum=read('lobby/assets/museu-hardware3d.js'),school=read('lobby/assets/colegio-agv3d.js'),schoolEnvironment=read('lobby/assets/world/colegio-agv-environment.js'),schoolPerformance=read('lobby/assets/world/colegio-agv-performance.js'),maze=read('lobby/assets/labirinto-armadilhas3d.js'),pluginHost=read('lobby/assets/plugin-world-host.js');
const adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js'),sw=read('lobby/sw.js');

test('F93 advances release and cache coherently to 14.10.8.95',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.95'/);
  assert.match(read('lobby/assets/boot.js'),/const VERSION='14\.10\.8\.95'/);
  assert.match(sw,/const VERSION='14\.10\.8\.95'/);assert.match(sw,/stage64-f93-special-graphics/);
  assert.match(read('PUBLIC-DEPLOY.json'),/14\.10\.8\.95-stage64-f93-special-graphics/);
});

test('F93 specialized profile scales distance, decor, light, media and hardware limits',()=>{
  const low=special.specialWorldQualityProfile('low',{},'museu-hardware'),medium=special.specialWorldQualityProfile('medium',{},'museu-hardware'),high=special.specialWorldQualityProfile('high',{},'museu-hardware'),ultra=special.specialWorldQualityProfile('ultra',{},'museu-hardware');
  assert.ok(low.distance<medium.distance&&medium.distance<high.distance&&high.distance<ultra.distance);
  assert.ok(low.decor<medium.decor&&medium.decor<high.decor&&high.decor<=ultra.decor);
  assert.ok(low.lightBudget<medium.lightBudget&&medium.lightBudget<high.lightBudget&&high.lightBudget<=ultra.lightBudget);
  assert.equal(low.mediaTier,0);assert.equal(medium.mediaTier,1);assert.equal(high.mediaTier,2);assert.equal(ultra.materialTier,3);assert.equal(high.physicalMaterials,true);
  const phone=special.specialWorldQualityProfile('ultra',{mobile:true,hardware:4,cores:4},'colegio-agv');assert.ok(phone.dpr<=1.05);assert.equal(phone.shadows,false);assert.ok(phone.decor<ultra.decor);
  assert.equal(special.specialCount(0,.5,1),0);assert.equal(special.specialCount(10,.5,2),5);
});

test('F93 Parque instances structural repetition and applies its contract live',()=>{
  for(const marker of ['parque-coaster-supports-instanced-f93','parque-race-curbs-instanced-f93','parque-slide-towers-instanced-f93','parque-slide-braces-instanced-f93','parque-spectator-seats-instanced-f93'])assert.match(park,new RegExp(marker));
  assert.match(park,/applySpecialRendererQuality/);assert.match(park,/specialVisual\.weatherBudget/);assert.match(park,/specialVisual\.visitorBudget/);assert.match(park,/specialVisual\.emissiveBoost/);assert.match(park,/specialVisual\.toneExposure-1\.1/);
  assert.match(park,/createParqueAdaptiveQualityController/);assert.match(park,/avatarSystem\.setQuality\(quality\)/);
});

test('F93 Museu instances its floor grid and budgets media, materials, labels and lights',()=>{
  assert.match(museum,/museum-floor-grid-instanced-f93/);assert.match(museum,/applySpecialRendererQuality/);assert.match(museum,/visual\.mediaTier/);assert.match(museum,/visual\.physicalMaterials/);assert.match(museum,/visual\.labelDistance/);assert.match(museum,/specialCount\(galleryLights\.length/);assert.match(museum,/specialDistanceVisible/);assert.match(museum,/avatarSystem\.setQuality\(quality\)/);
});

test('F93 Colegio instances exterior repetition and supports Low through Ultra live',()=>{
  for(const marker of ['light-instanced-f93','dark-instanced-f93','colegio-trees-trunks-instanced-f93','colegio-trees-crowns-instanced-f93','colegio-shrubs-instanced-f93','colegio-fences-instanced-f93','colegio-gates-instanced-f93','colegio-court-markings-instanced-f93'])assert.match(schoolEnvironment,new RegExp(marker));
  assert.match(schoolEnvironment,/specialWorldQualityProfile/);assert.match(schoolEnvironment,/function setQuality/);assert.match(school,/exterior\?\.setQuality/);assert.match(school,/setQuality\(value\)/);assert.match(schoolPerformance,/ultra: Object\.freeze/);assert.match(schoolPerformance,/function setQuality/);
});

test('F93 Labirinto instances walls and plates while preserving active trap gameplay',()=>{
  assert.match(maze,/labirinto-walls-instanced-f93/);assert.match(maze,/labirinto-pressure-plates-instanced-f93/);assert.match(maze,/labirinto-wall-caps-instanced-f93/);assert.match(maze,/applyLabyrinthQuality/);assert.match(maze,/isTrapActive\(trap,t\)/);assert.match(maze,/challenge\.update\(pos,t\)/);assert.match(maze,/setQuality:applyLabyrinthQuality/);
});

test('F93 plugin host propagates selector changes into hosted specialized runtimes',()=>{
  assert.match(pluginHost,/applySpecialRendererQuality/);assert.match(pluginHost,/plugin\?\.setQuality\?\.\(quality\)/);assert.match(pluginHost,/specialVisual\.dpr/);assert.match(pluginHost,/bridged\.getPerformanceProfile/);
});

test('F93 cache-busts and prefetches all four specialized worlds without eager runtime loading',()=>{
  const pairs=[['parque-diversoes-agv','parque-diversoes-agv3d.js'],['colegio-agv','colegio-agv-host.js'],['labirinto-armadilhas','labirinto-armadilhas-host.js'],['museu-hardware-agv','museu-hardware3d.js']];
  for(const [world,file] of pairs){const escaped=file.replaceAll('.','\\.');assert.match(adapter,new RegExp(`${escaped}\\?v=14\\.10\\.8\\.95-f93-special-graphics`),file);assert.match(prefetch,new RegExp(`'${world}':\\(\\)=>import\\('\\.\\./${escaped}\\?v=14\\.10\\.8\\.95-f93-special-graphics`),world);}
});

test('F93 keeps specialized 3D runtimes and helper outside the critical Service Worker shell',()=>{
  const critical=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(critical,/\b(?:parque-diversoes-agv3d|colegio-agv3d|labirinto-armadilhas3d|museu-hardware3d)\.js/);
  assert.doesNotMatch(critical,/special-world-quality\.js/);
});

test('F93 preserves topology, gameplay settings and importability of specialized runtimes',async()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
  const modules=await Promise.all(['parque-diversoes-agv3d.js','museu-hardware3d.js','colegio-agv3d.js','labirinto-armadilhas3d.js'].map(file=>imp(`lobby/assets/${file}`)));
  for(const [index,name] of ['createParqueDiversoes3D','createMuseuHardware3D','createColegioAgv3D','createLabirintoArmadilhas3D'].entries())assert.equal(typeof modules[index][name],'function',name);
});

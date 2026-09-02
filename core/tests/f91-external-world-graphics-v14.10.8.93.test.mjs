import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(ROOT,p)).href+`?f91=${Date.now()}-${Math.random()}`);
const external=await imp('lobby/assets/render/external-world-quality.js');
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const sectors=await imp('lobby/assets/world/airdrop-sectors.js');
const vale=read('lobby/assets/vale3d.js'),rural=read('lobby/assets/rural3d.js'),adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js'),sw=read('lobby/sw.js');

test('F91 advances release/cache coherently to 14.10.8.93',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.93'/);
  assert.match(read('lobby/assets/boot.js'),/const VERSION='14\.10\.8\.93'/);
  assert.match(sw,/const VERSION='14\.10\.8\.93'/);
  assert.match(sw,/stage62-f91-external-graphics/);
  assert.match(read('PUBLIC-DEPLOY.json'),/14\.10\.8\.93-stage62-f91-external-graphics/);
});

test('F91 external quality profile scales distance, vegetation and premium detail progressively',()=>{
  const low=external.externalWorldQualityProfile('low',{},'rural-agv'),med=external.externalWorldQualityProfile('medium',{},'rural-agv'),high=external.externalWorldQualityProfile('high',{},'rural-agv'),ultra=external.externalWorldQualityProfile('ultra',{},'rural-agv');
  assert.ok(low.objectDistance<med.objectDistance&&med.objectDistance<high.objectDistance&&high.objectDistance<ultra.objectDistance);
  assert.ok(low.vegetationBudget<med.vegetationBudget&&med.vegetationBudget<high.vegetationBudget&&high.vegetationBudget<=ultra.vegetationBudget);
  assert.equal(low.premiumDistance,0);assert.equal(med.premiumDistance,0);assert.ok(high.premiumDistance>0&&ultra.premiumDistance>high.premiumDistance);
  const phone=external.externalWorldQualityProfile('ultra',{mobile:true,hardware:4,cores:4},'vale-silicio');
  assert.ok(phone.dpr<=1.05);assert.equal(phone.shadows,false);assert.ok(phone.vegetationBudget<1);
});

test('F91 Rural replaces individual orchard trees with instancing and quality budgets',()=>{
  assert.match(rural,/ruralTreeDefs/);assert.match(rural,/new THREE\.InstancedMesh/);assert.match(rural,/rural-trees-trunks-instanced/);assert.match(rural,/rural-trees-crowns-instanced/);
  assert.doesNotMatch(rural,/function tree\(/);
  assert.match(rural,/qualityCount\(ruralTreeDefs\.length,externalVisual\.vegetationBudget/);
  assert.match(rural,/fieldRowGroups/);assert.match(rural,/rural-road-markings-instanced-f91/);assert.match(rural,/ruralRoadDetail\.count=qualityCount/);
});

test('F91 Rural has live quality switching, building LOD and premium landmarks',()=>{
  assert.match(rural,/applyRuralQuality/);assert.match(rural,/updateRuralLOD/);assert.match(rural,/applyExternalRendererQuality/);
  assert.match(rural,/ruralBuildingEntries/);assert.match(rural,/mediumDetail/);assert.match(rural,/premiumDetail/);
  assert.match(rural,/rural-premium-landmarks/);assert.match(rural,/windmill/);
  assert.match(rural,/avatarSystem\.setQuality\(quality\)/);assert.match(rural,/weatherEffects\?\.setQuality\?\.\(quality\)/);
});

test('F91 Vale uses external quality budget for roads, facade tiers, lights and distance LOD',()=>{
  assert.match(vale,/externalWorldQualityProfile/);assert.match(vale,/applyExternalRendererQuality/);
  assert.match(vale,/vale-road-markings-instanced-f91/);assert.match(vale,/new THREE\.InstancedMesh/);
  assert.match(vale,/vale-facade-medium-/);assert.match(vale,/vale-facade-premium-/);
  assert.match(vale,/avenueLightRoots/);assert.match(vale,/qualityDistanceVisible/);
  assert.match(vale,/avatarSystem\.setQuality\(quality\)/);assert.match(vale,/weatherEffects\?\.setQuality\?\.\(quality\)/);
});

test('F91 quality switching preserves dynamic world atmosphere instead of overwriting it',()=>{
  assert.match(vale,/visualExposureOffset/);assert.match(vale,/baseExposure=.*visualExposureOffset/);
  assert.match(rural,/visualExposureOffset/);assert.match(rural,/toneMappingExposure=.*visualExposureOffset/);
});

test('F91 cache-busts Vale/Rural lazy adapters and airdrop prefetch targets',()=>{
  for(const name of ['vale3d.js','rural3d.js']){
    const rx=new RegExp(name.replace('.','\\.')+'\\?v=14\\.10\\.8\\.93-f91-external-graphics');
    assert.match(adapter,rx,name);assert.match(prefetch,rx,name);
  }
  assert.match(vale,/external-world-quality\.js\?v=14\.10\.8\.93-f91-external-graphics/);
  assert.match(rural,/external-world-quality\.js\?v=14\.10\.8\.93-f91-external-graphics/);
});

test('F91 keeps all 3D runtimes and the external graphics helper out of the critical shell',()=>{
  const critical=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'';
  assert.doesNotMatch(critical,/\b(?:vale3d|rural3d|lobby3d|village3d|campus-module3d)\.js/);
  assert.doesNotMatch(critical,/external-world-quality\.js/);
});

test('F91 preserves current world topology, airdrop and standard gameplay speed',()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);assert.equal(sectors.AIRDROP_SECTORS.length,15);
  assert.match(read('lobby/assets/world/gameplay-settings.js'),/walk:16,run:28/);
});

test('F91 Vale and Rural modules remain importable as ESM after graphics refactor',async()=>{
  const [v,r]=await Promise.all([imp('lobby/assets/vale3d.js'),imp('lobby/assets/rural3d.js')]);
  assert.equal(typeof v.createVale3D,'function');assert.equal(typeof r.createRural3D,'function');
});

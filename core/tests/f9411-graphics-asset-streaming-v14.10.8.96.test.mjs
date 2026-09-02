import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const qualityUrl=pathToFileURL(path.join(root,'lobby/assets/render/quality-feature-matrix.js')).href+'?f9411test';
const budgetUrl=pathToFileURL(path.join(root,'lobby/assets/render/asset-streaming-v2/visual-asset-budget.js')).href+'?f9411test';
const loaderUrl=pathToFileURL(path.join(root,'lobby/assets/render/asset-streaming-v2/simple-glb-loader.js')).href+'?f9411test';
const threeUrl=pathToFileURL(path.join(root,'lobby/vendor/three/three.module.min.js')).href+'?f9411test';
const {qualityFeatures}=await import(qualityUrl);
const {createVisualAssetBudget}=await import(budgetUrl);
const {parseSimpleGLB}=await import(loaderUrl);
const THREE=await import(threeUrl);
const campus=read('lobby/assets/world/campus-environment.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const vale=read('lobby/assets/vale3d.js');
const rural=read('lobby/assets/rural3d.js');
const adapter=read('lobby/assets/core/world-adapter.js');
const prefetch=read('lobby/assets/world/world-runtime-prefetch.js');
const sw=read('lobby/sw.js');
const html=read('lobby/index.html');

test('matriz gráfica tem progressão material, memória, textura e detalhe',()=>{
  const low=qualityFeatures('low'),medium=qualityFeatures('medium'),high=qualityFeatures('high'),ultra=qualityFeatures('ultra');
  assert.deepEqual([low.materialTier,medium.materialTier,high.materialTier,ultra.materialTier],[0,1,2,3]);
  assert.ok(low.memoryBudgetMB<medium.memoryBudgetMB&&medium.memoryBudgetMB<high.memoryBudgetMB&&high.memoryBudgetMB<ultra.memoryBudgetMB);
  assert.ok(low.textureMaxSize<medium.textureMaxSize&&medium.textureMaxSize<high.textureMaxSize&&high.textureMaxSize<ultra.textureMaxSize);
  assert.equal(low.physicalMaterials,false);assert.equal(ultra.physicalMaterials,true);assert.ok(ultra.particles>high.particles&&high.particles>medium.particles&&medium.particles>low.particles);
});

test('Asset Budget V2 escolhe LOD diferente por qualidade',()=>{
  const low=createVisualAssetBudget({worldId:'test',quality:'low'}),medium=createVisualAssetBudget({worldId:'test',quality:'medium'}),high=createVisualAssetBudget({worldId:'test',quality:'high'}),ultra=createVisualAssetBudget({worldId:'test',quality:'ultra'});
  const d={lod0:45,lod1:100,lod2:180};
  assert.equal(low.chooseLOD(20,d),'lod2');assert.equal(medium.chooseLOD(20,d),'lod1');assert.equal(high.chooseLOD(20,d),'lod0');assert.equal(ultra.chooseLOD(20,d),'lod0');
  assert.ok(ultra.diagnostics().budgetMB>low.diagnostics().budgetMB);assert.equal(ultra.texturePolicy({width:4096,height:4096}).preferKTX2,true);
});

test('GLB LODs F94.11 são GLB2 reais e parseiam no runtime local',()=>{
  const assets=['campus-smart-kiosk','vale-innovation-pylon','rural-wind-turbine'];
  for(const base of assets)for(const lod of [0,1,2]){const rel=`lobby/assets/models/environment/f9411/${base}-lod${lod}.glb`,buf=fs.readFileSync(path.join(root,rel));assert.ok(buf.length>1000,rel);const ab=buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength),obj=parseSimpleGLB(THREE,ab,{source:rel});let meshes=0;obj.traverse(o=>{if(o.isMesh)meshes++;});assert.ok(meshes>=1,`${rel} meshes`);}
});

test('Campus usa qualidade dinâmica, GLB detail streamer e mantém streaming espacial',()=>{
  assert.match(campus,/createWorldDetailAssetStreamer/);assert.match(campus,/createQualityAwareMaterial/);assert.match(campus,/applyRootVisualQuality/);assert.match(campus,/campus-quality-detail-layer-f9411/);assert.match(campus,/detailAssets:detailStreamer\.diagnostics/);assert.match(campus,/createSpatialStreamingManager/);assert.match(lobby3d,/environment\.updateVisualDetails/);
});

test('Vale e Rural consomem Asset Streaming V2 e camadas visuais por tier',()=>{
  for(const [source,id] of [[vale,'vale-silicio'],[rural,'rural-agv']]){assert.match(source,/createWorldDetailAssetStreamer/);assert.match(source,/createVisualAssetBudget/);assert.match(source,/applyRootVisualQuality/);assert.match(source,new RegExp(`worldId:'${id}'`));assert.match(source,/getVisualAssetBudget/);}
  assert.match(vale,/vale-quality-detail-layer-f9411/);assert.match(rural,/rural-quality-detail-layer-f9411/);assert.match(vale,/quality==='ultra'/);assert.match(rural,/quality==='ultra'/);
});

test('qualidade troca material em runtime em vez de só esconder geometria',()=>{
  const source=read('lobby/assets/render/quality-feature-matrix.js');assert.match(source,/rebuildQualityAwareMaterial/);assert.match(source,/MeshPhysicalMaterial/);assert.match(source,/glassTransmission/);assert.match(source,/object\.material=object\.material\.map/);
});

test('cache F94.11 e lazy imports apontam para os runtimes novos',()=>{
  assert.match(sw,/stage74-f9411-graphics-streaming/);assert.match(html,/stage74-f9411-graphics-streaming/);assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.96-f9411-graphics-streaming/);assert.match(adapter,/vale3d\.js\?v=14\.10\.8\.96-f9411-graphics-streaming/);assert.match(adapter,/rural3d\.js\?v=14\.10\.8\.96-f9411-graphics-streaming/);assert.match(prefetch,/f9411-graphics-streaming/);
});

test('Service Worker conhece módulos e GLBs da F94.11 sem tornar GLB gate crítico',()=>{
  for(const token of ['quality-feature-matrix.js','world-detail-asset-streamer.js','simple-glb-loader.js','campus-smart-kiosk-lod0.glb','vale-innovation-pylon-lod0.glb','rural-wind-turbine-lod0.glb'])assert.match(sw,new RegExp(token.replaceAll('.','\\.')));
  const critical=sw.slice(sw.indexOf('const CRITICAL_SHELL'),sw.indexOf('const OPTIONAL_SHELL'));assert.doesNotMatch(critical,/f9411\/.*\.glb/);
});

test('hotfix Campus 3D, Camera V2 e Interaction V2 permanecem preservados',()=>{
  for(const name of ['startAirdropSession','jumpFromAirdrop','deployAirdropParachute','cancelAirdropSession','getAirdropState'])assert.match(lobby3d,new RegExp(`function\\s+${name}\\s*\\(`));
  assert.match(lobby3d,/f948-camera-v2/);const lobby=read('lobby/assets/lobby.js');assert.match(lobby,/createInteractionManager/);assert.match(lobby,/f949-interaction-v2/);
});

test('F94.11 não adiciona dependência de Supabase ao pipeline gráfico',()=>{
  for(const rel of ['lobby/assets/render/quality-feature-matrix.js','lobby/assets/render/asset-streaming-v2/visual-asset-budget.js','lobby/assets/render/asset-streaming-v2/simple-glb-loader.js','lobby/assets/render/asset-streaming-v2/world-detail-asset-streamer.js','lobby/assets/world/world-detail-assets.js'])assert.doesNotMatch(read(rel),/supabase|service_role|edge-functions/i,rel);
});

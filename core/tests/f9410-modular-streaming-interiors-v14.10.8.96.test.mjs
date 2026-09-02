import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const streamUrl=pathToFileURL(path.join(root,'lobby/assets/core/streaming-v2/spatial-streaming-manager.js')).href+'?f9410test';
const {createSpatialStreamingManager}=await import(streamUrl);
const campus=read('lobby/assets/lobby3d.js');
const environment=read('lobby/assets/world/campus-environment.js');
const profiles=read('lobby/assets/world/world-environment-profiles.js');
const adapter=read('lobby/assets/core/world-adapter.js');
const prefetch=read('lobby/assets/world/world-runtime-prefetch.js');
const sw=read('lobby/sw.js');
const html=read('lobby/index.html');

const wait=()=>new Promise(resolve=>setTimeout(resolve,0));

test('SpatialStreamingManager carrega perto e descarrega longe liberando recurso',async()=>{
  const log=[];let loads=0,unloads=0;
  const manager=createSpatialStreamingManager({loadRadius:10,unloadRadius:16,maxLoaded:3,onEvent:e=>log.push(e.type)});
  manager.register({id:'near',x:0,z:0,load:()=>({id:++loads}),unload:()=>{unloads++;}});
  manager.update({x:2,z:0});await wait();
  assert.equal(manager.diagnostics().chunks.find(c=>c.id==='near').status,'loaded');
  manager.update({x:40,z:0});await wait();await wait();
  assert.equal(manager.diagnostics().chunks.find(c=>c.id==='near').status,'idle');
  assert.equal(loads,1);assert.equal(unloads,1);assert.ok(log.includes('loaded'));assert.ok(log.includes('unloaded'));
  await manager.dispose();
});

test('chunk always permanece carregado durante navegação normal',async()=>{
  let unloads=0;const manager=createSpatialStreamingManager({loadRadius:8,unloadRadius:12,maxLoaded:2});
  manager.register({id:'hub',x:0,z:0,policy:'always',load:()=>({}),unload:()=>{unloads++;}});
  manager.update({x:100,z:100});await wait();assert.equal(manager.diagnostics().chunks[0].status,'loaded');assert.equal(unloads,0);
  await manager.dispose();assert.equal(unloads,1);
});

test('Campus 3D usa streaming espacial real e diagnóstico no runtime',()=>{
  assert.match(environment,/createSpatialStreamingManager/);assert.match(environment,/buildSector/);assert.match(environment,/releaseSector/);assert.match(environment,/disposeTree\(resource\.root\)/);
  assert.match(campus,/environment\.updateStreaming\?\.\(self\.position/);assert.match(campus,/getStreamingState:/);assert.match(campus,/streaming:environment\.streamingDiagnostics/);
});

test('interiores recebem iluminação local e continuam lazy-mounted/unmounted',()=>{
  assert.match(campus,/function addInteriorLighting/);assert.match(campus,/HemisphereLight/);assert.match(campus,/PointLight/);assert.match(campus,/runtime:'lazy-mounted'/);assert.match(campus,/runtime:'unmounted'/);
  assert.match(campus,/releaseToolInterior/);assert.match(campus,/releaseClassInterior/);
});

test('perfis ambientais cobrem mundos prioritários e mantêm preparação Meshopt KTX2',()=>{
  for(const id of ['campus-ds','vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv','colegio-agv','museu-hardware-agv'])assert.match(profiles,new RegExp(`['\"]${id}['\"]`));
  const assets=read('lobby/assets/world/environment-assets.js');assert.match(assets,/preferredGeometryCompression:'meshopt'/);assert.match(assets,/preferredTextureCompression:'ktx2'/);
});

test('Mirante pode forçar todos os chunks para observação de longa distância',()=>{
  assert.match(campus,/forceFull=securityViewState\.active\|\|viewpointState\.active/);assert.match(environment,/pinIds:forceFull\?streamingChunkIds/);
});

test('hotfix do Campus 3D e Interaction V2 permanecem preservados',()=>{
  for(const name of ['startAirdropSession','jumpFromAirdrop','deployAirdropParachute','cancelAirdropSession','getAirdropState'])assert.match(campus,new RegExp(`function\\s+${name}\\s*\\(`));
  const lobby=read('lobby/assets/lobby.js');assert.match(lobby,/createInteractionManager/);assert.match(lobby,/f949-interaction-v2/);
});

test('cache e lazy import avançam para F94.10 sem depender de backend',()=>{
  assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.96-f9410-modular-streaming/);assert.match(prefetch,/f9410-modular-streaming/);
  assert.match(sw,/stage73-f9410-modular-streaming/);assert.match(html,/stage73-f9410-modular-streaming/);assert.match(sw,/streaming-v2\/spatial-streaming-manager\.js/);
  assert.doesNotMatch(environment,/supabase|service_role|edge-functions/i);
});

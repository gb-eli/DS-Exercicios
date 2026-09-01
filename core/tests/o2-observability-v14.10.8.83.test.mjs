import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { estimateSceneMemory, captureRenderTelemetry, createFrameRateCounter } from '../../lobby/assets/render/observability.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('O2 mantém métricas ausentes como não reportadas',()=>{
  const sample=captureRenderTelemetry({fps:50,quality:'lite',worldId:'colegio-agv',source:'test'});
  assert.equal(sample.fps,50);
  assert.equal(sample.frameTimeMs,20);
  assert.equal(sample.drawCalls,null);
  assert.equal(sample.triangles,null);
  assert.equal(sample.npcCount,null);
  assert.equal(sample.vehicleCount,null);
  assert.equal(sample.estimatedGpuMemoryMb,null);
  assert.equal(sample.estimatedMemoryMethod,null);
});

test('O2 estima buffers e texturas sem duplicar referências',()=>{
  const position=new Float32Array(300_000);
  const texture={isTexture:true,source:{data:{width:1024,height:1024}},generateMipmaps:false};
  const geometry={index:null,attributes:{position:{array:position}},morphAttributes:{}};
  const material={map:texture};
  const object={visible:true,geometry,material};
  const scene={traverse(fn){fn(object);fn({visible:false,geometry,material});}};
  const memory=estimateSceneMemory(scene);
  assert.equal(memory.uniqueGeometries,1);
  assert.equal(memory.uniqueTextures,1);
  assert.equal(memory.objectCount,2);
  assert.equal(memory.visibleObjectCount,1);
  assert.ok(memory.estimatedGpuMemoryMb>4);
});

test('O2 captura renderer.info, DPR, mundo, NPCs e veículos',()=>{
  const scene={traverse(){}};
  const renderer={getPixelRatio:()=>1.5,info:{render:{calls:12,triangles:3456,points:7,lines:9},memory:{geometries:18,textures:22},programs:[{},{}]}};
  const sample=captureRenderTelemetry({renderer,scene,fps:60,quality:'high',npcCount:8,vehicleCount:3,worldId:'campus-ds',interior:'1ds'});
  assert.equal(sample.dpr,1.5);
  assert.equal(sample.drawCalls,12);
  assert.equal(sample.triangles,3456);
  assert.equal(sample.geometries,18);
  assert.equal(sample.textures,22);
  assert.equal(sample.programs,2);
  assert.equal(sample.npcCount,8);
  assert.equal(sample.vehicleCount,3);
  assert.equal(sample.worldId,'campus-ds');
  assert.equal(sample.interior,'1ds');
});



test('O2 mede FPS real dos loops Lite sem alterar o desenho',()=>{
  const counter=createFrameRateCounter(0);
  for(let i=1;i<=60;i++)counter.tick(i*(1000/60));
  assert.ok(counter.getFPS()>=59&&counter.getFPS()<=61);
});
test('O2 instrumenta diagnóstico central sem alterar arquitetura de mundo',()=>{
  const diag=read('lobby/assets/diagnostics.js');
  const lobby=read('lobby/assets/lobby.js');
  assert.match(diag,/diagnosticSchema:2/);
  assert.match(diag,/activePending/);
  assert.match(diag,/activeRelevant/);
  assert.match(diag,/estimatedGpuMemoryMb/);
  assert.match(lobby,/OBSERVABILITY_SAMPLE_MS=5000/);
  assert.match(lobby,/sampleObservability\('runtime-ready'\)/);
  assert.match(lobby,/currentWorld/);
  assert.match(lobby,/currentInterior/);
});

test('O2 expõe snapshot em todos os pontos 3D auditados',()=>{
  const files=['lobby3d.js','vale3d.js','rural3d.js','military3d.js','space3d.js','moon3d.js','mars3d.js','parque-diversoes-agv3d.js','museu-hardware3d.js','deep-space-runtime.js','plugin-world-host.js'];
  for(const file of files){
    const source=read(`lobby/assets/${file}`);
    assert.match(source,/getObservabilitySnapshot/,file);
    assert.match(source,/captureRenderTelemetry/,file);
  }
});

test('O2 expõe FPS e snapshot nos runtimes Lite oficiais',()=>{
  const files=['lobby-lite.js','vale-lite.js','rural-lite.js','military-lite.js','space-lite.js','moon-lite.js','mars-lite.js','parque-diversoes-agv-lite.js','museu-hardware-lite.js','plugin-world-host.js'];
  for(const file of files){
    const source=read(`lobby/assets/${file}`);
    assert.match(source,/getFPS/,file);
    assert.match(source,/getObservabilitySnapshot/,file);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F71 define três mirantes panorâmicos e catálogo de marcos',async()=>{
  const mod=await import('../../lobby/assets/world/campus-viewpoints.js');
  assert.ok(mod.CAMPUS_VIEWPOINTS.length>=3);
  assert.ok(mod.CAMPUS_VIEWPOINT_LANDMARKS.length>=8);
  assert.ok(mod.CAMPUS_VIEWPOINTS.every(v=>v.camera.y>=10&&v.maxZoom>=4&&v.focusIds.length>=5));
  assert.ok(mod.CAMPUS_VIEWPOINT_LANDMARKS.some(v=>v.id==='cinema'));
  assert.ok(mod.CAMPUS_VIEWPOINT_LANDMARKS.some(v=>v.id==='security-center'));
  assert.ok(mod.CAMPUS_VIEWPOINT_LANDMARKS.some(v=>v.id==='vale-gate'));
});

test('F71 zoom reduz FOV e respeita teto do binóculo',async()=>{
  const mod=await import('../../lobby/assets/world/campus-viewpoints.js');
  const v=mod.CAMPUS_VIEWPOINTS[0];
  const normal=mod.viewpointZoomFov(v,1),zoomed=mod.viewpointZoomFov(v,v.maxZoom);
  assert.ok(zoomed<normal);
  assert.ok(zoomed>=10);
  assert.equal(mod.viewpointLandmarks(v).length,v.focusIds.length);
});

test('F71 runtime cria estruturas, câmera reutilizável, foco e encerramento',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  for(const token of ['function campusViewpointStructure','viewpointCamera','function openViewpoint','function setViewpointZoom','function setViewpointFocus','function closeViewpoint','function renderViewpoint','CAMPUS_VIEWPOINTS'])assert.ok(runtime.includes(token),token);
  assert.match(runtime,/viewpointState\.active/);
  assert.match(runtime,/renderSecurityCameras\(\).*renderViewpoint\(\)/);
  assert.match(runtime,/openViewpoint,closeViewpoint,setViewpointZoom,setViewpointFocus,getViewpointState/);
});

test('F71 trava movimento e câmera comum durante observação mas mantém mundo externo vivo',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/securityViewState\.active\|\|viewpointState\.active\|\|toolInteriors/);
  assert.match(runtime,/!securityViewState\.active&&!viewpointState\.active&&onGround/);
  assert.match(runtime,/!securityViewState\.active&&!viewpointState\.active\)cameraController\.toggleMode/);
  assert.match(runtime,/securityViewState\.active\|\|viewpointState\.active\)\?\{x:0,y:0,z:0\}/);
});

test('F71 HUD oferece panorama, marcos identificados e zoom sem inline handlers',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),css=read('lobby/assets/lobby.css');
  for(const id of ['viewpoint-panel','viewpoint-title','viewpoint-status','viewpoint-panorama','viewpoint-landmark-list','viewpoint-zoom','viewpoint-zoom-value','viewpoint-close'])assert.ok(html.includes(`id="${id}"`),id);
  assert.match(lobby,/campus-viewpoint/);
  assert.match(lobby,/syncViewpointPanel/);
  assert.match(lobby,/setViewpointFocus/);
  assert.match(css,/viewpoint-landmark-list/);
  assert.match(css,/viewpoint-active/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F71 minimapa e interação localizam mirantes sem escrever dados acadêmicos',()=>{
  const lobby=read('lobby/assets/lobby.js'),module=read('lobby/assets/world/campus-viewpoints.js');
  assert.match(lobby,/CAMPUS_VIEWPOINTS/);
  assert.match(lobby,/openViewpointPanel/);
  assert.match(lobby,/Observar/);
  assert.doesNotMatch(module,/supabase|student_|exercise|grade|score|fetch\(/i);
});

test('F71 release e cache incluem viewpoints em 14.10.8.73+',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js'),index=read('lobby/index.html');
  assert.ok(patch(config)>=73);assert.ok(patch(boot)>=73);assert.ok(patch(sw)>=73);assert.ok(patch(adapter)>=73);
  assert.match(boot,/world\/campus-viewpoints\.js/);
  assert.match(sw,/world\/campus-viewpoints\.js\?v=14\.10\.8\.73-stage42-viewpoints/);
  assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.\d+-stage\d+-/);
  assert.match(index,/lobby\.css\?v=14\.10\.8\.\d+-stage\d+-/);
});

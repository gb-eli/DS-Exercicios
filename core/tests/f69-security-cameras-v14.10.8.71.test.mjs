import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const patch=text=>Number(text.match(/14\.10\.8\.(\d+)/)?.[1]||0);

test('F69 define oito câmeras públicas e modos single/grid com zoom',async()=>{
  const mod=await import('../../lobby/assets/world/security-cameras.js');
  assert.equal(mod.CAMPUS_SECURITY_CAMERAS.length,8);
  assert.ok(mod.CAMPUS_SECURITY_CAMERAS.every(camera=>camera.public===true));
  assert.equal(mod.CAMPUS_SECURITY_DEFAULT_CAMERA,'cam-central');
  assert.equal(mod.CAMPUS_SECURITY_GRID_IDS.length,4);
  const central=mod.CAMPUS_SECURITY_CAMERA_MAP['cam-central'];
  assert.ok(central);
  assert.ok(mod.securityCameraZoomFov(central,4)<mod.securityCameraZoomFov(central,1));
});

test('F69 adiciona Central de Segurança no eixo norte com interior operacional',()=>{
  const destinations=read('lobby/assets/world/campus-destinations.js');
  const interiors=read('lobby/assets/world/campus-interiors.js');
  const live=read('lobby/assets/world/campus-live-systems.js');
  assert.match(destinations,/id:'security-center'/);
  assert.match(destinations,/x:-29,z:31/);
  assert.match(destinations,/architecture:'security-center'/);
  assert.match(interiors,/'security-center':\{template:'security-operations'/);
  assert.match(interiors,/type:'security-console'/);
  assert.match(interiors,/Sala de Controle CCTV/);
  assert.match(live,/'security-center'/);
  assert.match(live,/Monitoramento de Energia|energia/i);
  assert.match(live,/Supervisão de Redes|redes/i);
});

test('F69 exterior e interior possuem identidade física de segurança',()=>{
  const environment=read('lobby/assets/world/campus-environment.js');
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(environment,/case 'security-center'/);
  assert.match(runtime,/MATRIZ CCTV • E PARA OPERAR/);
  assert.match(runtime,/ÁREAS PÚBLICAS • SEM INTERIORES/);
  assert.match(runtime,/function campusSecurityCameraRig/);
  assert.match(runtime,/securityCameraRigs=CAMPUS_SECURITY_CAMERAS\.map/);
});

test('F69 renderiza uma câmera ou mosaico 2x2 no mesmo WebGL',()=>{
  const runtime=read('lobby/assets/lobby3d.js');
  assert.match(runtime,/function renderSecurityCameras/);
  assert.match(runtime,/renderer\.setScissorTest\(true\)/);
  assert.match(runtime,/CAMPUS_SECURITY_GRID_IDS\.forEach/);
  assert.match(runtime,/configureSecurityCamera\(securityViewState\.selectedId/);
  assert.match(runtime,/if\(!renderSecurityCameras\(\).*renderer\.render\(scene,camera\)/);
  assert.match(runtime,/setSecurityCameraZoom/);
  assert.match(runtime,/weatherCenter=.*securityViewState\.active.*self\.position/);
});

test('F69 UI controla câmera, mosaico e zoom sem handlers inline',()=>{
  const html=read('lobby/index.html'),lobby=read('lobby/assets/lobby.js'),css=read('lobby/assets/lobby.css');
  for(const id of ['security-camera-panel','security-camera-list','security-camera-close','security-camera-zoom','security-camera-zoom-value'])assert.ok(html.includes(`id="${id}"`));
  assert.match(html,/data-security-layout="single"/);
  assert.match(html,/data-security-layout="grid"/);
  assert.match(lobby,/function openSecurityCameraPanel/);
  assert.match(lobby,/setSecurityCameraLayout/);
  assert.match(lobby,/setSecurityCameraZoom/);
  assert.match(lobby,/obj\.type==='security-console'/);
  assert.match(css,/security-camera-console/);
  assert.doesNotMatch(html,/onclick=/);
});

test('F69 explicita limite de privacidade e não adiciona persistência acadêmica',()=>{
  const html=read('lobby/index.html'),security=read('lobby/assets/world/security-cameras.js');
  assert.match(html,/Somente áreas públicas externas do Campus/);
  assert.match(html,/não mostra interiores, provas, atividades ou dados acadêmicos/i);
  assert.match(security,/Nenhum dado acadêmico é lido ou alterado/);
  assert.doesNotMatch(security,/supabase|insert\(|update\(|delete\(/i);
});

test('F69 boot e service worker incluem o módulo CCTV e release >= 14.10.8.71',()=>{
  const config=read('lobby/assets/config.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js'),adapter=read('lobby/assets/core/world-adapter.js');
  assert.ok(patch(config)>=71);assert.ok(patch(boot)>=71);assert.ok(patch(sw)>=71);
  assert.match(boot,/world\/security-cameras\.js/);
  assert.match(sw,/world\/security-cameras\.js\?v=14\.10\.8\.71-stage40-security/);
  assert.ok(patch(adapter)>=71);
  assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.\d+-stage\d+-/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const campus=read('lobby/assets/lobby3d.js');
const adapter=read('lobby/assets/core/world-adapter.js');
const prefetch=read('lobby/assets/world/world-runtime-prefetch.js');
const sw=read('lobby/sw.js');
const boot=read('lobby/assets/boot.js');
const html=read('lobby/index.html');

const AIRDROP_API=['startAirdropSession','jumpFromAirdrop','deployAirdropParachute','cancelAirdropSession','getAirdropState'];

test('Campus 3D declara toda a API de Airdrop exposta pelo runtime',()=>{
  for(const name of AIRDROP_API){
    assert.match(campus,new RegExp(`function\\s+${name}\\s*\\(`),`${name} precisa estar declarado antes de ser exportado no runtime`);
  }
  assert.match(campus,/function\s+applyAirdropDetail\s*\(/);
});

test('runtime do Campus continua expondo a API de Airdrop usada pelo Lobby',()=>{
  const returned=campus.slice(campus.lastIndexOf('return{setQuality'));
  for(const name of AIRDROP_API)assert.match(returned,new RegExp(`\\b${name}\\b`));
});

test('estado do Airdrop possui transições plane freefall parachute ground',()=>{
  assert.match(campus,/airdropMode='plane'/);
  assert.match(campus,/airdropMode='freefall'/);
  assert.match(campus,/airdropMode='parachute'/);
  assert.match(campus,/airdropMode='ground'/);
  assert.match(campus,/cameraController\.setMode\?\.\('aerial'\)/);
});

test('Campus adapter e prefetch usam cache-bust exclusivo do hotfix',()=>{
  assert.match(adapter,/lobby3d\.js\?v=14\.10\.8\.96-(?:f9491-campus3d-hotfix|f9410-modular-streaming)/);
  assert.match(prefetch,/lobby3d\.js\?v=14\.10\.8\.96-(?:f9491-campus3d-hotfix|f9410-modular-streaming)/);
  assert.doesNotMatch(adapter,/lobby3d\.js\?v=14\.10\.8\.96-f948-camera-v2/);
});

test('shell preserva invalidação do Campus 3D nas fases posteriores',()=>{
  assert.match(sw,/stage(?:72-f9491-campus3d-hotfix|73-f9410-modular-streaming)/);
  assert.match(boot,/stage(?:72-f9491-campus3d-hotfix|73-f9410-modular-streaming)/);
  assert.match(html,/stage(?:72-f9491-campus3d-hotfix|73-f9410-modular-streaming)/);
  assert.match(sw,/core\/world-adapter\.js\?v=14\.10\.8\.96-(?:f9491-campus3d-hotfix|f9410-modular-streaming)/);
});

test('a correção não remove Camera V2 nem Interaction V2',()=>{
  assert.match(campus,/createCameraController/);
  assert.match(campus,/setInvertY/);
  const lobby=read('lobby/assets/lobby.js');
  assert.match(lobby,/createInteractionManager/);
  assert.match(lobby,/f949-interaction-v2/);
});

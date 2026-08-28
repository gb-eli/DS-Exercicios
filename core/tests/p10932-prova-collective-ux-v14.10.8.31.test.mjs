import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('simulator prioritizes immersive player preview over admin controls',()=>{
  const html=read('prova/simulador.html');
  assert.match(html,/PLAYER EXPERIENCE LAB/);
  assert.match(html,/data-sim-view-tab="lobby"/);
  assert.match(html,/id="sim-immersive"/);
  assert.match(html,/id="sim-intro"/);
  assert.match(html,/simulator-drawer/);
  const stagePos=html.indexOf('id="sim-device-frame"');
  const controlPos=html.indexOf('id="sim-class"');
  assert.ok(stagePos>0 && controlPos>stagePos,'preview must appear before configuration controls');
});

test('simulator lobby exposes guild, squad, ready-check, chat and match intro language',()=>{
  const js=read('prova/assets/simulator.js');
  for(const token of ['NEON WOLVES','BYTEFORGE','GUILD SELECT','READY CHECK','GLOBAL COMMS','GUILD CHAT','MATCH FOUND','MISSÃO INICIADA']) assert.ok(js.includes(token),token);
  assert.match(js,/requestFullscreen/);
  assert.match(js,/Catálogo local de demonstração/);
});

test('student entry remains real multiplayer and uses match-oriented CTA',()=>{
  const js=read('prova/assets/student.js');
  assert.match(js,/match-session-card/);
  assert.match(js,/Entrar no lobby/);
  assert.match(js,/Entrar na partida/);
  assert.match(js,/showMatchIntro/);
  assert.match(js,/AGVFullscreen\?\.request/);
});

test('v31 CSS contains responsive immersive game surfaces',()=>{
  const css=read('prova/assets/prova.css');
  for(const token of ['.simulator-commandbar','.sim-game-hud','.sim-match-banner','.game-guild-card','.sim-squad-hero','.sim-chat-preview','.sim-immersive-frame']) assert.ok(css.includes(token),token);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

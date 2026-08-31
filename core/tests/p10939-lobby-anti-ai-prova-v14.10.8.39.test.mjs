import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('Lobby isolates optional rigged avatar from the static module graph',()=>{
  const avatarSystem=read('lobby/assets/characters/avatar-system.js'),boot=read('lobby/assets/boot.js');
  assert.doesNotMatch(avatarSystem,/^import\s+\{[^\n]*RiggedAvatar[^\n]*\}/m);
  assert.match(avatarSystem,/import\('\.\.\/rigged-avatar\.js\?v=14\.10\.8\.65'\)/);
  assert.match(avatarSystem,/avatar_system_fallback|avatar_system_ready/);
  assert.match(boot,/boot_optional_asset_warning/);
  assert.match(boot,/'rigged-avatar\.js'/);
});

test('teacher dashboard no longer declares zero-score winners and uses operational state',()=>{
  const js=read('prova/assets/admin.js');
  assert.match(js,/filter\(r=>Number\(r\.ranking_xp\|\|0\)>0\|\|Number\(r\.progress_percent\|\|0\)>0\)/);
  assert.match(js,/Ranking ainda não iniciado/);
  assert.match(js,/Aguardando professor/);
  for(const token of ['Participantes','Online agora','Funções confirmadas','Entregas','Progresso médio','Tornar líder']) assert.match(js,new RegExp(token));
  assert.doesNotMatch(js,/winner-card/);
});

test('simulator prefers real session data and removes invented gamer brands',()=>{
  const js=read('prova/assets/simulator.js'),html=read('prova/simulador.html');
  assert.match(js,/staff_overview/);
  assert.match(js,/syncSessionPreview/);
  for(const fake of ['NEON WOLVES','BYTEFORGE','CODE TITANS','NULL RAIDERS','PIXEL PHANTOMS','STACK GUARD','SA-EAST','ping acadêmico']) assert.doesNotMatch(js,new RegExp(fake,'i'));
  assert.match(html,/PRÉVIA DO ALUNO/);
  assert.match(html,/Dados da sessão em modo somente leitura/);
});

test('student surface keeps pedagogy but drops fake infrastructure language',()=>{
  const js=read('prova/assets/student.js'),html=read('prova/index.html');
  assert.match(js,/Formação das equipes/);
  assert.match(js,/Escolha do líder da equipe/);
  assert.match(js,/Aguardando professor/);
  for(const fake of ['SA-EAST','SECURE SESSION','RECONNECTING SQUAD','MATCH FOUND','ping acadêmico']) assert.doesNotMatch(js,new RegExp(fake,'i'));
  const surface=html+'\n'+js;
  assert.match(surface,/Formação das equipes|Organize sua equipe/);
  assert.match(surface,/Aguardando professor|início definido pelo professor/);
});

test('anti-AI styling removes universal glow/gradient from the primary Prova surfaces',()=>{
  const css=read('prova/assets/prova.css');
  assert.match(css,/v14\.10\.8\.39 — revisão anti-AI slop/);
  assert.match(css,/\.panel,\.hero-panel\{[^}]*background:#0a1820[^}]*box-shadow:none/);
  assert.match(css,/\.button\.primary\{background:#45c7cf;background-image:none/);
  assert.match(css,/\.clan-admin-card\{[^}]*border-radius:8px[^}]*box-shadow:none/);
});

test('release metadata is synchronized',()=>{
  const rel=JSON.parse(read('release-current.json'));
  assert.equal(rel.version,'14.10.8.65');
  assert.match(read('lobby/assets/boot.js'),/14\.10\.8\.65/);
  assert.match(read('prova/admin.html'),/14\.10\.8\.65/);
  assert.match(read('prova/index.html'),/14\.10\.8\.65/);
});

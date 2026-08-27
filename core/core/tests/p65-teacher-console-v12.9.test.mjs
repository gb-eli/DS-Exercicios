import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const html=fs.readFileSync(path.join(root,'professor/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'professor/assets/professor.js'),'utf8');
const css=fs.readFileSync(path.join(root,'professor/assets/professor.css'),'utf8');
const studentHtml=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');

test('P6.5 adiciona acompanhamento operacional ao Console Professor',()=>{
  for(const id of ['teacher-live-panel','live-class','live-list','live-total','live-online','live-working','live-attention']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(js,/refreshTeacherOverview/);
  assert.match(js,/latestProgress/);
  assert.match(js,/latestSession/);
  assert.match(js,/90000/);
  assert.match(css,/\.live-row/);
});

test('P6.5 mantém presença como inferência conservadora',()=>{
  assert.match(html,/heartbeat\/sessão recente/);
  assert.match(html,/sem telemetria recente/);
  assert.doesNotMatch(js,/online\s*=\s*true/);
});

test('P6.5 adiciona aula guiada somente ao Console Professor',()=>{
  for(const id of ['guided-modal','guided-open','guided-code','guided-explanation','guided-prev','guided-next','guided-play']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(js,/solution_payload\?\.files/);
  assert.match(js,/chunkCode/);
  assert.match(js,/prefers-reduced-motion/);
  assert.match(js,/stepHints/);
  assert.doesNotMatch(studentHtml,/guided-modal|Aula guiada|Professor guiado/);
});

test('P6.5 não introduz credencial privilegiada nem recompensa no professor',()=>{
  assert.doesNotMatch(js,/service_role|SUPABASE_SERVICE_ROLE/i);
  assert.doesNotMatch(js,/claim_core_reward|reward_claimed/i);
});

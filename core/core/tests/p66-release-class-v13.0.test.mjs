import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const html=fs.readFileSync(path.join(root,'professor/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'professor/assets/professor.js'),'utf8');
const css=fs.readFileSync(path.join(root,'professor/assets/professor.css'),'utf8');

test('P6.6 permite alternar liberação de turma e exceção individual',()=>{
  for(const id of ['scope-class','scope-student','release-student','release-now','release-block-now','release-clear-schedule']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(js,/setReleaseScope/);
  assert.match(js,/selectedReleaseStudent/);
  assert.match(js,/student_id:sid/);
});

test('P6.6 mostra conferência de liberação por aluno e progresso',()=>{
  for(const id of ['release-roster-list','release-roster-open','release-roster-scheduled','release-roster-blocked','release-roster-completed']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(js,/renderReleaseRoster/);
  assert.match(js,/effectiveReleaseForStudent|releaseFor\(eid,cid,sid\)/);
  assert.match(js,/progressForStudentExercise/);
  assert.match(css,/\.release-roster-row/);
});

test('P6.6 mantém autoridade pedagógica no backend e não adiciona recompensa',()=>{
  assert.match(js,/exercise_releases/);
  assert.doesNotMatch(js,/service_role|SUPABASE_SERVICE_ROLE/i);
  assert.doesNotMatch(js,/claim_core_reward|reward_claimed/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const grade=read('core/edge-functions/exercise-autograde/index.ts');
const ws=read('atividades/assets/js/workspace.js');
const app=read('atividades/assets/js/app.js');
const teacher=read('professor/assets/professor.js');
const migration=read('core/database/040_p104_normalize_autograde_submission_state.sql');
const release=JSON.parse(read('release-current.json'));
const version=JSON.parse(read('atividades/version.json'));
const html=read('atividades/index.html');

test('P10.4 entrega parcial permanece em andamento e 100% conclui',()=>{
  assert.match(grade,/version:'autograde-v8-reference-history'/);
  assert.match(grade,/status:fullyCompleted\?'completed':'in_progress'/);
  assert.match(grade,/progress_percent:fullyCompleted\?100:Math\.min\(99,officialScore\)/);
  assert.match(grade,/completion_source:fullyCompleted\?'autograde_submission':'autograde_submission_partial'/);
  assert.match(grade,/completed_at:fullyCompleted\?\(progress\?\.completed_at\|\|stamp\):null/);
});

test('P10.4 reentrega pior preserva melhor nota e registra tentativa atual',()=>{
  assert.match(grade,/officialScore=action==='submit'\?Math\.max\(previousSubmitted,score\)/);
  assert.match(grade,/submitted_score:officialScore/);
  assert.match(grade,/last_autograde_submission:\{score,best_score:officialScore/);
  assert.match(grade,/best_autograde_submission:bestSubmission/);
  assert.match(grade,/attempts=Number\(progress\?\.attempts\|\|0\)\+\(action==='submit'\?1:0\)/);
  assert.match(grade,/official_score:action==='submit'\?officialScore:null/);
});

test('P10.4 autocorreção automática não consome tentativa',()=>{
  assert.match(grade,/attempts=Number\(progress\?\.attempts\|\|0\)\+\(action==='submit'\?1:0\)/);
  assert.doesNotMatch(ws,/runAutoGrade[\s\S]{0,300}attempts\s*\+/);
  assert.match(ws,/scheduleLiveAutograde/);
});

test('P10.4 aluno distingue autocorreção, entrega parcial e conclusão',()=>{
  assert.match(app,/`Entrega parcial • \$\{score\}%`/);
  assert.match(app,/`Concluído • \$\{score\}%`/);
  assert.match(app,/entrega parcial \$\{submitted\}% • continue ajustando/);
  assert.match(app,/Melhor nota entregue/);
  assert.match(app,/id="exercise-attempts"/);
  assert.match(ws,/Tentativa registrada com \$\{score\}%\. Sua melhor nota entregue continua \$\{officialScore\}%/);
  assert.match(ws,/Entrega parcial registrada com \$\{officialScore\}%/);
  assert.match(ws,/Atividade concluída • \$\{officialScore\}%/);
});

test('P10.4 professor não conta entrega parcial como concluída',()=>{
  assert.match(teacher,/partial=!done&&pr\?\.submitted_score!==null&&pr\?\.submitted_score!==undefined/);
  assert.match(teacher,/label:'Entrega parcial'/);
});

test('P10.4 migração corrige histórico não-legado e preserva aceite legado',()=>{
  assert.match(migration,/completion_source = 'autograde_submission_partial'/);
  assert.match(migration,/legacy_version_accepted/);
  assert.match(migration,/submitted_score, 0\) >= 100/);
  assert.match(migration,/status = 'completed'/);
});

test('P10.4 release UI e cache estão alinhados',()=>{
  assert.equal(release.version,'14.10.8.65');
  assert.equal(version.version,'0.22.8.19');
  assert.equal(version.release,'v14.10.8.65');
  assert.match(html,/app\.js\?v=14\.10\.8/);
  assert.match(app,/workspace\.js\?v=14\.10\.8/);
});

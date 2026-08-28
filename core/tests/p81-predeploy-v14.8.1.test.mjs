import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('versão visual e release de Atividades permanecem alinhados',()=>{
  const html=read('atividades/index.html');
  const version=JSON.parse(read('atividades/version.json'));
  const release=JSON.parse(read('release-current.json'));
  assert.match(version.version,/^0\.22\.(?:[4-9]|[1-9]\d+)(?:\.\d+)?$/);
  assert.equal(version.release,`v${release.version}`);
  assert.match(html,new RegExp(`>${version.version.replace(/\./g,'\\.')}<\\/span>`));
});

test('entrega parcial atual registra submitted_score e permanece explicitamente parcial',()=>{
  const fn=read('core/edge-functions/exercise-autograde/index.ts');
  assert.match(fn,/submitted_score:officialScore/);
  assert.match(fn,/status:fullyCompleted\?'completed':'in_progress'/);
  assert.match(fn,/completion_source:fullyCompleted\?'autograde_submission':'autograde_submission_partial'/);
  assert.match(fn,/required_files_incomplete/);
});

test('workspace invalida score antigo ao editar e valida URL GitHub',()=>{
  const ws=read('atividades/assets/js/workspace.js');
  assert.match(ws,/function invalidateServerEvaluation\(\{schedule=false\}=\{\}\)/);
  assert.match(ws,/invalidateServerEvaluation\(\{schedule:true\}\)/);
  assert.match(ws,/function normalizeGithubRepo\(input\)/);
  assert.match(ws,/Use um link no formato https:\/\/github\.com\/usuario\/repositorio/);
});

test('dashboard distingue nota entregue de autocorreção provisória',()=>{
  const app=read('atividades/assets/js/app.js');
  assert.match(app,/submitted_score/);
  assert.match(app,/`Concluído • \$\{score\}%`/);
  assert.match(app,/`Entrega parcial • \$\{score\}%`/);
  assert.match(app,/`Autocorreção • \$\{Math\.round\(Number\(progress\.auto_score\|\|0\)\)\}%`/);
});

test('frontend público não contém regras privadas',()=>{
  const publicStudentFiles=['atividades/assets/data/exercise-manifest.js','atividades/assets/js/workspace.js','atividades/assets/js/app.js','atividades/index.html'].map(read).join('\n');
  assert.doesNotMatch(publicStudentFiles,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.equal(fs.existsSync(path.join(root,'AGV-REGRAS-PRIVADAS-v14.8.json')),false);
});

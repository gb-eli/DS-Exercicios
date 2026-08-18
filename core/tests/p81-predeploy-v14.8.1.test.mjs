import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('v14.8.1 mantém versão visual e manifesto de Atividades alinhados',()=>{
  const html=read('atividades/index.html');
  const version=JSON.parse(read('atividades/version.json'));
  assert.match(version.version,/^0\.20\.[2-9]$/);
  assert.match(html,new RegExp(`>${version.version.replace(/\./g,'\\.')}<\/span>`));
});

test('entrega parcial 80-99 não é gravada como concluída',()=>{
  const fn=read('core/edge-functions/activity-progress/index.ts');
  assert.match(fn,/status:fullyCompleted\?'completed':'in_progress'/);
  assert.match(fn,/deliveryState=fullyCompleted\?'completed':'submitted_with_pending'/);
  assert.match(fn,/completed_at:fullyCompleted\?/);
  assert.match(fn,/completion_source:fullyCompleted\?'server_private_validation':'server_private_validation_partial'/);
});

test('workspace invalida score antigo ao editar e valida URL GitHub antes de enviar',()=>{
  const ws=read('atividades/assets/js/workspace.js');
  assert.match(ws,/function invalidateServerEvaluation\(\)/);
  assert.match(ws,/state\.active\.content=\$\('code-editor'\)\.value;\n  invalidateServerEvaluation\(\);/);
  assert.match(ws,/function normalizeGithubRepositoryUrl\(input\)/);
  assert.match(ws,/if\(!repo\)[\s\S]*Cole o link do repositório/);
});

test('dashboard distingue entrega parcial de conclusão',()=>{
  const app=read('atividades/assets/js/app.js');
  assert.match(app,/server_private_validation_partial/);
  assert.match(app,/Entregue com pendências/);
  assert.match(app,/entrega registrada com \$\{pct\}%/);
});

test('bundle público não contém o arquivo de regras privadas',()=>{
  assert.equal(fs.existsSync(path.join(root,'AGV-REGRAS-PRIVADAS-v14.8.json')),false);
  const manifest=read('atividades/assets/data/exercise-manifest.js');
  assert.equal(manifest.includes('programacao-desenvolvimento-sistemas:5'),false);
  assert.equal(manifest.includes('programacao-desenvolvimento-sistemas:6'),false);
});

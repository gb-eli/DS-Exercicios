import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const css=fs.readFileSync(path.join(root,'atividades/assets/css/app.css'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'atividades/version.json'),'utf8'));

test('P6.4 opens exercise in practice-first layout',()=>{
  assert.match(html,/id="toggle-tools-btn"/);
  assert.match(html,/id="toggle-output-btn"/);
  assert.match(html,/id="quick-file-tabs"/);
  assert.match(js,/setToolsOpen\(false\)/);
  assert.match(js,/setOutputOpen\(false\)/);
  assert.match(css,/\.exercise-view\.tools-collapsed/);
  assert.match(css,/\.exercise-view\.output-collapsed/);
});

test('P6.4 protects drafts locally before cloud debounce and uses revision-aware recovery',()=>{
  assert.match(js,/persistLocalDraft\(state\.active,state\.active\.content\)/);
  assert.match(js,/savedAt:Date\.now\(\)/);
  assert.match(js,/shouldRecoverCachedDraft\(file,draft,serverContent\)/);
  assert.match(js,/draft-recovery\.js\?v=14\.10\.8/);
  assert.match(js,/state\.recoveredFiles\.add\(file\.id\)/);
  assert.match(js,/flushRecoveredDrafts/);
  assert.match(html,/id="draft-recovery"/);
});

test('P6.4 keeps autosave unobtrusive and syntax highlighting local',()=>{
  assert.match(html,/id="workspace-save-pill"/);
  assert.match(html,/id="code-highlight"/);
  assert.match(js,/function highlightCode/);
  assert.match(css,/\.tok-keyword/);
  assert.doesNotMatch(js,/alert\(['"]Salvo/i);
  assert.ok(/^0\.(?:1[6-9]|[2-9]\d)\./.test(version.version),`versão compatível >= 0.16.x esperada, recebida ${version.version}`);
});

test('P6.4 preview stays on demand and server remains authority',()=>{
  assert.match(js,/async function buildPreview\(\)\{\n  setOutputOpen\(true\)/);
  assert.match(js,/callStudentFiles\(\{action:'save'/);
  assert.match(js,/callAutograde\(\{action:'submit'/);
  assert.doesNotMatch(js,/service_role/i);
  assert.doesNotMatch(js,/claim_core_reward/i);
});

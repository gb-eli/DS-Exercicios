import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('P10.9: workspace oferece seleção automática e manual de referências históricas',()=>{
  const html=read('atividades/index.html');
  const js=read('atividades/assets/js/workspace.js');
  assert.match(html,/id="reference-version-select"/);
  assert.match(html,/Auto • mais próxima do seu código/);
  assert.match(js,/exercise_reference_file_versions/);
  assert.match(js,/function selectedReferenceVariant/);
  assert.match(js,/referenceSimilarity/);
  assert.match(js,/Histórica local/);
  assert.match(js,/Detectada referência anterior/);
});

test('P10.9: autograder escolhe a melhor variante oficial por arquivo sem confiar no seletor do cliente',()=>{
  const edge=read('core/edge-functions/exercise-autograde/index.ts');
  assert.match(edge,/exercise_reference_file_versions/);
  assert.match(edge,/autograde-v8-reference-history/);
  assert.match(edge,/merge_help_legacy/);
  assert.match(edge,/set_help_hint/);
  assert.match(edge,/increment_student_exercise_help_progress/);
  assert.match(edge,/reference_only_files/);
  assert.match(edge,/matched_reference_version_id/);
  assert.match(edge,/matched_reference_current/);
  assert.match(edge,/referenceMatch=legacyMatches&&currentMatches\?'mixed':legacyMatches\?'legacy':'current'/);
  assert.doesNotMatch(edge,/selected_reference_version/);
});

test('P10.9: migration preserva variantes futuras e não reescreve código de aluno',()=>{
  const sql=read('core/database/044_p109_reference_file_version_history.sql');
  assert.match(sql,/create table if not exists public\.exercise_reference_file_versions/);
  assert.match(sql,/enable row level security/);
  assert.match(sql,/private\.student_can_work_on_exercise/);
  assert.match(sql,/create trigger trg_sync_exercise_reference_file_version/);
  assert.match(sql,/bundle_snapshot/);
  assert.match(sql,/exercise_reference_files/);
  assert.doesNotMatch(sql,/update\s+public\.student_files/i);
  assert.doesNotMatch(sql,/delete\s+from\s+public\.student_files/i);
});

test('P10.9: migration inclui múltiplos snapshots históricos e deduplicação por conteúdo',()=>{
  const sql=read('core/database/044_p109_reference_file_version_history.sql');
  const bundleSeeds=(sql.match(/'bundle_snapshot'/g)||[]).length;
  assert.ok(bundleSeeds>=150,`esperava muitos snapshots históricos, encontrei ${bundleSeeds}`);
  assert.match(sql,/content_hash text generated always as/);
  assert.match(sql,/unique \(exercise_id, filename, content_hash\)/);
});

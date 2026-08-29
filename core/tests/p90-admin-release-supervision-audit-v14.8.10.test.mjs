import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const admin=read('admin/assets/admin.js');
const professor=read('professor/assets/professor.js');
const embedded=read('atividades/assets/js/admin.js');
const migration=read('core/database/036_p810_enforce_reference_release_bases.sql');
const adminHtml=read('admin/index.html');
const professorHtml=read('professor/index.html');
const activitiesHtml=read('atividades/index.html');
const version=JSON.parse(read('atividades/version.json'));
const release=JSON.parse(read('release-current.json'));

test('P8.10 banco protege bases quando existe referência oficial',()=>{
  assert.match(migration,/enforce_reference_file_release_bases/);
  assert.match(migration,/before insert or update on public\.exercise_releases/);
  assert.match(migration,/lower\(rf\.filename\) in \('index\.html','index\.htm'\)/);
  assert.match(migration,/new\.allow_html_base := true/);
  assert.match(migration,/new\.allow_css_base := true/);
  assert.match(migration,/new\.allow_js_base := true/);
});

test('P8.10 ADM não grava usando snapshot silenciosamente velho',()=>{
  assert.match(admin,/releaseDataHealthy:false/);
  assert.match(admin,/async function reloadReleaseData\(required=false\)/);
  assert.match(admin,/Não foi possível confirmar as liberações atuais no Supabase/);
  assert.match(admin,/Esta liberação foi alterada em outro painel/);
  assert.match(admin,/await reloadReleaseData\(true\);let done=0/);
  assert.match(admin,/upsertReleaseRow\(ex\.id,classId,null,\{enabled,release_at:null,lock_at:null\}\)/);
  assert.doesNotMatch(admin,/bulkClassAvailability[\s\S]{0,1500}allow_html_base:old\.allow_html_base/);
});

test('P8.10 Console Professor resolve override individual e atualiza live sessions',()=>{
  assert.match(professor,/studentId\?String\(x\.student_id\|\|''\)===String\(studentId\)/);
  assert.match(professor,/class_id:sid\?null:cid/);
  assert.match(professor,/exercise_reference_files\?select=exercise_id,filename/);
  assert.match(professor,/Esta liberação foi alterada em outro painel/);
  assert.match(professor,/invoke\(cfg\.supervisionFunction,\{action:'live_overview'\}\)/);
  assert.match(professor,/state\.overview\.sessions=array\(live\?\.sessions/);
});

test('P8.10 painel embutido protege referências e detecta edição concorrente',()=>{
  assert.match(embedded,/async function referenceBaseFlags\(exerciseId\)/);
  assert.match(embedded,/referência protegida/);
  assert.match(embedded,/Esta configuração foi alterada em outro painel/);
  assert.match(embedded,/allow_html_base:\$\('acc-html'\)\.checked\|\|base\.html/);
  assert.match(embedded,/await renderExerciseManagement\(ex\)/);
});

test('P8.10 cache bust e versões permanecem alinhados em releases posteriores',()=>{
  assert.match(version.version,/^0\.(?:20\.(?:1[0-9]|[2-9]\d)|2[1-9]\.\d+|22\.\d+)(?:\.\d+)?$/);
  assert.match(version.release,/^v14\.(?:8\.(?:1[0-9]|[2-9]\d)|9\.\d+|10\.\d+)(?:\.\d+)?$/);
  assert.match(release.version,/^14\.(?:8\.(?:1[0-9]|[2-9]\d)|9\.\d+|10\.\d+)(?:\.\d+)?$/);
  const escaped=String(release.runtimeCacheVersion||release.version).replace(/\./g,'\\.');
  assert.match(adminHtml,new RegExp(`admin\\.js\\?v=${escaped}`));
  assert.match(professorHtml,new RegExp(`professor\\.js\\?v=${escaped}`));
  assert.match(activitiesHtml,new RegExp(`app\\.js\\?v=${escaped}`));
});

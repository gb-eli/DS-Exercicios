import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const {EXERCISE_MANIFEST:manifest}=await import('../../atividades/assets/data/exercise-manifest.js');
const workspace=read('atividades/assets/js/workspace.js');
const progress=read('core/edge-functions/activity-progress/index.ts');

test('3DS Ex04 mantém autoridade privada e arquivos públicos separados',()=>{
  const ex=manifest['programacao-desenvolvimento-sistemas:4'];
  assert.ok(ex);
  assert.equal(ex.avaliacao?.autoridade,'backend-privado');
  assert.equal(ex.avaliacao?.githubObrigatorio,true);
  assert.deepEqual(ex.files.map(x=>x.filename),['index.html','estilo.css','script.js']);
  assert.equal(Object.hasOwn(ex,'validacao'),false);
});

test('catálogo atual do 3DS contém 01-08 sem reativar o SQL histórico de ocultação',()=>{
  for(let n=1;n<=8;n++)assert.ok(manifest[`programacao-desenvolvimento-sistemas:${n}`],`3DS ${n} ausente`);
  const sql=read('core/database/032_p80_3ds_ex04_release.sql');
  assert.match(sql,/exercise_number >= 5/); // registro histórico preservado
});

test('caminho legado privado do 3DS continua server-side e frontend não contém segredo',()=>{
  assert.match(progress,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.match(progress,/server_validation_required/);
  assert.doesNotMatch(workspace,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.doesNotMatch(read('atividades/assets/data/exercise-manifest.js'),/AGV_PRIVATE_EXERCISE_RULES_V1/);
});

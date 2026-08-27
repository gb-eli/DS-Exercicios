import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const read=p=>fs.readFileSync(p,'utf8');
const {EXERCISE_REFERENCES}=await import('../../atividades/assets/data/exercise-reference.js');
const {EXERCISE_REFERENCE_SYNCED}=await import('../../atividades/assets/data/exercise-reference-synced.js');
const {EXERCISE_MANIFEST}=await import('../../atividades/assets/data/exercise-manifest.js');
const migration=read('core/database/039_p96_1ds_reference_integrity.sql');

const refFor=(slug,n)=>EXERCISE_REFERENCES[`${slug}:${n}`]||EXERCISE_REFERENCE_SYNCED[`${slug}:${n}`];

test('P9.6 1DS Introdução 01-08 usa somente main.py e todas as referências Python compilam',()=>{
  for(let n=1;n<=8;n++){
    const manifest=EXERCISE_MANIFEST[`introducao-programacao:${n}`];
    const ref=refFor('introducao-programacao',n);
    assert.ok(manifest,`manifest 1DS Python ${n} ausente`);
    assert.deepEqual(manifest.files.map(x=>x.filename),['main.py']);
    assert.ok(ref?.files?.['main.py'],`referência main.py ${n} ausente`);
    const result=spawnSync('python3',['-c','import sys; compile(sys.stdin.read(), "main.py", "exec")'],{input:ref.files['main.py'],encoding:'utf8'});
    assert.equal(result.status,0,`Python inválido no exercício ${n}: ${result.stderr}`);
    assert.ok(ref.files['main.py'].split(/\r?\n/).length>3,`main.py ${n} deve ser multilinha`);
  }
});

test('P9.6 1DS exercícios 06 e 07 preservam indentação e objetivo pedagógico',()=>{
  const ex6=refFor('introducao-programacao',6).files['main.py'];
  const ex7=refFor('introducao-programacao',7).files['main.py'];
  assert.match(ex6,/else:\n    print\(f"\\n--- TABUADA/);
  assert.match(ex6,/    for multiplicador in range\(inicio, fim \+ 1\):/);
  assert.match(ex7,/    ticket_medio = total_vendas \/ quantidade/);
  assert.match(ex7,/    print\(f"\\nTotal vendido:/);
  assert.match(ex7,/pedidos_pequenos/);
  assert.match(ex7,/pedidos_medios/);
  assert.match(ex7,/pedidos_grandes/);
});

test('P9.6 Análise 01-05 usa atividade.md no aluno e referencia.md como orientação',()=>{
  for(let n=1;n<=5;n++){
    const manifest=EXERCISE_MANIFEST[`analise-metodo-sistemas:${n}`];
    const ref=refFor('analise-metodo-sistemas',n);
    assert.deepEqual(manifest.files.map(x=>x.filename),['atividade.md']);
    assert.ok(ref?.files?.['referencia.md']);
    assert.ok(ref.files['referencia.md'].split(/\r?\n/).length>4);
  }
});

test('P9.6 migration protege referências e workspaces canônicos do 1DS',()=>{
  assert.match(migration,/guard_1ds_reference_structure/);
  assert.match(migration,/introducao-programacao/);
  assert.match(migration,/analise-metodo-sistemas/);
  assert.match(migration,/v_filename <> 'main\.py'/);
  assert.match(migration,/v_filename <> 'referencia\.md'/);
  assert.match(migration,/guard_1ds_student_file_structure/);
  assert.match(migration,/lower\(new\.filename\) <> 'atividade\.md'/);
  assert.match(migration,/tg_op='DELETE'/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gitBlobSha,buildReferenceSignatureIndex,classifyEvidence,resolveContentMapping} from '../tools/legacy-github-audit-engine.mjs';

const ex3='# Exercício 03\nnome=input("Nome: ")\nif nome:\n    print(nome)\n';
const ex4='# Exercício 04\nmedia=7\nif media >= 7:\n    print("Aprovado")\n';
const index=buildReferenceSignatureIndex([
  {exerciseNumber:3,filename:'main.py',content:ex3,source:'historical'},
  {exerciseNumber:4,filename:'main.py',content:ex4,source:'historical'},
]);

test('P10.9.3 calcula Git blob SHA compatível com evidência histórica',()=>{
  assert.equal(gitBlobSha('hello\n'),'ce013625030ba8dba906f756967f9e9ca394464a');
});

test('P10.9.3 conteúdo exato prevalece sobre nome de arquivo incorreto',()=>{
  const r=resolveContentMapping({claimedExerciseNumber:4,path:'main.py Exercicio 2',content:ex4,referenceIndex:index});
  assert.equal(r.state,'exact_reference_match');
  assert.equal(r.matchedExerciseNumber,4);
  assert.equal(r.pathExercise,2);
  assert.equal(r.safeForAutomaticCredit,true);
});

test('P10.9.3 impede crédito quando conteúdo pertence a outro exercício',()=>{
  const r=resolveContentMapping({claimedExerciseNumber:1,path:'main.py exercicio 1',content:ex3,referenceIndex:index});
  assert.equal(r.state,'content_matches_other_exercise');
  assert.equal(r.matchedExerciseNumber,3);
  assert.equal(r.safeForAutomaticCredit,false);
  assert.equal(r.pathContentConflict,true);
});

test('P10.9.3 README é documentação e não solução executável',()=>{
  const r=resolveContentMapping({claimedExerciseNumber:2,path:'README.md',content:'# Exercício 02\nComo executar',referenceIndex:index});
  assert.equal(r.state,'documentation_only');
  assert.equal(r.evidence.kind,'documentation');
  assert.equal(r.safeForAutomaticCredit,false);
});

test('P10.9.3 relatório 1DS registra 43 claims sem escrita em produção',()=>{
  const data=JSON.parse(fs.readFileSync('core/tests/fixtures/legacy-github-audit-aggregates-v14.10.8.7.json','utf8')).blocks['1ds'];
  assert.equal(data.claims_audited,43);
  assert.equal(data.students,10);
  assert.equal(data.writes_applied,false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeGitHubTarget,inferExerciseNumber,classifyRepositoryEntries,shouldAutoApproveMapping} from '../tools/legacy-github-mapper.mjs';

const migration=fs.readFileSync('core/database/045_p1092_legacy_github_repository_audit.sql','utf8');
const readonly=fs.readFileSync('migracao/AUDITORIA-GITHUB-LEGADO-READONLY.sql','utf8');

test('P10.9.2 normaliza links de repositório, .git e blob sem perder evidência',()=>{
  assert.deepEqual(normalizeGitHubTarget('https://github.com/matheuscampregher/Atividade_Python.git').repositorySlug,'matheuscampregher/Atividade_Python');
  const file=normalizeGitHubTarget('https://github.com/vidalpaulo-cpu/atividade-de-gabriel/blob/main/Exerc%C3%ADcio%201%20.py');
  assert.equal(file.valid,true);assert.equal(file.targetType,'file');assert.equal(file.branch,'main');
  assert.equal(file.repositorySlug,'vidalpaulo-cpu/atividade-de-gabriel');assert.match(file.filePath,/Exercício 1/);
  assert.equal(normalizeGitHubTarget('https://example.com/a/b').valid,false);
});

test('P10.9.2 reconhece padrões reais e não depende de um único nome de pasta',()=>{
  assert.equal(inferExerciseNumber('exercício16/index.html'),16);
  assert.equal(inferExerciseNumber('Tarefa6.py'),6);
  assert.equal(inferExerciseNumber('atividade-01/index.html'),1);
  assert.equal(inferExerciseNumber('ML13/script.js'),13);
  assert.equal(inferExerciseNumber('README.md'),null);
});

test('P10.9.2 mapeamento separa confiança alta, lacunas e conteúdo extra',()=>{
  const r=classifyRepositoryEntries([
    {name:'ex01',path:'ex01',type:'dir'},
    {name:'ex02',path:'ex02',type:'dir'},
    {name:'ex04',path:'ex04',type:'dir'},
    {name:'exercicio-13-EM-ANDAMENTO.zip',path:'exercicio-13-EM-ANDAMENTO.zip',type:'file'},
  ],[1,2,3]);
  assert.deepEqual(r.missingClaims,[3]);
  assert.equal(r.extraMappings.some(x=>x.exerciseNumber===4),true);
  assert.equal(r.extraMappings.some(x=>x.exerciseNumber===13),true);
  assert.equal(r.ambiguous,true);
  assert.equal(shouldAutoApproveMapping(r.mappings.find(x=>x.exerciseNumber===1)),true);
});

test('P10.9.2 migration candidata cria trilha GitHub sem dar baixa em aluno',()=>{
  for(const table of ['student_repository_submissions','student_repository_audits','student_repository_exercise_audits','student_repository_audit_files']) assert.match(migration,new RegExp(`create table if not exists public\\.${table}`));
  assert.match(migration,/commit_sha/);assert.match(migration,/analysis_version/);assert.match(migration,/teacher_decision/);
  assert.match(migration,/enable row level security/g);assert.match(migration,/revoke all .* from anon, authenticated/);
  assert.doesNotMatch(migration,/update\s+public\.student_exercises/i);
  assert.doesNotMatch(migration,/insert\s+into\s+public\.student_exercises/i);
  assert.doesNotMatch(migration,/update\s+public\.legacy_exercise_claims/i);
  assert.doesNotMatch(migration,/delete\s+from\s+public\.legacy_exercise_claims/i);
});

test('P10.9.2 script de inventário é estritamente read-only',()=>{
  assert.match(readonly,/legacy_exercise_claims/);
  assert.match(readonly,/having count\(distinct student_id\) > 1/i);
  assert.doesNotMatch(readonly,/\b(insert|update|delete|truncate|alter|create|drop)\b/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const manifestSource=read('atividades/assets/data/exercise-manifest.js');
const manifest=JSON.parse(manifestSource.replace(/^export const EXERCISE_MANIFEST = /,'').replace(/;\s*$/,''));
const workspace=read('atividades/assets/js/workspace.js');
const progress=read('core/edge-functions/activity-progress/index.ts');
const sql=read('core/database/032_p80_3ds_ex04_release.sql');
const redirect=read('sistemas/10-lab-exercicios-ds3/modo-aluno/index.html');

test('v14.8 publica novo 3DS Ex04 sem critérios privados no manifesto do aluno',()=>{
  const ex=manifest['programacao-desenvolvimento-sistemas:4'];
  assert.ok(ex);
  assert.equal(ex.titulo,'Exercício 04 — Painel de Prioridades com Filtro Interativo');
  assert.equal(ex.avaliacao?.autoridade,'backend-privado');
  assert.equal(ex.avaliacao?.minimoEntrega,80);
  assert.equal(ex.avaliacao?.githubObrigatorio,true);
  assert.deepEqual(ex.files.map(x=>x.filename),['index.html','estilo.css','script.js']);
  assert.equal(Object.hasOwn(ex,'validacao'),false);
});

test('v14.8 retira do bundle público o conteúdo futuro 3DS 05+',()=>{
  for(let n=5;n<=8;n++)assert.equal(manifest[`programacao-desenvolvimento-sistemas:${n}`],undefined);
  assert.match(sql,/exercise_number >= 5/);
  assert.match(sql,/set visible = false/);
  assert.match(redirect,/atividades\//);
  assert.doesNotMatch(redirect,/exerc[ií]cio 0[4-9]/i);
});

test('v14.8 exige correção server-side, 80% e GitHub para a entrega',()=>{
  assert.match(workspace,/action:'evaluate'/);
  assert.match(workspace,/action:'submit'/);
  assert.match(workspace,/repository_url:repo/);
  assert.match(workspace,/score\|\|0\)<minimum/);
  assert.match(workspace,/exercise-submit-dialog/);
  assert.match(progress,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.match(progress,/server_validation_required/);
  assert.match(progress,/score_below_minimum/);
  assert.match(progress,/normalizeGithubRepository/);
  assert.match(progress,/submission_evidence/);
});

test('v14.8 não embute a configuração privada no frontend público',()=>{
  const publicStudentFiles=[
    'atividades/assets/data/exercise-manifest.js',
    'atividades/assets/js/workspace.js',
    'atividades/assets/js/app.js',
    'atividades/index.html'
  ].map(read).join('\n');
  assert.doesNotMatch(publicStudentFiles,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.doesNotMatch(publicStudentFiles,/html-filtros/);
  assert.doesNotMatch(publicStudentFiles,/js-acessibilidade/);
  assert.equal(fs.existsSync(path.join(root,'AGV-REGRAS-PRIVADAS-v14.8.json')),false);
});

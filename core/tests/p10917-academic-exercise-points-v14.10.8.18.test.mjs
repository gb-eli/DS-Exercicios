import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const release=JSON.parse(read('release-v14.10.8.18.json'));
const version=JSON.parse(read('atividades/version.json'));

test('P10.9.17 metadados representam a release de pontuação acadêmica',()=>{
  assert.equal(release.version,'14.10.8.18');
  assert.equal(release.phase,'P10.9.17-academic-exercise-points');
  assert.equal(release.baseVersion,'14.10.8.17');
  assert.equal(release.runtimeCacheVersion,'14.10.8.18');
  assert.equal(release.lobbyCacheVersion,'14.10.8.18');
  assert.equal(release.requiresDatabaseChange,true);
  assert.equal(release.requiresEdgeFunctionDeploy,true);
  assert.equal(release.liveDeployApplied,false);
  assert.ok(Array.isArray(version.features));
  assert.ok(version.features.some(item=>String(item).includes('v14.10.8.18: valor acadêmico confirmado')));
  assert.ok(/^v14\.10\.8\.(?:18|19)$/.test(String(version.release||'')));
});

test('P10.9.17 migration grava somente as três faixas confirmadas',()=>{
  const sql=read('core/database/048_p10917_academic_exercise_points.sql');
  assert.match(sql,/\('introducao-programacao'::text,\s*1,\s*6,\s*0\.75::numeric\)/);
  assert.match(sql,/\('programacao-front-end'::text,\s*1,\s*20,\s*0\.20::numeric\)/);
  assert.match(sql,/\('programacao-desenvolvimento-sistemas'::text,\s*1,\s*8,\s*0\.50::numeric\)/);
  assert.match(sql,/'academic_max_points'/);
  assert.match(sql,/'academic_points_confirmed',\s*true/);
  assert.match(sql,/'classroom_prints_2026-08-24'/);
  assert.doesNotMatch(sql,/update\s+(?:public\.)?student_exercises\b/i);
  assert.doesNotMatch(sql,/update\s+(?:public\.)?legacy_exercise_claims\b/i);
  assert.doesNotMatch(sql,/update\s+(?:public\.)?student_files\b/i);
});

test('P10.9.17 fallback do aluno não extrapola 1DS depois do exercício 06',()=>{
  const app=read('atividades/assets/js/app.js');
  assert.match(app,/'introducao-programacao':\{from:1,to:6,value:0\.75\}/);
  assert.match(app,/'programacao-front-end':\{from:1,to:20,value:0\.20\}/);
  assert.match(app,/'programacao-desenvolvimento-sistemas':\{from:1,to:8,value:0\.50\}/);
  assert.match(app,/exercise\?\.config\?\.academic_max_points/);
  assert.match(app,/number>=rule\.from&&number<=rule\.to\?rule\.value:null/);
});

test('P10.9.17 aluno recebe valor discreto sem novo card de pontuação',()=>{
  const html=read('atividades/index.html');
  const app=read('atividades/assets/js/app.js');
  const css=read('atividades/assets/css/app.css');
  assert.match(html,/id="exercise-value" class="exercise-value-inline hidden"/);
  assert.match(app,/Vale \$\{formatAcademicPoints\(maxPoints\)\}/);
  assert.match(app,/Valor máximo/);
  assert.match(css,/\.exercise-value-inline/);
  assert.doesNotMatch(html,/academic-(?:score|points)-card/i);
});

test('P10.9.17 professor mostra valor máximo, nota obtida e situação usando submitted_score',()=>{
  const admin=read('atividades/assets/js/admin.js');
  const professor=read('professor/assets/professor.js');
  assert.match(admin,/Valor máximo/);
  assert.match(admin,/Nota obtida/);
  assert.match(admin,/progressStateLabel\(r\)/);
  assert.match(admin,/submitted_score/);
  assert.match(professor,/academicEarnedPoints/);
  assert.match(professor,/submitted_score/);
  assert.match(professor,/Valor máximo \$\{formatAcademicPoints\(max\)\}/);
  assert.match(professor,/Nota obtida/);
  assert.match(professor,/Situação \$\{st\.label\}/);
});

test('P10.9.17 staff-dashboard entrega config e subject_slug para o Console Professor',()=>{
  const edge=read('core/edge-functions/staff-dashboard/index.ts');
  assert.match(edge,/exercise_number,title,active,config/);
  assert.match(edge,/subjects'\)\.select\('id,slug'\)/);
  assert.match(edge,/subject_slug:slugs\.get\(String\(x\.subject_id\)\)\|\|''/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const migration=read('core/database/051_p10922_personalized_learning_experiences.sql');
const student=read('atividades/assets/js/personalized-experience.js');
const app=read('atividades/assets/js/app.js');
const workspace=read('atividades/assets/js/workspace.js');
const admin=read('atividades/assets/js/admin-experiences.js');
const staff=read('core/edge-functions/staff-dashboard/index.ts');
const supervision=read('core/edge-functions/supervision/index.ts');
const supervisionJs=read('atividades/assets/js/supervision.js');
const html=read('atividades/index.html');

function sqlWithoutComments(sql){return sql.replace(/--.*$/gm,'');}

test('migration cria camada paralela sem mutar tabelas convencionais',()=>{
  const sql=sqlWithoutComments(migration).toLowerCase();
  for(const table of ['pedagogical_learning_preferences','pedagogical_experience_assignments','pedagogical_experience_progress','pedagogical_experience_events']) assert.match(sql,new RegExp(`create table if not exists public\\.${table}`));
  assert.doesNotMatch(sql,/\b(update|insert\s+into|delete\s+from)\s+public\.student_exercises\b/);
  assert.doesNotMatch(sql,/\b(update|insert\s+into|delete\s+from)\s+public\.student_files\b/);
  assert.match(sql,/extra_time_minutes integer not null default 0/);
});

test('aluno tem escolha de modo, onboarding e atividades exclusivas independentes',()=>{
  assert.match(html,/personalized-onboarding-dialog/);
  assert.match(html,/personalized-experience-view/);
  assert.match(student,/pedagogical_learning_preferences/);
  assert.match(student,/pedagogical_experience_progress/);
  assert.match(student,/preferred_mode/);
  assert.match(student,/Experiência personalizada/);
  assert.match(student,/Modo convencional/);
  assert.match(student,/function actionableSteps\(steps\)\{return steps;\}/);
  assert.match(student,/step\?\.type==='message'\?'Continuar'/);
  assert.match(student,/LOCAL_PROGRESS_PREFIX/);
  assert.match(student,/Salvo neste dispositivo/);
  assert.match(student,/Continuar de onde parei/);
});

test('workspace registra entrada e saída sem apagar o progresso convencional',()=>{
  assert.match(workspace,/event_type:'experience_opened'/);
  assert.match(workspace,/event_type:'experience_closed'/);
  assert.match(workspace,/source:'workspace'/);
  assert.doesNotMatch(workspace,/delete\(\).*student_exercises/);
});

test('professor/admin recebe acompanhamento, prazo, tempo extra, atribuição e prévia segura',()=>{
  assert.match(admin,/Progresso por disciplina/);
  assert.match(admin,/Tempo extra/);
  assert.match(admin,/Nova atribuição/);
  assert.match(admin,/Visualizar como aluno/);
  assert.match(admin,/NENHUMA AÇÃO SERÁ SALVA PARA O ALUNO/);
  assert.match(admin,/recordedMinutes/);
  assert.match(admin,/Progresso por disciplina/);
  assert.match(admin,/Evidências da atividade/);
  assert.match(admin,/experience-admin-subject/);
  assert.match(admin,/preview-step-navigation/);
  assert.match(admin,/preview-code-frame/);
  assert.match(staff,/act==='experience_overview'/);
  assert.match(staff,/act==='create_experience_assignment'/);
  assert.match(staff,/act==='update_experience_assignment'/);
  assert.match(staff,/act==='log_teacher_preview'/);
});

test('supervisão permite perfis domiciliar/relaxed sem remover as demais proteções base',()=>{
  assert.match(supervision,/mode==='home_study'\|\|mode==='relaxed'/);
  assert.match(supervision,/require_fullscreen:false/);
  assert.match(supervision,/ignore_focus_events:true/);
  assert.doesNotMatch(supervision,/block_paste:false/);
  assert.match(supervisionJs,/\['home_study','relaxed'\]\.includes/);
});

test('bootstrap mantém hotfix de resiliência e integra a experiência personalizada',()=>{
  assert.match(app,/GLOBAL_BOOT_WATCHDOG_MS/);
  assert.match(app,/loadPersonalizedExperienceContext/);
  assert.match(app,/renderPersonalizedExperienceDashboard/);
  assert.match(app,/personalized-experience-view/);
});

test('pacote público mantém roster nominal separado do código versionado',()=>{
  const release=JSON.parse(read('release-current.json'));
  const deploy=JSON.parse(read('PUBLIC-DEPLOY.json'));
  const rosterMigration=read('core/database/049_p10919_pedagogical_adaptations.sql');
  const publicRoots=deploy.publicFrontendPaths||[];
  const forbiddenPublicRoots=['core/database/','core/tests/','core/tools/','docs/','deploy/'];
  assert.equal(release.privacy?.private_roster_seed_separate,true);
  assert.equal(release.privacy?.student_names_in_public_bundle,false);
  assert.equal(release.privacy?.public_deploy_excludes_private_roster_sources,true);
  for(const privateRoot of forbiddenPublicRoots)assert.equal(publicRoots.includes(privateRoot),false,`${privateRoot} não pode ser publicFrontendPath`);
  assert.ok((deploy.neverPublishAsStatic||[]).includes('core/database/'));
  assert.ok((deploy.neverPublishAsStatic||[]).includes('core/tests/'));
  assert.match(rosterMigration,/create table if not exists private\.pedagogical_adaptation_roster/);
  assert.match(rosterMigration,/revoke all on table private\.pedagogical_adaptation_roster from public, anon, authenticated/);
  assert.doesNotMatch(rosterMigration,/insert\s+into\s+private\.pedagogical_adaptation_roster/i);
  const publicText=[read('atividades/assets/js/personalized-experience.js'),read('atividades/assets/js/admin-experiences.js')].join('\n').toLowerCase();
  assert.doesNotMatch(publicText,/private\.pedagogical_adaptation_roster/);
  assert.doesNotMatch(publicText,/diagnosis|diagnóstico|clinical_reason|medical_reason|laudo_text/i);
});

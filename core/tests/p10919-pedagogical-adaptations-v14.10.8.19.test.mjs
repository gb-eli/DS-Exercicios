import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('frontend carrega acomodação global e permite alternar modo',()=>{
  const workspace=read('atividades/assets/js/workspace.js');
  const module=read('atividades/assets/js/adaptations.js');
  const html=read('atividades/index.html');
  assert.match(workspace,/student_accommodations[\s\S]{0,500}\.is\('exercise_id',null\)/);
  assert.match(workspace,/setPedagogicalMode/);
  assert.match(module,/persistAdaptationMode/);
  assert.match(module,/adaptation-choice-dialog/);
  assert.match(html,/id="adaptation-mode-banner"/);
  assert.match(html,/id="adaptation-choice-dialog"/);
});

test('modo domiciliar remove somente exigências de supervisão presencial',()=>{
  const supervision=read('core/edge-functions/supervision/index.ts');
  assert.match(supervision,/accommodation_mode:'home_study'/);
  assert.match(supervision,/require_fullscreen:false/);
  assert.doesNotMatch(supervision,/block_paste:false/);
  assert.match(supervision,/ignore_focus_events:true/);
  assert.match(supervision,/block_external_network:true/); // política base continua segura
  assert.match(supervision,/requireLiveAuthSession/);
  assert.match(supervision,/ensureAccess/);
});

test('roster individual não fica versionado no migration público',()=>{
  const migration=read('core/database/049_p10919_pedagogical_adaptations.sql').toLowerCase();
  assert.doesNotMatch(migration,/insert\s+into\s+public\.pedagogical_adaptation_roster\s*\(/);
  assert.doesNotMatch(migration,/clinical_reason|medical_reason|diagnosis_text|report_document/i);
  assert.match(migration,/nomes de alunos.*não são versionados/s);
});

test('painel professor recebe acomodação global sem expor diagnóstico',()=>{
  const staff=read('core/edge-functions/staff-dashboard/index.ts');
  const admin=read('atividades/assets/js/admin.js');
  assert.match(staff,/!z\.exercise_id\|\|ei\.has/);
  assert.match(admin,/Apoio pedagógico individualizado/);
  assert.equal(/autis|laudo|diagn[oó]stic/i.test(admin),false);
});


test('solicitação do aluno não coleta diagnóstico e chega ao painel docente',()=>{
  const migration=read('core/database/049_p10919_pedagogical_adaptations.sql');
  const adaptations=read('atividades/assets/js/adaptations.js');
  const staff=read('core/edge-functions/staff-dashboard/index.ts');
  const admin=read('atividades/assets/js/admin.js');
  assert.match(migration,/pedagogical_adaptation_requests/);
  assert.match(migration,/student_id=\(select auth\.uid\(\)\)/);
  assert.doesNotMatch(migration,/diagnosis|diagnóstico|laudo_text|medical_reason/i);
  assert.match(adaptations,/Solicitar adaptação/);
  assert.match(staff,/resolve_adaptation_request/);
  assert.match(admin,/Aplicar apoio guiado/);
});



test('preferência de modo persiste no Supabase e roster fica no schema private',()=>{
  const migration=read('core/database/049_p10919_pedagogical_adaptations.sql');
  const adaptations=read('atividades/assets/js/adaptations.js');
  const workspace=read('atividades/assets/js/workspace.js');
  assert.match(migration,/private\.pedagogical_adaptation_roster/);
  assert.match(migration,/pedagogical_adaptation_preferences/);
  assert.match(migration,/mode in \('adapted','conventional'\)/);
  assert.match(adaptations,/loadAdaptationPreference/);
  assert.match(adaptations,/pedagogical_adaptation_preferences/);
  assert.match(workspace,/loadAdaptationPreference/);
});

test('migration reconhece acomodações legadas adapted_mode',()=>{
  const migration=read('core/database/049_p10919_pedagogical_adaptations.sql');
  assert.match(migration,/where accommodation_type='adapted_mode'/);
  assert.match(migration,/accommodation_type='learning_mode'/);
  assert.match(migration,/student_accommodation_presets/);
});

test('manifesto candidato v14.10.8.19 registra banco e Edge Functions pendentes',()=>{
  const release=JSON.parse(read('release-v14.10.8.19.json'));
  assert.equal(release.version,'14.10.8.19');
  assert.equal(release.requiresDatabaseChange,true);
  assert.equal(release.requiresEdgeFunctionDeploy,true);
  assert.equal(release.liveDeployApplied,false);
});


test('R4 oferece ajuda extra, destaque de etapa e suporte de código sem resposta pronta',()=>{
  const module=read('atividades/assets/js/adaptations.js');
  const css=read('atividades/assets/css/app.css');
  assert.match(module,/extraHelp:Boolean/);
  assert.match(module,/codeHelp:Boolean/);
  assert.match(module,/termExplanations:Boolean/);
  assert.match(module,/contentExplanations:Boolean/);
  assert.match(module,/Ajuda extra · conteúdo, termos e código/);
  assert.match(module,/Ela não entrega a resposta pronta/);
  assert.match(module,/updateCurrentStepHighlight/);
  assert.match(css,/pedagogical-step-list li\.current/);
});

test('R4 possui orientação domiciliar detalhada e retomável',()=>{
  const module=read('atividades/assets/js/adaptations.js');
  assert.match(module,/Como organizar o estudo em casa/);
  assert.match(module,/Antes de começar/);
  assert.match(module,/Se travar/);
  assert.match(module,/Antes de enviar/);
});


test('R4 sincroniza progresso das etapas com RLS individual',()=>{
  const migration=read('core/database/050_p10919_pedagogical_adaptations_r4.sql');
  const adaptations=read('atividades/assets/js/adaptations.js');
  const workspace=read('atividades/assets/js/workspace.js');
  assert.match(migration,/pedagogical_adaptation_progress/);
  assert.match(migration,/student_id=\(select auth\.uid\(\)\)/);
  assert.match(adaptations,/loadAdaptationStepProgress/);
  assert.match(adaptations,/persistAdaptationStepProgress/);
  assert.match(workspace,/loadAdaptationStepProgress/);
});

test('R4 estudo domiciliar usa metadados ricos e não pune troca de guia',()=>{
  const adaptations=read('atividades/assets/js/adaptations.js');
  const client=read('atividades/assets/js/supervision.js');
  const server=read('core/edge-functions/supervision/index.ts');
  assert.match(adaptations,/Por que esta etapa existe/);
  assert.match(adaptations,/Como saber se deu certo/);
  assert.match(adaptations,/Ajuda progressiva — abra somente se precisar/);
  assert.match(client,/accommodation_mode==='home_study'\)return/);
  assert.match(server,/ignoredFocus/);
  assert.match(server,/adaptationPolicy\(user\.id,s\.exercise_id/);
});

test('R4 preset docente inclui conjunto completo de apoio',()=>{
  const admin=read('atividades/assets/js/admin.js');
  assert.match(admin,/guided_code_help:true/);
  assert.match(admin,/term_explanations:true/);
  assert.match(admin,/content_explanations:true/);
  assert.match(admin,/micro_steps:true/);
});

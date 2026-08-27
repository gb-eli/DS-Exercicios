import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const progress=read('core/edge-functions/activity-progress/index.ts');
const sessionGuard=read('core/edge-functions/activity-progress/session-guard.ts');
const rls=read('core/database/033_p89_student_files_access_hardening.sql');
const serverRules=read('core/database/034_p89_server_validation_public.sql');
const progressLock=read('core/database/035_p89_student_exercises_server_only.sql');
const workspace=read('atividades/assets/js/workspace.js');
const version=JSON.parse(read('atividades/version.json'));
const release=JSON.parse(read('release-current.json'));

test('v14.8.9 fecha escrita direta de student_files fora da liberação',()=>{
  assert.match(rls,/student_can_work_on_exercise/);
  assert.match(rls,/cm\.is_primary = true/);
  assert.match(rls,/e\.active = true/);
  assert.match(rls,/e\.visible = true/);
  assert.match(rls,/security_locked = true/);
  assert.match(rls,/sr\.student_id = p_student/);
  assert.match(rls,/cr\.class_id = cm\.class_id/);
  assert.match(rls,/create policy student_files_insert_own/);
  assert.match(rls,/create policy student_files_update_own/);
});


test('v14.8.9 reserva mutações de student_exercises ao servidor',()=>{
  assert.match(progressLock,/revoke insert, update, delete on table public\.student_exercises from anon, authenticated/);
  assert.match(progressLock,/drop policy if exists student_exercises_insert_own/);
  assert.match(progressLock,/drop policy if exists student_exercises_update_own/);
});

test('v14.8.9 activity-progress exige sessão viva e mantém validação privada server-side',()=>{
  assert.match(progress,/requireLiveAuthSession/);
  assert.match(sessionGuard,/security_is_auth_session_active_service/);
  assert.match(progress,/SERVER_VALIDATED_KEYS/);
  assert.match(progress,/AGV_PRIVATE_EXERCISE_RULES_V1/);
  assert.match(progress,/server_validation_required/);
});

test('v14.8.9 replica somente validações públicas suportadas do 1DS 01-08',()=>{
  for(let n=1;n<=8;n++) assert.match(serverRules,new RegExp(`'introducao-programacao', ${n},`));
  assert.doesNotMatch(serverRules,/programacao-desenvolvimento-sistemas/);
  assert.doesNotMatch(serverRules,/backend-privado/);
  assert.doesNotMatch(serverRules,/AGV_PRIVATE_EXERCISE_RULES_V1/);
});

test('frontend trata recusa da autocorreção server-side sem forjar nota',()=>{
  assert.match(workspace,/active_supervised_session_required:'A sessão supervisionada precisa estar ativa para autocorrigir\.'/);
  assert.match(workspace,/reference_unavailable:'A referência oficial está temporariamente indisponível\.'/);
  assert.match(workspace,/if\(!evaluation\)return/);
});

test('release ativo está coerente com Etapa 4',()=>{
  const [uiMajor,uiMinor,uiPatch]=String(version.version).split('.').map(Number);
  const [major,minor,patch]=String(release.version).split('.').map(Number);
  assert.ok(uiMajor>0||(uiMajor===0&&(uiMinor>20||(uiMinor===20&&uiPatch>=9))));
  assert.equal(version.release,`v${release.version}`);
  assert.ok(major>14||(major===14&&(minor>8||(minor===8&&patch>=9))));
  assert.equal(typeof release.requiresDatabaseChange,'boolean');
  assert.equal(typeof release.requiresEdgeFunctionDeploy,'boolean');
  assert.equal(typeof release.liveDeployApplied,'boolean');
});

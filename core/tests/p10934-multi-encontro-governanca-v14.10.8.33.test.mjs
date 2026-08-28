import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('collective exam is manually finished and supports home continuation',()=>{
  const edge=read('core/edge-functions/practical-exam/index.ts');
  const student=read('prova/assets/student.js');
  const admin=read('prova/assets/admin.js');
  assert.doesNotMatch(edge,/s\.status === "running" && remaining\(s\) <= 0/);
  assert.match(edge,/session_home_continuation/);
  assert.match(edge,/session_resume_class/);
  assert.match(student,/CONTINUAÇÃO EM CASA LIBERADA/);
  assert.match(student,/sem encerramento automático/);
  assert.match(admin,/Encerrar encontro • continuar em casa/);
  assert.match(admin,/Encerrar avaliação definitivamente/);
});

test('leader governance has quorum, ready check and teacher-controlled member changes',()=>{
  const edge=read('core/edge-functions/practical-exam/index.ts');
  const student=read('prova/assets/student.js');
  const admin=read('prova/assets/admin.js');
  assert.match(edge,/const quorum=Math\.floor\(valid\.size\/2\)\+1/);
  assert.match(edge,/ready_check_pending/);
  assert.match(edge,/accept_role/);
  assert.match(edge,/leader_member_removal_requested/);
  assert.match(edge,/resolve_member_removal/);
  assert.match(edge,/staff_set_leader/);
  assert.match(student,/Aceitar missão • READY/);
  assert.match(student,/Solicitar troca/);
  assert.match(admin,/Definir líder/);
  assert.match(admin,/Solicitações de troca de integrante/);
});

test('final mission is squad-gated by occupied roles',()=>{
  const edge=read('core/edge-functions/practical-exam/index.ts');
  const student=read('prova/assets/student.js');
  assert.match(edge,/requiredIndividualKeys/);
  assert.match(edge,/String\(c\.challenge_key\)==="final"/);
  assert.match(edge,/squad_gate/);
  assert.match(student,/MISSÃO FINAL BLOQUEADA/);
  assert.match(student,/HANDOFF DE EQUIPE/);
});

test('teacher can supervise guild chat and mobile has compact mission view',()=>{
  const edge=read('core/edge-functions/practical-exam/index.ts');
  const admin=read('prova/assets/admin.js');
  const student=read('prova/assets/student.js');
  const css=read('prova/assets/prova.css');
  assert.match(edge,/team_chat:staffChat/);
  assert.match(admin,/Chat das guildas/);
  assert.match(admin,/somente leitura/i);
  assert.match(student,/Minha missão \+ equipe/);
  assert.match(student,/RECONNECTING SQUAD/);
  assert.match(css,/challenge-list\[data-filter="mine"\]/);
  assert.match(css,/@media\(max-width:760px\)/);
});

test('cache and release metadata are bumped',()=>{
  assert.match(read('prova/index.html'),/14\.10\.8\.33/);
  const release=JSON.parse(read('release-v14.10.8.33.json'));
  assert.equal(release.compatibility.requires_new_migration,false);
  assert.equal(release.assessment_operation.automatic_finish,false);
  assert.equal(release.assessment_operation.teacher_controls_final_finish,true);
});

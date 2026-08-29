import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(p,'utf8');
const staff = read('core/edge-functions/staff-dashboard/index.ts');
const teacher = read('professor/assets/professor.js');
const admin = read('admin/assets/admin.js');
const embedded = read('atividades/assets/js/admin.js');

test('P10.5 staff overview entrega tentativas e bloqueios usados pelos painéis',()=>{
  assert.match(staff,/progress_percent,attempts,started_at,auto_score/);
  assert.match(staff,/security_locked,security_lock_reason,security_locked_at/);
});

test('P10.5 Console Professor escolhe atividade recente por timestamp real de student_exercises',()=>{
  assert.match(teacher,/last_activity_at\|\|r\.submitted_at\|\|r\.auto_score_at\|\|r\.completed_at\|\|r\.started_at/);
  assert.doesNotMatch(teacher,/timeValue\(b\.updated_at\|\|b\.last_seen_at/);
});

test('P10.5 entrega parcial aparece explicitamente no professor e no admin',()=>{
  assert.match(teacher,/info\.partial\?'Entrega parcial'/);
  assert.match(teacher,/Melhor nota/);
  assert.match(admin,/Entregas parciais/);
  assert.match(admin,/Fila de acompanhamento/);
  assert.match(admin,/Tentativas/);
  assert.match(embedded,/Entregas parciais/);
  assert.match(embedded,/progressStateLabel/);
});

test('P10.5 ajustes solicitados reabrem atividade e aprovação manual conclui',()=>{
  assert.match(staff,/manual_review_approved/);
  assert.match(staff,/manual_review_changes_requested/);
  assert.match(staff,/status:'in_progress'/);
  assert.match(staff,/progress_percent:Math\.min\(99/);
  assert.match(staff,/completed_at:null/);
});

test('P10.5 pending count usa approval_status changes_requested e considera parcial',()=>{
  assert.match(admin,/x\.approval_status==='changes_requested'/);
  assert.match(admin,/isPartial\(x\)/);
  assert.match(admin,/function pendingCount[\s\S]*?x\.approval_status==='changes_requested'[\s\S]*?isPartial\(x\)/);
});

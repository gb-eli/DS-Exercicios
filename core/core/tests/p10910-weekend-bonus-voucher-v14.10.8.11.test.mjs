import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('atividades/index.html');
const workspace=read('atividades/assets/js/workspace.js');
const admin=read('atividades/assets/js/admin.js');
const css=read('atividades/assets/css/app.css');
const adminCss=read('atividades/assets/css/admin.css');
const edge=read('core/edge-functions/weekend-bonus-voucher/index.ts');
const migration=read('core/database/047_p10910_weekend_bonus_vouchers.sql');

 test('P10.9.10 student notification is closable and clearly grants +1 point with a redeemable code',()=>{
  assert.match(html,/id="weekend-reward-close"/);
  assert.match(html,/\+1 ponto extra/);
  assert.match(html,/id="weekend-reward-code"/);
  assert.match(html,/id="weekend-reward-copy"/);
  assert.match(html,/envie este código ao professor/i);
  assert.match(html,/id="weekend-voucher-open"/);
  assert.match(css,/\.weekend-reward-close/);
  assert.match(css,/\.weekend-voucher-box/);
});

test('P10.9.10 voucher code is opaque, short and has no client-supplied identity or reward amount',()=>{
  assert.match(edge,/FDS-\$\{x\.slice\(0,4\)\}-\$\{x\.slice\(4,8\)\}/);
  assert.match(edge,/ABCDEFGHJKLMNPQRSTUVWXYZ23456789/);
  assert.doesNotMatch(edge,/body\.student_name/);
  assert.doesNotMatch(edge,/body\.reward_points/);
  assert.match(migration,/code text not null unique check \(code ~ '\^FDS-/);
  assert.match(migration,/comment on column public\.weekend_bonus_vouchers\.code[\s\S]*Não contém nome, turma/);
});

test('P10.9.10 issuance is server-clock gated and idempotent per student/weekend',()=>{
  assert.match(edge,/weekendWindow\(Date\.now\(\)\)/);
  assert.match(edge,/if\(!window\.eligible\|\|!window\.weekendId\)/);
  assert.match(edge,/\.eq\("student_id",user\.id\)\.eq\("weekend_id",window\.weekendId\)/);
  assert.match(migration,/unique \(student_id, weekend_id\)/);
  assert.match(migration,/reward_points numeric\(4,2\) not null default 1\.00 check \(reward_points = 1\.00\)/);
});

test('P10.9.10 voucher table is server-only and does not mutate student grades',()=>{
  assert.match(migration,/alter table public\.weekend_bonus_vouchers enable row level security/);
  assert.match(migration,/revoke all on table public\.weekend_bonus_vouchers from anon, authenticated/);
  assert.doesNotMatch(edge,/from\("student_exercises"\)\.update/);
  assert.doesNotMatch(edge,/submitted_score/);
  assert.doesNotMatch(edge,/auto_score/);
  assert.doesNotMatch(migration,/student_exercises[\s\S]*update/i);
});

test('P10.9.10 professor can verify metadata and redeem exactly once within assigned scope',()=>{
  assert.match(admin,/id="staff-weekend-voucher-btn"/);
  assert.match(admin,/id="weekend-voucher-code-input"/);
  assert.match(admin,/Verificar código/);
  assert.match(admin,/Marcar \+1 ponto como resgatado/);
  assert.match(admin,/student_name/);
  assert.match(admin,/class_code/);
  assert.match(admin,/issued_at/);
  assert.match(admin,/reason/);
  assert.match(edge,/teacher_classes/);
  assert.match(edge,/voucher_out_of_scope/);
  assert.match(edge,/\.is\("redeemed_at",null\)\.is\("revoked_at",null\)/);
  assert.match(edge,/already_redeemed/);
  assert.match(adminCss,/\.weekend-voucher-admin-grid/);
});

test('P10.9.10 closing the popup does not lose the voucher because banner can reopen it',()=>{
  assert.match(workspace,/openWeekendRewardDialog/);
  assert.match(workspace,/ensureWeekendVoucher/);
  assert.match(workspace,/weekend-voucher-open/);
  assert.match(workspace,/weekend-reward-close/);
  assert.match(workspace,/state\.weekend\.voucher/);
  assert.match(edge,/already_issued/);
});

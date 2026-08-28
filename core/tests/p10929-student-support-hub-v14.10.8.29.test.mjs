import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const student=read('atividades/assets/js/support-hub.js');
const staff=read('atividades/assets/js/admin-support.js');
const app=read('atividades/assets/js/app.js');
const admin=read('atividades/assets/js/admin.js');
const html=read('atividades/index.html');
const edge=read('core/edge-functions/staff-dashboard/index.ts');
const sql=read('core/database/058_p10929_student_support_hub.sql');

for(const table of ['student_support_threads','student_support_messages','student_focus_checkins','student_support_notifications']){
  assert.match(sql,new RegExp(`create table if not exists public\\.${table}`));
  assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`));
}
assert.match(sql,/student_id=\(select auth\.uid\(\)\)/);
assert.match(sql,/grant select, update\(read_at\)/);
assert.doesNotMatch(sql,/create table[^;]+realtime\./i);
assert.doesNotMatch(`${student}\n${staff}\n${sql}`,/maria fernanda|natan|andré|andre|@escola\.pr\.gov\.br/i);

assert.match(student,/CATEGORY_META/);
assert.match(student,/focus_check_interval_minutes/);
assert.match(student,/student_support_notifications/);
assert.match(student,/não concede XP|não altera a economia|checkpoint de esforço/i);
assert.match(app,/initializeStudentSupportHub/);
assert.match(app,/destroyStudentSupportHub/);
assert.match(html,/support-hub\.css\?v=14\.10\.8\.29/);
assert.match(html,/app\.js\?v=14\.10\.8\.29/);

for(const action of ['support_overview','support_reply','support_set_status','support_send_notification'])assert.match(edge,new RegExp(`act==='${action}'`));
assert.match(edge,/await scope\(String\(thread\.student_id\)\)/);
assert.match(edge,/await scope\(studentId\)/);
assert.match(admin,/openSupportCenter/);
assert.match(staff,/Canal privado entre aluno e professor/);
assert.match(staff,/não concede XP ou nota/);

console.log('OK: Central de Apoio v14.10.8.29 validada (UI, ações staff, RLS, privacidade e cache-bust).');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const edge=read('core/edge-functions/staff-dashboard/index.ts');
const sql=read('core/database/058_p10929_student_support_hub.sql');
const student=read('atividades/assets/js/support-hub.js');
const staff=read('atividades/assets/js/admin-support.js');
const html=read('atividades/index.html');
let passed=0;
const check=(name,fn)=>{fn();passed++;console.log(`PASS ${passed}: ${name}`)};

check('assets atuais da Central usam cache v65',()=>{assert.match(html,/support-hub\.css\?v=14\.10\.8\.65/);assert.match(html,/app\.js\?v=14\.10\.8\.65/)});
check('RLS existe nas quatro tabelas de suporte',()=>{for(const t of ['student_support_threads','student_support_messages','student_focus_checkins','student_support_notifications'])assert.match(sql,new RegExp(`alter table public\\.${t} enable row level security`))});
check('aluno lê somente threads próprias',()=>assert.match(sql,/student_support_threads_select_own[\s\S]+student_id=\(select auth\.uid\(\)\)/));
check('aluno lê e insere mensagens somente em thread própria',()=>{assert.match(sql,/student_support_messages_select_own_thread[\s\S]+t\.student_id=\(select auth\.uid\(\)\)/);assert.match(sql,/student_support_messages_insert_own_thread[\s\S]+author_id=\(select auth\.uid\(\)\)/)});
check('notificação permite ao aluno alterar somente read_at',()=>assert.match(sql,/grant select, update\(read_at\) on table public\.student_support_notifications to authenticated/));
check('professor consulta memberships somente das turmas assigned',()=>assert.match(edge,/class_memberships'\)\.select\('class_id,user_id,is_primary,active'\)\.eq\('active',true\)\.in\('class_id',assigned\)/));
check('professor consulta profiles somente dos IDs permitidos',()=>assert.match(edge,/profiles'\)\.select\('id,full_name,email,last_login_at'\)\.eq\('role','student'\)\.eq\('active',true\)\.in\('id',ids\)/));
check('threads e check-ins são consultados somente no escopo permitido',()=>{assert.match(edge,/student_support_threads'\)\.select\('\*'\)\.in\('student_id',ids\)/);assert.match(edge,/student_focus_checkins'\)[\s\S]*?\.in\('student_id',ids\)/)});
check('escritas staff passam por scope',()=>{for(const action of ['support_reply','support_set_status','support_send_notification'])assert.match(edge,new RegExp(`if\\(act==='${action}'\\)[\\s\\S]{0,1200}?await scope\\(`))});
check('mensagem de professor não concede XP ou nota',()=>assert.match(staff,/não concede XP ou nota/i));
check('Central do aluno não promete recompensa econômica',()=>assert.match(student,/não concede XP|não altera a economia|checkpoint de esforço/i));
check('nenhum aluno nominal é codificado no módulo',()=>assert.doesNotMatch(`${student}\n${staff}\n${sql}`,/maria fernanda|natan|andré|andre|@escola\.pr\.gov\.br/i));
console.log(`OK: Etapa 25 Central de Apoio ${passed}/12 PASS`);

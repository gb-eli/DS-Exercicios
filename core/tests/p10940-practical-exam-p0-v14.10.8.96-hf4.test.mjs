import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('P10940 expands normal teams to 3–7 and preserves explicit individual exception',()=>{
  const fn=read('core/edge-functions/practical-exam/index.ts');
  const sql=read('core/database/080_p10940_practical_exam_p0_teams_roles.sql');
  assert.match(fn,/max_clan_size:\s*clamp\(Number\(b\.max_clan_size \|\| 7\), 3, 7\)/);
  assert.match(fn,/teams_below_minimum_size/);
  assert.match(fn,/individual_allowed===true&&count===1/);
  assert.match(sql,/add column if not exists individual_allowed boolean not null default false/i);
  assert.match(sql,/add column if not exists join_locked boolean not null default false/i);
});

test('P10940 gives role choice to the student and serializes the reservation in SQL',()=>{
  const fn=read('core/edge-functions/practical-exam/index.ts');
  const sql=read('core/database/080_p10940_practical_exam_p0_teams_roles.sql');
  const student=read('prova/assets/student.js');
  assert.match(fn,/act === "select_role"/);
  assert.match(fn,/a\.rpc\("practical_exam_select_role"/);
  assert.doesNotMatch(fn,/role_assignment_by_leader/);
  assert.match(fn,/role_self_selection_required/);
  assert.match(sql,/pg_advisory_xact_lock/);
  assert.match(sql,/role_self_selected/);
  assert.match(student,/data-select-role=/);
  assert.match(student,/Cada integrante escolhe um cargo livre/);
  assert.doesNotMatch(student,/data-leader-role=/);
});

test('P10940 adds teacher governance without hard-coding a student identity',()=>{
  const fn=read('core/edge-functions/practical-exam/index.ts');
  const admin=read('prova/assets/admin.js');
  const sql=read('core/database/080_p10940_practical_exam_p0_teams_roles.sql');
  for(const token of ['staff_update_clan_policy','staff_rename_clan','identity_locked','join_locked','individual_allowed']) assert.match(fn,new RegExp(token));
  for(const token of ['Fechar entradas','Autorizar individual','Bloquear identidade','Renomear equipe']) assert.match(admin,new RegExp(token));
  assert.doesNotMatch(fn,/\bLuna\b|\bAna Beatriz\b|\bMaria Fernanda\b/i);
  assert.doesNotMatch(sql,/\bLuna\b|\bAna Beatriz\b|\bMaria Fernanda\b/i);
});

test('P10940 keeps the two requested subject templates and eight optional roles',()=>{
  const fn=read('core/edge-functions/practical-exam/index.ts');
  assert.match(fn,/subject_name: "Análise e Método para Sistemas"/);
  assert.match(fn,/subject_name: "Inovação Tecnológica e Empreendedorismo"/);
  const roleLines=[...fn.matchAll(/^\s*\["(?:analysis|backend|frontend|database|qa|designer|cyber|business)"/gm)];
  assert.equal(roleLines.length,8);
  assert.match(fn,/até 7 das 8 áreas/);
});

test('P10940 keeps meaningful role coverage in both practical templates',()=>{
  const fn=read('core/edge-functions/practical-exam/index.ts');
  const marker=fn.indexOf('innovation_2ds:');
  assert.ok(marker>0);
  const one=fn.slice(fn.indexOf('analysis_methods_1ds:'),marker),two=fn.slice(marker);
  for(const chunk of [one,two]){
    for(const role of ['analysis','backend','frontend','database','qa','designer','cyber','business']){
      const pattern=new RegExp(`"individual",\\s*"${role}"`,'g');
      assert.ok((chunk.match(pattern)||[]).length>=2,`cargo ${role} precisa de pelo menos 2 desafios individuais`);
    }
    assert.ok((chunk.match(/\"clan\",\s*null/g)||[]).length>=2,'cada template precisa de desafios coletivos');
  }
});

test('CGM self-service password recovery remains wired in the unified auth flow',()=>{
  const auth=read('auth/auth.js');
  const session=read('core/session/agv-session.js');
  const fn=read('core/edge-functions/temporary-cgm-password-reset/index.ts');
  assert.match(auth,/temporaryCgmPasswordReset\(email,cgm\)/);
  assert.match(session,/functions\/v1\/temporary-cgm-password-reset/);
  assert.match(fn,/must_change_password:\s*true/);
  assert.match(fn,/@escola\.pr\.gov\.br/);
});

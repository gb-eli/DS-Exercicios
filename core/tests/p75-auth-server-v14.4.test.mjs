import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const privileged=[
  'core/edge-functions/staff-dashboard/index.ts',
  'core/edge-functions/admin-profile-user/index.ts',
  'core/edge-functions/admin-roster/index.ts',
  'core/edge-functions/staff-directory/index.ts',
  'core/edge-functions/agv-teacher-activity/index.ts',
  'core/edge-functions/security-telemetry/index.ts',
  'core/edge-functions/lobby-moderation/index.ts',
  'core/edge-functions/supervision/index.ts'
];

test('P7.5: endpoints privilegiados consideram must_change_password',()=>{
  for(const file of privileged){
    const code=read(file);
    assert.match(code,/must_change_password/,`${file} não consulta/bloqueia senha temporária`);
  }
});

test('P7.5: endpoints administrativos centrais retornam bloqueio explícito',()=>{
  for(const file of privileged.slice(0,6)){
    const code=read(file);
    assert.match(code,/password_change_required/,`${file} não retorna password_change_required`);
  }
});

test('P7.5: Admin e Professor redirecionam senha temporária ao fluxo obrigatório',()=>{
  const admin=read('admin/assets/admin.js');
  const professor=read('professor/assets/professor.js');
  assert.match(admin,/password_change_required/);
  assert.match(admin,/\.\.\/atividades\//);
  assert.match(professor,/password_change_required/);
  assert.match(professor,/\.\.\/atividades\//);
});

test('P7.5: pacote não promete revogação Auth ainda não validada ao vivo',()=>{
  const admin=read('admin/assets/admin.js');
  assert.match(admin,/NÃO revoga a sessão de login do Supabase/);
});

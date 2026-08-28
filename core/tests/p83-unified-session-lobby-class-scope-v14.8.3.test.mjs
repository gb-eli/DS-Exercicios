import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Hub preserva sessão ao encaminhar primeiro acesso para troca de senha',()=>{
  const hub=read('assets/hub.js');
  assert.match(hub,/must_change_password\)\{location\.replace\('atividades\/'\);return \{redirected:true/);
  assert.match(hub,/if\(result\?\.redirected\)return;renderSigned\(\)/);
  assert.doesNotMatch(hub,/must_change_password[\s\S]{0,120}signOut/);
});

test('Lobby e Atividades usam explicitamente a sessão Supabase canônica',()=>{
  for(const file of ['lobby/assets/supabase.js','atividades/assets/js/supabase.js']){
    const s=read(file);
    assert.match(s,/AUTH_STORAGE_KEY='sb-iresvqwyaqotghjssncg-auth-token'/);
    assert.match(s,/storageKey:AUTH_STORAGE_KEY/);
    assert.match(s,/persistSession:true/);
  }
});

test('Lobby aceita todos os papéis autenticados previstos e backend de presença também',()=>{
  const lobby=read('lobby/assets/lobby.js');
  const presence=read('core/edge-functions/lobby-presence/index.ts');
  for(const role of ['student','teacher','admin','super_admin']){
    assert.ok(lobby.includes(`'${role}'`),`papel ${role} ausente no Lobby`);
    assert.ok(presence.includes(`'${role}'`),`papel ${role} ausente no lobby-presence`);
  }
  assert.match(lobby,/Professor|Administrador|Super Admin/);
});

test('Atividades do aluno são filtradas por turma no frontend e revalidadas no backend',()=>{
  const app=read('atividades/assets/js/app.js');
  assert.match(app,/class_subjects'\)\.select\('subject_id'\)\.eq\('class_id',\s*currentClass\.id\)/);
  assert.match(app,/exercise_releases'\).*\.eq\('class_id',currentClass\.id\)/s);
  for(const file of ['core/edge-functions/activity-progress/index.ts','core/edge-functions/student-files/index.ts']){
    const s=read(file);
    assert.match(s,/class_memberships/);
    assert.match(s,/class_subjects/);
    assert.match(s,/exercise_forbidden/);
    assert.match(s,/belongs/);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('v14.10.8.36 practical exam has persistent guild governance',()=>{
  const s=read('core/edge-functions/practical-exam/index.ts');
  for(const token of ['vote_leader','leader_update_room','accept_role','leader_request_member_removal','staff_set_leader','resolve_member_removal','team_chat_send','completion_mode:"manual"']) assert.match(s,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(s,/leader_id/);
  assert.match(s,/company_name/);
});

test('access management is server-side, audited and scoped',()=>{
  const s=read('core/edge-functions/admin-access-management/index.ts');
  assert.match(s,/updateUserById/);
  assert.match(s,/aal2_required/);
  assert.match(s,/password_reset_initial_batch/);
  assert.match(s,/mode==="class"/);
  assert.match(s,/mode==="shift"/);
  assert.doesNotMatch(s,/service_role[^\n]*return|SUPABASE_SERVICE_ROLE_KEY[^\n]*J\(/i);
});

test('admin exposes Gestão de Acessos without exposing raw CGM/password',()=>{
  const html=read('admin/index.html'),js=read('admin/assets/admin.js'),cfg=read('admin/assets/config.js');
  assert.match(html,/Gestão de Acessos/);
  assert.match(cfg,/admin-access-management/);
  assert.match(js,/Redefinir para senha inicial/);
  assert.match(js,/Senha temporária individual/);
  assert.match(js,/CGMs não aparecem nesta tela/);
});

test('student Activities treats staff check as optional',()=>{
  const js=read('atividades/assets/js/app.js');
  assert.match(js,/Verificação complementar de staff indisponível; seguindo com o perfil principal/);
  assert.match(js,/staff_status/);
});

test('Lobby runtime is release-consistent and network-first',()=>{
  const files=['index.html','assets/boot.js','assets/vendor-loader.js','assets/lobby.js','assets/lobby3d.js','assets/supabase.js','assets/sw-register.js','assets/diagnostics.js','sw.js'];
  for(const f of files){const s=read('lobby/'+f);assert.match(s,/14\.10\.8\.35/);assert.doesNotMatch(s,/14\.10\.8\.(18(?:\.2)?|19\.1|28|29|30|31|32|33|34)/);}
  assert.doesNotMatch(read('lobby/assets/lobby-lite.js'),/14\.10\.8\.(18(?:\.2)?|19\.1|28|29|30|31|32|33|34)/);
  const sw=read('lobby/sw.js');assert.match(sw,/networkFirstLocal/);assert.match(sw,/cache:'no-store'/);
  const diag=read('lobby/assets/diagnostics.js');assert.match(diag,/runtime_error/);assert.match(diag,/column/);
});

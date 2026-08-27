import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=(p)=>readFile(new URL(`../../${p}`,import.meta.url),'utf8');

test('Hub solicita e-mail + CGM e usa função temporária server-side',async()=>{
  const html=await read('index.html');
  const js=await read('assets/hub.js');
  const session=await read('core/session/agv-session.js');
  assert.match(html,/id="recovery-cgm"/);
  assert.match(html,/Redefinir senha para CGM/);
  assert.match(js,/temporaryCgmPasswordReset\(email,cgm\)/);
  assert.match(session,/functions\/v1\/temporary-cgm-password-reset/);
});

test('Atividades solicita e-mail + CGM e invoca Edge Function',async()=>{
  const html=await read('atividades/index.html');
  const js=await read('atividades/assets/js/app.js');
  assert.match(html,/id="recovery-cgm"/);
  assert.match(js,/functions\.invoke\('temporary-cgm-password-reset'/);
  assert.match(js,/body: \{ email, cgm \}/);
});

test('Lobby solicita e-mail + CGM e invoca Edge Function',async()=>{
  const html=await read('lobby/index.html');
  const js=await read('lobby/assets/lobby.js');
  assert.match(html,/id="recovery-cgm"/);
  assert.match(js,/functions\.invoke\('temporary-cgm-password-reset'/);
});

test('Frontend valida domínio institucional e formato do CGM',async()=>{
  for(const file of ['assets/hub.js','atividades/assets/js/app.js','lobby/assets/lobby.js']){
    const js=await read(file);
    assert.match(js,/@escola\.pr\.gov\.br|SCHOOL_EMAIL_DOMAIN|school/);
    assert.match(js,/\^\\d\{6,12\}\$/);
  }
});

test('Fonte versionada da função mantém validação server-side, rate limit e reset administrativo',async()=>{
  const fn=await read('core/edge-functions/temporary-cgm-password-reset/index.ts');
  assert.match(fn,/auth\.admin\.updateUserById/);
  assert.match(fn,/admin_revoke_auth_sessions_service/);
  assert.match(fn,/must_change_password: true/);
  assert.match(fn,/security_rate_limits/);
  assert.match(fn,/sameSecret\(cgm, initial\.cgm\)/);
  assert.match(fn,/Deno\.env\.get\(\"SUPABASE_SERVICE_ROLE_KEY\"\)/);
  assert.doesNotMatch(fn,/service_role\s*[:=]\s*['\"][A-Za-z0-9_-]{20,}/i);
});

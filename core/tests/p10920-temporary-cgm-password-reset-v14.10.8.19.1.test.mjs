import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=(p)=>readFile(new URL(`../../${p}`,import.meta.url),'utf8');

test('Login único solicita e-mail + CGM e usa função temporária server-side',async()=>{
  const html=await read('auth/index.html');
  const js=await read('auth/auth.js');
  const session=await read('core/session/agv-session.js');
  assert.match(html,/id="recovery-email"/);
  assert.match(html,/id="recovery-cgm"/);
  assert.match(html,/Redefinir senha para CGM/);
  assert.match(js,/temporaryCgmPasswordReset\(email,cgm\)/);
  assert.match(session,/functions\/v1\/temporary-cgm-password-reset/);
});

test('Hub, Atividades e Lobby convergem para o login único em vez de duplicar recuperação',async()=>{
  const hub=await read('assets/hub.js');
  const activities=await read('atividades/index.html');
  const lobby=await read('lobby/assets/lobby.js');
  assert.match(hub,/AGVUnifiedAuth|location\.replace\('auth\/'\)/);
  assert.match(activities,/\.\.\/auth\/\?returnTo=atividades\//);
  assert.match(lobby,/\.\.\/auth\/\?returnTo=lobby\//);
});

test('Login único valida domínio institucional e formato do CGM',async()=>{
  const js=await read('auth/auth.js');
  assert.match(js,/@escola\.pr\.gov\.br|SCHOOL/);
  assert.ok(js.includes('/^\\d{6,12}$/'));
});

test('Fonte versionada da função mantém validação server-side, rate limit e reset administrativo',async()=>{
  const fn=await read('core/edge-functions/temporary-cgm-password-reset/index.ts');
  assert.match(fn,/auth\.admin\.updateUserById/);
  assert.match(fn,/admin_revoke_auth_sessions_service/);
  assert.match(fn,/must_change_password: true/);
  assert.match(fn,/security_rate_limits/);
  assert.match(fn,/sameSecret\(cgm, initial\.cgm\)/);
  assert.match(fn,/Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
  assert.doesNotMatch(fn,/service_role\s*[:=]\s*['"][A-Za-z0-9_-]{20,}/i);
});

test('Troca real de senha finaliza must_change_password somente no banco',async()=>{
  const sql=await read('core/database/063_p10920_password_change_finalize.sql');
  assert.match(sql,/after update of encrypted_password on auth\.users/i);
  assert.match(sql,/must_change_password\s*=\s*false/i);
  assert.match(sql,/password_changed_at\s*=\s*now\(\)/i);
  assert.match(sql,/cgm\s*=\s*null/i);
  assert.match(sql,/security definer/i);
});

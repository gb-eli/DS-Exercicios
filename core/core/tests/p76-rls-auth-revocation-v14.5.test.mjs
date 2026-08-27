import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('P7.6 migration revokes public access and grants service_role only', () => {
  const sql = read('core/database/030_p76_auth_session_revocation.sql');
  assert.match(sql, /delete from auth\.sessions/i);
  assert.match(sql, /revoke all on function public\.admin_revoke_auth_sessions_service\(uuid\) from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.admin_revoke_auth_sessions_service\(uuid\) to service_role/i);
});

test('admin-auth-sessions validates admin and temporary password', () => {
  const ts = read('core/edge-functions/admin-auth-sessions/index.ts');
  assert.match(ts, /auth\.getUser\(\)/);
  assert.match(ts, /\["admin", "super_admin"\]/);
  assert.match(ts, /must_change_password/);
  assert.match(ts, /admin_audit_log/);
});

test('admin revocation UI remains disabled before verified live deploy', () => {
  const cfg = read('admin/assets/config.js');
  const html = read('admin/index.html');
  assert.match(cfg, /authSessionRevocationReady: (false|'auto')/);
  assert.match(html, /id="revoke-auth-sessions" disabled/);
});

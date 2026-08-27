import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const guarded = [
  'activity-progress','admin-auth-sessions','admin-profile-user','admin-roster','agv-progress-event','agv-reward-claim',
  'agv-teacher-activity','ctf-complete-challenge','ctf-core-actions','lab-exercises-core','lab-virtual-core','lobby-moderation',
  'lobby-presence','security-telemetry','staff-dashboard','staff-directory','student-files','supervision'
];

test('P7.7 migration exposes only service-only live session validator', () => {
  const sql = read('core/database/031_p77_live_session_guard.sql');
  assert.match(sql, /from auth\.sessions/i);
  assert.match(sql, /s\.id = p_session_id/i);
  assert.match(sql, /s\.user_id = p_user_id/i);
  assert.match(sql, /revoke all on function public\.security_is_auth_session_active_service\(uuid, uuid\) from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.security_is_auth_session_active_service\(uuid, uuid\) to service_role/i);
});

test('critical endpoints reject JWT whose auth session no longer exists', () => {
  for (const fn of guarded) {
    const ts = read(`core/edge-functions/${fn}/index.ts`);
    const helper = read(`core/edge-functions/${fn}/session-guard.ts`);
    assert.match(ts, /requireLiveAuthSession/, `${fn} must invoke live session guard`);
    assert.match(helper, /session_id/, `${fn} helper must read session_id`);
    assert.match(helper, /security_is_auth_session_active_service/, `${fn} helper must call service-only validator`);
    assert.match(helper, /session_revoked/, `${fn} helper must return session_revoked`);
  }
});

test('shared frontend session clears locally on explicit session_revoked', () => {
  const js = read('core/session/agv-session.js');
  assert.match(js, /code==='session_revoked'/);
  assert.match(js, /code==='session_claim_missing'/);
  assert.match(js, /clear\(\);throw e/);
});

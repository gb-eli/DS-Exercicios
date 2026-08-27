import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => fs.readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('P7.8 admin uses auto-probe instead of a manually enabled revocation flag', () => {
  const cfg=read('admin/assets/config.js'), js=read('admin/assets/admin.js'), html=read('admin/index.html');
  assert.match(cfg,/authSessionRevocationReady: 'auto'/);
  assert.match(html,/id="revoke-auth-sessions" disabled/);
  assert.match(js,/probeAuthSessionRevocation/);
  assert.match(js,/action:'status'/);
  assert.match(js,/d\?\.live_session_guard/);
  assert.match(js,/d\?\.revocation_rpc/);
  assert.match(js,/btn\.disabled=!st\.authSessionRevocationReady/);
});

test('P7.8 status endpoint self-probes RPC and live-session guard', () => {
  const ts=read('core/edge-functions/admin-auth-sessions/index.ts');
  assert.match(ts,/action === "status" \? user\.id/);
  assert.match(ts,/admin_auth_session_count_service/);
  assert.match(ts,/ready: true/);
  assert.match(ts,/live_session_guard: true/);
  assert.match(ts,/revocation_rpc: true/);
});

test('P7.8 release remains explicitly not deployed live', () => {
  const rel=JSON.parse(read('release-v14.7.json'));
  assert.equal(rel.liveDeployApplied,false);
  assert.equal(rel.frontendActivation.mode,'auto-probe');
});

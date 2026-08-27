import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const migration=read('core/database/029_security_hardening_ip_rate_limits.sql');
const telemetry=read('core/edge-functions/security-telemetry/index.ts');
const lobbyPresence=read('core/edge-functions/lobby-presence/index.ts');
const lobby=read('lobby/assets/lobby.js');
const reward=read('core/edge-functions/agv-reward-claim/index.ts');
const progress=read('core/edge-functions/agv-progress-event/index.ts');
const activity=read('core/edge-functions/activity-progress/index.ts');
const files=read('core/edge-functions/student-files/index.ts');
const supervision=read('core/edge-functions/supervision/index.ts');
const ctf=read('core/edge-functions/ctf-core-actions/index.ts');
const lab=read('core/edge-functions/lab-virtual-core/index.ts');
const admin=read('admin/assets/admin.js');
const professor=read('professor/assets/professor.js');
const student=read('atividades/assets/js/app.js');

assert.match(migration,/revoke[\s\S]*truncate[\s\S]*lobby_presence/i,'TRUNCATE lobby precisa ser revogado');
assert.match(migration,/revoke all on table public\.activity_catalog from anon, authenticated/i,'catálogo precisa ser somente leitura');
assert.match(migration,/security_consume_rate_limit/,'rate limiter ausente');
assert.match(migration,/180 days/,'retenção de eventos ausente');
assert.match(migration,/new\.raw='\{\}'::jsonb/,'minimização de geo raw ausente');
assert.match(telemetry,/outside_parana/);
assert.match(telemetry,/severity:'critical'/);
assert.match(telemetry,/admin_feed/);
assert.match(telemetry,/admin_only/);
assert.doesNotMatch(telemetry,/\['teacher','admin','super_admin'\].*admin_feed/s,'feed IP global não deve ser de professor');
assert.match(lobbyPresence,/consumeRate/);
assert.match(lobbyPresence,/40,60,120/);
assert.match(lobby,/functions\.invoke\('lobby-presence'/);
assert.doesNotMatch(lobby,/from\('lobby_presence'\)\.upsert/);
assert.doesNotMatch(lobby,/from\('lobby_presence'\)\.delete/);
for(const [name,src] of [['reward',reward],['progress',progress],['activity',activity],['files',files],['supervision',supervision],['ctf',ctf],['lab',lab]]){
  assert.match(src,/security_consume_rate_limit|consumeRate/,`${name}: rate limit ausente`);
}
assert.match(reward,/client_amount_forbidden/,'cliente não pode definir recompensa');
assert.match(ctf,/Math\.max\(30/,'CTF deve exigir tempo mínimo de lição');
assert.match(lab,/lastOpenedAt/,'Lab deve exigir sessão recente da ferramenta');
assert.match(lab,/bulk_reward_attempt/,'Lab deve detectar coleta em lote');
assert.match(lab,/critical/,'coleta em lote deve ser crítica');
for(const [name,src] of [['admin',admin],['professor',professor],['student',student],['lobby',lobby]]){
  assert.match(src,/security-telemetry/,`${name}: telemetria não integrada`);
}
const frontendFiles=['lobby/assets/lobby.js','atividades/assets/js/app.js','admin/assets/admin.js','professor/assets/professor.js','core/sdk/agv-core-sdk.js','core/sdk/agv-core-browser-bootstrap.js'];
for(const f of frontendFiles){const src=read(f);assert.doesNotMatch(src,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|service_role\s*[:=]\s*['"]/i,`${f}: segredo privilegiado no frontend`)}
console.log('PASS security-hardening-p43: privilégios mínimos, IP/PR crítico, rate limit, economia e telemetria');

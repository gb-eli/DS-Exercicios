import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const edge=read('core/edge-functions/supervision/index.ts');
const sessionGuard=read('core/edge-functions/supervision/session-guard.ts');
const ui=read('atividades/assets/js/supervision.js');
const supabaseJs=read('atividades/assets/js/supabase.js');
const app=read('atividades/assets/js/app.js');
const workspace=read('atividades/assets/js/workspace.js');
const embeddedAdmin=read('atividades/assets/js/admin.js');
const migration=read('core/database/041_p106_session_resilience.sql');
const retireWorkaround=read('core/database/042_p106_retire_focus_limit_workaround.sql');

test('P10.6 supervision usa live auth guard e não bloqueia por quantidade de saídas',()=>{
  assert.match(edge,/requireLiveAuthSession/);
  assert.match(edge,/const live=await requireLiveAuthSession/);
  assert.match(sessionGuard,/session_revoked/);
  assert.match(edge,/focus_alert:focusAlert/);
  assert.doesNotMatch(edge,/status:'blocked',security_locked:true,security_lock_reason:reason/);
  assert.doesNotMatch(edge,/Limite de .* saídas da atividade atingido/);
});

test('P10.6 cada nova sessão supervisionada substitui sessões abertas anteriores do aluno',()=>{
  assert.match(edge,/update\(\{ended_at:supersededAt,updated_at:supersededAt\}\)\.eq\('student_id',user\.id\)\.is\('ended_at',null\)/);
  assert.match(edge,/sessionOwned=async\(id:string\)=>\{[\s\S]*?\.is\('ended_at',null\)\.maybeSingle\(\)/);
});

test('P10.6 live overview encerra e exclui sessões sem heartbeat há dois minutos',()=>{
  assert.match(edge,/staleBefore=new Date\(Date\.now\(\)-120000\)\.toISOString\(\)/);
  assert.match(edge,/\.lt\('last_seen_at',staleBefore\)/);
  assert.match(edge,/\.gte\('last_seen_at',staleBefore\)/);
  assert.match(migration,/coalesce\(last_seen_at, started_at\) < now\(\) - interval '2 minutes'/);
});

test('P10.6 limite 3 voltou a ser apenas limiar de alerta, nunca bloqueio',()=>{
  assert.match(edge,/max_focus_violations:3/);
  assert.match(ui,/max_focus_violations:3/);
  assert.match(embeddedAdmin,/max_focus_violations:3/);
  assert.match(embeddedAdmin,/Alerta após 3 saídas • não bloqueia/);
  assert.match(migration,/set max_focus_violations = 3/);
  assert.match(retireWorkaround,/drop trigger if exists trg_enforce_nonblocking_focus_policy/);
  assert.match(retireWorkaround,/alter column max_focus_violations set default 3/);
  assert.match(retireWorkaround,/max_focus_violations >= 1 and max_focus_violations <= 20/);
});

test('P10.6 sessão revogada encerra imediatamente o workspace do aluno',()=>{
  assert.match(supabaseJs,/SESSION_INVALID_CODES=new Set\(\['session_revoked','session_claim_missing'\]\)/);
  assert.match(supabaseJs,/agv:session-invalid/);
  assert.match(workspace,/handleSessionInvalid\(details\)/);
  assert.match(ui,/handleSessionInvalid\(details\)/);
  assert.match(embeddedAdmin,/handleSessionInvalid\(details\)/);
  assert.match(app,/window\.addEventListener\('agv:session-invalid'/);
  assert.match(app,/await unmountWorkspace\(\)\.catch/);
});

test('P10.6 SIGNED_OUT desmonta workspace e remove fullscreen sem deixar heartbeat em segundo plano',()=>{
  assert.match(app,/event === 'SIGNED_OUT'[\s\S]*?forceSessionExit\(''\)/);
  assert.match(app,/setPortalFullscreenRequired\(false\)/);
  assert.match(app,/document\.exitFullscreen\(\)/);
});

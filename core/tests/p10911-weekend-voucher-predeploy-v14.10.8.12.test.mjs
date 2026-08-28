import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const exists=(p)=>fs.existsSync(path.join(root,p));

test('P10.9.11 deploy bundle includes all Edge Function relative dependencies',()=>{
  assert.equal(exists('core/edge-functions/weekend-bonus-voucher/index.ts'),true);
  assert.equal(exists('core/edge-functions/weekend-bonus-voucher/session-guard.ts'),true);
  const edge=read('core/edge-functions/weekend-bonus-voucher/index.ts');
  assert.match(edge,/from "\.\/session-guard\.ts"/);
});

test('P10.9.11 session guard fails closed and checks server-side live auth session',()=>{
  const guard=read('core/edge-functions/weekend-bonus-voucher/session-guard.ts');
  assert.match(guard,/session_claim_missing/);
  assert.match(guard,/security_is_auth_session_active_service/);
  assert.match(guard,/session_guard_unavailable/);
  assert.match(guard,/session_revoked/);
});

test('P10.9.11 predeploy SQL is read-only',()=>{
  const sql=read('PREDEPLOY-VOUCHER-CHECK.sql');
  assert.match(sql,/weekend_bonus_vouchers/);
  assert.match(sql,/security_consume_rate_limit/);
  assert.match(sql,/security_is_auth_session_active_service/);
  assert.doesNotMatch(sql,/\b(insert|update|delete|create|alter|drop|truncate|grant|revoke)\b/i);
});

test('P10.9.11 deployment runbook enforces backup, backend-first deploy and non-mutating smoke',()=>{
  const doc=read('DEPLOY-BACKEND-VOUCHER-v14.10.8.12.md');
  assert.match(doc,/backup restaurável confirmado/i);
  assert.match(doc,/Não publicar o frontend antes/i);
  assert.match(doc,/verify_jwt=true/);
  assert.match(doc,/mesmo código/i);
  assert.match(doc,/Nenhum desses campos pode ser alterado/i);
  assert.match(doc,/Não apagar a tabela/i);
});

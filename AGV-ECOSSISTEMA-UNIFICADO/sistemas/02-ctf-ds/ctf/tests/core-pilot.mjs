import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [html,app,bridge,wallet,sw,ctfModule]=await Promise.all([
  readFile(resolve(root,'index.html'),'utf8'),
  readFile(resolve(root,'js/app.js'),'utf8'),
  readFile(resolve(root,'js/core/agv-core-bridge.js'),'utf8'),
  readFile(resolve(root,'js/core/wallet.js'),'utf8'),
  readFile(resolve(root,'sw.js'),'utf8'),
  readFile(resolve(root,'js/modules/ctf.js'),'utf8'),
]);
assert.match(html,/AGV EDUCATION CORE/);
assert.match(html,/auth-email/);
assert.doesNotMatch(html,/IDENTIDADE LOCAL/);
assert.match(html,/connect-src 'self' https:\/\/iresvqwyaqotghjssncg\.supabase\.co/);
assert.match(bridge,/ctf-complete-challenge/);
assert.match(bridge,/ctf-core-actions/);
assert.match(bridge,/startCoreLesson/);
assert.match(bridge,/purchaseCoreHint/);
assert.match(bridge,/purchaseCoreStoreItem/);
assert.match(bridge,/activity_not_provisioned/);
assert.match(bridge,/sessionStorage/);
assert.doesNotMatch(bridge,/service_role/i);
assert.match(app,/completeCoreChallenge/);
assert.match(app,/completeCoreLesson/);
assert.match(app,/recordCoreToolUse/);
assert.match(app,/syncCoreDaily/);
assert.match(app,/purchaseCoreHint/);
assert.match(app,/purchaseCoreStoreItem/);
assert.match(ctfModule,/Aguardando Core/);
assert.match(wallet,/profile\?\.core\?\.authority === 'agv-core'/);
assert.match(wallet,/AGV-CORE/);
assert.match(wallet,/storeTransactions/);
assert.match(sw,/agv-core-bridge\.js/);
console.log('OK: CTF P1 Core — login, missões, aulas, diário, hints, ferramentas e store centralizados/fail-closed.');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PROFILE_RETENTION_DAYS} from '../assets/js/storage.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const storage=fs.readFileSync(path.join(root,'assets/js/storage.js'),'utf8');
const app=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const terms=fs.readFileSync(path.join(root,'assets/js/terms.js'),'utf8');
const privacy=fs.readFileSync(path.join(root,'PRIVACY.md'),'utf8');
const permissions=JSON.parse(fs.readFileSync(path.join(root,'permissions-manifest.json'),'utf8'));

assert.equal(PROFILE_RETENTION_DAYS,10);
assert.match(storage,/REDUNDANT_PREFIX='agv\.profile\.redundant\.v1\.'/);
assert.match(storage,/saveRedundantRecord\(record\)/);
assert.match(storage,/export async function verifyActiveProgress/);
assert.match(storage,/export async function getStorageDiagnostics/);
assert.match(storage,/export async function retryStorageConnection/);
assert.match(storage,/storage_save_failed/);
assert.match(storage,/state:'saving'/);
assert.match(storage,/lastSavedAt/);
assert.doesNotMatch(storage,/plusDays\(updatedAt,6\)/);
assert.match(app,/data-action="verify-progress"/);
assert.match(app,/data-action="storage-diagnostics"/);
assert.match(app,/Salvando…/);
assert.match(app,/Fazer backup antes de apagar/);
assert.match(app,/data-understand-delete/);
assert.match(terms,/até 10 dias desde o último salvamento/);
assert.match(privacy,/10 dias após cada salvamento/);
const persistent=permissions.permissions.find(item=>item.id==='persistent-storage');
assert.match(persistent.retention,/10 dias/);

console.log('Storage retention, save status, diagnostics, redundant checkpoint and controlled deletion tests passed.');

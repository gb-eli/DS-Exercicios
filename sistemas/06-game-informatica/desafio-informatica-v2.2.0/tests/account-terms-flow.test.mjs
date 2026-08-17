import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const storage=fs.readFileSync(path.join(root,'assets/js/storage.js'),'utf8');
const terms=fs.readFileSync(path.join(root,'assets/js/terms.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/app.css'),'utf8');

for(const marker of [
  'data-profile-switch','data-profile-lock','data-delete-active-profile','data-discard-temporary',
  'data-unlock-profile','data-new-profile','data-terms-end','data-terms-accept-all',
  'AULA ${l.order} DE'
])assert.ok(app.includes(marker),`Fluxo ausente: ${marker}`);

assert.match(storage,/export async function lockActiveProfile\(reason='manual'\)/);
assert.match(storage,/profile_locked/);
assert.match(storage,/export async function deleteProtectedProfile[\s\S]*?await dbDelete\(id\);runtime\.activeId=null/);
assert.doesNotMatch(storage,/deleteProtectedProfile[\s\S]{0,250}lockActiveProfile\(/);
assert.match(terms,/version:'1\.2\.0'/);
assert.ok(terms.includes('guided-read-and-bulk-confirm'));
assert.match(terms,/reachedEnd:Boolean\(reachedEnd\)/);
assert.match(terms,/bulkAccepted:Boolean\(bulkAccepted\)/);
assert.match(css,/\.account-center/);
assert.match(css,/\.terms-guided-actions/);
assert.match(css,/\.lesson-sequence-banner/);

// initializeStorage lista os perfis, mas não desbloqueia automaticamente um perfil protegido.
const initBlock=storage.match(/export async function initializeStorage\(\)[\s\S]*?\n\}/)?.[0]||'';
assert.ok(initBlock.includes('listValidProfiles'));
assert.equal(initBlock.includes('unlockProtectedProfile'),false);

console.log('Account, profile switching, logout, controlled deletion and assisted terms tests passed.');

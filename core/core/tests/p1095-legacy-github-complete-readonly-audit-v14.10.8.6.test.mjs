import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=(f)=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const aggregate=()=>read('core/tests/fixtures/legacy-github-audit-aggregates-v14.10.8.7.json');
test('auditoria consolidada preserva 136 claims sem escrita em produção',()=>{
 const d=aggregate();assert.equal(d.claims_audited,136);assert.equal(d.claims_gradeable,116);assert.equal(d.claims_manual_review_without_score,20);assert.equal(d.production_writes,false);assert.equal(d.grades_applied,false);assert.equal(d.feedback_applied,false);assert.equal(d.claims_status_changed,false);
});
test('conflitos de escopo permanecem em revisão manual',()=>{
 const c=aggregate().blocks.remaining.scope_conflicts;assert.equal(c.subject_scope_mismatch,12);assert.equal(c.identity_scope_mismatch,8);assert.equal(c.subject_scope_mismatch+c.identity_scope_mismatch,20);
});
test('SUB fecha 14 claims com dois não funcionais e um parcial',()=>{
 const d=aggregate().blocks.remaining;assert.equal(d.sub_claims,14);assert.deepEqual(d.sub_status_counts,{correct:11,partial:1,nonfunctional:2});
});
test('release .7 não finge deploy nem libera escrita',()=>{
 const d=read('release-current.json');assert.equal(d.version,'14.10.8.18');assert.equal(d.phase,'P10.9.17-academic-exercise-points');assert.equal(d.runtimeCacheVersion,'14.10.8.18');assert.equal(d.productionWriteApproved,false);assert.equal(d.liveDeployApplied,false);
});

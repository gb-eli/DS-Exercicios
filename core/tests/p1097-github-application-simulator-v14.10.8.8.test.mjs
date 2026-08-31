import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {normalizeRepo,score10To100,simulateDecision,buildApplicationPlan} from '../tools/legacy-github-apply-simulator.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('normaliza repositório e converte nota 0-10 para 0-100 explicitamente',()=>{
  assert.equal(normalizeRepo('https://github.com/Aluno/Repo.git'),'aluno/repo');
  assert.equal(normalizeRepo('https://github.com/Aluno/Repo/blob/main/ex1/main.py'),'aluno/repo');
  assert.equal(score10To100(9.5),95);
  assert.equal(score10To100(10),100);
});

test('aprovação de vínculo suspeito permanece bloqueada',()=>{
  const decision={decision:'approved',student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',status:'subject_scope_mismatch',final_score:10};
  const current={claim_status:'pending',exercise_status:'completed',progress_percent:100,approval_status:'pending',completion_source:'legacy_claim',submitted_score:null};
  const out=simulateDecision(decision,current);
  assert.equal(out.blocked,true);
  assert.ok(out.reasons.includes('suspicious_link_cannot_auto_approve'));
});

test('simulador bloqueia redução de nota existente',()=>{
  const decision={decision:'score_adjusted',student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',status:'partial',final_score:8};
  const current={claim_status:'pending',exercise_status:'completed',progress_percent:100,approval_status:'pending',completion_source:'legacy_claim',submitted_score:95};
  const out=simulateDecision(decision,current);
  assert.equal(out.proposal.submitted_score,80);
  assert.equal(out.blocked,true);
  assert.ok(out.reasons.includes('would_reduce_existing_submitted_score'));
});

test('solicitar correção mantém claim pendente e reabre atividade',()=>{
  const decision={decision:'request_fix',student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',status:'partial',final_score:7,feedback:'Corrigir lógica.'};
  const current={claim_status:'pending',exercise_status:'completed',progress_percent:100,approval_status:'pending',completion_source:'legacy_claim',submitted_score:null};
  const out=simulateDecision(decision,current);
  assert.equal(out.blocked,false);
  assert.equal(out.proposal.claim_status,'pending');
  assert.equal(out.proposal.exercise_status,'in_progress');
  assert.equal(out.proposal.approval_status,'changes_requested');
});

test('não correspondente rejeita somente o vínculo e não cria crédito',()=>{
  const decision={decision:'not_corresponding',student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',status:'wrong_exercise',final_score:null};
  const current={claim_status:'pending',exercise_status:'completed',progress_percent:100,approval_status:'pending',completion_source:'legacy_claim',submitted_score:null};
  const out=simulateDecision(decision,current);
  assert.equal(out.proposal.claim_status,'rejected');
  assert.equal(out.proposal.exercise_status,'in_progress');
  assert.equal(out.proposal.approval_status,'changes_requested');
});

test('plano exportável nunca afirma escrita em produção',()=>{
  const decisions=[{decision:'approved',student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',status:'correct',final_score:10}];
  const currentRows=[{student:'Aluno',subject:'x',exercise_number:1,repository:'a/r',claim_status:'pending',exercise_status:'completed',progress_percent:100,approval_status:'pending',completion_source:'legacy_claim',submitted_score:null}];
  const plan=buildApplicationPlan({decisions,currentRows,generatedAt:'2026-08-22T12:00:00-03:00',sourceHash:'abc'});
  assert.equal(plan.production_write_applied,false);
  assert.equal(plan.counts.safe_to_apply,1);
  assert.equal(plan.items[0].proposal.submitted_score,100);
});

test('painel do professor contém simulador e browser não possui comando de escrita',()=>{
  const html=read('professor/index.html'),js=read('professor/assets/legacy-github-apply-simulator.js');
  assert.match(html,/teacher-github-simulator-toggle/);
  assert.match(html,/github-sim-decisions-file/);
  assert.match(html,/legacy-github-apply-simulator\.js\?v=14\.10\.8\.65-stage22/);
  assert.match(js,/production_write_applied:false/);
  assert.match(js,/staffFunction/);
  assert.match(js,/READ_ONLY_ACTION='overview'/);
  assert.match(js,/readApi\(path\)/);
  assert.match(js,/method:'GET'/);
  assert.doesNotMatch(js,/review_legacy/);
  assert.doesNotMatch(js,/\.update\s*\(/);
  assert.doesNotMatch(js,/\.insert\s*\(/);
  assert.doesNotMatch(js,/\.delete\s*\(/);
  assert.doesNotMatch(js,/method\s*:\s*['\"](?:PATCH|PUT|DELETE)['\"]/i);
});

test('snapshot agregado preserva gate de produção fechado',()=>{
  const s=JSON.parse(read('core/tests/fixtures/legacy-github-current-state-summary-v14.10.8.8.json'));
  assert.equal(s.legacy_claims,136);
  assert.equal(s.pending_claims,136);
  assert.equal(s.non_pending_claims,0);
  assert.equal(s.student_exercises_completed+s.student_exercises_in_progress,136);
  assert.equal(s.production_write_applied,false);
});

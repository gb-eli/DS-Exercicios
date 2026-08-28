import assert from 'node:assert/strict';
import {
  GENERAL_TERMS,ACTIVITY_RULES,prepareTermsRuntime,buildGeneralAcceptance,buildActivityAcceptance,
  validGeneralAcceptance,validActivityAcceptance,evidenceTermsSummary
} from '../assets/js/terms.js';
import {assertSafeStructure,cleanText,cleanMultiline,safeUrl,safeFileName,sanitizeDiagnosticResult} from '../assets/js/security.js';

const runtime=await prepareTermsRuntime();
assert.equal(runtime.termsHash.length,64);
assert.equal(runtime.activityHashes.guided.length,64);
assert.ok(GENERAL_TERMS.sections.length>=16);
assert.ok(ACTIVITY_RULES.guided.rules.some(rule=>rule.includes('5 minutos')));
assert.ok(ACTIVITY_RULES['diagnostic-general'].rules.some(rule=>rule.includes('15 minutos')));

const profileId='profile-test-01',sessionId='session-test-01';
const general=buildGeneralAcceptance({profileId,classId:'1ADM',termsHash:runtime.termsHash,deviceSessionId:sessionId,fullTermsOpened:true,privacyNoticeViewed:true});
assert.equal(validGeneralAcceptance(general,{profileId,termsHash:runtime.termsHash}),true);
assert.equal(validGeneralAcceptance({...general,termsHash:'alterado'},{profileId,termsHash:runtime.termsHash}),false);
assert.equal(validGeneralAcceptance(general,{profileId:'outro-perfil',termsHash:runtime.termsHash}),false);
assert.equal(general.readConfirmation,true);
assert.equal(general.responsibleUseConfirmation,true);

const activity=buildActivityAcceptance({profileId,classId:'1ADM',activityKey:'guided',rulesHash:runtime.activityHashes.guided,deviceSessionId:sessionId,generalAcceptanceId:general.acceptanceId});
assert.equal(validActivityAcceptance(activity,{profileId,activityKey:'guided',rulesHash:runtime.activityHashes.guided}),true);
assert.equal(validActivityAcceptance({...activity,rulesHash:'alterado'},{profileId,activityKey:'guided',rulesHash:runtime.activityHashes.guided}),false);
const evidence=evidenceTermsSummary(general,activity);
assert.equal(evidence.status,'aceito');
assert.equal(evidence.recordIntegrity,true);
assert.equal(evidence.educationalPurpose,true);

assert.equal(cleanText('<img src=x onerror=alert(1)>'), 'img src=x onerror=alert(1)');
assert.equal(cleanMultiline('</script><script>alert(1)</script>'), '/scriptscriptalert(1)/script');
assert.equal(safeUrl('javascript:alert(1)'), '');
assert.equal(safeUrl('data:text/html,alert(1)'), '');
assert.match(safeUrl('https://classroom.google.com/'), /^https:\/\//);
assert.equal(safeFileName('../../Aluno <teste>'), 'aluno-teste');
assert.throws(()=>assertSafeStructure(JSON.parse('{"__proto__":{"polluted":true}}')),/inseguro/i);
assert.throws(()=>assertSafeStructure({items:Array.from({length:501},()=>0)}),/itens demais/i);

const malicious={
  kind:'agv-diagnostic-result',id:'result-1',version:'2.2.0',
  student:{id:'student-1',name:'"><svg onload=alert(1)>',classId:'1ADM'},
  diagnosticMode:'general',diagnosticModeLabel:'Diagnóstico <b>geral</b>',selectedClass:'1ADM',classProfileUsed:null,
  startedAt:'2026-07-30T18:00:00-03:00',endedAt:'2026-07-30T18:30:00-03:00',durationSeconds:1800,
  minimumRequiredSeconds:1500,minimumMet:true,maximumAllowedSeconds:3000,teacherRelease:null,finishReason:'completed',
  totalQuestions:1,answered:1,unanswered:0,correct:1,accuracy:100,completionPercent:100,rawProficiency:100,proficiency:100,
  classification:'Proficiente',validity:'Válido',advancedAccuracy:0,strongAreas:1,xp:999999999,maxStreak:1,powerupsUsed:0,
  integrity:{score:100,shields:3,rapidAttempts:0,events:[{type:'paste',detail:'<img src=x onerror=alert(1)>',at:'2026-07-30T18:10:00-03:00'}]},
  areas:[{area:'Planilhas <script>',total:1,answered:1,correct:1,percent:100}],
  answers:[{questionId:'q1',area:'Planilhas',difficulty:'basic',type:'text',question:'Teste <svg>',choice:'=HYPERLINK("javascript:alert(1)")',correctAnswer:'Resposta',correct:true,explanation:'Explicação </script>',at:'2026-07-30T18:10:00-03:00'}],
  questionBankVersion:'1',validationToken:'token',termsAcceptance:evidence,delivery:{}
};
const sanitized=sanitizeDiagnosticResult(malicious);
assert.equal(sanitized.student.name.includes('<'),false);
assert.equal(sanitized.answers[0].question.includes('<'),false);
assert.equal(sanitized.integrity.events[0].detail.includes('<'),false);
assert.equal(sanitized.xp,100000);
assert.equal(sanitized.correct,1);
assert.throws(()=>sanitizeDiagnosticResult({...malicious,selectedClass:'3ADM'}),/Turma/i);

console.log('Testes de termos, privacidade e segurança transversal aprovados.');

import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { challenges, tracks, isUnlocked } from '../js/data/challenges.js';
import { lessons } from '../js/data/lessons.js';
import { storeItems } from '../js/data/store-items.js';
import { careers } from '../js/data/careers.js';
import { vulnerabilities, realCases, mediaInspirations } from '../js/data/intel.js';
import { unicodeToBase64, base64ToUnicode, textToBinary, binaryToText, caesar, passwordScore } from '../js/core/utils.js';
import { runTool } from '../js/modules/tools.js';
import { createDefaultProfile, normalizeProfile } from '../js/core/state.js';
import { renderChallengeModal, renderCTF, getHintCost } from '../js/modules/ctf.js';
import { renderDashboard } from '../js/modules/dashboard.js';
import { getToolDemo, buildToolTourSteps, toolTutorialCards } from '../js/modules/guided-tutorial.js';
import { detectCurrentPeriod, resolveShiftForClass } from '../js/modules/schedule.js';
import { renderDelivery, buildEvidenceHtml } from '../js/modules/delivery.js';
import { renderAbout } from '../js/modules/about.js';
import { platformConfig } from '../js/config/platform-config.js';
import { encodeRequestCode, decodeRequestCode } from '../js/eduauth/core/protocol.js';
import { generateClassPin, validateClassPin } from '../js/eduauth/modes/class-shared-pin.js';
import { createSessionRequest, generateSessionPin, validateSessionPin } from '../js/eduauth/modes/session-scoped-pin.js';
import { verifySignedGrant } from '../js/eduauth/modes/signed-grant.js';
import { qrMatrix } from '../js/eduauth/ui/qr-lite.js';
import { EDUAUTH_PLATFORM, EDUAUTH_KEY_CONFIG, EDUAUTH_ACTIONS } from '../js/eduauth/index.js';

assert.ok(challenges.length >= 68, 'A plataforma deve conter ao menos 68 missões progressivas e multissetoriais.');
assert.equal(new Set(challenges.map((item) => item.id)).size, challenges.length, 'IDs de missão devem ser únicos.');
assert.ok(tracks.length >= 11);
assert.ok(lessons.length >= 10);
assert.ok(storeItems.length >= 10);
assert.ok(careers.length >= 8);
assert.ok(vulnerabilities.length >= 23);
assert.ok(realCases.length >= 15);
assert.ok(mediaInspirations.length >= 6);

const ids = new Set(challenges.map((item) => item.id));
for (const challenge of challenges) {
  for (const requirement of challenge.requires || []) assert.ok(ids.has(requirement), `Pré-requisito ausente: ${requirement}`);
  assert.equal(typeof challenge.validate, 'function');
  assert.ok(challenge.xp > 0 && challenge.coins >= 0);
  if (challenge.type === 'sequence') assert.ok(challenge.items?.length >= 3);
  if (challenge.type === 'code-edit') assert.equal(typeof challenge.starterCode, 'string');
  if (challenge.type === 'matching') assert.ok(challenge.pairs?.length >= 2);
  assert.ok(challenge.theme && challenge.sector && challenge.role);
  assert.ok(Array.isArray(challenge.languages) && challenge.languages.length > 0);
  assert.ok(Array.isArray(challenge.systems) && challenge.systems.length > 0);
  assert.ok(Array.isArray(challenge.tools) && challenge.tools.length > 0);
  assert.ok(challenge.reference?.url?.startsWith('https://'));
}

assert.equal(unicodeToBase64('CIBERSEGURANÇA'), 'Q0lCRVJTRUdVUkFOw4dB');
assert.equal(base64ToUnicode('Q0lCRVJTRUdVUkFOQ0E='), 'CIBERSEGURANCA');
assert.equal(textToBinary('FLAG'), '01000110 01001100 01000001 01000111');
assert.equal(binaryToText('01000110 01001100 01000001 01000111'), 'FLAG');
assert.equal(caesar('VHFXULWB', -3), 'SECURITY');
assert.ok(passwordScore('Uma-Frase#Longa2026').score >= 6);
assert.ok(isUnlocked(challenges[0], {}));
assert.ok(!isUnlocked(challenges.find((item) => item.id === 'final-01'), {}));
assert.ok(challenges.find((item) => item.id === 'html-01').validate({ value: '<button id="access" data-key="SPECTER-7">Acessar</button>' }));
assert.ok(challenges.find((item) => item.id === 'xss-fix-01').validate({ value: 'preview.textContent = userInput;' }));
assert.ok(challenges.find((item) => item.id === 'incident-order-01').validate({ value: 'contain,preserve,analyze,eradicate,recover,learn' }));
assert.ok(challenges.find((item) => item.id === 'headers-01').validate({ value: '0,1,2,3' }));
assert.ok(challenges.find((item) => item.id === 'card-token-01').validate({ value: 'token:0,tls:0,least:0' }));
assert.ok(challenges.find((item) => item.id === 'fraud-math-01').validate({ value: '100' }));
assert.ok(challenges.find((item) => item.id === 'php-sql-01').validate({ value: '2' }));

const b64 = new FormData(); b64.set('input', 'ABC'); b64.set('action', 'encode');
assert.equal(await runTool('base64', b64), 'QUJD');
const hash = new FormData(); hash.set('input', 'abc');
assert.equal(await runTool('hash', hash), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
const hex = new FormData(); hex.set('input', 'FLAG'); hex.set('action', 'encode');
assert.equal(await runTool('hex', hex), '46 4C 41 47');
const risk = new FormData(); risk.set('input', 'device_new\npassword_reset\nunusual_value\nrapid_transfers');
assert.match(await runTool('risk', risk), /100\/100/);

console.log(`OK: ${challenges.length} missões, ${lessons.length} aulas, ${vulnerabilities.length} dossiês, ${realCases.length} casos, ${careers.length} carreiras e ferramentas validadas.`);

const qaProfile = createDefaultProfile('qa_operator::2ds-a', 'Aluno QA', '2º DS A');
assert.equal(qaProfile.combo, 0);
assert.equal(qaProfile.onboardingCompleted, false);
assert.deepEqual(qaProfile.dailyStats, { date: '', missions: 0, lessons: 0, tools: 0 });
assert.ok(renderDashboard(qaProfile).includes('OPERAÇÃO DO DIA'));
assert.ok(renderCTF(qaProfile, 'all').includes('MAPA DA OPERAÇÃO'));
for (const challenge of challenges) {
  const modal = renderChallengeModal(challenge, qaProfile);
  if (!challenge.tutorial) assert.ok(modal.includes('QUADRO DE EVIDÊNCIAS'), `Missão sem quadro de evidências: ${challenge.id}`);
  else assert.ok(modal.includes('training-stage') && modal.includes('TUTORIAL DA FERRAMENTA'), `Tutorial inicial incompleto: ${challenge.id}`);
  assert.ok(modal.includes('DIÁRIO DE INVESTIGAÇÃO'), `Missão sem diário: ${challenge.id}`);
  if (!challenge.tutorial) assert.ok(modal.includes('FERRAMENTAS SUGERIDAS') || modal.includes('ESCOLHA DA FERRAMENTA'), `Missão sem acesso ao arsenal: ${challenge.id}`);
  assert.ok(modal.includes('INVESTIGUE') && modal.includes('CAPTURE'), `Missão sem fluxo guiado: ${challenge.id}`);
}
assert.equal(getHintCost(challenges[0]), 0);
assert.equal(challenges.filter((item) => item.tutorial).length, 8);
assert.equal(toolTutorialCards().length, 13);
assert.equal(getToolDemo('base64').fields.action, 'decode');
assert.ok(buildToolTourSteps({ toolId: 'base64', selectTool: async () => {}, runDemo: async () => {} }).length >= 6);
assert.ok(renderChallengeModal(challenges[0], qaProfile).includes('TUTORIAL DA FERRAMENTA'));
assert.ok(renderChallengeModal(challenges[0], qaProfile).includes('data-start-animated-tutorial'));
assert.equal(qaProfile.settings.tutorialAutoPlay, true);
assert.deepEqual(qaProfile.tutorialProgress.tools, {});
assert.ok(renderChallengeModal(challenges.find((item) => item.difficulty === 'Avançado'), qaProfile).includes('OPERAÇÃO AUTÔNOMA'));

assert.equal(platformConfig.version, '2.2.0');
assert.equal(platformConfig.eduauth.productionProvisioned, false);
assert.equal(resolveShiftForClass('2º DS A'), 'morning');
assert.equal(resolveShiftForClass('Técnico Subsequente Noturno'), 'night');
const morningClass = detectCurrentPeriod('2º DS A', new Date('2026-07-29T10:35:00-03:00'));
assert.equal(morningClass.state, 'class');
assert.equal(morningClass.current.number, 4);
const morningBreak = detectCurrentPeriod('2º DS A', new Date('2026-07-29T10:05:00-03:00'));
assert.equal(morningBreak.state, 'break');
assert.ok(renderDelivery(qaProfile).includes('Central de conclusão e entrega'));
assert.ok(buildEvidenceHtml(qaProfile).includes('Nenhuma senha'));
assert.ok(renderAbout().includes('Professor Gabriel') && renderAbout().includes('v2.2.0'));


assert.equal(EDUAUTH_PLATFORM.platformVersion, '2.2.0');
assert.equal(EDUAUTH_PLATFORM.productionProvisioned, false);
assert.equal(EDUAUTH_KEY_CONFIG.environment, 'development');
assert.match(EDUAUTH_KEY_CONFIG.classKey.warning, /DO NOT USE IN PRODUCTION/);
assert.equal(Object.keys(EDUAUTH_ACTIONS).length, 7);
const classVectorDate = new Date('2026-07-29T16:30:00Z');
const classContext = { protocol: 'EDUAUTH', version: 1, mode: 'CLASS_SHARED_PIN', keyVersion: 1, platformCode: 1, classCode: 2, subjectCode: 1, lessonCode: 1, activityCode: 1, actionCode: 1, timeSlot: 1983714 };
const classCode = encodeRequestCode(classContext);
assert.equal(classCode, 'EA1C-1K01-040G-20G1-040G-200Y-8KH0-EXPT-GQR');
assert.deepEqual(decodeRequestCode(classCode), classContext);
assert.equal((await generateClassPin(classContext, 8)).replace(/\s/g, ''), '94046051');
assert.equal(await validateClassPin(classContext, '9404 6051', { date: classVectorDate, pinLength: 8 }), true);
assert.throws(() => decodeRequestCode('EA1C-1K01-040G-20G1-040G-200Y-8KH0-EXPT-GQ0'), /Checksum/);
const qr = qrMatrix(classCode);
assert.equal(qr.length, 37);
assert.equal(qr[0].length, 37);
assert.ok(qr.flat().some(Boolean));

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const swSource = await readFile(resolve(root, 'sw.js'), 'utf8');
assert.match(swSource, /ctfds-v2\.2\.0/);
assert.match(swSource, /eduauth\/index\.js/);
assert.match(swSource, /eduauth-platform-manifest\.json/);
assert.match(swSource, /guided-tutorial\.js/);
assert.match(swSource, /delivery\.js/);
assert.match(swSource, /schedule\.js/);
assert.match(swSource, /teacher-recovery\.js/);
const assetMatches = [...swSource.matchAll(/'\.\/([^']*)'/g)].map((match) => match[1]).filter(Boolean);
for (const asset of assetMatches) await access(resolve(root, asset));
for (const file of ['index.html', 'css/app.css', 'js/app.js', 'js/modules/mission-scenarios.js', 'eduauth-platform-manifest.json', 'eduauth-action-registry.json', 'eduauth-test-vectors.json', 'eduauth-provisioning-template.json', 'eduauth-integration-report.md']) await access(resolve(root, file));

const jsFiles = [];
const collectImports = async (relativeFile) => {
  const source = await readFile(resolve(root, relativeFile), 'utf8');
  for (const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
    const target = resolve(dirname(resolve(root, relativeFile)), match[1]);
    await access(target);
  }
};
for (const relativeFile of ['js/app.js','js/modules/ctf.js','js/modules/dashboard.js','js/modules/effects.js','js/modules/mission-scenarios.js','js/modules/guided-tutorial.js','js/modules/delivery.js','js/modules/about.js','js/modules/schedule.js','js/modules/teacher-recovery.js','js/eduauth/index.js','js/eduauth/ui/authorization-modal.js','js/eduauth/ui/teacher-center.js']) await collectImports(relativeFile);
console.log(`OK: renderização estrutural das ${challenges.length} missões, onboarding, campanha, arsenal e cache offline validados.`);

// Encrypted storage, migration boundary and administrative recovery smoke tests.
globalThis.localStorage = (() => {
  const map = new Map();
  return {
    getItem: (key) => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
})();
globalThis.sessionStorage = (() => {
  const map = new Map();
  return {
    getItem: (key) => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
})();

const liveSessionRequest = await createSessionRequest({ classCode: 2, actionCode: 3, profileId: 'qa-profile', ttlSeconds: 300, resourceId: 'evidence' });
const liveSessionPin = await generateSessionPin(liveSessionRequest.context, 8);
assert.equal((await validateSessionPin(liveSessionRequest, liveSessionPin, { pinLength: 8, actionId: 'result-release', resourceId: 'evidence' })).valid, true);
assert.equal((await validateSessionPin(liveSessionRequest, liveSessionPin, { pinLength: 8, actionId: 'result-release', resourceId: 'evidence' })).valid, false, 'PIN de sessão deve ser consumido após uso.');
const failedRequest = await createSessionRequest({ classCode: 2, actionCode: 5, profileId: 'qa-profile', ttlSeconds: 180, resourceId: 'profile:qa' });
for (let attempt = 0; attempt < 5; attempt += 1) {
  const state = await validateSessionPin(failedRequest, '0000000000', { pinLength: 10, actionId: 'progress-reset', resourceId: 'profile:qa' });
  if (state.reason === 'delay') {
    const stored = JSON.parse(sessionStorage.getItem('ctfds:eduauth:attempts:v1'));
    stored[failedRequest.context.requestIdTag].nextAllowedAt = 0;
    sessionStorage.setItem('ctfds:eduauth:attempts:v1', JSON.stringify(stored));
    attempt -= 1;
  }
}
assert.equal((await validateSessionPin(failedRequest, await generateSessionPin(failedRequest.context, 10), { pinLength: 10, actionId: 'progress-reset', resourceId: 'profile:qa' })).reason, 'locked');
const signedToken = 'EA1-G1.eyJwcm90b2NvbCI6IkVEVUFVVEgiLCJ2ZXJzaW9uIjoxLCJncmFudElkIjoiZ3JhbnQtdGVzdC0wMDAxIiwicGxhdGZvcm1JZCI6ImN0ZmRzIiwiYWN0aW9uSWQiOiJwcm9maWxlLWRlbGV0ZSIsInJlc291cmNlSWQiOiJwcm9maWxlOnRlc3QtcHJvZmlsZSIsInJpc2siOiJDUklUSUNBTCIsImlzc3VlZEF0IjoxNzg1MzQwODAwLCJleHBpcmVzQXQiOjE3ODUzNDQ0MDAsInNpbmdsZVVzZSI6dHJ1ZSwicmVhc29uIjoiVmV0b3IgZGUgdGVzdGUgYXV0b21hdGl6YWRvIn0.IIxDnntD5MWxXvrEhV2VYYHzCpmEtDB1T890XGZEr7v45PBBDFArgpqxfK2ICX7ACrLPQjQl_lPgN8Sx-tmNOQ';
const signedValid = await verifySignedGrant(signedToken, { actionId: 'profile-delete', resourceId: 'profile:test-profile' }, { now: 1785342600, consume: false });
assert.equal(signedValid.valid, true);
const signedWrongScope = await verifySignedGrant(signedToken, { actionId: 'profile-delete', resourceId: 'profile:other' }, { now: 1785342600, consume: false });
assert.equal(signedWrongScope.valid, false);
const signedAltered = await verifySignedGrant(`${signedToken.slice(0, -1)}A`, { actionId: 'profile-delete', resourceId: 'profile:test-profile' }, { now: 1785342600, consume: false });
assert.equal(signedAltered.valid, false);
console.log('OK: EduAuth coletivo, sessão, expiração, consumo, tentativas, QR e assinatura ECDSA validados.');

const storage = await import('../js/core/storage.js');
const account = await storage.registerLocalAccount('Aluno QA', '2º DS A', 'Frase#Segura2026');
assert.match(account.algorithm, /PBKDF2-SHA256 \+ AES-256-GCM/);
assert.equal((await storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Frase#Segura2026')).studentName, 'Aluno QA');
await assert.rejects(() => storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'errada'));
const encryptedProfile = normalizeProfile(createDefaultProfile(account.accountId, 'Aluno QA', '2º DS A'));
const { awardToProfile } = await import('../js/core/wallet.js');
awardToProfile(encryptedProfile, { sourceId: 'test-xp', xp: 10, source: 'automated-test' });
await storage.saveProfile(encryptedProfile, 'test_save', { suite: 'validate' });
assert.equal((await storage.loadProfile(account.accountId)).xp, 10);
assert.equal(await storage.verifyAuditChain(await storage.loadProfile(account.accountId)), true);
const backup = await storage.exportLocalData(account.accountId);
assert.equal(backup.schema, 'ctfds-edu-profile-v3');
assert.ok(!JSON.stringify(backup.encryptedRecord.encryptedProfile).includes('Aluno QA'));
storage.lockProfile(account.accountId);
assert.equal(await storage.loadProfile(account.accountId), null);
await storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Frase#Segura2026');
await storage.changeStudentPassword(account.accountId, 'Frase#Segura2026', 'Nova#Senha2026');
storage.lockProfile(account.accountId);
await assert.rejects(() => storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Frase#Segura2026'));
await storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Nova#Senha2026');
await storage.changeProfileIdentity(account.accountId, 'Nova#Senha2026', 'Aluno QA Corrigido', '3º DS A', 'Correção de identidade no teste');
storage.lockProfile(account.accountId);
await assert.rejects(() => storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Nova#Senha2026'));
assert.equal((await storage.authenticateLocalAccount('Aluno QA Corrigido', '3º DS A', 'Nova#Senha2026')).studentName, 'Aluno QA Corrigido');
const kit = await storage.createTeacherRecoveryKit('Frase Mestre Muito Segura 2026', 'Professor QA');
const profileForRecovery = await storage.loadProfile(account.accountId);
await storage.saveProfile(profileForRecovery, 'recovery_enabled', {});
storage.lockProfile(account.accountId);
await storage.recoverStudentPassword({ accountId: account.accountId, newPassword: 'Recuperada#2026', masterPassword: 'Frase Mestre Muito Segura 2026', kit, reason: 'Teste autorizado de recuperação', adminId: 'Professor QA' });
await assert.rejects(() => storage.authenticateLocalAccount('Aluno QA', '2º DS A', 'Nova#Senha2026'));
assert.equal((await storage.authenticateLocalAccount('Aluno QA Corrigido', '3º DS A', 'Recuperada#2026')).studentName, 'Aluno QA Corrigido');
console.log('OK: IndexedDB/fallback criptografado, AES-GCM, backup, bloqueio, alteração de senha e recuperação administrativa validados.');

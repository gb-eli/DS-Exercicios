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
import { ensureMissionDraft, getMissionDraft, getMissionProgressState, missionDraftHasWork, clearMissionDraft } from '../js/core/mission-progress.js';
import { renderChallengeModal, renderCTF, renderBlockCheckpointModal, getHintCost } from '../js/modules/ctf.js';
import { renderDashboard } from '../js/modules/dashboard.js';
import { renderProfile } from '../js/modules/profile.js';
import { getToolDemo, buildToolTourSteps, toolTutorialCards } from '../js/modules/guided-tutorial.js';
import { detectCurrentPeriod, resolveShiftForClass } from '../js/modules/schedule.js';
import { missionBlocks, getBlockStats, getBlockState, getActiveMissionBlock, checkpointSnapshot, getCampaignBlockSummary, getCheckpointRewardRecord, hasCheckpointReward } from '../js/core/mission-blocks.js';
import { renderDelivery, buildEvidenceHtml } from '../js/modules/delivery.js';
import { renderAbout } from '../js/modules/about.js';
import { platformConfig } from '../js/config/platform-config.js';
import { encodeRequestCode, decodeRequestCode } from '../js/eduauth/core/protocol.js';
import { generateClassPin, validateClassPin } from '../js/eduauth/modes/class-shared-pin.js';
import { createSessionRequest, generateSessionPin, validateSessionPin } from '../js/eduauth/modes/session-scoped-pin.js';
import { verifySignedGrant } from '../js/eduauth/modes/signed-grant.js';
import { qrMatrix } from '../js/eduauth/ui/qr-lite.js';
import { EDUAUTH_PLATFORM, EDUAUTH_KEY_CONFIG, EDUAUTH_ACTIONS } from '../js/eduauth/index.js';
import { CHALLENGE_SEALS } from '../js/security/challenge-seals.js';
import { challengeRuleIds } from '../js/security/challenge-rules.js';
import { verifyChallengeAnswer, resolveChallengePrompt } from '../js/security/challenge-verifier.js';
import { pilotMissionIds, advancedMissionIds, narrativeMissionIds, simulationMissionIds, getMissionCase, releaseMissionCase, getDecodedMissionCaseIds, getInvestigationReadiness } from '../js/data/mission-cases.js';
import { getCaseItems, evidenceKey, getUnlockedItemIds, getTimelineAssessment, moveTimelineEvent, getEvidenceAnnotationStats, getDecisionState } from '../js/core/investigation-engine.js';
import { renderInvestigativeWorkspace, formatActiveMissionTime } from '../js/modules/investigative-workspace.js';
import { claimProfileTabLock, releaseProfileTabLock, inspectProfileTabLock } from '../js/core/profile-tab-lock.js';
import { simulatorCatalog, renderSimulationWorkspace, runSimulation } from '../js/modules/simulation-suite.js';
import { immersiveCatalog, renderImmersiveWorkspace } from '../js/modules/immersive-suite.js';
import { IMMERSIVE_SCENARIOS, immersiveMissionMap, getImmersiveScenarioForMission } from '../js/data/immersive-scenarios.js';
import { QUALITY_PRESETS } from '../js/immersive/engine.js';
import { getNarrativeArc, getNarrativeVariant, getNarrativeUpdates, normalizeNarrativeProfile, recordNarrativeOutcome } from '../js/core/narrative-engine.js';
import { recommendQualityFromDiagnostics, summarizeDeviceDiagnostics } from '../js/core/device-diagnostics.js';
import { compareVersions, isNewerVersion } from '../js/core/update-manager.js';

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
  assert.ok(challenge.validator === 'sealed' || challengeRuleIds.includes(challenge.ruleId), `Verificador ausente: ${challenge.id}`);
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

assert.equal(unicodeToBase64('LABORATÓRIO'), 'TEFCT1JBVMOTUklP');
assert.equal(base64ToUnicode('TEFCT1JBVE9SSU8='), 'LABORATORIO');
assert.equal(textToBinary('DATA'), '01000100 01000001 01010100 01000001');
assert.equal(binaryToText('01000100 01000001 01010100 01000001'), 'DATA');
assert.equal(caesar('QHWZRUN', -3), 'NETWORK');
assert.ok(passwordScore('Uma-Frase#Longa2026').score >= 6);
assert.ok(isUnlocked(challenges[0], {}));
assert.ok(!isUnlocked(challenges.find((item) => item.id === 'final-01'), {}));
assert.equal(Object.keys(CHALLENGE_SEALS).length, 62);
assert.equal(challengeRuleIds.length, 6);
assert.equal((await verifyChallengeAnswer(challenges[0], 'RESPOSTA-INVALIDA', { accountId: 'qa' })).valid, false);
assert.match(resolveChallengePrompt(challenges[0]), /bandeira de treinamento/i);
assert.ok(!resolveChallengePrompt(challenges[0]).includes('CTF{'), 'O objetivo guiado não pode exibir a resposta.');
assert.ok(challenges.filter((item) => item.tutorial).every((item) => !item.tutorial.steps), 'Guias não podem conter roteiros específicos com dados da fase.');

const b64 = new FormData(); b64.set('input', 'ABC'); b64.set('action', 'encode');
assert.equal(await runTool('base64', b64), 'QUJD');
const hash = new FormData(); hash.set('input', 'abc');
assert.equal(await runTool('hash', hash), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
const hex = new FormData(); hex.set('input', 'LAB'); hex.set('action', 'encode');
assert.equal(await runTool('hex', hex), '4C 41 42');
const risk = new FormData(); risk.set('input', 'device_new\npassword_reset\nunusual_value\nrapid_transfers');
assert.match(await runTool('risk', risk), /100\/100/);
for (const simulator of simulatorCatalog) {
  const html = renderSimulationWorkspace(simulator.id, { missionId: 'qa-simulation' });
  assert.ok(html.includes('SEM REDE REAL') && html.includes(`data-tool-form="${simulator.id}"`), `Interface simulada incompleta: ${simulator.id}`);
  const data = new FormData(); data.set('missionId', 'qa-simulation'); data.set('action', simulator.id === 'sim-email' ? 'headers' : simulator.id === 'sim-browser' ? 'url' : simulator.id === 'sim-mobile' ? 'permissions' : simulator.id === 'sim-loglab' ? 'timeline' : simulator.id === 'sim-netscan' ? 'inventory' : 'triage');
  const result = await runSimulation(simulator.id, data);
  assert.ok(result.includes('Missão: qa-simulation') || result.includes('MISSÃO'), `Simulador sem relatório: ${simulator.id}`);
}

assert.equal(immersiveCatalog.length, 8, 'A campanha integral deve conter oito ambientes imersivos locais.');
assert.equal(Object.keys(IMMERSIVE_SCENARIOS).length, 8);
assert.ok(Object.keys(immersiveMissionMap).length >= 55, 'As experiências imersivas devem estar vinculadas a pelo menos 55 missões relevantes.');
assert.deepEqual(Object.keys(QUALITY_PRESETS), ['low','medium','high','ultra']);
for (const immersive of immersiveCatalog) {
  const html = renderImmersiveWorkspace(immersive.id, { missionId: 'qa-immersive', profile: { settings: { qualityPreset: 'auto' } } });
  assert.ok(html.includes('data-immersive-canvas') && html.includes('data-immersive-fallback'), `Ambiente sem 3D e fallback: ${immersive.id}`);
  assert.ok(html.includes('data-immersive-quality') && html.includes('data-immersive-action'), `Controles imersivos ausentes: ${immersive.id}`);
  assert.ok(html.includes('SEM ACESSO EXTERNO'), `Aviso de segurança ausente: ${immersive.id}`);
}
assert.equal(getImmersiveScenarioForMission('server-01')?.scene, 'server-room');
assert.equal(getImmersiveScenarioForMission('bank-01')?.scene, 'incident-response');
assert.equal(getImmersiveScenarioForMission('web-03')?.scene, 'application-lab');
assert.equal(getImmersiveScenarioForMission('hash-01')?.scene, 'forensic-vault');
assert.equal(getImmersiveScenarioForMission('mobile-deeplink-01')?.scene, 'mobile-lab');
assert.equal(recommendQualityFromDiagnostics({ hardware: { memoryGb: 2, cores: 2 }, viewport: { mobile: true }, preferences: {}, network: {}, support: { webgl: true }, benchmark: { score: 25 } }), 'low');
assert.equal(recommendQualityFromDiagnostics({ hardware: { memoryGb: 8, cores: 8 }, viewport: { mobile: false }, preferences: {}, network: {}, support: { webgl: true }, benchmark: { score: 115 } }), 'ultra');
assert.equal(compareVersions('3.2.0', '3.1.9'), 1);
assert.equal(isNewerVersion('3.2.0', '3.2.0'), false);
assert.match(summarizeDeviceDiagnostics({ capturedAt: 1, recommendedQuality: 'high', hardware: { cores: 8, memoryGb: 8 }, support: { webgl: true }, storage: {} }), /HIGH recomendado/);

console.log(`OK: ${challenges.length} missões, ${lessons.length} aulas, ${vulnerabilities.length} dossiês, ${realCases.length} casos, ${careers.length} carreiras e ferramentas validadas.`);

const qaProfile = createDefaultProfile('qa_operator::2ds-a', 'Aluno QA', '2º DS A');
assert.equal(qaProfile.combo, 0);
assert.equal(qaProfile.onboardingCompleted, false);
assert.deepEqual(qaProfile.dailyStats, { date: '', missions: 0, lessons: 0, tools: 0 });
assert.ok(renderDashboard(qaProfile).includes('OPERAÇÃO DO DIA'));
const profileHtml = renderProfile(qaProfile);
for (const control of ['TROCAR DE CONTA','SAIR E BLOQUEAR','LIMPAR CACHE DA INTERFACE','LIMPAR RASCUNHOS NÃO CONCLUÍDOS']) assert.ok(profileHtml.includes(control), `Controle de conta ausente: ${control}`);
assert.ok(profileHtml.includes('IndexedDB') && profileHtml.includes('CONTINUIDADE DAS MISSÕES'));
assert.ok(profileHtml.includes('DIAGNÓSTICO DO DISPOSITIVO') && profileHtml.includes('EXECUTAR DIAGNÓSTICO'));
assert.equal(qaProfile.storageSchemaVersion, 15);
const ctfHtml = renderCTF(qaProfile, 'all');
assert.ok(ctfHtml.includes('Central de Missões por Blocos'));
assert.ok(ctfHtml.includes('PACOTES DE MISSÕES'));
assert.ok(ctfHtml.includes('ROTA DO BLOCO 01'));
assert.ok(ctfHtml.includes('CHECKPOINT PEDAGÓGICO'));

// Mission blocks and checkpoint progression regression tests.
assert.equal(missionBlocks.length, 7, 'A campanha deve conter sete blocos.');
assert.deepEqual(missionBlocks.map((block) => block.total), [10, 10, 10, 10, 10, 10, 8]);
assert.equal(missionBlocks.reduce((total, block) => total + block.total, 0), challenges.length);
assert.equal(new Set(missionBlocks.flatMap((block) => block.missionIds)).size, challenges.length);
assert.equal(getActiveMissionBlock(qaProfile).id, 'block-01');
assert.equal(getBlockState(qaProfile, 'block-01').unlocked, true);
assert.equal(getBlockState(qaProfile, 'block-02').unlocked, false);
assert.equal(getCampaignBlockSummary(qaProfile).completed, 0);
const firstBlock = missionBlocks[0];
for (const missionId of firstBlock.missionIds) qaProfile.completed[missionId] = { stars: 3, completedAt: Date.now() };
const firstBlockStats = getBlockStats(qaProfile, firstBlock);
assert.equal(firstBlockStats.completed, 10);
assert.equal(firstBlockStats.percentage, 100);
assert.equal(getBlockState(qaProfile, 'block-02').unlocked, true);
const checkpoint = checkpointSnapshot(qaProfile, firstBlock);
assert.equal(checkpoint.blockId, 'block-01');
assert.equal(checkpoint.completed, 10);
assert.ok(checkpoint.score >= 0 && checkpoint.score <= 100);
assert.ok(renderBlockCheckpointModal(firstBlock, qaProfile).includes('PACOTE DE MISSÕES'));
assert.ok(renderBlockCheckpointModal(firstBlock, qaProfile).includes('RECOMPENSAS DO CHECKPOINT'));
assert.equal(hasCheckpointReward(qaProfile, firstBlock), false);
qaProfile.wallet.ledger.push({ sourceId: 'block:block-01', status: 'APPROVED', metadata: { checkpointId: 'checkpoint:block-01:test' } });
assert.equal(hasCheckpointReward(qaProfile, firstBlock), true);
assert.equal(getCheckpointRewardRecord(qaProfile, firstBlock).metadata.checkpointId, 'checkpoint:block-01:test');
qaProfile.wallet.ledger.pop();
// Restore a clean profile for the remaining rendering checks.
for (const missionId of firstBlock.missionIds) delete qaProfile.completed[missionId];
assert.equal(pilotMissionIds.length, 68, 'Todas as 68 missões devem estar convertidas em casos investigativos.');
assert.equal(advancedMissionIds.length, 58, 'A campanha integral deve manter 58 casos avançados após o bloco de treinamento.');
assert.equal(narrativeMissionIds.length, 68, 'Todas as missões devem participar da Narrative Engine.');
assert.equal(simulationMissionIds.length, 36, 'A Simulation Suite deve estar integrada a 36 casos compatíveis.');
assert.equal(simulatorCatalog.length, 6, 'A Simulation Suite deve conter seis simuladores locais.');
assert.deepEqual(getDecodedMissionCaseIds(), [], 'Nenhum caso deve ser decodificado apenas ao importar o catálogo.');
assert.ok(getMissionCase(pilotMissionIds[0]));
assert.deepEqual(getDecodedMissionCaseIds(), [pilotMissionIds[0]], 'Somente o caso solicitado deve ser materializado.');
releaseMissionCase(pilotMissionIds[0]);
assert.deepEqual(getDecodedMissionCaseIds(), [], 'O conteúdo do caso deve poder ser liberado da memória ao fechar a missão.');
for (const pilotId of pilotMissionIds) {
  const caseData = getMissionCase(pilotId);
  assert.ok(caseData, `Caso piloto ausente: ${pilotId}`);
  for (const drawer of ['tools','documents','records','communications','files']) assert.ok(caseData[drawer]?.length, `Gaveta ${drawer} vazia em ${pilotId}`);
  assert.ok(caseData.helpLevels?.length >= 4, `Ajuda em camadas incompleta em ${pilotId}`);
  if (caseData.processRequirements?.decision) assert.ok(caseData.decision?.required, `Decisão educativa ausente em ${pilotId}`);
  assert.ok(caseData.narrative?.arcId && caseData.narrative?.opening && caseData.narrative?.closing, `Narrativa incompleta em ${pilotId}`);
  assert.ok(getNarrativeArc(caseData.narrative.arcId), `Arco narrativo ausente em ${pilotId}`);
  const allCaseItems = getCaseItems(caseData);
  const allEvidence = allCaseItems.filter(({ drawer }) => drawer !== 'tools').map(({ drawer, item }) => evidenceKey(drawer, item.id));
  const completeDraft = {
    toolRuns: 99, submissions: 2,
    workspace: {
      viewedItems: allCaseItems.map(({ item }) => item.id),
      selectedEvidence: allEvidence,
      usedTools: (caseData.tools || []).map((tool) => tool.toolId),
      openedDrawers: ['briefing','documents','records','communications','files','tools','analysis','evidence','help'],
      evidenceAnnotations: Object.fromEntries(allEvidence.map((id) => [id, { note: 'Análise completa da evidência para validar o percurso investigativo.', confidence: 'high', relation: 'supports' }])),
      timelineOrder: [...(caseData.timelineEvents || [])].sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0)).map((event) => event.id),
      timelineMoves: 5,
      decisionChoice: caseData.decision?.options?.find((option) => option.quality === 'recommended')?.id || caseData.decision?.options?.[0]?.id || '',
      activeSeconds: 600,
      hypothesis: 'Hipótese completa com detalhes suficientes para o processo investigativo.',
      recommendation: 'Recomendação defensiva completa, proporcional e vinculada às evidências.',
      conclusion: 'Conclusão fundamentada nos materiais reunidos durante a investigação.',
    },
  };
  assert.equal(getUnlockedItemIds(caseData, completeDraft).length, allCaseItems.length, `Caso possui material inalcançável: ${pilotId}`);
  assert.equal(getInvestigationReadiness(pilotId, completeDraft).ready, true, `Caso não possui percurso completo alcançável: ${pilotId}`);
}
assert.ok(advancedMissionIds.filter((missionId) => getMissionCase(missionId)?.timelineEvents?.length).length >= 5, 'A fase avançada deve conter pelo menos cinco linhas do tempo visuais.');
for (const missionId of advancedMissionIds) {
  const completedProfile = createDefaultProfile(`resolution-${missionId}`, 'QA Resolução', '2º DS A');
  completedProfile.completed[missionId] = { stars: 3, completedAt: Date.now() };
  const resolutionModal = renderChallengeModal(challenges.find((item) => item.id === missionId), completedProfile, { success: true, message: 'Caso validado.' });
  const animation = getMissionCase(missionId).resolution?.animation || 'stabilize';
  assert.ok(resolutionModal.includes(`animation-${animation}`), `Animação contextual ausente: ${missionId}`);
}
for (const challenge of challenges) {
  const modal = renderChallengeModal(challenge, qaProfile);
  const pilot = pilotMissionIds.includes(challenge.id);
  if (pilot) {
    assert.ok(modal.includes('PAINEL INVESTIGATIVO') && modal.includes('MURAL DE EVIDÊNCIAS'), `Workspace investigativo ausente: ${challenge.id}`);
    assert.ok(modal.includes('RESPONDER E CONCLUIR') && (modal.includes('CASO INVESTIGATIVO') || modal.includes('INVESTIGAÇÃO AVANÇADA') || modal.includes('CASO NARRATIVO')), `Fluxo investigativo incompleto: ${challenge.id}`);
    if (advancedMissionIds.includes(challenge.id)) {
      assert.ok(modal.includes('INVESTIGAÇÃO AVANÇADA'), `Identificação avançada ausente: ${challenge.id}`);
    }
    if (narrativeMissionIds.includes(challenge.id)) {
      assert.ok(modal.includes('CASO NARRATIVO') && modal.includes('CANAL DA OPERAÇÃO'), `Narrative Engine ausente: ${challenge.id}`);
    }
    if (simulationMissionIds.includes(challenge.id)) {
      assert.ok(modal.includes('SIMULATION SUITE'), `Identificação da Simulation Suite ausente: ${challenge.id}`);
      const toolId = getMissionCase(challenge.id).tools[0].toolId;
      assert.ok(toolId.startsWith('sim-'), `Caso de simulação sem ferramenta simulada: ${challenge.id}`);
    }
    assert.ok(!modal.includes('INSTRUÇÕES DA MISSÃO'), `Caso piloto não deve expor painel longo antigo: ${challenge.id}`);
  } else {
    if (!challenge.tutorial) assert.ok(modal.includes('QUADRO DE EVIDÊNCIAS'), `Missão sem quadro de evidências: ${challenge.id}`);
    else assert.ok(modal.includes('training-stage') && modal.includes('GUIA DE USO DA FERRAMENTA'), `Guia inicial incompleto: ${challenge.id}`);
    assert.ok(modal.includes('DIÁRIO DE INVESTIGAÇÃO'), `Missão sem diário: ${challenge.id}`);
    if (!challenge.tutorial) assert.ok(modal.includes('FERRAMENTAS SUGERIDAS') || modal.includes('ESCOLHA DA FERRAMENTA'), `Missão sem acesso ao arsenal: ${challenge.id}`);
    assert.ok(modal.includes('INSTRUÇÕES DA MISSÃO'), `Missão antiga sem instruções: ${challenge.id}`);
  }
  assert.ok(modal.includes('OBJETIVO PRINCIPAL DA MISSÃO'), `Missão sem objetivo principal: ${challenge.id}`);
}


// Narrative Engine: deterministic variants, dynamic transmissions and cross-mission consequences.
const narrativeProfile = createDefaultProfile('narrative-qa', 'Aluno Narrativa', '2º DS A');
normalizeNarrativeProfile(narrativeProfile);
const narrativeCase = getMissionCase(narrativeMissionIds[0]);
const variantA = getNarrativeVariant(narrativeProfile, narrativeMissionIds[0], narrativeCase);
const variantB = getNarrativeVariant(narrativeProfile, narrativeMissionIds[0], narrativeCase);
assert.deepEqual(variantA, variantB, 'A variação narrativa deve ser determinística por perfil e missão.');
const lockedUpdates = getNarrativeUpdates(narrativeCase, { workspace: {} });
assert.ok(lockedUpdates.some((update) => !update.unlocked), 'A narrativa deve possuir comunicações progressivas.');
const completeNarrativeDraft = { toolRuns: 2, workspace: { viewedItems: ['a','b','c'], selectedEvidence: ['documents:x'], decisionChoice: narrativeCase.decision?.options?.[0]?.id || '' } };
assert.ok(getNarrativeUpdates(narrativeCase, completeNarrativeDraft).filter((update) => update.unlocked).length >= 2);
const outcome = recordNarrativeOutcome(narrativeProfile, narrativeMissionIds[0], completeNarrativeDraft, narrativeCase);
assert.equal(outcome.missionId, narrativeMissionIds[0]);
assert.ok(narrativeProfile.narrative.outcomes[narrativeMissionIds[0]]);

// Mission draft and resume-state regression tests.
const missionDraftProfile = createDefaultProfile('qa_draft::2ds-a', 'Aluno Rascunho', '2º DS A');
const firstMission = challenges[0];
assert.equal(getMissionProgressState(firstMission, missionDraftProfile).id, 'available');
const savedDraft = ensureMissionDraft(missionDraftProfile, firstMission.id, {
  answer: 'rascunho de investigação',
  evidence: ['evidência-a'],
  localTests: 2,
  toolRuns: 1,
});
assert.equal(missionDraftHasWork(savedDraft), true);
ensureMissionDraft(missionDraftProfile, firstMission.id, { workspace: { activeDrawer: 'documents', viewedItems: ['doc-welcome'], selectedEvidence: ['documents:doc-welcome'], hypothesis: 'Hipótese QA' } });
assert.equal(getMissionDraft(missionDraftProfile, firstMission.id).workspace.activeDrawer, 'documents');
assert.ok(getMissionDraft(missionDraftProfile, firstMission.id).workspace.selectedEvidence.includes('documents:doc-welcome'));
const analysisDraft = structuredClone(getMissionDraft(missionDraftProfile, firstMission.id));
analysisDraft.workspace.activeDrawer = 'analysis';
assert.ok(renderInvestigativeWorkspace(firstMission, analysisDraft).includes('Hipótese QA'));
assert.equal(formatActiveMissionTime(65), '01:05');
assert.equal(getInvestigationReadiness(firstMission.id, getMissionDraft(missionDraftProfile, firstMission.id)).ready, true, 'A missão de treinamento deve reconhecer material e ferramenta registrados.');
ensureMissionDraft(missionDraftProfile, firstMission.id, { workspace: { activeSeconds: 37, revision: 4 } });
assert.equal(getMissionDraft(missionDraftProfile, firstMission.id).workspace.activeSeconds, 37);
assert.equal(getMissionDraft(missionDraftProfile, firstMission.id).workspace.revision, 4);
ensureMissionDraft(missionDraftProfile, firstMission.id, {
  workspace: {
    simulatorHistory: [{ toolId: 'sim-email', action: 'headers', at: 123 }],
    lastSimulatorId: 'sim-email',
  },
});
const simulatorDraft = getMissionDraft(missionDraftProfile, firstMission.id);
assert.equal(simulatorDraft.version, 8, 'Rascunho estável deve usar versão 8.');
assert.equal(simulatorDraft.workspace.version, 9, 'Workspace estável deve usar versão 9.');
assert.equal(simulatorDraft.workspace.lastSimulatorId, 'sim-email');
assert.equal(simulatorDraft.workspace.simulatorHistory.length, 1, 'Histórico resumido do simulador deve persistir.');
ensureMissionDraft(missionDraftProfile, firstMission.id, { workspace: { immersiveHistory: [{ toolId: 'immersive-server', sceneId: 'server-room', action: 'contain', quality: 'medium', fallback: false, at: 456 }], lastImmersiveId: 'immersive-server' } });
const immersiveDraft = getMissionDraft(missionDraftProfile, firstMission.id);
assert.equal(immersiveDraft.workspace.immersiveHistory.length, 1, 'Histórico 3D/360 deve persistir.');
assert.equal(immersiveDraft.workspace.lastImmersiveId, 'immersive-server');
ensureMissionDraft(missionDraftProfile, firstMission.id, { workspace: { immersiveHistory: [{ toolId: 'immersive-server', sceneId: 'server-room', action: 'contain', quality: 'medium', fallback: false, fps: 41, scale: 0.82, orientation: 'landscape', at: 789 }] } });
const diagnosticImmersiveDraft = getMissionDraft(missionDraftProfile, firstMission.id);
assert.equal(diagnosticImmersiveDraft.workspace.immersiveHistory[0].fps, 41);
assert.equal(diagnosticImmersiveDraft.workspace.immersiveHistory[0].orientation, 'landscape');
assert.equal(missionDraftHasWork(simulatorDraft), true, 'Uso de simulador deve contar como trabalho preservável.');

// Advanced investigation: progressive unlock, annotations, timeline and decision.
const advancedMission = challenges.find((item) => item.id === 'iot-01');
const advancedCase = getMissionCase(advancedMission.id);
const advancedDraft = ensureMissionDraft(missionDraftProfile, advancedMission.id, {});
const initialUnlocked = getUnlockedItemIds(advancedCase, advancedDraft);
assert.ok(initialUnlocked.length < ['documents','records','communications','files','tools'].flatMap((drawer) => advancedCase[drawer] || []).length, 'Caso avançado deve liberar materiais progressivamente.');
const initialTimeline = getTimelineAssessment(advancedCase, advancedDraft.workspace);
assert.equal(initialTimeline.correct, false, 'Linha do tempo deve começar fora da ordem correta.');
const movedTimeline = moveTimelineEvent(advancedCase, initialTimeline.order, initialTimeline.order[1], 'up');
assert.notDeepEqual(movedTimeline, initialTimeline.order, 'Evento da linha do tempo deve ser movível por botões.');
const correctTimeline = [...advancedCase.timelineEvents].sort((a, b) => a.sequence - b.sequence).map((event) => event.id);
const selectedEvidence = ['documents:doc-iot-baseline','records:log-iot-services','communications:msg-security-iot'];
ensureMissionDraft(missionDraftProfile, advancedMission.id, {
  toolRuns: 1,
  workspace: {
    viewedItems: ['doc-iot-baseline','doc-vendor','log-iot-services','msg-facilities','msg-security-iot'],
    openedDrawers: ['documents','records','communications','tools','analysis','evidence'],
    usedTools: ['logs'],
    selectedEvidence,
    evidenceAnnotations: {
      'documents:doc-iot-baseline': { note: 'O inventário confirma que o dispositivo deveria estar em segmento isolado.', confidence: 'high', relation: 'supports' },
      'records:log-iot-services': { note: 'Os serviços observados divergem do padrão de segurança aprovado.', confidence: 'high', relation: 'supports' },
      'communications:msg-security-iot': { note: 'A comunicação confirma a necessidade de contenção temporária.', confidence: 'medium', relation: 'context' },
    },
    activeDrawer: 'analysis',
    timelineOrder: correctTimeline,
    timelineMoves: 3,
    decisionChoice: 'isolated',
    hypothesis: 'A câmera foi conectada fora do segmento previsto e manteve configuração insegura.',
    recommendation: 'Isolar o equipamento, trocar credenciais e revisar firmware antes da liberação.',
    conclusion: 'Os registros e o inventário demonstram exposição incompatível com a política interna.',
  },
});
const advancedSavedDraft = getMissionDraft(missionDraftProfile, advancedMission.id);
assert.equal(getEvidenceAnnotationStats(advancedSavedDraft.workspace).complete, 3);
assert.equal(getTimelineAssessment(advancedCase, advancedSavedDraft.workspace).correct, true);
assert.equal(getDecisionState(advancedCase, advancedSavedDraft.workspace).complete, true);
assert.equal(getInvestigationReadiness(advancedMission.id, advancedSavedDraft).ready, true, 'Caso avançado completo deve liberar validação final.');
assert.ok(renderInvestigativeWorkspace(advancedMission, advancedSavedDraft).includes('LINHA DO TEMPO VISUAL'));
assert.ok(renderInvestigativeWorkspace(advancedMission, advancedSavedDraft).includes('DECISÃO INVESTIGATIVA'));
const advancedHelpDraft = structuredClone(advancedSavedDraft);
advancedHelpDraft.workspace.activeDrawer = 'help';
assert.ok(renderInvestigativeWorkspace(advancedMission, advancedHelpDraft).includes('AJUDA EM CAMADAS'));

assert.equal(getMissionProgressState(firstMission, missionDraftProfile).id, 'in-progress');
assert.ok(renderCTF(missionDraftProfile, 'in-progress').includes('CONTINUAR MISSÃO'));
assert.ok(renderChallengeModal(firstMission, missionDraftProfile, savedDraft).includes('rascunho de investigação'));
clearMissionDraft(missionDraftProfile, firstMission.id);
assert.equal(getMissionProgressState(firstMission, missionDraftProfile).id, 'available');

assert.equal(getHintCost(challenges[0]), 0);
assert.equal(challenges.filter((item) => item.tutorial).length, 8);
assert.equal(toolTutorialCards().length, 13);
assert.equal(getToolDemo('base64').fields.action, 'decode');
assert.ok(buildToolTourSteps({ toolId: 'base64', selectTool: async () => {}, runDemo: async () => {} }).length >= 6);
assert.ok(renderChallengeModal(challenges[0], qaProfile).includes('PAINEL INVESTIGATIVO'));
const advancedTutorialMission = challenges.find((item) => item.id === 'treasure-03');
const advancedTutorialModal = renderChallengeModal(advancedTutorialMission, qaProfile);
assert.ok(advancedTutorialModal.includes('INVESTIGAÇÃO AVANÇADA'));
const advancedTutorialHelpDraft = ensureMissionDraft(qaProfile, advancedTutorialMission.id, { workspace: { activeDrawer: 'help' } });
assert.ok(renderInvestigativeWorkspace(advancedTutorialMission, advancedTutorialHelpDraft).includes('AJUDA EM CAMADAS'));
assert.ok(!advancedTutorialModal.includes('data-start-animated-tutorial'), 'Caso avançado deve usar ajuda contextual, não tutorial legado.');
assert.equal(qaProfile.settings.tutorialAutoPlay, true);
assert.deepEqual(qaProfile.tutorialProgress.tools, {});
assert.ok(renderChallengeModal(challenges.find((item) => item.difficulty === 'Avançado'), qaProfile).includes('CASO NARRATIVO'));
assert.ok(renderChallengeModal(challenges.find((item) => item.id === 'server-01'), qaProfile).includes('3D/360'), 'Missão mapeada deve expor atalho imersivo.');

assert.equal(platformConfig.version, '3.2.0');
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
assert.ok(renderAbout().includes('Professor Gabriel') && renderAbout().includes('v3.2.0'));


assert.equal(EDUAUTH_PLATFORM.platformVersion, '3.2.0');
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
const appSource = await readFile(resolve(root, 'js/app.js'), 'utf8');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const challengeSecurityManifest = JSON.parse(await readFile(resolve(root, 'challenge-security-manifest.json'), 'utf8'));
assert.equal(challengeSecurityManifest.platformVersion, '3.2.0');
assert.equal(packageJson.scripts.test, 'npm run check');
const missionCaseSource = `${await readFile(resolve(root, 'js/data/mission-cases.js'), 'utf8')}
${await readFile(resolve(root, 'js/data/mission-case-packets.js'), 'utf8')}`;
for (const leaked of ['10.0.0.23', '443/tcp', 'VHFXULWB', 'READ_CONTACTS', 'Administrador global', 'camera-lab-07', 'estacao-lab-14', 'workstation-22', 'u-0091', 'R$ 18.000']) assert.ok(!missionCaseSource.includes(leaked), `Pacote investigativo expõe dado pesquisável: ${leaked}`);

assert.match(appSource, /mission-tool-artifact/);
assert.match(appSource, /getChallengeArtifact\('training-01', 'promptFlag'\)/);
assert.match(swSource, /STATIC_CACHE = `\$\{CACHE_PREFIX\}static-v\$\{SW_VERSION\}`/);
assert.match(swSource, /SKIP_WAITING/);
assert.match(swSource, /networkFirst/);
assert.match(swSource, /immersive-suite\.js/);
assert.match(swSource, /immersive\/engine\.js/);
assert.match(swSource, /eduauth\/index\.js/);
assert.match(swSource, /eduauth-platform-manifest\.json/);
assert.match(swSource, /guided-tutorial\.js/);
assert.match(swSource, /delivery\.js/);
assert.match(swSource, /schedule\.js/);
assert.match(swSource, /teacher-recovery\.js/);
assert.match(swSource, /profile-tab-lock\.js/);
assert.match(swSource, /investigation-engine\.js/);
assert.match(swSource, /EVOLUTION_PHASES\.md/);
const assetMatches = [...swSource.matchAll(/'\.\/([^']*)'/g)].map((match) => match[1]).filter(Boolean);
for (const asset of assetMatches) await access(resolve(root, asset));
for (const file of ['STABLE_RUNTIME_V3_2.md', 'FULL_CAMPAIGN_V3_1.md', 'SIMULATION_SUITE.md', 'NARRATIVE_ENGINE.md', 'ADVANCED_INVESTIGATION.md', 'EVOLUTION_PHASES.md', 'challenge-security-manifest.json','js/security/challenge-verifier.js','js/security/challenge-seals.js','index.html', 'css/app.css', 'js/app.js', 'js/modules/mission-scenarios.js', 'js/modules/investigative-workspace.js', 'js/data/mission-cases.js', 'js/core/mission-progress.js', 'js/core/investigation-engine.js', 'js/core/narrative-engine.js', 'js/data/narrative-catalog.js', 'js/data/simulator-scenarios.js', 'js/modules/simulation-suite.js', 'js/core/profile-tab-lock.js', 'js/core/mission-blocks.js', 'eduauth-platform-manifest.json', 'eduauth-action-registry.json', 'eduauth-test-vectors.json', 'eduauth-provisioning-template.json', 'eduauth-integration-report.md']) await access(resolve(root, file));

const jsFiles = [];
const collectImports = async (relativeFile) => {
  const source = await readFile(resolve(root, relativeFile), 'utf8');
  for (const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
    const target = resolve(dirname(resolve(root, relativeFile)), match[1]);
    await access(target);
  }
};
for (const relativeFile of ['js/app.js','js/modules/ctf.js','js/modules/dashboard.js','js/modules/effects.js','js/modules/mission-scenarios.js','js/core/mission-progress.js','js/core/investigation-engine.js','js/core/narrative-engine.js','js/data/narrative-catalog.js','js/data/simulator-scenarios.js','js/modules/simulation-suite.js','js/core/profile-tab-lock.js','js/core/mission-blocks.js', 'js/core/mission-blocks.js','js/modules/guided-tutorial.js','js/modules/delivery.js','js/modules/about.js','js/modules/schedule.js','js/modules/teacher-recovery.js','js/eduauth/index.js','js/eduauth/ui/authorization-modal.js','js/eduauth/ui/teacher-center.js']) await collectImports(relativeFile);
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

localStorage.setItem('ctfds:profile-tab-lock:qa-lock', JSON.stringify({ accountId: 'qa-lock', tabId: 'other-tab', updatedAt: Date.now() }));
assert.equal(inspectProfileTabLock('qa-lock').active, true);
assert.equal(claimProfileTabLock('qa-lock').ok, false);
assert.equal(claimProfileTabLock('qa-lock', { force: true }).ok, true);
releaseProfileTabLock();
assert.equal(inspectProfileTabLock('qa-lock').active, false);

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
const reloadedEncryptedProfile = await storage.loadProfile(account.accountId);
assert.equal(reloadedEncryptedProfile.xp, 10);
assert.equal(reloadedEncryptedProfile.storageSchemaVersion, 15, 'Perfil persistido deve usar schema 15.');
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

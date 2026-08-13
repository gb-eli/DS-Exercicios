import { MISSION_CASE_PACKETS } from './mission-case-packets.js';
import { getEvidenceAnnotationStats, getTimelineAssessment, getDecisionState } from '../core/investigation-engine.js';

export const pilotMissionIds = Object.freeze([
  'training-01',
  'training-02',
  'training-03',
  'training-04',
  'training-05',
  'training-06',
  'training-07',
  'training-08',
  'recruit-00',
  'treasure-01',
  'treasure-03',
  'treasure-02',
  'html-01',
  'css-01',
  'reverse-hex-01',
  'intro-01',
  'crypto-01',
  'web-01',
  'network-01',
  'pix-01',
  'wallet-01',
  'mobile-permissions-01',
  'cloud-iam-01',
  'dfir-01',
  'incident-order-01',
  'data-01',
  'web-02',
  'password-01',
  'network-02',
  'dfir-02',
  'pix-02',
  'crypto-ledger-01',
  'mobile-storage-01',
  'cloud-bucket-01',
  'memory-01',
  'xss-fix-01',
  'headers-01',
  'entropy-math-01',
  'dns-mail-01',
  'fraud-math-01',
  'crypto-02',
  'web-03',
  'access-01',
  'iot-01',
  'pix-03',
  'mobile-deeplink-01',
  'docker-secret-01',
  'hash-01',
  'solidity-01',
  'ransomware-01',
  'sql-code-01',
  'api-access-01',
  'pcap-01',
  'php-sql-01',
  'python-template-01',
  'csharp-auth-01',
  'bank-value-01',
  'server-01',
  'bank-01',
  'blue-01',
  'cloud-01',
  'crypto-recruiter-01',
  'cicd-01',
  'supply-chain-01',
  'ai-01',
  'card-token-01',
  'final-01',
  'swift-01',
]);

export const advancedMissionIds = Object.freeze([
  'treasure-03',
  'treasure-02',
  'html-01',
  'css-01',
  'reverse-hex-01',
  'intro-01',
  'crypto-01',
  'web-01',
  'network-01',
  'pix-01',
  'wallet-01',
  'mobile-permissions-01',
  'cloud-iam-01',
  'dfir-01',
  'incident-order-01',
  'data-01',
  'web-02',
  'password-01',
  'network-02',
  'dfir-02',
  'pix-02',
  'crypto-ledger-01',
  'mobile-storage-01',
  'cloud-bucket-01',
  'memory-01',
  'xss-fix-01',
  'headers-01',
  'entropy-math-01',
  'dns-mail-01',
  'fraud-math-01',
  'crypto-02',
  'web-03',
  'access-01',
  'iot-01',
  'pix-03',
  'mobile-deeplink-01',
  'docker-secret-01',
  'hash-01',
  'solidity-01',
  'ransomware-01',
  'sql-code-01',
  'api-access-01',
  'pcap-01',
  'php-sql-01',
  'python-template-01',
  'csharp-auth-01',
  'bank-value-01',
  'server-01',
  'bank-01',
  'blue-01',
  'cloud-01',
  'crypto-recruiter-01',
  'cicd-01',
  'supply-chain-01',
  'ai-01',
  'card-token-01',
  'final-01',
  'swift-01',
]);

export const narrativeMissionIds = Object.freeze([
  'training-01',
  'training-02',
  'training-03',
  'training-04',
  'training-05',
  'training-06',
  'training-07',
  'training-08',
  'recruit-00',
  'treasure-01',
  'treasure-03',
  'treasure-02',
  'html-01',
  'css-01',
  'reverse-hex-01',
  'intro-01',
  'crypto-01',
  'web-01',
  'network-01',
  'pix-01',
  'wallet-01',
  'mobile-permissions-01',
  'cloud-iam-01',
  'dfir-01',
  'incident-order-01',
  'data-01',
  'web-02',
  'password-01',
  'network-02',
  'dfir-02',
  'pix-02',
  'crypto-ledger-01',
  'mobile-storage-01',
  'cloud-bucket-01',
  'memory-01',
  'xss-fix-01',
  'headers-01',
  'entropy-math-01',
  'dns-mail-01',
  'fraud-math-01',
  'crypto-02',
  'web-03',
  'access-01',
  'iot-01',
  'pix-03',
  'mobile-deeplink-01',
  'docker-secret-01',
  'hash-01',
  'solidity-01',
  'ransomware-01',
  'sql-code-01',
  'api-access-01',
  'pcap-01',
  'php-sql-01',
  'python-template-01',
  'csharp-auth-01',
  'bank-value-01',
  'server-01',
  'bank-01',
  'blue-01',
  'cloud-01',
  'crypto-recruiter-01',
  'cicd-01',
  'supply-chain-01',
  'ai-01',
  'card-token-01',
  'final-01',
  'swift-01',
]);

export const simulationMissionIds = Object.freeze([
  'pix-02',
  'crypto-ledger-01',
  'mobile-storage-01',
  'cloud-bucket-01',
  'memory-01',
  'headers-01',
  'entropy-math-01',
  'dns-mail-01',
  'fraud-math-01',
  'network-02',
  'web-01',
  'web-02',
  'web-03',
  'access-01',
  'server-01',
  'hash-01',
  'blue-01',
  'cloud-01',
  'incident-order-01',
  'supply-chain-01',
  'ai-01',
  'pix-03',
  'bank-value-01',
  'card-token-01',
  'swift-01',
  'wallet-01',
  'solidity-01',
  'crypto-recruiter-01',
  'mobile-deeplink-01',
  'docker-secret-01',
  'cicd-01',
  'php-sql-01',
  'python-template-01',
  'csharp-auth-01',
  'reverse-hex-01',
  'ransomware-01',
]);

const processRequirements = Object.freeze({
  'training-01': { minViewedItems: 1, minEvidence: 0, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 0, recommendationLength: 0, conclusionLength: 0 },
  'intro-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 18, recommendationLength: 18, conclusionLength: 18 },
  'crypto-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 12, recommendationLength: 12, conclusionLength: 12 },
  'network-01': { minViewedItems: 2, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'dfir-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 18, recommendationLength: 18, conclusionLength: 18 },
  'sql-code-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 15, recommendationLength: 18, conclusionLength: 15 },
  'pix-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'mobile-permissions-01': { minViewedItems: 2, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 15, recommendationLength: 18, conclusionLength: 15 },
  'cloud-iam-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'final-01': { minViewedItems: 4, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, hypothesisLength: 24, recommendationLength: 24, conclusionLength: 24 },
  'training-02': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 10, recommendationLength: 10, conclusionLength: 10 },
  'treasure-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'html-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'xss-fix-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 2, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'password-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'iot-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 20, recommendationLength: 22, conclusionLength: 20 },
  'dfir-02': { minViewedItems: 4, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 20, recommendationLength: 22, conclusionLength: 20 },
  'bank-01': { minViewedItems: 6, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: true, decisionRequired: true, hypothesisLength: 24, recommendationLength: 24, conclusionLength: 24 },
  'api-access-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 20, recommendationLength: 22, conclusionLength: 20 },
  'pcap-01': { minViewedItems: 6, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: true, decisionRequired: true, hypothesisLength: 24, recommendationLength: 24, conclusionLength: 24 },

  'training-03': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 8, recommendationLength: 8, conclusionLength: 8 },
  'training-04': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 8, recommendationLength: 8, conclusionLength: 8 },
  'training-05': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 8, recommendationLength: 8, conclusionLength: 8 },
  'training-06': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 8, recommendationLength: 8, conclusionLength: 8 },
  'training-07': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 10, recommendationLength: 10, conclusionLength: 10 },
  'training-08': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 1, hypothesisLength: 10, recommendationLength: 10, conclusionLength: 10 },
  'recruit-00': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 0, minToolRuns: 0, hypothesisLength: 8, recommendationLength: 8, conclusionLength: 8 },
  'treasure-03': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 12, recommendationLength: 12, conclusionLength: 12 },
  'treasure-02': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, hypothesisLength: 12, recommendationLength: 12, conclusionLength: 12 },
  'css-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },

  'pix-02': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'crypto-ledger-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'mobile-storage-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'cloud-bucket-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'memory-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 20, recommendationLength: 22, conclusionLength: 20 },
  'headers-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'entropy-math-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'dns-mail-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'fraud-math-01': { minViewedItems: 3, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 16, recommendationLength: 18, conclusionLength: 16 },
  'network-02': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  // v3.1.0 — campanha investigativa completa
  'data-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 12, recommendationLength: 14, conclusionLength: 12 },
  'crypto-02': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 12, recommendationLength: 14, conclusionLength: 12 },
  'web-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 12, recommendationLength: 14, conclusionLength: 12 },
  'web-02': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'web-03': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'access-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'server-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'hash-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'blue-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: true, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'cloud-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'incident-order-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'supply-chain-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'ai-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'pix-03': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'bank-value-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'card-token-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'swift-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'wallet-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 12, recommendationLength: 14, conclusionLength: 12 },
  'solidity-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'crypto-recruiter-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'mobile-deeplink-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'docker-secret-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'cicd-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: true, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'php-sql-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'python-template-01': { minViewedItems: 4, minEvidence: 2, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 18, recommendationLength: 20, conclusionLength: 18 },
  'csharp-auth-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
  'reverse-hex-01': { minViewedItems: 2, minEvidence: 1, minAnnotatedEvidence: 1, minToolRuns: 1, timelineRequired: false, decisionRequired: true, hypothesisLength: 12, recommendationLength: 14, conclusionLength: 12 },
  'ransomware-01': { minViewedItems: 5, minEvidence: 3, minAnnotatedEvidence: 2, minToolRuns: 2, timelineRequired: true, decisionRequired: true, hypothesisLength: 22, recommendationLength: 24, conclusionLength: 22 },
});

const seedFor = (text) => {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(text)) { hash ^= byte; hash = Math.imul(hash, 16777619) >>> 0; }
  return hash || 0x9e3779b9;
};

const decodePacket = (missionId, packet) => {
  let state = seedFor(`CTFDS-CASE-V5|${missionId}|FULL-CAMPAIGN`);
  const encrypted = Uint8Array.from(atob(packet), (char) => char.charCodeAt(0));
  const clear = new Uint8Array(encrypted.length);
  for (let index = 0; index < encrypted.length; index += 1) {
    state ^= (state << 13) >>> 0;
    state ^= state >>> 17;
    state ^= (state << 5) >>> 0;
    state >>>= 0;
    clear[index] = encrypted[index] ^ (state & 0xff);
  }
  return JSON.parse(new TextDecoder().decode(clear));
};

const cache = new Map();

export const isPilotMission = (missionId) => pilotMissionIds.includes(missionId);
export const isAdvancedInvestigationMission = (missionId) => advancedMissionIds.includes(missionId);
export const isNarrativeMission = (missionId) => narrativeMissionIds.includes(missionId);
export const isSimulationMission = (missionId) => simulationMissionIds.includes(missionId);

export const getMissionCase = (missionId) => {
  if (!isPilotMission(missionId) || !MISSION_CASE_PACKETS[missionId]) return null;
  if (!cache.has(missionId)) cache.set(missionId, Object.freeze(decodePacket(missionId, MISSION_CASE_PACKETS[missionId])));
  return cache.get(missionId);
};

export const releaseMissionCase = (missionId) => {
  if (missionId) cache.delete(missionId);
};

export const clearMissionCaseCache = () => cache.clear();
export const getDecodedMissionCaseIds = () => [...cache.keys()];
export const getInvestigationRequirements = (missionId) => ({
  minViewedItems: 1,
  minEvidence: 1,
  minAnnotatedEvidence: 0,
  minToolRuns: 1,
  timelineRequired: false,
  decisionRequired: false,
  hypothesisLength: 10,
  recommendationLength: 10,
  conclusionLength: 10,
  ...(processRequirements[missionId] || {}),
});

const lengthOf = (value) => String(value || '').trim().length;

export const getInvestigationReadiness = (missionId, draft = {}) => {
  const requirements = getInvestigationRequirements(missionId);
  const workspace = draft?.workspace || {};
  const caseData = getMissionCase(missionId);
  const viewedCount = new Set(workspace.viewedItems || []).size;
  const evidenceCount = new Set(workspace.selectedEvidence || []).size;
  const annotations = getEvidenceAnnotationStats(workspace);
  const timeline = getTimelineAssessment(caseData, workspace);
  const decision = getDecisionState(caseData, workspace);
  const checks = [
    {
      id: 'materials', label: `Analisar ${requirements.minViewedItems} material(is)`, current: viewedCount, required: requirements.minViewedItems,
      complete: viewedCount >= requirements.minViewedItems, drawer: 'documents',
    },
    {
      id: 'tools', label: `Utilizar ${requirements.minToolRuns} ferramenta(s)`, current: Number(draft?.toolRuns || 0), required: requirements.minToolRuns,
      complete: Number(draft?.toolRuns || 0) >= requirements.minToolRuns, drawer: 'tools',
    },
    {
      id: 'evidence', label: requirements.minEvidence ? `Fixar ${requirements.minEvidence} evidência(s)` : 'Evidência opcional', current: evidenceCount, required: requirements.minEvidence,
      complete: evidenceCount >= requirements.minEvidence, drawer: 'evidence',
    },
    {
      id: 'annotations', label: requirements.minAnnotatedEvidence ? `Analisar ${requirements.minAnnotatedEvidence} evidência(s) no mural` : 'Anotação opcional', current: annotations.complete, required: requirements.minAnnotatedEvidence,
      complete: annotations.complete >= requirements.minAnnotatedEvidence, drawer: 'evidence',
    },
    {
      id: 'timeline', label: 'Organizar a linha do tempo', current: timeline.correct ? 1 : 0, required: requirements.timelineRequired ? 1 : 0,
      complete: !requirements.timelineRequired || timeline.correct, drawer: 'analysis',
    },
    {
      id: 'decision', label: 'Registrar uma decisão investigativa', current: decision.complete ? 1 : 0, required: requirements.decisionRequired ? 1 : 0,
      complete: !requirements.decisionRequired || decision.complete, drawer: 'analysis',
    },
    {
      id: 'hypothesis', label: requirements.hypothesisLength ? 'Registrar uma hipótese' : 'Hipótese opcional', current: lengthOf(workspace.hypothesis), required: requirements.hypothesisLength,
      complete: lengthOf(workspace.hypothesis) >= requirements.hypothesisLength, drawer: 'analysis',
    },
    {
      id: 'recommendation', label: requirements.recommendationLength ? 'Propor uma medida defensiva' : 'Recomendação opcional', current: lengthOf(workspace.recommendation), required: requirements.recommendationLength,
      complete: lengthOf(workspace.recommendation) >= requirements.recommendationLength, drawer: 'analysis',
    },
    {
      id: 'conclusion', label: requirements.conclusionLength ? 'Redigir a conclusão do caso' : 'Conclusão opcional', current: lengthOf(workspace.conclusion), required: requirements.conclusionLength,
      complete: lengthOf(workspace.conclusion) >= requirements.conclusionLength, drawer: 'analysis',
    },
  ];
  const requiredChecks = checks.filter((check) => check.required > 0);
  const completed = requiredChecks.filter((check) => check.complete).length;
  const firstMissing = requiredChecks.find((check) => !check.complete) || null;
  return {
    requirements, checks, requiredCount: requiredChecks.length, completedCount: completed,
    percent: requiredChecks.length ? Math.round((completed / requiredChecks.length) * 100) : 100,
    ready: !firstMissing, firstMissing, timeline, decision, annotations,
  };
};

export const getInvestigationCaseStats = () => ({
  total: pilotMissionIds.length,
  advanced: advancedMissionIds.length,
  narrative: narrativeMissionIds.length,
  simulation: simulationMissionIds.length,
  sealedPackets: Object.keys(MISSION_CASE_PACKETS).length,
});

import { NARRATIVE_ARCS, NARRATIVE_CHARACTERS } from '../data/narrative-catalog.js';

const list = (value) => Array.isArray(value) ? value : [];
const text = (value) => String(value ?? '');

const hash32 = (value) => {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(text(value))) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
};

const pick = (items, seed, offset = 0) => {
  const source = list(items);
  return source.length ? source[(seed + offset) % source.length] : '';
};

export const normalizeNarrativeProfile = (profile) => {
  const raw = profile?.narrative && typeof profile.narrative === 'object' && !Array.isArray(profile.narrative) ? profile.narrative : {};
  profile.narrative = {
    version: 1,
    outcomes: raw.outcomes && typeof raw.outcomes === 'object' && !Array.isArray(raw.outcomes) ? raw.outcomes : {},
    arcs: raw.arcs && typeof raw.arcs === 'object' && !Array.isArray(raw.arcs) ? raw.arcs : {},
    lastMissionId: text(raw.lastMissionId).slice(0, 120),
    updatedAt: Math.max(0, Number(raw.updatedAt) || 0),
  };
  return profile.narrative;
};

export const getNarrativeArc = (arcId) => NARRATIVE_ARCS[arcId] || null;
export const getNarrativeCharacter = (characterId) => NARRATIVE_CHARACTERS[characterId] || null;

export const getNarrativeVariant = (profile, missionId, caseData) => {
  const pool = caseData?.narrative?.variantPool || {};
  const seed = hash32(`${profile?.accountId || profile?.username || 'operator'}|${missionId}|NARRATIVE-V1`);
  return Object.freeze({
    id: `nv-${seed.toString(16).padStart(8, '0')}`,
    location: pick(pool.locations, seed, 0) || 'Central Sentinel',
    shiftCode: pick(pool.shiftCodes, seed, 7) || 'ALFA-1',
    callSign: pick(pool.callSigns, seed, 13) || 'Vetor',
  });
};

const ruleReady = (rule = {}, draft = {}) => {
  const workspace = draft?.workspace || {};
  const viewed = new Set(list(workspace.viewedItems));
  const selected = new Set(list(workspace.selectedEvidence));
  const tools = new Set(list(workspace.usedTools));
  if (Number(rule.minViewed || 0) > viewed.size) return false;
  if (Number(rule.minEvidence || 0) > selected.size) return false;
  if (Number(rule.minToolRuns || 0) > Number(draft?.toolRuns || 0)) return false;
  if (list(rule.viewed).some((id) => !viewed.has(id))) return false;
  if (list(rule.tools).some((id) => !tools.has(id))) return false;
  if (rule.anyDecision && !workspace.decisionChoice) return false;
  return true;
};

export const getNarrativeUpdates = (caseData, draft = {}) => list(caseData?.narrative?.updates).map((update) => ({
  ...update,
  unlocked: !update.unlock || ruleReady(update.unlock, draft),
  viewed: list(draft?.workspace?.narrativeUpdatesViewed).includes(update.id),
  character: getNarrativeCharacter(update.from),
}));

export const getNarrativeCast = (caseData) => list(caseData?.narrative?.cast).map((id) => ({ id, ...(getNarrativeCharacter(id) || { name: id, role: 'Equipe Sentinel', avatar: '?' }) }));

export const getPreviousNarrativeOutcome = (profile, caseData) => {
  if (!profile) return null;
  normalizeNarrativeProfile(profile);
  const previousMissionId = caseData?.narrative?.previousMissionId;
  if (!previousMissionId) return null;
  return profile.narrative.outcomes[previousMissionId] || null;
};

export const getNarrativeCallback = (profile, caseData) => {
  const previous = getPreviousNarrativeOutcome(profile, caseData);
  if (!previous) return null;
  const label = previous.decisionQuality === 'recommended' ? 'Decisão anterior fortaleceu a operação'
    : previous.decisionQuality === 'harmful' ? 'Decisão anterior exigiu correção'
      : previous.decisionQuality === 'risky' ? 'Decisão anterior manteve risco residual'
        : 'Caso anterior incorporado ao quadro';
  return {
    label,
    missionId: previous.missionId,
    decisionQuality: previous.decisionQuality || '',
    message: previous.decisionQuality === 'recommended'
      ? 'A equipe parte de uma contenção bem executada e pode avançar com mais contexto.'
      : previous.decisionQuality === 'harmful'
        ? 'A nova missão começa com uma revisão defensiva para corrigir o impacto da escolha anterior.'
        : previous.decisionQuality === 'risky'
          ? 'O risco residual foi mantido no quadro e precisa ser considerado nesta etapa.'
          : 'As evidências do caso anterior permanecem disponíveis como contexto narrativo.',
  };
};

export const recordNarrativeOutcome = (profile, missionId, draft = {}, caseData = null) => {
  if (!caseData?.narrative) return null;
  const narrative = normalizeNarrativeProfile(profile);
  const option = caseData?.decision?.options?.find((entry) => entry.id === draft?.workspace?.decisionChoice) || null;
  const variant = getNarrativeVariant(profile, missionId, caseData);
  const outcome = {
    missionId,
    arcId: caseData.narrative.arcId || '',
    episode: Number(caseData.narrative.episode) || 0,
    completedAt: Date.now(),
    decisionChoice: text(draft?.workspace?.decisionChoice).slice(0, 120),
    decisionQuality: text(option?.quality).slice(0, 40),
    evidenceCount: new Set(list(draft?.workspace?.selectedEvidence)).size,
    variantId: variant.id,
    location: variant.location,
  };
  narrative.outcomes[missionId] = outcome;
  narrative.lastMissionId = missionId;
  narrative.updatedAt = Date.now();
  const arcId = outcome.arcId || 'arc-unknown';
  const arc = narrative.arcs[arcId] && typeof narrative.arcs[arcId] === 'object' ? narrative.arcs[arcId] : {};
  narrative.arcs[arcId] = {
    completedCases: [...new Set([...(Array.isArray(arc.completedCases) ? arc.completedCases : []), missionId])].slice(-80),
    lastEpisode: Math.max(Number(arc.lastEpisode) || 0, outcome.episode),
    updatedAt: Date.now(),
  };
  return outcome;
};

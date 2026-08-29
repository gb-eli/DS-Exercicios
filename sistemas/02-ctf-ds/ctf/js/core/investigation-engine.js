const DRAWERS = Object.freeze(['tools', 'documents', 'records', 'communications', 'files']);
const EVIDENCE_DRAWERS = Object.freeze(['documents', 'records', 'communications', 'files']);

const list = (value) => Array.isArray(value) ? value : [];
const unique = (values) => [...new Set(list(values).filter(Boolean).map(String))];
const safeString = (value) => String(value ?? '');

export const evidenceKey = (drawer, itemId) => `${drawer}:${itemId}`;

export const getCaseItems = (caseData) => DRAWERS.flatMap((drawer) => list(caseData?.[drawer]).map((item) => ({ drawer, item })));
export const getEvidenceItems = (caseData) => EVIDENCE_DRAWERS.flatMap((drawer) => list(caseData?.[drawer]).map((item) => ({ drawer, item })));

export const findCaseItem = (caseData, itemId) => getCaseItems(caseData).find(({ item }) => item.id === itemId) || null;

const timelineCorrect = (caseData, workspace = {}) => {
  const events = list(caseData?.timelineEvents);
  if (!events.length) return true;
  const expected = [...events].sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0)).map((event) => event.id);
  const current = list(workspace.timelineOrder).length === events.length
    ? workspace.timelineOrder
    : list(caseData.timelineInitialOrder).length === events.length
      ? caseData.timelineInitialOrder
      : events.map((event) => event.id);
  return expected.every((id, index) => current[index] === id);
};

const ruleSatisfied = (rule = {}, draft = {}, caseData = {}) => {
  const workspace = draft?.workspace || {};
  const viewed = new Set(list(workspace.viewedItems));
  const usedTools = new Set(list(workspace.usedTools));
  const selected = new Set(list(workspace.selectedEvidence));
  const opened = new Set(list(workspace.openedDrawers));
  const decision = safeString(workspace.decisionChoice);

  if (list(rule.viewed).some((id) => !viewed.has(id))) return false;
  if (list(rule.anyViewed).length && !list(rule.anyViewed).some((id) => viewed.has(id))) return false;
  if (list(rule.tools).some((id) => !usedTools.has(id))) return false;
  if (list(rule.anyTool).length && !list(rule.anyTool).some((id) => usedTools.has(id))) return false;
  if (list(rule.drawers).some((id) => !opened.has(id))) return false;
  if (Number(rule.minViewed || 0) > viewed.size) return false;
  if (Number(rule.minEvidence || 0) > selected.size) return false;
  if (Number(rule.minToolRuns || 0) > Number(draft?.toolRuns || 0)) return false;
  if (rule.decision && decision !== String(rule.decision)) return false;
  if (rule.anyDecision && !decision) return false;
  if (rule.timelineCorrect && !timelineCorrect(caseData, workspace)) return false;
  if (Number(rule.minActiveSeconds || 0) > Number(workspace.activeSeconds || 0)) return false;
  if (Number(rule.minSubmissions || 0) > Number(draft?.submissions || 0)) return false;
  return true;
};

export const isCaseItemUnlocked = (item, draft = {}, caseData = {}) => !item?.unlock || ruleSatisfied(item.unlock, draft, caseData);

export const getUnlockedItemIds = (caseData, draft = {}) => getCaseItems(caseData)
  .filter(({ item }) => isCaseItemUnlocked(item, draft, caseData))
  .map(({ item }) => item.id);

export const getLockedReason = (item = {}) => item.lockedReason || 'Continue a investigação para liberar este material.';

export const normalizeTimelineOrder = (caseData, order = []) => {
  const events = list(caseData?.timelineEvents);
  const ids = new Set(events.map((event) => event.id));
  const source = list(order).filter((id) => ids.has(id));
  const fallback = list(caseData?.timelineInitialOrder).filter((id) => ids.has(id));
  const merged = unique([...source, ...fallback, ...events.map((event) => event.id)]);
  return merged.slice(0, events.length);
};

export const moveTimelineEvent = (caseData, order, eventId, direction) => {
  const current = normalizeTimelineOrder(caseData, order);
  const index = current.indexOf(eventId);
  if (index < 0) return current;
  const target = direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index;
  if (target < 0 || target >= current.length || target === index) return current;
  [current[index], current[target]] = [current[target], current[index]];
  return current;
};

export const getTimelineAssessment = (caseData, workspace = {}) => {
  const events = list(caseData?.timelineEvents);
  const order = normalizeTimelineOrder(caseData, workspace.timelineOrder);
  const correct = timelineCorrect(caseData, { ...workspace, timelineOrder: order });
  return {
    required: Boolean(events.length && caseData?.timelineRequired !== false),
    events,
    order,
    correct,
    moved: Number(workspace.timelineMoves || 0) > 0,
  };
};

export const normalizeEvidenceAnnotations = (value = {}) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).slice(0, 160).map(([key, annotation]) => [String(key).slice(0, 160), {
    note: safeString(annotation?.note).slice(0, 1200),
    confidence: ['low', 'medium', 'high'].includes(annotation?.confidence) ? annotation.confidence : '',
    relation: ['supports', 'contradicts', 'context'].includes(annotation?.relation) ? annotation.relation : '',
    updatedAt: Math.max(0, Number(annotation?.updatedAt) || 0),
  }]));
};

export const getEvidenceAnnotationStats = (workspace = {}, { minNoteLength = 12 } = {}) => {
  const selected = unique(workspace.selectedEvidence);
  const annotations = normalizeEvidenceAnnotations(workspace.evidenceAnnotations);
  const completeIds = selected.filter((id) => {
    const item = annotations[id] || {};
    return safeString(item.note).trim().length >= minNoteLength && Boolean(item.confidence) && Boolean(item.relation);
  });
  return { selected, annotations, completeIds, complete: completeIds.length };
};

export const getDecisionState = (caseData, workspace = {}) => {
  const decision = caseData?.decision || null;
  const choice = safeString(workspace.decisionChoice);
  const option = decision?.options?.find((entry) => entry.id === choice) || null;
  return { required: Boolean(decision?.required), decision, choice, option, complete: !decision?.required || Boolean(option) };
};

export const getHelpLevelState = (level, index, caseData, draft = {}) => {
  const viewed = new Set(list(draft?.workspace?.helpLevelsViewed));
  const previous = index === 0 ? true : viewed.has(caseData.helpLevels[index - 1]?.id);
  const ruleReady = !level.unlock || ruleSatisfied(level.unlock, draft, caseData);
  return {
    viewed: viewed.has(level.id),
    available: previous && ruleReady,
  };
};

export const getAdaptiveHelp = (caseData, draft = {}) => list(caseData?.helpLevels).map((level, index) => ({
  ...level,
  ...getHelpLevelState(level, index, caseData, draft),
}));

export const getProgressiveUnlockDelta = (caseData, previousDraft = {}, nextDraft = {}) => {
  const before = new Set(getUnlockedItemIds(caseData, previousDraft));
  return getCaseItems(caseData)
    .filter(({ item }) => isCaseItemUnlocked(item, nextDraft, caseData) && !before.has(item.id))
    .map(({ drawer, item }) => ({ drawer, item }));
};

export const getEvidenceRoleLabel = (role) => ({
  primary: 'Evidência principal',
  confirming: 'Evidência de confirmação',
  neutral: 'Informação contextual',
  contradictory: 'Pista contraditória',
}[role] || 'Material investigativo');

export const investigationEngineConstants = Object.freeze({ DRAWERS, EVIDENCE_DRAWERS });

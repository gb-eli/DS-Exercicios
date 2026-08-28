import { isMissionBlockUnlocked } from './mission-blocks.js';
const MAX_ANSWER_LENGTH = 12000;
const MAX_EVIDENCE = 80;
const MAX_WORKSPACE_TEXT = 5000;
const MAX_WORKSPACE_ITEMS = 240;

const cleanString = (value, max = MAX_ANSWER_LENGTH) => String(value ?? '').slice(0, max);
const cleanArray = (value, max = MAX_EVIDENCE, itemMax = 160) => Array.isArray(value)
  ? value.slice(0, max).map((item) => cleanString(item, itemMax))
  : [];


const cleanSimulatorHistory = (value = {}) => Array.isArray(value)
  ? value.slice(-40).map((item) => ({
    toolId: cleanString(item?.toolId, 80),
    action: cleanString(item?.action, 80),
    at: Math.max(0, Number(item?.at) || 0),
  })).filter((item) => item.toolId)
  : [];


const cleanImmersiveHistory = (value = {}) => Array.isArray(value)
  ? value.slice(-60).map((item) => ({
    toolId: cleanString(item?.toolId, 80),
    sceneId: cleanString(item?.sceneId, 80),
    action: cleanString(item?.action, 80),
    quality: cleanString(item?.quality, 20),
    fallback: Boolean(item?.fallback),
    fps: Math.max(0, Math.min(240, Math.round(Number(item?.fps) || 0))),
    scale: Math.max(0, Math.min(2, Number(item?.scale) || 0)),
    orientation: ['portrait', 'landscape'].includes(item?.orientation) ? item.orientation : '',
    at: Math.max(0, Number(item?.at) || 0),
  })).filter((item) => item.toolId)
  : [];

const cleanRecord = (value = {}, maxEntries = 160) => value && typeof value === 'object' && !Array.isArray(value)
  ? Object.fromEntries(Object.entries(value).slice(0, maxEntries).map(([key, item]) => [cleanString(key, 160), item && typeof item === 'object' && !Array.isArray(item) ? {
    note: cleanString(item.note, 1200),
    confidence: ['low', 'medium', 'high'].includes(item.confidence) ? item.confidence : '',
    relation: ['supports', 'contradicts', 'context'].includes(item.relation) ? item.relation : '',
    updatedAt: Math.max(0, Number(item.updatedAt) || 0),
  } : {}]))
  : {};

const cleanWorkspace = (value = {}) => {
  const workspace = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    version: 9,
    activeDrawer: cleanString(workspace.activeDrawer || 'briefing', 40),
    currentItemId: cleanString(workspace.currentItemId, 120),
    openedDrawers: cleanArray(workspace.openedDrawers, 20, 40),
    viewedItems: cleanArray(workspace.viewedItems, MAX_WORKSPACE_ITEMS, 120),
    selectedEvidence: cleanArray(workspace.selectedEvidence, MAX_WORKSPACE_ITEMS, 160),
    usedTools: cleanArray(workspace.usedTools, 40, 80),
    evidenceAnnotations: cleanRecord(workspace.evidenceAnnotations),
    timelineOrder: cleanArray(workspace.timelineOrder, 40, 120),
    timelineMoves: Math.max(0, Math.floor(Number(workspace.timelineMoves) || 0)),
    decisionChoice: cleanString(workspace.decisionChoice, 120),
    decisionHistory: cleanArray(workspace.decisionHistory, 40, 120),
    helpLevelsViewed: cleanArray(workspace.helpLevelsViewed, 20, 120),
    narrativeUpdatesViewed: cleanArray(workspace.narrativeUpdatesViewed, 40, 120),
    openingSeen: Boolean(workspace.openingSeen),
    closingSeen: Boolean(workspace.closingSeen),
    supportRequests: cleanArray(workspace.supportRequests, 40, 160),
    simulatorHistory: cleanSimulatorHistory(workspace.simulatorHistory),
    lastSimulatorId: cleanString(workspace.lastSimulatorId, 80),
    immersiveHistory: cleanImmersiveHistory(workspace.immersiveHistory),
    lastImmersiveId: cleanString(workspace.lastImmersiveId, 80),
    hypothesis: cleanString(workspace.hypothesis, MAX_WORKSPACE_TEXT),
    timelineNotes: cleanString(workspace.timelineNotes, MAX_WORKSPACE_TEXT),
    recommendation: cleanString(workspace.recommendation, MAX_WORKSPACE_TEXT),
    conclusion: cleanString(workspace.conclusion, MAX_WORKSPACE_TEXT),
    activeSeconds: Math.max(0, Math.floor(Number(workspace.activeSeconds) || 0)),
    revision: Math.max(0, Math.floor(Number(workspace.revision) || 0)),
    lastActiveAt: Math.max(0, Number(workspace.lastActiveAt) || 0),
    lastWorkspaceEventAt: Math.max(0, Number(workspace.lastWorkspaceEventAt) || 0),
  };
};

export const normalizeMissionDrafts = (profile) => {
  profile.missionDrafts ||= {};
  if (!profile.missionDrafts || typeof profile.missionDrafts !== 'object' || Array.isArray(profile.missionDrafts)) profile.missionDrafts = {};
  for (const [missionId, raw] of Object.entries(profile.missionDrafts)) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      delete profile.missionDrafts[missionId];
      continue;
    }
    profile.missionDrafts[missionId] = {
      version: 8,
      status: raw.status === 'completed' ? 'completed' : 'in-progress',
      startedAt: Number(raw.startedAt) || Date.now(),
      lastOpenedAt: Number(raw.lastOpenedAt) || Number(raw.startedAt) || Date.now(),
      lastSavedAt: Number(raw.lastSavedAt) || Number(raw.lastOpenedAt) || Date.now(),
      answer: cleanString(raw.answer),
      selected: cleanArray(raw.selected),
      sequence: cleanArray(raw.sequence),
      matches: raw.matches && typeof raw.matches === 'object' && !Array.isArray(raw.matches)
        ? Object.fromEntries(Object.entries(raw.matches).slice(0, 80).map(([key, value]) => [cleanString(key, 80), cleanString(value, 80)]))
        : {},
      evidence: cleanArray(raw.evidence),
      localTests: Math.max(0, Number(raw.localTests) || 0),
      toolRuns: Math.max(0, Number(raw.toolRuns) || 0),
      submissions: Math.max(0, Number(raw.submissions) || 0),
      lastToolId: cleanString(raw.lastToolId, 80),
      workspace: cleanWorkspace(raw.workspace),
    };
  }
  return profile.missionDrafts;
};

export const getMissionDraft = (profile, missionId) => normalizeMissionDrafts(profile)[missionId] || null;

export const ensureMissionDraft = (profile, missionId, patch = {}) => {
  const drafts = normalizeMissionDrafts(profile);
  const now = Date.now();
  const current = drafts[missionId] || {
    version: 8,
    status: 'in-progress',
    startedAt: now,
    lastOpenedAt: now,
    lastSavedAt: now,
    answer: '',
    selected: [],
    sequence: [],
    matches: {},
    evidence: [],
    localTests: 0,
    toolRuns: 0,
    submissions: 0,
    lastToolId: '',
    workspace: cleanWorkspace(),
  };
  drafts[missionId] = {
    ...current,
    ...patch,
    answer: patch.answer === undefined ? current.answer : cleanString(patch.answer),
    selected: patch.selected === undefined ? current.selected : cleanArray(patch.selected),
    sequence: patch.sequence === undefined ? current.sequence : cleanArray(patch.sequence),
    evidence: patch.evidence === undefined ? current.evidence : cleanArray(patch.evidence),
    matches: patch.matches === undefined ? current.matches : Object.fromEntries(Object.entries(patch.matches || {}).slice(0, 80).map(([key, value]) => [cleanString(key, 80), cleanString(value, 80)])),
    workspace: patch.workspace === undefined ? cleanWorkspace(current.workspace) : cleanWorkspace({ ...current.workspace, ...patch.workspace }),
    lastSavedAt: Number(patch.lastSavedAt) || now,
  };
  return drafts[missionId];
};

export const markMissionOpened = (profile, missionId) => {
  const current = getMissionDraft(profile, missionId);
  return ensureMissionDraft(profile, missionId, {
    status: profile.completed?.[missionId] ? 'completed' : 'in-progress',
    startedAt: current?.startedAt || Date.now(),
    lastOpenedAt: Date.now(),
  });
};

export const markMissionCompleted = (profile, missionId) => ensureMissionDraft(profile, missionId, {
  status: 'completed',
  lastOpenedAt: Date.now(),
});

export const clearMissionDraft = (profile, missionId) => {
  normalizeMissionDrafts(profile);
  delete profile.missionDrafts[missionId];
};

export const clearAllMissionDrafts = (profile, { keepCompleted = true } = {}) => {
  const drafts = normalizeMissionDrafts(profile);
  for (const missionId of Object.keys(drafts)) {
    if (keepCompleted && profile.completed?.[missionId]) continue;
    delete drafts[missionId];
  }
};

export const missionDraftHasWork = (draft) => Boolean(draft && (
  draft.answer || draft.selected?.length || draft.sequence?.length || Object.keys(draft.matches || {}).length ||
  draft.evidence?.length || draft.localTests || draft.toolRuns || draft.submissions ||
  draft.workspace?.selectedEvidence?.length || draft.workspace?.hypothesis || draft.workspace?.timelineNotes ||
  draft.workspace?.recommendation || draft.workspace?.conclusion || draft.workspace?.viewedItems?.length ||
  draft.workspace?.timelineMoves || draft.workspace?.decisionChoice || draft.workspace?.simulatorHistory?.length || draft.workspace?.immersiveHistory?.length || draft.workspace?.helpLevelsViewed?.length || draft.workspace?.narrativeUpdatesViewed?.length || draft.workspace?.openingSeen || draft.workspace?.supportRequests?.length ||
  Object.keys(draft.workspace?.evidenceAnnotations || {}).length
));

export const getMissionProgressState = (challenge, profile) => {
  const completed = Boolean(profile.completed?.[challenge.id]);
  const draft = getMissionDraft(profile, challenge.id);
  const blockUnlocked = isMissionBlockUnlocked(profile, challenge);
  const prerequisiteUnlocked = !challenge.requires || challenge.requires.every((id) => profile.completed?.[id]);
  const unlocked = blockUnlocked && prerequisiteUnlocked;
  if (completed) return { id: 'completed', label: 'Concluída', draft };
  if (!unlocked) return { id: 'locked', label: 'Bloqueada', draft };
  if (missionDraftHasWork(draft)) return { id: 'in-progress', label: 'Em andamento', draft };
  return { id: 'available', label: 'Disponível', draft };
};

export const missionDraftFromForm = (form, previous = {}) => {
  const checked = [...form.querySelectorAll('input[name="challenge-answer"]:checked')].map((input) => input.value);
  const sequence = [...form.querySelectorAll('[data-sequence-item]')].map((item) => item.dataset.sequenceItem || '');
  const matches = Object.fromEntries([...form.querySelectorAll('[data-match-id]')].map((select) => [select.dataset.matchId || '', select.value || '']));
  const evidenceNodes = form.closest('.challenge-modal')?.querySelectorAll('[data-evidence-clue].selected') || [];
  const evidence = [...evidenceNodes].map((button) => button.dataset.evidenceClue || button.textContent?.trim() || '');
  const textField = form.querySelector('#challenge-answer');
  return {
    ...previous,
    answer: cleanString(textField?.value || ''),
    selected: checked,
    sequence,
    matches,
    evidence,
    lastSavedAt: Date.now(),
  };
};

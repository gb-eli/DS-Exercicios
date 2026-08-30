import { getState, setState, updateProfile, createDefaultProfile, normalizeProfile } from './core/state.js';
import { ensureMissionDraft, markMissionOpened, markMissionCompleted, clearMissionDraft, clearAllMissionDrafts, missionDraftFromForm, getMissionDraft, getMissionProgressState } from './core/mission-progress.js';
import {
  registerLocalAccount, authenticateLocalAccount, authenticateAccountById, registerCoreLinkedAccount, authenticateCoreLinkedAccount, coreLinkedAccountId, resetCoreLinkedCache, createSession, getSession, clearSession, lockProfile, touchSession,
  loadProfile, saveProfile, removeProfile, listLocalProfiles, exportLocalData, importLocalData, changeStudentPassword,
  requestPersistentStorage, getStorageStatus, changeProfileIdentity, getRecoveryStatus, createTeacherRecoveryKit, installRecoveryPublicKey, recoverStudentPassword, verifyAuditChain,
} from './core/storage.js';
import { centralSignOut, loadCoreCTFState, isCoreChallengeProvisioned, completeCoreChallenge, startCoreLesson, completeCoreLesson, recordCoreToolUse, syncCoreDaily, purchaseCoreHint, purchaseCoreStoreItem, hasCentralSession, AGV_CORE_INFO } from './core/agv-core-bridge.js';
import { downloadJson, downloadText, sanitizeFilename, escapeHtml, safeExternalUrl, sanitizePlainText, uid } from './core/utils.js';
import { awardToProfile, spendXp, grantBadge, purchaseStoreItem, getWalletSummary, reconcileProfileState } from './core/wallet.js';
import { hasRequiredAcceptances, registerTermsAcceptance, TERMS_FULL_TEXT, TERMS_VERSION } from './data/terms.js';
import { challenges, getChallenge } from './data/challenges.js';
import { getLesson } from './data/lessons.js';
import { getStoreItem } from './data/store-items.js';
import { getVulnerability } from './data/intel.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderCTF, renderChallengeModal, renderBlockCheckpointModal, getHintCost, getMissionThemeColors } from './modules/ctf.js';
import { renderAcademy, renderLessonModal } from './modules/academy.js';
import { renderTools, renderToolWorkspace, runTool, toolCatalog } from './modules/tools.js';
import { isSimulationTool } from './modules/simulation-suite.js';
import { isImmersiveTool, mountImmersiveWorkspaces, disposeImmersiveWorkspaces, immersiveActionReport } from './modules/immersive-suite.js';
import { renderStore } from './modules/store.js';
import { renderCareers } from './modules/careers.js';
import { renderIntel, renderVulnerabilityModal } from './modules/intel.js';
import { renderProfile } from './modules/profile.js';
import { startMatrix, triggerEffect, showLevelUp } from './modules/effects.js';
import { executeTerminalCommand, terminalWelcome } from './modules/terminal.js';
import { startGuidedTour, stopGuidedTour, bindGuidedTourControls, buildToolTourSteps, toolTutorialCards } from './modules/guided-tutorial.js';
import { renderDelivery, buildEvidenceHtml } from './modules/delivery.js';
import { renderAbout } from './modules/about.js';
import { detectCurrentPeriod, scheduleMessage, renderScheduleDetails } from './modules/schedule.js';
import { renderTeacherRecovery } from './modules/teacher-recovery.js';
import { hasInvestigativeCase, formatActiveMissionTime, getWorkspaceUnlockDelta, getWorkspaceTimelineMove } from './modules/investigative-workspace.js';
import { getInvestigationReadiness, releaseMissionCase, getMissionCase } from './data/mission-cases.js';
import { recordNarrativeOutcome } from './core/narrative-engine.js';
import { claimProfileTabLock, releaseProfileTabLock } from './core/profile-tab-lock.js';
import { renderTermsGate } from './modules/terms.js';
import { platformConfig } from './config/platform-config.js';
import {
  buildEduAuthRequest, validateEduAuthPin, renderAuthorizationModal, renderQrToCanvas, copyRequestCode, speakRequestCode,
  verifySignedGrant, eduauthIsProductionProvisioned, recordEduAuthEvent, findEduAuthAction,
} from './eduauth/index.js';
import { verifyChallengeAnswer, getChallengeArtifact } from './security/challenge-verifier.js';
import { assessCompletionPattern } from './security/security-monitor.js';
import { missionBlocks, getMissionBlock, getBlockState, checkpointSnapshot, normalizeMissionBlocks, getCheckpointRewardRecord } from './core/mission-blocks.js';
import { collectDeviceDiagnostics } from './core/device-diagnostics.js';
import { createUpdateManager } from './core/update-manager.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  boot: $('#boot-screen'), bootLine: $('#boot-line'), bootProgress: $('#boot-progress'), skipBoot: $('#skip-boot'),
  authModal: $('#auth-modal'), authForm: $('#auth-form'), authStudentName: $('#auth-student-name'), authClassName: $('#auth-class-name'), authEmail: $('#auth-email'), authPassword: $('#auth-password'), authNewPasswordWrap: $('#auth-new-password-wrap'), authNewPassword: $('#auth-new-password'), authNewPasswordConfirm: $('#auth-new-password-confirm'), authError: $('#auth-error'), authLabel: $('#auth-submit-label'), savedProfileList: $('#saved-profile-list'), temporarySession: $('#temporary-session'), authImportProfile: $('#auth-import-profile'), teacherMode: $('#teacher-mode'),
  app: $('#app'), main: $('#main-content'), viewTitle: $('#view-title'), profileChip: $('#profile-chip'), modalRoot: $('#modal-root'), toastRoot: $('#toast-root'),
  terminalToggle: $('#terminal-toggle'), terminalDrawer: $('#terminal-drawer'), terminalClose: $('#terminal-close'), terminalOutput: $('#terminal-output'), terminalForm: $('#terminal-form'), terminalInput: $('#terminal-input'),
  mobileMenu: $('#mobile-menu'), sidebar: $('.sidebar'), matrix: $('#matrix-canvas'), explainModeToggle: $('#explain-mode-toggle'), systemClock: $('#system-clock'),
  toolsDrawerToggle: $('#tools-drawer-toggle'), toolsDrawer: $('#tools-drawer'), toolsDrawerClose: $('#tools-drawer-close'), toolsDrawerBackdrop: $('#tools-drawer-backdrop'), toolsDrawerTabs: $('#tools-drawer-tabs'), toolsDrawerWorkspace: $('#tools-drawer-workspace'),
  tutorialCenterToggle: $('#tutorial-center-toggle'), tutorialHub: $('#tutorial-hub'), tutorialToolGrid: $('#tutorial-tool-grid'), tutorialAutoplaySetting: $('#tutorial-autoplay-setting'), activeToolTutorial: $('#active-tool-tutorial'), scheduleChip: $('#schedule-chip'), saveStatus: $('#save-status'),
};

const viewTitles = {
  dashboard: 'CENTRAL DE OPERAÇÕES', ctf: 'MISSÕES CAPTURE THE FLAG', academy: 'ACADEMIA GUIADA',
  tools: 'KIT DE FERRAMENTAS', intel: 'THREAT INTEL & CASOS REAIS', careers: 'CYBER CAREER HUB', store: 'CYBER STORE', delivery: 'CONCLUSÃO E ENTREGA', profile: 'IDENTIDADE DO ALUNO', about: 'SOBRE O PROJETO',
};

let authMode = 'login';
let pendingCentralIdentity = null;
let pendingCentralLoginPassword = '';
let ctfFilter = 'current-block';
let ctfQuery = '';
let storeFilter = 'all';
let activeTool = 'base64';
let intelFilter = 'all';
let intelQuery = '';
let activeChallengeUI = { id: null, result: null, showHint: false, tutorialVisible: false };
let activeLessonId = null;
let activeVulnerabilityId = null;
let bootFinished = false;
let selectedSavedAccountId = '';
let scheduleStatus = null;
let idleTimer = null;
let scheduleNoticeKey = '';
let pendingEduAuth = null;
let eduauthCountdownTimer = null;
let requiredModal = '';
let termsFullOpened = false;
let privacyViewed = false;
let lastUserActivityAt = Date.now();
let missionTimerLastTickAt = Date.now();
let missionTimerLastPersistAt = 0;
const RELEASE_ID = 'ctfds-3.2.0-stable-runtime';
const IDLE_LOCK_MS = platformConfig.profile.idleLockMinutes * 60 * 1000;

let pendingUpdate = null;
const updateManager = createUpdateManager({
  currentVersion: platformConfig.version,
  onUpdateAvailable: (info) => {
    pendingUpdate = info;
    let banner = document.querySelector('[data-update-banner]');
    if (!banner) {
      banner = document.createElement('aside');
      banner.className = 'app-update-banner';
      banner.dataset.updateBanner = 'true';
      banner.setAttribute('role', 'status');
      banner.innerHTML = `<div><span>ATUALIZAÇÃO SEGURA</span><strong data-update-title>Nova versão pronta</strong><small>O progresso será salvo antes da troca dos arquivos da interface.</small></div><div><button type="button" class="primary-button compact" data-apply-app-update>SALVAR E ATUALIZAR</button><button type="button" class="secondary-button compact" data-dismiss-app-update>DEPOIS</button></div>`;
      document.body.appendChild(banner);
    }
    const title = banner.querySelector('[data-update-title]');
    if (title) title.textContent = `CTF DS ${info.version || 'nova versão'} pronta para instalar`;
    requestAnimationFrame(() => banner.classList.add('visible'));
  },
  onStatus: (message) => { if (message) showToast('ATUALIZAÇÃO', message); },
});

const hideUpdateBanner = () => document.querySelector('[data-update-banner]')?.classList.remove('visible');

const applyPendingUpdate = async () => {
  const button = document.querySelector('[data-apply-app-update]');
  if (button) { button.disabled = true; button.textContent = 'SALVANDO...'; }
  flushActiveMissionTime({ force: true });
  checkpointActiveMission({ immediate: true });
  const profile = getState().profile;
  if (profile && !profile._ephemeral) {
    try { await saveProfile(profile, 'before_app_update', { fromVersion: platformConfig.version, toVersion: pendingUpdate?.version || '' }); }
    catch (error) { if (button) { button.disabled = false; button.textContent = 'SALVAR E ATUALIZAR'; } showToast('ATUALIZAÇÃO ADIADA', error.message || 'Não foi possível confirmar o salvamento.', 'attention'); return; }
  }
  if (button) button.textContent = 'ATUALIZANDO...';
  const applied = await (pendingUpdate?.apply?.() || updateManager.applyUpdate());
  if (!applied) {
    if (button) { button.disabled = false; button.textContent = 'SALVAR E ATUALIZAR'; }
    showToast('ATUALIZAÇÃO PENDENTE', 'O navegador ainda está finalizando o download. Tente novamente em alguns segundos.', 'attention');
  }
};

const titleForLevel = (level) => {
  if (level >= 8) return 'Especialista Zero Trust';
  if (level >= 6) return 'Operador Sênior';
  if (level >= 4) return 'Analista de Segurança';
  if (level >= 2) return 'Trainee Júnior';
  return 'Recruta Digital';
};

const addBadge = (profile, badge, sourceId = '') => grantBadge(profile, badge, sourceId);


const applyMissionBlockCheckpoint = (draft, block) => {
  if (!block) return null;
  normalizeMissionBlocks(draft);
  const state = getBlockState(draft, block);
  if (!state?.complete || state.claimed) return null;
  const snapshot = checkpointSnapshot(draft, block);
  const previousReward = getCheckpointRewardRecord(draft, block);
  const checkpointId = previousReward?.metadata?.checkpointId || `checkpoint:${block.id}:${uid()}`;
  if (!previousReward) {
    awardToProfile(draft, {
      source: 'mission-block',
      sourceId: `block:${block.id}`,
      xp: block.xpBonus,
      coins: block.coinBonus,
      stars: block.starBonus,
      metadata: { checkpointId, blockNumber: block.number, performance: snapshot.performance, score: snapshot.score },
    });
    addBadge(draft, block.badge, `block:${block.id}`);
  }
  draft.missionBlocks[block.id] = {
    version: 1,
    completedAt: Date.now(),
    checkpointClaimedAt: Date.now(),
    reportViewedAt: 0,
    checkpointId,
    snapshot,
  };
  return { blockId: block.id, checkpointId, snapshot, rewarded: !previousReward, restored: Boolean(previousReward) };
};

const claimMissionBlockCheckpoint = (blockId, { showReport = true } = {}) => {
  const block = missionBlocks.find((item) => item.id === blockId);
  if (!block) return null;
  let checkpoint = null;
  try {
    const profile = persistProfile((draft) => {
      checkpoint = applyMissionBlockCheckpoint(draft, block);
      if (!checkpoint && !getBlockState(draft, block)?.claimed) throw new Error('Este bloco ainda não foi concluído.');
      const entry = draft.missionBlocks?.[block.id];
      if (entry) entry.reportViewedAt = Date.now();
      return draft;
    }, { rerender: false, eventType: 'mission_block_checkpoint', details: { blockId } });
    if (showReport) elements.modalRoot.innerHTML = renderBlockCheckpointModal(block, profile, { newlyClaimed: Boolean(checkpoint?.rewarded) });
    if (checkpoint?.rewarded) {
      triggerEffect(profile.equipped.effect, { sound: profile.settings.sound, kind: 'success' });
      showToast('CHECKPOINT CONCLUÍDO', `Bloco ${String(block.number).padStart(2, '0')}: +${block.xpBonus} XP, +${block.coinBonus} moedas e novo emblema.`);
    } else if (checkpoint?.restored) {
      showToast('CHECKPOINT RESTAURADO', 'O relatório foi reconstruído a partir do extrato. Nenhuma recompensa foi duplicada.');
    }
    return checkpoint;
  } catch (error) {
    showToast('CHECKPOINT INDISPONÍVEL', error.message || 'Não foi possível concluir este checkpoint.', 'attention');
    return null;
  }
};

const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);
const dayDistance = (fromKey, toKey) => {
  if (!fromKey || !toKey) return null;
  const from = new Date(`${fromKey}T00:00:00Z`).getTime();
  const to = new Date(`${toKey}T00:00:00Z`).getTime();
  return Math.round((to - from) / 86400000);
};

const ensureDailyStats = (draft) => {
  const today = dayKey();
  if (draft.dailyStats?.date !== today) draft.dailyStats = { date: today, missions: 0, lessons: 0, tools: 0 };
  return draft.dailyStats;
};

const recordDailyAction = (draft, type) => {
  const stats = ensureDailyStats(draft);
  stats[type] = (stats[type] || 0) + 1;
  const complete = stats.missions >= 1 && stats.lessons >= 1 && stats.tools >= 1;
  if (complete && draft.dailyBonusClaimedDate !== stats.date) {
    awardToProfile(draft, { coins: 50, source: 'daily-objective', sourceId: `daily:${stats.date}` });
    draft.dailyBonusClaimedDate = stats.date;
    addBadge(draft, 'Operador do Dia', `daily:${stats.date}`);
    return true;
  }
  return false;
};

const applyCoreActionResult = (result, { rerender = false, eventType = 'core_action_synced', details = {} } = {}) => {
  if (!result || getState().profile?.core?.authority !== 'agv-core') return getState().profile;
  return persistProfile((draft) => {
    draft.core ||= { authority: 'agv-core', platformId: AGV_CORE_INFO.platformId };
    if (result.wallet) draft.core.wallet = result.wallet;
    if (result.metrics) draft.core.metrics = result.metrics;
    if (Number.isFinite(Number(result.xp))) draft.core.metrics = { ...(draft.core.metrics || {}), xp: Number(result.xp) };
    const storeResult = result.store || (Array.isArray(result.ownedItemIds) ? { ownedItemIds: result.ownedItemIds, transactions: result.transactions || [], catalog: result.catalog || [] } : null);
    if (storeResult) {
      draft.inventory = [...new Set(storeResult.ownedItemIds || draft.inventory || [])];
      draft.core.storeTransactions = storeResult.transactions || [];
      for (const [slot, itemId] of Object.entries(draft.equipped || {})) {
        if (!draft.inventory.includes(itemId)) {
          if (slot === 'theme') draft.equipped.theme = 'theme-neon';
          if (slot === 'avatar') draft.equipped.avatar = 'avatar-ghost';
          if (slot === 'effect') draft.equipped.effect = 'effect-matrix';
        }
      }
    }
    if (result.daily) {
      draft.dailyStats = { date: result.daily.date, missions: result.daily.missions || 0, lessons: result.daily.lessons || 0, tools: result.daily.tools || 0 };
      draft.core.daily = result.daily;
      if (result.daily.complete && result.daily.claimed) {
        draft.dailyBonusClaimedDate = result.daily.date;
        addBadge(draft, 'Operador do Dia', `daily:${result.daily.date}`);
      }
    }
    draft.coins = Number(draft.core.wallet?.balance ?? draft.coins ?? 0);
    draft.xp = Number(draft.core.metrics?.xp ?? draft.xp ?? 0);
    draft.core.lastSyncAt = new Date().toISOString();
    return draft;
  }, { rerender, eventType, details });
};

const persistProfile = (updater, { rerender = true, eventType = 'autosave', details = {} } = {}) => {
  const profile = updateProfile((draft) => {
    const updated = updater(draft) || draft;
    updated.title = titleForLevel(updated.level);
    return updated;
  });
  profile.title = titleForLevel(profile.level);
  if (!profile._ephemeral) {
    if (elements.saveStatus) { elements.saveStatus.textContent = 'SALVANDO…'; elements.saveStatus.classList.add('saving'); }
    void saveProfile(profile, eventType, details).then(() => {
      if (elements.saveStatus) { elements.saveStatus.textContent = 'PROTEGIDO'; elements.saveStatus.classList.remove('saving', 'error'); }
    }).catch(() => {
      if (elements.saveStatus) { elements.saveStatus.textContent = 'NÃO SALVO'; elements.saveStatus.classList.remove('saving'); elements.saveStatus.classList.add('error'); }
    });
  } else if (elements.saveStatus) elements.saveStatus.textContent = 'TEMPORÁRIO';
  applyTheme(profile);
  renderProfileChip(profile);
  if (rerender) renderCurrentView();
  return profile;
};

let missionDraftTimer = null;

const saveMissionDraftSnapshot = (missionId, snapshot, { immediate = false, eventType = 'mission_draft_saved' } = {}) => {
  if (!missionId || !getState().profile) return;
  const commit = () => {
    missionDraftTimer = null;
    persistProfile((draft) => {
      const current = getMissionDraft(draft, missionId) || {};
      ensureMissionDraft(draft, missionId, {
        ...snapshot,
        status: draft.completed?.[missionId] ? 'completed' : 'in-progress',
        startedAt: current.startedAt || Date.now(),
        lastOpenedAt: current.lastOpenedAt || Date.now(),
        toolRuns: Math.max(Number(snapshot.toolRuns) || 0, Number(activeChallengeUI.session?.toolRuns) || 0, Number(current.toolRuns) || 0),
        localTests: Math.max(Number(snapshot.localTests) || 0, Number(activeChallengeUI.session?.localTests) || 0, Number(current.localTests) || 0),
        submissions: Math.max(Number(snapshot.submissions) || 0, Number(activeChallengeUI.session?.submissions) || 0, Number(current.submissions) || 0),
      });
      return draft;
    }, { rerender: false, eventType, details: { challengeId: missionId } });
    const status = elements.modalRoot?.querySelector('.mission-resume-strip small');
    if (status) status.textContent = `Rascunho protegido no perfil · ${new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date())}`;
  };
  clearTimeout(missionDraftTimer);
  if (immediate) commit(); else missionDraftTimer = setTimeout(commit, 420);
};

const saveMissionDraftFromForm = (form, options = {}) => {
  const missionId = form?.dataset?.challengeId;
  if (!missionId) return;
  const previous = getMissionDraft(getState().profile, missionId) || {};
  const snapshot = missionDraftFromForm(form, previous);
  saveMissionDraftSnapshot(missionId, snapshot, options);
};

const collectWorkspaceFields = () => Object.fromEntries(
  [...(elements.modalRoot?.querySelectorAll('[data-workspace-field]') || [])]
    .map((field) => [field.dataset.workspaceField, String(field.value || '').slice(0, 5000)])
    .filter(([key]) => ['hypothesis', 'timelineNotes', 'recommendation', 'conclusion'].includes(key))
);

const patchMissionWorkspace = (missionId, patch = {}, { rerender = true, eventType = 'mission_workspace_updated' } = {}) => {
  if (!missionId) return;
  const previous = getMissionDraft(getState().profile, missionId) || {};
  const form = elements.modalRoot?.querySelector(`#challenge-form[data-challenge-id="${CSS.escape(missionId)}"]`);
  const snapshot = form ? missionDraftFromForm(form, previous) : { ...previous, lastSavedAt: Date.now() };
  snapshot.workspace = {
    ...(previous.workspace || {}),
    ...patch,
    revision: Math.max(0, Number(previous.workspace?.revision) || 0) + 1,
    lastWorkspaceEventAt: Date.now(),
  };
  const unlockedNow = getWorkspaceUnlockDelta(missionId, previous, snapshot);
  saveMissionDraftSnapshot(missionId, snapshot, { immediate: true, eventType });
  if (rerender) {
    const challenge = getChallenge(missionId);
    if (challenge) elements.modalRoot.innerHTML = renderChallengeModal(challenge, getState().profile, activeChallengeUI.result, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
  }
  if (unlockedNow.length) {
    const first = unlockedNow[0]?.item?.title || 'Novo material';
    showToast('NOVO MATERIAL DISPONÍVEL', unlockedNow.length === 1 ? first : `${first} e mais ${unlockedNow.length - 1} item(ns).`, 'attention');
  }
};

const checkpointActiveMission = ({ immediate = true } = {}) => {
  const form = elements.modalRoot?.querySelector('#challenge-form');
  if (form) saveMissionDraftFromForm(form, { immediate, eventType: 'mission_checkpoint' });
};

const flushActiveMissionTime = ({ force = false } = {}) => {
  const missionId = activeChallengeUI.id;
  if (!missionId || !hasInvestigativeCase(missionId) || !activeChallengeUI.session) return;
  const now = Date.now();
  if (!force && now - missionTimerLastPersistAt < 9000) return;
  missionTimerLastPersistAt = now;
  patchMissionWorkspace(missionId, {
    activeSeconds: Math.max(0, Math.floor(activeChallengeUI.session.activeSeconds || 0)),
    lastActiveAt: now,
  }, { rerender: false, eventType: 'mission_active_time_saved' });
};

const updateActiveMissionTime = () => {
  const now = Date.now();
  const elapsed = Math.max(0, Math.min(2, (now - missionTimerLastTickAt) / 1000));
  missionTimerLastTickAt = now;
  const missionId = activeChallengeUI.id;
  if (!missionId || !hasInvestigativeCase(missionId) || !activeChallengeUI.session) return;
  const engaged = document.visibilityState === 'visible' && now - lastUserActivityAt < 180000 && Boolean(elements.modalRoot?.querySelector('[data-investigative-workspace]'));
  if (engaged) activeChallengeUI.session.activeSeconds = Math.max(0, Number(activeChallengeUI.session.activeSeconds) || 0) + elapsed;
  elements.modalRoot?.querySelectorAll('[data-mission-active-time]').forEach((node) => { node.textContent = formatActiveMissionTime(activeChallengeUI.session.activeSeconds); });
  if (engaged) flushActiveMissionTime();
};

const applyTheme = (profile) => {
  document.documentElement.dataset.theme = profile?.equipped?.theme || 'theme-neon';
  document.documentElement.dataset.reducedMotion = profile?.settings?.reducedMotion ? 'true' : 'false';
  document.documentElement.dataset.reducedParticles = profile?.settings?.reducedParticles ? 'true' : 'false';
  document.documentElement.dataset.highContrast = profile?.settings?.highContrast ? 'true' : 'false';
  document.documentElement.dataset.quality = profile?.settings?.qualityPreset || 'auto';
  document.documentElement.dataset.autoQuality = profile?.settings?.deviceDiagnostics?.recommendedQuality || '';
  document.documentElement.dataset.preferLandscape3d = profile?.settings?.preferLandscape3d === false ? 'false' : 'true';
  document.documentElement.dataset.autoFallback3d = profile?.settings?.autoFallback3d === false ? 'false' : 'true';
  document.documentElement.dataset.focusMode = profile?.settings?.focusMode ? 'true' : 'false';
};

const avatarPreview = (profile) => getStoreItem(profile.equipped.avatar)?.preview || '👻';

const renderProfileChip = (profile) => {
  if (elements.explainModeToggle) elements.explainModeToggle.textContent = profile.settings?.explanationMode === 'detailed' ? 'MODO DETALHADO' : 'MODO CURTO';
  const wallet = getWalletSummary(profile);
  elements.profileChip.innerHTML = `
    <span class="resource-pill ${wallet.status !== 'VALID' ? 'wallet-warning' : ''}" title="Carteira ${wallet.status}">◇ ${profile.coins}</span>
    <span class="resource-pill combo-mini">×${profile.combo || 0}</span>
    ${profile.core?.authority === 'agv-core' ? '<span class="core-pilot-badge">CORE</span>' : ''}
    <div class="profile-meta"><strong>${escapeHtml(profile.studentName || 'Aluno')}</strong><small>${escapeHtml(profile.className || '')} · LVL ${profile.level}</small></div>
    <div class="profile-avatar">${escapeHtml(avatarPreview(profile))}</div>`;
};

const renderToolsDrawer = (toolId = activeTool) => {
  activeTool = toolId;
  if (!elements.toolsDrawerTabs || !elements.toolsDrawerWorkspace) return;
  elements.toolsDrawerTabs.innerHTML = toolCatalog.map((tool) => `<button type="button" class="tools-drawer-tab ${tool.id === activeTool ? 'active' : ''}" data-drawer-tool="${tool.id}"><span>${escapeHtml(tool.icon)}</span><b>${escapeHtml(tool.label)}</b></button>`).join('');
  const missionArtifact = activeChallengeUI.id === 'training-01' && activeTool === 'base64'
    ? `<article class="mission-tool-artifact" role="status"><span>BANDEIRA DE TREINAMENTO</span><strong>${escapeHtml(getChallengeArtifact('training-01', 'promptFlag'))}</strong><small>Esta bandeira aparece somente depois que você abre a ferramenta solicitada. Copie o valor completo para a missão.</small></article>`
    : '';
  const simulatorContext = { missionId: activeChallengeUI.id || '', profile: getState().profile, draft: activeChallengeUI.id ? getMissionDraft(getState().profile, activeChallengeUI.id) : null };
  disposeImmersiveWorkspaces(elements.toolsDrawerWorkspace);
  elements.toolsDrawerWorkspace.innerHTML = `${missionArtifact}${renderToolWorkspace(activeTool, simulatorContext)}`;
  mountImmersiveWorkspaces(elements.toolsDrawerWorkspace);
};

const openToolsDrawer = (toolId = activeTool) => {
  if (activeChallengeUI.id && activeChallengeUI.session) {
    activeChallengeUI.session.toolRuns = (activeChallengeUI.session.toolRuns || 0) + 1;
    const current = getMissionDraft(getState().profile, activeChallengeUI.id) || {};
    const selectedTool = toolId || activeTool;
    saveMissionDraftSnapshot(activeChallengeUI.id, { ...current, toolRuns: activeChallengeUI.session.toolRuns, lastToolId: selectedTool }, { immediate: true, eventType: 'mission_tool_opened' });
    if (hasInvestigativeCase(activeChallengeUI.id) && selectedTool) {
      const usedTools = [...new Set([...(current.workspace?.usedTools || []), selectedTool])];
      patchMissionWorkspace(activeChallengeUI.id, { usedTools }, { rerender: false, eventType: 'mission_workspace_tool_used' });
    }
  }
  renderToolsDrawer(toolId);
  elements.toolsDrawer.classList.add('open');
  elements.toolsDrawer.setAttribute('aria-hidden', 'false');
  elements.toolsDrawerBackdrop.classList.remove('hidden');
  elements.toolsDrawerBackdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  requestAnimationFrame(() => elements.toolsDrawer.querySelector('input, textarea, select, button')?.focus({ preventScroll: true }));
};

const closeToolsDrawer = ({ preserveTour = false } = {}) => {
  if (!preserveTour) stopGuidedTour('skipped');
  elements.toolsDrawer.classList.remove('open');
  elements.toolsDrawer.setAttribute('aria-hidden', 'true');
  elements.toolsDrawerBackdrop.classList.add('hidden');
  elements.toolsDrawerBackdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  disposeImmersiveWorkspaces(elements.toolsDrawerWorkspace);
};

const tutorialCompletion = (draft) => {
  draft.tutorialProgress ||= { platform: false, missionGuide: false, tools: {}, missions: {} };
  draft.tutorialProgress.tools ||= {};
  draft.tutorialProgress.missions ||= {};
  return draft.tutorialProgress;
};

const renderTutorialToolGrid = () => {
  const profile = getState().profile;
  if (!elements.tutorialToolGrid || !profile) return;
  const completed = profile.tutorialProgress?.tools || {};
  elements.tutorialToolGrid.innerHTML = toolTutorialCards().map((tool) => `
    <button class="tutorial-tool-card ${completed[tool.id] ? 'completed' : ''}" data-start-tool-tutorial="${tool.id}">
      <span>${escapeHtml(tool.id === 'password' ? '⚿' : tool.id.slice(0, 3).toUpperCase())}</span>
      <div><strong>${escapeHtml(tool.title)}</strong><small>${completed[tool.id] ? 'Tutorial concluído · assistir novamente' : 'Demonstração guiada e automática'}</small></div>
      <b>${completed[tool.id] ? '↻' : '▶'}</b>
    </button>`).join('');
};

const openTutorialHub = () => {
  const profile = getState().profile;
  if (!profile) return;
  stopGuidedTour('replaced');
  renderTutorialToolGrid();
  if (elements.tutorialAutoplaySetting) elements.tutorialAutoplaySetting.checked = profile.settings?.tutorialAutoPlay !== false;
  elements.tutorialHub.classList.remove('hidden');
  document.body.classList.add('tutorial-hub-open');
  requestAnimationFrame(() => elements.tutorialHub.querySelector('button')?.focus({ preventScroll: true }));
};

const closeTutorialHub = () => {
  elements.tutorialHub?.classList.add('hidden');
  document.body.classList.remove('tutorial-hub-open');
};

const runTutorialToolDemo = async (toolId, form) => {
  if (!form) return;
  const output = form.parentElement?.querySelector('[data-tool-output]');
  if (!output) return;
  output.textContent = 'processando demonstração local...';
  output.classList.add('tutorial-output-running');
  try {
    output.textContent = await runTool(toolId, new FormData(form));
    output.classList.add('tutorial-output-success');
  } catch (error) {
    output.textContent = `ERRO: ${error.message || 'Não foi possível executar a demonstração.'}`;
  } finally {
    setTimeout(() => output.classList.remove('tutorial-output-running', 'tutorial-output-success'), 1800);
  }
};

const startToolTutorial = (toolId = activeTool, { fromMission = false } = {}) => {
  closeTutorialHub();
  openToolsDrawer(toolId);
  if (isImmersiveTool(toolId)) {
    startGuidedTour({
      id: `immersive-${toolId}`,
      label: 'AMBIENTE 3D/360',
      steps: [
        { title: 'Objetivo sempre visível', text: 'Leia o objetivo antes de explorar. O ambiente é complementar e não substitui as evidências do caso.', target: '#tools-drawer-workspace .immersive-objective', cursor: false, duration: 4600 },
        { title: 'Controle a câmera', text: 'Arraste para olhar ao redor, use a roda ou + e − para aproximar e WASD ou setas pelo teclado.', target: '#tools-drawer-workspace [data-immersive-stage]', cursor: false, duration: 5200 },
        { title: 'Compare estados da operação', text: 'Use varredura, incidente, contenção e recuperação para observar como a infraestrutura muda.', target: '#tools-drawer-workspace .immersive-actions', cursor: false, duration: 5200 },
        { title: 'Ajuste qualidade e acessibilidade', text: 'Automático escolhe um preset seguro. O modo 2D mantém a atividade disponível quando WebGL não funcionar.', target: '#tools-drawer-workspace .immersive-settings', cursor: false, duration: 5200 },
      ],
      onFinish: (status) => { if (status === 'completed') persistProfile((draft) => { tutorialCompletion(draft).tools[toolId] = Date.now(); return draft; }, { rerender: false }); },
    });
    return;
  }
  const demoSteps = buildToolTourSteps({
    toolId,
    selectTool: async (id) => { renderToolsDrawer(id); await new Promise((resolve) => setTimeout(resolve, 160)); },
    runDemo: runTutorialToolDemo,
  });
  startGuidedTour({
    id: `tool-${toolId}`,
    label: `FERRAMENTA // ${toolId.toUpperCase()}`,
    steps: demoSteps,
    onFinish: (status) => {
      if (status === 'completed') {
        persistProfile((draft) => { tutorialCompletion(draft).tools[toolId] = Date.now(); return draft; }, { rerender: false });
        showToast('TUTORIAL CONCLUÍDO', 'A ferramenta continua aberta para você testar outros valores.');
        renderTutorialToolGrid();
      } else if (fromMission) showToast('TUTORIAL PAUSADO', 'Você pode reiniciar a demonstração pelo botão COMO USAR.');
    },
  });
};

const visibleNavTarget = (view) => () => [...document.querySelectorAll(`[data-view="${view}"]`)].find((item) => item.getClientRects().length && getComputedStyle(item).display !== 'none');

const startPlatformTutorial = () => {
  closeTutorialHub();
  closeToolsDrawer();
  navigate('dashboard');
  startGuidedTour({
    id: 'platform',
    label: 'COMO USAR A PLATAFORMA',
    steps: [
      { title: 'Bem-vindo ao CTF DS', text: 'Este guia mostra a navegação, o arsenal, as missões e o progresso. O cursor virtual fará uma demonstração sem alterar suas respostas.', target: null, cursor: false, duration: 5200 },
      { title: 'Navegação principal', text: 'Use Central, CTF, Aulas, Ferramentas e Perfil. No celular, as ações mais usadas ficam na barra inferior.', target: visibleNavTarget('ctf'), duration: 5000 },
      { title: 'Central de tutoriais', text: 'O botão GUIA permite rever este tour ou aprender qualquer ferramenta separadamente.', target: '#tutorial-center-toggle', duration: 4400 },
      { title: 'Arsenal sempre disponível', text: 'O botão Ferramentas permanece acessível durante as atividades. No celular ele abre uma gaveta pela parte inferior.', target: '#tools-drawer-toggle', action: async () => openToolsDrawer('base64'), duration: 5200 },
      { title: 'Escolha uma ferramenta', text: 'As ferramentas são locais e seguras. Você pode trocar de ferramenta sem fechar a missão nem perder o que digitou.', target: '#tools-drawer-tabs', cursor: false, duration: 5200 },
      { title: 'Seu progresso', text: 'Nome, turma, nível, moedas e combo aparecem no topo. O relatório exportado usa a identificação escolar do aluno.', before: async () => closeToolsDrawer({ preserveTour: true }), target: '#profile-chip', duration: 5000 },
      { title: 'Comece pelo treinamento', text: 'A trilha Treinamento Inicial possui oito operações fáceis. Elas ensinam o uso do arsenal antes das missões autônomas.', before: async () => { navigate('ctf', { preserveTour: true }); await new Promise((resolve) => setTimeout(resolve, 220)); }, target: '[data-challenge="training-01"]', duration: 6000 },
    ],
    onFinish: (status) => {
      if (status === 'completed') {
        persistProfile((draft) => { tutorialCompletion(draft).platform = true; return draft; }, { rerender: false });
        showToast('GUIA CONCLUÍDO', 'Abra a primeira operação para começar o treinamento prático.');
      }
    },
  });
};

const startMissionTutorial = (challengeId = activeChallengeUI.id || 'training-01', { chainTool = false } = {}) => {
  closeTutorialHub();
  const challenge = getChallenge(challengeId) || getChallenge('training-01');
  if (!challenge) return;
  if (activeChallengeUI.id !== challenge.id) openChallenge(challenge.id, null, false, true, { suppressAutoTutorial: true });
  startGuidedTour({
    id: `mission-${challenge.id}`,
    label: 'COMO RESOLVER UM DESAFIO',
    steps: [
      { title: 'Leia a situação-problema', text: 'Primeiro entenda o que aconteceu. Não tente responder antes de reconhecer o cenário e os dados disponíveis.', target: '.mission-brief-grid .situation-panel', cursor: false, duration: 5600 },
      { title: 'Encontre o objetivo', text: 'O objetivo informa exatamente qual resultado deve ser entregue: flag, palavra, código, sequência ou correção.', target: '.mission-brief-grid .goal-panel', cursor: false, duration: 5600 },
      { title: 'Consulte o passo a passo', text: challenge.tutorial ? 'Nas primeiras operações, este painel explica cada ação. Você pode ocultá-lo, reabri-lo ou iniciar esta demonstração novamente.' : 'Nas operações posteriores, a ajuda diminui. Use as evidências, o diário e as pistas quando necessário.', target: challenge.tutorial ? '.mission-tutorial' : '.mission-flow', cursor: false, duration: 5600 },
      { title: 'Abra as ferramentas', text: 'A missão permanece aberta. Use o arsenal para testar hipóteses e volte ao desafio com o resultado.', target: '.mission-tools-button', action: async () => openToolsDrawer(challenge.tutorial?.toolId || activeTool), duration: 5200 },
      { title: 'Execute um teste seguro', text: challenge.tutorial ? `A ferramenta indicada nesta fase é ${challenge.interaction}. A demonstração específica começará ao final deste guia.` : 'Escolha a ferramenta que melhor combina com o objetivo. Em níveis altos, descobrir a ferramenta faz parte do desafio.', target: '#tools-drawer-workspace', cursor: false, duration: 5800 },
      { title: 'Registre a resposta', text: 'Feche a gaveta, copie apenas o resultado solicitado e confira maiúsculas, símbolos, barras e sublinhados.', before: async () => closeToolsDrawer({ preserveTour: true }), target: '#challenge-answer, #challenge-form .choice-list, #challenge-form .code-editor', duration: 5600 },
      { title: 'Valide e aprenda com o retorno', text: 'A validação informa acerto ou erro. Em caso de acerto, leia o debrief defensivo antes de seguir para a próxima operação.', target: '.sticky-actions .primary-button', duration: 5600 },
    ],
    onFinish: (status) => {
      if (status === 'completed') {
        persistProfile((draft) => {
          const progress = tutorialCompletion(draft);
          progress.missionGuide = true;
          progress.missions[challenge.id] = Date.now();
          return draft;
        }, { rerender: false });
        if (chainTool && challenge.tutorial?.toolId) setTimeout(() => startToolTutorial(challenge.tutorial.toolId, { fromMission: true }), 320);
        else showToast('GUIA DA MISSÃO CONCLUÍDO', 'Agora você pode resolver a operação ou abrir um tutorial de ferramenta.');
      }
    },
  });
};

const showToast = (title, message, type = '') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`.trim();
  const strong = document.createElement('strong');
  const text = document.createElement('span');
  strong.textContent = title;
  text.textContent = message;
  toast.append(strong, text);
  elements.toastRoot.append(toast);
  setTimeout(() => toast.remove(), 4200);
};

const clearMissionAtmosphere = () => {
  delete document.body.dataset.missionTheme;
  document.body.style.removeProperty('--active-mission-accent');
  document.body.style.removeProperty('--active-mission-accent-2');
};


const openTermsGate = ({ readOnly = false } = {}) => {
  const profile = getState().profile;
  if (!profile) return;
  requiredModal = readOnly ? '' : 'terms';
  termsFullOpened = false;
  privacyViewed = false;
  elements.modalRoot.innerHTML = renderTermsGate(profile);
  if (readOnly) {
    const form = elements.modalRoot.querySelector('[data-terms-accept-form]');
    if (form) form.hidden = true;
    elements.modalRoot.querySelector('[data-decline-terms]')?.remove();
    const closeButton = document.createElement('button');
    closeButton.type = 'button'; closeButton.className = 'primary-button full'; closeButton.dataset.closeModal = ''; closeButton.textContent = 'FECHAR DOCUMENTOS';
    elements.modalRoot.querySelector('.terms-modal')?.append(closeButton);
  }
  requestAnimationFrame(() => elements.modalRoot.querySelector('button, input, summary')?.focus({ preventScroll: true }));
};

const showReleaseThanks = () => {
  const profile = getState().profile;
  if (!profile || profile.releaseHistory?.lastSeenReleaseId === RELEASE_ID) { showOnboarding(); return; }
  requiredModal = 'release';
  elements.modalRoot.innerHTML = `<div class="modal-layer release-layer"><section class="panel release-modal" role="dialog" aria-modal="true" aria-labelledby="release-title"><div class="release-rings" aria-hidden="true"><i></i><i></i><i></i><span>3.2.0</span></div><p class="eyebrow">FASE 7 · ESTABILIZAÇÃO E ACABAMENTO</p><h2 id="release-title">Campanha integral preparada para publicação estável</h2><p>A versão 3.2 protege o salvamento durante atualizações, diagnostica o dispositivo localmente, melhora o modo imersivo móvel e refina legibilidade, foco e desempenho.</p><div class="release-tags"><span>Atualização segura</span><span>Diagnóstico local</span><span>Modo imersivo</span><span>Fallback automático</span><span>Schema 15</span></div><div class="release-progress"><span></span></div><button class="primary-button" data-dismiss-release>ENTRAR NA VERSÃO ESTÁVEL</button><button class="text-button" data-dismiss-release>PULAR ANIMAÇÃO</button></section></div>`;
};

const dismissReleaseThanks = () => {
  persistProfile((draft) => { draft.releaseHistory ||= {}; draft.releaseHistory.lastSeenReleaseId = RELEASE_ID; return draft; }, { rerender: false, eventType: 'release_seen', details: { releaseId: RELEASE_ID } });
  requiredModal = '';
  closeModal({ force: true });
  showOnboarding();
};

const closeModal = ({ preserveTour = false, force = false } = {}) => {
  const closingMissionId = activeChallengeUI.id;
  if (closingMissionId) { flushActiveMissionTime({ force: true }); checkpointActiveMission({ immediate: true }); }
  if (!force && requiredModal === 'terms' && getState().profile && !hasRequiredAcceptances(getState().profile)) return;
  if (!force && requiredModal === 'release') return;
  if (!preserveTour) stopGuidedTour('skipped');
  stopEduAuthCountdown();
  pendingEduAuth = null;
  requiredModal = '';
  elements.modalRoot.innerHTML = '';
  activeChallengeUI = { id: null, result: null, showHint: false, tutorialVisible: false };
  activeLessonId = null;
  activeVulnerabilityId = null;
  clearMissionAtmosphere();
  releaseMissionCase(closingMissionId);
};

const navigate = (view, { preserveTour = false } = {}) => {
  if (!viewTitles[view]) return;
  const currentProfile = getState().profile;
  if (currentProfile && !hasRequiredAcceptances(currentProfile) && !['profile', 'about'].includes(view)) {
    openTermsGate();
    return;
  }
  closeModal({ preserveTour });
  setState({ view });
  elements.viewTitle.textContent = viewTitles[view];
  $$('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  elements.sidebar.classList.remove('open');
  renderCurrentView();
  requestAnimationFrame(() => elements.main.focus({ preventScroll: true }));
};

const renderCurrentView = () => {
  const { view, profile } = getState();
  if (!profile) return;
  const renderers = {
    dashboard: () => renderDashboard(profile),
    ctf: () => renderCTF(profile, ctfFilter, ctfQuery),
    academy: () => renderAcademy(profile),
    tools: () => renderTools(activeTool),
    intel: () => renderIntel(profile, intelFilter, intelQuery),
    careers: () => renderCareers(profile),
    store: () => renderStore(profile, storeFilter),
    delivery: () => renderDelivery(profile),
    profile: () => renderProfile(profile),
    about: () => renderAbout(),
  };
  disposeImmersiveWorkspaces(elements.main);
  elements.main.innerHTML = (renderers[view] || renderers.dashboard)();
  if (view === 'tools') mountImmersiveWorkspaces(elements.main);
};

const openChallenge = (id, result = null, showHint = false, tutorialVisible = null, options = {}) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const challenge = getChallenge(id);
  if (!challenge) return;
  const missionState = getMissionProgressState(challenge, getState().profile);
  if (missionState.id === 'locked' && !result) {
    const block = getMissionBlock(challenge);
    showToast('MISSÃO BLOQUEADA', block ? `Conclua o bloco anterior e os pré-requisitos antes de abrir o Bloco ${String(block.number).padStart(2, '0')}.` : 'Conclua os pré-requisitos anteriores.', 'attention');
    return;
  }
  if (platformConfig.eduauth?.requireChallengeStartAuthorization && !options.eduauthAuthorized && !result && !activeChallengeUI.id) {
    openEduAuthAuthorization('challenge-start', `challenge:${id}`, () => openChallenge(id, result, showHint, tutorialVisible, { ...options, eduauthAuthorized: true }));
    return;
  }
  activeLessonId = null;
  activeVulnerabilityId = null;
  let profile = getState().profile;
  const existingDraft = getMissionDraft(profile, id);
  const shouldRecordOpen = !result && (!existingDraft || Date.now() - Number(existingDraft.lastOpenedAt || 0) > 15000);
  if (shouldRecordOpen) {
    profile = persistProfile((draft) => { markMissionOpened(draft, id); return draft; }, { rerender: false, eventType: existingDraft ? 'mission_resumed' : 'mission_started', details: { challengeId: id } });
  }
  const draft = getMissionDraft(profile, id);
  const priorSession = activeChallengeUI.id === id ? activeChallengeUI.session : null;
  activeChallengeUI = { id, result, showHint, tutorialVisible: tutorialVisible ?? Boolean(challenge.tutorial && profile.settings?.tutorialEnabled !== false), session: priorSession || { openedAt: draft?.startedAt || Date.now(), toolRuns: draft?.toolRuns || 0, localTests: draft?.localTests || 0, evidenceClicks: (draft?.workspace?.selectedEvidence?.length || draft?.evidence?.length || 0), submissions: draft?.submissions || 0, activeSeconds: Math.max(0, Number(draft?.workspace?.activeSeconds) || 0) } };
  missionTimerLastTickAt = Date.now();
  missionTimerLastPersistAt = Date.now();
  const [accent, accent2] = getMissionThemeColors(challenge.theme);
  document.body.dataset.missionTheme = challenge.theme;
  document.body.style.setProperty('--active-mission-accent', accent);
  document.body.style.setProperty('--active-mission-accent-2', accent2);
  elements.modalRoot.innerHTML = renderChallengeModal(challenge, profile, result, showHint, activeChallengeUI.tutorialVisible);
  setTimeout(() => { const target = hasInvestigativeCase(challenge.id) ? elements.modalRoot.querySelector('.investigation-drawer-button.active') : $('#challenge-answer', elements.modalRoot); target?.focus(); }, 0);
  const shouldAutoStart = !hasInvestigativeCase(challenge.id) && !options.suppressAutoTutorial && challenge.tutorial && profile.settings?.tutorialAutoPlay !== false && !profile.tutorialProgress?.missions?.[challenge.id] && !result;
  if (shouldAutoStart) setTimeout(() => { if (activeChallengeUI.id === challenge.id) startMissionTutorial(challenge.id, { chainTool: true }); }, 720);
};

const useHint = async (id) => {
  const challenge = getChallenge(id);
  const profile = getState().profile;
  if (!challenge) return;
  if (!profile.hintsUsed[id]) {
    if (profile.core?.authority === 'agv-core') {
      try {
        const result = await purchaseCoreHint(id);
        persistProfile((draft) => { draft.hintsUsed[id] = 1; return draft; }, { rerender: false, eventType: 'core_hint_synced', details: { challengeId: id, cost: result.cost || 0 } });
        applyCoreActionResult(result, { eventType: 'core_hint_economy_synced', details: { challengeId: id } });
        if (result.cost) showToast('PISTA DESCRIPTOGRAFADA', `-${result.cost} XP registrado no AGV Education Core. A missão poderá render no máximo duas estrelas.`);
      } catch (error) {
        showToast(error.code === 'insufficient_xp' ? 'XP INSUFICIENTE' : 'PISTA NÃO LIBERADA', error.message || 'Não foi possível liberar a pista no Core.', 'important');
        return;
      }
    } else {
      const cost = getHintCost(challenge);
      if (cost > profile.xp) {
        showToast('XP INSUFICIENTE', `A pista custa ${cost} XP. Faça uma aula ou conclua outra missão antes de solicitar.`);
        return;
      }
      try {
        persistProfile((draft) => {
          draft.hintsUsed[id] = 1;
          if (cost) spendXp(draft, cost, `hint:${id}`, { challengeId: id });
          return draft;
        }, { rerender: false, eventType: 'hint_used', details: { challengeId: id, cost } });
      } catch (error) { showToast('CARTEIRA BLOQUEADA', error.message, 'important'); return; }
      if (cost) showToast('PISTA DESCRIPTOGRAFADA', `-${cost} XP. A missão poderá render no máximo duas estrelas.`);
    }
  }
  openChallenge(id, activeChallengeUI.result, true, activeChallengeUI.tutorialVisible);
};

const rewardChallenge = (challenge, attemptNumber, verification = {}) => {
  const current = getState().profile;
  if (current.completed[challenge.id]) return { stars: current.completed[challenge.id].stars, rewarded: false, bonusCoins: 0, levelUp: false };
  const coreMode = current.core?.authority === 'agv-core';
  const coreResult = verification.core || null;
  const previousLevel = current.level;
  const hints = current.hintsUsed[challenge.id] || 0;
  const stars = hints > 0 ? (attemptNumber <= 2 ? 2 : 1) : (attemptNumber === 1 ? 3 : attemptNumber <= 3 ? 2 : 1);
  const skillBoost = challenge.difficulty === 'Especialista' ? 20 : challenge.difficulty === 'Avançado' ? 15 : challenge.difficulty === 'Intermediário' ? 11 : 8;
  let bonusCoins = 0;
  let dailyBonus = false;
  let reviewRequired = false;
  let blockCheckpoint = null;
  const profile = persistProfile((draft) => {
    const securityEvent = assessCompletionPattern(draft, challenge.id, activeChallengeUI.session || {});
    reviewRequired = Boolean(securityEvent);
    draft.completed[challenge.id] = { completedAt: Date.now(), stars, proof: verification.proof || '', verificationMode: verification.mode || 'unknown', reviewRequired, official: coreMode };
    recordNarrativeOutcome(draft, challenge.id, draft.missionDrafts?.[challenge.id] || {}, getMissionCase(challenge.id));
    markMissionCompleted(draft, challenge.id);
    draft.combo = (draft.combo || 0) + 1;
    draft.maxCombo = Math.max(draft.maxCombo || 0, draft.combo);
    draft.correctAnswers = (draft.correctAnswers || 0) + 1;
    if (coreMode) {
      draft.stars = Math.max(0, Number(draft.stars || 0) + stars);
      draft.core = {
        ...(draft.core || {}), authority: 'agv-core', platformId: AGV_CORE_INFO.platformId,
        wallet: coreResult?.wallet || draft.core?.wallet || { balance: 0 },
        metrics: coreResult?.metrics || draft.core?.metrics || { xp: 0, points: 0 },
        lastSyncAt: new Date().toISOString(),
      };
      draft.coins = Number(draft.core.wallet?.balance || 0);
      draft.xp = Number(draft.core.metrics?.xp || 0);
      const awardedBlock = coreResult?.blocks?.[0];
      if (awardedBlock) blockCheckpoint = { blockId: String(awardedBlock.blockId || '').replace(/^block:/, ''), rewarded: true, official: true };
    } else {
      bonusCoins = Math.min(25, Math.max(0, draft.combo - 1) * 3);
      awardToProfile(draft, { source: 'challenge', sourceId: `challenge:${challenge.id}`, xp: challenge.xp, coins: challenge.coins + bonusCoins, stars, metadata: { attempts: attemptNumber, hints } });
    }
    draft.skills[challenge.skill] = Math.min(100, (draft.skills[challenge.skill] || 0) + skillBoost);
    const today = dayKey();
    const distance = dayDistance(draft.lastMissionDay, today);
    if (draft.lastMissionDay !== today) draft.streak = distance === 1 ? (draft.streak || 0) + 1 : 1;
    draft.lastMissionDay = today;
    if (!coreMode) dailyBonus = recordDailyAction(draft, 'missions');
    const count = Object.keys(draft.completed).length;
    addBadge(draft, 'Primeira Bandeira', `challenge:${challenge.id}`);
    if (attemptNumber === 1 && hints === 0) addBadge(draft, 'Precisão Cirúrgica', `challenge:${challenge.id}`);
    if (draft.combo >= 3) addBadge(draft, 'Combo Triplo', `challenge:${challenge.id}`);
    if (draft.combo >= 7) addBadge(draft, 'Sequência Implacável', `challenge:${challenge.id}`);
    if (count >= 5) addBadge(draft, 'Caçador de Flags', `challenge:${challenge.id}`);
    if (count >= 10) addBadge(draft, 'Operador Tático', `challenge:${challenge.id}`);
    const trackTotal = challenges.filter((item) => item.track === challenge.track).length;
    const trackDone = challenges.filter((item) => item.track === challenge.track && draft.completed[item.id]).length;
    if (trackDone === trackTotal) addBadge(draft, `Especialista ${challenge.track.toUpperCase()}`, `track:${challenge.track}`);
    if (count === challenges.length) addBadge(draft, 'Mestre do CTF DS', 'campaign:complete');
    if (!coreMode) blockCheckpoint = applyMissionBlockCheckpoint(draft, getMissionBlock(challenge));
    return draft;
  }, { rerender: false, eventType: blockCheckpoint ? 'mission_block_completed' : 'activity_completed', details: { challengeId: challenge.id, stars, attempts: attemptNumber, blockId: getMissionBlock(challenge)?.id || '', authority: coreMode ? 'agv-core' : 'local' } });
  return { stars, rewarded: coreMode ? !coreResult?.already_completed : true, profile, bonusCoins, dailyBonus, levelUp: profile.level > previousLevel, reviewRequired, blockCheckpoint, core: coreResult };
};

const submitChallenge = async (form) => {
  const id = form.dataset.challengeId;
  const challenge = getChallenge(id);
  if (!challenge) return;
  let answer = '';
  if (challenge.type === 'choice') {
    answer = form.querySelector('input[name="challenge-answer"]:checked')?.value ?? '';
  } else if (challenge.type === 'multi-select' || challenge.type === 'code-select') {
    answer = [...form.querySelectorAll('input[name="challenge-answer"]:checked')].map((input) => input.value).join(',');
  } else if (challenge.type === 'sequence') {
    answer = [...form.querySelectorAll('[data-sequence-item]')].map((item) => item.dataset.sequenceItem).join(',');
  } else if (challenge.type === 'matching') {
    answer = [...form.querySelectorAll('[data-match-id]')].map((select) => `${select.dataset.matchId}:${select.value}`).join(',');
  } else {
    answer = form.querySelector('#challenge-answer')?.value ?? '';
  }

  saveMissionDraftFromForm(form, { immediate: true, eventType: 'mission_submission_checkpoint' });
  if (hasInvestigativeCase(id) && !getState().profile.completed?.[id]) {
    const fieldPatch = collectWorkspaceFields();
    if (Object.keys(fieldPatch).length) patchMissionWorkspace(id, fieldPatch, { rerender: false, eventType: 'mission_workspace_submission_checkpoint' });
    const currentDraft = getMissionDraft(getState().profile, id) || {};
    const readiness = getInvestigationReadiness(id, currentDraft);
    if (!readiness.ready) {
      const targetDrawer = readiness.firstMissing?.drawer || 'analysis';
      patchMissionWorkspace(id, { activeDrawer: targetDrawer }, { rerender: true, eventType: 'mission_process_gate_blocked' });
      showToast('INVESTIGAÇÃO AINDA INCOMPLETA', `${readiness.completedCount}/${readiness.requiredCount} etapas registradas. Próximo passo: ${readiness.firstMissing?.label || 'continue a investigação'}.`, 'attention');
      return;
    }
  }
  flushActiveMissionTime({ force: true });
  let attemptNumber = 0;
  if (activeChallengeUI.session) activeChallengeUI.session.submissions = (activeChallengeUI.session.submissions || 0) + 1;
  persistProfile((draft) => {
    draft.attempts[id] = (draft.attempts[id] || 0) + 1;
    attemptNumber = draft.attempts[id];
    const current = getMissionDraft(draft, id) || {};
    ensureMissionDraft(draft, id, { ...current, submissions: activeChallengeUI.session?.submissions || (current.submissions || 0) + 1 });
    return draft;
  }, { rerender: false, eventType: 'mission_answer_submitted', details: { challengeId: id } });

  let verification;
  const coreMode = getState().profile?.core?.authority === 'agv-core';
  if (coreMode) {
    if (!isCoreChallengeProvisioned(id)) {
      showToast('MISSÃO AGUARDANDO CORE', 'Esta missão ainda não foi provisionada no catálogo central. Ela foi bloqueada para não gerar progresso ou moedas locais incorretos.', 'attention');
      return;
    }
    try {
      const coreResult = await completeCoreChallenge(id, answer, `attempt_${uid()}`);
      verification = { valid: true, mode: coreResult.verification?.mode || 'server', proof: coreResult.verification?.proof || '', core: coreResult };
    } catch (error) {
      if (error.code === 'answer_invalid') verification = { valid: false, mode: 'server' };
      else {
        showToast('CORE NÃO AUTORIZOU A CONCLUSÃO', error.message || 'Não foi possível validar a missão no servidor.', 'attention');
        return;
      }
    }
  } else verification = await verifyChallengeAnswer(challenge, answer, getState().profile);
  const success = Boolean(verification.valid);
  if (success) {
    const reward = rewardChallenge(challenge, attemptNumber, verification);
    if (coreMode) {
      try {
        const dailyCore = await syncCoreDaily();
        applyCoreActionResult(dailyCore, { eventType: 'core_daily_after_mission', details: { challengeId: id } });
        reward.dailyBonus = Boolean(dailyCore.daily?.complete && dailyCore.daily?.claimed && !dailyCore.daily?.reward?.duplicate);
      } catch (error) { showToast('MISSÃO VALIDADA', `A missão foi concluída, mas o protocolo diário não sincronizou: ${error.message}`, 'attention'); }
    }
    const coreRewards = reward.core?.reward?.rewards || null;
    const shownXp = coreRewards ? Number(coreRewards.xp || 0) : challenge.xp;
    const shownCoins = coreRewards ? Number(coreRewards.coins || 0) : challenge.coins;
    const bonusText = reward.bonusCoins ? ` +${reward.bonusCoins} moedas de combo.` : '';
    const dailyText = reward.dailyBonus ? ' Bônus diário de +50 moedas liberado.' : '';
    const authorityText = reward.core ? ' Recompensa registrada no AGV Education Core.' : '';
    const message = reward.rewarded
      ? `+${shownXp} XP, +${shownCoins} moedas e ${reward.stars} estrela(s).${bonusText}${dailyText}${authorityText}`
      : `Resposta correta. Esta missão já havia sido recompensada.${authorityText}`;
    openChallenge(id, { success: true, message }, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
    const profile = getState().profile;
    triggerEffect(profile.equipped.effect, { sound: profile.settings.sound, kind: 'success' });
    if (reward.levelUp) showLevelUp(profile.level, profile.settings.sound);
    showToast(reward.reviewRequired ? 'CONCLUSÃO REGISTRADA PARA REVISÃO' : `BANDEIRA CAPTURADA · COMBO ×${profile.combo || 0}`, reward.reviewRequired ? `${message} O padrão de conclusão foi muito rápido e ficará marcado para conferência humana, sem banimento automático.` : message, reward.reviewRequired ? 'attention' : undefined);
    if (reward.blockCheckpoint) {
      const completedBlock = missionBlocks.find((block) => block.id === reward.blockCheckpoint.blockId);
      if (completedBlock) elements.modalRoot.innerHTML = renderBlockCheckpointModal(completedBlock, profile, { newlyClaimed: Boolean(reward.blockCheckpoint.rewarded) });
    }
  } else {
    persistProfile((draft) => {
      draft.combo = 0;
      draft.failedAnswers = (draft.failedAnswers || 0) + 1;
      return draft;
    }, { rerender: false });
    openChallenge(id, { success: false, message: 'A resposta ainda não corresponde à bandeira. O combo foi reiniciado. Confira o objetivo, abra a gaveta de ferramentas ou solicite uma pista.' }, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
    const profile = getState().profile;
    triggerEffect('effect-glitch', { sound: profile.settings.sound, kind: 'error' });
  }
};

const openLesson = async (id, options = {}) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const lesson = getLesson(id);
  if (!lesson) return;
  if (platformConfig.eduauth?.requireLessonStartAuthorization && !options.eduauthAuthorized) {
    openEduAuthAuthorization('lesson-start', `lesson:${id}`, () => { void openLesson(id, { eduauthAuthorized: true }); });
    return;
  }
  if (getState().profile?.core?.authority === 'agv-core') {
    try { await startCoreLesson(id); }
    catch (error) { showToast('AULA NÃO INICIADA', error.message || 'O Core não autorizou o início desta aula.', 'attention'); return; }
  }
  const completed = Boolean(getState().profile.lessonProgress[id]?.completed);
  activeChallengeUI = { id: null, result: null, showHint: false, tutorialVisible: false };
  activeVulnerabilityId = null;
  activeLessonId = id;
  elements.modalRoot.innerHTML = renderLessonModal(lesson, completed, getState().profile.settings?.explanationMode || 'short');
};

const completeLesson = async (id) => {
  const profile = getState().profile;
  const alreadyCompleted = Boolean(profile.lessonProgress[id]?.completed);
  if (profile.core?.authority === 'agv-core') {
    try {
      const result = await completeCoreLesson(id);
      persistProfile((draft) => {
        draft.lessonProgress[id] = { completed: true, completedAt: draft.lessonProgress[id]?.completedAt || Date.now(), official: true };
        addBadge(draft, 'Aprendiz Guiado');
        return draft;
      }, { rerender: false, eventType: alreadyCompleted ? 'core_lesson_reviewed' : 'core_lesson_completed', details: { lessonId: id } });
      applyCoreActionResult(result, { eventType: 'core_lesson_economy_synced', details: { lessonId: id } });
      const rewards = result.reward?.rewards;
      const rewardText = rewards ? `+${Number(rewards.xp || 0)} XP e +${Number(rewards.coins || 0)} Cyber Coins.` : 'Aula revisada e registrada no Core.';
      const dailyText = result.daily?.complete && result.daily?.claimed ? (result.daily?.reward?.duplicate ? ' Protocolo diário já estava validado.' : ' Protocolo diário validado.') : '';
      showToast(alreadyCompleted ? 'AULA REVISADA' : 'AULA CONCLUÍDA', `${rewardText}${dailyText}`);
    } catch (error) { showToast('AULA NÃO REGISTRADA', error.message || 'O Core não autorizou a conclusão.', 'attention'); return; }
  } else if (!alreadyCompleted) {
    let dailyBonus = false;
    persistProfile((draft) => {
      draft.lessonProgress[id] = { completed: true, completedAt: Date.now() };
      awardToProfile(draft, { source: 'lesson', sourceId: `lesson:${id}`, xp: 40, coins: 15 });
      dailyBonus = recordDailyAction(draft, 'lessons');
      addBadge(draft, 'Aprendiz Guiado');
      return draft;
    }, { rerender: false });
    showToast('AULA CONCLUÍDA', `+40 XP e +15 Cyber Coins.${dailyBonus ? ' Bônus diário de +50 moedas liberado.' : ''}`);
  } else {
    persistProfile((draft) => { recordDailyAction(draft, 'lessons'); return draft; }, { rerender: false });
  }
  closeModal();
  renderCurrentView();
};

const toggleExplanationMode = () => {
  const profile = persistProfile((draft) => {
    draft.settings.explanationMode = draft.settings.explanationMode === 'detailed' ? 'short' : 'detailed';
    return draft;
  }, { rerender: false });
  renderCurrentView();
  if (activeLessonId) {
    const lesson = getLesson(activeLessonId);
    if (lesson) elements.modalRoot.innerHTML = renderLessonModal(lesson, Boolean(profile.lessonProgress[activeLessonId]?.completed), profile.settings.explanationMode);
  } else if (activeVulnerabilityId) {
    const item = getVulnerability(activeVulnerabilityId);
    if (item) elements.modalRoot.innerHTML = renderVulnerabilityModal(item, profile);
  } else if (activeChallengeUI.id) {
    const challenge = getChallenge(activeChallengeUI.id);
    if (challenge) elements.modalRoot.innerHTML = renderChallengeModal(challenge, profile, activeChallengeUI.result, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
  }
  showToast('MODO DE EXPLICAÇÃO', profile.settings.explanationMode === 'detailed' ? 'Conteúdo detalhado ativado.' : 'Resumo rápido ativado.');
};


const toggleSound = () => {
  const profile = persistProfile((draft) => { draft.settings.sound = !draft.settings.sound; return draft; });
  showToast('FEEDBACK SONORO', profile.settings.sound ? 'Sons sintéticos curtos ativados.' : 'Sons desativados.');
};

const toggleMotion = () => {
  const profile = persistProfile((draft) => { draft.settings.reducedMotion = !draft.settings.reducedMotion; return draft; });
  showToast('MOVIMENTO DA INTERFACE', profile.settings.reducedMotion ? 'Animações decorativas foram reduzidas.' : 'Animações completas ativadas.');
};

const runLocalMissionTest = async (id, trigger) => {
  const challenge = getChallenge(id);
  const form = trigger.closest('form');
  const output = form?.querySelector('[data-local-test-output]');
  if (!challenge || !form || !output) return;
  const value = form.querySelector('#challenge-answer')?.value ?? '';
  if (activeChallengeUI.session) activeChallengeUI.session.localTests = (activeChallengeUI.session.localTests || 0) + 1;
  saveMissionDraftFromForm(form, { immediate: true, eventType: 'mission_local_test' });
  const passed = Boolean((await verifyChallengeAnswer(challenge, value, getState().profile)).valid);
  output.className = passed ? 'local-test-pass' : 'local-test-fail';
  if (challenge.type === 'url-route') output.textContent = passed ? 'HTTP 200 // rota reconhecida. Valide para registrar a missão.' : 'HTTP 404 // rota não encontrada neste sandbox.';
  else output.textContent = passed ? '[PASS] Todos os testes locais passaram. Faça a validação final.' : '[FAIL] Um ou mais testes ainda falharam. Revise a regra defensiva.';
};

const handleStoreItem = async (id) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const item = getStoreItem(id);
  if (!item) return;
  const profile = getState().profile;
  const owned = profile.inventory.includes(item.id);
  if (profile.core?.authority === 'agv-core') {
    if (!owned) {
      try {
        const result = await purchaseCoreStoreItem(item.id);
        applyCoreActionResult(result, { eventType: 'core_store_purchase', details: { itemId: item.id } });
      } catch (error) {
        showToast(error.code === 'insufficient_balance' ? 'SALDO INSUFICIENTE' : 'COMPRA BLOQUEADA', error.message || 'O Core não autorizou a compra.', 'important');
        return;
      }
    }
    persistProfile((draft) => { draft.equipped[item.type] = item.id; return draft; }, { eventType: owned ? 'item_equipped' : 'core_item_equipped', details: { itemId: item.id } });
  } else {
    try {
      persistProfile((draft) => { purchaseStoreItem(draft, item); return draft; }, { eventType: owned ? 'item_equipped' : 'store_purchase', details: { itemId: item.id, price: item.price } });
    } catch (error) {
      showToast(error.message.includes('saldo') ? 'SALDO INSUFICIENTE' : 'COMPRA BLOQUEADA', error.message, 'important');
      return;
    }
  }
  showToast(owned ? 'ITEM EQUIPADO' : 'ITEM DESBLOQUEADO', `${item.name} · compra virtual sem impacto na nota.`);
  const current = getState().profile;
  triggerEffect(current.equipped.effect, { sound: current.settings.sound, kind: 'success' });
};

const runBoot = async () => {
  const lines = [
    '[SYS] Inicializando ambiente isolado...',
    '[SCAN] Verificando superfície de treinamento...',
    '[CRYPT] Carregando módulos de codificação...',
    '[SOC] Sincronizando telemetria fictícia...',
    '[CTF] Montando bandeiras e níveis de acesso...',
    '[SAFE] Bloqueando operações externas...',
    '[OK] Cyber Lab pronto. Identidade necessária.',
  ];
  for (let index = 0; index < lines.length && !bootFinished; index += 1) {
    elements.bootLine.textContent = lines[index];
    elements.bootProgress.style.width = `${Math.round(((index + 1) / lines.length) * 100)}%`;
    await new Promise((resolve) => setTimeout(resolve, 420));
  }
  finishBoot();
};

const finishBoot = () => {
  if (bootFinished) return;
  bootFinished = true;
  elements.boot.classList.add('done');
  setTimeout(() => elements.boot.classList.add('hidden'), 500);
  initializeSession();
};

const refreshSavedProfiles = async () => {
  if (!elements.savedProfileList) return;
  const profiles = await listLocalProfiles().catch(() => []);
  if (!profiles.length) {
    elements.savedProfileList.innerHTML = '<p class="muted">Nenhum perfil protegido encontrado neste dispositivo.</p>';
    return;
  }
  elements.savedProfileList.innerHTML = `<p class="eyebrow">PERFIS DESTE DISPOSITIVO</p>${profiles.map((profile) => {
    const days = Math.max(0, Math.ceil((profile.expiresAt - Date.now()) / 86400000));
    return `<button type="button" class="saved-profile-card ${selectedSavedAccountId === profile.accountId ? 'selected' : ''}" data-select-saved-profile="${escapeHtml(profile.accountId)}"><span class="avatar">◉</span><span><strong>${escapeHtml(profile.displayName)}</strong><small>${escapeHtml(profile.className)} · último acesso ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(profile.lastAccessAt || Date.now()))}</small></span><span class="expiry">${days}d</span></button>`;
  }).join('')}`;
};

const clearSavedProfileSelection = () => {
  selectedSavedAccountId = '';
  elements.authStudentName.readOnly = false;
  elements.authClassName.readOnly = false;
  elements.authStudentName.value = '';
  elements.authClassName.value = '';
  elements.authError.textContent = '';
  void refreshSavedProfiles();
};

const unifiedAuthRedirect = () => {
  const root = new URL('../../../', window.location.href);
  const u = new URL('auth/', root);
  u.searchParams.set('returnTo', 'sistemas/02-ctf-ds/ctf/index.html');
  window.location.replace(u.href);
};
const unifiedCachePassword = (identity) => `AGV-CACHE-${String(identity?.user?.id||'').replace(/-/g,'').slice(0,20)}-59`;
const initializeSession = async () => {
  releaseProfileTabLock();
  clearSession();
  const central = hasCentralSession();
  if (!central) { unifiedAuthRedirect(); return; }
  elements.authModal.classList.add('hidden');
  try {
    const coreState = await loadCoreCTFState();
    const identity = coreState?.identity;
    if (!identity?.profile?.active) throw new Error('Perfil institucional inválido ou inativo.');
    if (identity.profile.must_change_password) { location.replace('../../../atividades/'); return; }
    await openCoreIdentity(identity, unifiedCachePassword(identity));
  } catch (error) {
    console.error('[CTF DS unified auth]', error);
    unifiedAuthRedirect();
  }
};

const renderOnboarding = (profile) => `<div class="modal-layer onboarding-layer" role="presentation">
  <section class="panel onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <div class="onboarding-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
    <p class="eyebrow">BRIEFING INICIAL // ALUNO ${escapeHtml((profile.studentName || 'ALUNO').toUpperCase())} · ${escapeHtml((profile.className || '').toUpperCase())}</p>
    <h2 id="onboarding-title">Sua primeira operação começa aqui</h2>
    <p class="onboarding-lead">Você não precisa conhecer cibersegurança para começar. As oito primeiras operações ensinam onde ficam as ferramentas e como usá-las. Depois, as orientações diminuem conforme suas habilidades evoluem.</p>
    <div class="onboarding-paths">
      <article><b>01</b><span>APRENDA</span><h3>8 tutoriais iniciais</h3><p>Base64, César, binário, hexadecimal, ROT13, URL e logs com cursor virtual, simulação automática e passos opcionais.</p></article>
      <article><b>02</b><span>INVESTIGUE</span><h3>Gaveta de ferramentas</h3><p>Abra o arsenal sem sair da missão e preserve tudo o que já digitou.</p></article>
      <article><b>03</b><span>EVOLUA</span><h3>Progressão</h3><p>Ganhe XP, estrelas, moedas, combos, emblemas e novas personalizações.</p></article>
    </div>
    <div class="onboarding-tips"><span><kbd>⌘ Ferramentas</kbd> abre o arsenal</span><span><kbd>Ctrl</kbd> + <kbd>Enter</kbd> valida respostas</span><span>O tutorial pode ser ocultado e reaberto a qualquer momento</span></div>
    <div class="onboarding-actions"><button class="primary-button" data-onboarding-target="animated">▶ ASSISTIR TUTORIAL ANIMADO</button><button class="secondary-button" data-onboarding-target="ctf">PULAR TUTORIAL E IR ÀS MISSÕES</button><button class="text-button" data-onboarding-target="dashboard">VER A CENTRAL</button></div>
  </section>
</div>`;

const showOnboarding = () => {
  const profile = getState().profile;
  if (!profile || profile.onboardingCompleted) return;
  elements.modalRoot.innerHTML = renderOnboarding(profile);
};

const completeOnboarding = (target = 'dashboard') => {
  persistProfile((draft) => { draft.onboardingCompleted = true; return draft; }, { rerender: false });
  closeModal();
  if (target === 'animated') { navigate('dashboard'); setTimeout(startPlatformTutorial, 360); return; }
  if (target === 'ctf') persistProfile((draft) => { draft.settings.tutorialAutoPlay = false; return draft; }, { rerender: false });
  navigate(target);
};

const updateScheduleContext = ({ notify = false } = {}) => {
  const profile = getState().profile;
  if (!profile || profile._ephemeral && !profile.className) return;
  scheduleStatus = detectCurrentPeriod(profile.className);
  if (elements.scheduleChip) {
    const visible = profile.settings?.showRemainingTime !== false;
    elements.scheduleChip.classList.toggle('hidden', !visible);
    elements.scheduleChip.classList.toggle('attention', scheduleStatus.state === 'class' && scheduleStatus.remainingMinutes <= 5);
    elements.scheduleChip.textContent = scheduleStatus.label || 'Horário escolar';
  }
  if (!notify || profile.settings?.scheduleNotifications === false) return;
  const milestone = scheduleStatus.state === 'class'
    ? platformConfig.schoolSchedule.milestones.find((value) => scheduleStatus.remainingMinutes <= value) || 'start'
    : scheduleStatus.state;
  const noticeKey = `${scheduleStatus.now?.dateKey}:${scheduleStatus.state}:${scheduleStatus.current?.number || ''}:${milestone}`;
  if (scheduleNoticeKey === noticeKey || sessionStorage.getItem(`ctfds:schedule:${noticeKey}`)) return;
  const notice = scheduleMessage(scheduleStatus, profile);
  if (notice) {
    scheduleNoticeKey = noticeKey;
    sessionStorage.setItem(`ctfds:schedule:${noticeKey}`, '1');
    showToast(notice.title, notice.message, notice.level);
  }
};

const resetIdleTimer = () => {
  lastUserActivityAt = Date.now();
  if (!getState().profile || getState().profile._ephemeral) return;
  touchSession();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => unifiedAuthRedirect(), IDLE_LOCK_MS);
};

const enterApp = (profile) => {
  if (profile.dailyStats?.date !== dayKey()) profile.dailyStats = { date: dayKey(), missions: 0, lessons: 0, tools: 0 };
  setState({ profile, view: 'dashboard' });
  if (!profile._ephemeral) void saveProfile(profile, 'profile_opened', { deviceSession: true });
  elements.authModal.classList.add('hidden');
  elements.app.classList.remove('hidden');
  elements.terminalToggle.classList.remove('hidden');
  elements.toolsDrawerToggle.classList.remove('hidden');
  renderToolsDrawer(activeTool);
  applyTheme(profile);
  renderProfileChip(profile);
  navigate('dashboard');
  updateScheduleContext({ notify: true });
  resetIdleTimer();
  if (!elements.terminalOutput.textContent) appendTerminal(terminalWelcome);
  requestAnimationFrame(() => {
    if (!hasRequiredAcceptances(profile)) openTermsGate(); else showReleaseThanks();
    const wallet = getWalletSummary(profile);
    const pendingReview = (profile.securityIncidents || []).some((event) => event.reviewRequired);
    if (!wallet.valid || wallet.status !== 'VALID') showToast('INCONSISTÊNCIA LOCAL DETECTADA', 'Moedas, XP, inventário ou extrato não passaram pela reconciliação. Compras e novas recompensas permanecem bloqueadas até revisão humana ou restauração de backup válido.', 'important');
    else if (pendingReview) showToast('EVENTO AGUARDANDO CONFERÊNCIA', 'Existe um padrão de conclusão registrado para revisão pedagógica. Isso não representa banimento automático.', 'attention');
  });
};

const setAuthMode = () => {
  authMode = 'login';
  elements.authLabel.textContent = pendingCentralIdentity ? 'CRIAR SENHA PESSOAL' : 'ENTRAR NO CORE';
  elements.authPassword.autocomplete = 'current-password';
};

const handleProfileTabDisplaced = () => {
  checkpointActiveMission({ immediate: true });
  void lockAndShowAuth('Este perfil foi assumido em outra aba. Para proteger o progresso, esta sessão foi bloqueada.');
};

const hydrateCoreProfile = (profile, identity, coreState) => {
  const officialCompleted = {};
  const lessonProgress = {};
  for (const row of coreState.progress || []) {
    if (row.status !== 'completed') continue;
    const activityId = String(row.activity_id || '');
    if (activityId.startsWith('challenge:')) {
      const id = activityId.slice('challenge:'.length);
      officialCompleted[id] = profile.completed?.[id] || { completedAt: new Date(row.completed_at || row.updated_at || Date.now()).getTime(), stars: 1, proof: 'core-sync', verificationMode: 'core-sync', reviewRequired: false, official: true };
    }
    if (activityId.startsWith('lesson:')) {
      const id = activityId.slice('lesson:'.length);
      lessonProgress[id] = { completed: true, completedAt: new Date(row.completed_at || row.updated_at || Date.now()).getTime(), official: true };
    }
  }
  profile.studentName = identity.profile.full_name;
  profile.className = identity.classInfo?.name || identity.classInfo?.code || 'Turma não vinculada';
  profile.completed = officialCompleted;
  profile.lessonProgress = lessonProgress;
  profile.hintsUsed = Object.fromEntries((coreState.hintChallengeIds || []).map((id) => [id, 1]));
  profile.inventory = [...new Set(coreState.store?.ownedItemIds || ['theme-neon','avatar-ghost','effect-matrix'])];
  if (!profile.inventory.includes(profile.equipped?.theme)) profile.equipped.theme = 'theme-neon';
  if (!profile.inventory.includes(profile.equipped?.avatar)) profile.equipped.avatar = 'avatar-ghost';
  if (!profile.inventory.includes(profile.equipped?.effect)) profile.equipped.effect = 'effect-matrix';
  if (coreState.daily) profile.dailyStats = { date: coreState.daily.date, missions: coreState.daily.missions || 0, lessons: coreState.daily.lessons || 0, tools: coreState.daily.tools || 0 };
  profile.core = {
    ...(profile.core || {}),
    authority: 'agv-core', platformId: AGV_CORE_INFO.platformId, linkedUserId: identity.user.id,
    wallet: coreState.wallet, metrics: coreState.metrics,
    provisionedChallengeCount: coreState.provisionedChallengeIds.length,
    provisionedChallengeIds: coreState.provisionedChallengeIds,
    catalogActivityCount: coreState.catalog?.length || 0,
    catalogComplete: coreState.catalogComplete,
    storeTransactions: coreState.store?.transactions || [],
    daily: coreState.daily || null,
    lastSyncAt: new Date().toISOString(),
  };
  profile.coins = Number(coreState.wallet?.balance || 0);
  profile.xp = Number(coreState.metrics?.xp || 0);
  reconcileProfileState(profile);
  return profile;
};

const openCoreIdentity = async (identity, cachePassword) => {
  let account = null;
  let cacheReset = false;
  try { account = await authenticateCoreLinkedAccount(identity.user.id, cachePassword); }
  catch {
    await resetCoreLinkedCache(identity.user.id);
    cacheReset = true;
  }
  if (!account) {
    const accountId = coreLinkedAccountId(identity.user.id);
    const initial = createDefaultProfile(accountId, identity.profile.full_name, identity.classInfo?.name || identity.classInfo?.code || 'Turma não vinculada');
    initial.coins = 0;
    initial.xp = 0;
    initial.core = { authority: 'agv-core', linkedUserId: identity.user.id, platformId: AGV_CORE_INFO.platformId };
    account = await registerCoreLinkedAccount(identity.user.id, identity.profile.full_name, initial.className, cachePassword, initial);
  }
  createSession(account.accountId);
  const local = await loadProfile(account.accountId);
  const coreState = await loadCoreCTFState();
  const profile = hydrateCoreProfile(normalizeProfile(local || createDefaultProfile(account.accountId, identity.profile.full_name, identity.classInfo?.name || 'Turma não vinculada'), account.accountId, identity.profile.full_name, identity.classInfo?.name || 'Turma não vinculada'), identity, coreState);
  await saveProfile(profile, 'core_profile_synced', { provisionedChallenges: coreState.provisionedChallengeIds.length, catalogComplete: coreState.catalogComplete });
  pendingCentralIdentity = null;
  pendingCentralLoginPassword = '';
  elements.authNewPasswordWrap?.classList.add('hidden');
  elements.authForm.reset();
  enterApp(profile);
  if (cacheReset) showToast('CACHE LOCAL RECRIADO', 'A autenticação central estava válida, mas a chave local era antiga. O cache foi recriado; progresso oficial foi restaurado do Core.', 'attention');
  if (coreState.catalogComplete) showToast('AGV CORE ATIVO', `${coreState.provisionedChallengeIds.length}/68 missões e ${coreState.catalog.length}/86 atividades estão sob autoridade central.`);
  else showToast('CORE PARCIAL', `${coreState.provisionedChallengeIds.length}/68 missões e ${coreState.catalog.length}/86 atividades provisionadas. Itens ausentes permanecem bloqueados.`, 'attention');
};

const handleAuth = async (event) => {
  event.preventDefault();
  unifiedAuthRedirect();
};

const lockAndShowAuth = async (message = 'Sessão encerrada.') => {
  const profile = getState().profile;
  if (profile && !profile._ephemeral) {
    try { await saveProfile(profile, 'session_locked', { authority: 'agv-core' }); } catch {}
  }
  releaseProfileTabLock();
  clearTimeout(idleTimer);
  closeModal();
  try { await centralSignOut(); } catch {}
  clearSession();
  showToast('SESSÃO ÚNICA', message, 'attention');
  unifiedAuthRedirect();
};

// Controles do Perfil usam exclusivamente a sessão institucional compartilhada.
// Antes da Etapa 5 os handlers chamavam funções inexistentes (switchAccount/logout),
// gerando ReferenceError ao tentar trocar de conta ou sair do CTF.
const switchAccount = async () => lockAndShowAuth('Conta desconectada. Entre com outra conta institucional.');
const logout = async () => lockAndShowAuth('Sessão encerrada e bloqueada neste dispositivo.');


const appendTerminal = (text, type = '') => {
  const line = document.createElement('div');
  if (type) line.className = type;
  line.textContent = text;
  elements.terminalOutput.append(line);
  elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
};

const handleTerminal = (event) => {
  event.preventDefault();
  const command = elements.terminalInput.value;
  if (!command.trim()) return;
  appendTerminal(`student@ctfds:~$ ${command}`, 'cmd');
  const result = executeTerminalCommand(command, getState().profile);
  if (result === '__CLEAR__') elements.terminalOutput.innerHTML = '';
  else if (result) appendTerminal(result, /não reconhecido|inválid/i.test(result) ? 'error' : '');
  elements.terminalInput.value = '';
};

// Global click routing keeps dynamically rendered screens modular.
document.addEventListener('click', async (event) => {
  if (event.target.closest('[data-mark-full-terms]')) { termsFullOpened = true; const details = elements.modalRoot.querySelector('[data-full-terms-details]'); if (details) details.open = true; details?.scrollIntoView({ behavior: getState().profile?.settings?.reducedMotion ? 'auto' : 'smooth', block: 'start' }); return; }
  if (event.target.closest('[data-full-terms-details] summary')) termsFullOpened = true;
  if (event.target.closest('[data-privacy-details] summary')) privacyViewed = true;
  if (event.target.closest('[data-mark-privacy]')) { privacyViewed = true; const details = elements.modalRoot.querySelector('[data-privacy-details]'); if (details) details.open = true; details?.scrollIntoView({ behavior: getState().profile?.settings?.reducedMotion ? 'auto' : 'smooth', block: 'start' }); return; }
  if (event.target.closest('[data-download-terms]')) { downloadText(`termo-ctfds-v${TERMS_VERSION}.txt`, `CTF DS — TERMO DE CIÊNCIA, USO RESPONSÁVEL E COMPROMISSO PEDAGÓGICO\nVersão ${TERMS_VERSION}\n\n${TERMS_FULL_TEXT}`); return; }
  if (event.target.closest('[data-open-terms]')) { openTermsGate({ readOnly: hasRequiredAcceptances(getState().profile) }); return; }
  if (event.target.closest('[data-decline-terms]')) { lockAndShowAuth('O termo não foi aceito. O perfil foi preservado e poderá ser exportado ou acessado novamente.'); return; }
  if (event.target.closest('[data-dismiss-release]')) { dismissReleaseThanks(); return; }
  if (event.target.closest('[data-report-bug]')) { openBugReport(); return; }
  const savedProfileButton = event.target.closest('[data-select-saved-profile]');
  if (savedProfileButton) {
    showToast('CACHE LOCAL', 'Perfis antigos permanecem preservados para reconciliação, mas o acesso oficial agora usa e-mail institucional pelo AGV Education Core.', 'attention');
    elements.authEmail?.focus();
    return;
  }
  if (event.target.closest('#temporary-session')) { unifiedAuthRedirect(); return; }
  if (event.target.closest('#teacher-mode') || event.target.closest('[data-open-teacher-mode]') || event.target.closest('[data-open-eduauth-center]')) { openTeacherMode(); return; }
  const eduauthDemo = event.target.closest('[data-eduauth-demo-action]');
  if (eduauthDemo) { openEduAuthAuthorization(eduauthDemo.dataset.eduauthDemoAction, 'demonstracao-protocolo'); return; }
  if (event.target.closest('[data-copy-eduauth-code]')) {
    const code = $('[data-eduauth-code]', elements.modalRoot)?.textContent || '';
    copyRequestCode(code).then(() => showToast('CÓDIGO COPIADO', 'Envie ou informe o código-base ao professor.')).catch((error) => showToast('NÃO FOI POSSÍVEL COPIAR', error.message, 'attention'));
    return;
  }
  if (event.target.closest('[data-speak-eduauth-code]')) {
    const code = $('[data-eduauth-code]', elements.modalRoot)?.textContent || '';
    try { speakRequestCode(code); } catch (error) { showToast('LEITURA INDISPONÍVEL', error.message, 'attention'); }
    return;
  }
  if (event.target.closest('[data-toggle-eduauth-qr]')) {
    const canvas = $('[data-eduauth-qr]', elements.modalRoot); const code = $('[data-eduauth-code]', elements.modalRoot)?.textContent || '';
    if (canvas) {
      canvas.classList.toggle('hidden');
      if (!canvas.classList.contains('hidden')) {
        try { renderQrToCanvas(canvas, code, { scale: window.innerWidth < 480 ? 4 : 6 }); }
        catch (error) { canvas.classList.add('hidden'); showToast('QR INDISPONÍVEL', error.message, 'attention'); }
      }
    }
    return;
  }
  if (event.target.closest('[data-renew-eduauth-request]')) { renewPendingEduAuthRequest(); return; }
  if (event.target.closest('[data-eduauth-development-bypass]')) {
    if (eduauthIsProductionProvisioned()) return;
    const current = pendingEduAuth;
    const reason = $('[data-eduauth-reason]', elements.modalRoot)?.value?.trim() || '';
    if (current?.action?.requireReason && reason.length < 4) { showToast('MOTIVO NECESSÁRIO', 'Registre o motivo antes de continuar.', 'attention'); $('[data-eduauth-reason]', elements.modalRoot)?.focus(); return; }
    recordEduAuthEvent({ platform: 'ctfds', mode: 'DEVELOPMENT_BYPASS', risk: current?.action?.risk || 'UNKNOWN', actionId: current?.actionId || '', resourceId: current?.resourceId || '', result: 'development-bypass', reason });
    completeEduAuthAuthorization({ mode: 'DEVELOPMENT_BYPASS', reason });
    return;
  }
  if (event.target.closest('#schedule-chip')) { openScheduleDetails(); return; }
  if (event.target.closest('#profile-chip')) { navigate('profile'); return; }
  if (event.target.closest('[data-generate-evidence]')) { generateEvidence(); return; }
  if (event.target.closest('[data-open-classroom]')) { openClassroom(); return; }
  if (event.target.closest('[data-switch-account]')) { checkpointActiveMission({ immediate: true }); switchAccount(); return; }
  if (event.target.closest('[data-lock-session]')) { checkpointActiveMission({ immediate: true }); logout(); return; }
  if (event.target.closest('[data-apply-app-update]')) { await applyPendingUpdate(); return; }
  if (event.target.closest('[data-dismiss-app-update]')) { hideUpdateBanner(); return; }
  if (event.target.closest('[data-clear-app-cache]')) { await clearApplicationCache(); return; }
  if (event.target.closest('[data-run-device-diagnostics]')) {
    showToast('DIAGNÓSTICO', 'Analisando GPU, CPU, armazenamento e recursos do navegador...');
    const diagnostics = await collectDeviceDiagnostics();
    persistProfile((draft) => { draft.settings.deviceDiagnostics = diagnostics; return draft; }, { eventType: 'device_diagnostics_completed', details: { recommendedQuality: diagnostics.recommendedQuality, webgl: diagnostics.support.webgl, benchmark: diagnostics.benchmark.score } });
    applyTheme(getState().profile);
    showToast('DIAGNÓSTICO CONCLUÍDO', `Qualidade recomendada: ${diagnostics.recommendedQuality.toUpperCase()}.`);
    return;
  }
  if (event.target.closest('[data-apply-recommended-quality]')) {
    const recommended = getState().profile?.settings?.deviceDiagnostics?.recommendedQuality;
    if (recommended) {
      persistProfile((draft) => { draft.settings.qualityPreset = recommended; return draft; }, { eventType: 'recommended_quality_applied', details: { quality: recommended } });
      applyTheme(getState().profile);
      showToast('QUALIDADE APLICADA', `${recommended.toUpperCase()} definido para este perfil.`);
    }
    return;
  }
  if (event.target.closest('[data-clear-mission-drafts]')) { clearMissionDraftHistory(); return; }
  const clearDraftButton = event.target.closest('[data-clear-mission-draft]');
  if (clearDraftButton) { clearCurrentMissionDraft(clearDraftButton.dataset.clearMissionDraft); return; }
  if (event.target.closest('[data-delete-profile]')) { deleteCurrentProfile(); return; }
  if (event.target.closest('[data-change-password]')) { openChangePassword(); return; }
  if (event.target.closest('[data-change-identity]')) { openChangeIdentity(); return; }
  if (event.target.closest('[data-verify-integrity]')) {
    const profile = getState().profile;
    Promise.all([verifyAuditChain(profile), Promise.resolve(reconcileProfileState(profile))]).then(([auditValid, wallet]) => {
      const valid = auditValid && wallet.valid;
      showToast(valid ? 'INTEGRIDADE VERIFICADA' : 'ALTERAÇÃO DETECTADA', valid ? 'Histórico, carteira, XP e inventário estão consistentes.' : 'Uma inconsistência foi encontrada. A carteira foi bloqueada para conferência; exporte um backup e procure o professor.', valid ? 'info' : 'important');
      renderCurrentView();
    });
    return;
  }
  if (event.target.closest('[data-request-persistent-storage]')) {
    requestPersistentStorage().then((result) => showToast(result.granted ? 'ARMAZENAMENTO PERSISTENTE ATIVADO' : 'PERSISTÊNCIA NÃO GARANTIDA', result.granted ? 'O navegador tentará preservar os dados locais.' : 'Faça backups periódicos, pois o navegador ainda pode remover os dados.', result.granted ? 'info' : 'attention'));
    return;
  }
  const recoveryTab = event.target.closest('[data-recovery-tab]');
  if (recoveryTab) {
    $$('[data-recovery-tab]', elements.modalRoot).forEach((button) => button.classList.toggle('active', button === recoveryTab));
    $$('[data-recovery-panel]', elements.modalRoot).forEach((panel) => panel.classList.toggle('hidden', panel.dataset.recoveryPanel !== recoveryTab.dataset.recoveryTab));
    return;
  }
  const onboardingButton = event.target.closest('[data-onboarding-target]');
  if (onboardingButton) { completeOnboarding(onboardingButton.dataset.onboardingTarget); return; }

  if (event.target.closest('[data-open-tutorial-center]')) { openTutorialHub(); return; }
  if (event.target.closest('[data-close-tutorial-hub]')) { closeTutorialHub(); return; }
  if (event.target.closest('[data-start-platform-tour]')) { startPlatformTutorial(); return; }
  if (event.target.closest('[data-start-mission-tour]')) { startMissionTutorial(activeChallengeUI.id || 'training-01'); return; }
  const animatedMissionButton = event.target.closest('[data-start-animated-tutorial]');
  if (animatedMissionButton) { startMissionTutorial(animatedMissionButton.dataset.startAnimatedTutorial, { chainTool: true }); return; }
  const toolTutorialButton = event.target.closest('[data-start-tool-tutorial]');
  if (toolTutorialButton) { startToolTutorial(toolTutorialButton.dataset.startToolTutorial); return; }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { event.preventDefault(); navigate(viewButton.dataset.view); return; }

  const authButton = event.target.closest('[data-auth-mode]');
  if (authButton) { setAuthMode(authButton.dataset.authMode); return; }

  const nextButton = event.target.closest('[data-open-next]');
  if (nextButton?.dataset.openNext) { openChallenge(nextButton.dataset.openNext); return; }

  const openBlockButton = event.target.closest('[data-open-block]');
  if (openBlockButton) { ctfFilter = openBlockButton.dataset.openBlock; navigate('ctf'); return; }

  const claimBlockButton = event.target.closest('[data-claim-block]');
  if (claimBlockButton) { claimMissionBlockCheckpoint(claimBlockButton.dataset.claimBlock); return; }

  const viewBlockButton = event.target.closest('[data-view-block-checkpoint]');
  if (viewBlockButton) {
    const block = missionBlocks.find((item) => item.id === viewBlockButton.dataset.viewBlockCheckpoint);
    if (block) {
      const state = getBlockState(getState().profile, block);
      if (!state?.complete) showToast('CHECKPOINT BLOQUEADO', 'Conclua todas as missões deste bloco para abrir o relatório.', 'attention');
      else if (!state.claimed) elements.modalRoot.innerHTML = renderBlockCheckpointModal(block, getState().profile);
      else {
        persistProfile((draft) => { if (draft.missionBlocks?.[block.id]) draft.missionBlocks[block.id].reportViewedAt = Date.now(); return draft; }, { rerender: false, eventType: 'mission_block_checkpoint_viewed', details: { blockId: block.id } });
        elements.modalRoot.innerHTML = renderBlockCheckpointModal(block, getState().profile);
      }
    }
    return;
  }

  const narrativeEnterButton = event.target.closest('[data-narrative-enter]');
  if (narrativeEnterButton && activeChallengeUI.id) {
    patchMissionWorkspace(activeChallengeUI.id, { openingSeen: true }, { eventType: 'mission_narrative_opening_seen' });
    return;
  }

  const narrativeUpdateButton = event.target.closest('[data-narrative-update]');
  if (narrativeUpdateButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const updateId = String(narrativeUpdateButton.dataset.narrativeUpdate || '').slice(0, 120);
    const narrativeUpdatesViewed = [...new Set([...(current.workspace?.narrativeUpdatesViewed || []), updateId])];
    patchMissionWorkspace(missionId, { narrativeUpdatesViewed }, { eventType: 'mission_narrative_update_viewed' });
    return;
  }

  const workspaceDrawerButton = event.target.closest('[data-workspace-drawer]');
  if (workspaceDrawerButton && activeChallengeUI.id) {
    if (workspaceDrawerButton.getAttribute('aria-disabled') === 'true') {
      showToast('GAVETA AINDA BLOQUEADA', 'Continue a investigação e consulte os materiais já disponíveis.', 'attention');
      return;
    }
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const drawer = String(workspaceDrawerButton.dataset.workspaceDrawer || 'briefing').slice(0, 40);
    const openedDrawers = [...new Set([...(current.workspace?.openedDrawers || []), drawer])];
    patchMissionWorkspace(missionId, { activeDrawer: drawer, openedDrawers }, { eventType: 'mission_workspace_drawer_opened' });
    return;
  }

  const workspaceItemButton = event.target.closest('[data-workspace-item]');
  if (workspaceItemButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const itemId = String(workspaceItemButton.dataset.workspaceItem || '').slice(0, 120);
    const drawer = String(workspaceItemButton.dataset.workspaceItemDrawer || current.workspace?.activeDrawer || 'documents').slice(0, 40);
    const viewedItems = [...new Set([...(current.workspace?.viewedItems || []), itemId])];
    const openedDrawers = [...new Set([...(current.workspace?.openedDrawers || []), drawer])];
    patchMissionWorkspace(missionId, { activeDrawer: drawer, currentItemId: itemId, viewedItems, openedDrawers }, { eventType: 'mission_workspace_item_viewed' });
    return;
  }

  const workspaceEvidenceButton = event.target.closest('[data-workspace-evidence]');
  if (workspaceEvidenceButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const evidenceId = String(workspaceEvidenceButton.dataset.workspaceEvidence || '').slice(0, 160);
    const selected = new Set(current.workspace?.selectedEvidence || []);
    if (selected.has(evidenceId)) selected.delete(evidenceId); else selected.add(evidenceId);
    if (activeChallengeUI.session) activeChallengeUI.session.evidenceClicks = (activeChallengeUI.session.evidenceClicks || 0) + 1;
    patchMissionWorkspace(missionId, { selectedEvidence: [...selected] }, { eventType: 'mission_workspace_evidence_updated' });
    return;
  }

  const timelineMoveButton = event.target.closest('[data-timeline-move]');
  if (timelineMoveButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const eventId = String(timelineMoveButton.dataset.timelineMove || '').slice(0, 120);
    const direction = timelineMoveButton.dataset.direction === 'up' ? 'up' : 'down';
    const timelineOrder = getWorkspaceTimelineMove(missionId, current.workspace?.timelineOrder || [], eventId, direction);
    patchMissionWorkspace(missionId, { timelineOrder, timelineMoves: Math.max(0, Number(current.workspace?.timelineMoves) || 0) + 1 }, { eventType: 'mission_timeline_reordered' });
    return;
  }

  const decisionButton = event.target.closest('[data-workspace-decision]');
  if (decisionButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const decisionChoice = String(decisionButton.dataset.workspaceDecision || '').slice(0, 120);
    const decisionHistory = [...new Set([...(current.workspace?.decisionHistory || []), decisionChoice])];
    patchMissionWorkspace(missionId, { decisionChoice, decisionHistory }, { eventType: 'mission_decision_recorded' });
    return;
  }

  const helpLevelButton = event.target.closest('[data-help-level]');
  if (helpLevelButton && activeChallengeUI.id) {
    if (helpLevelButton.disabled) return;
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const levelId = String(helpLevelButton.dataset.helpLevel || '').slice(0, 120);
    const helpLevelsViewed = [...new Set([...(current.workspace?.helpLevelsViewed || []), levelId])];
    patchMissionWorkspace(missionId, { helpLevelsViewed }, { eventType: 'mission_adaptive_help_opened' });
    return;
  }

  const supportButton = event.target.closest('[data-workspace-support]');
  if (supportButton && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const current = getMissionDraft(getState().profile, missionId) || {};
    const reason = String(supportButton.dataset.workspaceSupport || 'apoio').slice(0, 80);
    const supportRequests = [...(current.workspace?.supportRequests || []), `${reason}|${Date.now()}`].slice(-40);
    patchMissionWorkspace(missionId, { supportRequests }, { rerender: false, eventType: 'mission_support_requested' });
    showToast('PEDIDO DE APOIO REGISTRADO', 'O registro ficou salvo neste dispositivo. Mostre esta tela ao professor para receber ajuda.', 'attention');
    return;
  }

  const trackButton = event.target.closest('[data-track]');
  if (trackButton) { ctfFilter = trackButton.dataset.track; navigate('ctf'); return; }

  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) { ctfFilter = filterButton.dataset.filter; renderCurrentView(); return; }

  const challengeButton = event.target.closest('[data-challenge]');
  if (challengeButton) { openChallenge(challengeButton.dataset.challenge); return; }

  const hintButton = event.target.closest('[data-use-hint]');
  if (hintButton) { await useHint(hintButton.dataset.useHint); return; }

  const localTestButton = event.target.closest('[data-run-local-test]');
  if (localTestButton) { await runLocalMissionTest(localTestButton.dataset.runLocalTest, localTestButton); return; }

  const evidenceButton = event.target.closest('[data-evidence-clue]');
  if (evidenceButton) {
    const pressed = evidenceButton.getAttribute('aria-pressed') === 'true';
    evidenceButton.setAttribute('aria-pressed', String(!pressed));
    evidenceButton.classList.toggle('selected', !pressed);
    const board = evidenceButton.closest('[data-evidence-board]');
    if (activeChallengeUI.session) activeChallengeUI.session.evidenceClicks = (activeChallengeUI.session.evidenceClicks || 0) + 1;
    const selectedCount = board?.querySelectorAll('.evidence-chip.selected').length || 0;
    const total = board?.querySelectorAll('.evidence-chip').length || 0;
    const counter = board?.querySelector('.evidence-counter');
    if (counter) counter.textContent = `${selectedCount}/${total} pistas marcadas`;
    const form = evidenceButton.closest('.challenge-modal')?.querySelector('#challenge-form');
    if (form) saveMissionDraftFromForm(form, { immediate: true, eventType: 'mission_evidence_updated' });
    return;
  }

  const tutorialButton = event.target.closest('[data-toggle-tutorial]');
  if (tutorialButton) {
    activeChallengeUI.tutorialVisible = !activeChallengeUI.tutorialVisible;
    const challenge = getChallenge(tutorialButton.dataset.toggleTutorial);
    if (challenge) elements.modalRoot.innerHTML = renderChallengeModal(challenge, getState().profile, activeChallengeUI.result, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
    return;
  }

  const openDrawerButton = event.target.closest('[data-open-tools-drawer]');
  if (openDrawerButton) { openToolsDrawer(openDrawerButton.dataset.openToolsDrawer || activeTool); return; }

  const drawerToolButton = event.target.closest('[data-drawer-tool]');
  if (drawerToolButton) { renderToolsDrawer(drawerToolButton.dataset.drawerTool); return; }

  const lessonButton = event.target.closest('[data-lesson]');
  if (lessonButton) { await openLesson(lessonButton.dataset.lesson); return; }

  const completeLessonButton = event.target.closest('[data-complete-lesson]');
  if (completeLessonButton) { await completeLesson(completeLessonButton.dataset.completeLesson); return; }

  const vulnerabilityButton = event.target.closest('[data-vulnerability]');
  if (vulnerabilityButton) {
    const item = getVulnerability(vulnerabilityButton.dataset.vulnerability);
    if (item) {
      activeChallengeUI = { id: null, result: null, showHint: false, tutorialVisible: false };
      activeLessonId = null;
      activeVulnerabilityId = item.id;
      elements.modalRoot.innerHTML = renderVulnerabilityModal(item, getState().profile);
    }
    return;
  }

  const intelFilterButton = event.target.closest('[data-intel-filter]');
  if (intelFilterButton) { intelFilter = intelFilterButton.dataset.intelFilter; renderCurrentView(); return; }

  if (event.target.closest('[data-toggle-explanation]')) { toggleExplanationMode(); return; }
  if (event.target.closest('[data-toggle-sound]')) { toggleSound(); return; }
  if (event.target.closest('[data-toggle-motion]')) { toggleMotion(); return; }
  if (event.target.closest('[data-toggle-contrast]')) { persistProfile((draft) => { draft.settings.highContrast = !draft.settings.highContrast; return draft; }); showToast('ALTO CONTRASTE', getState().profile.settings.highContrast ? 'Ativado.' : 'Desativado.'); return; }
  if (event.target.closest('[data-toggle-particles]')) { persistProfile((draft) => { draft.settings.reducedParticles = !draft.settings.reducedParticles; return draft; }); showToast('PARTÍCULAS', getState().profile.settings.reducedParticles ? 'Reduzidas para melhorar desempenho.' : 'Animações completas ativadas.'); return; }
  if (event.target.closest('[data-cycle-quality]')) { const order = ['auto','low','medium','high','ultra']; persistProfile((draft) => { const current = order.indexOf(draft.settings.qualityPreset || 'auto'); draft.settings.qualityPreset = order[(current + 1) % order.length]; return draft; }); applyTheme(getState().profile); showToast('QUALIDADE GRÁFICA', getState().profile.settings.qualityPreset.toUpperCase()); return; }
  if (event.target.closest('[data-toggle-landscape-3d]')) { persistProfile((draft) => { draft.settings.preferLandscape3d = draft.settings.preferLandscape3d === false; return draft; }); applyTheme(getState().profile); showToast('ORIENTAÇÃO 3D', getState().profile.settings.preferLandscape3d ? 'O modo imersivo tentará usar paisagem.' : 'A orientação atual será preservada.'); return; }
  if (event.target.closest('[data-toggle-auto-fallback-3d]')) { persistProfile((draft) => { draft.settings.autoFallback3d = draft.settings.autoFallback3d === false; return draft; }); applyTheme(getState().profile); showToast('FALLBACK 3D', getState().profile.settings.autoFallback3d ? 'Modo 2D automático ativado.' : 'Fallback automático desativado; ainda pode ser escolhido manualmente.'); return; }
  if (event.target.closest('[data-toggle-focus-mode]')) { persistProfile((draft) => { draft.settings.focusMode = !draft.settings.focusMode; return draft; }); showToast('MODO FOCO', getState().profile.settings.focusMode ? 'Elementos secundários reduzidos.' : 'Interface completa restaurada.'); return; }
  if (event.target.closest('[data-toggle-schedule-notifications]')) {
    persistProfile((draft) => { draft.settings.scheduleNotifications = draft.settings.scheduleNotifications === false; return draft; });
    updateScheduleContext({ notify: false });
    showToast('LEMBRETES DE HORÁRIO', getState().profile.settings.scheduleNotifications ? 'Ativados.' : 'Desativados. Alertas críticos de perda de progresso continuam disponíveis.');
    return;
  }
  if (event.target.closest('[data-toggle-remaining-time]')) {
    persistProfile((draft) => { draft.settings.showRemainingTime = draft.settings.showRemainingTime === false; return draft; });
    updateScheduleContext({ notify: false });
    return;
  }
  if (event.target.closest('[data-toggle-tutorial-autoplay]')) {
    persistProfile((draft) => { draft.settings.tutorialAutoPlay = draft.settings.tutorialAutoPlay === false; return draft; });
    showToast('TUTORIAL AUTOMÁTICO', getState().profile.settings.tutorialAutoPlay ? 'Ativado para as primeiras missões ainda não assistidas.' : 'Desativado. Os guias continuam disponíveis manualmente.');
    return;
  }

  const moveSequenceButton = event.target.closest('[data-move-sequence]');
  if (moveSequenceButton) {
    const item = moveSequenceButton.closest('[data-sequence-item]');
    const list = item?.parentElement;
    if (item && list) {
      if (moveSequenceButton.dataset.moveSequence === 'up' && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
      if (moveSequenceButton.dataset.moveSequence === 'down' && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
      [...list.children].forEach((row, index) => { const marker = row.querySelector('.sequence-index'); if (marker) marker.textContent = index + 1; });
      const form = list.closest('#challenge-form');
      if (form) saveMissionDraftFromForm(form, { immediate: true, eventType: 'mission_sequence_updated' });
    }
    return;
  }

  const toolButton = event.target.closest('[data-tool]');
  if (toolButton) {
    activeTool = toolButton.dataset.tool;
    $$('.tool-tab').forEach((button) => button.classList.toggle('active', button.dataset.tool === activeTool));
    const workspace = $('[data-tool-workspace]');
    if (workspace) {
      disposeImmersiveWorkspaces(workspace);
      workspace.innerHTML = renderToolWorkspace(activeTool, { missionId: activeChallengeUI.id || '', profile: getState().profile, draft: activeChallengeUI.id ? getMissionDraft(getState().profile, activeChallengeUI.id) : null });
      mountImmersiveWorkspaces(workspace);
    }
    return;
  }

  const careerButton = event.target.closest('[data-career-goal]');
  if (careerButton) {
    const goal = careerButton.dataset.careerGoal;
    persistProfile((draft) => { draft.careerGoal = goal; addBadge(draft, 'Rota Profissional'); return draft; });
    showToast('ROTA PROFISSIONAL DEFINIDA', 'Seu objetivo foi salvo no perfil local.');
    return;
  }

  const storeFilterButton = event.target.closest('[data-store-filter]');
  if (storeFilterButton) { storeFilter = storeFilterButton.dataset.storeFilter; renderCurrentView(); return; }

  const storeItemButton = event.target.closest('[data-store-item]');
  if (storeItemButton) { await handleStoreItem(storeItemButton.dataset.storeItem); return; }

  if (event.target.closest('[data-export-progress]')) { exportProgress(); return; }
  if (event.target.closest('[data-logout]')) { logout(); return; }
  if (event.target.closest('[data-reset-progress]')) { resetProgress(); return; }
  if (event.target.closest('[data-close-modal]') || event.target.matches('[data-modal-close="true"]')) { closeModal(); }
});

document.addEventListener('submit', async (event) => {
  if (event.target.matches('[data-bug-report-form]')) {
    event.preventDefault();
    const form = event.target; if (!form.reportValidity()) return;
    const profile = getState().profile;
    const report = {
      schema: 'ctfds-bug-report-v1', reportId: uid(), createdAt: new Date().toISOString(),
      platform: { id: 'ctfds', version: platformConfig.version },
      module: sanitizePlainText(form.elements.module.value, 80),
      description: sanitizePlainText(form.elements.description.value, 1200),
      steps: sanitizePlainText(form.elements.steps.value, 1600),
      expected: sanitizePlainText(form.elements.expected.value, 800),
      context: { className: form.elements.includeClass.checked ? sanitizePlainText(profile?.className || '', 60) : '', viewport: `${window.innerWidth}x${window.innerHeight}`, language: navigator.language || '', userAgent: sanitizePlainText(navigator.userAgent || '', 400) },
      privacy: 'Gerado localmente; sem envio automático, senha, respostas ou nome do aluno.'
    };
    downloadJson(`relato-bug-ctfds-${new Date().toISOString().slice(0,10)}.json`, report);
    if (profile && !profile._ephemeral) await saveProfile(profile, 'bug_report_exported', { module: report.module, reportId: report.reportId });
    closeModal({ force: true }); showToast('RELATO GERADO', 'Envie o arquivo ao professor pelo canal indicado.'); return;
  }
  if (event.target.matches('[data-terms-accept-form]')) {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    persistProfile((draft) => { registerTermsAcceptance(draft, { fullTermsOpened: termsFullOpened, privacyNoticeViewed: privacyViewed, deviceSessionId: getSession()?.createdAt ? String(getSession().createdAt) : '' }); return draft; }, { rerender: false, eventType: 'terms_accepted', details: { termsVersion: TERMS_VERSION } });
    requiredModal = '';
    closeModal({ force: true });
    showToast('COMPROMISSO REGISTRADO', 'A plataforma foi liberada para atividades no escopo autorizado.');
    showReleaseThanks();
    return;
  }
  if (event.target.matches('[data-eduauth-pin-form]')) {
    event.preventDefault();
    const form = event.target; const feedback = $('[data-eduauth-feedback]', elements.modalRoot);
    const reason = $('[data-eduauth-reason]', elements.modalRoot)?.value?.trim() || '';
    if (pendingEduAuth?.action?.requireReason && reason.length < 4) { if (feedback) feedback.textContent = 'Registre o motivo desta autorização antes de validar.'; $('[data-eduauth-reason]', elements.modalRoot)?.focus(); return; }
    if (!pendingEduAuth?.request) { if (feedback) feedback.textContent = 'Solicitação não encontrada. Gere um novo código-base.'; return; }
    const submit = form.querySelector('button[type="submit"]'); if (submit) submit.disabled = true;
    if (feedback) feedback.textContent = 'Validando o código, a sessão e o recurso solicitado…';
    try {
      const result = await validateEduAuthPin({ actionId: pendingEduAuth.actionId, request: pendingEduAuth.request, pin: form.elements.pin.value, resourceId: pendingEduAuth.resourceId });
      if (!result.valid) {
        const attempts = result.attempts?.attempts || 0; const counter = $('[data-eduauth-attempts]', elements.modalRoot); if (counter) counter.textContent = `${attempts}/5`;
        if (feedback) feedback.textContent = result.reason === 'delay' ? 'Aguarde alguns segundos antes de tentar novamente.' : 'Código inválido, expirado ou pertencente a outra solicitação.';
        form.elements.pin.value = ''; form.elements.pin.focus(); return;
      }
      if (feedback) feedback.textContent = `Autorização confirmada somente para: ${pendingEduAuth.action.label}.`;
      await new Promise((resolve) => setTimeout(resolve, 450));
      await recordEduAuthEvent({ platform: 'ctfds', mode: pendingEduAuth.action.preferredMode, risk: pendingEduAuth.action.risk, actionId: pendingEduAuth.actionId, resourceId: pendingEduAuth.resourceId, result: 'applied', reason });
      await completeEduAuthAuthorization({ mode: pendingEduAuth.action.preferredMode, grant: result.grant || null, reason });
    } finally { if (submit?.isConnected) submit.disabled = false; }
    return;
  }
  if (event.target.matches('[data-eduauth-signed-form]')) {
    event.preventDefault();
    const form = event.target; const feedback = $('[data-eduauth-feedback]', elements.modalRoot);
    const reason = $('[data-eduauth-reason]', elements.modalRoot)?.value?.trim() || '';
    if (pendingEduAuth?.action?.requireReason && reason.length < 4) { if (feedback) feedback.textContent = 'Registre o motivo desta autorização antes de validar.'; $('[data-eduauth-reason]', elements.modalRoot)?.focus(); return; }
    if (feedback) feedback.textContent = 'Verificando assinatura, expiração e escopo da autorização…';
    const expectedGrant = {
      actionId: pendingEduAuth?.actionId || form.elements.actionId.value,
      resourceId: pendingEduAuth?.resourceId || form.elements.resourceId.value,
    };
    const requestContext = pendingEduAuth?.request?.context;
    if (requestContext?.requestIdTag) expectedGrant.requestIdTag = requestContext.requestIdTag;
    if (requestContext?.sessionIdTag) expectedGrant.sessionIdTag = requestContext.sessionIdTag;
    const result = await verifySignedGrant(form.elements.token.value, expectedGrant);
    if (!result.valid) { if (feedback) feedback.textContent = `Não foi possível validar esta autorização. ${result.error}`; return; }
    if (feedback) feedback.textContent = `Autorização assinada confirmada somente para: ${pendingEduAuth.action.label}.`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    await recordEduAuthEvent({ platform: 'ctfds', mode: 'SIGNED_GRANT', risk: pendingEduAuth.action.risk, actionId: pendingEduAuth.actionId, resourceId: pendingEduAuth.resourceId, result: 'applied', reason: result.payload.reason || reason });
    await completeEduAuthAuthorization({ mode: 'SIGNED_GRANT', payload: result.payload, reason: result.payload.reason || reason });
    return;
  }
  if (event.target.matches('[data-change-password-form]')) {
    event.preventDefault();
    const form = event.target;
    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.newPassword.value;
    if (newPassword !== form.elements.newPasswordConfirm.value) { showToast('SENHAS DIFERENTES', 'A confirmação da nova senha não corresponde.', 'attention'); return; }
    try {
      await changeStudentPassword(getState().profile.accountId, currentPassword, newPassword);
      closeModal();
      showToast('SENHA ATUALIZADA', 'O perfil foi protegido novamente e o progresso foi preservado.');
    } catch (error) { showToast('ALTERAÇÃO RECUSADA', error.message, 'attention'); }
    return;
  }
  if (event.target.matches('[data-change-identity-form]')) {
    event.preventDefault();
    const form = event.target;
    try {
      const updated = await changeProfileIdentity(getState().profile.accountId, form.elements.password.value, form.elements.studentName.value, form.elements.className.value, form.elements.reason.value);
      const normalized = normalizeProfile(updated, updated.accountId, updated.studentName, updated.className);
      setState({ profile: normalized });
      renderProfileChip(normalized);
      updateScheduleContext({ notify: false });
      closeModal();
      renderCurrentView();
      showToast('IDENTIDADE ATUALIZADA', 'Nome e turma foram corrigidos sem alterar o identificador ou o progresso.');
    } catch (error) { showToast('CORREÇÃO RECUSADA', error.message, 'attention'); }
    return;
  }
  if (event.target.matches('[data-create-recovery-kit]')) {
    event.preventDefault();
    const form = event.target;
    const values = {
      teacherLabel: form.elements.teacherLabel.value,
      masterPassword: form.elements.masterPassword.value,
      confirmation: form.elements.masterPasswordConfirm.value,
    };
    if (values.masterPassword !== values.confirmation) { showToast('FRASES-SENHA DIFERENTES', 'Confira a confirmação.', 'attention'); return; }
    await openEduAuthAuthorization('recovery-setup', 'teacher-recovery-key', async () => {
      try {
        const kit = await createTeacherRecoveryKit(values.masterPassword, values.teacherLabel);
        downloadRecoveryKit(kit);
        const activeProfile = getState().profile;
        if (activeProfile && !activeProfile._ephemeral) await saveProfile(activeProfile, 'recovery_enabled', { keyId: kit.keyId, authorization: 'eduauth' });
        showToast('CHAVE ADMINISTRATIVA GERADA', 'Guarde o arquivo e a frase-senha em locais separados. Perfis serão protegidos ao serem desbloqueados e salvos.');
        await openTeacherMode();
      } catch (error) { showToast('CONFIGURAÇÃO RECUSADA', error.message, 'attention'); }
    });
    return;
  }
  if (event.target.matches('[data-recover-student-password]')) {
    event.preventDefault();
    const form = event.target;
    const values = {
      accountId: form.elements.accountId.value,
      newPassword: form.elements.newPassword.value,
      masterPassword: form.elements.masterPassword.value,
      reason: form.elements.reason.value,
      adminId: form.elements.adminId.value,
      kitFile: form.elements.kitFile.files?.[0],
    };
    await openEduAuthAuthorization('profile-recovery', `profile:${values.accountId}`, async () => {
      try {
        const kit = await readJsonFile(values.kitFile);
        const result = await recoverStudentPassword({ accountId: values.accountId, newPassword: values.newPassword, masterPassword: values.masterPassword, kit, reason: values.reason, adminId: values.adminId });
        await refreshSavedProfiles();
        elements.authError.textContent = `Senha redefinida com autorização administrativa para ${result.displayName} · ${result.className}.`;
        showToast('ACESSO RECUPERADO', 'A senha antiga deixou de funcionar e o progresso foi preservado.');
        await openTeacherMode();
      } catch (error) {
        showToast('RECUPERAÇÃO RECUSADA', error.message, 'attention');
      }
    }, { modeOverride: 'PROFILE_RECOVERY_ENVELOPE' });
    return;
  }
  if (event.target.matches('#challenge-form')) {
    event.preventDefault();
    await submitChallenge(event.target);
    return;
  }
  if (event.target.matches('[data-tool-form]')) {
    event.preventDefault();
    if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
    const form = event.target;
    const output = $('[data-tool-output]', form.parentElement);
    try {
      output.textContent = await runTool(form.dataset.toolForm, new FormData(form));
      if (activeChallengeUI.id && activeChallengeUI.session) {
        activeChallengeUI.session.toolRuns = (activeChallengeUI.session.toolRuns || 0) + 1;
        const current = getMissionDraft(getState().profile, activeChallengeUI.id) || {};
        saveMissionDraftSnapshot(activeChallengeUI.id, { ...current, toolRuns: activeChallengeUI.session.toolRuns, lastToolId: form.dataset.toolForm }, { immediate: true, eventType: 'mission_tool_used' });
        if (hasInvestigativeCase(activeChallengeUI.id) && isSimulationTool(form.dataset.toolForm)) {
          const simulatorHistory = [
            ...(current.workspace?.simulatorHistory || []),
            { toolId: form.dataset.toolForm, action: String(new FormData(form).get('action') || 'inspect').slice(0, 80), at: Date.now() },
          ].slice(-40);
          patchMissionWorkspace(activeChallengeUI.id, { simulatorHistory, lastSimulatorId: form.dataset.toolForm }, { rerender: false, eventType: 'mission_simulator_used' });
        }
      }
      if (getState().profile?.core?.authority === 'agv-core') {
        try {
          const coreTool = await recordCoreToolUse(form.dataset.toolForm, uid());
          applyCoreActionResult(coreTool, { eventType: 'core_tool_used', details: { toolId: form.dataset.toolForm } });
          if (coreTool.daily?.complete && coreTool.daily?.claimed && !coreTool.daily?.reward?.duplicate) showToast('PROTOCOLO DIÁRIO COMPLETO', 'Bônus diário validado pelo AGV Education Core.');
        } catch (error) { showToast('USO LOCAL REGISTRADO', `A ferramenta funcionou, mas o Core não registrou o diário: ${error.message}`, 'attention'); }
      } else {
        let dailyBonus = false;
        persistProfile((draft) => { dailyBonus = recordDailyAction(draft, 'tools'); return draft; }, { rerender: false });
        if (dailyBonus) showToast('PROTOCOLO DIÁRIO COMPLETO', '+50 Cyber Coins liberadas por combinar missão, aula e ferramenta.');
      }
    } catch (error) {
      output.textContent = `ERRO: ${error.message || 'Não foi possível processar os dados.'}`;
    }
  }
});

document.addEventListener('change', async (event) => {
  if (event.target.matches('select[data-evidence-annotation]')) {
    event.target.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  const challengeForm = event.target.closest?.('#challenge-form');
  if (challengeForm) saveMissionDraftFromForm(challengeForm, { immediate: true, eventType: 'mission_draft_changed' });
  if (event.target.matches('[data-import-progress]')) { await importProgress(event.target.files?.[0]); event.target.value = ''; return; }
  if (event.target.matches('#auth-import-profile')) { await importProgress(event.target.files?.[0], { fromAuth: true }); event.target.value = ''; return; }
  if (event.target.matches('[data-install-recovery-kit]')) {
    const file = event.target.files?.[0];
    await openEduAuthAuthorization('recovery-setup', 'teacher-recovery-key', async () => {
      try {
        const kit = await readJsonFile(file);
        await installRecoveryPublicKey(kit);
        showToast('CHAVE PÚBLICA INSTALADA', 'Perfis desbloqueados e salvos a partir de agora poderão usar recuperação administrativa.');
        await openTeacherMode();
      } catch (error) { showToast('ARQUIVO RECUSADO', error.message, 'attention'); }
    });
    return;
  }
  if (event.target.matches('[data-delivery-check]')) {
    const key = event.target.dataset.deliveryCheck;
    persistProfile((draft) => {
      draft.delivery ||= { checks: {}, receipts: [] };
      draft.delivery.checks ||= {};
      draft.delivery.checks[key] = event.target.checked;
      if (key === 'submitted' && event.target.checked) draft.delivery.declaredSubmittedAt = Date.now();
      return draft;
    }, { rerender: false, eventType: key === 'submitted' && event.target.checked ? 'delivery_declared' : 'delivery_check_updated', details: { key, checked: event.target.checked } });
    return;
  }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-mission-search]')) {
    ctfQuery = event.target.value.slice(0, 120);
    clearTimeout(event.target._missionSearchTimer);
    event.target._missionSearchTimer = setTimeout(() => {
      const position = event.target.selectionStart;
      renderCurrentView();
      const next = document.querySelector('[data-mission-search]');
      next?.focus();
      next?.setSelectionRange(position, position);
    }, 180);
    return;
  }
  if (event.target.matches('[data-intel-search]')) {
    intelQuery = event.target.value;
    clearTimeout(event.target._intelTimer);
    event.target._intelTimer = setTimeout(() => {
      const position = event.target.selectionStart;
      renderCurrentView();
      const next = document.querySelector('[data-intel-search]');
      next?.focus();
      next?.setSelectionRange(position, position);
    }, 180);
    return;
  }
  if (event.target.matches('[data-evidence-annotation]') && activeChallengeUI.id) {
    const missionId = activeChallengeUI.id;
    const evidenceId = String(event.target.dataset.evidenceAnnotation || '').slice(0, 160);
    const field = String(event.target.dataset.annotationField || '').slice(0, 40);
    if (!['note', 'confidence', 'relation'].includes(field)) return;
    clearTimeout(event.target._evidenceTimer);
    event.target._evidenceTimer = setTimeout(() => {
      const current = getMissionDraft(getState().profile, missionId) || {};
      const evidenceAnnotations = structuredClone(current.workspace?.evidenceAnnotations || {});
      const previousAnnotation = evidenceAnnotations[evidenceId] || {};
      evidenceAnnotations[evidenceId] = { ...previousAnnotation, [field]: String(event.target.value || '').slice(0, field === 'note' ? 1200 : 40), updatedAt: Date.now() };
      patchMissionWorkspace(missionId, { evidenceAnnotations }, { rerender: false, eventType: 'mission_evidence_annotation_saved' });
      const status = elements.modalRoot?.querySelector('.evidence-wall header small');
      if (status) status.textContent = 'Análise da evidência salva · agora';
    }, field === 'note' ? 360 : 80);
    return;
  }

  if (event.target.matches('[data-workspace-field]') && activeChallengeUI.id) {
    const field = event.target.dataset.workspaceField;
    if (!['hypothesis', 'timelineNotes', 'recommendation', 'conclusion'].includes(field)) return;
    clearTimeout(event.target._workspaceTimer);
    event.target._workspaceTimer = setTimeout(() => {
      patchMissionWorkspace(activeChallengeUI.id, { [field]: event.target.value.slice(0, 5000) }, { rerender: false, eventType: 'mission_workspace_analysis_saved' });
      const status = elements.modalRoot?.querySelector('.analysis-workspace header small');
      if (status) status.textContent = 'Análise protegida no perfil · agora';
    }, 380);
    return;
  }
  const challengeForm = event.target.closest?.('#challenge-form');
  if (challengeForm && !event.target.matches('[data-mission-notes]')) {
    saveMissionDraftFromForm(challengeForm);
  }
  if (event.target.matches('[data-mission-notes]')) {
    const id = event.target.dataset.missionNotes;
    const status = event.target.closest('.mission-notebook')?.querySelector('[data-notes-status]');
    if (status) status.textContent = 'salvando...';
    clearTimeout(event.target._notesTimer);
    event.target._notesTimer = setTimeout(() => {
      persistProfile((draft) => { draft.missionNotes[id] = event.target.value.slice(0, 4000); return draft; }, { rerender: false });
      if (status) status.textContent = 'anotações salvas localmente';
    }, 350);
  }
});

let draggedSequenceItem = null;

document.addEventListener('ctfds:immersive-action', async (event) => {
  const detail = event.detail || {};
  if (!detail.toolId || !isImmersiveTool(detail.toolId)) return;
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  if (activeChallengeUI.id) {
    const current = getMissionDraft(getState().profile, activeChallengeUI.id) || {};
    const immersiveHistory = [
      ...(current.workspace?.immersiveHistory || []),
      { toolId: String(detail.toolId).slice(0, 80), sceneId: String(detail.sceneId || '').slice(0, 80), action: String(detail.action || 'scan').slice(0, 80), quality: String(detail.quality || 'auto').slice(0, 20), fallback: Boolean(detail.fallback), fps: Math.max(0, Math.round(Number(detail.fps) || 0)), scale: Math.max(0, Number(detail.scale) || 0), orientation: ['portrait','landscape'].includes(detail.orientation) ? detail.orientation : '', at: Number(detail.at) || Date.now() },
    ].slice(-60);
    const usedTools = [...new Set([...(current.workspace?.usedTools || []), detail.toolId])];
    saveMissionDraftSnapshot(activeChallengeUI.id, { ...current, lastToolId: detail.toolId, toolRuns: (current.toolRuns || 0) + 1 }, { immediate: true, eventType: 'mission_immersive_tool_used' });
    patchMissionWorkspace(activeChallengeUI.id, { immersiveHistory, lastImmersiveId: detail.toolId, usedTools }, { rerender: false, eventType: 'mission_immersive_action' });
  }
  let dailyBonus = false;
  if (getState().profile?.core?.authority === 'agv-core') {
    try {
      const coreTool = await recordCoreToolUse(detail.toolId, uid());
      applyCoreActionResult(coreTool, { eventType: 'core_immersive_tool_used', details: { toolId: detail.toolId, action: detail.action } });
      dailyBonus = Boolean(coreTool.daily?.complete && coreTool.daily?.claimed && !coreTool.daily?.reward?.duplicate);
    } catch (error) { showToast('AÇÃO 3D LOCAL REGISTRADA', `O Core não confirmou o diário: ${error.message}`, 'attention'); }
  } else {
    persistProfile((draft) => { dailyBonus = recordDailyAction(draft, 'tools'); return draft; }, { rerender: false, eventType: 'immersive_action', details: { toolId: detail.toolId, action: detail.action, quality: detail.quality, fallback: detail.fallback, fps: detail.fps, scale: detail.scale, orientation: detail.orientation } });
  }
  const report = immersiveActionReport(detail);
  showToast('AMBIENTE 3D/360 ATUALIZADO', report.split('\n')[1] || 'Ação registrada no laboratório local.');
  if (dailyBonus) showToast('PROTOCOLO DIÁRIO COMPLETO', getState().profile?.core?.authority === 'agv-core' ? 'Bônus diário validado pelo AGV Education Core.' : '+50 Cyber Coins liberadas por combinar missão, aula e ferramenta.');
});

document.addEventListener('dragstart', (event) => {
  const item = event.target.closest?.('[data-sequence-item]');
  if (!item) return;
  draggedSequenceItem = item;
  item.classList.add('dragging');
  event.dataTransfer?.setData('text/plain', item.dataset.sequenceItem);
});
document.addEventListener('dragover', (event) => {
  const target = event.target.closest?.('[data-sequence-item]');
  if (!draggedSequenceItem || !target || target === draggedSequenceItem) return;
  event.preventDefault();
  const rect = target.getBoundingClientRect();
  target.parentElement.insertBefore(draggedSequenceItem, event.clientY < rect.top + rect.height / 2 ? target : target.nextElementSibling);
});
document.addEventListener('dragend', () => {
  if (!draggedSequenceItem) return;
  const list = draggedSequenceItem.parentElement;
  draggedSequenceItem.classList.remove('dragging');
  [...list.children].forEach((row, index) => { const marker = row.querySelector('.sequence-index'); if (marker) marker.textContent = index + 1; });
  const form = list.closest('#challenge-form');
  if (form) saveMissionDraftFromForm(form, { immediate: true, eventType: 'mission_sequence_updated' });
  draggedSequenceItem = null;
});

elements.explainModeToggle?.addEventListener('click', toggleExplanationMode);
elements.tutorialCenterToggle?.addEventListener('click', openTutorialHub);
elements.activeToolTutorial?.addEventListener('click', () => startToolTutorial(activeTool));
elements.tutorialAutoplaySetting?.addEventListener('change', () => {
  persistProfile((draft) => { draft.settings.tutorialAutoPlay = elements.tutorialAutoplaySetting.checked; return draft; }, { rerender: false });
  showToast('PREFERÊNCIA SALVA', elements.tutorialAutoplaySetting.checked ? 'Tutoriais automáticos ativados.' : 'Tutoriais automáticos desativados.');
});
bindGuidedTourControls();

elements.authForm.addEventListener('submit', handleAuth);
elements.skipBoot.addEventListener('click', finishBoot);
elements.mobileMenu.addEventListener('click', () => {
  closeToolsDrawer();
  elements.sidebar.classList.toggle('open');
});
elements.toolsDrawerToggle.addEventListener('click', () => openToolsDrawer(activeChallengeUI.id ? (getChallenge(activeChallengeUI.id)?.tutorial?.toolId || activeTool) : activeTool));
elements.toolsDrawerClose.addEventListener('click', closeToolsDrawer);
elements.toolsDrawerBackdrop.addEventListener('click', closeToolsDrawer);
elements.terminalToggle.addEventListener('click', () => {
  elements.terminalDrawer.classList.add('open');
  elements.terminalDrawer.setAttribute('aria-hidden', 'false');
  elements.terminalInput.focus();
});
elements.terminalClose.addEventListener('click', () => {
  elements.terminalDrawer.classList.remove('open');
  elements.terminalDrawer.setAttribute('aria-hidden', 'true');
});
elements.terminalForm.addEventListener('submit', handleTerminal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    stopGuidedTour('skipped');
    closeTutorialHub();
    closeModal();
    elements.terminalDrawer.classList.remove('open');
    elements.terminalDrawer.setAttribute('aria-hidden', 'true');
    elements.sidebar.classList.remove('open');
    closeToolsDrawer();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    const form = document.querySelector('#challenge-form');
    if (form) { event.preventDefault(); form.requestSubmit(); }
  }
  if (event.key === '`' && !/input|textarea|select/i.test(event.target.tagName)) {
    event.preventDefault();
    elements.terminalDrawer.classList.toggle('open');
    elements.terminalDrawer.setAttribute('aria-hidden', elements.terminalDrawer.classList.contains('open') ? 'false' : 'true');
    if (elements.terminalDrawer.classList.contains('open')) elements.terminalInput.focus();
  }
});

['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => document.addEventListener(eventName, resetIdleTimer, { passive: true }));
elements.profileChip?.setAttribute('role', 'button');
elements.profileChip?.setAttribute('tabindex', '0');
elements.profileChip?.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate('profile'); } });
setInterval(() => { if (getState().profile) updateScheduleContext({ notify: true }); }, 60000);

const updateSystemClock = () => {
  if (elements.systemClock) elements.systemClock.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
};
updateSystemClock();
setInterval(updateSystemClock, 1000);
setInterval(updateActiveMissionTime, 1000);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return;
  flushActiveMissionTime({ force: true });
  checkpointActiveMission({ immediate: true });
  const profile = getState().profile;
  if (profile && !profile._ephemeral) void saveProfile(profile, 'visibility_checkpoint', { activeChallengeId: activeChallengeUI.id || '' }).catch(() => {});
});
window.addEventListener('pagehide', () => {
  flushActiveMissionTime({ force: true });
  checkpointActiveMission({ immediate: true });
  const profile = getState().profile;
  if (profile && !profile._ephemeral) void saveProfile(profile, 'pagehide_checkpoint', { activeChallengeId: activeChallengeUI.id || '' }).catch(() => {});
});

startMatrix(elements.matrix, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
runBoot();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    updateManager.register().then(() => updateManager.scheduleChecks()).catch(() => {});
  });
}

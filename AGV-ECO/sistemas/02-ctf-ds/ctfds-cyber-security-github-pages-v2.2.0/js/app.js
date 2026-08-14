import { getState, setState, updateProfile, createDefaultProfile, normalizeProfile } from './core/state.js';
import {
  registerLocalAccount, authenticateLocalAccount, authenticateAccountById, createSession, getSession, clearSession, lockProfile, touchSession,
  loadProfile, saveProfile, removeProfile, listLocalProfiles, exportLocalData, importLocalData, changeStudentPassword,
  requestPersistentStorage, getStorageStatus, changeProfileIdentity, getRecoveryStatus, createTeacherRecoveryKit, installRecoveryPublicKey, recoverStudentPassword, verifyAuditChain,
} from './core/storage.js';
import { downloadJson, downloadText, sanitizeFilename, escapeHtml, safeExternalUrl, sanitizePlainText, uid } from './core/utils.js';
import { awardToProfile, spendXp, grantBadge, purchaseStoreItem, getWalletSummary, reconcileProfileState } from './core/wallet.js';
import { hasRequiredAcceptances, registerTermsAcceptance, TERMS_FULL_TEXT, TERMS_VERSION } from './data/terms.js';
import { challenges, getChallenge } from './data/challenges.js';
import { getLesson } from './data/lessons.js';
import { getStoreItem } from './data/store-items.js';
import { getVulnerability } from './data/intel.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderCTF, renderChallengeModal, getHintCost, getMissionThemeColors } from './modules/ctf.js';
import { renderAcademy, renderLessonModal } from './modules/academy.js';
import { renderTools, renderToolWorkspace, runTool, toolCatalog } from './modules/tools.js';
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
import { renderTermsGate } from './modules/terms.js';
import { platformConfig } from './config/platform-config.js';
import {
  buildEduAuthRequest, validateEduAuthPin, renderAuthorizationModal, renderQrToCanvas, copyRequestCode, speakRequestCode,
  verifySignedGrant, eduauthIsProductionProvisioned, recordEduAuthEvent, findEduAuthAction,
} from './eduauth/index.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  boot: $('#boot-screen'), bootLine: $('#boot-line'), bootProgress: $('#boot-progress'), skipBoot: $('#skip-boot'),
  authModal: $('#auth-modal'), authForm: $('#auth-form'), authStudentName: $('#auth-student-name'), authClassName: $('#auth-class-name'), authPassword: $('#auth-password'), authError: $('#auth-error'), authLabel: $('#auth-submit-label'), savedProfileList: $('#saved-profile-list'), temporarySession: $('#temporary-session'), authImportProfile: $('#auth-import-profile'), teacherMode: $('#teacher-mode'),
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
let ctfFilter = 'available';
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
const RELEASE_ID = 'ctfds-2.2.0-security-wallet';
const IDLE_LOCK_MS = platformConfig.profile.idleLockMinutes * 60 * 1000;

const titleForLevel = (level) => {
  if (level >= 8) return 'Especialista Zero Trust';
  if (level >= 6) return 'Operador Sênior';
  if (level >= 4) return 'Analista de Segurança';
  if (level >= 2) return 'Trainee Júnior';
  return 'Recruta Digital';
};

const addBadge = (profile, badge, sourceId = '') => grantBadge(profile, badge, sourceId);

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

const applyTheme = (profile) => {
  document.documentElement.dataset.theme = profile?.equipped?.theme || 'theme-neon';
  document.documentElement.dataset.reducedMotion = profile?.settings?.reducedMotion ? 'true' : 'false';
  document.documentElement.dataset.reducedParticles = profile?.settings?.reducedParticles ? 'true' : 'false';
  document.documentElement.dataset.highContrast = profile?.settings?.highContrast ? 'true' : 'false';
  document.documentElement.dataset.quality = profile?.settings?.qualityPreset || 'auto';
  document.documentElement.dataset.focusMode = profile?.settings?.focusMode ? 'true' : 'false';
};

const avatarPreview = (profile) => getStoreItem(profile.equipped.avatar)?.preview || '👻';

const renderProfileChip = (profile) => {
  if (elements.explainModeToggle) elements.explainModeToggle.textContent = profile.settings?.explanationMode === 'detailed' ? 'MODO DETALHADO' : 'MODO CURTO';
  const wallet = getWalletSummary(profile);
  elements.profileChip.innerHTML = `
    <span class="resource-pill ${wallet.status !== 'VALID' ? 'wallet-warning' : ''}" title="Carteira ${wallet.status}">◇ ${profile.coins}</span>
    <span class="resource-pill combo-mini">×${profile.combo || 0}</span>
    <div class="profile-meta"><strong>${escapeHtml(profile.studentName || 'Aluno')}</strong><small>${escapeHtml(profile.className || '')} · LVL ${profile.level}</small></div>
    <div class="profile-avatar">${escapeHtml(avatarPreview(profile))}</div>`;
};

const renderToolsDrawer = (toolId = activeTool) => {
  activeTool = toolId;
  if (!elements.toolsDrawerTabs || !elements.toolsDrawerWorkspace) return;
  elements.toolsDrawerTabs.innerHTML = toolCatalog.map((tool) => `<button type="button" class="tools-drawer-tab ${tool.id === activeTool ? 'active' : ''}" data-drawer-tool="${tool.id}"><span>${escapeHtml(tool.icon)}</span><b>${escapeHtml(tool.label)}</b></button>`).join('');
  elements.toolsDrawerWorkspace.innerHTML = renderToolWorkspace(activeTool);
};

const openToolsDrawer = (toolId = activeTool) => {
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
  elements.modalRoot.innerHTML = `<div class="modal-layer release-layer"><section class="panel release-modal" role="dialog" aria-modal="true" aria-labelledby="release-title"><div class="release-rings" aria-hidden="true"><i></i><i></i><i></i><span>2.2</span></div><p class="eyebrow">ATUALIZAÇÃO DE SEGURANÇA E EXPERIÊNCIA</p><h2 id="release-title">A plataforma evoluiu com os feedbacks</h2><p>Obrigado aos estudantes que ajudaram a identificar melhorias em clareza, celular, progresso, loja, segurança e acessibilidade.</p><div class="release-tags"><span>Carteira auditável</span><span>Termos e escopo</span><span>Proteção XSS</span><span>Proficiência</span><span>Qualidade adaptativa</span></div><div class="release-progress"><span></span></div><button class="primary-button" data-dismiss-release>ENTRAR NA PLATAFORMA</button><button class="text-button" data-dismiss-release>PULAR ANIMAÇÃO</button></section></div>`;
};

const dismissReleaseThanks = () => {
  persistProfile((draft) => { draft.releaseHistory ||= {}; draft.releaseHistory.lastSeenReleaseId = RELEASE_ID; return draft; }, { rerender: false, eventType: 'release_seen', details: { releaseId: RELEASE_ID } });
  requiredModal = '';
  closeModal({ force: true });
  showOnboarding();
};

const closeModal = ({ preserveTour = false, force = false } = {}) => {
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
    ctf: () => renderCTF(profile, ctfFilter),
    academy: () => renderAcademy(profile),
    tools: () => renderTools(activeTool),
    intel: () => renderIntel(profile, intelFilter, intelQuery),
    careers: () => renderCareers(profile),
    store: () => renderStore(profile, storeFilter),
    delivery: () => renderDelivery(profile),
    profile: () => renderProfile(profile),
    about: () => renderAbout(),
  };
  elements.main.innerHTML = (renderers[view] || renderers.dashboard)();
};

const openChallenge = (id, result = null, showHint = false, tutorialVisible = null, options = {}) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const challenge = getChallenge(id);
  if (!challenge) return;
  if (platformConfig.eduauth?.requireChallengeStartAuthorization && !options.eduauthAuthorized && !result && !activeChallengeUI.id) {
    openEduAuthAuthorization('challenge-start', `challenge:${id}`, () => openChallenge(id, result, showHint, tutorialVisible, { ...options, eduauthAuthorized: true }));
    return;
  }
  activeLessonId = null;
  activeVulnerabilityId = null;
  activeChallengeUI = { id, result, showHint, tutorialVisible: tutorialVisible ?? Boolean(challenge.tutorial && getState().profile.settings?.tutorialEnabled !== false) };
  const [accent, accent2] = getMissionThemeColors(challenge.theme);
  document.body.dataset.missionTheme = challenge.theme;
  document.body.style.setProperty('--active-mission-accent', accent);
  document.body.style.setProperty('--active-mission-accent-2', accent2);
  elements.modalRoot.innerHTML = renderChallengeModal(challenge, getState().profile, result, showHint, activeChallengeUI.tutorialVisible);
  setTimeout(() => $('#challenge-answer', elements.modalRoot)?.focus(), 0);
  const profile = getState().profile;
  const shouldAutoStart = !options.suppressAutoTutorial && challenge.tutorial && profile.settings?.tutorialAutoPlay !== false && !profile.tutorialProgress?.missions?.[challenge.id] && !result;
  if (shouldAutoStart) setTimeout(() => { if (activeChallengeUI.id === challenge.id) startMissionTutorial(challenge.id, { chainTool: true }); }, 720);
};

const useHint = (id) => {
  const challenge = getChallenge(id);
  const profile = getState().profile;
  if (!challenge) return;
  if (!profile.hintsUsed[id]) {
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
  openChallenge(id, activeChallengeUI.result, true, activeChallengeUI.tutorialVisible);
};

const rewardChallenge = (challenge, attemptNumber) => {
  const current = getState().profile;
  if (current.completed[challenge.id]) return { stars: current.completed[challenge.id].stars, rewarded: false, bonusCoins: 0, levelUp: false };
  const previousLevel = current.level;
  const hints = current.hintsUsed[challenge.id] || 0;
  const stars = hints > 0 ? (attemptNumber <= 2 ? 2 : 1) : (attemptNumber === 1 ? 3 : attemptNumber <= 3 ? 2 : 1);
  const skillBoost = challenge.difficulty === 'Especialista' ? 20 : challenge.difficulty === 'Avançado' ? 15 : challenge.difficulty === 'Intermediário' ? 11 : 8;
  let bonusCoins = 0;
  let dailyBonus = false;
  const profile = persistProfile((draft) => {
    draft.completed[challenge.id] = { completedAt: Date.now(), stars };
    draft.combo = (draft.combo || 0) + 1;
    draft.maxCombo = Math.max(draft.maxCombo || 0, draft.combo);
    draft.correctAnswers = (draft.correctAnswers || 0) + 1;
    bonusCoins = Math.min(25, Math.max(0, draft.combo - 1) * 3);
    awardToProfile(draft, { source: 'challenge', sourceId: `challenge:${challenge.id}`, xp: challenge.xp, coins: challenge.coins + bonusCoins, stars, metadata: { attempts: attemptNumber, hints } });
    draft.skills[challenge.skill] = Math.min(100, (draft.skills[challenge.skill] || 0) + skillBoost);
    const today = dayKey();
    const distance = dayDistance(draft.lastMissionDay, today);
    if (draft.lastMissionDay !== today) draft.streak = distance === 1 ? (draft.streak || 0) + 1 : 1;
    draft.lastMissionDay = today;
    dailyBonus = recordDailyAction(draft, 'missions');
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
    return draft;
  }, { rerender: false, eventType: 'activity_completed', details: { challengeId: challenge.id, stars, attempts: attemptNumber } });
  return { stars, rewarded: true, profile, bonusCoins, dailyBonus, levelUp: profile.level > previousLevel };
};

const submitChallenge = (form) => {
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

  let attemptNumber = 0;
  persistProfile((draft) => {
    draft.attempts[id] = (draft.attempts[id] || 0) + 1;
    attemptNumber = draft.attempts[id];
    return draft;
  }, { rerender: false });

  let success = false;
  try { success = Boolean(challenge.validate({ value: answer, profile: getState().profile })); } catch { success = false; }
  if (success) {
    const reward = rewardChallenge(challenge, attemptNumber);
    const bonusText = reward.bonusCoins ? ` +${reward.bonusCoins} moedas de combo.` : '';
    const dailyText = reward.dailyBonus ? ' Bônus diário de +50 moedas liberado.' : '';
    const message = reward.rewarded
      ? `+${challenge.xp} XP, +${challenge.coins} moedas e ${reward.stars} estrela(s).${bonusText}${dailyText}`
      : 'Resposta correta. Esta missão já havia sido recompensada, mas você pode praticá-la novamente.';
    openChallenge(id, { success: true, message }, activeChallengeUI.showHint, activeChallengeUI.tutorialVisible);
    const profile = getState().profile;
    triggerEffect(profile.equipped.effect, { sound: profile.settings.sound, kind: 'success' });
    if (reward.levelUp) showLevelUp(profile.level, profile.settings.sound);
    showToast(`BANDEIRA CAPTURADA · COMBO ×${profile.combo || 0}`, message);
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

const openLesson = (id, options = {}) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const lesson = getLesson(id);
  if (!lesson) return;
  if (platformConfig.eduauth?.requireLessonStartAuthorization && !options.eduauthAuthorized) {
    openEduAuthAuthorization('lesson-start', `lesson:${id}`, () => openLesson(id, { eduauthAuthorized: true }));
    return;
  }
  const completed = Boolean(getState().profile.lessonProgress[id]?.completed);
  activeChallengeUI = { id: null, result: null, showHint: false, tutorialVisible: false };
  activeVulnerabilityId = null;
  activeLessonId = id;
  elements.modalRoot.innerHTML = renderLessonModal(lesson, completed, getState().profile.settings?.explanationMode || 'short');
};

const completeLesson = (id) => {
  const alreadyCompleted = Boolean(getState().profile.lessonProgress[id]?.completed);
  if (!alreadyCompleted) {
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

const runLocalMissionTest = (id, trigger) => {
  const challenge = getChallenge(id);
  const form = trigger.closest('form');
  const output = form?.querySelector('[data-local-test-output]');
  if (!challenge || !form || !output) return;
  const value = form.querySelector('#challenge-answer')?.value ?? '';
  let passed = false;
  try { passed = Boolean(challenge.validate({ value, profile: getState().profile })); } catch { passed = false; }
  output.className = passed ? 'local-test-pass' : 'local-test-fail';
  if (challenge.type === 'url-route') output.textContent = passed ? 'HTTP 200 // rota reconhecida. Valide para registrar a missão.' : 'HTTP 404 // rota não encontrada neste sandbox.';
  else output.textContent = passed ? '[PASS] Todos os testes locais passaram. Faça a validação final.' : '[FAIL] Um ou mais testes ainda falharam. Revise a regra defensiva.';
};

const handleStoreItem = (id) => {
  if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
  const item = getStoreItem(id);
  if (!item) return;
  const profile = getState().profile;
  const owned = profile.inventory.includes(item.id);
  try {
    persistProfile((draft) => {
      purchaseStoreItem(draft, item);
      return draft;
    }, { eventType: owned ? 'item_equipped' : 'store_purchase', details: { itemId: item.id, price: item.price } });
  } catch (error) {
    showToast(error.message.includes('saldo') ? 'SALDO INSUFICIENTE' : 'COMPRA BLOQUEADA', error.message, 'important');
    return;
  }
  showToast(owned ? 'ITEM EQUIPADO' : 'ITEM DESBLOQUEADO', `${item.name} · compra virtual sem impacto na nota.`);
  const current = getState().profile;
  triggerEffect(item.type === 'effect' ? item.id : current.equipped.effect, { sound: current.settings.sound, kind: 'success' });
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

const initializeSession = async () => {
  clearSession();
  await refreshSavedProfiles();
  elements.authModal.classList.remove('hidden');
  setTimeout(() => elements.authStudentName.focus(), 0);
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
  if (!getState().profile || getState().profile._ephemeral) return;
  touchSession();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => lockAndShowAuth('Sessão bloqueada após inatividade. Digite sua senha para continuar.'), IDLE_LOCK_MS);
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
  requestAnimationFrame(() => { if (!hasRequiredAcceptances(profile)) openTermsGate(); else showReleaseThanks(); });
};

const setAuthMode = (mode) => {
  authMode = mode;
  if (mode === 'register' && selectedSavedAccountId) clearSavedProfileSelection();
  $$('[data-auth-mode]').forEach((button) => button.classList.toggle('active', button.dataset.authMode === mode));
  elements.authLabel.textContent = mode === 'register' ? 'CRIAR PERFIL PROTEGIDO' : 'DESBLOQUEAR PERFIL';
  elements.authPassword.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  elements.authError.textContent = '';
};

const handleAuth = async (event) => {
  event.preventDefault();
  const studentName = elements.authStudentName.value.trim();
  const className = elements.authClassName.value.trim();
  const password = elements.authPassword.value;
  elements.authError.textContent = '';
  if ((!selectedSavedAccountId && (studentName.length < 5 || className.length < 2)) || password.length < 6) {
    elements.authError.textContent = selectedSavedAccountId ? 'Informe a senha local com pelo menos 6 caracteres.' : 'Informe nome completo, turma e uma senha com pelo menos 6 caracteres.';
    return;
  }
  try {
    elements.authLabel.textContent = authMode === 'register' ? 'PROTEGENDO PERFIL...' : 'DESCRIPTOGRAFANDO...';
    const account = authMode === 'register'
      ? await registerLocalAccount(studentName, className, password)
      : selectedSavedAccountId
        ? await authenticateAccountById(selectedSavedAccountId, password)
        : await authenticateLocalAccount(studentName, className, password);
    createSession(account.accountId);
    const saved = await loadProfile(account.accountId);
    const profile = normalizeProfile(saved || createDefaultProfile(account.accountId, account.studentName, account.className), account.accountId, account.studentName, account.className);
    selectedSavedAccountId = '';
    enterApp(profile);
    if (account.migrated) showToast('PERFIL ATUALIZADO', 'O progresso da versão anterior foi migrado para o armazenamento criptografado.');
  } catch (error) {
    elements.authError.textContent = error.message || 'Não foi possível concluir o acesso local.';
  } finally {
    elements.authLabel.textContent = authMode === 'register' ? 'CRIAR PERFIL PROTEGIDO' : 'DESBLOQUEAR PERFIL';
  }
};

const lockAndShowAuth = async (message = 'Perfil bloqueado. Digite a senha para continuar.') => {
  const profile = getState().profile;
  clearTimeout(idleTimer);
  if (profile && !profile._ephemeral) {
    try { await saveProfile(profile, 'session_locked', {}); } catch {}
    lockProfile(profile.accountId);
  } else clearSession();
  closeModal();
  elements.app.classList.add('hidden');
  elements.terminalToggle.classList.add('hidden');
  elements.toolsDrawerToggle.classList.add('hidden');
  elements.scheduleChip?.classList.add('hidden');
  closeToolsDrawer();
  elements.terminalDrawer.classList.remove('open');
  elements.authModal.classList.remove('hidden');
  elements.authPassword.value = '';
  selectedSavedAccountId = profile?._ephemeral ? '' : profile?.accountId || '';
  await refreshSavedProfiles();
  if (profile && !profile._ephemeral) {
    elements.authStudentName.value = profile.studentName;
    elements.authClassName.value = profile.className;
    elements.authStudentName.readOnly = true;
    elements.authClassName.readOnly = true;
  } else {
    elements.authForm.reset();
    elements.authStudentName.readOnly = false;
    elements.authClassName.readOnly = false;
  }
  setState({ profile: null, view: 'dashboard' });
  elements.authError.textContent = message;
  elements.authPassword.focus();
};

const logout = () => lockAndShowAuth('Sessão encerrada com segurança. Seu progresso permanece protegido neste dispositivo.');

const resetProgress = async ({ authorized = false } = {}) => {
  const profile = getState().profile;
  if (!authorized && !profile?._ephemeral) {
    await openEduAuthAuthorization('progress-reset', `profile:${profile.accountId}`, () => resetProgress({ authorized: true }));
    return;
  }
  if (!confirm('Zerar XP, missões, moedas, itens e aulas deste perfil? A identidade, a proteção e o histórico de segurança serão preservados.')) return;
  const fresh = createDefaultProfile(profile.accountId, profile.studentName, profile.className);
  if (profile._ephemeral) fresh._ephemeral = true;
  fresh.createdAt = profile.createdAt;
  fresh.audit = profile.audit;
  fresh.exportHistory = profile.exportHistory || [];
  fresh.importHistory = profile.importHistory || [];
  fresh.migrationHistory = profile.migrationHistory || [];
  fresh.settings = { ...fresh.settings, ...profile.settings };
  fresh.acceptances = [...(profile.acceptances || [])];
  fresh.activityAcceptances = [...(profile.activityAcceptances || [])];
  fresh.permissionAcceptances = [...(profile.permissionAcceptances || [])];
  fresh.releaseHistory = { ...(profile.releaseHistory || {}) };
  reconcileProfileState(fresh);
  setState({ profile: fresh });
  if (!fresh._ephemeral) await saveProfile(fresh, 'progress_reset', { identityPreserved: true, authorization: authorized ? 'eduauth' : 'temporary-session' });
  applyTheme(fresh);
  renderProfileChip(fresh);
  navigate('dashboard');
  showToast('PROGRESSO REINICIADO', 'A identidade e o perfil protegido foram mantidos.');
};

const exportProgress = async () => {
  const profile = getState().profile;
  if (profile._ephemeral) {
    showToast('SESSÃO TEMPORÁRIA', 'Crie um perfil protegido para exportar um backup criptografado.', 'attention');
    return;
  }
  const event = { id: uid(), at: new Date().toISOString(), platform: 'ctfds', version: platformConfig.version };
  profile.exportHistory = [...(profile.exportHistory || []), event].slice(-100);
  await saveProfile(profile, 'profile_exported', { exportId: event.id });
  const payload = await exportLocalData(profile.accountId);
  downloadJson(`perfil-educacional-${new Date().getFullYear()}.edu-profile`, payload);
  showToast('BACKUP CRIPTOGRAFADO GERADO', 'Guarde o arquivo e sua senha em locais separados.');
  renderCurrentView();
};

const importProgress = async (file, { fromAuth = false } = {}) => {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { const message = 'O backup excede o limite de 5 MB.'; if (fromAuth) elements.authError.textContent = message; else showToast('ARQUIVO MUITO GRANDE', message, 'attention'); return; }
  try {
    const payload = JSON.parse(await file.text());
    let replace = false;
    try {
      await importLocalData(payload, { replace: false });
    } catch (error) {
      if (!/Já existe/.test(error.message) || !confirm(`${error.message}\n\nSubstituir o pacote local pelo backup selecionado?`)) throw error;
      replace = true;
      await importLocalData(payload, { replace: true });
    }
    await refreshSavedProfiles();
    if (fromAuth) {
      elements.authError.textContent = 'Perfil importado. Selecione-o na lista e digite a senha do backup.';
    } else {
      showToast('BACKUP IMPORTADO', replace ? 'O perfil local foi substituído após confirmação.' : 'O perfil foi adicionado ao dispositivo. Desbloqueie-o com a senha do backup.');
    }
  } catch (error) {
    const message = error.message || 'Arquivo inválido.';
    if (fromAuth) elements.authError.textContent = message;
    else showToast('IMPORTAÇÃO RECUSADA', message, 'attention');
  }
};


const generateEvidence = async () => {
  const profile = getState().profile;
  if (!hasRequiredAcceptances(profile)) { openTermsGate(); return; }
  const wallet = getWalletSummary(profile);
  if (!wallet.valid) { showToast('EVIDÊNCIA BLOQUEADA', 'A carteira ou o inventário apresentam inconsistência. Exporte o backup e procure o professor.', 'important'); return; }
  const html = buildEvidenceHtml(profile);
  const filename = `evidencia-ctfds-${sanitizeFilename(profile.className || 'turma')}.html`;
  downloadText(filename, html, 'text/html;charset=utf-8');
  profile.delivery ||= { checks: {}, receipts: [] };
  profile.delivery.evidenceGeneratedAt = Date.now();
  profile.delivery.receipts = [...(profile.delivery.receipts || []), { id: uid(), type: 'evidence_html', fileName: filename, at: new Date().toISOString() }].slice(-50);
  if (!profile._ephemeral) await saveProfile(profile, 'result_exported', { fileName: filename, type: 'evidence_html' });
  renderCurrentView();
  showToast('EVIDÊNCIA GERADA', `${filename} foi preparado na pasta de downloads.`);
};

const openClassroom = async () => {
  const integration = platformConfig.integrations.classroom;
  const url = integration.assignmentUrl || integration.courseUrl;
  if (!integration.enabled || !/^https:\/\//.test(url)) {
    showToast('CLASSROOM NÃO CONFIGURADO', 'O professor precisa preencher um link válido no arquivo de configuração.', 'attention');
    return;
  }
  const profile = getState().profile;
  profile.delivery ||= { checks: {}, receipts: [] };
  profile.delivery.classroomOpenedAt = Date.now();
  if (!profile._ephemeral) await saveProfile(profile, 'classroom_opened', { urlType: integration.assignmentUrl ? 'assignment' : 'course' });
  window.open(safeExternalUrl(url), '_blank', 'noopener,noreferrer');
  showToast('CLASSROOM ABERTO', 'Confira a conta escolar, anexe o arquivo e confirme o status de entrega.');
};

const openScheduleDetails = () => {
  const profile = getState().profile;
  scheduleStatus = detectCurrentPeriod(profile?.className || '');
  elements.modalRoot.innerHTML = `<div class="modal-layer" role="presentation"><section class="panel profile-actions-modal" role="dialog" aria-modal="true" aria-labelledby="schedule-title"><header style="display:flex;justify-content:space-between;gap:12px"><div><p class="eyebrow">CONTEXTO ESCOLAR</p><h2 id="schedule-title">Horário da turma</h2></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header>${renderScheduleDetails(scheduleStatus)}<button class="secondary-button" data-view="delivery">ABRIR CONCLUSÃO E ENTREGA</button></section></div>`;
};

const openBugReport = () => {
  elements.modalRoot.innerHTML = `<div class="modal-layer" role="presentation"><section class="panel profile-actions-modal" role="dialog" aria-modal="true" aria-labelledby="bug-report-title"><header style="display:flex;justify-content:space-between;gap:12px"><div><p class="eyebrow">FEEDBACK RESPONSÁVEL</p><h2 id="bug-report-title">Relatar problema</h2></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header><p>O arquivo será gerado somente neste dispositivo. Não inclua senha, flag, resposta, documento ou dado pessoal desnecessário.</p><form data-bug-report-form><label>Módulo<select name="module" required><option value="">Selecione</option><option>Login e perfil</option><option>Missões CTF</option><option>Tutorial</option><option>Ferramentas</option><option>Loja e carteira</option><option>Exportação e entrega</option><option>EduAuth</option><option>Acessibilidade</option><option>Outro</option></select></label><label>O que aconteceu?<textarea name="description" minlength="10" maxlength="1200" required placeholder="Descreva o comportamento observado."></textarea></label><label>Passos para reproduzir<textarea name="steps" minlength="5" maxlength="1600" required placeholder="1. Abri... 2. Toquei... 3. O sistema..."></textarea></label><label>O que você esperava?<textarea name="expected" maxlength="800" placeholder="Resultado esperado."></textarea></label><label class="terms-check"><input type="checkbox" name="includeClass"> <span>Incluir somente a turma no relatório para ajudar a reproduzir o contexto.</span></label><button class="primary-button" type="submit">EXPORTAR RELATO JSON</button></form></section></div>`;
};

const openChangePassword = () => {
  elements.modalRoot.innerHTML = `<div class="modal-layer" role="presentation"><section class="panel password-modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title"><header style="display:flex;justify-content:space-between"><div><p class="eyebrow">SEGURANÇA LOCAL</p><h2 id="change-password-title">Alterar senha</h2></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header><p>A alteração protege novamente a chave do perfil. O progresso e a identidade são preservados.</p><form data-change-password-form><label>Senha atual<input name="currentPassword" type="password" minlength="6" required autocomplete="current-password"></label><label>Nova senha<input name="newPassword" type="password" minlength="6" required autocomplete="new-password"></label><label>Confirmar nova senha<input name="newPasswordConfirm" type="password" minlength="6" required autocomplete="new-password"></label><button class="primary-button" type="submit">ATUALIZAR SENHA</button></form></section></div>`;
};

const openChangeIdentity = () => {
  const profile = getState().profile;
  elements.modalRoot.innerHTML = `<div class="modal-layer" role="presentation"><section class="panel password-modal" role="dialog" aria-modal="true" aria-labelledby="change-identity-title"><header style="display:flex;justify-content:space-between"><div><p class="eyebrow">CORREÇÃO DE IDENTIDADE</p><h2 id="change-identity-title">Corrigir nome ou turma</h2></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header><p>O identificador interno permanece o mesmo. O valor anterior e o motivo ficam registrados no histórico protegido.</p><form data-change-identity-form><label>Nome completo<input name="studentName" value="${escapeHtml(profile.studentName)}" minlength="5" maxlength="80" required></label><label>Turma<input name="className" value="${escapeHtml(profile.className)}" minlength="2" maxlength="40" required></label><label>Motivo da correção<textarea name="reason" minlength="4" maxlength="300" required placeholder="ex.: correção de turma ou grafia do nome"></textarea></label><label>Senha local<input name="password" type="password" minlength="6" required autocomplete="current-password"></label><button class="primary-button" type="submit">CONFIRMAR CORREÇÃO</button></form></section></div>`;
};

const deleteCurrentProfile = async ({ authorized = false } = {}) => {
  const profile = getState().profile;
  if (profile._ephemeral) return lockAndShowAuth('Sessão temporária encerrada. Nenhum dado permanente foi mantido.');
  if (!authorized) {
    await openEduAuthAuthorization('profile-delete', `profile:${profile.accountId}`, () => deleteCurrentProfile({ authorized: true }));
    return;
  }
  if (!confirm(`Excluir o perfil de ${profile.studentName} deste computador? Faça um backup antes se desejar continuar em outro equipamento.`)) return;
  await recordEduAuthEvent({ platform: 'ctfds', mode: eduauthIsProductionProvisioned() ? 'SIGNED_GRANT' : 'DEVELOPMENT_BYPASS', risk: 'CRITICAL', actionId: 'profile-delete', result: 'applied', resourceId: `profile:${profile.accountId}` });
  await removeProfile(profile.accountId);
  clearSession();
  await lockAndShowAuth('Perfil removido deste computador.');
};

const openTeacherMode = async () => {
  const [status, profiles] = await Promise.all([getRecoveryStatus(), listLocalProfiles()]);
  elements.modalRoot.innerHTML = renderTeacherRecovery(status, profiles);
};


const stopEduAuthCountdown = () => {
  if (eduauthCountdownTimer) clearInterval(eduauthCountdownTimer);
  eduauthCountdownTimer = null;
};

const updateEduAuthCountdown = () => {
  const target = $('[data-eduauth-countdown]', elements.modalRoot);
  if (!target) return stopEduAuthCountdown();
  const expiresAt = Number(target.dataset.expiresAt || 0);
  const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  target.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  if (!remaining) { target.classList.add('expired'); stopEduAuthCountdown(); }
};

const openEduAuthAuthorization = async (actionId, resourceId = '', callback = null, { modeOverride = '' } = {}) => {
  const profile = getState().profile;
  const built = await buildEduAuthRequest({ actionId, profile, resourceId, modeOverride });
  const action = modeOverride ? { ...built.action, preferredMode: modeOverride } : built.action;
  const request = built.request;
  pendingEduAuth = { action, request, actionId, resourceId, callback, modeOverride };
  elements.modalRoot.innerHTML = renderAuthorizationModal({
    action, request, profile, resourceId,
    allowDevelopmentBypass: !eduauthIsProductionProvisioned(),
  });
  stopEduAuthCountdown();
  updateEduAuthCountdown();
  eduauthCountdownTimer = setInterval(updateEduAuthCountdown, 1000);
  $('[name="pin"]', elements.modalRoot)?.focus();
  $('[name="token"]', elements.modalRoot)?.focus();
};

const completeEduAuthAuthorization = async (details = {}) => {
  const current = pendingEduAuth;
  pendingEduAuth = null;
  stopEduAuthCountdown();
  closeModal();
  if (typeof current?.callback === 'function') await current.callback(details);
  else showToast('AUTORIZAÇÃO VALIDADA', 'O teste do protocolo foi concluído com sucesso.');
};

const renewPendingEduAuthRequest = async () => {
  if (!pendingEduAuth) return;
  const current = pendingEduAuth;
  await openEduAuthAuthorization(current.actionId, current.resourceId, current.callback, { modeOverride: current.modeOverride });
};

const downloadRecoveryKit = (kit) => downloadJson(`chave-recuperacao-ctfds-${kit.keyId}.ctfds-admin-key`, kit);

const readJsonFile = async (file) => {
  if (!file) throw new Error('Selecione um arquivo.');
  try { return JSON.parse(await file.text()); } catch { throw new Error('O arquivo selecionado não contém JSON válido.'); }
};

const useTemporarySession = () => {
  const enteredName = elements.authStudentName.value.trim();
  const enteredClass = elements.authClassName.value.trim();
  const profile = createDefaultProfile(`temporary_${uid()}`, enteredName.length >= 2 ? enteredName : 'Aluno temporário', enteredClass || 'Turma não informada');
  profile._ephemeral = true;
  profile.onboardingCompleted = false;
  enterApp(profile);
  showToast('SESSÃO TEMPORÁRIA', 'Exporte a evidência antes de fechar. O progresso não será salvo neste dispositivo.', 'attention');
};

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
document.addEventListener('click', (event) => {
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
    selectedSavedAccountId = savedProfileButton.dataset.selectSavedProfile;
    const label = savedProfileButton.querySelector('strong')?.textContent || 'Perfil salvo';
    const classLabel = savedProfileButton.querySelector('small')?.textContent?.split(' · ')[0] || '';
    setAuthMode('login');
    elements.authStudentName.value = label;
    elements.authClassName.value = classLabel;
    elements.authStudentName.readOnly = true;
    elements.authClassName.readOnly = true;
    elements.authPassword.value = '';
    elements.authError.textContent = `Perfil selecionado: ${label}. Digite a senha local.`;
    void refreshSavedProfiles();
    elements.authPassword.focus();
    return;
  }
  if (event.target.closest('#temporary-session')) { useTemporarySession(); return; }
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
  if (event.target.closest('[data-lock-session]')) { logout(); return; }
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

  const trackButton = event.target.closest('[data-track]');
  if (trackButton) { ctfFilter = trackButton.dataset.track; navigate('ctf'); return; }

  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) { ctfFilter = filterButton.dataset.filter; renderCurrentView(); return; }

  const challengeButton = event.target.closest('[data-challenge]');
  if (challengeButton) { openChallenge(challengeButton.dataset.challenge); return; }

  const hintButton = event.target.closest('[data-use-hint]');
  if (hintButton) { useHint(hintButton.dataset.useHint); return; }

  const localTestButton = event.target.closest('[data-run-local-test]');
  if (localTestButton) { runLocalMissionTest(localTestButton.dataset.runLocalTest, localTestButton); return; }

  const evidenceButton = event.target.closest('[data-evidence-clue]');
  if (evidenceButton) {
    const pressed = evidenceButton.getAttribute('aria-pressed') === 'true';
    evidenceButton.setAttribute('aria-pressed', String(!pressed));
    evidenceButton.classList.toggle('selected', !pressed);
    const board = evidenceButton.closest('[data-evidence-board]');
    const selectedCount = board?.querySelectorAll('.evidence-chip.selected').length || 0;
    const total = board?.querySelectorAll('.evidence-chip').length || 0;
    const counter = board?.querySelector('.evidence-counter');
    if (counter) counter.textContent = `${selectedCount}/${total} pistas marcadas`;
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
  if (lessonButton) { openLesson(lessonButton.dataset.lesson); return; }

  const completeLessonButton = event.target.closest('[data-complete-lesson]');
  if (completeLessonButton) { completeLesson(completeLessonButton.dataset.completeLesson); return; }

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
  if (event.target.closest('[data-cycle-quality]')) { const order = ['auto','low','medium','high']; persistProfile((draft) => { const current = order.indexOf(draft.settings.qualityPreset || 'auto'); draft.settings.qualityPreset = order[(current + 1) % order.length]; return draft; }); showToast('QUALIDADE GRÁFICA', getState().profile.settings.qualityPreset.toUpperCase()); return; }
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
    }
    return;
  }

  const toolButton = event.target.closest('[data-tool]');
  if (toolButton) {
    activeTool = toolButton.dataset.tool;
    $$('.tool-tab').forEach((button) => button.classList.toggle('active', button.dataset.tool === activeTool));
    const workspace = $('[data-tool-workspace]');
    if (workspace) workspace.innerHTML = renderToolWorkspace(activeTool);
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
  if (storeItemButton) { handleStoreItem(storeItemButton.dataset.storeItem); return; }

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
    submitChallenge(event.target);
    return;
  }
  if (event.target.matches('[data-tool-form]')) {
    event.preventDefault();
    if (!hasRequiredAcceptances(getState().profile)) { openTermsGate(); return; }
    const form = event.target;
    const output = $('[data-tool-output]', form.parentElement);
    try {
      output.textContent = await runTool(form.dataset.toolForm, new FormData(form));
      let dailyBonus = false;
      persistProfile((draft) => { dailyBonus = recordDailyAction(draft, 'tools'); return draft; }, { rerender: false });
      if (dailyBonus) showToast('PROTOCOLO DIÁRIO COMPLETO', '+50 Cyber Coins liberadas por combinar missão, aula e ferramenta.');
    } catch (error) {
      output.textContent = `ERRO: ${error.message || 'Não foi possível processar os dados.'}`;
    }
  }
});

document.addEventListener('change', async (event) => {
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

startMatrix(elements.matrix, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
runBoot();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

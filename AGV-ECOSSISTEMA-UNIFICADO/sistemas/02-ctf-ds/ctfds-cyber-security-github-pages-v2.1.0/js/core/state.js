import { levelFromXp } from './utils.js';

const listeners = new Set();
let state = {
  view: 'dashboard',
  profile: null,
  activeChallenge: null,
  activeLesson: null,
  toast: null,
};

export const createDefaultProfile = (accountId, studentName = 'Aluno', className = 'Turma não informada') => ({
  accountId,
  username: accountId,
  studentName,
  className,
  avatar: 'ghost',
  title: 'Recruta Digital',
  xp: 0,
  level: 1,
  coins: 120,
  stars: 0,
  streak: 0,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  failedAnswers: 0,
  lastMissionDay: '',
  dailyStats: { date: '', missions: 0, lessons: 0, tools: 0 },
  dailyBonusClaimedDate: '',
  onboardingCompleted: false,
  tutorialProgress: { platform: false, missionGuide: false, tools: {}, missions: {} },
  storageSchemaVersion: 3,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  audit: { version: 1, events: [] },
  identityHistory: [],
  delivery: { evidenceGeneratedAt: null, classroomOpenedAt: null, checks: {}, receipts: [] },
  exportHistory: [],
  importHistory: [],
  migrationHistory: [],
  recommendationHistory: { items: {}, snoozedUntil: '', disabled: false, reducedFrequency: false },
  careerGoal: '',
  lastActive: Date.now(),
  completed: {},
  attempts: {},
  hintsUsed: {},
  lessonProgress: {},
  discoveryTokens: {},
  missionNotes: {},
  skills: {
    'Defesa': 5,
    'Web': 5,
    'Criptografia': 5,
    'Redes': 5,
    'Forense': 5,
    'Financeiro': 5,
    'Web3': 5,
    'Mobile': 5,
    'Cloud': 5,
    'Reversa': 5,
  },
  badges: ['Primeiro Acesso'],
  inventory: ['theme-neon', 'avatar-ghost'],
  equipped: {
    theme: 'theme-neon',
    avatar: 'avatar-ghost',
    effect: 'effect-matrix',
  },
  settings: {
    sound: false,
    reducedMotion: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
    explanationMode: 'short',
    tutorialEnabled: true,
    tutorialAutoPlay: true,
    scheduleNotifications: true,
    showRemainingTime: true,
    motivationalMessages: true,
  },
});

export const normalizeProfile = (profile, accountId = profile?.accountId || profile?.username || 'operator', studentName = profile?.studentName || 'Aluno', className = profile?.className || 'Turma não informada') => {
  const base = createDefaultProfile(accountId, studentName, className);
  return {
    ...base,
    ...profile,
    accountId: profile?.accountId || accountId,
    username: profile?.accountId || profile?.username || accountId,
    studentName: profile?.studentName || studentName,
    className: profile?.className || className,
    completed: { ...base.completed, ...(profile?.completed || {}) },
    attempts: { ...base.attempts, ...(profile?.attempts || {}) },
    hintsUsed: { ...base.hintsUsed, ...(profile?.hintsUsed || {}) },
    lessonProgress: { ...base.lessonProgress, ...(profile?.lessonProgress || {}) },
    discoveryTokens: { ...base.discoveryTokens, ...(profile?.discoveryTokens || {}) },
    missionNotes: { ...base.missionNotes, ...(profile?.missionNotes || {}) },
    delivery: { ...base.delivery, ...(profile?.delivery || {}), checks: { ...base.delivery.checks, ...(profile?.delivery?.checks || {}) }, receipts: Array.isArray(profile?.delivery?.receipts) ? profile.delivery.receipts : [] },
    exportHistory: Array.isArray(profile?.exportHistory) ? profile.exportHistory : base.exportHistory,
    importHistory: Array.isArray(profile?.importHistory) ? profile.importHistory : base.importHistory,
    migrationHistory: Array.isArray(profile?.migrationHistory) ? profile.migrationHistory : base.migrationHistory,
    audit: profile?.audit || base.audit,
    identityHistory: Array.isArray(profile?.identityHistory) ? profile.identityHistory : base.identityHistory,
    recommendationHistory: { ...base.recommendationHistory, ...(profile?.recommendationHistory || {}), items: { ...base.recommendationHistory.items, ...(profile?.recommendationHistory?.items || {}) } },
    tutorialProgress: {
      ...base.tutorialProgress,
      ...(profile?.tutorialProgress || {}),
      tools: { ...base.tutorialProgress.tools, ...(profile?.tutorialProgress?.tools || {}) },
      missions: { ...base.tutorialProgress.missions, ...(profile?.tutorialProgress?.missions || {}) },
    },
    dailyStats: { ...base.dailyStats, ...(profile?.dailyStats || {}) },
    skills: { ...base.skills, ...(profile?.skills || {}) },
    badges: Array.isArray(profile?.badges) ? profile.badges : base.badges,
    inventory: Array.isArray(profile?.inventory) ? profile.inventory : base.inventory,
    equipped: { ...base.equipped, ...(profile?.equipped || {}) },
    settings: { ...base.settings, ...(profile?.settings || {}) },
  };
};

export const getState = () => state;

export const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
};

export const updateProfile = (updater) => {
  const nextProfile = typeof updater === 'function'
    ? updater(structuredClone(state.profile))
    : { ...state.profile, ...updater };
  nextProfile.level = levelFromXp(nextProfile.xp);
  nextProfile.lastActive = Date.now();
  setState({ profile: nextProfile });
  return nextProfile;
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

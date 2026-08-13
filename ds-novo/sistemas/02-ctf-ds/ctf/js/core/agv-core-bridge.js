const SUPABASE_URL = 'https://iresvqwyaqotghjssncg.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO';
const PLATFORM_CODE = 'ctf-ds';
const SESSION_KEY = 'ctfds:agv-core-session:v1';

let session = null;
let platformId = '';
let provisionedChallenges = new Set();

const store = () => sessionStorage;
const encode = (value) => encodeURIComponent(String(value ?? ''));

function saveSession(next) {
  session = next?.access_token ? next : null;
  try {
    if (session) store().setItem(SESSION_KEY, JSON.stringify(session));
    else store().removeItem(SESSION_KEY);
  } catch {}
  return session;
}

function loadStoredSession() {
  if (session?.access_token) return session;
  try {
    const raw = store().getItem(SESSION_KEY);
    if (raw) session = JSON.parse(raw);
  } catch {}
  return session;
}

async function authRequest(path, body, accessToken = '') {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.msg || data?.message || data?.error_description || data?.error || `Falha de autenticação (${response.status}).`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function refreshSession() {
  const current = loadStoredSession();
  if (!current?.refresh_token) throw new Error('Sessão expirada. Entre novamente.');
  const fresh = await authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: current.refresh_token });
  return saveSession(fresh);
}

async function coreFetch(path, options = {}, retry = true) {
  let current = loadStoredSession();
  if (!current?.access_token) throw new Error('Sessão central não encontrada.');
  const request = () => fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${current.access_token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let response = await request();
  if (response.status === 401 && retry && current.refresh_token) {
    current = await refreshSession();
    response = await coreFetch(path, options, false);
    return response;
  }
  return response;
}

async function rest(path) {
  const response = await coreFetch(`/rest/v1/${path}`, { method: 'GET' });
  const data = await response.json().catch(() => []);
  if (!response.ok) throw new Error(data?.message || data?.hint || `Falha ao consultar o Core (${response.status}).`);
  return data;
}

async function loadIdentity(user) {
  const profiles = await rest(`profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${encode(user.id)}&limit=1`);
  const profile = profiles?.[0];
  if (!profile?.active) throw new Error('Conta inativa ou perfil central não localizado.');
  const memberships = await rest(`class_memberships?select=class_id,is_primary&user_id=eq.${encode(user.id)}&active=eq.true&order=is_primary.desc&limit=1`);
  let classInfo = null;
  if (memberships?.[0]?.class_id) {
    const classes = await rest(`classes?select=id,code,name,shift&id=eq.${encode(memberships[0].class_id)}&limit=1`);
    classInfo = classes?.[0] || null;
  }
  return { user, profile, classInfo };
}

export async function centralSignIn(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail.endsWith('@escola.pr.gov.br')) throw new Error('Use seu e-mail institucional @escola.pr.gov.br.');
  if (!password) throw new Error('Informe sua senha. No primeiro acesso do aluno, use o CGM.');
  let signed;
  try {
    signed = await authRequest('/auth/v1/token?grant_type=password', { email: normalizedEmail, password });
  } catch (signInError) {
    const looksLikeCgm = /^\d{6,12}$/.test(password);
    const looksLikeStaffFirstAccess = password === 'agv@2026';
    if (!looksLikeCgm && !looksLikeStaffFirstAccess) throw signInError;
    await authRequest('/auth/v1/signup', {
      email: normalizedEmail,
      password,
      data: looksLikeCgm ? { cgm: password } : {},
    });
    signed = await authRequest('/auth/v1/token?grant_type=password', { email: normalizedEmail, password });
  }
  saveSession(signed);
  return loadIdentity(signed.user);
}

export async function changeCentralPassword(newPassword) {
  const value = String(newPassword || '');
  if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) throw new Error('A nova senha precisa ter pelo menos 8 caracteres, incluindo letra e número.');
  const current = loadStoredSession();
  if (!current?.access_token) throw new Error('Sessão central expirada. Entre novamente.');
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${current.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: value }),
  });
  const user = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(user?.message || user?.msg || 'Não foi possível alterar a senha.');
  current.user = user;
  saveSession(current);
  return loadIdentity(user);
}

export async function centralSignOut() {
  const current = loadStoredSession();
  if (current?.access_token) {
    try { await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${current.access_token}` } }); } catch {}
  }
  saveSession(null);
}

async function resolvePlatform() {
  if (platformId) return platformId;
  const rows = await rest(`platforms?select=id,code&code=eq.${encode(PLATFORM_CODE)}&active=eq.true&limit=1`);
  platformId = rows?.[0]?.id || '';
  if (!platformId) throw new Error('CTF DS não está registrado no AGV Education Core.');
  return platformId;
}

export async function coreAction(action, payload = {}) {
  const response = await coreFetch('/functions/v1/ctf-core-actions', {
    method: 'POST',
    body: JSON.stringify({ action, ...(payload || {}) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const messages = {
      insufficient_xp: 'XP insuficiente para desbloquear esta pista.',
      insufficient_balance: 'Saldo insuficiente para esta compra.',
      lesson_not_started: 'Abra a aula antes de marcá-la como concluída.',
      server_validation_required: 'Esta ação precisa de validação do servidor.',
    };
    const error = new Error(messages[data?.error] || data?.message || data?.error || `Falha no Core (${response.status}).`);
    error.code = data?.error || 'ctf_core_action_error';
    error.data = data;
    throw error;
  }
  return data;
}

export async function loadCoreCTFState() {
  const current = loadStoredSession();
  if (!current?.user?.id) throw new Error('Sessão central não encontrada.');
  const pid = await resolvePlatform();
  const state = await coreAction('state');
  const catalog = state.catalog || [];
  provisionedChallenges = new Set(catalog.filter((row) => String(row.activity_id || '').startsWith('challenge:')).map((row) => String(row.activity_id).slice('challenge:'.length)));
  return {
    platformId: pid,
    catalog,
    progress: state.progress || [],
    wallet: state.wallet || { balance: 0, lifetime_earned: 0, lifetime_spent: 0, status: 'active' },
    metrics: state.metrics || { xp: 0, points: 0 },
    provisionedChallengeIds: [...provisionedChallenges],
    catalogComplete: provisionedChallenges.size >= 68 && catalog.length >= 86,
    hintChallengeIds: state.hintChallengeIds || [],
    store: state.store || { catalog: [], ownedItemIds: ['theme-neon','avatar-ghost','effect-matrix'], transactions: [] },
    daily: state.daily || null,
  };
}

export const startCoreLesson = (lessonId) => coreAction('lesson_start', { lessonId });
export const completeCoreLesson = (lessonId) => coreAction('lesson_complete', { lessonId });
export const recordCoreToolUse = (toolId, eventId) => coreAction('tool_used', { toolId, eventId });
export const syncCoreDaily = () => coreAction('daily_sync');
export const purchaseCoreHint = (challengeId) => coreAction('hint', { challengeId });
export const loadCoreStoreState = () => coreAction('store_state');
export const purchaseCoreStoreItem = (itemId) => coreAction('store_purchase', { itemId });

export function isCoreChallengeProvisioned(challengeId) {
  return provisionedChallenges.has(String(challengeId || ''));
}

export async function completeCoreChallenge(challengeId, answer, attemptId) {
  if (!isCoreChallengeProvisioned(challengeId)) {
    const error = new Error('Esta missão ainda está aguardando provisionamento no AGV Education Core.');
    error.code = 'activity_not_provisioned';
    throw error;
  }
  const response = await coreFetch('/functions/v1/ctf-complete-challenge', {
    method: 'POST',
    body: JSON.stringify({ challengeId, answer, attemptId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data?.error === 'prerequisites_missing' ? 'Conclua primeiro as missões pré-requisito.' :
      data?.error === 'answer_invalid' ? 'Resposta incorreta.' :
      data?.error === 'activity_not_registered' ? 'Missão ainda não provisionada no Core.' :
      data?.message || data?.error || `Falha no Core (${response.status}).`
    );
    error.code = data?.error || 'core_challenge_error';
    error.data = data;
    throw error;
  }
  return data;
}

export function hasCentralSession() { return Boolean(loadStoredSession()?.access_token); }
export function centralUser() { return loadStoredSession()?.user || null; }
export const AGV_CORE_INFO = Object.freeze({ platformId: PLATFORM_CODE, supabaseUrl: SUPABASE_URL, mode: 'ctf-core-authority' });

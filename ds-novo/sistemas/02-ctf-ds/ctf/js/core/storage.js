import { assertSafeData } from './integrity.js';
import { reconcileProfileState } from './wallet.js';
const DB_NAME = 'ctfds-educational-profiles';
const DB_VERSION = 3;
const PROFILE_STORE = 'profiles';
const SETTINGS_STORE = 'settings';
const SESSION_KEY = 'ctfds:session:v3';
const LEGACY_ACCOUNT_KEY = 'ctfds:accounts:v2';
const LEGACY_PROFILE_PREFIX = 'ctfds:profile:v2:';
const TTL_MS = 5 * 24 * 60 * 60 * 1000;
const KDF_ITERATIONS = 210000;
const ADMIN_KDF_ITERATIONS = 260000;
const SCHEMA = 'ctfds-edu-profile-v3';
const PLATFORM_VERSION = '3.2.0';

const unlockedKeys = new Map();
const saveQueues = new Map();
const memoryDb = { profiles: new Map(), settings: new Map() };

const hasIndexedDb = () => typeof indexedDB !== 'undefined';
const sessionStore = () => typeof sessionStorage !== 'undefined' ? sessionStorage : localStorage;

const openDb = () => new Promise((resolve, reject) => {
  if (!hasIndexedDb()) return resolve(null);
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(PROFILE_STORE)) db.createObjectStore(PROFILE_STORE, { keyPath: 'accountId' });
    if (!db.objectStoreNames.contains(SETTINGS_STORE)) db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Não foi possível abrir o armazenamento protegido.'));
});

const idbRequest = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Falha no armazenamento local.'));
});

const dbGet = async (storeName, key) => {
  const db = await openDb();
  if (!db) return memoryDb[storeName].get(key) || null;
  const transaction = db.transaction(storeName, 'readonly');
  return idbRequest(transaction.objectStore(storeName).get(key));
};

const dbPut = async (storeName, value) => {
  const db = await openDb();
  if (!db) {
    memoryDb[storeName].set(value.accountId || value.key, structuredClone(value));
    return value;
  }
  const transaction = db.transaction(storeName, 'readwrite');
  await idbRequest(transaction.objectStore(storeName).put(value));
  return value;
};

const dbDelete = async (storeName, key) => {
  const db = await openDb();
  if (!db) return memoryDb[storeName].delete(key);
  const transaction = db.transaction(storeName, 'readwrite');
  return idbRequest(transaction.objectStore(storeName).delete(key));
};

const dbGetAll = async (storeName) => {
  const db = await openDb();
  if (!db) return [...memoryDb[storeName].values()].map((item) => structuredClone(item));
  const transaction = db.transaction(storeName, 'readonly');
  return idbRequest(transaction.objectStore(storeName).getAll());
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const bytesToBase64 = (bytes) => {
  let binary = '';
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  return btoa(binary);
};
const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const randomBytes = (length) => { const bytes = new Uint8Array(length); crypto.getRandomValues(bytes); return bytes; };
const randomId = (prefix = 'id') => `${prefix}_${crypto.randomUUID?.() || bytesToHex(randomBytes(16))}`;
const normalizeIdentityPart = (value) => String(value || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
const shortIdentity = (studentName) => {
  const parts = String(studentName || 'Aluno').trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] || 'Aluno';
  return `${parts[0]} ${parts.at(-1).charAt(0).toUpperCase()}.`;
};

const sha256Hex = async (value) => bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value)))));
export const buildAccountId = async (studentName, className) => `profile_${(await sha256Hex(`${normalizeIdentityPart(studentName)}::${normalizeIdentityPart(className)}`)).slice(0, 32)}`;

const deriveAesKey = async (password, salt, iterations = KDF_ITERATIONS, usages = ['encrypt', 'decrypt']) => {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, { name: 'AES-GCM', length: 256 }, false, usages);
};

const aesEncrypt = async (key, value, additionalData = '') => {
  const iv = randomBytes(12);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(additionalData) }, key, value instanceof Uint8Array ? value : encoder.encode(JSON.stringify(value)));
  return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(encrypted)) };
};

const aesDecrypt = async (key, envelope, additionalData = '', raw = false) => {
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv), additionalData: encoder.encode(additionalData) }, key, base64ToBytes(envelope.ciphertext));
  const bytes = new Uint8Array(decrypted);
  return raw ? bytes : JSON.parse(decoder.decode(bytes));
};

const importDataKey = (raw, usages = ['encrypt', 'decrypt']) => crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, usages);
const exportDataKey = (key) => crypto.subtle.exportKey('raw', key).then((buffer) => new Uint8Array(buffer));

const getSetting = async (key, fallback = null) => (await dbGet(SETTINGS_STORE, key))?.value ?? fallback;
const putSetting = async (key, value) => dbPut(SETTINGS_STORE, { key, value, updatedAt: Date.now() });

const wrapDataKeyForStudent = async (dataKey, password, accountId, parameters = {}) => {
  const salt = parameters.salt ? base64ToBytes(parameters.salt) : randomBytes(16);
  const iterations = parameters.iterations || KDF_ITERATIONS;
  const kek = await deriveAesKey(password, salt, iterations);
  const wrapped = await aesEncrypt(kek, await exportDataKey(dataKey), `ctfds-student-wrap:${accountId}`);
  return {
    algorithm: 'PBKDF2-HMAC-SHA-256+A256GCM',
    salt: bytesToBase64(salt),
    iterations,
    iv: wrapped.iv,
    ciphertext: wrapped.ciphertext,
  };
};

const unwrapDataKeyForStudent = async (studentWrap, password, accountId) => {
  const kek = await deriveAesKey(password, base64ToBytes(studentWrap.salt), studentWrap.iterations || KDF_ITERATIONS);
  const raw = await aesDecrypt(kek, studentWrap, `ctfds-student-wrap:${accountId}`, true);
  return importDataKey(raw);
};

const wrapDataKeyForRecovery = async (dataKey) => {
  const recovery = await getSetting('teacherRecovery', null);
  if (!recovery?.publicKey || !recovery?.keyId) return null;
  const publicKey = await crypto.subtle.importKey('jwk', recovery.publicKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, await exportDataKey(dataKey));
  return { algorithm: 'RSA-OAEP-256', keyId: recovery.keyId, ciphertext: bytesToBase64(new Uint8Array(ciphertext)) };
};

const encryptProfile = async (profile, dataKey, accountId) => {
  const payload = structuredClone(profile);
  delete payload.expiresAt;
  delete payload._ephemeral;
  const encrypted = await aesEncrypt(dataKey, payload, `ctfds-profile:${accountId}:v3`);
  return { algorithm: 'A256GCM', ...encrypted };
};

const decryptProfile = (record, dataKey) => aesDecrypt(dataKey, record.encryptedProfile, `ctfds-profile:${record.accountId}:v3`);

const appendAuditEvent = async (profile, type = 'autosave', details = {}) => {
  const audit = profile.audit || { version: 1, events: [] };
  const events = Array.isArray(audit.events) ? audit.events : [];
  const previousHash = events.at(-1)?.hash || 'GENESIS';
  const event = {
    id: randomId('audit'),
    type,
    at: new Date().toISOString(),
    platform: 'ctfds',
    version: PLATFORM_VERSION,
    details,
    previousHash,
  };
  event.hash = await sha256Hex(JSON.stringify(event));
  events.push(event);
  profile.audit = { version: 1, events: events.slice(-500) };
  return profile;
};

const publicSummaryFromProfile = (profile, record = {}) => ({
  displayName: shortIdentity(profile.studentName),
  className: profile.className || 'Turma não informada',
  avatar: profile.equipped?.avatar || profile.avatar || 'avatar-ghost',
  lastAccessAt: Date.now(),
  createdAt: record.publicSummary?.createdAt || profile.createdAt || Date.now(),
  expiresAt: Date.now() + TTL_MS,
});

const queueSave = (accountId, operation) => {
  const previous = saveQueues.get(accountId) || Promise.resolve();
  const next = previous.catch(() => {}).then(operation);
  let tracked;
  tracked = next.finally(() => { if (saveQueues.get(accountId) === tracked) saveQueues.delete(accountId); });
  saveQueues.set(accountId, tracked);
  return tracked;
};

const legacyRead = (key, fallback = null) => {
  try { const raw = localStorage?.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

const legacyHashPassword = async (password, saltBase64, iterations = 120000) => {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: base64ToBytes(saltBase64), iterations }, material, 256);
  return bytesToHex(new Uint8Array(bits));
};

const migrateLegacyAccount = async (studentName, className, password) => {
  const legacyId = `${normalizeIdentityPart(studentName)}::${normalizeIdentityPart(className)}`;
  const accounts = legacyRead(LEGACY_ACCOUNT_KEY, {});
  const legacy = accounts?.[legacyId];
  if (!legacy) return null;
  const candidate = await legacyHashPassword(password, legacy.salt, legacy.iterations || 120000);
  if (candidate !== legacy.passwordHash) throw new Error('Senha incorreta.');
  const oldProfile = legacyRead(`${LEGACY_PROFILE_PREFIX}${encodeURIComponent(legacyId)}`, null);
  const account = await registerLocalAccount(studentName, className, password, oldProfile || null, { migration: true });
  try {
    delete accounts[legacyId];
    localStorage.setItem(LEGACY_ACCOUNT_KEY, JSON.stringify(accounts));
    localStorage.removeItem(`${LEGACY_PROFILE_PREFIX}${encodeURIComponent(legacyId)}`);
    localStorage.removeItem('ctfds:session:v2');
  } catch {}
  return account;
};

export const hashPassword = async (password, saltBase64 = null, iterations = KDF_ITERATIONS) => {
  if (!saltBase64) return sha256Hex(password);
  return legacyHashPassword(password, saltBase64, iterations);
};

export const registerLocalAccount = async (studentName, className, password, initialProfile = null, options = {}) => {
  const loginHash = await buildAccountId(studentName, className);
  const existingProfiles = await dbGetAll(PROFILE_STORE);
  if (existingProfiles.some((item) => (item.loginHash || item.accountId) === loginHash)) throw new Error('Já existe um perfil com este nome e turma neste dispositivo. Use Entrar ou selecione o perfil salvo.');
  const accountId = loginHash;
  const dataKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  unlockedKeys.set(accountId, dataKey);
  const now = Date.now();
  const profile = {
    ...(initialProfile || {}),
    accountId,
    username: accountId,
    studentName: studentName.trim(),
    className: className.trim(),
    createdAt: initialProfile?.createdAt || now,
    updatedAt: now,
    expiresAt: now + TTL_MS,
    storageSchemaVersion: 15,
  };
  await appendAuditEvent(profile, options.migration ? 'legacy_profile_migrated' : 'profile_created', { className: profile.className });
  const record = {
    accountId,
    loginHash,
    schema: SCHEMA,
    formatVersion: 3,
    cryptoVersion: 1,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + TTL_MS,
    publicSummary: publicSummaryFromProfile(profile),
    studentWrap: await wrapDataKeyForStudent(dataKey, password, accountId),
    recoveryWrap: await wrapDataKeyForRecovery(dataKey),
    encryptedProfile: await encryptProfile(profile, dataKey, accountId),
  };
  await dbPut(PROFILE_STORE, record);
  return { accountId, studentName: profile.studentName, className: profile.className, algorithm: 'PBKDF2-SHA256 + AES-256-GCM', migrated: Boolean(options.migration) };
};

export const authenticateLocalAccount = async (studentName, className, password, accountIdOverride = '') => {
  const loginHash = accountIdOverride ? '' : await buildAccountId(studentName, className);
  let record = accountIdOverride ? await dbGet(PROFILE_STORE, accountIdOverride) : await dbGet(PROFILE_STORE, loginHash);
  if (record && !accountIdOverride && (record.loginHash || record.accountId) !== loginHash) record = null;
  if (!record && !accountIdOverride) record = (await dbGetAll(PROFILE_STORE)).find((item) => (item.loginHash || item.accountId) === loginHash) || null;
  if (!record && !accountIdOverride) {
    const migrated = await migrateLegacyAccount(studentName, className, password);
    if (migrated) return migrated;
  }
  const accountId = record?.accountId || accountIdOverride || loginHash;
  if (!record) throw new Error('Perfil não encontrado neste dispositivo. Confira o nome e a turma, selecione um perfil salvo ou importe um backup.');
  if (record.expiresAt && record.expiresAt < Date.now()) {
    await removeProfile(accountId);
    throw new Error('Este perfil local expirou. Importe um backup ou crie um novo perfil.');
  }
  try {
    const dataKey = await unwrapDataKeyForStudent(record.studentWrap, password, accountId);
    const profile = await decryptProfile(record, dataKey);
    unlockedKeys.set(accountId, dataKey);
    record.publicSummary = { ...record.publicSummary, lastAccessAt: Date.now(), expiresAt: Date.now() + TTL_MS };
    record.updatedAt = Date.now();
    record.expiresAt = Date.now() + TTL_MS;
    await dbPut(PROFILE_STORE, record);
    return { accountId, studentName: profile.studentName, className: profile.className, algorithm: 'PBKDF2-SHA256 + AES-256-GCM' };
  } catch {
    throw new Error('Senha incorreta ou perfil com integridade inválida.');
  }
};

export const authenticateAccountById = async (accountId, password) => {
  const record = await dbGet(PROFILE_STORE, accountId);
  if (!record) throw new Error('Perfil não encontrado neste dispositivo.');
  return authenticateLocalAccount('', '', password, accountId);
};

export const createSession = (accountId) => {
  const session = { accountId, createdAt: Date.now(), lastActivityAt: Date.now() };
  sessionStore().setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const touchSession = () => {
  const session = getSession();
  if (!session) return null;
  session.lastActivityAt = Date.now();
  sessionStore().setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getSession = () => {
  try {
    const raw = sessionStore().getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const clearSession = () => {
  const session = getSession();
  if (session?.accountId) unlockedKeys.delete(session.accountId);
  try { sessionStore().removeItem(SESSION_KEY); } catch {}
};

export const lockProfile = (accountId) => {
  unlockedKeys.delete(accountId);
  clearSession();
};

export const loadProfile = async (accountId) => {
  const record = await dbGet(PROFILE_STORE, accountId);
  const dataKey = unlockedKeys.get(accountId);
  if (!record || !dataKey) return null;
  if (record.expiresAt && record.expiresAt < Date.now()) {
    await removeProfile(accountId);
    return null;
  }
  try {
    const profile = await decryptProfile(record, dataKey);
    return { ...profile, expiresAt: record.expiresAt };
  } catch { throw new Error('Não foi possível verificar a integridade do perfil.'); }
};

export const saveProfile = async (profile, eventType = 'autosave', details = {}) => {
  if (!profile || profile._ephemeral) return profile;
  const accountId = profile.accountId || profile.username;
  const dataKey = unlockedKeys.get(accountId);
  if (!dataKey) throw new Error('Perfil bloqueado. Digite a senha novamente para salvar.');
  return queueSave(accountId, async () => {
    const record = await dbGet(PROFILE_STORE, accountId);
    if (!record) throw new Error('Registro local não encontrado.');
    const persisted = structuredClone(profile);
    reconcileProfileState(persisted);
    persisted.updatedAt = Date.now();
    persisted.expiresAt = Date.now() + TTL_MS;
    persisted.storageSchemaVersion = 15;
    if (eventType !== 'autosave' || !persisted.audit?.events?.length || Date.now() - new Date(persisted.audit.events.at(-1)?.at || 0).getTime() > 60000) {
      await appendAuditEvent(persisted, eventType, details);
    }
    record.updatedAt = Date.now();
    record.expiresAt = Date.now() + TTL_MS;
    record.publicSummary = publicSummaryFromProfile(persisted, record);
    record.encryptedProfile = await encryptProfile(persisted, dataKey, accountId);
    if (!record.recoveryWrap) record.recoveryWrap = await wrapDataKeyForRecovery(dataKey);
    await dbPut(PROFILE_STORE, record);
    profile.updatedAt = persisted.updatedAt;
    profile.expiresAt = persisted.expiresAt;
    profile.audit = persisted.audit;
    return profile;
  });
};

export const removeProfile = async (accountId) => {
  unlockedKeys.delete(accountId);
  await dbDelete(PROFILE_STORE, accountId);
};

export const listLocalProfiles = async () => {
  const records = await dbGetAll(PROFILE_STORE);
  const now = Date.now();
  const result = [];
  for (const record of records) {
    if (record.expiresAt && record.expiresAt < now) { await dbDelete(PROFILE_STORE, record.accountId); continue; }
    result.push({
      accountId: record.accountId,
      ...record.publicSummary,
      expiresAt: record.expiresAt,
      recoveryAvailable: Boolean(record.recoveryWrap),
    });
  }
  return result.sort((a, b) => (b.lastAccessAt || 0) - (a.lastAccessAt || 0));
};

export const exportLocalData = async (accountId) => {
  if (saveQueues.get(accountId)) await saveQueues.get(accountId);
  const record = await dbGet(PROFILE_STORE, accountId);
  if (!record) throw new Error('Perfil não localizado para exportação.');
  return {
    schema: SCHEMA,
    packageVersion: 1,
    exportedAt: new Date().toISOString(),
    retentionDays: 5,
    platform: { id: 'ctfds', version: PLATFORM_VERSION },
    publicSummary: record.publicSummary,
    encryptedRecord: record,
  };
};

export const importLocalData = async (payload, { replace = false } = {}) => {
  assertSafeData(payload, { maxDepth: 14, maxKeys: 12000 });
  if (!payload || payload.schema !== SCHEMA || !payload.encryptedRecord?.accountId) throw new Error('Backup incompatível ou corrompido.');
  const allowedTopLevel = new Set(['schema','packageVersion','exportedAt','retentionDays','platform','publicSummary','encryptedRecord']);
  if (Object.keys(payload).some((key) => !allowedTopLevel.has(key))) throw new Error('O pacote contém campos não reconhecidos.');
  const record = structuredClone(payload.encryptedRecord);
  if (!record.studentWrap?.ciphertext || !record.encryptedProfile?.ciphertext) throw new Error('O pacote não contém um perfil criptografado válido.');
  const existing = await dbGet(PROFILE_STORE, record.accountId);
  if (existing && !replace) throw new Error('Já existe um perfil correspondente neste dispositivo. Escolha substituir somente depois de conferir o backup.');
  record.loginHash ||= record.accountId;
  record.updatedAt = Date.now();
  record.expiresAt = Date.now() + TTL_MS;
  record.publicSummary = { ...record.publicSummary, expiresAt: record.expiresAt, lastAccessAt: Date.now() };
  await dbPut(PROFILE_STORE, record);
  return { accountId: record.accountId, ...record.publicSummary };
};

export const changeStudentPassword = async (accountId, currentPassword, newPassword) => {
  const record = await dbGet(PROFILE_STORE, accountId);
  if (!record) throw new Error('Perfil não encontrado.');
  const dataKey = await unwrapDataKeyForStudent(record.studentWrap, currentPassword, accountId).catch(() => { throw new Error('Senha atual incorreta.'); });
  record.studentWrap = await wrapDataKeyForStudent(dataKey, newPassword, accountId);
  const profile = await decryptProfile(record, dataKey);
  await appendAuditEvent(profile, 'student_password_changed', {});
  record.encryptedProfile = await encryptProfile(profile, dataKey, accountId);
  record.updatedAt = Date.now();
  await dbPut(PROFILE_STORE, record);
  unlockedKeys.set(accountId, dataKey);
  return true;
};

export const changeProfileIdentity = async (accountId, password, newStudentName, newClassName, reason = '') => {
  const record = await dbGet(PROFILE_STORE, accountId);
  if (!record) throw new Error('Perfil não encontrado.');
  if (String(newStudentName).trim().length < 5 || String(newClassName).trim().length < 2) throw new Error('Informe nome completo e turma.');
  if (String(reason).trim().length < 4) throw new Error('Informe o motivo da correção.');
  const dataKey = await unwrapDataKeyForStudent(record.studentWrap, password, accountId).catch(() => { throw new Error('Senha local incorreta.'); });
  const profile = await decryptProfile(record, dataKey);
  const nextLoginHash = await buildAccountId(newStudentName, newClassName);
  const duplicate = (await dbGetAll(PROFILE_STORE)).some((item) => item.accountId !== accountId && (item.loginHash || item.accountId) === nextLoginHash);
  if (duplicate) throw new Error('Já existe outro perfil com esse nome e turma.');
  const previous = { studentName: profile.studentName, className: profile.className };
  profile.studentName = String(newStudentName).trim();
  profile.className = String(newClassName).trim();
  profile.identityHistory = [...(profile.identityHistory || []), { at: new Date().toISOString(), previous, current: { studentName: profile.studentName, className: profile.className }, reason: String(reason).trim().slice(0, 300) }].slice(-50);
  await appendAuditEvent(profile, 'identity_changed', { previous, current: { studentName: profile.studentName, className: profile.className }, reason: String(reason).trim().slice(0, 300) });
  record.loginHash = nextLoginHash;
  record.publicSummary = publicSummaryFromProfile(profile, record);
  record.encryptedProfile = await encryptProfile(profile, dataKey, accountId);
  record.updatedAt = Date.now();
  record.expiresAt = Date.now() + TTL_MS;
  await dbPut(PROFILE_STORE, record);
  unlockedKeys.set(accountId, dataKey);
  return profile;
};

export const requestPersistentStorage = async () => {
  if (!navigator?.storage?.persist) return { supported: false, granted: false };
  const granted = await navigator.storage.persist();
  return { supported: true, granted };
};

export const getStorageStatus = async () => {
  const estimate = await navigator?.storage?.estimate?.().catch?.(() => null) || null;
  const persisted = await navigator?.storage?.persisted?.().catch?.(() => false) || false;
  return { estimate, persisted, indexedDb: hasIndexedDb() };
};

export const getRecoveryStatus = async () => {
  const config = await getSetting('teacherRecovery', null);
  const records = await dbGetAll(PROFILE_STORE);
  return {
    configured: Boolean(config?.publicKey),
    keyId: config?.keyId || '',
    createdAt: config?.createdAt || '',
    protectedProfiles: records.filter((record) => record.recoveryWrap?.keyId === config?.keyId).length,
    totalProfiles: records.length,
  };
};

export const createTeacherRecoveryKit = async (masterPassword, teacherLabel = 'Professor') => {
  if (String(masterPassword).length < 12) throw new Error('Use uma frase-senha mestre com pelo menos 12 caracteres.');
  const pair = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
  const publicKey = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const privateKey = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const keyId = randomId('teacher-key');
  const salt = randomBytes(16);
  const masterKey = await deriveAesKey(masterPassword, salt, ADMIN_KDF_ITERATIONS);
  const protectedPrivateKey = await aesEncrypt(masterKey, privateKey, `ctfds-admin-kit:${keyId}`);
  const kit = {
    schema: 'ctfds-admin-recovery-v1',
    version: 1,
    keyId,
    createdAt: new Date().toISOString(),
    teacherLabel: String(teacherLabel || 'Professor').slice(0, 80),
    publicKey,
    protectedPrivateKey: {
      algorithm: 'PBKDF2-HMAC-SHA-256+A256GCM',
      salt: bytesToBase64(salt),
      iterations: ADMIN_KDF_ITERATIONS,
      iv: protectedPrivateKey.iv,
      ciphertext: protectedPrivateKey.ciphertext,
    },
  };
  await putSetting('teacherRecovery', { keyId, publicKey, createdAt: kit.createdAt, teacherLabel: kit.teacherLabel });
  return kit;
};

export const installRecoveryPublicKey = async (kit) => {
  if (!kit || kit.schema !== 'ctfds-admin-recovery-v1' || !kit.publicKey || !kit.keyId) throw new Error('Arquivo administrativo inválido.');
  await putSetting('teacherRecovery', { keyId: kit.keyId, publicKey: kit.publicKey, createdAt: kit.createdAt, teacherLabel: kit.teacherLabel || 'Professor' });
  return true;
};

const decryptTeacherPrivateKey = async (kit, masterPassword) => {
  if (!kit || kit.schema !== 'ctfds-admin-recovery-v1') throw new Error('Arquivo administrativo incompatível.');
  const protectedKey = kit.protectedPrivateKey;
  const masterKey = await deriveAesKey(masterPassword, base64ToBytes(protectedKey.salt), protectedKey.iterations || ADMIN_KDF_ITERATIONS);
  const privateJwk = await aesDecrypt(masterKey, protectedKey, `ctfds-admin-kit:${kit.keyId}`).catch(() => { throw new Error('Senha mestre ou arquivo administrativo incorreto.'); });
  return crypto.subtle.importKey('jwk', privateJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
};

export const recoverStudentPassword = async ({ accountId, newPassword, masterPassword, kit, reason = '', adminId = 'Professor' }) => {
  if (String(newPassword).length < 6) throw new Error('A nova senha do aluno deve ter pelo menos 6 caracteres.');
  if (String(reason).trim().length < 4) throw new Error('Registre um motivo para a recuperação.');
  const record = await dbGet(PROFILE_STORE, accountId);
  if (!record) throw new Error('Perfil não encontrado.');
  if (!record.recoveryWrap) throw new Error('Este perfil ainda não possui proteção administrativa. O aluno precisa desbloqueá-lo uma vez após a configuração da recuperação.');
  if (record.recoveryWrap.keyId !== kit.keyId) throw new Error('O perfil foi protegido por outra chave administrativa.');
  const privateKey = await decryptTeacherPrivateKey(kit, masterPassword);
  const rawDataKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, base64ToBytes(record.recoveryWrap.ciphertext)).catch(() => { throw new Error('Não foi possível abrir a chave de recuperação deste perfil.'); });
  const dataKey = await importDataKey(new Uint8Array(rawDataKey));
  const profile = await decryptProfile(record, dataKey);
  record.studentWrap = await wrapDataKeyForStudent(dataKey, newPassword, accountId);
  await appendAuditEvent(profile, 'administrative_password_reset', { reason: String(reason).trim().slice(0, 300), adminId: String(adminId).slice(0, 80), identityChanged: false, progressPreserved: true });
  record.encryptedProfile = await encryptProfile(profile, dataKey, accountId);
  record.updatedAt = Date.now();
  record.expiresAt = Date.now() + TTL_MS;
  await dbPut(PROFILE_STORE, record);
  return { displayName: record.publicSummary.displayName, className: record.publicSummary.className };
};

export const verifyAuditChain = async (profile) => {
  const events = profile?.audit?.events || [];
  let previousHash = 'GENESIS';
  for (const item of events) {
    if (item.previousHash !== previousHash) return false;
    const { hash, ...body } = item;
    if (await sha256Hex(JSON.stringify(body)) !== hash) return false;
    previousHash = hash;
  }
  return true;
};

export const storageConstants = { schema: SCHEMA, ttlMs: TTL_MS, platformVersion: PLATFORM_VERSION };

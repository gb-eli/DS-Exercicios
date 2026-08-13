import { canonicalStringify, hmacSha256Sync, secureId, secureRandomHex, sha256Sync, assertSafeData } from './integrity.js';
import { storeItems } from '../data/store-items.js';

export const WALLET_SCHEMA_VERSION = 1;
const GENESIS = 'GENESIS';
const NUMERIC_CURRENCIES = new Set(['COINS', 'XP', 'STARS']);
const DEFAULT_ITEMS = ['theme-neon', 'avatar-ghost', 'effect-matrix'];
const DEFAULT_BADGES = ['Primeiro Acesso'];

const emptyBalances = () => ({
  COINS: { available: 0, pending: 0, blocked: 0 },
  XP: { available: 0, pending: 0, blocked: 0 },
  STARS: { available: 0, pending: 0, blocked: 0 },
});

const bucketForStatus = (status) => status === 'APPROVED' ? 'available' : ['PENDING', 'UNDER_REVIEW'].includes(status) ? 'pending' : status === 'BLOCKED' ? 'blocked' : null;
const cloneBalances = (balances) => JSON.parse(JSON.stringify(balances || emptyBalances()));
const catalogItem = (id) => storeItems.find((item) => item.id === id);

const transactionPayload = (tx) => {
  const copy = { ...tx };
  delete copy.hash;
  delete copy.integrityTag;
  return copy;
};

const appendIncident = (wallet, code, message, metadata = {}) => {
  wallet.incidents ||= [];
  const duplicate = wallet.incidents.at(-1)?.code === code && wallet.incidents.at(-1)?.message === message;
  if (!duplicate) wallet.incidents.push({ id: secureId('incident'), code, message, at: new Date().toISOString(), metadata });
  wallet.incidents = wallet.incidents.slice(-100);
};

const createWallet = (profile) => ({
  schemaVersion: WALLET_SCHEMA_VERSION,
  walletId: secureId('wallet'),
  integrityKey: secureRandomHex(32),
  status: 'VALID',
  requiresReview: false,
  ledger: [],
  balances: emptyBalances(),
  headHash: GENESIS,
  incidents: [],
  lastReconciledAt: '',
  lastValidSnapshot: null,
  migration: { fromLegacyFields: true, at: new Date().toISOString(), appVersion: '2.3.0' },
});

const rawAppend = (profile, input) => {
  const wallet = profile.wallet;
  const sequence = wallet.ledger.length + 1;
  const previousHash = wallet.ledger.at(-1)?.hash || GENESIS;
  const currency = input.currency;
  const status = input.status || 'APPROVED';
  const amount = Number(input.amount || 0);
  const balancesBefore = cloneBalances(wallet.balances);
  const balancesAfter = cloneBalances(wallet.balances);
  const bucket = bucketForStatus(status);
  if (NUMERIC_CURRENCIES.has(currency) && bucket) balancesAfter[currency][bucket] += amount;
  const tx = {
    id: input.id || secureId('tx'), sequence, schemaVersion: WALLET_SCHEMA_VERSION,
    profileId: profile.accountId, walletId: wallet.walletId, currency,
    type: input.type || 'REWARD', status, amount,
    createdAt: input.createdAt || new Date().toISOString(), source: input.source || 'system', sourceId: input.sourceId || '',
    itemId: input.itemId || '', quantity: Number(input.quantity || 0),
    balanceBefore: NUMERIC_CURRENCIES.has(currency) ? balancesBefore[currency].available + balancesBefore[currency].pending + balancesBefore[currency].blocked : 0,
    balanceAfter: NUMERIC_CURRENCIES.has(currency) ? balancesAfter[currency].available + balancesAfter[currency].pending + balancesAfter[currency].blocked : 0,
    availableBefore: NUMERIC_CURRENCIES.has(currency) ? balancesBefore[currency].available : 0,
    availableAfter: NUMERIC_CURRENCIES.has(currency) ? balancesAfter[currency].available : 0,
    pendingBefore: NUMERIC_CURRENCIES.has(currency) ? balancesBefore[currency].pending : 0,
    pendingAfter: NUMERIC_CURRENCIES.has(currency) ? balancesAfter[currency].pending : 0,
    blockedBefore: NUMERIC_CURRENCIES.has(currency) ? balancesBefore[currency].blocked : 0,
    blockedAfter: NUMERIC_CURRENCIES.has(currency) ? balancesAfter[currency].blocked : 0,
    appVersion: '2.3.0', toolVersion: input.toolVersion || '', deviceSessionId: input.deviceSessionId || '',
    nonce: input.nonce || secureRandomHex(12), previousHash, metadata: input.metadata || {},
  };
  tx.hash = sha256Sync(canonicalStringify(transactionPayload(tx)));
  tx.integrityTag = hmacSha256Sync(wallet.integrityKey, `${previousHash}|${tx.hash}`);
  wallet.ledger.push(tx);
  wallet.balances = balancesAfter;
  wallet.headHash = tx.hash;
  if (currency === 'COINS') profile.coins = Math.max(0, Math.trunc(balancesAfter.COINS.available));
  if (currency === 'XP') profile.xp = Math.max(0, Math.trunc(balancesAfter.XP.available));
  if (currency === 'STARS') profile.stars = Math.max(0, Math.trunc(balancesAfter.STARS.available));
  if (currency === 'ITEM' && status === 'APPROVED') {
    profile.inventory ||= [];
    if (amount >= 0 && !profile.inventory.includes(tx.itemId)) profile.inventory.push(tx.itemId);
    if (amount < 0) profile.inventory = profile.inventory.filter((id) => id !== tx.itemId);
  }
  if (currency === 'BADGE' && status === 'APPROVED') {
    profile.badges ||= [];
    if (amount >= 0 && !profile.badges.includes(tx.itemId)) profile.badges.push(tx.itemId);
    if (amount < 0) profile.badges = profile.badges.filter((id) => id !== tx.itemId);
  }
  return tx;
};

const initializeWallet = (profile) => {
  profile.wallet = createWallet(profile);
  rawAppend(profile, { currency: 'COINS', type: 'MIGRATION', amount: Number(profile.coins ?? 120), source: 'legacy-profile', sourceId: 'initial-coins' });
  if (Number(profile.xp || 0)) rawAppend(profile, { currency: 'XP', type: 'MIGRATION', amount: Number(profile.xp), source: 'legacy-profile', sourceId: 'initial-xp' });
  if (Number(profile.stars || 0)) rawAppend(profile, { currency: 'STARS', type: 'MIGRATION', amount: Number(profile.stars), source: 'legacy-profile', sourceId: 'initial-stars' });
  [...new Set([...(profile.inventory || []), ...DEFAULT_ITEMS])].forEach((itemId) => rawAppend(profile, { currency: 'ITEM', type: 'MIGRATION', amount: 1, quantity: 1, itemId, source: 'legacy-profile', sourceId: `item:${itemId}` }));
  [...new Set([...(profile.badges || []), ...DEFAULT_BADGES])].forEach((badge) => rawAppend(profile, { currency: 'BADGE', type: 'MIGRATION', amount: 1, quantity: 1, itemId: badge, source: 'legacy-profile', sourceId: `badge:${badge}` }));
  return profile.wallet;
};

export const reconcileProfileState = (profile, { recordIncidents = true, clearReview = false } = {}) => {
  if (!profile || typeof profile !== 'object') return { profile, valid: false, errors: ['profile_missing'] };
  if (!profile.wallet?.ledger) initializeWallet(profile);
  const wallet = profile.wallet;
  if (clearReview) wallet.requiresReview = false;
  const errors = [];
  const reviewWasRequired = Boolean(wallet.requiresReview);
  try { assertSafeData(wallet); } catch (error) { errors.push('unsafe_structure'); if (recordIncidents) appendIncident(wallet, 'UNSAFE_STRUCTURE', error.message); }
  const balances = emptyBalances();
  const inventory = new Set();
  const badges = new Set();
  const ids = new Set(); const nonces = new Set();
  let previousHash = GENESIS;
  for (let index = 0; index < wallet.ledger.length; index += 1) {
    const tx = wallet.ledger[index];
    const expectedSequence = index + 1;
    if (tx.sequence !== expectedSequence) errors.push(`sequence:${expectedSequence}`);
    if (ids.has(tx.id)) errors.push(`duplicate_id:${tx.id}`); else ids.add(tx.id);
    if (nonces.has(tx.nonce)) errors.push(`duplicate_nonce:${tx.nonce}`); else nonces.add(tx.nonce);
    if (tx.previousHash !== previousHash) errors.push(`previous_hash:${expectedSequence}`);
    const expectedHash = sha256Sync(canonicalStringify(transactionPayload(tx)));
    if (expectedHash !== tx.hash) errors.push(`hash:${expectedSequence}`);
    const expectedTag = hmacSha256Sync(wallet.integrityKey, `${tx.previousHash}|${tx.hash}`);
    if (expectedTag !== tx.integrityTag) errors.push(`integrity:${expectedSequence}`);
    const bucket = bucketForStatus(tx.status);
    if (NUMERIC_CURRENCIES.has(tx.currency) && bucket) {
      const before = cloneBalances(balances)[tx.currency];
      if (tx.availableBefore !== before.available || tx.pendingBefore !== before.pending || tx.blockedBefore !== before.blocked) errors.push(`balance_before:${expectedSequence}`);
      balances[tx.currency][bucket] += Number(tx.amount || 0);
      const after = balances[tx.currency];
      if (tx.availableAfter !== after.available || tx.pendingAfter !== after.pending || tx.blockedAfter !== after.blocked) errors.push(`balance_after:${expectedSequence}`);
    }
    if (tx.status === 'APPROVED' && tx.currency === 'ITEM') {
      if (Number(tx.amount) >= 0) inventory.add(tx.itemId); else inventory.delete(tx.itemId);
    }
    if (tx.status === 'APPROVED' && tx.currency === 'BADGE') {
      if (Number(tx.amount) >= 0) badges.add(tx.itemId); else badges.delete(tx.itemId);
    }
    previousHash = tx.hash;
  }
  if (balances.COINS.available < 0) errors.push('negative_available_coins');
  for (const itemId of inventory) if (!catalogItem(itemId)) errors.push(`unknown_item:${itemId}`);
  const derivedInventory = [...inventory];
  const derivedBadges = [...badges];
  const directMismatch = Number(profile.coins || 0) !== balances.COINS.available || Number(profile.xp || 0) !== balances.XP.available || Number(profile.stars || 0) !== balances.STARS.available;
  const inventoryMismatch = canonicalStringify([...(profile.inventory || [])].sort()) !== canonicalStringify(derivedInventory.sort());
  const badgeMismatch = canonicalStringify([...(profile.badges || [])].sort()) !== canonicalStringify(derivedBadges.sort());
  if (directMismatch) errors.push('derived_value_mismatch');
  if (inventoryMismatch) errors.push('inventory_mismatch');
  if (badgeMismatch) errors.push('badge_mismatch');
  if (reviewWasRequired) errors.push('review_required');
  profile.coins = Math.max(0, Math.trunc(balances.COINS.available));
  profile.xp = Math.max(0, Math.trunc(balances.XP.available));
  profile.stars = Math.max(0, Math.trunc(balances.STARS.available));
  profile.inventory = derivedInventory;
  profile.badges = derivedBadges;
  profile.equipped ||= {};
  if (!profile.inventory.includes(profile.equipped.theme)) profile.equipped.theme = 'theme-neon';
  if (!profile.inventory.includes(profile.equipped.avatar)) profile.equipped.avatar = 'avatar-ghost';
  if (!profile.inventory.includes(profile.equipped.effect)) profile.equipped.effect = 'effect-matrix';
  wallet.balances = balances;
  wallet.headHash = previousHash;
  wallet.lastReconciledAt = new Date().toISOString();
  const newIntegrityFailure = errors.some((error) => error !== 'review_required');
  if (newIntegrityFailure) wallet.requiresReview = true;
  wallet.status = errors.length ? 'BLOCKED' : 'VALID';
  if (errors.length && recordIncidents) appendIncident(wallet, 'RECONCILIATION_FAILED', 'A carteira apresentou inconsistências e foi bloqueada para conferência.', { errorCount: errors.length });
  if (!errors.length) wallet.lastValidSnapshot = { at: wallet.lastReconciledAt, headHash: wallet.headHash, balances: cloneBalances(balances), inventory: [...profile.inventory], badges: [...profile.badges] };
  return { profile, valid: errors.length === 0, errors, balances: cloneBalances(balances), inventory: [...profile.inventory], badges: [...profile.badges] };
};


export const resolveWalletReview = (profile, { reason, authorizationId } = {}) => {
  if (!String(reason || '').trim() || !String(authorizationId || '').trim()) throw new Error('Motivo e autorização são obrigatórios para revisar a carteira.');
  const result = reconcileProfileState(profile, { recordIncidents: false, clearReview: true });
  if (!result.valid) throw new Error('A carteira continua inconsistente e não pode ser liberada.');
  appendIncident(profile.wallet, 'REVIEW_RESOLVED', 'Carteira revisada e liberada por autorização registrada.', { reason: String(reason).slice(0, 200), authorizationId: String(authorizationId).slice(0, 120) });
  profile.wallet.status = 'VALID';
  profile.wallet.requiresReview = false;
  return result;
};

export const appendLedgerTransaction = (profile, input) => {
  const current = reconcileProfileState(profile);
  if (!current.valid && !input.allowBlocked) throw new Error('A carteira está bloqueada para conferência.');
  const tx = rawAppend(profile, input);
  const result = reconcileProfileState(profile);
  if (!result.valid) throw new Error('A transação não passou pela reconciliação.');
  return tx;
};

export const awardToProfile = (profile, { sourceId, source = 'activity', coins = 0, xp = 0, stars = 0, metadata = {} }) => {
  if (xp) appendLedgerTransaction(profile, { currency: 'XP', type: 'REWARD', amount: xp, source, sourceId, metadata });
  if (coins) appendLedgerTransaction(profile, { currency: 'COINS', type: 'REWARD', amount: coins, source, sourceId, metadata });
  if (stars) appendLedgerTransaction(profile, { currency: 'STARS', type: 'REWARD', amount: stars, source, sourceId, metadata });
  return profile;
};

export const spendXp = (profile, amount, sourceId, metadata = {}) => {
  reconcileProfileState(profile);
  if (profile.wallet.status !== 'VALID') throw new Error('Carteira bloqueada para conferência.');
  if (profile.xp < amount) throw new Error('XP insuficiente.');
  appendLedgerTransaction(profile, { currency: 'XP', type: 'PENALTY', amount: -Math.abs(amount), source: 'hint', sourceId, metadata });
  return profile;
};

export const grantBadge = (profile, badge, sourceId = '') => {
  reconcileProfileState(profile);
  if (profile.badges.includes(badge)) return false;
  appendLedgerTransaction(profile, { currency: 'BADGE', type: 'REWARD', amount: 1, quantity: 1, itemId: badge, source: 'achievement', sourceId: sourceId || `badge:${badge}` });
  return true;
};

export const purchaseStoreItem = (profile, item) => {
  const before = structuredClone(profile);
  const result = reconcileProfileState(profile);
  if (!result.valid || profile.wallet.status !== 'VALID') throw new Error('A carteira está bloqueada para conferência.');
  if (!item?.enabled) throw new Error('Item indisponível.');
  if (profile.inventory.includes(item.id)) {
    profile.equipped[item.type] = item.id;
    return { owned: true, receipt: null };
  }
  if (profile.coins < item.price) throw new Error(`Saldo insuficiente. Faltam ${item.price - profile.coins} Cyber Coins.`);
  const receiptId = secureId('receipt');
  try {
    appendLedgerTransaction(profile, { currency: 'COINS', type: 'PURCHASE', amount: -item.price, source: 'store', sourceId: receiptId, itemId: item.id, quantity: 1, metadata: { catalogVersion: item.version, price: item.price, rarity: item.rarity } });
    appendLedgerTransaction(profile, { currency: 'ITEM', type: 'PURCHASE', amount: 1, source: 'store', sourceId: receiptId, itemId: item.id, quantity: 1, metadata: { catalogVersion: item.version, price: item.price } });
    profile.equipped[item.type] = item.id;
    reconcileProfileState(profile);
    return { owned: false, receipt: profile.wallet.ledger.filter((tx) => tx.sourceId === receiptId) };
  } catch (error) {
    Object.keys(profile).forEach((key) => delete profile[key]);
    Object.assign(profile, before);
    throw error;
  }
};

export const getWalletSummary = (profile) => {
  const result = reconcileProfileState(profile);
  return {
    status: profile.wallet.status,
    coins: { ...result.balances.COINS }, xp: { ...result.balances.XP }, stars: { ...result.balances.STARS },
    transactionCount: profile.wallet.ledger.length,
    incidents: profile.wallet.incidents || [],
    headHash: profile.wallet.headHash,
    valid: result.valid,
  };
};

export const walletRecentTransactions = (profile, limit = 12) => {
  reconcileProfileState(profile);
  return profile.wallet.ledger.slice(-limit).reverse();
};

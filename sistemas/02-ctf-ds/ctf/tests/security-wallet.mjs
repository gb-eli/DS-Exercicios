import assert from 'node:assert/strict';
import { createDefaultProfile, normalizeProfile } from '../js/core/state.js';
import { appendLedgerTransaction, awardToProfile, getWalletSummary, purchaseStoreItem, reconcileProfileState, resolveWalletReview } from '../js/core/wallet.js';
import { storeItems } from '../js/data/store-items.js';
import { assertSafeData, sha256Sync } from '../js/core/integrity.js';
import { escapeHtml, safeExternalUrl } from '../js/core/utils.js';
import { hasRequiredAcceptances, registerTermsAcceptance, TERMS_HASH, TERMS_SECTIONS } from '../js/data/terms.js';
import { buildEvidenceHtml } from '../js/modules/delivery.js';
import { renderChallengeModal } from '../js/modules/ctf.js';
import { challenges } from '../js/data/challenges.js';

const makeProfile = () => normalizeProfile(createDefaultProfile('qa-wallet', 'Aluno <QA>', '2º DS A'));
const profile = makeProfile();
let summary = getWalletSummary(profile);
assert.equal(summary.valid, true);
assert.equal(summary.coins.available, 120);
assert.ok(profile.wallet.ledger.length >= 5);
assert.equal(sha256Sync('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

awardToProfile(profile, { sourceId: 'mission:test', coins: 200, xp: 50, stars: 2 });
summary = getWalletSummary(profile);
assert.equal(summary.coins.available, 320);
assert.equal(summary.xp.available, 50);
assert.equal(summary.stars.available, 2);

const purchasable = storeItems.find((item) => !profile.inventory.includes(item.id) && item.price <= 320);
assert.ok(purchasable, 'O catálogo deve conter item comprável no teste.');
const before = getWalletSummary(profile).coins.available;
assert.equal(purchaseStoreItem(profile, purchasable).owned, false);
assert.equal(getWalletSummary(profile).coins.available, before - purchasable.price);
assert.ok(profile.inventory.includes(purchasable.id));
assert.equal(purchaseStoreItem(profile, purchasable).owned, true);

profile.coins = 9_999_999;
summary = getWalletSummary(profile);
assert.equal(summary.valid, false);
assert.equal(summary.status, 'BLOCKED');
assert.notEqual(profile.coins, 9_999_999);
assert.throws(() => purchaseStoreItem(profile, storeItems.find((item) => !profile.inventory.includes(item.id)) || purchasable), /bloqueada/i);
assert.equal(resolveWalletReview(profile, { reason: 'Revisão automatizada do campo derivado', authorizationId: 'signed-test-grant' }).valid, true);
assert.equal(getWalletSummary(profile).status, 'VALID');

const bucketProfile = makeProfile();
appendLedgerTransaction(bucketProfile, { currency: 'COINS', type: 'HOLD', status: 'UNDER_REVIEW', amount: 30, source: 'integrity-test', sourceId: 'pending-01' });
appendLedgerTransaction(bucketProfile, { currency: 'COINS', type: 'BLOCK', status: 'BLOCKED', amount: 20, source: 'integrity-test', sourceId: 'blocked-01' });
const bucketSummary = getWalletSummary(bucketProfile);
assert.equal(bucketSummary.coins.available, 120);
assert.equal(bucketSummary.coins.pending, 30);
assert.equal(bucketSummary.coins.blocked, 20);
assert.equal(bucketSummary.valid, true);

const chainTamper = makeProfile();
chainTamper.wallet.ledger[0].amount = 999999;
assert.equal(reconcileProfileState(chainTamper).valid, false);
assert.equal(chainTamper.wallet.status, 'BLOCKED');

const inventoryTamper = makeProfile();
inventoryTamper.inventory.push('item-injetado');
assert.equal(reconcileProfileState(inventoryTamper).valid, false);
assert.equal(inventoryTamper.wallet.status, 'BLOCKED');

assert.equal(hasRequiredAcceptances(profile), false);
registerTermsAcceptance(profile, { privacyNoticeViewed: true, fullTermsOpened: true, deviceSessionId: 'qa-session' });
assert.equal(hasRequiredAcceptances(profile), true);
assert.ok(TERMS_SECTIONS.length >= 16);
assert.equal(TERMS_HASH.length, 64);
const evidence = buildEvidenceHtml(profile);
assert.match(evidence, /Termo e compromisso pedagógico/i);
assert.match(evidence, /não determinam a nota/i);
assert.ok(!evidence.includes('<QA>'));

assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
assert.throws(() => safeExternalUrl('javascript:alert(1)'), /insegura/i);
assert.equal(safeExternalUrl('https://example.org/test'), 'https://example.org/test');
assert.throws(() => assertSafeData(JSON.parse('{"__proto__":{"polluted":true}}')), /chave proibida/i);
assert.throws(() => assertSafeData({ constructor: { prototype: {} } }), /chave proibida/i);
const modal = renderChallengeModal(challenges[0], profile);
assert.match(modal, /AMBIENTE AUTORIZADO/);
assert.match(modal, /Testar sites, redes, contas, dispositivos, credenciais ou pessoas reais/i);
console.log('OK: ledger, três saldos, compra, adulteração, termos, evidência, XSS e escopo autorizado validados.');

import { storeItems, STORE_CATALOG_VERSION } from '../data/store-items.js';
import { escapeHtml } from '../core/utils.js';
import { getWalletSummary, walletRecentTransactions } from '../core/wallet.js';

const statusLabel = (status) => ({ VALID: 'VALIDADA', BLOCKED: 'BLOQUEADA', UNDER_REVIEW: 'EM ANÁLISE' }[status] || status);
const txLabel = (tx) => ({ REWARD: 'Recompensa', PURCHASE: 'Compra', MIGRATION: 'Migração', PENALTY: 'Penalidade', REFUND: 'Estorno', REVERSAL: 'Reversão' }[tx.type] || tx.type);

export const renderStore = (profile, filter = 'all') => {
  const visible = filter === 'all' ? storeItems : storeItems.filter((item) => item.type === filter);
  const wallet = getWalletSummary(profile);
  const recent = walletRecentTransactions(profile, 10).filter((tx) => tx.currency === 'COINS' || tx.currency === 'ITEM');
  return `
    <div class="page-head"><div><p class="eyebrow">CYBER STORE // GAMIFICAÇÃO EDUCACIONAL</p><h1>Loja do Operador</h1><p>Use moedas virtuais para personalização. Itens, saldo e compras não possuem valor financeiro e não influenciam nota ou proficiência.</p></div><span class="resource-pill ${wallet.status !== 'VALID' ? 'wallet-warning' : ''}">◇ ${profile.coins} DISPONÍVEIS</span></div>
    <section class="wallet-overview card ${wallet.status !== 'VALID' ? 'wallet-blocked' : ''}">
      <div><p class="eyebrow">CARTEIRA AUDITÁVEL</p><h2>${statusLabel(wallet.status)}</h2><small>${wallet.transactionCount} registros encadeados · catálogo v${STORE_CATALOG_VERSION}</small></div>
      <div class="wallet-balances"><div><span>Disponível</span><b>${wallet.coins.available} ◇</b></div><div><span>Em análise</span><b>${wallet.coins.pending} ◇</b></div><div><span>Bloqueado</span><b>${wallet.coins.blocked} ◇</b></div></div>
      ${wallet.status !== 'VALID' ? '<p class="wallet-alert">O sistema encontrou uma inconsistência. Compras e novas recompensas ficam bloqueadas até conferência do professor ou restauração de um backup válido.</p>' : '<p class="muted">O saldo exibido é recalculado a partir do extrato. Alterar somente o DOM ou um campo do perfil não cria uma compra válida.</p>'}
    </section>
    <div class="filter-bar">${['all','theme','avatar','effect'].map((type) => `<button class="filter-button ${filter === type ? 'active' : ''}" data-store-filter="${type}">${({all:'Todos',theme:'Temas',avatar:'Avatares',effect:'Efeitos'})[type]}</button>`).join('')}</div>
    <div class="store-grid">${visible.map((item) => {
      const owned = profile.inventory.includes(item.id);
      const equipped = profile.equipped[item.type] === item.id;
      return `<article class="store-card card"><div class="store-preview" style="--preview:${item.preview.startsWith('#') ? item.preview : 'var(--accent)'}">${escapeHtml(item.preview)}</div><div class="store-tags"><span>${escapeHtml(item.rarity)}</span><span>${escapeHtml(item.performanceTier.toUpperCase())}</span></div><p class="eyebrow">${item.type.toUpperCase()}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><small>${escapeHtml(item.accessibilityFallback)}</small><div class="store-foot"><span class="price ${owned ? 'owned' : ''}">${owned ? (equipped ? 'EQUIPADO' : 'ADQUIRIDO') : `◇ ${item.price}`}</span><button class="${owned ? 'secondary-button' : 'primary-button'}" data-store-item="${item.id}" ${wallet.status !== 'VALID' || !item.enabled ? 'disabled' : ''}>${owned ? (equipped ? 'ATIVO' : 'EQUIPAR') : 'DESBLOQUEAR'}</button></div></article>`;
    }).join('')}</div>
    <article class="card wallet-ledger"><div class="section-title" style="margin-top:0"><h2>EXTRATO RECENTE</h2><small>REGISTROS NÃO SÃO EDITADOS; CORREÇÕES USAM ESTORNO</small></div>${recent.length ? `<div class="ledger-list">${recent.map((tx) => `<div><span>${escapeHtml(txLabel(tx))}</span><strong>${tx.currency === 'COINS' ? `${tx.amount > 0 ? '+' : ''}${tx.amount} ◇` : escapeHtml(tx.itemId)}</strong><small>${escapeHtml(tx.sourceId || tx.source)} · ${escapeHtml(new Date(tx.createdAt).toLocaleString('pt-BR'))}</small></div>`).join('')}</div>` : '<p class="muted">Nenhuma transação de loja registrada.</p>'}</article>`;
};

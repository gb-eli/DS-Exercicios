import { storeItems } from '../data/store-items.js';
import { escapeHtml } from '../core/utils.js';

export const renderStore = (profile, filter = 'all') => {
  const visible = filter === 'all' ? storeItems : storeItems.filter((item) => item.type === filter);
  return `
    <div class="page-head"><div><p class="eyebrow">CYBER STORE // PERSONALIZAÇÃO LOCAL</p><h1>Loja do Operador</h1><p>Troque moedas conquistadas nas missões por temas, avatares e efeitos visuais. Nenhuma compra real é realizada.</p></div><span class="resource-pill">◇ ${profile.coins} CYBER COINS</span></div>
    <div class="filter-bar">${['all','theme','avatar','effect'].map((type) => `<button class="filter-button ${filter === type ? 'active' : ''}" data-store-filter="${type}">${({all:'Todos',theme:'Temas',avatar:'Avatares',effect:'Efeitos'})[type]}</button>`).join('')}</div>
    <div class="store-grid">${visible.map((item) => {
      const owned = profile.inventory.includes(item.id);
      const equipped = profile.equipped[item.type] === item.id;
      return `<article class="store-card card"><div class="store-preview" style="--preview:${item.preview.startsWith('#') ? item.preview : 'var(--accent)'}">${escapeHtml(item.preview)}</div><p class="eyebrow">${item.type.toUpperCase()}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><div class="store-foot"><span class="price ${owned ? 'owned' : ''}">${owned ? (equipped ? 'EQUIPADO' : 'ADQUIRIDO') : `◇ ${item.price}`}</span><button class="${owned ? 'secondary-button' : 'primary-button'}" data-store-item="${item.id}">${owned ? (equipped ? 'ATIVO' : 'EQUIPAR') : 'DESBLOQUEAR'}</button></div></article>`;
    }).join('')}</div>`;
};

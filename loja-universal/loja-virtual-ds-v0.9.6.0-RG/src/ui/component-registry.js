export const DS_UI_COMPONENTS = Object.freeze({
  shell: ['topbar', 'sidebar', 'mobile-nav', 'view-container'],
  navigation: ['nav-item', 'quick-card', 'tabs', 'segmented-control'],
  store: ['promo-banner', 'search-field', 'category-chip', 'product-card', 'product-modal'],
  wallet: ['balance-card', 'balance-state', 'ledger-entry', 'validation-flow'],
  inventory: ['inventory-item', 'slot-row', 'equipment-chip', 'empty-state'],
  avatar: ['avatar-stage', 'preview-toolbar', 'emote-button', 'quality-selector'],
  feedback: ['toast', 'status-chip', 'module-loader', 'progress-track'],
  integrity: ['score-ring', 'check-row', 'timeline-row']
});

export const DS_UI_VIEWS = Object.freeze([
  'homeView','storeView','walletView','inventoryView','avatarView',
  'profileView','integrityView','componentsView','architectureView','assetsView'
]);

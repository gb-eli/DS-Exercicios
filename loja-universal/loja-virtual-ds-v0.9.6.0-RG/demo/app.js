(() => {
  'use strict';
  const store = window.DSStore;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const memorySession = new Map();
  const memoryLocal = new Map();
  const safeStorage = {
    sessionGet(key) { try { return sessionStorage.getItem(key); } catch (error) { return memorySession.get(key) || null; } },
    sessionSet(key, value) { try { sessionStorage.setItem(key, value); } catch (error) { memorySession.set(key, value); } },
    localGet(key) { try { return localStorage.getItem(key); } catch (error) { return memoryLocal.get(key) || null; } },
    localSet(key, value) { try { localStorage.setItem(key, value); } catch (error) { memoryLocal.set(key, value); } }
  };
  const money = value => new Intl.NumberFormat('pt-BR').format(Math.abs(Number(value) || 0));
  const rarityMap = Object.fromEntries(DS_CATALOG.rarities.map(rarity => [rarity.id, rarity]));
  const categories = [
    ['all', 'Todos'], ['animation', 'Animações'], ['aura', 'Auras'], ['clothing', 'Roupas'],
    ['accessory', 'Acessórios'], ['tool', 'Ferramentas'], ['appearance', 'Aparência'],
    ['vehicle', 'Veículos'], ['companion', 'Companheiros']
  ];
  const categoryLabels = Object.fromEntries(categories);
  const runtimeModules = window.DSRuntimeModules;
  const avatarProfile = window.DSAvatarProfile;
  const backpack = window.DSBackpack;
  const moduleDefinitions = {
    store: { title: 'Carregando Loja Virtual DS', icon: '◆', text: 'Preparando catálogo, ofertas e componentes da vitrine.' },
    inventory: { title: 'Carregando inventário', icon: '▣', text: 'Organizando itens adquiridos, categorias e slots.' },
    avatar3d: { title: 'Preparando visualizador', icon: '◉', text: 'Inicializando a estrutura de personagem e prévia 360°.' },
    animations: { title: 'Carregando animações', icon: '✦', text: 'Preparando emotes e clips solicitados.' },
    vfx: { title: 'Carregando estúdio VFX', icon: '✧', text: 'Inicializando auras, partículas, holografia e efeitos de tela.' },
    product3d: { title: 'Carregando prévia 360°', icon: '◉', text: 'Buscando o GLB original sem alterar materiais ou geometria.' },
    packages: { title: 'Abrindo pacotes gráficos', icon: '⇩', text: 'Carregando manifestos e controle de armazenamento.' },
    performance: { title: 'Preparando benchmark', icon: '▥', text: 'Carregando testes de CPU, GPU, partículas e estabilidade.' },
    integration: { title: 'Conectando SDK', icon: '↯', text: 'Carregando adaptadores somente para a central de integração.' },
    assets: { title: 'Abrindo kit gráfico', icon: '✧', text: 'Carregando estilos do catálogo visual.' }
  };
  const moduleCards = [
    ['Shell e perfil', '⌂', '#2ad7ff', 'pré-carregado', 'Interface mínima, navegação e resumo do usuário.'],
    ['Carteira', '◈', '#48e4a6', 'pré-carregado', 'Saldo resumido, extrato e validação de operações.'],
    ['Loja', '◆', '#2ad7ff', 'sob demanda', 'Catálogo, filtros, ofertas e prévias individuais.'],
    ['Inventário e Mochila', '▣', '#9a67ff', 'sob demanda', 'Coleção completa, atalhos persistentes e ações rápidas sem duplicar GLBs.'],
    ['Avatar 3D', '◉', '#ffbd32', 'equipamentos v0.5.0', 'GLB real, rig hierárquico, LOD, 16 slots e itens externos sob demanda.'],
    ['Animações e VFX', '✦', '#ff4fb8', 'implementado v0.6.0', '18 clips no GLB, 17 efeitos, partículas, auras, falas e transições.'],
    ['Laboratórios', '⚗', '#ff9642', 'por adaptador', 'Recursos especiais carregados apenas ao acessar.'],
    ['Diagnóstico', '⌁', '#77d7ff', 'sempre disponível', 'FPS, qualidade, cache e recuperação de falhas.']
  ];
  const slots = [
    ['hair','Cabelo','GLB externo','✦'],['head','Cabeça','Boné/capacete','◉'],['face','Rosto','Óculos/viseira','▱'],
    ['torso','Tronco','Roupa modular','▤'],['shoulder-left','Ombro esquerdo','Acessório','◁'],['shoulder-right','Ombro direito','Acessório','▷'],
    ['held-item-right','Mão direita','Ferramenta','→'],['held-item-left','Mão esquerda','Ferramenta','←'],['back','Costas','Mochila/jetpack','▣'],
    ['shield','Escudo','Escudo modular','◇'],['waist','Cintura','Acessório','═'],['foot-left','Pé esquerdo','Calçado','◒'],['foot-right','Pé direito','Calçado','◓'],
    ['vehicle','Veículo','Skate/hoverboard','⌁'],['aura','Aura','VFX modular','◎'],['companion','Companheiro','Drone/cubo','◌']
  ];
  const integrityChecks = [
    ['Carteira', 'Saldo conciliado pelo livro-caixa', '✓'], ['Extrato', 'Encadeamento de registros coerente', '✓'],
    ['Inventário', 'Itens reconhecidos no catálogo', '✓'], ['Recompensas', 'Eventos sem duplicidade', '✓'],
    ['Catálogo', 'Preços e raridades reconhecidos', '✓'], ['Perfil', 'Estrutura compatível com a versão', '✓']
  ];
  const emotes = [
    ['👋', 'Acenar'], ['🙋', 'Tchau'], ['🎉', 'Comemorar'], ['⬆️', 'Pular'],
    ['👏', 'Aplaudir'], ['🤔', 'Pensar'], ['👉', 'Apontar'], ['🪑', 'Sentar'], ['🎵','Dançar'], ['⌨','Digitar'], ['📖','Estudar'], ['📊','Apresentar'], ['📟','Scanner']
  ];

  let currentView = 'homeView';
  let selectedCategory = 'all';
  let inventoryCategory = 'all';
  let searchTerm = '';
  let sortMode = 'featured';
  let selectedItem = null;
  let ledgerFilter = 'all';
  let avatarAngle = 0;
  let autoRotateTimer = null;
  let roundOverride = 0;
  let integrationConfig = window.DS_INTEGRATION_CONFIG || { platforms: [] };
  let integrationSDK = window.DSStoreSDK?.createAdapter?.('desafio-ds', { profileId: 'perfil-demo', store }) || null;
  let sdkSessionLog = [];
  const sdkEventLabels = {
    TUTORIAL_COMPLETED: 'Tutorial concluído', TOOL_RESULT_CREATED: 'Resultado com ferramenta', LAB_COMPLETED: 'Laboratório concluído',
    PHASE_COMPLETED: 'Fase concluída', MISSION_COMPLETED: 'Missão concluída', CHALLENGE_COMPLETED: 'Desafio concluído',
    PROJECT_PUBLISHED: 'Projeto publicado', EVIDENCE_EXPORTED: 'Evidência exportada', ACHIEVEMENT_UNLOCKED: 'Conquista desbloqueada',
    SESSION_COMPLETED: 'Sessão concluída', LEARNING_PROGRESS: 'Evolução de aprendizagem', RECOVERY_COMPLETED: 'Recuperação concluída',
    TEACHER_REWARD: 'Recompensa do professor', COLLABORATION_VALIDATED: 'Colaboração validada', FEEDBACK_CONFIRMED: 'Feedback confirmado',
    BUG_REPORT_CONFIRMED: 'Erro confirmado'
  };

  function hash(input) {
    let value = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      value ^= input.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function roundId() {
    return Math.floor(Date.now() / 1800000) + roundOverride;
  }

  function offerFor(item) {
    const roll = hash(`${roundId()}:${item.id}`) % 1000;
    let percent = 0;
    if (roll >= 997) percent = 100;
    else if (roll >= 982) percent = 99;
    else if (roll >= 960) percent = 80;
    else if (roll >= 920) percent = 60;
    else if (roll >= 850) percent = 38;
    else if (roll >= 720) percent = 25;
    else if (roll >= 500) percent = 10;
    const price = percent === 100 ? 0 : Math.max(1, Math.round(item.basePrice * (1 - percent / 100)));
    return { percent, price };
  }

  function reviewFor(value) {
    return DS_ECONOMY_CONFIG.transactionReview.find(rule => value <= rule.max) || DS_ECONOMY_CONFIG.transactionReview.at(-1);
  }

  function setActiveNavigation(viewId) {
    $$('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === viewId));
  }

  function focusAvatarStage() {
    const stage = document.querySelector('#avatarView .avatar-stage');
    if (!stage) return;
    stage.classList.remove('animation-focus');
    void stage.offsetWidth;
    stage.classList.add('animation-focus');
    if (window.matchMedia('(max-width: 820px)').matches) {
      stage.scrollIntoView({ behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth', block: 'start' });
    }
  }

  async function playAvatarAction(clip, effectId = null) {
    if (currentView !== 'avatarView') await navigate('avatarView', 'avatar3d');
    else await loadModule('avatar3d');
    if (effectId) await loadModule('vfx');
    await wait(120);
    window.DSAvatarViewer?.play(clip);
    if (effectId) window.DSVFX?.play(effectId);
    focusAvatarStage();
  }

  async function loadModule(name) {
    if (!name) return { loaded: false, reason: 'core' };
    const definition = moduleDefinitions[name] || { title: 'Carregando módulo', icon: '◆', text: 'Preparando os recursos solicitados.' };
    const loader = $('#moduleLoader');
    const bar = $('#moduleLoaderProgress');
    const label = $('#moduleLoaderPercent');
    $('#moduleLoaderTitle').textContent = definition.title;
    $('#moduleLoaderIcon').textContent = definition.icon;
    $('#moduleLoaderText').textContent = definition.text;
    loader.hidden = false;
    const progress = (value, detail) => {
      const safe = Math.max(0, Math.min(100, Number(value) || 0));
      bar.style.width = `${safe}%`;
      label.textContent = `${Math.round(safe)}%`;
      if (detail) $('#moduleLoaderText').textContent = detail;
    };
    progress(3, definition.text);
    try {
      const result = await runtimeModules?.ensure?.(name, { onProgress: progress }) || { loaded: false, reason: 'core' };
      progress(100, 'Módulo pronto');
      await wait(100);
      safeStorage.sessionSet(`ds-module-${name}`, 'ready');
      window.DSCacheMemory?.register?.({id:`module:${name}`,label:`Módulo ${name}`,module:name,type:'module-state',bytes:64*1024,transient:true,dispose:()=>safeStorage.sessionSet(`ds-module-${name}`,'released')});
      return result;
    } catch (error) {
      console.error(`[DS Runtime] ${name}`, error);
      showToast('Módulo não carregado', `${definition.title}: ${error.message}`, true);
      throw error;
    } finally {
      loader.hidden = true;
      bar.style.width = '0';
    }
  }

  async function navigate(viewId, moduleName) {
    const previousView = currentView;
    if (!viewId || !document.getElementById(viewId)) return;
    await loadModule(moduleName);
    currentView = viewId;
    $$('.view').forEach(view => view.classList.toggle('active', view.id === viewId));
    setActiveNavigation(viewId);
    $('#sidebar').classList.remove('open');
    $('#scrim').hidden = true;
    window.scrollTo({ top: 0, behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth' });
    renderAll();
    document.dispatchEvent(new CustomEvent('ds-view-change', { detail: { previous: previousView, current: viewId, module: moduleName || null } }));
  }

  function showToast(title, message = '', error = false) {
    const toast = document.createElement('div');
    toast.className = `toast${error ? ' error' : ''}`;
    toast.innerHTML = `<span class="toast-icon">${error ? '!' : '✓'}</span><span><strong>${title}</strong><small>${message}</small></span>`;
    $('#toastRegion').append(toast);
    setTimeout(() => toast.remove(), 3900);
  }

  function renderBalances() {
    const state = store.getState();
    const ids = ['headerBalance', 'homeBalance', 'walletBalance', 'profileBalance'];
    ids.forEach(id => { const element = document.getElementById(id); if (element) element.textContent = money(state.balances.available); });
    ['reserved', 'pending', 'underReview', 'blocked'].forEach(key => {
      $$(`[data-balance="${key}"], [data-balance-home="${key}"]`).forEach(element => { element.textContent = money(state.balances[key]); });
    });
    ['homeIntegrity', 'integrityScore', 'profileIntegrity'].forEach(id => { const element = document.getElementById(id); if (element) element.textContent = state.integrity.score; });
    $('#ownedCount').textContent = state.inventory.length;
    $('#profileItems').textContent = state.inventory.length;
    const backpackCount = window.DSBackpack?.getDiagnostics?.().items.used || 0;
    const backpackMetric = $('#profileBackpackItems'); if (backpackMetric) backpackMetric.textContent = backpackCount;
    $('#profileTransactions').textContent = state.ledger.length;
    const pendingReviews = (state.reviews || []).filter(review => review.status === 'PENDING');
    const reviewNavCount = $('#reviewNavCount');
    if (reviewNavCount) reviewNavCount.textContent = pendingReviews.length;
    const walletStatusChip = $('#walletStatusChip');
    if (walletStatusChip) {
      const locked = store.isLocked?.('basic') || store.isLocked?.('store');
      walletStatusChip.textContent = locked ? 'Bloqueado' : pendingReviews.length ? 'Parcialmente em análise' : 'Liberado';
      walletStatusChip.className = `status-chip ${locked ? 'danger' : pendingReviews.length ? 'warning' : 'success'}`;
    }
    const percentage = Math.max(0, Math.min(100, state.integrity.score / 10));
    $('#scoreRing').style.background = `conic-gradient(var(--green) 0 ${percentage}%, #173046 ${percentage}% 100%)`;
    $('#integrityLabel').textContent = state.integrity.score >= 900 ? 'Integridade excelente' : state.integrity.score >= 750 ? 'Integridade estável' : 'Integridade em atenção';
  }

  function cardMarkup(item, compact = false) {
    const state = store.getState();
    const rarity = rarityMap[item.rarity];
    const offer = offerFor(item);
    const owned = state.inventory.includes(item.id);
    const equipped = avatarProfile?.isEquipped?.(item.id) || false;
    const category = categoryLabels[item.category] || item.category;
    const discount = offer.percent ? `<span class="discount-badge">${offer.percent === 100 ? 'GRÁTIS' : `${offer.percent}% OFF`}</span>` : '';
    const price = offer.percent ? `<del>${money(item.basePrice)} DS</del><strong>${offer.price === 0 ? 'Grátis' : `${money(offer.price)} DS`}</strong>` : `<strong>${money(item.basePrice)} DS</strong>`;
    return `<article class="product-card glass" style="--rarity:${rarity.accent}" data-product-id="${item.id}">
      <div class="product-media"><span class="product-rarity">${rarity.name}</span>${discount}<span class="product-icon"><img src="${item.thumbnail || `../assets/items/thumbnails/${item.id}.webp`}" alt="${item.name}" loading="lazy" decoding="async"></span></div>
      <div class="product-card-body"><div><h3>${item.name}</h3><span class="product-subtitle">${category} • ${item.slot}</span></div>
      <div class="product-price"><span class="price-stack">${price}</span>${owned ? `<span class="owned-pill${equipped ? ' equipped' : ''}">${equipped ? 'Equipado' : 'Adquirido'}</span><button class="button soft" data-open-product="${item.id}">Ver item</button>` : `<button class="button primary" data-open-product="${item.id}">Ver item</button>`}</div></div>
    </article>`;
  }

  function featuredItems() {
    const preferred = ['aura-energy-blue', 'scanner-prisma', 'shield-sentinel', 'celebration-fireworks'];
    return preferred.map(id => store.getItem(id)).filter(Boolean);
  }

  function renderFeatured() {
    $('#featuredGrid').innerHTML = featuredItems().map(item => cardMarkup(item)).join('');
    bindProductButtons($('#featuredGrid'));
  }

  function filteredItems() {
    const rank = item => rarityMap[item.rarity]?.rank || 0;
    let items = DS_CATALOG.items.filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const haystack = `${item.name} ${item.description} ${item.category} ${item.slot}`.toLowerCase();
      return categoryMatch && haystack.includes(searchTerm.toLowerCase());
    });
    if (sortMode === 'priceAsc') items.sort((a, b) => offerFor(a).price - offerFor(b).price);
    if (sortMode === 'priceDesc') items.sort((a, b) => offerFor(b).price - offerFor(a).price);
    if (sortMode === 'rarity') items.sort((a, b) => rank(b) - rank(a) || a.basePrice - b.basePrice);
    if (sortMode === 'featured') items.sort((a, b) => Number(offerFor(b).percent > 0) - Number(offerFor(a).percent > 0) || rank(b) - rank(a));
    return items;
  }

  function renderCategoryFilters() {
    $('#categoryFilters').innerHTML = categories.map(([id, label]) => `<button class="category-chip${selectedCategory === id ? ' active' : ''}" data-category="${id}">${label}</button>`).join('');
    $('#inventoryFilters').innerHTML = categories.map(([id, label]) => `<button class="category-chip${inventoryCategory === id ? ' active' : ''}" data-inventory-category="${id}">${label}</button>`).join('');
    $$('[data-category]').forEach(button => button.addEventListener('click', () => { selectedCategory = button.dataset.category; renderStore(); }));
    $$('[data-inventory-category]').forEach(button => button.addEventListener('click', () => { inventoryCategory = button.dataset.inventoryCategory; renderInventory(); }));
  }

  function renderStore() {
    renderCategoryFilters();
    const items = filteredItems();
    $('#catalogGrid').innerHTML = items.map(item => cardMarkup(item)).join('');
    $('#resultCount').textContent = `${items.length} ${items.length === 1 ? 'item' : 'itens'}`;
    $('#filterCount').textContent = selectedCategory === 'all' ? '0' : '1';
    bindProductButtons($('#catalogGrid'));
    renderPromotion();
  }

  function bindProductButtons(root = document) {
    $$('[data-open-product]', root).forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      openProduct(button.dataset.openProduct);
    }));
    $$('[data-product-id]', root).forEach(card => card.addEventListener('click', event => {
      if (event.target.closest('button')) return;
      const state = store.getState();
      openProduct(card.dataset.productId);
    }));
  }

  function renderPromotion() {
    const promoted = DS_CATALOG.items
      .map(item => ({ item, offer: offerFor(item) }))
      .filter(entry => entry.offer.percent >= 38)
      .sort((a, b) => b.offer.percent - a.offer.percent || b.item.basePrice - a.item.basePrice)[0] || { item: store.getItem('aura-gold-legend'), offer: { percent: 60, price: 4000 } };
    if (!promoted.item) return;
    $('#promoTitle').textContent = promoted.item.name;
    $('#promoDescription').textContent = promoted.item.description;
    $('#promoDiscount').textContent = promoted.offer.percent === 100 ? 'GRÁTIS' : `${promoted.offer.percent}% OFF`;
    $('#promoAction').onclick = () => openProduct(promoted.item.id);
    $('#promoTitle').dataset.itemId = promoted.item.id;
  }

  async function loadPreviewPack(item) {
    const key = `ds-pack-${item.pack}`;
    if (safeStorage.sessionGet(key) === 'ready') return;
    const loading = $('#previewLoading');
    loading.hidden = false;
    const progressBar = $('#previewProgress');
    const messages = [
      [15, 'Localizando pacote...'], [35, 'Preparando miniaturas...'], [58, 'Aplicando materiais de prévia...'],
      [78, 'Configurando animações compatíveis...'], [100, 'Prévia pronta.']
    ];
    for (const [progress, message] of messages) {
      progressBar.style.width = `${progress}%`;
      $('#previewLoadingText').textContent = message;
      await wait(110);
    }
    safeStorage.sessionSet(key, 'ready');
    loading.hidden = true;
    progressBar.style.width = '0';
  }

  async function openProduct(id) {
    selectedItem = store.getItem(id);
    if (!selectedItem) return;
    const rarity = rarityMap[selectedItem.rarity];
    const offer = offerFor(selectedItem);
    $('#productTitle').textContent = selectedItem.name;
    $('#productDescription').textContent = selectedItem.description;
    $('#productSymbol').innerHTML = `<img class="product-symbol" src="${selectedItem.vectorPreview || `../assets/items/vectors/${selectedItem.id}.svg`}" alt="${selectedItem.name}">`; 
    $('#productSlot').textContent = selectedItem.slot;
    $('#productPack').textContent = selectedItem.pack;
    $('#productType').textContent = selectedItem.previewType;
    $('#previewTypeLabel').textContent = selectedItem.previewType === 'vfx' ? 'Prévia de efeito' : selectedItem.previewType === 'animation' ? 'Prévia de animação' : 'Prévia 360°';
    $('#productRarity').textContent = rarity.name;
    $('#productRarity').style.color = rarity.accent;
    $('#basePrice').textContent = `${money(selectedItem.basePrice)} DS`;
    $('#discountLine').hidden = !offer.percent;
    $('#discountPrice').textContent = offer.percent === 100 ? 'Grátis' : `${money(offer.price)} DS • ${offer.percent}% OFF`;
    $('#productModal').classList.add('show');
    $('#productModal').setAttribute('aria-hidden', 'false');
    const owned = store.getState().inventory.includes(selectedItem.id);
    $('#buyProduct').disabled = owned;
    $('#buyProduct').textContent = owned ? 'Item já adquirido' : 'Validar e comprar';
    const quickEquip = $('#quickEquipProduct');
    if (quickEquip) { quickEquip.hidden = !(owned && selectedItem.model3d); quickEquip.textContent = avatarProfile?.isEquipped?.(selectedItem.id) ? 'Remover do conjunto' : 'Equipar agora'; }
    $('#productModal .product-modal')?.setAttribute('data-preview-mode','360');
    const equippedHost=$('#productEquippedPreview'); if(equippedHost) equippedHost.hidden=true;
    await loadPreviewPack(selectedItem);
    await loadModule('product3d');
    await window.DSProduct3D?.open(selectedItem);
  }

  function closeProduct() {
    window.DSProduct3D?.close();
    $('#productModal').classList.remove('show');
    $('#productModal').setAttribute('aria-hidden', 'true');
  }

  function validationStepsFor(item, offer) {
    const level = reviewFor(offer.price);
    return [
      ['Consultando catálogo oficial', 'Preço e versão do item'],
      ['Validando oferta da rodada', offer.percent ? `${offer.percent}% de desconto reconhecido` : 'Compra pelo preço normal'],
      ['Recalculando saldo', `Análise ${level.level} • meta ${level.targetSeconds[0]}–${level.targetSeconds[1]}s`],
      ['Conferindo extrato', 'Origem das moedas e duplicidades'],
      ['Registrando operação', 'Livro-caixa e inventário']
    ];
  }

  async function buySelectedItem() {
    if (!selectedItem) return;
    const offer = offerFor(selectedItem);
    closeProduct();
    window.DSTransactionVisuals?.start?.(selectedItem,offer);
    $('#transactionModal').classList.add('show');
    $('#transactionModal').setAttribute('aria-hidden', 'false');
    const steps = validationStepsFor(selectedItem, offer);
    $('#validationSteps').innerHTML = steps.map(([title, detail], index) => `<div class="validation-step" data-validation-step="${index}"><span>${title}<br><small>${detail}</small></span><strong>aguardando</strong></div>`).join('');
    $('#transactionTitle').textContent = 'Validando transação';
    $('#transactionSubtitle').textContent = `Processando ${selectedItem.name} pelo valor oficial.`;
    for (let index = 0; index < steps.length; index += 1) {
      const row = $(`[data-validation-step="${index}"]`);
      row.classList.add('active');
      row.querySelector('strong').textContent = 'validando';
      window.DSTransactionVisuals?.progress?.(index,steps.length);
      await wait(430);
      row.classList.remove('active');
      row.classList.add('done');
      row.querySelector('strong').textContent = 'ok';
    }
    try {
      const transaction = store.purchase(selectedItem.id, offer.percent);
      window.DSTransactionVisuals?.complete?.();
      $('#transactionTitle').textContent = 'Transação autorizada';
      $('#transactionSubtitle').textContent = `${selectedItem.name} foi enviado ao inventário.`;
      await wait(650);
      $('#transactionModal').classList.remove('show');
      $('#transactionModal').setAttribute('aria-hidden', 'true');
      showToast('Compra autorizada', `${money(Math.abs(transaction.amount))} moedas debitadas e item liberado.`);
      renderAll();
    } catch (error) {
      window.DSTransactionVisuals?.fail?.();
      const active = $$('.validation-step').at(-1);
      active?.classList.add('error');
      $('#transactionTitle').textContent = 'Transação não autorizada';
      $('#transactionSubtitle').textContent = error.message;
      await wait(1100);
      $('#transactionModal').classList.remove('show');
      $('#transactionModal').setAttribute('aria-hidden', 'true');
      showToast('Compra recusada', error.message, true);
    }
  }

  function renderLedger() {
    const state = store.getState();
    const transactions = [...state.ledger].reverse().filter(transaction => {
      if (ledgerFilter === 'all') return true;
      if (ledgerFilter === 'in') return transaction.amount > 0;
      if (ledgerFilter === 'out') return transaction.amount < 0;
      if (ledgerFilter === 'review') return ['UNDER_REVIEW', 'PENDING', 'BLOCKED'].includes(transaction.status) || transaction.type.startsWith('REVIEW_');
      return true;
    });
    $('#ledger').innerHTML = transactions.map(transaction => {
      const incoming = transaction.amount > 0;
      const neutral = transaction.amount === 0;
      const statusClass = transaction.status === 'AUTHORIZED' ? 'success' : transaction.status === 'BLOCKED' ? 'danger' : 'warning';
      const amountLabel = neutral ? (transaction.blockedAmount ? `${money(transaction.blockedAmount)} bloqueadas` : 'sem movimentação') : `${incoming ? '+' : ''}${money(transaction.amount)}`;
      const details = [
        ['Origem', transaction.originEventId || transaction.sourceTransactionId || transaction.incidentId || transaction.itemId || transaction.platformId || 'sistema'],
        ['Nível de análise', transaction.reviewLevel || 'padrão'],
        ['Saldo anterior', Number.isFinite(transaction.balanceBefore) ? `${money(transaction.balanceBefore)} DS` : '—'],
        ['Saldo posterior', Number.isFinite(transaction.balanceAfter) ? `${money(transaction.balanceAfter)} DS` : '—'],
        ['Hash anterior', transaction.previousHash || 'início da cadeia'],
        ['Hash da operação', transaction.payloadHash || '—']
      ];
      return `<article class="ledger-entry ${neutral ? 'neutral' : incoming ? 'in' : 'out'}" data-ledger-entry="${transaction.transactionId}">
        <button class="ledger-entry-main" data-toggle-ledger="${transaction.transactionId}" aria-expanded="false">
          <span class="ledger-icon">${neutral ? '⌁' : incoming ? '＋' : '−'}</span>
          <span class="ledger-copy"><strong>${transaction.description || transaction.type}</strong><small>${new Date(transaction.createdAt).toLocaleString('pt-BR')} • <b class="ledger-status ${statusClass}">${transaction.status}</b></small></span>
          <span class="ledger-value"><strong class="${neutral ? '' : incoming ? 'positive' : 'negative'}">${amountLabel}</strong><small>${transaction.transactionId}</small></span><span class="ledger-chevron">⌄</span>
        </button>
        <div class="ledger-details" hidden>${details.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>
      </article>`;
    }).join('') || '<div class="empty-state"><p>Nenhuma movimentação neste filtro.</p></div>';
    const received = state.ledger.filter(t => t.status === 'AUTHORIZED' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const spent = Math.abs(state.ledger.filter(t => t.status === 'AUTHORIZED' && t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    $('#totalReceived').textContent = `+${money(received)}`;
    $('#totalSpent').textContent = `-${money(spent)}`;
    $('#transactionCount').textContent = state.ledger.length;
    renderMiniChart(state.ledger.filter(t => t.status === 'AUTHORIZED' && t.amount !== 0));
  }

  function renderMiniChart(ledger) {
    const values = ledger.slice(-12).map(transaction => ({ amount: Math.abs(transaction.amount), out: transaction.amount < 0 }));
    const max = Math.max(1, ...values.map(value => value.amount));
    $('#miniChart').innerHTML = values.map(value => `<span class="chart-bar${value.out ? ' out' : ''}" style="height:${Math.max(10, value.amount / max * 100)}%" title="${money(value.amount)} moedas"></span>`).join('');
  }

  function renderInventory() {
    renderCategoryFilters();
    const state = store.getState();
    const items = state.inventory.map(id => store.getItem(id)).filter(Boolean).filter(item => inventoryCategory === 'all' || item.category === inventoryCategory);
    const equippedIds = avatarProfile?.getState?.().equippedItems || [];
    $('#inventoryGrid').innerHTML = items.map(item => {
      const rarity = rarityMap[item.rarity];
      const equipped = equippedIds.includes(item.id);
      const inBackpack = item.category === 'animation' ? backpack?.getState?.().quickAnimations.includes(backpack?.animationForItem?.(item.id)) : backpack?.getState?.().itemIds.includes(item.id);
      return `<article class="inventory-item glass${equipped ? ' equipped' : ''}${inBackpack ? ' in-backpack' : ''}" style="--rarity:${rarity.accent}"><img class="inventory-thumb" src="${item.thumbnail || item.preview || ''}" alt="${item.name}"><strong>${item.name}</strong><small>${categoryLabels[item.category] || item.category} • ${item.slot}</small>${equipped ? '<span class="equipped-label">✓ Equipado no personagem</span>' : ''}<button class="button soft" data-equip-item="${item.id}">${equipped ? 'Remover' : 'Equipar'}</button></article>`;
    }).join('');
    $('#inventoryGrid').hidden = items.length === 0;
    $('#inventoryEmpty').hidden = items.length > 0;
    const list=$('#inventoryLoadoutList');
    if(list){const snap=avatarProfile?.getSnapshot?.();list.innerHTML=snap?.items?.length?snap.items.map(item=>`<span>${item.name}</span>`).join(''):'<span>Personagem padrão</span>';}
    window.DSAvatarSnapshot?.renderAll?.();
    window.DSBackpackUI?.decorateInventory?.();
    $$('#inventoryGrid [data-equip-item]').forEach(button => button.addEventListener('click', async () => {
      const id = button.dataset.equipItem;
      const item=store.getItem(id);
      if(!item)return;
      if(avatarProfile?.isEquipped?.(id)) avatarProfile.unequipItem(id,{source:'inventory'});
      else avatarProfile?.equipItem?.(id,{source:'inventory'});
      renderInventory(); renderProfileLoadout(); renderStore();
      showToast(avatarProfile?.isEquipped?.(id)?'Item equipado':'Item removido',`${item.name} foi sincronizado com Perfil, Loja e Personagem.`);
    }));
  }

  function renderAvatarControls() {
    $('#slotList').innerHTML = slots.map(([id, label, equipped, icon]) => `<div class="slot-row"><span class="slot-icon">${icon}</span><span><strong>${label}</strong><small>${equipped}</small></span><button data-slot="${id}">Alterar</button></div>`).join('');
    $('#emoteGrid').innerHTML = emotes.map(([icon, label]) => `<button class="emote-button" data-emote="${label}"><span>${icon}</span><small>${label}</small></button>`).join('');
    $$('[data-emote]').forEach(button => button.addEventListener('click', async () => {
      await loadModule('animations');
      window.dispatchEvent(new CustomEvent('ds-avatar-play', { detail: button.dataset.emote }));
      showToast(`Animação: ${button.dataset.emote}`, 'Clip real do modelo GLB reproduzido.');
    }));
    $$('[data-avatar-item]').forEach(input => input.addEventListener('change', () => {
      window.DSAvatarViewer?.toggleItem(input.dataset.avatarItem, input.checked);
    }));
    $$('[data-slot]').forEach(button => button.addEventListener('click', () => showToast('Slot selecionado', 'O seletor de itens será conectado ao inventário completo nas próximas versões.')));
  }

  function applyAvatarRotation() { window.DSAvatarViewer?.rotate(avatarAngle * Math.PI / 180); avatarAngle = 0; }

  function renderIntegrity() {
    const state = store.getState();
    const chainIssue = state.integrity.issues.some(issue => ['CHAIN_LINK_MISMATCH', 'HASH_MISMATCH'].includes(issue.type));
    const checks = [
      ['Carteira', state.integrity.issues.some(issue => issue.type === 'BALANCE_MISMATCH') ? 'Saldo exige reconciliação' : 'Saldo conciliado pelo livro-caixa', '◈'],
      ['Extrato', chainIssue ? 'Cadeia de hashes exige atenção' : 'Encadeamento de registros coerente', '⌁'],
      ['Inventário', state.integrity.issues.some(issue => issue.type === 'UNKNOWN_ITEMS') ? 'Há itens não reconhecidos' : 'Itens reconhecidos no catálogo', '▣'],
      ['Recompensas', `${(state.reviews || []).filter(review => review.status === 'PENDING').length} operação(ões) em análise`, '＋'],
      ['Catálogo', 'Preços e raridades reconhecidos', '◆'],
      ['Perfil', 'Estrutura compatível com a versão 0.9.6', '◉']
    ];
    $('#integrityChecks').innerHTML = checks.map(([title, detail, icon]) => `<div class="check-row"><span>${icon}</span><span><strong>${title}</strong><small>${detail}</small></span><small>${state.integrity.issues.length ? 'verificar' : 'íntegro'}</small></div>`).join('');
    const history = (state.integrity.history || []).slice(0, 12);
    $('#integrityTimeline').innerHTML = history.map(event => `<div class="timeline-row"><span class="timeline-dot"></span><span><strong>${event.title}</strong><small>${event.detail}</small></span><time>${new Date(event.createdAt).toLocaleString('pt-BR')}</time></div>`).join('') || '<div class="empty-state"><p>Nenhum evento registrado.</p></div>';
    $('#auditStatus').textContent = state.integrity.issues.length ? 'Atenção' : 'Verificado';
    $('#auditStatus').className = `status-chip ${state.integrity.issues.length ? 'warning' : 'success'}`;
  }

  function renderComponents() {
    $('#raritySamples').innerHTML = DS_CATALOG.rarities.map(rarity => `<div class="rarity-sample" style="--rarity:${rarity.accent}">${rarity.name}<br><small>${money(rarity.minPrice)}–${money(rarity.maxPrice)}</small></div>`).join('');
    $('#discountSamples').innerHTML = DS_CATALOG.discounts.map(discount => `<div class="discount-sample${discount.percent >= 80 ? ' hot' : ''}">${discount.percent === 100 ? 'GRÁTIS' : `${discount.percent}%`}</div>`).join('');
  }

  function renderModules() {
    $('#moduleMap').innerHTML = moduleCards.map(([title, icon, color, state, description]) => `<article class="module-card glass" style="--module-color:${color}"><span class="module-card-icon">${icon}</span><h2>${title}</h2><p>${description}</p><span class="module-state">${state}</span></article>`).join('');
  }


  function renderAssetKit() {
    const materials = ['skin','hair','fabric','leather','rubber','wood','metal','painted-metal','emissive-cyan','holographic','energy-gold','glass-tech'];
    const materialGallery = $('#materialGallery');
    if (materialGallery) materialGallery.innerHTML = materials.map(name => `<div class="material-tile"><img src="../assets/materials/webp/${name}.webp" alt="Textura ${name}" loading="lazy"><span>${name.replaceAll('-', ' ')}</span></div>`).join('');
    const thumbGallery = $('#thumbnailGallery');
    if (thumbGallery) {
      thumbGallery.innerHTML = DS_CATALOG.items.map(item => `<button type="button" data-open-product="${item.id}"><img src="${item.thumbnail}" alt="${item.name}" loading="lazy"><span>${item.name}</span></button>`).join('');
      bindProductButtons(thumbGallery);
    }
  }

  function renderVfxStudio() {
    const grid = $('#vfxCardGrid');
    if (grid && window.DS_VFX) {
      const activeFilter = document.querySelector('[data-vfx-filter].active')?.dataset.vfxFilter || 'all';
      const list = DS_VFX.effects.filter(effect => activeFilter === 'all' || effect.category === activeFilter);
      grid.innerHTML = list.map(effect => `<button class="vfx-card glass" data-vfx-effect="${effect.id}" data-vfx-category="${effect.category}"><img src="../assets/vfx/previews/${effect.id}.webp" alt="${effect.name}" loading="lazy"><span class="rarity-chip ${effect.rarity}">${effect.rarity}</span><strong>${effect.name}</strong><small>${effect.description}</small><span class="vfx-price">${money(effect.price)} DS</span></button>`).join('');
    }
    const speechGrid=$('#speechGrid');
    if(speechGrid&&window.DS_VFX)speechGrid.innerHTML=DS_VFX.speechBubbles.map(s=>`<button class="speech-option" data-speech-text="${s.text}"><img src="../assets/vfx/speech/${s.id}.svg" alt="${s.text}"><span>${money(s.price)} DS</span></button>`).join('');
    const mini=$('#vfxMiniGallery');
    if(mini&&window.DS_VFX)mini.innerHTML=DS_VFX.effects.slice(0,8).map(e=>`<button data-view="effectsView" data-module="vfx"><img src="../assets/vfx/previews/${e.id}.webp" alt="${e.name}" loading="lazy"><span>${e.name}</span></button>`).join('');
  }
  function reviewLabel(level) {
    const rule = (DS_ECONOMY_CONFIG.transactionReview || []).find(item => item.level === level);
    return rule?.label || level || 'Padrão';
  }

  function renderValidationCenter() {
    const state = store.getState();
    const pending = (state.reviews || []).filter(review => review.status === 'PENDING');
    const pendingValue = pending.reduce((sum, review) => sum + review.amount, 0);
    const teacherCount = pending.filter(review => review.teacherRequired).length;
    if ($('#pendingReviewCount')) $('#pendingReviewCount').textContent = pending.length;
    if ($('#pendingReviewValue')) $('#pendingReviewValue').textContent = `${money(pendingValue)} moedas em análise`;
    if ($('#teacherReviewCount')) $('#teacherReviewCount').textContent = teacherCount;
    if ($('#queueStatus')) $('#queueStatus').textContent = `${pending.length} pendente${pending.length === 1 ? '' : 's'}`;
    if ($('#chainStatus')) $('#chainStatus').textContent = state.integrity.issues.some(issue => ['CHAIN_LINK_MISMATCH','HASH_MISMATCH'].includes(issue.type)) ? 'Atenção' : 'Íntegro';
    if ($('#lastAuditTime')) $('#lastAuditTime').textContent = `Última auditoria: ${new Date(state.integrity.lastAudit).toLocaleString('pt-BR')}`;

    const queue = $('#reviewQueue');
    if (queue) queue.innerHTML = pending.map(review => {
      const transaction = state.ledger.find(tx => tx.transactionId === review.transactionId);
      return `<article class="review-card" data-review-id="${review.reviewId}">
        <div class="review-card-icon"><img src="../assets/ui/finance/ledger-scan.svg" alt=""></div>
        <div class="review-card-copy"><div><span class="status-chip warning">${reviewLabel(review.level)}</span>${review.teacherRequired ? '<span class="status-chip">Professor</span>' : ''}</div><h3>${transaction?.description || review.type}</h3><p>${review.reasons.length ? review.reasons.join(' • ') : 'Verificação ampliada definida pelo valor da operação.'}</p><small>${money(review.amount)} moedas • meta ${review.targetSeconds[0]}–${review.targetSeconds[1]} segundos • ${new Date(review.createdAt).toLocaleString('pt-BR')}</small></div>
        <div class="review-card-actions"><button class="button primary" data-review-action="approve" data-review-id="${review.reviewId}">Aprovar</button><button class="button danger ghost" data-review-action="block" data-review-id="${review.reviewId}">Bloquear</button></div>
      </article>`;
    }).join('') || '<div class="empty-state compact"><span>✓</span><h3>Nenhuma operação aguardando análise</h3><p>A carteira está livre para uso normal.</p></div>';

    const tiers = $('#reviewTierGrid');
    if (tiers) tiers.innerHTML = (DS_ECONOMY_CONFIG.transactionReview || []).map((rule, index) => `<article class="review-tier ${rule.teacherReview ? 'critical' : ''}"><span>${index + 1}</span><div><strong>${rule.label}</strong><small>Até ${money(rule.max)} moedas</small></div><b>${rule.targetSeconds[0]}–${rule.targetSeconds[1]}s</b></article>`).join('');

    const checkpoints = DS_ECONOMY_CONFIG.walletCheckpoints || [];
    const track = $('#checkpointTrack');
    if (track) track.innerHTML = checkpoints.map(value => {
      const validated = state.checkpoints.validated.includes(value);
      const waiting = state.checkpoints.pending.includes(value);
      return `<div class="checkpoint-node ${validated ? 'validated' : waiting ? 'waiting' : ''}"><span>${validated ? '✓' : waiting ? '…' : '○'}</span><strong>${money(value)}</strong><small>${validated ? 'validado' : waiting ? 'em análise' : 'futuro'}</small></div>`;
    }).join('');
    if ($('#checkpointStatus')) $('#checkpointStatus').textContent = `${state.checkpoints.validated.length} validados`;
  }


  function activeSdkPlatform() {
    const id = $('#sdkPlatform')?.value || 'desafio-ds';
    return integrationConfig.platforms.find(platform => platform.id === id) || integrationConfig.platforms[0] || { id, name: id, allowedEvents: [] };
  }

  function createSdkForPlatform(platformId) {
    integrationSDK?.destroy?.();
    integrationSDK = window.DSStoreSDK?.createAdapter(platformId, { profileId: 'perfil-demo', store });
    return integrationSDK;
  }

  function syncSdkEventOptions(preferredType) {
    const platform = activeSdkPlatform();
    const select = $('#sdkEventType');
    if (!select) return;
    const previous = preferredType || select.value;
    select.innerHTML = platform.allowedEvents.map(type => `<option value="${type}">${sdkEventLabels[type] || type}</option>`).join('');
    if (platform.allowedEvents.includes(previous)) select.value = previous;
    updateSdkSnippet();
  }

  function updateSdkSnippet() {
    const platform = activeSdkPlatform();
    const type = $('#sdkEventType')?.value || platform.allowedEvents[0] || 'MISSION_COMPLETED';
    const methodMap = Object.fromEntries(Object.entries(window.DSStoreSDK?.EVENT_METHODS || {}).map(([method, eventType]) => [eventType, method]));
    const method = methodMap[type] || 'reward';
    const amount = Number($('#sdkAmount')?.value || 350);
    const eventId = $('#sdkEventId')?.value || `${platform.id}:atividade:perfil-demo:conclusao`;
    const activityId = $('#sdkActivityId')?.value || 'atividade-01';
    const evidenceId = $('#sdkEvidenceId')?.value || 'evidencia-001';
    const snippet = `const sdk = DSStoreSDK.createAdapter('${platform.id}', {\n  profileId: perfil.id,\n  store: window.DSStore\n});\n\nconst resultado = await sdk.${method}({\n  eventId: '${eventId}',\n  amount: ${amount},\n  evidenceId: '${evidenceId}',\n  activityId: '${activityId}'\n});\n\nif (resultado.status === 'AUTHORIZED') {\n  atualizarResumoDaCarteira(resultado.balances);\n}\nif (resultado.status === 'UNDER_REVIEW') {\n  mostrarSaldoEmAnalise(resultado.validationTargetSeconds);\n}`;
    if ($('#sdkSnippet')) $('#sdkSnippet').textContent = snippet;
  }

  function renderSdkLog() {
    const host = $('#sdkLog');
    if (!host) return;
    host.innerHTML = sdkSessionLog.map(entry => `<article class="sdk-log-entry ${entry.ok ? '' : 'error'}"><span>${entry.ok ? (entry.status === 'UNDER_REVIEW' ? '…' : '✓') : '!'}</span><div><strong>${entry.platformName} • ${sdkEventLabels[entry.type] || entry.type}</strong><small>${entry.eventId} • ${money(entry.amount)} moedas • ${new Date(entry.at).toLocaleTimeString('pt-BR')}</small></div><b>${entry.code}</b></article>`).join('') || '<div class="empty-state compact"><span>↯</span><h3>Nenhum evento nesta sessão</h3><p>Use o simulador para testar a conexão real com a carteira.</p></div>';
  }

  function renderIntegration() {
    if (!$('#integrationView')) return;
    const platformSelect = $('#sdkPlatform');
    if (platformSelect && !platformSelect.options.length) {
      platformSelect.innerHTML = integrationConfig.platforms.map(platform => `<option value="${platform.id}">${platform.name}</option>`).join('');
      platformSelect.value = 'desafio-ds';
      syncSdkEventOptions('MISSION_COMPLETED');
    }
    const capabilities = integrationSDK?.getCapabilities?.() || { version: '0.9.0', queueSize: 0 };
    $('#sdkVersion').textContent = capabilities.version || '0.9.0';
    $('#adapterCount').textContent = integrationConfig.platforms.length;
    $('#sdkQueueCount').textContent = capabilities.queueSize || 0;
    const adapterGrid = $('#adapterGrid');
    if (adapterGrid) adapterGrid.innerHTML = integrationConfig.platforms.map(platform => `<article class="adapter-card"><code>${platform.id}</code><h3>${platform.name}</h3><p>${platform.allowedEvents.length} tipos de evento permitidos neste domínio.</p><div class="adapter-events">${platform.allowedEvents.slice(0,5).map(type => `<span>${sdkEventLabels[type] || type}</span>`).join('')}${platform.allowedEvents.length > 5 ? `<span>+${platform.allowedEvents.length-5}</span>` : ''}</div></article>`).join('');
    renderSdkLog();
    updateSdkSnippet();
  }

  function setSdkPreset(name) {
    const presets = {
      tutorial: { platform: 'lab-virtual-ds', type: 'TUTORIAL_COMPLETED', amount: 80, activity: 'tutorial-ferramenta-01' },
      lab: { platform: 'lab-virtual-ds', type: 'LAB_COMPLETED', amount: 700, activity: 'laboratorio-redes-01' },
      phase: { platform: 'desafio-ds', type: 'PHASE_COMPLETED', amount: 500, activity: 'fase-05' },
      critical: { platform: 'professor-admin', type: 'TEACHER_REWARD', amount: 50000, activity: 'premiacao-especial' }
    };
    const preset = presets[name];
    if (!preset) return;
    $('#sdkPlatform').value = preset.platform;
    createSdkForPlatform(preset.platform);
    syncSdkEventOptions(preset.type);
    $('#sdkEventType').value = preset.type;
    $('#sdkAmount').value = preset.amount;
    $('#sdkActivityId').value = preset.activity;
    $('#sdkEvidenceId').value = `evidencia-${preset.activity}`;
    $('#sdkEventId').value = `${preset.platform}:${preset.activity}:perfil-demo:${Date.now()}`;
    updateSdkSnippet();
  }

  async function sendSdkEvent() {
    if (!window.DSStoreSDK) await loadModule('integration');
    integrationConfig = window.DS_INTEGRATION_CONFIG || integrationConfig;
    const platform = activeSdkPlatform();
    if (!integrationSDK || integrationSDK.platformId !== platform.id) createSdkForPlatform(platform.id);
    const event = {
      eventId: $('#sdkEventId').value.trim(), profileId: 'perfil-demo', platformId: platform.id,
      type: $('#sdkEventType').value, amount: Number($('#sdkAmount').value), evidenceId: $('#sdkEvidenceId').value.trim() || null,
      activityId: $('#sdkActivityId').value.trim() || null, metadata: { source: 'integration-console-v0.9.0' }
    };
    const button = $('#sendSdkEvent');
    button.disabled = true; button.textContent = 'Enviando e validando...';
    const result = await integrationSDK.reward(event);
    button.disabled = false; button.textContent = 'Validar e enviar evento';
    const resultBox = $('#sdkResult');
    resultBox.className = `sdk-result ${result.ok ? (result.status === 'UNDER_REVIEW' ? 'review' : 'authorized') : 'rejected'}`;
    resultBox.innerHTML = `<span>${result.protocol || 'DS_STORE_RESULT_V1'}</span><strong>${result.status} • ${result.code}</strong><small>${result.message}${result.transactionId ? ` • ${result.transactionId}` : ''}</small>`;
    $('#sdkLastStatus').textContent = result.status;
    $('#sdkLastCode').textContent = result.code;
    sdkSessionLog.unshift({ ...event, ...result, platformName: platform.name, at: new Date().toISOString() });
    sdkSessionLog = sdkSessionLog.slice(0, 30);
    renderAll();
    showToast(result.ok ? (result.status === 'UNDER_REVIEW' ? 'Evento em análise' : result.status === 'QUEUED' ? 'Evento salvo na fila' : 'Evento autorizado') : 'Evento recusado', result.message, !result.ok);
  }

  function renderProfileLoadout() {
    const host = $('#profileLoadout');
    const snap=avatarProfile?.getSnapshot?.() || {items:[]};
    if (host) host.innerHTML = snap.items.length ? `<strong>Conjunto equipado</strong><span>${snap.items.slice(0, 5).map(item=>item.name).join(' • ')}${snap.items.length > 5 ? ` • +${snap.items.length - 5}` : ''}</span>` : '<strong>Conjunto equipado</strong><span>Personagem padrão</span>';
    window.DSAvatarSnapshot?.renderAll?.();
  }

  function renderAll() {
    renderAssetKit();
    renderVfxStudio();
    renderBalances();
    renderFeatured();
    renderStore();
    renderLedger();
    renderInventory();
    renderAvatarControls();
    renderIntegrity();
    renderValidationCenter();
    renderIntegration();
    renderComponents();
    renderModules();
    renderProfileLoadout();
    window.DSBackpackUI?.render?.();
  }

  function updateCountdowns() {
    const remaining = 1800000 - (Date.now() % 1800000);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const text = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    ['roundCountdown', 'promoCountdown'].forEach(id => { const element = document.getElementById(id); if (element) element.textContent = text; });
  }

  function simulateRewardAmount(amount, type, label) {
    try {
      const transaction = store.reward({ eventId: `demo-${type.toLowerCase()}-${Date.now()}`, profileId: 'perfil-demo', type, amount, platformId: 'loja-v080-demo', evidenceId: `evidence-${Date.now()}`, activityId: label });
      renderAll();
      if (transaction.status === 'UNDER_REVIEW') {
        showToast(`${money(amount)} moedas em análise`, 'A origem, o crescimento do saldo e os checkpoints serão verificados.');
        navigate('validationView');
      } else {
        showToast(`+${money(amount)} moedas liberadas`, 'Crédito autorizado e registrado no extrato.');
      }
    } catch (error) { showToast('Recompensa não processada', error.message, true); }
  }

  function setupEvents() {
    $$('[data-view]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      navigate(button.dataset.view, button.dataset.module);
    }));
    $$('[data-module]:not([data-view])').forEach(button => button.addEventListener('click', async () => {
      const moduleName = button.dataset.module;
      await loadModule(moduleName);
      button.textContent = moduleName === 'animations' ? 'Animações prontas' : 'Módulo pronto';
      button.classList.add('ready');
      showToast('Pacote preparado', 'Os recursos solicitados estão disponíveis nesta sessão.');
    }));
    $('#openSidebar').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#scrim').hidden = false; });
    $('#closeSidebar').addEventListener('click', () => { $('#sidebar').classList.remove('open'); $('#scrim').hidden = true; });
    $('#scrim').addEventListener('click', () => { $('#sidebar').classList.remove('open'); $('#scrim').hidden = true; });
    $('#qualityButton').addEventListener('click', () => { const popover = $('#qualityPopover'); popover.hidden = !popover.hidden; $('#qualityButton').setAttribute('aria-expanded', String(!popover.hidden)); });
    $$('[data-quality-option]').forEach(button => button.addEventListener('click', async () => {
      const quality = button.dataset.qualityOption;
      await loadModule('packages');
      const ready = await window.DSPackManager?.ensureMode?.(quality);
      if (ready === false) {
        $('#qualityPopover').hidden = true;
        navigate('packagesView');
        const missing = window.DSPackManager?.missingForMode?.(quality) || [];
        if (missing[0]) window.DSPackManager?.focusPackage?.(missing[0]);
        showToast('Pacote necessário', 'Prepare os recursos indicados antes de ativar esta qualidade.');
        return;
      }
      const actual = window.DSPerformance?.setMode(quality) || quality;
      const labels = window.DSPerformance?.labels || { auto: 'Automático', basic: 'Básico', intermediate: 'Intermediário', advanced: 'Avançado', ultra: 'Ultra', realism: 'Modo Realismo' };
      const label = quality === 'auto' ? `Automático • ${labels[actual] || actual}` : labels[quality];
      $('#qualityLabel').textContent = label;
      $('#avatarQuality').textContent = `Qualidade: ${(labels[actual] || actual).toLowerCase()}`;
      safeStorage.localSet('ds-quality-mode', quality);
      $('#qualityPopover').hidden = true;
      showToast('Qualidade atualizada', `${label} aplicado.`);
    }));
    $('#storeSearch').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderStore(); });
    $('#storeSort').addEventListener('change', event => { sortMode = event.target.value; renderStore(); });
    $$('.view-switch button').forEach(button => button.addEventListener('click', () => {
      $$('.view-switch button').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      $('#catalogGrid').dataset.layout = button.dataset.grid;
    }));
    $('#refreshOffers').addEventListener('click', () => { roundOverride += 1; renderAll(); showToast('Rodada demonstrativa atualizada', 'Novas ofertas foram calculadas para análise visual.'); });
    $('#simulateReward').addEventListener('click', () => {
      try {
        const transaction = store.reward({ eventId: `demo-mission-${Date.now()}`, profileId: 'perfil-demo', type: 'MISSION_COMPLETED', amount: 650, platformId: 'design-system-demo', evidenceId: `evidence-${Date.now()}` });
        showToast(transaction.status === 'AUTHORIZED' ? '+650 moedas liberadas' : '650 moedas em análise', transaction.status === 'AUTHORIZED' ? 'Missão concluída e recompensa registrada no extrato.' : 'A recompensa foi encaminhada para validação ampliada.');
        renderAll();
      } catch (error) { showToast('Recompensa não processada', error.message, true); }
    });
    $('#simulateHighReward')?.addEventListener('click', () => simulateRewardAmount(5000, 'PHASE_COMPLETED', 'Fase final concluída'));
    $('#simulateCriticalReward')?.addEventListener('click', () => simulateRewardAmount(50000, 'TEACHER_REWARD', 'Premiação especial de alto valor'));
    $('#sdkPlatform')?.addEventListener('change', () => { createSdkForPlatform($('#sdkPlatform').value); syncSdkEventOptions(); $('#sdkEventId').value = `${$('#sdkPlatform').value}:${$('#sdkActivityId').value}:perfil-demo:${Date.now()}`; renderIntegration(); });
    $('#sdkEventType')?.addEventListener('change', updateSdkSnippet);
    ['sdkAmount','sdkActivityId','sdkEventId','sdkEvidenceId'].forEach(id => document.getElementById(id)?.addEventListener('input', updateSdkSnippet));
    $('#sendSdkEvent')?.addEventListener('click', sendSdkEvent);
    $('#newSdkEventId')?.addEventListener('click', () => { $('#sdkEventId').value = `${activeSdkPlatform().id}:${$('#sdkActivityId').value || 'atividade'}:perfil-demo:${Date.now()}`; updateSdkSnippet(); });
    $('#repeatSdkEvent')?.addEventListener('click', sendSdkEvent);
    $$('[data-sdk-preset]').forEach(button => button.addEventListener('click', () => setSdkPreset(button.dataset.sdkPreset)));
    $('#flushSdkQueue')?.addEventListener('click', async () => { const result = await integrationSDK.flushQueue(); renderIntegration(); showToast('Fila reprocessada', `${result.processed} evento(s) concluído(s); ${result.remaining} restante(s).`, result.remaining > 0); });
    $('#clearSdkLog')?.addEventListener('click', () => { sdkSessionLog = []; renderSdkLog(); });
    $('#copySdkSnippet')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#sdkSnippet').textContent); showToast('Código copiado', 'Trecho pronto para adaptar à plataforma.'); } catch { showToast('Não foi possível copiar', 'Selecione o código manualmente.', true); } });
    $('#runValidationAudit')?.addEventListener('click', () => { const result = store.audit(); renderAll(); showToast(result.issues.length ? 'Auditoria requer atenção' : 'Livro-caixa íntegro', result.issues.length ? `${result.issues.length} divergência(s) encontrada(s).` : 'Hashes e saldos foram reconciliados.', result.issues.length > 0); });
    $('#toggleBalanceDetails').addEventListener('click', () => { const details = $('#balanceDetails'); details.hidden = !details.hidden; $('#toggleBalanceDetails').textContent = details.hidden ? 'Ver outros saldos' : 'Ocultar outros saldos'; });
    $('#showLedgerDetails').addEventListener('click', () => { const note = $('#technicalLedgerNote'); note.hidden = !note.hidden; $('#showLedgerDetails').textContent = note.hidden ? 'Mostrar detalhes técnicos' : 'Ocultar detalhes técnicos'; });
    $$('[data-ledger-filter]').forEach(button => button.addEventListener('click', () => { ledgerFilter = button.dataset.ledgerFilter; $$('[data-ledger-filter]').forEach(item => item.classList.toggle('active', item === button)); renderLedger(); }));
    document.addEventListener('click', event => {
      const ledgerButton = event.target.closest('[data-toggle-ledger]');
      if (ledgerButton) {
        const entry = ledgerButton.closest('.ledger-entry');
        const details = entry?.querySelector('.ledger-details');
        if (details) { details.hidden = !details.hidden; ledgerButton.setAttribute('aria-expanded', String(!details.hidden)); entry.classList.toggle('expanded', !details.hidden); }
      }
      const reviewButton = event.target.closest('[data-review-action]');
      if (reviewButton) {
        try {
          const decision = reviewButton.dataset.reviewAction === 'approve' ? 'APPROVE' : 'BLOCK';
          const result = store.resolveReview(reviewButton.dataset.reviewId, decision, { actor: 'professor-demonstracao', reason: decision === 'APPROVE' ? 'Evidência e origem confirmadas na demonstração.' : 'Crédito não confirmado na demonstração.' });
          renderAll();
          showToast(decision === 'APPROVE' ? 'Saldo liberado' : 'Crédito bloqueado', decision === 'APPROVE' ? `${money(result.amount)} moedas foram liberadas.` : `${money(result.amount)} moedas permanecem bloqueadas.`, decision !== 'APPROVE');
        } catch (error) { showToast('Não foi possível concluir a revisão', error.message, true); }
      }
    });
    $('#auditWallet').addEventListener('click', () => { const result = store.audit(); renderAll(); showToast(result.issues.length ? 'Auditoria concluída com atenção' : 'Carteira validada', result.issues.length ? 'Foram encontradas divergências para análise.' : 'Saldo, extrato e inventário estão coerentes.', result.issues.length > 0); });
    $('#runIntegrityCheck').addEventListener('click', () => { const result = store.audit(); renderAll(); showToast('Verificação concluída', result.issues.length ? 'Existem itens que exigem análise.' : 'Todos os componentes estão íntegros.', result.issues.length > 0); });
    $('#resetDemo').addEventListener('click', () => { store.reset(); renderAll(); showToast('Demonstração reiniciada', 'Saldo, inventário e extrato retornaram ao estado inicial.'); });
    $('#closeProduct').addEventListener('click', closeProduct);
    $('#productModal').addEventListener('click', event => { if (event.target === $('#productModal')) closeProduct(); });
    $('#buyProduct').addEventListener('click', buySelectedItem);
    $('#favoriteProduct').addEventListener('click', () => showToast('Adicionado aos favoritos', selectedItem ? selectedItem.name : 'Item'));
    $('#quickEquipProduct')?.addEventListener('click',()=>{if(!selectedItem)return;if(!store.getState().inventory.includes(selectedItem.id)){showToast('Item não adquirido','Compre ou conquiste o item antes de equipar.',true);return;}const now=avatarProfile?.toggleItem?.(selectedItem.id,{source:'store'});$('#quickEquipProduct').textContent=now?'Remover do conjunto':'Equipar agora';renderAll();showToast(now?'Item equipado':'Item removido',`${selectedItem.name} foi sincronizado em todas as prévias.`);});
    $('#cancelTransaction').addEventListener('click', () => { $('#transactionModal').classList.remove('show'); showToast('Operação cancelada', 'Nenhuma moeda foi movimentada.'); });
    $('#playAvatarDemo').addEventListener('click', () => playAvatarAction('Wave'));
    $('#rotateLeft').addEventListener('click', () => window.DSAvatarViewer?.rotate(-Math.PI / 4));
    $('#rotateRight').addEventListener('click', () => window.DSAvatarViewer?.rotate(Math.PI / 4));
    $('#toggleAutoRotate').addEventListener('click', () => {
      const enabled = window.DSAvatarViewer?.toggleAuto();
      $('#toggleAutoRotate').textContent = enabled === false ? 'Rotação automática' : 'Parar rotação';
    });
    $('#reduceMotion').addEventListener('change', event => { document.body.classList.toggle('reduce-motion', event.target.checked); safeStorage.localSet('ds-reduce-motion', event.target.checked ? '1' : '0'); });
    document.addEventListener('click', async event => {
      const profileAction = event.target.closest('[data-profile-animation]');
      const animationButton = event.target.closest('[data-glb-animation]');
      const button = profileAction || animationButton;
      if (!button) return;
      const clip = button.dataset.profileAnimation || button.dataset.glbAnimation;
      const effectId = button.dataset.vfxEffect || null;
      await playAvatarAction(clip, effectId);
      showToast(`Animação: ${button.textContent.trim()}`, 'Prévia aberta no personagem equipado.');
    });
    document.addEventListener('ds-avatar-animation-change', event => {
      const clip = event.detail?.clip;
      $$('[data-glb-animation], [data-profile-animation]').forEach(button => button.classList.toggle('active', (button.dataset.glbAnimation || button.dataset.profileAnimation) === clip));
    });
    document.addEventListener('click', event => { const button=event.target.closest('[data-rig-focus]'); if(!button)return; const focus=window.DSAvatarViewer?.setRigFocus(button.dataset.rigFocus)||button.dataset.rigFocus; document.querySelectorAll('[data-rig-focus]').forEach(x=>x.classList.toggle('active',x.dataset.rigFocus===focus)); showToast('Rig 2.0',`Movimento secundário: ${button.textContent.trim()}.`); });
    document.addEventListener('ds-rig-focus-change',event=>document.querySelectorAll('[data-rig-focus]').forEach(x=>x.classList.toggle('active',x.dataset.rigFocus===event.detail?.focus)));
    document.addEventListener('ds-avatar-loadout-change', renderProfileLoadout);
    document.addEventListener('ds-avatar-profile-change', () => { renderProfileLoadout(); renderInventory(); renderStore(); });
    document.addEventListener('ds-backpack-change', () => { window.DSBackpackUI?.render?.(); });

    $$('#effectsView [data-vfx-filter]').forEach(button => button.addEventListener('click', () => { $$('#effectsView [data-vfx-filter]').forEach(x=>x.classList.toggle('active',x===button)); renderVfxStudio(); }));
    $('#stopVfx')?.addEventListener('click', () => window.DSVFX?.stop());

    document.querySelectorAll('[data-product-preview]').forEach(button => button.addEventListener('click', async () => {
      document.querySelectorAll('[data-product-preview]').forEach(x => x.classList.toggle('active', x === button));
      const mode = button.dataset.productPreview;
      const modal=$('#productModal .product-modal'); const equippedHost=$('#productEquippedPreview');
      if (mode === '360') { modal?.setAttribute('data-preview-mode','360'); if(equippedHost)equippedHost.hidden=true; await loadModule('product3d'); await window.DSProduct3D?.open(selectedItem); }
      if (mode === 'equipped' && selectedItem) { window.DSProduct3D?.close?.(); modal?.setAttribute('data-preview-mode','equipped'); if(equippedHost){equippedHost.hidden=false;window.DSAvatarSnapshot?.preview?.(equippedHost,selectedItem);} }
      if (mode === 'transparent') document.getElementById('productStage')?.classList.toggle('transparent-stage');
    }));
    document.addEventListener('ds-quality-change', event => {
      const {actual,requested}=event.detail;
      const labels=window.DSPerformance?.labels||{};
      $('#qualityLabel').textContent=requested==='auto'?`Automático • ${labels[actual]||actual}`:(labels[actual]||actual);
      $('#avatarQuality').textContent=`Qualidade: ${(labels[actual]||actual).toLowerCase()}`;
      window.DSAvatarViewer?.setQuality(actual); window.DSVFX?.setQuality(actual); window.DSProduct3D?.setQuality(actual);
    });
    document.addEventListener('ds-runtime-module-ready', event => {
      const name = event.detail?.name;
      if (name === 'integration') {
        integrationConfig = window.DS_INTEGRATION_CONFIG || { platforms: [] };
        if (!integrationSDK && window.DSStoreSDK?.createAdapter) createSdkForPlatform(integrationConfig.platforms[0]?.id || 'desafio-ds');
        renderIntegration();
      }
      if (name === 'avatar3d') renderProfileLoadout();
      const actual = window.DSPerformance?.actualMode || document.body.dataset.quality || 'intermediate';
      window.DSAvatarViewer?.setQuality?.(actual);
      window.DSVFX?.setQuality?.(actual);
      window.DSProduct3D?.setQuality?.(actual);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { closeProduct(); $('#transactionModal').classList.remove('show'); $('#qualityPopover').hidden = true; }
    });
  }

  window.DSApp={version:'0.9.6.0-RG',showToast,renderAll,renderInventory,renderProfileLoadout};

  const storedQuality = window.DSPerformance?.requestedMode || safeStorage.localGet('ds-quality-mode') || 'auto';
  const actualQuality = window.DSPerformance?.actualMode || (storedQuality === 'auto' ? 'intermediate' : storedQuality);
  const qualityLabels = window.DSPerformance?.labels || { auto: 'Automático', basic: 'Básico', intermediate: 'Intermediário', advanced: 'Avançado', ultra: 'Ultra', realism: 'Modo Realismo' };
  const qualityLabel = storedQuality === 'auto' ? `Automático • ${qualityLabels[actualQuality]}` : qualityLabels[actualQuality];
  $('#qualityLabel').textContent = qualityLabel;
  $('#avatarQuality').textContent = `Qualidade: ${qualityLabels[actualQuality].toLowerCase()}`;
  const storedReducedMotion = safeStorage.localGet('ds-reduce-motion') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#reduceMotion').checked = storedReducedMotion;
  document.body.classList.toggle('reduce-motion', storedReducedMotion);
  setupEvents();
  renderAll();
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
})();

(function (global) {
  'use strict';

  const VERSION = '0.9.0';
  const KEY = 'ds-store-foundation-v0.9.0';
  const LEGACY_KEYS = [
    'ds-store-foundation-v0.8.0', 'ds-store-foundation-v0.7.0', 'ds-store-foundation-v0.6.0', 'ds-store-foundation-v0.5.0',
    'ds-store-foundation-v0.4.0', 'ds-store-foundation-v0.3.0', 'ds-store-foundation-v0.2.0',
    'ds-store-foundation-v0.1.0'
  ];
  const now = () => new Date().toISOString();
  const uid = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  const clone = value => JSON.parse(JSON.stringify(value));
  const integer = value => Number.isInteger(value) ? value : Math.round(Number(value) || 0);

  function hashText(input) {
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (`00000000${(hash >>> 0).toString(16)}`).slice(-8);
  }

  function transactionHash(transaction) {
    const payload = { ...transaction };
    delete payload.payloadHash;
    return hashText(JSON.stringify(payload));
  }

  class DSStoreFoundation {
    constructor(options = {}) {
      this.config = global.DS_STORE_CONFIG || {};
      this.economy = global.DS_ECONOMY_CONFIG || {};
      this.catalog = global.DS_CATALOG || { items: [] };
      this.profileId = options.profileId || 'perfil-demo';
      this.platformId = options.platformId || 'loja-virtual-ds-demo';
      this.listeners = {};
      this.state = this.load() || this.seed();
      this.normalizeState();
      this.audit({ silent: true });
    }

    seed() {
      const createdAt = now();
      const seedCredit = {
        transactionId: 'tx_seed_001', profileId: this.profileId, type: 'REWARD', status: 'AUTHORIZED',
        amount: 4800, originEventId: 'seed-demo', platformId: this.platformId,
        description: 'Saldo demonstrativo da fundação', reviewLevel: 'seed', createdAt,
        previousHash: null, balanceBefore: 0, balanceAfter: 4800
      };
      seedCredit.payloadHash = transactionHash(seedCredit);
      const pendingCredit = {
        transactionId: 'tx_seed_pending', profileId: this.profileId, type: 'REWARD_PENDING', status: 'PENDING',
        amount: 250, originEventId: 'seed-pending', platformId: this.platformId,
        description: 'Recompensa demonstrativa pendente', reviewLevel: 'seed', createdAt,
        previousHash: seedCredit.payloadHash, balanceBefore: 4800, balanceAfter: 4800
      };
      pendingCredit.payloadHash = transactionHash(pendingCredit);
      return {
        version: VERSION,
        profileId: this.profileId,
        balances: { available: 4800, reserved: 0, pending: 250, underReview: 0, blocked: 0 },
        inventory: ['emote-wave'],
        processedEvents: ['seed-demo', 'seed-pending'],
        ledger: [seedCredit, pendingCredit],
        reviews: [],
        incidents: [],
        checkpoints: { validated: [], pending: [] },
        locks: { storeUntil: null, economyUntil: null, profileUntil: null },
        statistics: { totalReceived: 4800, totalSpent: 0, purchases: 0, rewards: 1, lastAuthorizedCreditAt: createdAt },
        integrity: {
          score: 900, status: 'stable', lastAudit: createdAt, issues: [], warningCount: 0,
          history: [{ id: 'integrity_seed', type: 'PROFILE_INITIALIZED', title: 'Perfil financeiro inicializado', detail: 'Livro-caixa v0.9.0 criado.', createdAt }]
        }
      };
    }

    load() {
      try {
        const current = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (current) return current;
        for (const legacyKey of LEGACY_KEYS) {
          const legacy = JSON.parse(localStorage.getItem(legacyKey) || 'null');
          if (legacy) return legacy;
        }
      } catch (error) {
        return null;
      }
      return null;
    }

    normalizeState() {
      const fallback = this.seed();
      const oldVersion = this.state.version;
      this.state.version = VERSION;
      this.state.profileId ||= this.profileId;
      this.state.balances = { ...fallback.balances, ...(this.state.balances || {}) };
      this.state.inventory = Array.isArray(this.state.inventory) ? [...new Set(this.state.inventory)] : [];
      this.state.processedEvents = Array.isArray(this.state.processedEvents) ? [...new Set(this.state.processedEvents)] : [];
      this.state.ledger = Array.isArray(this.state.ledger) ? this.state.ledger : [];
      this.state.reviews = Array.isArray(this.state.reviews) ? this.state.reviews : [];
      this.state.incidents = Array.isArray(this.state.incidents) ? this.state.incidents : [];
      this.state.checkpoints = {
        validated: Array.isArray(this.state.checkpoints?.validated) ? this.state.checkpoints.validated : [],
        pending: Array.isArray(this.state.checkpoints?.pending) ? this.state.checkpoints.pending : []
      };
      this.state.locks = { ...fallback.locks, ...(this.state.locks || {}) };
      this.state.statistics = { ...fallback.statistics, ...(this.state.statistics || {}) };
      this.state.integrity = { ...fallback.integrity, ...(this.state.integrity || {}) };
      this.state.integrity.issues = Array.isArray(this.state.integrity.issues) ? this.state.integrity.issues : [];
      this.state.integrity.history = Array.isArray(this.state.integrity.history) ? this.state.integrity.history : [];
      this.state.ledger = this.repairLegacyLedger(this.state.ledger);
      if (oldVersion !== VERSION) {
        this.addIntegrityHistory('DATA_MIGRATED', 'Dados atualizados', `Perfil migrado de ${oldVersion || 'versão antiga'} para ${VERSION}.`);
      }
      this.save();
    }

    repairLegacyLedger(ledger) {
      let previousHash = null;
      let running = 0;
      return ledger.map(original => {
        const tx = { ...original };
        tx.transactionId ||= uid('tx_migrated');
        tx.createdAt ||= now();
        tx.status ||= 'AUTHORIZED';
        tx.amount = integer(tx.amount);
        tx.previousHash = previousHash;
        tx.balanceBefore = Number.isFinite(tx.balanceBefore) ? tx.balanceBefore : running;
        if (tx.status === 'AUTHORIZED') running += tx.amount;
        tx.balanceAfter = Number.isFinite(tx.balanceAfter) ? tx.balanceAfter : running;
        tx.payloadHash = transactionHash(tx);
        previousHash = tx.payloadHash;
        return tx;
      });
    }

    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (error) { /* fallback em memória */ }
      this.emit('state', clone(this.state));
    }

    on(type, listener) {
      (this.listeners[type] || (this.listeners[type] = [])).push(listener);
      return () => { this.listeners[type] = this.listeners[type].filter(item => item !== listener); };
    }

    emit(type, payload) { (this.listeners[type] || []).forEach(listener => listener(payload)); }
    getItem(id) { return this.catalog.items.find(item => item.id === id) || null; }
    getState() { return clone(this.state); }
    getReview(id) { return this.state.reviews.find(review => review.reviewId === id) || null; }
    getPendingReviews() { return clone(this.state.reviews.filter(review => review.status === 'PENDING')); }
    reviewLevel(amount) {
      const rules = this.economy.transactionReview || [];
      return rules.find(rule => amount <= rule.max) || rules.at(-1) || { level: 'standard', targetSeconds: [5, 10] };
    }

    addIntegrityHistory(type, title, detail, extra = {}) {
      const record = { id: uid('hist'), type, title, detail, createdAt: now(), ...extra };
      this.state.integrity.history.unshift(record);
      this.state.integrity.history = this.state.integrity.history.slice(0, 100);
      return record;
    }

    appendTransaction(transaction) {
      const previous = this.state.ledger.at(-1) || null;
      const payload = {
        transactionId: transaction.transactionId || uid('tx'),
        profileId: transaction.profileId || this.profileId,
        platformId: transaction.platformId || this.platformId,
        createdAt: transaction.createdAt || now(),
        ...transaction,
        previousHash: previous ? previous.payloadHash : null
      };
      payload.payloadHash = transactionHash(payload);
      this.state.ledger.push(payload);
      return payload;
    }

    expectedAvailable() {
      return this.state.ledger
        .filter(tx => tx.status === 'AUTHORIZED' && Number.isFinite(tx.amount))
        .reduce((sum, tx) => sum + tx.amount, 0);
    }

    expectedUnderReview() {
      return this.state.reviews
        .filter(review => review.status === 'PENDING' && review.direction === 'CREDIT')
        .reduce((sum, review) => sum + review.amount, 0);
    }

    validateChain() {
      const issues = [];
      let previousHash = null;
      for (const transaction of this.state.ledger) {
        if (transaction.previousHash !== previousHash) {
          issues.push({ type: 'CHAIN_LINK_MISMATCH', transactionId: transaction.transactionId });
        }
        const expectedHash = transactionHash(transaction);
        if (transaction.payloadHash !== expectedHash) {
          issues.push({ type: 'HASH_MISMATCH', transactionId: transaction.transactionId });
        }
        previousHash = transaction.payloadHash;
      }
      return issues;
    }

    detectGrowthAnomaly(amount) {
      const config = this.economy.growthAnomaly || {};
      const available = Math.max(1, this.state.balances.available);
      const ratio = amount / available;
      const absolute = config.absoluteCreditThreshold || 50000;
      const ratioThreshold = config.ratioThreshold || 4;
      const minForRatio = config.minAmountForRatio || 5000;
      const rapidWindowMs = (config.rapidWindowMinutes || 10) * 60000;
      const recentCredits = this.state.ledger.filter(tx => tx.status === 'AUTHORIZED' && tx.amount > 0 && Date.now() - Date.parse(tx.createdAt) <= rapidWindowMs);
      const recentTotal = recentCredits.reduce((sum, tx) => sum + tx.amount, 0);
      const reasons = [];
      if (amount >= absolute) reasons.push('valor absoluto elevado');
      if (amount >= minForRatio && ratio >= ratioThreshold) reasons.push('crescimento desproporcional ao saldo anterior');
      if (amount + recentTotal >= (config.rapidAccumulationThreshold || 25000)) reasons.push('acúmulo rápido de créditos');
      return { detected: reasons.length > 0, reasons, ratio, recentTotal };
    }

    crossedCheckpoints(before, after) {
      const checkpoints = this.economy.walletCheckpoints || [];
      return checkpoints.filter(value => before < value && after >= value && !this.state.checkpoints.validated.includes(value));
    }

    createReview({ transactionId, type, direction, amount, level, reasons = [], checkpointValues = [], itemId = null, originEventId = null }) {
      const target = this.reviewLevel(amount);
      const review = {
        reviewId: uid('review'), transactionId, type, direction, amount, level: level || target.level,
        targetSeconds: target.targetSeconds || [5, 10], reasons, checkpointValues, itemId, originEventId,
        status: 'PENDING', createdAt: now(), teacherRequired: Boolean(target.teacherReview || reasons.length)
      };
      this.state.reviews.push(review);
      this.emit('review', clone(review));
      return review;
    }

    reward(event) {
      if (!event || !event.eventId || !event.type || !Number.isInteger(event.amount)) throw new Error('Evento de recompensa inválido.');
      if (this.state.processedEvents.includes(event.eventId)) throw new Error('Evento já processado.');
      const rule = this.economy.rewardTypes?.[event.type];
      if (!rule) throw new Error('Tipo de recompensa não autorizado.');
      if (event.amount < rule.min || event.amount > rule.max) throw new Error(`Valor fora da faixa ${rule.min}–${rule.max}.`);

      this.state.processedEvents.push(event.eventId);
      const reviewLevel = this.reviewLevel(event.amount);
      const anomaly = this.detectGrowthAnomaly(event.amount);
      const before = this.state.balances.available;
      const checkpoints = this.crossedCheckpoints(before, before + event.amount);
      const holdThreshold = this.economy.autoHold?.rewardFrom || 5000;
      const needsReview = Boolean(reviewLevel.teacherReview || anomaly.detected || event.amount >= holdThreshold);
      const status = needsReview ? 'UNDER_REVIEW' : 'AUTHORIZED';
      const transaction = this.appendTransaction({
        type: 'REWARD', status, amount: event.amount, originEventId: event.eventId,
        evidenceId: event.evidenceId || null, activityId: event.activityId || null,
        description: rule.label, reviewLevel: reviewLevel.level,
        validationTargetSeconds: reviewLevel.targetSeconds, anomalyReasons: anomaly.reasons,
        checkpointValues: checkpoints, balanceBefore: before, balanceAfter: needsReview ? before : before + event.amount
      });

      if (needsReview) {
        this.state.balances.underReview += event.amount;
        checkpoints.forEach(value => { if (!this.state.checkpoints.pending.includes(value)) this.state.checkpoints.pending.push(value); });
        const reasons = [...anomaly.reasons];
        if (event.amount >= holdThreshold) reasons.push(`recompensa acima do limiar automático de ${holdThreshold} moedas`);
        if (checkpoints.length) reasons.push(`checkpoint(s) de carteira: ${checkpoints.join(', ')}`);
        this.createReview({ transactionId: transaction.transactionId, type: 'REWARD', direction: 'CREDIT', amount: event.amount, level: reviewLevel.level, reasons, checkpointValues: checkpoints, originEventId: event.eventId });
        this.addIntegrityHistory('REVIEW_OPENED', 'Crédito em análise', `${event.amount} moedas aguardam validação ampliada.`, { transactionId: transaction.transactionId });
      } else {
        this.state.balances.available += event.amount;
        this.state.statistics.totalReceived += event.amount;
        this.state.statistics.rewards += 1;
        this.state.statistics.lastAuthorizedCreditAt = transaction.createdAt;
        checkpoints.forEach(value => { if (!this.state.checkpoints.validated.includes(value)) this.state.checkpoints.validated.push(value); });
        this.addIntegrityHistory('REWARD_AUTHORIZED', 'Recompensa autorizada', `${event.amount} moedas liberadas por ${rule.label.toLowerCase()}.`, { transactionId: transaction.transactionId });
      }
      this.save();
      this.emit('reward', clone(transaction));
      return clone(transaction);
    }

    purchase(itemId, discountPercent = 0) {
      if (this.isLocked('economy') || this.isLocked('store')) throw new Error('A economia está temporariamente bloqueada para validação.');
      const item = this.getItem(itemId);
      if (!item) throw new Error('Item inexistente no catálogo oficial.');
      if (this.state.inventory.includes(itemId)) throw new Error('Item já pertence ao inventário.');
      const allowed = discountPercent === 0 || (this.config.discountTiers || []).includes(discountPercent);
      if (!allowed) throw new Error('Faixa de desconto inválida.');
      const finalPrice = discountPercent === 100 ? 0 : Math.max(1, Math.round(item.basePrice * (1 - discountPercent / 100)));
      if (this.state.balances.available < finalPrice) throw new Error('Saldo disponível insuficiente.');

      const before = this.state.balances.available;
      this.state.balances.reserved = finalPrice;
      const review = this.reviewLevel(finalPrice);
      const transaction = this.appendTransaction({
        type: 'PURCHASE', status: 'AUTHORIZED', amount: -finalPrice, itemId: item.id,
        basePrice: item.basePrice, discountPercent, paidPrice: finalPrice,
        description: `Compra: ${item.name}`, reviewLevel: review.level,
        validationTargetSeconds: review.targetSeconds, balanceBefore: before, balanceAfter: before - finalPrice
      });
      this.state.balances.available -= finalPrice;
      this.state.balances.reserved = 0;
      this.state.inventory.push(itemId);
      this.state.statistics.totalSpent += finalPrice;
      this.state.statistics.purchases += 1;
      this.addIntegrityHistory('PURCHASE_AUTHORIZED', 'Compra autorizada', `${item.name} adquirido por ${finalPrice} moedas.`, { transactionId: transaction.transactionId });
      this.save();
      this.emit('purchase', clone(transaction));
      return clone(transaction);
    }

    resolveReview(reviewId, decision = 'APPROVE', options = {}) {
      const review = this.getReview(reviewId);
      if (!review || review.status !== 'PENDING') throw new Error('Revisão inexistente ou já concluída.');
      const actor = options.actor || 'professor-demo';
      const reason = options.reason || (decision === 'APPROVE' ? 'Origem e evidência confirmadas.' : 'Origem não confirmada.');
      review.status = decision === 'APPROVE' ? 'APPROVED' : 'BLOCKED';
      review.resolvedAt = now();
      review.resolvedBy = actor;
      review.resolutionReason = reason;

      if (review.direction === 'CREDIT') {
        this.state.balances.underReview = Math.max(0, this.state.balances.underReview - review.amount);
        if (decision === 'APPROVE') {
          const before = this.state.balances.available;
          this.state.balances.available += review.amount;
          const transaction = this.appendTransaction({
            type: 'REVIEW_RELEASE', status: 'AUTHORIZED', amount: review.amount,
            sourceTransactionId: review.transactionId, reviewId: review.reviewId,
            description: 'Saldo liberado após validação', reviewLevel: review.level,
            balanceBefore: before, balanceAfter: before + review.amount, resolvedBy: actor, resolutionReason: reason
          });
          this.state.statistics.totalReceived += review.amount;
          this.state.statistics.rewards += 1;
          review.checkpointValues.forEach(value => {
            this.state.checkpoints.pending = this.state.checkpoints.pending.filter(item => item !== value);
            if (!this.state.checkpoints.validated.includes(value)) this.state.checkpoints.validated.push(value);
          });
          this.addIntegrityHistory('REVIEW_APPROVED', 'Saldo liberado', `${review.amount} moedas foram aprovadas por validação pedagógica.`, { transactionId: transaction.transactionId, reviewId });
        } else {
          this.state.balances.blocked += review.amount;
          const transaction = this.appendTransaction({
            type: 'REVIEW_BLOCK', status: 'BLOCKED', amount: 0, blockedAmount: review.amount,
            sourceTransactionId: review.transactionId, reviewId: review.reviewId,
            description: 'Crédito bloqueado após revisão', reviewLevel: review.level,
            balanceBefore: this.state.balances.available, balanceAfter: this.state.balances.available,
            resolvedBy: actor, resolutionReason: reason
          });
          this.addIntegrityHistory('REVIEW_BLOCKED', 'Crédito bloqueado', `${review.amount} moedas não foram liberadas.`, { transactionId: transaction.transactionId, reviewId });
        }
      }
      this.save();
      this.emit('reviewResolved', clone(review));
      return clone(review);
    }

    registerIncident(incident) {
      const evidenceLevel = incident.evidenceLevel || 'ANOMALY';
      const record = {
        incidentId: uid('incident'), category: incident.category || 'UNCLASSIFIED', evidenceLevel,
        description: incident.description || 'Ocorrência registrada para análise.', status: 'OPEN',
        relatedTransactionId: incident.relatedTransactionId || null, createdAt: now()
      };
      this.state.incidents.push(record);
      if (evidenceLevel === 'CONFIRMED') this.state.integrity.warningCount += 1;
      this.addIntegrityHistory('INCIDENT_RECORDED', 'Ocorrência registrada', record.description, { incidentId: record.incidentId });
      this.save();
      return clone(record);
    }

    confirmIncident(incidentId, options = {}) {
      const incident = this.state.incidents.find(item => item.incidentId === incidentId);
      if (!incident) throw new Error('Ocorrência não encontrada.');
      incident.status = 'CONFIRMED';
      incident.confirmedAt = now();
      incident.confirmedBy = options.actor || 'professor-demo';
      this.state.integrity.warningCount += 1;
      const occurrence = this.state.integrity.warningCount;
      const policy = this.economy.penalties?.occurrences || [];
      const penaltyRule = policy.find(rule => rule.occurrence === occurrence) || policy.at(-1);
      let penaltyAmount = 0;
      if (penaltyRule && penaltyRule.percent > 0) {
        penaltyAmount = Math.min(Math.floor(this.state.balances.available * penaltyRule.percent / 100), penaltyRule.max || Infinity);
        if (penaltyAmount > 0) {
          const before = this.state.balances.available;
          this.state.balances.available -= penaltyAmount;
          this.appendTransaction({
            type: 'INTEGRITY_PENALTY', status: 'AUTHORIZED', amount: -penaltyAmount,
            incidentId, description: `Penalidade de integridade (${penaltyRule.percent}%)`,
            balanceBefore: before, balanceAfter: before - penaltyAmount, resolvedBy: incident.confirmedBy
          });
          this.state.statistics.totalSpent += penaltyAmount;
        }
      }
      this.state.integrity.score = Math.max(0, this.state.integrity.score - (penaltyRule?.scoreReduction || 100));
      if (penaltyRule?.lockMinutes) this.state.locks.storeUntil = new Date(Date.now() + penaltyRule.lockMinutes * 60000).toISOString();
      this.addIntegrityHistory('INCIDENT_CONFIRMED', 'Ocorrência confirmada', penaltyAmount ? `Aplicada penalidade de ${penaltyAmount} moedas.` : 'Advertência formal registrada sem multa.', { incidentId });
      this.save();
      return { incident: clone(incident), penaltyAmount, rule: clone(penaltyRule || {}) };
    }

    isLocked(scope) {
      const key = scope === 'store' ? 'storeUntil' : scope === 'profile' ? 'profileUntil' : 'economyUntil';
      const value = this.state.locks[key];
      return value ? Date.parse(value) > Date.now() : false;
    }

    audit(options = {}) {
      const issues = [];
      const chainIssues = this.validateChain();
      issues.push(...chainIssues);
      const expected = this.expectedAvailable();
      if (expected !== this.state.balances.available) {
        issues.push({ type: 'BALANCE_MISMATCH', expected, stored: this.state.balances.available });
        if (!options.silent) this.state.balances.available = expected;
      }
      const expectedReview = this.expectedUnderReview();
      if (expectedReview !== this.state.balances.underReview) {
        issues.push({ type: 'REVIEW_BALANCE_MISMATCH', expected: expectedReview, stored: this.state.balances.underReview });
        if (!options.silent) this.state.balances.underReview = expectedReview;
      }
      const inventoryIssues = this.state.inventory.filter(id => !this.getItem(id));
      if (inventoryIssues.length) issues.push({ type: 'UNKNOWN_ITEMS', items: inventoryIssues });
      this.state.integrity.lastAudit = now();
      this.state.integrity.issues = issues;
      this.state.integrity.status = issues.length ? 'attention' : 'stable';
      if (!options.silent) {
        this.state.integrity.score = issues.length ? Math.max(0, this.state.integrity.score - 5) : Math.min(1000, this.state.integrity.score + 1);
        this.addIntegrityHistory(issues.length ? 'AUDIT_ATTENTION' : 'AUDIT_OK', issues.length ? 'Auditoria com atenção' : 'Auditoria concluída', issues.length ? `${issues.length} divergência(s) encontrada(s).` : 'Saldo, extrato, inventário e hashes estão coerentes.');
        this.save();
      }
      return clone(this.state.integrity);
    }

    reset() {
      try { localStorage.removeItem(KEY); } catch (error) { /* armazenamento indisponível */ }
      this.state = this.seed();
      this.save();
      return this.getState();
    }
  }

  global.DSStoreFoundation = DSStoreFoundation;
  global.DSStore = new DSStoreFoundation();
})(window);

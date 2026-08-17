(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DSStoreSDK = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';

  const VERSION = '0.10.0-AGVCORE';
  const PROTOCOL = 'DS_STORE_EVENT_V1';
  const RESPONSE_PROTOCOL = 'DS_STORE_RESULT_V1';
  const DEFAULT_QUEUE_KEY = 'ds-store-sdk-queue-v0.9.0';
  const EVENT_METHODS = {
    tutorialCompleted: 'TUTORIAL_COMPLETED',
    toolResultCreated: 'TOOL_RESULT_CREATED',
    labCompleted: 'LAB_COMPLETED',
    phaseCompleted: 'PHASE_COMPLETED',
    missionCompleted: 'MISSION_COMPLETED',
    challengeCompleted: 'CHALLENGE_COMPLETED',
    projectPublished: 'PROJECT_PUBLISHED',
    evidenceExported: 'EVIDENCE_EXPORTED',
    achievementUnlocked: 'ACHIEVEMENT_UNLOCKED',
    teacherReward: 'TEACHER_REWARD',
    sessionCompleted: 'SESSION_COMPLETED',
    collaborationValidated: 'COLLABORATION_VALIDATED',
    feedbackConfirmed: 'FEEDBACK_CONFIRMED',
    bugReportConfirmed: 'BUG_REPORT_CONFIRMED',
    learningProgress: 'LEARNING_PROGRESS',
    recoveryCompleted: 'RECOVERY_COMPLETED'
  };

  const memoryStorage = new Map();
  const uid = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const getStorage = () => ({
    getItem(key) { try { return root.localStorage?.getItem(key) ?? memoryStorage.get(key) ?? null; } catch { return memoryStorage.get(key) ?? null; } },
    setItem(key, value) { try { root.localStorage?.setItem(key, value); } catch { memoryStorage.set(key, value); } }
  });

  function normalizeConfig(config) {
    const fallback = root.DS_INTEGRATION_CONFIG || {};
    return {
      protocol: fallback.protocol || PROTOCOL,
      responseProtocol: fallback.responseProtocol || RESPONSE_PROTOCOL,
      queueKey: fallback.queueKey || DEFAULT_QUEUE_KEY,
      maxQueueSize: fallback.maxQueueSize || 100,
      requestTimeoutMs: fallback.requestTimeoutMs || 8000,
      requireEvidenceFor: fallback.requireEvidenceFor || [],
      platforms: fallback.platforms || [],
      ...config
    };
  }

  function platformMap(config) {
    return Object.fromEntries((config.platforms || []).map(platform => [platform.id, platform]));
  }

  function standardResult(event, transaction, store) {
    const state = store?.getState?.() || null;
    return {
      protocol: RESPONSE_PROTOCOL,
      ok: true,
      code: transaction.status === 'UNDER_REVIEW' ? 'REWARD_UNDER_REVIEW' : 'REWARD_AUTHORIZED',
      status: transaction.status,
      eventId: event.eventId,
      transactionId: transaction.transactionId,
      reviewLevel: transaction.reviewLevel || null,
      validationTargetSeconds: transaction.validationTargetSeconds || null,
      balances: state ? clone(state.balances) : null,
      message: transaction.status === 'UNDER_REVIEW' ? 'Recompensa registrada e encaminhada para validação.' : 'Recompensa autorizada e liberada na carteira.',
      receivedAt: now()
    };
  }

  function errorResult(event, error, code = 'SDK_ERROR') {
    return {
      protocol: RESPONSE_PROTOCOL,
      ok: false,
      code,
      status: 'REJECTED',
      eventId: event?.eventId || null,
      message: error?.message || String(error),
      receivedAt: now()
    };
  }

  class SDKClient {
    constructor(options = {}) {
      this.config = normalizeConfig(options.config || {});
      this.store = options.store || root.DSStore || null;
      this.core = options.core || root.AGVCore || null;
      this.platformId = options.platformId || 'platform-not-configured';
      this.profileId = options.profileId || 'profile-not-configured';
      this.transport = options.transport || (this.core?.rewards?.claim ? 'agv-core' : (this.store ? 'direct' : 'postMessage'));
      this.targetWindow = options.targetWindow || root.parent;
      this.targetOrigin = options.targetOrigin || '*';
      this.platforms = platformMap(this.config);
      this.storage = getStorage();
      this.listeners = new Map();
      this.pending = new Map();
      this.boundMessage = event => this.handleResponse(event);
      root.addEventListener?.('message', this.boundMessage);
      Object.entries(EVENT_METHODS).forEach(([method, type]) => {
        this[method] = payload => this.reward({ ...payload, type });
      });
    }

    destroy() {
      root.removeEventListener?.('message', this.boundMessage);
      this.pending.forEach(pending => pending.reject(new Error('SDK encerrado.')));
      this.pending.clear();
    }

    configure(options = {}) {
      if (options.platformId) this.platformId = options.platformId;
      if (options.profileId) this.profileId = options.profileId;
      if (options.transport) this.transport = options.transport;
      if (options.targetWindow) this.targetWindow = options.targetWindow;
      if (options.targetOrigin) this.targetOrigin = options.targetOrigin;
      return this;
    }

    getVersion() { return VERSION; }
    getPlatform() { return clone(this.platforms[this.platformId] || { id: this.platformId, name: this.platformId, allowedEvents: [] }); }
    getCapabilities() {
      return {
        version: VERSION,
        transports: ['agv-core', 'direct', 'postMessage', 'offline-queue'],
        eventTypes: Object.values(EVENT_METHODS),
        platform: this.getPlatform(),
        storeAvailable: Boolean(this.store?.reward),
        coreAvailable: Boolean(this.core?.rewards?.claim),
        officialEconomy: this.transport === 'agv-core',
        queueSize: this.getQueue().length
      };
    }

    on(type, listener) {
      const listeners = this.listeners.get(type) || [];
      listeners.push(listener);
      this.listeners.set(type, listeners);
      return () => this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item !== listener));
    }

    emit(type, payload) { (this.listeners.get(type) || []).forEach(listener => listener(clone(payload))); }

    normalizeEvent(input = {}) {
      return {
        eventId: input.eventId || uid('reward'),
        profileId: input.profileId || this.profileId,
        platformId: input.platformId || this.platformId,
        type: input.type,
        amount: Number(input.amount),
        evidenceId: input.evidenceId || null,
        activityId: input.activityId || null,
        attemptId: input.attemptId || null,
        occurredAt: input.occurredAt || now(),
        metadata: input.metadata && typeof input.metadata === 'object' ? input.metadata : {}
      };
    }

    validateEvent(event) {
      const errors = [];
      if (!event.eventId || event.eventId.length < 6) errors.push('eventId inválido');
      if (!event.profileId || event.profileId.length < 3) errors.push('profileId inválido');
      if (!event.platformId) errors.push('platformId ausente');
      if (!Object.values(EVENT_METHODS).includes(event.type)) errors.push('tipo de evento não reconhecido');
      if (this.transport !== 'agv-core' && (!Number.isInteger(event.amount) || event.amount < 1 || event.amount > 500000)) errors.push('amount deve ser inteiro entre 1 e 500.000 no modo legado');
      const platform = this.platforms[event.platformId];
      if (platform?.allowedEvents?.length && !platform.allowedEvents.includes(event.type)) errors.push(`evento ${event.type} não permitido para ${event.platformId}`);
      if (this.config.requireEvidenceFor.includes(event.type) && !event.evidenceId) errors.push('evidenceId obrigatório para este evento');
      return { valid: errors.length === 0, errors };
    }

    async reward(input) {
      const event = this.normalizeEvent(input);
      const validation = this.validateEvent(event);
      if (!validation.valid) {
        const result = errorResult(event, new Error(validation.errors.join('; ')), 'INVALID_EVENT');
        this.emit('result', result);
        return result;
      }
      this.emit('dispatch', event);
      if (this.transport === 'agv-core') return this.dispatchCore(event);
      if (this.transport === 'direct' && this.store?.reward) return this.dispatchDirect(event);
      if (this.transport === 'postMessage' && this.targetWindow?.postMessage) return this.dispatchMessage(event);
      return this.enqueue(event, 'TRANSPORT_UNAVAILABLE');
    }


    async dispatchCore(event) {
      if (!this.core?.rewards?.claim) {
        const result = errorResult(event, new Error('AGV Education Core indisponível. Recompensa oficial não foi enfileirada.'), 'CORE_UNAVAILABLE');
        this.emit('result', result);
        return result;
      }
      try {
        const response = await this.core.rewards.claim({
          activityId: event.activityId,
          eventType: event.type,
          evidenceId: event.evidenceId,
          attemptId: event.attemptId,
          metadata: event.metadata || {},
          idempotencyKey: event.eventId
        });
        const wallet = response.wallet || response.walletSummary || response.balances || null;
        const result = {
          protocol: RESPONSE_PROTOCOL,
          ok: response.ok !== false,
          code: response.code || 'CORE_REWARD_ACCEPTED',
          status: response.status || 'AUTHORIZED',
          eventId: event.eventId,
          transactionId: response.transactionId || response.transaction_id || null,
          reviewLevel: response.reviewLevel || null,
          balances: wallet,
          rewards: response.rewards || null,
          message: response.message || 'Evento processado pelo AGV Education Core.',
          receivedAt: now(),
          authority: 'AGV_EDUCATION_CORE'
        };
        this.emit('result', result);
        return result;
      } catch (error) {
        const result = errorResult(event, error, error?.code || 'CORE_REJECTED');
        this.emit('result', result);
        return result;
      }
    }

    async dispatchDirect(event) {
      try {
        const transaction = this.store.reward(event);
        const result = standardResult(event, transaction, this.store);
        this.emit('result', result);
        return result;
      } catch (error) {
        const code = /já processado/i.test(error.message) ? 'DUPLICATE_EVENT' : 'STORE_REJECTED';
        const result = errorResult(event, error, code);
        this.emit('result', result);
        return result;
      }
    }

    dispatchMessage(event) {
      const requestId = uid('request');
      const envelope = { protocol: this.config.protocol, requestId, event };
      return new Promise(resolve => {
        const timeout = setTimeout(() => {
          this.pending.delete(requestId);
          resolve(this.enqueue(event, 'BRIDGE_TIMEOUT'));
        }, this.config.requestTimeoutMs);
        this.pending.set(requestId, { resolve, timeout });
        this.targetWindow.postMessage(envelope, this.targetOrigin);
      });
    }

    handleResponse(messageEvent) {
      const data = messageEvent.data;
      if (!data || data.protocol !== this.config.responseProtocol || !data.requestId) return;
      const pending = this.pending.get(data.requestId);
      if (!pending) return;
      clearTimeout(pending.timeout);
      this.pending.delete(data.requestId);
      pending.resolve(data.result);
      this.emit('result', data.result);
    }

    getQueue() {
      try { return JSON.parse(this.storage.getItem(this.config.queueKey) || '[]'); } catch { return []; }
    }

    saveQueue(queue) { this.storage.setItem(this.config.queueKey, JSON.stringify(queue.slice(-this.config.maxQueueSize))); }

    enqueue(event, reason) {
      const queue = this.getQueue();
      if (!queue.some(item => item.event.eventId === event.eventId)) queue.push({ queuedAt: now(), reason, event });
      this.saveQueue(queue);
      const result = {
        protocol: RESPONSE_PROTOCOL, ok: true, code: 'QUEUED_OFFLINE', status: 'QUEUED', eventId: event.eventId,
        message: 'Evento guardado na fila local para nova tentativa.', queueSize: queue.length, receivedAt: now()
      };
      this.emit('queued', result);
      return result;
    }

    async flushQueue() {
      const original = this.getQueue();
      const remaining = [];
      const results = [];
      for (const entry of original) {
        const result = this.store?.reward ? await this.dispatchDirect(entry.event) : errorResult(entry.event, new Error('Loja ainda indisponível.'), 'STORE_UNAVAILABLE');
        results.push(result);
        if (!result.ok && result.code !== 'DUPLICATE_EVENT') remaining.push(entry);
      }
      this.saveQueue(remaining);
      return { processed: original.length - remaining.length, remaining: remaining.length, results };
    }
  }

  class StoreBridge {
    constructor(options = {}) {
      this.store = options.store || root.DSStore;
      this.allowedOrigins = options.allowedOrigins || [root.location?.origin].filter(Boolean);
      this.allowNullOrigin = Boolean(options.allowNullOrigin);
      this.bound = event => this.handle(event);
    }
    start() { root.addEventListener?.('message', this.bound); return this; }
    stop() { root.removeEventListener?.('message', this.bound); }
    originAllowed(origin) { return this.allowedOrigins.includes('*') || this.allowedOrigins.includes(origin) || (this.allowNullOrigin && origin === 'null'); }
    handle(messageEvent) {
      const data = messageEvent.data;
      if (!data || data.protocol !== PROTOCOL || !data.requestId || !data.event) return;
      if (!this.originAllowed(messageEvent.origin)) return;
      let result;
      try { result = standardResult(data.event, this.store.reward(data.event), this.store); }
      catch (error) { result = errorResult(data.event, error, /já processado/i.test(error.message) ? 'DUPLICATE_EVENT' : 'STORE_REJECTED'); }
      messageEvent.source?.postMessage({ protocol: RESPONSE_PROTOCOL, requestId: data.requestId, result }, messageEvent.origin === 'null' ? '*' : messageEvent.origin);
    }
  }

  function create(options) { return new SDKClient(options); }
  function createAdapter(platformId, options = {}) { return new SDKClient({ ...options, platformId }); }
  function startBridge(options = {}) { return new StoreBridge(options).start(); }

  return { VERSION, PROTOCOL, RESPONSE_PROTOCOL, EVENT_METHODS, SDKClient, StoreBridge, create, createAdapter, startBridge };
});

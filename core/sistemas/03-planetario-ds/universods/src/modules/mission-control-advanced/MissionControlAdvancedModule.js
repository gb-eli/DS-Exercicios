import { MissionStateMachine } from '../../core/mission/MissionStateMachine.js';
import { PriorityMessageQueue } from '../../core/mission/PriorityMessageQueue.js';
import { ReplayBuffer } from '../../core/mission/ReplayBuffer.js';
import { HolographicRadarRenderer } from '../../rendering/HolographicRadarRenderer.js';
import {
  MISSION_CONTROL_SCENARIOS,
  FLIGHT_STATES,
  FLIGHT_TRANSITIONS,
  RESOLUTION_OPTIONS
} from '../../data/missionControlScenarios.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

const ROOT_CAUSES = {
  'thermal-drift': 'sensor-drift',
  'queue-overflow': 'consumer-slow',
  'packet-loss': 'unstable-link',
  'power-sag': 'excess-load'
};

class MissionControlAdvancedModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.worker = null;
    this.fallbackTimer = null;
    this.running = false;
    this.workerAvailable = false;
    this.activeTab = 'operations';
    this.selectedScenario = MISSION_CONTROL_SCENARIOS[0].id;
    this.activeFault = null;
    this.solvedScenarios = new Set();
    this.logs = [];
    this.telemetry = null;
    this.machine = new MissionStateMachine({
      initial: 'STANDBY',
      states: FLIGHT_STATES.map(item => item.id),
      transitions: FLIGHT_TRANSITIONS
    });
    this.queue = new PriorityMessageQueue(48);
    this.replay = new ReplayBuffer(180);
    this.replayIndex = 0;
    this.replayAnalysis = null;
    this.queueBurstInjected = false;
    this.incorrectAttempts = 0;
    this.radarRenderer = null;
    this.onClick = event => this.handleClick(event);
    this.onInput = event => this.handleInput(event);
  }

  mount(container, context) {
    this.container = container;
    this.context = context;
    const completed = this.context.profileStore.active().completedExperiences;
    for (const scenario of MISSION_CONTROL_SCENARIOS) {
      if (completed.includes(`control-advanced-${scenario.id}`)) this.solvedScenarios.add(scenario.id);
    }
    this.logs = [
      this.log('INFO', 'Centro avançado carregado sob demanda.'),
      this.log('INFO', 'Máquina de estados em STANDBY.'),
      this.log('INFO', 'Buffer de replay e fila prioritária inicializados.')
    ];
    container.addEventListener('click', this.onClick);
    container.addEventListener('input', this.onInput);
    this.createWorker();
    this.render();
    this.startTelemetry();
  }

  unmount() {
    this.stopTelemetry();
    this.worker?.terminate();
    this.radarRenderer?.destroy();
    this.radarRenderer = null;
    this.worker = null;
    clearInterval(this.fallbackTimer);
    this.container?.removeEventListener('click', this.onClick);
    this.container?.removeEventListener('input', this.onInput);
  }

  createWorker() {
    if (!('Worker' in globalThis)) return;
    try {
      this.worker = new Worker(new URL('../../workers/telemetry.worker.js', import.meta.url), { type: 'module' });
      this.worker.addEventListener('message', event => this.handleWorkerMessage(event.data));
      this.worker.addEventListener('error', () => this.activateFallback('Falha no Web Worker'));
      this.workerAvailable = true;
      this.worker.postMessage({ type: 'quality', payload: { quality: this.qualityId() } });
    } catch (error) {
      this.activateFallback(error.message || 'Web Worker indisponível');
    }
  }

  qualityId() {
    const id = this.context?.settingsStore?.getProfile?.().id ?? 'balanced';
    return ['performance','balanced','experience'].includes(id) ? id : 'balanced';
  }

  startTelemetry() {
    this.running = true;
    if (this.worker) this.worker.postMessage({ type: 'start' });
    else this.startFallbackTimer();
    this.updateRuntimeStatus();
  }

  stopTelemetry() {
    this.running = false;
    this.worker?.postMessage({ type: 'stop' });
    clearInterval(this.fallbackTimer);
    this.fallbackTimer = null;
    this.updateRuntimeStatus();
  }

  activateFallback(reason) {
    this.worker?.terminate();
    this.worker = null;
    this.workerAvailable = false;
    this.logs.unshift(this.log('WARN', `${reason}. Telemetria local simplificada ativada.`));
    if (this.running) this.startFallbackTimer();
    this.updateRuntimeStatus();
  }

  startFallbackTimer() {
    clearInterval(this.fallbackTimer);
    const delay = this.qualityId() === 'experience' ? 400 : this.qualityId() === 'performance' ? 1100 : 700;
    this.fallbackTimer = setInterval(() => this.generateFallbackSample(), delay);
  }

  generateFallbackSample() {
    const tick = (this.telemetry?.tick ?? 0) + 1;
    const wave = Math.sin(tick * 0.24);
    const active = this.activeFault;
    const sample = {
      tick,
      timestamp: Date.now(),
      altitude: 135 + tick * 1.9,
      velocity: 7.48 + wave * 0.1,
      temperatureA: 610 + wave * 12,
      temperatureB: 612 + wave * 10 + (active === 'thermal-drift' ? Math.min(280, tick * 5) : 0),
      link: active === 'packet-loss' ? 62 + wave * 8 : 99 - Math.abs(wave),
      latency: active === 'packet-loss' ? 970 + Math.abs(wave) * 220 : 120 + Math.abs(wave) * 25,
      voltage: active === 'power-sag' ? 23.7 + wave * 0.4 : 28.3 + wave * 0.2,
      powerLoad: active === 'power-sag' ? 94 : 68 + wave * 4,
      incoming: active === 'queue-overflow' ? 18 : 6,
      processed: active === 'queue-overflow' && !this.queue.backpressure ? 3 : 7,
      lostPackets: active === 'packet-loss' ? tick * 3 : 0,
      droppedPackets: this.queue.metrics().dropped,
      scenario: active,
      faultActive: Boolean(active)
    };
    sample.temperature = Math.max(sample.temperatureA, sample.temperatureB);
    this.consumeTelemetry(sample);
  }

  handleWorkerMessage(message) {
    if (!message) return;
    if (message.type === 'telemetry') this.consumeTelemetry(message.payload);
    if (message.type === 'status') {
      this.running = message.payload.running;
      this.updateRuntimeStatus();
    }
    if (message.type === 'fault') {
      this.activeFault = message.payload.active ? message.payload.id : null;
      this.updateFaultStatus();
    }
  }

  consumeTelemetry(sample) {
    const incoming = Math.min(12, Math.max(1, Math.round(sample.incoming ?? 5)));
    for (let index = 0; index < incoming; index++) {
      const priority = sample.tick % 9 === 0 && index === 0 ? 'critical' : index % 5 === 0 ? 'high' : index % 3 === 0 ? 'normal' : 'low';
      this.queue.enqueue({
        sequence: `${sample.tick}-${index}`,
        channel: priority === 'critical' ? 'GUIDANCE' : priority === 'high' ? 'HEALTH' : priority === 'normal' ? 'NAV' : 'SCIENCE'
      }, priority);
    }
    const processing = this.activeFault === 'queue-overflow' && !this.queue.backpressure ? 2 : Math.max(3, Math.round(sample.processed ?? 5));
    this.queue.dequeue(processing);
    const metrics = this.queue.metrics();
    const normalized = {
      ...sample,
      queueDepth: metrics.size,
      droppedPackets: Math.max(sample.droppedPackets ?? 0, metrics.dropped)
    };
    normalized.temperature = Math.max(normalized.temperatureA ?? normalized.temperature, normalized.temperatureB ?? normalized.temperature);
    this.telemetry = normalized;
    this.replay.push(normalized);
    this.replayIndex = Math.max(0, this.replay.size() - 1);

    if (normalized.tick % 8 === 0) {
      this.logs.unshift(this.log('DATA', `Pacote ${String(normalized.tick).padStart(4,'0')} · fila ${metrics.size}/${metrics.maxSize} · ${normalized.latency.toFixed(0)} ms.`));
      this.trimLogs();
    }
    this.updateLivePanels();
  }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back') return this.context.onBack();
    if (action === 'tab') {
      this.activeTab = target.dataset.tab;
      this.render();
      return;
    }
    if (action === 'toggle-stream') {
      this.running ? this.stopTelemetry() : this.startTelemetry();
      this.render();
      return;
    }
    if (action === 'step-stream') {
      if (this.worker) this.worker.postMessage({ type: 'step' });
      else this.generateFallbackSample();
      return;
    }
    if (action === 'select-scenario') {
      this.selectedScenario = target.dataset.scenario;
      this.render();
      return;
    }
    if (action === 'inject-scenario') return this.injectScenario(this.selectedScenario);
    if (action === 'resolve-scenario') return this.resolveScenario(target.dataset.resolution);
    if (action === 'state-command') return this.sendStateCommand(target.dataset.command);
    if (action === 'reset-state-machine') {
      this.machine.reset();
      this.logs.unshift(this.log('STATE', 'Máquina de estados reiniciada para STANDBY.'));
      this.render();
      return;
    }
    if (action === 'queue-add') return this.addQueueMessage(target.dataset.priority);
    if (action === 'queue-process') {
      const count = Number(target.dataset.count || 1);
      const processed = this.queue.dequeue(count);
      this.logs.unshift(this.log('QUEUE', `${processed.length} mensagem(ns) processada(s) manualmente.`));
      this.render();
      return;
    }
    if (action === 'queue-burst') return this.injectQueueBurst();
    if (action === 'queue-backpressure') return this.activateBackpressure();
    if (action === 'queue-clear') {
      this.queue.clear();
      this.render();
      return;
    }
    if (action === 'analyze-replay') return this.analyzeReplay();
    if (action === 'replay-cause') return this.answerReplayCause(target.dataset.cause);
    if (action === 'reset-simulation') return this.resetSimulation();
  }

  handleInput(event) {
    if (event.target.matches('[data-input="replay"]')) {
      this.replayIndex = Number(event.target.value);
      this.updateReplayFrame();
    }
  }

  injectScenario(id) {
    const scenario = this.scenario(id);
    if (!scenario) return;
    this.activeFault = id;
    this.replayAnalysis = null;
    if (id === 'queue-overflow') this.queue.setBackpressure(false);
    this.worker?.postMessage({ type: 'inject', payload: { id } });
    this.logs.unshift(this.log('ALERT', `${scenario.title}: ${scenario.brief}`));
    this.trimLogs();
    this.context.toast(`Cenário ${scenario.level} injetado: ${scenario.title}.`);
    this.render();
  }

  resolveScenario(resolution) {
    const scenario = this.scenario(this.activeFault ?? this.selectedScenario);
    if (!this.activeFault || !scenario) return this.context.toast('Injete o cenário antes de aplicar uma resposta.');
    if (resolution !== scenario.correctResolution) {
      this.incorrectAttempts++;
      this.logs.unshift(this.log('DENY', `Resposta bloqueada: ${this.resolution(resolution)?.label ?? resolution} não trata a causa principal.`));
      this.context.toast('A resposta não é segura para este cenário. Analise sintomas e prioridades.');
      this.render();
      return;
    }

    if (resolution === 'activate-backpressure') this.queue.setBackpressure(true);
    this.solvedScenarios.add(scenario.id);
    this.activeFault = null;
    this.worker?.postMessage({ type: 'mitigate', payload: { id: scenario.id } });
    const awarded = this.context.profileStore.addXp(scenario.xp, `control-advanced-${scenario.id}`);
    this.logs.unshift(this.log('OK', `${scenario.title} mitigada com ${scenario.resolutionLabel}.`));
    this.context.toast(awarded ? `Cenário resolvido: +${scenario.xp} XP.` : 'Cenário revisado; XP já registrado.');
    this.checkCertification();
    this.render();
  }

  checkCertification() {
    const completed = this.context.profileStore.active().completedExperiences;
    const allSolved = MISSION_CONTROL_SCENARIOS.every(item => this.solvedScenarios.has(item.id) || completed.includes(`control-advanced-${item.id}`));
    if (!allSolved) return;
    const awarded = this.context.profileStore.addXp(240, 'control-advanced-certification');
    if (awarded) {
      this.logs.unshift(this.log('CERT', 'Certificação Operador de Sistemas Críticos concluída.'));
      this.context.toast('Todos os cenários concluídos: certificação +240 XP.');
    }
  }

  sendStateCommand(command) {
    const result = this.machine.send(command, { operator: this.context.profileStore.active().callsign });
    if (result.accepted) {
      this.logs.unshift(this.log('STATE', `${result.from} → ${result.to} por ${command}.`));
      if (result.to === 'DEPLOYMENT') {
        const awarded = this.context.profileStore.addXp(160, 'control-state-machine');
        this.context.toast(awarded ? 'Sequência orbital válida: +160 XP.' : 'Sequência revisada; XP já registrado.');
      }
    } else {
      this.logs.unshift(this.log('DENY', result.reason));
      this.context.toast('Transição inválida bloqueada pela máquina de estados.');
    }
    this.trimLogs();
    this.render();
  }

  addQueueMessage(priority = 'normal') {
    const result = this.queue.enqueue({ channel: `${priority.toUpperCase()}-MANUAL`, source: 'operator' }, priority);
    this.logs.unshift(this.log('QUEUE', result.accepted ? `Mensagem ${priority} adicionada.` : `Mensagem ${priority} rejeitada (${result.reason}).`));
    this.render();
  }

  injectQueueBurst() {
    this.queueBurstInjected = true;
    for (let index = 0; index < 58; index++) {
      const priority = index % 17 === 0 ? 'critical' : index % 7 === 0 ? 'high' : 'low';
      this.queue.enqueue({ channel: priority === 'low' ? 'SCIENCE-BULK' : 'SYSTEM', burst: true }, priority);
    }
    this.logs.unshift(this.log('ALERT', 'Rajada de 58 mensagens recebida; fila próxima da saturação.'));
    this.context.toast('Rajada injetada. Preserve mensagens críticas sem travar a interface.');
    this.render();
  }

  activateBackpressure() {
    const metrics = this.queue.metrics();
    if (!this.queueBurstInjected || metrics.utilization < 0.7) {
      this.context.toast('A fila ainda não demonstra saturação suficiente para validar o checkpoint.');
      return;
    }
    this.queue.setBackpressure(true);
    const awarded = this.context.profileStore.addXp(150, 'control-queue-backpressure');
    this.logs.unshift(this.log('OK', 'Backpressure ativo; mensagens low passam a ser rejeitadas antes de ocupar a fila crítica.'));
    this.context.toast(awarded ? 'Controle de fluxo validado: +150 XP.' : 'Checkpoint revisado; XP já registrado.');
    this.render();
  }

  analyzeReplay() {
    if (this.replay.size() < 8) {
      this.context.toast('Colete pelo menos oito amostras antes da análise.');
      return;
    }
    this.replayAnalysis = {
      summary: this.replay.summarize(),
      anomalies: this.replay.detectAnomalies(),
      scenario: this.selectedScenario
    };
    this.logs.unshift(this.log('REPLAY', `${this.replayAnalysis.anomalies.length} eventos anormais detectados no buffer.`));
    this.render();
  }

  answerReplayCause(cause) {
    if (!this.replayAnalysis) return;
    const expected = ROOT_CAUSES[this.replayAnalysis.scenario];
    if (cause !== expected) {
      this.incorrectAttempts++;
      this.context.toast('Hipótese não confirmada pelos dados. Compare o pico com os sintomas do cenário.');
      return;
    }
    const awarded = this.context.profileStore.addXp(140, 'control-replay-analysis');
    this.logs.unshift(this.log('OK', `Causa raiz confirmada no replay: ${cause}.`));
    this.context.toast(awarded ? 'Análise de replay validada: +140 XP.' : 'Análise revisada; XP já registrado.');
    this.render();
  }

  resetSimulation() {
    this.activeFault = null;
    this.telemetry = null;
    this.replay.clear();
    this.queue = new PriorityMessageQueue(48);
    this.machine.reset();
    this.replayAnalysis = null;
    this.queueBurstInjected = false;
    this.worker?.postMessage({ type: 'reset' });
    this.logs.unshift(this.log('INFO', 'Simulação reiniciada; progresso e XP do perfil foram preservados.'));
    this.render();
  }

  scenario(id) { return MISSION_CONTROL_SCENARIOS.find(item => item.id === id); }
  resolution(id) { return RESOLUTION_OPTIONS.find(item => item.id === id); }
  log(type, message) { return { type, message, at: new Date().toLocaleTimeString('pt-BR', { hour12: false }) }; }
  trimLogs() { if (this.logs.length > 28) this.logs.length = 28; }

  render() {
    if (!this.container) return;
    this.radarRenderer?.destroy();
    this.radarRenderer = null;
    const profile = this.context.profileStore.active();
    this.container.innerHTML = `<section class="section glass module-view advanced-control">
      <div class="section-head advanced-head">
        <div><span class="eyebrow">Fase 3 · Sistemas distribuídos e críticos</span><h2>Centro de Controle Avançado</h2><p>Telemetria em Worker, máquina de estados, filas prioritárias, replay e recuperação de falhas em uma única operação modular.</p></div>
        <div class="hero-actions"><span class="tag">${escapeHtml(profile.callsign)} · ${this.qualityId()}</span><button class="button secondary" data-action="back">← Voltar ao portal</button></div>
      </div>
      <div class="control-runtime-strip">
        <span class="runtime-light ${this.running ? 'online' : ''}"></span><b id="runtime-label">${this.running ? 'TELEMETRIA ATIVA' : 'TELEMETRIA PAUSADA'}</b>
        <span id="worker-label">${this.workerAvailable ? 'WEB WORKER' : 'FALLBACK LOCAL'}</span>
        <span id="sample-label">${this.replay.size()} AMOSTRAS</span>
        <span>${this.solvedScenarios.size}/${MISSION_CONTROL_SCENARIOS.length} CENÁRIOS</span>
      </div>
      <nav class="module-tabs control-tabs" aria-label="Áreas do Centro de Controle">
        ${this.tabButton('operations','Operação','◉')}
        ${this.tabButton('states','Estados','◇')}
        ${this.tabButton('queue','Fila','▤')}
        ${this.tabButton('replay','Replay','↺')}
        ${this.tabButton('logs','Logs','⌁')}
      </nav>
      <div class="control-tab-host">${this.tabMarkup()}</div>
    </section>`;
    requestAnimationFrame(() => {
      this.drawChart();
      this.updateReplayFrame();
      const radar = this.container.querySelector('#mission-radar');
      if (radar) {
        this.radarRenderer = new HolographicRadarRenderer(radar, this.context.settingsStore);
        this.radarRenderer.start();
      }
    });
  }

  tabButton(id, label, icon) {
    return `<button class="module-tab ${this.activeTab === id ? 'active' : ''}" data-action="tab" data-tab="${id}"><span>${icon}</span>${label}</button>`;
  }

  tabMarkup() {
    if (this.activeTab === 'states') return this.statesMarkup();
    if (this.activeTab === 'queue') return this.queueMarkup();
    if (this.activeTab === 'replay') return this.replayMarkup();
    if (this.activeTab === 'logs') return this.logsMarkup();
    return this.operationsMarkup();
  }

  operationsMarkup() {
    const sample = this.telemetry ?? this.emptySample();
    const selected = this.scenario(this.selectedScenario);
    return `<div class="control-operations">
      <section class="flight-visual" style="--scenario:${selected.color}">
        <canvas id="mission-radar" class="mission-radar" aria-label="Radar holográfico da missão"></canvas><div class="flight-grid"></div><div class="planet-horizon"></div><div class="trajectory-line"></div>
        <div class="vehicle-hologram ${this.running ? 'moving' : ''}"><span>▲</span><i></i></div>
        <div class="flight-label"><span>DIGITAL TWIN · COSMOS-03</span><strong>${this.activeFault ? 'ANOMALIA ATIVA' : 'OPERAÇÃO NOMINAL'}</strong><small>Estado: ${this.machine.current} · Altitude ${sample.altitude.toFixed(0)} km</small></div>
      </section>
      <section class="telemetry-grid control-telemetry" id="advanced-telemetry">${this.telemetryMarkup(sample)}</section>
      <section class="control-main-grid">
        <article class="panel glass chart-panel">
          <div class="section-head compact"><div><h3>Fluxo de telemetria</h3><p>Temperatura, latência e qualidade do link no buffer local.</p></div><div class="hero-actions"><button class="button small secondary" data-action="toggle-stream">${this.running ? 'Pausar' : 'Retomar'}</button><button class="button small secondary" data-action="step-stream">Passo único</button><button class="button small danger" data-action="reset-simulation">Reiniciar</button></div></div>
          <canvas id="telemetry-chart" class="telemetry-chart" aria-label="Gráfico de telemetria"></canvas>
          <div class="chart-legend"><span><i class="temp"></i>Temperatura</span><span><i class="latency"></i>Latência</span><span><i class="link"></i>Link</span></div>
        </article>
        <aside class="panel glass scenario-console" style="--scenario:${selected.color}">
          <span class="eyebrow">Cenários progressivos</span><div class="scenario-selector">${MISSION_CONTROL_SCENARIOS.map(item => this.scenarioButton(item)).join('')}</div>
          <div class="scenario-brief"><span>NÍVEL ${selected.level} · ${selected.subtitle}</span><h3>${selected.icon} ${selected.title}</h3><p>${selected.brief}</p><strong>Objetivo</strong><p>${selected.objective}</p><div class="concept-tags">${selected.dsConcepts.map(item => `<em>${item}</em>`).join('')}</div></div>
          <button class="button primary full" data-action="inject-scenario">Injetar cenário</button>
        </aside>
      </section>
      ${this.activeFault ? this.faultResolutionMarkup(this.scenario(this.activeFault)) : this.certificationMarkup()}
    </div>`;
  }

  scenarioButton(item) {
    const solved = this.solvedScenarios.has(item.id) || this.context.profileStore.hasCompleted(`control-advanced-${item.id}`);
    return `<button class="scenario-chip ${this.selectedScenario === item.id ? 'active' : ''} ${solved ? 'solved' : ''}" style="--scenario:${item.color}" data-action="select-scenario" data-scenario="${item.id}"><span>${item.icon}</span><b>${item.level}</b><small>${item.title}</small></button>`;
  }

  faultResolutionMarkup(scenario) {
    const options = RESOLUTION_OPTIONS.filter(option => {
      const sets = {
        'thermal-drift': ['restart-all','isolate-sensor-b'],
        'queue-overflow': ['drop-critical','activate-backpressure'],
        'packet-loss': ['retry-everything','selective-retry'],
        'power-sag': ['disable-navigation','shed-noncritical']
      };
      return sets[scenario.id].includes(option.id);
    });
    return `<section class="fault-decision glass" style="--scenario:${scenario.color}"><div><span class="eyebrow">Decisão operacional</span><h3>${scenario.title}</h3><p>${scenario.symptoms.join(' · ')}</p></div><div class="decision-options">${options.map(option => `<button class="decision-button risk-${option.risk}" data-action="resolve-scenario" data-resolution="${option.id}"><b>${option.label}</b><small>Risco ${option.risk}</small></button>`).join('')}</div></section>`;
  }

  certificationMarkup() {
    const completed = this.solvedScenarios.size;
    return `<section class="certification-strip"><div><span>PROGRESSO DA CERTIFICAÇÃO</span><strong>${completed}/${MISSION_CONTROL_SCENARIOS.length} cenários desta sessão</strong></div><div class="certification-dots">${MISSION_CONTROL_SCENARIOS.map(item => `<i class="${this.solvedScenarios.has(item.id) || this.context.profileStore.hasCompleted(`control-advanced-${item.id}`) ? 'done' : ''}" title="${item.title}"></i>`).join('')}</div><small>Os checkpoints concluídos permanecem registrados no perfil, mesmo após reiniciar a simulação.</small></section>`;
  }

  statesMarkup() {
    const snapshot = this.machine.snapshot();
    return `<div class="state-lab">
      <section class="panel glass"><span class="eyebrow">Máquina de estados configurável</span><h3>Sequência de missão</h3><p class="panel-subtitle">Tente enviar comandos fora de ordem: a regra deve bloquear a transição sem depender da interface.</p>
        <div class="state-track">${FLIGHT_STATES.map((state, index) => `<article class="state-node ${snapshot.current === state.id ? 'active' : ''} ${snapshot.states.indexOf(snapshot.current) > index ? 'passed' : ''}"><span>${state.icon}</span><b>${state.id}</b><small>${state.label}</small></article>`).join('<i class="state-connector">→</i>')}</div>
        <div class="state-command-grid">${FLIGHT_TRANSITIONS.map(item => `<button class="state-command ${snapshot.availableActions.includes(item.action) ? 'recommended' : ''}" data-action="state-command" data-command="${item.action}"><span>${item.action}</span><b>${item.label}</b><small>${item.from} → ${item.to}</small></button>`).join('')}</div>
        <div class="hero-actions"><button class="button secondary" data-action="reset-state-machine">Reiniciar sequência</button><span class="tag">Atual: ${snapshot.current}</span></div>
      </section>
      <aside class="panel glass"><h3>Histórico de decisões</h3><div class="state-history">${snapshot.history.slice().reverse().slice(0,12).map(item => `<div class="${item.accepted ? 'accepted' : 'blocked'}"><span>${item.accepted ? 'ACEITO' : 'BLOQUEADO'}</span><b>${item.action}</b><small>${item.from ?? '—'} → ${item.to}</small></div>`).join('')}</div></aside>
    </div>`;
  }

  queueMarkup() {
    const metrics = this.queue.metrics();
    const messages = this.queue.snapshot(18);
    return `<div class="queue-lab">
      <section class="panel glass queue-overview"><div class="section-head compact"><div><span class="eyebrow">Fila prioritária</span><h3>Controle de fluxo e backpressure</h3><p>Mensagens críticas devem sobreviver mesmo quando dados científicos de baixa prioridade chegam em rajadas.</p></div><span class="tag ${metrics.utilization > .8 ? 'danger-tag' : ''}">${metrics.size}/${metrics.maxSize}</span></div>
        <div class="queue-meter"><i style="width:${Math.round(metrics.utilization * 100)}%"></i><span>${Math.round(metrics.utilization * 100)}% ocupada</span></div>
        <div class="telemetry-grid"><div class="telemetry"><span>Processadas</span><strong>${metrics.processed}</strong></div><div class="telemetry"><span>Descartadas</span><strong>${metrics.dropped}</strong></div><div class="telemetry"><span>Backpressure</span><strong>${metrics.backpressure ? 'ATIVO' : 'INATIVO'}</strong></div><div class="telemetry"><span>Mensagem mais antiga</span><strong>${(metrics.oldestAgeMs/1000).toFixed(1)} s</strong></div></div>
        <div class="queue-columns">${['critical','high','normal','low'].map(priority => `<div><span>${priority}</span><strong>${metrics.byPriority[priority]}</strong></div>`).join('')}</div>
        <div class="hero-actions"><button class="button small secondary" data-action="queue-add" data-priority="critical">+ crítica</button><button class="button small secondary" data-action="queue-add" data-priority="high">+ alta</button><button class="button small secondary" data-action="queue-add" data-priority="low">+ baixa</button><button class="button small secondary" data-action="queue-process" data-count="5">Processar 5</button><button class="button small secondary" data-action="queue-burst">Injetar rajada</button><button class="button small primary" data-action="queue-backpressure">Ativar backpressure</button><button class="button small danger" data-action="queue-clear">Limpar</button></div>
      </section>
      <aside class="panel glass"><h3>Mensagens na fila</h3><div class="queue-list">${messages.length ? messages.map(item => `<div class="priority-${item.priority}"><span>${item.priority}</span><b>${escapeHtml(item.payload.channel)}</b><small>${item.id}</small></div>`).join('') : '<p class="empty-state">Fila vazia.</p>'}</div></aside>
    </div>`;
  }

  replayMarkup() {
    const samples = this.replay.list();
    const max = Math.max(0, samples.length - 1);
    const selected = samples[Math.min(this.replayIndex, max)] ?? this.emptySample();
    const analysis = this.replayAnalysis;
    return `<div class="replay-lab">
      <section class="panel glass replay-console"><div class="section-head compact"><div><span class="eyebrow">Caixa-preta local</span><h3>Replay de telemetria</h3><p>Pause, percorra as amostras e relacione picos com a causa raiz.</p></div><button class="button primary" data-action="analyze-replay">Analisar janela</button></div>
        <canvas id="telemetry-chart" class="telemetry-chart replay-chart" aria-label="Histórico de telemetria"></canvas>
        <input class="replay-slider" data-input="replay" type="range" min="0" max="${max}" value="${Math.min(this.replayIndex,max)}" ${samples.length ? '' : 'disabled'}>
        <div id="replay-frame">${this.replayFrameMarkup(selected, Math.min(this.replayIndex,max), samples.length)}</div>
      </section>
      <aside class="panel glass replay-analysis"><h3>Análise de causa raiz</h3>${analysis ? this.replayAnalysisMarkup(analysis) : '<p class="empty-state">Colete dados, injete um cenário e use “Analisar janela”.</p>'}</aside>
    </div>`;
  }

  replayFrameMarkup(sample, index, total) {
    return `<div class="replay-frame"><span>AMOSTRA ${total ? index + 1 : 0}/${total}</span><div><b>${sample.temperature.toFixed(0)} °C</b><small>temperatura</small></div><div><b>${sample.latency.toFixed(0)} ms</b><small>latência</small></div><div><b>${sample.link.toFixed(1)}%</b><small>link</small></div><div><b>${sample.queueDepth}</b><small>fila</small></div></div>`;
  }

  replayAnalysisMarkup(analysis) {
    const summary = analysis.summary;
    return `<span class="tag">${analysis.anomalies.length} eventos detectados</span>
      <div class="analysis-metrics"><div><span>Pico térmico</span><strong>${summary.temperature?.max?.toFixed(0) ?? '—'} °C</strong></div><div><span>Pico de latência</span><strong>${summary.latency?.max?.toFixed(0) ?? '—'} ms</strong></div><div><span>Menor link</span><strong>${summary.link?.min?.toFixed(1) ?? '—'}%</strong></div></div>
      <p>Qual hipótese melhor explica a janela selecionada para <b>${this.scenario(analysis.scenario)?.title}</b>?</p>
      <div class="cause-options"><button data-action="replay-cause" data-cause="sensor-drift">Deriva de sensor</button><button data-action="replay-cause" data-cause="consumer-slow">Consumidor lento</button><button data-action="replay-cause" data-cause="unstable-link">Link instável</button><button data-action="replay-cause" data-cause="excess-load">Carga elétrica excessiva</button></div>`;
  }

  logsMarkup() {
    return `<div class="logs-lab"><section class="console advanced-log"><header><span>EVENT STREAM</span><b>${this.logs.length} registros</b></header><div id="advanced-log">${this.logMarkup()}</div></section><aside class="panel glass"><h3>Camadas observadas</h3><div class="architecture-mini"><div><span>1</span><b>Worker</b><small>produz telemetria</small></div><div><span>2</span><b>Simulação</b><small>estados, fila e replay</small></div><div><span>3</span><b>Interface</b><small>comandos e visualização</small></div><div><span>4</span><b>Persistência</b><small>XP e checkpoints</small></div></div><p class="panel-subtitle">A interface pode ser redesenhada sem alterar as regras da missão.</p></aside></div>`;
  }

  telemetryMarkup(sample) {
    const queueMetrics = this.queue.metrics();
    return `<div class="telemetry"><span>Temperatura A/B</span><strong class="${Math.abs(sample.temperatureA - sample.temperatureB) > 60 ? 'metric-danger' : ''}">${sample.temperatureA.toFixed(0)} / ${sample.temperatureB.toFixed(0)} °C</strong></div>
      <div class="telemetry"><span>Latência</span><strong class="${sample.latency > 900 ? 'metric-danger' : ''}">${sample.latency.toFixed(0)} ms</strong></div>
      <div class="telemetry"><span>Link de dados</span><strong class="${sample.link < 72 ? 'metric-danger' : ''}">${sample.link.toFixed(1)}%</strong></div>
      <div class="telemetry"><span>Barramento</span><strong class="${sample.voltage < 25 ? 'metric-danger' : ''}">${sample.voltage.toFixed(1)} V</strong></div>
      <div class="telemetry"><span>Fila</span><strong class="${queueMetrics.utilization > .8 ? 'metric-danger' : ''}">${queueMetrics.size}/${queueMetrics.maxSize}</strong></div>
      <div class="telemetry"><span>Estado de voo</span><strong>${this.machine.current}</strong></div>`;
  }

  logMarkup() {
    return this.logs.map(item => `<div class="console-line type-${item.type.toLowerCase()}"><span>${item.at}</span><b>${escapeHtml(item.type)}</b><small>${escapeHtml(item.message)}</small></div>`).join('');
  }

  emptySample() {
    return { altitude: 135, velocity: 7.48, temperature: 610, temperatureA: 610, temperatureB: 612, link: 99.1, latency: 120, voltage: 28.4, powerLoad: 68, queueDepth: 0, tick: 0 };
  }

  updateLivePanels() {
    if (!this.container) return;
    const telemetry = this.container.querySelector('#advanced-telemetry');
    if (telemetry && this.telemetry) telemetry.innerHTML = this.telemetryMarkup(this.telemetry);
    const samples = this.container.querySelector('#sample-label');
    if (samples) samples.textContent = `${this.replay.size()} AMOSTRAS`;
    const log = this.container.querySelector('#advanced-log');
    if (log) log.innerHTML = this.logMarkup();
    this.drawChart();
  }

  updateRuntimeStatus() {
    const label = this.container?.querySelector('#runtime-label');
    const light = this.container?.querySelector('.runtime-light');
    if (label) label.textContent = this.running ? 'TELEMETRIA ATIVA' : 'TELEMETRIA PAUSADA';
    light?.classList.toggle('online', this.running);
  }

  updateFaultStatus() {
    if (this.activeTab === 'operations') this.render();
  }

  updateReplayFrame() {
    const host = this.container?.querySelector('#replay-frame');
    if (!host) return;
    const sample = this.replay.at(this.replayIndex) ?? this.emptySample();
    host.innerHTML = this.replayFrameMarkup(sample, this.replayIndex, this.replay.size());
  }

  drawChart() {
    const canvas = this.container?.querySelector('#telemetry-chart');
    if (!canvas) return;
    const samples = this.replay.list();
    const limit = this.qualityId() === 'experience' ? 120 : this.qualityId() === 'performance' ? 36 : 72;
    const data = samples.slice(-limit);
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(devicePixelRatio || 1, this.qualityId() === 'experience' ? 2 : 1.35);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(150,190,220,.11)';
    ctx.lineWidth = 1;
    for (let row = 1; row < 5; row++) {
      const y = (height / 5) * row;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    for (let col = 1; col < 8; col++) {
      const x = (width / 8) * col;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    if (data.length < 2) return;

    const drawLine = (selector, normalize, stroke) => {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((sample, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - Math.max(0, Math.min(1, normalize(selector(sample)))) * height;
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawLine(sample => sample.temperature, value => (value - 500) / 450, '#ff9b74');
    drawLine(sample => sample.latency, value => value / 1600, '#ffd66e');
    drawLine(sample => sample.link, value => value / 100, '#64d9ff');
  }
}

export function createModule() { return new MissionControlAdvancedModule(); }

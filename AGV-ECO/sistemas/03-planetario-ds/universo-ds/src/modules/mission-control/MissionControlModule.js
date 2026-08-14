class MissionControlModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.timer = null;
    this.tick = 0;
    this.paused = false;
    this.anomaly = false;
    this.resolved = false;
    this.logs = [];
    this.onClick = event => this.handleClick(event);
  }
  mount(container, context) {
    this.container = container;
    this.context = context;
    this.logs = ['Sistema inicializado.', 'Canal de telemetria autenticado.', 'Simulação COSMOS-01 pronta.'];
    this.render();
    container.addEventListener('click', this.onClick);
    this.timer = setInterval(() => this.updateTelemetry(), 900);
  }
  unmount() {
    clearInterval(this.timer);
    this.container?.removeEventListener('click', this.onClick);
  }
  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back') return this.context.onBack();
    if (action === 'pause') { this.paused = !this.paused; this.logs.unshift(this.paused ? 'Fluxo pausado pelo operador.' : 'Fluxo retomado.'); this.render(); }
    if (action === 'anomaly') { this.anomaly = true; this.resolved = false; this.logs.unshift('ALERTA: divergência térmica entre sensores A e B.'); this.render(); }
    if (action === 'resolve') {
      if (!this.anomaly) return this.context.toast('Nenhuma anomalia ativa.');
      this.resolved = true; this.anomaly = false;
      this.logs.unshift('Sensor B isolado. Controle transferido para sensor A + estimativa redundante.');
      const awarded = this.context.profileStore.addXp(90, 'mission-control-anomaly');
      this.context.toast(awarded ? 'Falha diagnosticada e mitigada: +90 XP.' : 'Falha revisada. O XP desta experiência já havia sido registrado.');
      this.render();
    }
  }
  updateTelemetry() {
    if (this.paused) return;
    this.tick++;
    if (this.tick % 5 === 0) this.logs.unshift(`Pacote ${String(this.tick).padStart(4,'0')} validado sem perda.`);
    if (this.logs.length > 16) this.logs.length = 16;
    this.renderTelemetryOnly();
  }
  values() {
    const wave = Math.sin(this.tick * .55);
    return {
      altitude: 118 + this.tick * 2.7,
      velocity: 7.42 + wave * .08,
      temperature: this.anomaly ? 884 : 612 + wave * 9,
      link: 99.4 - Math.abs(wave) * .4
    };
  }
  render() {
    const v = this.values();
    this.container.innerHTML = `<section class="section glass module-view">
      <div class="section-head">
        <div><span class="eyebrow">Módulo 02 · Operações</span><h2>Centro de Controle de Missão</h2><p>Observe eventos, diagnostique falhas e aplique uma resposta segura sem misturar interface, regras e renderização.</p></div>
        <button class="button secondary" data-action="back">← Voltar ao portal</button>
      </div>
      <div class="telemetry-grid" id="telemetry-grid">${this.telemetryMarkup(v)}</div>
      <div class="module-hero">
        <article class="panel glass">
          <h3>Console operacional</h3>
          <p class="panel-subtitle">A telemetria é produzida pela simulação e apresentada pela interface. Em fases futuras, Web Workers poderão processar séries maiores fora da thread principal.</p>
          <div class="hero-actions">
            <button class="button secondary" data-action="pause">${this.paused ? 'Retomar fluxo' : 'Pausar fluxo'}</button>
            <button class="button secondary" data-action="anomaly">Injetar anomalia</button>
            <button class="button primary" data-action="resolve" ${this.anomaly ? '' : 'disabled'}>Isolar sensor B</button>
          </div>
          ${this.anomaly ? '<p style="color:var(--danger)"><b>Alerta ativo:</b> sensor térmico B divergiu da redundância.</p>' : ''}
          ${this.resolved ? '<p style="color:var(--success)"><b>Falha mitigada:</b> sistema operando com redundância degradada.</p>' : ''}
        </article>
        <aside class="console"><h3>LOG DE EVENTOS</h3><div class="log" id="mission-log">${this.logMarkup()}</div></aside>
      </div>
    </section>`;
  }
  renderTelemetryOnly() {
    const grid = this.container?.querySelector('#telemetry-grid');
    const log = this.container?.querySelector('#mission-log');
    if (grid) grid.innerHTML = this.telemetryMarkup(this.values());
    if (log) log.innerHTML = this.logMarkup();
  }
  telemetryMarkup(v) {
    return `
      <div class="telemetry"><span>Altitude orbital</span><strong>${v.altitude.toFixed(0)} km</strong></div>
      <div class="telemetry"><span>Velocidade</span><strong>${v.velocity.toFixed(2)} km/s</strong></div>
      <div class="telemetry"><span>Temperatura</span><strong style="color:${this.anomaly ? 'var(--danger)' : 'inherit'}">${v.temperature.toFixed(0)} °C</strong></div>
      <div class="telemetry"><span>Link de dados</span><strong>${v.link.toFixed(1)}%</strong></div>`;
  }
  logMarkup() { return this.logs.map((log,index) => `<div class="console-line"><span>${String(this.tick-index).padStart(4,'0')}</span><b class="${log.includes('ALERTA') ? 'danger' : log.includes('isolado') ? 'ok' : ''}">${log}</b></div>`).join(''); }
}
export function createModule() { return new MissionControlModule(); }

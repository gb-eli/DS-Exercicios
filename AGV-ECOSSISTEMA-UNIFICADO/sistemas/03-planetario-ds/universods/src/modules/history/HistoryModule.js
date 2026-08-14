import { SPACE_HISTORY, EVOLUTION_ORDER, HISTORY_COMPARISON } from '../../data/spaceHistory.js';

class HistoryModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.selectedId = 'mercury';
    this.mode = 'explore';
    this.sequence = [];
    this.completed = false;
    this.onClick = event => this.handleClick(event);
  }

  mount(container, context) {
    this.container = container;
    this.context = context;
    this.completed = context.profileStore.active().completedExperiences.includes('history-evolution');
    this.render();
    container.addEventListener('click', this.onClick);
  }

  unmount() { this.container?.removeEventListener('click', this.onClick); }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back') return this.context.onBack();
    if (action === 'open-culture') return this.context.openModule('culture-discovery');
    if (action === 'select-era') { this.selectedId = target.dataset.era; this.mode = 'explore'; this.render(); }
    if (action === 'set-history-mode') { this.mode = target.dataset.mode; this.render(); }
    if (action === 'reset-sequence') { this.sequence = []; this.render(); }
    if (action === 'sequence-era') this.chooseSequence(target.dataset.era);
  }

  chooseSequence(id) {
    if (this.sequence.includes(id)) return;
    const expected = EVOLUTION_ORDER[this.sequence.length];
    if (id !== expected) {
      this.sequence = [];
      this.context.toast('Sequência reiniciada. Pense no avanço: primeiro dominar o voo, depois treinar operações e então chegar à Lua.');
      this.render();
      return;
    }
    this.sequence.push(id);
    if (this.sequence.length === EVOLUTION_ORDER.length) {
      const awarded = this.context.profileStore.addXp(180, 'history-evolution');
      this.completed = true;
      this.context.toast(awarded ? 'Linha evolutiva validada: +180 XP.' : 'Linha evolutiva revisada. XP já registrado anteriormente.');
    }
    this.render();
  }

  render() {
    const quality = this.context.settingsStore.getProfile();
    this.container.innerHTML = `<section class="section glass module-view history-module quality-${quality.id}">
      <div class="section-head">
        <div><span class="eyebrow">Fase 2 · História + Sistemas</span><h2>Museu da Computação Espacial</h2><p>Navegue pela evolução das missões e observe como cada salto espacial exigiu novos sistemas, algoritmos e formas de trabalho.</p></div>
        <div class="hero-actions"><button class="button secondary" data-action="open-culture">◈ Cultura e agências</button><button class="button secondary" data-action="back">← Voltar ao portal</button></div>
      </div>
      <nav class="module-tabs" aria-label="Modos do museu">
        ${this.tab('explore','Explorar linha do tempo')}
        ${this.tab('compare','Comparar programas')}
        ${this.tab('challenge','Desafio de evolução')}
      </nav>
      ${this.mode === 'explore' ? this.exploreMarkup() : this.mode === 'compare' ? this.compareMarkup() : this.challengeMarkup()}
    </section>`;
  }

  tab(id, label) { return `<button class="module-tab ${this.mode === id ? 'active' : ''}" data-action="set-history-mode" data-mode="${id}">${label}</button>`; }

  exploreMarkup() {
    const selected = SPACE_HISTORY.find(item => item.id === this.selectedId) ?? SPACE_HISTORY[0];
    return `<div class="museum-layout">
      <aside class="timeline-rail glass-subtle" aria-label="Linha do tempo espacial">
        ${SPACE_HISTORY.map((item,index) => `<button class="timeline-node ${item.id === selected.id ? 'active' : ''}" data-action="select-era" data-era="${item.id}" style="--era:${item.color}">
          <span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><span><b>${item.title}</b><small>${item.year}</small></span>
        </button>`).join('')}
      </aside>
      <article class="museum-stage" style="--era:${selected.color}">
        <div class="orbit-rings" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="era-visual"><span class="era-icon">${selected.icon}</span><span class="era-year">${selected.year}</span></div>
        <div class="era-copy">
          <span class="tag">${selected.badge}</span><h3>${selected.title}</h3><p class="era-objective">${selected.objective}</p>
          <div class="fact-grid">
            ${this.fact('Tripulação', selected.crew)}${this.fact('Destino', selected.destination)}${this.fact('Evolução', selected.evolution)}
          </div>
        </div>
      </article>
      <section class="museum-details">
        <article class="detail-card"><span>ARQUITETURA DS</span><h3>O problema de sistemas</h3><p>${selected.dsFocus}</p></article>
        <article class="detail-card"><span>COMPUTAÇÃO</span><h3>Como o software evolui</h3><p>${selected.computing}</p></article>
        <article class="detail-card source-card"><span>FONTE PRIMÁRIA</span><h3>Continue investigando</h3><p>Abra a referência oficial usada na curadoria deste marco.</p><a class="button small secondary" href="${selected.source}" target="_blank" rel="noreferrer">Abrir fonte oficial ↗</a></article>
      </section>
    </div>`;
  }

  fact(label, value) { return `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`; }

  compareMarkup() {
    return `<article class="panel glass comparison-panel">
      <div class="section-head compact"><div><span class="eyebrow">Mercury → Gemini → Apollo</span><h3>Complexidade acumulativa</h3><p>Nenhum programa surge isolado: cada fase transforma aprendizados anteriores em requisitos novos.</p></div></div>
      <div class="comparison-table" role="table" aria-label="Comparação dos programas Mercury Gemini e Apollo">
        <div class="comparison-row header" role="row"><b>Dimensão</b><b>Mercury</b><b>Gemini</b><b>Apollo</b></div>
        ${HISTORY_COMPARISON.map(row => `<div class="comparison-row" role="row"><strong>${row.label}</strong><span>${row.mercury}</span><span>${row.gemini}</span><span>${row.apollo}</span></div>`).join('')}
      </div>
      <div class="evolution-flow">
        <article><b>01 · FUNCIONAR</b><span>Mercury valida as capacidades mínimas.</span></article><i>→</i>
        <article><b>02 · COORDENAR</b><span>Gemini treina operações que dependem umas das outras.</span></article><i>→</i>
        <article><b>03 · INTEGRAR</b><span>Apollo reúne módulos, software, tripulação e solo.</span></article>
      </div>
    </article>`;
  }

  challengeMarkup() {
    const chosen = new Set(this.sequence);
    return `<div class="module-hero">
      <article class="panel glass">
        <span class="eyebrow">Checkpoint avaliável</span><h3>Reconstrua a evolução dos programas</h3>
        <p class="panel-subtitle">Selecione os três programas na ordem lógica de desenvolvimento: domínio inicial do voo humano, treinamento das técnicas orbitais e exploração lunar.</p>
        <div class="choice-grid">
          ${EVOLUTION_ORDER.slice().reverse().map(id => {
            const item = SPACE_HISTORY.find(entry => entry.id === id);
            return `<button class="choice sequence-choice ${chosen.has(id) ? 'correct' : ''}" data-action="sequence-era" data-era="${id}" ${chosen.has(id) ? 'disabled' : ''}><b>${item.icon} ${item.title}</b><br><small>${item.badge}</small></button>`;
          }).join('')}
        </div>
        <div class="sequence-display">${this.sequence.length ? this.sequence.map((id,index) => `<span>${index + 1}. ${SPACE_HISTORY.find(item => item.id === id).title}</span>`).join('<i>→</i>') : '<small>A sequência ainda está vazia.</small>'}</div>
        <div class="hero-actions"><button class="button secondary" data-action="reset-sequence">Reiniciar</button></div>
      </article>
      <aside class="console">
        <div class="console-line"><span>COMPETÊNCIA</span><b>Relacionar evolução e requisitos</b></div>
        <div class="console-line"><span>CONCEITO DS</span><b>Incremento de complexidade</b></div>
        <div class="console-line"><span>EVIDÊNCIA</span><b class="${this.completed ? 'ok' : 'warn'}">${this.completed ? 'Concluída' : 'Pendente'}</b></div>
        <div class="console-line"><span>RECOMPENSA</span><b>180 XP</b></div>
        <p class="panel-subtitle">O objetivo não é decorar datas, mas compreender por que novos requisitos exigem novas arquiteturas.</p>
      </aside>
    </div>`;
  }
}

export function createModule() { return new HistoryModule(); }

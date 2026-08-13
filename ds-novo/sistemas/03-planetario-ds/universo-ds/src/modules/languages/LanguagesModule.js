import { SPACE_LANGUAGES, LANGUAGE_SCENARIOS } from '../../data/spaceLanguages.js';

class LanguagesModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.selectedId = 'typescript';
    this.mode = 'catalog';
    this.questionIndex = 0;
    this.score = 0;
    this.feedback = '';
    this.completed = false;
    this.onClick = event => this.handleClick(event);
  }

  mount(container, context) {
    this.container = container;
    this.context = context;
    this.completed = context.profileStore.active().completedExperiences.includes('languages-context');
    this.render();
    container.addEventListener('click', this.onClick);
  }

  unmount() { this.container?.removeEventListener('click', this.onClick); }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back') return this.context.onBack();
    if (action === 'select-language') { this.selectedId = target.dataset.language; this.mode = 'catalog'; this.render(); }
    if (action === 'set-language-mode') { this.mode = target.dataset.mode; this.feedback = ''; this.render(); }
    if (action === 'answer-language') this.answerLanguage(target.dataset.language);
    if (action === 'restart-language') { this.questionIndex = 0; this.score = 0; this.feedback = ''; this.render(); }
  }

  answerLanguage(id) {
    if (this.questionIndex >= LANGUAGE_SCENARIOS.length) return;
    const scenario = LANGUAGE_SCENARIOS[this.questionIndex];
    if (id !== scenario.answer) {
      this.feedback = 'Essa linguagem pode participar de partes do projeto, mas não é a melhor correspondência para o objetivo principal descrito.';
      this.context.toast('Analise ambiente de execução, desempenho, hardware e tipo de dado.');
      this.render();
      return;
    }
    this.score++;
    this.questionIndex++;
    this.feedback = scenario.explanation;
    if (this.questionIndex === LANGUAGE_SCENARIOS.length) {
      const awarded = this.context.profileStore.addXp(200, 'languages-context');
      this.completed = true;
      this.context.toast(awarded ? 'Decisões de tecnologia validadas: +200 XP.' : 'Laboratório revisado. XP já registrado anteriormente.');
    }
    this.render();
  }

  render() {
    const quality = this.context.settingsStore.getProfile();
    this.container.innerHTML = `<section class="section glass module-view languages-module quality-${quality.id}">
      <div class="section-head"><div><span class="eyebrow">Fase 2 · Linguagens + Arquitetura</span><h2>Laboratório de Linguagens Espaciais</h2><p>Não existe uma única “linguagem da NASA”. A tecnologia correta depende da camada, do risco, do hardware, do desempenho e da missão.</p></div><button class="button secondary" data-action="back">← Voltar ao portal</button></div>
      <nav class="module-tabs" aria-label="Modos do laboratório de linguagens">${this.tab('catalog','Mapa de tecnologias')}${this.tab('architecture','Arquitetura em camadas')}${this.tab('challenge','Escolha técnica')}</nav>
      ${this.mode === 'catalog' ? this.catalogMarkup() : this.mode === 'architecture' ? this.architectureMarkup() : this.challengeMarkup()}
    </section>`;
  }

  tab(id,label) { return `<button class="module-tab ${this.mode === id ? 'active' : ''}" data-action="set-language-mode" data-mode="${id}">${label}</button>`; }

  catalogMarkup() {
    const language = SPACE_LANGUAGES.find(item => item.id === this.selectedId) ?? SPACE_LANGUAGES[0];
    return `<div class="language-layout">
      <aside class="language-list">${SPACE_LANGUAGES.map(item => `<button class="language-card ${item.id === language.id ? 'active' : ''}" data-action="select-language" data-language="${item.id}" style="--language:${item.accent}"><span>${item.icon}</span><div><b>${item.name}</b><small>${item.layer}</small></div></button>`).join('')}</aside>
      <article class="code-terminal" style="--language:${language.accent}">
        <header><div><span class="terminal-dots">● ● ●</span><b>${language.name}</b></div><span>${language.layer}</span></header>
        <pre><code>${language.snippet}</code></pre>
        <div class="terminal-scan" aria-hidden="true"></div>
      </article>
      <section class="language-detail">
        <span class="tag">${language.layer}</span><h3>${language.name}</h3>
        <div class="detail-card"><span>USO EDUCACIONAL</span><p>${language.use}</p></div>
        <div class="detail-card"><span>ONDE FAZ SENTIDO</span><p>${language.fit}</p></div>
        <div class="detail-card warning"><span>CUIDADO COM GENERALIZAÇÕES</span><p>${language.caution}</p></div>
      </section>
    </div>`;
  }

  architectureMarkup() {
    const layers = [
      { title:'Experiência web', tech:'TypeScript · WebGL · CSS', text:'Interface, simulação visual, dashboards e acessibilidade.', color:'#7ee7ff' },
      { title:'Ciência e automação', tech:'Python · ferramentas de dados', text:'Análise, protótipos, testes e processamento científico.', color:'#63e6a8' },
      { title:'Serviços e dados', tech:'APIs · SQL · mensageria', text:'Persistência, integração, histórico, filas e telemetria.', color:'#ff7eaa' },
      { title:'Software embarcado', tech:'C · C++ · RTOS', text:'Comandos, sensores, controle de recursos e tempo de execução.', color:'#55dcff' },
      { title:'Hardware', tech:'Processador · barramentos · atuadores', text:'A camada física que mede e modifica o ambiente.', color:'#ffcf5a' }
    ];
    return `<article class="panel glass architecture-map">
      <div class="architecture-stack">${layers.map((layer,index) => `<article class="architecture-layer" style="--layer:${layer.color};--depth:${index}"><span>${String(index + 1).padStart(2,'0')}</span><div><b>${layer.title}</b><strong>${layer.tech}</strong><small>${layer.text}</small></div></article>`).join('')}</div>
      <aside class="console"><div class="console-line"><span>REGRA 01</span><b class="ok">Escolha pelo contexto</b></div><div class="console-line"><span>REGRA 02</span><b>Separe responsabilidades</b></div><div class="console-line"><span>REGRA 03</span><b>Teste as interfaces</b></div><div class="console-line"><span>REGRA 04</span><b>Documente limites</b></div><p class="panel-subtitle">Uma missão real pode combinar várias linguagens, ferramentas e sistemas operacionais. A arquitetura integra essas partes.</p></aside>
    </article>`;
  }

  challengeMarkup() {
    if (this.questionIndex >= LANGUAGE_SCENARIOS.length) return `<article class="panel glass completion-panel"><span class="eyebrow">Checkpoint concluído</span><h3>Arquitetura escolhida pelo problema</h3><p>Você evitou a pergunta simplista “qual é a melhor linguagem?” e analisou ambiente, dados, desempenho e criticidade.</p><div class="metrics"><div class="metric"><strong>${this.score}/5</strong><span>Cenários</span></div><div class="metric"><strong>+200</strong><span>XP</span></div><div class="metric"><strong>6</strong><span>Tecnologias</span></div></div><p><button class="button secondary" data-action="restart-language">Revisar cenários</button></p></article>`;
    const scenario = LANGUAGE_SCENARIOS[this.questionIndex];
    return `<div class="module-hero">
      <article class="panel glass"><span class="eyebrow">Cenário ${this.questionIndex + 1}/${LANGUAGE_SCENARIOS.length}</span><h3>${scenario.prompt}</h3><p class="panel-subtitle">Selecione a tecnologia que melhor atende ao objetivo principal. Em um projeto real, outras linguagens ainda podem colaborar.</p>
        <div class="language-answer-grid">${SPACE_LANGUAGES.map(language => `<button class="choice language-answer" data-action="answer-language" data-language="${language.id}" style="--language:${language.accent}"><span>${language.icon}</span><b>${language.name}</b><small>${language.layer}</small></button>`).join('')}</div>
        ${this.feedback ? `<p class="feedback-line">${this.feedback}</p>` : ''}
      </article>
      <aside class="console"><div class="console-line"><span>ACERTOS</span><b>${this.score}/${LANGUAGE_SCENARIOS.length}</b></div><div class="console-line"><span>CRITÉRIOS</span><b>Camada · risco · desempenho</b></div><div class="console-line"><span>EVIDÊNCIA</span><b class="${this.completed ? 'ok' : 'warn'}">${this.completed ? 'Concluída' : 'Em andamento'}</b></div><div class="console-line"><span>RECOMPENSA</span><b>200 XP</b></div></aside>
    </div>`;
  }
}

export function createModule() { return new LanguagesModule(); }

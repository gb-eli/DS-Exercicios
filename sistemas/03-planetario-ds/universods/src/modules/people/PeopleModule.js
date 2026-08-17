import { SPACE_PEOPLE, ROLE_CHALLENGE } from '../../data/spacePeople.js';

class PeopleModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.selectedId = 'margaret-hamilton';
    this.mode = 'gallery';
    this.questionIndex = 0;
    this.score = 0;
    this.feedback = '';
    this.completed = false;
    this.onClick = event => this.handleClick(event);
  }

  mount(container, context) {
    this.container = container;
    this.context = context;
    this.completed = context.profileStore.active().completedExperiences.includes('people-mission-team');
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
    if (action === 'select-person') { this.selectedId = target.dataset.person; this.mode = 'gallery'; this.render(); }
    if (action === 'set-people-mode') { this.mode = target.dataset.mode; this.feedback = ''; this.render(); }
    if (action === 'answer-role') this.answerRole(target.dataset.person);
    if (action === 'restart-role') { this.questionIndex = 0; this.score = 0; this.feedback = ''; this.render(); }
  }

  answerRole(personId) {
    if (this.questionIndex >= ROLE_CHALLENGE.length) return;
    const question = ROLE_CHALLENGE[this.questionIndex];
    if (personId !== question.answer) {
      const chosen = SPACE_PEOPLE.find(person => person.id === personId);
      this.feedback = `${chosen.name} teve outra contribuição. Observe o conceito DS pedido na missão.`;
      this.context.toast('Resposta ainda não validada. Use a contribuição técnica como pista.');
      this.render();
      return;
    }
    this.score++;
    this.questionIndex++;
    this.feedback = 'Correspondência validada.';
    if (this.questionIndex === ROLE_CHALLENGE.length) {
      const awarded = this.context.profileStore.addXp(160, 'people-mission-team');
      this.completed = true;
      this.context.toast(awarded ? 'Equipe de missão compreendida: +160 XP.' : 'Desafio revisado. XP já registrado anteriormente.');
    }
    this.render();
  }

  render() {
    const quality = this.context.settingsStore.getProfile();
    this.container.innerHTML = `<section class="section glass module-view people-module quality-${quality.id}">
      <div class="section-head"><div><span class="eyebrow">Fase 2 · Pessoas + Equipes</span><h2>Quem constrói uma missão espacial?</h2><p>A exploração espacial depende de matemática, software, pilotagem, ciência, manutenção, comunicação e decisões coletivas.</p></div><div class="hero-actions"><button class="button secondary" data-action="open-culture">◈ Cultura e carreiras</button><button class="button secondary" data-action="back">← Voltar ao portal</button></div></div>
      <nav class="module-tabs" aria-label="Modos do módulo de pessoas">
        ${this.tab('gallery','Galeria holográfica')}${this.tab('team','Mapa da equipe')}${this.tab('challenge','Desafio de funções')}
      </nav>
      ${this.mode === 'gallery' ? this.galleryMarkup() : this.mode === 'team' ? this.teamMarkup() : this.challengeMarkup()}
    </section>`;
  }

  tab(id,label) { return `<button class="module-tab ${this.mode === id ? 'active' : ''}" data-action="set-people-mode" data-mode="${id}">${label}</button>`; }

  galleryMarkup() {
    const person = SPACE_PEOPLE.find(item => item.id === this.selectedId) ?? SPACE_PEOPLE[0];
    return `<div class="people-layout">
      <div class="people-strip" role="list">${SPACE_PEOPLE.map(item => `<button role="listitem" class="person-chip ${item.id === person.id ? 'active' : ''}" data-action="select-person" data-person="${item.id}" style="--person:${item.accent}"><span>${item.icon}</span><b>${item.name}</b><small>${item.group}</small></button>`).join('')}</div>
      <article class="person-dossier" style="--person:${person.accent}">
        <div class="hologram-chamber" aria-hidden="true"><div class="hologram-grid"></div><div class="hologram-person"><span>${person.icon}</span></div><div class="scan-line"></div></div>
        <div class="dossier-copy">
          <span class="tag">${person.group}</span><h3>${person.name}</h3><p class="dossier-role">${person.role} · ${person.years}</p>
          <p>${person.contribution}</p>
          <div class="detail-card inline"><span>CONEXÃO COM DS</span><p>${person.dsLink}</p></div>
          <div class="fact-grid">${this.fact('Missão / programa',person.mission)}${this.fact('Papel central',person.role)}</div>
          <a class="button small secondary" href="${person.source}" target="_blank" rel="noreferrer">Abrir fonte oficial ↗</a>
        </div>
      </article>
    </div>`;
  }

  fact(label,value) { return `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`; }

  teamMarkup() {
    const groups = [
      ['Trajetória e navegação','Matemática, modelos, orientação e verificação.','∿'],
      ['Software de voo','Requisitos, estados, comandos, prioridades e recuperação.','</>'],
      ['Tripulação','Operação, decisão, experimentos e contingências.','★'],
      ['Controle de missão','Telemetria, comunicação, análise e coordenação.','⌁'],
      ['Hardware e integração','Sensores, computadores, energia, estruturas e testes.','⚙'],
      ['Ciência','Hipóteses, instrumentos, amostras e interpretação de dados.','⌬']
    ];
    return `<article class="panel glass team-map">
      <div class="mission-core"><span>MISSÃO</span><b>COSMOS-02</b><small>Uma missão é um sistema sociotécnico</small></div>
      <div class="team-orbit">${groups.map((group,index) => `<article class="team-node" style="--i:${index}"><span>${group[2]}</span><b>${group[0]}</b><small>${group[1]}</small></article>`).join('')}</div>
      <div class="team-principle"><b>Princípio para DS:</b> um sistema crítico não depende apenas de uma linguagem ou de uma pessoa. Ele depende de interfaces claras, responsabilidade, validação e comunicação entre equipes.</div>
    </article>`;
  }

  challengeMarkup() {
    if (this.questionIndex >= ROLE_CHALLENGE.length) return `<article class="panel glass completion-panel"><span class="eyebrow">Checkpoint concluído</span><h3>Equipe multidisciplinar reconhecida</h3><p>Você relacionou pessoas a contribuições técnicas sem reduzir a história apenas aos astronautas.</p><div class="metrics"><div class="metric"><strong>${this.score}/3</strong><span>Relações</span></div><div class="metric"><strong>+160</strong><span>XP</span></div><div class="metric"><strong>DS</strong><span>Visão sistêmica</span></div></div><p><button class="button secondary" data-action="restart-role">Revisar desafio</button></p></article>`;
    const question = ROLE_CHALLENGE[this.questionIndex];
    return `<div class="module-hero">
      <article class="panel glass">
        <span class="eyebrow">Questão ${this.questionIndex + 1}/${ROLE_CHALLENGE.length}</span><h3>${question.prompt}</h3>
        <p class="panel-subtitle">Escolha pela contribuição profissional, não apenas pela popularidade da pessoa.</p>
        <div class="people-answer-grid">${SPACE_PEOPLE.map(person => `<button class="choice person-answer" data-action="answer-role" data-person="${person.id}" style="--person:${person.accent}"><span>${person.icon}</span><b>${person.name}</b><small>${person.role}</small></button>`).join('')}</div>
        ${this.feedback ? `<p class="feedback-line">${this.feedback}</p>` : ''}
      </article>
      <aside class="console"><div class="console-line"><span>PROGRESSO</span><b>${this.score}/${ROLE_CHALLENGE.length}</b></div><div class="console-line"><span>FOCO</span><b>Funções e responsabilidades</b></div><div class="console-line"><span>EVIDÊNCIA</span><b class="${this.completed ? 'ok' : 'warn'}">${this.completed ? 'Concluída' : 'Em andamento'}</b></div><p class="panel-subtitle">Projetos de DS também exigem análise, desenvolvimento, teste, UX, infraestrutura, dados e gestão.</p></aside>
    </div>`;
  }
}

export function createModule() { return new PeopleModule(); }

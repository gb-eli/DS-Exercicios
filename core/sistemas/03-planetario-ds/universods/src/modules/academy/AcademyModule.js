class AcademyModule {
  constructor() {
    this.container = null;
    this.context = null;
    this.step = 0;
    this.sequence = [];
    this.completed = false;
    this.onClick = event => this.handleClick(event);
  }
  mount(container, context) {
    this.container = container;
    this.context = context;
    this.render();
    container.addEventListener('click', this.onClick);
  }
  unmount() {
    this.container?.removeEventListener('click', this.onClick);
  }
  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back') return this.context.onBack();
    if (action === 'begin') { this.step = 1; this.render(); }
    if (action === 'component') {
      const value = target.dataset.value;
      if (this.sequence.includes(value)) return;
      this.sequence.push(value);
      const correct = ['sensor','processamento','atuador'];
      const valid = this.sequence.every((item,index) => item === correct[index]);
      if (!valid) {
        this.context.toast('A sequência foi reiniciada: primeiro coletamos dados, depois processamos e então atuamos.');
        this.sequence = [];
      } else if (this.sequence.length === 3) {
        this.context.toast('Pipeline correto: entrada → processamento → saída.');
        this.step = 2;
      }
      this.render();
    }
    if (action === 'anomaly') {
      const correct = target.dataset.value === 'temperature';
      target.classList.add(correct ? 'correct' : 'wrong');
      if (correct) {
        this.context.toast('Anomalia detectada. Temperatura fora da faixa segura.');
        setTimeout(() => { this.step = 3; this.render(); }, 650);
      } else this.context.toast('Esse dado está dentro da faixa esperada. Compare novamente.');
    }
    if (action === 'decision') {
      const correct = target.dataset.value === 'block';
      target.classList.add(correct ? 'correct' : 'wrong');
      if (correct) {
        this.completed = true;
        const awarded = this.context.profileStore.addXp(120, 'academy-foundation');
        this.context.toast(awarded ? 'Treinamento concluído: +120 XP e evidência registrada localmente.' : 'Treinamento revisado. O XP desta experiência já havia sido registrado.');
        setTimeout(() => { this.step = 4; this.render(); }, 550);
      } else this.context.toast('Sistemas críticos devem bloquear transições inseguras.');
    }
  }
  render() {
    const progress = Math.min(100, (this.step / 4) * 100);
    this.container.innerHTML = `
      <section class="section glass module-view">
        <div class="section-head">
          <div><span class="eyebrow">Módulo 01 · Fundação</span><h2>Academia Espacial DS</h2><p>Compreenda o ciclo básico de qualquer sistema espacial antes de operar veículos críticos.</p></div>
          <button class="button secondary" data-action="back">← Voltar ao portal</button>
        </div>
        <div class="progress-bar" aria-label="Progresso do módulo"><i style="width:${progress}%"></i></div>
        ${this.renderStep()}
      </section>`;
  }
  renderStep() {
    if (this.step === 0) return `
      <div class="module-hero">
        <article class="panel glass">
          <h3>Missão de treinamento</h3>
          <p class="panel-subtitle">Um sistema espacial combina sensores, software, computadores, comunicação e atuadores. Sua tarefa é validar o fluxo antes de liberar uma operação.</p>
          <div class="lesson-steps">
            <div class="lesson-step current"><strong>01. Arquitetura funcional</strong><span>Organize entrada, processamento e saída.</span></div>
            <div class="lesson-step"><strong>02. Telemetria</strong><span>Identifique uma leitura fora da faixa.</span></div>
            <div class="lesson-step"><strong>03. Segurança</strong><span>Decida se uma mudança de estado pode ocorrer.</span></div>
          </div>
          <p><button class="button primary" data-action="begin">Iniciar treinamento</button></p>
        </article>
        <aside class="console">
          <div class="console-line"><span>LINGUAGEM DA PLATAFORMA</span><b class="ok">JavaScript ES Modules</b></div>
          <div class="console-line"><span>RENDERIZAÇÃO</span><b>WebGL2 + GLSL</b></div>
          <div class="console-line"><span>PERSISTÊNCIA</span><b>LocalStorage / IndexedDB futuro</b></div>
          <div class="console-line"><span>ARQUITETURA</span><b class="ok">Modular + lazy loading</b></div>
          <div class="console-line"><span>OBJETIVO DS</span><b>Estado, validação e eventos</b></div>
        </aside>
      </div>`;
    if (this.step === 1) {
      const selected = new Set(this.sequence);
      return `<article class="panel glass">
        <h3>1. Monte o fluxo operacional</h3>
        <p class="panel-subtitle">Selecione os componentes na ordem em que a informação percorre o sistema.</p>
        <div class="choice-grid">
          ${this.component('sensor','◉ Sensor','Coleta temperatura, pressão, posição e velocidade.',selected)}
          ${this.component('atuador','⚙ Atuador','Executa movimento, correção, abertura ou desligamento.',selected)}
          ${this.component('processamento','⌘ Processamento','Valida dados, executa regras e decide respostas.',selected)}
        </div>
        <p class="panel-subtitle">Sequência atual: ${this.sequence.length ? this.sequence.join(' → ') : 'nenhum componente selecionado'}</p>
      </article>`;
    }
    if (this.step === 2) return `<article class="panel glass">
      <h3>2. Detecte a anomalia de telemetria</h3>
      <p class="panel-subtitle">O veículo está em teste de solo. Selecione o dado que exige bloqueio imediato.</p>
      <div class="choice-grid">
        <button class="choice" data-action="anomaly" data-value="energy"><b>Energia</b><br><strong>96%</strong><br><small>Faixa esperada: 80–100%</small></button>
        <button class="choice" data-action="anomaly" data-value="temperature"><b>Temperatura do motor</b><br><strong>890 °C</strong><br><small>Limite de teste: 760 °C</small></button>
        <button class="choice" data-action="anomaly" data-value="link"><b>Link de dados</b><br><strong>99,2%</strong><br><small>Mínimo operacional: 97%</small></button>
      </div>
    </article>`;
    if (this.step === 3) return `<article class="panel glass">
      <h3>3. Proteja a máquina de estados</h3>
      <p class="panel-subtitle">Estado atual: <b>ABASTECENDO</b>. Um comando solicita transição direta para <b>IGNIÇÃO</b>, mas o checklist térmico ainda não foi aprovado.</p>
      <div class="choice-grid">
        <button class="choice" data-action="decision" data-value="allow"><b>Permitir</b><br><small>Executar a ignição para não atrasar a missão.</small></button>
        <button class="choice" data-action="decision" data-value="block"><b>Bloquear</b><br><small>Registrar o comando e aguardar todas as pré-condições.</small></button>
        <button class="choice" data-action="decision" data-value="ignore"><b>Ignorar log</b><br><small>Cancelar silenciosamente sem produzir evidência.</small></button>
      </div>
    </article>`;
    return `<article class="panel glass">
      <span class="eyebrow">Checkpoint concluído</span>
      <h3>Fundação operacional validada</h3>
      <p class="panel-subtitle">Você organizou o pipeline, detectou uma leitura insegura e protegeu a máquina de estados. Esses três princípios serão reutilizados nos módulos de foguetes, rovers, satélites e estação espacial.</p>
      <div class="metrics">
        <div class="metric"><strong>+120</strong><span>XP</span></div>
        <div class="metric"><strong>3/3</strong><span>Competências</span></div>
        <div class="metric"><strong>Local</strong><span>Evidência salva</span></div>
      </div>
      <p><button class="button primary" data-action="back">Concluir e voltar</button></p>
    </article>`;
  }
  component(value, title, description, selected) {
    return `<button class="choice ${selected.has(value) ? 'correct' : ''}" data-action="component" data-value="${value}"><b>${title}</b><br><small>${description}</small></button>`;
  }
}
export function createModule() { return new AcademyModule(); }

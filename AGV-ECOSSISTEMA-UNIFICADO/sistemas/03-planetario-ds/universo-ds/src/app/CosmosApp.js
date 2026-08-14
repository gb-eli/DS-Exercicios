import { PremiumIntegrationOrchestrator } from '../core/assets/PremiumIntegrationOrchestrator.js';
const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));

export class CosmosApp {
  constructor({ root, bus, settingsStore, profileStore, benchmarkService, moduleRegistry }) {
    this.root = root;
    this.bus = bus;
    this.settingsStore = settingsStore;
    this.profileStore = profileStore;
    this.benchmarkService = benchmarkService;
    this.moduleRegistry = moduleRegistry;
    this.activeModule = null;
    this.activeModuleId = null;
    this.premiumIntegration = null;
    this.currentView = 'dashboard';
    this.modal = null;
    this.tutorialStep = 0;
    this.benchmarkResult = null;
    this.fps = 0;
    this.onClick = event => this.handleClick(event);
    this.onSubmit = event => this.handleSubmit(event);
    this.onChange = event => this.handleChange(event);
  }

  async init() {
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('submit', this.onSubmit);
    this.root.addEventListener('change', this.onChange);
    this.bus.on('settings:changed', () => { if (this.currentView === 'dashboard') this.render(); });
    this.bus.on('profile:changed', () => { if (this.currentView === 'dashboard') this.render(); });
    this.bus.on('performance:fps', fps => { this.fps = fps; this.updateFps(); });
    this.bus.on('renderer:fallback', payload => this.toast(`Modo visual simplificado: ${payload.reason}.`));
    this.bus.on('quality:auto-adjusted', payload => {
      const label = this.settingsStore.getProfiles()[payload.mode]?.label ?? payload.mode;
      this.toast(`Qualidade automática ajustada para ${label}.`);
    });
    await this.runAutomaticBenchmark(false);
    this.render();
    const requestedModule = typeof location !== 'undefined' ? new URL(location.href).searchParams.get('module') : null;
    if (requestedModule && this.moduleRegistry.list().some(item => item.id === requestedModule && item.status === 'available')) {
      await this.openModule(requestedModule);
      return;
    }
    if (!this.settingsStore.get().tutorialSeen) {
      this.modal = 'tutorial';
      this.render();
    }
  }

  destroy() {
    this.premiumIntegration?.destroy?.();
    this.premiumIntegration = null;
    this.activeModule?.unmount?.();
    this.root.removeEventListener('click', this.onClick);
    this.root.removeEventListener('submit', this.onSubmit);
    this.root.removeEventListener('change', this.onChange);
  }

  async runAutomaticBenchmark(showFeedback = true) {
    if (showFeedback) this.toast('Executando diagnóstico rápido do dispositivo…');
    this.benchmarkResult = await this.benchmarkService.run();
    this.settingsStore.resolveAutomatic(this.benchmarkResult.recommendation);
    if (showFeedback) this.toast(`Perfil recomendado: ${this.settingsStore.getProfiles()[this.benchmarkResult.recommendation].label}.`);
  }

  async openModule(id) {
    try {
      this.premiumIntegration?.destroy?.();
      this.premiumIntegration = null;
      this.activeModule?.unmount?.();
      this.activeModule = await this.moduleRegistry.load(id);
      this.activeModuleId = id;
      this.currentView = 'module';
      this.modal = null;
      this.render();
      this.activeModule.mount(this.root.querySelector('#module-host'), {
        profileStore: this.profileStore,
        settingsStore: this.settingsStore,
        toast: message => this.toast(message),
        onBack: () => this.backToDashboard(),
        openModule: moduleId => this.openModule(moduleId),
        bus: this.bus
      });
      if (PremiumIntegrationOrchestrator.supports(id)) {
        this.premiumIntegration = new PremiumIntegrationOrchestrator({
          moduleId: id,
          host: this.root.querySelector('#module-host'),
          settingsStore: this.settingsStore,
          profileStore: this.profileStore,
          bus: this.bus,
          toast: message => this.toast(message)
        });
        await this.premiumIntegration.start();
      }
      scrollTo({ top: 0, behavior: this.settingsStore.get().reducedMotion ? 'auto' : 'smooth' });
    } catch (error) {
      this.toast(error.message || 'Não foi possível abrir o módulo.');
    }
  }

  backToDashboard() {
    this.premiumIntegration?.destroy?.();
    this.premiumIntegration = null;
    this.activeModule?.unmount?.();
    this.activeModule = null;
    this.activeModuleId = null;
    this.premiumIntegration = null;
    this.currentView = 'dashboard';
    this.render();
  }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'open-settings') { this.modal = 'settings'; this.render(); }
    if (action === 'open-profiles') { this.modal = 'profiles'; this.render(); }
    if (action === 'open-tutorial') { this.tutorialStep = 0; this.modal = 'tutorial'; this.render(); }
    if (action === 'close-modal') { this.modal = null; this.render(); }
    if (action === 'set-quality') { this.settingsStore.setQualityMode(target.dataset.value); }
    if (action === 'toggle-setting') {
      const key = target.dataset.key;
      const state = this.settingsStore.get();
      this.settingsStore.update({ [key]: !state[key] });
    }
    if (action === 'run-benchmark') this.runAutomaticBenchmark(true).then(() => this.render());
    if (action === 'open-module') this.openModule(target.dataset.module);
    if (action === 'export-backup') this.exportBackup();
    if (action === 'storage-diagnose-global') this.runStorageDiagnostic();
    if (action === 'back-dashboard') this.backToDashboard();
    if (action === 'select-profile') { this.modal = null; this.profileStore.select(target.dataset.profile); this.render(); }
    if (action === 'delete-profile') {
      try { this.profileStore.remove(target.dataset.profile); this.toast('Perfil local removido.'); }
      catch (error) { this.toast(error.message); }
    }
    if (action === 'tutorial-next') {
      if (this.tutorialStep < 3) this.tutorialStep++;
      else { this.settingsStore.update({ tutorialSeen: true }); this.modal = null; }
      this.render();
    }
    if (action === 'tutorial-prev') { this.tutorialStep = Math.max(0, this.tutorialStep - 1); this.render(); }
    if (action === 'clear-data') {
      if (confirm('Apagar todos os perfis, progresso e configurações locais do COSMOS DS?')) {
        this.settingsStore.storage.clearProject();
        location.reload();
      }
    }
  }

  handleSubmit(event) {
    const form = event.target.closest('[data-form="create-profile"]');
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    try {
      this.profileStore.create({ name: data.get('name'), className: data.get('className'), callsign: data.get('callsign') });
      this.modal = null;
      this.toast('Perfil criado e selecionado.');
      this.render();
    } catch (error) { this.toast(error.message); }
  }

  async handleChange(event) {
    const input = event.target.closest('[data-action="import-backup-global"]');
    if (!input?.files?.[0]) return;
    try {
      const data = JSON.parse(await input.files[0].text());
      if (data?.schema !== 'cosmos-ds-backup-v1' || !Array.isArray(data.profiles?.profiles)) throw new Error('Backup incompatível.');
      this.profileStore.importSnapshot(data.profiles);
      this.settingsStore.importState(data.settings || {});
      this.toast('Backup restaurado com sucesso.');
      this.render();
    } catch (error) { this.toast(`Falha ao importar backup: ${error.message}`); }
  }

  exportBackup() {
    const data = { schema:'cosmos-ds-backup-v1', createdAt:new Date().toISOString(), profiles:this.profileStore.exportSnapshot(), settings:this.settingsStore.get() };
    const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'cosmos-ds-backup.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async runStorageDiagnostic() {
    let estimate = { usage:0, quota:0 }, persisted = null;
    try { estimate = await navigator.storage?.estimate?.() ?? estimate; } catch {}
    try { persisted = await navigator.storage?.persisted?.() ?? null; } catch {}
    const format = value => value ? `${(value / 1024 / 1024).toFixed(1)} MB` : '0 MB';
    this.toast(`Armazenamento: ${format(estimate.usage)} usados de ${format(estimate.quota)} · persistência ${persisted === null ? 'indisponível' : persisted ? 'ativa' : 'não garantida'}.`);
  }

  render() {
    if (this.currentView === 'module') {
      if (['curiosity-center','solar-remaster','launch-remaster','station-remaster','planetary-remaster','deep-space-remaster','visual-museum','cinematic-studio','physics-controls','integrated-campaigns'].includes(this.activeModuleId)) {
        this.root.innerHTML = `<main id="module-host" class="immersive-module-host"></main><div class="toast-stack" id="toast-stack"></div>`;
      } else {
        this.root.innerHTML = `<div class="shell"><header class="topbar glass">${this.brandMarkup()}<div class="top-actions"><span class="status-pill">● <strong id="fps-text">${this.fps || '--'} FPS</strong></span><button class="button secondary" data-action="back-dashboard">← Portal</button></div></header><main id="module-host"></main></div><div class="toast-stack" id="toast-stack"></div>`;
      }
      return;
    }
    const profile = this.profileStore.active();
    const modules = this.moduleRegistry.list();
    const settings = this.settingsStore.get();
    const quality = this.settingsStore.getProfile();
    this.root.innerHTML = `
      <div class="shell">
        <header class="topbar glass">${this.brandMarkup()}${this.topActionsMarkup()}</header>
        <main>
          <div class="main-grid">
            <section class="hero glass">
              <span class="eyebrow">Novo ciclo C1.1 · Universo, Tecnologia e Programação</span>
              <h2>Explore em 3D e descubra <span>curiosidades, ciência, tecnologia e programação espacial.</span></h2>
              <p>A Enciclopédia Imersiva conecta planetas, missões, objetos e sistemas digitais aos laboratórios 3D/360°, com fontes, comparações e desafios para estudantes de DS.</p>
              <div class="hero-actions">
                <button class="button primary" data-action="open-module" data-module="curiosity-center">Abrir COSMOS Curioso</button>
                <button class="button secondary" data-action="open-module" data-module="solar-remaster">Explorar Sistema Solar</button>
                <button class="button secondary" data-action="open-module" data-module="integrated-campaigns">Campanhas Integradas</button>
                <button class="button secondary" data-action="open-settings">Acessibilidade e desempenho</button>
              </div>
            </section>
            <aside class="side-stack">
              <section class="panel glass profile-card">
                <div class="profile-main"><div class="avatar">${escapeHtml(profile.callsign.slice(0,2))}</div><div><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.className)} · ${escapeHtml(profile.callsign)}</span></div></div>
                <div><div style="display:flex;justify-content:space-between;font-size:.76rem;margin-bottom:7px"><span>Nível ${profile.level}</span><span>${profile.xp} XP</span></div><div class="progress-bar"><i style="width:${(profile.xp % 250) / 2.5}%"></i></div></div>
                <div class="metrics"><div class="metric"><strong>${profile.level}</strong><span>Nível</span></div><div class="metric"><strong>${profile.completedExperiences.length}</strong><span>Experiências</span></div><div class="metric"><strong>${quality.label}</strong><span>Gráfico</span></div></div>
                <button class="button secondary" data-action="open-profiles">Trocar ou criar perfil</button>
              </section>
              <section class="panel glass">
                <h3>Experiência × desempenho</h3><p class="panel-subtitle">A alteração é aplicada imediatamente ao shader e às animações.</p>
                <div class="mode-selector">${Object.values(this.settingsStore.getProfiles()).map(item => this.qualityOptionMarkup(item, settings.qualityMode)).join('')}</div>
              </section>
            </aside>
          </div>
          <section class="section glass">
            <div class="section-head"><div><h2>Laboratórios modulares</h2><p>Somente os módulos abertos são carregados. Os demais permanecem fora da memória.</p></div><span class="tag">${modules.filter(module => module.status === 'available').length} disponíveis · ${modules.length} mapeados</span></div>
            <div class="module-grid">${modules.map(module => this.moduleCardMarkup(module)).join('')}</div>
          </section>
          <section class="section glass">
            <div class="section-head"><div><h2>Mapa de evolução</h2><p>Vinte e três fases técnicas concluídas e um novo ciclo de conhecimento que conecta exploração, curiosidades, tecnologia e programação.</p></div></div>
            <div class="timeline">
              ${this.phaseMarkup(1,'Fundação','Núcleo, perfis, benchmark, shader e missões iniciais.','done')}
              ${this.phaseMarkup(2,'História + Pessoas','Museu, equipes, linguagens e três checkpoints avaliáveis.','done')}
              ${this.phaseMarkup(3,'Controle','Web Worker, estados, filas, replay e tolerância a falhas.','done')}
              ${this.phaseMarkup(4,'Terra + Órbitas','Globo 3D, satélites, geodados, energia e comunicação.','done')}
              ${this.phaseMarkup(5,'Foguetes','Hangar, lançamento, estágios, física e sistemas críticos.','done')}
              ${this.phaseMarkup(6,'Lua + Apollo','Assembly didático, prioridades, alarmes e pouso.','done')}
              ${this.phaseMarkup(7,'Marte + Robótica','Rovers, visão, autonomia, rotas e amostras.','done')}
              ${this.phaseMarkup(8,'Estação Espacial','360°, acoplamento, energia, suporte à vida, robótica e logística.','done')}
              ${this.phaseMarkup(9,'Universo Profundo','Telescópios, filtros, dados, espectros e galáxias.','done')}
              ${this.phaseMarkup(10,'VR + Professor','WebXR, criação de missões, evidências e consolidação.','done')}
              ${this.phaseMarkup(11,'Remaster Sistema Solar','Voo livre, 3D/360°, shaders planetários, satélites e controles de jogo.','done')}
              ${this.phaseMarkup(12,'Remaster de Lançamentos','Hangar 360°, ônibus espacial, partículas, câmeras, joystick e replay cinematográfico.','done')}
              ${this.phaseMarkup(13,'Remaster Estação','Voo orbital 6DOF, quatro estações, cápsulas, satélites, EVA e interiores.','done')}
              ${this.phaseMarkup(14,'Remaster Lua + Marte','Primeira pessoa, rovers, drone, braço, terreno, poeira e tempestades.','done')}
              ${this.phaseMarkup(15,'Universo + Museu Visual','Viagem cósmica, galáxias, nebulosas e museu espacial explorável em 3D.','done')}
              ${this.phaseMarkup(16,'Pipeline Premium','GLB, PBR, HDR, LODs, texturas e cache gráfico sob demanda.','done')}
              ${this.phaseMarkup(17,'Integração Premium','Assets GLB dentro de lançamentos, estação, Lua/Marte e Museu Visual.','done')}
              ${this.phaseMarkup(18,'Rigs e Animações','Peças articuladas, rodas, braços, portas, painéis e clips glTF.','done')}
              ${this.phaseMarkup(19,'Interiores Interativos','Hotspots 3D, colliders compostos, áudio espacial e telemetria animada.','done')}
              ${this.phaseMarkup(20,'Fotorealismo','HDR, exposição, sombras, AO, bloom e modo cinema.','done')}
              ${this.phaseMarkup(21,'Física e Controles','Multigravidade, 6DOF, suspensão, colisões, joystick e gamepad.','done')}
              ${this.phaseMarkup(22,'Campanhas Integradas','Missões Lua, Marte e estação com eventos, etapas e evidências.','done')}
              ${this.phaseMarkup(23,'Otimização e QA','Pacotes gráficos, resolução dinâmica, diagnóstico e validação final.','done')}
              ${this.phaseMarkup('C1.1','Enciclopédia Imersiva','Motor de conhecimento, busca, fontes, scanner, coleções e integração com Terra, Lua e Marte.','done')}
            </div>
          </section>
        </main>
      </div>
      ${settings.performanceOverlay ? `<div class="perf-overlay" id="perf-overlay">${this.fps} FPS · ${quality.label}</div>` : ''}
      ${this.overlayMarkup()}`;
  }

  brandMarkup() { return `<div class="brand"><div class="brand-mark">C</div><div><h1>COSMOS DS</h1><p>Universo, Tecnologia e Programação</p></div></div>`; }
  topActionsMarkup() {
    const quality = this.settingsStore.getProfile();
    return `<div class="top-actions"><span class="status-pill">● <strong id="fps-text">${this.fps || '--'} FPS</strong></span><span class="status-pill">Perfil: <strong>${quality.label}</strong></span><button class="icon-button" data-action="open-tutorial" aria-label="Abrir tutorial">?</button><button class="button secondary" data-action="open-settings">⚙ Configurações</button></div>`;
  }
  qualityOptionMarkup(item, selected) { return `<button class="mode-option ${selected === item.id ? 'active' : ''}" data-action="set-quality" data-value="${item.id}"><span class="mode-dot"></span><span><b>${item.label}</b><small>${item.description}</small></span></button>`; }
  moduleCardMarkup(module) {
    const available = module.status === 'available';
    return `<article class="module-card" style="--module-glow:${available ? 'rgba(85,220,255,.3)' : 'rgba(139,108,255,.22)'}"><div class="module-icon">${module.icon}</div><h3>${module.title}</h3><p>${module.description}</p><footer><span class="tag">${module.tag}</span><span class="module-state ${available ? '' : 'planned'}">${available ? 'Disponível' : `Fase ${module.phase}`}</span></footer>${available ? `<button class="button small primary" style="margin-top:14px" data-action="open-module" data-module="${module.id}">Abrir experiência</button>` : ''}</article>`;
  }
  phaseMarkup(number, title, description, state = 'planned') { const code=String(number).startsWith('C')?String(number):`F${String(number).padStart(2,'0')}`; return `<article class="phase ${state}"><strong>${code} · ${title}</strong><span>${description}</span><em>${state === 'done' ? 'Concluída' : state === 'current' ? 'Em desenvolvimento' : 'Planejada'}</em></article>`; }

  overlayMarkup() {
    if (!this.modal) return '<div class="toast-stack" id="toast-stack"></div>';
    const content = this.modal === 'settings' ? this.settingsModal() : this.modal === 'profiles' ? this.profilesModal() : this.tutorialModal();
    return `<div class="modal-backdrop" role="presentation"><section class="modal ${this.modal === 'tutorial' ? 'wide' : ''}" role="dialog" aria-modal="true">${content}</section></div><div class="toast-stack" id="toast-stack"></div>`;
  }

  settingsModal() {
    const settings = this.settingsStore.get();
    const benchmark = this.benchmarkResult;
    return `<div class="modal-head"><div><h2>Configurações da experiência</h2><p>Controle qualidade, bateria, movimento e diagnóstico.</p></div><button class="icon-button" data-action="close-modal" aria-label="Fechar">×</button></div>
      <h3>Perfil gráfico</h3><div class="mode-selector">${Object.values(this.settingsStore.getProfiles()).map(item => this.qualityOptionMarkup(item, settings.qualityMode)).join('')}</div>
      <h3 style="margin-top:20px">Controles adicionais</h3><div class="settings-grid">
        ${this.toggleMarkup('reducedMotion','Reduzir movimento','Diminui parallax e velocidade das animações.',settings.reducedMotion)}
        ${this.toggleMarkup('performanceOverlay','Exibir FPS','Mostra o diagnóstico visual no canto da tela.',settings.performanceOverlay)}
        ${this.toggleMarkup('autoReduceQuality','Redução automática','Autoriza reduzir qualidade quando houver queda persistente.',settings.autoReduceQuality)}
        ${this.toggleMarkup('sound','Áudio da experiência','Reserva o canal para narração, alertas e sons futuros.',settings.sound)}
        ${this.toggleMarkup('highContrast','Alto contraste','Aumenta separação visual e legibilidade.',settings.highContrast)}
        ${this.toggleMarkup('largeText','Texto ampliado','Aumenta fontes e áreas de toque.',settings.largeText)}
        ${this.toggleMarkup('captions','Legendas e transcrições','Mantém alertas sonoros também em texto.',settings.captions)}
        ${this.toggleMarkup('simplifiedControls','Controles simplificados','Prioriza ações contextuais e menos combinações.',settings.simplifiedControls)}
      </div>
      <article class="panel glass" style="margin-top:16px"><h3>Diagnóstico do dispositivo</h3><p class="panel-subtitle">${benchmark ? `Pontuação ${benchmark.score} · ${benchmark.hardwareConcurrency} threads · WebGL2 ${benchmark.webgl2 ? 'disponível' : 'indisponível'} · recomendação ${this.settingsStore.getProfiles()[benchmark.recommendation].label}.` : 'Ainda não executado.'}</p><button class="button secondary" data-action="run-benchmark">Executar novamente</button></article>
      <div class="backup-actions"><button class="button secondary" data-action="storage-diagnose-global">Diagnosticar armazenamento</button><button class="button secondary" data-action="export-backup">Exportar backup</button><label class="button secondary file-button">Importar backup<input type="file" accept="application/json" data-action="import-backup-global"></label><button class="button danger" data-action="clear-data">Apagar dados locais</button></div>`;
  }
  toggleMarkup(key,title,description,on) { return `<article class="setting-card"><header><b>${title}</b><button class="toggle ${on ? 'on' : ''}" data-action="toggle-setting" data-key="${key}" aria-label="Alternar ${title}"></button></header><p>${description}</p></article>`; }

  profilesModal() {
    const profiles = this.profileStore.list();
    const active = this.profileStore.active();
    return `<div class="modal-head"><div><h2>Perfis locais</h2><p>Troque de estudante, crie novos perfis ou remova dados deste dispositivo.</p></div><button class="icon-button" data-action="close-modal">×</button></div>
      <div class="lesson-steps">${profiles.map(profile => `<article class="lesson-step ${profile.id === active.id ? 'current' : ''}"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><div><strong>${escapeHtml(profile.name)} · ${escapeHtml(profile.callsign)}</strong><span>${escapeHtml(profile.className)} · nível ${profile.level} · ${profile.xp} XP</span></div><div class="hero-actions"><button class="button small secondary" data-action="select-profile" data-profile="${profile.id}">Selecionar</button><button class="button small danger" data-action="delete-profile" data-profile="${profile.id}">Excluir</button></div></div></article>`).join('')}</div>
      <h3 style="margin-top:20px">Criar perfil</h3><form data-form="create-profile"><div class="form-grid"><div class="field"><label>Nome do estudante</label><input name="name" maxlength="48" required></div><div class="field"><label>Turma</label><input name="className" maxlength="40" placeholder="Ex.: 2DS A"></div><div class="field"><label>Indicativo</label><input name="callsign" maxlength="12" placeholder="Ex.: ORBITA-7"></div></div><p><button class="button primary" type="submit">Criar e selecionar</button></p></form>`;
  }

  tutorialModal() {
    const steps = [
      ['Bem-vindo ao COSMOS DS','A plataforma une exploração espacial, programação, gráficos, telemetria e engenharia de software. As fases concluídas oferecem vinte e cinco experiências modulares, dos fundamentos à operação de uma estação espacial.'],
      ['Escolha sua prioridade','Use Automático, Máximo desempenho, Equilibrado ou Máxima experiência. O shader se adapta sem recarregar a página.'],
      ['Módulos independentes','COSMOS Curioso, Academia, Controle, Terra, foguetes, Lua, Marte, estação, observatório, Universo Profundo e Museu Visual são carregados somente quando abertos.'],
      ['Progresso local','Crie perfis, troque de estudante e salve XP neste dispositivo. Sincronização online será uma camada futura, não uma dependência do núcleo.']
    ];
    const [title, text] = steps[this.tutorialStep];
    return `<div class="modal-head"><div><span class="eyebrow">Tutorial ${this.tutorialStep + 1}/4</span><h2>${title}</h2><p>${text}</p></div><button class="icon-button" data-action="close-modal">×</button></div>
      <div class="panel glass" style="min-height:250px;display:grid;place-items:center;text-align:center"><div><div style="font-size:4rem">${['◉','⚙','⬡','✓'][this.tutorialStep]}</div><h3>${title}</h3><p class="panel-subtitle" style="max-width:650px">${text}</p></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:16px"><button class="button secondary" data-action="tutorial-prev" ${this.tutorialStep === 0 ? 'disabled' : ''}>Anterior</button><button class="button primary" data-action="tutorial-next">${this.tutorialStep === 3 ? 'Concluir' : 'Próximo'}</button></div>`;
  }

  updateFps() {
    const text = this.root.querySelector('#fps-text');
    const overlay = this.root.querySelector('#perf-overlay');
    if (text) text.textContent = `${this.fps} FPS`;
    if (overlay) overlay.textContent = `${this.fps} FPS · ${this.settingsStore.getProfile().label}`;
  }

  toast(message) {
    let stack = document.querySelector('#toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 3900);
  }
}

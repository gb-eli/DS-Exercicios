import { GuidedTrailStore } from '../core/guided/GuidedTrailStore.js';
import { GuidedTrailEngine } from '../core/guided/GuidedTrailEngine.js';
import { CustomTrailRepository } from '../core/guided/CustomTrailRepository.js';
import { ModuleLoadCoordinator } from '../core/loading/ModuleLoadCoordinator.js';
import { PlatformToolTour } from '../core/guided/PlatformToolTour.js';
import { JOURNEY_ENTRY_MODES, getGuidedStepGuide } from '../data/guidedJourneySystems.js';
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
    this.customTrailRepository = new CustomTrailRepository(this.profileStore.storage);
    this.guidedTrails = new GuidedTrailEngine(new GuidedTrailStore(this.profileStore.storage, this.profileStore.active().id), { customRepository:this.customTrailRepository });
    this.loadCoordinator = new ModuleLoadCoordinator(this.moduleRegistry);
    this.toolTour = new PlatformToolTour(this.profileStore.storage, this.profileStore.active().id);
    this.catalogExpanded = false;
    this.loadingState = null;
    this.guidedExplainOpen = false;
    this.onClick = event => this.handleClick(event);
    this.onSubmit = event => this.handleSubmit(event);
    this.onChange = event => this.handleChange(event);
    this.onResize = () => this.positionToolTour();
    this.onGuidedActivity = event => { if(!['INPUT','TEXTAREA','SELECT'].includes(event.target?.tagName)) this.guidedTrails.activity('interaction',{kind:event.type}); };
    this.guidedTimer = 0;
    this.guidedTimerTicks = 0;
  }

  async init() {
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('submit', this.onSubmit);
    this.root.addEventListener('change', this.onChange);
    addEventListener('resize', this.onResize, { passive:true });
    this.root.addEventListener('pointerdown', this.onGuidedActivity, { passive:true });
    addEventListener('keydown', this.onGuidedActivity);
    this.bus.on('settings:changed', () => { if (this.currentView === 'dashboard') this.render(); });
    this.bus.on('profile:changed', () => {
      this.customTrailRepository = new CustomTrailRepository(this.profileStore.storage);
    this.guidedTrails = new GuidedTrailEngine(new GuidedTrailStore(this.profileStore.storage, this.profileStore.active().id), { customRepository:this.customTrailRepository });
      this.toolTour = new PlatformToolTour(this.profileStore.storage, this.profileStore.active().id);
      if (this.currentView === 'dashboard') this.render();
    });
    this.bus.on('performance:fps', fps => { this.fps = fps; this.updateFps(); });
    this.bus.on('renderer:fallback', payload => this.toast(`Modo visual simplificado: ${payload.reason}.`));
    this.bus.on('quality:auto-adjusted', payload => {
      const label = this.settingsStore.getProfiles()[payload.mode]?.label ?? payload.mode;
      this.toast(`Qualidade automática ajustada para ${label}.`);
    });
    this.render();
    this.guidedTimer=setInterval(()=>{this.guidedTrails.tick();this.guidedTimerTicks++;if(this.currentView==='module'&&this.guidedTimerTicks%5===0&&!this.root.querySelector('[data-guided-evidence]:focus'))this.refreshGuidedHud();},1000);
    const requestedModule = typeof location !== 'undefined' ? new URL(location.href).searchParams.get('module') : null;
    if (requestedModule && this.moduleRegistry.list().some(item => item.id === requestedModule && item.status === 'available')) {
      await this.openModule(requestedModule);
      return;
    }
    const benchmark = () => this.runAutomaticBenchmark(false).then(() => { if(this.currentView==='dashboard')this.render(); }).catch(()=>{});
    if(typeof requestIdleCallback==='function')requestIdleCallback(benchmark,{timeout:2500});else setTimeout(benchmark,350);
  }

  destroy() {
    this.disposeActiveModule();
    this.loadCoordinator.destroy();
    clearInterval(this.guidedTimer);
    this.root.removeEventListener('click', this.onClick);
    this.root.removeEventListener('submit', this.onSubmit);
    this.root.removeEventListener('change', this.onChange);
    removeEventListener('resize', this.onResize);
    this.root.removeEventListener('pointerdown', this.onGuidedActivity);
    removeEventListener('keydown', this.onGuidedActivity);
  }

  disposeActiveModule() {
    if(this.activeModuleId)this.guidedTrails.leaveModule(this.activeModuleId);
    this.premiumIntegration?.destroy?.();
    this.premiumIntegration = null;
    this.activeModule?.unmount?.();
    if(this.activeModuleId)this.bus.emit('module:disposed',{moduleId:this.activeModuleId,at:new Date().toISOString()});
    this.activeModule = null;
    this.activeModuleId = null;
  }

  async runAutomaticBenchmark(showFeedback = true) {
    if (showFeedback) this.toast('Executando diagnóstico rápido do dispositivo…');
    this.benchmarkResult = await this.benchmarkService.run();
    this.settingsStore.resolveAutomatic(this.benchmarkResult.recommendation);
    if (showFeedback) this.toast(`Perfil recomendado: ${this.settingsStore.getProfiles()[this.benchmarkResult.recommendation].label}.`);
  }

  async openModule(id) {
    const definition=this.moduleRegistry.definition(id);
    if(!definition){this.toast('Laboratório não encontrado.');return;}
    try {
      this.disposeActiveModule();
      this.loadCoordinator.cancelPrefetch();
      this.loadingState={moduleId:id,title:definition.title,progress:0,label:'Preparando acesso',detail:'Nenhum ambiente pesado foi carregado ainda.',error:null};
      this.currentView='loading';this.modal=null;this.render();
      const module=await this.loadCoordinator.load(id,{onProgress:stage=>{this.loadingState={...this.loadingState,...stage};if(this.currentView==='loading')this.render();}});
      this.activeModule=module;this.activeModuleId=id;this.guidedTrails.visitModule(id);
      this.profileStore.storage.set(`journey-last:${this.profileStore.active().id}`,{moduleId:id,visitedAt:new Date().toISOString()});
      const active=this.guidedTrails.active();
      this.guidedExplainOpen=Boolean(active?.currentStep?.moduleId===id);
      this.currentView='module';this.loadingState=null;this.render();
      this.activeModule.mount(this.root.querySelector('#module-host'),{
        profileStore:this.profileStore,settingsStore:this.settingsStore,moduleRegistry:this.moduleRegistry,customTrailRepository:this.customTrailRepository,toast:message=>this.toast(message),onBack:()=>this.backToDashboard(),openModule:moduleId=>this.openModule(moduleId),guidedTrails:this.guidedTrails,recordGuidedEvent:(type,payload)=>this.guidedTrails.signal(type,payload),setGuidedEvidence:text=>this.guidedTrails.setEvidence(text),startToolTour:()=>this.startToolTour(),bus:this.bus
      });
      if(['launch-remaster','station-remaster','planetary-remaster','visual-museum'].includes(id)){
        const { PremiumIntegrationOrchestrator }=await import('../core/assets/PremiumIntegrationOrchestrator.js');
        this.premiumIntegration=new PremiumIntegrationOrchestrator({moduleId:id,host:this.root.querySelector('#module-host'),settingsStore:this.settingsStore,profileStore:this.profileStore,bus:this.bus,toast:message=>this.toast(message)});
        await this.premiumIntegration.start();
      }
      const following=this.guidedTrails.followingModule();
      if(active?.currentStep?.moduleId===id&&following)this.loadCoordinator.schedulePrefetch(following);
      scrollTo({top:0,behavior:this.settingsStore.get().reducedMotion?'auto':'smooth'});
    } catch(error) {
      this.disposeActiveModule();
      this.currentView='loading';
      this.loadingState={...(this.loadingState||{}),moduleId:id,title:definition.title,error:error.message||'Não foi possível abrir o laboratório.',label:'Falha controlada',detail:'A página principal continua disponível e nenhum cenário ficou preso na memória.'};
      this.render();
    }
  }

  backToDashboard() {
    this.disposeActiveModule();
    this.loadCoordinator.cancelPrefetch();
    this.loadCoordinator.releaseLabStyles();
    this.currentView='dashboard';this.loadingState=null;this.guidedExplainOpen=false;this.render();
  }

  startToolTour(){this.catalogExpanded=false;this.toolTour.start();this.currentView='dashboard';this.render();this.toast('Tour iniciado. Use os destaques para conhecer a plataforma.');}

  handleClick(event) {
    const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;this.guidedTrails.activity('interaction',{action});
    if(action==='open-settings'){this.modal='settings';this.render();return;}
    if(action==='open-profiles'){this.modal='profiles';this.render();return;}
    if(action==='open-tutorial'||action==='start-tool-tour'){this.startToolTour();return;}
    if(action==='tool-tour-next'){this.toolTour.next();this.render();return;}
    if(action==='tool-tour-prev'){this.toolTour.previous();this.render();return;}
    if(action==='tool-tour-close'){this.toolTour.stop();this.render();return;}
    if(action==='close-modal'){this.modal=null;this.render();return;}
    if(action==='set-quality'){this.settingsStore.setQualityMode(target.dataset.value);return;}
    if(action==='toggle-setting'){const key=target.dataset.key,state=this.settingsStore.get();this.settingsStore.update({[key]:!state[key]});return;}
    if(action==='run-benchmark'){this.runAutomaticBenchmark(true).then(()=>this.render());return;}
    if(action==='open-module'){this.openModule(target.dataset.module);return;}
    if(action==='open-journeys'){this.openModule('journey-center');return;}
    if(action==='reveal-catalog'){this.catalogExpanded=true;this.render();setTimeout(()=>this.root.querySelector('#free-catalog')?.scrollIntoView({behavior:this.settingsStore.get().reducedMotion?'auto':'smooth'}),0);return;}
    if(action==='hide-catalog'){this.catalogExpanded=false;this.render();return;}
    if(action==='continue-journey'){
      const active=this.guidedTrails.active();if(active?.currentStep){this.openModule(active.currentStep.moduleId);return;}
      const last=this.profileStore.storage.get(`journey-last:${this.profileStore.active().id}`,null);if(last?.moduleId){this.openModule(last.moduleId);return;}this.openModule('journey-center');return;
    }
    if(action==='retry-module'){if(this.loadingState?.moduleId)this.openModule(this.loadingState.moduleId);return;}
    if(action==='guided-open-step'){const moduleId=this.guidedTrails.nextModule();if(moduleId)this.openModule(moduleId);return;}
    if(action==='guided-open-hub'){this.openModule('journey-center');return;}
    if(action==='guided-explain'){this.guidedExplainOpen=true;this.refreshGuidedHud();return;}
    if(action==='guided-close-explain'){this.guidedExplainOpen=false;this.refreshGuidedHud();return;}
    if(action==='guided-pause'){this.guidedTrails.pause();this.guidedExplainOpen=false;this.refreshGuidedHud();this.toast('Jornada pausada. O progresso foi preservado.');return;}
    if(action==='guided-save-evidence'){const input=this.root.querySelector('[data-guided-evidence]');const status=this.guidedTrails.setEvidence(input?.value||'');this.toast(status?.requiredEventMet?'Evidência registrada.':'Escreva pelo menos três caracteres.');this.refreshGuidedHud();return;}
    if(action==='guided-early-release'){const code=prompt('Código do professor para liberação antecipada:')||'',reason=prompt('Motivo da liberação antecipada (mínimo de 10 caracteres):')||'',result=this.guidedTrails.authorizeEarlyRelease({code,reason});this.toast(result.ok?'Liberação antecipada registrada.':result.reason);this.refreshGuidedHud();return;}
    if(action==='guided-narrate'){const active=this.guidedTrails.active(),trail=active?this.guidedTrails.definition(active.trailId):null,guide=active?getGuidedStepGuide(active.trailId,active.currentStep,trail):null;if(!guide)return;if(!('speechSynthesis' in window)){this.toast('Narração indisponível neste navegador.');return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(`${active.currentStep.title}. ${guide.narration||active.currentStep.objective}. ${guide.why}`);utterance.lang='pt-BR';speechSynthesis.speak(utterance);return;}
    if(action==='guided-complete-step'){
      const result=this.guidedTrails.completeCurrent();if(!result.ok){this.toast(result.reason);return;}
      const xp=result.done?350:70;this.profileStore.addXp(xp,`guided-${result.completedStep.id}`);this.guidedExplainOpen=!result.done;
      this.toast(result.done?`Jornada concluída: +${xp} XP.`:`Etapa registrada: +${xp} XP. O próximo objetivo já está organizado.`);
      const next=this.guidedTrails.nextModule();if(next)this.loadCoordinator.schedulePrefetch(next);this.refreshGuidedHud();return;
    }
    if(action==='export-backup'){this.exportBackup();return;}
    if(action==='storage-diagnose-global'){this.runStorageDiagnostic();return;}
    if(action==='back-dashboard'){this.backToDashboard();return;}
    if(action==='select-profile'){this.modal=null;this.profileStore.select(target.dataset.profile);this.render();return;}
    if(action==='delete-profile'){try{this.profileStore.remove(target.dataset.profile);this.toast('Perfil local removido.');}catch(error){this.toast(error.message);}return;}
    if(action==='tutorial-next'){if(this.tutorialStep<3)this.tutorialStep++;else{this.settingsStore.update({tutorialSeen:true});this.modal=null;}this.render();return;}
    if(action==='tutorial-prev'){this.tutorialStep=Math.max(0,this.tutorialStep-1);this.render();return;}
    if(action==='clear-data'&&confirm('Apagar todos os perfis, progresso e configurações locais do COSMOS DS?')){this.settingsStore.storage.clearProject();location.reload();}
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
    if(this.currentView==='loading'){this.root.innerHTML=this.loadingMarkup();return;}
    if(this.currentView==='module'){
      const immersive=['project-curation-studio','culture-discovery','curiosity-center','solar-remaster','launch-remaster','station-remaster','planetary-remaster','deep-space-remaster','visual-museum','cinematic-studio','physics-controls','integrated-campaigns','technical-operations','telescope-lab','astrophotography-lab'].includes(this.activeModuleId);
      this.root.innerHTML=immersive?`<main id="module-host" class="immersive-module-host"></main>${this.guidedHudMarkup()}<div class="toast-stack" id="toast-stack"></div>`:`<div class="shell"><header class="topbar glass">${this.brandMarkup()}<div class="top-actions"><span class="status-pill">● <strong id="fps-text">${this.fps||'--'} FPS</strong></span><button class="button secondary" data-action="back-dashboard">← Portal leve</button></div></header><main id="module-host"></main></div>${this.guidedHudMarkup()}<div class="toast-stack" id="toast-stack"></div>`;
      return;
    }
    const profile=this.profileStore.active(),modules=this.moduleRegistry.list(),settings=this.settingsStore.get(),quality=this.settingsStore.getProfile(),active=this.guidedTrails.active();
    const last=this.profileStore.storage.get(`journey-last:${profile.id}`,null),continueLabel=active?.currentStep?`Continuar: ${active.currentStep.title}`:last?.moduleId?'Retomar último laboratório':'Começar primeira jornada';
    const actions={continue:'continue-journey',guided:'open-journeys',free:'reveal-catalog',tour:'start-tool-tour'},anchors={continue:'journey-continue',guided:'journey-guided',free:'journey-free',tour:'journey-tour'};
    this.root.innerHTML=`<div class="shell startup-shell"><header class="topbar glass">${this.brandMarkup()}${this.topActionsMarkup()}</header><main>
      <section class="startup-hero glass"><div class="startup-copy"><span class="eyebrow">Fase C5.2 · Projetos, carreiras e curadoria científica</span><h2>Como você quer começar sua <span>jornada espacial?</span></h2><p>Nenhum laboratório 3D pesado foi carregado. Escolha um caminho, use uma trilha oficial ou entre com o código preparado pelo professor.</p></div><div class="startup-status"><span>INICIALIZAÇÃO LEVE</span><b>Interface pronta</b><small>GLB, HDR, áudio, Workers e simulações aguardam sua escolha.</small></div></section>
      <section class="journey-entry-grid">${JOURNEY_ENTRY_MODES.map(mode=>`<button class="journey-entry-card" data-action="${actions[mode.id]}" data-tour-anchor="${anchors[mode.id]}"><span>${mode.icon}</span><div><small>${mode.id==='continue'?escapeHtml(continueLabel):'MODO DE ENTRADA'}</small><h3>${escapeHtml(mode.title)}</h3><p>${escapeHtml(mode.summary)}</p></div><i>→</i></button>`).join('')}</section>
      <section class="startup-meta-grid"><article class="panel glass profile-card" data-tour-anchor="profile-card"><div class="profile-main"><div class="avatar">${escapeHtml(profile.callsign.slice(0,2))}</div><div><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.className)} · ${escapeHtml(profile.callsign)}</span></div></div><div><div class="progress-bar"><i style="width:${(profile.xp%250)/2.5}%"></i></div><small class="startup-mini">Nível ${profile.level} · ${profile.xp} XP · ${profile.completedExperiences.length} registros</small></div><button class="button secondary" data-action="open-profiles">Trocar ou criar perfil</button></article>
      <article class="panel glass startup-system-card"><span class="eyebrow">Carregamento inteligente</span><h3>Um laboratório por vez</h3><p>O módulo escolhido é importado sob demanda. Ao sair, animações, listeners, áudio e recursos gráficos são liberados pelo lifecycle de cada experiência.</p><div class="startup-system-metrics"><span><b>${modules.length}</b> módulos mapeados</span><span><b>${quality.label}</b> perfil atual</span><span><b>${active?active.percent:0}%</b> jornada ativa</span></div></article></section>
      ${this.catalogExpanded?this.catalogMarkup(modules):''}
    </main></div>${settings.performanceOverlay?`<div class="perf-overlay" id="perf-overlay">${this.fps} FPS · ${quality.label}</div>`:''}${this.overlayMarkup()}`;
    if(this.toolTour.snapshot().active)setTimeout(()=>this.positionToolTour(),0);
  }

  catalogMarkup(modules){return `<section class="section glass free-catalog" id="free-catalog"><div class="section-head"><div><span class="eyebrow">Exploração livre</span><h2>Escolha um laboratório</h2><p>Somente a experiência aberta será importada e inicializada.</p></div><button class="button secondary" data-action="hide-catalog">Recolher catálogo</button></div><div class="module-grid">${modules.map(module=>this.moduleCardMarkup(module)).join('')}</div></section>`;}

  loadingMarkup(){const state=this.loadingState||{},error=state.error,definition=this.moduleRegistry.definition(state.moduleId)||{};return `<div class="shell loading-shell"><header class="topbar glass">${this.brandMarkup()}<button class="button secondary" data-action="back-dashboard">Cancelar e voltar</button></header><main class="laboratory-loading glass"><div class="loading-orbit" aria-hidden="true"><i></i><i></i><i></i><b>${definition.icon||'C'}</b></div><div class="loading-copy"><span class="eyebrow">Carregamento sob demanda</span><h2>${escapeHtml(state.title||'Preparando laboratório')}</h2><p>${escapeHtml(state.detail||'Organizando os recursos necessários.')}</p><div class="loading-progress"><i style="width:${Number(state.progress||0)}%"></i></div><div class="loading-stage"><strong>${escapeHtml(state.label||'Preparando')}</strong><span>${Number(state.progress||0)}%</span></div>${error?`<article class="loading-error"><b>Não foi possível concluir o carregamento</b><p>${escapeHtml(error)}</p><div class="hero-actions"><button class="button primary" data-action="retry-module">Tentar novamente</button><button class="button secondary" data-action="back-dashboard">Voltar ao portal</button></div></article>`:`<div class="loading-checks"><span class="done">✓ Interface leve</span><span class="${Number(state.progress)>=38?'done':''}">Código do módulo</span><span class="${Number(state.progress)>=67?'done':''}">Dados locais</span><span class="${Number(state.progress)>=88?'done':''}">Cena inicial</span></div>`}</div></main></div><div class="toast-stack" id="toast-stack"></div>`;}

  guidedHudMarkup() {
    const active=this.guidedTrails.active();if(!active?.currentStep)return '<aside id="guided-trail-hud"></aside>';
    const trail=this.guidedTrails.definition(active.trailId),step=active.currentStep,here=step.moduleId===this.activeModuleId,guide=getGuidedStepGuide(active.trailId,step,trail);
    const minMs=Math.max(0,Number(step.minimumMinutes||0)*60000),timePercent=minMs?Math.min(100,Math.round(active.currentActiveMs/minMs*100)):100,format=ms=>{const sec=Math.floor(Math.max(0,ms)/1000),m=Math.floor(sec/60),s=sec%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;};
    const condition=step.requiredEvent&&step.requiredEvent!=='none'?` · checkpoint ${active.requiredEventMet?'pronto':'pendente'}`:'';
    return `<aside id="guided-trail-hud" class="guided-trail-hud ${here?'on-target':'off-target'} ${this.guidedExplainOpen?'explained':''}" style="--trail:${trail.accent}"><button class="guided-hud-collapse" data-action="guided-open-hub" aria-label="Abrir central da jornada">${trail.icon}</button><div class="guided-hud-main"><span>${escapeHtml(guide.role)} · etapa ${active.completed+1}/${active.total}${trail.custom?` · código ${escapeHtml(trail.accessCode)}`:''}</span><b>${escapeHtml(step.title)}</b><small>${escapeHtml(step.objective)}</small><div class="guided-time-row"><span>Tempo ${format(active.currentActiveMs)}${minMs?` / ${format(minMs)}`:''}${condition}</span><i><em style="width:${timePercent}%"></em></i></div><i><em style="width:${active.percent}%"></em></i>${this.guidedExplainOpen?`<section class="guided-explanation"><p><strong>Por que usar?</strong> ${escapeHtml(guide.why)}</p><p><strong>O que observar?</strong> ${escapeHtml(guide.tool)}</p><p><strong>Resultado:</strong> ${escapeHtml(guide.expected)}</p>${guide.supportHint?`<p><strong>Pista:</strong> ${escapeHtml(guide.supportHint)}</p>`:''}${guide.advancedChallenge?`<p><strong>Aprofundamento:</strong> ${escapeHtml(guide.advancedChallenge)}</p>`:''}</section>${trail.custom?`<section class="guided-evidence-entry"><label>${escapeHtml(guide.evidencePrompt)}<textarea data-guided-evidence rows="2" maxlength="1200">${escapeHtml(active.evidenceByStep?.[step.id]||'')}</textarea></label><button data-action="guided-save-evidence">Salvar evidência</button></section>`:''}`:''}</div><footer>${here?'<button data-action="guided-complete-step">Registrar etapa</button>':'<button data-action="guided-open-step">Abrir laboratório</button>'}${this.guidedExplainOpen?'<button class="secondary" data-action="guided-close-explain">Fechar explicação</button>':'<button class="secondary" data-action="guided-explain">Por que usar?</button>'}${trail.narration?'<button class="secondary" data-action="guided-narrate">Ouvir etapa</button>':''}${trail.custom&&active.remainingMs>0?'<button class="secondary" data-action="guided-early-release">Liberação professor</button>':''}<button class="secondary" data-action="guided-open-hub">Ver jornada</button><button class="secondary" data-action="guided-pause">Pausar</button></footer></aside>`;
  }

  refreshGuidedHud(){const current=this.root.querySelector('#guided-trail-hud');if(!current)return;const wrap=document.createElement('div');wrap.innerHTML=this.guidedHudMarkup();current.replaceWith(wrap.firstElementChild);}

  toolTourMarkup(){const tour=this.toolTour.snapshot();if(!tour.active||!tour.step)return '';return `<div class="tool-tour-layer" aria-live="polite"><div class="tool-tour-spotlight" id="tool-tour-spotlight"></div><section class="tool-tour-card"><span>FERRAMENTA ${tour.index+1}/${tour.total}</span><h3>${escapeHtml(tour.step.title)}</h3><p>${escapeHtml(tour.step.purpose)}</p><small>${escapeHtml(tour.step.action)}</small><footer><button class="button secondary" data-action="tool-tour-prev" ${tour.index===0?'disabled':''}>Anterior</button><button class="button secondary" data-action="tool-tour-close">Encerrar</button><button class="button primary" data-action="tool-tour-next">${tour.index===tour.total-1?'Concluir':'Próximo'}</button></footer></section></div>`;}

  positionToolTour(){const tour=this.toolTour.snapshot();if(!tour.active||!tour.step)return;const target=this.root.querySelector(`[data-tour-anchor="${tour.step.anchor}"]`),spot=this.root.querySelector('#tool-tour-spotlight');if(!target||!spot)return;const rect=target.getBoundingClientRect(),pad=8;spot.style.left=`${Math.max(4,rect.left-pad)}px`;spot.style.top=`${Math.max(4,rect.top-pad)}px`;spot.style.width=`${Math.min(innerWidth-8,rect.width+pad*2)}px`;spot.style.height=`${Math.min(innerHeight-8,rect.height+pad*2)}px`;}

  brandMarkup() { return `<div class="brand"><div class="brand-mark">C</div><div><h1>COSMOS DS</h1><p>Universo, Tecnologia e Programação</p></div></div>`; }
  topActionsMarkup() {
    const quality = this.settingsStore.getProfile();
    return `<div class="top-actions"><span class="status-pill">● <strong id="fps-text">${this.fps || '--'} FPS</strong></span><span class="status-pill">Perfil: <strong>${quality.label}</strong></span><button class="icon-button" data-action="open-tutorial" aria-label="Abrir tutorial">?</button><button class="button secondary" data-action="open-settings" data-tour-anchor="settings-button">⚙ Configurações</button></div>`;
  }
  qualityOptionMarkup(item, selected) { return `<button class="mode-option ${selected === item.id ? 'active' : ''}" data-action="set-quality" data-value="${item.id}"><span class="mode-dot"></span><span><b>${item.label}</b><small>${item.description}</small></span></button>`; }
  moduleCardMarkup(module) {
    const available = module.status === 'available';
    return `<article class="module-card" style="--module-glow:${available ? 'rgba(85,220,255,.3)' : 'rgba(139,108,255,.22)'}"><div class="module-icon">${module.icon}</div><h3>${module.title}</h3><p>${module.description}</p><footer><span class="tag">${module.tag}</span><span class="module-state ${available ? '' : 'planned'}">${available ? 'Disponível' : `Fase ${module.phase}`}</span></footer>${available ? `<button class="button small primary" style="margin-top:14px" data-action="open-module" data-module="${module.id}">Abrir experiência</button>` : ''}</article>`;
  }
  phaseMarkup(number, title, description, state = 'planned') { const code=String(number).startsWith('C')?String(number):`F${String(number).padStart(2,'0')}`; return `<article class="phase ${state}"><strong>${code} · ${title}</strong><span>${description}</span><em>${state === 'done' ? 'Concluída' : state === 'current' ? 'Em desenvolvimento' : 'Planejada'}</em></article>`; }

  overlayMarkup() {
    const modal=this.modal?`<div class="modal-backdrop" role="presentation"><section class="modal ${this.modal==='tutorial'?'wide':''}" role="dialog" aria-modal="true">${this.modal==='settings'?this.settingsModal():this.modal==='profiles'?this.profilesModal():this.tutorialModal()}</section></div>`:'';
    return `${modal}${this.toolTourMarkup()}<div class="toast-stack" id="toast-stack"></div>`;
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
      ['Bem-vindo ao COSMOS DS','A plataforma une exploração espacial, programação, gráficos, telemetria e engenharia de software. As fases concluídas oferecem trinta e quatro experiências modulares, dos fundamentos à operação de uma estação espacial.'],
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

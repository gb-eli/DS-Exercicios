import { RocketSystem } from '../../core/launch/RocketSystem.js';
import { RocketFlightModel } from '../../core/launch/RocketFlightModel.js';
import { RocketSceneRenderer } from '../../rendering/RocketSceneRenderer.js';
import {
  LAUNCH_MISSIONS,FIRST_STAGES,UPPER_STAGES,PAYLOADS,GUIDANCE_SYSTEMS,FAIRINGS,LAUNCH_SITES,
  LAUNCH_CHECKLIST,LAUNCH_FAULTS,LAUNCH_STATE_LABELS
} from '../../data/launchSystems.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const format=(value,digits=0)=>Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:digits,minimumFractionDigits:digits});
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

class LaunchModule{
  constructor(){
    this.container=null;this.context=null;this.activeTab='hangar';this.rocket=new RocketSystem();this.summary=this.rocket.summary();
    this.checklist=new Map();this.renderer=null;this.worker=null;this.fallbackModel=null;this.fallbackTimer=null;this.running=false;this.speed=1;
    this.telemetry=null;this.flightSamples=[];this.logs=[];this.activeFault=null;this.faultFeedback='';this.certified=false;
    this.onClick=e=>this.handleClick(e);this.onChange=e=>this.handleChange(e);
  }
  mount(container,context){
    this.container=container;this.context=context;this.certified=context.profileStore.hasCompleted('launch-certification');
    container.addEventListener('click',this.onClick);container.addEventListener('change',this.onChange);this.createWorker();this.configureFlight();this.render();
  }
  unmount(){
    this.renderer?.destroy();this.worker?.postMessage({type:'stop'});this.worker?.terminate();clearInterval(this.fallbackTimer);
    this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('change',this.onChange);
  }
  createWorker(){
    if(!('Worker'in globalThis))return;
    try{
      this.worker=new Worker(new URL('../../workers/launch.worker.js',import.meta.url),{type:'module'});
      this.worker.addEventListener('message',event=>this.handleWorkerMessage(event.data));
      this.worker.addEventListener('error',()=>{this.worker?.terminate();this.worker=null;this.fallbackModel=new RocketFlightModel(this.summary.flightConfig);this.context.toast('Worker de voo indisponível; simulação local ativada.');if(this.running){this.fallbackModel.start();this.startFallback();}});
      this.worker.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});
    }catch(error){console.warn(error);this.worker=null;}
  }
  configureFlight(){
    const config=this.summary.flightConfig;
    if(this.worker)this.worker.postMessage({type:'configure',payload:config});
    else this.fallbackModel=new RocketFlightModel(config);
  }
  handleWorkerMessage(message){
    if(message.type==='telemetry')this.receiveTelemetry(message.payload);
    if(message.type==='events')message.payload.forEach(event=>this.addLog(event));
    if(message.type==='complete'){this.receiveTelemetry(message.payload);this.completeFlight(message.payload);}
  }
  receiveTelemetry(payload){
    this.telemetry=payload;
    if(payload.tick%2===0){this.flightSamples.push(payload);if(this.flightSamples.length>150)this.flightSamples.shift();}
    this.renderer?.setTelemetry(payload);this.updateFlightDom();
  }
  addLog(event){
    this.logs.unshift({time:event.time??this.telemetry?.elapsed??0,type:event.type??'INFO',message:event.message??String(event)});
    if(this.logs.length>36)this.logs.pop();this.updateLogDom();
  }
  startFallback(){
    clearInterval(this.fallbackTimer);this.running=true;const interval=this.context.settingsStore.getProfile().id==='performance'?180:110;
    this.fallbackTimer=setInterval(()=>{
      const telemetry=this.fallbackModel.step(interval/1000*this.speed);this.receiveTelemetry(telemetry);this.fallbackModel.drainEvents().forEach(event=>this.addLog(event));
      if(['ORBIT','FAILED','ABORTED'].includes(telemetry.state)){clearInterval(this.fallbackTimer);this.running=false;this.completeFlight(telemetry);}
    },interval);
  }
  render(){
    this.renderer?.destroy();this.renderer=null;
    this.container.innerHTML=`
      <section class="launch-module" style="--launch-accent:${this.summary.validation.ok?'#66f1b0':'#ffcf5a'}">
        <header class="module-hero launch-hero glass">
          <div><span class="eyebrow">Fase 5 · Engenharia de lançamento</span><h2>Foguetes, software de voo e sistemas críticos</h2><p>Configure um veículo autoral, valide requisitos, execute intertravamentos e acompanhe uma subida processada fora da interface.</p></div>
          <div class="launch-hero-status"><span>${this.summary.mission.orbit}</span><strong>${this.summary.validation.ok?'VEÍCULO APTO':'REVISÃO NECESSÁRIA'}</strong><small>${format(this.summary.liftOffMassKg/1000,1)} t no lançamento</small></div>
        </header>
        <nav class="module-tabs launch-tabs" aria-label="Estações da Fase 5">
          ${this.tabButton('hangar','◈ Hangar 3D')}${this.tabButton('builder','⌘ Construtor')}${this.tabButton('checklist','✓ Checklist')}${this.tabButton('flight','▲ Voo')}${this.tabButton('systems','</> Sistemas DS')}
        </nav>
        <div class="launch-tab-host">${this.tabMarkup()}</div>
      </section>`;
    queueMicrotask(()=>this.afterRender());
  }
  tabButton(id,label){return`<button class="module-tab ${this.activeTab===id?'active':''}" data-action="launch-tab" data-tab="${id}">${label}</button>`;}
  tabMarkup(){
    if(this.activeTab==='builder')return this.builderMarkup();
    if(this.activeTab==='checklist')return this.checklistMarkup();
    if(this.activeTab==='flight')return this.flightMarkup();
    if(this.activeTab==='systems')return this.systemsMarkup();
    return this.hangarMarkup();
  }
  afterRender(){
    const canvas=this.container.querySelector('#rocket-scene-canvas');
    if(canvas){this.renderer=new RocketSceneRenderer(canvas,this.context.settingsStore);this.renderer.setMode(this.activeTab==='flight'?'flight':'hangar');this.renderer.setRocket(this.summary);if(this.telemetry)this.renderer.setTelemetry(this.telemetry);this.renderer.start();}
    if(this.activeTab==='flight'){this.updateFlightDom();this.drawFlightChart();}
  }
  hangarMarkup(){
    const s=this.summary;
    return`<div class="launch-hangar-layout">
      <section class="rocket-stage glass"><canvas id="rocket-scene-canvas" aria-label="Visualização procedural do foguete"></canvas><div class="rocket-stage-overlay"><span>ARRASTE PARA GIRAR · ROLE PARA ZOOM</span><button class="button small secondary" data-action="rocket-camera-reset">Redefinir câmera</button></div><div class="rocket-callout top">COIFA · ${escapeHtml(s.fairing.label)}</div><div class="rocket-callout mid">${escapeHtml(s.upperStage.label)}</div><div class="rocket-callout low">${escapeHtml(s.firstStage.engines)} MOTORES · ${format(s.firstStage.thrustN/1e6,2)} MN</div></section>
      <aside class="launch-side-stack">
        <section class="panel glass"><span class="eyebrow">Veículo atual</span><h3>COSMOS ${escapeHtml(s.firstStage.id.toUpperCase())}</h3><p class="panel-subtitle">Representação procedural pronta para ser substituída por GLB com LOD sem alterar as regras do laboratório.</p><div class="launch-spec-list">${this.specRow('Missão',s.mission.label)}${this.specRow('Carga',`${s.payload.label} · ${format(s.payload.massKg)} kg`)}${this.specRow('Δv estimado',`${format(s.totalDeltaV)} m/s`)}${this.specRow('T/W',s.twr.toFixed(2))}${this.specRow('Confiabilidade GNC',`${format(s.guidance.reliability*100,1)}%`)}</div></section>
        <section class="panel glass"><span class="eyebrow">Camadas técnicas</span><div class="tech-layer-list"><button data-action="launch-tab" data-tab="builder"><b>01</b><span>Estrutura e massa<small>Estágios, coifa e carga útil</small></span></button><button data-action="launch-tab" data-tab="checklist"><b>02</b><span>Intertravamentos<small>Validações antes da ignição</small></span></button><button data-action="launch-tab" data-tab="flight"><b>03</b><span>Telemetria de voo<small>Worker, estados e falhas</small></span></button></div></section>
        <section class="panel glass"><span class="eyebrow">Qualidade ativa</span><h3>${escapeHtml(this.context.settingsStore.getProfile().label)}</h3><p class="panel-subtitle">O shader reduz passos de ray marching, resolução e fumaça no perfil de desempenho.</p></section>
      </aside>
    </div>`;
  }
  builderMarkup(){
    const s=this.summary;
    return`<div class="rocket-builder-layout">
      <section class="panel glass rocket-config-panel"><div class="section-head"><div><span class="eyebrow">Construtor da missão</span><h2>Configuração do veículo</h2></div><span class="validation-chip ${s.validation.ok?'ok':'warn'}">${s.validation.ok?'VÁLIDA':'INCOMPATÍVEL'}</span></div>
        <div class="rocket-select-grid">
          ${this.selectMarkup('missionId','Missão',LAUNCH_MISSIONS,s.config.missionId)}${this.selectMarkup('payloadId','Carga útil',PAYLOADS,s.config.payloadId)}
          ${this.selectMarkup('firstStageId','Primeiro estágio',FIRST_STAGES,s.config.firstStageId)}${this.selectMarkup('upperStageId','Estágio superior',UPPER_STAGES,s.config.upperStageId)}
          ${this.selectMarkup('guidanceId','Sistema GNC',GUIDANCE_SYSTEMS,s.config.guidanceId)}${this.selectMarkup('fairingId','Coifa',FAIRINGS,s.config.fairingId)}
          ${this.selectMarkup('siteId','Base',LAUNCH_SITES,s.config.siteId)}
          <label class="rocket-field"><span>Reserva de propelente</span><select data-builder-key="reservePercent">${[3,6,9,12].map(value=>`<option value="${value}" ${Number(s.config.reservePercent)===value?'selected':''}>${value}%</option>`).join('')}</select></label>
        </div>
        <label class="recovery-toggle"><input type="checkbox" data-builder-key="recovery" ${s.config.recovery?'checked':''}><span><b>Planejar recuperação do primeiro estágio</b><small>Reserva propelente quando o núcleo oferece essa capacidade.</small></span></label>
      </section>
      <section class="panel glass rocket-stack-diagram"><span class="eyebrow">Arquitetura física</span><div class="stack-visual"><div class="stack-payload"><b>${format(s.payload.massKg)} kg</b><span>${escapeHtml(s.payload.label)}</span></div><div class="stack-upper"><b>${escapeHtml(s.upperStage.label)}</b><span>${format((s.upperStage.dryMassKg+s.upperUsablePropellant)/1000,1)} t</span></div><div class="stack-core"><b>${escapeHtml(s.firstStage.label)}</b><span>${format((s.firstStage.dryMassKg+s.firstUsablePropellant)/1000,1)} t</span></div></div><p class="panel-subtitle">A massa de cada camada altera empuxo/peso e Δv das camadas inferiores.</p></section>
      <section class="panel glass rocket-results-panel"><span class="eyebrow">Análise automática</span><div class="rocket-metric-grid">${this.metric('Massa',`${format(s.liftOffMassKg/1000,1)} t`,'Veículo completo')}${this.metric('Empuxo/peso',s.twr.toFixed(2),s.twr>=1.18?'Decolagem possível':'Insuficiente')}${this.metric('Δv',`${format(s.totalDeltaV)} m/s`,`${s.deltaVMargin>=0?'+':''}${format(s.deltaVMargin)} m/s de margem`)}${this.metric('Carga limite',`${format(s.structuralLimit)} kg`,'Menor limite estrutural')}</div>
        <div class="builder-validation ${s.validation.ok?'ok':'warn'}"><b>${s.validation.ok?'Configuração aprovada':'Correções necessárias'}</b>${s.validation.issues.length?`<ul>${s.validation.issues.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:'<p>Todos os requisitos principais foram atendidos.</p>'}${s.validation.warnings.length?`<div class="warning-list">${s.validation.warnings.map(item=>`<span>⚠ ${escapeHtml(item)}</span>`).join('')}</div>`:''}<button class="button primary" data-action="validate-rocket" ${s.validation.ok?'':'disabled'}>Registrar projeto · 320 XP</button></div>
      </section>
    </div>`;
  }
  checklistMarkup(){
    const passed=[...this.checklist.values()].filter(item=>item.ok).length;const ready=passed===LAUNCH_CHECKLIST.length&&this.summary.validation.ok;
    return`<div class="checklist-layout">
      <section class="panel glass checklist-console"><div class="section-head"><div><span class="eyebrow">Intertravamentos digitais</span><h2>Checklist de lançamento</h2><p>Os testes devem ser executados na ordem para simular dependências entre subsistemas.</p></div><div class="checklist-progress"><strong>${passed}/${LAUNCH_CHECKLIST.length}</strong><span>aprovados</span></div></div>
        <div class="launch-check-list">${LAUNCH_CHECKLIST.map((item,index)=>this.checkItemMarkup(item,index)).join('')}</div>
        <div class="checklist-actions"><button class="button secondary" data-action="reset-checklist">Reiniciar testes</button><button class="button primary" data-action="start-launch" ${ready?'':'disabled'}>Iniciar contagem regressiva</button></div>
      </section>
      <aside class="checklist-side"><section class="panel glass"><span class="eyebrow">Estado de prontidão</span><div class="readiness-ring" style="--progress:${passed/LAUNCH_CHECKLIST.length*360}deg"><strong>${Math.round(passed/LAUNCH_CHECKLIST.length*100)}%</strong></div><p class="panel-subtitle">A ignição permanece bloqueada enquanto houver dependências não verificadas.</p></section><section class="panel glass"><span class="eyebrow">Conceito DS</span><h3>Fail-safe por padrão</h3><p class="panel-subtitle">Um sistema crítico deve iniciar no estado mais seguro e liberar ações perigosas somente após validações explícitas.</p></section></aside>
    </div>`;
  }
  checkItemMarkup(item,index){
    const result=this.checklist.get(item.id);const priorOk=index===0||this.checklist.get(LAUNCH_CHECKLIST[index-1].id)?.ok;
    return`<article class="launch-check-item ${result?.ok?'ok':result?'fail':''}"><div class="check-index">${String(index+1).padStart(2,'0')}</div><div><b>${escapeHtml(item.label)}</b><span>${escapeHtml(item.subsystem)} · ${escapeHtml(item.detail)}</span>${result?`<small>${escapeHtml(result.message)}</small>`:''}</div><button class="button small ${result?.ok?'secondary':'primary'}" data-action="run-check" data-check="${item.id}" ${priorOk?'':'disabled'}>${result?.ok?'Aprovado':'Executar teste'}</button></article>`;
  }
  flightMarkup(){
    const t=this.telemetry??{state:'PRELAUNCH',altitudeM:0,velocityMs:0,dynamicPressurePa:0,accelerationG:0,stage:1,throttle:0,massKg:this.summary.liftOffMassKg,linkPercent:100,countdown:10,elapsed:0,firstPropellantKg:this.summary.firstUsablePropellant,upperPropellantKg:this.summary.upperUsablePropellant};
    return`<div class="launch-flight-layout">
      <section class="flight-visual glass"><canvas id="rocket-scene-canvas" aria-label="Simulação visual do lançamento"></canvas><div class="flight-hud-top"><span id="flight-state-label">${escapeHtml(LAUNCH_STATE_LABELS[t.state]??t.state)}</span><strong id="countdown-label">${t.state==='COUNTDOWN'?`T− ${t.countdown.toFixed(1)}`:`T+ ${format(t.elapsed,1)} s`}</strong></div><div class="flight-hud-bottom"><span>ESTÁGIO <b id="hud-stage">${t.stage}</b></span><span>THROTTLE <b id="hud-throttle">${format(t.throttle*100)}%</b></span><span>LINK <b id="hud-link">${format(t.linkPercent)}%</b></span></div></section>
      <aside class="flight-telemetry panel glass"><span class="eyebrow">Telemetria</span><div class="flight-metric-grid">${this.flightMetric('altitude','Altitude',`${format(t.reportedAltitudeM/1000,1)} km`)}${this.flightMetric('velocity','Velocidade',`${format(t.velocityMs)} m/s`)}${this.flightMetric('q','Pressão dinâmica',`${format(t.dynamicPressurePa/1000,1)} kPa`)}${this.flightMetric('acceleration','Aceleração',`${format(t.accelerationG,2)} g`)}${this.flightMetric('mass','Massa',`${format(t.massKg/1000,1)} t`)}${this.flightMetric('range','Distância',`${format(t.downrangeM/1000,1)} km`)}</div><canvas id="flight-chart" class="flight-chart" width="520" height="190"></canvas><div class="flight-controls"><button class="button small primary" data-action="flight-resume">Continuar</button><button class="button small secondary" data-action="flight-pause">Pausar</button><button class="button small secondary" data-action="flight-reset">Reiniciar</button><button class="button small danger" data-action="flight-abort">Abortar</button></div><div class="speed-buttons launch-speed">${[1,3,6].map(value=>`<button class="${this.speed===value?'active':''}" data-action="flight-speed" data-speed="${value}">${value}×</button>`).join('')}</div></aside>
      <section class="panel glass flight-state-panel"><span class="eyebrow">Máquina de estados</span><div class="launch-state-rail">${['PRELAUNCH','COUNTDOWN','IGNITION','ASCENT_STAGE_1','MAX_Q','STAGE_SEPARATION','ASCENT_STAGE_2','ORBIT_INSERTION','ORBIT'].map(state=>`<span data-flight-state="${state}" class="${state===t.state?'active':''}">${escapeHtml(LAUNCH_STATE_LABELS[state])}</span>`).join('')}</div></section>
      <section class="panel glass flight-fault-panel"><span class="eyebrow">Laboratório de falhas</span><p class="panel-subtitle">Injete uma anomalia durante a subida e selecione o procedimento coerente.</p><div class="fault-card-grid">${LAUNCH_FAULTS.map(fault=>`<button data-action="inject-launch-fault" data-fault="${fault.id}" ${['PRELAUNCH','COUNTDOWN','ORBIT','FAILED','ABORTED'].includes(t.state)?'disabled':''}><b>${escapeHtml(fault.label)}</b><span>${escapeHtml(fault.trigger)}</span></button>`).join('')}</div>${this.faultResolutionMarkup()}</section>
      <section class="panel glass flight-log-panel"><div class="section-head"><div><span class="eyebrow">Eventos de missão</span><h3>Log operacional</h3></div><span>${this.logs.length} eventos</span></div><div id="launch-log-list" class="launch-log-list">${this.logMarkup()}</div></section>
      <section class="panel glass launch-cert-panel">${this.certificationMarkup()}</section>
    </div>`;
  }
  faultResolutionMarkup(){
    if(!this.activeFault)return'';const fault=LAUNCH_FAULTS.find(item=>item.id===this.activeFault);if(!fault)return'';
    return`<div class="fault-resolution"><b>${escapeHtml(fault.label)}</b><span>${escapeHtml(fault.concept)}</span><div>${fault.options.map(option=>`<button class="button small secondary" data-action="resolve-launch-fault" data-fault="${fault.id}" data-solution="${option.id}">${escapeHtml(option.label)}</button>`).join('')}</div>${this.faultFeedback?`<p>${escapeHtml(this.faultFeedback)}</p>`:''}</div>`;
  }
  systemsMarkup(){
    const completed=this.context.profileStore.active().completedExperiences.filter(id=>id.startsWith('launch-'));
    return`<div class="launch-systems-grid">
      <section class="panel glass"><span class="eyebrow">Pipeline do sistema</span><h2>Do requisito ao atuador</h2><div class="software-pipeline"><article><b>01</b><span>Missão<small>Requisitos, carga e órbita</small></span></article><i>→</i><article><b>02</b><span>Validador<small>Massa, Δv e margens</small></span></article><i>→</i><article><b>03</b><span>Máquina de estados<small>Intertravamentos e abortagem</small></span></article><i>→</i><article><b>04</b><span>Worker físico<small>Empuxo, arrasto e consumo</small></span></article><i>→</i><article><b>05</b><span>Renderizador<small>Shader e HUD adaptativos</small></span></article></div></section>
      <section class="panel glass"><span class="eyebrow">Linguagens contextualizadas</span><div class="launch-language-grid"><article><b>C/C++</b><span>Controle embarcado, drivers e rotinas determinísticas.</span></article><article><b>Python</b><span>Análise de missão, testes, ciência e automação.</span></article><article><b>TypeScript</b><span>Portal, validações, Worker e interfaces do simulador.</span></article><article><b>GLSL</b><span>Materiais, iluminação, exaustão e visualização procedural.</span></article><article><b>SQL/telemetria</b><span>Histórico, séries temporais, auditoria e replay.</span></article></div></section>
      <section class="panel glass"><span class="eyebrow">Separação de responsabilidades</span><pre class="architecture-code">RocketSystem       → requisitos e configuração serializável
RocketFlightModel  → física e estados sem DOM
launch.worker.js   → processamento assíncrono
LaunchModule       → interação e progressão
RocketSceneRenderer→ WebGL2/GLSL e fallback 2D</pre></section>
      <section class="panel glass"><span class="eyebrow">Progresso da fase</span><h3>${completed.length} experiências registradas</h3><div class="phase-completion-list">${['launch-builder','launch-checklist','launch-flight','launch-fault-engine-loss','launch-fault-sensor-drift','launch-fault-max-q','launch-fault-link-loss','launch-certification'].map(id=>`<span class="${completed.includes(id)?'ok':''}">${completed.includes(id)?'✓':'○'} ${escapeHtml(id.replace('launch-','').replaceAll('-',' '))}</span>`).join('')}</div></section>
    </div>`;
  }
  selectMarkup(key,label,items,selected){return`<label class="rocket-field"><span>${escapeHtml(label)}</span><select data-builder-key="${key}">${items.map(item=>`<option value="${item.id}" ${item.id===selected?'selected':''}>${escapeHtml(item.label)}</option>`).join('')}</select></label>`;}
  specRow(label,value){return`<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`;}
  metric(label,value,small){return`<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(small)}</small></article>`;}
  flightMetric(id,label,value){return`<article><span>${escapeHtml(label)}</span><strong id="flight-${id}">${escapeHtml(value)}</strong></article>`;}
  handleClick(event){
    const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='launch-tab'){this.activeTab=target.dataset.tab;this.render();}
    if(action==='rocket-camera-reset')this.renderer?.resetCamera();
    if(action==='validate-rocket')this.registerBuilder();
    if(action==='run-check')this.runChecklistItem(target.dataset.check);
    if(action==='reset-checklist'){this.checklist.clear();this.render();}
    if(action==='start-launch')this.startLaunch();
    if(action==='flight-pause')this.pauseFlight();
    if(action==='flight-resume')this.resumeFlight();
    if(action==='flight-reset')this.resetFlight();
    if(action==='flight-abort')this.abortFlight();
    if(action==='flight-speed'){this.speed=Number(target.dataset.speed)||1;this.worker?.postMessage({type:'speed',payload:{speed:this.speed}});this.render();}
    if(action==='inject-launch-fault')this.injectFault(target.dataset.fault);
    if(action==='resolve-launch-fault')this.resolveFault(target.dataset.fault,target.dataset.solution);
    if(action==='launch-certify')this.certify();
  }
  handleChange(event){
    const field=event.target.closest('[data-builder-key]');if(!field)return;const key=field.dataset.builderKey;const value=field.type==='checkbox'?field.checked:field.value;
    this.rocket.set(key,key==='reservePercent'?Number(value):value);this.summary=this.rocket.summary();this.checklist.clear();this.configureFlight();this.render();
  }
  registerBuilder(){
    if(!this.summary.validation.ok)return;const awarded=this.context.profileStore.addXp(320,'launch-builder');this.context.toast(awarded?'Projeto do veículo registrado: +320 XP.':'Projeto já registrado para este perfil.');this.render();
  }
  runChecklistItem(id){
    const index=LAUNCH_CHECKLIST.findIndex(item=>item.id===id);if(index<0)return;if(index>0&&!this.checklist.get(LAUNCH_CHECKLIST[index-1].id)?.ok){this.context.toast('Execute os testes na ordem.');return;}
    const s=this.summary;let ok=false,message='';
    if(id==='mission'){ok=s.validation.ok;message=ok?'Missão, carga e órbita possuem margens válidas.':'O construtor ainda apresenta incompatibilidades.';}
    if(id==='structure'){ok=s.payload.massKg<=s.structuralLimit;message=ok?'Estrutura e coifa suportam a carga.':'Limite estrutural excedido.';}
    if(id==='propulsion'){ok=s.twr>=1.18&&s.deltaVMargin>=0;message=ok?'Empuxo e Δv liberados.':'Revise estágio, massa ou reserva.';}
    if(id==='guidance'){ok=s.guidance.reliability>=.95;message=ok?'Redundância de software aprovada.':'Selecione GNC redundante duplo ou tolerante a falhas.';}
    if(id==='telemetry'){ok=s.payload.dataMbps<1300;message='Pacotes, relógio e canal de dados sincronizados.';}
    if(id==='range'){ok=!(s.mission.id==='polar-observer'&&!['polar','alcantara'].includes(s.site.id));message=ok?'Corredor de voo compatível.':'Selecione uma base adequada à órbita polar.';}
    if(id==='weather'){ok=s.site.weatherRisk<.24;message=ok?'Janela meteorológica didática aceita.':'Risco meteorológico acima do limite.';}
    if(id==='power'){ok=s.guidance.redundancy>=2;message=ok?'Barramentos críticos e baterias estáveis.':'Aviônica sem redundância suficiente.';}
    this.checklist.set(id,{ok,message});
    if([...this.checklist.values()].filter(item=>item.ok).length===LAUNCH_CHECKLIST.length){const awarded=this.context.profileStore.addXp(220,'launch-checklist');this.context.toast(awarded?'Checklist concluído: +220 XP.':'Checklist já concluído anteriormente.');}
    this.render();
  }
  startLaunch(){
    const passed=LAUNCH_CHECKLIST.every(item=>this.checklist.get(item.id)?.ok);if(!passed||!this.summary.validation.ok){this.context.toast('Conclua todos os intertravamentos antes da ignição.');return;}
    this.activeTab='flight';this.flightSamples=[];this.logs=[];this.telemetry=null;this.activeFault=null;this.faultFeedback='';this.running=true;this.configureFlight();
    if(this.worker){this.worker.postMessage({type:'speed',payload:{speed:this.speed}});this.worker.postMessage({type:'start'});}else{this.fallbackModel.start();this.startFallback();}
    this.render();
  }
  pauseFlight(){this.running=false;if(this.worker)this.worker.postMessage({type:'pause'});else clearInterval(this.fallbackTimer);this.context.toast('Simulação pausada.');}
  resumeFlight(){
    if(!this.telemetry||this.telemetry.state==='PRELAUNCH'){this.startLaunch();return;}if(['ORBIT','FAILED','ABORTED'].includes(this.telemetry.state))return;
    this.running=true;if(this.worker)this.worker.postMessage({type:'resume'});else this.startFallback();
  }
  resetFlight(){
    this.running=false;clearInterval(this.fallbackTimer);this.flightSamples=[];this.logs=[];this.activeFault=null;this.faultFeedback='';
    if(this.worker)this.worker.postMessage({type:'reset',payload:{config:this.summary.flightConfig}});else this.fallbackModel.reset(this.summary.flightConfig);
    this.telemetry=null;this.render();
  }
  abortFlight(){
    if(this.worker)this.worker.postMessage({type:'abort',payload:{reason:'Abortagem manual comandada pelo operador.'}});else{const telemetry=this.fallbackModel.abort('Abortagem manual comandada pelo operador.')&&this.fallbackModel.telemetry();if(telemetry){this.receiveTelemetry(telemetry);this.completeFlight(telemetry);}}
  }
  injectFault(id){
    this.activeFault=id;this.faultFeedback='Selecione um procedimento.';if(this.worker)this.worker.postMessage({type:'fault',payload:{id}});else this.fallbackModel.injectFault(id);this.render();
  }
  resolveFault(id,solution){
    const fault=LAUNCH_FAULTS.find(item=>item.id===id);if(!fault)return;
    if(solution!==fault.answer){this.faultFeedback='Procedimento inadequado. Analise redundância, estados e envelope de voo.';this.context.toast('A resolução não protege o sistema.');this.render();return;}
    if(this.worker)this.worker.postMessage({type:'resolve',payload:{id,solution}});else this.fallbackModel.resolveFault(id,solution);
    const awarded=this.context.profileStore.addXp(fault.xp,`launch-fault-${id}`);this.faultFeedback=`Falha estabilizada por ${fault.concept}.`;this.context.toast(awarded?`Falha resolvida: +${fault.xp} XP.`:'Falha já registrada anteriormente.');this.render();
  }
  completeFlight(telemetry){
    this.running=false;if(telemetry.state==='ORBIT'){const awarded=this.context.profileStore.addXp(480,'launch-flight');this.context.toast(awarded?'Inserção orbital concluída: +480 XP.':'Missão orbital já concluída anteriormente.');}else if(telemetry.state==='FAILED')this.context.toast('A missão falhou. Analise configuração, falhas e telemetria.');else if(telemetry.state==='ABORTED')this.context.toast('Missão encerrada em estado seguro.');
    this.render();
  }
  certify(){
    const profile=this.context.profileStore.active();const base=['launch-builder','launch-checklist','launch-flight'].every(id=>profile.completedExperiences.includes(id));const faults=profile.completedExperiences.filter(id=>id.startsWith('launch-fault-')).length;
    if(!base||faults<2){this.context.toast('Conclua projeto, checklist, órbita e pelo menos duas recuperações de falha.');return;}
    const awarded=this.context.profileStore.addXp(300,'launch-certification');this.certified=true;this.context.toast(awarded?'Certificação de Lançamento DS: +300 XP.':'Certificação já registrada.');this.render();
  }
  certificationMarkup(){
    const profile=this.context.profileStore.active();const base=['launch-builder','launch-checklist','launch-flight'].filter(id=>profile.completedExperiences.includes(id)).length;const faults=profile.completedExperiences.filter(id=>id.startsWith('launch-fault-')).length;const ready=base===3&&faults>=2;
    return`<span class="eyebrow">Certificação da fase</span><h3>${this.certified?'Engenheiro de Lançamento DS':'Critérios de conclusão'}</h3><div class="certification-criteria"><span class="${base>=1?'ok':''}">Projeto validado</span><span class="${base>=2?'ok':''}">Checklist concluído</span><span class="${base>=3?'ok':''}">Órbita alcançada</span><span class="${faults>=2?'ok':''}">${faults}/2 falhas recuperadas</span></div><button class="button primary" data-action="launch-certify" ${ready?'':'disabled'}>${this.certified?'Certificação registrada':'Concluir certificação · 300 XP'}</button>`;
  }
  updateFlightDom(){
    const t=this.telemetry;if(!t||this.activeTab!=='flight')return;
    const set=(id,value)=>{const el=this.container.querySelector(id);if(el)el.textContent=value;};
    set('#flight-state-label',LAUNCH_STATE_LABELS[t.state]??t.state);set('#countdown-label',t.state==='COUNTDOWN'?`T− ${t.countdown.toFixed(1)}`:`T+ ${format(t.elapsed,1)} s`);set('#hud-stage',t.stage);set('#hud-throttle',`${format(t.throttle*100)}%`);set('#hud-link',`${format(t.linkPercent)}%`);
    set('#flight-altitude',`${format(t.reportedAltitudeM/1000,1)} km`);set('#flight-velocity',`${format(t.velocityMs)} m/s`);set('#flight-q',`${format(t.dynamicPressurePa/1000,1)} kPa`);set('#flight-acceleration',`${format(t.accelerationG,2)} g`);set('#flight-mass',`${format(t.massKg/1000,1)} t`);set('#flight-range',`${format(t.downrangeM/1000,1)} km`);
    this.container.querySelectorAll('[data-flight-state]').forEach(el=>el.classList.toggle('active',el.dataset.flightState===t.state));this.drawFlightChart();
  }
  updateLogDom(){const el=this.container?.querySelector('#launch-log-list');if(el)el.innerHTML=this.logMarkup();}
  logMarkup(){return this.logs.length?this.logs.map(item=>`<article><time>${format(item.time,1)}s</time><b>${escapeHtml(item.type)}</b><span>${escapeHtml(item.message)}</span></article>`).join(''):'<p class="panel-subtitle">Aguardando eventos de missão.</p>';}
  drawFlightChart(){
    const canvas=this.container?.querySelector('#flight-chart');if(!canvas||!this.flightSamples.length)return;const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#020713';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(100,180,220,.15)';ctx.lineWidth=1;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,h*i/5);ctx.lineTo(w,h*i/5);ctx.stroke();}
    const maxAlt=Math.max(1000,...this.flightSamples.map(s=>s.altitudeM));const maxVel=Math.max(500,...this.flightSamples.map(s=>s.velocityMs));const draw=(getter,max,stroke)=>{ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.beginPath();this.flightSamples.forEach((sample,index)=>{const x=index/Math.max(1,this.flightSamples.length-1)*w,y=h-clamp(getter(sample)/max,0,1)*(h-16)-8;if(index===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();};draw(s=>s.altitudeM,maxAlt,'#55dcff');draw(s=>s.velocityMs,maxVel,'#ffcf5a');ctx.font='12px ui-monospace';ctx.fillStyle='#55dcff';ctx.fillText('ALTITUDE',10,18);ctx.fillStyle='#ffcf5a';ctx.fillText('VELOCIDADE',100,18);
  }
}

export const createModule=()=>new LaunchModule();

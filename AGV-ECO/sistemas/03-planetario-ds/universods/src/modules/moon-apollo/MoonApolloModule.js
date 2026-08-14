import { ApolloComputer } from '../../core/lunar/ApolloComputer.js';
import { LunarDescentModel } from '../../core/lunar/LunarDescentModel.js';
import { SurfaceMissionModel } from '../../core/lunar/SurfaceMissionModel.js';
import { LunarSceneRenderer } from '../../rendering/LunarSceneRenderer.js';
import {
  APOLLO_TIMELINE,AGC_SPEC,APOLLO_TASKS,ASSEMBLY_INSTRUCTIONS,ASSEMBLY_CHALLENGES,LANDING_SITES,
  LUNAR_CHECKLIST,APOLLO_ALARMS,SURFACE_OBJECTIVES,LUNAR_STATE_LABELS
} from '../../data/lunarSystems.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const format=(value,digits=0)=>Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:digits,minimumFractionDigits:digits});
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const normalize=line=>line.trim().replace(/\s+/g,' ').toUpperCase();

const ASSEMBLY_TEMPLATES={
  'descent-brake':`READ ALT ALT\nCMP ALT 1500\nJLT BRAKE\nEND\nBRAKE:\nSET THROTTLE 58\nEND`,
  'fuel-guard':`READ FUEL FUEL\nCMP FUEL 12\nJLT LOWFUEL\nEND\nLOWFUEL:\nALARM 0901\nSET MODE ABORT\nEND`,
  'hazard-avoid':`READ HAZARD HAZARD\nCMP HAZARD 60\nJGT AVOID\nEND\nAVOID:\nSET PITCH 18\nEND`
};

class MoonApolloModule{
  constructor(){
    this.container=null;this.context=null;this.activeTab='history';this.selectedTimeline='apollo-11';
    this.computer=new ApolloComputer();this.surface=new SurfaceMissionModel();this.checklist=new Map();this.siteId='tranquility';this.assist=true;
    this.assemblyChallenge='descent-brake';this.assemblySource=ASSEMBLY_TEMPLATES[this.assemblyChallenge];this.assemblyResult=null;this.computerFeedback='';
    this.worker=null;this.fallbackModel=null;this.fallbackTimer=null;this.renderer=null;this.telemetry=null;this.flightSamples=[];this.flightLogs=[];this.running=false;this.speed=1;
    this.activeAlarm=null;this.alarmFeedback='';this.historyFeedback='';this.certified=false;
    this.onClick=e=>this.handleClick(e);this.onChange=e=>this.handleChange(e);this.onInput=e=>this.handleInput(e);
  }
  mount(container,context){
    this.container=container;this.context=context;this.certified=context.profileStore.hasCompleted('lunar-certification');
    container.addEventListener('click',this.onClick);container.addEventListener('change',this.onChange);container.addEventListener('input',this.onInput);
    this.createWorker();this.configureDescent();this.render();
  }
  unmount(){
    this.renderer?.destroy();this.worker?.postMessage({type:'stop'});this.worker?.terminate();clearInterval(this.fallbackTimer);
    this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('change',this.onChange);this.container?.removeEventListener('input',this.onInput);
  }
  createWorker(){
    if(!('Worker'in globalThis))return;
    try{
      this.worker=new Worker(new URL('../../workers/lunar.worker.js',import.meta.url),{type:'module'});
      this.worker.addEventListener('message',event=>this.handleWorkerMessage(event.data));
      this.worker.addEventListener('error',()=>{this.worker?.terminate();this.worker=null;this.fallbackModel=new LunarDescentModel({siteId:this.siteId,assist:this.assist});this.context.toast('Worker lunar indisponível; simulação local ativada.');if(this.running){this.fallbackModel.start();this.startFallback();}});
      this.worker.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});
    }catch(error){console.warn(error);this.worker=null;}
  }
  configureDescent(){
    const config={siteId:this.siteId,assist:this.assist,computerMode:'priority'};
    if(this.worker)this.worker.postMessage({type:'configure',payload:config});
    else this.fallbackModel=new LunarDescentModel(config);
    this.telemetry=this.fallbackModel?.telemetry()??this.telemetry;
  }
  handleWorkerMessage(message){
    if(message.type==='telemetry')this.receiveTelemetry(message.payload);
    if(message.type==='events')message.payload.forEach(event=>this.addFlightLog(event));
    if(message.type==='complete'){this.receiveTelemetry(message.payload);this.completeDescent(message.payload);}
  }
  receiveTelemetry(payload){
    this.telemetry=payload;if(Math.round(payload.elapsed*10)%3===0){this.flightSamples.push(payload);if(this.flightSamples.length>180)this.flightSamples.shift();}
    this.renderer?.setTelemetry(payload);this.syncComputerSensors(payload);this.updateDescentDom();
  }
  syncComputerSensors(payload){
    this.computer.updateSensors({ALT:payload.reportedAltitudeM,VSPD:Math.abs(payload.verticalSpeedMs),HSPD:payload.horizontalSpeedMs,FUEL:payload.fuelPercent,HAZARD:payload.hazard});
    if(payload.computerLoad>100&&!this.activeAlarm){this.computer.injectRendezvousRadar();const result=this.computer.schedule();this.activeAlarm=result.alarm?.code??'1202';}
  }
  addFlightLog(event){this.flightLogs.unshift({time:event.time??this.telemetry?.elapsed??0,type:event.type??'INFO',message:event.message??String(event)});if(this.flightLogs.length>42)this.flightLogs.pop();this.updateFlightLogDom();}
  startFallback(){
    clearInterval(this.fallbackTimer);this.running=true;const interval=this.context.settingsStore.getProfile().id==='performance'?180:110;
    this.fallbackTimer=setInterval(()=>{const telemetry=this.fallbackModel.step(interval/1000*this.speed);this.receiveTelemetry(telemetry);this.fallbackModel.drainEvents().forEach(event=>this.addFlightLog(event));if(['LANDED','CRASHED','ABORTED'].includes(telemetry.state)){clearInterval(this.fallbackTimer);this.running=false;this.completeDescent(telemetry);}},interval);
  }
  render(){
    this.renderer?.destroy();this.renderer=null;
    const site=LANDING_SITES.find(item=>item.id===this.siteId)??LANDING_SITES[0];
    this.container.innerHTML=`
      <section class="moon-module" style="--moon-risk:${site.hazard/100}">
        <header class="module-hero moon-hero glass">
          <div><span class="eyebrow">Fase 6 · Lua e Apollo</span><h2>Software de tempo real em uma missão lunar completa</h2><p>Explore o programa Apollo, programe um computador didático, gerencie prioridades, execute a descida e conclua uma missão científica na superfície.</p></div>
          <div class="moon-hero-status"><span>${escapeHtml(site.label)}</span><strong>${this.certified?'CERTIFICAÇÃO CONCLUÍDA':'MISSÃO EM PREPARAÇÃO'}</strong><small>${AGC_SPEC.erasableWords.toLocaleString('pt-BR')} palavras apagáveis no modelo didático</small></div>
        </header>
        <nav class="module-tabs moon-tabs" aria-label="Estações da Fase 6">
          ${this.tabButton('history','⌛ Apollo')}${this.tabButton('computer','⌨ Computador')}${this.tabButton('descent','◐ Descida')}${this.tabButton('surface','⚑ Superfície')}${this.tabButton('systems','</> Sistemas DS')}
        </nav>
        <div class="moon-tab-host">${this.tabMarkup()}</div>
      </section>`;
    queueMicrotask(()=>this.afterRender());
  }
  tabButton(id,label){return`<button class="module-tab ${this.activeTab===id?'active':''}" data-action="moon-tab" data-tab="${id}">${label}</button>`;}
  tabMarkup(){if(this.activeTab==='computer')return this.computerMarkup();if(this.activeTab==='descent')return this.descentMarkup();if(this.activeTab==='surface')return this.surfaceMarkup();if(this.activeTab==='systems')return this.systemsMarkup();return this.historyMarkup();}
  afterRender(){
    const canvas=this.container.querySelector('#lunar-scene-canvas');if(canvas){this.renderer=new LunarSceneRenderer(canvas,this.context.settingsStore);this.renderer.setMode(this.activeTab==='surface'?'surface':'descent');const site=LANDING_SITES.find(item=>item.id===this.siteId);this.renderer.setRisk(site?.hazard??0);if(this.telemetry)this.renderer.setTelemetry(this.telemetry);this.renderer.start();}
    if(this.activeTab==='descent'){this.updateDescentDom();this.drawDescentChart();}
  }
  historyMarkup(){
    const selected=APOLLO_TIMELINE.find(item=>item.id===this.selectedTimeline)??APOLLO_TIMELINE[0];
    return`<div class="apollo-history-layout">
      <section class="panel glass apollo-timeline-panel"><div class="section-head"><div><span class="eyebrow">1967–1972</span><h2>Programa Apollo por sistemas</h2></div><span class="tag">${APOLLO_TIMELINE.length} marcos</span></div><div class="apollo-timeline">${APOLLO_TIMELINE.map(item=>`<button class="apollo-node ${item.id===selected.id?'active':''}" data-action="select-apollo" data-id="${item.id}"><b>${item.year}</b><span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.type)}</small></button>`).join('')}</div></section>
      <aside class="apollo-detail-stack">
        <section class="panel glass apollo-detail"><span class="eyebrow">${selected.year} · ${escapeHtml(selected.type)}</span><h2>${escapeHtml(selected.label)}</h2><p>${escapeHtml(selected.summary)}</p><div class="ds-connection"><b>Conexão com DS</b><span>${escapeHtml(selected.dsLink)}</span></div><a class="button small secondary" href="${selected.source}" target="_blank" rel="noopener">Fonte oficial ↗</a></section>
        <section class="panel glass"><span class="eyebrow">Desafio de sequência</span><h3>Do ensaio ao pouso</h3><p class="panel-subtitle">Organize as missões que validaram a órbita lunar, o ensaio geral e o primeiro pouso.</p><div class="history-order-grid">
          ${this.orderSelect('history-first','1º marco',0)}${this.orderSelect('history-second','2º marco',1)}${this.orderSelect('history-third','3º marco',2)}
        </div><button class="button primary" data-action="validate-apollo-order">Validar sequência</button>${this.historyFeedback?`<p class="inline-feedback">${escapeHtml(this.historyFeedback)}</p>`:''}</section>
        <section class="panel glass"><span class="eyebrow">Arquitetura da espaçonave</span><div class="apollo-architecture"><article><b>CM</b><span>Comando, tripulação e retorno</span></article><article><b>SM</b><span>Propulsão, energia e suporte</span></article><article><b>LM</b><span>Descida, superfície e ascensão</span></article></div></section>
      </aside>
    </div>`;
  }
  orderSelect(id,label,index){const defaultValues=['apollo-8','apollo-10','apollo-11'];return`<label class="moon-field"><span>${label}</span><select id="${id}">${APOLLO_TIMELINE.filter(item=>['apollo-8','apollo-9','apollo-10','apollo-11','apollo-13'].includes(item.id)).map(item=>`<option value="${item.id}" ${item.id===defaultValues[index]?'selected':''}>${item.label}</option>`).join('')}</select></label>`;}
  computerMarkup(){
    const snapshot=this.computer.snapshot(),memory=snapshot.memory,challenge=ASSEMBLY_CHALLENGES.find(item=>item.id===this.assemblyChallenge)??ASSEMBLY_CHALLENGES[0];
    return`<div class="agc-layout">
      <section class="panel glass agc-console"><div class="section-head"><div><span class="eyebrow">AGC didático</span><h2>Escalonamento por prioridade</h2></div><span class="validation-chip ${snapshot.dropped.length?'warn':'ok'}">${snapshot.dropped.length?'CARGA ELEVADA':'ESTÁVEL'}</span></div>
        <div class="dsky"><div class="dsky-display"><span>PROG</span><b>${String(snapshot.tick%100).padStart(2,'0')}</b><span>VERB</span><b>06</b><span>NOUN</span><b>${this.activeAlarm??'62'}</b></div><div class="dsky-status"><i class="${snapshot.dropped.length?'alarm':''}"></i><span>${snapshot.dropped.length?'PROG ALARM':'COMPUTER ACTIVITY'}</span></div></div>
        <div class="agc-metrics">${this.metric('Ciclos',`${snapshot.schedule.reduce((sum,item)=>sum+item.cycles,0)}/${snapshot.cycleBudget}`)}${this.metric('Memória',`${memory.used}/${memory.total}`)}${this.metric('Reinícios',snapshot.restarts)}${this.metric('Alarmes',snapshot.alarms.length)}</div>
        <div class="memory-track"><i style="width:${memory.percent}%"></i></div>
        <div class="agc-task-list">${snapshot.tasks.map(task=>{const running=snapshot.schedule.some(item=>item.id===task.id),dropped=snapshot.dropped.some(item=>item.id===task.id);return`<article class="agc-task ${running?'running':''} ${dropped?'dropped':''}"><header><span>P${task.priority}</span><b>${escapeHtml(task.label)}</b><em>${task.cycles} ciclos</em></header><p>${escapeHtml(task.description)}</p><footer><small>${task.erasableWords} palavras</small><strong>${task.enabled?(running?'EXECUTANDO':dropped?'ADIADA':'PRONTA'):'DESATIVADA'}</strong></footer></article>`;}).join('')}</div>
        <div class="hero-actions"><button class="button primary" data-action="agc-cycle">Executar ciclo</button><button class="button secondary" data-action="agc-overload">Injetar sobrecarga</button><button class="button secondary" data-action="agc-priority-restart" ${snapshot.dropped.length===0?'disabled':''}>Reinício prioritário</button><button class="button danger" data-action="agc-reset">Redefinir</button></div>${this.computerFeedback?`<p class="inline-feedback">${escapeHtml(this.computerFeedback)}</p>`:''}
      </section>
      <section class="panel glass assembly-lab"><div class="section-head"><div><span class="eyebrow">Assembly simplificado</span><h2>Programa de descida</h2></div><span class="tag">${challenge.xp} XP</span></div>
        <label class="moon-field"><span>Desafio</span><select data-key="assembly-challenge">${ASSEMBLY_CHALLENGES.map(item=>`<option value="${item.id}" ${item.id===challenge.id?'selected':''}>${item.label}</option>`).join('')}</select></label><p class="panel-subtitle">${escapeHtml(challenge.prompt)}</p>
        <textarea class="assembly-editor" data-key="assembly-source" spellcheck="false">${escapeHtml(this.assemblySource)}</textarea>
        <div class="hero-actions"><button class="button secondary" data-action="load-assembly-template">Carregar modelo</button><button class="button primary" data-action="run-assembly">Validar e executar</button></div>
        ${this.assemblyResult?this.assemblyResultMarkup(this.assemblyResult):''}
        <details class="instruction-reference"><summary>Referência de instruções</summary><div>${ASSEMBLY_INSTRUCTIONS.map(item=>`<article><code>${item.mnemonic} ${item.args}</code><span>${escapeHtml(item.description)}</span><small>${item.cost} ciclos</small></article>`).join('')}</div></details>
      </section>
      <section class="panel glass alarm-lab"><span class="eyebrow">Alarmes de programa</span><h2>1201 e 1202</h2><p class="panel-subtitle">A atividade reproduz o conceito de sobrecarga e recuperação por prioridade; não é uma emulação histórica completa.</p>${APOLLO_ALARMS.map(alarm=>`<article class="alarm-scenario"><header><b>${alarm.label}</b><span>${escapeHtml(alarm.cause)}</span></header><div>${alarm.options.map(option=>`<button class="button small secondary" data-action="answer-apollo-alarm" data-alarm="${alarm.id}" data-answer="${option.id}">${escapeHtml(option.label)}</button>`).join('')}</div></article>`).join('')}${this.alarmFeedback?`<p class="inline-feedback">${escapeHtml(this.alarmFeedback)}</p>`:''}</section>
    </div>`;
  }
  assemblyResultMarkup(result){return`<div class="assembly-result ${result.ok?'ok':'warn'}"><header><b>${result.ok?'Programa válido':'Correções necessárias'}</b><span>${result.cost??0} ciclos · ${result.words??0} palavras</span></header>${result.errors?.length?`<ul>${result.errors.map(error=>`<li>${escapeHtml(error)}</li>`).join('')}</ul>`:`<div class="register-grid">${Object.entries(result.registers??{}).slice(0,8).map(([key,value])=>`<span><b>${key}</b>${escapeHtml(value)}</span>`).join('')}</div><p>Atuadores: ${Object.entries(result.actuators??{}).map(([key,value])=>`${key}=${value}`).join(' · ')}</p>`}</div>`;}
  descentMarkup(){
    const t=this.telemetry??new LunarDescentModel({siteId:this.siteId,assist:this.assist}).telemetry();const site=LANDING_SITES.find(item=>item.id===this.siteId)??LANDING_SITES[0];const ready=this.checklist.size===LUNAR_CHECKLIST.length;
    return`<div class="lunar-descent-layout">
      <section class="lunar-stage glass"><canvas id="lunar-scene-canvas" aria-label="Superfície lunar e módulo de descida procedural"></canvas><div class="rocket-stage-overlay"><span>ARRASTE PARA GIRAR · ROLE PARA ZOOM</span><button class="button small secondary" data-action="lunar-camera-reset">Redefinir câmera</button></div><div class="lunar-stage-hud"><span>${escapeHtml(LUNAR_STATE_LABELS[t.state]??t.state)}</span><strong id="lunar-stage-alt">${format(t.altitudeM)} m</strong><small>${escapeHtml(site.label)}</small></div></section>
      <aside class="lunar-control-stack">
        <section class="panel glass"><div class="section-head"><div><span class="eyebrow">Perfil de pouso</span><h3>Local e assistência</h3></div><span class="risk-badge risk-${site.hazard>55?'high':site.hazard>35?'medium':'low'}">Risco ${site.hazard}%</span></div><label class="moon-field"><span>Local</span><select data-key="landing-site" ${this.running?'disabled':''}>${LANDING_SITES.map(item=>`<option value="${item.id}" ${item.id===this.siteId?'selected':''}>${item.label}</option>`).join('')}</select></label><label class="assist-toggle"><input type="checkbox" data-key="landing-assist" ${this.assist?'checked':''} ${this.running?'disabled':''}><span><b>Assistência de pouso</b><small>O aluno ainda controla falhas, estados e decisões.</small></span></label><div class="site-specs">${this.spec('Inclinação',`${site.slope}°`)}${this.spec('Iluminação',`${site.illumination}%`)}${this.spec('Risco',`${site.hazard}%`)}${this.spec('Desvio',`${site.distanceKm} km`)}</div></section>
        <section class="panel glass"><span class="eyebrow">Intertravamentos</span><div class="lunar-checklist">${LUNAR_CHECKLIST.map(item=>`<button class="check-row ${this.checklist.has(item.id)?'done':''}" data-action="toggle-lunar-check" data-id="${item.id}" ${this.running?'disabled':''}><i>${this.checklist.has(item.id)?'✓':'○'}</i><span><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.subsystem)}</small></span></button>`).join('')}</div><div class="check-progress"><i style="width:${this.checklist.size/LUNAR_CHECKLIST.length*100}%"></i></div></section>
      </aside>
      <section class="panel glass lunar-telemetry-panel"><div class="section-head"><div><span class="eyebrow">Telemetria de descida</span><h2>Guidance · Navigation · Control</h2></div><span class="validation-chip ${t.state==='LANDED'?'ok':t.state==='CRASHED'?'warn':''}" id="lunar-state-chip">${escapeHtml(LUNAR_STATE_LABELS[t.state]??t.state)}</span></div>
        <div class="lunar-telemetry-grid">${this.telemetryMetric('lunar-altitude','Altitude',`${format(t.altitudeM)} m`)}${this.telemetryMetric('lunar-vspeed','Velocidade vertical',`${format(t.verticalSpeedMs,1)} m/s`)}${this.telemetryMetric('lunar-hspeed','Velocidade horizontal',`${format(t.horizontalSpeedMs,1)} m/s`)}${this.telemetryMetric('lunar-fuel','Combustível',`${format(t.fuelPercent,1)}%`)}${this.telemetryMetric('lunar-computer','Carga do computador',`${format(t.computerLoad)}%`)}${this.telemetryMetric('lunar-radar','Radar',`${format(t.radarQuality)}%`)}</div>
        <canvas class="flight-chart" id="lunar-flight-chart" width="900" height="230" aria-label="Gráfico de altitude e velocidade lunar"></canvas>
        <div class="lunar-controls"><button class="button primary" data-action="start-lunar-descent" ${!ready||this.running||!['ORBIT','CRASHED','ABORTED','LANDED'].includes(t.state)?'disabled':''}>${t.state==='LANDED'?'Pouso concluído':'Iniciar descida'}</button><button class="button secondary" data-action="pause-lunar-descent" ${!this.running?'disabled':''}>Pausar</button><button class="button secondary" data-action="resume-lunar-descent" ${this.running||!t.elapsed?'disabled':''}>Retomar</button><button class="button danger" data-action="abort-lunar-descent" ${!this.running?'disabled':''}>Abortar</button><label>Velocidade <select data-key="lunar-speed"><option value="1" ${this.speed===1?'selected':''}>1×</option><option value="3" ${this.speed===3?'selected':''}>3×</option><option value="6" ${this.speed===6?'selected':''}>6×</option></select></label></div>
        <div class="manual-controls"><label><span>Throttle</span><input type="range" min="0" max="100" value="${Math.round(t.throttle*100)}" data-key="lunar-throttle"><output id="lunar-throttle-output">${Math.round(t.throttle*100)}%</output></label><label><span>Correção lateral</span><input type="range" min="-25" max="25" value="${Math.round(t.pitchDeg)}" data-key="lunar-pitch"><output id="lunar-pitch-output">${Math.round(t.pitchDeg)}°</output></label></div>
      </section>
      <section class="panel glass lunar-fault-panel"><span class="eyebrow">Falhas operacionais</span><h3>Treinamento de recuperação</h3><div class="fault-buttons"><button class="button small secondary" data-action="inject-lunar-fault" data-fault="radar-noise" ${t.activeFault||!this.running?'disabled':''}>Ruído no radar</button><button class="button small secondary" data-action="inject-lunar-fault" data-fault="computer-overload" ${t.activeFault||!this.running?'disabled':''}>Sobrecarga</button><button class="button small secondary" data-action="inject-lunar-fault" data-fault="fuel-margin" ${t.activeFault||!this.running?'disabled':''}>Margem de combustível</button></div>${t.activeFault?this.faultResolutionMarkup(t.activeFault):'<p class="panel-subtitle">Inicie a descida e injete uma condição para praticar operação degradada.</p>'}</section>
      <section class="panel glass lunar-log-panel"><span class="eyebrow">Registro da missão</span><div class="flight-log" id="lunar-flight-log">${this.flightLogMarkup()}</div></section>
    </div>`;
  }
  faultResolutionMarkup(id){const options={
    'radar-noise':[['cross-check','Comparar radar, inercial e altitude estimada'],['trust-radar','Confiar apenas no canal ruidoso']],
    'computer-overload':[['priority-restart','Preservar tarefas críticas e reiniciar secundárias'],['all-equal','Executar todas as tarefas com mesma prioridade']],
    'fuel-margin':[['safe-site','Selecionar área segura mais próxima'],['continue-long','Manter o desvio longo planejado']]
  }[id]??[];return`<div class="fault-resolution"><b>Condição ativa: ${escapeHtml(id)}</b>${options.map(([action,label])=>`<button class="button small secondary" data-action="resolve-lunar-fault" data-fault="${id}" data-resolution="${action}">${escapeHtml(label)}</button>`).join('')}</div>`;}
  surfaceMarkup(){
    const unlocked=this.telemetry?.state==='LANDED'||this.context.profileStore.hasCompleted('lunar-descent');const snapshot=this.surface.snapshot();
    return`<div class="lunar-surface-layout ${unlocked?'':'locked'}">
      <section class="lunar-stage surface-stage glass"><canvas id="lunar-scene-canvas" aria-label="Ambiente lunar procedural para atividade extraveicular"></canvas><div class="surface-banner"><span>ATIVIDADE EXTRAVEICULAR</span><strong>${unlocked?'SISTEMAS LIBERADOS':'POUSO NECESSÁRIO'}</strong></div><div class="surface-avatar"><i></i><span>ASTRONAUTA DS</span></div></section>
      <aside class="surface-status-stack"><section class="panel glass"><span class="eyebrow">Recursos EVA</span><div class="eva-meters"><label>Energia <span>${snapshot.energy}%</span><i><b style="width:${snapshot.energy}%"></b></i></label><label>Tempo <span>${snapshot.elapsedMinutes} min</span><i><b style="width:${Math.min(100,snapshot.elapsedMinutes/180*100)}%"></b></i></label><label>Progresso <span>${snapshot.completed.length}/${SURFACE_OBJECTIVES.length}</span><i><b style="width:${snapshot.completed.length/SURFACE_OBJECTIVES.length*100}%"></b></i></label></div></section><section class="panel glass"><span class="eyebrow">Inventário científico</span><div class="surface-inventory"><article><b>${snapshot.samples.length}</b><span>Amostras</span></article><article><b>${snapshot.instruments.length}</b><span>Instrumentos</span></article><article><b>${format(snapshot.roverKm,1)} km</b><span>Rover</span></article></div>${snapshot.samples.map(item=>`<div class="sample-chip"><span>${item.id}</span><b>${escapeHtml(item.name)}</b><small>${item.massG} g</small></div>`).join('')||'<p class="panel-subtitle">Nenhuma amostra registrada.</p>'}</section></aside>
      <section class="panel glass surface-objectives"><div class="section-head"><div><span class="eyebrow">Plano de superfície</span><h2>EVA, rover e ciência</h2></div><span class="tag">${SURFACE_OBJECTIVES.reduce((sum,item)=>sum+item.xp,0)} XP</span></div><div class="surface-objective-grid">${SURFACE_OBJECTIVES.map((item,index)=>{const done=snapshot.completed.includes(item.id),next=index===snapshot.completed.length;return`<article class="surface-objective ${done?'done':''} ${next?'current':''}"><header><span>${String(index+1).padStart(2,'0')}</span><b>${escapeHtml(item.label)}</b></header><p>${escapeHtml(item.description)}</p><footer><small>${item.minutes} min · ${item.energy}% energia · ${item.xp} XP</small><button class="button small ${done?'secondary':'primary'}" data-action="complete-surface-objective" data-id="${item.id}" ${!unlocked||done||!next?'disabled':''}>${done?'Concluído':'Executar'}</button></footer></article>`;}).join('')}</div></section>
      <section class="panel glass surface-log"><span class="eyebrow">Diário de campo</span>${snapshot.logs.length?snapshot.logs.map(log=>`<p><time>T+${log.minute} min</time>${escapeHtml(log.message)}</p>`).join(''):'<p class="panel-subtitle">As ações realizadas serão registradas aqui.</p>'}</section>
    </div>`;
  }
  systemsMarkup(){
    const requirements=['apollo-history-sequence','agc-priority-restart','lunar-descent','lunar-surface-complete'];const status=requirements.map(id=>({id,done:this.context.profileStore.hasCompleted(id)}));const ready=status.every(item=>item.done);
    return`<div class="lunar-systems-layout">
      <section class="panel glass"><span class="eyebrow">Arquitetura da missão</span><h2>Camadas independentes e testáveis</h2><div class="architecture-stack lunar-architecture-stack"><article><b>01 · Interface</b><span>DSKY, HUD, controles, acessibilidade e evidências</span><code>DOM + CSS</code></article><article><b>02 · Renderização</b><span>Terreno, módulo, poeira, câmera e shader procedural</span><code>WebGL2 + GLSL</code></article><article><b>03 · Simulação</b><span>Descida, combustível, estados, falhas e dinâmica</span><code>LunarDescentModel</code></article><article><b>04 · Computador</b><span>Memória, tarefas, prioridades, alarmes e Assembly</span><code>ApolloComputer</code></article><article><b>05 · Processamento</b><span>Telemetria fora da thread da interface</span><code>Web Worker</code></article><article><b>06 · Persistência</b><span>XP, certificados e progresso por perfil</span><code>ProfileStore</code></article></div></section>
      <section class="panel glass"><span class="eyebrow">Certificação Fase 6</span><h2>Engenharia de Software Lunar</h2><div class="certification-checks">${status.map(item=>`<article class="${item.done?'done':''}"><i>${item.done?'✓':'○'}</i><span><b>${this.requirementLabel(item.id)}</b><small>${item.done?'Validado':'Pendente'}</small></span></article>`).join('')}</div><button class="button primary" data-action="certify-lunar" ${!ready||this.certified?'disabled':''}>${this.certified?'Certificação concluída':'Emitir certificação · 350 XP'}</button></section>
      <section class="panel glass"><span class="eyebrow">Evidência local</span><h3>Relatório da missão</h3><p class="panel-subtitle">O arquivo JSON registra configurações, resultados e progresso. A geração consolidada em PDF será ampliada na Fase 10.</p><button class="button secondary" data-action="export-lunar-report">Exportar relatório</button></section>
      <section class="panel glass"><span class="eyebrow">Limites da simulação</span><ul class="system-limit-list"><li>O Assembly é uma linguagem didática, não o código real do AGC.</li><li>A física prioriza coerência educacional e estabilidade em navegadores.</li><li>Terreno, módulo e poeira são procedurais e não reproduções métricas.</li><li>Fatos históricos são separados dos componentes fictícios da gamificação.</li></ul></section>
    </div>`;
  }
  requirementLabel(id){return({
    'apollo-history-sequence':'Sequência histórica Apollo','agc-priority-restart':'Recuperação por prioridade','lunar-descent':'Pouso lunar seguro','lunar-surface-complete':'Missão científica de superfície'
  })[id]??id;}
  handleClick(event){
    const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='moon-tab'){this.activeTab=target.dataset.tab;this.render();}
    if(action==='select-apollo'){this.selectedTimeline=target.dataset.id;this.render();}
    if(action==='validate-apollo-order')this.validateHistoryOrder();
    if(action==='agc-cycle'){const result=this.computer.schedule();this.computerFeedback=result.overloaded?`Alarme ${result.alarm?.code}: ${result.dropped.length} tarefa(s) adiada(s).`:`Ciclo concluído com ${result.remaining} ciclos livres.`;this.render();}
    if(action==='agc-overload'){this.computer.injectRendezvousRadar();const result=this.computer.schedule();this.activeAlarm=result.alarm?.code??'1202';this.computerFeedback='Radar de encontro habilitado durante a descida: carga acima do orçamento.';this.render();}
    if(action==='agc-priority-restart'){if(!this.computer.snapshot().dropped.length){this.context.toast('Injete uma sobrecarga antes do reinício prioritário.');return;}const result=this.computer.priorityRestart();const awarded=this.context.profileStore.addXp(220,'agc-priority-restart');this.activeAlarm=null;this.computerFeedback=`Reinício prioritário concluído. ${result.dropped.length} tarefas permanecem adiadas.${awarded?' +220 XP.':''}`;this.render();}
    if(action==='agc-reset'){this.computer.reset();this.activeAlarm=null;this.computerFeedback='Computador didático redefinido.';this.render();}
    if(action==='load-assembly-template'){this.assemblySource=ASSEMBLY_TEMPLATES[this.assemblyChallenge];this.assemblyResult=null;this.render();}
    if(action==='run-assembly')this.runAssembly();
    if(action==='answer-apollo-alarm')this.answerAlarm(target.dataset.alarm,target.dataset.answer);
    if(action==='toggle-lunar-check'){if(this.checklist.has(target.dataset.id))this.checklist.delete(target.dataset.id);else this.checklist.set(target.dataset.id,true);this.render();}
    if(action==='lunar-camera-reset')this.renderer?.resetCamera();
    if(action==='start-lunar-descent')this.startDescent();
    if(action==='pause-lunar-descent'){this.running=false;if(this.worker)this.worker.postMessage({type:'pause'});else clearInterval(this.fallbackTimer);this.updateDescentDom();}
    if(action==='resume-lunar-descent'){this.running=true;if(this.worker)this.worker.postMessage({type:'resume'});else this.startFallback();this.updateDescentDom();}
    if(action==='abort-lunar-descent'){if(this.worker)this.worker.postMessage({type:'abort'});else{this.fallbackModel.abort();this.completeDescent(this.fallbackModel.telemetry());}}
    if(action==='inject-lunar-fault')this.injectFault(target.dataset.fault);
    if(action==='resolve-lunar-fault')this.resolveFault(target.dataset.fault,target.dataset.resolution);
    if(action==='complete-surface-objective')this.completeSurfaceObjective(target.dataset.id);
    if(action==='certify-lunar')this.certify();
    if(action==='export-lunar-report')this.exportReport();
  }
  handleChange(event){
    const key=event.target.dataset.key;if(!key)return;
    if(key==='assembly-challenge'){this.assemblyChallenge=event.target.value;this.assemblySource=ASSEMBLY_TEMPLATES[this.assemblyChallenge];this.assemblyResult=null;this.render();}
    if(key==='landing-site'){this.siteId=event.target.value;this.configureDescent();this.flightSamples=[];this.flightLogs=[];this.render();}
    if(key==='landing-assist'){this.assist=event.target.checked;this.configureDescent();this.render();}
    if(key==='lunar-speed'){this.speed=Number(event.target.value)||1;if(this.worker)this.worker.postMessage({type:'speed',payload:{speed:this.speed}});}
  }
  handleInput(event){
    const key=event.target.dataset.key;if(key==='assembly-source')this.assemblySource=event.target.value;
    if(key==='lunar-throttle'||key==='lunar-pitch'){
      const throttle=Number(this.container.querySelector('[data-key="lunar-throttle"]')?.value??0)/100;const pitch=Number(this.container.querySelector('[data-key="lunar-pitch"]')?.value??0);
      const throttleOutput=this.container.querySelector('#lunar-throttle-output'),pitchOutput=this.container.querySelector('#lunar-pitch-output');if(throttleOutput)throttleOutput.textContent=`${Math.round(throttle*100)}%`;if(pitchOutput)pitchOutput.textContent=`${Math.round(pitch)}°`;
      if(this.worker)this.worker.postMessage({type:'controls',payload:{throttle,pitch,assist:this.assist}});else this.fallbackModel?.setControls({throttle,pitch,assist:this.assist});
    }
  }
  validateHistoryOrder(){
    const values=['history-first','history-second','history-third'].map(id=>this.container.querySelector(`#${id}`)?.value);const correct=['apollo-8','apollo-10','apollo-11'];
    if(values.every((value,index)=>value===correct[index])){const awarded=this.context.profileStore.addXp(180,'apollo-history-sequence');this.historyFeedback=`Sequência correta: órbita lunar → ensaio geral → pouso.${awarded?' +180 XP.':''}`;}else this.historyFeedback='Revise os objetivos: Apollo 8 orbitou, Apollo 10 ensaiou a descida e Apollo 11 pousou.';this.render();
  }
  runAssembly(){
    const challenge=ASSEMBLY_CHALLENGES.find(item=>item.id===this.assemblyChallenge);const result=this.computer.executeProgram(this.assemblySource,{ALT:1200,VSPD:32,HSPD:48,FUEL:10,HAZARD:72});
    const lines=this.assemblySource.split(/\r?\n/).map(normalize).filter(Boolean);const meets=result.ok&&challenge.required.every(required=>lines.includes(required));
    this.assemblyResult={...result,ok:meets,errors:meets?[]:[...(result.errors??[]),...(result.ok?['O programa é válido, mas ainda não atende todos os requisitos do desafio.']:[])]};
    if(meets){const awarded=this.context.profileStore.addXp(challenge.xp,`agc-${challenge.id}`);this.context.toast(`${challenge.label} validado.${awarded?` +${challenge.xp} XP.`:''}`);}this.render();
  }
  answerAlarm(id,answer){const alarm=APOLLO_ALARMS.find(item=>item.id===id);if(!alarm)return;if(answer===alarm.correct){const awarded=this.context.profileStore.addXp(alarm.xp,`agc-alarm-${id}`);this.alarmFeedback=`Resposta correta para ${alarm.label}: preservar tarefas críticas.${awarded?` +${alarm.xp} XP.`:''}`;}else this.alarmFeedback='Procedimento inseguro. Em sobrecarga, orientação, motor e interface crítica precisam continuar executando.';this.render();}
  startDescent(){
    if(this.checklist.size!==LUNAR_CHECKLIST.length){this.context.toast('Conclua todos os intertravamentos.');return;}
    if(['LANDED','CRASHED','ABORTED'].includes(this.telemetry?.state)){this.configureDescent();this.flightSamples=[];this.flightLogs=[];}
    this.running=true;if(this.worker){this.worker.postMessage({type:'speed',payload:{speed:this.speed}});this.worker.postMessage({type:'start'});}else{this.fallbackModel.start();this.startFallback();}this.context.toast('Descida lunar iniciada.');this.updateDescentDom();
  }
  injectFault(id){if(this.worker)this.worker.postMessage({type:'inject',payload:{id}});else{this.fallbackModel.injectFault(id);this.receiveTelemetry(this.fallbackModel.telemetry());}if(id==='computer-overload'){this.computer.injectRendezvousRadar();const result=this.computer.schedule();this.activeAlarm=result.alarm?.code??'1202';}}
  resolveFault(id,action){
    if(id==='computer-overload'&&action==='priority-restart'){this.computer.priorityRestart();this.context.profileStore.addXp(220,'agc-priority-restart');this.activeAlarm=null;}
    if(this.worker)this.worker.postMessage({type:'resolve',payload:{id,action}});else{const ok=this.fallbackModel.resolveFault(id,action);this.receiveTelemetry(this.fallbackModel.telemetry());if(!ok)this.context.toast('Procedimento incorreto.');}
  }
  completeDescent(payload){
    this.running=false;clearInterval(this.fallbackTimer);if(payload.state==='LANDED'){const awarded=this.context.profileStore.addXp(480,'lunar-descent');this.context.toast(`Pouso confirmado com ${format(payload.fuelPercent,1)}% de combustível.${awarded?' +480 XP.':''}`);}else if(payload.state==='CRASHED')this.context.toast('Contato inseguro. Revise o local, a assistência e as falhas.');else if(payload.state==='ABORTED')this.context.toast('Abortagem segura registrada.');this.render();
  }
  completeSurfaceObjective(id){const result=this.surface.complete(id);if(!result.ok){this.context.toast(result.message);return;}const awarded=this.context.profileStore.addXp(result.objective.xp,`lunar-surface-${id}`);if(result.snapshot.complete)this.context.profileStore.addXp(250,'lunar-surface-complete');this.context.toast(`${result.objective.label} concluído.${awarded?` +${result.objective.xp} XP.`:''}`);this.render();}
  certify(){const requirements=['apollo-history-sequence','agc-priority-restart','lunar-descent','lunar-surface-complete'];if(!requirements.every(id=>this.context.profileStore.hasCompleted(id)))return;const awarded=this.context.profileStore.addXp(350,'lunar-certification');this.certified=true;this.context.toast(`Certificação lunar emitida.${awarded?' +350 XP.':''}`);this.render();}
  exportReport(){
    const profile=this.context.profileStore.active();const report={platform:'COSMOS DS',phase:6,generatedAt:new Date().toISOString(),student:{name:profile.name,className:profile.className,callsign:profile.callsign,level:profile.level,xp:profile.xp},landing:{site:this.siteId,telemetry:this.telemetry,samples:this.flightSamples.slice(-24),logs:this.flightLogs},computer:this.computer.snapshot(),surface:this.surface.snapshot(),completedExperiences:profile.completedExperiences.filter(id=>id.includes('lunar')||id.includes('apollo')||id.includes('agc'))};
    const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`cosmos-ds-fase-6-${profile.callsign.toLowerCase()}-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);this.context.toast('Relatório lunar exportado.');
  }
  updateDescentDom(){
    if(this.activeTab!=='descent'||!this.telemetry)return;const t=this.telemetry;const values={
      'lunar-altitude':`${format(t.altitudeM)} m`,'lunar-vspeed':`${format(t.verticalSpeedMs,1)} m/s`,'lunar-hspeed':`${format(t.horizontalSpeedMs,1)} m/s`,'lunar-fuel':`${format(t.fuelPercent,1)}%`,'lunar-computer':`${format(t.computerLoad)}%`,'lunar-radar':`${format(t.radarQuality)}%`
    };for(const [id,value]of Object.entries(values)){const node=this.container.querySelector(`#${id} strong`);if(node)node.textContent=value;}const stageAlt=this.container.querySelector('#lunar-stage-alt');if(stageAlt)stageAlt.textContent=`${format(t.altitudeM)} m`;const chip=this.container.querySelector('#lunar-state-chip');if(chip)chip.textContent=LUNAR_STATE_LABELS[t.state]??t.state;this.drawDescentChart();this.updateFlightLogDom();
  }
  updateFlightLogDom(){const node=this.container?.querySelector('#lunar-flight-log');if(node)node.innerHTML=this.flightLogMarkup();}
  flightLogMarkup(){return this.flightLogs.length?this.flightLogs.map(log=>`<p class="log-${escapeHtml(log.type.toLowerCase())}"><time>T+${format(log.time,1)}s</time><b>${escapeHtml(log.type)}</b><span>${escapeHtml(log.message)}</span></p>`).join(''):'<p class="empty-log">Aguardando início da missão.</p>';}
  drawDescentChart(){
    const canvas=this.container?.querySelector('#lunar-flight-chart');if(!canvas||this.flightSamples.length<2)return;const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,pad=34;ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(120,170,210,.2)';ctx.lineWidth=1;for(let i=0;i<5;i++){const y=pad+(h-pad*2)*i/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}const maxAlt=Math.max(100,...this.flightSamples.map(item=>item.altitudeM));const maxSpeed=Math.max(10,...this.flightSamples.map(item=>Math.abs(item.verticalSpeedMs)));const line=(getter,max,color)=>{ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();this.flightSamples.forEach((item,index)=>{const x=pad+(w-pad*2)*index/(this.flightSamples.length-1),y=h-pad-(h-pad*2)*getter(item)/max;if(index)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke();};line(item=>item.altitudeM,maxAlt,'#66e4ff');line(item=>Math.abs(item.verticalSpeedMs),maxSpeed,'#ffca6a');ctx.fillStyle='rgba(230,245,255,.7)';ctx.font='13px system-ui';ctx.fillText('Altitude',pad,18);ctx.fillStyle='#ffca6a';ctx.fillText('Velocidade vertical',pad+82,18);
  }
  metric(label,value){return`<article><span>${label}</span><strong>${value}</strong></article>`;}
  telemetryMetric(id,label,value){return`<article id="${id}"><span>${label}</span><strong>${value}</strong></article>`;}
  spec(label,value){return`<article><span>${label}</span><b>${value}</b></article>`;}
}

export const createModule=()=>new MoonApolloModule();

import { MARS_TIMELINE, MARS_MISSIONS, MARS_FAULTS, TERRAIN_TYPES, DEFAULT_MARS_GRID, VISION_SAMPLES, SAMPLE_LABELS, GROUND_DELAY_PROFILES } from '../../data/marsSystems.js';
import { MarsGrid } from '../../core/mars/MarsGrid.js';
import { MarsMissionModel } from '../../core/mars/MarsMissionModel.js';
import { MarsVisionLab } from '../../core/mars/MarsVisionLab.js';
import { ScienceDatabase } from '../../core/mars/ScienceDatabase.js';
import { DroneSystem } from '../../core/mars/DroneSystem.js';
import { MarsSceneRenderer } from '../../rendering/MarsSceneRenderer.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fmt=(value,digits=0)=>Number(value??0).toLocaleString('pt-BR',{maximumFractionDigits:digits,minimumFractionDigits:digits});

class MarsRoboticsModule {
  constructor(){
    this.container=null;this.context=null;this.activeTab='overview';this.grid=new MarsGrid();this.start={x:0,y:11};this.goal={x:11,y:2};this.routeResult=this.grid.findPath(this.start,this.goal);this.telemetry=null;this.logs=[];this.worker=null;this.fallbackModel=null;this.fallbackTimer=null;this.renderer=null;this.running=false;this.speed=1;this.delayProfile='training';this.missionId='engineering';this.selectedVision=null;this.visionResult=null;this.vision=new MarsVisionLab();this.database=new ScienceDatabase();this.drone=new DroneSystem();this.faultFeedback='';this.certified=false;this.timelineSelected='perseverance';
    this.onClick=e=>this.handleClick(e);this.onChange=e=>this.handleChange(e);
  }
  mount(container,context){
    this.container=container;this.context=context;this.certified=context.profileStore.hasCompleted('mars-certification');const profile=context.profileStore.active();this.database=new ScienceDatabase(context.profileStore.storage.get(`mars-science-${profile.id}`,[]));this.container.addEventListener('click',this.onClick);this.container.addEventListener('change',this.onChange);this.configureWorker();this.render();
  }
  unmount(){
    this.worker?.postMessage({type:'stop'});this.worker?.terminate();this.worker=null;clearInterval(this.fallbackTimer);this.renderer?.destroy();this.renderer=null;this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('change',this.onChange);this.container=null;
  }
  currentDelay(){return GROUND_DELAY_PROFILES.find(item=>item.id===this.delayProfile)??GROUND_DELAY_PROFILES[0];}
  workerConfig(){return {missionId:this.missionId,startX:this.start.x,startY:this.start.y,grid:this.grid.serialize(),oneWaySeconds:this.currentDelay().oneWaySeconds,packetLoss:this.delayProfile==='challenge'?.12:0};}
  configureWorker(){
    try{
      this.worker=new Worker(new URL('../../workers/mars.worker.js',import.meta.url),{type:'module'});
      this.worker.onmessage=e=>this.handleWorkerMessage(e.data);
      this.worker.onerror=()=>this.activateFallback();
      this.worker.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});this.worker.postMessage({type:'configure',payload:this.workerConfig()});
    }catch(error){this.activateFallback();}
  }
  activateFallback(){if(this.worker){this.worker.terminate();this.worker=null;}this.fallbackModel=new MarsMissionModel(this.workerConfig());this.telemetry=this.fallbackModel.telemetry();this.context?.toast('Worker indisponível: simulação marciana executada no modo compatível.');}
  startFallback(){clearInterval(this.fallbackTimer);const interval=this.context.settingsStore.getProfile().id==='performance'?220:120;this.fallbackTimer=setInterval(()=>{const t=this.fallbackModel.step(interval/1000*this.speed);this.receiveTelemetry(t);this.receiveEvents(this.fallbackModel.drainEvents());if(t.state==='SAFE')clearInterval(this.fallbackTimer);},interval);}
  handleWorkerMessage(message){
    if(message.type==='telemetry')this.receiveTelemetry(message.payload);
    if(message.type==='events')this.receiveEvents(message.payload);
    if(message.type==='complete'){this.running=false;this.receiveTelemetry(message.payload);}
    if(message.type==='queue-result'&&!message.payload.accepted)this.context.toast(message.payload.reason);
  }
  receiveTelemetry(payload){this.telemetry=payload;this.renderer?.setTelemetry(payload);this.renderer?.setRoute(payload.route);this.updateOperationDom();}
  receiveEvents(events=[]){this.logs.push(...events);this.logs=this.logs.slice(-80);this.updateLogDom();}
  render(){
    this.renderer?.destroy();this.renderer=null;
    this.container.innerHTML=`<section class="module-stage mars-module">
      <header class="module-hero mars-hero"><div><span class="eyebrow">Fase 7 · Marte e Robótica</span><h2>Programe sistemas que precisam decidir <span>antes da resposta chegar.</span></h2><p>Planeje rotas, envie comandos com atraso, classifique amostras, opere um drone e mantenha um rover seguro em terreno desconhecido.</p></div><div class="module-hero-metrics"><article><b>10</b><span>módulos ativos</span></article><article><b>A*</b><span>navegação</span></article><article><b>Worker</b><span>telemetria</span></article></div></header>
      <nav class="lab-tabs" aria-label="Laboratórios de Marte">${this.tabButton('overview','Missões')}${this.tabButton('operation','Rover')}${this.tabButton('route','Planejador A*')}${this.tabButton('vision','Visão')}${this.tabButton('science','Banco científico')}${this.tabButton('drone','Drone')}</nav>
      <div class="mars-tab-host">${this.tabMarkup()}</div>
      <section class="section glass certification-panel">${this.certificationMarkup()}</section>
    </section>`;
    if(this.activeTab==='operation')this.afterOperationRender();
    if(this.activeTab==='route')this.drawRouteCanvas();
  }
  tabButton(id,label){return `<button class="lab-tab ${this.activeTab===id?'active':''}" data-action="mars-tab" data-tab="${id}">${label}</button>`;}
  tabMarkup(){if(this.activeTab==='overview')return this.overviewMarkup();if(this.activeTab==='operation')return this.operationMarkup();if(this.activeTab==='route')return this.routeMarkup();if(this.activeTab==='vision')return this.visionMarkup();if(this.activeTab==='science')return this.scienceMarkup();return this.droneMarkup();}
  overviewMarkup(){
    const selected=MARS_TIMELINE.find(item=>item.id===this.timelineSelected)??MARS_TIMELINE[0];
    return `<div class="mars-overview-grid"><section class="section glass"><div class="section-head"><div><h3>Evolução da robótica em Marte</h3><p>Cada missão amplia sensores, autonomia, ciência ou tolerância a falhas.</p></div><span class="tag">${MARS_TIMELINE.length} marcos</span></div><div class="mars-timeline">${MARS_TIMELINE.map(item=>`<button class="mars-era ${item.id===selected.id?'active':''}" data-action="select-mars-era" data-era="${item.id}"><b>${item.year}</b><span>${item.label}</span><small>${item.type}</small></button>`).join('')}</div></section>
    <section class="section glass mars-dossier"><span class="eyebrow">${selected.year} · ${escapeHtml(selected.type)}</span><h3>${escapeHtml(selected.label)}</h3><p>${escapeHtml(selected.summary)}</p><div class="ds-connection"><b>Conexão com DS</b><span>${escapeHtml(selected.dsLink)}</span></div><a class="button secondary small" href="${selected.source}" target="_blank" rel="noreferrer">Abrir fonte oficial</a></section></div>
    <section class="section glass"><div class="section-head"><div><h3>Arquitetura da missão</h3><p>Um rover funciona como um conjunto distribuído de serviços, sensores e atuadores.</p></div></div><div class="architecture-flow mars-architecture">${['Planejamento na Terra','Fila + ID + ACK','Comunicação com atraso','Computador de bordo','Autonomia e A*','Sensores + atuadores','Telemetria e ciência'].map((item,index)=>`<article><span>${index+1}</span><b>${item}</b></article>`).join('')}</div><div class="hero-actions"><button class="button primary" data-action="complete-mars-overview">Concluir análise arquitetural · 220 XP</button></div></section>`;
  }
  operationMarkup(){
    const t=this.telemetry??new MarsMissionModel(this.workerConfig()).telemetry();const mission=MARS_MISSIONS.find(item=>item.id===this.missionId)??MARS_MISSIONS[0];
    return `<div class="mars-operation-grid"><section class="section glass mars-visual-panel"><div class="simulation-toolbar"><div><span class="eyebrow">Digital twin marciano</span><h3 id="mars-state-label">${t.state}</h3></div><div class="toolbar-actions"><button class="button secondary small" data-action="mars-start">${this.running?'Executando':'Iniciar'}</button><button class="button secondary small" data-action="mars-pause">Pausar</button><button class="button secondary small" data-action="mars-reset">Reiniciar</button></div></div><div class="mars-canvas-wrap"><canvas id="mars-scene" aria-label="Visualização procedural do rover em Marte"></canvas><div class="mars-hud"><span>BAT <b id="mars-battery">${fmt(t.battery,1)}%</b></span><span>TEMP <b id="mars-temp">${fmt(t.temperatureC,1)} °C</b></span><span>LINK <b id="mars-delay">${this.currentDelay().oneWaySeconds}s</b></span><span>FILA <b id="mars-queue">${t.queue.size}</b></span></div></div><p class="canvas-help">Arraste para orbitar a câmera e use a roda para aproximar.</p></section>
      <aside class="side-stack"><section class="panel glass"><h3>Configuração operacional</h3><label class="field"><span>Missão</span><select data-mars-setting="mission">${MARS_MISSIONS.map(item=>`<option value="${item.id}" ${item.id===this.missionId?'selected':''}>${item.label}</option>`).join('')}</select></label><label class="field"><span>Atraso de comunicação</span><select data-mars-setting="delay">${GROUND_DELAY_PROFILES.map(item=>`<option value="${item.id}" ${item.id===this.delayProfile?'selected':''}>${item.label}</option>`).join('')}</select></label><label class="field"><span>Velocidade didática</span><select data-mars-setting="speed">${[1,4,12,30].map(v=>`<option value="${v}" ${v===this.speed?'selected':''}>${v}×</option>`).join('')}</select></label><p class="panel-subtitle">${escapeHtml(mission.description)}</p></section>
      <section class="panel glass"><h3>Enviar comandos</h3><div class="command-buttons"><button class="button secondary small" data-action="mars-command" data-command="capture">Capturar panorama</button><button class="button secondary small" data-action="mars-command" data-command="sample">Coletar amostra</button><button class="button secondary small" data-action="mars-command" data-command="turn">Girar 45°</button><button class="button secondary small" data-action="mars-command" data-command="drone">Reconhecer setor B2</button></div><p class="panel-subtitle">Cada comando recebe ID, horário de envio e confirmação.</p></section></aside></div>
      <section class="section glass"><div class="section-head"><div><h3>Telemetria do rover</h3><p>Estado serializável produzido fora da interface.</p></div><span class="tag" id="mars-position">${t.position.x},${t.position.y}</span></div><div class="telemetry-grid mars-telemetry">${this.metric('mars-distance',`${fmt(t.distanceM,1)} m`,'Percurso')}${this.metric('mars-data',`${fmt(t.dataMb,1)} MB`,'Dados')}${this.metric('mars-slip',fmt(t.wheelSlip,2),'Patinagem')}${this.metric('mars-samples',t.sampleCount,'Amostras')}${this.metric('mars-arm',t.armState,'Braço')}${this.metric('mars-camera',t.cameraMode,'Câmera')}</div></section>
      <section class="section glass"><div class="section-head"><div><h3>Falhas e recuperação</h3><p>Escolha procedimentos que preservem estado, energia e rastreabilidade.</p></div></div><div class="fault-grid">${MARS_FAULTS.map(fault=>this.faultCard(fault)).join('')}</div>${this.faultFeedback?`<p class="feedback-line">${escapeHtml(this.faultFeedback)}</p>`:''}</section>
      <section class="section glass"><div class="section-head"><div><h3>Log operacional</h3><p>Uplink, ACK, execução, navegação e ciência.</p></div></div><div class="event-log" id="mars-log-list">${this.logMarkup()}</div></section>`;
  }
  metric(id,value,label){return `<article><strong id="${id}">${value}</strong><span>${label}</span></article>`;}
  faultCard(fault){return `<article class="fault-card"><span class="tag">${fault.concept}</span><h4>${fault.label}</h4><p>${fault.symptom}</p><button class="button danger small" data-action="inject-mars-fault" data-fault="${fault.id}">Injetar falha</button><div class="fault-options">${fault.options.map(option=>`<button class="button secondary small" data-action="resolve-mars-fault" data-fault="${fault.id}" data-solution="${option.id}">${option.label}</button>`).join('')}</div></article>`;}
  routeMarkup(){
    return `<div class="route-layout"><section class="section glass"><div class="section-head"><div><h3>Mapa de custo</h3><p>Clique em uma célula para definir o destino. O A* soma custo do terreno e distância estimada.</p></div><span class="tag">${this.grid.width} × ${this.grid.height}</span></div><div class="mars-grid" role="grid">${this.grid.cells.map((row,y)=>row.map((type,x)=>{const terrain=TERRAIN_TYPES[type];const inPath=this.routeResult.path.some(p=>p.x===x&&p.y===y);const start=x===this.start.x&&y===this.start.y,goal=x===this.goal.x&&y===this.goal.y;return `<button role="gridcell" class="mars-cell ${type} ${inPath?'path':''} ${start?'start':''} ${goal?'goal':''}" style="--terrain:${terrain.color}" data-action="mars-set-goal" data-x="${x}" data-y="${y}" title="${terrain.label} · custo ${Number.isFinite(terrain.cost)?terrain.cost:'bloqueado'}"><span>${start?'R':goal?'X':inPath?'·':''}</span></button>`;}).join('')).join('')}</div><div class="route-legend">${Object.values(TERRAIN_TYPES).map(item=>`<span><i style="background:${item.color}"></i>${item.label}</span>`).join('')}</div></section>
      <aside class="side-stack"><section class="panel glass"><h3>Resultado A*</h3><div class="metrics"><div class="metric"><strong>${this.routeResult.ok?this.routeResult.path.length:0}</strong><span>Pontos</span></div><div class="metric"><strong>${this.routeResult.ok?fmt(this.routeResult.cost,1):'—'}</strong><span>Custo</span></div><div class="metric"><strong>${this.routeResult.visited}</strong><span>Visitados</span></div></div><p class="panel-subtitle">${this.routeResult.ok?'Rota segura encontrada. Compare caminho curto com caminho de menor risco.':escapeHtml(this.routeResult.reason)}</p><button class="button primary" data-action="upload-mars-route" ${this.routeResult.ok?'':'disabled'}>Enviar rota ao rover</button></section><section class="panel glass"><h3>Pseudocódigo</h3><pre class="code-panel"><code>open = [start]
while open:
  current = menor_f
  if current == goal: reconstruir()
  for neighbor:
    cost = g + terrain.cost
    atualizar se cost for menor</code></pre></section></aside></div>`;
  }
  visionMarkup(){
    return `<div class="vision-layout"><section class="section glass"><div class="section-head"><div><h3>Conjunto de imagens didático</h3><p>Os números simulam atributos extraídos de cor, textura, camadas e refletância.</p></div></div><div class="vision-samples">${VISION_SAMPLES.map(sample=>`<button class="vision-sample ${this.selectedVision===sample.id?'active':''}" data-action="select-vision-sample" data-sample="${sample.id}"><div class="sample-visual ${sample.expected}" aria-hidden="true"></div><b>${sample.label}</b><span>${sample.context}</span></button>`).join('')}</div></section>
      <aside class="side-stack"><section class="panel glass"><h3>Pipeline de classificação</h3>${this.selectedVision?this.visionDetailMarkup():`<p class="panel-subtitle">Selecione uma amostra para visualizar os atributos.</p>`}</section></aside></div>`;
  }
  visionDetailMarkup(){
    const sample=VISION_SAMPLES.find(item=>item.id===this.selectedVision);const result=this.visionResult;
    return `<div class="feature-grid">${Object.entries(sample.features).map(([key,value])=>`<article><span>${key}</span><b>${value}</b></article>`).join('')}</div><button class="button primary" data-action="classify-vision">Executar classificador</button>${result?`<div class="classification-result ${result.label===sample.expected?'correct':'wrong'}"><span>Resultado</span><h4>${result.labelText} · ${result.confidence}%</h4><p>${escapeHtml(result.explanation)}</p><div class="score-bars">${Object.entries(result.scores).map(([key,value])=>`<label><span>${SAMPLE_LABELS[key]}</span><i><b style="width:${value}%"></b></i><em>${value}</em></label>`).join('')}</div><button class="button secondary" data-action="save-vision-sample" ${result.label===sample.expected?'':'disabled'}>Registrar no banco científico</button></div>`:''}`;
  }
  scienceMarkup(){
    const stats=this.database.stats(),records=this.database.list();
    return `<div class="science-layout"><section class="section glass"><div class="section-head"><div><h3>Banco científico de amostras</h3><p>Modelo relacional simplificado com identificação, classe, confiança, coordenadas e massa.</p></div><button class="button secondary small" data-action="export-mars-science">Exportar JSON</button></div><div class="metrics science-metrics"><div class="metric"><strong>${stats.count}</strong><span>Registros</span></div><div class="metric"><strong>${fmt(stats.massG,1)} g</strong><span>Massa</span></div><div class="metric"><strong>${Object.keys(stats.byClass).length}</strong><span>Classes</span></div></div><div class="science-table-wrap"><table class="science-table"><thead><tr><th>ID</th><th>Classe</th><th>Confiança</th><th>Posição</th><th>Massa</th></tr></thead><tbody>${records.length?records.map(item=>`<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(SAMPLE_LABELS[item.classification]??item.classification)}</td><td>${item.confidence}%</td><td>${item.x},${item.y}</td><td>${item.massG} g</td></tr>`).join(''):`<tr><td colspan="5">Classifique e registre amostras no laboratório de visão.</td></tr>`}</tbody></table></div></section><aside class="panel glass"><h3>Consulta SQL equivalente</h3><pre class="code-panel"><code>SELECT classification,
       COUNT(*) AS total,
       AVG(confidence) AS confidence
FROM samples
GROUP BY classification
ORDER BY total DESC;</code></pre><button class="button primary" data-action="complete-mars-database" ${stats.count>=2?'':'disabled'}>Validar banco · 260 XP</button></aside></div>`;
  }
  droneMarkup(){
    const d=this.drone.snapshot();
    return `<div class="drone-layout"><section class="section glass"><div class="section-head"><div><h3>Drone de reconhecimento</h3><p>Planeje missões curtas respeitando energia, alcance e retorno.</p></div><span class="tag">${d.state}</span></div><div class="drone-stage"><div class="drone-visual ${d.state==='FLYING'?'flying':''}"><span class="rotor r1"></span><span class="rotor r2"></span><span class="rotor r3"></span><span class="rotor r4"></span><b>DS</b></div><div class="drone-ground"></div></div><div class="telemetry-grid">${this.metric('drone-battery',`${d.battery}%`,'Bateria')}${this.metric('drone-distance',`${d.distanceM} m`,'Distância')}${this.metric('drone-time',`${d.flightSeconds} s`,'Voo')}${this.metric('drone-sectors',d.surveyed.length,'Setores')}</div></section><aside class="side-stack"><section class="panel glass"><h3>Sequência segura</h3><div class="command-buttons"><button class="button secondary" data-action="drone-launch">1. Lançar</button>${['A1','B2','C3'].map(sector=>`<button class="button secondary" data-action="drone-survey" data-sector="${sector}">Mapear ${sector}</button>`).join('')}<button class="button secondary" data-action="drone-return">3. Retornar</button></div><p class="panel-subtitle">O sistema reserva energia para o retorno e rejeita setores repetidos.</p><button class="button primary" data-action="complete-drone" ${d.surveyed.length>=2&&d.state==='STOWED'?'':'disabled'}>Concluir reconhecimento · 280 XP</button></section></aside></div>`;
  }
  certificationMarkup(){
    const profile=this.context.profileStore.active();const criteria=[['mars-overview','Arquitetura'],['mars-route','Rota A*'],['mars-vision-2','Visão'],['mars-database','Banco'],['mars-drone','Drone']];const completed=criteria.filter(([id])=>profile.completedExperiences.includes(id));const faults=profile.completedExperiences.filter(id=>id.startsWith('mars-fault-')).length;const ready=completed.length===criteria.length&&faults>=2;
    return `<span class="eyebrow">Certificação da fase</span><h3>${this.certified?'Especialista em Robótica Marciana DS':'Critérios de conclusão'}</h3><div class="certification-criteria">${criteria.map(([id,label])=>`<span class="${profile.completedExperiences.includes(id)?'ok':''}">${label}</span>`).join('')}<span class="${faults>=2?'ok':''}">${faults}/2 falhas</span></div><button class="button primary" data-action="mars-certify" ${ready?'':'disabled'}>${this.certified?'Certificação registrada':'Concluir certificação · 400 XP'}</button>`;
  }
  afterOperationRender(){
    const canvas=this.container.querySelector('#mars-scene');if(canvas){this.renderer=new MarsSceneRenderer(canvas,this.context.settingsStore);this.renderer.setTelemetry(this.telemetry??{});this.renderer.start();}
  }
  handleClick(event){
    const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='mars-tab'){this.activeTab=target.dataset.tab;if(this.activeTab==='route'&&this.telemetry?.position){this.start={...this.telemetry.position};this.routeResult=this.grid.findPath(this.start,this.goal);}this.render();}
    if(action==='select-mars-era'){this.timelineSelected=target.dataset.era;this.render();}
    if(action==='complete-mars-overview')this.award(220,'mars-overview','Análise arquitetural concluída');
    if(action==='mars-start')this.startMission();
    if(action==='mars-pause')this.pauseMission();
    if(action==='mars-reset')this.resetMission();
    if(action==='mars-command')this.sendCommand(target.dataset.command);
    if(action==='inject-mars-fault')this.injectFault(target.dataset.fault);
    if(action==='resolve-mars-fault')this.resolveFault(target.dataset.fault,target.dataset.solution);
    if(action==='mars-set-goal')this.setGoal(Number(target.dataset.x),Number(target.dataset.y));
    if(action==='upload-mars-route')this.uploadRoute();
    if(action==='select-vision-sample'){this.selectedVision=target.dataset.sample;this.visionResult=null;this.render();}
    if(action==='classify-vision')this.classifyVision();
    if(action==='save-vision-sample')this.saveVisionSample();
    if(action==='export-mars-science')this.exportScience();
    if(action==='complete-mars-database')this.award(260,'mars-database','Banco científico validado');
    if(action==='drone-launch')this.droneAction('launch');
    if(action==='drone-survey')this.droneAction('survey',target.dataset.sector);
    if(action==='drone-return')this.droneAction('return');
    if(action==='complete-drone')this.award(280,'mars-drone','Reconhecimento aéreo concluído');
    if(action==='mars-certify')this.certify();
  }
  handleChange(event){
    const field=event.target.closest('[data-mars-setting]');if(!field)return;const key=field.dataset.marsSetting;if(key==='mission')this.missionId=field.value;if(key==='delay')this.delayProfile=field.value;if(key==='speed')this.speed=Number(field.value)||1;this.resetMission();
  }
  startMission(){this.running=true;if(this.worker){this.worker.postMessage({type:'speed',payload:{speed:this.speed}});this.worker.postMessage({type:'start'});}else{this.fallbackModel.start();this.startFallback();}this.context.toast('Missão marciana iniciada.');this.render();}
  pauseMission(){this.running=false;if(this.worker)this.worker.postMessage({type:'pause'});else{this.fallbackModel.pause();clearInterval(this.fallbackTimer);}this.context.toast('Operação pausada.');}
  resetMission(){this.running=false;clearInterval(this.fallbackTimer);this.logs=[];const config=this.workerConfig();if(this.worker)this.worker.postMessage({type:'reset',payload:config});else{this.fallbackModel=new MarsMissionModel(config);this.telemetry=this.fallbackModel.telemetry();}this.render();}
  sendWorker(type,payload){if(this.worker)this.worker.postMessage({type,payload});else if(type==='enqueue'){const result=this.fallbackModel.enqueue(payload.command,payload.priority);this.receiveEvents(this.fallbackModel.drainEvents());if(!result.accepted)this.context.toast(result.reason);}else if(type==='route'){const result=this.fallbackModel.enqueue({type:'route',path:payload.path,id:payload.id},payload.priority);this.receiveEvents(this.fallbackModel.drainEvents());if(!result.accepted)this.context.toast(result.reason);}}
  sendCommand(type){
    const suffix=Date.now().toString(36);const commands={capture:{type:'capture',quality:'science',id:`IMG-${suffix}`},sample:{type:'sample',sampleId:`AUTO-${suffix}`,id:`SMP-${suffix}`},turn:{type:'turn',degrees:45,id:`TRN-${suffix}`},drone:{type:'drone',sector:'B2',id:`DRN-${suffix}`}};this.sendWorker('enqueue',{command:commands[type],priority:type==='sample'?'high':'normal'});this.context.toast(`Comando enviado com ${this.currentDelay().oneWaySeconds}s de atraso didático.`);
  }
  injectFault(id){if(this.worker)this.worker.postMessage({type:'inject',payload:{id}});else{this.fallbackModel.injectFault(id);this.receiveTelemetry(this.fallbackModel.telemetry());this.receiveEvents(this.fallbackModel.drainEvents());}this.faultFeedback='Falha ativa. Escolha o procedimento de recuperação.';this.render();}
  resolveFault(id,solution){const fault=MARS_FAULTS.find(item=>item.id===id);if(!fault)return;if(solution!==fault.answer){this.faultFeedback='Procedimento inadequado. Preserve estado, energia e confirmação de comandos.';this.context.toast('A resolução não protege o rover.');this.render();return;}if(this.worker)this.worker.postMessage({type:'resolve',payload:{id,action:solution}});else{this.fallbackModel.resolveFault(id,solution);this.receiveTelemetry(this.fallbackModel.telemetry());this.receiveEvents(this.fallbackModel.drainEvents());}this.faultFeedback=`Falha estabilizada por ${fault.concept}.`;this.award(fault.xp,`mars-fault-${id}`,`Falha ${fault.label} resolvida`,false);this.render();}
  setGoal(x,y){this.goal={x,y};this.routeResult=this.grid.findPath(this.start,this.goal);this.render();}
  uploadRoute(){if(!this.routeResult.ok)return;const id=`ROUTE-${Date.now().toString(36)}`;this.sendWorker('route',{path:this.routeResult.path,id,priority:'high'});this.award(360,'mars-route','Rota A* validada e enviada');this.activeTab='operation';this.render();}
  classifyVision(){const sample=VISION_SAMPLES.find(item=>item.id===this.selectedVision);if(!sample)return;this.visionResult=this.vision.classify(sample.features);const correct=this.visionResult.label===sample.expected;if(correct)this.award(sample.xp,`mars-vision-${sample.id}`,`Classificação correta: ${SAMPLE_LABELS[sample.expected]}`,false);else this.context.toast('Classificação inconclusiva. Compare os atributos novamente.');const profile=this.context.profileStore.active();const count=profile.completedExperiences.filter(id=>id.startsWith('mars-vision-sample-')).length;if(count>=2)this.context.profileStore.addXp(0,'mars-vision-2');this.render();}
  saveVisionSample(){const sample=VISION_SAMPLES.find(item=>item.id===this.selectedVision);if(!sample||!this.visionResult||this.visionResult.label!==sample.expected)return;const result=this.database.add({id:sample.id,name:sample.label,classification:sample.expected,confidence:this.visionResult.confidence,x:this.goal.x,y:this.goal.y,massG:18+sample.id.length,notes:sample.context});if(result.ok){const profile=this.context.profileStore.active();this.context.profileStore.storage.set(`mars-science-${profile.id}`,this.database.list());}this.context.toast(result.ok?'Amostra registrada no banco científico.':result.reason);if(this.database.stats().count>=2)this.context.profileStore.addXp(0,'mars-vision-2');this.render();}
  exportScience(){const blob=new Blob([this.database.export()],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='cosmos-ds-amostras-marte.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);this.context.toast('Banco científico exportado em JSON.');}
  droneAction(action,sector){let result;if(action==='launch')result=this.drone.launch();if(action==='survey')result=this.drone.survey(sector);if(action==='return')result=this.drone.returnHome();this.context.toast(result.ok?action==='survey'?`Setor ${sector} mapeado.`:'Comando do drone executado.':result.reason);this.render();}
  award(xp,id,label,rerender=true){const awarded=this.context.profileStore.addXp(xp,id);this.context.toast(awarded?`${label}: +${xp} XP.`:`${label} já registrado para este perfil.`);if(rerender)this.render();}
  certify(){const profile=this.context.profileStore.active();const base=['mars-overview','mars-route','mars-vision-2','mars-database','mars-drone'].every(id=>profile.completedExperiences.includes(id));const faults=profile.completedExperiences.filter(id=>id.startsWith('mars-fault-')).length;if(!base||faults<2){this.context.toast('Conclua arquitetura, rota, duas classificações, banco, drone e duas falhas.');return;}const awarded=this.context.profileStore.addXp(400,'mars-certification');this.certified=true;this.context.toast(awarded?'Certificação em Robótica Marciana DS: +400 XP.':'Certificação já registrada.');this.render();}
  updateOperationDom(){const t=this.telemetry;if(!t||this.activeTab!=='operation')return;const set=(id,value)=>{const el=this.container?.querySelector(id);if(el)el.textContent=value;};set('#mars-state-label',t.state);set('#mars-battery',`${fmt(t.battery,1)}%`);set('#mars-temp',`${fmt(t.temperatureC,1)} °C`);set('#mars-queue',t.queue.size);set('#mars-position',`${t.position.x},${t.position.y}`);set('#mars-distance',`${fmt(t.distanceM,1)} m`);set('#mars-data',`${fmt(t.dataMb,1)} MB`);set('#mars-slip',fmt(t.wheelSlip,2));set('#mars-samples',t.sampleCount);set('#mars-arm',t.armState);set('#mars-camera',t.cameraMode);}
  updateLogDom(){const el=this.container?.querySelector('#mars-log-list');if(el)el.innerHTML=this.logMarkup();}
  logMarkup(){return this.logs.length?this.logs.slice().reverse().map(item=>`<article><time>${fmt(item.time,1)}s</time><b>${escapeHtml(item.type)}</b><span>${escapeHtml(item.message)}</span></article>`).join(''):'<p class="panel-subtitle">Aguardando comandos e telemetria.</p>';}
  drawRouteCanvas(){}
}

export const createModule=()=>new MarsRoboticsModule();

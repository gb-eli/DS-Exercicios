import { OrbitMath } from '../../core/orbit/OrbitMath.js';
import { SatelliteSystem } from '../../core/orbit/SatelliteSystem.js';
import { EarthGlobeRenderer } from '../../rendering/EarthGlobeRenderer.js';
import {
  ORBIT_TYPES, SATELLITE_MISSIONS, SATELLITE_BUSES, SATELLITE_PAYLOADS,
  POWER_SYSTEMS, ANTENNAS, GROUND_STATIONS, ORBIT_CHALLENGES
} from '../../data/orbitalSystems.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
const clamp = (value,min,max) => Math.min(max,Math.max(min,value));

class EarthOrbitModule {
  constructor() {
    this.container=null; this.context=null; this.activeTab='globe'; this.selectedOrbitId='sso';
    this.altitudeKm=600; this.inclinationDeg=97.8; this.speed=60; this.running=false; this.telemetry=null;
    this.worker=null; this.fallbackTimer=null; this.fallbackElapsed=0; this.renderer=null;
    this.orbitQuestion=0; this.orbitFeedback=''; this.solvedOrbitChallenges=new Set();
    this.satellite=new SatelliteSystem({ orbitId:'sso' }); this.operationValidated=false;
    this.onClick=e=>this.handleClick(e); this.onInput=e=>this.handleInput(e); this.onChange=e=>this.handleChange(e);
  }

  mount(container, context) {
    this.container=container; this.context=context;
    const completed=context.profileStore.active().completedExperiences;
    ORBIT_CHALLENGES.forEach(item=>{if(completed.includes(`earth-orbit-${item.id}`))this.solvedOrbitChallenges.add(item.id);});
    this.operationValidated=completed.includes('earth-orbit-operation');
    container.addEventListener('click',this.onClick);container.addEventListener('input',this.onInput);container.addEventListener('change',this.onChange);
    this.createWorker(); this.render(); this.startSimulation();
  }

  unmount() {
    this.stopSimulation(); this.worker?.terminate(); clearInterval(this.fallbackTimer); this.renderer?.destroy();
    this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('input',this.onInput);this.container?.removeEventListener('change',this.onChange);
  }

  createWorker() {
    if(!('Worker' in globalThis))return;
    try {
      this.worker=new Worker(new URL('../../workers/orbital.worker.js',import.meta.url),{type:'module'});
      this.worker.addEventListener('message',event=>this.handleWorkerMessage(event.data));
      this.worker.addEventListener('error',()=>{this.worker?.terminate();this.worker=null;this.context.toast('Worker orbital indisponível; simulador local ativado.');if(this.running)this.startFallback();});
      this.worker.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});
      this.configureWorker();
    } catch(error) { console.warn(error); this.worker=null; }
  }

  satelliteSummary() { return this.satellite.summary(); }
  selectedOrbit() { return ORBIT_TYPES.find(item=>item.id===this.selectedOrbitId) ?? { id:'custom', name:'CUSTOM', label:'Órbita personalizada', color:'#55dcff' }; }

  configureWorker() {
    const summary=this.satelliteSummary();
    const payload={
      altitudeKm:this.altitudeKm,inclinationDeg:this.inclinationDeg,raanDeg:18,phaseDeg:12,
      panelGenerationW:summary.generationW,loadW:summary.peakLoadW,batteryWh:summary.bus.batteryWh,
      dataRateMbps:summary.payload.dataMbps,downlinkMbps:summary.antenna.capacityMbps
    };
    this.worker?.postMessage({type:'configure',payload});
  }

  startSimulation() {
    this.running=true;
    if(this.worker){this.configureWorker();this.worker.postMessage({type:'speed',payload:{speed:this.speed}});this.worker.postMessage({type:'start'});}
    else this.startFallback();
    this.updateRuntimeButtons();
  }

  stopSimulation() {
    this.running=false; this.worker?.postMessage({type:'stop'}); clearInterval(this.fallbackTimer); this.fallbackTimer=null; this.updateRuntimeButtons();
  }

  startFallback() {
    clearInterval(this.fallbackTimer);this.running=true;
    const interval=this.context.settingsStore.getProfile().id==='performance'?1100:650;
    this.fallbackTimer=setInterval(()=>this.fallbackStep(),interval);this.fallbackStep();
  }

  fallbackStep() {
    this.fallbackElapsed+=this.speed;
    const state=OrbitMath.orbitalState({altitudeKm:this.altitudeKm,inclinationDeg:this.inclinationDeg,elapsedSeconds:this.fallbackElapsed,raanDeg:18});
    const footprintKm=OrbitMath.footprintRadiusKm(this.altitudeKm,10);
    const stations=GROUND_STATIONS.map(station=>({...station,distanceKm:OrbitMath.haversineKm(state.latitudeDeg,state.longitudeDeg,station.lat,station.lon)})).sort((a,b)=>a.distanceKm-b.distanceKm);
    const station={...stations[0],visible:stations[0].distanceKm<footprintKm*.92};
    const eclipse=Math.cos(state.anomalyRad)<-.45;
    const summary=this.satelliteSummary();
    const batteryPercent=clamp(78+Math.sin(this.fallbackElapsed/900)*16-(eclipse?8:0),12,100);
    this.consumeTelemetry({tick:Math.round(this.fallbackElapsed/this.speed),elapsedSeconds:this.fallbackElapsed,latitudeDeg:state.latitudeDeg,longitudeDeg:state.longitudeDeg,altitudeKm:this.altitudeKm,velocityKmS:state.velocityKmS,periodSeconds:state.periodSeconds,footprintKm,eclipse,generationW:eclipse?0:summary.generationW*.82,loadW:summary.peakLoadW,batteryWh:summary.bus.batteryWh*batteryPercent/100,batteryPercent,dataStoredGb:6+Math.abs(Math.sin(this.fallbackElapsed/500))*12,totalDownlinkedGb:station.visible?1.2:0,downlinkActive:station.visible,linkQuality:station.visible?72:0,station});
  }

  handleWorkerMessage(message) {
    if(message?.type==='telemetry')this.consumeTelemetry(message.payload);
    if(message?.type==='status'){this.running=message.payload.running;this.updateRuntimeButtons();}
  }

  consumeTelemetry(sample) {
    this.telemetry=sample;this.updateLivePanels();
  }

  handleClick(event) {
    const target=event.target.closest('[data-action]');if(!target)return;
    const action=target.dataset.action;
    if(action==='back')return this.context.onBack();
    if(action==='open-knowledge'){sessionStorage.setItem('cosmos-ds-knowledge-target','earth');return this.context.openModule('curiosity-center');}
    if(action==='tab'){this.activeTab=target.dataset.tab;this.render();return;}
    if(action==='select-orbit'){this.applyOrbit(target.dataset.orbit);return;}
    if(action==='answer-orbit'){this.answerOrbit(target.dataset.orbit);return;}
    if(action==='restart-orbit-challenges'){this.orbitQuestion=0;this.orbitFeedback='';this.render();return;}
    if(action==='validate-satellite'){this.validateSatellite();return;}
    if(action==='toggle-orbit-sim'){this.running?this.stopSimulation():this.startSimulation();return;}
    if(action==='step-orbit-sim'){if(this.worker)this.worker.postMessage({type:'step'});else this.fallbackStep();return;}
    if(action==='reset-orbit-sim'){this.worker?.postMessage({type:'reset'});this.fallbackElapsed=0;this.telemetry=null;this.renderer?.reset();this.updateLivePanels();return;}
    if(action==='set-speed'){this.speed=Number(target.dataset.speed)||60;this.worker?.postMessage({type:'speed',payload:{speed:this.speed}});this.render();return;}
    if(action==='reset-globe'){this.renderer?.reset();return;}
    if(action==='validate-operation'){this.validateOperation();return;}
  }

  handleInput(event) {
    if(event.target.matches('[data-input="altitude"]')){
      this.altitudeKm=Number(event.target.value);this.selectedOrbitId='custom';this.configureWorker();this.updateOrbitMetrics();this.updateTrack();
    }
    if(event.target.matches('[data-input="inclination"]')){
      this.inclinationDeg=Number(event.target.value);this.selectedOrbitId='custom';this.configureWorker();this.updateOrbitMetrics();this.updateTrack();
    }
  }

  handleChange(event) {
    const field=event.target.dataset.satelliteField;if(!field)return;
    this.satellite.update({[field]:event.target.value});
    if(field==='orbitId'&&ORBIT_TYPES.some(item=>item.id===event.target.value))this.applyOrbit(event.target.value,false);
    this.configureWorker();this.render();
  }

  applyOrbit(id, rerender=true) {
    const orbit=ORBIT_TYPES.find(item=>item.id===id);if(!orbit)return;
    this.selectedOrbitId=id;this.altitudeKm=orbit.altitudeKm;this.inclinationDeg=orbit.inclinationDeg;this.satellite.update({orbitId:id});this.configureWorker();
    if(rerender)this.render();
  }

  answerOrbit(id) {
    const challenge=ORBIT_CHALLENGES[this.orbitQuestion];if(!challenge)return;
    if(id!==challenge.answer){this.orbitFeedback='A escolha não atende ao requisito principal. Compare altitude, latência, cobertura e geometria de passagem.';this.context.toast('Reanalise o compromisso técnico da missão.');this.render();return;}
    this.solvedOrbitChallenges.add(challenge.id);const awarded=this.context.profileStore.addXp(challenge.xp,`earth-orbit-${challenge.id}`);
    this.orbitFeedback=challenge.explanation;this.orbitQuestion++;
    this.context.toast(awarded?`Órbita validada: +${challenge.xp} XP.`:'Cenário revisado; XP já registrado.');this.checkCertification();this.render();
  }

  validateSatellite() {
    const summary=this.satelliteSummary();
    if(!summary.validation.ok){this.context.toast('Configuração ainda possui incompatibilidades. Revise os alertas técnicos.');this.render();return;}
    const awarded=this.context.profileStore.addXp(300,'earth-satellite-builder');
    this.context.toast(awarded?'Satélite validado em massa, energia e dados: +300 XP.':'Satélite revisado; XP já registrado.');this.checkCertification();this.render();
  }

  validateOperation() {
    if(!this.telemetry)return this.context.toast('Aguarde a primeira amostra orbital.');
    const safe=this.telemetry.batteryPercent>=25&&this.telemetry.dataStoredGb<50&&this.telemetry.totalDownlinkedGb>0;
    if(!safe){this.context.toast('Ainda falta contato de solo ou margem operacional de bateria/dados. Acelere a simulação e acompanhe as passagens.');return;}
    const awarded=this.context.profileStore.addXp(240,'earth-orbit-operation');this.operationValidated=true;
    this.context.toast(awarded?'Operação orbital validada: +240 XP.':'Operação revisada; XP já registrado.');this.checkCertification();this.render();
  }

  checkCertification() {
    const completed=this.context.profileStore.active().completedExperiences;
    const orbitDone=ORBIT_CHALLENGES.every(item=>this.solvedOrbitChallenges.has(item.id)||completed.includes(`earth-orbit-${item.id}`));
    const satelliteDone=completed.includes('earth-satellite-builder')||this.satelliteSummary().validation.ok&&completed.includes('earth-satellite-builder');
    const operationDone=this.operationValidated||completed.includes('earth-orbit-operation');
    if(orbitDone&&satelliteDone&&operationDone){const awarded=this.context.profileStore.addXp(300,'earth-orbit-certification');if(awarded)this.context.toast('Certificação Analista de Sistemas Orbitais: +300 XP.');}
  }

  render() {
    this.renderer?.destroy();this.renderer=null;
    const quality=this.context.settingsStore.getProfile();
    this.container.innerHTML=`<section class="section glass module-view earth-module quality-${quality.id}">
      <div class="section-head"><div><span class="eyebrow">Fase 4 · Geodados + Sistemas Orbitais</span><h2>Terra, Satélites e Órbitas</h2><p>Navegue por um globo procedural, compare órbitas, monte um satélite e mantenha energia, dados e comunicação durante passagens reais simplificadas.</p></div><div class="hero-actions"><button class="button secondary" data-action="open-knowledge">? Curiosidades da Terra</button><button class="button secondary" data-action="back">← Voltar ao portal</button></div></div>
      <nav class="module-tabs" aria-label="Estações do laboratório orbital">${this.tab('globe','Globo 3D')}${this.tab('orbits','Órbitas')}${this.tab('satellite','Montagem')}${this.tab('network','Operação + cobertura')}</nav>
      ${this.activeTab==='globe'?this.globeMarkup():this.activeTab==='orbits'?this.orbitsMarkup():this.activeTab==='satellite'?this.satelliteMarkup():this.networkMarkup()}
    </section>`;
    if(this.activeTab==='globe')this.startGlobe();
    if(this.activeTab==='network')this.updateTrack();
    this.updateLivePanels();
  }

  tab(id,label){return `<button class="module-tab ${this.activeTab===id?'active':''}" data-action="tab" data-tab="${id}">${label}</button>`;}

  startGlobe(){const canvas=this.container.querySelector('#earth-globe-canvas');if(!canvas)return;this.renderer=new EarthGlobeRenderer(canvas,this.context.settingsStore);this.renderer.start();}

  globeMarkup() {
    const orbit=this.selectedOrbit();
    return `<div class="earth-globe-layout">
      <article class="earth-stage panel glass" style="--orbit:${orbit.color??'#55dcff'}">
        <canvas id="earth-globe-canvas" aria-label="Globo terrestre procedural interativo"></canvas>
        <svg class="earth-orbit-overlay" viewBox="0 0 800 560" aria-hidden="true"><ellipse cx="400" cy="280" rx="295" ry="${Math.max(70,220-Math.abs(this.inclinationDeg-50)*1.1)}"/><circle id="earth-satellite-marker" cx="680" cy="280" r="8"/></svg>
        <div class="earth-stage-hud"><span>Arraste para girar</span><span>Role para aproximar</span><button class="button small secondary" data-action="reset-globe">Centralizar</button></div>
        <div class="earth-coordinate"><b id="earth-coordinate-text">${this.telemetry?`${this.telemetry.latitudeDeg.toFixed(2)}°, ${this.telemetry.longitudeDeg.toFixed(2)}°`:'Aguardando órbita'}</b><span id="earth-contact-text">${this.telemetry?.downlinkActive?`Contato: ${escapeHtml(this.telemetry.station.name)}`:'Sem contato de solo'}</span></div>
      </article>
      <aside class="earth-side-stack">
        <article class="console"><div class="console-line"><span>ÓRBITA</span><b>${escapeHtml(orbit.name??'CUSTOM')}</b></div><div class="console-line"><span>ALTITUDE</span><b id="earth-altitude-live">${this.altitudeKm.toFixed(0)} km</b></div><div class="console-line"><span>VELOCIDADE</span><b id="earth-velocity-live">${OrbitMath.velocityKmS(this.altitudeKm).toFixed(2)} km/s</b></div><div class="console-line"><span>PERÍODO</span><b id="earth-period-live">${OrbitMath.formatPeriod(OrbitMath.periodSeconds(this.altitudeKm))}</b></div><div class="console-line"><span>COBERTURA</span><b id="earth-footprint-live">${OrbitMath.footprintRadiusKm(this.altitudeKm).toFixed(0)} km</b></div></article>
        <article class="panel glass"><h3>Órbitas rápidas</h3><div class="orbit-mini-grid">${ORBIT_TYPES.map(item=>`<button class="orbit-mini ${item.id===this.selectedOrbitId?'active':''}" style="--orbit:${item.color}" data-action="select-orbit" data-orbit="${item.id}"><b>${item.name}</b><small>${item.altitudeKm.toLocaleString('pt-BR')} km</small></button>`).join('')}</div></article>
        <article class="detail-card"><span>MODELO VISUAL</span><h3>Shader procedural, não fotografia</h3><p>O globo usa materiais gerados por código para manter a plataforma leve e offline. Camadas cartográficas reais poderão ser adicionadas como pacote opcional.</p></article>
      </aside>
    </div>`;
  }

  orbitsMarkup() {
    const period=OrbitMath.periodSeconds(this.altitudeKm),velocity=OrbitMath.velocityKmS(this.altitudeKm),footprint=OrbitMath.footprintRadiusKm(this.altitudeKm);
    const challenge=ORBIT_CHALLENGES[this.orbitQuestion];
    return `<div class="orbit-lab-layout">
      <section><div class="orbit-card-grid">${ORBIT_TYPES.map(item=>`<button class="orbit-type-card ${item.id===this.selectedOrbitId?'active':''}" style="--orbit:${item.color}" data-action="select-orbit" data-orbit="${item.id}"><header><b>${item.name}</b><span>${item.altitudeKm.toLocaleString('pt-BR')} km</span></header><h3>${item.label}</h3><p>${item.use}</p><small>${item.tradeoff}</small></button>`).join('')}</div>
      <article class="panel glass orbit-controls"><div><label>Altitude: <b id="orbit-altitude-value">${this.altitudeKm.toFixed(0)} km</b></label><input type="range" min="180" max="35786" step="10" value="${this.altitudeKm}" data-input="altitude"></div><div><label>Inclinação: <b id="orbit-inclination-value">${this.inclinationDeg.toFixed(1)}°</b></label><input type="range" min="0" max="120" step=".1" value="${this.inclinationDeg}" data-input="inclination"></div></article></section>
      <aside class="orbit-metrics"><article class="metric-orbit"><span>PERÍODO</span><strong id="orbit-period-metric">${OrbitMath.formatPeriod(period)}</strong><small>Uma volta completa</small></article><article class="metric-orbit"><span>VELOCIDADE</span><strong id="orbit-speed-metric">${velocity.toFixed(2)} km/s</strong><small>Órbita circular aproximada</small></article><article class="metric-orbit"><span>RAIO DE COBERTURA</span><strong id="orbit-cover-metric">${footprint.toFixed(0)} km</strong><small>Elevação mínima simplificada</small></article><article class="detail-card warning"><span>SIMULAÇÃO EDUCACIONAL</span><p>O modelo usa órbitas circulares simplificadas. Perturbações, manobras e elementos orbitais completos entrarão em uma camada avançada.</p></article></aside>
      <article class="panel glass orbit-challenge">${challenge?`<span class="eyebrow">Decisão orbital ${this.orbitQuestion+1}/${ORBIT_CHALLENGES.length}</span><h3>${challenge.title}</h3><p>${challenge.prompt}</p><div class="orbit-answer-grid">${ORBIT_TYPES.map(item=>`<button class="choice" data-action="answer-orbit" data-orbit="${item.id}"><b>${item.name}</b><small>${item.label}</small></button>`).join('')}</div>${this.orbitFeedback?`<p class="feedback-line">${this.orbitFeedback}</p>`:''}`:`<span class="eyebrow">Checkpoint concluído</span><h3>Três decisões orbitais validadas</h3><p>Você relacionou requisitos de iluminação, latência e apontamento com diferentes regimes orbitais.</p><button class="button secondary" data-action="restart-orbit-challenges">Revisar cenários</button>`}</article>
    </div>`;
  }

  satelliteMarkup() {
    const s=this.satelliteSummary();
    return `<div class="satellite-builder-layout">
      <section class="satellite-visual panel glass" style="--sat:${s.bus.color}"><div class="satellite-space"><div class="sat-panel left">▦</div><div class="sat-body"><span>${s.payload.icon}</span><b>${escapeHtml(s.bus.name)}</b><small>${escapeHtml(s.mission.name)}</small></div><div class="sat-dish">${s.antenna.icon}</div><div class="sat-panel right">▦</div><i class="sat-orbit-line"></i></div><div class="sat-labels"><span>Carga: ${escapeHtml(s.payload.name)}</span><span>Energia: ${escapeHtml(s.power.name)}</span><span>Link: ${escapeHtml(s.antenna.name)}</span></div></section>
      <section class="satellite-config panel glass"><h3>Configuração modular</h3>${this.selectMarkup('missionId','Missão',SATELLITE_MISSIONS,s.config.missionId)}${this.selectMarkup('orbitId','Órbita',ORBIT_TYPES,s.config.orbitId)}${this.selectMarkup('busId','Barramento',SATELLITE_BUSES,s.config.busId)}${this.selectMarkup('payloadId','Carga útil',SATELLITE_PAYLOADS,s.config.payloadId)}${this.selectMarkup('powerId','Sistema de energia',POWER_SYSTEMS,s.config.powerId)}${this.selectMarkup('antennaId','Comunicação',ANTENNAS,s.config.antennaId)}</section>
      <aside class="satellite-results"><div class="sat-metric-grid"><article><span>MASSA</span><strong>${s.totalMassKg.toFixed(1)} kg</strong><small>limite ${s.bus.maxMassKg} kg</small></article><article><span>GERAÇÃO</span><strong>${s.generationW.toFixed(0)} W</strong><small>pico de carga ${s.peakLoadW.toFixed(0)} W</small></article><article><span>MARGEM DE DADOS</span><strong>${s.dataMarginMbps.toFixed(0)} Mbps</strong><small>downlink − produção</small></article><article><span>ECLIPSE</span><strong>${s.eclipseEnduranceMinutes.toFixed(0)} min</strong><small>autonomia teórica</small></article></div>
        <article class="validation-panel ${s.validation.ok?'ok':'warning'}"><span>${s.validation.ok?'CONFIGURAÇÃO COMPATÍVEL':'REVISÃO NECESSÁRIA'}</span><h3>${s.validation.ok?'Subsistemas coerentes':'Incompatibilidades detectadas'}</h3>${s.validation.ok?`<p>O conjunto respeita massa, energia, missão, órbita e capacidade de transmissão.</p>`:`<ul>${s.validation.issues.map(issue=>`<li>${escapeHtml(issue)}</li>`).join('')}</ul>`}<button class="button primary" data-action="validate-satellite">Validar satélite · 300 XP</button></article>
      </aside>
    </div>`;
  }

  selectMarkup(field,label,items,value){return `<label class="sat-select"><span>${label}</span><select data-satellite-field="${field}">${items.map(item=>`<option value="${item.id}" ${item.id===value?'selected':''}>${escapeHtml(item.name??item.label)}</option>`).join('')}</select></label>`;}

  trackSegments() {
    const points=OrbitMath.groundTrack({altitudeKm:this.altitudeKm,inclinationDeg:this.inclinationDeg,raanDeg:18},130);const segments=[[]];
    points.forEach((point,index)=>{if(index&&Math.abs(point.lon-points[index-1].lon)>180)segments.push([]);segments.at(-1).push(`${((point.lon+180)/360*1000).toFixed(1)},${((90-point.lat)/180*500).toFixed(1)}`);});
    return segments.filter(segment=>segment.length>1);
  }

  networkMarkup() {
    const t=this.telemetry;const tracks=this.trackSegments();
    return `<div class="network-layout">
      <article class="world-map panel glass"><svg viewBox="0 0 1000 500" id="orbit-world-map" role="img" aria-label="Mapa simplificado da trajetória e estações de solo"><defs><pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(85,220,255,.10)"/></pattern></defs><rect width="1000" height="500" fill="url(#map-grid)"/><path class="world-silhouette" d="M80 155l85-54 93 18 43 80-54 54-91-12-49 47-49-47zm264 57 74-58 81 22 33 72-60 49-93-20zm235-63 90-56 110 32 37 77-55 43-55-28-73 59-73-47zm-130 172 71-28 65 55-17 77-77 23-54-57z"/>${tracks.map(points=>`<polyline class="ground-track" points="${points.join(' ')}"/>`).join('')}${GROUND_STATIONS.map(st=>`<g data-station="${st.id}" class="ground-station ${t?.station?.id===st.id&&t?.downlinkActive?'active':''}" transform="translate(${(st.lon+180)/360*1000} ${(90-st.lat)/180*500})"><circle r="8"/><text x="12" y="4">${escapeHtml(st.name)}</text></g>`).join('')}<circle id="world-satellite" class="world-satellite" cx="${t?((t.longitudeDeg+180)/360*1000):500}" cy="${t?((90-t.latitudeDeg)/180*500):250}" r="9"/></svg><div class="map-legend"><span><i class="line"></i> trajetória</span><span><i class="station"></i> estação</span><span><i class="sat"></i> satélite</span></div></article>
      <aside class="network-console console"><div class="console-line"><span>SIMULAÇÃO</span><b id="orbit-running-label" class="${this.running?'ok':'warn'}">${this.running?'EXECUTANDO':'PAUSADA'}</b></div><div class="console-line"><span>VELOCIDADE DO TEMPO</span><b>${this.speed}×</b></div><div class="console-line"><span>BATERIA</span><b id="network-battery">${t?t.batteryPercent.toFixed(1):'--'}%</b></div><div class="console-line"><span>DADOS ARMAZENADOS</span><b id="network-data">${t?t.dataStoredGb.toFixed(2):'--'} GB</b></div><div class="console-line"><span>ESTAÇÃO MAIS PRÓXIMA</span><b id="network-station">${t?escapeHtml(t.station.name):'--'}</b></div><div class="console-line"><span>LINK</span><b id="network-link" class="${t?.downlinkActive?'ok':'warn'}">${t?.downlinkActive?`${t.linkQuality.toFixed(0)}%`:'SEM CONTATO'}</b></div><div class="operation-buttons"><button class="button small primary" id="orbit-toggle-button" data-action="toggle-orbit-sim">${this.running?'Pausar':'Continuar'}</button><button class="button small secondary" data-action="step-orbit-sim">Passo</button><button class="button small secondary" data-action="reset-orbit-sim">Reiniciar</button></div><div class="speed-buttons">${[10,60,300,1200].map(value=>`<button class="${value===this.speed?'active':''}" data-action="set-speed" data-speed="${value}">${value}×</button>`).join('')}</div></aside>
      <section class="network-data panel glass"><div class="section-head"><div><h3>Pacote orbital</h3><p>Mesmo dado, duas representações: painel visual e objeto serializável.</p></div><span class="tag">JSON + geodados</span></div><pre id="orbit-json">${escapeHtml(JSON.stringify(this.telemetryPacket(),null,2))}</pre></section>
      <section class="panel glass operation-validation"><span class="eyebrow">Checkpoint de operação</span><h3>Feche o ciclo energia → coleta → contato → downlink</h3><p>Mantenha bateria acima de 25%, evite saturar 50 GB e complete ao menos uma transferência para uma estação terrestre.</p><div class="operation-status-grid"><span id="operation-battery-status" class="${t?.batteryPercent>=25?'ok':'warn'}">${t?.batteryPercent>=25?'✓':'○'} margem de bateria</span><span id="operation-buffer-status" class="${t?.dataStoredGb<50?'ok':'warn'}">${t?.dataStoredGb<50?'✓':'○'} buffer controlado</span><span id="operation-downlink-status" class="${t?.totalDownlinkedGb>0?'ok':'warn'}">${t?.totalDownlinkedGb>0?'✓':'○'} downlink concluído</span></div><button class="button primary" data-action="validate-operation">Validar operação · 240 XP</button></section>
    </div>`;
  }

  telemetryPacket(){const t=this.telemetry;if(!t)return {status:'waiting',orbit:{altitudeKm:this.altitudeKm,inclinationDeg:this.inclinationDeg}};return {time:t.elapsedSeconds,position:{lat:Number(t.latitudeDeg.toFixed(4)),lon:Number(t.longitudeDeg.toFixed(4)),altitudeKm:t.altitudeKm},power:{batteryPercent:Number(t.batteryPercent.toFixed(1)),generationW:Number(t.generationW.toFixed(0)),loadW:Number(t.loadW.toFixed(0)),eclipse:t.eclipse},communication:{station:t.station.name,contact:t.downlinkActive,quality:Number(t.linkQuality.toFixed(0))},data:{storedGb:Number(t.dataStoredGb.toFixed(2)),downlinkedGb:Number(t.totalDownlinkedGb.toFixed(2))}};}

  updateOrbitMetrics(){const alt=this.container.querySelector('#orbit-altitude-value'),inc=this.container.querySelector('#orbit-inclination-value'),period=this.container.querySelector('#orbit-period-metric'),speed=this.container.querySelector('#orbit-speed-metric'),cover=this.container.querySelector('#orbit-cover-metric');if(alt)alt.textContent=`${this.altitudeKm.toFixed(0)} km`;if(inc)inc.textContent=`${this.inclinationDeg.toFixed(1)}°`;if(period)period.textContent=OrbitMath.formatPeriod(OrbitMath.periodSeconds(this.altitudeKm));if(speed)speed.textContent=`${OrbitMath.velocityKmS(this.altitudeKm).toFixed(2)} km/s`;if(cover)cover.textContent=`${OrbitMath.footprintRadiusKm(this.altitudeKm).toFixed(0)} km`;}

  updateTrack(){const svg=this.container.querySelector('#orbit-world-map');if(!svg)return;const t=this.telemetry;const sat=svg.querySelector('#world-satellite');if(sat&&t){sat.setAttribute('cx',(t.longitudeDeg+180)/360*1000);sat.setAttribute('cy',(90-t.latitudeDeg)/180*500);}}

  updateRuntimeButtons(){const button=this.container?.querySelector('#orbit-toggle-button'),label=this.container?.querySelector('#orbit-running-label');if(button)button.textContent=this.running?'Pausar':'Continuar';if(label){label.textContent=this.running?'EXECUTANDO':'PAUSADA';label.className=this.running?'ok':'warn';}}

  updateLivePanels(){const t=this.telemetry;if(!this.container||!t)return;const set=(selector,text)=>{const el=this.container.querySelector(selector);if(el)el.textContent=text;};set('#earth-coordinate-text',`${t.latitudeDeg.toFixed(2)}°, ${t.longitudeDeg.toFixed(2)}°`);set('#earth-contact-text',t.downlinkActive?`Contato: ${t.station.name}`:'Sem contato de solo');set('#earth-altitude-live',`${t.altitudeKm.toFixed(0)} km`);set('#earth-velocity-live',`${t.velocityKmS.toFixed(2)} km/s`);set('#earth-period-live',OrbitMath.formatPeriod(t.periodSeconds));set('#earth-footprint-live',`${t.footprintKm.toFixed(0)} km`);set('#network-battery',`${t.batteryPercent.toFixed(1)}%`);set('#network-data',`${t.dataStoredGb.toFixed(2)} GB`);set('#network-station',t.station.name);set('#network-link',t.downlinkActive?`${t.linkQuality.toFixed(0)}%`:'SEM CONTATO');const link=this.container.querySelector('#network-link');if(link)link.className=t.downlinkActive?'ok':'warn';const json=this.container.querySelector('#orbit-json');if(json)json.textContent=JSON.stringify(this.telemetryPacket(),null,2);const marker=this.container.querySelector('#earth-satellite-marker');if(marker){const a=t.elapsedSeconds/t.periodSeconds*Math.PI*2;marker.setAttribute('cx',400+Math.cos(a)*295);marker.setAttribute('cy',280+Math.sin(a)*Math.max(70,220-Math.abs(this.inclinationDeg-50)*1.1));}const updateStatus=(selector,ok,label)=>{const el=this.container.querySelector(selector);if(el){el.className=ok?'ok':'warn';el.textContent=`${ok?'✓':'○'} ${label}`;}};updateStatus('#operation-battery-status',t.batteryPercent>=25,'margem de bateria');updateStatus('#operation-buffer-status',t.dataStoredGb<50,'buffer controlado');updateStatus('#operation-downlink-status',t.totalDownlinkedGb>0,'downlink concluído');this.container.querySelectorAll('.ground-station').forEach(el=>el.classList.remove('active'));const activeStation=this.container.querySelector(`.ground-station[data-station="${t.station.id}"]`);if(activeStation&&t.downlinkActive)activeStation.classList.add('active');this.updateTrack();}
}

export function createModule(){return new EarthOrbitModule();}

import { RocketSystem } from '../../core/launch/RocketSystem.js';
import { RocketFlightModel } from '../../core/launch/RocketFlightModel.js';
import { ImmersiveInputController } from '../../core/input/ImmersiveInputController.js';
import { LaunchExperienceModel } from '../../core/launch-remaster/LaunchExperienceModel.js';
import { LaunchRemasterSceneRenderer } from '../../rendering/LaunchRemasterSceneRenderer.js';
import { IMMERSIVE_VEHICLES, IMMERSIVE_INSPECTIONS, LAUNCH_CAMERA_PRESETS, VEHICLE_BY_ID, CAMERA_BY_ID } from '../../data/launchRemasterSystems.js';
import { LAUNCH_STATE_LABELS } from '../../data/launchSystems.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const format=(value,digits=0)=>Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:digits,minimumFractionDigits:digits});
const terminalStates=new Set(['ORBIT','FAILED','ABORTED']);

class LaunchRemasterModule {
  constructor(){
    this.container=null;this.context=null;this.experience=new LaunchExperienceModel({vehicleId:'atlas-h'});this.rocket=new RocketSystem(VEHICLE_BY_ID['atlas-h'].config);this.summary=this.rocket.summary();
    this.input=null;this.renderer=null;this.worker=null;this.fallback=null;this.fallbackTimer=0;this.replayTimer=0;this.telemetry={state:'PRELAUNCH',altitudeM:0,velocityMs:0,throttle:0,stage:1,elapsed:0,countdown:10,dynamicPressurePa:0,accelerationG:0,linkPercent:100};
    this.logs=[];this.lastState='PRELAUNCH';this.launched=false;this.paused=false;this.speed=3;this.helpOpen=false;this.inspectionOpen=false;this.replayOpen=false;this.settingsUnsub=null;
    this.onClick=e=>this.handleClick(e);this.onInput=e=>this.handleInput(e);this.onKeyDown=e=>this.handleKeyDown(e);
  }
  mount(container,context){
    this.container=container;this.context=context;container.addEventListener('click',this.onClick);container.addEventListener('input',this.onInput);addEventListener('keydown',this.onKeyDown);
    this.restoreProgress();this.render();this.startRenderer();this.startWorker();this.settingsUnsub=context.bus.on('settings:changed',()=>this.restartRenderer());
  }
  unmount(){
    clearInterval(this.fallbackTimer);clearInterval(this.replayTimer);this.worker?.postMessage({type:'stop'});this.worker?.terminate();this.worker=null;this.renderer?.destroy();this.input?.detach();this.settingsUnsub?.();
    this.container?.removeEventListener('click',this.onClick);this.container?.removeEventListener('input',this.onInput);removeEventListener('keydown',this.onKeyDown);
  }
  restoreProgress(){const done=this.context?.profileStore?.active?.().completedExperiences??[];for(const item of IMMERSIVE_INSPECTIONS)if(done.includes(`launch-remaster-inspection-${item.id}`))this.experience.inspections.add(item.id);}
  render(){
    const vehicle=VEHICLE_BY_ID[this.experience.vehicleId],camera=CAMERA_BY_ID[this.experience.cameraId],profile=this.context.settingsStore.getProfile(),snap=this.experience.snapshot();
    this.container.innerHTML=`<section class="launch-remaster-module quality-${profile.id}">
      <div class="launch-remaster-stage" id="launch-remaster-stage">
        <canvas id="launch-remaster-canvas" aria-label="Hangar, plataforma e voo espacial procedural em 3D e 360 graus"></canvas>
        <div class="launch-remaster-vignette" aria-hidden="true"></div><div class="launch-remaster-grain" aria-hidden="true"></div><div class="launch-remaster-shake" aria-hidden="true"></div>
        <header class="immersive-hud launch-remaster-top">
          <button class="hud-icon" data-action="back" aria-label="Voltar ao portal">←</button>
          <div class="target-chip"><span style="color:${vehicle.color}">${vehicle.symbol}</span><div><b id="lr-vehicle-name">${escapeHtml(vehicle.name)}</b><small>${escapeHtml(vehicle.className)}</small></div></div>
          <div class="launch-remaster-top-actions"><span class="hud-status" id="lr-state">${escapeHtml(LAUNCH_STATE_LABELS[this.telemetry.state]??this.telemetry.state)}</span><span class="hud-status"><b id="lr-fps">--</b> FPS</span><button class="hud-icon" data-action="toggle-help" aria-label="Ajuda">?</button><button class="hud-icon" data-action="fullscreen" aria-label="Tela cheia">⛶</button></div>
        </header>
        <div class="objective-chip launch-remaster-objective"><span>MISSÃO IMERSIVA</span><b id="lr-objective">Inspecione casco, motores, aviônica e plataforma. Depois, realize o lançamento.</b></div>
        <aside class="launch-remaster-telemetry immersive-hud">
          <div><span>ALT</span><b id="lr-altitude">0,0 km</b></div><div><span>VEL</span><b id="lr-velocity">0 m/s</b></div><div><span>Q</span><b id="lr-q">0,0 kPa</b></div><div><span>G</span><b id="lr-g">0,00</b></div><div><span>LINK</span><b id="lr-link">100%</b></div>
        </aside>
        <div class="launch-remaster-crosshair" aria-hidden="true"><i></i><i></i></div>
        <nav class="launch-vehicle-dock immersive-hud" aria-label="Escolha de veículo">${IMMERSIVE_VEHICLES.map(item=>`<button class="launch-vehicle-orb ${item.id===vehicle.id?'active':''}" data-action="select-vehicle" data-vehicle="${item.id}" style="--vehicle-color:${item.color}" title="${escapeHtml(item.summary)}"><i>${item.symbol}</i><span><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.className)}</small></span></button>`).join('')}</nav>
        <nav class="launch-camera-rail immersive-hud" aria-label="Câmeras 3D">${LAUNCH_CAMERA_PRESETS.map(item=>`<button class="${item.id===camera.id?'active':''}" data-action="select-camera" data-camera="${item.id}" title="${escapeHtml(item.description)}"><i>${item.short}</i><span>${escapeHtml(item.label)}</span></button>`).join('')}</nav>
        <div class="launch-action-stack immersive-hud">
          <button data-action="toggle-inspection">INSPEÇÃO <b>${snap.inspections.length}/4</b></button>
          <button data-action="move-pad">PLATAFORMA</button>
          <button class="launch-primary-action ${snap.inspectionReady?'ready':''}" data-action="start-launch" ${snap.inspectionReady?'':'disabled'}>${this.launched&&!terminalStates.has(this.telemetry.state)?'EM VOO':'LANÇAR'}</button>
          <button data-action="toggle-autopilot">AUTO ${snap.autopilot?'ON':'OFF'}</button>
          <button data-action="toggle-replay" ${this.experience.replay.length?'':'disabled'}>REPLAY</button>
          <button data-action="open-technical-panel">PAINEL</button>
          <button data-action="toggle-photo">FOTO</button>
        </div>
        <aside class="launch-inspection-drawer immersive-hud ${this.inspectionOpen?'open':''}" aria-hidden="${!this.inspectionOpen}">
          <button class="drawer-close" data-action="toggle-inspection">×</button><span class="eyebrow">Inspeção 360°</span><h3>Validação visual do veículo</h3><p>${escapeHtml(vehicle.summary)}</p>
          <div class="launch-inspection-list">${IMMERSIVE_INSPECTIONS.map(item=>`<article class="${snap.inspections.includes(item.id)?'done':''}"><button data-action="go-inspection" data-inspection="${item.id}"><i>${snap.inspections.includes(item.id)?'✓':'○'}</i><span><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.detail)}</small></span></button><button class="button small ${snap.inspections.includes(item.id)?'secondary':'primary'}" data-action="validate-inspection" data-inspection="${item.id}">${snap.inspections.includes(item.id)?'Revisar':'Validar'}</button></article>`).join('')}</div>
          <div class="launch-vehicle-specs">${vehicle.features.map(item=>`<span>${escapeHtml(item)}</span>`).join('')}<span>${format(this.summary.liftOffMassKg/1000,1)} t</span><span>T/W ${format(this.summary.twr,2)}</span><span>Δv ${format(this.summary.totalDeltaV)} m/s</span></div>
        </aside>
        <aside class="launch-replay-drawer immersive-hud ${this.replayOpen?'open':''}" aria-hidden="${!this.replayOpen}">
          <button class="drawer-close" data-action="toggle-replay">×</button><span class="eyebrow">Replay cinematográfico</span><h3>Revise cada momento do voo</h3>
          <input id="lr-replay-range" type="range" min="0" max="${Math.max(0,this.experience.replay.length-1)}" value="${this.experience.replayIndex}" data-action="replay-range">
          <div class="launch-replay-controls"><button data-action="replay-step" data-step="-10">−10</button><button data-action="replay-play">${this.experience.replayPlaying?'PAUSAR':'PLAY'}</button><button data-action="replay-step" data-step="10">+10</button></div>
          <div class="launch-replay-readout" id="lr-replay-readout">${this.replayReadout()}</div>
        </aside>
        <aside class="launch-help-overlay immersive-hud ${this.helpOpen?'open':''}" aria-hidden="${!this.helpOpen}"><button class="drawer-close" data-action="toggle-help">×</button><span class="eyebrow">Controles</span><h3>Inspeção e voo como jogo</h3><div class="control-grid"><span><kbd>Mouse</kbd> câmera 360°</span><span><kbd>WASD</kbd> olhar/mover em câmeras livres</span><span><kbd>C</kbd> próxima câmera</span><span><kbd>V</kbd> próximo veículo</span><span><kbd>L</kbd> lançar</span><span><kbd>R</kbd> recentralizar</span><span><kbd>P</kbd> modo foto</span><span><kbd>Esc</kbd> sair do fullscreen</span></div><p>No celular, use os joysticks virtuais. Gamepads são reconhecidos automaticamente.</p></aside>
        <div class="virtual-joysticks launch-joysticks"><div class="virtual-joystick left" data-stick="left"><div class="joystick-ring"></div><div class="joystick-knob"></div><span>MOVER</span></div><div class="virtual-joystick right" data-stick="right"><div class="joystick-ring"></div><div class="joystick-knob"></div><span>OLHAR</span></div></div>
        <div class="launch-flight-controls immersive-hud ${this.launched?'visible':''}"><button data-action="flight-pause">${this.paused?'▶':'Ⅱ'}</button><button data-action="flight-speed" data-speed="1" class="${this.speed===1?'active':''}">1×</button><button data-action="flight-speed" data-speed="3" class="${this.speed===3?'active':''}">3×</button><button data-action="flight-speed" data-speed="6" class="${this.speed===6?'active':''}">6×</button><button class="danger" data-action="flight-abort">ABORT</button></div>
        <div class="launch-remaster-loading" id="launch-remaster-loading"><i></i><span>Carregando hangar imersivo…</span></div>
      </div>
    </section>`;
    this.updatePhotoMode();
  }
  startRenderer(){
    const canvas=this.container.querySelector('#launch-remaster-canvas');this.input=new ImmersiveInputController({canvas,root:this.container,leftStick:this.container.querySelector('[data-stick="left"]'),rightStick:this.container.querySelector('[data-stick="right"]')});this.input.attach();
    this.renderer=new LaunchRemasterSceneRenderer(canvas,this.context.settingsStore,this.input,this.experience,{onTelemetry:data=>this.updateRendererTelemetry(data),onContextState:state=>this.context.toast(state==='lost'?'Contexto gráfico perdido. A sessão de voo foi preservada.':'Contexto gráfico restaurado.')});this.renderer.setVehicle(VEHICLE_BY_ID[this.experience.vehicleId]);this.renderer.setTelemetry(this.telemetry);this.renderer.start();setTimeout(()=>this.container.querySelector('#launch-remaster-loading')?.classList.add('hidden'),500);
  }
  restartRenderer(){if(!this.container?.isConnected)return;this.renderer?.destroy();this.input?.detach();this.worker?.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});this.startRenderer();this.context.toast(`Gráficos atualizados para ${this.context.settingsStore.getProfile().label}.`);}
  startWorker(){
    try{this.worker=new Worker(new URL('../../workers/launch.worker.js',import.meta.url),{type:'module'});this.worker.onmessage=event=>this.handleWorkerMessage(event.data);this.worker.onerror=()=>this.enableFallback();this.configureWorker();}catch{this.enableFallback();}
  }
  enableFallback(){this.worker?.terminate();this.worker=null;this.fallback=new RocketFlightModel(this.summary.flightConfig);this.telemetry=this.fallback.telemetry();this.renderer?.setTelemetry(this.telemetry);this.context.toast('Worker indisponível: simulação executada no núcleo local.');}
  configureWorker(){if(!this.worker)return;this.worker.postMessage({type:'configure',payload:this.summary.flightConfig});this.worker.postMessage({type:'quality',payload:{quality:this.context.settingsStore.getProfile().id}});this.worker.postMessage({type:'speed',payload:{speed:this.speed}});}
  handleWorkerMessage(message){if(message.type==='telemetry')this.receiveTelemetry(message.payload);if(message.type==='events')this.receiveEvents(message.payload);if(message.type==='complete')this.completeFlight(message.payload);}
  receiveTelemetry(t){this.telemetry=t;this.renderer?.setTelemetry(t);if(this.launched)this.experience.record(t);if(t.state!==this.lastState){this.autoCameraForState(t.state);this.lastState=t.state;}this.updateTelemetryDom();}
  receiveEvents(events=[]){for(const event of events){this.logs.unshift(event);if(this.logs.length>18)this.logs.pop();}}
  startFallbackLoop(){clearInterval(this.fallbackTimer);this.fallbackTimer=setInterval(()=>{if(this.paused||!this.fallback)return;for(let i=0;i<this.speed;i++)this.fallback.step(.12);this.receiveTelemetry(this.fallback.telemetry());this.receiveEvents(this.fallback.drainEvents());if(terminalStates.has(this.fallback.state)){clearInterval(this.fallbackTimer);this.completeFlight(this.fallback.telemetry());}},100);}
  selectVehicle(id){if(this.launched&&!terminalStates.has(this.telemetry.state)){this.context.toast('Finalize ou aborte o voo antes de trocar de veículo.');return;}if(!this.experience.selectVehicle(id))return;const vehicle=VEHICLE_BY_ID[id];this.rocket=new RocketSystem(vehicle.config);this.summary=this.rocket.summary();this.telemetry={state:'PRELAUNCH',altitudeM:0,velocityMs:0,throttle:0,stage:1,elapsed:0,countdown:10,dynamicPressurePa:0,accelerationG:0,linkPercent:100};this.launched=false;this.lastState='PRELAUNCH';this.configureWorker();this.renderer?.setVehicle(vehicle);this.renderer?.setTelemetry(this.telemetry);this.render();this.startRendererAfterRender();}
  startRendererAfterRender(){this.renderer?.destroy();this.input?.detach();this.startRenderer();}
  selectCamera(id){this.experience.setCamera(id);this.updateCameraDom();}
  autoCameraForState(state){if(!this.experience.autopilot)return;const map={COUNTDOWN:'pad',IGNITION:'engine',ASCENT_STAGE_1:'chase',MAX_Q:'onboard',STAGE_SEPARATION:'booster',ASCENT_STAGE_2:'chase',ORBIT_INSERTION:'onboard',ORBIT:'cinematic'};const camera=map[state];if(camera){this.experience.setCamera(camera);this.updateCameraDom();}const stage=this.container.querySelector('.launch-remaster-stage');stage?.classList.toggle('intense-shake',['IGNITION','MAX_Q'].includes(state));if(state==='STAGE_SEPARATION')stage?.classList.add('separation-flash');setTimeout(()=>stage?.classList.remove('separation-flash'),500);}
  validateInspection(id){const result=this.experience.completeInspection(id);if(!result.ok){this.context.toast(result.reason);this.experience.setCamera(IMMERSIVE_INSPECTIONS.find(item=>item.id===id)?.camera||'orbit');this.updateCameraDom();return;}const awarded=this.context.profileStore.addXp(result.inspection.xp,`launch-remaster-inspection-${id}`);this.context.toast(awarded?`${result.inspection.label}: +${result.inspection.xp} XP.`:'Inspeção já registrada para este perfil.');this.render();this.startRendererAfterRender();}
  startLaunch(){
    if(this.launched&&!terminalStates.has(this.telemetry.state)){this.context.toast('O veículo já está em voo.');return;}if(!this.experience.inspectionReady()){this.inspectionOpen=true;this.render();this.startRendererAfterRender();this.context.toast('Conclua as quatro inspeções visuais antes da ignição.');return;}
    this.launched=true;this.paused=false;this.experience.replay=[];this.experience.replayIndex=0;this.logs=[];this.lastState='PRELAUNCH';this.experience.setCamera('pad');
    if(this.worker){this.configureWorker();this.worker.postMessage({type:'start'});}else{this.fallback=new RocketFlightModel(this.summary.flightConfig);this.fallback.start();this.startFallbackLoop();}
    this.context.profileStore.addXp(220,'launch-remaster-clearance');this.updateCameraDom();this.container.querySelector('.launch-flight-controls')?.classList.add('visible');this.context.toast('Sequência automática autorizada. Acompanhe as câmeras e a telemetria.');
  }
  completeFlight(t){this.receiveTelemetry(t);this.paused=false;if(t.state==='ORBIT'){const vehicle=this.experience.vehicleId;const awarded=this.context.profileStore.addXp(520,`launch-remaster-flight-${vehicle}`);this.context.toast(awarded?'Órbita alcançada no modo imersivo: +520 XP.':'Este voo imersivo já foi registrado.');this.experience.setCamera('cinematic');}else if(t.state==='ABORTED')this.context.toast('Abortagem concluída em estado seguro.');else this.context.toast('Missão encerrada. Use o replay para analisar o voo.');this.updateCameraDom();}
  togglePause(){if(!this.launched||terminalStates.has(this.telemetry.state))return;this.paused=!this.paused;if(this.worker)this.worker.postMessage({type:this.paused?'pause':'resume'});else if(!this.paused)this.startFallbackLoop();else clearInterval(this.fallbackTimer);this.updatePauseDom();}
  abort(){if(!this.launched||terminalStates.has(this.telemetry.state))return;if(this.worker)this.worker.postMessage({type:'abort',payload:{reason:'Abortagem comandada no modo imersivo.'}});else{this.fallback.abort('Abortagem comandada no modo imersivo.');clearInterval(this.fallbackTimer);this.completeFlight(this.fallback.telemetry());}}
  openReplay(){if(!this.experience.replay.length)return;this.replayOpen=!this.replayOpen;if(this.replayOpen){this.experience.setCamera('cinematic');this.experience.setReplayIndex(this.experience.replay.length-1);this.applyReplayTelemetry();}else{clearInterval(this.replayTimer);this.experience.replayPlaying=false;this.renderer?.setTelemetry(this.telemetry);}this.updateDrawerClasses();}
  toggleReplayPlay(){if(!this.experience.replay.length)return;const playing=this.experience.toggleReplay();clearInterval(this.replayTimer);if(playing)this.replayTimer=setInterval(()=>{const sample=this.experience.stepReplay(2);if(!sample||this.experience.replayIndex>=this.experience.replay.length-1){clearInterval(this.replayTimer);this.experience.replayPlaying=false;}this.applyReplayTelemetry();},80);this.updateReplayDom();}
  applyReplayTelemetry(){const sample=this.experience.replayTelemetry();if(sample)this.renderer?.setTelemetry(sample);this.updateReplayDom();}
  handleClick(event){const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='back')return this.context.onBack();
    if(action==='select-vehicle')return this.selectVehicle(target.dataset.vehicle);
    if(action==='select-camera')return this.selectCamera(target.dataset.camera);
    if(action==='toggle-inspection'){this.inspectionOpen=!this.inspectionOpen;this.updateDrawerClasses();return;}
    if(action==='go-inspection'){const item=IMMERSIVE_INSPECTIONS.find(row=>row.id===target.dataset.inspection);if(item)this.selectCamera(item.camera);return;}
    if(action==='validate-inspection')return this.validateInspection(target.dataset.inspection);
    if(action==='move-pad'){this.selectCamera('pad');return;}
    if(action==='start-launch')return this.startLaunch();
    if(action==='toggle-autopilot'){this.experience.autopilot=!this.experience.autopilot;target.textContent=`AUTO ${this.experience.autopilot?'ON':'OFF'}`;return;}
    if(action==='toggle-help'){this.helpOpen=!this.helpOpen;this.updateDrawerClasses();return;}
    if(action==='toggle-replay')return this.openReplay();
    if(action==='open-technical-panel'){sessionStorage.setItem('cosmos-ds-technical-target',this.experience.vehicleId==='horizon-sts'?'shuttle':'capsule');return this.context.openModule('technical-operations');}
    if(action==='toggle-photo'){this.experience.togglePhotoMode();this.updatePhotoMode();return;}
    if(action==='fullscreen')return this.renderer?.requestFullscreen();
    if(action==='flight-pause')return this.togglePause();
    if(action==='flight-speed'){this.speed=Number(target.dataset.speed)||1;this.worker?.postMessage({type:'speed',payload:{speed:this.speed}});this.container.querySelectorAll('[data-action="flight-speed"]').forEach(button=>button.classList.toggle('active',Number(button.dataset.speed)===this.speed));return;}
    if(action==='flight-abort')return this.abort();
    if(action==='replay-play')return this.toggleReplayPlay();
    if(action==='replay-step'){this.experience.stepReplay(Number(target.dataset.step)||1);this.applyReplayTelemetry();return;}
  }
  handleInput(event){if(event.target.id==='lr-replay-range'){this.experience.setReplayIndex(event.target.value);this.applyReplayTelemetry();}}
  handleKeyDown(event){if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const key=event.key.toLowerCase();if(key==='c'){this.experience.cycleCamera();this.updateCameraDom();}if(key==='v'){const index=IMMERSIVE_VEHICLES.findIndex(item=>item.id===this.experience.vehicleId);this.selectVehicle(IMMERSIVE_VEHICLES[(index+1)%IMMERSIVE_VEHICLES.length].id);}if(key==='l')this.startLaunch();if(key==='r')this.renderer?.resetCamera();if(key==='p'){this.experience.togglePhotoMode();this.updatePhotoMode();}if(key==='i'){this.inspectionOpen=!this.inspectionOpen;this.updateDrawerClasses();}}
  updateRendererTelemetry(data){const fps=this.container?.querySelector('#lr-fps');if(fps)fps.textContent=data.fps;const stage=this.container?.querySelector('.launch-remaster-stage');if(stage){stage.dataset.renderer=data.webgl?'webgl2':'canvas2d';stage.style.setProperty('--render-resolution',`"${data.resolution}"`);}}
  updateTelemetryDom(){const t=this.telemetry,set=(selector,value)=>{const el=this.container?.querySelector(selector);if(el)el.textContent=value;};set('#lr-state',LAUNCH_STATE_LABELS[t.state]??t.state);set('#lr-altitude',`${format((t.reportedAltitudeM??t.altitudeM)/1000,1)} km`);set('#lr-velocity',`${format(t.velocityMs)} m/s`);set('#lr-q',`${format((t.dynamicPressurePa||0)/1000,1)} kPa`);set('#lr-g',format(t.accelerationG||0,2));set('#lr-link',`${format(t.linkPercent??100)}%`);const objective=this.container?.querySelector('#lr-objective');if(objective)objective.textContent=this.objectiveForState(t.state);}
  updateCameraDom(){const current=this.experience.cameraId;this.container?.querySelectorAll('[data-action="select-camera"]').forEach(button=>button.classList.toggle('active',button.dataset.camera===current));}
  updatePauseDom(){const button=this.container?.querySelector('[data-action="flight-pause"]');if(button)button.textContent=this.paused?'▶':'Ⅱ';}
  updateDrawerClasses(){this.container?.querySelector('.launch-inspection-drawer')?.classList.toggle('open',this.inspectionOpen);this.container?.querySelector('.launch-replay-drawer')?.classList.toggle('open',this.replayOpen);this.container?.querySelector('.launch-help-overlay')?.classList.toggle('open',this.helpOpen);}
  updatePhotoMode(){this.container?.querySelector('.launch-remaster-stage')?.classList.toggle('photo-mode',this.experience.photoMode);}
  updateReplayDom(){const range=this.container?.querySelector('#lr-replay-range');if(range){range.max=Math.max(0,this.experience.replay.length-1);range.value=this.experience.replayIndex;}const readout=this.container?.querySelector('#lr-replay-readout');if(readout)readout.innerHTML=this.replayReadout();const play=this.container?.querySelector('[data-action="replay-play"]');if(play)play.textContent=this.experience.replayPlaying?'PAUSAR':'PLAY';}
  replayReadout(){const t=this.experience.replayTelemetry();if(!t)return'<span>Sem telemetria registrada.</span>';return`<span><b>${escapeHtml(LAUNCH_STATE_LABELS[t.state]??t.state)}</b></span><span>T+ ${format(t.elapsed,1)} s</span><span>${format((t.reportedAltitudeM??t.altitudeM)/1000,1)} km</span><span>${format(t.velocityMs)} m/s</span>`;}
  objectiveForState(state){return({PRELAUNCH:'Inspecione o veículo e libere a missão.',COUNTDOWN:'Contagem regressiva em andamento.',IGNITION:'Ignição confirmada. Observe pluma, vibração e plataforma.',ASCENT_STAGE_1:'Acompanhe a subida e a pressão dinâmica.',MAX_Q:'Max Q: maior carga aerodinâmica.',STAGE_SEPARATION:'Separação do primeiro estágio.',ASCENT_STAGE_2:'Segundo estágio em aceleração.',ORBIT_INSERTION:'Queima final de inserção orbital.',ORBIT:'Órbita alcançada. Abra o replay cinematográfico.',ABORTED:'Missão abortada em estado seguro.',FAILED:'Analise a telemetria e repita a missão.'}[state]??'Acompanhe a missão.');}
}

export const createModule=()=>new LaunchRemasterModule();

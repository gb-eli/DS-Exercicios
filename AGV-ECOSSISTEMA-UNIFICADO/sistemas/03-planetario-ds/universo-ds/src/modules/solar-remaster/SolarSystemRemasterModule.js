import { SOLAR_BODIES, ORBITAL_FLEET, BODY_BY_ID, SATELLITE_BY_ID, SOLAR_TOUR } from '../../data/solarSystemBodies.js';
import { SolarNavigationModel } from '../../core/solar/SolarNavigationModel.js';
import { ImmersiveInputController } from '../../core/input/ImmersiveInputController.js';
import { SolarSystemSceneRenderer } from '../../rendering/SolarSystemSceneRenderer.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const modeLabel=mode=>({orbit:'Inspeção 360°',free:'Voo livre',cinematic:'Câmera cinematográfica'}[mode]??mode);

class SolarSystemRemasterModule {
  constructor(){
    this.container=null;this.context=null;this.navigation=new SolarNavigationModel({targetId:'earth'});this.input=null;this.renderer=null;this.telemetry=null;
    this.drawerOpen=false;this.helpOpen=false;this.fleetOpen=false;this.lastAnnouncedTarget='earth';this.unsubSettings=null;
    this.onClick=e=>this.handleClick(e);this.onKeyDown=e=>this.handleKeyDown(e);
  }
  mount(container,context){
    this.container=container;this.context=context;container.addEventListener('click',this.onClick);addEventListener('keydown',this.onKeyDown);
    this.restoreProgress();this.render();this.startRenderer();
    this.unsubSettings=context.bus.on('settings:changed',()=>this.restartRenderer());
  }
  unmount(){this.renderer?.destroy();this.input?.detach();this.unsubSettings?.();this.container?.removeEventListener('click',this.onClick);removeEventListener('keydown',this.onKeyDown);}
  restoreProgress(){const completed=this.context.profileStore.active().completedExperiences;for(const body of SOLAR_BODIES)if(completed.includes(`solar-scan-${body.id}`))this.navigation.visited.add(body.id);for(const sat of ORBITAL_FLEET)if(completed.includes(`solar-satellite-${sat.id}`))this.navigation.visited.add(`sat:${sat.id}`);}
  render(){
    const profile=this.context.settingsStore.getProfile();
    this.container.innerHTML=`<section class="solar-remaster-module quality-${profile.id}">
      <div class="solar-immersive-stage" id="solar-immersive-stage">
        <canvas id="solar-remaster-canvas" aria-label="Sistema Solar procedural 3D navegável em 360 graus"></canvas>
        <div class="solar-vignette" aria-hidden="true"></div><div class="solar-cockpit-lines" aria-hidden="true"></div>
        <header class="immersive-hud solar-top-hud">
          <button class="hud-icon" data-action="back" aria-label="Voltar ao portal">←</button>
          <div class="target-chip"><span id="solar-target-symbol">⊕</span><div><b id="solar-target-name">Terra</b><small id="solar-target-type">Planeta oceânico</small></div></div>
          <div class="solar-top-actions"><span class="hud-status" id="solar-camera-mode">${modeLabel(this.navigation.cameraMode)}</span><span class="hud-status"><b id="solar-fps">--</b> FPS</span><button class="hud-icon" data-action="toggle-help" aria-label="Ajuda">?</button><button class="hud-icon" data-action="fullscreen" aria-label="Tela cheia">⛶</button></div>
        </header>
        <div class="objective-chip solar-objective" id="solar-objective-chip"><span>MISSÃO VISUAL</span><b>Visite mundos, inspecione um satélite e complete um tour 360°.</b></div>
        <aside class="solar-flight-telemetry immersive-hud">
          <div><span>ALVO</span><b id="solar-distance">--</b></div><div><span>VELOCIDADE</span><b id="solar-speed">0,0</b></div><div><span>CÂMERA</span><b id="solar-mode-short">360°</b></div><div><span>VISITADOS</span><b id="solar-visited">1</b></div>
        </aside>
        <div class="solar-crosshair" aria-hidden="true"><i></i><i></i></div>
        <div class="solar-action-stack immersive-hud">
          <button data-action="cycle-camera" title="Trocar câmera (C)">CÂMERA</button><button data-action="toggle-autopilot" id="solar-autopilot-button" title="Piloto automático">AUTO ON</button><button data-action="overview" title="Visão geral (O)">MAPA</button><button data-action="scan" title="Escanear alvo">SCAN</button><button data-action="toggle-fleet" title="Satélites terrestres">SAT</button><button data-action="toggle-photo" title="Modo foto (P)">FOTO</button>
        </div>
        <nav class="planet-dock immersive-hud" aria-label="Selecionar planeta">${SOLAR_BODIES.map(body=>`<button class="planet-orb ${body.id==='earth'?'active':''}" style="--planet-a:${body.colors[0]};--planet-b:${body.colors[2]}" data-action="select-body" data-body="${body.id}" title="${escapeHtml(body.name)}"><i>${body.symbol}</i><span>${escapeHtml(body.name)}</span></button>`).join('')}</nav>
        <div class="satellite-rail immersive-hud" id="satellite-rail" aria-hidden="true"><div class="satellite-rail-head"><b>Frota orbital da Terra</b><button class="hud-icon" data-action="toggle-fleet">×</button></div>${ORBITAL_FLEET.map(item=>`<button data-action="select-satellite" data-satellite="${item.id}"><i style="--sat-color:${item.color}">${item.symbol}</i><span><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.type)}</small></span></button>`).join('')}</div>
        <aside class="solar-scan-drawer immersive-hud" id="solar-scan-drawer" aria-hidden="true"><button class="drawer-close" data-action="close-scan">×</button><div id="solar-scan-content">${this.scanContent('earth')}</div></aside>
        <aside class="solar-help-overlay immersive-hud" id="solar-help-overlay" aria-hidden="true"><button class="drawer-close" data-action="toggle-help">×</button><span class="eyebrow">Controles imersivos</span><h3>Pilote como em um jogo</h3><div class="control-grid"><span><kbd>WASD</kbd> mover</span><span><kbd>Mouse</kbd> olhar / girar</span><span><kbd>Q / E</kbd> descer / subir</span><span><kbd>Shift</kbd> acelerar</span><span><kbd>C</kbd> trocar câmera</span><span><kbd>T</kbd> próximo mundo</span><span><kbd>O</kbd> sistema inteiro</span><span><kbd>P</kbd> modo foto</span></div><p>Celular: joystick esquerdo movimenta; joystick direito controla a câmera. Controles de gamepad são detectados automaticamente.</p></aside>
        <div class="virtual-joysticks" aria-label="Controles virtuais"><div class="virtual-joystick left" data-stick="left"><div class="joystick-ring"></div><div class="joystick-knob"></div><span>MOVER</span></div><div class="virtual-joystick right" data-stick="right"><div class="joystick-ring"></div><div class="joystick-knob"></div><span>OLHAR</span></div></div>
        <div class="mobile-flight-buttons immersive-hud"><button data-action="mobile-up">▲</button><button data-action="cycle-camera">C</button><button data-action="scan">SCAN</button><button data-action="mobile-down">▼</button></div>
        <div class="solar-loading" id="solar-loading"><i></i><span>Inicializando navegação espacial…</span></div>
      </div>
    </section>`;
  }
  startRenderer(){
    const canvas=this.container.querySelector('#solar-remaster-canvas');
    this.input=new ImmersiveInputController({canvas,root:this.container,leftStick:this.container.querySelector('[data-stick="left"]'),rightStick:this.container.querySelector('[data-stick="right"]')});this.input.attach();
    this.renderer=new SolarSystemSceneRenderer(canvas,this.context.settingsStore,this.input,this.navigation,{onTelemetry:t=>this.updateTelemetry(t),onTargetChange:id=>this.targetChanged(id),onContextState:state=>this.context.toast(state==='lost'?'Contexto gráfico perdido. Tentando preservar a sessão.':'Contexto gráfico restaurado.')});
    this.renderer.start();setTimeout(()=>this.container.querySelector('#solar-loading')?.classList.add('hidden'),500);
  }
  restartRenderer(){if(!this.container?.isConnected)return;this.renderer?.destroy();this.input?.detach();this.startRenderer();this.context.toast(`Renderização atualizada para ${this.context.settingsStore.getProfile().label}.`);}
  handleClick(event){const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
    if(action==='back')return this.context.onBack();
    if(action==='select-body')return this.renderer?.selectTarget(target.dataset.body);
    if(action==='select-satellite'){this.fleetOpen=false;this.updateFleet();return this.renderer?.selectTarget(`sat:${target.dataset.satellite}`);}
    if(action==='cycle-camera'){const mode=this.renderer?.toggleCamera();this.context.toast(`Câmera: ${modeLabel(mode)}.`);this.updateMode();return;}
    if(action==='toggle-autopilot'){this.renderer?.toggleAutopilot();this.updateMode();return;}
    if(action==='overview'){this.renderer?.overview();this.updateTargetUi('sun');return;}
    if(action==='scan'){this.drawerOpen=true;this.updateDrawer();this.awardScan();return;}
    if(action==='open-knowledge'){const id=this.navigation.targetId.startsWith('sat:')?'satellite-tech':this.navigation.targetId;sessionStorage.setItem('cosmos-ds-knowledge-target',id);this.context.openModule('curiosity-center');return;}
    if(action==='close-scan'){this.drawerOpen=false;this.updateDrawer();return;}
    if(action==='toggle-fleet'){this.fleetOpen=!this.fleetOpen;this.updateFleet();return;}
    if(action==='toggle-help'){this.helpOpen=!this.helpOpen;this.updateHelp();return;}
    if(action==='toggle-photo'){this.navigation.togglePhotoMode();this.container.querySelector('.solar-immersive-stage')?.classList.toggle('photo-mode',this.navigation.photoMode);return;}
    if(action==='fullscreen')return this.renderer?.requestFullscreen();
    if(action==='mobile-up'){this.navigation.freePosition.y+=1.2;return;}
    if(action==='mobile-down'){this.navigation.freePosition.y-=1.2;return;}
  }
  handleKeyDown(event){if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const key=event.key.toLowerCase();if(key==='c'){this.renderer?.toggleCamera();this.updateMode();}if(key==='t')this.renderer?.cycleTarget(1);if(key==='o'){this.renderer?.overview();this.updateTargetUi('sun');}if(key==='p'){this.navigation.togglePhotoMode();this.container.querySelector('.solar-immersive-stage')?.classList.toggle('photo-mode',this.navigation.photoMode);}if(key==='r')this.renderer?.resetCamera();if(key==='i'){this.drawerOpen=!this.drawerOpen;this.updateDrawer();}}
  targetChanged(id){this.updateTargetUi(id);this.drawerOpen=false;this.updateDrawer();if(id.startsWith('sat:')){const sat=id.slice(4);const awarded=this.context.profileStore.addXp(90,`solar-satellite-${sat}`);if(awarded)this.context.toast('Satélite inspecionado em 360°: +90 XP.');}this.checkTour();}
  updateTargetUi(id){
    const data=id.startsWith('sat:')?SATELLITE_BY_ID[id.slice(4)]:BODY_BY_ID[id];if(!data)return;const symbol=id.startsWith('sat:')?data.symbol:data.symbol;
    const set=(selector,value)=>{const el=this.container.querySelector(selector);if(el)el.textContent=value;};set('#solar-target-symbol',symbol);set('#solar-target-name',data.name);set('#solar-target-type',data.category??data.type);
    this.container.querySelectorAll('.planet-orb').forEach(button=>button.classList.toggle('active',button.dataset.body===id));this.container.querySelectorAll('[data-action="select-satellite"]').forEach(button=>button.classList.toggle('active',`sat:${button.dataset.satellite}`===id));
    const content=this.container.querySelector('#solar-scan-content');if(content)content.innerHTML=this.scanContent(id);
  }
  scanContent(id){const isSat=id.startsWith('sat:'),data=isSat?SATELLITE_BY_ID[id.slice(4)]:BODY_BY_ID[id];if(!data)return'';if(isSat)return `<span class="eyebrow">INSPEÇÃO ORBITAL</span><div class="scan-symbol" style="--scan-color:${data.color}">${data.symbol}</div><h2>${escapeHtml(data.name)}</h2><p class="scan-lead">${escapeHtml(data.purpose)}</p><div class="scan-metrics"><span><b>TIPO</b>${escapeHtml(data.type)}</span><span><b>FOCO DS</b>${escapeHtml(data.ds)}</span></div><button class="button small primary" data-action="open-knowledge">Abrir na Enciclopédia</button>`;return `<span class="eyebrow">VARREDURA PLANETÁRIA</span><div class="scan-symbol planet" style="--scan-color:${data.colors[2]}">${data.symbol}</div><h2>${escapeHtml(data.name)}</h2><p class="scan-lead">${escapeHtml(data.short)}</p><div class="scan-metrics"><span><b>CLASSE</b>${escapeHtml(data.category)}</span><span><b>GRAVIDADE</b>${escapeHtml(data.gravity)}</span><span><b>TEMPERATURA</b>${escapeHtml(data.temperature)}</span><span><b>DIA</b>${escapeHtml(data.day)}</span><span><b>ANO</b>${escapeHtml(data.year)}</span><span><b>FOCO DS</b>${escapeHtml(data.ds)}</span></div><button class="button small primary" data-action="open-knowledge">Curiosidades, fontes e tecnologia</button>`;}
  awardScan(){const id=this.navigation.targetId,key=id.startsWith('sat:')?`solar-satellite-${id.slice(4)}`:`solar-scan-${id}`,xp=id.startsWith('sat:')?90:70;this.navigation.visited.add(id);const awarded=this.context.profileStore.addXp(xp,key);if(awarded)this.context.toast(`Varredura registrada: +${xp} XP.`);this.updateObjective();this.checkTour();}
  checkTour(){const completed=this.context.profileStore.active().completedExperiences;const core=SOLAR_TOUR.every(id=>this.navigation.visited.has(id)||completed.includes(`solar-scan-${id}`));const sat=ORBITAL_FLEET.some(item=>this.navigation.visited.has(`sat:${item.id}`)||completed.includes(`solar-satellite-${item.id}`));if(core&&sat){const awarded=this.context.profileStore.addXp(450,'solar-remaster-certification');if(awarded)this.context.toast('Certificação Navegador do Sistema Solar: +450 XP.');}this.updateObjective();}
  updateTelemetry(t){this.telemetry=t;const set=(selector,value)=>{const el=this.container.querySelector(selector);if(el)el.textContent=value;};set('#solar-distance',t.distance<10?`${t.distance.toFixed(1)} u`:`${t.distance.toFixed(0)} u`);set('#solar-speed',`${t.speed.toFixed(1)} u/s`);set('#solar-mode-short',t.cameraMode==='orbit'?'360°':t.cameraMode==='free'?'LIVRE':'CINE');set('#solar-visited',String(t.visited));set('#solar-fps',t.fps||'--');this.updateMode();}
  updateMode(){const snap=this.navigation.snapshot(),set=(selector,value)=>{const el=this.container.querySelector(selector);if(el)el.textContent=value;};set('#solar-camera-mode',modeLabel(snap.cameraMode));set('#solar-mode-short',snap.cameraMode==='orbit'?'360°':snap.cameraMode==='free'?'LIVRE':'CINE');const auto=this.container.querySelector('#solar-autopilot-button');if(auto){auto.textContent=snap.autopilot?'AUTO ON':'AUTO OFF';auto.classList.toggle('active',snap.autopilot);}}
  updateDrawer(){const drawer=this.container.querySelector('#solar-scan-drawer');if(!drawer)return;drawer.classList.toggle('open',this.drawerOpen);drawer.setAttribute('aria-hidden',String(!this.drawerOpen));if(this.drawerOpen)drawer.querySelector('#solar-scan-content').innerHTML=this.scanContent(this.navigation.targetId);}
  updateFleet(){const rail=this.container.querySelector('#satellite-rail');rail?.classList.toggle('open',this.fleetOpen);rail?.setAttribute('aria-hidden',String(!this.fleetOpen));}
  updateHelp(){const help=this.container.querySelector('#solar-help-overlay');help?.classList.toggle('open',this.helpOpen);help?.setAttribute('aria-hidden',String(!this.helpOpen));}
  updateObjective(){const completed=this.context.profileStore.active().completedExperiences;const required=['earth','moon','mars','jupiter','saturn'];const bodyCount=required.filter(id=>this.navigation.visited.has(id)||completed.includes(`solar-scan-${id}`)).length;const satDone=ORBITAL_FLEET.some(item=>this.navigation.visited.has(`sat:${item.id}`)||completed.includes(`solar-satellite-${item.id}`));const chip=this.container.querySelector('#solar-objective-chip b');if(chip)chip.textContent=`Mundos essenciais ${bodyCount}/5 · satélite ${satDone?'inspecionado':'pendente'} · use SCAN para registrar.`;}
}

export function createModule(){return new SolarSystemRemasterModule();}

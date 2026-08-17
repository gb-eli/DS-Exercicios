const QUALITY_PROFILES = {
  automatic: {id:'automatic',label:'Automático',description:'Analisa o dispositivo e escolhe o equilíbrio recomendado.',renderScale:.9,starLayers:3,atmosphere:true,orbitalLines:true,motionFactor:1,fpsTarget:50},
  performance: {id:'performance',label:'Máximo desempenho',description:'Prioriza FPS, bateria e compatibilidade com equipamentos modestos.',renderScale:.58,starLayers:1,atmosphere:false,orbitalLines:false,motionFactor:.55,fpsTarget:45},
  balanced: {id:'balanced',label:'Equilibrado',description:'Boa definição com efeitos moderados e consumo controlado.',renderScale:.82,starLayers:2,atmosphere:true,orbitalLines:true,motionFactor:.85,fpsTarget:50},
  experience: {id:'experience',label:'Máxima experiência',description:'Ativa mais camadas de estrelas, atmosfera e animações.',renderScale:1,starLayers:4,atmosphere:true,orbitalLines:true,motionFactor:1.15,fpsTarget:60}
};
const DEFAULTS={
  qualityMode:'automatic',resolvedQuality:'balanced',reducedMotion:false,performanceOverlay:false,sound:true,tutorialSeen:false,autoReduceQuality:true,
  highContrast:false,largeText:false,captions:true,simplifiedControls:false,screenReaderHints:true
};
export class SettingsStore {
  constructor(storage,bus){this.storage=storage;this.bus=bus;this.state={...DEFAULTS,reducedMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false,...this.storage.get('settings',{})};}
  get(){return structuredClone(this.state);}
  getProfile(){const id=this.state.qualityMode==='automatic'?this.state.resolvedQuality:this.state.qualityMode;return QUALITY_PROFILES[id]??QUALITY_PROFILES.balanced;}
  getProfiles(){return QUALITY_PROFILES;}
  update(patch){this.state={...this.state,...patch};this.storage.set('settings',this.state);this.bus.emit('settings:changed',this.get());}
  setQualityMode(mode){if(!QUALITY_PROFILES[mode])return;this.update({qualityMode:mode});}
  resolveAutomatic(mode){if(!QUALITY_PROFILES[mode]||mode==='automatic')return;this.update({resolvedQuality:mode});}
  importState(state){if(!state||typeof state!=='object')throw new Error('Configurações inválidas.');const qualityMode=QUALITY_PROFILES[state.qualityMode]?state.qualityMode:'automatic';const resolvedQuality=QUALITY_PROFILES[state.resolvedQuality]&&state.resolvedQuality!=='automatic'?state.resolvedQuality:'balanced';this.state={...DEFAULTS,...state,qualityMode,resolvedQuality};this.storage.set('settings',this.state);this.bus.emit('settings:changed',this.get());return this.get();}
}

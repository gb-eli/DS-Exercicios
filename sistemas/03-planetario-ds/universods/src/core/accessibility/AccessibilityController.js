export class AccessibilityController {
  constructor(settingsStore,root=globalThis.document?.body){this.settingsStore=settingsStore;this.root=root;}
  apply(state=this.settingsStore.get()){
    if(!this.root)return;
    const classes={
      'reduced-motion':state.reducedMotion,
      'high-contrast':state.highContrast,
      'large-text':state.largeText,
      'captions-enabled':state.captions,
      'simplified-controls':state.simplifiedControls
    };
    for(const [name,on] of Object.entries(classes))this.root.classList.toggle(name,Boolean(on));
    this.root.dataset.quality=this.settingsStore.getProfile().id;
    this.root.dataset.accessibility=[state.highContrast?'contrast':'',state.largeText?'large':'',state.simplifiedControls?'simple':''].filter(Boolean).join('-')||'default';
  }
}

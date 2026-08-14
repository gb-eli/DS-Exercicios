export class XRSupportService {
  constructor(navigatorRef=globalThis.navigator,secureRef=globalThis.isSecureContext){this.navigator=navigatorRef;this.secureContext=Boolean(secureRef);}
  async detect(){
    const xr=this.navigator?.xr;
    const result={secureContext:this.secureContext,webxr:Boolean(xr),inline:false,immersiveVR:false,immersiveAR:false,reason:''};
    if(!this.secureContext){result.reason='WebXR exige HTTPS ou localhost.';return result;}
    if(!xr?.isSessionSupported){result.reason='WebXR não está disponível neste navegador.';return result;}
    for(const [key,mode] of [['inline','inline'],['immersiveVR','immersive-vr'],['immersiveAR','immersive-ar']]){
      try{result[key]=await xr.isSessionSupported(mode);}catch{result[key]=false;}
    }
    result.reason=result.immersiveVR?'Experiência imersiva disponível.':'Modo 360° permanece como fallback principal.';
    return result;
  }
  async requestVR(options={}){
    if(!this.secureContext||!this.navigator?.xr?.requestSession)throw new Error('WebXR imersivo indisponível.');
    return this.navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor','hand-tracking'],...options});
  }
}

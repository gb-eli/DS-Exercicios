import { LOADING_STAGES } from '../../data/guidedJourneySystems.js';
const waitFrame=()=>new Promise(resolve=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>resolve());else setTimeout(resolve,0);});
export class ModuleLoadCoordinator {
  constructor(registry){this.registry=registry;this.prefetchHandle=null;this.prefetchedId=null;this.stylePromise=null;}
  async load(id,{onProgress}={}){
    const report=stage=>onProgress?.({...stage,moduleId:id,at:new Date().toISOString()});
    report(LOADING_STAGES[0]);await waitFrame();
    report(LOADING_STAGES[1]);const module=await Promise.all([this.registry.load(id),this.ensureLabStyles(id)]).then(items=>items[0]);
    report(LOADING_STAGES[2]);await waitFrame();
    report(LOADING_STAGES[3]);await waitFrame();
    report(LOADING_STAGES[4]);return module;
  }
  ensureLabStyles(id){
    if(id==='journey-center'||typeof document==='undefined')return Promise.resolve(true);
    const existing=document.querySelector('#cosmos-lab-styles');if(existing?.dataset.ready==='true')return Promise.resolve(true);
    if(this.stylePromise)return this.stylePromise;
    this.stylePromise=new Promise((resolve,reject)=>{const link=existing||document.createElement('link');link.id='cosmos-lab-styles';link.rel='stylesheet';link.href='./src/styles-labs.css';link.onload=()=>{link.dataset.ready='true';resolve(true);};link.onerror=()=>{this.stylePromise=null;reject(new Error('Não foi possível carregar os estilos do laboratório.'));};if(!existing)document.head.appendChild(link);});return this.stylePromise;
  }
  releaseLabStyles(){if(typeof document==='undefined')return;document.querySelector('#cosmos-lab-styles')?.remove();this.stylePromise=null;}
  schedulePrefetch(id){
    this.cancelPrefetch();if(!id||this.prefetchedId===id)return false;
    const connection=typeof navigator!=='undefined'?navigator.connection:null;
    if(connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType))return false;
    const run=()=>{this.prefetchHandle=null;this.registry.prefetch(id).then(()=>{this.prefetchedId=id;}).catch(()=>{});};
    if(typeof requestIdleCallback==='function')this.prefetchHandle=requestIdleCallback(run,{timeout:3500});
    else this.prefetchHandle=setTimeout(run,1200);
    return true;
  }
  cancelPrefetch(){if(this.prefetchHandle===null)return;if(typeof cancelIdleCallback==='function')cancelIdleCallback(this.prefetchHandle);else clearTimeout(this.prefetchHandle);this.prefetchHandle=null;}
  destroy(){this.cancelPrefetch();this.releaseLabStyles();}
}

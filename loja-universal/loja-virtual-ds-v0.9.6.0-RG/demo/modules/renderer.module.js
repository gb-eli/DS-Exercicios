import { loadStyle, loadScript } from './shared.module.js';
export async function mount({onProgress}={}){
 await loadStyle('./styles-renderer.css',{onProgress,progress:34});
 await loadScript('./renderer-profile.js',{globalName:'DSRendererProfile',onProgress,progress:82});
 window.DSRendererProfile?.apply?.(window.DSPerformance?.actualMode||'intermediate','module');
 return {renderer:window.DSRendererProfile?.state?.actual||'lite',profiles:['lite','advanced','cinematic'],premiumAssets:['ultra-ldr-2k','realism-ldr-2k'],qualityPreserved:true};
}

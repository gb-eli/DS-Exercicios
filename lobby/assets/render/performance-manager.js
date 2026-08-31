export const QUALITY_ORDER=['low','medium','high','ultra'];

export function detectPerformanceProfile({mobile=matchMedia('(pointer:coarse)').matches,hardware=Number(navigator.deviceMemory||4),cores=Number(navigator.hardwareConcurrency||4),saveData=!!navigator.connection?.saveData,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
  const constrained=saveData||hardware<=4||cores<=4;
  const lowEnd=constrained;
  const highEnd=!mobile&&!saveData&&hardware>=8&&cores>=8;
  return {mobile,hardware,cores,saveData,reducedMotion,constrained,lowEnd,highEnd};
}

export function chooseInitialQuality(profile,requested=null){
  if(profile.saveData||profile.hardware<=2||profile.cores<=2)return 'low';
  if(requested&&QUALITY_ORDER.includes(requested)){
    if(profile.mobile&&['high','ultra'].includes(requested))return profile.constrained?'low':'medium';
    if(profile.constrained&&requested!=='low')return 'low';
    return requested;
  }
  if(profile.mobile)return profile.constrained?'low':'medium';
  if(profile.lowEnd)return 'low';
  if(profile.highEnd)return 'high';
  return 'medium';
}

export function createResizeController({canvas,renderer,camera,getPixelRatio}){
  let dirty=true,lastW=0,lastH=0,lastPixel=0;
  const request=()=>{dirty=true;};
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(request):null;
  observer?.observe(canvas);
  window.addEventListener('resize',request,{passive:true});
  window.visualViewport?.addEventListener?.('resize',request,{passive:true});
  function update(force=false){
    if(!dirty&&!force)return false;
    dirty=false;
    const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height)),pixel=Math.max(.5,Number(getPixelRatio?.()||1));
    if(!force&&w===lastW&&h===lastH&&Math.abs(pixel-lastPixel)<.001)return false;
    lastW=w;lastH=h;lastPixel=pixel;
    renderer.setPixelRatio(pixel);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    return true;
  }
  function dispose(){observer?.disconnect();window.removeEventListener('resize',request);window.visualViewport?.removeEventListener?.('resize',request);}
  return {request,update,dispose};
}

export function createAdaptiveQualityController({initialQuality='medium',profile,onSample,onQualityRequest,manualHoldMs=120000}={}){
  let quality=QUALITY_ORDER.includes(initialQuality)?initialQuality:'medium',frames=0,windowStart=performance.now(),fps=60,lastAdaptive=0,lowWindows=0,highWindows=0,manualUntil=0;
  function qualityChanged(next,{manual=false}={}){if(QUALITY_ORDER.includes(next))quality=next;if(manual)manualUntil=performance.now()+manualHoldMs;lowWindows=0;highWindows=0;}
  function reset(){frames=0;windowStart=performance.now();lowWindows=0;highWindows=0;}
  function tick(nowMs,detail={}){
    frames++;const elapsed=nowMs-windowStart;if(elapsed<1800)return null;
    fps=Math.round(frames*1000/Math.max(1,elapsed));frames=0;windowStart=nowMs;onSample?.({fps,quality,...detail});
    if(nowMs<manualUntil||nowMs-lastAdaptive<9000)return fps;
    if(fps<27){lowWindows++;highWindows=0;}else if(fps>54){highWindows++;lowWindows=0;}else{lowWindows=0;highWindows=0;}
    const i=QUALITY_ORDER.indexOf(quality);
    if(lowWindows>=2&&i>0){const next=QUALITY_ORDER[i-1];onQualityRequest?.(next,{reason:'fps-low',fps});quality=next;lastAdaptive=nowMs;lowWindows=0;highWindows=0;}
    else if(highWindows>=4&&!profile?.mobile&&!profile?.saveData&&i<QUALITY_ORDER.length-1){const next=QUALITY_ORDER[i+1];onQualityRequest?.(next,{reason:'fps-high',fps});quality=next;lastAdaptive=nowMs;lowWindows=0;highWindows=0;}
    return fps;
  }
  return {tick,reset,qualityChanged,getFPS:()=>fps,isManualHold:()=>performance.now()<manualUntil};
}

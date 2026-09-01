export const PARQUE_PERFORMANCE_VERSION='14.10.8.80-f7';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export const PARQUE_QUALITY_PRESETS=Object.freeze({
  low:Object.freeze({id:'low',label:'Eco',pixelRatio:0.82,treeCount:34,visitorCount:3,activeLights:2,weatherParticles:48,remoteAvatarDistance:24,labelDistance:18,shadowSize:512,shadows:false,targetFps:30}),
  medium:Object.freeze({id:'medium',label:'Médio',pixelRatio:1.0,treeCount:56,visitorCount:5,activeLights:5,weatherParticles:110,remoteAvatarDistance:34,labelDistance:26,shadowSize:1024,shadows:true,targetFps:45}),
  high:Object.freeze({id:'high',label:'Alto',pixelRatio:1.18,treeCount:72,visitorCount:7,activeLights:7,weatherParticles:190,remoteAvatarDistance:42,labelDistance:34,shadowSize:1536,shadows:true,targetFps:55}),
  ultra:Object.freeze({id:'ultra',label:'Ultra',pixelRatio:1.35,treeCount:80,visitorCount:8,activeLights:8,weatherParticles:280,remoteAvatarDistance:48,labelDistance:40,shadowSize:2048,shadows:true,targetFps:60})
});

const ORDER=Object.freeze(['low','medium','high','ultra']);

export function detectParquePerformanceProfile({width=globalThis.innerWidth||1280,height=globalThis.innerHeight||720}={}){
  const coarse=!!globalThis.matchMedia?.('(pointer:coarse)')?.matches;
  const reducedMotion=!!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const reducedData=!!globalThis.navigator?.connection?.saveData;
  const hardware=Math.max(1,Number(globalThis.navigator?.hardwareConcurrency||4));
  const memory=Math.max(1,Number(globalThis.navigator?.deviceMemory||4));
  const compact=Number(width)<720||Number(height)<520;
  const constrained=reducedData||memory<=3||hardware<=4;
  const weak=memory<=2||hardware<=2;
  return Object.freeze({coarse,reducedMotion,reducedData,hardware,memory,compact,constrained,weak});
}

export function chooseParqueInitialQuality(profile={},requested='auto'){
  if(PARQUE_QUALITY_PRESETS[requested])return requested;
  if(profile.weak||profile.reducedData)return'low';
  if(profile.constrained||profile.compact||profile.coarse)return'medium';
  if(Number(profile.memory||4)>=8&&Number(profile.hardware||4)>=8)return'high';
  return'medium';
}

export function resolveParqueAccessibility(state={},profile=detectParquePerformanceProfile()){
  const graphics=state.graphics||{},accessibility=state.accessibility||{};
  const reducedMotion=accessibility.reducedMotion??graphics.reducedMotion??profile.reducedMotion;
  const reduceFlashes=accessibility.reduceFlashes??graphics.reduceFlashes??reducedMotion;
  const highContrast=accessibility.highContrast??graphics.highContrast??false;
  const largeTouchTargets=accessibility.largeTouchTargets??profile.coarse;
  return Object.freeze({reducedMotion:!!reducedMotion,reduceFlashes:!!reduceFlashes,highContrast:!!highContrast,largeTouchTargets:!!largeTouchTargets});
}

export function qualityBudget(quality='medium',accessibility={}){
  const base=PARQUE_QUALITY_PRESETS[quality]||PARQUE_QUALITY_PRESETS.medium;
  const motionFactor=accessibility.reducedMotion?.65:1;
  return Object.freeze({...base,weatherParticles:Math.max(24,Math.round(base.weatherParticles*motionFactor))});
}

export function createParqueAdaptiveQualityController({initialQuality='medium',profile={},enabled=true,onQualityRequest=()=>{}}={}){
  let quality=PARQUE_QUALITY_PRESETS[initialQuality]?initialQuality:'medium',samples=[],lastChange=0,poor=0,strong=0;
  function request(next,reason,now){if(next===quality||!PARQUE_QUALITY_PRESETS[next])return false;quality=next;lastChange=now;samples=[];poor=strong=0;onQualityRequest(next,{reason,at:now});return true;}
  function sample(fps,now=performance.now()){
    if(!enabled||!Number.isFinite(fps))return quality;
    samples.push(clamp(fps,1,144));if(samples.length>12)samples.shift();if(samples.length<5)return quality;
    const avg=samples.reduce((a,b)=>a+b,0)/samples.length,target=PARQUE_QUALITY_PRESETS[quality].targetFps,index=ORDER.indexOf(quality),cooldown=now-lastChange<6500;
    poor=avg<Math.max(22,target-11)?poor+1:Math.max(0,poor-1);
    strong=avg>target+7?strong+1:Math.max(0,strong-1);
    if(!cooldown&&poor>=3&&index>0)request(ORDER[index-1],'fps-low',now);
    else if(!cooldown&&strong>=7&&index<ORDER.length-1&&!profile.constrained&&!profile.reducedData)request(ORDER[index+1],'fps-stable',now);
    return quality;
  }
  return Object.freeze({sample,getQuality:()=>quality,setQuality:(next,reason='manual')=>request(next,reason,performance.now()),getAverage:()=>samples.length?samples.reduce((a,b)=>a+b,0)/samples.length:0});
}

export function createParqueTouchActionBar({canvas,enabled=true,largeTargets=true,onAction=()=>{}}={}){
  if(!enabled||!canvas?.parentElement||typeof document==='undefined')return Object.freeze({setMode(){},announce(){},remove(){}});
  const host=canvas.parentElement,root=document.createElement('div');root.className='agv-parque-touch-actions';root.setAttribute('role','group');root.setAttribute('aria-label','Controles da atração');
  root.style.cssText='position:absolute;right:12px;bottom:78px;z-index:36;display:none;gap:8px;align-items:center;pointer-events:auto;';
  const live=document.createElement('div');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');live.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;';
  const make=(id,label)=>{const b=document.createElement('button');b.type='button';b.dataset.action=id;b.textContent=label;b.style.cssText=`min-width:${largeTargets?64:52}px;min-height:${largeTargets?52:44}px;border-radius:14px;border:1px solid rgba(255,255,255,.35);background:rgba(4,12,18,.88);color:#fff;font:800 13px system-ui;padding:8px 12px;box-shadow:0 6px 18px rgba(0,0,0,.28);touch-action:none;`;const down=e=>{e.preventDefault();onAction(id,true,e);},up=e=>{e.preventDefault();onAction(id,false,e);};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b._cleanup=()=>{b.removeEventListener('pointerdown',down);b.removeEventListener('pointerup',up);b.removeEventListener('pointercancel',up);};return b;};
  const primary=make('primary','AÇÃO'),secondary=make('secondary','SAIR');root.append(primary,secondary,live);host.style.position=host.style.position||'relative';host.append(root);
  function setMode(mode='free'){
    const cfg={free:null,parkour:['PULAR','CANCELAR'],race:['ACELERAR','FREAR'],coaster:['PASSEIO','SAIR'],shooting:['MIRAR/TOCAR','SAIR'],slide:['PASSEIO','SAIR'],spectator:['ASSISTIR','SAIR']}[mode]||null;
    root.style.display=cfg?'flex':'none';if(!cfg)return;primary.textContent=cfg[0];secondary.textContent=cfg[1];primary.disabled=mode==='coaster'||mode==='shooting'||mode==='slide'||mode==='spectator';primary.style.opacity=primary.disabled?'.62':'1';root.dataset.mode=mode;
  }
  function announce(message){live.textContent='';requestAnimationFrame(()=>{live.textContent=String(message||'');});}
  function remove(){primary._cleanup?.();secondary._cleanup?.();root.remove();}
  return Object.freeze({setMode,announce,remove,element:root});
}

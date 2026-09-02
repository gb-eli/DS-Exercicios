export const GRAPHICS_CALIBRATION_VERSION=1;
export const GRAPHICS_CALIBRATION_STORAGE_KEY='agv:lobby:graphics-calibration-v94';
export const GRAPHICS_QUALITY_ORDER=Object.freeze(['low','medium','high','ultra']);

const MAX_PROFILE_AGE_MS=30*24*60*60*1000;
const MAX_SAMPLES=12;
const MIN_SAMPLES=5;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const finite=value=>Number.isFinite(Number(value))?Number(value):null;
const qualityIndex=quality=>Math.max(0,GRAPHICS_QUALITY_ORDER.indexOf(String(quality||'')));
const normalizeQuality=(quality,fallback='medium')=>GRAPHICS_QUALITY_ORDER.includes(String(quality||''))?String(quality):fallback;
const quantile=(values,ratio)=>{const sorted=values.filter(Number.isFinite).sort((a,b)=>a-b);if(!sorted.length)return null;const index=(sorted.length-1)*clamp(ratio,0,1),lower=Math.floor(index),upper=Math.ceil(index);return lower===upper?sorted[lower]:sorted[lower]+(sorted[upper]-sorted[lower])*(index-lower);};
const rounded=(value,digits=2)=>Number.isFinite(value)?Number(value.toFixed(digits)):null;

export function detectCalibrationDevice({deviceMemory=globalThis.navigator?.deviceMemory,hardwareConcurrency=globalThis.navigator?.hardwareConcurrency,saveData=globalThis.navigator?.connection?.saveData,reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,coarse=globalThis.matchMedia?.('(pointer:coarse)')?.matches,width=globalThis.innerWidth||1280}={}){
  const memory=clamp(Number(deviceMemory)||4,1,32),cores=clamp(Number(hardwareConcurrency)||4,1,32),mobile=!!coarse||Number(width)<760;
  const memoryBucket=memory<=2?2:memory<=4?4:memory<=8?8:16,coreBucket=cores<=2?2:cores<=4?4:cores<=8?8:16;
  const constrained=!!saveData||memory<=3||cores<=3;
  return Object.freeze({memory,cores,mobile,coarse:!!coarse,saveData:!!saveData,reducedMotion:!!reducedMotion,constrained,key:`m${memoryBucket}-c${coreBucket}-${mobile?'mobile':'desktop'}-${saveData?'save':'normal'}`});
}

export function calibrationQualityCeiling(device=detectCalibrationDevice()){
  if(device.saveData||device.memory<=2||device.cores<=2)return'low';
  if(device.mobile){if(device.memory>=8&&device.cores>=8&&!device.reducedMotion)return'high';return'medium';}
  if(device.memory>=12&&device.cores>=10&&!device.reducedMotion)return'ultra';
  if(device.memory>=8&&device.cores>=8)return'high';
  return device.constrained?'medium':'high';
}

export function constrainCalibrationQuality(quality,device=detectCalibrationDevice()){
  const normalized=normalizeQuality(quality),ceiling=calibrationQualityCeiling(device);
  return GRAPHICS_QUALITY_ORDER[Math.min(qualityIndex(normalized),qualityIndex(ceiling))];
}

export function summarizeCalibrationWindow(samples=[],quality='medium',device=detectCalibrationDevice(),memory={}){
  const normalized=normalizeQuality(quality),fpsValues=samples.map(sample=>finite(sample?.fps)).filter(Number.isFinite),frameValues=samples.map(sample=>finite(sample?.frameTimeMs)).filter(Number.isFinite);
  if(!fpsValues.length)return null;
  const avg=fpsValues.reduce((sum,value)=>sum+value,0)/fpsValues.length,variance=fpsValues.reduce((sum,value)=>sum+(value-avg)**2,0)/fpsValues.length,stdDev=Math.sqrt(variance),p10=quantile(fpsValues,.1),p95Frame=quantile(frameValues.length?frameValues:fpsValues.map(value=>1000/value),.95);
  const targets={low:{floor:23,upgrade:37},medium:{floor:28,upgrade:47},high:{floor:36,upgrade:55},ultra:{floor:43,upgrade:72}}[normalized];
  const gpuMb=finite(memory.estimatedGpuMemoryMb),heapUsed=finite(memory.jsHeapUsedMb),heapLimit=finite(memory.jsHeapLimitMb),heapRatio=heapUsed!=null&&heapLimit>0?heapUsed/heapLimit:null,gpuLimit=device.memory<=2?160:device.memory<=4?320:device.memory<=8?640:960;
  const lowRatio=fpsValues.filter(value=>value<targets.floor).length/fpsValues.length,instability=avg>0?stdDev/avg:1,memoryPressure=(gpuMb!=null&&gpuMb>gpuLimit)||(heapRatio!=null&&heapRatio>.82);
  const poor=avg<targets.floor||p10<targets.floor-6||p95Frame>42||lowRatio>=.4||memoryPressure;
  const severe=avg<18||p95Frame>64||(gpuMb!=null&&gpuMb>gpuLimit*1.35)||(heapRatio!=null&&heapRatio>.92);
  const strong=!memoryPressure&&avg>=targets.upgrade&&p10>=targets.floor+8&&p95Frame<25&&instability<.15;
  return Object.freeze({samples:fpsValues.length,averageFps:rounded(avg),p10Fps:rounded(p10),p95FrameTimeMs:rounded(p95Frame),instability:rounded(instability,3),lowRatio:rounded(lowRatio,3),estimatedGpuMemoryMb:gpuMb,jsHeapRatio:rounded(heapRatio,3),gpuLimitMb:gpuLimit,poor,severe,strong,memoryPressure});
}

export function createGraphicsCalibrator({storage=globalThis.localStorage||null,now=()=>Date.now(),device=detectCalibrationDevice(),getPreference=()=> 'auto',onRecommendation=()=>{}}={}){
  const sessions=new Map();
  const blankStore=()=>({version:GRAPHICS_CALIBRATION_VERSION,deviceKey:device.key,updatedAt:now(),worlds:{}});
  function readStore(){
    try{
      const parsed=JSON.parse(storage?.getItem?.(GRAPHICS_CALIBRATION_STORAGE_KEY)||'null');
      if(!parsed||parsed.version!==GRAPHICS_CALIBRATION_VERSION||parsed.deviceKey!==device.key||now()-Number(parsed.updatedAt||0)>MAX_PROFILE_AGE_MS)return blankStore();
      return{...blankStore(),...parsed,worlds:parsed.worlds&&typeof parsed.worlds==='object'?parsed.worlds:{}};
    }catch{return blankStore();}
  }
  let learned=readStore();
  function persist(){try{learned.updatedAt=now();storage?.setItem?.(GRAPHICS_CALIBRATION_STORAGE_KEY,JSON.stringify(learned));return true;}catch{return false;}}
  function worldKey(value){return String(value||'unknown-world').slice(0,80);}
  function sessionFor(worldId,currentQuality='medium'){
    const id=worldKey(worldId);let session=sessions.get(id);
    if(!session){session={worldId:id,currentQuality:normalizeQuality(currentQuality),samples:[],memory:{},startedAt:now(),lastEvaluationAt:0,lastDecisionAt:0,poorWindows:0,strongWindows:0,stableWindows:0,lastStats:null,lastReason:'hardware-baseline'};sessions.set(id,session);}
    return session;
  }
  function isAutomatic(){return String(getPreference?.()||'auto')==='auto';}
  function initialQuality(worldId,fallback='medium'){
    const id=worldKey(worldId),baseline=constrainCalibrationQuality(fallback,device),saved=learned.worlds[id];
    const recommended=saved&&Number(saved.confidence||0)>=2&&now()-Number(saved.updatedAt||0)<=MAX_PROFILE_AGE_MS?constrainCalibrationQuality(saved.quality,device):baseline;
    const session=sessionFor(id,recommended);session.currentQuality=recommended;session.lastReason=saved?.reason||'hardware-baseline';
    return recommended;
  }
  function noteQuality(worldId,quality,{manual=false,reason='runtime'}={}){
    const session=sessionFor(worldId,quality);session.currentQuality=normalizeQuality(quality,session.currentQuality);session.lastReason=String(reason||'runtime');
    if(manual||!isAutomatic()){session.samples=[];session.poorWindows=session.strongWindows=session.stableWindows=0;}
    return session.currentQuality;
  }
  function updateMemory(worldId,metrics={}){
    const session=sessionFor(worldId,metrics.quality);for(const key of['estimatedGpuMemoryMb','jsHeapUsedMb','jsHeapLimitMb']){const value=finite(metrics[key]);if(value!=null)session.memory[key]=value;}
    return{...session.memory};
  }
  function remember(session,quality,reason,stats,confidenceDelta=1){
    const previous=learned.worlds[session.worldId]||{},confidence=clamp(Number(previous.confidence||0)+confidenceDelta,0,10);
    learned.worlds[session.worldId]={quality,confidence,reason,updatedAt:now(),averageFps:stats?.averageFps??null,p95FrameTimeMs:stats?.p95FrameTimeMs??null,estimatedGpuMemoryMb:stats?.estimatedGpuMemoryMb??session.memory.estimatedGpuMemoryMb??null};persist();
  }
  function recommend(session,next,reason,stats){
    const quality=constrainCalibrationQuality(next,device);if(quality===session.currentQuality)return null;
    const previous=session.currentQuality;session.currentQuality=quality;session.lastDecisionAt=now();session.samples=[];session.poorWindows=session.strongWindows=session.stableWindows=0;session.lastReason=reason;remember(session,quality,reason,stats,2);
    const decision={worldId:session.worldId,previousQuality:previous,quality,reason,stats,automatic:true,deviceKey:device.key,at:now()};
    try{onRecommendation?.(decision);}catch{}
    return decision;
  }
  function sample({worldId,fps,frameTimeMs,quality,estimatedGpuMemoryMb,jsHeapUsedMb,jsHeapLimitMb,hidden=false}={}){
    const session=sessionFor(worldId,quality);if(quality)session.currentQuality=normalizeQuality(quality,session.currentQuality);updateMemory(session.worldId,{estimatedGpuMemoryMb,jsHeapUsedMb,jsHeapLimitMb});
    if(!isAutomatic())return{status:'manual-lock',worldId:session.worldId,quality:session.currentQuality,automatic:false};
    const measuredFps=finite(fps);if(hidden||measuredFps==null||measuredFps<5||measuredFps>240)return{status:'ignored',worldId:session.worldId,quality:session.currentQuality,automatic:true};
    session.samples.push({fps:measuredFps,frameTimeMs:finite(frameTimeMs)??1000/measuredFps,at:now()});if(session.samples.length>MAX_SAMPLES)session.samples.shift();
    if(session.samples.length<MIN_SAMPLES||now()-session.lastEvaluationAt<4000)return{status:'warming',worldId:session.worldId,quality:session.currentQuality,samples:session.samples.length,automatic:true};
    session.lastEvaluationAt=now();const stats=summarizeCalibrationWindow(session.samples,session.currentQuality,device,session.memory);session.lastStats=stats;
    session.poorWindows=stats.poor?session.poorWindows+1:Math.max(0,session.poorWindows-1);session.strongWindows=stats.strong?session.strongWindows+1:Math.max(0,session.strongWindows-1);session.stableWindows=!stats.poor&&!stats.strong?session.stableWindows+1:0;
    const index=qualityIndex(session.currentQuality),sinceDecision=now()-session.lastDecisionAt,sinceStart=now()-session.startedAt;
    if(index>0&&(stats.severe||session.poorWindows>=2)&&sinceDecision>=12000)return recommend(session,GRAPHICS_QUALITY_ORDER[index-1],stats.memoryPressure?'memory-pressure':'frame-instability',stats)||{status:'steady',stats};
    const ceilingIndex=qualityIndex(calibrationQualityCeiling(device));
    if(index<ceilingIndex&&session.strongWindows>=3&&sinceStart>=24000&&sinceDecision>=45000)return recommend(session,GRAPHICS_QUALITY_ORDER[index+1],'stable-headroom',stats)||{status:'steady',stats};
    if(session.stableWindows>=3){remember(session,session.currentQuality,'stable-profile',stats,1);session.stableWindows=0;}
    return{status:'steady',worldId:session.worldId,quality:session.currentQuality,stats,automatic:true};
  }
  function setPreference(){for(const session of sessions.values()){session.samples=[];session.poorWindows=session.strongWindows=session.stableWindows=0;session.startedAt=now();}}
  function reset(worldId=null){if(worldId){delete learned.worlds[worldKey(worldId)];sessions.delete(worldKey(worldId));}else{learned=blankStore();sessions.clear();}persist();return true;}
  function getSummary(worldId){const id=worldKey(worldId),session=sessions.get(id),saved=learned.worlds[id];return{worldId:id,automatic:isAutomatic(),manualLock:!isAutomatic(),quality:session?.currentQuality||saved?.quality||null,recommendedQuality:saved?.quality||null,confidence:Number(saved?.confidence||0),reason:session?.lastReason||saved?.reason||'hardware-baseline',samples:session?.samples.length||0,stats:session?.lastStats||null,device:{...device,ceiling:calibrationQualityCeiling(device)}};}
  function snapshot(){return{version:GRAPHICS_CALIBRATION_VERSION,device:{...device,ceiling:calibrationQualityCeiling(device)},automatic:isAutomatic(),worlds:Object.fromEntries([...new Set([...Object.keys(learned.worlds),...sessions.keys()])].map(id=>[id,getSummary(id)]))};}
  return Object.freeze({initialQuality,noteQuality,updateMemory,sample,setPreference,reset,getSummary,snapshot,isAutomatic,getDevice:()=>({...device,ceiling:calibrationQualityCeiling(device)})});
}

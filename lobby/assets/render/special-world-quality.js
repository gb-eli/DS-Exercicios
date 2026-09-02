import { visualQualityProfile,rendererPixelRatio } from './visual-quality-profile.js?v=14.10.8.92-f90-graphics';

const QUALITY_ORDER=Object.freeze(['low','medium','high','ultra']);
const WORLD_OVERRIDES=Object.freeze({
  'parque-diversoes-agv':Object.freeze({distance:1.08,decor:.94,lights:1,particles:1,physical:false}),
  'museu-hardware':Object.freeze({distance:.9,decor:1.05,lights:.82,particles:.35,physical:true}),
  'museu-hardware-agv':Object.freeze({distance:.9,decor:1.05,lights:.82,particles:.35,physical:true}),
  'colegio-agv':Object.freeze({distance:1,decor:1,lights:.72,particles:.7,physical:false}),
  'labirinto-armadilhas':Object.freeze({distance:.72,decor:.82,lights:.55,particles:.45,physical:false})
});

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const qualityIndex=quality=>Math.max(0,QUALITY_ORDER.indexOf(QUALITY_ORDER.includes(quality)?quality:'medium'));
const constrained=profile=>Boolean(profile?.mobile||profile?.saveData||Number(profile?.hardware||profile?.memory||8)<=4||Number(profile?.cores||8)<=4);

export function specialWorldQualityProfile(quality='medium',profile={},worldId='colegio-agv'){
  const id=QUALITY_ORDER.includes(quality)?quality:'medium',rank=qualityIndex(id),base=visualQualityProfile(id,{...profile,saveData:!!profile?.saveData}),limits=WORLD_OVERRIDES[worldId]||WORLD_OVERRIDES['colegio-agv'],limited=constrained(profile);
  const distance=[58,88,126,172][rank]*limits.distance*(limited?.82:1);
  const decor=clamp([.38,.68,.9,1][rank]*limits.decor*(limited?.86:1),.24,1);
  const lightBudget=clamp([.08,.34,.68,1][rank]*limits.lights*(limited?.72:1),0,1);
  const particleBudget=clamp([.16,.45,.74,1][rank]*limits.particles*(limited?.7:1),0,1);
  const dprCap=limited?[.9,1,1.15,1.25][rank]:[1,1.25,1.55,1.85][rank];
  const shadows=worldId!=='labirinto-armadilhas'&&base.shadows&&!limited;
  return Object.freeze({
    id,rank,distance,mediumDistance:rank>=1?distance*.82:0,premiumDistance:rank>=2?distance*.58:0,
    decor,lightBudget,particleBudget,labelDistance:distance*(rank===0?.72:1),
    visitorBudget:clamp([.42,.68,.86,1][rank]*(limited?.8:1),.25,1),
    mediaTier:rank===0?0:rank===1?1:2,materialTier:rank===0?0:rank===1?1:rank===2?2:3,
    physicalMaterials:Boolean(limits.physical&&rank>=2&&!limited),
    shadows,shadowSize:shadows?(rank>=3?2048:1024):0,dpr:clamp(Math.min(rendererPixelRatio(id,profile,globalThis.devicePixelRatio||1),dprCap),.65,1.85),
    emissiveBoost:[.72,.9,1.08,1.22][rank],toneExposure:base.toneExposure,
    weatherBudget:clamp([.2,.48,.76,1][rank]*(limited?.7:1),.12,1)
  });
}

export function applySpecialRendererQuality(renderer,quality,profile,devicePixelRatio=1,worldId='colegio-agv'){
  const visual=specialWorldQualityProfile(quality,profile,worldId),ratio=Math.min(devicePixelRatio||1,visual.dpr);
  renderer?.setPixelRatio?.(ratio);
  if(renderer?.shadowMap)renderer.shadowMap.enabled=visual.shadows;
  return visual;
}

export function specialCount(total,budget,min=0){const count=Math.max(0,Number(total)||0);return Math.min(count,Math.max(Math.min(count,Number(min)||0),Math.ceil(count*clamp(Number(budget)||0,0,1))));}
export function specialDistanceVisible(distance,limit){return Number(limit)>0&&Number(distance)<=Number(limit);}

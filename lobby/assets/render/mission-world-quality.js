import { visualQualityProfile, rendererPixelRatio } from './visual-quality-profile.js?v=14.10.8.92-f90-graphics';

const WORLD_PRESETS=Object.freeze({
  'military-agv':Object.freeze({kind:'military',distance:1.08,surface:1,particles:.72,lights:.9,shadows:true,exposure:1.02}),
  'space-agv':Object.freeze({kind:'orbital',distance:.92,surface:.8,particles:1.18,lights:1.15,shadows:false,exposure:.92}),
  'moon-agv':Object.freeze({kind:'lunar',distance:1.04,surface:1.12,particles:.9,lights:.72,shadows:true,exposure:.9}),
  'mars-agv':Object.freeze({kind:'martian',distance:1.1,surface:1.2,particles:1.2,lights:.78,shadows:true,exposure:1.02}),
  default:Object.freeze({kind:'mission',distance:1,surface:1,particles:1,lights:1,shadows:true,exposure:1})
});

const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,Number(value)||0));

export function missionWorldQualityProfile(quality='medium',device={},worldId='default'){
  const base=visualQualityProfile(quality,device),preset=WORLD_PRESETS[worldId]||WORLD_PRESETS.default,tier=base.quality;
  const objectDistance={low:145,medium:215,high:305,ultra:410}[tier]*preset.distance;
  const detailDistance={low:38,medium:68,high:108,ultra:158}[tier]*preset.distance;
  const premiumDistance={low:0,medium:0,high:78,ultra:138}[tier]*preset.distance;
  const particleTier={low:.3,medium:.56,high:.8,ultra:1}[tier];
  const surfaceTier={low:.28,medium:.55,high:.8,ultra:1}[tier];
  return {...base,worldId,worldKind:preset.kind,
    objectDistance:Math.round(objectDistance),detailDistance:Math.round(detailDistance),premiumDistance:Math.round(premiumDistance),
    surfaceDetail:clamp(surfaceTier*preset.surface,.18,1),particleBudget:clamp(particleTier*preset.particles,.18,1),
    starBudget:clamp(particleTier*(preset.kind==='orbital'?1.12:1),.25,1),lightBudget:clamp(base.localLights*preset.lights,0,1),
    emissiveBoost:{low:.68,medium:.86,high:1,ultra:1.16}[tier],materialTier:base.facadeDetail,
    physicalMaterials:base.glass&&tier!=='low',weatherBudget:preset.kind==='martian'?clamp(.42+particleTier*.58):particleTier,
    shadows:!!(preset.shadows&&base.shadows),shadowSize:preset.shadows?base.shadowSize:0,toneExposure:base.toneExposure+(preset.exposure-1)
  };
}

export function applyMissionRendererQuality(renderer,quality='medium',device={},nativeDpr=1,worldId='default'){
  const profile=missionWorldQualityProfile(quality,device,worldId);
  renderer?.setPixelRatio?.(rendererPixelRatio(quality,device,nativeDpr));
  if(renderer?.shadowMap){renderer.shadowMap.enabled=profile.shadows;renderer.shadowMap.autoUpdate=profile.shadows;}
  if(renderer&&'toneMappingExposure'in renderer)renderer.toneMappingExposure=profile.toneExposure;
  return profile;
}

export function missionCount(total,ratio=1,min=0){
  const count=Math.max(0,Number(total)||0);return Math.max(Math.min(count,Number(min)||0),Math.min(count,Math.round(count*clamp(ratio))));
}

export function missionDistanceVisible(distance,profile,layer='object'){
  const limit=layer==='premium'?profile?.premiumDistance:layer==='detail'?profile?.detailDistance:profile?.objectDistance;
  return Number(distance)<=Math.max(0,Number(limit)||0);
}

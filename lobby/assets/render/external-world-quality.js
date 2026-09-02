import { visualQualityProfile, rendererPixelRatio } from './visual-quality-profile.js?v=14.10.8.96-f9411-graphics-streaming';
import { qualityFeatures } from './quality-feature-matrix.js?v=14.10.8.96-f9411-graphics-streaming';

const WORLD_FACTORS=Object.freeze({
  'vale-silicio':Object.freeze({detail:1.15,vegetation:1.0,lights:1.0}),
  'rural-agv':Object.freeze({detail:1.0,vegetation:1.18,lights:.72}),
  default:Object.freeze({detail:1,vegetation:1,lights:1})
});

export function externalWorldQualityProfile(quality='medium',device={},worldId='default'){
  const base=visualQualityProfile(quality,device),features=qualityFeatures(quality,device),factor=WORLD_FACTORS[worldId]||WORLD_FACTORS.default;
  const tier=base.quality;
  const objectDistance={low:150,medium:220,high:310,ultra:420}[tier];
  const detailDistance={low:42,medium:72,high:112,ultra:165}[tier];
  const premiumDistance={low:0,medium:0,high:74,ultra:132}[tier];
  return {...base,worldId,
    objectDistance:Math.round(objectDistance*factor.detail),
    detailDistance:Math.round(detailDistance*factor.detail),
    premiumDistance:Math.round(premiumDistance*factor.detail),
    vegetationBudget:Math.max(.18,Math.min(1,base.vegetation*factor.vegetation)),
    lightBudget:Math.max(0,Math.min(1,base.localLights*factor.lights)),
    roadDecorations:tier==='low'?0:tier==='medium'?.45:tier==='high'?.78:1,
    terrainDetail:tier==='low'?.35:tier==='medium'?.62:tier==='high'?.84:1,
    materialTier:features.materialTier,physicalMaterials:features.physicalMaterials,propBudget:features.props,particleBudget:features.particles,animatedDetail:features.animatedDetail,textureMaxSize:features.textureMaxSize,lodBias:features.lodBias,memoryBudgetMB:features.memoryBudgetMB
  };
}

export function applyExternalRendererQuality(renderer,quality='medium',device={},nativeDpr=1,worldId='default'){
  const profile=externalWorldQualityProfile(quality,device,worldId);
  renderer?.setPixelRatio?.(rendererPixelRatio(quality,device,nativeDpr));
  if(renderer?.shadowMap){renderer.shadowMap.enabled=!!profile.shadows;renderer.shadowMap.autoUpdate=!!profile.shadows;}
  if(renderer&&'toneMappingExposure' in renderer)renderer.toneMappingExposure=profile.toneExposure;
  return profile;
}

export function qualityCount(total,ratio=1,min=0){
  return Math.max(min,Math.min(Number(total)||0,Math.round((Number(total)||0)*Math.max(0,Math.min(1,Number(ratio)||0)))));
}

export function qualityDistanceVisible(distance,profile,layer='object'){
  const limit=layer==='premium'?profile?.premiumDistance:layer==='detail'?profile?.detailDistance:profile?.objectDistance;
  return Number(distance)<=Math.max(0,Number(limit)||0);
}

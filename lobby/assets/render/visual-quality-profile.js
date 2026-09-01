export const VISUAL_QUALITY_ORDER=Object.freeze(['low','medium','high','ultra']);
export const VISUAL_QUALITY_PROFILES=Object.freeze({
  low:Object.freeze({dpr:0.9,shadows:false,shadowSize:0,anisotropy:2,facadeDetail:0,roadDetail:0,vegetation:0.38,decorations:0.25,avatarDetail:0,localLights:0,glass:false,toneExposure:1.00}),
  medium:Object.freeze({dpr:1.1,shadows:false,shadowSize:0,anisotropy:4,facadeDetail:1,roadDetail:1,vegetation:0.62,decorations:0.55,avatarDetail:1,localLights:0.35,glass:false,toneExposure:1.04}),
  high:Object.freeze({dpr:1.4,shadows:true,shadowSize:1024,anisotropy:8,facadeDetail:2,roadDetail:2,vegetation:0.82,decorations:0.82,avatarDetail:2,localLights:0.7,glass:true,toneExposure:1.08}),
  ultra:Object.freeze({dpr:1.7,shadows:true,shadowSize:2048,anisotropy:12,facadeDetail:3,roadDetail:3,vegetation:1,decorations:1,avatarDetail:3,localLights:1,glass:true,toneExposure:1.12})
});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function normalizeVisualQuality(value='medium'){return VISUAL_QUALITY_PROFILES[value]?value:'medium';}
export function visualQualityProfile(value='medium',device={}){
  const quality=normalizeVisualQuality(value),base=VISUAL_QUALITY_PROFILES[quality];
  const mobile=!!device.mobile,saveData=!!device.saveData,hardware=Number(device.hardware||device.memory||8),cores=Number(device.cores||8),constrained=saveData||mobile&&hardware<=4||cores<=4;
  if(!constrained)return {...base,quality,constrained:false};
  return {...base,quality,constrained:true,dpr:Math.min(base.dpr,mobile?1.05:1.2),shadows:base.shadows&&quality==='ultra'&&hardware>=8&&cores>=8,shadowSize:base.shadows&&quality==='ultra'&&hardware>=8&&cores>=8?1024:0,anisotropy:Math.min(base.anisotropy,4),vegetation:base.vegetation*.72,decorations:base.decorations*.7,localLights:base.localLights*.55,glass:base.glass&&quality==='ultra'&&hardware>=8};
}
export function rendererPixelRatio(quality='medium',device={},nativeDpr=1){const p=visualQualityProfile(quality,device);return clamp(Math.min(Number(nativeDpr)||1,p.dpr),.65,1.8);}
export function visualTierAtLeast(quality='medium',minimum='high'){return VISUAL_QUALITY_ORDER.indexOf(normalizeVisualQuality(quality))>=VISUAL_QUALITY_ORDER.indexOf(normalizeVisualQuality(minimum));}
export function configureRendererVisualQuality(renderer,quality='medium',device={},nativeDpr=1){const p=visualQualityProfile(quality,device);renderer?.setPixelRatio?.(rendererPixelRatio(quality,device,nativeDpr));if(renderer?.shadowMap){renderer.shadowMap.enabled=!!p.shadows;renderer.shadowMap.autoUpdate=!!p.shadows;}if(renderer&&'toneMappingExposure'in renderer)renderer.toneMappingExposure=p.toneExposure;return p;}

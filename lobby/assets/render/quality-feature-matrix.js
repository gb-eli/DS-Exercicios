import { normalizeVisualQuality } from './visual-quality-profile.js?v=14.10.8.96-f9411-graphics-streaming';

const freeze=v=>Object.freeze(v);
export const QUALITY_FEATURE_MATRIX_VERSION=2;
export const QUALITY_FEATURE_MATRIX=freeze({
  low:freeze({materialTier:0,physicalMaterials:false,clearcoat:false,glassTransmission:0,reflections:0,normalDetail:0,shadowCasters:0,particles:.18,props:.28,vegetation:.38,decals:0,animatedDetail:.18,textureMaxSize:512,textureMipBias:1.25,lodBias:1.55,memoryBudgetMB:96,maxDynamicLights:2}),
  medium:freeze({materialTier:1,physicalMaterials:false,clearcoat:false,glassTransmission:0,reflections:.2,normalDetail:.35,shadowCasters:.2,particles:.42,props:.56,vegetation:.64,decals:.35,animatedDetail:.45,textureMaxSize:1024,textureMipBias:.55,lodBias:1.15,memoryBudgetMB:160,maxDynamicLights:5}),
  high:freeze({materialTier:2,physicalMaterials:true,clearcoat:true,glassTransmission:.32,reflections:.62,normalDetail:.72,shadowCasters:.72,particles:.72,props:.84,vegetation:.84,decals:.72,animatedDetail:.78,textureMaxSize:2048,textureMipBias:0,lodBias:.82,memoryBudgetMB:256,maxDynamicLights:10}),
  ultra:freeze({materialTier:3,physicalMaterials:true,clearcoat:true,glassTransmission:.58,reflections:1,normalDetail:1,shadowCasters:1,particles:1,props:1,vegetation:1,decals:1,animatedDetail:1,textureMaxSize:4096,textureMipBias:-.35,lodBias:.62,memoryBudgetMB:384,maxDynamicLights:18})
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function qualityFeatures(quality='medium',device={}){
  const q=normalizeVisualQuality(quality),base=QUALITY_FEATURE_MATRIX[q];
  const mobile=!!device.mobile,saveData=!!device.saveData,hardware=Number(device.hardware||device.memory||8),cores=Number(device.cores||8);
  const constrained=saveData||(mobile&&hardware<=4)||cores<=4;
  if(!constrained)return {...base,quality:q,constrained:false};
  return {...base,quality:q,constrained:true,
    physicalMaterials:base.physicalMaterials&&q==='ultra'&&hardware>=8&&cores>=8,
    clearcoat:base.clearcoat&&q==='ultra'&&hardware>=8&&cores>=8,
    glassTransmission:q==='ultra'&&hardware>=8&&cores>=8?Math.min(.28,base.glassTransmission):0,
    reflections:base.reflections*.45,normalDetail:base.normalDetail*.55,shadowCasters:base.shadowCasters*.55,
    particles:base.particles*.55,props:base.props*.7,vegetation:base.vegetation*.72,decals:base.decals*.55,animatedDetail:base.animatedDetail*.6,
    textureMaxSize:Math.min(base.textureMaxSize,mobile?1024:2048),textureMipBias:Math.max(.2,base.textureMipBias),lodBias:Math.max(1,base.lodBias),memoryBudgetMB:Math.min(base.memoryBudgetMB,mobile?128:192),maxDynamicLights:Math.min(base.maxDynamicLights,mobile?4:7)};
}

function baseMaterialParams(color,opts={}){
  return {color,emissive:opts.emissive??0x000000,emissiveIntensity:Number(opts.emissiveIntensity)||0,metalness:clamp(Number(opts.metalness??.08),0,1),roughness:clamp(Number(opts.roughness??.55),.04,1),transparent:!!opts.transparent,opacity:clamp(Number(opts.opacity??1),0,1),side:opts.side,depthWrite:opts.depthWrite!==false};
}
function materialSpec(color,opts={}){return {color:Number(color),opts:{...opts,side:undefined},sideValue:opts.side};}

export function createQualityAwareMaterial(THREE,quality='medium',color=0xffffff,opts={}){
  const features=qualityFeatures(quality,opts.device||{}),params=baseMaterialParams(color,opts);if(params.side==null)params.side=THREE.FrontSide;
  const wantsPhysical=!!opts.glass&&features.physicalMaterials&&typeof THREE.MeshPhysicalMaterial==='function';
  let material;
  if(wantsPhysical){material=new THREE.MeshPhysicalMaterial({...params,roughness:Math.min(.28,params.roughness),metalness:Math.max(.04,params.metalness),transmission:features.glassTransmission,thickness:features.quality==='ultra'?.28:.16,ior:1.45,clearcoat:features.clearcoat?.62:0,clearcoatRoughness:.14,depthWrite:false});}
  else{material=new THREE.MeshStandardMaterial({...params,transparent:params.transparent||!!opts.glass,opacity:opts.glass?({low:.28,medium:.42,high:.56,ultra:.68}[features.quality]??.42):params.opacity});if('envMapIntensity' in material)material.envMapIntensity=.4+features.reflections*.8;}
  material.userData={...(material.userData||{}),agvQualitySpec:materialSpec(color,opts),agvQualityTier:features.quality};
  return material;
}

export function rebuildQualityAwareMaterial(THREE,material,quality='medium',device={}){
  const spec=material?.userData?.agvQualitySpec;if(!spec)return material;const q=normalizeVisualQuality(quality);if(material.userData?.agvQualityTier===q)return material;
  const opts={...(spec.opts||{}),side:spec.sideValue,device};const next=createQualityAwareMaterial(THREE,q,spec.color,opts);
  for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap','alphaMap','lightMap'])if(material[key])next[key]=material[key];
  next.name=material.name;next.visible=material.visible;next.needsUpdate=true;return next;
}

const QUALITY_RANK=freeze({low:0,medium:1,high:2,ultra:3});
export function applyRootVisualQuality(THREE,root,quality='medium',device={}){
  const features=qualityFeatures(quality,device),rank=QUALITY_RANK[features.quality]??1,replacements=new Map();
  root?.traverse?.(object=>{
    const min=object.userData?.minVisualQuality,max=object.userData?.maxVisualQuality;
    if(min||max){const minRank=min?QUALITY_RANK[min]??0:0,maxRank=max?QUALITY_RANK[max]??3:3;object.visible=rank>=minRank&&rank<=maxRank;}
    if(!object.isMesh)return;
    object.castShadow=!!(features.shadowCasters>0&&object.userData?.noCastShadow!==true);
    object.receiveShadow=object.userData?.noReceiveShadow!==true;
    const replace=material=>{if(!material?.userData?.agvQualitySpec)return material;if(replacements.has(material))return replacements.get(material);const next=rebuildQualityAwareMaterial(THREE,material,features.quality,device);replacements.set(material,next);return next;};
    if(Array.isArray(object.material))object.material=object.material.map(replace);else object.material=replace(object.material);
  });
  return features;
}

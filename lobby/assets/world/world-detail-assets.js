const freeze=v=>Object.freeze(v);
const lods=(base,sizes)=>freeze({
  lod0:freeze({url:`../../models/environment/f9411/${base}-lod0.glb`,bytes:sizes[0]}),
  lod1:freeze({url:`../../models/environment/f9411/${base}-lod1.glb`,bytes:sizes[1]}),
  lod2:freeze({url:`../../models/environment/f9411/${base}-lod2.glb`,bytes:sizes[2]})
});
const CAMPUS_KIOSK=lods('campus-smart-kiosk',[11252,4064,2684]);
const VALE_PYLON=lods('vale-innovation-pylon',[12468,3424,2736]);
const RURAL_WIND=lods('rural-wind-turbine',[7312,5568,3844]);
export const WORLD_DETAIL_ASSETS=freeze({
  'campus-ds':freeze([
    freeze({id:'campus-kiosk-north',position:freeze([0,0,-8.6]),rotationY:0,lods:CAMPUS_KIOSK,distances:freeze({lod0:32,lod1:70,lod2:115})}),
    freeze({id:'campus-kiosk-south',position:freeze([0,0,8.6]),rotationY:Math.PI,lods:CAMPUS_KIOSK,distances:freeze({lod0:32,lod1:70,lod2:115})}),
    freeze({id:'campus-kiosk-east',position:freeze([8.6,0,0]),rotationY:-Math.PI/2,lods:CAMPUS_KIOSK,distances:freeze({lod0:32,lod1:70,lod2:115})}),
    freeze({id:'campus-kiosk-west',position:freeze([-8.6,0,0]),rotationY:Math.PI/2,lods:CAMPUS_KIOSK,distances:freeze({lod0:32,lod1:70,lod2:115})})
  ]),
  'vale-silicio':freeze([
    freeze({id:'vale-pylon-central-a',position:freeze([18,0,18]),rotationY:.4,lods:VALE_PYLON,distances:freeze({lod0:55,lod1:125,lod2:220})}),
    freeze({id:'vale-pylon-central-b',position:freeze([-18,0,-18]),rotationY:-.7,lods:VALE_PYLON,distances:freeze({lod0:55,lod1:125,lod2:220})}),
    freeze({id:'vale-pylon-east',position:freeze([105,0,40]),rotationY:1.2,lods:VALE_PYLON,distances:freeze({lod0:55,lod1:125,lod2:220})}),
    freeze({id:'vale-pylon-west',position:freeze([-105,0,-40]),rotationY:-1.2,lods:VALE_PYLON,distances:freeze({lod0:55,lod1:125,lod2:220})})
  ]),
  'rural-agv':freeze([
    freeze({id:'rural-wind-northwest',position:freeze([-118,0,-82]),rotationY:.2,scale:1.15,lods:RURAL_WIND,distances:freeze({lod0:65,lod1:145,lod2:250})}),
    freeze({id:'rural-wind-southeast',position:freeze([126,0,92]),rotationY:-.35,scale:1.05,lods:RURAL_WIND,distances:freeze({lod0:65,lod1:145,lod2:250})})
  ])
});
export function worldDetailAssetSlots(worldId){return WORLD_DETAIL_ASSETS[String(worldId||'')]||freeze([]);}

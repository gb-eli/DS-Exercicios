/**
 * Runtime contract for the next asset pass. Files are optional until supplied;
 * procedural Phase-C geometry remains the production fallback.
 */
export const CAMPUS_ASSET_CONTRACT=Object.freeze({
  format:'glb',
  units:'meters',
  upAxis:'Y',
  forwardAxis:'-Z',
  textureColorSpace:'sRGB',
  preferredGeometryCompression:'meshopt',
  preferredTextureCompression:'ktx2',
  collisionSuffix:'_COL',
  lodSuffixes:Object.freeze(['_LOD0','_LOD1','_LOD2'])
});

export const CAMPUS_MODEL_SLOTS=Object.freeze({
  plaza:Object.freeze({url:'assets/models/environment/campus-plaza.glb',optional:true}),
  '1ds':Object.freeze({url:'assets/models/environment/building-1ds.glb',optional:true}),
  '2ds':Object.freeze({url:'assets/models/environment/building-2ds.glb',optional:true}),
  '3ds':Object.freeze({url:'assets/models/environment/building-3ds.glb',optional:true}),
  sub:Object.freeze({url:'assets/models/environment/building-sub.glb',optional:true}),
  portalFrame:Object.freeze({url:'assets/models/environment/portal-frame.glb',optional:true}),
  props:Object.freeze({url:'assets/models/environment/campus-props.glb',optional:true})
});

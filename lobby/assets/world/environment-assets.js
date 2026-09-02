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

/** F94.11 production detail assets.
 * These are real local GLB 2.0 LODs used by Asset Streaming V2. The first pass
 * intentionally keeps them texture-free so the runtime has a safe fallback on
 * school hardware. Meshopt/KTX2 remain preferred for future textured packs.
 */
export const F9411_DETAIL_ASSET_STATUS=Object.freeze({
  runtime:'active',
  worlds:Object.freeze(['campus-ds','vale-silicio','rural-agv']),
  lods:Object.freeze(['lod0','lod1','lod2']),
  geometryCompression:'none-first-pass',
  textureCompression:'not-applicable-texture-free',
  preferredGeometryCompression:'meshopt',
  preferredTextureCompression:'ktx2',
  fallback:'procedural-world-remains-authoritative'
});

import { qualityFeatures } from '../quality-feature-matrix.js?v=14.10.8.96-f9411-graphics-streaming';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const estimateTextureBytes=(width=1,height=1,channels=4,mips=true)=>Math.round(Math.max(1,width)*Math.max(1,height)*Math.max(1,channels)*(mips?1.34:1));

export function createVisualAssetBudget({worldId='unknown',quality='medium',device={}}={}){
  let features=qualityFeatures(quality,device),usedBytes=0,peakBytes=0;const entries=new Map();
  const budgetBytes=()=>Math.max(32,Number(features.memoryBudgetMB)||160)*1024*1024;
  function setQuality(next){features=qualityFeatures(next,device);return snapshot();}
  function reserve({id,bytes=0,kind='geometry',lod='lod1',priority=0,meta=null}={}){if(!id)return false;const size=Math.max(0,Number(bytes)||0),previous=entries.get(id);if(previous)usedBytes-=previous.bytes;entries.set(id,{id,bytes:size,kind,lod,priority,meta,at:Date.now()});usedBytes+=size;peakBytes=Math.max(peakBytes,usedBytes);return usedBytes<=budgetBytes();}
  function release(id){const entry=entries.get(id);if(!entry)return false;usedBytes-=entry.bytes;entries.delete(id);return true;}
  function chooseLOD(distance,{lod0=48,lod1=105,lod2=180,allowNull=true}={}){const d=Math.max(0,Number(distance)||0),bias=Math.max(.45,Number(features.lodBias)||1),a=lod0/bias,b=lod1/bias,c=lod2/bias;if(features.materialTier<=0)return d<c?'lod2':allowNull?null:'lod2';if(features.materialTier===1)return d<b?'lod1':d<c?'lod2':allowNull?null:'lod2';return d<a?'lod0':d<b?'lod1':d<c?'lod2':allowNull?null:'lod2';}
  function texturePolicy({width=1,height=1,channels=4,mips=true}={}){const max=features.textureMaxSize,scale=Math.min(1,max/Math.max(1,width,height));return{maxSize:max,scale,estimatedBytes:estimateTextureBytes(Math.round(width*scale),Math.round(height*scale),channels,mips),preferKTX2:features.quality!=='low',mipBias:features.textureMipBias};}
  function pressure(){return clamp(usedBytes/Math.max(1,budgetBytes()),0,4);}
  function canReserve(bytes=0){return usedBytes+Math.max(0,Number(bytes)||0)<=budgetBytes();}
  function snapshot(){return{version:2,worldId,quality:features.quality,constrained:features.constrained,budgetMB:Number((budgetBytes()/1048576).toFixed(1)),usedMB:Number((usedBytes/1048576).toFixed(2)),peakMB:Number((peakBytes/1048576).toFixed(2)),pressure:Number(pressure().toFixed(3)),entries:entries.size,textureMaxSize:features.textureMaxSize,lodBias:features.lodBias,preferGeometryCompression:'meshopt',preferTextureCompression:'ktx2'};}
  return{setQuality,reserve,release,chooseLOD,texturePolicy,pressure,canReserve,features:()=>({...features}),diagnostics:snapshot};
}

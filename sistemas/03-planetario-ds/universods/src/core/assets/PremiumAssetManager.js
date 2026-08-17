import { GlbSceneParser } from './GlbSceneParser.js';
import { HdrEnvironmentParser } from './HdrEnvironmentParser.js';
import { AssetPackCache } from './AssetPackCache.js';
import { loadResource, projectBaseUrl } from './ResourceLoader.js';
const now=()=>typeof performance!=='undefined'?performance.now():Date.now();
export class PremiumAssetManager{
  constructor({settingsStore,manifestUrl=null}={}){
    this.settingsStore=settingsStore;
    this.manifestUrl=manifestUrl||new URL('public/assets/premium/manifest.json',projectBaseUrl).href;
    this.manifestBase=this.manifestUrl;
    this.manifest=null;this.loaded=new Map();this.cache=new AssetPackCache();this.lastTransport=null;
  }
  async init(){
    if(this.manifest)return this.manifest;
    const loaded=await loadResource(this.manifestUrl,{type:'json',baseUrl:projectBaseUrl});
    this.manifest=loaded.data;this.manifestBase=loaded.url;this.lastTransport=loaded.strategy;
    if(!['cosmos-ds-premium-assets-v1','cosmos-ds-premium-assets-v2'].includes(this.manifest.schema))throw new Error('Manifesto premium incompatível.');
    return this.manifest;
  }
  list(){return this.manifest?.assets?.map(item=>structuredClone(item))||[];}
  asset(id){return this.manifest?.assets?.find(item=>item.id===id)||null;}
  environment(id){return this.manifest?.environments?.find(item=>item.id===id)||null;}
  resolveLod(asset,requested='auto'){
    if(requested!=='auto'){const level=Math.max(0,Math.min(2,Number(requested)));return asset.lods.find(item=>item.level===level)||asset.lods[0];}
    const profile=this.settingsStore?.getProfile?.().id||'balanced',level=profile==='performance'?0:profile==='experience'?2:1;return asset.lods.find(item=>item.level===level)||asset.lods[0];
  }
  async loadAsset(id,{lod='auto',force=false}={}){
    await this.init();const asset=this.asset(id);if(!asset)throw new Error('Asset premium desconhecido.');const selected=this.resolveLod(asset,lod),key=`${id}:${selected.level}`;if(!force&&this.loaded.has(key))return this.loaded.get(key);
    const start=now(),environment=this.environment(asset.environment);if(!environment)throw new Error('Ambiente HDR não encontrado.');
    const [glb,albedo,roughness,env]=await Promise.all([
      loadResource(selected.url,{type:'arrayBuffer',baseUrl:this.manifestBase}),
      loadResource(asset.texture,{type:'blob',baseUrl:this.manifestBase}),
      loadResource(asset.roughnessTexture,{type:'blob',baseUrl:this.manifestBase}),
      loadResource(environment.url,{type:'arrayBuffer',baseUrl:this.manifestBase})
    ]);
    const scene=GlbSceneParser.parse(glb.data),geometry=scene.primaryGeometry,hdr=HdrEnvironmentParser.parse(env.data);
    const result={asset,selected,scene,geometry,albedoBlob:albedo.data,roughnessBlob:roughness.data,environment:hdr,loadMs:Math.round(now()-start),bytes:selected.bytes+(asset.textureBytes||0),transport:[glb.strategy,albedo.strategy,roughness.strategy,env.strategy].join('+')};
    this.loaded.set(key,result);this.lastTransport=result.transport;return result;
  }
  release(id){for(const key of [...this.loaded.keys()])if(key.startsWith(`${id}:`))this.loaded.delete(key);}
  releaseAll(){this.loaded.clear();}
  diagnostics(){let bytes=0,triangles=0;for(const item of this.loaded.values()){bytes+=item.selected.bytes;triangles+=item.scene?.triangles||item.geometry?.triangles||0;}return{loaded:this.loaded.size,bytes,triangles,transport:this.lastTransport};}
}

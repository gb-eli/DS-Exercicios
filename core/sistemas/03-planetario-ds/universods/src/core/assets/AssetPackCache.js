export class AssetPackCache{
  constructor({cacheName='cosmos-ds-premium-assets-v1'}={}){this.cacheName=cacheName;}
  supported(){return typeof caches!=='undefined';}
  urlsFor(asset,environment){return [...asset.lods.map(item=>item.url),asset.texture,asset.roughnessTexture,environment?.url].filter(Boolean);}
  async cacheAsset(asset,environment,onProgress=()=>{}){
    if(!this.supported())return{ok:false,reason:'Cache API indisponível.'};const urls=this.urlsFor(asset,environment),cache=await caches.open(this.cacheName);let completed=0;
    for(const url of urls){const response=await fetch(url);if(!response.ok)throw new Error(`Falha ao baixar ${url}`);await cache.put(url,response.clone());completed++;onProgress({completed,total:urls.length,url});}
    return{ok:true,count:completed};
  }
  async isAssetCached(asset,environment){if(!this.supported())return false;const cache=await caches.open(this.cacheName),matches=await Promise.all(this.urlsFor(asset,environment).map(url=>cache.match(url)));return matches.every(Boolean);}
  async removeAsset(asset,environment){if(!this.supported())return 0;const cache=await caches.open(this.cacheName);let removed=0;for(const url of this.urlsFor(asset,environment))if(await cache.delete(url))removed++;return removed;}
}

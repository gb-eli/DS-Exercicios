export class AssetStreamingManager{
 constructor({concurrency=2,fetcher=globalThis.fetch}={}){this.concurrency=Math.max(1,concurrency);this.fetcher=fetcher;this.queue=[];this.active=0;this.cache=new Map();this.stats={requested:0,loaded:0,failed:0,bytes:0};}
 request(url,{priority=0,group='default'}={}){if(this.cache.has(url))return Promise.resolve(this.cache.get(url));this.stats.requested++;return new Promise((resolve,reject)=>{this.queue.push({url,priority,group,resolve,reject});this.queue.sort((a,b)=>b.priority-a.priority);this.pump();});}
 async pump(){while(this.active<this.concurrency&&this.queue.length){const item=this.queue.shift();this.active++;try{const response=await this.fetcher(item.url);if(!response?.ok)throw new Error(`HTTP ${response?.status||0}`);const buffer=await response.arrayBuffer();const payload={url:item.url,group:item.group,buffer,bytes:buffer.byteLength,loadedAt:Date.now()};this.cache.set(item.url,payload);this.stats.loaded++;this.stats.bytes+=buffer.byteLength;item.resolve(payload);}catch(error){this.stats.failed++;item.reject(error);}finally{this.active--;queueMicrotask(()=>this.pump());}}}
 releaseGroup(group){let bytes=0;for(const [url,item] of this.cache)if(item.group===group){bytes+=item.bytes;this.cache.delete(url);}return bytes;}
 clear(){const bytes=this.stats.bytes;this.cache.clear();this.queue.length=0;return bytes;}
 snapshot(){return{...this.stats,queued:this.queue.length,active:this.active,cached:this.cache.size};}
}

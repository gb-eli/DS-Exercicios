/* Loja Virtual DS v0.9.6.0-RG — transporte 3D sem perdas */
(() => {
'use strict';
const manifestUrl = new URL('../assets/compression/mesh-transfer-manifest.json', document.baseURI);
let manifestJob = null;
const memory = new Map();
const supportsGzip = (() => { try { return typeof DecompressionStream === 'function' && !!new DecompressionStream('gzip'); } catch (_) { return false; } })();
async function manifest(){
  if(!manifestJob) manifestJob=fetch(manifestUrl,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error(`Manifesto 3D HTTP ${r.status}`);return r.json()});
  return manifestJob;
}
function matchEntry(m,url){const pathname=new URL(url,document.baseURI).pathname;return m.entries.find(e=>pathname.endsWith('/'+e.original)||pathname.endsWith(e.original));}
async function digest(buffer){if(!crypto?.subtle)return null;const d=await crypto.subtle.digest('SHA-256',buffer);return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function fetchOriginal(url){const r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw Error(`GLB HTTP ${r.status}`);return r.arrayBuffer();}
async function fetchGzip(entry){
  const key=entry.sha256;
  if(memory.has(key)) return memory.get(key).slice(0);
  const gzUrl=new URL('../'+entry.gzip,document.baseURI);
  const r=await fetch(gzUrl,{cache:'force-cache'});if(!r.ok)throw Error(`Gzip 3D HTTP ${r.status}`);
  const stream=r.body.pipeThrough(new DecompressionStream('gzip'));
  const buffer=await new Response(stream).arrayBuffer();
  if(buffer.byteLength!==entry.originalBytes)throw Error('Tamanho descompactado divergente');
  const hash=await digest(buffer);if(hash&&hash!==entry.sha256)throw Error('Hash de fidelidade divergente');
  memory.set(key,buffer.slice(0));
  document.dispatchEvent(new CustomEvent('ds-asset-transfer',{detail:{mode:'gzip-lossless',original:entry.original,gzipBytes:entry.gzipBytes,originalBytes:entry.originalBytes,reductionPercent:entry.reductionPercent,verified:true}}));
  return buffer;
}
async function fetchArrayBuffer(url,{preferCompressed=true}={}){
  if(preferCompressed&&supportsGzip){
    try{const m=await manifest(),entry=matchEntry(m,url);if(entry)return await fetchGzip(entry)}catch(e){console.warn('[DS 3D] fallback para GLB original:',e.message)}
  }
  const buffer=await fetchOriginal(url);document.dispatchEvent(new CustomEvent('ds-asset-transfer',{detail:{mode:'original',original:String(url),originalBytes:buffer.byteLength,verified:true}}));return buffer;
}
async function stats(){const m=await manifest();return{...m,supportsGzip,memoryEntries:memory.size};}
function clearMemory(){memory.clear()}
window.DSAssetTransfer={fetchArrayBuffer,stats,clearMemory,supportsGzip,manifestUrl:String(manifestUrl)};
})();

/* Painel da compressão 3D v0.9.6.0-RG */
(() => {
'use strict';
const root=document.getElementById('compression3dPanel');if(!root)return;
const status=root.querySelector('[data-compression-status]');
const fill=root.querySelector('[data-compression-fill]');
const original=root.querySelector('[data-compression-original]');
const packed=root.querySelector('[data-compression-packed]');
const reduction=root.querySelector('[data-compression-reduction]');
const models=root.querySelector('[data-compression-models]');
const test=root.querySelector('[data-compression-test]');
const format=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(2)} MB`;
async function render(){try{const s=await window.DSAssetTransfer.stats();original.textContent=format(s.originalBytes);packed.textContent=format(s.gzipBytes);reduction.textContent=`${s.reductionPercent}%`;models.textContent=s.entryCount;fill.style.width=`${s.reductionPercent}%`;status.textContent=s.supportsGzip?'Gzip sem perdas disponível':'Fallback GLB original';root.dataset.ready='true'}catch(e){status.textContent='Manifesto indisponível';root.dataset.ready='error'}}
test?.addEventListener('click',async()=>{test.disabled=true;status.textContent='Validando GLB descompactado...';try{const s=await window.DSAssetTransfer.stats(),first=s.entries[0];const b=await window.DSAssetTransfer.fetchArrayBuffer(new URL('../'+first.original,document.baseURI));status.textContent=b.byteLength===first.originalBytes?'Fidelidade confirmada byte a byte':'Falha de tamanho'}catch(e){status.textContent='Falha: '+e.message}finally{test.disabled=false}});
render();
})();

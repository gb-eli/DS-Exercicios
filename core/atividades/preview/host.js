const inner=document.getElementById('student-preview');
const status=document.getElementById('preview-status');
let controller=null;
let token='';
let blobUrl='';
function send(type,extra={}){if(!controller||!token)return;controller.postMessage({type,token,...extra},'*');}
function revoke(){if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl='';}}
function render(html){
  revoke();
  const safe=String(html??'');
  blobUrl=URL.createObjectURL(new Blob([safe],{type:'text/html;charset=utf-8'}));
  inner.src=blobUrl;
  status.classList.add('hidden');
  send('agv-preview:rendered');
}
window.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type==='agv-preview:init'&&!controller){controller=event.source;token=String(data.token||'');send('agv-preview:initialized');return;}
  if(event.source!==controller||!token||data.token!==token)return;
  if(data.type==='agv-preview:render')render(data.html);
  if(data.type==='agv-preview:clear'){revoke();inner.removeAttribute('src');status.textContent=String(data.message||'Preview limpo.');status.classList.remove('hidden');send('agv-preview:cleared');}
});
window.addEventListener('beforeunload',revoke);
parent.postMessage({type:'agv-preview:ready'},'*');

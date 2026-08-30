
let worker=null, pendingInput=false;
const $=id=>document.getElementById(id);
function out(text,kind='stdout'){
  const el=$('terminal-output');
  if(kind==='clear') el.textContent='';
  else el.textContent += (el.textContent && !el.textContent.endsWith('\n') ? '\n':'') + String(text??'');
  el.scrollTop=el.scrollHeight;
}
function showInput(show,prompt=''){
  pendingInput=show;
  $('terminal-input-form').classList.toggle('hidden',!show);
  if(show){ if(prompt) out(prompt,'stdout'); $('terminal-input').value=''; $('terminal-input').focus(); }
}
export function runPython(code,fileName='main.py'){
  if(worker) worker.terminate();
  worker=new Worker('./assets/js/python-worker.js?v=14.10.8.65');
  out('', 'clear'); out('Python: iniciando execução...');
  showInput(false);
  worker.onmessage=e=>{
    const d=e.data||{};
    if(d.type==='status') out(d.text);
    else if(d.type==='stdout') out(d.text);
    else if(d.type==='stderr') out(d.text,'stderr');
    else if(d.type==='stdin') out(`> ${d.text}`);
    else if(d.type==='input-request') showInput(true,d.prompt||'');
    else if(d.type==='done'){
      showInput(false);
      if(d.success) out('\nProcesso finalizado com sucesso.');
      else out('\n'+String(d.error||'Erro ao executar.'),'stderr');
    }
  };
  worker.onerror=e=>out(`Erro no runtime Python: ${e.message}`,'stderr');
  worker.postMessage({type:'run',code,fileName,inputs:[]});
}
$('terminal-input-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!worker||!pendingInput)return;
  const value=$('terminal-input').value;
  out(`> ${value}`); showInput(false);
  worker.postMessage({type:'stdin-response',value});
});

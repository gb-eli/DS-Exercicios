const state={required:false,bound:false};

function supported(){return Boolean(document.fullscreenEnabled&&document.documentElement?.requestFullscreen)}
function ensureOverlay(){
  let overlay=document.getElementById('portal-fullscreen-guard');
  if(overlay)return overlay;
  overlay=document.createElement('div');
  overlay.id='portal-fullscreen-guard';
  overlay.className='portal-fullscreen-guard hidden';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML=`<div class="portal-fullscreen-card"><span class="portal-fullscreen-icon" aria-hidden="true">⛶</span><p class="eyebrow">Modo de atividade</p><h2>Tela cheia obrigatória</h2><p>Para utilizar o portal e realizar as atividades, mantenha o modo tela cheia ativo.</p><p class="muted">Se você saiu da tela cheia sem querer, clique no botão abaixo para continuar.</p><button id="portal-fullscreen-return" class="button button-primary" type="button">Voltar para tela cheia</button></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#portal-fullscreen-return')?.addEventListener('click',async()=>{await requestPortalFullscreen();});
  return overlay;
}
function render(){
  const overlay=ensureOverlay();
  const mustBlock=state.required&&supported()&&!document.fullscreenElement;
  overlay.classList.toggle('hidden',!mustBlock);
  document.documentElement.classList.toggle('portal-fullscreen-required',mustBlock);
}
function bind(){
  if(state.bound)return;state.bound=true;
  document.addEventListener('fullscreenchange',render);
  window.addEventListener('pageshow',render);
}
export async function requestPortalFullscreen({silent=false}={}){
  bind();
  if(!supported())return true;
  try{
    if(!document.fullscreenElement)await document.documentElement.requestFullscreen({navigationUI:'hide'});
    render();return true;
  }catch(error){
    if(!silent)render();
    return false;
  }
}
export function setPortalFullscreenRequired(required=true){state.required=Boolean(required);bind();render();}
export function portalFullscreenActive(){return !supported()||Boolean(document.fullscreenElement)}

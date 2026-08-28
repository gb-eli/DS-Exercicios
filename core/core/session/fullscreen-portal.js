(()=>{
  'use strict';
  const state={required:false,bound:false,exempt:false};
  const supported=()=>Boolean(document.fullscreenEnabled&&document.documentElement?.requestFullscreen);
  function create(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
  function overlay(){
    let host=document.getElementById('agv-global-fullscreen-guard');
    if(host)return host;
    host=create('div','agv-global-fullscreen-guard hidden');host.id='agv-global-fullscreen-guard';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');
    const card=create('div','agv-global-fullscreen-card');
    card.append(create('span','agv-global-fullscreen-icon','⛶'),create('p','agv-global-fullscreen-eyebrow','Modo de atividade'),create('h2','', 'Tela cheia obrigatória'),create('p','', 'Para utilizar o portal e realizar as atividades, mantenha o modo tela cheia ativo.'),create('p','agv-global-fullscreen-muted','Se você saiu da tela cheia, volte para continuar.'));
    const btn=create('button','agv-global-fullscreen-button','Voltar para tela cheia');btn.type='button';btn.addEventListener('click',()=>request());card.append(btn);host.append(card);document.body.append(host);return host;
  }
  function render(){if(state.exempt)return;const host=overlay(),block=state.required&&supported()&&!document.fullscreenElement;host.classList.toggle('hidden',!block);document.documentElement.classList.toggle('agv-global-fullscreen-required',block)}
  function bind(){if(state.bound)return;state.bound=true;state.exempt=document.documentElement.dataset.fullscreenExempt==='true'||document.body?.dataset.fullscreenExempt==='true';if(state.exempt)return;document.addEventListener('fullscreenchange',render);window.addEventListener('pageshow',render)}
  async function request({silent=false}={}){bind();if(state.exempt||!supported())return true;try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen({navigationUI:'hide'});render();return true}catch(_){if(!silent)render();return false}}
  function require(value=true){bind();state.required=Boolean(value)&&!state.exempt;render()}
  function active(){return state.exempt||!supported()||Boolean(document.fullscreenElement)}
  async function release(){state.required=false;render();if(document.fullscreenElement){try{await document.exitFullscreen()}catch(_){}}}
  window.AGVFullscreen={request,require,active,release,render};
  bind();
})();

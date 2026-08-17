(() => {
  'use strict';
  const modal=()=>document.getElementById('showcaseModal');
  let timer=null;
  function open(){
    const root=modal(); if(!root)return;
    root.classList.add('show');root.setAttribute('aria-hidden','false');
    window.DSAvatarSnapshot?.renderHost(document.getElementById('showcaseAvatar'));
    const select=document.getElementById('showcaseMessage');
    if(select&&!select.options.length){
      const state=window.DSBackpack?.getState?.()||window.DSAvatarProfile?.getState();
      select.innerHTML=(state?.quickMessages||[]).map(x=>`<option>${x}</option>`).join('');
    }
    play('WalkShowcase');
  }
  function close(){const root=modal();if(root){root.classList.remove('show');root.setAttribute('aria-hidden','true');root.dataset.action='idle';}if(timer)clearTimeout(timer)}
  function play(action){
    const root=modal(); if(!root)return;
    root.dataset.action=action||'Idle';
    if(action==='TurnAround')window.DSAvatarSnapshot?.rotate?.(document.getElementById('showcaseAvatar'),1);
    window.DSAvatarProfile?.setAnimation(action||'Idle');
    window.DSAvatarViewer?.play?.(action||'Idle');
    if(timer)clearTimeout(timer); timer=setTimeout(()=>{if(root.classList.contains('show'))root.dataset.action='Idle'},4200);
  }
  function say(message){
    const bubble=document.getElementById('showcaseBubble'); if(!bubble)return;
    const value=message||document.getElementById('showcaseMessage')?.value||'Olá!';
    bubble.textContent=value;bubble.hidden=false;window.DSAvatarProfile?.setMessage(value);
    setTimeout(()=>bubble.hidden=true,3200);
  }
  document.addEventListener('click',async event=>{
    if(event.target.closest('[data-open-showcase]')){event.preventDefault();open();return;}
    if(event.target.closest('[data-close-showcase]')){close();return;}
    const action=event.target.closest('[data-showcase-action]');if(action){play(action.dataset.showcaseAction);return;}
    if(event.target.closest('[data-showcase-say]')){say();return;}
    if(event.target.closest('[data-showcase-open-3d]')){close();document.querySelector('[data-view="avatarView"]')?.click();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  window.DSAvatarShowcase={open,close,play,say};
})();

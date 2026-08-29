(() => {
  'use strict';
  const mode=()=>document.body.dataset.quality||'intermediate';
  function host(){return document.getElementById('transactionModal')}
  function particles(root,count){
    const field=root?.querySelector('#transactionParticles'); if(!field)return;
    field.innerHTML=Array.from({length:count},(_,i)=>`<i style="--i:${i};--x:${(i*37)%100}%;--delay:${(i%7)*.08}s">◆</i>`).join('');
  }
  function start(item,offer){
    const root=host(); if(!root)return;
    root.className=`modal-backdrop transaction-quality-${mode()}`;
    const itemHost=document.getElementById('transactionItem');
    if(itemHost)itemHost.innerHTML=`<img src="${item.thumbnail||item.preview||''}" alt="${item.name}"><span><strong>${item.name}</strong><small>${offer.price===0?'Grátis':offer.price.toLocaleString('pt-BR')+' DS'}</small></span>`;
    window.DSAvatarSnapshot?.renderHost(document.getElementById('transactionAvatar'));
    particles(root,{basic:2,intermediate:7,advanced:13,ultra:20,realism:26}[mode()]||7);
    root.dataset.transactionState='validating';
  }
  function progress(index,total){const root=host();if(root)root.style.setProperty('--transaction-progress',`${Math.round((index+1)/total*100)}%`)}
  function complete(){const root=host();if(root)root.dataset.transactionState='authorized'}
  function fail(){const root=host();if(root)root.dataset.transactionState='rejected'}
  window.DSTransactionVisuals={start,progress,complete,fail};
})();

(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const api=window.DSBackpack,store=window.DSStore,profile=window.DSAvatarProfile;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clipLabels={Wave:'Acenar',Jump:'Pular',DanceLoop:'Dançar',VictoryPose:'Pose de vitória',WalkShowcase:'Desfilar',ThumbsUp:'Sinal positivo',Goodbye:'Tchau',Think:'Pensar',Point:'Apontar',Sit:'Sentar',Applause:'Aplaudir',Celebrate:'Comemorar'};
  let mode='inventory';
  function toast(title,text,error=false){const fn=window.DSApp?.showToast||window.showToast;if(typeof fn==='function')fn(title,text,error);else console[error?'error':'log'](title,text)}
  function itemCard(id,index){const item=api.storeItem(id);if(!item)return '';const equipped=profile?.isEquipped?.(id);return `<article class="backpack-slot filled glass" data-backpack-index="${index}"><span class="backpack-slot-number">${index+1}</span><img src="${item.thumbnail||item.preview||''}" alt="${esc(item.name)}"><div><strong>${esc(item.name)}</strong><small>${esc(item.category)} • ${esc(item.slot)}</small><span>${equipped?'✓ Equipado':'Pronto para usar'}</span></div><div class="backpack-slot-actions"><button class="button soft" data-backpack-use="${item.id}">${equipped?'Remover':'Usar'}</button><button class="icon-button" aria-label="Remover da mochila" data-backpack-remove="${item.id}">×</button></div></article>`}
  function render(){
    const host=$('#backpackPanel');if(!host)return;const state=api.getState(),diag=api.getDiagnostics();
    $('#backpackItemCount').textContent=`${diag.items.used}/${diag.items.limit}`;$('#profileBackpackItems')?.replaceChildren(document.createTextNode(String(diag.items.used)));
    $('#backpackSaveState').textContent=window.DSPersistence?.getStatus?.().state==='saved'?'Salvo':'Salvamento automático';
    $('#backpackGroupUsage').innerHTML=Object.values(diag.groups).map(g=>`<span><b>${g.used}/${g.limit}</b>${esc(g.label)}</span>`).join('');
    $('#backpackSlots').innerHTML=Array.from({length:diag.items.limit},(_,i)=>state.itemIds[i]?itemCard(state.itemIds[i],i):`<article class="backpack-slot empty"><span class="backpack-slot-number">${i+1}</span><span class="backpack-empty-icon">＋</span><small>Slot disponível</small></article>`).join('');
    $('#backpackAnimations').innerHTML=state.quickAnimations.map(clip=>`<button class="backpack-action" data-backpack-animation="${esc(clip)}"><span>✦</span><strong>${esc(clipLabels[clip]||clip)}</strong><small>Executar</small><i data-backpack-remove-animation="${esc(clip)}">×</i></button>`).join('')||'<p class="muted">Nenhuma animação rápida.</p>';
    $('#backpackMessages').innerHTML=state.quickMessages.map(message=>`<button class="backpack-message" data-backpack-message="${esc(message)}"><span>“</span><strong>${esc(message)}</strong><i data-backpack-remove-message="${esc(message)}">×</i></button>`).join('')||'<p class="muted">Nenhuma mensagem rápida.</p>';
    const status=window.DSPersistence?.getStatus?.();if(status){$('#persistenceLastSave').textContent=status.lastSavedAt?new Date(status.lastSavedAt).toLocaleString('pt-BR'):'Aguardando primeiro salvamento';$('#persistenceCheckpointCount').textContent=String(status.checkpointCount||0)}
    document.body.dataset.inventoryMode=mode;$$('[data-inventory-mode]').forEach(b=>b.classList.toggle('active',b.dataset.inventoryMode===mode));$('#inventoryGeneralPanel').hidden=mode!=='inventory';host.hidden=mode!=='backpack';
  }
  function decorateInventory(){
    $$('#inventoryGrid .inventory-item').forEach(card=>{const equip=card.querySelector('[data-equip-item]');if(!equip||card.querySelector('[data-backpack-toggle]'))return;const id=equip.dataset.equipItem,item=api.storeItem(id);const clip=api.animationForItem(id);const active=clip?api.getState().quickAnimations.includes(clip):api.getState().itemIds.includes(id);const b=document.createElement('button');b.className='button backpack-toggle';b.dataset.backpackToggle=id;b.textContent=active?(clip?'Remover atalho':'Remover da mochila'):(clip?'Adicionar atalho':'Adicionar à mochila');card.append(b)});
  }
  async function setMode(next){mode=next;if(mode==='backpack')await window.DSRuntimeModules?.ensure?.('inventory');render();decorateInventory()}
  function handleResult(result,success){if(result?.ok===false)return toast('Mochila DS',result.message||'Não foi possível concluir.',true);toast('Mochila DS',success);render();decorateInventory()}
  document.addEventListener('click',async event=>{
    const tab=event.target.closest('[data-inventory-mode]');if(tab){await setMode(tab.dataset.inventoryMode);return}
    const toggle=event.target.closest('[data-backpack-toggle]');if(toggle){const id=toggle.dataset.backpackToggle,clip=api.animationForItem(id);const state=api.getState();const result=clip?(state.quickAnimations.includes(clip)?api.removeAnimation(clip):api.addAnimation(clip)):api.toggleItem(id);handleResult(result,clip?'Atalho de animação atualizado.':'Conteúdo da mochila atualizado.');return}
    const use=event.target.closest('[data-backpack-use]');if(use){const result=api.useItem(use.dataset.backpackUse);handleResult(result,result.equipped?'Item equipado no personagem.':'Item removido do personagem.');return}
    const remove=event.target.closest('[data-backpack-remove]');if(remove){handleResult(api.removeItem(remove.dataset.backpackRemove),'Item retirado da mochila.');return}
    const animRemove=event.target.closest('[data-backpack-remove-animation]');if(animRemove){event.stopPropagation();handleResult(api.removeAnimation(animRemove.dataset.backpackRemoveAnimation),'Atalho removido.');return}
    const anim=event.target.closest('[data-backpack-animation]');if(anim){handleResult(api.playAnimation(anim.dataset.backpackAnimation),'Animação enviada ao personagem.');return}
    const msgRemove=event.target.closest('[data-backpack-remove-message]');if(msgRemove){event.stopPropagation();handleResult(api.removeMessage(msgRemove.dataset.backpackRemoveMessage),'Mensagem removida.');return}
    const msg=event.target.closest('[data-backpack-message]');if(msg){window.DSAvatarShowcase?.open?.();setTimeout(()=>api.sayMessage(msg.dataset.backpackMessage),80);render();return}
    if(event.target.closest('#autoOrganizeBackpack')){api.autoOrganize();toast('Mochila organizada','Os espaços foram preenchidos respeitando os limites por categoria.');render();decorateInventory();return}
    if(event.target.closest('#saveProfileNow')){await window.DSPersistence?.save?.('manual');toast('Perfil salvo','Personagem, mochila e preferências foram registrados.');render();return}
    if(event.target.closest('#exportProfileBackup')){window.DSPersistence?.download?.();toast('Backup exportado','O arquivo contém personalização e atalhos, sem dados financeiros editáveis.');return}
    if(event.target.closest('#importProfileBackup')){$('#profileBackupInput')?.click();return}
    if(event.target.closest('#restoreProfileCheckpoint')){try{await window.DSPersistence?.restoreLastCheckpoint?.();toast('Perfil recuperado','O último ponto íntegro foi restaurado.');render();decorateInventory()}catch(e){toast('Recuperação indisponível',e.message,true)}return}
    if(event.target.closest('#addBackpackMessage')){const input=$('#newBackpackMessage');const result=api.addMessage(input?.value);if(result.ok&&input)input.value='';handleResult(result,'Mensagem adicionada aos atalhos.');return}
  });
  $('#profileBackupInput')?.addEventListener('change',async event=>{try{await window.DSPersistence.importFile(event.target.files?.[0]);toast('Backup importado','A personalização foi restaurada sem alterar carteira ou extrato.');render();decorateInventory()}catch(e){toast('Backup recusado',e.message,true)}finally{event.target.value=''}});
  document.addEventListener('ds-backpack-change',()=>{render();decorateInventory()});
  document.addEventListener('ds-avatar-profile-change',render);
  document.addEventListener('ds-persistence-status',render);
  document.addEventListener('ds-app-ready',()=>{render();decorateInventory()});
  setTimeout(()=>{render();decorateInventory()},0);
  window.DSBackpackUI={version:'0.9.6.0-RG',render,decorateInventory,setMode};
})();

(() => {
  'use strict';
  const positions={hair:'top',head:'top',face:'face',torso:'center','held-item-left':'left','held-item-right':'right',back:'back',shield:'left',companion:'companion',vehicle:'vehicle',aura:'aura','foot-left':'feet','foot-right':'feet'};
  const angles=['front','three-quarter','side','back'];
  const angleLabels={front:'F','three-quarter':'¾',side:'L',back:'T'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const angleSrc=angle=>`../assets/runtime/recovery/avatar-${angle}-hq.webp`;
  function itemSrc(item){ return item?.preview ? `../${item.preview}` : angleSrc('front'); }
  function currentAngle(host){return angles.includes(host?._avatarAngle)?host._avatarAngle:(host?.dataset?.avatarAngle||'three-quarter')}
  function setAngle(host,angle){if(!host||!angles.includes(angle))return;host._avatarAngle=angle;const img=host.querySelector('.avatar-snapshot-base');if(img){img.style.opacity='.2';setTimeout(()=>{img.src=angleSrc(angle);img.dataset.angle=angle;img.style.opacity='1'},90)}host.querySelectorAll('[data-snapshot-angle]').forEach(b=>b.classList.toggle('active',b.dataset.snapshotAngle===angle));}
  function renderHost(host,{previewItem=null}={}){
    if(!host||!window.DSAvatarProfile)return;
    const extra=previewItem?.id ? [previewItem.id] : [];
    const snap=window.DSAvatarProfile.getSnapshot(extra);
    const mode=host.dataset.avatarSnapshot||'compact';
    const angle=currentAngle(host);
    const items=snap.items.slice(0,10);
    const ornaments=items.map(item=>{const slot=(item.attachments||[]).find(a=>!a.variant)?.slot||'accessory';return `<span class="avatar-snapshot-item pos-${positions[slot]||'orbit'}" title="${esc(item.name)}"><img src="${itemSrc(item)}" alt="${esc(item.name)}"></span>`;}).join('');
    const list=items.length?items.slice(0,5).map(x=>x.name).join(' • ')+(items.length>5?` • +${items.length-5}`:''):'Personagem padrão';
    const controls=mode==='mini'?'':`<div class="avatar-snapshot-angle-controls" aria-label="Ângulo do personagem">${angles.map(a=>`<button type="button" data-snapshot-angle="${a}" class="${a===angle?'active':''}" aria-label="${a}">${angleLabels[a]}</button>`).join('')}</div>`;
    host.innerHTML=`<div class="avatar-snapshot avatar-snapshot-${mode}" data-equipped-count="${items.length}"><div class="avatar-snapshot-stage"><div class="avatar-snapshot-grid"></div><div class="avatar-snapshot-aura"></div><img class="avatar-snapshot-base" data-angle="${angle}" src="${angleSrc(angle)}" alt="${esc(snap.displayName)}">${ornaments}<span class="avatar-snapshot-count">${items.length}</span>${controls}</div><div class="avatar-snapshot-copy"><strong>${esc(snap.displayName)}</strong><small>${esc(list)}</small></div></div>`;
    host.querySelectorAll('[data-snapshot-angle]').forEach(b=>b.addEventListener('click',()=>setAngle(host,b.dataset.snapshotAngle)));
  }
  function renderAll(){ document.querySelectorAll('[data-avatar-snapshot]').forEach(host=>renderHost(host,{previewItem:host._previewItem||null})); }
  function preview(host,item){ if(host){host._previewItem=item;renderHost(host,{previewItem:item});} }
  function rotate(host,step=1){const a=currentAngle(host);setAngle(host,angles[(angles.indexOf(a)+step+angles.length)%angles.length]);}
  document.addEventListener('ds-avatar-profile-change',renderAll);
  document.addEventListener('ds-app-ready',renderAll);
  window.DSAvatarSnapshot={version:'0.9.6.0-RG',renderHost,renderAll,preview,setAngle,rotate,angles};
})();

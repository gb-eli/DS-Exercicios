const FOCUSABLE='button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
let installed=false;
let sequence=0;
const state=new WeakMap();

function visibleFocusable(root){
  return [...root.querySelectorAll(FOCUSABLE)].filter(node=>{
    const style=getComputedStyle(node);return style.visibility!=='hidden'&&style.display!=='none'&&node.getClientRects().length>0;
  });
}
function openModals(){return [...document.querySelectorAll('.modal[data-modal-managed="true"]')]}
function updateDocumentLock(){
  const open=openModals();document.documentElement.classList.toggle('modal-open',open.length>0);document.body.classList.toggle('modal-open',open.length>0);
  const app=document.querySelector('#app,#teacherApp');if(app){if(open.length)app.setAttribute('inert','');else app.removeAttribute('inert')}
}
function closeModal(modal){
  const info=state.get(modal);const close=modal.querySelector('[data-close],[data-classroom-guide-close],[data-update-later]');
  if(close){close.click();if(modal.isConnected)modal.remove()}else modal.remove();
  queueMicrotask(()=>{updateDocumentLock();if(info?.returnFocus?.isConnected)info.returnFocus.focus({preventScroll:true})});
}
function manage(modal){
  if(!(modal instanceof HTMLElement)||modal.dataset.modalManaged==='true')return;
  const card=modal.querySelector('.modal-card')||modal.firstElementChild;if(!card)return;
  modal.dataset.modalManaged='true';
  const returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  state.set(modal,{returnFocus});
  modal.setAttribute('role',modal.getAttribute('role')||'presentation');
  card.setAttribute('role',card.getAttribute('role')||'dialog');card.setAttribute('aria-modal','true');card.tabIndex=-1;
  const heading=card.querySelector('h1,h2,h3');if(heading){if(!heading.id)heading.id=`agv-modal-title-${++sequence}`;card.setAttribute('aria-labelledby',heading.id)}
  const description=card.querySelector('p');if(description){if(!description.id)description.id=`agv-modal-desc-${++sequence}`;card.setAttribute('aria-describedby',description.id)}
  const keydown=event=>{
    if(event.key==='Escape'&&modal.dataset.modalStatic!=='true'){event.preventDefault();closeModal(modal);return}
    if(event.key!=='Tab')return;const items=visibleFocusable(card);if(!items.length){event.preventDefault();card.focus();return}
    const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  };
  modal.addEventListener('keydown',keydown);
  const observer=new MutationObserver(()=>{if(!modal.isConnected){observer.disconnect();updateDocumentLock();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})}});observer.observe(document.body,{childList:true,subtree:true});
  updateDocumentLock();requestAnimationFrame(()=>{const target=visibleFocusable(card)[0]||card;target.focus({preventScroll:true})});
}
export function installModalManager(){
  if(installed)return;installed=true;document.querySelectorAll('.modal').forEach(manage);
  const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(!(node instanceof HTMLElement))continue;if(node.matches?.('.modal'))manage(node);node.querySelectorAll?.('.modal').forEach(manage)}});
  observer.observe(document.body,{childList:true,subtree:true});
}

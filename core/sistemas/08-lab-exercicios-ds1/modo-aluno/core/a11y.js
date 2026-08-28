
window.DSCore = window.DSCore || {};
window.DSCore.a11y = (() => {
  function announce(message){ let el=document.getElementById('dsCoreAnnouncer'); if(!el){el=document.createElement('div');el.id='dsCoreAnnouncer';el.className='sr-only';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.append(el);} el.textContent='';requestAnimationFrame(()=>{el.textContent=String(message||'');}); }
  function focusFirst(container){ const el=container?.querySelector?.('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');el?.focus?.();return el||null; }
  function bindEscape(element,callback){ element?.addEventListener?.('keydown',event=>{if(event.key==='Escape')callback?.(event);}); }
  return {announce,focusFirst,bindEscape};
})();

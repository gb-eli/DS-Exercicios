(() => {
  'use strict';

  const TARGET_NAME = 'CARLA KATHIELY DOS SANTOS SOUZA';
  const MESSAGE = 'Pare de reclamar, Carla.';
  let shown = false;

  const normalize = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();

  function checkCarla() {
    if (shown) return;

    const signed = document.getElementById('signed');
    const userName = document.getElementById('user-name');

    if (!signed || !userName || signed.classList.contains('hidden')) return;
    if (normalize(userName.textContent) !== normalize(TARGET_NAME)) return;

    shown = true;

    setTimeout(() => {
      window.alert(MESSAGE);
    }, 350);
  }

  const observer = new MutationObserver(checkCarla);

  function start() {
    const signed = document.getElementById('signed');
    const userName = document.getElementById('user-name');

    if (signed) {
      observer.observe(signed, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    }

    if (userName) {
      observer.observe(userName, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    checkCarla();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

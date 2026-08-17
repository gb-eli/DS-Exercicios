window.DSCore = window.DSCore || {};
(() => {
  const select = document.getElementById('classroomSelect');
  const confirm = document.getElementById('classroomSelected');
  const hint = document.getElementById('disciplineLockHint');
  const links = [...document.querySelectorAll('[data-discipline-link]')];
  if (!select) return;

  const role = document.body.dataset.role || 'aluno';
  const key = `ds1_central_${role}_turma_sala_v1`;

  function readSaved() {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  }
  function save(value) {
    try { localStorage.setItem(key, value); } catch {}
  }
  function update(value) {
    const enabled = value === '1ds-a-manha';
    links.forEach(link => {
      link.classList.toggle('is-locked', !enabled);
      link.setAttribute('aria-disabled', enabled ? 'false' : 'true');
      if (enabled) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
    if (confirm) confirm.hidden = !enabled;
    if (hint) {
      hint.textContent = enabled ? 'Sala selecionada. Escolha a disciplina.' : 'Escolha a turma/sala para liberar.';
      hint.classList.toggle('ready', enabled);
    }
    document.body.classList.toggle('classroom-ready', enabled);
  }

  select.addEventListener('change', () => {
    save(select.value);
    update(select.value);
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (link.getAttribute('aria-disabled') === 'true') event.preventDefault();
  }));

  const saved = readSaved();
  if ([...select.options].some(option => option.value === saved)) select.value = saved;
  update(select.value);
})();
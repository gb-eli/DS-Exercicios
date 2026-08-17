window.VersionManager = (() => {
  let detailsTrigger = null;
  const config = () => window.APP_CONFIG || {};

  function versionToken(value = '') {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'plataforma';
  }

  function versionStorageKey(name) {
    return `ds3_${versionToken(config().repositorio || '3ds-programacao')}_${versionToken(config().scope || 'app')}_${name}_v2`;
  }

  function migrateVersionMetadata(name, legacyName) {
    const currentKey = versionStorageKey(name);
    if (localStorage.getItem(currentKey) === null && localStorage.getItem(legacyName) !== null) {
      localStorage.setItem(currentKey, localStorage.getItem(legacyName));
    }
    return currentKey;
  }

  function parse(version = '0.0.0') {
    return String(version).replace(/^v/i, '').split('.').map(part => Number.parseInt(part, 10) || 0);
  }

  function compare(a, b) {
    const left = parse(a);
    const right = parse(b);
    const length = Math.max(left.length, right.length);
    for (let i = 0; i < length; i += 1) {
      const difference = (left[i] || 0) - (right[i] || 0);
      if (difference !== 0) return difference;
    }
    return 0;
  }

  function formatDate(value) {
    if (!value) return 'não informada';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  }

  function setAll(selector, value) {
    document.querySelectorAll(selector).forEach(element => {
      element.textContent = value;
    });
  }

  function setStatus(text, state = 'checking') {
    document.querySelectorAll('[data-version-status]').forEach(element => {
      element.textContent = text;
      element.dataset.state = state;
    });
  }

  function setUpdateButtons(visible, latest = '') {
    document.querySelectorAll('[data-update-app]').forEach(button => {
      button.hidden = !visible;
      button.dataset.latest = latest;
      button.textContent = latest ? `Atualizar para v${latest}` : 'Atualizar ferramenta';
    });
  }

  async function check() {
    const current = config().version || '0.0.0';
    const manifestUrl = config().versionManifest || 'version.json';
    setStatus('Verificando versão pública…', 'checking');
    setUpdateButtons(false);

    try {
      const separator = manifestUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${manifestUrl}${separator}verificar=${Date.now()}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      const latest = manifest.version || current;
      localStorage.setItem(migrateVersionMetadata('latest_manifest', 'dsLatestVersionManifest'), JSON.stringify(manifest));
      localStorage.setItem(migrateVersionMetadata('last_check', 'dsLastVersionCheck'), new Date().toISOString());
      setAll('[data-public-version]', `v${latest}`);

      if (compare(latest, current) > 0) {
        setStatus(`Atualização disponível: v${latest}`, 'outdated');
        setUpdateButtons(true, latest);
      } else if (compare(latest, current) < 0) {
        setStatus(`Versão de desenvolvimento v${current}`, 'development');
      } else {
        setStatus('Você está usando a versão pública mais recente.', 'current');
      }
      return manifest;
    } catch (error) {
      const localMode = location.protocol === 'file:';
      setStatus(
        localMode
          ? 'Modo local: publique ou use um servidor local para conferir atualizações.'
          : 'Não foi possível conferir a versão pública agora.',
        'offline'
      );
      return null;
    }
  }

  async function update() {
    setStatus('Preparando atualização…', 'checking');
    try {
      const projectToken = String(config().repositorio || '3ds-programacao').toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      if ('caches' in window) {
        const names = await caches.keys();
        const ownCaches = names.filter(name => name.toLowerCase().includes(projectToken));
        await Promise.all(ownCaches.map(name => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const basePath = new URL('.', location.href).pathname;
        await Promise.all(registrations.filter(registration => new URL(registration.scope).pathname.startsWith(basePath)).map(registration => registration.update()));
      }
    } catch (error) {
      console.warn('Não foi possível limpar todo o cache:', error);
    }
    const url = new URL(location.href);
    url.searchParams.set('atualizacao', Date.now().toString());
    location.replace(url.toString());
  }

  function openDetails(trigger = document.activeElement) {
    const drawer = document.querySelector('#versionDrawer');
    if (drawer) {
      detailsTrigger = trigger;
      drawer.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');
      ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => element.setAttribute('inert', '')));
      setTimeout(() => drawer.querySelector('[data-close-version]')?.focus(), 0);
    }
  }

  function closeDetails() {
    const drawer = document.querySelector('#versionDrawer');
    if (drawer && !drawer.hidden) {
      drawer.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      ['header', 'main', '.app-dashboard', '.version-footer'].forEach(selector => document.querySelectorAll(selector).forEach(element => element.removeAttribute('inert')));
      detailsTrigger?.focus?.();
      detailsTrigger = null;
    }
  }

  function init() {
    const app = config();
    setAll('[data-app-version]', `v${app.version || '0.0.0'}`);
    setAll('[data-app-updated]', formatDate(app.releasedAt));
    setAll('[data-app-name]', app.name || 'Plataforma 3DS — Programação no Desenvolvimento de Sistemas');
    setUpdateButtons(false);

    document.querySelectorAll('[data-check-version]').forEach(button => {
      button.addEventListener('click', check);
    });
    document.querySelectorAll('[data-update-app]').forEach(button => {
      button.addEventListener('click', update);
    });
    document.querySelectorAll('[data-version-details]').forEach(button => {
      button.addEventListener('click', () => openDetails(button));
    });
    document.querySelectorAll('[data-close-version]').forEach(button => {
      button.addEventListener('click', closeDetails);
    });

    const versionDrawer = document.querySelector('#versionDrawer');
    if (versionDrawer) {
      versionDrawer.addEventListener('click', event => {
        if (event.target === versionDrawer) closeDetails();
      });
    }
    check();
  }

  return { init, check, update, compare, formatDate };
})();

document.addEventListener('DOMContentLoaded', () => VersionManager.init());

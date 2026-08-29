window.VersionManager = (() => {
  const config = () => window.APP_CONFIG || {};

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
      const namespace = config().storageNamespace || '2ds-frontend-manha';
      Utils.storageSet(`${namespace}_latest_version_manifest`, JSON.stringify(manifest));
      Utils.storageSet(`${namespace}_last_version_check`, new Date().toISOString());
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


function belongsToProjectCache(name, prefix) {
  return name === prefix || name.startsWith(`${prefix}-cache-`) || name.startsWith(`${prefix}-v`) || name.startsWith(`${prefix}:`);
}

  async function update() {
    setStatus('Preparando atualização...', 'checking');
    try {
      const prefix = config().cachePrefix || config().storageNamespace || '2ds-frontend-manha';
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.filter(name => belongsToProjectCache(name, prefix)).map(name => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const baseScope = new URL('./', location.href).href;
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.filter(registration => registration.scope === baseScope).map(registration => registration.update()));
      }
    } catch (error) {
      console.warn('Não foi possível atualizar os recursos exclusivos desta plataforma:', error);
    }
    const url = new URL(location.href);
    url.searchParams.set('atualizacao', Date.now().toString());
    location.replace(url.toString());
  }

  function openDetails() {
    const drawer = document.querySelector('#versionDrawer');
    if (drawer) {
      if (window.AppShell?.openOverlay) AppShell.openOverlay(drawer);
      else { drawer.hidden = false; drawer.setAttribute('aria-hidden', 'false'); }
    }
  }

  function closeDetails() {
    const drawer = document.querySelector('#versionDrawer');
    if (drawer) {
      if (window.AppShell?.closeOverlay) AppShell.closeOverlay(drawer);
      else { drawer.hidden = true; drawer.setAttribute('aria-hidden', 'true'); }
    }
  }

  function init() {
    const app = config();
    setAll('[data-app-version]', `v${app.version || '0.0.0'}`);
    setAll('[data-app-updated]', formatDate(app.releasedAt));
    setAll('[data-app-name]', app.name || 'Plataforma 2DS Front-End');
    setUpdateButtons(false);

    document.querySelectorAll('[data-check-version]').forEach(button => {
      button.addEventListener('click', check);
    });
    document.querySelectorAll('[data-update-app]').forEach(button => {
      button.addEventListener('click', update);
    });
    document.querySelectorAll('[data-version-details]').forEach(button => {
      button.addEventListener('click', openDetails);
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

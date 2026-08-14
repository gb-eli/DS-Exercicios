(() => {
  'use strict';
  const registry = {
    assets: './modules/assets.module.js',
    renderer: './modules/renderer.module.js',
    inventory: './modules/inventory.module.js',
    avatar3d: './modules/avatar.module.js',
    animations: './modules/avatar.module.js',
    vfx: './modules/vfx.module.js',
    product3d: './modules/product.module.js',
    packages: './modules/packages.module.js',
    performance: './modules/performance.module.js',
    integration: './modules/integration.module.js'
  };
  const aliases = { avatar: 'avatar3d', product: 'product3d', benchmark: 'performance' };
  const jobs = new Map();
  const ready = new Set();
  async function ensure(requested, options = {}) {
    const name = aliases[requested] || requested;
    if (!name || !registry[name]) return { name, loaded: false, reason: 'core' };
    if (ready.has(name)) return { name, loaded: false, reason: 'cached' };
    if (jobs.has(name)) return jobs.get(name);
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : () => {};
    const job = (async () => {
      onProgress(5, 'Localizando módulo');
      const moduleUrl = new URL(registry[name], document.baseURI).href;
      const mod = await import(moduleUrl);
      onProgress(18, 'Manifesto carregado');
      const result = await mod.mount({ onProgress });
      ready.add(name);
      onProgress(100, 'Módulo pronto');
      document.dispatchEvent(new CustomEvent('ds-runtime-module-ready', { detail: { name, result } }));
      return { name, loaded: true, result };
    })().catch(error => {
      jobs.delete(name);
      document.dispatchEvent(new CustomEvent('ds-runtime-module-error', { detail: { name, error } }));
      throw error;
    });
    jobs.set(name, job);
    return job;
  }
  window.DSRuntimeModules = {
    ensure,
    isReady(name) { return ready.has(aliases[name] || name); },
    loaded() { return [...ready]; },
    registry: Object.freeze({ ...registry })
  };
})();

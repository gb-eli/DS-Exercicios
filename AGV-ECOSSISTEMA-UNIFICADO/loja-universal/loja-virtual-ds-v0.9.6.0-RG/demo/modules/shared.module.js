const scriptJobs = new Map();
const styleJobs = new Map();

export function loadScript(src, { globalName, onProgress, progress = 50 } = {}) {
  if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
  if (scriptJobs.has(src)) return scriptJobs.get(src);
  const job = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-ds-runtime-src="${src}"]`);
    if (existing) {
      if (existing.dataset.ready === 'true') return resolve(globalName ? window[globalName] : true);
      existing.addEventListener('load', () => resolve(globalName ? window[globalName] : true), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.dsRuntimeSrc = src;
    script.addEventListener('load', () => { script.dataset.ready = 'true'; onProgress?.(progress, `Carregado: ${src.split('/').pop()}`); resolve(globalName ? window[globalName] : true); }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
    document.head.append(script);
  });
  scriptJobs.set(src, job);
  return job;
}

export function loadStyle(href, { onProgress, progress = 30 } = {}) {
  if (styleJobs.has(href)) return styleJobs.get(href);
  const job = new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[data-ds-runtime-style="${href}"]`);
    if (existing) return resolve(existing);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.dsRuntimeStyle = href;
    link.addEventListener('load', () => { onProgress?.(progress, `Estilos: ${href.split('/').pop()}`); resolve(link); }, { once: true });
    link.addEventListener('error', () => reject(new Error(`Falha ao carregar ${href}`)), { once: true });
    document.head.append(link);
  });
  styleJobs.set(href, job);
  return job;
}

export async function loadSequence(steps, onProgress) {
  const total = Math.max(1, steps.length);
  const result = [];
  for (let i = 0; i < steps.length; i += 1) {
    const pct = Math.round(20 + ((i + 1) / total) * 72);
    result.push(await steps[i](pct));
    onProgress?.(pct, `Recurso ${i + 1} de ${total}`);
  }
  return result;
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const safeMatch = (query) => {
  try { return typeof matchMedia === 'function' && matchMedia(query).matches; } catch { return false; }
};

const detectWebGL = () => {
  if (typeof document === 'undefined') return { supported: false, webgl2: false, renderer: 'indisponível' };
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) return { supported: false, webgl2: false, renderer: 'indisponível' };
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) || 'GPU disponível') : 'GPU disponível';
    return { supported: true, webgl2: typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext, renderer: renderer.slice(0, 120) };
  } catch {
    return { supported: false, webgl2: false, renderer: 'indisponível' };
  }
};

export const recommendQualityFromDiagnostics = (diagnostics = {}) => {
  const memory = Number(diagnostics?.hardware?.memoryGb || 4);
  const cores = Number(diagnostics?.hardware?.cores || 4);
  const mobile = Boolean(diagnostics?.viewport?.mobile);
  const reduced = Boolean(diagnostics?.preferences?.reducedMotion);
  const saveData = Boolean(diagnostics?.network?.saveData);
  const benchmark = Number(diagnostics?.benchmark?.score || 0);
  const webgl = diagnostics?.support?.webgl !== false;
  if (!webgl || reduced || memory <= 2 || cores <= 2 || benchmark && benchmark < 28) return 'low';
  if (saveData || mobile || memory <= 4 || cores <= 4 || benchmark && benchmark < 62) return 'medium';
  if (memory >= 8 && cores >= 8 && benchmark >= 105) return 'ultra';
  if (memory >= 6 && cores >= 6 && benchmark >= 76) return 'high';
  return 'medium';
};

const runCpuProbe = async () => {
  if (typeof performance === 'undefined') return { durationMs: 0, score: 50 };
  const start = performance.now();
  let value = 0.371;
  const iterations = 185000;
  for (let index = 0; index < iterations; index += 1) value = Math.sin(value + index * 0.000013) * Math.cos(value * 0.79) + 1.0001;
  const durationMs = Math.max(1, performance.now() - start);
  await Promise.resolve(value);
  return { durationMs: Math.round(durationMs * 10) / 10, score: Math.round(clamp(1350 / durationMs, 10, 140)) };
};

export const collectDeviceDiagnostics = async () => {
  const nav = typeof navigator === 'undefined' ? {} : navigator;
  const viewport = typeof window === 'undefined' ? { width: 0, height: 0, dpr: 1 } : {
    width: Math.max(0, Math.round(window.innerWidth || 0)),
    height: Math.max(0, Math.round(window.innerHeight || 0)),
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
  };
  viewport.mobile = viewport.width > 0 && viewport.width <= 760;
  viewport.orientation = viewport.width >= viewport.height ? 'landscape' : 'portrait';
  const webgl = detectWebGL();
  let storage = { usage: 0, quota: 0, usagePercent: 0, persisted: false };
  try {
    const estimate = await nav.storage?.estimate?.();
    const persisted = await nav.storage?.persisted?.();
    storage = {
      usage: Math.max(0, Number(estimate?.usage) || 0),
      quota: Math.max(0, Number(estimate?.quota) || 0),
      usagePercent: estimate?.quota ? Math.round((Number(estimate.usage || 0) / Number(estimate.quota)) * 1000) / 10 : 0,
      persisted: Boolean(persisted),
    };
  } catch { /* diagnóstico opcional */ }
  const benchmark = await runCpuProbe();
  const diagnostics = {
    version: 1,
    capturedAt: Date.now(),
    viewport,
    hardware: {
      memoryGb: Number(nav.deviceMemory || 0),
      cores: Number(nav.hardwareConcurrency || 0),
    },
    preferences: {
      reducedMotion: safeMatch('(prefers-reduced-motion: reduce)'),
      highContrast: safeMatch('(prefers-contrast: more)'),
    },
    network: {
      effectiveType: String(nav.connection?.effectiveType || 'não informado').slice(0, 30),
      downlink: Math.max(0, Number(nav.connection?.downlink) || 0),
      saveData: Boolean(nav.connection?.saveData),
      online: typeof nav.onLine === 'boolean' ? nav.onLine : true,
    },
    support: {
      webgl: webgl.supported,
      webgl2: webgl.webgl2,
      renderer: webgl.renderer,
      fullscreen: typeof document !== 'undefined' && Boolean(document.documentElement?.requestFullscreen),
      orientationLock: Boolean(typeof screen !== 'undefined' && screen.orientation?.lock),
      serviceWorker: 'serviceWorker' in nav,
      indexedDB: typeof indexedDB !== 'undefined',
    },
    storage,
    benchmark,
  };
  diagnostics.recommendedQuality = recommendQualityFromDiagnostics(diagnostics);
  return diagnostics;
};

export const summarizeDeviceDiagnostics = (diagnostics = {}) => {
  if (!diagnostics?.capturedAt) return 'Diagnóstico ainda não executado.';
  const memory = diagnostics.hardware?.memoryGb ? `${diagnostics.hardware.memoryGb} GB` : 'não informado';
  const storage = diagnostics.storage?.quota ? `${diagnostics.storage.usagePercent}% usado` : 'não estimado';
  return `${String(diagnostics.recommendedQuality || 'medium').toUpperCase()} recomendado · ${diagnostics.hardware?.cores || '?'} núcleos · ${memory} · WebGL ${diagnostics.support?.webgl ? 'ativo' : 'indisponível'} · armazenamento ${storage}`;
};

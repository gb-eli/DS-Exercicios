import { loadStyle, loadScript } from './shared.module.js';
import { mount as mountRenderer } from './renderer.module.js';
export async function mount({ onProgress } = {}) {
  await mountRenderer({ onProgress: (p,label)=>onProgress?.(Math.min(22,Math.round(p*.22)),label) });
  await loadStyle('./styles-performance.css', { onProgress, progress: 24 });
  await loadScript('./asset-transfer.js', { globalName: 'DSAssetTransfer', onProgress, progress: 52 });
  await loadScript('./product3d.js', { globalName: 'DSProduct3D', onProgress, progress: 92 });
  return { renderer: 'DSProduct3D', source: 'GLB Gzip sem perdas com fallback original', embeddedFallback: false, qualityPreserved: true };
}

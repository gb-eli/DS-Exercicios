import { loadStyle, loadScript } from './shared.module.js';
import { mount as mountRenderer } from './renderer.module.js';
import { mount as mountPackages } from './packages.module.js';
export async function mount({ onProgress } = {}) {
  await mountRenderer({ onProgress: (p,label)=>onProgress?.(Math.min(22,Math.round(p*.22)),label) });
  await loadStyle('./styles-performance.css', { onProgress, progress: 18 });
  await loadScript('./asset-transfer.js', { globalName: 'DSAssetTransfer', onProgress, progress: 34 });
  await mountPackages({ onProgress: (p, label) => onProgress?.(Math.min(68, Math.round(p * .68)), label) });
  await loadScript('./compression-panel.js', { onProgress, progress: 78 });
  await loadScript('./benchmark-engine.js', { globalName: 'DSBenchmark', onProgress, progress: 94 });
  return { benchmark: 'DSBenchmark', packageManager: 'DSPackManager' };
}

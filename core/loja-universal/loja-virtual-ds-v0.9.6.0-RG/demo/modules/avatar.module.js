import { loadStyle, loadScript } from './shared.module.js';
import { mount as mountRenderer } from './renderer.module.js';
export async function mount({ onProgress } = {}) {
  await mountRenderer({ onProgress: (p,label)=>onProgress?.(Math.min(22,Math.round(p*.22)),label) });
  await loadStyle('./styles-avatar.css', { onProgress, progress: 28 });
  await loadScript('./asset-transfer.js', { globalName: 'DSAssetTransfer', onProgress, progress: 54 });
  await loadScript('./avatar3d.js', { globalName: 'DSAvatarViewer', onProgress, progress: 92 });
  return { renderer: 'DSAvatarViewer', source: 'GLB Gzip sem perdas com fallback original', embeddedFallback: false, qualityPreserved: true };
}

import { loadStyle, loadScript } from './shared.module.js';
export async function mount({ onProgress } = {}) {
  await loadStyle('./styles-vfx.css', { onProgress, progress: 38 });
  await loadScript('./vfx-engine.js', { globalName: 'DSVFX', onProgress, progress: 92 });
  return { renderer: 'Canvas2D VFX', qualityPreserved: true };
}

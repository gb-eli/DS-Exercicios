import { loadStyle, loadScript } from './shared.module.js';
export async function mount({ onProgress } = {}) {
  await loadStyle('./styles-avatar.css', { onProgress, progress: 30 });
  await loadStyle('./styles-backpack.css', { onProgress, progress: 58 });
  await loadScript('./backpack-ui.js', { globalName: 'DSBackpackUI', onProgress, progress: 88 });
  window.DSBackpackUI?.render?.();
  return { styles: ['styles-avatar.css','styles-backpack.css'], scripts:['backpack-ui.js'], qualityPreserved: true, backpackReady: true };
}

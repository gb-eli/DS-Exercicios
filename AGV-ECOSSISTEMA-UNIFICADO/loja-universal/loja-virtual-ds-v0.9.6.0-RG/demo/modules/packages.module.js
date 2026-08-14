import { loadStyle, loadScript } from './shared.module.js';
export async function mount({ onProgress } = {}) {
  await loadStyle('./styles-packages.css', { onProgress, progress: 28 });
  await loadScript('./package-data.js', { onProgress, progress: 55 });
  await loadScript('./package-manager.js', { globalName: 'DSPackManager', onProgress, progress: 92 });
  return { manager: 'DSPackManager' };
}

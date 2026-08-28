import { loadStyle } from './shared.module.js';
export async function mount({ onProgress } = {}) { await loadStyle('./styles-assets.css', { onProgress, progress: 88 }); return { styles: ['styles-assets.css'] }; }

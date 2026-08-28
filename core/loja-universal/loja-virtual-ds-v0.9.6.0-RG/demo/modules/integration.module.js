import { loadStyle, loadScript } from './shared.module.js';
export async function mount({ onProgress } = {}) {
  await loadStyle('./styles-integration.css', { onProgress, progress: 28 });
  await loadScript('./integration-data.js', { globalName: 'DS_INTEGRATION_CONFIG', onProgress, progress: 50 });
  await loadScript('../dist/ds-store-sdk.js', { globalName: 'DSStoreSDK', onProgress, progress: 92 });
  return { sdk: 'DSStoreSDK', adapters: window.DS_INTEGRATION_CONFIG?.platforms?.length || 0 };
}

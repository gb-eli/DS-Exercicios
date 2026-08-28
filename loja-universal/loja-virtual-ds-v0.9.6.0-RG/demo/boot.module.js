import { loadScript } from './modules/shared.module.js';

const started = performance.now();
const core = [
  ['./config-cache-memory.js', 'DS_CACHE_MEMORY_CONFIG'],
  ['./cache-memory-manager.js', 'DSCacheMemory'],
  ['./performance-manager.js', 'DSPerformance'],
  ['./graphics-mode-controller.js', 'DSGraphicsModes'],
  ['./config-data.js', 'DS_ECONOMY_CONFIG'],
  ['./catalog-data.js', 'DS_CATALOG'],
  ['./equipment-data.js', 'DS_EQUIPMENT'],
  ['./backpack-config.js', 'DS_BACKPACK_CONFIG'],
  ['./avatar-profile-state.js', 'DSAvatarProfile'],
  ['./backpack-manager.js', 'DSBackpack'],
  ['./persistence-manager.js', 'DSPersistence'],
  ['./backpack-bridge.js', 'DSBackpackSDK'],
  ['./avatar-snapshot.js', 'DSAvatarSnapshot'],
  ['./visual-recovery.js', 'DSVisualRecovery'],
  ['./transaction-visuals.js', 'DSTransactionVisuals'],
  ['./showcase-controller.js', 'DSAvatarShowcase'],
  ['./vfx-data.js', 'DS_VFX'],
  ['../dist/ds-store-foundation.js', 'DSStore'],
  ['./runtime-loader.js', 'DSRuntimeModules'],
  ['./app.js', null]
];

for (let index = 0; index < core.length; index += 1) {
  const [src, globalName] = core[index];
  await loadScript(src, { globalName, progress: Math.round(((index + 1) / core.length) * 100) });
}
window.DS_BOOT_METRICS = Object.freeze({ version: '0.9.6.0-RG', durationMs: Math.round(performance.now() - started), coreScripts: core.length });
document.dispatchEvent(new CustomEvent('ds-app-ready', { detail: window.DS_BOOT_METRICS }));

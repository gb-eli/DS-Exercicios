import { EventBus } from './core/events/EventBus.js';
import { JsonStorage } from './core/persistence/JsonStorage.js';
import { SettingsStore } from './core/settings/SettingsStore.js';
import { ProfileStore } from './core/profiles/ProfileStore.js';
import { BenchmarkService } from './core/performance/BenchmarkService.js';
import { AdaptiveQualityController } from './core/performance/AdaptiveQualityController.js';
import { ModuleRegistry } from './core/modules/ModuleRegistry.js';
import { AccessibilityController } from './core/accessibility/AccessibilityController.js';
import { CosmosApp } from './app/CosmosApp.js';

const bus = new EventBus();
const storage = new JsonStorage('cosmos-ds-v1');
const settingsStore = new SettingsStore(storage, bus);
const profileStore = new ProfileStore(storage, bus);
const benchmarkService = new BenchmarkService();
const moduleRegistry = new ModuleRegistry();
const adaptiveQuality = new AdaptiveQualityController(settingsStore, bus);
const accessibility = new AccessibilityController(settingsStore);
let renderer=null;
const app = new CosmosApp({ root:document.querySelector('#app'), bus, settingsStore, profileStore, benchmarkService, moduleRegistry });

accessibility.apply();
bus.on('settings:changed', state => { renderer?.resize?.(); accessibility.apply(state); });

app.init().then(() => {
  const startBackground=async()=>{try{const { WebGLCosmosRenderer }=await import('./rendering/WebGLCosmosRenderer.js');renderer=new WebGLCosmosRenderer(document.querySelector('#cosmos-canvas'),settingsStore,bus);renderer.start();}catch(error){console.warn('Fundo WebGL não iniciado; gradiente CSS preservado.',error);}};
  if(typeof requestIdleCallback==='function')requestIdleCallback(startBackground,{timeout:3000});else setTimeout(startBackground,500);
}).catch(error => {
  console.error(error);
  document.querySelector('#app').innerHTML = `<main class="shell"><section class="section glass"><h1>Falha ao iniciar o COSMOS DS</h1><p>${error.message}</p><button class="button primary" onclick="location.reload()">Tentar novamente</button></section></main>`;
});

addEventListener('keydown', event => {
  if (event.altKey && event.key.toLowerCase() === 'c') settingsStore.update({ highContrast:!settingsStore.get().highContrast });
  if (event.altKey && event.key.toLowerCase() === 't') settingsStore.update({ largeText:!settingsStore.get().largeText });
  if (event.key.toLowerCase() === 'f' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) document.documentElement.requestFullscreen?.();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('Service Worker não registrado.', error)));
addEventListener('beforeunload', () => { renderer?.destroy?.();adaptiveQuality.destroy();app.destroy(); });

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareVersions, isNewerVersion } from '../js/core/update-manager.js';
import { recommendQualityFromDiagnostics } from '../js/core/device-diagnostics.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [sw, app, css, pkgRaw, manifestRaw, state, progress, immersive] = await Promise.all([
  readFile(resolve(root, 'sw.js'), 'utf8'),
  readFile(resolve(root, 'js/app.js'), 'utf8'),
  readFile(resolve(root, 'css/app.css'), 'utf8'),
  readFile(resolve(root, 'package.json'), 'utf8'),
  readFile(resolve(root, 'version-manifest.json'), 'utf8'),
  readFile(resolve(root, 'js/core/state.js'), 'utf8'),
  readFile(resolve(root, 'js/core/mission-progress.js'), 'utf8'),
  readFile(resolve(root, 'js/modules/immersive-suite.js'), 'utf8'),
]);
const pkg = JSON.parse(pkgRaw);
const manifest = JSON.parse(manifestRaw);
assert.equal(pkg.version, '3.2.0');
assert.equal(manifest.portalVersion, '3.2.0');
assert.equal(manifest.schemaVersion, 15);
assert.equal(compareVersions('3.2.0', '3.1.0'), 1);
assert.equal(compareVersions('3.2.0', '3.2.0'), 0);
assert.equal(isNewerVersion('4.0.0', '3.2.0'), true);
assert.equal(recommendQualityFromDiagnostics({ hardware: { memoryGb: 1, cores: 2 }, viewport: { mobile: true }, preferences: {}, network: {}, support: { webgl: true }, benchmark: { score: 20 } }), 'low');
assert.equal(recommendQualityFromDiagnostics({ hardware: { memoryGb: 8, cores: 8 }, viewport: { mobile: false }, preferences: {}, network: {}, support: { webgl: true }, benchmark: { score: 110 } }), 'ultra');
assert.match(sw, /STATIC_CACHE/);
assert.match(sw, /RUNTIME_CACHE/);
assert.match(sw, /request\.mode === 'navigate'/);
assert.match(sw, /version-manifest\.json/);
assert.match(sw, /SKIP_WAITING/);
assert.doesNotMatch(sw, /install'[\s\S]{0,180}skipWaiting/);
assert.match(app, /before_app_update/);
assert.match(app, /SALVAR E ATUALIZAR/);
assert.match(app, /collectDeviceDiagnostics/);
assert.match(state, /storageSchemaVersion: 15/);
assert.match(progress, /version: 9/);
assert.match(progress, /version: 8/);
assert.match(progress, /orientation/);
assert.match(immersive, /MODO IMERSIVO/);
assert.match(immersive, /Desempenho crítico persistente/);
assert.match(immersive, /screen\.orientation/);
assert.match(css, /app-update-banner/);
assert.match(css, /device-diagnostic-grid/);
assert.match(css, /immersive-orientation-note/);
assert.match(css, /focus-visible/);
const assetBlock = sw.match(/const ASSETS = \[([\s\S]*?)\];/);
assert.ok(assetBlock, 'Lista ASSETS do Service Worker ausente.');
const assets = [...assetBlock[1].matchAll(/'\.\/([^']*)'/g)].map((match) => match[1]);
for (const asset of assets) await access(resolve(root, asset));
console.log(`OK: runtime 3.2.0, atualização segura, diagnóstico local, mobile imersivo e ${assets.length} recursos offline declarados validados.`);

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app.css'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'museum/data/catalog.json'), 'utf8'));
const models = JSON.parse(fs.readFileSync(path.join(root, 'museum/models/index.json'), 'utf8'));

const tests = [];
function test(name, condition, detail = '') {
  tests.push({ name, status: condition ? 'pass' : 'fail', detail });
}

const expectedGroups = { consoles: 6, controles: 5, sensores: 4 };
const ids = catalog.items.map((item) => item.id);
const uniqueIds = new Set(ids);

test('Versão pública sincronizada em v0.39.0', String(version.version).startsWith('0.39.0') && (app.includes("version: '0.39.0'") || app.includes("version: '0.39.0-hotfix1'")) && (sw.includes("VERSION = '0.39.0'") || sw.includes("VERSION = '0.39.0-hotfix1'")));
test('Catálogo do museu usa schemaVersion 1', catalog.schemaVersion === 1);
test('Catálogo possui 15 itens', catalog.items.length === 15, String(catalog.items.length));
test('Todos os IDs do museu são únicos', uniqueIds.size === catalog.items.length);
for (const [group, expected] of Object.entries(expectedGroups)) {
  const count = catalog.items.filter((item) => item.group === group).length;
  test(`Coleção ${group} possui ${expected} itens`, count === expected, String(count));
}
for (const item of catalog.items) {
  const imagePath = path.join(root, item.image.replace(/^\.\//, ''));
  test(`Imagem local existe: ${item.id}`, fs.existsSync(imagePath));
  test(`Asset ${item.id} possui fallback 360°`, item.modelStatus === 'procedural' && Boolean(item.viewerShape));
}
test('Visualizador 360° está em módulo separado', fs.existsSync(path.join(root, 'museum/viewer/museum-viewer.js')));
test('Visualizador é importado dinamicamente', app.includes("import(`./museum/viewer/museum-viewer.js?v=${BUILD_INFO.version}`)"));
test('Catálogo externo é carregado sob demanda', app.includes("fetch('./museum/data/catalog.json'"));
test('Service Worker pré-carrega apenas catálogo e visualizador', sw.includes("'./museum/data/catalog.json'") && sw.includes("'./museum/viewer/museum-viewer.js'"));
test('Service Worker não pré-carrega as 15 imagens', !sw.includes("'./museum/images/atari-2600.svg'"));
test('Fallback 2D é restaurado em caso de erro', app.includes("A vista 2D local foi restaurada"));
test('Modo 360° possui botão próprio', app.includes('id="museum-mode-360"'));
test('Rotação pode ser pausada', app.includes('id="museum-rotation-toggle"') && app.includes('museumViewerController.toggle()'));
test('Miniaturas usam loading lazy', app.includes('loading="lazy" decoding="async"'));
test('Pipeline GLB/glTF foi preparado', models.format.includes('glb') && models.format.includes('gltf') && models.fallback === 'procedural-canvas');
test('Linha do tempo possui percurso guiado', app.includes('id="timeline-guide-start"') && app.includes('function renderGuidedTimeline'));
test('Percurso possui barra de progresso', app.includes('id="timeline-guide-progress"'));
test('Percurso possui navegação anterior/próxima', app.includes('id="timeline-guide-prev"') && app.includes('id="timeline-guide-next"'));
test('Percurso abre catálogo por era', app.includes('function openGuidedCatalog()') && app.includes('setEraFilter(era)'));
test('Percurso abre item contextual do museu', app.includes('function openGuidedMuseum()') && app.includes('museumId'));
const guidedEraKeys = ['1950-1969','1970-1979','1980-1989','1990-1999','2000-2009','2010-2019','2020-atual'];
for (const era of guidedEraKeys) test(`Narrativa guiada existe: ${era}`, app.includes(`'${era}': { title:`));
test('CSS responsivo do percurso guiado existe', css.includes('.timeline-guide-stage') && css.includes('@media (max-width: 760px)'));
test('CSS do canvas 360° existe', css.includes('.museum-360-canvas') && css.includes('touch-action: none'));
test('Preferência de movimento reduzido é respeitada', app.includes('reducedMotion: settings.reducedMotion'));

const failures = tests.filter((item) => item.status === 'fail');
const result = {
  schemaVersion: 1,
  version: '0.37.2',
  suite: 'Museu e Linha do Tempo',
  generatedAt: new Date().toISOString(),
  summary: { total: tests.length, passed: tests.length - failures.length, failed: failures.length },
  tests,
};
fs.writeFileSync(path.join(__dirname, 'museum-timeline-test-results.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.summary));
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure.name} ${failure.detail}`);
  process.exit(1);
}

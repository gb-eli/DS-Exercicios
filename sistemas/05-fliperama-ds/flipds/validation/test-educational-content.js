const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app.css'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
const learning = JSON.parse(fs.readFileSync(path.join(root, 'education/game-learning.json'), 'utf8'));

const results = [];
function test(name, condition, detail = '') {
  results.push({ name, status: condition ? 'pass' : 'fail', detail });
  if (!condition) process.exitCode = 1;
}

const playableIds = [...app.matchAll(/'([a-z0-9-]+)': \(\) => Promise\.resolve\(\)\.then\(\(\) => __importStar\(__require\("games\//g)].map(match => match[1]);
const uniquePlayable = [...new Set(playableIds)];
const fields = ['experienceType','stageLabel','modes','difficulties','graphics','progression','historyFacts','curiosities','codeTitle','codeLanguage','codeExample','qualityNotes'];

test('Versão pública sincronizada em v0.39.0', String(version.version).startsWith('0.39.0') && (app.includes("version: '0.39.0'") || app.includes("version: '0.39.0-hotfix1'")) && (sw.includes("VERSION = '0.39.0'") || sw.includes("VERSION = '0.39.0-hotfix1'")));
test('25 experiências jogáveis detectadas', uniquePlayable.length === 25, `${uniquePlayable.length} detectadas`);
test('25 fichas educacionais disponíveis', Object.keys(learning).length === 25, `${Object.keys(learning).length} fichas`);
test('Cobertura de todos os runtimes jogáveis', uniquePlayable.every(id => learning[id]), uniquePlayable.filter(id => !learning[id]).join(', '));
test('Sem fichas órfãs', Object.keys(learning).every(id => uniquePlayable.includes(id)), Object.keys(learning).filter(id => !uniquePlayable.includes(id)).join(', '));

for (const [id, item] of Object.entries(learning)) {
  test(`${id}: campos obrigatórios`, fields.every(field => field in item), fields.filter(field => !(field in item)).join(', '));
  test(`${id}: modos, dificuldades e gráficos`, item.modes.length >= 2 && item.difficulties.length >= 2 && item.graphics.length >= 3);
  test(`${id}: progressão estruturada`, item.progression.length >= 3);
  test(`${id}: história e curiosidades`, item.historyFacts.length >= 2 && item.curiosities.length >= 2);
  test(`${id}: exemplo de código didático`, item.codeExample.length >= 50 && item.codeExample.length <= 900, `${item.codeExample.length} caracteres`);
  test(`${id}: notas de qualidade`, item.qualityNotes.length >= 3);
}

test('Módulo educacional incorporado ao bundle', app.includes('__modules["data/game-learning.json"]') && app.includes('__require("data/game-learning.json")'));
test('Guia renderiza ficha padronizada', app.includes('FICHA EDUCACIONAL PADRONIZADA') && app.includes('Fases e progressão') && app.includes('Qualidade gráfica'));
test('Painel histórico inclui curiosidades', app.includes('history-learning-extra') && app.includes('<h4>Curiosidades</h4>'));
test('Painel de código inclui pseudocódigo e JavaScript', app.includes('Pseudocódigo estruturado') && app.includes('exemplo simplificado'));
test('Código didático é escapado antes do innerHTML', app.includes('escapeEducationalCode(learning.codeExample)') && app.includes('escapeEducationalCode(profile.pseudocode)'));
test('CSS responsivo da Fase 7.14', css.includes('Fase 7.14') && css.includes('.learning-spec-grid') && css.includes('.code-learning-grid'));
test('JSON educacional no shell offline', sw.includes("'./education/game-learning.json'"));

const summary = {
  product: 'Fliperama DS', version: '0.39.0', phase: 'Fase 7.14 — regressão educacional preservada na v0.39.0',
  generatedAt: new Date().toISOString(),
  summary: { total: results.length, passed: results.filter(r => r.status === 'pass').length, failed: results.filter(r => r.status === 'fail').length },
  results,
};
fs.writeFileSync(path.join(__dirname, 'educational-content-test-results.json'), JSON.stringify(summary, null, 2));
for (const result of results) console.log(`${result.status === 'pass' ? 'PASS' : 'FAIL'}: ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);

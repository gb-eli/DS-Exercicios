import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('atividades/index.html');
const ws=read('atividades/assets/js/workspace.js');
const uiSupervision=read('atividades/assets/js/supervision.js');
const edgeSupervision=read('core/edge-functions/supervision/index.ts');
const css=read('atividades/assets/css/app.css');
const admin=read('atividades/assets/js/admin.js');
const release=JSON.parse(read('release-current.json'));
const version=JSON.parse(read('atividades/version.json'));

test('P10.1 saídas continuam registradas sem bloqueio automático no código-fonte',()=>{
  assert.match(edgeSupervision,/const focusAlert=focus>=Number\(pol\.max_focus_violations\|\|3\)/);
  assert.match(edgeSupervision,/return J\(\{ok:true,locked:false,focus_alert:focusAlert/);
  assert.doesNotMatch(edgeSupervision,/Limite de \$\{pol\.max_focus_violations\|\|3\} saídas da atividade atingido/);
  assert.doesNotMatch(uiSupervision,/Ao atingir .*atividade será bloqueada/);
  assert.match(uiSupervision,/não bloqueiam automaticamente a atividade/);
  assert.match(admin,/max_focus_violations:3/);
  assert.match(admin,/Alerta após 3 saídas • não bloqueia/);
});

test('P10.1 editor e referência usam exatamente a mesma tipografia e altura de linha',()=>{
  assert.match(css,/:root\{--code-font-size:14px;--code-line-height:1\.55;--code-gutter-width:54px;--code-font-family:/);
  assert.match(css,/\.editor-shell \.code-highlight,[\s\S]*?font-size:var\(--code-font-size\)!important;[\s\S]*?line-height:var\(--code-line-height\)!important/);
  assert.match(css,/\.reference-code\{[\s\S]*?font-size:var\(--code-font-size\)!important;[\s\S]*?line-height:var\(--code-line-height\)!important/);
  assert.match(css,/\.editor-line-numbers\{[\s\S]*?font-size:var\(--code-font-size\)!important/);
});

test('P10.1 controles menos/mais alteram editor e referência juntos e persistem',()=>{
  for(const id of ['font-decrease-btn','font-size-label','font-increase-btn'])assert.match(html,new RegExp(`id=["']${id}["']`));
  assert.match(ws,/const CODE_FONT_MIN=11/);assert.match(ws,/const CODE_FONT_MAX=22/);
  assert.match(ws,/document\.documentElement\.style\.setProperty\('--code-font-size'/);
  assert.match(ws,/localStorage\.setItem\(CODE_FONT_STORAGE/);
  assert.match(ws,/font-decrease-btn[^\n]*adjustCodeFontSize\(-CODE_FONT_STEP\)/);
  assert.match(ws,/font-increase-btn[^\n]*adjustCodeFontSize\(CODE_FONT_STEP\)/);
});

test('P10.1 renderer mantém uma linha visual por linha real',()=>{
  assert.match(ws,/lines\[lines\.length-1\]===''\)lines\.pop\(\)/);
  assert.match(ws,/\}\)\.join\(''\)/);
  assert.match(css,/\.reference-code \.reference-line\{[\s\S]*?margin:0!important;[\s\S]*?padding:0!important/);
  assert.match(css,/\.reference-code \.reference-line-code\{[\s\S]*?white-space:pre!important/);
});

test('P10.1 release e UI foram incrementados',()=>{
  assert.equal(release.version,'14.10.8.65');
  assert.equal(version.version,'0.22.8.19');
  assert.equal(version.release,'v14.10.8.65');
  assert.match(html,/app\.js\?v=14\.10\.8/);
});

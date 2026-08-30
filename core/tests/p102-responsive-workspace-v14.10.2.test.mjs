import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('atividades/assets/css/app.css');
const ws=read('atividades/assets/js/workspace.js');
const html=read('atividades/index.html');
const release=JSON.parse(read('release-current.json'));
const version=JSON.parse(read('atividades/version.json'));
const deploy=JSON.parse(read('PUBLIC-DEPLOY.json'));

test('P10.2 gutter cresce com a fonte e permanece igual em editor e referência',()=>{
  assert.match(css,/--code-gutter-width:54px/);
  assert.match(ws,/const gutter=Math\.max\(52,Math\.min\(70,Math\.ceil\(size\*2\.6\+10\)\)\)/);
  assert.match(ws,/setProperty\('--code-gutter-width',`\$\{gutter\}px`\)/);
  assert.match(css,/\.editor-line-numbers\{[\s\S]*?width:var\(--code-gutter-width\)!important/);
  assert.match(css,/\.editor-shell \.code-highlight,[\s\S]*?left:var\(--code-gutter-width\)!important;[\s\S]*?width:calc\(100% - var\(--code-gutter-width\)\)!important/);
  assert.match(css,/\.reference-code \.reference-line\{grid-template-columns:var\(--code-gutter-width\) minmax\(max-content,1fr\)!important/);
});

test('P10.2 barra de arquivos mobile não usa mais sobreposição por margem negativa',()=>{
  assert.doesNotMatch(css,/margin-top:-34px/);
  assert.doesNotMatch(css,/width:calc\(100% - 76px\)/);
  assert.match(css,/\.workspace-subbar\{display:grid;grid-template-columns:minmax\(0,1fr\) auto;align-items:center;gap:8px\}/);
  assert.match(css,/\.workspace-save-pill\{align-self:center;justify-self:end;margin:0;white-space:nowrap\}/);
  assert.match(css,/@media\(max-width:430px\)\{[\s\S]*?\.workspace-subbar\{grid-template-columns:1fr\}[\s\S]*?\.workspace-save-pill\{justify-self:start\}/);
});

test('P10.2 controles de fonte e abas de saída continuam utilizáveis em tela estreita',()=>{
  assert.match(css,/\.code-font-controls\{order:20;grid-column:1\/-1;width:100%;justify-content:center;min-height:38px\}/);
  assert.match(css,/\.output-tabs\{overflow-x:auto;overflow-y:hidden;scrollbar-width:thin\}/);
  assert.match(css,/\.output-tab\{flex:0 0 auto\}/);
  for(const id of ['font-decrease-btn','font-size-label','font-increase-btn'])assert.match(html,new RegExp(`id=["']${id}["']`));
});

test('P10.2 metadata e cache representam a mesma release',()=>{
  assert.equal(release.version,'14.10.8.65');
  assert.equal(release.baseVersion,'14.10.8.64');
  assert.equal(release.liveDeployApplied,false);
  assert.equal(version.version,'0.22.8.19');
  assert.equal(version.release,'v14.10.8.65');
  assert.equal(deploy.release,'v14.10.8.65');
  assert.equal(deploy.ui,'0.22.8.19');
  assert.match(html,/app\.css\?v=14\.10\.8/);
  assert.match(html,/app\.js\?v=14\.10\.8/);
});

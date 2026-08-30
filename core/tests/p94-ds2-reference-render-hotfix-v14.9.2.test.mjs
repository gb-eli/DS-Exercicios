import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const ws=read('atividades/assets/js/workspace.js');
const css=read('atividades/assets/css/app.css');
const html=read('atividades/index.html');
const release=JSON.parse(read('release-current.json'));

test('P9.2 reference renderer normalizes legacy escaped newlines without touching normal formatted code',()=>{
  assert.match(ws,/function normalizeReferenceContent\(value\)/);
  assert.match(ws,/realNewlines===0&&escapedNewlines>=2/);
  assert.match(ws,/replace\(\/\\\\n\/g,'\\n'\)/);
  assert.match(ws,/normalizeReferenceContent\(content\)\.split\('\\n'\)/);
  assert.match(ws,/\}\)\.join\(''\)/);
});

test('P9.2 reference colors are isolated from transparent editor text',()=>{
  assert.match(css,/\.reference-code\{[\s\S]*?-webkit-text-fill-color:#f4f4f4!important/);
  assert.match(css,/\.reference-code \.reference-line-code\{[\s\S]*?color:#f4f4f4!important/);
  assert.match(css,/\.reference-code \.tok-string\{color:#e8aa91!important;-webkit-text-fill-color:#e8aa91!important/);
  assert.match(css,/\.reference-code \.tok-tag\{color:#62d5bd!important;-webkit-text-fill-color:#62d5bd!important/);
  assert.match(css,/\.reference-code \.tok-attr\{color:#b8e4ff!important;-webkit-text-fill-color:#b8e4ff!important/);
});

test('P9.2 activities cache bust uses the hotfix version',()=>{
  assert.equal(release.version,'14.10.8.65');
  assert.match(html,/app\.css\?v=14\.10\.8/);
  assert.match(html,/app\.js\?v=14\.10\.8/);
});

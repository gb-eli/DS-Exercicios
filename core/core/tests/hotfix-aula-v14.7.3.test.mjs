import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const workspace=fs.readFileSync('atividades/assets/js/workspace.js','utf8');
const adminCss=fs.readFileSync('admin/assets/admin.css','utf8');
const appCss=fs.readFileSync('atividades/assets/css/app.css','utf8');
const version=JSON.parse(fs.readFileSync('atividades/version.json','utf8'));

test('scroll vertical do Admin em notebook continua protegido',()=>{
  assert.match(adminCss,/html\{min-height:100%;overflow-x:hidden;overflow-y:auto/);
  assert.match(adminCss,/\.main\{min-height:100dvh;height:auto;overflow:visible\}/);
  assert.match(adminCss,/\.dialog\{max-height:calc\(100dvh - 24px\);overflow:auto\}/);
});

test('starter usa nomes reais de CSS e JS',()=>{
  assert.ok(workspace.includes("const css=defs.find(x=>/\\.css$/i.test"));
  assert.match(workspace,/const js=defs\.find/);
  assert.match(workspace,/href="\$\{cssHref\}"/);
  assert.match(workspace,/src="\$\{jsSrc\}"/);
});

test('conclusão atual passa pela autocorreção server-side e não conclui silenciosamente',()=>{
  assert.match(workspace,/async function runAutoGrade/);
  assert.match(workspace,/callAutograde\(\{action:'grade'/);
  assert.match(workspace,/callAutograde\(\{action:'submit'/);
  assert.doesNotMatch(workspace,/callActivityProgress\(\{action:'complete'/);
});

test('editor e saída continuam lado a lado em notebook compatível',()=>{
  assert.match(appCss,/@media\(min-width:1101px\) and \(max-width:1280px\)/);
  assert.match(version.release,/^v14\./);
});

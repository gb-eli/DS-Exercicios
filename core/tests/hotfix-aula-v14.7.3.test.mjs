import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const workspace=fs.readFileSync('atividades/assets/js/workspace.js','utf8');
const adminCss=fs.readFileSync('admin/assets/admin.css','utf8');
const appCss=fs.readFileSync('atividades/assets/css/app.css','utf8');
const version=JSON.parse(fs.readFileSync('atividades/version.json','utf8'));

test('v14.7.3 corrige scroll vertical do Admin em notebook',()=>{
  assert.match(adminCss,/html\{min-height:100%;overflow-x:hidden;overflow-y:auto/);
  assert.match(adminCss,/\.main\{min-height:100dvh;height:auto;overflow:visible\}/);
  assert.match(adminCss,/\.dialog\{max-height:calc\(100dvh - 24px\);overflow:auto\}/);
});

test('v14.7.3 gera starter usando nomes reais de CSS e JS',()=>{
  assert.ok(workspace.includes("const css=defs.find(x=>/\\.css$/i.test"));
  assert.match(workspace,/const js=defs\.find/);
  assert.match(workspace,/href="\$\{cssHref\}"/);
  assert.match(workspace,/src="\$\{jsSrc\}"/);
});

test('v14.7.3 não conclui arquivo vazio/comentário nem validador não suportado',()=>{
  assert.match(workspace,/function meaningfulFileContent/);
  assert.match(workspace,/function validationIsFullySupported/);
  assert.match(workspace,/A conclusão automática deste exercício ainda está em migração/);
  assert.match(workspace,/Complete os arquivos antes de (?:concluir|entregar)/);
});

test('v14.7.3 mantém editor e saída lado a lado em notebook compatível',()=>{
  assert.match(appCss,/@media\(min-width:1101px\) and \(max-width:1280px\)/);
  assert.match(version.release,/^v14\./);
});

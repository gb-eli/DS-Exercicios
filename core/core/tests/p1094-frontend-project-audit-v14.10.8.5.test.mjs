import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditFrontendProject} from '../tools/legacy-github-audit-engine.mjs';

test('P10.9.4 aceita geração histórica com style.css e onclick quando os arquivos existem',()=>{
  const r=auditFrontendProject({
    htmlPath:'ex01/index.html',
    htmlContent:'<link rel="stylesheet" href="style.css"><p id="mensagem"></p><button onclick="alterarTexto()"></button><script src="script.js"></script>',
    files:[
      {path:'ex01/style.css',content:'body{}'},
      {path:'ex01/script.js',content:'function alterarTexto(){document.getElementById("mensagem").innerText="ok";}'},
    ],
  });
  assert.equal(r.integrationReady,true);
  assert.equal(r.state,'integrated');
  assert.equal(r.inlineHandlers.length,1);
});

test('P10.9.4 detecta JS presente no repositório mas não carregado pelo HTML',()=>{
  const r=auditFrontendProject({
    htmlPath:'ML4/index.html',
    htmlContent:'<p id="mensagem"></p><script src="script.js"></script>',
    files:[{path:'ML4/exercicio04.js',content:'function mostrarNome(){}'}],
  });
  assert.equal(r.integrationReady,false);
  assert.equal(r.state,'missing_script');
  assert.equal(r.missingScripts[0].resolvedPath,'ML4/script.js');
});

test('P10.9.4 detecta divergência de id HTML versus JavaScript',()=>{
  const r=auditFrontendProject({
    htmlPath:'ex12/index.html',
    htmlContent:'<p id="resultadoEstudande"></p><script src="script.js"></script>',
    files:[{path:'ex12/script.js',content:'document.getElementById("resultadoEstudante").innerText="x";'}],
  });
  assert.equal(r.integrationReady,false);
  assert.equal(r.state,'dom_id_mismatch');
  assert.deepEqual(r.missingDomIds,['resultadoEstudante']);
});

test('P10.9.4 stylesheet ausente degrada visual sem confundir com JS ausente',()=>{
  const r=auditFrontendProject({
    htmlPath:'ML11/index.html',
    htmlContent:'<link rel="stylesheet" href="style.css"><div id="resultado"></div><script src="script.js"></script>',
    files:[
      {path:'ML11/style,.css',content:'body{}'},
      {path:'ML11/script.js',content:'document.getElementById("resultado").textContent="ok";'},
    ],
  });
  assert.equal(r.integrationReady,true);
  assert.equal(r.state,'missing_stylesheet');
  assert.equal(r.severity,1);
});

test('P10.9.4 relatório 2DS registra 59 claims e permanece read-only',()=>{
  const data=JSON.parse(fs.readFileSync('core/tests/fixtures/legacy-github-audit-aggregates-v14.10.8.7.json','utf8')).blocks['2ds_frontend'];
  assert.equal(data.claims_audited,59);
  assert.equal(data.students,4);
  assert.equal(data.writes_applied,false);
});

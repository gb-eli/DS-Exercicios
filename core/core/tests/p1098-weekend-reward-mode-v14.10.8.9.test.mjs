import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'atividades/assets/css/app.css'),'utf8');
const workspace=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const weekendPath=path.join(root,'atividades/assets/js/weekend-support.js');
const mod=await import(pathToFileURL(weekendPath).href);

test('P10.9.8 activates Saturday and closes Sunday exactly at 18:00 Sao Paulo',()=>{
  const saturday=mod.getWeekendWindow(new Date('2026-08-22T12:46:00-03:00'));
  assert.equal(saturday.eligible,true);
  assert.equal(saturday.phase,'saturday');
  assert.equal(saturday.weekendId,'2026-08-23');
  assert.equal(new Date(saturday.cutoffMs).toISOString(),'2026-08-23T21:00:00.000Z');
  assert.equal(mod.getWeekendWindow(new Date('2026-08-23T17:59:59-03:00')).eligible,true);
  assert.equal(mod.getWeekendWindow(new Date('2026-08-23T18:00:00-03:00')).eligible,false);
  assert.equal(mod.getWeekendWindow(new Date('2026-08-24T10:00:00-03:00')).eligible,false);
});

test('P10.9.8 banner, countdown, reward notification and opt-out are present',()=>{
  assert.match(html,/id="weekend-mode-banner"/);
  assert.match(html,/id="weekend-mode-countdown"/);
  assert.match(html,/id="weekend-mode-toggle"/);
  assert.match(html,/id="weekend-reward-dialog"/);
  assert.match(html,/Parabéns por estudar no fim de semana\./);
  assert.match(workspace,/WEEKEND_DISABLED_PREFIX/);
  assert.match(workspace,/toggleWeekendMode/);
  assert.match(workspace,/setInterval\(tickWeekendMode,1000\)/);
  assert.doesNotMatch(css,/@keyframes weekendShimmer|weekendFloat|weekendRewardPulse/);
  assert.doesNotMatch(html,/weekend-mode-orbit|weekend-reward-icon/);
});

test('P10.9.8 extra support finds disconnected DOM id and points to the line',()=>{
  const diag=mod.buildWeekendDiagnostics({
    filename:'script.js',language:'javascript',
    studentContent:'document.getElementById("resultadoX").textContent="ok";',
    referenceContent:'const resultado=document.getElementById("resultado");\nresultado.textContent="ok";',
    files:[{filename:'index.html',content:'<p id="resultado"></p><script src="script.js"></script>'},{filename:'script.js',content:'document.getElementById("resultadoX").textContent="ok";'}],
    serverDetail:{score:55,syntax_ok:true}
  });
  assert.equal(diag.focusLine,1);
  assert.ok(diag.suggestions.some(x=>/ID desconectado/.test(x.title)));
  assert.ok(diag.steps.at(-1).includes('Auto corrigir'));
});

test('P10.9.8 extra support detects missing linked asset without overwriting student code',()=>{
  const diag=mod.buildWeekendDiagnostics({
    filename:'index.html',language:'html',studentContent:'<link rel="stylesheet" href="estilo.css"><script src="script.js"></script><main></main>',
    referenceContent:'<main><button id="acao">Ok</button></main>',
    files:[{filename:'index.html',content:'<link rel="stylesheet" href="estilo.css"><script src="script.js"></script><main></main>'},{filename:'script-main.js',content:'console.log(1)'}],
    serverDetail:{score:45,syntax_ok:true}
  });
  assert.ok(diag.suggestions.some(x=>/Arquivo não conectado/.test(x.title)));
  assert.doesNotMatch(workspace,/\.value\s*=\s*referenceForFile/);
  assert.doesNotMatch(workspace,/student_files.*weekend/i);
});

test('P10.9.8 highlights exact editor line and keeps help optional',()=>{
  assert.match(html,/id="weekend-code-focus-line"/);
  assert.match(workspace,/state\.weekend\.focusLine/);
  assert.match(workspace,/weekend-focus/);
  assert.match(workspace,/renderWeekendSupport/);
  assert.match(css,/\.weekend-code-focus-line/);
  assert.match(css,/\.editor-line-numbers span\.weekend-focus/);
});

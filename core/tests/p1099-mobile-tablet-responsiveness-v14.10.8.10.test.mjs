import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const css=fs.readFileSync(path.join(root,'atividades/assets/css/app.css'),'utf8');
const workspace=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const supervision=fs.readFileSync(path.join(root,'atividades/assets/js/supervision.js'),'utf8');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const metrics=JSON.parse(fs.readFileSync(path.join(root,'AUDITORIA-MOBILE-TABLET-EVIDENCIAS/metrics.json'),'utf8'));
const baseline=JSON.parse(fs.readFileSync(path.join(root,'AUDITORIA-MOBILE-TABLET-EVIDENCIAS/before-v14.10.8.9/metrics.json'),'utf8'));

const byName=(rows,name)=>rows.find(row=>row.name===name);

test('P10.9.9 phone layout no longer expands the visual viewport because of code min-content',()=>{
  for(const name of ['phone360','phone390','phone430']){
    const before=byName(baseline,name),after=byName(metrics,name);
    assert.ok(before.viewport>after.viewport+300,`${name} baseline should expose the previous expanded layout viewport`);
    assert.equal(after.viewport,Number(name.replace('phone','')));
    assert.equal(after.horizontalOverflow,false);
    assert.equal(after.bodyScrollWidth,after.viewport);
  }
  assert.match(css,/\.exercise-view\{grid-template-columns:minmax\(0,1fr\);min-width:0;max-width:100%\}/);
});

test('P10.9.9 tablet portrait gives the editor almost the full content width',()=>{
  for(const name of ['tablet768','tablet820']){
    const before=byName(baseline,name),after=byName(metrics,name);
    assert.ok(after.workspace.w-before.workspace.w>=230,`${name} should reclaim sidebar width`);
    assert.ok(after.workspace.w>=after.viewport-50,`${name} editor should be near full-width`);
  }
  assert.match(css,/@media\(max-width:900px\)[\s\S]*\.exercise-layout\{display:flex!important;flex-direction:column!important/);
});

test('P10.9.9 touch controls and utility bar use mobile-safe sizing/density',()=>{
  assert.match(css,/@media\(max-width:760px\), \(pointer:coarse\)[\s\S]*\.button-small,\.file-tab,\.output-tab\{min-height:44px\}/);
  assert.match(css,/\.workspace-toolbar \.button\.button-small\{min-height:44px\}/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.workspace-utilitybar\{grid-template-columns:1fr 1fr!important/);
  assert.equal(byName(metrics,'phone360').minTouchTarget,44);
  assert.ok(byName(metrics,'phone360').utility.h<byName(baseline,'phone360').utility.h);
});

test('P10.9.9 editor prevents mobile focus zoom by enforcing 16px minimum on touch',()=>{
  assert.match(workspace,/function compactTouchWorkspace\(\)/);
  assert.match(workspace,/function codeFontMinimum\(\)\{return compactTouchWorkspace\(\)\?16:CODE_FONT_MIN;\}/);
  assert.match(workspace,/catch\(_\)\{return clampCodeFontSize\(14\);\}/);
});

test('P10.9.9 typing path avoids recalculating all reference variants on every key',()=>{
  assert.match(workspace,/referenceMatchCache:new Map\(\)/);
  assert.match(workspace,/referenceForFile\(file\.filename,\{fast:true\}\)/);
  assert.match(workspace,/scheduleReferenceRefresh\(\)/);
  assert.match(workspace,/compactTouchWorkspace\(\)\?650:420/);
  assert.match(workspace,/scheduleWeekendSupport\(\)/);
  assert.match(workspace,/compactTouchWorkspace\(\)\?700:450/);
});

test('P10.9.9 editor rendering limits expensive DOM/highlight work on low-power touch devices',()=>{
  assert.match(workspace,/gutter\.dataset\.signature!==signature/);
  assert.match(workspace,/compactTouchWorkspace\(\)&&source\.length>24000/);
  assert.match(workspace,/requestAnimationFrame/);
});

test('P10.9.9 symbol palette follows dynamic viewport and internal scrolling is contained',()=>{
  assert.match(css,/max-height:min\(55dvh,460px\)/);
  assert.match(css,/max-height:calc\(55dvh - 96px\)/);
  assert.match(css,/overscroll-behavior:contain/);
  assert.match(css,/-webkit-overflow-scrolling:touch/);
});

test('P10.9.9 supervision snapshots are less aggressive on constrained screens',()=>{
  assert.match(supervision,/window\.matchMedia\?\.\('\(pointer: coarse\)'\)\.matches/);
  assert.match(supervision,/window\.innerWidth<=900/);
  assert.match(supervision,/setTimeout\(send, constrained\?450:220\)/);
});

test('P10.9.9 runtime assets are cache-busted to the mobile/tablet release',()=>{
  assert.match(html,/app\.css\?v=14\.10\.8\.18/);
  assert.match(html,/app\.js\?v=14\.10\.8\.18/);
  assert.match(workspace,/weekend-support\.js\?v=14\.10\.8\.18/);
});

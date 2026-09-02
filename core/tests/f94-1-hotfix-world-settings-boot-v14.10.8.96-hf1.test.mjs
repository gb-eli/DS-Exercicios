import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const lobby=read('lobby/assets/lobby.js');
const html=read('lobby/index.html');
const boot=read('lobby/assets/boot.js');
const vendor=read('lobby/assets/vendor-loader.js');
const swreg=read('lobby/assets/sw-register.js');
const sw=read('lobby/sw.js');
const deploy=read('PUBLIC-DEPLOY.json');

function declarations(source){
  const out=new Set();
  for(const m of source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g))out.add(m[1]);
  for(const m of source.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\b/g))out.add(m[1]);
  for(const m of source.matchAll(/import\s*\{([^}]*)\}\s*from/gs))for(const raw of m[1].split(',')){const part=raw.trim();if(part)out.add(part.split(/\s+as\s+/).at(-1).trim());}
  return out;
}

test('F94.1 HF1 restores the missing world settings opener before handler binding',()=>{
  assert.match(lobby,/function openWorldSettings\(\)\{syncWorldSettingsForm\(\);openModal\('world-settings-modal'\);\}/);
  assert.ok(lobby.indexOf('function openWorldSettings()') < lobby.indexOf("$('world-settings-button').onclick=openWorldSettings"));
});

test('F94.1 HF1 leaves no undeclared direct event-handler references in lobby.js',()=>{
  const declared=declarations(lobby),missing=[];
  for(const m of lobby.matchAll(/\.(?:onclick|onsubmit|oninput|onchange|onpointerdown|onpointerup)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g))if(!declared.has(m[1]))missing.push(m[1]);
  assert.deepEqual(missing,[]);
});

test('F94.1 HF1 world settings sync targets exist in the HTML',()=>{
  const start=lobby.indexOf('function syncWorldSettingsForm()'),end=lobby.indexOf('async function applyWorldSettings()',start),chunk=lobby.slice(start,end);
  const ids=[...chunk.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
  const missing=[...new Set(ids)].filter(id=>!html.includes(`id="${id}"`));
  assert.deepEqual(missing,[]);
});

test('F94.1 HF1 cache bust is coherent across the critical boot chain',()=>{
  const marker='14.10.8.96-stage65-f94-auto-calibration-hf1';
  assert.match(html,new RegExp(marker.replaceAll('.','\\.')));
  assert.match(vendor,/boot\.js\?v=\$\{VERSION\}-stage65-f94-auto-calibration-hf1/);
  assert.match(boot,/lobby\.js\?v=\$\{VERSION\}-stage65-f94-auto-calibration-hf1/);
  assert.match(swreg,/14\.10\.8\.96-stage65-f94-auto-calibration-hf1/);
  assert.match(sw,/agv-lobby-runtime-\$\{VERSION\}-stage65-f94-auto-calibration-hf1/);
  assert.match(sw,/lobby\.js\?v=14\.10\.8\.96-stage65-f94-auto-calibration-hf1/);
  assert.match(deploy,/F94\.1-HF1-open-world-settings-boot/);
});

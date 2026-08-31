import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Supabase JS usa UMD pinado/contingência e não usa +esm nas superfícies críticas',()=>{
  const lobbyVendor=read('lobby/assets/vendor-loader.js');
  const atividades=read('atividades/assets/js/supabase.js');
  const core=read('core/sdk/agv-core-browser-bootstrap.js');
  for(const s of [lobbyVendor,atividades,core]){
    assert.doesNotMatch(s,/supabase-js[^\n]*\+esm/);
    assert.match(s,/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.112\.3\/dist\/umd\/supabase\.js/);
    assert.match(s,/globalThis\.supabase\?\.createClient/);
  }
});

test('entrypoints auditados usam cache bust v14.10.8.3',()=>{
  assert.match(read('lobby/index.html'),/assets\/vendor-loader\.js\?v=14\.10\.8/);
  assert.match(read('lobby/assets/vendor-loader.js'),/assets\/boot\.js\?v=\$\{VERSION\}/);
  assert.match(read('lobby/assets/boot.js'),/`\.\/lobby\.js\?v=\$\{VERSION\}(?:-stage\d+)?`/);
  assert.match(read('lobby/assets/lobby.js'),/supabase\.js\?v=14\.10\.8/);
  assert.match(read('atividades/index.html'),/assets\/js\/app\.js\?v=14\.10\.8/);
});

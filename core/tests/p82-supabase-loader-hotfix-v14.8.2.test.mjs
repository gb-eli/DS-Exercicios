import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Lobby e Atividades não usam mais jsDelivr +esm para Supabase',()=>{
  for(const p of ['lobby/assets/supabase.js','atividades/assets/js/supabase.js','core/sdk/agv-core-browser-bootstrap.js']){
    const s=read(p);
    assert.doesNotMatch(s,/supabase-js[^\n]*\+esm/);
    assert.match(s,/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.111\.0/);
    assert.match(s,/globalThis\.supabase\?\.createClient/);
  }
});

test('entrypoints mantêm cache bust v14.8.2 ou superior',()=>{
  for(const [file,rx] of [
    ['lobby/index.html',/assets\/boot\.js\?v=14\.8\.[23]/],
    ['lobby/assets/boot.js',/lobby\.js\?v=14\.8\.[23]/],
    ['lobby/assets/lobby.js',/supabase\.js\?v=14\.8\.[23]/],
    ['atividades/index.html',/assets\/js\/app\.js\?v=14\.8\.[23]/]
  ]) assert.match(read(file),rx);
});

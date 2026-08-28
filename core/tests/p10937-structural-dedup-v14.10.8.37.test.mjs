import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const exists=rel=>fs.existsSync(path.join(root,rel));
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

test('public frontend has a single source of truth at repository root',()=>{
  for(const dir of ['admin','assets','atividades','lobby','loja-universal','professor','prova','reset-password','sistemas']){
    assert.equal(exists(dir),true,`${dir} must exist at root`);
    assert.equal(exists(`core/${dir}`),false,`core/${dir} mirror must not exist`);
  }
  assert.equal(exists('core/core'),false,'recursive core/core mirror must not exist');
  assert.equal(exists('core/index.html'),false,'stale core/index.html must not exist');
});

test('core is restricted to shared/backend concerns',()=>{
  const dirs=fs.readdirSync(path.join(root,'core'),{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort();
  assert.deepEqual(dirs,['catalog','contracts','database','edge-functions','sdk','session','tests','tools']);
});

test('current central runtime points at v14.10.8.37',()=>{
  assert.match(read('index.html'),/14\.10\.8\.(?:3[7-9]|[4-9]\d|\d{3,})/);
  assert.match(read('lobby/assets/boot.js'),/14\.10\.8\.(?:3[7-9]|[4-9]\d|\d{3,})/);
  assert.match(read('lobby/sw.js'),/14\.10\.8\.(?:3[7-9]|[4-9]\d|\d{3,})/);
  assert.match(read('prova/index.html'),/14\.10\.8\.(?:3[7-9]|[4-9]\d|\d{3,})/);
  const rel=JSON.parse(read('release-current.json'));
  assert.ok(Number(rel.version.split('.').at(-1))>=37);
});

test('old divergent mirror versions cannot be reached through core frontend paths',()=>{
  for(const rel of ['core/lobby/assets/boot.js','core/prova/index.html','core/admin/index.html','core/atividades/index.html','core/professor/index.html']) assert.equal(exists(rel),false,rel);
});

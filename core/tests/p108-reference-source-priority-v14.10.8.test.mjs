import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workspace=fs.readFileSync('atividades/assets/js/workspace.js','utf8');
const version=JSON.parse(fs.readFileSync('atividades/version.json','utf8'));
const release=JSON.parse(fs.readFileSync('release-current.json','utf8'));
const deploy=JSON.parse(fs.readFileSync('PUBLIC-DEPLOY.json','utf8'));

test('P10.8 referência sincronizada vence fallback local inclusive por alias',()=>{
  assert.match(workspace,/candidates\.find\(file=>file\.source==='supabase'&&normalizeFilename\(file\.filename\)===exact\)/);
  assert.match(workspace,/\|\|candidates\.find\(file=>file\.source==='supabase'\)/);
  for(const pair of [['style.css','estilo.css'],['app.js','script.js'],['atividade.md','referencia.md'],['mainactivity.kt','main.kt']]){
    for(const name of pair)assert.match(workspace,new RegExp(`name==='${name.replace('.','\\.')}'`));
  }
});

test('P10.8 metadados, UI e deploy representam a mesma release',()=>{
  assert.equal(version.release,'v14.10.8.65');
  assert.equal(version.version,'0.22.8.19');
  assert.equal(version.phase,'maintenance-etapa-6-release-metadata');
  assert.equal(release.version,'14.10.8.65');
  assert.equal(release.phase,'maintenance-etapa-6-release-metadata');
  assert.equal(deploy.release,'v14.10.8.65');
  assert.equal(deploy.ui,'0.22.8.19');
});

test('P10.8 grafo público usa cache bust da release atual',()=>{
  for(const file of [
    'atividades/index.html','atividades/assets/js/app.js','atividades/assets/js/workspace.js',
    'atividades/assets/js/supervision.js','atividades/assets/js/supabase.js','atividades/preview/index.html',
    'index.html','admin/index.html','professor/index.html','lobby/index.html'
  ]){
    const source=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(source,/v=14\.10\.7/,`${file} ainda aponta para cache antigo`);
  }
});

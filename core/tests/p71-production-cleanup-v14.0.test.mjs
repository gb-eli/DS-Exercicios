import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const legacy=JSON.parse(read('core/catalog/legacy-routes-v14.0.json'));
const catalog=JSON.parse(read('core/catalog/platform-integration-v14.0.json'));

test('P7.1 mantem dez rotas canonicas existentes',()=>{
  assert.equal(catalog.version,'14.0.0');
  assert.equal(catalog.platforms.length,10);
  for(const p of catalog.platforms){assert.ok(fs.existsSync(path.join(ROOT,p.route)),`rota ausente: ${p.route}`)}
});

test('P7.1 rotas historicas viraram stubs de compatibilidade',()=>{
  assert.ok(legacy.aliases.length>=13);
  for(const a of legacy.aliases){
    const f=path.join(ROOT,a.legacy); assert.ok(fs.existsSync(f),`alias ausente ${a.legacy}`);
    const html=fs.readFileSync(f,'utf8');
    assert.match(html,/Esta versão foi consolidada/);
    assert.match(html,/location\.replace/);
    assert.match(html,/location\.search/);
    assert.match(html,/location\.hash/);
    const dir=path.dirname(f); const files=fs.readdirSync(dir,{withFileTypes:true}).filter(x=>x.isFile());
    assert.deepEqual(files.map(x=>x.name),['index.html']);
  }
});

test('P7.1 Hub e painel do aluno usam catalogo v14',()=>{
  assert.match(read('assets/hub.js'),/platform-integration-v14\.0\.json/);
  assert.match(read('atividades/assets/js/app.js'),/platform-integration-v14\.0\.json/);
});

test('P7.1 nao introduz segredo de backend',()=>{
  const files=['assets/hub.js','atividades/assets/js/app.js'];
  for(const f of files) assert.doesNotMatch(read(f),/service_role|SUPABASE_SERVICE/i);
});

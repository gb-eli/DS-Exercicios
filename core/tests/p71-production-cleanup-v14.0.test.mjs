import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const legacy=JSON.parse(read('core/catalog/legacy-routes-v14.0.json'));
const catalog=JSON.parse(read('core/catalog/platform-integration-v14.0.json'));
const versionTuple=value=>String(value||'').split('.').slice(0,3).map(part=>Number.parseInt(part,10)||0);
const versionAtLeast=(value,min='14.0.0')=>{const a=versionTuple(value),b=versionTuple(min);for(let i=0;i<3;i++){if(a[i]>b[i])return true;if(a[i]<b[i])return false;}return true;};

test('P7.1 mantem dez rotas canonicas existentes',()=>{
  assert.equal(catalog.schema,'agv-platform-integration-catalog');
  assert.ok(versionAtLeast(catalog.version,'14.0.0'),`catalogo regrediu de versão: ${catalog.version}`);
  assert.equal(catalog.platforms.length,10);
  assert.equal(new Set(catalog.platforms.map(p=>p.id)).size,10,'ids canonicos devem ser unicos');
  for(const p of catalog.platforms){
    assert.ok(p.route&&!/^https?:/i.test(p.route),`rota canonica deve permanecer local: ${p.id}`);
    assert.ok(fs.existsSync(path.join(ROOT,p.route)),`rota ausente: ${p.route}`);
  }
});

test('P7.1 rotas historicas viraram stubs de compatibilidade',()=>{
  assert.ok(legacy.aliases.length>=13);
  for(const a of legacy.aliases){
    const f=path.join(ROOT,a.legacy); assert.ok(fs.existsSync(f),`alias ausente ${a.legacy}`);
    const html=fs.readFileSync(f,'utf8');
    assert.match(html,/Esta versão foi consolidada/);
    assert.match(html,/unified-auth-guard\.js/);
    assert.match(html,/AGVUnifiedAuth\?\.readSession/);
    assert.match(html,/location\.replace/);
    assert.match(html,/target\.search=location\.search/);
    assert.match(html,/target\.hash=location\.hash/);
    assert.ok(html.includes(JSON.stringify(a.canonical)),`destino divergente em ${a.legacy}`);
    assert.doesNotMatch(html,/signInWithPassword|password\s*[:=]/i);
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

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('release-current is synchronized to v14.10.8.36',()=>{
  for(const p of ['release-current.json','core/release-current.json']){
    const x=JSON.parse(read(p));
    assert.equal(x.version,'14.10.8.36');
  }
});

test('root repair page can unregister lobby service worker and delete lobby caches',()=>{
  const s=read('repair-lobby.html');
  assert.match(s,/14\.10\.8\.36/);
  assert.match(s,/getRegistrations/);
  assert.match(s,/reg\.unregister/);
  assert.match(s,/agv-lobby-runtime-/);
  assert.match(s,/caches\.delete/);
  assert.match(s,/repairRelease/);
  assert.match(s,/não foi publicada corretamente|NÃO está publicada corretamente/i);
});

test('repair page verifies the critical public asset chain before redirect',()=>{
  const s=read('repair-lobby.html');
  for(const token of ['lobby/index.html','lobby/assets/diagnostics.js','lobby/assets/vendor-loader.js','lobby/assets/boot.js','lobby/assets/lobby.js','lobby/sw.js']) assert.match(s,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(s,/failed\.length/);
  assert.match(s,/location\.assign/);
});

test('boot preflights modules and exposes repair route',()=>{
  const s=read('lobby/assets/boot.js');
  assert.match(s,/boot_asset_probe/);
  assert.match(s,/asset_invalido/);
  assert.match(s,/repair-lobby\.html/);
  for(const token of ['lobby.js','supabase.js','config.js','lobby3d.js','lobby-lite.js']) assert.match(s,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});

test('lobby executable tree contains v14.10.8.36 and no old release markers',()=>{
  const files=['index.html','assets/boot.js','assets/vendor-loader.js','assets/lobby.js','assets/lobby3d.js','assets/lobby-lite.js','assets/supabase.js','assets/sw-register.js','assets/diagnostics.js','sw.js'];
  for(const f of files){
    const s=read('lobby/'+f);
    if(f!=='assets/lobby-lite.js') assert.match(s,/14\.10\.8\.36/);
    assert.doesNotMatch(s,/14\.10\.8\.(?:18(?:\.2)?|19\.1|28|29|30|31|32|33|34|35)(?!\d)/);
  }
});

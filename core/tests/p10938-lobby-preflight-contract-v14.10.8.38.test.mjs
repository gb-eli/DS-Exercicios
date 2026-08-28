import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('boot validates module contracts instead of requiring a release marker in every asset',()=>{
  const s=read('lobby/assets/boot.js');
  assert.match(s,/ASSET_SIGNATURES/);
  assert.match(s,/signaturesOk/);
  assert.match(s,/A ausência de um marcador literal da release NÃO torna o módulo inválido/);
  assert.doesNotMatch(s,/!versionOk/);
  assert.doesNotMatch(s,/!versionMarker/);
});

test('config.js is a valid stable module even without embedded build release',()=>{
  const s=read('lobby/assets/config.js');
  for(const token of ['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','SCHOOL_EMAIL_DOMAIN','ACTIVITY_URL','LOBBY_VERSION']) assert.match(s,new RegExp(token));
});

test('preflight checks all runtime modules by contract signatures',()=>{
  const s=read('lobby/assets/boot.js');
  for(const token of ["'lobby.js'","'supabase.js'","'config.js'","'lobby3d.js'","'lobby-lite.js'",'contentType','htmlLike','jsLike']) assert.match(s,new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')));
});

test('current release is v14.10.8.38 or newer and repair page targets current release',()=>{
  const rel=JSON.parse(read('release-current.json'));
  const m=rel.version.match(/^14\.10\.8\.(\d+)$/);assert.ok(m&&Number(m[1])>=38);
  const escaped=rel.version.replace(/\./g,'\\.');
  assert.match(read('repair-lobby.html'),new RegExp(escaped));
  assert.match(read('lobby/assets/boot.js'),new RegExp(escaped));
  assert.match(read('lobby/sw.js'),new RegExp(escaped));
});

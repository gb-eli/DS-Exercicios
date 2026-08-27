import fs from 'node:fs';
import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('manifesto-plataformas.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('core/catalog/platform-integration-v13.5.json','utf8'));
assert.equal(manifest.integrationWave,'P6.7-complete');
assert.equal(catalog.platforms.length,10);
for(const p of catalog.platforms){
  assert.equal(p.authAuthority,'agv-core',`${p.id}: auth authority`);
  assert.equal(p.readyForUnifiedHub,true,`${p.id}: hub readiness`);
  assert.ok(p.route && p.route.endsWith('index.html'),`${p.id}: route`);
  assert.ok(['lab-exercises-core','agv-progress-event'].includes(p.progressAuthority),`${p.id}: progress authority`);
}
for(const id of ['lab-virtual','ctf-ds','desafio-ds','game-informatica','planetario-ds','fliperama-ds']){
 const p=manifest.platforms.find(x=>x.id===id); assert.ok(p.status.startsWith('agv-core-wave'),`${id}: stale status`);
}
const publicText=['index.html','atividades/assets/app.js','admin/assets/admin.js'].filter(fs.existsSync).map(f=>fs.readFileSync(f,'utf8')).join('\n');
assert.ok(!/service_role/i.test(publicText),'public UI must not expose service_role');
console.log('P6.7 final integration audit v13.5 — PASS');

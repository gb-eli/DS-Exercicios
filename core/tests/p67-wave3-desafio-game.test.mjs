import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const [base,id] of [['sistemas/04-desafio-ds/desafio 33','desafio-ds'],['sistemas/06-game-informatica/desafio-informatica-v2.2.0','game-informatica']]){
 const file=base.includes('desafio 33')?'js/agv-core-session.js':'assets/js/agv-core-session.js';const s=read(base+'/'+file);
 assert.match(s,/sb-iresvqwyaqotghjssncg-auth-token/);assert.match(s,/agv-progress-event/);assert.match(s,/authority:'agv-core'/);assert.doesNotMatch(s,/service_role/i);assert.match(read(base+'/index.html'),/agv-core-session\.js/);
}
assert.match(read('sistemas/04-desafio-ds/desafio 33/js/agv-core-session.js'),/ds:challenge-result/);
assert.match(read('sistemas/06-game-informatica/desafio-informatica-v2.2.0/assets/js/app.js'),/AGVPlatformCore\?\.progress/);
console.log('P6.7 Wave 3 — PASS');

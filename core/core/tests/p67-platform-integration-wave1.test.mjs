import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const bridges=[
'sistemas/07-lab-exercicios-sub/versao-aluno/assets/js/agv-core-bridge.js',
'sistemas/08-lab-exercicios-ds1/modo-aluno/disciplinas/analise-metodos/assets/js/agv-core-bridge.js',
'sistemas/08-lab-exercicios-ds1/modo-aluno/disciplinas/introducao-programacao/assets/js/agv-core-bridge.js',
'sistemas/09-lab-exercicios-ds2/modo-aluno/frontend/assets/js/agv-core-bridge.js',
'sistemas/09-lab-exercicios-ds2/modo-aluno/inovacao/assets/js/agv-core-bridge.js'];
test('P6.7 wave1 labs use canonical AGV session instead of isolated sessionStorage',()=>{
 for(const rel of bridges){const s=fs.readFileSync(path.join(root,rel),'utf8');
  assert.match(s,/sb-\$\{REF\}-auth-token/);assert.match(s,/localStorage\.setItem\(SK/);
  assert.doesNotMatch(s,/const store=\(\)=>sessionStorage/);assert.match(s,/LEGACY_SK/);assert.match(s,/authority:'agv-core'/);
 }
});
test('P6.7 wave1 DS3 legado foi desativado sem reabrir sessão paralela',()=>{
 const s=fs.readFileSync(path.join(root,'sistemas/10-lab-exercicios-ds3/modo-aluno/index.html'),'utf8');
 assert.match(s,/atividades\//);assert.doesNotMatch(s,/sessionStorage|service_role|claim_core_reward/i);
});
test('P6.7 wave1 manifests mark local progress non-authoritative',()=>{
 for(const id of ['07-lab-exercicios-sub','08-lab-exercicios-ds1','09-lab-exercicios-ds2','10-lab-exercicios-ds3']){
  const p=path.join(root,'sistemas',id,'_AGV_CORE','platform-integration.json');const d=JSON.parse(fs.readFileSync(p));
  assert.equal(d.session.crossSurface,true);assert.equal(d.localStatePolicy.identity,'not_authoritative');assert.equal(d.localStatePolicy.officialProgress,'lab-exercises-core');
 }
});
test('P6.7 wave1 does not expose service role or client reward authority',()=>{
 for(const rel of bridges){const s=fs.readFileSync(path.join(root,rel),'utf8');assert.doesNotMatch(s,/service_role|SUPABASE_SERVICE_ROLE_KEY|claim_core_reward/i);}
});

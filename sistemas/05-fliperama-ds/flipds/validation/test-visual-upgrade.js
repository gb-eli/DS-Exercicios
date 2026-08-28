#!/usr/bin/env node
'use strict';
const fs=require('node:fs'); const path=require('node:path'); const crypto=require('node:crypto'); const {XMLParser}=(()=>({XMLParser:null}))();
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
const learning=JSON.parse(fs.readFileSync(path.join(root,'education/game-learning.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'graphics/visual-upgrade-v0.35.0.json'),'utf8'));
const baseline=JSON.parse(fs.readFileSync(path.join(root,'validation/visual-upgrade-simulation-baseline-v0.34.2.json'),'utf8'));
const results=[];
function test(name,condition,detail=''){results.push({name,status:condition?'pass':'fail',detail}); if(!condition)process.exitCode=1;}
function moduleBlock(key){const marker=`__modules["${key}"]`;const start=app.indexOf(marker);if(start<0)return '';let end=app.indexOf('\n  };\n  __modules["',start+marker.length);if(end<0)end=app.length;return app.slice(start,end);}
function sha(s){return crypto.createHash('sha256').update(s).digest('hex');}
const games=['trap-lab','vector-fleet','raster-rally','space-blocks','data-maze','block-reactor'];
test('Versão pública v0.35.0 sincronizada',version.version==='0.35.0'&&app.includes("version: '0.35.0'")&&sw.includes("VERSION = '0.35.0'")&&index.includes('v0.35.0'));
test('Fase gráfica 7.16A publicada',version.phase.includes('Fase 7.16A')&&version.channel.includes('upgrade gráfico'));
test('Metadados de palco por jogo ativos',app.includes("visualStage.dataset.game = activeGameId")&&app.includes("visualStage.dataset.graphics = resolvedGraphicsMode()"));
test('Camadas visuais não capturam ponteiro',css.includes('pointer-events:none'));
test('Movimento reduzido desliga animações',css.includes('prefers-reduced-motion:reduce')&&css.includes('animation:none!important'));
test('Perfil Histórico reduz efeitos',css.includes('data-graphics="historico"'));
test('Perfil Baixo reduz efeitos',css.includes('data-graphics="baixo"'));
test('Perfil Ultra amplia efeitos',css.includes('data-graphics="ultra"'));
for(const id of games){
  test(`${id} · manifesto visual`,Boolean(manifest.games[id]));
  test(`${id} · cinco perfis visuais`,manifest.games[id]?.profiles?.length===5);
  test(`${id} · tema CSS dedicado`,css.includes(`data-game="${id}"`));
  const p1=path.join(root,'media/games',id,'preview-01.svg'); const p2=path.join(root,'media/games',id,'preview-02.svg');
  const a=fs.readFileSync(p1,'utf8'), b=fs.readFileSync(p2,'utf8');
  test(`${id} · preview 01 modernizado`,a.length>2400&&a.includes('<svg')&&a.includes('MODERNO'),`${a.length} bytes`);
  test(`${id} · preview 02 modernizado`,b.length>2600&&b.includes('<svg')&&b.includes('MODERNO'),`${b.length} bytes`);
  test(`${id} · ficha educacional declara Alto`,learning[id]?.graphics?.includes('Alto'));
}
const markerChecks={
 'trap-lab':['height - tileSize * 0.24','fillEllipse(playerX','state.elapsedMs / 420'],
 'vector-fleet':['0x2942a8','fillTriangle(nose.x','fillPath()'],
 'raster-rally':['state.speed > 78','speed','track.accent, 0.035'],
 'space-blocks':['0x442a9a','strokeRoundedRect(originX - 5','0xffffff, 0.17'],
 'data-maze':['scanY','fillRoundedRect(originX - padding','fillEllipse(x, y + size'],
 'block-reactor':['for (let ring = 4','radius * (mode === \'ultra\' ? 3.4 : 2.5)','blockHeight * 0.16']
};
const runtimeKeys={
 'trap-lab':'games/trap-lab/phaser/trap-lab-runtime',
 'vector-fleet':'games/vector-fleet/phaser/vector-fleet-runtime',
 'raster-rally':'games/raster-rally/phaser/raster-rally-runtime',
 'space-blocks':'games/space-blocks/phaser/space-blocks-runtime',
 'data-maze':'games/data-maze/phaser/data-maze-runtime',
 'block-reactor':'games/block-reactor/phaser/block-reactor-runtime'
};
for(const [id,markers] of Object.entries(markerChecks)){
 const block=moduleBlock(runtimeKeys[id]);
 test(`${id} · runtime visual presente`,markers.every(m=>block.includes(m)),markers.filter(m=>!block.includes(m)).join(', '));
}
let unchanged=0;
for(const [key,expected] of Object.entries(baseline.modules)){
 const block=moduleBlock(key); const ok=block&&sha(block)===expected; if(ok)unchanged++; test(`Simulação preservada · ${key}`,ok);
}
test('Todas as simulações da baseline foram preservadas',unchanged===Object.keys(baseline.modules).length,`${unchanged}/${Object.keys(baseline.modules).length}`);
const runtimeCount=[...app.matchAll(/'([a-z0-9-]+)': \(\) => Promise\.resolve\(\)\.then\(\(\) => __importStar\(__require\("games\//g)].length;
test('Nenhum runtime novo foi adicionado neste bloco',runtimeCount===18,`${runtimeCount} runtimes`);
const summary={product:'Fliperama DS',version:'0.35.0',phase:version.phase,generatedAt:new Date().toISOString(),summary:{total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length},results};
fs.writeFileSync(path.join(__dirname,'visual-upgrade-test-results-v0.35.0.json'),JSON.stringify(summary,null,2));
for(const r of results)console.log(`${r.status==='pass'?'PASS':'FAIL'}: ${r.name}${r.detail?` — ${r.detail}`:''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);

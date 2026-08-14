#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const baselineRoot='/mnt/data/work_v036';
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const baseApp=fs.readFileSync(path.join(baselineRoot,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'graphics/visual-upgrade-v0.35.2.json'),'utf8'));
const voxelCss=fs.readFileSync(path.join(root,'games/voxelcraft-ds/css/style.css'),'utf8');
const voxelGame=fs.readFileSync(path.join(root,'games/voxelcraft-ds/js/game.js'),'utf8');
const results=[];
function test(name,condition,detail=''){results.push({name,status:condition?'pass':'fail',detail});if(!condition)process.exitCode=1;}
function sha(s){return crypto.createHash('sha256').update(s).digest('hex');}
function moduleBlock(source,key){const marker=`__modules["${key}"]`;const start=source.indexOf(marker);if(start<0)return '';let end=source.indexOf('\n  };\n  __modules["',start+marker.length);if(end<0)end=source.length;return source.slice(start,end);}
const games=['state-quest-rpg','bit-bridge-16','raycast-corridors','polygon-sector-94','camera-evolution','voxelcraft-ds'];
test('Versão pública v0.35.2 sincronizada',version.version==='0.35.2'&&app.includes("version: '0.35.2'")&&sw.includes("VERSION = '0.35.2'")&&index.includes('v0.35.2'));
test('Fase 7.16C identificada',version.phase.includes('Fase 7.16C')&&version.phase.includes('Bloco 3/3'));
test('Manifesto gráfico v0.35.2 válido',manifest.version==='0.35.2'&&Object.keys(manifest.games).length===6);
test('Camadas de palco não capturam ponteiro',css.includes('pointer-events:none'));
test('Redução de movimento permanece suportada',css.includes('prefers-reduced-motion:reduce'));
for(const id of games){
  test(`${id} · manifesto presente`,Boolean(manifest.games[id]));
  test(`${id} · perfis gráficos declarados`,Array.isArray(manifest.games[id]?.profiles)&&manifest.games[id].profiles.length>=5);
  test(`${id} · tema CSS dedicado`,css.includes(`data-game="${id}"`));
  for(const i of [1,2]){
    const p=path.join(root,'media/games',id,`preview-0${i}.svg`),bp=path.join(baselineRoot,'media/games',id,`preview-0${i}.svg`);
    const data=fs.readFileSync(p,'utf8'),base=fs.readFileSync(bp,'utf8');
    test(`${id} · preview 0${i} SVG`,data.includes('<svg')&&data.includes('960')&&data.length>1800,`${data.length} bytes`);
    test(`${id} · preview 0${i} foi redesenhado`,sha(data)!==sha(base));
  }
}
const markers={
 'state-quest-rpg':['fillGradientStyle(0x02040b','fillEllipse(playerX + tile / 2','graphics.fillCircle(width * 0.16'],
 'bit-bridge-16':['platformWidth, platform.height * scale','graphics.fillCircle(portalX','fillEllipse(worldX(state.player.x)'],
 'raycast-corridors':['fillGradientStyle(0x071122','graphics.strokeCircle(x + width / 2','graphics.fillCircle(screenX'],
 'polygon-sector-94':['#drawAtmosphere(materialMode, historical, nowMs)','cornerColor','accentColor'],
 'camera-evolution':['#drawCameraLabAtmosphere(materialMode, historical, nowMs, state)','fovScale','lensColor']
};
const keys={
 'state-quest-rpg':'games/state-quest-rpg/phaser/state-quest-runtime',
 'bit-bridge-16':'games/bit-bridge-16/phaser/bit-bridge-runtime',
 'raycast-corridors':'games/raycast-corridors/phaser/raycast-corridors-runtime',
 'polygon-sector-94':'games/polygon-sector-94/webgl/polygon-sector-renderer',
 'camera-evolution':'games/camera-evolution/webgl/camera-evolution-renderer'
};
for(const [id,list] of Object.entries(markers)){
 const block=moduleBlock(app,keys[id]);
 for(const marker of list)test(`${id} · efeito ${marker.slice(0,28)}`,block.includes(marker));
}
test('VoxelCraft · céu dinâmico',voxelGame.includes('skyDay')&&voxelGame.includes('skyDusk')&&voxelGame.includes('scene.background.copy'));
test('VoxelCraft · fog dinâmico',voxelGame.includes('scene.fog.color.copy'));
test('VoxelCraft · sol visual',voxelGame.includes('skySun')&&voxelGame.includes('SphereGeometry'));
test('VoxelCraft · exposição dinâmica',voxelGame.includes('renderer.toneMappingExposure=1.02+daylight*.14'));
test('VoxelCraft · HUD visual modernizado',voxelCss.includes('acabamento visual VoxelCraft')&&voxelCss.includes('#game3d::before')&&voxelCss.includes('#hotbar'));
// All simulation modules embedded in app.js must remain byte-identical to v0.35.1.
const modulePattern=/__modules\["([^"]*\/simulation\/[^"]+)"\]/g;
const simKeys=[...baseApp.matchAll(modulePattern)].map(m=>m[1]);
let unchanged=0;
for(const key of simKeys){const before=moduleBlock(baseApp,key),after=moduleBlock(app,key);const ok=Boolean(before&&after&&sha(before)===sha(after));if(ok)unchanged++;test(`Simulação preservada · ${key}`,ok);}
test('Todas as simulações integradas preservadas',unchanged===simKeys.length,`${unchanged}/${simKeys.length}`);
const runtimeCount=[...app.matchAll(/'([a-z0-9-]+)': \(\) => Promise\.resolve\(\)\.then\(\(\) => __importStar\(__require\("games\//g)].length;
test('18 runtimes preservados',runtimeCount===18,`${runtimeCount}`);
test('106 módulos preservados',(app.match(/__modules\["/g)||[]).length===106,`${(app.match(/__modules\["/g)||[]).length}`);
const summary={product:'Fliperama DS',version:'0.35.2',phase:version.phase,generatedAt:new Date().toISOString(),summary:{total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length},results};
fs.writeFileSync(path.join(__dirname,'visual-upgrade-block3-results-v0.35.2.json'),JSON.stringify(summary,null,2));
for(const r of results)console.log(`${r.status==='pass'?'PASS':'FAIL'}: ${r.name}${r.detail?` — ${r.detail}`:''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);

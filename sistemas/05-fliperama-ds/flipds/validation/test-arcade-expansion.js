#!/usr/bin/env node
'use strict';
const fs=require('node:fs'); const path=require('node:path'); const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
const learning=JSON.parse(fs.readFileSync(path.join(root,'education/game-learning.json'),'utf8'));
function loadBundle(){let source=app;const marker="  __require('main');\n})();";if(!source.includes(marker))throw new Error('Entrada do bundle não encontrada');source=source.replace(marker,"  globalThis.__fliperamaRequire = __require;\n  globalThis.__fliperamaModules = __modules;\n})();");const context={console,globalThis:null,window:{matchMedia:()=>({matches:false}),devicePixelRatio:1},navigator:{},document:{},setTimeout,clearTimeout,performance:{now:()=>Date.now()}};context.globalThis=context;vm.createContext(context);vm.runInContext(source,context,{filename:'app.js',timeout:20000});return context.__fliperamaRequire;}
const req=loadBundle(); const results=[];
function test(name,condition,detail=''){results.push({name,status:condition?'pass':'fail',detail});if(!condition)process.exitCode=1;}
function eq(name,actual,expected){test(name,JSON.stringify(actual)===JSON.stringify(expected),`obtido ${JSON.stringify(actual)} · esperado ${JSON.stringify(expected)}`);}

test('Expansão arcade preservada na v0.39.0',String(version.version).startsWith('0.39.0')&&(app.includes("version: '0.39.0'") || app.includes("version: '0.39.0-hotfix1'"))&&(sw.includes("VERSION = '0.39.0'") || sw.includes("VERSION = '0.39.0-hotfix1'")));
test('Fase pública atual sincronizada',version.phase.includes('Fase 7.28')&&app.includes('Chess Arena 360')); 
test('Interface de missão inserida',app.includes('arcade-mission-card')&&app.includes('MISSÃO DA CAMPANHA'));
test('Interface de medalha inserida',app.includes('result-medal')&&app.includes('Medalha de ouro'));
test('Tutorial de ações inserido',app.includes('training-progress')&&app.includes('markTrainingAction'));
test('Estatísticas locais com chave versionada',app.includes("fliperama-ds-arcade-stats-v1")&&app.includes('sessions: stats.sessions + 1'));
test('CSS responsivo da expansão',css.includes('Fase 7.15')&&css.includes('.training-chip.done')&&css.includes('@media (max-width: 620px)'));

const Tennis=req('games/vector-tennis/simulation/vector-tennis-simulation').VectorTennisSimulation;
const tennisTargets={}; for(const d of ['iniciante','normal','desafio']) tennisTargets[d]=new Tennis(d).state.targetScore;
eq('Vector Tennis · metas 3/5/7',tennisTargets,{iniciante:3,normal:5,desafio:7});
const oldTennis=new Tennis('desafio'); oldTennis.restore({schemaVersion:1,leftY:.5,rightY:.5,ballX:.5,ballY:.5,ballVx:.4,ballVy:.2,playerScore:0,cpuScore:0,elapsedMs:0,serving:true});
test('Vector Tennis · save antigo migrado',oldTennis.state.schemaVersion===3&&oldTennis.state.targetScore===5&&oldTennis.state.difficulty==='normal'&&oldTennis.state.opponent==='cpu');
test('Vector Tennis · ficha educacional atualizada',learning['vector-tennis'].stageLabel.includes('3, 5 ou 7'));

const Space=req('games/space-blocks/simulation/space-blocks-simulation').SpaceBlocksSimulation;
const spaceTargets={}; for(const mode of ['progressivo','pratica','sprint12','maratona24']) spaceTargets[mode]=new Space(mode,123).state.targetLines;
eq('Space Blocks · metas dos quatro modos',spaceTargets,{progressivo:0,pratica:0,sprint12:12,maratona24:24});
const oldSpace=new Space('progressivo',123); const oldSpaceState={...oldSpace.state,schemaVersion:1}; delete oldSpaceState.targetLines; oldSpace.restore(oldSpaceState);
test('Space Blocks · save schema 1 migrado',oldSpace.state.schemaVersion===2&&oldSpace.state.targetLines===0);
const sprint=new Space('sprint12',123); let st=sprint.state; const board=st.board.map(r=>[...r]); for(const row of [18,19]) for(let x=0;x<10;x++) board[row][x]=(x===3||x===4)?0:'I';
sprint.restore({...st,status:'playing',lines:11,board,activePiece:{kind:'O',rotation:0,x:2,y:18},targetLines:12}); const sprintEvents=sprint.hardDrop();
test('Space Blocks · Sprint conclui ao atingir a meta',sprint.state.status==='victory'&&sprint.state.lines>=12&&sprintEvents.includes('challenge-complete'),`${sprint.state.lines} linhas · ${sprintEvents.join(',')}`);
test('Space Blocks · ficha possui Sprint e Maratona',learning['space-blocks'].modes.some(x=>x.includes('Sprint'))&&learning['space-blocks'].modes.some(x=>x.includes('Maratona')));

const Fleet=req('games/vector-fleet/simulation/vector-fleet-simulation').VectorFleetSimulation;
const fleetData={}; for(const d of ['cadete','piloto','comandante']){const sim=new Fleet(d,123);fleetData[d]={target:sim.state.targetWave,lives:sim.state.lives};}
eq('Vector Fleet · campanhas e vidas',fleetData,{cadete:{target:5,lives:4},piloto:{target:6,lives:3},comandante:{target:7,lives:3}});
const fleetOld=new Fleet('piloto',123); let fleetOldState={...fleetOld.state,schemaVersion:1}; delete fleetOldState.targetWave; fleetOld.restore(fleetOldState);
test('Vector Fleet · save antigo migrado',fleetOld.state.schemaVersion===2&&fleetOld.state.targetWave===6);
const fleetWin=new Fleet('cadete',123); let fw=fleetWin.state; fleetWin.restore({...fw,status:'playing',wave:5,targetWave:5,asteroids:[],bullets:[],waveDelayMs:800,ship:{...fw.ship,invulnerableMs:9999}}); const fleetEvents=fleetWin.step(100);
test('Vector Fleet · vitória na última onda',fleetWin.state.status==='victory'&&fleetEvents.includes('victory'),fleetEvents.join(','));

const Block=req('games/block-reactor/simulation/block-reactor-simulation').BlockReactorSimulation;
const block=new Block('campanha-normal',123); block.start(); const blockLevels=[]; let blockEvents=[];
for(let i=0;i<5;i++){const state=block.state; block.restore({...state,status:'playing',serving:true,blocks:state.blocks.map(b=>({...b,alive:false,hits:0}))}); blockEvents=block.step(1); blockLevels.push(block.state.level);}
test('Reator de Blocos · cinco fases percorridas',blockLevels.slice(0,4).join(',')==='2,3,4,5'&&block.state.status==='victory',`${blockLevels.join(',')} · ${block.state.status}`);
test('Reator de Blocos · fase 4 possui padrão próprio',app.includes("level === 4 && (row === 0 || row === rows - 1)"));
test('Reator de Blocos · fase 5 possui núcleo dividido',app.includes("level === 5 && row >= 2 && row <= 4"));
test('Reator de Blocos · ficha anuncia cinco fases',learning['block-reactor'].stageLabel.includes('cinco fases'));

const Orbital=req('games/orbital-sentinel/simulation/orbital-sentinel-simulation').OrbitalSentinelSimulation;
const orbitalTargets={}; for(const d of ['cadete','defensor','elite']) orbitalTargets[d]=new Orbital(d,123).state.targetWave;
eq('Sentinela Orbital · campanhas 4/5/6',orbitalTargets,{cadete:4,defensor:5,elite:6});
const orbitalOld=new Orbital('defensor',123); let orbitalOldState={...orbitalOld.state,schemaVersion:1}; delete orbitalOldState.targetWave; orbitalOld.restore(orbitalOldState);
test('Sentinela Orbital · save antigo migrado',orbitalOld.state.schemaVersion===2&&orbitalOld.state.targetWave===5);
const orbitalWin=new Orbital('elite',123); const ow=orbitalWin.state; orbitalWin.restore({...ow,status:'playing',wave:6,targetWave:6,enemies:ow.enemies.map(e=>({...e,alive:false})),shots:[],invulnerableMs:9999}); const orbitalEvents=orbitalWin.step(1);
test('Sentinela Orbital · vitória na onda 6',orbitalWin.state.status==='victory'&&orbitalEvents.includes('victory'),orbitalEvents.join(','));
const orbitalSix=new Orbital('elite',123); const os=orbitalSix.state; orbitalSix.restore({...os,status:'playing',wave:5,targetWave:6,enemies:os.enemies.map(e=>({...e,alive:false})),shots:[]}); orbitalSix.step(1);
test('Sentinela Orbital · formação ampliada na onda 6',orbitalSix.state.wave===6&&orbitalSix.state.enemies.length===60,`${orbitalSix.state.enemies.length} inimigos`);

const Motion=req('games/motion-beat/simulation/motion-beat-simulation');
const motionCounts={}; for(const mode of ['aprendiz','normal','desafio','maratona','acessivel']) motionCounts[mode]=new Motion.MotionBeatSimulation(mode).state.notes.length;
test('Motion Beat · cinco modos disponíveis',Object.keys(motionCounts).length===5&&motionCounts.normal>motionCounts.aprendiz&&motionCounts.maratona>motionCounts.normal,JSON.stringify(motionCounts));
eq('Motion Beat · parser reconhece modos novos',[Motion.parseMotionBeatDifficulty('normal'),Motion.parseMotionBeatDifficulty('maratona')],['normal','maratona']);
for(const mode of ['normal','maratona']){const sim=new Motion.MotionBeatSimulation(mode);sim.start();let guard=0;while(sim.state.status==='playing'&&guard++<500){const state=sim.state;const note=state.notes[state.noteCursor];if(!note)break;sim.step(Math.max(0,note.timeMs-state.elapsedMs));sim.hit(note.lane);}test(`Motion Beat · ${mode} concluível`,sim.state.status==='won',`${sim.state.noteCursor}/${sim.state.notes.length}`);}

for(const id of ['vector-tennis','space-blocks','vector-fleet','block-reactor','orbital-sentinel','motion-beat']) test(`${id} · progressão educacional ampliada`,learning[id].progression.length>=5,`${learning[id].progression.length} etapas`);
test('Regras de medalha bronze/prata/ouro presentes',app.includes("return 'ouro'")&&app.includes("return 'prata'")&&app.includes("return won ? 'bronze'"));
test('Expansão arcade preservada com novo runtime isolado',([...app.matchAll(/'([a-z0-9-]+)': \(\) => Promise\.resolve\(\)\.then\(\(\) => __importStar\(__require\("games\//g)].map(m=>m[1])).length===25 && app.includes("'duo-elementos-ds'") && app.includes("'plataforma-classica-ds'") && app.includes("'crystal-cascade-3d'") && app.includes("'plataforma-poligonal-ds-3d'"));

const summary={product:'Fliperama DS',version:'0.39.0',phase:'Fase 7.15A — regressão preservada na v0.39.0',generatedAt:new Date().toISOString(),summary:{total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length},results};
fs.writeFileSync(path.join(__dirname,'arcade-expansion-test-results.json'),JSON.stringify(summary,null,2));
for(const r of results) console.log(`${r.status==='pass'?'PASS':'FAIL'}: ${r.name}${r.detail?` — ${r.detail}`:''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);

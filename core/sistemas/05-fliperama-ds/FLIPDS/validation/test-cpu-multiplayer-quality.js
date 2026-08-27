#!/usr/bin/env node
'use strict';
const fs=require('node:fs'); const path=require('node:path'); const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const learning=JSON.parse(fs.readFileSync(path.join(root,'education/game-learning.json'),'utf8'));
const profiles=JSON.parse(fs.readFileSync(path.join(root,'game-profiles.json'),'utf8'));
function loadBundle(){let source=app;const marker="  __require('main');\n})();";if(!source.includes(marker))throw new Error('Entrada do bundle não encontrada');source=source.replace(marker,"  globalThis.__fliperamaRequire = __require;\n})();");const context={console,globalThis:null,window:{matchMedia:()=>({matches:false}),devicePixelRatio:1},navigator:{},document:{},setTimeout,clearTimeout,performance:{now:()=>Date.now()}};context.globalThis=context;vm.createContext(context);vm.runInContext(source,context,{filename:'app.js',timeout:30000});return context.__fliperamaRequire;}
const req=loadBundle(); const results=[];
function test(name,condition,detail=''){results.push({name,status:condition?'pass':'fail',detail});if(!condition)process.exitCode=1;}
function eq(name,actual,expected){test(name,JSON.stringify(actual)===JSON.stringify(expected),`obtido ${JSON.stringify(actual)} · esperado ${JSON.stringify(expected)}`);}
const Board=req('games/board-arena/simulation/board-arena-simulation').BoardArenaSimulation;
const Tennis=req('games/vector-tennis/simulation/vector-tennis-simulation').VectorTennisSimulation;
const catalog=req('data/catalog.json');
const presentation=req('data/game-presentations').gamePresentation;

// Board Arena — multiplayer local.
const localTic=new Board('velha','local','local'); localTic.start();
const localTicEvents=[localTic.select(0),localTic.select(3),localTic.select(1),localTic.select(4),localTic.select(2)];
test('Board Arena · Jogo da Velha local alterna turnos',localTicEvents[0].includes('turn-changed')&&localTicEvents[1].includes('turn-changed'));
test('Board Arena · Jogador 1 pode vencer localmente',localTic.state.status==='player-won'&&localTic.state.opponent==='local');
const localTicP2=new Board('velha','local','local'); localTicP2.start(); [0,3,1,4,8,5].forEach(i=>localTicP2.select(i));
test('Board Arena · Jogador 2 pode vencer localmente',localTicP2.state.status==='cpu-won'&&localTicP2.state.opponent==='local');
const localDama=new Board('dama','local','local'); localDama.start(); localDama.select(40); const firstTargets=[...localDama.state.legalTargets]; localDama.select(33); localDama.select(17); const secondTargets=[...localDama.state.legalTargets];
test('Board Arena · Dama local aceita jogada dos dois lados',firstTargets.includes(33)&&localDama.state.turn==='cpu'&&secondTargets.includes(24));

// Board Arena — CPU, delays and random profiles.
const boardCpu=new Board('velha','normal','cpu'); boardCpu.start(); const beforeMoves=boardCpu.state.moveCount; boardCpu.select(0); const delay=boardCpu.state.cpuDelayRemainingMs; const halfSteps=Math.max(1,Math.floor(delay/200)); for(let i=0;i<halfSteps;i++) boardCpu.step(100); const midMoves=boardCpu.state.moveCount; for(let i=0;i<30&&boardCpu.state.cpuThinking;i++) boardCpu.step(100);
test('Board Arena · CPU não responde instantaneamente',delay>=400&&midMoves===beforeMoves+1&&boardCpu.state.moveCount===beforeMoves+2,`atraso ${delay} ms`);
const boardDifficulties=new Set(), boardPersonalities=new Set(); for(let i=0;i<48;i++){const sim=new Board('velha','aleatoria','cpu');boardDifficulties.add(sim.state.difficulty);boardPersonalities.add(sim.state.cpuPersonality);}
test('Board Arena · CPU Surpresa varia dificuldade',boardDifficulties.size>=3,[...boardDifficulties].join(', '));
test('Board Arena · CPU varia personalidade',boardPersonalities.size===4,[...boardPersonalities].join(', '));
const legacyBoard=new Board(); const legacyGrid=Array(9).fill('.'); legacyGrid[0]='X'; legacyBoard.restore({schemaVersion:1,mode:'velha',difficulty:'aprendiz',board:legacyGrid,turn:'player',status:'playing',selectedIndex:null,moveCount:1,playerCaptures:0,cpuCaptures:0,elapsedMs:50,score:0,message:'antigo'});
test('Board Arena · saves antigos migram para schema 3',legacyBoard.state.schemaVersion===3&&legacyBoard.state.difficulty==='iniciante'&&legacyBoard.state.opponent==='cpu');

// Vector Tennis — local, CPU and random strategy.
const localTennis=new Tennis('normal','local',5,123456); localTennis.setPlayerDirection(-1); localTennis.setOpponentDirection(1); localTennis.step(.15);
test('Vector Tennis · controles locais são independentes',localTennis.state.leftY<.5&&localTennis.state.rightY>.5,`J1 ${localTennis.state.leftY.toFixed(3)} · J2 ${localTennis.state.rightY.toFixed(3)}`);
test('Vector Tennis · modo local preserva meta escolhida',localTennis.state.opponent==='local'&&localTennis.state.targetScore===5);
const tennisCpu=new Tennis('normal','cpu',5,987654321); tennisCpu.serve(); const firstReaction=tennisCpu.state.cpuReactionRemainingMs; const firstAim=tennisCpu.state.cpuAimY; let decisionEvents=[]; for(let i=0;i<60;i++) decisionEvents.push(...tennisCpu.step(1/30));
test('Vector Tennis · CPU usa intervalo de reação',firstReaction>=245&&firstReaction<=445,`${firstReaction} ms`);
test('Vector Tennis · CPU toma novas decisões durante a troca',tennisCpu.state.cpuDecisionCount>=2&&decisionEvents.includes('cpu-decision'),`${tennisCpu.state.cpuDecisionCount} decisões`);
test('Vector Tennis · CPU não usa erro senoidal fixo',!app.includes('cpuError * Math.sin(state.elapsedMs / 370)')&&app.includes('cpuReactionRemainingMs'));
const tennisDifficulties=new Set(), tennisPersonalities=new Set(); for(let seed=1;seed<=64;seed++){const sim=new Tennis('aleatoria','cpu',5,seed);tennisDifficulties.add(sim.state.difficulty);tennisPersonalities.add(sim.state.cpuPersonality);}
test('Vector Tennis · CPU Surpresa varia dificuldade',tennisDifficulties.size===3,[...tennisDifficulties].join(', '));
test('Vector Tennis · CPU varia estratégia',tennisPersonalities.size===4,[...tennisPersonalities].join(', '));
const legacyTennis=new Tennis('desafio'); legacyTennis.restore({schemaVersion:1,leftY:.5,rightY:.5,ballX:.5,ballY:.5,ballVx:.4,ballVy:.2,playerScore:0,cpuScore:0,elapsedMs:0,serving:true});
test('Vector Tennis · saves antigos migram para schema 3',legacyTennis.state.schemaVersion===3&&legacyTennis.state.opponent==='cpu'&&legacyTennis.state.targetScore===5);

// Profiles, controls, explanations and source consistency.
test('Perfil Vector Tennis inclui CPU aleatória',Boolean(profiles['vector-tennis'].options['cpu-aleatoria']));
test('Perfil Vector Tennis inclui três metas locais',['local-3','local-5','local-7'].every(k=>profiles['vector-tennis'].options[k]));
test('Perfil Board Arena inclui dois jogadores',['velha-local','dama-local'].every(k=>profiles['board-arena'].options[k]));
test('Perfil Board Arena inclui CPU Surpresa',['velha-cpu-aleatoria','dama-cpu-aleatoria'].every(k=>profiles['board-arena'].options[k]));
test('Controles do tênis separam J1 e J2',profiles['vector-tennis'].keyActions.KeyW==='move-up'&&profiles['vector-tennis'].keyActions.ArrowUp==='player2-up');
const tennisManifest=catalog.find(g=>g.id==='vector-tennis'); const spaceManifest=catalog.find(g=>g.id==='space-blocks');
test('Manifesto Vector Tennis declara ações do Jogador 2',tennisManifest.inputActions.includes('player2-up')&&tennisManifest.inputActions.includes('player2-down'));
test('Manifesto Space Blocks declara queda instantânea',spaceManifest.inputActions.includes('secondary-action'));
test('Explicação Vector Tennis não fixa cinco pontos',!presentation(tennisManifest).structure.some(x=>x.includes('única até cinco'))&&presentation(tennisManifest).victory.includes('3, 5 ou 7'));
test('Explicação da Dama informa variante didática',presentation(catalog.find(g=>g.id==='board-arena')).structure.some(x=>x.includes('variante')||x.includes('Dama 8 × 8 didática')));
test('Ficha educacional descreve multiplayer e CPU',learning['vector-tennis'].modes.some(x=>x.includes('2 jogadores'))&&learning['board-arena'].modes.some(x=>x.includes('local')));

// Global functional/content/asset audit for all playable games.
const playable=catalog.filter(g=>g.status==='jogavel'||g.status==='publicado');
for(const game of playable){
 const guide=presentation(game); const profile=profiles[game.id]; const sheet=learning[game.id];
 test(`${game.id} · controles e perfil`,Boolean(profile)&&Array.isArray(profile.tutorialSteps)&&profile.tutorialSteps.length>=3&&profile.keyboardHelp.length>4);
 test(`${game.id} · contexto e explicação`,Boolean(guide.objective)&&guide.howToPlay.length>=3&&guide.controls.length>=1&&guide.logic.length>=2);
 test(`${game.id} · qualidade gráfica declarada`,Array.isArray(game.supportedGraphicsModes)&&game.supportedGraphicsModes.length>=2&&sheet.qualityNotes.length>=2);
 for(const index of [1,2]){
  const file=path.join(root,'media','games',game.id,`preview-0${index}.svg`);
  const source=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
  test(`${game.id} · preview 0${index}`,source.startsWith('<svg')&&source.includes('aria-label')&&source.length>500,`${source.length} bytes`);
 }
}

const summary={product:'Fliperama DS',version:'0.38.3',phase:'Fase 7.24 — regressão competitiva preservada com Floresta de Circuitos',generatedAt:new Date().toISOString(),summary:{total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length},results};
fs.writeFileSync(path.join(__dirname,'cpu-multiplayer-quality-results.json'),JSON.stringify(summary,null,2));
for(const r of results) console.log(`${r.status==='pass'?'PASS':'FAIL'}: ${r.name}${r.detail?` — ${r.detail}`:''}`);
console.log(`\n${summary.summary.passed}/${summary.summary.total} verificações aprovadas.`);

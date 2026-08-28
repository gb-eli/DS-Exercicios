#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
let source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const marker = "  __require('main');\n})();";
if (!source.includes(marker)) throw new Error('Ponto de inicialização do bundle não encontrado.');
source = source.replace(marker, '  globalThis.__fliperamaRequire = __require;\n})();');
const context = { console, globalThis: null, window: { matchMedia: () => ({ matches: false }), devicePixelRatio: 1 }, navigator: {}, document: {}, setTimeout, clearTimeout, performance: { now: () => Date.now() } };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'app.js', timeout: 20_000 });
const req = context.__fliperamaRequire;
const checks=[]; const check=(name,ok,detail,data)=>checks.push({name,status:ok?'pass':'fail',detail,...(data?{data}:{})});

// Puzzle Forge: 3 desafios por modalidade = 12 desafios.
const puzzle = req('games/puzzle-forge/simulation/puzzle-forge-simulation');
for (const mode of ['caminho','circuito','sequencia','labirinto']) {
  const sim = new puzzle.PuzzleForgeSimulation(mode,'aprendiz');
  check(`Puzzle Forge · ${mode} campanha 3 etapas`, sim.state.stage===1 && sim.state.campaignStages===3 && sim.state.schemaVersion===2, `${mode}: 3 desafios encadeados.`);
}
const legacyPuzzle = new puzzle.PuzzleForgeSimulation('caminho','aprendiz');
const legacyPuzzleState = {...legacyPuzzle.state, schemaVersion:1}; delete legacyPuzzleState.campaignStages;
legacyPuzzle.restore(legacyPuzzleState);
check('Puzzle Forge · migração schema 1→2', legacyPuzzle.state.schemaVersion===2 && legacyPuzzle.state.campaignStages===1, 'Save antigo permanece como desafio único, sem inventar progresso adicional.');

const starPuzzle = new puzzle.PuzzleForgeSimulation('caminho','aprendiz');
const starState = starPuzzle.state;
const almostSolved = [...starState.target];
almostSolved[0] = (almostSolved[0] + 3) % 4;
starPuzzle.restore({...starState,status:'playing',stage:3,campaignStages:3,board:almostSolved,moves:12,mistakes:0,elapsedMs:12000});
starPuzzle.select(0);
check('Puzzle Forge · avaliação final por estrelas', starPuzzle.state.status==='won' && starPuzzle.state.stars===3 && /3\/3 estrelas/.test(starPuzzle.state.message), 'Conclusão eficiente da terceira etapa recebe três estrelas.');

// Raster Rally: cinco pistas e progressão de campeonato.
const tracks = req('games/raster-rally/tracks/raster-rally-tracks');
const {RasterRallySimulation}=req('games/raster-rally/simulation/raster-rally-simulation');
check('Raster Rally · cinco pistas', tracks.RASTER_RALLY_TRACKS.length===5, `${tracks.RASTER_RALLY_TRACKS.length} pistas no campeonato.`, tracks.RASTER_RALLY_TRACKS.map(t=>({id:t.id,laps:t.laps,segments:t.segments.length})));
check('Raster Rally · pistas finais 3 voltas', tracks.RASTER_RALLY_TRACKS.slice(-2).every(t=>t.laps===3), 'Metro Neon e Passo do Eclipse possuem três voltas.');
for (const track of tracks.RASTER_RALLY_TRACKS) {
  check(`Raster Rally · ${track.id} estruturada`, track.segments.length>=90 && track.timeLimitMs>90000 && track.segments.every(s=>Number.isFinite(s.curve)&&Number.isFinite(s.elevation)&&s.width>0), `${track.title}: ${track.segments.length} segmentos.`);
}
const rally = new RasterRallySimulation('novato');
let rs=rally.state;
for (let i=0;i<tracks.RASTER_RALLY_TRACKS.length-1;i++) {
  const tr=tracks.RASTER_RALLY_TRACKS[i];
  rally.restore({...rally.state,status:'playing',trackIndex:i,progress:tracks.trackLength(tr)*tr.laps-1,speed:250,remainingMs:99999,damage:0,throttle:true});
  rally.step(100);
}
check('Raster Rally · progressão até quinta pista', rally.state.trackIndex===4, `Chegou à pista ${rally.state.trackIndex+1}/5.`);

// State Quest: cinco mapas, cinco missões, migração e cadeia nova.
const world=req('games/state-quest-rpg/data/state-quest-world');
const {StateQuestSimulation}=req('games/state-quest-rpg/simulation/state-quest-simulation');
const mapIds=Object.keys(world.STATE_QUEST_MAPS);
check('State Quest · cinco mapas', mapIds.length===5 && ['village','wilds','archive','relay','core'].every(id=>mapIds.includes(id)), `${mapIds.length} mapas conectados.`, mapIds);
for (const [id,map] of Object.entries(world.STATE_QUEST_MAPS)) {
  check(`State Quest · mapa ${id} 18×12`, map.tiles.length===12 && map.tiles.every(row=>row.length===18), `${map.title}: grade válida.`);
  check(`State Quest · início ${id} caminhável`, world.isStateQuestWalkable(map,map.start.column,map.start.row), `${map.title}: spawn acessível.`);
}
const stateSim=new StateQuestSimulation('viajante');
check('State Quest · cinco missões', Object.keys(stateSim.state.quests).length===5 && ['archive-recovery','relay-sync'].every(q=>q in stateSim.state.quests), 'Fonte, sinal, arquivo, torre e núcleo registrados.');
const legacyState={...stateSim.state,schemaVersion:1,mapId:'core',quests:{'light-source':'completed','lost-signal':'completed','core-choice':'available'},flags:['signal-restored','facility-pass']};
stateSim.restore(legacyState);
check('State Quest · migração save antigo no Núcleo', stateSim.state.schemaVersion===2 && stateSim.state.quests['archive-recovery']==='completed' && stateSim.state.quests['relay-sync']==='completed', 'Save antigo no Núcleo migra sem bloquear o final.');
const freshState=new StateQuestSimulation('viajante');
check('State Quest · nova campanha inicia bloqueada', freshState.state.quests['archive-recovery']==='locked' && freshState.state.quests['relay-sync']==='locked' && freshState.state.quests['core-choice']==='locked', 'Novas missões respeitam ordem narrativa.');

const cacheState = freshState.state;
freshState.restore({...cacheState,status:'playing',mapId:'archive',player:{...cacheState.player,column:15,row:9,facing:'up',queuedDirection:'none'},inventory:{...cacheState.inventory,memoryCache:0},collectedEntities:[]});
const cacheEvents=freshState.interact();
check('State Quest · Cache de Memória opcional', freshState.state.inventory.memoryCache===1 && cacheEvents.includes('item-collected') && freshState.state.quests['core-choice']==='locked', 'Objetivo secundário concede bônus sem liberar nem bloquear a campanha principal.');

// Raycast: 3 mapas, requisitos dinâmicos, save schema 2.
const ray=req('games/raycast-corridors/simulation/raycast-corridors-simulation');
check('Raycast · três operações', ray.RAYCAST_MISSIONS.length===3, `${ray.RAYCAST_MISSIONS.length} operações registradas.`, ray.RAYCAST_MISSIONS.map(m=>({id:m.id,keys:m.keysRequired,terminals:m.terminalsRequired})));
for (const [index,mission] of ray.RAYCAST_MISSIONS.entries()) {
  const valid = mission.map.length===18 && mission.map.every(row=>row.length===24);
  check(`Raycast · mapa ${index+1} 24×18`, valid, `${mission.title}: dimensões uniformes.`);
  const chars=mission.map.join('');
  check(`Raycast · objetivos ${index+1}`, (chars.match(/K/g)||[]).length>=mission.keysRequired && (chars.match(/T/g)||[]).length>=mission.terminalsRequired && chars.includes('E'), `K/T/E suficientes para ${mission.title}.`);
}
const raySim=new ray.RaycastCorridorsSimulation('explorador');
check('Raycast · schema 2 e operação inicial', raySim.state.schemaVersion===2 && raySim.state.mapIndex===0, 'Campanha começa na operação 1.');
const legacyRay={...raySim.state,schemaVersion:1}; delete legacyRay.mapIndex;
raySim.restore(legacyRay);
check('Raycast · migração schema 1→2', raySim.state.schemaVersion===2 && raySim.state.mapIndex===0, 'Save antigo migra para a primeira operação.');
// Força saída de cada operação com objetivos preenchidos; step processa o tile E.
const exitOf=(mission)=>{ for(let r=0;r<mission.map.length;r++){ const c=mission.map[r].indexOf('E'); if(c>=0)return {x:c+0.5,y:r+0.5}; } throw new Error('sem E'); };
for(let i=0;i<ray.RAYCAST_MISSIONS.length;i++){
  const mission=ray.RAYCAST_MISSIONS[i]; const e=exitOf(mission);
  const terminals=[]; const keys=[];
  for(let r=0;r<mission.map.length;r++) for(let c=0;c<mission.map[r].length;c++) { const ch=mission.map[r][c]; if(ch==='T')terminals.push(`${c},${r}`); if(ch==='K')keys.push(`${c},${r}`); }
  raySim.restore({...raySim.state,status:'playing',mapIndex:i,player:{x:e.x,y:e.y,angle:0},checkpoint:{x:e.x,y:e.y,angle:0},keys:keys.slice(0,mission.keysRequired),activeTerminals:terminals.slice(0,mission.terminalsRequired),openedDoors:[],remainingMs:99999,damageCooldownMs:99999});
  raySim.step(1);
}
check('Raycast · campanha chega à vitória', raySim.state.status==='won' && raySim.state.mapIndex===2, 'As três operações encadeiam até a extração final.', {status:raySim.state.status,mapIndex:raySim.state.mapIndex,score:raySim.state.score});

const profiles=JSON.parse(fs.readFileSync(path.join(root,'game-profiles.json'),'utf8'));
const learning=JSON.parse(fs.readFileSync(path.join(root,'education','game-learning.json'),'utf8'));
check('Conteúdo · Puzzle sincronizado', /três desafios/i.test(profiles['puzzle-forge'].tutorialTitle) && /^12 /.test(learning['puzzle-forge'].stageLabel), 'Perfil declara 12 desafios.');
check('Conteúdo · Rally sincronizado', /cinco pistas/i.test(profiles['raster-rally'].tutorialTitle) && /^5 /.test(learning['raster-rally'].stageLabel), 'Perfil declara cinco pistas.');
check('Conteúdo · State Quest sincronizado', /cinco missões/i.test(profiles['state-quest-rpg'].tutorialTitle) && /^5 mapas/.test(learning['state-quest-rpg'].stageLabel), 'Perfil declara cinco mapas e missões.');
check('Conteúdo · Raycast sincronizado', /três operações/i.test(profiles['raycast-corridors'].tutorialTitle) && /^3 operações/.test(learning['raycast-corridors'].stageLabel), 'Perfil declara três operações.');

check('Conteúdo · Rally sem referência a três pistas', /cinco pistas/i.test(profiles['raster-rally'].history.paragraphs.join(' ')) && /quinta pista/i.test(profiles['raster-rally'].pseudocode), 'História e pseudocódigo refletem as cinco pistas.');
check('Conteúdo · State Quest sem referências 3→5 antigas', profiles['state-quest-rpg'].concepts.includes('Cinco mapas por tilemap') && profiles['state-quest-rpg'].comparison.some(row=>/Cinco missões encadeadas/.test(row[2])), 'Ficha técnica reflete cinco mapas e cinco missões.');
check('Resultado · Rally usa cinco pistas', /pista \$\{event\.detail\?\.track \?\? 1\}\/5/.test(source), 'Tela de resultado usa pista x/5.');
check('Resultado · State e Raycast usam metas atuais', source.includes('/5 missões') && source.includes('/5 mapas') && source.includes('operationTotal') && source.includes('keysRequired') && source.includes('terminalsRequired'), 'Resultados não fixam os números antigos de campanha.');

const summary={passed:checks.filter(x=>x.status==='pass').length,failed:checks.filter(x=>x.status==='fail').length,total:checks.length};
const result={product:'Fliperama DS',version:'0.36.1',phase:'Fase 7.17B — Expansão real das fases · Bloco 2/3',generatedAt:new Date().toISOString(),summary,checks};
fs.writeFileSync(path.join(__dirname,'progression-expansion-results-v0.36.1.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(summary,null,2)); if(summary.failed) process.exitCode=1;

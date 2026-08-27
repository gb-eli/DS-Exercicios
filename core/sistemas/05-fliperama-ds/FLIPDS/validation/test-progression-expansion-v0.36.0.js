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
const context = {
  console,
  globalThis: null,
  window: { matchMedia: () => ({ matches: false }), devicePixelRatio: 1 },
  navigator: {}, document: {}, setTimeout, clearTimeout,
  performance: { now: () => Date.now() },
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'app.js', timeout: 20_000 });
const req = context.__fliperamaRequire;

const checks = [];
const check = (name, ok, detail, data) => checks.push({ name, status: ok ? 'pass' : 'fail', detail, ...(data ? { data } : {}) });

// Trap Lab: 6 fases estruturais e regressão física em todos os modos.
const trapLevels = req('games/trap-lab/levels/trap-lab-levels');
check('Trap Lab · seis fases', trapLevels.TRAP_LEVELS.length === 6, `${trapLevels.TRAP_LEVELS.length} fases registradas.`);
for (const level of trapLevels.TRAP_LEVELS) {
  const joined = level.rows.join('');
  check(`Trap Lab · fase ${level.id} estruturada`, (joined.match(/S/g) || []).length === 1 && (joined.match(/E/g) || []).length === 1, `${level.title}: um início e uma saída.`);
}
const physics = JSON.parse(fs.readFileSync(path.join(__dirname, 'platform-physics-test-results.json'), 'utf8'));
for (const mode of ['explorador', 'programador', 'precisao']) {
  const item = physics.checks.find((candidate) => candidate.name === `Trap Lab · percurso ${mode}`);
  check(`Trap Lab · percurso completo ${mode}`, item?.status === 'pass' && item?.data?.length === 6 && item.data.at(-1)?.finalStatus === 'victory', `Agente físico percorreu as seis fases no modo ${mode}.`, item?.data);
}

// Labirinto de Dados: 5 mapas conectados e progressão completa.
const maze = req('games/data-maze/levels/data-maze-levels');
const { DataMazeSimulation } = req('games/data-maze/simulation/data-maze-simulation');
check('Labirinto de Dados · cinco mapas', maze.DATA_MAZE_LEVELS.length === 5, `${maze.DATA_MAZE_LEVELS.length} mapas registrados.`);
for (const level of maze.DATA_MAZE_LEVELS) {
  const analysis = maze.analyzeLevelReachability(level);
  check(`Labirinto de Dados · mapa ${level.id} conectado`, analysis.unreachable.length === 0 && analysis.unreachableCritical.length === 0, `${analysis.reachableCount}/${analysis.walkableCount} células alcançáveis.`, analysis);
}
const mazeSim = new DataMazeSimulation('aprendiz', 20260807);
mazeSim.start();
for (let expected = 1; expected <= maze.DATA_MAZE_LEVELS.length; expected += 1) {
  const state = mazeSim.state;
  mazeSim.restore({ ...state, status: 'playing', pellets: [], powerNodes: [], playerMoveTimerMs: 0, enemyMoveTimerMs: 999999, invulnerableMs: 999999 });
  mazeSim.step(16);
}
check('Labirinto de Dados · campanha completa', mazeSim.state.status === 'victory', 'Os cinco mapas avançam até a vitória.', { level: mazeSim.state.level, status: mazeSim.state.status });

// Aventura de Salas: 12 salas, migração e nova cadeia lógica.
const roomData = req('games/room-quest/levels/room-quest-levels');
const { RoomQuestSimulation } = req('games/room-quest/simulation/room-quest-simulation');
check('Aventura de Salas · doze salas', roomData.ROOM_QUEST_ROOM_IDS.length === 12, `${roomData.ROOM_QUEST_ROOM_IDS.length} salas registradas.`, roomData.ROOM_QUEST_ROOM_IDS);
const requiredExpansionRooms = ['relay-hall', 'cooling-lab', 'diagnostic-bay', 'core-chamber'];
check('Aventura de Salas · nova ala presente', requiredExpansionRooms.every((id) => roomData.ROOM_QUEST_ROOM_IDS.includes(id)), 'Relé, refrigeração, diagnóstico e câmara do núcleo estão no grafo.');

const legacyRoom = new RoomQuestSimulation('explorador');
const legacyState = legacyRoom.state;
legacyRoom.restore({ ...legacyState, schemaVersion: 1, roomEntries: { observatory: 1, gallery: 0 } });
check('Aventura de Salas · migração de save', legacyRoom.state.schemaVersion === 2 && roomData.ROOM_QUEST_ROOM_IDS.every((id) => Number.isFinite(legacyRoom.state.roomEntries[id])), 'Save schema 1 ganha as novas entradas de sala sem perder o progresso.');

const blockedGoal = new RoomQuestSimulation('explorador');
blockedGoal.start();
let bstate = blockedGoal.state;
blockedGoal.restore({ ...bstate, status: 'playing', roomId: 'observatory', player: { column: 8, row: 4, facing: 'right', queuedDirection: 'none' }, inventory: ['memory-core'], flags: [] });
const blockedEvents = blockedGoal.interact();
check('Aventura de Salas · selo obrigatório', blockedGoal.state.status === 'playing' && blockedEvents.includes('door-locked'), 'O Núcleo sozinho não conclui a campanha; o selo final é obrigatório.');

const chain = new RoomQuestSimulation('explorador');
chain.start();
let state = chain.state;
state = { ...state, status: 'playing', roomId: 'relay-hall', player: { column: 12, row: 3, facing: 'right', queuedDirection: 'none' }, inventory: ['signal-gear', 'memory-core'], flags: ['power-online'] };
chain.restore(state); chain.interact();
check('Aventura de Salas · relé sincronizado', chain.state.flags.includes('relay-synced'), 'Terminal da nova ala grava relay-synced.');
state = chain.state; chain.restore({ ...state, roomId: 'cooling-lab', player: { column: 12, row: 7, facing: 'right', queuedDirection: 'none' } }); chain.interact();
check('Aventura de Salas · refrigeração ativa', chain.state.flags.includes('cooling-online'), 'Controle térmico grava cooling-online.');
state = chain.state; chain.restore({ ...state, roomId: 'diagnostic-bay', player: { column: 12, row: 4, facing: 'right', queuedDirection: 'none' } }); chain.interact();
check('Aventura de Salas · diagnóstico aprovado', chain.state.flags.includes('diagnostics-passed'), 'Autodiagnóstico grava diagnostics-passed.');
state = chain.state; chain.restore({ ...state, roomId: 'core-chamber', player: { column: 12, row: 5, facing: 'right', queuedDirection: 'none' } }); chain.interact();
check('Aventura de Salas · selo aplicado', chain.state.flags.includes('system-sealed'), 'Câmara do Núcleo grava system-sealed.');
state = chain.state; chain.restore({ ...state, roomId: 'observatory', player: { column: 8, row: 4, facing: 'right', queuedDirection: 'none' } });
const victoryEvents = chain.interact();
check('Aventura de Salas · final expandido', chain.state.status === 'victory' && victoryEvents.includes('victory'), 'Núcleo + selo de estabilidade concluem a campanha de 12 salas.', { flags: chain.state.flags });

// Ponte 8→16: 6 zonas, 15 fragmentos, 12 exigidos e 5 checkpoints.
const bridge = req('games/bit-bridge-16/simulation/bit-bridge-simulation');
const { BitBridgeSimulation } = bridge;
check('Ponte · mundo expandido', bridge.BIT_BRIDGE_WORLD_WIDTH === 6300, `Largura do mundo: ${bridge.BIT_BRIDGE_WORLD_WIDTH}px.`);
check('Ponte · fragmentos expandidos', bridge.BIT_BRIDGE_FRAGMENTS.length === 15 && bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS === 12, `${bridge.BIT_BRIDGE_FRAGMENTS.length} fragmentos posicionados; ${bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS} necessários.`);
check('Ponte · cinco checkpoints', bridge.BIT_BRIDGE_CHECKPOINTS.length === 5, `${bridge.BIT_BRIDGE_CHECKPOINTS.length} checkpoints distribuídos pelas seis zonas.`);
const z5 = new BitBridgeSimulation('expandido'); let zs = z5.state;
z5.restore({ ...zs, status: 'playing', player: { ...zs.player, x: 4300, y: bridge.BIT_BRIDGE_GROUND_Y - zs.player.height, onGround: true }, zone: 4 }); z5.step(16);
check('Ponte · zona 5', z5.state.zone === 5, 'A posição da nova expansão registra Zona 5.');
const z6 = new BitBridgeSimulation('expandido'); zs = z6.state;
z6.restore({ ...zs, status: 'playing', player: { ...zs.player, x: 5400, y: bridge.BIT_BRIDGE_GROUND_Y - zs.player.height, onGround: true }, zone: 5 }); z6.step(16);
check('Ponte · zona 6', z6.state.zone === 6, 'A posição final da expansão registra Zona 6.');
const portal = new BitBridgeSimulation('expandido'); let ps = portal.state;
portal.restore({ ...ps, status: 'playing', fragments: bridge.BIT_BRIDGE_FRAGMENTS.slice(0, bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS).map((item) => item.id), player: { ...ps.player, x: bridge.BIT_BRIDGE_WORLD_WIDTH - 181, y: bridge.BIT_BRIDGE_GROUND_Y - ps.player.height, vx: 325, onGround: true }, moveRight: true, zone: 6 });
portal.setMoveRight(true);
for (let i = 0; i < 20 && portal.state.status === 'playing'; i += 1) portal.step(16);
check('Ponte · portal após seis zonas', portal.state.status === 'won', 'O portal final aceita a nova meta de doze fragmentos.');

// Reator de Blocos: compatibilidade de save identificada durante a regressão.
const { BlockReactorSimulation } = req('games/block-reactor/simulation/block-reactor-simulation');
const reactor = new BlockReactorSimulation('campanha-normal', 20260807);
check('Reator de Blocos · schema atual restaurável', reactor.state.schemaVersion === 2 && reactor.restore(reactor.state) === undefined && reactor.state.schemaVersion === 2, 'Um save produzido pela própria versão atual é aceito novamente.');
const reactorLegacyState = { ...reactor.state, schemaVersion: 1 };
reactor.restore(reactorLegacyState);
check('Reator de Blocos · migração schema 1→2', reactor.state.schemaVersion === 2, 'Save antigo é migrado para schema 2 sem bloquear a restauração.');

const profiles = JSON.parse(fs.readFileSync(path.join(root, 'game-profiles.json'), 'utf8'));
const learning = JSON.parse(fs.readFileSync(path.join(root, 'education', 'game-learning.json'), 'utf8'));
check('Conteúdo · Trap Lab sincronizado', /seis/i.test(profiles['trap-lab'].tutorialTitle) && /^6 /.test(learning['trap-lab'].stageLabel), 'Perfil e ficha educacional declaram seis fases.');
check('Conteúdo · Data Maze sincronizado', /cinco/i.test(profiles['data-maze'].tutorialTitle) && /^5 /.test(learning['data-maze'].stageLabel), 'Perfil e ficha educacional declaram cinco mapas.');
check('Conteúdo · Room Quest sincronizado', /doze/i.test(profiles['room-quest'].tutorialTitle) && /^12 /.test(learning['room-quest'].stageLabel), 'Perfil e ficha educacional declaram doze salas.');
check('Conteúdo · Ponte sincronizada', /seis/i.test(profiles['bit-bridge-16'].tutorialTitle) && /^6 /.test(learning['bit-bridge-16'].stageLabel), 'Perfil e ficha educacional declaram seis zonas.');

const summary = { passed: checks.filter((x) => x.status === 'pass').length, failed: checks.filter((x) => x.status === 'fail').length, total: checks.length };
const result = { product: 'Fliperama DS', version: '0.36.0', phase: 'Fase 7.17A — Expansão real das fases · Bloco 1/3', generatedAt: new Date().toISOString(), summary, checks };
fs.writeFileSync(path.join(__dirname, 'progression-expansion-results-v0.36.0.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (summary.failed) process.exitCode = 1;

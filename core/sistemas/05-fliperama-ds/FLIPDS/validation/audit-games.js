#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app.js');
const jsonPath = path.join(__dirname, 'game-audit-results.json');
const markdownPath = path.join(root, 'MATRIZ-TESTES-JOGOS-v0.39.0.md');

function loadBundle() {
  let source = fs.readFileSync(appPath, 'utf8');
  const marker = "  __require('main');\n})();";
  if (!source.includes(marker)) throw new Error('Ponto de inicialização do bundle não encontrado.');
  source = source.replace(marker, '  globalThis.__fliperamaRequire = __require;\n  globalThis.__fliperamaModules = __modules;\n})();');
  const context = {
    console,
    globalThis: null,
    window: { matchMedia: () => ({ matches: false }), devicePixelRatio: 1 },
    navigator: {},
    document: {},
    setTimeout,
    clearTimeout,
    performance: { now: () => Date.now() },
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'app.js', timeout: 20_000 });
  return { req: context.__fliperamaRequire, modules: context.__fliperamaModules };
}

const { req, modules } = loadBundle();
const gameResults = new Map();
const globalFindings = [];

function game(id, title) {
  if (!gameResults.has(id)) gameResults.set(id, { id, title, status: 'pass', checks: [] });
  return gameResults.get(id);
}

function addCheck(id, title, label, status, detail, data) {
  const item = game(id, title);
  item.checks.push({ label, status, detail, ...(data ? { data } : {}) });
  if (status === 'fail') item.status = 'fail';
  else if (status === 'warning' && item.status === 'pass') item.status = 'warning';
}

function pass(id, title, label, detail, data) { addCheck(id, title, label, 'pass', detail, data); }
function warn(id, title, label, detail, data) { addCheck(id, title, label, 'warning', detail, data); }
function fail(id, title, label, detail, data) { addCheck(id, title, label, 'fail', detail, data); }

function popcount(value) {
  let count = 0;
  for (let current = value >>> 0; current; current >>>= 1) count += current & 1;
  return count;
}

function bfsGrid(start, columns, rows, canWalk) {
  const key = (column, row) => `${column},${row}`;
  const queue = [{ ...start }];
  const visited = new Set([key(start.column, start.row)]);
  while (queue.length) {
    const current = queue.shift();
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const column = current.column + dc;
      const row = current.row + dr;
      const id = key(column, row);
      if (column < 0 || row < 0 || column >= columns || row >= rows || visited.has(id) || !canWalk(column, row)) continue;
      visited.add(id);
      queue.push({ column, row });
    }
  }
  return visited;
}

const simulations = [
  ['vector-tennis', 'Vector Tennis', 'games/vector-tennis/simulation/vector-tennis-simulation', 'VectorTennisSimulation'],
  ['space-blocks', 'Space Blocks', 'games/space-blocks/simulation/space-blocks-simulation', 'SpaceBlocksSimulation'],
  ['vector-fleet', 'Vector Fleet', 'games/vector-fleet/simulation/vector-fleet-simulation', 'VectorFleetSimulation'],
  ['block-reactor', 'Reator de Blocos', 'games/block-reactor/simulation/block-reactor-simulation', 'BlockReactorSimulation'],
  ['orbital-sentinel', 'Sentinela Orbital', 'games/orbital-sentinel/simulation/orbital-sentinel-simulation', 'OrbitalSentinelSimulation'],
  ['trap-lab', 'Trap Lab', 'games/trap-lab/simulation/trap-lab-simulation', 'TrapLabSimulation'],
  ['data-maze', 'Labirinto de Dados', 'games/data-maze/simulation/data-maze-simulation', 'DataMazeSimulation'],
  ['room-quest', 'Aventura de Salas', 'games/room-quest/simulation/room-quest-simulation', 'RoomQuestSimulation'],
  ['raster-rally', 'Raster Rally', 'games/raster-rally/simulation/raster-rally-simulation', 'RasterRallySimulation'],
  ['state-quest-rpg', 'State Quest RPG', 'games/state-quest-rpg/simulation/state-quest-simulation', 'StateQuestSimulation'],
  ['bit-bridge-16', 'Ponte 8→16 Bits', 'games/bit-bridge-16/simulation/bit-bridge-simulation', 'BitBridgeSimulation'],
  ['raycast-corridors', 'Corredores Raycast', 'games/raycast-corridors/simulation/raycast-corridors-simulation', 'RaycastCorridorsSimulation'],
  ['polygon-sector-94', 'Setor Poligonal 94', 'games/polygon-sector-94/simulation/polygon-sector-simulation', 'PolygonSectorSimulation'],
  ['camera-evolution', 'Câmeras em Evolução', 'games/camera-evolution/simulation/camera-evolution-simulation', 'CameraEvolutionSimulation'],
  ['board-arena', 'Board Arena', 'games/board-arena/simulation/board-arena-simulation', 'BoardArenaSimulation'],
  ['puzzle-forge', 'Puzzle Forge', 'games/puzzle-forge/simulation/puzzle-forge-simulation', 'PuzzleForgeSimulation'],
  ['motion-beat', 'Motion Beat DS', 'games/motion-beat/simulation/motion-beat-simulation', 'MotionBeatSimulation'],
];

for (const [id, title, moduleId, className] of simulations) {
  try {
    const Module = req(moduleId);
    const Simulation = Module[className];
    if (typeof Simulation !== 'function') throw new Error(`Classe ${className} não exportada.`);
    const simulation = new Simulation();
    const snapshot = simulation.state;
    if (typeof simulation.start === 'function') simulation.start();
    if (typeof simulation.step === 'function') simulation.step(16);
    if (snapshot && typeof simulation.restore === 'function') simulation.restore(snapshot);
    pass(id, title, 'Inicialização da simulação', 'Construtor, início, um ciclo de atualização e restauração executaram sem exceção.');
  } catch (error) {
    fail(id, title, 'Inicialização da simulação', error instanceof Error ? error.message : String(error));
  }
}

// Data Maze: conectividade, pontos críticos e progressão forçada.
try {
  const levels = req('games/data-maze/levels/data-maze-levels');
  const simulationModule = req('games/data-maze/simulation/data-maze-simulation');
  for (const level of levels.DATA_MAZE_LEVELS) {
    const analysis = levels.analyzeLevelReachability(level);
    const collectibles = levels.createCollectibles(level);
    if (analysis.unreachable.length || analysis.unreachableCritical.length) {
      fail('data-maze', 'Labirinto de Dados', `Alcançabilidade da fase ${level.id}`, `${analysis.unreachable.length} células ou pontos críticos permanecem inacessíveis.`, analysis);
    } else {
      pass('data-maze', 'Labirinto de Dados', `Alcançabilidade da fase ${level.id}`, `${analysis.reachableCount}/${analysis.walkableCount} células caminháveis acessíveis; ${collectibles.pellets.length + collectibles.powerNodes.length} coletas válidas.`, analysis);
    }
  }
  const sim = new simulationModule.DataMazeSimulation('aprendiz', 12345);
  sim.start();
  const events = [];
  for (let expectedLevel = 1; expectedLevel <= levels.DATA_MAZE_LEVELS.length; expectedLevel += 1) {
    const state = sim.state;
    sim.restore({ ...state, status: 'playing', pellets: [], powerNodes: [], playerMoveTimerMs: 0, enemyMoveTimerMs: 999999, invulnerableMs: 999999 });
    events.push(...sim.step(16));
  }
  if (sim.state.status === 'victory') pass('data-maze', 'Labirinto de Dados', 'Progressão entre mapas', `${levels.DATA_MAZE_LEVELS.length} fases avançam e a última condição gera vitória.`, { events });
  else fail('data-maze', 'Labirinto de Dados', 'Progressão entre mapas', `A progressão terminou em ${sim.state.status}.`, { events });
} catch (error) {
  fail('data-maze', 'Labirinto de Dados', 'Auditoria estrutural', error instanceof Error ? error.message : String(error));
}

// Puzzle Forge: labirinto padrão e reparo de layout impossível.
try {
  const puzzle = req('games/puzzle-forge/simulation/puzzle-forge-simulation');
  const standard = puzzle.sanitizeMaze();
  const standardAnalysis = puzzle.analyzeMaze(standard);
  const impossible = `.${'#'.repeat(47)}.`;
  const repaired = puzzle.sanitizeMaze(impossible);
  const repairedAnalysis = puzzle.analyzeMaze(repaired);
  if (standardAnalysis.solvable) pass('puzzle-forge', 'Puzzle Forge', 'Labirinto padrão', `Saída alcançável em ${standardAnalysis.pathLength} movimentos mínimos.`);
  else fail('puzzle-forge', 'Puzzle Forge', 'Labirinto padrão', 'O layout padrão não possui rota até a saída.');
  if (!puzzle.analyzeMaze(impossible).solvable && repairedAnalysis.solvable) {
    pass('puzzle-forge', 'Puzzle Forge', 'Proteção do editor', `Um layout totalmente bloqueado foi reparado com rota de ${repairedAnalysis.pathLength} movimentos.`);
  } else {
    fail('puzzle-forge', 'Puzzle Forge', 'Proteção do editor', 'O sanitizador não garantiu uma rota válida para o labirinto criado.');
  }
} catch (error) {
  fail('puzzle-forge', 'Puzzle Forge', 'Auditoria de labirinto', error instanceof Error ? error.message : String(error));
}

// Aventura de Salas: entidades, saídas e posições de chegada.
try {
  const room = req('games/room-quest/levels/room-quest-levels');
  let checked = 0;
  for (const current of Object.values(room.ROOM_QUEST_ROOMS)) {
    const visited = bfsGrid(current.start, room.ROOM_COLUMNS, room.ROOM_ROWS, (column, row) => room.isRoomWalkable(current, column, row));
    const unreachableEntities = current.entities.filter((entity) => !visited.has(`${entity.column},${entity.row}`));
    const unreachableExits = current.exits.filter((exit) => !visited.has(`${exit.column},${exit.row}`));
    const invalidTargets = current.exits.filter((exit) => {
      const target = room.ROOM_QUEST_ROOMS[exit.targetRoom];
      return !target || !room.isRoomWalkable(target, exit.targetPosition.column, exit.targetPosition.row);
    });
    checked += current.entities.length + current.exits.length;
    if (unreachableEntities.length || unreachableExits.length || invalidTargets.length) {
      fail('room-quest', 'Aventura de Salas', `Sala ${current.title}`, 'Existem entidades, saídas ou destinos inacessíveis.', {
        unreachableEntities: unreachableEntities.map((item) => item.id),
        unreachableExits: unreachableExits.map((item) => item.id),
        invalidTargets: invalidTargets.map((item) => item.id),
      });
    }
  }
  if (game('room-quest', 'Aventura de Salas').status !== 'fail') pass('room-quest', 'Aventura de Salas', `Grafo das ${room.ROOM_QUEST_ROOM_IDS.length} salas`, `${checked} entidades e transições verificadas sem bloqueio local.`);
} catch (error) {
  fail('room-quest', 'Aventura de Salas', 'Auditoria das salas', error instanceof Error ? error.message : String(error));
}

// State Quest RPG: mapas, entidades e console final.
try {
  const world = req('games/state-quest-rpg/data/state-quest-world');
  let checked = 0;
  for (const map of Object.values(world.STATE_QUEST_MAPS)) {
    const visited = bfsGrid(map.start, world.STATE_QUEST_COLUMNS, world.STATE_QUEST_ROWS, (column, row) => world.isStateQuestWalkable(map, column, row));
    const unreachableEntities = map.entities.filter((entity) => !visited.has(`${entity.column},${entity.row}`));
    const unreachableExits = map.exits.filter((exit) => !visited.has(`${exit.column},${exit.row}`));
    const invalidTargets = map.exits.filter((exit) => {
      const target = world.STATE_QUEST_MAPS[exit.targetMap];
      return !target || !world.isStateQuestWalkable(target, exit.target.column, exit.target.row);
    });
    checked += map.entities.length + map.exits.length;
    if (unreachableEntities.length || unreachableExits.length || invalidTargets.length) {
      fail('state-quest-rpg', 'State Quest RPG', `Mapa ${map.title}`, 'Existem objetivos ou transições inacessíveis.', {
        unreachableEntities: unreachableEntities.map((item) => item.id),
        unreachableExits: unreachableExits.map((item) => item.id),
        invalidTargets: invalidTargets.map((item) => item.id),
      });
    }
  }
  if (game('state-quest-rpg', 'State Quest RPG').status !== 'fail') pass('state-quest-rpg', 'State Quest RPG', 'Objetivos e transições', `${checked} entidades e saídas acessíveis, incluindo o Console do Núcleo.`);
} catch (error) {
  fail('state-quest-rpg', 'State Quest RPG', 'Auditoria do mundo', error instanceof Error ? error.message : String(error));
}

// Corredores Raycast: busca com chaves, portas, terminais e extração.
try {
  const ray = req('games/raycast-corridors/simulation/raycast-corridors-simulation');
  const locations = { keys: [], doors: [], terminals: [], start: null, exit: null };
  for (let row = 0; row < ray.RAYCAST_ROWS; row += 1) {
    for (let column = 0; column < ray.RAYCAST_COLUMNS; column += 1) {
      const tile = ray.tileAt(column, row);
      if (tile === 'K') locations.keys.push([column, row]);
      if (tile === 'D') locations.doors.push([column, row]);
      if (tile === 'T') locations.terminals.push([column, row]);
      if (tile === 'S') locations.start = [column, row];
      if (tile === 'E') locations.exit = [column, row];
    }
  }
  const keyIndex = new Map(locations.keys.map((point, index) => [point.join(','), index]));
  const doorIndex = new Map(locations.doors.map((point, index) => [point.join(','), index]));
  const terminalIndex = new Map(locations.terminals.map((point, index) => [point.join(','), index]));
  const start = { column: locations.start[0], row: locations.start[1], keys: 0, doors: 0, terminals: 0, distance: 0 };
  const queue = [start];
  const visited = new Set();
  let solution;
  const stateKey = (state) => `${state.column},${state.row}|${state.keys}|${state.doors}|${state.terminals}`;
  while (queue.length) {
    const current = queue.shift();
    const currentKey = stateKey(current);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    let keys = current.keys;
    const positionKey = `${current.column},${current.row}`;
    if (keyIndex.has(positionKey)) keys |= 1 << keyIndex.get(positionKey);
    if (ray.tileAt(current.column, current.row) === 'E' && popcount(current.terminals) >= ray.RAYCAST_TERMINALS_REQUIRED) {
      solution = { ...current, keys };
      break;
    }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const column = current.column + dc;
      const row = current.row + dr;
      const tile = ray.tileAt(column, row);
      if (tile === '#') continue;
      if (tile === 'D') {
        const index = doorIndex.get(`${column},${row}`);
        if (!(current.doors & (1 << index))) continue;
      }
      queue.push({ ...current, column, row, keys, distance: current.distance + 1 });
    }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const column = current.column + dc;
      const row = current.row + dr;
      const targetKey = `${column},${row}`;
      const tile = ray.tileAt(column, row);
      if (tile === 'T') {
        const index = terminalIndex.get(targetKey);
        queue.push({ ...current, keys, terminals: current.terminals | (1 << index), distance: current.distance + 1 });
      }
      if (tile === 'D') {
        const index = doorIndex.get(targetKey);
        if (!(current.doors & (1 << index)) && popcount(keys) - popcount(current.doors) > 0) {
          queue.push({ ...current, keys, doors: current.doors | (1 << index), distance: current.distance + 1 });
        }
      }
    }
  }
  if (solution) {
    pass('raycast-corridors', 'Corredores Raycast', 'Missão completa por busca de estados', `Rota encontrada com ${popcount(solution.keys)} chaves e ${popcount(solution.terminals)} terminais; ${visited.size} estados analisados.`, { locations, visitedStates: visited.size });
  } else {
    fail('raycast-corridors', 'Corredores Raycast', 'Missão completa por busca de estados', 'Nenhuma sequência válida de coleta, abertura de portas, terminais e saída foi encontrada.', { locations, visitedStates: visited.size });
  }
} catch (error) {
  fail('raycast-corridors', 'Corredores Raycast', 'Auditoria da missão', error instanceof Error ? error.message : String(error));
}


const physicsPath = path.join(__dirname, 'platform-physics-test-results.json');
const physics = fs.existsSync(physicsPath) ? JSON.parse(fs.readFileSync(physicsPath, 'utf8')) : { checks: [] };
function addPhysicsChecks(prefix, id, title) {
  for (const item of physics.checks.filter((check) => check.name.startsWith(prefix))) {
    if (item.status === 'pass') pass(id, title, item.name.replace(`${prefix} · `, ''), item.detail, item.data);
    else fail(id, title, item.name.replace(`${prefix} · `, ''), item.detail, item.data);
  }
}

// Trap Lab: estrutura das fases e checkpoint sem repetição.
try {
  const levels = req('games/trap-lab/levels/trap-lab-levels');
  const simulationModule = req('games/trap-lab/simulation/trap-lab-simulation');
  for (const level of levels.TRAP_LEVELS) {
    const starts = level.rows.join('').split('').filter((tile) => tile === 'S').length;
    const exits = level.rows.join('').split('').filter((tile) => tile === 'E').length;
    if (starts === 1 && exits === 1) pass('trap-lab', 'Trap Lab', `Estrutura da fase ${level.id}`, 'Um início e uma saída foram encontrados.');
    else fail('trap-lab', 'Trap Lab', `Estrutura da fase ${level.id}`, `Foram encontrados ${starts} inícios e ${exits} finais.`);
  }
  const sim = new simulationModule.TrapLabSimulation('explorador');
  sim.start();
  const snapshot = sim.state;
  sim.restore({ ...snapshot, status: 'playing', player: { x: 21.5, y: 12.04, vx: 0, vy: 0, grounded: false } });
  let checkpointEvents = 0;
  for (let index = 0; index < 40; index += 1) checkpointEvents += sim.step(16).filter((event) => event === 'checkpoint').length;
  if (checkpointEvents === 1) pass('trap-lab', 'Trap Lab', 'Registro de checkpoint', 'O checkpoint emite um único evento ao ser alcançado.');
  else fail('trap-lab', 'Trap Lab', 'Registro de checkpoint', `Foram emitidos ${checkpointEvents} eventos para o mesmo checkpoint.`);
  addPhysicsChecks('Trap Lab', 'trap-lab', 'Trap Lab');
} catch (error) {
  fail('trap-lab', 'Trap Lab', 'Auditoria de plataforma', error instanceof Error ? error.message : String(error));
}

// Ponte 8→16 Bits: consistência dos objetos e objetivo final.
try {
  const bridge = req('games/bit-bridge-16/simulation/bit-bridge-simulation');
  const ids = new Set(bridge.BIT_BRIDGE_FRAGMENTS.map((fragment) => fragment.id));
  const insideWorld = bridge.BIT_BRIDGE_FRAGMENTS.every((fragment) => fragment.x >= 0 && fragment.x <= bridge.BIT_BRIDGE_WORLD_WIDTH && fragment.y >= 0 && fragment.y <= bridge.BIT_BRIDGE_GROUND_Y);
  if (ids.size === bridge.BIT_BRIDGE_FRAGMENTS.length && bridge.BIT_BRIDGE_FRAGMENTS.length >= bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS && insideWorld) {
    pass('bit-bridge-16', 'Ponte 8→16 Bits', 'Fragmentos e portal', `${bridge.BIT_BRIDGE_FRAGMENTS.length} fragmentos únicos posicionados dentro do mundo; ${bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS} exigidos.`);
  } else {
    fail('bit-bridge-16', 'Ponte 8→16 Bits', 'Fragmentos e portal', 'A quantidade, os IDs ou as posições dos fragmentos estão inconsistentes.');
  }
  addPhysicsChecks('Ponte', 'bit-bridge-16', 'Ponte 8→16 Bits');
} catch (error) {
  fail('bit-bridge-16', 'Ponte 8→16 Bits', 'Auditoria estrutural', error instanceof Error ? error.message : String(error));
}

// Arenas 3D: geometria, percurso, câmera e objetivos educativos.
const threeDPath = path.join(__dirname, 'three-d-test-results.json');
const threeD = fs.existsSync(threeDPath) ? JSON.parse(fs.readFileSync(threeDPath, 'utf8')) : { checks: [] };
for (const [id, title, moduleId] of [
  ['polygon-sector-94', 'Setor Poligonal 94', 'games/polygon-sector-94/simulation/polygon-sector-simulation'],
  ['camera-evolution', 'Câmeras em Evolução', 'games/camera-evolution/simulation/camera-evolution-simulation'],
]) {
  try {
    const arena = req(moduleId);
    const points = [...arena.POLYGON_CORES, ...arena.POLYGON_CHECKPOINTS, arena.POLYGON_EXIT];
    const blocked = points.filter((point) => arena.collides(point.x, point.z, point.y));
    if (!blocked.length) pass(id, title, 'Objetivos da arena 3D', `${points.length} núcleos/lentes, checkpoints e portal posicionados fora dos colisores.`);
    else fail(id, title, 'Objetivos da arena 3D', `${blocked.length} objetivos estão dentro de colisores.`, { blocked });
    const dedicated = threeD.checks.filter((item) => item.name.startsWith(`${title} · `));
    if (!dedicated.length) fail(id, title, 'Testes 3D dedicados', 'O arquivo de testes 3D não foi gerado.');
    for (const item of dedicated) {
      const label = item.name.replace(`${title} · `, '');
      if (item.status === 'pass') pass(id, title, label, item.detail, item.data);
      else fail(id, title, label, item.detail, item.data);
    }
  } catch (error) {
    fail(id, title, 'Auditoria da arena 3D', error instanceof Error ? error.message : String(error));
  }
}


// Board Arena: tempo de análise, dificuldades, minimax e capturas encadeadas.
try {
  const boardModule = req('games/board-arena/simulation/board-arena-simulation');
  const BoardArenaSimulation = boardModule.BoardArenaSimulation;
  const finishCpu = (simulation) => {
    let events = [];
    for (let index = 0; index < 100 && simulation.state.cpuThinking; index += 1) {
      const current = simulation.step(100);
      if (current.length) events = current;
    }
    return events;
  };
  for (const difficulty of ['iniciante', 'normal', 'estrategista', 'mestre']) {
    const tic = new BoardArenaSimulation('velha', difficulty);
    tic.start();
    const playerEvents = tic.select(0);
    const queued = tic.state.cpuThinking && tic.state.turn === 'cpu' && playerEvents.includes('cpu-thinking');
    const before = tic.state.board.filter((cell) => cell === 'O').length;
    tic.step(100);
    const delayed = tic.state.board.filter((cell) => cell === 'O').length === before;
    const cpuEvents = finishCpu(tic);
    const answered = tic.state.board.filter((cell) => cell === 'O').length === 1 && (cpuEvents.includes('cpu-move') || cpuEvents.includes('finished'));
    if (queued && delayed && answered) pass('board-arena', 'Board Arena', `Jogo da Velha · ${difficulty}`, 'Turno da CPU separado, atraso visual e resposta concluída.');
    else fail('board-arena', 'Board Arena', `Jogo da Velha · ${difficulty}`, 'A CPU respondeu instantaneamente, não entrou em análise ou não concluiu sua jogada.');
  }

  let masterLosses = 0;
  for (let gameIndex = 0; gameIndex < 100; gameIndex += 1) {
    const tic = new BoardArenaSimulation('velha', 'mestre');
    tic.start();
    let guard = 0;
    while (tic.state.status === 'playing' && guard++ < 20) {
      if (tic.state.turn === 'player') {
        const empty = tic.state.board.map((cell, index) => cell === '.' ? index : -1).filter((index) => index >= 0);
        tic.select(empty[Math.floor(Math.random() * empty.length)]);
      }
      finishCpu(tic);
    }
    if (tic.state.status === 'player-won') masterLosses += 1;
  }
  if (masterLosses === 0) pass('board-arena', 'Board Arena', 'Minimax Mestre', 'A CPU Mestre não perdeu em 100 partidas contra jogadas aleatórias.');
  else fail('board-arena', 'Board Arena', 'Minimax Mestre', `A CPU Mestre perdeu ${masterLosses} partidas aleatórias.`);

  const beginnerMoves = new Set();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const tic = new BoardArenaSimulation('velha', 'iniciante');
    tic.start();
    tic.select(4);
    finishCpu(tic);
    beginnerMoves.add(tic.state.lastMoveTo);
  }
  if (beginnerMoves.size >= 2) pass('board-arena', 'Board Arena', 'Aleatoriedade controlada', `${beginnerMoves.size} respostas diferentes observadas no nível Iniciante.`);
  else fail('board-arena', 'Board Arena', 'Aleatoriedade controlada', 'A CPU Iniciante permaneceu determinística em todas as tentativas.');

  for (const difficulty of ['iniciante', 'normal', 'estrategista', 'mestre']) {
    const checkers = new BoardArenaSimulation('dama', difficulty);
    checkers.start();
    let selected = false;
    for (let index = 0; index < 64 && !selected; index += 1) {
      checkers.select(index);
      selected = checkers.state.selectedIndex !== null;
    }
    const targets = checkers.state.legalTargets.length;
    if (selected && targets > 0) {
      checkers.select(checkers.state.legalTargets[0]);
      const queued = checkers.state.cpuThinking;
      const before = checkers.state.board.join('');
      checkers.step(100);
      const delayed = checkers.state.board.join('') === before;
      finishCpu(checkers);
      const returned = checkers.state.turn === 'player' || checkers.state.status !== 'playing';
      if (queued && delayed && returned) pass('board-arena', 'Board Arena', `Dama · ${difficulty}`, 'Destinos legais, tempo de análise e retorno de turno validados.');
      else fail('board-arena', 'Board Arena', `Dama · ${difficulty}`, 'Falha na seleção, atraso ou retorno de turno da CPU.');
    } else fail('board-arena', 'Board Arena', `Dama · ${difficulty}`, 'Nenhuma peça inicial com destino legal foi encontrada.');
  }

  const chain = new BoardArenaSimulation('dama', 'normal');
  const chainBoard = Array(64).fill('.');
  chainBoard[42] = 'r'; chainBoard[33] = 'b'; chainBoard[17] = 'b'; chainBoard[1] = 'b';
  chain.restore({ ...BoardArenaSimulation.initialState('dama', 'normal'), status: 'playing', board: chainBoard, rngSeed: 123 });
  chain.select(42);
  chain.select(24);
  const firstChain = chain.state.forcedFrom === 24 && chain.state.legalTargets.includes(10);
  chain.select(10);
  if (firstChain && chain.state.playerCaptures === 2) pass('board-arena', 'Board Arena', 'Captura encadeada', 'Duas capturas consecutivas foram exigidas e contabilizadas com a mesma peça.');
  else fail('board-arena', 'Board Arena', 'Captura encadeada', 'A sequência obrigatória de capturas não foi mantida.');

  const legacy = new BoardArenaSimulation();
  const legacyBoard = Array(9).fill('.'); legacyBoard[0] = 'X';
  legacy.restore({ schemaVersion: 1, mode: 'velha', difficulty: 'aprendiz', board: legacyBoard, turn: 'player', status: 'playing', selectedIndex: null, moveCount: 1, playerCaptures: 0, cpuCaptures: 0, elapsedMs: 50, score: 0, message: 'Save antigo' });
  if (legacy.state.schemaVersion === 3 && legacy.state.difficulty === 'iniciante' && legacy.state.opponent === 'cpu') pass('board-arena', 'Board Arena', 'Migração de save antigo', 'Save schema 1 / Aprendiz convertido para schema 3 / Iniciante com adversário CPU.');
  else fail('board-arena', 'Board Arena', 'Migração de save antigo', 'O save anterior não foi migrado corretamente.');
} catch (error) {
  fail('board-arena', 'Board Arena', 'Auditoria da IA e turnos', error instanceof Error ? error.message : String(error));
}

// VoxelCraft: integração, persistência e mecanismos de recuperação.
try {
  const voxelResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'voxelcraft-test-results.json'), 'utf8'));
  for (const item of voxelResult.checks) {
    if (item.status === 'pass') pass('voxelcraft-ds', 'VoxelCraft DS', item.label, item.detail);
    else fail('voxelcraft-ds', 'VoxelCraft DS', item.label, item.detail);
  }
} catch (error) {
  fail('voxelcraft-ds', 'VoxelCraft DS', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}

// Duo Elementos: campanha, multiplayer local e integração isolada.
try {
  const duoResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'duo-elementos-test-results-v0.37.0.json'), 'utf8'));
  for (const item of duoResult.checks) {
    if (item.status === 'pass') pass('duo-elementos-ds', 'Duo Elementos DS', item.label, item.detail || 'OK');
    else fail('duo-elementos-ds', 'Duo Elementos DS', item.label, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('duo-elementos-ds', 'Duo Elementos DS', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}


// Plataforma Clássica DS: incorpora a suíte dedicada do runtime isolado.
try {
  const platformResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'plataforma-classica-results-v0.37.1.json'), 'utf8'));
  for (const item of platformResult.items ?? []) {
    if (item.passed) pass('plataforma-classica-ds', 'Plataforma Clássica DS', item.name, item.detail || 'OK');
    else fail('plataforma-classica-ds', 'Plataforma Clássica DS', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('plataforma-classica-ds', 'Plataforma Clássica DS', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}


// Mundo Plataforma DS 360: região radial, câmera 360 e integração isolada.
try {
  const world360Result = JSON.parse(fs.readFileSync(path.join(__dirname, 'mundo-plataforma-360-results-v0.38.5.json'), 'utf8'));
  for (const item of world360Result.items ?? []) {
    if (item.passed) pass('mundo-plataforma-ds-360', 'Mundo Plataforma DS 360', item.name, item.detail || 'OK');
    else fail('mundo-plataforma-ds-360', 'Mundo Plataforma DS 360', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('mundo-plataforma-ds-360', 'Mundo Plataforma DS 360', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}


// Chess Arena 360: regras completas, CPU e integração isolada.
try {
  const chessResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'chess-arena-360-results-v0.39.0.json'), 'utf8'));
  for (const item of chessResult.items || []) {
    if (item.passed) pass('chess-arena-360', 'Chess Arena 360', item.name, item.detail || 'OK');
    else fail('chess-arena-360', 'Chess Arena 360', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('chess-arena-360', 'Chess Arena 360', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}

// Hexa Reactor: suíte específica do runtime isolado.
try {
  const hexaResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'hexa-reactor-results-v0.38.6.json'), 'utf8'));
  for (const item of hexaResult.items || []) {
    if (item.passed) pass('hexa-reactor', 'Hexa Reactor', item.name, item.detail || 'OK');
    else fail('hexa-reactor', 'Hexa Reactor', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('hexa-reactor', 'Hexa Reactor', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}

// Plataforma Poligonal DS 3D: campanha 3D, física e integração isolada.
try {
  const poly3dResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'plataforma-poligonal-results-v0.38.0.json'), 'utf8'));
  for (const item of poly3dResult.items ?? []) {
    if (item.passed) pass('plataforma-poligonal-ds-3d', 'Plataforma Poligonal DS 3D', item.name, item.detail || 'OK');
    else fail('plataforma-poligonal-ds-3d', 'Plataforma Poligonal DS 3D', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('plataforma-poligonal-ds-3d', 'Plataforma Poligonal DS 3D', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}

// Crystal Cascade 3D: campanha, motor match-3 e integração isolada.
try {
  const crystalResult = JSON.parse(fs.readFileSync(path.join(__dirname, 'crystal-cascade-results-v0.37.2.json'), 'utf8'));
  for (const item of crystalResult.items ?? []) {
    if (item.passed) pass('crystal-cascade-3d', 'Crystal Cascade 3D', item.name, item.detail || 'OK');
    else fail('crystal-cascade-3d', 'Crystal Cascade 3D', item.name, item.detail || 'Falha na validação.');
  }
} catch (error) {
  fail('crystal-cascade-3d', 'Crystal Cascade 3D', 'Auditoria do módulo', error instanceof Error ? error.message : String(error));
}

const games = Array.from(gameResults.values());
const counts = games.reduce((summary, item) => {
  summary[item.status] += 1;
  for (const check of item.checks) summary.checks[check.status] += 1;
  return summary;
}, { pass: 0, warning: 0, fail: 0, checks: { pass: 0, warning: 0, fail: 0 } });

const result = {
  product: 'Fliperama DS',
  version: '0.39.0',
  phase: 'Fase 7.28 — Chess Arena 360 · Estratégia 3D',
  generatedAt: new Date().toISOString(),
  moduleCount: Object.keys(modules).length,
  summary: {
    games: games.length,
    gamesPassed: counts.pass,
    gamesWithWarnings: counts.warning,
    gamesFailed: counts.fail,
    checksPassed: counts.checks.pass,
    checksWithWarnings: counts.checks.warning,
    checksFailed: counts.checks.fail,
  },
  correctedCriticalBugs: [
    'Labirinto de Dados fase 1: três coletas isoladas impediam a vitória.',
    'Puzzle Forge: o editor aceitava labirintos sem rota até a saída.',
    'State Quest RPG: o Console do Núcleo estava fechado por uma parede contínua.',
    'Corredores Raycast: a área inicial não se conectava ao restante do mapa.',
    'Trap Lab: o mesmo checkpoint podia emitir eventos repetidos continuamente.',
    'Board Arena: CPU instantânea e previsível substituída por turnos separados, quatro dificuldades e análise visual.',
    'Dama: destinos legais, captura obrigatória e capturas encadeadas implementadas.',
    'Trap Lab: terminal final reposicionado e saltos receberam coyote time e jump buffer.',
    'Ponte 8→16 Bits: plataformas, perigos, checkpoints, coleta e Zona 4 foram corrigidos.',
    'Setor Poligonal 94: plataformas altas, rampas, câmera, sensibilidade, anti-travamento e portal educativo corrigidos.',
    'Câmeras em Evolução: seis câmeras, três FOVs, colisão da câmera, arraste e progressão educativa validados.',
    'VoxelCraft DS: Three.js local, persistência em camadas, spawn seguro, chunks, câmera, controles e modo Econômico recuperados.',
  ],
  globalFindings,
  games,
};

fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);

const statusLabel = { pass: 'APROVADO', warning: 'ATENÇÃO', fail: 'FALHOU' };
const lines = [
  '# Matriz de testes dos jogos — Fliperama DS v0.37.2',
  '',
  `Gerada em: ${result.generatedAt}`,
  '',
  `- Jogos analisados: **${result.summary.games}**`,
  `- Aprovados nesta camada: **${result.summary.gamesPassed}**`,
  `- Com verificações pendentes de playtest: **${result.summary.gamesWithWarnings}**`,
  `- Com falha automatizada: **${result.summary.gamesFailed}**`,
  `- Verificações aprovadas: **${result.summary.checksPassed}**`,
  `- Alertas: **${result.summary.checksWithWarnings}**`,
  `- Falhas: **${result.summary.checksFailed}**`,
  '',
  '## Resultados por jogo',
  '',
];
for (const item of games) {
  lines.push(`### ${item.title} — ${statusLabel[item.status]}`, '');
  for (const check of item.checks) lines.push(`- **${statusLabel[check.status]} — ${check.label}:** ${check.detail}`);
  lines.push('');
}
lines.push('## Interpretação', '', 'A aprovação automatizada indica integridade da simulação, conectividade dos dados ou validade estrutural coberta pelo teste. Ela não substitui o playtest visual de controles, dificuldade, câmera, animação e experiência em dispositivos reais.', '');
fs.writeFileSync(markdownPath, `${lines.join('\n')}\n`);

console.log(JSON.stringify(result.summary, null, 2));
if (result.summary.gamesFailed || result.summary.checksFailed) process.exitCode = 1;

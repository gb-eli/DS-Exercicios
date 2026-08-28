#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app.js');
const jsonPath = path.join(__dirname, 'three-d-test-results.json');

function loadBundle() {
  let source = fs.readFileSync(appPath, 'utf8');
  const marker = "  __require('main');\n})();";
  if (!source.includes(marker)) throw new Error('Ponto de inicialização do bundle não encontrado.');
  source = source.replace(marker, '  globalThis.__fliperamaRequire = __require;\n  globalThis.__fliperamaModules = __modules;\n})();');
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
  return context.__fliperamaRequire;
}

const req = loadBundle();
const checks = [];
function check(name, condition, detail, data) {
  checks.push({ name, status: condition ? 'pass' : 'fail', detail, ...(data ? { data } : {}) });
  if (!condition) throw new Error(`${name}: ${detail}`);
}
function approx(a, b, tolerance = 0.08) { return Math.abs(a - b) <= tolerance; }

function exerciseModule(id, className, rendererId, cameraRequired, materialsRequired, fovsRequired) {
  const mod = req(id);
  const Renderer = req(rendererId);
  const Simulation = mod[className];
  const prefix = className.startsWith('Camera') ? 'Câmeras em Evolução' : 'Setor Poligonal 94';

  // Platforms must block at ground level and allow the player on their top.
  check(`${prefix} · plataforma alta bloqueia lateral`, mod.collides(0, 0, 0) && !mod.collides(0, 0, 2.7), 'A plataforma central bloqueia a entrada pelo chão, mas aceita o avatar sobre sua superfície.');
  check(`${prefix} · sem subida instantânea`, !mod.canMoveTo(0, 0, 0), 'O avatar não pode subir diretamente para 2,7 m apenas entrando no volume da plataforma.');

  // Center ramp rises gradually towards the central platform.
  const heights = [3.1, 2.75, 2.4, 2.05, 1.7, 1.35, 1.1].map((z) => mod.groundHeightAt(0, z));
  const monotonic = heights.every((value, index) => index === 0 || value >= heights[index - 1] - 0.001);
  check(`${prefix} · rampa progressiva`, monotonic && heights[0] < 0.05 && heights.at(-1) > 2.65, 'A rampa central sobe progressivamente do solo ao topo da plataforma.', { heights });


  // Grid search validates that every objective can be reached through walkable ground and ramps.
  const gridStep = 0.25;
  const gridKey = (x, z) => `${Math.round(x / gridStep)},${Math.round(z / gridStep)}`;
  const queue = [{ x: 0, z: -6.25 }];
  const visited = new Set([gridKey(0, -6.25)]);
  while (queue.length) {
    const current = queue.shift();
    const currentHeight = mod.groundHeightAt(current.x, current.z);
    for (const [dx, dz] of [[gridStep, 0], [-gridStep, 0], [0, gridStep], [0, -gridStep]]) {
      const x = +(current.x + dx).toFixed(2);
      const z = +(current.z + dz).toFixed(2);
      const key = gridKey(x, z);
      if (visited.has(key) || !mod.canMoveTo(x, z, currentHeight)) continue;
      visited.add(key);
      queue.push({ x, z });
    }
  }
  const objectives = [...mod.POLYGON_CORES, ...mod.POLYGON_CHECKPOINTS, mod.POLYGON_EXIT];
  const unreachable = objectives.filter((target) => ![...visited].some((key) => {
    const [ix, iz] = key.split(',').map(Number);
    return Math.hypot(ix * gridStep - target.x, iz * gridStep - target.z) < 0.8;
  }));
  check(`${prefix} · percurso completo`, unreachable.length === 0, 'Núcleos/lentes, checkpoints, rampa central e portal pertencem ao mesmo percurso navegável.', { visited: visited.size, unreachable: unreachable.map((item) => item.id) });

  // Coyote time.
  const coyote = new Simulation('piloto');
  coyote.start();
  const coyoteState = coyote.state;
  coyote.restore({ ...coyoteState, status: 'playing', coyoteMs: 90, player: { ...coyoteState.player, y: 0.25, verticalVelocity: -1 } });
  const coyoteEvents = coyote.jump();
  check(`${prefix} · coyote time`, coyoteEvents.includes('jump') && coyote.state.player.verticalVelocity > 6, 'O salto ainda é aceito por alguns milissegundos após deixar uma borda.');

  // Jump buffer.
  const buffered = new Simulation('piloto');
  buffered.start();
  const bufferedState = buffered.state;
  buffered.restore({ ...bufferedState, status: 'playing', player: { ...bufferedState.player, x: 4, z: 4, y: 0.18, verticalVelocity: -1.2 }, coyoteMs: 0 });
  const queued = buffered.jump().length === 0 && buffered.state.jumpBufferMs > 0;
  let bufferedJump = false;
  for (let i = 0; i < 12; i += 1) {
    if (buffered.step(16).includes('jump')) bufferedJump = true;
  }
  check(`${prefix} · jump buffer`, queued && bufferedJump && buffered.state.player.verticalVelocity > 0, 'O salto pressionado pouco antes da aterrissagem é executado automaticamente.');

  // Sensitivity must affect turning.
  const normal = new Simulation('piloto');
  normal.start();
  normal.setMovement('turn-right', true);
  normal.step(50);
  const normalDelta = normal.state.player.angle - Math.PI / 2;
  const fast = new Simulation('piloto');
  fast.start();
  fast.cycleSensitivity(); // alta
  fast.setMovement('turn-right', true);
  fast.step(50);
  const fastDelta = fast.state.player.angle - Math.PI / 2;
  check(`${prefix} · sensibilidade`, fast.state.turnSensitivity === 'alta' && fastDelta > normalDelta * 1.2, 'O nível Alto produz rotação perceptivelmente maior que o nível Médio.', { normalDelta, fastDelta });

  // Pointer-style look changes horizontal direction and vertical pitch.
  const look = new Simulation('piloto');
  look.start();
  const beforeLook = look.state;
  look.look(30, -20);
  check(`${prefix} · arraste de câmera`, look.state.player.angle !== beforeLook.player.angle && look.state.cameraPitch > beforeLook.cameraPitch, 'Arraste horizontal gira o avatar e arraste vertical altera a inclinação da câmera.');

  // Invalid positions are recovered.
  const recovery = new Simulation('piloto');
  recovery.start();
  const recoveryState = recovery.state;
  recovery.restore({ ...recoveryState, status: 'playing', player: { ...recoveryState.player, x: 99, z: 99, y: -5 } });
  recovery.step(16);
  check(`${prefix} · recuperação anti-travamento`, Math.abs(recovery.state.player.x) < 10 && Math.abs(recovery.state.player.z) < 8 && recovery.state.player.y >= 0, 'Posições inválidas retornam ao último ponto seguro.');

  // Camera collision resolver.
  const stateForCamera = { ...new Simulation('piloto').state, status: 'playing', player: { x: 0, y: 0, z: 2.0, angle: Math.PI / 2, verticalVelocity: 0 }, cameraMode: 'third-person', cameraPitch: 0 };
  const camera = Renderer.cameraForState(stateForCamera);
  check(`${prefix} · câmera fora dos obstáculos`, !mod.cameraObstructed(camera.position.x, camera.position.y, camera.position.z), 'A posição final da câmera não fica dentro de paredes, pilares ou plataformas.', { camera });

  // Save migration.
  const migration = new Simulation('piloto');
  const old = { ...migration.state, schemaVersion: 1 };
  delete old.lastSafePosition; delete old.coyoteMs; delete old.jumpBufferMs; delete old.blockedMovementMs; delete old.cameraPitch; delete old.turnSensitivity;
  if (cameraRequired === 6) delete old.visitedFovs; else { delete old.visitedCameras; delete old.visitedMaterials; }
  migration.restore(old);
  check(`${prefix} · migração de save`, migration.state.schemaVersion === 2 && migration.state.turnSensitivity === 'media' && Number.isFinite(migration.state.cameraPitch), 'Save schema 1 é convertido para schema 2 com os novos campos físicos e de câmera.');

  // Educational gate requirements and final completion.
  const locked = new Simulation('piloto');
  locked.start();
  const lockedState = locked.state;
  locked.restore({ ...lockedState, status: 'playing', collectedCores: mod.POLYGON_CORES.map((item) => item.id) });
  check(`${prefix} · portal exige aprendizagem`, !mod.isPortalUnlocked(locked.state), 'Coletar os itens sem experimentar câmeras/material/FOV não libera o portal.');

  const gate = new Simulation('piloto');
  gate.start();
  while (gate.state.visitedCameras.length < cameraRequired) gate.toggleCamera();
  if (materialsRequired) while (gate.state.visitedMaterials.length < materialsRequired) gate.toggleMaterial();
  if (fovsRequired) while (gate.state.visitedFovs.length < fovsRequired) gate.toggleFov();
  const prepared = gate.state;
  gate.restore({ ...prepared, status: 'playing', collectedCores: mod.POLYGON_CORES.map((item) => item.id), player: { ...prepared.player, x: mod.POLYGON_EXIT.x, y: 0, z: mod.POLYGON_EXIT.z, verticalVelocity: 0 } });
  const finishEvents = gate.step(16);
  check(`${prefix} · portal educativo`, mod.isPortalUnlocked(gate.state) && gate.state.status === 'won' && finishEvents.includes('finished'), 'O portal é concluível depois de cumprir as coletas e comparações educativas.');
}

exerciseModule(
  'games/polygon-sector-94/simulation/polygon-sector-simulation',
  'PolygonSectorSimulation',
  'games/polygon-sector-94/webgl/polygon-sector-renderer',
  2, 3, 0,
);
exerciseModule(
  'games/camera-evolution/simulation/camera-evolution-simulation',
  'CameraEvolutionSimulation',
  'games/camera-evolution/webgl/camera-evolution-renderer',
  6, 0, 3,
);

const result = {
  product: 'Fliperama DS', version: '0.30.0', phase: 'Fase 7.11 — Experiências 3D e câmeras seguras',
  generatedAt: new Date().toISOString(),
  summary: { total: checks.length, passed: checks.filter((item) => item.status === 'pass').length, failed: checks.filter((item) => item.status === 'fail').length },
  checks,
};
fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result.summary, null, 2));

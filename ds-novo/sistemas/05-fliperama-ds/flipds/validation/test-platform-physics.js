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
const checks = [];
const check = (name, ok, detail, data) => checks.push({ name, status: ok ? 'pass' : 'fail', detail, ...(data ? { data } : {}) });

const levels = req('games/trap-lab/levels/trap-lab-levels');
const { TrapLabSimulation } = req('games/trap-lab/simulation/trap-lab-simulation');

function runTrapLevel(levelNumber, mode) {
  const sim = new TrapLabSimulation(mode, ['aguardar', 'desativar', 'abrir']);
  const level = levels.TRAP_LEVELS[levelNumber - 1];
  const start = levels.findTile(level, 'S');
  const base = sim.state;
  sim.restore({ ...base, status: 'playing', level: levelNumber, player: { x: start.x, y: start.y - 0.46, vx: 0, vy: 0, grounded: false }, checkpoint: { x: start.x, y: start.y - 0.46 }, gateOpen: false, trapDisabled: true, sequenceSolved: false, trapTimerMs: 0, coyoteMs: 0, jumpBufferMs: 0 });
  sim.setMoveDirection(1);
  let jumps = 0;
  let interactions = 0;
  for (let frame = 0; frame < 5000; frame += 1) {
    const state = sim.state;
    if (state.status !== 'playing' || state.level !== levelNumber) return { completed: true, frames: frame, jumps, interactions, finalStatus: state.status, nextLevel: state.level };
    if (!state.gateOpen) {
      const terminal = levels.findTile(level, 'T');
      if (terminal && Math.hypot(terminal.x - state.player.x, terminal.y - state.player.y) <= 1.45) {
        const events = sim.interact();
        if (events.includes('sequence-solved')) interactions += 1;
      }
    }
    if (state.player.grounded) {
      let shouldJump = false;
      for (const distance of [0.7, 1.2, 1.8, 2.4]) {
        const column = Math.floor(state.player.x + distance);
        const bodyTile = levels.tileAt(level, column, Math.floor(state.player.y));
        const footTile = levels.tileAt(level, column, Math.floor(state.player.y + 0.6));
        if (footTile === '.' || footTile === '^' || bodyTile === '#' || bodyTile === 'G') shouldJump = true;
      }
      if (shouldJump && sim.jump().includes('jump')) jumps += 1;
    }
    sim.step(16.67);
  }
  return { completed: false, jumps, interactions, finalStatus: sim.state.status, x: sim.state.player.x, y: sim.state.player.y };
}

for (const mode of ['explorador', 'programador', 'precisao']) {
  const results = levels.TRAP_LEVELS.map((_, index) => runTrapLevel(index + 1, mode));
  check(`Trap Lab · percurso ${mode}`, results.every((item) => item.completed), `As ${levels.TRAP_LEVELS.length} fases foram atravessadas pelo agente físico no modo ${mode}, incluindo portões e terminal final.`, results);
}

const trapCoyote = new TrapLabSimulation('programador');
trapCoyote.start();
let trapState = trapCoyote.state;
trapCoyote.restore({ ...trapState, status: 'playing', player: { ...trapState.player, grounded: false, vy: 1 }, coyoteMs: 80, jumpBufferMs: 0 });
check('Trap Lab · coyote time', trapCoyote.jump().includes('jump') && trapCoyote.state.player.vy < 0, 'O salto ainda é aceito logo após o personagem deixar uma borda.');

const trapBuffer = new TrapLabSimulation('programador');
trapBuffer.start();
trapState = trapBuffer.state;
trapBuffer.restore({ ...trapState, status: 'playing', player: { ...trapState.player, y: 12.30, grounded: false, vy: 5 }, coyoteMs: 0, jumpBufferMs: 0 });
trapBuffer.jump();
let bufferedTrapJump = false;
for (let i = 0; i < 20; i += 1) { trapBuffer.step(16); if (trapBuffer.state.player.vy < 0) { bufferedTrapJump = true; break; } }
check('Trap Lab · jump buffer', bufferedTrapJump, 'Um comando de salto realizado pouco antes da aterrissagem é executado ao tocar o chão.');

const legacyTrap = new TrapLabSimulation('explorador');
const legacyTrapState = legacyTrap.state;
legacyTrap.restore({ ...legacyTrapState, schemaVersion: 1 });
check('Trap Lab · migração de save', legacyTrap.state.schemaVersion === 2, 'Saves schema 1 são migrados para o novo estado físico schema 2.');

const bridge = req('games/bit-bridge-16/simulation/bit-bridge-simulation');
const { BitBridgeSimulation } = bridge;
const jumpHeight = (620 * 620) / (2 * 1400);
const maxRise = Math.max(...bridge.BIT_BRIDGE_PLATFORMS.map((platform) => bridge.BIT_BRIDGE_GROUND_Y - platform.y));
check('Ponte · envelope vertical', maxRise <= jumpHeight, `Todas as plataformas exigem no máximo ${maxRise.toFixed(1)} px de subida para um salto capaz de ${jumpHeight.toFixed(1)} px.`, { jumpHeight, maxRise });

function platformLanding(platform) {
  const sim = new BitBridgeSimulation('expandido');
  const initial = sim.state;
  sim.restore({ ...initial, status: 'playing', player: { ...initial.player, x: platform.x - 120, y: bridge.BIT_BRIDGE_GROUND_Y - initial.player.height, vx: 300, vy: 0, onGround: true, invulnerableMs: 999999 }, checkpointX: platform.x - 120, lives: 4, coyoteMs: 130, jumpBufferMs: 0 });
  sim.setMoveRight(true);
  sim.jump();
  for (let i = 0; i < 220; i += 1) {
    sim.step(8.333);
    const state = sim.state;
    if (state.player.onGround && Math.abs(state.player.y - (platform.y - state.player.height)) < 1 && state.player.x + state.player.width > platform.x && state.player.x < platform.x + platform.width) return true;
    if (state.player.x > platform.x + platform.width + 60 || state.lives < 4) return false;
  }
  return false;
}
const platformResults = bridge.BIT_BRIDGE_PLATFORMS.map((platform, index) => ({ platform: index + 1, landed: platformLanding(platform) }));
check('Ponte · aterrissagem nas plataformas', platformResults.every((item) => item.landed), `As ${bridge.BIT_BRIDGE_PLATFORMS.length} plataformas podem ser alcançadas diretamente por um salto de recuperação.`, platformResults);

function hazardJump(hazard) {
  const sim = new BitBridgeSimulation('expandido');
  const initial = sim.state;
  sim.restore({ ...initial, status: 'playing', player: { ...initial.player, x: hazard.x - 120, y: bridge.BIT_BRIDGE_GROUND_Y - initial.player.height, vx: 300, vy: 0, onGround: true, invulnerableMs: 0 }, checkpointX: hazard.x - 120, lives: 4, coyoteMs: 130, jumpBufferMs: 0 });
  sim.setMoveRight(true);
  sim.jump();
  for (let i = 0; i < 300; i += 1) { sim.step(8.333); if (sim.state.player.x > hazard.x + hazard.width + 30 || sim.state.lives < 4) break; }
  return sim.state.lives === 4 && sim.state.player.x > hazard.x + hazard.width;
}
const hazardResults = bridge.BIT_BRIDGE_HAZARDS.map((hazard, index) => ({ hazard: index + 1, crossed: hazardJump(hazard) }));
check('Ponte · salto sobre perigos', hazardResults.every((item) => item.crossed), `Os ${bridge.BIT_BRIDGE_HAZARDS.length} perigos foram atravessados sem perda de vida em simulação física.`, hazardResults);

const fragmentsOnPlatforms = bridge.BIT_BRIDGE_FRAGMENTS.every((fragment) => bridge.BIT_BRIDGE_PLATFORMS.some((platform) => fragment.x >= platform.x && fragment.x <= platform.x + platform.width && fragment.y + 18 >= platform.y - 32 && fragment.y - 18 <= platform.y));
check('Ponte · fragmentos alcançáveis', fragmentsOnPlatforms, `Todos os ${bridge.BIT_BRIDGE_FRAGMENTS.length} fragmentos estão associados a plataformas alcançáveis e dentro da área de coleta ampliada.`);

const safeCheckpoints = bridge.BIT_BRIDGE_CHECKPOINTS.every((checkpoint) => !bridge.BIT_BRIDGE_HAZARDS.some((hazard) => checkpoint < hazard.x + hazard.width && checkpoint + 22 > hazard.x));
check('Ponte · checkpoints seguros', safeCheckpoints, 'Nenhum respawn de checkpoint sobrepõe uma área de dano.', { checkpoints: bridge.BIT_BRIDGE_CHECKPOINTS });

const zoneSim = new BitBridgeSimulation('expandido');
let zoneState = zoneSim.state;
zoneSim.restore({ ...zoneState, status: 'playing', player: { ...zoneState.player, x: 3150, y: bridge.BIT_BRIDGE_GROUND_Y - zoneState.player.height, onGround: true }, zone: 3 });
zoneSim.step(16);
check('Ponte · quarta zona', zoneSim.state.zone === 4, 'O setor intermediário registra corretamente a Zona 4.');
const zoneFive = new BitBridgeSimulation('expandido');
let zoneFiveState = zoneFive.state;
zoneFive.restore({ ...zoneFiveState, status: 'playing', player: { ...zoneFiveState.player, x: 4300, y: bridge.BIT_BRIDGE_GROUND_Y - zoneFiveState.player.height, onGround: true }, zone: 4 });
zoneFive.step(16);
check('Ponte · quinta zona', zoneFive.state.zone === 5, 'A expansão registra corretamente a Zona 5.');
const zoneSix = new BitBridgeSimulation('expandido');
let zoneSixState = zoneSix.state;
zoneSix.restore({ ...zoneSixState, status: 'playing', player: { ...zoneSixState.player, x: 5400, y: bridge.BIT_BRIDGE_GROUND_Y - zoneSixState.player.height, onGround: true }, zone: 5 });
zoneSix.step(16);
check('Ponte · sexta zona', zoneSix.state.zone === 6, 'A expansão registra corretamente a Zona 6.');

const portalSim = new BitBridgeSimulation('expandido');
let portalState = portalSim.state;
portalSim.restore({ ...portalState, status: 'playing', fragments: bridge.BIT_BRIDGE_FRAGMENTS.slice(0, bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS).map((item) => item.id), player: { ...portalState.player, x: bridge.BIT_BRIDGE_WORLD_WIDTH - 181, y: bridge.BIT_BRIDGE_GROUND_Y - portalState.player.height, vx: 325, onGround: true }, moveRight: true, zone: 4 });
portalSim.setMoveRight(true);
for (let i = 0; i < 20 && portalSim.state.status === 'playing'; i += 1) portalSim.step(16);
check('Ponte · portal final', portalSim.state.status === 'won', `O portal conclui a experiência quando ${bridge.BIT_BRIDGE_REQUIRED_FRAGMENTS} fragmentos foram coletados.`);

const bridgeCoyote = new BitBridgeSimulation('expandido');
let bridgeState = bridgeCoyote.state;
bridgeCoyote.restore({ ...bridgeState, status: 'playing', player: { ...bridgeState.player, onGround: false, vy: 1 }, coyoteMs: 80, jumpBufferMs: 0 });
check('Ponte · coyote time', bridgeCoyote.jump().includes('jump') && bridgeCoyote.state.player.vy < 0, 'O salto de borda é aceito dentro da janela de tolerância.');

const bridgeBuffer = new BitBridgeSimulation('expandido');
bridgeState = bridgeBuffer.state;
bridgeBuffer.restore({ ...bridgeState, status: 'playing', player: { ...bridgeState.player, y: bridge.BIT_BRIDGE_GROUND_Y - bridgeState.player.height - 8, onGround: false, vy: 120 }, coyoteMs: 0, jumpBufferMs: 0 });
bridgeBuffer.jump();
let bridgeBufferedJump = false;
for (let i = 0; i < 20; i += 1) { bridgeBuffer.step(16); if (bridgeBuffer.state.player.vy < 0) { bridgeBufferedJump = true; break; } }
check('Ponte · jump buffer', bridgeBufferedJump, 'O salto antecipado é executado após a aterrissagem.');

const legacyBridge = new BitBridgeSimulation('comparativo');
const legacyBridgeState = legacyBridge.state;
legacyBridge.restore({ ...legacyBridgeState, schemaVersion: 1 });
check('Ponte · migração de save', legacyBridge.state.schemaVersion === 2, 'Saves schema 1 são migrados para o novo estado físico schema 2.');

const summary = { passed: checks.filter((item) => item.status === 'pass').length, failed: checks.filter((item) => item.status === 'fail').length, total: checks.length };
const result = { product: 'Fliperama DS', version: '0.37.0', phase: 'Fase 7.18 — regressão física preservada', generatedAt: new Date().toISOString(), summary, checks };
fs.writeFileSync(path.join(__dirname, 'platform-physics-test-results.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (summary.failed) process.exitCode = 1;

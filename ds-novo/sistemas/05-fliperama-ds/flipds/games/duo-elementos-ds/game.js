import { MultiplayerLocalCore } from '../shared/multiplayer-local-core.js';

const params = new URLSearchParams(location.search);
const embedded = params.get('embed') === '1';
let mode = params.get('mode') === 'local' ? 'local' : 'solo';
const quality = params.get('quality') || 'medium';
const reducedMotion = params.get('reduced') === '1' || (typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const muted = params.get('muted') === '1';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false });
const shell = document.querySelector('#game-shell');
const levelLabel = document.querySelector('#level-label');
const levelTitle = document.querySelector('#level-title');
const objectiveText = document.querySelector('#objective-text');
const modeLabel = document.querySelector('#mode-label');
const activeLabel = document.querySelector('#active-label');
const shardLabel = document.querySelector('#shard-label');
const toast = document.querySelector('#toast');
const pauseOverlay = document.querySelector('#pause');
const touchControls = document.querySelector('#touch-controls');
const touchSwitch = document.querySelector('#touch-switch');

const input = new MultiplayerLocalCore(mode);
shell.dataset.mode = mode;
modeLabel.textContent = mode === 'local' ? '2 JOGADORES' : 'SOLO';
touchSwitch.hidden = mode === 'local';

const COLORS = {
  background: '#06111c',
  platform: '#193a4d',
  platformEdge: '#3d7d98',
  ember: '#ff8a3d',
  emberGlow: '#ff4d2e',
  tide: '#58c8ff',
  tideGlow: '#1975ff',
  shard: '#f7e889',
  gate: '#9caec0',
  void: '#bd55ff',
};

const PLAYER_SIZE = { w: 28, h: 38 };
const MOVE_SPEED = 190;
const GRAVITY = 1180;
const JUMP_SPEED = 480;
const COYOTE_MS = 105;
const JUMP_BUFFER_MS = 120;

let levelData;
let levelIndex = 0;
let level;
let players = [];
let latchedSwitches = new Set();
let collectedShards = new Set();
let checkpointSpawns = null;
let state = 'tutorial';
let score = 0;
let deaths = 0;
let elapsedMs = 0;
let levelElapsedMs = 0;
let levelCompleteTimer = 0;
let lastFrame = performance.now();
let toastTimer = 0;
let shake = 0;
let ambientPhase = 0;
let particles = [];
let lastProgressSignature = '';
let audioContext;

const levelResponse = await fetch('./levels.json', { cache: 'no-store' });
if (!levelResponse.ok) throw new Error(`Falha ao carregar níveis: HTTP ${levelResponse.status}`);
levelData = await levelResponse.json();
loadLevel(0, false);
setupTouchControls();
setupMessageBridge();
resize();
addEventListener('resize', resize);
post('ready', { mode, quality, levels: levelData.levels.length, renderer: 'canvas2d' });
requestAnimationFrame(loop);

function setupMessageBridge() {
  addEventListener('message', (event) => {
    if ((location.origin !== 'null' && event.origin !== location.origin) || event.data?.source !== 'fliperama-ds') return;
    const type = String(event.data.type || '');
    const detail = event.data.detail && typeof event.data.detail === 'object' ? event.data.detail : {};
    if (type === 'start') {
      if (detail.restore) restore(detail.restore);
      state = 'playing';
      pauseOverlay.hidden = true;
      unlockAudio();
      post('started', { mode });
    } else if (type === 'restart') {
      loadLevel(0, false);
      state = 'playing';
      pauseOverlay.hidden = true;
      post('started', { mode });
    } else if (type === 'pause') {
      if (state === 'playing') state = 'paused';
      pauseOverlay.hidden = false;
    } else if (type === 'resume') {
      if (state === 'paused' || state === 'tutorial') state = 'playing';
      pauseOverlay.hidden = true;
    } else if (type === 'input') {
      const action = String(detail.action || '');
      if (action === 'reset-level' && detail.active) resetLevel();
      else input.dispatch(action, !!detail.active);
    } else if (type === 'restore') {
      restore(detail.payload || detail);
    } else if (type === 'shutdown') {
      state = 'disposed';
      input.clear();
    }
  });
}

function setupTouchControls() {
  const coarse = (typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches) || innerWidth < 760;
  touchControls.hidden = !coarse;
  document.querySelectorAll('[data-action]').forEach((button) => {
    if (button.dataset.touchBound === '1') return;
    button.dataset.touchBound = '1';
    const rawAction = button.dataset.action;
    const action = mode === 'solo' && rawAction === 'p1-left' ? 'move-left'
      : mode === 'solo' && rawAction === 'p1-right' ? 'move-right'
      : mode === 'solo' && rawAction === 'p1-jump' ? 'jump'
      : rawAction;
    if (mode === 'solo' && rawAction?.startsWith('p2-')) button.closest('.p2')?.setAttribute('hidden', '');
    const down = (event) => {
      event.preventDefault();
      button.classList.add('active');
      input.dispatch(action, true);
      if (button.setPointerCapture && event.pointerId !== undefined) button.setPointerCapture(event.pointerId);
    };
    const up = (event) => {
      event.preventDefault();
      button.classList.remove('active');
      input.dispatch(action, false);
    };
    button.addEventListener('pointerdown', down);
    button.addEventListener('pointerup', up);
    button.addEventListener('pointercancel', up);
    button.addEventListener('pointerleave', (event) => { if (event.buttons === 0) up(event); });
  });
}

function post(type, detail = {}) {
  if (!embedded && window.parent === window) return;
  const target = location.origin === 'null' ? '*' : location.origin;
  parent.postMessage({ source: 'fliperama-ds-duo-elementos', type, detail }, target);
}

function unlockAudio() {
  if (muted || audioContext) return;
  try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
}

function tone(frequency, duration = 0.08, gain = 0.035, type = 'sine') {
  if (muted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  volume.gain.setValueAtTime(gain, audioContext.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(volume).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function createPlayer(element, spawn) {
  return {
    element,
    x: spawn[0], y: spawn[1], vx: 0, vy: 0,
    w: PLAYER_SIZE.w, h: PLAYER_SIZE.h,
    grounded: false, coyoteMs: 0, jumpBufferMs: 0,
    exitReady: false,
  };
}

function loadLevel(index, preserveScore = true) {
  levelIndex = Math.max(0, Math.min(levelData.levels.length - 1, index));
  level = levelData.levels[levelIndex];
  players = [createPlayer('ember', level.spawns.ember), createPlayer('tide', level.spawns.tide)];
  latchedSwitches = new Set();
  collectedShards = new Set();
  checkpointSpawns = null;
  levelElapsedMs = 0;
  levelCompleteTimer = 0;
  particles = [];
  if (!preserveScore) { score = 0; deaths = 0; elapsedMs = 0; }
  updateHud();
  showToast(`FASE ${levelIndex + 1} · ${level.title}`, 1200);
  sendProgress(true);
}

function restore(payload) {
  if (!payload || typeof payload !== 'object') return;
  if (payload.mode === 'local' || payload.mode === 'solo') {
    mode = payload.mode;
    input.setMode(mode);
    shell.dataset.mode = mode;
    modeLabel.textContent = mode === 'local' ? '2 JOGADORES' : 'SOLO';
    touchSwitch.hidden = mode === 'local';
    resize();
  }
  score = Number(payload.score) || 0;
  deaths = Number(payload.deaths) || 0;
  elapsedMs = Number(payload.elapsedMs) || 0;
  const restoredIndex = Math.max(0, Math.min(levelData.levels.length - 1, Number(payload.levelIndex) || 0));
  loadLevel(restoredIndex, true);
  if (Array.isArray(payload.latchedSwitches)) latchedSwitches = new Set(payload.latchedSwitches.filter(id => level.switches.some(sw => sw.id === id)));
  if (Array.isArray(payload.collectedShards)) collectedShards = new Set(payload.collectedShards.filter(id => level.shards[id]));
  if (Array.isArray(payload.players) && payload.players.length === 2) {
    payload.players.forEach((source, index) => {
      const player = players[index];
      if (Number.isFinite(source?.x) && Number.isFinite(source?.y)) {
        player.x = clamp(source.x, 0, 960 - player.w);
        player.y = clamp(source.y, 0, 500 - player.h);
      }
    });
  }
  if (Number(payload.activePlayer) === 1 && mode === 'solo') input.activePlayer = 1;
  updateHud();
  sendProgress(true);
}

function serialize() {
  return {
    schemaVersion: 1,
    mode,
    levelIndex,
    level: levelIndex + 1,
    levels: levelData.levels.length,
    score,
    deaths,
    elapsedMs: Math.round(elapsedMs),
    shards: collectedShards.size,
    shardsTotal: level.shards.length,
    activePlayer: input.activePlayer,
    latchedSwitches: [...latchedSwitches],
    collectedShards: [...collectedShards],
    players: players.map(({ x, y, element }) => ({ x, y, element })),
  };
}

function loop(now) {
  const rawDt = Math.min(40, Math.max(0, now - lastFrame));
  lastFrame = now;
  if (state === 'playing') update(rawDt);
  draw(now);
  if (state !== 'disposed') requestAnimationFrame(loop);
}

function update(dtMs) {
  const dt = dtMs / 1000;
  elapsedMs += dtMs;
  levelElapsedMs += dtMs;
  ambientPhase += dt;
  input.pollGamepads();

  if (levelCompleteTimer > 0) {
    levelCompleteTimer -= dtMs;
    if (levelCompleteTimer <= 0) advanceLevel();
    input.endFrame();
    return;
  }

  for (let i = 0; i < players.length; i += 1) updatePlayer(players[i], i, dt, dtMs);
  updateSwitches();
  updateShards();
  updateCheckpoint();
  updateExits();
  updateParticles(dtMs);
  if (shake > 0) shake = Math.max(0, shake - dtMs);
  if (toastTimer > 0) {
    toastTimer -= dtMs;
    if (toastTimer <= 0) toast.hidden = true;
  }
  updateHud();
  sendProgress();
  input.endFrame();
}

function updatePlayer(player, index, dt, dtMs) {
  const left = input.isHeld(index, 'left');
  const right = input.isHeld(index, 'right');
  const activeInSolo = mode === 'local' || input.activePlayer === index;
  const targetVx = activeInSolo ? ((right ? 1 : 0) - (left ? 1 : 0)) * MOVE_SPEED : 0;
  player.vx += (targetVx - player.vx) * Math.min(1, dt * 14);
  if (!left && !right) player.vx *= Math.pow(0.0005, dt);

  if (input.consumePressed(index, 'jump')) player.jumpBufferMs = JUMP_BUFFER_MS;
  player.jumpBufferMs = Math.max(0, player.jumpBufferMs - dtMs);
  player.coyoteMs = player.grounded ? COYOTE_MS : Math.max(0, player.coyoteMs - dtMs);
  if (player.jumpBufferMs > 0 && player.coyoteMs > 0 && activeInSolo) {
    player.vy = -JUMP_SPEED;
    player.grounded = false;
    player.coyoteMs = 0;
    player.jumpBufferMs = 0;
    tone(player.element === 'ember' ? 420 : 520, .07, .025, 'triangle');
    spawnBurst(player.x + player.w / 2, player.y + player.h, elementColor(player.element), 5);
  }

  const solids = getSolids();
  player.x += player.vx * dt;
  resolveHorizontal(player, solids);
  player.vy = Math.min(720, player.vy + GRAVITY * dt);
  player.y += player.vy * dt;
  player.grounded = false;
  resolveVertical(player, solids);
  player.x = clamp(player.x, 0, 960 - player.w);

  if (player.y > 565) return respawnPlayer(index, 'queda');
  for (const hazard of level.hazards) {
    if (!intersects(player, hazard)) continue;
    const safe = (hazard.element === 'fire' && player.element === 'ember') || (hazard.element === 'water' && player.element === 'tide');
    if (!safe) return respawnPlayer(index, hazard.element === 'void' ? 'pulso instável' : 'fluxo incompatível');
  }
}

function getSolids() {
  const solids = level.platforms.map(([x,y,w,h]) => ({ x,y,w,h, type:'platform' }));
  for (const gate of level.gates) {
    if (!isGateOpen(gate)) solids.push({ ...gate, type:'gate' });
  }
  return solids;
}

function resolveHorizontal(player, solids) {
  for (const solid of solids) {
    if (!intersects(player, solid)) continue;
    if (player.vx > 0) player.x = solid.x - player.w;
    else if (player.vx < 0) player.x = solid.x + solid.w;
    player.vx = 0;
  }
}

function resolveVertical(player, solids) {
  for (const solid of solids) {
    if (!intersects(player, solid)) continue;
    if (player.vy > 0) {
      player.y = solid.y - player.h;
      player.vy = 0;
      player.grounded = true;
    } else if (player.vy < 0) {
      player.y = solid.y + solid.h;
      player.vy = 0;
    }
  }
}

function updateSwitches() {
  for (const sw of level.switches) {
    if (latchedSwitches.has(sw.id)) continue;
    for (const player of players) {
      if ((sw.element === player.element || sw.element === 'any') && intersects(player, sw)) {
        latchedSwitches.add(sw.id);
        score += 125;
        tone(sw.element === 'ember' ? 610 : 720, .12, .035, 'square');
        showToast(`RELÉ ${sw.element === 'ember' ? 'ÍGNEO' : sw.element === 'tide' ? 'AQUA' : 'NEXUS'} ATIVADO`);
        spawnBurst(sw.x + sw.w/2, sw.y, sw.element === 'ember' ? COLORS.ember : sw.element === 'tide' ? COLORS.tide : COLORS.shard, 12);
      }
    }
  }
}

function isGateOpen(gate) {
  return gate.requires.every(id => latchedSwitches.has(id));
}

function updateShards() {
  level.shards.forEach((shard, index) => {
    if (collectedShards.has(index)) return;
    const rect = { x: shard.x - 12, y: shard.y - 12, w: 24, h: 24 };
    for (const player of players) {
      const compatible = shard.element === 'any' || shard.element === player.element;
      if (compatible && intersects(player, rect)) {
        collectedShards.add(index);
        score += shard.element === 'any' ? 180 : 240;
        tone(shard.element === 'ember' ? 760 : shard.element === 'tide' ? 860 : 920, .11, .04, 'sine');
        spawnBurst(shard.x, shard.y, shard.element === 'ember' ? COLORS.ember : shard.element === 'tide' ? COLORS.tide : COLORS.shard, 16);
        showToast(`NÚCLEO ${collectedShards.size}/${level.shards.length}`);
      }
    }
  });
}

function updateCheckpoint() {
  if (!level.checkpoint || checkpointSpawns) return;
  if (players.every(player => player.x + player.w / 2 >= level.checkpoint)) {
    checkpointSpawns = players.map(player => [Math.max(level.checkpoint + 12, player.x), Math.min(player.y, 462)]);
    score += 100;
    tone(540, .15, .03, 'triangle');
    showToast('CHECKPOINT DO DUO REGISTRADO');
  }
}

function updateExits() {
  const exits = [level.exits.ember, level.exits.tide];
  players.forEach((player, index) => {
    const [x,y,w,h] = exits[index];
    player.exitReady = intersects(player, { x,y,w,h });
  });
  if (!players.every(player => player.exitReady)) return;
  if (collectedShards.size < level.shards.length) {
    showToast(`FALTAM ${level.shards.length - collectedShards.size} NÚCLEOS`);
    return;
  }
  if (level.gates.some(gate => !isGateOpen(gate))) {
    showToast('SINCRONIZAÇÃO INCOMPLETA');
    return;
  }
  if (levelCompleteTimer <= 0) {
    levelCompleteTimer = reducedMotion ? 250 : 900;
    score += Math.max(500, 1600 - Math.floor(levelElapsedMs / 1000) * 8 - deaths * 40);
    tone(1040, .25, .05, 'triangle');
    showToast(levelIndex === levelData.levels.length - 1 ? 'NEXUS ESTABILIZADO!' : 'FASE SINCRONIZADA!', 1100);
    post('level-complete', { level: levelIndex + 1, score, deaths });
  }
}

function advanceLevel() {
  if (levelIndex >= levelData.levels.length - 1) {
    state = 'finished';
    const medal = deaths === 0 ? 'ouro' : deaths <= 4 ? 'prata' : 'bronze';
    post('finished', { winner: 'duo', score, deaths, level: 8, levels: 8, medal, elapsedMs: Math.round(elapsedMs) });
    return;
  }
  loadLevel(levelIndex + 1, true);
}

function respawnPlayer(index, reason) {
  const player = players[index];
  deaths += 1;
  score = Math.max(0, score - 75);
  shake = reducedMotion ? 0 : 180;
  const spawn = checkpointSpawns?.[index] ?? (index === 0 ? level.spawns.ember : level.spawns.tide);
  spawnBurst(player.x + player.w / 2, player.y + player.h / 2, elementColor(player.element), 18);
  player.x = spawn[0]; player.y = spawn[1]; player.vx = 0; player.vy = 0; player.grounded = false;
  tone(160, .16, .04, 'sawtooth');
  showToast(`${player.element === 'ember' ? 'ÍGNEO' : 'AQUA'} REINICIADO · ${reason.toUpperCase()}`);
}

function resetLevel() {
  const oldScore = score;
  loadLevel(levelIndex, true);
  score = Math.max(0, oldScore - 100);
  showToast('FASE REINICIADA');
}

function sendProgress(force = false) {
  const payload = serialize();
  const signature = `${payload.level}:${payload.score}:${payload.deaths}:${payload.shards}:${payload.activePlayer}:${payload.latchedSwitches.join(',')}`;
  if (!force && signature === lastProgressSignature) return;
  lastProgressSignature = signature;
  post('progress', payload);
}

function updateHud() {
  levelLabel.textContent = `FASE ${levelIndex + 1}/${levelData.levels.length}`;
  levelTitle.textContent = level.title;
  objectiveText.textContent = level.objective;
  activeLabel.textContent = mode === 'local' ? 'COOP LOCAL' : `ATIVO: ${input.activePlayer === 0 ? 'ÍGNEO' : 'AQUA'}`;
  shardLabel.textContent = `NÚCLEOS ${collectedShards.size}/${level.shards.length}`;
}

function draw(now) {
  const dpr = Math.min(devicePixelRatio || 1, quality === 'ultra' ? 2 : 1.5);
  const displayW = canvas.clientWidth || 960;
  const displayH = canvas.clientHeight || 540;
  if (canvas.width !== Math.round(displayW * dpr) || canvas.height !== Math.round(displayH * dpr)) {
    canvas.width = Math.round(displayW * dpr); canvas.height = Math.round(displayH * dpr);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#02070c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(canvas.width / 960, canvas.height / 540);
  const offsetX = (canvas.width - 960 * scale) / 2;
  const offsetY = (canvas.height - 540 * scale) / 2;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  const sx = shake > 0 ? Math.sin(now * .08) * 3 : 0;
  const sy = shake > 0 ? Math.cos(now * .06) * 2 : 0;
  ctx.save(); ctx.translate(sx, sy);
  drawBackground(now);
  drawWorld(now);
  drawPlayers(now);
  drawParticles();
  ctx.restore();
}

function drawBackground(now) {
  const grad = ctx.createLinearGradient(0, 0, 0, 540);
  grad.addColorStop(0, '#071b2a'); grad.addColorStop(.55, '#0b2534'); grad.addColorStop(1, '#041019');
  ctx.fillStyle = grad; ctx.fillRect(-120, -80, 1200, 700);
  const count = quality === 'low' ? 10 : quality === 'ultra' ? 42 : 26;
  for (let i = 0; i < count; i += 1) {
    const x = (i * 137 + 60) % 960;
    const y = 70 + ((i * 89) % 310);
    const pulse = reducedMotion ? .45 : .25 + Math.sin(now * .001 + i) * .14;
    ctx.fillStyle = i % 2 ? `rgba(88,200,255,${.16 + pulse*.2})` : `rgba(255,138,61,${.12 + pulse*.18})`;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.strokeStyle = 'rgba(104,190,225,.08)'; ctx.lineWidth = 1;
  for (let y = 100; y < 500; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(960,y); ctx.stroke(); }
}

function drawWorld(now) {
  for (const [x,y,w,h] of level.platforms) {
    ctx.fillStyle = '#102c3b'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#2f6b83'; ctx.fillRect(x, y, w, 4);
    if (quality !== 'baixo') { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(x+4, y+h, w, 6); }
  }
  for (const hazard of level.hazards) drawHazard(hazard, now);
  for (const sw of level.switches) drawSwitch(sw, now);
  for (const gate of level.gates) drawGate(gate, now);
  level.shards.forEach((shard, index) => { if (!collectedShards.has(index)) drawShard(shard, now, index); });
  if (level.checkpoint) drawCheckpoint(level.checkpoint, !!checkpointSpawns, now);
  drawExit(level.exits.ember, 'ember', players[0].exitReady, now);
  drawExit(level.exits.tide, 'tide', players[1].exitReady, now);
}

function drawHazard(h, now) {
  const color = h.element === 'fire' ? '#ff5a32' : h.element === 'water' ? '#2aaef1' : '#a542df';
  const phase = reducedMotion ? 0 : Math.sin(now*.006 + h.x*.01) * 3;
  ctx.fillStyle = `${color}77`; ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = color;
  for (let x = h.x; x < h.x+h.w; x += 18) {
    ctx.beginPath(); ctx.arc(x+9, h.y+5+phase, 5, 0, Math.PI*2); ctx.fill();
  }
}

function drawSwitch(sw, now) {
  const active = latchedSwitches.has(sw.id);
  const color = sw.element === 'ember' ? COLORS.ember : sw.element === 'tide' ? COLORS.tide : COLORS.shard;
  ctx.save();
  if (active && quality !== 'baixo') { ctx.shadowBlur = 18; ctx.shadowColor = color; }
  ctx.fillStyle = active ? color : '#254150'; ctx.fillRect(sw.x, sw.y, sw.w, sw.h);
  ctx.fillStyle = active ? '#fff9' : '#ffffff24'; ctx.fillRect(sw.x+4, sw.y+2, sw.w-8, 2);
  ctx.restore();
}

function drawGate(gate, now) {
  const open = isGateOpen(gate);
  if (open) {
    ctx.strokeStyle = 'rgba(141,230,255,.28)'; ctx.setLineDash([8,8]); ctx.strokeRect(gate.x, gate.y, gate.w, gate.h); ctx.setLineDash([]); return;
  }
  ctx.fillStyle = '#526d80'; ctx.fillRect(gate.x, gate.y, gate.w, gate.h);
  ctx.fillStyle = '#9ec6db';
  for (let y = gate.y+8; y < gate.y+gate.h; y += 20) ctx.fillRect(gate.x+4, y, gate.w-8, 4);
}

function drawShard(shard, now, index) {
  const color = shard.element === 'ember' ? COLORS.ember : shard.element === 'tide' ? COLORS.tide : COLORS.shard;
  const bob = reducedMotion ? 0 : Math.sin(now*.004 + index) * 4;
  ctx.save(); ctx.translate(shard.x, shard.y+bob); ctx.rotate(reducedMotion ? Math.PI/4 : now*.001 + index);
  if (quality !== 'baixo') { ctx.shadowBlur = 18; ctx.shadowColor = color; }
  ctx.fillStyle = color; ctx.fillRect(-8,-8,16,16); ctx.fillStyle = '#fff9'; ctx.fillRect(-4,-6,4,4); ctx.restore();
}

function drawCheckpoint(x, active, now) {
  ctx.save(); ctx.translate(x, 470);
  ctx.strokeStyle = active ? '#9cf7c4' : '#7aa6b5'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0,28); ctx.lineTo(0,-10); ctx.stroke();
  ctx.fillStyle = active ? '#9cf7c4' : '#537787'; ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(24,-2); ctx.lineTo(0,6); ctx.fill(); ctx.restore();
}

function drawExit(rect, element, ready, now) {
  const [x,y,w,h] = rect; const color = elementColor(element);
  ctx.save();
  if (quality !== 'baixo') { ctx.shadowBlur = ready ? 28 : 14; ctx.shadowColor = color; }
  ctx.strokeStyle = color; ctx.lineWidth = ready ? 4 : 2; ctx.strokeRect(x,y,w,h);
  ctx.fillStyle = ready ? `${color}44` : `${color}18`; ctx.fillRect(x+4,y+4,w-8,h-8); ctx.restore();
}

function drawPlayers(now) {
  players.forEach((player, index) => {
    const color = elementColor(player.element);
    ctx.save();
    if (quality !== 'baixo') { ctx.shadowBlur = mode === 'solo' && input.activePlayer === index ? 22 : 12; ctx.shadowColor = color; }
    const x = player.x, y = player.y;
    ctx.fillStyle = color; roundRect(ctx, x, y, player.w, player.h, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x+7, y+10, 4, 4); ctx.fillRect(x+17,y+10,4,4);
    ctx.fillStyle = '#071018'; ctx.fillRect(x+8,y+11,2,2); ctx.fillRect(x+18,y+11,2,2);
    if (mode === 'solo' && input.activePlayer === index) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; roundRect(ctx,x-3,y-3,player.w+6,player.h+6,10); ctx.stroke(); }
    ctx.restore();
  });
}

function spawnBurst(x, y, color, count) {
  if (quality === 'low') count = Math.ceil(count * .35);
  for (let i=0;i<count;i++) particles.push({ x,y, vx:(Math.random()-.5)*150, vy:(Math.random()-.8)*140, life:300+Math.random()*350, max:650, color });
  if (particles.length > 120) particles.splice(0, particles.length-120);
}

function updateParticles(dtMs) {
  const dt=dtMs/1000;
  for (const p of particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 220*dt; p.life -= dtMs; }
  particles = particles.filter(p => p.life > 0);
}
function drawParticles() { for (const p of particles) { ctx.globalAlpha = clamp(p.life/p.max,0,1); ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,3,3); } ctx.globalAlpha=1; }

function showToast(text, duration=800) { toast.textContent=text; toast.hidden=false; toastTimer=duration; }
function elementColor(element) { return element === 'ember' ? COLORS.ember : COLORS.tide; }
function intersects(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
function roundRect(context,x,y,w,h,r){ const rr=Math.min(r,w/2,h/2); context.beginPath(); context.moveTo(x+rr,y); context.arcTo(x+w,y,x+w,y+h,rr); context.arcTo(x+w,y+h,x,y+h,rr); context.arcTo(x,y+h,x,y,rr); context.arcTo(x,y,x+w,y,rr); context.closePath(); }
function resize(){ const coarse = (typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches) || innerWidth < 760; touchControls.hidden = !coarse; }

addEventListener('keydown', (event) => {
  if (embedded) return;
  const map = {
    KeyA:'move-left', KeyD:'move-right', KeyW:'jump',
    ArrowLeft:'p2-left', ArrowRight:'p2-right', ArrowUp:'p2-jump',
    KeyQ:'switch-player', Tab:'switch-player', KeyR:'reset-level', KeyP:'pause'
  };
  const action = map[event.code]; if (!action) return; event.preventDefault();
  if (action==='pause') { state=state==='playing'?'paused':'playing'; pauseOverlay.hidden=state!=='paused'; return; }
  if (action==='reset-level' && !event.repeat) { resetLevel(); return; }
  input.dispatch(action,true);
});
addEventListener('keyup', (event) => {
  if (embedded) return;
  const map = { KeyA:'move-left', KeyD:'move-right', KeyW:'jump', ArrowLeft:'p2-left', ArrowRight:'p2-right', ArrowUp:'p2-jump' };
  const action=map[event.code]; if(action){ event.preventDefault(); input.dispatch(action,false); }
});

let timer = null;
let running = false;
let tick = 0;
let quality = 'balanced';
let scenario = null;
let faultActive = false;
let mitigations = new Set();
let queueDepth = 4;
let lostPackets = 0;
let droppedPackets = 0;

const intervals = { performance: 1100, balanced: 650, experience: 350 };

function post(type, payload = {}) {
  self.postMessage({ type, payload });
}

function start() {
  stop();
  running = true;
  timer = setInterval(step, intervals[quality] ?? intervals.balanced);
  post('status', { running, quality });
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  running = false;
  post('status', { running, quality });
}

function reset() {
  tick = 0;
  scenario = null;
  faultActive = false;
  mitigations = new Set();
  queueDepth = 4;
  lostPackets = 0;
  droppedPackets = 0;
  post('reset');
}

function inject(id) {
  scenario = id;
  faultActive = true;
  mitigations.delete(id);
  post('fault', { id, active: true });
}

function mitigate(id) {
  mitigations.add(id);
  if (scenario === id) faultActive = false;
  post('fault', { id, active: false });
}

function step() {
  tick++;
  const phase = Math.sin(tick * 0.22);
  const noise = Math.sin(tick * 1.73) * 0.5 + Math.cos(tick * 0.47) * 0.5;

  let temperatureA = 610 + phase * 12;
  let temperatureB = temperatureA + noise * 3;
  let link = 99.1 - Math.abs(phase) * 0.6;
  let latency = 115 + Math.abs(noise) * 28;
  let voltage = 28.4 - Math.abs(phase) * 0.35;
  let powerLoad = 68 + phase * 4;
  let incoming = quality === 'experience' ? 8 : quality === 'performance' ? 4 : 6;
  let processed = quality === 'experience' ? 8 : quality === 'performance' ? 5 : 6;

  if (faultActive && scenario === 'thermal-drift') {
    temperatureB += Math.min(290, tick * 5.2);
  }
  if (faultActive && scenario === 'queue-overflow') {
    incoming += 14;
    processed = mitigations.has('queue-overflow') ? 15 : 4;
    latency += queueDepth * 26;
  }
  if (faultActive && scenario === 'packet-loss') {
    link = 58 + phase * 9;
    latency += 720 + Math.abs(noise) * 420;
    lostPackets += Math.max(1, Math.round(5 + Math.abs(noise) * 7));
  }
  if (faultActive && scenario === 'power-sag') {
    voltage = 23.5 + phase * 0.45;
    powerLoad = mitigations.has('power-sag') ? 54 : 94;
  }

  queueDepth = Math.max(0, Math.min(48, queueDepth + incoming - processed));
  if (queueDepth >= 48) droppedPackets += incoming - processed;

  const sample = {
    tick,
    timestamp: Date.now(),
    altitude: 135 + tick * 1.95,
    velocity: 7.48 + phase * 0.11,
    temperature: Math.max(temperatureA, temperatureB),
    temperatureA,
    temperatureB,
    link,
    latency,
    voltage,
    powerLoad,
    queueDepth,
    incoming,
    processed,
    lostPackets,
    droppedPackets,
    scenario,
    faultActive
  };
  post('telemetry', sample);
}

self.addEventListener('message', event => {
  const { type, payload = {} } = event.data ?? {};
  if (type === 'start') start();
  if (type === 'stop') stop();
  if (type === 'reset') reset();
  if (type === 'step') step();
  if (type === 'quality') {
    quality = ['performance','balanced','experience'].includes(payload.quality) ? payload.quality : 'balanced';
    if (running) start();
  }
  if (type === 'inject') inject(payload.id);
  if (type === 'mitigate') mitigate(payload.id);
});

import { OrbitMath } from '../core/orbit/OrbitMath.js';
import { GROUND_STATIONS } from '../data/orbitalSystems.js';

let timer = null;
let running = false;
let tick = 0;
let elapsedSeconds = 0;
let quality = 'balanced';
let speed = 60;
let config = {
  altitudeKm: 600,
  inclinationDeg: 97.8,
  raanDeg: 18,
  phaseDeg: 0,
  panelGenerationW: 592,
  loadW: 119,
  batteryWh: 330,
  dataRateMbps: 42,
  downlinkMbps: 55
};
let batteryWh = config.batteryWh * .82;
let dataStoredGb = 3.2;
let totalDownlinkedGb = 0;

const intervals = { performance: 1100, balanced: 650, experience: 380 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function post(type, payload = {}) {
  self.postMessage({ type, payload });
}

function configure(next = {}) {
  config = { ...config, ...next };
  batteryWh = clamp(batteryWh, 0, config.batteryWh);
  post('configured', { config });
}

function closestStation(latitudeDeg, longitudeDeg, footprintKm) {
  const stations = GROUND_STATIONS.map(station => ({
    ...station,
    distanceKm: OrbitMath.haversineKm(latitudeDeg, longitudeDeg, station.lat, station.lon)
  })).sort((a, b) => a.distanceKm - b.distanceKm);
  const closest = stations[0];
  return { ...closest, visible: closest.distanceKm <= footprintKm * .92 };
}

function step() {
  tick++;
  elapsedSeconds += speed;
  const state = OrbitMath.orbitalState({ ...config, elapsedSeconds });
  const footprintKm = OrbitMath.footprintRadiusKm(config.altitudeKm, 10);
  const station = closestStation(state.latitudeDeg, state.longitudeDeg, footprintKm);
  const sunPhase = (state.anomalyRad + Math.PI * .22) % (Math.PI * 2);
  const eclipse = Math.cos(sunPhase) < -.42;
  const solarFactor = eclipse ? 0 : .74 + Math.max(0, Math.sin(sunPhase)) * .23;
  const generationW = config.panelGenerationW * solarFactor;
  const downlinkActive = station.visible && !eclipse;
  const loadW = config.loadW + (downlinkActive ? 18 : 0);
  const deltaHours = speed / 3600;
  batteryWh = clamp(batteryWh + (generationW - loadW) * deltaHours, 0, config.batteryWh);
  const producedGb = config.dataRateMbps * speed / 8 / 1024;
  const downlinkedGb = downlinkActive ? Math.min(dataStoredGb + producedGb, config.downlinkMbps * speed / 8 / 1024) : 0;
  dataStoredGb = clamp(dataStoredGb + producedGb - downlinkedGb, 0, 64);
  totalDownlinkedGb += downlinkedGb;
  const linkQuality = station.visible ? clamp(100 - (station.distanceKm / Math.max(1, footprintKm)) * 74, 18, 100) : 0;

  post('telemetry', {
    tick,
    elapsedSeconds,
    timestamp: Date.now(),
    latitudeDeg: state.latitudeDeg,
    longitudeDeg: state.longitudeDeg,
    altitudeKm: config.altitudeKm,
    velocityKmS: state.velocityKmS,
    periodSeconds: state.periodSeconds,
    footprintKm,
    eclipse,
    solarFactor,
    generationW,
    loadW,
    batteryWh,
    batteryPercent: batteryWh / config.batteryWh * 100,
    dataStoredGb,
    totalDownlinkedGb,
    downlinkActive,
    linkQuality,
    station
  });
}

function start() {
  stop(false);
  running = true;
  timer = setInterval(step, intervals[quality] ?? intervals.balanced);
  post('status', { running, quality, speed });
}

function stop(notify = true) {
  if (timer) clearInterval(timer);
  timer = null;
  running = false;
  if (notify) post('status', { running, quality, speed });
}

function reset() {
  tick = 0;
  elapsedSeconds = 0;
  batteryWh = config.batteryWh * .82;
  dataStoredGb = 3.2;
  totalDownlinkedGb = 0;
  post('reset');
}

self.addEventListener('message', event => {
  const { type, payload = {} } = event.data ?? {};
  if (type === 'start') start();
  if (type === 'stop') stop();
  if (type === 'step') step();
  if (type === 'reset') reset();
  if (type === 'configure') configure(payload);
  if (type === 'speed') {
    speed = clamp(Number(payload.speed) || 60, 1, 3600);
    post('status', { running, quality, speed });
  }
  if (type === 'quality') {
    quality = ['performance','balanced','experience'].includes(payload.quality) ? payload.quality : 'balanced';
    if (running) start();
  }
});

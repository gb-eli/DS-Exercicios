import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Worker as NodeWorker } from 'node:worker_threads';
import { EventBus } from '../src/core/events/EventBus.js';
import { JsonStorage } from '../src/core/persistence/JsonStorage.js';
import { SPACE_HISTORY, EVOLUTION_ORDER } from '../src/data/spaceHistory.js';
import { SPACE_PEOPLE, ROLE_CHALLENGE } from '../src/data/spacePeople.js';
import { SPACE_LANGUAGES, LANGUAGE_SCENARIOS } from '../src/data/spaceLanguages.js';
import { MISSION_CONTROL_SCENARIOS, FLIGHT_STATES, FLIGHT_TRANSITIONS } from '../src/data/missionControlScenarios.js';
import { MissionStateMachine } from '../src/core/mission/MissionStateMachine.js';
import { PriorityMessageQueue } from '../src/core/mission/PriorityMessageQueue.js';
import { ReplayBuffer } from '../src/core/mission/ReplayBuffer.js';
import { OrbitMath } from '../src/core/orbit/OrbitMath.js';
import { SatelliteSystem } from '../src/core/orbit/SatelliteSystem.js';
import { ORBIT_TYPES, ORBIT_CHALLENGES, GROUND_STATIONS } from '../src/data/orbitalSystems.js';
import { RocketSystem } from '../src/core/launch/RocketSystem.js';
import { RocketFlightModel } from '../src/core/launch/RocketFlightModel.js';
import { LAUNCH_MISSIONS, FIRST_STAGES, UPPER_STAGES, LAUNCH_CHECKLIST, LAUNCH_FAULTS } from '../src/data/launchSystems.js';
import { ApolloComputer } from '../src/core/lunar/ApolloComputer.js';
import { LunarDescentModel } from '../src/core/lunar/LunarDescentModel.js';
import { SurfaceMissionModel } from '../src/core/lunar/SurfaceMissionModel.js';
import { APOLLO_TIMELINE, AGC_SPEC, APOLLO_TASKS, ASSEMBLY_CHALLENGES, LANDING_SITES, LUNAR_CHECKLIST, APOLLO_ALARMS, SURFACE_OBJECTIVES } from '../src/data/lunarSystems.js';
import { MarsGrid } from '../src/core/mars/MarsGrid.js';
import { MarsCommandQueue } from '../src/core/mars/MarsCommandQueue.js';
import { MarsMissionModel } from '../src/core/mars/MarsMissionModel.js';
import { MarsVisionLab } from '../src/core/mars/MarsVisionLab.js';
import { ScienceDatabase } from '../src/core/mars/ScienceDatabase.js';
import { DroneSystem } from '../src/core/mars/DroneSystem.js';
import { MARS_TIMELINE, MARS_FAULTS, DEFAULT_MARS_GRID, VISION_SAMPLES } from '../src/data/marsSystems.js';
import { StationSystemsModel } from '../src/core/station/StationSystemsModel.js';
import { DockingModel } from '../src/core/station/DockingModel.js';
import { RoboticArmModel } from '../src/core/station/RoboticArmModel.js';
import { InventorySystem } from '../src/core/station/InventorySystem.js';
import { StationMissionModel } from '../src/core/station/StationMissionModel.js';
import { STATION_TIMELINE, STATION_FAULTS, ARM_TASKS, MAINTENANCE_TASKS } from '../src/data/stationSystems.js';
import { TelescopeSystem } from '../src/core/observatory/TelescopeSystem.js';
import { ImagePipeline } from '../src/core/observatory/ImagePipeline.js';
import { SpectrumAnalyzer } from '../src/core/observatory/SpectrumAnalyzer.js';
import { ObservationDatabase } from '../src/core/observatory/ObservationDatabase.js';
import { OBSERVATORY_TIMELINE, TELESCOPES, TARGETS, SPECTRUM_CHALLENGES, OBSERVATION_CHALLENGES } from '../src/data/observatorySystems.js';
import { MissionPlan } from '../src/core/teacher/MissionPlan.js';
import { GuidedSession } from '../src/core/teacher/GuidedSession.js';
import { MissionRepository } from '../src/core/teacher/MissionRepository.js';
import { EvidenceBuilder } from '../src/core/evidence/EvidenceBuilder.js';
import { XRSupportService } from '../src/core/xr/XRSupportService.js';
import { ProfileBackupService } from '../src/core/backup/ProfileBackupService.js';
import { StorageDiagnostics } from '../src/core/persistence/StorageDiagnostics.js';
import { MISSION_TEMPLATES, MISSION_MODULES, CONTROL_ACTIONS } from '../src/data/missionDirectorSystems.js';
import { SOLAR_BODIES, ORBITAL_FLEET, SOLAR_TOUR, BODY_BY_ID } from '../src/data/solarSystemBodies.js';
import { IMMERSIVE_VEHICLES, LAUNCH_CAMERA_PRESETS, IMMERSIVE_INSPECTIONS, VEHICLE_BY_ID } from '../src/data/launchRemasterSystems.js';
import { LaunchExperienceModel } from '../src/core/launch-remaster/LaunchExperienceModel.js';
import { SolarNavigationModel } from '../src/core/solar/SolarNavigationModel.js';
import { OrbitalFlightModel } from '../src/core/station-remaster/OrbitalFlightModel.js';
import { StationRemasterExperience } from '../src/core/station-remaster/StationRemasterExperience.js';
import { STATION_VARIANTS, ORBITAL_VEHICLES, ORBITAL_SATELLITES, STATION_CAMERA_PRESETS, STATION_INSPECTIONS } from '../src/data/stationRemasterSystems.js';
import { PlanetaryExplorationModel } from '../src/core/lunar-mars-remaster/PlanetaryExplorationModel.js';
import { PLANETARY_WORLDS, PLANETARY_VEHICLES, PLANETARY_CAMERAS, PLANETARY_MISSIONS } from '../src/data/lunarMarsRemasterSystems.js';
import { DeepSpaceNavigationModel } from '../src/core/deep-space/DeepSpaceNavigationModel.js';
import { COSMIC_DESTINATIONS, DEEP_SPACE_CAMERAS, COSMIC_TOUR } from '../src/data/deepSpaceSystems.js';
import { MuseumExperienceModel } from '../src/core/museum-remaster/MuseumExperienceModel.js';
import { MUSEUM_ZONES, MUSEUM_EXHIBITS, MUSEUM_CAMERAS, MUSEUM_MISSIONS } from '../src/data/visualMuseumSystems.js';
import { GlbGeometryParser } from '../src/core/assets/GlbGeometryParser.js';
import { GlbSceneParser } from '../src/core/assets/GlbSceneParser.js';
import { GltfAnimationPlayer } from '../src/core/assets/GltfAnimationPlayer.js';
import { PremiumColliderSystem } from '../src/core/assets/PremiumColliderSystem.js';
import { InteriorInteractionSystem } from '../src/core/assets/InteriorInteractionSystem.js';
import { TelemetryAnimationBridge } from '../src/core/assets/TelemetryAnimationBridge.js';
import { HdrEnvironmentParser } from '../src/core/assets/HdrEnvironmentParser.js';
import { PremiumAssetManager } from '../src/core/assets/PremiumAssetManager.js';
import { AssetPackCache } from '../src/core/assets/AssetPackCache.js';
import { PREMIUM_INSPECTION_GOALS, PREMIUM_RENDER_MODES } from '../src/data/premiumAssetSystems.js';
import { PREMIUM_INTEGRATION_MODULES, resolvePremiumIntegration } from '../src/data/premiumIntegrationSystems.js';
import { CinematicPostProcessController } from '../src/core/rendering/CinematicPostProcessController.js';
import { CINEMATIC_SCENES, CINEMATIC_FEATURES, CINEMATIC_GOALS } from '../src/data/cinematicSystems.js';
import { UnifiedPhysicsController } from '../src/core/physics/UnifiedPhysicsController.js';
import { PHYSICS_ENVIRONMENTS, CONTROL_PRESETS, PHYSICS_GOALS } from '../src/data/physicsControlSystems.js';
import { CampaignDirector } from '../src/core/campaign/CampaignDirector.js';
import { INTEGRATED_CAMPAIGNS, CAMPAIGN_FAULTS, CAMPAIGN_GOALS } from '../src/data/campaignSystems.js';
import { PerformanceBudgetManager, QUALITY_PACKS } from '../src/core/performance/PerformanceBudgetManager.js';
import { AssetStreamingManager } from '../src/core/performance/AssetStreamingManager.js';
import { QA_DEVICE_PROFILES, QA_CHECKLIST, QA_GOALS } from '../src/data/performanceSystems.js';
import { resourceCandidates, projectBaseUrl } from '../src/core/assets/ResourceLoader.js';
import { SPACE_KNOWLEDGE, KNOWLEDGE_SOURCES } from '../src/data/knowledge/spaceKnowledge.js';
import { KnowledgeEngine } from '../src/core/knowledge/KnowledgeEngine.js';
import { KnowledgeProfileStore } from '../src/core/knowledge/KnowledgeProfileStore.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
  key(index) { return [...this.data.keys()][index] ?? null; }
  get length() { return this.data.size; }
}

globalThis.localStorage = new MemoryStorage();
globalThis.window = { matchMedia: () => ({ matches: false }) };
globalThis.matchMedia = () => ({ matches: false });
Object.defineProperty(globalThis, 'navigator', { value: { hardwareConcurrency: 4, deviceMemory: 4, userAgent: 'Node Test' }, configurable: true });

const { SettingsStore } = await import('../src/core/settings/SettingsStore.js');
const { ProfileStore } = await import('../src/core/profiles/ProfileStore.js');
const { ModuleRegistry } = await import('../src/core/modules/ModuleRegistry.js');
const { AdaptiveQualityController } = await import('../src/core/performance/AdaptiveQualityController.js');

const bus = new EventBus();
let received = null;
bus.on('test', payload => { received = payload; });
bus.emit('test', 42);
assert.equal(received, 42, 'EventBus deve distribuir eventos.');

const storage = new JsonStorage('test-cosmos');
storage.set('sample', { ok: true });
assert.deepEqual(storage.get('sample', null), { ok: true }, 'JsonStorage deve persistir JSON.');

const settings = new SettingsStore(storage, bus);
settings.setQualityMode('performance');
assert.equal(settings.getProfile().id, 'performance', 'Perfil gráfico deve mudar.');
settings.update({ qualityMode: 'automatic', resolvedQuality: 'experience', autoReduceQuality: true });

const profiles = new ProfileStore(storage, bus);
const created = profiles.create({ name: 'Aluno Teste', className: '2DS', callsign: 'TESTE-1' });
assert.equal(profiles.addXp(300, 'academy-foundation'), true, 'Primeira conclusão deve conceder XP.');
assert.equal(profiles.addXp(300, 'academy-foundation'), false, 'Repetição não deve conceder XP duplicado.');
assert.equal(profiles.active().id, created.id, 'Perfil criado deve ficar ativo.');
assert.equal(profiles.active().xp, 300, 'XP não deve duplicar para a mesma experiência.');
assert.equal(profiles.active().level, 2, 'XP deve atualizar o nível.');
assert.ok(profiles.hasCompleted('academy-foundation'), 'Experiência concluída deve ser consultável.');

const registry = new ModuleRegistry();
const available = registry.list().filter(item => item.status === 'available');
assert.equal(available.length, 25, 'A C1.1 deve disponibilizar vinte e cinco módulos.');
for (const id of ['performance-qa','integrated-campaigns','physics-controls','cinematic-studio','premium-assets','deep-space-remaster','visual-museum','planetary-remaster','station-remaster','launch-remaster','solar-remaster','academy','mission-control','history','people','languages','mission-control-advanced','earth','launch','moon','mars','station','observatory','mission-director']) {
  const module = await registry.load(id);
  assert.equal(typeof module.mount, 'function', `${id} deve implementar mount.`);
  assert.equal(typeof module.unmount, 'function', `${id} deve implementar unmount.`);
}

assert.ok(SPACE_HISTORY.length >= 7, 'Museu deve conter pelo menos sete marcos.');
assert.deepEqual(EVOLUTION_ORDER, ['mercury','gemini','apollo'], 'Sequência histórica fundamental deve permanecer coerente.');
assert.ok(SPACE_HISTORY.every(item => item.source.startsWith('https://')), 'Todo marco histórico deve ter fonte HTTPS.');
assert.ok(SPACE_PEOPLE.length >= 6 && ROLE_CHALLENGE.length === 3, 'Galeria e desafio de pessoas devem estar completos.');
assert.ok(SPACE_PEOPLE.every(item => item.dsLink && item.source), 'Cada pessoa deve possuir conexão DS e fonte.');
assert.ok(SPACE_LANGUAGES.length >= 6 && LANGUAGE_SCENARIOS.length === 5, 'Laboratório de linguagens deve ter catálogo e cenários.');
assert.ok(LANGUAGE_SCENARIOS.every(item => SPACE_LANGUAGES.some(language => language.id === item.answer)), 'Toda resposta de cenário deve apontar para uma linguagem existente.');



const machine = new MissionStateMachine({ initial: 'STANDBY', states: FLIGHT_STATES.map(item => item.id), transitions: FLIGHT_TRANSITIONS });
assert.equal(machine.send('INSERT_ORBIT').accepted, false, 'Máquina de estados deve bloquear salto direto para órbita.');
for (const transition of FLIGHT_TRANSITIONS) assert.equal(machine.send(transition.action).accepted, true, `Transição ${transition.action} deve ser aceita na ordem correta.`);
assert.equal(machine.current, 'DEPLOYMENT', 'Sequência válida deve chegar à liberação da carga.');

const queue = new PriorityMessageQueue(6);
for (let i = 0; i < 6; i++) queue.enqueue({ i }, 'low');
const critical = queue.enqueue({ command: 'ABORT' }, 'critical');
assert.equal(critical.accepted, true, 'Mensagem crítica deve substituir item de menor prioridade em fila cheia.');
assert.equal(queue.snapshot()[0].priority, 'critical', 'Fila deve ordenar mensagens críticas primeiro.');
queue.setBackpressure(true);
assert.equal(queue.enqueue({ bulk: true }, 'low').accepted, false, 'Backpressure deve rejeitar carga de baixa prioridade.');

const replay = new ReplayBuffer(12);
for (let i = 0; i < 12; i++) replay.push({ temperature: 600 + i * 20, latency: 100 + i * 90, link: 99 - i * 3, queueDepth: i * 4 });
assert.equal(replay.size(), 12, 'Replay deve respeitar a capacidade configurada.');
assert.ok(replay.detectAnomalies().length > 0, 'Replay deve detectar anomalias térmicas, de latência, link ou fila.');
assert.equal(MISSION_CONTROL_SCENARIOS.length, 4, 'Fase 3 deve possuir quatro cenários progressivos.');
assert.ok(MISSION_CONTROL_SCENARIOS.every(item => item.correctResolution && item.xp > 0), 'Cada cenário deve ter resposta verificável e XP.');




const leoPeriod = OrbitMath.periodSeconds(550);
const geoPeriod = OrbitMath.periodSeconds(35786);
assert.ok(leoPeriod > 5000 && leoPeriod < 7000, 'Período LEO deve ficar próximo de 90 a 110 minutos.');
assert.ok(geoPeriod > 85000 && geoPeriod < 87500, 'Período GEO deve ficar próximo de um dia sideral.');
assert.ok(OrbitMath.velocityKmS(550) > OrbitMath.velocityKmS(35786), 'Órbita baixa deve possuir maior velocidade circular.');
const state = OrbitMath.orbitalState({ altitudeKm:600, inclinationDeg:97.8, elapsedSeconds:1200 });
assert.ok(Number.isFinite(state.latitudeDeg) && Number.isFinite(state.longitudeDeg), 'Propagador simplificado deve produzir coordenadas finitas.');
assert.equal(OrbitMath.groundTrack({ altitudeKm:600, inclinationDeg:97.8 }, 32).length, 32, 'Trajetória deve respeitar o número de amostras.');
assert.equal(ORBIT_TYPES.length, 5, 'Fase 4 deve disponibilizar cinco regimes orbitais.');
assert.equal(ORBIT_CHALLENGES.length, 3, 'Laboratório orbital deve conter três decisões verificáveis.');
assert.ok(GROUND_STATIONS.length >= 4, 'Rede didática deve possuir pelo menos quatro estações de solo.');

const validSatellite = new SatelliteSystem({ missionId:'observation', orbitId:'sso', busId:'small-200', payloadId:'camera-multispectral', powerId:'deployable', antennaId:'high-gain' }).summary();
assert.equal(validSatellite.validation.ok, true, 'Configuração coerente de observação deve ser validada.');
const invalidSatellite = new SatelliteSystem({ missionId:'communications', orbitId:'polar', busId:'cube-6u', payloadId:'camera-multispectral', powerId:'compact', antennaId:'patch' }).summary();
assert.equal(invalidSatellite.validation.ok, false, 'Configuração incompatível deve gerar alertas.');


const launchSystem = new RocketSystem({ missionId:'leo-lab', firstStageId:'core-h2', upperStageId:'upper-v', payloadId:'orbital-lab', guidanceId:'dual', fairingId:'standard', siteId:'coastal' }).summary();
assert.equal(launchSystem.validation.ok, true, 'Configuração padrão de lançamento deve ser válida.');
assert.ok(launchSystem.twr > 1.18, 'Veículo válido deve decolar com margem de empuxo.');
assert.ok(launchSystem.deltaVMargin > 0, 'Veículo válido deve possuir margem positiva de Δv.');
const invalidLaunch = new RocketSystem({ missionId:'lunar-demo', firstStageId:'core-l1', upperStageId:'upper-c', payloadId:'orbital-lab', guidanceId:'basic', fairingId:'compact', siteId:'coastal' }).summary();
assert.equal(invalidLaunch.validation.ok, false, 'Configuração incompatível deve ser bloqueada.');
assert.equal(LAUNCH_MISSIONS.length, 4, 'Fase 5 deve possuir quatro perfis de missão.');
assert.ok(FIRST_STAGES.length >= 3 && UPPER_STAGES.length >= 3, 'Construtor deve disponibilizar múltiplos estágios.');
assert.equal(LAUNCH_CHECKLIST.length, 8, 'Checklist deve possuir oito intertravamentos.');
assert.equal(LAUNCH_FAULTS.length, 4, 'Laboratório deve possuir quatro cenários de falha.');

const flightModel = new RocketFlightModel(launchSystem.flightConfig);
assert.equal(flightModel.start(), true, 'Contagem regressiva deve iniciar no estado de pré-lançamento.');
for (let i = 0; i < 7000 && !['ORBIT','FAILED','ABORTED'].includes(flightModel.state); i++) flightModel.step(.1);
assert.equal(flightModel.state, 'ORBIT', 'Configuração válida deve alcançar a órbita didática.');
assert.ok(flightModel.maxQ > 10000, 'Modelo deve calcular pressão dinâmica durante a subida.');
assert.ok(flightModel.telemetry().stage === 2, 'Voo orbital deve realizar separação de estágios.');
const faultModel = new RocketFlightModel(launchSystem.flightConfig);
faultModel.start();
for (let i = 0; i < 900; i++) faultModel.step(.1);
faultModel.injectFault('sensor-drift');
assert.notEqual(faultModel.telemetry().reportedAltitudeM, faultModel.telemetry().altitudeM, 'Deriva deve alterar o canal reportado.');
faultModel.resolveFault('sensor-drift','cross-validate');
assert.equal(faultModel.telemetry().reportedAltitudeM, faultModel.telemetry().altitudeM, 'Votação deve restaurar a altitude coerente.');


const apolloComputer = new ApolloComputer();
let computerCycle = apolloComputer.schedule();
assert.equal(computerCycle.overloaded, false, 'Carga nominal do computador didático deve caber no orçamento.');
apolloComputer.injectRendezvousRadar();
computerCycle = apolloComputer.schedule();
assert.equal(computerCycle.overloaded, true, 'Radar adicional deve provocar sobrecarga didática.');
assert.ok(['1201','1202'].includes(computerCycle.alarm.code), 'Sobrecarga deve emitir alarme de programa.');
const recoveredCycle = apolloComputer.priorityRestart();
assert.equal(recoveredCycle.dropped.filter(task => task.critical).length, 0, 'Reinício prioritário deve preservar tarefas críticas.');
const program = `READ ALT ALT
CMP ALT 1500
JLT BRAKE
END
BRAKE:
SET THROTTLE 58
END`;
const programResult = apolloComputer.executeProgram(program, { ALT:1200 });
assert.equal(programResult.ok, true, 'Assembly didático válido deve ser executado.');
assert.equal(programResult.actuators.THROTTLE, 58, 'Programa deve ajustar o throttle no cenário de baixa altitude.');
assert.equal(AGC_SPEC.erasableWords, 2048, 'Modelo didático deve manter orçamento explícito de memória apagável.');
assert.ok(APOLLO_TASKS.some(task => task.critical) && ASSEMBLY_CHALLENGES.length === 3, 'Computador deve possuir tarefas críticas e três desafios.');
assert.ok(APOLLO_TIMELINE.length >= 9 && APOLLO_TIMELINE.every(item => item.source.startsWith('https://')), 'Linha do tempo Apollo deve possuir fontes HTTPS.');
assert.equal(LANDING_SITES.length, 3, 'Fase 6 deve oferecer três locais de pouso.');
assert.equal(LUNAR_CHECKLIST.length, 6, 'Checklist lunar deve possuir seis intertravamentos.');
assert.equal(APOLLO_ALARMS.length, 2, 'Laboratório deve tratar os alarmes 1201 e 1202.');

const lunarModel = new LunarDescentModel({ siteId:'tranquility', assist:true });
assert.equal(lunarModel.start(), true, 'Descida deve iniciar a partir da órbita lunar.');
for (let i = 0; i < 8000 && !['LANDED','CRASHED','ABORTED'].includes(lunarModel.state); i++) lunarModel.step(.1);
assert.equal(lunarModel.state, 'LANDED', 'Perfil assistido nominal deve realizar pouso seguro.');
assert.ok(lunarModel.telemetry().fuelPercent > 0, 'Pouso nominal deve preservar combustível residual.');
const faultyLunar = new LunarDescentModel({ siteId:'tranquility', assist:true });
faultyLunar.start();
for (let i = 0; i < 120; i++) faultyLunar.step(.1);
faultyLunar.injectFault('radar-noise');
assert.notEqual(faultyLunar.telemetry().reportedAltitudeM, faultyLunar.telemetry().altitudeM, 'Ruído no radar deve alterar o canal reportado.');
assert.equal(faultyLunar.resolveFault('radar-noise','cross-check'), true, 'Comparação de sensores deve resolver ruído no radar.');

const surfaceModel = new SurfaceMissionModel();
for (const objective of SURFACE_OBJECTIVES) assert.equal(surfaceModel.complete(objective.id).ok, true, `Objetivo ${objective.id} deve ser executado em sequência.`);
assert.equal(surfaceModel.snapshot().complete, true, 'Missão de superfície deve concluir todos os objetivos.');
assert.ok(surfaceModel.snapshot().samples.length >= 2 && surfaceModel.snapshot().roverKm > 0, 'Superfície deve registrar amostras e deslocamento do rover.');


const workerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./worker-node-harness.mjs', import.meta.url), { type: 'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker de telemetria não respondeu.')); }, 2500);
  worker.on('message', message => {
    if (message.type === 'telemetry') {
      clearTimeout(timeout);
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type: 'quality', payload: { quality: 'performance' } });
  worker.postMessage({ type: 'step' });
});
assert.ok(workerSample.tick === 1 && Number.isFinite(workerSample.altitude), 'Web Worker deve produzir amostra de telemetria serializável.');


const orbitalSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./orbital-worker-node-harness.mjs', import.meta.url), { type: 'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker orbital não respondeu.')); }, 2500);
  worker.on('message', message => {
    if (message.type === 'telemetry') {
      clearTimeout(timeout);
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type: 'configure', payload: { altitudeKm:600, inclinationDeg:97.8 } });
  worker.postMessage({ type: 'step' });
});
assert.ok(Number.isFinite(orbitalSample.latitudeDeg) && Number.isFinite(orbitalSample.batteryPercent), 'Worker orbital deve produzir posição, energia e comunicação serializáveis.');
assert.ok(orbitalSample.station?.name, 'Worker orbital deve encontrar a estação de solo mais próxima.');


const launchWorkerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./launch-worker-node-harness.mjs', import.meta.url), { type: 'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker de lançamento não respondeu.')); }, 3000);
  worker.on('message', message => {
    if (message.type === 'telemetry') {
      clearTimeout(timeout);
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type:'configure', payload: launchSystem.flightConfig });
  worker.postMessage({ type:'step', payload:{ dt:.2 } });
});
assert.ok(launchWorkerSample.state === 'PRELAUNCH' && Number.isFinite(launchWorkerSample.massKg), 'Worker de lançamento deve serializar estado e massa.');


const lunarWorkerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./lunar-worker-node-harness.mjs', import.meta.url), { type: 'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker lunar não respondeu.')); }, 3000);
  worker.on('message', message => {
    if (message.type === 'telemetry') {
      clearTimeout(timeout);
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type:'configure', payload:{ siteId:'tranquility', assist:true } });
  worker.postMessage({ type:'step', payload:{ dt:.2 } });
});
assert.equal(lunarWorkerSample.state, 'ORBIT', 'Worker lunar deve iniciar em órbita antes da separação.');
assert.ok(Number.isFinite(lunarWorkerSample.altitudeM) && Number.isFinite(lunarWorkerSample.fuelPercent), 'Worker lunar deve serializar altitude e combustível.');


const marsGrid = new MarsGrid(DEFAULT_MARS_GRID);
const marsPath = marsGrid.findPath({ x:0, y:11 }, { x:11, y:2 });
assert.equal(marsPath.ok, true, 'A* deve encontrar rota marciana segura.');
assert.ok(marsPath.path.length > 2 && Number.isFinite(marsPath.cost), 'Rota A* deve possuir pontos e custo finito.');
assert.ok(marsPath.path.every(point => marsGrid.typeAt(point.x, point.y) !== 'blocked'), 'Rota não pode atravessar obstáculos bloqueados.');

const marsQueue = new MarsCommandQueue({ oneWaySeconds:5, packetLoss:0, maxSize:4 });
const queuedMars = marsQueue.enqueue({ type:'capture', id:'IMG-01' }, 0, 'normal');
assert.equal(queuedMars.accepted, true, 'Fila marciana deve aceitar comando válido.');
assert.equal(marsQueue.due(4).length, 0, 'Comando não deve chegar antes da latência.');
assert.equal(marsQueue.due(5, () => .99).length, 1, 'Comando deve ser entregue depois da latência.');
assert.equal(marsQueue.enqueue({ type:'capture', id:'IMG-01' }, 6).accepted, false, 'Comando já executado deve ser idempotente.');

const visionLab = new MarsVisionLab();
for (const sample of VISION_SAMPLES) {
  const result = visionLab.classify(sample.features);
  assert.equal(result.label, sample.expected, `Classificador didático deve reconhecer ${sample.id}.`);
  assert.ok(result.confidence >= 48, 'Classificação deve produzir confiança suficiente.');
}

const scienceDb = new ScienceDatabase();
assert.equal(scienceDb.add({ id:'S1', name:'Amostra 1', classification:'basalt', confidence:88, x:2, y:3, massG:22 }).ok, true, 'Banco científico deve aceitar amostra completa.');
assert.equal(scienceDb.add({ id:'S1', classification:'basalt' }).ok, false, 'Banco científico deve rejeitar ID duplicado.');
assert.equal(scienceDb.stats().count, 1, 'Banco deve contabilizar registros.');
assert.ok(scienceDb.export().includes('cosmos-ds-mars-science-v1'), 'Exportação deve declarar esquema de dados.');

const drone = new DroneSystem();
assert.equal(drone.launch().ok, true, 'Drone deve decolar com bateria suficiente.');
assert.equal(drone.survey('A1').ok, true, 'Drone deve mapear setor novo.');
assert.equal(drone.survey('A1').ok, false, 'Drone deve rejeitar setor repetido.');
assert.equal(drone.returnHome().ok, true, 'Drone deve retornar ao rover.');
assert.equal(drone.snapshot().state, 'STOWED', 'Drone deve terminar recolhido.');

const marsModel = new MarsMissionModel({ oneWaySeconds:0, startX:0, startY:11 });
marsModel.start();
const shortRoute = marsGrid.findPath({x:0,y:11},{x:3,y:10}).path;
assert.equal(marsModel.enqueue({ type:'route', path:shortRoute, id:'ROUTE-TEST' }, 'high').accepted, true, 'Modelo deve aceitar rota na fila.');
for (let i=0; i<shortRoute.length+3; i++) marsModel.step(.5);
assert.ok(marsModel.telemetry().distanceM > 0, 'Rover deve percorrer a rota carregada.');
assert.ok(marsModel.telemetry().battery < 100, 'Movimento deve consumir energia.');
marsModel.injectFault('wheel-slip');
assert.ok(marsModel.telemetry().wheelSlip > .5, 'Falha deve elevar patinagem.');
assert.equal(marsModel.resolveFault('wheel-slip','traction-control'), true, 'Controle de tração deve recuperar patinagem.');
assert.equal(MARS_TIMELINE.length >= 7, true, 'Fase 7 deve apresentar evolução da exploração marciana.');
assert.equal(MARS_FAULTS.length, 4, 'Fase 7 deve possuir quatro falhas progressivas.');

const marsWorkerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./mars-worker-node-harness.mjs', import.meta.url), { type:'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker marciano não respondeu.')); }, 3000);
  worker.on('message', message => {
    if (message.type === 'telemetry' && message.payload?.state === 'ACTIVE') {
      clearTimeout(timeout); worker.postMessage({ type:'stop' }); worker.terminate(); resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type:'configure', payload:{ oneWaySeconds:0, startX:0, startY:11 } });
  worker.postMessage({ type:'start' });
});
assert.ok(Number.isFinite(marsWorkerSample.battery) && marsWorkerSample.queue, 'Worker marciano deve serializar energia e fila.');



const stationSystems = new StationSystemsModel();
assert.equal(stationSystems.start(), true, 'Estação deve iniciar operação a partir do standby.');
for (let i=0;i<80;i++) stationSystems.step(.2);
const stationNominal = stationSystems.telemetry();
assert.ok(stationNominal.battery > 50 && stationNominal.co2 < 1, 'Operação nominal deve preservar energia e atmosfera segura.');
assert.equal(stationSystems.injectFault('co2-scrubber'), true, 'Falha do depurador deve ser injetável.');
for (let i=0;i<240;i++) stationSystems.step(.2);
assert.ok(stationSystems.telemetry().co2 > stationNominal.co2, 'Falha deve elevar CO2.');
assert.equal(stationSystems.resolveFault('co2-scrubber','isolate-scrubber'), true, 'Linha redundante deve resolver falha de CO2.');

const docking = new DockingModel({ profileId:'training' });
const dockResult = docking.autoComplete();
assert.equal(dockResult.hardDock, true, 'Perfil assistido deve concluir acoplamento rígido.');
assert.ok(dockResult.alignmentErrorDeg < 3.5, 'Acoplamento deve respeitar alinhamento do perfil.');

const arm = new RoboticArmModel();
for (const task of ARM_TASKS) assert.equal(arm.execute(task.command).ok, true, `Braço deve executar ${task.command} em sequência.`);
assert.equal(arm.snapshot().complete, true, 'Braço deve concluir captura, berço e recolhimento.');

const inventory = new InventorySystem();
for (const task of MAINTENANCE_TASKS.slice(0,2)) assert.equal(inventory.completeTask(task.id).ok, true, `Manutenção ${task.id} deve consumir item rastreado.`);
assert.equal(inventory.snapshot().completed.length, 2, 'Inventário deve registrar duas manutenções.');
assert.ok(inventory.export().includes('cosmos-ds-station-logistics-v1'), 'Exportação logística deve declarar esquema.');
assert.ok(STATION_TIMELINE.length >= 7, 'Fase 8 deve apresentar evolução das estações.');
assert.equal(STATION_FAULTS.length, 4, 'Fase 8 deve possuir quatro falhas progressivas.');

const stationMission = new StationMissionModel({ dockingProfileId:'training' });
stationMission.start();stationMission.command('docking-auto');
const stationSnapshot = stationMission.step(.2);
assert.ok(stationSnapshot.systems && stationSnapshot.docking.hardDock, 'Modelo integrado deve combinar sistemas e acoplamento.');

const stationWorkerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./station-worker-node-harness.mjs', import.meta.url), { type:'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker da estação não respondeu.')); }, 3000);
  worker.on('message', message => {
    if (message.type === 'telemetry' && message.payload?.systems) {
      clearTimeout(timeout); worker.postMessage({ type:'stop' }); worker.terminate(); resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type:'configure', payload:{ dockingProfileId:'training' } });
  worker.postMessage({ type:'start' });
});
assert.ok(Number.isFinite(stationWorkerSample.systems.battery) && stationWorkerSample.docking, 'Worker da estação deve serializar energia e acoplamento.');


const telescope = new TelescopeSystem({ telescopeId:'infrared', targetId:'protostar' });
assert.equal(telescope.compatibility().supported, true, 'Infravermelho deve ser compatível com protoestrela em poeira.');
const beforeAlign = telescope.compatibility().score;
telescope.disturb();
assert.ok(telescope.compatibility().score < beforeAlign, 'Perturbação deve reduzir a qualidade observacional.');
telescope.align();
assert.ok(telescope.snapshot().focus > .7, 'Alinhamento deve recuperar foco.');
const wrongTelescope = new TelescopeSystem({ telescopeId:'optical', targetId:'pulsar' });
assert.equal(wrongTelescope.compatibility().supported, false, 'Óptico não deve ser o canal prioritário para pulsar didático.');

const imagePipeline = new ImagePipeline({ size:24 });
const calibratedFrame = imagePipeline.generate({ scene:'nebula', exposure:120, noise:.12, calibration:true, channels:['R','G','B'] });
const noisyFrame = imagePipeline.generate({ scene:'nebula', exposure:20, noise:.4, calibration:false, channels:['R','G','B'] });
assert.equal(calibratedFrame.data.length, 24*24*3, 'Pipeline deve gerar quadro RGB com dimensão correta.');
assert.ok(calibratedFrame.stats.snr > noisyFrame.stats.snr, 'Exposição e calibração devem melhorar SNR didático.');
assert.equal(imagePipeline.toRgba(calibratedFrame).length, 24*24*4, 'Conversão deve produzir RGBA.');

const spectrum = new SpectrumAnalyzer();
for (const challenge of SPECTRUM_CHALLENGES) {
  const result = spectrum.identify(challenge.sample);
  assert.equal(result.best.id, challenge.answer, `Espectro ${challenge.id} deve identificar ${challenge.answer}.`);
  assert.ok(result.best.score >= 70, 'Identificação espectral deve produzir confiança suficiente.');
}

const observationDb = new ObservationDatabase();
assert.equal(observationDb.add({ id:'OBS-001', targetId:'nebula', telescopeId:'optical', filters:['R','G','B'], exposure:60, snr:3.4 }).ok, true, 'Banco deve aceitar observação completa.');
assert.equal(observationDb.add({ id:'OBS-001', targetId:'galaxy' }).ok, false, 'Banco deve rejeitar ID duplicado.');
assert.equal(observationDb.stats().count, 1, 'Banco deve contabilizar observações.');
assert.ok(observationDb.export().includes('cosmos-ds-observatory-v1'), 'Exportação deve declarar esquema do observatório.');
assert.ok(OBSERVATORY_TIMELINE.length >= 5 && OBSERVATORY_TIMELINE.every(item => item.source.startsWith('https://')), 'Linha do tempo deve possuir fontes oficiais HTTPS.');
assert.equal(TELESCOPES.length, 4, 'Laboratório deve oferecer quatro famílias de telescópio.');
assert.ok(TARGETS.length >= 8, 'Planetário deve oferecer alvos diversos.');
assert.equal(OBSERVATION_CHALLENGES.length, 4, 'Seleção instrumental deve possuir quatro desafios.');

const observatoryWorkerSample = await new Promise((resolve, reject) => {
  const worker = new NodeWorker(new URL('./observatory-worker-node-harness.mjs', import.meta.url), { type:'module' });
  const timeout = setTimeout(() => { worker.terminate(); reject(new Error('Worker do observatório não respondeu.')); }, 3000);
  worker.on('message', message => {
    if (message.type === 'frame') {
      clearTimeout(timeout); worker.terminate(); resolve(message.payload);
    }
  });
  worker.on('error', error => { clearTimeout(timeout); reject(error); });
  worker.postMessage({ type:'quality', payload:{ quality:'performance' } });
  worker.postMessage({ type:'process', payload:{ scene:'galaxy', exposure:80, noise:.15, calibration:true, channels:['R','G','B'] } });
});
assert.equal(observatoryWorkerSample.size, 32, 'Worker deve adaptar resolução ao perfil de desempenho.');
assert.ok(Number.isFinite(observatoryWorkerSample.stats.snr) && observatoryWorkerSample.data.length === 32*32*3, 'Worker deve serializar imagem e métricas.');



const template = MISSION_TEMPLATES[0];
assert.ok(MISSION_TEMPLATES.length >= 7 && MISSION_MODULES.length >= 8, 'Fase 10 deve oferecer templates e módulos suficientes.');
assert.ok(CONTROL_ACTIONS.length >= 8, 'Mapa de controles deve cobrir ações essenciais.');
assert.throws(() => MissionPlan.fromTemplate(template, { durationMinutes:24 }), /25/, 'Missão deve bloquear duração abaixo de 25 minutos.');
const teacherPlan = MissionPlan.fromTemplate(template, { id:'TEST-MISSION', title:'Missão Teste DS', durationMinutes:25, teacherCode:'ABCD12', classroomUrl:'https://classroom.google.com/test' });
assert.equal(teacherPlan.checkpoints.length, template.checkpoints.length, 'Plano deve preservar checkpoints do template.');
assert.equal(MissionPlan.fromJSON(teacherPlan.toJSON()).teacherCode, 'ABCD12', 'Plano deve ser serializável.');

const missionRepository = new MissionRepository(storage, profiles.active().id);
missionRepository.savePlan(teacherPlan);
assert.equal(missionRepository.listPlans().length, 1, 'Repositório deve persistir plano por perfil.');
assert.equal(missionRepository.getPlan('TEST-MISSION').title, 'Missão Teste DS', 'Repositório deve recuperar plano por ID.');

const guided = new GuidedSession(teacherPlan, { profileId:profiles.active().id });
let guidedTime = 1000;
assert.equal(guided.start(guidedTime), true, 'Sessão guiada deve iniciar.');
for (let minute=0; minute<25; minute++) { guidedTime += 60000; guided.activity('heartbeat', { minute }, guidedTime); }
for (const checkpoint of teacherPlan.checkpoints) assert.equal(guided.completeCheckpoint(checkpoint.id, `Evidência ${checkpoint.id}`, ++guidedTime).ok, true, 'Checkpoint deve concluir em sequência.');
assert.ok(guided.activeMs >= 25*60000, 'Sessão deve contabilizar pelo menos 25 minutos ativos.');
assert.equal(guided.canFinish().ok, true, 'Sessão completa e com tempo mínimo deve poder finalizar.');
assert.equal(guided.finish(++guidedTime).ok, true, 'Sessão deve finalizar com requisitos atendidos.');
missionRepository.saveSession(guided.snapshot());
assert.equal(missionRepository.latestSession().state, 'COMPLETED', 'Repositório deve persistir sessão finalizada.');

const early = new GuidedSession(teacherPlan, { profileId:profiles.active().id });
early.start(1000);
for (const checkpoint of teacherPlan.checkpoints) early.completeCheckpoint(checkpoint.id, 'Evidência', 2000 + checkpoint.order);
assert.equal(early.canFinish().ok, false, 'Tempo insuficiente deve bloquear conclusão.');
assert.equal(early.authorizeEarlyRelease({ code:'XXXX', reason:'Motivo de teste válido.' }).ok, false, 'Código incorreto deve bloquear liberação.');
assert.equal(early.authorizeEarlyRelease({ code:'ABCD12', reason:'Autorização pedagógica registrada para teste.' }).ok, true, 'Código e motivo devem autorizar liberação antecipada.');
assert.equal(early.finish(4000).ok, true, 'Liberação antecipada deve permitir conclusão com checkpoints completos.');

const idle = new GuidedSession(teacherPlan, { profileId:'idle' });
idle.start(0); idle.tick(180001); idle.tick(360001); idle.tick(540001);
assert.equal(idle.idleWarnings, 3, 'Sessão deve registrar três avisos de inatividade.');
assert.equal(idle.state, 'TERMINATED', 'Sessão deve encerrar após o terceiro aviso.');

const evidenceBuilder = new EvidenceBuilder();
const evidence = evidenceBuilder.build({ profile:profiles.active(), plan:teacherPlan, session:guided, quality:'balanced' });
assert.equal(evidence.schema, 'cosmos-ds-evidence-v1', 'Evidência deve declarar esquema.');
assert.equal(evidence.checkpoints.every(item => item.status === 'completed'), true, 'Evidência deve registrar checkpoints concluídos.');
assert.match(evidence.validationCode, /^[A-F0-9]{8}$/, 'Evidência deve possuir código de validação.');
assert.ok(evidenceBuilder.toHtml(evidence).includes('COSMOS DS'), 'Relatório HTML deve ser gerado.');

const xr = new XRSupportService({ xr:{ isSessionSupported: async mode => mode === 'immersive-vr' } }, true);
const xrResult = await xr.detect();
assert.equal(xrResult.immersiveVR, true, 'Diagnóstico WebXR deve detectar VR suportado.');
assert.equal(xrResult.immersiveAR, false, 'Diagnóstico WebXR deve diferenciar modos não suportados.');

const backupService = new ProfileBackupService();
const backup = backupService.create({ profileStore:profiles, settingsStore:settings });
assert.equal(backup.schema, 'cosmos-ds-backup-v1', 'Backup deve declarar esquema.');
assert.equal(backupService.validate(backup), true, 'Backup válido deve ser aceito.');
settings.update({ highContrast:true, largeText:true, captions:true, simplifiedControls:true });
assert.equal(settings.get().highContrast, true, 'Configurações de acessibilidade devem persistir.');
const profileSnapshot = profiles.exportSnapshot();
assert.equal(profileSnapshot.schema, 'cosmos-ds-profiles-v1', 'Perfis devem ser exportáveis.');
profiles.importSnapshot(profileSnapshot);
assert.ok(profiles.list().length >= 2, 'Importação de perfis deve preservar dados existentes.');

const diagnosticStorage = new MemoryStorage();
const diagnostic = await new StorageDiagnostics({ storage:{ estimate:async()=>({usage:1024,quota:2048}), persisted:async()=>true } }, diagnosticStorage).run('diag');
assert.equal(diagnostic.writable, true, 'Diagnóstico deve confirmar escrita local.');
assert.equal(diagnostic.persisted, true, 'Diagnóstico deve ler persistência da Storage API.');



assert.equal(SOLAR_BODIES.length, 10, 'Remaster deve representar Sol, oito planetas e Lua.');
assert.equal(ORBITAL_FLEET.length, 6, 'Frota orbital deve possuir seis satélites e estações didáticas.');
assert.ok(SOLAR_BODIES.every(body => body.colors.length === 3 && body.radius > 0), 'Todo corpo deve possuir material procedural e escala visual.');
assert.ok(BODY_BY_ID.earth.atmosphereStrength > 0 && BODY_BY_ID.saturn.rings, 'Terra deve possuir atmosfera e Saturno deve possuir anéis.');
assert.ok(SOLAR_TOUR.includes('earth') && SOLAR_TOUR.includes('saturn'), 'Tour cinematográfico deve incluir mundos essenciais.');
const solarNav = new SolarNavigationModel({ targetId:'earth' });
assert.equal(solarNav.selectTarget('mars',4.2), true, 'Navegação deve aceitar novo alvo.');
for(let i=0;i<140;i++)solarNav.update(1/60,{lookX:.15,lookY:.02,zoom:0});
assert.equal(solarNav.snapshot().targetId,'mars','Navegação deve preservar o alvo selecionado.');
assert.ok(solarNav.snapshot().visited.includes('mars'),'Visita planetária deve ser registrada.');
solarNav.setCameraMode('free');
const beforeFree={...solarNav.snapshot().freePosition};
for(let i=0;i<60;i++)solarNav.update(1/60,{forward:1,strafe:.2,lift:.1,lookX:.02,lookY:0,boost:true});
const afterFree=solarNav.snapshot().freePosition;
assert.ok(Math.hypot(afterFree.x-beforeFree.x,afterFree.y-beforeFree.y,afterFree.z-beforeFree.z)>1,'Voo livre deve deslocar a câmera.');
assert.equal(solarNav.cycleCamera(),'cinematic','Ciclo de câmera deve alcançar modo cinematográfico.');
assert.equal(solarNav.togglePhotoMode(),true,'Modo foto deve ser alternável.');



assert.equal(IMMERSIVE_VEHICLES.length, 4, 'Remaster de lançamento deve oferecer quatro veículos.');
assert.ok(IMMERSIVE_VEHICLES.some(vehicle => vehicle.id === 'horizon-sts' && vehicle.variant === 3), 'Frota deve incluir ônibus espacial didático.');
assert.equal(LAUNCH_CAMERA_PRESETS.length, 8, 'Experiência deve oferecer oito posições de câmera.');
assert.equal(IMMERSIVE_INSPECTIONS.length, 4, 'Liberação deve exigir quatro inspeções visuais.');
for (const vehicle of IMMERSIVE_VEHICLES) {
  const summary = new RocketSystem(vehicle.config).summary();
  assert.equal(summary.validation.ok, true, `${vehicle.name} deve possuir configuração de voo válida.`);
}
const launchExperience = new LaunchExperienceModel({ vehicleId:'atlas-h' });
assert.equal(launchExperience.setCamera('engine'), true, 'Câmera de motores deve existir.');
assert.equal(launchExperience.completeInspection('engines').ok, true, 'Inspeção deve validar na câmera correta.');
assert.equal(launchExperience.completeInspection('hull').ok, false, 'Inspeção deve bloquear câmera incorreta.');
for (const inspection of IMMERSIVE_INSPECTIONS) { launchExperience.setCamera(inspection.camera); assert.equal(launchExperience.completeInspection(inspection.id).ok, true); }
assert.equal(launchExperience.inspectionReady(), true, 'Quatro inspeções devem liberar o lançamento.');
launchExperience.record({ state:'COUNTDOWN', elapsed:1, altitudeM:0 });
launchExperience.record({ state:'ASCENT_STAGE_1', elapsed:20, altitudeM:1200 });
assert.equal(launchExperience.replay.length, 2, 'Replay deve registrar telemetria.');
assert.equal(launchExperience.setReplayIndex(0).state, 'COUNTDOWN', 'Replay deve permitir navegação temporal.');
assert.equal(launchExperience.selectVehicle('horizon-sts'), true, 'Ônibus espacial deve ser selecionável.');
assert.equal(launchExperience.snapshot().inspectionReady, false, 'Trocar veículo deve reiniciar inspeções.');
assert.equal(VEHICLE_BY_ID['phoenix-r'].config.recovery, true, 'Veículo reutilizável deve preservar reserva de recuperação.');



assert.equal(STATION_VARIANTS.length,4,'Remaster da estação deve oferecer quatro arquiteturas orbitais.');
assert.equal(ORBITAL_VEHICLES.length,4,'Frota orbital deve oferecer quatro veículos.');
assert.ok(ORBITAL_VEHICLES.some(vehicle=>vehicle.id==='orbital-shuttle'),'Frota deve incluir ônibus espacial didático.');
assert.equal(ORBITAL_SATELLITES.length,4,'Laboratório deve oferecer quatro famílias de satélite.');
assert.equal(STATION_CAMERA_PRESETS.length,11,'Experiência deve oferecer onze câmeras internas e externas.');
assert.equal(STATION_INSPECTIONS.length,5,'Certificação visual deve exigir cinco inspeções.');
const stationExperience=new StationRemasterExperience();
assert.equal(stationExperience.setCamera('docking-port'),true,'Câmera de acoplamento deve existir.');
assert.equal(stationExperience.completeInspection('docking').ok,true,'Inspeção de acoplamento deve validar na câmera correta.');
assert.equal(stationExperience.completeInspection('structure').ok,false,'Inspeção deve bloquear câmera incorreta.');
for(const inspection of STATION_INSPECTIONS){stationExperience.setCamera(inspection.camera);assert.equal(stationExperience.completeInspection(inspection.id).ok,true);}
assert.equal(stationExperience.snapshot().inspectionReady,true,'Cinco inspeções devem concluir a validação visual.');
assert.equal(stationExperience.selectStation('ring-alpha'),true,'Estação conceitual deve ser selecionável.');
assert.equal(stationExperience.selectVehicle('orbital-shuttle'),true,'Ônibus espacial deve ser selecionável.');
assert.equal(stationExperience.selectSatellite('space-telescope'),true,'Telescópio espacial deve ser selecionável.');
const orbitalFlight=new OrbitalFlightModel({vehicleId:'crew-capsule',fuelKg:520});
orbitalFlight.step(.5,{forward:1,strafe:.3,lift:.2,yaw:.1,pitch:.1,roll:.1});
assert.ok(orbitalFlight.telemetry().relativeSpeed>0,'Comandos 6DOF devem produzir velocidade relativa.');
assert.ok(orbitalFlight.telemetry().fuelPercent<100,'Propulsores RCS devem consumir combustível.');
orbitalFlight.reset();orbitalFlight.setAutopilot(true);for(let i=0;i<6000&&!orbitalFlight.docked&&!orbitalFlight.collision;i++)orbitalFlight.step(.02,{});
assert.equal(orbitalFlight.telemetry().docked,true,'Piloto automático deve concluir acoplamento dentro do envelope seguro.');
assert.ok(orbitalFlight.telemetry().alignmentErrorDeg<4.5,'Acoplamento deve preservar alinhamento seguro.');
const orbitalFlightWorkerSample=await new Promise((resolve,reject)=>{const worker=new NodeWorker(new URL('./orbital-flight-worker-node-harness.mjs',import.meta.url),{type:'module'});const timeout=setTimeout(()=>{worker.terminate();reject(new Error('Worker 6DOF não respondeu.'));},3000);worker.on('message',message=>{if(message.type==='telemetry'){clearTimeout(timeout);worker.postMessage({type:'stop'});worker.terminate();resolve(message.payload);}});worker.on('error',error=>{clearTimeout(timeout);reject(error);});worker.postMessage({type:'configure',payload:{vehicleId:'crew-capsule',fuelKg:520}});worker.postMessage({type:'step',payload:{dt:.2,input:{forward:1,roll:.2}}});});
assert.ok(Number.isFinite(orbitalFlightWorkerSample.distanceM)&&Number.isFinite(orbitalFlightWorkerSample.fuelPercent),'Worker 6DOF deve serializar distância, orientação e combustível.');


assert.equal(PLANETARY_WORLDS.length,2);assert.ok(PLANETARY_VEHICLES.some(x=>x.id==='lunar-rover')&&PLANETARY_VEHICLES.some(x=>x.id==='mars-drone'));assert.ok(PLANETARY_CAMERAS.length>=8);assert.equal(PLANETARY_MISSIONS.moon.length,4);assert.equal(PLANETARY_MISSIONS.mars.length,4);
const lunarExplore=new PlanetaryExplorationModel({worldId:'moon'});assert.equal(lunarExplore.setVehicle('lunar-rover'),true);for(let i=0;i<1200;i++)lunarExplore.step({forward:1,boost:true},.05);assert.ok(lunarExplore.telemetry().distanceKm>1.2);assert.ok(lunarExplore.telemetry().completed.includes('moon-rover'));assert.equal(lunarExplore.collectSample().ok,true);assert.equal(lunarExplore.collectSample().ok,true);assert.ok(lunarExplore.telemetry().completed.includes('moon-sample'));assert.equal(lunarExplore.inspectModule(),true);assert.equal(lunarExplore.installBeacon(),true);
const marsExplore=new PlanetaryExplorationModel({worldId:'mars'});assert.equal(marsExplore.setVehicle('mars-rover'),true);assert.equal(marsExplore.collectSample().ok,false);assert.equal(marsExplore.deployArm(),true);assert.equal(marsExplore.collectSample().ok,true);assert.equal(marsExplore.injectStorm(),true);assert.equal(marsExplore.recoverStorm(),true);assert.equal(marsExplore.setVehicle('mars-drone'),true);for(let i=0;i<3;i++){marsExplore.position.x+=30;marsExplore.position.z+=24;assert.equal(marsExplore.mapSector().ok,true);}assert.equal(marsExplore.telemetry().mappedSectors,3);assert.ok(marsExplore.telemetry().completed.includes('mars-drone'));


assert.equal(COSMIC_DESTINATIONS.length,8,'Universo Profundo deve oferecer oito destinos cósmicos.');
assert.equal(DEEP_SPACE_CAMERAS.length,4,'Universo Profundo deve oferecer quatro modos de câmera.');
assert.equal(COSMIC_TOUR.length,7,'Rota cósmica deve possuir sete objetivos principais.');
assert.ok(COSMIC_DESTINATIONS.some(item=>item.id==='black-hole')&&COSMIC_DESTINATIONS.some(item=>item.id==='galaxy-cluster'),'Rota deve incluir buraco negro e aglomerado de galáxias.');
const deepSpace=new DeepSpaceNavigationModel({destinationId:'stellar-nursery'});
assert.equal(deepSpace.selectDestination('black-hole'),true,'Navegação deve aceitar destino cósmico.');
for(let i=0;i<140;i++)deepSpace.update(1/60,{lookX:.12,lookY:.02});
assert.ok(deepSpace.snapshot().visited.includes('black-hole'),'Destino visitado deve ser registrado.');
assert.equal(deepSpace.scan().destinationId,'black-hole','Scan deve catalogar o destino atual.');
deepSpace.setCameraMode('free');const deepBefore={...deepSpace.snapshot().position};
for(let i=0;i<120;i++)deepSpace.update(1/60,{forward:1,strafe:.2,lift:.1,boost:true});
const deepAfter=deepSpace.snapshot().position;assert.ok(Math.hypot(deepAfter.x-deepBefore.x,deepAfter.y-deepBefore.y,deepAfter.z-deepBefore.z)>3,'Voo interestelar deve deslocar a câmera.');
assert.equal(deepSpace.setCameraMode('telescope'),true,'Modo telescópio deve estar disponível.');
assert.equal(deepSpace.togglePhotoMode(),true,'Modo foto cósmico deve ser alternável.');

assert.equal(MUSEUM_ZONES.length,4,'Museu Visual deve possuir quatro galerias.');
assert.equal(MUSEUM_EXHIBITS.length,12,'Museu Visual deve possuir doze peças.');
assert.equal(MUSEUM_CAMERAS.length,4,'Museu deve oferecer primeira pessoa, 360°, interior e cinematográfica.');
assert.equal(MUSEUM_MISSIONS.length,5,'Museu deve possuir cinco objetivos progressivos.');
assert.ok(MUSEUM_EXHIBITS.some(item=>item.type==='shuttle'&&item.interior),'Museu deve conter ônibus espacial com interior.');
assert.ok(MUSEUM_EXHIBITS.some(item=>item.type==='station'&&item.interior),'Museu deve conter estação modular com interior.');
const museum=new MuseumExperienceModel();
const shuttle=MUSEUM_EXHIBITS.find(item=>item.type==='shuttle');
assert.equal(museum.selectExhibit(shuttle),true,'Museu deve selecionar uma peça.');
assert.equal(museum.inspect(),1,'Inspeção 360° deve ser registrada.');
assert.equal(museum.openInterior(shuttle.interior),true,'Peça com interior deve permitir entrada.');
assert.equal(museum.activateAnimation(),1,'Mecanismo da peça deve ser animável.');
museum.selectZone('robotics');museum.selectZone('orbital');museum.selectZone('launch');museum.selectZone('crew');
assert.equal(museum.progress().zones,4,'Visitas às quatro galerias devem ser registradas.');
museum.setCameraMode('walk');const museumBefore={...museum.snapshot().position};for(let i=0;i<120;i++)museum.update(1/60,{forward:1,strafe:.1,lookX:.01});const museumAfter=museum.snapshot().position;assert.ok(Math.hypot(museumAfter.x-museumBefore.x,museumAfter.z-museumBefore.z)>1,'Caminhada em primeira pessoa deve deslocar o visitante.');



const candidateList=resourceCandidates('./public/assets/premium/manifest.json',{baseUrl:'https://example.test/repo/public/assets/premium/manifest.json'});
assert.ok(candidateList.some(url=>url.endsWith('/public/assets/premium/manifest.json')),'Resolvedor deve localizar o manifesto a partir da raiz do projeto.');
assert.ok(projectBaseUrl.endsWith('/'),'Raiz de assets deve ser uma URL de diretório.');

const premiumManifest=JSON.parse(await readFile(resolve(import.meta.dirname,'../public/assets/premium/manifest.json'),'utf8'));
assert.equal(premiumManifest.schema,'cosmos-ds-premium-assets-v2','Manifesto premium deve declarar esquema animado v2.');
assert.equal(premiumManifest.assets.length,8,'Pipeline premium deve possuir oito assets.');
assert.equal(PREMIUM_RENDER_MODES.length,4,'Laboratório premium deve possuir quatro modos de material.');
assert.equal(PREMIUM_INSPECTION_GOALS.length,8,'Laboratório premium deve possuir oito objetivos gráficos, de rig e interação.');
for(const asset of premiumManifest.assets){
  assert.equal(asset.lods.length,3,`${asset.id} deve possuir três LODs.`);
  assert.ok(asset.animations?.length>=1,`${asset.id} deve declarar animações.`);
  assert.ok(asset.colliders?.length>=1,`${asset.id} deve declarar colliders.`);
  let previous=0;
  for(const lod of asset.lods){
    const bytes=await readFile(resolve(import.meta.dirname,'..',lod.url.replace(/^\.\//,'')));
    const parsed=GlbGeometryParser.parse(bytes),scene=GlbSceneParser.parse(bytes);
    assert.ok(parsed.vertices>0&&parsed.triangles>0,`${asset.id} LOD ${lod.level} deve preservar primitive principal.`);
    assert.equal(scene.triangles,lod.triangles,`${asset.id} LOD ${lod.level} deve corresponder aos triângulos declarados.`);
    assert.equal(scene.vertices,lod.vertices,`${asset.id} LOD ${lod.level} deve corresponder aos vértices declarados.`);
    assert.ok(scene.parts>=4,`${asset.id} deve possuir múltiplas peças.`);
    assert.ok(scene.animations.length>=1,`${asset.id} deve possuir animações glTF.`);
    assert.ok(scene.triangles>=previous,`${asset.id} deve aumentar ou preservar complexidade entre LODs.`);previous=scene.triangles;
  }
}
for(const environment of premiumManifest.environments){const bytes=await readFile(resolve(import.meta.dirname,'..',environment.url.replace(/^\.\//,'')));const parsed=HdrEnvironmentParser.parse(bytes);assert.ok(parsed.width>0&&parsed.height>0&&parsed.pixels.some(value=>value>1),`${environment.id} deve conter faixa HDR.`);}
const premiumManager=new PremiumAssetManager({settingsStore:{getProfile:()=>({id:'performance'})}});premiumManager.manifest=premiumManifest;
assert.equal(premiumManager.resolveLod(premiumManifest.assets[0],'auto').level,0,'Perfil desempenho deve escolher LOD 0.');
premiumManager.settingsStore={getProfile:()=>({id:'balanced'})};assert.equal(premiumManager.resolveLod(premiumManifest.assets[0],'auto').level,1,'Perfil equilibrado deve escolher LOD 1.');
premiumManager.settingsStore={getProfile:()=>({id:'experience'})};assert.equal(premiumManager.resolveLod(premiumManifest.assets[0],'auto').level,2,'Perfil experiência deve escolher LOD 2.');
const packCache=new AssetPackCache();assert.equal(packCache.urlsFor(premiumManifest.assets[0],premiumManifest.environments[0]).length,6,'Pacote offline deve incluir três LODs, duas texturas e HDR.');


assert.deepEqual(PREMIUM_INTEGRATION_MODULES,['launch-remaster','station-remaster','planetary-remaster','visual-museum'],'Integração premium deve cobrir quatro laboratórios imersivos.');
assert.equal(resolvePremiumIntegration('launch-remaster',{assetKey:'horizon-sts',cameraKey:'interior'}).assetId,'shuttle','Ônibus espacial deve carregar GLB shuttle.');
assert.equal(resolvePremiumIntegration('launch-remaster',{assetKey:'atlas-h',cameraKey:'engine'}).assetId,'rocket','Foguetes devem carregar GLB rocket.');
assert.equal(resolvePremiumIntegration('station-remaster',{cameraKey:'station-orbit',vehicleKey:'crew-capsule'}).assetId,'station','Visão externa deve priorizar estação premium.');
assert.equal(resolvePremiumIntegration('station-remaster',{cameraKey:'cockpit',vehicleKey:'crew-capsule'}).assetId,'capsule','Cabine deve priorizar cápsula premium.');
assert.equal(resolvePremiumIntegration('station-remaster',{cameraKey:'satellite-chase',satelliteKey:'space-telescope'}).assetId,'satellite','Perseguição deve usar satélite premium.');
assert.equal(resolvePremiumIntegration('planetary-remaster',{worldKey:'moon',vehicleKey:'astronaut',cameraKey:'module-interior'}).assetId,'lander','Interior lunar deve carregar módulo lunar premium.');
assert.equal(resolvePremiumIntegration('planetary-remaster',{worldKey:'mars',vehicleKey:'mars-rover',cameraKey:'vehicle'}).assetId,'rover','Marte deve carregar rover premium.');
assert.equal(resolvePremiumIntegration('visual-museum',{assetKey:'spacesuit',cameraKey:'orbit'}).assetId,'suit','Museu deve mapear traje para GLB premium.');
assert.equal(resolvePremiumIntegration('visual-museum',{assetKey:'modular-station',cameraKey:'orbit'}).assetId,'station','Museu deve mapear estação para GLB premium.');
const rocketBytes=await readFile(resolve(import.meta.dirname,'../public/assets/premium/models/rocket-lod2.glb'));
const rocketScene=GlbSceneParser.parse(rocketBytes);
const animationPlayer=new GltfAnimationPlayer(rocketScene);
assert.ok(animationPlayer.play('stage-separation'),'Player deve localizar a animação de separação.');
const animatedTransforms=animationPlayer.update(1);
assert.ok(animatedTransforms.size>0,'Animação deve produzir transformações de nós.');
const colliderSystem=new PremiumColliderSystem(rocketScene);
assert.ok(colliderSystem.list().length>=1,'Asset animado deve possuir collider simplificado.');
assert.ok(colliderSystem.interactions().some(item=>item.action==='stage-separation'),'Asset deve expor ponto de interação de separação.');
const interactionSystem=new InteriorInteractionSystem(rocketScene);
const interactionItems=interactionSystem.list();
assert.ok(interactionItems.length>=1,'Sistema de interiores deve listar hotspots do GLB.');
assert.ok(interactionSystem.activate(0)?.node>=0,'Hotspot deve ativar um componente válido.');
const fakeRenderer={animationList:()=>['Open Hatch'],playAnimation:name=>name==='Open Hatch'};
const telemetryBridge=new TelemetryAnimationBridge(fakeRenderer);
assert.equal(telemetryBridge.update({hatchOpen:true}),'Open Hatch','Telemetria deve acionar animação compatível.');

assert.equal(resolvePremiumIntegration('launch-remaster',{assetKey:'atlas-h',cameraKey:'booster'}).animation,'stage-separation','Câmera de booster deve acionar separação glTF.');
assert.equal(resolvePremiumIntegration('station-remaster',{cameraKey:'robotic-arm'}).animation,'arm-capture','Câmera do braço deve acionar rig da estação.');
assert.equal(resolvePremiumIntegration('planetary-remaster',{worldKey:'mars',vehicleKey:'mars-rover',cameraKey:'vehicle'}).animation,'drive','Rover deve animar as rodas durante a condução.');




assert.equal(CINEMATIC_SCENES.length,5,'Fase 20 deve oferecer cinco ambientes cinematográficos.');
assert.equal(CINEMATIC_FEATURES.length,8,'Pipeline cinematográfico deve declarar oito recursos.');
assert.equal(CINEMATIC_GOALS.length,4,'Estúdio cinematográfico deve possuir quatro objetivos.');
const cinematic=new CinematicPostProcessController('balanced');
assert.ok(cinematic.budget().estimatedGpuMs>0,'Pipeline deve estimar custo de GPU.');
assert.equal(cinematic.setCinema(true).cinema,true,'Modo cinema deve ser ativável.');
const exposureBefore=cinematic.snapshot().exposure;cinematic.updateTelemetry({luminance:.1,speed:12,danger:.5});
assert.ok(cinematic.snapshot().exposure>exposureBefore,'Exposição automática deve reagir à luminância.');
cinematic.setProfile('performance');assert.ok(cinematic.snapshot().steps<60&&cinematic.snapshot().particles<.5,'Perfil desempenho deve reduzir passos e partículas.');

assert.equal(PHYSICS_ENVIRONMENTS.length,6,'Fase 21 deve oferecer seis ambientes físicos.');
assert.equal(CONTROL_PRESETS.length,3,'Fase 21 deve oferecer três presets de controle.');
assert.equal(PHYSICS_GOALS.length,4,'Fase 21 deve possuir quatro objetivos.');
const moonPhysics=new UnifiedPhysicsController('moon');
moonPhysics.update(.016,{jump:true});for(let i=0;i<60;i++)moonPhysics.update(.016,{});
assert.ok(moonPhysics.snapshot().position.y>1.8,'Gravidade lunar deve permitir salto prolongado.');
const flightPhysics=new UnifiedPhysicsController('flight');for(let i=0;i<200;i++)flightPhysics.update(.016,{forward:1,right:.3,up:.2,roll:.15,boost:true});
assert.ok(flightPhysics.snapshot().distance>5&&flightPhysics.snapshot().fuel<100,'Voo 6DOF deve deslocar e consumir RCS.');
const roverPhysics=new UnifiedPhysicsController('rover');for(let i=0;i<1200;i++)roverPhysics.update(.016,{forward:1,lookX:.05});
assert.ok(roverPhysics.snapshot().distance>50&&roverPhysics.snapshot().suspension.length===6,'Rover deve registrar percurso e seis suspensões.');

assert.equal(INTEGRATED_CAMPAIGNS.length,3,'Fase 22 deve oferecer campanhas de Lua, Marte e estação.');
assert.ok(INTEGRATED_CAMPAIGNS.every(c=>c.stages.length>=6),'Cada campanha deve possuir pelo menos seis etapas.');
assert.equal(CAMPAIGN_GOALS.length,4,'Campanhas devem possuir quatro objetivos globais.');
const campaignStorage=new MemoryStorage();const director=new CampaignDirector(INTEGRATED_CAMPAIGNS,{storage:campaignStorage,profileId:'test'});
assert.equal(director.start('lunar-expedition'),true,'Campanha lunar deve iniciar.');
const fault=director.injectEvent('sensor-drift','high');assert.equal(fault.resolved,false,'Evento deve iniciar pendente.');
assert.equal(director.resolveEvent('sensor-drift','cross-validate'),true,'Procedimento deve resolver evento.');
for(let i=0;i<INTEGRATED_CAMPAIGNS[0].stages.length;i++)assert.equal(director.completeStage({quality:1}).ok,true,'Etapa de campanha deve ser concluída em ordem.');
assert.equal(director.snapshot().status,'completed','Campanha completa deve finalizar.');
assert.equal(director.evidence().schema,'cosmos-ds-campaign-v1','Campanha deve gerar evidência versionada.');

assert.equal(Object.keys(QUALITY_PACKS).length,3,'Fase 23 deve oferecer três pacotes gráficos.');
assert.equal(QA_DEVICE_PROFILES.length,4,'QA deve possuir quatro perfis de dispositivo.');
assert.equal(QA_CHECKLIST.length,8,'QA deve possuir oito verificações de aceite.');
assert.equal(QA_GOALS.length,4,'QA deve possuir quatro objetivos.');
const budget=new PerformanceBudgetManager('balanced');for(let i=0;i<8;i++)budget.sample({fps:28,frameMs:35,triangles:500000,drawCalls:260,textureMb:260,memoryMb:980});
assert.equal(budget.diagnostics().recommendation,'light','Carga excessiva deve recomendar pacote leve.');
assert.ok(budget.diagnostics().dynamicScale<QUALITY_PACKS.balanced.renderScale,'Resolução dinâmica deve cair sob carga.');
const buffers={a:new TextEncoder().encode('asset-a').buffer,b:new TextEncoder().encode('asset-b').buffer};
const fetcher=async url=>({ok:true,status:200,arrayBuffer:async()=>buffers[url]});const streaming=new AssetStreamingManager({concurrency:1,fetcher});
const loaded=await streaming.request('a',{priority:2,group:'mission'});assert.ok(loaded.bytes>0,'Streaming deve carregar asset.');
await streaming.request('b',{priority:1,group:'mission'});assert.equal(streaming.snapshot().cached,2,'Streaming deve manter cache controlado.');
assert.ok(streaming.releaseGroup('mission')>0&&streaming.snapshot().cached===0,'Streaming deve liberar grupo de assets.');



assert.equal(SPACE_KNOWLEDGE.length,21,'C1.1 deve oferecer vinte e um itens iniciais de conhecimento.');
assert.ok(Object.keys(KNOWLEDGE_SOURCES).length>=8,'C1.1 deve registrar fontes oficiais.');
const knowledgeEngine=new KnowledgeEngine(SPACE_KNOWLEDGE,KNOWLEDGE_SOURCES);
assert.equal(knowledgeEngine.search('Marte').some(item=>item.id==='mars'),true,'Busca deve localizar Marte por nome.');
assert.equal(knowledgeEngine.search('visão computacional').some(item=>item.id==='mars'||item.id==='rover-tech'||item.id==='perseverance'),true,'Busca deve indexar tecnologias e desafios.');
assert.ok(knowledgeEngine.search('',{type:'technology'}).length>=5,'Filtro por tecnologia deve funcionar.');
assert.ok(knowledgeEngine.related('earth').some(item=>item.id==='moon'),'Relacionamentos devem conectar Terra e Lua.');
assert.ok(knowledgeEngine.sourcesFor('earth').every(source=>source.type==='official'),'Fontes da Terra devem ser oficiais.');
const comparison=knowledgeEngine.compare(['earth','moon','mars']);
assert.equal(comparison.items.length,3,'Comparador deve aceitar três itens.');
assert.ok(comparison.metrics.some(metric=>metric.key==='gravidade'),'Comparador deve reunir métricas comuns.');
const knowledgeStorage=new JsonStorage('cosmos-knowledge-test');
const knowledgeProfile=new KnowledgeProfileStore(knowledgeStorage,'student-1');
assert.equal(knowledgeProfile.discover('earth'),true,'Primeira descoberta deve ser inédita.');
assert.equal(knowledgeProfile.discover('earth'),false,'Descoberta repetida deve ser idempotente.');
knowledgeProfile.toggleFavorite('mars');assert.equal(knowledgeProfile.isFavorite('mars'),true,'Favorito deve persistir.');
knowledgeProfile.toggleComparison('earth');knowledgeProfile.toggleComparison('moon');knowledgeProfile.toggleComparison('mars');knowledgeProfile.toggleComparison('jupiter');
assert.deepEqual(knowledgeProfile.snapshot().comparison,['moon','mars','jupiter'],'Comparador deve manter no máximo três itens recentes.');
const catalog=JSON.parse(await readFile(resolve(import.meta.dirname,'../public/data/knowledge/catalog.json'),'utf8'));
assert.equal(catalog.schema,'cosmos-ds-knowledge-catalog-v1','Catálogo público deve possuir esquema versionado.');

const adaptive = new AdaptiveQualityController(settings, bus);
adaptive.lastAdjustment = -20000;
for (let i = 0; i < 4; i++) bus.emit('performance:fps', 25);
assert.equal(settings.get().resolvedQuality, 'balanced', 'Modo automático deve reduzir qualidade após FPS baixo persistente.');
adaptive.destroy();

storage.clearProject();
assert.equal(storage.get('sample', null), null, 'Limpeza deve remover somente chaves do projeto.');

console.log('Testes concluídos: núcleo, vinte e cinco módulos, Enciclopédia Imersiva C1.1, busca, fontes, coleções, comparação, sistemas críticos, remasters 3D/360°, assets premium e qualidade adaptativa.');

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const imp=async file=>import(pathToFileURL(path.join(ROOT,file)).href+`?f94=${Date.now()}-${Math.random()}`);
const calibration=await imp('lobby/assets/render/graphics-calibrator.js');
const registry=await imp('lobby/assets/world/world-registry.js');
const adapters=await imp('lobby/assets/core/world-adapter.js');
const lobby=read('lobby/assets/lobby.js'),host=read('lobby/assets/plugin-world-host.js'),campus=read('lobby/assets/lobby3d.js'),park=read('lobby/assets/parque-diversoes-agv3d.js'),airdrop=read('lobby/assets/airdrop-transit3d.js'),sw=read('lobby/sw.js');

const device=(overrides={})=>calibration.detectCalibrationDevice({deviceMemory:16,hardwareConcurrency:12,saveData:false,reducedMotion:false,coarse:false,width:1440,...overrides});
const memoryStorage=()=>{const values=new Map();return{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key),values};};

test('F94 advances release and cache coherently to 14.10.8.96',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.96'/);
  assert.match(read('lobby/assets/boot.js'),/const VERSION='14\.10\.8\.96'/);
  assert.match(sw,/const VERSION='14\.10\.8\.96'/);assert.match(sw,/stage65-f94-auto-calibration/);
  assert.match(read('PUBLIC-DEPLOY.json'),/"worldArchitecturePhase": "94"/);assert.match(read('PUBLIC-DEPLOY.json'),/14\.10\.8\.96-stage65-f94-auto-calibration/);
});

test('F94 derives conservative ceilings from device memory, cores, mobile and data saving',()=>{
  assert.equal(calibration.calibrationQualityCeiling(device()),'ultra');
  assert.equal(calibration.calibrationQualityCeiling(device({deviceMemory:8,hardwareConcurrency:8,coarse:true,width:420})),'high');
  assert.equal(calibration.calibrationQualityCeiling(device({deviceMemory:4,hardwareConcurrency:4,coarse:true,width:420})),'medium');
  assert.equal(calibration.calibrationQualityCeiling(device({deviceMemory:8,hardwareConcurrency:8,saveData:true})),'low');
  assert.equal(calibration.constrainCalibrationQuality('ultra',device({deviceMemory:4,hardwareConcurrency:4,coarse:true,width:420})),'medium');
});

test('F94 evaluates frame-time stability and estimated memory pressure together',()=>{
  const stable=calibration.summarizeCalibrationWindow(Array.from({length:8},()=>({fps:60,frameTimeMs:16.67})),'medium',device(),{estimatedGpuMemoryMb:120,jsHeapUsedMb:180,jsHeapLimitMb:2048});
  assert.equal(stable.strong,true);assert.equal(stable.poor,false);assert.ok(stable.instability<.01);
  const pressure=calibration.summarizeCalibrationWindow(Array.from({length:6},()=>({fps:48,frameTimeMs:21})),'high',device({deviceMemory:4,hardwareConcurrency:4}),{estimatedGpuMemoryMb:520,jsHeapUsedMb:900,jsHeapLimitMb:1000});
  assert.equal(pressure.memoryPressure,true);assert.equal(pressure.poor,true);assert.equal(pressure.severe,true);
});

test('F94 permanently protects a manual quality choice until Automatic is re-enabled',()=>{
  let now=1_000_000,preference='ultra';const decisions=[],calibrator=calibration.createGraphicsCalibrator({storage:memoryStorage(),now:()=>now,device:device(),getPreference:()=>preference,onRecommendation:value=>decisions.push(value)});
  calibrator.noteQuality('campus-ds','ultra',{manual:true});for(let index=0;index<30;index++){now+=1000;const result=calibrator.sample({worldId:'campus-ds',quality:'ultra',fps:12,frameTimeMs:80});assert.equal(result.status,'manual-lock');}
  assert.equal(decisions.length,0);assert.equal(calibrator.getSummary('campus-ds').manualLock,true);
  preference='auto';calibrator.setPreference(preference);assert.equal(calibrator.getSummary('campus-ds').automatic,true);
});

test('F94 downgrades one step after confirmed overload and persists the learned world profile',()=>{
  let now=1_000_000;const storage=memoryStorage(),decisions=[],calibrator=calibration.createGraphicsCalibrator({storage,now:()=>now,device:device(),getPreference:()=> 'auto',onRecommendation:value=>decisions.push(value)});
  assert.equal(calibrator.initialQuality('vale-silicio','high'),'high');for(let index=0;index<5;index++){now+=1000;calibrator.sample({worldId:'vale-silicio',quality:'high',fps:14,frameTimeMs:72});}
  assert.equal(decisions.length,1);assert.equal(decisions[0].previousQuality,'high');assert.equal(decisions[0].quality,'medium');assert.equal(decisions[0].reason,'frame-instability');
  const restored=calibration.createGraphicsCalibrator({storage,now:()=>now,device:device(),getPreference:()=> 'auto'});assert.equal(restored.initialQuality('vale-silicio','high'),'medium');
});

test('F94 upgrades only after sustained stable headroom and never above the device ceiling',()=>{
  let now=2_000_000;const decisions=[],calibrator=calibration.createGraphicsCalibrator({storage:memoryStorage(),now:()=>now,device:device({deviceMemory:8,hardwareConcurrency:8}),getPreference:()=> 'auto',onRecommendation:value=>decisions.push(value)});
  calibrator.initialQuality('museu-hardware-agv','medium');for(let index=0;index<35;index++){now+=1000;calibrator.sample({worldId:'museu-hardware-agv',quality:decisions.at(-1)?.quality||'medium',fps:60,frameTimeMs:16.67});}
  assert.equal(decisions.length,1);assert.equal(decisions[0].quality,'high');assert.equal(decisions[0].reason,'stable-headroom');assert.equal(calibrator.getSummary('museu-hardware-agv').device.ceiling,'high');
});

test('F94 keeps calibration isolated per world/device and supports a local recalibration reset',()=>{
  let now=3_000_000;const storage=memoryStorage(),calibrator=calibration.createGraphicsCalibrator({storage,now:()=>now,device:device(),getPreference:()=> 'auto'});
  calibrator.initialQuality('mars-agv','high');for(let index=0;index<5;index++){now+=1000;calibrator.sample({worldId:'mars-agv',quality:'high',fps:13,frameTimeMs:76});}
  assert.equal(calibrator.getSummary('mars-agv').recommendedQuality,'medium');assert.equal(calibrator.getSummary('moon-agv').recommendedQuality,null);
  calibrator.reset('mars-agv');assert.equal(calibrator.getSummary('mars-agv').recommendedQuality,null);
  const otherDevice=calibration.createGraphicsCalibrator({storage,now:()=>now,device:device({deviceMemory:4,hardwareConcurrency:4,coarse:true,width:420}),getPreference:()=> 'auto'});assert.equal(otherDevice.initialQuality('mars-agv','high'),'medium');
});

test('F94 wires telemetry, memory, diagnostics, persistence and protected manual UI through the Lobby',()=>{
  assert.match(lobby,/createGraphicsCalibrator/);assert.match(lobby,/graphicsCalibrator\.sample/);assert.match(lobby,/graphicsCalibrator\.updateMemory/);assert.match(lobby,/graphics_calibration/);assert.match(lobby,/manual-choice/);assert.match(lobby,/adaptiveQuality:pref==='auto'/);assert.match(lobby,/quality-calibration-reset/);assert.match(lobby,/worldId==='airdrop-transit'/);
  const html=read('lobby/index.html'),harness=read('core/tests/f94-calibration-harness.html');assert.match(html,/frame time, estabilidade e memória/);assert.match(html,/Uma escolha manual permanece fixa/);assert.match(html,/quality-calibration-reset/);assert.match(harness,/Simular sobrecarga/);assert.match(harness,/Simular estabilidade/);assert.match(harness,/Simular pressão de memória/);
});

test('F94 makes the global calibrator the only adaptive authority and propagates calibrated starts',()=>{
  assert.match(campus,/onQualityRequest:\(\)=>\{\}/);assert.match(campus,/worldId:'campus-ds'/);assert.match(park,/enabled:false/);
  assert.match(host,/chooseInitialQuality\(profile,context\.initialQuality\)/);assert.match(host,/worldId:config\.worldId/);
  assert.match(airdrop,/worldId:'airdrop-transit'/);assert.match(airdrop,/return\{id:'airdrop-transit'/);
  const adapter=read('lobby/assets/core/world-adapter.js'),prefetch=read('lobby/assets/world/world-runtime-prefetch.js');for(const file of['lobby3d.js','parque-diversoes-agv3d.js','colegio-agv-host.js','labirinto-armadilhas-host.js','airdrop-transit3d.js'])assert.match(adapter,new RegExp(file.replaceAll('.','\\.')+'\\?v=14\\.10\\.8\\.96-f94-auto-calibration'),file);for(const file of['lobby3d.js','parque-diversoes-agv3d.js','colegio-agv-host.js','labirinto-armadilhas-host.js'])assert.match(prefetch,new RegExp(file.replaceAll('.','\\.')+'\\?v=14\\.10\\.8\\.96-f94-auto-calibration'),file);
});

test('F94 preserves topology/importability and keeps 3D runtimes outside the critical shell',async()=>{
  assert.equal(registry.WORLD_REGISTRY.size,18);assert.equal(adapters.WORLD_ADAPTERS.length,18);assert.equal(registry.WORLD_REGISTRY.connections.length,17);
  const critical=sw.match(/const CRITICAL_SHELL=\[(.*?)\];/s)?.[1]||'';assert.match(critical,/graphics-calibrator\.js\?v=14\.10\.8\.96-f94-auto-calibration/);assert.doesNotMatch(critical,/\b(?:lobby3d|parque-diversoes-agv3d|colegio-agv3d|labirinto-armadilhas3d|museu-hardware3d)\.js/);
  const modules=await Promise.all(['lobby3d.js','parque-diversoes-agv3d.js','plugin-world-host.js','airdrop-transit3d.js'].map(file=>imp(`lobby/assets/${file}`)));for(const [index,name] of ['createLobby3D','createParqueDiversoes3D','createPluginWorld3DHost','createAirdropTransit3D'].entries())assert.equal(typeof modules[index][name],'function',name);
});

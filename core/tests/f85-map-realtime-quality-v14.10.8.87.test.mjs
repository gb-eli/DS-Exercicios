import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const lobby=read('lobby/assets/lobby.js');
const lobby3d=read('lobby/assets/lobby3d.js');
const lobbyLite=read('lobby/assets/lobby-lite.js');
const valeLite=read('lobby/assets/vale-lite.js');
const html=read('lobby/index.html');
const css=read('lobby/assets/lobby.css');
const sw=read('lobby/sw.js');
const boot=read('lobby/assets/boot.js');
const adapter=read('lobby/assets/core/world-adapter.js');
const realtime=read('lobby/assets/social/realtime-avatar-sync.js');
const remote=read('lobby/assets/social/remote-avatar-state.js');
const gameplay=read('lobby/assets/world/gameplay-settings.js');
const modular=await import(pathToFileURL(path.join(ROOT,'lobby/assets/world/campus-modular-layout.js')).href+`?test=${Date.now()}`);
const realtimeModule=await import(pathToFileURL(path.join(ROOT,'lobby/assets/social/realtime-avatar-sync.js')).href+`?test=${Date.now()}`);

const realtimeRuntimes=[
  'lobby/assets/lobby3d.js','lobby/assets/vale3d.js','lobby/assets/rural3d.js','lobby/assets/military3d.js',
  'lobby/assets/space3d.js','lobby/assets/moon3d.js','lobby/assets/mars3d.js','lobby/assets/parque-diversoes-agv3d.js',
  'lobby/assets/museu-hardware3d.js','lobby/assets/plugin-world-host.js'
];

test('F85 advances the release/cache chain coherently to 14.10.8.87',()=>{
  assert.match(read('lobby/assets/config.js'),/LOBBY_VERSION='14\.10\.8\.87'/);
  assert.match(boot,/const VERSION='14\.10\.8\.87'/);
  assert.match(sw,/const VERSION='14\.10\.8\.87'/);
  assert.match(html,/lobby\.css\?v=14\.10\.8\.87-stage56-f85-map-realtime/);
  assert.match(read('lobby/assets/sw-register.js'),/14\.10\.8\.87-stage56-f85-map-realtime/);
  assert.match(read('lobby/assets/vendor-loader.js'),/boot\.js\?v=\$\{VERSION\}-stage56-f85-map-realtime/);
  assert.match(lobby,/world-adapter\.js\?v=14\.10\.8\.87-f85-map-realtime/);
});

test('F85 exposes a dedicated mobile quality modal with smart automatic selection',()=>{
  assert.match(html,/id="mobile-quality-button"/);assert.match(html,/id="quality-modal"/);
  for(const choice of ['auto','low','medium','high','ultra'])assert.match(html,new RegExp(`data-quality-choice="${choice}"`));
  assert.match(css,/\.mobile-quality-button/);assert.match(css,/\.quality-choice-grid/);
  assert.match(lobby,/function openQualityModal\(/);assert.match(lobby,/function applyQualityChoice\(/);
  assert.match(gameplay,/function detectAutomaticQuality/);assert.match(gameplay,/deviceMemory/);assert.match(gameplay,/hardwareConcurrency/);assert.match(gameplay,/saveData/);
  assert.match(lobby,/qualityPreference:pref/);assert.match(lobby,/savePersonalization\(\)/);
});

test('F85 keeps one canonical gameplay contract and Vale movement reference',()=>{
  assert.equal((gameplay.match(/export function normalizeGameplaySettings/g)||[]).length,1);
  assert.match(gameplay,/walk:16,run:28/);assert.match(gameplay,/minMultiplier:\.55,maxMultiplier:2\.25/);
  assert.match(gameplay,/mouseSensitivity:clamp/);assert.match(gameplay,/fov:clamp/);assert.match(gameplay,/normalizeControlBindings/);
});

test('F85 adds fast ephemeral avatar realtime without replacing persistent presence',()=>{
  assert.match(realtime,/\?125:100/);assert.match(realtime,/const heartbeatMs=900/);assert.match(realtime,/broadcast/);assert.match(realtime,/avatar-state/);
  for(const field of ['elevation','heading','moving','running','onGround','movementMode','localAction','avatarStyle'])assert.match(realtime,new RegExp(field));
  assert.match(realtime,/onUnknownPeer/);assert.match(lobby,/schedulePresenceRefresh\(\)/);assert.match(lobby,/realtimeFresh=Date\.now\(\)-\(Number\(old\.realtime_ts\)/);
  assert.match(lobby,/PRESENCE_INTERVAL_MS=COARSE_POINTER\?8000:6000/);
});

test('F85 synchronizes remote action and appearance efficiently across 3D runtimes',()=>{
  assert.match(remote,/remoteAppearance/);assert.match(remote,/remoteAppearanceRevision/);assert.match(remote,/localAction/);assert.match(remote,/updateEmote/);
  for(const file of realtimeRuntimes){
    const src=read(file);assert.match(src,/remote-avatar-state\.js\?v=.*f85-map-realtime/,`${file} imports remote realtime state`);
    assert.match(src,/applyRemoteAvatarState\(/,`${file} applies remote realtime state`);
  }
  assert.match(read('lobby/assets/parque-diversoes-agv3d.js'),/heading:.*rotation\.y/);
  assert.match(read('lobby/assets/plugin-world-host.js'),/localAction:self\.userData\.localAction/);
});

test('F85 fixes Campus 2D proportions and gives modular villages visual priority over attractions',()=>{
  assert.equal(modular.CAMPUS_MODULAR_SCHEMA,2);assert.equal(modular.CAMPUS_MODULAR_DISTRICTS.length,4);
  assert.deepEqual({minX:modular.CAMPUS_MAP_VIEW.minX,maxX:modular.CAMPUS_MAP_VIEW.maxX,minZ:modular.CAMPUS_MAP_VIEW.minZ,maxZ:modular.CAMPUS_MAP_VIEW.maxZ},{minX:-60,maxX:60,minZ:-42,maxZ:42});
  for(const district of modular.CAMPUS_MODULAR_DISTRICTS){assert.ok(district.w>=29);assert.ok(district.d>=20);assert.equal(district.loadPolicy,'on-demand');}
  assert.match(lobbyLite,/CAMPUS_MAP_VIEW/);assert.match(lobbyLite,/function drawCampusRoad|const drawCampusRoad/);assert.match(lobbyLite,/quadraticCurveTo/);
  assert.match(lobbyLite,/SETOR MODULAR/);assert.match(lobbyLite,/CAMPUS_PEDESTRIAN_ROUTES/);
  assert.match(read('lobby/assets/world/campus-experiences.js'),/id:'pool'.*radius:3\.7/);
});

test('F85 makes Vale 2D denser while preserving zoom controls',()=>{
  assert.match(valeLite,/zoom=1\.36,zoomTarget=1\.36/);assert.match(valeLite,/w<680\?1\.18:1\.36/);assert.match(valeLite,/Digit0/);assert.match(valeLite,/wheelZoom/);
});

test('F85 removes the continuously animated idle train from Campus render loops',()=>{
  assert.match(lobbyLite,/o trem não fica circulando no hub quando ninguém está viajando/);
  assert.match(lobby3d,/const trainActive=!!trainRide\|\|train\.isTraveling\(\)/);
  assert.match(lobby3d,/transit\.train\.visible=trainActive/);
  assert.match(read('lobby/assets/game/train-manager.js'),/visualDwell=5,tripDwell=5/);
});

test('F85 lazy-loads Campus/Vale 3D and stops prefetching 3D from the initial shell',()=>{
  assert.doesNotMatch(adapter,/^import \{ createLobby3D/m);assert.doesNotMatch(adapter,/^import \{ createVale3D/m);
  assert.match(adapter,/import\('\.\.\/lobby3d\.js\?v=14\.10\.8\.87-f85-map-realtime'\)/);
  assert.match(adapter,/import\('\.\.\/vale3d\.js\?v=14\.10\.8\.87-f85-map-realtime'\)/);
  assert.doesNotMatch(sw,/\.\/assets\/lobby3d\.js/);assert.doesNotMatch(sw,/\.\/assets\/vale3d\.js/);
  const requiredLine=boot.split('\n').find(line=>line.includes('const requiredAssets='))||'';
  assert.doesNotMatch(requiredLine,/lobby3d\.js/);assert.doesNotMatch(requiredLine,/vale3d\.js/);
});

test('F85 parallelizes boot integrity probes in bounded batches',()=>{
  assert.match(boot,/const probeConcurrency=6/);assert.match(boot,/Promise\.all\(requiredAssets\.slice\(i,i\+probeConcurrency\)\.map\(probeAsset\)\)/);
});


test('F85 realtime channel emits full avatar state and merges peer action/style',async()=>{
  const priorMatch=globalThis.matchMedia,priorDocument=globalThis.document;
  globalThis.matchMedia=()=>({matches:false});globalThis.document={hidden:false};
  const sent=[];let listener=null;
  const channel={on(_kind,_filter,fn){listener=fn;return this;},subscribe(fn){fn('SUBSCRIBED');return this;},send(packet){sent.push(packet);return Promise.resolve(true);}};
  const supabase={channel(){return channel;},async removeChannel(){return true;}};
  const peer={student_id:'peer',area:'central',x:.1,y:.2};
  const state={user:{id:'self'},scene:'campus',player:{x:.25,y:.35,area:'central'},others:[peer]};
  const sync=realtimeModule.createRealtimeAvatarSync({supabase,state,getSnapshot:()=>({scene:'campus',area:'central',x:.25,y:.35,elevation:1.2,heading:1.5,moving:true,running:false,onGround:false,movementMode:'ground',localAction:'dance',avatarStyle:{accentCss:'#112233',backpack:true}})});
  try{
    assert.equal(await sync.ensure(),true);assert.ok(listener);sync.burst();await new Promise(resolve=>setTimeout(resolve,0));assert.ok(sent.length>=1);
    const out=sent[0].payload;assert.equal(out.localAction,'dance');assert.equal(out.heading,1.5);assert.equal(out.avatarStyle.accentCss,'#112233');assert.equal(out.avatarStyle.backpack,true);
    sync.mergePeer({v:2,userId:'peer',seq:1,ts:Date.now(),scene:'campus',area:'central',x:.45,y:.55,elevation:2.4,heading:2.1,moving:true,running:true,onGround:false,movementMode:'ground',localAction:'cheer',emote:'wave',emoteUntil:Date.now()+3000,avatarStyle:{accentCss:'#abcdef',glasses:true},styleRevision:'rev-1'});
    assert.equal(peer.x,.45);assert.equal(peer.y,.55);assert.equal(peer.heading,2.1);assert.equal(peer.realtime_elevation,2.4);assert.equal(peer.local_action,'cheer');assert.equal(peer.avatar_style.accentCss,'#abcdef');assert.equal(peer.avatar_style.glasses,true);assert.equal(peer.avatar_style_revision,'rev-1');
  }finally{await sync.stop();globalThis.matchMedia=priorMatch;if(priorDocument===undefined)delete globalThis.document;else globalThis.document=priorDocument;}
});

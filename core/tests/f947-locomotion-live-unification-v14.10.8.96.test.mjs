import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const lobby=path.join(root,'lobby');
const locPath=path.join(lobby,'assets/core/runtime-v2/player-locomotion.js');
const { createPlayerLocomotion,LOCOMOTION_RUNTIME_REVISION }=await import(pathToFileURL(locPath).href+'?t='+Date.now());
const results=[];
function test(name,fn){try{fn();results.push({name,ok:true});console.log('PASS',name);}catch(error){results.push({name,ok:false,error:error.message});console.error('FAIL',name,error);process.exitCode=1;}}
function simulate(hz,seconds=1,{running=false,interior=false}={}){const l=createPlayerLocomotion({worldId:'campus-ds'});let x=0,z=0;const dt=1/hz;for(let i=0;i<Math.round(hz*seconds);i++){const m=l.stepHorizontal(dt,{x:1,z:0,running,interior});x+=m.x;z+=m.z;}return{x,z,s:l.snapshot()};}

test('kernel revision F94.7 and stepHorizontal API',()=>{assert.equal(LOCOMOTION_RUNTIME_REVISION,'F94.7');const l=createPlayerLocomotion();assert.equal(typeof l.stepHorizontal,'function');assert.equal(typeof l.haltHorizontal,'function');});

test('shared acceleration ramps instead of teleporting to max speed',()=>{const l=createPlayerLocomotion();const first=l.stepHorizontal(1/60,{x:1,z:0,running:false});for(let i=0;i<59;i++)l.stepHorizontal(1/60,{x:1,z:0,running:false});const end=l.stepHorizontal(1/60,{x:1,z:0,running:false});assert.ok(first.speed>0 && first.speed<16,`first=${first.speed}`);assert.ok(end.speed>first.speed,`end=${end.speed}`);assert.ok(end.speed>14.5 && end.speed<=16.01,`end=${end.speed}`);});

test('shared deceleration removes glide smoothly',()=>{const l=createPlayerLocomotion();for(let i=0;i<90;i++)l.stepHorizontal(1/60,{x:1,z:0,running:true});const before=Math.hypot(l.snapshot().velocity.x,l.snapshot().velocity.z);const first=l.stepHorizontal(1/60,{x:0,z:0,running:false});for(let i=0;i<45;i++)l.stepHorizontal(1/60,{x:0,z:0,running:false});const after=Math.hypot(l.snapshot().velocity.x,l.snapshot().velocity.z);assert.ok(first.speed<before && first.speed>0);assert.ok(after<.1,`after=${after}`);});

test('fixed timestep is stable across 30/60/120 Hz',()=>{const a=simulate(30,2),b=simulate(60,2),c=simulate(120,2);const max=Math.max(a.x,b.x,c.x),min=Math.min(a.x,b.x,c.x);assert.ok(max-min<.55,JSON.stringify({a:a.x,b:b.x,c:c.x}));});

test('interior locomotion is intentionally slower',()=>{const ext=simulate(60,2,{running:true}),inside=simulate(60,2,{running:true,interior:true});assert.ok(ext.x>inside.x*1.7,JSON.stringify({ext:ext.x,inside:inside.x}));});

test('moon keeps shared horizontal speed profile but own low-gravity profile',()=>{const l=createPlayerLocomotion({worldId:'moon-agv'});assert.equal(l.getProfile().id,'moon');assert.equal(l.getProfile().walk,16);assert.ok(l.getProfile().gravity<10);});

const live3D=['lobby3d.js','village3d.js','campus-module3d.js','vale3d.js','rural3d.js','military3d.js','space3d.js','moon3d.js','mars3d.js','parque-diversoes-agv3d.js','museu-hardware3d.js','plugin-world-host.js'];
test('primary 3D runtimes use shared live locomotion',()=>{for(const f of live3D){const s=fs.readFileSync(path.join(lobby,'assets',f),'utf8');assert.match(s,/createPlayerLocomotion/ ,f);assert.match(s,/stepHorizontal\(/,f);}});

const liveLite=['lobby-lite.js','village-lite.js','campus-module-lite.js','vale-lite.js','rural-lite.js','military-lite.js','space-lite.js','moon-lite.js','mars-lite.js','parque-diversoes-agv-lite.js','museu-hardware-lite.js'];
test('primary 2D runtimes use shared live locomotion',()=>{for(const f of liveLite){const s=fs.readFileSync(path.join(lobby,'assets',f),'utf8');assert.match(s,/createPlayerLocomotion/,f);assert.match(s,/stepHorizontal\(/,f);}});

test('vehicle/special movement remains isolated from on-foot kernel',()=>{const moon=fs.readFileSync(path.join(lobby,'assets/moon-lite.js'),'utf8'),mars=fs.readFileSync(path.join(lobby,'assets/mars-lite.js'),'utf8'),campus=fs.readFileSync(path.join(lobby,'assets/lobby3d.js'),'utf8');assert.match(moon,/roverMode[\s\S]{0,180}31\*dt/);assert.match(mars,/roverMode[\s\S]{0,180}34\*dt/);assert.match(campus,/locomotionLocked=.*airdropMode/);});

test('custom hosted worlds inherit the same plugin locomotion',()=>{const plugin=fs.readFileSync(path.join(lobby,'assets/plugin-world-host.js'),'utf8'),colegio=fs.readFileSync(path.join(lobby,'assets/colegio-agv-host.js'),'utf8'),lab=fs.readFileSync(path.join(lobby,'assets/labirinto-armadilhas-host.js'),'utf8');assert.ok((plugin.match(/stepHorizontal\(/g)||[]).length>=2);assert.match(colegio,/plugin-world-host\.js\?v=14\.10\.8\.96-f947-locomotion-live/);assert.match(lab,/plugin-world-host\.js\?v=14\.10\.8\.96-f947-locomotion-live/);});

test('cache-bust chain is stage69 F94.7',()=>{for(const f of ['index.html','sw.js','assets/vendor-loader.js','assets/boot.js','assets/sw-register.js']){const s=fs.readFileSync(path.join(lobby,f),'utf8');assert.match(s,/stage69-f947-locomotion-live/,f);}const sw=fs.readFileSync(path.join(lobby,'sw.js'),'utf8');assert.match(sw,/player-locomotion\.js\?v=14\.10\.8\.96-f947-locomotion-live/);assert.match(sw,/gameplay-settings\.js\?v=14\.10\.8\.96-f947-locomotion-live/);});

test('world adapters cache-bust all changed runtimes',()=>{const s=fs.readFileSync(path.join(lobby,'assets/core/world-adapter.js'),'utf8');for(const f of ['lobby-lite.js','lobby3d.js','village-lite.js','village3d.js','campus-module-lite.js','campus-module3d.js','vale-lite.js','vale3d.js','rural-lite.js','rural3d.js','military-lite.js','military3d.js','space-lite.js','space3d.js','moon-lite.js','moon3d.js','mars-lite.js','mars3d.js','parque-diversoes-agv-lite.js','parque-diversoes-agv3d.js','museu-hardware-lite.js','museu-hardware3d.js'])assert.ok(s.includes(`${f}?v=14.10.8.96-f947-locomotion-live`),f);});

test('airdrop transit stays outside ground locomotion contract',()=>{const s=fs.readFileSync(path.join(lobby,'assets/airdrop-transit3d.js'),'utf8');assert.doesNotMatch(s,/createPlayerLocomotion/);});

const summary={suite:'F94.7 Locomocao Real Unificada',passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,total:results.length,results};
console.log(JSON.stringify(summary,null,2));
if(summary.failed)process.exitCode=1;

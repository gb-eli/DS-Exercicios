import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {CAMPUS_ROAD_HIERARCHY} from '../../lobby/assets/world/campus-city-network.js';
import {CAMPUS_TRAFFIC_ROUTES,CAMPUS_PEDESTRIAN_ROUTES,CAMPUS_NPC_PATROLS,sampleCampusRoute} from '../../lobby/assets/world/campus-mobility-systems.js';
import {EXTERIOR_BUILDING_COLLIDERS} from '../../lobby/assets/world/campus-manifest.js';
import {createTrainManager} from '../../lobby/assets/game/train-manager.js';
const root=path.resolve(import.meta.dirname,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

function segDist(px,pz,a,b){const vx=b.x-a.x,vz=b.z-a.z,wx=px-a.x,wz=pz-a.z,c2=vx*vx+vz*vz,t=c2?Math.max(0,Math.min(1,(vx*wx+vz*wz)/c2)):0;return Math.hypot(px-(a.x+t*vx),pz-(a.z+t*vz));}
function roadMargin(x,z){let best=Infinity;for(const r of CAMPUS_ROAD_HIERARCHY)for(let i=0;i<r.nodes.length-1;i++)best=Math.min(best,segDist(x,z,r.nodes[i],r.nodes[i+1])-r.width/2);return best;}

test('F82 five reported worlds use the current Avatar V2 contract and Orbital parses as ESM',async()=>{
  for(const name of ['rural3d','military3d','space3d','moon3d','mars3d']){
    const src=read(`lobby/assets/${name}.js`);
    assert.match(src,/spriteLabel:labelSprite/,name);assert.match(src,/emojiSprite:/,name);assert.match(src,/await avatarSystem\.init\(\)/,name);
    await import(`../../lobby/assets/${name}.js?f82=${Date.now()}-${name}`);
  }
});

test('F82 adapter cache-busts the repaired 3D runtimes',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js');
  for(const name of ['rural3d','military3d','space3d','moon3d','mars3d'])assert.match(adapter,new RegExp(`${name}\\.js\\?v=14\\.10\\.8\\.84-stage53-hotfix3d`));
});

test('F82 automatic traffic remains on roads and outside main building colliders',()=>{
  for(const route of CAMPUS_TRAFFIC_ROUTES){for(let i=0;i<480;i++){const p=sampleCampusRoute(route,i/480);assert.ok(roadMargin(p.x,p.z)<=.35,`${route.id} fora da rua em ${p.x},${p.z}`);assert.equal(EXTERIOR_BUILDING_COLLIDERS.some(c=>p.x>c.minX&&p.x<c.maxX&&p.z>c.minZ&&p.z<c.maxZ),false,`${route.id} atravessa prédio`);}}
});

test('F82 pedestrian NPCs use dedicated pedestrian paths',()=>{
  const ids=new Set(CAMPUS_PEDESTRIAN_ROUTES.map(r=>r.id));assert.equal(ids.size,5);
  for(const npc of CAMPUS_NPC_PATROLS){assert.ok(npc.routeId.startsWith('ped-'),npc.id);assert.ok(ids.has(npc.routeId),npc.routeId);}
});

test('F82 train waits five seconds to board at origin and five seconds at destination',()=>{
  let now=0;const events=[];const train=createTrainManager({clock:()=>now,onEvent:e=>events.push(e)}),stations=train.stations(),origin=stations[0],dest=stations[1];
  assert.equal(train.startTrip(dest.id,origin),true);const duration=events.find(e=>e.type==='train-start').duration;
  now=4900;assert.equal(train.tickTrip().station,origin.id);
  now=5100;assert.equal(train.tickTrip().station,null);
  now=(duration-4.9)*1000;assert.equal(train.tickTrip().station,dest.id);
  now=(duration+.01)*1000;const done=train.tickTrip();assert.equal(done.done,true);assert.equal(done.station,dest.id);
});

test('F82 teleport UI is larger, sectorized and supports one student or all',()=>{
  const html=read('lobby/index.html'),css=read('lobby/assets/lobby.css'),lobby=read('lobby/assets/lobby.js');
  for(const label of ['Campus & Aprendizagem','Exploração & Operações','Jogos & Lazer'])assert.ok(html.includes(label));
  assert.match(css,/teleport-card\{width:min\(1180px/);assert.ok(html.includes('id="staff-bring-student-select"'));assert.ok(html.includes('id="staff-bring-student"'));assert.ok(html.includes('id="staff-bring-all"'));
  assert.match(lobby,/async function bringStudentToMe\(\)/);assert.match(lobby,/target_id:targetId/);assert.match(lobby,/async function bringAllStudentsToMe\(\)/);
});

test('F82 targeted gather token is bound to its student and migrations repair both constraint names',()=>{
  const edge=read('core/edge-functions/lobby-presence/index.ts'),migration=read('core/database/073_lobby_new_worlds.sql'),hotfix=read('core/database/074_lobby_presence_worlds_hotfix.sql');
  assert.match(edge,/target_id:targetId\|\|null/);assert.match(edge,/payload\.target_id&&payload\.target_id!==user\.id/);assert.match(edge,/gather_not_for_user/);
  for(const sql of [migration,hotfix]){assert.match(sql,/DROP CONSTRAINT IF EXISTS lobby_presence_area_check/);assert.match(sql,/DROP CONSTRAINT IF EXISTS lobby_presence_area_chk/);assert.match(sql,/ADD CONSTRAINT lobby_presence_area_chk/);}
  assert.match(hotfix,/F82 \/ v14\.10\.8\.84/);
});

test('F82 release/cache advances to 14.10.8.84 while preserving lazy heavy worlds',()=>{
  for(const f of ['lobby/assets/config.js','lobby/assets/boot.js','lobby/assets/vendor-loader.js','lobby/assets/sw-register.js','lobby/sw.js','lobby/index.html'])assert.match(read(f),/14\.10\.8\.84/,f);
  const critical=read('lobby/sw.js').slice(read('lobby/sw.js').indexOf('const CRITICAL_SHELL'),read('lobby/sw.js').indexOf('const OPTIONAL_SHELL'));
  for(const heavy of ['rural3d.js','military3d.js','space3d.js','moon3d.js','mars3d.js'])assert.doesNotMatch(critical,new RegExp(heavy.replace('.','\\.')));
});

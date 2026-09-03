import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const imp=rel=>import(pathToFileURL(path.join(root,rel)).href+`?f9413=${Math.random()}`);
const loader=await imp('lobby/assets/core/physics-v2/physics-module-loader.js');
const {createAabbColliderGeometry,createMeshBVHStaticCollider}=await imp('lobby/assets/core/physics-v2/mesh-bvh-collider.js');
const {createRapierGroundVehicleAdapter}=await imp('lobby/assets/core/physics-v2/rapier-vehicle-world.js');
const {createCampusPhysicsPilot}=await imp('lobby/assets/core/physics-v2/campus-physics-pilot.js');
const {createKinematicVehiclePhysicsAdapter}=await imp('lobby/assets/core/vehicle-v2/vehicle-physics-adapter.js');

class Vec3{constructor(x=0,y=0,z=0){this.set(x,y,z);}set(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;return this;}length(){return Math.hypot(this.x,this.y,this.z);}multiplyScalar(k){this.x*=k;this.y*=k;this.z*=k;return this;}}
class Sphere{constructor(center=new Vec3(),radius=1){this.center=center;this.radius=radius;}}
class Ray{constructor(origin=new Vec3(),direction=new Vec3(0,0,1)){this.origin=origin;this.direction=direction;}}
class BufferGeometry{constructor(){this.attributes={};this.userData={};}setAttribute(n,a){this.attributes[n]=a;return this;}computeBoundingBox(){}computeBoundingSphere(){}dispose(){this.disposed=true;}}
class Float32BufferAttribute{constructor(array,itemSize){this.array=Float32Array.from(array);this.itemSize=itemSize;this.count=this.array.length/itemSize;}}
const THREE={BufferGeometry,Float32BufferAttribute,Sphere,Vector3:Vec3,Ray,DoubleSide:2};

class FakeMeshBVH{
  constructor(geometry){this.geometry=geometry;}
  intersectsSphere(sphere){return sphere.center.x>=1&&sphere.center.x<=3&&Math.abs(sphere.center.z)<=2;}
  raycastFirst(ray,_side,_near,far){return ray.direction.x>0&&far>1?{distance:1,point:new Vec3(1,ray.origin.y,ray.origin.z)}:null;}
}

function fakeRapier(){
  class Desc{constructor(kind,...args){this.kind=kind;this.args=args;this.translation={x:0,y:0,z:0};}setTranslation(x,y,z){this.translation={x,y,z};return this;}}
  class BodyDesc{constructor(){this.translation={x:0,y:0,z:0};}setTranslation(x,y,z){this.translation={x,y,z};return this;}}
  class Body{constructor(desc){this.pos={...desc.translation};}setTranslation(v){this.pos={...v};}setRotation(){}setNextKinematicTranslation(v){this.pos={...v};}setNextKinematicRotation(){}translation(){return this.pos;}}
  class World{
    constructor(){this.colliders=[];this.bodies=[];this.controller={_mov:{x:0,y:0,z:0},_count:0,computeColliderMovement:(collider,d)=>{const start=collider.body?.pos||{x:0,y:0,z:0};let dx=d.x;this.controller._count=0;if(start.x+dx>2){dx=Math.max(0,2-start.x);this.controller._count=1;}this.controller._mov={x:dx,y:d.y,z:d.z};},computedMovement:()=>this.controller._mov,numComputedCollisions:()=>this.controller._count,computedCollision:()=>({collider:this.colliders[0]}),setSlideEnabled(){},setApplyImpulsesToDynamicBodies(){}};}
    createCharacterController(){return this.controller;}
    removeCharacterController(){}
    createRigidBody(desc){const b=new Body(desc);this.bodies.push(b);return b;}
    createCollider(desc,body=null){const c={handle:this.colliders.length+1,desc,body};this.colliders.push(c);return c;}
    removeRigidBody(body){this.bodies=this.bodies.filter(b=>b!==body);}
    step(){}
    free(){}
  }
  return {World,ColliderDesc:{cuboid:(...a)=>new Desc('cuboid',...a),ball:r=>new Desc('ball',r)},RigidBodyDesc:{kinematicPositionBased:()=>new BodyDesc()}};
}

test('policy mantém piloto fora de máquinas limitadas e permite force explícito',()=>{
  const constrained=loader.physicsPilotPolicy({quality:'medium',device:{mobile:false,hardware:4,cores:4,saveData:false},search:''});
  assert.equal(constrained.enabled,false);
  const high=loader.physicsPilotPolicy({quality:'high',device:{mobile:false,hardware:8,cores:8,saveData:false},search:''});
  assert.equal(high.enabled,true);
  const forced=loader.physicsPilotPolicy({quality:'low',device:{mobile:true,hardware:2,cores:2,saveData:true},search:'?physics=rapier'});
  assert.equal(forced.enabled,true);assert.equal(forced.forced,true);
  const off=loader.physicsPilotPolicy({quality:'ultra',device:{mobile:false,hardware:16,cores:16},search:'?physics=kinematic'});assert.equal(off.enabled,false);
});

test('loader Rapier/BVH aceita importadores injetados e inicializa compat',async()=>{
  loader.resetPhysicsModuleLoaderForTests();let initCalled=0;
  const rapier=await loader.loadRapier3D({forceReload:true,importer:async()=>({World:class{},ColliderDesc:{},RigidBodyDesc:{},init:async()=>{initCalled++;}})});
  assert.equal(rapier.available,true);assert.equal(initCalled,1);assert.equal(rapier.version,'0.20.0');
  const bvh=await loader.loadThreeMeshBVH({forceReload:true,importer:async()=>({MeshBVH:FakeMeshBVH})});assert.equal(bvh.available,true);assert.equal(bvh.version,'0.9.14');
});

test('BVH gera 12 triângulos por AABB e responde sphere/ray query',()=>{
  const geometry=createAabbColliderGeometry({THREE,colliders:[{minX:1,maxX:3,minZ:-2,maxZ:2}]});assert.equal(geometry.userData.agvColliderTriangles,12);assert.equal(geometry.attributes.position.count,36);
  const bvh=createMeshBVHStaticCollider({THREE,MeshBVH:FakeMeshBVH,colliders:[{minX:1,maxX:3,minZ:-2,maxZ:2}]});assert.equal(bvh.intersectsSphere({x:2,z:0,radius:.5}),true);assert.equal(bvh.intersectsSphere({x:-2,z:0,radius:.5}),false);assert.ok(bvh.raycastFirst({from:{x:0,y:1,z:0},to:{x:4,y:1,z:0}}));assert.equal(bvh.diagnostics().boxes,1);bvh.dispose();assert.equal(bvh.geometry.disposed,true);
});

test('Rapier pilot usa character controller, corrige movimento e mantém fallback aéreo',()=>{
  const fallback=createKinematicVehiclePhysicsAdapter();const adapter=createRapierGroundVehicleAdapter({RAPIER:fakeRapier(),staticColliders:[{id:'wall',minX:3,maxX:4,minZ:-2,maxZ:2}],bounds:{x:10,z:10},fallback});
  const a=adapter.moveGround({from:{x:0,y:0,z:0,heading:0},to:{x:1,y:0,z:0,heading:0},definition:{id:'c',kind:'car',collisionRadius:.5}});assert.equal(a.ok,true);assert.equal(a.pose.x,1);
  const b=adapter.moveGround({from:{x:1.95,y:0,z:0,heading:0},to:{x:2.8,y:0,z:0,heading:0},definition:{id:'c',kind:'car',collisionRadius:.5}});assert.equal(b.ok,false);assert.equal(b.collision.type,'rapier-static');assert.equal(adapter.diagnostics().rapier,true);
  const air=adapter.moveAerial({to:{x:1,y:8,z:2,heading:0}});assert.equal(air.ok,true);assert.equal(air.pose.y,8);adapter.dispose();
});

test('CampusPhysicsPilot troca adapter sem bloquear boot e expõe diagnóstico',async()=>{
  const fallback=createKinematicVehiclePhysicsAdapter({canMoveGround:()=>true});
  const pilot=createCampusPhysicsPilot({THREE,colliders:[{id:'x',minX:1,maxX:3,minZ:-2,maxZ:2}],bounds:{x:10,z:10},fallbackPhysics:fallback,quality:'low',device:{mobile:true,hardware:2,cores:2},search:'?physics=rapier',loadBVH:async()=>({available:true,MeshBVH:FakeMeshBVH}),loadRapier:async()=>({available:true,module:fakeRapier()})});
  assert.equal(pilot.diagnostics().status,'idle');assert.equal(pilot.intersectsStaticSphere({x:2,z:0}),null);
  const d=await pilot.activate();assert.equal(d.status,'rapier');assert.equal(d.rapier.ready,true);assert.equal(d.bvh.ready,true);assert.equal(pilot.intersectsStaticSphere({x:2,z:0}),true);assert.equal(pilot.adapter.diagnostics().activeAdapter,'rapier-pilot');pilot.dispose();assert.equal(pilot.diagnostics().status,'disposed');
});

test('Campus 3D integra BVH no canStand, Rapier em veículo e inicializa só após primeiro frame',()=>{
  const s=read('lobby/assets/lobby3d.js');for(const token of ['createCampusPhysicsPilot','campusPhysicsPilot?.intersectsStaticSphere','fallbackVehiclePhysics','campusPhysicsPilot.adapter','getPhysicsPilotDiagnostics','campusPhysicsPilot?.dispose?.()'])assert.match(s,new RegExp(token.replaceAll('?','\\?').replaceAll('.','\\.')));assert.match(s,/if\(!firstFrameDone\).*campusPhysicsPilot\?\.activate/s);
});

test('CSP permite wasm apenas no Lobby e CDN continua não crítica ao boot',()=>{
  const html=read('lobby/index.html'),boot=read('lobby/assets/boot.js');assert.match(html,/script-src 'self' 'wasm-unsafe-eval' https:\/\/cdn\.jsdelivr\.net/);assert.doesNotMatch(boot,/physics-module-loader\.js.*requiredAssets/);
});

test('Service Worker inclui módulos locais de física como opcionais e cache F94.13',()=>{
  const sw=read('lobby/sw.js');assert.match(sw,/stage76-f9413-rapier-bvh-pilot/);for(const f of ['physics-module-loader.js','mesh-bvh-collider.js','rapier-vehicle-world.js','campus-physics-pilot.js'])assert.match(sw,new RegExp(f.replaceAll('.','\\.')));assert.match(sw,/lobby3d\.js\?v=14\.10\.8\.96-f9413-rapier-bvh-pilot/);
});

test('lazy import e prefetch do Campus apontam para F94.13',()=>{
  assert.match(read('lobby/assets/core/world-adapter.js'),/lobby3d\.js\?v=14\.10\.8\.96-f9413-rapier-bvh-pilot/);assert.match(read('lobby/assets/world/world-runtime-prefetch.js'),/lobby3d\.js\?v=14\.10\.8\.96-f9413-rapier-bvh-pilot/);assert.match(read('lobby/assets/lobby.js'),/world-adapter\.js\?v=14\.10\.8\.96-f9413-rapier-bvh-pilot/);
});

test('física nova não acessa Supabase nem backend',()=>{
  for(const rel of ['lobby/assets/core/physics-v2/physics-module-loader.js','lobby/assets/core/physics-v2/mesh-bvh-collider.js','lobby/assets/core/physics-v2/rapier-vehicle-world.js','lobby/assets/core/physics-v2/campus-physics-pilot.js'])assert.doesNotMatch(read(rel),/supabase|service_role|edge-functions|iresvqw/i,rel);
});

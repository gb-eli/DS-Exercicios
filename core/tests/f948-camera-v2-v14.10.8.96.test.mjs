import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const THREE=await import(pathToFileURL(path.join(root,'lobby/vendor/three/three.module.min.js')).href);
const {createCameraController}=await import(pathToFileURL(path.join(root,'lobby/assets/render/camera-controller.js')).href+'?f948test');
const {viewpointZoomFov,CAMPUS_VIEWPOINTS}=await import(pathToFileURL(path.join(root,'lobby/assets/world/campus-viewpoints.js')).href+'?f948test');

class FakeCanvas{
  constructor(){this.handlers=new Map();}
  addEventListener(type,fn){if(!this.handlers.has(type))this.handlers.set(type,[]);this.handlers.get(type).push(fn);}
  removeEventListener(type,fn){const list=this.handlers.get(type)||[];this.handlers.set(type,list.filter(x=>x!==fn));}
  emit(type,event={}){for(const fn of this.handlers.get(type)||[])fn({target:this,pointerId:1,clientX:0,clientY:0,deltaY:0,preventDefault(){},...event});}
  setPointerCapture(){}
}
const canvas=new FakeCanvas();
const camera=new THREE.PerspectiveCamera(65,1,.1,1000);
const ctl=createCameraController({THREE,camera,canvas,initialYaw:0,initialPitch:0,initialDistance:6.8});
const player=new THREE.Vector3(0,0,0);
ctl.update({playerPosition:player,dt:.016});
ctl.setPitch(.8);ctl.update({playerPosition:player,dt:.016});
const dir=new THREE.Vector3();camera.getWorldDirection(dir);
assert.ok(dir.y>.45,'terceira pessoa deve conseguir olhar claramente para o céu');

ctl.setPitch(0);ctl.setInvertY(false);canvas.emit('pointerdown',{clientX:100,clientY:100});canvas.emit('pointermove',{clientX:100,clientY:50});canvas.emit('pointerup',{clientX:100,clientY:50});
assert.ok(ctl.getPitch()>0,'arrastar para cima deve olhar para cima no modo normal');
ctl.setPitch(0);ctl.setInvertY(true);canvas.emit('pointerdown',{clientX:100,clientY:100});canvas.emit('pointermove',{clientX:100,clientY:50});canvas.emit('pointerup',{clientX:100,clientY:50});
assert.ok(ctl.getPitch()<0,'Invert Y deve realmente inverter o eixo vertical');

ctl.setMode('vehicle');ctl.setYaw(0);for(let i=0;i<30;i++)ctl.update({playerPosition:player,dt:1/60,vehicleHeading:0,vehicleKind:'car'});
assert.equal(ctl.getMode(),'vehicle');assert.ok(Math.abs(Math.abs(ctl.getYaw())-Math.PI)<.5,'câmera de veículo deve acompanhar heading do veículo');
ctl.dispose();

for(const vp of CAMPUS_VIEWPOINTS)assert.equal(vp.maxZoom,50,'todo mirante deve suportar 50x');
assert.ok(viewpointZoomFov(CAMPUS_VIEWPOINTS[0],50)<1.5,'zoom 50x deve produzir FOV óptico estreito');

const html=fs.readFileSync(path.join(root,'lobby/index.html'),'utf8');
assert.match(html,/id="invert-y"/);assert.match(html,/id="viewpoint-zoom"[^>]*max="50"/);
const controllerSrc=fs.readFileSync(path.join(root,'lobby/assets/render/camera-controller.js'),'utf8');
assert.match(controllerSrc,/vehicle:Object\.freeze/);assert.match(controllerSrc,/cockpit:Object\.freeze/);assert.match(controllerSrc,/setInvertY/);

const runtimes=['airdrop-transit3d.js','campus-module3d.js','lobby3d.js','mars3d.js','military3d.js','moon3d.js','museu-hardware3d.js','parque-diversoes-agv3d.js','plugin-world-host.js','rural3d.js','space3d.js','vale3d.js','village3d.js'];
for(const name of runtimes){const src=fs.readFileSync(path.join(root,'lobby/assets',name),'utf8');assert.match(src,/initialInvertY/);assert.match(src,/setInvertY/);}
console.log('F94.8 Camera V2: PASS');

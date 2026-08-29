import { CAMPUS_ZONE_LAYOUT } from './campus-manifest.js?v=14.10.8.52';
import { CAMPUS_EXPERIENCES, PARKOUR_PLATFORMS } from './campus-experiences.js?v=14.10.8.52';

const HIGH_QUALITY=new Set(['high','ultra']);

function materialFactory(THREE,quality){
  const physical=HIGH_QUALITY.has(quality)&&typeof THREE.MeshPhysicalMaterial==='function';
  return function mat(color,{emissive=0x000000,emissiveIntensity=0,metalness=.08,roughness=.55,transparent=false,opacity=1,side=THREE.FrontSide,glass=false,clearcoat=0,clearcoatRoughness=.2}={}){
    if(glass&&physical){
      return new THREE.MeshPhysicalMaterial({
        color,emissive,emissiveIntensity,metalness:Math.max(.05,metalness),roughness:Math.min(.3,roughness),
        transparent:true,opacity:Math.min(.82,opacity),transmission:quality==='ultra'?.42:.24,thickness:.18,
        ior:1.45,clearcoat:.55,clearcoatRoughness:.16,side,depthWrite:false
      });
    }
    return new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity,metalness,roughness,transparent,opacity,side});
  };
}

function box(THREE,w,h,d,material,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);return mesh;}
function cylinder(THREE,r,h,material,x=0,y=0,z=0,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);mesh.position.set(x,y,z);return mesh;}
function setShadow(root,enabled){root.traverse?.(o=>{if(o.isMesh){o.castShadow=enabled;o.receiveShadow=enabled;}});}

function noiseTexture(THREE,quality,{base='#14262e',line='rgba(126,184,207,.13)',kind='pave'}={}){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');c.fillStyle=base;c.fillRect(0,0,256,256);
  if(kind==='pave'){
    c.strokeStyle=line;c.lineWidth=2;
    for(let y=0;y<=256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();}
    for(let row=0;row<8;row++)for(let col=0;col<=8;col++){const px=col*32+(row%2?16:0);c.beginPath();c.moveTo(px,row*32);c.lineTo(px,(row+1)*32);c.stroke();}
    for(let i=0;i<540;i++){const v=24+Math.random()*18;c.fillStyle=`rgba(${v},${v+12},${v+17},.2)`;c.fillRect(Math.random()*256,Math.random()*256,1,1);}
  }else{
    for(let i=0;i<3200;i++){const g=24+Math.random()*38;c.fillStyle=`rgba(${7+Math.random()*10},${g},${20+Math.random()*18},.2)`;c.fillRect(Math.random()*256,Math.random()*256,1,2+Math.random()*3);}
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=HIGH_QUALITY.has(quality)?8:4;return texture;
}

function addFacadeWindowGrid({THREE,group,mat,accent,frontZ,width=13.4,y=3.55,rows=2,cols=7}){
  const frame=mat(0x263b46,{metalness:.7,roughness:.24});
  const glow=mat(accent,{emissive:accent,emissiveIntensity:.5,metalness:.18,roughness:.24});
  const glass=mat(0x173d4b,{emissive:accent,emissiveIntensity:.11,metalness:.35,roughness:.16,transparent:true,opacity:.5,glass:true});
  const paneW=width/cols-.12,paneH=1.02;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const x=-width/2+(col+.5)*(width/cols),py=y+(row-(rows-1)/2)*1.28;
    group.add(box(THREE,paneW,paneH,.105,glass,x,py,frontZ));
  }
  for(let col=0;col<=cols;col++){const x=-width/2+col*(width/cols);group.add(box(THREE,.055,rows*1.3+.08,.14,frame,x,y,frontZ+.035));}
  group.add(box(THREE,width+.12,.06,.16,glow,0,y+rows*.66,frontZ+.04),box(THREE,width+.12,.045,.16,frame,0,y-rows*.66,frontZ+.04));
}

function createBuilding({THREE,quality,accent,position,rotation=0,title,subtitle,variant=0,spriteLabel}){
  const mat=materialFactory(THREE,quality),group=new THREE.Group();group.name=`campus-building-${String(title).toLowerCase()}`;group.position.set(...position);group.rotation.y=rotation;
  const concrete=mat(0x17242b,{roughness:.88}),concrete2=mat(0x22323a,{roughness:.8}),frame=mat(0x2b414c,{metalness:.66,roughness:.27}),dark=mat(0x071117,{roughness:.52}),accentMat=mat(accent,{emissive:accent,emissiveIntensity:.85,metalness:.25,roughness:.24}),glass=mat(0x153d4c,{emissive:accent,emissiveIntensity:.1,metalness:.32,roughness:.17,transparent:true,opacity:.48,glass:true});

  // Podium and layered massing: the facade is no longer a single box.
  group.add(box(THREE,16.6,.5,9.4,concrete,0,.25,0));
  group.add(box(THREE,13.8,5.7,7.9,dark,0,3.25,-.28));
  group.add(box(THREE,3.0,4.45,7.0,concrete2,-7.15,2.5,-.18),box(THREE,3.0,4.45,7.0,concrete2,7.15,2.5,-.18));
  group.add(box(THREE,14.7,.3,8.5,frame,0,6.2,-.18));
  const roof=box(THREE,15.9,.18,9.0,accentMat,0,6.46,-.18);roof.rotation.z=variant%2?.012:-.012;group.add(roof);

  // Deep front facade with a central entrance void.
  const frontZ=3.72;
  group.add(box(THREE,4.15,2.7,.22,concrete2,-5.15,1.72,frontZ),box(THREE,4.15,2.7,.22,concrete2,5.15,1.72,frontZ));
  group.add(box(THREE,3.95,.38,.28,frame,0,4.56,frontZ+.02));
  for(const x of[-7.15,-4.45,4.45,7.15])group.add(box(THREE,.2,5.15,.34,frame,x,3.08,frontZ+.04));
  addFacadeWindowGrid({THREE,group,mat,accent,frontZ:frontZ+.13,width:13.25,y:4.62,rows:2,cols:7});

  // Glass fins and luminous vertical blades create parallax while walking past the building.
  for(const x of[-5.75,-3.85,-1.95,1.95,3.85,5.75]){
    const fin=box(THREE,.09,3.25,.72,glass,x,2.22,frontZ+.45);fin.rotation.y=(variant%2?-.08:.08)*(Math.abs(x)/5.75);group.add(fin);
    group.add(box(THREE,.045,3.15,.76,accentMat,x,2.24,frontZ+.5));
  }

  // Main canopy, supports and recessed entrance frame.
  const canopy=box(THREE,7.25,.2,2.25,frame,0,4.28,4.62);canopy.rotation.x=-.035;group.add(canopy);
  group.add(box(THREE,6.75,.055,2.03,accentMat,0,4.17,4.62));
  for(const x of[-3.25,3.25])group.add(cylinder(THREE,.105,3.72,frame,x,1.86,4.36,14));
  group.add(box(THREE,4.9,.16,.25,accentMat,0,.28,4.05),box(THREE,.16,4.2,.25,accentMat,-2.38,2.28,4.02),box(THREE,.16,4.2,.25,accentMat,2.38,2.28,4.02));

  // Side wing glazing and roof crown.
  for(const sx of[-1,1]){
    group.add(box(THREE,2.38,2.35,.11,glass,sx*7.14,2.72,2.72));
    for(const y of[1.65,3.8])group.add(box(THREE,2.46,.055,.14,accentMat,sx*7.14,y,2.82));
  }
  const crownL=box(THREE,5.0,.17,.36,frame,-4.2,6.95,.2),crownR=box(THREE,5.0,.17,.36,frame,4.2,6.95,.2);crownL.rotation.z=.075;crownR.rotation.z=-.075;group.add(crownL,crownR,box(THREE,2.7,.12,.4,accentMat,0,7.15,.2));

  // Subtle rear wall depth so orbit camera does not reveal an empty box.
  group.add(box(THREE,13.5,4.1,.18,concrete2,0,2.65,-4.16));
  for(const x of[-5,-2.5,0,2.5,5])group.add(box(THREE,1.5,1.0,.09,glass,x,3.4,-4.27));

  if(spriteLabel){
    const label=spriteLabel(title,new THREE.Color(accent).getStyle(),5.15);label.position.set(0,7.85,2.55);group.add(label);
    const sub=spriteLabel(subtitle,'#b6dce7',4.2,{bg:'rgba(4,12,18,.72)'});sub.position.set(0,7.18,2.52);group.add(sub);
  }
  group.userData={kind:'campus-building',accent,frontLocalZ:frontZ};setShadow(group,true);return group;
}

function createCentralHub({THREE,quality,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();root.name='campus-central-hub';
  const stone=mat(0x21343e,{roughness:.58,metalness:.14}),metal=mat(0x2a414c,{metalness:.68,roughness:.24}),water=mat(0x248bb1,{emissive:0x137ba5,emissiveIntensity:.42,metalness:.12,roughness:.14,transparent:true,opacity:.7,glass:HIGH_QUALITY.has(quality)}),cyan=mat(0x48ddff,{emissive:0x36d2ff,emissiveIntensity:1.55,metalness:.18,roughness:.18}),holo=mat(0x57ddff,{emissive:0x36d2ff,emissiveIntensity:1.8,transparent:true,opacity:.24,roughness:.12,side:THREE.DoubleSide,glass:HIGH_QUALITY.has(quality)});
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.45,.55,64),stone);basin.position.y=.28;root.add(basin);
  const inner=new THREE.Mesh(new THREE.CylinderGeometry(3.62,3.84,.34,64),water);inner.position.y=.56;root.add(inner);
  const dais=new THREE.Mesh(new THREE.CylinderGeometry(1.72,2.2,1.02,40),metal);dais.position.y=1.02;root.add(dais);
  const core=cylinder(THREE,.58,3.65,holo,0,3.05,0,40);root.add(core);
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.73,2),cyan);orb.position.y=4.55;root.add(orb);
  const rings=[];for(const [r,y,tilt] of[[1.25,3.55,.12],[1.75,4.45,-.2],[2.3,5.0,.34]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.052,10,72),cyan);ring.position.y=y;ring.rotation.set(Math.PI/2+tilt,.12,tilt*.4);root.add(ring);rings.push(ring);}
  const crown=new THREE.Mesh(new THREE.TorusGeometry(2.78,.095,10,72),cyan);crown.rotation.x=Math.PI/2;crown.position.y=3.28;root.add(crown);
  const pool=inner;
  let statusBoard=null;
  if(spriteLabel){const label=spriteLabel('AGV • CAMPUS DS','#5fe3ff',7.0,{bg:'rgba(2,13,20,.76)'});label.position.set(0,6.45,0);root.add(label);statusBoard=spriteLabel('AGUARDANDO ATIVIDADE','#ffd166',4.2,{bg:'rgba(3,13,18,.88)'});statusBoard.position.set(0,3.15,-4.15);root.add(statusBoard);}
  root.userData={pool,crown,orb,rings,core,statusBoard};setShadow(root,true);pool.castShadow=false;core.castShadow=false;return root;
}

function createPlazaCanopy({THREE,quality}){
  const mat=materialFactory(THREE,quality),g=new THREE.Group(),metal=mat(0x263d49,{metalness:.7,roughness:.25}),light=mat(0x4bdcff,{emissive:0x36d2ff,emissiveIntensity:1.35,roughness:.18});
  const radius=10.55;
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,x=Math.sin(a)*radius,z=Math.cos(a)*radius;const post=box(THREE,.16,4.05,.16,metal,x,2.02,z);post.rotation.y=-a;g.add(post);
    const brace=box(THREE,.11,5.2,.11,metal,x*.52,4.22,z*.52);brace.rotation.z=Math.PI/2-.22;brace.rotation.y=-a;g.add(brace);
  }
  const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.1,10,112),metal);ring.rotation.x=Math.PI/2;ring.position.y=4.05;g.add(ring);
  const inner=new THREE.Mesh(new THREE.TorusGeometry(radius-.36,.045,8,112),light);inner.rotation.x=Math.PI/2;inner.position.y=4.0;g.add(inner);
  const inner2=new THREE.Mesh(new THREE.TorusGeometry(6.4,.035,8,96),light);inner2.rotation.x=Math.PI/2;inner2.position.y=4.34;g.add(inner2);
  g.userData={inner,inner2};setShadow(g,true);return g;
}

function createPlazaFloor({THREE,quality}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();
  const grass=mat(0x0b1c1a,{roughness:.97});grass.map=noiseTexture(THREE,quality,{base:'#0b1d1b',kind:'grass'});grass.map.repeat.set(20,14);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(92,62),grass);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;root.add(ground);
  const pave=mat(0x182830,{roughness:.78,metalness:.04});pave.map=noiseTexture(THREE,quality,{base:'#182830',kind:'pave'});pave.map.repeat.set(12,8);
  const plaza=new THREE.Mesh(new THREE.CircleGeometry(14.15,96),pave);plaza.rotation.x=-Math.PI/2;plaza.position.y=.018;plaza.receiveShadow=true;root.add(plaza);
  const accent=mat(0x36d2ff,{emissive:0x36d2ff,emissiveIntensity:.65,roughness:.3});
  for(const [inner,outer,y,opacity] of[[13.2,13.48,.034,1],[9.8,9.96,.039,.8],[5.05,5.17,.043,.9]]){
    const ring=new THREE.Mesh(new THREE.RingGeometry(inner,outer,96),accent.clone());ring.rotation.x=-Math.PI/2;ring.position.y=y;ring.material.transparent=opacity<1;ring.material.opacity=opacity;root.add(ring);
  }
  // Radial inlays connect hub, portals and buildings visually.
  for(let i=0;i<8;i++){const a=i*Math.PI/4,len=i%2===0?12.7:10.8;const strip=box(THREE,.075,.025,len,accent,0,.05,-len/2);strip.rotation.y=-a;root.add(strip);}
  const pathMat=pave.clone();pathMat.map=pave.map;pathMat.map.repeat.set(4,8);
  for(const p of[[0,-18,8,18],[0,18,8,18],[-25,0,25,6],[25,0,25,6],[-13,-11,6,5],[13,-11,6,5],[-13,11,6,5],[13,11,6,5]]){const m=box(THREE,p[2],.03,p[3],pathMat,p[0],.03,p[1]);m.receiveShadow=true;root.add(m);}
  root.userData={ground,plaza};return root;
}


function createExperienceZone({THREE,quality,experience,spriteLabel}){
  const mat=materialFactory(THREE,quality),g=new THREE.Group(),accent=new THREE.Color(experience.accent).getHex();
  const frame=mat(0x253a44,{metalness:.62,roughness:.3}),dark=mat(0x0a171d,{roughness:.75}),glow=mat(accent,{emissive:accent,emissiveIntensity:1.0,roughness:.22}),soft=mat(accent,{emissive:accent,emissiveIntensity:.2,transparent:true,opacity:.3,roughness:.22,glass:HIGH_QUALITY.has(quality)});
  g.name=`campus-experience-${experience.id}`;g.position.set(experience.x,0,experience.z);
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(3.35,3.5,.22,48),dark);pad.position.y=.11;g.add(pad);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(3.05,.055,8,64),glow);ring.rotation.x=Math.PI/2;ring.position.y=.25;g.add(ring);
  if(experience.type==='pool'){
    const rim=new THREE.Mesh(new THREE.BoxGeometry(6.2,.42,4.2),frame);rim.position.y=.35;g.add(rim);
    const water=new THREE.Mesh(new THREE.PlaneGeometry(5.55,3.55),soft);water.rotation.x=-Math.PI/2;water.position.y=.59;g.add(water);g.userData.water=water;
    for(const x of[-2.65,2.65])for(const z of[-1.65,1.65])g.add(cylinder(THREE,.07,.7,frame,x,.38,z,10));
    for(const x of[-3.15,3.15])for(let z=-1.7;z<=1.7;z+=.55)g.add(box(THREE,.48,.08,.38,dark,x,.18,z));
    const float=new THREE.Mesh(new THREE.TorusGeometry(.46,.13,10,28),glow);float.rotation.x=Math.PI/2;float.position.set(1.25,.72,-.45);g.add(float);g.userData.float=float;
    for(const z of[-.45,.45]){const rail=new THREE.Mesh(new THREE.TorusGeometry(.42,.045,8,20,Math.PI),frame);rail.rotation.set(0,Math.PI/2,Math.PI/2);rail.position.set(-2.65,1.05,z);g.add(rail);}
  }else if(experience.type==='parkour'){
    for(const [i,platform] of PARKOUR_PLATFORMS.entries()){
      const localX=platform.x-experience.x,localZ=platform.z-experience.z;
      const material=platform.checkpoint?(i===PARKOUR_PLATFORMS.length-1?glow:frame):glow;
      const b=box(THREE,platform.w,platform.h,platform.d,material,localX,platform.h/2,localZ);g.add(b);
      if(platform.checkpoint){const cap=box(THREE,platform.w*.72,.035,platform.d*.72,glow,localX,platform.h+.025,localZ);g.add(cap);if(spriteLabel){const number=spriteLabel(String(i),experience.accent,1.05,{bg:'rgba(8,10,16,.82)'});number.position.set(localX,platform.h+1.0,localZ);g.add(number);}}
    }
    const startGate=box(THREE,1.7,.08,.08,glow,-2.65,1.7,-1.6);g.add(startGate,box(THREE,.08,1.7,.08,frame,-3.4,.85,-1.6),box(THREE,.08,1.7,.08,frame,-1.9,.85,-1.6));
    const balance=box(THREE,2.2,.14,.28,frame,.05,.92,-1.0);balance.rotation.y=-.25;g.add(balance);
  }else if(experience.type==='playground'){
    for(const x of[-1.75,1.75])g.add(box(THREE,.12,2.6,.12,frame,x,1.45,0));
    g.add(box(THREE,3.65,.12,.12,frame,0,2.72,0));
    const swingSeats=[];
    for(const x of[-.75,.75]){g.add(box(THREE,.04,1.4,.04,glow,x,1.9,0));const seat=box(THREE,.65,.08,.38,frame,x,1.18,0);g.add(seat);swingSeats.push(seat);}
    const hoop=new THREE.Mesh(new THREE.TorusGeometry(.8,.08,8,32),glow);hoop.position.set(0,1.35,1.25);hoop.rotation.y=Math.PI/2;g.add(hoop);g.userData.swingSeats=swingSeats;
    const seesaw=box(THREE,2.65,.14,.42,glow,0,.72,-1.35);g.add(seesaw,cylinder(THREE,.22,.72,frame,0,.36,-1.35,16));g.userData.seesaw=seesaw;
    const tunnel=new THREE.Mesh(new THREE.TorusGeometry(.66,.13,8,24,Math.PI),frame);tunnel.rotation.z=Math.PI/2;tunnel.position.set(2.0,.75,1.2);g.add(tunnel);
    for(let i=0;i<4;i++){g.add(box(THREE,.07,1.65,.07,frame,-2.25+i*.48,.85,1.28),box(THREE,.55,.07,.07,glow,-2.01+i*.48,1.62,1.28));}
  }else if(experience.type==='slide'){
    for(let i=0;i<5;i++)g.add(box(THREE,.85,.15,.42,frame,-1.8+i*.42,.35+i*.38,-.9));
    const chute=box(THREE,3.8,.12,1.0,glow,.7,1.15,.45);chute.rotation.z=-.47;g.add(chute);
    for(const x of[-1,1])g.add(box(THREE,.08,2.1,.08,frame,-1.9,1.2,x*.42));
    const landing=box(THREE,1.5,.18,1.5,frame,-1.65,2.22,-.15);g.add(landing);
    for(const z of[-.58,.58]){const rail=box(THREE,4.0,.08,.08,frame,.68,1.75,z);rail.rotation.z=-.47;g.add(rail);}
    g.add(box(THREE,1.15,.08,1.2,soft,2.55,.08,.45));
  }else if(experience.type==='coaster'){
    const track=new THREE.Mesh(new THREE.TorusGeometry(2.45,.11,8,72),frame);track.rotation.x=Math.PI/2;track.position.y=1.1;g.add(track);
    const rail=new THREE.Mesh(new THREE.TorusGeometry(2.12,.045,8,72),glow);rail.rotation.x=Math.PI/2;rail.position.y=1.12;g.add(rail);const railOuter=new THREE.Mesh(new THREE.TorusGeometry(2.72,.045,8,72),glow);railOuter.rotation.x=Math.PI/2;railOuter.position.y=1.12;g.add(railOuter);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;g.add(box(THREE,.08,1.0,.08,frame,Math.cos(a)*2.45,.55,Math.sin(a)*2.45));}
    const car=box(THREE,.72,.34,.48,glow,2.45,1.18,0);g.add(car);g.userData.coasterCar=car;
    g.add(box(THREE,1.55,.24,1.25,dark,-2.95,.3,1.55),box(THREE,1.7,.1,1.35,glow,-2.95,.48,1.55));
    for(const x of[-3.65,-2.25])g.add(box(THREE,.08,1.75,.08,frame,x,1.05,2.0));g.add(box(THREE,1.5,.08,.08,glow,-2.95,1.88,2.0));
  }else if(experience.type==='tower'){
    for(let i=0;i<7;i++)g.add(box(THREE,1.15,.16,1.05,i===6?glow:frame,-2.35+i*.62,.28+i*.4,0));
    g.add(box(THREE,2.6,.18,2.3,frame,2.0,2.9,0));
    for(const [x,z] of[[.8,-.9],[.8,.9],[3.2,-.9],[3.2,.9]])g.add(box(THREE,.08,2.9,.08,frame,x,1.55,z));
    for(const z of[-1.02,1.02])g.add(box(THREE,2.55,.08,.08,glow,2.0,3.75,z));
    const beacon=new THREE.Mesh(new THREE.IcosahedronGeometry(.32,1),glow);beacon.position.set(2.0,4.35,0);g.add(beacon);g.userData.towerBeacon=beacon;
    if(spriteLabel){const height=spriteLabel('MIRANTE • 3 m',experience.accent,2.9,{bg:'rgba(3,12,18,.84)'});height.position.set(2.0,4.9,0);g.add(height);}
  }
  if(spriteLabel){const label=spriteLabel(experience.label,experience.accent,3.8,{bg:'rgba(3,12,18,.82)'});label.position.set(0,3.95,0);g.add(label);}
  g.userData.experience=experience;setShadow(g,quality!=='low');return g;
}

export function createCampusLighting({THREE,scene,quality,shadows,shadowSize}){
  const hemi=new THREE.HemisphereLight(0xc8e8ff,0x10231b,1.45);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xdceeff,2.0);key.position.set(-24,34,19);key.castShadow=!!shadows;key.shadow.mapSize.set(shadowSize,shadowSize);key.shadow.camera.left=-44;key.shadow.camera.right=44;key.shadow.camera.top=32;key.shadow.camera.bottom=-32;key.shadow.camera.near=.5;key.shadow.camera.far=95;scene.add(key);
  const warm=new THREE.DirectionalLight(0xffc28d,.55);warm.position.set(40,15,-55);scene.add(warm);
  const center=new THREE.PointLight(0x50d9ff,HIGH_QUALITY.has(quality)?18:13,22,2);center.position.set(0,5.5,0);scene.add(center);
  return {hemi,key,warm,center};
}

export function createCampusEnvironment({THREE,scene,zones,quality,spriteLabel}){
  const floor=createPlazaFloor({THREE,quality});scene.add(floor);
  const centralFountain=createCentralHub({THREE,quality,spriteLabel});scene.add(centralFountain);
  const canopy=createPlazaCanopy({THREE,quality});scene.add(canopy);
  const cameraCollisionRoots=[],buildingRoots=[],experienceRoots=[],experienceRefs=[];
  let variant=0;
  for(const zone of zones){
    const layout=CAMPUS_ZONE_LAYOUT[zone.key];if(!layout)continue;const accent=new THREE.Color(zone.accent).getHex();
    const building=createBuilding({THREE,quality,accent,position:layout.building,rotation:layout.buildingRotation||0,title:zone.label,subtitle:zone.name,variant:variant++,spriteLabel});
    scene.add(building);cameraCollisionRoots.push(building);buildingRoots.push(building);
    if(HIGH_QUALITY.has(quality)){
      const front=new THREE.Vector3(0,3.15,4.7).applyAxisAngle(new THREE.Vector3(0,1,0),layout.buildingRotation||0).add(new THREE.Vector3(layout.building[0],0,layout.building[2]));
      const light=new THREE.PointLight(accent,quality==='ultra'?7:4.5,10,2);light.position.copy(front);scene.add(light);
    }
  }
  for(const experience of CAMPUS_EXPERIENCES){
    const root=createExperienceZone({THREE,quality,experience,spriteLabel});scene.add(root);experienceRoots.push(root);
    experienceRefs.push({...experience,radius:experience.radius||3});
  }
  return {floor,centralFountain,beacon:centralFountain,canopy,cameraCollisionRoots,buildingRoots,experienceRoots,experienceRefs};
}

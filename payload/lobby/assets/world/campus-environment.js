import { CAMPUS_ZONE_LAYOUT } from './campus-manifest.js?v=14.10.8.59';
import { CAMPUS_EXPERIENCES, PARKOUR_PLATFORMS, CAMPUS_RIDES, CAMPUS_TRAIN_STATIONS, CAMPUS_TRAIN_ROUTE, CAMPUS_VERTICAL_SURFACES } from './campus-experiences.js?v=14.10.8.59';

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
  group.add(box(THREE,13.8,10.2,7.9,dark,0,5.5,-.28));
  group.add(box(THREE,3.0,8.4,7.0,concrete2,-7.15,4.4,-.18),box(THREE,3.0,8.4,7.0,concrete2,7.15,4.4,-.18));
  group.add(box(THREE,14.7,.3,8.5,frame,0,10.68,-.18));
  const roof=box(THREE,15.9,.18,9.0,accentMat,0,10.92,-.18);roof.rotation.z=variant%2?.012:-.012;group.add(roof);

  // Deep front facade with a central entrance void.
  const frontZ=3.72;
  group.add(box(THREE,4.15,2.7,.22,concrete2,-5.15,1.72,frontZ),box(THREE,4.15,2.7,.22,concrete2,5.15,1.72,frontZ));
  group.add(box(THREE,3.95,.38,.28,frame,0,4.56,frontZ+.02));
  for(const x of[-7.15,-4.45,4.45,7.15])group.add(box(THREE,.2,5.15,.34,frame,x,3.08,frontZ+.04));
  addFacadeWindowGrid({THREE,group,mat,accent,frontZ:frontZ+.13,width:13.25,y:6.5,rows:5,cols:7});

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
  const crownL=box(THREE,5.0,.17,.36,frame,-4.2,11.42,.2),crownR=box(THREE,5.0,.17,.36,frame,4.2,11.42,.2);crownL.rotation.z=.075;crownR.rotation.z=-.075;group.add(crownL,crownR,box(THREE,2.7,.12,.4,accentMat,0,11.62,.2));

  // Subtle rear wall depth so orbit camera does not reveal an empty box.
  group.add(box(THREE,13.5,8.65,.18,concrete2,0,5.05,-4.16));
  for(const x of[-5,-2.5,0,2.5,5])for(const y of[3.1,5.3,7.5,9.4])group.add(box(THREE,1.5,.9,.09,glass,x,y,-4.27));

  if(spriteLabel){
    const label=spriteLabel(title,new THREE.Color(accent).getStyle(),5.15);label.position.set(0,12.45,2.55);group.add(label);
    const sub=spriteLabel(subtitle,'#b6dce7',4.2,{bg:'rgba(4,12,18,.72)'});sub.position.set(0,11.78,2.52);group.add(sub);
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
  if(experience.type==='vale-portal'){
    // v14.10.8.59: estação/portal monumental do Vale, visível de longe no Campus 3D.
    const podium=box(THREE,8.6,.36,5.8,dark,0,.18,0);g.add(podium);
    for(const x of[-3.35,3.35]){
      g.add(box(THREE,.72,4.9,.82,frame,x,2.55,0));
      g.add(box(THREE,.22,4.55,.92,glow,x,2.55,.08));
      const cap=box(THREE,1.05,.34,1.1,frame,x,5.12,0);g.add(cap);
    }
    g.add(box(THREE,7.3,.58,.9,frame,0,5.2,0));
    g.add(box(THREE,6.7,.13,.96,glow,0,4.98,.04));
    const arch=new THREE.Mesh(new THREE.TorusGeometry(2.45,.22,12,56,Math.PI*1.78),glow);arch.rotation.z=Math.PI*.11;arch.position.y=2.55;g.add(arch);
    const core=new THREE.Mesh(new THREE.CircleGeometry(2.08,48),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));core.position.y=2.55;g.add(core);g.userData.portalCore=core;
    for(let i=0;i<4;i++){const halo=new THREE.Mesh(new THREE.TorusGeometry(1.18+i*.3,.028,6,48),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.16+i*.055}));halo.position.y=2.55;g.add(halo);}
    if(spriteLabel){
      const title=spriteLabel('VALE DO SILÍCIO AGV',experience.accent,5.8,{bg:'rgba(2,18,18,.9)'});title.position.set(0,6.25,.1);g.add(title);
      const sub=spriteLabel('27 EMPRESAS • 8 DISTRITOS','#caffdf',4.5,{bg:'rgba(2,13,16,.82)'});sub.position.set(0,5.65,.1);g.add(sub);
    }
  }else if(experience.type==='tool-building'){
    const facade=mat(0x0d2029,{roughness:.62,metalness:.18}),glass=mat(accent,{emissive:accent,emissiveIntensity:.28,transparent:true,opacity:.28,roughness:.16,glass:HIGH_QUALITY.has(quality)});
    const base=box(THREE,6.4,.34,4.9,dark,0,.2,0);g.add(base);
    const body=box(THREE,5.65,4.9,4.15,facade,0,2.7,0);g.add(body);
    const crown=box(THREE,6.1,.28,4.55,glow,0,5.25,0);g.add(crown);
    for(const x of[-1.7,0,1.7])for(const y of[1.65,3.15])g.add(box(THREE,1.05,.75,.06,glass,x,y,2.1));
    const door=box(THREE,1.45,2.1,.12,glass,0,1.25,2.16);g.add(door);
    const portal=new THREE.Mesh(new THREE.TorusGeometry(.9,.075,8,32),glow);portal.position.set(0,1.35,2.3);g.add(portal);
    if(spriteLabel&&experience.subtitle){const sub=spriteLabel(experience.subtitle,'#d9f8ff',3.2,{bg:'rgba(2,13,16,.84)'});sub.position.set(0,4.65,2.2);g.add(sub);}
  }else if(experience.type==='pool'){
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
    // Escorregador tubular curvo: a mesma spline é usada pela experiência guiada do jogador.
    const nodes=CAMPUS_RIDES.slide.nodes.map(n=>new THREE.Vector3(n.x-experience.x,n.y,n.z-experience.z));
    const curve=new THREE.CatmullRomCurve3(nodes,false,'catmullrom',.42),tube=new THREE.Mesh(new THREE.TubeGeometry(curve,72,.48,12,false),soft);g.add(tube);g.userData.slideCurve=curve;
    const railMat=frame;for(const side of[-1,1]){const railPoints=nodes.map((n,i)=>{const tangent=curve.getTangent(i/Math.max(1,nodes.length-1)),normal=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();return n.clone().addScaledVector(normal,side*.58).add(new THREE.Vector3(0,.28,0));});const railCurve=new THREE.CatmullRomCurve3(railPoints);g.add(new THREE.Mesh(new THREE.TubeGeometry(railCurve,64,.055,8,false),railMat));}
    // escada de acesso e plataforma superior
    for(let i=0;i<8;i++)g.add(box(THREE,.95,.16,.52,frame,-2.15+i*.28,.32+i*.48,-.95));
    const landing=box(THREE,2.0,.2,1.75,frame,-.95,4.05,-.75);g.add(landing);
    for(const z of[-1.48,-.02])g.add(box(THREE,2.0,.08,.08,glow,-.95,4.92,z));
    g.add(box(THREE,1.45,.08,1.35,soft,2.55,.08,.95));
  }else if(experience.type==='coaster'){
    // Estação local do monotrilho; o trilho completo é criado pelo transit network global.
    const platform=box(THREE,5.6,.34,2.2,dark,0,.22,0);g.add(platform);
    for(const z of[-.82,.82])g.add(box(THREE,5.4,.055,.08,glow,0,.44,z));
    const canopy=box(THREE,5.0,.12,1.7,frame,0,2.75,0);g.add(canopy);for(const x of[-2.15,2.15])g.add(box(THREE,.1,2.45,.1,frame,x,1.45,0));
    if(spriteLabel){const st=spriteLabel('ESTAÇÃO • PRAÇA',experience.accent,3.1,{bg:'rgba(9,5,22,.86)'});st.position.set(0,3.45,0);g.add(st);}
  }else if(experience.type==='tower'){
    // Torre de controle de 15 m: escada helicoidal simplificada + três decks panorâmicos.
    const mast=box(THREE,2.3,13.6,2.3,dark,1.1,6.8,0);g.add(mast);
    for(let level=0;level<3;level++){const y=4.8+level*4.2,deck=box(THREE,5.6,.22,5.0,frame,1.1,y,0);g.add(deck);for(const z of[-2.35,2.35])g.add(box(THREE,5.45,.08,.08,glow,1.1,y+.85,z));for(const x of[-1.55,3.75])g.add(box(THREE,.08,.85,.08,glow,x,y+.45,0));}
    for(let i=0;i<24;i++){const t=i/23,a=t*Math.PI*3.5,r=2.25,x=1.1+Math.cos(a)*r,z=Math.sin(a)*r,y=.35+t*13.55;const step=box(THREE,1.05,.16,.5,i===23?glow:frame,x,y,z);step.rotation.y=-a;g.add(step);}
    const cabin=box(THREE,4.3,2.25,3.8,soft,1.1,15.0,0);g.add(cabin);const roof=box(THREE,5.1,.22,4.6,glow,1.1,16.25,0);g.add(roof);
    const beacon=new THREE.Mesh(new THREE.IcosahedronGeometry(.42,1),glow);beacon.position.set(1.1,17.0,0);g.add(beacon);g.userData.towerBeacon=beacon;
    if(spriteLabel){const height=spriteLabel('TORRE DE CONTROLE • 15 m',experience.accent,3.6,{bg:'rgba(3,12,18,.88)'});height.position.set(1.1,17.7,0);g.add(height);}
  }
  if(spriteLabel&&experience.type!=='vale-portal'){const label=spriteLabel(experience.label,experience.accent,3.8,{bg:'rgba(3,12,18,.82)'});label.position.set(0,3.95,0);g.add(label);}
  g.userData.experience=experience;setShadow(g,quality!=='low');return g;
}


function createUrbanLayer({THREE,quality,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();root.name='campus-urban-layer';
  const road=mat(0x10191e,{roughness:.94}),walk=mat(0x33434a,{roughness:.82}),wall=mat(0x23343b,{roughness:.86}),line=mat(0xe8f4f6,{emissive:0xa8d7df,emissiveIntensity:.12,roughness:.5}),runway=mat(0x0b1115,{roughness:.96});
  // rua perimetral + eixos de serviço
  for(const [x,z,w,d] of[[0,-22,72,5.2],[0,22,72,5.2],[-37,0,5.2,42],[37,0,5.2,42]])root.add(box(THREE,w,.035,d,road,x,.025,z));
  for(const [x,z,w,d] of[[0,-18.7,72,.8],[0,-25.3,72,.8],[0,18.7,72,.8],[0,25.3,72,.8],[-33.9,0,.8,42],[-40.1,0,.8,42],[33.9,0,.8,42],[40.1,0,.8,42]])root.add(box(THREE,w,.07,d,walk,x,.055,z));
  // muros com quatro aberturas de acesso
  for(const [x,z,w,d] of[[0,-24.7,27,.32],[-25,-24.7,18,.32],[25,-24.7,18,.32],[0,24.7,27,.32],[-25,24.7,18,.32],[25,24.7,18,.32],[-39.3,-12,.32,18],[-39.3,12,.32,18],[39.3,-12,.32,18],[39.3,12,.32,18]])root.add(box(THREE,w,1.65,d,wall,x,.82,z));
  // pista de pouso no setor sul, paralela ao eixo leste-oeste
  root.add(box(THREE,54,.06,4.8,runway,0,.05,22));
  for(let x=-23;x<=23;x+=5.75)root.add(box(THREE,2.6,.015,.16,line,x,.09,22));
  for(const z of[20.1,23.9])root.add(box(THREE,54,.02,.08,line,0,.095,z));
  if(spriteLabel){const sign=spriteLabel('PISTA AGV • 09/27','#dff8ff',4.1,{bg:'rgba(5,10,14,.8)'});sign.position.set(0,2.35,22);root.add(sign);}
  // escadas externas, pontes para telhados e rampa panorâmica compartilhadas com a física.
  for(const s of CAMPUS_VERTICAL_SURFACES){if(s.type==='roof')continue;const thickness=s.type==='ramp'?.12:.18,m=box(THREE,s.w,thickness,s.d,s.type==='ramp'?walk:frameMaterial(mat),s.x,Math.max(.06,s.h-thickness/2),s.z);root.add(m);}
  return root;
}
function frameMaterial(mat){return mat(0x314650,{metalness:.48,roughness:.42});}

function createTransitNetwork({THREE,quality,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();root.name='campus-monotrilho';const steel=mat(0x2d3c47,{metalness:.72,roughness:.27}),glow=mat(0xb58cff,{emissive:0x8d5cff,emissiveIntensity:1.1,roughness:.18}),dark=mat(0x10151d,{metalness:.48,roughness:.35}),glass=mat(0x19344b,{emissive:0x7c5cff,emissiveIntensity:.14,transparent:true,opacity:.55,glass:true});
  const pts=CAMPUS_TRAIN_ROUTE.map(p=>new THREE.Vector3(p.x,1.85,p.z)),curve=new THREE.CatmullRomCurve3(pts,true,'centripetal');
  root.add(new THREE.Mesh(new THREE.TubeGeometry(curve,180,.13,8,true),steel));
  const inner=new THREE.Mesh(new THREE.TubeGeometry(curve,180,.035,6,true),glow);root.add(inner);
  for(let i=0;i<44;i++){const p=curve.getPoint(i/44);root.add(box(THREE,.12,1.75,.12,steel,p.x,.88,p.z));}
  const stations=[];for(const station of CAMPUS_TRAIN_STATIONS){const platform=box(THREE,4.8,.28,2.0,dark,station.x,.25,station.z);root.add(platform);const stripe=box(THREE,4.6,.04,.12,glow,station.x,.42,station.z+.72);root.add(stripe);if(spriteLabel){const label=spriteLabel(`ESTAÇÃO • ${station.name}`,station.accent||'#b58cff',3.2,{bg:'rgba(7,5,18,.86)'});label.position.set(station.x,2.8,station.z);root.add(label);}stations.push({station,platform});}
  const train=new THREE.Group();train.name='monotrilho-train';
  for(let i=0;i<3;i++){const car=new THREE.Group();car.position.z=i*1.55;car.add(box(THREE,1.25,.72,1.4,dark,0,.68,0),box(THREE,1.08,.42,1.1,glass,0,.88,0),box(THREE,1.32,.08,1.42,glow,0,1.08,0));for(const x of[-.42,.42])car.add(cylinder(THREE,.16,.12,steel,x,.25,.42,12),cylinder(THREE,.16,.12,steel,x,.25,-.42,12));train.add(car);}root.add(train);
  return{root,train,stations,curve};
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
  const urban=createUrbanLayer({THREE,quality,spriteLabel});scene.add(urban);
  const centralFountain=createCentralHub({THREE,quality,spriteLabel});scene.add(centralFountain);
  const canopy=createPlazaCanopy({THREE,quality});scene.add(canopy);
  const cameraCollisionRoots=[urban],buildingRoots=[],experienceRoots=[],experienceRefs=[];
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
  const transit=createTransitNetwork({THREE,quality,spriteLabel});scene.add(transit.root);cameraCollisionRoots.push(transit.root);
  for(const experience of CAMPUS_EXPERIENCES){
    const root=createExperienceZone({THREE,quality,experience,spriteLabel});scene.add(root);experienceRoots.push(root);
    experienceRefs.push({...experience,radius:experience.radius||3});
  }
  return {floor,urban,transit,centralFountain,beacon:centralFountain,canopy,cameraCollisionRoots,buildingRoots,experienceRoots,experienceRefs};
}

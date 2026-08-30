import { CAMPUS_ZONE_LAYOUT } from './campus-manifest.js?v=14.10.8.65';
import { CAMPUS_EXPERIENCES, PARKOUR_PLATFORMS, CAMPUS_RIDES, CAMPUS_TRAIN_STATIONS, CAMPUS_TRAIN_ROUTE, CAMPUS_VERTICAL_SURFACES } from './campus-experiences.js?v=14.10.8.65';
import { CAMPUS_DESTINATION_MAP } from './campus-destinations.js?v=14.10.8.65';
import { CAMPUS_CONNECTIONS, CAMPUS_DISTRICT_GATES, CAMPUS_SKYBRIDGES, CAMPUS_WAYFINDING } from './campus-connections.js?v=14.10.8.65';
import { CAMPUS_ROAD_HIERARCHY, CAMPUS_THEME_PLAZAS, CAMPUS_GARAGES, CAMPUS_CROSSWALKS, CAMPUS_PEDESTRIAN_BRIDGES, CAMPUS_PEDESTRIAN_SURFACES, CAMPUS_STATION_PROFILES, CAMPUS_VALE_MONUMENTAL_LINK } from './campus-city-network.js?v=14.10.8.65';
import { CAMPUS_GARAGE_FLEET, CAMPUS_STATION_LINKS, CAMPUS_VALE_CEREMONIAL_GATE } from './campus-live-systems.js?v=14.10.8.65';

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


function segmentBox({THREE,from,to,width,height,material,y=.05}){
  const dx=to.x-from.x,dz=to.z-from.z,len=Math.max(.01,Math.hypot(dx,dz));
  const mesh=box(THREE,width,height,len,material,(from.x+to.x)/2,y,(from.z+to.z)/2);
  mesh.rotation.y=Math.atan2(dx,dz);return mesh;
}

function createToolBuilding({THREE,quality,experience,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();
  const fp=experience.footprint||{width:7.2,depth:5.2,height:6.4},w=fp.width,d=fp.depth,h=fp.height,accent=new THREE.Color(experience.accent).getHex();
  const dark=mat(0x071117,{roughness:.6}),facade=mat(0x10242d,{roughness:.68,metalness:.14}),facade2=mat(0x1b313a,{roughness:.56,metalness:.24}),steel=mat(0x334b56,{metalness:.72,roughness:.24});
  const glow=mat(accent,{emissive:accent,emissiveIntensity:.82,metalness:.28,roughness:.2}),glass=mat(0x153d4b,{emissive:accent,emissiveIntensity:.12,metalness:.32,roughness:.14,transparent:true,opacity:.5,glass:true});
  const front=d/2+.055;
  root.add(box(THREE,w+.7,.34,d+.7,dark,0,.18,0));
  const windowGrid=(yStart,rows=2,cols=4,span=w*.72)=>{for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const px=-span/2+(c+.5)*(span/cols),py=yStart+r*1.25;root.add(box(THREE,span/cols-.18,.72,.07,glass,px,py,front+.02));}};
  const doorway=(width=1.45,height=2.2)=>{root.add(box(THREE,width,height,.13,glass,0,height/2+.18,front+.09));root.add(box(THREE,width+.34,.09,.2,glow,0,height+.42,front+.12));};
  const entryPad=()=>{root.add(box(THREE,2.55,.08,1.25,facade2,0,.08,d/2+.7));for(const x of[-1.05,1.05])root.add(box(THREE,.07,.68,.07,glow,x,.38,d/2+.88));};
  switch(experience.architecture){
    case 'research-lab':{
      root.add(box(THREE,w*.62,h*.76,d*.88,facade,-w*.17,h*.38+.25,0));
      root.add(box(THREE,w*.32,h*.92,d*.72,facade2,w*.29,h*.46+.25,-.18));
      const pod=cylinder(THREE,w*.13,h*.8,glass,w*.35,h*.4+.32,d*.25,28);root.add(pod);
      for(const y of[1.7,3.05,4.4])root.add(box(THREE,w*.47,.08,.11,glow,-w*.16,y,front+.02));
      windowGrid(1.45,3,3,w*.48);doorway();entryPad();break;
    }
    case 'cyber-fortress':{
      root.add(box(THREE,w*.82,h*.82,d*.92,facade,0,h*.41+.25,0));
      for(const x of[-w*.43,w*.43]){root.add(box(THREE,.62,h*.98,.72,dark,x,h*.49+.22,.02));for(let y=1.0;y<h;y+=1.05)root.add(box(THREE,.12,.48,.8,glow,x,y,.02));}
      for(const x of[-w*.22,0,w*.22])root.add(box(THREE,.52,h*.46,.08,glass,x,h*.55,front+.02));
      root.add(box(THREE,w*.68,.22,d*.25,glow,0,h*.86,0));doorway(1.3,2.15);entryPad();break;
    }
    case 'observatory':{
      const base=cylinder(THREE,w*.34,h*.55,facade,0,h*.275+.25,0,36);root.add(base);
      const ring=cylinder(THREE,w*.39,.28,steel,0,h*.56+.2,0,36);root.add(ring);
      const dome=new THREE.Mesh(new THREE.SphereGeometry(w*.3,32,16,0,Math.PI*2,0,Math.PI/2),glass);dome.position.set(0,h*.58+.22,0);dome.scale.y=.72;root.add(dome);
      const slit=box(THREE,.18,h*.24,w*.44,glow,0,h*.72,0);slit.rotation.y=.42;root.add(slit);
      root.add(box(THREE,w*.28,h*.36,d*.55,facade2,-w*.33,h*.18+.25,.12));doorway(1.25,2.0);entryPad();break;
    }
    case 'challenge-arena':{
      root.add(box(THREE,w*.9,h*.58,d*.88,facade,0,h*.29+.25,0));
      root.add(box(THREE,w*.72,h*.24,d*.68,facade2,0,h*.7,0));
      const halo=new THREE.Mesh(new THREE.TorusGeometry(w*.26,.12,10,48),glow);halo.rotation.x=Math.PI/2;halo.position.y=h*.9;root.add(halo);
      for(const x of[-w*.32,-w*.12,w*.12,w*.32])root.add(box(THREE,.36,1.65,.09,glass,x,2.0,front+.02));
      doorway(1.5,2.15);entryPad();break;
    }
    case 'arcade':{
      root.add(box(THREE,w*.88,h*.7,d*.9,facade,0,h*.35+.25,0));
      root.add(box(THREE,w*.96,.72,d*.2,dark,0,h*.73,d*.32));
      root.add(box(THREE,w*.82,.12,.18,glow,0,h*.75,front+.05));
      for(const x of[-w*.4,w*.4])root.add(box(THREE,.16,h*.64,.18,glow,x,h*.34,front+.05));
      windowGrid(1.55,2,3,w*.58);doorway(1.6,2.0);entryPad();break;
    }
    case 'innovation-center':{
      root.add(box(THREE,w*.48,h*.9,d*.7,glass,w*.12,h*.45+.25,-.12));
      root.add(box(THREE,w*.43,h*.48,d*.88,facade,-w*.28,h*.24+.25,.06));
      for(let y=1.2;y<h*.86;y+=1.15)root.add(box(THREE,w*.43,.07,.12,glow,w*.12,y,front-.12));
      root.add(box(THREE,.18,h*.82,.16,glow,w*.37,h*.44,front-.12));doorway(1.4,2.15);entryPad();break;
    }
    case 'exam-center':{
      root.add(box(THREE,w*.9,h*.72,d*.88,facade,0,h*.36+.25,0));
      root.add(box(THREE,w*.98,.34,d*.94,facade2,0,h*.75,0));
      for(const x of[-w*.34,-w*.17,w*.17,w*.34])root.add(cylinder(THREE,.12,h*.42,steel,x,h*.21+.35,front+.18,14));
      windowGrid(3.35,2,5,w*.72);doorway(1.65,2.25);entryPad();break;
    }
    case 'bank':{
      root.add(box(THREE,w*.88,h*.66,d*.88,facade,0,h*.33+.25,0));
      for(const x of[-w*.31,-w*.105,w*.105,w*.31])root.add(cylinder(THREE,.13,h*.46,steel,x,h*.23+.32,front+.22,16));
      root.add(box(THREE,w*.78,.28,.48,facade2,0,h*.59,front-.02));
      root.add(box(THREE,w*.68,.1,.52,glow,0,h*.64,front+.02));windowGrid(3.65,1,4,w*.62);doorway(1.35,2.1);entryPad();break;
    }
    case 'store':{
      root.add(box(THREE,w*.9,h*.7,d*.88,glass,0,h*.35+.25,0));
      root.add(box(THREE,w*.92,.25,d*.92,facade2,0,h*.73,0));
      for(const x of[-w*.33,w*.33]){root.add(box(THREE,w*.22,1.35,.1,glass,x,1.25,front+.08));root.add(box(THREE,w*.24,.06,.13,glow,x,2.0,front+.1));}
      for(const x of[-w*.44,w*.44])root.add(box(THREE,.1,h*.62,.12,glow,x,h*.34,front+.04));doorway(1.55,2.1);entryPad();break;
    }
    case 'campus-hall':
    default:{
      root.add(box(THREE,w*.88,h*.58,d*.9,facade,0,h*.29+.25,0));
      root.add(box(THREE,w*.62,h*.32,d*.72,facade2,0,h*.72,-.15));
      for(const x of[-w*.41,w*.41])root.add(box(THREE,w*.16,h*.45,d*.7,dark,x,h*.225+.35,-.08));
      windowGrid(1.55,3,5,w*.66);root.add(box(THREE,w*.72,.1,.16,glow,0,h*.82,front-.28));doorway(1.6,2.25);entryPad();break;
    }
  }
  if(spriteLabel){
    const title=spriteLabel(experience.label,experience.accent,Math.max(3.5,w*.55),{bg:'rgba(2,13,16,.9)'});title.position.set(0,h+.95,0);root.add(title);
    const sub=spriteLabel(experience.subtitle||experience.district||'AGV EDUCATION CORE','#d9f8ff',Math.max(2.7,w*.43),{bg:'rgba(2,13,16,.8)'});sub.position.set(0,h+.35,0);root.add(sub);
  }
  root.userData={kind:'tool-building',destinationId:experience.id,architecture:experience.architecture,entrance:experience.entrance};
  setShadow(root,quality!=='low');return root;
}

function createCampusConnectionLayer({THREE,quality,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();root.name='campus-connections-v2';
  const walk=mat(0x263a43,{roughness:.84}),edge=mat(0x6ddbf3,{emissive:0x3cc7ea,emissiveIntensity:.35,roughness:.35}),steel=mat(0x2f434d,{metalness:.7,roughness:.28}),glass=mat(0x183c4b,{emissive:0x5fd7ef,emissiveIntensity:.1,transparent:true,opacity:.42,glass:true});
  for(const connection of CAMPUS_CONNECTIONS){
    for(let i=1;i<connection.nodes.length;i++){
      const a=connection.nodes[i-1],b=connection.nodes[i],accent=new THREE.Color(connection.accent).getHex(),accentMat=mat(accent,{emissive:accent,emissiveIntensity:.42,roughness:.28});
      root.add(segmentBox({THREE,from:a,to:b,width:connection.width,height:.09,material:walk,y:.075}));
      const dx=b.x-a.x,dz=b.z-a.z,len=Math.max(.01,Math.hypot(dx,dz)),nx=-dz/len,nz=dx/len;
      for(const side of[-1,1]){const off=(connection.width/2-.08)*side;root.add(segmentBox({THREE,from:{x:a.x+nx*off,z:a.z+nz*off},to:{x:b.x+nx*off,z:b.z+nz*off},width:.055,height:.035,material:accentMat,y:.135}));}
    }
  }
  for(const gate of CAMPUS_DISTRICT_GATES){
    const g=new THREE.Group();g.position.set(gate.x,0,gate.z);g.rotation.y=gate.rotation||0;const accent=new THREE.Color(gate.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.72,roughness:.24});
    for(const x of[-2.2,2.2])g.add(box(THREE,.22,2.6,.28,steel,x,1.3,0));g.add(box(THREE,4.65,.18,.32,glow,0,2.55,0));
    if(spriteLabel){const label=spriteLabel(gate.name,gate.accent,3.5,{bg:'rgba(3,13,18,.82)'});label.position.set(0,3.15,0);g.add(label);}root.add(g);
  }
  for(const sign of CAMPUS_WAYFINDING){const pylon=box(THREE,.16,1.9,.16,steel,sign.x,.95,sign.z);root.add(pylon);if(spriteLabel){const title=spriteLabel(sign.title,sign.accent,2.85,{bg:'rgba(2,12,17,.88)'});title.position.set(sign.x,2.35,sign.z);root.add(title);const detail=spriteLabel(sign.detail,'#d8edf5',2.45,{bg:'rgba(2,12,17,.74)'});detail.position.set(sign.x,1.9,sign.z);root.add(detail);}}
  for(const bridge of CAMPUS_SKYBRIDGES){const a=CAMPUS_DESTINATION_MAP[bridge.from],b=CAMPUS_DESTINATION_MAP[bridge.to];if(!a||!b)continue;const from={x:a.x,z:a.z},to={x:b.x,z:b.z},y=bridge.height,accent=new THREE.Color(bridge.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.48,roughness:.22});root.add(segmentBox({THREE,from,to,width:.96,height:.18,material:steel,y}));root.add(segmentBox({THREE,from,to,width:.72,height:.08,material:glass,y:y+.62}));const dx=to.x-from.x,dz=to.z-from.z,len=Math.max(.01,Math.hypot(dx,dz)),nx=-dz/len,nz=dx/len;for(const side of[-1,1]){const off=.48*side;root.add(segmentBox({THREE,from:{x:from.x+nx*off,z:from.z+nz*off},to:{x:to.x+nx*off,z:to.z+nz*off},width:.055,height:.68,material:glow,y:y+.32}));}}
  return root;
}

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
    // v14.10.8.65: estação/portal monumental do Vale, visível de longe no Campus 3D.
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
    g.rotation.y=Number(experience.rotation||0);
    const building=createToolBuilding({THREE,quality,experience,spriteLabel});g.add(building);
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
  if(spriteLabel&&experience.type!=='vale-portal'&&experience.type!=='tool-building'){const label=spriteLabel(experience.label,experience.accent,3.8,{bg:'rgba(3,12,18,.82)'});label.position.set(0,3.95,0);g.add(label);}
  g.userData.experience=experience;setShadow(g,quality!=='low');return g;
}



function createCampusCityLayer({THREE,quality,spriteLabel}){
  const mat=materialFactory(THREE,quality),root=new THREE.Group();root.name='campus-city-network-v62';
  const asphalt=mat(0x0c1419,{roughness:.96}),collector=mat(0x121e24,{roughness:.93}),service=mat(0x1b2b31,{roughness:.9});
  const walk=mat(0x35474e,{roughness:.84}),lane=mat(0xe6f5f7,{emissive:0x6e9ca6,emissiveIntensity:.12,roughness:.48});
  const steel=mat(0x30444e,{metalness:.68,roughness:.3}),dark=mat(0x0b151b,{metalness:.25,roughness:.55}),glass=mat(0x173c48,{emissive:0x43d9ff,emissiveIntensity:.1,transparent:true,opacity:.42,glass:true});
  for(const road of CAMPUS_ROAD_HIERARCHY){
    const roadMat=road.class==='arterial'?asphalt:road.class==='collector'?collector:service;
    for(let i=1;i<road.nodes.length;i++){
      const a=road.nodes[i-1],b=road.nodes[i];
      root.add(segmentBox({THREE,from:a,to:b,width:road.width,height:.045,material:roadMat,y:.035}));
      const dx=b.x-a.x,dz=b.z-a.z,len=Math.max(.01,Math.hypot(dx,dz)),nx=-dz/len,nz=dx/len;
      for(const side of[-1,1]){
        const off=(road.width/2+road.sidewalk/2+.12)*side;
        root.add(segmentBox({THREE,from:{x:a.x+nx*off,z:a.z+nz*off},to:{x:b.x+nx*off,z:b.z+nz*off},width:road.sidewalk,height:.07,material:walk,y:.065}));
      }
      if(road.class==='arterial'){
        const marks=Math.max(1,Math.floor(len/3.8));
        for(let m=0;m<marks;m++){
          const t=(m+.5)/marks,px=a.x+dx*t,pz=a.z+dz*t,mark=box(THREE,.13,.018,1.55,lane,px,.072,pz);mark.rotation.y=Math.atan2(dx,dz);root.add(mark);
        }
      }
    }
  }
  for(const cross of CAMPUS_CROSSWALKS){
    const stripes=7;
    for(let i=0;i<stripes;i++){
      const t=(i-(stripes-1)/2)*.38;
      const stripe=cross.axis==='x'?box(THREE,.22,.02,cross.d*.82,lane,cross.x+t,.086,cross.z):box(THREE,cross.w*.82,.02,.22,lane,cross.x,.086,cross.z+t);root.add(stripe);
    }
  }
  for(const plaza of CAMPUS_THEME_PLAZAS){
    const accent=new THREE.Color(plaza.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.3,roughness:.4});
    const disk=new THREE.Mesh(new THREE.CylinderGeometry(plaza.radius,plaza.radius,.08,52),walk);disk.position.set(plaza.x,.04,plaza.z);root.add(disk);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(plaza.radius-.42,.08,8,64),glow);ring.rotation.x=Math.PI/2;ring.position.set(plaza.x,.13,plaza.z);root.add(ring);
    if(spriteLabel){const label=spriteLabel(`${plaza.icon} ${plaza.name.toUpperCase()}`,plaza.accent,3.6,{bg:'rgba(3,14,20,.84)'});label.position.set(plaza.x,2.7,plaza.z);root.add(label);}
  }
  for(const garage of CAMPUS_GARAGES){
    const g=new THREE.Group(),accent=new THREE.Color(garage.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.55,roughness:.25});g.position.set(garage.x,0,garage.z);
    g.add(box(THREE,garage.w,.12,garage.d,dark,0,.06,0),box(THREE,garage.w+.25,.15,garage.d+.25,steel,0,2.55,0));
    for(const x of[-garage.w/2+.35,garage.w/2-.35])for(const z of[-garage.d/2+.35,garage.d/2-.35])g.add(box(THREE,.13,2.45,.13,steel,x,1.25,z));
    for(let i=1;i<garage.capacity;i++){const x=-garage.w/2+(i/garage.capacity)*garage.w;g.add(box(THREE,.035,.018,garage.d*.78,lane,x,.13,0));}
    g.add(box(THREE,garage.w*.72,.08,.13,glow,0,2.48,-garage.d/2+.04));
    if(spriteLabel){const label=spriteLabel(`P • ${garage.name.toUpperCase()}`,garage.accent,3.2,{bg:'rgba(4,13,18,.86)'});label.position.set(0,3.25,0);g.add(label);}root.add(g);
  }
  // Frota urbana leve: veículos de ambientação nas garagens. Não altera economia nem inventário.
  for(const vehicle of CAMPUS_GARAGE_FLEET){
    const garage=CAMPUS_GARAGES.find(item=>item.id===vehicle.garageId);if(!garage)continue;const accent=new THREE.Color(vehicle.accent).getHex(),body=mat(accent,{metalness:.48,roughness:.32}),glassVehicle=mat(0x173442,{emissive:accent,emissiveIntensity:.12,transparent:true,opacity:.62,glass:true}),rubber=mat(0x090d10,{roughness:.96});
    const g=new THREE.Group();g.position.set(garage.x+vehicle.slot,0,garage.z);
    const long=vehicle.kind==='bus'||vehicle.kind==='van',small=vehicle.kind==='bike'||vehicle.kind==='drone';
    if(vehicle.kind==='drone'){g.add(box(THREE,1.0,.18,.7,body,0,.55,0));for(const [x,z] of[[-.62,-.48],[.62,-.48],[-.62,.48],[.62,.48]]){g.add(box(THREE,.72,.045,.08,body,x*.55,.56,z*.55));const rotor=new THREE.Mesh(new THREE.TorusGeometry(.24,.025,6,18),body);rotor.rotation.x=Math.PI/2;rotor.position.set(x,.66,z);g.add(rotor);}}
    else if(vehicle.kind==='bike'){g.add(box(THREE,.18,.48,1.15,body,0,.52,0));for(const z of[-.58,.58]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.28,.07,8,20),rubber);wheel.rotation.y=Math.PI/2;wheel.position.set(0,.28,z);g.add(wheel);}}
    else{const len=long?2.45:1.75,wid=long?1.05:.95;g.add(box(THREE,wid,.55,len,body,0,.48,0),box(THREE,wid*.8,.38,len*.52,glassVehicle,0,.88,-.08));for(const x of[-wid*.42,wid*.42])for(const z of[-len*.32,len*.32]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.12,12),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.25,z);g.add(wheel);}}
    if(spriteLabel&&!small){const label=spriteLabel(vehicle.label,vehicle.accent,2.0,{bg:'rgba(3,12,18,.72)'});label.position.set(0,1.65,0);g.add(label);}root.add(g);
  }
  // Conectores cobertos entre estações e os distritos/prédios próximos.
  for(const link of CAMPUS_STATION_LINKS){const accent=new THREE.Color(link.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.45,roughness:.28});root.add(segmentBox({THREE,from:link.from,to:link.to,width:1.45,height:.06,material:walk,y:.07}));const dx=link.to.x-link.from.x,dz=link.to.z-link.from.z,len=Math.hypot(dx,dz),steps=Math.max(2,Math.floor(len/3));for(let i=0;i<=steps;i++){const t=i/steps,x=link.from.x+dx*t,z=link.from.z+dz*t;root.add(box(THREE,.08,2.35,.08,steel,x,1.2,z),box(THREE,.95,.06,.08,glow,x,2.35,z));}}
  // Portal metropolitano marca fisicamente a transição Campus ↔ Vale.
  {const gate=CAMPUS_VALE_CEREMONIAL_GATE,accent=new THREE.Color(gate.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:1.15,roughness:.16}),g=new THREE.Group();g.position.set(gate.x,0,gate.z);for(const x of[-gate.width/2,gate.width/2])g.add(box(THREE,.38,gate.height,.48,steel,x,gate.height/2,0));g.add(box(THREE,gate.width+.4,.32,.52,glow,0,gate.height-.18,0));if(spriteLabel){const label=spriteLabel(gate.name.toUpperCase(),gate.accent,4.6,{bg:'rgba(2,18,18,.9)'});label.position.set(0,gate.height+1.0,0);g.add(label);}root.add(g);}
  for(const bridge of CAMPUS_PEDESTRIAN_BRIDGES){
    const accent=new THREE.Color(bridge.accent).getHex(),glow=mat(accent,{emissive:accent,emissiveIntensity:.7,roughness:.22}),g=new THREE.Group();
    const deck=bridge.axis==='z'?box(THREE,bridge.width,.16,bridge.length,steel,bridge.x,bridge.height-.08,bridge.z):box(THREE,bridge.length,.16,bridge.width,steel,bridge.x,bridge.height-.08,bridge.z);g.add(deck);
    const railOffset=bridge.width/2-.08;
    if(bridge.axis==='z')for(const side of[-1,1])g.add(box(THREE,.06,.78,bridge.length,glow,bridge.x+side*railOffset,bridge.height+.34,bridge.z));
    else for(const side of[-1,1])g.add(box(THREE,bridge.length,.78,.06,glow,bridge.x,bridge.height+.34,bridge.z+side*railOffset));
    for(const surf of CAMPUS_PEDESTRIAN_SURFACES.filter(s=>s.id.startsWith(`${bridge.id}-ramp-`))){const m=box(THREE,surf.w,.11,surf.d,walk,surf.x,surf.h-.055,surf.z);g.add(m);}
    if(spriteLabel){const label=spriteLabel(bridge.name.toUpperCase(),bridge.accent,2.8,{bg:'rgba(3,12,18,.82)'});label.position.set(bridge.x,bridge.height+2.0,bridge.z);g.add(label);}root.add(g);
  }
  const link=CAMPUS_VALE_MONUMENTAL_LINK,linkAccent=new THREE.Color(link.accent).getHex(),linkGlow=mat(linkAccent,{emissive:linkAccent,emissiveIntensity:.95,roughness:.18});
  for(let i=1;i<link.nodes.length;i++){const a=link.nodes[i-1],b=link.nodes[i];root.add(segmentBox({THREE,from:a,to:b,width:link.width,height:.055,material:asphalt,y:.052}));}
  for(const z of link.arches){const g=new THREE.Group();g.position.set(0,0,z);for(const x of[-3.0,3.0])g.add(box(THREE,.28,5.3,.32,steel,x,2.65,0));g.add(box(THREE,6.35,.22,.36,linkGlow,0,5.18,0));for(const x of[-2.7,2.7])g.add(box(THREE,.08,4.55,.1,linkGlow,x,2.55,.14));root.add(g);}
  for(let i=0;i<7;i++){const x=(i-3)*4.5,h=4.5+(i%3)*2.2,block=box(THREE,3.2,h,2.2,dark,x,h/2,link.skylineZ-(i%2)*1.5);root.add(block);const crown=box(THREE,2.7,.1,1.8,linkGlow,x,h+.12,link.skylineZ-(i%2)*1.5);root.add(crown);}
  if(spriteLabel){const label=spriteLabel('EIXO MONUMENTAL • VALE DO SILÍCIO AGV',link.accent,5.2,{bg:'rgba(2,18,18,.9)'});label.position.set(0,6.3,-20.4);root.add(label);}
  setShadow(root,quality!=='low');return root;
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
  const stations=[];for(const station of CAMPUS_TRAIN_STATIONS){const profile=CAMPUS_STATION_PROFILES[station.id]||{name:station.name,code:station.id.toUpperCase(),accent:station.accent||'#b58cff',type:'district'};const g=new THREE.Group();g.position.set(station.x,0,station.z);const accentColor=new THREE.Color(profile.accent||station.accent||'#b58cff').getHex(),stationGlow=mat(accentColor,{emissive:accentColor,emissiveIntensity:.9,roughness:.18});const platform=box(THREE,5.6,.3,2.4,dark,0,.22,0);g.add(platform,box(THREE,5.35,.045,.14,stationGlow,0,.41,.82));for(const x of[-2.25,2.25])g.add(box(THREE,.11,2.45,.11,steel,x,1.35,0));g.add(box(THREE,5.0,.12,1.9,steel,0,2.55,0),box(THREE,4.65,.08,1.55,glass,0,2.42,0));g.add(box(THREE,.8,1.3,.18,dark,1.65,1.08,-.92),box(THREE,.62,.76,.04,stationGlow,1.65,1.18,-1.02));if(spriteLabel){const label=spriteLabel(`${profile.code} • ${profile.name}`,profile.accent||station.accent||'#b58cff',3.25,{bg:'rgba(7,5,18,.9)'});label.position.set(0,3.15,0);g.add(label);}root.add(g);stations.push({station:{...station,...profile,name:profile.name},platform});}
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
  const city=createCampusCityLayer({THREE,quality,spriteLabel});scene.add(city);
  const connections=createCampusConnectionLayer({THREE,quality,spriteLabel});scene.add(connections);
  const centralFountain=createCentralHub({THREE,quality,spriteLabel});scene.add(centralFountain);
  const canopy=createPlazaCanopy({THREE,quality});scene.add(canopy);
  const cameraCollisionRoots=[urban,city,connections],buildingRoots=[],experienceRoots=[],experienceRefs=[];
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
    const interactionPoint=experience.type==='tool-building'&&experience.entrance?experience.entrance:experience;
    experienceRefs.push({...experience,x:interactionPoint.x,z:interactionPoint.z,radius:experience.radius||3});
  }
  return {floor,urban,city,connections,transit,centralFountain,beacon:centralFountain,canopy,cameraCollisionRoots,buildingRoots,experienceRoots,experienceRefs};
}

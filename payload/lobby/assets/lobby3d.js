import { WORLD_X, WORLD_Z, CAMPUS_ZONE_LAYOUT, EXTERIOR_BUILDING_COLLIDERS, presenceToWorld, worldToPresence, areaAtWorld } from './world/campus-manifest.js?v=14.10.8.53';
import { createCampusEnvironment, createCampusLighting } from './world/campus-environment.js?v=14.10.8.53';
import { createCameraController } from './render/camera-controller.js?v=14.10.8.53';
import { createAvatarSystem } from './characters/avatar-system.js?v=14.10.8.53';
import { createPortalSystem } from './game/portal-manager.js?v=14.10.8.53';
import { detectPerformanceProfile, chooseInitialQuality, createResizeController, createAdaptiveQualityController } from './render/performance-manager.js?v=14.10.8.53';
import { CAMPUS_EXPERIENCES, LITE_PARKOUR_CHECKPOINTS, PARKOUR_START, parkourPlatformAt } from './world/campus-experiences.js?v=14.10.8.53';
import { createCheckpointChallenge } from './game/challenge-manager.js?v=14.10.8.53';
import { createRideManager } from './game/ride-manager.js?v=14.10.8.53';

const THREE_URL='../vendor/three/three.module.min.js?v=14.10.8.53';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
let THREE=null,LABEL_SCALE=1;

export { presenceToWorld, worldToPresence };

function hashSeed(value='agv'){
  let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;
}
function makeMaterial(color,{emissive=0x000000,emissiveIntensity=0,metalness=.08,roughness=.55,transparent=false,opacity=1,side=THREE?.FrontSide}={}){
  return new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity,metalness,roughness,transparent,opacity,side});
}
function box(w,h,d,material,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);return m;}
function cylinder(r,h,material,x=0,y=0,z=0,segments=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);m.position.set(x,y,z);return m;}
function setShadow(root,enabled){root.traverse?.(o=>{if(o.isMesh){o.castShadow=enabled;o.receiveShadow=enabled;}});}
function disposeObject(root){root.traverse?.(o=>{o.geometry?.dispose?.();if(o.material){for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.map?.dispose?.();m.dispose?.();}}});}

function roundedCanvasTexture(text,{fg='#f4fbff',bg='rgba(4,12,18,.86)',accent='#36d2ff',width=512,height=160,font=700}={}){
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');
  c.clearRect(0,0,width,height);c.fillStyle=bg;c.beginPath();c.roundRect(8,8,width-16,height-16,28);c.fill();c.strokeStyle=accent;c.lineWidth=4;c.stroke();
  c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font=`${font} ${Math.round(height*.35)}px system-ui,-apple-system,Segoe UI,sans-serif`;c.fillText(String(text||'').slice(0,34),width/2,height/2+2);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function spriteLabel(text,accent='#36d2ff',scale=5,{bg='rgba(4,12,18,.86)'}={}){
  const material=new THREE.SpriteMaterial({map:roundedCanvasTexture(text,{accent,bg}),transparent:true,depthTest:false,depthWrite:false});const sprite=new THREE.Sprite(material),worldScale=scale*.46*LABEL_SCALE;sprite.scale.set(worldScale,worldScale*.31,1);sprite.renderOrder=40;return sprite;
}
function emojiSprite(emoji){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');c.font='84px Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(emoji,64,70);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));sprite.scale.set(1.35,1.35,1);sprite.renderOrder=50;return sprite;
}
function skyDome(){
  const geo=new THREE.SphereGeometry(110,32,18);
  const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color(0x06101f)},mid:{value:new THREE.Color(0x16374c)},bottom:{value:new THREE.Color(0x081416)}},vertexShader:`varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform vec3 top;uniform vec3 mid;uniform vec3 bottom;varying vec3 vPos;void main(){float h=normalize(vPos).y;vec3 c=mix(bottom,mid,smoothstep(-.15,.32,h));c=mix(c,top,smoothstep(.32,.95,h));gl_FragColor=vec4(c,1.0);}`});
  const mesh=new THREE.Mesh(geo,mat);mesh.userData.skyUniforms=mat.uniforms;return mesh;
}
function moonDisc(){const m=new THREE.Mesh(new THREE.CircleGeometry(4,40),new THREE.MeshBasicMaterial({color:0xd9edff,transparent:true,opacity:.92,depthWrite:false}));m.position.set(-47,35,-65);m.lookAt(0,10,0);return m;}

function tree(x,z,scale=1){const g=new THREE.Group(),trunk=makeMaterial(0x63462f,{roughness:.92}),leaf1=makeMaterial(0x1d6e51,{roughness:.84}),leaf2=makeMaterial(0x2c8a62,{roughness:.8});g.add(cylinder(.18*scale,2.25*scale,trunk,0,1.12*scale,0,12));const shapes=[[0,2.5,0,.88],[-.48,2.3,.05,.62],[.45,2.28,.08,.68],[0,2.45,-.45,.58]];for(let i=0;i<shapes.length;i++){const[a,b,c,s]=shapes[i],m=new THREE.Mesh(new THREE.IcosahedronGeometry(s*scale,1),i%2?leaf1:leaf2);m.position.set(a*scale,b*scale,c*scale);g.add(m);}g.position.set(x,0,z);setShadow(g,true);return g;}
function planter(x,z){const g=new THREE.Group(),pot=makeMaterial(0x26363c,{roughness:.83}),green=makeMaterial(0x358b65,{roughness:.78});g.add(cylinder(.72,.48,pot,0,.24,0,24));for(let i=0;i<6;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.14,.8,8),green);leaf.position.set(Math.sin(i*1.05)*.3,.83,Math.cos(i*1.05)*.3);leaf.rotation.z=(i-2.5)*.11;g.add(leaf);}g.position.set(x,0,z);setShadow(g,true);return g;}
function bench(x,z,rot=0){const g=new THREE.Group(),wood=makeMaterial(0x75523a,{roughness:.78}),metal=makeMaterial(0x26343e,{metalness:.62,roughness:.32});g.add(box(2.2,.16,.55,wood,0,.7,0),box(2.2,.16,.18,wood,0,1.28,.26),box(.12,.75,.12,metal,-.85,.35,0),box(.12,.75,.12,metal,.85,.35,0));g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}
function campusKiosk(x,z){const g=new THREE.Group(),dark=makeMaterial(0x13232b,{metalness:.48,roughness:.32}),glow=makeMaterial(0x39dbff,{emissive:0x39dbff,emissiveIntensity:2.2,roughness:.18});g.add(box(1.25,.3,1.0,dark,0,.15,0),box(.82,2.2,.48,dark,0,1.35,0),box(.68,.88,.04,glow,0,1.72,.265));const sign=spriteLabel('TOTEM','#36d2ff',2.7);sign.position.set(0,2.85,0);g.add(sign);g.position.set(x,0,z);setShadow(g,true);return g;}
function meetPad(x,z,accent,label){const g=new THREE.Group(),ring=new THREE.Mesh(new THREE.RingGeometry(1.45,1.72,40),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.55,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.035;g.add(ring);const core=new THREE.Mesh(new THREE.CircleGeometry(1.25,40),makeMaterial(accent,{emissive:accent,emissiveIntensity:.35,transparent:true,opacity:.16,side:THREE.DoubleSide}));core.rotation.x=-Math.PI/2;core.position.y=.03;g.add(core);const sign=spriteLabel(label,accent,3.1,{bg:'rgba(4,12,18,.7)'});sign.position.set(0,2.4,0);g.add(sign);g.position.set(x,0,z);g.userData={ring,core};return g;}
function lamp(x,z,{activeLight=false}={}){const g=new THREE.Group(),pole=makeMaterial(0x26333b,{metalness:.74,roughness:.25}),glow=makeMaterial(0xaee8ff,{emissive:0x8bdcff,emissiveIntensity:4,roughness:.18});g.add(cylinder(.07,3.5,pole,0,1.75,0,12));const arm=box(.65,.06,.06,pole,.26,3.45,0);g.add(arm);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8),glow);bulb.position.set(.55,3.35,0);g.add(bulb);if(activeLight){const light=new THREE.PointLight(0x8ddfff,7,9,2);light.position.copy(bulb.position);g.add(light);}g.position.set(x,0,z);return g;}
function lowWall(x,z,w,d,rot=0){const g=new THREE.Group(),base=makeMaterial(0x203039,{roughness:.8}),edge=makeMaterial(0x4c7280,{emissive:0x244d5c,emissiveIntensity:.35,roughness:.45});g.add(box(w,.58,d,base,0,.29,0),box(w+.03,.045,d+.03,edge,0,.6,0));g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}


function automaticDoor(accent=0x36d2ff){
  const g=new THREE.Group(),frame=makeMaterial(0x263943,{metalness:.72,roughness:.24}),glass=makeMaterial(accent,{emissive:accent,emissiveIntensity:.35,transparent:true,opacity:.44,metalness:.3,roughness:.12});
  g.add(box(4.6,.22,.42,frame,0,4.25,0),box(.22,4.25,.42,frame,-2.22,2.12,0),box(.22,4.25,.42,frame,2.22,2.12,0));
  const left=box(2.02,3.92,.12,glass,-1.02,2.0,.02),right=box(2.02,3.92,.12,glass,1.02,2.0,.02);g.add(left,right);g.userData={left,right,open:0};setShadow(g,true);return g;
}
function labChair(accent=0x36d2ff){const g=new THREE.Group(),seat=makeMaterial(0x1d2a31,{roughness:.74}),edge=makeMaterial(accent,{emissive:accent,emissiveIntensity:.18,roughness:.38});g.add(box(.62,.12,.62,seat,0,.56,0),box(.62,.72,.12,seat,0,.91,.27),box(.08,.55,.08,edge,-.24,.27,-.18),box(.08,.55,.08,edge,.24,.27,-.18),box(.08,.55,.08,edge,-.24,.27,.18),box(.08,.55,.08,edge,.24,.27,.18));setShadow(g,true);return g;}
function labComputer(accent=0x36d2ff){const g=new THREE.Group(),desk=makeMaterial(0x26343d,{roughness:.72}),dark=makeMaterial(0x0b1116,{roughness:.4}),off=makeMaterial(0x071015,{emissive:0x000000,emissiveIntensity:0,roughness:.2}),glow=makeMaterial(accent,{emissive:accent,emissiveIntensity:1.35,roughness:.12});g.add(box(2.4,.12,.8,desk,0,.78,0),box(.11,.78,.11,desk,-.95,.39,.22),box(.11,.78,.11,desk,.95,.39,.22));const mon=box(.94,.58,.08,dark,0,1.42,-.16),screen=box(.78,.42,.035,off,0,1.42,-.205);g.add(mon,screen,box(.12,.42,.12,desk,0,1.08,-.12),box(.62,.05,.28,desk,0,.86,-.05));const chair=labChair(accent);chair.position.set(0,0,1.15);chair.rotation.y=Math.PI;g.add(chair);g.userData={screen,screenOff:off,screenOn:glow,powered:false,chair};setShadow(g,true);return g;}
function labInterior({accent,key,title,origin=[0,0,55]}){
  const g=new THREE.Group();g.position.set(...origin);const floor=makeMaterial(0x17242b,{roughness:.72}),wall=makeMaterial(0x22313a,{roughness:.82}),frame=makeMaterial(0x344c58,{metalness:.48,roughness:.3}),glass=makeMaterial(0x173d4b,{emissive:accent,emissiveIntensity:.08,transparent:true,opacity:.38,metalness:.28,roughness:.16}),glow=makeMaterial(accent,{emissive:accent,emissiveIntensity:1.1,roughness:.22});
  const f=box(20,.18,14,floor,0,.09,0);f.receiveShadow=true;g.add(f,box(20,4.9,.28,wall,0,2.45,6.86),box(.28,4.9,14,wall,-9.86,2.45,0),box(.28,4.9,14,wall,9.86,2.45,0));
  // parede da entrada com vão central
  g.add(box(7.6,4.9,.28,wall,-6.1,2.45,-6.86),box(7.6,4.9,.28,wall,6.1,2.45,-6.86),box(4.6,.68,.28,wall,0,4.56,-6.86));
  const door=automaticDoor(accent);door.position.set(0,0,-6.72);g.add(door);
  // faixa luminosa e placa
  g.add(box(19.1,.08,.08,glow,0,4.55,6.67),box(.08,4.15,.08,glow,-9.65,2.25,0),box(.08,4.15,.08,glow,9.65,2.25,0));
  const sign=spriteLabel(`${title} • LAB`,new THREE.Color(accent).getStyle(),5.6,{bg:'rgba(3,12,18,.88)'});sign.position.set(0,4.0,6.45);g.add(sign);
  // quadro inteligente frontal + área de apresentação
  const board=box(6.7,2.6,.12,frame,0,2.55,6.55);g.add(board);const screen=box(6.35,2.27,.04,glass,0,2.55,6.47);g.add(screen);const boardTitle=spriteLabel(`${title} • QUADRO INTELIGENTE`,new THREE.Color(accent).getStyle(),5.0,{bg:'rgba(3,12,18,.86)'});boardTitle.position.set(0,3.15,6.35);g.add(boardTitle);const boardSub=spriteLabel(key==='1ds'?'Fundamentos • Lógica • Programação':key==='2ds'?'Front-End • UX • Inovação':key==='3ds'?'Sistemas • Projetos • Integração':'Front-End • Mobile • Prática', '#d8f5ff',4.25,{bg:'rgba(4,14,20,.74)'});boardSub.position.set(0,2.35,6.34);g.add(boardSub);const presentationPad=new THREE.Mesh(new THREE.RingGeometry(1.0,1.28,36),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.48,side:THREE.DoubleSide}));presentationPad.rotation.x=-Math.PI/2;presentationPad.position.set(-4.25,.035,4.9);g.add(presentationPad);
  // bancadas, cadeiras e computadores interativos
  const terminals=[];let idx=0;for(const z of[-2.9,.1,3.1])for(const x of[-5.8,0,5.8]){if(z>2.5&&x===0)continue;const c=labComputer(accent),rot=z>0?Math.PI:0;c.position.set(x,0,z);c.rotation.y=rot;g.add(c);const n=++idx,chairLocalZ=z>0?z-1.15:z+1.15,seatRot=z>0?0:Math.PI;terminals.push({id:`${key}-pc-${n}`,type:'lab-terminal',zoneKey:key,name:`Estação ${String(n).padStart(2,'0')} • ${title}`,x:origin[0]+x,z:origin[2]+chairLocalZ,radius:1.55,rot:seatRot,mesh:c,screen:c.userData.screen});}
  // rack / impressora 3D / mesa central
  const rack=box(1.55,3.35,1.0,frame,-8.35,1.68,4.9);g.add(rack);for(let y=.45;y<3;y+=.42)g.add(box(1.3,.12,.82,glow,-8.35,y,4.38));
  const holo=cylinder(.9,.78,frame,8.0,.39,4.6,24);g.add(holo);const holoTop=new THREE.Mesh(new THREE.TorusGeometry(.58,.055,10,32),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.72}));holoTop.rotation.x=Math.PI/2;holoTop.position.set(8,1.13,4.6);g.add(holoTop);
  // teto em placas, com vão central para sensação de volume
  for(const x of[-7,-3.5,3.5,7])g.add(box(3.1,.12,13.2,makeMaterial(0x1d2b33,{roughness:.74}),x,4.86,0));
  for(const x of[-6,0,6])for(const z of[-3.5,3.5])g.add(box(2.15,.045,.48,glow,x,4.72,z));
  const teacherDesk=box(3.3,.14,1.0,frame,-4.25,.78,4.45);g.add(teacherDesk,box(.12,.72,.12,frame,-5.6,.38,4.45),box(.12,.72,.12,frame,-2.9,.38,4.45));
  setShadow(g,true);return {group:g,door,terminals,boardScreen:screen,boardTitle,boardSub,presentationPad,refs:[...terminals,{id:`${key}-exit`,type:'interior-exit',zoneKey:key,name:'Saída para a Praça',x:origin[0],z:origin[2]-5.85,radius:1.75},{id:`${key}-board`,type:'smartboard',zoneKey:key,name:`Painel ${title}`,x:origin[0],z:origin[2]+5.35,radius:2.1},{id:`${key}-present`,type:'presentation-spot',zoneKey:key,name:`Área de apresentação • ${title}`,x:origin[0]-4.25,z:origin[2]+4.9,radius:1.65},{id:`${key}-portal-terminal`,type:'lab-portal',zoneKey:key,name:`Portal de Atividades • ${title}`,x:origin[0]+8,z:origin[2]+4.6,radius:1.8}]};
}

function wayfindingTotem(x,z,rot,label,accent=0x36d2ff){const g=new THREE.Group(),frame=makeMaterial(0x12222a,{metalness:.46,roughness:.36}),edge=makeMaterial(accent,{emissive:accent,emissiveIntensity:.62,roughness:.25});g.add(box(.16,2.7,.16,frame,-1.05,1.35,0),box(.16,2.7,.16,frame,1.05,1.35,0),box(2.25,.16,.2,frame,0,2.62,0),box(2.05,.055,.1,edge,0,2.42,.07));const sign=spriteLabel(label,'#aeefff',3.7,{bg:'rgba(5,16,22,.88)'});sign.position.set(0,1.82,.16);g.add(sign);g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}

export async function createLobby3D({canvas,zones,state,isStaff,className,onInteract,onPlayerState,onQualityChange,onPerf,onError,onAreaChange,onFirstFrame,onInteriorChange,onContextLost,onChallengeEvent,signal,initialQuality=null}){
  const abortIfNeeded=()=>{if(signal?.aborted)throw new DOMException('Inicialização 3D cancelada.','AbortError');};
  abortIfNeeded();
  if(!THREE){
    let timer;
    try{
      const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('three_import_timeout')),6500);});
      THREE=await Promise.race([import(THREE_URL),timeout]);
    }catch(error){onError?.('O motor 3D local demorou demais ou não pôde ser carregado.');throw error;}
    finally{clearTimeout(timer);}
  }
  abortIfNeeded();
  if(!canvas)throw new Error('Canvas 3D não encontrado.');if(!window.WebGLRenderingContext&&!window.WebGL2RenderingContext){onError?.('WebGL indisponível neste navegador.');throw new Error('WebGL unavailable');}
  const profile=detectPerformanceProfile(),mobile=profile.mobile,hardware=profile.hardware,cores=profile.cores,compactViewport=canvas.getBoundingClientRect().width<640;LABEL_SCALE=(mobile||compactViewport) ? .64 : 1;let quality=chooseInitialQuality(profile,initialQuality);
  const avatarSystem=createAvatarSystem({THREE,spriteLabel,emojiSprite,quality,mobile,hardware});
  await avatarSystem.init();
  const presets={low:{pixel:.68,shadows:false,particles:36,shadowSize:512},medium:{pixel:Math.min(devicePixelRatio,1.0),shadows:true,particles:90,shadowSize:1024},high:{pixel:Math.min(devicePixelRatio,1.35),shadows:true,particles:180,shadowSize:1536},ultra:{pixel:Math.min(devicePixelRatio,1.7),shadows:true,particles:320,shadowSize:2048}};let cfg=presets[quality];
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x07111a);scene.fog=new THREE.FogExp2(0x0a1821,.014);const sky=skyDome();scene.add(sky,moonDisc());
  const camera=new THREE.PerspectiveCamera(58,1,.08,190);const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance',alpha:false,failIfMajorPerformanceCaveat:false});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  let moon=null,portalSystem=null,resizeController=null,adaptiveController=null;
  const applyQuality=(q,{manual=false}={})=>{quality=presets[q]?q:quality;cfg=presets[quality];avatarSystem.setQuality(quality);portalSystem?.setQuality?.(quality);renderer.shadowMap.enabled=cfg.shadows;if(moon){moon.castShadow=cfg.shadows;moon.shadow.mapSize.set(cfg.shadowSize,cfg.shadowSize);moon.shadow.map?.dispose?.();moon.shadow.map=null;}adaptiveController?.qualityChanged?.(quality,{manual});resizeController?.request?.();onQualityChange?.(quality);};
  resizeController=createResizeController({canvas,renderer,camera,getPixelRatio:()=>cfg.pixel});
  const lighting=createCampusLighting({THREE,scene,quality,shadows:cfg.shadows,shadowSize:cfg.shadowSize});
  const hemi=lighting.hemi;moon=lighting.key;const warm=lighting.warm,centerLight=lighting.center;applyQuality(quality);
  const environment=createCampusEnvironment({THREE,scene,zones,quality,spriteLabel});
  const {centralFountain,beacon,canopy}=environment;
  const cameraCollisionRoots=[...environment.cameraCollisionRoots];
  scene.add(wayfindingTotem(0,-10.4,0,'1DS  •  2DS',0x36d2ff),wayfindingTotem(0,10.4,Math.PI,'3DS  •  SUB',0xb58cff),wayfindingTotem(-10.6,0,Math.PI/2,'PRAÇA  •  LABS',0x51e7a3),wayfindingTotem(10.6,0,-Math.PI/2,'ATIVIDADES',0xffae63));
  portalSystem=createPortalSystem({THREE,scene,zones,layouts:CAMPUS_ZONE_LAYOUT,state,spriteLabel,quality});
  const portalMap=portalSystem.getEntries();
  for(const [x,z,a] of[[-8,-8,true],[8,-8,true],[-8,8,true],[8,8,true],[-19,0,false],[19,0,false],[0,-19,false],[0,19,false],[-32,0,false],[32,0,false]])scene.add(lamp(x,z,{activeLight:a}));
  if(quality!=='low'){
    for(const [x,z] of[[-10,-4],[10,-4],[-10,4],[10,4],[-21,-7],[21,-7],[-21,7],[21,7]])scene.add(planter(x,z));
    for(const [x,z,s] of[[-36,-8,1.05],[-36,7,.95],[36,-8,1.1],[36,7,1],[-18,-22,.9],[18,-22,.9],[-18,22,.95],[18,22,1]])scene.add(tree(x,z,s));
    scene.add(lowWall(-15,0,5.5,.55,Math.PI/2),lowWall(15,0,5.5,.55,Math.PI/2));
  }
  // Objetos funcionais existem em todas as qualidades; só a decoração é degradada no Eco.
  scene.add(bench(-8,-.8,Math.PI/2),bench(8,.8,-Math.PI/2),bench(-.8,-8,0),bench(.8,8,Math.PI));
  const seats=[{id:'bench-west',x:-8,z:-.8,rot:Math.PI/2},{id:'bench-east',x:8,z:.8,rot:-Math.PI/2},{id:'bench-south',x:-.8,z:-8,rot:0},{id:'bench-north',x:.8,z:8,rot:Math.PI}];
  const worldObjects=[];worldObjects.push(...(environment.experienceRefs||[]));
  // P5.7: interiores 3D são instâncias locais. Coordenadas internas nunca são enviadas diretamente ao backend.
  const interiorOrigins=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.interiorOrigin]));
  const exteriorEntrances=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.exteriorEntrance]));
  const interiors=new Map(),entranceDoors=[];
  for(const z of zones){const origin=interiorOrigins[z.key],color=new THREE.Color(z.accent).getHex(),room=labInterior({accent:color,key:z.key,title:z.label,origin});room.group.visible=false;scene.add(room.group);cameraCollisionRoots.push(room.group);interiors.set(z.key,{...room,origin,zone:z});worldObjects.push(...room.refs);const ent=exteriorEntrances[z.key],door=automaticDoor(color);door.position.set(ent.x,0,ent.z);door.rotation.y=ent.rot;scene.add(door);cameraCollisionRoots.push(door);entranceDoors.push({door,key:z.key,x:ent.x,z:ent.z});worldObjects.push({id:`entrance-${z.key}`,type:'building-entrance',zoneKey:z.key,name:`Entrada ${z.label} • Laboratório`,x:ent.x,z:ent.z,radius:2.1});}
  const kiosk=campusKiosk(4.7,-4.8);scene.add(kiosk);worldObjects.push({id:'campus-kiosk',type:'kiosk',name:'Totem do Campus',x:4.7,z:-4.8,radius:2.0});
  const meetupDefs=[['1ds',-16,-8,'#36d2ff','ENCONTRO 1DS'],['2ds',16,-8,'#51e7a3','ENCONTRO 2DS'],['3ds',-16,8,'#b58cff','ENCONTRO 3DS'],['sub',16,8,'#ffae63','ENCONTRO SUB']];
  const meetPads=[];for(const [key,x,z,accent,label] of meetupDefs){const pad=meetPad(x,z,accent,label);scene.add(pad);meetPads.push(pad);worldObjects.push({id:`meet-${key}`,type:'meet',label,name:label,x,z,radius:2.2});}
  const npcDefs=[{id:'monitor-central',x:-4.8,z:4.8,name:'Recepção AGV',message:'Bem-vindo ao Campus DS. Use a sinalização da praça para acessar os laboratórios e acompanhar as áreas disponíveis.',accent:'#ffd166'},{id:'monitor-labs',x:5.2,z:5.1,name:'Apoio dos Laboratórios',message:'Os acessos aos laboratórios refletem as liberações reais da turma. Atividades continuam sob controle do professor.',accent:'#72e6ff'}];
  const npcs=[];for(const n of npcDefs){const av=avatarSystem.createAvatar({accent:n.accent,staff:true,label:n.name,seed:n.id});av.position.set(n.x,0,n.z);av.scale.setScalar(.96);scene.add(av);const ref={...n,type:'npc',radius:2.4};npcs.push({avatar:av,def:n,worldRef:ref});worldObjects.push(ref);}
  const liveSign=spriteLabel('PRAÇA CENTRAL • CAMPUS DS','#72e6ff',5.4,{bg:'rgba(2,13,20,.82)'});liveSign.position.set(0,7.15,-.4);scene.add(liveSign);let lastSignMinute=-1,lastActivityStatus='';
  // Ambiência contida: sem drones/ornamentos flutuantes genéricos.
  const ambientCount=quality==='ultra'?90:quality==='high'?52:quality==='medium'?24:0;
  const particlesGeo=new THREE.BufferGeometry(),positions=[];for(let i=0;i<ambientCount;i++)positions.push((Math.random()-.5)*78,.45+Math.random()*7.5,(Math.random()-.5)*49);
  particlesGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const motes=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xbadce7,size:.026,transparent:true,opacity:.14,depthWrite:false}));
  if(ambientCount)scene.add(motes);
  const makeAvatar=(opts)=>avatarSystem.createAvatar(opts);
  // P5.6: personagens autônomos e pequenos grupos locais. Não gravam nada no backend.
  const patrolDefs=[
    {id:'patrol-1ds',label:'Aluno 1DS',accent:'#36d2ff',route:[[-7,-10],[-13,-8],[-10,-3],[-5,-4]]},
    {id:'patrol-2ds',label:'Aluno 2DS',accent:'#51e7a3',route:[[7,-10],[13,-8],[10,-3],[5,-4]]},
    {id:'patrol-3ds',label:'Aluno 3DS',accent:'#b58cff',route:[[-7,10],[-13,8],[-10,3],[-5,4]]},
    {id:'patrol-sub',label:'Aluno SUB',accent:'#ffae63',route:[[7,10],[13,8],[10,3],[5,4]]}
  ];
  const patrols=[];for(const d of patrolDefs.slice(0,quality==='low'?2:4)){const avatar=makeAvatar({accent:d.accent,staff:false,label:d.label,seed:d.id});avatar.scale.setScalar(.9);const [x,z]=d.route[0];avatar.position.set(x,0,z);scene.add(avatar);patrols.push({avatar,def:d,index:1,speed:1.05+(hashSeed(d.id)%35)/100});}
  const socialGroups=[];if(quality!=='low'){const groupDefs=[[-16,-8,'#36d2ff','1DS'],[16,-8,'#51e7a3','2DS'],[-16,8,'#b58cff','3DS'],[16,8,'#ffae63','SUB']];for(const [gx,gz,accent,label] of groupDefs){const count=quality==='ultra'?2:1;for(let i=0;i<count;i++){const avatar=makeAvatar({accent,staff:false,label:`${label} • encontro`,seed:`group-${label}-${i}`});avatar.scale.setScalar(.86);avatar.position.set(gx+(i?1.0:-.8),0,gz+(i?.65:-.55));avatar.rotation.y=i?-.7:.7;scene.add(avatar);socialGroups.push({avatar,phase:i+gx*.1+gz*.07});}}}
  const colliders=EXTERIOR_BUILDING_COLLIDERS;
  let activeInterior=null,lastExteriorPosition=null;
  const canStand=(x,z)=>{
    if(activeInterior){const o=interiorOrigins[activeInterior];return x>o[0]-9.1&&x<o[0]+9.1&&z>o[2]-5.95&&z<o[2]+5.95;}
    if(x<-WORLD_X+1||x>WORLD_X-1||z<-WORLD_Z+1||z>WORLD_Z-1)return false;
    if(colliders.some(c=>x>c.minX-.62&&x<c.maxX+.62&&z>c.minZ-.62&&z<c.maxZ+.62))return false;
    const platform=parkourPlatformAt(x,z,.03);
    if(platform&&playerY<platform.h-.24)return false;
    return true;
  };
  const areaAt=(x,z)=>activeInterior||areaAtWorld(x,z);
  const accentForSelf=()=>state.currentClass?(zones.find(z=>z.code===state.currentClass.code)?.accent||'#36d2ff'):'#ffd166';const selfLabel=(state.profile?.role==='teacher'?'Prof. ':state.profile?.role==='student'?'':'ADM ')+(state.profile?.full_name||'Usuário').split(' ')[0];const self=makeAvatar({accent:accentForSelf(),staff:isStaff(),label:selfLabel,seed:state.user?.id||selfLabel});scene.add(self);const selfWorld=presenceToWorld(state.player.x,state.player.y);if(Math.hypot(selfWorld.x,selfWorld.z)<5.4){selfWorld.x=0;selfWorld.z=-8.2;}self.position.set(selfWorld.x,0,selfWorld.z);
  const challengeMarkers=LITE_PARKOUR_CHECKPOINTS.map(([x,z],i)=>{
    const material=new THREE.MeshBasicMaterial({color:i===0?0xffffff:0xff6b7a,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false});
    const ring=new THREE.Mesh(new THREE.RingGeometry(.72,1.0,32),material);ring.rotation.x=-Math.PI/2;const platform=parkourPlatformAt(x,z);ring.position.set(x,(platform?.h||0)+.09,z);ring.visible=false;scene.add(ring);return ring;
  });
  const challenge=createCheckpointChallenge({id:'parkour',title:'Circuito Parkour 3D',checkpoints:LITE_PARKOUR_CHECKPOINTS,start:PARKOUR_START,onEvent:onChallengeEvent});let challengePreviousCamera='explore';
  function syncChallengeMarkers(time=0){
    const status=challenge.snapshot();challengeMarkers.forEach((ring,i)=>{ring.visible=status.active;const active=i===status.index,done=i<status.index;ring.material.color.set(done?0x51e7a3:active?0xffffff:0xff6b7a);ring.material.opacity=done?.35:active?.45+.2*(.5+.5*Math.sin(time*5)):.14;ring.scale.setScalar(active?1.0+.08*Math.sin(time*5):1);});
  }
  function startChallenge(id='parkour'){
    if(id!=='parkour'||activeInterior)return false;rides.cancel({silent:true});challengePreviousCamera=cameraController.getMode();cameraController.setMode('wide');cameraController.setYaw(.45);cameraController.setPitch(.38);self.position.set(PARKOUR_START.x,PARKOUR_START.y,PARKOUR_START.z);playerY=PARKOUR_START.y;vertical=0;onGround=true;const started=challenge.start();syncChallengeMarkers();return started;
  }
  function restartChallenge(){if(activeInterior)return false;rides.cancel({silent:true});cameraController.setMode('wide');cameraController.setYaw(.45);cameraController.setPitch(.38);self.position.set(PARKOUR_START.x,PARKOUR_START.y,PARKOUR_START.z);playerY=PARKOUR_START.y;vertical=0;onGround=true;const restarted=challenge.restart();syncChallengeMarkers();return restarted;}
  function cancelChallenge(){const cancelled=challenge.cancel();if(cancelled)cameraController.setMode(challengePreviousCamera||'explore');syncChallengeMarkers();return cancelled;}
  function updateChallenge(nowMs,time){const wasActive=challenge.isActive();challenge.tick(self.position,nowMs);if(wasActive&&!challenge.isActive())cameraController.setMode(challengePreviousCamera||'explore');syncChallengeMarkers(time);}
  const cameraController=createCameraController({THREE,camera,canvas,getCollisionRoots:()=>cameraCollisionRoots,initialYaw:Math.PI,initialPitch:.32,initialDistance:6.8});
  let ridePreviousCamera='explore';
  const rides=createRideManager({reducedMotion:profile.reducedMotion,onEvent:event=>{if(event.type==='experience-start'){ridePreviousCamera=cameraController.getMode();cameraController.setMode(event.camera||'wide');}else if(event.type==='experience-complete'||event.type==='experience-cancel'){cameraController.setMode(ridePreviousCamera||'explore');}onChallengeEvent?.(event);}});
  function startExperience(id){if(activeInterior||!CAMPUS_EXPERIENCES.some(item=>item.id===id&&item.id!=='parkour'))return false;cancelChallenge();seated=null;presentation=null;activeStation=null;localAction=id==='playground'?'cheer':null;self.userData.localAction=localAction;return rides.start(id);}
  let playerY=0,vertical=0,onGround=true,runHeld=false,localAction=null,seated=null,presentation=null,activeStation=null,fps=60;const others=new Map(),keys=new Set(),moveJoy={x:0,y:0};
  adaptiveController=createAdaptiveQualityController({initialQuality:quality,profile,onSample:info=>{fps=info.fps;onPerf?.({...info,profile:{mobile:profile.mobile,saveData:profile.saveData,hardware:profile.hardware,cores:profile.cores}});},onQualityRequest:q=>applyQuality(q,{manual:false})});
  const keydown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','Space','KeyE','Enter','Digit1','Digit2','Digit3','KeyC'].includes(e.code))e.preventDefault();keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&localAction){localAction=null;seated=null;self.userData.localAction=null;}if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat)onInteract?.();if(e.code==='Space'&&!e.repeat&&onGround){vertical=7.8;onGround=false;}if(e.code==='Digit1')state.emoteRequested?.('wave');if(e.code==='Digit2')state.emoteRequested?.('like');if(e.code==='Digit3')state.emoteRequested?.('spark');if(e.code==='KeyC'&&!e.repeat)cameraController.toggleMode();};const keyup=e=>keys.delete(e.code);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
  const bindJoystick=()=>{const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');if(!root||!stick)return()=>{};let active=null;const update=e=>{const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),x=dx*k,y=dy*k;moveJoy.x=x/max;moveJoy.y=y/max;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;};const down=e=>{active=e.pointerId;root.setPointerCapture(active);update(e);};const move=e=>{if(e.pointerId===active)update(e);};const end=e=>{if(e.pointerId!==active)return;active=null;moveJoy.x=moveJoy.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.replaceWith(root.cloneNode(true));};};const cleanJoy=bindJoystick();const jumpButton=document.getElementById('jump-button'),runButton=document.getElementById('run-button');const jumpTap=e=>{e.preventDefault();if(onGround){vertical=7.8;onGround=false;}};jumpButton?.addEventListener('pointerdown',jumpTap);const runDown=e=>{e.preventDefault();runHeld=true;},runUp=e=>{e.preventDefault();runHeld=false;};runButton?.addEventListener('pointerdown',runDown);runButton?.addEventListener('pointerup',runUp);runButton?.addEventListener('pointercancel',runUp);
  let stopped=false,last=performance.now(),raf=0,nearPortal=null,nearStudent=null,lastArea='central',firstFrameDone=false;
  function syncOtherAvatars(time,dt){
    const seen=new Set();
    for(const o of state.others||[]){
      if(o.area==='vale-silicio')continue;
      seen.add(o.student_id);let entry=others.get(o.student_id);const staff=['teacher','admin','super_admin'].includes(o.participant_role);
      if(!entry){
        const zoneColor=zones.find(z=>z.code===state.classes?.find(c=>c.id===o.class_id)?.code)?.accent||'#7ba7bd',avatar=makeAvatar({accent:staff?'#ffd166':zoneColor,staff,label:o.display_name||'Aluno',seed:o.student_id});
        scene.add(avatar);const w=presenceToWorld(o.x,o.y);avatar.position.set(w.x,0,w.z);entry={avatar,target:new THREE.Vector3(w.x,0,w.z),staff};others.set(o.student_id,entry);
      }
      const w=presenceToWorld(o.x,o.y);entry.target.set(w.x,0,w.z);const gap=entry.avatar.position.distanceTo(entry.target);const before=entry.avatar.position.clone();
      if(gap>16)entry.avatar.position.copy(entry.target);else entry.avatar.position.lerp(entry.target,1-Math.exp(-8*dt));
      const dx=entry.avatar.position.x-before.x,dz=entry.avatar.position.z-before.z,speed=Math.hypot(dx,dz)/Math.max(dt,.001);if(speed>.035)entry.avatar.rotation.y=Math.atan2(dx,dz);
      avatarSystem.animate(entry.avatar,{speed,time,dt});avatarSystem.updateEmote(entry.avatar,o.emote,o.emote_until);avatarSystem.applyLOD(entry.avatar,self.position.distanceTo(entry.avatar.position),{staff});
    }
    for(const[id,entry]of others)if(!seen.has(id)){scene.remove(entry.avatar);avatarSystem.disposeAvatar(entry.avatar);others.delete(id);}
  }
  function findProximity(){nearPortal=null;if(!activeInterior&&!rides.isActive()){let bestPortal=3.35;for(const entry of portalMap.values()){const d=Math.hypot(self.position.x-entry.pos.x,self.position.z-entry.pos.z);if(d<bestPortal){bestPortal=d;nearPortal=entry.zone;}}}nearStudent=null;let best=2.65;if(!activeInterior&&!rides.isActive())for(const o of state.others||[]){const e=others.get(o.student_id);if(!e)continue;const d=self.position.distanceTo(e.avatar.position);if(d<best){best=d;nearStudent=o;}}let nearSeat=null,bestSeat=1.8;if(!activeInterior&&!rides.isActive())for(const seat of seats){const d=Math.hypot(self.position.x-seat.x,self.position.z-seat.z);if(d<bestSeat){bestSeat=d;nearSeat=seat;}}let nearWorldObject=null,bestWorld=2.5;if(!rides.isActive())for(const o of worldObjects){const isInside=['interior-exit','lab-terminal','smartboard','presentation-spot','lab-portal'].includes(o.type);if(activeInterior?(!isInside||o.zoneKey!==activeInterior):isInside)continue;const d=Math.hypot(self.position.x-o.x,self.position.z-o.z);if(d<Math.min(bestWorld,o.radius||2.5)){bestWorld=d;nearWorldObject=o;}}return{nearPortal,nearStudent,nearSeat,nearWorldObject};}
  function updateAdaptive(nowMs){const measured=adaptiveController.tick(nowMs,{mode:cameraController.getMode(),cameraCollision:cameraController.isColliding()});if(Number.isFinite(measured))fps=measured;}
  function updateCampusClock(nowMs){
    const d=new Date(),hour=d.getHours()+d.getMinutes()/60;const daylight=clamp(Math.sin(((hour-6)/12)*Math.PI),0,1);const night=1-daylight;
    hemi.intensity=.82+daylight*.9;moon.intensity=.65+night*1.45;warm.intensity=.35+night*.45;centerLight.intensity=7+night*10;renderer.toneMappingExposure=1.02+night*.16;
    const u=sky.userData.skyUniforms;if(u){u.top.value.lerpColors(new THREE.Color(0x06101f),new THREE.Color(0x3a86b8),daylight);u.mid.value.lerpColors(new THREE.Color(0x16374c),new THREE.Color(0x82c4df),daylight);u.bottom.value.lerpColors(new THREE.Color(0x081416),new THREE.Color(0xb7d6c2),daylight);}
    const minute=d.getMinutes();if(minute!==lastSignMinute){lastSignMinute=minute;const label=`AGV • ${String(d.getHours()).padStart(2,'0')}:${String(minute).padStart(2,'0')} • ${daylight>.55?'DIA':daylight>.12?'TRANSIÇÃO':'NOITE'}`;const old=liveSign.material.map;liveSign.material.map=roundedCanvasTexture(label,{accent:'#72e6ff'});liveSign.material.needsUpdate=true;old?.dispose?.();}
  }
  function updateActivityBoard(){
    const board=centralFountain.userData?.statusBoard;if(!board)return;const available=Number(state.available?.length||0),scheduled=state.scheduled?.[0],signature=available?`available:${available}`:scheduled?`scheduled:${scheduled.s?.releaseAt||''}`:'waiting';if(signature===lastActivityStatus)return;lastActivityStatus=signature;
    const label=available?`${available} ATIVIDADE${available===1?'':'S'} LIBERADA${available===1?'':'S'}`:scheduled?'ATIVIDADE PROGRAMADA':'AGUARDANDO ATIVIDADE',accent=available?'#51e7a3':scheduled?'#ffd166':'#9bbac6',old=board.material.map;board.material.map=roundedCanvasTexture(label,{accent,bg:'rgba(3,13,18,.9)'});board.material.needsUpdate=true;old?.dispose?.();
  }
  function updatePatrols(time,dt){for(const p of patrols){const [tx,tz]=p.def.route[p.index],dx=tx-p.avatar.position.x,dz=tz-p.avatar.position.z,dist=Math.hypot(dx,dz);if(dist<.25){p.index=(p.index+1)%p.def.route.length;continue;}const vx=dx/Math.max(dist,.001),vz=dz/Math.max(dist,.001);p.avatar.position.x+=vx*p.speed*dt;p.avatar.position.z+=vz*p.speed*dt;p.avatar.rotation.y=Math.atan2(vx,vz);avatarSystem.animate(p.avatar,{speed:p.speed,time,dt});avatarSystem.applyLOD(p.avatar,self.position.distanceTo(p.avatar.position));}for(const g of socialGroups){avatarSystem.animate(g.avatar,{speed:0,time:time+g.phase,dt});g.avatar.rotation.y+=Math.sin(time*.45+g.phase)*dt*.025;avatarSystem.applyLOD(g.avatar,self.position.distanceTo(g.avatar.position));}}
  function updateAutomaticDoors(dt){
    for(const e of entranceDoors){const d=Math.hypot(self.position.x-e.x,self.position.z-e.z),target=!activeInterior&&d<3.0?1:0;e.door.userData.open=THREE.MathUtils.damp(e.door.userData.open,target,9,dt);const k=e.door.userData.open;e.door.userData.left.position.x=-1.02-k*1.0;e.door.userData.right.position.x=1.02+k*1.0;}
    if(activeInterior){const r=interiors.get(activeInterior);if(r){const d=Math.hypot(self.position.x-r.origin[0],self.position.z-(r.origin[2]-5.85)),target=d<3.0?1:0;r.door.userData.open=THREE.MathUtils.damp(r.door.userData.open,target,9,dt);const k=r.door.userData.open;r.door.userData.left.position.x=-1.02-k*1.0;r.door.userData.right.position.x=1.02+k*1.0;}}
  }
  function updatePortalVisuals(time){portalSystem?.update?.({time,playerPosition:self.position,currentClassCode:state.currentClass?.code||null});}
  function frame(nowMs){
    if(stopped||signal?.aborted)return;raf=requestAnimationFrame(frame);if(document.hidden)return;resizeController.update();
    const dt=Math.min(.045,(nowMs-last)/1000||.016);last=nowMs;const time=nowMs/1000,motionTime=profile.reducedMotion?0:time;
    const left=keys.has('KeyA')||keys.has('ArrowLeft'),right=keys.has('KeyD')||keys.has('ArrowRight'),up=keys.has('KeyW')||keys.has('ArrowUp'),down=keys.has('KeyS')||keys.has('ArrowDown');
    let ix=(right?1:0)-(left?1:0)+moveJoy.x,iz=(down?1:0)-(up?1:0)+moveJoy.y;if(seated||presentation||rides.isActive()){ix=0;iz=0;}const len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}
    const running=keys.has('ShiftLeft')||keys.has('ShiftRight')||runHeld,speed=running?6.4:3.65,cameraYaw=cameraController.getYaw(),sy=Math.sin(cameraYaw),cy=Math.cos(cameraYaw),mx=ix*cy+iz*sy,mz=-ix*sy+iz*cy;
    const ride=rides.tick(nowMs);let moving=Math.hypot(mx,mz),groundY=0,support=null;
    if(ride){self.position.set(ride.x,ride.y,ride.z);playerY=ride.y;vertical=0;onGround=true;self.rotation.y=ride.heading||self.rotation.y;cameraController.setYaw((ride.heading||0)+Math.PI);moving=.65;}
    else{
      const nx=self.position.x+mx*speed*dt,nz=self.position.z+mz*speed*dt;if(canStand(nx,self.position.z))self.position.x=nx;if(canStand(self.position.x,nz))self.position.z=nz;
      if(moving>.03){const desired=Math.atan2(mx,mz);let delta=(desired-self.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;self.rotation.y+=delta*Math.min(1,dt*11);}
      vertical-=20*dt;playerY+=vertical*dt;support=!activeInterior?parkourPlatformAt(self.position.x,self.position.z,-.05):null;groundY=support?.h||0;
      if(playerY<=groundY){playerY=groundY;vertical=0;onGround=true;}else onGround=false;
      const challengeState=challenge.snapshot(),parkour=CAMPUS_EXPERIENCES.find(item=>item.id==='parkour');
      if(challengeState.active&&challengeState.index>0&&!support&&playerY<=.02&&parkour&&Math.hypot(self.position.x-parkour.x,self.position.z-parkour.z)<parkour.radius+1.2){const point=challenge.respawnPoint();self.position.set(point.x,(point.y||0)+.06,point.z);playerY=(point.y||0)+.06;vertical=0;onGround=true;onChallengeEvent?.({type:'respawn',id:'parkour',index:challengeState.index,total:challengeState.total,message:`Retorno ao checkpoint ${challengeState.index}.`});}
      self.position.y=playerY;
    }
    avatarSystem.animate(self,{speed:moving*speed,jump:Math.max(0,playerY-groundY),time:motionTime,vertical,dt});syncOtherAvatars(motionTime,dt);updatePortalVisuals(motionTime);updateCampusClock(nowMs);updateActivityBoard();updateChallenge(nowMs,motionTime);
    for(const root of environment.experienceRoots||[]){if(root.userData?.water)root.userData.water.material.opacity=.23+.08*(.5+.5*Math.sin(motionTime*2.2));if(root.userData?.float)root.userData.float.rotation.y=motionTime*.35;if(root.userData?.coasterCar){const a=motionTime*.62;root.userData.coasterCar.position.set(Math.cos(a)*2.45,1.18+.16*Math.sin(a*2),Math.sin(a)*2.0);root.userData.coasterCar.rotation.y=-a+Math.PI/2;}if(root.userData?.swingSeats)root.userData.swingSeats.forEach((seat,i)=>{seat.position.z=Math.sin(motionTime*1.5+i*Math.PI)*.22;});if(root.userData?.seesaw)root.userData.seesaw.rotation.z=Math.sin(motionTime*1.1)*.12;}
    updatePatrols(motionTime,dt);updateAutomaticDoors(dt);if(activeInterior){const r=interiors.get(activeInterior);if(r){for(const t of r.terminals){if(t.screen&&t.mesh?.userData?.powered){t.screen.material.emissiveIntensity=1.05+.35*(.5+.5*Math.sin(motionTime*3+t.id.length));}}if(r.presentationPad)r.presentationPad.material.opacity=.32+.22*(.5+.5*Math.sin(motionTime*2.4));}}
    if(canopy?.userData?.inner){canopy.userData.inner.material.emissiveIntensity=1.05+.28*(.5+.5*Math.sin(motionTime*.9));canopy.userData.inner.rotation.z=motionTime*.012;}npcs.forEach((n,i)=>{const bx=n.def.x,bz=n.def.z;n.avatar.position.x=bx+Math.sin(motionTime*.22+i)*.55;n.avatar.position.z=bz+Math.cos(motionTime*.18+i)*.35;n.worldRef.x=n.avatar.position.x;n.worldRef.z=n.avatar.position.z;avatarSystem.animate(n.avatar,{speed:.22,jump:0,time:motionTime+i*.7,vertical:0,dt});n.avatar.rotation.y=Math.atan2(Math.cos(motionTime*.22+i),-Math.sin(motionTime*.18+i));avatarSystem.applyLOD(n.avatar,self.position.distanceTo(n.avatar.position),{staff:true});});meetPads.forEach((pad,i)=>{pad.userData.ring.rotation.z=motionTime*(i%2?.22:-.18);pad.userData.core.material.opacity=.12+.07*(.5+.5*Math.sin(motionTime*2+i));});
    centralFountain.userData.pool.material.opacity=.62+.08*Math.sin(motionTime*2.4);centralFountain.userData.crown.rotation.y=motionTime*.65;centralFountain.userData.crown.position.y=3.28+Math.sin(motionTime*1.8)*.08;for(let i=0;i<beacon.userData.rings.length;i++){const r=beacon.userData.rings[i];r.rotation.y=motionTime*(i%2?.23:-.18)+i*.4;r.rotation.z+=profile.reducedMotion?0:dt*(i%2?.18:-.12);}if(ambientCount)motes.rotation.y=motionTime*.0015;
    cameraController.update({playerPosition:self.position,moving,running,time:motionTime,dt});updateAdaptive(nowMs);
    const proximity=findProximity(),area=areaAt(self.position.x,self.position.z);if(area!==lastArea){lastArea=area;onAreaChange?.(area);}const publicPos=activeInterior?exteriorEntrances[activeInterior]:null,p=publicPos?worldToPresence(publicPos.x,publicPos.z):worldToPresence(self.position.x,self.position.z);onPlayerState?.({x:p.x,y:p.y,area,interior:activeInterior,nearPortal:proximity.nearPortal,nearStudent:proximity.nearStudent,nearSeat:proximity.nearSeat,nearWorldObject:proximity.nearWorldObject,seated:!!seated,moving,running,onGround});renderer.render(scene,camera);if(!firstFrameDone){firstFrameDone=true;onFirstFrame?.();}
  }
  const visibilityChange=()=>{if(!document.hidden){last=performance.now();adaptiveController.reset();resizeController.request();}};
  const contextLost=e=>{e.preventDefault();onError?.('O navegador reiniciou o contexto gráfico. Mudando para o mapa 2D para preservar sua sessão.');onContextLost?.();};
  document.addEventListener('visibilitychange',visibilityChange);canvas.addEventListener('webglcontextlost',contextLost,false);
  resizeController.update(true);abortIfNeeded();raf=requestAnimationFrame(frame);
  return{setQuality:q=>applyQuality(q,{manual:true}),startChallenge,restartChallenge,cancelChallenge,startExperience,cancelExperience:()=>rides.cancel(),enterInterior(key){const r=interiors.get(key);if(!r)return false;rides.cancel({silent:true});cancelChallenge();lastExteriorPosition={x:self.position.x,z:self.position.z};for(const [roomKey,room] of interiors)room.group.visible=roomKey===key;activeInterior=key;seated=null;presentation=null;activeStation=null;localAction=null;self.userData.localAction=null;self.position.set(r.origin[0],0,r.origin[2]-4.5);self.rotation.y=0;cameraController.setYaw(Math.PI);onInteriorChange?.({inside:true,key,label:r.zone.label});return true;},exitInterior(){if(!activeInterior)return false;const key=activeInterior,ent=exteriorEntrances[key];interiors.get(key)?.group&&(interiors.get(key).group.visible=false);activeInterior=null;seated=null;presentation=null;if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=null;localAction=null;self.userData.localAction=null;self.position.set(lastExteriorPosition?.x??ent.x,0,(lastExteriorPosition?.z??ent.z)+(key==='1ds'||key==='2ds'?1.4:-1.4));self.rotation.y=key==='1ds'||key==='2ds'?Math.PI:0;cameraController.setYaw(self.rotation.y+Math.PI);onInteriorChange?.({inside:false,key,label:zones.find(z=>z.key===key)?.label||key});return true;},toggleStation(station){if(!station||station.type!=='lab-terminal')return false;if(activeStation?.id===station.id){station.mesh.userData.powered=false;station.screen.material=station.mesh.userData.screenOff;activeStation=null;seated=null;localAction=null;self.userData.localAction=null;return false;}if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=station;station.mesh.userData.powered=true;station.screen.material=station.mesh.userData.screenOn;seated=station;presentation=null;localAction='sit';self.userData.localAction='sit';self.position.set(station.x,0,station.z);self.rotation.y=station.rot||0;cameraController.setYaw(self.rotation.y+Math.PI);return true;},togglePresentation(spot){if(!spot||spot.type!=='presentation-spot')return false;if(presentation){presentation=null;localAction=null;self.userData.localAction=null;return false;}presentation=spot;seated=null;activeStation=null;localAction='cheer';self.userData.localAction='cheer';self.position.set(spot.x,0,spot.z);self.rotation.y=Math.PI;cameraController.setYaw(0);return true;},showBoard(key){const r=interiors.get(key);if(!r)return false;const baseScale=r.boardTitle.scale.clone();r.boardScreen.material.emissiveIntensity=1.15;r.boardTitle.scale.multiplyScalar(1.08);setTimeout(()=>{if(r.boardScreen?.material)r.boardScreen.material.emissiveIntensity=.08;if(r.boardTitle)r.boardTitle.scale.copy(baseScale);},2600);return true;},getInterior:()=>activeInterior,setLocalAction(kind){if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=null;localAction=kind||null;seated=null;presentation=null;self.userData.localAction=localAction;},toggleSeat(seat){if(seated){if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;activeStation=null;}seated=null;localAction=null;self.userData.localAction=null;return false;}if(!seat)return false;seated=seat;localAction='sit';self.userData.localAction='sit';self.position.set(seat.x,0,seat.z);self.rotation.y=seat.rot;return true;},isSeated:()=>!!seated,getQuality:()=>quality,getFPS:()=>adaptiveController.getFPS(),getPerformanceProfile:()=>({...profile}),getAvatarMode:()=>avatarSystem.getMode(),toggleCamera:()=>cameraController.toggleMode(),getCameraMode:()=>cameraController.getMode(),jump:()=>{if(onGround&&!rides.isActive()){vertical=7.8;onGround=false;}},setRun:v=>{runHeld=!!v;},setLocalEmote(kind){avatarSystem.updateEmote(self,kind,new Date(Date.now()+4500).toISOString());},stop(){stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',visibilityChange);canvas.removeEventListener('webglcontextlost',contextLost,false);resizeController?.dispose?.();cameraController.dispose();portalSystem?.dispose?.();jumpButton?.removeEventListener('pointerdown',jumpTap);runButton?.removeEventListener('pointerdown',runDown);runButton?.removeEventListener('pointerup',runUp);runButton?.removeEventListener('pointercancel',runUp);cleanJoy?.();renderer.dispose();disposeObject(scene);},renderer,scene,camera,self};
}

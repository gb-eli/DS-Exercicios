import { WORLD_X, WORLD_Z, CAMPUS_ZONE_LAYOUT, EXTERIOR_BUILDING_COLLIDERS, presenceToWorld, worldToPresence, areaAtWorld } from './world/campus-manifest.js?v=14.10.8.66';
import { createCampusEnvironment, createCampusLighting } from './world/campus-environment.js?v=14.10.8.92-f90-graphics';
import { createCameraController } from './render/camera-controller.js?v=14.10.8.85-f83-gameplay-performance';
import { createAvatarSystem } from './characters/avatar-system.js?v=14.10.8.92-f90-graphics';
import { remoteElevation, remoteHeading, remoteAppearance, applyRemoteAvatarState } from './social/remote-avatar-state.js?v=14.10.8.87-f85-map-realtime';
import { createPortalSystem } from './game/portal-manager.js?v=14.10.8.66';
import { detectPerformanceProfile, chooseInitialQuality, createResizeController, createAdaptiveQualityController } from './render/performance-manager.js?v=14.10.8.92-f90-graphics';
import { captureRenderTelemetry } from './render/observability.js?v=14.10.8.83-o2';
import { campusRenderBudget, applyCampusRenderBudget } from './render/campus-render-budget.js?v=14.10.8.92-f90-graphics';
import { visualQualityProfile,rendererPixelRatio } from './render/visual-quality-profile.js?v=14.10.8.92-f90-graphics';
import { CAMPUS_EXPERIENCES, CAMPUS_TRAIN_STATIONS, campusSurfaceAt } from './world/campus-experiences.js?v=14.10.8.92-f90-graphics';
import { CAMPUS_TOOL_BUILDING_COLLIDERS } from './world/campus-destinations.js?v=14.10.8.92-f90-graphics';
import { CAMPUS_CITY_LANDMARKS, CAMPUS_THEME_PLAZAS } from './world/campus-city-network.js?v=14.10.8.84-mobility';
import { CAMPUS_TRAFFIC_FLEET, CAMPUS_DRIVABLE_VEHICLES, CAMPUS_TRAFFIC_SIGNALS, CAMPUS_NPC_PATROLS, CAMPUS_DYNAMIC_SIGNS, CAMPUS_INTERIOR_SIGNATURES, CAMPUS_ELEVATOR_SYSTEM, resolveCampusCityEvent, resolveDynamicSign, resolveCampusSpeedLimit, resolveTrafficSignalState, sampleCampusRoute } from './world/campus-mobility-systems.js?v=14.10.8.84-mobility';
import { CAMPUS_INTERIOR_PROFILES, CAMPUS_INTERIOR_MAP, CAMPUS_INTERIOR_INTERACTIONS, CAMPUS_CLASSROOM_INTERIOR_THEMES, interiorRoomStyle, contextualInteriorAnchor } from './world/campus-interiors.js?v=14.10.8.71-stage40-security';
import { createRideManager } from './game/ride-manager.js?v=14.10.8.92-f90-graphics';
import { createTrainManager } from './game/train-manager.js?v=14.10.8.92-f90-graphics';
import { resolveWorldTime } from './world/dynamic-world.js?v=14.10.8.66-stage31';
import { resolveWorldWeather, createWorldWeatherEffects } from './world/weather-system.js?v=14.10.8.66-stage32';
import { CAMPUS_AMBIENT, ambientBudget } from './world/ambient-landscape.js?v=14.10.8.66-stage30';
import { normalizeCinemaMedia } from './world/cinema-media.js?v=14.10.8.66-cinema';
import { CAMPUS_SECURITY_CAMERAS, CAMPUS_SECURITY_CAMERA_MAP, CAMPUS_SECURITY_DEFAULT_CAMERA, CAMPUS_SECURITY_GRID_IDS, securityCameraZoomFov } from './world/security-cameras.js?v=14.10.8.71-stage40-security';
import { CAMPUS_HELIPADS, CAMPUS_AERIAL_VEHICLES, aerialSpeedKmh, nearestCampusHelipad, isCampusHelipadLanding } from './world/aerial-mobility.js?v=14.10.8.72-stage41-aerial';
import { CAMPUS_VIEWPOINTS, CAMPUS_VIEWPOINT_MAP, CAMPUS_VIEWPOINT_DEFAULT, CAMPUS_VIEWPOINT_LANDMARK_MAP, viewpointZoomFov, viewpointLandmarks } from './world/campus-viewpoints.js?v=14.10.8.73-stage42-viewpoints';
import { playerMoveSpeed } from './world/gameplay-settings.js?v=14.10.8.87-f85-gameplay';
import { normalizeAirdropSession, sampleAirdropPlane, airdropDetailLevel, airdropDescentRate, shouldAutoDeploy, clampAirdropPosition, AIRDROP_CONFIG } from './world/airdrop-system.js?v=14.10.8.86-f84-airdrop';

const THREE_URL='../vendor/three/three.module.min.js?v=14.10.8.66';
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
function airdropTransportPlane(){
  const g=new THREE.Group();g.name='agv-airdrop-transport';
  const body=makeMaterial(0x233441,{metalness:.58,roughness:.34}),trim=makeMaterial(0x36d2ff,{emissive:0x1b7991,emissiveIntensity:.55,metalness:.38,roughness:.28}),glass=makeMaterial(0x153b55,{emissive:0x2c7699,emissiveIntensity:.24,metalness:.18,roughness:.18,transparent:true,opacity:.82});
  const fuselage=cylinder(1.45,10.5,body,0,0,0,20);fuselage.rotation.x=Math.PI/2;g.add(fuselage);
  g.add(box(12.5,.28,2.1,body,0,.15,.4),box(4.7,.2,2.0,body,0,.7,4.35),box(2.2,2.2,.32,body,0,1.0,4.7),box(7.8,.09,.22,trim,0,.02,.35));
  const nose=new THREE.Mesh(new THREE.ConeGeometry(1.43,2.6,20),body);nose.rotation.x=Math.PI/2;nose.position.z=-6.45;g.add(nose);
  const cockpit=box(1.95,.62,.18,glass,0,.55,-5.22);g.add(cockpit);
  for(const x of[-5.2,5.2]){const engine=cylinder(.5,2.25,body,x,-.22,.45,14);engine.rotation.x=Math.PI/2;g.add(engine);const glow=new THREE.Mesh(new THREE.RingGeometry(.24,.43,14),new THREE.MeshBasicMaterial({color:0x66ddff,transparent:true,opacity:.72,side:THREE.DoubleSide}));glow.position.set(x,-.22,1.59);g.add(glow);}
  const label=spriteLabel('AGV AIRDROP','#72e6ff',4.0,{bg:'rgba(3,15,22,.82)'});label.position.set(0,2.6,.2);g.add(label);
  setShadow(g,false);g.visible=false;return g;
}
function airdropParachuteRig(){
  const g=new THREE.Group();g.name='agv-parachute';
  const canopyMat=makeMaterial(0x36d2ff,{emissive:0x174c5e,emissiveIntensity:.3,roughness:.5,transparent:true,opacity:.9,side:THREE.DoubleSide});
  const canopy=new THREE.Mesh(new THREE.SphereGeometry(1.55,18,9,0,Math.PI*2,0,Math.PI/2),canopyMat);canopy.scale.set(1.45,.55,1);canopy.position.y=3.2;g.add(canopy);
  const lineMat=new THREE.LineBasicMaterial({color:0xd9f6ff,transparent:true,opacity:.68});
  for(const [x,z] of[[-1.25,-.5],[1.25,-.5],[-1.25,.5],[1.25,.5]]){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,2.95,z),new THREE.Vector3(x*.22,.35,z*.18)]);g.add(new THREE.Line(geo,lineMat));}
  g.visible=false;return g;
}
function setShadow(root,enabled){root.traverse?.(o=>{if(o.isMesh){o.castShadow=enabled;o.receiveShadow=enabled;}});}
function disposeObject(root){root.traverse?.(o=>{o.geometry?.dispose?.();if(o.material){for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.map?.dispose?.();m.dispose?.();}}});}

function roundedCanvasTexture(text,{fg='#f4fbff',bg='rgba(4,12,18,.86)',accent='#36d2ff',width=512,height=160,font=700}={}){
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');
  c.clearRect(0,0,width,height);c.fillStyle=bg;c.beginPath();c.roundRect(8,8,width-16,height-16,28);c.fill();c.strokeStyle=accent;c.lineWidth=4;c.stroke();
  c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font=`${font} ${Math.round(height*.35)}px system-ui,-apple-system,Segoe UI,sans-serif`;c.fillText(String(text||'').slice(0,34),width/2,height/2+2);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function spriteLabel(text,accent='#36d2ff',scale=5,{bg='rgba(4,12,18,.86)'}={}){
  const material=new THREE.SpriteMaterial({map:roundedCanvasTexture(text,{accent,bg}),transparent:true,depthTest:true,depthWrite:false});const sprite=new THREE.Sprite(material),worldScale=scale*.46*LABEL_SCALE;sprite.scale.set(worldScale,worldScale*.31,1);sprite.renderOrder=4;
  // Etapa 19: nomes completos aparecem por proximidade para evitar poluição visual no Campus.
  sprite.userData.labelCullDistance=scale>=5.4?58:scale>=3.6?42:28;
  return sprite;
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
function sunDisc(){const m=new THREE.Mesh(new THREE.CircleGeometry(5.2,40),new THREE.MeshBasicMaterial({color:0xfff2b8,transparent:true,opacity:.95,depthWrite:false}));m.position.set(48,48,-62);m.lookAt(0,10,0);return m;}

function tree(x,z,scale=1){const g=new THREE.Group(),trunk=makeMaterial(0x63462f,{roughness:.92}),leaf1=makeMaterial(0x1d6e51,{roughness:.84}),leaf2=makeMaterial(0x2c8a62,{roughness:.8});g.add(cylinder(.18*scale,2.25*scale,trunk,0,1.12*scale,0,12));const shapes=[[0,2.5,0,.88],[-.48,2.3,.05,.62],[.45,2.28,.08,.68],[0,2.45,-.45,.58]];for(let i=0;i<shapes.length;i++){const[a,b,c,s]=shapes[i],m=new THREE.Mesh(new THREE.IcosahedronGeometry(s*scale,1),i%2?leaf1:leaf2);m.position.set(a*scale,b*scale,c*scale);g.add(m);}g.position.set(x,0,z);setShadow(g,true);return g;}
function planter(x,z){const g=new THREE.Group(),pot=makeMaterial(0x26363c,{roughness:.83}),green=makeMaterial(0x358b65,{roughness:.78});g.add(cylinder(.72,.48,pot,0,.24,0,24));for(let i=0;i<6;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.14,.8,8),green);leaf.position.set(Math.sin(i*1.05)*.3,.83,Math.cos(i*1.05)*.3);leaf.rotation.z=(i-2.5)*.11;g.add(leaf);}g.position.set(x,0,z);setShadow(g,true);return g;}
function bench(x,z,rot=0){const g=new THREE.Group(),wood=makeMaterial(0x75523a,{roughness:.78}),metal=makeMaterial(0x26343e,{metalness:.62,roughness:.32});g.add(box(2.2,.16,.55,wood,0,.7,0),box(2.2,.16,.18,wood,0,1.28,.26),box(.12,.75,.12,metal,-.85,.35,0),box(.12,.75,.12,metal,.85,.35,0));g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}
function campusKiosk(x,z){const g=new THREE.Group(),dark=makeMaterial(0x13232b,{metalness:.48,roughness:.32}),glow=makeMaterial(0x39dbff,{emissive:0x39dbff,emissiveIntensity:2.2,roughness:.18});g.add(box(1.25,.3,1.0,dark,0,.15,0),box(.82,2.2,.48,dark,0,1.35,0),box(.68,.88,.04,glow,0,1.72,.265));const sign=spriteLabel('TOTEM','#36d2ff',2.7);sign.position.set(0,2.85,0);g.add(sign);g.position.set(x,0,z);setShadow(g,true);return g;}
function meetPad(x,z,accent,label){const g=new THREE.Group(),ring=new THREE.Mesh(new THREE.RingGeometry(1.45,1.72,40),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.55,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.035;g.add(ring);const core=new THREE.Mesh(new THREE.CircleGeometry(1.25,40),makeMaterial(accent,{emissive:accent,emissiveIntensity:.35,transparent:true,opacity:.16,side:THREE.DoubleSide}));core.rotation.x=-Math.PI/2;core.position.y=.03;g.add(core);const sign=spriteLabel(label,accent,3.1,{bg:'rgba(4,12,18,.7)'});sign.position.set(0,2.4,0);g.add(sign);g.position.set(x,0,z);g.userData={ring,core};return g;}
function lamp(x,z,{activeLight=false}={}){const g=new THREE.Group(),pole=makeMaterial(0x26333b,{metalness:.74,roughness:.25}),glow=makeMaterial(0xaee8ff,{emissive:0x8bdcff,emissiveIntensity:4,roughness:.18});g.add(cylinder(.07,3.5,pole,0,1.75,0,12));const arm=box(.65,.06,.06,pole,.26,3.45,0);g.add(arm);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8),glow);bulb.position.set(.55,3.35,0);g.add(bulb);if(activeLight){const light=new THREE.PointLight(0x8ddfff,7,9,2);light.position.copy(bulb.position);g.add(light);}g.position.set(x,0,z);return g;}
function lowWall(x,z,w,d,rot=0){const g=new THREE.Group(),base=makeMaterial(0x203039,{roughness:.8}),edge=makeMaterial(0x4c7280,{emissive:0x244d5c,emissiveIntensity:.35,roughness:.45});g.add(box(w,.58,d,base,0,.29,0),box(w+.03,.045,d+.03,edge,0,.6,0));g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}

function createCampusAmbientLandscape({quality='medium',reducedMotion=false}={}){
  const root=new THREE.Group();root.name='campus-ambient-landscape-stage30';
  const dummy=new THREE.Object3D(),treeDefs=CAMPUS_AMBIENT.trees,planterDefs=CAMPUS_AMBIENT.planters;
  const trunkMat=makeMaterial(0x6a4d36,{roughness:.94}),leafMat=makeMaterial(0x2f7d59,{roughness:.9});leafMat.vertexColors=true;
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.17,.22,2.2,7),trunkMat,treeDefs.length);
  const crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),leafMat,treeDefs.length);
  treeDefs.forEach((def,i)=>{
    const scale=Number(def.scale||1),shape=def.shape||'broad';dummy.position.set(def.x,1.1*scale,def.z);dummy.rotation.set(0,(i*.73)%Math.PI,0);dummy.scale.set(.95*scale,scale,.95*scale);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
    const crownScale=shape==='tall'?[.66,1.42,.66]:shape==='compact'?[.84,.75,.84]:[1.12,.9,1.08];dummy.position.set(def.x,2.78*scale,def.z);dummy.rotation.set(0,(i*.91)%Math.PI,0);dummy.scale.set(crownScale[0]*scale,crownScale[1]*scale,crownScale[2]*scale);dummy.updateMatrix();crowns.setMatrixAt(i,dummy.matrix);crowns.setColorAt(i,new THREE.Color(def.tone||'#2f7d59'));
  });trunks.instanceMatrix.needsUpdate=true;crowns.instanceMatrix.needsUpdate=true;if(crowns.instanceColor)crowns.instanceColor.needsUpdate=true;trunks.castShadow=crowns.castShadow=true;trunks.receiveShadow=crowns.receiveShadow=true;root.add(trunks,crowns);
  const potMat=makeMaterial(0x26363c,{roughness:.86}),shrubMat=makeMaterial(0x3b946c,{roughness:.86});shrubMat.vertexColors=true;
  const pots=new THREE.InstancedMesh(new THREE.CylinderGeometry(.58,.72,.48,12),potMat,planterDefs.length),shrubs=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.55,1),shrubMat,planterDefs.length);
  planterDefs.forEach((def,i)=>{dummy.position.set(def.x,.24,def.z);dummy.rotation.set(0,i*.45,0);dummy.scale.set(1,1,1);dummy.updateMatrix();pots.setMatrixAt(i,dummy.matrix);dummy.position.set(def.x,.88,def.z);dummy.rotation.set(0,i*.61,0);dummy.scale.set(1.0+(i%2)*.12,.82+(i%3)*.08,1.0+(i%2)*.08);dummy.updateMatrix();shrubs.setMatrixAt(i,dummy.matrix);shrubs.setColorAt(i,new THREE.Color(i%2?'#3e9a70':'#2f855e'));});pots.instanceMatrix.needsUpdate=true;shrubs.instanceMatrix.needsUpdate=true;if(shrubs.instanceColor)shrubs.instanceColor.needsUpdate=true;root.add(pots,shrubs);
  const cloudMat=makeMaterial(0xe8f5f7,{roughness:1,transparent:true,opacity:.5});cloudMat.depthWrite=false;const cloudPuffs=[];for(const def of CAMPUS_AMBIENT.clouds){for(let j=0;j<3;j++)cloudPuffs.push({def,j});}
  const clouds=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),cloudMat,cloudPuffs.length);cloudPuffs.forEach(({def,j},i)=>{const offset=[[-.72,0,0],[.18,.18,.08],[.82,-.02,-.04]][j],scales=[[1.2,.48,.7],[1,.62,.82],[.9,.42,.66]][j];dummy.position.set(def.x+offset[0]*def.s,def.y+offset[1]*def.s,def.z+offset[2]*def.s);dummy.rotation.set(0,(i*.37)%Math.PI,0);dummy.scale.set(def.s*scales[0],def.s*scales[1],def.s*scales[2]);dummy.updateMatrix();clouds.setMatrixAt(i,dummy.matrix);});clouds.instanceMatrix.needsUpdate=true;clouds.frustumCulled=false;root.add(clouds);
  const maxStars=180,starGeo=new THREE.BufferGeometry(),starPos=[];for(let i=0;i<maxStars;i++){const a=((i*137.508)%360)*Math.PI/180,b=.22+((i*47)%71)/100,r=86;starPos.push(Math.cos(a)*r,22+b*62,Math.sin(a)*r);}starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xe5f2ff,size:.62,transparent:true,opacity:0,depthWrite:false,sizeAttenuation:true}));stars.frustumCulled=false;root.add(stars);
  const aircraft=[];const craft=(def)=>{const g=new THREE.Group(),accent=new THREE.Color(def.accent).getHex(),body=makeMaterial(accent,{emissive:accent,emissiveIntensity:.18,metalness:.42,roughness:.28}),dark=makeMaterial(0x16232a,{metalness:.52,roughness:.34}),rotors=[];if(def.kind==='cargo-drone'){g.add(box(2.8,.55,1.9,body,0,0,0),box(1.4,.42,2.7,dark,0,-.05,0));for(const[x,z]of[[-1.75,-1.3],[1.75,-1.3],[-1.75,1.3],[1.75,1.3]]){g.add(box(1.25,.08,.1,dark,x*.55,.02,z*.55));const r=new THREE.Mesh(new THREE.TorusGeometry(.52,.045,7,18),body);r.rotation.x=Math.PI/2;r.position.set(x,0,z);g.add(r);rotors.push(r);}}else{g.add(box(2.25,.46,1.4,body,0,0,0));for(const[x,z]of[[-1.45,-1.0],[1.45,-1.0],[-1.45,1.0],[1.45,1.0]]){g.add(box(1.15,.07,.08,dark,x*.52,0,z*.52));const r=new THREE.Mesh(new THREE.TorusGeometry(.46,.04,7,18),body);r.rotation.x=Math.PI/2;r.position.set(x,0,z);g.add(r);rotors.push(r);}}g.scale.setScalar(def.scale||1);g.userData={def,rotors};root.add(g);aircraft.push(g);return g;};CAMPUS_AMBIENT.aerial.forEach(craft);
  const sample=(path,t)=>{const scaled=((t%1)+1)%1*(path.length-1),i=Math.floor(scaled),j=Math.min(path.length-1,i+1),k=scaled-i;return{x:path[i][0]+(path[j][0]-path[i][0])*k,z:path[i][1]+(path[j][1]-path[i][1])*k,heading:Math.atan2(path[j][0]-path[i][0],path[j][1]-path[i][1])};};
  let currentQuality=quality,currentNight=0;const setQuality=q=>{currentQuality=q;const b=ambientBudget(q,'campus');trunks.count=crowns.count=Math.min(treeDefs.length,b.trees);pots.count=shrubs.count=Math.min(planterDefs.length,b.planters);clouds.count=Math.min(cloudPuffs.length,b.clouds*3);starGeo.setDrawRange(0,Math.min(maxStars,b.stars));aircraft.forEach((g,i)=>g.visible=i<b.aerial);clouds.visible=b.clouds>0;stars.visible=b.stars>0;};
  const updateTime=world=>{currentNight=Number(world?.night||0);stars.material.opacity=.08+currentNight*.78;cloudMat.opacity=.48-currentNight*.22;stars.visible=ambientBudget(currentQuality,'campus').stars>0&&currentNight>.08;};
  const update=(time,dt)=>{if(reducedMotion)return;aircraft.forEach((g,i)=>{if(!g.visible)return;const def=g.userData.def,pos=sample(def.path,time*def.speed+i*.19);g.position.set(pos.x,def.y+Math.sin(time*.7+i)*.55,pos.z);g.rotation.y=pos.heading;for(const rotor of g.userData.rotors||[])rotor.rotation.z+=dt*5.5;});clouds.rotation.y=time*.0006;};
  setQuality(quality);return{root,setQuality,update,updateTime,stats:{trees:treeDefs.length,planters:planterDefs.length,clouds:CAMPUS_AMBIENT.clouds.length,aerial:aircraft.length}};
}


function automaticDoor(accent=0x36d2ff){
  const g=new THREE.Group(),frame=makeMaterial(0x263943,{metalness:.72,roughness:.24}),glass=makeMaterial(accent,{emissive:accent,emissiveIntensity:.35,transparent:true,opacity:.44,metalness:.3,roughness:.12});
  g.add(box(4.6,.22,.42,frame,0,4.25,0),box(.22,4.25,.42,frame,-2.22,2.12,0),box(.22,4.25,.42,frame,2.22,2.12,0));
  const left=box(2.02,3.92,.12,glass,-1.02,2.0,.02),right=box(2.02,3.92,.12,glass,1.02,2.0,.02);g.add(left,right);g.userData={left,right,open:0};setShadow(g,true);return g;
}
function labChair(accent=0x36d2ff){const g=new THREE.Group(),seat=makeMaterial(0x1d2a31,{roughness:.74}),edge=makeMaterial(accent,{emissive:accent,emissiveIntensity:.18,roughness:.38});g.add(box(.62,.12,.62,seat,0,.56,0),box(.62,.72,.12,seat,0,.91,.27),box(.08,.55,.08,edge,-.24,.27,-.18),box(.08,.55,.08,edge,.24,.27,-.18),box(.08,.55,.08,edge,-.24,.27,.18),box(.08,.55,.08,edge,.24,.27,.18));setShadow(g,true);return g;}
function labComputer(accent=0x36d2ff){const g=new THREE.Group(),desk=makeMaterial(0x26343d,{roughness:.72}),dark=makeMaterial(0x0b1116,{roughness:.4}),off=makeMaterial(0x071015,{emissive:0x000000,emissiveIntensity:0,roughness:.2}),glow=makeMaterial(accent,{emissive:accent,emissiveIntensity:1.35,roughness:.12});g.add(box(2.4,.12,.8,desk,0,.78,0),box(.11,.78,.11,desk,-.95,.39,.22),box(.11,.78,.11,desk,.95,.39,.22));const mon=box(.94,.58,.08,dark,0,1.42,-.16),screen=box(.78,.42,.035,off,0,1.42,-.205);g.add(mon,screen,box(.12,.42,.12,desk,0,1.08,-.12),box(.62,.05,.28,desk,0,.86,-.05));const chair=labChair(accent);chair.position.set(0,0,1.15);chair.rotation.y=Math.PI;g.add(chair);g.userData={screen,screenOff:off,screenOn:glow,powered:false,chair};setShadow(g,true);return g;}
function labInterior({accent,key,title,origin=[0,0,55]}){
  const g=new THREE.Group();g.position.set(...origin);const theme=CAMPUS_CLASSROOM_INTERIOR_THEMES[key]||CAMPUS_CLASSROOM_INTERIOR_THEMES['1ds'],secondary=new THREE.Color(theme.secondary).getHex();const floor=makeMaterial(new THREE.Color(theme.floor).getHex(),{roughness:.72}),wall=makeMaterial(new THREE.Color(theme.wall).getHex(),{roughness:.82}),frame=makeMaterial(0x344c58,{metalness:.48,roughness:.3}),glass=makeMaterial(0x173d4b,{emissive:secondary,emissiveIntensity:.08,transparent:true,opacity:.38,metalness:.28,roughness:.16}),glow=makeMaterial(secondary,{emissive:secondary,emissiveIntensity:1.1,roughness:.22});
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
  // Etapa 33 — assinatura acadêmica leve por turma, sem alterar o layout/collider do laboratório.
  const classSig=new THREE.Group(),sigDark=makeMaterial(0x10191f,{metalness:.35,roughness:.42}),sigGlow=makeMaterial(secondary,{emissive:secondary,emissiveIntensity:.55,roughness:.22});classSig.position.set(8.15,0,-3.9);
  if(theme.motif==='logic'){for(const [x,y] of[[0,.35],[.55,.85],[-.55,.85],[0,1.35]])classSig.add(box(.42,.42,.42,sigGlow,x,y,0));}
  else if(theme.motif==='interface'){for(const x of[-.62,0,.62])classSig.add(box(.5,.9,.08,sigDark,x,.72,0),box(.4,.7,.035,sigGlow,x,.72,-.06));}
  else if(theme.motif==='systems'){for(const x of[-.48,.48]){classSig.add(box(.68,1.65,.55,sigDark,x,.83,0));for(let y=.28;y<1.48;y+=.3)classSig.add(box(.48,.055,.035,sigGlow,x,y,-.295));}}
  else {for(const x of[-.62,0,.62]){classSig.add(box(.42,.78,.06,sigDark,x,.67,0));classSig.add(box(.31,.6,.025,sigGlow,x,.67,-.045));}}
  const classLabel=spriteLabel(theme.detail,theme.secondary,2.7,{bg:'rgba(3,13,18,.82)'});classLabel.position.set(0,2.05,0);classSig.add(classLabel);g.add(classSig);
  setShadow(g,true);return {group:g,door,terminals,boardScreen:screen,boardTitle,boardSub,presentationPad,refs:[...terminals,{id:`${key}-exit`,type:'interior-exit',zoneKey:key,name:'Saída para a Praça',x:origin[0],z:origin[2]-5.85,radius:1.75},{id:`${key}-board`,type:'smartboard',zoneKey:key,name:`Painel ${title}`,x:origin[0],z:origin[2]+5.35,radius:2.1},{id:`${key}-present`,type:'presentation-spot',zoneKey:key,name:`Área de apresentação • ${title}`,x:origin[0]-4.25,z:origin[2]+4.9,radius:1.65},{id:`${key}-portal-terminal`,type:'lab-portal',zoneKey:key,name:`Portal de Atividades • ${title}`,x:origin[0]+8,z:origin[2]+4.6,radius:1.8}]};
}

function interiorRoomProp(roomStyle,accent,secondary){
  const g=new THREE.Group(),dark=makeMaterial(0x0d171d,{metalness:.34,roughness:.48}),mid=makeMaterial(0x263a43,{metalness:.3,roughness:.5}),glow=makeMaterial(new THREE.Color(roomStyle.accent||secondary).getHex(),{emissive:new THREE.Color(roomStyle.accent||secondary).getHex(),emissiveIntensity:.48,roughness:.24}),animated=[];
  const addScreen=(x,y,z,w=.75,h=.48)=>{const m=box(w,h,.035,glow,x,y,z);g.add(m);animated.push({mesh:m,kind:'pulse',base:.48});return m;};
  switch(roomStyle.prop){
    case 'workbench':g.add(box(2.6,.12,.75,mid,0,.72,0));for(const x of[-.9,.9])g.add(box(.09,.7,.09,dark,x,.35,.2));addScreen(0,1.28,-.32,1.1,.62);break;
    case 'rack':for(const x of[-.65,.65]){g.add(box(.78,1.8,.58,dark,x,.9,0));for(let y=.28;y<1.62;y+=.28)addScreen(x,y,-.31,.54,.055);}break;
    case 'console':for(const x of[-.9,0,.9]){g.add(box(.74,.72,.62,mid,x,.36,0));addScreen(x,.86,-.25,.58,.36);}break;
    case 'orbital':{const orb=new THREE.Mesh(new THREE.SphereGeometry(.33,14,10),glow);orb.position.y=.95;g.add(orb);for(const r of[.58,.86]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.028,7,28),glow);ring.rotation.x=Math.PI/2;ring.position.y=.95;g.add(ring);animated.push({mesh:ring,kind:'spin',speed:r});}}break;
    case 'arcade':for(const x of[-.62,.62]){g.add(box(.78,1.45,.62,dark,x,.72,0));addScreen(x,.94,-.33,.58,.42);}break;
    case 'counter':g.add(box(2.5,.78,.68,mid,0,.39,0));addScreen(.7,1.0,-.28,.58,.38);addScreen(-.7,1.0,-.28,.58,.38);break;
    case 'display':for(const x of[-.78,0,.78]){g.add(cylinder(.28,.34,mid,x,.17,0,18));const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.18),glow);gem.position.set(x,.65,0);g.add(gem);animated.push({mesh:gem,kind:'spin',speed:1+x});}break;
    case 'maker':g.add(box(2.5,.12,.85,mid,0,.72,0));g.add(cylinder(.13,.9,dark,.72,1.08,0,12),box(.72,.11,.13,glow,.38,1.48,0));addScreen(-.65,1.2,-.34,.7,.5);break;
    case 'exam':for(const [x,z] of[[-.7,-.34],[.7,-.34],[-.7,.48],[.7,.48]]){g.add(box(.9,.09,.55,mid,x,.66,z),box(.06,.62,.06,dark,x-.3,.31,z+.15),box(.06,.62,.06,dark,x+.3,.31,z+.15));addScreen(x,1.0,z-.24,.5,.3);}break;
    case 'briefing':g.add(box(2.7,.12,1.0,mid,0,.72,0));addScreen(0,1.35,-.42,1.15,.58);break;
    case 'seats':for(const [x,z] of[[-.8,-.25],[0,-.25],[.8,-.25],[-.4,.55],[.4,.55]])g.add(box(.58,.12,.5,mid,x,.48,z),box(.58,.52,.09,dark,x,.75,z+.2));break;
    case 'cinema':for(const [x,z] of[[-.9,-.25],[0,-.25],[.9,-.25],[-.9,.55],[0,.55],[.9,.55]])g.add(box(.62,.14,.56,mid,x,.46,z),box(.62,.62,.10,dark,x,.75,z+.22));break;
    case 'lounge':g.add(box(1.7,.24,.62,mid,-.65,.35,0),box(1.7,.7,.12,dark,-.65,.72,.24),box(.78,.32,.78,mid,1.0,.16,0));break;
    case 'hub':{const ring=new THREE.Mesh(new THREE.TorusGeometry(.78,.07,8,34),glow);ring.rotation.x=Math.PI/2;ring.position.y=.82;g.add(ring);animated.push({mesh:ring,kind:'spin',speed:.6});g.add(cylinder(.42,.62,mid,0,.31,0,18));}break;
    default:g.add(box(2.3,.12,.8,mid,0,.7,0));addScreen(0,1.18,-.3,.9,.48);break;
  }
  setShadow(g,true);return{group:g,animated};
}

function toolInterior(profile){
  const accent=new THREE.Color(profile.accent).getHex(),root=new THREE.Group();root.name=`tool-interior-${profile.id}`;root.position.set(profile.origin[0],0,profile.origin[2]);
  const style=profile.style||{},secondary=new THREE.Color(style.secondary||profile.accent).getHex(),floorMat=makeMaterial(new THREE.Color(style.floor||'#14242c').getHex(),{roughness:.82}),wall=makeMaterial(new THREE.Color(style.wall||'#20313a').getHex(),{roughness:.76}),frame=makeMaterial(0x314852,{metalness:.7,roughness:.25}),glass=makeMaterial(0x143b4a,{emissive:secondary,emissiveIntensity:.13,transparent:true,opacity:.46,metalness:.25,roughness:.14}),glow=makeMaterial(secondary,{emissive:secondary,emissiveIntensity:.95,roughness:.2}),dark=makeMaterial(0x071117,{roughness:.5});
  const floors=new Map(),doors=new Map(),elevatorPanels=new Map(),ambientNodes=[];let cinemaScreen=null;
  const wallH=3.8,w=profile.width,d=profile.depth;
  for(const floorDef of profile.floors){
    const fg=new THREE.Group();fg.name=`floor-${floorDef.index}`;fg.userData.floor=floorDef.index;fg.visible=floorDef.index===0;
    fg.add(box(w,.18,d,floorMat,0,.09,0));
    // identidade do piso: poucas marcas arquitetônicas, sem preencher o interior com decoração solta.
    const motifMat=makeMaterial(secondary,{emissive:secondary,emissiveIntensity:.24,transparent:true,opacity:.38,roughness:.28});
    if(style.motif==='orbit'){for(const r of[1.7,3.1]){const ring=new THREE.Mesh(new THREE.RingGeometry(r-.035,r+.035,40),new THREE.MeshBasicMaterial({color:secondary,transparent:true,opacity:.34,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.19;fg.add(ring);}}
    else if(style.motif==='exam'){for(const x of[-4.5,-1.5,1.5,4.5])fg.add(box(.055,.025,7.2,motifMat,x,.19,.6));}
    else if(style.motif==='circuit'||style.motif==='soc'||style.motif==='maker'){fg.add(box(10,.025,.055,motifMat,0,.19,0),box(.055,.025,5.4,motifMat,0,.19,0));}
    else if(style.motif==='gallery'||style.motif==='arcade'){for(const x of[-4,0,4])fg.add(box(2.1,.025,.055,motifMat,x,.19,1.0));}
    else if(style.motif==='cinema'){for(const z of[-1.4,-.25,.9,2.05])fg.add(box(10.8,.025,.045,motifMat,0,.19,z));}
    else fg.add(box(7.5,.025,.06,motifMat,0,.19,.2));
    // perímetro com vão de entrada no piso térreo
    fg.add(box(w,.22,.22,frame,0,wallH,.0));
    fg.add(box(w,wallH,.18,wall,0,wallH/2,d/2));
    fg.add(box(.18,wallH,d,wall,-w/2,wallH/2,0),box(.18,wallH,d,wall,w/2,wallH/2,0));
    if(floorDef.index===0){fg.add(box((w-4.4)/2,wallH,.18,wall,-(w+4.4)/4,wallH/2,-d/2),box((w-4.4)/2,wallH,.18,wall,(w+4.4)/4,wallH/2,-d/2));}
    else fg.add(box(w,wallH,.18,wall,0,wallH/2,-d/2));
    // corredor central, divisórias laterais e iluminação
    if(!(profile.id==='cinema'&&floorDef.index===0))fg.add(box(.08,2.9,4.2,frame,-2.7,1.45,1.65),box(.08,2.9,4.2,frame,2.7,1.45,1.65));
    for(const x of[-6,-2,2,6])for(const z of[-1.3,2.5])fg.add(box(2.8,.055,.34,glow,x,3.55,z));
    const title=spriteLabel(`${profile.label} • ${floorDef.code}`,profile.accent,5.2,{bg:'rgba(3,13,18,.9)'}),headerZ=profile.id==='cinema'&&floorDef.index===0?-4.82:4.82;title.position.set(0,3.25,headerZ);fg.add(title);
    const floorLabel=spriteLabel(floorDef.name,'#d9f7ff',4.0,{bg:'rgba(3,13,18,.78)'});floorLabel.position.set(0,2.75,headerZ);fg.add(floorLabel);
    // recepção/portal no térreo
    if(floorDef.index===0){
      fg.add(box(3.5,.92,1.0,frame,-5.3,.46,-2.9),box(2.9,.08,.82,glow,-5.3,.96,-2.9));
      const rec=spriteLabel('RECEPÇÃO',profile.accent,2.8,{bg:'rgba(3,13,18,.82)'});rec.position.set(-5.3,2.0,-2.9);fg.add(rec);
      if(profile.id==='cinema'){
        const screenFrame=box(11.4,3.35,.28,dark,0,2.0,4.66);fg.add(screenFrame);
        const screenMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
        cinemaScreen=box(10.75,2.82,.08,screenMat,0,2.0,4.48);cinemaScreen.userData.cinemaScreen=true;fg.add(cinemaScreen);
        const screenLabel=spriteLabel('TELA PRINCIPAL • E PARA ASSISTIR',profile.accent,4.6,{bg:'rgba(14,5,11,.9)'});screenLabel.position.set(0,3.56,4.28);fg.add(screenLabel);
        const aisleMat=makeMaterial(0x251421,{roughness:.88}),seatMat=makeMaterial(0x5c2038,{roughness:.72}),seatDark=makeMaterial(0x1b1018,{roughness:.9});
        fg.add(box(1.1,.045,5.2,aisleMat,0,.20,.65));
        for(const [row,z] of [[0,-1.45],[1,-.25],[2,.95],[3,2.15]]){
          for(const x of[-4.4,-3.3,-2.2,2.2,3.3,4.4]){
            const seat=new THREE.Group();seat.add(box(.82,.16,.68,seatMat,0,.55,0),box(.82,.72,.12,seatDark,0,.88,.26),box(.09,.55,.09,seatDark,-.31,.27,-.2),box(.09,.55,.09,seatDark,.31,.27,-.2));seat.position.set(x,.06,z+row*.03);fg.add(seat);
          }
        }
        const projectionGlow=new THREE.PointLight(0xff5f8f,2.4,10,2);projectionGlow.position.set(0,3.25,1.9);fg.add(projectionGlow);
      }else if(profile.id==='security-center'){
        const monitorFrame=makeMaterial(0x09151b,{metalness:.64,roughness:.28}),monitorGlow=makeMaterial(0x5ce1ff,{emissive:0x5ce1ff,emissiveIntensity:.62,roughness:.18});
        for(const [x,y] of[[-2.45,2.72],[0,2.72],[2.45,2.72],[-2.45,1.45],[0,1.45],[2.45,1.45]]){fg.add(box(2.18,1.05,.18,monitorFrame,x,y,4.68));const feed=box(1.92,.82,.055,monitorGlow,x,y,4.55);fg.add(feed);ambientNodes.push({mesh:feed,kind:'pulse',floor:0});}
        fg.add(box(7.2,.16,1.35,frame,0,.82,.72),box(5.9,.05,1.02,glow,0,.92,.72));
        for(const x of[-2.45,0,2.45]){const consoleScreen=box(1.45,.62,.06,monitorGlow,x,1.38,.3);consoleScreen.rotation.x=-.38;fg.add(consoleScreen);ambientNodes.push({mesh:consoleScreen,kind:'pulse',floor:0});}
        const cctvLabel=spriteLabel('MATRIZ CCTV • E PARA OPERAR',profile.accent,4.5,{bg:'rgba(3,13,18,.92)'});cctvLabel.position.set(0,3.55,4.34);fg.add(cctvLabel);
        const privacyLabel=spriteLabel('ÁREAS PÚBLICAS • SEM INTERIORES','#d9f7ff',3.45,{bg:'rgba(3,13,18,.8)'});privacyLabel.position.set(0,3.08,4.34);fg.add(privacyLabel);
      }else{
        const portalBase=box(2.6,2.7,.22,dark,5.5,1.35,3.82);fg.add(portalBase,box(2.2,2.25,.10,glass,5.5,1.35,3.68));
        const portalLabel=spriteLabel('ABRIR FERRAMENTA',profile.accent,3.0,{bg:'rgba(3,13,18,.88)'});portalLabel.position.set(5.5,3.15,3.5);fg.add(portalLabel);
      }
      const door=automaticDoor(accent);door.position.set(0,0,-d/2+.04);fg.add(door);doors.set(0,door);
      if(profile.garage){const gm=makeMaterial(0x17262d,{roughness:.85});fg.add(box(4.1,.14,2.6,gm,0,.12,4.6));for(const x of[-1.45,1.45])fg.add(box(.08,.75,2.3,glow,x,.45,4.6));const gl=spriteLabel('GARAGEM',profile.accent,2.7,{bg:'rgba(3,13,18,.84)'});gl.position.set(0,1.65,4.45);fg.add(gl);}
    }else{
      // salas de especialidade no pavimento superior
      for(const [x,z,label] of[[-5.6,-2.7,profile.services[2]||'Sala A'],[0,-2.7,profile.services[3]||'Sala B'],[5.6,-2.7,'Projetos'],[-5.6,2.4,'Equipe'],[0,2.4,'Colaboração']]){fg.add(box(3.7,2.8,.14,glass,x,1.4,z));const l=spriteLabel(label,'#d8f6ff',2.45,{bg:'rgba(3,13,18,.7)'});l.position.set(x,2.4,z+.12);fg.add(l);}
    }
    // ambientes especializados declarados no blueprint da Cidade Viva.
    const floorMap=(profile.floorMaps||[]).find(item=>item.index===floorDef.index);
    for(const room of floorMap?.rooms||[]){if(profile.id==='cinema'&&floorDef.index===0&&room.id==='screening')continue;const lx=room.x-profile.origin[0],lz=room.z-profile.origin[2],roomStyle=interiorRoomStyle(room.kind,profile.accent),roomAccent=new THREE.Color(roomStyle.accent||profile.accent).getHex(),roomGlow=makeMaterial(roomAccent,{emissive:roomAccent,emissiveIntensity:.3,transparent:true,opacity:.26,roughness:.28});fg.add(box(Math.min(5.2,Number(room.w||3.5)),.055,Math.min(2.6,Number(room.d||1.8)),roomGlow,lx,.12,lz));const label=spriteLabel(`${roomStyle.icon} ${String(room.label||'AMBIENTE').toUpperCase()}`,roomStyle.accent||profile.accent,2.65,{bg:'rgba(3,13,18,.78)'});label.position.set(lx,1.92,lz);fg.add(label);const prop=interiorRoomProp(roomStyle,accent,secondary);prop.group.position.set(lx,.05,lz);prop.group.scale.setScalar(.78);fg.add(prop.group);for(const node of prop.animated)ambientNodes.push({...node,floor:floorDef.index});}
    const signature=CAMPUS_INTERIOR_SIGNATURES[profile.id];if(floorDef.index===0&&signature&&profile.id!=='cinema'){const sig=new THREE.Group(),sigMat=makeMaterial(accent,{emissive:accent,emissiveIntensity:.42,roughness:.25}),sigDark=makeMaterial(0x101b21,{metalness:.42,roughness:.4});sig.position.set(4.15,0,-1.05);sig.scale.setScalar(.72);if(signature.kind==='orrery'){const orb=new THREE.Mesh(new THREE.SphereGeometry(.55,18,12),sigMat);orb.position.y=1.35;sig.add(orb);for(const r of[.9,1.35]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,42),sigMat);ring.rotation.x=Math.PI/2;ring.position.y=1.35;sig.add(ring);}}else if(signature.kind==='arcade'){for(const x of[-1.4,0,1.4])sig.add(box(.9,1.75,.72,sigDark,x,.88,0),box(.68,.54,.04,sigMat,x,1.16,-.38));}else if(signature.kind==='servers'){for(const x of[-1.2,1.2]){sig.add(box(.92,2.2,.76,sigDark,x,1.1,0));for(let y=.35;y<1.95;y+=.32)sig.add(box(.68,.08,.04,sigMat,x,y,-.4));}}else if(signature.kind==='showcase'){for(const x of[-1.5,0,1.5]){sig.add(cylinder(.5,.45,sigDark,x,.23,0,22));const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.32),sigMat);gem.position.set(x,.95,0);sig.add(gem);}}else if(signature.kind==='vault'){sig.add(box(3.4,2.2,.3,sigDark,0,1.1,.3));const wheel=new THREE.Mesh(new THREE.TorusGeometry(.62,.09,10,34),sigMat);wheel.position.set(0,1.1,.12);sig.add(wheel);}else if(signature.kind==='exam'){for(const x of[-1.5,0,1.5])sig.add(box(1.05,.12,.72,sigDark,x,.72,0),box(.08,.7,.08,sigDark,x-.38,.35,.22),box(.08,.7,.08,sigDark,x+.38,.35,.22));}else if(signature.kind==='cinema'){sig.add(box(3.7,2.05,.18,sigDark,0,1.12,.2),box(3.25,1.62,.06,sigMat,0,1.12,.08));for(const x of[-1.15,0,1.15])sig.add(box(.75,.12,.55,sigDark,x,.35,-.8),box(.75,.5,.08,sigDark,x,.62,-.58));}else{sig.add(box(3.9,.16,1.45,sigDark,0,.75,0),box(3.2,.05,1.0,sigMat,0,.86,0));}const sigLabel=spriteLabel(`${signature.icon} ${signature.label.toUpperCase()}`,profile.accent,3.3,{bg:'rgba(3,13,18,.86)'});sigLabel.position.set(0,2.7,0);sig.add(sigLabel);fg.add(sig);}
    // mapa interno junto à parede oeste.
    fg.add(box(1.25,1.75,.16,frame,-7.2,1.12,-3.5),box(1.03,1.35,.04,glass,-7.2,1.18,-3.6));const mapLabel=spriteLabel('MAPA',profile.accent,2.0,{bg:'rgba(3,13,18,.86)'});mapLabel.position.set(-7.2,2.35,-3.48);fg.add(mapLabel);
    // elevador e escada presentes em todos os pisos
    fg.add(box(2.2,3.0,1.7,frame,6.3,1.5,-3.55));const epLeft=box(.83,2.45,.08,glass,5.87,1.35,-4.43),epRight=box(.83,2.45,.08,glass,6.73,1.35,-4.43);fg.add(epLeft,epRight);const indicator=box(.5,.12,.08,glow,6.3,2.86,-4.45);fg.add(indicator);elevatorPanels.set(floorDef.index,{left:epLeft,right:epRight,indicator});const el=spriteLabel('ELEVADOR',profile.accent,2.5,{bg:'rgba(3,13,18,.86)'});el.position.set(6.3,3.2,-3.5);fg.add(el);
    const stair=new THREE.Group();for(let i=0;i<7;i++)stair.add(box(2.2,.12,.42,frame,0,.12+i*.18,-1.25+i*.38));stair.position.set(-6.4,0,3.55);fg.add(stair);const sl=spriteLabel('ESCADA','#d9f7ff',2.4,{bg:'rgba(3,13,18,.82)'});sl.position.set(-6.4,2.35,3.55);fg.add(sl);
    floors.set(floorDef.index,fg);root.add(fg);
  }
  // v14.10.8.66: cabine física independente do piso lógico. A viagem anima antes da troca de pavimento.
  const elevatorCabin=new THREE.Group(),cabinBody=makeMaterial(0x263943,{metalness:.76,roughness:.22}),cabinGlass=makeMaterial(accent,{emissive:accent,emissiveIntensity:.18,transparent:true,opacity:.34,metalness:.3,roughness:.12}),ec=CAMPUS_ELEVATOR_SYSTEM.cabin;
  elevatorCabin.add(box(ec.width,.12,ec.depth,cabinBody,0,.06,0),box(ec.width,.12,ec.depth,cabinBody,0,ec.height,0),box(.10,ec.height,ec.depth,cabinBody,-ec.width/2,ec.height/2,0),box(.10,ec.height,ec.depth,cabinBody,ec.width/2,ec.height/2,0),box(ec.width,ec.height,.06,cabinGlass,0,ec.height/2,ec.depth/2));elevatorCabin.position.set(6.3,0,-3.55);elevatorCabin.visible=false;root.add(elevatorCabin);
  const refs=CAMPUS_INTERIOR_INTERACTIONS.filter(item=>item.interiorId===profile.id).map(item=>({...item}));
  root.userData={kind:'tool-interior',interiorId:profile.id,styleFamily:style.family||profile.template};setShadow(root,true);return{group:root,floors,doors,elevatorPanels,elevatorCabin,elevatorMotion:null,refs,profile,ambientNodes,elevatorAnimUntil:0,receptionistAvatar:null,cinemaScreen};
}

function campusMobilityVehicle(def,{interactive=false}={}){
  const accent=new THREE.Color(def.accent||'#36d2ff').getHex(),body=makeMaterial(accent,{metalness:.52,roughness:.28}),glass=makeMaterial(0x173442,{emissive:accent,emissiveIntensity:.18,transparent:true,opacity:.7,metalness:.25,roughness:.12}),rubber=makeMaterial(0x080d11,{roughness:.95}),trim=makeMaterial(0x0d141a,{metalness:.52,roughness:.36}),lamp=makeMaterial(0xfef1c8,{emissive:0xf6dd9a,emissiveIntensity:.72}),tail=makeMaterial(0xff7568,{emissive:0xff7568,emissiveIntensity:.52}),g=new THREE.Group();
  const kind=def.kind||'car',long=kind==='bus'||kind==='van',bike=kind==='bike',drone=kind==='drone',helicopter=kind==='helicopter';
  if(drone){
    g.add(box(1.05,.24,.72,body,0,.58,0),box(.55,.22,.46,glass,0,.76,.02),box(.26,.12,.34,trim,0,.43,.02));
    for(const [x,z] of[[-.72,-.56],[.72,-.56],[-.72,.56],[.72,.56]]){
      g.add(box(.72,.055,.08,trim,x*.52,.62,z*.52));
      const rotor=new THREE.Group();rotor.position.set(x,.78,z);rotor.userData.aerialRotor='y';
      rotor.add(box(.68,.025,.055,trim,0,0,0),box(.055,.025,.68,trim,0,0,0));g.add(rotor);
      g.add(cylinder(.055,.22,trim,x,.55,z,8));
    }
    g.add(box(.12,.09,.12,lamp,-.34,.58,.42),box(.12,.09,.12,tail,.34,.58,-.42));
  }else if(helicopter){
    const fuselage=new THREE.Group();fuselage.add(box(1.22,.72,1.62,body,0,.82,.08),box(1.04,.54,.8,glass,0,1.0,.58),box(.72,.42,1.08,body,0,.88,-.82));g.add(fuselage);
    g.add(box(.28,.25,2.35,body,0,.94,-2.04),box(.08,.82,.5,body,0,1.25,-3.08));
    for(const x of[-.72,.72]){g.add(box(.07,.07,1.72,trim,x,.25,.05),box(.65,.055,.08,trim,x/2,.34,.65),box(.65,.055,.08,trim,x/2,.34,-.65));}
    const mainRotor=new THREE.Group();mainRotor.position.set(0,1.72,-.02);mainRotor.userData.aerialRotor='y';mainRotor.add(box(4.1,.035,.09,trim),box(.09,.035,4.1,trim));g.add(mainRotor);
    const tailRotor=new THREE.Group();tailRotor.position.set(.19,1.28,-3.13);tailRotor.rotation.z=Math.PI/2;tailRotor.userData.aerialRotor='z';tailRotor.add(box(.95,.035,.07,trim),box(.07,.035,.95,trim));g.add(tailRotor);
    g.add(box(.16,.12,.08,lamp,-.3,.92,.9),box(.16,.12,.08,lamp,.3,.92,.9),box(.14,.1,.08,tail,0,.98,-3.24));
  }else if(bike){
    for(const z of[-.62,.62]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.28,.06,9,24),rubber);wheel.rotation.y=Math.PI/2;wheel.position.set(0,.28,z);g.add(wheel);}
    g.add(box(.08,.55,.98,trim,0,.58,0),box(.6,.06,.08,trim,0,.72,0),box(.42,.05,.16,trim,0,.86,-.22),box(.36,.05,.14,trim,0,.9,.38),box(.05,.28,.05,trim,.2,.48,.44),box(.05,.28,.05,trim,-.2,.48,.44));
    g.add(box(.12,.32,.36,body,0,.56,-.02),box(.38,.05,.06,body,0,.96,-.54),box(.32,.05,.06,tail,0,.74,.58));
  }else{
    const len=long?(kind==='bus'?2.95:2.45):1.86,wid=long?1.12:.98,bodyH=kind==='bus'?.64:.56,roofLen=kind==='bus'?len*.76:(kind==='van'?len*.58:len*.48),roofH=kind==='bus'?.42:(kind==='van'?.38:.34);
    g.add(box(wid,bodyH,len,body,0,.48,0));
    g.add(box(wid*.88,roofH,roofLen,glass,0,.96,kind==='bus'?-0.02:-0.06));
    g.add(box(wid*.72,.14,len*.22,body,0,.86,len*.27),box(wid*.72,.14,len*.18,body,0,.84,-len*.31));
    g.add(box(wid*.96,.08,len+.08,trim,0,.16,0),box(wid*.96,.06,.12,trim,0,.42,len*.51),box(wid*.96,.06,.12,trim,0,.42,-len*.51));
    if(kind==='bus'){
      for(const side of[-1,1])g.add(box(.05,.3,len*.62,glass,side*wid*.45,.98,-.02));
      for(const side of[-1,1])for(const z of[-.55,0,.55])g.add(box(.03,.24,.02,lamp,side*wid*.47,.98,z));
      g.add(box(wid*.18,.16,.12,lamp,-wid*.22,.62,len*.51),box(wid*.18,.16,.12,lamp,wid*.22,.62,len*.51),box(wid*.18,.14,.12,tail,-wid*.22,.62,-len*.51),box(wid*.18,.14,.12,tail,wid*.22,.62,-len*.51));
    }else{
      g.add(box(wid*.18,.18,.02,lamp,-wid*.24,.68,len*.49),box(wid*.18,.18,.02,lamp,wid*.24,.68,len*.49),box(wid*.16,.16,.02,tail,-wid*.24,.66,-len*.49),box(wid*.16,.16,.02,tail,wid*.24,.66,-len*.49));
      if(kind==='van')g.add(box(wid*.76,.18,len*.18,glass,0,1.08,.12));
    }
    for(const x of[-wid*.42,wid*.42])for(const z of[-len*.32,len*.32]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.14,16),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.24,z);g.add(wheel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.145,10),trim);hub.rotation.z=Math.PI/2;hub.position.set(x,.24,z);g.add(hub);}
  }
  if(interactive){const ring=new THREE.Mesh(new THREE.RingGeometry(.8,1.02,28),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.4,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);g.userData.interactionRing=ring;}
  setShadow(g,true);return g;
}
function animateAerialRotors(root,dt,multiplier=1){if(!root)return;root.traverse?.(o=>{if(o.userData?.aerialRotor==='y')o.rotation.y+=dt*22*multiplier;else if(o.userData?.aerialRotor==='z')o.rotation.z+=dt*28*multiplier;});}

function campusHelipad(def){
  const g=new THREE.Group(),accent=new THREE.Color(def.accent||'#72e6ff').getHex(),pad=makeMaterial(0x172229,{metalness:.3,roughness:.62}),glow=makeMaterial(accent,{emissive:accent,emissiveIntensity:.85,roughness:.28});
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(def.radius||2.8,def.radius||2.8,.12,40),pad);disc.position.y=.06;g.add(disc);
  const ring=new THREE.Mesh(new THREE.RingGeometry((def.radius||2.8)*.7,(def.radius||2.8)*.9,40),new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.62,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.13;g.add(ring);
  g.add(box(.22,.04,1.65,glow,-.48,.15,0),box(.22,.04,1.65,glow,.48,.15,0),box(1.18,.04,.22,glow,0,.15,0));
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5]){const x=Math.cos(a)*(def.radius-.3),z=Math.sin(a)*(def.radius-.3);g.add(cylinder(.08,.12,glow,x,.17,z,10));}
  const label=spriteLabel(`${def.code} • HELIPONTO`,def.accent||'#72e6ff',3.1,{bg:'rgba(3,12,18,.86)'});label.position.set(0,2.25,0);label.userData.labelCullDistance=26;g.add(label);g.position.set(def.x,0,def.z);return g;
}

function wayfindingTotem(x,z,rot,label,accent=0x36d2ff){const g=new THREE.Group(),frame=makeMaterial(0x12222a,{metalness:.46,roughness:.36}),edge=makeMaterial(accent,{emissive:accent,emissiveIntensity:.62,roughness:.25});g.add(box(.16,2.7,.16,frame,-1.05,1.35,0),box(.16,2.7,.16,frame,1.05,1.35,0),box(2.25,.16,.2,frame,0,2.62,0),box(2.05,.055,.1,edge,0,2.42,.07));const sign=spriteLabel(label,'#aeefff',3.7,{bg:'rgba(5,16,22,.88)'});sign.position.set(0,1.82,.16);g.add(sign);g.position.set(x,0,z);g.rotation.y=rot;setShadow(g,true);return g;}

export async function createLobby3D({canvas,zones,state,isStaff,className,onInteract,onPlayerState,onQualityChange,onPerf,onError,onAreaChange,onFirstFrame,onInteriorChange,onContextLost,onChallengeEvent,onWorldTime,onVehicleTelemetry,signal,initialQuality=null}){
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
  const visualDevice={mobile,hardware,cores,saveData:!!navigator.connection?.saveData};
  const presetFor=q=>{const v=visualQualityProfile(q,visualDevice);return{pixel:rendererPixelRatio(q,visualDevice,devicePixelRatio||1),shadows:v.shadows,particles:q==='low'?24:q==='medium'?54:q==='high'?120:220,shadowSize:v.shadowSize||512,visual:v};};
  const presets={low:presetFor('low'),medium:presetFor('medium'),high:presetFor('high'),ultra:presetFor('ultra')};let cfg=presets[quality];
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x07111a);scene.fog=new THREE.FogExp2(0x0a1821,.014);const sky=skyDome(),moonVisual=moonDisc(),sunVisual=sunDisc();scene.add(sky,moonVisual,sunVisual);const exteriorRoot=new THREE.Group(),interiorRoot=new THREE.Group();exteriorRoot.name='campus-exterior-runtime';interiorRoot.name='campus-interior-runtime';interiorRoot.visible=false;scene.add(exteriorRoot,interiorRoot);
  const camera=new THREE.PerspectiveCamera(58,1,.08,190);const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance',alpha:false,failIfMajorPerformanceCaveat:false});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  let moon=null,portalSystem=null,resizeController=null,adaptiveController=null,ambientLandscape=null,weatherEffects=null,environment=null;
  const applyQuality=(q,{manual=false}={})=>{quality=presets[q]?q:quality;cfg=presets[quality];avatarSystem.setQuality(quality);portalSystem?.setQuality?.(quality);environment?.setQuality?.(quality);renderer.shadowMap.enabled=cfg.shadows;renderer.toneMappingExposure=cfg.visual?.toneExposure??1.08;if(moon){moon.castShadow=cfg.shadows;moon.shadow.mapSize.set(cfg.shadowSize,cfg.shadowSize);moon.shadow.map?.dispose?.();moon.shadow.map=null;}adaptiveController?.qualityChanged?.(quality,{manual});ambientLandscape?.setQuality?.(quality);weatherEffects?.setQuality?.(quality);resizeController?.request?.();onQualityChange?.(quality);};
  resizeController=createResizeController({canvas,renderer,camera,getPixelRatio:()=>cfg.pixel});
  const lighting=createCampusLighting({THREE,scene,quality,shadows:cfg.shadows,shadowSize:cfg.shadowSize});
  const hemi=lighting.hemi;moon=lighting.key;const warm=lighting.warm,centerLight=lighting.center;applyQuality(quality);
  environment=createCampusEnvironment({THREE,scene:exteriorRoot,zones,quality,spriteLabel});environment.setQuality?.(quality);
  const {centralFountain,beacon,canopy,transit}=environment;
  const airdropPlane=airdropTransportPlane();exteriorRoot.add(airdropPlane);
  const cameraCollisionRoots=[...environment.cameraCollisionRoots];
  exteriorRoot.add(wayfindingTotem(0,-10.4,0,'1DS  •  2DS',0x36d2ff),wayfindingTotem(0,10.4,Math.PI,'3DS  •  SUB',0xb58cff),wayfindingTotem(-10.6,0,Math.PI/2,'PRAÇA  •  LABS',0x51e7a3),wayfindingTotem(10.6,0,-Math.PI/2,'ATIVIDADES',0xffae63));
  portalSystem=createPortalSystem({THREE,scene:exteriorRoot,zones,layouts:CAMPUS_ZONE_LAYOUT,state,spriteLabel,quality});
  const portalMap=portalSystem.getEntries();
  for(const [x,z,a] of[[-8,-8,true],[8,-8,true],[-8,8,true],[8,8,true],[-19,0,false],[19,0,false],[0,-19,false],[0,19,false],[-32,0,false],[32,0,false]])exteriorRoot.add(lamp(x,z,{activeLight:a}));
  ambientLandscape=createCampusAmbientLandscape({quality,reducedMotion:profile.reducedMotion});exteriorRoot.add(ambientLandscape.root);ambientLandscape.setQuality(quality);
  weatherEffects=createWorldWeatherEffects({THREE,scene,quality,reducedMotion:profile.reducedMotion,saveData:!!navigator.connection?.saveData,extent:74,height:58});weatherEffects.setQuality(quality);
  if(quality!=='low')exteriorRoot.add(lowWall(-15,0,5.5,.55,Math.PI/2),lowWall(15,0,5.5,.55,Math.PI/2));
  // Objetos funcionais existem em todas as qualidades; só a decoração é degradada no Eco.
  exteriorRoot.add(bench(-8,-.8,Math.PI/2),bench(8,.8,-Math.PI/2),bench(-.8,-8,0),bench(.8,8,Math.PI));
  const seats=[{id:'bench-west',x:-8,z:-.8,rot:Math.PI/2},{id:'bench-east',x:8,z:.8,rot:-Math.PI/2},{id:'bench-south',x:-.8,z:-8,rot:0},{id:'bench-north',x:.8,z:8,rot:Math.PI}];
  const worldObjects=[];worldObjects.push(...(environment.experienceRefs||[]));
  // P5.7: interiores 3D são instâncias locais. Coordenadas internas nunca são enviadas diretamente ao backend.
  const interiorOrigins=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.interiorOrigin]));
  const exteriorEntrances=Object.fromEntries(Object.entries(CAMPUS_ZONE_LAYOUT).map(([key,layout])=>[key,layout.exteriorEntrance]));
  const interiors=new Map(),toolInteriors=new Map(),entranceDoors=[];
  let cinemaMediaState=normalizeCinemaMedia(state.cinemaMedia||{}),cinemaVideo=null,cinemaVideoTexture=null;
  function disposeCinemaVideo(){
    const room=toolInteriors.get('cinema'),screen=room?.cinemaScreen;
    if(screen?.material?.map===cinemaVideoTexture){screen.material.map=null;screen.material.needsUpdate=true;}
    try{cinemaVideo?.pause?.();if(cinemaVideo){cinemaVideo.removeAttribute('src');cinemaVideo.load?.();}}catch(_){}
    cinemaVideoTexture?.dispose?.();cinemaVideoTexture=null;cinemaVideo=null;
  }
  function applyCinemaScreen(room){
    const screen=room?.cinemaScreen;if(!screen?.material)return;
    if(screen.material.map&&screen.material.map!==cinemaVideoTexture)screen.material.map.dispose?.();
    screen.material.map=null;screen.material.color.set(0xffffff);
    const media=cinemaMediaState;
    if(media.enabled&&media.source_type==='direct'&&media.source_url){
      disposeCinemaVideo();
      const video=document.createElement('video');video.crossOrigin='anonymous';video.muted=true;video.playsInline=true;video.loop=!!media.loop;video.preload='metadata';video.src=media.source_url;
      const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;
      cinemaVideo=video;cinemaVideoTexture=texture;screen.material.map=texture;video.play().catch(()=>{});
    }else{
      const label=media.enabled?`${media.title||'SESSÃO AGV'} • E PARA ASSISTIR`:'CINEMA AGV • AGUARDANDO PROGRAMAÇÃO';
      screen.material.map=roundedCanvasTexture(label,{width:1024,height:512,font:800,bg:'#09070b',fg:'#fff5f8',accent:'#ff5f8f'});
    }
    screen.material.needsUpdate=true;
  }
  function setCinemaMedia(media){
    cinemaMediaState=normalizeCinemaMedia(media||{});state.cinemaMedia=cinemaMediaState;
    const room=toolInteriors.get('cinema');if(room){disposeCinemaVideo();applyCinemaScreen(room);}
    return {...cinemaMediaState};
  }
  for(const z of zones){const color=new THREE.Color(z.accent).getHex(),ent=exteriorEntrances[z.key],door=automaticDoor(color);door.position.set(ent.x,0,ent.z);door.rotation.y=ent.rot;exteriorRoot.add(door);cameraCollisionRoots.push(door);entranceDoors.push({door,key:z.key,x:ent.x,z:ent.z});worldObjects.push({id:`entrance-${z.key}`,type:'building-entrance',zoneKey:z.key,name:`Entrada ${z.label} • Laboratório`,x:ent.x,z:ent.z,radius:2.1});}
  const interiorGuideLine=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x72e6ff,transparent:true,opacity:.92}));interiorGuideLine.visible=false;interiorRoot.add(interiorGuideLine);let activeToolGuide=null,activeInteriorCollisionRoots=[];
  const removeScopedWorldObjects=scope=>{for(let i=worldObjects.length-1;i>=0;i--)if(worldObjects[i]?.__interiorScope===scope)worldObjects.splice(i,1);};
  const mountScopedWorldObjects=(refs,scope)=>{for(const ref of refs||[])worldObjects.push({...ref,__interiorScope:scope});};
  const setWorldMode=inside=>{exteriorRoot.visible=!inside;interiorRoot.visible=inside;sky.visible=!inside;sunVisual.visible=!inside;moonVisual.visible=!inside;activeInteriorCollisionRoots=inside?activeInteriorCollisionRoots:[];};
  const ensureClassInterior=key=>{let room=interiors.get(key);if(room)return room;const zone=zones.find(item=>item.key===key),origin=interiorOrigins[key];if(!zone||!origin)return null;const color=new THREE.Color(zone.accent).getHex(),built=labInterior({accent:color,key,title:zone.label,origin});built.group.visible=true;interiorRoot.add(built.group);room={...built,origin,zone};interiors.set(key,room);mountScopedWorldObjects(room.refs,`class:${key}`);return room;};
  const releaseClassInterior=key=>{const room=interiors.get(key);if(!room)return;interiorRoot.remove(room.group);disposeObject(room.group);interiors.delete(key);removeScopedWorldObjects(`class:${key}`);};
  const ensureToolInterior=id=>{let room=toolInteriors.get(id);if(room)return room;const profile=CAMPUS_INTERIOR_MAP[id];if(!profile)return null;room=toolInterior(profile);if(id==='cinema')applyCinemaScreen(room);if(profile.receptionist){const av=avatarSystem.createAvatar({accent:profile.accent,staff:true,label:profile.receptionist.name,seed:`reception-${profile.id}`});av.position.set(profile.receptionist.x-profile.origin[0],0,profile.receptionist.z-profile.origin[2]);av.scale.setScalar(.88);room.floors.get(0)?.add(av);room.receptionistAvatar=av;}room.group.visible=true;interiorRoot.add(room.group);toolInteriors.set(id,room);mountScopedWorldObjects(room.refs,`tool:${id}`);return room;};
  const releaseToolInterior=id=>{const room=toolInteriors.get(id);if(!room)return;if(id==='cinema')disposeCinemaVideo();if(room.receptionistAvatar){room.receptionistAvatar.parent?.remove(room.receptionistAvatar);avatarSystem.disposeAvatar(room.receptionistAvatar);}interiorRoot.remove(room.group);disposeObject(room.group);toolInteriors.delete(id);removeScopedWorldObjects(`tool:${id}`);};
  const kiosk=campusKiosk(4.7,-4.8);exteriorRoot.add(kiosk);worldObjects.push({id:'campus-kiosk',type:'kiosk',name:'Totem do Campus',x:4.7,z:-4.8,radius:2.0});
  const meetupDefs=[['1ds',-16,-8,'#36d2ff','ENCONTRO 1DS'],['2ds',16,-8,'#51e7a3','ENCONTRO 2DS'],['3ds',-16,8,'#b58cff','ENCONTRO 3DS'],['sub',16,8,'#ffae63','ENCONTRO SUB']];
  const meetPads=[];for(const [key,x,z,accent,label] of meetupDefs){const pad=meetPad(x,z,accent,label);exteriorRoot.add(pad);meetPads.push(pad);worldObjects.push({id:`meet-${key}`,type:'meet',label,name:label,x,z,radius:2.2});}
  const npcDefs=[{id:'monitor-central',x:-4.8,z:4.8,name:'Recepção AGV',message:'Bem-vindo ao Campus DS. Use a sinalização da praça para acessar os laboratórios e acompanhar as áreas disponíveis.',accent:'#ffd166'},{id:'monitor-labs',x:5.2,z:5.1,name:'Apoio dos Laboratórios',message:'Os acessos aos laboratórios refletem as liberações reais da turma. Atividades continuam sob controle do professor.',accent:'#72e6ff'}];
  const npcs=[];for(const n of npcDefs){const av=avatarSystem.createAvatar({accent:n.accent,staff:true,label:n.name,seed:n.id});av.position.set(n.x,0,n.z);av.scale.setScalar(.96);exteriorRoot.add(av);const ref={...n,type:'npc',radius:2.4};npcs.push({avatar:av,def:n,worldRef:ref});worldObjects.push(ref);}
  // v14.10.8.71: Central de Segurança — câmeras públicas do Campus e matriz de visualização.
  function campusSecurityCameraRig(def){
    const g=new THREE.Group(),metal=makeMaterial(0x263943,{metalness:.78,roughness:.24}),dark=makeMaterial(0x071117,{metalness:.42,roughness:.34}),lens=makeMaterial(0x5ce1ff,{emissive:0x5ce1ff,emissiveIntensity:1.4,roughness:.12});
    const h=Math.max(4.2,Math.min(12,Number(def.position?.y)||7));g.position.set(def.position.x,0,def.position.z);g.add(cylinder(.065,h,metal,0,h/2,0,12));
    const head=new THREE.Group();head.position.set(0,h,0);head.add(box(.82,.42,.58,dark,0,0,0),cylinder(.16,.22,lens,0,0,.35,16));head.children[1].rotation.x=Math.PI/2;
    const dx=def.target.x-def.position.x,dz=def.target.z-def.position.z;head.rotation.y=Math.atan2(dx,dz);g.add(head);
    const label=spriteLabel(def.label,'#5ce1ff',2.65,{bg:'rgba(3,13,18,.86)'});label.position.set(0,h+.85,0);label.userData.labelCullDistance=18;g.add(label);return g;
  }
  const securityCameraRigs=CAMPUS_SECURITY_CAMERAS.map(def=>{const rig=campusSecurityCameraRig(def);exteriorRoot.add(rig);return{def,rig};});
  const securityVirtualCameras=new Map(CAMPUS_SECURITY_CAMERAS.map(def=>{const cam=new THREE.PerspectiveCamera(def.baseFov||52,1,.1,260);cam.position.set(def.position.x,def.position.y,def.position.z);cam.lookAt(def.target.x,def.target.y,def.target.z);cam.updateProjectionMatrix();return[def.id,cam];}));
  // v14.10.8.73: Mirantes e binóculos — observação panorâmica local com câmera reutilizável.
  function campusViewpointStructure(def){
    const g=new THREE.Group(),metal=makeMaterial(0x263943,{metalness:.76,roughness:.28}),deck=makeMaterial(0x172932,{metalness:.32,roughness:.66}),accentColor=new THREE.Color(def.accent||'#72e6ff').getHex(),glow=makeMaterial(accentColor,{emissive:accentColor,emissiveIntensity:1.15,roughness:.2}),glass=makeMaterial(0x173b48,{emissive:accentColor,emissiveIntensity:.12,transparent:true,opacity:.42,roughness:.18});
    const h=Math.max(9,Number(def.camera?.y)||12),x=Number(def.camera?.x)||0,z=Number(def.camera?.z)||0;g.position.set(x,0,z);
    if(def.id!=='viewpoint-west'){
      for(const lx of[-1.35,1.35])for(const lz of[-1.15,1.15]){const leg=cylinder(.09,h-1.1,metal,lx,(h-1.1)/2,lz,10);g.add(leg);}
      g.add(box(3.5,.22,3.0,deck,0,h-1.05,0),box(3.7,.08,3.2,glow,0,h-.9,0));
      for(const side of[-1,1]){g.add(box(3.5,.055,.055,glow,0,h-.18,side*1.42),box(.055,.7,3.0,metal,side*1.67,h-.48,0));}
      for(const sx of[-1.55,1.55])for(const sz of[-1.3,1.3])g.add(cylinder(.035,.72,metal,sx,h-.48,sz,8));
      const lift=box(1.15,2.2,1.15,glass,0,1.15,0);g.add(lift);
    }
    const scope=new THREE.Group();scope.position.set(.72,h-.55,.35);const barrel=cylinder(.18,1.15,metal,0,.38,0,18);barrel.rotation.x=Math.PI/2;scope.add(barrel);const lens=cylinder(.145,.12,glow,0,.38,.58,18);lens.rotation.x=Math.PI/2;scope.add(lens);scope.add(cylinder(.06,.95,metal,0,-.18,0,10));scope.rotation.y=Math.atan2((def.defaultTarget?.x||0)-x,(def.defaultTarget?.z||0)-z);g.add(scope);
    const label=spriteLabel(def.label||def.name,def.accent||'#72e6ff',3.0,{bg:'rgba(3,13,18,.86)'});label.position.set(0,h+.65,0);label.userData.labelCullDistance=28;g.add(label);setShadow(g,quality!=='low');return g;
  }
  const campusViewpointMeshes=CAMPUS_VIEWPOINTS.map(def=>{const mesh=campusViewpointStructure(def);exteriorRoot.add(mesh);cameraCollisionRoots.push(mesh);const ref={...def,type:'campus-viewpoint',name:def.name,x:def.entry.x,z:def.entry.z,radius:2.8};worldObjects.push(ref);return{def,mesh,ref};});
  const viewpointCamera=new THREE.PerspectiveCamera(58,1,.1,300),viewpointState={active:false,selectedId:CAMPUS_VIEWPOINT_DEFAULT,zoom:1,focusId:null};
  const viewpointSnapshot=()=>{const def=CAMPUS_VIEWPOINT_MAP[viewpointState.selectedId]||CAMPUS_VIEWPOINT_MAP[CAMPUS_VIEWPOINT_DEFAULT];return{active:viewpointState.active,selectedId:def?.id||CAMPUS_VIEWPOINT_DEFAULT,name:def?.name||'Mirante AGV',district:def?.district||'Campus',description:def?.description||'',zoom:viewpointState.zoom,maxZoom:def?.maxZoom||6,focusId:viewpointState.focusId,landmarks:viewpointLandmarks(def).map(({id,name,icon,category,description})=>({id,name,icon,category,description}))};};
  function configureViewpointCamera(aspect=1){const def=CAMPUS_VIEWPOINT_MAP[viewpointState.selectedId]||CAMPUS_VIEWPOINT_MAP[CAMPUS_VIEWPOINT_DEFAULT];if(!def)return null;const landmark=CAMPUS_VIEWPOINT_LANDMARK_MAP[viewpointState.focusId],target=landmark?.target||def.defaultTarget;viewpointCamera.aspect=Math.max(.2,Number(aspect)||1);viewpointCamera.fov=viewpointZoomFov(def,viewpointState.zoom);viewpointCamera.position.set(def.camera.x,def.camera.y,def.camera.z);viewpointCamera.lookAt(target.x,target.y,target.z);viewpointCamera.updateProjectionMatrix();return viewpointCamera;}
  function openViewpoint(id,options={}){if(activeInterior||activeToolInterior||activeCampusVehicle||rides.isActive()||train.isTraveling())return false;const def=CAMPUS_VIEWPOINT_MAP[id]||CAMPUS_VIEWPOINT_MAP[CAMPUS_VIEWPOINT_DEFAULT];if(!def)return false;closeSecurityCameras();viewpointState.active=true;viewpointState.selectedId=def.id;viewpointState.zoom=Math.max(1,Math.min(def.maxZoom||6,Number(options.zoom)||1));viewpointState.focusId=CAMPUS_VIEWPOINT_LANDMARK_MAP[options.focusId]&&def.focusIds.includes(options.focusId)?options.focusId:null;return viewpointSnapshot();}
  function setViewpointZoom(zoom){const def=CAMPUS_VIEWPOINT_MAP[viewpointState.selectedId]||CAMPUS_VIEWPOINT_MAP[CAMPUS_VIEWPOINT_DEFAULT];viewpointState.zoom=Math.max(1,Math.min(def?.maxZoom||6,Number(zoom)||1));return viewpointSnapshot();}
  function setViewpointFocus(id){const def=CAMPUS_VIEWPOINT_MAP[viewpointState.selectedId];if(id&&(!CAMPUS_VIEWPOINT_LANDMARK_MAP[id]||!def?.focusIds?.includes(id)))return false;viewpointState.focusId=id||null;return viewpointSnapshot();}
  function closeViewpoint(){const was=viewpointState.active;viewpointState.active=false;return was;}
  function renderViewpoint(){if(!viewpointState.active)return false;const prev={exterior:exteriorRoot.visible,interior:interiorRoot.visible,sky:sky.visible,sun:sunVisual.visible,moon:moonVisual.visible,self:self.visible};exteriorRoot.visible=true;interiorRoot.visible=false;sky.visible=true;sunVisual.visible=true;moonVisual.visible=true;self.visible=false;const size=renderer.getSize(new THREE.Vector2()),cam=configureViewpointCamera(Math.max(1,size.x)/Math.max(1,size.y));renderer.setScissorTest(false);renderer.setViewport(0,0,Math.max(1,size.x),Math.max(1,size.y));if(cam)renderer.render(scene,cam);exteriorRoot.visible=prev.exterior;interiorRoot.visible=prev.interior;sky.visible=prev.sky;sunVisual.visible=prev.sun;moonVisual.visible=prev.moon;self.visible=prev.self;return true;}
  const securityViewState={active:false,layout:'single',selectedId:CAMPUS_SECURITY_DEFAULT_CAMERA,zoom:1};
  const securityCameraSnapshot=()=>({active:securityViewState.active,layout:securityViewState.layout,selectedId:securityViewState.selectedId,zoom:securityViewState.zoom,gridIds:[...CAMPUS_SECURITY_GRID_IDS],cameras:CAMPUS_SECURITY_CAMERAS.map(({id,label,zone,description})=>({id,label,zone,description}))});
  function configureSecurityCamera(id,aspect=1){const def=CAMPUS_SECURITY_CAMERA_MAP[id]||CAMPUS_SECURITY_CAMERA_MAP[CAMPUS_SECURITY_DEFAULT_CAMERA],cam=securityVirtualCameras.get(def.id);if(!cam)return null;cam.aspect=Math.max(.2,Number(aspect)||1);cam.fov=securityCameraZoomFov(def,securityViewState.zoom);cam.position.set(def.position.x,def.position.y,def.position.z);cam.lookAt(def.target.x,def.target.y,def.target.z);cam.updateProjectionMatrix();return cam;}
  function openSecurityCameras(options={}){if(activeToolInterior!=='security-center'||activeToolFloor!==0)return false;securityViewState.active=true;securityViewState.layout=options.layout==='grid'?'grid':'single';if(CAMPUS_SECURITY_CAMERA_MAP[options.cameraId])securityViewState.selectedId=options.cameraId;securityViewState.zoom=Math.max(1,Math.min(4,Number(options.zoom)||securityViewState.zoom||1));return securityCameraSnapshot();}
  function setSecurityCamera(id){if(!CAMPUS_SECURITY_CAMERA_MAP[id])return false;securityViewState.selectedId=id;securityViewState.layout='single';return securityCameraSnapshot();}
  function setSecurityCameraLayout(layout){securityViewState.layout=layout==='grid'?'grid':'single';return securityCameraSnapshot();}
  function setSecurityCameraZoom(zoom){securityViewState.zoom=Math.max(1,Math.min(4,Number(zoom)||1));return securityCameraSnapshot();}
  function closeSecurityCameras(){const was=securityViewState.active;securityViewState.active=false;renderer.setScissorTest(false);return was;}
  function renderSecurityCameras(){
    if(!securityViewState.active)return false;
    const prev={exterior:exteriorRoot.visible,interior:interiorRoot.visible,sky:sky.visible,sun:sunVisual.visible,moon:moonVisual.visible,self:self.visible};
    exteriorRoot.visible=true;interiorRoot.visible=false;sky.visible=true;sunVisual.visible=true;moonVisual.visible=true;self.visible=false;
    securityCameraRigs.forEach(({rig})=>{rig.visible=false;});
    const size=renderer.getSize(new THREE.Vector2()),width=Math.max(1,size.x),height=Math.max(1,size.y);
    if(securityViewState.layout==='grid'){
      const vw=Math.max(1,Math.floor(width/2)),vh=Math.max(1,Math.floor(height/2));renderer.setScissorTest(true);
      CAMPUS_SECURITY_GRID_IDS.forEach((id,index)=>{const col=index%2,row=index<2?1:0,x=col*vw,y=row*vh,cam=configureSecurityCamera(id,vw/vh);renderer.setViewport(x,y,vw,vh);renderer.setScissor(x,y,vw,vh);if(cam)renderer.render(scene,cam);});
      renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);
    }else{
      renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);const cam=configureSecurityCamera(securityViewState.selectedId,width/height);if(cam)renderer.render(scene,cam);
    }
    securityCameraRigs.forEach(({rig})=>{rig.visible=true;});exteriorRoot.visible=prev.exterior;interiorRoot.visible=prev.interior;sky.visible=prev.sky;sunVisual.visible=prev.sun;moonVisual.visible=prev.moon;self.visible=prev.self;return true;
  }
  // v14.10.8.71: tráfego inteligente, semáforos, veículos utilizáveis e segurança dinâmica.
  function campusTrafficSignal(def){
    const g=new THREE.Group(),pole=makeMaterial(0x26343b,{metalness:.62,roughness:.32}),housing=makeMaterial(0x081015,{metalness:.36,roughness:.38});
    const offset=def.axis==='z'?{x:3.7,z:0}:{x:0,z:3.7};g.position.set(def.x+offset.x,0,def.z+offset.z);
    g.add(cylinder(.07,2.9,pole,0,1.45,0,12),box(.48,1.32,.38,housing,0,2.45,0));
    const makeLamp=(color,y)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.13,14,10),makeMaterial(color,{emissive:color,emissiveIntensity:.12,roughness:.22}));m.position.set(0,y,.22);g.add(m);return m;};
    const lamps={red:makeLamp(0xff4d5a,2.82),amber:makeLamp(0xffbd4a,2.45),green:makeLamp(0x54e68b,2.08)};
    const sign=spriteLabel('SEMÁFORO','#d9f5ff',2.05,{bg:'rgba(3,11,16,.82)'});sign.position.set(0,3.48,0);sign.userData.labelCullDistance=18;g.add(sign);return{def,root:g,lamps,lastState:''};
  }
  const trafficSignals=CAMPUS_TRAFFIC_SIGNALS.map(def=>{const entry=campusTrafficSignal(def);exteriorRoot.add(entry.root);return entry;});
  const trafficVehicles=CAMPUS_TRAFFIC_FLEET.map(def=>{const mesh=campusMobilityVehicle(def);exteriorRoot.add(mesh);const pos=sampleCampusRoute(def.routeId,def.offset);mesh.position.set(pos.x,.02,pos.z);mesh.rotation.y=pos.heading;return{def,mesh,progress:def.offset,blocked:false};});
  const drivableVehicleRefs=[];for(const def of CAMPUS_DRIVABLE_VEHICLES){const ref={...def,type:'campus-vehicle',radius:2.8};drivableVehicleRefs.push(ref);worldObjects.push(ref);}
  const spawnedVehicleRefs=new Map(),spawnedVehicleMeshes=new Map();
  function spawnCampusVehicle(def={}){
    const id=String(def.id||'');if(!id)return null;let ref=spawnedVehicleRefs.get(id),mesh=spawnedVehicleMeshes.get(id);
    const normalized={...def,id,name:def.name||'Veículo AGV',kind:['car','bike','van','bus'].includes(def.kind)?def.kind:'car',accent:def.accent||'#55d9ff',x:clamp(Number(def.x)||0,-WORLD_X+1,WORLD_X-1),z:clamp(Number(def.z)||0,-WORLD_Z+1,WORLD_Z-1),heading:Number(def.heading)||0,seatCapacity:Math.max(1,Math.min(8,Number(def.seatCapacity||def.seat_capacity)||2)),routeId:def.routeId||'central-loop',startT:Number(def.startT)||0,durationMs:Number(def.durationMs)||20000,spawned:true,type:'campus-vehicle',radius:2.8,description:def.description||'Veículo criado pela equipe neste ponto do Campus.'};
    if(ref){Object.assign(ref,normalized);if(mesh){mesh.position.set(ref.x,.02,ref.z);mesh.rotation.y=ref.heading;}return ref;}
    ref=normalized;mesh=campusMobilityVehicle(ref,{interactive:true});mesh.position.set(ref.x,.02,ref.z);mesh.rotation.y=ref.heading;exteriorRoot.add(mesh);spawnedVehicleRefs.set(id,ref);spawnedVehicleMeshes.set(id,mesh);drivableVehicleRefs.push(ref);worldObjects.push(ref);return ref;
  }
  const aerialHelipads=CAMPUS_HELIPADS.map(def=>{const mesh=campusHelipad(def);exteriorRoot.add(mesh);const ref={...def,type:'campus-helipad',radius:(def.radius||2.8)+.65};worldObjects.push(ref);return{def,mesh,ref};});
  const aerialVehicleMeshes=new Map(),aerialVehicleRefs=[];for(const def of CAMPUS_AERIAL_VEHICLES){const mesh=campusMobilityVehicle(def,{interactive:true});mesh.position.set(def.x,Number(def.y)||.5,def.z);mesh.rotation.y=Number(def.heading)||0;exteriorRoot.add(mesh);aerialVehicleMeshes.set(def.id,mesh);const ref={...def,type:'campus-aerial-vehicle',radius:3.25};aerialVehicleRefs.push(ref);worldObjects.push(ref);}
  const cityNpcPatrols=[];for(const def of CAMPUS_NPC_PATROLS.slice(0,quality==='low'?3:CAMPUS_NPC_PATROLS.length)){const avatar=avatarSystem.createAvatar({accent:def.accent,staff:true,label:def.name,seed:def.id});avatar.scale.setScalar(.88);exteriorRoot.add(avatar);const worldRef={...def,type:'city-npc',x:0,z:0,radius:2.5};cityNpcPatrols.push({def,avatar,worldRef});worldObjects.push(worldRef);}
  const dynamicCitySigns=CAMPUS_DYNAMIC_SIGNS.map(def=>{const sprite=spriteLabel(def.messages?.[0]||def.id,def.accent,3.6,{bg:'rgba(3,13,18,.9)'});sprite.position.set(def.x,2.8,def.z);exteriorRoot.add(sprite);const ref={...def,type:'dynamic-sign',name:'Painel urbano AGV',radius:2.2};worldObjects.push(ref);return{def,sprite,lastText:''};});
  let currentCityEvent=resolveCampusCityEvent(new Date()),eventPlaza=CAMPUS_THEME_PLAZAS.find(item=>item.id===currentCityEvent.plazaId),cityEventRef={...currentCityEvent,type:'city-event',x:eventPlaza?.x||0,z:eventPlaza?.z||0,radius:3.2};worldObjects.push(cityEventRef);
  const cityEventMarker=new THREE.Group(),eventRing=new THREE.Mesh(new THREE.RingGeometry(2.0,2.28,42),new THREE.MeshBasicMaterial({color:new THREE.Color(currentCityEvent.accent).getHex(),transparent:true,opacity:.48,side:THREE.DoubleSide}));eventRing.rotation.x=-Math.PI/2;eventRing.position.y=.04;cityEventMarker.add(eventRing);const eventLabel=spriteLabel(`${currentCityEvent.icon} ${currentCityEvent.name.toUpperCase()}`,currentCityEvent.accent,4.2,{bg:'rgba(3,15,18,.88)'});eventLabel.position.y=2.4;cityEventMarker.add(eventLabel);cityEventMarker.position.set(cityEventRef.x,0,cityEventRef.z);exteriorRoot.add(cityEventMarker);
  const playerVehicleShell=campusMobilityVehicle({kind:'car',accent:'#55d9ff'});playerVehicleShell.visible=false;exteriorRoot.add(playerVehicleShell);
  const remoteVehicles=new Map();let vehicleNetworkState={sessions:[],passengers:[],currentUserId:null},networkPassengerState=null,lastVehicleTelemetrySent=0;
  const vehicleDefById=id=>CAMPUS_DRIVABLE_VEHICLES.find(item=>item.id===id)||CAMPUS_AERIAL_VEHICLES.find(item=>item.id===id)||spawnedVehicleRefs.get(id)||null;
  function vehicleSeatOffset(kind,seatIndex=0){
    const i=Math.max(0,Number(seatIndex)||0);if(kind==='bike')return{x:0,z:0};if(kind==='car')return i===0?{x:-.23,z:.08}:{x:.23,z:.08};if(kind==='van'){const seats=[[-.25,.42],[.25,.42],[-.25,-.34],[.25,-.34]];const q=seats[Math.min(i,seats.length-1)];return{x:q[0],z:q[1]};}const row=Math.floor(i/2),side=i%2===0?-.28:.28;return{x:side,z:.92-row*.38};
  }
  function occupantPlacement(session,seatIndex=0){
    if(!session)return null;let x=Number(session.x)||0,z=Number(session.z)||0,heading=Number(session.heading)||0;
    if(session.driver_id===state.user?.id&&activeCampusVehicle?.seatMode==='driver'){x=self.position.x;z=self.position.z;heading=vehicleHeading;}else{const entry=remoteVehicles.get(session.driver_id);if(entry){x=entry.mesh.position.x;z=entry.mesh.position.z;heading=entry.mesh.rotation.y;}}
    const off=vehicleSeatOffset(session.vehicle_kind,seatIndex),c=Math.cos(heading),si=Math.sin(heading);return{x:x+c*off.x+si*off.z,z:z-si*off.x+c*off.z,heading};
  }
  function occupantForUser(userId){const session=(vehicleNetworkState.sessions||[]).find(row=>row.driver_id===userId);if(session)return{session,seatIndex:0};const passenger=(vehicleNetworkState.passengers||[]).find(row=>row.passenger_id===userId);if(!passenger)return null;const parent=(vehicleNetworkState.sessions||[]).find(row=>row.driver_id===passenger.driver_id);return parent?{session:parent,seatIndex:Number(passenger.seat_index)||1}:null;}
  function syncRemoteVehicleMeshes(){
    const currentUserId=vehicleNetworkState.currentUserId||state.user?.id||null,seen=new Set();
    for(const session of vehicleNetworkState.sessions||[]){if(!session?.driver_id||session.driver_id===currentUserId)continue;seen.add(session.driver_id);let entry=remoteVehicles.get(session.driver_id);if(!entry){const def=vehicleDefById(session.vehicle_id)||{kind:session.vehicle_kind,accent:'#55d9ff'},mesh=campusMobilityVehicle(def);mesh.position.set(Number(session.x)||0,.02,Number(session.z)||0);mesh.rotation.y=Number(session.heading)||0;exteriorRoot.add(mesh);entry={mesh,target:new THREE.Vector3(mesh.position.x,.02,mesh.position.z),targetHeading:mesh.rotation.y,session};remoteVehicles.set(session.driver_id,entry);}entry.session=session;entry.target.set(Number(session.x)||0,.02,Number(session.z)||0);entry.targetHeading=Number(session.heading)||0;}
    for(const[driverId,entry]of remoteVehicles)if(!seen.has(driverId)){exteriorRoot.remove(entry.mesh);disposeObject(entry.mesh);remoteVehicles.delete(driverId);}for(const[id,mesh]of spawnedVehicleMeshes){const occupied=(vehicleNetworkState.sessions||[]).some(row=>row.vehicle_id===id)||activeCampusVehicle?.id===id;mesh.visible=!occupied;}
  }
  function setVehicleNetwork(network={}){vehicleNetworkState={sessions:Array.isArray(network.sessions)?network.sessions:[],passengers:Array.isArray(network.passengers)?network.passengers:[],currentUserId:network.currentUserId||state.user?.id||null};syncRemoteVehicleMeshes();return true;}
  function attachNetworkPassenger({session,seatIndex=1}={}){if(!session?.driver_id)return false;rides.cancel({silent:true});train.cancel();networkPassengerState={driverId:session.driver_id,seatIndex:Number(seatIndex)||1};activeCampusVehicle={id:session.vehicle_id,name:session.vehicle_name,kind:session.vehicle_kind,seatMode:'network-passenger',speedPreset:'network',speedLabel:'Online',driverId:session.driver_id,seatIndex:networkPassengerState.seatIndex};self.userData.localAction='sit';playerVehicleShell.visible=false;const pos=occupantPlacement(session,networkPassengerState.seatIndex);if(pos){self.position.set(pos.x,0,pos.z);self.rotation.y=pos.heading;cameraController.setYaw(pos.heading+Math.PI);}return true;}
  function detachNetworkPassenger(){if(activeCampusVehicle?.seatMode!=='network-passenger')return false;const session=(vehicleNetworkState.sessions||[]).find(row=>row.driver_id===activeCampusVehicle.driverId),pos=session?occupantPlacement(session,activeCampusVehicle.seatIndex):null;if(pos){const side=1.7;self.position.set(clamp(pos.x+Math.cos(pos.heading)*side,-WORLD_X+1,WORLD_X-1),0,clamp(pos.z-Math.sin(pos.heading)*side,-WORLD_Z+1,WORLD_Z-1));}activeCampusVehicle=null;networkPassengerState=null;self.userData.localAction=null;vehicleSpeed=0;playerVehicleShell.visible=false;return true;}
  const liveSign=spriteLabel('PRAÇA CENTRAL • CAMPUS DS','#72e6ff',5.4,{bg:'rgba(2,13,20,.82)'});liveSign.position.set(0,7.15,-.4);exteriorRoot.add(liveSign);let lastSignMinute=-1,lastActivityStatus='';
  // Ambiência contida: sem drones/ornamentos flutuantes genéricos.
  const ambientCount=quality==='ultra'?90:quality==='high'?52:quality==='medium'?24:0;
  const particlesGeo=new THREE.BufferGeometry(),positions=[];for(let i=0;i<ambientCount;i++)positions.push((Math.random()-.5)*78,.45+Math.random()*7.5,(Math.random()-.5)*49);
  particlesGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const motes=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xbadce7,size:.026,transparent:true,opacity:.14,depthWrite:false}));
  if(ambientCount)exteriorRoot.add(motes);
  const makeAvatar=(opts)=>avatarSystem.createAvatar(opts);
  // P5.6: personagens autônomos e pequenos grupos locais. Não gravam nada no backend.
  const patrolDefs=[
    {id:'patrol-1ds',label:'Aluno 1DS',accent:'#36d2ff',route:[[-7,-10],[-13,-8],[-10,-3],[-5,-4]]},
    {id:'patrol-2ds',label:'Aluno 2DS',accent:'#51e7a3',route:[[7,-10],[13,-8],[10,-3],[5,-4]]},
    {id:'patrol-3ds',label:'Aluno 3DS',accent:'#b58cff',route:[[-7,10],[-13,8],[-10,3],[-5,4]]},
    {id:'patrol-sub',label:'Aluno SUB',accent:'#ffae63',route:[[7,10],[13,8],[10,3],[5,4]]}
  ];
  const patrols=[];for(const d of patrolDefs.slice(0,quality==='low'?2:4)){const avatar=makeAvatar({accent:d.accent,staff:false,label:d.label,seed:d.id});avatar.scale.setScalar(.9);const [x,z]=d.route[0];avatar.position.set(x,0,z);exteriorRoot.add(avatar);patrols.push({avatar,def:d,index:1,speed:1.05+(hashSeed(d.id)%35)/100});}
  const socialGroups=[];if(quality!=='low'){const groupDefs=[[-16,-8,'#36d2ff','1DS'],[16,-8,'#51e7a3','2DS'],[-16,8,'#b58cff','3DS'],[16,8,'#ffae63','SUB']];for(const [gx,gz,accent,label] of groupDefs){const count=quality==='ultra'?2:1;for(let i=0;i<count;i++){const avatar=makeAvatar({accent,staff:false,label:`${label} • encontro`,seed:`group-${label}-${i}`});avatar.scale.setScalar(.86);avatar.position.set(gx+(i?1.0:-.8),0,gz+(i?.65:-.55));avatar.rotation.y=i?-.7:.7;exteriorRoot.add(avatar);socialGroups.push({avatar,phase:i+gx*.1+gz*.07});}}}
  const colliders=[...EXTERIOR_BUILDING_COLLIDERS,...CAMPUS_TOOL_BUILDING_COLLIDERS];
  let activeInterior=null,activeToolInterior=null,activeToolFloor=0,lastExteriorPosition=null,activeCampusVehicle=null,vehicleRideStartedAt=0,vehicleSpeed=0,vehicleHeading=0,vehicleBrakeHeld=false,vehicleAltitude=0,vehicleVerticalSpeed=0,vehicleClimbHeld=false,vehicleDescendHeld=false,vehiclePreviousCamera='explore',lastCitySignMinute=-1,lastSafeVehiclePose=null,lastSafeVehicleAt=0,vehicleRecoveryUntil=0,lastVehicleCollisionNotice=0,vehicleTrafficState={limitKmh:40,zoneName:'Campus',signalState:'green',signalLabel:'Livre'};
  const canStand=(x,z)=>{
    if(activeInterior){const o=interiorOrigins[activeInterior];return x>o[0]-9.1&&x<o[0]+9.1&&z>o[2]-5.95&&z<o[2]+5.95;}
    if(activeToolInterior){const b=CAMPUS_INTERIOR_MAP[activeToolInterior]?.bounds;return !!b&&x>b.minX&&x<b.maxX&&z>b.minZ&&z<b.maxZ;}
    if(x<-WORLD_X+1||x>WORLD_X-1||z<-WORLD_Z+1||z>WORLD_Z-1)return false;
    const surface=campusSurfaceAt(x,z,.03),insideBuilding=colliders.some(c=>x>c.minX-.62&&x<c.maxX+.62&&z>c.minZ-.62&&z<c.maxZ+.62);
    if(insideBuilding&&!(['roof','bridge','step','ramp'].includes(surface?.type)&&playerY>=surface.h-.85))return false;
    if(surface&&surface.h>playerY+.72)return false;
    return true;
  };
  function vehicleCollisionRadius(kind){return kind==='bus'?1.55:kind==='van'?1.3:kind==='bike'?.62:1.02;}
  function canVehicleStand(x,z,kind='car'){
    const radius=vehicleCollisionRadius(kind);
    if(x<-WORLD_X+radius||x>WORLD_X-radius||z<-WORLD_Z+radius||z>WORLD_Z-radius)return false;
    return !colliders.some(c=>x>c.minX-radius&&x<c.maxX+radius&&z>c.minZ-radius&&z<c.maxZ+radius);
  }
  function aerialCollisionRadius(kind){return kind==='helicopter'?2.35:1.35;}
  function aerialClearanceAt(x,z,kind='drone'){
    const radius=aerialCollisionRadius(kind),blocked=colliders.some(c=>x>c.minX-radius&&x<c.maxX+radius&&z>c.minZ-radius&&z<c.maxZ+radius);
    return blocked?(kind==='helicopter'?11.5:10.5):0;
  }
  function canAerialOccupy(x,z,altitude,kind='drone'){
    const radius=aerialCollisionRadius(kind);
    if(x<-WORLD_X+radius||x>WORLD_X-radius||z<-WORLD_Z+radius||z>WORLD_Z-radius)return false;
    return Number(altitude)>=aerialClearanceAt(x,z,kind)-.08;
  }
  function trafficSignalAhead(x,z,heading,nowMs=Date.now()){
    let best=null;for(const signal of CAMPUS_TRAFFIC_SIGNALS){const dx=signal.x-x,dz=signal.z-z,forward=Math.sin(heading)*dx+Math.cos(heading)*dz,lateral=Math.abs(Math.cos(heading)*dx-Math.sin(heading)*dz),radius=Number(signal.stopRadius)||4.5;if(forward<.15||forward>radius+2.2||lateral>2.7)continue;const phase=resolveTrafficSignalState(signal,nowMs);if(!best||forward<best.distance)best={signal,...phase,distance:forward,lateral};}return best;
  }
  function dynamicVehicleHit(x,z,kind='car',{excludeTraffic=null,includePlayer=true}={}){
    const radius=vehicleCollisionRadius(kind);
    for(const entry of trafficVehicles){if(entry===excludeTraffic)continue;const otherRadius=vehicleCollisionRadius(entry.def.kind);if(Math.hypot(x-entry.mesh.position.x,z-entry.mesh.position.z)<radius+otherRadius+.3)return{type:'traffic',label:entry.def.label||'veículo do Campus',entry};}
    for(const entry of remoteVehicles.values()){const otherRadius=vehicleCollisionRadius(entry.session?.vehicle_kind||'car');if(Math.hypot(x-entry.mesh.position.x,z-entry.mesh.position.z)<radius+otherRadius+.38)return{type:'remote',label:entry.session?.vehicle_name||'veículo multiplayer',entry};}
    if(includePlayer&&activeCampusVehicle?.seatMode==='driver'&&Math.hypot(x-self.position.x,z-self.position.z)<radius+vehicleCollisionRadius(activeCampusVehicle.kind)+.32)return{type:'player',label:activeCampusVehicle.name||'veículo do motorista'};
    return null;
  }
  function rememberSafeVehiclePose(nowMs){if(!activeCampusVehicle||activeCampusVehicle.seatMode!=='driver'||nowMs-lastSafeVehicleAt<700)return;const hit=dynamicVehicleHit(self.position.x,self.position.z,activeCampusVehicle.kind,{includePlayer:false});if(hit||!canVehicleStand(self.position.x,self.position.z,activeCampusVehicle.kind))return;lastSafeVehiclePose={x:self.position.x,z:self.position.z,heading:vehicleHeading};lastSafeVehicleAt=nowMs;}
  function recoverVehicleFromCollision(hit,nowMs){
    vehicleSpeed=0;if(nowMs<vehicleRecoveryUntil)return;vehicleRecoveryUntil=nowMs+950;const pose=lastSafeVehiclePose;if(pose){self.position.set(pose.x,0,pose.z);vehicleHeading=pose.heading;self.rotation.y=pose.heading;playerVehicleShell.position.set(pose.x,.02,pose.z);playerVehicleShell.rotation.y=pose.heading;}if(nowMs-lastVehicleCollisionNotice>1200){lastVehicleCollisionNotice=nowMs;onChallengeEvent?.({type:'vehicle-collision',message:`⚠️ Colisão com ${hit?.label||'obstáculo'} • veículo reposicionado em segurança.`});}
  }
  const areaAt=(x,z)=>{if(activeInterior)return activeInterior;if(activeToolInterior){const e=CAMPUS_INTERIOR_MAP[activeToolInterior]?.entrance;return e?areaAtWorld(e.x,e.z):'central';}return areaAtWorld(x,z);};
  const accentForSelf=()=>state.avatarStyle?.accentCss||(state.currentClass?(zones.find(z=>z.code===state.currentClass.code)?.accent||'#36d2ff'):'#ffd166');const selfLabel=(state.profile?.role==='teacher'?'Prof. ':state.profile?.role==='student'?'':'ADM ')+(state.profile?.full_name||'Usuário').split(' ')[0];const self=makeAvatar({accent:accentForSelf(),staff:isStaff(),label:selfLabel,seed:state.user?.id||selfLabel,appearanceOverride:state.avatarStyle||null});scene.add(self);const selfWorld=presenceToWorld(state.player.x,state.player.y);if(Math.hypot(selfWorld.x,selfWorld.z)<5.4){selfWorld.x=0;selfWorld.z=-8.2;}self.position.set(selfWorld.x,0,selfWorld.z);
  const airdropParachute=airdropParachuteRig();self.add(airdropParachute);let airdropSession=null,airdropMode='ground',airdropAltitude=0,airdropDetail='full',airdropHeading=0;
  const teleportDestinations=[
    {id:'central',name:'Praça Central',x:0,z:0,kind:'landmark'},
    {id:'vale-portal',name:'Portal do Vale do Silício AGV',x:0,z:-12.5,kind:'portal'},
    {id:'1ds',name:'1DS — Laboratório',x:-22.5,z:-10.2,kind:'laboratory'},
    {id:'2ds',name:'2DS — Laboratório',x:22.5,z:-10.2,kind:'laboratory'},
    {id:'3ds',name:'3DS — Laboratório',x:-22.5,z:10.2,kind:'laboratory'},
    {id:'sub',name:'SUB — Laboratório',x:22.5,z:10.2,kind:'laboratory'},
    ...CAMPUS_CITY_LANDMARKS,
    ...CAMPUS_EXPERIENCES.filter(item=>item.type!=='vale-portal').map(item=>({id:item.id,name:item.name,x:item.entrance?.x??item.x,z:item.entrance?.z??item.z,kind:item.type}))
  ];

  // F89: o desafio de parkour foi removido fisicamente do Campus e vive apenas em campus-neon.
  const cameraController=createCameraController({THREE,camera,canvas,getCollisionRoots:()=>activeInterior||activeToolInterior?activeInteriorCollisionRoots:cameraCollisionRoots,initialYaw:Math.PI,initialPitch:.32,initialDistance:6.8,initialFov:Number(state.graphics?.fov)||null,initialSensitivity:Number(state.graphics?.mouseSensitivity)||1});
  let ridePreviousCamera='explore';
  const rides=createRideManager({reducedMotion:profile.reducedMotion,onEvent:event=>{if(event.type==='experience-start'){ridePreviousCamera=cameraController.getMode();cameraController.setMode(event.camera||'wide');}else if(event.type==='experience-complete'||event.type==='experience-cancel'){cameraController.setMode(ridePreviousCamera||'explore');}onChallengeEvent?.(event);}});
  const train=createTrainManager({reducedMotion:profile.reducedMotion,onEvent:event=>{if(event.type==='train-start'){environment.transit?.ensureActive?.();ridePreviousCamera=cameraController.getMode();cameraController.setMode('wide');}else if(event.type==='train-complete'||event.type==='train-cancel'){cameraController.setMode(ridePreviousCamera||'explore');setTimeout(()=>environment.transit?.releaseActive?.(),event.type==='train-complete'?850:0);}onChallengeEvent?.(event);}});
  for(const station of CAMPUS_TRAIN_STATIONS)worldObjects.push({id:`train-${station.id}`,type:'train-station',name:`Estação ${station.name}`,stationId:station.id,x:station.x,z:station.z,radius:2.4});
  function startExperience(id){if(activeInterior||activeToolInterior||!CAMPUS_EXPERIENCES.some(item=>item.id===id&&item.id!=='parkour'))return false;seated=null;presentation=null;activeStation=null;localAction=null;self.userData.localAction=null;const rideId=id==='tower'&&playerY>8?'tower-down':id;return rides.start(rideId);}
  let playerY=0,vertical=0,onGround=true,runHeld=false,localAction=null,seated=null,presentation=null,activeStation=null,contextualState=null,contextualTransition=null,fps=60,fpsCap=Number(state.graphics?.fpsCap)||60,worldTimeMode=state.graphics?.worldTimeMode||'cycle',lastRenderGate=0;const others=new Map(),keys=new Set(),moveJoy={x:0,y:0};
  const contextLocked=()=>Boolean(contextualTransition)||['exam-running','exam-paused','lab-active'].includes(String(contextualState?.state||''));
  adaptiveController=createAdaptiveQualityController({initialQuality:quality,profile,onSample:info=>{fps=info.fps;onPerf?.({...info,worldId:'campus-ds',profile:{mobile:profile.mobile,saveData:profile.saveData,hardware:profile.hardware,cores:profile.cores}});},onQualityRequest:()=>{}});
  const keydown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','Space','KeyE','Enter','Digit1','Digit2','Digit3','KeyC'].includes(e.code))e.preventDefault();keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&localAction&&!contextLocked()){localAction=null;seated=null;self.userData.localAction=null;}if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat){if(airdropMode==='plane')jumpFromAirdrop();else if(airdropMode==='freefall')deployAirdropParachute();else onInteract?.();}if(e.code==='Space'&&!e.repeat&&airdropMode==='plane'){jumpFromAirdrop();}else if(e.code==='Space'&&!e.repeat&&airdropMode==='freefall'){deployAirdropParachute();}else if(e.code==='Space'&&!e.repeat&&!activeCampusVehicle&&!securityViewState.active&&!viewpointState.active&&onGround&&!contextLocked()){vertical=7.8;onGround=false;}if(e.code==='Digit1')state.emoteRequested?.('wave');if(e.code==='Digit2')state.emoteRequested?.('like');if(e.code==='Digit3')state.emoteRequested?.('spark');if(e.code==='KeyC'&&!e.repeat&&!securityViewState.active&&!viewpointState.active)cameraController.toggleMode();};const keyup=e=>keys.delete(e.code);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
  const bindJoystick=()=>{const root=document.getElementById('move-joystick'),stick=document.getElementById('move-stick');if(!root||!stick)return()=>{};let active=null;const update=e=>{const r=root.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len),x=dx*k,y=dy*k;moveJoy.x=x/max;moveJoy.y=y/max;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;};const down=e=>{active=e.pointerId;root.setPointerCapture(active);update(e);};const move=e=>{if(e.pointerId===active)update(e);};const end=e=>{if(e.pointerId!==active)return;active=null;moveJoy.x=moveJoy.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.replaceWith(root.cloneNode(true));};};const cleanJoy=bindJoystick();const jumpButton=document.getElementById('jump-button'),runButton=document.getElementById('run-button');const jumpTap=e=>{e.preventDefault();if(airdropMode==='plane'){jumpFromAirdrop();return;}if(airdropMode==='freefall'){deployAirdropParachute();return;}if(activeCampusVehicle?.seatMode==='driver'){if(activeCampusVehicle.mobilityType==='aerial')vehicleClimbHeld=true;else vehicleBrakeHeld=true;return;}if(activeCampusVehicle)return;if(onGround&&!contextLocked()){vertical=7.8;onGround=false;}};const jumpRelease=e=>{e.preventDefault();vehicleBrakeHeld=false;vehicleClimbHeld=false;};jumpButton?.addEventListener('pointerdown',jumpTap);jumpButton?.addEventListener('pointerup',jumpRelease);jumpButton?.addEventListener('pointercancel',jumpRelease);const runDown=e=>{e.preventDefault();if(activeCampusVehicle?.seatMode==='driver'&&activeCampusVehicle.mobilityType==='aerial')vehicleDescendHeld=true;else runHeld=true;},runUp=e=>{e.preventDefault();runHeld=false;vehicleDescendHeld=false;};runButton?.addEventListener('pointerdown',runDown);runButton?.addEventListener('pointerup',runUp);runButton?.addEventListener('pointercancel',runUp);
  let stopped=false,last=performance.now(),raf=0,nearPortal=null,nearStudent=null,lastArea='central',firstFrameDone=false,lastCampusStreamingAt=0,lastCampusBudget=null;
  function syncOtherAvatars(time,dt){
    if((activeInterior||activeToolInterior)&&!securityViewState.active&&!viewpointState.active)return;
    const seen=new Set();
    for(const o of state.others||[]){
      if(o.area==='vale-silicio'||o.area==='rural-agv'||o.area==='military-agv'||o.area==='space-agv'||o.area==='moon-agv'||o.area==='mars-agv')continue;
      seen.add(o.student_id);let entry=others.get(o.student_id);const staff=['teacher','admin','super_admin'].includes(o.participant_role);
      if(!entry){
        const zoneColor=zones.find(z=>z.code===state.classes?.find(c=>c.id===o.class_id)?.code)?.accent||'#7ba7bd',avatar=makeAvatar({accent:staff?'#ffd166':zoneColor,staff,label:o.display_name||'Aluno',seed:o.student_id,appearanceOverride:remoteAppearance(o)});
        exteriorRoot.add(avatar);const w=presenceToWorld(o.x,o.y);const remoteAltitude=Math.max(0,Number(o.altitude)||0);avatar.position.set(w.x,remoteAltitude,w.z);entry={avatar,target:new THREE.Vector3(w.x,remoteAltitude,w.z),staff};others.set(o.student_id,entry);
      }
      const occupant=occupantForUser(o.student_id),before=entry.avatar.position.clone();
      if(occupant){const pos=occupantPlacement(occupant.session,occupant.seatIndex);if(pos){entry.target.set(pos.x,.05,pos.z);entry.avatar.position.lerp(entry.target,1-Math.exp(-14*dt));entry.avatar.rotation.y=pos.heading;entry.avatar.userData.localAction='sit';entry.avatar.scale.setScalar(.68);}}
      else{const w=presenceToWorld(o.x,o.y),fastAltitude=remoteElevation(o),remoteAltitude=Math.max(fastAltitude,Number(o.altitude)||0),remoteMode=String(o.movement_mode||'ground');if(remoteMode==='plane'&&airdropSession){const pose=sampleAirdropPlane(airdropSession,Date.now()),seed=hashSeed(o.student_id),side=((seed%5)-2)*.42,along=(((seed>>3)%5)-2)*.38,cs=Math.cos(pose.heading||0),sn=Math.sin(pose.heading||0);entry.target.set(pose.x+side*cs+along*sn,pose.y,pose.z-side*sn+along*cs);}else entry.target.set(w.x,remoteAltitude,w.z);const gap=entry.avatar.position.distanceTo(entry.target);if(gap>16)entry.avatar.position.copy(entry.target);else entry.avatar.position.lerp(entry.target,1-Math.exp(-12*dt));const dx=entry.avatar.position.x-before.x,dz=entry.avatar.position.z-before.z,speed=Math.hypot(dx,dz)/Math.max(dt,.001),rh=remoteHeading(o);if(rh!==null){const rd=(rh-entry.avatar.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;entry.avatar.rotation.y+=rd*Math.min(1,dt*14);}else if(speed>.035)entry.avatar.rotation.y=Math.atan2(dx,dz);entry.avatar.scale.setScalar(.96);}
      const dx=entry.avatar.position.x-before.x,dz=entry.avatar.position.z-before.z,speed=occupant?0:Math.hypot(dx,dz)/Math.max(dt,.001);if(occupant){entry.avatar.userData.localAction='sit';avatarSystem.animate(entry.avatar,{speed,time,dt});avatarSystem.updateEmote(entry.avatar,o.emote,o.emote_until);}else applyRemoteAvatarState(avatarSystem,entry.avatar,o,{speed,time,dt,jump:remoteElevation(o)});avatarSystem.applyLOD(entry.avatar,self.position.distanceTo(entry.avatar.position),{staff});
    }
    for(const[id,entry]of others)if(!seen.has(id)){entry.avatar.parent?.remove(entry.avatar);avatarSystem.disposeAvatar(entry.avatar);others.delete(id);}
  }
  function findProximity(){
    if(airdropMode!=='ground')return{nearPortal:null,nearStudent:null,nearSeat:null,nearWorldObject:null};
    const inAnyInterior=!!activeInterior||!!activeToolInterior;
    nearPortal=null;
    if(!inAnyInterior&&!rides.isActive()&&!activeCampusVehicle){let bestPortal=3.35;for(const entry of portalMap.values()){const d=Math.hypot(self.position.x-entry.pos.x,self.position.z-entry.pos.z);if(d<bestPortal){bestPortal=d;nearPortal=entry.zone;}}}
    nearStudent=null;let best=2.65;if(!inAnyInterior&&!rides.isActive()&&!activeCampusVehicle)for(const o of state.others||[]){if(occupantForUser(o.student_id))continue;const e=others.get(o.student_id);if(!e)continue;const d=self.position.distanceTo(e.avatar.position);if(d<best){best=d;nearStudent=o;}}
    let nearSeat=null,bestSeat=1.8;if(!inAnyInterior&&!rides.isActive()&&!activeCampusVehicle)for(const seat of seats){const d=Math.hypot(self.position.x-seat.x,self.position.z-seat.z);if(d<bestSeat){bestSeat=d;nearSeat=seat;}}
    let nearWorldObject=null,bestWorld=2.5;
    const classInteriorTypes=new Set(['interior-exit','lab-terminal','smartboard','presentation-spot','lab-portal']);
    const toolInteriorTypes=new Set(['tool-interior-exit','tool-reception','tool-interior-portal','tool-elevator','tool-stairs','tool-garage','tool-receptionist','tool-interior-map','tool-guided-route','tool-service-zone','security-console']);
    if(!rides.isActive()&&!activeCampusVehicle)for(const o of worldObjects){
      const isClassInside=classInteriorTypes.has(o.type),isToolInside=toolInteriorTypes.has(o.type);
      if(activeInterior){if(!isClassInside||o.zoneKey!==activeInterior)continue;}
      else if(activeToolInterior){if(!isToolInside||o.interiorId!==activeToolInterior||Number(o.floor||0)!==activeToolFloor)continue;}
      else if(isClassInside||isToolInside)continue;
      const d=Math.hypot(self.position.x-o.x,self.position.z-o.z);if(d<Math.min(bestWorld,o.radius||2.5)){bestWorld=d;nearWorldObject=o;}
    }
    if(!inAnyInterior&&!rides.isActive()&&!activeCampusVehicle)for(const entry of remoteVehicles.values()){const session=entry.session,capacity=Number(session?.seat_capacity)||1,occupied=1+(vehicleNetworkState.passengers||[]).filter(row=>row.driver_id===session?.driver_id).length;if(capacity<=occupied)continue;const d=Math.hypot(self.position.x-entry.mesh.position.x,self.position.z-entry.mesh.position.z);if(d<Math.min(bestWorld,3.2)){bestWorld=d;nearWorldObject={id:`network-vehicle-${session.driver_id}`,type:'campus-network-vehicle',name:session.vehicle_name||'Veículo multiplayer',x:entry.mesh.position.x,z:entry.mesh.position.z,radius:3.2,session};}}
    return{nearPortal,nearStudent,nearSeat,nearWorldObject};
  }
  let lastExteriorLabelCull=0;
  const exteriorLabelPosition=new THREE.Vector3();
  function updateCampusStreaming(nowMs){
    if(airdropMode!=='ground'||activeInterior||activeToolInterior)return;
    const budget=campusRenderBudget(quality,profile);if(nowMs-lastCampusStreamingAt<budget.intervalMs)return;lastCampusStreamingAt=nowMs;
    lastCampusBudget=applyCampusRenderBudget({quality,profile,player:self.position,buildingRoots:environment.buildingRoots||[],experienceRoots:environment.experienceRoots||[],forceFull:securityViewState.active||viewpointState.active});
  }
  function updateExteriorLabelVisibility(nowMs){
    if(nowMs-lastExteriorLabelCull<220||activeInterior||activeToolInterior)return;lastExteriorLabelCull=nowMs;
    exteriorRoot.traverse?.(o=>{const limit=Number(o.userData?.labelCullDistance||0);if(!o.isSprite||!limit)return;o.getWorldPosition(exteriorLabelPosition);o.visible=Math.hypot(self.position.x-exteriorLabelPosition.x,self.position.z-exteriorLabelPosition.z)<=limit;});
  }
  function updateAdaptive(nowMs){const measured=adaptiveController.tick(nowMs,{mode:cameraController.getMode(),cameraCollision:cameraController.isColliding()});if(Number.isFinite(measured))fps=measured;}
  function updateCampusClock(nowMs){
    const world=resolveWorldTime(worldTimeMode,Date.now(),state.worldTimeControl),wx=resolveWorldWeather(state.worldWeatherControl),daylight=world.daylight,night=world.night,hour=world.hour,cover=wx.cloudCover*wx.strength;
    const weatherCenter=(securityViewState.active||viewpointState.active)?{x:0,y:0,z:0}:self.position,weatherFrame=weatherEffects?.update?.({time:nowMs/1000,weather:wx,center:weatherCenter})||{flash:0},flash=weatherFrame.flash||0;
    hemi.intensity=.72+daylight*1.15-cover*.34+flash*1.5;moon.intensity=.48+night*1.7-cover*.2+flash*.9;warm.intensity=.22+world.dusk*.9+night*.18;centerLight.intensity=6+night*14+flash*8;renderer.toneMappingExposure=.98+night*.2+wx.exposureDelta*wx.strength+flash*.12;
    const u=sky.userData.skyUniforms;if(u){u.top.value.lerpColors(new THREE.Color(0x030814),new THREE.Color(0x3a91c4),daylight);u.mid.value.lerpColors(new THREE.Color(0x10253b),new THREE.Color(0x86cbe3),daylight);u.bottom.value.lerpColors(new THREE.Color(0x07110f),new THREE.Color(0xc0ddc5),daylight);if(cover>.01){const storm=wx.id==='storm',snow=wx.id==='snow';u.top.value.lerp(new THREE.Color(snow?0x71818a:storm?0x182330:0x344a58),cover*.72);u.mid.value.lerp(new THREE.Color(snow?0x9aa8ac:storm?0x263642:0x526b76),cover*.66);u.bottom.value.lerp(new THREE.Color(snow?0xc2ccca:storm?0x39464b:0x6d7c7c),cover*.5);}}
    if(scene.fog){scene.fog.color.lerpColors(new THREE.Color(0x07121b),new THREE.Color(0x7fa5b2),daylight);if(cover>.01)scene.fog.color.lerp(new THREE.Color(wx.fogColor),Math.min(.8,cover*.7));scene.fog.density=.0105-daylight*.0042+wx.fogAdd*wx.strength;}
    const solar=((hour-6)/24)*Math.PI*2,moonA=solar+Math.PI;sunVisual.position.set(Math.cos(solar)*65,15+Math.max(0,Math.sin(solar))*48,-48+Math.sin(solar)*24);sunVisual.lookAt(0,8,0);sunVisual.material.opacity=(.12+.88*daylight)*(1-cover*.72);sunVisual.visible=daylight>.04&&cover<.96;moonVisual.position.set(Math.cos(moonA)*62,18+Math.max(0,Math.sin(moonA))*42,-52+Math.sin(moonA)*20);moonVisual.lookAt(0,8,0);moonVisual.material.opacity=(.18+.8*night)*(1-cover*.45);moonVisual.visible=night>.08&&cover<.98;
    ambientLandscape?.updateTime?.(world);const minute=Math.floor(hour*60);if(minute!==lastSignMinute||state._worldTimeModeSeen!==worldTimeMode){lastSignMinute=minute;state._worldTimeModeSeen=worldTimeMode;const label=`AGV • ${world.clock} • ${world.label}`;const old=liveSign.material.map;liveSign.material.map=roundedCanvasTexture(label,{accent:world.phase==='night'?'#b8caff':'#72e6ff'});liveSign.material.needsUpdate=true;old?.dispose?.();onWorldTime?.(world);}
  }
  function updateActivityBoard(){
    if(activeInterior||activeToolInterior)return;
    const board=centralFountain.userData?.statusBoard;if(!board)return;const available=Number(state.available?.length||0),scheduled=state.scheduled?.[0],signature=available?`available:${available}`:scheduled?`scheduled:${scheduled.s?.releaseAt||''}`:'waiting';if(signature===lastActivityStatus)return;lastActivityStatus=signature;
    const label=available?`${available} ATIVIDADE${available===1?'':'S'} LIBERADA${available===1?'':'S'}`:scheduled?'ATIVIDADE PROGRAMADA':'AGUARDANDO ATIVIDADE',accent=available?'#51e7a3':scheduled?'#ffd166':'#9bbac6',old=board.material.map;board.material.map=roundedCanvasTexture(label,{accent,bg:'rgba(3,13,18,.9)'});board.material.needsUpdate=true;old?.dispose?.();
  }
  function updatePatrols(time,dt){if((activeInterior||activeToolInterior)&&!securityViewState.active&&!viewpointState.active)return;for(const p of patrols){const [tx,tz]=p.def.route[p.index],dx=tx-p.avatar.position.x,dz=tz-p.avatar.position.z,dist=Math.hypot(dx,dz);if(dist<.25){p.index=(p.index+1)%p.def.route.length;continue;}const vx=dx/Math.max(dist,.001),vz=dz/Math.max(dist,.001);p.avatar.position.x+=vx*p.speed*dt;p.avatar.position.z+=vz*p.speed*dt;p.avatar.rotation.y=Math.atan2(vx,vz);avatarSystem.animate(p.avatar,{speed:p.speed,time,dt});avatarSystem.applyLOD(p.avatar,self.position.distanceTo(p.avatar.position));}for(const g of socialGroups){avatarSystem.animate(g.avatar,{speed:0,time:time+g.phase,dt});g.avatar.rotation.y+=Math.sin(time*.45+g.phase)*dt*.025;avatarSystem.applyLOD(g.avatar,self.position.distanceTo(g.avatar.position));}}
  function updateCityLife(time,dt,nowMs){
    const exteriorActive=securityViewState.active||viewpointState.active||(!activeInterior&&!activeToolInterior);
    if(exteriorActive){
    const signalNow=Date.now();for(const entry of trafficSignals){const phase=resolveTrafficSignalState(entry.def,signalNow);if(phase.state!==entry.lastState){entry.lastState=phase.state;for(const[name,lamp]of Object.entries(entry.lamps)){const active=name===phase.state;lamp.material.emissiveIntensity=active?3.8:.08;lamp.scale.setScalar(active?1.12:.92);}}}
    for(const def of CAMPUS_AERIAL_VEHICLES){const mesh=aerialVehicleMeshes.get(def.id);if(!mesh)continue;mesh.visible=activeCampusVehicle?.id!==def.id;animateAerialRotors(mesh,dt,mesh.visible?.42:1.4);}
    for(const entry of trafficVehicles){
      const current=sampleCampusRoute(entry.def.routeId,entry.progress),road=resolveCampusSpeedLimit(current.x,current.z),step=entry.def.speed*dt*Math.max(.52,Math.min(1,road.limitKmh/40)),nextProgress=entry.progress+step,next=sampleCampusRoute(entry.def.routeId,nextProgress),signal=trafficSignalAhead(current.x,current.z,current.heading,signalNow),red=signal&&signal.state!=='green'&&signal.distance<3.6,hit=dynamicVehicleHit(next.x,next.z,entry.def.kind,{excludeTraffic:entry,includePlayer:true});
      entry.blocked=!!(red||hit);if(!entry.blocked)entry.progress=nextProgress;const pos=entry.blocked?current:next;entry.mesh.position.set(pos.x,.02,pos.z);entry.mesh.rotation.y=pos.heading;
    }
    for(const entry of remoteVehicles.values()){entry.mesh.position.lerp(entry.target,1-Math.exp(-10*dt));let delta=(entry.targetHeading-entry.mesh.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;entry.mesh.rotation.y+=delta*Math.min(1,dt*12);}
    for(const entry of cityNpcPatrols){const pos=sampleCampusRoute(entry.def.routeId,entry.def.offset+time*entry.def.speed),before=entry.avatar.position.clone();entry.avatar.position.set(pos.x,0,pos.z);entry.avatar.rotation.y=pos.heading;entry.worldRef.x=pos.x;entry.worldRef.z=pos.z;avatarSystem.animate(entry.avatar,{speed:Math.hypot(entry.avatar.position.x-before.x,entry.avatar.position.z-before.z)/Math.max(dt,.001),time,dt});avatarSystem.applyLOD(entry.avatar,self.position.distanceTo(entry.avatar.position),{staff:true});}
    const d=new Date(),minute=d.getMinutes();if(minute!==lastCitySignMinute){lastCitySignMinute=minute;const event=resolveCampusCityEvent(d);if(event.id!==currentCityEvent.id){currentCityEvent=event;eventPlaza=CAMPUS_THEME_PLAZAS.find(item=>item.id===event.plazaId);Object.assign(cityEventRef,event,{x:eventPlaza?.x||0,z:eventPlaza?.z||0});cityEventMarker.position.set(cityEventRef.x,0,cityEventRef.z);eventRing.material.color.set(event.accent);const old=eventLabel.material.map;eventLabel.material.map=roundedCanvasTexture(`${event.icon} ${event.name.toUpperCase()}`,{accent:event.accent,bg:'rgba(3,15,18,.9)'});eventLabel.material.needsUpdate=true;old?.dispose?.();}
      for(const entry of dynamicCitySigns){const label=resolveDynamicSign(entry.def,d,currentCityEvent);if(label===entry.lastText)continue;entry.lastText=label;const old=entry.sprite.material.map;entry.sprite.material.map=roundedCanvasTexture(label,{accent:entry.def.accent,bg:'rgba(3,13,18,.9)'});entry.sprite.material.needsUpdate=true;old?.dispose?.();}}
    cityEventMarker.rotation.y+=dt*.08;eventRing.rotation.z+=dt*.32;eventRing.material.opacity=.34+.18*(.5+.5*Math.sin(time*2.2));
    if(activeCampusVehicle){if(activeCampusVehicle.seatMode==='driver'){playerVehicleShell.visible=true;const aerial=activeCampusVehicle.mobilityType==='aerial';playerVehicleShell.position.set(self.position.x,aerial?vehicleAltitude+.02:.02,self.position.z);playerVehicleShell.rotation.y=vehicleHeading;if(!aerial){playerVehicleShell.rotation.x=0;playerVehicleShell.rotation.z=0;}else animateAerialRotors(playerVehicleShell,dt,1.5);}else if(activeCampusVehicle.seatMode==='network-passenger'){playerVehicleShell.visible=false;}else{const elapsed=nowMs-vehicleRideStartedAt,k=elapsed/Math.max(1000,activeCampusVehicle.runtimeDurationMs||activeCampusVehicle.durationMs||18000);if(k>=1){activeCampusVehicle=null;vehicleRideStartedAt=0;vehicleSpeed=0;playerVehicleShell.visible=false;}else{const pos=sampleCampusRoute(activeCampusVehicle.routeId,(activeCampusVehicle.startT||0)+k);playerVehicleShell.visible=true;playerVehicleShell.position.set(pos.x,.02,pos.z);playerVehicleShell.rotation.y=pos.heading;}}}else playerVehicleShell.visible=false;
    }
    if(activeToolInterior){const room=toolInteriors.get(activeToolInterior),motion=room?.elevatorMotion;if(room?.elevatorCabin){if(motion){const t=Math.max(0,Math.min(1,(nowMs-motion.startedAt)/motion.durationMs)),smooth=t*t*(3-2*t),fromY=motion.fromFloor*CAMPUS_ELEVATOR_SYSTEM.floorHeight,toY=motion.toFloor*CAMPUS_ELEVATOR_SYSTEM.floorHeight;room.elevatorCabin.visible=true;room.elevatorCabin.position.y=fromY+(toY-fromY)*smooth;if(t>=1){room.elevatorCabin.visible=false;room.elevatorCabin.position.y=0;room.elevatorMotion=null;applyToolFloor(activeToolInterior,motion.toFloor,{move:true,via:'elevator'});}}else room.elevatorCabin.visible=false;}}
  }
  function updateAutomaticDoors(dt){
    const inAnyInterior=!!activeInterior||!!activeToolInterior;
    for(const e of entranceDoors){const d=Math.hypot(self.position.x-e.x,self.position.z-e.z),target=!inAnyInterior&&d<3.0?1:0;e.door.userData.open=THREE.MathUtils.damp(e.door.userData.open,target,9,dt);const k=e.door.userData.open;e.door.userData.left.position.x=-1.02-k*1.0;e.door.userData.right.position.x=1.02+k*1.0;}
    if(activeInterior){const r=interiors.get(activeInterior);if(r){const d=Math.hypot(self.position.x-r.origin[0],self.position.z-(r.origin[2]-5.85)),target=d<3.0?1:0;r.door.userData.open=THREE.MathUtils.damp(r.door.userData.open,target,9,dt);const k=r.door.userData.open;r.door.userData.left.position.x=-1.02-k*1.0;r.door.userData.right.position.x=1.02+k*1.0;}}
    if(activeToolInterior&&activeToolFloor===0){const r=toolInteriors.get(activeToolInterior),door=r?.doors?.get(0),profile=r?.profile;if(door&&profile){const d=Math.hypot(self.position.x-profile.exit.x,self.position.z-profile.exit.z),target=d<3?1:0;door.userData.open=THREE.MathUtils.damp(door.userData.open,target,9,dt);const k=door.userData.open;door.userData.left.position.x=-1.02-k*1;door.userData.right.position.x=1.02+k*1;}}
    if(activeToolInterior){const r=toolInteriors.get(activeToolInterior),panels=r?.elevatorPanels?.get(activeToolFloor);if(panels){const active=performance.now()<(r.elevatorAnimUntil||0),k=active?.78:0;panels.left.position.x=5.87-k*.58;panels.right.position.x=6.73+k*.58;panels.indicator.material.emissiveIntensity=active?1.9:.95;}if(r?.receptionistAvatar)avatarSystem.animate(r.receptionistAvatar,{speed:0,time:performance.now()/1000,dt});}
  }
  function updatePortalVisuals(time){if(activeInterior||activeToolInterior)return;portalSystem?.update?.({time,playerPosition:self.position,currentClassCode:state.currentClass?.code||null});}
  function frame(nowMs){
    if(stopped||signal?.aborted)return;raf=requestAnimationFrame(frame);if(document.hidden)return;const minFrame=1000/Math.max(15,fpsCap||60);if(lastRenderGate&&nowMs-lastRenderGate<minFrame-1)return;lastRenderGate=nowMs;resizeController.update();
    const dt=Math.min(.045,(nowMs-last)/1000||.016);last=nowMs;const time=nowMs/1000,motionTime=profile.reducedMotion?0:time;
    const left=keys.has('KeyA')||keys.has('ArrowLeft'),right=keys.has('KeyD')||keys.has('ArrowRight'),up=keys.has('KeyW')||keys.has('ArrowUp'),down=keys.has('KeyS')||keys.has('ArrowDown');
    const manualDriving=activeCampusVehicle?.seatMode==='driver',networkPassenger=activeCampusVehicle?.seatMode==='network-passenger';
    let ix=(right?1:0)-(left?1:0)+moveJoy.x,iz=(down?1:0)-(up?1:0)+moveJoy.y;if(seated||presentation||rides.isActive()||train.isTraveling()||activeCampusVehicle||airdropMode==='plane'||securityViewState.active||viewpointState.active||toolInteriors.get(activeToolInterior)?.elevatorMotion||contextLocked()){ix=0;iz=0;}const len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}
    const running=keys.has('ShiftLeft')||keys.has('ShiftRight')||runHeld,speed=playerMoveSpeed(state,{running,interior:!!activeInterior||!!activeToolInterior}),cameraYaw=cameraController.getYaw(),sy=Math.sin(cameraYaw),cy=Math.cos(cameraYaw),mx=ix*cy+iz*sy,mz=-ix*sy+iz*cy;
    let vehicleRide=null;
    if(activeCampusVehicle&&!manualDriving&&!networkPassenger){const elapsed=nowMs-vehicleRideStartedAt,k=elapsed/Math.max(1000,activeCampusVehicle.runtimeDurationMs||activeCampusVehicle.durationMs||18000);if(k<1)vehicleRide=sampleCampusRoute(activeCampusVehicle.routeId,(activeCampusVehicle.startT||0)+k);}
    const activeRideId=rides.currentId(),trainRide=train.tickTrip(nowMs),experienceRide=rides.tick(nowMs),ride=vehicleRide||trainRide||experienceRide;let moving=Math.hypot(mx,mz),groundY=0,support=null;
    if(airdropMode!=='ground'){
      let planePose=airdropSession?sampleAirdropPlane(airdropSession,Date.now()):null;
      if(planePose){airdropHeading=planePose.heading||airdropHeading;airdropPlane.visible=!planePose.departed;airdropPlane.position.set(planePose.x,planePose.y,planePose.z);airdropPlane.rotation.y=airdropHeading;if(planePose.departed&&airdropMode==='plane')jumpFromAirdrop();}
      if(airdropMode==='plane'){
        const pose=planePose||{x:self.position.x,y:airdropAltitude,z:self.position.z,heading:airdropHeading};airdropAltitude=Math.max(0,Number(pose.y)||AIRDROP_CONFIG.altitude);self.position.set(pose.x,airdropAltitude,pose.z);self.rotation.y=pose.heading||airdropHeading;playerY=airdropAltitude;vertical=0;onGround=false;moving=0;
      }else{
        const glide=airdropMode==='parachute'?AIRDROP_CONFIG.glideSpeed:AIRDROP_CONFIG.glideSpeed*.58,heading=cameraController.getYaw(),gx=ix*Math.cos(heading)+iz*Math.sin(heading),gz=-ix*Math.sin(heading)+iz*Math.cos(heading),next=clampAirdropPosition(self.position.x+gx*glide*dt,self.position.z+gz*glide*dt,{worldX:WORLD_X,worldZ:WORLD_Z,margin:1.2});
        self.position.x=next.x;self.position.z=next.z;if(Math.hypot(gx,gz)>.03){const desired=Math.atan2(gx,gz);let delta=(desired-self.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;self.rotation.y+=delta*Math.min(1,dt*6);}
        airdropAltitude=Math.max(0,airdropAltitude-airdropDescentRate(airdropMode)*dt);if(airdropMode==='freefall'&&shouldAutoDeploy(airdropAltitude))deployAirdropParachute();
        playerY=airdropAltitude;self.position.y=airdropAltitude;vertical=-airdropDescentRate(airdropMode);onGround=false;moving=Math.min(1,Math.hypot(gx,gz));
        if(airdropAltitude<=.05){airdropParachute.visible=false;airdropPlane.visible=false;airdropMode='ground';airdropSession=null;airdropAltitude=0;playerY=0;vertical=0;onGround=true;self.position.y=0;applyAirdropDetail('full');}
      }
      applyAirdropDetail(airdropDetailLevel(airdropAltitude));
    }else if(manualDriving){
      if(activeCampusVehicle.mobilityType==='aerial'){
        const throttle=clamp((up?1:0)-(down?1:0)-moveJoy.y,-1,1),steer=clamp((right?1:0)-(left?1:0)+moveJoy.x,-1,1),preset=activeCampusVehicle.speedPreset||'normal',maxKmh=aerialSpeedKmh(activeCampusVehicle,preset),maxSpeed=maxKmh/3.6,reverseMax=maxSpeed*.28,maxAltitude=Math.max(8,Number(activeCampusVehicle.maxAltitude)||30),climbRate=Math.max(3,Number(activeCampusVehicle.climbRate)||6.5);
        const climbInput=clamp((keys.has('Space')||vehicleClimbHeld?1:0)-(keys.has('ShiftLeft')||keys.has('ShiftRight')||vehicleDescendHeld?1:0),-1,1);
        if(throttle>0){if(vehicleSpeed<0)vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,7.5,dt);else vehicleSpeed=Math.min(maxSpeed,vehicleSpeed+(activeCampusVehicle.kind==='helicopter'?5.0:5.8)*throttle*dt);}
        else if(throttle<0){if(vehicleSpeed>0)vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,7.5,dt);else vehicleSpeed=Math.max(-reverseMax,vehicleSpeed-(activeCampusVehicle.kind==='helicopter'?2.6:3.2)*(-throttle)*dt);}
        else vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,1.1,dt);
        vehicleVerticalSpeed=THREE.MathUtils.damp(vehicleVerticalSpeed,climbInput*climbRate,climbInput?5.8:3.2,dt);
        vehicleHeading+=steer*(activeCampusVehicle.kind==='helicopter'?1.18:1.42)*dt;
        let nextAltitude=clamp(vehicleAltitude+vehicleVerticalSpeed*dt,0,maxAltitude),nx=self.position.x+Math.sin(vehicleHeading)*vehicleSpeed*dt,nz=self.position.z+Math.cos(vehicleHeading)*vehicleSpeed*dt;
        const clearance=Math.max(aerialClearanceAt(nx,nz,activeCampusVehicle.kind),aerialClearanceAt(self.position.x,self.position.z,activeCampusVehicle.kind));
        if(nextAltitude<clearance){nextAltitude=clearance;vehicleVerticalSpeed=Math.max(0,vehicleVerticalSpeed);}
        if(canAerialOccupy(nx,nz,nextAltitude,activeCampusVehicle.kind)){self.position.x=nx;self.position.z=nz;}else{vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,12,dt);nx=self.position.x;nz=self.position.z;}
        vehicleAltitude=nextAltitude;self.position.y=vehicleAltitude;playerY=vehicleAltitude;vertical=0;onGround=vehicleAltitude<=.04;self.rotation.y=vehicleHeading;moving=Math.min(1,Math.abs(vehicleSpeed)/Math.max(1,maxSpeed));
        const pad=nearestCampusHelipad(self.position.x,self.position.z),landing=vehicleAltitude<=.35&&isCampusHelipadLanding(self.position.x,self.position.z);
        vehicleTrafficState={limitKmh:maxKmh,zoneName:landing?(pad?.name||'Heliponto'):'Espaço aéreo',signalState:'green',signalLabel:landing?'Pousado':'Voo livre',safety:landing?'Heliponto':''};
        playerVehicleShell.visible=true;playerVehicleShell.position.set(self.position.x,vehicleAltitude+.02,self.position.z);playerVehicleShell.rotation.y=vehicleHeading;playerVehicleShell.rotation.z=THREE.MathUtils.damp(playerVehicleShell.rotation.z,-steer*.14,5,dt);playerVehicleShell.rotation.x=THREE.MathUtils.damp(playerVehicleShell.rotation.x,throttle*.055,5,dt);animateAerialRotors(playerVehicleShell,dt,vehicleAltitude>.08||Math.abs(vehicleSpeed)>.1?1.35:.55);
      }else{
        const throttle=clamp((up?1:0)-(down?1:0)-moveJoy.y,-1,1),steer=clamp((right?1:0)-(left?1:0)+moveJoy.x,-1,1),preset=activeCampusVehicle.speedPreset||'normal',profileMaxKmh=preset==='tour'?24:preset==='sport'?44:34,road=resolveCampusSpeedLimit(self.position.x,self.position.z),signal=trafficSignalAhead(self.position.x,self.position.z,vehicleHeading,Date.now()),trafficBrake=!!(signal&&signal.state!=='green'&&signal.distance<3.7&&vehicleSpeed>0),maxKmh=Math.min(profileMaxKmh,road.limitKmh),maxSpeed=maxKmh/3.6,reverseMax=Math.min(4.0,maxSpeed*.42),braking=keys.has('Space')||vehicleBrakeHeld||trafficBrake;
        vehicleTrafficState={limitKmh:road.limitKmh,zoneName:road.zone?.name||'Campus',signalState:signal?.state||'green',signalLabel:signal?signal.label:'Livre',safety:trafficBrake?'Semáforo':''};
        if(braking)vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,trafficBrake?14:11,dt);
        else if(throttle>0){if(vehicleSpeed<0)vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,8,dt);else vehicleSpeed=Math.min(maxSpeed,vehicleSpeed+(activeCampusVehicle.kind==='bus'?3.1:4.6)*throttle*dt);}
        else if(throttle<0){if(vehicleSpeed>0)vehicleSpeed=Math.max(0,vehicleSpeed-(activeCampusVehicle.kind==='bus'?6.2:7.8)*(-throttle)*dt);else vehicleSpeed=Math.max(-reverseMax,vehicleSpeed-(activeCampusVehicle.kind==='bus'?2.2:3.0)*(-throttle)*dt);}
        else vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,0,1.35,dt);
        if(vehicleSpeed>maxSpeed)vehicleSpeed=THREE.MathUtils.damp(vehicleSpeed,maxSpeed,5.5,dt);
        const speedRatio=clamp(Math.abs(vehicleSpeed)/Math.max(1,maxSpeed),0,1),steerRate=(1.55-.72*speedRatio)*(vehicleSpeed<0?-1:1);if(Math.abs(vehicleSpeed)>.08)vehicleHeading+=steer*steerRate*dt;
        const nx=self.position.x+Math.sin(vehicleHeading)*vehicleSpeed*dt,nz=self.position.z+Math.cos(vehicleHeading)*vehicleSpeed*dt,staticOk=canVehicleStand(nx,nz,activeCampusVehicle.kind),dynamicHit=staticOk?dynamicVehicleHit(nx,nz,activeCampusVehicle.kind,{includePlayer:false}):null;
        if(staticOk&&!dynamicHit){self.position.x=nx;self.position.z=nz;rememberSafeVehiclePose(nowMs);}else if(dynamicHit||Math.abs(vehicleSpeed)>.35){recoverVehicleFromCollision(dynamicHit||{type:'static',label:'obstáculo fixo'},nowMs);}else vehicleSpeed=0;
        self.position.y=0;playerY=0;vertical=0;onGround=true;self.rotation.y=vehicleHeading;moving=Math.min(1,Math.abs(vehicleSpeed)/Math.max(1,maxSpeed));
        playerVehicleShell.visible=true;playerVehicleShell.position.set(self.position.x,.02,self.position.z);playerVehicleShell.rotation.y=vehicleHeading;if(nowMs-lastVehicleTelemetrySent>=320){lastVehicleTelemetrySent=nowMs;onVehicleTelemetry?.({x:self.position.x,z:self.position.z,heading:vehicleHeading,speedKmh:Math.round(vehicleSpeed*3.6)});}
      }
    }else if(networkPassenger){const session=(vehicleNetworkState.sessions||[]).find(row=>row.driver_id===activeCampusVehicle.driverId),pos=session?occupantPlacement(session,activeCampusVehicle.seatIndex):null;if(pos){self.position.set(pos.x,.05,pos.z);self.rotation.y=pos.heading;playerY=.05;vertical=0;onGround=true;moving=Math.min(1,Math.abs(Number(session.speed_kmh)||0)/44);cameraController.setYaw(pos.heading+Math.PI);}else moving=0;
    }else if(ride){self.position.set(ride.x,ride.y,ride.z);playerY=ride.y||0;vertical=0;onGround=true;self.rotation.y=ride.heading||self.rotation.y;cameraController.setYaw((ride.heading||0)+Math.PI);moving=.8;}
    else{
      const nx=self.position.x+mx*speed*dt,nz=self.position.z+mz*speed*dt;if(canStand(nx,self.position.z))self.position.x=nx;if(canStand(self.position.x,nz))self.position.z=nz;
      if(moving>.03){const desired=Math.atan2(mx,mz);let delta=(desired-self.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;self.rotation.y+=delta*Math.min(1,dt*11);}
      support=(!activeInterior&&!activeToolInterior)?campusSurfaceAt(self.position.x,self.position.z,-.04):null;groundY=support?.h||0;if(onGround&&groundY>playerY&&groundY-playerY<=.72){playerY=groundY;vertical=0;}vertical-=20*dt;playerY+=vertical*dt;if(playerY<=groundY){playerY=groundY;vertical=0;onGround=true;}else onGround=false;
      self.position.y=playerY;
    }
    if(contextualTransition){
      const elapsed=nowMs-contextualTransition.startedAt,k=clamp(elapsed/Math.max(260,contextualTransition.durationMs),0,1),ease=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      self.position.x=contextualTransition.fromX+(contextualTransition.toX-contextualTransition.fromX)*ease;self.position.z=contextualTransition.fromZ+(contextualTransition.toZ-contextualTransition.fromZ)*ease;self.position.y=0;playerY=0;vertical=0;onGround=true;self.rotation.y=contextualTransition.rot;moving=k<1?Math.min(1,Math.hypot(contextualTransition.toX-contextualTransition.fromX,contextualTransition.toZ-contextualTransition.fromZ)):.0;
      if(k>=1){localAction=contextualTransition.action||null;self.userData.localAction=localAction;contextualTransition=null;}
    }
    const insideRuntime=!!activeInterior||!!activeToolInterior;
    avatarSystem.animate(self,{speed:moving*speed,jump:Math.max(0,playerY-groundY),time:motionTime,vertical,dt});syncOtherAvatars(motionTime,dt);updatePortalVisuals(motionTime);if(!insideRuntime||securityViewState.active||viewpointState.active){updateCampusClock(nowMs);if(!insideRuntime){updateCampusStreaming(nowMs);updateExteriorLabelVisibility(nowMs);updateActivityBoard();}}else if(weatherEffects?.points)weatherEffects.points.visible=false;
    if(!insideRuntime||securityViewState.active||viewpointState.active){
      if(transit?.train){const trainActive=!!trainRide||train.isTraveling();transit.train.visible=trainActive;if(trainActive){const trainPos=trainRide||train.sampleVisual(nowMs);transit.train.position.set(trainPos.x,trainPos.y,trainPos.z);transit.train.rotation.y=trainPos.heading||0;for(const entry of transit.stations||[]){const active=trainPos.station===entry.station.id,pulse=.5+.5*Math.sin(motionTime*5);if(entry.indicator?.material)entry.indicator.material.emissiveIntensity=active?1.45+.75*pulse:.78;if(entry.edgeLight?.material)entry.edgeLight.material.emissiveIntensity=active?1.15+.45*pulse:.62;}}else{for(const entry of transit.stations||[]){if(entry.indicator?.material)entry.indicator.material.emissiveIntensity=.78;if(entry.edgeLight?.material)entry.edgeLight.material.emissiveIntensity=.62;}}}
    }
    updatePatrols(motionTime,dt);updateCityLife(motionTime,dt,nowMs);updateAutomaticDoors(dt);if(activeInterior){const r=interiors.get(activeInterior);if(r){for(const t of r.terminals){if(t.screen&&t.mesh?.userData?.powered){t.screen.material.emissiveIntensity=1.05+.35*(.5+.5*Math.sin(motionTime*3+t.id.length));}}if(r.presentationPad)r.presentationPad.material.opacity=.32+.22*(.5+.5*Math.sin(motionTime*2.4));}}if(activeToolInterior&&!profile.reducedMotion){const r=toolInteriors.get(activeToolInterior);for(const node of r?.ambientNodes||[]){if(node.floor!==activeToolFloor)continue;if(node.kind==='spin')node.mesh.rotation.y+=dt*(.3+Math.abs(Number(node.speed)||.5));else if(node.mesh.material?.emissiveIntensity!==undefined)node.mesh.material.emissiveIntensity=.34+.22*(.5+.5*Math.sin(motionTime*2.1+(node.floor||0)));}}
    if(!insideRuntime||securityViewState.active||viewpointState.active){if(canopy?.userData?.inner){canopy.userData.inner.material.emissiveIntensity=1.05+.28*(.5+.5*Math.sin(motionTime*.9));canopy.userData.inner.rotation.z=motionTime*.012;}npcs.forEach((n,i)=>{const bx=n.def.x,bz=n.def.z;n.avatar.position.x=bx+Math.sin(motionTime*.22+i)*.55;n.avatar.position.z=bz+Math.cos(motionTime*.18+i)*.35;n.worldRef.x=n.avatar.position.x;n.worldRef.z=n.avatar.position.z;avatarSystem.animate(n.avatar,{speed:.22,jump:0,time:motionTime+i*.7,vertical:0,dt});n.avatar.rotation.y=Math.atan2(Math.cos(motionTime*.22+i),-Math.sin(motionTime*.18+i));avatarSystem.applyLOD(n.avatar,self.position.distanceTo(n.avatar.position),{staff:true});});meetPads.forEach((pad,i)=>{pad.userData.ring.rotation.z=motionTime*(i%2?.22:-.18);pad.userData.core.material.opacity=.12+.07*(.5+.5*Math.sin(motionTime*2+i));});centralFountain.userData.pool.material.opacity=.62+.08*Math.sin(motionTime*2.4);centralFountain.userData.crown.rotation.y=motionTime*.65;centralFountain.userData.crown.position.y=3.28+Math.sin(motionTime*1.8)*.08;for(let i=0;i<beacon.userData.rings.length;i++){const r=beacon.userData.rings[i];r.rotation.y=motionTime*(i%2?.23:-.18)+i*.4;r.rotation.z+=profile.reducedMotion?0:dt*(i%2?.18:-.12);}if(ambientCount)motes.rotation.y=motionTime*.0015;ambientLandscape?.update?.(motionTime,dt);const identityAnimated=environment.city?.userData?.spaceIdentityAnimated||[];if(quality!=='low'&&!profile.reducedMotion)identityAnimated.forEach((item,i)=>{item.rotation.y+=dt*(i%2?.12:-.1);if(item.material&&'emissiveIntensity' in item.material)item.material.emissiveIntensity=.58+.22*(.5+.5*Math.sin(motionTime*1.15+i*.8));});}
    cameraController.update({playerPosition:self.position,moving,running,time:motionTime,dt});self.visible=(!activeCampusVehicle||networkPassenger)&&!train.isTraveling()&&!cameraController.isFirstPerson();updateAdaptive(nowMs);
    const proximity=findProximity(),area=areaAt(self.position.x,self.position.z);if(area!==lastArea){lastArea=area;onAreaChange?.(area);}const publicPos=activeInterior?exteriorEntrances[activeInterior]:(activeToolInterior?CAMPUS_INTERIOR_MAP[activeToolInterior]?.entrance:null),p=publicPos?worldToPresence(publicPos.x,publicPos.z):worldToPresence(self.position.x,self.position.z);const interiorKey=activeInterior||(activeToolInterior?`tool:${activeToolInterior}`:null);onPlayerState?.({x:p.x,y:p.y,area,interior:interiorKey,interiorFloor:activeToolInterior?activeToolFloor:null,nearPortal:proximity.nearPortal,nearStudent:proximity.nearStudent,nearSeat:proximity.nearSeat,nearWorldObject:proximity.nearWorldObject,vehicle:campusVehicleTelemetry(),airdrop:getAirdropState(),seated:!!seated,moving,running,onGround,elevation:airdropMode==='ground'?playerY:airdropAltitude,jumpHeight:airdropMode==='ground'?playerY:0,heading:self.rotation.y,localAction:self.userData.localAction||null});if(!renderSecurityCameras()&&!renderViewpoint())renderer.render(scene,camera);if(!firstFrameDone){firstFrameDone=true;onFirstFrame?.();}
  }
  function showChatMessage(senderId,message,own=false){const entry=senderId===state.user?.id?{avatar:self}:others.get(senderId);const avatar=entry?.avatar;if(!avatar)return false;const previous=avatar.userData.chatBubble;if(previous){avatar.remove(previous);disposeObject(previous);}const bubble=spriteLabel(String(message||'').slice(0,90),own?'#51e7a3':'#72e6ff',4.4,{bg:'rgba(3,12,18,.94)'});bubble.position.set(0,3.75,0);avatar.add(bubble);avatar.userData.chatBubble=bubble;setTimeout(()=>{if(avatar.userData?.chatBubble===bubble){avatar.remove(bubble);disposeObject(bubble);avatar.userData.chatBubble=null;}},6500);return true;}
  const visibilityChange=()=>{if(!document.hidden){last=performance.now();lastRenderGate=0;adaptiveController.reset();resizeController.request();}};
  const contextLost=e=>{e.preventDefault();onError?.('O navegador reiniciou o contexto gráfico. Mudando para o mapa 2D para preservar sua sessão.');onContextLost?.();};
  document.addEventListener('visibilitychange',visibilityChange);canvas.addEventListener('webglcontextlost',contextLost,false);
  resizeController.update(true);abortIfNeeded();raf=requestAnimationFrame(frame);
  function applyToolFloor(id,floor,{move=true,via='elevator'}={}){
    const room=toolInteriors.get(id),profile=CAMPUS_INTERIOR_MAP[id];if(!room||!profile)return false;const next=Math.max(0,Math.min(profile.floors.length-1,Number(floor)||0));
    for(const [n,g] of room.floors)g.visible=n===next;activeToolFloor=next;activeToolGuide=null;interiorGuideLine.visible=false;
    if(move){const anchor=via==='stairs'?profile.stairs:profile.elevator;self.position.set(anchor.x,0,anchor.z+(next===0?.75:-.75));playerY=0;vertical=0;onGround=true;}
    onInteriorChange?.({inside:true,key:`tool:${id}`,kind:'tool',floor:next,label:`${profile.name} • ${profile.floorLabel(next)}`});return true;
  }
  function enterToolInterior(id){
    const profile=CAMPUS_INTERIOR_MAP[id];if(!profile)return false;cancelCampusVehicle();rides.cancel({silent:true});train.cancel();lastExteriorPosition={x:self.position.x,z:self.position.z};
    if(activeInterior){const previous=activeInterior;activeInterior=null;releaseClassInterior(previous);}if(activeToolInterior&&activeToolInterior!==id){const previous=activeToolInterior;activeToolInterior=null;releaseToolInterior(previous);}
    const room=ensureToolInterior(id);if(!room)return false;activeToolInterior=id;activeToolFloor=0;activeToolGuide=null;interiorGuideLine.visible=false;for(const [n,g] of room.floors)g.visible=n===0;activeInteriorCollisionRoots=[room.group];setWorldMode(true);
    seated=null;presentation=null;activeStation=null;localAction=null;self.userData.localAction=null;self.position.set(profile.origin[0],0,profile.origin[2]-4.35);self.rotation.y=0;playerY=0;vertical=0;onGround=true;cameraController.setYaw(Math.PI);
    onInteriorChange?.({inside:true,key:`tool:${id}`,kind:'tool',floor:0,label:`${profile.name} • ${profile.floorLabel(0)}`,runtime:'lazy-mounted'});return true;
  }
  function applyContextualAvatarState(context){
    const next=context&&typeof context==='object'?context:{state:'idle'};contextualState=next;
    if(!next.interiorId||next.state==='idle'){contextualTransition=null;if(['exam','exam-paused','program'].includes(localAction)){localAction=null;self.userData.localAction=null;seated=null;}return true;}
    if(activeToolInterior!==next.interiorId&&!enterToolInterior(next.interiorId))return false;
    const anchor=contextualInteriorAnchor(next.interiorId,next.state);if(!anchor)return true;
    if(Number(anchor.floor)!==activeToolFloor)applyToolFloor(next.interiorId,anchor.floor,{move:false,via:'context'});
    const dist=Math.hypot(self.position.x-anchor.x,self.position.z-anchor.z),duration=profile.reducedMotion?260:clamp(dist/3.4*1000,520,2600);
    localAction=null;self.userData.localAction=null;seated=null;presentation=null;contextualTransition={fromX:self.position.x,fromZ:self.position.z,toX:anchor.x,toZ:anchor.z,rot:Number(anchor.rot)||0,action:anchor.action||null,startedAt:performance.now(),durationMs:duration};cameraController.setYaw((Number(anchor.rot)||0)+Math.PI);return true;
  }
  function exitToolInterior({garage=false}={}){
    if(!activeToolInterior)return false;const id=activeToolInterior,profile=CAMPUS_INTERIOR_MAP[id];if(id==='security-center')closeSecurityCameras();activeToolInterior=null;activeToolFloor=0;activeToolGuide=null;interiorGuideLine.visible=false;seated=null;presentation=null;activeStation=null;contextualTransition=null;contextualState=null;localAction=null;self.userData.localAction=null;
    const target=garage&&profile?.garage?{x:profile.garage.x,z:profile.garage.z}:{x:lastExteriorPosition?.x??profile?.entrance?.x??0,z:lastExteriorPosition?.z??profile?.entrance?.z??0};releaseToolInterior(id);activeInteriorCollisionRoots=[];setWorldMode(false);self.position.set(target.x,0,target.z);playerY=0;vertical=0;onGround=true;self.rotation.y=Math.PI;cameraController.setYaw(0);onInteriorChange?.({inside:false,key:null,kind:'tool',floor:null,label:garage&&profile?.garage?profile.garage.name:'Campus DS',runtime:'unmounted'});return true;
  }
  function useToolElevator(ref){if(!activeToolInterior||ref?.interiorId!==activeToolInterior)return false;const room=toolInteriors.get(activeToolInterior),profile=CAMPUS_INTERIOR_MAP[activeToolInterior];if(!room||room.elevatorMotion)return false;const target=profile.floors.length>1?(activeToolFloor===0?1:0):0;room.elevatorAnimUntil=performance.now()+CAMPUS_ELEVATOR_SYSTEM.doorOpenMs+CAMPUS_ELEVATOR_SYSTEM.travelMs;room.elevatorMotion={fromFloor:activeToolFloor,toFloor:target,startedAt:performance.now()+CAMPUS_ELEVATOR_SYSTEM.doorOpenMs*.35,durationMs:CAMPUS_ELEVATOR_SYSTEM.travelMs};self.position.set(profile.elevator.x,0,profile.elevator.z+.18);playerY=0;vertical=0;onGround=true;return true;}
  function useToolStairs(ref){if(!activeToolInterior||ref?.interiorId!==activeToolInterior)return false;const profile=CAMPUS_INTERIOR_MAP[activeToolInterior];const target=profile.floors.length>1?(activeToolFloor===0?1:0):0;return applyToolFloor(activeToolInterior,target,{move:true,via:'stairs'});}
  function startInteriorGuide(ref){if(!activeToolInterior||ref?.interiorId!==activeToolInterior)return false;const route=CAMPUS_INTERIOR_MAP[activeToolInterior]?.guidedRoutes?.find(item=>item.id===ref.routeId);if(!route||Number(route.floor||0)!==activeToolFloor||route.nodes.length<2)return false;activeToolGuide={interiorId:activeToolInterior,floor:activeToolFloor,routeId:route.id};const pts=route.nodes.map(node=>new THREE.Vector3(node.x,.12,node.z));interiorGuideLine.geometry.dispose();interiorGuideLine.geometry=new THREE.BufferGeometry().setFromPoints(pts);interiorGuideLine.material.color.set(CAMPUS_INTERIOR_MAP[activeToolInterior]?.accent||'#72e6ff');interiorGuideLine.visible=true;return true;}
  function useCampusVehicle(ref,options={}){
    const aerial=ref?.mobilityType==='aerial';
    if(activeInterior||activeToolInterior||!ref||(!aerial&&!ref.routeId))return false;
    rides.cancel({silent:true});train.cancel();
    const speedPreset=['tour','normal','sport'].includes(options?.speedPreset)?options.speedPreset:'normal',speedFactor=speedPreset==='tour'?1.28:speedPreset==='sport'?.78:1,requestedSeat=options?.seatMode==='passenger'?'passenger':'driver',seatMode=aerial?'driver':requestedSeat,speedLabel=speedPreset==='tour'?'Passeio':speedPreset==='sport'?'Ágil':'Normal';
    activeCampusVehicle={...ref,seatMode,speedPreset,speedLabel,runtimeDurationMs:aerial?0:Math.max(9000,Math.round((ref.durationMs||18000)*speedFactor))};vehicleRideStartedAt=performance.now();vehicleSpeed=0;vehicleVerticalSpeed=0;vehicleClimbHeld=false;vehicleDescendHeld=false;vehicleBrakeHeld=false;
    vehiclePreviousCamera=cameraController.getMode();
    if(aerial){
      vehicleHeading=Number(ref.heading)||0;vehicleAltitude=0;self.position.set(Number(ref.x)||0,0,Number(ref.z)||0);self.rotation.y=vehicleHeading;playerY=vehicleAltitude;vertical=0;onGround=vehicleAltitude<=.04;cameraController.setMode('aerial');cameraController.setYaw(vehicleHeading+Math.PI);cameraController.setPitch?.(.38);vehicleTrafficState={limitKmh:aerialSpeedKmh(ref,speedPreset),zoneName:nearestCampusHelipad(self.position.x,self.position.z)?.name||'Espaço aéreo',signalState:'green',signalLabel:'Pousado',safety:'Heliponto'};
    }else{
      const start=sampleCampusRoute(ref.routeId,ref.startT||0);vehicleHeading=ref.spawned?(Number(ref.heading)||0):(start.heading||0);if(seatMode==='driver'){self.position.set(Number(ref.x)||start.x,0,Number(ref.z)||start.z);self.rotation.y=vehicleHeading;cameraController.setYaw(vehicleHeading+Math.PI);lastSafeVehiclePose={x:self.position.x,z:self.position.z,heading:vehicleHeading};lastSafeVehicleAt=performance.now();vehicleRecoveryUntil=0;vehicleTrafficState={limitKmh:resolveCampusSpeedLimit(self.position.x,self.position.z).limitKmh,zoneName:'Campus',signalState:'green',signalLabel:'Livre'};}
    }
    if(ref.spawned&&spawnedVehicleMeshes.has(ref.id))spawnedVehicleMeshes.get(ref.id).visible=false;playerVehicleShell.clear();const shell=campusMobilityVehicle(ref);while(shell.children.length)playerVehicleShell.add(shell.children.shift());playerVehicleShell.position.set(self.position.x,aerial?vehicleAltitude+.02:.02,self.position.z);playerVehicleShell.rotation.set(0,vehicleHeading,0);playerVehicleShell.visible=true;return true;
  }
  function cancelCampusVehicle(){
    const had=!!activeCampusVehicle,previousVehicle=activeCampusVehicle,wasAerial=activeCampusVehicle?.mobilityType==='aerial';activeCampusVehicle=null;if(previousVehicle?.spawned&&spawnedVehicleMeshes.has(previousVehicle.id))spawnedVehicleMeshes.get(previousVehicle.id).visible=true;networkPassengerState=null;vehicleRideStartedAt=0;vehicleSpeed=0;vehicleAltitude=0;vehicleVerticalSpeed=0;vehicleClimbHeld=false;vehicleDescendHeld=false;vehicleBrakeHeld=false;lastSafeVehiclePose=null;lastSafeVehicleAt=0;vehicleRecoveryUntil=0;vehicleTrafficState={limitKmh:40,zoneName:'Campus',signalState:'green',signalLabel:'Livre'};playerVehicleShell.visible=false;playerVehicleShell.rotation.set(0,0,0);if(wasAerial){self.position.y=0;playerY=0;vertical=0;onGround=true;cameraController.setMode(vehiclePreviousCamera||'explore');cameraController.setYaw(self.rotation.y+Math.PI);}return had;
  }
  function campusVehicleSnapshot(){
    if(!activeCampusVehicle)return null;const aerial=activeCampusVehicle.mobilityType==='aerial',pad=nearestCampusHelipad(self.position.x,self.position.z),landed=aerial&&vehicleAltitude<=.35&&isCampusHelipadLanding(self.position.x,self.position.z);return{id:activeCampusVehicle.id,name:activeCampusVehicle.name,seatMode:activeCampusVehicle.seatMode,mobilityType:activeCampusVehicle.mobilityType||'ground',speedPreset:activeCampusVehicle.speedPreset,speedLabel:activeCampusVehicle.speedLabel,speedKmh:Math.round(Math.abs(vehicleSpeed)*3.6),altitude:aerial?Math.round(vehicleAltitude*10)/10:0,maxAltitude:aerial?Number(activeCampusVehicle.maxAltitude)||0:0,verticalSpeed:aerial?Math.round(vehicleVerticalSpeed*10)/10:0,canExit:!aerial||landed,landingZone:aerial&&pad&&Math.hypot(self.position.x-pad.x,self.position.z-pad.z)<=Number(pad.radius||2.8)+1.25?pad.name:null};
  }
  function campusVehicleTelemetry(){
    if(!activeCampusVehicle)return null;const aerial=activeCampusVehicle.mobilityType==='aerial',network=activeCampusVehicle.seatMode==='network-passenger',driver=activeCampusVehicle.seatMode==='driver',session=network?(vehicleNetworkState.sessions||[]).find(row=>row.driver_id===activeCampusVehicle.driverId):null,snapshot=campusVehicleSnapshot(),guidedKmh=activeCampusVehicle.speedPreset==='tour'?24:activeCampusVehicle.speedPreset==='sport'?44:34,speedKmh=driver?Math.round(Math.abs(vehicleSpeed)*3.6):network?Math.round(Math.abs(Number(session?.speed_kmh)||0)):guidedKmh;
    let gear=network?'PAX':driver?(Math.abs(vehicleSpeed)<.18?'N':vehicleSpeed<0?'R':'D'):'AUTO';if(aerial&&driver)gear=Math.abs(vehicleVerticalSpeed)>.35?(vehicleVerticalSpeed>0?'↑':'↓'):Math.abs(vehicleSpeed)>.18?'F':'H';
    return{...snapshot,speedKmh,gear,manual:driver,limitKmh:driver?vehicleTrafficState.limitKmh:null,roadZone:driver?vehicleTrafficState.zoneName:null,signalState:driver?vehicleTrafficState.signalState:null,signalLabel:driver?vehicleTrafficState.signalLabel:null,safety:driver?vehicleTrafficState.safety:null};
  }

  return{setQuality:q=>applyQuality(q,{manual:true}),teleportTo(target){if(!target)return false;closeSecurityCameras();closeViewpoint();cancelCampusVehicle();rides.cancel({silent:true});train.cancel();if(activeInterior){const previous=activeInterior;activeInterior=null;releaseClassInterior(previous);onInteriorChange?.({inside:false,key:null,label:'Praça Central',runtime:'unmounted'});}if(activeToolInterior){const previous=activeToolInterior;activeToolInterior=null;activeToolFloor=0;releaseToolInterior(previous);onInteriorChange?.({inside:false,key:null,kind:'tool',label:'Campus DS',runtime:'unmounted'});}activeInteriorCollisionRoots=[];setWorldMode(false);seated=null;presentation=null;if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=null;localAction=null;self.userData.localAction=null;self.position.set(clamp(Number(target.x)||0,-WORLD_X+1,WORLD_X-1),0,clamp(Number(target.z)||0,-WORLD_Z+1,WORLD_Z-1));playerY=0;vertical=0;onGround=true;cameraController.setYaw(Math.PI);return true;},getDestinations:()=>teleportDestinations.map(item=>({...item})),startChallenge:()=>false,restartChallenge:()=>false,cancelChallenge:()=>false,startExperience,cancelExperience:()=>rides.cancel(),enterToolInterior,exitToolInterior,useToolElevator,useToolStairs,exitToolInteriorToGarage:()=>exitToolInterior({garage:true}),getToolInterior:()=>activeToolInterior?{id:activeToolInterior,floor:activeToolFloor}:null,getInteriorMap:()=>activeToolInterior?{profile:CAMPUS_INTERIOR_MAP[activeToolInterior],floor:activeToolFloor,map:CAMPUS_INTERIOR_MAP[activeToolInterior]?.floorMaps?.find(item=>item.index===activeToolFloor)||null}:null,startInteriorGuide,openSecurityCameras,closeSecurityCameras,setSecurityCamera,setSecurityCameraLayout,setSecurityCameraZoom,getSecurityCameraState:securityCameraSnapshot,openViewpoint,closeViewpoint,setViewpointZoom,setViewpointFocus,getViewpointState:viewpointSnapshot,setCinemaMedia,getCinemaMedia:()=>({...cinemaMediaState}),startAirdropSession,jumpFromAirdrop,deployAirdropParachute,cancelAirdropSession,getAirdropState,setVehicleNetwork,spawnCampusVehicle,getSpawnedVehicles:()=>[...spawnedVehicleRefs.values()].map(item=>({...item})),attachNetworkPassenger,detachNetworkPassenger,useCampusVehicle,cancelCampusVehicle,getCampusVehicle:campusVehicleSnapshot,applyContextualAvatarState,getContextualAvatarState:()=>contextualState,enterInterior(key){rides.cancel({silent:true});lastExteriorPosition={x:self.position.x,z:self.position.z};if(activeToolInterior){const previous=activeToolInterior;activeToolInterior=null;activeToolFloor=0;releaseToolInterior(previous);}if(activeInterior&&activeInterior!==key){const previous=activeInterior;activeInterior=null;releaseClassInterior(previous);}const r=ensureClassInterior(key);if(!r)return false;activeInterior=key;activeInteriorCollisionRoots=[r.group];setWorldMode(true);seated=null;presentation=null;activeStation=null;localAction=null;self.userData.localAction=null;self.position.set(r.origin[0],0,r.origin[2]-4.5);self.rotation.y=0;cameraController.setYaw(Math.PI);onInteriorChange?.({inside:true,key,label:r.zone.label,runtime:'lazy-mounted'});return true;},exitInterior(){if(!activeInterior)return false;const key=activeInterior,ent=exteriorEntrances[key];activeInterior=null;seated=null;presentation=null;if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=null;localAction=null;self.userData.localAction=null;releaseClassInterior(key);activeInteriorCollisionRoots=[];setWorldMode(false);self.position.set(lastExteriorPosition?.x??ent.x,0,(lastExteriorPosition?.z??ent.z)+(key==='1ds'||key==='2ds'?1.4:-1.4));self.rotation.y=key==='1ds'||key==='2ds'?Math.PI:0;cameraController.setYaw(self.rotation.y+Math.PI);onInteriorChange?.({inside:false,key,label:zones.find(z=>z.key===key)?.label||key,runtime:'unmounted'});return true;},toggleStation(station){if(!station||station.type!=='lab-terminal')return false;if(activeStation?.id===station.id){station.mesh.userData.powered=false;station.screen.material=station.mesh.userData.screenOff;activeStation=null;seated=null;localAction=null;self.userData.localAction=null;return false;}if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=station;station.mesh.userData.powered=true;station.screen.material=station.mesh.userData.screenOn;seated=station;presentation=null;localAction='sit';self.userData.localAction='sit';self.position.set(station.x,0,station.z);self.rotation.y=station.rot||0;cameraController.setYaw(self.rotation.y+Math.PI);return true;},togglePresentation(spot){if(!spot||spot.type!=='presentation-spot')return false;if(presentation){presentation=null;localAction=null;self.userData.localAction=null;return false;}presentation=spot;seated=null;activeStation=null;localAction='cheer';self.userData.localAction='cheer';self.position.set(spot.x,0,spot.z);self.rotation.y=Math.PI;cameraController.setYaw(0);return true;},showBoard(key){const r=interiors.get(key);if(!r)return false;const baseScale=r.boardTitle.scale.clone();r.boardScreen.material.emissiveIntensity=1.15;r.boardTitle.scale.multiplyScalar(1.08);setTimeout(()=>{if(r.boardScreen?.material)r.boardScreen.material.emissiveIntensity=.08;if(r.boardTitle)r.boardTitle.scale.copy(baseScale);},2600);return true;},getInterior:()=>activeInterior||(activeToolInterior?`tool:${activeToolInterior}`:null),setLocalAction(kind){if(contextLocked())return false;if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;}activeStation=null;localAction=kind||null;seated=null;presentation=null;self.userData.localAction=localAction;return true;},toggleSeat(seat){if(seated){if(activeStation){activeStation.mesh.userData.powered=false;activeStation.screen.material=activeStation.mesh.userData.screenOff;activeStation=null;}seated=null;localAction=null;self.userData.localAction=null;return false;}if(!seat)return false;seated=seat;localAction='sit';self.userData.localAction='sit';self.position.set(seat.x,0,seat.z);self.rotation.y=seat.rot;return true;},isSeated:()=>!!seated,getQuality:()=>quality,getFPS:()=>adaptiveController.getFPS(),getPerformanceProfile:()=>({...profile}),getAvatarMode:()=>avatarSystem.getMode(),toggleCamera:()=>securityViewState.active?'security':viewpointState.active?'viewpoint':cameraController.toggleMode(),setCameraMode:m=>(securityViewState.active||viewpointState.active)?false:cameraController.setMode(m),getCameraMode:()=>cameraController.getMode(),setFov:v=>cameraController.setFov(v),getFov:()=>cameraController.getFov(),setMouseSensitivity:v=>cameraController.setSensitivity(v),getMouseSensitivity:()=>cameraController.getSensitivity(),setFPSCap:v=>{fpsCap=clamp(Number(v)||60,15,60);return fpsCap;},getFPSCap:()=>fpsCap,setWorldTimeMode:m=>{worldTimeMode=['cycle','auto','day','night'].includes(m)?(m==='auto'?'cycle':m):'cycle';lastSignMinute=-1;return worldTimeMode;},getWorldTimeMode:()=>worldTimeMode,getTrainStations:()=>train.stations(),startTrainTo:id=>{cancelCampusVehicle();rides.cancel({silent:true});return train.startTrip(id,{x:self.position.x,z:self.position.z});},showChatMessage,jump:()=>{if(airdropMode==='plane')return jumpFromAirdrop();if(airdropMode==='freefall')return deployAirdropParachute();if(onGround&&!securityViewState.active&&!viewpointState.active&&!rides.isActive()&&!train.isTraveling()&&!contextLocked()){vertical=7.8;onGround=false;}},setRun:v=>{runHeld=!!v;},setLocalEmote(kind){avatarSystem.updateEmote(self,kind,new Date(Date.now()+4500).toISOString());},getObservabilitySnapshot:()=>captureRenderTelemetry({renderer,scene,fps:adaptiveController.getFPS(),quality,npcCount:cityNpcPatrols.filter(entry=>entry.avatar?.visible!==false).length,vehicleCount:trafficVehicles.length+remoteVehicles.size+(activeCampusVehicle?1:0),worldId:'campus-ds',interior:activeInterior||(activeToolInterior?`tool:${activeToolInterior}`:null),source:'campus3d',extra:{renderBudget:lastCampusBudget}}),stop(){closeViewpoint();stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',visibilityChange);canvas.removeEventListener('webglcontextlost',contextLost,false);resizeController?.dispose?.();cameraController.dispose();portalSystem?.dispose?.();jumpButton?.removeEventListener('pointerdown',jumpTap);jumpButton?.removeEventListener('pointerup',jumpRelease);jumpButton?.removeEventListener('pointercancel',jumpRelease);runButton?.removeEventListener('pointerdown',runDown);runButton?.removeEventListener('pointerup',runUp);runButton?.removeEventListener('pointercancel',runUp);cleanJoy?.();weatherEffects?.dispose?.();disposeCinemaVideo();for(const entry of remoteVehicles.values())disposeObject(entry.mesh);remoteVehicles.clear();renderer.dispose();disposeObject(scene);},renderer,scene,camera,self};
}

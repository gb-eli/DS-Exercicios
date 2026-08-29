const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function hashSeed(value='agv'){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(a){return()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}

const SKINS=[0xf0c09c,0xd99b72,0xb97753,0x8e5b42,0x6d4330];
const HAIRS=[0x171719,0x3a251d,0x5c3a27,0x111b27,0x4b2421,0x2b1712];
const PANTS=[0x16202a,0x202731,0x17222d,0x293039];
const SHOES=[0x080c10,0xe8ecef,0x20242a,0x121b25];

export function createAvatarAppearance({seed='agv',accent='#36d2ff',staff=false}={}){
  const rnd=mulberry32(hashSeed(seed));
  const hairRoll=rnd();
  return {
    skin:SKINS[Math.floor(rnd()*SKINS.length)],
    hair:HAIRS[Math.floor(rnd()*HAIRS.length)],
    pants:PANTS[Math.floor(rnd()*PANTS.length)],
    shoes:SHOES[Math.floor(rnd()*SHOES.length)],
    accent:null,
    accentCss:accent,
    hairStyle:hairRoll>.82?'cap':hairRoll>.48?'short':'soft',
    backpack:rnd()>.34,
    glasses:rnd()>.72,
    headset:!staff&&rnd()>.84,
    wrist:rnd()>.52,
    staff:!!staff,
    variation:Math.floor(rnd()*4)
  };
}

function makeMaterial(THREE,color,{emissive=0x000000,emissiveIntensity=0,metalness=.08,roughness=.55,transparent=false,opacity=1}={}){
  return new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity,metalness,roughness,transparent,opacity});
}
function box(THREE,w,h,d,material,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);return m;}
function cylinder(THREE,r,h,material,x=0,y=0,z=0,segments=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);m.position.set(x,y,z);return m;}
function capsule(THREE,r,l,material){return new THREE.Mesh(new THREE.CapsuleGeometry(r,l,5,10),material);}
function setShadow(root,enabled){root.traverse?.(o=>{if(o.isMesh){o.castShadow=enabled;o.receiveShadow=enabled;}});}
function disposeObject(root){root?.traverse?.(o=>{o.geometry?.dispose?.();if(o.material){for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.map?.dispose?.();m.dispose?.();}}});}

function proceduralBody(THREE,{accent='#36d2ff',staff=false,seed='agv',appearance}){
  const root=new THREE.Group();root.name='avatar-procedural';const rnd=mulberry32(hashSeed(seed));
  const skin=makeMaterial(THREE,appearance.skin,{roughness:.72});const hairMat=makeMaterial(THREE,appearance.hair,{roughness:.83});
  const accentHex=new THREE.Color(accent).getHex();const cloth=makeMaterial(THREE,accentHex,{metalness:.08,roughness:.52,emissive:staff?accentHex:0x000000,emissiveIntensity:staff?.12:0});
  const trouser=makeMaterial(THREE,appearance.pants,{roughness:.76});const shoe=makeMaterial(THREE,appearance.shoes,{roughness:.5});const white=makeMaterial(THREE,0xe9f3f5,{roughness:.55});const dark=makeMaterial(THREE,0x0b1218,{roughness:.42});
  const body=new THREE.Group();body.position.y=.98;root.add(body);
  const torso=capsule(THREE,.36,.65,cloth);torso.scale.set(1.08,1.03,.65);torso.position.y=.52;body.add(torso);
  body.add(box(THREE,.88,.16,.34,cloth,0,.92,0),box(THREE,.58,.105,.032,white,0,.62,.26),cylinder(THREE,.11,.18,skin,0,1.17,0,14));
  const head=new THREE.Mesh(new THREE.SphereGeometry(.31,20,14),skin);head.scale.set(.92,1.08,.92);head.position.y=1.46;body.add(head);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.316,18,12,0,Math.PI*2,0,Math.PI*.55),hairMat);hair.position.set(0,1.54,-.005);body.add(hair);
  const eyesMat=new THREE.MeshBasicMaterial({color:0x19232b});for(const ex of[-.105,.105]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),eyesMat);eye.position.set(ex,1.49,.292);body.add(eye);}
  if(appearance.glasses){const frame=makeMaterial(THREE,0x10151a,{metalness:.35,roughness:.25});const pg1=box(THREE,.14,.075,.022,frame,-.105,1.49,.315),pg2=box(THREE,.14,.075,.022,frame,.105,1.49,.315),pbridge=box(THREE,.07,.018,.022,frame,0,1.49,.315);pg1.userData.avatarAccessory=pg2.userData.avatarAccessory=pbridge.userData.avatarAccessory=true;body.add(pg1,pg2,pbridge);}
  if(staff){const visor=box(THREE,.39,.065,.035,dark,0,1.49,.307);visor.material.transparent=true;visor.material.opacity=.76;body.add(visor);}
  const armGeo=new THREE.CapsuleGeometry(.095,.53,4,8);armGeo.translate(0,-.34,0);const legGeo=new THREE.CapsuleGeometry(.115,.67,4,8);legGeo.translate(0,-.43,0);
  const leftArm=new THREE.Group(),rightArm=new THREE.Group(),leftLeg=new THREE.Group(),rightLeg=new THREE.Group();leftArm.position.set(-.49,.92,0);rightArm.position.set(.49,.92,0);leftLeg.position.set(-.205,.1,0);rightLeg.position.set(.205,.1,0);
  leftArm.add(new THREE.Mesh(armGeo,cloth));rightArm.add(new THREE.Mesh(armGeo,cloth));leftLeg.add(new THREE.Mesh(legGeo,trouser));rightLeg.add(new THREE.Mesh(legGeo,trouser));body.add(leftArm,rightArm,leftLeg,rightLeg);
  for(const arm of[leftArm,rightArm]){const hand=new THREE.Mesh(new THREE.SphereGeometry(.105,10,8),skin);hand.position.y=-.71;arm.add(hand);}
  const shoeGeo=new THREE.BoxGeometry(.25,.16,.42);const ls=new THREE.Mesh(shoeGeo,shoe);ls.position.set(0,-.87,.115);leftLeg.add(ls);const rs=ls.clone();rightLeg.add(rs);
  if(staff){body.add(box(THREE,.12,.9,.42,makeMaterial(THREE,0xe7b947,{metalness:.25,roughness:.38,emissive:0xffc53d,emissiveIntensity:.22}),-.38,.56,-.01));}
  if(appearance.backpack){const pack=box(THREE,.48,.62,.18,makeMaterial(THREE,appearance.variation%2?0x233746:0x35404a,{roughness:.72}),0,.56,-.32);pack.rotation.x=-.04;pack.userData.avatarAccessory=true;body.add(pack);const strap=box(THREE,.08,.72,.05,makeMaterial(THREE,0x11181e,{roughness:.8}),-.25,.6,-.18);strap.userData.avatarAccessory=true;const strap2=strap.clone().translateX(.5);strap2.userData.avatarAccessory=true;body.add(strap,strap2);}
  if(appearance.hairStyle==='cap'){const cap=new THREE.Mesh(new THREE.CylinderGeometry(.28,.31,.09,18),hairMat);cap.position.set(0,1.72,0);cap.userData.avatarAccessory=true;body.add(cap);const brim=box(THREE,.34,.035,.14,hairMat,0,1.68,.28);brim.userData.avatarAccessory=true;body.add(brim);}
  if(appearance.headset){const band=new THREE.Mesh(new THREE.TorusGeometry(.31,.025,8,20,Math.PI),makeMaterial(THREE,0x1b2229,{metalness:.4,roughness:.3}));band.rotation.z=Math.PI;band.position.set(0,1.52,0);band.userData.avatarAccessory=true;body.add(band);}
  if(appearance.wrist){const watch=box(THREE,.14,.06,.14,makeMaterial(THREE,0x202a31,{metalness:.7,roughness:.2}),0,-.55,.02);watch.userData.avatarAccessory=true;rightArm.add(watch);}
  root.userData={body,leftArm,rightArm,leftLeg,rightLeg,head,phase:rnd()*Math.PI*2,appearance};setShadow(root,true);return root;
}

function addRigAccessories(THREE,model,appearance){
  const rig=model.userData.rig;if(!rig)return;
  const bone=name=>rig.bones.find(b=>b.name===name);const head=bone('Head'),torso=bone('Torso'),rightArm=bone('RightArm');
  const hairMat=makeMaterial(THREE,appearance.hair,{roughness:.8});
  if(head){
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.30,16,10,0,Math.PI*2,0,Math.PI*.55),hairMat);hair.position.set(0,.10,-.02);hair.scale.set(1,1.02,1);hair.userData.avatarAccessory=true;head.add(hair);
    if(appearance.hairStyle==='cap'){const cap=new THREE.Mesh(new THREE.CylinderGeometry(.27,.30,.08,16),hairMat);cap.position.set(0,.25,0);cap.userData.avatarAccessory=true;head.add(cap);const brim=box(THREE,.32,.035,.13,hairMat,0,.20,.24);brim.userData.avatarAccessory=true;head.add(brim);}
    if(appearance.glasses){const frame=makeMaterial(THREE,0x11171d,{metalness:.45,roughness:.2});const g1=box(THREE,.13,.07,.018,frame,-.1,.02,.28),g2=box(THREE,.13,.07,.018,frame,.1,.02,.28),bridge=box(THREE,.06,.015,.018,frame,0,.02,.28);g1.userData.avatarAccessory=g2.userData.avatarAccessory=bridge.userData.avatarAccessory=true;head.add(g1,g2,bridge);}
    if(appearance.headset){const band=new THREE.Mesh(new THREE.TorusGeometry(.30,.024,8,20,Math.PI),makeMaterial(THREE,0x1b2229,{metalness:.42,roughness:.28}));band.rotation.z=Math.PI;band.position.set(0,.02,0);band.userData.avatarAccessory=true;head.add(band);}
  }
  if(torso&&appearance.backpack){const pack=box(THREE,.45,.58,.18,makeMaterial(THREE,appearance.variation%2?0x233746:0x35404a,{roughness:.72}),0,.12,-.27);pack.userData.avatarAccessory=true;torso.add(pack);}
  if(rightArm&&appearance.wrist){const watch=box(THREE,.13,.06,.13,makeMaterial(THREE,0x202a31,{metalness:.72,roughness:.18}),0,-.37,.01);watch.userData.avatarAccessory=true;rightArm.add(watch);}
  setShadow(model,true);
}

function animateProcedural(avatar,{speed=0,jump=0,time=0,vertical=0}={}){
  const u=avatar.userData,walk=clamp(speed/3.2,0,1),run=clamp((speed-3)/3.4,0,1),phase=time*(6.8+run*4.3)+u.phase,swing=Math.sin(phase)*(.72*walk+.25*run);
  u.leftArm.rotation.set(swing*.88,0,.035);u.rightArm.rotation.set(-swing*.88,0,-.035);u.leftLeg.rotation.set(-swing*.8,0,0);u.rightLeg.rotation.set(swing*.8,0,0);
  const idle=1-walk;u.body.position.y=.98+Math.sin(time*1.8+u.phase)*.012*idle+Math.abs(Math.sin(phase*2))*.032*walk+jump*.025;u.body.rotation.z=Math.sin(phase)*.018*walk;u.body.rotation.x=-run*.07;
  u.head.rotation.y=Math.sin(time*1.1+u.phase)*.07*idle;u.head.rotation.x=Math.sin(time*.7+u.phase)*.025*idle;
  if(jump>.01){u.leftArm.rotation.x=-.65;u.rightArm.rotation.x=-.65;u.leftLeg.rotation.x=.28+vertical*.025;u.rightLeg.rotation.x=.14-vertical*.018;u.body.rotation.x=-.08;}
  const emoteActive=u.emoteKind&&u.emoteUntil>Date.now(),localAction=u.localAction||null;
  if(localAction==='dance'){u.body.rotation.z+=Math.sin(time*4)*.16;u.leftArm.rotation.z=.8;u.rightArm.rotation.z=-.8;}else if(localAction==='cheer'){u.leftArm.rotation.x=-1.65;u.rightArm.rotation.x=-1.65;u.leftArm.rotation.z=.25;u.rightArm.rotation.z=-.25;}else if(localAction==='crouch'){u.body.position.y-=.42;u.leftLeg.rotation.x=-.7;u.rightLeg.rotation.x=-.7;}else if(localAction==='sit'){u.body.position.y-=.7;u.leftLeg.rotation.x=-1.1;u.rightLeg.rotation.x=-1.1;}
  if(emoteActive&&u.emoteKind==='wave'){u.rightArm.rotation.x=-1.5;u.rightArm.rotation.z=-.35+Math.sin(time*10)*.42;}if(emoteActive&&u.emoteKind==='like'){u.leftArm.rotation.x=-1.18;u.rightArm.rotation.x=-1.18;u.leftArm.rotation.z=.26;u.rightArm.rotation.z=-.26;}if(emoteActive&&u.emoteKind==='spark'){u.body.position.y+=.07+Math.abs(Math.sin(time*6))*.06;u.leftArm.rotation.z=.72;u.rightArm.rotation.z=-.72;}
}

export function createAvatarSystem({THREE,spriteLabel,emojiSprite,quality='medium',mobile=false,hardware=4,diagnostics=globalThis.__agvLobbyDiag}={}){
  let rigAsset=null,rigApi=null,currentQuality=quality,rigEligible=!mobile||hardware>=6;
  const mode=()=>rigAsset?'rigged-glb-v2':'procedural-v2';
  async function init(){
    if(!rigEligible)return mode();
    try{rigApi=await import('../rigged-avatar.js?v=14.10.8.51');rigAsset=await rigApi.loadRiggedAvatarAsset(THREE,{timeout:3000});diagnostics?.record?.('avatar_system_ready',{mode:'rigged-glb-v2',clips:rigAsset.clips?.map(c=>c.name)||[]});}
    catch(error){rigAsset=null;rigApi=null;diagnostics?.record?.('avatar_system_fallback',{mode:'procedural-v2',message:String(error?.message||error).slice(0,180)});console.warn('Avatar rigado indisponível; Avatar V2 usando fallback procedural.',error);}
    return mode();
  }
  function createAvatar({accent='#36d2ff',staff=false,label='Aluno',seed='agv'}={}){
    const appearance=createAvatarAppearance({seed,accent,staff});appearance.accent=new THREE.Color(accent).getHex();
    const root=new THREE.Group();root.name=`AGVAvatarV2-${String(seed).slice(0,12)}`;
    if(rigAsset){const model=rigApi?.createRiggedAvatar?.(THREE,rigAsset,{accent,staff,seed,appearance});if(model){addRigAccessories(THREE,model,appearance);root.add(model);root.userData.rig=model.userData.rig;root.userData.rigModel=model;}}
    if(!root.userData.rig){const body=proceduralBody(THREE,{accent,staff,seed,appearance});root.add(body);Object.assign(root.userData,body.userData);root.userData.proceduralModel=body;}
    const tag=spriteLabel(label,staff?'#ffd166':accent,staff?4.55:4.05);tag.position.set(0,3.05,0);root.add(tag);let badge=null;if(staff){badge=spriteLabel('EQUIPE','#ffd166',2.25,{bg:'rgba(40,26,2,.84)'});badge.position.set(0,2.68,0);root.add(badge);}
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.55,28),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.012;root.add(shadow);
    Object.assign(root.userData,{tag,badge,shadow,emote:null,appearance,avatarMode:root.userData.rig?'rigged-glb-v2':'procedural-v2',localAction:null,lodLevel:0});shadow.castShadow=false;shadow.receiveShadow=false;tag.castShadow=false;if(badge)badge.castShadow=false;
    return root;
  }
  function animate(avatar,{speed=0,jump=0,time=0,vertical=0,dt=.016}={}){
    const u=avatar?.userData;if(!u)return;
    let step=dt;const tier=u.lodLevel||0;if(tier>=2){u.lodAccumulator=(u.lodAccumulator||0)+dt;const interval=tier>=3?.16:.08;if(u.lodAccumulator<interval)return;step=u.lodAccumulator;u.lodAccumulator=0;}
    if(u.rig){const emoteActive=u.emoteKind&&u.emoteUntil>Date.now();rigApi?.updateRiggedAvatar?.(avatar,{speed,jump,dt:step,emoteKind:u.emoteKind,emoteActive,localAction:u.localAction||null,time});}
    else animateProcedural(avatar,{speed,jump,time,vertical,dt:step});
    if(u.shadow){const scale=1-clamp(jump/4,0,.18);u.shadow.scale.set(scale,scale,1);u.shadow.material.opacity=.22*scale;}
  }
  function updateEmote(avatar,kind,until){
    const parsed=Date.parse(until||0),active=kind&&parsed>Date.now(),u=avatar?.userData;if(!u)return;u.emoteKind=active?kind:null;u.emoteUntil=active?parsed:0;
    if(!active){if(u.emote){avatar.remove(u.emote);disposeObject(u.emote);u.emote=null;}return;}
    const emoji=kind==='wave'?'👋':kind==='like'?'👍':'✨';if(u.emote?.userData.kind===kind)return;if(u.emote){avatar.remove(u.emote);disposeObject(u.emote);}u.emote=emojiSprite(emoji);u.emote.userData.kind=kind;u.emote.position.set(.7,2.74,0);avatar.add(u.emote);
  }
  function applyLOD(avatar,distance,{staff=false,local=false}={}){
    if(!avatar?.userData)return;const u=avatar.userData,tag=u.tag,badge=u.badge;
    const tier=local?0:distance>30?3:distance>18?2:distance>10?1:0;u.lodLevel=tier;
    const tagVisible=local||staff||distance<11.5;if(tag){tag.visible=tagVisible;if(tag.material)tag.material.opacity=distance>8.5&&!local&&!staff?clamp(1-(distance-8.5)/3,.16,1):1;}
    if(badge){badge.visible=staff&&distance<20;if(badge.material)badge.material.opacity=distance>15?clamp(1-(distance-15)/5,.25,1):1;}
    avatar.visible=local||distance<40;
    const model=u.rigModel||u.proceduralModel;if(model){model.traverse?.(o=>{if(o.userData?.avatarAccessory)o.visible=tier<2&&(currentQuality!=='low'||local);});}
    if(u.shadow)u.shadow.visible=local||distance<22;
  }
  function setQuality(next){currentQuality=next||currentQuality;}
  function disposeAvatar(avatar){if(!avatar)return;if(avatar.userData?.rigModel)rigApi?.disposeRiggedAvatar?.(avatar.userData.rigModel);disposeObject(avatar);}
  return {init,createAvatar,animate,updateEmote,applyLOD,disposeAvatar,setQuality,getMode:mode,getRigAsset:()=>rigAsset};
}

const QUALITY_RANK={low:0,medium:1,high:2,ultra:3};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function material(THREE,color,{emissive=0x000000,emissiveIntensity=0,metalness=.12,roughness=.5,transparent=false,opacity=1,side=THREE.FrontSide,additive=false,depthWrite=true}={}){
  return new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity,metalness,roughness,transparent,opacity,side,depthWrite,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
}
function basic(THREE,color,{transparent=true,opacity=1,side=THREE.DoubleSide,additive=true,depthWrite=false}={}){
  return new THREE.MeshBasicMaterial({color,transparent,opacity,side,depthWrite,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
}
function box(THREE,w,h,d,mat,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);return mesh;}
function cyl(THREE,r,h,mat,x=0,y=0,z=0,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat);mesh.position.set(x,y,z);return mesh;}
function setShadow(root,enabled){root.traverse?.(o=>{if(o.isMesh){o.castShadow=enabled;o.receiveShadow=enabled;}});}

function particleField(THREE,accent,count,seed=1){
  const geo=new THREE.BufferGeometry(),positions=[],phase=[];
  let s=(seed>>>0)||1;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};
  for(let i=0;i<count;i++){
    const a=rnd()*Math.PI*2,r=1.25+rnd()*1.35,y=.35+rnd()*4.55;
    positions.push(Math.cos(a)*r,y,(rnd()-.5)*.65);phase.push(rnd()*Math.PI*2);
  }
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const mat=new THREE.PointsMaterial({color:accent,size:.065,transparent:true,opacity:.42,depthWrite:false,blending:THREE.AdditiveBlending});
  const points=new THREE.Points(geo,mat);points.userData.phase=phase;return points;
}

function archFrame(THREE,{accent,kind='arch'}){
  const root=new THREE.Group();
  const metal=material(THREE,0x1b2b34,{metalness:.78,roughness:.24}),dark=material(THREE,0x0c171d,{metalness:.58,roughness:.3});
  const glow=material(THREE,accent,{emissive:accent,emissiveIntensity:1.1,metalness:.32,roughness:.15});
  root.add(box(THREE,5.9,.26,2.4,dark,0,.13,.08));
  root.add(box(THREE,4.8,.12,1.48,metal,0,.33,.05));
  for(const x of[-2.45,2.45]){
    root.add(box(THREE,.48,4.55,.72,metal,x,2.35,0));
    root.add(box(THREE,.18,4.05,.78,glow,x*.94,2.2,.03));
    const cap=cyl(THREE,.34,.42,metal,x,4.63,0,20);cap.rotation.z=Math.PI/2;root.add(cap);
  }
  if(kind==='quantum'){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.18,.2,20,72),glow);ring.scale.y=1.22;ring.position.y=2.55;root.add(ring);root.userData.primaryRing=ring;
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.82,.075,12,64),glow.clone());ring2.material.emissiveIntensity=.72;ring2.scale.y=1.22;ring2.position.y=2.55;ring2.rotation.z=.22;root.add(ring2);root.userData.secondaryRing=ring2;
  }else{
    const arch=new THREE.Mesh(new THREE.TorusGeometry(2.45,.22,18,64,Math.PI),glow);arch.rotation.z=Math.PI;arch.position.y=4.55;root.add(arch);root.userData.primaryRing=arch;
    const inner=new THREE.Mesh(new THREE.TorusGeometry(2.08,.07,12,56,Math.PI),glow.clone());inner.material.emissiveIntensity=.75;inner.rotation.z=Math.PI;inner.position.y=4.48;root.add(inner);root.userData.secondaryRing=inner;
  }
  const crown=box(THREE,2.4,.2,.64,metal,0,5.02,0);root.add(crown);
  for(const x of[-.72,0,.72])root.add(box(THREE,.38,.06,.72,glow,x,5.04,.02));
  setShadow(root,true);return root;
}

function energyLayers(THREE,{accent,kind='arch'}){
  const root=new THREE.Group();
  const width=kind==='quantum'?4.05:4.2,height=kind==='quantum'?5.0:4.1,centerY=kind==='quantum'?2.55:2.35;
  const coreMat=material(THREE,accent,{emissive:accent,emissiveIntensity:.7,metalness:.02,roughness:.08,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});
  const haloMat=basic(THREE,accent,{opacity:.07});
  const veilMat=basic(THREE,accent,{opacity:.035});
  let core,halo,veil;
  if(kind==='quantum'){
    core=new THREE.Mesh(new THREE.CircleGeometry(1.95,64),coreMat);core.scale.y=1.22;
    halo=new THREE.Mesh(new THREE.CircleGeometry(2.18,64),haloMat);halo.scale.y=1.22;
    veil=new THREE.Mesh(new THREE.CircleGeometry(2.32,64),veilMat);veil.scale.y=1.22;
  }else{
    core=new THREE.Mesh(new THREE.PlaneGeometry(width,height),coreMat);
    halo=new THREE.Mesh(new THREE.PlaneGeometry(width+0.5,height+0.45),haloMat);
    veil=new THREE.Mesh(new THREE.PlaneGeometry(width+0.9,height+0.8),veilMat);
  }
  for(const mesh of[core,halo,veil]){mesh.position.set(0,centerY,.05);mesh.renderOrder=4;root.add(mesh);}
  const scanMat=basic(THREE,accent,{opacity:.11});const scans=[];
  for(let i=0;i<5;i++){const scan=box(THREE,width*.82,.025,.025,scanMat.clone(),0,.9+i*.68,.11);scan.castShadow=false;scan.receiveShadow=false;root.add(scan);scans.push(scan);}
  return {root,core,halo,veil,scans};
}

function floorFx(THREE,accent){
  const root=new THREE.Group();
  const ringA=new THREE.Mesh(new THREE.RingGeometry(2.65,2.92,64),basic(THREE,accent,{opacity:.16}));ringA.rotation.x=-Math.PI/2;ringA.position.y=.025;root.add(ringA);
  const ringB=new THREE.Mesh(new THREE.RingGeometry(2.08,2.22,64),basic(THREE,accent,{opacity:.1}));ringB.rotation.x=-Math.PI/2;ringB.position.y=.03;root.add(ringB);
  const disc=new THREE.Mesh(new THREE.CircleGeometry(1.95,64),basic(THREE,accent,{opacity:.028}));disc.rotation.x=-Math.PI/2;disc.position.y=.018;root.add(disc);
  return {root,ringA,ringB,disc};
}

function createPortal(THREE,{zone,layout,spriteLabel,quality,seed}){
  const accent=new THREE.Color(zone.accent).getHex(),kind=layout.portalKind||'arch';
  const group=new THREE.Group();group.name=`portal-v2-${zone.key}`;group.position.set(...layout.portal);group.rotation.y=layout.portalRotation||0;
  const frame=archFrame(THREE,{accent,kind});group.add(frame);
  const energy=energyLayers(THREE,{accent,kind});group.add(energy.root);
  const floor=floorFx(THREE,accent);group.add(floor.root);
  const particles=particleField(THREE,accent,64,seed);group.add(particles);
  const statusOpen=spriteLabel('● PORTAL ABERTO',zone.accent,3.25,{bg:'rgba(5,24,22,.86)'});statusOpen.position.set(0,5.75,.18);group.add(statusOpen);
  const statusClosed=spriteLabel('○ AGUARDANDO',zone.accent,3.25,{bg:'rgba(10,16,21,.9)'});statusClosed.position.copy(statusOpen.position);group.add(statusClosed);
  const title=spriteLabel(`${zone.portal.label} • ${zone.label}`,zone.accent,4.5,{bg:'rgba(4,12,18,.88)'});title.position.set(0,6.45,.16);group.add(title);
  const light=new THREE.PointLight(accent,0,12,2);light.position.set(0,3.2,.7);group.add(light);
  const haloLight=new THREE.PointLight(accent,0,7,2);haloLight.position.set(0,.35,0);group.add(haloLight);
  group.userData={baseY:group.position.y,accent,kind,zoneKey:zone.key};
  const entry={group,zone,pos:new THREE.Vector3(...layout.portal),frame,energy,floor,particles,title,statusOpen,statusClosed,light,haloLight,quality};
  setPortalQuality(entry,quality);return entry;
}

function setPortalQuality(entry,quality){
  entry.quality=quality;const rank=QUALITY_RANK[quality]??1;
  entry.energy.halo.visible=rank>=2;entry.energy.veil.visible=rank>=3;
  entry.particles.visible=rank>=1;
  entry.energy.scans.forEach((s,i)=>s.visible=rank>=2||(rank>=1&&i%2===0));
  entry.light.visible=rank>=2;entry.haloLight.visible=rank>=3;
}

export function createPortalSystem({THREE,scene,zones,layouts,state,spriteLabel,quality='medium'}){
  const entries=new Map();let activeQuality=quality;
  let seed=8143;
  for(const zone of zones){const layout=layouts[zone.key];if(!layout)continue;const entry=createPortal(THREE,{zone,layout,spriteLabel,quality:activeQuality,seed:seed++});scene.add(entry.group);entries.set(zone.key,entry);}
  function setQuality(next){activeQuality=QUALITY_RANK[next]===undefined?activeQuality:next;for(const entry of entries.values())setPortalQuality(entry,activeQuality);}
  function update({time,playerPosition,currentClassCode}){
    const rank=QUALITY_RANK[activeQuality]??1;
    for(const [key,entry] of entries){
      const ps=state.portalState?.(entry.zone)||{open:false},open=!!ps.open;
      const dist=Math.hypot(playerPosition.x-entry.pos.x,playerPosition.z-entry.pos.z);
      const near=clamp(1-(dist-2.15)/8.5,0,1),veryNear=clamp(1-(dist-1.8)/3.5,0,1),own=currentClassCode===entry.zone.code;
      const pulse=.5+.5*Math.sin(time*(open?3.8:1.7)+key.length*.73);
      const energy=open?1:.22;
      entry.energy.core.material.opacity=(open?.16:.035)+near*(open?.18:.055);
      entry.energy.core.material.emissiveIntensity=(open?.9:.2)+near*(open?.9:.24);
      entry.energy.halo.material.opacity=rank>=2?(open?.07:.015)+near*(open?.11:.025):0;
      entry.energy.veil.material.opacity=rank>=3?(open?.035:.008)+near*(open?.065:.015):0;
      const scale=1+(open?.022:.006)*pulse+veryNear*.035;entry.energy.core.scale.x=scale;entry.energy.core.scale.y=(entry.frame.userData.primaryRing?.scale.y||1)*scale;
      if(entry.frame.userData.primaryRing)entry.frame.userData.primaryRing.rotation.z+=(open?.006:.0015)*(1+near*1.8);
      if(entry.frame.userData.secondaryRing)entry.frame.userData.secondaryRing.rotation.z-=(open?.009:.002)*(1+near*1.8);
      entry.floor.ringA.rotation.z=time*(open?.16:.05);entry.floor.ringB.rotation.z=-time*(open?.23:.07);
      entry.floor.ringA.material.opacity=(open?.12:.035)+near*(open?.22:.07);entry.floor.ringB.material.opacity=(open?.08:.025)+near*(open?.16:.05);entry.floor.disc.material.opacity=(open?.025:.008)+near*(open?.055:.016);
      entry.particles.rotation.y=time*(open?.24:.08);entry.particles.material.opacity=rank>=1?((open?.34:.07)+near*(open?.38:.11)):0;entry.particles.material.size=(open?.065:.045)+near*.025;
      entry.energy.scans.forEach((scan,i)=>{scan.position.y=.9+((time*(open?.85:.25)+i*.68)%3.45);scan.material.opacity=(open?.07:.018)+near*(open?.12:.035);});
      entry.light.intensity=rank>=2?(open?5.5:0.5)+(near*(open?10:1.8))*energy:0;
      entry.haloLight.intensity=rank>=3?(open?1.8:0.1)+near*(open?5.5:.7):0;
      entry.statusOpen.visible=open&&(own||dist<13);entry.statusClosed.visible=!open&&(own||dist<10.5);
      entry.title.visible=own||dist<18;entry.title.material.opacity=own?.98:clamp((18-dist)/8,.25,.9);
      const bob=Math.sin(time*1.4+key.length)*.014;entry.group.position.y=entry.group.userData.baseY+bob;
    }
  }
  return {entries,setQuality,update,getEntries:()=>entries,dispose(){for(const entry of entries.values())scene.remove(entry.group);entries.clear();}};
}

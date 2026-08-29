const MODEL_URL=new URL('./models/agv-avatar-rig-v1.glb',import.meta.url);
let cachePromise=null;
const comp={5126:{Ctor:Float32Array,bytes:4},5123:{Ctor:Uint16Array,bytes:2},5125:{Ctor:Uint32Array,bytes:4},5121:{Ctor:Uint8Array,bytes:1}};
const comps={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};

function parseGLB(buffer){
  const dv=new DataView(buffer);if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw new Error('GLB inválido');
  let off=12,json=null,bin=null;while(off<buffer.byteLength){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true),start=off+8;if(type===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,start,len)).trim());else if(type===0x004e4942)bin=buffer.slice(start,start+len);off=start+len;}
  if(!json||!bin)throw new Error('GLB incompleto');return{json,bin};
}
function readAccessor(asset,index){
  const a=asset.json.accessors[index],bv=asset.json.bufferViews[a.bufferView],info=comp[a.componentType];if(!info)throw new Error(`Componente GLB não suportado: ${a.componentType}`);
  const n=comps[a.type],byteOffset=(bv.byteOffset||0)+(a.byteOffset||0),stride=bv.byteStride||n*info.bytes,count=a.count;
  if(stride===n*info.bytes)return new info.Ctor(asset.bin,byteOffset,count*n);
  const out=new info.Ctor(count*n),src=new DataView(asset.bin);for(let i=0;i<count;i++)for(let j=0;j<n;j++){const p=byteOffset+i*stride+j*info.bytes;out[i*n+j]=a.componentType===5126?src.getFloat32(p,true):a.componentType===5125?src.getUint32(p,true):a.componentType===5123?src.getUint16(p,true):src.getUint8(p);}return out;
}
function materialColor(THREE,kind,accent,staff,seed,appearance=null){
  const skinPalette=[0xf0c09c,0xd99b72,0xb97753,0x8e5b42,0x6d4330];let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}const skin=appearance?.skin??skinPalette[(h>>>0)%skinPalette.length];
  if(kind==='Skin')return new THREE.MeshStandardMaterial({color:skin,roughness:.72});
  if(kind==='Shirt'){const m=new THREE.MeshStandardMaterial({color:appearance?.accent??accent,roughness:.48,metalness:.07});if(staff){m.emissive=new THREE.Color(appearance?.accent??accent);m.emissiveIntensity=.12;}return m;}
  if(kind==='Pants')return new THREE.MeshStandardMaterial({color:appearance?.pants??0x18212b,roughness:.78});
  return new THREE.MeshStandardMaterial({color:appearance?.shoes??0x080c10,roughness:.5});
}
function makeGeometry(THREE,asset,primitive){
  const g=new THREE.BufferGeometry();for(const [semantic,idx] of Object.entries(primitive.attributes||{})){const a=asset.json.accessors[idx],arr=readAccessor(asset,idx);if(semantic==='POSITION')g.setAttribute('position',new THREE.BufferAttribute(arr,3));else if(semantic==='NORMAL')g.setAttribute('normal',new THREE.BufferAttribute(arr,3));else if(semantic==='JOINTS_0')g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(arr,4));else if(semantic==='WEIGHTS_0')g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(arr,4));}
  if(primitive.indices!=null){const a=asset.json.accessors[primitive.indices],arr=readAccessor(asset,primitive.indices);g.setIndex(new THREE.BufferAttribute(arr,1));}g.computeBoundingSphere();return g;
}
function buildBones(THREE,json){
  const bones=json.skins[0].joints.map(i=>{const n=json.nodes[i],b=new THREE.Bone();b.name=n.name||`Bone${i}`;if(n.translation)b.position.fromArray(n.translation);if(n.rotation)b.quaternion.fromArray(n.rotation);if(n.scale)b.scale.fromArray(n.scale);return b;});const map=new Map(json.skins[0].joints.map((nodeIndex,i)=>[nodeIndex,i]));
  for(const nodeIndex of json.skins[0].joints){const node=json.nodes[nodeIndex],parent=bones[map.get(nodeIndex)];for(const childIndex of node.children||[])if(map.has(childIndex))parent.add(bones[map.get(childIndex)]);}return bones;
}
function clipsFromAsset(THREE,asset){
  return (asset.json.animations||[]).map(anim=>{const tracks=[];for(const ch of anim.channels){const s=anim.samplers[ch.sampler],times=Float32Array.from(readAccessor(asset,s.input)),values=Float32Array.from(readAccessor(asset,s.output)),name=asset.json.nodes[ch.target.node]?.name||`Bone${ch.target.node}`;if(ch.target.path==='rotation')tracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,times,values));else if(ch.target.path==='translation')tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`,times,values));}return new THREE.AnimationClip(anim.name||'Clip',-1,tracks);});
}
export async function loadRiggedAvatarAsset(THREE,{timeout=3500}={}){
  if(cachePromise)return cachePromise;cachePromise=(async()=>{const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeout);try{const res=await fetch(MODEL_URL,{cache:'force-cache',signal:ctl.signal});if(!res.ok)throw new Error(`GLB HTTP ${res.status}`);const parsed=parseGLB(await res.arrayBuffer());parsed.clips=clipsFromAsset(THREE,parsed);return parsed;}finally{clearTimeout(timer);}})().catch(e=>{cachePromise=null;throw e;});return cachePromise;
}
export function createRiggedAvatar(THREE,asset,{accent='#36d2ff',staff=false,seed='agv',appearance=null}={}){
  const root=new THREE.Group();root.name=`RiggedAvatar-${String(seed).slice(0,8)}`;const bones=buildBones(THREE,asset.json),jointNodes=asset.json.skins[0].joints,rootJointIndex=jointNodes.indexOf(asset.json.skins[0].skeleton??jointNodes[0]);root.add(bones[rootJointIndex<0?0:rootJointIndex]);
  const invRaw=readAccessor(asset,asset.json.skins[0].inverseBindMatrices),inverses=[];for(let i=0;i<jointNodes.length;i++){const m=new THREE.Matrix4();m.fromArray(invRaw,i*16);inverses.push(m);}const skeleton=new THREE.Skeleton(bones,inverses),meshDef=asset.json.meshes[0],meshes=[];
  for(const primitive of meshDef.primitives){const matName=asset.json.materials?.[primitive.material]?.name||'Shirt',g=makeGeometry(THREE,asset,primitive),m=materialColor(THREE,matName,accent,staff,seed,appearance),sk=new THREE.SkinnedMesh(g,m);sk.name=`AGV-${matName}`;sk.castShadow=true;sk.receiveShadow=true;sk.bind(skeleton,new THREE.Matrix4());root.add(sk);meshes.push(sk);}root.scale.setScalar(.92);
  const mixer=new THREE.AnimationMixer(root),actions={};for(const clip of asset.clips){const action=mixer.clipAction(clip);action.enabled=true;if(clip.name==='Jump'||clip.name==='Wave'){action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;}actions[clip.name]=action;}actions.Idle?.play();root.userData.rig={mixer,actions,current:'Idle',oneshot:null,meshes,bones,appearance};return root;
}
function crossFade(rig,next,fade=.14){if(!rig.actions[next]||rig.current===next)return;const prev=rig.actions[rig.current],n=rig.actions[next];n.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();prev?.crossFadeTo(n,fade,true);rig.current=next;}
export function updateRiggedAvatar(avatar,{speed=0,jump=0,dt=.016,emoteKind=null,emoteActive=false,localAction=null,time=0}={}){
  const rig=avatar.userData.rig;if(!rig)return false;rig.mixer.update(dt);
  const bone=name=>rig.bones.find(b=>b.name===name);
  const pose=()=>{
    const la=bone('LeftArm'),ra=bone('RightArm'),ll=bone('LeftLeg'),rl=bone('RightLeg'),hips=bone('Hips'),torso=bone('Torso');
    if(localAction==='dance'){const beat=Math.sin(time*6);if(la){la.rotation.z+=.75;la.rotation.x+=beat*.45}if(ra){ra.rotation.z-=.75;ra.rotation.x-=beat*.45}if(hips)hips.rotation.y+=beat*.18;if(torso)torso.rotation.z+=Math.sin(time*3)*.12;}
    else if(localAction==='cheer'){if(la){la.rotation.x-=1.7;la.rotation.z+=.25}if(ra){ra.rotation.x-=1.7;ra.rotation.z-=.25}if(torso)torso.rotation.x-=.08;}
    else if(localAction==='crouch'){if(hips)hips.position.y-=.42;if(ll)ll.rotation.x-=.72;if(rl)rl.rotation.x-=.72;if(torso)torso.rotation.x+=.18;}
    else if(localAction==='sit'){if(hips)hips.position.y-=.72;if(ll)ll.rotation.x-=1.15;if(rl)rl.rotation.x-=1.15;if(torso)torso.rotation.x+=.08;}
  };
if(emoteActive&&emoteKind==='wave'){if(rig.oneshot!=='Wave'){const a=rig.actions.Wave;if(a){a.reset().play();rig.oneshot='Wave';a.getMixer().addEventListener?.('finished',()=>{});}}pose();return true;}if(rig.oneshot==='Wave'){const a=rig.actions.Wave;if(a?.isRunning?.())return true;rig.oneshot=null;}
  const next=jump>.02?'Jump':speed>4.4?'Run':speed>.3?'Walk':'Idle';if(next==='Jump'){if(rig.oneshot!=='Jump'){rig.actions.Jump?.reset().play();rig.oneshot='Jump';}pose();return true;}if(rig.oneshot==='Jump'&&jump<=.02)rig.oneshot=null;crossFade(rig,next,next==='Run'?.1:.16);pose();return true;
}
export function disposeRiggedAvatar(root){const rig=root?.userData?.rig;rig?.mixer?.stopAllAction?.();for(const mesh of rig?.meshes||[]){mesh.geometry?.dispose?.();mesh.material?.dispose?.();}}

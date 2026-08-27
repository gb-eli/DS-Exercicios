const THREE_URL='../vendor/three/three.module.min.js';
const CHUNK=12;
const HEIGHT=36;
const TILES=9;
const MAX_EDITS=15000;
const PLAYER_RADIUS=.28;
const STAND_EYE=1.62;
const CROUCH_EYE=1.14;

export async function startGame({
  quality='medium',mode='learning',fov=78,sensitivity=1,selected,saved,
  onCollect=()=>{},onInventoryChange=()=>{},onHud=()=>{},onProgress=()=>{},onStatus=()=>{}
}){
  onStatus({loading:true,title:'Carregando o renderizador 3D...',message:'Validando Three.js, WebGL e capacidade gráfica.'});
  let THREE;
  try{THREE=await import(THREE_URL);}catch{throw new Error('O renderizador 3D local não pôde ser carregado. Confirme a pasta vendor/three e republique o pacote completo.');}
  const host=document.getElementById('game3d');
  if(!host)throw new Error('Área de renderização não encontrada.');
  const probe=document.createElement('canvas');
  let probeContext=null;
  try{probeContext=probe.getContext('webgl2',{failIfMajorPerformanceCaveat:true})||probe.getContext('webgl',{failIfMajorPerformanceCaveat:true});}catch{}
  if(!probeContext&&!window.WebGLRenderingContext&&!window.WebGL2RenderingContext)throw new Error('Este navegador ou aparelho não oferece WebGL para executar o mundo 3D.');

  const mobile=(typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches);
  const presets={
    economy:{view:1,pixel:.48,shadow:false,animals:0,trees:5,grass:0,clouds:0,queuePerFrame:1,fog:.045,warm:1},
    low:{view:2,pixel:.62,shadow:false,animals:3,trees:10,grass:0,clouds:3,queuePerFrame:1,fog:.032,warm:3},
    medium:{view:3,pixel:.82,shadow:false,animals:6,trees:22,grass:100,clouds:6,queuePerFrame:1,fog:.023,warm:5},
    high:{view:5,pixel:Math.min(devicePixelRatio,1.25),shadow:true,animals:12,trees:45,grass:350,clouds:12,queuePerFrame:2,fog:.014,warm:5},
    ultra:{view:8,pixel:Math.min(devicePixelRatio,2),shadow:true,animals:28,trees:110,grass:1200,clouds:28,queuePerFrame:3,fog:.007,warm:9}
  };
  const cfg={...(presets[quality]||presets.medium)};
  if(mobile){cfg.view=Math.min(cfg.view,4);cfg.pixel=Math.min(cfg.pixel,1);cfg.animals=Math.min(cfg.animals,8);cfg.trees=Math.min(cfg.trees,30);cfg.grass=Math.min(cfg.grass,160);cfg.clouds=Math.min(cfg.clouds,8);cfg.queuePerFrame=1;cfg.warm=Math.min(cfg.warm,5);}

  const scene=new THREE.Scene();const skyDay=new THREE.Color(0x91d7ff),skyDusk=new THREE.Color(0x6f8ec6),fogDay=new THREE.Color(0x91d7ff),fogDusk=new THREE.Color(0x8298b4);scene.background=skyDay.clone();scene.fog=new THREE.FogExp2(fogDay.clone(),cfg.fog);
  const size=()=>({width:Math.max(1,host.clientWidth||innerWidth),height:Math.max(1,host.clientHeight||innerHeight)});
  const initial=size();
  const camera=new THREE.PerspectiveCamera(fov,initial.width/initial.height,.08,360);
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({antialias:!['low','economy'].includes(quality),powerPreference:quality==='ultra'?'high-performance':'default'});
  }catch(error){throw new Error(`A GPU não conseguiu criar o contexto WebGL (${error?.message||'falha desconhecida'}).`);}
  renderer.setPixelRatio(cfg.pixel);renderer.setSize(initial.width,initial.height,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=cfg.shadow;
  if(cfg.shadow)renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.tabIndex=0;host.replaceChildren(renderer.domElement);

  const hemi=new THREE.HemisphereLight(0xdaf3ff,0x334727,2.1);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff1cf,3);sun.position.set(35,60,24);sun.castShadow=cfg.shadow;
  let skySun=null;if(!['economy','low'].includes(quality)){const sunMat=new THREE.MeshBasicMaterial({color:0xffe7a8,transparent:true,opacity:.9,fog:false}),sunGeo=new THREE.SphereGeometry(2.8,quality==='ultra'?24:12,quality==='ultra'?16:8);skySun=new THREE.Mesh(sunGeo,sunMat);scene.add(skySun);}
  if(cfg.shadow){const shadowSize=Math.min(quality==='ultra'?4096:2048,renderer.capabilities.maxTextureSize||2048);sun.shadow.mapSize.set(shadowSize,shadowSize);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;}
  scene.add(sun);

  const atlas=document.createElement('canvas');atlas.width=288;atlas.height=32;const atlasCtx=atlas.getContext('2d');
  const tileColors=['#5fae52','#78543a','#70787f','#8b5a2b','#3e8b45','#d9c27a','#f06529','#2965f1','#f0db4f'];
  tileColors.forEach((color,index)=>{const gradient=atlasCtx.createLinearGradient(index*32,0,index*32+32,32);gradient.addColorStop(0,color);gradient.addColorStop(1,'#26333a');atlasCtx.fillStyle=gradient;atlasCtx.fillRect(index*32,0,32,32);const noise=quality==='ultra'?90:quality==='high'?55:25;for(let n=0;n<noise;n++){atlasCtx.fillStyle=`rgba(${Math.random()>.5?'255,255,255':'0,0,0'},${.03+Math.random()*.15})`;atlasCtx.fillRect(index*32+Math.random()*31,Math.random()*31,1+Math.random()*3,1+Math.random()*3);}});
  const texture=new THREE.CanvasTexture(atlas);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;

  const edits=new Map(Array.isArray(saved?.edits)?saved.edits.slice(0,MAX_EDITS):[]),chunks=new Map(),queue=[];
  const type={grass:0,dirt:1,stone:2,wood:3,leaves:4,sand:5,html:6,css:7,javascript:8};
  const key3=(x,y,z)=>`${x},${y},${z}`,chunkKey=(cx,cz)=>`${cx},${cz}`;
  const terrainHeight=(x,z)=>Math.floor(5+Math.sin(x*.08)*5+Math.cos(z*.07)*4+Math.sin((x+z)*.035)*8+Math.cos(Math.hypot(x,z)*.035)*4);
  const isCave=(x,y,z)=>y<8&&Math.sin(x*.31+y*.51)*Math.cos(z*.29-y*.22)>.68;
  function block(x,y,z){const key=key3(x,y,z);if(edits.has(key))return edits.get(key);const top=terrainHeight(x,z);if(y>top||y<-7||isCave(x,y,z))return null;if(y===top)return top<1?type.sand:type.grass;if(y>top-4)return type.dirt;return type.stone;}
  function uv(tile,u,v){const step=1/TILES;return[tile*step+u*step,v];}
  function addQuad(buffer,origin,du,dv,tile,flip){const base=buffer.positions.length/3;const points=[origin,[origin[0]+du[0],origin[1]+du[1],origin[2]+du[2]],[origin[0]+du[0]+dv[0],origin[1]+du[1]+dv[1],origin[2]+du[2]+dv[2]],[origin[0]+dv[0],origin[1]+dv[1],origin[2]+dv[2]]];points.forEach(point=>buffer.positions.push(...point));buffer.uvs.push(...uv(tile,0,1),...uv(tile,1,1),...uv(tile,1,0),...uv(tile,0,0));if(flip)buffer.indices.push(base,base+2,base+1,base,base+3,base+2);else buffer.indices.push(base,base+1,base+2,base,base+2,base+3);}
  function meshChunk(cx,cz){
    const dims=[CHUNK,HEIGHT+8,CHUNK],offset=[cx*CHUNK,-7,cz*CHUNK],buffer={positions:[],uvs:[],indices:[]};
    for(let axis=0;axis<3;axis++){
      const u=(axis+1)%3,v=(axis+2)%3,x=[0,0,0],q=[0,0,0];q[axis]=1;const mask=new Array(dims[u]*dims[v]);
      for(x[axis]=-1;x[axis]<dims[axis];){
        let n=0;
        for(x[v]=0;x[v]<dims[v];x[v]++)for(x[u]=0;x[u]<dims[u];x[u]++){
          const a=x[axis]>=0?block(offset[0]+x[0],offset[1]+x[1],offset[2]+x[2]):null;
          const b=x[axis]<dims[axis]-1?block(offset[0]+x[0]+q[0],offset[1]+x[1]+q[1],offset[2]+x[2]+q[2]):null;
          mask[n++]=(a!==null&&b===null)?{t:a,back:false}:(b!==null&&a===null)?{t:b,back:true}:null;
        }
        x[axis]++;n=0;
        for(let j=0;j<dims[v];j++)for(let i=0;i<dims[u];){
          const cell=mask[n];if(!cell){i++;n++;continue;}
          let width=1;while(i+width<dims[u]){const next=mask[n+width];if(!next||next.t!==cell.t||next.back!==cell.back)break;width++;}
          let height=1;outer:for(;j+height<dims[v];height++)for(let k=0;k<width;k++){const next=mask[n+k+height*dims[u]];if(!next||next.t!==cell.t||next.back!==cell.back)break outer;}
          x[u]=i;x[v]=j;const origin=[offset[0]+x[0],offset[1]+x[1],offset[2]+x[2]],du=[0,0,0],dv=[0,0,0];du[u]=width;dv[v]=height;
          if(cell.back)addQuad(buffer,origin,dv,du,cell.t,true);else addQuad(buffer,origin,du,dv,cell.t,false);
          for(let row=0;row<height;row++)for(let col=0;col<width;col++)mask[n+col+row*dims[u]]=null;
          i+=width;n+=width;
        }
      }
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(buffer.positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(buffer.uvs,2));geometry.setIndex(buffer.indices);geometry.computeVertexNormals();return geometry;
  }
  const terrainMaterial=new THREE.MeshStandardMaterial({map:texture,roughness:.9});
  function buildChunk(cx,cz){const key=chunkKey(cx,cz);if(chunks.has(key))return;const geometry=meshChunk(cx,cz);const mesh=new THREE.Mesh(geometry,terrainMaterial);mesh.castShadow=cfg.shadow;mesh.receiveShadow=cfg.shadow;mesh.userData.chunk={cx,cz};scene.add(mesh);chunks.set(key,mesh);}
  function removeChunk(cx,cz){const key=chunkKey(cx,cz),mesh=chunks.get(key);if(!mesh)return;scene.remove(mesh);mesh.geometry.dispose();chunks.delete(key);}
  let playerChunk={x:0,z:0};
  function enqueueAround(x,z){
    const pcx=Math.floor(x/CHUNK),pcz=Math.floor(z/CHUNK);playerChunk={x:pcx,z:pcz};const wanted=[];
    for(let cx=pcx-cfg.view;cx<=pcx+cfg.view;cx++)for(let cz=pcz-cfg.view;cz<=pcz+cfg.view;cz++){const key=chunkKey(cx,cz);if(!chunks.has(key))wanted.push({cx,cz,d:(cx-pcx)**2+(cz-pcz)**2});}
    wanted.sort((a,b)=>a.d-b.d);queue.splice(0,queue.length,...wanted);
    for(const [key] of chunks){const [cx,cz]=key.split(',').map(Number);if(Math.abs(cx-pcx)>cfg.view+1||Math.abs(cz-pcz)>cfg.view+1)removeChunk(cx,cz);}
  }
  function processQueue(){for(let i=0;i<cfg.queuePerFrame;i++){const next=queue.shift();if(!next)break;if(Math.abs(next.cx-playerChunk.x)<=cfg.view&&Math.abs(next.cz-playerChunk.z)<=cfg.view)buildChunk(next.cx,next.cz);}}
  function rebuildAffected(x,z){
    const cx=Math.floor(x/CHUNK),cz=Math.floor(z/CHUNK),localX=((x%CHUNK)+CHUNK)%CHUNK,localZ=((z%CHUNK)+CHUNK)%CHUNK;
    const targets=[[cx,cz]];if(localX===0)targets.push([cx-1,cz]);if(localX===CHUNK-1)targets.push([cx+1,cz]);if(localZ===0)targets.push([cx,cz-1]);if(localZ===CHUNK-1)targets.push([cx,cz+1]);
    for(const [tx,tz] of targets){if(chunks.has(chunkKey(tx,tz))){removeChunk(tx,tz);buildChunk(tx,tz);}}
  }

  function isSolidCell(x,y,z){return block(Math.floor(x),Math.floor(y),Math.floor(z))!==null;}
  function columnSurface(x,z){for(let y=HEIGHT;y>=-8;y--)if(block(Math.floor(x),y,Math.floor(z))!==null)return y+1;return-7;}
  function canOccupy(x,eyeY,z,crouched=false){
    const feet=eyeY-(crouched?CROUCH_EYE:STAND_EYE)+.05,head=eyeY+.06;
    for(const sx of [-PLAYER_RADIUS,PLAYER_RADIUS])for(const sz of [-PLAYER_RADIUS,PLAYER_RADIUS]){
      if(isSolidCell(x+sx,feet,z+sz)||isSolidCell(x+sx,feet+.72,z+sz)||isSolidCell(x+sx,head,z+sz))return false;
    }
    return true;
  }
  function safeSpawn(x,z){
    for(let radius=0;radius<=12;radius++)for(let dx=-radius;dx<=radius;dx++)for(const dz of radius===0?[0]:[-radius,radius]){
      const px=x+dx,pz=z+dz,surface=columnSurface(px,pz),eye=surface+STAND_EYE;
      if(surface>.5&&canOccupy(px,eye,pz,false))return{x:px,y:eye,z:pz};
    }
    return{x:0,y:columnSurface(0,5)+STAND_EYE,z:5};
  }

  const savedPlayer=saved?.player||{},savedStats=saved?.stats||{};
  const requested={x:Number.isFinite(Number(savedPlayer.x))?Number(savedPlayer.x):0,z:Number.isFinite(Number(savedPlayer.z))?Number(savedPlayer.z):5};
  const fallback=safeSpawn(requested.x,requested.z);
  const savedY=Number(savedPlayer.y);
  const validSavedY=Number.isFinite(savedY)&&canOccupy(requested.x,savedY,requested.z,false)&&savedY>columnSurface(requested.x,requested.z)-.2;
  const player={
    pos:new THREE.Vector3(requested.x,validSavedY?savedY:fallback.y,requested.z),vy:0,
    yaw:Number.isFinite(Number(savedPlayer.yaw))?Number(savedPlayer.yaw):0,
    pitch:Number.isFinite(Number(savedPlayer.pitch))?Math.max(-1.4,Math.min(1.4,Number(savedPlayer.pitch))):-.12,
    onGround:false,health:Number.isFinite(savedPlayer.health)?savedPlayer.health:100,hunger:Number.isFinite(savedPlayer.hunger)?savedPlayer.hunger:100,
    camera:savedPlayer.camera==='third'?'third':'first',crouched:false
  };
  const stats={xp:Number(savedStats.xp)||0,broken:Number(savedStats.broken)||0,placed:Number(savedStats.placed)||0,distance:Number(savedStats.distance)||0,collected:Number(savedStats.collected)||0,completed:Boolean(savedStats.completed),chapter:Math.max(1,Math.min(3,Number(savedStats.chapter)||1)),chaptersCompleted:Math.max(0,Math.min(3,Number(savedStats.chaptersCompleted)||0))};
  let lastDistancePos=player.pos.clone(),lastSafePos=player.pos.clone();
  enqueueAround(player.pos.x,player.pos.z);
  onStatus({loading:true,title:'Criando os primeiros chunks...',message:'Montando terreno, colisões e inventário.'});
  const warmOffsets=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].slice(0,cfg.warm);
  for(const [dx,dz] of warmOffsets)buildChunk(playerChunk.x+dx,playerChunk.z+dz);

  const avatar=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(.65,1,.38),new THREE.MeshStandardMaterial({color:0x3b8bd8}));const head=new THREE.Mesh(new THREE.BoxGeometry(.58,.58,.58),new THREE.MeshStandardMaterial({color:0xf0c8a0}));body.position.y=.65;head.position.y=1.42;avatar.add(body,head);scene.add(avatar);
  const deterministic=(index,salt=0)=>{const value=Math.sin((index+1)*12.9898+salt*78.233)*43758.5453;return value-Math.floor(value);};
  const animals=[];for(let i=0;i<cfg.animals;i++){const group=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:i%3===0?0xf1f1f1:i%3===1?0xb9875f:0x9b7653}),animalBody=new THREE.Mesh(new THREE.BoxGeometry(1,.65,.5),mat),animalHead=new THREE.Mesh(new THREE.BoxGeometry(.48,.48,.48),mat);animalHead.position.set(.65,.15,0);group.add(animalBody,animalHead);group.userData={dir:deterministic(i,1)*Math.PI*2};const x=(deterministic(i,2)-.5)*100,z=(deterministic(i,3)-.5)*100;group.position.set(x,columnSurface(x,z)+.7,z);scene.add(group);animals.push(group);}
  const treePositions=[];
  if(cfg.trees){const trunkMaterial=new THREE.MeshStandardMaterial({color:0x7a4b24}),leafMaterial=new THREE.MeshStandardMaterial({color:0x397c42});for(let i=0;i<cfg.trees;i++){const x=(deterministic(i,4)-.5)*180,z=(deterministic(i,5)-.5)*180;if(Math.hypot(x-player.pos.x,z-player.pos.z)<7)continue;const y=columnSurface(x,z);if(y<2)continue;const trunk=new THREE.Mesh(new THREE.BoxGeometry(.8,3,.8),trunkMaterial),leaf=new THREE.Mesh(new THREE.BoxGeometry(3,2.4,3),leafMaterial);trunk.position.set(x,y+1.5,z);leaf.position.set(x,y+3.5,z);treePositions.push({x,z,y});trunk.castShadow=leaf.castShadow=cfg.shadow;scene.add(trunk,leaf);}}
  if(cfg.grass){const grassMaterial=new THREE.MeshBasicMaterial({color:0x58a94f,side:THREE.DoubleSide});for(let i=0;i<cfg.grass;i++){const x=(deterministic(i,6)-.5)*170,z=(deterministic(i,7)-.5)*170,y=columnSurface(x,z)+.32;const blade=new THREE.Mesh(new THREE.PlaneGeometry(.12,.65),grassMaterial);blade.position.set(x,y,z);blade.rotation.y=deterministic(i,8)*Math.PI;scene.add(blade);}}
  const clouds=[];
  if(cfg.clouds){const cloudMaterial=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.85,roughness:1});for(let i=0;i<cfg.clouds;i++){const cloud=new THREE.Mesh(new THREE.BoxGeometry(6+deterministic(i,9)*8,1.2,3+deterministic(i,10)*5),cloudMaterial);cloud.position.set((deterministic(i,11)-.5)*180,24+deterministic(i,12)*18,(deterministic(i,13)-.5)*180);cloud.userData.speed=.35+deterministic(i,14)*.55;clouds.push(cloud);scene.add(cloud);}}
  const waterMaterial=new THREE.MeshPhysicalMaterial({color:0x318dcc,transparent:true,opacity:quality==='ultra'?.72:.6,roughness:quality==='ultra'?.12:.28,metalness:.08,depthWrite:false});
  const water=new THREE.Mesh(new THREE.PlaneGeometry(420,420),waterMaterial);water.rotation.x=-Math.PI/2;water.position.y=.18;water.receiveShadow=cfg.shadow;scene.add(water);
  const selection=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.012,1.012,1.012)),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.9}));selection.visible=false;scene.add(selection);

  let current=selected,paused=false,running=true,last=performance.now(),fps=0,frames=0,fpsAt=last,chunkTimer=0,hudTimer=0,progressTimer=0,animationId=0,coyote=0,jumpBuffer=0,lastCompleted=stats.completed;
  const keys={};
  const keyDown=event=>{const key=event.key.toLowerCase();keys[key]=true;if(key==='f'){consumeItem();event.preventDefault();}if(key==='q'){breakBlock();event.preventDefault();}if(key==='e'){placeBlock();event.preventDefault();}if(key==='v'){toggleCamera();event.preventDefault();}if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){if(key===' ')jumpBuffer=.14;event.preventDefault();}};
  const keyUp=event=>{keys[event.key.toLowerCase()]=false;};
  const mouseMove=event=>{if(document.pointerLockElement!==renderer.domElement||paused)return;player.yaw-=event.movementX*.0024*sensitivity;player.pitch=Math.max(-1.4,Math.min(1.4,player.pitch-event.movementY*.0024*sensitivity));};
  const requestLock=()=>{if(mobile||paused||document.pointerLockElement===renderer.domElement)return;try{renderer.domElement.requestPointerLock?.();}catch{onStatus({type:'pointer-lock-denied'});}};
  const pointerLockError=()=>onStatus({type:'pointer-lock-denied'});
  addEventListener('keydown',keyDown);addEventListener('keyup',keyUp);document.addEventListener('mousemove',mouseMove);document.addEventListener('pointerlockerror',pointerLockError);

  const moveJoy={x:0,y:0},lookJoy={x:0,y:0},joystickCleanups=[];
  function bindJoystick(id,target){const root=document.getElementById(id);if(!root)return()=>{};const stick=root.querySelector('.stick');let active=null;const update=event=>{const rect=root.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),max=Math.max(1,rect.width*.32),length=Math.hypot(dx,dy)||1,scale=Math.min(1,max/length),x=dx*scale,y=dy*scale;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;target.x=x/max;target.y=y/max;};const down=event=>{active=event.pointerId;root.setPointerCapture?.(active);update(event);event.preventDefault();};const move=event=>{if(event.pointerId===active){update(event);event.preventDefault();}};const end=event=>{if(event.pointerId!==active)return;active=null;target.x=target.y=0;stick.style.transform='translate(-50%,-50%)';};root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);return()=>{root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',end);root.removeEventListener('pointercancel',end);};}
  joystickCleanups.push(bindJoystick('moveJoystick',moveJoy),bindJoystick('lookJoystick',lookJoy));

  const raycaster=new THREE.Raycaster();raycaster.far=7;
  function targetBlock(place=false){raycaster.setFromCamera(new THREE.Vector2(0,0),camera);const hit=raycaster.intersectObjects([...chunks.values()],false)[0];if(!hit||!hit.face)return null;const point=hit.point.clone().add(hit.face.normal.clone().multiplyScalar(place?.01:-.01));return{x:Math.floor(point.x),y:Math.floor(point.y),z:Math.floor(point.z)};}
  const resourceForType=value=>value===type.wood?'Madeira':value===type.stone?'Pedra':value===type.dirt?'CSS':value===type.sand?'JavaScript':'HTML';
  const blockForItem=item=>item?.name==='CSS'?type.css:item?.name==='JavaScript'?type.javascript:item?.name==='Madeira'?type.wood:item?.name==='Pedra'?type.stone:type.html;
  function editAllowed(){if(edits.size<MAX_EDITS)return true;onStatus({type:'edit-limit'});return false;}
  function blockIntersectsPlayer(target){const feet=player.pos.y-(player.crouched?CROUCH_EYE:STAND_EYE);return target.x<player.pos.x+PLAYER_RADIUS&&target.x+1>player.pos.x-PLAYER_RADIUS&&target.z<player.pos.z+PLAYER_RADIUS&&target.z+1>player.pos.z-PLAYER_RADIUS&&target.y<player.pos.y+.12&&target.y+1>feet;}
  function breakBlock(){if(paused)return false;const target=targetBlock(false);if(!target)return false;const old=block(target.x,target.y,target.z);if(old===null||!editAllowed())return false;edits.set(key3(target.x,target.y,target.z),null);stats.broken++;stats.collected++;stats.xp+=mode==='challenge'?8:4;onCollect(resourceForType(old),1);rebuildAffected(target.x,target.z);emitProgress(true);return true;}
  function consumeItem(){if(paused||current?.name!=='Maçã'||current.count<=0)return false;current.count--;player.hunger=Math.min(100,player.hunger+32);player.health=Math.min(100,player.health+6);stats.collected++;onInventoryChange();onProgress({...missionData(),xp:stats.xp,lesson:'Consumir é uma ação separada de construir. A maçã restaura energia e não cria blocos.',code:'inventory.apple--; player.hunger += 32;'});return true;}
  function placeBlock(){if(paused)return false;if(current?.name==='Maçã')return consumeItem();const target=targetBlock(true);if(!target||!current||current.count<=0||block(target.x,target.y,target.z)!==null||blockIntersectsPlayer(target)||!editAllowed())return false;edits.set(key3(target.x,target.y,target.z),blockForItem(current));current.count--;onInventoryChange();stats.placed++;stats.xp+=mode==='challenge'?10:5;rebuildAffected(target.x,target.z);emitProgress(true);return true;}
  const mouseDown=event=>{if(paused)return;if(!mobile&&document.pointerLockElement!==renderer.domElement){requestLock();event.preventDefault();return;}if(event.button===0)breakBlock();if(event.button===2)placeBlock();};
  const contextMenu=event=>event.preventDefault();renderer.domElement.addEventListener('mousedown',mouseDown);renderer.domElement.addEventListener('contextmenu',contextMenu);renderer.domElement.addEventListener('click',requestLock);
  const actionHandlers=[];document.querySelectorAll('[data-action]').forEach(button=>{const handler=event=>{event.preventDefault();const action=button.dataset.action;if(action==='jump')jumpBuffer=.16;if(action==='crouch')player.crouched=!player.crouched;if(action==='primary')breakBlock();if(action==='secondary')placeBlock();if(action==='consume')consumeItem();};button.addEventListener('pointerdown',handler);actionHandlers.push([button,handler]);});

  const gamepadEdges={};
  function readGamepad(delta){
    const pad=navigator.getGamepads?.().find(Boolean);if(!pad)return{forward:0,strafe:0};
    const dead=value=>Math.abs(value)<.16?0:value;
    const strafe=dead(pad.axes[0]||0),forward=-dead(pad.axes[1]||0),lookX=dead(pad.axes[2]||0),lookY=dead(pad.axes[3]||0);
    player.yaw-=lookX*delta*2.8*sensitivity;player.pitch=Math.max(-1.4,Math.min(1.4,player.pitch-lookY*delta*2.2*sensitivity));
    const pressed=index=>Boolean(pad.buttons[index]?.pressed);
    const edge=(name,index,action)=>{const now=pressed(index);if(now&&!gamepadEdges[name])action();gamepadEdges[name]=now;};
    edge('jump',0,()=>{jumpBuffer=.16;});edge('camera',3,toggleCamera);edge('break',7,breakBlock);edge('place',6,placeBlock);edge('consume',2,consumeItem);
    player.crouched=pressed(1);
    return{forward,strafe};
  }

  function chapterTarget(){
    const challenge=mode==='challenge';
    const table=challenge?[
      {title:'Etapa 1/3 — Cartografia de chunks',chunks:9,distance:60,lesson:'Mapeie a vizinhança e observe como chunks próximos entram primeiro na fila de renderização.',code:'enqueueAround(player.x, player.z);'},
      {title:'Etapa 2/3 — Mineração persistente',broken:12,collected:12,lesson:'Quebre recursos suficientes para observar inventário, edição persistente e reconstrução seletiva.',code:'edits.set(blockKey, null); rebuildAffectedChunks();'},
      {title:'Etapa 3/3 — Engenharia de campo',placed:8,distance:120,lesson:'Construa uma estrutura e amplie a exploração sem colocar blocos dentro do avatar.',code:'if (!intersectsPlayer) placeBlock();'}
    ]:[
      {title:'Etapa 1/3 — Streaming do mundo',chunks:5,distance:25,lesson:'Explore o entorno e observe como o mundo é carregado em chunks próximos ao jogador.',code:'enqueueAround(player.x, player.z);'},
      {title:'Etapa 2/3 — Recursos e inventário',broken:4,collected:4,lesson:'Quebre recursos para atualizar inventário e persistir alterações do mundo.',code:'inventory[item]++; edits.set(blockKey, null);'},
      {title:'Etapa 3/3 — Construção e navegação',placed:3,distance:45,lesson:'Construa blocos com segurança e complete a rota de exploração.',code:'if (!intersectsPlayer) placeBlock();'}
    ];
    return table[Math.max(0,Math.min(2,stats.chapter-1))];
  }
  function targetProgress(target){
    const checks=[];
    if(target.chunks)checks.push(Math.min(1,chunks.size/target.chunks));
    if(target.broken)checks.push(Math.min(1,stats.broken/target.broken));
    if(target.placed)checks.push(Math.min(1,stats.placed/target.placed));
    if(target.distance)checks.push(Math.min(1,stats.distance/target.distance));
    if(target.collected)checks.push(Math.min(1,stats.collected/target.collected));
    return checks.length?(checks.reduce((sum,value)=>sum+value,0)/checks.length)*100:100;
  }
  function missionData(){
    if(mode==='free')return{title:'Exploração livre',progress:100,stage:0,stages:0,lesson:'Explore, construa e observe como o mundo é carregado progressivamente.',code:'requestAnimationFrame(gameLoop);'};
    const target=chapterTarget(),progress=targetProgress(target);
    return{title:stats.completed?(mode==='challenge'?'Desafio de três etapas concluído':'Trilha de aprendizagem concluída'):target.title,progress:stats.completed?100:progress,stage:stats.chapter,stages:3,lesson:target.lesson,code:target.code};
  }
  function emitProgress(force=false){
    const now=performance.now();if(!force&&now-progressTimer<500)return;progressTimer=now;
    let mission=missionData();
    if(mode!=='free'&&!stats.completed&&mission.progress>=100){
      const completed=stats.chapter;stats.chaptersCompleted=Math.max(stats.chaptersCompleted,completed);
      if(completed<3){stats.xp+=mode==='challenge'?220:120;stats.chapter=completed+1;onStatus({type:'mission-stage-complete',message:`Etapa ${completed}/3 concluída. Próxima missão liberada.`,duration:3600});mission=missionData();}
      else{stats.completed=true;stats.chaptersCompleted=3;stats.xp+=mode==='challenge'?500:250;onStatus({type:'mission-complete',message:'As três etapas foram concluídas! O bônus final de XP foi registrado.',duration:4400});mission=missionData();}
    }
    onProgress({...mission,xp:stats.xp,broken:stats.broken,placed:stats.placed,distance:Math.round(stats.distance),collected:stats.collected,chunks:chunks.size,triangles:renderer.info.render.triangles,chaptersCompleted:stats.chaptersCompleted});
  }

  function recoverPlayer(){const safe=safeSpawn(lastSafePos.x,lastSafePos.z);player.pos.set(safe.x,safe.y,safe.z);player.vy=0;player.health=Math.max(35,player.health);onStatus({type:'safe-recovery'});}
  function toggleCamera(){player.camera=player.camera==='first'?'third':'first';onStatus({message:`Câmera ${player.camera==='first'?'em primeira pessoa':'em terceira pessoa'}.`,duration:1500});}
  const cameraRay=new THREE.Raycaster();
  function updateCamera(){
    camera.rotation.order='YXZ';
    if(player.camera==='first'){camera.position.copy(player.pos);camera.rotation.y=player.yaw;camera.rotation.x=player.pitch;return;}
    const target=player.pos.clone().add(new THREE.Vector3(0,.2,0));
    const desired=target.clone().add(new THREE.Vector3(Math.sin(player.yaw)*5,2.45,Math.cos(player.yaw)*5));
    const direction=desired.clone().sub(target),distance=direction.length();direction.normalize();cameraRay.set(target,direction);cameraRay.far=distance;
    const hit=cameraRay.intersectObjects([...chunks.values()],false)[0];
    if(hit)desired.copy(target).addScaledVector(direction,Math.max(.55,hit.distance-.3));
    camera.position.copy(desired);camera.lookAt(target);
  }

  function update(delta,time){
    if(paused)return;
    const pad=readGamepad(delta);
    player.yaw-=lookJoy.x*delta*2.6*sensitivity;player.pitch=Math.max(-1.4,Math.min(1.4,player.pitch-lookJoy.y*delta*2.1*sensitivity));
    const forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-moveJoy.y+pad.forward;
    const strafe=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+moveJoy.x+pad.strafe;
    jumpBuffer=Math.max(0,jumpBuffer-delta);coyote=player.onGround?.11:Math.max(0,coyote-delta);
    if(jumpBuffer>0&&coyote>0){player.vy=7.5;player.onGround=false;coyote=0;jumpBuffer=0;}
    const fw=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),right=new THREE.Vector3(Math.cos(player.yaw),0,-Math.sin(player.yaw)),movement=new THREE.Vector3().addScaledVector(fw,forward).addScaledVector(right,strafe),speed=player.crouched?2:keys.shift?8:4.5;
    if(movement.lengthSq()){
      movement.normalize().multiplyScalar(speed*delta);
      const currentSurface=columnSurface(player.pos.x,player.pos.z),eyeHeight=player.crouched?CROUCH_EYE:STAND_EYE;
      const tryAxis=(axis,amount)=>{if(!amount)return;const nx=axis==='x'?player.pos.x+amount:player.pos.x,nz=axis==='z'?player.pos.z+amount:player.pos.z+0;const finalZ=axis==='z'?player.pos.z+amount:nz;const targetSurface=columnSurface(nx,finalZ),step=targetSurface-currentSurface;const treeHit=treePositions.some(tree=>Math.hypot(tree.x-nx,tree.z-finalZ)<.72&&player.pos.y-eyeHeight<tree.y+3&&player.pos.y>.2+tree.y);if(step<=.65&&canOccupy(nx,player.pos.y,finalZ,player.crouched)&&!treeHit){player.pos.x=nx;player.pos.z=finalZ;}};
      tryAxis('x',movement.x);tryAxis('z',movement.z);
    }
    player.vy-=18*delta;player.pos.y+=player.vy*delta;
    const surface=columnSurface(player.pos.x,player.pos.z),eyeHeight=player.crouched?CROUCH_EYE:STAND_EYE,ground=surface+eyeHeight;
    if(player.pos.y<=ground&&player.vy<=0){player.pos.y=ground;player.vy=0;player.onGround=true;lastSafePos.copy(player.pos);}else player.onGround=false;
    if(!Number.isFinite(player.pos.x)||!Number.isFinite(player.pos.y)||!Number.isFinite(player.pos.z)||player.pos.y<-24)recoverPlayer();
    player.hunger=Math.max(0,player.hunger-delta*.16);if(player.hunger===0)player.health=Math.max(0,player.health-delta);if(player.health<=0){player.health=100;player.hunger=70;recoverPlayer();}
    stats.distance+=player.pos.distanceTo(lastDistancePos);lastDistancePos.copy(player.pos);
    chunkTimer-=delta;if(chunkTimer<=0){chunkTimer=.25;enqueueAround(player.pos.x,player.pos.z);}processQueue();
    avatar.position.set(player.pos.x,player.pos.y-eyeHeight,player.pos.z);avatar.rotation.y=player.yaw;avatar.visible=player.camera==='third';avatar.scale.y=player.crouched?.72:1;
    updateCamera();
    animals.forEach((animal,index)=>{animal.userData.dir+=Math.sin(time*.0004+index)*delta*.15;animal.position.x+=Math.cos(animal.userData.dir)*delta*.3;animal.position.z+=Math.sin(animal.userData.dir)*delta*.3;animal.position.y=columnSurface(animal.position.x,animal.position.z)+.7+Math.sin(time*.004+index)*.035;animal.rotation.y=-animal.userData.dir;});
    clouds.forEach((cloud,index)=>{cloud.position.x+=cloud.userData.speed*delta;if(cloud.position.x>105)cloud.position.x=-105;cloud.position.y+=Math.sin(time*.00035+index)*delta*.03;});
    water.position.y=.18+Math.sin(time*.0007)*.035;waterMaterial.opacity=(quality==='ultra'?.7:.58)+Math.sin(time*.0005)*.025;
    const target=targetBlock(false);selection.visible=Boolean(target);if(target)selection.position.set(target.x+.5,target.y+.5,target.z+.5);
    const daylight=.78+Math.sin(time*.000025)*.22;sun.intensity=2.25+daylight*.95;sun.position.x=Math.cos(time*.000025)*58;sun.position.y=36+daylight*35;sun.position.z=Math.sin(time*.000025)*44;
    const duskMix=Math.max(0,Math.min(1,(.93-daylight)*2.7));scene.background.copy(skyDay).lerp(skyDusk,duskMix);scene.fog.color.copy(fogDay).lerp(fogDusk,duskMix);hemi.intensity=1.65+daylight*.58;renderer.toneMappingExposure=1.02+daylight*.14;if(skySun){skySun.position.copy(sun.position).multiplyScalar(2.4);skySun.material.opacity=.58+daylight*.34;}
    emitProgress();
  }
  function loop(time){if(!running)return;const delta=Math.min(.033,Math.max(.001,(time-last)/1000));last=time;update(delta,time);renderer.render(scene,camera);frames++;if(time-fpsAt>500){fps=frames*1000/(time-fpsAt);frames=0;fpsAt=time;}if(time-hudTimer>180){hudTimer=time;const mission=missionData();onHud({fps,chunks:chunks.size,triangles:renderer.info.render.triangles,health:player.health,hunger:player.hunger,xp:stats.xp,lesson:mission.lesson,code:mission.code});}animationId=requestAnimationFrame(loop);}

  const resize=()=>{const next=size();camera.aspect=next.width/next.height;camera.updateProjectionMatrix();renderer.setSize(next.width,next.height,false);};
  addEventListener('resize',resize);
  const contextLost=event=>{event.preventDefault();paused=true;onStatus({type:'context-lost',message:'O contexto WebGL foi perdido. O jogo foi pausado; salve e use o modo seguro se o problema continuar.',duration:7000});onProgress({title:'Renderização interrompida',progress:0,lesson:'O contexto WebGL foi perdido. O mundo permanece no armazenamento local.',code:'webglcontextlost'});};
  const contextRestored=()=>{paused=false;last=performance.now();onStatus({message:'Contexto WebGL restaurado.',duration:2500});};renderer.domElement.addEventListener('webglcontextlost',contextLost);renderer.domElement.addEventListener('webglcontextrestored',contextRestored);
  emitProgress(true);onStatus({loading:false,type:'world-ready',message:`Mundo carregado em qualidade ${quality}.`,duration:2200});
  animationId=requestAnimationFrame(loop);

  function clearInputs(){for(const key of Object.keys(keys))keys[key]=false;moveJoy.x=moveJoy.y=lookJoy.x=lookJoy.y=0;}
  function destroy(){
    running=false;cancelAnimationFrame(animationId);document.exitPointerLock?.();clearInputs();
    removeEventListener('keydown',keyDown);removeEventListener('keyup',keyUp);removeEventListener('resize',resize);document.removeEventListener('mousemove',mouseMove);document.removeEventListener('pointerlockerror',pointerLockError);
    renderer.domElement.removeEventListener('click',requestLock);renderer.domElement.removeEventListener('mousedown',mouseDown);renderer.domElement.removeEventListener('contextmenu',contextMenu);renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.domElement.removeEventListener('webglcontextrestored',contextRestored);
    joystickCleanups.forEach(cleanup=>cleanup());actionHandlers.forEach(([button,handler])=>button.removeEventListener('pointerdown',handler));
    const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);const list=Array.isArray(object.material)?object.material:[object.material];list.filter(Boolean).forEach(material=>{materials.add(material);if(material.map)textures.add(material.map);});});geometries.forEach(geometry=>geometry.dispose?.());materials.forEach(material=>material.dispose?.());textures.forEach(map=>map.dispose?.());texture.dispose();renderer.dispose();host.replaceChildren();
  }
  return{
    setPaused:value=>{paused=Boolean(value);if(paused)document.exitPointerLock?.();clearInputs();last=performance.now();},
    setSelected:item=>{current=item;},
    toggleCamera,
    serialize:()=>({version:11,quality,mode,player:{x:player.pos.x,y:player.pos.y,z:player.pos.z,yaw:player.yaw,pitch:player.pitch,camera:player.camera,health:player.health,hunger:player.hunger},stats:{...stats},edits:[...edits]}),
    diagnostics:()=>({quality,chunks:chunks.size,triangles:renderer.info.render.triangles,webgl2:renderer.capabilities.isWebGL2,maxTextureSize:renderer.capabilities.maxTextureSize,edits:edits.size}),
    destroy
  };
}

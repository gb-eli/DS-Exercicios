const params = new URLSearchParams(location.search);
const embedded = params.get('embed') === '1';
let visualStyle = params.get('style') === 'historico' ? 'historico' : 'moderno';
const quality = params.get('quality') || 'medium';
const reducedMotion = params.get('reduced') === '1' || (typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const muted = params.get('muted') === '1';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false });
const shell = document.querySelector('#game-shell');
const worldLabel = document.querySelector('#world-label');
const levelTitle = document.querySelector('#level-title');
const objectiveText = document.querySelector('#objective-text');
const styleLabel = document.querySelector('#style-label');
const scoreLabel = document.querySelector('#score-label');
const chipLabel = document.querySelector('#chip-label');
const secretLabel = document.querySelector('#secret-label');
const toast = document.querySelector('#toast');
const pauseOverlay = document.querySelector('#pause');
const touchControls = document.querySelector('#touch-controls');

const PLAYER = { w: 30, h: 42 };
const MOVE_SPEED = 220;
const GRAVITY = 1300;
const JUMP_SPEED = 520;
const SPRING_SPEED = 670;
const COYOTE_MS = 105;
const JUMP_BUFFER_MS = 125;
const COLORS = { cyan:'#5dd7ff', yellow:'#ffe177', red:'#ff5e67', green:'#63f29a', purple:'#ba78ff', dark:'#07111c' };
const PALETTES = [
  ['#071929','#0d3a50','#70d6ff','#2b6f89'],
  ['#0b1225','#192d4a','#6dd2a3','#315f61'],
  ['#0b1020','#24224b','#9c82ff','#544a8a'],
  ['#130e1d','#43243c','#ff9e6d','#7b4654'],
  ['#07131f','#163c50','#6ee7ff','#326d83'],
  ['#080b16','#25294f','#ffe177','#6e5c28'],
];

let levelData;
let levelIndex = 0;
let level;
let state = 'tutorial';
let player;
let enemies = [];
let boss = null;
let projectiles = [];
let particles = [];
let collectedChips = new Set();
let collectedSecrets = new Set();
let campaignSecrets = new Set();
let checkpointActive = false;
let score = 0;
let deaths = 0;
let elapsedMs = 0;
let levelElapsedMs = 0;
let levelCompleteTimer = 0;
let cameraX = 0;
let shake = 0;
let lastFrame = performance.now();
let toastTimer = 0;
let lastProgressSignature = '';
let audioContext;
let keys = new Set();
let pressed = new Set();
let externalHeld = new Set();
let externalPressed = new Set();
let gamepadPrev = {};
let lastSaveAt = 0;

const response = await fetch('./levels.json', { cache: 'no-store' });
if (!response.ok) throw new Error(`Falha ao carregar fases: HTTP ${response.status}`);
levelData = await response.json();
shell.dataset.style = visualStyle;
styleLabel.textContent = visualStyle.toUpperCase();
worldLabel.textContent = levelData.world.title.toUpperCase();
loadLevel(0, false);
setupInput();
setupTouch();
setupMessageBridge();
resize();
addEventListener('resize', resize);
post('ready', { renderer:'canvas2d', runtime:'plataforma-classica-ds', levels:6, visualStyle, quality });
requestAnimationFrame(loop);

function setupInput() {
  addEventListener('keydown', (event) => {
    const action = keyToAction(event.code);
    if (!action) return;
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)) event.preventDefault();
    if (!keys.has(action)) pressed.add(action);
    keys.add(action);
    if (action === 'pause') togglePause();
    if (action === 'reset-level') resetLevel();
    unlockAudio();
  });
  addEventListener('keyup', (event) => { const action = keyToAction(event.code); if (action) keys.delete(action); });
  addEventListener('blur', () => { keys.clear(); pressed.clear(); externalHeld.clear(); externalPressed.clear(); });
}
function keyToAction(code) {
  if (code === 'KeyA' || code === 'ArrowLeft') return 'move-left';
  if (code === 'KeyD' || code === 'ArrowRight') return 'move-right';
  if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') return 'jump';
  if (code === 'KeyR') return 'reset-level';
  if (code === 'KeyP' || code === 'Escape') return 'pause';
  return '';
}
function setupTouch() {
  touchControls.hidden = !((typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches) || innerWidth < 760);
  document.querySelectorAll('[data-action]').forEach((button) => {
    const action = button.dataset.action;
    const down = (event) => { event.preventDefault(); button.classList.add('active'); if (!externalHeld.has(action)) externalPressed.add(action); externalHeld.add(action); unlockAudio(); if (action === 'reset-level') resetLevel(); };
    const up = (event) => { event.preventDefault(); button.classList.remove('active'); externalHeld.delete(action); };
    button.addEventListener('pointerdown', down); button.addEventListener('pointerup', up); button.addEventListener('pointercancel', up); button.addEventListener('pointerleave', (event)=>{ if(event.buttons===0) up(event); });
  });
}
function setupMessageBridge() {
  addEventListener('message', (event) => {
    if ((location.origin !== 'null' && event.origin !== location.origin) || event.data?.source !== 'fliperama-ds') return;
    const type = String(event.data.type || '');
    const detail = event.data.detail && typeof event.data.detail === 'object' ? event.data.detail : {};
    if (type === 'start') { if (detail.restore) restore(detail.restore); state='playing'; pauseOverlay.hidden=true; unlockAudio(); post('started',{visualStyle}); }
    else if (type === 'restart') { loadLevel(0,false); state='playing'; pauseOverlay.hidden=true; post('started',{visualStyle}); }
    else if (type === 'pause') { if(state==='playing') state='paused'; pauseOverlay.hidden=false; }
    else if (type === 'resume') { if(state==='paused'||state==='tutorial') state='playing'; pauseOverlay.hidden=true; }
    else if (type === 'input') {
      const action=String(detail.action||''); const active=!!detail.active;
      if (action==='pause' && active) togglePause();
      else if (action==='reset-level' && active) resetLevel();
      else { if (active) { if(!externalHeld.has(action)) externalPressed.add(action); externalHeld.add(action); } else externalHeld.delete(action); }
    } else if (type === 'restore') restore(detail.payload || detail);
    else if (type === 'shutdown') state='disposed';
  });
}
function togglePause() { if(state==='playing'){state='paused';pauseOverlay.hidden=false;post('pause-changed',{paused:true});} else if(state==='paused'){state='playing';pauseOverlay.hidden=true;post('pause-changed',{paused:false});} }
function post(type, detail={}) { if(!embedded && parent===window) return; parent.postMessage({source:'fliperama-ds-plataforma-classica',type,detail}, location.origin==='null'?'*':location.origin); }
function unlockAudio(){ if(muted||audioContext) return; try{audioContext=new (window.AudioContext||window.webkitAudioContext)();}catch{} }
function tone(freq,duration=.08,gain=.028,type='square'){ if(muted||!audioContext)return; const o=audioContext.createOscillator(),g=audioContext.createGain(); o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration); }

function createPlayer(spawn){ return {x:spawn[0],y:spawn[1],vx:0,vy:0,w:PLAYER.w,h:PLAYER.h,grounded:false,coyoteMs:0,jumpBufferMs:0,checkpoint:[spawn[0],spawn[1]],invulnMs:0,face:1}; }
function loadLevel(index,preserve=true){
  levelIndex=clamp(Math.floor(index),0,levelData.levels.length-1); level=levelData.levels[levelIndex];
  player=createPlayer(level.spawn); collectedChips=new Set(); collectedSecrets=new Set(); checkpointActive=false; projectiles=[];particles=[];cameraX=0;levelElapsedMs=0;levelCompleteTimer=0;
  enemies=level.enemies.map((source,i)=>({...source,id:i,baseY:source.y,dir:i%2?1:-1,alive:true,cooldown:500+i*220,phase:i*.9}));
  boss=level.boss?{...level.boss,maxHp:level.boss.hp,alive:true,dir:-1,invulnMs:0,phase:0}:null;
  if(!preserve){score=0;deaths=0;elapsedMs=0;campaignSecrets=new Set();}
  updateHud(); showToast(`${levelIndex+1}-1 · ${level.title}`,1200); sendProgress(true);
}
function resetLevel(){ if(state==='disposed')return; deaths+=1;score=Math.max(0,score-100);const keepScore=score,keepDeaths=deaths,keepElapsed=elapsedMs,keepSecrets=new Set(campaignSecrets);loadLevel(levelIndex,true);score=keepScore;deaths=keepDeaths;elapsedMs=keepElapsed;campaignSecrets=keepSecrets;state='playing';tone(140,.12,.03,'sawtooth'); }
function restore(payload){
  if(!payload||typeof payload!=='object')return;
  visualStyle=payload.visualStyle==='historico'?'historico':'moderno';shell.dataset.style=visualStyle;styleLabel.textContent=visualStyle.toUpperCase();
  score=Number(payload.score)||0;deaths=Number(payload.deaths)||0;elapsedMs=Number(payload.elapsedMs)||0;campaignSecrets=new Set(Array.isArray(payload.campaignSecrets)?payload.campaignSecrets:[]);
  const idx=clamp(Number(payload.levelIndex)||0,0,5);loadLevel(idx,true);
  if(Array.isArray(payload.collectedChips)) collectedChips=new Set(payload.collectedChips.filter(i=>level.chips[i]));
  if(Array.isArray(payload.collectedSecrets)) collectedSecrets=new Set(payload.collectedSecrets.filter(i=>level.secrets[i]));
  if(payload.checkpointActive){checkpointActive=true;player.checkpoint=[level.checkpoint[0],level.checkpoint[1]];}
  if(payload.bossHp!=null && boss){boss.hp=clamp(Number(payload.bossHp)||0,0,boss.maxHp);boss.alive=boss.hp>0;}
  updateHud();sendProgress(true);
}
function serialize(){return{schemaVersion:1,visualStyle,levelIndex,level:levelIndex+1,levels:6,score,deaths,elapsedMs:Math.round(elapsedMs),chips:collectedChips.size,chipsTotal:level.chips.length,secrets:campaignSecrets.size,checkpointActive,collectedChips:[...collectedChips],collectedSecrets:[...collectedSecrets],campaignSecrets:[...campaignSecrets],bossHp:boss?.hp??null};}

function loop(now){const dtMs=Math.min(40,Math.max(0,now-lastFrame));lastFrame=now;if(state==='playing')update(dtMs);draw(now);pressed.clear();externalPressed.clear();if(state!=='disposed')requestAnimationFrame(loop);}
function update(dtMs){
  const dt=dtMs/1000;elapsedMs+=dtMs;levelElapsedMs+=dtMs;pollGamepad();
  if(levelCompleteTimer>0){levelCompleteTimer-=dtMs;if(levelCompleteTimer<=0)advanceLevel();return;}
  player.invulnMs=Math.max(0,player.invulnMs-dtMs);updatePlayer(dt,dtMs);updateEnemies(dt,dtMs);updateBoss(dt,dtMs);updateProjectiles(dt,dtMs);updateCollectibles();updateCheckpoint();updateExit();updateParticles(dtMs);
  const target=clamp(player.x-340,0,Math.max(0,level.width-960));cameraX+= (target-cameraX)*Math.min(1,dt*6.5);if(shake>0)shake=Math.max(0,shake-dtMs);if(toastTimer>0){toastTimer-=dtMs;if(toastTimer<=0)toast.hidden=true;}updateHud();sendProgress();
  if(performance.now()-lastSaveAt>900){lastSaveAt=performance.now();post('autosave',serialize());}
}
function held(a){return keys.has(a)||externalHeld.has(a)||!!gamepadPrev[a];}
function justPressed(a){return pressed.has(a)||externalPressed.has(a)||!!gamepadPrev[`${a}-pressed`];}
function updatePlayer(dt,dtMs){
  const left=held('move-left'),right=held('move-right');const target=((right?1:0)-(left?1:0))*MOVE_SPEED;if(target)player.face=Math.sign(target);player.vx+=(target-player.vx)*Math.min(1,dt*14);if(!left&&!right)player.vx*=Math.pow(.0005,dt);
  if(justPressed('jump'))player.jumpBufferMs=JUMP_BUFFER_MS;player.jumpBufferMs=Math.max(0,player.jumpBufferMs-dtMs);player.coyoteMs=player.grounded?COYOTE_MS:Math.max(0,player.coyoteMs-dtMs);
  if(player.jumpBufferMs>0&&player.coyoteMs>0){player.vy=-JUMP_SPEED;player.grounded=false;player.jumpBufferMs=0;player.coyoteMs=0;tone(410,.055,.022,'square');spawnBurst(player.x+15,player.y+40,COLORS.cyan,5);}
  const prevY=player.y;player.x+=player.vx*dt;resolveHorizontal(player,level.platforms);player.vy=Math.min(840,player.vy+GRAVITY*dt);player.y+=player.vy*dt;player.grounded=false;resolveVertical(player,level.platforms);
  player.x=clamp(player.x,0,level.width-player.w);
  for(const spring of level.springs){const r=rectFromArray(spring);if(intersects(player,r)&&player.vy>=0){player.y=r.y-player.h;player.vy=-SPRING_SPEED;player.grounded=false;tone(660,.08,.028,'triangle');spawnBurst(player.x+15,r.y,COLORS.green,8);}}
  if(player.y>570)return respawn('queda');for(const raw of level.hazards){if(intersects(player,rectFromArray(raw)))return respawn('espinhos de dados');}
  for(const enemy of enemies){if(!enemy.alive)continue;const er=enemyRect(enemy);if(!intersects(player,er))continue;const stomp=player.vy>80 && prevY+player.h<=er.y+10;if(stomp){enemy.alive=false;player.y=er.y-player.h;player.vy=-330;score+=240;tone(250,.06,.03,'square');spawnBurst(er.x+18,er.y+18,COLORS.red,9);}else if(player.invulnMs<=0)return respawn('Bugbot');}
  if(boss?.alive&&intersects(player,bossRect())){const br=bossRect();const stomp=player.vy>80&&prevY+player.h<=br.y+14;if(stomp&&boss.invulnMs<=0){boss.hp-=1;boss.invulnMs=900;player.y=br.y-player.h;player.vy=-390;score+=700;shake=260;tone(120+boss.hp*70,.14,.05,'sawtooth');spawnBurst(br.x+33,br.y+30,COLORS.yellow,18);if(boss.hp<=0){boss.alive=false;score+=1800;showToast('GUARDIÃO DO CLOCK DESATIVADO',1800);tone(820,.24,.04,'triangle');}}else if(player.invulnMs<=0)return respawn('Guardião do Clock');}
}
function resolveHorizontal(body,platforms){for(const a of platforms){const r=rectFromArray(a);if(!intersects(body,r))continue;if(body.vx>0)body.x=r.x-body.w;else if(body.vx<0)body.x=r.x+r.w;body.vx=0;}}
function resolveVertical(body,platforms){for(const a of platforms){const r=rectFromArray(a);if(!intersects(body,r))continue;if(body.vy>0){body.y=r.y-body.h;body.vy=0;body.grounded=true;}else if(body.vy<0){body.y=r.y+r.h;body.vy=0;}}}
function respawn(reason){deaths+=1;score=Math.max(0,score-120);player.x=player.checkpoint[0];player.y=player.checkpoint[1];player.vx=0;player.vy=0;player.invulnMs=1000;shake=180;tone(105,.16,.035,'sawtooth');showToast(`REINÍCIO · ${reason}`,900);}
function updateEnemies(dt,dtMs){for(const e of enemies){if(!e.alive)continue;e.phase+=dt;if(e.type==='walker'){e.x+=e.dir*72*dt;if(e.x<=e.minX||e.x>=e.maxX){e.x=clamp(e.x,e.minX,e.maxX);e.dir*=-1;}}else if(e.type==='hopper'){e.x+=e.dir*48*dt;if(e.x<=e.minX||e.x>=e.maxX){e.x=clamp(e.x,e.minX,e.maxX);e.dir*=-1;}e.y=e.baseY-Math.max(0,Math.sin(e.phase*2.7))*58;}else if(e.type==='sentry'){e.cooldown-=dtMs;if(e.cooldown<=0&&Math.abs(player.x-e.x)<520){e.cooldown=1450+Math.random()*500;projectiles.push({x:e.x+18,y:e.y+14,vx:player.x<e.x?-210:210,vy:0,w:12,h:8,life:2400});tone(190,.04,.015,'square');}}}}
function updateBoss(dt,dtMs){if(!boss?.alive)return;boss.phase+=dt;boss.invulnMs=Math.max(0,boss.invulnMs-dtMs);boss.x+=boss.dir*(boss.hp===1?92:70)*dt;if(boss.x<=boss.minX||boss.x>=boss.maxX){boss.x=clamp(boss.x,boss.minX,boss.maxX);boss.dir*=-1;}}
function bossRect(){const hop=Math.max(0,Math.sin(boss.phase*1.7))*42;return{x:boss.x,y:boss.y-hop,w:boss.w,h:boss.h};}
function enemyRect(e){return{x:e.x,y:e.y,w:e.type==='sentry'?34:32,h:e.type==='sentry'?34:32};}
function updateProjectiles(dt,dtMs){for(const p of projectiles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dtMs;if(p.life>0&&player.invulnMs<=0&&intersects(player,p)){p.life=0;respawn('pulso sentinela');}}projectiles=projectiles.filter(p=>p.life>0&&p.x>-50&&p.x<level.width+50);}
function updateCollectibles(){for(let i=0;i<level.chips.length;i++){if(collectedChips.has(i))continue;const [x,y]=level.chips[i];if(intersects(player,{x:x-10,y:y-10,w:20,h:20})){collectedChips.add(i);score+=160;tone(740,.05,.024,'triangle');spawnBurst(x,y,COLORS.yellow,7);}}
  for(let i=0;i<level.secrets.length;i++){if(collectedSecrets.has(i))continue;const [x,y]=level.secrets[i];if(intersects(player,{x:x-12,y:y-12,w:24,h:24})){collectedSecrets.add(i);campaignSecrets.add(`${level.id}:${i}`);score+=500;tone(980,.13,.03,'sine');showToast('FRAGMENTO SECRETO ENCONTRADO',1100);spawnBurst(x,y,COLORS.purple,12);}}
}
function updateCheckpoint(){if(checkpointActive)return;const [x,y]=level.checkpoint;const r={x,y:y-18,w:28,h:78};if(intersects(player,r)){checkpointActive=true;player.checkpoint=[x-8,430];score+=220;tone(560,.1,.028,'triangle');showToast('CHECKPOINT ATIVADO',900);spawnBurst(x,y,COLORS.green,11);}}
function requirementsMet(){return collectedChips.size===level.chips.length && (!boss || !boss.alive);}
function updateExit(){const [x,y,w,h]=level.exit;if(!intersects(player,{x,y,w,h}))return;if(!requirementsMet()){showToast(boss?.alive?`PORTAL BLOQUEADO · chips ${collectedChips.size}/${level.chips.length} · Guardião ${boss.hp}/3`:`PORTAL BLOQUEADO · chips ${collectedChips.size}/${level.chips.length}`,650);return;}if(levelCompleteTimer<=0){levelCompleteTimer=850;score+=900+Math.max(0,1000-Math.floor(levelElapsedMs/100));tone(880,.18,.04,'triangle');showToast(levelIndex===5?'MUNDO 1 CONCLUÍDO!':'FASE CONCLUÍDA',1000);post('level-complete',{level:levelIndex+1,score,secrets:campaignSecrets.size,deaths});}}
function advanceLevel(){if(levelIndex<5){loadLevel(levelIndex+1,true);state='playing';}else finishCampaign();}
function finishCampaign(){state='finished';const medal=deaths<=3&&campaignSecrets.size>=5?'ouro':deaths<=8&&campaignSecrets.size>=3?'prata':'bronze';post('finished',{score,deaths,secretsFound:campaignSecrets.size,secretsTotal:6,medal,elapsedMs:Math.round(elapsedMs),level:6,levels:6,visualStyle});}
function updateParticles(dtMs){for(const p of particles){p.x+=p.vx*dtMs/1000;p.y+=p.vy*dtMs/1000;p.vy+=180*dtMs/1000;p.life-=dtMs;}particles=particles.filter(p=>p.life>0);}
function spawnBurst(x,y,color,count){if(reducedMotion||visualStyle==='historico')count=Math.min(3,count);const factor=quality==='low'?0.45:quality==='ultra'?1.35:1;for(let i=0;i<Math.ceil(count*factor);i++){const a=Math.random()*Math.PI*2,s=35+Math.random()*95;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,life:300+Math.random()*450,color,size:2+Math.random()*4});}}
function pollGamepad(){const gp=navigator.getGamepads?.()[0];const next={};if(gp){const left=(gp.axes?.[0]??0)<-.35||gp.buttons?.[14]?.pressed;const right=(gp.axes?.[0]??0)>.35||gp.buttons?.[15]?.pressed;const jump=gp.buttons?.[0]?.pressed||gp.buttons?.[1]?.pressed;const pause=gp.buttons?.[9]?.pressed;next['move-left']=!!left;next['move-right']=!!right;next.jump=!!jump;next.pause=!!pause;next['jump-pressed']=!!jump&&!gamepadPrev.jump;next['pause-pressed']=!!pause&&!gamepadPrev.pause;if(next['pause-pressed'])togglePause();}gamepadPrev=next;}

function updateHud(){levelTitle.textContent=`1-${levelIndex+1} · ${level.title}`;objectiveText.textContent=level.objective;styleLabel.textContent=visualStyle.toUpperCase();scoreLabel.textContent=`PONTOS ${String(Math.round(score)).padStart(6,'0')}`;chipLabel.textContent=`CHIPS ${collectedChips.size}/${level.chips.length}`;secretLabel.textContent=`SEGREDOS ${campaignSecrets.size}/6`;}
function sendProgress(force=false){const detail={...serialize(),bossMaxHp:boss?.maxHp??null};const sig=JSON.stringify([detail.level,detail.score,detail.deaths,detail.chips,detail.secrets,detail.checkpointActive,detail.bossHp]);if(force||sig!==lastProgressSignature){lastProgressSignature=sig;post('progress',detail);}}
function showToast(text,duration=850){toast.textContent=text;toast.hidden=false;toastTimer=duration;}

function draw(now){const p=PALETTES[levelIndex]||PALETTES[0];const sh=shake>0&&!reducedMotion?(Math.random()-.5)*Math.min(8,shake/35):0;ctx.save();ctx.translate(sh,sh*.3);if(visualStyle==='historico')drawHistoricalBackground(p);else drawModernBackground(p,now);ctx.save();ctx.translate(-Math.round(cameraX),0);drawWorld(p,now);ctx.restore();ctx.restore();}
function drawHistoricalBackground(p){ctx.fillStyle=p[0];ctx.fillRect(0,0,960,540);ctx.fillStyle=p[1];for(let x=0;x<960;x+=64)ctx.fillRect(x,360+((x/64)%2)*18,64,180);ctx.fillStyle='#ffffff0d';for(let y=0;y<540;y+=4)ctx.fillRect(0,y,960,1);}
function drawModernBackground(p,now){const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,p[0]);g.addColorStop(.55,p[1]);g.addColorStop(1,'#03070c');ctx.fillStyle=g;ctx.fillRect(0,0,960,540);const c1=-(cameraX*.12)%340,c2=-(cameraX*.24)%260;ctx.fillStyle=p[3]+'55';for(let i=-1;i<5;i++){const x=c1+i*340;ctx.beginPath();ctx.moveTo(x,400);ctx.lineTo(x+160,180);ctx.lineTo(x+320,400);ctx.fill();}ctx.fillStyle=p[2]+'20';for(let i=-1;i<6;i++)ctx.fillRect(c2+i*260,315+(i%2)*30,120,170);if(quality!=='low'){ctx.fillStyle='#ffffff36';for(let i=0;i<22;i++){const x=(i*149+Math.floor(now*.012))%1000,y=70+(i*83)%240;ctx.fillRect(x,y,2,2);}}}
function drawWorld(p,now){
  // ground/platforms
  for(const a of level.platforms){const [x,y,w,h]=a;if(visualStyle==='historico'){ctx.fillStyle='#1f4160';ctx.fillRect(x,y,w,h);ctx.fillStyle=p[2];ctx.fillRect(x,y,w,4);}else{const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,p[3]);g.addColorStop(1,'#102331');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle=p[2]+'b8';ctx.fillRect(x,y,w,3);ctx.fillStyle='#0004';ctx.fillRect(x,y+h-5,w,5);}}
  // hazards
  for(const a of level.hazards){const [x,y,w,h]=a;ctx.fillStyle=COLORS.red;const teeth=Math.max(1,Math.floor(w/18));for(let i=0;i<teeth;i++){ctx.beginPath();ctx.moveTo(x+i*w/teeth,y+h);ctx.lineTo(x+(i+.5)*w/teeth,y);ctx.lineTo(x+(i+1)*w/teeth,y+h);ctx.fill();}}
  // springs
  for(const a of level.springs){const [x,y,w,h]=a;ctx.fillStyle=COLORS.green;ctx.fillRect(x,y,w,h);ctx.fillStyle='#d9ffe7';ctx.fillRect(x+5,y+4,w-10,4);}
  // checkpoint
  {const [x,y]=level.checkpoint;ctx.fillStyle=checkpointActive?COLORS.green:'#758899';ctx.fillRect(x,y-18,5,78);ctx.fillStyle=checkpointActive?'#d8ffe7':'#a9bac7';ctx.beginPath();ctx.moveTo(x+5,y-18);ctx.lineTo(x+40,y-5);ctx.lineTo(x+5,y+8);ctx.fill();}
  // exit
  {const [x,y,w,h]=level.exit;const open=requirementsMet();ctx.save();if(visualStyle==='moderno'){ctx.shadowBlur=open?22:8;ctx.shadowColor=open?COLORS.cyan:'#66727c';}ctx.strokeStyle=open?COLORS.cyan:'#66727c';ctx.lineWidth=6;ctx.strokeRect(x,y,w,h);ctx.fillStyle=open?'#5dd7ff22':'#65717d18';ctx.fillRect(x+6,y+6,w-12,h-12);ctx.restore();}
  // chips
  for(let i=0;i<level.chips.length;i++){if(collectedChips.has(i))continue;const [x,y]=level.chips[i];drawDiamond(x,y,10,COLORS.yellow,now*.004+i);}
  for(let i=0;i<level.secrets.length;i++){if(collectedSecrets.has(i))continue;const [x,y]=level.secrets[i];drawSecret(x,y,now*.003+i);}
  for(const e of enemies){if(e.alive)drawEnemy(e);}
  for(const pr of projectiles){ctx.fillStyle=COLORS.red;ctx.fillRect(pr.x,pr.y,pr.w,pr.h);if(visualStyle==='moderno'){ctx.fillStyle='#ffb4b8';ctx.fillRect(pr.x+(pr.vx>0?-10:10),pr.y+2,10,4);}}
  if(boss?.alive)drawBoss();
  for(const p0 of particles){ctx.globalAlpha=clamp(p0.life/450,0,1);ctx.fillStyle=p0.color;ctx.fillRect(p0.x,p0.y,p0.size,p0.size);}ctx.globalAlpha=1;
  drawPlayer(now);
}
function drawPlayer(now){const x=Math.round(player.x),y=Math.round(player.y);ctx.save();if(player.invulnMs>0&&Math.floor(player.invulnMs/80)%2===0)ctx.globalAlpha=.35;if(visualStyle==='moderno'){ctx.shadowBlur=14;ctx.shadowColor=COLORS.cyan;}ctx.fillStyle='#44c8f5';roundRect(x,y,player.w,player.h,visualStyle==='historico'?0:8);ctx.fillStyle='#d8f6ff';ctx.fillRect(x+7,y+8,5,5);ctx.fillRect(x+18,y+8,5,5);ctx.fillStyle='#0b2230';ctx.fillRect(x+8,y+9,3,3);ctx.fillRect(x+19,y+9,3,3);ctx.fillStyle=COLORS.yellow;ctx.fillRect(x+(player.face>0?21:4),y+23,5,8);ctx.restore();}
function drawEnemy(e){const r=enemyRect(e);ctx.save();if(visualStyle==='moderno'){ctx.shadowBlur=10;ctx.shadowColor=COLORS.red;}ctx.fillStyle=e.type==='sentry'?'#ba78ff':e.type==='hopper'?'#ff9d5c':'#ff5e67';roundRect(r.x,r.y,r.w,r.h,visualStyle==='historico'?0:6);ctx.fillStyle='#fff';ctx.fillRect(r.x+6,r.y+8,6,5);ctx.fillRect(r.x+r.w-12,r.y+8,6,5);ctx.fillStyle='#25131b';ctx.fillRect(r.x+8,r.y+9,3,3);ctx.fillRect(r.x+r.w-10,r.y+9,3,3);if(e.type==='sentry'){ctx.strokeStyle='#e4c9ff';ctx.beginPath();ctx.moveTo(r.x+r.w/2,r.y);ctx.lineTo(r.x+r.w/2,r.y-12);ctx.stroke();}ctx.restore();}
function drawBoss(){const r=bossRect();ctx.save();if(visualStyle==='moderno'){ctx.shadowBlur=22;ctx.shadowColor=COLORS.yellow;}ctx.fillStyle=boss.invulnMs>0?'#fff0a6':'#e4a93b';roundRect(r.x,r.y,r.w,r.h,visualStyle==='historico'?0:10);ctx.fillStyle='#242033';ctx.fillRect(r.x+14,r.y+18,10,8);ctx.fillRect(r.x+r.w-24,r.y+18,10,8);ctx.strokeStyle='#fff5c2';ctx.lineWidth=4;ctx.beginPath();ctx.arc(r.x+r.w/2,r.y+50,15,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(r.x+r.w/2,r.y+50);ctx.lineTo(r.x+r.w/2+8,r.y+43);ctx.stroke();for(let i=0;i<boss.maxHp;i++){ctx.fillStyle=i<boss.hp?COLORS.yellow:'#3f3a39';ctx.fillRect(r.x+i*20,r.y-16,14,6);}ctx.restore();}
function drawDiamond(x,y,size,color,phase){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4+(reducedMotion?0:Math.sin(phase)*.08));if(visualStyle==='moderno'){ctx.shadowBlur=12;ctx.shadowColor=color;}ctx.fillStyle=color;ctx.fillRect(-size/2,-size/2,size,size);ctx.restore();}
function drawSecret(x,y,phase){ctx.save();ctx.translate(x,y);if(!reducedMotion)ctx.rotate(phase);ctx.strokeStyle=COLORS.purple;ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,b=a+Math.PI/5,r1=12,r2=5;const ax=Math.cos(a)*r1,ay=Math.sin(a)*r1,bx=Math.cos(b)*r2,by=Math.sin(b)*r2;i===0?ctx.moveTo(ax,ay):ctx.lineTo(ax,ay);ctx.lineTo(bx,by);}ctx.closePath();ctx.stroke();ctx.restore();}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect?.(x,y,w,h,r);if(ctx.roundRect)ctx.fill();else ctx.fillRect(x,y,w,h);}
function rectFromArray(a){return{x:a[0],y:a[1],w:a[2],h:a[3]};}
function intersects(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function resize(){const rect=canvas.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);const w=Math.max(640,Math.round(rect.width*dpr)),h=Math.max(360,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const sx=w/960,sy=h/540;ctx.setTransform(sx,0,0,sy,0,0);touchControls.hidden=!((typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches)||innerWidth<760);}

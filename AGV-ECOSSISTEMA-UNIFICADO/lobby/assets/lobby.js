import { supabase } from './supabase.js';
import { SCHOOL_EMAIL_DOMAIN, ACTIVITY_URL, LOBBY_VERSION } from './config.js';

const $=id=>document.getElementById(id);
const WORLD={w:1600,h:1000};
const PLAYER_RADIUS=21;
const state={user:null,profile:null,currentClass:null,classes:[],classSubjects:[],exercises:[],studentReleases:[],classReleases:[],progress:[],others:[],available:[],scheduled:[],keys:new Set(),player:{x:800,y:500,vx:0,vy:0,area:'central'},lastFrame:0,lastPresence:0,lastPoll:0,nearPortal:null,toastTimer:null,deepLink:null};

const zones=[
  {key:'1ds',code:'1DS-A-MANHA',label:'1DS',name:'1ª Série DS',x:90,y:90,w:560,h:330,accent:'#36d2ff',portal:{x:370,y:245,kind:'door',label:'Porta Neon'}},
  {key:'2ds',code:'2DS-A-MANHA',label:'2DS',name:'2ª Série DS',x:950,y:90,w:560,h:330,accent:'#51e7a3',portal:{x:1230,y:245,kind:'pipe',label:'Cano Tech'}},
  {key:'3ds',code:'3DS-C-MANHA',label:'3DS',name:'3ª Série DS',x:90,y:580,w:560,h:330,accent:'#b58cff',portal:{x:370,y:745,kind:'portal',label:'Portal Quantum'}},
  {key:'sub',code:'DS-SUB-NOITE',label:'SUB',name:'DS Subsequente',x:950,y:580,w:560,h:330,accent:'#ffae63',portal:{x:1230,y:745,kind:'gate',label:'Arcade Gate'}}
];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function showLogin(on){$('login').classList.toggle('hidden',!on);$('game-shell').classList.toggle('hidden',on)}
function msg(text='',error=false){$('login-message').textContent=text;$('login-message').classList.toggle('error',error)}
function normalizeEmail(v){return String(v||'').trim().toLowerCase()}
function passwordValid(v){return v.length>=8&&/[A-Za-zÀ-ÿ]/.test(v)&&/\d/.test(v)}
function zoneForPoint(x,y){return zones.find(z=>x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h)||null}
function classByCode(code){return state.classes.find(c=>c.code===code)}
function ownZone(){return zones.find(z=>z.code===state.currentClass?.code)||null}
function releaseState(ex){
  const now=Date.now();
  const p=state.progress.find(x=>x.exercise_id===ex.id);
  if(p?.security_locked||p?.status==='blocked')return{available:false,reason:'Bloqueada por segurança'};
  const sr=state.studentReleases.find(r=>r.exercise_id===ex.id);
  const cr=state.classReleases.find(r=>r.exercise_id===ex.id);
  const r=sr||cr;
  if(!r)return{available:!ex.default_locked,reason:ex.default_locked?'Aguardando liberação do professor':'Disponível'};
  if(!r.enabled)return{available:false,reason:'Bloqueada pelo professor'};
  if(r.release_at&&Date.parse(r.release_at)>now)return{available:false,reason:'Programada',releaseAt:r.release_at};
  if(r.lock_at&&Date.parse(r.lock_at)<=now)return{available:false,reason:'Encerrada'};
  return{available:true,reason:'Liberada',lockAt:r.lock_at};
}
function refreshAvailable(){
  state.available=state.exercises.filter(ex=>releaseState(ex).available);
  state.scheduled=state.exercises.map(ex=>({ex,s:releaseState(ex)})).filter(x=>!x.s.available&&x.s.releaseAt).sort((a,b)=>Date.parse(a.s.releaseAt)-Date.parse(b.s.releaseAt));
}
async function signIn(email,password){
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(!error)return;
  const cgm=/^\d{6,12}$/.test(password),staff=password==='agv@2026';
  if(!cgm&&!staff)throw error;
  const {data,error:up}=await supabase.auth.signUp({email,password,options:{data:cgm?{cgm:password}:{},emailRedirectTo:location.href}});if(up)throw up;
  if(data?.session)return;
  const {error:again}=await supabase.auth.signInWithPassword({email,password});if(again)throw again;
}
async function loadIdentity(){
  const {data:{user}}=await supabase.auth.getUser();if(!user)return false;
  const {data:p,error:pe}=await supabase.from('profiles').select('id,full_name,email,role,active,must_change_password').eq('id',user.id).single();if(pe)throw pe;
  if(p.role!=='student')throw new Error('O lobby jogável é destinado aos alunos. Professor e administrador usam os painéis de gestão.');
  if(!p.active)throw new Error('Seu acesso está inativo.');
  if(p.must_change_password){location.href='../atividades/';return false;}
  const {data:m,error:me}=await supabase.from('class_memberships').select('class_id').eq('user_id',user.id).eq('active',true).order('is_primary',{ascending:false}).limit(1);if(me)throw me;
  if(!m?.length)throw new Error('Sua turma ainda não foi vinculada.');
  const [{data:cls,error:ce},{data:allClasses,error:ace}]=await Promise.all([
    supabase.from('classes').select('id,code,name,shift,school_year').eq('id',m[0].class_id).single(),
    supabase.from('classes').select('id,code,name,shift,school_year').in('code',zones.map(z=>z.code)).eq('active',true)
  ]);if(ce)throw ce;if(ace)throw ace;
  state.user=user;state.profile=p;state.currentClass=cls;state.classes=allClasses||[];
  $('player-name').textContent=p.full_name||'Aluno';$('player-class').textContent=cls.name||cls.code;
  const z=ownZone();if(z){state.player.x=800;state.player.y=500}
  return true;
}
async function loadActivities(){
  const cid=state.currentClass.id;
  const {data:cs,error:cse}=await supabase.from('class_subjects').select('subject_id').eq('class_id',cid).eq('active',true);if(cse)throw cse;
  const ids=(cs||[]).map(x=>x.subject_id);state.classSubjects=cs||[];
  if(!ids.length){state.exercises=[];state.available=[];return}
  const [{data:ex,error:ee},{data:sr,error:se},{data:cr,error:cre},{data:pr,error:pre}]=await Promise.all([
    supabase.from('exercises').select('id,subject_id,exercise_number,title,description,version,default_locked').in('subject_id',ids).eq('active',true).eq('visible',true).order('exercise_number'),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').eq('student_id',state.user.id).order('updated_at',{ascending:false}),
    supabase.from('exercise_releases').select('exercise_id,enabled,release_at,lock_at,updated_at').is('student_id',null).eq('class_id',cid).order('updated_at',{ascending:false}),
    supabase.from('student_exercises').select('exercise_id,status,progress_percent,security_locked,security_lock_reason,completed_at').eq('student_id',state.user.id)
  ]);if(ee)throw ee;if(se)throw se;if(cre)throw cre;if(pre)throw pre;
  const firstByExercise=rows=>{const seen=new Set();return(rows||[]).filter(r=>{if(seen.has(r.exercise_id))return false;seen.add(r.exercise_id);return true})};
  state.exercises=ex||[];state.studentReleases=firstByExercise(sr);state.classReleases=firstByExercise(cr);state.progress=pr||[];refreshAvailable();
}
async function bootGame(){const ready=await loadIdentity();if(!ready)return;await loadActivities();showLogin(false);await writePresence(true);pollPresence();requestAnimationFrame(loop)}

async function writePresence(force=false){
  if(!state.user)return;const now=performance.now();if(!force&&now-state.lastPresence<900)return;state.lastPresence=now;
  const payload={student_id:state.user.id,x:Math.round(state.player.x),y:Math.round(state.player.y),area:state.player.area,updated_at:new Date().toISOString()};
  try{await supabase.from('lobby_presence').upsert(payload,{onConflict:'student_id'})}catch(_){ }
}
async function sendEmote(emote){
  if(!state.user)return;try{await supabase.from('lobby_presence').upsert({student_id:state.user.id,x:Math.round(state.player.x),y:Math.round(state.player.y),area:state.player.area,emote,emote_until:new Date(Date.now()+4500).toISOString()},{onConflict:'student_id'});state.lastPresence=0}catch(_){ }
}
async function pollPresence(){
  if(!state.user)return;try{const cutoff=new Date(Date.now()-20000).toISOString();const {data}=await supabase.from('lobby_presence').select('student_id,class_id,display_name,x,y,area,emote,emote_until,updated_at').gt('updated_at',cutoff);state.others=(data||[]).filter(x=>x.student_id!==state.user.id);$('online-count').textContent=`${state.others.length+1} online`;}catch(_){}finally{setTimeout(pollPresence,2000)}}

function toast(text){const el=$('toast');el.textContent=text;el.classList.remove('hidden');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>el.classList.add('hidden'),2600)}
function currentPortalState(z){
  if(!z)return{open:false,text:''};
  if(z.code!==state.currentClass?.code)return{open:false,text:`Área de convivência ${z.label}. As atividades são exclusivas da turma.`};
  if(state.available.length)return{open:true,text:`${state.available.length} atividade${state.available.length===1?'':'s'} liberada${state.available.length===1?'':'s'}.`};
  const next=state.scheduled[0];if(next)return{open:false,text:`Próxima abertura: ${new Date(next.s.releaseAt).toLocaleString('pt-BR')}.`};
  return{open:false,text:'Portal fechado. Aguardando o professor liberar uma atividade.'};
}
function showActivityModal(){
  if(!state.available.length){toast('O portal ainda está fechado pelo professor.');return}
  $('activity-title').textContent=`Atividades liberadas — ${state.currentClass.name}`;$('activity-subtitle').textContent='Escolha uma atividade para atravessar o portal.';
  $('activity-list').innerHTML=state.available.map(ex=>{const p=state.progress.find(x=>x.exercise_id===ex.id);const st=p?.status==='completed'?'Concluída':p?.status==='in_progress'?`${Math.round(Number(p.progress_percent||0))}% em andamento`:'Disponível';return `<article class="activity"><span class="num">${String(ex.exercise_number).padStart(2,'0')}</span><div><strong>${esc(ex.title)}</strong><small>${esc(st)}</small></div><button class="primary" data-exercise="${esc(ex.id)}" type="button">Entrar</button></article>`}).join('');
  $('activity-list').querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>enterActivity(b.dataset.exercise));$('activity-modal').classList.remove('hidden');
}
function enterActivity(id){
  const ex=state.exercises.find(x=>x.id===id);if(!ex||!releaseState(ex).available){toast('A atividade não está liberada.');return}
  $('activity-modal').classList.add('hidden');toast('Portal aberto! Entrando na atividade…');
  setTimeout(()=>{location.href=`${ACTIVITY_URL}?exercise=${encodeURIComponent(id)}&from=lobby`},650);
}
function interact(){if(state.nearPortal){const z=state.nearPortal.zone,ps=currentPortalState(z);if(z.code!==state.currentClass?.code){toast(`Você pode visitar ${z.label}, mas as atividades pertencem àquela turma.`);return}if(ps.open)showActivityModal();else toast(ps.text)}}

function update(dt){
  const speed=260;let dx=0,dy=0;if(state.keys.has('ArrowLeft')||state.keys.has('KeyA'))dx--;if(state.keys.has('ArrowRight')||state.keys.has('KeyD'))dx++;if(state.keys.has('ArrowUp')||state.keys.has('KeyW'))dy--;if(state.keys.has('ArrowDown')||state.keys.has('KeyS'))dy++;
  if(dx&&dy){dx*=.7071;dy*=.7071}state.player.x=Math.max(PLAYER_RADIUS,Math.min(WORLD.w-PLAYER_RADIUS,state.player.x+dx*speed*dt));state.player.y=Math.max(PLAYER_RADIUS,Math.min(WORLD.h-PLAYER_RADIUS,state.player.y+dy*speed*dt));
  const z=zoneForPoint(state.player.x,state.player.y);state.player.area=z?.key||'central';$('area-label').textContent=z?`Área ${z.label} — ${z.name}`:'Praça Central';
  state.nearPortal=null;for(const zone of zones){const d=Math.hypot(state.player.x-zone.portal.x,state.player.y-zone.portal.y);if(d<92){state.nearPortal={zone,d};break}}
  renderInteraction();writePresence();
}
function renderInteraction(){const box=$('interaction');if(!state.nearPortal){box.classList.add('hidden');return}const z=state.nearPortal.zone,ps=currentPortalState(z);box.classList.remove('hidden');$('interaction-title').textContent=`${z.portal.label} — ${z.label}`;$('interaction-text').textContent=ps.text;$('interaction-button').textContent=ps.open?'Abrir portal':'Ver estado';$('interaction-button').disabled=false}

function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function drawWorld(ctx,t){
  ctx.clearRect(0,0,WORLD.w,WORLD.h);ctx.fillStyle='#061018';ctx.fillRect(0,0,WORLD.w,WORLD.h);
  // grid / floor
  ctx.strokeStyle='#102431';ctx.lineWidth=1;for(let x=0;x<WORLD.w;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD.h);ctx.stroke()}for(let y=0;y<WORLD.h;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.w,y);ctx.stroke()}
  // central plaza
  const g=ctx.createRadialGradient(800,500,20,800,500,410);g.addColorStop(0,'#12384a');g.addColorStop(1,'#07131c');ctx.fillStyle=g;ctx.beginPath();ctx.arc(800,500,330,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#2a546a';ctx.lineWidth=5;ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle='#8edfff';ctx.font='900 28px system-ui';ctx.fillText('AGV • PRAÇA CENTRAL',800,485);ctx.fillStyle='#7293a8';ctx.font='600 15px system-ui';ctx.fillText('CIRCULAÇÃO LIVRE • PORTAIS CONTROLADOS PELO PROFESSOR',800,514);
  for(const z of zones)drawZone(ctx,z,t);
  for(const o of state.others)drawAvatar(ctx,o.x,o.y,o.display_name,o.class_id,o.emote,o.emote_until,false);
  drawAvatar(ctx,state.player.x,state.player.y,(state.profile?.full_name||'Aluno').split(' ')[0],state.currentClass?.id,null,null,true);
}
function drawZone(ctx,z,t){
  const own=z.code===state.currentClass?.code;ctx.save();ctx.globalAlpha=.98;ctx.fillStyle='#09141c';roundedRect(ctx,z.x,z.y,z.w,z.h,28);ctx.fill();ctx.strokeStyle=own?z.accent:'#263746';ctx.lineWidth=own?5:2;ctx.stroke();
  ctx.fillStyle=z.accent;ctx.font='900 25px system-ui';ctx.textAlign='left';ctx.fillText(z.label,z.x+24,z.y+39);ctx.fillStyle='#a7bdcb';ctx.font='700 15px system-ui';ctx.fillText(z.name,z.x+24,z.y+64);
  ctx.fillStyle=own?z.accent:'#536979';ctx.font='700 12px system-ui';ctx.fillText(own?'SUA TURMA':'VISITA LIVRE',z.x+24,z.y+88);
  drawPortal(ctx,z,t);ctx.restore();
}
function drawPortal(ctx,z,t){
  const ps=currentPortalState(z),p=z.portal,pulse=(Math.sin(t/300)+1)/2;ctx.save();ctx.translate(p.x,p.y);
  if(ps.open){ctx.shadowColor=z.accent;ctx.shadowBlur=22+18*pulse;ctx.strokeStyle=z.accent;ctx.fillStyle='#0b2630'}else{ctx.shadowBlur=0;ctx.strokeStyle='#41515d';ctx.fillStyle='#111820'}ctx.lineWidth=6;
  if(p.kind==='pipe'){ctx.fillRect(-52,-58,104,116);ctx.strokeRect(-52,-58,104,116);ctx.fillStyle=ps.open?z.accent:'#4a5963';ctx.fillRect(-70,-73,140,25);ctx.strokeRect(-70,-73,140,25)}
  else if(p.kind==='portal'){ctx.beginPath();ctx.ellipse(0,0,62,88,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,38,62,0,0,Math.PI*2);ctx.strokeStyle=ps.open?`rgba(181,140,255,${.45+.4*pulse})`:'#34414a';ctx.stroke()}
  else if(p.kind==='gate'){ctx.fillRect(-66,-72,132,144);ctx.strokeRect(-66,-72,132,144);ctx.beginPath();for(let x=-44;x<=44;x+=22){ctx.moveTo(x,-54);ctx.lineTo(x,54)}ctx.stroke()}
  else{ctx.beginPath();ctx.moveTo(-64,72);ctx.lineTo(-64,-30);ctx.quadraticCurveTo(-64,-84,0,-84);ctx.quadraticCurveTo(64,-84,64,-30);ctx.lineTo(64,72);ctx.closePath();ctx.fill();ctx.stroke()}
  if(!ps.open){ctx.shadowBlur=0;ctx.fillStyle='#dbe6ed';ctx.fillRect(-18,-2,36,32);ctx.strokeStyle='#dbe6ed';ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,-4,15,Math.PI,0);ctx.stroke();ctx.fillStyle='#111820';ctx.beginPath();ctx.arc(0,13,4,0,Math.PI*2);ctx.fill()}
  ctx.shadowBlur=0;ctx.fillStyle='#eaf7ff';ctx.textAlign='center';ctx.font='900 14px system-ui';ctx.fillText(p.label,0,112);ctx.fillStyle=ps.open?z.accent:'#7d909d';ctx.font='700 12px system-ui';ctx.fillText(ps.open?'ABERTO':'FECHADO',0,132);ctx.restore();
}
function classAccent(classId){const c=state.classes.find(x=>x.id===classId);return zones.find(z=>z.code===c?.code)?.accent||'#8aa0af'}
function drawAvatar(ctx,x,y,name,classId,emote,emoteUntil,self){
  ctx.save();const accent=self?classAccent(state.currentClass?.id):classAccent(classId);ctx.translate(Number(x)||0,Number(y)||0);ctx.shadowColor=accent;ctx.shadowBlur=self?14:7;ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#e9f7ff';ctx.beginPath();ctx.arc(0,-8,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#081118';ctx.beginPath();ctx.arc(-3,-9,1.3,0,Math.PI*2);ctx.arc(3,-9,1.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#061019dd';roundedRect(ctx,-45,28,90,23,10);ctx.fill();ctx.fillStyle=self?'#fff':'#bfd1dc';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText(String(name||'Aluno').slice(0,14),0,44);if(emote&&(!emoteUntil||Date.parse(emoteUntil)>Date.now())){ctx.font='24px system-ui';ctx.fillText({wave:'👋',like:'👍',spark:'✨'}[emote]||'',0,-36)}ctx.restore();
}
function loop(ts){const dt=Math.min(.05,(ts-(state.lastFrame||ts))/1000);state.lastFrame=ts;update(dt);const canvas=$('game'),ctx=canvas.getContext('2d');drawWorld(ctx,ts);requestAnimationFrame(loop)}

function keyDown(e){if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();state.keys.add(e.code)}if((e.code==='KeyE'||e.code==='Enter')&&!e.repeat){e.preventDefault();interact()}if(e.code==='Digit1')sendEmote('wave');if(e.code==='Digit2')sendEmote('like');if(e.code==='Digit3')sendEmote('spark')}
function keyUp(e){state.keys.delete(e.code)}
window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
$('interaction-button').onclick=interact;$('touch-action').onclick=interact;$('activity-close').onclick=()=>$('activity-modal').classList.add('hidden');$('activity-modal').addEventListener('click',e=>{if(e.target===$('activity-modal'))$('activity-modal').classList.add('hidden')});
for(const b of document.querySelectorAll('[data-emote]'))b.onclick=()=>sendEmote(b.dataset.emote);
for(const b of document.querySelectorAll('[data-key]')){const code=b.dataset.key;const on=e=>{e.preventDefault();state.keys.add(code)},off=e=>{e.preventDefault();state.keys.delete(code)};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off)}
$('logout').onclick=async()=>{try{await supabase.from('lobby_presence').delete().eq('student_id',state.user.id)}catch(_){}await supabase.auth.signOut();location.reload()};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadActivities().catch(()=>{})});
setInterval(()=>loadActivities().catch(()=>{}),15000);

$('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter,email=normalizeEmail($('email').value),password=$('password').value;if(!email.endsWith(SCHOOL_EMAIL_DOMAIN)){msg(`Use o e-mail institucional ${SCHOOL_EMAIL_DOMAIN}.`,true);return}btn.disabled=true;msg('Entrando no lobby…');try{await signIn(email,password);await bootGame();msg()}catch(err){console.error(err);msg(err?.message||'Não foi possível entrar.',true);try{await supabase.auth.signOut()}catch(_){}}finally{btn.disabled=false}});

(async()=>{try{const {data:{session}}=await supabase.auth.getSession();if(session){await bootGame();return}}catch(e){console.warn(e)}showLogin(true)})();
console.info(`AGV Lobby DS ${LOBBY_VERSION}`);

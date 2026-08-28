window.AppSharedAuth = (() => {
  const SESSION_DAYS = 5;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const config = () => window.APP_CONFIG || {};
  const namespace = () => String(config().authNamespace || '2ds-frontend-manha').replace(/[^a-z0-9_-]/gi,'-').toLowerCase();
  const key = name => `ds2_${namespace()}_aluno_${name}_v2`;
  let currentUser = null;

  function bytesToBase64(bytes){ let s=''; bytes.forEach(b=>s+=String.fromCharCode(b)); return btoa(s); }
  function base64ToBytes(v){ const raw=atob(v); return Uint8Array.from(raw,c=>c.charCodeAt(0)); }
  function randomBytes(n=16){ const a=new Uint8Array(n); crypto.getRandomValues(a); return a; }
  function normalizeUsername(v){ return String(v||'').trim().toLowerCase().replace(/\s+/g,'.'); }
  function users(){ try{return JSON.parse(localStorage.getItem(key('users')))||[];}catch{return [];} }
  function saveUsers(v){ localStorage.setItem(key('users'),JSON.stringify(v)); }
  function findUser(username){ return users().find(u=>u.username===normalizeUsername(username)); }
  function safeEqual(a='',b=''){ if(a.length!==b.length)return false; let r=0; for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i); return r===0; }

  async function digestPassword(password,salt){
    if(!crypto?.subtle) throw new Error('Criptografia local indisponível. Abra a plataforma por HTTPS.');
    const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:base64ToBytes(salt),iterations:140000,hash:'SHA-256'},material,256);
    return bytesToBase64(new Uint8Array(bits));
  }
  async function deviceKey(){
    let raw=localStorage.getItem(key('device_key'));
    if(!raw){ raw=bytesToBase64(randomBytes(32)); localStorage.setItem(key('device_key'),raw); }
    return crypto.subtle.importKey('raw',base64ToBytes(raw),{name:'AES-GCM'},false,['encrypt','decrypt']);
  }
  async function encrypt(payload){
    const k=await deviceKey(), iv=randomBytes(12);
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,encoder.encode(JSON.stringify(payload)));
    return JSON.stringify({iv:bytesToBase64(iv),data:bytesToBase64(new Uint8Array(encrypted)),algorithm:'AES-GCM'});
  }
  async function decrypt(raw){
    if(!raw)return null; const p=JSON.parse(raw),k=await deviceKey();
    const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(p.iv)},k,base64ToBytes(p.data));
    return JSON.parse(decoder.decode(dec));
  }
  async function readSession(){
    const raw=localStorage.getItem(key('session')); if(!raw)return null;
    try{ const s=await decrypt(raw); if(!s||s.role!=='aluno'||Date.now()>s.expiresAt){localStorage.removeItem(key('session'));return null;} return s; }
    catch{localStorage.removeItem(key('session'));return null;}
  }
  async function saveSession(extra={}){
    if(!currentUser)return;
    const previous=await readSession().catch(()=>null), now=Date.now();
    const payload={
      username:currentUser.username, role:'aluno', issuedAt:previous?.issuedAt||now,
      expiresAt:previous?.expiresAt||now+SESSION_DAYS*86400000, locked:Boolean(extra.locked??previous?.locked),
      lastExercise:previous?.lastExercise??null, lastView:previous?.lastView??'home', lastSeenAt:now,
      innovationLastActivity:extra.innovationLastActivity??previous?.innovationLastActivity??null
    };
    localStorage.setItem(key('session'),await encrypt(payload));
  }
  function log(action,details={}){
    let list=[]; try{list=JSON.parse(localStorage.getItem(key('logs')))||[];}catch{}
    list.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}`,at:new Date().toISOString(),user:currentUser?.username||'sem-sessao',displayName:currentUser?.displayName||'',role:'aluno',action,exercise:null,version:config().version||'',details:{discipline:'inovacao-empreendedorismo',...details}});
    localStorage.setItem(key('logs'),JSON.stringify(list.slice(-1200)));
  }

  function setMessage(text,tone=''){ const el=$('#authMessage'); el.textContent=text||''; el.style.color=tone==='danger'?'#ff8794':tone==='success'?'#72e3a8':''; }
  function showTab(tab){
    $('#loginForm').hidden=tab!=='login'; $('#registerForm').hidden=tab!=='register'; $('#unlockForm').hidden=true; $('#authTabs').hidden=false;
    $$('[data-auth-tab]').forEach(b=>b.classList.toggle('active',b.dataset.authTab===tab)); setMessage('');
  }
  function renderRecent(){
    const c=$('#recentUsers'), list=users();
    c.innerHTML=list.length?`<span>Usuários deste navegador:</span>${list.map(u=>`<button type="button" class="recent-user" data-user="${escapeHtml(u.username)}">${escapeHtml(u.displayName)} <small>@${escapeHtml(u.username)}</small></button>`).join('')}`:'';
    c.querySelectorAll('[data-user]').forEach(b=>b.onclick=()=>{$('#loginUsername').value=b.dataset.user;$('#loginPassword').focus();});
  }
  function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function showAuth(){ $('#authGate').hidden=false; $('#authGate').setAttribute('aria-hidden','false'); renderRecent(); showTab(users().length?'login':'register'); }
  function hideAuth(){ $('#authGate').hidden=true; $('#authGate').setAttribute('aria-hidden','true'); }
  function updateUserUi(){
    if(!currentUser)return; $('#userMenu').hidden=false; $('#userDisplayName').textContent=currentUser.displayName; $('#userMeta').textContent=`@${currentUser.username}${currentUser.group?` · ${currentUser.group}`:''}`;
    $('#userFirstName').textContent=currentUser.displayName.split(/\s+/)[0]||'Aluno'; $('#userAvatar').textContent=(currentUser.displayName.trim()[0]||'A').toUpperCase();
  }
  async function finish(){ updateUserUi(); hideAuth(); document.dispatchEvent(new CustomEvent('sharedauth:ready',{detail:{user:currentUser}})); }
  async function register(ev){
    ev.preventDefault(); const displayName=$('#registerName').value.trim(), username=normalizeUsername($('#registerUsername').value), group=$('#registerGroup').value.trim(), password=$('#registerPassword').value, confirm=$('#registerConfirm').value;
    if(displayName.length<2)return setMessage('Informe um nome para exibição.','danger');
    if(!/^[a-z0-9._-]{3,30}$/.test(username))return setMessage('Use de 3 a 30 caracteres no usuário.','danger');
    if(password.length<6)return setMessage('A senha precisa ter pelo menos 6 caracteres.','danger');
    if(password!==confirm)return setMessage('As senhas não correspondem.','danger');
    if(findUser(username))return setMessage('Esse usuário já existe neste navegador.','danger');
    try{setMessage('Criando usuário local…'); const salt=bytesToBase64(randomBytes(16)),passwordHash=await digestPassword(password,salt); const user={id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}`,username,displayName,group,role:'aluno',salt,passwordHash,createdAt:new Date().toISOString()}; saveUsers([...users(),user]);currentUser={...user};await saveSession({locked:false});log('usuario_criado',{group});await finish();}
    catch(e){setMessage(e.message||'Não foi possível criar o usuário.','danger');}
  }
  async function login(ev){
    ev.preventDefault(); const username=normalizeUsername($('#loginUsername').value),password=$('#loginPassword').value,user=findUser(username); if(!user)return setMessage('Usuário local não encontrado.','danger');
    try{setMessage('Verificando…'); const hash=await digestPassword(password,user.salt); if(!safeEqual(hash,user.passwordHash)){log('login_falhou',{reason:'senha_incorreta'});return setMessage('Senha incorreta.','danger');} currentUser={...user};await saveSession({locked:false});log('login_realizado');await finish();}
    catch(e){setMessage(e.message||'Não foi possível entrar.','danger');}
  }
  async function unlock(ev){ ev.preventDefault(); if(!currentUser)return switchUser(); try{const hash=await digestPassword($('#unlockPassword').value,currentUser.salt);if(!safeEqual(hash,currentUser.passwordHash))return setMessage('Senha incorreta.','danger');await saveSession({locked:false});log('sessao_desbloqueada');await finish();}catch(e){setMessage(e.message||'Falha ao desbloquear.','danger');}}
  async function lock(){ await saveSession({locked:true});log('sessao_bloqueada');$('#userPopover').hidden=true;$('#authGate').hidden=false;$('#authTabs').hidden=true;$('#loginForm').hidden=true;$('#registerForm').hidden=true;$('#unlockForm').hidden=false;$('#lockedUserName').textContent=`${currentUser.displayName}, sessão bloqueada`;$('#unlockPassword').value=''; }
  async function logout(){log('logout');localStorage.removeItem(key('session'));currentUser=null;$('#userMenu').hidden=true;$('#appMain').hidden=true;showAuth();}
  async function switchUser(){log('troca_de_usuario');localStorage.removeItem(key('session'));currentUser=null;$('#userMenu').hidden=true;$('#appMain').hidden=true;showAuth();}
  async function restore(){
    const session=await readSession(); if(!session)return showAuth(); const user=findUser(session.username); if(!user)return showAuth(); currentUser={...user}; updateUserUi(); log('sessao_restaurada');
    if(session.locked){$('#authGate').hidden=false;$('#authTabs').hidden=true;$('#loginForm').hidden=true;$('#registerForm').hidden=true;$('#unlockForm').hidden=false;$('#lockedUserName').textContent=`${currentUser.displayName}, sessão bloqueada`;}
    else await finish();
  }
  function bind(){
    $$('[data-auth-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.authTab)); $('#loginForm').addEventListener('submit',login);$('#registerForm').addEventListener('submit',register);$('#unlockForm').addEventListener('submit',unlock);$('#unlockSwitch').onclick=switchUser;
    $('#userButton').onclick=()=>$('#userPopover').hidden=!$('#userPopover').hidden;$('#lockButton').onclick=lock;$('#switchButton').onclick=switchUser;$('#logoutButton').onclick=logout;
    document.addEventListener('click',e=>{if(!e.target.closest('#userMenu'))$('#userPopover').hidden=true;});
  }
  async function acceptCoreUser(info={}){const email=String(info.email||'').trim().toLowerCase(),displayName=String(info.full_name||email||'Estudante').trim();currentUser={id:String(info.id||email),username:email||String(info.id||'agv-core'),displayName,group:String(info.class_name||''),role:'aluno',central:true,createdAt:new Date().toISOString()};updateUserUi();await finish();log('agv_core_sessao_aceita',{email,group:currentUser.group});return currentUser;}
  async function init(){bind();await restore();}
  return {init,currentUser:()=>currentUser,saveSession,log,lock,logout,switchUser,acceptCoreUser};
})();
document.addEventListener('DOMContentLoaded',()=>AppSharedAuth.init());

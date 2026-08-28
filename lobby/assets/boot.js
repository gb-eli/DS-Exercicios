const VERSION='14.10.8.36';
const repairUrl=()=>new URL('../repair-lobby.html',location.href).href;
const showRepairLink=()=>{
  const message=document.getElementById('login-message');
  if(!message||document.getElementById('lobby-repair-link'))return;
  const a=document.createElement('a');a.id='lobby-repair-link';a.href=repairUrl();a.textContent='Reparar Lobby / limpar versão antiga';a.style.cssText='display:inline-block;margin-top:10px;color:#67e8f9;font-weight:800;text-decoration:underline';message.insertAdjacentElement('afterend',a);
};
const showFatal=(error)=>{
  const code=String(error?.code||'boot_failed');
  const message=String(error?.message||error||'boot_failed');
  globalThis.__agvLobbyDiag?.record?.('error',{code,message,file:String(error?.fileName||error?.asset||''),line:Number(error?.lineNumber||0)||null,column:Number(error?.columnNumber||0)||null,stack:String(error?.stack||'')});
  globalThis.__agvLobbyDiag?.exposeError?.(code,message);
  console.error('Falha ao inicializar o AGV Lobby:',error);
  const login=document.getElementById('login');const game=document.getElementById('game-shell');const kicked=document.getElementById('kicked');const box=document.getElementById('login-message');
  login?.classList.remove('hidden');game?.classList.add('hidden');kicked?.classList.add('hidden');
  if(box){box.classList.add('error');box.textContent=`Não foi possível carregar o Lobby. Código: ${message.slice(0,100)}. As Atividades continuam disponíveis pelo Hub.`;}
  showRepairLink();
};
async function probeAsset(name){
  const url=new URL(`./${name}?v=${VERSION}&probe=${Date.now()}`,import.meta.url);
  try{
    const response=await fetch(url.href,{cache:'no-store'});
    const text=await response.text();
    const htmlLike=/^\s*<!doctype|^\s*<html/i.test(text);
    const versionOk=text.includes(VERSION);
    const evidence={asset:name,url:url.href,status:response.status,contentType:response.headers.get('content-type')||'',bytes:text.length,htmlLike,versionOk};
    globalThis.__agvLobbyDiag?.record?.('boot_asset_probe',evidence);
    if(!response.ok||htmlLike||!versionOk){const e=new Error(`asset_invalido:${name}`);e.code='boot_asset_invalid';e.asset=url.href;throw e;}
    return evidence;
  }catch(error){if(error?.code)throw error;globalThis.__agvLobbyDiag?.record?.('boot_asset_probe_error',{asset:name,message:String(error?.message||error)});return null;}
}
async function start(){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'boot_module_loading'});
  for(const asset of ['lobby.js','supabase.js','config.js','lobby3d.js','lobby-lite.js'])await probeAsset(asset);
  const url=new URL(`./lobby.js?v=${VERSION}`,import.meta.url);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_import',url:url.href});
  await import(url.href);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_loaded'});
}
start().catch(showFatal);

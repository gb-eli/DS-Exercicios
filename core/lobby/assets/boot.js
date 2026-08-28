const showFatal=(error)=>{
  globalThis.__agvLobbyDiag?.record?.('error',{code:'boot_failed',message:String(error?.message||error||'boot_failed'),file:String(error?.fileName||''),line:Number(error?.lineNumber||0)||null,column:Number(error?.columnNumber||0)||null,stack:String(error?.stack||'')});
  globalThis.__agvLobbyDiag?.exposeError?.('boot_failed',String(error?.message||error||'boot_failed'));
  console.error('Falha ao inicializar o AGV Lobby:',error);
  const login=document.getElementById('login');
  const game=document.getElementById('game-shell');
  const kicked=document.getElementById('kicked');
  const message=document.getElementById('login-message');
  login?.classList.remove('hidden');
  game?.classList.add('hidden');
  kicked?.classList.add('hidden');
  if(message){
    message.classList.add('error');
    message.textContent=`Não foi possível carregar o Lobby. Código: ${String(error?.message||'boot_failed').slice(0,80)}. As Atividades continuam disponíveis pelo Hub.`;
  }
};

globalThis.__agvLobbyDiag?.record?.('stage',{stage:'boot_module_loading'});
import('./lobby.js?v=14.10.8.35').then(()=>globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_loaded'})).catch(showFatal);

const showFatal=(error)=>{
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
    message.textContent='Não foi possível carregar o Lobby. Recarregue a página. As Atividades continuam disponíveis pelo Hub.';
  }
};

import('./lobby.js?v=14.8.3').catch(showFatal);

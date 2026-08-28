# Checklist manual — Fliperama DS v0.31.0

## Publicação

- [ ] `index.html` está na raiz publicada.
- [ ] `version.json` mostra v0.31.0 / Fase 7.12.
- [ ] `diagnostico.html` não aponta arquivos ausentes.
- [ ] o Service Worker troca para os caches v0.31.0.

## VoxelCraft — computador

- [ ] abrir em Automático e iniciar um mundo novo;
- [ ] confirmar que o primeiro clique captura o mouse sem quebrar bloco;
- [ ] mover com WASD/setas;
- [ ] olhar com o mouse;
- [ ] pular com Espaço e correr com Shift;
- [ ] quebrar com clique esquerdo ou Q;
- [ ] construir com clique direito ou E;
- [ ] trocar câmera com V ou pelo menu;
- [ ] conferir a câmera externa perto de paredes e encostas;
- [ ] salvar, sair, continuar e confirmar posição/inventário;
- [ ] concluir a missão educativa e receber bônus de XP.

## VoxelCraft — celular/tablet

- [ ] joystick esquerdo move sem ficar preso;
- [ ] joystick direito gira e inclina a câmera;
- [ ] botões Pular, Quebrar, Construir, Consumir e Agachar respondem;
- [ ] HUD e painel educativo não cobrem os controles;
- [ ] orientação paisagem mantém botões acessíveis;
- [ ] modo Econômico mantém FPS aceitável;
- [ ] sair e voltar não deixa áudio, canvas ou controles ativos.

## Gamepad

- [ ] analógico esquerdo move;
- [ ] analógico direito olha;
- [ ] A pula;
- [ ] gatilhos quebram e constroem;
- [ ] Y troca a câmera;
- [ ] desconectar o controle não trava o jogo.

## Recuperação e segurança

- [ ] bloquear IndexedDB e confirmar fallback LOCAL;
- [ ] bloquear também localStorage e confirmar aviso MEMÓRIA;
- [ ] abrir no modo seguro pelo modal de erro;
- [ ] cair abaixo do mundo e confirmar recuperação;
- [ ] tentar colocar bloco dentro do personagem e confirmar bloqueio;
- [ ] editar blocos em bordas de chunk e conferir faces;
- [ ] alternar abas durante a partida e confirmar pausa/salvamento.

## Plataforma geral

- [ ] abrir os outros 17 jogos e confirmar preservação;
- [ ] testar menu, catálogo, museu e linha do tempo;
- [ ] testar 360 px, 390 px, tablet e desktop;
- [ ] conferir console do navegador sem erros críticos.

# Changelog — Fliperama DS v0.31.0

## Fase 7.12 — Recuperação completa do VoxelCraft DS

### Adicionado

- fallback automático para qualidade Econômica;
- armazenamento em IndexedDB, localStorage e memória;
- fila de gravações;
- status do backend de armazenamento no HUD;
- botão para abrir em modo seguro;
- validação de spawn e recuperação anti-travamento;
- colisão da câmera em terceira pessoa;
- coyote time e jump buffer;
- suporte a gamepad;
- comandos Q, E e V como alternativas ao mouse;
- missão educativa com conclusão e bônus de XP;
- testes dedicados do VoxelCraft.

### Corrigido

- VoxelCraft não é mais tratado como protótipo;
- falha de IndexedDB não impede continuar a sessão;
- saves inválidos não restauram dentro do terreno;
- blocos não podem ser colocados sobre o corpo do jogador;
- faces em bordas de chunks não permanecem desatualizadas;
- primeira interação do mouse não quebra bloco antes de capturar o ponteiro;
- câmera externa não permanece dentro do terreno;
- edições não crescem sem limite;
- mensagens entre iframe e Fliperama tratam modo seguro e erro;
- tempo limite de abertura ampliado para dispositivos fracos.

### Preservado

- 105 módulos;
- 18 experiências atuais;
- catálogo, museu e linha do tempo existentes;
- modos Aprendizagem, Livre e Desafio;
- inventário e recursos anteriores;
- validações das Fases 7.7 a 7.11.

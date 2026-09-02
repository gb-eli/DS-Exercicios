# Guia de implantação — F94.7

Base obrigatória: F94.6.

## Implantação recomendada

1. Aplicar o PATCH F94.7 sobre a F94.6 publicada.
2. Publicar todos os arquivos do patch no mesmo deploy; não publicar apenas `player-locomotion.js`.
3. Confirmar que `lobby/sw.js` contém `stage69-f947-locomotion-live`.
4. Fechar abas antigas do AGV World e reabrir o Lobby.
5. Confirmar que o Service Worker assume a nova versão.

## Smoke test mínimo

Testar em 2D e 3D:

- Campus;
- Vale;
- Rural;
- Parque;
- Colégio;
- Museu;
- Lua e Marte.

Em cada mundo:

- caminhar sem Shift;
- correr com Shift;
- soltar a tecla e verificar desaceleração curta, sem deslize longo;
- mover na diagonal;
- teleportar/fast travel e confirmar que não existe velocidade residual;
- entrar/sair de interior quando existir;
- confirmar que rover/ride/airdrop continua independente da caminhada.

## Critério de aceite

A sensação de caminhada/corrida deve ser equivalente entre mapas normais. Diferenças devem existir apenas quando declaradas como mecânica do ambiente (Lua, veículo, ride, airdrop etc.).

Se o Lobby ficar preso no login ou misturar versão antiga, o primeiro item a verificar é o Service Worker/cache: a cadeia correta é `stage69-f947-locomotion-live`.

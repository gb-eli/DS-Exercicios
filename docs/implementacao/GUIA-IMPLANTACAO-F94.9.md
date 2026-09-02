# Guia de implantação — F94.9 Interaction V2

1. Partir da F94.8 Camera V2.
2. Aplicar o PATCH F94.9 preservando a estrutura de diretórios.
3. Publicar todos os arquivos do patch de uma vez, especialmente `lobby/index.html`, `lobby/sw.js`, `lobby/assets/boot.js`, `lobby/assets/vendor-loader.js`, `lobby/assets/sw-register.js`, `lobby/assets/lobby.js`, `lobby/assets/lobby.css` e `lobby/assets/core/interaction-v2/*`.
4. Confirmar que o Service Worker ativo usa `stage71-f949-interaction-v2`.
5. Smoke test: abrir Lobby, aproximar-se de NPC, banco, portal, prédio, veículo terrestre, veículo aéreo, Vale e um objeto apenas informativo.
6. Confirmar que objetos não funcionais não exibem verbos como `Dirigir` ou `Jogar`.
7. Não há migration, Edge Function ou alteração de Supabase nesta fase.

Se houver cache antigo, usar o fluxo de reparo já existente do Lobby antes de concluir que a F94.9 falhou.

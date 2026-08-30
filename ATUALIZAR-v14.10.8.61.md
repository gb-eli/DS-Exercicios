# v14.10.8.61 — Campus Connected Architecture

Base: v14.10.8.60 R2.

## Objetivo
Evoluir o Lobby como campus navegável, tornando os prédios conectados às ferramentas parte real do mapa 2D/3D, com arquitetura própria, entradas coerentes, passarelas e sinalização.

## Entregas
- 10 prédios funcionais recebem arquétipos arquitetônicos próprios em 2D e 3D.
- Cada prédio passa a possuir `footprint`, rotação voltada ao centro do Campus, distrito e ponto de entrada calculado.
- A interação e o teletransporte levam o usuário até a entrada do prédio, e não mais ao centro da construção.
- Nova malha `campus-connections.js` com promenade acadêmica, eixo de provas/Vale, boulevards leste/oeste e conexões diagonais.
- Portais de distrito e sinalização física orientam o deslocamento.
- Banco, Plataforma Unificada e Loja recebem skybridges no Centro Cívico.
- Prédios conectados entram no sistema de colisão 3D para impedir atravessar paredes.
- Painel `🧭 Campus` recebe diretório de prédios com acesso rápido às entradas.
- Boot e Service Worker passam a validar e cachear explicitamente `campus-destinations.js` e `campus-connections.js`, reduzindo risco de novo deploy parcial/404.
- Página `repair-lobby.html` testa também destinos e conexões.
- Mantidos 2D-first, modo 3D opcional, autenticação unificada, rotas existentes e schema Supabase sem alterações.

## Arquiteturas
- Plataforma Unificada: campus-hall
- Laboratório Virtual: research-lab
- CTF DS: cyber-fortress
- COSMOS: observatory
- Desafio DS: challenge-arena
- Fliperama DS: arcade
- Desafio Informática: innovation-center
- Centro de Provas: exam-center
- Banco AGV: bank
- Loja AGV: store

## Pós-publicação
1. Abrir `/lobby/assets/world/campus-connections.js` e confirmar HTTP 200.
2. Abrir `/lobby/assets/world/dynamic-world.js` e confirmar HTTP 200.
3. Executar `/repair-lobby.html`.
4. Abrir `/lobby/` e validar mapa 2D, diretório de prédios e modo 3D.
5. Testar entrada em pelo menos Plataforma Unificada, Banco, Loja, CTF e COSMOS.

Não há migrations, SQL ou alterações de schema nesta release.

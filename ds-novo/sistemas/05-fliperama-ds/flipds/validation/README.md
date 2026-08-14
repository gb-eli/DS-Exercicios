# Validação — Fliperama DS v0.37.0

Arquivos atuais principais:

- `test-duo-elementos-v0.37.0.js` — 88 verificações do novo jogo e Multiplayer Local Core.
- `audit-games.js` — auditoria das 19 experiências.
- `test-cpu-multiplayer-quality.js` — regressão competitiva e perfis.
- `release-regression-results-v0.37.0.json` — consolidação das suítes atuais.

Relatórios históricos de versões anteriores são preservados e não devem ser reinterpretados como requisitos de schema atual.

# Validação do Fliperama DS v0.34.1

## Suítes

- `audit-games.js` — 18 experiências e 109 verificações gerais;
- `test-arcade-expansion.js` — 37 testes das campanhas arcade;
- `test-platform-physics.js` — 16 testes físicos;
- `test-3d-experiences.js` — 26 testes 3D;
- `test-voxelcraft.js` — 22 testes do VoxelCraft;
- `test-museum-timeline.js` — 62 testes do museu e da linha do tempo;
- `test-educational-content.js` — 120 testes educacionais.

## Resultado consolidado

392 verificações aprovadas e 0 falhas automatizadas.

Os arquivos `*-test-results.json` guardam os resultados detalhados. A matriz atual é `MATRIZ-TESTES-JOGOS-v0.34.1.md`.

- `test-cpu-multiplayer-quality.js` — CPU, multiplayer local, controles, contexto e qualidade funcional.

## v0.36.0 — Fase 7.17A

- `test-progression-expansion-v0.36.0.js`: valida 6 fases do Trap Lab, 5 mapas do Labirinto de Dados, 12 salas da Aventura de Salas, 6 zonas da Ponte e compatibilidade de save do Reator de Blocos.
- `progression-expansion-results-v0.36.0.json`: resultado da suíte específica da expansão.
- `test-platform-physics.js`: agora inclui a física das novas zonas e registra 18 verificações.
- `audit-games.js`: matriz geral atualizada para v0.36.0.

## v0.36.1 — Fase 7.17B

- `test-progression-expansion-v0.36.1.js`: valida 12 desafios do Puzzle Forge, estrelas, 5 pistas/12 voltas do Raster Rally, 5 mapas/5 missões + objetivo opcional do State Quest e 3 operações do Raycast.
- `progression-expansion-results-v0.36.1.json`: resultado da suíte específica do bloco 2 de expansão.
- `audit-games.js`: matriz geral atualizada para v0.36.1.

- `test-plataforma-poligonal-v0.38.0.js` — 87 verificações da campanha 3D em terceira pessoa.

# Changelog — Fliperama DS v0.27.0

## Fase 7.8 — Diagnóstico de lógica e alcançabilidade

### Correções críticas

- conectadas as três células isoladas da fase 1 do Labirinto de Dados;
- adicionado cálculo de alcançabilidade ao gerador de coletas do Labirinto de Dados;
- impedida a criação de pellets e pontos de poder fora da região acessível;
- adicionado reparo automático de rota ao editor do Puzzle Forge;
- aberta passagem para o Console do Núcleo no State Quest RPG;
- conectada a área inicial dos Corredores Raycast ao mapa principal;
- corrigida repetição contínua do evento de checkpoint no Trap Lab.

### Validação

- criado `validation/audit-games.js`;
- criado `validation/game-audit-results.json`;
- criado `diagnostico-jogos.html`;
- criada matriz de testes para 18 experiências;
- 33 verificações aprovadas;
- 5 alertas de playtest;
- 0 falhas automatizadas após as correções.

### Infraestrutura

- versão atualizada para v0.27.0;
- Service Worker atualizado para caches v0.27.0;
- páginas de diagnóstico adicionadas ao shell offline;
- instruções de abertura e publicação atualizadas.

### Preservação

- nenhum jogo foi removido;
- nenhum jogo novo foi adicionado;
- VoxelCraft permanece como Protótipo;
- mídias, catálogo, museu e recursos anteriores foram preservados.

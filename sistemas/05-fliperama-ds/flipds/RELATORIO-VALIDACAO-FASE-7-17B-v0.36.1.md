# Relatório de validação — Fliperama DS v0.36.1

## Fase 7.17B — Expansão real das fases · Bloco 2/3

### Escopo

A v0.36.1 expande quatro runtimes existentes sem adicionar novos jogos ao catálogo. A meta foi aumentar duração, progressão e variedade mantendo o trabalho anterior de UX, gráficos, física, CPU/multiplayer e compatibilidade de saves.

### Puzzle Forge DS

- 4 modalidades com 3 desafios consecutivos cada;
- total de 12 desafios curados;
- avaliação final de 1–3 estrelas;
- editor 7×7 preservado;
- schema 2; saves schema 1 permanecem jogáveis sem progresso inventado.

### Raster Rally

- 5 pistas em vez de 3;
- 12 voltas totais de campeonato;
- Anel Metro Neon e Passo do Eclipse possuem 3 voltas;
- progressão automática reutiliza a arquitetura existente.

### State Quest RPG

- 5 mapas: Vila de Itera, Campo de Ruído, Arquivo de Ecos, Torre de Sincronização e Instalação do Núcleo;
- 5 missões encadeadas;
- Cache de Memória opcional com bônus de exploração;
- dois finais preservados;
- schema 2 com migração de saves antigos que já haviam chegado ao Núcleo.

Durante a auditoria, entidades novas posicionadas sobre paredes foram detectadas e corrigidas antes da publicação.

### Corredores Raycast

- 3 operações em mapas 24×18;
- Operação 1: Nó de Entrada;
- Operação 2: Arquivo Submerso;
- Operação 3: Núcleo Espectral;
- requisitos de chaves e terminais variam por operação;
- schema 2 guarda `mapIndex`; schema 1 migra para a primeira operação.

### Resultados automatizados

- Auditoria geral: 116/116;
- CPU/multiplayer: 116/116;
- expansão arcade: 37/37;
- conteúdo educacional: 120/120;
- Museu/Linha do Tempo: 62/62;
- UX/responsividade: 25/25;
- física: 18/18;
- experiências 3D: 26/26;
- VoxelCraft: 22/22;
- regressão da expansão v0.36.0: 38/38;
- expansão v0.36.1: 47/47.

**Total funcional/regressivo: 627 aprovações · 0 falhas.**

Testes históricos de congelamento visual das versões v0.35.x permanecem arquivados como evidência das fases gráficas. Eles não são usados para exigir hash idêntico após mudanças intencionais de simulação nas versões v0.36.x.

### Limitação de ambiente

O playtest visual perceptivo em Chromium não é considerado concluído neste ambiente quando o navegador local falha por restrições de GPU/DBus/política. O checklist manual cobre toque, áudio, frame pacing, legibilidade e sensação de jogo.

### Integridade de publicação

- 21 arquivos JavaScript passaram na checagem de sintaxe;
- 33 JSONs válidos;
- 86 SVGs válidos.
- 274/274 rotas HTTP responderam corretamente na checagem final de publicação.

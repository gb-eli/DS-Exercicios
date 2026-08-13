# Ordem de atualização no GitHub — Fase 18

## Opção recomendada

Extraia `cosmos-ds-fase-18-arquivos-alterados.zip` e envie o conteúdo preservando exatamente os caminhos existentes.

## Ordem manual

1. `public/assets/premium/models/` — substituir os 24 GLBs;
2. `public/assets/premium/manifest.json`;
3. `src/core/assets/` — parser, player, manager, colliders e orquestrador;
4. `src/rendering/` — renderizadores premium;
5. `src/data/` e `src/modules/premium-assets/`;
6. `src/app/CosmosApp.js`, `src/core/modules/ModuleRegistry.js` e `src/styles.css`;
7. `service-worker.js`, `public/manifest.webmanifest`, `index.html` e `package.json`;
8. `scripts/`, `tests/`, `README.md`, `CHANGELOG.md` e `docs/`.

## Após o upload

- aguarde o GitHub Pages concluir a implantação;
- faça recarregamento forçado;
- abra o Estúdio Premium;
- teste pelo menos uma animação de cada família;
- teste LOD Automático, Desempenho e Experiência;
- confirme que o badge mostra peças e animações;
- teste um laboratório integrado e o fallback procedural.

Não apague arquivos das fases anteriores. A Fase 18 não remove nenhum caminho existente.

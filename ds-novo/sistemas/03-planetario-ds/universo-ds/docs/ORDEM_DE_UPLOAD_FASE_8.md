# Ordem de atualização no GitHub — Fase 8

## Opção recomendada

Extraia o pacote incremental na raiz do repositório, preservando os caminhos. Ele contém somente arquivos novos ou alterados em relação à Fase 7.

## Ordem manual

1. Envie os novos diretórios:
   - `src/core/station/`
   - `src/modules/space-station/`
2. Envie os novos arquivos:
   - `src/data/stationSystems.js`
   - `src/rendering/StationSceneRenderer.js`
   - `src/workers/station.worker.js`
   - `tests/station-worker-node-harness.mjs`
   - `scripts/audit-graphics.mjs`
3. Substitua os arquivos de integração:
   - `src/core/modules/ModuleRegistry.js`
   - `src/app/CosmosApp.js`
   - `src/styles.css`
   - `service-worker.js`
   - `public/manifest.webmanifest`
   - `index.html`
4. Substitua os renderizadores revisados:
   - `src/rendering/MarsSceneRenderer.js`
   - `src/rendering/LunarSceneRenderer.js`
5. Substitua validação e metadados:
   - `package.json`
   - `scripts/check-project.mjs`
   - `tests/run-tests.mjs`
   - `tests/SMOKE_TEST.md`
   - `README.md`
   - `CHANGELOG.md`
6. Envie os documentos da Fase 8.

## Após o upload

- aguarde a publicação do GitHub Pages;
- faça uma recarga ignorando cache;
- confirme o card **Estação Espacial**;
- verifique o cache `cosmos-ds-fase-8-v1`;
- abra exterior, interior e EVA;
- teste câmera, zoom e fullscreen;
- execute `npm run validate` localmente quando possível;
- teste Android, iPhone, Chromebook e notebook Windows.

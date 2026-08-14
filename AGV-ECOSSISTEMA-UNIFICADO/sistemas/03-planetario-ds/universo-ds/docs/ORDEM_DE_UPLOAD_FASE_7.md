# Ordem de atualização no GitHub — Fase 7

## Opção recomendada

Extraia o pacote incremental na raiz do repositório, preservando os caminhos. Ele contém somente arquivos novos ou alterados em relação à Fase 6.

## Ordem manual

1. Envie os novos diretórios:
   - `src/core/mars/`
   - `src/modules/mars-robotics/`
2. Envie os novos arquivos:
   - `src/data/marsSystems.js`
   - `src/rendering/MarsSceneRenderer.js`
   - `src/workers/mars.worker.js`
   - `tests/mars-worker-node-harness.mjs`
3. Substitua os arquivos de integração:
   - `src/core/modules/ModuleRegistry.js`
   - `src/app/CosmosApp.js`
   - `src/styles.css`
   - `service-worker.js`
   - `public/manifest.webmanifest`
   - `index.html`
4. Substitua validação e metadados:
   - `package.json`
   - `scripts/check-project.mjs`
   - `tests/run-tests.mjs`
   - `tests/SMOKE_TEST.md`
   - `README.md`
   - `CHANGELOG.md`
5. Envie os documentos da Fase 7.

## Após o upload

- aguarde a publicação do GitHub Pages;
- recarregue uma vez ignorando cache;
- confirme o card **Marte e Robótica**;
- abra o módulo e verifique o Worker;
- confirme a atualização do Service Worker `cosmos-ds-fase-7-v1`;
- teste em celular e notebook.

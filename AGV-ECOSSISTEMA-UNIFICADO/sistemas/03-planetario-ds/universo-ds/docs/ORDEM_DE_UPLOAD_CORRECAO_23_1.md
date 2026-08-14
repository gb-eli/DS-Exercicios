# Ordem de atualização no GitHub — Correção 23.1

## Forma mais segura

Extraia o pacote incremental na raiz do repositório e aceite a substituição dos arquivos existentes.

## Ordem manual

1. `src/core/assets/ResourceLoader.js`
2. `src/core/assets/PremiumAssetManager.js`
3. `src/rendering/PremiumAssetOverlayRenderer.js`
4. `src/core/assets/PremiumIntegrationOrchestrator.js`
5. `src/styles.css`
6. `service-worker.js`
7. `index.html`
8. `package.json`
9. `scripts/check-project.mjs`
10. `tests/run-tests.mjs`
11. `README.md`
12. `CHANGELOG.md`
13. arquivos novos em `docs/`

Depois da publicação, atualize a página ignorando cache. Em Android, também pode ser necessário fechar e reabrir a prévia para remover o Service Worker antigo.

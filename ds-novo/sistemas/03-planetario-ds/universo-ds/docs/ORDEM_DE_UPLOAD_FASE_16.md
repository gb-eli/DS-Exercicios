# Ordem de atualização no GitHub — Fase 16

## Opção recomendada

Extraia `cosmos-ds-fase-16-arquivos-alterados.zip` na raiz do repositório, preservando os caminhos.

## Upload manual

1. Envie primeiro `public/assets/premium/` por completo.
2. Envie `src/core/assets/`.
3. Envie:
   - `src/data/premiumAssetSystems.js`;
   - `src/modules/premium-assets/PremiumAssetsModule.js`;
   - `src/rendering/PremiumAssetSceneRenderer.js`.
4. Substitua:
   - `src/core/modules/ModuleRegistry.js`;
   - `src/styles.css`;
   - `service-worker.js`;
   - `public/manifest.webmanifest`;
   - `index.html`;
   - `package.json`;
   - `README.md`;
   - `CHANGELOG.md`.
5. Envie os arquivos de `scripts/`, `tests/` e `docs/` incluídos no pacote incremental.

## Depois do upload

1. Aguarde a conclusão do GitHub Pages.
2. Faça uma atualização forçada da página.
3. Caso o Service Worker antigo ainda apareça, feche as abas do COSMOS DS e abra novamente.
4. Abra **Assets Premium 3D/360°**.
5. Teste pelo menos:
   - troca de três assets;
   - LOD Automático, 0, 1 e 2;
   - PBR, raio X, normais e térmico;
   - corte técnico;
   - fullscreen;
   - pacote offline;
   - saída e retorno ao portal.

## Observação

Não renomeie os arquivos GLB, WebP ou HDR sem atualizar `public/assets/premium/manifest.json`.

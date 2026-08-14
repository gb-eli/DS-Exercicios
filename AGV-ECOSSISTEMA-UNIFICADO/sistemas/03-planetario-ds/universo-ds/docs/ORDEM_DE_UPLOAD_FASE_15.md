# Ordem de atualização no GitHub — Fase 15

Para atualizar uma instalação íntegra da Fase 14, extraia o pacote incremental e envie os arquivos preservando os caminhos.

## Ordem recomendada

1. Envie as novas pastas de núcleo:
   - `src/core/deep-space/`
   - `src/core/museum-remaster/`
2. Envie os novos dados:
   - `src/data/deepSpaceSystems.js`
   - `src/data/visualMuseumSystems.js`
3. Envie os novos módulos:
   - `src/modules/deep-space-remaster/`
   - `src/modules/visual-museum/`
4. Envie os novos renderizadores:
   - `src/rendering/DeepSpaceSceneRenderer.js`
   - `src/rendering/SpaceMuseumSceneRenderer.js`
5. Substitua:
   - `src/core/modules/ModuleRegistry.js`
   - `src/app/CosmosApp.js`
   - `src/styles.css`
6. Substitua os arquivos de validação:
   - `scripts/audit-graphics.mjs`
   - `scripts/check-project.mjs`
   - `tests/run-tests.mjs`
7. Envie a documentação da Fase 15.
8. Por último, substitua:
   - `index.html`
   - `public/manifest.webmanifest`
   - `service-worker.js`
   - `package.json`
   - `README.md`
   - `CHANGELOG.md`

## Após o upload

1. Aguarde a implantação do GitHub Pages.
2. Recarregue ignorando o cache.
3. Confirme que o portal mostra **19 laboratórios**.
4. Abra Universo Profundo e Museu Visual.
5. Teste teclado, mouse, toque, joystick, fullscreen e modo foto.
6. Em caso de cache antigo, feche todas as abas do site e abra novamente.

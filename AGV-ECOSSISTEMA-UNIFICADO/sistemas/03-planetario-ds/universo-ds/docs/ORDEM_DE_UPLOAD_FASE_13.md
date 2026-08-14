# Ordem de atualização no GitHub — Fase 13

## Opção recomendada

Extraia `cosmos-ds-fase-13-arquivos-alterados.zip` sobre a raiz atual da Fase 12, preservando as pastas.

## Ordem manual

1. Envie as pastas novas:
   - `src/core/station-remaster/`
   - `src/modules/station-remaster/`
2. Envie os arquivos novos:
   - `src/data/stationRemasterSystems.js`
   - `src/rendering/StationRemasterSceneRenderer.js`
   - `src/workers/orbital-flight.worker.js`
   - `tests/orbital-flight-worker-node-harness.mjs`
3. Substitua os arquivos de integração:
   - `src/core/input/ImmersiveInputController.js`
   - `src/core/modules/ModuleRegistry.js`
   - `src/styles.css`
   - `scripts/audit-graphics.mjs`
   - `scripts/check-project.mjs`
   - `tests/run-tests.mjs`
4. Substitua os arquivos da raiz:
   - `index.html`
   - `package.json`
   - `service-worker.js`
   - `README.md`
   - `CHANGELOG.md`
5. Envie a documentação da Fase 13.

## Depois do upload

1. Aguarde a publicação do GitHub Pages.
2. Faça recarregamento forçado no navegador.
3. Se a PWA continuar mostrando a versão antiga, feche a aba e abra novamente para o novo Service Worker assumir o controle.
4. Abra **Estação Espacial Imersiva 360°**.
5. Teste câmera, fullscreen, joystick, troca de estação, veículo, satélite e acoplamento.

Nenhum arquivo antigo precisa ser apagado nesta atualização.

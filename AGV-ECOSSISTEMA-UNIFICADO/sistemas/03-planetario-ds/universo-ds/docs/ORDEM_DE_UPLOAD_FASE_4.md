# Ordem de atualização no GitHub — Fase 4

## Opção recomendada: pacote incremental

Extraia `cosmos-ds-fase-4-arquivos-alterados.zip` e envie os arquivos mantendo os caminhos internos.

### 1. Núcleo e configuração

1. `index.html`
2. `package.json`
3. `public/manifest.webmanifest`
4. `service-worker.js`
5. `src/app/CosmosApp.js`
6. `src/core/modules/ModuleRegistry.js`
7. `src/styles.css`

### 2. Motor orbital

1. `src/core/orbit/OrbitMath.js`
2. `src/core/orbit/SatelliteSystem.js`
3. `src/data/orbitalSystems.js`
4. `src/workers/orbital.worker.js`

### 3. Visual e experiência

1. `src/rendering/EarthGlobeRenderer.js`
2. `src/modules/earth-orbit/EarthOrbitModule.js`

### 4. Validação

1. `scripts/check-project.mjs`
2. `tests/orbital-worker-node-harness.mjs`
3. `tests/run-tests.mjs`

### 5. Documentação

Envie os arquivos da pasta `docs/` presentes no pacote incremental, além de `README.md` e `CHANGELOG.md`.

## Após o upload

1. aguarde a execução do workflow de GitHub Pages;
2. abra o portal em uma aba anônima;
3. atualize duas vezes para o novo Service Worker assumir o controle;
4. verifique se o card **Terra, Satélites e Órbitas** aparece como disponível;
5. teste o módulo primeiro em **Máximo desempenho** e depois em **Máxima experiência**.

Não apague os módulos das Fases 1, 2 e 3.

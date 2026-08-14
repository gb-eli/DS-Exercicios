# Ordem de upload — Fase 9

Atualize o repositório a partir da Fase 8. Preserve os demais arquivos.

## Sequência recomendada

### 1. `CHANGELOG.md`

- `CHANGELOG.md`

### 2. `README.md`

- `README.md`

### 3. `package.json`

- `package.json`

### 4. `index.html`

- `index.html`

### 5. `service-worker.js`

- `service-worker.js`

### 6. `public`

- `public/manifest.webmanifest`

### 7. `src`

- `src/app/CosmosApp.js`
- `src/core/modules/ModuleRegistry.js`
- `src/core/observatory/ImagePipeline.js`
- `src/core/observatory/ObservationDatabase.js`
- `src/core/observatory/SpectrumAnalyzer.js`
- `src/core/observatory/TelescopeSystem.js`
- `src/data/observatorySystems.js`
- `src/main.js`
- `src/modules/observatory/ObservatoryModule.js`
- `src/rendering/UniverseSceneRenderer.js`
- `src/rendering/WebGLCosmosRenderer.js`
- `src/styles.css`
- `src/workers/observatory.worker.js`

### 8. `scripts`

- `scripts/audit-graphics.mjs`
- `scripts/check-project.mjs`

### 9. `tests`

- `tests/SMOKE_TEST.md`
- `tests/observatory-worker-node-harness.mjs`
- `tests/run-tests.mjs`

### 10. `docs`

- `docs/ARQUITETURA_OBSERVATORIO.md`
- `docs/ARQUIVOS_ALTERADOS_FASE_9.md`
- `docs/AUDITORIA_GRAFICA_FASE_9.md`
- `docs/FASE_9_ENTREGA.md`
- `docs/MAPA_FASE_9.md`
- `docs/ORDEM_DE_UPLOAD_FASE_9.md`
- `docs/PLANEJAMENTO_MESTRE.md`
- `docs/PLANO_FASE_10.md`
- `docs/PLANO_MELHORIA_GRAFICA_CONTINUA.md`
- `docs/RELATORIO_VALIDACAO_FASE_9.md`

## Depois do upload

1. Confirme que o GitHub Pages publicou a versão nova.
2. Faça recarga forçada para substituir o cache `cosmos-ds-fase-8-v1`.
3. Abra o Observatório e execute o smoke test.
4. Teste Desempenho, Equilibrado e Experiência em dispositivo real.
5. Não remova módulos anteriores.

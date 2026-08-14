# Ordem de atualização no GitHub — Fase 5

## Opção recomendada: pacote incremental

Extraia `cosmos-ds-fase-5-arquivos-alterados.zip` sobre a raiz do repositório, preservando os caminhos internos.

Ordem sugerida:

1. `src/data/launchSystems.js`
2. `src/core/launch/`
3. `src/workers/launch.worker.js`
4. `src/rendering/RocketSceneRenderer.js`
5. `src/modules/launch/LaunchModule.js`
6. `src/core/modules/ModuleRegistry.js`
7. `src/app/CosmosApp.js`
8. `src/styles.css`
9. `service-worker.js`
10. `public/manifest.webmanifest`
11. `index.html` e arquivos de versão
12. `scripts/`, `tests/` e `docs/`

Depois do upload:

```bash
npm run validate
```

No GitHub, aguarde o workflow de Pages e faça recarga forçada para substituir o cache da Fase 4.

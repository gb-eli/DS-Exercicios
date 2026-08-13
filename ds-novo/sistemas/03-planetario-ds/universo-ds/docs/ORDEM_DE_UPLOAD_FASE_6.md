# Ordem de atualização no GitHub — Fase 6

## Opção recomendada

Extraia o pacote incremental na raiz do repositório, permitindo a substituição dos arquivos existentes. O pacote preserva os caminhos corretos.

## Ordem manual

1. Envie os novos diretórios e arquivos da Fase 6:
   - `src/core/lunar/`
   - `src/modules/moon-apollo/`
   - `src/data/lunarSystems.js`
   - `src/rendering/LunarSceneRenderer.js`
   - `src/workers/lunar.worker.js`
   - `tests/lunar-worker-node-harness.mjs`
2. Substitua:
   - `src/core/modules/ModuleRegistry.js`
   - `src/app/CosmosApp.js`
   - `src/styles.css`
3. Substitua arquivos de versão e PWA:
   - `index.html`
   - `package.json`
   - `public/manifest.webmanifest`
   - `service-worker.js`
4. Substitua testes e scripts:
   - `scripts/check-project.mjs`
   - `tests/run-tests.mjs`
   - `tests/SMOKE_TEST.md`
5. Envie a documentação e substitua `README.md` e `CHANGELOG.md`.
6. Faça commit e push.
7. Aguarde o GitHub Actions concluir.
8. Abra a página e faça uma recarga forçada para remover o cache da Fase 5.

## Verificação

Execute localmente antes do push:

```bash
npm run validate
python3 -m http.server 4173
```

Confirme no portal:

- nove módulos disponíveis;
- card Lua e Apollo;
- título Fase 6;
- Service Worker `cosmos-ds-fase-6-v1`;
- funcionamento das cinco abas lunares.

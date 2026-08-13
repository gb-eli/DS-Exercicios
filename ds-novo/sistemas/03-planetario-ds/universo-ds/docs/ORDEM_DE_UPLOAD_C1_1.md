# Ordem de atualização no GitHub — C1.1

## Opção recomendada

Extraia o pacote incremental na raiz do repositório, preservando as pastas e substituindo os arquivos existentes.

## Ordem manual

### 1. Núcleo novo

1. `src/data/knowledge/spaceKnowledge.js`
2. `src/core/knowledge/KnowledgeEngine.js`
3. `src/core/knowledge/KnowledgeProfileStore.js`
4. `src/rendering/KnowledgeOrbRenderer.js`
5. `src/modules/curiosity-center/CuriosityCenterModule.js`
6. `public/data/knowledge/catalog.json`

### 2. Registro e integração

7. `src/core/modules/ModuleRegistry.js`
8. `src/app/CosmosApp.js`
9. `src/modules/solar-remaster/SolarSystemRemasterModule.js`
10. `src/modules/earth-orbit/EarthOrbitModule.js`
11. `src/modules/lunar-mars-remaster/LunarMarsRemasterModule.js`
12. `src/styles.css`

### 3. PWA e metadados

13. `service-worker.js`
14. `public/manifest.webmanifest`
15. `index.html`
16. `package.json`

### 4. Validação e documentação

Envie os arquivos de `scripts/`, `tests/`, `docs/`, além de `README.md` e `CHANGELOG.md`.

## Depois do upload

1. Aguarde a publicação do GitHub Pages.
2. Feche abas antigas da plataforma.
3. Abra novamente usando recarregamento completo.
4. Caso a versão anterior permaneça, limpe o cache do site ou remova o Service Worker antigo.
5. Teste diretamente com `?module=curiosity-center`.

## Verificação local

```bash
npm run validate
python3 -m http.server 4173
```

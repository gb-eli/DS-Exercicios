# Ordem de atualização no GitHub — Fase 12

Use o pacote incremental sobre a Fase 11.

## Ordem recomendada

1. `src/data/launchRemasterSystems.js`
2. `src/core/launch-remaster/LaunchExperienceModel.js`
3. `src/rendering/LaunchRemasterSceneRenderer.js`
4. `src/modules/launch-remaster/LaunchRemasterModule.js`
5. `src/core/modules/ModuleRegistry.js`
6. `src/app/CosmosApp.js`
7. `src/styles.css`
8. `service-worker.js`
9. `public/manifest.webmanifest`
10. `index.html`
11. `package.json`
12. `scripts/`
13. `tests/`
14. `docs/`
15. `README.md`
16. `CHANGELOG.md`

## Conferência após o upload

- o portal deve mostrar **15 laboratórios disponíveis**;
- `Lançamentos Imersivos 360°` deve aparecer primeiro;
- `Engenharia de Foguetes` deve continuar disponível;
- o módulo novo deve abrir sem a topbar tradicional;
- os quatro veículos devem ser selecionáveis;
- as oito câmeras devem responder;
- o lançamento deve ficar bloqueado antes das quatro inspeções;
- o Worker deve carregar por caminho relativo;
- o Service Worker deve utilizar `cosmos-ds-fase-12-v1`;
- `npm run validate` deve passar localmente.

## GitHub Pages

Não altere a estrutura de diretórios. Os imports e o Worker usam URLs relativas compatíveis com subpastas de repositório.

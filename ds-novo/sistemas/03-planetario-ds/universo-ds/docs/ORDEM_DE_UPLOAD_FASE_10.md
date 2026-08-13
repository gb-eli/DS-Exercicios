# Ordem de atualização no GitHub — Fase 10

Use esta ordem quando o repositório já possuir a Fase 9.

1. Envie as novas pastas e arquivos de `src/core/teacher/`.
2. Envie `src/core/evidence/`, `src/core/xr/`, `src/core/accessibility/` e `src/core/backup/`.
3. Envie `src/core/persistence/StorageDiagnostics.js`.
4. Envie `src/data/missionDirectorSystems.js`.
5. Envie `src/rendering/MissionDirectorRenderer.js`.
6. Envie `src/modules/mission-director/MissionDirectorModule.js`.
7. Atualize `ProfileStore.js`, `SettingsStore.js` e `ModuleRegistry.js`.
8. Atualize `CosmosApp.js`, `main.js` e `styles.css`.
9. Atualize `ObservatoryModule.js`.
10. Atualize `index.html`, manifesto, `service-worker.js` e `package.json`.
11. Envie scripts, testes e documentação.
12. Aguarde o GitHub Pages publicar a nova versão.
13. Recarregue com limpeza de cache ou feche e abra a PWA.

## Conferência

- o portal deve mostrar 13 laboratórios;
- a Fase 10 deve aparecer concluída;
- Direção de Missões deve abrir sem carregar outros laboratórios;
- plano com menos de 25 minutos deve ser rejeitado;
- exportação de evidência deve funcionar;
- o Service Worker deve usar `cosmos-ds-fase-10-v1`.

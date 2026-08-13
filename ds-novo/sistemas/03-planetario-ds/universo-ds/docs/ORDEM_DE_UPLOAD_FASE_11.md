# Ordem de atualização no GitHub — Fase 11

Use esta sequência quando o repositório já estiver publicado na **Fase 10**.

1. Envie `src/data/solarSystemBodies.js`.
2. Envie `src/core/solar/SolarNavigationModel.js`.
3. Envie `src/core/input/ImmersiveInputController.js`.
4. Envie `src/rendering/SolarSystemSceneRenderer.js`.
5. Envie `src/modules/solar-remaster/SolarSystemRemasterModule.js`.
6. Atualize `src/core/modules/ModuleRegistry.js`.
7. Atualize `src/app/CosmosApp.js` e `src/styles.css`.
8. Atualize `index.html`, `package.json`, `public/manifest.webmanifest` e `service-worker.js`.
9. Atualize scripts, testes, `README.md`, `CHANGELOG.md` e documentação.
10. Aguarde o GitHub Pages concluir a publicação.
11. Recarregue com limpeza de cache ou feche e abra novamente a PWA instalada.

## Conferência após publicar

- o portal deve mostrar **14 laboratórios disponíveis**;
- o novo card **Terra e Sistema Solar Remaster** deve ser o destaque principal;
- ao abrir o laboratório, a barra tradicional do portal deve desaparecer;
- a experiência deve iniciar em modo de inspeção 360°;
- mouse ou toque devem girar a câmera;
- a roda do mouse, gesto equivalente ou controles devem alterar o zoom;
- `WASD` deve controlar o voo livre depois da troca de câmera;
- os dois joysticks virtuais devem aparecer em telas móveis;
- a detecção de gamepad deve funcionar quando um controle compatível estiver conectado;
- devem existir dez corpos celestes selecionáveis e seis objetos orbitais;
- Saturno e Urano devem exibir anéis no modo compatível;
- o modo Máximo desempenho deve reduzir resolução, partículas e complexidade;
- o modo Máxima experiência deve ampliar atmosfera, estrelas, anéis, partículas e resolução;
- o modo fotográfico deve esconder a maior parte da HUD;
- o Service Worker deve utilizar `cosmos-ds-fase-11-v1`.

## Teste recomendado em dispositivo real

Realize pelo menos um teste em:

- celular Android em paisagem;
- celular em retrato, verificando a adaptação dos controles;
- notebook com teclado e mouse;
- computador com gamepad, quando disponível;
- perfil Máximo desempenho e perfil Máxima experiência.

A compilação final dos shaders deve ser confirmada em uma GPU física, porque ambientes headless podem usar somente o fallback Canvas 2D.

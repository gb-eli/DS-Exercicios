# Validação — v14.10.8.49

## Objetivo

Release gate operacional para a publicação do Campus DS sem alterar a URL existente do GitHub Pages.

## Critérios

- sintaxe JavaScript dos módulos do Lobby;
- imports relativos existentes;
- consistência do marcador `14.10.8.49` nos arquivos ativos;
- shell crítico do Service Worker presente no pacote;
- instalação do Service Worker atômica (`cache.addAll` antes de `skipWaiting`);
- ausência de instruções de exclusão no patch;
- scripts de publicação exigem árvore Git com pelo menos 3.000 arquivos rastreados;
- publicação bloqueia qualquer arquivo com status `D`;
- criação de backup remoto antes do push da `main`;
- rollback por `git revert`.

## Resultado

Os testes estáticos e de integração do patch foram executados antes do empacotamento. Teste visual WebGL em navegador real continua sendo parte do smoke pós-publicação no dispositivo final.

## Evidências executadas neste pacote

- JavaScript: 21 arquivos verificados com `node --check` — PASS.
- Imports relativos: 14 referências — 0 ausentes.
- Service Worker: 21 recursos críticos verificados no filesystem — 0 ausentes.
- Instalação atômica: `cache.addAll(CRITICAL_SHELL)` ocorre antes de `skipWaiting()` — PASS.
- HTTP local: 21/21 recursos críticos retornaram HTTP 200 — PASS.
- Runtime smoke: perfil de performance + manifesto espacial + Portal V2 (4/4) com Three.js local — PASS.
- Release JSON/version markers — PASS.
- Teste WebGL visual em navegador real: pendente para smoke pós-publicação no dispositivo final.

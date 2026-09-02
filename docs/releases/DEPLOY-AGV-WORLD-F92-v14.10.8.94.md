# Deploy AGV World F92 — v14.10.8.94

## Escopo

Atualização de **frontend + Service Worker** sobre uma instalação F91/F90/F89 já consolidada até a migration 079.

Não há migration nova e não é necessário republicar Edge Function para esta fase.

## Antes de publicar

1. Manter um ZIP íntegro da F91 para rollback.
2. Confirmar `LOBBY_VERSION=14.10.8.94`.
3. Confirmar Service Worker `agv-lobby-runtime-14.10.8.94-stage63-f92-mission-graphics`.
4. Confirmar `PUBLIC-DEPLOY.json` na fase 92.
5. Publicar somente os caminhos públicos indicados em `PUBLIC-DEPLOY.json`; não expor testes, ferramentas, banco ou documentação interna como rotas públicas.

## Publicação

1. Substituir os arquivos públicos do frontend pelo conteúdo da F92.
2. Garantir que `lobby/sw.js` seja publicado junto com `lobby/index.html` e `lobby/assets/`.
3. Invalidar o cache da CDN/host para `lobby/index.html`, `lobby/sw.js`, `lobby/assets/boot.js`, `lobby/assets/lobby.js` e `lobby/assets/core/world-adapter.js`.
4. Fechar e abrir novamente o Lobby em um navegador de validação.
5. Confirmar que o Service Worker ativo possui a identificação da F92.

## Smoke test obrigatório

1. Abrir a Base de Operações em 3D.
2. Alternar Ultra → Econômico e conferir pista, luzes, sombras, detalhes das construções e clima.
3. Entrar e sair dos hangares de Logística e Engenharia.
4. Abrir a Estação Orbital em 3D e conferir Terra, painéis solares, Central Interplanetária e transportes.
5. Alternar Ultra → Econômico e conferir estrelas, asteroides, emissivos e cúpula.
6. Viajar Estação → Lua → Estação e testar rover, salto, teleporte e retorno.
7. Viajar Estação → Marte → Estação e testar rover, salto, poeira, teleporte e retorno.
8. Em Lua e Marte, alternar Ultra → Econômico durante a execução.
9. Confirmar presença/chat/reunir isolados na área correta de cada mundo.
10. Retornar ao Campus e confirmar que os runtimes externos foram descartados.

## Critérios de aceite

- nenhum mundo retorna ao 2D por erro de primeiro frame;
- troca de qualidade não reinicia o runtime nem altera posição/presença;
- Econômico reduz detalhes, partículas, luzes, sombras e DPR;
- Alto/Ultra ativam camadas médias/premium conforme distância;
- ciclo temporal e clima continuam determinando a atmosfera;
- Lua e Marte continuam carregados somente durante a viagem;
- shell inicial não contém runtime 3D nem `mission-world-quality.js`.

## Rollback

Se houver falha funcional em produção:

1. republicar integralmente o frontend F91;
2. republicar o `lobby/sw.js` da F91;
3. invalidar cache do Lobby;
4. confirmar o cache `agv-lobby-runtime-14.10.8.93-stage62-f91-external-graphics`;
5. não reverter migrations, pois a F92 não altera banco.

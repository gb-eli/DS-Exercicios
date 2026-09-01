# AGV World F86 — Vilas DS Modulares

**Versão:** 14.10.8.88  
**Build:** stage57-f86-villages  
**Data:** 01/09/2026  
**Baseline:** F85 v14.10.8.87

## Objetivo

Retirar 1DS, 2DS, 3DS e SUB do papel de áreas internas do Campus e transformá-las em mundos modulares independentes. O Campus continua exibindo as construções externas, porém ao entrar numa casa ou usar sua estação o `WorldManager` encerra o runtime do Campus e carrega somente a Vila escolhida.

## Novos mundos

- `village-1ds` — Vila 1DS
- `village-2ds` — Vila 2DS
- `village-3ds` — Vila 3DS
- `village-sub` — Vila SUB

O catálogo passa de **11 para 15 mundos** e de **10 para 14 conexões estruturais**. Cada Vila possui `manifest`, `adapter`, `bounds`, `spawn`, área de presença, runtime Lite, runtime 3D, estação, praça, casa da turma, laboratório, biblioteca, jardim e maker.

## Campus como hub

As quatro construções permanecem visíveis no Campus como referências arquitetônicas. A interação de entrada não monta mais o conteúdo da turma na cena ativa: ela executa uma transição conectada para o mundo `village-*`. O retorno pela estação/portal da Vila restaura a posição anterior do Campus.

A estação central também pode transferir diretamente para 1DS/2DS/3DS/SUB sem manter trem animado permanentemente no hub.

## Mapa 2D

As quatro Vilas recebem posições próprias no mapa lógico global, em escala visual de distrito. Isso elimina a representação anterior em que áreas de turma podiam parecer menores que atrações pontuais. Os nós educacionais recebem prioridade visual maior e não se sobrepõem ao Campus.

## Performance

- `village-lite.js` e metadata compartilhada ficam disponíveis no shell.
- `village3d.js` **não** entra no `CRITICAL_SHELL` do Service Worker.
- O 3D da Vila é importado dinamicamente somente quando solicitado.
- Ao mudar Campus → Vila, o runtime anterior é encerrado pelo `WorldManager`; não há dois mundos 3D ativos por desenho desta fase.
- O código histórico de interiores de turma ainda existe no arquivo do Campus por compatibilidade, mas os caminhos normais de entrada foram redirecionados para os mundos modulares e não o instanciam.

## Multiplayer e backend

Nova migration:

`core/database/078_lobby_modular_villages.sql`

Ela adiciona as áreas:

- `village-1ds`
- `village-2ds`
- `village-3ds`
- `village-sub`

A Edge Function `lobby-presence` também reconhece as novas cenas/áreas para presença, reunião e chat por proximidade.

## Validação

- Gate F86: **9/9 PASS**
- F85 funcional: **10/11** — única falha é assert histórico de versão 14.10.8.87
- F84 funcional: **9/10** — única falha é assert histórico de versão 14.10.8.86
- F82: **6/8** — duas falhas de cache/versionamento histórico; trânsito, pedestres, trem, teletransporte e reunião permanecem passando
- JavaScript ESM Lobby/Core: **132 arquivos / 0 erros**
- Grafo do Lobby: **124 módulos / 361 imports locais / 0 ausentes**
- Edge Function TypeScript: sintaxe **PASS**
- Service Worker: **66 itens críticos / 0 ausentes**
- `village3d.js` fora do cache inicial: **PASS**

## Limite desta fase

O airdrop F84/F85 continua funcional no Campus, mas a troca automática de runtime durante a descida para a Vila/setor escolhido **ainda não foi ativada**. A F86 fornece os IDs, bounds, spawns e conexões independentes necessários para implementar essa seleção setorial com segurança na próxima fase.

## Rollback

Rollback direto: **AGV-WORLD-F85-MAPA-REALTIME-QUALIDADE-v14.10.8.87.zip**.

# Deploy — AGV World F87 v14.10.8.89

## Atualização a partir da F86

Se o ambiente já está em F86 v14.10.8.88 com backend aplicado:

1. publicar os arquivos do frontend F87;
2. invalidar/atualizar o Service Worker para `14.10.8.89-stage58-f87-airdrop-sectors`;
3. recarregar o Lobby;
4. validar Lite, 3D e partida aérea.

**Não existe migration F87 nova.**

## Ambiente vindo de F82/F81 ou anterior

Antes do frontend, confirmar a aplicação sequencial das migrations:

1. `074_lobby_presence_worlds_hotfix.sql`;
2. `075_lobby_runtime_gameplay_settings.sql`;
3. `076_lobby_spawned_vehicles.sql`;
4. `077_lobby_airdrop_sessions.sql`;
5. `078_lobby_modular_villages.sql`.

Depois, republicar a Edge Function consolidada:

`core/edge-functions/lobby-presence/`

Só então publicar a F87.

## Checklist pós-deploy

- confirmar versão 14.10.8.89;
- confirmar que o Service Worker antigo foi substituído;
- abrir o Lobby em Lite sem baixar Campus/Vale/Vilas 3D no shell inicial;
- iniciar uma partida aérea como equipe;
- confirmar que o avião abre sem carregar o Campus completo;
- escolher uma Vila e saltar;
- confirmar abertura automática do paraquedas perto de 24 m;
- confirmar carregamento do destino completo somente no pouso;
- testar outro jogador escolhendo a mesma zona e observar sincronização durante a queda;
- testar dois jogadores escolhendo zonas diferentes e confirmar que cada cliente prepara somente o próprio destino;
- validar teletransporte e Vilas após o pouso.

## Rollback

Em caso de regressão específica do airdrop setorial, retornar o frontend para a F86 v14.10.8.88. Não é necessário rollback de banco porque a F87 não introduz migration.

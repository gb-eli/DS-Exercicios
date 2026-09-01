# Deploy — AGV World F85 v14.10.8.87

## Cenário A — ambiente já atualizado até F84

A F85 não cria migration SQL nova e não exige mudança adicional no schema para o broadcast de avatar. Publique o frontend completo 14.10.8.87 e garanta ativação do Service Worker novo.

O backend `lobby-presence` deve continuar na versão consolidada que já contém os recursos F82–F84.

## Cenário B — ambiente vindo da F82/F81

Antes do frontend, confirme a aplicação das migrations, nesta ordem:

1. `074_lobby_presence_worlds_hotfix.sql`
2. `075_lobby_runtime_gameplay_settings.sql`
3. `076_lobby_spawned_vehicles.sql`
4. `077_lobby_airdrop_sessions.sql`

Depois publique `core/edge-functions/lobby-presence` da árvore consolidada e então o frontend F85.

## Frontend / cache

1. Publicar todo o conteúdo do pacote.
2. Confirmar `LOBBY_VERSION='14.10.8.87'`.
3. Confirmar `sw-register.js` com `14.10.8.87-stage56-f85-map-realtime`.
4. Confirmar que o novo Service Worker assume o controle.
5. Em máquinas que permanecerem com worker antigo, fechar/reabrir o Lobby ou atualizar a página até `controllerchange`.

## Verificação rápida pós-deploy

- celular: abrir **⚙ Qualidade**, testar Auto/Econômico/Médio/Alto/Ultra;
- entrar primeiro no 2D e observar que o 3D não é carregado antes de solicitá-lo;
- abrir Campus 3D e Vale 3D separadamente;
- com 2 usuários, testar andar, girar, pular, dançar e trocar aparência;
- confirmar que o outro usuário recebe ação/roupa sem esperar o poll de vários segundos;
- abrir Campus Lite e conferir Vilas 1DS/2DS/3DS/SUB em escala maior que atrações isoladas;
- conferir Vale Lite em zoom inicial mais próximo;
- confirmar que o trem não fica circulando ocioso e que uma viagem mantém parada de 5 s na estação.

## Observação de rede

Broadcast Realtime é efêmero. Presença/identidade continuam ancoradas no banco. Se o canal rápido falhar, o Lobby continua funcional com atualização persistente mais lenta; o sistema não deve substituir segurança/escopo por dados recebidos no broadcast.

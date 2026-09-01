# Deploy — AGV World F84 v14.10.8.86

## Ordem obrigatória

1. **Banco Supabase**
   - confirmar/aplicar `074_lobby_presence_worlds_hotfix.sql` se ainda não estiver no ambiente;
   - aplicar `075_lobby_runtime_gameplay_settings.sql`;
   - aplicar `076_lobby_spawned_vehicles.sql`;
   - aplicar `077_lobby_airdrop_sessions.sql`.

2. **Edge Function**
   - publicar `core/edge-functions/lobby-presence/`.

3. **Frontend**
   - publicar a árvore da release 14.10.8.86.

4. **Service Worker**
   - confirmar ativação de `agv-lobby-runtime-14.10.8.86-stage54-airdrop-streaming`.
   - em máquinas presas em cache antigo, usar o fluxo já existente de reparo/limpeza do Lobby.

## Por que esta ordem importa

O frontend F84 consulta `lobby_presence.altitude` e `lobby_presence.movement_mode`. Publicar o front antes da migration 077 pode interromper a consulta de presença. A Edge Function também depende de `lobby_airdrop_sessions` para iniciar e recuperar sessões aéreas.

## Smoke manual mínimo após deploy

1. Login de professor/admin e dois usuários de teste.
2. Confirmar Campus 2D inicial.
3. Abrir 3D e verificar movimento 16/28 u/s no padrão 1,00×.
4. Alterar FOV e sensibilidade e confirmar aplicação.
5. Spawnar um carro; entrar como motorista e dirigir.
6. Iniciar **Voo com todos**.
7. Confirmar os participantes no transporte aéreo.
8. Um usuário salta cedo e outro mais tarde.
9. Confirmar abertura manual e automática do paraquedas.
10. Confirmar pouso dentro do Campus e presença sem teleporte vertical residual.
11. Fazer logout/login e confirmar ausência de sessão aérea antiga.
12. Conferir Console/Network por erro 4xx/5xx em `lobby-presence`.

## Rollback

Rollback de frontend: voltar para F82 v14.10.8.84. As migrations 075–077 são aditivas e podem permanecer instaladas durante rollback; não é necessário remover colunas/tabelas para restaurar o frontend anterior. Republicar a Edge Function F82 somente se for necessário rollback completo do backend.

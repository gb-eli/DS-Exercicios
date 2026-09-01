# Deploy — AGV World F86 v14.10.8.88

## Ordem recomendada

### Ambiente já atualizado até F85/F84 backend

1. Fazer backup do banco/configuração atual.
2. Aplicar `core/database/078_lobby_modular_villages.sql`.
3. Republicar `core/edge-functions/lobby-presence/index.ts`.
4. Publicar o frontend F86 v14.10.8.88.
5. Garantir ativação do novo Service Worker `stage57-f86-villages`.
6. Abrir o Lobby inicialmente em Lite e testar 1DS, 2DS, 3DS e SUB em Lite e 3D.
7. Validar retorno Vila → Campus, estação central, teletransporte, presença e chat por proximidade.

### Ambiente vindo de uma versão anterior que não recebeu F82–F84 backend

Aplicar as migrations pendentes na ordem existente do repositório, incluindo **074, 075, 076, 077 e 078**, e então republicar a Edge Function consolidada `lobby-presence` antes do frontend.

## Checklist pós-deploy

- [ ] `LOBBY_VERSION` mostra 14.10.8.88
- [ ] Service Worker antigo foi substituído
- [ ] Casa 1DS abre `village-1ds`
- [ ] Casa 2DS abre `village-2ds`
- [ ] Casa 3DS abre `village-3ds`
- [ ] Casa SUB abre `village-sub`
- [ ] Estações das quatro turmas abrem a Vila correspondente
- [ ] Portal/estação de retorno restaura o Campus
- [ ] Somente um runtime de mundo permanece ativo após a transição
- [ ] Presença online aparece dentro de cada Vila
- [ ] Chat por proximidade não cruza indevidamente entre Campus e Vila
- [ ] Modo 3D da Vila é carregado somente quando solicitado
- [ ] Airdrop do Campus continua funcional

## Rollback

1. Restaurar o frontend F85 v14.10.8.87.
2. A migration 078 é aditiva quanto às áreas aceitas; não é obrigatório removê-la para rollback do frontend.
3. Se for necessário rollback estrito do backend, restaurar a Edge Function correspondente ao baseline e revisar a constraint de áreas antes de remover suporte às Vilas.

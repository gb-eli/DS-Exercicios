# Deploy — AGV World F88 v14.10.8.90

## Cenário A — ambiente já está na F86/F87 com backend até 078

1. Fazer backup/rollback da versão atual.
2. Aplicar `core/database/079_lobby_campus_modules.sql` no Supabase.
3. Republicar a Edge Function `lobby-presence` usando `core/edge-functions/lobby-presence/index.ts` desta release.
4. Publicar os arquivos do frontend F88.
5. Confirmar ativação do Service Worker `14.10.8.90-stage59-f88-campus-modules`.
6. Em um cliente de teste, limpar/atualizar o Service Worker antigo se a aplicação continuar exibindo assets anteriores.
7. Validar entrada e retorno nos três módulos em Lite e 3D.
8. Validar presença/chat/reunião de alunos dentro de `campus-library`, `campus-labs` e `campus-neon`.

## Cenário B — ambiente anterior à F86

Aplicar, em ordem, as migrations ainda não executadas do backend consolidado:

`074 → 075 → 076 → 077 → 078 → 079`

Depois, republicar `lobby-presence` e publicar o frontend F88.

Não reaplique migrations já registradas apenas para alterar seu conteúdo; use as migrations novas na sequência.

## Smoke mínimo após deploy

- Campus abre em Lite e 3D.
- Biblioteca, Laboratórios e Neon aparecem como setores/gateways no mapa 2D.
- Entrar em cada gateway descarrega o Campus e abre o módulo correto.
- Voltar pela estação/portal retorna ao Campus.
- Lab Virtual abre a partir do Distrito de Laboratórios.
- Piscina/parkour/playground/escorregador estão no Parque Neon e não aparecem como experiências ativas do hub.
- Mapa global lista 18 mundos.
- Airdrop apresenta 15 zonas terrestres e carrega somente o destino escolhido.
- Dois usuários no mesmo módulo enxergam presença/posição/ações pelo Realtime.
- Professor consegue trazer um aluno ou todos para o módulo.
- Nenhum `*3d.js` é pré-carregado pelo shell crítico do Service Worker.

## Rollback

Rollback recomendado: restaurar o frontend F87. A migration 079 é aditiva em relação à lista de áreas; mantê-la no banco durante rollback não obriga clientes F87 a entrar nos novos módulos. Se for necessária reversão estrita de banco, fazê-la somente em janela de manutenção após verificar presenças ativas.

# AGV Campus DS — v14.10.8.55

## Teletransporte global e reunião da turma

- Novo botão permanente **⚡ Teletransporte** no Lobby.
- Alunos e equipe podem viajar entre Praça Central, laboratórios, atrações, Vale do Silício AGV, distritos e empresas.
- O modo atual (2D ou 3D) é preservado durante a viagem.
- Professores/admins recebem **Trazer todos até mim**: gera comando temporário assinado pela Edge Function `lobby-presence` e envia por Supabase Realtime Broadcast.
- Alunos validam o token no servidor antes de obedecer ao comando; comandos forjados ou expirados são ignorados.
- Nenhuma tabela, coluna, constraint ou migration do Supabase é necessária.
- Para habilitar o recurso coletivo, publicar a Edge Function atualizada `core/edge-functions/lobby-presence`.

### Segurança
O token contém apenas região, coordenadas do Lobby, interior opcional, emissor, nonce e expiração de 20 segundos; é assinado HMAC no servidor com segredo não exposto ao navegador.

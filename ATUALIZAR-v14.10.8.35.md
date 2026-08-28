# DS Exercícios v14.10.8.35 — Bugfix cumulativo

## Escopo

Esta versão consolida as correções do Modo Prova Coletiva, Lobby/Campus DS, Portal de Atividades e Administração de Acessos.

### Modo Prova
- persistência de nome/empresa da guilda;
- `leader_id` real, votação e quórum;
- atribuição de cargo + aceite do aluno (Ready Check);
- solicitação de remoção pelo líder com aprovação docente;
- líder interino definido pelo professor;
- chat auditável da guilda;
- prova multiencontro, com continuidade em casa e encerramento manual pelo professor;
- missões e gabaritos permanecem server-side no `practical-exam` atualizado.

### Lobby / Campus DS
- uma única release executável: `14.10.8.35`;
- Service Worker usa rede primeiro para HTML/JS/CSS locais e cache apenas como fallback;
- caches antigos do Lobby são removidos no activate;
- diagnóstico registra erro, arquivo, linha, coluna e stack quando disponíveis;
- correções aplicadas em `lobby/` e no espelho `core/lobby/`.

### Portal de Atividades
- a verificação opcional de `staff-dashboard` não bloqueia aluno quando retorna 403;
- assets do Portal usam o mesmo cache-buster da v14.10.8.35;
- preserva progresso, arquivos, liberações e autenticação existentes.

### Gestão de Acessos
Nova área `Administração → Gestão de Acessos`.

Permite:
- redefinir senha inicial por aluno;
- redefinir em lote por turma;
- redefinir em lote por turno;
- aplicar senha temporária somente a um aluno por vez;
- marcar troca obrigatória de senha;
- encerrar sessões de atividade e revogar sessões Auth;
- registrar auditoria sem gravar senha/CGM em logs de operação.

A senha inicial é individual e usa o CGM já cadastrado no backend. O CGM não é retornado pela Edge Function de gestão.

## Backend necessário

Publicar as Edge Functions presentes neste mesmo pacote:

- `core/edge-functions/practical-exam/`
- `core/edge-functions/admin-access-management/`
- `core/edge-functions/recovery-exam/` (necessário para o fluxo DS3 já incluído nas versões cumulativas)

O projeto alvo é `iresvqwyaqotghjssncg` (`Portal Lab DS - Plataformas Unificadas`).

A sessão ativa do 2DS deve ser preservada. Não recrie a sessão e não altere `practical_exam_members.clan_id` durante o deploy.

## Banco

Não há migration nova específica da v14.10.8.35.

As migrations cumulativas já incluídas continuam sendo:
- `061_p10931_recovery_ds3_programacao.sql` — necessária para habilitar `programacao_ds3` no catálogo de recuperação;
- `062_p10931_practical_exam_guild_chat.sql` — chat de guilda.

Antes de aplicar qualquer migration, confira se ela já existe no banco.

## Publicação do frontend

Suba todo o conteúdo do ZIP na mesma publicação/commit. Não publique apenas `index.html` ou apenas `lobby/assets`, pois isso recria o risco de mistura de releases.

Após publicar o GitHub Pages, faça uma recarga forçada uma vez (`Ctrl + Shift + R`) para o novo Service Worker assumir o controle.

## Segurança

- nunca publique `SUPABASE_SERVICE_ROLE_KEY` no frontend;
- a Edge Function de Gestão de Acessos usa Service Role somente no servidor;
- operações de redefinição exigem administrador autenticado e AAL2/MFA;
- redefinições em lote nunca usam uma senha comum para a turma;
- nenhuma senha é devolvida pela API ou registrada no audit log.

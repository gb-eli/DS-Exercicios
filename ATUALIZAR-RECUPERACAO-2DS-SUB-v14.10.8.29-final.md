# Atualização final — Recuperação 2DS Sub

## Conteúdo integrado

A base `v14.10.8.29` foi mantida e recebeu os componentes úteis da
`Recuperacao-2DS-Sub-v1.1.0-completa`:

- frontend do aluno em `recuperacao/index.html`;
- painel docente em `recuperacao/admin.html`;
- Edge Function `recovery-exam`;
- banco de dados e chat privado;
- atalhos nas áreas do professor e do aluno.

## Banco de dados

A base já utiliza o número 058. Para não sobrescrever a Central de Apoio, as
migrations da Recuperação foram renumeradas e devem ser aplicadas nesta ordem:

1. `core/database/059_p10930_recovery_exam_2ds_sub.sql`
2. `core/database/060_p10930_recovery_review_sync_chat_v1_1_0.sql`

Não reaplique migrations que já estejam no histórico do projeto.

## Edge Function

Implante `core/edge-functions/recovery-exam` com verificação JWT habilitada.
A função usa o token do usuário para autenticação e a chave de serviço somente
no ambiente do backend.

## Publicação estática

Publique a interface `recuperacao/` junto com os atalhos integrados. Não
publique `core/`, `deploy/` ou `docs/` como parte do site estático.

## Estado deste pacote

A integração e as verificações locais fazem parte do ZIP. O estado de produção
da Recuperação não foi confirmado nesta rodada e não deve ser inferido a partir
dos documentos do pacote de origem.

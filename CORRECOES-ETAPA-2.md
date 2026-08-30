# Correções — Etapa 2

## Escopo
Recuperação temporária por CGM e troca obrigatória de senha.

## Alterações
- Recuperação centralizada em `/auth/`, coerente com a sessão única.
- Enquanto o Resend estiver pendente, o fluxo público não chama `resetPasswordForEmail()`.
- Aluno informa e-mail institucional + CGM (6–12 dígitos).
- Frontend chama apenas `temporary-cgm-password-reset`; validação real permanece server-side.
- A Edge Function mantém mensagem genérica, rate limit, comparação segura do CGM, revogação de sessões e `must_change_password=true`.
- Adicionada migration `063_p10920_password_change_finalize.sql` para finalizar `must_change_password=false`, limpar `profiles.cgm` e registrar `password_changed_at` somente quando `auth.users.encrypted_password` realmente mudar.
- O endpoint de reset por e-mail e `/reset-password/` permanecem no código para reativação futura quando o Resend estiver operacional, mas não são acionados pela interface pública durante a contingência.

## Implantação do banco
A migration 063 deve ser revisada/aplicada no Supabase antes de considerar a Etapa 2 concluída em produção.

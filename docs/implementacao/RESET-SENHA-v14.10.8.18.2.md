# Recuperação de senha por e-mail — v14.10.8.18.2

## Fluxo implementado

1. **Esqueci minha senha** abre o formulário de recuperação no Hub, Lobby e Atividades.
2. O frontend chama `resetPasswordForEmail()` com o redirect exato para `/reset-password/`.
3. A interface sempre usa mensagem genérica após a solicitação para não confirmar se um e-mail possui conta.
4. O link recebido é validado pelo Supabase antes da página liberar a troca de senha.
5. A página aceita o fluxo recovery padrão do Supabase e também `token_hash` de um template customizado.
6. A sessão é conferida com `getUser()` e o perfil precisa existir e estar `active=true`.
7. A nova senha exige 8+ caracteres, pelo menos uma letra e um número.
8. A alteração usa `auth.updateUser({ password })`.
9. O fluxo de recuperação usa storage isolado; após sucesso, a sessão de recuperação e a sessão normal local são limpas e o usuário precisa entrar novamente com a nova senha.

## Configuração obrigatória no Supabase Dashboard

Em **Authentication → URL Configuration**:

- **Site URL**: `https://gb-eli.github.io/DS-Exercicios/`
- **Redirect URLs**: adicionar exatamente `https://gb-eli.github.io/DS-Exercicios/reset-password/`

Evite wildcard em produção quando o caminho exato é conhecido.

## Template Recovery recomendado

Em **Authentication → Email Templates → Reset Password / Recovery**, pode ser usado o template padrão do Supabase. Para um fluxo explícito por token hash, use um link equivalente a:

```html
<h2>Redefinir senha</h2>
<p>Recebemos uma solicitação para alterar a senha da sua conta AGV.</p>
<p><a href="{{ .SiteURL }}reset-password/?token_hash={{ .TokenHash }}&type=recovery">Criar nova senha</a></p>
<p>Se você não solicitou esta alteração, ignore esta mensagem.</p>
```

O uso de `token_hash` também evita expor tokens de sessão na URL da aplicação. O link continua sendo de uso único.

## Banco já compatível

O projeto possui o trigger `on_auth_password_changed`. Ao alterar `auth.users.encrypted_password`, `public.handle_auth_password_changed()` atualiza o perfil para `must_change_password=false`, limpa `cgm`, grava `password_changed_at` e atualiza `updated_at`.

## Teste de aceite

1. Abrir a tela de login e clicar em **Esqueci minha senha**.
2. Informar um e-mail institucional válido.
3. Confirmar que a interface não revela se a conta existe.
4. Abrir o e-mail e clicar no link.
5. Confirmar que `/reset-password/` valida o link antes de mostrar os campos.
6. Testar senha fraca e senhas diferentes.
7. Salvar uma senha válida.
8. Confirmar que a sessão é encerrada.
9. Fazer login usando a nova senha.
10. Reabrir o mesmo link e confirmar que não permite nova alteração.

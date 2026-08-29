# ATUALIZAR — v14.10.8.57 — Login com Google

Base obrigatória: **v14.10.8.56**.

## Escopo
- adiciona `Entrar com Google` no Hub;
- preserva login por e-mail/senha e recuperação;
- usa o mesmo `AGVSession` das demais áreas;
- não altera schema, RLS, tabelas ou Edge Functions;
- não inclui Client Secret no frontend.

## Supabase/Google necessários
1. `Authentication > Sign In / Providers > Google` deve estar habilitado.
2. O cliente OAuth Web do Google deve usar o callback:
   `https://iresvqwyaqotghjssncg.supabase.co/auth/v1/callback`
3. Em `Authentication > URL Configuration`, a URL do GitHub Pages precisa estar autorizada:
   `https://gb-eli.github.io/DS-Exercicios/`
4. Enquanto o app Google estiver em modo Testing, o usuário precisa estar em `Audience > Test users`.

## Segurança
O Google autentica a identidade. O AGV continua exigindo um `profiles.id` ativo correspondente ao usuário autenticado.
Uma conta Google sem perfil AGV válido é desconectada e recebe mensagem de acesso não cadastrado.

## Pós-publicação
1. Abrir o Hub em janela anônima.
2. Clicar `Entrar com Google`.
3. Usar uma conta de teste que tenha o mesmo e-mail do usuário AGV.
4. Confirmar retorno ao GitHub Pages.
5. Confirmar papel correto e acesso às áreas autorizadas.
6. Confirmar que `access_token`/`refresh_token` não permanecem visíveis na barra de endereço.

> O Client Secret exibido durante a configuração do Google deve ser rotacionado se tiver sido exposto em captura de tela.

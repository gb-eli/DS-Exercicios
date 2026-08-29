# VALIDAÇÃO — v14.10.8.57

## Gate local
- JavaScript `core/session/agv-session.js`: sintaxe PASS
- JavaScript `assets/hub.js`: sintaxe PASS
- teste unitário local do callback OAuth: PASS
- testes direcionados de sessão/recuperação/OAuth: 12/12 PASS
- geração da URL `/auth/v1/authorize?provider=google`: PASS
- parsing de `access_token`, `refresh_token`, expiração e erro OAuth: PASS
- remoção do payload OAuth da URL via `history.replaceState`: PASS
- botão `google-login-btn`: presente uma vez
- segredo Google/`GOCSPX`: ausente do payload do frontend
- login por e-mail/senha: código preservado
- nenhuma migration/schema/SQL adicionada

## Gate que exige produção
Não é possível concluir o fluxo Google real no ambiente de empacotamento porque ele depende do Google Auth Platform,
do callback público do Supabase e do GitHub Pages publicado.

Smoke obrigatório após deploy:
- Google provider habilitado;
- conta em Test users (enquanto Testing);
- retorno ao Site URL;
- vínculo automático à conta Supabase existente pelo mesmo e-mail;
- perfil/role AGV correto;
- conta sem `profiles` ativo bloqueada.

## Observação de regressão histórica
O teste legado `core/tests/p6-session-hub-v12.4.test.mjs` já falha na base v14.10.8.56 por exigir literalmente `lobby/?v=14.10.8.18`. A falha foi reproduzida na base antes da alteração e não é regressão da v14.10.8.57.

# Correções — Etapa 3

Base: DS-Exercicios v14.10.8.65 com Etapas 1 e 2 aplicadas.

Escopo isolado desta etapa:
- Login Único / Google OAuth;
- preservação de sessão e retorno do Hub;
- retorno ao destino original após troca obrigatória de senha;
- remoção de recuperação duplicada/inacessível em Atividades;
- atualização de contratos de teste que ainda exigiam login Google duplicado no Hub ou cache antigo.

## Correções de runtime

1. O login Google permanece centralizado em `/auth/`.
   - O Hub não mantém formulário/login OAuth paralelo.
   - A sessão continua compartilhada via `AGVSession`.

2. Retorno pós-troca obrigatória de senha.
   - O destino original salvo em `sessionStorage['agv-auth-return-to']` é preservado.
   - Após a troca, o sistema confirma `must_change_password=false` antes de redirecionar.
   - O destino é validado para permanecer dentro da origem e da raiz do projeto.
   - Rotas de autenticação/reset são bloqueadas como destino para evitar loops.

3. Hub com senha temporária.
   - Ao detectar `must_change_password`, preserva `index.html` como retorno quando a origem foi o próprio Hub.
   - Não encerra a sessão antes da troca.

4. Atividades.
   - Removido o diálogo de recuperação por CGM duplicado e sem botão de abertura.
   - A recuperação continua exclusivamente no Login Único `/auth/`.

## Testes ajustados

- `p10921-google-oauth-login-v14.10.8.57.test.mjs`: passa a validar a arquitetura atual, com Google em `/auth/` e Hub apenas redirecionando.
- `p6-session-hub-v12.4.test.mjs`: cache-bust esperado atualizado de `14.10.8.18` para `14.10.8.65`.
- `p83-unified-session-lobby-class-scope-v14.8.3.test.mjs`: passa a validar preservação segura do destino no fluxo de primeira senha.

## Validação

- Testes focados Etapa 3: 13/13 PASS.
- Regressão recuperação por CGM: 5/5 PASS.
- Validadores oficiais v14.10.8.65: PASS.
- Suíte geral: 307/368 PASS; 61 falhas restantes.

As 61 falhas restantes ficam fora desta etapa e serão tratadas de forma incremental.

# CORREÇÕES — ETAPA 24

## Escopo
Roster público e privacidade dos alunos.

## Diagnóstico
A falha remanescente em `p10922-personalized-experiences-v14.10.8.20.test.mjs` não indicava vazamento nominal. O teste dependia do campo histórico `release-current.json -> privacy.private_roster_seed_separate`, que havia deixado de existir durante a consolidação dos metadados de release.

## Correções
- `release-current.json` voltou a declarar explicitamente os invariantes de privacidade da release atual.
- o roster nominal continua em `private.pedagogical_adaptation_roster`.
- `anon` e `authenticated` permanecem sem acesso ao roster privado.
- o contrato P10.9.22 passou a validar `PUBLIC-DEPLOY.json` e impedir que `core/database/`, `core/tests/`, `core/tools/`, `docs/` ou `deploy/` sejam tratados como frontend público.
- o teste garante que a migration versionada não contém seed nominal em `private.pedagogical_adaptation_roster`.
- criado `core/tools/validate-stage24-public-roster-privacy.mjs`, que varre os caminhos realmente publicáveis e reprova referências ao roster privado ou campos clínicos sensíveis.

## Validação
- testes focados de adaptações/personalização: 20/20 PASS.
- validador específico de privacidade: 9/9 PASS.
- cinco validadores oficiais: PASS.
- suíte completa: 373/376 PASS.

## Pendências fora do escopo
- Central de Apoio.
- duas rotas legadas.

## Banco
Nenhuma migration, Edge Function ou alteração de dados foi feita nesta etapa.

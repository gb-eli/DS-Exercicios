# CORREÇÕES — ETAPA 26

## Escopo
Rotas legadas P7.1 e fechamento da suíte integral.

## Diagnóstico
As duas falhas finais tinham causas diferentes:

1. O teste P7.1 ainda exigia `catalog.version === 14.0.0`, embora o catálogo canônico tenha evoluído corretamente para `14.10.8.59`.
2. Os stubs históricos existentes redirecionavam para os destinos atuais, porém não preservavam `location.search` e `location.hash`. Além disso, o alias histórico `sistemas/05-fliperama-ds/FLIPDS/index.html` estava declarado no catálogo, mas ausente no pacote.

## Correções
- Mantida a versão atual do catálogo, sem downgrade artificial.
- Atualizado o teste P7.1 para validar versão >= 14.0.0, schema, 10 IDs únicos e existência das 10 rotas canônicas.
- Padronizados os 13 stubs históricos.
- Todos os stubs usam `unified-auth-guard.js` e `AGVUnifiedAuth.readSession()`.
- Todos preservam query string e hash antes de `location.replace()`.
- Restaurado o stub `sistemas/05-fliperama-ds/FLIPDS/index.html` apontando para `../flipds/index.html`.
- Cada diretório legado permanece mínimo, contendo somente `index.html`.
- Nenhum login por senha, `service_role` ou segredo de backend foi introduzido.
- Criado `core/tools/validate-legacy-routes-stage26.mjs`.

## Validação
- Validador Etapa 26: 12/12 PASS.
- P7.1: 4/4 PASS.
- Regressões Hub/Auth/Sessão/Pré-publicação: 34/34 PASS.
- Cinco validadores oficiais: PASS.
- Suíte completa: **376/376 PASS — 0 falhas**.

## Banco / backend
Nenhuma migration, Edge Function ou alteração de banco foi feita nesta etapa.

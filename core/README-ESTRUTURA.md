# Estrutura canônica do `core/` — v14.10.8.38

A partir da v14.10.8.38, `core/` NÃO contém cópias das interfaces públicas.

## Fonte pública única (raiz do repositório)

- `/admin`
- `/assets`
- `/atividades`
- `/lobby`
- `/loja-universal`
- `/professor`
- `/prova`
- `/recuperacao`
- `/reset-password`
- `/sistemas`
- `/integracoes`

## Conteúdo mantido em `/core`

- `catalog/` — catálogos canônicos
- `contracts/` — contratos de integração
- `database/` — SQL/migrations de backend
- `edge-functions/` — Edge Functions Supabase
- `session/` — runtime de sessão compartilhado usado pelo frontend
- `sdk/` — SDK interno
- `tests/` — testes automatizados
- `tools/` — ferramentas internas

Os espelhos antigos `core/lobby`, `core/prova`, `core/atividades`, `core/sistemas`, `core/core` etc. foram removidos porque haviam divergido da raiz e permitiam publicar assets de releases diferentes.

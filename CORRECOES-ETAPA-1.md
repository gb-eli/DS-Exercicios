# Correções — Etapa 1

## Escopo
Sincronização segura de versionamento/cache-bust e documentação da release v14.10.8.65.

## Alterações
- 166 referências `?v=` antigas atualizadas para `14.10.8.65` em 46 arquivos públicos/runtime.
- Link Professor → Lobby atualizado para `../lobby/?v=14.10.8.65`.
- `00-LEIA-PRIMEIRO.md` atualizado para identificar corretamente a v14.10.8.65.
- `02-STATUS-IMPLEMENTACAO.md` atualizado para o estado real da v14.10.8.65.
- Criado `release-v14.10.8.65.json`.
- Arquivos históricos e testes antigos não foram reescritos nesta etapa.

## Validação
PASS:
- validate-campus-city-v62.mjs
- validate-campus-interiors-v63.mjs
- validate-campus-live-v64.mjs
- validate-campus-mobility-v65.mjs
- validate-unified-auth-v59.mjs
- `node --check` nos arquivos JS alterados

## Próxima etapa sugerida
Classificar e corrigir as falhas funcionais remanescentes da suíte completa, começando por recuperação/CGM e troca obrigatória de senha, sem misturar com Admin/CTF no mesmo bloco.

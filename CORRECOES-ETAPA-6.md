# Correções — Etapa 6

## Escopo

Release metadata, cache-bust e contrato de publicação da v14.10.8.65.

## Correções funcionais

1. `release-current.json` enriquecido e sincronizado com a release 14.10.8.65.
2. `release-v14.10.8.65.json` reconciliado com os patches de manutenção acumulados.
3. `version.json` e `atividades/version.json` sincronizados para UI `0.22.8.19` e release `v14.10.8.65`.
4. Versão visual em `atividades/index.html` sincronizada para `0.22.8.19`.
5. `PUBLIC-DEPLOY.json` atualizado da antiga `v14.10.8.29-final` para `v14.10.8.65`.
6. Manifesto de deploy corrigido para publicar `core/session/`, necessário pelo runtime das páginas atuais, sem expor `core/database/`, `core/functions/`, `core/tests/` ou `core/tools/` como superfícies estáticas.
7. Cache-busts antigos removidos de `recuperacao/`, `reset-password/`, `smoke2d.html` e `smoke3d.html`.
8. Contratos de teste antigos atualizados para validar a release ativa sem perder as verificações de segurança, cache, Service Worker, Preview, SDK e gates de produção.
9. Teste de reparo do Lobby alinhado à cadeia crítica atual da Cidade Viva e ao comportamento seguro de oferecer link após validação, em vez de redirecionamento automático.

## Gates preservados

- `productionWriteApproved=false`;
- `liveDeployApplied=false`;
- `backupConfirmed=false`;
- nenhum segredo privilegiado adicionado ao frontend;
- migration 063 continua explicitamente pendente de aplicação no Supabase de produção.

## Resultado

- Contratos focados de release/cache: 94/94 PASS.
- Reparo de publicação: 5/5 PASS.
- Validadores oficiais v62, v63, v64, v65 e autenticação unificada: PASS.
- Suíte geral: 342/368 PASS; 26 falhas remanescentes fora do escopo da Etapa 6.

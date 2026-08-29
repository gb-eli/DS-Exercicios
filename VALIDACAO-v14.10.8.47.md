# Validação — v14.10.8.47 / Fase E Portal V2 + FX

## Resultado

**PASS** na validação estática, estrutural e smoke do Portal V2.

## Evidências

- JavaScript verificado com `node --check`: **17 arquivos / 17 PASS**.
- Imports relativos analisados: **13**.
- Imports relativos ausentes: **0**.
- Recursos declarados no `LOCAL_SHELL` do Service Worker: **17**.
- Recursos ausentes no Service Worker: **0**.
- Construtores legados `portalGate` / `portalParticles` em `lobby3d.js`: **0**.
- Marcador ativo de release nos arquivos de runtime: **14.10.8.47**.

## Smoke do Portal V2 com Three.js local

O teste instanciou `portal-manager.js` usando o `three.module.min.js` que já acompanha o Lobby.

- portais criados: **4 / 4**;
- estado `AGUARDANDO`: **PASS**;
- estado `PORTAL ABERTO`: **PASS**;
- perfil `low / Eco`: partículas e halos extras desativados: **PASS**;
- perfil `ultra`: halo, veil, partículas e luzes dinâmicas ativos: **PASS**;
- intensidade de PointLight por proximidade: **PASS**;
- `dispose()` do sistema: **PASS**.

## Integração

- `lobby3d.js` usa `createPortalSystem()`.
- `applyQuality()` encaminha alterações ao Portal V2.
- proximidade continua baseada nas mesmas posições do `campus-manifest.js`.
- `boot.js` valida `game/portal-manager.js`.
- `lobby/sw.js` pré-cacheia `game/portal-manager.js`.
- Camera V2, Avatar V2, Lobby Lite, interiores e Supabase não tiveram contrato funcional alterado.

## Publicação

Este pacote é **PATCH incremental**. Deve ser copiado por cima da árvore completa atual do repositório. Não limpar ou excluir os demais arquivos antes da aplicação.

## Banco de dados

Nenhuma alteração de schema, tabela, RPC ou política Supabase.

# Deploy AGV World F91 — v14.10.8.93

## Pré-requisito

Ambiente já atualizado com o backend consolidado usado pela F90/F89 (migrations até 079 quando aplicável).

## Banco / Edge Function

**Nenhuma migration nova na F91.**  
**Nenhuma alteração nova de `lobby-presence` na F91.**

## Publicação

1. Publicar os arquivos públicos da F91.
2. Confirmar `LOBBY_VERSION=14.10.8.93`.
3. Confirmar Service Worker `agv-lobby-runtime-14.10.8.93-stage62-f91-external-graphics`.
4. Fazer reload/hard refresh de uma estação de teste para validar ativação do novo SW.
5. Abrir Vale 3D e alternar Econômico/Médio/Alto/Ultra.
6. Abrir Rural 3D e repetir a troca de qualidade.
7. Confirmar que o Rural não apresenta desaparecimento de construções ao se aproximar e que vegetação aumenta progressivamente por qualidade.
8. Testar airdrop com destino Vale e Rural para confirmar que o prefetch busca as URLs F91.

## Arquivos F91 críticos para cache

- `assets/core/world-adapter.js`
- `assets/world/world-runtime-prefetch.js`
- `assets/airdrop-transit3d.js`
- `assets/vale3d.js`
- `assets/rural3d.js`
- `assets/render/external-world-quality.js`

## Rollback

Como não há mudança de banco, rollback é somente de frontend/cache para o pacote F90 v14.10.8.92. Após rollback, remover/atualizar o Service Worker F91 por reload controlado.

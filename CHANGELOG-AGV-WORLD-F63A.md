# Changelog — AGV World F63A

Data: 2026-08-31  
Base funcional: v14.10.8.65  
Build do Lobby: `14.10.8.65-stage34-f63a`

## Fundação

- Criado `lobby/assets/core/lobby-state.js` para separar estado global de sessão e estado específico do mundo, mantendo aliases compatíveis com os runtimes existentes.
- Criado `lobby/assets/core/world-manager.js` como proprietário único do runtime ativo.
- Criado `lobby/assets/core/world-adapter.js` com adapters finos para Campus e Vale em 2D/3D.
- `lobby.js` deixa de conhecer diretamente as quatro factories concretas e passa a iniciar runtimes pelo adapter atual.
- O World Manager registra `starting`, `ready`, `stopping`, `idle` e `error`, rejeita runtime fora do contrato e descarta carga que termine depois de cancelada.

## Estabilização do baseline

- Corrigido `CAMPUS_RIDES` ausente no import do Campus 2D.
- Corrigido o uso de `reducedMotion` fora do escopo no interior de ferramenta do Campus 3D; agora usa `profile.reducedMotion`.

## Boot e cache

- Preflight valida os três módulos da fundação.
- Service Worker inclui os novos módulos no shell do Lobby.
- Cache do Lobby passa a usar o build `stage34-f63a`, preservando a versão funcional v14.10.8.65.

## Testes

- Adicionados seis testes unitários/contratuais da F63A.
- Adicionados smokes do Vale 2D e Vale 3D.
- Smokes existentes do Campus 2D/3D foram conectados ao World Manager; o smoke 3D entra em interior para cobrir a regressão encontrada na Fase 0.
- Validadores históricos que inspecionavam imports diretos em `lobby.js` foram atualizados para inspecionar o adapter, sem afrouxar os contratos de versão e funcionalidade.

## Fora do escopo

- World Registry e Spawn Manager permanecem para 63B.
- Scene Manager/unload avançado permanece para 63C.
- Transition Manager genérico permanece para 63D.
- Não houve mudança de mapa, visual, autenticação, Supabase, schema, Edge Function ou regra pedagógica.

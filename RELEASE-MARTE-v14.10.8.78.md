# AGV World F76 — Marte AGV

**Versão:** `14.10.8.78`  
**Build:** `14.10.8.78-stage47-mars`  
**Data:** 31/08/2026  
**Status:** Release Candidate

## Objetivo

Adicionar Marte como mundo independente do AGV World usando a arquitetura de streaming já consolidada em Rural, Base de Operações, Estação Orbital e Lua. O runtime marciano só é carregado durante a viagem Estação Orbital → Marte e é descartado no retorno.

## Entregas principais

- novo mundo `mars` / `mars-agv`, com limites, spawn e coordenadas próprias;
- transporte independente **Estação Orbital → Marte → Estação Orbital**;
- posição orbital anterior preservada durante a viagem;
- `mars-lite.js` e `mars3d.js` por importação dinâmica, fora do shell crítico do Service Worker;
- **Base Marciana AGV** com Comando, Geologia, Habitat, Energia/Comunicações, Garagem do Rover e Estufa Experimental;
- crateras e dois cânions exploráveis;
- Rover Marciano AGV utilizável localmente;
- gravidade de gameplay baseada em `3,71 m/s²`;
- sistema procedural de poeira/tempestade, alterando partículas, vento, opacidade e fog;
- Terra distante e Sol visíveis no céu marciano;
- minimapa e teleporte marcianos;
- presença, chat de proximidade e reunir usuários isolados em `mars-agv`;
- veículos terrestres multiplayer permanecem Campus-only.

## Streaming e descarte

Marte não é importado no boot normal do Lobby. O `MARS_WORLD_ADAPTER` carrega `mars-lite.js` ou `mars3d.js` apenas quando a cena é `mars`. Ao retornar à Estação Orbital, o runtime remove listeners, renderer, geometrias, materiais, partículas e referências do mundo marciano.

## Backend / banco

Aplicar:

- `core/database/071_lobby_mars_world.sql`

Republicar:

- `core/edge-functions/lobby-presence/index.ts`

A migration 071 atualiza o constraint de `lobby_presence.area` para o conjunto atual: Rural, Base de Operações, Órbita, Lua e Marte.

## Validação

- F76: **9/9 PASS**
- regressão selecionada F63A → F76: **67/67 PASS**
- trilhos/monotrilho: **20/20 PASS**
- interiores lazy: **18/18 PASS**
- horário global: **16/16 PASS**
- clima global: **20/20 PASS**
- mobilidade: **PASS**
- masterplan: **PASS**
- personalidade dos interiores: **PASS**
- fundação: **6/6 PASS**
- sintaxe: **58 módulos JS + Service Worker PASS**
- Edge Function: **TypeScript `tsc` PASS** com stubs ambientes locais de Deno/JSR
- HTML: **215/215 IDs únicos**
- smoke HTTP: **8/8 — 200 OK**
- E2E visual automatizado em navegador: **não executado**

## Limitações conhecidas

- Terra e Sol usam representação procedural/estilizada.
- A tempestade de poeira é uma simulação visual de gameplay, não um modelo atmosférico científico.
- O rover marciano é local e não tem ocupação multiplayer nesta fase.
- Interiores avançados da Base Marciana ficam para uma fase posterior.

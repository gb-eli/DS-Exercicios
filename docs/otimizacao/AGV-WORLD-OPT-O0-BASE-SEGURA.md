# AGV WORLD — OPT O0 — BASE SEGURA

**Data:** 2026-09-01  
**Base oficial:** AGV-WORLD-F81-NOVOS-MAPAS-v14.10.8.83.zip  
**Release:** 14.10.8.83-stage52-new-worlds  
**SHA-256 confirmado:** `5b4e59037d2f65d06b497213f33615ecbe845be23100d5aa982cc1831fc4dd2a`

## Estado da fase

- Nenhuma alteração funcional realizada.
- Core preservado.
- Chat preservado.
- Presença preservada.
- Banco não alterado.
- Edge Function não alterada.
- Service Worker não alterado.
- Rollback: o ZIP F81 original é o snapshot oficial desta fase.

## Inventário de mundos

1. Campus DS — `campus-ds` / scene `campus`
2. Vale do Silício AGV — `vale-silicio` / scene `vale`
3. Mundo Rural AGV — `rural-agv` / scene `rural`
4. Base de Operações AGV — `military-agv` / scene `military`
5. Estação Orbital AGV — `space-agv` / scene `space`
6. Lua AGV — `moon-agv` / scene `moon`
7. Marte AGV — `mars-agv` / scene `mars`
8. Parque de Diversões AGV — `parque-diversoes-agv` / scene `parque`
9. Colégio AGV — `colegio-agv` / scene `colegio`
10. Labirinto com Armadilhas — `labirinto-armadilhas` / scene `labirinto`
11. Museu do Hardware AGV — `museu-hardware-agv` / scene `museu`

## Baseline técnico

- 118 arquivos JS do Lobby/SW verificados com `node --check`: **118/118 aprovados**.
- Testes de mundo legado selecionados: **72/77 aprovados**; 5 falhas são testes F72–F76 com regex antiga que não aceita as novas áreas adicionadas ao backend, não falhas funcionais do runtime.
- Colégio F7: `validate-f7.mjs` aprovado.
- Colégio F7: smoke Lite/3D aprovado.
- Labirinto v1.1.0: challenge test aprovado.
- Museu v0.8.0: **26/26** checks aprovados.
- Lobby contém 179 arquivos, ~6.52 MB sem contar o restante do portal.
- Grafo estático local alcançável a partir de `lobby.js`: 49 módulos, ~767 KB de JS antes de imports dinâmicos.

## Baseline Chat

O Chat de proximidade permanece em `lobby/assets/social/proximity-chat.js`. Usa Broadcast + tokens assinados pela Edge Function `lobby-presence`; valida `scene` e distância no cliente e no servidor. Nenhuma alteração foi feita.

## Baseline Presença

A presença persistida usa `student_id`, coordenadas e `area`. `worldId/scene/interior` ainda não fazem parte do registro persistido, embora o estado do cliente possua `worldId`, `scene` e `interior`. Nenhuma alteração foi feita.

## Baseline Lite/3D

O WorldManager suporta `lite` e `3d`; o cliente chama `worldManager.stop()` antes da troca de runtime. Runtimes 3D atuais criam renderer por mundo e chamam `renderer.dispose()` no `stop()`.

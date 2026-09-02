# Contexto de continuidade — F94.6

A base de continuidade passa a ser F94.6 sobre F94.5.1.

## Estado

- F94.5.1: boot/auditoria segura preservado.
- F94.6: Runtime Contract V2 ativo globalmente no WorldManager.
- PlayerLocomotion V2 criado.
- velocidade horizontal 16/28 centralizada para todos os consumidores de `playerMoveSpeed`.
- pulo/gravidade migrados nos principais runtimes terrestres.
- Lua/Estação preservam perfil ambiental especial por configuração central.
- backend inalterado.

## Próximo passo

F94.7 — migração do `createPlayerLocomotion()` para loops reais, introduzindo aceleração/desaceleração/fixed timestep de forma progressiva.

Depois: Camera V2, Interaction V2, modular streaming, qualidade visual/GLB/KTX2/LOD, Vehicle Core, Rapier e só então NetworkManager/Colyseus.

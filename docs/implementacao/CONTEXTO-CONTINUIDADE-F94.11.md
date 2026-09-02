# Contexto de continuidade — F94.11

## Estado atual

F94.11 adiciona Quality Feature Matrix V2, Visual Asset Budget V2 e primeiro World Detail Asset Streaming V2 real com GLB LOD0/1/2 em Campus, Vale e Rural.

A arquitetura anterior deve ser preservada:

- Runtime Contract V2;
- PlayerLocomotion V2;
- Camera V2 e Invert Y;
- Mirante 360°/50×;
- Interaction V2;
- hotfix F94.9.1 do Campus 3D;
- SpatialStreamingManager da F94.10.

## Não implementado ainda

- Meshopt real nos novos GLBs;
- KTX2 real (assets F94.11 não têm texturas);
- three-mesh-bvh;
- Rapier;
- Vehicle Core V2;
- NetworkManager;
- Colyseus;
- streaming completo de todos os mundos.

## Próxima trilha

Prioridade sugerida:

1. smoke visual F94.11 em hardware real;
2. corrigir qualquer regressão P0;
3. Vehicle Core V2;
4. Rapier incremental para veículos/rides/colliders onde houver ganho comprovado;
5. ampliar packs de assets e identidade visual por mapa;
6. NetworkManager;
7. servidor Colyseus opcional no notebook;
8. failover Colyseus → Supabase Realtime → Solo.

## Requisito futuro do instalador do notebook

Ao instalar o agente/servidor em cada máquina, **o instalador deve perguntar localmente o nome do dispositivo antes do primeiro cadastro**. O nome não deve ser pré-definido pela Central, pois o operador precisa ler a etiqueta física do notebook. Padrão operacional informado: algo como `NT_DS_<ETIQUETA>`. O primeiro registro no sistema já deve subir com esse nome.

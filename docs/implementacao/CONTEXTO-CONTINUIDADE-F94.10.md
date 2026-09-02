# Contexto de continuidade — F94.10

## Estado oficial da linha

Última fase preparada: **F94.10 — Carregamento Modular + Interiores + Identidade Ambiental**.

Base: F94.9.1.  
F95: suspensa.

## Entregue

- Runtime Contract V2 (F94.6);
- Locomoção real unificada (F94.7);
- Camera V2 + Invert Y + Mirante 50× (F94.8);
- Interaction V2 (F94.9);
- hotfix de criação do Campus 3D/Airdrop API (F94.9.1);
- SpatialStreamingManager e Campus chunked (F94.10);
- interiores lazy preservados + luzes locais por qualidade;
- perfis ambientais para ondas futuras;
- preparação GLB/Meshopt/KTX2/LOD.

## Limites explícitos da F94.10

- somente o Campus está integrado ativamente ao novo streaming espacial completo nesta fase;
- não há novo pacote massivo de modelos/texturas PBR;
- não há three-mesh-bvh integrado ainda;
- não há Rapier integrado ainda;
- não há WebGPU obrigatório;
- não há Colyseus ativo;
- não há alteração em Supabase/database/Edge Functions;
- não houve validação visual WebGL real nesta sessão.

## Próxima fase recomendada

**F94.11 — Qualidade Gráfica Real + Asset Streaming V2.**

Construir AssetManager global e diferença visual real entre tiers. Priorizar Campus, Vale e Rural. Adicionar progressivamente GLB/glTF, LOD, Meshopt, KTX2, PBR, InstancedMesh/BatchedMesh e budgets de memória.

Depois:

1. Vehicle Core V2;
2. Rapier progressivo;
3. NetworkManager;
4. Colyseus no notebook/PC;
5. prediction/interpolation;
6. failover Colyseus → Supabase → Solo;
7. AOI integrado aos chunks.

## Requisito pendente do instalador do servidor/agente

Quando chegar a fase do pacote Windows/Colyseus, o instalador deve **obrigatoriamente perguntar localmente o nome do dispositivo antes do cadastro**, porque o nome segue a etiqueta física da escola (ex.: `NT_DS_<ETIQUETA>`). Essa escolha não pode depender de nome pré-definido pela Central. Idealmente o prompt ocorre enquanto os arquivos são baixados e o primeiro registro já sobe com o nome correto.

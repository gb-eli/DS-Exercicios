# Equipamentos 3D — contrato v0.5.0

## Formato

Cada item é distribuído em GLB/glTF 2.0 e possui um registro em `assets/equipment/equipment-manifest.json`.

Campos principais:

- `id`: identificador permanente.
- `model3d`: caminho do GLB.
- `preview`: miniatura WebP.
- `attachments`: slots usados pelo item.
- `pack`: pacote carregável.
- `basePrice` e `rarity`: economia da loja.
- `sha256`: integridade do arquivo.

## Slots

`hair`, `head`, `face`, `torso`, `shoulder-left`, `shoulder-right`, `held-item-left`, `held-item-right`, `back`, `shield`, `waist`, `foot-left`, `foot-right`, `vehicle`, `aura` e `companion`.

## Carregamento

1. O catálogo mostra apenas a miniatura WebP.
2. O GLB é solicitado ao experimentar ou equipar.
3. O modelo é convertido em buffers WebGL uma única vez.
4. O asset permanece no cache da sessão.
5. O modelo é desenhado usando a matriz mundial do slot do avatar.
6. Ao trocar de item, o ocupante anterior do mesmo slot é removido.

## Regras de autoria

- Origem do item no ponto de encaixe.
- Eixo Y para cima e +Z para frente.
- Escala compatível com o avatar DS.
- Nomes internos estáveis.
- Materiais reutilizáveis e poucos draw calls.
- Sem logos ou personagens protegidos de terceiros.

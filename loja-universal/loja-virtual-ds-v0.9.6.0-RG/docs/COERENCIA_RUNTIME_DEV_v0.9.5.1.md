# Coerência Gráfica e Separação Runtime/Dev — v0.9.5.1

## Resultado

A arte aprovada foi preservada. O runtime passou a distinguir claramente recursos executáveis, arquivos mestres e referências históricas.

## Modos

- **Básico:** Renderer Lite, LOD2 e efeitos reduzidos.
- **Intermediário:** Renderer Lite, LOD1 e efeitos moderados.
- **Avançado:** LOD0 e materiais atuais em maior resolução.
- **Ultra:** maior orçamento do renderer atual, sem alegar KTX2 ou 4K inexistentes.
- **Realismo:** cenário cinematográfico e iluminação configurada, ainda sem família 3D exclusiva.

## Separação

O pacote GitHub Pages exclui `assets/concepts`, `assets/previews`, `tests`, `reports`, `src`, `examples`, `lab` e documentação histórica. O projeto completo preserva tudo.

## LODs medidos

| Arquivo | Triângulos | Vértices referenciados | Draw calls estimados | Clips |
|---|---:|---:|---:|---:|
| avatar-tech-v1-lod0.glb | 168 | 336 | 14 | 28 |
| avatar-tech-v1-lod1.glb | 168 | 336 | 14 | 28 |
| avatar-tech-v1-lod2.glb | 168 | 336 | 14 | 28 |

Os números mostram a diferença estrutural real. A próxima fase deverá reduzir JavaScript inicial e remover as cópias Base64 dos GLBs.

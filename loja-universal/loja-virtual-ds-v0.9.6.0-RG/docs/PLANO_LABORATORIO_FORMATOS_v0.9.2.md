# Plano da v0.9.2 — Laboratório de formatos

A próxima fase criará variantes de teste sem substituir os arquivos mestres.

## Amostras

- Avatar LOD0 com 18 clips.
- Um uniforme de corpo.
- Um item metálico emissivo.
- Um acessório transparente/holográfico.
- Uma aura com alfa.
- Uma miniatura de produto.
- Uma arte de interface com transparência.

## Comparações

### Geometria

- GLB original.
- GLB otimizado sem compressão destrutiva.
- Meshopt.
- Draco.

### Texturas

- PNG original.
- WebP lossless e lossy de alta qualidade.
- AVIF quando houver compatibilidade e ganho.
- KTX2/BasisU para GPU.

## Métricas

- Tamanho transferido.
- Tempo de download simulado.
- Tempo de decodificação.
- Tempo até primeira renderização.
- Memória RAM e GPU.
- FPS médio e mínimo.
- Diferença visual por captura comparativa.
- Preservação de alfa, emissivo, rig e animações.

## Regra de aprovação

Nenhum formato será adotado globalmente apenas por reduzir tamanho. A variante precisa preservar a arte e melhorar o custo total de entrega e execução.

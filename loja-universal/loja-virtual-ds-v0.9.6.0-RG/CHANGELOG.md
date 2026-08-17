# Changelog — v0.9.6.0-RG

## Restauração gráfica emergencial

- Corrigido rebaixamento automático excessivo para Básico/Renderer Lite.
- Piso do modo Automático alterado para Intermediário.
- Renderer Advanced equilibrado ativado no Intermediário.
- Superfícies visuais protegidas contra downgrade silencioso.
- Ultra e Realismo voltam a carregar os recursos premium incluídos após escolha explícita.
- Fallback antigo substituído por quatro ângulos HQ.

## Reconstrução 3D

- 39 GLBs reconstruídos com geometria voxel arredondada HD.
- LOD0 elevado de 168 para 39.168 triângulos instanciados.
- LOD1 elevado de 168 para 8.448 triângulos instanciados.
- LOD2 elevado de 168 para 1.680 triângulos instanciados.
- 36 equipamentos refinados geometricamente.
- Nós, materiais, pivôs, slots, rig e contagem de animações preservados.
- 28 clips preservados em cada LOD.

## Otimização preservada

- Variantes Gzip regeneradas para os modelos reconstruídos.
- Redução de transferência 3D de 86,04%.
- Fallback para GLB original mantido.
- Modularização, cache, Persistência e Mochila DS preservados.

## Validação

- Cinco validadores funcionais aprovados.
- 45 arquivos JavaScript aprovados sintaticamente.
- 83 JSONs válidos.
- 342 referências de pacotes verificadas por tamanho e SHA-256.
- 39 variantes Gzip descompactadas com igualdade byte a byte.
- Teste móvel sem overflow em 390 px.
- Nenhum erro de console no teste de navegador.

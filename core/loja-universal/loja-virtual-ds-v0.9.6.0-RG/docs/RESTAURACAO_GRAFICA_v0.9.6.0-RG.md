# Restauração Gráfica e Auditoria Visual — v0.9.6.0-RG

## Diagnóstico confirmado

A regressão visual não era apenas percepção. A v0.9.6 combinava três problemas:

1. O modo Automático podia selecionar Básico e manter o Renderer Lite em superfícies de destaque.
2. Perfil, Home e outras áreas recorriam com frequência excessiva a uma miniatura simplificada.
3. Os três LODs do avatar possuíam a mesma geometria extremamente baixa: 168 triângulos instanciados.

## Recuperação do pipeline visual

- Piso visual Intermediário no modo Automático.
- Básico somente quando escolhido manualmente ou autorizado como emergência.
- Intermediário usa o shader Advanced com intensidade equilibrada.
- Home, Loja, Perfil, Inventário, Personagem, Efeitos e Exibição DS não são forçados ao Lite.
- Ultra e Realismo carregam ambientes, microdetalhes e palcos incluídos após seleção explícita.
- Fallback de baixa definição substituído por quatro vistas HQ.
- GLB permanece como fonte principal do 3D e do preview 360°.

## Geometria 3D reconstruída

A malha-base antiga utilizava um cubo de 12 triângulos compartilhado pelas partes. A correção substitui essa base por voxels arredondados subdivididos, preservando nós, meshes lógicos, materiais, nomes, pivôs, slots e animações.

- LOD0: 39.168 triângulos instanciados.
- LOD1: 8.448 triângulos instanciados.
- LOD2: 1.680 triângulos instanciados.
- Base anterior: 168 triângulos em todos os LODs.
- 36 acessórios: geometria arredondada com quatro subdivisões.
- 28 clips por LOD preservados.

Os LODs agora são geometricamente reais: a complexidade diminui de forma mensurável conforme a distância ou capacidade do dispositivo.

## Compressão após a reconstrução

- 39 GLBs: aproximadamente 1,02 MB.
- Variantes Gzip: aproximadamente 143 KB.
- Redução de transferência: 86,04%.
- Conteúdo byte a byte idêntico após descompactação.
- GLB original preservado como fallback.

## Recursos não sacrificados

Persistência, Mochila DS, carteira, catálogo, 17 VFX, 36 equipamentos, 16 slots, ambientes Ultra/Realismo e preview 360° permanecem ativos.

## Limite honesto

A identidade continua voxel tecnológica. A reconstrução melhora densidade, curvas, reflexos, leitura de luz e anti-aliasing, mas não transforma o personagem em um humanoide fotorealista com captura facial, ray tracing ou PBR 4K completo.

# Loja Virtual DS v0.9.6.0-RG

## Restauração Gráfica e Auditoria Visual

Versão corretiva criada após a regressão visual percebida na v0.9.6. O objetivo desta entrega é restaurar a presença gráfica da loja sem remover Persistência, Mochila DS, carteira, catálogo ou integrações.

## Correções principais

- Modo Automático com piso visual **Intermediário**.
- Básico somente por escolha explícita ou emergência controlada.
- Renderer Advanced equilibrado no Intermediário.
- Ultra e Realismo voltam a utilizar ambientes, microdetalhes e palcos premium quando selecionados.
- Home, Loja, Perfil, Inventário, Personagem, Efeitos e Exibição DS não são rebaixados silenciosamente para Lite.
- Fallback simplificado substituído por apresentação HQ em quatro ângulos.
- Partículas, VFX, shaders, iluminação, anti-aliasing e preview 360° preservados.

## Reconstrução geométrica real

A auditoria mostrou que os três LODs antigos possuíam apenas 168 triângulos instanciados cada. Nesta versão, os 39 GLBs foram reconstruídos com geometria voxel arredondada HD, preservando hierarquia, materiais, slots, pivôs, Rig Humanoide 2.0 e animações.

| Modelo | Triângulos instanciados |
|---|---:|
| LOD0 | 39.168 |
| LOD1 | 8.448 |
| LOD2 | 1.680 |
| Base anterior | 168 em cada LOD |

Os 36 acessórios GLB também receberam geometria arredondada com quatro subdivisões.

## Compressão sem perdas

Os 39 modelos reconstruídos totalizam aproximadamente 1,02 MB e possuem variantes Gzip de aproximadamente 143 KB. A redução de transferência é de 86,04%, com igualdade byte a byte após descompactação e fallback para o GLB original.

## Recursos preservados

- 71 produtos.
- 36 equipamentos GLB.
- 3 LODs geometricamente distintos.
- 28 clips por LOD.
- 16 slots de equipamentos.
- 17 VFX.
- Preview 3D e rotação 360°.
- Pacotes Ultra e Realismo.
- Persistência completa e Mochila DS.
- Carteira, extrato e integridade financeira.

## Transparência técnica

A direção continua sendo **voxel tecnológica**, agora com bordas arredondadas, mais densidade e melhor resposta à luz. Esta versão não declara um humanoide fotorealista, HDR físico, ray tracing ou texturas PBR 4K completas.

O runtime mantém fallback HQ quando WebGL não está disponível.

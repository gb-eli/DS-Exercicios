# COSMOS DS — Entrega da Fase 16

## Objetivo

Iniciar o ciclo de assets premium com uma infraestrutura real de arquivos GLB/glTF 2.0, níveis de detalhe, materiais PBR aproximados, texturas comprimidas, ambientes HDR, carregamento sob demanda e cache offline.

## Novo laboratório

### Assets Premium 3D/360°

O laboratório abre em tela imersiva e permite:

- inspeção orbital em 360°;
- zoom por roda, teclado, joystick virtual ou gamepad;
- rotação automática opcional;
- troca instantânea entre oito categorias de asset;
- seleção automática ou manual de LOD;
- modos PBR, raio X, normais e térmico;
- corte técnico por plano de recorte;
- fullscreen e modo fotográfico;
- armazenamento offline seletivo;
- liberação das cópias de geometria mantidas na CPU;
- diagnóstico de triângulos, vértices, LOD e tempo de carga.

## Starter pack autoral

Foram produzidos oito modelos próprios:

1. foguete orbital;
2. ônibus espacial;
3. cápsula tripulada;
4. rover científico;
5. satélite de observação;
6. estação modular;
7. módulo lunar;
8. traje EVA.

Cada modelo possui LOD 0, 1 e 2, totalizando 24 arquivos GLB.

> Este conjunto é um starter pack otimizado para validar o pipeline. Ele não deve ser confundido com a etapa final de modelos artísticos fotorealistas. A infraestrutura permite substituir os arquivos sem alterar as missões, o portal ou a progressão.

## Materiais e iluminação

- cores por vértice incorporadas aos GLBs;
- albedo WebP;
- mapa de roughness WebP;
- metalness e roughness por asset;
- triplanar mapping para evitar dependência obrigatória de UVs;
- reflexão de ambiente;
- Fresnel;
- iluminação direta e ambiente;
- quatro ambientes Radiance HDR RGBE;
- exposição adaptada ao perfil gráfico.

## LOD adaptativo

| Perfil | LOD automático |
|---|---:|
| Máximo desempenho | 0 |
| Equilibrado | 1 |
| Máxima experiência | 2 |

A troca de qualidade altera a complexidade visual, mas não a progressão educacional.

## Segurança de carregamento

- cargas concorrentes usam token de versão;
- uma resposta antiga não pode substituir o asset mais recente;
- texturas são decodificadas antes da troca da geometria visível;
- buffers e texturas anteriores são descartados;
- context loss e context restore são tratados;
- RAF, programas, VAOs, buffers e texturas são liberados ao sair;
- fallback Canvas 2D permanece disponível.

## Progressão

| Objetivo | XP |
|---|---:|
| Inspecionar quatro assets | 360 |
| Comparar os três LODs | 300 |
| Usar quatro modos de material | 260 |
| Ativar corte técnico | 220 |
| Preparar pacote offline | 240 |
| Certificação final | 500 |
| **Total** | **1.880 XP** |

## Resultado

A Fase 16 cria uma base reutilizável para que os módulos de estação, ônibus espacial, cápsulas, rovers, trajes, satélites e foguetes possam receber gradualmente modelos GLB mais sofisticados sem duplicar carregadores e sem aumentar o download inicial do portal.

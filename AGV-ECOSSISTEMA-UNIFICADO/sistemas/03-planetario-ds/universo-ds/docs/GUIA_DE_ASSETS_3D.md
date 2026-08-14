# Guia de assets 3D, 360° e animações

## Formatos

- entrega web: GLB/glTF 2.0;
- texturas: WebP/AVIF; KTX2 quando o pipeline estiver ativo;
- áudio: OGG/MP3;
- vídeo: WebM/MP4 otimizado;
- metadados: JSON.

## Cada modelo deve possuir

- origem e licença registradas;
- nome técnico estável;
- escala e unidade definidas;
- pivô coerente;
- colisores separados;
- materiais nomeados;
- LOD baixo, médio e alto quando necessário;
- miniatura sem fundo;
- visualização 360°;
- orçamento de polígonos e texturas;
- teste em celular e notebook escolar.

## Orçamentos iniciais

| Tipo | Baixo | Médio | Alto |
|---|---:|---:|---:|
| objeto pequeno | 2k tri | 8k tri | 25k tri |
| rover | 15k tri | 55k tri | 140k tri |
| foguete | 20k tri | 75k tri | 180k tri |
| interior modular | 40k tri | 130k tri | 300k tri |
| textura principal | 512 px | 1K | 2K |

Os números são metas de partida e devem ser revisados por benchmark real.

## Animações

- separar clipes: repouso, operação, abertura, falha, manutenção e demonstração;
- usar nomes consistentes;
- evitar animação contínua invisível;
- reduzir frequência em modo desempenho;
- permitir pausa por acessibilidade;
- partículas não podem esconder controles nem objetivos.

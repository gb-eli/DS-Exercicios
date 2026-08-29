# VoxelCraft DS 3D — integração Fliperama 12

Mundo voxel educacional recuperado e estabilizado no Fliperama DS v0.31.0.

## Modos

- **Aprendizagem:** missão guiada com chunks, coleta, construção e exploração.
- **Livre:** exploração sem objetivo obrigatório.
- **Desafio:** metas maiores, mais distância e bônus de XP.

## Qualidade e modo seguro

- Econômico: fallback para aparelho fraco ou falha na criação do contexto WebGL;
- Baixo: celular básico;
- Médio: Chromebook/tablet;
- Alto: notebook/PC;
- Ultra: computador potente;
- Automático: decisão por memória, núcleos e tipo de ponteiro.

Se a GPU não sustentar a qualidade escolhida, o jogo tenta novamente no modo Econômico. Em aparelhos de toque, distância, resolução e efeitos são limitados automaticamente.

## Controles

- computador: WASD/setas, mouse, Espaço, Shift, C, clique esquerdo/direito; Q quebra, E constrói e V troca a câmera como alternativas;
- celular/tablet: dois joysticks e botões Pular, Quebrar, Construir, Consumir e Agachar;
- gamepad: analógico esquerdo move, direito olha, A pula, gatilhos quebram/constroem e Y troca a câmera.

## Correções de segurança e jogabilidade

- spawn salvo é validado antes da restauração;
- recuperação automática para o último ponto seguro;
- blocos não podem ser colocados dentro do personagem;
- edição em borda reconstrói também o chunk vizinho;
- câmera em terceira pessoa recua antes de atravessar o terreno;
- coyote time e jump buffer reduzem falhas de salto;
- Pointer Lock possui mensagem e comandos alternativos;
- limite de 15.000 alterações por mundo evita crescimento indefinido.

## Persistência

O mundo usa schema 11. A gravação tenta IndexedDB, mantém uma cópia de recuperação em localStorage e usa memória temporária apenas quando os dois mecanismos persistentes falham. Saves das versões anteriores são sanitizados e migrados.

## Renderizador local

Three.js 0.180.0 permanece incluído em `vendor/three/three.module.min.js`. Não há dependência de CDN externa.

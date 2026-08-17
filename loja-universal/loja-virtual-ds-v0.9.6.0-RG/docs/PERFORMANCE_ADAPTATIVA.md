# Performance adaptativa v0.7.0

## Perfis

- Econômico: celulares básicos, DPR 1, LOD2 e partículas mínimas.
- Equilibrado: celulares intermediários e computadores comuns.
- Alta qualidade: LOD0, maior resolução e iluminação ampliada.
- Ultra: experiência premium, DPR até 2,25 e partículas densas.
- Ultra avançado: GPUs dedicadas, DPR até 3, orçamento de 3.200 partículas e materiais emissivos reforçados.

## Automático

O gerenciador avalia WebGL, memória informada, núcleos lógicos, tamanho máximo de textura, resolução da tela e um teste local de CPU. Durante o uso, mede FPS em janelas. Quedas sustentadas reduzem a qualidade; estabilidade prolongada permite recuperação gradual.

## Ordem de redução

1. Densidade de partículas.
2. Resolução interna.
3. Efeitos decorativos e reflexos.
4. LOD do modelo.
5. Fallback 2D em ausência de WebGL.

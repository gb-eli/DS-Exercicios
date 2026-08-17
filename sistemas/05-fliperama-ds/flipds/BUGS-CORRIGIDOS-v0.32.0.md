# Problemas corrigidos — Fliperama DS v0.32.0

## Museu sem representação visual real

Antes, os cartões descreviam uma “vista 2D” e um “estudo 3D” apenas com texto. Agora cada um dos 15 itens possui ilustração vetorial local e miniatura própria.

## 3D conceitual sempre misturado à página

A apresentação anterior dependia de cartões inclinados em CSS. O novo visualizador 360° fica em módulo separado e só é importado quando o usuário o ativa.

## Ausência de fallback explícito

Quando o modo 360° não pode iniciar, a vitrine restaura automaticamente a vista 2D e informa o ocorrido.

## Falta de pipeline para modelos futuros

Foram criados catálogo, índice de modelos, regras de otimização, pastas de texturas e coleções. Modelos GLB/glTF poderão ser adicionados sem alterar a navegação principal.

## Linha do tempo pouco guiada

Foi adicionado um percurso pelas sete eras com progresso, tecnologias, tendências, marco histórico, era anterior/próxima e atalhos contextuais.

## Carregamento antecipado indesejado

As 15 imagens não entram no shell inicial do Service Worker. O catálogo e o visualizador são preparados próximos ao uso, e as imagens entram no cache conforme a navegação.

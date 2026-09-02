# Contexto de continuidade — AGV World F94.5

## Base atual de trabalho

- Base anterior: F94.4 HF4 — Prova Prática P0.
- Nova camada: F94.5 — Instrumentação e Auditoria Executável dos Mapas.
- F95 continua suspensa.

## Regra arquitetural

Preservar Three.js e evoluir por camadas. Não migrar engine inteira antes de evidência. A etapa seguinte será orientada pela matriz real produzida pela F94.5.

## O que a F94.5 resolve

Ela não corrige ainda todos os mapas. Ela identifica de forma comparável o ponto de falha dos 18 mundos em 2D/3D e registra renderer, primeiro frame, input, interação e unload.

## Próxima decisão

Após teste real, corrigir primeiro todos os casos `FAIL` que impedem abertura/first frame. Depois avançar para Runtime Contract V2, Camera V2/Mirante, Atlas 2D proporcional, Vehicle Core, Parque/Rapier e conteúdo gráfico.

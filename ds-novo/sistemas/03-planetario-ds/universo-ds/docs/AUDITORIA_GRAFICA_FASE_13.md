# Auditoria gráfica — Fase 13

## Escopo

A auditoria automatizada passou a cobrir 11 renderizadores.

## Verificações do novo renderizador

- ray marching adaptativo;
- quatro arquiteturas de estação;
- ônibus espacial;
- veículos e satélites;
- interior procedural;
- Terra e atmosfera;
- câmera 360°;
- yaw, pitch e roll;
- posição e orientação do veículo;
- fallback Canvas 2D;
- fullscreen;
- perda e restauração de contexto;
- cancelamento do RAF;
- descarte de GPU;
- qualidade gráfica;
- Reduzir movimento;
- joystick e gamepad.

## Coerência visual

- partículas aparecem somente em eventos operacionais;
- não existe fumaça atmosférica contínua no vácuo;
- o planeta tem iluminação diurna/noturna;
- estações possuem escalas visuais diferentes;
- a estação conceitual é identificada como didática;
- câmeras internas não usam a mesma composição da câmera orbital;
- o modo Desempenho reduz custo visual, não regras.

## Limitação do ambiente

O Chromium administrativo bloqueou o acesso a `localhost` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Portanto, não foi possível obter uma captura confiável do shader neste ambiente.

A validação definitiva de cor, material, fluidez, toque e consumo de bateria precisa ser feita em GPU física.

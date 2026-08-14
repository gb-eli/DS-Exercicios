# Auditoria gráfica — Fase 12

## Escopo

A auditoria passou a cobrir dez renderizadores, incluindo o novo `LaunchRemasterSceneRenderer`.

## Verificações automatizadas

- `destroy()`;
- `resize()`;
- perfil gráfico;
- redução de movimento;
- fallback Canvas 2D;
- cancelamento de RAF;
- context loss e restauração;
- fullscreen;
- câmera 360°;
- joystick/gamepad;
- ray marching;
- pluma;
- fumaça atmosférica;
- separação;
- ônibus espacial didático;
- descarte de programa, buffer e VAO.

## Coerência física visual

- fumaça é reduzida progressivamente com altitude;
- a pluma permanece no vácuo, mas muda visualmente;
- faíscas aparecem na ignição e em baixa altitude;
- detritos aparecem apenas durante a separação;
- vibração forte é reservada para ignição e Max Q;
- o modo Reduzir movimento remove tremores e animações decorativas.

## Perfis

### Desempenho

- resolução interna menor;
- 34 passos aproximados de ray marching;
- menos estrelas, fumaça e partículas;
- granulação desativada.

### Equilibrado

- resolução intermediária;
- iluminação, atmosfera e partículas moderadas.

### Máxima experiência

- resolução interna maior;
- até 100 passos de ray marching;
- maior densidade estelar e volumétrica;
- reflexos e especular mais definidos;
- fumaça e separação mais detalhadas.

## Limitação do ambiente de validação

O Chromium headless disponível não concluiu a captura por limitações de DBus/EGL e foi encerrado por timeout. Por isso, a compilação final do shader continua marcada para playtest em GPU física. O fallback, os caminhos HTTP, a lógica, o Worker e a auditoria estática foram aprovados.

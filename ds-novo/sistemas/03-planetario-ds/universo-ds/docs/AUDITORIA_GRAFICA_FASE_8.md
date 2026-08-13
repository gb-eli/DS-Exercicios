# Auditoria gráfica — Fase 8

## Verificações realizadas

- sintaxe dos renderizadores;
- imports e caminhos;
- presença de fallback Canvas;
- resolução adaptativa;
- respeito a Reduzir movimento;
- `destroy()` e cancelamento de RAF;
- encerramento do Worker;
- remoção de listeners;
- tratamento de `webglcontextlost` na estação;
- responsividade CSS;
- campos 3D protegidos contra HUD excessivo;
- disponibilidade HTTP dos arquivos críticos.

## Correções

- listeners de resize de Marte e Lua agora são removíveis;
- estação possui fallback quando `ResizeObserver` não existe;
- shader e simulação foram separados;
- partículas externas aparecem somente em condição contextual;
- a auditoria visual mostra renderizador, resolução, modo, perfil e context loss.

## Limitação do ambiente

O Chromium administrativo bloqueou `127.0.0.1` e não inicializou EGL/SwiftShader de forma confiável. Por isso, a compilação visual real do shader precisa ser confirmada em GPU física. A lógica, sintaxe JavaScript, caminhos, Worker, fallback e estrutura foram validados automaticamente.

# Auditoria gráfica — Fase 18

## Aprovado

- múltiplas primitives;
- hierarquia de nós;
- animações glTF;
- quaternion slerp;
- LOD 0/1/2;
- PBR e HDR;
- câmera 360°;
- fallback procedural;
- fallback Canvas 2D;
- perda e restauração de contexto;
- descarte de buffers, VAOs, texturas e programas;
- cancelamento de RAF;
- troca concorrente de assets;
- redução de movimento;
- HUD recolhida em telas pequenas.

## Limitação do ambiente

O Chromium administrativo não inicializa EGL/SwiftShader de forma confiável. A compilação visual definitiva dos shaders e materiais deve ser conferida em GPU física.

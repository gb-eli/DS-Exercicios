# Auditoria gráfica — Fase 17

## Cobertura

Foram auditados 16 renderizadores, incluindo a nova camada `PremiumAssetOverlayRenderer`.

## Verificações

- contexto WebGL2 transparente;
- shaders de vértice e fragmento;
- metalness e roughness;
- amostragem de ambiente HDR;
- triplanar mapping;
- seleção automática de LOD;
- resize responsivo;
- perfil gráfico;
- redução de movimento;
- perda e restauração de contexto;
- cancelamento de RAF;
- descarte de buffers, texturas, VAO e programa;
- fallback procedural;
- HUD não bloqueando a cena;
- comportamento mobile.

## Correções preventivas

- cargas antigas são descartadas quando o aluno troca rapidamente de objeto;
- re-renderização completa de um módulo remonta a camada no novo stage;
- alteração de câmera não recarrega o GLB;
- alteração de qualidade recarrega somente o LOD;
- o canvas premium não recebe eventos de ponteiro;
- inspeção 360° continua controlada pelo renderizador principal.

## Limitação do ambiente

O Chromium administrativo não inicializou EGL/SwiftShader. A compilação visual final do PBR e do HDR não pôde ser confirmada por captura automatizada neste ambiente. Foram validados código, shaders por auditoria estática, GLBs, HDRs, caminhos HTTP, fallback e lifecycle. A inspeção final deve ocorrer em GPU física.

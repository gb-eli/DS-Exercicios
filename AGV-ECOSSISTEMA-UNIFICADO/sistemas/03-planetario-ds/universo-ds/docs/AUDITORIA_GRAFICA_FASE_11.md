# Auditoria gráfica — Fase 11

## Renderizadores auditados

1. Terra;
2. radar holográfico;
3. foguetes;
4. Lua;
5. Marte;
6. estação espacial;
7. universo profundo;
8. direção de missões;
9. Sistema Solar imersivo.

## Verificações automáticas

- método de descarte;
- resize;
- perfil gráfico;
- Reduzir movimento;
- fallback 2D;
- cancelamento de RAF;
- shaders planetários;
- atmosferas;
- anéis;
- órbitas;
- partículas;
- câmera 360°;
- voo livre;
- context loss;
- fullscreen;
- joystick e entrada de jogo;
- HUD periférica;
- responsividade.

## Smoke test visual

Foi executado um harness visual isolado com Chromium e Playwright para conferir:

- inicialização do módulo;
- layout desktop 1440 × 900;
- layout mobile 390 × 844;
- dez seletores planetários;
- seis satélites;
- troca para Saturno;
- mudança de câmera para voo livre;
- abertura da frota orbital;
- seleção da estação orbital;
- abertura do drawer de scan;
- ausência de erros JavaScript.

O Chromium administrativo não disponibilizou WebGL2/EGL. O fallback Canvas 2D e toda a interface foram validados visualmente. A compilação dos shaders completos permanece como teste obrigatório em GPU física.

## Resultado

- centro do campo visual preservado;
- controles nas bordas;
- texto contextual recolhível;
- joystick sem bloquear o dock inferior;
- modo retrato e paisagem estruturados;
- nenhuma dependência gráfica externa obrigatória.

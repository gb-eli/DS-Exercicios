# Auditoria Gráfica — Fase 16

## Escopo

A auditoria foi ampliada para 15 renderizadores e adicionou verificações específicas do pipeline premium.

## Verificações do novo renderizador

- carregamento GLB;
- PBR aproximado;
- metalness e roughness;
- ambiente HDR;
- três LODs;
- câmera 360°;
- zoom;
- corte técnico;
- modo raio X;
- visualização de normais;
- mapa térmico;
- fallback Canvas 2D;
- fullscreen;
- context loss;
- cancelamento de RAF;
- descarte de buffers;
- descarte de VAO;
- descarte de texturas;
- descarte de programas.

## Bugs evitados ou corrigidos

- respostas assíncronas antigas substituindo o asset atual;
- desenho de geometria antes da textura estar pronta;
- coordenadas incorretas no triângulo fullscreen do fundo;
- formato de textura de roughness com compatibilidade limitada;
- consultas de uniforms repetidas em cada frame;
- mensagem imprecisa sobre liberação de CPU e GPU;
- progresso visual não atualizado após concluir um objetivo.

## Limitação do ambiente de teste

O Chromium headless disponível não inicializou EGL/SwiftShader. A compilação visual definitiva de PBR/HDR precisa ser conferida em GPU física.

Foram validados por código e testes:

- shaders;
- imports;
- parser GLB;
- parser HDR;
- manifesto;
- arquivos HTTP;
- lifecycle;
- fallback;
- tamanhos e triângulos dos LODs.

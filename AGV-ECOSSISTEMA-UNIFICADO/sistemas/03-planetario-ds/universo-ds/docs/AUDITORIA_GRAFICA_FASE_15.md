# Auditoria gráfica — Fase 15

## Escopo

A auditoria automatizada cobre 14 renderizadores.

### Verificações comuns

- `destroy()`;
- cancelamento de `requestAnimationFrame`;
- resize;
- perfis gráficos;
- redução de movimento;
- fallback Canvas 2D;
- perda de contexto;
- descarte de programa e VAO.

### Universo Profundo

- oito destinos;
- shaders volumétricos;
- nebulosas;
- supernova;
- pulsar;
- buraco negro didático;
- galáxia e aglomerado;
- câmera 360°;
- voo livre;
- dobra;
- joystick, gamepad, fullscreen e modo foto.

### Museu Visual

- ray marching;
- salão navegável;
- foguete, ônibus espacial, rover e estação;
- primeira pessoa;
- inspeção 360°;
- interiores;
- mecanismos animados;
- joysticks;
- fullscreen e modo foto.

## Correções da auditoria

- a câmera livre passou a exportar yaw e pitch próprios;
- a função de distância do salão foi alterada para representar paredes internas e não um volume sólido;
- os dois renderizadores encerram RAF e liberam programa e VAO.

## Limitação do ambiente

O Chromium administrativo não inicializou EGL/SwiftShader. A compilação visual final dos shaders deve ser conferida em uma GPU física, embora sintaxe, imports, lógica, fallback e lifecycle tenham sido validados.

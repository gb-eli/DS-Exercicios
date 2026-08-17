# Benchmark DS Avançado — v0.9.5

## Objetivo

Medir execução real no navegador e recomendar uma experiência gráfica por dispositivo. O nome da GPU, `deviceMemory` e `hardwareConcurrency` são apenas sinais auxiliares.

## Oito etapas

- diagnóstico de APIs e limites gráficos;
- matemática, JSON e cópia de memória;
- processamento em Web Worker;
- compilação de shader e chamadas de desenho;
- upload de textura RGBA;
- partículas WebGL ou Canvas 2D de fallback;
- estabilidade via `requestAnimationFrame`;
- quota, cache e persistência de armazenamento.

## Segurança

- pode ser cancelado;
- interrompe quando a aba fica oculta;
- não baixa pacotes;
- não aplica a recomendação sozinho;
- respeita fallback 2D;
- salva resultados por dispositivo.

## Interpretação

As projeções de FPS são estimativas comparativas e não garantias. A execução real continua monitorada pelo gerenciador adaptativo.

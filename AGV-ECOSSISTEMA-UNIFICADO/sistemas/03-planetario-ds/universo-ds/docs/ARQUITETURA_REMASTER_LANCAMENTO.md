# Arquitetura — Remaster de Foguetes e Lançamentos

## Camadas

```text
LaunchRemasterModule
├── LaunchExperienceModel
├── RocketSystem
├── launch.worker.js
│   └── RocketFlightModel
├── ImmersiveInputController
└── LaunchRemasterSceneRenderer
```

## Responsabilidades

### `LaunchExperienceModel`

- veículo selecionado;
- câmera atual;
- yaw, pitch e zoom;
- inspeções;
- modo fotográfico;
- piloto automático de câmera;
- histórico de câmeras;
- buffer e posição do replay.

Não possui DOM nem WebGL.

### `RocketSystem`

- massa;
- empuxo/peso;
- Δv;
- margens;
- configuração serializável do voo.

### `RocketFlightModel`

- estados;
- contagem regressiva;
- empuxo;
- propelente;
- arrasto;
- Max Q;
- separação;
- inserção orbital;
- abortagem.

### `launch.worker.js`

Executa o modelo físico fora da thread da interface. O perfil gráfico altera apenas frequência de atualização, não os critérios da missão.

### `LaunchRemasterSceneRenderer`

- WebGL2/GLSL;
- ray marching;
- SDF dos veículos e plataforma;
- orbiter alado didático;
- interior procedural;
- câmeras;
- pluma, fumaça, vapor, faíscas e separação;
- fallback 2D;
- resize;
- context loss;
- descarte de GPU.

### `ImmersiveInputController`

Unifica teclado, ponteiro, toque, joystick virtual e gamepad em ações normalizadas.

## Regra crítica

A simulação é a fonte de verdade. O renderizador nunca decide combustível, velocidade, estágio, sucesso ou falha.

## Lifecycle

Ao sair do laboratório:

- Worker recebe `stop` e é terminado;
- timers de fallback e replay são cancelados;
- RAF é cancelado;
- listeners são removidos;
- buffer, VAO e programa WebGL são liberados;
- joysticks e teclado são desconectados.

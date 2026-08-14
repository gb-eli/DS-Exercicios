# Arquitetura — Estação Espacial Remaster

## Separação de responsabilidades

```text
StationRemasterModule
├── HUD, drawers, progressão e comandos
├── ImmersiveInputController
├── StationRemasterExperience
├── StationRemasterSceneRenderer
└── orbital-flight.worker
    └── OrbitalFlightModel
```

## Camada de experiência

`StationRemasterExperience` mantém apenas estado de experiência:

- estação selecionada;
- veículo selecionado;
- satélite selecionado;
- câmera;
- yaw, pitch, roll e zoom;
- modo fotográfico;
- inspeções;
- locais visitados;
- replay.

Ela não possui objetos WebGL nem regras de física.

## Camada física

`OrbitalFlightModel` é serializável e independente do renderizador. Ele mantém:

- posição e velocidade 3D;
- orientação e velocidade angular;
- combustível RCS;
- distância;
- velocidade relativa;
- erro angular;
- estados FREE, APPROACH, FINAL, DOCKED, COLLISION e RETREAT;
- piloto automático;
- eventos.

## Worker

`orbital-flight.worker.js` executa a simulação fora da thread da interface. O perfil gráfico altera a frequência de atualização, mas não altera as regras.

## Renderizador

`StationRemasterSceneRenderer` recebe cópias de estado e as transforma em imagem. Ele não decide se o acoplamento é válido.

Uniformes principais:

- `u_station`;
- `u_vehicle`;
- `u_satellite`;
- `u_camera`;
- `u_vehicle_pos`;
- `u_vehicle_rot`;
- `u_yaw`;
- `u_pitch`;
- `u_roll`;
- `u_zoom`;
- `u_quality`;
- `u_motion`.

## Entrada

A entrada é normalizada pelo `ImmersiveInputController`.

Movimentos de inspeção não são enviados para a física. Comandos RCS só são processados nas câmeras:

- voo livre;
- cabine;
- porta de acoplamento.

Isso impede consumo de combustível enquanto o estudante apenas gira a câmera de inspeção.

## Lifecycle

Ao sair do módulo:

1. o Worker é interrompido;
2. timers são cancelados;
3. o input é desconectado;
4. o RAF é cancelado;
5. ResizeObserver e listeners são removidos;
6. buffer, VAO e programa WebGL são liberados.

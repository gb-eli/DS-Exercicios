# Arquitetura do laboratório Estação Espacial

## Separação de responsabilidades

```text
SpaceStationModule
├── UI, abas, HUD e checkpoints
├── StationSceneRenderer
│   ├── WebGL2/GLSL
│   ├── exterior / interior / EVA
│   ├── câmera 360°
│   ├── fallback Canvas 2D
│   └── diagnóstico e context loss
├── station.worker.js
│   └── StationMissionModel
│       ├── StationSystemsModel
│       ├── DockingModel
│       └── RoboticArmModel
└── InventorySystem
    ├── estoque
    ├── consumo
    ├── manutenção
    └── exportação
```

## Regras

- a simulação não depende do Canvas;
- o renderizador não é fonte de verdade;
- os dados enviados pelo Worker são serializáveis;
- a redução gráfica não altera critérios educacionais;
- Worker e RAF são encerrados ao sair;
- o inventário é salvo por perfil;
- falhas possuem causa, sintoma e procedimento verificável.

## Estados principais

### Estação

`STANDBY → ACTIVE → PAUSED / SAFE`

### Acoplamento

`IDLE → APPROACH → HOLD → FINAL → SOFT_CAPTURE → HARD_DOCK`

Caminho alternativo: `APPROACH / HOLD / FINAL → ABORTED`.

### Braço

`OFF → READY → ALIGNED → GRAPPLED → TRANSLATING → BERTHED → STOWED`

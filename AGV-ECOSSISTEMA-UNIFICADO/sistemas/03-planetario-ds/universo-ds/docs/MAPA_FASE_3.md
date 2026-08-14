# Mapa da Fase 3 — Centro de Controle Avançado

## Fluxo principal

```text
ABRIR MÓDULO
    ↓
CARREGAR WORKER + REGRAS + RADAR
    ↓
RECEBER TELEMETRIA
    ↓
REGISTRAR FILA + REPLAY + LOGS
    ↓
INJETAR FALHA
    ↓
ANALISAR SINTOMAS
    ↓
ESCOLHER RESPOSTA
    ↓
MITIGAR OU BLOQUEAR
    ↓
REGISTRAR CHECKPOINT
```

## Mapa de componentes

```text
MissionControlAdvancedModule
├── HolographicRadarRenderer
├── telemetry.worker.js
├── MissionStateMachine
├── PriorityMessageQueue
├── ReplayBuffer
├── missionControlScenarios.js
├── ProfileStore
└── SettingsStore
```

## Separação de responsabilidades

| Componente | Responsabilidade |
|---|---|
| Worker | produzir amostras e simular sintomas |
| Máquina de estados | validar ordem operacional |
| Fila | ordenar, descartar e aplicar backpressure |
| Replay | manter janela temporal e analisar valores |
| Módulo | apresentar dados e receber ações |
| ProfileStore | registrar XP e experiências |
| Radar | renderizar apenas a camada visual |

## Falhas e respostas

| Falha | Sinais | Resposta segura |
|---|---|---|
| Deriva térmica | diferença A/B crescente | isolar sensor B |
| Saturação | fila e latência crescentes | ativar backpressure |
| Perda de pacotes | link baixo e lacunas | retransmissão seletiva |
| Queda de energia | tensão baixa e carga alta | desligar cargas não críticas |

## Extensões preparadas

- importação de arquivos de telemetria;
- exportação de replay;
- criação de cenários pelo professor;
- colaboração por função;
- integração futura com módulo de foguetes;
- telemetria realista do lançamento;
- painel de evidências.

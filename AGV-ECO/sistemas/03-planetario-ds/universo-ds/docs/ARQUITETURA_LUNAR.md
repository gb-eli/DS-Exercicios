# Arquitetura da Fase 6 — Lua e Apollo

## Separação de responsabilidades

```text
MoonApolloModule
├── ApolloComputer
│   ├── tarefas
│   ├── memória
│   ├── escalonamento
│   ├── alarmes
│   └── Assembly didático
├── LunarDescentModel
│   ├── estados
│   ├── dinâmica
│   ├── combustível
│   ├── sensores
│   └── falhas
├── SurfaceMissionModel
│   ├── sequência EVA
│   ├── energia
│   ├── inventário
│   └── ciência
├── lunar.worker.js
│   └── relógio e telemetria fora da interface
└── LunarSceneRenderer
    ├── shader procedural
    ├── câmera
    ├── poeira
    └── fallback 2D
```

## Contratos

### ApolloComputer

- não depende de DOM;
- recebe tarefas e orçamento de ciclos;
- expõe `schedule`, `priorityRestart`, `executeProgram` e `snapshot`;
- registra somente dados serializáveis.

### LunarDescentModel

- não conhece Canvas ou elementos HTML;
- aceita `step(dt)` e controles numéricos;
- retorna telemetria serializável;
- mantém falhas e eventos explícitos.

### Worker

- executa o relógio da simulação;
- recebe configuração, velocidade, controles e falhas;
- publica telemetria e eventos;
- pode ser substituído por fallback local.

### Renderer

- recebe somente telemetria;
- não decide sucesso, combustível ou prioridade;
- adapta resolução e passos do shader;
- libera recursos em `destroy`.

## Estratégia de assets

A Fase 6 funciona sem GLB. Modelos futuros deverão entrar por manifesto, com:

- GLB/glTF 2.0;
- LOD baixo, médio e alto;
- pivôs consistentes;
- colisores simplificados;
- texturas comprimidas;
- descarte ao sair do módulo.

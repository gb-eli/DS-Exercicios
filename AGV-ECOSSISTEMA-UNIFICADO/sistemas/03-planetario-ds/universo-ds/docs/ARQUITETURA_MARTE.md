# Arquitetura da Fase 7 — Marte e Robótica

## Limites principais

```text
Interface DOM
  ├─ abas, HUD, mapa, banco e controles
  └─ não é fonte de verdade da missão

Renderizador
  ├─ MarsSceneRenderer
  ├─ WebGL2/GLSL
  └─ fallback Canvas 2D

Worker de missão
  ├─ MarsMissionModel
  ├─ MarsCommandQueue
  ├─ energia, temperatura e telemetria
  └─ comandos, falhas e eventos

Núcleo analítico
  ├─ MarsGrid / A*
  ├─ MarsVisionLab
  ├─ ScienceDatabase
  └─ DroneSystem
```

## Estado serializável

O Worker retorna somente objetos simples:

- estado;
- tempo;
- posição e orientação;
- bateria e temperatura;
- patinagem;
- distância e dados;
- braço e câmera;
- fila e ACKs;
- rota;
- drone;
- falha ativa.

Nenhum objeto WebGL ou elemento DOM entra no estado da simulação.

## Fila de comandos

Cada comando possui:

- `id`;
- `type`;
- `priority`;
- `sentAt`;
- `deliverAt`;
- `attempt`;
- estado de ACK.

IDs executados entram no conjunto `seen`; uma repetição com o mesmo ID é ignorada, demonstrando idempotência.

## Navegação

O `MarsGrid` usa A* com:

```text
f(n) = g(n) + h(n)
```

- `g`: custo acumulado do terreno;
- `h`: distância Manhattan;
- obstáculos com custo infinito;
- rota reconstruída por mapa de predecessores.

## Persistência científica

O banco é salvo por perfil na chave:

```text
mars-science-<profile-id>
```

A limpeza geral do COSMOS DS remove somente as chaves do projeto.

## Extensão futura para GLB

O módulo atual funciona sem modelos externos. Veículos futuros devem usar GLB/glTF, pivôs consistentes, LODs, materiais compartilhados e texturas comprimidas. O modelo visual não poderá assumir regras de missão.

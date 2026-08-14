# COSMOS DS — Entrega da Fase 3

Data de consolidação: 3 de agosto de 2026.

## Objetivo

Transformar o Centro de Controle inicial em um laboratório de sistemas críticos capaz de demonstrar, de maneira interativa, conceitos de concorrência, telemetria, máquinas de estados, filas, confiabilidade, replay, análise de causa raiz e degradação controlada.

## Experiência entregue

O novo módulo possui cinco áreas independentes:

### 1. Operação

- radar holográfico;
- digital twin visual da missão;
- telemetria produzida por Web Worker;
- temperatura redundante A/B;
- latência;
- link de dados;
- tensão do barramento;
- profundidade da fila;
- estado de voo;
- gráfico temporal;
- pausa, passo único e reinicialização;
- escolha e injeção de cenários.

### 2. Máquina de estados

Estados:

1. STANDBY;
2. CHECKLIST;
3. COUNTDOWN;
4. IGNITION;
5. ASCENT;
6. ORBIT;
7. DEPLOYMENT.

O aluno pode tentar qualquer comando. A regra aceita apenas a transição válida para o estado atual e registra comandos bloqueados.

### 3. Fila prioritária

Prioridades:

- critical;
- high;
- normal;
- low.

A fila possui capacidade finita, substitui mensagens de menor prioridade quando necessário e pode ativar backpressure para impedir que dados não críticos ocupem toda a capacidade.

### 4. Replay

- buffer circular de 180 amostras;
- controle deslizante;
- inspeção de temperatura, latência, link e fila;
- cálculo de mínimo, máximo e média;
- detecção de anomalias;
- desafio de causa raiz.

### 5. Logs

Os eventos são classificados por camada:

- INFO;
- DATA;
- STATE;
- QUEUE;
- ALERT;
- DENY;
- OK;
- CERT.

## Cenários progressivos

| Nível | Cenário | Conceitos | XP |
|---|---|---|---:|
| 1 | Deriva térmica | redundância e validação | 120 |
| 2 | Fila saturada | prioridade e backpressure | 140 |
| 3 | Perda de pacotes | retransmissão e idempotência | 160 |
| 4 | Queda de energia | fail-safe e degradação | 180 |

Checkpoints adicionais:

| Checkpoint | XP |
|---|---:|
| Sequência completa da máquina de estados | 160 |
| Backpressure no laboratório de filas | 150 |
| Análise correta do replay | 140 |
| Certificação dos quatro cenários | 240 |

Total novo possível: **1.290 XP**.

## Carregamento e desempenho

O módulo avançado não faz parte do carregamento inicial. Ao ser aberto, importa:

- módulo visual;
- classes de missão;
- dados dos cenários;
- radar holográfico;
- Worker de telemetria.

Ao sair, encerra:

- Worker;
- timers de fallback;
- requestAnimationFrame do radar;
- ResizeObserver;
- listeners do módulo.

## Perfis

| Perfil | Telemetria | Gráfico | Radar e animações |
|---|---:|---:|---|
| Desempenho | aproximadamente 1.100 ms | 36 amostras | densidade reduzida |
| Equilibrado | aproximadamente 650 ms | 72 amostras | densidade intermediária |
| Experiência | aproximadamente 350 ms | 120 amostras | maior densidade e resolução |

O modo de redução de movimento paralisa ou reduz animações contínuas.

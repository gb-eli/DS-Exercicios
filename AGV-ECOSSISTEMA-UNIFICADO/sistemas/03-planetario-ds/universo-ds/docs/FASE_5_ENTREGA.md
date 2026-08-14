# Entrega da Fase 5 — Foguetes e Lançamentos

## Objetivo concluído

A Fase 5 introduz o primeiro ciclo completo entre **projeto do veículo**, **validação de requisitos**, **intertravamentos operacionais**, **simulação física**, **tratamento de falhas** e **inserção orbital**.

O estudante não recebe apenas uma animação pronta. Ele precisa construir uma configuração coerente, executar o checklist na ordem correta e interpretar a telemetria durante o voo.

## Estações implementadas

### 1. Hangar procedural

- foguete autoral renderizado por WebGL2 e GLSL;
- fallback Canvas 2D;
- câmera por arraste e zoom;
- coifa, estágio superior, primeiro estágio, aletas e motores;
- variações visuais para núcleos compacto, pesado e reutilizável;
- redução de ray marching e resolução conforme o perfil gráfico.

### 2. Construtor da missão

O aluno escolhe:

- missão;
- carga útil;
- primeiro estágio;
- estágio superior;
- sistema de orientação, navegação e controle;
- coifa;
- base;
- reserva de propelente;
- planejamento de recuperação.

O sistema calcula:

- massa de lançamento;
- relação empuxo/peso;
- Δv por estágio;
- contribuição da base;
- margem total;
- limite estrutural;
- compatibilidade da carga;
- confiabilidade da navegação.

### 3. Checklist digital

Foram implementados oito intertravamentos:

1. perfil da missão;
2. estrutura e coifa;
3. propulsão;
4. software de voo;
5. telemetria;
6. segurança de área;
7. condições atmosféricas;
8. energia interna.

A ignição fica bloqueada até que todos sejam aprovados na ordem.

### 4. Voo processado em Worker

O modelo calcula:

- contagem regressiva;
- throttle;
- consumo de propelente;
- massa variável;
- empuxo;
- gravidade com altitude;
- densidade atmosférica;
- arrasto;
- pressão dinâmica;
- Max Q;
- programa de inclinação;
- velocidades vertical e horizontal;
- separação de estágios;
- ignição do estágio superior;
- inserção orbital.

### 5. Laboratório de falhas

- perda parcial de empuxo;
- deriva no sensor de altitude;
- pressão dinâmica elevada;
- perda de comunicação.

Cada falha possui alternativas verificáveis e conexão explícita com conceitos de DS.

## Progressão

| Evidência | XP |
|---|---:|
| Projeto do veículo validado | 320 |
| Checklist concluído | 220 |
| Inserção orbital | 480 |
| Cada uma das quatro falhas | 180 |
| Certificação da fase | 300 |
| **Total possível** | **2.020** |

O XP é idempotente: repetir a experiência não duplica a recompensa.

## Arquivos centrais

- `src/data/launchSystems.js`
- `src/core/launch/RocketSystem.js`
- `src/core/launch/RocketFlightModel.js`
- `src/workers/launch.worker.js`
- `src/rendering/RocketSceneRenderer.js`
- `src/modules/launch/LaunchModule.js`

## Escopo conscientemente adiado

- veículos históricos ou empresariais reproduzidos em GLB;
- texturas PBR externas;
- recuperação física completa do primeiro estágio;
- simulação de múltiplos corpos;
- reentrada atmosférica detalhada;
- lançamento multiplayer.

A arquitetura da fase permite acrescentar esses recursos sem mover as regras para o renderizador.

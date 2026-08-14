# Mapa funcional — Fase 5

## Fluxo principal

```text
Portal
  ↓ import() sob demanda
Centro de Lançamento
  ├─ Hangar 3D
  ├─ Construtor
  ├─ Checklist
  ├─ Voo
  └─ Sistemas DS
```

## Fluxo educacional

```text
Requisito da missão
  ↓
Configuração serializável
  ↓
Validação de massa, T/W e Δv
  ↓
Intertravamentos
  ↓
Máquina de estados
  ↓
Worker físico
  ↓
Telemetria + gráfico + logs
  ↓
Falhas e recuperação
  ↓
Certificação
```

## Estados do voo

```text
PRELAUNCH
  → COUNTDOWN
  → IGNITION
  → ASCENT_STAGE_1
  → MAX_Q
  → STAGE_SEPARATION
  → ASCENT_STAGE_2
  → ORBIT_INSERTION
  → ORBIT
```

Saídas seguras ou negativas:

```text
ABORTED
FAILED
```

## Dados produzidos

- estado;
- tempo;
- estágio;
- throttle;
- altitude real e reportada;
- velocidade vertical, horizontal e total;
- downrange;
- pressão dinâmica;
- aceleração;
- massa;
- propelente de cada estágio;
- qualidade do enlace;
- falhas e recuperações.

## Adaptação por dispositivo

| Perfil | Shader | Canvas | Worker | Fumaça |
|---|---|---|---|---|
| Desempenho | menos passos | resolução reduzida | menor frequência visual | mínima |
| Equilibrado | passos médios | resolução moderada | padrão | moderada |
| Experiência | mais passos | maior resolução | maior frequência visual | completa |

A física e os critérios de aprovação são iguais em todos os perfis.

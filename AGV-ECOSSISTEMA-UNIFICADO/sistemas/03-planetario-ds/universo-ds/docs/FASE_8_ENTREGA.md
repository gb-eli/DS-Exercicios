# COSMOS DS — Entrega da Fase 8

## Visão da fase

A Fase 8 transforma a estação espacial em um laboratório de sistemas distribuídos de alta disponibilidade. O aluno navega pelo exterior, interior e atividade extraveicular, acompanha recursos críticos, realiza acoplamento, opera um braço robótico e mantém logística e manutenção rastreáveis.

## Experiências implementadas

### 1. História e arquitetura orbital

- Salyut 1, Skylab, Mir e evolução da ISS;
- presença humana contínua e operação prolongada;
- robótica orbital e novos veículos;
- conexões com arquitetura modular, contratos, observabilidade e tolerância a falhas;
- sete subsistemas técnicos interligados.

### 2. Estação 3D e 360°

- renderizador procedural WebGL2/GLSL;
- exterior com módulos, treliça, painéis solares, Terra, cápsula e braço;
- interior com corredor modular, painéis, frames e objetos em microgravidade;
- modo EVA com astronauta, partículas e atividade externa;
- arraste para câmera 360°, zoom, centralização e fullscreen;
- fallback Canvas 2D;
- recuperação de perda de contexto WebGL;
- auditoria gráfica em tempo real.

### 3. Sistemas críticos em Worker

- energia solar, carga e bateria;
- oxigênio, CO₂, pressão, umidade e água;
- controle térmico e coolant;
- orientação e comunicação;
- órbita com ciclo de iluminação;
- estado nominal, degradado, seguro e pausado;
- fallback local quando Worker não está disponível.

### 4. Acoplamento

- três perfis de dificuldade;
- distância relativa e velocidade de fechamento;
- yaw, pitch, roll e erro combinado;
- pontos de espera;
- captura suave e acoplamento rígido;
- assistência didática e operação manual;
- hold, retomada e abortagem.

### 5. Braço robótico

- energização e autodiagnóstico;
- alinhamento;
- captura da carga;
- transporte;
- fixação no berço;
- recolhimento;
- juntas e limites operacionais.

### 6. EVA

- checklist com seis intertravamentos;
- traje, pressão, oxigênio, energia, ferramentas, cabo e comunicação;
- autorização somente após todos os itens.

### 7. Inventário e manutenção

- estoque disponível e mínimo;
- alertas de quantidade baixa;
- consumo de peças por tarefa;
- histórico por perfil;
- quatro manutenções preventivas;
- exportação JSON.

### 8. Falhas

- depurador de CO₂ degradado;
- vazamento no loop térmico;
- sombreamento dos painéis;
- microvazamento de cabine;
- recuperação por redundância, isolamento, priorização e contenção.

## Progressão

| Grupo | XP máximo |
|---|---:|
| Arquitetura orbital | 240 |
| Turno nominal | 280 |
| Acoplamento | 520 |
| Braço robótico | 950 |
| EVA | 260 |
| Manutenção | 700 |
| Quatro falhas | 870 |
| Certificação | 450 |
| **Total possível** | **4.270 XP** |

O XP permanece idempotente.

## Revisão gráfica aplicada

- correção de listeners de resize em Marte e Lua;
- contexto WebGL perdido tratado na estação;
- resolução interna adaptativa;
- partículas somente quando coerentes com falha, aproximação ou EVA;
- sem fumaça atmosférica contínua no vácuo;
- HUD compacto para preservar o campo visual;
- mobile com controles recolhidos e telemetria reduzida;
- `prefers-reduced-motion` respeitado.

## Desempenho

- **Desempenho:** ray marching reduzido, resolução menor e menos partículas.
- **Equilibrado:** perfil recomendado para notebooks escolares.
- **Experiência:** maior resolução, mais passos e detalhes visuais.
- **Reduzir movimento:** paralisa partículas e flutuação não essenciais.

As regras de sistemas, acoplamento e avaliação são iguais em todos os perfis.

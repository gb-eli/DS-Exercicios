# Entrega da Fase 4 — Terra, Satélites e Órbitas

## Objetivo concluído

A Fase 4 introduz o primeiro ambiente planetário operacional do COSMOS DS. O estudante não apenas observa a Terra: ele seleciona órbitas, configura subsistemas, acompanha uma passagem, gerencia energia e dados e valida decisões técnicas.

## Experiências

### 1. Globo 3D

- shader procedural WebGL2;
- iluminação diurna e noturna;
- cidades noturnas procedurais;
- nuvens e atmosfera por perfil gráfico;
- grade técnica;
- rotação por arraste;
- zoom por roda ou gesto equivalente;
- órbita e marcador de satélite;
- fallback Canvas 2D.

### 2. Laboratório de órbitas

- LEO;
- polar;
- heliossíncrona;
- MEO;
- GEO;
- altitude e inclinação personalizadas;
- período orbital;
- velocidade circular;
- raio de cobertura;
- três desafios de escolha técnica.

### 3. Montagem de satélite

O estudante escolhe:

- finalidade da missão;
- órbita;
- barramento;
- carga útil;
- geração solar;
- antena.

O sistema calcula e valida:

- massa total;
- limite do barramento;
- potência gerada;
- carga de pico;
- margem de energia;
- produção e downlink;
- autonomia em eclipse;
- compatibilidade com a missão.

### 4. Operação orbital

- propagação simplificada em Worker;
- mapa de trajetória;
- quatro estações de solo;
- contato e qualidade do link;
- geração solar e eclipse;
- bateria;
- produção e armazenamento de dados;
- downlink;
- pacote JSON serializável;
- velocidades temporais de 10× a 1200×.

## Progressão

| Checkpoint | XP |
|---|---:|
| Decisão orbital 1 | 180 |
| Decisão orbital 2 | 180 |
| Decisão orbital 3 | 180 |
| Satélite validado | 300 |
| Operação validada | 240 |
| Certificação orbital | 300 |
| **Total** | **1.380** |

O XP é idempotente: repetir uma atividade não duplica a recompensa.

## Desempenho

- **Desempenho:** esfera com menos segmentos, resolução reduzida, sem nuvens e menor frequência do Worker;
- **Equilibrado:** esfera intermediária, atmosfera e nuvens moderadas;
- **Experiência:** geometria elevada, maior resolução, nuvens, grade e detalhes adicionais;
- **Reduzir movimento:** interrompe rotação automática e reduz animações decorativas.

## Limites declarados

- órbitas circulares simplificadas;
- não inclui perturbações, manobras impulsivas ou propagação SGP4;
- o mapa é didático e não substitui cartografia real;
- o globo procedural não é uma fotografia da Terra;
- estações e enlaces são utilizados em uma simulação educacional.

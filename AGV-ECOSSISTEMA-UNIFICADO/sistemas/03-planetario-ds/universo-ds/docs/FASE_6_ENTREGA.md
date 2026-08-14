# COSMOS DS — Entrega da Fase 6

## Escopo concluído

A Fase 6 transforma a Lua em um laboratório de Desenvolvimento de Sistemas, conectando história, arquitetura de software, computação limitada, sistemas de tempo real, operação humana, renderização procedural e missão científica.

## Estações implementadas

### 1. Apollo

- nove marcos entre Apollo 1 e Apollo 17;
- missão, objetivo e conexão com conceitos de DS;
- arquitetura do módulo de comando, serviço e lunar;
- desafio de sequência Apollo 8 → Apollo 10 → Apollo 11;
- fontes oficiais associadas a cada marco.

### 2. Computador Apollo didático

- 2.048 palavras apagáveis e 36.864 palavras fixas como referência educacional;
- tarefas críticas e secundárias;
- orçamento de 100 ciclos por janela didática;
- escalonamento por prioridade;
- sobrecarga por tarefa adicional;
- alarmes 1201 e 1202;
- reinício prioritário;
- memória, registradores e atuadores;
- três desafios Assembly simplificado.

### 3. Descida lunar

- superfície e módulo lunar procedurais;
- WebGL2 + GLSL e fallback Canvas 2D;
- três locais de pouso;
- seis intertravamentos;
- separação, PDI, frenagem, aproximação, descida final e contato;
- combustível, massa, velocidades, radar e computador;
- Worker dedicado;
- pausa, retomada, velocidade e abortagem;
- falhas de radar, sobrecarga e combustível;
- gráfico e logs.

### 4. Superfície

- saída e inspeção;
- amostra basáltica;
- sismômetro;
- rover;
- regolito;
- retorno ao módulo;
- energia, tempo, inventário, amostras e distância.

### 5. Sistemas DS

- visualização das seis camadas técnicas;
- certificação Engenharia de Software Lunar;
- exportação de evidência em JSON;
- registro das limitações didáticas da simulação.

## XP da fase

| Grupo | XP possível |
|---|---:|
| História Apollo | 180 |
| Assembly didático | 510 |
| Alarmes 1201/1202 | 440 |
| Reinício prioritário | 220 |
| Pouso lunar | 480 |
| Objetivos de superfície | 700 |
| Conclusão da superfície | 250 |
| Certificação | 350 |
| **Total máximo novo** | **3.130 XP** |

O XP é idempotente por perfil.

## Limites declarados

- o Assembly é uma linguagem educacional;
- a física é simplificada para estabilidade e aprendizagem;
- o terreno não representa topografia métrica;
- o módulo lunar é procedural;
- informações históricas e gamificação permanecem identificadas separadamente.

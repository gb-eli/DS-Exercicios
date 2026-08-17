# Bugs corrigidos — Fliperama DS v0.27.0

## 1. Labirinto de Dados — fase impossível

### Problema

A fase 1, **Memória Central**, possuía três células caminháveis isoladas nas posições `10:4`, `11:4` e `12:4`. O gerador colocava pellets nessas células, mas o jogador não conseguia alcançá-las. Como a passagem de fase exige que todos os pellets e pontos de poder sejam coletados, o jogo nunca chegava à vitória.

### Correção

- criada uma ligação vertical entre a região isolada e os corredores inferiores;
- adicionada busca em largura para validar todas as células caminháveis;
- o gerador de coletas agora utiliza apenas células alcançáveis;
- cada mapa é analisado durante o carregamento do módulo.

### Resultado

- fase 1: 211/211 células alcançáveis;
- fase 2: 223/223 células alcançáveis;
- fase 3: 207/207 células alcançáveis;
- progressão forçada validada com eventos `level-complete`, `level-complete` e `victory`.

## 2. Puzzle Forge — labirinto criado sem saída

### Problema

O editor aceitava qualquer grade 7×7 com início e saída abertos, mesmo quando todas as rotas entre esses pontos estavam bloqueadas.

### Correção

- criada análise por busca em largura;
- criado reparo de custo mínimo para abrir somente as paredes necessárias;
- início e saída continuam protegidos;
- um layout totalmente bloqueado passa a receber uma rota válida de 12 movimentos.

## 3. State Quest RPG — objetivo final inacessível

### Problema

O **Console do Núcleo** estava dentro de uma área cercada por paredes sem abertura. O jogador podia entrar no mapa final, mas não alcançar o objetivo principal.

### Correção

Foi aberta uma passagem na parede inferior da instalação, preservando a sala central e permitindo acesso ao console.

## 4. Corredores Raycast — área inicial isolada

### Problema

O jogador e a primeira chave estavam em um componente separado do restante do mapa. Mesmo tratando todas as portas como abertas, não existia ligação física com terminais, segunda chave ou saída.

### Correção

Foi aberta uma passagem controlada entre a câmara inicial e o corredor principal.

### Resultado

Uma busca de estados encontrou rota válida com:

- duas chaves;
- duas portas disponíveis;
- três terminais ativados;
- saída alcançada;
- 3.829 estados analisados.

## 5. Trap Lab — checkpoint repetido

### Problema

O teste comparava a posição central do tile com a posição de reaparecimento do jogador, que possui deslocamento vertical. Enquanto o personagem permanecia sobre o checkpoint, o jogo registrava o mesmo evento em vários frames.

### Correção

A comparação passou a utilizar a mesma coordenada de reaparecimento salva no estado.

### Resultado

O teste de 40 ciclos registra exatamente um evento de checkpoint.

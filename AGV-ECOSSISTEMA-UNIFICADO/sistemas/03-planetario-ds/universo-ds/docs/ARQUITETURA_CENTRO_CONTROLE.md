# Arquitetura do Centro de Controle Avançado

## Princípio principal

A simulação é a fonte de verdade. Canvas, WebGL, cards, gráficos e animações apenas representam o estado.

## Web Worker

O arquivo `src/workers/telemetry.worker.js` executa fora da thread principal e responde a mensagens:

- `start`;
- `stop`;
- `step`;
- `reset`;
- `quality`;
- `inject`;
- `mitigate`.

As respostas são objetos serializáveis com os tipos:

- `status`;
- `telemetry`;
- `fault`;
- `reset`.

## Fallback

Se Worker não existir ou falhar, o módulo usa um timer local com frequência adaptada. O conteúdo educacional continua disponível, mas o processamento deixa de estar isolado.

## Máquina de estados

A classe `MissionStateMachine` não conhece DOM nem renderizador. Ela recebe estados e transições e fornece:

- ações disponíveis;
- validação;
- envio de comando;
- histórico;
- snapshot;
- reset.

## Fila

A classe `PriorityMessageQueue` mantém ordenação estável por prioridade e ordem de chegada. Quando cheia, uma mensagem crítica pode substituir uma de prioridade inferior. Backpressure rejeita mensagens `low` antes de ocupar capacidade necessária para informações críticas.

## Replay

A classe `ReplayBuffer` armazena apenas dados serializáveis. Ela possui capacidade fixa, consulta por índice, seleção de intervalo, estatísticas e detecção de anomalias.

## Radar holográfico

O `HolographicRadarRenderer` utiliza WebGL2 e GLSL para:

- círculos concêntricos;
- linhas radiais;
- feixe rotativo;
- alvos procedurais;
- ruído holográfico.

Quando WebGL2 não estiver disponível, desenha uma versão simplificada em Canvas 2D.

## Limites definidos

- nenhuma regra é armazenada em elementos HTML;
- nenhum objeto WebGL é salvo no perfil;
- nenhum timer permanece ativo após sair;
- nenhuma recompensa depende apenas de clicar;
- nenhuma mensagem de baixa prioridade pode expulsar uma crítica;
- nenhuma transição inválida altera o estado.

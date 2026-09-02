# F94.7 — Locomoção Real Unificada 2D/3D

Base: F94.6 / v14.10.8.96  
Cache público: `stage69-f947-locomotion-live`  
Escopo: G2/G2.1 — aplicação do PlayerLocomotion V2 nos loops reais de movimento.

## Objetivo

Remover a diferença de sensação de deslocamento entre mundos causada por movimento instantâneo calculado separadamente em cada runtime. A F94.7 faz o movimento a pé 2D e 3D consumir o mesmo kernel fixed-step, preservando física especial de veículos, airdrop, brinquedos e minigames.

## Núcleo compartilhado

`lobby/assets/core/runtime-v2/player-locomotion.js`

- revisão `F94.7`;
- fixed timestep: 60 Hz;
- walk exterior: 16;
- run exterior: 28;
- walk interior: 8;
- run interior: 13;
- aceleração: 48 unidades/s²;
- desaceleração: 58 unidades/s²;
- parada de corrida em aproximadamente 0,48 s no pior caso de 28 unidades/s;
- normalização de input diagonal;
- estados compartilhados;
- `stepHorizontal()` para runtimes que ainda possuem solver próprio de terreno/vertical;
- `haltHorizontal()` para teleportes, transições e modos especiais.

A aceleração/desaceleração foi implementada por aproximação vetorial com limite de delta por segundo. Isso evita diferenças por direção diagonal e evita a sensação de “velocidade instantânea”.

## Cobertura dos 18 mundos persistentes

| Família / mundo | 2D | 3D | Observação |
| --- | --- | --- | --- |
| Campus DS | V2 live | V2 live | veículos/airdrop/ride isolados |
| Vilas 1DS/2DS/3DS/Sub | V2 live compartilhado | V2 live compartilhado | mesma base `village-*` |
| Biblioteca/Labs/Neon | V2 live compartilhado | V2 live compartilhado | mesma base `campus-module-*` |
| Vale do Silício | V2 live | V2 live | interior usa perfil reduzido quando aplicável |
| Mundo Rural | V2 live | V2 live | movimento a pé unificado |
| Base de Operações | V2 live | V2 live | interior usa 8/13 |
| Estação Orbital | V2 live | V2 live | perfil orbital, movimento horizontal compartilhado |
| Lua | V2 live | V2 live | rover permanece sistema separado |
| Marte | V2 live | V2 live | rover permanece sistema separado |
| Parque | V2 live | V2 live | rides/parkour/coaster continuam mecânicas próprias |
| Colégio AGV | V2 via plugin host | V2 via plugin host | host personalizado herda o kernel |
| Labirinto | V2 via plugin host | V2 via plugin host | host personalizado herda o kernel |
| Museu do Hardware | V2 live | V2 live | inspeção pode bloquear locomotion |

O Airdrop Transit continua deliberadamente fora da locomoção terrestre. Glide/paraquedas será tratado como flight/glide controller próprio.

## Comportamento de veículos e experiências

A F94.7 não mistura condução com caminhada. Rover Lua/Marte, veículos do Campus, passageiro, airdrop, rides do Parque e demais experiências especiais continuam fora de `stepHorizontal()`. Isso é intencional: a futura Vehicle Core V2/Rapier deve ter modelo físico próprio.

## Teleporte e transições

Os principais runtimes passam a zerar a velocidade horizontal ao teleportar. Isso evita o bug de “escorregar” depois de fast travel/teleporte. Modos bloqueados também desaceleram/zeram o kernel sem mover o personagem.

## Cache-bust

Foram atualizados:

- `index → vendor-loader → boot → lobby`;
- Service Worker para `stage69-f947-locomotion-live`;
- `gameplay-settings.js`;
- Runtime Contract/WorldManager por URL versionada;
- `world-adapter.js`;
- lazy imports 2D/3D dos runtimes alterados;
- `world-runtime-prefetch.js`;
- hosts do Colégio/Labirinto;
- `plugin-world-host.js`.

Isso é necessário para impedir mistura de runtime F94.6 com locomotion F94.7 em navegadores que já possuam cache do Lobby.

## Validação

- suíte F94.7: 13/13 PASS;
- 153 arquivos JavaScript do Lobby: 0 erros sintáticos;
- 420 imports locais: 0 ausentes;
- 72 recursos do `CRITICAL_SHELL`: 0 ausentes;
- simulação de fixed timestep comparada em 30/60/120 Hz: dentro da tolerância;
- aceleração, desaceleração, interior e perfil lunar validados por simulação;
- 2D e 3D prioritários verificados estaticamente para consumo de `createPlayerLocomotion()` + `stepHorizontal()`;
- Airdrop verificado como isolado.

Testes históricos F91/F92/F94/F94.6 contêm asserts de URLs/cache-bust exatos das fases antigas. A F94.7 altera essas URLs propositalmente; essas falhas de string não são usadas como critério de regressão desta fase. Os testes sem alteração de expectativa mantêm o mesmo padrão de falhas pré-existentes observado na F94.6.

## Limites desta fase

Não houve execução visual real em Chromium nesta sessão. Portanto, a F94.7 valida código, topologia, imports e simulação do kernel, mas ainda exige smoke test real em desktop/mobile.

A F94.7 ainda não implementa:

- Camera V2;
- olhar livre para o céu;
- configuração Invert Y;
- Mirante 360°/50x;
- Rapier;
- Vehicle Core V2;
- física real de montanha-russa;
- streaming gráfico/asset pipeline novo;
- Colyseus.

## Próxima fase

F94.8 — Camera V2:

- yaw/pitch coerentes;
- opção Invert Y real;
- pitch livre em terceira pessoa;
- olhar para o céu/baixo com limites configuráveis;
- câmera de ombro/exploração;
- câmera de veículo;
- preparação do Optics Controller do Mirante 360°/50x;
- mouse/touch/pinch padronizados.

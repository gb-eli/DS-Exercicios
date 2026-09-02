# F94.6 — Runtime Contract V2 + Locomotion Foundation

Base: F94.5.1 / v14.10.8.96
Escopo: G1 concluída + fundação de G2.

## Objetivo

Criar uma camada única para que os mundos deixem de depender de contratos implícitos e constantes locais de movimento. Esta fase não troca Three.js, não adiciona Rapier ainda e não altera backend.

## Entregas

- `lobby/assets/core/runtime-v2/world-runtime-contract.js`
  - contrato V2 obrigatório;
  - lifecycle normalizado: init/load/start/pause/resume/update/interact/enterInterior/exitInterior/setQuality/stop/dispose;
  - facade compatível com runtimes legados via Proxy;
  - preserva métodos específicos existentes dos mundos.
- `world-context.js`
  - identidade comum de worldId/scene/mode/quality/signal.
- `runtime-lifecycle.js`
  - fundação de lifecycle observável para as próximas fases.
- `player-locomotion.js`
  - perfis de locomoção centralizados;
  - walk/run globais 16/28;
  - interior 8/13;
  - fixed timestep 60 Hz;
  - estados de locomoção;
  - aceleração/desaceleração disponíveis para migração progressiva;
  - perfis explícitos para Earth/Moon/Station/Airdrop.
- `gameplay-settings.js`
  - velocidade, pulo e gravidade passam a vir da camada V2.
- `world-manager.js`
  - todo runtime iniciado pelo WorldManager é normalizado para Contract V2 antes de ficar ativo.

## Migração de pulo/gravidade

Migrados nesta fase:

- Campus 3D;
- Vilas 3D;
- módulos Campus 3D;
- Vale 3D;
- Mundo Rural 3D;
- Militar 3D;
- Parque 3D;
- Museu 3D;
- mundos hospedados pelo `plugin-world-host` (incluindo hosts personalizados compatíveis).

O Parque mantém o salto ampliado do parkour como mecânica explícita de minigame. Ele não é tratado como constante global de locomoção.

Lua e Estação continuam com física ambiental especial. A velocidade horizontal permanece padronizada em 16/28; diferenças de gravidade são declaradas no perfil, não espalhadas em constantes locais.

## Carregamento / cache

- cadeia pública avança para `stage68-f946-runtime-v2`;
- Runtime V2 entra no critical shell porque o WorldManager passa a depender dele;
- Service Worker contém 72 recursos críticos e todos existem no pacote;
- `gameplay-settings.js` recebe cache-bust próprio da F94.6.

## Validação

- F94.6: 8/8 PASS;
- 149 JS do Lobby: 0 erros sintáticos;
- 409 imports locais auditados: 0 ausentes;
- 72 assets críticos do Service Worker: 0 ausentes;
- suíte histórica selecionada: 32/36 PASS;
- os mesmos 4 testes históricos já falham na F94.5.1 original por esperarem tags de cache antigas / schema histórico; a F94.6 não introduziu falha adicional nessa comparação.

## O que ainda NÃO está concluído

G2 ainda precisa de uma segunda onda para substituir movimento instantâneo por aceleração/desaceleração V2 em todos os loops 3D e depois nos modos 2D. A camada fixed-step já existe, mas ainda não controla todos os runtimes.

Camera V2 não faz parte desta fase.
Rapier não faz parte desta fase.
Colyseus não faz parte desta fase.

## Próxima fase recomendada

F94.7 / G2.1:

1. aplicar `createPlayerLocomotion()` nos runtimes prioritários;
2. padronizar aceleração/desaceleração, turn rate e estados WALK/RUN/JUMP/FALL/LAND;
3. testar Campus, Vale, Rural, Parque, Colégio e Museu;
4. somente depois iniciar Camera V2.

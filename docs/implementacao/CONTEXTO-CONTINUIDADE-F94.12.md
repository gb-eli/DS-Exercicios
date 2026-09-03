# Continuidade — AGV World após F94.12

## Base atual

F94.12 — Vehicle Core V2 + preparação Rapier, `v14.10.8.96`.

## Sistemas consolidados nesta linha

- Runtime Contract V2;
- Locomotion V2;
- Camera V2;
- Interaction V2;
- hotfix Campus 3D/Airdrop;
- streaming modular e interiores;
- Quality/Asset Streaming V2;
- Vehicle Core V2.

## Vehicle Core V2

Ativo nesta fase em:

- Campus 3D terrestre;
- Campus 3D aéreo;
- Campus 2D terrestre;
- Campus 2D aéreo;
- Rover Lua 3D/2D;
- Rover Marte 3D/2D.

Não considerar Vale/Militar totalmente migrados e não converter rides do Parque implicitamente.

## Física

Adapter cinemático = ativo/default.

Adapter Rapier = preparado por injeção/fallback, ainda não ativado como engine de produção.

Próxima fase recomendada: F94.13 — piloto Rapier + `three-mesh-bvh`, começando de forma limitada e reversível em colisão/veículo terrestre do Campus e depois experiências selecionadas do Parque. Não fazer migração global de física de uma vez.

## Rede posterior

Após estabilização física:

1. NetworkManager central;
2. SupabaseTransport encapsulando o comportamento atual;
3. ColyseusTransport opcional;
4. prediction/interpolation;
5. failover PERFORMANCE → CONTINGENCY → SOLO;
6. AOI/chunks compartilhados com streaming visual.

Colyseus nunca deve ser obrigatório.

## Servidor no notebook

Quando chegar a fase do instalador Windows/Colyseus, o instalador deverá perguntar LOCALMENTE o nome do dispositivo antes do primeiro cadastro, pois a identificação física já está etiquetada. Padrão esperado, por exemplo:

`NT_DS_<ETIQUETA>`

Não definir esse nome pela central antes de saber qual notebook está sendo instalado.

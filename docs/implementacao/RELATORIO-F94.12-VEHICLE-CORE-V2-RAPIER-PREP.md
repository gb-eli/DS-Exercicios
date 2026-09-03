# AGV World — F94.12 Vehicle Core V2 + preparação Rapier

Versão base: F94.11 (`v14.10.8.96`)

## Objetivo

Unificar o contrato de veículos antes da migração física e da entrada do NetworkManager/Colyseus. A F94.12 não transforma Rapier em dependência obrigatória e não altera Supabase, migrations ou Edge Functions.

## Entregas

### Vehicle Core V2

Novos módulos em `lobby/assets/core/vehicle-v2/`:

- `vehicle-contract.js`: tipos, mobilidade, papéis, fases, capacidades, limites e normalização;
- `vehicle-controller.js`: aceleração, frenagem, ré, direção, subida/descida aérea e snapshots;
- `vehicle-physics-adapter.js`: adapter cinemático ativo e contrato opcional para Rapier;
- `vehicle-registry.js`: registro comum de frota;
- `vehicle-network-protocol.js`: pacote de estado V2 e interpolação para futura camada de rede.

### Campus 3D

O fluxo de motorista terrestre e piloto aéreo passa pelo `Vehicle Core V2`, preservando:

- limites de velocidade do Campus;
- semáforos e regras de trânsito existentes;
- colisões/recovery já existentes;
- helipontos e requisito de pouso;
- câmera de veículo/aérea;
- multiplayer terrestre existente e carona remota.

O runtime expõe aliases genéricos `enterVehicle`, `exitVehicle`, `getVehicleState`, diagnóstico do registro e do physics adapter.

### Campus 2D

O 2D passa a usar o mesmo núcleo de veículo. Além dos veículos terrestres, o runtime agora reconhece `CAMPUS_AERIAL_VEHICLES`, permitindo pilotagem local 2D de drone/helicóptero com altitude, subida e descida. Carona terrestre guiada é preservada.

### Lua e Marte

Os rovers em 2D e 3D deixam de manter cálculos de aceleração/direção independentes e passam pelo `Vehicle Core V2`. Os limites próprios declarados continuam respeitados: Rover Lunar 28 km/h e Rover Marciano 34 km/h.

### Runtime Contract V2

O contrato comum passa a reconhecer formalmente:

- `enterVehicle`
- `exitVehicle`
- `getVehicleState`

Runtimes legados continuam compatíveis por facade.

### Preparação Rapier

`createRapierVehiclePhysicsAdapter()` existe como adapter por injeção. Nesta fase:

- Rapier não é importado como dependência obrigatória;
- o adapter cinemático continua ativo por padrão;
- na ausência de Rapier/world/body, ocorre fallback para o adapter cinemático;
- nenhuma alegação de física Rapier em produção deve ser feita para a F94.12.

## Rede

`vehicle-network-protocol.js` define um pacote V2 com posição, heading, velocidade, velocidade vertical, fase, driver, sequência e timestamp. Isso prepara a futura integração pelo `NetworkManager`, evitando acoplamento direto do Vehicle Core ao Supabase ou ao Colyseus.

## Escopo que NÃO foi convertido

A F94.12 não torna automaticamente todo veículo cenográfico do Vale ou da Base Militar dirigível. Esses mapas continuam respeitando o nível real de interação definido na F94.9. O contrato está pronto para a migração posterior.

Também não converte montanha-russa, escorregadores e demais rides do Parque em veículos comuns; essas experiências terão adapter físico específico.

## Cache

Nova cadeia:

`stage75-f9412-vehicle-core`

Os módulos do Vehicle Core são gate crítico porque `lobby-lite.js` os importa estaticamente.

## Validação

- suíte F94.12: 14/14 PASS;
- JavaScript em `lobby/assets`: 163 arquivos, 0 erros sintáticos;
- referências locais de módulos: 463, 0 ausentes;
- referências locais do Service Worker: 115, 0 ausentes;
- `core/database`: 0 alterações;
- `core/edge-functions`: 0 alterações.

Suítes históricas selecionadas: 71/89 PASS. As 18 falhas são expectativas antigas amarradas a implementações/cache anteriores (por exemplo deslocamento manual inline F66, URLs `stageNN`, rover 2D com `31*dt/34*dt`, e tokens históricos de mundos). A suíte F94.12 substitui essas expectativas pelo novo contrato. Não apresentar a suíte histórica como 100% PASS.

## Limitação de validação

Não houve validação visual WebGL real nesta sessão. A integridade, imports, contratos e simulações de movimento foram verificados; sensação de direção, câmera e interação física ainda exigem smoke em navegador/máquina real.

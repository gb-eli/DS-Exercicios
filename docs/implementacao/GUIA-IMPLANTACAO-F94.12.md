# Guia de implantação — F94.12

## Base exigida

Aplicar o PATCH sobre a F94.11. Para ambiente incerto, utilizar o ZIP completo da F94.12.

## Cache esperado

Após publicação, o Service Worker deve usar:

`stage75-f9412-vehicle-core`

Se o navegador permanecer numa release anterior, utilizar o fluxo já existente de reparo/limpeza do Lobby.

## Smoke test recomendado

1. Abrir o Lobby e confirmar boot normal.
2. Abrir Campus 3D.
3. Testar AGV E-Car: entrar como motorista, acelerar, frear, dar ré, virar e sair.
4. Testar Shuttle/Van e confirmar comportamento de massa/limites diferente do carro.
5. Testar Drone e Helicóptero: decolar, subir, descer, girar, deslocar e pousar em heliponto antes de sair.
6. Alternar para Campus 2D e repetir um veículo terrestre e um aéreo.
7. Abrir Lua 3D e 2D e testar o Rover Lunar.
8. Abrir Marte 3D e 2D e testar o Rover Marciano.
9. Confirmar que pedestres continuam usando Locomotion V2 e que veículos não alteram a velocidade a pé.
10. Confirmar que Camera V2/Invert Y e Mirante continuam funcionando.

## Critério de rollback

Reverter para F94.11 caso apareça:

- boot quebrado;
- Campus 3D sem primeiro frame;
- veículo entrando em estado impossível de sair;
- posição do jogador corrompida ao abandonar veículo;
- regressão de Lua/Marte fora do modo rover.

## Rapier

Não instalar/configurar Rapier para esta fase. O adapter existe apenas como preparação de arquitetura e fallback. A ativação física será feita em release própria.

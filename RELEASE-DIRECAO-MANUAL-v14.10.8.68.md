# AGV World v14.10.8.68 — Direção manual

## Implementado

### Modo Motorista
- W / seta para cima: acelerar
- S / seta para baixo: frear; quando parado, engata ré
- A / D: esterçar
- Espaço: freio de mão
- E: sair do veículo
- No celular, o joystick controla aceleração/ré e direção; o botão de pulo vira **FREIO** enquanto estiver dirigindo.

### Painel do veículo
- velocidade atual em km/h
- marcha `D`, `R` ou `N`
- modo Motorista ou Carona
- instruções rápidas de controle

### Colisão
O veículo não atravessa os prédios conhecidos pelo masterplan e não sai dos limites do Campus.

### Carona
O modo Carona continua automático e segue a rota definida para cada veículo.

## Mantido
- Cinema AGV e tela de vídeo
- minimapa 3D
- monotrilho
- interiores sob demanda
- parkour, mirante e atrações
- clima e ciclo de horário existentes

## Não exige banco
Nenhuma migration nova e nenhum Edge Function novo.

## Próximas fases
- passageiros multiplayer sincronizados
- direção com tráfego/semáforos e colisão entre veículos
- veículos aéreos
- central de câmeras

## Validação final
- sintaxe de todos os JS do Lobby: PASS
- regressão selecionada: 21/21 PASS
- validação Cidade Viva / Mobilidade: PASS
- validação trilhos / monotrilho / montanha-russa: 20/20 PASS
- validação World Foundation F63A: 6/6 PASS

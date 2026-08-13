# COSMOS DS — Entrega da Fase 12

## Objetivo

Transformar o lançamento de foguetes em uma experiência visual, 3D/360° e controlável, mantendo separado o laboratório técnico da Fase 5.

## Novo laboratório

### Lançamentos Imersivos 360°

A experiência abre em tela cheia e reduz o texto permanente. O aluno escolhe um veículo, gira a câmera, entra em diferentes posições, realiza inspeções e acompanha o voo processado pelo Worker físico existente.

### Frota

- Aurora L — lançador leve;
- Atlas H — lançador pesado;
- Phoenix R — primeiro estágio reutilizável;
- Horizon STS — ônibus espacial didático com orbiter, tanque externo e propulsores laterais.

### Câmeras

- inspeção 360°;
- plataforma;
- motores;
- interior;
- perseguição;
- a bordo;
- primeiro estágio;
- cinematográfica.

### Controles

- mouse e toque para câmera;
- teclado;
- dois joysticks virtuais;
- Gamepad API;
- fullscreen;
- modo fotográfico;
- piloto de câmera automático.

### Efeitos gráficos

- ray marching adaptativo;
- materiais metálicos e proteção térmica;
- iluminação solar;
- atmosfera e estrelas;
- pluma de exaustão;
- fumaça apenas em atmosfera baixa;
- vapor e condensação;
- faíscas de ignição;
- detritos visuais na separação;
- vibração controlada em ignição e Max Q;
- fallback Canvas 2D.

### Fluxo

1. escolher veículo;
2. inspecionar casco;
3. inspecionar motores;
4. entrar na cabine e validar aviônica;
5. verificar plataforma;
6. autorizar lançamento;
7. acompanhar contagem, ignição, Max Q e separação;
8. alcançar órbita;
9. revisar o replay cinematográfico.

## Separação educacional

- `Engenharia de Foguetes`: cálculos, configuração, intertravamentos e falhas;
- `Lançamentos Imersivos 360°`: visual, inspeção, câmeras e voo cinematográfico.

Os dois módulos compartilham `RocketSystem`, `RocketFlightModel` e `launch.worker.js`.

## Progressão nova

| Experiência | XP |
|---|---:|
| Casco e proteção térmica | 120 |
| Motores e alimentação | 120 |
| Cabine e aviônica | 120 |
| Plataforma e corredor | 120 |
| Liberação operacional | 220 |
| Voo por veículo | 520 |

O voo de cada veículo possui identificador próprio e não duplica XP para a mesma experiência.

## Compatibilidade

- GitHub Pages;
- desktop e notebook;
- celular e tablet;
- teclado, mouse, toque e gamepad;
- WebGL2 com fallback 2D;
- perfis Desempenho, Equilibrado e Máxima experiência;
- redução de movimento.
